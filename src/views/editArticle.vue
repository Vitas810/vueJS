<template>
  <div>
    <mcv-loading v-if="isLoading" />
    <mcv-article-form
      v-if="initialValues"
      :initialValues="initialValues"
      :errors="validationErrors"
      :isSubmitting="isSubmitting"
      @articleSubmit="onSubmit"
    >
    </mcv-article-form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import McvArticleForm from '@/components/ArticleForm.vue'
import McvLoading from '@/components/Loading.vue'
import {getNamespacedType} from '@/store/helpers/namespacedType'
import {actionTypes, editArticleModuleName} from '@/store/modules/editArticle'
import {Article, ArticleFormValues, ValidationErrors} from '@/types/domain'
import {RootState} from '@/types/store'

export default Vue.extend({
  name: 'McvEditArticle',
  components: {
    McvArticleForm,
    McvLoading,
  },
  computed: {
    // slug активной статьи
    articleSlug(): string {
      return String(this.$route.params.slug ?? '')
    },

    // Флаг загрузки статьи
    isLoading(): boolean {
      return (this.$store.state as RootState).editArticle.isLoading
    },

    // Текущая статья
    article(): Article | null {
      return (this.$store.state as RootState).editArticle.article
    },

    // Флаг отправки формы
    isSubmitting(): boolean {
      return (this.$store.state as RootState).editArticle.isSubmitting
    },

    // Ошибки валидации
    validationErrors(): ValidationErrors | null {
      return (this.$store.state as RootState).editArticle.validationErrors
    },

    // Начальные значения формы
    initialValues(): ArticleFormValues | null {
      if (!this.article) {
        return null
      }

      return {
        title: this.article.title,
        description: this.article.description,
        body: this.article.body,
        tagList: [...this.article.tagList],
      }
    },
  },
  watch: {
    articleSlug(): void {
      this.fetchArticle()
    },
  },
  mounted() {
    this.fetchArticle()
  },
  methods: {
    // Загрузка статьи для редактирования
    fetchArticle(): void {
      this.$store.dispatch(
        getNamespacedType(editArticleModuleName, actionTypes.getArticle),
        {
          slug: this.articleSlug,
        }
      )
    },

    // Обновление статьи
    onSubmit(articleInput: ArticleFormValues): void {
      const updatePromise = this.$store.dispatch(
        getNamespacedType(editArticleModuleName, actionTypes.updateArticle),
        {
          articleInput,
          slug: this.articleSlug,
        }
      ) as Promise<Article>

      updatePromise.then((article) => {
        this.$router.push({name: 'article', params: {slug: article.slug}})
      })
    },
  },
})
</script>
