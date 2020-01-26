<style scoped>
.video {
position: relative; padding-bottom: 74.88%; height: 0;
}
.video iframe {
position: absolute; top: 0; left: 0; width: 100%; height: 75%;
}
</style>
<template>
  <div class="aside-content">
    <div>
      <br><br><h3 style="color:#E00607; font-size:140%; text-align: center;">Emergency in Petropolis!</h3><br><br>
    </div>
    <div class="video">
      <iframe width="350" height="300" src="https://www.youtube.com/embed/-oFmCNjgfUM?&ampmodestbranding=1&amp;autoplay=1&amp;autohide=1&amp;mute=1&amp;loop=1&amp;playlist=-oFmCNjgfUM" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
    </div>

    <p style="font-size:180%; font-weight: 900;">OUR DEMANDS</p>

<p><h1>01</h1></p>
<p><h2>TELL THE TRUTH…</h2><br>Government must tell the truth by declaring a climate and ecological emergency, working with other institutions to communicate the urgency for change.</p>

<p><h1>02</h1></p>
<p><h2>ACT NOW</h2><br>Government must act now to halt biodiversity loss and reduce greenhouse gas emissions to net zero by 2025.</p>

<p><h1>03</h1></p>
<p><h2>BEYOND POLITICS</h2><br>Government must create and be led by the decisions of a People’s Assembly on climate and ecological justice.</p>

<p><h1>04</h1></p>
<p><h2>JUST TRANSITION</h2><br>We demand a just transition that prioritizes the most vulnerable people and establishes indigenous sovereignty; establishes reparations and remediation led by and for Black people, Indigenous people, people of color and poor communities for years of environmental injustice, establishes legal rights for ecosystems to thrive and regenerate in perpetuity, and repairs the effects of ongoing ecocide to prevent extinction of humanity and all species, in order to maintain a livable, just planet for all.</p>

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
