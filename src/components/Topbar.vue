<template>
  <nav class="topbar">
    <div class="app-container topbar__inner">
      <router-link class="topbar__brand" :to="{name: 'globalfeed'}">
        <span class="topbar__brand-mark">M</span>
        <span>MediumClone</span>
      </router-link>

      <div class="topbar__nav">
        <router-link
          class="topbar__link"
          :to="{name: 'globalfeed'}"
          exact
          active-class="active"
        >
          Home
        </router-link>

        <template v-if="isLoggedIn && currentUser">
          <router-link
            class="topbar__link topbar__link_accent"
            :to="{name: 'createArticle'}"
            active-class="active"
          >
            <mcv-app-icon name="compose" />
            <span>New Article</span>
          </router-link>

          <router-link
            class="topbar__link"
            :to="{name: 'settings'}"
            active-class="active"
          >
            <mcv-app-icon name="settings" />
            <span>Settings</span>
          </router-link>

          <router-link
            class="topbar__link"
            :to="{name: 'userProfile', params: {slug: currentUser.username}}"
            active-class="active"
          >
            <span class="topbar__user">
              <img :src="currentUser.image" class="topbar__avatar" alt="user" />
              <span>{{ currentUser.username }}</span>
            </span>
          </router-link>
        </template>

        <template v-if="isAnonymous">
          <router-link
            class="topbar__link"
            :to="{name: 'login'}"
            active-class="active"
          >
            Sign In
          </router-link>

          <router-link
            class="topbar__link"
            :to="{name: 'register'}"
            active-class="active"
          >
            Sign Up
          </router-link>
        </template>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import Vue from 'vue'
import McvAppIcon from '@/components/AppIcon.vue'
import {getterTypes} from '@/store/modules/auth'
import {CurrentUser} from '@/types/domain'

export default Vue.extend({
  name: 'McvTopbar',
  components: {
    McvAppIcon,
  },
  computed: {
    // Текущий пользователь
    currentUser(): CurrentUser | null {
      return this.$store.getters[getterTypes.currentUser] as CurrentUser | null
    },

    // Флаг авторизованного пользователя
    isLoggedIn(): boolean {
      return this.$store.getters[getterTypes.isLoggedIn] as boolean
    },

    // Флаг гостя
    isAnonymous(): boolean {
      return this.$store.getters[getterTypes.isAnonymous] as boolean
    },
  },
})
</script>
