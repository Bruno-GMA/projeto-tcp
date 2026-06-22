## Why

O cliente atual depende apenas de terminal, o que dificulta a interação para usuários não técnicos e torna a demonstração do sistema menos intuitiva. Uma interface web simples com Vite melhora a usabilidade sem alterar o contrato Socket.io já definido.

## What Changes

- Adicionar uma página web simples para consulta de resultados de jogos.
- Permitir entrada do nome do jogo em um campo visual com botão de envio.
- Exibir a resposta do servidor na própria página de forma clara e imediata.
- Manter o servidor Socket.io e o contrato de eventos existentes sem mudanças.
- Preservar o cliente de terminal e os testes automatizados já implementados.

## Capabilities

### New Capabilities
- `web-ui`: interface web simples em Vite para consultar jogos e visualizar respostas do servidor.

### Modified Capabilities

## Impact

- Novo frontend web com Vite e Socket.io-client.
- Nova camada de interação para usuários finais.
- Nenhuma alteração esperada no contrato de eventos do backend.
- Atualização da estrutura do projeto para suportar um frontend separado do cliente de terminal.
