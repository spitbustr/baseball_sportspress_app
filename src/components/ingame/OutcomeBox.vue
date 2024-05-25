<template>
  <div class="box">
    <div v-if="countAsHR" class="field-countHR" >
      <div >
        *
      </div>
    </div>
    <div class="field-onbase" :class="{ 'isPutOut': isPutOut }">
      <img :src="fieldImage" />
    </div>
    <div class="center-field out-result" v-if="isPutOut">
      O
    </div>
    <div class="center-field rbi-result" v-if="rbiResult && !isPutOut">
      {{ rbiPlayer }}
    </div>
    <div v-if="atBatOutcome" class="outcome-result">
      {{ getFieldSymbol(atBatOutcome) }}
    </div>
    <div class="inning-end" v-if="inningEnd">
      <img :src="inningEndImage" />
    </div>
  </div>
</template>
<script>

import $settings from "@/data/settings.json"
export default {
  computed: {
    fieldImage() {
      return require(`@/assets/images/field/field-${this.outcome?.onBasePosition || 'empty'}.png`)
    },
    atBatOutcome() {
      return this.outcome?.atBatResult || ""
    },
    countAsHR() {
      return this.outcome?.countAsHR || false
    },
    rbiPlayer() {
      return this.players?.find(p => p.id === this.outcome?.rbiBy)?.assignedNumber
    },
    rbiResult() {
      return this.outcome?.rbiBy || ""
    },
    isPutOut() {
      return this.outcome?.putOut || ""
    },
    inningEndImage() {
      return require(`@/assets/images/field/inning-end.png`)
    },
    inningEnd() {
      return this.outcome?.inningEnd
    },

  },
  methods: {
    getFieldSymbol(value) {
      console.log($settings.stats.hits)
      const hit = $settings.stats.hits.find(h => h.value === value)
      return hit?.symbol || hit.value
    }
  },
  props: {
    outcome: Object,
    players: Array,
  },
}
</script>
<style lang="scss" scoped>
.box {
  position: relative;
  .outcome-result {
    position: absolute;
    font-size: 12px;
    right: -1px;
    bottom: -6px;
  }

  .center-field {
    position: absolute;
    font-weight: bold;
    font-size: 12px;
    top: 10px;
    left: 0;
    right: 0;
    margin: auto;

    &.rbi-result {
      color: black;
      text-transform: uppercase;
    }

    &.out-result {
      color: red;
    }
  }

  .field-onbase {
    padding: 2px;
    img {
      width: 35px;
      height: 35px;
    }

    &.isPutOut {
      opacity: 0.2;
    }
  }

  .inning-end {
    position: absolute;
    bottom: -1rem;
    right: -0.9rem;
    img {
      height: 1.5rem;
      width: auto;
      filter: invert(30%) sepia(48%) saturate(920%) hue-rotate(85deg) brightness(88%) contrast(94%);
    }
  }

  .field-countHR {
    font-weight: bold;
    position: absolute;
    top: -0.55rem;
    left: 0rem;
    font-size: 30px;
  }
}</style>