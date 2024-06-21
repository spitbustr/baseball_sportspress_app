<template>
  <div :type="type">
    <transition name="modal-fade">
      <div class="modal-backdrop" @click="handleBackdropClick">
        <div class="modal" :class="getClass" role="dialog" aria-labelledby="modalTitle"
          aria-describedby="modalDescription">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <header class="modal-header" id="modalTitle" v-if="$slots.header">
                <slot name="header">
                </slot>
                <button type="button" class="btn-close" @click="close" aria-label="Close modal"></button>
              </header>
              <div class="modal-subheader" id="modalSubTitle" v-if="$slots.subheader">
                <slot name="subheader">
                </slot>
              </div>
              <section class="modal-body-container" id="modalDescription">
                <div class="modal-body-content">
                  <div class="modal-body">
                    <slot name="body">
                    </slot>
                  </div>
                </div>
              </section>
              <footer class="modal-footer" v-if="$slots.footer">
                <slot name="footer">
                </slot>
              </footer>
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
.modal-body {
  max-height: 70vh;
  overflow: hidden;
}
</style>