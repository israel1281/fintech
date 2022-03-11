<template>
  <div class="page-content">
    <Title :title="title" />
    <div class="container">
      <CardPayment v-if="!$auth.user.has_cards" />
      <div v-else>
        <div class="row no-gutters mb-3">
          <div class="col-md-12">
            <div class="card">
              <div class="card-body">
                <div class="row">
                  <div class="col-md-12 border-bottom">
                    <h5 class="font-bold">
                      Current Balance: <span class="badge bg-success">{{ loading ? 'XX.XX' : wallet.balance_str }}</span>
                      <button class="btn text-primary p-0" @click="loadWallet">
                        <i v-animate-css.click="rotateTwice" class="bx bx-refresh" />
                      </button>
                    </h5>
                  </div>
                  <div v-loading="loading" class="col-md-12 p-3">
                    <el-form ref="withdrawForm" :model="withdrawForm" label-position="left" label-width="30%">
                      <el-form-item label="Amount">
                        <el-input v-model.number="withdrawForm.amount" />
                        <div v-if="withdrawErrors.amount" class="invalid-feedback" style="display: block">
                          {{ withdrawErrors.amount[0] }}
                        </div>
                      </el-form-item>
                      <el-form-item label="Bank Name">
                        <el-input v-model="withdrawForm.bank_name" />
                        <div v-if="errors.bank" class="invalid-feedback" style="display: block">
                          {{ errors.bank }}
                        </div>
                        <div v-else-if="withdrawErrors.bank_name" class="invalid-feedback" style="display: block">
                          {{ withdrawErrors.bank_name[0] }}
                        </div>
                      </el-form-item>
                      <el-form-item label="Account Name">
                        <el-input :value="$auth.user.name" disabled />
                      </el-form-item>
                      <el-form-item label="Account Number">
                        <el-input v-model="withdrawForm.account_number" />
                        <div v-if="withdrawErrors.account_number" class="invalid-feedback" style="display: block">
                          {{ withdrawErrors.account_number[0] }}
                        </div>
                      </el-form-item>
                      <el-button type="primary" :loading="withdrawLoading" @click="requestWithdrawal">
                        Submit
                      </el-button>
                    </el-form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="pendingWithdraws.length" class="row no-gutters mb-3">
          <div class="col-md-12">
            <div class="card">
              <div class="card-body">
                <el-table :data="pendingWithdraws" style="width: 100%">
                  <el-table-column prop="bank_name" label="Bank Name" />
                  <el-table-column prop="account_name" label="Account Name" />
                  <el-table-column prop="account_number" label="Account Number" />
                  <el-table-column prop="amount_string" label="Amount" />
                  <el-table-column
                    prop="created_at"
                    label="Date"
                    width="200px"
                  >
                    <template slot-scope="scope">
                      {{ $dateFns.format(new Date(scope.row.created_at), 'dd-MM-yyyy hh:mm a') }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="status.title"
                    label="Status"
                    width="100px"
                  >
                    <template slot-scope="scope">
                      <el-tag size="medium" :type="scope.row.status.colour.split(',')[0]">
                        {{ scope.row.status.title }}
                      </el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column label="Action" width="100px">
                    <template slot-scope="scope">
                      <el-button
                        size="mini"
                        @click="cancel(scope.row.id)"
                      >
                        Cancel
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, useStore, computed, reactive, ref, useContext } from '@nuxtjs/composition-api'
import { Notification } from 'element-ui'
export default {
  layout: 'dashboard',
  setup () {
    const title = 'Withdraw'
    const store = useStore()
    const wallet = computed(() => store.state.wallet.defaultWallet)
    const loading = computed(() => store.state.wallet.loading ?? true)
    const withdrawLoading = computed(() => store.state.withdraw.loading)
    const withdrawMessage = computed(() => store.state.withdraw.message)
    const withdrawErrors = computed(() => store.state.withdraw.errors)
    const pendingWithdraws = computed(() => store.state.withdraw.pendingWithdraws)
    const context = useContext()
    const errors = reactive({
      bank: ''
    })
    const blacklistBank = [
      'carbon', 'one finance', 'palmpay', 'vfd', 'vfd mfb', 'vfd microfinance', 'opay', 'paga', 'pagetech'
    ]

    const transferType = ref('')
    const rotateTwice = reactive({
      classes: 'rotateIn',
      delay: 0,
      duration: 0,
      iteration: 2
    })

    const withdrawForm = reactive({
      amount: 0,
      bank_name: '',
      account_number: ''
    })

    function validateBank () {
      if (blacklistBank.includes(withdrawForm.bank_name)) {
        errors.bank = 'This bank has been blacklisted. Please input another bank'
        return false
      } else {
        return true
      }
    }

    async function requestWithdrawal () {
      if (validateBank()) {
        try {
          await store.dispatch('withdraw/withdraw', withdrawForm)
            .then(() => {
              withdrawForm.amount = 0
              withdrawForm.bank_name = ''
              withdrawForm.account_number = ''
              Notification.success({
                title: 'Success',
                message: withdrawMessage.value,
                position: 'bottom-right'
              })
              store.dispatch('wallet/getDefaultWallet')
            })
            .catch(() => {
              if (withdrawMessage.value) {
                Notification.error({
                  title: 'Error',
                  message: withdrawMessage.value,
                  position: 'bottom-right'
                })
              }
            })
        } catch (_) { }
      }
    }

    async function cancel (id) {
      try {
        await store.dispatch('withdraw/cancel', id)
      } catch (_) {}
    }

    async function loadWallet () {
      try {
        await store.dispatch('wallet/getDefaultWallet')
      } catch (_) { }
    }
    onMounted(async () => {
      if (context.$auth.user.has_cards) {
        await loadWallet()
        store.dispatch('withdraw/getUserPending')
      }
    })

    return {
      title,
      wallet,
      loading,
      withdrawForm,
      transferType,
      rotateTwice,
      withdrawErrors,
      pendingWithdraws,
      errors,
      withdrawLoading,
      loadWallet,
      requestWithdrawal,
      cancel
    }
  },
  head () {
    return {
      title: this.title
    }
  }
}
</script>
