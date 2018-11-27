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
    <div class="title"><h1>Fish of plenty</h1></div>
    <img src="images/PinkSalmon.png" class="fullwidth">
    <br>
    <div class="caption">Pink salmon fry</div>
    <br>
    <Accordion :open="false">
      <h3 slot="header">legends</h3>
      <div class="flex">
        <img src="images/Pink_Salmon.png" class="fullwidth">
      </div>
    </Accordion>
    <br>

      <p>Pink salmon have a colorful spotted skin with a medial dividing line and an impressive hump when spawning. They are the smallest of the salmon varieties found in Cascadia, and the most common. Like chum, they favor coastal rivers and creeks and spend very little time in fresh water. However, they do not undertake long migrations and they return to fresh water after only two years at sea. For a long time they were considered an inferior fish, judged inedible by some, which was probably not so bad fom a pink perspective! Needless to say, those times have changed.</p>

      <p>Fishermen or not, canneries or not, pinks are on the rise. There is no threatened or endangered population listed by the EPA, although a significant risk of extinction is faced by 6% of the genetic groups in the Fraser River Basin, 11% in the Salish Sea and 34% in the Vancouver Island Coastal Current, according to the <em>Atlas Of Pacific Salmon</em>. Some scientists worry that recent increases in the pink population pose a threat to other fish, simply through pressure on the food supply. With all the troubles the world faces, let's say an abundance of pink salmon might be a good thing.</p>
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
  name: 'BioregionSalmonPink',
  components: {
    Accordion,
    AppLightBox
  }
}
</script>
