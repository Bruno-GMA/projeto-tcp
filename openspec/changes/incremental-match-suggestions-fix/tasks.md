## 1. Backend Filtering

- [x] 1.1 Make `get_match_suggestions` honor the received `prefix`.
- [x] 1.2 Return only fixtures that match the prefix after normalization.
- [x] 1.3 Keep the result payload compatible with the current frontend.

## 2. Frontend Behavior

- [x] 2.1 Request suggestions only after the user types three characters.
- [x] 2.2 Validate submits only against the current filtered suggestion list.
- [x] 2.3 Update the placeholder to a valid match example.

## 3. Validation

- [x] 3.1 Verify the suggestion list changes as the prefix changes.
- [x] 3.2 Verify invalid text is blocked before reaching the backend.
