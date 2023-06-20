export class BunniesLog {
  constructor() {
    this.rounds = [];
  }
  addNewRound(oprimalMoves) {
    this.rounds.push(new Round(oprimalMoves));
  }
  addJump() {
    this.rounds[this.rounds.length - 1].moves++;
  }
}
export class Round {
  constructor(optimalMoves) {
    this.optimalMoves = optimalMoves;
    this.moves = 0;
  }
}
//# sourceMappingURL=bunnies-log.js.map
