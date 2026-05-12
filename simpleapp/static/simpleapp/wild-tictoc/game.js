document.addEventListener('DOMContentLoaded', function () {
  const gridEl = document.getElementById('tic-grid');
  const SIZE = 3;
  const CELLS = SIZE * SIZE;
  let board = new Array(CELLS).fill('');
  let running = false;
  let turn = 1; // player 1 or 2
  let pendingIndex = null;
  let aiThinking = false;

  function drawGrid() {
    gridEl.innerHTML = '';
    gridEl.className = 'grid wild-tictoc';
    for (let i = 0; i < CELLS; i++) {
      const cell = document.createElement('div');
      cell.className = 'cell' + (board[i] === '' ? ' empty' : ' ' + board[i].toLowerCase());
      cell.dataset.index = i;
      cell.textContent = board[i];
      cell.addEventListener('click', onCellClick);
      gridEl.appendChild(cell);
    }
    const status = document.getElementById('tic-status');
    if (status) {
      status.textContent = running ? `Player ${turn}'s turn` : 'Click Start to begin';
    }
  }

  function onCellClick(e) {
    if (!running) return;
    const i = Number(e.currentTarget.dataset.index);
    if (board[i] !== '') return;
    pendingIndex = i;
    showChooseOverlay();
  }

  function startGame() {
    board = new Array(CELLS).fill('');
    turn = 1;
    pendingIndex = null;
    running = true;
    hideGameOver();
    hideChooseOverlay();
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
    hideChooseOverlay();
    if (winnerSpan) winnerSpan.textContent = text;
    if (ov) ov.classList.remove('hidden');
  }

  function hideGameOver() {
    const ov = document.getElementById('overlay-tic');
    if (ov) ov.classList.add('hidden');
  }
  // Choice overlay handling for symbol selection by the clicking player
  function showChooseOverlay() {
    const ov = document.getElementById('choose-overlay');
    if (ov) ov.classList.remove('hidden');
  }

  function hideChooseOverlay() {
    const ov = document.getElementById('choose-overlay');
    if (ov) ov.classList.add('hidden');
  }

  function placeSymbol(sym) {
    if (pendingIndex == null) return;
    board[pendingIndex] = sym;
    pendingIndex = null;
    drawGrid();
    hideChooseOverlay();
    const winner = checkWin();
    if (winner) {
      if (winner === 'draw') showGameOver('Draw');
      else showGameOver(winner + ' wins');
      running = false;
      return;
    }
    turn = turn === 1 ? 2 : 1;
    // after player places, let AI play the opposite symbol
    if (running) {
      const aiSym = sym === 'X' ? 'O' : 'X';
      aiThinking = true;
      drawGrid();
      setTimeout(() => {
        aiMove(aiSym);
      }, 250);
    }
  }

  document.getElementById('start-tic').addEventListener('click', startGame);
  document.getElementById('restart-tic').addEventListener('click', startGame);
  const ovBtn = document.getElementById('overlay-tic-restart');
  if (ovBtn) ovBtn.addEventListener('click', startGame);

  // choose overlay buttons
  const chooseX = document.getElementById('choose-x');
  const chooseO = document.getElementById('choose-o');
  const chooseCancel = document.getElementById('choose-cancel');
  if (chooseX) chooseX.addEventListener('click', () => placeSymbol('X'));
  if (chooseO) chooseO.addEventListener('click', () => placeSymbol('O'));
  if (chooseCancel) chooseCancel.addEventListener('click', () => { pendingIndex = null; hideChooseOverlay(); });

  // AI: minimax for unbeatable play
  function aiMove(aiSymbol) {
    const best = minimax(board.slice(), aiSymbol);
    if (best && typeof best.index === 'number') {
      board[best.index] = aiSymbol;
      aiThinking = false;
      drawGrid();
      const winner = checkWin();
      if (winner) {
        if (winner === 'draw') showGameOver('Draw');
        else if (winner === aiSymbol) showGameOver('Computer wins');
        else showGameOver(winner + ' wins');
        running = false;
        return;
      }
      turn = 1; // back to player
    }
  }

  function minimax(bd, player) {
    const checkWinner = (function (b) {
      const lines = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
      ];
      for (const [a,b1,c] of lines) {
        if (b[a] && b[a] === b[b1] && b[a] === b[c]) return b[a];
      }
      if (b.every(v=>v!=='')) return 'draw';
      return null;
    })(bd);

    if (checkWinner === 'draw') return { score: 0 };
    if (checkWinner === 'X') return { score: -10 };
    if (checkWinner === 'O') return { score: 10 };

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

  // init
  hideGameOver();
  hideChooseOverlay();
  drawGrid();
});
