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
            <div v-if="currentTopBottom=== 'top'">
              <img src="@/assets/images/cast/inning-top.png">
            </div>
            <div v-else>
              <img src="@/assets/images/cast/inning-placeholder.png">
            </div>
          </div>
          <div>
            {{ currentInning }}
          </div>
          <div>
            <div v-if="currentTopBottom === 'bottom'">
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
          <div v-if="currentOut >= 1">
            <img src="@/assets/images/cast/out-on.png">
          </div>
          <div v-else>
            <img src="@/assets/images/cast/out-off.png">
          </div>
        </div>
        <div class="out-display">
          <div v-if="currentOut >= 2">
            <img src="@/assets/images/cast/out-on.png">
          </div>
          <div v-else>
            <img src="@/assets/images/cast/out-off.png">
          </div>
        </div>
        <div class="out-display">
          <div v-if="currentOut >= 3">
            <img src="@/assets/images/cast/out-on.png">
          </div>
          <div v-else>
            <img src="@/assets/images/cast/out-off.png">
          </div>
        </div>
      </div>
    </div>
    <div class="next-atbat-section">
      <div>
        <div v-for="(playerName, $index) in currentBattersNameAway" :key="$index">
          <div :class="{'current-atbat': $index === 0 && getGameInfo.topBottom === 'top'}" v-html="playerName"></div>
        </div>
      </div>
      <div>
        <div v-for="(playerName, $index) in currentBattersNameHome" :key="$index">
          <div :class="{'current-atbat': $index === 0 && getGameInfo.topBottom === 'bottom'}" v-html="playerName"></div>
        </div>
      </div>

    </div>
  </div>
</template>
<script>
import CastService from "@/services/CastService"
export default {

  computed: {
    currentBattersNameAway() {
      return this.getGameInfo?.currentBatters?.away?.map(p => p.name)
    },
    currentBattersNameHome() {
      return this.getGameInfo?.currentBatters?.home?.map(p => p.name)
    },
    currentInning() {
      return this.getGameInfo.inning
    },
    currentOut() {
      return this.getGameInfo.outs
    },
    currentTopBottom() {
      return this.getGameInfo.topBottom
    },
    game() {
      return this.data
    },
    getGameInfo() {
      return CastService.info(this.game)
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

  },
  mounted() {
    this.broadcastChannel = new BroadcastChannel("gamecastChannel")
    this.broadcastChannel.onmessage = event => {
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
.next-atbat-section {
  padding: 1rem 4rem;
  display: flex;
  justify-content: space-between;
  .current-atbat {
    font-size: 3rem;
  }
}
</style>