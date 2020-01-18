<template>
  <div class="aside-content">
    <div>
      <br><br><h2>Deep Time Past</h2><br><br>
    </div>
    <img src="images/AsianCarp-sm.jpg" class="fullwidth"><div class="caption"></div><br>

    <p><strong></strong></p>

    <p></p>

    <p></p>

    <p></p>

<br>
<Accordion :open="false">
  <h3 slot="header">who/why/how</h3>
  <div class="flex">
    <p><strong></strong>DEEP TIME CHICAGO is an art/ research/ cultural activism grpup that emerged from the <a href="https://archive.anthropocene-curriculum.org/pages/root/campus-2016/" target="_blank" rel="nofollow">Anthropocene Campus</a> in Berlin, Germany. Our lectures, publications, walks and exhibitions have focused on the Chicago metropolitan area and more recently, on the <a href="https://anthropocene-curriculum.org/project/mississippi/field-stations/field-station-4-confluence-ecologies" target="_blank" rel="nofollow">Mississippi River</a>. The core idea is making tangible the production and governance of the Anthropocene, and its alternatives. Current members are Kayla Anderson, Sara Black, Jeremy Bolen, Beate Geissler, Amber Ginsburg, Brian Holmes, Jenny Kendler, Brian Kirkbride, Sarah Lewison, Marlena Novak, Claire Pentecost, Oliver Sann, Michael Swierz, Andrew Yang and Jay Alan Yim.</p>
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
  name: 'WalkAboutItPrevious',
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
