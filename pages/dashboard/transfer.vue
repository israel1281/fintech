<template>
  <div class="page-content">
    <Title :title="title" />
    <div class="container">
      <div class="row no-gutters">
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
                  <label for="transferType" class="form-label">
                    Transfer Type
                  </label>
                  <select id="transferType" v-model="transferType" class="form-select mb-3" aria-label="Select Transfer Type">
                    <option value="" selected>
                      Select Transfer Type
                    </option>
                    <option value="cw">
                      {{ $config.appName }} to {{ $config.appName }} Account
                    </option>
                    <option value="bt">
                      {{ $config.appName }} to Other Banks
                    </option>
                  </select>
                  <el-form v-if="transferType === 'cw'" ref="cwForm" :model="cwForm">
                    <el-form-item label="Email Address">
                      <el-input v-model="cwForm.email" />
                    </el-form-item>
                    <el-form-item label="Amount">
                      <el-input v-model="cwForm.amount" type="number" />
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary">
                        Continue <i class="bx bx-caret-right" />
                      </el-button>
                    </el-form-item>
                  </el-form>
                  <el-form v-if="transferType === 'bt'" ref="btForm" :model="btForm">
                    <el-form-item label="Bank Type">
                      <el-select v-model="btForm.bankType" placeholder="Select Bank Type">
                        <el-option label="Acccess Bank" value="access bank" />
                        <el-option label="UBA" value="uba" />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="Account Number">
                      <el-input v-model="btForm.accountNumber" />
                    </el-form-item>
                    <el-form-item label="Account Name">
                      <el-input v-model="btForm.amountName" disabled="true" type="number" />
                    </el-form-item>
                    <el-form-item label="Amount">
                      <el-input v-model="btForm.amount" type="number" />
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary">
                        Continue <i class="bx bx-caret-right" />
                      </el-button>
                    </el-form-item>
                  </el-form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, useStore, computed, reactive, ref } from '@nuxtjs/composition-api'
export default {
  layout: 'dashboard',
  setup () {
    // bt ---- Bank Transfer
    // cw ---- Creditwolf
    const title = 'Transfer Funds'
    const store = useStore()
    const wallet = computed(() => store.state.wallet.defaultWallet)
    const loading = computed(() => store.state.wallet.loading ?? true)
    const transferType = ref('')
    const rotateTwice = reactive({
      classes: 'rotateIn',
      delay: 0,
      duration: 0,
      iteration: 2
    })
    const btForm = reactive({
      amount: 0,
      bankType: '',
      accountNumber: '',
      accountName: ''
    })
    const cwForm = reactive({
      amount: 0,
      email: '',
      name: ''
    })

    async function loadWallet () {
      try {
        await store.dispatch('wallet/getDefaultWallet')
      } catch (_) { }
    }
    onMounted(async () => {
      await loadWallet()
    })

    return {
      title,
      wallet,
      loading,
      btForm,
      cwForm,
      transferType,
      rotateTwice,
      loadWallet
    }
  },
  head () {
    return {
      title: this.title
    }
  }
}
</script>
