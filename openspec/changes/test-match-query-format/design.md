## Context

The project already supports querying match results through Socket.io and a web UI. For test documentation, the query string should be standardized as `TIME X ADVERSÁRIO` so users and testers can validate the search format consistently.

## Goals / Non-Goals

**Goals:**
- Define a clear input format for test queries.
- Document expected behavior for finished and upcoming matches.
- Keep the backend contract unchanged.

**Non-Goals:**
- Add new API providers.
- Change the UI layout.
- Introduce additional transport events.

## Decisions

- Use the textual pattern `TIME X ADVERSÁRIO` as the canonical test query format.
- Treat the query as a lookup hint, not a rigid parser.
- Keep behavior aligned with the existing fixture resolution flow.

## Risks / Trade-offs

- [User may type team names in different styles] -> Mitigation: keep matching tolerant to partial text.
- [Documentation-only change may be overlooked in implementation] -> Mitigation: keep requirement wording testable and explicit.
