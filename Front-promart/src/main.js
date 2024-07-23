import Vue from 'vue'
import App from './App.vue'
import DatetimePicker from 'vuetify-datetime-picker'
import VueClipboard from 'vue-clipboard2'

import JsonExcel from 'vue-json-excel'

Vue.component('downloadExcel', JsonExcel)

// VUEX - https://vuex.vuejs.org/
import store from './store'

// VUE-ROUTER - https://router.vuejs.org/
import router from './router'

// PLUGINS
import vuetify from './plugins/vuetify'
import i18n from './plugins/vue-i18n'
import './plugins/vue-google-maps'
import './plugins/vue-shortkey'
import './plugins/vue-head'
import './plugins/vue-gtag'
import './plugins/apexcharts'
import './plugins/echarts'
import './plugins/animate'
import './plugins/clipboard'
import './plugins/moment'

// FILTERS
import './filters/capitalize'
import './filters/lowercase'
import './filters/uppercase'
import './filters/formatCurrency'
import './filters/formatDate'

// STYLES
// Main Theme SCSS
import './assets/scss/theme.scss'

//Cookies
import VueCookies from 'vue-cookies'

import setupInterceptors from '@/services/setupInterceptors'

setupInterceptors(store)

// Animation library - https://animate.style/
import 'animate.css/animate.min.css'
import vueDebounce from 'vue-debounce'

Vue.use(vueDebounce)
Vue.use(VueCookies)
Vue.use(DatetimePicker)
Vue.use(VueClipboard)

// Set this to false to prevent the production tip on Vue startup.
Vue.config.productionTip = false

/*
|---------------------------------------------------------------------
| Main Vue Instance
|---------------------------------------------------------------------
|
| Render the vue application on the <div id="app"></div> in index.html
|
| https://vuejs.org/v2/guide/instance.html
|
*/
export default new Vue({
  i18n,
  vuetify,
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
