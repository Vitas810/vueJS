<template>
  <ul class="validation-errors">
    <li v-for="errorMessage in errorMessages" :key="errorMessage">
      {{ errorMessage }}
    </li>
  </ul>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { ValidationErrors } from '@/types/domain'

export default Vue.extend({
  name: 'McvValidationErrors',
  props: {
    validationErrors: {
      type: Object as PropType<ValidationErrors>,
      required: true,
    },
  },
  computed: {
    // Список сообщений валидации
    errorMessages(): string[] {
      return Object.keys(this.validationErrors).map((name) => {
        const messages = this.validationErrors[name].join(', ')

        return `${name} : ${messages}`
      })
    },
  },
})
</script>
