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
    <br>
    <Accordion :open="false">
      <h3 slot="header">legends</h3>
      <div class="flex">
        <img src="images/Sockeye_Salmon.png" class="fullwidth">
      </div>
    </Accordion>
    <br>

      <p>Sockeye salmon are also known "reds." Their name comes from <em>suk-kegh</em>, which simply means "red fish" in Halkomelem, a Coast Salish language. In the river they show off a beautiful two-tone coat, with a bright red body and a mottled green hood. In the southern half of their range (which almost perfectly matches the borders of Cascadia), sockeye salmon can spend up to two years rearing in fresh water. Further north in mainland Alaska, the smolts leave for the ocean right away. In that case their migration can last up to four years.</p>

      <p>Unlike most other salmon, sockeye also spawn in lakes. There is even a distinct variety, known as the kokanee, which stay in the lakes and undertake no ocean migration.</p>

      <p>Unfortunately for the sockeyes, the early twentieth-century canning industry was built around them, and they remain highly attractive to sport fishermen. In the Pacific Northwest, the Snake River and Ozette Lake Sockeye are listed by the EPA as endangered. Eleven percent of the populations in the Fraser River Basin and 11% more of those in the Columbia have gone extinct, as well as 2% of the Salish Sea populations. In a situation comparable to that of the chinook, as many as half the sockeye communities face a high risk of extinction in the Columbia River Basin.</p>

      <p>Trace their migration up the Columbia to the Okanogan River Valley, where the construction of the great storage dams almost wiped them out in the late twentieth century. Today after major restoration of the environment and sustained tribal efforts to bring them back, sockeye are again found in Okanogan Lake. See where they live near you, because they undoubtedly need help there too.</p>

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
