import Vue from 'vue'

export const state = () => ({
  loading: false,
  errors: [],
  data: [],
  message: ''
})

export const mutations = {
  SET_LOADING: (state, loading) => {
    Vue.set(state, 'loading', loading)
  },
  SET_ERRORS: (state, errors) => {
    Vue.set(state, 'errors', errors)
  },
  SET_DATA: (state, data) => {
    Vue.set(state, 'data', data)
  },
  SET_MESSAGE: (state, message) => {
    Vue.set(state, 'message', message)
  }
}

export const actions = {
  async example ({ commit }, payload) {
    commit('SET_LOADING', true)
    commit('SET_MESSAGE', '')
    commit('SET_ERRORS', [])
    await this.$api.example.get()
      .then((response) => {
        commit('SET_LOADING', false)
        commit('SET_MESSAGE', response.data.message)
        commit('SET_DATA', response.data.data)
        return Promise.resolve(true)
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 422) {
            commit('SET_ERRORS', error.response.data.errors)
          }
          if (error.response.status === 403) {
            commit('SET_MESSAGE', error.response.data.message)
          }
        }
        commit('SET_LOADING', false)
        return Promise.reject(error)
      })
  }
}
