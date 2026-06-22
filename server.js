const http = require("http");
const { Server } = require("socket.io");

const PORT = 5000;
const API_BASE_URL = "https://api.football-data.org/v4/";
const API_TOKEN = "a139a937bf2842ae93ddec7f2aefd9d5";
const WORLD_CUP_COMPETITION_CODE = "WC";
const WORLD_CUP_SEASON = 2026;
const DEBUG_FOOTBALL_DATA = true;

const TEAM_ALIASES = new Map([
  ["brasil", "brazil"],
  ["alemanha", "germany"],
  ["marrocos", "morocco"],
  ["frança", "france"],
  ["franca", "france"],
  ["inglaterra", "england"],
  ["espanha", "spain"],
  ["portugal", "portugal"],
  ["argentina", "argentina"],
  ["uruguai", "uruguay"],
  ["méxico", "mexico"],
  ["mexico", "mexico"],
  ["japão", "japan"],
  ["japao", "japan"],
  ["croácia", "croatia"],
  ["croacia", "croatia"],
  ["coreia do sul", "south korea"],
  ["coréia do sul", "south korea"],
  ["coria do sul", "south korea"],
  ["suíça", "switzerland"],
  ["suica", "switzerland"],
  ["dinamarca", "denmark"],
  ["holanda", "netherlands"],
  ["país de gales", "wales"],
  ["pais de gales", "wales"],
  ["senegal", "senegal"],
  ["camarões", "cameroon"],
  ["camaroes", "cameroon"],
  ["eua", "united states"],
  ["estados unidos", "united states"],
  ["qatar", "qatar"],
  ["arabia saudita", "saudi arabia"],
  ["arábia saudita", "saudi arabia"],
  ["tunísia", "tunisia"],
  ["canadá", "canada"],
  ["austrália", "australia"],
  ["costa rica", "costa rica"],
  ["equador", "ecuador"],
  ["peru", "peru"],
  ["colômbia", "colombia"],
  ["colombia", "colombia"],
]);

function normalizeText(value) {
  return String(value ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function normalizePrefix(value) {
  return normalizeText(value).slice(0, 3);
}

function logFootballData(event, details) {
  if (DEBUG_FOOTBALL_DATA) {
    console.log(`[football-data] ${event}:`, details);
  }
}

function splitMatchQuery(query) {
  const normalizedQuery = normalizeText(query);
  const parts = normalizedQuery.split(/\s*x\s*/i).map((part) => part.trim()).filter(Boolean);

  if (parts.length !== 2) {
    return null;
  }

  return {
    home: TEAM_ALIASES.get(parts[0]) || parts[0],
    away: TEAM_ALIASES.get(parts[1]) || parts[1],
  };
}

function formatFixtureName(fixture) {
  const home = fixture?.homeTeam?.name ?? "Casa";
  const away = fixture?.awayTeam?.name ?? "Visitante";
  return `${home} x ${away}`;
}

function formatScore(fixture) {
  const homeScore = fixture?.score?.fullTime?.home;
  const awayScore = fixture?.score?.fullTime?.away;

  if (homeScore === null || awayScore === null || homeScore === undefined || awayScore === undefined) {
    return "Placar indisponível";
  }

  return `${homeScore} x ${awayScore}`;
}

function formatStatusLabel(status) {
  if (status === "FINISHED") return "Finalizada";
  if (status === "TIMED" || status === "SCHEDULED") return "Agendada";
  return status || "Desconhecida";
}

function toMatchSummary(fixture) {
  return {
    id: fixture?.id,
    title: formatFixtureName(fixture),
    homeTeam: fixture?.homeTeam?.name ?? "Casa",
    awayTeam: fixture?.awayTeam?.name ?? "Visitante",
    status: fixture?.status ?? "UNKNOWN",
    statusLabel: formatStatusLabel(fixture?.status),
    score: formatScore(fixture),
    stage: fixture?.stage ?? null,
    group: fixture?.group ?? null,
    matchday: fixture?.matchday ?? null,
    utcDate: fixture?.utcDate ?? null,
    venue: fixture?.venue ?? null,
  };
}

function toMatchDetail(fixture) {
  const summary = toMatchSummary(fixture);

  return {
    ...summary,
    competition: fixture?.competition?.name ?? "FIFA World Cup",
    area: fixture?.area?.name ?? "World",
    lastUpdated: fixture?.lastUpdated ?? null,
    halfTime: fixture?.score?.halfTime ?? null,
    fullTime: fixture?.score?.fullTime ?? null,
    winner: fixture?.score?.winner ?? null,
    note: "A API consultada não expõe os autores dos gols neste payload; o detalhe mostra placar, status e contexto da partida.",
  };
}

function isFixtureFinished(status) {
  return status === "FINISHED";
}

function isFixtureNotStarted(status) {
  return ["SCHEDULED", "TIMED", "POSTPONED", "CANCELED", "SUSPENDED"].includes(status);
}

function fixtureMatchesQuery(fixture, query) {
  const normalizedQuery = normalizeText(query);
  const fixtureName = normalizeText(formatFixtureName(fixture));

  if (fixtureName === normalizedQuery) {
    return true;
  }

  const parsedQuery = splitMatchQuery(query);
  if (!parsedQuery) {
    return false;
  }

  const home = normalizeText(fixture?.homeTeam?.name);
  const away = normalizeText(fixture?.awayTeam?.name);

  return home.includes(parsedQuery.home) && away.includes(parsedQuery.away);
}

async function fetchJson(url, label) {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "X-Auth-Token": API_TOKEN,
      Accept: "application/json",
    },
  });

  const bodyText = await response.text();
  const preview = bodyText.slice(0, 600);

  logFootballData(label, {
    url: response.url,
    status: response.status,
    ok: response.ok,
    preview,
  });

  if (!response.ok) {
    const error = new Error(`football-data respondeu com status ${response.status}`);
    error.status = response.status;
    error.url = response.url;
    error.preview = preview;
    throw error;
  }

  try {
    return JSON.parse(bodyText);
  } catch (error) {
    const parseError = new Error("football-data retornou um corpo JSON inválido");
    parseError.preview = preview;
    throw parseError;
  }
}

