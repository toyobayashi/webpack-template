import * as electron from 'electron'

declare module 'vue/types/vue' {
  interface Vue {
    electron: typeof electron
  }
}
