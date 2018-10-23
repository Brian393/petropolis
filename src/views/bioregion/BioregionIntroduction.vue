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
    <div class="title"><h1>Bioregional turn</h1></div>
    <img src="images/Cascade.jpg" class="fullwidth">
    <br>
    <div class="caption">Falling water, Olympic Peninsula</div>
    <br>
    <Accordion :open="false">
      <h3 slot="header">Work in progress!</h3>
      <div class="flex">
        <p>Check back after November 1 and the whole concept will be a lot clearer...</p>
      </div>
    </Accordion>
    <br>

<p class="quote">"Living-in-place means following the necessities and pleasures of life as they are uniquely presented by a particular site.... Reinhabitation means learning to live-in-place in an area that has been disrupted and injured through past exploitation."</p>

<p>With these words, Peter Berg and Raymond Dasmann launched bioregionalism. They conceived it not as starting fresh but as returning to things forgotten, with an awareness of past mistakes and a particular respect for the earliest inhabitants of North America. The time was forty years ago. The inspiration was poetic, scientific and intensely political.</p>

<p>Today, the Cascadia bioregion is a vast and diffuse idea that calls attention to the entangled destinies of natural environments and human beings. Thanks largely to the cartography of <a href="http://cascadia-institute.org" target="_blank" rel="nofollow">David McCloskey</a>, the outline of Cascadia is recognized across national boundaries. Some movements call for its independence. For others, interdependence is the crucial thing.</p>

<p>It's clear that the most powerful contributions to Cascadia come from indigenous peoples. Their assertion of traditional practices brings them to negotiating tables where the fate of land and water is decided. Often they invoke the needs of non-human species. Listen to the words of Native American activist <a href="http://billyfrankjr.org" target="_blank" rel="nofollow">Billy Frank Jr.</a>, who lived along the banks of the Nisqually River:</p>

<p class="quote">"I believe in the sun and the stars, the water, the tides, the floods, the owls, the hawks flying, the river running, the wind talking. They’re measurements. They tell us how healthy things are. How healthy we are. Because we and they are the same."</p>

<p>How to become more sensitive to the places we inhabit? Here's another idea from Peter Berg and Raymond Dasmann:</p>

<p class="quote">"There is a distinct resonance among living things and the factors which influence them... Discovering and describing that resonance is the best way to describe a bioregion."</p>
<br>

<Accordion>
  <h3 slot="header">sources</h3>
</Accordion>

</div>
</template>

<script>

export default {
  name: 'BioregionIntroduction'
}
</script>
