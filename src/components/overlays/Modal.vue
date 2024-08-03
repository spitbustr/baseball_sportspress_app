<template>
  <div :type="type">
    <transition name="modal-fade">
      <div class="modal-backdrop" @click="handleBackdropClick">
        <div class="modal" :class="getClass" role="dialog" aria-labelledby="modalTitle"
          aria-describedby="modalDescription">
          <div class="modal-dialog modal-lg modal-dialog-scrollable">
            <div class="modal-content">
              <div class="modal-header flex-column" id="modalTitle" v-if="$slots.header">
                <div class="container-fluid d-flex mx-0 px-0">
                  <slot name="header"></slot>
                  <button type="button" class="btn-close" @click="close" aria-label="Close modal"></button>
                </div>
                <div class="container-fluid pt-3 mx-0 px-0" id="modalSubTitle" v-if="$slots.subheader">
                  <slot name="subheader"></slot>
                </div>
              </div>

              <div class="modal-body" :style="bodystyle">

                <slot name="body"></slot>
              </div>
              <div class="modal-footer" v-if="$slots.footer">
                <slot name="footer"></slot>
                <button class="btn btn-secondary d-flex align-items-center" @click="close"><span>Annuler</span></button>

              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>

export default {
  name: 'Modal',
  computed: {
    getClass() {
      return `${this.type}`
    }
  },
  methods: {
    close() {
      this.$emit('close');
    },
    handleBackdropClick(event) {
      if (event.target === event.currentTarget) {
        if(this.type==="loading") return
        this.close()
      }
    }
  },
  props: {
    type: String,
    bodystyle: String,
  }
};
</script>
<style lang="scss" scoped>
.modal-backdrop {
  background-color: rgba(0, 0, 0, 0.3);
}
.modal {
  display: block;
}

</style>