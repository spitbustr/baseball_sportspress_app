<template>
  <div :class="triggerClass" ref="trigger">
    <slot name="trigger" :hide="hide" :is-visible="isVisible" :show="show" :toggle="toggle"></slot>
    <portal>
      <transition @after-leave="dismiss">
        <dialog @cancel.prevent="hide" :class="dialogClass" @click.self="hideOutside" ref="dialog" v-show="isVisible">
          <div class="overlay" ref="overlay">
            <slot :hide="hide"></slot>
          </div>
        </dialog>
      </transition>
    </portal>
  </div>
</template>

<script>
  const alignOptions = [
    "center",
    "left",
    "right",
    "middle-left",
    "middle-right",
  ]
  const displayOptions = [
    "block",
    "inline",
    "inline-block",
  ]
  const typeOptions = [
    "drawer",
    "fullscreen",
    "menu",
    "tooltip",
    "window",
  ]

  export default {
    computed: {
      dialogClass() {
        return [
          this.align ? `${this.align}-aligned` : "",
          this.overrideType || this.type,
          "dialog",
          this.customClass,
        ]
      },
      triggerClass() {
        return [
          this.display,
          "trigger",
        ]
      }
    },
    data() {
      return {
        isVisible: false,
        overrideType: false,
      }
    },
    methods: {
      checkOverride() {
        if (this.type === "tooltip") {
          // Use window style on small screens
          if (window.innerWidth < 640) {
            this.setOverride("window")
          }
          else {
            window.setTimeout(() => {
              const triggerBounds = this.$refs.trigger.getBoundingClientRect()
              const dialogBounds = this.$refs.dialog.getBoundingClientRect()

              // Use window style when tooltip extends off screen
              if (triggerBounds.top + dialogBounds.height + 50 > window.innerHeight) {
                this.setOverride("window")
              }
              else {
                this.clearOverride()
              }
            }, 525)
          }
        }
      },
      clearOverride() {
        this.overrideType = false
      },
      dismiss() {
        this.isVisible = false
        this.$refs.dialog.close()
        this.$emit("dismiss")
      },
      hide(){
        this.isVisible = false
      },
      hideOutside() {
        if(this.outsideClosing){
          this.isVisible = false
        }
      },
      position() {
        const maxWidth = 1280
        const dialogStyle = this.$refs.dialog.style
        const xMaxWidthOffset = window.innerWidth >= maxWidth ? (window.innerWidth - maxWidth) / 2 : 0
        var estimatedWidth = 400

        if (this.type === "tooltip") {
          const triggerBounds = this.$refs.trigger.getBoundingClientRect()
          let xOffset = 0
          switch (this.align) {
          case "center":
            xOffset = 0
            dialogStyle.left = `${(window.innerWidth/2) - (estimatedWidth/2)+(this.adjustX || 0)}px`
            break
          case "left":
            xOffset = triggerBounds.left - xMaxWidthOffset + (triggerBounds.width / 2) - 28
            dialogStyle.left = `${xMaxWidthOffset + 24}px`
            break
          case "right":
            xOffset = window.innerWidth - xMaxWidthOffset - triggerBounds.right + (triggerBounds.width / 2) - 28
            dialogStyle.right = `${xMaxWidthOffset + 24}px`
            break

          case "middle-left":
            xOffset = estimatedWidth
            dialogStyle.left = ((triggerBounds.left + triggerBounds.right) / 2) - estimatedWidth + "px"
            if(triggerBounds.left - estimatedWidth <= 0 ) {
              xOffset = triggerBounds.left - xMaxWidthOffset + (triggerBounds.width / 2) - 28
              dialogStyle.left = `${xMaxWidthOffset + 28}px`
            }
            break
          case "middle-right":
            xOffset = estimatedWidth - 28
            dialogStyle.right = window.innerWidth - ((triggerBounds.left + triggerBounds.right) / 2) - estimatedWidth + "px"
            if(window.innerWidth - ((triggerBounds.left + triggerBounds.right) / 2) - estimatedWidth <= 0) {
              xOffset = window.innerWidth - ((triggerBounds.left + triggerBounds.right) / 2) - 56
              dialogStyle.right = `${xMaxWidthOffset + 28}px`
            }
            break

          }

          const yOffset = triggerBounds.top + triggerBounds.height + 24

          dialogStyle.top = `${yOffset + this.adjustY}px`
          dialogStyle.setProperty("--arrow-x", `${xOffset + this.adjustX}px`)
        }
      },
      setOverride(type) {
        this.overrideType = type
        switch (type) {
        case "window":
          const dialogStyle = this.$refs.dialog.style
          dialogStyle.left = ""
          dialogStyle.top = ""
          dialogStyle.right = ""
          break
        }
      },
      show() {
        if (this.trackingId) {
          this.$ga.event("overlay", "show", this.trackingId)
        }
        this.position()
        this.isVisible = true
        this.$nextTick(() => this.$refs.dialog.showModal())
        this.checkOverride()
      },
      toggle() {
        if (this.isVisible) {
          this.hide()
        }
        else {
          this.show()
        }
      },
    },
    async mounted() {
      await this.$nextTick()

      if (this.showOnMount) {
        this.show()
      }
    },
    props: {
      adjustX: {
        default: 0,
        type: Number,
      },
      adjustY: {
        default: 0,
        type: Number,
      },
      align: {
        type: String,
        validator(value) {
          return alignOptions.indexOf(value) !== -1
        },
      },
      outsideClosing: {
        default: true,
        type: Boolean
      },
      customClass: {
        required: false,
        type: String,
      },
      display: {
        default: "inline-block",
        type: String,
        validator(value) {
          return displayOptions.indexOf(value) !== -1
        },
      },
      showOnMount: Boolean,
      trackingId: String,
      type: {
        required: true,
        type: String,
        validator(value) {
          return typeOptions.indexOf(value) !== -1
        },
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import "@/styles/_variables";

  $transition-overlay: 300ms ease-in-out;

  .trigger {
    &.block {
      display: block;
    }

    &.inline {
      display: inline;
    }

    &.inline-block {
      display: inline-block;
    }
  }

  .dialog {
    background-color: transparent;
    border: 0;
    bottom: auto;
    left: auto;
    margin: 0;
    max-height: 100%;
    max-width: 100%;
    opacity: 1;
    padding: 0;
    position: fixed;
    right: auto;
    top: auto;
    transition: all $transition-overlay;
    @media(max-width: 40em) {
      max-height: 100svh;
    }
    &.tooltip {
      border-radius: 0.1875rem;
      box-shadow: 0.125rem 0.125rem 1.25rem 0.0625rem;
      max-width: calc(100% - 4rem);
      transform: scale(1);

      &.left-aligned {
        left: 2rem;
        transform-origin: 0 0;
      }

      &.right-aligned {
        right: 2rem;
        transform-origin: 100% 0;
      }

      &.middle-right-aligned {
        margin: 0 auto;
        transform-origin: 100% 0;
      }

      &.middle-left-aligned {
        margin: 0 auto;
        transform-origin: 100% 0;
      }

      &.v-enter,
      &.v-leave-to {
        transform: scale(0);
      }

      .overlay {
        border-radius: 0.25rem;
      }

      @media (-ms-high-contrast: none), (-ms-high-contrast: active) {
        transform: translate(0, -1.125rem);
      }
    }

    &.fullscreen {
      box-shadow: 0.125rem 0.125rem 1.25rem 0.0625rem;
      height: 100%;
      max-width: 80rem;
      top: 0;
      transform-origin: 50% 100%;
      transform: translate(0, 0);
      width: 100%;

      &.v-enter,
      &.v-leave-to {
        opacity: 0;
        transform: translate(0, 100%);
      }

      @media (min-width: 80em) {
        left: 50%;
        transform: translate(-50%, 0);

        &.v-enter,
        &.v-leave-to {
          position: absolute;
          right: 0;
          opacity: 0;
          transform: translate(-50%, 100%);
        }

        @media (-ms-high-contrast: none), (-ms-high-contrast: active) {
          transform: translate(0, 0);
        }
      }
    }

    &.menu {
      height: 100%;
      max-width: 80rem;
      top: 0;
      width: 100%;

      @media (min-width: 80em) {
        left: 50%;
        transform: translate(-50%, 0);
      }
    }

    &.drawer {
      box-shadow: 0.125rem 0.125rem 1.25rem 0.0625rem;
      height: auto;
      max-width: 80rem;
      bottom: 0;
      width: 100%;

      &::before {
        display: none;
      }

      &.v-enter,
      &.v-leave-to {
        position: absolute;
        right: 0;
        opacity: 0;
        transform: translate(0, 100%);
        width: 100%;
      }

      @media (min-width: 80em) {
        left: 50%;
        transform: translate(-50%, 0);

        &.v-enter,
        &.v-leave-to {
          position: absolute;
          right: 0;
          opacity: 0;
          transform: translate(-50%, 100%);
          width: 100%;
        }
      }
    }

    &.window {
      box-shadow: 0.125rem 0.125rem 1.25rem 0.0625rem;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%) scale(1);

      &.v-enter,
      &.v-leave-to {
        transform: translate(-50%, -200%) scale(0);
      }

      .overlay {
        border-radius: 0.25rem;
      }

      @media (max-width: 39.9375em) {
        width: 100%;

        &.quick-summary-modal {
          // shawn, need some help adding this for the att total modal, see MAINT-5981, comment from nov 30, point 6
          width: auto;
          min-width: 290px;
        }
      }
    }

    &::backdrop,
    & + .backdrop {
      background: rgba(0, 0, 0, 0.5);
      height: 100%;
      opacity: 1;
      position: fixed;
      transition: opacity $transition-overlay;
      width: 100%;
    }

    &.v-enter,
    &.v-leave-to {
      opacity: 0;

      &::backdrop,
      & + .backdrop {
        opacity: 0;
      }
    }

    @media (-ms-high-contrast: none), (-ms-high-contrast: active) {
      .overlay {
        position: relative;
        z-index: 1;
      }

      &.window::before,
      &.fullscreen::before {
        display: none;
      }

      &::after {
        background: rgba(0, 0, 0, 0.5);
        content: "";
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
      }
    }
  }

  .overlay {
    max-height: 100svh;

    .fullscreen & {
      max-height: 100svh;
      height: 100%;
      width: 100%;

      @media (min-width: 80em) {
        @media (-ms-high-contrast: none), (-ms-high-contrast: active) {
          left: -50%;
        }
      }
    }

    @media (max-width: 39.9375em) {
      overflow: visible;
      overflow-y: auto;
    }
  }
</style>
