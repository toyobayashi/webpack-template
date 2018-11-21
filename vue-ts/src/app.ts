import { Vue, Component } from 'vue-property-decorator'

@Component
export default class extends Vue {
  version: string = (Vue as any).version
  count: number = 0

  test () {
    this.count++
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
