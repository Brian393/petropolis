<style scoped>
.video {
position: relative; padding-bottom: 56.3%; height: 0;
}
.video iframe {
position: absolute; top: 0; left: 0; width: 100%; height: 100%;
}
.quote {
font-weight: bold; font-style: italic; color: #333333;  text-align: center;
}
.quote-2 {
font-weight: bold; font-style: italic; color: #333333;
}
</style>

<template>
  <div class="aside-content">
    <div class="title">
      <h1>History from the Bottom Up</h1>
    </div>
    <div class="video">
      <iframe width="350" height="197" src="https://player.vimeo.com/video/194912012?title=0&byline=0&portrait=0" style="position:absolute;top:0;left:0;width:100%;height:100%;" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
    </div>
    <div class="caption">The Making of The Vanport Mosaic Festival</div>
    <br>
    <!-- <a @click="openMedia('https://www.youtube.com/watch?v=3qyhgV0Zew0')">Open Media</a>
    <VideoLightBox></VideoLightBox> -->
    <Accordion :open="false">
      <h3 slot="header">legends</h3>
      <div class="flex">
      </div>
    </Accordion>
    <br>

    <p></p>
    <br>
        <Accordion :open="false">
          <h3 slot="header">sources</h3>
          <div class="flex">
            <div>
            </div>
          </div>
        </Accordion>

      <p></p>

  </div>
  </template>
  <style scoped>
  .flex {
    display: flex;
    flex-direction: column;
  }
  .flex div {
    display: flex;
    align-items: center;
    margin-bottom: 0.5em;
  }
  .flex img {
    margin-right: 0.5em;
  }
  </style>
<script>
import AppLightBox from '../../components/AppLightBox.vue'
import Accordion from '../../components/Accordion.vue'
import VideoLightBox from '../../components/VideoLightBox.vue'
import MediaLightBox from '../../components/MediaLightBox.js'
export default {
  name: 'MegaregionVanportMosaic',
  components: {
    Accordion,
    AppLightBox,
    VideoLightBox
  },
  data: function () {
    return {
      megaImages: [
        {
          src: 'images/CascadiaMegaregionFullsize.jpg'
        }
      ]
    }
  },
  methods: {
    openMedia (url) {
      const mediaBox = new MediaLightBox(url)
      mediaBox.open()
    }
  }
}
</script>
