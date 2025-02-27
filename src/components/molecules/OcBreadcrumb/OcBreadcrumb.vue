<template>
  <nav :class="`oc-breadcrumb oc-breadcrumb-${variation}`">
    <ol class="oc-breadcrumb-list oc-mb-s">
      <li v-for="(item, index) in items" :key="index" class="oc-breadcrumb-list-item">
        <router-link v-if="item.to" :aria-current="getAriaCurrent(index)" :to="item.to">
          <span>{{ item.text }}</span>
        </router-link>
        <oc-icon
          v-if="item.to"
          color="var(--oc-color-text-default)"
          name="arrow-right-s"
          fill-type="line"
        />
        <oc-button
          v-else-if="item.onClick"
          :aria-current="getAriaCurrent(index)"
          appearance="raw"
          @click="item.onClick"
        >
          <span>{{ item.text }}</span>
        </oc-button>
        <span v-else :aria-current="getAriaCurrent(index)" tabindex="-1" v-text="item.text" />
        <template v-if="showContextMenu && index === items.length - 1">
          <oc-button
            id="oc-breadcrumb-contextmenu-trigger"
            v-oc-tooltip="contextMenuLabel"
            :aria-label="contextMenuLabel"
            appearance="raw"
          >
            <oc-icon name="more-2" color="var(--oc-color-text-default)" />
          </oc-button>
          <oc-drop
            drop-id="oc-breadcrumb-contextmenu"
            toggle="#oc-breadcrumb-contextmenu-trigger"
            mode="click"
            close-on-click
            :padding-size="contextMenuPadding"
            @click.native.stop.prevent
          >
            <!-- @slot Add context actions that open in a dropdown when clicking on the "three dots" button -->
            <slot name="contextMenu" />
          </oc-drop>
        </template>
      </li>
    </ol>
    <div class="oc-breadcrumb-drop">
      <label
        ref="mobileDropdown"
        tabindex="0"
        class="oc-breadcrumb-drop-label"
        @keydown.enter="$refs.mobileDropdown.click()"
      >
        <span
          v-if="currentFolder"
          class="oc-breadcrumb-drop-label-text"
          aria-current="page"
          v-text="currentFolder.text"
        />
        <oc-icon
          class="oc-breadcrumb-drop-label-icon"
          name="arrow-down-s"
          :accessible-label="$gettext('Expand more')"
        />
      </label>
      <oc-drop v-if="dropdownItems">
        <ol>
          <li v-for="(item, index) in dropdownItems" :key="index">
            <router-link v-if="item.to" :aria-current="getAriaCurrent(index)" :to="item.to">
              {{ item.text }}
            </router-link>
            <oc-button
              v-else-if="item.onClick"
              justify-content="left"
              appearance="raw"
              :aria-current="getAriaCurrent(index)"
              @click="item.onClick"
            >
              {{ item.text }}
            </oc-button>
            <span v-else :aria-current="getAriaCurrent(index)" v-text="item.text" />
          </li>
        </ol>
      </oc-drop>
    </div>
  </nav>
</template>

<script>
import OcButton from "../../atoms/OcButton/OcButton.vue"
import OcDrop from "../../atoms/OcDrop/OcDrop.vue"
import OcIcon from "../../atoms/OcIcon/OcIcon.vue"

/**
 * Displays a breadcrumb. Each item in the items property has the following elements:
 *
 *  - text: mandatory element, holds the text which is to be displayed in the breadcrumb
 *  - to: optional element, the vue router link
 */
