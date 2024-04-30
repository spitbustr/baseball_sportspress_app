import axios from "axios"
import $settings from "@/data/settings.json"
const configUrl = "/api/config/config.ini"


export default class SportspressAPIService {
  static async loadConfig() {
    const ini = require('ini')
    const response = await axios.get(configUrl)
    const configData = ini.parse(response.data)
    return configData;
  }
  static async getCalendar() {
    const list = []
    await axios.get(`${$settings.playballConfig.baseUrl}${$settings.sportspressApi.calendars}`)
    .then(l1 => {
        list.push(l1.data)
    })
    return list.flat()
  }
  static async getAllGames() {
    const list = []
    await axios.get(`${$settings.playballConfig.baseUrl}${$settings.sportspressApi.events}?per_page=100&seasons=${$settings.playballConfig.season}`)
    .then(l1 => {
        list.push(l1.data)
    })
    return list.flat()
  }
  static async getAllTeams() {
    const list = []
    await axios.get(`${$settings.playballConfig.baseUrl}${$settings.sportspressApi.teams}?per_page=100`)
    .then(l1 => {
        list.push(l1.data)
    })
    return list.flat()
  }
  static async getAllPlayers() {
    const list = []
    let lastAmount = 100
    let pageIndex = 1
    while(lastAmount === 100) {
      await axios.get(`${$settings.playballConfig.baseUrl}${$settings.sportspressApi.players}?per_page=100&page=${pageIndex}`)
      .then(result => {
          list.push(result.data)
          lastAmount = result.data.length
          pageIndex++
      })
    }
    return list.flat()
  }
  static async sendData(payload) {
    let token = null
    await this.loadConfig().then(result => {
      token = result.API_token.api_token
    })
    const headers = {
      "Authorization": `Basic ${token}`,
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    }
    await axios.post(`${$settings.playballConfig.baseUrl}${$settings.sportspressApi.events}/${payload.id}`,payload, {headers})
      .then(res => {
          console.log(res)
      })
  }
  static async addPlayer(playerInfo) {
    const list = []
    await axios.get(`${$settings.playballConfig.baseUrl}${$settings.sportspressApi.players}?${playerInfo}`)
      .then(l1 => {
        list.push(l1.data)
      })
      return list.flat()
  }
}
