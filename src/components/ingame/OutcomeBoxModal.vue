<template>
  <div class="selected-outcome-box">
    <div class="container">
      <div class="row">
        <div class="col-3">
          <h6>
            Résultat
          </h6>
          <div class="btn-group-vertical">
            <button v-for="hit in hits" :key="hit.value" @click="setOutcome(hit.value)"
              :class="{ 'active': isActive(hit.value) }" type="button" class="btn btn-outline-primary">
              {{ hit.name }}
            </button>
          </div>
        </div>
        <div class="col-9">
          <div class="container">
            <div class="row">
              <h6>
                Actions
              </h6>
              <div class="btn-group">
                <button :disabled="!hasHit" :class="{'active': activePlayerBox?.inningEnd}" @click="setInningEnd()"
                  type="button" class="btn btn-outline-primary">Inning
                  End</button>
                <button :disabled="!hasHit" :class="{'active': activePlayerBox?.putOut}" @click="setPutOut()"
                  type="button" class="btn btn-outline-primary">Out</button>
                <button :disabled="!hasHit" :class="{'active': activePlayerBox?.countAsHR}" @click="setCountAsHr()"
                  type="button" class="btn btn-outline-primary">Count
                  as
                  HR</button>
              </div>
            </div>

            <div class="row">
              <div class="col-12">
                <div class="d-flex justify-content-center mt-5 mb-5">
                  <button :disabled="!hasHit" :class="{'btn-warning': playerAt('second')}" @click="setAtBase('second')"
                    class="base second-base btn btn-outline-warning"><span>2</span></button>
                </div>
                <div class="d-flex justify-content-between my-5">
                  <button :disabled="!hasHit" :class="{ 'btn-warning': playerAt('third') }" @click="setAtBase('third')"
                    class="base third-base btn btn-outline-warning"><span>3</span></button>
                  <div :class="[{ 'out': activePlayerBox?.putOut }]" class="outcome-rbi-out">{{ activePlayerBox?.putOut
                    ?
                    "O" :
                    rbiPlayer(activePlayerBox?.rbiBy) ?? "" }}<span v-if="activePlayerBox?.countAsHR">*</span>
                  </div>

                  <button :disabled="!hasHit" :class="{ 'btn-warning': playerAt('first') }" @click="setAtBase('first')"
                    class="base first-base btn btn-outline-warning"><span>1</span></button>
                </div>
                <div class="d-flex justify-content-center mt-5 mb-5">
                  <button :disabled="!hasHit" :class="{'btn-warning': playerAt('point')}" @click="setAtBase('point')"
                    class="base home-plate btn btn-outline-warning"><span>H</span></button>
                </div>
              </div>
            </div>


          </div>
          <div v-if="activePlayerBox?.onBasePosition === 'point'">
            <select class="rbi-button form-select" v-model="activePlayerBox.rbiBy">
              <option :value="null">NO RBI</option>
              <option v-for="player in players" :value="player.id" :key="player.id"><span v-html="player.name"></span>
              </option>
            </select>
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
 /* button {

    &.active {
      background: lightgreen;
    }
  }
  */
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
    height:2.5rem;
    width:2.5rem;
    text-align: center;
    line-height: 2px;
    font-weight: bold;
    rotate: 45deg;
    color:#000;
    cursor: pointer;
    &.active {
      background: lightgreen;
    }
    span {
      display: block;
      rotate:-45deg;
    }
  }

  .third-base {
    top: 7rem;
    left: 0;
  }

  .second-base {
    top: 1.25rem;
    left: 5.25rem;
  }

  .first-base {
    top: 7rem;
    left: 10.5rem;
  }

  .home-plate {
    top: 12.75rem;
    left: 5.25rem;
  }
  .outcome-rbi-out {

    font-weight: bold;
    font-size: 2rem;
    text-align: center;
    &.out {
      color: red;
    }
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