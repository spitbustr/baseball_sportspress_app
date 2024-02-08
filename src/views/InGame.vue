<template>
  <div>
    <div>
      Game {{ game.id }}
    </div>
    <button @click="sendDataToWebsite">SEND DATA</button>
    <div :class="{ 'editMode': editMode }" class="tables-container">
      <div>
        <div>
          {{ teams.away.title.rendered }}
        </div>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Player</th>
              <th v-for="inning in scoresheet.innings" :key="inning">{{ inning }}</th>
            </tr>
          </thead>
          <draggable tag="tbody" :list="scoresheet.players.away" :options="{ animation: 150, group: 'players' }" ghost-class="ghost"
            :disabled="!editMode">
            <tr v-for="(player, $index) in scoresheet.players.away" :key="$index">
              <td>{{ player.assignedNumber }}</td>
              <td class="player-buttom-container">
                <button v-if="editMode" class="player-remove-button" @click="removePlayer(player, scoresheet.players.away)">X</button>
                <span v-html="player.name"></span>
                <button v-if="editMode" class="player-swap-button" @click="editPlayer(player, scoresheet.players.away)">SWAP</button>
              </td>
              <td v-for="inning in scoresheet.innings" :key="inning" @click="setActiveOutcome(`outcome_away_${$index}_${inning}`)"
                :class="{ active: active.outcomeBox === `outcome_away_${$index}_${inning}` }" class="ingame-outcome-box">
                <OutcomeBox :outcome="player.outcome[inning]"></OutcomeBox>
              </td>
            </tr>
          </draggable>
          <tr class="unclickable" v-if="editMode">
            <td :colspan="numberOfInnings + 2"><button @click="addPlayer(players.away)">Add Player</button></td>
          </tr>
        </table>
      </div>
      <div>
        <div>
          {{ teams.home.title.rendered }}
        </div>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Player</th>
              <th v-for="inning in scoresheet.innings" :key="inning">{{ inning }}</th>
            </tr>
          </thead>
          <draggable tag="tbody" :list="scoresheet.players.home" :options="{ animation: 150, group: 'players' }" ghost-class="ghost"
            :disabled="!editMode">
            <tr v-for="(player, $index) in scoresheet.players.home" :key="$index">
              <td>{{ player.assignedNumber }}</td>
              <td class="player-buttom-container">
                <button v-if="editMode" class="player-remove-button" @click="removePlayer(player, scoresheet.players.home)">X</button>
                <span v-html="player.name"></span>
                <button v-if="editMode" class="player-swap-button" @click="editPlayer(player, scoresheet.players.home)">SWAP</button>
              </td>
              <td v-for="inning in scoresheet.innings" :key="inning" @click="setActiveOutcome(`outcome_home_${$index}_${inning}`)"
                :class="{ active: active.outcomeBox === `outcome_home_${$index}_${inning}` }" class="ingame-outcome-box">
                <OutcomeBox :outcome="player.outcome[inning]"></OutcomeBox>
              </td>
            </tr>
          </draggable>
          <tr class="unclickable" v-if="editMode">
            <td :colspan="numberOfInnings + 2"><button @click="addPlayer(players.home)">Add Player</button></td>
          </tr>
        </table>
      </div>
    </div>
    <div class="edit-container">
      <button class="editButton" @click="toggleEditMode">Toggle Edit Mode</button>
    </div>
    <div class="action-buttons" v-if="!this.editMode">
      <div class="leftside">

        <button class="editButton" @click="setOutcome('1B')">1B</button>
        <button class="editButton" @click="setOutcome('2B')">2B</button>
        <button class="editButton" @click="setOutcome('3B')">3B</button>
        <button class="editButton" @click="setOutcome('4B')">4B</button>
        <button class="editButton" @click="setOutcome('HR')">HR</button>
        <button class="editButton" @click="setOutcome('FC')">FC</button>
        <button class="editButton" @click="setOutcome('SAC')">SAC</button>
        <button class="editButton" @click="setOutcome('BB')">BB</button>
        <button class="editButton" @click="setOutcome('K')">K</button>
        <button class="editButton" @click="setOutcome('E')">E</button>
      </div>
      <div class="midside">
        <button class="editButton" @click="setAtBase('first')">First Base</button>
        <button class="editButton" @click="setAtBase('second')">Second Base</button>
        <button class="editButton" @click="setAtBase('third')">Third Base</button>
        <button class="editButton" @click="setAtBase('point')"><b>Home Base</b></button>
      </div>
      <div class="rightside">
        <div style="display: flex;">
          <button class="editButton" @click="setInningEnd()">Inning End</button>
          <button class="editButton" @click="setPutOut()">Put Out</button>
        </div>
        <div class="rbi-input">
          <label id="rbi-input">RBI</label>
          <input for="rbi-input" type="text" size="5" v-model="rbiValue" />
          <button class="editButton" @click="setRBI()">Save RBI</button>
        </div>
      </div>
    </div>
    <Modal v-show="isPlayerModalVisible" @close="closeModal" >
      <template v-slot:header>
        Replace {{ selectedPlayer.name }} by
      </template>
      <template v-slot:body>
        <div>
          <div class="search-section">
            SEARCH:
            <input
              ype="text"
              @input="inputUpdate"
              :value="inputSearchPlayer"/>
          </div>
          <div class="player-replace-list" v-for="player in allAvailablePlayers" :key="player.id">
            <div @click="selectReplacementPlayer(player)" :class="{'selected': replacementPlayer.id === player.id}">{{ player.title.rendered }}</div>
          </div>
        </div>
      </template>
      <template v-slot:footer>
        <div class="player-replace-footer">
          <button @click="replacePlayer">ACCEPTER</button>
        </div>
      </template>
    </Modal>
    <Modal v-show="isOutcomeModalVisible" @close="closeModal" >
      <template v-slot:header>
        {{ selectedBatterOrder }} - Inning <b>{{ selectedInning }}</b>
      </template>
      <template v-slot:body>
        <div>
          <OutcomeBoxModal :selectedScoreBox="selectedOutcomeBox"></OutcomeBoxModal>
        </div>
      </template>
      <template v-slot:footer>
        <div class="player-replace-footer">
          <button @click="acceptOutcomePlayer">ACCEPTER</button>
        </div>
      </template>
    </Modal>
  </div>
