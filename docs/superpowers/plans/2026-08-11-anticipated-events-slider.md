# Anticipated Events Slider Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the home page's click-to-expand "Anticipated Events" card row with an embla-based sliding carousel of big, always-fully-informative event cards.

**Architecture:** A new presentational `EventSliderCard` component (full-bleed background image, permanent gradient overlay, all event info always visible, whole card links to the event page) is rendered inside the existing shadcn/embla `Carousel` primitives already used elsewhere on `app/page.tsx`. The section's data fetch switches from a paginated, stateful `eventsVisibleCount` to one fixed `getEvents({ pageSize: 8 })` call, and the "Load more" button is replaced by a "See all events" link to `/events`.

**Tech Stack:** Next.js (App Router), React, TypeScript, Tailwind CSS, embla-carousel-react (via `components/Shad-UI/carousel.tsx`), `@supabase-cache-helpers/postgrest-react-query`.

## Global Constraints

- Reuse the existing `components/Shad-UI/carousel.tsx` primitives (`Carousel`, `CarouselContent`, `CarouselItem`, `CarouselPrevious`, `CarouselNext`) — do not add a new carousel library.
- New card component is separate from `EventCard` (different visual language — always-expanded overlay, not a `form` variant).
- Fixed fetch of exactly `pageSize: 8` events for this section — no pagination/"Load more" state for it.
- No automated test suite exists in this repo for home page UI (confirmed: no test runner configured, no `*.test.*`/`*.spec.*` files). Verification is manual: `npm run lint`, `npx tsc --noEmit`, and a browser check via the dev server.
- Card sizing must produce the "one card fully visible, next card peeking" effect: `basis-[85%]` on mobile, `basis-[70%]` from `md` up (per spec; these are tuned starting values, adjust visually if the peek looks off).

---

### Task 1: Create `EventSliderCard` component

**Files:**
- Create: `components/Custom-UI/Cards/EventSliderCard.tsx`

**Interfaces:**
- Consumes: `Event` type from `@/types/Event`; `buildItemSlugId`, `convertRawDateToReadableDate`, `convertRawDateToReadableTime` from `@/lib/utils`; `Badge` from `@/components/Shad-UI/badge`; `Button` from `@/components/Shad-UI/button`; `Link` from `next-view-transitions`; `Image` from `next/image`; `MapPin`, `Clock`, `ArrowRight` from `lucide-react`.
- Produces: `export default function EventSliderCard({ item }: { item: Event })` — a JSX component. Later tasks (Task 2) render `<EventSliderCard item={event} />` inside a `CarouselItem`.

- [ ] **Step 1: Write the component**

```tsx
import Image from "next/image";
import { Link } from "next-view-transitions";
import { ArrowRight, Clock, MapPin } from "lucide-react";
import { Badge } from "@/components/Shad-UI/badge";
import { Button } from "@/components/Shad-UI/button";
import { Event } from "@/types/Event";
import {
  buildItemSlugId,
  convertRawDateToReadableDate,
  convertRawDateToReadableTime,
} from "@/lib/utils";

export default function EventSliderCard({ item }: { item: Event }) {
  const eventLink = `/events/${buildItemSlugId(item.slug, item.id)}`;

  return (
    <Link
      href={eventLink}
      prefetch={false}
      className="relative block h-full w-full overflow-hidden rounded-xl text-white"
    >
      <Image
        className="object-cover"
        src={item.display_image || "/placeholder.svg"}
        fill
        sizes="(max-width: 767px) 85vw, 70vw"
        quality={90}
        alt={item.title}
      />

      <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-transparent" />

      <div className="absolute inset-0 flex flex-col justify-between p-5">
        <Badge className="w-fit bg-white/10 text-white backdrop-blur-sm hover:bg-white/10">
          {convertRawDateToReadableDate(item.start_date)}
        </Badge>

        <div className="flex flex-col gap-2">
          <p className="text-3xl md:text-5xl">{item.title}</p>

          <p className="flex items-center gap-2 text-sm text-neutral-200">
            <MapPin className="size-4 shrink-0" />
            {item.is_virtual ? "Online Event" : item.location ?? "Location TBA"}
            <span className="text-neutral-400">·</span>
            <Clock className="size-4 shrink-0" />
            {convertRawDateToReadableTime(item.start_date)}
          </p>

          <Button className="mt-2 w-fit">
            View more <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Type-check and lint**

Run: `npx tsc --noEmit` and `npm run lint`
Expected: both complete with no errors related to `EventSliderCard.tsx`.

- [ ] **Step 3: Commit**

```bash
git add components/Custom-UI/Cards/EventSliderCard.tsx
git commit -m "feat: add EventSliderCard component for anticipated events slider"
```

---

### Task 2: Wire the slider into the home page

**Files:**
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `EventSliderCard` from Task 1 (`import EventSliderCard from "@/components/Custom-UI/Cards/EventSliderCard"`); existing `Carousel`, `CarouselContent`, `CarouselItem`, `CarouselPrevious`, `CarouselNext` from `@/components/Shad-UI/carousel`; existing `getEvents` from `@/lib/fetches`.
- Produces: nothing consumed by later tasks — this is the final integration point for this spec.

- [ ] **Step 1: Fix the events data fetch to a constant page size**

In `app/page.tsx`, find the events query block (currently around line 135-139):

```tsx
  const {
    data: events,
    isFetching: isFetchingEvents,
    isLoading: isLoadingEvents,
  } = useQuery(getEvents({ pageSize: eventsVisibleCount }));
