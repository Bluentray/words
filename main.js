import './style.css';

const words = [
  { word: 'CAT', hint: 'A furry pet that meows' },
  { word: 'DOG', hint: 'A friendly pet that barks' },
  { word: 'SUN', hint: 'It lights up our day' },
  { word: 'STAR', hint: 'Twinkles in the night sky' },
  { word: 'BOOK', hint: 'You read stories in it' },
  { word: 'TREE', hint: 'Grows tall and has leaves' },
  { word: 'FISH', hint: 'Swims in water' },
  { word: 'BIRD', hint: 'Has wings and can fly' }
];

class WordGame {
  constructor() {
    this.score = 0;
    this.currentWord = null;
    this.currentHint = '';
    this.setupGame();
    this.newWord();
  }

  createStar(x, y) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.left = `${x}px`;
    star.style.top = `${y}px`;
    star.innerHTML = '⭐';
    star.style.fontSize = `${Math.random() * 20 + 20}px`;
    document.querySelector('.game-container').appendChild(star);
    setTimeout(() => star.remove(), 1000);
  }

  createStarBurst(x, y) {
    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        const offsetX = x + (Math.random() - 0.5) * 200;
        const offsetY = y + (Math.random() - 0.5) * 200;
        this.createStar(offsetX, offsetY);
      }, i * 100);
    }
  }

  setupGame() {
    const ladderSteps = Array(10).fill('').map((_, i) => 
      `<div class="ladder-step" id="ladder-step-${i}"></div>`
    ).join('');

    const gameHTML = `
      <div class="game-container">
        <h1>✨ Word Scramble Game ✨</h1>
        <p>Unscramble the word!</p>
        <div class="scrambled-word" id="scrambled-word"></div>
        <div class="hint" id="hint"></div>
        <div class="input-container">
          <input type="text" id="guess-input" placeholder="Type your answer">
          <button id="check-button">✓ Check</button>
          <button id="new-word-button">↻ New Word</button>
        </div>
        <div class="message" id="message"></div>
        <div class="score" id="score">Score: 0</div>
      </div>
      <div class="ladder-progress">
        ${ladderSteps}
      </div>
    `;

    document.querySelector('#app').innerHTML = gameHTML;

    document.querySelector('#check-button').addEventListener('click', () => this.checkGuess());
    document.querySelector('#new-word-button').addEventListener('click', () => this.newWord());
    document.querySelector('#guess-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.checkGuess();
    });
  }

  updateLadder() {
    const steps = document.querySelectorAll('.ladder-step');
    steps.forEach((step, index) => {
      if (index < this.score) {
        step.classList.add('active');
      } else {
        step.classList.remove('active');
      }
    });
  }

  scrambleWord(word) {
    const array = word.split('');
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join('');
  }

  newWord() {
    const randomIndex = Math.floor(Math.random() * words.length);
    this.currentWord = words[randomIndex].word;
    this.currentHint = words[randomIndex].hint;
    
    let scrambled = this.scrambleWord(this.currentWord);
    while (scrambled === this.currentWord) {
      scrambled = this.scrambleWord(this.currentWord);
    }

    document.querySelector('#scrambled-word').textContent = scrambled;
    document.querySelector('#hint').textContent = `💡 Hint: ${this.currentHint}`;
    document.querySelector('#guess-input').value = '';
    document.querySelector('#message').textContent = '';
    document.querySelector('#guess-input').focus();
  }

  checkGuess() {
    const guess = document.querySelector('#guess-input').value.toUpperCase();
    const messageElement = document.querySelector('#message');

    if (guess === this.currentWord) {
      this.score += 1;
      messageElement.textContent = '🎉 Correct! Well done!';
      messageElement.className = 'message correct';
      document.querySelector('#score').textContent = `Score: ${this.score}`;
      this.updateLadder();
      
      // Create star burst animation at random positions
      const container = document.querySelector('.game-container');
      const rect = container.getBoundingClientRect();
      this.createStarBurst(rect.width / 2, rect.height / 2);
      
      setTimeout(() => this.newWord(), 1500);
    } else {
      messageElement.textContent = '❌ Try again!';
      messageElement.className = 'message incorrect';
    }
  }
}

// Start the game
new WordGame();