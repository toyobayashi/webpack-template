import Vue from 'vue'
import { mapGetters } from 'vuex'
import { Actions } from '@/renderer/store/store'
import { ipcRenderer } from 'electron'

export default Vue.extend({
  data () {
    return {
      version: Vue.version,
      electronVersion: process.versions.electron
    }
  },
  computed: {
    ...mapGetters(['count'])
  },
  methods: {
    async test () {
      console.log(await ipcRenderer.invoke('showArgs', 1, '2', true, [{ a: 1, b: '2', c: false }, undefined], { a: { aa: { aaa: 3 } } }, undefined, null, new Date()))
      await this.$store.dispatch(Actions.ADD_COUNT)
    }
  }
})
