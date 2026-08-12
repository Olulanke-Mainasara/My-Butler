# Homepage Visual Refresh (Round 2) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a new editorial `BrandStorySection` after "Diverse Collections," replace the bento grid's reused theme-variant images with distinct sourced photography, and repurpose "How Butler A.I. works for you" into a "Featured Brands" spotlight driven by live brand data.

**Architecture:** One new presentational component (`BrandStorySection`) with no props, rendered once in `app/page.tsx`. Two existing `app/page.tsx` sections get their image sourcing and content model changed in place. A one-time asset-sourcing task downloads the 19 photos every later task depends on by fixed file path.

**Tech Stack:** Next.js (App Router), React, TypeScript, Tailwind CSS, `next/image` static imports, the existing `Carousel` primitives (`components/Shad-UI/carousel.tsx`), `@supabase-cache-helpers/postgrest-react-query`.

## Global Constraints

- No automated test suite exists in this repo. Verification is `npx tsc --noEmit` (must stay clean) and `npm run lint` (repo has a documented pre-existing baseline of errors/warnings in unrelated files — confirm the current baseline yourself with `npm run lint` before starting, since it may have shifted since this plan was written; the bar for every task is "introduces no new errors/warnings," not "repo-wide zero").
- `BrandStorySection` has no links and consumes no live data — purely static/editorial, per spec.
- "Featured Brands" reuses the existing unpaginated `const { data: brands } = useQuery(getBrands());` already in `app/page.tsx` — do not add a second/duplicate brands query.
- Sourced images must come from a free-to-use-commercially stock source (Unsplash or equivalent license) — do not use images without a clear free-commercial-use license.
- Task 1 must complete (all 19 files present at their fixed paths) before Tasks 2 and 3 can be implemented, since both import specific files by path. Task 4 does not depend on Task 1, but must run after Task 3 (Task 4's cleanup step removes image imports that Task 3 also touches — see Task 4).

---

### Task 1: Source and download 19 stock photos

**Files:**
- Create: `public/Pages/Home/butler-ai.jpg`
- Create: `public/Pages/Home/collections.jpg`
- Create: `public/Pages/Home/brands.jpg`
- Create: `public/Pages/Home/news.jpg`
- Create: `public/Pages/Home/shop.jpg`
- Create: `public/Pages/Home/events.jpg`
- Create: `public/Pages/Home/camera.jpg`
- Create: `public/Pages/Home/brand-story/variant-1-a.jpg`, `variant-1-b.jpg`, `variant-1-c.jpg`
- Create: `public/Pages/Home/brand-story/variant-2-a.jpg`, `variant-2-b.jpg`, `variant-2-c.jpg`
- Create: `public/Pages/Home/brand-story/variant-3-a.jpg`, `variant-3-b.jpg`, `variant-3-c.jpg`
- Create: `public/Pages/Home/brand-story/variant-4-a.jpg`, `variant-4-b.jpg`, `variant-4-c.jpg`

**Interfaces:**
- Produces: 19 real JPEG files at the exact paths above. Tasks 2 and 3 `import` these by path via Next.js static image imports (`import Foo from "@/public/Pages/Home/foo.jpg"`), so the paths and filenames must match exactly.

- [ ] **Step 1: Verify network access before searching**

Run: `curl -sS -m 10 -o /dev/null -w "%{http_code}\n" https://images.unsplash.com`

Expected: `200`. If this fails (timeout, DNS error, non-200), **stop immediately and report BLOCKED** with the exact error — do not retry repeatedly or spend the task budget fighting a network wall. This environment has previously had contexts (e.g. inside a git worktree browser session) where external DNS resolution silently failed; the controller needs to know immediately if that's the case here so it can source the images itself and hand you the files instead.

- [ ] **Step 2: Search for and identify source images**

For each destination file below, use web search to find a free-to-use (Unsplash License or equivalent — free for commercial use, no permission required) photo matching the theme, at least 1200px on its shortest side, landscape or square orientation:

| File | Theme |
|---|---|
| `public/Pages/Home/butler-ai.jpg` | Personal styling / fashion assistant vibe — e.g. someone browsing fashion on a phone, or an elegant personal shopping moment |
| `public/Pages/Home/collections.jpg` | Curated clothing collection — folded garments or a styled clothing rack |
| `public/Pages/Home/brands.jpg` | Boutique storefront or a close-up of a brand/clothing tag |
| `public/Pages/Home/news.jpg` | Fashion magazine/editorial flat-lay |
| `public/Pages/Home/shop.jpg` | Shopping bags or retail/checkout moment |
| `public/Pages/Home/events.jpg` | Runway or fashion show |
| `public/Pages/Home/camera.jpg` | Photography/OOTD styled-photo concept |
| `public/Pages/Home/brand-story/variant-1-*.jpg` (3 images) | Boutique interior / clothing racks close-up |
| `public/Pages/Home/brand-story/variant-2-*.jpg` (3 images) | Fabric / textile / print detail |
| `public/Pages/Home/brand-story/variant-3-*.jpg` (3 images) | Portrait / street style |
| `public/Pages/Home/brand-story/variant-4-*.jpg` (3 images) | Accessories / jewelry flat-lay |

For each Unsplash photo page you find, the direct downloadable image URL is typically in the page's `og:image` meta tag or an `images.unsplash.com/photo-...` URL visible in the page content — use WebFetch on the photo's page to extract it if it's not obvious from search results alone.

- [ ] **Step 3: Download each image**

For each of the 19 files, download the identified direct image URL to its exact destination path, e.g.:

```bash
mkdir -p public/Pages/Home/brand-story
curl -sS -L -m 30 -o public/Pages/Home/butler-ai.jpg "<direct-image-url>"
```

(repeat for all 19 files with their respective URLs and destination paths)

- [ ] **Step 4: Verify every downloaded file is a real, valid image**

Run: `file public/Pages/Home/*.jpg public/Pages/Home/brand-story/*.jpg`

Expected: every line reports a valid image type (e.g. `JPEG image data`), not `HTML document` or `empty`. Also confirm every file is reasonably sized (`ls -la` — expect roughly 50KB-10MB each; a file under a few KB is almost always a downloaded error page, not a real photo). Re-download any file that fails this check with a different source URL.

- [ ] **Step 5: Commit**

```bash
git add public/Pages/Home/butler-ai.jpg public/Pages/Home/collections.jpg public/Pages/Home/brands.jpg public/Pages/Home/news.jpg public/Pages/Home/shop.jpg public/Pages/Home/events.jpg public/Pages/Home/camera.jpg public/Pages/Home/brand-story/
git commit -m "feat: source stock photography for homepage visual refresh"
```

---

### Task 2: Create `BrandStorySection` and render it on the home page

**Files:**
- Create: `components/Custom-UI/BrandStorySection.tsx`
- Modify: `app/page.tsx` (add import, add one render call)

**Interfaces:**
- Consumes: the 12 `public/Pages/Home/brand-story/*.jpg` files from Task 1.
- Produces: `export default function BrandStorySection()` — a no-props component. Rendered as `<BrandStorySection />` in `app/page.tsx`.

- [ ] **Step 1: Write the component**

```tsx
import Image from "next/image";
import Variant1A from "@/public/Pages/Home/brand-story/variant-1-a.jpg";
import Variant1B from "@/public/Pages/Home/brand-story/variant-1-b.jpg";
import Variant1C from "@/public/Pages/Home/brand-story/variant-1-c.jpg";
import Variant2A from "@/public/Pages/Home/brand-story/variant-2-a.jpg";
import Variant2B from "@/public/Pages/Home/brand-story/variant-2-b.jpg";
import Variant2C from "@/public/Pages/Home/brand-story/variant-2-c.jpg";
import Variant3A from "@/public/Pages/Home/brand-story/variant-3-a.jpg";
import Variant3B from "@/public/Pages/Home/brand-story/variant-3-b.jpg";
import Variant3C from "@/public/Pages/Home/brand-story/variant-3-c.jpg";
import Variant4A from "@/public/Pages/Home/brand-story/variant-4-a.jpg";
import Variant4B from "@/public/Pages/Home/brand-story/variant-4-b.jpg";
import Variant4C from "@/public/Pages/Home/brand-story/variant-4-c.jpg";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/Shad-UI/carousel";
import type { StaticImageData } from "next/image";

type TextPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";

type Variant = {
  text: string;
  images: [StaticImageData, StaticImageData, StaticImageData];
  textPosition: TextPosition;
};

const variants: Variant[] = [
  {
    text: "Curated Brands, Uncompromising Craft",
    images: [Variant1A, Variant1B, Variant1C],
    textPosition: "top-left",
  },
  {
    text: "Bold Design, African Roots",
    images: [Variant2A, Variant2B, Variant2C],
    textPosition: "top-right",
  },
  {
    text: "Style That Tells A Story",
    images: [Variant3A, Variant3B, Variant3C],
    textPosition: "bottom-left",
  },
  {
    text: "Discover Before Everyone Else",
    images: [Variant4A, Variant4B, Variant4C],
    textPosition: "bottom-right",
  },
];

const textPositionClasses: Record<TextPosition, string> = {
  "top-left": "md:col-start-1 md:row-start-1",
  "top-right": "md:col-start-2 md:row-start-1",
  "bottom-left": "md:col-start-1 md:row-start-2",
  "bottom-right": "md:col-start-2 md:row-start-2",
};

function ImageCell({ image, alt }: { image: StaticImageData; alt: string }) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <Image src={image} alt={alt} fill sizes="50vw" className="object-cover" />
    </div>
  );
}

function TextCell({ text, textPosition }: { text: string; textPosition: TextPosition }) {
  return (
    <div
      className={`flex items-center justify-center bg-darkBackground p-8 text-center dark:bg-lightBackground/50 ${textPositionClasses[textPosition]}`}
    >
      <p className="text-4xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl dark:text-black">
        {text}
      </p>
    </div>
  );
}

function BrandStoryBlock({ text, images, textPosition }: Variant) {
  return (
    <div className="w-full max-h-[900px] md:h-screen">
      {/* Desktop: 2x2 grid */}
      <div className="hidden h-full w-full md:grid md:grid-cols-2 md:grid-rows-2">
        <TextCell text={text} textPosition={textPosition} />
        {images.map((image, index) => (
          <ImageCell key={index} image={image} alt={text} />
        ))}
      </div>

      {/* Mobile: text, then image carousel */}
      <div className="flex h-full w-full flex-col justify-center gap-6 px-4 py-16 md:hidden">
        <p className="text-center text-4xl font-semibold tracking-tight">{text}</p>
        <Carousel opts={{ align: "start", loop: true }} className="w-full">
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index} className="basis-[85%]">
                <div className="relative h-64 w-full overflow-hidden rounded-xl">
                  <Image
                    src={image}
                    alt={text}
                    fill
                    sizes="85vw"
                    className="object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
}

export default function BrandStorySection() {
  return (
    <section>
      {variants.map((variant) => (
        <BrandStoryBlock key={variant.text} {...variant} />
      ))}
    </section>
  );
}
```

Note: the desktop grid relies on CSS grid auto-placement filling the 3 non-text cells around the explicitly-positioned `TextCell` (placed via `md:col-start-*`/`md:row-start-*`). Because `TextCell` is the only explicitly-positioned item, the grid's default row-major auto-placement scans cells in order and skips the one `TextCell` already occupies, so the 3 `ImageCell`s always land cleanly in the remaining 3 cells for all four corner positions — no explicit placement needed on the image cells. Still confirm this visually in the manual browser check in Step 3 below.

- [ ] **Step 2: Add the render call to `app/page.tsx`**

Add the import near the other Custom-UI component imports:

```tsx
import BrandStorySection from "@/components/Custom-UI/BrandStorySection";
```

Find the "Diverse Collections" section's closing `</section>` tag (search for `Diverse Collections` — it's currently around `app/page.tsx:503-547`) and insert immediately after it, before the next section (currently the "How Butler A.I. works for you" section):

