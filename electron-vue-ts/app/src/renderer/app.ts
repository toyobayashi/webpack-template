import Vue from 'vue'
import { mapGetters } from 'vuex'
import { Actions } from '@/renderer/store/store'
import ApiClass from '@/renderer/api/api'

export default Vue.extend({
  data () {
    return {
      version: (Vue as any).version as string,
      electronVersion: window.process.versions.electron
    }
  },
  computed: {
    ...mapGetters(['count'])
  },
  methods: {
    async test () {
      if (ApiClass) {
        console.log(ApiClass.getTypeSync())
      }
      await this.$store.dispatch(Actions.ADD_COUNT)
    }
  }
})
