import * as PIXI from "pixi.js";
export declare class Vertex extends PIXI.Graphics {
  private readonly ID;
  private readonly radius;
  private readonly neighbours;
  private highlightedNeighbours;
  constructor(id: number, radius: number);
  getID(): number;
  getX(): number;
  getY(): number;
  setPosition(x: number, y: number): void;
  draw(isMarked: boolean): void;
  getNeighbourCounter(): number;
  getNeighbour(index: number): number;
  addNeighbour(neighbourID: number): void;
  getHighlightedNeighbourCounter(): number;
  getHighlightedNeighbour(index: number): number;
  addHighlightedNeighbours: (neighbourID: number) => void;
  clearHighlightList(): void;
  randomMove(): void;
}
