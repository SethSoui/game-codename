
import React from 'react';
import type{ CardType, ViewMode } from '../types';
import Card from './Card';
import './Board.css';

type BoardProps = {
  board: CardType[];
  viewMode: ViewMode;
  onCardClick: (index: number) => void;
};

const Board: React.FC<BoardProps> = ({ board, viewMode, onCardClick }) => {
  return (
    <div className="board-grid">
      {board.map((card, index) => (
        <Card
          key={index}
          card={card}
          viewMode={viewMode}
          onCardClick={() => onCardClick(index)}
        />
      ))}
    </div>
  );
};

export default Board;
