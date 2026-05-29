/**
 * @fileoverview Componente raiz do Jogo da Memória – Animais em Extinção (ODS 15)
 *
 * Heurísticas de Nielsen implementadas aqui:
 * 1. Visibilidade do status: stats-bar com moves/timer/pares/progresso em tempo real
 * 2. Controle e liberdade: botões "Jogar Novamente" e "Trocar Jogador"
 * 3. Prevenção de erros: cliques bloqueados durante animação (no useMemory)
 * 4. Reconhecimento: pares encontrados ficam visíveis na grade
 * 5. Estética minimalista: layout limpo, leaderboard e heurísticas em seções colapsadas abaixo
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import MemoryBoard from './components/MemoryBoard/MemoryBoard';
import PlayerSetup from './components/PlayerSetup/PlayerSetup';
import { GAME_SESSION_STORAGE_KEY, GAME_STATUS } from './domain/constants';
import useAnimalFact from './hooks/useAnimalFact';
import useLeaderboard from './hooks/useLeaderboard';
import useMemory from './hooks/useMemory';
import './App.css';

// ─── Helpers ────────────────────────────────────────────────────────────────

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

const loadPlayerName = () => {
  try {
    return localStorage.getItem(GAME_SESSION_STORAGE_KEY) || '';
  } catch {
    return '';
  }
};

const savePlayerName = (name) => {
  try {
    localStorage.setItem(GAME_SESSION_STORAGE_KEY, name);
  } catch { /* silent */ }
};

// ─── Sub-componentes ─────────────────────────────────────────────────────────

const StatItem = ({ icon, label, value, highlight }) => (
  <div className={`stat-item ${highlight ? 'stat-item--highlight' : ''}`}>
    <span className="stat-item__icon" aria-hidden="true">{icon}</span>
    <div>
      <div className="stat-item__value">{value}</div>
      <div className="stat-item__label">{label}</div>
    </div>
  </div>
);

const LeaderboardSection = ({ entries, onClear }) => (
  <section className="glass-panel panel-spacing h-100">
    <div className="panel-heading">
      <div>
        <span className="eyebrow">Sessão</span>
        <h2 className="panel-title">Leaderboard</h2>
      </div>
      <button type="button" className="btn btn-outline-secondary btn-sm" onClick={onClear}>
        Limpar
      </button>
    </div>

    {entries.length === 0 ? (
      <p className="empty-state mb-0">
        Complete o jogo para entrar no ranking! Menos jogadas = melhor posição.
      </p>
    ) : (
      <div role="list" aria-label="Ranking da sessão">
        {entries.map((entry, i) => (
          <div className="leaderboard-item" key={entry.id} role="listitem">
            <div className="leaderboard-item__rank">{String(i + 1).padStart(2, '0')}</div>
            <div className="leaderboard-item__main">
              <div className="leaderboard-item__name">{entry.playerName}</div>
              <div className="leaderboard-item__meta">
                {entry.moves} jogadas · {formatTime(entry.timeSeconds)}
              </div>
            </div>
            <div className="leaderboard-item__score">🏅</div>
          </div>
        ))}
      </div>
    )}
  </section>
);

const FactSection = ({ animal, fact, isLoading, error }) => (
  <section className="glass-panel panel-spacing h-100">
    <div>
      <span className="eyebrow">Conteúdo educativo</span>
      <h2 className="panel-title">Curiosidade</h2>
    </div>

    {!animal && !isLoading && (
      <p className="empty-state mt-2 mb-0">
        Encontre um par para carregar uma curiosidade da Wikipédia em tempo real! 🌍
      </p>
    )}

    {isLoading && (
      <div className="fact-card fact-card--loading mt-2" role="status" aria-live="polite">
        <div className="spinner-border text-success" aria-hidden="true" />
        <span>Buscando sobre {animal?.name}…</span>
      </div>
    )}

    {error && !isLoading && (
      <div className="alert alert-warning mt-2 mb-0" role="alert">{error}</div>
    )}

    {fact && !isLoading && (
      <article className="fact-card mt-2">
        <div className="fact-card__animal">
          <span className="fact-card__emoji" aria-hidden="true">{animal?.emoji}</span>
          <div>
            <h3 className="fact-card__title">{fact.title}</h3>
            <p className="fact-card__subtitle">ODS 15 – Vida Terrestre</p>
          </div>
        </div>
        {fact.thumbnail && (
          <img
            src={fact.thumbnail}
            alt={`Imagem de ${animal?.name}`}
            className="fact-card__image w-100"
          />
        )}
        <p className="fact-card__text">{fact.extract}</p>
      </article>
    )}
  </section>
);

// ─── App ─────────────────────────────────────────────────────────────────────

