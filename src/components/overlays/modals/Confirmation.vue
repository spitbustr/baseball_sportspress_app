<template>
  <Modal v-show="show" @close="closeModal">
    <template v-slot:header>
      <h5>Confirm</h5>
    </template>
    <template v-slot:body>
      <div>
        <div v-html="action"></div>
      </div>
    </template>
    <template v-slot:footer>
      <div class="player-replace-footer">
          <button @click="cancel" :disabled="loading">CANCEL</button>
          <button @click="confirm" :disabled="loading">CONFIRM</button>
      </div>
    </template>
  </Modal>
</template>
<script>

import SportspressAPIService from '@/services/SportspressAPIService'
export default {
computed: {

},
data() {
  return {
    result: false,
    loading: false,
  }
},
methods: {
  async addPlayer() {
    this.loading = true
    const payload = {
      title: this.playerName,
      current_teams: this.selectedTeams.join(","),
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
  cancel() {
    this.result = false
    this.closeModal()
  },
  confirm(){
    this.result = true
    this.closeModal()
  },
  closeModal() {
    this.$emit("closeModal",this.result)
  },
},
props: {
  show: {
      type: Boolean,
      default: false,
  },
  action: {
      type: String,
  }
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
