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

<script>
import {actionTypes} from "@/store/modules/addToFavorites";

export default {
    name: 'McvAddFavorites',
    props: {
        isFavorited: {
            type: Boolean,
            required: true
        },
        articleSlug: {
            type: String,
            required: true
        },
        favoritesCount: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            isFavoritesOptimistic: this.isFavorited,
            favoritesCountOptimistic: this.favoritesCount
        }
    },
    watch: {
        isFavorited(value) {
            this.isFavoritesOptimistic = value
        },
        favoritesCount(value) {
            this.favoritesCountOptimistic = value
        }
    },
    methods: {
        handleLike() {
            const previousFavorited = this.isFavoritesOptimistic
            const previousCount = this.favoritesCountOptimistic
            this.$store
                .dispatch(actionTypes.addToFavorites, {
                    slug: this.articleSlug,
                    isFavorited: previousFavorited
                })
                .then(article => {
                    if (article) {
                        this.isFavoritesOptimistic = article.favorited
                        this.favoritesCountOptimistic = article.favoritesCount
                    }
                })
                .catch(() => {
                    this.isFavoritesOptimistic = previousFavorited
                    this.favoritesCountOptimistic = previousCount
                })
        }
    }
}
</script>