```

Replace it with:

```tsx
  const { data: events, isLoading: isLoadingEvents } = useQuery(
    getEvents({ pageSize: 8 })
  );
```

- [ ] **Step 2: Remove the now-unused pagination/expand state**

Remove these declarations (they are only used by the Anticipated Events section being replaced):
- `const [card, setCard] = useState(0);` (around line 97)
- The `handleClick` function (around line 111-113)
- `const [eventsVisibleCount, setEventsVisibleCount] = useState(DEFAULT_PAGE_SIZE);` (around line 123-124)
- `const hasMoreEvents = (events?.length ?? 0) >= eventsVisibleCount;` (around line 150)

Confirm via search that nothing else in the file references `card`, `setCard`, `handleClick`, `eventsVisibleCount`, `setEventsVisibleCount`, `hasMoreEvents`, or `isFetchingEvents` before removing — if this plan is executed against a page.tsx that has diverged from what Task-writing time saw, re-grep the file first:

```bash
grep -n "eventsVisibleCount\|hasMoreEvents\|isFetchingEvents\|setCard\|handleClick" app/page.tsx
```

Expected after this step: no matches outside the section being replaced in Step 3.

- [ ] **Step 3: Replace the Anticipated Events section JSX**

Find the section (currently `app/page.tsx:736-836`, starting with `<section className="flex flex-col gap-8 px-6 dark:text-white xl:p-8">` and ending at the closing `</section>` right before the `{hasMoreEvents && (...)}` block), plus that `{hasMoreEvents && (...)}` block that follows it (currently lines 838-853). Replace both together with:

```tsx
      <section className="flex flex-col gap-8 px-6 dark:text-white xl:p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl md:text-4xl">Anticipated Events</h2>
          <Link href="/events">
            <Button variant="outline">
              See all events <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>

        {isLoadingEvents ? (
          <LoadingSkeleton
            length={3}
            height="h-[500px] md:h-[600px]"
            className="md:grid-cols-3"
          />
        ) : !events || events.length === 0 ? (
          <Empty className="border dark:text-white">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <GiTicket />
              </EmptyMedia>
              <EmptyTitle>Nothing on the calendar yet</EmptyTitle>
              <EmptyDescription>
                Trunk shows, launches, and private shopping experiences will
                show up here as brands post them.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <Carousel opts={{ align: "start" }} className="h-[500px] md:h-[600px]">
            <CarouselContent className="h-full">
              {events.map((event) => (
                <CarouselItem
                  key={event.id}
                  className="h-full basis-[85%] md:basis-[70%]"
                >
                  <EventSliderCard item={event} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        )}
      </section>
```

- [ ] **Step 4: Add the `EventSliderCard` import**

Near the other Card imports at the top of `app/page.tsx`:

```tsx
import EventSliderCard from "@/components/Custom-UI/Cards/EventSliderCard";
```

- [ ] **Step 5: Type-check and lint**

Run: `npx tsc --noEmit` and `npm run lint`
Expected: both complete with no errors. If `DEFAULT_PAGE_SIZE` or `Icons` become unused imports as a result of the removed state, remove those unused imports too — re-run lint until clean.

- [ ] **Step 6: Manual browser verification**

Run: `npm run dev`, open `http://localhost:3000/` in a browser.

Verify:
- The "Anticipated Events" section renders a slider where the first card is fully visible and the next card peeks at the right edge.
- Clicking the prev/next arrow buttons moves between cards (prev is disabled at the start).
- Dragging/swiping the cards on desktop (mouse drag) and touch also moves the slider.
- Every card shows date badge, title, location, time, and "View more" button without needing hover or a click.
- Clicking a card (not the button) navigates to that event's detail page.
- "See all events" button navigates to `/events`.
- With no events in the database (or by temporarily forcing `events` to `[]]` for a manual check), the empty state still renders.
- Resize to a narrow viewport and confirm the peek/full-card sizing still looks intentional on mobile.

- [ ] **Step 7: Commit**

```bash
git add app/page.tsx
git commit -m "feat: replace anticipated events row with sliding carousel"
```

---

## Self-Review Notes

- Spec coverage: new card component (Task 1), carousel mechanics + peek sizing + arrows/drag (Task 2 Step 3), fixed `pageSize: 8` fetch (Task 2 Step 1), removed `eventsVisibleCount`/`hasMoreEvents`/"Load more" (Task 2 Steps 1-2), "See all events" CTA (Task 2 Step 3), unchanged loading/empty states (Task 2 Step 3), manual verification in place of automated tests (Task 2 Step 6) — all covered.
- No placeholders: every step has real code or an exact, runnable command.
- Type/name consistency checked: `EventSliderCard({ item }: { item: Event })` in Task 1 matches `<EventSliderCard item={event} />` usage in Task 2.