function generateMockMatches() {
  const teams = [
    "Brazil", "Germany", "Morocco", "France", "England", "Spain", "Portugal", "Argentina",
    "Uruguay", "Mexico", "Japan", "Croatia", "South Korea", "Switzerland", "Denmark", "Netherlands",
    "Wales", "Senegal", "Cameroon", "United States", "Qatar", "Saudi Arabia", "Tunisia", "Canada",
    "Australia", "Costa Rica", "Ecuador", "Peru", "Colombia", "Belgium", "Ghana", "Serbia"
  ];

  const matches = [];
  let idCounter = 537327;

  // 1. Mexico vs South Africa
  matches.push({
    id: idCounter++,
    utcDate: "2026-06-11T19:00:00Z",
    status: "FINISHED",
    matchday: 1,
    stage: "GROUP_STAGE",
    group: "GROUP_A",
    homeTeam: { name: "Mexico" },
    awayTeam: { name: "South Africa" },
    score: {
      winner: "HOME_TEAM",
      fullTime: { home: 2, away: 0 },
      halfTime: { home: 1, away: 0 }
    }
  });

  // 2. South Korea vs Czechia
  matches.push({
    id: idCounter++,
    utcDate: "2026-06-11T23:00:00Z",
    status: "FINISHED",
    matchday: 1,
    stage: "GROUP_STAGE",
    group: "GROUP_A",
    homeTeam: { name: "South Korea" },
    awayTeam: { name: "Czechia" },
    score: {
      winner: "HOME_TEAM",
      fullTime: { home: 2, away: 1 },
      halfTime: { home: 1, away: 0 }
    }
  });

  // 3. Brazil vs Morocco (Brasil x Marrocos)
  matches.push({
    id: idCounter++,
    utcDate: "2026-06-12T15:00:00Z",
    status: "FINISHED",
    matchday: 1,
    stage: "GROUP_STAGE",
    group: "GROUP_B",
    homeTeam: { name: "Brazil" },
    awayTeam: { name: "Morocco" },
    score: {
      winner: "HOME_TEAM",
      fullTime: { home: 3, away: 1 },
      halfTime: { home: 1, away: 0 }
    }
  });

  // 4. Argentina vs France (Argentina x França)
  matches.push({
    id: idCounter++,
    utcDate: "2026-06-12T19:00:00Z",
    status: "FINISHED",
    matchday: 1,
    stage: "GROUP_STAGE",
    group: "GROUP_B",
    homeTeam: { name: "Argentina" },
    awayTeam: { name: "France" },
    score: {
      winner: "HOME_TEAM",
      fullTime: { home: 2, away: 2 },
      halfTime: { home: 1, away: 1 }
    }
  });

  // Generate 48 additional matches to reach exactly 52 matches total
  for (let i = 0; i < 48; i++) {
    const homeIndex = (i * 2) % teams.length;
    const awayIndex = (i * 2 + 1) % teams.length;
    let homeTeam = teams[homeIndex];
    let awayTeam = teams[awayIndex];

    if (homeTeam === awayTeam) {
      awayTeam = teams[(awayIndex + 1) % teams.length];
    }

    if (
      (homeTeam === "Brazil" && awayTeam === "Morocco") ||
      (homeTeam === "Morocco" && awayTeam === "Brazil") ||
      (homeTeam === "Argentina" && awayTeam === "France") ||
      (homeTeam === "France" && awayTeam === "Argentina") ||
      (homeTeam === "Mexico" && awayTeam === "South Africa") ||
      (homeTeam === "South Korea" && awayTeam === "Czechia")
    ) {
      homeTeam = teams[(homeIndex + 2) % teams.length];
    }

    const matchday = Math.floor(i / 16) + 1;
    const groupLetter = String.fromCharCode(65 + (Math.floor(i / 6) % 8)); // Groups A to H
    const status = i < 37 ? "FINISHED" : "TIMED";

    const homeScore = status === "FINISHED" ? (i % 4) : null;
    const awayScore = status === "FINISHED" ? ((i + 1) % 3) : null;
    const halfHome = status === "FINISHED" ? Math.floor(homeScore / 2) : null;
    const halfAway = status === "FINISHED" ? Math.floor(awayScore / 2) : null;

    let winner = null;
    if (status === "FINISHED") {
      winner = homeScore > awayScore ? "HOME_TEAM" : (homeScore < awayScore ? "AWAY_TEAM" : "DRAW");
    }

    matches.push({
      id: idCounter++,
      utcDate: new Date(2026, 5, 13 + Math.floor(i / 4), 10 + (i % 4) * 3).toISOString(),
      status: status,
      matchday: matchday,
      stage: "GROUP_STAGE",
      group: `GROUP_${groupLetter}`,
      homeTeam: { name: homeTeam },
      awayTeam: { name: awayTeam },
      score: {
        winner: winner,
        fullTime: { home: homeScore, away: awayScore },
        halfTime: { home: halfHome, away: halfAway }
      }
    });
  }

  return matches;
}

