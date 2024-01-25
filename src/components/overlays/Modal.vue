<template>
  <div :type="type" >
    <transition name="modal-fade">
      <div class="modal-backdrop" @click="handleBackdropClick">
        <div class="modal" :class="getClass" role="dialog" aria-labelledby="modalTitle" aria-describedby="modalDescription">
          <header class="modal-header" id="modalTitle">
            <slot name="header">
            </slot>
            <button type="button" class="btn-close" @click="close" aria-label="Close modal">
              x
            </button>
          </header>
          <section class="modal-body" id="modalDescription">
            <slot name="body">
            </slot>
          </section>
          <footer class="modal-footer">
            <slot name="footer">
            </slot>
          </footer>
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
  overflow-x: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  max-width: 32rem;
  max-height: 40rem;
  position: relative;

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
}

.modal-header {
  position: relative;
  border-bottom: 1px solid #eeeeee;
  color: #4AAE9B;
  justify-content: space-between;
}

.modal-footer {
  border-top: 1px solid #eeeeee;
  flex-direction: column;
  position: sticky;
  left: auto;
  right: auto;
  bottom: 0;
  padding: 0;
}

.modal-body {
  position: relative;
  padding: 20px 10px;
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