import Vue from 'vue'

export const state = () => ({
  loading: false,
  errors: [],
  message: ''
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
  }
}

export const actions = {
  async fetchUser ({ commit }) {
    commit('SET_LOADING', true)
    await this.$auth.fetchUser()
      .then(() => {
        commit('SET_LOADING', false)
        return Promise.resolve(true)
      })
      .catch((error) => {
        if (error.response && (error.response.status === 422)) {
          commit('SET_ERRORS', error.response.data.errors)
        }
        commit('SET_LOADING', false)
        return Promise.reject(error)
      })
  },
  async login ({ commit }, payload) {
    commit('SET_LOADING', true)
    commit('SET_ERRORS', [])
    await this.$auth.loginWith('laravelSanctum', { data: payload })
      .then(() => {
        commit('SET_LOADING', false)
        return Promise.resolve(true)
      })
      .catch((error) => {
        if (error.response && (error.response.status === 422)) {
          commit('SET_ERRORS', error.response.data.errors)
        }
        commit('SET_LOADING', false)
        return Promise.reject(error)
      })
  },
  // Register Action
  async register ({ commit }, payload) {
    commit('SET_LOADING', true)
    commit('SET_ERRORS', [])
    await this.$api.auth.register(payload)
      .then((_) => {
        commit('SET_LOADING', false)
        // this.$auth.loginWith('laravelSanctum', payload)
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
  },
  // Forgot Password Action
  async processForgotPassword ({ commit }, payload) {
    commit('SET_LOADING', true)
    commit('SET_ERRORS', [])
    await this.$api.auth.forgotPassword(payload)
      .then((_) => {
        commit('SET_LOADING', false)
        this.$router.push('/')
        return Promise.resolve(true)
      })
      .catch((error) => {
        if (error.response && (error.response.status === 422)) {
          commit('SET_ERRORS', error.response.data.errors)
        }
        commit('SET_LOADING', false)
        return Promise.reject(error.response)
      })
  },
  // Reset Password Action
  async processResetPassword ({ commit }, payload) {
    commit('SET_LOADING', true)
    commit('SET_ERRORS', [])
    await this.$api.auth.resetPassword(payload)
      .then((response) => {
        commit('SET_LOADING', false)
        this.$router.push('/')
        return Promise.resolve(response)
      })
      .catch((error) => {
        if (error.response && (error.response.status === 422)) {
          commit('SET_ERRORS', error.response.data.errors)
        }
        commit('SET_LOADING', false)
        return Promise.reject(error.response)
      })
  },
  // Reset Password Action
  async sendEmailVerifyLink ({ commit }) {
    commit('SET_LOADING', true)
    commit('SET_ERRORS', [])
    await this.$api.auth.emailVerify()
      .then((response) => {
        commit('SET_LOADING', false)
        return Promise.resolve(response)
      })
      .catch((error) => {
        if (error.response && (error.response.status === 422)) {
          commit('SET_ERRORS', error.response.data.errors)
        }
        commit('SET_LOADING', false)
        return Promise.reject(error.response)
      })
  },

  // Bank Create Account
  async createBankAccount ({ commit }, payload) {
    commit('SET_LOADING', true)
    commit('SET_ERRORS', [])
    await this.$api.bank.createAccount(payload)
      .then((response) => {
        commit('SET_LOADING', false)
        return Promise.resolve(response)
      })
      .catch((error) => {
        if (error.response && (error.response.status === 422)) {
          commit('SET_ERRORS', error.response.data.errors)
        }
        commit('SET_LOADING', false)
        return Promise.reject(error.response)
      })
  }
}
