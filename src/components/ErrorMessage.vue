<template>
  <div>{{ message }}</div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'McvErrorMessage',
  props: {
    message: {
      type: String,
      required: false,
      default: 'Something went wrong',
    },
  },
})
</script>
