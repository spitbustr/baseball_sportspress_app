import $settings from "@/data/settings.json"

export default class CastService {

  static currentBatter(data) {
    if(data?.players) {
        const players = {
            away: data.players.away,
            home: data.players.home,
        }
        let lastPlayer = {
            player: players.away[0],
            outcome: players.away[0].outcome[1]
        }
        players.away.forEach(player => {
            player.outcome.forEach(outcome => {
                if(outcome.atBatResult || outcome.putOut )
                {
                    lastPlayer = {player: player,outcome: outcome}
                }
            })
        })
        players.home.forEach(player => {
            player.outcome.forEach(outcome => {
                if(outcome.atBatResult || outcome.putOut )
                {
                    lastPlayer = {player: player,outcome: outcome}
                }
            })
        })
        return lastPlayer
    }
    return null
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