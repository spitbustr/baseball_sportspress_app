<script>
import $settings from "@/data/settings.json"
import { clone } from "@/scripts/utilities"

export default {
  methods: {
    handleShortcutKeys(event, activePlayer, modalOpened) {
      if(modalOpened) {
       /* if(event.keyCode === 32) {
          event.preventDefault()
        }
          */
        if(event.key === "Escape") {
          this.events.$emit("escapePressed")
        }
        if(event.key === "Enter") {
          this.events.$emit("enterPressed")
        }
      }
      else{
        if(activePlayer) {
          // HITS
          if(event.key === "1") {
            this.setOutcome("1B")
          }
          if(event.key === "2") {
            this.setOutcome("2B")
          }
          if(event.key === "3") {
            this.setOutcome("3B")
          }
          if(event.key === "4") {
            this.setOutcome("HR")
          }
          if(event.key === "0" || event.key === "x" ||  event.key === "r") {
            this.setOutcome("outAB")
          }
          if(event.key === "k") {
            this.setOutcome("K")
          }
          if(event.key === "e") {
            this.setOutcome("E")
          }
          if(event.key === "f") {
            this.setOutcome("FC")
          }

          // ACTIONS
          if(event.key === "o") {
            this.setPutOut()
          }
          if(event.key === "i") {
            this.setInningEnd()
          }
          if(event.key === "h") {
            this.setCountAsHr()
          }


          // Advance player
          if(event.keyCode === 32) {
            event.preventDefault()
            this.events.$emit("advancePlayer")
          }
          if(event.key === "Backspace" ) {
            this.events.$emit("returnPlayer")
          }

          // Move through box
          if(event.key === "ArrowDown" ) {
            this.events.$emit("move", "down")
          }
          if(event.key === "ArrowUp" ) {
            this.events.$emit("move", "up")
          }
          if(event.key === "ArrowLeft" ) {
            this.events.$emit("move", "left")
          }
          if(event.key === "ArrowRight" ) {
            this.events.$emit("move", "right")
          }
        }

      }
      
    },
  },

}
</script>