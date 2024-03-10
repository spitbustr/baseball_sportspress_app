import $settings from "@/data/settings.json"
import {InGameResults,PlayerInGame} from "@/models/PlayerInGame"
export default class CastService {

  static currentBatters(inning, nextIndex, players) {
    let nextPlayerIndex = 0
    let nextPlayer = null
    let nextPlayers = []
    const emptyOutcome = {
      first: 0,
      last: 0,
    }
    if(players?.length) {
      players.forEach((player,$index) => {
        const atBat = new InGameResults(player?.outcome?.[inning])
        if(!atBat.wentAtBat && emptyOutcome.first === 0) {
          emptyOutcome.first = $index
        }
        if(!atBat.wentAtBat) {
          emptyOutcome.last = $index
        }
      })
      if(emptyOutcome.first === 0 && emptyOutcome.last === 0 ) {
        nextPlayerIndex = nextIndex
      }
      else {
        nextPlayerIndex = emptyOutcome.last >= players.length - 1
          ? emptyOutcome.first
          : 0
      }
      nextPlayer = players[nextPlayerIndex]

      let resetIndex = 0
      for(let i=0; i<3; i++) {
        if(nextPlayerIndex >= players.length ) {
          nextPlayers.push(new PlayerInGame(players[resetIndex]))
          resetIndex++
        }
        else {
          nextPlayers.push(new PlayerInGame(players[nextPlayerIndex]))
          nextPlayerIndex++
        }
      }
    }
    return nextPlayers
  }
  static currentOuts(inning, players) {
    let outs = 0
    if(players?.length) {
      players.forEach(player => {
        if(player?.outcome?.[inning]?.putOut) {
          outs++
        }
      })
    }
    return outs
  }

  static info(data) {
    const info = {
      topBottom: "top",
      inning: 0,
      nextPlayer: {
        away: 0,
        home: 0,
      },
      outs: 0,
      currentBatters: {
        away: [],
        home: [],
      },
    }
    data?.players?.away?.map(p => p.outcome)?.forEach((outcomes, $playerIndex) => {
      outcomes.forEach((o,$index) => {
        if(o.inningEnd && info.inning <= $index) {
          info.topBottom = "bottom"
          info.inning = $index
          info.nextPlayer.away = data?.players?.away.length-1 <= $playerIndex
          ? 0
          : $playerIndex+1
        }
      })
    })
    data?.players?.home?.map(p => p.outcome)?.forEach((outcomes, $playerIndex) => {
      outcomes.forEach((o,$index) => {
        if(o.inningEnd && info.inning <= $index) {
          info.topBottom = "top"
          info.inning = $index+1
          info.nextPlayer.home = data?.players?.home.length-1 <= $playerIndex
            ? 0
            : $playerIndex+1
        }
      })
    })
    info.currentBatters = {
      away: this.currentBatters(info.inning, info.nextPlayer.away, data?.players?.away),
      home: this.currentBatters(info.inning, info.nextPlayer.home, data?.players?.home),
    }
    info.outs = this.currentOuts(info.inning, data?.players?.[info.topBottom === "top" ?"away":"home"])
    return info
  }
}