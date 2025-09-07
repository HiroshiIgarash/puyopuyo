class GameImage {
  static puyoImageList = null;
  static digitImageList = null;
  static batankyuImage = null;
  static GameOverFrame = 0;

  static initialize() {
    GameImage.puyoImageList = [];
    for (let i = 0; i < Config.puyoColorMax; i++) {
      const img = document.getElementById(`puyo_${i + 1}`);
      img.removeAttribute("id");
      img.width = Config.puyoImageWidth;
      img.height = Config.puyoImageHeight;
      img.style.position = "absolute";
      GameImage.puyoImageList[i] = img;
    }

    GameImage.digitImageList = [];
    for (let i = 0; i < 10; i++) {
      const img = document.getElementById(`font_${i}`);
      const width = (img.width / img.height) * Config.scoreHeight;
      img.width = width;
      img.height = Config.scoreHeight;
      GameImage.digitImageList[i] = img;
    }

    GameImage.batankyuImage = document.getElementById("batankyu");
    GameImage.batankyuImage.width = Config.puyoImageWidth * Config.stageCols;
    GameImage.batankyuImage.style.position = "absolute";
  }

  /**
   * ぷよ画像を複製して返す
   * @returns {HTMLImageElement} 複製されたぷよ画像
   */
  static getPuyoImage(color) {
    const image = GameImage.puyoImageList[color - 1].cloneNode(true);
    return image;
  }

  static getDigitImage(digit) {
    const image = GameImage.digitImageList[digit].cloneNode(true);
    return image;
  }

  static getDigitImageWidth() {
    return GameImage.digitImageList[0].width;
  }

  static prepareBatankyuAnimation(frame) {
    GameImage.GameOverFrame = frame;
    Stage.stageElement.appendChild(GameImage.batankyuImage);
    GameImage.updateBatankyu(frame);
  }

  static updateBatankyu(frame) {
    const ratio =
      (frame - GameImage.GameOverFrame) / Config.batankyuAnimationFrames;
    const height = Config.puyoImageHeight * Config.stageRows;
    const x = Math.sin(ratio * Math.PI * 2 * 5) * Config.puyoImageWidth;
    const y = (-Math.cos(ratio * Math.PI * 2) * height) / 4 + height / 2;
    GameImage.batankyuImage.style.left = `${x}px`;
    GameImage.batankyuImage.style.top = `${y}px`;
  }
}
