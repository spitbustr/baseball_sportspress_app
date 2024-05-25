<template>
  <div class="cast-game">
    <table width="100%">
      <tr class="team-container">
        <td class="team away">
          <div class="team-logo-container">
            <div class="team-logo">
              <img :src="media[teams?.away?.featured_media]">
            </div>
          </div>
          <div class="team-name" :style="{'color': settings?.teams?.[teams?.away?.id]?.colors?.[0] || 'white'}">
            {{teams?.away?.title?.rendered || 'AWAY'}}
          </div>
          <div class="team-points">
            {{ game?.scores?.away?.runs?.[0] || 0 }}
          </div>
        </td>
        <td class="inning-display">
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
        </td>
        <td class="team home">
          <div class="team-logo-container">
            <div class="team-logo">
              <img :src="media[teams?.home?.featured_media]">
            </div>
          </div>
          <div class="team-name" :style="{'color': settings?.teams?.[teams?.home?.id]?.colors?.[0] || 'white'}">
            {{teams?.home?.title?.rendered || 'HOME'}}
          </div>
          <div class="team-points">
            {{ game?.scores?.home?.runs?.[0] || 0 }}
          </div>
        </td>
      </tr>
      <tr >
        <td></td>
        <td>
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
        </td>
        <td></td>
      </tr>
      <tr >
        <td class="next-atbat-section">
          <div v-for="(player, $index) in currentBattersAway" :key="$index">
            <div :class="{'current-atbat': $index === 0 && getGameInfo.topBottom === 'top'}" v-html="player.name.split('(R)')[0]"></div>
          </div>
        </td>
        <td>
          <div class="player-image-section">
            <div class="player-image" v-if="getGameInfo.topBottom === 'top'">
              <img :src="media?.[currentBattersAway[0]?.featured_media]">
            </div>
            <div class="player-image" v-else-if="getGameInfo.topBottom === 'bottom'">
              <img :src="media?.[currentBattersHome[0]?.featured_media]">
            </div>
            <div class="player-image" v-else>
              <img :src="defaultPlayer">
            </div>
          </div>
        </td>
        <td class="next-atbat-section">
          <div v-for="(player, $index) in currentBattersHome" :key="$index">
            <div :class="{'current-atbat': $index === 0 && getGameInfo.topBottom === 'bottom'}" v-html="player.name.split('(R)')[0]"></div>
          </div>
        </td>
      </tr>
    </table>

  </div>
</template>
<script>
import $settings from "@/data/settings.json"
import CastService from "@/services/CastService"
export default {

  computed: {
    currentBattersAway() {
      return this.getGameInfo?.currentBatters?.away
    },
    currentBattersHome() {
      return this.getGameInfo?.currentBatters?.home
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
    defaultPlayer() {
      return require(`@/assets/images/defaults/default_player.png`)
    },
    defaultImage() {
      return require(`@/assets/images/defaults/team_home.png`)
    },
    game() {
      return this.data
    },
    getGameInfo() {
      return CastService.info(this.game)
    },
    media() {
      return this.$store.state.data.media
    },
    settings() {
      return $settings
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
    align-content: end;
    .team-logo-container {
      align-items: center;
      display: flex;
      justify-content: center;
      width: 100%;
      .team-logo {
        height: 100px;
        width: 100px;
        border-radius: 50%;
        overflow: hidden;
        img {
          height: 100%;
          width: auto;
        }
      }
    }
  }
  .team-container {
    .team-name {
      -webkit-text-stroke: 0.025rem white;
      font-size: 4rem;
    }
    .team-points {
      -webkit-text-stroke: 0.25rem white;
      font-size: 16rem;
      line-height: 14rem;
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
  align-items: center;
  display: flex;
  font-size: 1.25rem;
  flex-direction: column;
  justify-content: center;
  padding: 1rem 0rem;
  .current-atbat {
    font-size: 2.5rem;
    line-height: 4rem;
    margin-bottom: 1rem;
  }
}
.player-image-section {
  align-items: center;
  display: flex;
  justify-content: center;

  .player-image {
    width: 160px;
    img {
      width: 100%;
    }
  }
}
</style>