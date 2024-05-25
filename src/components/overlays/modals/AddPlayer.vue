<template>
    <Modal v-show="show" @close="closeModal">
      <template v-slot:header>
        <h5>Add a new player</h5>
      </template>
      <template v-slot:body>
        <div>
          <div>
            <div>
              Name:
            </div>
            <div>
              <input type="text" v-model="playerName">
            </div>
            <div class="team-selection-container">
              <div>
                <table>
                  <tr v-for="team in firstHalfTeams" :key="team.id">
                    <td align=right><label :for="`team_select_${team.id}`" >{{team.title.rendered}}</label></td>
                    <td> <input type="checkbox" v-model="selectedTeams" :id="`team_select_${team.id}`" :value="team.id"></td>
                  </tr>
                </table>
              </div>
              <div>
                <table>
                  <tr v-for="team in secondHalfTeams" :key="team.id">
                    <td align=right><label :for="`team_select_${team.id}`" >{{team.title.rendered}}</label></td>
                    <td> <input type="checkbox" v-model="selectedTeams" :id="`team_select_${team.id}`" :value="team.id"></td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-slot:footer>
        <div class="player-replace-footer">
          <button @click="addPlayer" :disabled="loading">ADD PLAYER</button>
        </div>
      </template>
    </Modal>
</template>
<script>

import SportspressAPIService from '@/services/SportspressAPIService'
export default {
  computed: {
    firstHalfTeams() {
      return this.teams.slice(0, Math.ceil(this.teams.length / 2))
    },
    secondHalfTeams() {
      return this.teams.slice(Math.ceil(this.teams.length / 2))
    },
    players() {
      return this.$store.state.data.players
    },
    teams() {
      return this.$store.state.data.teams
    },
  },
  data() {
    return {
      playerName: "",
      selectedTeams: [],
      loading: false,
    }
  },
  methods: {
    async addPlayer() {
      this.loading = true
      const payload = {
        title: this.playerName,
        current_teams: this.selectedTeams.join(","),
        status: "publish",
      }
      await SportspressAPIService.addPlayer(payload, this.$store)
        .then(result => {
          this.closeModal()
        })
        .finally(() => {
          this.loading = false
        })
    },
    closeModal() {
      this.playerName = "",
      this.selectedTeams = [],
      this.$emit("closeModal")
    },
  },
  props: {
    show: {
        type: Boolean,
        default: false,
    },
  },
}
</script>
<style lang="scss" scoped>
.players-list {
  text-align: center;
  width: 100%;

  .player {
    margin: 0rem auto;
    width: fit-content;
  }

  button {
    cursor: pointer;
    margin: 0.125rem 0 1rem;
    padding: 0.25rem 1rem;
  }
}
.team-selection-container {
  display:flex;
  justify-content: center;
  padding: 1rem;
  table {
    td {
      label,input {
        cursor: pointer;
      }
    }
  }
}
</style>
