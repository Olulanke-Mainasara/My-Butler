# Anticipated Events Slider — Design

## Context

This is the first sub-project of a larger home page / brand redesign (rebrand, hero layout, bento grid copy, and a new 4-variant image/text section are separate, later specs). This spec covers only the **Anticipated Events** section on the home page (`app/page.tsx:736-836`).

Today that section is a horizontal-scroll row of cards that expand in place on click/hover, with a "Load more" button to fetch additional pages of events. It's being replaced with a sliding carousel of big, always-fully-informative cards.

## Goals

- Replace the click-to-expand card row with an embla-based carousel (arrows + drag/swipe).
- Cards are big: on desktop, one card shows fully with the next card peeking at the edge.
- All event info (date, title, location, time, CTA) is visible on every card at all times — no hover/expand state.
- Section shows a fixed, capped set of upcoming events instead of paginating with "Load more".

## Non-goals

- No changes to the event data model, `getEvents` fetch logic beyond a fixed `pageSize`, or the `/events` page itself.
- No changes to any other section of the home page (hero, bento grid, collections, "How Butler A.I. works", top stories).
- The existing click-to-expand card interaction isn't being generalized or extracted for reuse elsewhere right now — if that pattern is wanted again later, it can be pulled from git history at that point.

## Design

### Card: `EventSliderCard`

New component (new file, e.g. `components/Custom-UI/Cards/EventSliderCard.tsx`), separate from the existing `EventCard` since the visual language (big, always-expanded overlay) is different enough to not overload `EventCard`'s `form` prop:

- Full-bleed background image (`fill`, `object-cover`) with a permanent dark gradient overlay for text legibility (no brightness/opacity transitions — always at "expanded" look).
- Content layout mirrors today's *expanded* state: date `Badge` pinned top-left, then title, location + time row, and a "View more" `Button` linking to the event page, all pinned toward the bottom.
- Whole card is a `Link` to the event detail page (`/events/[slugAndId]`) — no more click-to-expand `onClick` handler.

### Carousel

Reuse the existing `components/Shad-UI/carousel.tsx` (embla-based, already used twice elsewhere on this page) with `CarouselPrevious` / `CarouselNext` arrow buttons shown, and embla's default drag/swipe behavior left enabled (no extra config needed there).

Sizing (peek effect): each `CarouselItem` gets a `basis` wide enough that one card is fully visible and the next card peeks at the edge — approximately `basis-[85%]` on mobile and `basis-[70%]` from `md` up. Exact values tuned visually during implementation; height stays similar to today's (`h-[500px] md:h-[600px]`).

### Data fetching

Replace the paginated `eventsVisibleCount` state with a fixed fetch:

```ts
const { data: events, isLoading: isLoadingEvents } = useQuery(getEvents({ pageSize: 8 }));
```

This removes the need for `eventsVisibleCount`, `setEventsVisibleCount`, `hasMoreEvents`, and `isFetchingEvents`, since there's no more "Load more" affordance for this section.

### Section header

"Anticipated Events" heading stays, with a "See all events" button/link added next to it (or below on mobile) pointing to `/events`.

### Cleanup

Remove from `app/page.tsx`, since they're only used by this section:
- `card` / `setCard` state and `handleClick`
- `eventsVisibleCount` / `setEventsVisibleCount`
- `hasMoreEvents`
- `isFetchingEvents`
- The "Load more" button block for events (`app/page.tsx:838-853`)

### Loading / empty states

Unchanged: same `LoadingSkeleton` (3 columns, tall cards) while loading, and the same `Empty` component with "Nothing on the calendar yet" messaging when there are no events.

## Testing

- Manual verification in the browser: slider renders, arrows and drag/swipe both work, cards show full info without hover, "See all events" links to `/events`, loading and empty states still render correctly.
- No new automated tests planned — this repo doesn't have an existing test suite for home page UI sections.
