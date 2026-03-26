<template>
    <ul class="tag-list">
        <li v-for="tag in tags" :key="tag" class="tag-default tag-pill tag-outline">
            {{tag}}
        </li>
    </ul>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

export default Vue.extend({
  name: 'McvTagList',
  props: {
    tags: {
      type: Array as PropType<string[]>,
      required: true,
    },
  },
})
</script>