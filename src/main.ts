import Vue from 'vue'
import * as ElementUi from 'element-ui'
import VueSimplemde from 'vue-simplemde'
import Component from 'vue-class-component'
import 'simplemde/dist/simplemde.min.css'
import 'highlight.js/styles/atom-one-dark.css'
import hljs from 'highlight.js'

import App from './App.vue'
import router from './router/index'
import store from './store/index'

import './assets/scss/index.scss'
import { format } from './filters/index'

(window as any).hljs = hljs

Vue.config.productionTip = false

Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteLeave',
  'beforeRouteUpdate'
])

Vue.use(ElementUi)
Vue.use(VueSimplemde)

Vue.filter('format', format)

const app: Vue = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

export default app
