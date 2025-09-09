const board = document.getElementById('board');
const status = document.getElementById('status');
const restartButton = document.getElementById('restart');
let currentPlayer = 'X';
let gameOver = false;
let cells = Array(9).fill('');

const emojis = {
  X: "🎅",
  O: "🎄"
};

function checkWinner() {
  const wins = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];

  for (let [a, b, c] of wins) {
    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
      gameOver = true;
      status.innerHTML = `🎉 ${emojis[cells[a]]} Player ${cells[a]} wins!`;
      return;
    }
  }

  if (!cells.includes('')) {
    gameOver = true;
    status.innerHTML = `🎁 It's a draw!`;
  } else {
    status.innerHTML = `🔔 ${emojis[currentPlayer]}'s Turn (Player ${currentPlayer})`;
  }
}

function renderBoard() {
  board.innerHTML = '';
  cells.forEach((val, i) => {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.innerHTML = val ? emojis[val] : '';
    cell.addEventListener('click', () => {
      if (!cells[i] && !gameOver) {
        cells[i] = currentPlayer;
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        renderBoard();
        checkWinner();
      }
    });
    board.appendChild(cell);
  });
}

function restartGame() {
  cells = Array(9).fill('');
  currentPlayer = 'X';
  gameOver = false;
  status.innerHTML = `🔔 ${emojis[currentPlayer]}'s Turn (Player ${currentPlayer})`;
  renderBoard();
}

restartButton.addEventListener('click', restartGame);

// Initial render
renderBoard();
status.innerHTML = `🔔 ${emojis[currentPlayer]}'s Turn (Player ${currentPlayer})`;