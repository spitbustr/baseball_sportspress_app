<template>
  <div :class="modalClass" :style="maxWidthDefined">
    <header class="header">
      <div class="label">
        <div class="title">
          <slot name="title"></slot>
        </div>
        <div class="subtitle">
          <slot name="subtitle"></slot>
        </div>
      </div>
      <CloseButton v-if="closing" @click="close" :color="closeColor"></CloseButton>
    </header>
    <div class="body">
      <slot name="banner"></slot>
      <div class="body-section">
        <slot></slot>
      </div>
    </div>
    <div class="sticky-bottom">
      <slot name="sticky-bottom"></slot>
    </div>
    <footer class="footer" :class="actionsClass">
      <div class="footnote">
        <slot name="footnote"></slot>
      </div>
      <div class="actions" :class="actionsClass" v-if="hasActions">
        <slot name="actions"></slot>
      </div>
    </footer>
  </div>
</template>

<script>
  import {$brand, $settings} from "@/data/providers"

  const defaultTypeOption = "default"
  const typeOptions = [
    "default",
    "flat",
    "shadows",
    "shadows white",
    "shadows gray-96",
  ]

  export default {
    components: {
      CloseButton: () => import("@/components/calculator/buttons/CloseButton"),
    },
    computed: {
      brandId() {
        return $settings.segment === "firstnet" ? "firstnet" : this.product?.brand ?? "att"
      },
      closeColor() {
        return $brand[this.brandId].closeColor
      },
      hasActions() {
        return this.$slots.actions
      },
      modalClass() {
        return [
          this.brandId,
          `modal--type-${this.type}`,
          "modal",
        ]
      },
      actionsClass() {
        return [
          this.actionsSize
        ]
      },
      maxWidthDefined() {
        return this.maxWidth 
          ? [{"width":`${this.maxWidth}px`},{"max-width": "100%"}]
          : ""
      }
    },
    methods: {
      close() {
        this.$emit("close")
      },
    },
    props: {
      actionsSize: String,
      product: [Array, Object],
      type: {
        default: defaultTypeOption,
        type: String,
        validator(value) {
          return typeOptions.indexOf(value) !== -1
        },
      },
      closing: {
        default: true,
        type: Boolean
      },
      maxWidth: Number,
    },
  }
</script>

<style lang="scss" scoped>
  @import "@/styles/_variables";

  .modal {
    background: $gray-93;
    display: flex;
    height: 100%;
    flex-direction: column;
    position: relative;
    max-width: 100%;

    .window & {
      max-height: 95vh;
      @media(max-width: 40em) {
        max-height: 90vh;
      }
    }

    @media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
      .window & {
        max-height: 100%;
      }
    }

    @media (max-height: 24em) {
      padding: 0 !important; /* TODO: No important! */

      .header {
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.25);
        z-index: 1;
        margin-bottom: 0.9375rem;
      }

      .footer {
        border-top: 0.0625rem solid $gray-89;
      }
    }
  }

  .header {
    align-items: center;
    display: flex;
    flex: 0 0 auto;
    justify-content: space-between;
    padding: 1.25rem;
    font-family: $font-medium;
    z-index: 10;

    .fullscreen & {
      box-shadow: 0 0.125rem 0.25rem 0 rgba(0, 0, 0, 0.25);
      z-index: 5;
    }

    @media (max-width: 39.9375em) {
      padding: 1.25rem 0.75rem;
    }

    .modal--type-default & {
      background-color: $gray-96;
    }

    .modal--type-shadows & {
      box-shadow: 0 4px 7px rgba(0, 0, 0, 0.15);
      margin-bottom: 0.35rem;
      padding: 1.25rem 2.35rem 1.5rem;
      @media(max-width: 40rem) {
        padding: 1.25rem 1.25rem 1.5rem;
      }
    }

    .firstnet & {
      background-color: $black;
      color: $white;
      padding-top: 2.25rem;
      position: relative;

      &::before {
        background-image: repeating-linear-gradient(45deg, $white, $white 0.1875rem, $black, $black 0.5rem);
        content: "";
        height: 1rem;
        left: 0;
        position: absolute;
        top: 0;
        width: 100%;
      }
    }
    
  }

  .title {
    font-size: 1.5rem;
    flex: 1 1 auto;
  }

  .subtitle {
    font-size: 1rem;
    flex: 1 1 auto;
  }

  .body {
    flex: 1 1 auto;
    overflow: auto;

    .body-section {
      height: 100%;
      overflow: auto;
      padding: 1.125rem;

      @media (max-width: 26.25rem) {
        padding: 0.75rem;

        .modal--type-default & {
          background-color: $gray-89;
        }

        .modal--type-shadows & {
          padding: 1rem 1.35rem 1.5rem;
          &.white {
            background-color: white;
          }
          &.gray-69 {
            background-color: $gray-69;
          }
        }
      }
    }
  }

  .footer {
    display: flex;
    justify-content: space-between;
    flex: 0 0 auto;
    padding: 1.25rem;
    width: 100%;

    .fullscreen & {
      box-shadow: 0 -0.125rem 0.25rem 0 rgba(0, 0, 0, 0.25);
      z-index: 5;
    }

    @media (max-width: 30em) {
      flex-wrap: wrap;
      justify-content: flex-end;

      &.large {
        justify-content: center;
      }
    }

    .modal--type-default & {
      background-color: $gray-96;
    }

    .modal--type-shadows & {
      box-shadow: 0 -4px 7px rgba(0, 0, 0, 0.15);
      margin-top: 0;
      padding: 1.25rem 2.35rem;
      @media (max-width: 40em) {
        padding: 1rem 1.25rem;
      }
    }

    &.hidden-footer {
      display: none;
    }
  }

  .footnote {
    align-items: center;
    display: flex;
    justify-content: flex-start;
    width: 100%;

    @media (max-width: 30em) {
      margin-bottom: 0.625rem;
    }
  }

  .actions {
    align-items: center;
    box-sizing: content-box;
    display: flex;
    flex-shrink: 0;
    justify-content: flex-end;
    margin-left: 2rem;

    @media (max-width: 30em) {
      margin-left: 0;

      &.large {
        justify-content: center;
        flex-direction: column;

        .button {
          margin-left: 0;

          + .button {
            margin-left: 0;
            margin-top: 20px;
          }
        }
      }
    }
  }

  .white {
    background: white;
    .header {
      background: white;
      align-items: flex-start;
    }
    .body {
      background: white;
    }
    .footer {
      background: white;
    }
  }
  .gray-96 {
    .header {
      background: $gray-96;
      align-items: flex-start;
    }
    .body {
      background: $gray-96;
    }
    .footer {
      background: $gray-96;
    }
  }
  body.firstnet {
    .firstnet {
      &.modal--type-shadows {
        .header {
          ::v-deep .button-close {
            svg {
              color: $black;
            }
          }
          background: $white;
          box-shadow: 0 4px 7px rgba(0, 0, 0, 0.15);
          color: $black;
          padding-top: 1.5rem;
          &:before {
            content: "";
            background-image: none;
          }
        }
      }
      &.modal--type-flat {
        .header {
          ::v-deep .button-close {
            svg {
              color: $black;
            }
          }
          background: $white;

          color: $black;
          margin: -0.5rem;
          padding-top: 1.5rem;
          &:before {
            content: "";
            background-image: none;
          }
        }
      }
    }
  }
</style>
