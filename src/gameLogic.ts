
import wordsData from './data/words.json';
import type { GameState, CardType, Team, CardRole } from './types';

const TOTAL_CARDS = 25;
const RED_CARDS = 9;
const BLUE_CARDS = 8;
const NEUTRAL_CARDS = 7;
// ASSASSIN_CARDS is 1

function shuffle<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export function createNewGame(): GameState {
  const shuffledWords = shuffle(wordsData.words);
  const gameWords = shuffledWords.slice(0, TOTAL_CARDS);

  const firstTeam: Team = Math.random() < 0.5 ? 'red' : 'blue';
  //下のは現状使わない
  // const secondTeam: Team = firstTeam === 'red' ? 'blue' : 'red';

  const redCardCount = firstTeam === 'red' ? RED_CARDS : BLUE_CARDS;
  const blueCardCount = firstTeam === 'blue' ? RED_CARDS : BLUE_CARDS;

  const roles: CardRole[] = [
    ...Array(redCardCount).fill('red'),
    ...Array(blueCardCount).fill('blue'),
    ...Array(NEUTRAL_CARDS).fill('neutral'),
    'assassin',
  ];
  const shuffledRoles = shuffle(roles);

  const board: CardType[] = gameWords.map((word, index) => ({
    word,
    role: shuffledRoles[index],
    revealed: false,
  }));

  return {
    board,
    currentTeam: firstTeam,
    redRemaining: redCardCount,
    blueRemaining: blueCardCount,
    winner: null,
    gameOver: false,
    viewMode: 'agent',
  };
}

export function selectCard(currentState: GameState, cardIndex: number): GameState {
  if (currentState.gameOver || currentState.board[cardIndex].revealed) {
    return currentState;
  }

  const newState = JSON.parse(JSON.stringify(currentState)) as GameState;
  const card = newState.board[cardIndex];
  card.revealed = true;

  const { currentTeam } = newState;
  const opponentTeam: Team = currentTeam === 'red' ? 'blue' : 'red';

  switch (card.role) {
    case 'assassin':
      newState.gameOver = true;
      newState.winner = opponentTeam;
      break;

    case currentTeam:
      if (currentTeam === 'red') {
        newState.redRemaining--;
      } else {
        newState.blueRemaining--;
      }
      if (newState.redRemaining === 0) {
        newState.gameOver = true;
        newState.winner = 'red';
      } else if (newState.blueRemaining === 0) {
        newState.gameOver = true;
        newState.winner = 'blue';
      }
      break;

    case opponentTeam:
      if (opponentTeam === 'red') {
        newState.redRemaining--;
      } else {
        newState.blueRemaining--;
      }
      if (newState.redRemaining === 0) {
        newState.gameOver = true;
        newState.winner = 'red';
      } else if (newState.blueRemaining === 0) {
        newState.gameOver = true;
        newState.winner = 'blue';
      }
      newState.currentTeam = opponentTeam;
      break;

    case 'neutral':
      newState.currentTeam = opponentTeam;
      break;
  }

  return newState;
}

export function passTurn(currentState: GameState): GameState {
  if (currentState.gameOver) {
    return currentState;
  }

  const newState = JSON.parse(JSON.stringify(currentState)) as GameState;
  newState.currentTeam = newState.currentTeam === 'red' ? 'blue' : 'red';

  return newState;
}
