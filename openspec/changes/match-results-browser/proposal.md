## Why

A experiência atual exige digitação e filtragem, o que aumenta a chance de erro e dificulta a exploração dos resultados. O usuário precisa ver primeiro as partidas disponíveis, clicar em uma opção válida e então visualizar placar e detalhes da partida de forma direta.

## What Changes

- Exibir a lista de partidas da Copa do Mundo 2026 logo na abertura do frontend.
- Transformar a escolha da partida em um clique em cards/itens clicáveis.
- Manter o backend como fonte da lista de partidas, usando `https://api.football-data.org/v4/competitions/WC/matches`.
- Exibir detalhes da partida selecionada com foco em placar e status.
- **BREAKING**: a busca textual deixa de ser o principal fluxo de navegação do usuário.

## Capabilities

### New Capabilities
- `match-browser`: navegação por partidas clicáveis com exibição de detalhes da partida.

### Modified Capabilities
- `fixture-results`: a consulta passa a priorizar a listagem inicial e seleção por clique, em vez de pesquisa por texto.

## Impact

- `server.js` passa a expor a lista de partidas em um formato pronto para consumo pelo frontend.
- `web-ui` passa a renderizar cards/itens clicáveis com as partidas.
- O usuário deixa de precisar digitar para buscar a partida.
- A interface reduz erros de entrada e facilita a visualização de placar e status da partida.
