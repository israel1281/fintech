import crypto from 'crypto'

export class CypherBank {
  constructor (aesKey, ivKey) {
    this.aesKey = aesKey
    this.ivKey = ivKey
    this.algorithm = 'aes-128-cbc'
  }

  encrypt (dataToBeEncrypted) {
    if (typeof dataToBeEncrypted !== 'string') {
      throw new TypeError(
        'Cypher.encrypt: argument must be string; objects must must be stringified'
      )
    }
    const cypher = crypto.createCipheriv(
      this.algorithm,
      Buffer.from(this.aesKey),
      this.ivKey
    )
    const encrypted = cypher.update(dataToBeEncrypted)
    const encryptedData = Buffer.concat([encrypted, cypher.final()])
    return encryptedData.toString('hex')
  }

  decrypt (encryptedData) {
    if (typeof encryptedData !== 'string') {
      throw new TypeError('Cypher.decrypt error: argument must be string')
    }
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      Buffer.from(this.aesKey),
      this.ivKey
    )
    const encryptedText = Buffer.from(encryptedData, 'hex')
    const decrypted = decipher.update(encryptedText)
    const decryptedData = Buffer.concat([decrypted, decipher.final()])
    return decryptedData.toString()
  }
}
