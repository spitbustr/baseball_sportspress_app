<template>
  <div class="selected-outcome-box">
    <div>
      <div>
        HIT
      </div>
      <div v-for="hit in hits" :key="hit.value">
        <button @click="setOutcome(hit.value)" :class="{'active':isActive(hit.value)}">{{ hit.name }}</button>
      </div>
    </div>
    <div>
      <div>
        <div>
          Actions
        </div>
        <div>
          <button :class="{'active': activePlayerBox?.inningEnd}" @click="setInningEnd()">Inning End</button>
          <button :class="{'active': activePlayerBox?.putOut}" @click="setPutOut()">Out</button>
          <button :class="{'active': activePlayerBox?.countAsHR}" @click="activePlayerBox.countAsHR = !activePlayerBox?.countAsHR">Count as HR</button>
        </div>
      </div>
      <div>
        <div>
          <div class="baseball-field">
            <button :class="{'active': playerAt('third')}" @click="setAtBase('third')" class="base third-base">3</button>
            <button :class="{'active': playerAt('second')}" @click="setAtBase('second')" class="base second-base">2</button>
            <button :class="{'active': playerAt('first')}"  @click="setAtBase('first')" class="base first-base">1</button>
            <button :class="{'active': playerAt('point')}" @click="setAtBase('point')" class="base home-plate">H</button>
            <div :class="[{'out': activePlayerBox?.putOut }]" class="outcome-rbi-out">{{ activePlayerBox?.putOut ? "O": rbiPlayer(activePlayerBox?.rbiBy) ?? "" }}</div>
            <div v-if=" activePlayerBox?.onBasePosition === 'point'">
              <select class="rbi-button" v-model="activePlayerBox.rbiBy">
                <option :value="null">NO RBI</option>
                <option v-for="player in players" :value="player.id" :key="player.id">{{ player.name }}</option>
              </select>
            </div>
            <div v-if=" activePlayerBox?.countAsHR">
              <div class="count-as-hr">*</div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
import $settings from "@/data/settings.json"
import { clone } from "@/scripts/utilities"
export default {
  data() {
    return {
      hits: $settings.stats.hits.filter(i => !i?.ignore),
      bases: $settings.stats.bases,
      actions: $settings.stats.actions.filter(i => !i?.ignore),
      activePlayerBox: null,
      rbiValue: null
    }
  },
  computed: {
  },
  methods: {
    isActive(value) {
      return this.activePlayerBox?.atBatResult === value
    },

    setAtBase(base) {
      this.activePlayerBox = clone(this.selectedOutcomeBox)
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
      this.activePlayerBox = clone(this.selectedOutcomeBox)
      if (this.activePlayerBox && !this.editMode) {
        if (this.activePlayerBox.atBatResult === outcome) {
          this.activePlayerBox.atBatResult = null
          this.activePlayerBox.putOut = false
          this.activePlayerBox.countAsHR = false
        }
        else {
          this.activePlayerBox.atBatResult = outcome
          switch (outcome) {
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
              this.activePlayerBox.rbiBy = this.activePlayer?.id
              this.activePlayerBox.countAsHR = false
              this.activePlayerBox.putOut = false
              break
            case "HR":
              this.activePlayerBox.onBasePosition = "point"
              this.activePlayerBox.rbiBy = this.activePlayer?.id
              this.activePlayerBox.countAsHR = true
              this.activePlayerBox.putOut = false
              break
            case "BB":
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
      this.activePlayerBox = clone(this.selectedOutcomeBox)
      if (this.activePlayerBox && !this.editMode) {
        this.activePlayerBox.putOut = !this.activePlayerBox.putOut
        this.updateData()
      }
    },
    setRBI(rbi) {
      this.activePlayerBox = clone(this.selectedOutcomeBox)
      if (this.activePlayerBox && !this.editMode) {
        this.activePlayerBox.rbiBy = rbi
        this.updateData()
      }
    },
    setInningEnd() {
      this.activePlayerBox = clone(this.selectedOutcomeBox)
      if (this.activePlayerBox && !this.editMode) {
        this.activePlayerBox.inningEnd = !this.activePlayerBox.inningEnd
        this.updateData()
      }
    },

    updateData(propety,value) {
      this.activePlayerBox[propety] = value
      this.$emit("updateOutcome",this.activePlayerBox)
    },
    rbiPlayer(id) {
      return this.players?.find(p => p.id === id)?.assignedNumber
    },
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
    }
  },
  props: {
    selectedOutcomeBox: Object,
    isOutcomeModalVisible: Boolean,
    activePlayer: Object,
    players: Array,
  },
  watch: {
    isOutcomeModalVisible(value) {
      this.activePlayerBox = this.selectedOutcomeBox
    }
  }
}
</script>
<style lang="scss" scoped>
  .selected-outcome-box {
    display: flex;
    flex-direction: row;
  }
  button {
    min-width: 5rem;
    padding: 1rem;
    &.active {
      background: lightgreen;
    }
  }
  .baseball-field {
    position: relative;
    left: 1rem;
    top: 1rem;
    width: auto;
    height: auto;
    background-size: cover;
    padding: 1rem;
  }

  .base {
    position: absolute;
    border-radius: 50%;
    text-align: center;
    line-height: 2px;
    font-weight: bold;
    cursor: pointer;
    &.active {
      background: lightgreen;
    }
  }

  .third-base {
    top: 5.25rem;
    left: 0;
  }

  .second-base {
    top: 1.25rem;
    left: 5.25rem;
  }

  .first-base {
    top: 5.25rem;
    left: 10.5rem;
  }

  .home-plate {
    top: 9.25rem;
    left: 5.25rem;
  }
  .outcome-rbi-out {
    position: absolute;
    top: 5.5rem;
    left: 5rem;
    font-weight: bold;
    font-size: 2rem;
    text-align: center;
    width: 5.5rem;
    &.out {
      color: red;
    }
  }
  .rbi-button {
    position: absolute;
    top: 12.5rem;
    left: 1rem;
    padding: 0.5rem 0.25rem;
  }
  .count-as-hr {
    font-size: 6rem;
    position: absolute;
    top: 1.5rem;
    left: 1rem;
    line-height: 1rem;
  }

</style>