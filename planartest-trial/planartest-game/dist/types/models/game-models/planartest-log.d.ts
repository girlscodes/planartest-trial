export declare class PlanartestLog {
  levels: Level[];
  addNewLevel(level: Level): void;
}
export declare class Level {
  nofSteps: number;
  playTime: number;
  constructor(nofSteps: number, playTime: number);
}
