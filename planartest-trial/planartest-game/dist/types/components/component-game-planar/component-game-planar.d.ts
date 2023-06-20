import { User } from '../../models/user';
import { MapManager } from './map-manager';
import * as PIXI from "pixi.js";
import { PlanartestLog } from '../../models/game-models/planartest-log';
import { Log } from '../../models/log';
export declare class ComponentGamePlanar {
  player_id: number;
  education?: string;
  sex?: number;
  birthYear?: number;
  region: number;
  customLang?: ("hu" | "en");
  finish: any;
  user: User;
  container: any;
  app: PIXI.Application;
  loader: PIXI.Loader;
  dim: any;
  mapManager: MapManager;
  specialLog: PlanartestLog;
  log: Log;
  pauseDate: number;
  started: boolean;
  constructor();
  start(): void;
  render(): any;
  componentDidRender(): void;
  pause(): Promise<void>;
  resume(): Promise<void>;
  stop(): Promise<void>;
  restart(): Promise<void>;
  calculateScore(): void;
  sendLog(): void;
}
