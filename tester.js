const { io } = require("socket.io-client");

const SERVER_URL = "http://localhost:5000";

function createClient() {
  return io(SERVER_URL, {
    reconnection: false,
    timeout: 5000,
  });
}

function waitForConnection(socket) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error("Não foi possível conectar ao servidor dentro do tempo limite."));
    }, 5000);

    const onConnect = () => {
      cleanup();
      resolve();
    };

    const onError = (error) => {
      cleanup();
      reject(error);
    };

    function cleanup() {
      clearTimeout(timeout);
      socket.off("connect", onConnect);
      socket.off("connect_error", onError);
    }

    socket.once("connect", onConnect);
    socket.once("connect_error", onError);
  });
}

function requestGameResult(socket, gameName) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error("Tempo limite aguardando resposta do servidor."));
    }, 5000);

    const onResponse = (response) => {
      cleanup();
      resolve(response);
    };

    function cleanup() {
      clearTimeout(timeout);
      socket.off("game_result_response", onResponse);
    }

    socket.on("game_result_response", onResponse);
    socket.emit("get_game_result", { game_name: gameName });
  });
}

async function testSequentialCommunication(socket) {
  const totalRequests = 10;
  let successfulResponses = 0;
  let totalResponseTime = 0;

  for (let index = 0; index < totalRequests; index += 1) {
    const startTime = Date.now();
    const response = await requestGameResult(socket, "Brasil x Marrocos");
    const elapsed = Date.now() - startTime;

    totalResponseTime += elapsed;

    if (response.status === "success") {
      successfulResponses += 1;
    }
  }

  const averageResponseTime = totalResponseTime / totalRequests;

  console.log("Teste 1 - Comunicação Básica");
  console.log(`Respostas com sucesso: ${successfulResponses}/${totalRequests}`);
  console.log(`Tempo médio de resposta: ${averageResponseTime.toFixed(2)} ms`);
}

async function testBurstRequests(socket) {
  const totalRequests = 100;
  let receivedResponses = 0;

  const responsesPromise = new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error("Tempo limite aguardando o lote de respostas."));
    }, 10000);

    const onResponse = () => {
      receivedResponses += 1;
      if (receivedResponses === totalRequests) {
        cleanup();
        resolve();
      }
    };

    function cleanup() {
      clearTimeout(timeout);
      socket.off("game_result_response", onResponse);
    }

    socket.on("game_result_response", onResponse);
  });

  const startTime = Date.now();

  for (let index = 0; index < totalRequests; index += 1) {
    socket.emit("get_game_result", {
      game_name: index % 2 === 0 ? "Brasil x Marrocos" : "Argentina x França",
    });
  }

  await responsesPromise;
  const totalElapsed = Date.now() - startTime;

  console.log("Teste 2 - Volume de Requisições");
  console.log(`Tempo total do lote: ${totalElapsed} ms`);
  console.log(`Quantidade total de respostas recebidas: ${receivedResponses}`);
}

async function main() {
  const socket = createClient();

  try {
    await waitForConnection(socket);
    console.log(`Conectado ao servidor para testes: ${socket.id}`);

    await testSequentialCommunication(socket);
    await testBurstRequests(socket);
  } catch (error) {
    console.error("Falha ao executar os testes:", error.message);
    process.exitCode = 1;
  } finally {
    socket.close();
  }
}

main();
