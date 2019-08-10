import template from './VueApp.html'

import { VueConstructor } from 'vue';

const Vue: VueConstructor  = require('vue')

export default Vue.extend({
  ...template,
  data () {
    return {
      fs: 16
    }
  },
  methods: {
    clk () {
      this.fs++
      console.log(888)
    }
  }
})
