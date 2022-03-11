<template>
  <div class="row">
    <el-dialog
      title="Verify Phone Number"
      width="80%"
    >
      <el-steps finish-status="success" class="mb-3">
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
        <div class="col-md-12">
          <div class="text-center">
            <p>Please verify your phone number</p>
            <h2></h2>
          </div>
        </div>

        <!-- Step 3 -->
        <div class="col-md-12 text-center">
          <p class="mb-3">
            A token has been sent to <strong></strong>. Please input it below to verify your phone number.
          </p>
          <input type="text" class="form-control otp">
          <div class="invalid-feedback" style="display: block"></div>
          <div class="invalid-feedback" style="display: block"></div>
          <p>
            <span>
              <span class="text-success">New token sent successfully!</span>
              <br>
              Please wait for <span class="text-warning"></span> before requesting for another one
            </span>
            <span>Did not receive token? <a href="javascript:;">Resend</a> <i>Sending...</i></span>
          </p>
          <!-- <p>
            Not phone number? <a href="javascript:;" @click="changePhoneNumber">Change</a>
          </p> -->
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary">
          Update
        </el-button>
        <el-button type="primary">
          Continue
        </el-button>
        <el-button type="primary">
          Verify
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

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
