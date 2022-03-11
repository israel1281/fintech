export class BillPaymentService {
  constructor (axios) {
    this.$axios = axios
  }

  async vtuAirtimeAll () {
    return await this.$axios.get('/api/vtu/airtime')
  }

  async vtuCableAll () {
    return await this.$axios.get('/api/vtu/cable')
  }

  async vtuElectricityAll () {
    return await this.$axios.get('/api/vtu/electricity')
  }

  async vtuVerifyCustomer (payload) {
    return await this.$axios.post('/api/vtu/verify-customer', payload)
  }

  async vtuCablePackages (serviceProvider) {
    return await this.$axios.get('/api/vtu/cable/' + serviceProvider)
  }

  async vtuCableSubscribe (id, payload) {
    return await this.$axios.post('/api/vtu/cable/' + id, payload)
  }

  async vtuElectricityBuy (id, payload) {
    return await this.$axios.post('/api/vtu/electricity/' + id, payload)
  }

  async vtuAirtimeBuy (id, payload) {
    return await this.$axios.post('/api/vtu/airtime/' + id, payload)
  }

  async vtuTransactions (bpType, count, page = null, status = null) {
    const url = `api/vtu/transactions/${bpType}/${count}`
    return await this.createQueryUrl(url, page, status)
  }

  async createQueryUrl (baseUrl, page = null, status = null) {
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
    return await this.$axios.get(baseUrl + statusString + pagination)
  }
}
