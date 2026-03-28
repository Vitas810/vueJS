<template>
  <div class="feed-tabs">
    <div class="feed-tabs__list">
      <router-link
        v-if="isLoggedIn"
        :to="getFeedLocation('yourFeed')"
        class="feed-tabs__link"
        :class="{'feed-tabs__link_active': routeName === 'yourFeed'}"
      >
        Your Feed
      </router-link>

      <router-link
        :to="getFeedLocation('globalfeed')"
        class="feed-tabs__link"
        :class="{'feed-tabs__link_active': routeName === 'globalfeed'}"
      >
        Global Feed
      </router-link>

      <router-link
        v-if="tagName"
        :to="getFeedLocation('tag', {slug: tagName})"
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
import {Location} from 'vue-router'
import McvAppIcon from '@/components/AppIcon.vue'
import {getNamespacedType} from '@/store/helpers/namespacedType'
import {authModuleName, getterTypes} from '@/store/modules/auth'

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
      return this.$store.getters[
        getNamespacedType(authModuleName, getterTypes.isLoggedIn)
      ] as boolean
    },

    // Имя текущего маршрута
    routeName(): string {
      return String(this.$route.name ?? '')
    },
  },
  methods: {
    // Нормализация query лимита
    getRouteLimitQueryValue(): string | undefined {
      const routeLimitQuery = this.$route.query.limit

      if (typeof routeLimitQuery === 'string') {
        return routeLimitQuery
      }

      if (Array.isArray(routeLimitQuery)) {
        return routeLimitQuery[0]
      }

      return undefined
    },

    // Ссылка ленты с сохранением выбранного лимита
    getFeedLocation(name: string, params: Record<string, string> = {}): Location {
      const limitQueryValue = this.getRouteLimitQueryValue()
      const nextQuery =
        limitQueryValue !== undefined ? {limit: limitQueryValue} : undefined

      return {
        name,
        params,
        query: nextQuery,
      }
    },
  },
})
</script>
