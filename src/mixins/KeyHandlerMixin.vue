<script>
import $settings from "@/data/settings.json"
import { clone } from "@/scripts/utilities"
export default {
  methods: {
    handleShortcutKeys(event) {
      if(this.activePlayer) {

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
        if(event.key === "x") {
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
        if(event.key === "Escape") {
          this.events.$emit("escapePressed")
        }
        if(event.key === "Enter") {
          this.events.$emit("enterPressed")
        }

        // Advance player
        if(event.keyCode === 32) {
          this.events.$emit("advancePlayer")
        }
        if(event.key === "Backspace" ) {
          this.events.$emit("returnPlayer")
        }

      }

    },
  },

}
</script>