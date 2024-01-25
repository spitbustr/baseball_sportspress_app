import { clone } from "@/scripts/utilities"
import $settings from "@/data/settings.json"


export default class PlayerInGame {
  constructor(properties) {
    this.outcome = clone(Array($settings.websiteConfig.innings.length).fill(clone(new InGameResults())))
    Object.assign(this, clone(properties))
  }

  get name() {
    return this.title.rendered
  }
}
const defaultInGameResults = {
  onBasePosition: null,
  atBatResult: null,
  putOut: false,
  rbiBy: null,
  inningEnd: null,
  countAsHR: false,
}
export class InGameResults {
  constructor(properties) {
    Object.assign(this, clone(defaultInGameResults), clone(properties))
  }
}
