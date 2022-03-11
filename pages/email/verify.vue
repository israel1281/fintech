<template>
  <div class="wrapper">
    <div
      class="
        d-flex
        align-items-center
        justify-content-center
        my-5 my-lg-0
      "
    >
      <div class="container-fluid">
        <div class="row row-cols-1 row-cols-lg-2 row-cols-xl-3">
          <div class="col mx-auto">
            <div class="my-5 text-center">
              <img src="/images/logo-img.png" width="180" alt="">
            </div>
            <div class="card">
              <div class="card-body">
                <div class="border p-4 rounded">
                  <div class="text-center">
                    <h4>
                      Verify Email
                    </h4>
                  </div>
                  <p>
                    An email verification link has been sent to your email. Please click the link to verify your email.<br><br>
                    If you did not receive link, click the button below to resend verification link!
                  </p>
                  <div class="form-body">
                    <form class="row g-3">
                      <div class="col-12">
                        <div class="d-grid">
                          <button type="submit" class="btn btn-primary">
                            <i class="bx bx-reset" />Resend Email Verfication Link <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--end row-->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  head () {
    return {
      title: 'Verify Email'
    }
  }
}
</script>
