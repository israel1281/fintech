export class WithdrawService {
  constructor (axios) {
    this.$axios = axios
  }

  // Admin
  async withdraw (payload) {
    return await this.$axios.post('api/withdraw', payload)
  }

  async get (count, page = null, status = null) {
    const url = `/api/admin/withdraw/all/${count}`
    let pagination = ''
    let statusString = ''
    // Query pagination
    if (page) {
      pagination = `?page=${page}`
    }
    // Query status
    if (status) {
      statusString = `/${status}`
    }
    return await this.$axios.get(url + statusString + pagination)
  }

  async getAdminPending (count, page = null) {
    const url = `/api/admin/withdraw/pending/${count}`
    let pagination = ''
    // Query pagination
    if (page) {
      pagination = `?page=${page}`
    }
    return await this.$axios.get(url + pagination)
  }

  async accept (id) {
    return await this.$axios.post(`api/admin/withdraw/respond/${id}/accept`)
  }

  async reject (id, payload) {
    return await this.$axios.post(`api/admin/withdraw/respond/${id}/reject`, payload)
  }

  async process (id) {
    return await this.$axios.post(`api/admin/withdraw/respond/${id}/process`)
  }

  async cancel (id) {
    return await this.$axios.post(`api/withdraw/${id}/cancel`)
  }

  // User
  async getUserPending () {
    return await this.$axios.get('api/withdraw/pending')
  }
}
