<template>
  <div>
    <mcv-loading v-if="isLoading" />
    <mcv-error-message v-if="error" :message="error" />

    <aside
      v-if="popularTags && popularTags.length"
      class="popular-tags surface-card"
    >
      <h2 class="popular-tags__title">Популярные теги</h2>
      <div class="popular-tags__list">
        <router-link
          v-for="(popularTag, tagIndex) in visiblePopularTags"
          :key="`${popularTag}-${tagIndex}`"
          :to="getTagLocation(popularTag)"
          class="tag-list__item tag-list__item_link"
        >
          {{ popularTag }}
        </router-link>
      </div>

      <button
        v-if="hasHiddenPopularTags"
        class="app-button app-button_secondary app-button_small popular-tags__toggle"
        type="button"
        :aria-expanded="String(hasExpandedPopularTags)"
        @click="togglePopularTags"
      >
        Показать еще
      </button>
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

interface PopularTagsData {
  visibleTagsCount: number
}

const popularTagsInitialVisibleCount = 10

export default Vue.extend({
  name: 'McvPopularTags',
  components: {
    McvErrorMessage,
    McvLoading,
  },
  data(): PopularTagsData {
    return {
      visibleTagsCount: popularTagsInitialVisibleCount,
    }
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

    // Теги с учетом ограничения
    visiblePopularTags(): string[] {
      if (!this.popularTags) {
        return []
      }

      return this.popularTags.slice(0, this.visibleTagsCount)
    },

    // Флаг скрытых тегов
    hasHiddenPopularTags(): boolean {
      return Boolean(
        this.popularTags && this.visibleTagsCount < this.popularTags.length
      )
    },

    // Факт частичного раскрытия списка
    hasExpandedPopularTags(): boolean {
      return this.visibleTagsCount > popularTagsInitialVisibleCount
    },
  },
  mounted() {
    this.$store.dispatch(
      getNamespacedType(popularTagsModuleName, actionTypes.getPopularTags)
    )
  },
  watch: {
    // Сброс окна тегов при обновлении данных
    popularTags(): void {
      this.visibleTagsCount = popularTagsInitialVisibleCount
    },
  },
  methods: {
    // Ссылка на ленту тега с сохранением лимита
    getTagLocation(tagSlug: string): {name: string; params: {slug: string}; query?: {limit: string}} {
      const limitQueryValue = this.$route.query.limit
      const normalizedLimitQueryValue = Array.isArray(limitQueryValue)
        ? limitQueryValue[0]
        : limitQueryValue
      const nextQuery =
        typeof normalizedLimitQueryValue === 'string'
          ? {limit: normalizedLimitQueryValue}
          : undefined

      return {
        name: 'tag',
        params: {slug: tagSlug},
        query: nextQuery,
      }
    },

    // Добавление следующей пачки тегов
    togglePopularTags(): void {
      if (!this.popularTags || !this.hasHiddenPopularTags) {
        return
      }

      this.visibleTagsCount = Math.min(
        this.visibleTagsCount + popularTagsInitialVisibleCount,
        this.popularTags.length
      )
    },
  },
})
</script>
