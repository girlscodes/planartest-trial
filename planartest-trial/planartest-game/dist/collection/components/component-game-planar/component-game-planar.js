import { h } from '@stencil/core';
import { User } from '../../models/user';
import { MapManager } from './map-manager';
import * as PIXI from "pixi.js";
import { PlanartestLog } from '../../models/game-models/planartest-log';
import { Log } from '../../models/log';
import { ScoreCalculator } from '../../scoreCalculator';
import config from './config.json';
export class ComponentGamePlanar {
  constructor() {
    this.loader = new PIXI.Loader;
    this.specialLog = new PlanartestLog;
    this.started = false;
    this.player_id = undefined;
    this.education = undefined;
    this.sex = undefined;
    this.birthYear = undefined;
    this.region = undefined;
    this.customLang = undefined;
    this.user = new User(this.region, this.player_id, this.sex, this.education, this.birthYear);
  }
  start() {
    if (!this.started) {
      this.container = document.getElementById('game');
      this.dim = {
        w: this.container.offsetWidth,
        h: this.container.offsetHeight
      };
      this.app = new PIXI.Application({
        width: this.dim.w,
        height: this.dim.h,
        antialias: true,
        transparent: false,
        resolution: 1,
        backgroundColor: 0xffffff,
      });
      this.container.appendChild(this.app.view);
    }
    if (this.started) {
      this.app.stage.removeChild(this.mapManager);
      this.mapManager = null;
    }
    this.mapManager = new MapManager(this.dim, this.specialLog, this);
    this.app.stage.addChild(this.mapManager);
    this.log = new Log(this.user, //user data (player_id, region, sex, education, birthYear)          
    "planartest", //game_name
    new Date().toISOString(), //start_time
    "mobile", //mobile
    "4.0", //game_version
    "unknown", //ui_agent
    this.dim.w, //ui_width
    this.dim.h); //ui_height
    this.started = true;
  }
  render() {
    return (h("div", { id: "game", class: "game-content" }));
  }
  componentDidRender() {
    setTimeout(() => {
      this.start();
    }, 20);
  }
  async pause() {
    this.pauseDate = Date.now();
    this.log.pause_count++;
    console.log('paused');
  }
  async resume() {
    this.log.pause_time += Date.now() - this.pauseDate;
    console.log('resumed');
  }
  async stop() {
    this.log.interrupt();
    console.log('stopped');
  }
  async restart() {
    this.stop();
    this.start();
  }
  calculateScore() {
    const displayedpercentages = [];
    const realPercentages = [];
    const goodValuesPerLevel = [];
    const valuesPerLevel = [];
    const acceptableValuesPerLevel = [];
    const weightsPerLevel = [];
    // calculating scores for every level just in class planar
    // transforming the level specific scores into percentages
    // e.g.: 400 displayed score on level 0 is 50% (halfway to the maximum of 600 and the minimum of 200)
    let duration = 0;
    for (let i = 0; i < this.mapManager.maxLevel; i++) {
      const goodValues = [];
      const values = [];
      const acceptableValues = [];
      const weights = [];
      //number of steps
      goodValues.push(config[i].nofSteps.good);
      values.push(this.specialLog.levels[i].nofSteps);
      acceptableValues.push(config[i].nofSteps.acceptable);
      weights.push(config[i].nofSteps.weight);
      //playTime
      goodValues.push(config[i].playTime.good);
      values.push(this.specialLog.levels[i].playTime / 1000);
      duration += this.specialLog.levels[i].playTime;
      acceptableValues.push(config[i].playTime.acceptable);
      weights.push(config[i].playTime.weight);
      goodValuesPerLevel.push(goodValues);
      valuesPerLevel.push(values);
      acceptableValuesPerLevel.push(acceptableValues);
      weightsPerLevel.push(weights);
      const calculator = new ScoreCalculator(2, i);
      const localDisplayedScore = calculator.getDisplayedScore(goodValues, values, acceptableValues, weights);
      const localRealScore = calculator.getRealScore(goodValues, values, acceptableValues, weights);
      displayedpercentages.push((localDisplayedScore - 200) / (400 + i * 200));
      realPercentages.push((localRealScore) / (600 + i * 200));
    }
    let displayedScore = 1000 * (displayedpercentages.reduce((prev, curr) => prev + curr, 0) / this.mapManager.maxLevel);
    let realScore = 1000 * (realPercentages.reduce((prev, curr) => prev + curr, 0) / this.mapManager.maxLevel);
    displayedScore = Math.round(displayedScore);
    realScore = Math.round(realScore);
    this.log.score = realScore;
    this.sendLog();
    this.finish.emit({ score: realScore, duration: duration });
  }
  sendLog() {
    let duration = Date.now() - new Date(this.log.start_time).getTime();
    this.log.duration = duration;
    this.log.game_specific_data = JSON.stringify(this.specialLog);
    this.log.send();
  }
  static get is() { return "component-game-planar"; }
  static get originalStyleUrls() {
    return {
      "$": ["component-game-planar.css"]
    };
  }
  static get styleUrls() {
    return {
      "$": ["component-game-planar.css"]
    };
  }
  static get properties() {
    return {
      "player_id": {
        "type": "number",
        "mutable": false,
        "complexType": {
          "original": "number",
          "resolved": "number",
          "references": {}
        },
        "required": false,
        "optional": false,
        "docs": {
          "tags": [],
          "text": ""
        },
        "attribute": "player_id",
        "reflect": false
      },
      "education": {
        "type": "string",
        "mutable": false,
        "complexType": {
          "original": "string",
          "resolved": "string",
          "references": {}
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": ""
        },
        "attribute": "education",
        "reflect": false
      },
      "sex": {
        "type": "number",
        "mutable": false,
        "complexType": {
          "original": "number",
          "resolved": "number",
          "references": {}
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": ""
        },
        "attribute": "sex",
        "reflect": false
      },
      "birthYear": {
        "type": "number",
        "mutable": false,
        "complexType": {
          "original": "number",
          "resolved": "number",
          "references": {}
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": ""
        },
        "attribute": "birth-year",
        "reflect": false
      },
      "region": {
        "type": "number",
        "mutable": false,
        "complexType": {
          "original": "number",
          "resolved": "number",
          "references": {}
        },
        "required": false,
        "optional": false,
        "docs": {
          "tags": [],
          "text": ""
        },
        "attribute": "region",
        "reflect": false
      },
      "customLang": {
        "type": "string",
        "mutable": false,
        "complexType": {
          "original": "(\"hu\"|\"en\")",
          "resolved": "\"en\" | \"hu\"",
          "references": {}
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": ""
        },
        "attribute": "custom-lang",
        "reflect": false
      }
    };
  }
  static get events() {
    return [{
        "method": "finish",
        "name": "finish",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": ""
        },
        "complexType": {
          "original": "any",
          "resolved": "any",
          "references": {}
        }
      }];
  }
  static get methods() {
    return {
      "pause": {
        "complexType": {
          "signature": "() => Promise<void>",
          "parameters": [],
          "references": {
            "Promise": {
              "location": "global"
            }
          },
          "return": "Promise<void>"
        },
        "docs": {
          "text": "",
          "tags": []
        }
      },
      "resume": {
        "complexType": {
          "signature": "() => Promise<void>",
          "parameters": [],
          "references": {
            "Promise": {
              "location": "global"
            }
          },
          "return": "Promise<void>"
        },
        "docs": {
          "text": "",
          "tags": []
        }
      },
      "stop": {
        "complexType": {
          "signature": "() => Promise<void>",
          "parameters": [],
          "references": {
            "Promise": {
              "location": "global"
            }
          },
          "return": "Promise<void>"
        },
        "docs": {
          "text": "",
          "tags": []
        }
      },
      "restart": {
        "complexType": {
          "signature": "() => Promise<void>",
          "parameters": [],
          "references": {
            "Promise": {
              "location": "global"
            }
          },
          "return": "Promise<void>"
        },
        "docs": {
          "text": "",
          "tags": []
        }
      }
    };
  }
}
//# sourceMappingURL=component-game-planar.js.map
