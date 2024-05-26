<template>
    <div>
        <div v-if=" activePlayerBox?.onBasePosition === 'point'">
            <select class="rbi-button" v-model="activePlayerBox.rbiBy">
            <option :value="null">NO RBI</option>
            <option v-for="player in players" :value="player.id" :key="player.id"><span v-html="player.name"></span></option>
            </select>
        </div>
    </div>
</template>
<script>
import OutcomeMixin from "@/mixins/OutcomeMixin"
export default {
    data() {
        return {
            activePlayerBox: null,
        }

    },
    props: {
        selectedOutcomeBox: Object,
        activePlayer: Object,
        openModal: Boolean,
        players: Array,
    },
    methods: {
        updateData() {
            this.$emit("updateOutcome",this.activePlayerBox)
        },
    },
    mixins: [
        OutcomeMixin,
    ],
    watch: {
        openModal() {
            this.activePlayerBox = this.selectedOutcomeBox
        }
    }

}
</script>