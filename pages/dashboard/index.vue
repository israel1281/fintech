<template>
  <div class="page-content">
    <Title :title="title" />
    <div class="container"> <div>
        <div class="col-md-12">
          <el-alert
            title="Your wallet has been credited successfully!"
            type="success"
            class="mb-3"
            effect="dark"
          />
        </div>
      </div>
      <div class="row">
        <div class="col-md-5"></div>
        <div class="col-md-7">
          <div class="card radius-10">
            <div class="card-body" style="position: relative;">
              <div class="d-flex align-items-center">
                <h4>Recent Transactions</h4>
              </div>
            </div>
          </div>
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