</template>
<script>
import PlayerInGame from "@/models/PlayerInGame"
import GameEvent from "@/models/GameEvent"
import $settings from "@/data/settings.json"
import {removeAccents} from "@/scripts/utilities"
import ScoresheetAPIService from "@/services/ScoresheetAPIService"

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
      return this.allPlayers
        .filter(player => this.scoresheet.players.home.map(p => p.id).indexOf(player.id) === -1)
        .filter(player => this.scoresheet.players.away.map(p => p.id).indexOf(player.id) === -1)
        .filter(player => this.inputSearchPlayer?.length ? removeAccents(player.title?.rendered.toLowerCase())?.indexOf(removeAccents(this.inputSearchPlayer.toLowerCase())) !== -1: true)
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
    numberOfInnings() {
      return $settings.websiteConfig.innings.length
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
      scoresheet: {
        innings: null,
        players: {
          home: [],
          away: []
        },
        teams:  {
          home: null,
          away: null
        },
        gameId: null,
        scores: {
          away: {
            runs: [],
            errors: 0,
            estwo: 0,
            hits: 0,
            outcome: "",
          },
          home: {
            runs: [],
            errors: 0,
            estwo: 0,
            hits: 0,
            outcome: "",
          }
        }

      },
      teams:  {
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

      selectedPlayer: {name: "Peanuts"},
      selectedOutcomeBox: {name: "Peanuts"},
      replacementPlayer: {id:null},
      rbiValue: null,
      active: {
        player: null,
        outcomeBox: null
      },
      hasContentInDB: false,
    }
  },
  methods: {
    addPlayer(teamPlayers) {
      const player = this.allAvailablePlayers[0]
      teamPlayers.push(new PlayerInGame({ ...player, assignedNumber: player.number.length !== 0 ? player.number : `P${++this.id}` }))
      this.updateData()
    },
    editPlayer(player, list) {
      this.isPlayerModalVisible = true
      this.selectedPlayer = new PlayerInGame({ ...player, assignedNumber: player.number.length !== 0 ? player.number :  `P${++this.id}`  })
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
      else if(!this.editMode) {
        this.selectedOutcomeBox = this.activePlayerBox
        this.isOutcomeModalVisible = true
      }
    },
    toggleEditMode() {
      this.editMode = !this.editMode
    },
    setAtBase(base) {
      if (this.activePlayerBox && !this.editMode) {
        if (this.activePlayerBox.onBasePosition === base) {
          this.activePlayerBox.onBasePosition = null
        }
        else {
          this.activePlayerBox.onBasePosition = base
        }
        this.updateData()
      }

    },
    setOutcome(outcome) {
      if (this.activePlayerBox && !this.editMode) {
        if (this.activePlayerBox.atBatResult === outcome) {
          this.activePlayerBox.atBatResult = null
          this.activePlayerBox.putOut = false
          this.activePlayerBox.countAsHR = false
        }
        else {
          this.activePlayerBox.atBatResult = outcome
          switch (outcome) {
            case "1B":
              this.activePlayerBox.onBasePosition = "first"
              break
            case "2B":
              this.activePlayerBox.onBasePosition = "second"
              break
            case "3B":
              this.activePlayerBox.onBasePosition = "third"
              break
            case "4B":
              this.activePlayerBox.onBasePosition = "point"
              this.activePlayerBox.rbiBy = this.activePlayer?.assignedNumber
              break
            case "HR":
              this.activePlayerBox.onBasePosition = "point"
              this.activePlayerBox.rbiBy = this.activePlayer?.assignedNumber
              this.activePlayerBox.countAsHR = true
              break
            case "BB":
              this.activePlayerBox.onBasePosition = "first"
              break
            case "K":
              this.activePlayerBox.putOut = true
              this.activePlayerBox.onBasePosition = "empty"
              break
            case "FC":
              this.activePlayerBox.onBasePosition = "first"
              break
            case "E":
              this.activePlayerBox.onBasePosition = "first"
              break
            case "SAC":
              this.activePlayerBox.putOut = true
              break
          }
        }
        this.updateData()
      }
    },
    setPutOut() {
      if (this.activePlayerBox && !this.editMode) {
        this.activePlayerBox.putOut = !this.activePlayerBox.putOut
        this.updateData()
      }
    },
    setRBI() {
      if (this.activePlayerBox && !this.editMode) {
        this.activePlayerBox.rbiBy = this.rbiValue;
        if (this.rbiValue) {
          this.activePlayerBox.onBasePosition = "point"
        }
        this.rbiValue = null
        this.updateData()
      }
    },
    setInningEnd() {
      if (this.activePlayerBox && !this.editMode) {
        this.activePlayerBox.inningEnd = !this.activePlayerBox.inningEnd
        this.updateData()
      }
    },
    sendDataToWebsite() {
      this.gameEvent.prepareData(this.scoresheet)
    },
    closeModal() {
      this.isPlayerModalVisible = false
      this.isOutcomeModalVisible = false
    },
    inputUpdate(event) {
      this.inputSearchPlayer = event.target.value
    },
    selectReplacementPlayer(player) {
      this.replacementPlayer = new PlayerInGame({ ...player, assignedNumber: player.number.length !== 0 ? player.number :  `P${++this.id}`})
    },
    replacePlayer() {
      if(this.replacementPlayer?.id){
        this.isPlayerModalVisible = false
        const homeIndex = this.scoresheet.players.home.findIndex(p => {
          return p.id == this.selectedPlayer.id
        })
        const awayIndex = this.scoresheet.players.away.findIndex(p => {
          return p.id == this.selectedPlayer.id
        })


        if(homeIndex !== -1) {
          this.scoresheet.players.home.splice(homeIndex,1,this.replacementPlayer)
        }
        if(awayIndex !== -1) {
          this.scoresheet.players.away.splice(awayIndex,1,this.replacementPlayer)

        }
        this.replacementPlayer = {id:null}
        this.inputSearchPlayer = ""
        this.selectedPlayer = {name:null}
        this.updateData()
      }
    },
    updateData() {
      this.scoresheet.scores = this.gameEvent.generateScore(this.scoresheet)
      ScoresheetAPIService.saveData(this.scoresheet)
    }

  },
  async created() {
    this.scoresheet.gameId = this.$route?.params?.gameId
    if (this.scoresheet.gameId) {
      this.game = this.$store.getters.getGame(this.scoresheet.gameId)
      this.scoresheet.innings = $settings.websiteConfig.innings
      this.scoresheet.teams.away = this.$store.getters.getTeam(this.game?.teams[0])
      this.scoresheet.teams.home = this.$store.getters.getTeam(this.game?.teams[1])
      this.teams.away = this.scoresheet.teams.away
      this.teams.home = this.scoresheet.teams.home
      this.scoresheet.players.away = this.$store.getters.getPlayersInTeam(this.scoresheet.teams.away.id)
        .map(p => new PlayerInGame({ ...p, assignedNumber: p.number.length !== 0 ? p.number : `P${++this.id}`}))
      this.scoresheet.players.home = this.$store.getters.getPlayersInTeam(this.scoresheet.teams.home.id)
        .map(p => new PlayerInGame({ ...p, assignedNumber: p.number.length !== 0 ? p.number : `P${++this.id}` }))
    }
    await ScoresheetAPIService.checkData(this.$route?.params?.gameId).then(result => {
      this.hasContentInDB = result?.data?.id
    })
    if(this.hasContentInDB) {
      await ScoresheetAPIService.loadData(this.$route?.params?.gameId).then(result => {
        const obj = JSON.parse(result.jsonObject)
        obj.players.home = obj.players.home.map(p => new PlayerInGame(p))
        obj.players.away = obj.players.away.map(p => new PlayerInGame(p))
        this.scoresheet.players = obj.players
      })
      .catch(error => {
        console.log(error)
      })
    }
    else {
      await ScoresheetAPIService.createData(this.scoresheet)
    }
  },
}
</script>
<style lang="scss" scoped>
table,
td,
th {
  border-collapse: collapse;
  border: 1px solid #000000;
}

table {
  margin: 1rem 10px;

  tr {
    &:nth-child(even) {
      td {
        background: #F8F8FF;
      }
    }

    &:nth-child(odd) {
      td {
        background: #F5F5F5;
      }
    }

    th {
      padding: 0rem 1.25rem;
      background: darkgray;

      &:nth-child(1) {
        max-width: 1rem;
        padding: 0.25rem 1rem;
      }
    }

    td {
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

.ingame-outcome-box {
  padding: 2px 0 0;
}

.action-buttons {
  margin: 0;
  background: lime;
  position: fixed;
  bottom: 0;
  width: 100%;
  left: 0;
  display: flex;

  .leftside {}

  .midside {}

  .rightside {}
}

.editButton {
  padding: 1rem;
}

.rbi-input {
  display: flex;
}

.tables-container {
  display: flex;
  justify-content: center;
}

.edit-container {
  margin-bottom: 8rem;
}
.player-replace-list {
  padding: 0.15rem;
  cursor: pointer;
  .selected{
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
.player-buttom-container {
  position: relative;

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
.search-section {
  position: absolute;
  top: 0;
}

</style>