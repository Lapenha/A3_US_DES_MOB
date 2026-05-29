import { useEffect, useMemo, useRef, useState } from 'react';
import Board from './components/Board/Board';
import PlayerSetup from './components/PlayerSetup/PlayerSetup';
import {
  GAME_SESSION_STORAGE_KEY,
  GAME_STATUS,
  NIELSEN_HEURISTICS,
} from './domain/constants';
import useAnimalFact from './hooks/useAnimalFact';
import useGame from './hooks/useGame';
import useLeaderboard from './hooks/useLeaderboard';
import './App.css';

const loadSession = () => {
  try {
    const raw = localStorage.getItem(GAME_SESSION_STORAGE_KEY);
    if (!raw) {
      return { players: null, game: null };
    }

    const parsed = JSON.parse(raw);
    const hasPlayers =
      parsed?.players?.player1?.name &&
      parsed?.players?.player1?.animal?.id &&
      parsed?.players?.player2?.name &&
      parsed?.players?.player2?.animal?.id;

    return {
      players: hasPlayers ? parsed.players : null,
      game: parsed?.game ?? null,
    };
  } catch (error) {
    console.warn('[App] Não foi possível restaurar a sessão salva.', error);
    return { players: null, game: null };
  }
};

const saveSession = (payload) => {
  try {
    localStorage.setItem(GAME_SESSION_STORAGE_KEY, JSON.stringify(payload));
  } catch (error) {
    console.warn('[App] Não foi possível salvar a sessão atual.', error);
  }
};

const clearSavedSession = () => {
  try {
    localStorage.removeItem(GAME_SESSION_STORAGE_KEY);
  } catch (error) {
    console.warn('[App] Não foi possível limpar a sessão salva.', error);
  }
};

const getStatusMessage = ({ gameStatus, currentPlayer, players, winner }) => {
  if (!players) {
    return 'Configure os jogadores para iniciar a sessão.';
  }

  if (gameStatus === GAME_STATUS.WIN && winner) {
    return `${players[winner].name} venceu a rodada com ${players[winner].animal.name}.`;
  }

  if (gameStatus === GAME_STATUS.DRAW) {
    return 'Empate! Nenhum jogador pontuou nesta rodada.';
  }

  return `É a vez de ${players[currentPlayer].name} jogar com ${players[currentPlayer].animal.name}.`;
};

const getStatusTone = (gameStatus) => {
  if (gameStatus === GAME_STATUS.WIN) return 'success';
  if (gameStatus === GAME_STATUS.DRAW) return 'warning';
  return 'info';
};

const ScoreCard = ({ title, subtitle, value, badge, active, accentClass }) => (
  <article className={`score-card ${accentClass} ${active ? 'score-card--active' : ''}`}>
    <div className="score-card__header">
      <span className="score-card__badge" aria-hidden="true">
        {badge}
      </span>
      <div>
        <h3 className="score-card__title">{title}</h3>
        <p className="score-card__subtitle">{subtitle}</p>
      </div>
    </div>
    <strong className="score-card__value">{value}</strong>
  </article>
);

const LeaderboardSection = ({ entries, onClear }) => (
  <section className="glass-panel panel-spacing">
    <div className="panel-heading">
      <div>
        <span className="eyebrow">Sessão</span>
        <h2 className="panel-title">Leaderboard</h2>
      </div>
      <button type="button" className="btn btn-outline-secondary btn-sm" onClick={onClear}>
        Limpar ranking
      </button>
    </div>

    {entries.length === 0 ? (
      <p className="empty-state mb-0">
        O ranking aparece aqui conforme as vitórias forem acontecendo na sessão.
      </p>
    ) : (
      <div className="leaderboard-list" role="list" aria-label="Ranking da sessão">
        {entries.map((entry, index) => (
          <div className="leaderboard-item" key={entry.id} role="listitem">
            <div className="leaderboard-item__rank">{String(index + 1).padStart(2, '0')}</div>
            <div className="leaderboard-item__main">
              <div className="leaderboard-item__name">
                <span aria-hidden="true">{entry.animalEmoji}</span>
                {entry.playerName}
              </div>
              <div className="leaderboard-item__meta">{entry.animalName}</div>
            </div>
            <div className="leaderboard-item__score">{entry.wins} vit.</div>
          </div>
        ))}
      </div>
    )}
  </section>
);

