<template>
  <div class="row">
    <div class="col-md-12">
      <div class="alert border-0 border-start border-5 border-warning alert-dismissible fade show py-2">
        <div class="d-flex align-items-center">
          <div class="font-35 text-warning">
            <i class="bx bx-info-circle" />
          </div>
          <div class="ms-3">
            <h6 class="mb-0 text-warning">
              Loan Eligibility
            </h6>
            <div>
              Please click the button below to check if you are eligibile for a loan <el-button type="warning" size="mini" :loading="loading" @click="processBlacklistNg()">
                Check<span v-if="loading">ing...</span>
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useContext, useStore, computed } from '@nuxtjs/composition-api'
import { Notification } from 'element-ui'
export default {
  setup () {
    const context = useContext()
    const store = useStore()
    const user = computed(() => context.$auth.user)
    const loading = computed(() => store.state.bvn.loading)
    const errors = computed(() => store.state.bvn.errors)
    const message = computed(() => store.state.bvn.message)

    function setAlert (title, message, type) {
      Notification({
        title,
        message,
        type,
        position: 'bottom-right'
      })
    }

    async function processBlacklistNg () {
      await store.dispatch('bvn/searchBlacklistNg', { bvn: user.value.bvn.bvn }).then(() => {
        setAlert('Success', message.value, 'success')
        context.$auth.fetchUser()
      }).catch((error) => {
        if (errors.value.length) {
          setAlert('Error', errors.value.bvn[0], 'error')
        } else { setAlert('Error', error.response.data.message, 'error') }
      })
    }

    return { loading, processBlacklistNg }
  }
}
</script>
