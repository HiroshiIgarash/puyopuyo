class Score {
  static scoreElement;
  static digitCount;
  static score = 0;

  static initialize() {
    Score.scoreElement = document.getElementById("score");
    Score.scoreElement.style.width = `${
      Config.puyoImageWidth * Config.stageCols
    }px`;
    Score.scoreElement.style.height = `${Config.scoreHeight}px`;
    Score.scoreElement.style.backgroundColor = Config.scoreBackgroundColor;

    Score.digitCount = Math.trunc(
      (Config.stageCols * Config.puyoImageWidth) /
        GameImage.getDigitImageWidth()
    );
    Score.score = 0;

    Score.updateScore();
  }

  static updateScore() {
    let score = Score.score;
    const scoreElement = Score.scoreElement;
    while (scoreElement.firstChild) {
      scoreElement.firstChild.remove();
    }
    for (let i = 0; i < Score.digitCount; i++) {
      const digit = score % 10;
      scoreElement.insertBefore(
        GameImage.getDigitImage(digit),
        scoreElement.firstChild
      );
      score = Math.trunc(score / 10);
    }
  }

  static addComboScore(combo, piece, color) {
    combo = Math.min(combo, Config.comboBonusTable.length - 1);
    piece = Math.min(piece, Config.pieceBonusTable.length - 1);
    color = Math.min(color, Config.colorBonusTable.length - 1);
    let scale =
      Config.comboBonusTable[combo] +
      Config.pieceBonusTable[piece] +
      Config.colorBonusTable[color];
    if (scale === 0) {
      scale = 1;
    }
    Score.addScore(10 * piece * scale);
  }

  static addScore(score) {
    Score.score += score;
    Score.updateScore();
  }
}
