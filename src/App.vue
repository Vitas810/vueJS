<template>
  <div id="app">
    <mcv-topbar />

    <router-view />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import McvTopbar from '@/components/Topbar.vue'
import { actionsTypes } from '@/store/modules/auth'

export default Vue.extend({
  name: 'McvApp',
  components: {
    McvTopbar,
  },
  mounted() {
    this.$store.dispatch(actionsTypes.getCurrentUser)
  },
})
</script>
