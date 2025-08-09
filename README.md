# Chinese-Thai Flashcard App

A React-based flashcard application for learning Chinese vocabulary with Thai translations. Features include text-to-speech pronunciation, card flipping animations, spaced repetition tracking, and multiple deck support.

> **Note**: This repository contains two versions of the flashcard app:
> - **Main branch (this version)**: Vanilla HTML/JS with modular structure - simple, lightweight, works directly in browser
> - **React version**: Modern React app with enhanced features (available in separate commits)

## File Structure

The application has been refactored from a single HTML file into a modular structure:

```
flashcards/
├── index.html          # Main HTML file with external dependencies
├── styles.css          # All CSS styles and animations
├── data.js            # Constants, vocabulary data, and access codes
├── hooks.js           # Custom React hooks (speech synthesis)
├── components.js      # React components (Modal, Cards, etc.)
├── app.js            # Main App component and page routing
└── README.md         # This documentation file
```

## Features

- **Interactive Flashcards**: Tap to flip, swipe left/right for forgotten/remembered
- **Multi-language Support**: Chinese characters, Pinyin, English, and Thai
- **Text-to-Speech**: Smart language detection with external TTS for accuracy
- **Card Management**: Track remembered and forgotten cards
- **Multiple Decks**: Support for different vocabulary sets
- **Responsive Design**: Works on mobile and desktop devices
- **Spaced Repetition**: Cards reappear based on learning progress

## Quick Start

Simply open `index.html` in your browser - no installation required!

## Deck Codes

- `LearnChinesewithHelen1295` - Chinese Vocabulary (30 cards)
- `PinyinPractice` - Pinyin Practice (5 cards)

## Technical Details

### Dependencies
- React 18.2.0 (Production build via CDN)
- React DOM 18.2.0
- Babel Standalone 7.23.5
- Tailwind CSS (CDN)
- Font Awesome 6.0.0
- Google Fonts (Noto Sans SC & Thai)

### Key Components

#### `useSpeech` Hook
- Automatic language detection for Chinese, Thai, and English
- External TTS service for Chinese and Thai pronunciation
- Fallback to browser speech synthesis for English

#### `Flashcard` Component
- Gesture-based interaction (swipe, tap, flip)
- Pointer events for cross-platform compatibility
- Stack-based card display with preview of upcoming cards

#### `App` Component
- State management for decks, cards, and user progress
- Page routing between landing, flashcards, and collection views
- Spaced repetition algorithm implementation

### Card Data Structure
```javascript
{
  front: "Chinese Character\nPinyin",
  back: "English Translation\nThai Translation", 
  emoji: "📝",
  status: "new|remembered|forgotten",
  level: 0-2,
  key: "unique_identifier"
}
```

## Development

To add new vocabulary decks:

1. Add card data to `data.js`
2. Update `ACCESS_CODES` object with new deck configuration
3. Include deck-specific styling colors if needed

## Performance Optimizations

- CSS variables for dynamic card colors
- Efficient re-rendering with React keys
- Gesture debouncing for smooth interactions
- Optimized CSS animations with hardware acceleration

## Browser Compatibility

- Modern browsers with ES6+ support
- Pointer Events API support
- Web Audio API for TTS functionality
- CSS Grid and Flexbox for layout
