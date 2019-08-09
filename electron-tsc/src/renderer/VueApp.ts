import template from './VueApp.html'

import { VueConstructor } from 'vue';

const Vue: VueConstructor  = require('vue')

export default Vue.extend({
  ...template,
  methods: {
    clk () {
      console.log(888)
    }
  }
})
