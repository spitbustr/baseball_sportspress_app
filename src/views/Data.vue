<template>
  <div class="container">
    <div class="row py-5">
      <div class="col-12">
        <h1 class="pb-4">Configuration</h1>
        <div class="row row-cols-1 row-cols-md-3 g-4">
          <div class="col">
            <div class="card h-100">
              <div class="card-body">
                <h2 class="card-title">Information</h2>
                <h3 class="card-subtitle mb-3 text-body-secondary fs-6">Information sur la ligue et l'application.</h3>
                <div class="card">
                  <div class="card-body">
                    <h5 class="card-title">
                      Ligue
                    </h5>
                    <p>Nom: <span class="fw-bold">LBAO</span><br>
                      Saison courante: <span class="fw-bold">2024</span></p>
                  </div>
                  </div>
                  <div class="card mt-3">
                  <div class="card-body">
                    <h5 class="card-title">
                      Application
                    </h5>
                    <p>Version: <span class="fw-bold">1.0</span><br>
                      Dernière mise-à-jour: <span class="fw-bold">3 août 2024</span></p>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <div class="col">
            <div class="card h-100">
              <div class="card-body">
                <h2 class="card-title">Données</h2>
                <h3 class="card-subtitle mb-3 text-body-secondary fs-6">Synchronisation des données</h3>
                <div class="card">
                  <ul class="list-group list-group-flush">
                    <li class="list-group-item d-flex justify-content-between align-items-center py-3">
                      <span>Calendrier</span>
                      <button class="btn btn-outline-primary" @click="refreshGames()"><span
                          v-html="$settings.icons.swap" class="me-1"></span>Synchroniser</button>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center py-3">
                      <span>Joueurs</span>
                      <button class="btn btn-outline-primary" @click="refreshPlayers()"><span
                          v-html="$settings.icons.swap" class="me-1"></span>Synchroniser</button>
                    </li>
                  </ul>
                  <ul class="list-group list-group-flush">
                    <li class="list-group-item d-flex justify-content-between align-items-center py-3">
                      <span>Équipes</span>
                      <button class="btn btn-outline-primary" @click="refreshTeams()"><span
                          v-html="$settings.icons.swap" class="me-1"></span>Synchroniser</button>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center py-3">
                      <span>Médias</span>
                      <button class="btn btn-outline-primary" @click="refreshMedia()"><span
                          v-html="$settings.icons.swap" class="me-1"></span>Synchroniser</button>
                    </li>
                  </ul>
                  <ul class="list-group list-group-flush">
                    <li class="list-group-item d-flex justify-content-between align-items-center py-3">
                      <span>Toutes les données</span>
                      <button class="btn btn-outline-primary" @click="refreshData()"><span v-html="$settings.icons.swap"
                          class="me-1"></span>Synchroniser</button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>

</template>
<script>
import $settings from "@/data/settings.json"
export default {
  computed: {
    settings() {
      return $settings
    },
  },
  methods: {
    async clearDataBase() {

    },
    async refreshGames() {
      await this.$store.dispatch("refreshCalendar")
      await this.$store.dispatch("refreshGames")
    },
    async refreshTeams() {
      await this.$store.dispatch("refreshTeams")
    },
    async refreshPlayers() {
      await this.$store.dispatch("refreshPlayers")
    },
    async refreshMedia() {
      await this.$store.dispatch("refreshMedia")
    },
    async refreshData() {
      await this.$store.dispatch("refreshData")
    }
  }
}
</script>
<style lang="scss" scoped>
.data-list {
  flex-direction: column;
  text-align: center;
  width: 100%;

  button {
    cursor: pointer;
    margin: 0.275rem 0;
    padding: 0.75rem 0.875rem;
  }
}
</style>