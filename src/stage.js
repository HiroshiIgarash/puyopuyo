class Stage {
  static stageElement = null;
  /** @type {Array<Array<{ puyoColor: number, element: HTMLImageElement } | null>>} */
  static puyoBoard = null;
  static puyoCount = 0;

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
}
