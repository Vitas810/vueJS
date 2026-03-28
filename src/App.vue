<template>
  <div id="app" class="app-shell">
    <mcv-topbar />
    <main>
      <router-view />
    </main>
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
