import Vue from 'vue'

export default {
  data () {
    return {
      version: Vue.version,
      electronVersion: process.versions.electron,
      count: 0
    }
  },
  methods: {
    test () {
      this.count++
    }
  }
}

;(async function () {
  const ms = await (ms => new Promise(resolve => {
    setTimeout(() => {
      resolve(ms)
    }, ms)
  }))(1000)
  console.log(ms)
})()
