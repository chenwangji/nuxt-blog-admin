import Vue from 'vue'
import * as ElementUi from 'element-ui'
import App from './App.vue'
import router from './router/index'
import store from './store/index'

import './assets/scss/index.scss'

Vue.config.productionTip = false

Vue.use(ElementUi)

const app: Vue = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

export default app
