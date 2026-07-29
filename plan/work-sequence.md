# My Butler — Work Sequence

Living plan tracking the priority order for hardening the app before onboarding
real brands and customers. Created 2026-07-29 from an architecture review of
the codebase as of commit `f662822`.

Status legend: `[ ]` not started · `[~]` in progress · `[x]` done · `[!]` blocked

---

## 1. Security: RLS + role assignment lockdown

**Why first:** every read in `lib/fetches.ts` runs through the browser
Supabase client. The only thing standing between one user's data and another's
is Row Level Security. This has to be right before anyone real signs up.

**Confirmed finding (static code review, no DB access):**
`app/auth/signup/signup-form.tsx` sets `role_id` (2 = customer, 4 = brand)
directly inside the client-side `supabase.auth.signUp({ options: { data: {...} } })`
call. `user_metadata` set this way is attacker-controlled — anyone can call the
Supabase Auth REST API directly (bypassing the form entirely) and set
`role_id` to anything. There is no server-side trigger, auth hook, or edge
function in this repo enforcing/validating it. No `supabase/migrations`
directory exists in the repo at all, so schema and RLS policies aren't
version-controlled locally — meaning there is currently no way to review or
diff policy changes in code review.

**Tasks:**
- [x] Centralize role constants (`lib/roles.ts`, `ROLE_CUSTOMER` / `ROLE_BRAND`)
      and replace the bare `2` / `4` literals in `signup-form.tsx`,
      `login-form.tsx`, `proxy.ts`, `UserProvider.tsx`, `use-user-info.tsx` —
      pure hygiene, does not change behavior or close the actual hole below.
- [x] **Verified and fixed live, via Supabase MCP against project
      `lizntcmxpepbnqbmmfvk`.** RLS was enabled on every table, but the
      Postgres advisor + a direct `pg_policies` query showed it was
      substantially non-functional:
      - Every table's INSERT policy had `WITH CHECK (true)` — no ownership
        enforcement at all. Fixed: `bookmarks`/`camera_pictures`/`cart`/
        `chats`/`reviews` → `auth.uid() = user_id`; `brands`/`customers` →
        `auth.uid() = id`; `collections`/`events`/`news`/`products` →
        `auth.uid() = brand_id`. `categories` and `notifications` had their
        INSERT policy dropped with no replacement (no legitimate client-side
        insert path — categories is admin-managed, notifications are
        created by the `customers_insert_notify` trigger, which is
        `SECURITY DEFINER` and bypasses RLS regardless).
      - `cart`, `chats`, `customers`, `notifications` had SELECT policies
        with a bare `true` qualifier — any authenticated user (and, for
        `notifications`, any signed-out visitor, since its policy's role was
        `public`) could read every other user's cart, AI chat history,
        customer profile, or notifications. Rescoped all four to
        `auth.uid() = user_id` / `= id`. `chats` also had an unrestricted
        UPDATE policy (`USING (true)`); rescoped the same way.
      - `products`/`collections`/`events`/`news` had **no UPDATE or DELETE
        policy at all** — RLS defaults to deny with no matching policy, so
        not even the owning brand could save an edit or delete their own
        listing. This is exactly what the brand-dashboard edit pages built
        in the previous pass need; added owner-scoped UPDATE/DELETE
        (`auth.uid() = brand_id`) to all four.
      - Pinned `search_path = ''` on all six `SECURITY DEFINER` functions
        (`function_search_path_mutable` advisor warning).
      - Re-ran `get_advisors` after: all `rls_policy_always_true` (13) and
        `function_search_path_mutable` (6) warnings are gone. What remains
        is expected noise (GraphQL schema-visibility warnings for tables
        that are legitimately public or now correctly RLS-scoped) plus two
        items below that aren't SQL-fixable.
- [x] **Fixed the actual role/ownership hole in the RPCs**, not just the
      table policies: `update_customer_details` and `update_brand_details`
      took `_supabase_user_id` as a caller-supplied argument and updated
      that row with **zero check that the caller was that user** — and both
      were callable by the `anon` role, so this was an unauthenticated way
      to overwrite any customer's or brand's profile. Added
      `IF auth.uid() != _supabase_user_id THEN RAISE EXCEPTION` to both.
