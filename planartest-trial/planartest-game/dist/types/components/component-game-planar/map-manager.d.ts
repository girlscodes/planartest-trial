import * as PIXI from "pixi.js";
import { PlanartestLog } from "../../models/game-models/planartest-log";
import { ComponentGamePlanar } from "./component-game-planar";
export declare class MapManager extends PIXI.Container {
  private dim;
  private specialLog;
  private game;
  private currLevel;
  private map;
  private levelAnim;
  private levelText;
  private levelStartTime;
  private endOfLevelAnim;
  maxLevel: number;
  constructor(dim: any, specialLog: PlanartestLog, game: ComponentGamePlanar);
  private startMap;
  private startLevelAnim;
  private get settings();
  readonly mapFinished: () => void;
}
export interface ISettings {
  maxDeg: number;
  vertexNumber: number;
  isHard: boolean;
}
