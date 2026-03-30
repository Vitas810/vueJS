<template>
  <section class="page-shell page-shell_compact">
    <div class="app-container page-grid">
      <div class="page-grid__main">
        <mcv-feed-toggle :tag-name="tagName" />
        <mcv-feed :api-url="apiUrl" />
      </div>
      <aside class="page-grid__aside">
        <mcv-popular-tags />
      </aside>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import McvFeed from '@/components/Feed.vue'
import McvPopularTags from '@/components/PopularTags.vue'
import McvFeedToggle from '@/components/FeedToggle.vue'

export default Vue.extend({
  name: 'McvTagFeed',
  components: {
    McvFeed,
    McvPopularTags,
    McvFeedToggle,
  },
  computed: {
    // Имя активного тега
    tagName(): string {
      return String(this.$route.params.slug ?? '')
    },

    // URL ленты по тегу
    apiUrl(): string {
      return `/articles?tag=${this.tagName}`
    },
  },
})
</script>
