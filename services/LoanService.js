export class LoanService {
  constructor (axios) {
    this.$axios = axios
  }

  async apply (payload) {
    return await this.$axios.post('api/loan/apply', payload)
  }

  async getPending (count, page = null) {
    const url = `api/admin/loan/pending/${count}`
    return await this.createQueryUrl(url, page)
  }

  async getAll (count, page = null, status = null) {
    const url = `api/admin/loan/all/${count}`
    return await this.createQueryUrl(url, page, status)
  }

  createQueryUrl (baseUrl, page = null, status = null) {
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
    return this.$axios.get(baseUrl + statusString + pagination)
  }

  async accept (id) {
    return await this.$axios.post(`api/admin/loan/${id}/accept`)
  }

  async reject (id) {
    return await this.$axios.post(`api/admin/loan/${id}/reject`)
  }

  async kyc (payload) {
    return await this.$axios.post('api/kyc', payload)
  }

  async getKycs (count, page = null, status = null) {
    const url = `api/admin/kycs/all/${count}`
    return await this.createQueryUrl(url, page, status)
  }

  async kycAccept (id) {
    return await this.$axios.post(`api/admin/kycs/respond/${id}/accept`)
  }

  async kycReject (id) {
    return await this.$axios.post(`api/admin/kycs/respond/${id}/reject`)
  }
}
