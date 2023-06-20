import * as PIXI from "pixi.js";
export class Scheduler {
  constructor() {
    this.runningProcesses = [];
    this.intervals = [];
  }
  run(process, sprite) {
    process.setTarget(sprite);
    return new Promise((resolve) => {
      process.setEndCallback(resolve);
      process.run();
    });
  }
  pause() {
    for (let process of this.runningProcesses) {
      process.pause();
    }
    for (let interval of this.intervals) {
      interval.delay.pause();
    }
  }
  resume() {
    for (let process of this.runningProcesses) {
      process.resume();
    }
    for (let interval of this.intervals) {
      interval.delay.resume();
    }
  }
  stop() {
    this.pause();
    this.runningProcesses = [];
  }
  addRunningProcess(process) {
    for (let currProc of this.runningProcesses) {
      if (currProc.id === process.id)
        return; // don't add the same process twitce (happens in setInterval when paused/resumed few times)
    }
    this.runningProcesses.push(process);
  }
  removeRunningProcess(process) {
    for (let i = 0; i < this.runningProcesses.length; i++) {
      if (this.runningProcesses[i].id == process.id) {
        this.runningProcesses.splice(i, 1);
      }
    }
  }
  forceFinish(process) {
    for (let i = 0; i < this.runningProcesses.length; i++) {
      if (this.runningProcesses[i].id == process.id) {
        this.runningProcesses[i].forceFinish();
        this.runningProcesses.splice(i, 1);
      }
    }
  }
  setTimeOut(duration, callback, context) {
    const delay = new Delay();
    delay.setTarget(new PIXI.Sprite());
    delay.setEndCallback(callback, context);
    delay.setDuration(duration);
    delay.run();
    return delay;
  }
  clearTimeOut(delay) {
    delay.stop();
  }
  setInterval(duration, callback, context) {
    const delay = new Delay().setDuration(duration);
    delay.setDuration(duration);
    this.intervals.push({
      delay,
      callback,
      context
    });
    delay.setEndCallback(this.nextInterval, this.intervals[this.intervals.length - 1]);
    delay.setTarget(new PIXI.Sprite());
    delay.run();
    return delay;
  }
  nextInterval() {
    this.callback.call(this.context);
    if (!this.delay.isStopped)
      this.delay.run();
  }
  clearInterval(delay) {
    delay.stop();
    for (let i = 0; i < this.intervals.length; i++) {
      if (this.intervals[i].delay.id == delay.id) {
        this.intervals.splice(i, 1);
      }
    }
  }
}
export var scheduler = new Scheduler();
let animPaused = false;
//let epsilon: number = 0.001;
export var Types = {
  Process: "process",
  Delay: "delay",
  Sequence: "sequence",
  Parallel: "parallel",
  FadeTo: "fadeTo",
  MoveTo: "moveTo",
  MoveBy: "moveBy",
  RotateTo: "rotateTo",
  RotateBy: "rotateBy",
  ScaleTo: "scaleTo",
  ScaleBy: "scaleBy"
};
export class Process {
  constructor() {
    this.type = Types.Process;
    this.duration = 1000;
    this.currTime = 0;
    this.prevTimestamp = 0;
    this.currRequestId = 0;
    this.requestAnimCallback = () => {
      const currTime = performance.now();
      let delta = currTime - this.prevTimestamp;
      if (this.currTime + delta >= this.duration) {
        delta = this.duration - this.currTime;
      }
      else {
        this.currRequestId = requestAnimationFrame(this.requestAnimCallback);
      }
      this.currTime += delta;
      this.prevTimestamp = currTime;
      this.update(delta);
      if (this.currTime == this.duration) {
        if (this.endCallback)
          this.endCallback.call(this.endCallbackContext, this.target);
        scheduler.removeRunningProcess(this);
        this.isStopped = true;
      }
    };
    this.id = Math.random() * 10000;
    this.isStopped = false;
  }
  /**
   * @param {number} duration of animation in milliseconds
   * @returns {bc.Process}
   */
  setDuration(duration) {
    this.duration = duration;
    return this;
  }
  setTarget(target) {
    this.target = target;
  }
  setEndCallback(callback, callbackContext) {
    this.endCallback = callback;
    this.endCallbackContext = callbackContext;
  }
  run() {
    if (!this.target) {
      console.warn("Anim " + this.type + " target not specified");
      return;
    }
    this.isStopped = false;
    this.currTime = 0;
    this.prevTimestamp = performance.now();
    scheduler.addRunningProcess(this);
    if (!animPaused)
      this.currRequestId = requestAnimationFrame(this.requestAnimCallback);
  }
  ;
  pause() {
    cancelAnimationFrame(this.currRequestId);
  }
  resume() {
    this.prevTimestamp = performance.now();
    this.currRequestId = requestAnimationFrame(this.requestAnimCallback);
  }
  stop() {
    this.isStopped = true;
    cancelAnimationFrame(this.currRequestId);
    scheduler.removeRunningProcess(this);
  }
  forceFinish() {
    cancelAnimationFrame(this.currRequestId);
    this.update(this.duration - this.currTime);
    if (this.endCallback)
      this.endCallback.call(this.endCallbackContext, this.target);
    scheduler.removeRunningProcess(this);
    this.isStopped = true;
  }
  update(delta) {
    delta;
  }
}
export class Delay extends Process {
  constructor() {
    super();
    this.type = Types.Delay;
  }
}
export class Sequence extends Process {
  constructor(processes) {
    super();
    this.subProcesses = [];
    this.currentRunningIndex = 0;
    this.increaseCounter = () => {
      this.currentRunningIndex++;
      this.next();
    };
    this.type = Types.Sequence;
    this.subProcesses = processes;
  }
  run() {
    this.currentRunningIndex = 0;
    this.next();
  }
  next() {
    const currProcess = this.subProcesses[this.currentRunningIndex];
    if (currProcess) {
      currProcess.setTarget(this.target);
      currProcess.setEndCallback(this.increaseCounter);
      currProcess.run();
    }
    else if (this.endCallback) {
      this.endCallback.call(this.endCallbackContext, this.target);
    }
  }
}
export class Parallel extends Process {
  constructor(processes) {
    super();
    this.subProcesses = [];
    this.endedProcesses = 0;
    this.checkEnd = () => {
      this.endedProcesses++;
      if (this.endedProcesses === this.subProcesses.length && this.endCallback) {
        this.endCallback.call(this.endCallbackContext, this.target);
      }
    };
    this.type = Types.Parallel;
    this.subProcesses = processes;
  }
  run() {
    for (let process of this.subProcesses) {
      process.setTarget(this.target);
      process.setEndCallback(this.checkEnd);
      process.run();
    }
  }
}
export class FadeTo extends Process {
  constructor(to) {
    super();
    this.fadeDiffPerMilliSec = 0;
    this.type = Types.FadeTo;
    this.to = to;
  }
  run() {
    super.run();
    this.fadeDiffPerMilliSec = (this.to - this.target.alpha) / this.duration;
  }
  update(delta) {
    this.target.alpha += delta * this.fadeDiffPerMilliSec;
  }
}
export class MoveTo extends Process {
  constructor(to) {
    super();
    this.to = new PIXI.Point(to.x, to.y);
  }
  run() {
    super.run();
    this.dir = new PIXI.Point((this.to.x - this.target.x) / this.duration, (this.to.y - this.target.y) / this.duration);
  }
  update(delta) {
    this.target.x += this.dir.x * delta;
    this.target.y += this.dir.y * delta;
  }
}
export class MoveBy extends Process {
  constructor(by) {
    super();
    this.by = new PIXI.Point(by.x, by.y);
  }
  run() {
    super.run();
    this.dir = new PIXI.Point(this.by.x / this.duration, this.by.y / this.duration);
  }
  update(delta) {
    this.target.x += this.dir.x * delta;
    this.target.y += this.dir.y * delta;
  }
}
export class ScaleTo extends Process {
  constructor(x, y) {
    super();
    this.to = new PIXI.Point();
    this.to.set(x, y ? y : x);
    this.amount = new PIXI.Point();
  }
  run() {
    super.run();
    this.amount.set((this.to.x - this.target.scale.x) / this.duration, (this.to.y - this.target.scale.y) / this.duration);
  }
  update(delta) {
    this.target.scale.x += this.amount.x * delta;
    this.target.scale.y += this.amount.y * delta;
  }
}
export class ScaleBy extends Process {
  constructor(by) {
    super();
    this.by = new PIXI.Point(by.x, by.y);
    this.amount = new PIXI.Point();
  }
  run() {
    super.run();
    this.amount.set(this.by.x / this.duration, this.by.y / this.duration);
  }
  update(delta) {
    this.target.scale.x += this.amount.x * delta;
    this.target.scale.y += this.amount.y * delta;
  }
}
export class RotateTo extends Process {
  constructor(angle) {
    super();
    this.amount = 0;
    this.to = angle;
  }
  run() {
    super.run();
    this.amount = (this.to - this.target.rotation) / this.duration;
  }
  update(delta) {
    this.target.rotation += this.amount * delta;
  }
}
export class RotateBy extends Process {
  constructor(angle) {
    super();
    this.amount = 0;
    this.by = angle;
  }
  run() {
    super.run();
    this.amount = this.by / this.duration;
  }
  update(delta) {
    this.target.rotation += this.amount * delta;
  }
}
//# sourceMappingURL=anim.js.map
