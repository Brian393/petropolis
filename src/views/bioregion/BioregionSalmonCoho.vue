<style scoped>
.video {
position: relative; padding-bottom: 74.88%; height: 0;
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
      <h1>This is the moment</h1>
    </div>
    <div class="video">
      <iframe width="350" height="197" src="https://www.youtube.com/embed/OpiVM1yZuHs?&amp;autoplay=1&amp;mute=1&amp;loop=1&amp;playlist=OpiVM1yZuHs" frameborder="0" allow="autoplay; encrypted-media; loop" allowfullscreen></iframe>
    </div>
    <div class="caption">Coho salmon on Eagle Creek</div>
    <br>
    <Accordion :open="false">
      <h3 slot="header">legends</h3>
      <div class="flex">
        <img src="images/Coho_Salmon.png" class="fullwidth">
      </div>
    </Accordion>
    <br>

<p>Coho are hailed as "silver salmon" by those who encounter them on the sea, but to their admirers on land, returning spawners present an impressive mix of splotchy red and dark bluish-green colorations. Coho favor coastal streams where they gather in small, dense populations, reaching up all the way out to the Cascades. River by river and brook by brook, the entire coastline is coho country. Inland, the fish maintain a tenacious but highly threatened presence on the Columbia mainstem up to Wells Dam.</p>

<p>Not all the populations you will meet are thriving. The Lower Columbia Coho, along with the Oregon Coast and Southern Oregon/Northern California Coast Coho are listed by the EPA as endangered species. Two percent of the Skeena River Basin populations of northern BC, 2% more of the Klamath Coho, 13% of the Columbia and 26% of the Salish Sea populations have gone extinct. Large inland spawning ranges, once extending to much of eastern Washington and Oregon, Idaho, and as far as Montana, have entirely disappeared. Humans love to settle along the coast on the cohos' remaining habitat. Think of them before you bulldoze that hillside, dump that weedkiller or dam that stream.</p>
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
  name: 'BioregionSalmonCoho',
  components: {
    Accordion,
    AppLightBox
  }
}
</script>
