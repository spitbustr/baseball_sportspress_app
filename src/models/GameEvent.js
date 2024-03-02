import {clone} from "@/scripts/utilities"
import $settings from "@/data/settings.json"
import SportspressAPIService from "@/services/SportspressAPIService"

const defaultGameEvent = {
    players: [],
    results: {},
    performance: {},
    main_results: []
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
                ab: (player.outcome.map(o => o.atBatResult).reduce((total, res) => {
                    return total + (this.isConsideredAtBat(res) ? 1 : 0)
                }, 0)).toString(),
                oneb: (player.outcome.map(o => o.atBatResult).reduce((total, res) => {
                    return total + (res === "1B" ? 1 : 0)
                }, 0)).toString(),
                twob: (player.outcome.map(o => o.atBatResult).reduce((total, res) => {
                    return total + (res === "2B" ? 1 : 0)
                }, 0)).toString(),
                threeb: (player.outcome.map(o => o.atBatResult).reduce((total, res) => {
                    return total + (res === "3B" ? 1 : 0)
                }, 0)).toString(),
                cc: (player.outcome.map(o => o.atBatResult).reduce((total, res) => {
                    return total + (res === "4B" || res === "HR" ? 1 : 0)
                }, 0)).toString(),
                cs: (player.outcome.map(o => o.atBatResult).reduce((total, res) => {
                    return total + (this.isConsideredHit(res) ? 1 : 0)
                }, 0)).toString(),
                p: (player.outcome.map(o => o.rbiBy).reduce((total, res) => {
                    return total + (res ? 1 : 0)
                }, 0)).toString(),
                pp: (payload?.players?.[stance]
                    .map(p => p.outcome)
                    .flat()
                    .map(o => o.rbiBy)
                    .filter(o => o === player.id)?.length).toString(),
                rab: (player?.outcome.map(o => o.atBatResult).reduce((total, res) => {
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
            one: (payload.scores.away?.runs?.[1] ?? 0).toString(),
            two: (payload.scores.away?.runs?.[2] ?? 0).toString(),
            three: (payload.scores.away?.runs?.[3] ?? 0).toString(),
            four: (payload.scores.away?.runs?.[4] ?? 0).toString(),
            five: (payload.scores.away?.runs?.[5] ?? 0).toString(),
            six: (payload.scores.away?.runs?.[6] ?? 0).toString(),
            seven: (payload.scores.away?.runs?.[7] ?? 0).toString(),
            eight: (payload.scores.away?.runs?.[8] ?? 0).toString(),
            nine: (payload.scores.away?.runs?.[9] ?? 0).toString(),
            r: (payload.scores.away?.runs?.[0] ?? 0).toString(),
            h: (payload.scores.away?.hits ?? 0).toString(),
            e: (payload.scores.away?.errors ?? 0).toString(),
            estwo: (payload.scores.away?.estwo?? 0).toString(),
            outcome: [
                payload.scores.away?.runs?.[0] > payload.scores.home?.runs?.[0]
                ? "win"
                : "loss"
            ]
        }
        results[payload.teams.home.id] = {
            one: (payload.scores.home?.runs?.[1] ?? 0).toString(),
            two: (payload.scores.home?.runs?.[2] ?? 0).toString(),
            three: (payload.scores.home?.runs?.[3] ?? 0).toString(),
            four: (payload.scores.home?.runs?.[4] ?? 0).toString(),
            five: (payload.scores.home?.runs?.[5] ?? 0).toString(),
            six: (payload.scores.home?.runs?.[6] ?? 0).toString(),
            seven: (payload.scores.home?.runs?.[7] ?? 0).toString(),
            eight: (payload.scores.home?.runs?.[8] ?? 0).toString(),
            nine: (payload.scores.home?.runs?.[9] ?? 0).toString(),
            r: (payload.scores.home?.runs?.[0] ?? 0).toString(),
            h: (payload.scores.home?.hits ?? 0).toString(),
            e: (payload.scores.home?.errors ?? 0).toString(),
            estwo: (payload.scores.home?.estwo?? 0).toString(),
            outcome: [
                payload.scores.away?.runs?.[0] < payload.scores.home?.runs?.[0]
                    ? "win"
                    : "loss"
            ]
        }
        return results
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
                runs: [],
                hits: 0,
                errors: 0,
                estwo: 1
            },
            home: {
                runs: [],
                hits: 0,
                errors: 0,
                estwo: 1
            },
        }
        payload.players.away.forEach(player => {
            player.outcome.forEach((outcome,index)=> {
                score.away.hits += (this.isConsideredHit(outcome.atBatResult) ? 1:0)
                score.away.errors += (outcome.atBatResult ==="E" ? 1:0)
                score.away.runs[index] = score.away.runs?.[index] ? score.away.runs[index] : 0
                if(index !== 0) {
                    score.away.runs[index] += outcome?.onBasePosition === "point" ? 1 : 0
                }
            })
        })
        score.away.runs[0] = score.away.runs.reduce((total,current) => {
            return total + current
        })
        payload.players.home.forEach(player => {
            player.outcome.forEach((outcome,index)=> {
                score.home.hits += (this.isConsideredHit(outcome.atBatResult) ? 1:0)
                score.home.errors += (outcome.atBatResult ==="E" ? 1:0)
                score.home.runs[index] = score.home.runs?.[index] ? score.home.runs[index] : 0
                if(index !== 0) {
                    score.home.runs[index] += outcome?.onBasePosition === "point" ? 1 : 0
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


