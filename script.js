
/* =====================================
   MEMORY MATCH GAME
===================================== */

// Get HTML elements
const startBtn = document.getElementById("startBtn");
const welcomeScreen = document.getElementById("welcomeScreen");
const playScreen = document.getElementById("playScreen");

const gameBoard = document.getElementById("gameBoard");
const movesDisplay = document.getElementById("moves");
const timerDisplay = document.getElementById("timer");
const restartBtn = document.getElementById("restartBtn");
const bestScoreDisplay = document.getElementById("bestScore");


const winScreen = document.getElementById("winScreen");
const finalMoves = document.getElementById("finalMoves");
const finalTime = document.getElementById("finalTime");
const playAgainBtn = document.getElementById("playAgainBtn");



/* =====================================
   BEST SCORE
===================================== */

// Retrieve saved best score
let bestScore = localStorage.getItem("memoryBestScore");

// Display saved best score
if (bestScore !== null) {
    bestScoreDisplay.textContent = bestScore;
}


/* =====================================
   GAME VARIABLES
===================================== */

// Eight pairs of fruits
const fruits = [
    "🍎", "🍓", "🍋", "🍇",
    "🍉", "🍒", "🍍", "🥝"
];

let firstCard = null;
let secondCard = null;
let lockBoard = false;

let moves = 0;
let seconds = 0;
let timer = null;
let matchedPairs = 0;

// Store the timeout for unmatched cards
let flipBackTimeout = null;

// Store the timeout for the winning message
let winTimeout = null;

// Check whether the game is finished
let gameFinished = false;


/* =====================================
   TIMER FUNCTIONS
===================================== */

// Start the timer

function startTimer() {
    if (timer !== null || gameFinished) return;

    timer = setInterval(function () {
        seconds++;

        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        timerDisplay.textContent =
            String(minutes).padStart(2, "0") + ":" +
            String(remainingSeconds).padStart(2, "0");

    }, 1000);
}


// Stop the timer
function stopTimer() {

    clearInterval(timer);

    timer = null;

}


/* =====================================
   SAVE BEST SCORE
===================================== */

function saveBestScore() {

    // Save only if this is the first score
    // or the player achieved fewer moves
    if (bestScore === null ||
        moves < Number(bestScore)) {

        bestScore = moves;

        localStorage.setItem(
            "memoryBestScore",
            bestScore
        );

        bestScoreDisplay.textContent = bestScore;

    }

}


/* =====================================
   SHUFFLE CARDS
===================================== */

function shuffleCards(cards) {

    // Fisher-Yates shuffle
    for (let i = cards.length - 1; i > 0; i--) {

        const j = Math.floor(
            Math.random() * (i + 1)
        );

        // Swap two cards
        const temp = cards[i];
        cards[i] = cards[j];
        cards[j] = temp;

    }

    return cards;

}


/* =====================================
   CREATE GAME
===================================== */

function createGame() {

    // Cancel any pending card flip
    clearTimeout(flipBackTimeout);
    flipBackTimeout = null;

    // Cancel any pending winning message
    clearTimeout(winTimeout);
    winTimeout = null;

    // Stop previous timer
    stopTimer();

    // Reset game variables
    firstCard = null;
    secondCard = null;
    lockBoard = false;

    moves = 0;
    seconds = 0;
    matchedPairs = 0;
    gameFinished = false;

    // Reset display
    movesDisplay.textContent = moves;
    timerDisplay.textContent = "00:00";

    // Remove previous cards
    gameBoard.innerHTML = "";

    // Create eight matching pairs
    const cards = [...fruits, ...fruits];

    // Shuffle the cards
    shuffleCards(cards);


    /* =====================================
       CREATE EACH CARD
    ===================================== */

    cards.forEach(function (fruit) {

        const card = document.createElement("button");

        card.classList.add("card");

        card.textContent = "?";

        card.dataset.fruit = fruit;

        card.type = "button";

        card.setAttribute(
            "aria-label",
            "Hidden card"
        );


        /* =====================================
           CARD CLICK EVENT
        ===================================== */

        card.addEventListener("click", function () {

            // Prevent invalid clicks
            if (
                lockBoard ||
                gameFinished ||
                card === firstCard ||
                card.classList.contains("matched")
            ) {
                return;
            }

            // Start timer on first click
            startTimer();

            // Reveal the fruit
            card.textContent = fruit;

            card.classList.add("flipped");

            card.setAttribute(
                "aria-label",
                fruit
            );


            /* =====================================
               FIRST CARD
            ===================================== */

            if (firstCard === null) {

                firstCard = card;

                return;

            }


            /* =====================================
               SECOND CARD
            ===================================== */

            secondCard = card;

            // Increase moves by one
            moves++;

            movesDisplay.textContent = moves;


            /* =====================================
               CHECK MATCH
            ===================================== */

            if (
                firstCard.dataset.fruit ===
                secondCard.dataset.fruit
            ) {

                // Mark both cards as matched
                firstCard.classList.add("matched");

                secondCard.classList.add("matched");

                // Disable matched cards
                firstCard.disabled = true;
                secondCard.disabled = true;

                // Increase matched pairs
                matchedPairs++;

                // Reset selected cards
                firstCard = null;
                secondCard = null;


                /* =====================================
                   WINNING CONDITION
                ===================================== */

               

if (matchedPairs === fruits.length) {

    gameFinished = true;

    stopTimer();

    saveBestScore();

    winTimeout = setTimeout(function () {

        finalMoves.textContent = moves;
      finalTime.textContent =
    String(Math.floor(seconds / 60)).padStart(2, "0") + ":" +
    String(seconds % 60).padStart(2, "0");

        playScreen.hidden = true;
        winScreen.hidden = false;

        winTimeout = null;

    }, 300);

}



            } else {


                /* =====================================
                   CARDS DO NOT MATCH
                ===================================== */

                // Prevent clicking more cards
                lockBoard = true;

                // Remember selected cards
                const cardOne = firstCard;
                const cardTwo = secondCard;

                // Hide cards after one second
                flipBackTimeout = setTimeout(function () {

                    cardOne.textContent = "?";
                    cardTwo.textContent = "?";

                    cardOne.classList.remove("flipped");
                    cardTwo.classList.remove("flipped");

                    cardOne.setAttribute(
                        "aria-label",
                        "Hidden card"
                    );

                    cardTwo.setAttribute(
                        "aria-label",
                        "Hidden card"
                    );

                    // Reset selected cards
                    firstCard = null;
                    secondCard = null;

                    // Unlock game board
                    lockBoard = false;

                    flipBackTimeout = null;

                }, 1000);

            }

        });

        // Add card to game board
        gameBoard.appendChild(card);

    });

}


/* =====================================
   START GAME BUTTON
===================================== */

startBtn.addEventListener("click", function () {

    // Hide welcome screen
    welcomeScreen.hidden = true;

    // Show game screen
    playScreen.hidden = false;

    // Start a fresh game
    createGame();

});


/* =====================================
   RESTART GAME BUTTON
===================================== */

restartBtn.addEventListener("click", function () {

    createGame();

});

playAgainBtn.addEventListener("click", function () {

    winScreen.hidden = true;
    playScreen.hidden = false;

    createGame();

});


/* =====================================
   INITIALIZE GAME
===================================== */

// Prepare the cards when the page loads
createGame();
