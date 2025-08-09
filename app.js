// ==========================================================================
// UTILITY FUNCTIONS
// ==========================================================================

const removeCardFromListByFront = (list, cardToRemove) => 
    list.filter(c => c.front !== cardToRemove.front);

// ==========================================================================
// MAIN APP COMPONENT
// ==========================================================================

const App = () => {
    const [currentPage, setCurrentPage] = useState('landing');
    const [deck, setDeck] = useState([]);
    const [visibleCards, setVisibleCards] = useState([]);
    const [rememberedCards, setRememberedCards] = useState([]);
    const [forgottenCards, setForgottenCards] = useState([]);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [code, setCode] = useState('');
    const [selectedDeckCode, setSelectedDeckCode] = useState(null);

    const handleCodeUnlock = () => {
        const deckData = ACCESS_CODES[code];
        if (deckData) {
            // Set CSS variables for card colors based on the unlocked deck's data
            document.documentElement.style.setProperty('--card-background-color', deckData.cardColor);
            document.documentElement.style.setProperty('--card-background-color-back', deckData.cardBackColor || deckData.cardColor); 
            
            const initialDeck = deckData.cards.map(card => ({ 
                ...card, 
                status: 'new', 
                level: 0, 
                key: Math.random() 
            }));
            const shuffledDeck = shuffleArray([...initialDeck]);
            setDeck(shuffledDeck);
            setVisibleCards(shuffledDeck.slice(0, 3));
            setRememberedCards([]);
            setForgottenCards([]);
            setCurrentPage('flashcards');
        } else {
            setErrorMessage("Invalid code. Please try again.");
            setShowErrorModal(true);
        }
    };
    
    const handleSwipe = useCallback((direction) => {
        if (visibleCards.length === 0) return;
        const swipedCard = visibleCards[0];
        const newDeck = deck.slice(1);
        let nextRemembered = [...rememberedCards];
        let nextForgotten = [...forgottenCards];
        nextRemembered = removeCardFromListByFront(nextRemembered, swipedCard);
        nextForgotten = removeCardFromListByFront(nextForgotten, swipedCard);
        let deckUpdate = [...newDeck];
        
        if (direction === 'left') {
            swipedCard.level = Math.max(0, swipedCard.level - 1);
            nextForgotten.push(swipedCard);
            const reinsertIndex = Math.min(5, deckUpdate.length);
            deckUpdate.splice(reinsertIndex, 0, swipedCard);
        } else {
            swipedCard.level += 1;
            nextRemembered.push(swipedCard);
            if (swipedCard.level < 2) {
                deckUpdate.push(swipedCard);
            }
        }
        
        setDeck(deckUpdate);
        setRememberedCards(nextRemembered);
        setForgottenCards(nextForgotten);
        setVisibleCards(deckUpdate.slice(0, 3));
    }, [deck, visibleCards, rememberedCards, forgottenCards]);

    const handleLongPress = (cardToStudy) => {
        const newDeck = [cardToStudy, ...deck.filter(c => c.key !== cardToStudy.key)];
        setDeck(newDeck);
        setVisibleCards(newDeck.slice(0, 3));
        setCurrentPage('flashcards');
    };
    
    const handleSelectDeck = (deckCode) => {
        setSelectedDeckCode(deckCode);
        setCurrentPage('deckDetail');
    };

    const resetApp = () => {
        setCurrentPage('landing');
        setCode('');
        setDeck([]);
        setVisibleCards([]);
        setRememberedCards([]);
        setForgottenCards([]);
    };
    
    // ==========================================================================
    // PAGE COMPONENTS
    // ==========================================================================
    
    const CollectionPage = ({ title, cards, onBack, fallbackMessage, cardType }) => (
        <div className="collection-page">
            <div className="top-nav w-full flex justify-between items-center">
                <button 
                    onClick={onBack} 
                    className="mobile-button" 
                    title={TRANSLATIONS["en-US"].backToStudy}
                >
                    <i className="fas fa-arrow-left text-2xl" />
                </button>
                <h2 className="text-2xl font-bold text-white">{title}</h2>
                <div className="w-12 h-12" />
            </div>
            {cards.length > 0 ? (
                <div className="collection-grid-wrapper">
                    <div className="collection-grid">
                        {cards.map((card) => (
                            cardType === 'remembered' 
                            ? <StaticSmallCard key={card.key} card={card} />
                            : <FlippableSmallCard key={card.key} card={card} onLongPress={handleLongPress} />
                        ))}
                    </div>
                </div>
            ) : (
                <div className="flex-grow flex items-center justify-center">
                    <p className="text-white text-center text-lg">{fallbackMessage}</p>
                </div>
            )}
        </div>
    );

    const AllDecksPage = ({ onBack, onSelectDeck }) => (
        <div className="collection-page">
            <div className="top-nav w-full flex justify-between items-center">
                <button 
                    onClick={onBack} 
                    className="mobile-button" 
                    title={TRANSLATIONS["en-US"].backToStudy}
                >
                    <i className="fas fa-arrow-left text-2xl" />
                </button>
                <h2 className="text-2xl font-bold text-white">{TRANSLATIONS["en-US"].collection}</h2>
                <div className="w-12 h-12" />
            </div>
            <div className="collection-grid-wrapper">
                <div className="collection-grid">
                    {Object.entries(ACCESS_CODES).map(([code, deckData]) => (
                        <div key={code} onClick={() => onSelectDeck(code)} className="cursor-pointer">
                            <h3 className="text-white text-center font-bold mb-2">{deckData.title}</h3>
                            <StaticSmallCard card={{...deckData.sampleCard, cardColor: deckData.cardColor}} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const DeckDetailPage = ({ deckCode, onBack }) => {
        const deckData = ACCESS_CODES[deckCode];
        if (!deckData) return null;
        return (
            <CollectionPage 
                title={deckData.title}
                cards={deckData.cards}
                onBack={onBack}
                fallbackMessage="This deck is empty."
                cardType="remembered"
            />
        );
    };

    // ==========================================================================
    // RENDER LOGIC
    // ==========================================================================

    const renderContent = () => { 
        switch (currentPage) {
            case 'landing':
                return (
                    <div className="mobile-center flex-col p-4">
                        <div className="p-8 flex flex-col items-center gap-8 max-w-md w-full">
                            <h1 className="text-3xl font-extrabold text-white text-center drop-shadow-lg">
                                {TRANSLATIONS["en-US"].flashcardsCode}
                            </h1>
                            <p className="text-white text-lg text-center drop-shadow-md">
                                {TRANSLATIONS["en-US"].landingPageSubtitle}
                            </p>
                            <input 
                                type="text" 
                                placeholder={TRANSLATIONS["en-US"].pasteCodePlaceholder} 
                                className="w-full p-3 rounded-xl bg-gray-100 bg-opacity-70 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200 text-center text-lg text-gray-800" 
                                value={code} 
                                onChange={e => setCode(e.target.value)} 
                            />
                            <SlideToUnlock onUnlock={handleCodeUnlock} />
                        </div>
                    </div>
                );
                
            case 'flashcards':
                if (visibleCards.length === 0) {
                    return (
                        <div className="mobile-center flex-col p-4">
                            <div className="watercolor-card p-8 flex flex-col items-center gap-6 max-w-md w-full text-center">
                                <h2 className="text-2xl font-bold text-gray-900">Deck Completed!</h2>
                                <p className="text-gray-700">You've gone through all the cards in this deck.</p>
                                <button 
                                    onClick={resetApp} 
                                    className="px-6 py-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition duration-300"
                                >
                                    {TRANSLATIONS["en-US"].createNewFlashcardsLink}
                                </button>
                                <button 
                                    onClick={() => setCurrentPage('allDecks')} 
                                    className="mt-2 px-6 py-3 bg-purple-500 text-white rounded-full shadow-lg hover:bg-purple-600 transition duration-300"
                                >
                                    View All Decks
                                </button>
                            </div>
                        </div>
                    );
                }

                return (
                    <div className="flashcard-page">
                        <div className="top-nav w-full flex justify-end items-center space-x-2 sm:space-x-4">
                            <button 
                                onClick={() => setCurrentPage('remembered')} 
                                className="mobile-button" 
                                title={TRANSLATIONS["en-US"].rememberedCards}
                            >
                                <i className="fas fa-check-double text-2xl"></i>
                            </button>
                            <button 
                                onClick={() => setCurrentPage('forgotten')} 
                                className="mobile-button" 
                                title={TRANSLATIONS["en-US"].forgottenCards}
                            >
                                <i className="fas fa-question text-2xl"></i>
                            </button>
                            <button 
                                onClick={() => setCurrentPage('allDecks')} 
                                className="mobile-button" 
                                title={TRANSLATIONS["en-US"].collection}
                            >
                                <i className="fas fa-layer-group text-2xl"></i>
                            </button>
                            <button 
                                onClick={resetApp} 
                                className="mobile-button" 
                                title={TRANSLATIONS["en-US"].createNewFlashcardsLink}
                            >
                                <i className="fas fa-undo text-2xl"></i>
                            </button>
                        </div>

                        <div className="card-scene-wrapper">
                            <div className="card-scene">
                                {visibleCards.map((card, index) => (
                                    <Flashcard 
                                        key={card.key} 
                                        card={card} 
                                        onSwipe={handleSwipe} 
                                        index={index} 
                                    />
                                )).reverse()}
                            </div>
                        </div>
                    </div>
                );
                
            case 'remembered':
                return (
                    <CollectionPage 
                        title={TRANSLATIONS["en-US"].rememberedCards} 
                        cards={rememberedCards} 
                        onBack={() => setCurrentPage("flashcards")} 
                        fallbackMessage={TRANSLATIONS["en-US"].noCollectedCards} 
                        cardType="remembered" 
                    />
                );
                
            case 'forgotten':
                return (
                    <CollectionPage 
                        title={TRANSLATIONS["en-US"].forgottenCards} 
                        cards={forgottenCards} 
                        onBack={() => setCurrentPage("flashcards")} 
                        fallbackMessage={TRANSLATIONS["en-US"].noCollectedCards} 
                        cardType="forgotten" 
                    />
                );
                
            case 'allDecks':
                return (
                    <AllDecksPage 
                        onBack={() => setCurrentPage("flashcards")} 
                        onSelectDeck={handleSelectDeck} 
                    />
                );
                
            case 'deckDetail':
                return (
                    <DeckDetailPage 
                        deckCode={selectedDeckCode} 
                        onBack={() => setCurrentPage('allDecks')} 
                    />
                );
                
            default:
                return null;
        }
    };

    return (
        <div className="h-full">
            {renderContent()}
            <Modal 
                isOpen={showErrorModal} 
                onClose={() => setShowErrorModal(false)} 
                title="Error" 
                message={errorMessage} 
            />
        </div>
    );
};

// ==========================================================================
// RENDER THE APP
// ==========================================================================

ReactDOM.render(<App />, document.getElementById('root'));
