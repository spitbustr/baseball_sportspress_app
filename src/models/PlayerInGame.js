import { clone } from "@/scripts/utilities"
import $settings from "@/data/settings.json"
import { relativeTimeThreshold } from "moment"


export class PlayerInGame {
  constructor(properties) {
    const outcomes = properties?.outcome?.map(outcome => {return new InGameResults(outcome)})
    this.outcome = outcomes ?? clone(Array($settings.playballConfig.innings.length+1).fill(clone(new InGameResults())))
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
  get wentAtBat() {
    return !!(this.atBatResult
      || this.onBasePosition
      || this.putOut)
  }
}
