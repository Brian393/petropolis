<template>
  <div class="aside-content">
    <div>
    <div style="text-align: center;">
      <h1 style="color:#E00607; font-size:160%">before it's too late</h1>
    </div>
    <img src="images/OilHead.jpg" class="fullwidth"><div class="caption"></div>

    <p><strong></strong></p>

    <p style="font-size:120%;"><strong><em>From the Tars Sands to the Gulf of Mexico, the pipeline network pumps out a future of melting icecaps, sea-level rise, drought and forest fires. For the oilmen, every city is "Petropolis."</em></strong></p>

    <p>This map reveals the inner workings of Petropolis at the national, regional and local levels. It focuses on crude oil pipelines and refineries, but it also includes sections on coal and natural gas. To navigate through the different sections use the buttons at the lower left corner, and also at the bottom of each page in the center.</p>

    <p>Every feature delivers information at a click, and a visual legend can be accessed below the sidebar texts. Zoom in far enough and you'll actually see the refineries and generating plants, through a "spyglass" that opens up to a satellite image. The point is to build an awareness of fossil-fuel infrastructure and its damaging effects, while at the same time highlighting the many forms of critique, protest and political action that are spearheading an urgently needed change in our energy system&mdash;and in our society as a whole.</p>

    <p>The collapse of climate and ecosystems is accelerating. We are nearly out of time. Decades of protests, petitions and donations to environmental groups have done nothing to slow catastrophic change. Food and water shortages, resource wars, economic breakdown, and millions of new climate refugees are on the horizon. Human survival itself is at risk as temperatures continue to rise.</p>

    <p>Extinction Rebellion uses nonviolent direct actions and peaceful civil disobedience to disrupt business-as-usual in order to compel governments to act now to save a livable climate.</p>

    <p></p>

<br>
<Accordion :open="false">
  <h3 slot="header">legend</h3>
  <div class="flex">
    <img src="images/Legend.png"><br>
    <p>* These appear when you zoom in.<br><br>Click any element to find out more.<br><br>Spyglass appears at full zoom.<br>Press "shift" + &#8593; to enlarge it.<br>Press "shift" + &#8595; to shrink it.</p>
  </div>
</Accordion>

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
  name: 'PetropolisPipelines',
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
