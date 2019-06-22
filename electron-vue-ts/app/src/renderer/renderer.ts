import '@/style/style.css'
import Vue from 'vue'
import App from '@/App.vue'
import store from '@/store/store'

const vm = new Vue({
  store,
  render: h => h(App)
})

vm.$mount('#root')

if (process.env.NODE_ENV !== 'production') {
  if ((module as any).hot) (module as any).hot.accept()
}