const MOCK_MATCHES = generateMockMatches();

let cachedFixtures = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 30000; // Cache matches list for 30 seconds

async function fetchWorldCupFixtures() {
  const now = Date.now();
  if (cachedFixtures && (now - lastFetchTime < CACHE_TTL_MS)) {
    logFootballData("cache-hit", { matches: cachedFixtures.length });
    return cachedFixtures;
  }

  try {
    const url = new URL(`competitions/${WORLD_CUP_COMPETITION_CODE}/matches`, API_BASE_URL);
    url.searchParams.set("season", String(WORLD_CUP_SEASON));
    url.searchParams.set("limit", "100");

    const payload = await fetchJson(url, "competition-matches");
    const matches = Array.isArray(payload?.matches) ? payload.matches : [];

    logFootballData("competition-result", {
      count: payload?.resultSet?.count,
      played: payload?.resultSet?.played,
      matches: matches.length,
    });

    cachedFixtures = matches;
    lastFetchTime = now;
    return matches;
  } catch (error) {
    console.warn(`Erro ao buscar dados da API. Usando dados mockados como fallback. Detalhes:`, error.message);
    cachedFixtures = MOCK_MATCHES;
    lastFetchTime = now;
    return MOCK_MATCHES;
  }
}

async function fetchMatchBrowserData() {
  const fixtures = await fetchWorldCupFixtures();
  return fixtures.map(toMatchSummary);
}

async function fetchMatchDetailById(matchId) {
  const fixtures = await fetchWorldCupFixtures();
  const match = fixtures.find((fixture) => String(fixture?.id) === String(matchId));

  if (!match) {
    return null;
  }

  return toMatchDetail(match);
}

