<template>
  <div class="aside-content">
    <div class="title">
      <h1>Acknowledgement<br>of land and language</h1>
    </div>
    <img src="images/falls.jpg" class="fullwidth"><div class="caption">first name still unknown</div>

    <p><br><audio controls><source src='audio/Acknowledgement.mp3' type='audio/mpeg'> Your browser does not support the audio element.</audio><br><br></p>

    <p><strong>We begin with respect:</strong></p>

    <p>All the land that is now called North America was inhabited for thousands of years before the European colonizers came. Now it's time to remember and to recognize the original inhabitants.</p>

    <p>Ancient tongues gave names to these hills, these mountains, these rivers, these waterfalls too, long in advance of modern English.</p>

    <p>In this atlas we will name many places, to tell stories about the Columbia River and Cascadia. But the first map names the Indigenous languages of this land, to give at least some idea of where they were spoken, and by whom.</p>

    <p>Are there foreign tongues in the place you call home? Is English a foreign tongue in the place you call home?</p>

    <p>The tragedies of colonization stole the languages from the land and left many of the traditions sleeping. Today we must remember war, plunder and millions of deaths from disease, along with ongoing prejudice, inequality and ecological devastation. Yet a great awakening is underway. Freed from within, by their own efforts, new generations of Indigenous people are finding the words of their ancestors, to revive intimate memories and accomplish an urgent transformation in the stewardship of the territory. It is this that deserves great respect.</p>

    <p>All whose forebears crossed the seas, or were forced to the crossing, can lend their hands to make a change in this new and dangerous era.</p>

    <p>Those who speak the modern tongues, may you learn to honor the ancient ones. Those who want to see the earth survive the long history of colonization, may you now raise your voices.</p>
<br>
<Accordion :open="false">
  <h3 slot="header">sources of this map</h3>
  <div class="flex">
    <p>Language locations: <a href="https://native-land.ca">native-land.ca</a>.<br><br>Further information: <a href="http://www.native-languages.org">native-languages.org</a>.<br><br>World Physical Map: <a href="http://server.arcgisonline.com/arcgis/rest/services/World_Physical_Map/MapServer">Esri/US National Park Service</a>.</p>
  </div>
</Accordion>

<Accordion :open="false">
  <h3 slot="header">authorship of this atlas</h3>
  <div class="flex">
    <p><strong>Brian Holmes</strong>: concept, cartography, text<br><br><strong>Mack McFarland</strong>: curation, outreach<br><br><strong>edward sharp</strong>: programming in Vue<br><br><strong>Jodi Darby</strong>: video interviews<br><br><strong>Claire Pentecost</strong>: title</p>
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
