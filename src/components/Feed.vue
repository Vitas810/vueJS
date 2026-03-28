<template>
  <div>
    <mcv-loading v-if="isLoading" />
    <mcv-error-message v-if="error" :message="error" />

    <div v-if="feed" class="feed-list">
      <div
        class="feed-card surface-card"
        v-for="article in feed.articles"
        :key="article.slug"
      >
        <div class="feed-card__header">
          <router-link
            class="feed-card__meta"
            :to="{name: 'userProfile', params: {slug: article.author.username}}"
          >
            <img
              :src="article.author.image"
              :alt="article.author.username"
              class="feed-card__avatar"
            />
            <span class="feed-card__meta-content">
              <span class="feed-card__author">{{
                article.author.username
              }}</span>
              <span class="feed-card__date">{{ article.createdAt }}</span>
            </span>
          </router-link>

          <mcv-add-to-favorites
            :is-favorited="article.favorited"
            :article-slug="article.slug"
            :favorites-count="article.favoritesCount"
          />
        </div>

        <router-link
          :to="{name: 'article', params: {slug: article.slug}}"
          class="feed-card__link"
        >
          <h2 class="feed-card__title">{{ article.title }}</h2>
          <p class="feed-card__description">{{ article.description }}</p>

          <div class="feed-card__footer">
            <span class="feed-card__more">Read article</span>
            <mcv-tag-list :tags="article.tagList" />
          </div>
        </router-link>
      </div>
      <mcv-pagination
        :total="feed.articlesCount"
        :limit="limit"
        :current-page="currentPage"
        :url="baseUrl"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {actionTypes} from '@/store/modules/feed'
import McvPagination from '@/components/Pagination.vue'
import {limit} from '@/helpers/vars'
import {buildFeedApiUrl} from '@/helpers/feedApiUrl'
import McvLoading from '@/components/Loading.vue'
import McvErrorMessage from '@/components/ErrorMessage.vue'
import McvTagList from '@/components/Taglist.vue'
import McvAddToFavorites from '@/components/AddToFavorites.vue'
import {FeedResponse} from '@/types/domain'
import {RootState} from '@/types/store'

interface FeedData {
  limit: number
}

export default Vue.extend({
  name: 'McvFeed',
  props: {
    apiUrl: {
      type: String,
      required: true,
    },
  },
  components: {
    McvTagList,
    McvErrorMessage,
    McvPagination,
    McvLoading,
    McvAddToFavorites,
  },
  data(): FeedData {
    return {
      limit,
    }
  },
  computed: {
    // Флаг загрузки ленты
    isLoading(): boolean {
      return (this.$store.state as RootState).feed.isLoading
    },

    // Данные ленты
    feed(): FeedResponse | null {
      return (this.$store.state as RootState).feed.data
    },

    // Ошибка ленты
    error(): string | null {
      return (this.$store.state as RootState).feed.error
    },

    // Текущая страница
    currentPage(): number {
      return Number(this.$route.query.page || '1')
    },

    // Базовый URL страницы
    baseUrl(): string {
      return this.$route.path
    },
  },
  watch: {
    currentPage(): void {
      this.fetchFeed()
    },
    apiUrl(): void {
      this.fetchFeed()
    },
  },
  mounted() {
    this.fetchFeed()
  },
  methods: {
    // Загрузка ленты по текущим параметрам
    fetchFeed(): void {
      const apiUrlWithParams = buildFeedApiUrl(this.apiUrl, this.currentPage)

      this.$store.dispatch(actionTypes.getFeed, {apiUrl: apiUrlWithParams})
    },
  },
})
</script>
