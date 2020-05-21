// Minesweeper

let c = document.querySelector("#myCanvas");
let ctx = c.getContext("2d");

// Turn this to true to see where the mines are.
let testMode = false;

let grid = document.querySelector("#app");
let cols;
let rows;
let totalMines = 20;
// The height and width of each cell
const w = 40;
let gameStarted = false;

let resetGridButton = document.querySelector("#resetGridButton");
let levelSelection = document.querySelector("#levelSelection");

let make2DArray = (cols, rows) => {
  let arr = new Array(cols);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
  }
  return arr;
}

let setup = () => {
  // Set total mines based on difficulty selection.
  switch (levelSelection.value) {
    case "easy":
      totalMines = 10;
      break;
    case "normal":
      totalMines = 20;
      break;
    case "hard":
      totalMines = 30;
      break;
  }
  // Calculate number or cols and rows based on canvas size.
  cols = Math.floor(400 / w);
  rows = Math.floor(400 / w);
  grid = make2DArray(cols, rows);
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = new Cell(i, j, w);
    }
  }
  // Pick total Mines spots
  let options = [];
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      options.push([i,j]);
    }
  }
  for (let n = 0; n < totalMines; n++) {
    let index = getRandom(0,options.length);
    let choice = options[index];
    let i = choice[0];
    let j = choice[1];
    // Deletes that spot so it's no longer an option.
    options.splice(index, 1);
    grid[i][j].mine = true;
  }
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].countNeighborMines();
    }
  }
}

let getRandom = (min, max) => {
  // Inclusive min, exclusive max.
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

let checkLevelComplete = () => {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (!grid[i][j].mine && !grid[i][j].revealed) {
        return;
      }
    }
  }
  revealAll();
  alert("You Win!");
  gameStarted = false;
}

let revealAll = () => {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].revealed = true;
      grid[i][j].show();
    }
  }
}

let gameOver = () => {
  revealAll();
  alert("Game Over");
  gameStarted = false;
}

let mousePressed = (e) => {
  if (testMode || !gameStarted) {
    return;
  }
  // x, y are the click coordinates relative to the canvas itself.
  let x = e.clientX - c.offsetLeft;
  let y = e.clientY - c.offsetTop;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (grid[i][j].contains(x, y)) {
        grid[i][j].reveal();
        
        if (grid[i][j].mine) {
          gameOver();
          return;
        }
      }
    }
  }
  checkLevelComplete();
}

let draw = () => {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].show();
    }
  }
  gameStarted = true;
}

let resetGrid = () => {
  // Clear the canvas and re-run setup/draw grid.
  ctx.clearRect(0, 0, c.width, c.height);
  setup();
  draw();
}

c.addEventListener("click", mousePressed, false);
resetGridButton.addEventListener("click", resetGrid, false);
ctx.font = "20px Arial";
setup();
draw();
