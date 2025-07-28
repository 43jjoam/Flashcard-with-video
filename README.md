# 中文 Flashcards App

A modern, interactive Chinese flashcards application built with React, featuring swipe gestures, spaced repetition scoring, and beautiful pink/purple gradient design.

## Features

### 🎯 Core Functionality
- **Swipeable Flashcards**: Swipe left (don't know) or right (know it) to interact with cards
- **Card Flipping**: Tap/click cards to flip and see translations
- **Spaced Repetition**: Intelligent scoring system based on swipe direction
- **Progress Tracking**: Real-time score and streak tracking

### 🎨 Design
- **Modern UI**: Pink/purple gradient theme with glassmorphism effects
- **Mobile-First**: Optimized for touch devices with responsive design
- **Smooth Animations**: Framer Motion powered transitions and gestures
- **Beautiful Typography**: Clean, readable fonts with proper Chinese character support

### 📊 Scoring System
- **Right Swipe (Know it)**: +1 to +3 points with streak bonuses
- **Left Swipe (Don't know)**: -1 to -2 points, resets streaks
- **Adaptive Learning**: Cards appear more/less frequently based on performance
- **Streak Tracking**: Bonus points for consecutive correct answers

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd flashcards
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Basic Interactions
- **Swipe Right**: Mark card as known (increases score)
- **Swipe Left**: Mark card as unknown (decreases score)
- **Tap/Click**: Flip card to see translations

### Card Information
Each flashcard displays:
- **Front**: Chinese character
- **Back**: Pinyin, English translation, and local language

### Score System
- **Score Ranges**: -5 to 11+ points
- **Review Intervals**: 2 hours to 4 weeks based on score
- **Streak Bonuses**: Extra points for consecutive correct answers

## Technology Stack

- **React 19**: Modern React with hooks
- **Framer Motion**: Smooth animations and gestures
- **React Swipeable**: Touch gesture handling
- **CSS3**: Modern styling with gradients and glassmorphism

## Project Structure

```
flashcards/
├── src/
│   ├── App.js          # Main application component
│   ├── App.css         # Styling for the app
│   ├── index.js        # Application entry point
│   └── index.css       # Global styles
├── public/             # Static assets
├── score_strategy.md   # Detailed scoring algorithm
└── README.md          # This file
```

## Scoring Strategy

The app implements a sophisticated spaced repetition algorithm:

### Score Calculation
- **First correct swipe**: +1 point
- **Consecutive correct**: +2 to +3 points
- **Streak bonus**: +1 point every 3 consecutive correct
- **Incorrect swipes**: -1 to -2 points

### Review Scheduling
- **Negative scores**: Review within hours
- **Low scores (1-3)**: Review within 1-2 days
- **High scores (7+)**: Review within weeks
- **Mastered (11+)**: Review monthly

## Future Enhancements

- [ ] User authentication and progress sync
- [ ] Custom flashcard creation
- [ ] Multiple difficulty levels
- [ ] Audio pronunciation
- [ ] Offline support
- [ ] Progress analytics dashboard
- [ ] Social features and leaderboards

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by spaced repetition learning techniques
- Built with modern React best practices
- Designed for optimal mobile learning experience
