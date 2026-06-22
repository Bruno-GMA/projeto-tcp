const readline = require("readline");
const { io } = require("socket.io-client");

const SERVER_URL = "http://localhost:5000";

function createPromptInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

function askQuestion(rl, question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

function requestGameResult(socket, gameName, timeoutMs = 5000) {
  return new Promise((resolve, reject) => {
    const onResponse = (response) => {
      cleanup();
      resolve(response);
    };

    const onTimeout = setTimeout(() => {
      cleanup();
      reject(new Error("Tempo limite excedido aguardando resposta do servidor."));
    }, timeoutMs);

    const cleanup = () => {
      clearTimeout(onTimeout);
      socket.off("game_result_response", onResponse);
    };

    socket.on("game_result_response", onResponse);
    socket.emit("get_game_result", { game_name: gameName });
  });
}

async function main() {
  const socket = io(SERVER_URL, {
    reconnection: true,
  });

  const rl = createPromptInterface();

  socket.on("connect", () => {
    console.log(`Conectado ao servidor: ${socket.id}`);
  });

  socket.on("connect_error", (error) => {
    console.error("Erro ao conectar ao servidor:", error.message);
  });

  process.on("SIGINT", async () => {
    rl.close();
    socket.close();
    process.exit(0);
  });

  await new Promise((resolve) => {
    socket.once("connect", resolve);
  });

  while (true) {
    const command = await askQuestion(
      rl,
      '\nDigite comando (resultado/buscar/sair): ',
    );

    const cmd = String(command).trim().toLowerCase();

    if (!cmd || cmd === "sair") {
      break;
    }

    if (cmd === "resultado") {
      const gameName = await askQuestion(rl, 'Nome do jogo (ex: Brasil x França): ');
      try {
        console.log('[tcp] -> emit get_game_result', { to: SERVER_URL, payload: gameName });
        const response = await requestGameResult(socket, gameName);
        console.log('[tcp] <- game_result_response', response);
        console.log(`Status: ${response.status}`);
        console.log(`Resultado: ${response.result}`);
      } catch (error) {
        console.error("Falha na consulta:", error.message);
      }
      continue;
    }

    if (cmd === "buscar") {
      const query = await askQuestion(rl, 'Pesquisar partidas (ex: brasil x marrocos ou apenas brasil): ');
      const normalized = String(query).trim();
      if (!normalized) {
        console.log('Entrada vazia, pulando.');
        continue;
      }

      // Promise wrapper for search response
      const searchPromise = new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          socket.off('search_match_response', onResp);
          reject(new Error('Tempo limite aguardando resposta de busca.'));
        }, 5000);

        const onResp = (response) => {
          clearTimeout(timeout);
          socket.off('search_match_response', onResp);
          resolve(response);
        };

        socket.on('search_match_response', onResp);
      });

      console.log('[tcp] -> emit search_match', { to: SERVER_URL, payload: normalized });
      socket.emit('search_match', { query: normalized });

      try {
        const resp = await searchPromise;
        console.log('[tcp] <- search_match_response', resp);
        if (Array.isArray(resp.matches) && resp.matches.length) {
          console.log(`Encontradas ${resp.matches.length} partidas:`);
          resp.matches.slice(0, 20).forEach((m) => {
            console.log(`- ${m.title} | ${m.score} | ${m.statusLabel}`);
          });
        } else {
          console.log('Nenhuma partida encontrada para essa consulta.');
        }
      } catch (error) {
        console.error('Erro na busca:', error.message);
      }

      continue;
    }

    console.log('Comando desconhecido. Use "resultado", "buscar" ou "sair".');
  }

  rl.close();
  socket.close();
}

main().catch((error) => {
  console.error("Erro inesperado no cliente:", error);
  process.exit(1);
});
