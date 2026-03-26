<template>
    <div>
        <div class="editor-page">
            <div class="container page">
                <div class="row">
                    <div class="col-md-10 offset-md-1 col-xs-12">
                        <mcv-validation-errors v-if="errors"  :validation-errors="errors"/>

                        <form @submit.prevent="onSubmit">
                            <fieldset>
                                <fieldset class="form-group">
                                    <input type="text"
                                           class="form-control form-control-lg"
                                           placeholder="Article title"
                                           v-model="title"
                                    />
                                </fieldset>

                                <fieldset class="form-group">
                                    <input type="text"
                                           class="form-control form-control-lg"
                                           placeholder="description"
                                           v-model="description"
                                    />
                                </fieldset>

                                <fieldset class="form-group">
                                    <textarea  class="form-control form-control-lg"
                                               placeholder="What is this article about?"
                                               v-model="body"
                                    > </textarea>
                                </fieldset>

                                <fieldset class="form-group">
                                    <input type="text"
                                           class="form-control form-control-lg"
                                           placeholder="Enter tags"
                                           v-model="tagList"
                                    />
                                </fieldset>

                                <fieldset class="form-group">
                                    <button class="btn btn-lg pull-xs-right btn-primary"
                                            type="submit"
                                            :disabled="isSubmitting"
                                    >
                                        Publish Article
                                    </button>
                                </fieldset>
                            </fieldset>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
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