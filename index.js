// get from internet

// const easy = [
//   '21537986498612435773485621945278169386954317237169248552741893664893752119326-7-8',
//   '215379864986124357734856219452781693869543172371692485527418936648937521193265748'
// ];

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
let timeRemaining;
let lives;
let selectedNumber;
let selectedBox;
let disabledGame;
let board;

document.addEventListener('DOMContentLoaded', function() {
  // Disable game by default
  disabledGame = true
  // set board by default
  setBoard(easy[0]);
  // set board base on selected level
  qsa('input[name="level"]').forEach(function (e) {
    e.addEventListener("change", function(event) {
      getGameLevel();

      disabledGame = true;
      id('states').classList.add('hidden');
      setBoard(board);
    });
  })
  // Click button to start the game
  id('start-btn').addEventListener('click', startGame);

  // set number block
  let quantityNumBlock = id('number-block').children.length
  // Click each number-block
  clickableNumBlock(quantityNumBlock)
});

document.addEventListener('keydown', function(e) {
  if (selectedBox != null) {
    if (!isNaN(parseInt(e.key))) {
      selectedBox.textContent = e.key;
      

      if (checkAnswer(selectedBox)) {
        selectedBox.classList.remove('selected');
        selectedBox = null;

        if (checkGame()) {
          gameResult();
        }
      } else {
        // if number is not correct
        disabledGame = true;
        // Make box to appear font color in red
        selectedBox.classList.add('incorrect');
        // Remove wrong number in seconds
        setTimeout(function() {
          // Deduct one live
          lives --;
          // Check if there is still live
          if (lives === 0) {
            gameResult();
          } else {
            id('lives').textContent = `Lives Remaning: ${lives}`;
            disabledGame = false;
          }
          selectedBox.classList.remove('incorrect', 'selected');
          // Clear Box and selected variables
          selectedBox.textContent = '';
          selectedBox = null;
        }, 1000);
      }
    }
  }
})

function startGame(e) {
// Set lives to 5 and enable selecting numbers and tiles
  lives = 5;
  disabledGame = false;
  id('states').classList.remove('hidden');
  id('lives').textContent = `Lives Remaning: ${lives}`;

  // Create board based on level
  getGameLevel();
    
  setBoard(board);

  // Starts timer
  setTimer();
}

