<template>
  <div class="aside-content">
    <div>
      <br><br><h2>This Is Your Car on Tar Sands</h2><br><br>
    </div>
    <img src="images/TarSandsMining.jpg" class="fullwidth"><div class="caption"></div><br>

    <p><strong></strong></p>

    <p></p>

    <p></p>

    <p></p>

<br>
<Accordion :open="false">
  <h3 slot="header">who/why/how</h3>
  <div class="flex">
    <p><strong></strong></p>
  </div>
</Accordion>

  </div>
</Accordion>

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
  name: 'PetropolisTarSands',
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
