<template>
    <div>
        <div>
            Game {{ game.id }}
        </div>

        <div :class="{'editMode':editMode}" class="tables-container">
            <div>
                <div>
                    {{teams.away.title.rendered}}
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Player</th>
                            <th v-for="inning in innings" :key="inning">{{ inning }}</th>
                        </tr>
                    </thead>
                    <draggable
                        tag="tbody"
                        :list="players.away"
                        :options="{ animation: 150, group: 'players' }"
                        ghost-class="ghost"
                        :disabled="!editMode"
                    >
                        <tr v-for="(player, $index) in players.away" :key="$index">
                            <td class="player-buttom-container">
                                <button class="player-remove-button" @click="removePlayer(player)">X</button>
                                <span v-html="player.name"></span>
                                <button class="player-swap-button" @click="editPlayer(player)">SWAP</button>
                            </td>
                            <td><span @click="editPlayer(player)" v-html="player.name"></span></td>
                            <td
                                v-for="inning in innings"
                                :key="inning"
                                @click="setActiveOutcome(`outcome_away_${$index}_${inning}`)"
                                :class="{ active: active.outcomeBox === `outcome_away_${$index}_${inning}` }"
                                class="ingame-outcome-box"
                            >
                                <OutcomeBox :outcome="player.outcome[inning]"></OutcomeBox>
                            </td>
                        </tr>
                    </draggable>
                    <tr class="unclickable" v-if="editMode">
                        <td><button @click="addPlayer(players.away)">Add Player</button></td>
                        <td v-for="inning in innings" :key="inning"></td>
                    </tr>
                </table>
            </div>
            <div>
                <div>
                    {{teams.home.title.rendered}}
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Player</th>
                            <th v-for="inning in innings" :key="inning">{{ inning }}</th>
                        </tr>
                    </thead>
                    <draggable
                        tag="tbody"
                        :list="players.home"
                        :options="{ animation: 150, group: 'players' }"
                        ghost-class="ghost"
                        :disabled="!editMode"
                    >
                        <tr v-for="(player, $index) in players.home" :key="$index">
                            <td>{{ player.number }}</td>
                            <td class="player-buttom-container">
                                <button class="player-remove-button" @click="removePlayer(player)">X</button>
                                <span v-html="player.name"></span>
                                <button class="player-swap-button" @click="editPlayer(player)">SWAP</button>
                            </td>
                            <td
                                v-for="inning in innings"
                                :key="inning"
                                @click="setActiveOutcome(`outcome_home_${$index}_${inning}`)"
                                :class="{ active: active.outcomeBox === `outcome_home_${$index}_${inning}` }"
                                class="ingame-outcome-box"
                            >
                                <OutcomeBox :outcome="player.outcome[inning]"></OutcomeBox>
                            </td>
                        </tr>
                    </draggable>
                    <tr class="unclickable" v-if="editMode">
                        <td><button @click="addPlayer(players.home)">Add Player</button></td>
                        <td v-for="inning in innings" :key="inning"></td>
                    </tr>
                </table>
            </div>
        </div>
        <div class="edit-container">
            <button class="editButton" @click="toggleEditMode">Toggle Edit Mode</button>
        </div>
        <div class="action-buttons" v-if="!this.editMode">
            <div class="leftside">
                <button class="editButton" @click="setOutcome('BB')">BB</button>
                <button class="editButton" @click="setOutcome('K')">K</button>
                <button class="editButton" @click="setOutcome('1B')">1B</button>
                <button class="editButton" @click="setOutcome('2B')">2B</button>
                <button class="editButton" @click="setOutcome('3B')">3B</button>
                <button class="editButton" @click="setOutcome('4B')">4B</button>
                <button class="editButton" @click="setOutcome('HR')">HR</button>
                <button class="editButton" @click="setOutcome('FC')">FC</button>
                <button class="editButton" @click="setOutcome('SAC')">SAC</button>
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
                    <input for="rbi-input" type="text" size="5" v-model="rbiValue" ref="rbiValue" />
                    <button class="editButton" @click="setRBI()">Save RBI</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import PlayerInGame from "@/models/PlayerInGame"
import $settings from "@/data/settings.json"
import $games from "@/data/mock_games.json"
import $teams from "@/data/mock_teams.json"
import $players from "@/data/mock_players.json"

import { VueDraggableNext } from 'vue-draggable-next'