```tsx
      <BrandStorySection />
```

- [ ] **Step 3: Type-check, lint, and manually verify**

Run `npx tsc --noEmit` and `npm run lint` from the repo root — must introduce no new errors/warnings.

Run `npm run dev` and check in a browser:
- Desktop viewport (≥768px): each of the 4 blocks shows a clean 2×2 grid (no overlapping cells, no gaps), the text cell sits in the corner specified for that variant (top-left, top-right, bottom-left, bottom-right in that order down the page), and each block is capped visually at 900px tall even on a very tall browser window.
- Mobile viewport (<768px): each block shows the big text first, then a swipeable carousel of that block's 3 images below it.
- No console errors.

- [ ] **Step 4: Commit**

```bash
git add components/Custom-UI/BrandStorySection.tsx app/page.tsx
git commit -m "feat: add BrandStorySection after Diverse Collections"
```

---

### Task 3: Replace bento grid images with sourced photography

**Files:**
- Modify: `app/page.tsx` (bento grid section only, currently `app/page.tsx:329-503`)

**Interfaces:**
- Consumes: the 7 `public/Pages/Home/*.jpg` files from Task 1.
- Produces: nothing consumed by later tasks in code, but Task 4 depends on this task running first (see Task 4's Step 4).

- [ ] **Step 1: Replace the image imports**

At the top of `app/page.tsx`, replace these 10 imports:

```tsx
import ButlerAIDark from "@/public/Pages/Home/butler-ai-dark.png";
import ButlerAILight from "@/public/Pages/Home/butler-ai-light.png";
import CollectionsDark from "@/public/Pages/Home/collections-dark.png";
import CollectionsLight from "@/public/Pages/Home/collections-light.png";
import EventsDark from "@/public/Pages/Home/events-dark.png";
import EventsLight from "@/public/Pages/Home/events-light.png";
import NewsDark from "@/public/Pages/Home/news-dark.png";
import NewsLight from "@/public/Pages/Home/news-light.png";
import ShopDark from "@/public/Pages/Home/shop-dark.png";
import ShopLight from "@/public/Pages/Home/shop-light.png";
```

with these 7:

```tsx
import ButlerAIImage from "@/public/Pages/Home/butler-ai.jpg";
import CollectionsImage from "@/public/Pages/Home/collections.jpg";
import BrandsImage from "@/public/Pages/Home/brands.jpg";
import NewsImage from "@/public/Pages/Home/news.jpg";
import ShopImage from "@/public/Pages/Home/shop.jpg";
import EventsImage from "@/public/Pages/Home/events.jpg";
import CameraImage from "@/public/Pages/Home/camera.jpg";
```

**Do not remove `import { useTheme } from "next-themes";` or `const { theme } = useTheme();` yet** — the "How Butler A.I. works for you" section (Task 4) still uses `theme` at this point in the sequence; removing it now would break that section until Task 4 runs.

- [ ] **Step 2: Update each bento tile's `Image` `src`**

In the bento grid section (`grep -n 'grid grid-cols-2 md:grid-cols-6' app/page.tsx` to relocate it if line numbers have shifted), replace each tile's image `src` — every current usage is `src={theme === "light" ? XLight : XDark}` — with the single new image, and give each tile its own dedicated image instead of the two tiles that currently reuse `ButlerAILight/Dark`:

- "Butler A.I" tile (links to `/butler`): `src={ButlerAIImage}`
- "Collections" tile (links to `/collections`): `src={CollectionsImage}`
- "Brands" tile (links to `/brands`, currently reuses the Butler A.I image): `src={BrandsImage}`
- "News"/"Latest" tile (links to `/news`): `src={NewsImage}`
- "Shop" tile (links to `/shop`): `src={ShopImage}`
- "Events" tile (links to `/events`): `src={EventsImage}`
- "Camera" tile (links to `/camera`, currently reuses the Butler A.I image): `src={CameraImage}`

Each tile keeps its existing `className` (e.g. `"h-full object-cover scale-150"` or `"h-full w-full object-cover object-right"`) and `alt` text unchanged — only the `src` values change, from a `theme === "light" ? X : Y` ternary to the single new image constant.

- [ ] **Step 3: Type-check, lint, and manually verify**

Run `npx tsc --noEmit` and `npm run lint` — must introduce no new errors/warnings (the file will still have the pre-existing `theme`-related warnings from elsewhere until Task 4, that's expected).

Run `npm run dev` and check in a browser: all 7 bento tiles show their new distinct images (no two tiles show the same photo anymore), and toggling light/dark mode no longer changes any bento tile's image (since these are no longer theme-variant).

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "feat: replace bento grid images with sourced photography"
```

---

### Task 4: Repurpose "How Butler A.I. works for you" into "Featured Brands"

**Files:**
- Modify: `app/page.tsx` (the section currently at `app/page.tsx:549-719`, plus final cleanup of now-fully-unused imports/hook)

**Interfaces:**
- Consumes: `brands` from the existing `const { data: brands } = useQuery(getBrands());` (already in the file) — this task additionally destructures `isLoading` from that same query call: `const { data: brands, isLoading: isLoadingBrands } = useQuery(getBrands());`.
- Produces: nothing consumed by later tasks — this is the final piece of the plan.

- [ ] **Step 1: Update the brands query to expose loading state, and import the `Brand` type**

Find `const { data: brands } = useQuery(getBrands());` and change it to:

```tsx
const { data: brands, isLoading: isLoadingBrands } = useQuery(getBrands());
```

Add this import near the other type imports (or near the top-level imports if this file has none yet — check with `grep -n "^import type\|from \"@/types" app/page.tsx`):

```tsx
import { Brand } from "@/types/Brand";
```

- [ ] **Step 2: Replace the section**

Find the section starting with `<section className="min-h-screen flex items-center justify-center">` (containing the "How Butler A.I works for you." heading) and replace its entire contents with:

```tsx
      <section className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-(--breakpoint-xl) mx-auto px-4 md:px-5">
          <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-tighter">
              Brands Worth <br />
              Discovering.
            </h2>
            <Link
              href="/brands"
              className="uppercase flex items-center gap-2 font-semibold"
            >
              see all brands{" "}
              <ArrowRight className="text-brandLight dark:text-brandDark" />
            </Link>
          </div>

          {isLoadingBrands ? (
            <LoadingSkeleton
              length={1}
              height="h-[600px] md:h-[750px]"
              className="md:grid-cols-1 mt-8"
            />
          ) : !brands || brands.length === 0 ? (
            <Empty className="border mt-8">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Factory />
                </EmptyMedia>
                <EmptyTitle>No brands yet</EmptyTitle>
                <EmptyDescription>
                  Vetted brands will be featured here as they join the
                  platform.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            (() => {
              const featured = brands.slice(0, 4);
              const rows: [Brand, Brand | undefined][] = (
                [
                  [featured[0], featured[1]],
                  [featured[2], featured[3]],
                ] as [Brand | undefined, Brand | undefined][]
              ).filter(
                (row): row is [Brand, Brand | undefined] =>
                  row[0] !== undefined
              );

              return rows.map(([brandA, brandB], rowIndex) => (
                <div
                  key={rowIndex}
                  className="mt-8 grid sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-3 gap-6 md:gap-20 items-center mb-20 last:mb-0"
                >
                  <div className="bg-muted rounded-xl p-4 lg:p-6 col-span-1 md:col-span-2 lg:col-span-1">
                    <div className="md:hidden mb-6 aspect-video w-full bg-background rounded-xl overflow-hidden">
                      <Image
                        src={brandA.profile_picture || "/placeholder.svg"}
                        alt={brandA.name}
                        width={500}
                        height={300}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <span className="text-3xl font-semibold tracking-tight">
                      {brandA.name}
                    </span>

                    <div className="flex items-start gap-3 mt-6">
                      <Factory className="shrink-0 text-brandLight dark:text-brandDark" />
                      <p className="-mt-0.5 text-xl md:text-base xl:text-2xl line-clamp-3">
                        {brandA.description}
                      </p>
                    </div>

                    <Link href={`/brands/${brandA.id}`}>
                      <Button className="mt-8 w-full py-6 text-lg cursor-pointer">
                        Visit brand{" "}
                        <ArrowRight className="size-6 text-brandLight dark:text-brandDark" />
                      </Button>
                    </Link>
                  </div>

                  <div className="hidden md:block bg-muted rounded-xl col-span-1 md:col-span-3 lg:col-span-2 overflow-hidden h-[550px] dark:border relative">
                    <Image
                      src={brandA.profile_picture || "/placeholder.svg"}
                      alt={brandA.name}
                      fill
                      sizes="33vw"
                      className="object-cover"
                    />
                  </div>

                  {brandB && (
                    <>
                      <div className="hidden md:block bg-muted rounded-xl col-span-1 md:col-span-3 lg:col-span-2 overflow-hidden h-[550px] dark:border relative">
                        <Image
                          src={brandB.profile_picture || "/placeholder.svg"}
                          alt={brandB.name}
                          fill
                          sizes="33vw"
                          className="object-cover"
                        />
                      </div>

                      <div className="bg-muted rounded-xl p-4 lg:p-6 col-span-1 md:col-span-2 lg:col-span-1">
                        <div className="md:hidden mb-6 aspect-video w-full bg-background rounded-xl overflow-hidden">
                          <Image
                            src={brandB.profile_picture || "/placeholder.svg"}
                            alt={brandB.name}
                            width={500}
                            height={300}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <span className="text-3xl font-semibold tracking-tight">
                          {brandB.name}
                        </span>

                        <div className="flex items-start gap-3 mt-6">
                          <Factory className="shrink-0 text-brandLight dark:text-brandDark" />
                          <p className="-mt-0.5 text-xl md:text-base xl:text-2xl line-clamp-3">
                            {brandB.description}
                          </p>
                        </div>

                        <Link href={`/brands/${brandB.id}`}>
                          <Button className="mt-8 w-full py-6 text-lg cursor-pointer">
                            Visit brand{" "}
                            <ArrowRight className="size-6 text-brandLight dark:text-brandDark" />
                          </Button>
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              ));
            })()
          )}
        </div>
      </section>
```

This preserves the original's alternating `[card, big-image, big-image, card]` visual rhythm per row, but only renders a second row if there's a 3rd/4th brand, and only renders `brandB`'s image+card if that slot is filled (odd brand counts render a lone `brandA` slot with no trailing empty cells).

- [ ] **Step 3: Remove now-fully-unused imports and the `theme` hook**

After this change, `ButlerAIDark`/`ButlerAILight`/`CollectionsDark`/`CollectionsLight`/`EventsDark`/`EventsLight`/`NewsDark`/`NewsLight`/`ShopDark`/`ShopLight` were already removed by Task 3. Confirm (`grep -n "theme\b" app/page.tsx`) that `theme` is no longer referenced anywhere in the file, then remove:

```tsx
import { useTheme } from "next-themes";
```

and

```tsx
const { theme } = useTheme();
```

If `grep` still shows a `theme` reference somewhere unexpected, stop and report — it means either this task or Task 3 missed a usage, and removing the hook would break that spot.

Also confirm `Stars`, `GiShoppingCart`, `GiShirt`, `GiTicket` (icons used only by the old feature cards this section replaced) are still used elsewhere in the file before assuming they're safe to leave — check with `grep -n` for each; if any is now unused, remove its import too. `ArrowDown` (used by the old "see how it works ↓" label, now replaced by `ArrowRight`) — check if it's still used elsewhere in the file; if not, remove that import as well.

- [ ] **Step 4: Type-check, lint, and manually verify**

Run `npx tsc --noEmit` and `npm run lint` — must introduce no new errors/warnings, and must not have any unused-import warnings from the cleanup in Step 3.

Run `npm run dev` and check in a browser:
- The section now reads "Brands Worth Discovering." with a "see all brands →" link to `/brands`.
- With real brand data present, up to 4 brands render in the alternating card/image layout, each card's "Visit brand" button navigates to that brand's `/brands/[id]` page.
- Toggling light/dark mode no longer affects any image on this page's bento grid or this section (since `theme` is fully removed) — spot-check no other part of the page broke from removing the `theme` hook.
- If there are 1, 2, or 3 brands in the database rather than exactly 4, the layout still renders sensibly (no empty/broken cells) — you can temporarily hardcode `brands.slice(0, 4)` to `brands.slice(0, 1)` (or similar) in a local, uncommitted edit purely to eyeball this, then revert before committing.

- [ ] **Step 5: Commit**

```bash
git add app/page.tsx
git commit -m "feat: repurpose how-it-works section into Featured Brands spotlight"
```

---

## Self-Review Notes

- Spec coverage: `BrandStorySection` (Task 2) with 2×2 desktop grid, rotating text corner, mobile text+carousel, no links (all per spec); bento grid distinct images + dropped theme variants (Task 3); Featured Brands repurpose with live data, alternating layout, loading/empty/partial-row states (Task 4); image sourcing with count/theme/destination/license constraints (Task 1) — all covered.
- No placeholders: every step has real code or an exact, runnable command; Task 1's per-file search themes are explicit rather than "find something appropriate."
- Type/name consistency checked: `BrandStorySection`'s `Variant`/`TextPosition` types are self-contained to that file; `isLoadingBrands` name introduced in Task 4 Step 1 matches its usage in Task 4 Step 2; image import constant names in Task 3 (`ButlerAIImage`, etc.) are used consistently within that same task.
- Flagged a known risk in Task 2 (grid auto-placement for the 3 image cells) explicitly rather than asserting it will "just work," with an instruction for the implementer to verify visually and adjust if needed.