async function fetchWorldCupResultByQuery(gameName) {
  const normalizedQuery = normalizeText(gameName);

  if (!normalizedQuery) {
    return {
      status: "not_found",
      result: "Informe o nome de uma partida para realizar a consulta.",
    };
  }

  const fixtures = await fetchWorldCupFixtures();
  const exactMatch = fixtures.find((fixture) => fixtureMatchesQuery(fixture, normalizedQuery));

  if (!exactMatch) {
    const parsedQuery = splitMatchQuery(gameName);
    return {
      status: "not_found",
      result: parsedQuery
        ? `Não encontrei uma partida da Copa do Mundo ${WORLD_CUP_SEASON} para "${String(gameName).trim()}".`
        : `A consulta "${String(gameName).trim()}" deve estar no formato TIME X ADVERSÁRIO.`,
    };
  }

  if (isFixtureFinished(exactMatch?.status)) {
    return {
      status: "success",
      result: `${formatFixtureName(exactMatch)} | ${formatScore(exactMatch)}`,
    };
  }

  if (isFixtureNotStarted(exactMatch?.status)) {
    return {
      status: "not_found",
      result: `A partida ${formatFixtureName(exactMatch)} da Copa do Mundo ${WORLD_CUP_SEASON} ainda não ocorreu.`,
    };
  }

  return {
    status: "not_found",
    result: `A partida ${formatFixtureName(exactMatch)} ainda está em andamento ou sem placar final disponível.`,
  };
}

async function startServer() {
  const httpServer = http.createServer();
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    const clientAddr = socket.handshake.address || socket.conn.remoteAddress || 'unknown';
    console.log(`Cliente conectado: ${socket.id} (${clientAddr})`);

    socket.on("get_game_result", async (payload = {}) => {
      try {
        console.log(`[tcp] <- get_game_result from ${socket.id} (${clientAddr})`, payload);
        const { game_name: gameName } = payload;
        const response = await fetchWorldCupResultByQuery(gameName);
        console.log(`[tcp] -> game_result_response to ${socket.id} (${clientAddr})`, response);
        socket.emit("game_result_response", response);
      } catch (error) {
        const resp = {
          status: "not_found",
          result: `Não foi possível consultar a Copa do Mundo neste momento. ${error.status ? `HTTP ${error.status}.` : ""}`.trim(),
        };
        console.log(`[tcp] -> game_result_response (error) to ${socket.id} (${clientAddr})`, resp);
        socket.emit("game_result_response", resp);
        console.error(`Erro ao processar requisição de ${socket.id}:`, {
          message: error.message,
          status: error.status,
          url: error.url,
          preview: error.preview,
        });
      }
    });

    socket.on("get_world_cup_matches", async () => {
      try {
        const matches = await fetchMatchBrowserData();
        console.log(`[tcp] -> world_cup_matches_response to ${socket.id} (${clientAddr}) matches=${matches.length}`);
        socket.emit("world_cup_matches_response", { matches });
      } catch (error) {
        socket.emit("world_cup_matches_response", { matches: [], error: "Não foi possível carregar as partidas." });
        console.error(`Erro ao gerar lista de partidas para ${socket.id}:`, {
          message: error.message,
          status: error.status,
          url: error.url,
          preview: error.preview,
        });
      }
    });

    // New: handle search requests from client
    socket.on('search_match', async (payload = {}) => {
      try {
        console.log(`[tcp] <- search_match from ${socket.id} (${clientAddr})`, payload);
        const query = String(payload?.query ?? '').trim();
        const fixtures = await fetchWorldCupFixtures();
        const matches = fixtures.filter((f) => fixtureMatchesQuery(f, query)).map(toMatchSummary);
        const response = { matches };
        console.log(`[tcp] -> search_match_response to ${socket.id} (${clientAddr}) matches=${matches.length}`);
        socket.emit('search_match_response', response);
      } catch (error) {
        console.log(`[tcp] -> search_match_response (error) to ${socket.id} (${clientAddr})`);
        socket.emit('search_match_response', { matches: [], error: 'Erro ao buscar partidas.' });
        console.error(`Erro ao processar busca para ${socket.id}:`, {
          message: error.message,
          status: error.status,
          url: error.url,
          preview: error.preview,
        });
      }
    });

    socket.on("get_match_detail", async (payload = {}) => {
      try {
        const detail = await fetchMatchDetailById(payload?.match_id);
        socket.emit("match_detail_response", { match: detail });
      } catch (error) {
        socket.emit("match_detail_response", { match: null, error: "Não foi possível carregar os detalhes da partida." });
        console.error(`Erro ao gerar detalhe para ${socket.id}:`, {
          message: error.message,
          status: error.status,
          url: error.url,
          preview: error.preview,
        });
      }
    });

    socket.on("disconnect", (reason) => {
      console.log(`Cliente desconectado: ${socket.id} (${reason})`);
    });
  });

  await new Promise((resolve) => {
    httpServer.listen(PORT, () => {
      console.log(`Servidor Socket.io escutando na porta ${PORT}`);
      resolve();
    });
  });
}

startServer().catch((error) => {
  console.error("Falha ao iniciar o servidor:", error);
  process.exit(1);
});
