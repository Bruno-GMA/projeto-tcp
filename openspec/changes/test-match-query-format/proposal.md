## Why

A forma de consulta usada nos testes precisa ser padronizada para reduzir ambiguidades na entrada do usuário e facilitar a validação da resposta do sistema. O formato `TIME X ADVERSÁRIO` deixa claro como o usuário deve descrever a partida a ser buscada.

## What Changes

- Documentar o padrão de entrada para consultas de teste como `TIME X ADVERSÁRIO`.
- Especificar que a busca deve retornar o resultado da partida quando ela existir.
- Especificar que a busca deve informar quando a partida ainda não ocorreu.
- Manter o comportamento de consulta atual do backend.

## Capabilities

### New Capabilities
- `match-query-format`: documentação e especificação do formato de consulta de teste `TIME X ADVERSÁRIO`.

### Modified Capabilities

## Impact

- Melhora a clareza da entrada de teste e validação manual.
- Não altera o contrato de eventos Socket.io.
- Pode orientar frontend, documentação e testes automatizados.
