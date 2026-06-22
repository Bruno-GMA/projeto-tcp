## ADDED Requirements

### Requirement: Standard match query format
The system MUST accept test queries in the format `TIME X ADVERSÁRIO`.

#### Scenario: User enters a valid match query
- **WHEN** the user types a match query in the format `TIME X ADVERSÁRIO`
- **THEN** the system MUST use that text to search for the corresponding fixture

### Requirement: Return match result when available
The system MUST return the match result when the fixture exists and is finished.

#### Scenario: Finished match is found
- **WHEN** the queried fixture exists and has a final score available
- **THEN** the system MUST return the result of the match

### Requirement: Inform when match has not occurred
The system MUST inform the user when the requested fixture has not occurred yet.

#### Scenario: Upcoming match is found
- **WHEN** the queried fixture exists but has not started or finished
- **THEN** the system MUST return a friendly message indicating that the match has not yet occurred

### Requirement: Keep lookup behavior compatible
The system MUST keep the current lookup behavior compatible with existing query flows.

#### Scenario: Existing clients send the same payload
- **WHEN** an existing client sends the query text in the payload
- **THEN** the backend MUST continue resolving the fixture without requiring a new event contract
