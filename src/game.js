window.addEventListener("load", () => {
  initialize();

  gameLoop();
});

function initialize() {
  GameImage.initialize();
  Stage.initialize();

  gameState = "start";
  frame = 0;
}

/**
 * ゲームの現在の状況
 * @type {"start" | "checkfFallingPuyo" | "fallingPuyo" | ""}
 */
let gameState;
/** ゲームの現在のフレーム（1/60秒ごとに1追加される） */
let frame;

function gameLoop() {
  switch (gameState) {
    case "start":
      gameState = "checkFallingPuyo";
      break;
    case "checkFallingPuyo":
      if (Stage.checkFallingPuyo()) {
        gameState = "fallingPuyo";
      } else {
        gameState = "";
      }
      break;
    case "fallingPuyo":
      if (!Stage.fallPuyo()) {
        gameState = "";
      }
      break;
  }

  frame++;
  setTimeout(gameLoop, 1000 / 60);
}
