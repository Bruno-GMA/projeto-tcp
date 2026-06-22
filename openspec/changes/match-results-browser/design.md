## Context

The current UI evolved around text entry and suggestion filtering, but the user now wants a browse-first experience. The backend already knows how to fetch World Cup matches from football-data. The remaining job is to shift the interaction model so the frontend receives the match list first and selection happens by clicking an item.

The football-data payload returned by the World Cup matches endpoint includes match status, teams and score, but not guaranteed goal-scorer names in the basic response captured here. The design should therefore emphasize score, status and team names, and avoid inventing scorer data when the API does not provide it.

## Goals / Non-Goals

**Goals:**
- Show available matches immediately.
- Make selection happen by click, not by typing.
- Display match score and status clearly.
- Keep the backend as the source of truth for World Cup matches.

**Non-Goals:**
- Add authentication or persistence.
- Add a separate search interface as the primary path.
- Fabricate goal-scorer names not present in the API response.

## Decisions

- Use the existing `competitions/WC/matches` endpoint as the initial data source.
- Transform the list into click-friendly cards on the frontend.
- Keep match details in a separate selection state so the UI can show an active match panel.
- Prefer score/status clarity over ambiguous scorer display when the API payload does not include scorers.

## Risks / Trade-offs

- [The API payload may not include goal-scorer names] -> Mitigation: render only data actually provided by the API and make scorer display optional.
- [Large match lists can feel heavy] -> Mitigation: group and style cards clearly, and rely on a single competition dataset.
- [Selection-by-click changes user expectations] -> Mitigation: show the match list on load and keep the selected match detail panel obvious.

## Migration Plan

1. Update the backend to deliver the match list and selected match detail cleanly.
2. Replace the text-first frontend with a browse-first card list.
3. Ensure the detail panel updates immediately on click.
4. Verify finished and upcoming matches render with clear status and score.

## Open Questions

- Should the backend provide a lightweight summary DTO for each match, or should the frontend adapt directly to the raw API payload?
- If a future API response includes scorer names, should the UI display them in a secondary line or keep the card compact?
