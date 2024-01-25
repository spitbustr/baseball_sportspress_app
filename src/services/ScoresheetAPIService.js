import axios from "axios"
import $settings from "@/data/settings.json"

export default class ScoresheetAPIService {

  static async saveData(payload) {
    let response = ""
    let exists = null
    await axios.get(`${$settings.scoresheetAPI.url}/getByGameId.php?gameId=${payload.gameId}`)
    .then(result => {
        exists = result.data
    })
    .catch(error => {})

    let obj = {
        gameId: payload.gameId,
        jsonObject: JSON.parse(JSON.stringify(payload)),
        id: exists?.id ?? ""
    }

    if (exists) {
        await axios.post(`${$settings.scoresheetAPI.url}/update.php`, obj).then(result => {
            response = result
        })
    } else {

        await axios.post(`${$settings.scoresheetAPI.url}/add.php`, obj).then(result => {
            response = result
        })
    }
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
}