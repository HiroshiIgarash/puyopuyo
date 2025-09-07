window.addEventListener("load", () => {
  initialize();

  // 画面の高さに合わせて拡大する
  const scale =
    window.innerHeight /
    (Score.scoreElement.offsetTop + Score.scoreElement.offsetHeight);
  document.body.style.transform = `scale(${scale})`;

  gameLoop();
});

function initialize() {
  GameImage.initialize();
  Stage.initialize();
  Player.initialize();
  Score.initialize();

  gameState = "start";
  frame = 0;
}

/**
 * ゲームの現在の状況
 * @type {"start" | "checkFallingPuyo" | "fallingPuyo" | "checkPuyoErase" | "erasingPuyo" | "createPlayerPuyo" | "gameOver" | "playing" | "fix" | "moving" | "rotating" | "batankyu"}
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
        Score.addComboScore(comboCount, eraseInfo.piece, eraseInfo.color);
        Stage.hideZenkeshi();
      } else {
        if (Stage.puyoCount === 0 && comboCount > 0) {
          Stage.showZenkeshi(frame);
          Score.addScore(Config.zenkeshiBonus);
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
    case "rotating":
      if (Player.rotatePlayerPuyo(frame)) {
        gameState = "playing";
      }
      break;
    case "gameOver":
      GameImage.prepareBatankyuAnimation(frame);
      gameState = "batankyu";
      break;
    case "batankyu":
      GameImage.updateBatankyu(frame);
      break;
  }

  frame++;
  setTimeout(gameLoop, 1000 / 60);
}
