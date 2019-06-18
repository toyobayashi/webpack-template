import { Vue, Component } from 'vue-property-decorator'
import ApiClass from '@/api/api'

@Component
export default class extends Vue {
  version: string = (Vue as any).version
  electronVersion: string = window.process.versions.electron
  count: number = 0

  test () {
    if (ApiClass) {
      console.log(ApiClass.getTypeSync())
    }
    this.count++
  }
}

// tslint:disable-next-line: no-floating-promises
(async function () {
  const ms = await (ms => new Promise(resolve => {
    setTimeout(() => {
      resolve(ms)
    }, ms)
  }))(1000)
  console.log(ms)
})()
