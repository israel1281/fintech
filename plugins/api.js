import { AuthService } from '~/services/AuthService.js'
import { LoanService } from '~/services/LoanService'
import { WithdrawService } from '~/services/WithdrawService'
import { WalletService } from '~/services/WalletService.js'
import { TransactionsService } from '~/services/TransactionsService.js'
import { UsersService } from '~/services/UsersService.js'
import { ProfileService } from '~/services/ProfileService.js'
import { BankService } from '~/services/BankService.js'
import { CardService } from '~/services/CardService.js'
import { BillPaymentService } from '~/services/BillPaymentService.js'
export default function ({ $axios, $config }, inject) {
  const api = {
    auth: new AuthService($axios),
    wallet: new WalletService($axios),
    loan: new LoanService($axios),
    withdraw: new WithdrawService($axios),
    transactions: new TransactionsService($axios),
    users: new UsersService($axios),
    profile: new ProfileService($axios),
    bank: new BankService($axios, $config.aesKey, $config.ivKey),
    card: new CardService($axios, $config.fwEncryptKey),
    bp: new BillPaymentService($axios)
  }
  inject('api', api)
}
