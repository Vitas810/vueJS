import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/styles/main.css'

/* =============== Инициализация приложения ============= */

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (createElement) => createElement(App),
}).$mount('#app')
