<template>
  <div class="row">
    <el-dialog
      title="BVN Verification"
      :visible.sync="verifyBvnDiag"
      width="80%"
    >
      <form>
        <div class="form-group">
          <label for="bvn" class="form-label">Enter your BVN</label>
          <input
            id="bvn"
            type="text"
            class="form-control"
            aria-describedby="bvn"
            autocomplete="off"
            required
          >
        </div>
      </form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary">
          Verify
        </el-button>
      </span>
    </el-dialog>
    <div class="col-md-12">
      <div class="alert border-0 border-start border-5 border-warning alert-dismissible fade show py-2">
        <div class="d-flex align-items-center">
          <div class="font-35 text-warning">
            <i class="bx bx-info-circle" />
          </div>
          <div class="ms-3">
            <h6 class="mb-0 text-warning">
              BVN Verification
            </h6>
            <div>
              You need to verify your bvn for your {{ $config.appName }} account to be fully activated! Please click <a class="text-warning" href="javascript:void(0);">verify bvn</a> to verify your BVN.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from '@nuxtjs/composition-api'
export default {
  setup () {
    const verifyBvnDiag = ref(false)
    return { verifyBvnDiag }
  }
}
</script>
