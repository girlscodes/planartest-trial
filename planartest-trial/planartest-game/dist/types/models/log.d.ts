import { User } from "./user";
export declare class Log {
  game_name: string;
  start_time: string;
  ui_device?: string;
  game_version?: string;
  ui_agent?: any;
  ui_width?: number;
  ui_height?: number;
  eventtype: string;
  duration: number;
  score: number;
  '@timestamp': string;
  interrupted: boolean;
  difficulty: number;
  player_id: number;
  region: number;
  education: string;
  sex: number;
  age: number;
  pause_count: number;
  pause_time: number;
  game_specific_data: any;
  host_domain: string;
  constructor(user: User, game_name: string, start_time: string, ui_device?: string, game_version?: string, ui_agent?: any, ui_width?: number, ui_height?: number);
  interrupt(): void;
  send(): void;
}
