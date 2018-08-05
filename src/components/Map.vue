<template>
  <div>
    <h1>Map {{ $route.name }}</h1>
  </div>
</template>

<style scoped>
h3 {
  margin: 40px 0 0;
}
</style>

<script>
export default {
  name: 'Map',
  props: {
    name: String
  }
}
</script>
