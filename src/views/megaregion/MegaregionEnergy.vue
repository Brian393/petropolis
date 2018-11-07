<template>
  <div class="aside-content">
    <div class="title">
      <h1>Turn on all the lights</h1>
    </div>
      <img src=images/HighVoltageTower-sm.jpg class="fullwidth">
    <div class="caption">
      High-tension tower (<a href="http://www.pxleyes.com/photography-picture/4ca6f763f307c/High-voltage-tower.html" target="_blank" rel="nofollow">source</a>)
    </div>
    <br>

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
            </div>
            <div>
              <img src="icons/wind.png">
              Wind turbine
            </div>
            <div>
              <img src="icons/legends/BPAarea.png">
              BPA service area
            </div>
          </div>
        </Accordion>

      <p>Do you know where your power comes from?</p>

      <p>This map locates all the major inputs to Cascadia's electric grid: hydropower dams, natural gas generators, wind turbines, two coal plants and one civilian nuke (though five were planned in the 1970s). Only installations producing over 100 megawatts of power are shown, so there's no solar power here&mdash;but these larger generating stations give a very good idea of what it takes to keep the lights on in the twenty-first century.</p>

      <p>Follow the crimson lines of the power grid to each site. Roll over the icon with the mouse and an image appears. Click for some more information. Zoom in to see the lay of the land.</p>

      <p><p>/If there's such a thing as an urban metabolism, then it can't stop at the limits of the city&mdash;or even the megaregion. Industrial corridors reach out into the hinterland, where the material energies of the territory are captured, channelled and transformed for use in the metropolitan centers.<br><br></p>

      <p><img src=images/BonnevilleNorthPowerhouse.jpg class="fullwidth"></p>

      <p><br>The majority of the plants lie within the bounds of a single distribution network, the Bonneville Power Administration (BPA), outlined in bright blue dashes (see the whole service area <span class="link" @click="emit('set-map-view', {center: [-118.105, 45.6], resolution: 2000})">here</span>). The BPA owns no generators, no dams, no smokestacks, only transmission lines. It buys power from regional producers, sets prices for local consumption and sells the surplus on high-tension lines reaching deep into California. So far, the BPA has been the largest single actor influencing the industrial and urban development of Cascadia.</p>

      <p>Now look at the wind-power installations of the Columbia Gorge,  <span class="link" @click="emit('set-map-view', {center: [-120.6, 45.7], resolution: 150})">here</span>. Each icon on the map represents upwards of a dozen towers, you can actually see them if you zoom way in. Near each group you'll see tiny red circles&mdash;electric substations&mdash;which link the wind generators to the grid. You can follow the transmission lines back to Portland, Seattle, Spokane, Kalispell or wherever. If you recognize the landmarks of your neighborhood, you might even be able to see the substation you're drawing power from right now.</p>

      <p>Does the wind out in the Gorge blow through your screen? It might also be hydro, or coal, or gas or nuclear all intermingled.</p>

      <p>The idea is to at once imagine and retrace the energy-relations linking habits, our homes, our means of transportation, our workplaces and institutions&mdash;in short, our lives in society&mdash;to the vast productive territories that lie out of sight, far beyond the city.</p>

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
  name: 'MegaregionEnergy',
  components: {
    Accordion,
    AppLightBox
  },
  methods: {
    emit: function (method, args) {
      eventBus.$emit(method, args)
    }
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
