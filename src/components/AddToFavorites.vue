<template>
    <button @click="handleLike"
            :class="{
                btn: true,
                'btn-sm': true,
                'btn-primary': isFavoritesOptimistic,
                'btn-outline-primary': !isFavoritesOptimistic
            }"
    >
        <i class="ion-heart" />
        <span>&nbsp; {{ favoritesCountOptimistic }}</span>
    </button>
</template>

<script lang="ts">
import Vue from 'vue'
import { actionTypes } from '@/store/modules/addToFavorites'
import { Article } from '@/types/domain'

interface AddToFavoritesData {
  isFavoritesOptimistic: boolean
  favoritesCountOptimistic: number
}

export default Vue.extend({
  name: 'McvAddFavorites',
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