import Vue from 'vue'

export const state = () => ({
  loading: false,
  errors: [],
  message: '',
  pendingLoans: [],
  loans: [],
  kycs: [],
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
  SET_LOANS: (state, loans) => {
    Vue.set(state, 'loans', loans)
  },
  SET_PENDING_LOANS: (state, pendingLoans) => {
    Vue.set(state, 'pendingLoans', pendingLoans)
  },
  SET_KYCS: (state, kycs) => {
    Vue.set(state, 'kycs', kycs)
  },
  SET_TOTAL: (state, total) => {
    Vue.set(state, 'total', total)
  }
}

export const actions = {
  async apply ({ commit }, payload) {
    commit('SET_LOADING', true)
    commit('SET_ERRORS', [])
    commit('SET_MESSAGE', '')
    await this.$api.loan.apply(payload)
      .then((response) => {
        commit('SET_LOADING', false)
        commit('SET_MESSAGE', response.data.message)
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
  async getPending ({ commit }, payload) {
    commit('SET_LOADING', true)
    commit('SET_ERRORS', [])
    await this.$api.loan.getPending(payload.count)
      .then((response) => {
        commit('SET_LOADING', false)
        commit('SET_MESSAGE', response.data.message)
        commit('SET_PENDING_LOANS', response.data.data.data)
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
  async getAll ({ commit }, payload) {
    commit('SET_LOADING', true)
    commit('SET_ERRORS', [])
    await this.$api.loan.getAll(payload.count, payload.page, payload.status)
      .then((response) => {
        commit('SET_LOADING', false)
        commit('SET_MESSAGE', response.data.message)
        commit('SET_LOANS', response.data.data.data)
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
    await this.$api.loan.accept(payload.id)
      .then((response) => {
        commit('SET_LOADING', false)
        commit('SET_MESSAGE', response.data.message)
        dispatch('getPending', { count: payload.count })
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
    await this.$api.loan.reject(payload.id)
      .then((response) => {
        commit('SET_LOADING', false)
        commit('SET_MESSAGE', response.data.message)
        dispatch('getPending', { count: payload.count })
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
  async kyc ({ commit }, payload) {
    commit('SET_LOADING', true)
    commit('SET_ERRORS', [])
    commit('SET_MESSAGE', '')
    await this.$api.loan.kyc(payload)
      .then((response) => {
        commit('SET_LOADING', false)
        commit('SET_MESSAGE', response.data.message)
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
  async getKycs ({ commit }, payload) {
    commit('SET_LOADING', true)
    commit('SET_ERRORS', [])
    // commit('SET_MESSAGE', '')
    await this.$api.loan.getKycs(payload.count, payload.page, payload.status)
      .then((response) => {
        commit('SET_LOADING', false)
        commit('SET_MESSAGE', response.data.message)
        commit('SET_KYCS', response.data.data.data)
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
  async kycAccept ({ commit, dispatch }, payload) {
    commit('SET_LOADING', true)
    commit('SET_ERRORS', [])
    commit('SET_MESSAGE', '')
    await this.$api.loan.kycAccept(payload.id)
      .then((response) => {
        commit('SET_MESSAGE', response.data.message)
        commit('SET_LOADING', false)
        dispatch('getKycs', { count: payload.count })
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
  async kycReject ({ commit, dispatch }, payload) {
    commit('SET_LOADING', true)
    commit('SET_ERRORS', [])
    commit('SET_MESSAGE', '')
    await this.$api.loan.kycReject(payload.id)
      .then((response) => {
        commit('SET_MESSAGE', response.data.message)
        commit('SET_LOADING', false)
        dispatch('getKycs', { count: payload.count })
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
