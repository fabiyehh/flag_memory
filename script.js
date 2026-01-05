document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const flipsElement = document.getElementById('flips');
    const timeElement = document.getElementById('time-remaining');
    const restartButton = document.getElementById('restart-button');
    const winMessage = document.getElementById('win-message');
    const playAgainButton = document.getElementById('play-again-button');

    // List of country codes for the flags
    const countryCodes = ['us', 'de', 'fr', 'jp', 'ca', 'gb', 'in', 'cn'];
    let cardData = [];

    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;
    let flips = 0;
    let timer;
    let time = 0;
    let matchedPairs = 0;

    function createCard(countryCode) {
        const card = document.createElement('div');
        card.classList.add('memory-card');
        card.dataset.framework = countryCode;

        card.innerHTML = `
            <div class="front-face">?</div>
            <div class="back-face">
                <img src="https://flagcdn.com/w160/${countryCode}.png" alt="Flag of ${countryCode.toUpperCase()}">
            </div>
        `;

        card.addEventListener('click', flipCard);
        return card;
    }

    function shuffle(array) {
        array.sort(() => Math.random() - 0.5);
    }

    function startGame() {
        // Reset game state
        winMessage.style.display = 'none';
        lockBoard = false;
        hasFlippedCard = false;
        flips = 0;
        time = 0;
        matchedPairs = 0;
        flipsElement.textContent = flips;
        timeElement.textContent = time;
        clearInterval(timer);
        
        // Clear previous board
        gameBoard.innerHTML = '';
        
        // Create and shuffle cards
        cardData = [...countryCodes, ...countryCodes];
        shuffle(cardData);

        cardData.forEach(code => {
            const card = createCard(code);
            gameBoard.appendChild(card);
        });

        startTimer();
    }

    function startTimer() {
        timer = setInterval(() => {
            time++;
            timeElement.textContent = time;
        }, 1000);
    }

    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;

        this.classList.add('flip');

        if (!hasFlippedCard) {
            // first click
            hasFlippedCard = true;
            firstCard = this;
            return;
        }

        // second click
        secondCard = this;
        lockBoard = true;
        
        incrementFlips();
        checkForMatch();
    }
    
    function incrementFlips() {
        flips++;
        flipsElement.textContent = flips;
    }

    function checkForMatch() {
        let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;
        isMatch ? disableCards() : unflipCards();
    }

    function disableCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        
        matchedPairs++;
        if (matchedPairs === countryCodes.length) {
            winGame();
        }

        resetBoard();
    }

    function unflipCards() {
        setTimeout(() => {
            firstCard.classList.remove('flip');
            secondCard.classList.remove('flip');
            resetBoard();
        }, 1200);
    }

    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }
    
    function winGame() {
        clearInterval(timer);
        winMessage.style.display = 'flex';
    }
    
    restartButton.addEventListener('click', startGame);
    playAgainButton.addEventListener('click', startGame);

    // Initial game start
    startGame();
});
