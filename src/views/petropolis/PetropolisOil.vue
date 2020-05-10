<template>
  <div class="aside-content">
    <div>
    <p><br><img id="sidepanel-image" src="icons/LegendOil1.png" class="fullwidth"><br><br></p></div>
      <div id="feature-content">
      <div class="caption"></div>
      <p style="font-size:120%;"><strong><em>This map shows the major pipeline infrastructures of the United States. From wellheads, platforms, ports and railway loaders, crude oil is piped to refineries that produce gas, diesel, kerosene, jet fuel, asphalt, petcoke and vast quantities of CO2.</em></strong></p>
      <p>Click on any pipeline for information. The link "View Whole Feature" will isolate a single line, while displaying the information in the sidebar. Further links in the text give more details. For a deeper look into the US petroleum complex, hit the "Industry" button at bottom center. And for the global extent of oil-processing technologies, click "World."
      <p>Additional maps of coal and natural gas installations can be accessed with the buttons at lower left. They too offer simplified diagrams, full-industry coverage and global extent. The idea is to show both the logical structure and the material reality of fossil-fuel technologies. Their operations span the world. As it stands today, everywhere is Petropolis.</p>

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
