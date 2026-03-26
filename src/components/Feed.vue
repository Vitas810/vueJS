<template>
  <div>
    <mcv-loading v-if="isLoading" />
    <mcv-error-message v-if="error" :message="error" />

    <div v-if="feed">
      <div
        class="article-preview"
        v-for="article in feed.articles"
        :key="article.slug"
      >
        <div class="article-meta">
          <router-link
            :to="{name: 'userProfile', params: {slug: article.author.username}}"
          >
            <img :src="article.author.image" :alt="article.author.username" />
          </router-link>
          <div class="info">
            <router-link
              :to="{
                name: 'userProfile',
                params: {slug: article.author.username},
              }"
              class="author"
            >
              {{ article.author.username }}
            </router-link>
            <span class="date">{{ article.createdAt }}</span>
          </div>
          <div class="pull-xs-right">
              <mcv-add-to-favorites
                :is-favorited="article.favorited"
                :article-slug="article.slug"
                :favorites-count="article.favoritesCount"
              />
          </div>
        </div>
        <router-link
          :to="{name: 'article', params: {slug: article.slug}}"
          class="preview-link"
        >
          <h1>{{ article.title }}</h1>
          <p>{{ article.description }}</p>
          <span>Read more...</span>

          <mcv-tag-list :tags="article.tagList" />
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
import { actionTypes } from '@/store/modules/feed'
import McvPagination from '@/components/Pagination.vue'
import { limit } from '@/helpers/vars'
import { buildFeedApiUrl } from '@/helpers/feedApiUrl'
import McvLoading from '@/components/Loading.vue'
import McvErrorMessage from '@/components/ErrorMessage.vue'
import McvTagList from '@/components/Taglist.vue'
import McvAddToFavorites from '@/components/AddToFavorites.vue'
import { FeedResponse } from '@/types/domain'
import { RootState } from '@/types/store'

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

      this.$store.dispatch(actionTypes.getFeed, { apiUrl: apiUrlWithParams })
    },
  },
})
</script>
