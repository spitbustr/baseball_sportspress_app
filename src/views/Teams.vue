<template>
  <div class="teams-list">
    <div class="row">
      <div class="col-md-3" v-for="team in teams" :key="team.id">
        <div class="card">
          <router-link :to="`/teams/${team.id}`">
            <div class="card-body">{{ team.title.rendered }}</div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    teams() {
      return this.$store.state.data.teams
    }
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
.teams-list {
  text-align: center;
  width: 100%;

  .team {
    margin: 1rem auto;
  }
}
</style>