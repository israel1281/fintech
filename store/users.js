import Vue from 'vue'

export const state = () => ({
  loading: true,
  errors: [],
  data: [],
  message: '',
  total: 0
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
  },
  SET_TOTAL: (state, total) => {
    Vue.set(state, 'total', total)
  }
}

export const actions = {
  async get ({ commit }, payload) {
    commit('SET_LOADING', true)
    commit('SET_ERRORS', [])
    await this.$api.users.get(payload.count, payload.page, payload.search, payload.status)
      .then((response) => {
        commit('SET_LOADING', false)
        commit('SET_MESSAGE', response.data.message)
        commit('SET_DATA', response.data.data.data)
        commit('SET_TOTAL', response.data.data.total)
        return Promise.resolve(true)
      })
      .catch((error) => {
        if (error.response) {
          commit('SET_MESSAGE', error.response.data.message)
        }
        commit('SET_LOADING', false)
        return Promise.reject(error)
      })
  },
  async clearLoan ({ commit, dispatch }, payload) {
    commit('SET_LOADING', true)
    commit('SET_ERRORS', [])
    await this.$api.users.clearLoan(payload.id)
      .then((response) => {
        commit('SET_LOADING', false)
        commit('SET_MESSAGE', response.data.message)
        dispatch('get', { count: payload.count })
        return Promise.resolve(true)
      })
      .catch((error) => {
        if (error.response) {
          commit('SET_MESSAGE', error.response.data.message)
        }
        commit('SET_LOADING', false)
        return Promise.reject(error)
      })
  },
  async blockUser ({ commit, dispatch }, payload) {
    commit('SET_LOADING', true)
    commit('SET_ERRORS', [])
    await this.$api.users.block(payload.id, payload.reason)
      .then((response) => {
        commit('SET_LOADING', false)
        commit('SET_MESSAGE', response.data.message)
        dispatch('get', { count: payload.count })
        return Promise.resolve(true)
      })
      .catch((error) => {
        if (error.response) {
          commit('SET_MESSAGE', error.response.data.message)
        }
        commit('SET_LOADING', false)
        return Promise.reject(error)
      })
  },
  async activateUser ({ commit, dispatch }, payload) {
    commit('SET_LOADING', true)
    commit('SET_ERRORS', [])
    await this.$api.users.active(payload.id)
      .then((response) => {
        commit('SET_LOADING', false)
        commit('SET_MESSAGE', response.data.message)
        dispatch('get', { count: payload.count })
        return Promise.resolve(true)
      })
      .catch((error) => {
        if (error.response) {
          commit('SET_MESSAGE', error.response.data.message)
        }
        commit('SET_LOADING', false)
        return Promise.reject(error)
      })
  },
  async addToBlacklist ({ commit, dispatch }, payload) {
    commit('SET_LOADING', true)
    commit('SET_ERRORS', [])
    await this.$api.users.addBlacklist(payload.id)
      .then((response) => {
        commit('SET_LOADING', false)
        commit('SET_MESSAGE', response.data.message)
        dispatch('get', { count: payload.count })
        return Promise.resolve(true)
      })
      .catch((error) => {
        if (error.response) {
          commit('SET_MESSAGE', error.response.data.message)
        }
        commit('SET_LOADING', false)
        return Promise.reject(error)
      })
  },
  async removeFromBlacklist ({ commit, dispatch }, payload) {
    commit('SET_LOADING', true)
    commit('SET_ERRORS', [])
    await this.$api.users.removeBlacklist(payload.id)
      .then((response) => {
        commit('SET_LOADING', false)
        commit('SET_MESSAGE', response.data.message)
        dispatch('get', { count: payload.count })
        return Promise.resolve(true)
      })
      .catch((error) => {
        if (error.response) {
          commit('SET_MESSAGE', error.response.data.message)
        }
        commit('SET_LOADING', false)
        return Promise.reject(error)
      })
  },
  async updateBalance ({ commit, dispatch }, payload) {
    commit('SET_LOADING', true)
    commit('SET_ERRORS', [])
    await this.$api.users.updateBalance(payload.id, payload.amount)
      .then((response) => {
        commit('SET_LOADING', false)
        commit('SET_MESSAGE', response.data.message)
        dispatch('get', { count: payload.count })
        return Promise.resolve(true)
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 422) {
            commit('SET_ERRORS', error.response.data.errors)
          }
          commit('SET_MESSAGE', error.response.data.message)
        }
        commit('SET_LOADING', false)
        return Promise.reject(error)
      })
  },
  async updateLoanBalance ({ commit, dispatch }, payload) {
    commit('SET_LOADING', true)
    commit('SET_ERRORS', [])
    await this.$api.users.updateLoanBalance(payload.id, payload.amount)
      .then((response) => {
        commit('SET_LOADING', false)
        commit('SET_MESSAGE', response.data.message)
        dispatch('get', { count: payload.count })
        return Promise.resolve(true)
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 422) {
            commit('SET_ERRORS', error.response.data.errors)
          }
          commit('SET_MESSAGE', error.response.data.message)
        }
        commit('SET_LOADING', false)
        return Promise.reject(error)
      })
  },
  async changeRole ({ commit, dispatch }, payload) {
    commit('SET_LOADING', true)
    commit('SET_ERRORS', [])
    await this.$api.users.changeRole(payload.id)
      .then((response) => {
        commit('SET_LOADING', false)
        commit('SET_MESSAGE', response.data.message)
        dispatch('get', { count: payload.count })
        return Promise.resolve(true)
      })
      .catch((error) => {
        if (error.response) {
          commit('SET_MESSAGE', error.response.data.message)
        }
        commit('SET_LOADING', false)
        return Promise.reject(error)
      })
  },
  async clearNotifications ({ commit }) {
    commit('SET_LOADING', true)
    await this.$api.users.clearNotifications()
      .then(() => {
        commit('SET_LOADING', false)
        this.$auth.fetchUser()
        return Promise.resolve(true)
      })
      .catch((error) => {
        if (error.response) {
          commit('SET_MESSAGE', error.response.data.message)
        }
        commit('SET_LOADING', false)
        return Promise.reject(error)
      })
  },
  async markNotificationsRead ({ commit }) {
    commit('SET_LOADING', true)
    await this.$api.users.markNotificationsRead()
      .then(() => {
        commit('SET_LOADING', false)
        this.$auth.fetchUser()
        return Promise.resolve(true)
      })
      .catch((error) => {
        if (error.response) {
          commit('SET_MESSAGE', error.response.data.message)
        }
        commit('SET_LOADING', false)
        return Promise.reject(error)
      })
  }
}
