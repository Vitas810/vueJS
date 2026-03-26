<template>
    <div class="article-page">
       <div class="banner">
           <div class="container" v-if="article">
                <h1>{{article.title}}</h1>
               <div class="article-meta">
                   <router-link :to="{name: 'userProfile', params: {slug: article.author.username}}">
                       <img :src="article.author.image" :alt="article.author.username">
                   </router-link>
                   <div class="info">
                       <router-link :to="{name: 'userProfile', params: {slug: article.author.username}}">
                           {{article.author.username}}
                       </router-link>
                       <span class="date">{{article.createdAt}}</span>
                   </div>
                   <span v-if="isAuthor">
                       <router-link
                           class="btn btn-outline-secondary btn-sm"
                           :to="{name: 'editArticle', params: {slug: article.slug}}" >
                           <i class="ion-edit" />
                           Edit Article
                       </router-link>
                       <button class="btn btn-outline-danger btn-sm" @click="deleteArticle">
                           <i class="ion-trash-a" />
                           Delete Article
                       </button>
                   </span>
               </div>
           </div>
       </div>
        <div class="container page">
            <mcv-loading v-if="isLoading" />
            <mcv-error-message v-if="error" :message="error" />
            <div class="row article-content" v-if="article">
                <div class="col-xs-12">
                    <div>
                        <p>{{article.body}}</p>
                    </div>
                    <mcv-tag-list :tags="article.tagList" />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { actionTypes as articleActionTypes } from '@/store/modules/article'
import { getterTypes as authGetterTypes } from '@/store/modules/auth'
import McvLoading from '@/components/Loading.vue'
import McvErrorMessage from '@/components/ErrorMessage.vue'
import McvTagList from '@/components/Taglist.vue'
import { Article, CurrentUser } from '@/types/domain'
import { RootState } from '@/types/store'

export default Vue.extend({
  name: 'McvArticle',
  components: {
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
      return this.$store.getters[authGetterTypes.currentUser] as CurrentUser | null
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
    this.$store.dispatch(articleActionTypes.getArticle, {
      slug: this.articleSlug,
    })
  },
  watch: {
    articleSlug(slug: string): void {
      if (slug) {
        this.$store.dispatch(articleActionTypes.getArticle, { slug })
      }
    },
  },
  methods: {
    // Удаление статьи
    deleteArticle(): void {
      const deletePromise = this.$store.dispatch(articleActionTypes.deleteArticle, {
        slug: this.articleSlug,
      }) as Promise<void>

      deletePromise.then(() => {
        this.$router.push({ name: 'globalfeed' })
      })
    },
  },
})
</script>