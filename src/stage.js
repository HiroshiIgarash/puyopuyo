/**
 * @typedef {Object} PuyoInfo
 * @property {number} puyoColor
 * @property {HTMLImageElement} element
 */

/**
 * @typedef {Object} FallingPuyoInfo
 * @property {HTMLImageElement} element
 * @property {number} position
 * @property {number} destination
 * @property {boolean} falling
 */
class Stage {
  static stageElement = null;
  /** @type {Array<Array<PuyoInfo|null>>} */
  static puyoBoard = null;
  static puyoCount = 0;
  /** @type {Array<FallingPuyoInfo>} */
  static fallingPuyoInfoList = [];

  static initialize() {
    Stage.stageElement = document.getElementById("stage");
    Stage.stageElement.style.width = `${
      Config.stageCols * Config.puyoImageWidth
    }px`;
    Stage.stageElement.style.height = `${
      Config.stageRows * Config.puyoImageHeight
    }px`;
    Stage.stageElement.style.backgroundColor = Config.stageBackgroundColor;

    // ぷよぷよ盤を初期化
    Stage.puyoCount = 0;
    Stage.puyoBoard = [];
    for (let y = 0; y < Config.stageRows; y++) {
      Stage.puyoBoard[y] = [];
      for (let x = 0; x < Config.stageCols; x++) {
        Stage.puyoBoard[y][x] = null;
      }
    }

    // もし初期状態ステージの情報があれば、その情報を元にぷよを配置する
    for (let y = 0; y < Config.stageRows; y++) {
      for (let x = 0; x < Config.stageCols; x++) {
        let color = 0;

        if (Config.initialBoard && Config.initialBoard[y][x]) {
          color = Config.initialBoard[y][x];
        }
        if (color >= 1 && color <= Config.puyoColorMax) {
          Stage.createPuyo(x, y, color);
        }
      }
    }
  }

  /** ぷよを新しく作って、画面上とぷよぷよ盤の両方にセットする */
  static createPuyo(x, y, color) {
    const puyoImage = GameImage.getPuyoImage(color);
    puyoImage.style.left = `${x * Config.puyoImageWidth}px`;
    puyoImage.style.top = `${y * Config.puyoImageHeight}px`;
    Stage.stageElement.appendChild(puyoImage);

    Stage.puyoBoard[y][x] = {
      puyoColor: color,
      element: puyoImage,
    };

    Stage.puyoCount++;
  }

  /** ぷよぷよ盤にぷよ情報をセットする */
  static setPuyoInfo(x, y, info) {
    Stage.puyoBoard[y][x] = info;
  }

  /** ぷよぷよ盤の情報を返す */
  static getPuyoInfo(x, y) {
    // 左右、もしくはそこの場合はダミーのぷよ情報を返す
    if (x < 0 || x >= Config.stageCols || y >= Config.stageRows) {
      return { puyoColor: -1 };
    }
    // y座標がマイナスの場合は、そこは空白扱いにする
    if (y < 0) return null;

    // それ以外の場合は、ぷよぷよ盤の情報をそのまま返す
    return Stage.puyoBoard[y][x];
  }

  /** ぷよぷよ盤からぷよ情報を消す */
  static removePuyo(x, y) {
    Stage.puyoBoard[y][x] = null;
  }

  /** 自由落下するぷよがあるかどうかをチェックする */
  static checkFallingPuyo() {
    Stage.fallingPuyoInfoList = [];

    for (let y = Config.stageRows - 2; y >= 0; y--) {
      for (let x = 0; x < Config.stageCols; x++) {
        const currentPuyoInfo = Stage.getPuyoInfo(x, y);

        if (!currentPuyoInfo) continue;

        const belowPuyoInfo = Stage.getPuyoInfo(x, y + 1);

        if (!belowPuyoInfo) {
          Stage.removePuyo(x, y);
          let destination = y;
          while (!Stage.getPuyoInfo(x, destination + 1)) {
            destination++;
          }
          Stage.setPuyoInfo(x, destination, currentPuyoInfo);
          Stage.fallingPuyoInfoList.push({
            element: currentPuyoInfo.element,
            position: y * Config.puyoImageHeight,
            destination: destination * Config.puyoImageHeight,
            falling: true,
          });
        }
      }
    }
    return Stage.fallingPuyoInfoList.length > 0;
  }

  /** 自由落下させる */
  static fallPuyo() {
    let isFalling = false;
    for (const fallingPuyoInfo of Stage.fallingPuyoInfoList) {
      if (!fallingPuyoInfo.falling) {
        continue;
      }

      let position = fallingPuyoInfo.position;
      position += Config.fallingSpeed;

      if (position >= fallingPuyoInfo.destination) {
        position = fallingPuyoInfo.destination;
        fallingPuyoInfo.falling = false;
      } else {
        isFalling = true;
      }

      fallingPuyoInfo.position = position;
      fallingPuyoInfo.element.style.top = `${position}px`;
    }
    return isFalling;
  }
}
