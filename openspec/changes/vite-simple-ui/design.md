## Context

O projeto já possui um backend Socket.io em Node.js na porta 5000 com o contrato de eventos `get_game_result` e `game_result_response`. A mudança solicitada não altera esse contrato; ela adiciona uma interface web simples para reduzir fricção de uso e tornar a consulta mais intuitiva do que o cliente via terminal.

A nova UI deve ser pequena, local e fácil de executar no mesmo repositório. O objetivo é separar claramente a camada de apresentação web do servidor e do cliente CLI existentes, sem introduzir complexidade desnecessária.

## Goals / Non-Goals

**Goals:**
- Criar uma página única com Vite para consulta de resultados.
- Conectar a interface ao servidor Socket.io existente na porta 5000.
- Exibir entradas e respostas de forma clara para o usuário final.
- Manter o backend e o contrato de eventos inalterados.
- Preservar o cliente de terminal e o script de testes.

**Non-Goals:**
- Reescrever o backend em outro framework.
- Criar autenticação, banco de dados ou persistência.
- Criar múltiplas telas, rotas ou navegação complexa.
- Alterar o schema de eventos já definido.

## Decisions

- **Usar Vite para o frontend**: Vite oferece setup simples, dev server rápido e baixo atrito para uma página estática com Socket.io-client. Alternativa considerada: servir o frontend diretamente pelo Node.js. Rejeitada por misturar responsabilidades e reduzir clareza do projeto.
- **Manter uma única página**: a UI deve concentrar formulário, estado de conexão e resposta numa única tela. Alternativa considerada: dividir em várias telas. Rejeitada por não trazer valor adicional para o escopo.
- **Consumir Socket.io-client diretamente no navegador**: o frontend falará com o backend na porta 5000 usando os eventos existentes. Alternativa considerada: criar uma API HTTP intermediária. Rejeitada porque duplicaria o contrato e aumentaria a superfície de manutenção.
- **Não alterar o servidor atual**: a camada web será apenas um novo consumidor do mesmo backend. Alternativa considerada: adaptar o servidor para servir o frontend. Rejeitada para manter desacoplamento e permitir execução independente do frontend.
- **Usar estado local simples**: a UI manterá apenas o texto digitado, o status de conexão e a última resposta. Alternativa considerada: estado global ou gerenciador de estado. Rejeitada por ser excessivo para o escopo.

## Risks / Trade-offs

- [Dependência de CORS/configuração do Socket.io] -> Mitigação: manter o backend com CORS aberto para desenvolvimento local e documentar a URL do servidor.
- [UX limitada por ser uma única página] -> Mitigação: tornar a página objetiva, com feedback visual claro e textos amigáveis.
- [Duas interfaces para o mesmo backend podem divergir] -> Mitigação: centralizar o contrato no evento Socket.io e não duplicar lógica de consulta no frontend.
- [Frontend pode ser executado sem backend ativo] -> Mitigação: mostrar estado de conexão e mensagens de erro compreensíveis.

## Migration Plan

1. Adicionar a estrutura Vite no repositório sem alterar o backend existente.
2. Implementar a página única e a integração Socket.io-client.
3. Validar manualmente a consulta e o tratamento de erro.
4. Documentar como iniciar backend e frontend em paralelo.
5. Se necessário, reverter apenas os arquivos do frontend sem impacto no servidor.

## Open Questions

- O frontend deve rodar em porta fixa ou aceitar a porta padrão do Vite durante o desenvolvimento?
- Deve existir um comando único para subir backend e frontend juntos, ou eles devem ser iniciados separadamente?
