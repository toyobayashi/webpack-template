import './vue-hack'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { VueConstructor } from 'vue'

import ReactApp from './ReactApp'
import VueApp from './VueApp'

const Vue: VueConstructor = require('vue')

ReactDOM.render(
  <ReactApp />,
  document.getElementById('react')
)

const vm = new Vue({
  render: (h) => h(VueApp)
})

vm.$mount('#vue')

async function log () {
  console.log(await Promise.resolve('done'))
}

// tslint:disable-next-line: no-floating-promises
log()
