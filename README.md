# Projeto TCP — Guia rápido para desenvolvedores

Resumo
-------
Projeto cliente‑servidor (Socket.io) para consulta de resultados de jogos da Copa do Mundo. O backend integra com a API-Football para obter dados de partidas. O diretório `openspec/` tem especificações, propostas e tarefas.

Objetivo deste README
---------------------
Fornecer ao desenvolvedor instruções diretas para: instalar dependências, executar o sistema, rodar testes, entender a estrutura e contribuir rapidamente.

Requisitos
----------
- Node.js 16+ e npm (ou yarn)

Instalação rápida
-----------------
No diretório raiz do projeto:

```bash
npm install
```

Executando localmente
---------------------
- Rodar o servidor (backend):

```bash
npm start
```

- Rodar o cliente de terminal (exemplo):

```bash
npm run client
```

- Executar os testes automatizados:

```bash
npm test
```

- Rodar a interface web (opcional):

```bash
cd web-ui
npm install
npm run dev
```

O frontend se conecta ao servidor Socket.io em `http://localhost:5000` (por padrão). Eventos principais usados pelo projeto:
- `get_game_result`
- `game_result_response`

Estrutura do repositório
------------------------
- `server.js`: servidor Socket.io e integração com a API-Football.
- `client.js`: cliente de terminal para testes manuais.
- `tester.js`: rotinas de teste/simulação.
- `package.json`: scripts e dependências.
- `openspec/`: especificações, propostas, tarefas, e exemplos de formatos de mensagem (use aqui para alinhar mudanças de protocolo).
- `web-ui/`: frontend Vite (se houver) com `index.html` e `src/`.

Como contribuir
---------------
1. Crie uma branch por tarefa: `git checkout -b feat/minha-tarefa`.
2. Faça commits pequenos e significativos.
3. Atualize `openspec/` (por exemplo `design.md` ou `tasks.md`) se a mudança afetar o protocolo ou design.
4. Abra um Pull Request com descrição de como testar as alterações.

Boas práticas rápidas
---------------------
- Logue eventos importantes no servidor para facilitar debugging.
- Ao alterar o formato das mensagens TCP/Socket, documente em `openspec/specs/` e adicione exemplos.
- Execute `tester.js` antes de abrir PR para garantir que os fluxos básicos continuam funcionando.

Contato
-------
Use issues do repositório para dúvidas ou discussões de design.
