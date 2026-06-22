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
    const gameName = await askQuestion(
      rl,
      '\nDigite o nome do jogo (ou "sair" para encerrar): ',
    );

    const normalizedInput = String(gameName).trim().toLowerCase();

    if (!normalizedInput || normalizedInput === "sair") {
      break;
    }

    try {
      const response = await requestGameResult(socket, gameName);
      console.log(`Status: ${response.status}`);
      console.log(`Resultado: ${response.result}`);
    } catch (error) {
      console.error("Falha na consulta:", error.message);
    }
  }

  rl.close();
  socket.close();
}

main().catch((error) => {
  console.error("Erro inesperado no cliente:", error);
  process.exit(1);
});
