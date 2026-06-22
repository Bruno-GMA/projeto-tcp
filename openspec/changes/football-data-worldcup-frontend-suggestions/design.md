## Context

The project already exposes a Socket.io backend and a simple Vite frontend. The backend currently integrates with an external football API, but the source and response rules must now align with football-data.org v4. The frontend should stop suggesting isolated team names and instead guide the user toward full match fixtures.

## Goals / Non-Goals

**Goals:**
- Move backend lookup to football-data.org v4.
- Keep the Socket.io contract for result lookup.
- Populate frontend autocomplete with full match names.
- Keep the UI simple.

**Non-Goals:**
- Add user accounts or persistence.
- Build a multi-page frontend.
- Change the overall terminal client flow.

## Decisions

- Use football-data.org v4 as the source of truth because it is the requested API.
- Use the `X-Auth-Token` header with the provided token.
- Expose match suggestions from the backend so the frontend can populate full-match autocomplete without duplicating API logic.
- Keep the main query/response Socket.io event names unchanged.

## Risks / Trade-offs

- [API response structure differs from previous provider] -> Mitigation: isolate parsing in one backend helper.
- [Autocomplete requires an additional round-trip] -> Mitigation: keep suggestions cached for the current session.
- [Future fixtures may not exist yet for 2026] -> Mitigation: show an empty/safe suggestion state rather than fabricated data.
