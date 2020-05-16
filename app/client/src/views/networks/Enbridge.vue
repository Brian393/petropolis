<template>
  <div class="aside-content">
    <div>
      <div class="title">
      <h1><span style="font-align: center;">Legend</span></h1></div>
    <p><img id="sidepanel-image" src="icons/LegendOil1.png" class="fullwidth"><br><br></p></div>
      <div id="feature-content">
      <div class="caption"></div>
      <p style="font-size:120%;"><strong><em>XXXXXX</p>
      <p style="font-size:120%;"><strong><em>XXXXXX</p>
      <p style="font-size:120%;"><strong><em>XXXXXX</p>

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
