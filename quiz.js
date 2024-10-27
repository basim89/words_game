document.addEventListener('DOMContentLoaded', () => {
    const wordImage = document.getElementById('word-image');
    const wordLetters = document.getElementById('word-letters');
    const letterPlaceholders = document.getElementById('letter-placeholders');
    const pronunciationButton = document.getElementById('pronunciation-button');
    const checkAnswerButton = document.getElementById('check-answer-button');
    const feedbackElement = document.getElementById('feedback');
    const nextLevelButton = document.getElementById('next-level-button');

    const levels = [
        { word: 'specialty', image: 'images/specialty.png', sound: 'sounds/words/specialty.mp3' },
        { word: 'local', image: 'images/local.png', sound: 'sounds/words/local.mp3' },
        { word: 'crosswalk', image: 'images/crosswalk.png', sound: 'sounds/words/crosswalk.mp3' },
        { word: 'explain', image: 'images/explain.png', sound: 'sounds/words/explain.mp3' },
        { word: 'abroad', image: 'images/abroad.png', sound: 'sounds/words/abroad.mp3' }
    ];

    let currentLevelIndex = 0;
    let currentWord = '';

    function loadLevel() {
        const level = levels[currentLevelIndex];
        currentWord = level.word;
        wordImage.src = level.image;
        wordImage.alt = level.word;
        wordLetters.innerHTML = '';
        letterPlaceholders.innerHTML = '';

        const scrambledLetters = scrambleWord(level.word);
        scrambledLetters.forEach(letter => {
            const letterElement = document.createElement('div');
            letterElement.classList.add('letter');
            letterElement.textContent = letter;
            letterElement.draggable = true;
            letterElement.addEventListener('dragstart', handleDragStart);
            wordLetters.appendChild(letterElement);
        });

        for (let i = 0; i < level.word.length; i++) {
            const placeholderElement = document.createElement('div');
            placeholderElement.classList.add('placeholder');
            placeholderElement.addEventListener('dragover', handleDragOver);
            placeholderElement.addEventListener('drop', handleDrop);
            letterPlaceholders.appendChild(placeholderElement);
        }

        pronunciationButton.addEventListener('click', () => playSound(level.sound));
        nextLevelButton.disabled = true;
    }

    function scrambleWord(word) {
        return word.split('').sort(() => Math.random() - 0.5);
    }

    function handleDragStart(event) {
        event.dataTransfer.setData('text/plain', event.target.textContent);
    }

    function handleDragOver(event) {
        event.preventDefault();
    }

    function handleDrop(event) {
        event.preventDefault();
        const data = event.dataTransfer.getData('text/plain');
        event.target.textContent = data;
    }

    function checkWord() {
        const letters = Array.from(letterPlaceholders.children).map(placeholder => placeholder.textContent);
        const spelledWord = letters.join('');
        if (spelledWord === currentWord) {
            feedbackElement.textContent = "Correct!";
            feedbackElement.classList.add('correct');
            playSound('sounds/correct.mp3');
            nextLevelButton.disabled = false;
        } else {
            feedbackElement.textContent = "Wrong!";
            feedbackElement.classList.remove('correct');
            playSound('sounds/wrong.mp3');
        }
    }

    function playSound(soundPath) {
        const audio = new Audio(soundPath);
        audio.play();
    }

    checkAnswerButton.addEventListener('click', checkWord);

    nextLevelButton.addEventListener('click', () => {
        currentLevelIndex++;
        if (currentLevelIndex < levels.length) {
            loadLevel();
        } else {
            wordImage.src = '';
            wordLetters.innerHTML = '';
            letterPlaceholders.innerHTML = '';
            feedbackElement.textContent = "Game Over! You've completed all levels.";
            nextLevelButton.disabled = true;
        }
    });

    loadLevel();
});
