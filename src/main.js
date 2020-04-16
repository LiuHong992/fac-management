import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './global'
import './filters'
import dayjs from 'dayjs'
import axios from 'axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import ZkTable from 'vue-table-with-tree-grid'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import './bus'

Vue.use(ElementUI)
Vue.use(ZkTable)
Vue.use(mavonEditor)
Vue.prototype.$dayjs = dayjs
Vue.prototype.$axios = axios
Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')