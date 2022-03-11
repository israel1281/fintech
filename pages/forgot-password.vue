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
                      Recover your password
                    </h4>
                    <p>
                      Go back to
                      <NuxtLink :to="{ name: 'index' }">
                        Login
                      </NuxtLink>
                    </p>
                  </div>
                  <div class="form-body">
                    <form class="row g-3">
                      <div class="col-12">
                        <label
                          for="inputEmailAddress"
                          class="form-label"
                        >Email Address</label>
                        <input
                          id="inputEmailAddress"
                          type="email"
                          class="form-control"
                          autocomplete="username"
                          autofocus
                        >
                      </div>
                      <div class="invalid-feedback" style="display: block"></div>
                      <div class="col-12">
                        <div class="d-grid">
                          <button type="submit" class="btn btn-primary" >
                            <i class="bx bxs-key" />Recover <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
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
      title: 'Forgot Password'
    }
  }
}
</script>
