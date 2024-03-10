<template>
  <div class="cast-game">
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
        <div class="inning-display">
          <div>
            <div v-if="castService.topBottomInning() === 0">
              <img src="@/assets/images/cast/inning-top.png">
            </div>
            <div v-else>
              <img src="@/assets/images/cast/inning-placeholder.png">
            </div>
          </div>
          <div>
            {{ castService.currentInning() }}
          </div>
          <div>
            <div v-if="castService.topBottomInning() === 1">
              <img src="@/assets/images/cast/inning-bottom.png">
            </div>
            <div v-else>
              <img src="@/assets/images/cast/inning-placeholder.png">
            </div>
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
      <div class="out-display-container">
        <div class="out-display">
          <div v-if="castService.numberOfOut() >= 1">
            <img src="@/assets/images/cast/out-on.png">
          </div>
          <div v-else>
            <img src="@/assets/images/cast/out-off.png">
          </div>
        </div>
        <div class="out-display">
          <div v-if="castService.numberOfOut() >= 2">
            <img src="@/assets/images/cast/out-on.png">
          </div>
          <div v-else>
            <img src="@/assets/images/cast/out-off.png">
          </div>
        </div>
        <div class="out-display">
          <div v-if="castService.numberOfOut() >= 3">
            <img src="@/assets/images/cast/out-on.png">
          </div>
          <div v-else>
            <img src="@/assets/images/cast/out-off.png">
          </div>
        </div>
      </div>
    </div>
    <div>
      {{ currentBatter }}
    </div>
  </div>
</template>
<script>
import CastService from "@/services/CastService"
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
    currentBatter() {
      console.log("BATTER",this.castService.currentBatter())
      return this.castService.currentBatter(this.game)?.title?.rendered || null
    }
  },
  data() {
    return {
      broadcastChannel: null,
      data: null,
      castService: CastService,
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
  padding: 2rem;
  color: white;
  .team {
    width: 40%;
  }
  .team-container {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    .team-name {
      font-size: 5rem;
    }
    .team-points {
      font-size: 15rem;
    }
    .inning-display {
      width: 10%;
      font-size: 4rem;
    }
  }
  .out-display-container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    .out-display {
      padding: 1rem;
    }
  }
}
</style>