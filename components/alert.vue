<template>
  <div class="alert border-0 alert-dismissible fade show" :class="type ? 'bg-'+type+' alert-'+type : '' ">
    <div class="text-white">
      <slot />
    </div>
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close" />
  </div>
</template>

<script>
export default ({
  props: {
    type: {
      type: String,
      default: 'primary'
    }
  }
})
</script>
