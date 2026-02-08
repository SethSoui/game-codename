
import { useState, useEffect } from 'react';
import Board from './components/Board';
import type { GameState } from './types';
import { createNewGame, selectCard, passTurn } from './gameLogic';
import './App.css';
import './GameInfo.css';

const STORAGE_KEY = 'codenamesGameState';

function App() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        // 簡易的なデータ検証
        if (parsedState.board && parsedState.currentTeam) {
          return parsedState;
        }
      } catch (e) {
        console.error("Failed to parse saved state:", e);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    return createNewGame();
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
  }, [gameState]);

  const handleNewGame = () => {
    setGameState(createNewGame());
  };

  const handleCardClick = (index: number) => {
    const newState = selectCard(gameState, index);
    setGameState(newState);
  };

  const handlePassTurn = () => {
    setGameState(passTurn(gameState));
  };

  const toggleViewMode = () => {
    setGameState(prev => ({
      ...prev,
      viewMode: prev.viewMode === 'agent' ? 'spymaster' : 'agent',
    }));
  };

  const { board, viewMode, currentTeam, redRemaining, blueRemaining, gameOver, winner } = gameState;

  return (
    <div className="App">
      <header className="app-header">
        <h1>コードネーム風ゲーム</h1>
        <div className="controls">
          <button onClick={toggleViewMode}>
            {viewMode === 'agent' ? 'スパイマスター表示' : 'エージェント表示'}
          </button>
          <button onClick={handlePassTurn} disabled={gameOver}>
            パス
          </button>
          <button onClick={handleNewGame}>
            新規ゲーム
          </button>
        </div>
      </header>

      <div className="game-status">
        <div className="team-info red">赤チーム: 残り {redRemaining}</div>
        <div className={`current-turn ${currentTeam}`}>
          {currentTeam === 'red' ? '赤' : '青'}チームのターン
        </div>
        <div className="team-info blue">青チーム: 残り {blueRemaining}</div>
      </div>

      {gameOver && (
        <div className="game-over-message">
          <h2>ゲーム終了！</h2>
          <p>{winner ? `${winner.toUpperCase()} チームの勝利！` : 'エラー'}</p>
        </div>
      )}

      <main>
        <Board board={board} viewMode={viewMode} onCardClick={handleCardClick} />
      </main>
    </div>
  );
}

export default App;
