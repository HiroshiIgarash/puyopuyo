class Player {
  static centerPuyoColor = 0;
  static rotatingPuyoColor = 0;
  static playerPuyoStatus = null;
  static centerPuyoElement = null;
  static rotatingPuyoElement = null;
  static keyStatus = null;
  static actionStartFrame = 0;
  static moveSource = 0;
  static moveDestination = 0;
  static rotateBeforeLeft = 0;
  static rotateAfterTop = 0;
  static rotateFromRotation = 0;

  static initialize() {
    Player.keyStatus = {
      left: false,
      right: false,
      down: false,
      up: false,
    };
    window.addEventListener("keydown", (event) => {
      switch (event.key) {
        case "ArrowLeft":
          Player.keyStatus.left = true;
          event.preventDefault();
          break;
        case "ArrowRight":
          Player.keyStatus.right = true;
          event.preventDefault();
          break;
        case "ArrowDown":
          Player.keyStatus.down = true;
          event.preventDefault();
          break;
        case "ArrowUp":
          Player.keyStatus.up = true;
          event.preventDefault();
          break;
      }
    });
    window.addEventListener("keyup", (event) => {
      switch (event.key) {
        case "ArrowLeft":
          Player.keyStatus.left = false;
          event.preventDefault();
          break;
        case "ArrowRight":
          Player.keyStatus.right = false;
          event.preventDefault();
          break;
        case "ArrowDown":
          Player.keyStatus.down = false;
          event.preventDefault();
          break;
        case "ArrowUp":
          Player.keyStatus.up = false;
          event.preventDefault();
          break;
      }
    });

    let pageX = 0,
      pageY = 0;
    document.addEventListener("touchstart", (event) => {
      const touch = event.touches[0];
      pageX = touch.pageX;
      pageY = touch.pageY;
    });
    document.addEventListener("touchmove", (event) => {
      let { left, right, up, down } = Player.keyStatus;
      if (left || right || up || down) {
        return;
      }

      const touch = event.touches[0];
      const dx = touch.pageX - pageX;
      const dy = touch.pageY - pageY;
      if (dx ** 2 + dy ** 2 < 5 ** 2) {
        return;
      }
      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0) {
          right = true;
        } else {
          left = true;
        }
      } else {
        if (dy > 0) {
          down = true;
        } else {
          up = true;
        }
      }
      Player.keyStatus = { left, right, up, down };
    });

    document.addEventListener("touchend", (event) => {
      Player.keyStatus = { left: false, right: false, up: false, down: false };
    });
  }

  /** プレイヤーが操作するぷよを作る */
  static createPlayerPuyo() {
    if (Stage.getPuyoInfo(2, 0)) return false;

    const nextPuyoColors = Stage.getNextPuyoColors();
    Player.centerPuyoColor = nextPuyoColors[0];
    Player.rotatingPuyoColor = nextPuyoColors[1];

    Player.centerPuyoElement = GameImage.getPuyoImage(Player.centerPuyoColor);
    Player.rotatingPuyoElement = GameImage.getPuyoImage(
      Player.rotatingPuyoColor
    );

    Stage.stageElement.appendChild(Player.centerPuyoElement);
    Stage.stageElement.appendChild(Player.rotatingPuyoElement);

    Player.playerPuyoStatus = {
      x: 2,
      y: -1,
      left: 2 * Config.puyoImageWidth,
      top: -1 * Config.puyoImageHeight,
      dx: 0,
      dy: -1,
      rotation: 90,
    };
    Player.groundFrame = 0;
    Player.setPlayerPuyoPosition();
    return true;
  }

  /** playerPuyoStatusに従って、画面上のぷよの位置を更新する */
  static setPlayerPuyoPosition() {
    Player.centerPuyoElement.style.left = `${Player.playerPuyoStatus.left}px`;
    Player.centerPuyoElement.style.top = `${Player.playerPuyoStatus.top}px`;

    const x =
      Player.playerPuyoStatus.left +
      Math.cos((Player.playerPuyoStatus.rotation * Math.PI) / 180) *
        Config.puyoImageWidth;
    const y =
      Player.playerPuyoStatus.top -
      Math.sin((Player.playerPuyoStatus.rotation * Math.PI) / 180) *
        Config.puyoImageHeight;
    Player.rotatingPuyoElement.style.left = `${x}px`;
    Player.rotatingPuyoElement.style.top = `${y}px`;
  }

  /** プレイヤーの操作ぷよを落下させる */
  static dropPlayerPuyo(isPressingDown) {
    let { x, y, dx, dy } = Player.playerPuyoStatus;

    if (
      !Stage.getPuyoInfo(x, y + 1) &&
      !Stage.getPuyoInfo(x + dx, y + dy + 1)
    ) {
      Player.playerPuyoStatus.top += Config.playerFallingSpeed;
      if (isPressingDown) {
        Player.playerPuyoStatus.top += Config.playerDownSpeed;
      }
      if (
        Math.floor(Player.playerPuyoStatus.top / Config.puyoImageHeight) !== y
      ) {
        y += 1;
        Player.playerPuyoStatus.y = y;
        if (Player.keyStatus.down) {
          Score.addScore(1);
        }
        if (
          !Stage.getPuyoInfo(x, y + 1) &&
          !Stage.getPuyoInfo(x + dx, y + dy + 1)
        ) {
          Player.groundFrame = 0;
          return false;
        } else {
          Player.playerPuyoStatus.top = y * Config.puyoImageHeight;
          Player.groundFrame = 1;
          return false;
        }
      } else {
        Player.groundFrame = 0;
        return false;
      }
    } else {
      if (Player.groundFrame === 0) {
        Player.groundFrame = 1;
        return false;
      } else {
        Player.groundFrame++;
        if (Player.groundFrame > Config.playerLockDelayFrames) {
          return true;
        } else {
          return false;
        }
      }
    }
  }

  /** イベントループで現在の状況を更新する */
  static update(frame) {
    if (Player.dropPlayerPuyo(Player.keyStatus.down)) {
      return "fix";
    }
    Player.setPlayerPuyoPosition();

    if (Player.keyStatus.left || Player.keyStatus.right) {
      const mx = Player.keyStatus.right ? 1 : -1;
      const cx = Player.playerPuyoStatus.x;
      const cy = Player.playerPuyoStatus.y;
      const rx = cx + Player.playerPuyoStatus.dx;
      const ry = cy + Player.playerPuyoStatus.dy;

      let canMove = true;

      if (Stage.getPuyoInfo(cx + mx, cy)) {
        canMove = false;
      }
      if (Stage.getPuyoInfo(rx + mx, ry)) {
        canMove = false;
      }

      if (Player.groundFrame === 0) {
        if (Stage.getPuyoInfo(cx + mx, cy + 1)) {
          canMove = false;
        }
        if (Stage.getPuyoInfo(rx + mx, ry + 1)) {
          canMove = false;
        }
      }

      if (canMove) {
        Player.actionStartFrame = frame;
        Player.moveSource = cx * Config.puyoImageWidth;
        Player.moveDestination = (cx + mx) * Config.puyoImageWidth;
        Player.playerPuyoStatus.x += mx;
        return "moving";
      }
    } else if (Player.keyStatus.up) {
      const x = Player.playerPuyoStatus.x;
      const y =
        Player.playerPuyoStatus.y +
        (Player.playerPuyoStatus.groundFrame === 0 ? 1 : 0);
      const rotation = Player.playerPuyoStatus.rotation;
      let canRotate = true;

      let cx = 0;
      let cy = 0;
      if (rotation === 0) {
        // do nothing
      } else if (rotation === 90) {
        if (Stage.getPuyoInfo(x - 1, y)) {
          cx = 1;
          if (Stage.getPuyoInfo(x + 1, y)) {
            canRotate = false;
          }
        }
      } else if (rotation === 180) {
        if (Stage.getPuyoInfo(x, y + 1)) {
          cy = -1;
        }
        if (Stage.getPuyoInfo(x - 1, y + 1)) {
          cy = -1;
        }
      } else if (rotation === 270) {
        if (Stage.getPuyoInfo(x + 1, y)) {
          cx = -1;
          if (Stage.getPuyoInfo(x - 1, y)) {
            canRotate = false;
          }
        }
      }

      if (canRotate) {
        if (cy === -1) {
          if (Stage.groundFrame > 0) {
            Player.playerPuyoStatus.y -= 1;
            Player.groundFrame = 0;
          }
          Player.playerPuyoStatus.top =
            Player.playerPuyoStatus.y * Config.puyoImageHeight;
        }

        Player.actionStartFrame = frame;
        Player.rotateBeforeLeft = x * Config.puyoImageHeight;
        Player.rotateAfterTop = (x + cx) * Config.puyoImageHeight;
        Player.rotateFromRotation = Player.playerPuyoStatus.rotation;

        Player.playerPuyoStatus.x += cx;
        const nextRotation = (Player.playerPuyoStatus.rotation + 90) % 360;
        console.log(Player.playerPuyoStatus.rotation);
        const dCombi = [
          [1, 0],
          [0, -1],
          [-1, 0],
          [0, 1],
        ][nextRotation / 90];
        Player.playerPuyoStatus.dx = dCombi[0];
        Player.playerPuyoStatus.dy = dCombi[1];
        return "rotating";
      }
    }
    return "playing";
  }

  /** ぷよを左右に移動させる */
  static movePlayerPuyo(frame) {
    Player.dropPlayerPuyo(false);

    let ratio = (frame - Player.actionStartFrame) / Config.playerMoveFrames;
    if (ratio > 1) {
      ratio = 1;
    }
    Player.playerPuyoStatus.left =
      Player.moveSource + (Player.moveDestination - Player.moveSource) * ratio;
    Player.setPlayerPuyoPosition();
    if (ratio === 1) {
      return true;
    }
    return false;
  }

  /** ぷよを回転させる */
  static rotatePlayerPuyo(frame) {
    Player.dropPlayerPuyo(false);

    let ratio = (frame - Player.actionStartFrame) / Config.playerRotateFrames;
    if (ratio > 1) {
      ratio = 1;
    }
    Player.playerPuyoStatus.left =
      Player.rotateBeforeLeft +
      (Player.rotateAfterTop - Player.rotateBeforeLeft) * ratio;
    Player.playerPuyoStatus.rotation =
      (Player.rotateFromRotation + 90 * ratio) % 360;
    Player.setPlayerPuyoPosition();
    if (ratio === 1) {
      return true;
    }
    return false;
  }

  /** 現在のプレイヤー操作ぷよをぷよぷよ盤の上に配置する */
  static fixPlayerPuyo() {
    const { x, y, dx, dy } = Player.playerPuyoStatus;
    if (Player.playerPuyoStatus.y >= 0) {
      Stage.createPuyo(x, y, Player.centerPuyoColor);
    }
    if (Player.playerPuyoStatus.y + dy >= 0) {
      Stage.createPuyo(x + dx, y + dy, Player.rotatingPuyoColor);
    }

    Player.centerPuyoElement.remove();
    Player.centerPuyoElement = null;
    Player.rotatingPuyoElement.remove();
    Player.rotatingPuyoElement = null;
  }
}
