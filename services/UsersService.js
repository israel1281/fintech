export class UsersService {
  constructor (axios) {
    this.$axios = axios
  }

  async get (count, page = null, searchString = null, status = null) {
    let pagination = ''
    let search = ''
    let url = ''
    // Query pagination
    if (page) {
      pagination = `?page=${page}`
    }
    // Query search
    if (searchString) {
      let joinString = '?'
      if (pagination) {
        joinString = '&'
      }
      search = `${joinString}search=${searchString}`
    }
    // Query status
    if (status) {
      url = `/api/admin/users/${count}/${status}`
    } else {
      url = `/api/admin/users/${count}`
    }
    return await this.$axios.get(url + pagination + search)
  }

  async clearLoan (id) {
    return await this.$axios.put(`/api/admin/users/${id}/clear-loan`)
  }

  async block (id, reason) {
    return await this.$axios.put(`/api/admin/users/${id}/status/block`, { reason })
  }

  async active (id) {
    return await this.$axios.put(`/api/admin/users/${id}/status/active`)
  }

  async addBlacklist (id) {
    return await this.$axios.put(`/api/admin/users/${id}/blacklist/add`)
  }

  async removeBlacklist (id) {
    return await this.$axios.put(`/api/admin/users/${id}/blacklist/remove`)
  }

  async updateBalance (id, amount) {
    return await this.$axios.put(`/api/admin/users/${id}/update-balance`, { amount })
  }

  async updateLoanBalance (id, amount) {
    return await this.$axios.put(`/api/admin/users/${id}/update-loan-balance`, { amount })
  }

  async changeRole (id) {
    return await this.$axios.put(`/api/admin/users/${id}/change-role`)
  }

  async clearNotifications () {
    return await this.$axios.delete('/api/notifications/clear')
  }

  async markNotificationsRead () {
    return await this.$axios.delete('/api/notifications/read')
  }
}
