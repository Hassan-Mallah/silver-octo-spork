document.addEventListener('DOMContentLoaded', function () {
  const gridEl = document.getElementById('tic-grid');
  const SIZE = 3;
  const CELLS = SIZE * SIZE;
  let board = new Array(CELLS).fill('');
  let current = 'X';
  let running = false;

  function drawGrid() {
    gridEl.innerHTML = '';
    gridEl.className = 'grid tictoc';
    for (let i = 0; i < CELLS; i++) {
      const cell = document.createElement('div');
      cell.className = 'cell' + (board[i] === '' ? ' empty' : ' ' + board[i].toLowerCase());
      cell.dataset.index = i;
      cell.textContent = board[i];
      cell.addEventListener('click', onCellClick);
      gridEl.appendChild(cell);
    }
  }

  function onCellClick(e) {
    if (!running) return;
    const i = Number(e.currentTarget.dataset.index);
    if (board[i] !== '') return;
    board[i] = current;
    drawGrid();
    const winner = checkWin();
    if (winner) {
      if (winner === 'draw') showGameOver('Draw');
      else if (winner === 'O') showGameOver('Computer wins');
      else showGameOver(winner + ' wins');
      running = false;
      return;
    }
    current = current === 'X' ? 'O' : 'X';

    // if it's computer's turn, make AI move
    if (running && current === 'O') {
      // small delay to simulate thinking
      running = false;
      setTimeout(() => {
        aiMove();
        running = true;
      }, 250);
    }
  }

  function startGame() {
    board = new Array(CELLS).fill('');
    current = 'X';
    running = true;
    hideGameOver();
    drawGrid();
  }

  function checkWin() {
    const lines = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];
    for (const [a,b,c] of lines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
    }
    if (board.every(v=>v!=='') ) return 'draw';
    return null;
  }

  function showGameOver(text) {
    const ov = document.getElementById('overlay-tic');
    const winnerSpan = document.getElementById('tic-winner');
    if (winnerSpan) winnerSpan.textContent = text;
    if (ov) ov.classList.remove('hidden');
  }

  function hideGameOver() {
    const ov = document.getElementById('overlay-tic');
    if (ov) ov.classList.add('hidden');
  }

  // AI: minimax for unbeatable play (O is computer)
  function aiMove() {
    const best = minimax(board.slice(), 'O');
    if (best && typeof best.index === 'number') {
      board[best.index] = 'O';
      drawGrid();
      const winner = checkWin();
      if (winner) {
        if (winner === 'draw') showGameOver('Draw');
        else if (winner === 'O') showGameOver('Computer wins');
        else showGameOver(winner + ' wins');
        running = false;
        return;
      }
      current = 'X';
    }
  }

  function minimax(bd, player) {
    const winner = (function check(b) {
      const lines = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
      ];
      for (const [a,b1,c] of lines) {
        if (b[a] && b[a] === b[b1] && b[a] === b[c]) return b[a];
      }
      if (bd.every(v=>v!=='')) return 'draw';
      return null;
    })(bd);

    if (winner === 'O') return { score: 10 };
    if (winner === 'X') return { score: -10 };
    if (winner === 'draw') return { score: 0 };

    const avail = [];
    for (let i = 0; i < bd.length; i++) if (bd[i] === '') avail.push(i);

    const moves = [];
    for (const idx of avail) {
      const move = {};
      move.index = idx;
      bd[idx] = player;
      const result = minimax(bd, player === 'O' ? 'X' : 'O');
      move.score = result.score;
      bd[idx] = '';
      moves.push(move);
    }

    let bestMove;
    if (player === 'O') {
      let bestScore = -Infinity;
      for (const m of moves) if (m.score > bestScore) { bestScore = m.score; bestMove = m; }
    } else {
      let bestScore = Infinity;
      for (const m of moves) if (m.score < bestScore) { bestScore = m.score; bestMove = m; }
    }
    return bestMove;
  }

  document.getElementById('start-tic').addEventListener('click', startGame);
  document.getElementById('restart-tic').addEventListener('click', startGame);
  const ovBtn = document.getElementById('overlay-tic-restart');
  if (ovBtn) ovBtn.addEventListener('click', startGame);

  // init
  hideGameOver();
  drawGrid();
});
