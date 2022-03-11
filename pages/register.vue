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
            <div class="my-4 text-center">
              <img src="/images/logo-img.png" width="180" alt="">
            </div>
            <div class="card">
              <div class="card-body">
                <div class="border p-4 rounded">
                  <div class="text-center">
                    <h4>
                      Create your {{ $config.appName }} account
                    </h4>
                    <p>
                      Already have an account?
                      <NuxtLink :to="{ name: 'index' }">
                        Login
                      </NuxtLink>
                    </p>
                  </div>
                  <div class="form-body">
                    <form class="row g-3">
                      <div class="col-sm-6">
                        <label for="inputFirstName" class="form-label">First Name</label>
                        <input
                          id="inputFirstName"
                          type="text"
                          class="form-control"
                          placeholder="John"
                          autocomplete="first-name"
                          required
                        >
                        <div class="invalid-feedback" style="display: block"></div>
                      </div>
                      <div class="col-sm-6">
                        <label for="inputLastName" class="form-label">Last Name</label>
                        <input
                          id="inputLastName"
                          type="text"
                          class="form-control"
                          placeholder="Doe"
                          autocomplete="last-name"
                          required
                        >
                        <div class="invalid-feedback" style="display: block"></div>
                      </div>
                      <!-- <div class="col-12">
                        <label for="inputPhone" class="form-label">Phone Number</label>
                        <input
                          id="inputPhone"
                          type="text"
                          class="form-control"
                          placeholder="080XXXXXXXX"
                          autocomplete="phone"
                          required
                        >
                        <div class="invalid-feedback" style="display: block"></div>
                        <div class="invalid-feedback" style="display: block"></div>
                      </div> -->
                      <div class="col-12">
                        <label for="inputEmailAddress" class="form-label">Email Address</label>
                        <input
                          id="inputEmailAddress"
                          type="email"
                          class="form-control"
                          placeholder="johndoe@example.com"
                          autocomplete="email"
                          required
                        >
                        <div class="invalid-feedback" style="display: block"></div>
                      </div>
                      <div class="col-12">
                        <label for="inputChoosePassword" class="form-label">Password</label>
                        <div id="show_hide_password" class="input-group">
                          <input
                            id="inputChoosePassword"
                            class="form-control border-end-0"
                            placeholder="********"
                            autocomplete="new-password"
                            required
                          > <a href="javascript:;" class="input-group-text bg-transparent"><i class="bx " /></a>
                        </div>
                        <div class="invalid-feedback" style="display: block"></div>
                      </div>
                      <div class="col-12">
                        <label for="inputChoosePassword" class="form-label">Confirm Password</label>
                        <div id="show_hide_password" class="input-group">
                          <input
                            id="inputChoosePasswordConfirm"
                            class="form-control border-end-0"
                            placeholder="********"
                            autocomplete="new-password"
                            required
                          > <a href="javascript:;" class="input-group-text bg-transparent"><i class="bx " /></a>
                        </div>
                      </div>
                      <div class="col-12">
                        <div class="form-check form-switch">
                          <input id="flexSwitchCheckChecked" class="form-check-input" type="checkbox" required>
                          <label class="form-check-label" for="flexSwitchCheckChecked">
                            I read and agree to
                            <a href="#" target="_blank">Terms &amp; Conditions</a> and
                            <a href="#" target="_blank">Privacy Policy</a>
                          </label>
                        </div>
                        <div class="invalid-feedback" style="display: block"></div>
                      </div>
                      <div class="col-12">
                        <div class="d-grid">
                          <button type="submit" class="btn btn-primary">
                            <i class="bx bxs-user" />Register <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
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
      title: 'Register'
    }
  }
}
</script>
