<template>
  <div>
    <div>
      {{ game.id }} - <span class="date-time">{{ getDateTime(game) }}</span>
    </div>
    <div>
      <div class="scoresheet-results-scores">
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>Teams</th>
              <th v-for="inning in scoresheet.innings" :key="inning"><span>{{ inning }}</span></th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div class="team-image-container">
                  <div class="team-image">
                    <img :src="media[teams?.away?.featured_media] || defaultImage">
                  </div>
                  <div>{{ teams.away.title.rendered }}</div>
                </div>
              </td>
              <td v-for="inning in scoresheet.innings" :key="inning"><span>{{ scoresheet?.scores?.away?.runs?.[inning] ?? 0 }}</span></td>
              <td>{{ scoresheet.scores?.away?.runs?.[0] ?? 0 }}</td>
            </tr>
            <tr>
              <td>
                <div class="team-image-container">
                  <div class="team-image">
                    <img :src="media[teams?.home?.featured_media] || defaultImage">
                  </div>
                  <div>{{ teams.home.title.rendered }}</div>
                </div>
              </td>
              <td v-for="inning in scoresheet.innings" :key="inning"><span>{{ scoresheet?.scores?.home?.runs?.[inning] ?? 0 }}</span></td>
              <td>{{ scoresheet.scores?.home?.runs?.[0] ?? 0 }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <button @click="sendDataToWebsite">SEND DATA</button>
    <div :class="{ 'editMode': editMode }" class="tables-container scoresheet">
      <div class="scoresheet-table">
        <div>
          <button v-if="editMode" @click="setLineup(teams?.away, 'away')">Set Lineup</button>
          <img class="team-image" :src="media[teams?.away?.featured_media] || defaultImage">
          {{ teams.away.title.rendered }}
          <button v-if="editMode" @click="clearLineup('away')">CLEAR LINEUP</button>
        </div>
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>#</th>
              <th>Player</th>
              <th v-for="inning in scoresheet.innings" :key="inning">{{ inning }}</th>
            </tr>
          </thead>
          <draggable @dragend="dragged" tag="tbody" :list="scoresheet.players.away"
            :options="{ animation: 150, group: 'players' }" ghost-class="ghost" :disabled="!editMode">
            <tr v-for="(player, $index) in scoresheet.players.away" :key="$index">
              <td>{{ player.assignedNumber }}</td>
              <td class="player-button-container">
                <button v-if="editMode" class="player-remove-button"
                  @click="removePlayer(player, scoresheet.players.away)">X</button>
                <span v-html="player.name"></span>
                <button v-if="editMode" class="player-swap-button"
                  @click="editPlayer(player, scoresheet.players.away)">SWAP</button>
              </td>
              <td v-for="inning in scoresheet.innings" :key="inning"
                @click="setActiveOutcome(`outcome_away_${$index}_${inning}`)"
                :class="{ active: active.outcomeBox === `outcome_away_${$index}_${inning}` }" class="ingame-outcome-box">
                  <OutcomeBox :players="scoresheet.players.away" :outcome="player.outcome[inning]"></OutcomeBox>
              </td>
            </tr>
          </draggable>
          <tr class="unclickable" v-if="editMode">
            <td :colspan="numberOfInnings + 2" class="add-player-button">
              <button @click="addPlayer(scoresheet.players.away)">Add Player</button>
            </td>
          </tr>
        </table>
      </div>
      <div class="scoresheet-table">
        <div>
          <button v-if="editMode" @click="setLineup(teams?.home, 'home')">Set Lineup</button>
          <img class="team-image" :src="media[teams?.home?.featured_media] || defaultImage">
          {{ teams.home.title.rendered }}
          <button v-if="editMode" @click="clearLineup('home')">CLEAR LINEUP</button>
        </div>
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>#</th>
              <th>Player</th>
              <th v-for="inning in scoresheet.innings" :key="inning">{{ inning }}</th>
            </tr>
          </thead>
          <draggable @dragend="dragged" tag="tbody" :list="scoresheet.players.home"
            :options="{ animation: 150, group: 'players' }" ghost-class="ghost" :disabled="!editMode">
            <tr v-for="(player, $index) in scoresheet.players.home" :key="$index">
              <td>{{ player.assignedNumber }}</td>
              <td class="player-button-container">
                <button v-if="editMode" class="player-remove-button"
                  @click="removePlayer(player, scoresheet.players.home)">X</button>
                <span v-html="player.name"></span>
                <button v-if="editMode" class="player-swap-button"
                  @click="editPlayer(player, scoresheet.players.home)">SWAP</button>
              </td>
              <td v-for="inning in scoresheet.innings" :key="inning"
                @click="setActiveOutcome(`outcome_home_${$index}_${inning}`)"
                :class="{ active: active.outcomeBox === `outcome_home_${$index}_${inning}` }" class="ingame-outcome-box">
                <OutcomeBox :players="scoresheet.players.home" :outcome="player.outcome[inning]"></OutcomeBox>
              </td>
            </tr>
          </draggable>
          <tr class="unclickable" v-if="editMode">
            <td :colspan="numberOfInnings + 2" class="add-player-button"><button
                @click="addPlayer(scoresheet.players.home)">Add Player</button></td>
          </tr>
        </table>
      </div>
    </div>
    <div class="edit-container">
      <button class="editButton" @click="toggleEditMode">{{this.editMode ? "SAVE CHANGES": "Toggle Edit Mode"}}</button>
    </div>


    <!-- REPLACE PLAYER MODAL -->
    <Modal v-show="isPlayerModalVisible" @close="closeModal">
      <template v-slot:header>
        <h5>Replace <b><span v-html="selectedPlayer.name"></span></b> by</h5>
      </template>
      <template v-slot:body>
        <div>
          <div>
            <div class="search-section">
              SEARCH:
              <input ype="text" @input="inputUpdate" :value="inputSearchPlayer" />
            </div>
          </div>
          <div>
            <div v-for="player in allAvailablePlayers" :key="player.id">
              <div :class="{ 'selected': replacementPlayer.id === player.id }" @click="selectReplacementPlayer(player)"
                class="player-replace-list">
                <div><span v-html="player.title.rendered "></span> - <span v-html="getPlayerTeams(player)"></span></div>
              </div>
            </div>
          </div>

        </div>
      </template>
      <template v-slot:footer>
        <div class="player-replace-footer">
          <button @click="replacePlayer">ACCEPTER</button>
        </div>
      </template>
    </Modal>

    <!-- SETTING LINE UP MODAL -->
    <Modal v-show="settingLineup.open" @close="closeModal">
      <template v-slot:header>
        <h5>Lineup {{ settingLineup.team.name }}</h5>
      </template>
      <template v-slot:subheader>
        <div class="">
            <button v-if="scoresheet.players?.[settingLineup.team.homeAway]?.length" @click="undoAddPlayer(scoresheet.players?.[settingLineup.team.homeAway])">UNDO</button>
            <button @click="addNewPlayer()">NEW PLAYER</button>
          </div>
      </template>
      <template v-slot:body>
        <div>
          <div>
            <div class="search-section">
              SEARCH:
              <input ype="text" @input="inputUpdate" :value="inputSearchPlayer" />
            </div>
          </div>
          <div>
            <div v-for="player in allAvailablePlayers" :key="player.id">
              <div :class="{ 'selected': replacementPlayer.id === player.id }" @click="selectReplacementPlayer(player)"
                class="player-replace-list">
                <div><span v-html="player.title.rendered "></span> - <span v-html="getPlayerTeams(player)"></span></div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-slot:footer>
        <div class="player-replace-footer">
          <button @click="setLineupAddPlayer">ACCEPTER</button>
        </div>
      </template>
    </Modal>

    <AddPlayer @closeModal="closeModal()" :show="isAddNewPlayerModalVisible"></AddPlayer>
    <!-- AT-BAT OUTCOME MODAL -->
    <Modal v-show="isOutcomeModalVisible" @close="closeModal">
      <template v-slot:header>
        {{ selectedBatterOrder }} - Inning {{ selectedInning }}
      </template>
      <template v-slot:body>
        <div>
          <OutcomeBoxModal :selectedOutcomeBox="working_selectedOutcomeBox" @updateOutcome="updateOutcomeBox($event)"
            :activePlayer="activePlayer" :isOutcomeModalVisible="isOutcomeModalVisible"
            :players="scoresheet.players?.[this.activeBox?.[1]]"></OutcomeBoxModal>
        </div>
      </template>
      <template v-slot:footer>
        <div class="outcome-save-button">
          <button @click="saveOutcome">Save</button>
        </div>
      </template>
    </Modal>
  </div>
</template>
<script>
import {PlayerInGame} from "@/models/PlayerInGame"
import GameEvent from "@/models/GameEvent"
import $settings from "@/data/settings.json"
import { removeAccents } from "@/scripts/utilities"
import ScoresheetAPIService from "@/services/ScoresheetAPIService"
import { clone } from "@/scripts/utilities"
import moment from "moment"
import { VueDraggableNext } from 'vue-draggable-next'

export default {
  components: {
    draggable: VueDraggableNext,
  },
  computed: {
    allPlayers() {
      return this.$store.getters.getAllPlayers
    },
    allAvailablePlayers() {
      if(this.inputSearchPlayer?.length) {
        return this.allPlayers
        .filter(player => this.scoresheet.players.home.map(p => p.id).indexOf(player.id) === -1)
        .filter(player => this.scoresheet.players.away.map(p => p.id).indexOf(player.id) === -1)
        .filter(player => this.inputSearchPlayer?.length ? removeAccents(player.title?.rendered.toLowerCase())?.indexOf(removeAccents(this.inputSearchPlayer.toLowerCase())) !== -1 : true)
      }
      else {
        return this.allPlayers
      }
    },
    activeBox() {
      return this.active?.outcomeBox?.split("_")
    },
    activePlayer() {
      return this.scoresheet.players?.[this.activeBox?.[1]]?.[this.activeBox?.[2]] || null
    },
    activePlayerBox() {
      return this.activePlayer?.outcome?.[this.activeBox?.[3]] || null
    },
    defaultImage() {
      return require(`@/assets/images/defaults/team_home.png`)
    },
    media() {
      return this.$store.state.data.media
    },
    numberOfInnings() {
      return $settings.playballConfig.innings
    },
    selectedInning() {
      return this.activeBox?.[3]
    },
    selectedBatterOrder() {
      return this.scoresheet.players?.[this.activeBox?.[1]]?.[this.activeBox?.[2]]?.name
    },
  },
  data() {
    return {
      broadcastChannel: null,
      scoresheet: {
        innings: null,
        players: {
          home: [],
          away: []
        },
        teams: {
          home: null,
          away: null
        },
        gameId: null,
        scores: {
          away: {
            runs: new Array($settings.playballConfig.innings+1).fill(0),
            errors: 0,
            estwo: 0,
            hits: 0,
            outcome: "",
          },
          home: {
            runs: new Array($settings.playballConfig.innings+1).fill(0),
            errors: 0,
            estwo: 0,
            hits: 0,
            outcome: "",
          }
        }
      },
      teams: {
        home: null,
        away: null
      },
      game: null,
      gameEvent: new GameEvent(),
      id: 0,
      editMode: false,
      inputSearchPlayer: [],

      isOutcomeModalVisible: false,
      isPlayerModalVisible: false,
      isAddNewPlayerModalVisible: false,
      selectedPlayer: { name: "Peanuts" },
      working_selectedOutcomeBox: { name: "Peanuts" },

      replacementPlayer: { id: null },
      rbiValue: null,
      active: {
        player: null,
        outcomeBox: null
      },
      settingLineup: {
        open: false,
        team: {
          id: null,
          name: "",
        }
      },
      hasContentInDB: false,
    }
  },
  methods: {
    addNewPlayer() {
      this.isAddNewPlayerModalVisible = true
    },
    addPlayer(teamPlayers) {
      const player = this.allAvailablePlayers[0]
      teamPlayers.push(new PlayerInGame({ ...player, assignedNumber: player.number.length !== 0 ? player.number : `P${++this.id}` }))
      this.updateData()
    },
    closeModal() {
      this.isAddNewPlayerModalVisible = false
      this.isPlayerModalVisible = false
      this.isOutcomeModalVisible = false
      this.settingLineup.open = false
    },
    clearLineup(team) {
      this.scoresheet.players[team] = []
    },
    dragged() {
      this.updateData()
    },
    editPlayer(player, list) {
      this.isPlayerModalVisible = true
      this.selectedPlayer = new PlayerInGame({ ...player, assignedNumber: player.number.length !== 0 ? player.number : `P${++this.id}` })
    },
    getDateTime(event) {
      return moment(event.date).locale("fr").format("dddd DD MMM YYYY HH:mm")
    },
    getPlayerTeams(player) {
      const teams = player.current_teams
        .map(t => this.$store.getters.getTeam(t)?.title?.rendered)
        .filter(t => t)
        .join(",")
      return teams
    },
    removePlayer(player, list) {
      const playerIndex = list.findIndex(p => p.id === player.id)
      if (playerIndex !== -1) {
        list.splice(playerIndex, 1)
        this.updateData()
      }
    },
    setActiveOutcome(id) {
      if (this.active.outcomeBox !== id && !this.editMode) {
        this.active.outcomeBox = id
      }
      else if (!this.editMode) {
        this.working_selectedOutcomeBox = this.activePlayerBox
        this.isOutcomeModalVisible = true
      }
    },
    toggleEditMode() {
      this.editMode = !this.editMode
      if(!this.editMode) {
        this.updateData()
      }
    },

    async sendDataToWebsite() {
      this.gameEvent.prepareData(this.scoresheet)
    },

    inputUpdate(event) {
      this.inputSearchPlayer = event.target.value
    },
    selectReplacementPlayer(player) {
      this.replacementPlayer = new PlayerInGame({ ...player, assignedNumber: player.number.length !== 0 ? player.number : `P${++this.id}` })
    },
    replacePlayer() {
      if (this.replacementPlayer?.id) {
        this.isPlayerModalVisible = false
        const homeIndex = this.scoresheet.players.home.findIndex(p => {
          return p.id == this.selectedPlayer.id
        })
        const awayIndex = this.scoresheet.players.away.findIndex(p => {
          return p.id == this.selectedPlayer.id
        })


        if (homeIndex !== -1) {
          this.scoresheet.players.home.splice(homeIndex, 1, this.replacementPlayer)
        }
        if (awayIndex !== -1) {
          this.scoresheet.players.away.splice(awayIndex, 1, this.replacementPlayer)

        }
        this.replacementPlayer = { id: null }
        this.inputSearchPlayer = ""
        this.selectedPlayer = { name: null }
        this.updateData()
      }
    },
    saveOutcome() {
      this.scoresheet.players[this.activeBox[1]][this.activeBox[2]].outcome[this.activeBox[3]] = this.working_selectedOutcomeBox
      this.closeModal()
      this.updateData()
    },
    setLineup(team,homeAway) {
      console.log(team)
      this.settingLineup = {
        open: true,
        team: {
          id: team,
          name: team?.title?.rendered || homeAway,
          homeAway: homeAway,
        },
      }
    },
    setLineupAddPlayer() {
      const player = this.replacementPlayer
      const homeAway = this.settingLineup.team.homeAway
      this.scoresheet.players[homeAway].push(player)
    },
    sendPostMessage() {
      this.broadcastChannel.postMessage(clone(this.scoresheet),"*")
    },
    updateData() {
      this.scoresheet.scores = this.gameEvent.generateScore(this.scoresheet)
      localStorage.setItem("cast-matchup", JSON.stringify(this.scoresheet))
      ScoresheetAPIService.saveData(this.scoresheet)
      this.sendPostMessage()
    },
    updateOutcomeBox(value) {
      this.working_selectedOutcomeBox = value
    },
    undoAddPlayer(list) {
      list = list.pop()
    }


  },
  async created() {
    this.broadcastChannel = new BroadcastChannel('test_channel')
    this.scoresheet.gameId = this.$route?.params?.gameId
    this.scoresheet.seasonId = $settings.playballConfig.season
    if (this.scoresheet.gameId) {
      this.game = this.$store.getters.getGame(this.scoresheet.gameId)
      let index = 0
      this.scoresheet.innings = Array.from({ length: $settings.playballConfig.innings }, () => ++index)
      this.scoresheet.teams.away = this.$store.getters.getTeam(this.game?.teams[0])
      this.scoresheet.teams.home = this.$store.getters.getTeam(this.game?.teams[1])
      this.teams.away = this.scoresheet.teams.away
      this.teams.home = this.scoresheet.teams.home
      this.scoresheet.players.away = this.$store.getters.getPlayersInTeam(this.scoresheet.teams.away.id)
        .map(p => new PlayerInGame({ ...p, assignedNumber: p.number.length !== 0 ? p.number : `P${++this.id}` }))
      this.scoresheet.players.home = this.$store.getters.getPlayersInTeam(this.scoresheet.teams.home.id)
        .map(p => new PlayerInGame({ ...p, assignedNumber: p.number.length !== 0 ? p.number : `P${++this.id}` }))
    }
    await ScoresheetAPIService.checkData(this.$route?.params?.gameId).then(result => {
      this.hasContentInDB = result?.data?.id
    })
    if (this.hasContentInDB) {
      await ScoresheetAPIService.loadData(this.$route?.params?.gameId).then(result => {
        const obj = JSON.parse(result.jsonObject)
        obj.players.home = obj.players.home.map(p => new PlayerInGame(p))
        obj.players.away = obj.players.away.map(p => new PlayerInGame(p))
        this.scoresheet.players = obj.players
      })
        .catch(error => {
          console.error(error)
        })
    }
    else {
      await ScoresheetAPIService.createData(this.scoresheet)
    }
    this.scoresheet.scores = this.gameEvent.generateScore(this.scoresheet)
  },
  mounted() {
    this.broadcastChannel = new BroadcastChannel("gamecastChannel")
    this.broadcastChannel.onmessage = event => {

    }
  }
}
</script>
<style lang="scss" scoped>
.tables-container {
  display: flex;
  justify-content: space-around;
  .scoresheet-table {
    padding: 0 0.5rem;
    table {
      tr {
        &:nth-child(even) {
          td {
          }
        }

        &:nth-child(odd) {
          td {
          }
        }

        th {

          &:nth-child(1) {
            max-width: 1rem;
          }
        }

        td {
          vertical-align: middle;
          &:nth-child(1) {
            padding: 0 1rem;
          }

          &:nth-child(2) {
            min-width: 8rem;
          }

          padding: 0rem 1rem;

          &.active {
            background: lightgreen;
          }
        }

        &.unclickable {
          td {
            background: lightgray;
          }
        }
      }
    }

    .add-player-button {
      button {
        width: 100%;
        padding: 1rem;
      }
    }

    .ingame-outcome-box {
      padding: 2px;
    }

    .action-buttons {
      margin: 0;
      background: lime;
      position: fixed;
      bottom: 0;
      width: 100%;
      left: 0;
      display: flex;
    }

    .editButton {
      padding: 1rem;
    }

    .rbi-input {
      display: flex;
    }



  }
}

.search-section {
  background: white;
  position: relative;
  border-bottom: 2px solid #eeeeee;
  color: #4AAE9B;
  justify-content: space-between;
  align-items: center;
  top: 0;
}

.scoresheet-results-scores {
  table {
    margin: 1rem auto;
    td {
      vertical-align: middle;
    }
  }

}

.outcome-save-button {
  button {
    width: 100%;
    height: 100%;
    padding: 1rem;
  }
}

.editMode {
  table {
    tr {
      &.ghost {
        td {
          background: pink;
        }
      }

      td {
        background: lightblue;
      }

      &.unclickable {
        td {
          background: lightgray;
        }
      }
    }
  }
}

.edit-container {
  margin-bottom: 8rem;
}

.player-replace-list {
  padding: 0.35rem;
  cursor: pointer;

  &.selected {
    background: lime;
  }
}

.player-replace-footer {
  min-height: 2.5rem;

  button {
    width: 100%;
    height: 100%;
  }
}

.player-button-container {
  position: relative;
  text-align: left;
  .player-remove-button {
    padding: 0.25rem;
    position: absolute;
    left: 0;
    top: 0;
    height: 30px;
    width: 30px;
    opacity: 0.75;
    cursor: pointer;
  }

  .player-swap-button {
    padding: 0.25rem;
    position: absolute;
    right: 0;
    top: 0;
    height: 30px;
    width: 60px;
    opacity: 0.75;
    cursor: pointer;
  }
}
.team-image-container {
  align-items: center;
  display: flex;

}
.team-image {
  border-radius: 50%;
  height: 40px;
  margin-right: 8px;
  width: 40px;
  overflow: hidden;
  img {
    height: 100%;
    width: auto;
  }
}
.score-table {
  border-collapse: collapse;

  tr {
    td,th {
      border: 1px solid black;
      padding: 0.25rem 0.5rem;
    }
    td {
      &:nth-child(even) {
        color: black;
      }
    }
  }
}
.date-time {
  text-transform: capitalize;
}

</style>