<template>
  <div>
    <div> On Testing...</div>
    <gallery :images="images" :index="index" :options="{youTubeVideoIdProperty: 'youtube', youTubePlayerVars: undefined, youTubeClickToPlay: true}" @close="index = null"></gallery>
    <div
      class="image"
      v-for="(image, imageIndex) in images"
      :key="imageIndex"
      @click="index = imageIndex"
      :style="{ backgroundImage: 'url(' + image + ')', width: '300px', height: '200px' }"
    ></div>
  </div>
</template>

<script>
import VueGallery from 'vue-gallery'

export default {
  data: function () {
    return {
      images: [
        {
          title: 'A YouYube video',
          href: 'https://www.youtube.com/watch?v=hNdlUHBJDKs',
          type: 'text/html',
          youtube: 'hNdlUHBJDKs',
          poster: 'https://img.youtube.com/vi/hNdlUHBJDKs/maxresdefault.jpg'
        }
      ],
      index: null
    }
  },

  components: {
    'gallery': VueGallery
  }
}
</script>

<style scoped>
  .image {
    float: left;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    border: 1px solid #ebebeb;
    margin: 5px;
  }
</style>
