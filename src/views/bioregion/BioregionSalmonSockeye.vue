<style scoped>
.video {
position: relative; padding-bottom: 56.25%; height: 0;
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
      <h1>How it used to be</h1>
    </div>
    <div class="video">
      <iframe width="350" height="197" src="https://www.youtube.com/embed/xs5JGVFzKOY?&amp;autoplay=1&amp;mute=1&amp;loop=1&amp;playlist=xs5JGVFzKOY" frameborder="0" allow="autoplay; encrypted-media; loop" allowfullscreen></iframe>
    </div>
    <div class="caption">Sockeye salmon at Katmai Park in Alaska</div>

      <p>Sockeye salmon in the river have a beautiful two-tone gloss, with a bright red body and a mottled green head. The name comes from <em>suk-kegh</em>, which simply means "red fish" in Halkomelem, a Coast Salish language. In the southern half of their range (which almost perfectly fills the outline of Cascadia), Sockeye can spend up to two years rearing in freshwater before their ocean migration, which can last up to four years. Further north in mainland Alaska, the fish leave for the ocean right away.</p>

      <p>Unfortunately for the Sockeyes, the early twentieth-century canning industry was built around them, and they remain highly attractive to sport fishermen. Unlike most other salmon, Sockeye also spawn in lakes (and there is a distinc variety, known as the Kokanee, which remain in lakes and undertake no ocean migration). In the Pacific, the Snake River and Ozette Lake Sockeye are listed by the EPA as Endangered. Eleven populations in the Fraser River Basin and eleven more in the Columbia, as well as two in the Salish Sea, have gone extinct. In a situation comparable to that of the Chinook, as many as fifty populations face a high risk of extinction in the Columbia River Basin.</p>

      <p>Find out where they live on the map, because they need your help in the real world.</p>

    <br>
    <Accordion>
      <h3 slot="header">Sources</h3>
      <p>The data used here record any stream reach where the species has been observed over the past three decades, and therefore cover much more territory than NOAA's "critical habitat." As with the NOAA data, there is much more informaion here than is currently captured by the map:</p>
      <p><a href="https://www.streamnet.org/data/interactive-maps-and-gis-data/" target="_blank" rel="nofollow"> StreamNet Generalized Fish Distribution, All Species Combined</a></p>
      <p>Information on Endangered Species Act status is provided by NOAA:</p>
      <p><a href="https://www.westcoast.fisheries.noaa.gov/protected_species/salmon_steelhead/salmon_and_steelhead_listings/salmon_and_steelhead_listings.html" target="_blank" rel="nofollow">West Coast Salmon & Steelhead Listings</a></p>
      <p>Finally, a wealth of knowledge about salmon can be found in two impressive books published by Ecotrust, including detailed maps of their historic and present spawning ranges, their extinction risk and the many problems that wild salmon face (from dams, logging, agriculture, overfishing, fish farms and hatcheries):
      <p>&mdash;<a href="https://ecotrust.org/publication/salmon-nation" target="_blank" rel="nofollow">Salmon Nation: People, Fish and Our Common Home</a>, edited by Edward C. Wolf and Seth Zuckerman, published in Portland by Ecotrust, 1999/2003.</p>
      <p>&mdash;<a href="http://www.stateofthesalmon.org/atlas/" target="_blank" rel="nofollow">Atlas of Pacific Salmon</a>, by Xanthippe Augerot, with cartography by Charles Steinback and photography by Natalie Fobes, co-published by University of California Press and State of the Salmon, a joint project of the Wild Salmon Center and Ecotrust.</p>
    </Accordion>
    <br>

<p></p>
<br>

<Accordion>
  <h3 slot="header"></h3>
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
  name: 'BioregionSalmonSockeye',
  components: {
    Accordion,
    AppLightBox
  }
}
</script>
