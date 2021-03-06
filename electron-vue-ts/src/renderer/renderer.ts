import '@/renderer/style/style.styl'
import Vue from 'vue'
import App from '@/renderer/App.vue'
import store from '@/renderer/store/store'
import '@tybys/electron-ipc-handle-invoke/renderer'

const vm = new Vue({
  store,
  render: h => h(App)
})

vm.$mount('#root')

if (process.env.NODE_ENV !== 'production') {
  if ((module as any).hot) (module as any).hot.accept()
}
