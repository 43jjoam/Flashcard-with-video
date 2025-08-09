import React, { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

// Flashcard data from options.txt
const flashcardData = [
  {
    id: 1,
    front: {
      chinese: '爸爸',
      pinyin: 'bàba'
    },
    back: {
      english: 'dad',
      thai: 'พ่อ'
    }
  },
  {
    id: 2,
    front: {
      chinese: '别',
      pinyin: 'bié'
    },
    back: {
      english: "don't",
      thai: 'อย่า'
    }
  },
  {
    id: 3,
    front: {
      chinese: '朋友',
      pinyin: 'péngyǒu'
    },
    back: {
      english: 'friend',
      thai: 'เพื่อน'
    }
  },
  {
    id: 4,
    front: {
      chinese: '怕',
      pinyin: 'pà'
    },
    back: {
      english: 'to fear',
      thai: 'กลัว'
    }
  },
  {
    id: 5,
    front: {
      chinese: '妈妈',
      pinyin: 'māma'
    },
    back: {
      english: 'mom',
      thai: 'แม่'
    }
  },
  {
    id: 6,
    front: {
      chinese: '买',
      pinyin: 'mǎi'
    },
    back: {
      english: 'to buy',
      thai: 'ซื้อ'
    }
  },
  {
    id: 7,
    front: {
      chinese: '饭',
      pinyin: 'fàn'
    },
    back: {
      english: 'meal',
      thai: 'อาหาร'
    }
  },
  {
    id: 8,
    front: {
      chinese: '富',
      pinyin: 'fù'
    },
    back: {
      english: 'rich',
      thai: 'รวย'
    }
  },
  {
    id: 9,
    front: {
      chinese: '奶奶',
      pinyin: 'nǎinai'
    },
    back: {
      english: 'grandmother',
      thai: 'ย่า'
    }
  },
  {
    id: 10,
    front: {
      chinese: '你',
      pinyin: 'nǐ'
    },
    back: {
      english: 'you',
      thai: 'คุณ'
    }
  }
];

function App() {
  const [cards] = useState(flashcardData);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [dragY, setDragY] = useState(0);
  const [swipeVelocity, setSwipeVelocity] = useState({ x: 0, y: 0 });

  // Handle swipe gestures
  const handleSwipe = (direction, velocity) => {
    setSwipeDirection(direction);
    setSwipeVelocity(velocity);
    
    // Move to next card after a short delay
    setTimeout(() => {
      setCurrentCardIndex(prev => (prev + 1) % cards.length);
      setIsFlipped(false);
      setSwipeDirection(null);
      setDragX(0);
      setDragY(0);
      setSwipeVelocity({ x: 0, y: 0 });
    }, 300);
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => handleSwipe('left', { x: -1, y: 0 }),
    onSwipedRight: () => handleSwipe('right', { x: 1, y: 0 }),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  // Handle card flip on click/tap
  const handleCardClick = () => {
    if (!isDragging) {
      setIsFlipped(!isFlipped);
    }
  };

  // Handle drag gestures
  const handleDragEnd = (event, info) => {
    setIsDragging(false);
    const swipeThreshold = 100;
    const velocity = { x: info.velocity.x, y: info.velocity.y };
    
    if (Math.abs(info.offset.x) > swipeThreshold) {
      if (info.offset.x > 0) {
        handleSwipe('right', velocity);
      } else {
        handleSwipe('left', velocity);
      }
    } else {
      setDragX(0);
      setDragY(0);
    }
  };

  const handleDrag = (event, info) => {
    setDragX(info.offset.x);
    setDragY(info.offset.y);
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  return (
    <div className="App">
      <div className="header">
        <h1>中文 Flashcards</h1>
      </div>

      <div className="flashcard-container" {...handlers}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCardIndex}
            className="flashcard"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              x: 0, 
              y: 0,
              scale: 1,
              rotateZ: 0
            }}
            transition={{ 
              duration: 0.3, 
              ease: "easeOut"
            }}
            drag={true}
            onDrag={handleDrag}
            style={{
              rotateZ: Math.atan2(dragY, dragX) * (180 / Math.PI) * 0.2,
              x: dragX,
              y: dragY,
            }}
            onClick={handleCardClick}
          >
            <motion.div
              className="card-content"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Front of card */}
              {!isFlipped && (
                <motion.div 
                  className="card-front"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ 
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden"
                  }}
                >
                  <div className="card-content-inner">
                    <p className="card-subtitle" style={{ fontSize: '3.5rem' }}>{cards[currentCardIndex].front.chinese}</p>
                    <h2 className="card-main" style={{ fontSize: '2.0rem' }}>{cards[currentCardIndex].front.pinyin}</h2>
                    <h2 className="card-main">🎃</h2>
                  </div>
                  <p className="hint">Tap to flip</p>
                </motion.div>
              )}

              {/* Back of card */}
              {isFlipped && (
                <motion.div 
                  className="card-back"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ 
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    // transform: "rotateY(180deg)"
                  }}
                >
                  <div className="card-content-inner">
                    <p className="card-subtitle">{cards[currentCardIndex].back.english}</p>
                    <h2 className="card-main" style={{ fontSize: '2.0rem' }}>{cards[currentCardIndex].back.thai}</h2>
                    <h2 className="card-main">🎃</h2>
                  </div>
                  <p className="hint">Tap to flip</p>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
}

export default App;
