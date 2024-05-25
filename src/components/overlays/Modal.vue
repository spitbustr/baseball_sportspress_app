<template>
  <div :type="type" >
    <transition name="modal-fade">
      <div class="modal-backdrop" @click="handleBackdropClick">
        <div class="modal" :class="getClass" role="dialog" aria-labelledby="modalTitle" aria-describedby="modalDescription">
          <div class="modal-content">
            <header class="modal-header" id="modalTitle" v-if="$slots.header">
              <slot name="header">
              </slot>
              <button type="button" class="btn-close" @click="close" aria-label="Close modal">
                x
              </button>
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
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: #FFFFFF;
  box-shadow: 2px 2px 20px 1px;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  max-width: 32rem;
  max-height: 40rem;
  position: relative;
  &.loading {
    overflow: hidden;
    max-height: 4rem;
  }
  &.fullScreen {
    width: 100%;
    height: 100%;
    flex-direction: column;
    justify-content: space-between;
    max-width: none;
    max-height: none;
  }
}

.modal-header,
.modal-footer {
  padding: 15px;
  display: flex;
  z-index: 10;
}

.modal-header, .modal-subheader {
  background: white;
  position: sticky;
  border-bottom: 2px solid #eeeeee;
  color: #4AAE9B;
  justify-content: space-between;
  align-items: center;
  top: 0;
}

.modal-footer {
  background: white;
  border-top: 1px solid #eeeeee;
  flex-direction: column;
  position: sticky;
  left: auto;
  right: auto;
  bottom: 0;
  padding: 0;
}
.modal-body-container {
  position: relative;
  height: 100%;
  .modal-body-content {
    .modal-body {
      position: relative;
      padding: 20px 10px;

    }
  }

}


.btn-close {
  position: absolute;
  top: 0;
  right: 0;
  border: none;
  font-size: 40px;
  padding: 10px;
  cursor: pointer;
  font-weight: bold;
  color: #4AAE9B;
  background: transparent;
}

.btn-green {
  color: white;
  background: #4AAE9B;
  border: 1px solid #4AAE9B;
  border-radius: 2px;
}

.modal-fade-enter,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity .5s ease;
}

</style>