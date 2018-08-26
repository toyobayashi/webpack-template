import { Vue, Component } from 'vue-property-decorator'

@Component
export default class extends Vue {
  text: string = 'Vue Typescript'
  mounted () {
    this.$nextTick(() => {
      console.log(this.electron)
    })
  }
}

(async function () {
  const ms = await (ms => new Promise(resolve => {
    setTimeout(() => {
      resolve(ms)
    }, ms)
  }))(1000)
  console.log(ms)
})()
