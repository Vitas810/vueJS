<template>
  <div>
    <mcv-loading v-if="isLoading" />
    <mcv-error-message v-if="error" :message="error" />

    <div v-if="feed" class="feed-list">
      <div class="feed-controls surface-card">
        <span class="feed-controls__label">Карточек на странице</span>
        <div class="feed-controls__list">
          <button
            v-for="feedLimitOption in feedLimits"
            :key="feedLimitOption"
            type="button"
            class="feed-controls__button"
            :aria-pressed="String(currentLimit === feedLimitOption)"
            :class="{
              'feed-controls__button_active':
                currentLimit === feedLimitOption,
            }"
            @click="setFeedLimit(feedLimitOption)"
          >
            {{ feedLimitOption }}
          </button>
        </div>
      </div>

      <div
        class="feed-card surface-card"
        v-for="(article, articleIndex) in feed.articles"
        :key="`${article.slug}-${articleIndex}`"
      >
        <div class="feed-card__header">
          <router-link
            class="feed-card__meta"
            :to="{name: 'userProfile', params: {slug: article.author.username}}"
          >
            <img
              v-if="article.author.image"
              :src="article.author.image"
              :alt="article.author.username"
              class="feed-card__avatar"
            />
            <span v-else class="feed-card__avatar-fallback">
              {{ getAuthorInitial(article.author.username) }}
            </span>
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
          class="feed-card__cover"
          v-if="article.author.image"
        >
          <img
            :src="article.author.image"
            :alt="getArticleCoverAlt(article.author.username)"
            class="feed-card__cover-image"
          />
        </router-link>

        <router-link
          :to="{name: 'article', params: {slug: article.slug}}"
          class="feed-card__link"
        >
          <div class="feed-card__eyebrow">
            <span class="feed-card__status">Статья</span>
            <span class="feed-card__reading-time">
              {{ getReadingTime(article.body) }} мин чтения
            </span>
          </div>

          <h2 class="feed-card__title">{{ article.title }}</h2>
          <p class="feed-card__description">{{ article.description }}</p>
          <p class="feed-card__excerpt">
            {{ getArticleExcerpt(article.body) }}
          </p>

          <div class="feed-card__footer">
            <span class="feed-card__more">Читать статью</span>
            <mcv-tag-list :tags="article.tagList" :max-visible="10" />
          </div>
        </router-link>
      </div>
      <mcv-pagination
        :total="feed.articlesCount"
        :limit="currentLimit"
        :current-page="currentPage"
        :url="baseUrl"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {getNamespacedType} from '@/store/helpers/namespacedType'
import {actionTypes, feedModuleName} from '@/store/modules/feed'
import McvPagination from '@/components/Pagination.vue'
import {defaultFeedLimit, feedLimitOptions} from '@/helpers/vars'
import {buildFeedApiUrl} from '@/helpers/feedApiUrl'
import McvLoading from '@/components/Loading.vue'
import McvErrorMessage from '@/components/ErrorMessage.vue'
import McvTagList from '@/components/Taglist.vue'
import McvAddToFavorites from '@/components/AddToFavorites.vue'
import {FeedResponse} from '@/types/domain'
import {RootState} from '@/types/store'

type FeedLimitOption = (typeof feedLimitOptions)[number]

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
      const routePageValue = Number(this.$route.query.page ?? '1')

      if (!Number.isFinite(routePageValue) || routePageValue < 1) {
        return 1
      }

      return Math.floor(routePageValue)
    },

    // Текущий лимит карточек
    currentLimit(): FeedLimitOption {
      const routeLimitValue = Number(this.$route.query.limit ?? defaultFeedLimit)

      if (feedLimitOptions.includes(routeLimitValue as FeedLimitOption)) {
        return routeLimitValue as FeedLimitOption
      }

      return defaultFeedLimit
    },

    // Доступные лимиты карточек
    feedLimits(): FeedLimitOption[] {
      return [...feedLimitOptions]
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
    currentLimit(): void {
      this.fetchFeed()
    },
    apiUrl(): void {
      this.fetchFeed()
    },
  },
  mounted() {
    this.ensureValidFeedQuery()
    this.fetchFeed()
  },
  methods: {
    // Нормализация query параметров ленты
    ensureValidFeedQuery(): boolean {
      const currentPageQueryValue = this.getQueryStringValue(this.$route.query.page)
      const currentLimitQueryValue = this.getQueryStringValue(
        this.$route.query.limit
      )
      const normalizedPageQuery = String(this.currentPage)
      const normalizedLimitQuery = String(this.currentLimit)

      if (
        currentPageQueryValue === normalizedPageQuery &&
        currentLimitQueryValue === normalizedLimitQuery
      ) {
        return false
      }

      this.$router.replace({
        path: this.baseUrl,
        query: {
          ...this.$route.query,
          page: normalizedPageQuery,
          limit: normalizedLimitQuery,
        },
      })

      return true
    },

    // Получение строкового query значения
    getQueryStringValue(
      queryValue: string | null | Array<string | null> | undefined
    ): string | undefined {
      if (typeof queryValue === 'string') {
        return queryValue
      }

      if (Array.isArray(queryValue)) {
        const firstQueryValue = queryValue[0]
        return typeof firstQueryValue === 'string' ? firstQueryValue : undefined
      }

      return undefined
    },

    // Загрузка ленты по текущим параметрам
    fetchFeed(): void {
      const apiUrlWithParams = buildFeedApiUrl(
        this.apiUrl,
        this.currentPage,
        this.currentLimit
      )

      this.$store.dispatch(
        getNamespacedType(feedModuleName, actionTypes.getFeed),
        {apiUrl: apiUrlWithParams}
      )
    },

    // Обновление лимита карточек в URL
    setFeedLimit(feedLimit: FeedLimitOption): void {
      if (feedLimit === this.currentLimit) {
        return
      }

      this.$router.push({
        path: this.baseUrl,
        query: {
          ...this.$route.query,
          page: '1',
          limit: String(feedLimit),
        },
      })
    },

    // Текст alt для обложки карточки
    getArticleCoverAlt(authorName: string): string {
      return `Обложка автора ${authorName}`
    },

    // Короткий фрагмент статьи
    getArticleExcerpt(articleBody: string): string {
      return articleBody.slice(0, 140).trim()
    },

    // Оценка времени чтения
    getReadingTime(articleBody: string): number {
      const wordCount = articleBody.trim().split(/\s+/).filter(Boolean).length

      return Math.max(1, Math.ceil(wordCount / 180))
    },

    // Первая буква автора
    getAuthorInitial(authorName: string): string {
      return authorName.slice(0, 1).toUpperCase()
    },
  },
})
</script>
