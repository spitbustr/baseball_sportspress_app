<script>
import $settings from "@/data/settings.json"
import { clone } from "@/scripts/utilities"
export default {
  data() {
    return { 
      openRbiModal: false,
    }
  },
  methods: {
    playerAt(position) {
      if(this.activePlayerBox?.onBasePosition === "first" ) {
        if(position === "first") {
          return true
        }
      }
      if(this.activePlayerBox?.onBasePosition === "second" ) {
        if(position === "first" || position === "second") {
          return true
        }
      }
      if(this.activePlayerBox?.onBasePosition === "third" ) {
        if(position === "first" || position === "second" || position === "third") {
          return true
        }
      }
      if(this.activePlayerBox?.onBasePosition === "point" ) {
        if(position === "first" || position === "second" || position === "third" || position === "point") {
          return true
        }
      }
      return false
    },
    setAtBase(base) {
      if (this.activePlayerBox && !this.editMode) {
        if (this.activePlayerBox.onBasePosition === base) {
          this.activePlayerBox.onBasePosition = null
          this.activePlayerBox.rbiBy = null
        }
        else {
          this.activePlayerBox.onBasePosition = base
          if(this.activePlayerBox.onBasePosition !== "point")
            this.activePlayerBox.rbiBy = null
        }
        this.updateData()
      }

    },
    setOutcome(outcome) {
      if (this.activePlayerBox && !this.editMode) {
        if (this.activePlayerBox.atBatResult === outcome) {
          this.activePlayerBox.onBasePosition = null
          this.activePlayerBox.atBatResult = null
          this.activePlayerBox.putOut = false
          this.activePlayerBox.countAsHR = false
          this.activePlayerBox.rbiBy = null
        }
        else {
          this.activePlayerBox.atBatResult = outcome
          switch (outcome) {
            case "outAB":
            case "o":
            case "-":
              this.activePlayerBox.onBasePosition = null
              this.activePlayerBox.rbiBy = null
              this.activePlayerBox.countAsHR = false
              this.activePlayerBox.putOut = true
              break
            case "1B":
              this.activePlayerBox.onBasePosition = "first"
              this.activePlayerBox.rbiBy = null
              this.activePlayerBox.countAsHR = false
              this.activePlayerBox.putOut = false
              break
            case "2B":
              this.activePlayerBox.onBasePosition = "second"
              this.activePlayerBox.rbiBy = null
              this.activePlayerBox.countAsHR = false
              this.activePlayerBox.putOut = false
              break
            case "3B":
              this.activePlayerBox.onBasePosition = "third"
              this.activePlayerBox.rbiBy = null
              this.activePlayerBox.countAsHR = false
              this.activePlayerBox.putOut = false
              break
            case "4B":
              this.activePlayerBox.onBasePosition = "point"
              this.activePlayerBox.rbiBy = this.activePlayer?.id || this.currentActivePlayer?.id
              this.activePlayerBox.countAsHR = false
              this.activePlayerBox.putOut = false
              break
            case "HR":
              this.activePlayerBox.onBasePosition = "point"
              this.activePlayerBox.rbiBy = this.activePlayer?.id || this.currentActivePlayer?.id
              this.activePlayerBox.countAsHR = true
              this.activePlayerBox.putOut = false
              break
            case "BB":
              this.activePlayerBox.onBasePosition = "first"
              this.activePlayerBox.rbiBy = null
              this.activePlayerBox.countAsHR = false
              this.activePlayerBox.putOut = false
              break
            case "HBP":
              this.activePlayerBox.onBasePosition = "first"
              this.activePlayerBox.rbiBy = null
              this.activePlayerBox.countAsHR = false
              this.activePlayerBox.putOut = false
              break
            case "K":
              this.activePlayerBox.onBasePosition = null
              this.activePlayerBox.rbiBy = null
              this.activePlayerBox.countAsHR = false
              this.activePlayerBox.putOut = true
              break
            case "FC":
              this.activePlayerBox.onBasePosition = "first"
              this.activePlayerBox.rbiBy = null
              this.activePlayerBox.countAsHR = false
              this.activePlayerBox.putOut = false
              break
            case "E":
              this.activePlayerBox.onBasePosition = "first"
              this.activePlayerBox.rbiBy = null
              this.activePlayerBox.countAsHR = false
              this.activePlayerBox.putOut = false
              break
            case "SAC":
              this.activePlayerBox.onBasePosition = null
              this.activePlayerBox.rbiBy = null
              this.activePlayerBox.countAsHR = false
              this.activePlayerBox.putOut = true
              break
          }
        }
        this.updateData()
      }
    },
    setPutOut() {
      if (this.activePlayerBox && !this.editMode) {
        this.activePlayerBox.putOut = !this.activePlayerBox.putOut
        this.updateData()
      }
    },
    setInningEnd() {
      if (this.activePlayerBox && !this.editMode) {
        this.activePlayerBox.inningEnd = !this.activePlayerBox.inningEnd
        this.updateData()
      }
    },
    setCountAsHr() {
      if (this.activePlayerBox && !this.editMode) {
        this.activePlayerBox.countAsHR = !this.activePlayerBox?.countAsHR
        this.updateData()
      }
    },
  },
}
</script>