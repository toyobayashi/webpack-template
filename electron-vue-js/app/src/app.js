export default {
  data () {
    return {
      text: 'Vue JavaScript'
    }
  },
  methods: {
    test () {
      this.text += '!!!'
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
