export class TransactionsService {
  constructor (axios) {
    this.$axios = axios
  }

  async get (count, status = null) {
    if (status) { return await this.$axios.get(`/api/transactions/${count}/${status}`) } else { return await this.$axios.get(`/api/transactions/${count}`) }
  }
}
