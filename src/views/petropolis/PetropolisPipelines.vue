<template>
  <div class="aside-content">
    <div style="text-align: center;">
      <h1 style="color:#E00607; font-size:170%">before it's too late</h1>
    </div>
    <img src="images/OilHead.jpg" class="fullwidth"><div class="caption"></div>

    <p><strong></strong></p>

    <p>The collapse of climate and ecosystems is accelerating. We are nearly out of time. Decades of protests, petitions and donations to environmental groups have done nothing to slow catastrophic change. Food and water shortages, resource wars, economic breakdown, and millions of new climate refugees are on the horizon. Human survival itself is at risk as temperatures continue to rise.</p>

    <p>Extinction Rebellion uses nonviolent direct actions and peaceful civil disobedience to disrupt business-as-usual in order to compel governments to act now to save a livable climate.</p>

    <p></p>

<br>
<Accordion :open="false">
  <h3 slot="header">who/why/how</h3>
  <div class="flex">
    <p><strong></strong>DEEP TIME CHICAGO is an art/ research/ cultural activism group that emerged from the <a href="https://archive.anthropocene-curriculum.org/pages/root/campus-2016/" target="_blank" rel="nofollow">Anthropocene Campus</a> in Berlin, Germany. Our lectures, publications, walks and exhibitions have focused on the Chicago metropolitan area, and more recently, on the <a href="https://anthropocene-curriculum.org/project/mississippi/field-stations/field-station-4-confluence-ecologies" target="_blank" rel="nofollow">Mississippi River</a>. The core idea is making tangible the production and governance of the Anthropocene, and its alternatives. Current members are Kayla Anderson, Sara Black, Jeremy Bolen, Beate Geissler, Amber Ginsburg, Brian Holmes, Jenny Kendler, Brian Kirkbride, Sarah Lewison, Marlena Novak, Claire Pentecost, Oliver Sann, Michael Swierz, Andrew Yang and Jay Alan Yim.</p>
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