- [x] **Two more concrete bugs found and fixed while in here, unrelated to
      the security review but blocking real functionality:**
      - `handle_new_user()` (the `AFTER INSERT ON auth.users` trigger that
        creates the `customers`/`brands` row on signup) inserted into
        `brands.contact_no`, a column that doesn't exist — the column is
        `contact`. This threw on every brand signup, which the trigger's own
        exception handler re-raised, rolling back the whole signup
        transaction. **Brand signup was completely broken in production**
        until this was fixed.
      - `toggle_bookmark()` operated on the `cart` table instead of
        `bookmarks`, and referenced `target_id`/`target_type` columns that
        only exist on `bookmarks` — every bookmark attempt threw `column
        target_id does not exist`. Bookmarking did not work at all. Fixed to
        target `bookmarks`.
- [x] Pulled the DB schema + policy history into `supabase/migrations/`: a
      best-effort baseline reconstruction of the full schema as it stood
      before this session's fixes, plus the six fix migrations reproduced
      verbatim with their real Supabase-assigned versions/names. Not a
      perfect `pg_dump` (indexes beyond PK/UNIQUE weren't captured, and one
      trigger's table attachment is inferred, not re-verified — both noted
      in the file's header comment) but the schema and its history are now
      reviewable by reading the repo instead of only by querying the live
      project.
- [!] **Not SQL-fixable, needs manual action in the Supabase dashboard:**
      Postgres 15.8.1.121 has outstanding security patches
      (Database → Settings → Infrastructure → upgrade); leaked-password
      protection (HaveIBeenPwned check) is disabled (Authentication →
      Policies → Password settings).

All migrations were applied via `mcp__Supabase__apply_migration` against
project `lizntcmxpepbnqbmmfvk` (My-Butler) and verified afterward with
`get_advisors` and a direct `pg_policies` query — not just applied blind.

---

## 2. Brand onboarding model

**Why second:** this is a product decision, not just an implementation detail
— it determines whether an admin role/approval queue needs to exist before
launch, and it changes the signup flow and data model (a `status` field on
`brands`, most likely).

**Current state:** fully open self-serve. `role_id = 4` at signup grants
immediate, live access to `/brand-dashboard` — no review step, no admin
concept anywhere in the codebase (`role_id` only has 2 and 4 defined).

**Decision: hybrid.** Brands keep immediate self-serve dashboard access;
their public-facing listings stay hidden until an admin approves them.

**Tasks:**
- [x] `brands.status` (`pending`/`approved`/`rejected`, default `pending`).
- [x] Admin status via a dedicated `admins` table with **no INSERT policy
      for any client role** — deliberately not a self-assignable `role_id`,
      since that would reopen the exact class of hole just closed on
      `role_id` 2/4 (client-writable `user_metadata` at signup). Admin
      status can only be granted with direct database access. A short SQL
      snippet to seed the first admin is in the summary below — the
      `admins` table is currently empty.
- [x] `update_brand_status(_brand_id, _status)` RPC checks the caller
      against `admins` before changing anything, and notifies the brand of
      the decision via the existing `notifications` table.
- [x] Public SELECT on `brands`/`products`/`collections`/`events`/`news`
      rewritten to `status = 'approved' OR auth.uid() = brand_id` — a
      pending brand still sees and can manage its own catalog; nobody else
      sees it until approved.
- [x] `/admin` — lists pending brands with approve/reject, gated both
      client-side (checks `admins` membership, shows "Not authorized"
      otherwise) and in `proxy.ts` middleware (queries `admins` directly
      server-side, not a JWT claim).
- [x] Pending/rejected banner in the brand-dashboard layout — explains that
      the brand can keep building but customers won't see it yet.
- [!] **Blocked on the same Supabase MCP approval gate as item 4** — this
      migration (`add_brand_status_and_admin_review`) is written and
      retried repeatedly but hasn't gone through yet. All the application
      code above is written against this schema and will start working the
      moment it applies; until then, `brandProfile.status` reads will 400
      against the live DB (the column doesn't exist yet), and `/admin` /
      the pending banner won't function.
- [ ] Not done: an "application submitted" distinct step at signup, and a
      sidebar link to `/admin` for discoverability (it's reachable by URL
      but not linked from anywhere in the nav yet).

---

## 3. Cache invalidation strategy for catalog data

**Why:** `ReactQueryClientProvider` sets `staleTime: Infinity` /
`gcTime: Infinity` globally. Only the `notifications` table has a realtime
subscription (`hooks/use-user-info.tsx`). Nothing refreshes `products`,
`collections`, `events`, or `news` after first load — a brand adding a
product won't be visible to already-loaded customer sessions.

**Tasks:**
- [x] Global `staleTime` changed from `Infinity` to 2 minutes (`gcTime` from
      `Infinity` to 10 minutes) in `ReactQueryClientProvider`.
- [x] Extended the realtime-invalidation pattern already used for
      `notifications` to `products`, `collections`, `events`, `news`, and
      `brands` — new `useCatalogRealtime()` in `hooks/use-user-info.tsx`,
      subscribed unconditionally (not gated on login, since catalog browsing
      is public). Uses a new shared `invalidateTable()` helper
      (`lib/utils.ts`) instead of duplicating the predicate per table.
- [x] Added direct `invalidateTable()` calls after the four brand-dashboard
      "create" mutations (products/collections/events/articles `new` pages)
      as a fallback — **realtime `postgres_changes` only fires if a table is
      added to Supabase's `supabase_realtime` publication, which I couldn't
      verify without DB access, so don't rely on the realtime piece alone.**
- [!] Update/delete mutations aren't covered because they don't exist yet —
      see the new finding under Backlog: the `[slugAndId]` brand-dashboard
      "edit" pages for products/collections/events aren't actually edit
      forms.

---

## 4. Checkout / payments

**Why:** `cart` and `toggle_cart` exist, but no payment integration or
checkout flow was found anywhere in `app/`. Without this, brands have no way
to actually sell and customers have no way to actually buy — this is the gap
between "demo" and "marketplace."

**Decision: Stripe, full flow** — cart review through order records, not
just a payment button.

**Finding along the way:** `/cart`'s `CartItemCard` was a complete stub — a
bare `<div>` with a `console.log`, and both call sites (the `/cart` page and
the nav's `CartDrawerTrigger` drawer/dialog) called it with no props at all,
discarding the cart item entirely. This had to be built for real before
"checkout" meant anything.

**Tasks:**
- [x] `CartItemCard` rebuilt — product image/name/price, quantity +/-, and
      remove, wired to real mutations. Both call sites fixed to hydrate cart
      rows against `products` and pass real data.
- [x] `cart` had no UPDATE/DELETE policy (only INSERT/SELECT) — added both,
      owner-scoped, since quantity edits and removal need them.
- [x] `orders` / `order_items` tables. The checkout API route
      (`app/api/checkout/route.ts`) creates a `pending` order under the
      customer's own session — prices and stock come from the DB
      server-side, never trusted from the client — then creates a Stripe
      Checkout Session with the order id in `metadata` and returns the
      redirect URL.
- [x] Stripe webhook (`app/api/stripe/webhook/route.ts`) — verifies the
      signature, flips the order to `paid` on `checkout.session.completed`,
      clears the customer's cart, sends a notification;
      `checkout.session.expired` cancels the pending order. Runs on a new
      service-role Supabase client (`lib/supabase/service.ts`) since a
      webhook has no user session to authenticate as.
- [x] `/orders/[id]` confirmation page; `/brand-dashboard/orders` lists paid
      line items belonging to that brand.
- [x] Full production build (`next build`) verified end to end with dummy
      env vars — every new route compiles and renders.
- [!] **Two migrations (`add_orders_and_cart_write_policies` for this item,
      `add_brand_status_and_admin_review` for item 2) are written and
      correct but stuck behind a persistent Supabase MCP approval gate**
      (`MCP error -32003: MCP tool call requires approval`) that didn't
      clear despite many retries across this session. All the application
      code is written against this schema and is ready to work the moment
      these two apply — checkout will 500 (orders/order_items don't exist
      yet) and cart quantity edits/removal will fail until they do.
      **Needs:** whatever approves pending Supabase MCP tool calls on your
      end, then re-running these two (they're in
      `supabase/migrations/`, ready to apply as-is).
- [ ] Needs before this works in a real deployment, beyond the two
      migrations above: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` (from a
      webhook endpoint registered in the Stripe dashboard pointing at
      `/api/stripe/webhook`), and `SUPABASE_SERVICE_ROLE_KEY` as env vars.
- [ ] Not done: refunds/cancellations, shipping address collection,
      multi-currency, tax calculation — this is a working baseline, not a
      complete commerce feature set.

---

## 5. Catalog pages: pagination + server rendering

**Why:** `app/page.tsx` is `"use client"` and fetches entire tables with
`select("*")` and no limit for products/collections/events/news/brands. Fine
at seed-data scale; breaks (slow first paint, no SEO, large payloads) once
brand catalogs grow.

**Tasks:**
- [x] Added optional `{ page, pageSize }` params (`PageParams`, backed by a
      shared `paginate()` helper using `.range()`) to `getProducts`,
      `getCollections`, `getEvents`, `getArticles`, `getBrands` in
      `lib/fetches.ts`. Backward compatible — calling with no args still
      fetches the full table exactly as before, so the many existing
      `getX().eq(...)` chained call sites (brand-dashboard list pages, detail
      pages) are untouched.
- [x] Wired the pattern into `/shop` as the reference implementation: a
      `visibleCount` state seeded at `DEFAULT_PAGE_SIZE` (24), a "Load more"
      button that grows it, `hasMoreProducts` heuristic based on whether the
      last page came back full.
- [x] Extended the same pattern to `/collections`, `/events`, `/news` — same
      `visibleCount` + `pageSize` + "Load more" shape as `/shop`.
      `/collections` has no plain grid section (its listing is carousel-only
      via `CarouselWithSlideTracker`/`NormalCarousel`/`CarouselWithSubCarousel`),
      so its Load more control lives in its own section after the existing
      carousels rather than inside a `.map()` grid like the other three.
- [x] Extended to the homepage (`app/page.tsx`) too, one `visibleCount` per
      resource rather than one shared state, since each feeds a different
      section: `collections` → category-switcher carousel + "Diverse
      Collections" grid (Load more on the grid); `events` → switcher +
      "Anticipated Events" horizontal scroller, which has a fixed-height
      layout, so its Load more sits just below the section instead of
      inside the fixed-height flex column; `news` → switcher + "Top
      Stories" grid (Load more on the grid). `products` only feeds the
      switcher carousel with no dedicated listing section on this page, so
      it's capped at `DEFAULT_PAGE_SIZE` with no Load more control —
      `/shop` already owns the full paginated product experience. `brands`
      stays unpaginated; it's only used for the hero carousel's dot count,
      never rendered as a list.
- [x] **All five catalog-consuming pages now use the pattern** — `/shop`,
      `/collections`, `/events`, `/news`, and the homepage.
- [ ] Server-rendering the initial catalog fetch (currently everything is
      still `"use client"`) is unstarted — larger structural change than fit
      in this pass, and would need to preserve the framer-motion/embla
      carousel interactivity that depends on client state.

---

## Backlog

- **6. AI Butler tool-calling — DONE.** `app/api/chat/route.ts` system
  prompt was a generic `"You are a helpful assistant."` with no access to
  product/brand/event data. Added four AI SDK tools
  (`app/api/chat/tools.ts`: search products/collections/events/brands, each
  a bounded name-filtered query against the live tables — no DB dependency,
  works today), wired into `streamText` with `stopWhen: stepCountIs(5)`, and
  a system prompt that identifies the assistant, instructs it to use the
  tools rather than invent results, and specifies the exact markdown link
  format so recommendations render as clickable links in the existing chat
  UI (which already renders markdown links and silently skips non-text
  message parts — no UI changes needed).

- **7. Brand-dashboard "edit" pages don't edit anything — FIXED.**
  `app/brand-dashboard/{products,collections,events,articles}/[slugAndId]/page.tsx`
  used to render the same read-only detail view as the public storefront
  (products even shipped an "Add to Cart" button inside the brand's own
  dashboard). Rebuilt all four:
  - [x] Extracted each entity's `new/page.tsx` form into a shared
        `<entity>-form.tsx` component taking an optional `initialData` prop,
        used by both the `new` page (create) and the `[slugAndId]` page
        (edit) — `product-form.tsx`, `collection-form.tsx`, `event-form.tsx`,
        `article-form.tsx`.
  - [x] `[slugAndId]` pages now fetch the record, check
        `record.brand_id === brandProfile.id` before rendering (client-side
        guard only — see caveat below), render the form pre-filled, and add
        a "Danger Zone" delete section with an `AlertDialog` confirmation.
  - [x] Fixed `getCategories().eq("brand_id", ...)` in the product/collection
        forms — `categories` has no `brand_id` column at all, so this filter
        was always returning zero rows and the category dropdown was
        permanently empty in both create and (now) edit mode.
  - [x] Added `getProductForEdit` / `getCollectionForEdit` to
        `lib/fetches.ts` — `getProduct`/`getCollection` embed the category
        relation (`category_id (name)`) for display, which isn't the numeric
        value an edit form's `<select>` needs.
  - [x] **Separate bug found and fixed while wiring this up:** every card
        component (`ProductCard`, `CollectionCard`, `EventCard`,
        `ArticleCard`) linked to the wrong place from inside the brand
        dashboard — `ProductCard`/`ArticleCard` pointed at nonexistent
        top-level routes (`/products/...`, `/articles/...`), and
        `CollectionCard`/`EventCard` didn't branch on `/brand-dashboard` at
        all, always linking to the public page. Brands could not have
        reached the new edit pages by clicking their own items without this
        fix.
  - [x] **Caveat resolved.** The client-side `brand_id` check on each edit
        page was never the real security boundary — and until the item 1
        fix, it was the *only* thing stopping a crafted direct API call,
        because `products`/`collections`/`events`/`news` had no RLS
        UPDATE/DELETE policy at all. Both problems are fixed now: the DB
        enforces `auth.uid() = brand_id` on UPDATE/DELETE independently of
        the client check, and (separately) RLS previously blocked these
        tables' UPDATE/DELETE entirely, which means the Save/Delete buttons
        built in this pass would have silently no-opped against the live
        database until the item 1 migrations were applied.
  - [ ] Not done: storage cleanup on delete (deleting a product/collection/
        event/article leaves its uploaded images in the Supabase Storage
        bucket) — left out to keep this pass scoped to the missing CRUD
        itself.

- **8. Homepage content refurbish — DONE.** Two sections weren't placeholder
  text so much as actually broken/unrelated content:
  - [x] The hero carousel had zero slides — an empty `<CarouselContent>`
        with dot indicators sized to `brands.length` pointing at nothing.
        Replaced with a real brand-spotlight carousel using the `brands`
        data already fetched on the page (image, name, description, link to
        `/brands/{id}`), with a logo/tagline fallback slide for when there
        are no brands yet.
  - [x] "Transform Your Business at Texcellence 2025" was wholesale
        unrelated conference-landing-page content — Keynotes/Panel
        Sessions/Networking/Live Demos, generic B2B copy, the same
        `ButlerAIDark` image repeated 8 times, and four "View the Agenda"
        buttons linking to `/agenda`, a route confirmed not to exist
        anywhere in the app (dead link). Replaced with "How Butler A.I
        works for you" using the identical grid structure (content-only
        swap, responsive layout untouched) showing the app's real four
        pillars — Butler A.I, Shop, Collections, Events — each linking to
        its real route, using the theme-aware images already imported for
        the tile grid above rather than new assets.

- **9. Server-rendering the catalog pages — deliberately deferred.**
  Explicitly the item flagged as riskiest to do well: `/shop`, `/collections`,
  `/events`, `/news`, and the homepage are all `"use client"` and built
  around `useTheme`, `useIsMobile`, embla carousel refs, and framer-motion
  state that assume a client render. Converting the initial data fetch to
  the server while preserving that interactivity is a real architectural
  change, not a content or query tweak, and doing it carelessly on top of
  everything else in this pass risked breaking the app's most-visited pages
  with no way to catch it before a real browser test. Not attempted this
  session — worth its own focused pass with browser verification, not a
  tack-on to a session already touching this much surface area.
