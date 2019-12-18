import './style.css'
import '@babel/polyfill'
import Vue from 'vue'
import App from './App.vue'

/* eslint-disable no-new */
new Vue({
  el: '#root',
  render: h => h(App)
})

if (process.env.NODE_ENV !== 'production') {
  if (module.hot) module.hot.accept()
}
