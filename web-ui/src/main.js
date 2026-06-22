import './style.css';
import { io } from 'socket.io-client';

const SERVER_URL = 'http://localhost:5000';
const socket = io(SERVER_URL, {
  transports: ['websocket'],
});

const connectionState = document.querySelector('#connection-state');
const matchList = document.querySelector('#match-list');
const matchDetail = document.querySelector('#match-detail');
const matchCount = document.querySelector('#match-count');

let matches = [];
let selectedMatchId = null;

function setConnectionState(text, kind) {
  connectionState.textContent = text;
  connectionState.className = `badge badge-${kind}`;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function formatDate(value) {
  if (!value) return 'Data indisponível';
  return new Date(value).toLocaleString('pt-BR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function renderMatchList() {
  matchCount.textContent = String(matches.length);

  if (!matches.length) {
    matchList.className = 'match-list empty-state';
    matchList.textContent = 'Nenhuma partida disponível no momento.';
    return;
  }

  matchList.className = 'match-list';
  matchList.innerHTML = matches
    .map((match) => {
      const activeClass = match.id === selectedMatchId ? ' active' : '';
      return `
        <button class="match-card${activeClass}" data-match-id="${match.id}">
          <div class="match-card-top">
            <span class="match-stage">${escapeHtml(match.stage || 'PARTIDA')}</span>
            <span class="match-status status-${escapeHtml(String(match.status || 'unknown').toLowerCase())}">${escapeHtml(match.statusLabel || match.status || 'UNKNOWN')}</span>
          </div>
          <h3>${escapeHtml(match.title)}</h3>
          <div class="match-score">${escapeHtml(match.score)}</div>
          <div class="match-meta">
            <span>${escapeHtml(formatDate(match.utcDate))}</span>
            <span>${escapeHtml(match.group || match.matchday ? `Grupo ${match.group || '-'} • Rodada ${match.matchday ?? '-'}` : 'Fase final')}</span>
          </div>
        </button>
      `;
    })
    .join('');
}

function renderDetail(detail) {
  if (!detail) {
    matchDetail.className = 'detail-card empty-state';
    matchDetail.textContent = 'Selecione uma partida para ver os detalhes.';
    return;
  }

  matchDetail.className = 'detail-card';
  matchDetail.innerHTML = `
    <div class="detail-header">
      <div>
        <p class="detail-kicker">${escapeHtml(detail.competition || 'World Cup')}</p>
        <h3>${escapeHtml(detail.title)}</h3>
      </div>
      <div class="detail-score">${escapeHtml(detail.score)}</div>
    </div>

    <dl class="detail-grid">
      <div><dt>Status</dt><dd>${escapeHtml(detail.statusLabel || detail.status)}</dd></div>
      <div><dt>Área</dt><dd>${escapeHtml(detail.area || 'World')}</dd></div>
      <div><dt>Data</dt><dd>${escapeHtml(formatDate(detail.utcDate))}</dd></div>
      <div><dt>Rodada</dt><dd>${escapeHtml(detail.matchday ?? '-')}</dd></div>
      <div><dt>Grupo</dt><dd>${escapeHtml(detail.group || '-')}</dd></div>
      <div><dt>Fase</dt><dd>${escapeHtml(detail.stage || '-')}</dd></div>
    </dl>

    <div class="detail-note">${escapeHtml(detail.note || 'Detalhes da partida carregados com sucesso.')}</div>
    <div class="detail-footer">Última atualização: ${escapeHtml(formatDate(detail.lastUpdated))}</div>
  `;
}

function updateSelection(matchId) {
  selectedMatchId = Number(matchId);
  renderMatchList();

  const detail = matches.find((match) => match.id === selectedMatchId);
  if (detail) {
    renderDetail(detail);
  }

  socket.emit('get_match_detail', { match_id: selectedMatchId });
}

matchList.addEventListener('click', (event) => {
  const button = event.target.closest('[data-match-id]');
  if (!button) return;
  updateSelection(button.dataset.matchId);
});

socket.on('connect', () => {
  setConnectionState('Conectado', 'ok');
  socket.emit('get_world_cup_matches');
});

socket.on('disconnect', () => {
  setConnectionState('Desconectado', 'error');
});

socket.on('connect_error', () => {
  setConnectionState('Sem conexão', 'error');
});

socket.on('world_cup_matches_response', ({ matches: receivedMatches = [], error = null }) => {
  if (error) {
    matchList.className = 'match-list empty-state';
    matchList.textContent = error;
    matchCount.textContent = '0';
    return;
  }

  matches = receivedMatches;
  selectedMatchId = matches[0]?.id ?? null;
  renderMatchList();

  if (selectedMatchId) {
    renderDetail(matches[0]);
    socket.emit('get_match_detail', { match_id: selectedMatchId });
  }
});

socket.on('match_detail_response', ({ match, error = null }) => {
  if (error) {
    renderDetail(null);
    matchDetail.textContent = error;
    return;
  }

  if (match && match.id === selectedMatchId) {
    renderDetail(match);
  }
});
