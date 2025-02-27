<template>
  <div class="oc-alert oc-notification-message" :class="classes">
    <oc-icon :variation="iconVariation" size="large" name="information" class="oc-mr-s" />
    <div
      class="oc-flex oc-flex-wrap oc-flex-middle oc-flex-1 oc-mr"
      :role="role"
      :aria-live="ariaLive"
    >
      <div class="oc-notification-message-title">
        {{ title }}
      </div>
      <div v-if="message" class="oc-text-muted oc-width-1-1 oc-notification-message-content">
        {{ message }}
      </div>
    </div>
  </div>
</template>
<script>
import OcIcon from "../../atoms/OcIcon/OcIcon.vue"

/**
 * Notifications are used to inform users about errors, warnings and as confirmations for their actions.
 */
export default {
  name: "OcNotificationMessage",
  status: "ready",
  release: "1.0.0",
  components: {
    OcIcon,
  },
  props: {
    /**
     * Notification messages are sub components of the oc-notifications component.
     * Messages can have one of the five states: `passive, primary, success, warning and danger`
     *
     * The status defines the color of the notification.
     */
    status: {
      type: String,
      required: false,
      default: "passive",
      validator: value => {
        return value.match(/(passive|primary|success|warning|danger)/)
      },
    },
    /**
     * The title that will be displayed in notification
     */
    title: {
      type: String,
      required: true,
    },
    /**
     * The message that will be displayed in notification
     */
    message: {
      type: String,
      required: false,
      default: null,
    },
    /**
     * Number of seconds the message shows. It will disappear after this time.
     */
    timeout: {
      type: Number,
      required: false,
      default: 5,
      validator: value => value > 0,
    },
  },
  computed: {
    classes() {
      return `oc-flex oc-flex-wrap oc-notification-message oc-notification-message-${this.status}`
    },
    iconVariation() {
      return this.status
    },
    isStatusDanger() {
      return this.status === "danger"
    },
    role() {
      return this.isStatusDanger ? "alert" : "status"
    },
    ariaLive() {
      return this.isStatusDanger ? "assertive" : "polite"
    },
  },
  mounted() {
    /**
     * Notification will be destroyed if timeout is set
     */
    setTimeout(() => {
      this.close()
    }, this.timeout * 1000)
  },
  methods: {
    close() {
      /**
       * The close event is emitted when the user clicks the close icon.
       * @type {void}
       */
      this.$emit("close")
    },
  },
}
</script>

<style lang="scss">
.oc-notification-message {
  word-break: break-word;
}

// TODO: Refactor after removal of uikit
.oc-notification-message {
  background-color: var(--oc-color-background-default) !important;
  border: 1px solid transparent;
  cursor: pointer;
  font-size: 1.25rem;
  line-height: 1.4;
  margin-top: var(--oc-space-small);
  padding: 15px;
  position: relative;

  &-passive {
    color: var(--oc-color-swatch-passive-default) !important;
    border-color: var(--oc-color-swatch-passive-default);
  }
  &-primary {
    color: var(--oc-color-swatch-primary-default) !important;
    border-color: var(--oc-color-swatch-primary-default);
  }
  &-success {
    color: var(--oc-color-swatch-success-default) !important;
    border-color: var(--oc-color-swatch-success-default);
  }
  &-warning {
    color: var(--oc-color-swatch-warning-default) !important;
    border-color: var(--oc-color-swatch-warning-default);
  }
  &-danger {
    color: var(--oc-color-swatch-danger-default) !important;
    border-color: var(--oc-color-swatch-danger-default);
  }
}
</style>

<docs>
  Please have a look at the component [OcNotifications](#/oC%20Components/OcNotifications) for example code.
</docs>
