window.addEventListener("load", () => {
  initialize();

  gameLoop();
});

function initialize() {
  GameImage.initialize();
  Stage.initialize();
  Player.initialize();

  gameState = "start";
  frame = 0;
}

/**
 * ゲームの現在の状況
 * @type {"start" | "checkFallingPuyo" | "fallingPuyo" | "checkPuyoErase" | "erasingPuyo" | "createPlayerPuyo" | "gameOver" | "playing" | "fix"}
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
        gameState = "erasingPuyo";
        Stage.hideZenkeshi();
      } else {
        if (Stage.puyoCount === 0 && comboCount > 0) {
          Stage.showZenkeshi(frame);
        }
        comboCount = 0;
        gameState = "createPlayerPuyo";
      }
      break;
    case "erasingPuyo":
      if (!Stage.erasePuyo(frame)) {
        gameState = "checkFallingPuyo";
      }
      break;
    case "createPlayerPuyo":
      if (!Player.createPlayerPuyo()) {
        gameState = "gameOver";
      } else {
        gameState = "playing";
      }
      break;
    case "playing":
      const nextAction = Player.update(frame);
      gameState = nextAction;
      break;
    case "fix":
      Player.fixPlayerPuyo();
      gameState = "checkFallingPuyo";
      break;
    case "moving":
      if (Player.movePlayerPuyo(frame)) {
        gameState = "playing";
      }
      break;
  }

  frame++;
  setTimeout(gameLoop, 1000 / 60);
}
