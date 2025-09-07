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
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
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
  /** プレイ中の自然落下のスピード */
  static playerFallingSpeed = 0.9;
  /** 何フレーム設置したらぷよが固定されるか */
  static playerLockDelayFrames = 20;
  /** プレイ中の下キー押下時の落下スピード */
  static playerDownSpeed = 10;
  /** 左右移動に消費するフレーム数 */
  static playerMoveFrames = 19;
}
