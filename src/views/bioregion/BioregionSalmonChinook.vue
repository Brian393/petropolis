<style scoped>
.video {
position: relative; padding-bottom: 56.3%; height: 0;
}
.video iframe {
position: absolute; top: 0; left: 0; width: 100%; height: 100%;
}
.quote {
font-weight: bold; font-style: italic; color: #333333;  text-align: center;
}
.quote-2 {
font-weight: bold; font-style: italic; color: #333333;
}
</style>

<template>
  <div class="aside-content">
    <div class="title">
      <h1>Fins to the mountains</h1>
    </div>
    <div class="video">
      <iframe width="350" height="197" src="https://player.vimeo.com/video/44999906?background=1" style="position:absolute;top:0;left:0;width:100%;height:100%;" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
    </div>
    <div class="caption">Chinook Salmon at Dagger Falls, Idaho<br>&mdash;video by Gary O. Grimm, <a href="https://vimeo.com/44999906">here</a>&mdash;</div>
    <br>
    <Accordion :open="false">
      <h3 slot="header">legends</h3>
      <div class="flex">
        <img src="images/Chinook_Salmon.png" class="fullwidth">
      </div>
    </Accordion>
    <br>

      <p>Chinook, also known as "king salmon," are found across Cascadia, with a particularly broad range in Alaska and also on Russia's Kamchatka Peninsula. Here we focus on the Salmon River Mountains of Idaho, far into the interior of Cascadia, where a reduced number of chinook still make it over the dams to spawn.</p>

      <p>Roll the mouse across the map to discover where chinook have been seen over the last three decades. Maybe you know some of these places? Find the streams where they still spawn, and trace their survival lines back through the Columbia to the ocean. Notice the precise spot on the Snake River where the migration of the chinook stops suddenly short. Some people want those Snake River dams to come down.</p>

      <p>Two populations spawning in Cascadian waters, the Puget Sound Chinook and the Upper Columbia River spring-run Chinook, are currently listed by the EPA as endangered species. Four other populations returning to the Columbia River Basin are listed as threatened. As we are reminded by the <em>Atlas of Pacific Salmon</em>, 8% of the populations in the Fraser River Basin, 7% in the Salish Sea, 2% on Vancouver Island, 6% in the Klamath River Basin and 33% of the chinook populations in the Columbia Basin have already gone extinct. Those Snake River dams, in particular, have been devastating for the chinooks.</p>
<br>

<Accordion>
  <h3 slot="header">sources</h3>
  <p>The data used here record any stream reach where the species has been observed over the past three decades, and therefore cover much more territory than NOAA's "critical habitat." As with the NOAA data, there is much more informaion here than is currently captured by the map:</p>
  <p><a href="https://www.streamnet.org/data/interactive-maps-and-gis-data/" target="_blank" rel="nofollow"> StreamNet Generalized Fish Distribution, All Species Combined</a></p>
  <p>Information on Endangered Species Act status is provided by NOAA:</p>
  <p><a href="https://www.westcoast.fisheries.noaa.gov/protected_species/salmon_steelhead/salmon_and_steelhead_listings/salmon_and_steelhead_listings.html" target="_blank" rel="nofollow">West Coast Salmon & Steelhead Listings</a></p>
  <p>Finally, a wealth of knowledge about salmon can be found in two impressive books published by Ecotrust, including detailed maps of their historic and present spawning ranges, their extinction risk and the many problems that wild salmon face (from dams, logging, agriculture, overfishing, fish farms and hatcheries):
  <p>&mdash;<a href="https://ecotrust.org/publication/salmon-nation" target="_blank" rel="nofollow">Salmon Nation: People, Fish and Our Common Home</a>, edited by Edward C. Wolf and Seth Zuckerman, published in Portland by Ecotrust, 1999/2003.</p>
  <p>&mdash;<a href="http://www.stateofthesalmon.org/atlas/" target="_blank" rel="nofollow">Atlas of Pacific Salmon</a>, by Xanthippe Augerot, with cartography by Charles Steinback and photography by Natalie Fobes, co-published by University of California Press and State of the Salmon, a joint project of the Wild Salmon Center and Ecotrust.</p>
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

export default {
  name: 'BioregionSalmonChinook',
  components: {
    Accordion,
    AppLightBox
  }
}
</script>
