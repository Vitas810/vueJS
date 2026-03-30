<template>
  <div id="app" class="app-shell">
    <div class="app-shell__background">
      <span class="app-shell__glow app-shell__glow_primary"></span>
      <span class="app-shell__glow app-shell__glow_accent"></span>
    </div>
    <div class="app-shell__layout">
      <header class="app-shell__header">
        <mcv-topbar />
      </header>
      <main class="app-shell__content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import McvTopbar from '@/components/Topbar.vue'
import {hasAccessToken} from '@/helpers/accessToken'
import {getNamespacedType} from '@/store/helpers/namespacedType'
import {actionTypes, authModuleName} from '@/store/modules/auth'

export default Vue.extend({
  name: 'McvApp',
  components: {
    McvTopbar,
  },
  mounted() {
    if (!hasAccessToken()) {
      return
    }

    this.$store.dispatch(
      getNamespacedType(authModuleName, actionTypes.getCurrentUser)
    )
  },
})
</script>
