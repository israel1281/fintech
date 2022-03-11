<template>
  <div class="page-content">
    <Title :title="title" />
    <div class="container">
      <div class="row no-gutters">
        <div class="col-md-12">
          <BvnVerification v-if="!$auth.user.bvn_verified" />
          <div v-else>
            <VerifyPhone v-if="!$auth.user.phone_verified" />
            <LoanEligibility v-else-if="$auth.user.is_blacklist_ng === null" />
          </div>
          <div v-if="$auth.user.has_pending_loan" class="alert border-0 border-start border-5 border-warning alert-dismissible fade show py-2">
            <div class="d-flex align-items-center">
              <div class="font-35 text-warning">
                <i class="bx bx-info-circle" />
              </div>
              <div class="ms-3">
                <div class="col-md-12 border-bottom">
                  <h6 class="text-warning">
                    Outstanding Loan Balance: <span class="text-dark">{{ loading ? 'XX.XX' : $auth.user.wallet.loan_amount_string }}</span>
                    <NuxtLink :to="{ name: 'dashboard-deposit', query: { amount: $auth.user.wallet.loan_amt } }" class="btn btn-success btn-sm">
                      Pay
                    </NuxtLink>
                  </h6>
                </div>
                <div>Sorry you have to pay up your current loan before you can make a new request for another one.</div>
                <p>
                  Additional charges will be incurred after the stipulated 14 days is completed and loan is not repayed
                </p>
              </div>
            </div>
          </div>
          <div v-else-if="$auth.user.is_blacklist_ng === true" v-loading="loading" class="col-md-12">
            <div class="alert border-0 border-start border-5 border-secondary alert-dismissible fade show py-2">
              <div class="d-flex align-items-center">
                <div class="font-35 text-secondary">
                  <i class="bx bx-info-circle" />
                </div>
                <div class="ms-3">
                  <h6 class="mb-0 text-secondary">
                    Loan Eligibility
                  </h6>
                  <div>
                    Sorry, but you're not eligible for a loan.
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else-if="$auth.user.has_pending_loan_request" class="alert border-0 border-start border-5 border-secondary alert-dismissible fade show py-2">
            <div class="d-flex align-items-center">
              <div class="font-35 text-secondary">
                <i class="bx bx-tag-alt" />
              </div>
              <div class="ms-3">
                <h6 class="mb-0">
                  Pending Loan Request
                </h6>
                <div>We're currently processing your loan request and you will be notified shortly!</div>
              </div>
            </div>
          </div>
          <div v-else class="card">
            <div v-loading="loading" class="card-body">
              <div v-if="!showKycForm" class="col-md-12 p-3">
                <el-alert
                  v-if="$auth.user.has_kyc_pending"
                  class="mb-2"
                  title="Your KYC is being processed and you will be notified when it's approved!"
                  type="warning"
                  :closable="false"
                />
                <el-alert
                  v-if="$auth.user.has_kyc_rejected"
                  class="mb-2"
                  title="Sorry, your KYC was rejected, so you cannot apply for a loan!"
                  type="error"
                  :closable="false"
                />
                <div v-else class="form-group">
                  <label for="loan-amount" class="form-label">
                    Enter Loan Amount <a href="javascript:;"> <span class="bx bx-info-circle" /></a>
                  </label>
                  <select id="loan-amount" v-model="amount" class="form-select mb-3" aria-label="Enter Loan Amount">
                    <option value="5000" selected>
                      {{ $config.currency + amount }}
                    </option>
                  </select>
                  <el-button type="primary" :disabled="loading || $auth.user.has_kyc_pending" @click="apply">
                    Apply
                  </el-button>
                  <p class="mt-3">
                    Duration: 14 days Interest: 3% Daily.<br>
                    Additional charges will be incurred after the stipulated 14 days is completed and loan is not repayed
                  </p>
                </div>
              </div>
              <div v-else class="col-md-12 p-3">
                <h4 class="border-bottom pb-2">
                  PLEASE FILL IN THE KYC FORM BELOW
                </h4>
                <el-form ref="kyc" :model="kycForm" label-position="left" label-width="30%">
                  <el-form-item class="fw-bold" label="User Information" />
                  <el-form-item label="Full Name">
                    <el-input v-model="kycForm.name" />
                    <div v-if="errors.name" class="invalid-feedback" style="display: block">
                      {{ errors.name[0] }}
                    </div>
                  </el-form-item>
                  <el-form-item label="Date of Birth">
                    <el-date-picker v-model="kycForm.dob" type="date" placeholder="Choose date" style="width: 100%;" />
                    <div v-if="errors.dob" class="invalid-feedback" style="display: block">
                      {{ errors.dob[0] }}
                    </div>
                  </el-form-item>
                  <el-form-item label="Gender">
                    <el-select v-model="kycForm.gender">
                      <el-option label="Male" value="male" />
                      <el-option label="Female" value="female" />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="Phone Number">
                    <el-input v-model="kycForm.phone" placeholder="080XXXXXXXX" />
                    <div v-if="errors.phone" class="invalid-feedback" style="display: block">
                      {{ errors.phone[0] }}
                    </div>
                  </el-form-item>
                  <el-form-item label="Address">
                    <el-input v-model="kycForm.address" />
                    <div v-if="errors.address" class="invalid-feedback" style="display: block">
                      {{ errors.address[0] }}
                    </div>
                  </el-form-item>
                  <el-form-item label="City">
                    <el-input v-model="kycForm.city" />
                    <div v-if="errors.city" class="invalid-feedback" style="display: block">
                      {{ errors.city[0] }}
                    </div>
                  </el-form-item>
                  <el-form-item label="State">
                    <el-input v-model="kycForm.state" />
                    <div v-if="errors.state" class="invalid-feedback" style="display: block">
                      {{ errors.state[0] }}
                    </div>
                  </el-form-item>
                  <el-form-item label="Relationship Status">
                    <el-select v-model="kycForm.relationship_status">
                      <el-option label="Single" value="single" />
                      <el-option label="Married" value="married" />
                      <el-option label="Divorced" value="divorced" />
                    </el-select>
                    <div v-if="errors.relationship_status" class="invalid-feedback" style="display: block">
                      {{ errors.relationship_status[0] }}
                    </div>
                  </el-form-item>
                  <el-form-item class="fw-bold" label="Next of Kin" />
                  <el-form-item class="ms-3" label="Full Name">
                    <el-input v-model="kycForm.kin_name" />
                    <div v-if="errors.kin_name" class="invalid-feedback" style="display: block">
                      {{ errors.kin_name[0] }}
                    </div>
                  </el-form-item>
                  <el-form-item class="ms-3" label="Phone Number">
                    <el-input v-model="kycForm.kin_phone" />
                    <div v-if="errors.kin_phone" class="invalid-feedback" style="display: block">
                      {{ errors.kin_phone[0] }}
                    </div>
                  </el-form-item>
                  <el-button type="primary" :loading="loading" @click="processKyc">
                    Submit
                  </el-button>
                </el-form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, useStore, useContext, computed, onMounted } from '@nuxtjs/composition-api'
