<template>
    <div class="player-list">
        <h1>{{ this.team.title.rendered }}</h1>
        <table>
            <tr v-for="player in playersList" :key="player.id">
                <td><span v-html="player.title.rendered"></span></td>
            </tr>
        </table>
    </div>
</template>
<script>
export default {
    data() {
        return {
            team: {},
            playersList: [],
        }
    },
    created() {
        const teamId = this.$route?.params?.teamId
        if(teamId) {
            this.team = this.$store.state.data.teams.find(t => t.id == teamId)
            this.playersList = this.$store.getters.getPlayersInTeamWithSpares(teamId)
        }
    }
}
</script>
<style lang="scss" scoped>
.player-list {
    text-align: center;
    width: 100%;
    table {
        margin: auto;
    }
}
</style>