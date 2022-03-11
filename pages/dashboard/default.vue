<template>
  <div class="page-content">
    <Title :title="title" />
    <div class="container">
      <div class="row">
        <div class="col-md-5">
          <Wallet />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'dashboard',
  setup () {
    const title = 'Your Dashboard'

    return { title }
  },
  head () {
    return {
      title: this.title
    }
  }
}
</script>
