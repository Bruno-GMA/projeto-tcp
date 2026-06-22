## Why

O servidor ainda usa uma base mock em memória, o que limita a utilidade da aplicação e impede consultas reais sobre partidas e status de ocorrência. A integração com a API-Football permite responder com dados reais de fixtures e distinguir jogos já finalizados de partidas ainda programadas.

## What Changes

- Substituir a base em memória do servidor por consulta à API-Football.
- Consultar o endpoint `fixtures` para localizar jogos e retornar resultado ou status da partida.
- Manter o contrato Socket.io existente entre cliente e servidor.
- **BREAKING**: a fonte de verdade dos resultados deixa de ser estática e passa a depender da API externa.

## Capabilities

### New Capabilities
- `fixture-results`: consulta de partidas via API-Football para retornar placar final ou indicar que o jogo ainda irá ocorrer.

### Modified Capabilities

## Impact

- `server.js` passa a fazer chamadas HTTP para `https://v3.football.api-sports.io/`.
- Uso de chave da API no backend para fins de estudo.
- Possível necessidade de lidar com latência, erros de rede e limites de rate limit.
- O cliente Socket.io permanece inalterado em termos de evento e formato de resposta.
