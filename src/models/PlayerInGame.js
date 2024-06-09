import { clone } from "@/scripts/utilities"
import $settings from "@/data/settings.json"

export class PlayerInGame {
  constructor(properties) {
    const outcomes = properties?.outcome?.map(outcome => {return new InGameResults(outcome)})
    const extraOutcomes = properties?.extraOutcome?.map(outcome => {return new InGameResults(outcome)}) || []
    this.extraOutcome = extraOutcomes ?? []
    this.outcome = outcomes ?? clone(Array(+properties?.innings+1 || $settings.playballConfig.innings+1).fill(clone(new InGameResults())))
    Object.assign(this, clone(properties))
  }

  get name() {
    return this.title?.rendered || ""
  }

  get allOutcomes() {
    return [...this.outcome, ...this.extraOutcome]
  }
}
const defaultInGameResults = {
  onBasePosition: null,
  atBatResult: null,
  putOut: false,
  rbiBy: null,
  inningEnd: null,
  countAsHR: false,
  inning: 0,
  extraId: 0,
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
