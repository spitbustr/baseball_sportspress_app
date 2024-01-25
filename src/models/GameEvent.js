import {clone} from "@/scripts/utilities"
import $settings from "@/data/settings.json"


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
export class GameEvent {
    constructor(properties) {
        Object.assign(this, clone(defaultGameEvent), clone(properties))
    }
}

export class Performance {
    constructor(properties) {
        Object.assign(this, clone(defaultGameEvent), clone(properties))
    }
}
