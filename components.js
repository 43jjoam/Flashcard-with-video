// ==========================================================================
// REACT COMPONENTS
// ==========================================================================

const { useState, useEffect, useRef, useCallback } = React;

// ==========================================================================
// MODAL COMPONENT
// ==========================================================================

const Modal = ({ isOpen, onClose, title, message, children }) => {
    if (!isOpen) return null;
    return (
        <div className={`modal-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                {title && <h3 className="text-2xl font-bold mb-4 text-gray-800">{title}</h3>}
                {message && <p className="text-gray-700 mb-6">{message}</p>}
                {children}
                <button 
                    onClick={onClose} 
                    className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition duration-300"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

// ==========================================================================
// SLIDE TO UNLOCK COMPONENT
// ==========================================================================

const SlideToUnlock = ({ onUnlock }) => {
    const sliderRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [currentX, setCurrentX] = useState(0);
    const [unlocked, setUnlocked] = useState(false);
    const [maxTranslateX, setMaxTranslateX] = useState(0);

    useEffect(() => {
        const calculateMaxTranslateX = () => {
            if (sliderRef.current) {
                setMaxTranslateX(sliderRef.current.offsetWidth - 50);
            }
        };
        calculateMaxTranslateX();
        window.addEventListener('resize', calculateMaxTranslateX);
        return () => window.removeEventListener('resize', calculateMaxTranslateX);
    }, []);

    const handleStart = (clientX) => {
        if (unlocked) return;
        setIsDragging(true);
        sliderRef.current.startX = clientX;
    };

    const handleMove = (clientX) => {
        if (!isDragging || unlocked) return;
        const deltaX = clientX - sliderRef.current.startX;
        const newX = Math.max(0, Math.min(deltaX, maxTranslateX));
        setCurrentX(newX);
        if (newX >= maxTranslateX - 2) {
            setUnlocked(true);
            setIsDragging(false);
            onUnlock();
        }
    };

    const handleEnd = () => {
        if (unlocked) return;
        if (isDragging) {
            setIsDragging(false);
            setCurrentX(0);
        }
    };

    return (
        <div 
            ref={sliderRef} 
            className="slide-container" 
            onMouseDown={(e) => handleStart(e.clientX)} 
            onMouseMove={(e) => handleMove(e.clientX)} 
            onMouseUp={handleEnd} 
            onMouseLeave={handleEnd} 
            onTouchStart={(e) => handleStart(e.touches[0].clientX)} 
            onTouchMove={(e) => handleMove(e.touches[0].clientX)} 
            onTouchEnd={handleEnd}
        >
            <div className="slide-fill" style={{ width: `${currentX + 25}px` }} />
            <div 
                className={`slide-button ${unlocked ? 'unlocked' : ''}`} 
                style={{ transform: `translateX(${currentX}px)` }}
            >
                <i className={`fas ${unlocked ? 'fa-check' : 'fa-chevron-right'}`} />
            </div>
            <div className={`slide-text ${unlocked || currentX > 10 ? 'opacity-0' : 'opacity-100'}`}>
                {TRANSLATIONS["en-US"].slideToUnlock}
            </div>
        </div>
    );
};

// ==========================================================================
// FLASHCARD COMPONENT
// ==========================================================================

const Flashcard = ({ card, onSwipe, index }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const cardRef = useRef(null);
    const touchState = useRef({ 
        startX: 0, 
        startY: 0, 
        startTime: 0, 
        isDragging: false, 
        deltaX: 0 
    }).current;
    const { pronounceText } = useSpeech();

    useEffect(() => { 
        setIsFlipped(false); 
    }, [card]);

    const handlePointerDown = (e) => {
        if (index !== 0) return;
        touchState.isDragging = true;
        touchState.startX = e.clientX;
        touchState.startY = e.clientY;
        touchState.startTime = Date.now();
        cardRef.current.style.transition = 'none';
        e.target.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e) => {
        if (!touchState.isDragging || index !== 0) return;
        touchState.deltaX = e.clientX - touchState.startX;
        const deltaY = e.clientY - touchState.startY;
        if (Math.abs(touchState.deltaX) < Math.abs(deltaY) && Date.now() - touchState.startTime > 100) {
            touchState.isDragging = false;
            return;
        }
        const rotation = touchState.deltaX * 0.1;
        cardRef.current.style.transformOrigin = `50% ${window.innerHeight}px`;
        cardRef.current.style.transform = `translateX(${touchState.deltaX}px) rotate(${rotation}deg)`;
    };

    const handlePointerUp = (e) => {
        if (!touchState.isDragging || index !== 0) return;
        touchState.isDragging = false;
        e.target.releasePointerCapture(e.pointerId);
        const touchDuration = Date.now() - touchState.startTime;

        // More reliable flip detection - check if it's a quick tap without much movement
        if (touchDuration < 300 && Math.abs(touchState.deltaX) < 20) {
            const isTextArea = e.target.closest('.chinese-character, .pinyin, .english-translation, .thai-translation');
            if (!isTextArea) {
                setIsFlipped(prev => !prev);
            }
        } else {
            const swipeThreshold = window.innerWidth * 0.35;
            if (Math.abs(touchState.deltaX) > swipeThreshold) {
                const direction = touchState.deltaX > 0 ? 'right' : 'left';
                console.log(`🏃 Swipe ${direction} detected`);
                cardRef.current.style.transition = 'transform 0.4s';
                cardRef.current.style.transform = `translateX(${direction === 'right' ? '200%' : '-200%'}) rotate(${direction === 'right' ? 45 : -45}deg)`;
                setTimeout(() => onSwipe(direction), 100);
            } else {
               cardRef.current.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)';
               cardRef.current.style.transform = '';
            }
        }
    };
    
    // Remove language parameter since we'll detect it automatically
    const handlePronounce = (e, text) => {
        e.stopPropagation(); // Prevent card flip
        pronounceText(text); // No lang parameter needed
    };

    const frontParts = (card.front || '').split('\n').map(s => s.trim());
    const chineseChar = frontParts[0] || '';
    const pinyin = frontParts[1] || '';

    const backParts = (card.back || '').split('\n').map(s => s.trim());
    const englishTranslation = backParts[0] || '';
    const thaiTranslation = backParts[1] || '';

    return (
        <div 
            ref={cardRef} 
            className="card-stack-item" 
            data-index={index} 
            onPointerDown={handlePointerDown} 
            onPointerMove={handlePointerMove} 
            onPointerUp={handlePointerUp}
        >
            <div className={`card-container ${isFlipped ? 'flipped' : ''}`}>
                <div className="card-face">
                    <div className="card-content">
                        {chineseChar && (
                            <div 
                                className="chinese-character" 
                                onClick={(e) => handlePronounce(e, chineseChar)}
                            >
                                {chineseChar}
                            </div>
                        )}
                        {pinyin && (
                            <div 
                                className="pinyin" 
                                onClick={(e) => handlePronounce(e, pinyin)}
                            >
                                {pinyin}
                            </div>
                        )}
                        {card.emoji && <div className="emoji-display">{card.emoji}</div>}
                    </div>
                </div>
                <div className="card-face card-back">
                    <div className="card-content">
                        {englishTranslation && (
                            <div 
                                className="english-translation" 
                                onClick={(e) => handlePronounce(e, englishTranslation)}
                            >
                                {englishTranslation}
                            </div>
                        )}
                        {thaiTranslation && (
                            <div 
                                className="thai-translation" 
                                onClick={(e) => handlePronounce(e, thaiTranslation)}
                            >
                                {thaiTranslation}
                            </div>
                        )}
                        {card.emoji && <div className="emoji-display">{card.emoji}</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

// ==========================================================================
// FLIPPABLE SMALL CARD COMPONENT
// ==========================================================================

const FlippableSmallCard = ({ card, onLongPress }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const longPressTimeout = useRef(null);

    const handlePointerDown = () => { 
        longPressTimeout.current = setTimeout(() => onLongPress(card), 500); 
    };
    
    const handlePointerUp = () => clearTimeout(longPressTimeout.current);
    
    const handleClick = () => {
        setIsFlipped(true);
        setTimeout(() => setIsFlipped(false), 2000);
    };

    const frontParts = (card.front || '').split('\n').map(s => s.trim());
    const backParts = (card.back || '').split('\n').map(s => s.trim());

    return (
        <div 
            className="flippable-small-card" 
            onClick={handleClick} 
            onPointerDown={handlePointerDown} 
            onPointerUp={handlePointerUp} 
            onPointerLeave={handlePointerUp}
        >
            <div className={`card-container ${isFlipped ? 'flipped' : ''}`}>
                <div className="card-face small-card">
                    <div className="chinese-character">{frontParts[0] || ''}</div>
                    <div className="pinyin">{frontParts[1] || ''}</div>
                    <div className="emoji-display">{card.emoji}</div>
                </div>
                <div className="card-face card-back small-card">
                    <div className="english-translation">{backParts[0] || ''}</div>
                    <div className="thai-translation">{backParts[1] || ''}</div>
                </div>
            </div>
        </div>
    );
};

// ==========================================================================
// STATIC SMALL CARD COMPONENT
// ==========================================================================

const StaticSmallCard = ({ card }) => {
    const frontParts = (card.front || '').split('\n').map(s => s.trim());
    const backParts = (card.back || '').split('\n').map(s => s.trim());
    
    return (
        <div className="small-card">
            <div className="chinese-character">{frontParts[0] || ''}</div>
            <div className="pinyin">{frontParts[1] || ''}</div>
            <div className="english-translation">{backParts[0] || ''}</div>
            <div className="thai-translation">{backParts[1] || ''}</div>
            <div className="emoji-display">{card.emoji}</div>
        </div>
    );
};
