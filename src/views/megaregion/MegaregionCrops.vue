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
      Center-pivot irrigation on the Columbia Plateau
    </div>
    <br>

        <Accordion :open="false">
          <h3 slot="header">legends</h3>
          <div class="flex">
              <h3>Crops by frequency</h3>
                <img src="images/CropKey.png" class="fullwidth">
          </div>
        </Accordion>

      <p>Winter wheat is the most common crop on this map, shown in dark brown. It's typically cultivated without irrigation on fields that may receive less than 6 inches of rain a year. However, the majority of crops in the region require intensive irrigation, using water sourced from reservoirs and wells, or in many cases, directly from the rivers. Irrigation has made the desert bloom&mdash;at industrial scale.</p>

      <p>Any crop whose footprint appears as a circle is irrigated with a center-pivot system like the one pictured above. Other techniques such a drip lines or conventional sprinklers are frequently employed. A glance at the map shows that the highly valuable inland agriculture of Washington, Oregon and Idaho hugs close to the Columbia River and its tributaries, particularly <span class="link" @click="emit('set-map-view', {center: [-114.8, 43.5], resolution: 650})">the Snake.</span> All this irrigated agriculture bears witness to an immense transformation of the land, driven largely by the dam-building campaigns of the US Bureau of Reclamation.</p>

      <p>To understand the scale and scope of the Bureau's activity on the Columbia River, click the button entitled Columbia Basin Project at the bottom of the page.</p>

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

import {eventBus} from '../../main'

export default {
  name: 'MegaregionCrops',
  components: {
    Accordion,
    AppLightBox
  },
  methods: {
    emit: function (method, args) {
      eventBus.$emit(method, args)
    }
  }
}
</script>
