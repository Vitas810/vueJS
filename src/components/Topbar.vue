<template>
  <aside class="topbar surface-card">
    <div class="topbar__inner">
      <router-link class="topbar__brand" :to="{name: 'globalfeed'}">
        <span class="topbar__brand-mark">M</span>
        <span class="topbar__brand-content">
          <span class="topbar__brand-title">MediumClone</span>
          <span class="topbar__brand-text">Редакционная панель</span>
        </span>
      </router-link>

      <nav class="topbar__nav">
        <div class="topbar__group">
          <span class="topbar__group-title">Главное меню</span>

          <router-link
            class="topbar__link"
            :to="{name: 'globalfeed'}"
            exact
            active-class="active"
          >
            <span class="topbar__link-text">
              <span class="topbar__link-title">Обзор</span>
              <span class="topbar__link-description"
                >Последние статьи и тренды</span
              >
            </span>
          </router-link>

          <router-link
            v-if="isLoggedIn"
            class="topbar__link"
            :to="{name: 'yourFeed'}"
            active-class="active"
          >
            <span class="topbar__link-text">
              <span class="topbar__link-title">Ваша лента</span>
              <span class="topbar__link-description"
                >Персональный поток и обновления</span
              >
            </span>
          </router-link>

          <router-link
            v-if="isLoggedIn"
            class="topbar__link topbar__link_accent"
            :to="{name: 'createArticle'}"
            active-class="active"
          >
            <mcv-app-icon name="compose" />
            <span class="topbar__link-text">
              <span class="topbar__link-title">Новая статья</span>
              <span class="topbar__link-description"
                >Опубликовать новый материал</span
              >
            </span>
          </router-link>

          <router-link
            v-if="isLoggedIn"
            class="topbar__link"
            :to="{name: 'settings'}"
            active-class="active"
          >
            <mcv-app-icon name="settings" />
            <span class="topbar__link-text">
              <span class="topbar__link-title">Настройки</span>
              <span class="topbar__link-description">Управление профилем</span>
            </span>
          </router-link>
        </div>

        <div v-if="currentUser && isLoggedIn" class="topbar__group">
          <span class="topbar__group-title">Рабочая область</span>

          <router-link
            class="topbar__profile"
            :to="{name: 'userProfile', params: {slug: currentUser.username}}"
          >
            <img
              v-if="currentUser.image"
              :src="currentUser.image"
              class="topbar__avatar"
              :alt="currentUser.username"
            />
            <span v-else class="topbar__avatar-fallback">
              {{ getUserInitial(currentUser.username) }}
            </span>
            <span class="topbar__profile-text">
              <span class="topbar__profile-name">{{
                currentUser.username
              }}</span>
              <span class="topbar__profile-email">{{ currentUser.email }}</span>
            </span>
          </router-link>
        </div>

        <div v-if="!isLoggedIn" class="topbar__group">
          <span class="topbar__group-title">Доступ</span>

          <router-link
            class="topbar__link"
            :to="{name: 'login'}"
            active-class="active"
          >
            <span class="topbar__link-text">
              <span class="topbar__link-title">Войти</span>
              <span class="topbar__link-description"
                >Продолжить работу в кабинете</span
              >
            </span>
          </router-link>

          <router-link
            class="topbar__link"
            :to="{name: 'register'}"
            active-class="active"
          >
            <span class="topbar__link-text">
              <span class="topbar__link-title">Регистрация</span>
              <span class="topbar__link-description"
                >Создать новый аккаунт</span
              >
            </span>
          </router-link>
        </div>

      </nav>

    </div>
  </aside>
</template>

<script lang="ts">
import Vue from 'vue'
import McvAppIcon from '@/components/AppIcon.vue'
import {getNamespacedType} from '@/store/helpers/namespacedType'
import {authModuleName, getterTypes} from '@/store/modules/auth'
import {CurrentUser} from '@/types/domain'

export default Vue.extend({
  name: 'McvTopbar',
  components: {
    McvAppIcon,
  },
  computed: {
    // Текущий пользователь
    currentUser(): CurrentUser | null {
      return this.$store.getters[
        getNamespacedType(authModuleName, getterTypes.currentUser)
      ] as CurrentUser | null
    },

    // Флаг авторизованного пользователя
    isLoggedIn(): boolean {
      return this.$store.getters[
        getNamespacedType(authModuleName, getterTypes.isLoggedIn)
      ] as boolean
    },

  },
  methods: {
    // Первая буква пользователя
    getUserInitial(username: string): string {
      return username.slice(0, 1).toUpperCase()
    },
  },
})
</script>
