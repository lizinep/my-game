import React, { useState, useEffect, useRef } from 'react';
import Card from './components/Card';
import WinModal from './components/WinModal';
import { THEMES, generateDeck } from './utils/themes';
import { sounds } from './utils/audio';
import {
  Clock,
  Footprints,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  Trophy,
  Palette,
  CheckCircle2,
} from 'lucide-react';
import './App.css';

export default function App() {
  const [currentThemeId, setCurrentThemeId] = useState('animals');
  const [cards, setCards] = useState([]);
  const [flippedIds, setFlippedIds] = useState([]);
  const [matchedPairIds, setMatchedPairIds] = useState(new Set());
  const [mismatchIds, setMismatchIds] = useState([]);
  const [isLocked, setIsLocked] = useState(false);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [bestScore, setBestScore] = useState(null);
  const [isNewRecord, setIsNewRecord] = useState(false);
  const [showWinModal, setShowWinModal] = useState(false);

  // Load best score on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('memory_card_game_best');
      if (saved) {
        setBestScore(JSON.parse(saved));
      }
    } catch {
      // LocalStorage access fail-safe
    }
  }, []);

  // Sync sound settings
  useEffect(() => {
    sounds.enabled = soundEnabled;
  }, [soundEnabled]);

  // Initialize deck on start or theme change
  const initializeGame = (themeId = currentThemeId) => {
    const newDeck = generateDeck(themeId);
    setCards(newDeck);
    setFlippedIds([]);
    setMatchedPairIds(new Set());
    setMismatchIds([]);
    setIsLocked(false);
    setMoves(0);
    setSeconds(0);
    setIsTimerRunning(false);
    setShowWinModal(false);
    setIsNewRecord(false);
  };

  useEffect(() => {
    initializeGame(currentThemeId);
  }, [currentThemeId]);

  // Timer interval
  useEffect(() => {
    let interval = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  // Format seconds to mm:ss
  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Card click handler
  const handleCardClick = (clickedCard) => {
    if (isLocked) return;
    if (flippedIds.includes(clickedCard.uniqueId)) return;
    if (matchedPairIds.has(clickedCard.pairId)) return;

    // Start timer on first card click
    if (!isTimerRunning && matchedPairIds.size < 8) {
      setIsTimerRunning(true);
    }

    sounds.playFlip();

    // First card of pair
    if (flippedIds.length === 0) {
      setFlippedIds([clickedCard.uniqueId]);
      return;
    }

    // Second card of pair
    if (flippedIds.length === 1) {
      const firstCardId = flippedIds[0];
      const firstCard = cards.find((c) => c.uniqueId === firstCardId);
      const newFlipped = [firstCardId, clickedCard.uniqueId];
      setFlippedIds(newFlipped);
      setMoves((prev) => prev + 1);

      // Check match
      if (firstCard && firstCard.pairId === clickedCard.pairId) {
        // MATCH!
        sounds.playMatch();
        const nextMatched = new Set(matchedPairIds);
        nextMatched.add(clickedCard.pairId);
        setMatchedPairIds(nextMatched);
        setFlippedIds([]);

        // Check if all 8 pairs matched (16 cards)
        if (nextMatched.size === 8) {
          setIsTimerRunning(false);
          sounds.playWin();

          // Evaluate best score
          const currentFinalMoves = moves + 1;
          const currentFinalTime = seconds;
          let newRecordAchieved = false;

          try {
            const saved = localStorage.getItem('memory_card_game_best');
            const currentBest = saved ? JSON.parse(saved) : null;

            if (
              !currentBest ||
              currentFinalMoves < currentBest.moves ||
              (currentFinalMoves === currentBest.moves && currentFinalTime < currentBest.time)
            ) {
              const recordData = {
                moves: currentFinalMoves,
                time: currentFinalTime,
                date: new Date().toLocaleDateString('zh-TW'),
              };
              localStorage.setItem('memory_card_game_best', JSON.stringify(recordData));
              setBestScore(recordData);
              newRecordAchieved = true;
            }
          } catch {}

          setIsNewRecord(newRecordAchieved);
          // Show victory modal after brief moment to appreciate the final match
          setTimeout(() => {
            setShowWinModal(true);
          }, 400);
        }
      } else {
        // MISMATCH
        sounds.playMismatch();
        setIsLocked(true);
        setMismatchIds(newFlipped);

        setTimeout(() => {
          setFlippedIds([]);
          setMismatchIds([]);
          setIsLocked(false);
        }, 850);
      }
    }
  };

  const handleRestart = () => {
    sounds.playRestart();
    initializeGame(currentThemeId);
  };

  const handleThemeChange = (themeId) => {
    setCurrentThemeId(themeId);
  };

  return (
    <div className="game-container">
      {/* Background ambient decorative orbs */}
      <div className="ambient-blob blob-1"></div>
      <div className="ambient-blob blob-2"></div>
      <div className="ambient-blob blob-3"></div>

      <header className="game-header">
        <div className="brand-badge">
          <Sparkles size={16} />
          <span>經典益智挑戰</span>
        </div>
        <h1 className="game-title">記憶翻牌遊戲</h1>
        <p className="game-subtitle">
          共有 16 張卡牌（8 對相同的圖案），翻開兩張相同即可消除！
        </p>
      </header>

      {/* Control & Status Bar */}
      <div className="status-dashboard">
        {/* Moves Counter */}
        <div className="status-pill">
          <div className="status-pill-icon icon-moves">
            <Footprints size={18} />
          </div>
          <div className="status-pill-info">
            <span className="status-pill-label">步數</span>
            <span className="status-pill-value">{moves} 步</span>
          </div>
        </div>

        {/* Timer */}
        <div className="status-pill">
          <div className="status-pill-icon icon-time">
            <Clock size={18} />
          </div>
          <div className="status-pill-info">
            <span className="status-pill-label">計時</span>
            <span className="status-pill-value">{formatTime(seconds)}</span>
          </div>
        </div>

        {/* Match Progress */}
        <div className="status-pill">
          <div className="status-pill-icon icon-match">
            <CheckCircle2 size={18} />
          </div>
          <div className="status-pill-info">
            <span className="status-pill-label">已配對</span>
            <span className="status-pill-value">
              {matchedPairIds.size} / 8 對
            </span>
          </div>
        </div>

        {/* Best Record */}
        {bestScore && (
          <div className="status-pill pill-best">
            <div className="status-pill-icon icon-trophy">
              <Trophy size={18} />
            </div>
            <div className="status-pill-info">
              <span className="status-pill-label">最佳紀錄</span>
              <span className="status-pill-value">
                {bestScore.moves}步 · {formatTime(bestScore.time)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Action Bar (Themes, Sound, Restart) */}
      <div className="action-toolbar">
        {/* Theme Selector */}
        <div className="theme-selector-group">
          <span className="theme-selector-label">
            <Palette size={15} />
            <span>主題：</span>
          </span>
          <div className="theme-buttons">
            {THEMES.map((theme) => (
              <button
                key={theme.id}
                className={`theme-tab-btn ${currentThemeId === theme.id ? 'active' : ''}`}
                onClick={() => handleThemeChange(theme.id)}
              >
                {theme.name}
              </button>
            ))}
          </div>
        </div>

        {/* Utility buttons */}
        <div className="utility-buttons">
          <button
            className={`btn-icon-toggle ${soundEnabled ? 'active' : ''}`}
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? '點擊靜音' : '點擊開啟音效'}
            aria-label="切換音效"
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            <span className="btn-icon-text">{soundEnabled ? '音效開' : '靜音'}</span>
          </button>

          <button
            id="btn-restart-top"
            className="btn-restart"
            onClick={handleRestart}
            title="重新開始遊戲"
          >
            <RotateCcw size={18} />
            <span>重新開始</span>
          </button>
        </div>
      </div>

      {/* Main 4x4 Grid (16 cards) */}
      <main className="cards-grid-container">
        <div className="cards-grid" role="region" aria-label="翻牌遊戲卡牌區">
          {cards.map((card) => {
            const isFlipped = flippedIds.includes(card.uniqueId);
            const isMatched = matchedPairIds.has(card.pairId);
            const isMismatch = mismatchIds.includes(card.uniqueId);

            return (
              <Card
                key={card.uniqueId}
                card={card}
                isFlipped={isFlipped}
                isMatched={isMatched}
                isMismatch={isMismatch}
                disabled={isLocked}
                onClick={handleCardClick}
              />
            );
          })}
        </div>
      </main>

      {/* Bottom hint */}
      <footer className="game-footer">
        <p>💡 小提示：點擊任兩張卡牌翻開，花費最少步數記住位置配對消除！</p>
      </footer>

      {/* Win Modal Dialog */}
      {showWinModal && (
        <WinModal
          moves={moves}
          timeFormatted={formatTime(seconds)}
          seconds={seconds}
          bestScore={bestScore}
          isNewRecord={isNewRecord}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}
