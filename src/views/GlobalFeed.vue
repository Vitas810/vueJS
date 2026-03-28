<template>
  <div>
    <section class="page-shell page-shell_compact">
      <div class="app-container page-grid">
        <div class="page-grid__main">
          <mcv-feed-toggle />
          <mcv-feed :api-url="apiUrl" />
        </div>
        <aside class="page-grid__aside">
          <mcv-popular-tags />
        </aside>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import McvFeed from '@/components/Feed.vue'
import McvPopularTags from '@/components/PopularTags.vue'
import McvFeedToggle from '@/components/FeedToggle.vue'

interface GlobalFeedData {
  apiUrl: string
}

export default Vue.extend({
  name: 'McvGlobalFeed',
  components: {
    McvFeed,
    McvPopularTags,
    McvFeedToggle,
  },
  data(): GlobalFeedData {
    return {
      apiUrl: '/articles',
    }
  },
})
</script>
