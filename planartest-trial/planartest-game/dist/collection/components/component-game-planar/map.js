import * as PIXI from "pixi.js";
import { colors } from "./planartest-init";
import { Vertex } from "./vertex";
export class Map extends PIXI.Container {
  constructor(settings, dim, finishCallback) {
    super();
    this.dim = dim;
    this.finishCallback = finishCallback;
    this.onKeyDown = (event) => {
      if (event.keyCode === 32 &&
        this.isHardMode &&
        !this.isHighlighted) {
        this.isHighlighted = true;
        this.updateLinks(this.isHighlighted);
        this.penalty++;
      }
    };
    this.onKeyUp = (event) => {
      if (event.keyCode === 32 && this.isHardMode) {
        this.isHighlighted = false;
        this.updateLinks(this.isHighlighted);
      }
    };
    this.vertexNumber = settings.vertexNumber;
    this.maxDeg = settings.maxDeg;
    let scale = this.dim.w / 450;
    this.isHardMode = settings.isHard;
    // a keresztező vonalak nincsenek kiemelve nehéz módban
    this.isHighlighted = !this.isHardMode && true;
    this.penalty = 0;
    this.circleRadius = window.screen.width > 450 ? 20 : 25 * scale;
    this.circleArray = [];
    this.dragging = false;
    this.touchedID = -1;
    this.numberOfClicks = 0;
    this.linksLayer = new PIXI.Graphics();
    this.addChild(this.linksLayer);
    for (var i = 0; i < this.vertexNumber; i++) {
      this.circleArray[i] = new Vertex(i, this.circleRadius);
      this.addChild(this.circleArray[i]);
    }
    this.start();
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
  }
  dispose() {
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
  }
  start() {
    //szükséges segédváltozók beállítása
    //row length, változó, amely segít az egy dimenziós tömb kétdimenziósként kezelésében
    var rl = Math.floor(Math.sqrt(this.circleArray.length));
    //rowcounter hasonló célokra
    var rc = Math.floor(this.circleArray.length / rl) + 1;
    //élek felvétele az összefüggőség biztosítása érdekében
    for (var i = 0; i < rc - 1; i++) {
      for (var j = 0; j < rl - 1; j++) {
        if (j == 0 && i < rc - 2) {
          this.circleArray[i * rl].addNeighbour(i * rl + 1);
          this.circleArray[i * rl + 1].addNeighbour(i * rl);
          this.circleArray[i * rl].addNeighbour((i + 1) * rl);
          this.circleArray[(i + 1) * rl].addNeighbour(i * rl);
        }
        else {
          if (j == 0) {
            this.circleArray[i * rl].addNeighbour(i * rl + 1);
            this.circleArray[i * rl + 1].addNeighbour(i * rl);
          }
          else {
            this.circleArray[i * rl + j].addNeighbour(i * rl + j + 1);
            this.circleArray[i * rl + j + 1].addNeighbour(i * rl + j);
          }
        }
      }
    }
    if (this.circleArray.length % rl > 0) {
      this.circleArray[(rc - 1) * rl].addNeighbour((rc - 2) * rl);
      if (this.circleArray.length % rl > 1) {
        for (let i = 1; i < this.circleArray.length % rl; i++) {
          this.circleArray[(rc - 1) * rl + i].addNeighbour((rc - 1) * rl + i - 1);
          this.circleArray[(rc - 1) * rl + i - 1].addNeighbour((rc - 1) * rl + i);
        }
      }
    }
    //néhány plusz él felvétele minden sor utolsó pontjához, hogy minden sor utolsó pontjai össze legyenek kötve egymással
    for (let i = 2 * rl - 1; i <= this.vertexNumber - (this.vertexNumber % rl); i += rl) {
      this.circleArray[i].addNeighbour(i - rl);
      this.circleArray[i - rl].addNeighbour(i);
    }
    //néhány plusz él felvétele az utolsó ponthoz, hogy ne egy legyen a foka (csak akkor ha egy a foka)
    if (this.circleArray[this.vertexNumber - 1].getNeighbourCounter() ==
      1) {
      this.circleArray[this.vertexNumber - 1].addNeighbour(this.vertexNumber - 1 - rl);
      this.circleArray[this.vertexNumber - 1 - rl].addNeighbour(this.vertexNumber - 1);
      this.circleArray[this.vertexNumber - 1].addNeighbour(this.vertexNumber - rl);
      this.circleArray[this.vertexNumber - rl].addNeighbour(this.vertexNumber - 1);
    }
    //élek felvétele a játék bonyolítására a síkbarajzolhatóság megtartása mellett
    //sorokon ugrálás
    for (let i = rl + 1; i < (rc - 1) * rl; i += rl * 2) {
      //soron belül ugrálás
      for (let j = 0; j < rl - 1; j += 2) {
        if (j == rl - 2) {
          if (i + j + rl - 1 < this.vertexNumber - 1) {
            if (this.circleArray[i + j].getNeighbourCounter() <
              this.maxDeg &&
              this.circleArray[i + j + rl - 1].getNeighbourCounter() < this.maxDeg) {
              this.circleArray[i + j].addNeighbour(i + j + rl - 1);
              this.circleArray[i + j + rl - 1].addNeighbour(i + j);
            }
          }
          if (i + j + rl < this.vertexNumber - 1) {
            if (this.circleArray[i + j].getNeighbourCounter() <
              this.maxDeg &&
              this.circleArray[i + j + rl].getNeighbourCounter() < this.maxDeg) {
              this.circleArray[i + j].addNeighbour(i + j + rl);
              this.circleArray[i + j + rl].addNeighbour(i + j);
            }
          }
          if (this.circleArray[i + j].getNeighbourCounter() <
            this.maxDeg &&
            this.circleArray[i + j - rl - 1].getNeighbourCounter() < this.maxDeg) {
            this.circleArray[i + j].addNeighbour(i + j - rl - 1);
            this.circleArray[i + j - rl - 1].addNeighbour(i + j);
          }
          if (this.circleArray[i + j].getNeighbourCounter() <
            this.maxDeg &&
            this.circleArray[i + j - rl].getNeighbourCounter() <
              this.maxDeg) {
            this.circleArray[i + j].addNeighbour(i + j - rl);
            this.circleArray[i + j - rl].addNeighbour(i + j);
          }
        }
        else {
          if (i + j + rl - 1 < this.vertexNumber - 1) {
            if (this.circleArray[i + j].getNeighbourCounter() <
              this.maxDeg &&
              this.circleArray[i + j + rl - 1].getNeighbourCounter() < this.maxDeg) {
              this.circleArray[i + j].addNeighbour(i + j + rl - 1);
              this.circleArray[i + j + rl - 1].addNeighbour(i + j);
            }
          }
          if (i + j + rl < this.vertexNumber - 1) {
            if (this.circleArray[i + j].getNeighbourCounter() <
              this.maxDeg &&
              this.circleArray[i + j + rl].getNeighbourCounter() < this.maxDeg) {
              this.circleArray[i + j].addNeighbour(i + j + rl);
              this.circleArray[i + j + rl].addNeighbour(i + j);
            }
          }
          if (i + j + rl + 1 < this.vertexNumber - 1) {
            if (this.circleArray[i + j].getNeighbourCounter() <
              this.maxDeg &&
              this.circleArray[i + j + rl + 1].getNeighbourCounter() < this.maxDeg) {
              this.circleArray[i + j].addNeighbour(i + j + rl + 1);
              this.circleArray[i + j + rl + 1].addNeighbour(i + j); /*aaaaaaaaaaaaaa*/
            }
          }
          if (this.circleArray[i + j].getNeighbourCounter() <
            this.maxDeg &&
            this.circleArray[i + j - rl - 1].getNeighbourCounter() < this.maxDeg) {
            this.circleArray[i + j].addNeighbour(i + j - rl - 1);
            this.circleArray[i + j - rl - 1].addNeighbour(i + j);
          }
          if (this.circleArray[i + j].getNeighbourCounter() <
            this.maxDeg &&
            this.circleArray[i + j - rl].getNeighbourCounter() <
              this.maxDeg) {
            this.circleArray[i + j].addNeighbour(i + j - rl);
            this.circleArray[i + j - rl].addNeighbour(i + j);
          }
          if (this.circleArray[i + j].getNeighbourCounter() <
            this.maxDeg &&
            this.circleArray[i + j - rl + 1].getNeighbourCounter() < this.maxDeg) {
            this.circleArray[i + j].addNeighbour(i + j - rl + 1);
            this.circleArray[i + j - rl + 1].addNeighbour(i + j);
          }
        }
      }
    }
    // place points on the screen
    for (let i = 0; i < this.vertexNumber; i++) {
      this.circleArray[i].setPosition(this.dim.w / 2 +
        (this.dim.w / 2.8) *
          Math.cos(i * ((Math.PI * 2) / this.vertexNumber)), this.dim.h / 2 +
        (this.dim.h / 2.8) *
          Math.sin(i * ((Math.PI * 2) / this.vertexNumber)));
    }
    // mix the points
    for (let i = 0; i < (3 / 2) * this.vertexNumber; i++) {
      const first = Math.floor(Math.random() * this.vertexNumber);
      let second;
      if (i > this.vertexNumber) {
        second = this.vertexNumber - first - 1;
      }
      else {
        second = Math.floor(Math.random() * (this.vertexNumber - 1));
      }
      if (first == second) {
        second = this.vertexNumber - 1;
      }
      const tempPosX = this.circleArray[first].getX();
      const tempPosY = this.circleArray[first].getY();
      this.circleArray[first].setPosition(this.circleArray[second].getX(), this.circleArray[second].getY());
      this.circleArray[second].setPosition(tempPosX, tempPosY);
    }
    this.highlighter();
    this.drawAndRegister();
  }
  drawAndRegister() {
    for (let i = 0; i < this.vertexNumber; i++) {
      const circle = this.circleArray[i];
      circle.draw(false);
      circle
        .on("pointerdown", (event) => {
        var circle = event.currentTarget;
        this.touchedID = circle.getID();
        this.dragging = true;
        this.numberOfClicks++;
        circle.draw(true);
        for (var i = 0; i < circle.getNeighbourCounter(); i++) {
          this.circleArray[circle.getNeighbour(i)].draw(true);
        }
      })
        .on("pointerup", (event) => {
        this.dragEnd(event);
      })
        .on("pointerupoutside", (event) => {
        this.dragEnd(event);
      })
        .on("pointermove", (event) => {
        if (this.dragging) {
          var circle = event.currentTarget;
          if (this.touchedID == circle.getID()) {
            circle.x = Math.min(this.dim.w - this.circleRadius, Math.max(this.circleRadius, event.data.global.x));
            circle.y = Math.min(this.dim.h - this.circleRadius, Math.max(this.circleRadius, event.data.global.y));
            this.highlighter();
          }
        }
      });
    }
  }
  dragEnd(event) {
    const circle = event.currentTarget;
    circle.draw(false);
    for (let i = 0; i < circle.getNeighbourCounter(); i++) {
      this.circleArray[circle.getNeighbour(i)].draw(false);
    }
    this.dragging = false;
    this.touchedID = -1;
    this.checkIfEnd();
  }
  updateLinks(isHighlighted) {
    this.linksLayer.clear();
    this.linksLayer.lineStyle(6, colors.GREEN); // green
    for (let i = 0; i < this.vertexNumber; i++) {
      for (let j = 0; j < this.circleArray[i].getNeighbourCounter(); j++) {
        const neighbourIndex = this.circleArray[i].getNeighbour(j);
        this.linksLayer.moveTo(this.circleArray[i].getX(), this.circleArray[i].getY());
        this.linksLayer.lineTo(this.circleArray[neighbourIndex].getX(), this.circleArray[neighbourIndex].getY());
      }
    }
    if (isHighlighted) {
      this.linksLayer.lineStyle(6, colors.RED); // red
      for (let i = 0; i < this.vertexNumber; i++) {
        for (let j = 0; j <
          this.circleArray[i].getHighlightedNeighbourCounter(); j++) {
          const neighbourIndex = this.circleArray[i].getHighlightedNeighbour(j);
          this.linksLayer.moveTo(this.circleArray[i].getX(), this.circleArray[i].getY());
          this.linksLayer.lineTo(this.circleArray[neighbourIndex].getX(), this.circleArray[neighbourIndex].getY());
        }
      }
    }
  }
  highlighter() {
    let x1, y1, x2, y2, x3, y3, x4, y4, a1, b1, c1, a2, b2, c2;
    x1 = y1 = x2 = y2 = x3 = y3 = x4 = y4 = a1 = b1 = c1 = a2 = b2 = c2 = 0;
    let firstx3y3, firstx4y4, first, secondx1y1, secondx2y2, second;
    firstx3y3 = firstx4y4 = first = secondx1y1 = secondx2y2 = second = true;
    for (let i = 0; i < this.vertexNumber; i++) {
      this.circleArray[i].clearHighlightList();
    }
    for (let i = 0; i < this.circleArray.length; i++) {
      for (let j = 0, lengthj = this.circleArray[i].getNeighbourCounter(); j < lengthj; j++) {
        x1 = this.circleArray[i].getX() + 1;
        y1 = this.circleArray[i].getY() + 1;
        x2 =
          this.circleArray[this.circleArray[i].getNeighbour(j)].getX() + 1;
        y2 =
          this.circleArray[this.circleArray[i].getNeighbour(j)].getY() + 1;
        a1 = x2 - x1;
        b1 = y2 - y1;
        c1 = y1 * x2 - x1 * y2;
        for (let k = 0; k < this.circleArray.length; k++) {
          for (let l = 0, lengthl = this.circleArray[k].getNeighbourCounter(); l < lengthl; l++) {
            if (!(this.circleArray[i] ==
              this.circleArray[k] ||
              this.circleArray[i] ==
                this.circleArray[this.circleArray[k].getNeighbour(l)] ||
              this.circleArray[this.circleArray[i].getNeighbour(j)] == this.circleArray[k] ||
              this.circleArray[this.circleArray[i].getNeighbour(j)] ==
                this.circleArray[this.circleArray[k].getNeighbour(l)])) {
              x3 = this.circleArray[k].getX();
              y3 = this.circleArray[k].getY();
              x4 =
                this.circleArray[this.circleArray[k].getNeighbour(l)].getX();
              y4 =
                this.circleArray[this.circleArray[k].getNeighbour(l)].getY();
              a2 = x4 - x3;
              b2 = y4 - y3;
              c2 = y3 * x4 - x3 * y4;
              firstx3y3 = false;
              firstx4y4 = false;
              first = false;
              secondx1y1 = false;
              secondx2y2 = false;
              second = false;
              if (y3 * a1 - x3 * b1 >= c1) {
                firstx3y3 = true;
              }
              if (y4 * a1 - x4 * b1 >= c1) {
                firstx4y4 = true;
              }
              if (firstx3y3 != firstx4y4) {
                first = true;
              }
              if (y1 * a2 - x1 * b2 >= c2) {
                secondx1y1 = true;
              }
              if (y2 * a2 - x2 * b2 >= c2) {
                secondx2y2 = true;
              }
              if (secondx1y1 != secondx2y2) {
                second = true;
              }
              if (first == true && second == true) {
                this.circleArray[i].addHighlightedNeighbours(this.circleArray[i].getNeighbour(j));
              }
            }
          }
        }
      }
    }
    this.updateLinks(this.isHighlighted);
  }
  checkIfEnd() {
    for (let i = 0; i < this.vertexNumber; i++) {
      if (this.circleArray[i].getHighlightedNeighbourCounter() > 0) {
        return;
      }
    }
    this.finishCallback();
  }
}
//# sourceMappingURL=map.js.map
