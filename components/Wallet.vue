<template>
  <div class="card radius-10">
    <div class="card-body" style="position: relative;">
      <div class="d-flex align-items-center">
        <div>
          <div class="mb-2 text-secondary font-15 text-uppercase">
            <b>A/C: {{ loading ? 'loading...' : wallet.account_number }}</b>
          </div>
          <p class="mb-0 text-secondary">
            Your Balance
          </p>
          <h4 class="my-1 mb-2">
            {{ (loading ? 'XX.XX' : wallet.balance_str) }} <i class="text-primary" data-feather="eye-off" />
            <button class="btn text-primary p-0" @click="loadWallet">
              <i v-animate-css.click="rotateTwice" class="bx bx-refresh" />
            </button>
          </h4>
          <NuxtLink :to="{ name: 'dashboard-deposit' }">
            Fund {{ $config.appName }} Account
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, useStore, computed, reactive } from '@nuxtjs/composition-api'
export default {
  setup () {
    const store = useStore()
    const wallet = computed(() => store.state.wallet.defaultWallet)
    const loading = computed(() => store.state.wallet.loading ?? true)
    const rotateTwice = reactive({
      classes: 'rotateIn',
      delay: 0,
      duration: 0,
      iteration: 2
    })

    async function loadWallet () {
      try {
        await store.dispatch('wallet/getDefaultWallet')
      } catch (_) { }
    }
    onMounted(async () => {
      await loadWallet()
    })

    return { wallet, rotateTwice, loading, loadWallet }
  }
}
</script>

<style>
.font-15 {
  font-size: 15px;
  opacity: .5
}
</style>
