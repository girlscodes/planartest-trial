import { serverUrl } from "../../config.json";
export class ElasticService {
  static async postGameLog(log) {
    console.log(JSON.stringify(log));
    const rawResponse = await fetch(serverUrl + "/emerald/rest/api/v1/analytics/gamelog/", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(log)
    });
    const content = await rawResponse.json();
    console.log(content);
  }
}
//# sourceMappingURL=elastic.service.js.map
