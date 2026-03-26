<template>
  <div>
    <mcv-loading v-if="isLoading" />
    <mcv-error-message v-if="error" :message="error" />

    <div class="sidebar" v-if="popularTags">
      <p>Popular Tags</p>
      <div class="tag-list">
        <router-link
          v-for="popularTag in popularTags"
          :key="popularTag"
          :to="{name: 'tag', params: {slug: popularTag}}"
          class="tag-default tag-pill"
        >
          {{ popularTag }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { actionTypes } from '@/store/modules/popularTags'
import McvLoading from '@/components/Loading.vue'
import McvErrorMessage from '@/components/ErrorMessage.vue'
import { RootState } from '@/types/store'

export default Vue.extend({
  name: 'McvPopularTags',
  components: {
    McvErrorMessage,
    McvLoading,
  },
  computed: {
    // Флаг загрузки тегов
    isLoading(): boolean {
      return (this.$store.state as RootState).popularTags.isLoading
    },

    // Ошибка загрузки тегов
    error(): string | null {
      return (this.$store.state as RootState).popularTags.error
    },

    // Список популярных тегов
    popularTags(): string[] | null {
      return (this.$store.state as RootState).popularTags.data
    },
  },
  mounted() {
    this.$store.dispatch(actionTypes.getPopularTags)
  },
})
</script>