function App() {
  const [playerName, setPlayerName] = useState(loadPlayerName);
  const { entries, recordScore, clearLeaderboard } = useLeaderboard();
  const { fact, isLoading: factLoading, error: factError, fetchFact, clearFact } = useAnimalFact();
  const {
    cards, moves, timeSeconds, matchedPairs, gameStatus, lastMatchedAnimal,
    flipCard, resetGame,
  } = useMemory();

  const totalPairs = 8;
  const progressPct = Math.round((matchedPairs / totalPairs) * 100);
  const isPlaying = gameStatus === GAME_STATUS.PLAYING;
  const isWon = gameStatus === GAME_STATUS.WON;

  // Fact fetching: busca ao encontrar novo par
  const lastFetchedAnimalRef = useRef(null);
  useEffect(() => {
    if (!lastMatchedAnimal) return;
    if (lastFetchedAnimalRef.current === lastMatchedAnimal.animalId) return;
    lastFetchedAnimalRef.current = lastMatchedAnimal.animalId;
    fetchFact(lastMatchedAnimal.wikiTitle);
  }, [lastMatchedAnimal, fetchFact]);

  // Registra no leaderboard ao vencer
  const recordedRef = useRef(false);
  useEffect(() => {
    if (isWon && playerName && !recordedRef.current) {
      recordedRef.current = true;
      recordScore(playerName, moves, timeSeconds);
    }
  }, [isWon, playerName, moves, timeSeconds, recordScore]);

  const handleStartGame = useCallback(({ playerName: name }) => {
    savePlayerName(name);
    setPlayerName(name);
    recordedRef.current = false;
    lastFetchedAnimalRef.current = null;
    clearFact();
    resetGame();
  }, [clearFact, resetGame]);

  const handlePlayAgain = useCallback(() => {
    recordedRef.current = false;
    lastFetchedAnimalRef.current = null;
    clearFact();
    resetGame();
  }, [clearFact, resetGame]);

  const handleChangePlayer = useCallback(() => {
    recordedRef.current = false;
    lastFetchedAnimalRef.current = null;
    clearFact();
    resetGame();
    setPlayerName('');
    savePlayerName('');
  }, [clearFact, resetGame]);

  if (!playerName) {
    return (
      <main className="app-shell">
        <div className="app-shell__aurora app-shell__aurora--one" aria-hidden="true" />
        <div className="app-shell__aurora app-shell__aurora--two" aria-hidden="true" />
        <div className="container py-4 py-lg-5">
          <PlayerSetup onStartGame={handleStartGame} />
        </div>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <div className="app-shell__aurora app-shell__aurora--one" aria-hidden="true" />
      <div className="app-shell__aurora app-shell__aurora--two" aria-hidden="true" />

      <div className="container-xl py-3 py-lg-4">
        {/* Cabeçalho */}
        <header className="game-header mb-3">
          <div>
            <span className="eyebrow">🌿 ODS 15 · Vida Terrestre</span>
            <h1 className="game-header__title">
              Jogo da Memória
              <span className="game-header__player"> — {playerName}</span>
            </h1>
          </div>
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={handleChangePlayer}
          >
            Trocar jogador
          </button>
        </header>

        {/* Stats bar */}
        <div className="stats-bar glass-panel mb-3" aria-live="polite" aria-atomic="true">
          <StatItem icon="👆" label="Jogadas" value={moves} />
          <StatItem icon="⏱️" label="Tempo" value={formatTime(timeSeconds)} />
          <StatItem icon="🐘" label="Pares" value={`${matchedPairs}/${totalPairs}`} />
          <div className="stat-item stat-item--progress">
            <span className="stat-item__icon" aria-hidden="true">📊</span>
            <div style={{ flex: 1 }}>
              <div className="stat-item__value">{progressPct}%</div>
              <div className="progress stat-progress" role="progressbar"
                aria-valuenow={progressPct} aria-valuemin={0} aria-valuemax={100}>
                <div className="progress-bar bg-success" style={{ width: `${progressPct}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Layout 3 colunas: curiosidade | tabuleiro | leaderboard
            Mobile: tabuleiro → curiosidade → leaderboard
            Tablet (md): tabuleiro em cima, curiosidade + leaderboard lado a lado embaixo
            Desktop (lg+): 3 colunas lado a lado */}
        <div className="row g-3 align-items-start">

          {/* CENTRO — tabuleiro (mobile: 1º, desktop: coluna do meio) */}
          <div className="col-12 col-lg-6 order-1 order-lg-2">
            {isWon && (
              <div className="win-banner mb-3" role="alert" aria-live="assertive">
                <span className="win-banner__emoji">🎉</span>
                <div>
                  <strong>Parabéns, {playerName}!</strong>
                  <p className="mb-0">
                    Você completou em <strong>{moves} jogadas</strong> e{' '}
                    <strong>{formatTime(timeSeconds)}</strong>!
                  </p>
                </div>
                <button type="button" className="btn btn-success btn-sm ms-auto" onClick={handlePlayAgain}>
                  Jogar Novamente
                </button>
              </div>
            )}

            <div className="board-wrapper glass-panel p-2 p-md-3">
              <MemoryBoard cards={cards} onCardClick={flipCard} />
            </div>

            <div className="text-center mt-2">
              <button type="button" className="btn btn-outline-success btn-sm" onClick={handlePlayAgain}>
                🔄 {isPlaying ? 'Reiniciar' : 'Jogar Novamente'}
              </button>
            </div>
          </div>

          {/* ESQUERDA — curiosidade (mobile: 2º, desktop: coluna esquerda) */}
          <div className="col-12 col-md-6 col-lg-3 order-2 order-lg-1">
            <FactSection
              animal={lastMatchedAnimal}
              fact={fact}
              isLoading={factLoading}
              error={factError}
            />
          </div>

          {/* DIREITA — leaderboard (mobile: 3º, desktop: coluna direita) */}
          <div className="col-12 col-md-6 col-lg-3 order-3 order-lg-3">
            <LeaderboardSection entries={entries} onClear={clearLeaderboard} />
          </div>

        </div>
      </div>
    </main>
  );
}

export default App;
