## ADDED Requirements

### Requirement: Suggest full match names
The system MUST provide autocomplete suggestions using complete match names instead of isolated team names.

#### Scenario: User types a partial match name
- **WHEN** the user types the beginning of a complete match name
- **THEN** the interface MUST offer a matching full fixture suggestion

#### Scenario: User selects a suggested match
- **WHEN** the user chooses a suggested full match name
- **THEN** the system MUST send that full match name to the backend for lookup

### Requirement: Keep query experience simple
The system MUST keep the input flow simple for the user while using full-match suggestions.

#### Scenario: User only knows one team name
- **WHEN** the user types only part of a team name
- **THEN** the interface MUST still help the user reach the full fixture name
