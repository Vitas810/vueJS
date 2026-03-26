<template>
  <span class="app-icon" aria-hidden="true">
    <svg
      v-if="name === 'compose'"
      viewBox="0 0 24 24"
      class="app-icon__svg"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
    </svg>

    <svg
      v-else-if="name === 'settings'"
      viewBox="0 0 24 24"
      class="app-icon__svg"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle cx="12" cy="12" r="3" />
      <path
        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33h.01a1.65 1.65 0 0 0 .99-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.01a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.01a1.65 1.65 0 0 0 1.51.99H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1V15Z"
      />
    </svg>

    <svg
      v-else-if="name === 'hash'"
      viewBox="0 0 24 24"
      class="app-icon__svg"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="m5 9 14-2" />
      <path d="m5 15 14-2" />
      <path d="M11 4 9 20" />
      <path d="m17 4-2 16" />
    </svg>

    <svg
      v-else-if="name === 'heart'"
      viewBox="0 0 24 24"
      class="app-icon__svg"
      fill="currentColor"
    >
      <path
        d="M12 21.35 10.55 20C5.4 15.24 2 12.1 2 8.25A5.25 5.25 0 0 1 7.25 3c1.7 0 3.32.8 4.35 2.05A5.77 5.77 0 0 1 16.95 3 5.05 5.05 0 0 1 22 8.05c0 4.05-3.3 7.14-8.52 11.97L12 21.35Z"
      />
    </svg>

    <svg
      v-else-if="name === 'edit'"
      viewBox="0 0 24 24"
      class="app-icon__svg"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
    </svg>

    <svg
      v-else
      viewBox="0 0 24 24"
      class="app-icon__svg"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  </span>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

type AppIconName =
  | 'compose'
  | 'settings'
  | 'hash'
  | 'heart'
  | 'edit'
  | 'delete'

export default Vue.extend({
  name: 'McvAppIcon',
  props: {
    name: {
      type: String as PropType<AppIconName>,
      required: true,
    },
  },
})
</script>

<style scoped>
.app-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.app-icon__svg {
  width: 1rem;
  height: 1rem;
}
</style>
