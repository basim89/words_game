document.addEventListener('DOMContentLoaded', () => {

    const cardGrid = document.getElementById('card-grid');
    const feedbackElement = document.getElementById('feedback');
    const resetButton = document.getElementById('reset-button');

    const cards = [
        { type: 'word', content: 'specialty', sound: 'sounds/words/specialty.mp3' },
        { type: 'word', content: 'local', sound: 'sounds/words/local.mp3' },
        { type: 'word', content: 'crosswalk', sound: 'sounds/words/crosswalk.mp3' },
        { type: 'word', content: 'explain', sound: 'sounds/words/explain.mp3' },
        { type: 'word', content: 'abroad', sound: 'sounds/words/abroad.mp3' },
        { type: 'image', content: 'images/specialty.png', word: 'specialty' },
        { type: 'image', content: 'images/local.png', word: 'local' },
        { type: 'image', content: 'images/crosswalk.png', word: 'crosswalk' },
        { type: 'image', content: 'images/explain.png', word: 'explain' },
        { type: 'image', content: 'images/abroad.png', word: 'abroad' }
    ];

    let flippedCards = [];
    let matchedPairs = 0;

    function initializeGame() {
        feedbackElement.textContent = '';
        cardGrid.innerHTML = '';
        matchedPairs = 0;
        const shuffledCards = shuffle(cards);

        shuffledCards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.dataset.type = card.type;
            cardElement.dataset.content = card.content;
            cardElement.dataset.word = card.word || card.content;

            const contentElement = document.createElement('div');
            contentElement.classList.add('card-content');
            cardElement.appendChild(contentElement);

            cardElement.addEventListener('click', () => handleCardClick(cardElement, contentElement, card));
            cardGrid.appendChild(cardElement);
        });
    }

    function shuffle(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    function handleCardClick(cardElement, contentElement, card) {
        if (cardElement.classList.contains('flipped') || flippedCards.length === 2) return;

        playSound(card.sound);
        cardElement.classList.add('flipped');
        contentElement.style.backgroundImage = card.type === 'image' ? `url(${card.content})` : 'none';
        contentElement.textContent = card.type === 'word' ? card.content : '';

        if (card.type === 'word') {
            contentElement.classList.add('mirrored'); // Apply the mirrored class
        }

        flippedCards.push({ element: cardElement, content: contentElement, word: card.word || card.content });

        if (flippedCards.length === 2) {
            checkForMatch();
        }
    }

    function checkForMatch() {
        const [card1, card2] = flippedCards;
        if (card1.word === card2.word) {
            matchedPairs++;
            feedbackElement.textContent = 'Correct Match!';
            playSound('sounds/correct.mp3'); // Play correct sound
            flippedCards = [];
            if (matchedPairs === cards.length / 2) {
                feedbackElement.textContent = 'Congratulations! You matched all pairs!';
                setTimeout(() => {
                    window.location.href = '../hostpage.html'; // Redirect to the hostpage.html
                }, 2000); // Delay the redirect by 2 seconds
            }
        } else {
            setTimeout(() => {
                card1.element.classList.remove('flipped');
                card1.content.classList.remove('mirrored'); // Remove the mirrored class
                card1.content.style.backgroundImage = '';
                card1.content.textContent = '';
                card2.element.classList.remove('flipped');
                card2.content.classList.remove('mirrored'); // Remove the mirrored class
                card2.content.style.backgroundImage = '';
                card2.content.textContent = '';
                feedbackElement.textContent = 'Try Again!';
                playSound('sounds/wrong.mp3'); // Play wrong sound
                flippedCards = [];
            }, 1000);
        }
    }

    function playSound(soundSrc) {
        const audio = new Audio(soundSrc);
        audio.play();
    }

    resetButton.onclick = initializeGame;

    initializeGame();
});
