<template>
  <div class="page-content">
    <el-dialog title="Enter Amount" width="80%" :visible.sync="flutterwaveVisible">
      <form @submit.prevent>
        <div class="form-group">
          <el-input v-model.number="amount" autocomplete="off" />
        </div>
        <el-alert
          v-if="errors.length"
          :title="errors.amount[0]"
          type="error"
          class="mt-3"
        />
      </form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="loading" @click="pay">
          Make Deposit
        </el-button>
      </span>
    </el-dialog>
    <div class="page-breadcrumb d-none d-sm-flex align-items-center mb-3">
      <h3 class="font-bold">
        {{ title }}
      </h3>
    </div>
    <div class="container">
      <div class="d-flex flex-row flex-wrap">
        <!-- <div class="card w-180-h-180 me-5">
          <div class="card-body d-flex flex-column text-center">
            <div class="m-auto">
              <img src="/images/icons/bank-transfer.svg" class="img-5">
            </div>
            <div class="mt-auto">
              <a href="javascript:;">Pay with Bank Transfer</a>
            </div>
          </div>
        </div> -->
        <div class="card w-180-h-180 me-5">
          <div class="card-body d-flex flex-column align-items-center">
            <div class="my-4">
              <img src="/images/icons/flutterwave.png" class="img-fluid">
            </div>
            <div class="mt-auto">
              <a
                href="javascript:;"
                @click="payWithFlutterwave"
              >Pay with Flutterwave</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, useStore, useContext, computed } from '@nuxtjs/composition-api'
import { Notification } from 'element-ui'
export default {
  layout: 'dashboard',
  setup () {
    const title = 'Fund Account'
    const store = useStore()
    const context = useContext()
    const redirectUrl = computed(() => store.state.wallet.url)
    const loading = computed(() => store.state.wallet.loading)
    const errors = computed(() => store.state.wallet.errors)
    const message = computed(() => store.state.wallet.message)
    const flutterwaveVisible = ref(false)
    const paymentMethod = ref('')
    const amount = ref(context.query.value.amount || 0)

    function payWithFlutterwave () {
      flutterwaveVisible.value = true
      paymentMethod.value = 'fw'
    }

    function pay () {
      if (paymentMethod.value === 'fw') {
        processFlutterwavePayment()
      }
    }

    async function processFlutterwavePayment () {
      try {
        await store
          .dispatch('wallet/fwPay', { amount: amount.value })
          .then(() => {
            window.location.href = redirectUrl.value
          })
          .catch(() => {
            Notification.error({
              title: 'Error',
              message: message.value,
              position: 'bottom-right'
            })
          })
      } catch (_) {}
    }

    return {
      title,
      flutterwaveVisible,
      amount,
      paymentMethod,
      loading,
      errors,
      payWithFlutterwave,
      pay
    }
  },
  head () {
    return {
      title: this.title
    }
  }
}
</script>

<style>
.w-180-h-180 {
  width: 180px;
  height: 180px;
}
.img-5 {
  max-width: 5em;
}
</style>
