<template>
  <div class="aside-content">
    <div>
      <div class="title">
      <h1><span style="font-align: center;">Legend</span></h1></div>
    <p><img id="sidepanel-image" src="icons/LegendOil2.png" class="fullwidth"></p></div>
      <div id="feature-content">
      <div class="caption">* these features appear when you zoom in></div>
      <p style="font-size:120%;"><strong><em>Here you find the entire petroleum extraction industry, right up to the point where refineries turn crude into gasoline. It's the truth of our daily commutes. There's too much to see at once, so you'll have to go deeper in.</em></strong></p>
      <p>For information, click on any line or marker. The locations of most pipelines are approximate, but other features such as refineries are quite accurate. When you click on the icons, a popup appears. If you hit "Dive," the map will plunge downward while a spotlight opens up, displaying aerial imagery to let you see exactly what's on the ground. You can control the size of the spotlight, or get rid of it entirely, by using the up/down arrows on your computer keyboard.</p>
      <p>The buried infrastructure of Petropolis was long in the making. Once you know how the energy system works, you can start imagining another one.</p>

<br>
<Accordion :open="false">
  <h3 slot="header">sources</h3>
  <div class="flex">
    <p>Coming...</p>
  </div>
</Accordion>

  </div>
</Accordion>

  </div>
</Accordion>

  </div>
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
  name: 'PetropolisOil',
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
