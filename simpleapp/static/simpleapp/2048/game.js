document.addEventListener('DOMContentLoaded', function () {
  const gridEl = document.getElementById('grid');
  const SIZE = 4;
  const CELLS = SIZE * SIZE;
  let board = new Array(CELLS).fill(0);

  function drawGrid() {
    gridEl.innerHTML = '';
    gridEl.style.gridTemplateColumns = `repeat(${SIZE}, 1fr)`;
    for (let i = 0; i < CELLS; i++) {
      const cell = document.createElement('div');
      cell.className = 'tile' + (board[i] === 0 ? ' empty' : '');
      cell.dataset.index = i;
      cell.textContent = board[i] === 0 ? '' : board[i];
      gridEl.appendChild(cell);
    }
  }

  function empties() {
    return board.map((v, i) => v === 0 ? i : -1).filter(i => i >= 0);
  }

  function addRandomTile() {
    const emptyIndexes = empties();
    if (!emptyIndexes.length) return false;
    const i = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
    board[i] = Math.random() < 0.9 ? 2 : 4;
    return true;
  }

  function resetBoard() {
    board = new Array(CELLS).fill(0);
    addRandomTile();
    addRandomTile();
    hideGameOver();
    drawGrid();
  }

  function isGameOver() {
    if (empties().length > 0) return false;
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        const idx = r * SIZE + c;
        const val = board[idx];
        if (c < SIZE - 1 && board[idx + 1] === val) return false;
        if (r < SIZE - 1 && board[idx + SIZE] === val) return false;
      }
    }
    return true;
  }

  function showGameOver() {
    const ov = document.getElementById('overlay-2048');
    if (ov) ov.classList.remove('hidden');
  }

  function hideGameOver() {
    const ov = document.getElementById('overlay-2048');
    if (ov) ov.classList.add('hidden');
  }

  function compress(row) {
    const arr = row.filter(v => v !== 0);
    while (arr.length < SIZE) arr.push(0);
    return arr;
  }

  function merge(row) {
    for (let i = 0; i < SIZE - 1; i++) {
      if (row[i] !== 0 && row[i] === row[i + 1]) {
        row[i] = row[i] * 2;
        row[i + 1] = 0;
      }
    }
    return row;
  }

  function moveLeft() {
    let moved = false;
    for (let r = 0; r < SIZE; r++) {
      const row = [];
      for (let c = 0; c < SIZE; c++) row.push(board[r * SIZE + c]);
      const compressed = compress(row);
      const merged = merge(compressed);
      const newRow = compress(merged);
      for (let c = 0; c < SIZE; c++) {
        if (board[r * SIZE + c] !== newRow[c]) moved = true;
        board[r * SIZE + c] = newRow[c];
      }
    }
    return moved;
  }

  function moveRight() {
    rotate180();
    const moved = moveLeft();
    rotate180();
    return moved;
  }

  function moveUp() {
    rotateLeft();
    const moved = moveLeft();
    rotateRight();
    return moved;
  }

  function moveDown() {
    rotateRight();
    const moved = moveLeft();
    rotateLeft();
    return moved;
  }

  function rotateRight() {
    const newBoard = new Array(CELLS).fill(0);
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        newBoard[c * SIZE + (SIZE - 1 - r)] = board[r * SIZE + c];
      }
    }
    board = newBoard;
  }

  function rotateLeft() {
    const newBoard = new Array(CELLS).fill(0);
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        newBoard[(SIZE - 1 - c) * SIZE + r] = board[r * SIZE + c];
      }
    }
    board = newBoard;
  }

  function rotate180() {
    board.reverse();
  }

  function handleMove(direction) {
    let moved = false;
    if (direction === 'left') moved = moveLeft();
    if (direction === 'right') moved = moveRight();
    if (direction === 'up') moved = moveUp();
    if (direction === 'down') moved = moveDown();
    if (moved) {
      addRandomTile();
      drawGrid();
      if (isGameOver()) showGameOver();
    }
  }

  document.getElementById('start-2048').addEventListener('click', function () {
    resetBoard();
  });

  document.getElementById('restart-2048').addEventListener('click', function () {
    resetBoard();
  });

  const ovBtn = document.getElementById('overlay-2048-restart');
  if (ovBtn) {
    ovBtn.addEventListener('click', function () {
      resetBoard();
    });
  }

  window.addEventListener('keydown', function (e) {
    const keys = {
      ArrowLeft: 'left',
      ArrowRight: 'right',
      ArrowUp: 'up',
      ArrowDown: 'down'
    };
    if (e.key in keys) {
      e.preventDefault();
      handleMove(keys[e.key]);
    }
  });

  // initialize on load
  // ensure overlay is hidden on initial load
  hideGameOver();
  drawGrid();
});
