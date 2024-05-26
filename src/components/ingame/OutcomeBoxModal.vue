<template>
  <div class="selected-outcome-box">
    <div>
      <div>
        HIT
      </div>
      <div class="button-grid">
        <div v-for="hit in hits" :key="hit.value" class="grid-item">
          <button @click="setOutcome(hit.value)" :class="{ 'active': isActive(hit.value) }">
            {{ hit.name }}
          </button>
        </div>
      </div>

    </div>
    <div>
      <div>
        <div>
          Actions
        </div>
        <div>
          <button :disabled="!hasHit" :class="{'active': activePlayerBox?.inningEnd}" @click="setInningEnd()">Inning End</button>
          <button :disabled="!hasHit" :class="{'active': activePlayerBox?.putOut}" @click="setPutOut()">Out</button>
          <button :disabled="!hasHit" :class="{'active': activePlayerBox?.countAsHR}" @click="setCountAsHr()">Count as HR</button>
        </div>
      </div>
      <div>
        <div>
          <div class="baseball-field">
            <button :disabled="!hasHit" :class="{'active': playerAt('third')}" @click="setAtBase('third')" class="base third-base">3</button>
            <button :disabled="!hasHit" :class="{'active': playerAt('second')}" @click="setAtBase('second')" class="base second-base">2</button>
            <button :disabled="!hasHit" :class="{'active': playerAt('first')}"  @click="setAtBase('first')" class="base first-base">1</button>
            <button :disabled="!hasHit" :class="{'active': playerAt('point')}" @click="setAtBase('point')" class="base home-plate">H</button>
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
import OutcomeMixin from "@/mixins/OutcomeMixin"

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
    hasHit() {
      return !!this.activePlayerBox?.atBatResult
    },
  },
  methods: {
    isActive(value) {
      return this.activePlayerBox?.atBatResult === value
    },



    setRBI(rbi) {
      this.activePlayerBox = clone(this.selectedOutcomeBox)
      if (this.activePlayerBox && !this.editMode) {
        this.activePlayerBox.rbiBy = rbi
        this.updateData()
      }
    },

    updateData() {
      this.$emit("updateOutcome",this.activePlayerBox)
    },
    rbiPlayer(id) {
      return this.players?.find(p => p.id === id)?.assignedNumber
    },

  },
  props: {
    selectedOutcomeBox: Object,
    isOutcomeModalVisible: Boolean,
    activePlayer: Object,
    players: Array,
  },
  mixins: [
    OutcomeMixin,
  ],
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
  .button-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px; /* Space between grid items */
  }

  .grid-item {
    display: flex;
    justify-content: center;
    align-items: center;
  }


</style>