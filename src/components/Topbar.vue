<template>
  <nav class="navbar navbar-light">
    <div class="container">
      <router-link class="navbar-brand" :to="{name: 'globalfeed'}"
        >MediumClone
      </router-link>

      <ul class="nav navbar-nav pull-xs-right">
        <li class="nav-item">
          <router-link
            class="nav-link"
            :to="{name: 'globalfeed'}"
            exact
            active-class="active"
            >Home</router-link
          >
        </li>

        <template v-if="isLoggedIn">
          <li class="nav-item">
            <router-link
              class="nav-link"
              :to="{name: 'createArticle'}"
              active-class="active"
            >
              <i class="ion-compose"></i>&nbsp; New Article
            </router-link>
          </li>

          <li class="nav-item">
            <router-link
              class="nav-link"
              :to="{name: 'settings'}"
              active-class="active"
            >
              <i class="ion-gear-a"></i>&nbsp; Settings
            </router-link>
          </li>

          <li class="nav-item">
            <router-link
              class="nav-link"
              :to="{name: 'userProfile', params: {slug: currentUser.username}}"
              active-class="active"
            >
              <img :src="currentUser.image" class="user-pic" alt="user" />
              &nbsp; {{ currentUser.username }}
            </router-link>
          </li>
        </template>

        <template v-if="isAnonymous">
          <li class="nav-item">
            <router-link
              class="nav-link"
              :to="{name: 'login'}"
              active-class="active"
            >
              Sign In
            </router-link>
          </li>

          <li class="nav-item">
            <router-link
              class="nav-link"
              :to="{name: 'register'}"
              active-class="active"
            >
              Sign up
            </router-link>
          </li>
        </template>
      </ul>
    </div>
  </nav>
</template>

<script lang="ts">
import Vue from 'vue'
import { getterTypes } from '@/store/modules/auth'
import { CurrentUser } from '@/types/domain'

export default Vue.extend({
  name: 'McvTopbar',
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
