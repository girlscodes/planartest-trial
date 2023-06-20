/**
 * @constructor
 * @param {Number} [opt_maxLevel] - The maximal level of the game calculated from settings.
 * @param {Number} [opt_actLevel] - The level of the actual game. The interval of opt_actLevel's value = [0 .. opt_maxLevel] .
 */
export class ScoreCalculator {
  constructor(maxLevel, actLevel) {
    if (maxLevel) {
      this.maxLevel = maxLevel;
      this.actLevel = actLevel;
      //I invert actLevel to calculate the final result
      this.invActLevel = this.maxLevel - this.actLevel;
    }
    else {
      this.maxLevel = 2;
      this.actLevel = 2;
      this.invActLevel = 0;
    }
  }
  /**
   * Calculates the score from the given parameters. Be sure that goodValues, actValues, acceptableValues and weights have the same size.
   * GoodValues[i] contains the maximal optimal value of actValues[i]. acceptableValues[i] contains the theoretically maximal value of actValues[i]. Weights[i] is a priority value to actValues[i].
   * @param {<Number>Array} goodValues - This array contains the limits of very good results. If actValues[i] < goodValues[i] the user won't get penalty for actValues[i].
   * @param {<Number>Array} actValues - The results of the user in the game, e.g.: playTime, numberOfBadClicks, distanceFromTarget ...
   * @param {<Number>Array} acceptableValues - This array contains the theoretically maximal values of actValues. It's possible that actValues[i] > acceptableValues[i], but it's hard to reach this limit.
   * @param {<Number>Array} weights - Weight[i] represents the importance of actValues[i]. If it's possible, create weights in this way: sum(weights) = 1
   * @return {Number} score - The score value.
   */
  getDisplayedScore(goodValues, actValues, acceptableValues, weights) {
    if (goodValues.length != actValues.length || goodValues.length != acceptableValues.length || goodValues.length != weights.length) {
      throw "The function parameters haven't got the same size.";
    }
    const maxScore = 400 + this.actLevel * 400 / this.maxLevel;
    const levelDeduction = 400 / this.maxLevel * this.invActLevel;
    let userPerformanceDeduction = 0;
    for (let i = 0; i < goodValues.length; i++) {
      if (goodValues[i] < actValues[i]) {
        userPerformanceDeduction += (actValues[i] - goodValues[i]) / (acceptableValues[i] - goodValues[i]) * weights[i];
      }
    }
    let combinedError = levelDeduction + maxScore * userPerformanceDeduction;
    let score = 1000;
    if (combinedError < 600) {
      score -= combinedError;
    }
    else {
      score -= 600;
      combinedError -= 600;
      score -= combinedError / 3;
      if (score < 200) {
        score = 200;
      }
    }
    return Math.round(score);
  }
  getRealScore(goodValues, actValues, acceptableValues, weights) {
    if (goodValues.length != actValues.length || goodValues.length != acceptableValues.length || goodValues.length != weights.length) {
      throw "The function parameters haven't got the same size.";
    }
    const maxScore = 400 + this.actLevel * 400 / this.maxLevel;
    const levelDeduction = 400 / this.maxLevel * this.invActLevel;
    let userPerformanceDeduction = 0;
    for (let i = 0; i < goodValues.length; i++) {
      userPerformanceDeduction += (actValues[i] - goodValues[i]) / (acceptableValues[i] - goodValues[i]) * weights[i];
    }
    let combinedError = levelDeduction + maxScore * userPerformanceDeduction;
    let score = 1000;
    score -= combinedError;
    return Math.round(score);
  }
}
//# sourceMappingURL=scoreCalculator.js.map
