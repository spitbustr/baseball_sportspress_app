<template>
  <Modal v-show="show" @close="closeModal">
    <template v-slot:header>
      <h5 class="modal-title">Ajouter un nouveau joueur</h5>
    </template>
    <template v-slot:body>
      <form>
        <div class="alert alert-info mb-3">
          <div class="form-check">
            <input class="form-check-input" type="checkbox" v-model="spare" name="spare" id="spare"
              value="Spares">
            <label class="form-check-label" for="spare">
              Joueur Remplaçant
            </label>
          </div>
        </div>
          <div class="mb-3">
            <label for="prenom" class="form-label">Prénom</label>
            <input type="text" v-model="prenom" class="form-control" id="prenom" aria-describedby="emailHelp">
          </div>
          <div class="mb-3">
            <label for="nomFamille" class="form-label">Nom</label>
            <input type="email" v-model="nomFamille" class="form-control" id="nomFamille" aria-describedby="emailHelp">
          </div>
          <div class="mb-3">
            <div class="row">
              <div class="col-md-6">
                <label for="equipe" class="form-label">&Eacute;quipe</label>
                <select class="form-select" v-model="equipe" aria-label="Default select example" id="equipe">
                  <option v-for="team in teams" :key="team.id" :value="team.id">{{team.title.rendered}}</option>
                </select>
              </div>
              <div class="col-md-6">
                <p>Sexe</p>
                <div class="form-check">
                  <input class="form-check-input" type="radio" v-model="sexe" name="sexe" id="homme"
                    value="Homme">
                  <label class="form-check-label" for="homme">
                    Homme
                  </label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="radio" v-model="sexe" name="sexe" id="femme"
                    value="Femme">
                  <label class="form-check-label" for="femme">
                    Femme
                  </label>
                </div>
              </div>
            </div>
          </div>

      </form>
      <!--
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
                  <td align=right><label :for="`team_select_${team.id}`">{{team.title.rendered}}</label></td>
                  <td> <input type="checkbox" v-model="selectedTeams" :id="`team_select_${team.id}`" :value="team.id">
                  </td>
                </tr>
              </table>
            </div>
            <div>
              <table>
                <tr v-for="team in secondHalfTeams" :key="team.id">
                  <td align=right><label :for="`team_select_${team.id}`">{{team.title.rendered}}</label></td>
                  <td> <input type="checkbox" v-model="selectedTeams" :id="`team_select_${team.id}`" :value="team.id">
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
    -->
    </template>
    <template v-slot:footer>
      <div class="player-replace-footer">
        <button class="btn btn-primary" @click="addPlayer" :disabled="loading">Ajouter</button>
      </div>
    </template>
  </Modal>
</template>
<script>

import SportspressAPIService from '@/services/SportspressAPIService'
import $settings from "@/data/settings.json"

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
      prenom: "",
      nomFamille: "",
      sexe: "",
      equipe: "",
      pName: "",
      selectedTeams: [],
      loading: false,
      spare: false,
    }
  },
  methods: {
    async addPlayer() {
      this.loading = true
      let pName = "";
      if (this.spare) {
       pName = this.prenom + " " + this.nomFamille + " (R)"
      } else {
        pName = this.prenom + " " + this.nomFamille
      }
      const payload = {
        title: pName,
        leagues: $settings.playballConfig.leagues,
        seasons: $settings.playballConfig.season,
        metrics: {
          sexe: this.sexe,
        },
        current_teams: this.equipe,
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
