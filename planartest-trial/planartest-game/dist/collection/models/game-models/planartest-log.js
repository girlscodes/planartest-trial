export class PlanartestLog {
  constructor() {
    this.levels = [];
  }
  addNewLevel(level) {
    this.levels.push(level);
  }
}
/*
"game_specific_data":
    "[
        {"nofSteps":5,"nofIntersectionChecks":0,"playTime":9645},
        {"nofSteps":12,"nofIntersectionChecks":0,"playTime":28129},
        {"nofSteps":8,"nofIntersectionChecks":0,"playTime":16925}
    ]"
*/
export class Level {
  constructor(nofSteps, playTime) {
    this.nofSteps = 0;
    this.playTime = 0;
    this.nofSteps = nofSteps;
    this.playTime = playTime;
  }
}
//# sourceMappingURL=planartest-log.js.map