import { Notification } from 'element-ui'
export default {
  layout: 'dashboard',
  setup () {
    const title = 'Apply For a Loan'
    const amount = ref(5000)
    const store = useStore()
    const showKycForm = ref(false)
    const kycForm = reactive({
      name: '',
      dob: '',
      gender: '',
      phone: '',
      address: '',
      kin_name: '',
      kin_phone: '',
      relationship_status: '',
      city: '',
      state: ''
    })
    const context = useContext()
    const errors = computed(() => store.state.loan.errors)
    const message = computed(() => store.state.loan.message)
    const loading = computed(() => store.state.loan.loading || store.state.authe.loading)
    const user = computed(() => store.state.auth.user)
    const hasKyc = computed(() => store.state.auth.user.has_kyc)

    function apply () {
      if (hasKyc.value) { processLoan() } else { showKycForm.value = true }
    }

    async function processLoan () {
      if (!user.has_kyc_pending) {
        try {
          await store
            .dispatch('loan/apply', { amount: amount.value })
            .then(() => {
              Notification({
                type: store.state.auth.user.has_kyc_pending ? 'warning' : 'success',
                title: store.state.auth.user.has_kyc_pending ? 'Processing...' : 'Success',
                message: message.value,
                position: 'bottom-right'
              })
              context.$auth.fetchUser()
            })
        } catch (_) {}
      }
    }

    async function processKyc () {
      try {
        await store
          .dispatch('loan/kyc', kycForm)
          .then(() => {
            Notification.success({
              title: 'Success',
              message: message.value,
              position: 'bottom-right'
            })
            context.$auth.fetchUser()
            showKycForm.value = false
          })
      } catch (_) {}
    }

    onMounted(async () => {
      await store.dispatch('authe/fetchUser')
    })

    return { title, amount, errors, loading, kycForm, showKycForm, message, apply, processKyc }
  },
  head () {
    return {
      title: this.title
    }
  }
}
</script>
