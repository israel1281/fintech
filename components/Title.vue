<template>
  <div class="page-breadcrumb d-none d-sm-flex align-items-center mb-3">
    <h3 class="font-bold">{{ title }}</h3>
    <p v-if="description">{{ description }}</p>
    <div class="ms-auto">
      <NuxtLink :to="{ name: 'dashboard-deposit' }" class="btn btn-primary btn-sm title-btn">
        Fund {{ $config.appName }} Account
      </NuxtLink>
    </div>
  </div>
</template>

<script>
export default ({
  props: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ''
    }
  }
})
</script>
