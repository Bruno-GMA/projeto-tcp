## ADDED Requirements

### Requirement: Query fixtures from API-Football
The system MUST query the API-Football `fixtures` endpoint to resolve a requested game.

#### Scenario: Fixture is found and finished
- **WHEN** the server requests fixture data for a game that has already finished
- **THEN** the server MUST return `status: "success"`
- **AND** the response MUST include the final score or result text

#### Scenario: Fixture is found and not finished
- **WHEN** the server requests fixture data for a game that exists but has not started or finished yet
- **THEN** the server MUST return `status: "not_found"`
- **AND** the response MUST inform the user that the match has not occurred yet

#### Scenario: Fixture is not found
- **WHEN** the server cannot resolve the requested game in the API response
- **THEN** the server MUST return `status: "not_found"`
- **AND** the response MUST be friendly and actionable

### Requirement: Preserve Socket.io contract
The system MUST keep the existing `get_game_result` and `game_result_response` events unchanged.

#### Scenario: Client submits a request
- **WHEN** the client emits `get_game_result`
- **THEN** the server MUST still respond with `game_result_response`
- **AND** the payload structure MUST remain compatible with the current client and web UI
