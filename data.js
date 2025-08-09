// ==========================================================================
// TRANSLATIONS
// ==========================================================================

const TRANSLATIONS = {
    "en-US": {
        flashcardsCode: "Learn Any Language with Flashcards",
        slideToUnlock: "slide to unlock",
        pasteCodePlaceholder: "paste or type your flash card code here...",
        createNewFlashcardsLink: "Enter new code",
        collection: "All Decks",
        backToStudy: "Back to Study",
        noCollectedCards: "No cards collected yet",
        rememberedCards: "Remembered Cards",
        forgottenCards: "Forgotten Cards",
        landingPageSubtitle: 'Enter "LearnChinesewithHelen1295" or "PinyinPractice" to start.'
    }
};

// ==========================================================================
// VOCABULARY DATA
// ==========================================================================

const CHINESE_VOCABULARY = [
    { front: "爸爸\nbà ba", back: "dad\nพ่อ", emoji: "👨‍👧‍👦" },
    { front: "别\nbié", back: "don't\nอย่า", emoji: "🚫" },
    { front: "朋友\npéng yǒu", back: "friend\nเพื่อน", emoji: "👫" },
    { front: "怕\npà", back: "to fear\nกลัว", emoji: "😨" },
    { front: "妈妈\nmā ma", back: "mom\nแม่", emoji: "👩‍👧‍👦" },
    { front: "买\nmǎi", back: "to buy\nซื้อ", emoji: "🛒" },
    { front: "饭\nfàn", back: "meal\nข้าว", emoji: "🍽️" },
    { front: "富\nfù", back: "rich\nรวย", emoji: "💰" },
    { front: "奶奶\nnǎi nai", back: "grandmother\nยาย", emoji: "👵" },
    { front: "你\nnǐ", back: "you\nคุณ", emoji: "👤" },
    { front: "老\nlǎo", back: "old\nแก่", emoji: "🧓" },
    { front: "来\nlái", back: "to come\nมา", emoji: "➡️" },
    { front: "大\ndà", back: "big\nใหญ่", emoji: "📏" },
    { front: "得\ndé", back: "to get\nได้รับ", emoji: "🏆" },
    { front: "跳\ntiào", back: "to jump\nกระโดด", emoji: "🤸" },
    { front: "调\ntiáo", back: "to adjust\nปรับ", emoji: "⚙️" },
    { front: "猪\nzhū", back: "pig\nหมู", emoji: "🐷" },
    { front: "住\nzhù", back: "to live\nอาศัย", emoji: "🏠" },
    { front: "吃\nchī", back: "to eat\nกิน", emoji: "🍽️" },
    { front: "出\nchū", back: "to go out\nออกไป", emoji: "🚪" },
    { front: "高\ngāo", back: "high\nสูง", emoji: "📏" },
    { front: "个\ngè", back: "measure word\nลักษณนาม", emoji: "📊" },
    { front: "裤\nkù", back: "trousers\nกางเกง", emoji: "👖" },
    { front: "可以\nkě yǐ", back: "can\nสามารถ", emoji: "✅" },
    { front: "虎\nhǔ", back: "tiger\nเสือ", emoji: "🐅" },
    { front: "好\nhǎo", back: "good\nดี", emoji: "👍" },
    { front: "家\njiā", back: "home\nบ้าน", emoji: "🏡" },
    { front: "就\njiù", back: "then\nแล้ว", emoji: "⏭️" },
    { front: "小\nxiǎo", back: "small\nเล็ก", emoji: "🐭" },
    { front: "喜欢\nxǐ huān", back: "to like\nชอบ", emoji: "❤️" }
];

const PINYIN_CARDS = [
    { front: "ang", back: "ang\nFinal compound: 'ahng' sound\nเสียงสระผสม: 'อาง'", emoji: "🗣️" },
    { front: "ing", back: "ing\nFinal compound: 'eeng' sound\nเสียงสระผสม: 'อิง'", emoji: "🗣️" },
    { front: "en", back: "en\nFinal compound: 'uhn' sound\nเสียงสระผสม: 'เอิน'", emoji: "🗣️" },
    { front: "ai", back: "ai\nFinal compound: 'eye' sound\nเสียงสระผสม: 'ไอ'", emoji: "🗣️" },
    { front: "ao", back: "ao\nFinal compound: 'aow' sound\nเสียงสระผสม: 'เอา'", emoji: "🗣️" }
];

// ==========================================================================
// ACCESS CODES CONFIGURATION
// ==========================================================================

const ACCESS_CODES = {
    LearnChinesewithHelen1295: {
        title: "Chinese Vocabulary",
        cards: CHINESE_VOCABULARY.map(card => ({ ...card, status: "new" })),
        sampleCard: { ...CHINESE_VOCABULARY[0], status: "new" },
        cardColor: "#E0F7FA", // Light Blue
        cardBackColor: "#CFEEF5" // Slightly different for back if desired
    },
    PinyinPractice: {
        title: "Pinyin Practice",
        cards: PINYIN_CARDS.map(card => ({ ...card, status: "new" })),
        sampleCard: { ...PINYIN_CARDS[0], status: "new" },
        cardColor: "#E8F5E9", // Light Green
        cardBackColor: "#DFF0E0" // Slightly different for back if desired
    }
    // Add more decks here with their specific colors
};

// ==========================================================================
// UTILITY FUNCTIONS
// ==========================================================================

// Fisher-Yates (Knuth) Shuffle Algorithm
function shuffleArray(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex !== 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}
