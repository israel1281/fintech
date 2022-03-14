<template>
  <!--wrapper-->
  <div class="wrapper">
    <!--sidebar wrapper -->
    <SideBar />
    <!--end sidebar wrapper -->
    <!--start header -->
    <Header />
    <!--end header -->
    <!--start page wrapper -->
    <div class="page-wrapper"></div>
    <!--end page wrapper -->
    <!--start overlay-->
    <div class="overlay toggle-icon" />
    <!--end overlay-->
    <!--Start Back To Top Button-->
    <a
      href="javaScript:;"
      class="back-to-top"
    ><i
      class="bx bxs-up-arrow-alt"
    /></a>
    <!--End Back To Top Button-->
    <footer class="page-footer">
      <p class="mb-0">
        Copyright © {{ $config.appName }} {{ new Date().getFullYear() }}. All
        rights reserved.
      </p>
    </footer>
  </div>
</template>

<script>
export default {
  mounted () {
    const appjs = document.createElement('script')
    appjs.setAttribute('src', '/js/app.js')
    document.body.appendChild(appjs)
  }
}
</script>
