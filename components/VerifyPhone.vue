<template>
  <div class="row">
    <el-dialog
      title="Verify Phone Number"
      :visible.sync="verifyPhoneDiag"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      width="80%"
    >
      <el-steps :active="activeStep" finish-status="success" class="mb-3">
        <el-step title="Confirm" />
        <el-step title="Verify OTP" />
      </el-steps>

      <div class="row">
        <!-- Step 1 -->
        <!-- <div v-if="activeStep === 0" class="col-md-12">
          <el-input v-model="phone" placeholder="Enter Phone Number" />
          <div v-if="errors.phone" class="invalid-feedback" style="display: block">
            {{ errors.phone[0] }}
          </div>
          <div v-if="phoneError" class="invalid-feedback" style="display: block">
            {{ phoneError }}
          </div>
        </div> -->

        <!-- Step 2 -->
        <div v-if="activeStep === 1" class="col-md-12">
          <div class="text-center">
            <p>Please verify your phone number</p>
            <h2>{{ phoneHidden }}</h2>
          </div>
        </div>

        <!-- Step 3 -->
        <div v-if="activeStep === 2" class="col-md-12 text-center">
          <p class="mb-3">
            A token has been sent to <strong>{{ phoneHidden }}</strong>. Please input it below to verify your phone number.
          </p>
          <input v-model="token" type="text" class="form-control otp">
          <div v-if="errors.token" class="invalid-feedback" style="display: block">
            {{ errors.token[0] }}
          </div>
          <div v-if="tokenError" class="invalid-feedback" style="display: block">
            {{ tokenError }}
          </div>
          <p>
            <span v-if="timer > 0">
              <span class="text-success">New token sent successfully!</span>
              <br>
              Please wait for <span class="text-warning">{{ date }}</span> before requesting for another one
            </span>
            <span v-else>Did not receive token? <a v-if="!resendDisabled" href="javascript:;" @click="resendToken">Resend</a> <i v-else>Sending...</i></span>
          </p>
          <!-- <p>
            Not phone number? <a href="javascript:;" @click="changePhoneNumber">Change</a>
          </p> -->
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="activeStep === 0" type="primary" :loading="loading" @click="updatePhoneNumber">
          Update
        </el-button>
        <el-button v-if="activeStep === 1" type="primary" :loading="loading" @click="sendVerificationCode()">
          Continue
        </el-button>
        <el-button v-if="activeStep === 2" type="primary" :loading="loading" @click="verifyToken">
          Verify
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { useContext, useStore, ref, computed, onMounted } from '@nuxtjs/composition-api'
import { Notification } from 'element-ui'
export default {
  setup () {
    const context = useContext()
    const store = useStore()
    const verifyPhoneDiag = ref(false)
    const verifyThrottle = ref(0)
    const phone = ref('')
    const timer = ref(0)
    const resendDisabled = ref(false)
    const date = computed(() => {
      let mins = Math.floor(timer.value / 60)
      let secs = timer.value - mins * 60
      if (secs < 10) {
        secs = '0' + secs
      }
      if (mins < 10) {
        mins = '0' + mins
      }
      return mins + ':' + secs
    })
    const activeStep = ref(0)
    const token = ref('')
    const phoneError = ref('')
    const tokenError = ref('')
    const loading = computed(() => store.state.profile.loading)
    const errors = computed(() => store.state.profile.errors)
    const message = computed(() => store.state.profile.message)
    const phoneHidden = computed(() => phone.value.slice(0, 4) + 'xxxx' + phone.value.slice(-3))

    function setAlert (title, message, type) {
      Notification({
        title,
        message,
        type,
        position: 'bottom-right'
      })
    }

    function validatePhone () {
      if (phone.value.match(/0[7-9][01]\d{8}$/gm)) {
        return true
      } else {
        phoneError.value = 'Please input a valid phone number'
        return false
      }
    }

    function validateToken () {
      if (token.value.length === 6) {
        return true
      } else {
        tokenError.value = 'Please input a valid token'
        return false
      }
    }

    // function changePhoneNumber () {
    //   activeStep.value = 0
    // }

    async function updatePhoneNumber () {
      if (validatePhone()) {
        phoneError.value = ''
        try {
          await store.dispatch('profile/updatePhoneNumber', phone.value)
            .then(() => {
              activeStep.value++
            })
            .catch((_) => {
              if (errors.value.phone) {
                setAlert('Error', errors.value.phone[0], 'error')
              } else { setAlert('Error', message.value, 'error') }
            })
        } catch (_) { }
      }
    }

    async function sendVerificationCode (resend = false) {
      if (validatePhone()) {
        try {
          await store.dispatch('profile/sendToken')
            .then(() => {
              setAlert('Success', message.value, 'success')
              resendDisabled.value = false
              if (resend === false) {
                activeStep.value++
              } else {
                timer.value = 30 + (15 * verifyThrottle.value)
                verifyThrottle.value++
              }
            })
            .catch((_) => {
              if (errors.value.phone) {
                setAlert('Error', errors.value.phone[0], 'error')
              } else { setAlert('Error', message.value, 'error') }
            })
        } catch (_) { }
      }
    }

    async function verifyToken () {
      if (validateToken()) {
        try {
          await store.dispatch('profile/verifyToken', token.value)
            .then(() => {
              setAlert('Success', message.value, 'success')
              verifyPhoneDiag.value = false
              context.$auth.fetchUser()
            }).catch((_) => {
              if (errors.value.length) {
                setAlert('Error', errors.value.bvn[0], 'error')
              } else { setAlert('Error', message.value, 'error') }
            })
        } catch (_) { }
      }
    }

    async function resendToken () {
      token.value = ''
      if (!resendDisabled.value) {
        await sendVerificationCode(true)
      }
    }

    onMounted(() => {
      verifyPhoneDiag.value = !context.$auth.user.phone_verified
      if (context.$auth.user.bvn_verified) {
        if (context.$auth.user.bvn?.phone[0] === '0') {
          phone.value = context.$auth.user.bvn?.phone
        } else {
          phone.value = 0 + context.$auth.user.bvn?.phone.slice(3)
        }
        activeStep.value = 1
      }
      setInterval(() => {
        if (timer.value > 0) {
          timer.value--
        } else {
          resendDisabled.value = false
        }
      }, 1000)
    })

    return { verifyPhoneDiag, errors, timer, date, phoneError, phoneHidden, tokenError, resendDisabled, activeStep, phone, loading, token, resendToken, updatePhoneNumber, verifyToken, sendVerificationCode }
  }
}
</script>

<style>
.otp {
  letter-spacing: 0.65em;
  font-weight: 900;
  font-size: 30px;
  max-width: 250px;
  text-align: center;
  margin: auto
}
</style>