function setBoard(board) {
  // Clear previous board
  clearBoard();
  // Let used to increment box ids
  let idCount = 0;
  // Create 81 boxes
  for (let i=0; i < 81; i++) {
    let box = document.createElement('p');
    // Assign box id
    box.id = idCount;
    // Increment for next box + 1
    idCount ++;
    // Add box class to all boxes
    box.classList.add('box');
    // Check if it is not a dash then it should not be blank
    if (board.charAt(i) != '-') {
      // set box number
      box.textContent = board.charAt(i);
    } else {
      // Add eventListener to Box
      box.addEventListener('click', function() {
        if (!disabledGame) {
          // If selection exists
          if (box.classList.contains('selected')) {
            // Remove selection
            box.classList.remove('selected');
            selectedBox = null;
          } else {
            // Deselect all boxes
            for (let i=0; i < 81; i++) {
              qsa('.box')[i].classList.remove('selected');
            }
            // Show selection and update content
            box.classList.add('selected');
            selectedBox = box;
            updateBox();
          }
        }
      });
    }

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
  for (let i=0; i < boxes.length; i++) {
    boxes[i].remove();
  }
  // If there is a timer clear it
  if (timer) clearTimeout(timer);
  // Deselect any numbers
  for (let i=0; i < id('number-block').children.length; i++) {
    id('number-block').children[i].classList.remove('selected');
  }
  // Clear selected variables
  selectedBox = null;
  selectedNumber = null;
}

function setTimer() {
  // Set remaining time and convert mins to seconds
  if (id('time-1').checked) {
    timeRemaining = Number(id('time-1').value) * 60;
  } else if (id('time-2').checked) {
    timeRemaining = Number(id('time-2').value) * 60;
  } else {
    timeRemaining = Number(id('time-3').value) * 60;
  }
  
  // Set timer
  id('timer').textContent = convertTime(timeRemaining);
  // Update timer every second
  timer = setInterval(function() {
          timeRemaining --;
          // If no time reaches 0 end the game
          if (timeRemaining === 0) {
            gameResult();
          }
          id('timer').textContent = convertTime(timeRemaining);
          }, 1000)
}

// Covert seconds into Mins : Secs format
function convertTime(time) {
  let mins = Math.floor(time/60);
  let secs = time % 60;
  if (secs < 10) {
    secs = `0${secs}`;
  }
  return `${mins} : ${secs}`;
}

function clickableNumBlock(quantityNumBlock) {
  for (let i=0; i < quantityNumBlock; i++) {
    id('number-block').children[i].addEventListener('click', function() {
      // if disabledGame is true
      if (!disabledGame) {
        // Check if a number is being selected
        if (this.classList.contains('selected')) {
          this.classList.remove('selected');
          selectedNumber = null;
        } else {
          // Deselect all numbers
          for (let i=0; i < quantityNumBlock; i++) {
            id('number-block').children[i].classList.remove('selected');
          }
          // Select clicked block and update selectedNumber variable
          this.classList.add('selected');
          selectedNumber = this;
          updateBox();
        }
      }
    });
  }
}

function updateBox() {
  // Check both selectedNumber and selectedBox see whether they have value or null
  if (selectedNumber && selectedBox) {
    selectedBox.textContent = selectedNumber.textContent;

    // Check if the number inside the selectedBox matches with the right solution
    if (checkAnswer(selectedBox)) {
      // Deselect both selected number and box
      selectedNumber.classList.remove('selected');
      selectedBox.classList.remove('selected');
      // Clear both selectedNumber and selectedBox value
      selectedNumber = null;
      selectedBox = null;
      // Check if the game is completed
      if (checkGame()) {
        gameResult();
      }
    } else {
      // if number is not correct
      disabledGame = true;
      // Make box to appear font color in red
      selectedBox.classList.add('incorrect');
      // Remove wrong number in seconds
      setTimeout(function() {
        // Deduct one live
        lives --;
        // Check if there is still live
        if (lives === 0) {
          gameResult();
        } else {
          id('lives').textContent = `Lives Remaning: ${lives}`;
          disabledGame = false;
        }
        selectedBox.classList.remove('incorrect', 'selected');
        selectedNumber.classList.remove('selected');
        // Clear Box and selected variables
        selectedBox.textContent = '';
        selectedBox = null;
        selectedNumber = null;
      }, 1000);
    }
  }
}

function checkGame() {
  let boxes = qsa('.box');
  // Check if every single box is filled
  for (let i=0; i < boxes.length; i++) {
    if (boxes[i].textContent === '') {
      return false;
    }
  }
  return true;
}

function gameResult() {
  // Disable Action
  disabledGame = true;
  // Stop Timer
  clearTimeout(timer);
  // Show result
  if (lives === 0 || timeRemaining === 0) {
    id('lives').textContent = 'You Lost!';
  } else {
    id('lives').textContent = 'You Won!';
  }
}

function checkAnswer(box) {
  // Get solution from chosen level
  let answer;
  if (id('level-easy').checked) {
    answer = easy[1];
  } else if (id('level-medium').checked) {
    answer = medium[1];
  } else {
    answer = hard[1];
  }
  // check both box's number and answer
  if (answer.charAt(box.id) === box.textContent) {
    return true
  } else {
    return false
  }
}

// Helper Functions
function id(id) {
  return document.getElementById(id)
}

function cn(class_name) {
  return document.getElementsByClassName(class_name)
}

function qs(selector) {
  return document.querySelector(selector)
}

function qsa(selector) {
  return document.querySelectorAll(selector)
}

function getGameLevel() {
  if (id('level-easy').checked) {
    board = easy[0];
  } else if (id('level-medium').checked) {
    board = medium[0];
  } else board = hard[0];
}