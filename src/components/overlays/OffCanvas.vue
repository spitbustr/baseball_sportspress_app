<template>
  <div>
    <!-- Button trigger off-canvas -->
    <button
      type="button"
      class="btn btn-primary"
      data-bs-toggle="offcanvas"
      data-bs-target="#offcanvasExample"
      aria-controls="offcanvasExample"
    >
      Open Off-canvas
    </button>

    <!-- Off-canvas -->
    <div
      class="offcanvas offcanvas-start"
      tabindex="-1"
      id="offcanvasExample"
      aria-labelledby="offcanvasExampleLabel"
    >
      <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="offcanvasExampleLabel">Off-canvas Title</h5>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body">
        <!-- Off-canvas content goes here -->
        <p>Off-canvas content</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OffCanvas',
}
</script>

<style scoped>
/* Add custom styles here */
</style>
