import Vue from 'vue'

export const state = () => ({
  loading: false,
  errors: [],
  message: '',
  pendingWithdraws: [],
  withdraws: [],
  total: 0
})

export const mutations = {
  SET_LOADING: (state, loading) => {
    Vue.set(state, 'loading', loading)
  },
  SET_ERRORS: (state, errors) => {
    Vue.set(state, 'errors', errors)
  },
  SET_MESSAGE: (state, message) => {
    Vue.set(state, 'message', message)
  },
  SET_WITHDRAWS: (state, withdraws) => {
    Vue.set(state, 'withdraws', withdraws)
  },
  SET_PENDING_WITHDRAWS: (state, pendingWithdraws) => {
    Vue.set(state, 'pendingWithdraws', pendingWithdraws)
  },
  SET_TOTAL: (state, total) => {
    Vue.set(state, 'total', total)
  }
}

export const actions = {
  async withdraw ({ commit, dispatch }, payload) {
    commit('SET_LOADING', true)
    commit('SET_ERRORS', [])
    commit('SET_MESSAGE', '')
    await this.$api.withdraw.withdraw(payload)
      .then((response) => {
        commit('SET_LOADING', false)
        commit('SET_MESSAGE', response.data.message)
        dispatch('getUserPending')
        return Promise.resolve(true)
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 422) { commit('SET_ERRORS', error.response.data.errors) }
          commit('SET_MESSAGE', error.response.data.message)
        }
        commit('SET_LOADING', false)
        return Promise.reject(error)
      })
  },
  async getUserPending ({ commit }) {
    commit('SET_LOADING', true)
    commit('SET_ERRORS', [])
    commit('SET_MESSAGE', '')
    commit('SET_PENDING_WITHDRAWS', [])
    await this.$api.withdraw.getUserPending()
      .then((response) => {
        commit('SET_LOADING', false)
        commit('SET_MESSAGE', response.data.message)
        commit('SET_PENDING_WITHDRAWS', response.data.data)
        return Promise.resolve(true)
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 422) { commit('SET_ERRORS', error.response.data.errors) }
          commit('SET_MESSAGE', error.response.data.message)
        }
        commit('SET_LOADING', false)
        return Promise.reject(error)
      })
  },
  async getAdminPending ({ commit }, payload) {
    commit('SET_LOADING', true)
    commit('SET_ERRORS', [])
    commit('SET_MESSAGE', '')
    commit('SET_PENDING_WITHDRAWS', [])
    await this.$api.withdraw.getAdminPending(payload.count)
      .then((response) => {
        commit('SET_LOADING', false)
        commit('SET_MESSAGE', response.data.message)
        commit('SET_PENDING_WITHDRAWS', response.data.data.data)
        return Promise.resolve(true)
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 422) { commit('SET_ERRORS', error.response.data.errors) }
          commit('SET_MESSAGE', error.response.data.message)
        }
        commit('SET_LOADING', false)
        return Promise.reject(error)
      })
  },
  async get ({ commit }, payload) {
    commit('SET_LOADING', true)
    commit('SET_ERRORS', [])
    commit('SET_MESSAGE', '')
    await this.$api.withdraw.get(payload.count, payload.page, payload.status)
      .then((response) => {
        commit('SET_LOADING', false)
        commit('SET_MESSAGE', response.data.message)
        commit('SET_WITHDRAWS', response.data.data.data)
        commit('SET_TOTAL', response.data.data.total)
        return Promise.resolve(true)
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 422) { commit('SET_ERRORS', error.response.data.errors) }
          commit('SET_MESSAGE', error.response.data.message)
        }
        commit('SET_LOADING', false)
        return Promise.reject(error)
      })
  },
  async accept ({ commit, dispatch }, payload) {
    commit('SET_LOADING', true)
    commit('SET_ERRORS', [])
    commit('SET_MESSAGE', '')
    await this.$api.withdraw.accept(payload.id)
      .then((response) => {
        commit('SET_LOADING', false)
        commit('SET_MESSAGE', response.data.message)
        dispatch('getAdminPending', { count: payload.count })
        return Promise.resolve(true)
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 422) { commit('SET_ERRORS', error.response.data.errors) }
          commit('SET_MESSAGE', error.response.data.message)
        }
        commit('SET_LOADING', false)
        return Promise.reject(error)
      })
  },
  async cancel ({ commit, dispatch }, id) {
    commit('SET_LOADING', true)
    commit('SET_ERRORS', [])
    commit('SET_MESSAGE', '')
    await this.$api.withdraw.cancel(id)
      .then((response) => {
        commit('SET_LOADING', false)
        commit('SET_MESSAGE', response.data.message)
        dispatch('getUserPending')
        return Promise.resolve(true)
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 422) { commit('SET_ERRORS', error.response.data.errors) }
          commit('SET_MESSAGE', error.response.data.message)
        }
        commit('SET_LOADING', false)
        return Promise.reject(error)
      })
  },
  async process ({ commit, dispatch }, payload) {
    commit('SET_LOADING', true)
    commit('SET_ERRORS', [])
    commit('SET_MESSAGE', '')
    await this.$api.withdraw.process(payload.id)
      .then((response) => {
        commit('SET_LOADING', false)
        commit('SET_MESSAGE', response.data.message)
        dispatch('getAdminPending', { count: payload.count })
        return Promise.resolve(true)
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 422) { commit('SET_ERRORS', error.response.data.errors) }
          commit('SET_MESSAGE', error.response.data.message)
        }
        commit('SET_LOADING', false)
        return Promise.reject(error)
      })
  },
  async reject ({ commit, dispatch }, payload) {
    commit('SET_LOADING', true)
    commit('SET_ERRORS', [])
    commit('SET_MESSAGE', '')
    await this.$api.withdraw.reject(payload.id, { reason: payload.reason })
      .then((response) => {
        commit('SET_LOADING', false)
        commit('SET_MESSAGE', response.data.message)
        dispatch('getAdminPending', { count: payload.count })
        return Promise.resolve(true)
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 422) { commit('SET_ERRORS', error.response.data.errors) }
          commit('SET_MESSAGE', error.response.data.message)
        }
        commit('SET_LOADING', false)
        return Promise.reject(error)
      })
  }
}
