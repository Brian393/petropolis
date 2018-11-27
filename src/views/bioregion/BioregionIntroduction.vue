<style scoped>
.caption {
text-align: center; font-style: italic; margin-top:5px;
}
.quote {
font-weight: bold; font-style: italic; color: #333333;
}
.justify {
text-align: justify;
}
</style>

<template>
  <div class="aside-content">
    <div class="title"><h1>The oldest new idea</h1></div>
    <img src="images/SolDucRainbow.jpg" class="fullwidth">
    <br>
    <div class="caption">Falling water, Olympic Peninsula</div>
    <br>
    <Accordion :open="false">
      <h3 slot="header">legends</h3>
      <div class="flex">
        <p></p>
      </div>
    </Accordion>
    <br>

<p class="quote">"Living-in-place means following the necessities and pleasures of life as they are uniquely presented by a particular site.... Reinhabitation means learning to live-in-place in an area that has been disrupted and injured through past exploitation."</p>

<p>With these words, Peter Berg and Raymond Dasmann invented bioregionalism. They conceived it not as starting fresh but as returning to things forgotten, with an awareness of past mistakes and a particular respect for the earliest inhabitants of North America. That was forty years ago. The inspiration was poetic, scientific and political.</p>

<p>Today, the Cascadia bioregion is a vast and diffuse idea that calls attention to the entangled destinies of natural environments and human beings. Thanks to the cartography of <a href="http://cascadia-institute.org" target="_blank" rel="nofollow">David McCloskey</a>, the outline of Cascadia is recognized across national boundaries. Some movements call for its independence. But for everyone, interdependence is the crucial thing.</p>

<p>It's clear that the subtlest and most powerful contributions to Cascadia come from indigenous peoples. Their treaty rights and assertion of traditional practices bring them to negotiating tables where the fate of land and water is decided. Often they invoke the needs of non-human species. Listen to the words of Native American activist <a href="http://billyfrankjr.org" target="_blank" rel="nofollow">Billy Frank Jr.</a>, who lived along the banks of the Nisqually River:</p>

<p class="quote">"I believe in the sun and the stars, the water, the tides, the floods, the owls, the hawks flying, the river running, the wind talking. They’re measurements. They tell us how healthy things are. How healthy we are. Because we and they are the same."</p>

<p>How to become more sensitive to the places we inhabit? How to express this living-in-place to others? Here's another idea from Peter Berg and Raymond Dasmann:</p>

<p class="quote">"There is a distinct resonance among living things and the factors which influence them... Discovering and describing that resonance is the best way to describe a bioregion."</p>

<p>This section of the map tries to feel a pathway through various new-old territories, exploring resonant encounters and modes of reinhabitation. The point is not so much to depict a utopia as to discover and describe a process, while attending to the conflicts and divergences that real encounters bring. No attempt has been made here to avoid science, technology, politics, capitalism or least of all, the emergent bioregional state. But where Megaregion presents itself as a destiny, Bioregion is clearly a search for a different way of living.</p>

<br>

<Accordion>
  <h3 slot="header">sources</h3>
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
  name: 'BioregionIntro',
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
