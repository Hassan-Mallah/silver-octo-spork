(function(){
const canvas = document.getElementById('snake-game');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('snake-score');
const restartBtn = document.getElementById('snake-restart');
const overlay = document.getElementById('snake-overlay');
const overlayRestart = document.getElementById('snake-overlay-restart');

const CELL = 20;
const COLS = canvas.width / CELL;
const ROWS = canvas.height / CELL;
let snake, dir, apple, running, score, loopId;

function init(){
  snake = [{x: Math.floor(COLS/2), y: Math.floor(ROWS/2)}];
  dir = {x:1,y:0};
  spawnApple();
  score = 0;
  running = true;
  scoreEl.textContent = 'Score: 0';
  overlay.classList.add('hidden');
  if(loopId) clearInterval(loopId);
  loopId = setInterval(tick, 100);
}

function spawnApple(){
  do{
    apple = {x: Math.floor(Math.random()*COLS), y: Math.floor(Math.random()*ROWS)};
  } while (snake.some(s=>s.x===apple.x && s.y===apple.y));
}

function tick(){
  const head = {x: snake[0].x + dir.x, y: snake[0].y + dir.y};
  if(head.x<0 || head.x>=COLS || head.y<0 || head.y>=ROWS) return gameOver();
  if(snake.some(s=>s.x===head.x && s.y===head.y)) return gameOver();

  snake.unshift(head);
  if(head.x === apple.x && head.y === apple.y){
    score++;
    scoreEl.textContent = 'Score: ' + score;
    spawnApple();
  } else {
    snake.pop();
  }
  draw();
}

function draw(){
  ctx.fillStyle = '#000';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = '#e33';
  ctx.fillRect(apple.x*CELL, apple.y*CELL, CELL, CELL);
  ctx.fillStyle = '#6f6';
  for(let s of snake){
    ctx.fillRect(s.x*CELL, s.y*CELL, CELL-1, CELL-1);
  }
}

function gameOver(){
  running = false;
  clearInterval(loopId);
  overlay.classList.remove('hidden');
}

document.addEventListener('keydown', e=>{
  const k = e.key;
  if(k==='ArrowUp' && dir.y!==1) dir={x:0,y:-1};
  if(k==='ArrowDown' && dir.y!==-1) dir={x:0,y:1};
  if(k==='ArrowLeft' && dir.x!==1) dir={x:-1,y:0};
  if(k==='ArrowRight' && dir.x!==-1) dir={x:1,y:0};
});

restartBtn.addEventListener('click', init);
overlayRestart.addEventListener('click', init);

init();
})();
