/**
 * @constructor
 * @param {Number} [opt_maxLevel] - The maximal level of the game calculated from settings.
 * @param {Number} [opt_actLevel] - The level of the actual game. The interval of opt_actLevel's value = [0 .. opt_maxLevel] .
 */
export declare class ScoreCalculator {
  private maxLevel;
  private actLevel;
  private invActLevel;
  constructor(maxLevel: number, actLevel: number);
  /**
   * Calculates the score from the given parameters. Be sure that goodValues, actValues, acceptableValues and weights have the same size.
   * GoodValues[i] contains the maximal optimal value of actValues[i]. acceptableValues[i] contains the theoretically maximal value of actValues[i]. Weights[i] is a priority value to actValues[i].
   * @param {<Number>Array} goodValues - This array contains the limits of very good results. If actValues[i] < goodValues[i] the user won't get penalty for actValues[i].
   * @param {<Number>Array} actValues - The results of the user in the game, e.g.: playTime, numberOfBadClicks, distanceFromTarget ...
   * @param {<Number>Array} acceptableValues - This array contains the theoretically maximal values of actValues. It's possible that actValues[i] > acceptableValues[i], but it's hard to reach this limit.
   * @param {<Number>Array} weights - Weight[i] represents the importance of actValues[i]. If it's possible, create weights in this way: sum(weights) = 1
   * @return {Number} score - The score value.
   */
  getDisplayedScore(goodValues: number[], actValues: number[], acceptableValues: number[], weights: number[]): number;
  getRealScore(goodValues: number[], actValues: number[], acceptableValues: number[], weights: number[]): number;
}
