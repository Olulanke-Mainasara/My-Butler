# Homepage Visual Refresh (Round 2) — Design

## Context

This is the second sub-project of the broader home page / brand redesign (brand rename and hero-section text layout are separate, later specs; the Anticipated Events slider sub-project is already merged). This spec covers three related pieces, all on `app/page.tsx`:

1. A new editorial "brand story" section — 4 stacked image/big-text blocks — placed after "Diverse Collections."
2. Replacing the bento grid's reused, theme-variant screenshot images with distinct, sourced photography.
3. Repurposing the "How Butler A.I. works for you" section (same alternating card/image layout) into a "Featured Brands" spotlight using live brand data.

All three are grouped into one spec because they share a mechanism (sourcing/downloading stock photography) and are naturally reviewed together as one visual pass over the page.

## Goals

- Add a new `BrandStorySection` component: 4 blocks, each capped at `max-h-[900px]` and full viewport height (`md:h-screen`) on desktop. Each block is a 2×2 grid on desktop (3 image cells + 1 big-text cell, corner position rotating TL → TR → BL → BR across the 4 blocks) and text-then-image-carousel on mobile.
- Replace the bento grid's 5 shared, dark/light-variant images (reused across 7 tiles) with 7 distinct single images — one per tile (Butler A.I, Collections, Brands, News, Shop, Events, Camera) — dropping the light/dark variant pattern entirely for these photographic images.
- Repurpose "How Butler A.I. works for you" into "Featured Brands": same layout (alternating text-card + big image pairs, 2 rows), now driven by the `brands` data already fetched on this page (up to 4 brands), each showing name/description + a "Visit brand" button, paired with the brand's own `profile_picture` — no new stock images needed for this piece, since it's live data.
- Source ~19 free-to-use stock photos (12 for `BrandStorySection`, 7 for the bento grid) from a free-license provider (e.g. Unsplash) and commit them into the repo as placeholder imagery.

## Non-goals

- No changes to the hero carousel, the bento grid's tile links/copy/positions, the category switcher, "Diverse Collections," "Anticipated Events," or "Top Stories" sections.
- No brand rename or hero text-layout changes (separate specs).
- No new backend/data logic — `BrandStorySection` is static/editorial (no links, no live data); "Featured Brands" reuses the existing unpaginated `getBrands()` query already on this page, just adds a second consumer of it.
- Sourced images are explicitly placeholder/stock photography, not real brand photography — swapping them for real assets later is expected and out of scope here.

## Design

### 1. `BrandStorySection` (new component)

New file: `components/Custom-UI/BrandStorySection.tsx`. Self-contained — no props — rendered once in `app/page.tsx` immediately after the "Diverse Collections" section (`app/page.tsx:503` today) and before the repurposed "Featured Brands" section.

Internally defines 4 variants as local data: `{ text: string, images: [StaticImageData, StaticImageData, StaticImageData], textPosition: "top-left" | "top-right" | "bottom-left" | "bottom-right" }`. Draft placeholder copy (editable later):

1. "Curated Brands, Uncompromising Craft"
2. "Bold Design, African Roots"
3. "Style That Tells A Story"
4. "Discover Before Everyone Else"

**Desktop (`md:` and up):** each variant is a `div`/`section` sized `w-full max-h-[900px] md:h-screen`, laid out as a 2×2 CSS grid (`md:grid md:grid-cols-2 md:grid-rows-2`). Three cells render `next/image` `fill object-cover` with no overlay/no text (purely visual). The fourth cell — positioned per `textPosition` via grid placement classes — renders the big statement text, large and bold (`text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight`), on a solid background consistent with the site's existing accent-block styling (e.g. `bg-darkBackground dark:bg-lightBackground/50`, matching the bento grid's center "Discover, rock!" cell).

**Mobile (below `md`):** each variant instead renders the big text first (sized down, e.g. `text-4xl`), then a simple image carousel below showing that variant's 3 images — built directly from the existing `Carousel`/`CarouselContent`/`CarouselItem` primitives (`@/components/Shad-UI/carousel`), one plain image per slide. This is a purpose-built, minimal carousel (not the data/card-oriented `CarouselWithSlideTracker`), since it only needs to show 3 static images.

No links, no click targets, no live data — purely editorial/visual, per the confirmed direction.

### 2. Bento grid images

In `app/page.tsx`, the bento grid section (`app/page.tsx:329-503`) currently imports 5 image pairs (`ButlerAILight/Dark`, `CollectionsLight/Dark`, `EventsLight/Dark`, `NewsLight/Dark`, `ShopLight/Dark`) and selects between them via `theme === "light" ? X : Y`, with `ButlerAILight/Dark` additionally reused for both the "Brands" and "Camera" tiles (which have no dedicated image today).

This changes to 7 distinct single-image imports — one per tile (Butler A.I, Collections, Brands, News, Shop, Events, Camera) — each used directly with no theme branching. Since `theme`/`useTheme()` (`app/page.tsx:39,85`) is used *only* for these image ternaries and the ones in the "How Butler A.I. works" section (which is being replaced entirely, see below), both the `useTheme` import and the `theme` variable are removed from `app/page.tsx` as dead code once this and the section below are done.

### 3. "How Butler A.I. works for you" → "Featured Brands"

Same section (`app/page.tsx:549-719`), same structural layout (header row with heading + link; two rows of a `grid sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-3` alternating `[text-card, big-image, big-image, text-card]` pattern), but driven by brand data instead of fixed feature content:

- Heading changes to "Brands Worth <br /> Discovering." (matching the existing two-line big-heading style). The "see how it works ↓" decorative label becomes a real link: `<Link href="/brands">See all brands <ArrowRight /></Link>`.
- Takes `brands.slice(0, 4)` from the `brands` query already fetched on this page (`useQuery(getBrands())`, currently only consumed by the hero carousel) and renders up to 4 "feature" slots in the same alternating pattern, one brand per slot.
- Each slot's text-card shows: the brand's own `profile_picture` as the inline mobile image, `brand.name` as the card heading, `brand.description` (truncated, e.g. `line-clamp` for consistency) as the body copy, and a "Visit brand" button linking to `/brands/${brand.id}`. The paired big desktop image panel uses the same `brand.profile_picture`.
- If there are 0 brands, render the section's existing `Empty`-component convention (as used elsewhere on this page) instead of the grid. If there are 1-3 brands, only render as many card+image pairs as there are brands (partial rows are fine — omit the second row entirely if fewer than 3 brands, matching how the existing grid already tolerates fewer items via its responsive column spans).

### Image sourcing

19 images total, downloaded from a free-to-use stock photo source (Unsplash) into the repo:

- 12 for `BrandStorySection` (4 variants × 3 images) — editorial fashion/lifestyle themes (e.g. boutique/clothing racks, fabric/textile detail, portrait/street style, accessories), stored under a new `public/Pages/Home/brand-story/` directory.
- 7 for the bento grid tiles (one per concept: Butler A.I, Collections, Brands, News, Shop, Events, Camera), stored in `public/Pages/Home/`, replacing the existing dark/light PNG pairs there.

Exact photo selection happens during implementation (search + download); this spec fixes the count, themes, and destinations, not specific URLs.

## Testing

No automated test suite exists in this repo (confirmed in the prior sub-project). Verification is `tsc`/`lint` (no new errors beyond the documented pre-existing baseline) plus a manual browser pass: `BrandStorySection` renders correctly on desktop (2×2 grid, rotating text corner) and mobile (text + carousel); bento tiles show their new distinct images with no light/dark flicker; "Featured Brands" renders real brand data correctly, including its zero-brands empty state and partial-row cases.
