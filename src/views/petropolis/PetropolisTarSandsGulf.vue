<template>
  <div class="aside-content">
    <div>
      <br><br><h3 style="color:#E00607; font-size:130%; text-align: center;">We Don't Need More Dirty Oil</h3><br><br>
    </div>
    <img src="images/NoTarSands.jpg" class="fullwidth"><div class="caption"></div><br>

    <p><strong></strong></p>

    <p></p>

    <p></p>

    <p></p>

<br>
<Accordion :open="false">
  <h3 slot="header">legend</h3>
  <div class="flex">
    <p><strong>coming soon</strong></p>
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
