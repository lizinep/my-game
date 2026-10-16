import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Clock, Footprints, RotateCcw, Star, Award } from 'lucide-react';

export default function WinModal({
  moves,
  timeFormatted,
  seconds,
  bestScore,
  isNewRecord,
  onRestart,
}) {
  useEffect(() => {
    // Trigger celebratory confetti effect
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 9999,
    };

    function fire(particleRatio, opts) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });
    fire(0.2, {
      spread: 60,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  }, []);

  // Determine star rating based on moves (minimum is 8 moves for 8 pairs)
  let stars = 3;
  let feedback = '記憶大師！完美表現！';
  if (moves > 18 && moves <= 26) {
    stars = 2;
    feedback = '反應敏捷！表現相當亮眼！';
  } else if (moves > 26) {
    stars = 1;
    feedback = '順利過關！多練幾次會更強！';
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-glow"></div>
        <div className="trophy-wrapper">
          <div className="trophy-circle">
            <Trophy className="trophy-icon" size={48} />
          </div>
        </div>

        <div className="modal-badge">挑戰完成</div>
        <h2 className="modal-title">🎉 恭喜完成！</h2>
        <p className="modal-subtitle">{feedback}</p>

        {/* Star Rating */}
        <div className="stars-row">
          {[1, 2, 3].map((star) => (
            <Star
              key={star}
              size={28}
              className={`star-icon ${star <= stars ? 'active' : 'inactive'}`}
              fill={star <= stars ? '#f59e0b' : 'none'}
            />
          ))}
        </div>

        {/* Game Stats */}
        <div className="stats-grid">
          <div className="stat-box">
            <div className="stat-box-icon">
              <Footprints size={20} />
            </div>
            <div className="stat-box-content">
              <span className="stat-box-label">總步數</span>
              <span className="stat-box-value">{moves} 步</span>
            </div>
          </div>

          <div className="stat-box">
            <div className="stat-box-icon">
              <Clock size={20} />
            </div>
            <div className="stat-box-content">
              <span className="stat-box-label">通關時間</span>
              <span className="stat-box-value">{timeFormatted}</span>
            </div>
          </div>
        </div>

        {isNewRecord && (
          <div className="record-badge">
            <Award size={18} />
            <span>🏆 刷新個人最佳紀錄！</span>
          </div>
        )}

        {/* Restart Button */}
        <button
          id="btn-modal-restart"
          className="btn-restart-large"
          onClick={onRestart}
          autoFocus
        >
          <RotateCcw size={20} />
          <span>重新開始</span>
        </button>
      </div>
    </div>
  );
}
