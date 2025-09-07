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
    });
  }

  /** プレイヤーが操作するぷよを作る */
  static createPlayerPuyo() {
    if (Stage.getPuyoInfo(2, 0)) return false;

    Player.centerPuyoColor =
      Math.trunc(Math.random() * Config.puyoColorMax) + 1;
    Player.rotatingPuyoColor =
      Math.trunc(Math.random() * Config.puyoColorMax) + 1;

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
