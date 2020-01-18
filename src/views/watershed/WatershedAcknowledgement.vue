<template>
  <div class="aside-content">
    <div>
      <br><h2>Into the City</h2><br><br>
    </div>
    <img src="images/CarbonBuilding.jpg" class="fullwidth"><div class="caption"></div><br>

    <p><strong></strong></p>

    <p>Geologists are talking about a new epoch, the Anthropocene. What is it, where did it come from, why does it matter right now? How to locate planetary-scale changes in the place where you live?</p>

    <p><a href="http://deeptimechicago.org" target="_blank" rel="nofollow">Deep Time Chicago</a> looks at the city as an extraction machine, transforming millions of years of time (coal, iron, petroleum...) into today's urban theater. You begin to wonder, whose drama are we acting out? What would it take to change the script? Understanding our own roles starts by grasping the built environment, the big corporations, the city government and the population itself as ecological forces.</p>

    <p><a href="http://deeptimechicago.org/walk-about-it/" target="_blank" rel="nofollow">Walk About It</a> is a series of urban inquiries, connecting the Anthropocene to specific sites in the Chicagoland area. The mode of inquiry is a guided walk with exploratory concepts and artistic inputs. The duration is about two hours. The aim is a multi-threaded group conversation about planetary changes connected directly to the worlds we inhabit locally. It's about tracing the contours of a new epoch.</p>

<br>
<Accordion :open="false">
  <h3 slot="header">who/why/how</h3>
  <div class="flex">
    <p><strong></strong>DEEP TIME CHICAGO is an art/ research/ cultural activism grpup that emerged from the <a href="https://archive.anthropocene-curriculum.org/pages/root/campus-2016/" target="_blank" rel="nofollow">Anthropocene Campus</a> in Berlin, Germany. Our lectures, publications, walks and exhibitions have focused on the Chicago metropolitan area, and more recently, on the <a href="https://anthropocene-curriculum.org/project/mississippi/field-stations/field-station-4-confluence-ecologies" target="_blank" rel="nofollow">Mississippi River</a>. The core idea is making tangible the production and governance of the Anthropocene, and its alternatives. Current members are Kayla Anderson, Sara Black, Jeremy Bolen, Beate Geissler, Amber Ginsburg, Brian Holmes, Jenny Kendler, Brian Kirkbride, Sarah Lewison, Marlena Novak, Claire Pentecost, Oliver Sann, Michael Swierz, Andrew Yang and Jay Alan Yim.</p>
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
  name: 'WalkAboutItSites',
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
