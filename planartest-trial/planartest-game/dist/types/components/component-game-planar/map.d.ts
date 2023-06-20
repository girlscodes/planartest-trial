import * as PIXI from "pixi.js";
import { Vertex } from "./vertex";
import { ISettings } from "./map-manager";
export declare class Map extends PIXI.Container {
  private dim;
  private readonly finishCallback;
  vertexNumber: number;
  maxDeg: number;
  isHardMode: boolean;
  isHighlighted: boolean;
  penalty: number;
  circleRadius: number;
  circleArray: Vertex[];
  linksLayer: PIXI.Graphics;
  dragging: boolean;
  touchedID: number;
  numberOfClicks: number;
  constructor(settings: ISettings, dim: any, finishCallback: () => void);
  dispose(): void;
  private readonly onKeyDown;
  private readonly onKeyUp;
  start(): void;
  drawAndRegister(): void;
  dragEnd(event: PIXI.InteractionEvent): void;
  updateLinks(isHighlighted: boolean): void;
  highlighter(): void;
  checkIfEnd(): void;
}
