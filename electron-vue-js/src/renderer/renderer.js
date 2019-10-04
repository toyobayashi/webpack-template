import '@/renderer/style/style.styl'
import '@tybys/electron-ipc-handle-invoke/renderer.js'
import Vue from 'vue'
import App from '@/renderer/App.vue'
import store from '@/renderer/store/store'

const vm = new Vue({
  store,
  render: h => h(App)
})

vm.$mount('#root')

if (process.env.NODE_ENV !== 'production') {
  if (module.hot) module.hot.accept()
}