export default {
  name: "OcBreadcrumb",
  status: "ready",
  release: "1.0.0",

  components: {
    OcDrop,
    OcIcon,
    OcButton,
  },

  props: {
    /**
     * Array of breadcrumb items
     */
    items: {
      type: Array,
      required: true,
    },
    /**
     * Variation of breadcrumbs
     * Can be `default` or `lead`
     */
    variation: {
      type: String,
      required: false,
      default: "default",
      validator: value => value === "lead" || value === "default",
    },
    /**
     * Defines the padding size around the drop content. Defaults to `medium`.
     *
     * @values xsmall, small, medium, large, xlarge, xxlarge, xxxlarge, remove
     */
    contextMenuPadding: {
      type: String,
      required: false,
      default: "medium",
      validator: value => {
        return value.match(/(xsmall|small|medium|large|xlarge|xxlarge|xxxlarge|remove)/)
      },
    },
  },
  computed: {
    dropdownItems() {
      if (this.items.length <= 1 || !this.items) return false

      return [...this.items].reverse().slice(1)
    },
    currentFolder() {
      if (this.items.length === 0 || !this.items) return false

      return [...this.items].reverse()[0]
    },
    contextMenuLabel() {
      return this.$gettext("Show actions for current folder")
    },
    showContextMenu() {
      return !!this.$slots.contextMenu
    },
  },
  methods: {
    getAriaCurrent(index) {
      return this.items.length - 1 === index ? "page" : null
    },
  },
}
</script>

<style lang="scss">
.oc-breadcrumb {
  overflow: hidden;

  &-list {
    @extend .oc-visible\@s;
    @extend .oc-m-rm;
    @extend .oc-p-rm;

    list-style: none;

    > * {
      display: contents;
    }

    #oc-breadcrumb-contextmenu-trigger > span {
      vertical-align: middle;
      border: 3px solid transparent;
    }

    #oc-breadcrumb-contextmenu li button {
      display: inline-flex;
    }

    > li button {
      display: inline;
    }

    > li a,
    > li button,
    > li span,
    > :nth-child(n + 2)::before {
      color: var(--oc-color-text-default);
      display: inline-block;
      vertical-align: middle;
      line-height: normal;
    }

    > :last-child > span {
      color: var(--oc-color-text-default);
    }

    > li a:hover,
    > li span:not([aria-current="page"]):not(.oc-icon):hover,
    > li button:hover {
      text-decoration: underline;
    }
  }

  /* stylelint-disable */
  &-list-item {
    a,
    button,
    span {
      font-size: 1rem;
    }
  }

  &-lead &-list-item {
    a,
    button,
    span {
      font-size: var(--oc-font-size-large);
    }
  }
  /* stylelint-enable */

  &-drop {
    @extend .oc-hidden\@s;

    .oc-drop > .oc-card > ol {
      @extend .oc-m-rm;
      @extend .oc-p-rm;

      list-style: none;

      > li a,
      > li button,
      > li span {
        color: var(--oc-color-text-default);
        font-size: 0.875rem;
      }

      > li a:hover,
      > li span:hover,
      > li button:hover {
        color: var(--oc-color-swatch-brand-default);
      }

      li button {
        width: 100%;
      }
    }

    &-label {
      @extend .oc-flex;
      @extend .oc-flex-middle;
      @extend .oc-flex-between;

      border: $global-border-width solid var(--oc-color-swatch-primary-muted);
      cursor: pointer;
      height: $global-control-height;
      padding: var(--oc-space-small);

      &-text {
        @extend .oc-text-truncate;
      }
    }
  }
}
</style>

<docs>
```js
<template>
<section>
  <div>
    <oc-breadcrumb :items="items" />
  </div>
  <div>
    <oc-breadcrumb :items="items" variation="lead" />
    <oc-breadcrumb :items="items" >
      <template v-slot:contextMenu>
        <p class="oc-my-rm">I'm an example item</p>
      </template>
    </oc-breadcrumb>
  </div>
</section>
</template>
<script>
  export default {
    data: () => {
      return {
        items: [
          {text:'First folder',to:{path:'folder'}},
          {text:'Subfolder', to: {path: 'subfolder'}},
          {text:'Deep',to:{path:'deep'}},
          {text:'Deeper ellipsize in responsive mode'},
        ]
      }
    }
  }
</script>
```
</docs>
