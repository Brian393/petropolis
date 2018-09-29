<style scoped>
.video {
position: relative; padding-bottom: 56.25%; height: 0;
}
.video iframe {
position: absolute; top: 0; left: 0; width: 100%; height: 100%;
}
.quote {
font-weight: bold; font-style: italic; color: #333333;
}
</style>

<template>
  <div class="aside-content">
    <div class="title">
      <h1>Planned city, planned disaster</h1>
    </div>
    <div class="video">
      <iframe width="350" height="300" src="https://www.youtube.com/embed/MJp5gA6a02Q?rel=0&amp;start=1027;autoplay=1&mute=1&amp;showinfo=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
    </div>
    <div class="caption">Vanport Flood</div>
    <br>

    <p>On May 30, 1948&mdash;a Memorial Day morning&mdash;residents of the workers' metropolis of Vanport received an official message slipped beneath their doors:</p>

    <div class="quote"><p>"Remember: Dikes are safe at present. You will be warned if necessary. You will have time to leave. Don't get excited."</p></div>

    <p>The Portland Housing Authority built the city for over forty thousand laborers who found employment in the nearby Kaiser shipyards during World War II. They came from across the state and the country, drawn by patriotism, high wages, modern living, and for some, relief from the racist violence of the South. But Portland itself was a "sundown town" that informally barred blacks from property ownership and permanent inhabitation, just as the state of Oregon had done by constitutional law at its foundation in 1859. Despite the good will of many, it has never been easy to change deply rooted institutional racism.</p>

    <p>On that Memorial Day morning in 1948, three years after war's end, the population of the vast housing complex had shrunk to about 18,500. Of these, some 6,300 were black. With the low point of the city situated fifteen feet below the normal level of the Columbia River, the threat to all the remaining migrants was obvious. Why didn't the Housing Authority take action?</p>

    <p>At 4:17 pm disaster struck. A railroad embankment separating Vanport from the inundated Columbia Slough gave way, as anyone could have predicted it would. The wall of water lifted entire buildings from the ground. Oregon's second largest city was entirely destroyed. When the floodwaters receded the official death toll stood at fifteen, with seven more missing. But trust in anything official had been broken. To this day, many believe the real toll was much much higher.</p>

    <p>Vanport&mdash;both the wartime city and the postwar flood&mdash;set the terms for racial coexistence in Portland, and more broadly, in the Pacific Northwest. The promise of an egalitarian society, offered and violently withdrawn, still characterizes the migrant experience. This is even true today for the black survivors of the flood, who settled in the nearby Albina neighborhood only to be driven away by the recent wave of gentrification. How long can the new Jim Crow continue?</p>

    <p>Yet the Vanport Flood has a second significance, with powerfully different consequences. In the years after 1948, during the negotiation of the Columbia River Basin Treaty with Canada, the flood was continually invoked as a justification for the construction of a fully integrated system of multipurpose dams. Celilo Falls, along with untold numbers of sites held sacred by their Native American inhabitants, would be flooded with the same waters that drowned the workers' metropolis. From Eugene Oregon to Vancouver BC, the bright lights of the Cascadian megaregion glitter against an historical background of raw coercive power, wielded over the destinies of beings both human and non-human.</p>

    <p>The flood tide of climate change advances, but remember just one thing. Dikes are safe at present. You will be warned if necessary. You will have time to leave. So don't get excited. Life in Vanport goes on.</p>

        <Accordion :open="false">
          <h3 slot="header">legends</h3>
          <div class="flex">
            <div>
              <img src="icons/coal.png">
              Coal-fired plant
            </div>
            <div>
              <img src="icons/dam.png">
              Hydroelectric dam
            </div>
            <div>
              <img src="icons/natgas.png">
              Natural gas generator
            </div>
            <div>
              <img src="icons/nukes.png">
              Nuclear plant
            </div><div>
              <img src="icons/wind.png">
              Wind turbine
            </div>
          </div>
        </Accordion>

      <p></p>

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
  name: 'MegaregionEnergy',
  components: {
    Accordion,
    AppLightBox
  },
  data: function () {
    return {
      megaImages: [
        {
          src: 'images/CascadiaMegaregionFullsize.jpg'
        }
      ]
    }
  }
}
</script>
