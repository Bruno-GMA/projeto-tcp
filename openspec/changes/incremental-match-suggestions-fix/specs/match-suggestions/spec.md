## MODIFIED Requirements

### Requirement: Suggest full match names
The system MUST provide autocomplete suggestions using complete match names instead of isolated team names.

#### Scenario: User types a partial match name
- **WHEN** the user types at least three characters of a team name
- **THEN** the backend MUST return only matching full fixture suggestions for that prefix
- **AND** the interface MUST update the suggestion list with those filtered fixtures

#### Scenario: User selects a suggested match
- **WHEN** the user chooses a suggested full match name
- **THEN** the system MUST send that full match name to the backend for lookup

### Requirement: Keep query experience simple
The system MUST keep the input flow simple for the user while using full-match suggestions.

#### Scenario: User only knows one team name
- **WHEN** the user types the first three letters of a team name
- **THEN** the interface MUST request suggestions for that prefix and show only valid full matches

### Requirement: Frontend input validation
The frontend MUST only allow submitting values that are present in the current filtered suggestion list.

#### Scenario: User submits an unknown value
- **WHEN** the user types a value that is not part of the filtered suggestion list
- **THEN** the interface MUST block the request and ask the user to select a valid suggestion
