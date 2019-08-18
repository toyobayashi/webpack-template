import '@/renderer/style/style.styl'
import Vue from 'vue'
import App from '@/renderer/App.vue'
import store from '@/renderer/store/store'
import './ipc-renderer'

const vm = new Vue({
  store,
  render: h => h(App)
})

vm.$mount('#root')

if (process.env.NODE_ENV !== 'production') {
  if (module.hot) module.hot.accept()
}
