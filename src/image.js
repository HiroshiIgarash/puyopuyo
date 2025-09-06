class GameImage {
  static puyoImageList = null;

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
  }

  /**
   * ぷよ画像を複製して返す
   * @returns {HTMLImageElement} 複製されたぷよ画像
   */
  static getPuyoImage(color) {
    const image = GameImage.puyoImageList[color - 1].cloneNode(true);
    return image;
  }
}
