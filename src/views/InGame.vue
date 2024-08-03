<template>
  <nav class="navbar navbar-light bg-light py-4">
    <div class="container-fluid justify-content-between">
      <div class="game-date">
        <span class="navbar-brand mb-0 h1">{{ game.id }} - <span class="date-time">{{ getDateTime(game) }}</span></span>
      </div>
      <div class="game-settings d-flex gap-2">
        <button type="button editButton" class="btn btn-outline-primary d-flex align-items-center"
          @click="openGameEditModal"><span v-html="$settings.icons.settings"
            class="d-flex align-items-center pe-1"></span><span>Configuration</span></button>
        <button type="button editButton" class="btn btn-outline-primary d-flex align-items-center"
          @click="toggleEditMode"><span v-if="!editMode" v-html="$settings.icons.edit"
            class="d-flex align-items-center pe-1"></span><span v-if="editMode" v-html="$settings.icons.save"
            class="d-flex align-items-center pe-1"></span><span>{{ this.editMode ? "Sauvegarder" : "Éditer alignements"
            }}</span></button>
        <button class="btn btn-outline-primary d-flex align-items-center" type="button" @click="sendDataToWebsite"><span
            v-html="$settings.icons.publish" class="d-flex align-items-center pe-1"></span><span>Publier</span></button>
      </div>
    </div>
  </nav>
  <div class="container-fluid">
    <div :class="{ 'editMode': editMode }" class="scoresheet">
      <div class="row">
        <!-- AWAY TEAM -->

        <div class="col-md-6">
          <nav class="navbar navbar-light">
            <div class="container-fluid me-0 pe-0">
              <span class="navbar-brand mb-0 h1"> <img class="team-image"
                  :src="media[teams?.away?.featured_media] || defaultImage">
                {{ teams.away.title.rendered }}</span>
              <div class="d-flex btn-group" role="group" aria-label="Basic example">
                <button class="btn btn-outline-primary btn-sm d-flex align-items-center" v-if="editMode"
                  @click="setLineup(teams?.away, 'away')"><span v-html="$settings.icons.addPlayer"
                    class="d-flex align-items-center pe-1"></span> Ajouter régulier</button>
                <button class="btn btn-outline-primary btn-sm d-flex align-items-center" v-if="editMode"
                  @click="addSpare(teams?.away, 'away')">
                  <span v-html="$settings.icons.addPlayer" class="d-flex align-items-center pe-1"></span> Ajouter
                  remplaçant</button>
                <button class="btn btn-outline-primary btn-sm d-flex align-items-center" v-if="editMode"
                  @click="clearLineup('away')"><span v-html="$settings.icons.deleteLine"
                    class="d-flex align-items-center pe-1"></span> Supprimer tous</button>
              </div>
            </div>
          </nav>
          <table class="table table-bordered table-hover align-middle">
            <thead class="table-light">
              <tr>
                <th v-if="editMode" class="player-drag-col"></th>
                <th class="player-number-col">#</th>
                <th class="large-cell">Joueur</th>
                <template v-for="inning in numberOfInnings" :key="inning">
                  <th :colspan="displayExtraBlocks(inning, 'away')" class="header-innings">{{ inning }}</th>
                </template>
              </tr>
            </thead>
            <draggable @dragend="dragged" tag="tbody" :list="scoresheet.players.away"
              :options="{ animation: 150, group: 'players' }" handle=".drag-handler" ghost-class="ghost"
              :disabled="!editMode">
              <tr v-for="(player, $index) in scoresheet.players.away" :key="$index">
                <td v-if="editMode" class="drag-handler">
                  <span v-html="$settings.icons.dragLine"></span>
                </td>
                <td>{{ player.assignedNumber }}</td>
                <td class="player-button-container">
                  <span class="probably" v-if="player.probably">*</span>&nbsp;
                  <span v-html="player.name"></span>
                  <span class="d-flex align-items-center float-end">
                    <button v-if="editMode" class="btn btn-outline-secondary btn-sm d-flex align-items-center me-1"
                      @click="editPlayer(player, scoresheet.players.away)"><span v-html="$settings.icons.swap"
                        class="d-flex align-items-center pe-1"></span><span>Remplacer</span>
                    </button>
                    <button v-if="editMode"
                      class="btn btn-outline-danger btn-sm player-remove-button  d-flex align-items-center float-end"
                      @click="removePlayer(player, scoresheet.players.away)"><span v-html="$settings.icons.deleteLine"
                        class="d-flex align-items-center pe-1"></span><span>Supprimer</span></button>
                  </span>
                </td>
                <template v-for="inning in scoresheet.innings" :key="inning">
                  <td @click="setActiveOutcome(`outcome_away_${$index}_${inning}`)"
                    :class="{ 'active': active.outcomeBox === `outcome_away_${$index}_${inning}` }"
                    class="ingame-outcome-box">
                    <OutcomeBox :players="scoresheet.players.away" :outcome="player.outcome[inning]"></OutcomeBox>
                  </td>
                  <td v-for="(extraBlock, $$index) in playersExtraBlocks(inning, player)"
                    :key="`block-away-{$index}_${$$index}`"
                    @click="setActiveOutcome(`outcome_away_${$index}_${inning}_${extraBlock.extraId}`)"
                    :class="{ 'active': active.outcomeBox === `outcome_away_${$index}_${inning}_${extraBlock.extraId}` }"
                    class="ingame-outcome-box extra">
                    <OutcomeBox :players="scoresheet.players.away" :outcome="extraBlock"></OutcomeBox>
                  </td>
                </template>
              </tr>
            </draggable>

          </table>
          <!--
          <div class="d-grid gap-2">
            <button class="btn btn-outline-primary btn-lg" v-if="editMode"
              @click="addPlayer(scoresheet.players.away)">Ajouter</button>
          </div>
          -->
        </div>

        <!-- HOME TEAM -->
        <div class="col-md-6">
          <nav class="navbar navbar-light">
            <div class="container-fluid me-0 pe-0">
              <span class="navbar-brand mb-0 h1"> <img class="team-image"
                  :src="media[teams?.home?.featured_media] || defaultImage">
                {{ teams.home.title.rendered }}</span>
              <div class="d-flex btn-group" role="group" aria-label="Basic example">
                <button class="btn btn-outline-primary btn-sm d-flex align-items-center" v-if="editMode"
                  @click="setLineup(teams?.home, 'home')"><span v-html="$settings.icons.addPlayer"
                    class="d-flex align-items-center pe-1"></span> Ajouter régulier</button>
                <button class="btn btn-outline-primary btn-sm d-flex align-items-center" v-if="editMode"
                  @click="addSpare(teams?.home, 'home')">
                  <span v-html="$settings.icons.addPlayer" class="d-flex align-items-center pe-1"></span> Ajouter
                  remplaçant</button>
                <button class="btn btn-outline-primary btn-sm d-flex align-items-center" v-if="editMode"
                  @click="clearLineup('home')"><span v-html="$settings.icons.deleteLine"
                    class="d-flex align-items-center pe-1"></span> Supprimer tous</button>
              </div>

            </div>
          </nav>
          <table class="table table-bordered table-hover align-middle">
            <thead class="table-light">
              <tr>
                <th v-if="editMode" class="player-drag-col"></th>
                <th class="player-number-col">#</th>
                <th class="large-cell">Joueur</th>
                <template v-for="inning in numberOfInnings" :key="inning">
                  <th :colspan="displayExtraBlocks(inning, 'home')" class="header-innings">{{ inning }}</th>
                </template>
              </tr>
            </thead>
            <draggable @dragend="dragged" tag="tbody" :list="scoresheet.players.home"
              :options="{ animation: 150, group: 'players' }" handle=".drag-handler" ghost-class="ghost"
              :disabled="!editMode">
              <tr v-for="(player, $index) in scoresheet.players.home" :key="$index">
                <td v-if="editMode" class="drag-handler">
                  <span v-html="$settings.icons.dragLine"></span>
                </td>
                <td>{{ player.assignedNumber }}</td>
                <td class="player-button-container">
                  <span class="probably" v-if="player.probably">*</span>
                  <span v-html="player.name"></span>
                  <span class="d-flex align-items-center float-end">
                    <button v-if="editMode" class="btn btn-outline-secondary btn-sm d-flex align-items-center me-1"
                      @click="editPlayer(player, scoresheet.players.home)"><span v-html="$settings.icons.swap"
                        class="d-flex align-items-center pe-1"></span><span>Remplacer</span>
                    </button>
                    <button v-if="editMode"
                      class="btn btn-outline-danger btn-sm player-remove-button d-flex align-items-center"
                      @click="removePlayer(player, scoresheet.players.home)"><span v-html="$settings.icons.deleteLine"
                        class="d-flex align-items-center pe-1"></span><span>Supprimer</span></button>

                  </span>
                </td>
                <template v-for="inning in scoresheet.innings" :key="inning">
                  <td @click="setActiveOutcome(`outcome_home_${$index}_${inning}`)"
                    :class="{ 'active': active.outcomeBox === `outcome_home_${$index}_${inning}` }"
                    class="ingame-outcome-box">
                    <OutcomeBox :players="scoresheet.players.home" :outcome="player.outcome[inning]"></OutcomeBox>
                  </td>
                  <td v-for="(extraBlock, $$index) in playersExtraBlocks(inning, player)" style="background: red;"
                    :key="`block-home-{$index}_${$$index}`"
                    @click="setActiveOutcome(`outcome_home_${$index}_${inning}_${extraBlock.extraId}`)"
                    :class="{ 'active': active.outcomeBox === `outcome_home_${$index}_${inning}_${extraBlock.extraId}` }"
                    class="ingame-outcome-box extra">
                    <OutcomeBox :players="scoresheet.players.home" :outcome="extraBlock"></OutcomeBox>
                  </td>
                </template>
              </tr>
            </draggable>
          </table>
          <!--
          <div class="d-grid gap-2">
            <button class="btn btn-outline-primary btn-lg" v-if="editMode"
              @click="addPlayer(scoresheet.players.home)">Ajouter</button>
          </div>
          -->
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
                <th>Équipes</th>
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
        <h5 class="modal-title">Remplacer <b><span v-html="selectedPlayer.name"></span></b></h5>
      </template>
      <template v-slot:subheader>
        <div class="search-section">
          <div class="input-group flex-nowrap">
            <span class="input-group-text" id="addon-wrapping"><span v-html="$settings.icons.search"
                class="d-flex align-items-center pe-1"></span></span>
            <input type="text" class="form-control" @input="inputUpdate" :value="inputSearchPlayer"
              placeholder="Rechercher un joueur..." aria-label="Username" aria-describedby="addon-wrapping">
          </div>
        </div>
        <!-- <button @click="probablyPlayer()">PROBABLY<span class="probably" v-if="probablyRightPlayer">*</span></button> -->
      </template>
      <template v-slot:body>
        <div class="scrollable-section">
          <div v-for="player in allAvailablePlayers" :key="player.id">
            <div class="d-flex align-items-center justify-content-between py-2"><span
                v-html="player.title.rendered"></span>
              <button class="btn btn-outline-primary btn-sm d-flex align-items-center"
                @click="selectReplacementPlayer(player, 'replace')"><span v-html="$settings.icons.add"
                  class="d-flex align-items-center pe-1"></span><span>Choisir</span></button>

            </div>
          </div>

        </div>
      </template>
      <template v-slot:footer>
        <button class="btn btn-primary d-flex align-items-center" @click="addNewPlayer()"><span
            v-html="$settings.icons.add" class="d-flex align-items-center pe-1"></span><span>Nouveau
            joueur</span></button>
      </template>
    </Modal>

    <!-- SETTING LINE UP MODAL -->
    <Modal v-show="settingLineup.open" @close="closeModal">
      <template v-slot:header>
        <h5 class="modal-title">Joueurs R&eacute;guliers - {{ settingLineup.team.name }}</h5>
      </template>
      <template v-slot:subheader>
        <div class="search-section">
          <div class="input-group flex-nowrap">
            <span class="input-group-text" id="addon-wrapping"><span v-html="$settings.icons.search"
                class="d-flex align-items-center pe-1"></span></span>
            <input type="text" class="form-control" @input="inputUpdate" :value="inputSearchPlayer"
              placeholder="Rechercher un joueur..." aria-label="Username" aria-describedby="addon-wrapping">
          </div>
        </div>
        <!--  <button v-if="scoresheet.players?.[settingLineup.team.homeAway]?.length"
              @click="undoAddPlayer(scoresheet.players?.[settingLineup.team.homeAway])">UNDO</button>
           <button @click="addNewPlayer()">NEW PLAYER</button>
            <button @click="probablyPlayer()">PROBABLY<span class="probably"
                v-if="probablyRightPlayer">*</span></button> -->

      </template>
      <template v-slot:body>
        <div class="scrollable-section">
          <div v-for="player in teamPlayers(settingLineup.team.id)" :key="player.id">
            <!--<div v-for="player in allAvailablePlayers" :key="player.id">-->
            <div class="d-flex align-items-center justify-content-between py-2"><span
                v-html="player.title.rendered"></span>
              <button class="btn btn-outline-primary btn-sm d-flex align-items-center"
                @click="selectReplacementPlayer(player, 'setlineup')"><span v-html="$settings.icons.add"
                  class="d-flex align-items-center pe-1"></span><span>Ajouter</span></button>
            </div>
          </div>
        </div>
      </template>
      <template v-slot:footer>
        <button class="btn btn-primary d-flex align-items-center" @click="addNewPlayer()"><span
            v-html="$settings.icons.add" class="d-flex align-items-center pe-1"></span><span>Nouveau
            joueur</span></button>
      </template>
    </Modal>

    <!-- ADD SPARE UP MODAL -->
    <Modal v-show="addSpares.open" @close="closeModal">
      <template v-slot:header>
        <h5 class="modal-title">Ajouter un remplaçant - {{ addSpares.team.name }}</h5>
      </template>
      <template v-slot:subheader>
        <div class="search-section">
          <div class="input-group flex-nowrap">
            <span class="input-group-text" id="addon-wrapping"><span v-html="$settings.icons.search"
                class="d-flex align-items-center pe-1"></span></span>
            <input type="text" class="form-control" @input="inputUpdate" :value="inputSearchPlayer"
              placeholder="Rechercher un joueur..." aria-label="Username" aria-describedby="addon-wrapping">
          </div>
        </div>
        <!--
            <button v-if="scoresheet.players?.[addSpares.team.homeAway]?.length"
              @click="undoAddPlayer(scoresheet.players?.[addSpares.team.homeAway])">UNDO</button>
            <button @click="addNewPlayer()">NEW PLAYER</button>
            <button @click="probablyPlayer()">PROBABLY<span class="probably"
                v-if="probablyRightPlayer">*</span></button>
            -->
      </template>
      <template v-slot:body>
        <div class="scrollable-section">
          <div v-for="player in sparePlayers" :key="player.id">
            <!--<div v-for="player in allAvailablePlayers" :key="player.id">-->
            <div class="d-flex align-items-center justify-content-between py-2"><span
                v-html="player.title.rendered"></span>
              <button class="btn btn-outline-primary btn-sm d-flex align-items-center"
                @click="selectReplacementPlayer(player, 'addspare')"><span v-html="$settings.icons.add"
                  class="d-flex align-items-center pe-1"></span><span>Ajouter</span></button>
            </div>
          </div>
        </div>
      </template>
      <template v-slot:footer>
        <button class="btn btn-primary d-flex align-items-center" @click="addNewPlayer()"><span
            v-html="$settings.icons.add" class="d-flex align-items-center pe-1"></span><span>Nouveau
            joueur</span></button>
      </template>
    </Modal>



    <AddPlayer @closeModal="closeModal()" :show="isAddNewPlayerModalVisible"></AddPlayer>
    <!-- AT-BAT OUTCOME MODAL -->
    <Modal v-show="isOutcomeModalVisible" @close="closeModal">
      <template v-slot:header>
        <h5 class="modal-title"><b><span v-html="selectedBatterOrder"></span></b> - Manche {{ selectedInning }}</h5>
      </template>
      <template v-slot:body>
        <div>
          <OutcomeBoxModal :selectedOutcomeBox="working_selectedOutcomeBox" @updateOutcome="updateOutcomeBox($event)"
            :activePlayer="currentActivePlayer" :isOutcomeModalVisible="isOutcomeModalVisible"
            :players="scoresheet.players?.[this.currentActiveBox?.[1]]">
          </OutcomeBoxModal>
        </div>
      </template>
      <template v-slot:footer>
        <div class="outcome-save-button d-grid gap-2 d-md-flex justify-content-md-end">
        <button class="btn btn-primary" @click="saveOutcome">Accepter</button>
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
                <option v-for="player in scoresheet.players?.[this.currentActiveBox?.[1]]" :value="player.id"
                  :key="player.id"><span v-html="player.name"></span></option>
              </select>
            </div>
          </div>
        </div>
      </template>
      <template v-slot:footer>
        <button class="btn btn-primary" @click="saveOutcome">Accepter</button>
      </template>
    </Modal>


    <!-- GAME SETTINGS MODAL -->
    <Modal v-show="gameEditModal" @close="closeModal">
      <template v-slot:header>
        <h5 class="modal-title">Configuration</h5>
      </template>
      <template v-slot:body>
        <div class="mb-3">
        <label for="inningNumber" class="form-label">Nombre de manches</label>
        <input type="number" class="form-control" v-model="configChanges.innings" id="inningNumber">
      </div>
          <div class="mb-3">
          </div>
      </template>
      <template v-slot:footer>
          <button class="btn btn-info me-auto" @click="pullLocalData">Pull Local Data</button>
          <button class="btn btn-primary" @click="saveConfigChanges">Accepter</button>
      </template>
    </Modal>



    <!-- Loading Modal -->
    <Modal type="loading" v-show="loading">
      <template v-slot:body>
        <div class="d-flex align-items-center gap-2">
          <div class="spinner-border text-secondary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <div>Publication de la partie</div>
        </div>
      </template>
    </Modal>
  </div>
