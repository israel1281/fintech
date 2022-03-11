<template>
  <div class="card">
    <div class="card-body">
      <div class="row flex-wrap justify-content-center">
        <div class="col-md-12 border-bottom">
          <h5 class="font-bold">
            Card Information
          </h5>
          <p>
            Please input your card details to continue
          </p>
        </div>
        <div v-if="activeStep === 0" class="col-md-12 p-3" style="max-width: 450px">
          <div class="row mb-3">
            <div class="col">
              <label for="card-number">Card Number</label>
              <input id="card-number" v-model="card.card_number" class="form-control card-number" autocomplete="off" @keypress="filterCardNumber">
            </div>
          </div>
          <div class="row justify-content-between mb-3">
            <div class="col">
              <label for="card-cvv">CVV</label>
              <input id="card-cvv" v-model="card.cvv" class="form-control card-cvv" autocomplete="off" @keypress="filterCVVNumber">
            </div>
            <div class="col">
              <label class="d-block">Expiry Date</label>
              <input v-model="card.expiry_month" class="form-control card-expiry d-inline" autocomplete="off" @keypress="filterExpiryNumber">
              <input v-model="card.expiry_year" class="form-control card-expiry d-inline" autocomplete="off" @keypress="filterExpiryNumber">
            </div>
          </div>
          <div class="row">
            <div class="col">
              <el-button type="primary" :loading="loading" @click="submitCardDetails">
                Submit
              </el-button>
            </div>
          </div>
        </div>
        <div v-if="activeStep === 1" class="col-md-12 p-3" style="max-width: 450px">
          <div class="row mb-3">
            <div class="col">
              <label for="card-number">Card Number</label>
              <div class="card-no-info">
                {{ card.card_number.substring(0, 2) }}XX-XXXX-XXXX-{{ card.card_number.substring(card.card_number.length-4) }}
              </div>
            </div>
          </div>
          <div class="row justify-content-between mb-3">
            <div class="col">
              <label>CVV</label>
              <div class="card-cvv-info">
                XXX
              </div>
            </div>
            <div class="col">
              <label>Expiry Date</label>
              <div class="card-cvv-info">
                XX/{{ card.expiry_year }}
              </div>
            </div>
            <div class="col-12 text-end">
              <a href="javascript:;" @click="changeCard">Change</a>
            </div>
          </div>
          <div v-if="isPin" class="row mb-3">
            <div class="col-12 text-center d-flex flex-column justify-content-center">
              <label for="card-pin">Card Pin</label>
              <input
                id="card-pin"
                v-model="cardPin"
                type="password"
                class="form-control card-pin m-auto"
                autocomplete="off"
                @keypress="filterNumber"
              >
            </div>
          </div>
          <div v-if="isOtp" class="row mb-3">
            <div class="col-12 text-center d-flex flex-column justify-content-center">
              <label for="card-otp" class="mb-2">{{ otpText }}</label>
              <input
                id="card-otp"
                v-model="chargeValidateForm.otp"
                type="text"
                class="form-control card-otp m-auto"
                autocomplete="off"
                @keypress="filterNumber"
              >
            </div>
          </div>
          <div class="row">
            <div class="col">
              <el-button v-if="isPin" type="primary" :loading="loading" @click="submitCardDetails">
                Submit
              </el-button>
              <el-button v-if="isOtp" type="primary" :loading="loading" @click="validateCharge">
                Validate OTP
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useContext, useStore, ref, computed, reactive, onMounted } from '@nuxtjs/composition-api'
import Vue from 'vue'
import { Notification } from 'element-ui'
export default {
  setup () {
    const context = useContext()
    const store = useStore()
    const verifyCardDiag = ref(false)
    const cardNumberText = ref('')
    const otpText = ref('')
    const transactionId = ref('')
    const card = reactive({
      card_number: context.isDev ? '5531886652142950' : '',
      cvv: context.isDev ? '564' : '',
      expiry_month: context.isDev ? '09' : '',
      expiry_year: context.isDev ? '32' : '',
      currency: 'NGN',
      amount: 10,
      email: context.$auth.user.email,
      fullname: context.$auth.user.name,
      tx_ref: '',
      redirect_url: 'https://webhook.site/3ed41e38-2c79-4c79-b455-97398730866c'
    })
    const chargeValidateForm = reactive({
      otp: '',
      flw_ref: ''
    })
    const cardPin = ref('')
    const cardOtp = ref('')
    const resendDisabled = ref(false)
    const activeStep = ref(0)
    const authorization = computed(() => store.state.card.authorization)
    const data = computed(() => store.state.card.data)
    const reference = computed(() => store.state.card.reference)
    const message = computed(() => store.state.card.message)
    const loading = computed(() => store.state.card.loading)
    const isOtp = computed(() => (authorization.value.mode === 'redirect') || (authorization.value.mode === 'otp'))
    const isPin = computed(() => authorization.value.mode === 'pin')
    // Step 1: Card number
    // Step 2: Card pin

    function filterCardNumber (e) {
      e = e || window.event
      const charCode = e.which || e.keyCode
      if ((charCode >= 48) && (charCode <= 57) && (card.card_number.length < 16)) {
        return true
      } else {
        e.preventDefault()
      }
    }

    function filterExpiryNumber (e) {
      e = e || window.event
      const charCode = e.which || e.keyCode
      if ((charCode >= 48) && (charCode <= 57) && ((card.expiry_month.length < 2) || (card.expiry_year.length < 2))) {
        return true
      } else {
        e.preventDefault()
      }
    }

    function filterCVVNumber (e) {
      e = e || window.event
      const charCode = e.which || e.keyCode
      if ((charCode >= 48) && (charCode <= 57) && (card.cvv.length < 3)) {
        return true
      } else {
        e.preventDefault()
      }
    }

    function filterNumber (e) {
      e = e || window.event
      const charCode = e.which || e.keyCode
      if ((charCode >= 48) && (charCode <= 57)) {
        return true
      } else {
        e.preventDefault()
      }
    }

    function showAlert (alertType, message) {
      if (alertType === 'success') {
        Notification.success({
          title: 'Success',
          message,
          position: 'bottom-right'
        })
      } else {
        Notification.error({
          title: 'Error',
          message,
          position: 'bottom-right'
        })
      }
    }

    function changeCard () {
      activeStep.value = 0
      store.commit('card/SET_AUTHORIZATION', {})
    }

    async function submitCardDetails () {
      try {
        if (isPin.value) {
          Vue.set(card, 'authorization', { mode: authorization.value.mode })
          Vue.set(card.authorization, 'pin', cardPin.value)
        }
        await store.dispatch('card/initialize', card)
          .then(() => {
            if (isPin.value) {
              activeStep.value = 1
            }
            if (isOtp.value) {
              otpText.value = data.value.processor_response
              // window.open(authorization.value.redirect, '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes')
            }
          })
          .catch((_) => {
            showAlert('error', message.value)
          })
      } catch (_) { }
    }

    async function validateCharge () {
      try {
        chargeValidateForm.flw_ref = data.value.flw_ref
        await store.dispatch('card/validateCharge', chargeValidateForm)
          .then(() => {
            transactionId.value = data.value.id
            verifyPayment()
          })
          .catch((_) => {
            showAlert('error', message.value)
          })
      } catch (e) {
        // console.log(e)
      }
    }

    async function verifyPayment () {
      try {
        await store.dispatch('card/verifyPayment', { transaction_id: transactionId.value })
          .then(() => {
            showAlert('success', 'Card added successfully')
            context.$auth.fetchUser()
          })
          .catch((_) => {
            showAlert('error', message.value)
          })
      } catch (e) {
        // console.log(e)
      }
    }

    async function generateReference () {
      try {
        await store.dispatch('card/generateReference')
          .then(() => {
            card.tx_ref = reference.value
          })
      } catch (e) {
        // console.log(e)
      }
    }

    onMounted(() => {
      generateReference()
      activeStep.value = 0
    })

    return { verifyCardDiag, chargeValidateForm, otpText, card, isOtp, isPin, authorization, cardPin, cardOtp, resendDisabled, activeStep, cardNumberText, loading, filterCardNumber, filterNumber, filterExpiryNumber, filterCVVNumber, validateCharge, submitCardDetails, changeCard }
  }
}
</script>

<style>
.card-number {
  font-weight: 900;
  font-size: 20px;
}
.card-expiry {
  max-width: 45px;
}
.card-pin {
  max-width: 90px;
  font-size: 20px;
  letter-spacing: 2px;
  font-weight: 900;
}
.card-otp {
  max-width: 120px;
  font-size: 20px;
  letter-spacing: 2px;
  font-weight: 900;
}
.card-cvv {
  max-width: 55px
}
.card-no-info {
  font-size: 20px;
  font-weight: bold;
}
.card-cvv-info {
  font-size: 16px;
  font-weight: bold;
}
</style>
