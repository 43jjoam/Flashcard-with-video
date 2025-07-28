import React, { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

// Sample flashcard data
const sampleCards = [
  {
    id: 1,
    front: {
      chinese: '你好',
      pinyin: 'nǐ hǎo'
    },
    back: {
      english: 'Hello',
      thai: 'สวัสดี'
    },
    score: 0,
    consecutiveCorrect: 0,
    consecutiveIncorrect: 0
  },
  {
    id: 2,
    front: {
      chinese: '谢谢',
      pinyin: 'xiè xie'
    },
    back: {
      english: 'Thank you',
      thai: 'ขอบคุณ'
    },
    score: 0,
    consecutiveCorrect: 0,
    consecutiveIncorrect: 0
  },
  {
    id: 3,
    front: {
      chinese: '再见',
      pinyin: 'zài jiàn'
    },
    back: {
      english: 'Goodbye',
      thai: 'ลาก่อน'
    },
    score: 0,
    consecutiveCorrect: 0,
    consecutiveIncorrect: 0
  },
  {
    id: 4,
    front: {
      chinese: '对不起',
      pinyin: 'duì bù qǐ'
    },
    back: {
      english: 'Sorry',
      thai: 'ขอโทษ'
    },
    score: 0,
    consecutiveCorrect: 0,
    consecutiveIncorrect: 0
  },
  {
    id: 5,
    front: {
      chinese: '没关系',
      pinyin: 'méi guān xi'
    },
    back: {
      english: "It's okay",
      thai: 'ไม่เป็นไร'
    },
    score: 0,
    consecutiveCorrect: 0,
    consecutiveIncorrect: 0
  }
];

function App() {
  const [cards, setCards] = useState(sampleCards);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState(null);

  const currentCard = cards[currentCardIndex];

  // Score calculation based on swipe direction
  const updateCardScore = (direction) => {
    setCards(prevCards => {
      const updatedCards = [...prevCards];
      const card = updatedCards[currentCardIndex];
      
      if (direction === 'right') {
        // Correct answer
        if (card.consecutiveCorrect === 0) {
          card.score += 1;
        } else if (card.consecutiveCorrect < 3) {
          card.score += 2;
        } else {
          card.score += 3;
        }
        
        if (card.consecutiveCorrect % 3 === 0) {
          card.score += 1; // Streak bonus
        }
        
        card.consecutiveCorrect++;
        card.consecutiveIncorrect = 0;
      } else {
        // Incorrect answer
        if (card.consecutiveIncorrect === 0) {
          card.score -= 1;
        } else {
          card.score -= 2;
        }
        
        card.consecutiveIncorrect++;
        card.consecutiveCorrect = 0;
      }
      
      return updatedCards;
    });
  };

  // Handle swipe gestures
  const handleSwipe = (direction) => {
    setSwipeDirection(direction);
    updateCardScore(direction);
    
    // Move to next card after a short delay
    setTimeout(() => {
      setCurrentCardIndex(prev => (prev + 1) % cards.length);
      setIsFlipped(false);
      setSwipeDirection(null);
    }, 500);
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => handleSwipe('left'),
    onSwipedRight: () => handleSwipe('right'),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  // Handle card flip on click/tap
  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  console.log(currentCard);

  return (
    <div className="App">
      <div className="header">
        <h1>中文 Flashcards</h1>
        <div className="stats">
          <span>Card {currentCardIndex + 1} of {cards.length}</span>
          <span>Score: {currentCard.score}</span>
        </div>
      </div>

      <div className="flashcard-container" {...handlers}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCardIndex}
            className="flashcard"
            initial={{ opacity: 0, x: swipeDirection === 'left' ? -300 : 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: swipeDirection === 'left' ? 300 : -300 }}
            transition={{ duration: 0.3 }}
            onClick={handleCardClick}
          >
            <motion.div
              className="card-content"
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Front of card */}
              <motion.div 
                className="card-front"
                style={{ 
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden"
                }}
              >
                <div className="chinese-content">
                  <p className="pinyin-front">{currentCard.front.pinyin}</p>
                  <h2 className="chinese-character">{currentCard.front.chinese}</h2>
                </div>
                <p className="hint">Tap to flip</p>
              </motion.div>

              {/* Back of card */}
              <motion.div 
                className="card-back"
                style={{ 
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  transform: "rotateY(180deg)"
                }}
              >
                <div className="translations">
                  <p className="english">{currentCard.back.english}</p>
                  <p className="thai">{currentCard.back.thai}</p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="swipe-instructions">
        <div className="instruction">
          <span className="arrow left">←</span>
          <span>Don't know</span>
        </div>
        <div className="instruction">
          <span>Know it</span>
          <span className="arrow right">→</span>
        </div>
      </div>

      <div className="score-info">
        <p>Current Score: {currentCard.score}</p>
        <p>Streak: {currentCard.consecutiveCorrect} correct</p>
      </div>
    </div>
  );
}

export default App;
