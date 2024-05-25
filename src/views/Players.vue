<template>
  <div class="players-list">
    <div>
      <button @click="openModal()"><b>ADD PLAYER</b></button>
    </div>
    <template v-for="player in players" :key="player.id">
      <div class="player">
        <router-link :to="`/players/${player.id}`">
          <div>{{ player.id }} <span v-html="player.title.rendered"></span></div>
        </router-link>
      </div>
    </template>
    <AddPlayer @closeModal="closeModal()" :show="openAddModal"></AddPlayer>
  </div>
</template>
<script>
import SportspressAPIService from '@/services/SportspressAPIService'
export default {

  data() {
    return {
      openAddModal: false,
    }
  },
  computed: {
    players() {
      return this.$store.state.data.players
    },
    teams() {
      return this.$store.state.data.teams
    },
  },
  methods: {
    openModal() {
      this.openAddModal = true
    },
    closeModal() {
      this.openAddModal = false
    },
  }
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