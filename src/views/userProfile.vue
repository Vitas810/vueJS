<template>
    <div class="profile-page" v-if="userProfile">
        <div class="user-info">
            <div class="container">
                <div class="row">
                    <div class="col-xs-12 col-md-10 offset-md-1">
                        <img class="user-img" :src="userProfile.image" alt="user photo" />
                        <h4>{{userProfile.username}}</h4>
                        <p>{{userProfile.bio}}</p>
                        <div>
                            FOLLOW USER BTN
                            <router-link :to="{name: 'settings'}"
                                         v-if="isCurrentUserProfile"
                                         class="btn btn-sm btn-outline-secondary action-btn">
                                 Edit Profile Settings
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="container">
            <div class="row">
                <div class="col-xs-12 col-md-10 offset-md-1">
                    <div class="article-toggle">
                        <ul class="nav nav-pills outline-active">
                            <li class="nav-item">
                                <router-link
                                    :to="{
                                        name: 'userProfile',
                                        params: { slug: userProfile.username }
                                    }"
                                    class="nav-link"
                                    :class="{'active': routeName === 'userProfile'}"
                                >
                                    My Post
                                </router-link>
                            </li>
                            <li class="nav-item">
                                <router-link
                                    :to="{
                                        name: 'userProfileFavorites',
                                        params: { slug: userProfile.username }
                                    }"
                                    class="nav-link"
                                    :class="{'active': routeName === 'userProfileFavorites'}"
                                >
                                    Favorites Post
                                </router-link>
                            </li>
                        </ul>
                    </div>
                    <mcv-feed :api-url="apiUrl" />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { actionTypes as userProfileActionTypes } from '@/store/modules/userProfile'
import { getterTypes as authGetterTypes } from '@/store/modules/auth'
import McvFeed from '@/components/Feed.vue'
import { CurrentUser, Profile } from '@/types/domain'
import { RootState } from '@/types/store'

export default Vue.extend({
  name: 'McvUserProfile',
  components: { McvFeed },
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
      return this.$store.getters[authGetterTypes.currentUser] as CurrentUser | null
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
      this.$store.dispatch(userProfileActionTypes.getUserProfile, {
        slug: this.userProfileSlug,
      })
    },
  },
})
</script>