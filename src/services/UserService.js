import axios from "axios"
import $settings from "@/data/settings.json"
const configUrl = "https://app.lbaoutaouais.com/api/config/config.ini"

export default class UserService {

  static async loginCheck(payload) {
    const headers = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    }
    if(payload?.secret) {
      let response = null
      const data = JSON.stringify(payload)
      await axios.post(`${$settings.scoresheetAPI.url}/loginCheck.php`, data).then(result => {
        response = result
      }).catch(error => {
        response = error
      })
      return response
    }
    return null

  }
  static async loginUser(payload) {
    let response = null
    await axios.post(`${$settings.scoresheetAPI.url}/loginUser.php`, payload).then(result => {
      response = result
    }).catch(error => {
      response = error
    })
    return response
  }
}
