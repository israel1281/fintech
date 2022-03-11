import { CypherBank } from './CypherBank'
export class BankService {
  constructor (axios, aesKey, ivKey) {
    this.$axios = axios
    this.aesKey = aesKey
    this.ivKey = ivKey
  }

  async createAccount (payload) {
    const data = JSON.stringify(payload)
    const cypher = new CypherBank(this.aesKey, this.ivKey)
    const encryptedData = cypher.encrypt(data)
    // console.log(encryptedData)
    return await this.$axios.post('/api/bank/create-account', { data: encryptedData })
  }
}
