import forge from 'node-forge'

export class CypherFW {
  constructor (key) {
    this.key = key
  }

  encrypt (text) {
    const cipher = forge.cipher.createCipher(
      '3DES-ECB',
      forge.util.createBuffer(this.key)
    )
    cipher.start({ iv: '' })
    cipher.update(forge.util.createBuffer(text, 'utf-8'))
    cipher.finish()
    const encrypted = cipher.output
    return forge.util.encode64(encrypted.getBytes())
  }
  // encrypt (text) {
  //   // const forge = require('node-forge')
  //   const cipher = forge.cipher.createCipher(
  //     '3DES-ECB',
  //     forge.util.createBuffer(this.key)
  //   )
  //   cipher.start({ iv: '' })
  //   cipher.update(forge.util.createBuffer(text, 'utf-8'))
  //   cipher.finish()
  //   const encrypted = cipher.output
  //   return forge.util.encode64(encrypted.getBytes())
  // }
}
