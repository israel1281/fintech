<template>
  <Nuxt />
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
