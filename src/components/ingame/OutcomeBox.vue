<template>
  <div class="box">
    <div class="field-countHR" v-if="countAsHR">
      *
    </div>
    <div class="field-onbase" :class="{ 'isPutOut': isPutOut }">
      <img :src="fieldImage" />
    </div>
    <div class="outcome-result">
      {{ atBatOutcome }}
    </div>
    <div class="center-field out-result" v-if="isPutOut">
      O
    </div>
    <div class="center-field rbi-result" v-if="rbiResult && !isPutOut">
      {{ rbiResult }}
    </div>
    <div class="inning-end" v-if="inningEnd">
      <img :src="inningEndImage" />
    </div>
  </div>
</template>
<script>
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
  props: {
    outcome: Object,
  },
}
</script>
<style lang="scss" scoped>
.box {
  position: relative;

  .outcome-result {
    position: absolute;
    font-size: 12px;
    right: 2px;
    bottom: 0;
  }

  .center-field {
    position: absolute;
    font-weight: bold;
    font-size: 12px;
    top: 0;
    left: 0;
    right: 0;
    margin: 0.7rem auto;

    &.rbi-result {
      color: black;
      text-transform: uppercase;
    }

    &.out-result {
      color: red;
    }
  }

  .field-onbase {
    img {
      width: 35px;
      height: 35px;
    }

    &.isPutOut {
      opacity: 0.1;
    }
  }

  .inning-end {
    position: absolute;
    bottom: -1rem;
    right: -1rem;
    img {
      height: 1.5rem;
      width: auto;
      filter: invert(30%) sepia(48%) saturate(920%) hue-rotate(85deg) brightness(88%) contrast(94%);
    }
  }

  .field-countHR {
    font-weight: bold;
    position: absolute;
    top: -0.25rem;
    left: 0rem;
    font-size: 30px;
  }
}</style>