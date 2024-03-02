<template>
  <div class="cast-game">
    TEST
    <div>
      <div class="team-container">
        <div class="team away">
          <div class="team-name">
            {{teams?.away?.title?.rendered || 'AWAY'}}
          </div>
          <div class="team-points">
            {{ game?.scores?.away?.runs?.[0] || 0 }}
          </div>
        </div>
        <div class="team home">
          <div class="team-name">
            {{teams?.home?.title?.rendered || 'HOME'}}
          </div>
          <div class="team-points">
            {{ game?.scores?.home?.runs?.[0] || 0 }}
          </div>
        </div>
      </div>
    </div>
    <div>
    </div>
  </div>
</template>
<script>
export default {

  computed: {
    game() {
      return this.data
    },
    scores() {
      return this.data?.scores
    },
    teams() {
      return this.data?.teams
    },
  },
  data() {
    return {
      broadcastChannel: null,
      data: null,
    }
  },
  methods: {
    listenUpdate(message) {
      console.log("UPDATED", message)
    },

  },
  mounted() {
    this.broadcastChannel = new BroadcastChannel("gamecastChannel")
    this.broadcastChannel.onmessage = event => {
      console.log(event.data);
      this.data = event.data
    }
  },

}
</script>
<style lang="scss" scoped>
.cast-game {
  color: white;
  .team-container {
    display: flex;
    justify-content: space-around;
    .team-name {
      font-size: 5rem;
    }
    .team-points {
      font-size: 8rem;
    }
  }
}
</style>