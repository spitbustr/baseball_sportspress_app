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
    await axios.get(`${$settings.websiteConfig.baseUrl}${$settings.api.players}?per_page=100&page=1`)
    .then(l1 => {
        list.push(l1.data)
    })
    await axios.get(`${$settings.websiteConfig.baseUrl}${$settings.api.players}?per_page=100&page=2`)
    .then(l2 => {
        list.push(l2.data)
    })
    await axios.get(`${$settings.websiteConfig.baseUrl}${$settings.api.players}?per_page=100&page=3`)
    .then(l3 => {
        list.push(l3.data)
    })
    await axios.get(`${$settings.websiteConfig.baseUrl}${$settings.api.players}?per_page=100&page=4`)
    .then(l4 => {
        list.push(l4.data)
    })
    await axios.get(`${$settings.websiteConfig.baseUrl}${$settings.api.players}?per_page=100&page=5`)
    .then(l5 => {
        list.push(l5.data)
    })
    return list.flat()
  }
}