const FactSection = ({ winnerPlayer, fact, isLoading, error }) => (
  <section className="glass-panel panel-spacing">
    <div className="panel-heading">
      <div>
        <span className="eyebrow">HTTP + conteúdo educativo</span>
        <h2 className="panel-title">Curiosidade do animal vencedor</h2>
      </div>
    </div>

    {!winnerPlayer ? (
      <p className="empty-state mb-0">
        Finalize uma rodada para carregar uma curiosidade em tempo real sobre o animal vencedor.
      </p>
    ) : null}

    {winnerPlayer && isLoading ? (
      <div className="fact-card fact-card--loading" role="status" aria-live="polite">
        <div className="spinner-border text-success" aria-hidden="true" />
        <span>Buscando fato educativo sobre {winnerPlayer.animal.name}...</span>
      </div>
    ) : null}

    {winnerPlayer && error ? (
      <div className="alert alert-warning mb-0" role="alert">
        {error}
      </div>
    ) : null}

    {winnerPlayer && fact ? (
      <article className="fact-card">
        <div className="fact-card__intro">
          <div className="fact-card__animal">
            <span className="fact-card__emoji" aria-hidden="true">
              {winnerPlayer.animal.emoji}
            </span>
            <div>
              <h3 className="fact-card__title">{fact.title}</h3>
              <p className="fact-card__subtitle">
                {winnerPlayer.name} ganhou a rodada com {winnerPlayer.animal.name}.
              </p>
            </div>
          </div>
          {fact.thumbnail ? (
            <img
              src={fact.thumbnail}
              alt={`Imagem ilustrativa de ${winnerPlayer.animal.name}`}
              className="fact-card__image"
            />
          ) : null}
        </div>
        <p className="fact-card__text">{fact.extract}</p>
      </article>
    ) : null}
  </section>
);

