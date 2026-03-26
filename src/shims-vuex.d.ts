import Vue from 'vue'
import { Store } from 'vuex'
import { RootState } from '@/types/store'

declare module 'vue/types/vue' {
  interface Vue {
    $store: Store<RootState>
  }
}
