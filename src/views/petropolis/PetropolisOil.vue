<template>
  <div class="aside-content">
    <div>
      <div class="title">
      <h1><span style="font-align: center;">Legend</span></h1></div>
    <p><img id="sidepanel-image" src="icons/LegendOil1.png" class="fullwidth"><br><br></p></div>
      <div id="feature-content">
      <div class="caption"></div>
      <p style="font-size:120%;"><strong><em>What you see are the major pipeline infrastructures of the United States. From wellheads, platforms, ports and railway loaders, crude oil is piped to refineries that produce gas, diesel, kerosene, jet fuel, asphalt, petcoke and vast quantities of CO2.</em></strong></p>
      <p>This map is full of information. Click on any pipeline for a popup with the details. At the bottom of the popup, "View Whole Feature" allows you to isolate a single line. If you want to move to your own location, click the little blue button at the upper left corner of the screen, beneath the +/- zoom controls. When you go in closer, names and locations appear.
      <p>For a more complete look at the US petroleum complex, hit the "Industry" button at bottom center. There you will find the larger systems that the pipeliness feed. For the global extent of oil-processing technologies, click "World." It's hard to believe what human beings have created on this earth.</p>
      <p>Additional maps of coal and natural gas installations can be accessed with the buttons at lower left. They too offer simplified diagrams, full-industry coverage and global extent. The idea is to show both the logical structure and the material reality of fossil-fuel technologies. Their components span the world. As it stands today, everywhere is Petropolis.</p>

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
