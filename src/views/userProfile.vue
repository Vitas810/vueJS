<template>
  <div class="profile-page">
    <section class="profile-hero" v-if="userProfile">
      <div class="app-container">
        <div class="profile-hero__card surface-card">
          <img
            class="profile-hero__avatar"
            :src="userProfile.image"
            alt="user photo"
          />
          <h1 class="profile-hero__name">{{ userProfile.username }}</h1>
          <p class="profile-hero__bio">
            {{ userProfile.bio || 'This user has not added a short bio yet.' }}
          </p>

          <router-link
            v-if="isCurrentUserProfile"
            :to="{name: 'settings'}"
            class="app-button app-button_outline app-button_small"
          >
            Edit Profile Settings
          </router-link>
        </div>
      </div>
    </section>

    <section class="page-shell page-shell_compact">
      <div class="profile-page__content">
        <mcv-loading v-if="isLoading" />
        <mcv-error-message v-if="error" :message="error" />

        <template v-if="userProfile">
          <div class="feed-tabs">
            <div class="feed-tabs__list">
              <router-link
                :to="{
                  name: 'userProfile',
                  params: {slug: userProfile.username},
                }"
                class="feed-tabs__link"
                :class="{'feed-tabs__link_active': routeName === 'userProfile'}"
              >
                My Posts
              </router-link>

              <router-link
                :to="{
                  name: 'userProfileFavorites',
                  params: {slug: userProfile.username},
                }"
                class="feed-tabs__link"
                :class="{
                  'feed-tabs__link_active':
                    routeName === 'userProfileFavorites',
                }"
              >
                Favorite Posts
              </router-link>
            </div>
          </div>

          <mcv-feed :api-url="apiUrl" />
        </template>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {getNamespacedType} from '@/store/helpers/namespacedType'
import {
  authModuleName,
  getterTypes as authGetterTypes,
} from '@/store/modules/auth'
import {
  actionTypes as userProfileActionTypes,
  userProfileModuleName,
} from '@/store/modules/userProfile'
import McvErrorMessage from '@/components/ErrorMessage.vue'
import McvFeed from '@/components/Feed.vue'
import McvLoading from '@/components/Loading.vue'
import {CurrentUser, Profile} from '@/types/domain'
import {RootState} from '@/types/store'

export default Vue.extend({
  name: 'McvUserProfile',
  components: {
    McvErrorMessage,
    McvFeed,
    McvLoading,
  },
  computed: {
    // Состояние загрузки профиля
    isLoading(): boolean {
      return (this.$store.state as RootState).userProfile.isLoading
    },

    // Ошибка профиля
    error(): string | null {
      return (this.$store.state as RootState).userProfile.error
    },

    // Активный профиль
    userProfile(): Profile | null {
      return (this.$store.state as RootState).userProfile.data
    },

    // Текущий пользователь
    currentUser(): CurrentUser | null {
      return this.$store.getters[
        getNamespacedType(authModuleName, authGetterTypes.currentUser)
      ] as CurrentUser | null
    },

    // Проверка владельца профиля
    isCurrentUserProfile(): boolean {
      if (!this.currentUser || !this.userProfile) {
        return false
      }

      return this.currentUser.username === this.userProfile.username
    },

    // slug профиля
    userProfileSlug(): string {
      return String(this.$route.params.slug ?? '')
    },

    // URL ленты профиля
    apiUrl(): string {
      const isFavorites = this.$route.path.includes('favorites')

      return isFavorites
        ? `/articles?favorited=${this.userProfileSlug}`
        : `/articles?author=${this.userProfileSlug}`
    },

    // Имя текущего маршрута
    routeName(): string {
      return String(this.$route.name ?? '')
    },
  },
  watch: {
    userProfileSlug(): void {
      this.getUserProfile()
    },
  },
  mounted() {
    this.getUserProfile()
  },
  methods: {
    // Загрузка профиля пользователя
    getUserProfile(): void {
      this.$store.dispatch(
        getNamespacedType(
          userProfileModuleName,
          userProfileActionTypes.getUserProfile
        ),
        {
          slug: this.userProfileSlug,
        }
      )
    },
  },
})
</script>
