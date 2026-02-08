
import React from 'react';
import type { CardType, ViewMode } from '../types';
import './Board.css';

type CardProps = {
  card: CardType;
  viewMode: ViewMode;
  onCardClick: () => void;
};

const Card: React.FC<CardProps> = ({ card, viewMode, onCardClick }) => {
  const getCardClass = () => {
    let className = 'card';
    if (card.revealed) {
      className += ` revealed ${card.role}`;
    } else if (viewMode === 'spymaster') {
      className += ` spymaster-hint ${card.role}`;
    }
    return className;
  };

  return (
    <div className={getCardClass()} onClick={card.revealed ? undefined : onCardClick}>
      <span className="card-word">{card.word}</span>
    </div>
  );
};

export default Card;
