const wrapper = document.querySelector('.wrapper');
const timerDisplay = document.getElementById('timer');
const nextLevelButton = document.getElementById('nextLevel');
const homeButton = document.getElementById('home');
const alertModal = document.querySelector('.alert-modal');
const overlay = document.querySelector('.overlay');
const okButton = document.getElementById('okButton');

let cards = [];
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let time = 0;
let timer;
let level = 1;
const maxLevels = 10;

const pokemonImages = [
    'bulbasaur', 'charmander', 'squirtle', 'pikachu',
    'jigglypuff', 'meowth', 'psyduck', 'snorlax',
    'eevee', 'mewtwo'
];

function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}

function createCards() {
    const pokemonSet = pokemonImages.slice(0, level + 1);
    const duplicatedSet = [...pokemonSet, ...pokemonSet];
    shuffle(duplicatedSet);

    wrapper.innerHTML = '';
    duplicatedSet.forEach(pokemon => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.innerHTML = `
            <div class="view front-view">
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png" alt="Pokeball">
            </div>
            <div class="view back-view">
                <img src="${document.getElementById(pokemon).src}" alt="${pokemon}">
            </div>
        `;
        wrapper.appendChild(cardElement);
        cardElement.addEventListener('click', flipCard);
    });
    cards = document.querySelectorAll('.card');
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flip');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    checkForMatch();
}

function checkForMatch() {
    const isMatch = firstCard.querySelector('.back-view img').src === secondCard.querySelector('.back-view img').src;
    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetBoard();

    if (document.querySelectorAll('.card:not(.flip)').length === 0) {
        clearInterval(timer);
        showAlert();
    }
}

function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function startTimer() {
    timer = setInterval(() => {
        time++;
        timerDisplay.textContent = `Time: ${String(Math.floor(time / 60)).padStart(2, '0')}:${String(time % 60).padStart(2, '0')}`;
    }, 1000);
}

function showAlert() {
    alertModal.style.display = 'block';
    overlay.style.display = 'block';
}

function hideAlert() {
    alertModal.style.display = 'none';
    overlay.style.display = 'none';
}

function nextLevel() {
    if (level >= maxLevels) {
        alert('You have completed all levels!');
        level = 1;
    } else {
        level++;
    }
    time = 0;
    createCards();
    startTimer();
}

okButton.addEventListener('click', () => {
    hideAlert();
    nextLevel();
});

nextLevelButton.addEventListener('click', nextLevel);

homeButton.addEventListener('click', () => {
    clearInterval(timer);
    level = 1;
    createCards();
    time = 0;
    timerDisplay.textContent = 'Time: 00:00';
});

createCards();
startTimer();