function App() {
  const [initialSession] = useState(loadSession);
  const [players, setPlayers] = useState(initialSession.players);
  const resolvedRoundRef = useRef('');
  const { entries, recordWin, clearLeaderboard } = useLeaderboard();
  const { fact, isLoading, error, fetchFact, clearFact } = useAnimalFact();
  const {
    board,
    currentPlayer,
    gameStatus,
    winner,
    winningLine,
    scores,
    makeMove,
    resetRound,
    resetGame,
    snapshot,
  } = useGame(initialSession.game);

  const winnerPlayer = players && winner ? players[winner] : null;
  const filledCells = useMemo(() => board.filter(Boolean).length, [board]);
  const totalRounds = scores.player1 + scores.player2 + scores.draws;
  const statusMessage = getStatusMessage({ gameStatus, currentPlayer, players, winner });
  const roundResolutionKey =
    gameStatus === GAME_STATUS.WIN && winner
      ? `${winner}-${scores[winner]}-${board.join('|')}`
      : gameStatus === GAME_STATUS.DRAW
        ? `draw-${scores.draws}-${board.join('|')}`
        : '';

  useEffect(() => {
    if (!players) {
      clearSavedSession();
      return;
    }

    saveSession({ players, game: snapshot });
  }, [players, snapshot]);

  useEffect(() => {
    if (gameStatus === GAME_STATUS.PLAYING) {
      resolvedRoundRef.current = '';
      clearFact();
      return;
    }

    if (resolvedRoundRef.current === roundResolutionKey) {
      return;
    }

    resolvedRoundRef.current = roundResolutionKey;

    if (gameStatus === GAME_STATUS.WIN && winnerPlayer) {
      fetchFact(winnerPlayer.animal.wikiTitle);
      recordWin(
        winnerPlayer.name,
        winnerPlayer.animal.name,
        winnerPlayer.animal.emoji,
        scores[winner],
      );
    }
  }, [board, clearFact, fetchFact, gameStatus, recordWin, roundResolutionKey, scores, winner, winnerPlayer]);

  const handleStartGame = (nextPlayers) => {
    resolvedRoundRef.current = '';
    setPlayers(nextPlayers);
    clearFact();
    resetGame();
  };

  const handleRestartRound = () => {
    resolvedRoundRef.current = '';
    clearFact();
    resetRound();
  };

  const handleResetSession = () => {
    resolvedRoundRef.current = '';
    clearFact();
    resetGame();
  };

  const handleChangePlayers = () => {
    resolvedRoundRef.current = '';
    clearFact();
    resetGame();
    setPlayers(null);
  };

  return (
    <main className="app-shell">
      <div className="app-shell__aurora app-shell__aurora--one" aria-hidden="true" />
      <div className="app-shell__aurora app-shell__aurora--two" aria-hidden="true" />

      <div className="container py-4 py-lg-5">
        {!players ? (
          <PlayerSetup onStartGame={handleStartGame} />
        ) : (
          <div className="game-layout">
            <section className="hero-panel mb-4">
              <div className="hero-panel__top">
                <div>
                  <span className="eyebrow">ODS 15 • Vida terrestre</span>
                  <h1 className="hero-panel__title">Jogo da Velha Educativo dos Animais</h1>
                  <p className="hero-panel__subtitle">
                    Uma experiência interativa com React, Bootstrap, animações e curiosidades em
                    tempo real sobre espécies que merecem proteção.
                  </p>
                </div>
                <div className="hero-panel__summary">
                  <span className={`status-pill status-pill--${getStatusTone(gameStatus)}`}>
                    {gameStatus === GAME_STATUS.WIN
                      ? 'Rodada finalizada'
                      : gameStatus === GAME_STATUS.DRAW
                        ? 'Empate'
                        : 'Partida em andamento'}
                  </span>
                  <strong>{totalRounds} rodada(s)</strong>
                  <span>{filledCells}/9 casas ocupadas</span>
                </div>
              </div>

              <div className="hero-progress" aria-hidden="true">
                <div className="hero-progress__bar" style={{ width: `${(filledCells / 9) * 100}%` }} />
              </div>
            </section>

            <div className="row g-4">
              <div className="col-xl-8">
                <section className="glass-panel panel-spacing">
                  <div className={`status-banner status-banner--${getStatusTone(gameStatus)}`} aria-live="polite">
                    <div>
                      <span className="eyebrow">Status da rodada</span>
                      <h2 className="panel-title mb-1">Feedback imediato para os jogadores</h2>
                      <p className="mb-0">{statusMessage}</p>
                    </div>
                    <span className="status-banner__emoji" aria-hidden="true">
                      {winnerPlayer ? winnerPlayer.animal.emoji : players[currentPlayer].animal.emoji}
                    </span>
                  </div>

                  <div className="score-grid">
                    <ScoreCard
                      title={players.player1.name}
                      subtitle={players.player1.animal.name}
                      value={scores.player1}
                      badge={players.player1.animal.emoji}
                      active={gameStatus === GAME_STATUS.PLAYING && currentPlayer === 'player1'}
                      accentClass="score-card--player1"
                    />
                    <ScoreCard
                      title={players.player2.name}
                      subtitle={players.player2.animal.name}
                      value={scores.player2}
                      badge={players.player2.animal.emoji}
                      active={gameStatus === GAME_STATUS.PLAYING && currentPlayer === 'player2'}
                      accentClass="score-card--player2"
                    />
                    <ScoreCard
                      title="Empates"
                      subtitle="Rodadas sem vencedor"
                      value={scores.draws}
                      badge="🤝"
                      active={gameStatus === GAME_STATUS.DRAW}
                      accentClass="score-card--draw"
                    />
                  </div>

                  <div className="board-stage">
                    <Board
                      board={board}
                      winningLine={winningLine}
                      isGameOver={gameStatus !== GAME_STATUS.PLAYING}
                      currentPlayer={currentPlayer}
                      players={players}
                      onCellClick={makeMove}
                    />
                  </div>

                  <div className="action-bar">
                    <button type="button" className="btn btn-success" onClick={handleRestartRound}>
                      {gameStatus === GAME_STATUS.PLAYING ? 'Cancelar e reiniciar rodada' : 'Nova rodada'}
                    </button>
                    <button type="button" className="btn btn-outline-primary" onClick={handleResetSession}>
                      Zerar placar
                    </button>
                    <button type="button" className="btn btn-outline-dark" onClick={handleChangePlayers}>
                      Trocar jogadores
                    </button>
                  </div>
                </section>

                <FactSection
                  winnerPlayer={winnerPlayer}
                  fact={fact}
                  isLoading={isLoading}
                  error={error}
                />
              </div>

              <div className="col-xl-4">
                <LeaderboardSection entries={entries} onClear={clearLeaderboard} />

                <section className="glass-panel panel-spacing">
                  <div className="panel-heading">
                    <div>
                      <span className="eyebrow">Usabilidade</span>
                      <h2 className="panel-title">Heurísticas de Nielsen</h2>
                    </div>
                  </div>

                  <div className="heuristics-list">
                    {NIELSEN_HEURISTICS.map((heuristic) => (
                      <article className="heuristic-card" key={heuristic.id}>
                        <h3>{heuristic.title}</h3>
                        <p>{heuristic.description}</p>
                      </article>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default App;
