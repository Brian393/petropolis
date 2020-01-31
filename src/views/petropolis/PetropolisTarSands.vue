<template>
  <div class="aside-content">
    <div>
      <br><br><h3 style="color:#E00607; font-size:130%; text-align: center;">Tar Sands Is Climate Crime</h3><br><br>
    </div>
    <div class="video">
      <iframe width="350" height="230" src="https://www.youtube.com/embed/Fy8TC4UZhXw?&ampmodestbranding=1&amp;autoplay=1&amp;autohide=1&amp;mute=1&amp;loop=1&amp;playlist=Fy8TC4UZhXw" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
    </div>
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
