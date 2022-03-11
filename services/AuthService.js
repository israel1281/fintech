export class AuthService {
  constructor (axios) {
    this.$axios = axios
  }

  async register (payload) {
    return await this.$axios.post('/api/register', payload)
  }

  async forgotPassword (payload) {
    await this.csrf()
    return this.$axios.post('/forgot-password', payload)
  }

  async resetPassword (payload) {
    await this.csrf()
    return this.$axios.post('/reset-password', payload)
  }

  async emailVerify () {
    return await this.$axios.post('/email/resend')
  }

  csrf () {
    return this.$axios.get('/sanctum/csrf-cookie')
  }
}
