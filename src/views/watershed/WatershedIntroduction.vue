<template>
  <div class="aside-content">
    <div class="title">
      <h1>Outside in</h1>
    </div>
    <img src="images/waterbody.png" class="fullwidth">
    <br>
    <div class="caption">Does the territory inhabit you?</div>
    <br>
    <Accordion :open="false">
      <h3 slot="header">Welcome</h3>
      <div class="flex">
        <p>This is a work in progress. It's full of insights, but also gaps, errors and hidden prejudices or distortions that the authors cannot see. You're welcome to enjoy it and to help make it better. If you'd like to see something here, or have comments or critiques or a revelation to share, just send a message to learningfromcascadia AT gmail.com.</p>
      </div>
    </Accordion>
    <br>

    <p>The Columbia Gorge is one of the most beautiful sights on earth. But a watershed is more than a beautiful view.</p>

    <p>The Columbia River watershed is a far-flung territory including parts of six US states and one Canadian province. Its border is traced, not by governments or treaties, but by every drop of liquid that finds a common path to the ocean.</p>

    <p>Rainfall washes over forested slopes and grassy plains. Snow and ice collect on mountain peaks. Dew glistens on high deserts. Groundwater bubbles up from artesian springs. Pools spill over into rivulets that become creeks and gushing torrents, before rejoining rivers that gradually converge into a powerful flood. A watershed is defined by endless circulation through a territory. What it takes from the clouds, it gives back to <span class="link" @click="emit('set-map-view', {center: [-123.435, 46.213], resolution: 120})">the sea</span>.</p>

    <p>Human bodies are up to 60% water. We too are part of the shed, along with other living species. What we do outside ourselves inevitably seeps back in.</p>

    <p>This map is about political ecology. It suggests that human decisions are shaped by exterior realities that have always already gotten under our skin. Like most maps, this one will guide you to real and imaginary places. It will deliver loads of information, with a wealth of topographical detail that increases as you zoom in. It will also show you texts and images, and it will even talk to you via multimedia recordings. The aim is to provide multiple viewpoints on reality. It's an experiment in collective perception.</p>

    <p>The main sections are accessed through the navigational bar at the top, while specific locations and themes are reached by the panel at lower left. Sometimes further buttons appear at the bottom of the map, to take you through more complex stories. When in doubt, just click on any word or marker or object that you see, and there's a good chance it will reveal something.</p>

    <p>Watershed is a scientific category that provides the frame for citizen activism and advocacy. Two riskier and more speculative headings also appear: Megaregion and Bioregion. They're like the red and the blue pill. Which one will you choose? Which one is which?</p>

    <p>This project has been made using public research and open-source software, with generous contributions from a growing list of local organizations and inhabitants. Legends for each map can be found at the top of the text column. Sources and collaborators are identified at the end. Pages will be added as new possibilities emerge. The whole thing has been coordinated by a Portland-based artist and curator, Mack McFarland, and by an inquisitive stranger, Brian Holmes, who came to the Pacific Northwest with the quixotic hope of "Learning from Cascadia."</p><br>

    <Accordion>
      <h3 slot="header">sources</h3>
    <p>This work is made with public data and free software. Code repository <a href="https://github.com/Brian393/ecotopia-today" target="blank">here</a>.</p>
    <p>Major sources for this page include:</p>
    <p>-- <a href="https://nhd.usgs.gov/NHDPlus_HR.html" target="_blank" rel="nofollow">National Hydrology Dataset</a></p>
    <p>-- <a href="https://www.arcgis.com/home/item.html?id=1b243539f4514b6ba35e7d995890db1d" target="_blank" rel="nofollow">Esri World Hillshade Layer</a></p>
    <p>-- <a href="https://www.fws.gov/wetlands/Data/Mapper.html" target="_blank" rel="nofollow">National Wetlands Inventory</a></p>
    <p>-- <a href="http://www.cec.org/tools-and-resources/map-files/land-cover-2010-landsat-30m" target="_blank" rel="nofollow">North American Land Cover Monitoring System</a></p>
    <p>-- <a href="https://www.openstreetmap.org" target="__blank">OpenStreetMap</a></p>
    <p>-- <a href="https://www.bing.com/maps/aerial" target="_blank" rel="nofollow">Bing Maps Aerial</a></p>
    <p>-- <a href="https://services.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer" target="_blank" rel="nofollow">National Geographic World Map</a></p>
    <p>-- <a href="https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer" target="_blank" rel="nofollow">USGS Topo Map</a></p>
    <p>These sources have been combined and put online using two amazing tools: <a href="https://www.qgis.org/en/site/" target="_blank" rel="nofollow">QGIS</a> and <a href="https://openlayers.org/" target="_blank" rel="nofollow">OpenLayers</a>.</p>
    <p>Thanks to all the creators of this fabulous stuff!</p>
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
  name: 'WatershedIntroduction',
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
