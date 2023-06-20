export declare class BunniesLog {
  rounds: Round[];
  addNewRound(oprimalMoves: number): void;
  addJump(): void;
}
export declare class Round {
  optimalMoves: number;
  moves: number;
  constructor(optimalMoves: number);
}
