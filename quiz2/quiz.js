document.addEventListener('DOMContentLoaded', () => {
    const wordDisplay = document.getElementById('word-display');
    const imageGrid = document.getElementById('image-grid');
    const pronunciationButton = document.getElementById('pronunciation-button');
    const checkAnswerButton = document.getElementById('check-answer-button');
    const feedbackElement = document.getElementById('feedback');
    const nextLevelButton = document.getElementById('next-level-button');

    const levels = [
        { word: 'test', image: 'images/specialty.png', sound: 'sounds/words/specialty.mp3' },
        { word: 'test', image: 'images/local.png', sound: 'sounds/words/local.mp3' },
        { word: 'test', image: 'images/crosswalk.png', sound: 'sounds/words/crosswalk.mp3' },
        { word: 'test', image: 'images/explain.png', sound: 'sounds/words/explain.mp3' },
        { word: 'test', image: 'images/abroad.png', sound: 'sounds/words/abroad.mp3' }
    ];

    let currentLevelIndex = 0;
    let currentWord = '';
    let selectedImage = null;
    let currentWordSound = '';

    function loadLevel() {
        const level = levels[currentLevelIndex];
        currentWord = level.word;
        currentWordSound = level.sound;
        wordDisplay.textContent = level.word;
        imageGrid.innerHTML = '';

        const shuffledLevels = shuffleArray(levels);
        shuffledLevels.forEach(level => {
            const imageItem = document.createElement('div');
            imageItem.classList.add('image-item');
            imageItem.innerHTML = `<img src="${level.image}" alt="${level.word}">`;
            imageItem.addEventListener('click', () => selectImage(level.word, imageItem));
            imageGrid.appendChild(imageItem);
        });

        pronunciationButton.removeEventListener('click', playCurrentWordSound);
        pronunciationButton.addEventListener('click', playCurrentWordSound);
        nextLevelButton.disabled = true;
    }

    function shuffleArray(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    function selectImage(word, element) {
        selectedImage = word;
        document.querySelectorAll('.image-item').forEach(item => item.classList.remove('selected'));
        element.classList.add('selected');
    }

    function checkWord() {
        if (selectedImage === currentWord) {
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

    function playCurrentWordSound() {
        playSound(currentWordSound);
    }

    checkAnswerButton.addEventListener('click', checkWord);

    nextLevelButton.addEventListener('click', () => {
        currentLevelIndex++;
        if (currentLevelIndex < levels.length) {
            loadLevel();
        } else {
            wordDisplay.textContent = '';
            imageGrid.innerHTML = '';
            feedbackElement.textContent = "Game Over! You've completed all levels.";
            nextLevelButton.disabled = true;
       // Redirect to another webpage using a relative path
window.location.href = '../index.html';
}
    });

    loadLevel();
});
