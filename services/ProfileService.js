export class ProfileService {
  constructor (axios) {
    this.$axios = axios
  }

  async updatePhone (phone) {
    return await this.$axios.put('/api/phone/update/', { phone })
  }

  async sendToken () {
    return await this.$axios.post('/api/phone/verify/send-code')
  }

  async verifyToken (token) {
    return await this.$axios.post('/api/phone/verify', { token })
  }
}
