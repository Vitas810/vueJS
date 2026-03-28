<template>
  <div>
    <mcv-loading v-if="isLoading" />
    <mcv-error-message v-if="error" :message="error" />

    <aside v-if="popularTags" class="popular-tags surface-card">
      <h2 class="popular-tags__title">Popular Tags</h2>
      <div class="popular-tags__list">
        <router-link
          v-for="popularTag in popularTags"
          :key="popularTag"
          :to="{name: 'tag', params: {slug: popularTag}}"
          class="tag-list__item tag-list__item_link"
        >
          {{ popularTag }}
        </router-link>
      </div>
    </aside>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {getNamespacedType} from '@/store/helpers/namespacedType'
import {actionTypes, popularTagsModuleName} from '@/store/modules/popularTags'
import McvLoading from '@/components/Loading.vue'
import McvErrorMessage from '@/components/ErrorMessage.vue'
import {RootState} from '@/types/store'

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
    this.$store.dispatch(
      getNamespacedType(popularTagsModuleName, actionTypes.getPopularTags)
    )
  },
})
</script>
