<template>
  <div class="box">
    <pre>{{ selectedScoreBox }}</pre>
  </div>
</template>
<script>
export default {
  computed: {

  },
  props: {
    selectedScoreBox: Object,
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
    bottom: -1.5rem;
    right: -1.5rem;
  }

  .field-countHR {
    font-weight: bold;
    position: absolute;
    top: -0.25rem;
    left: 0rem;
    font-size: 30px;
  }
}</style>