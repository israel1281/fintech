import { CypherFW } from './CypherFW'
export class CardService {
  constructor (axios, encryptKey) {
    this.$axios = axios
    this.encryptKey = encryptKey
  }

  async initialize (payload) {
    const data = JSON.stringify(payload)
    const cypher = new CypherFW(this.encryptKey)
    const encryptedData = cypher.encrypt(data)
    return await this.$axios.post('/api/fw/card/initialize', { client: encryptedData })
  }

  async validateCharge (payload) {
    return await this.$axios.post('/api/fw/card/validate-charge', payload)
  }

  async verifyPayment (payload) {
    return await this.$axios.post('/api/fw/card/verify', payload)
  }

  async generateReference () {
    return await this.$axios.get('/api/fw/generate-reference')
  }
}
