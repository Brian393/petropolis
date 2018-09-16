<template>
  <div class="aside-content">
    <div class="title">
      <h1>Now time</h1>
    </div>
      <img src="images/TunnelCollapse.png" class="fullwidth">
    <div class="caption">Crumbling sign announces new emergency</div>
    <br>

        <Accordion :open="false">
          <h3 slot="header">legends</h3>
          <div class="flex">

            </div>
        </Accordion>

        <p>To understand the Hanford legacy, you must imagine the production process.</p>

        <p>Small cylinders of enriched uranium, each about 9 inches long and 1.5 inches wide, are coated in airtight aluminum. These fuel rods are inserted into a graphite core to spark a chain reaction. As the uranium atoms split, multiple transuranic products emerge, including plutonium. The fuel rods are cooled by river water. Finally they are pushed entirely through the graphite core, until they drop into a pool where the short-lived isotopes are allowed to decay.</p>

        <p>A railroad car then conveys the rods to the processing plants on the Central Plateau, three hundred feet above the river. There the aluminum coating is dissolved in acid, exposing the radioactive materials. This inaugurates a complex series of chemical treatments, each stripping away unwanted impurities and leaving behind hot wastes and precipitates. Hanford processed nearly twenty million fuel rods in this way, yielding some seventy-four tons of weapons-grade plutonium.</p>

        <p>Before you on the map is the real yield: a labyrinth of abandoned buildings, collapsing tunnels, hot pipes and equipment, rusting drums, dried pools, contaminated ditches, cribs, pits and burial grounds, plus some 177 leaking underground storage tanks holding roughly 50 million gallons of radiactive sludge. Scroll over the diagrams: each piece of the legacy is identified by an official name and number. On the Plateau where the map is focused, storage tanks are connected to processing plants by a tangle of pipelines; the stains of unplanned releases and migrating contamination sites envelop the ruins of the processing plants, which are gradually being disassembled by work crews, leaving only the freshly capped underground tanks and earth scraped bare by bulldozers.</p>

        <p>Move to the reactor sites along the river (<span class="link" @click="emit('set-map-view', {center: [-123.435, 46.213], resolution: 120})">zoom</span>). Cooling water intakes and outfalls can be observed along the bank, as well as large retention ponds nearer the reactors. Most of the buildings and infrastructure have already been scraped off the surface, excepting the cores themselves. Scroll the cursor over the black footprints to see images.</p>

        <p>What remains beyond the shrouded monuments is a deeper and more mobile legacy: the contaminant plumes moving through the groundwater and into the river.</p>
      <br>
      <Accordion>
        <h3 slot="header">sources</h3>
      <p>Data sources for this page include:</p>
      <p>-- <a href="" target="_blank"></a></p>
      <p>-- <a href="" target="_blank"></a></p>
      <p>-- <a href="" target="_blank"></a></p>
      <p>-- <a href="" target="_blank"></a></p>
      <p>-- <a href="" target="__blank"></a></p>
      <p>-- <a href="" target="_blank"></a></p>
      <p>-- <a href="" target="_blank"></a></p>
      <p>-- <a href="" target="_blank"></a></p>
      <br>
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
  name: 'WatershedHanfordLegacy',
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
  },
  methods: {
    emit: function (method, args) {
      eventBus.$emit(method, args)
    }
  }
}
</script>
