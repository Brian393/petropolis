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
    <div class="title"><h1>Gift of the sea</h1></div>
    <img src="images/DeadChum.jpg" class="fullwidth">
    <br>
    <div class="caption">Chum salmon brings ocean nutrients to the forest</div>
    <br>
    <Accordion :open="false">
      <h3 slot="header">legends</h3>
      <div class="flex">
        <img src="images/Chum_Salmon.png" class="fullwidth">
      </div>
    </Accordion>
    <br>

<p>Chum have the widest range, with strong populations along the Pacific Coast from California to the Kamchatka Peninsula, plus a highly unusual though more limited presence on the Arctic coasts of both North America and Russia. Also known as "dog salmon," the fish display an unforgettable green, dark green and purple patterning during spawning season. In Southern Cascadia, chum are mostly found around the Salish Sea, as well as in the coastal zones on either side of the Columbia River Estuary.</p>

<p>Like all salmon, chum feed extensively on tiny drifting crustaceans called copepods while at sea, and when they die on inland streams after spawning they bring the gift of the ocean's nutrients back to the land. Perhaps some coloristic connection with autumn leaves allows us to recognize the value of rotting chum along the streamside. Death becomes the life of others. How could human beings accomplish so little and so much?</p>

<p>Both the Hood Canal and the Columbia River populations of chum are listed by the EPA as Threatened. Twenty-two percent of the chum populations in the Salish Sea have gone extinct, and yet surprisingly, only two percent have disappeared from the Columbia River Basin. The fish used to make it a short way up the Snake River, but they now stop short at the Bonneville Dam. However, the <em>Atlas of Pacific Salmon</em>, published in 2005, puts 67% of the Columbia River chum communities at moderate risk of extinction, and 33% at high risk. You will know things are getting better when large numbers of chum start returning to the Columbia.</p>
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
  name: 'BioregionSalmonChum',
  components: {
    Accordion,
    AppLightBox
  }
}
</script>
