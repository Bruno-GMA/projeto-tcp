## Context

O servidor atual responde consultas por jogos a partir de uma base estática em memória. A nova exigência troca essa fonte por uma API externa real, a API-Football, mantendo o mesmo contrato Socket.io para clientes existentes.

A mudança impacta apenas o backend, mas introduz dependência de rede, possíveis limites de rate limit e necessidade de tratamento de status de partida. O cliente CLI e a interface web não devem mudar.

## Goals / Non-Goals

**Goals:**
- Trocar o mock em memória por consulta à API-Football.
- Resolver partidas via endpoint `fixtures` e retornar placar quando concluído.
- Informar de forma amigável quando a partida ainda não ocorreu.
- Manter os eventos Socket.io e o formato de resposta existentes.
- Preservar compatibilidade com múltiplos clientes concorrentes.

**Non-Goals:**
- Criar persistência local ou banco de dados.
- Alterar o frontend web ou o cliente de terminal.
- Implementar cache complexo ou filas assíncronas.
- Expor a chave da API no cliente.

## Decisions

- **Usar `fetch` nativo do Node**: evita adicionar dependências extras. Alternativa considerada: `axios` ou outra lib HTTP. Rejeitada por não ser necessária.
- **Centralizar a lógica em uma função de consulta**: o handler Socket.io chama uma função que resolve a partida e devolve payload padronizado. Alternativa: espalhar a lógica pelo handler. Rejeitada por dificultar manutenção.
- **Trabalhar com heurística de busca por nome do jogo**: a requisição do cliente continua enviando `game_name`, e o servidor usa isso para consultar o endpoint e selecionar o fixture adequado. Alternativa: mudar o contrato para IDs. Rejeitada porque quebraria clientes existentes.
- **Tratar status do fixture para decidir resposta**: fixture finalizado retorna `success`; fixture agendado ou em andamento retorna `not_found` com mensagem amigável. Alternativa: sempre retornar dados brutos. Rejeitada porque o sistema precisa responder com interpretação de negócio.
- **Manter a chave via constante no backend**: atende ao uso de estudo solicitado pelo usuário. Alternativa: variável de ambiente. Seria melhor para produção, mas não é o foco desta mudança.

## Risks / Trade-offs

- [Rate limit da API externa] -> Mitigação: retornar mensagem amigável e registrar erro no servidor.
- [Busca por nome pode ser imprecisa] -> Mitigação: normalizar texto e usar heurística consistente ao interpretar a resposta.
- [Dependência de rede aumenta latência] -> Mitigação: manter resposta assíncrona e não bloquear o servidor.
- [Formato da API pode variar] -> Mitigação: isolar o parsing em função única para ajuste rápido.

## Migration Plan

1. Substituir a base em memória por um serviço de consulta à API-Football.
2. Manter o handler Socket.io e o payload de resposta inalterados.
3. Testar consultas válidas, não encontradas e partidas futuras.
4. Se a integração falhar, restaurar temporariamente a resposta mock anterior.

## Open Questions

- A busca deve considerar apenas jogos da Copa do Mundo ou aceitar qualquer fixture encontrado pela API?
- A mensagem de "ainda irá ocorrer" deve ser exibida para qualquer partida futura ou apenas quando a API indicar status específico?
