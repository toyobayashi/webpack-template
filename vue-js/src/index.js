import '@babel/polyfill'
import './style.styl'
import Vue from 'vue'
import App from './App.vue'

const vm = new Vue({
  render: h => h(App)
})

vm.$mount('#root')

if (process.env.NODE_ENV !== 'production') {
  if (module.hot) module.hot.accept()
}
