import { ElasticService } from "../services/elastic.service";
import config from "./../../config.json";
export class Log {
  constructor(user, game_name, start_time, ui_device, game_version, ui_agent, ui_width, ui_height) {
    this.game_name = game_name;
    this.start_time = start_time;
    this.ui_device = ui_device;
    this.game_version = game_version;
    this.ui_agent = ui_agent;
    this.ui_width = ui_width;
    this.ui_height = ui_height;
    this.eventtype = 'game';
    this.duration = 0;
    this.score = 0;
    this.interrupted = false;
    this.difficulty = 2;
    this.pause_count = 0;
    this.pause_time = 0;
    this.host_domain = config.host_domain;
    this.player_id = user.player_id || 12;
    this.region = user.region || 2;
    this.age = new Date().getFullYear() - user.birthYear || 26;
    this.sex = user.sex || 1;
    this.education = user.education || 'higher';
  }
  interrupt() {
    this.interrupted = true;
  }
  send() {
    let today = new Date();
    this["@timestamp"] = today.toISOString();
    console.log(this);
    ElasticService.postGameLog(this);
  }
}
//# sourceMappingURL=log.js.map
