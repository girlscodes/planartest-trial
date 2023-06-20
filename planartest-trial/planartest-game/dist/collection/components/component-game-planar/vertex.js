import * as PIXI from "pixi.js";
import { colors } from "./planartest-init";
export class Vertex extends PIXI.Graphics {
  constructor(id, radius) {
    super();
    this.addHighlightedNeighbours = (neighbourID) => {
      const length = this.highlightedNeighbours.length;
      for (let i = 0; i < length; i++) {
        if (this.highlightedNeighbours[i] == neighbourID) {
          return;
        }
      }
      this.highlightedNeighbours[length] = neighbourID;
    };
    this.ID = id;
    this.radius = radius;
    this.neighbours = [];
    this.highlightedNeighbours = [];
    this.interactive = true;
    this.buttonMode = true;
  }
  getID() {
    return this.ID;
  }
  getX() {
    return this.x;
  }
  getY() {
    return this.y;
  }
  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }
  draw(isMarked) {
    this.clear();
    if (isMarked) {
      this.beginFill(colors.OFF_WHITE); // red
    }
    else {
      this.beginFill(colors.LIGHT); // blue
    }
    this.drawCircle(0, 0, this.radius);
    this.endFill();
  }
  getNeighbourCounter() {
    return this.neighbours.length;
  }
  getNeighbour(index) {
    if (this.neighbours.length > index) {
      return this.neighbours[index];
    }
    return -1;
  }
  addNeighbour(neighbourID) {
    const length = this.neighbours.length;
    for (let i = 0; i < length; i++) {
      if (this.neighbours[i] == neighbourID) {
        return;
      }
    }
    this.neighbours[length] = neighbourID;
  }
  getHighlightedNeighbourCounter() {
    return this.highlightedNeighbours.length;
  }
  getHighlightedNeighbour(index) {
    if (index >= 0 && index < this.highlightedNeighbours.length) {
      return this.highlightedNeighbours[index];
    }
    return -1;
  }
  clearHighlightList() {
    this.highlightedNeighbours = [];
  }
  randomMove() {
    var random = Math.floor(Math.random() * 5);
    switch (random) {
      case 0:
        this.x -= 2;
        break;
      case 1:
        this.x += 2;
        break;
      case 2:
        this.y -= 2;
        break;
      case 3:
        this.y += 2;
        break;
      default:
    }
  }
}
//# sourceMappingURL=vertex.js.map
