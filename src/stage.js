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
  static erasingStartFrame = 0;
  static erasingInfoList = [];
  static zenkeshiImage = null;
  static nextElement = null;
  static nextPuyoColors = [];
  static nextPuyoElements = [];

  static initialize() {
    Stage.stageElement = document.getElementById("stage");
    Stage.stageElement.style.width = `${
      Config.stageCols * Config.puyoImageWidth
    }px`;
    Stage.stageElement.style.height = `${
      Config.stageRows * Config.puyoImageHeight
    }px`;
    Stage.stageElement.style.backgroundColor = Config.stageBackgroundColor;

    const nextContainerElement = document.getElementById("next");
    nextContainerElement.style.width = `${
      Config.stageCols * Config.puyoImageWidth
    }px`;
    nextContainerElement.style.height = `${2.2 * Config.puyoImageHeight}px`;
    nextContainerElement.style.backgroundColor = Config.nextBackgroundColor;

    const borderWidth = 2;
    Stage.nextElement = document.createElement("div");
    Stage.nextElement.style.position = "absolute";
    Stage.nextElement.style.left = `${
      (Config.puyoImageWidth * (Config.stageCols - 1)) / 2 - borderWidth
    }px`;
    Stage.nextElement.style.top = `${
      Config.puyoImageHeight * 0.1 - borderWidth
    }px`;
    Stage.nextElement.style.width = `${Config.puyoImageWidth * 1}px`;
    Stage.nextElement.style.height = `${Config.puyoImageHeight * 2}px`;
    Stage.nextElement.style.border = `${borderWidth}px solid #ff8`;
    Stage.nextElement.style.borderRadius = `${Config.puyoImageWidth * 0.2}px`;
    Stage.nextElement.style.backgroundColor = "rgba(0,0,0,0.5)";
    nextContainerElement.appendChild(Stage.nextElement);

    // 全消しの画像を用意
    Stage.zenkeshiImage = document.getElementById("zenkeshi");
    Stage.zenkeshiImage.width = Config.stageCols * Config.puyoImageWidth;
    Stage.zenkeshiImage.style.opacity = 0;
    Stage.zenkeshiImage.style.position = "absolute";
    Stage.stageElement.appendChild(Stage.zenkeshiImage);

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

    Stage.nextPuyoColors = [];
    Stage.nextPuyoElements = [];
    Stage.getNextPuyoColors();
  }

  /** 現在のネクストぷよを返し、新しいネクストぷよを作成ならびに画面上に表示する */
  static getNextPuyoColors() {
    const ret = Stage.nextPuyoColors;

    const nextCenterPuyoColor =
      Math.trunc(Math.random() * Config.puyoColorMax) + 1;
    const nextRotatingPuyoColor =
      Math.trunc(Math.random() * Config.puyoColorMax) + 1;
    Stage.nextPuyoColors = [nextCenterPuyoColor, nextRotatingPuyoColor];
    if (ret.length) {
      for (const element of Stage.nextPuyoElements) {
        element.remove();
      }
      const nextCenterPuyoElement = GameImage.getPuyoImage(nextCenterPuyoColor);
      const nextRotatingPuyoElement = GameImage.getPuyoImage(
        nextRotatingPuyoColor
      );
      nextCenterPuyoElement.style.top = `${Config.puyoImageHeight}px`;
      console.log(nextCenterPuyoElement);
      console.log(nextRotatingPuyoElement);
      Stage.nextElement.append(nextRotatingPuyoElement, nextCenterPuyoElement);

      console.log(Stage.nextElement.children);
      Stage.nextPuyoElements = [nextCenterPuyoElement, nextRotatingPuyoElement];
    }

    return ret;
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
    // 左右、もしくは底の場合はダミーのぷよ情報を返す
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

  /** 消せるかどうか判定する */
  static checkPuyoErase(startFrame) {
    Stage.erasingStartFrame = startFrame;
    Stage.erasingInfoList = [];

    const erasedPuyoColorBin = {};

    const checkConnectedPuyo = (x, y, connectedInfoList = []) => {
      const originalPuyoInfo = Stage.getPuyoInfo(x, y);
      if (!originalPuyoInfo) return connectedInfoList;
      connectedInfoList.push({ x, y, puyoInfo: originalPuyoInfo });
      Stage.removePuyo(x, y);

      const directions = [
        [0, 1],
        [1, 0],
        [0, -1],
        [-1, 0],
      ];

      for (const direction of directions) {
        const dx = x + direction[0];
        const dy = y + direction[1];
        const puyoInfo = Stage.getPuyoInfo(dx, dy);
        if (!puyoInfo || puyoInfo.puyoColor !== originalPuyoInfo.puyoColor) {
          continue;
        }
        checkConnectedPuyo(dx, dy, connectedInfoList);
      }
      return connectedInfoList;
    };

    const remainingPuyoList = [];
    for (let y = 0; y < Config.stageRows; y++) {
      for (let x = 0; x < Config.stageCols; x++) {
        const puyoInfo = Stage.getPuyoInfo(x, y);
        const connectedInfoList = checkConnectedPuyo(x, y);
        if (connectedInfoList.length < Config.erasePuyoCount) {
          if (connectedInfoList.length) {
            remainingPuyoList.push(...connectedInfoList);
          }
        } else {
          if (connectedInfoList) {
            Stage.erasingInfoList.push(...connectedInfoList);
            erasedPuyoColorBin[puyoInfo.puyoColor] = true;
          }
        }
      }
    }

    Stage.puyoCount -= Stage.erasingInfoList.length;

    for (const info of remainingPuyoList) {
      Stage.setPuyoInfo(info.x, info.y, info.puyoInfo);
    }

    if (Stage.erasingInfoList.length) {
      return {
        piece: Stage.erasingInfoList.length,
        color: Object.keys(erasedPuyoColorBin).length,
      };
    }
    return null;
  }

  static erasePuyo(frame) {
    const elapsedFrames = frame - Stage.erasingStartFrame;
    const ratio = elapsedFrames / Config.eraseAnimationFrames;

    let element;
    if (ratio >= 1) {
      for (const info of Stage.erasingInfoList) {
        element = info.puyoInfo.element;
        Stage.stageElement.removeChild(element);
      }
      return false;
    } else if (ratio >= 0.75) {
      for (const info of Stage.erasingInfoList) {
        element = info.puyoInfo.element;
        element.style.display = "block";
      }
      return true;
    } else if (ratio >= 0.5) {
      for (const info of Stage.erasingInfoList) {
        element = info.puyoInfo.element;
        element.style.display = "none";
      }
      return true;
    } else if (ratio >= 0.25) {
      for (const info of Stage.erasingInfoList) {
        element = info.puyoInfo.element;
        element.style.display = "block";
      }
      return true;
    } else {
      for (const info of Stage.erasingInfoList) {
        element = info.puyoInfo.element;
        element.style.display = "none";
      }
      return true;
    }
  }

  /** 全消しの表示を開始する */
  static showZenkeshi() {
    Stage.zenkeshiImage.style.transition = "none";
    Stage.zenkeshiImage.style.opacity = 1;
    Stage.zenkeshiImage.style.top = `${
      Config.puyoImageHeight * Config.stageRows
    }px`;
    Stage.zenkeshiImage.offsetHeight;

    Stage.zenkeshiImage.style.transition = `top ${Config.zenkeshiDuration}ms linear`;
    Stage.zenkeshiImage.style.top = `${
      (Config.puyoImageHeight * Config.stageRows) / 3
    }px`;
  }

  /** 全消しの画像を画面上から消す */
  static hideZenkeshi() {
    Stage.zenkeshiImage.style.transition = `opacity ${Config.zenkeshiDuration}ms linear`;
    Stage.zenkeshiImage.style.opacity = 0;
  }
}
