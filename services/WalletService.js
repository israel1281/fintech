export class WalletService {
  constructor (axios) {
    this.$axios = axios
  }

  async getDefault () {
    return await this.$axios.get('api/wallets/default')
  }
}
