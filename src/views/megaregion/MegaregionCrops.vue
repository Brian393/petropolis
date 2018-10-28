<style scoped>
.tighter {
      letter-spacing: -1px;
  }
</style>

<template>
  <div class="aside-content">
    <div class="title">
      <div class="tighter"><h1>Water to the desert of the real</h1></div>
    </div>
      <img src=images/Irrigation.jpg class="fullwidth">
    <div class="caption">
      High-tension tower (<a href="http://www.pxleyes.com/photography-picture/4ca6f763f307c/High-voltage-tower.html" target="_blank" rel="nofollow">source</a>)
    </div>
    <br>

        <Accordion :open="false">
          <h3 slot="header">legends</h3>
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

export default {
  name: 'MegaregionCrops',
  components: {
    Accordion,
    AppLightBox
  },
  data: function () {
    return {
      megaImages: [
        {
          src: 'images/CascadiaMegaregionFullsize.jpg'
        }
      ]
    }
  }
}
</script>