</template>
<script>
import Vue from "vue"
import { PlayerInGame, InGameResults } from "@/models/PlayerInGame"
import GameEvent from "@/models/GameEvent"
import $settings from "@/data/settings.json"
import { removeAccents } from "@/scripts/utilities"
import ScoresheetAPIService from "@/services/ScoresheetAPIService"
import { clone } from "@/scripts/utilities"
import moment from "moment"
import { VueDraggableNext } from 'vue-draggable-next'
import OutcomeMixin from "@/mixins/OutcomeMixin"
import KeyHandlerMixin from "@/mixins/KeyHandlerMixin"
import { debounce } from "lodash"


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
        || this.addSpares.open
        || this.probablyRightPlayer
        || this.openRbiModal
        || this.gameEditModal
    },
    allPlayers() {
      return this.$store.getters.getAllPlayers
        .slice()
        .sort((a, b) => {
          const titleA = a.title?.rendered?.toLowerCase();
          const titleB = b.title?.rendered?.toLowerCase();
          if (titleA < titleB) return -1;
          if (titleA > titleB) return 1;
          return 0;
        })
    },
    allAvailablePlayers() {
      if (this.inputSearchPlayer?.length) {
        return this.allPlayers
          .filter(player => this.inputSearchPlayer?.length ? removeAccents(player.title?.rendered.toLowerCase())?.indexOf(removeAccents(this.inputSearchPlayer.toLowerCase())) !== -1 : true)
      }
      else {
        return this.allPlayers
      }
    },
    teamPlayers() {
      return (filter) => {
        return this.allAvailablePlayers
          .filter(player => player.current_teams.flat().indexOf(+filter) !== -1 && player?.title?.rendered.indexOf("(R)") === -1 && player.seasons.flat().indexOf($settings.playballConfig.season) !== -1)
      }
    },
    sparePlayers() {
      return this.allAvailablePlayers
        .filter(player => player?.title?.rendered.indexOf("(R)") !== -1)
    },
    currentActiveBox() {
      return this.active?.outcomeBox?.split("_")
    },
    currentActivePlayer() {
      return this.scoresheet.players?.[this.currentActiveBox?.[1]]?.[this.currentActiveBox?.[2]] || null
    },
    currentActivePlayerBox() {
      if (this.currentActiveBox?.[4]) {
        const activeBlock = this.currentActivePlayer?.extraOutcome.find(o => {
          return o.inning == this.currentActiveBox?.[3] && o.extraId == this.currentActiveBox?.[4]
        })
        return activeBlock || null
      }
      return this.currentActivePlayer?.outcome?.[this.currentActiveBox?.[3]] || null
    },
    defaultImage() {
      return require(`@/assets/images/defaults/team_home.png`)
    },
    media() {
      return this.$store.state.data.media
    },
    numberOfInnings() {
      return this.scoresheet.innings || $settings.playballConfig.innings
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
            runs: new Array($settings.playballConfig.innings + 1).fill(0),
            errors: 0,
            estwo: 0,
            hits: 0,
            outcome: "",
          },
          home: {
            runs: new Array($settings.playballConfig.innings + 1).fill(0),
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

      gameEditModal: false,
      editMode: false,
      inputSearchPlayer: "",

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
      addSpares: {
        open: false,
        team: {
          id: null,
          name: "",
          playerType: "spare",
        }
      },
      probablyRightPlayer: false,
      hasContentInDB: false,
      loading: false,

      configChanges: {
        innings: 0,
      },

      extraBlocks: {
        away: [],
        home: [],
      }
    }
  },
  methods: {
    allPlayersWentAtBat(inning, players) {
      const allPlayersOutcome = players.map(p => new InGameResults(p.outcome?.[inning]))
      return !!(!!(allPlayersOutcome?.length) && allPlayersOutcome.every(o => o?.wentAtBat))
    },
    displayExtraBlocks(inning, homeAway) {
      return this.scoresheet.players?.[homeAway]?.[0]?.extraOutcome.filter(o => o?.inning == inning).length + 1
    },
    saveConfigChanges() {
      this.scoresheet.innings = this.configChanges.innings
      this.addExtraInning()
      this.closeModal()
    },
    advancePlayer() {
      if (this.activePlayerBox?.atBatResult) {
        if (this.activePlayerBox?.onBasePosition === "third") {
          this.setAtBase("point")
          this.activePlayerBox.rbiBy = this.currentActivePlayer?.id
          this.openRbiModal = true
        }
        else if (this.activePlayerBox?.onBasePosition === "second") {
          this.setAtBase("third")
          this.activePlayerBox.rbiBy = null
        }
        else if (this.activePlayerBox?.onBasePosition === "first") {
          this.setAtBase("second")
          this.activePlayerBox.rbiBy = null
        }
      }
    },
    returnPlayer() {
      if (this.activePlayerBox?.atBatResult) {
        if (this.activePlayerBox?.onBasePosition === "second") {
          this.activePlayerBox.rbiBy = null
          this.setAtBase("first")
        }
        else if (this.activePlayerBox?.onBasePosition === "third") {
          this.activePlayerBox.rbiBy = null
          this.setAtBase("second")
        }
        else if (this.activePlayerBox?.onBasePosition === "point") {
          this.activePlayerBox.rbiBy = null
          this.setAtBase("third")
        }
      }
    },
    addExtraInning() {
      this.scoresheet.players.away.forEach(p => {
        for (let i = p?.outcome?.length || 0; i > this.scoresheet.innings + 1; i--) {
          p.outcome.pop()
        }
        for (let i = 0; i <= this.scoresheet.innings; i++) {
          if (p.outcome?.[i]) {
          }
          else {
            p.outcome.push(new InGameResults())
          }
        }
      })
      this.scoresheet.players.away.forEach(p => {
        for (let i = p?.outcome?.length || 0; i > this.scoresheet.innings + 1; i--) {
          p.outcome.pop()
        }
        for (let i = 0; i <= this.scoresheet.innings; i++) {
          if (p.outcome?.[i]) {
          }
          else {
            p.outcome.push(new InGameResults())
          }
        }
      })
    },
    addNewPlayer() {
      this.isAddNewPlayerModalVisible = true
    },

    async addPlayer(teamPlayers) {
      console.log(teamPlayers)
      const player = this.allAvailablePlayers[0]
      const extraOutcome = teamPlayers?.[0]?.extraOutcome.map(o => new InGameResults({ inning: o?.inning, extraId: o?.extraId }))
      teamPlayers.push(new PlayerInGame({ ...player, extraOutcome, assignedNumber: player.number.length !== 0 ? player.number : `P${++this.id}`, probably: this.probablyRightPlayer, innings: this.scoresheet.innings }))
      this.probablyRightPlayer = false
      await this.updateData()
    },
    closeModal() {
      this.isAddNewPlayerModalVisible = false
      this.isPlayerModalVisible = false
      this.isOutcomeModalVisible = false
      this.settingLineup.open = false
      this.addSpares.open = false
      this.probablyRightPlayer = false
      this.openRbiModal = false
      this.gameEditModal = false
    },
    clearLineup(team) {
      this.scoresheet.players[team] = []
    },
    async dragged(event) {
      await this.updateData()
    },
    editPlayer(player, list) {
      this.isPlayerModalVisible = true
      this.selectedPlayer = new PlayerInGame({ ...player, assignedNumber: player.number.length !== 0 ? player.number : `P${++this.id}`, probably: this.probablyRightPlayer, innings: this.scoresheet.innings })
      this.probablyRightPlayer = false
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
    getPlayedInnings(players) {
      const outcomes = [...players.away.map(p => p.outcome), ...players.home.map(p => p.outcome)]
      const innings = $settings.playballConfig.innings
      let lastInningPlayed = 0
      outcomes.forEach((outcome, $index) => {
        outcome.forEach((o, inning) => {
          const out = new InGameResults(o)
          if (out.wentAtBat) {
            lastInningPlayed = inning
          }
        })
      })
      return innings < lastInningPlayed ? lastInningPlayed : innings
    },
    allExtraBlocksWentAtBat(inning, players, extraId) {
      const allPlayersOutcome = players.map(p => p.extraOutcome).flat()
      return !!(!!(allPlayersOutcome?.length) && allPlayersOutcome.every(o => new InGameResults(o)?.wentAtBat))
    },
    addExtraBlocks(inning, extraId, players) {
      players.forEach(p => {
        p.extraOutcome.push(new InGameResults({ extraId: extraId, inning: inning }))
      })
    },
    haveExtrablocksForInning(inning, players, extraId) {
      if (players?.[0]?.extraOutcome.filter(o => o.inning == inning)?.length) {
        return true
      }
      return false
    },
    handleExtraBlocks(players) {
      let extraId = 1
      let enoughExtras = true
      for (let i = 1; i <= this.scoresheet.innings; i++) {
        enoughExtras = true
        if (this.allPlayersWentAtBat(i, players)) {
          while (enoughExtras) {
            if (!this.haveExtrablocksForInning(i, players, extraId)) {
              this.addExtraBlocks(i, extraId, players)
              enoughExtras = false
            }
            else {
              enoughExtras = false
            }
            if (this.allExtraBlocksWentAtBat(i, players, extraId)) {
              extraId++
              this.addExtraBlocks(i, extraId, players)
            }
            else {
              enoughExtras = false
            }
          }
        }
      }
    },
    handleKeys(event) {
      this.handleShortcutKeys(event, this.active.outcomeBox, this.allModalToggle)
    },
    moveThroughBoxes(arrow) {
      const prop = this.currentActiveBox?.[0]
      const homeAway = this.currentActiveBox?.[1]
      const row = +this.currentActiveBox?.[2]
      const col = +this.currentActiveBox?.[3]
      const extraBlock = +this.currentActiveBox?.[4]
      if (arrow === "up" && row > 0) {
        this.setActiveOutcome(`${prop}_${homeAway}_${row - 1}_${col}`)
      }
      if (arrow === "down" && row < this.scoresheet.players?.[homeAway]?.length - 1) {
        this.setActiveOutcome(`${prop}_${homeAway}_${row + 1}_${col}`)
      }
      if (arrow === "left" && col > 1) {
        this.setActiveOutcome(`${prop}_${homeAway}_${row}_${col - 1}`)
      }
      if (arrow === "right" && col < this.numberOfInnings) {
        this.setActiveOutcome(`${prop}_${homeAway}_${row}_${col + 1}`)
      }
    },
    async removePlayer(player, list) {
      const playerIndex = list.findIndex(p => p?.id === player?.id)
      if (playerIndex !== -1) {
        list.splice(playerIndex, 1)
      }
      this.$toast.error(`<div class="d-inline-flex align-items-cente p-2"><div class="d-flex align-items-center pe-1">${$settings.icons.error}</div><div><b>${player?.title?.rendered}</b> a été supprimé</div></div>`)
    },
    playersExtraBlocks(inning, player) {
      return player?.extraOutcome?.filter(o => o?.inning == inning)
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
    async toggleEditMode() {
      this.editMode = !this.editMode
      if (!this.editMode) {
        await this.updateData()
      }
    },
    async openGameEditModal() {
      this.gameEditModal = true
    },

    async sendDataToWebsite() {
      this.loading = true
      await this.updateData()
      this.gameEvent.prepareData(this.scoresheet).then(result => {
        this.$toast.success(`<div class="d-inline-flex align-items-cente p-2"><div class="d-flex align-items-center pe-1">${$settings.icons.success}</div><div>Les données ont été envoyées</div>`)
      }, (error) => {
        this.$toast.error(`<div class="d-inline-flex align-items-cente p-2"><div class="d-flex align-items-center pe-1">${$settings.icons.error}</div><div>L'envoie a échoué</div>`)
      }).finally(() => {
        this.loading = false
      })
    },

    inputUpdate(event) {
      this.inputSearchPlayer = event.target.value
    },

    async selectReplacementPlayer(player, action) {
      this.replacementPlayer = new PlayerInGame({ ...player, assignedNumber: player.number.length !== 0 ? player.number : `P${++this.id}`, probably: this.probablyRightPlayer, innings: this.scoresheet.innings })
      if (player?.id && player?.id === this.replacementPlayer?.id) {
        if (action === "setlineup") {
          const homeAway = this.settingLineup.team.homeAway
          this.setLineupAddPlayer(homeAway)
        }
        else if (action === "addspare") {
          const homeAway = this.addSpares.team.homeAway
          this.setLineupAddPlayer(homeAway)
        }
        else if (action === "replace") {
          this.replacePlayer()

        }
        this.replacementPlayer = null
        this.homeAway = null;

      }
    },
    probablyPlayer() {
      this.probablyRightPlayer = !this.probablyRightPlayer
    },
    async replacePlayer() {
      if (this.replacementPlayer?.id) {
        this.replacementPlayer.outcome = this.selectedPlayer.outcome
        this.replacementPlayer.extraOutcome = this.selectedPlayer.extraOutcome
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
              if (o.rbiBy === this.selectedPlayer.id) {
                o.rbiBy = this.replacementPlayer.id
              }
            })
          })
          this.scoresheet.players.home.splice(homeIndex, 1, this.replacementPlayer)
        }
        if (awayIndex !== -1) {
          this.scoresheet.players.away.forEach(p => {
            p.outcome.forEach(o => {
              if (o.rbiBy === this.selectedPlayer.id) {
                o.rbiBy = this.replacementPlayer.id
              }
            })
          })
          this.scoresheet.players.away.splice(awayIndex, 1, this.replacementPlayer)
        }
        this.$toast.success(`<div class="d-inline-flex align-items-cente p-2"><div class="d-flex align-items-center pe-1">${$settings.icons.success}</div><div><b>${this.replacementPlayer?.title?.rendered}</b> a remplacé ${this.selectedPlayer?.title?.rendered}</div>`)
        this.replacementPlayer = { id: null }
        this.inputSearchPlayer = ""
        this.selectedPlayer = { name: null }
        await this.updateData()
      }
    },
    async saveOutcome() {
      if (this.currentActiveBox[4]) {
        this.scoresheet.players[this.currentActiveBox[1]][this.currentActiveBox[2]].extraOutcome.find(o => o.id === this.currentActiveBox[4])
      }
      else {
        this.scoresheet.players[this.currentActiveBox[1]][this.currentActiveBox[2]].outcome[this.currentActiveBox[3]] = this.working_selectedOutcomeBox
      }
      this.closeModal()
      await this.updateData()
    },
    setLineup(team, homeAway) {
      this.settingLineup = {
        open: true,
        team: {
          id: team.id,
          name: team?.title?.rendered || homeAway,
          homeAway: homeAway,
        },
      }
    },
    addSpare(team, homeAway) {
      this.addSpares = {
        open: true,
        team: {
          id: team.id,
          name: team?.title?.rendered || homeAway,
          homeAway: homeAway,
          playerType: "spare",
        },
      }

    },
    async setLineupAddPlayer(location) {
      const player = this.replacementPlayer
      const homeAway = location
      const extraOutcome = this.getExtraOutcomes(this.settingLineup.team.homeAway)?.map(o => {
        return {
          ...o,
          inning: o.inning,
          extraId: o.extraId
        }
      })
      const newPlayer = new PlayerInGame({ ...player, extraOutcome })
      this.scoresheet.players[homeAway].push(player)
      this.$toast.success(`<div class="d-inline-flex align-items-cente p-2"><div class="d-flex align-items-center pe-1">${$settings.icons.success}</div><div><b>${player?.title?.rendered}</b> a été ajouté</div>`)
    },
    getExtraOutcomes(homeAway) {
      return this.players?.[homeAway]?.[0].extraOutcome
    },
    pullLocalData() {
      const data = localStorage.getItem(`current-matchup-${this.game?.id}`)
      let obj = JSON.parse(data)
      if (obj.gameId) {
        obj = {
          ...obj,
          players: {
            home: obj.players.home
              .map(p => new PlayerInGame(p)) || [],
            away: obj.players.away.map(p => new PlayerInGame(p)) || [],
          },
        }
        this.scoresheet = obj
      }
    },
    sendPostMessage() {
      this.broadcastChannel.postMessage(clone(this.scoresheet), "*")
    },
    async updateData() {
      this.handleExtraBlocks(this.scoresheet.players.away)
      this.handleExtraBlocks(this.scoresheet.players.home)
      if (!this.hasContentInDB) {
        await ScoresheetAPIService.checkData(this.$route?.params?.gameId).then(result => {
          this.hasContentInDB = result?.data?.id
        }, (error) => {
          this.$toast.error(`<div class="d-inline-flex align-items-cente p-2"><div class="d-flex align-items-center pe-1">${$settings.icons.error}</div><div>Erreur de connexion</div>`)
        })
        if (!this.hasContentInDB) {
          await ScoresheetAPIService.createData(this.scoresheet).then(() => {

          }, (error) => {
            this.$toast.error(`<div class="d-inline-flex align-items-cente p-2"><div class="d-flex align-items-center pe-1">${$settings.icons.error}</div><div>Erreur de connexion</div>`)
          })
        }
      }
      this.scoresheet.scores = this.gameEvent.generateScore(this.scoresheet)
      localStorage.setItem("cast-matchup", JSON.stringify(this.scoresheet))
      localStorage.setItem(`current-matchup-${this.game?.id}`, JSON.stringify(this.scoresheet))
      await ScoresheetAPIService.saveData(this.scoresheet).then(() => { }, (error) => {
          this.$toast.error(`<div class="d-inline-flex align-items-cente p-2"><div class="d-flex align-items-center pe-1">${$settings.icons.error}</div><div>Erreur de connexion à la base de données</div>`)
      })
      this.sendPostMessage()
    },
    updateOutcomeBox(value) {
      this.working_selectedOutcomeBox = value
    },
    undoAddPlayer(list) {
      const player = clone(list[list.length - 1])
      list = list.pop()
      this.$toast.error(`<div class="d-inline-flex align-items-cente p-2"><div class="d-flex align-items-center pe-1">${$settings.icons.error}</div><div><b>${player?.title?.rendered}</b> a été supprimé</div>`)
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
      this.scoresheet.innings = $settings.playballConfig.innings
      this.scoresheet.teams.away = this.$store.getters.getTeam(this.game?.teams[0])
      this.scoresheet.teams.home = this.$store.getters.getTeam(this.game?.teams[1])
      this.teams.away = this.scoresheet.teams.away
      this.teams.home = this.scoresheet.teams.home
      this.scoresheet.players.away = this.$store.getters.getPlayersInTeam(this.scoresheet.teams.away.id, $settings.playballConfig.season)
        .map(p => new PlayerInGame({ ...p, assignedNumber: p.number.length !== 0 ? p.number : `P${++this.id}`, probably: this.probablyRightPlayer, innings: this.scoresheet.innings }))
      this.scoresheet.players.home = this.$store.getters.getPlayersInTeam(this.scoresheet.teams.home.id, $settings.playballConfig.season)
        .map(p => new PlayerInGame({ ...p, assignedNumber: p.number.length !== 0 ? p.number : `P${++this.id}`, probably: this.probablyRightPlayer, innings: this.scoresheet.innings }))
    }
    await ScoresheetAPIService.checkData(this.$route?.params?.gameId).then(result => {
      this.hasContentInDB = result?.data?.id
    }, () => {
    })
    if (this.hasContentInDB) {
      await ScoresheetAPIService.loadData(this.$route?.params?.gameId).then(result => {
        const obj = JSON.parse(result.jsonObject)

        /// ADDED CONDITION TO CHECK IF GAME IS OVER
        if (this.game.status === "future" || (this.game.status === "publish" && (obj.scores.away.outcome === "" && obj.scores.home.outcome === ""))) {
        } else {
          obj.players.home = obj.players.home.map(p => new PlayerInGame(p))
          obj.players.away = obj.players.away.map(p => new PlayerInGame(p))
          console.log(this.game.status);
          this.scoresheet.players = obj.players
          this.scoresheet.innings = this.getPlayedInnings(this.scoresheet.players)
        }

      }, (error) => {
        console.error(error)
      })
    }
    else {
      await ScoresheetAPIService.createData(this.scoresheet)
    }
    this.scoresheet.scores = this.gameEvent.generateScore(this.scoresheet)
    this.configChanges = {
      innings: this.scoresheet.innings
    }
  },
  mounted() {
    window.addEventListener('keydown', this.handleKeys)
    this.broadcastChannel = new BroadcastChannel("gamecastChannel")
    this.broadcastChannel.onmessage = event => { }
    this.events.$on("escapePressed", this.closeModal)
    this.events.$on("enterPressed", this.saveOutcome)
    this.events.$on("advancePlayer", this.advancePlayer)
    this.events.$on("returnPlayer", this.returnPlayer)
    this.events.$on("move", this.moveThroughBoxes)
  },
  watch: {
    openRbiModal(value, oldVal) {
      if (value !== oldVal)
        this.working_selectedOutcomeBox = this.activePlayerBox
    }
  }

}
</script>
<style lang="scss" scoped>
table {
  width: 100%;
  text-align: center;

  tr {
    th.player-drag-col {
      width: 36px;
    }

    th.player-number-col {
      width: 48px;
    }

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
  background: white !important;
  padding: 0 0 !important;
}

.ingame-outcome-box {
  padding: 2px;

  &.extra {
    background: #f6fafd;
  }
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



.scoresheet-results-scores {
  table {
    margin: 1rem auto;

    td {
      vertical-align: middle;
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

    td,
    th {
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
        max-width: auto;
      }
    }
  }

  .ingame-outcome-box,
  .header-innings {
    display: none;
  }
}

.drag-handler {
  cursor: grabbing;
}
</style>