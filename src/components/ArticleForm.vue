<template>
  <section class="editor-page">
    <div class="app-container">
      <div class="editor-card surface-card">
        <h1 class="editor-page__title">Article Editor</h1>
        <p class="editor-page__subtitle">
          Prepare the article, description and tags in a local form without
          mutating store data.
        </p>

        <mcv-validation-errors v-if="errors" :validation-errors="errors" />

        <form class="form-layout" @submit.prevent="onSubmit">
          <label class="app-field">
            <span class="app-field__label">Article title</span>
            <input
              v-model="title"
              type="text"
              class="app-input"
              placeholder="Article title"
            />
          </label>

          <label class="app-field">
            <span class="app-field__label">Description</span>
            <input
              v-model="description"
              type="text"
              class="app-input"
              placeholder="Short description"
            />
          </label>

          <label class="app-field">
            <span class="app-field__label">Content</span>
            <textarea
              v-model="body"
              class="app-textarea"
              placeholder="What is this article about?"
            ></textarea>
          </label>

          <label class="app-field">
            <span class="app-field__label">Tags</span>
            <input
              v-model="tagList"
              type="text"
              class="app-input"
              placeholder="Enter tags separated by spaces"
            />
          </label>

          <div class="form-layout__actions">
            <button class="app-button" type="submit" :disabled="isSubmitting">
              Publish Article
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import McvValidationErrors from '@/components/ValidationErrors.vue'
import { ArticleFormValues, ValidationErrors } from '@/types/domain'

interface ArticleFormData {
  title: string
  description: string
  body: string
  tagList: string
}

export default Vue.extend({
  name: 'McvArticleForm',
  components: { McvValidationErrors },
  props: {
    initialValues: {
      type: Object as PropType<ArticleFormValues>,
      required: true,
    },
    errors: {
      type: Object as PropType<ValidationErrors | null>,
      required: false,
      default: null,
    },
    isSubmitting: {
      type: Boolean,
      required: true,
    },
  },
  data(): ArticleFormData {
    return {
      title: this.initialValues.title,
      description: this.initialValues.description,
      body: this.initialValues.body,
      tagList: this.initialValues.tagList.join(' '),
    }
  },
  watch: {
    // Синхронизация формы с входными значениями
    initialValues: {
      immediate: true,
      deep: true,
      handler(initialValues: ArticleFormValues): void {
        this.title = initialValues.title
        this.description = initialValues.description
        this.body = initialValues.body
        this.tagList = initialValues.tagList.join(' ')
      },
    },
  },
  methods: {
    // Отправка формы статьи
    onSubmit(): void {
      const form: ArticleFormValues = {
        title: this.title,
        description: this.description,
        body: this.body,
        tagList: this.tagList.split(' ').filter(Boolean),
      }

      this.$emit('articleSubmit', form)
    },
  },
})
</script>