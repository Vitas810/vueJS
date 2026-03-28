<template>
  <div class="article-page">
    <section v-if="article" class="article-hero">
      <div class="app-container">
        <div class="article-hero__card surface-card">
          <h1 class="article-hero__title">{{ article.title }}</h1>

          <div class="article-hero__meta">
            <div class="article-page__author">
              <router-link
                :to="{
                  name: 'userProfile',
                  params: {slug: article.author.username},
                }"
              >
                <img
                  v-if="article.author.image"
                  :src="article.author.image"
                  :alt="article.author.username"
                  class="article-page__author-avatar"
                />
                <span v-else class="article-page__author-avatar-fallback">
                  {{ getAuthorInitial(article.author.username) }}
                </span>
              </router-link>

              <div>
                <router-link
                  :to="{
                    name: 'userProfile',
                    params: {slug: article.author.username},
                  }"
                  class="article-page__author-name"
                >
                  {{ article.author.username }}
                </router-link>
                <div class="article-page__date">{{ article.createdAt }}</div>
              </div>
            </div>

            <div v-if="isAuthor" class="article-page__actions">
              <router-link
                class="app-button app-button_outline app-button_small"
                :to="{name: 'editArticle', params: {slug: article.slug}}"
              >
                <mcv-app-icon name="edit" />
                <span>Edit Article</span>
              </router-link>

              <button
                class="app-button app-button_danger app-button_small"
                @click="deleteArticle"
              >
                <mcv-app-icon name="delete" />
                <span>Delete Article</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="page-shell page-shell_compact">
      <div class="article-page__content">
        <mcv-loading v-if="isLoading" />
        <mcv-error-message v-if="error" :message="error" />

        <article v-if="article" class="article-page__body surface-card">
          <p class="article-page__text">{{ article.body }}</p>
          <mcv-tag-list :tags="article.tagList" :max-visible="10" />
        </article>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import McvAppIcon from '@/components/AppIcon.vue'
import {getNamespacedType} from '@/store/helpers/namespacedType'
import {
  actionTypes as articleActionTypes,
  articleModuleName,
} from '@/store/modules/article'
import {
  authModuleName,
  getterTypes as authGetterTypes,
} from '@/store/modules/auth'
import McvLoading from '@/components/Loading.vue'
import McvErrorMessage from '@/components/ErrorMessage.vue'
import McvTagList from '@/components/Taglist.vue'
import {Article, CurrentUser} from '@/types/domain'
import {RootState} from '@/types/store'

export default Vue.extend({
  name: 'McvArticle',
  components: {
    McvAppIcon,
    McvErrorMessage,
    McvLoading,
    McvTagList,
  },
  computed: {
    // Флаг загрузки статьи
    isLoading(): boolean {
      return (this.$store.state as RootState).article.isLoading
    },

    // Ошибка статьи
    error(): string | null {
      return (this.$store.state as RootState).article.error
    },

    // Текущая статья
    article(): Article | null {
      return (this.$store.state as RootState).article.data
    },

    // Текущий пользователь
    currentUser(): CurrentUser | null {
      return this.$store.getters[
        getNamespacedType(authModuleName, authGetterTypes.currentUser)
      ] as CurrentUser | null
    },

    // Признак автора статьи
    isAuthor(): boolean {
      if (!this.currentUser || !this.article) {
        return false
      }

      return this.currentUser.username === this.article.author.username
    },

    // slug активной статьи
    articleSlug(): string {
      return String(this.$route.params.slug ?? '')
    },
  },
  mounted() {
    this.$store.dispatch(
      getNamespacedType(articleModuleName, articleActionTypes.getArticle),
      {
        slug: this.articleSlug,
      }
    )
  },
  watch: {
    articleSlug(slug: string): void {
      if (slug) {
        this.$store.dispatch(
          getNamespacedType(articleModuleName, articleActionTypes.getArticle),
          {slug}
        )
      }
    },
  },
  methods: {
    // Первая буква автора
    getAuthorInitial(authorName: string): string {
      return authorName.slice(0, 1).toUpperCase()
    },

    // Удаление статьи
    deleteArticle(): void {
      const deletePromise = this.$store.dispatch(
        getNamespacedType(articleModuleName, articleActionTypes.deleteArticle),
        {
          slug: this.articleSlug,
        }
      ) as Promise<void>

      deletePromise.then(() => {
        this.$router.push({name: 'globalfeed'})
      })
    },
  },
})
</script>
