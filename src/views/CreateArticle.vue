<template>
  <mcv-article-form
    :initial-values="initialValues"
    :errors="validationErrors"
    :is-submitting="isSubmitting"
    @articleSubmit="onSubmit"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import McvArticleForm from '@/components/ArticleForm.vue'
import {actionTypes} from '@/store/modules/createArticle'
import {Article, ArticleFormValues, ValidationErrors} from '@/types/domain'
import {RootState} from '@/types/store'

interface CreateArticleData {
  initialValues: ArticleFormValues
}

export default Vue.extend({
  name: 'McvCreateArticle',
  components: {McvArticleForm},
  data(): CreateArticleData {
    return {
      initialValues: {
        title: '',
        description: '',
        body: '',
        tagList: [],
      },
    }
  },
  computed: {
    // Флаг отправки формы
    isSubmitting(): boolean {
      return (this.$store.state as RootState).createArticle.isSubmitting
    },

    // Ошибки формы статьи
    validationErrors(): ValidationErrors | null {
      return (this.$store.state as RootState).createArticle.validationErrors
    },
  },
  methods: {
    // Создание статьи
    onSubmit(articleInput: ArticleFormValues): void {
      const createPromise = this.$store.dispatch(actionTypes.createArticle, {
        articleInput,
      }) as Promise<Article>

      createPromise.then((article) => {
        this.$router.push({name: 'article', params: {slug: article.slug}})
      })
    },
  },
})
</script>
