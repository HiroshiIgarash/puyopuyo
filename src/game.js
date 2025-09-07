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
 * @type {"start" | "checkfFallingPuyo" | "fallingPuyo" | "checkPuyoErase" | "PuyoErase" | ""}
 */
let gameState;
/** ゲームの現在のフレーム（1/60秒ごとに1追加される） */
let frame;

/** 現在何連鎖しているか */
let comboCount = 0;

function gameLoop() {
  switch (gameState) {
    case "start":
      gameState = "checkFallingPuyo";
      break;
    case "checkFallingPuyo":
      if (Stage.checkFallingPuyo()) {
        gameState = "fallingPuyo";
      } else {
        gameState = "checkPuyoErase";
      }
      break;
    case "fallingPuyo":
      if (!Stage.fallPuyo()) {
        gameState = "checkPuyoErase";
      }
      break;
    case "checkPuyoErase":
      const eraseInfo = Stage.checkPuyoErase(frame);
      if (eraseInfo) {
        comboCount++;
        gameState = "PuyoErase";
      } else {
        comboCount = 0;
        gameState = "";
      }
      break;
    case "PuyoErase":
      if (!Stage.erasePuyo(frame)) {
        gameState = "checkFallingPuyo";
      }
      break;
  }

  frame++;
  setTimeout(gameLoop, 1000 / 60);
}
