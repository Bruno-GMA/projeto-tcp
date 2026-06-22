## MODIFIED Requirements

### Requirement: Return match results for browsing
The system MUST present the list of World Cup matches as browseable items before the user selects a specific match.

#### Scenario: Page loads with matches available
- **WHEN** the user opens the interface
- **THEN** the system MUST present a list of available World Cup matches
- **AND** each match MUST be selectable without typing a search term

#### Scenario: User clicks a match
- **WHEN** the user clicks a listed match
- **THEN** the system MUST show the selected match details
- **AND** the details MUST include the final score or current score/status

### Requirement: Keep result details easy to read
The system MUST display match details in a way that makes the score and match state easy to understand.

#### Scenario: Finished match is selected
- **WHEN** the selected match is finished
- **THEN** the interface MUST show the score prominently
- **AND** the interface MUST indicate that the match has finished

#### Scenario: Upcoming match is selected
- **WHEN** the selected match has not started yet
- **THEN** the interface MUST show the scheduled match information and status

### Requirement: Preserve backend match source
The system MUST continue using the World Cup matches endpoint as the source of truth for the list of matches.

#### Scenario: Backend fetches matches
- **WHEN** the backend prepares the match list
- **THEN** it MUST request `https://api.football-data.org/v4/competitions/WC/matches`
