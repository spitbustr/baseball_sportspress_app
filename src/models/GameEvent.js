import {clone} from "@/scripts/utilities"
import $settings from "@/data/settings.json"

const defaultTableResults = {
    "0": {
        one: "1",
        two: "2",
        three: "3",
        four: "4",
        five: "5",
        six: "6",
        seven: "7",
        r: "R",
        h: "H",
        e: "E",
        estwo: "ES"
    }
}
const defaultTablePerformances = {
    "0": {
        ab: "",
        oneb: "",
        twob: "",
        threeb: "",
        cc: "",
        cs: "",
        p: "",
        pp: "",
        rab: ""
    },
}
const defaultGameEvent = {

    // "teams" example
    // [12, 15]
    // Away team, Home team
    teams: [],
    // final score ["4","2"]
    main_results: [],
    // win loss {"405": "win", 566: "loss"}
    outcome: {},
    // winner : 405
    winner: null,
    // "players" example
    // [0 , 1, 2, 3 , 4 , 0 , 1, 2, 3,... ]
    // Add 0 to seperate away and home players
    players: [],
    // "results" example
    // {[team_id] : {[stats]}}
    results: {
        // "406": {
        //     one: "5",
        //     two: "0",
        //     three: "2",
        //     four: "1",
        //     five: "2",
        //     six: "0",
        //     seven: "0",
        //     r: "10",
        //     h: "19",
        //     e: "2",
        //     estwo: "1",
        //     outcome: [
        //         "loss"
        //     ]
        // },
        // "355": {
        //     one: "5",
        //     two: "2",
        //     three: "2",
        //     four: "5",
        //     five: "5",
        //     six: "0",
        //     seven: "",
        //     r: "19",
        //     h: "26",
        //     e: "1",
        //     estwo: "1",
        //     outcome: [
        //         "win"
        //     ]
        // },
        // "0": {
        //     one: "1",
        //     two: "2",
        //     three: "3",
        //     four: "4",
        //     five: "5",
        //     six: "6",
        //     seven: "7",
        //     r: "R",
        //     h: "H",
        //     e: "E",
        //     estwo: "ES"
        // }
    },
    // "performance" example
    // {[player_id] : {[stats]}}
    performance: {
        // "406": {
        //     "0": {
        //         ab: "",
        //         oneb: "",
        //         twob: "",
        //         threeb: "",
        //         cc: "",
        //         cs: "",
        //         p: "",
        //         pp: "",
        //         rab: ""
        //     },
        //     "409": {
        //         number: "",
        //         ab: "4",
        //         oneb: "1",
        //         twob: "2",
        //         threeb: "",
        //         cc: "1",
        //         cs: "4",
        //         p: "2",
        //         pp: "1",
        //         rab: "",
        //         status: "lineup",
        //         sub: "0",
        //         position: 0
        //     },...
        // },
        // "296": {
        //     "0": {
        //         ab: "",
        //         oneb: "",
        //         twob: "",
        //         threeb: "",
        //         cc: "",
        //         cs: "",
        //         p: "",
        //         pp: "",
        //         rab: ""
        //     },
        //     "256": {
        //         number: "",
        //         ab: "4",
        //         oneb: "1",
        //         twob: "2",
        //         threeb: "",
        //         cc: "1",
        //         cs: "4",
        //         p: "2",
        //         pp: "1",
        //         rab: "",
        //         status: "lineup",
        //         sub: "0",
        //         position: 0
        //     },...
        // },
    },
}
export default class GameEvent {
    constructor(properties) {
        Object.assign(this, clone(defaultGameEvent), clone(properties))
    }

    prepareData(payload) {
        this.teams = [payload.teams.away.id, payload.teams.away.id]
        this.performance = this.generatePerformanceData(payload)
        this.results = this.generateResultsData(payload)
        this.players = this.generatePlayersData(payload)
        this.main_results =  [payload.scores.away.runs[0],payload.scores.home.runs[0]],
        this.outcome = this.generateOutcome(payload),
        this.winner =  this.generateWinner(payload)
    }
    generatePerformanceData(payload) {
        const performance = []
    }
    generateResultsData(payload) {

        let results = {}
        results[`"${payload.teams.away.id}"`] = {
            one: payload.scores.away?.runs?.[1],
            two: payload.scores.away?.runs?.[2],
            three: payload.scores.away?.runs?.[3],
            four: payload.scores.away?.runs?.[4],
            five: payload.scores.away?.runs?.[5],
            six: payload.scores.away?.runs?.[6],
            seven: payload.scores.away?.runs?.[7],
            eight: payload.scores.away?.runs?.[8],
            nine: payload.scores.away?.runs?.[9],
            ten: payload.scores.away?.runs?.[10],
            r: payload.scores.away?.runs?.[0],
            h: payload.scores.away?.hits,
            e: payload.scores.away?.errors,
            estwo: payload.scores.away?.estwo,
            outcome: [
                payload.scores.away?.outcome
            ]
        }
        results[`"${payload.teams.home.id}"`] = {
            one: payload.scores.home?.runs?.[1],
            two: payload.scores.home?.runs?.[2],
            three: payload.scores.home?.runs?.[3],
            four: payload.scores.home?.runs?.[4],
            five: payload.scores.home?.runs?.[5],
            six: payload.scores.home?.runs?.[6],
            seven: payload.scores.home.runs?.[7],
            eight: payload.scores.home?.runs?.[8],
            nine: payload.scores.home?.runs?.[9],
            ten: payload.scores.home?.runs?.[10],
            r: payload.scores.home?.runs?.[0],
            h: payload.scores.home?.hits,
            e: payload.scores.home?.errors,
            estwo: payload.scores.home?.estwo,
            outcome: [
                payload.scores.home?.outcome
            ]
        }
        results["0"] = defaultTableResults
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
            },
            home: {
                runs: [],
            },
        }
        payload.players.away.forEach(player => {
            player.outcome.forEach((outcome,index)=> {
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
}


