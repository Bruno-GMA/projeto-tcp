## ADDED Requirements

### Requirement: Simple web consultation interface
The system MUST provide a single-page web interface for the user to submit a game name and view the server response.

#### Scenario: User submits a game query
- **WHEN** the user enters a game name and clicks the submit button
- **THEN** the interface MUST send a `get_game_result` event to the Socket.io server
- **AND** the interface MUST display the returned result on the page

### Requirement: Clear response feedback
The system MUST present server responses in a user-friendly way that distinguishes successful results from not found responses.

#### Scenario: Server returns a successful result
- **WHEN** the server responds with `status: "success"`
- **THEN** the interface MUST display the game result clearly in the response area

#### Scenario: Server returns not found
- **WHEN** the server responds with `status: "not_found"`
- **THEN** the interface MUST display a friendly message indicating the game was not found

### Requirement: No backend contract change
The system MUST keep the existing Socket.io event contract unchanged for the web interface.

#### Scenario: Web UI connects to existing backend
- **WHEN** the web interface is loaded
- **THEN** it MUST connect to the existing Socket.io server on port 5000
- **AND** it MUST use the existing `get_game_result` and `game_result_response` events
