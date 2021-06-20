// get from internet
const easy = [
  '2-5--9--4------3-77--856-1-45-7-------9---1-------2-85-2-418--66-8------1--2--7-8',
  '215379864986124357734856219452781693869543172371692485527418936648937521193265748'
];

const medium = [
  '--6-9-2-----7-2----9-5-8-7-9---3---675-----191---4---5-1-3-9-8----2-1-----9-8-1--',
  '876493251345712968291568473982135746754826319163947825417359682638271594529684137'
];

const hard = [
  '---8-----789-1---6-----61----7----5-5-87-93-4-4----2----32-----8---7-439-----1---',
  '165847923789312546432596178297463851518729364346158297973284615821675439654931782'
];

// Create variables
let timer;
let timerRemaining;
let lives;
let selectedNumber;
let selectedBox;
let disableSelect;

window.onload = function() {
  // Run startgame function when button is clicked
  id('start-btn').addEventListener('click', startGame);
}

function startGame() {
  // Choose Game level
  let board;

  if (id('level-easy').checked) {
    board = easy[0];
  } else if (id('level-medium').checked) {
    board = medium[0];
  } else board = hard[0];
    
  // Set lives to 3 and enable selecting numbers and tiles
  lives = 3;
  disableSelect = false;
  id('lives').textContent = `Lives Remaning: ${lives}`;

  // Create board based on level
  setBoard(board);
}

function setBoard(board) {
  // Clear previous board
  clearBoard();
  // Let used to increment box ids
  let idCount = 0;
  // Create 81 boxes
  for (let i=0; i < 81; i++) {
    var box = document.createElement('p');
    // Check if it is not a dash then it should not be blank
    if (board.charAt(i) != '-') {
      // set box number
      box.textContent = board.charAt(i);
    } else {
      // make the box blank
    }
    // Assign box id
    box.id = idCount;

    // Increment for next box
    idCount ++;

    // Add box class to all boxes
    box.classList.add('box');

    // Add thick border-top
    if ((box.id >= 0 && box.id < 9) || (box.id > 26 && box.id < 36) || (box.id > 53 && box.id < 63)) {
      box.classList.add('upperBorder');
    }
    // Add thick border-bottom
    if ((box.id > 71 && box.id < 81)) {
      box.classList.add('bottomBorder');
    }
    // Add thick border-left
    if ((box.id + 1) % 9 == 1 || (box.id + 1) % 9 == 4 || (box.id + 1) % 9 == 7 ) {
      box.classList.add('leftBorder');
    }
    // Add thick border-right
    if ((box.id + 1) % 9 == 0) {
      box.classList.add('rightBorder');
    }

    // Add box to board
    id('board').appendChild(box);
  }
}

function clearBoard() {
  // Access all of the boxes
  let boxes = qsa('.box')
  // Remove each box
    // Looks like
    // boxes[0].remove();
    // boxes[1].remove();
    // boxes[2].remove();
  for (let i=0; i < boxes.length; i++) {
    boxes[i].remove();
  }
  // If there is a timer clear it
  if (timer) clearTimeout(timer);
  // Deselect any numbers
  for (let i=0; i < id('number-container').children.length; i++) {
    id('number-container').children[i].classList.remove('selected');
  }
  // Clear selected variables
  selectedBox = null;
  selectedNumber = null;
}

// Helper Functions
function id(id) {
  return document.getElementById(id)
}

function qs(selector) {
  return document.querySelector(selector)
}

function qsa(selector) {
  return document.querySelectorAll(selector)
}