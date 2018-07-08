import './style.css'
import Vue from 'vue'
import App from './App.vue'

// tslint:disable-next-line:no-unused-expression
new Vue({
  el: '#root',
  render: h => h(App)
})

if (process.env.NODE_ENV !== 'production') {
  if ((module as any).hot) (module as any).hot.accept()
}
