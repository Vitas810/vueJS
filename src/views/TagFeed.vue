<template>
  <div class="home-page">
    <mcv-banner />
    <div class="container page">
      <div class="row">
        <div class="col-md-9">
            <mcv-feed-toggle :tag-name="tagName" />
            <mcv-feed :api-url="apiUrl" />
        </div>
        <div class="col-md-3">
            <mcv-popular-tags />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import McvFeed from '@/components/Feed.vue'
import McvPopularTags from '@/components/PopularTags.vue'
import McvBanner from '@/components/Banner.vue'
import McvFeedToggle from '@/components/FeedToggle.vue'

export default Vue.extend({
  name: 'McvTagFeed',
  components: {
    McvFeed,
    McvPopularTags,
    McvBanner,
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
