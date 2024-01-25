import axios from "axios"
import $settings from "@/data/settings.json"

export default class DataService {

  static async getCalendar() {
    const list = []
    await axios.get(`${$settings.websiteConfig.baseUrl}${$settings.api.calendars}?slug=${$settings.websiteConfig.currentSeasonSlug}`)
    .then(l1 => {
        list.push(l1.data)
    })
    return list.flat()
  }
  static async getAllGames() {
    const list = []
    await axios.get(`${$settings.websiteConfig.baseUrl}${$settings.api.events}?per_page=100&${$settings.websiteConfig.season}`)
    .then(l1 => {
        list.push(l1.data)
    })
    return list.flat()
  }
  static async getAllTeams() {
    const list = []
    await axios.get(`${$settings.websiteConfig.baseUrl}${$settings.api.teams}?per_page=20`)
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
      await axios.get(`${$settings.websiteConfig.baseUrl}${$settings.api.players}?per_page=100&page=${pageIndex}`)
      .then(result => {
          list.push(result.data)
          lastAmount = result.data.length
          pageIndex++
      })
    }
    return list.flat()
  }
}
