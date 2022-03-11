<template>
  <div class="card">
    <div class="card-body">
      <div class="row flex-wrap justify-content-center">
        <div class="col-md-12 border-bottom">
          <h5 class="font-bold">
            Verify Payment Method
          </h5>
        </div>
        <div class="col-md-12 p-3">
          <div v-if="$route.query.status === 'failed'" class="row">
            <div class="col-md-12">
              <el-alert
                title="An error occurred while processing request!"
                type="error"
                class="mb-3"
                effect="dark"
              />
            </div>
          </div>
          <div v-if="$route.query.status === 'cancelled'" class="row">
            <div class="col-md-12">
              <el-alert
                title="Request was not processed completely!"
                type="warning"
                class="mb-3"
                effect="dark"
              />
            </div>
          </div>
          <p>
            Before proceeding to make withdrawal. We need to verify your payment method for the first time with a small fee of {{ $config.currency + amount }}.
          </p>
          <el-button type="primary" :loading="loading" @click="verifyCard">
            Proceed
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore, computed } from '@nuxtjs/composition-api'
import { Notification } from 'element-ui'
export default {
  setup () {
    const store = useStore()
    const redirectUrl = computed(() => store.state.wallet.url)
    const loading = computed(() => store.state.wallet.loading)
    const message = computed(() => store.state.wallet.message)
    const amount = 10

    async function verifyCard () {
      try {
        await store
          .dispatch('wallet/fwPay', { amount })
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
    return { loading, amount, verifyCard }
  }
}
</script>