export default {
    components: {
        draggable: VueDraggableNext,
    },
    computed: {
        activeBox() {
            return this.active?.outcomeBox?.split("_")
        },
        activePlayer() {
            return this.players?.[this.activeBox?.[1]]?.[this.activeBox?.[2]] || null
        },
        activePlayerBox() {
            return this.activePlayer?.outcome?.[this.activeBox?.[3]] || null
        },
        numberOfInnings() {
            return $settings.websiteConfig.innings.length
        },
    },
    data() {
        return {
            innings: $settings.websiteConfig.innings,
            players: {
                home: [],
                away: []
            },
            active: {
                player: null,
                outcomeBox: null
            },
            game: null,
            teams: {
                away: null,
                home: null, 
            },
            id: 0,
            editMode: false,
            gameId: null,
        }
    },
    methods: {
        addPlayer(teamPlayers) {
            this.id++
            teamPlayers.push(new PlayerInGame({id: this.id,name: `Joueur ${this.id}`}))
            this.$store.dispatch("initialize")
        },
        editPlayer(player) {

        },
        removePlayer(player) {
            
        },
        setActiveOutcome(id) {
            if(this.active.outcomeBox !== id && !this.editMode) {
                this.active.outcomeBox = id
            }
        },
        toggleEditMode() {
            this.editMode = !this.editMode
        },
        setAtBase(base) {
            if(this.activePlayerBox && !this.editMode) {
                const activeBox = this.active.outcomeBox?.split("_")
                const activePlayer = this.players[activeBox[1]]?.[activeBox[2]]
                if(this.activePlayerBox.onBasePosition === base) {
                    this.activePlayerBox.onBasePosition = null
                }
                else {
                    this.activePlayerBox.onBasePosition = base
                }
            }

        },
        setOutcome(outcome) {
            if(this.activePlayerBox && !this.editMode) {
                if(this.activePlayerBox.atBatResult === outcome) {
                    this.activePlayerBox.atBatResult = null
                    this.activePlayerBox.putOut = false
                }
                else {
                    this.activePlayerBox.atBatResult = outcome
                    switch(outcome) {
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
                            this.activePlayerBox.rbiBy = this.activePlayer?.id
                            break
                        case "HR":
                            this.activePlayerBox.onBasePosition = "point"
                            this.activePlayerBox.rbiBy = this.activePlayer?.id
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
                        case "SAC":
                            this.activePlayerBox.putOut = true
                            break
                    }
                }
            }
        },
        setPutOut() {
            if(this.activePlayerBox && !this.editMode) {
                this.activePlayerBox.putOut = !this.activePlayerBox.putOut
            }
        },
        setRBI() {
            if(this.activePlayerBox && !this.editMode) {
                this.activePlayerBox.rbiBy = this.rbiValue || this.$refs.rbiValue.value;
                if(this.rbiValue || this.$refs.rbiValue.value) {
                    this.activePlayerBox.onBasePosition = "point"
                }
                this.rbiValue = null
                this.$refs.rbiValue.value = null
            }
        },
        setInningEnd() {
            if(this.activePlayerBox && !this.editMode) {
                this.activePlayerBox.inningEnd = !this.activePlayerBox.inningEnd
            }
        }

    },
    created() {
        this.gameId = this.$route?.params?.gameId
        if(this.gameId) {
            this.game = this.$store.getters.getGame(this.gameId)

            this.teams.away = this.$store.getters.getTeam(this.game?.teams[0])
            this.teams.home = this.$store.getters.getTeam(this.game?.teams[1])

            this.players.away = this.$store.getters.getPlayersInTeam(this.teams.away.id)
                .map(p => new PlayerInGame({...p},{name: p.title.rendered}))
            this.players.home = this.$store.getters.getPlayersInTeam(this.teams.home.id)
                .map(p => new PlayerInGame({...p},{name: p.title.rendered}))
            console.log(this.teams.away, this.teams.home)
        }
    },
}
</script>
<style lang="scss" scoped>
    table, td, th {
        border-collapse: collapse;
        border: 1px solid #000000;
    }
    table {
        margin: 1rem 10px ;
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
        .leftside {

        }
        .midside {

        }
        .rightside {
        }
    }
    .editButton {
        padding: 1rem;
    }
    .rbi-input {
        display: flex;
    }
    .tables-container {
        display:flex;
        justify-content: center;
    }
    .edit-container {
        margin-bottom: 8rem;
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
   

</style>