class Config {
  /** ぷよの画像の幅 */
  static puyoImageWidth = 40;
  /** ぷよの画像の高さ */
  static puyoImageHeight = 40;

  /** ステージの横の個数 */
  static stageCols = 6;
  /** ステージの縦の個数 */
  static stageRows = 12;
  /** ステージの背景色 */
  static stageBackgroundColor = "#11213b";

  // 初期状態のステージ
  static initialBoard = [
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 4, 5],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 1, 2, 3, 0, 0],
    [1, 2, 3, 4, 5, 0],
    [1, 2, 3, 4, 5, 0],
    [1, 2, 3, 4, 5, 0],
  ];

  /** 何色分のぷよ画像を使うか */
  static puyoColorMax = 5;
  /** 自由落下のスピード */
  static fallingSpeed = 6;
  /** 何個以上揃ったら消えるか */
  static erasePuyoCount = 4;
  /** 何フレームでぷよを消すか */
  static eraseAnimationFrames = 30;
  /** 全消し時のアニメーションミリセカンド */
  static zenkeshiDuration = 150;
}
