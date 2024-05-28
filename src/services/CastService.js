import $settings from "@/data/settings.json"
import {InGameResults,PlayerInGame} from "@/models/PlayerInGame"
export default class CastService {

  static currentBatters(players) {
    const numberOfInnings = $settings.playballConfig.innings+1
    const nextPlayers = []
    let playerIndex = 0
    if(players?.length) {
      for (let inningIndex = 1; inningIndex <= numberOfInnings; inningIndex++) {
        players.forEach((player,$index) => {
          const atBat = new InGameResults(player?.outcome?.[inningIndex])
          if(atBat.wentAtBat) {
            playerIndex = $index+1
          }
        })
      }
      let resetIndex = 0
      for(let i=0; i<3; i++) {
        if(playerIndex >= players.length ) {
          nextPlayers.push(new PlayerInGame(players[resetIndex]))
          resetIndex++
        }
        else {
          nextPlayers.push(new PlayerInGame(players[playerIndex]))
          playerIndex++
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
      inning: 1,
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
      away: this.currentBatters(data?.players?.away),
      home: this.currentBatters(data?.players?.home),
    }
    info.outs = this.currentOuts(info.inning, data?.players?.[info.topBottom === "top" ?"away":"home"])
    return info
  }
}