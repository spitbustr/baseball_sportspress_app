<template>
  <nav class="navbar navbar-light bg-light py-4">
    <div class="container-fluid">
      <span class="navbar-brand mb-0 h1">{{ game.id }} - <span class="date-time">{{ getDateTime(game) }}</span></span>
      <div class="d-flex btn-group" role="group" aria-label="Basic example">
        <button type="button editButton" class="btn btn-outline-primary btn-lg" @click="toggleEditMode">{{ this.editMode
          ? "Sauvegarder" : "Éditer alignements"}}</button>
                    <button class="btn btn-outline-primary btn-lg" type="button" @click="sendDataToWebsite">Envoyer</button>

      </div>
    </div>
  </nav>
  <div class="container-fluid">
    <div :class="{ 'editMode': editMode }" class="scoresheet">
      <div class="row">
        <div class="col-md-6">
          <nav class="navbar navbar-light" style="background-color:#Fff">
            <div class="container-fluid">
              <span class="navbar-brand mb-0 h1"> <img class="team-image"
                  :src="media[teams?.away?.featured_media] || defaultImage">
                {{ teams.away.title.rendered }}</span>
              <div class="d-flex btn-group" role="group" aria-label="Basic example">
                <button class="btn btn-outline-primary btn-sm" v-if="editMode"
                  @click="setLineup(teams?.away, 'away')">Set Lineup</button>
                <button class="btn btn-outline-primary btn-sm" v-if="editMode" @click="clearLineup('away')">CLEAR
                  LINEUP</button>
              </div>
            </div>
          </nav>
          <table class="table table-bordered table-hover align-middle">
            <thead class="table-light">
              <tr>
                <th v-if="editMode"></th>
                <th>#</th>
                <th class="large-cell">Player</th>
                <template  v-for="inning in displayedInnings" :key="inning">
                  <th class="header-innings">{{ inning }}</th>
                  <th v-for="(extraInning, $$index) in extraBlocks(inning,'away' )" class="header-innings" :key="$$index">{{ extraInning }}</th>
                </template>
                <th v-if="editMode">Actions</th>
              </tr>
            </thead>
            <draggable @dragend="dragged" tag="tbody" :list="scoresheet.players.away"
              :options="{ animation: 150, group: 'players' }" ghost-class="ghost" :disabled="!editMode">
              <tr v-for="(player, $index) in scoresheet.players.away" :key="$index">
                <td v-if="editMode"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                    class="bi bi-three-dots-vertical" viewBox="0 0 16 16">
                    <path
                      d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
                  </svg></td>
                <td>{{ player.assignedNumber }}</td>
                <td class="player-button-container">
                  <span class="probably" v-if="player.probably">*</span>
                  <span v-html="player.name"></span>
                </td>
                <td v-for="inning in scoresheet.innings" :key="inning"
                  @click="setActiveOutcome(`outcome_away_${$index}_${inning}`)"
                  :class="{ active: active.outcomeBox === `outcome_away_${$index}_${inning}` }"
                  class="ingame-outcome-box">
                  <OutcomeBox :players="scoresheet.players.away" :outcome="player.outcome[inning]"></OutcomeBox>
                </td>
                <td v-if="editMode">
                  <button v-if="editMode" class="btn btn-primary btn-sm player-remove-button"
                    @click="removePlayer(player, scoresheet.players.away)">Supprimer</button>&nbsp;
                  <button v-if="editMode" class="btn btn-primary btn-sm player-swap-button"
                    @click="editPlayer(player, scoresheet.players.away)">Remplacer
                  </button>
                </td>
              </tr>
            </draggable>

          </table>
          <div class="d-grid gap-2">
            <button class="btn btn-outline-primary btn-lg" v-if="editMode"
              @click="addPlayer(scoresheet.players.away)">Ajouter</button>
          </div>
        </div>
        <div class="col-md-6">
          <nav class="navbar navbar-light" style="background-color:#Fff">
            <div class="container-fluid">
              <span class="navbar-brand mb-0 h1"> <img class="team-image"
                  :src="media[teams?.home?.featured_media] || defaultImage">
                {{ teams.home.title.rendered }}</span>
              <div class="d-flex btn-group" role="group" aria-label="Basic example">
                <button class="btn btn-outline-primary btn-sm" v-if="editMode"
                  @click="setLineup(teams?.home, 'home')">Set Lineup</button>
                <button class="btn btn-outline-primary btn-sm" v-if="editMode" @click="clearLineup('home')">CLEAR
                  LINEUP</button>
              </div>
            </div>
          </nav>
          <table class="table table-bordered table-hover align-middle">
            <thead class="table-light">
              <tr>
                <th v-if="editMode"></th>
                <th>#</th>
                <th>Player</th>
                <template  v-for="inning in displayedInnings" :key="inning">
                  <th class="header-innings">{{ inning }}</th>
                  <th v-for="(extraInning, $$index) in extraBlocks(inning,'home' )" class="header-innings" :key="$$index">{{ extraInning }}</th>
                </template>
                <th v-if="editMode">Actions</th>
              </tr>
            </thead>
            <draggable @dragend="dragged" tag="tbody" :list="scoresheet.players.home"
              :options="{ animation: 150, group: 'players' }" ghost-class="ghost" :disabled="!editMode">
              <tr v-for="(player, $index) in scoresheet.players.home" :key="$index">
                <td v-if="editMode"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                    class="bi bi-three-dots-vertical" viewBox="0 0 16 16">
                    <path
                      d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
                  </svg></td>
                <td>{{ player.assignedNumber }}</td>
                <td class="player-button-container">
                  <span class="probably" v-if="player.probably">*</span>
                  <span v-html="player.name"></span>
                </td>
                <td v-for="inning in scoresheet.innings" :key="inning"
                  @click="setActiveOutcome(`outcome_home_${$index}_${inning}`)"
                  :class="{ active: active.outcomeBox === `outcome_home_${$index}_${inning}` }"
                  class="ingame-outcome-box">
                  <OutcomeBox :players="scoresheet.players.home" :outcome="player.outcome[inning]"></OutcomeBox>
                </td>
                <td v-if="editMode">
                  <button v-if="editMode" class="btn btn-primary btn-sm player-remove-button"
                    @click="removePlayer(player, scoresheet.players.home)">Supprimer</button>&nbsp;
                  <button v-if="editMode" class="btn btn-primary btn-sm player-swap-button"
                    @click="editPlayer(player, scoresheet.players.home)">Remplacer
                  </button>
                </td>
              </tr>
            </draggable>
          </table>
          <div class="d-grid gap-2">
            <button class="btn btn-outline-primary btn-lg" v-if="editMode"
              @click="addPlayer(scoresheet.players.home)">Ajouter</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="container-fluid">
    <div class="row">
      <div class="col-sm-12">
        <div class="scoresheet-results-scores">
          <table class="table table-bordered table-hover">
            <thead class="table-light">
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
                <td v-for="inning in scoresheet.innings" :key="inning"><span>{{
                    scoresheet?.scores?.away?.runs?.[inning]
                    ?? 0 }}</span></td>
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
                <td v-for="inning in scoresheet.innings" :key="inning"><span>{{
                    scoresheet?.scores?.home?.runs?.[inning]
                    ?? 0 }}</span></td>
                <td>{{ scoresheet.scores?.home?.runs?.[0] ?? 0 }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- REPLACE PLAYER MODAL -->
    <Modal v-show="isPlayerModalVisible" @close="closeModal">
      <template v-slot:header>
        <h5>Replace <b><span v-html="selectedPlayer.name"></span></b> by</h5>
      </template>
      <template v-slot:subheader>
        <div class="">
          <button @click="addNewPlayer()">NEW PLAYER</button>
          <button @click="probablyPlayer()">PROBABLY<span class="probably" v-if="probablyRightPlayer">*</span></button>
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
                <div><span v-html="player.title.rendered "></span> - <span v-html="getPlayerTeams(player)"></span>
                </div>
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
          <button v-if="scoresheet.players?.[settingLineup.team.homeAway]?.length"
            @click="undoAddPlayer(scoresheet.players?.[settingLineup.team.homeAway])">UNDO</button>
          <button @click="addNewPlayer()">NEW PLAYER</button>
          <button @click="probablyPlayer()">PROBABLY<span class="probably" v-if="probablyRightPlayer">*</span></button>
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
                <div><span v-html="player.title.rendered "></span> - <span v-html="getPlayerTeams(player)"></span>
                </div>
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
        <span v-html="selectedBatterOrder"></span> - Inning {{ selectedInning }}
      </template>
      <template v-slot:body>
        <div>
          <OutcomeBoxModal
            :selectedOutcomeBox="working_selectedOutcomeBox"
            @updateOutcome="updateOutcomeBox($event)"
            :activePlayer="currentActivePlayer"
            :isOutcomeModalVisible="isOutcomeModalVisible"
            :players="scoresheet.players?.[this.currentActiveBox?.[1]]">
          </OutcomeBoxModal>
        </div>
      </template>
      <template v-slot:footer>
        <div class="outcome-save-button">
          <button @click="saveOutcome">Save</button>
        </div>
      </template>
    </Modal>
    <Modal v-show="openRbiModal" @close="closeModal">
      <template v-slot:header>
        <span v-html="selectedBatterOrder"></span> - Inning {{ selectedInning }}
      </template>
      <template v-slot:body>
        <div>
          <div>
            <div v-if="activePlayerBox?.onBasePosition === 'point'">
              <select class="rbi-button" v-model="activePlayerBox.rbiBy">
              <option :value="null">NO RBI</option>
              <option v-for="player in scoresheet.players?.[this.currentActiveBox?.[1]]" :value="player.id" :key="player.id"><span v-html="player.name"></span></option>
              </select>
            </div>
          </div>
        </div>
      </template>
      <template v-slot:footer>
        <div class="outcome-save-button">
          <button @click="saveOutcome">Save</button>
        </div>
      </template>
    </Modal>

    <!-- Loading Modal -->
    <Modal type="loading" v-show="loading">
      <template v-slot:body>
        Sending data...
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
import OutcomeMixin from "@/mixins/OutcomeMixin"
import KeyHandlerMixin from "@/mixins/KeyHandlerMixin"
import {debounce} from "lodash"

export default {
  components: {
    draggable: VueDraggableNext,
  },
  computed: {
    allModalToggle() {
      return this.isAddNewPlayerModalVisible
      || this.isPlayerModalVisible
      || this.isOutcomeModalVisible
      || this.settingLineup.open
      || this.probablyRightPlayer
      || this.openRbiModal
    },
    allPlayers() {
      return this.$store.getters.getAllPlayers
    },
    allAvailablePlayers() {
      if(this.inputSearchPlayer?.length) {
        return this.allPlayers
        .filter(player => this.inputSearchPlayer?.length ? removeAccents(player.title?.rendered.toLowerCase())?.indexOf(removeAccents(this.inputSearchPlayer.toLowerCase())) !== -1 : true)
      }
      else {
        return this.allPlayers
      }
    },
    currentActiveBox() {
      return this.active?.outcomeBox?.split("_")
    },
    currentActivePlayer() {
      return this.scoresheet.players?.[this.currentActiveBox?.[1]]?.[this.currentActiveBox?.[2]] || null
    },
    currentActivePlayerBox() {
      return this.currentActivePlayer?.outcome?.[this.currentActiveBox?.[3]] || null
    },
    defaultImage() {
      return require(`@/assets/images/defaults/team_home.png`)
    },
    displayedInnings() {
      if(this.getAllFullInnings("away")) {
      }
      return this.numberOfInnings
    },
    media() {
      return this.$store.state.data.media
    },
    numberOfInnings() {
      return $settings.playballConfig.innings
    },
    selectedInning() {
      return this.currentActiveBox?.[3]
    },
    selectedBatterOrder() {
      return this.scoresheet.players?.[this.currentActiveBox?.[1]]?.[this.currentActiveBox?.[2]]?.name
    },
  },
  data() {
    return {
      activePlayerBox: null,
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
      probablyRightPlayer: false,
      hasContentInDB: false,
      loading: false,
    }
  },
  methods: {
    advancePlayer() {
      if(this.activePlayerBox?.atBatResult) {
        if(this.activePlayerBox?.onBasePosition === "third") {
          this.setAtBase("point")
          this.activePlayerBox.rbiBy = this.currentActivePlayer?.id
          this.openRbiModal = true
        }
        else if(this.activePlayerBox?.onBasePosition === "second") {
          this.setAtBase("third")
          this.activePlayerBox.rbiBy = null
        }
        else if(this.activePlayerBox?.onBasePosition === "first") {
          this.setAtBase("second")
          this.activePlayerBox.rbiBy = null
        }
      }
    },
    returnPlayer() {
      if(this.activePlayerBox?.atBatResult) {
        if(this.activePlayerBox?.onBasePosition === "second") {
          this.activePlayerBox.rbiBy = null
          this.setAtBase("first")
        }
        else if(this.activePlayerBox?.onBasePosition === "third") {
          this.activePlayerBox.rbiBy = null
          this.setAtBase("second")
        }
        else if(this.activePlayerBox?.onBasePosition === "point") {
          this.activePlayerBox.rbiBy = null
          this.setAtBase("third")
        }
      }
    },
    addInningBlock(inning,homeAway) {
      const allInnings = this.getAllFullInnings(homeAway)
      const inningIsFull = allInnings.find(i => inning === i.inning && i.res)
      console.log(inningIsFull, inning,homeAway)
      return inningIsFull
    },
    addNewPlayer() {
      this.isAddNewPlayerModalVisible = true
    },
    addPlayer(teamPlayers) {
      const player = this.allAvailablePlayers[0]
      teamPlayers.push(new PlayerInGame({ ...player, assignedNumber: player.number.length !== 0 ? player.number : `P${++this.id}`, probably: this.probablyRightPlayer }))
      this.probablyRightPlayer = false
      this.updateData()
    },
    closeModal() {
      this.isAddNewPlayerModalVisible = false
      this.isPlayerModalVisible = false
      this.isOutcomeModalVisible = false
      this.settingLineup.open = false
      this.probablyRightPlayer = false
      this.openRbiModal = false
    },
    clearLineup(team) {
      this.scoresheet.players[team] = []
    },
    dragged() {
      this.updateData()
    },
    editPlayer(player, list) {
      this.isPlayerModalVisible = true
      this.selectedPlayer = new PlayerInGame({ ...player, assignedNumber: player.number.length !== 0 ? player.number : `P${++this.id}`, probably: this.probablyRightPlayer })
      this.probablyRightPlayer = false
    },
    extraBlocks(inning) {
      return []
    },
    getAllFullInnings(homeAway) {
      let index = 1;
      const inningsArray = Array.from({ length: this.numberOfInnings  }, () => index++);
      let allInnings = []
      inningsArray?.forEach((inning,index) => {
        allInnings.push({
          inning: inning,
          res: this.isInningFull(inning,homeAway)
        })
      })
      console.log(allInnings)
      return this.numberOfInnings
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
    handleKeys(event) {
      this.handleShortcutKeys(event, this.active.outcomeBox,this.allModalToggle)
    },
    moveThroughBoxes(arrow) {
      const prop = this.currentActiveBox?.[0]
      const homeAway = this.currentActiveBox?.[1]
      const row = +this.currentActiveBox?.[2]
      const col = +this.currentActiveBox?.[3]
      if(arrow === "up" && row > 0){
        this.setActiveOutcome(`${prop}_${homeAway}_${row-1}_${col}`)
      }
      if(arrow === "down" && row < this.scoresheet.players?.[homeAway]?.length - 1){
        this.setActiveOutcome(`${prop}_${homeAway}_${row+1}_${col}`)
      }
      if(arrow === "left" && col > 1){
        this.setActiveOutcome(`${prop}_${homeAway}_${row}_${col-1}`)
      }
      if(arrow === "right" && col < this.numberOfInnings){
        this.setActiveOutcome(`${prop}_${homeAway}_${row}_${col+1}`)
      }
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
        this.working_selectedOutcomeBox = this.currentActivePlayerBox
        this.isOutcomeModalVisible = true
      }
      this.activePlayerBox = this.currentActivePlayerBox
    },
    toggleEditMode() {
      this.editMode = !this.editMode
      if(!this.editMode) {
        this.updateData()
      }
    },

    async sendDataToWebsite() {
      this.loading = true
      this.gameEvent.prepareData(this.scoresheet).then(result => {
      }).finally(() => {
        this.loading = false
      })
    },

    inputUpdate(event) {
      this.inputSearchPlayer = event.target.value
    },

    selectReplacementPlayer(player) {
      this.replacementPlayer = new PlayerInGame({ ...player, assignedNumber: player.number.length !== 0 ? player.number : `P${++this.id}` ,probably: this.probablyRightPlayer })
    },
    probablyPlayer() {
      this.probablyRightPlayer = !this.probablyRightPlayer
    },
    replacePlayer() {
      if (this.replacementPlayer?.id) {
        this.replacementPlayer.outcome = this.selectedPlayer.outcome
        this.replacementPlayer.probably = this.probablyRightPlayer
        this.isPlayerModalVisible = false
        const homeIndex = this.scoresheet.players.home.findIndex(p => {
          return p.id == this.selectedPlayer.id
        })
        const awayIndex = this.scoresheet.players.away.findIndex(p => {
          return p.id == this.selectedPlayer.id
        })


        if (homeIndex !== -1) {
          this.scoresheet.players.home.forEach(p => {
            p.outcome.forEach(o => {
              if(o.rbiBy === this.selectedPlayer.id) {
                o.rbiBy = this.replacementPlayer.id
              }
            })
          })
          this.scoresheet.players.home.splice(homeIndex, 1, this.replacementPlayer)
        }
        if (awayIndex !== -1) {
          this.scoresheet.players.away.forEach(p => {
            p.outcome.forEach(o => {
              if(o.rbiBy === this.selectedPlayer.id) {
                o.rbiBy = this.replacementPlayer.id
              }
            })
          })
          this.scoresheet.players.away.splice(awayIndex, 1, this.replacementPlayer)
        }
        this.replacementPlayer = { id: null }
        this.inputSearchPlayer = ""
        this.selectedPlayer = { name: null }
        this.updateData()
      }
    },
    saveOutcome() {
      this.scoresheet.players[this.currentActiveBox[1]][this.currentActiveBox[2]].outcome[this.currentActiveBox[3]] = this.working_selectedOutcomeBox
      this.closeModal()
      this.updateData()
    },
    setLineup(team,homeAway) {
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
  mixins: [
    OutcomeMixin,
    KeyHandlerMixin,
  ],
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
        .map(p => new PlayerInGame({ ...p, assignedNumber: p.number.length !== 0 ? p.number : `P${++this.id}` ,probably: this.probablyRightPlayer }))
      this.scoresheet.players.home = this.$store.getters.getPlayersInTeam(this.scoresheet.teams.home.id)
        .map(p => new PlayerInGame({ ...p, assignedNumber: p.number.length !== 0 ? p.number : `P${++this.id}` ,probably: this.probablyRightPlayer }))
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
    window.addEventListener('keydown', this.handleKeys)
    this.broadcastChannel = new BroadcastChannel("gamecastChannel")
    this.broadcastChannel.onmessage = event => {}
    this.events.$on("escapePressed", this.closeModal)
    this.events.$on("enterPressed", this.saveOutcome)
    this.events.$on("advancePlayer", this.advancePlayer)
    this.events.$on("returnPlayer", this.returnPlayer)
    this.events.$on("move", this.moveThroughBoxes)
  },
  watch: {
    openRbiModal(value, oldVal) {
      if(value !== oldVal)
        this.working_selectedOutcomeBox = this.activePlayerBox
    }
  }

}
</script>
<style lang="scss" scoped>

    table {
      width:100%;
      text-align:center;
      tr {
        td {
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
      background:white !important;
      padding:0 0 !important;
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
  .probably {
    font-size: 1.2rem;
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
.editMode {
  table {
    td {
      &:nth-child(1) {
        max-width: 0.5rem;
      }
      &:nth-child(2) {
        min-width: 0rem;
      }

      &:last-child {
        max-width:  auto;
      }
    }
  }
  .ingame-outcome-box, .header-innings {
    display:none;
  }
}
</style>