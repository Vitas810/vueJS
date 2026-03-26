<template>
    <div class="feed-toggle">
        <ul class="nav nav-pills outline-active">
            <li class="nav-item" v-if="isLoggedIn">
                <router-link :to="{name: 'yourFeed'}"
                             class="nav-link"
                             :class="{active: routeName === 'yourFeed'}"
                >
                    Your feed
                </router-link>
            </li>
            <li class="nav-item">
                <router-link :to="{name: 'globalfeed'}"
                             class="nav-link"
                             :class="{active: routeName === 'globalfeed'}"
                >
                    Global feed
                </router-link>
            </li>
            <li class="nav-item" v-if="tagName">
                <router-link :to="{name: 'tag', params: { slug: tagName }}"
                             class="nav-link"
                             :class="{active: routeName === 'tag'}"
                >
                    <i class="ion-pound"></i>
                    {{tagName}}
                </router-link>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getterTypes } from '@/store/modules/auth'

export default Vue.extend({
  name: 'McvFeedToggle',
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