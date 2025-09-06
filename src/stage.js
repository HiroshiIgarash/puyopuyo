class Stage {
  static stageElement = null;

  static initialize() {
    Stage.stageElement = document.getElementById("stage");
    Stage.stageElement.style.width = `${
      Config.stageCols * Config.puyoImageWidth
    }px`;
    Stage.stageElement.style.height = `${
      Config.stageRows * Config.puyoImageHeight
    }px`;
    Stage.stageElement.style.backgroundColor = Config.stageBackgroundColor;
  }
}
