import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

export const Actions = {
  SET_COUNT: 'SET_COUNT',
  ADD_COUNT: 'ADD_COUNT'
}

const store = new Vuex.Store({
  state: {
    count: 0
  },
  getters: {
    count (state) {
      return state.count
    }
  },
  mutations: {
    [Actions.SET_COUNT] (state, value) {
      state.count = value
    }
  },
  actions: {
    [Actions.ADD_COUNT] (store) {
      store.commit(Actions.SET_COUNT, store.state.count + 1)
      return true
    }
  }
})

export default store
