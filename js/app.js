/*
 * Create a list that holds all of your cards
 */
let cardsUnique = ["heart","female","diamond","male","glass","gift","fort-awesome","music"];
//Each card must have pair--> creating pairs by duplicating cardUnique array
let gameCards = [...cardsUnique, ...cardsUnique];

let openCards = [];
let matchedCards = [];

// variable used to start the timer only after the first click on a card
let firstCardclicked = true;

// MOVES
const moves = document.querySelector(".moves");
moves.innerText = 0 +" Moves";
let numMoves = 0;

// STAR RATING
const stars = document.querySelectorAll(".fa-star");
let rating = 3;
// you can set here the breakpoint in moves to change the star rating
//I made them parametric so in future I can change the num of cards
//if we have 16 cards, if numMoves = 12 ---> star rating is 2
const moves_to_two_stars = gameCards.length/2 + gameCards.length/4;
//if we have 16 cards, if numMoves = 14 ---> star rating is 1
const moves_to_one_star = gameCards.length/2 + gameCards.length/4 + gameCards.length/8;

// TIMER
let timer;
const hours = document.querySelector(".hours");
const minutes = document.querySelector(".minutes");
const seconds = document.querySelector(".seconds");

// DECK
const deck = document.querySelector(".deck");
// Event listener -> on click on deck, flip card
deck.addEventListener('click',clickOnCard);

// RESTART BUTTON
const restart = document.querySelector(".restart");
// Event listener -> on click on restart button, start a new game
restart.addEventListener('click',newGame);

// MODAL
const modal = document.getElementById("win_modal");
const finalTime = document.getElementById("final_time");
const finalMoves = document.getElementById("final_moves_number");
const finalStarsNumber = document.getElementById("final_stars_number");
const finalStarsText = document.getElementById("final_stars_text");
const restartGameFromModalBtn = document.getElementById("restart_game_from_modal_btn");
// Event listener -> on click on button, hide modal and start a new game
restartGameFromModalBtn.addEventListener('click', restartGameFromModal);

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}





/*
 * Start the game!
 */
startGame();

/*
 *   ---------------------- FUNCTIONS ----------------------
 */

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
function startGame() {
    // shuffle the icons for the cards
    let shuffledCards=shuffle(gameCards);

    // create the card HTML and add it to the page
    const fragment = document.createDocumentFragment();
    for(let card of shuffledCards){
        const listItem = document.createElement("li");
        listItem.className ="card ";
        // I can do in this way
        listItem.innerHTML = `<i class = "fa fa-${card}"></i>`;
        /* or I can do:
        const link = document.createElement("i");
        link.classList.add("fa", "fa-"+card);
        listItem.appendChild(link);*/
        fragment.appendChild(listItem);
    }
    deck.appendChild(fragment);

    isFirstCardclicked = true;
}

/*
 * Shuffle function from http://stackoverflow.com/a/2450976
 */
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

/*
 * When the user click on a card, the card is flipped
 */
function clickOnCard(e) {
    // if the target isn't a card, stop the function
    if (!e.target.classList.contains('card')) return;
    // if the user click the first time on a card (-->that is flip the first card) the timer starts
    if(isFirstCardclicked) {
        startTimer();
        isFirstCardclicked=false;
    }
    if (openCards.length<2) {
        let cardClicked = e.target;
        console.log("clicked "+e.target.querySelector('i').classList);
        // show the card
        showSymbol(cardClicked);
        // save the card clicked
        addOpenCard(cardClicked);
    }
    if (openCards.length == 2) {
        // to stop from further clicking on cards until animation is finished
        deck.removeEventListener('click', clickOnCard);
        checkMatch(openCards[0], openCards[1]);
        updateMovesCounter();
        updateRating();
    }
}

/*
 * Start the timer
 */
function startTimer() {
    timer = setInterval(function () {
        seconds.innerText=addLeadingZero(++seconds.innerText);
        if (seconds.innerText == 60) {
            minutes.innerText=addLeadingZero(++minutes.innerText);
            seconds.innerText = "00";
        }
        if (minutes.innerText == 60) {
            hours.innerText=addLeadingZero(++hours.innerText );
            minutes.innerText ="00";
        }
    }, (1000));
    console.log("Timer started!");
    return timer;
}

/*
 *  Display the card's symbol
 */
function showSymbol(card) {
    card.classList.add('open','show', 'disabled');
}

/*
 *  Add the card to a *list* of "open" cards
 */
