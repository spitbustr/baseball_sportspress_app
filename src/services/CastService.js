import $settings from "@/data/settings.json"

export default class CastService {

  static currentBatter(data) {
    return {}
  }
  static nextUp (data) {
    return {}
  }
  static currentInning(data) {
    return 1
  }
  static topBottomInning(data) {
    return 1
  }
  static numberOfOut(data) {
    return 2
  }

  static homeRunsRule(data) {
    if($settings.playballConfig.homeRunsRule === "plusOne") {
        return 0
    }
  }
}