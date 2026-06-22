## Context

The current frontend/backend split is inconsistent. The frontend already requests incremental suggestions with a `prefix`, but the server ignores it and returns all fixtures. The UI then validates against the full unfiltered list, so a user can easily submit an input that looks plausible but is not actually backed by the current filtered suggestion state.

## Goals / Non-Goals

**Goals:**
- Make match suggestions truly incremental.
- Keep the query flow simple and deterministic.
- Reduce false 404s caused by invalid or prematurely accepted input.

**Non-Goals:**
- Change the football-data provider.
- Change the core `get_game_result` response contract.
- Add new pages or complex UI state.

## Decisions

- Filter suggestions server-side using the received prefix so the client and backend share the same source of truth.
- Require at least three characters before asking for suggestions to avoid noisy results.
- Keep validation strict at submit time, but only against the currently filtered suggestions.
- Use a visible placeholder example that matches the expected format and provider data.

## Risks / Trade-offs

- [Too-strict validation can reject useful partial input] -> Mitigation: keep validation scoped to the current suggestion set only.
- [Server-side filtering may return empty results for some team prefixes] -> Mitigation: show an empty suggestion state rather than fabricating matches.
- [Prefix matching may be ambiguous for short team names] -> Mitigation: require three characters minimum and use full-match suggestions.

## Migration Plan

1. Update the backend to honor prefix-based suggestion requests.
2. Update the frontend to request suggestions on input and to validate only against the filtered list.
3. Refresh the placeholder so the user starts from a valid example.
4. Verify that the query still returns a match or a clear not-found message instead of a generic 404-like failure.

## Open Questions

- Should the backend normalize accents before prefix matching?
- Should suggestions be cached per prefix to reduce repeated API calls?
