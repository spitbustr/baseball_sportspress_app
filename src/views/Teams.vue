<template>
  <div class="teams-list">
    <template v-for="team in teams" :key="team.id">
      <div class="team">
        <router-link :to="`/teams/${team.id}`">
          <div>{{ team.title.rendered }}</div>
        </router-link>
      </div>
    </template>
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