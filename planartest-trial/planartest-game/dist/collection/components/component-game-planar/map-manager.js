import * as PIXI from "pixi.js";
import { colors } from "./planartest-init";
import { Map } from "./map";
import { Delay, FadeTo, scheduler, Sequence } from "anim";
import { Level } from "../../models/game-models/planartest-log";
import { translate } from "../../utils/translations.util";
export class MapManager extends PIXI.Container {
  constructor(dim, specialLog, game) {
    super();
    this.dim = dim;
    this.specialLog = specialLog;
    this.game = game;
    this.currLevel = 0;
    this.maxLevel = 3;
    this.mapFinished = () => {
      console.log(this.map.numberOfClicks);
      let duration = Date.now() - this.levelStartTime;
      console.log(duration);
      this.specialLog.addNewLevel(new Level(this.map.numberOfClicks, duration));
      this.currLevel++;
      if (this.currLevel >= this.maxLevel) {
        this.game.calculateScore();
        console.log(this.specialLog);
      }
      else {
        this.startMap();
      }
    };
    this.currLevel = 0;
    const background = new PIXI.Graphics();
    background.beginFill(colors.DARK);
    background.drawRect(0, 0, this.dim.w, this.dim.h);
    background.endFill();
    this.addChild(background);
    this.endOfLevelAnim = new Delay().setDuration(800);
    this.endOfLevelAnim;
    this.levelAnim = new Sequence([
      new Delay().setDuration(500),
      new FadeTo(1).setDuration(200),
      new Delay().setDuration(700),
      new FadeTo(0).setDuration(200),
      new Delay().setDuration(300)
    ]);
    this.levelText = new PIXI.Text("", { align: 'center', fontSize: Math.min(70, 70 * this.dim.w / 600), fill: colors.TEXT });
    this.levelText.position.set(this.dim.w / 2, this.dim.h / 2);
    this.levelText.anchor.set(0.5, 0.5);
    this.levelText.alpha = 0;
    this.startMap();
  }
  async startMap() {
    if (this.map) {
      this.map.dispose();
      this.removeChild(this.map);
    }
    await this.startLevelAnim();
    this.levelStartTime = Date.now();
    this.map = new Map(this.settings, this.dim, this.mapFinished);
    this.addChild(this.map);
  }
  async startLevelAnim() {
    switch (this.currLevel) {
      case 0:
        this.levelText.text = translate("first_round", this.game.customLang);
        break;
      case 1:
        this.levelText.text = translate("second_round", this.game.customLang);
        break;
      default: this.levelText.text = translate("last_round", this.game.customLang);
    }
    this.addChild(this.levelText);
    return scheduler.run(this.levelAnim, this.levelText);
  }
  get settings() {
    const result = {
      maxDeg: 0,
      vertexNumber: 0,
      isHard: false,
    };
    switch (this.currLevel) {
      case 0:
        result.maxDeg = 5;
        result.vertexNumber = 9;
        break;
      case 1:
        result.maxDeg = 6;
        result.vertexNumber = 11;
        break;
      default:
        result.maxDeg = 7;
        result.vertexNumber = 13;
    }
    return result;
  }
}
//# sourceMappingURL=map-manager.js.map
