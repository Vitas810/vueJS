<template>
  <div class="feed-tabs">
    <div class="feed-tabs__list">
      <router-link
        v-if="isLoggedIn"
        :to="{name: 'yourFeed'}"
        class="feed-tabs__link"
        :class="{'feed-tabs__link_active': routeName === 'yourFeed'}"
      >
        Your Feed
      </router-link>

      <router-link
        :to="{name: 'globalfeed'}"
        class="feed-tabs__link"
        :class="{'feed-tabs__link_active': routeName === 'globalfeed'}"
      >
        Global Feed
      </router-link>

      <router-link
        v-if="tagName"
        :to="{name: 'tag', params: {slug: tagName}}"
        class="feed-tabs__link"
        :class="{'feed-tabs__link_active': routeName === 'tag'}"
      >
        <mcv-app-icon name="hash" />
        <span>{{ tagName }}</span>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import McvAppIcon from '@/components/AppIcon.vue'
import {getterTypes} from '@/store/modules/auth'

export default Vue.extend({
  name: 'McvFeedToggle',
  components: {
    McvAppIcon,
  },
  props: {
    tagName: {
      type: String,
      required: false,
      default: '',
    },
  },
  computed: {
    // Флаг авторизации
    isLoggedIn(): boolean {
      return this.$store.getters[getterTypes.isLoggedIn] as boolean
    },

    // Имя текущего маршрута
    routeName(): string {
      return String(this.$route.name ?? '')
    },
  },
})
</script>
