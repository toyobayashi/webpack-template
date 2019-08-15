import './style.css'
import Vue from 'vue'
import * as electron from 'electron'
import App from './App.vue'

Vue.use({
  install (Vue) {
    Vue.prototype.electron = electron
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#root',
  render: h => h(App)
})

if (process.env.NODE_ENV !== 'production') {
  if (module.hot) module.hot.accept()
}
