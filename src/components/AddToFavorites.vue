<template>
  <button
    class="app-button app-button_small favorite-button"
    :class="{
      'favorite-button_active': isFavoritesOptimistic,
      'favorite-button_idle': !isFavoritesOptimistic,
    }"
    @click="handleLike"
  >
    <mcv-app-icon name="heart" />
    <span>{{ favoritesCountOptimistic }}</span>
  </button>
</template>

<script lang="ts">
import Vue from 'vue'
import McvAppIcon from '@/components/AppIcon.vue'
import { actionTypes } from '@/store/modules/addToFavorites'
import { Article } from '@/types/domain'

interface AddToFavoritesData {
  isFavoritesOptimistic: boolean
  favoritesCountOptimistic: number
}

export default Vue.extend({
  name: 'McvAddFavorites',
  components: {
    McvAppIcon,
  },
  props: {
    isFavorited: {
      type: Boolean,
      required: true,
    },
    articleSlug: {
      type: String,
      required: true,
    },
    favoritesCount: {
      type: Number,
      required: true,
    },
  },
  data(): AddToFavoritesData {
    return {
      isFavoritesOptimistic: this.isFavorited,
      favoritesCountOptimistic: this.favoritesCount,
    }
  },
  watch: {
    // Синхронизация флага избранного
    isFavorited(value: boolean): void {
      this.isFavoritesOptimistic = value
    },

    // Синхронизация количества лайков
    favoritesCount(value: number): void {
      this.favoritesCountOptimistic = value
    },
  },
  methods: {
    // Оптимистичное обновление избранного
    handleLike(): void {
      const previousFavorited = this.isFavoritesOptimistic
      const previousCount = this.favoritesCountOptimistic
      const favoritePromise = this.$store.dispatch(actionTypes.addToFavorites, {
        slug: this.articleSlug,
        isFavorited: previousFavorited,
      }) as Promise<Article>

      favoritePromise
        .then((article) => {
          this.isFavoritesOptimistic = article.favorited
          this.favoritesCountOptimistic = article.favoritesCount
        })
        .catch(() => {
          this.isFavoritesOptimistic = previousFavorited
          this.favoritesCountOptimistic = previousCount
        })
    },
  },
})
</script>

<style scoped>
.favorite-button_active {
  background: rgba(34, 197, 94, 0.16);
  border-color: rgba(34, 197, 94, 0.3);
  color: #bbf7d0;
}

.favorite-button_active:hover:not(:disabled) {
  background: rgba(34, 197, 94, 0.24);
}

.favorite-button_idle {
  background: transparent;
  border-color: rgba(148, 163, 184, 0.22);
  color: var(--app-color-text-muted);
}

.favorite-button_idle:hover:not(:disabled) {
  border-color: rgba(34, 197, 94, 0.34);
  color: var(--app-color-heading);
}
</style>