function addOpenCard(card) {
    openCards.push(card);
}

/*
 * Update the counter of 1 every time the user click on two cards
 * show it on the page put attention on singular/plural of the word "move"
 */
function updateMovesCounter() {
    numMoves++;
    if (numMoves == 1){
        moves.textContent = numMoves + " Move";
    }
    else {
        moves.textContent = numMoves + " Moves";
    }
}

/*
 *  Update rating in base on moves counter and show it on the page
 */
function updateRating() {
    //Rating game based on move count
    if (numMoves == (moves_to_two_stars)) {
        stars[2].classList.remove("fa-star");
        stars[2].classList.add("fa-star-o");
        rating = 2;
    }
    else if (numMoves == (moves_to_one_star)) {
        stars[1].classList.remove("fa-star");
        stars[1].classList.add("fa-star-o");
        rating = 1;
    }
}

/*
 * Check if the two clicked cards match or not
 * if the cards do match, lock the cards in the open position
 * if the cards do not match, remove the cards from the list of open cards and hide the card's symbol
 */
function checkMatch(card1,card2){
    setTimeout(function () {
        //cards match
        //I can also check card1.querySelector('i').classList[1]==card2.querySelector('i').classList[1]
        if (card1.innerHTML === card2.innerHTML){
            console.log("Matched cards!"+
            "  "+card1.querySelector('i').classList+
            card2.querySelector('i').classList);

            card1.classList.add("match");
            card2.classList.add("match");

            card1.classList.add("animated","tada");
            card2.classList.add("animated","tada");

            matchedCards.push(card1);
            matchedCards.push(card2);

            openCards = [];

            deck.addEventListener('click', clickOnCard);

            //Check if the game is over
            if(isOver()){
                console.log("you win");
                stopTimer();
                endGame();
            }

        } else { //cards don't match
              console.log("Non matched cards!"+
              card1.querySelector('i').classList+" "+card2.querySelector('i').classList);

              card1.classList.add("no-match");
              card2.classList.add("no-match");

              card1.classList.add("animated","shake");
              card2.classList.add("animated","shake");

              setTimeout(function() {
                  card1.classList.remove("open", "show", "no-match", "animated", "shake", "disabled");
                  card2.classList.remove("open", "show", "no-match", "animated", "shake", "disabled");
                  openCards = [];
                  deck.addEventListener('click', clickOnCard);
            }, 800);
        }
   }, 800);

}

/*
 * Check if the user matched all the cards
 */
function isOver(){
    return matchedCards.length == gameCards.length ? true : false;
}

/*
 * Stop the timer
 */
function stopTimer() {
    clearInterval(timer);
    console.log("Timer stopped!");
}

/*
 * End of the game
 */
function endGame() {
    setTimeout(function() {
        modal.style.display = 'block';
        finalTime.innerText = hours.innerText + " h: " + minutes.innerText + " m: " + seconds.innerText + " s";
        finalMoves.innerText = numMoves;
        finalStarsNumber.innerText = rating;
        finalStarsText.innerText = rating>1 ? " stars" : " star";
   }, 1500);
}

/*
 * Hide again the modal and then launch newGame when the modal button
 * is clicked by the user
 */
function restartGameFromModal() {
    modal.style.display = "none";
    newGame();
}

/*
 * Start a new game
 */
function newGame(e) {

    // Delete All cards
    deck.innerHTML="";

    // Reset any related variable

    // reset open cards
    openCards = [];
    // reset pairs
    matchedCards=[];
    // reset moves
    resetMoves();
    // reset star rating
    resetStarRating();
    //reset timer
    resetTimer();

    //play
    startGame();

    //clickOnCard();
    deck.addEventListener('click',clickOnCard);
}

/*
 * Reset to 0 the moves counter
 */
function resetMoves() {
    numMoves = 0;
    moves.innerText = 0 +" Moves";
}

/*
 * Reset the star rating. The user starts with 3 stars
 */
function resetStarRating() {
    stars[1].classList.remove("fa-star-o");
    stars[1].classList.add("fa-star");
    stars[2].classList.remove("fa-star-o");
    stars[2].classList.add("fa-star");
    rating = 3;
}

/*
 * Reset the timer
 */
function resetTimer() {
    stopTimer();
    seconds.innerText = "00";
    minutes.innerText = "00";
    hours.innerText = "00";
}

/*
 * Add leading 0 if it is a number < 10
 */
function addLeadingZero(i) {
    if (i<10) {
        i = "0" + i;
    }
    return i;
}
