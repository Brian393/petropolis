<template>
  <div class="aside-content">
    <div class="title">
      <h1>Land Acknowledgement</h1>
    </div>
    <img src="images/falls.jpg" class="fullwidth">
    <br>
    <div class="caption">many languages are spoken here</div>
    <br>

    <p></p>

    <p></p>

    <p></p>

    <p></p>
<br>

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
  name: 'WatershedAcknowledgement',
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
