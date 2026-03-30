<template>
  <div class="topbar surface-card" :class="{'topbar_menu-open': isMobileMenuOpen}">
    <div class="topbar__head">
      <router-link class="topbar__brand" :to="{name: 'globalfeed'}">
        <span class="topbar__brand-mark">M</span>
        <span class="topbar__brand-content">
          <span class="topbar__brand-title">MediumClone</span>
        </span>
      </router-link>

      <div class="topbar__actions">
        <router-link
          v-if="showRegisterAction"
          class="app-button app-button_secondary app-button_small topbar__register-action"
          :to="{name: 'register'}"
        >
          Регистрация
        </router-link>

        <router-link
          v-if="isAuthenticated && currentUser"
          class="topbar__profile"
          :to="{name: 'userProfile', params: {slug: currentUser.username}}"
          @click.native="onNavigationItemClick"
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
            <span class="topbar__profile-name">{{ currentUser.username }}</span>
            <span class="topbar__profile-email">{{ currentUser.email }}</span>
          </span>
        </router-link>

        <button
          v-if="hasMenuLinks"
          ref="menuToggleButton"
          type="button"
          class="topbar__menu-toggle"
          :aria-expanded="String(isMobileMenuOpen)"
          aria-controls="topbar-main-nav"
          aria-label="Открыть меню"
          @click="toggleMobileMenu"
        >
          <span class="topbar__menu-toggle-line"></span>
          <span class="topbar__menu-toggle-line"></span>
          <span class="topbar__menu-toggle-line"></span>
        </button>
      </div>
    </div>

    <div v-if="hasMenuLinks" class="topbar__menu">
      <button
        type="button"
        class="topbar__overlay"
        aria-label="Закрыть меню"
        @click="closeMobileMenu"
      ></button>

      <nav id="topbar-main-nav" class="topbar__nav" aria-label="Главная навигация">
        <router-link
          v-if="isAuthenticated"
          class="topbar__link"
          :to="{name: 'yourFeed'}"
          active-class="active"
          @click.native="onNavigationItemClick"
        >
          <span class="topbar__link-title">Ваша лента</span>
        </router-link>

        <router-link
          v-if="isAuthenticated"
          class="topbar__link topbar__link_accent"
          :to="{name: 'createArticle'}"
          active-class="active"
          @click.native="onNavigationItemClick"
        >
          <mcv-app-icon name="compose" />
          <span class="topbar__link-title">Новая статья</span>
        </router-link>

        <router-link
          v-if="isAuthenticated"
          class="topbar__link"
          :to="{name: 'settings'}"
          active-class="active"
          @click.native="onNavigationItemClick"
        >
          <mcv-app-icon name="settings" />
          <span class="topbar__link-title">Настройки</span>
        </router-link>
      </nav>
    </div>
  </div>
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
  data() {
    return {
      isMobileMenuOpen: false,
    }
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

    // Флаг авторизованной сессии
    isAuthenticated(): boolean {
      return this.isLoggedIn && Boolean(this.currentUser)
    },

    // Кнопка регистрации для гостя
    showRegisterAction(): boolean {
      return !this.isAuthenticated
    },

    // Наличие пунктов в бургер-меню
    hasMenuLinks(): boolean {
      return this.isAuthenticated
    },
  },
  watch: {
    // Закрытие меню при смене маршрута
    $route(): void {
      this.closeMobileMenu()
    },
  },
  mounted() {
    window.addEventListener('keydown', this.onWindowKeydown)
    window.addEventListener('resize', this.onWindowResize)
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.onWindowKeydown)
    window.removeEventListener('resize', this.onWindowResize)
    document.body.classList.remove('app-scroll-lock')
  },
  methods: {
    // Первая буква пользователя
    getUserInitial(username: string): string {
      return username.slice(0, 1).toUpperCase()
    },

    // Переключение мобильного меню
    toggleMobileMenu(): void {
      this.isMobileMenuOpen = !this.isMobileMenuOpen
      this.syncBodyScrollLock()
    },

    // Закрытие мобильного меню
    closeMobileMenu(): void {
      if (!this.isMobileMenuOpen) {
        return
      }

      this.isMobileMenuOpen = false
      this.syncBodyScrollLock()
      this.focusMenuToggleButton()
    },

    // Закрытие меню по клику в навигации
    onNavigationItemClick(): void {
      this.closeMobileMenu()
    },

    // Закрытие по клавише Escape
    onWindowKeydown(event: KeyboardEvent): void {
      if (event.key !== 'Escape') {
        return
      }

      this.closeMobileMenu()
    },

    // Сброс меню при переходе на desktop
    onWindowResize(): void {
      if (window.innerWidth > 960) {
        this.closeMobileMenu()
      }
    },

    // Блокировка прокрутки фона на мобильном меню
    syncBodyScrollLock(): void {
      if (this.isMobileMenuOpen) {
        document.body.classList.add('app-scroll-lock')
        return
      }

      document.body.classList.remove('app-scroll-lock')
    },

    // Возврат фокуса на кнопку бургера
    focusMenuToggleButton(): void {
      const menuToggleButton = this.$refs.menuToggleButton as
        | HTMLButtonElement
        | undefined

      if (menuToggleButton) {
        menuToggleButton.focus()
      }
    },
  },
})
</script>
