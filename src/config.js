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
    [0, 1, 4, 3, 5, 2],
    [0, 2, 1, 0, 3, 5],
    [1, 3, 0, 2, 4, 1],
    [2, 4, 5, 1, 0, 3],
    [3, 5, 2, 4, 1, 0],
    [4, 1, 3, 5, 2, 4],
    [5, 0, 4, 3, 5, 2],
    [0, 2, 1, 0, 3, 5],
    [1, 3, 0, 2, 4, 1],
    [2, 4, 5, 1, 0, 3],
    [3, 5, 2, 4, 1, 0],
    [4, 1, 3, 5, 2, 4],
  ];

  /** 何色分のぷよ画像を使うか */
  static puyoColorMax = 5;
}
