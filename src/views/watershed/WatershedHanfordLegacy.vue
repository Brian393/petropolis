<template>
  <div class="aside-content">
    <div class="title">
      <h1>Now time</h1>
    </div>
      <img src="images/Hanford/HanfordEmergency.gif" class="fullwidth">
    <div class="caption">Things still happen at Hanford</div>
    <br>

        <Accordion :open="false">
          <h3 slot="header">legends</h3>
          <div class="flex">

            </div>
        </Accordion>

        <p>To understand the Hanford legacy, you have to imagine the production process.</p>

        <p>Small cylinders of enriched uranium, each about 9 inches long and 1.5 inches wide, are sealed in aluminum. These relatively small slugs are inserted into long aluminum tubes set within a graphite core, so as to spark a chain reaction. As the uranium atoms split, multiple transuranic products are formed, including plutonium. The hot slugs are cooled by river water at a rate of some 30,000 gallons per minute. Finally they are pushed entirely through the graphite core until they drop into a pool water where the short-lived isotopes are allowed to decay, normally for a two-month period.</p>

        <p>A railroad car then conveys the slugs to the processing plants on the Central Plateau, three hundred feet above the river. There the aluminum coating is dissolved in acid, exposing the radioactive materials. This inaugurates a complex series of chemical treatments, each stripping away unwanted impurities, but also leaving behind hot wastes and precipitates. Hanford processed nearly twenty million fuel rods in this way, yielding some seventy-four tons of weapons-grade plutonium.</p>

        <p>Before you on the map is the real yield: a labyrinth of abandoned buildings, collapsing tunnels, decaying pipes and equipment, rusting drums, dried pools, contaminated ditches, cribs, pits and burial grounds, plus some 177 leaking underground storage tanks holding roughly 50 million gallons of radiactive sludge.</p>

        <p>Zoom in and move the mouse over the diagrams. Each piece of the legacy is identified by an official name and number. On the Plateau where the map is focused, storage tanks are connected to processing plants by a tangle of pipelines. The stains of unplanned releases and migrating contamination sites envelop the ruins of the processing plants. The remaining buildings are gradually being disassembled by work crews, leaving only freshly capped underground tanks and earth scraped bare by bulldozers.</p>

        <p>Pan the map to the reactor sites along the river (or just click <span class="link" @click="emit('set-map-view', {center: [-119.542, 46.69], resolution: 5})">here</span>). Cooling water intakes and outfalls can be observed along the bank, as well as large retention ponds nearer the reactors. Most of the buildings and infrastructure have already been scraped off the surface, except the cores themselves. Scroll the cursor over the black reactor footprints for images.</p>

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
import {eventBus} from '../../main'

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
