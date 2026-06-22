## Why

A integração atual com a API externa não está alinhada com a nova fonte oficial desejada e a experiência de busca no frontend ainda sugere seleções soltas, em vez de partidas completas. A troca para football-data e a sugestão de confrontos completos tornam a consulta mais precisa e intuitiva.

## What Changes

- Migrar o backend para a API football-data.org v4.
- Atualizar a autenticação para usar o token informado.
- Consultar partidas da Copa do Mundo 2026 no backend.
- Adicionar suporte a sugestões de autocomplete com partidas completas no frontend.
- Preservar o contrato principal Socket.io para consulta e resposta.

## Capabilities

### New Capabilities
- `match-suggestions`: autocomplete com partidas completas para consulta no frontend.

### Modified Capabilities
- `fixture-results`: a origem de dados muda da API-Football para football-data.org v4.

## Impact

- `server.js` passa a consumir `https://api.football-data.org/v4`.
- O frontend usa sugestões completas de partidas, não apenas seleções.
- O fluxo de consulta continua baseado em Socket.io.
- A lógica de parsing do backend precisa refletir o formato da football-data.
