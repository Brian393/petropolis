<template>
  <div>
    <div @click="open" class="link"><slot></slot></div>
    <LightBox v-if="isOpen" :images="images" :showCaption="true" @onOpened="onOpenChange"></LightBox>
  </div>
</template>
<style scoped>
div {
  display: inline;
}
</style>
<script>
import LightBox from 'vue-image-lightbox'
// see: https://www.npmjs.com/package/vue-image-lightbox

export default {
  name: 'AppLightBox',
  components: {
    LightBox
  },
  props: {
    images: Array
  },
  data: function () {
    return {
      isOpen: false
    }
  },
  methods: {
    open: function () {
      this.isOpen = true
    },
    onOpenChange: function (opened) {
      this.isOpen = opened
    }
  }
}
</script>
