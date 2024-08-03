import {clone} from "@/scripts/utilities"
import $settings from "@/data/settings.json"
import SportspressAPIService from "@/services/SportspressAPIService"
import {InGameResults} from "@/models/PlayerInGame"

const defaultGameEvent = {
    players: [],
    results: {},
    performance: {},
    main_results: [],
    status: "publish",
    mode: "team",
    staff: [0,0]
}
export default class GameEvent {
    constructor(properties) {
        Object.assign(this, clone(defaultGameEvent), clone(properties))
    }

    async prepareData(payload) {
        this.id = payload.gameId
        this.results = this.generateResultsData(payload)
        this.players = this.generatePlayersData(payload)
        this.main_results = [
            payload.scores.away?.runs?.[0],
            payload.scores.home?.runs?.[0]
        ]
        this.generatePerformanceData(payload)
        await SportspressAPIService.sendData(this)
    }
    gernerateTeamPerformance(teamId, stance,payload) {
        this.performance[teamId] = {}
        payload.players[stance].forEach(player => {
            this.performance[teamId][player.id] = {
                number: player?.number?.toString(),
                ab: (player.allOutcomes.map(o => o.atBatResult).reduce((total, res) => {
                    return total + (this.isConsideredAtBat(res) ? 1 : 0)
                }, 0)).toString(),
                oneb: (player.allOutcomes.map(o => o.atBatResult).reduce((total, res) => {
                    return total + (res === "1B" ? 1 : 0)
                }, 0)).toString(),
                twob: (player.allOutcomes.map(o => o.atBatResult).reduce((total, res) => {
                    return total + (res === "2B" ? 1 : 0)
                }, 0)).toString(),
                threeb: (player.allOutcomes.map(o => o.atBatResult).reduce((total, res) => {
                    return total + (res === "3B" ? 1 : 0)
                }, 0)).toString(),
                cc: (player.allOutcomes.map(o => o.atBatResult).reduce((total, res) => {
                    return total + (res === "4B" || res === "HR" ? 1 : 0)
                }, 0)).toString(),
                cs: (player.allOutcomes.map(o => o.atBatResult).reduce((total, res) => {
                    return total + (this.isConsideredHit(res) ? 1 : 0)
                }, 0)).toString(),
                p: (player.allOutcomes.map(o => o.rbiBy).reduce((total, res) => {
                    return total + (res ? 1 : 0)
                }, 0)).toString(),
                pp: (payload?.players?.[stance]
                    .map(p => p.allOutcomes)
                    .flat()
                    .map(o => o.rbiBy)
                    .filter(o => o === player.id)?.length).toString(),
                rab: (player?.allOutcomes.map(o => o.atBatResult).reduce((total, res) => {
                    return total + (res === "K" ? 1 : 0)
                }, 0)).toString(),
                status: "lineup",
            }
        })
    }
    generatePerformanceData(payload) {
        this.performance = {}
        this.gernerateTeamPerformance(payload.teams.away.id, "away",payload)
        this.gernerateTeamPerformance(payload.teams.home.id, "home",payload)
    }
    generateResultsData(payload) {
        let results = {}
        results[payload.teams.away.id] = {
            one: this.inningNotPlayed(payload,"away",1) ? null : (payload.scores.away?.runs?.[1] ?? 0).toString(),
            two: this.inningNotPlayed(payload,"away",2) ? null : (payload.scores.away?.runs?.[2] ?? 0).toString(),
            three: this.inningNotPlayed(payload,"away",3) ? null : (payload.scores.away?.runs?.[3] ?? 0).toString(),
            four:this.inningNotPlayed(payload,"away",4) ? null : (payload.scores.away?.runs?.[4] ?? 0).toString(),
            five: this.inningNotPlayed(payload,"away",5) ?  null : (payload.scores.away?.runs?.[5] ?? 0).toString(),
            six:  this.inningNotPlayed(payload,"away",6) ?  null : (payload.scores.away?.runs?.[6] ?? 0).toString(),
            seven: this.inningNotPlayed(payload,"away",7) ? null : (payload.scores.away?.runs?.[7] ?? 0).toString(),
            eight: this.inningNotPlayed(payload,"away",8) ? null : (payload.scores.away?.runs?.[8] ?? 0).toString(),
            nine: this.inningNotPlayed(payload,"away",9) ? null : (payload.scores.away?.runs?.[9] ?? 0).toString(),
            ten: this.inningNotPlayed(payload,"away",10) ? null : (payload.scores.away?.runs?.[10] ?? 0).toString(),
            eleven: this.inningNotPlayed(payload,"away",11) ? null : (payload.scores.away?.runs?.[11] ?? 0).toString(),
            twelve: this.inningNotPlayed(payload,"away",12) ? null : (payload.scores.away?.runs?.[12] ?? 0).toString(),
            thirteen: this.inningNotPlayed(payload,"away",13) ? null : (payload.scores.away?.runs?.[13] ?? 0).toString(),
            fourteen: this.inningNotPlayed(payload,"away",14) ? null : (payload.scores.away?.runs?.[14] ?? 0).toString(),
            fifteen: this.inningNotPlayed(payload,"away",15) ? null : (payload.scores.away?.runs?.[15] ?? 0).toString(),
            r: (payload.scores.away?.runs?.[0] ?? 0).toString(),
            h: (payload.scores.away?.hits ?? 0).toString(),
            e: (payload.scores.away?.errors ?? 0).toString(),
            estwo: (payload.scores.away?.estwo?? 0).toString(),
            outcome: [
                payload.scores.away?.runs?.[0] > payload.scores.home?.runs?.[0]
                ? "win"
                : payload.scores.away?.runs?.[0] === payload.scores.home?.runs?.[0]
                 ? "nulle"
                 : "loss"
            ]
        }
        results[payload.teams.home.id] = {
            one: this.inningNotPlayed(payload,"home",1) ? null : (payload.scores.home?.runs?.[1] ?? 0).toString(),
            two: this.inningNotPlayed(payload,"home",2) ? null : (payload.scores.home?.runs?.[2] ?? 0).toString(),
            three: this.inningNotPlayed(payload,"home",3) ? null : (payload.scores.home?.runs?.[3] ?? 0).toString(),
            four:this.inningNotPlayed(payload,"home",4) ? null : (payload.scores.home?.runs?.[4] ?? 0).toString(),
            five: this.inningNotPlayed(payload,"home",5) ?  null : (payload.scores.home?.runs?.[5] ?? 0).toString(),
            six:  this.inningNotPlayed(payload,"home",6) ?  null : (payload.scores.home?.runs?.[6] ?? 0).toString(),
            seven: this.inningNotPlayed(payload,"home",7) ? null : (payload.scores.home?.runs?.[7] ?? 0).toString(),
            eight: this.inningNotPlayed(payload,"home",8) ? null : (payload.scores.home?.runs?.[8] ?? 0).toString(),
            nine: this.inningNotPlayed(payload,"home",9) ? null : (payload.scores.home?.runs?.[9] ?? 0).toString(),
            ten: this.inningNotPlayed(payload,"home",10) ? null : (payload.scores.home?.runs?.[10] ?? 0).toString(),
            eleven: this.inningNotPlayed(payload,"home",11) ? null : (payload.scores.home?.runs?.[11] ?? 0).toString(),
            twelve: this.inningNotPlayed(payload,"home",12) ? null : (payload.scores.home?.runs?.[12] ?? 0).toString(),
            thirteen: this.inningNotPlayed(payload,"home",13) ? null : (payload.scores.home?.runs?.[13] ?? 0).toString(),
            fourteen: this.inningNotPlayed(payload,"home",14) ? null : (payload.scores.home?.runs?.[14] ?? 0).toString(),
            fifteen: this.inningNotPlayed(payload,"home",15) ? null : (payload.scores.home?.runs?.[15] ?? 0).toString(),
            r: (payload.scores.home?.runs?.[0] ?? 0).toString(),
            h: (payload.scores.home?.hits ?? 0).toString(),
            e: (payload.scores.home?.errors ?? 0).toString(),
            estwo: (payload.scores.home?.estwo?? 0).toString(),
            outcome: [
                payload.scores.away?.runs?.[0] < payload.scores.home?.runs?.[0]
                    ? "win"
                    : payload.scores.away?.runs?.[0] === payload.scores.home?.runs?.[0]
                        ? "nulle"
                        : "loss"
            ]
        }
        return results
    }
    inningNotPlayed(payload, team, inning) {
        let notPlayed = true
        payload.players?.[team]?.forEach(player => {
            const atbat = new InGameResults(player.outcome?.[inning])
            if(atbat.wentAtBat) {
                notPlayed = false
            }
        })
        return notPlayed
    }
    generatePlayersData(payload) {
        const players = []
        players.push(0)
        payload.players.away.forEach(player => {
            players.push(player.id)
        })
        players.push(0)
        payload.players.home.forEach(player => {
            players.push(player.id)
        })
        return players
    }
    generateScore(payload) {
        const score = {
            away: {
                runs: new Array($settings.playballConfig.innings+1).fill(0),
                hits: 0,
                errors: 0,
                estwo: 1
            },
            home: {
                runs: new Array($settings.playballConfig.innings+1).fill(0),
                hits: 0,
                errors: 0,
                estwo: 1
            },
        }
        payload.players.away.forEach(player => {
            player.outcome.forEach((outcome,index)=> {
                score.away.hits += (this.isConsideredHit(outcome.atBatResult) ? 1:0)
                score.home.errors += (outcome.atBatResult ==="E" ? 1:0)
                score.away.runs[index] = score.away.runs?.[index] ? score.away.runs[index] : 0
                if(index !== 0) {
                    score.away.runs[index] += outcome?.onBasePosition === "point" ? 1 : 0
                }
            })
            player?.extraOutcome?.forEach((outcome,index)=> {
                if(outcome) {
                    score.away.hits += (this.isConsideredHit(outcome.atBatResult) ? 1:0)
                    score.home.errors += (outcome.atBatResult ==="E" ? 1:0)
                    score.away.runs[outcome.inning] = score.away.runs?.[outcome.inning] ? score.away.runs[outcome.inning] : 0
                    score.away.runs[outcome.inning] += outcome?.onBasePosition === "point" ? 1 : 0
                }
            })
        })
        score.away.runs[0] = score.away.runs.reduce((total,current) => {
            return total + current
        })
        payload.players.home.forEach(player => {
            player.outcome.forEach((outcome,index)=> {
                score.home.hits += (this.isConsideredHit(outcome.atBatResult) ? 1:0)
                score.away.errors += (outcome.atBatResult ==="E" ? 1:0)
                score.home.runs[index] = score.home.runs?.[index] ? score.home.runs[index] : 0
                if(index !== 0) {
                    score.home.runs[index] += outcome?.onBasePosition === "point" ? 1 : 0
                }
            })
            player?.extraOutcome?.forEach((outcome,index)=> {
                if(outcome) {
                    score.home.hits += (this.isConsideredHit(outcome.atBatResult) ? 1:0)
                    score.away.errors += (outcome.atBatResult ==="E" ? 1:0)
                    score.home.runs[outcome.inning] = score.home.runs?.[outcome.inning] ? score.home.runs[outcome.inning] : 0
                    score.home.runs[outcome.inning] += outcome?.onBasePosition === "point" ? 1 : 0
                }
            })
        })
        score.home.runs[0] = score.home.runs.reduce((total,current) => {
            return total + current
        })
        return score
    }
    generateOutcome(payload) {

    }
    generateWinner(payload) {

    }
    isConsideredAtBat(result) {
        return $settings.stats.isConsideredAtBat.indexOf(result) !== -1
    }
    isConsideredHit(result) {
        return ["1B","2B","3B","4B","HR"].indexOf(result) !== -1
    }
}


