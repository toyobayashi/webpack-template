import Vue from 'vue'
import { mapGetters } from 'vuex'
import { Actions } from '@/renderer/store/store'

export default Vue.extend({
  data () {
    return {
      version: (Vue as any).version as string,
      electronVersion: process.versions.electron
    }
  },
  computed: {
    ...mapGetters(['count'])
  },
  methods: {
    async test () {
      await this.$store.dispatch(Actions.ADD_COUNT)
    }
  }
})
