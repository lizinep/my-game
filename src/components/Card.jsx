import React from 'react';
import { Sparkles, Check } from 'lucide-react';

export default function Card({
  card,
  isFlipped,
  isMatched,
  isMismatch,
  onClick,
  disabled,
}) {
  const handleClick = () => {
    if (!disabled && !isFlipped && !isMatched) {
      onClick(card);
    }
  };

  return (
    <div
      className={`card-wrapper ${isMatched ? 'is-matched' : ''} ${
        isMismatch ? 'is-mismatch' : ''
      }`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={
        isFlipped || isMatched
          ? `卡牌 ${card.label}`
          : '未翻開的卡牌'
      }
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <div className={`card-inner ${isFlipped || isMatched ? 'flipped' : ''}`}>
        {/* Card Back (Hidden state) */}
        <div className="card-face card-back">
          <div className="card-back-pattern">
            <span className="card-back-symbol">✦</span>
          </div>
          <div className="card-back-shimmer"></div>
        </div>

        {/* Card Front (Revealed state) */}
        <div
          className="card-face card-front"
          style={{ backgroundColor: card.bg }}
        >
          {isMatched && (
            <div className="matched-badge" title="已消除配對">
              <Check className="check-icon" size={14} />
            </div>
          )}
          <div className="card-emoji">{card.emoji}</div>
          <div className="card-label">{card.label}</div>
          {isMatched && <div className="card-matched-overlay"></div>}
        </div>
      </div>
    </div>
  );
}
