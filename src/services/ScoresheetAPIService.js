import axios from "axios"
import { clone } from "@/scripts/utilities"
import $settings from "@/data/settings.json"

export default class ScoresheetAPIService {
    static async checkData(gameId) {
        let response = ""
        await axios.get(`${$settings.scoresheetAPI.url}/getByGameId.php?gameId=${gameId}`)
        .then(result => {
            response = result
        })
        .catch(error => { })
        return response
    }
    static async createData(payload) {
        let response = ""
        let obj = {
            gameId: payload.gameId,
            jsonObject: this.shirinkObject(payload),
            seasonId: payload.seasonId,
        }
        await axios.post(`${$settings.scoresheetAPI.url}/add.php`, obj).then(result => {
            response = result
        }).catch(error => { })
        return response
    }
    static async saveData(payload) {
        let response = ""
        let obj = {
            gameId: payload.gameId,
            jsonObject: this.shirinkObject(payload),
            id: payload.id,
            seasonId: payload.seasonId,
        }
        await axios.post(`${$settings.scoresheetAPI.url}/update.php`, obj).then(result => {
            response = result
        }).catch(error => { })
        return response
    }
    static async loadData(gameId) {
        let response = ""
        await axios.get(`${$settings.scoresheetAPI.url}/getByGameId.php?gameId=${gameId}`)
            .then(result => {
                response = result.data
            })
            .catch(error => {
                response = error
            })
        return response
    }
    static shirinkObject(obj) {
        const payload = JSON.parse(JSON.stringify(obj))
        const teamHome = clone(payload.teams.home.id)
        const teamAway = clone(payload.teams.away.id)
        payload.teams = {
            home: teamHome,
            away: teamAway,
        }
        payload.players.home = payload.players.home.map(p => {
            return {
                id: p.id,
                outcome: p.outcome,
                assignedNumber: p.assignedNumber,
                featured_media: p.featured_media,
                number: p.number,
                probably: p.probably,
                title: {
                    rendered: p?.title?.rendered
                },
                team: teamHome,
            }
        })
        payload.players.away = payload.players.away.map(p => {
            return {
                id: p.id,
                outcome: p.outcome,
                assignedNumber: p.assignedNumber,
                featured_media: p?.featured_media,
                number: p.number,
                probably: p.probably,
                title: {
                    rendered: p?.title?.rendered
                },
                team: teamHome,
            }
        })
        return payload
    }
}