## Why

O fluxo atual quebra a experiência porque o frontend passa a depender de sugestões incrementais, mas o backend devolve a lista completa e a validação do formulário ainda exige correspondência exata. Isso faz com que a busca resulte em 404/"não encontrado" mesmo quando a entrada do usuário está conceitualmente correta, mas ainda não foi filtrada pela lista certa.

## What Changes

- Fazer o backend respeitar o `prefix` recebido em `get_match_suggestions`.
- Filtrar as sugestões de partidas a partir das três primeiras letras do time digitado.
- Garantir que o frontend só permita consulta quando a partida sugerida for válida e completa.
- Ajustar o placeholder para orientar o usuário com um exemplo realmente compatível com o fluxo.
- **BREAKING**: a resposta de sugestões passa a ser dependente do prefixo informado pelo cliente.

## Capabilities

### New Capabilities
- `incremental-match-suggestions`: sugestões incrementais de partidas completas com base em um prefixo de time.

### Modified Capabilities
- `match-suggestions`: o comportamento existente passa a filtrar por prefixo e não mais retornar a lista inteira.
- `fixture-results`: a consulta continua igual, mas agora a entrada válida vem da lista filtrada incrementalmente.

## Impact

- `server.js` precisa aplicar filtro por prefixo no evento `get_match_suggestions`.
- `web-ui/src/main.js` precisa solicitar sugestões quando o usuário digitar 3 letras e tratar apenas escolhas válidas.
- `web-ui/index.html` precisa orientar o usuário com placeholder compatível com o novo fluxo.
- A experiência de consulta fica mais previsível e reduz 404 por seleção incorreta.
