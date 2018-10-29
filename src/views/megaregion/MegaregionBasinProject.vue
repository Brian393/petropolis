<style scoped>
.video {
position: relative; padding-bottom: 74.88%; height: 0;
}
.video iframe {
position: absolute; top: 0; left: 0; width: 100%; height: 100%;
}
</style>

<template>
  <div class="aside-content">
    <div class="title">
      <h1>High-powered plants</h1>
    </div>
    <div class="video">
      <iframe width="350" height="197" src="https://www.youtube.com/embed/zu-M31YyEaE?&amp;start=10&amp;autoplay=1&amp;mute=1&amp;loop=1&amp;playlist=zu-M31YyEaE" frameborder="0" allow="autoplay; encrypted-media; loop" allowfullscreen></iframe>
    </div>
    <div class="caption">"New Farms from Grand Coulee"<br>&mdash;Universal Newsreel, early 1950s&mdash;</div>
    <br>

        <Accordion :open="false">
          <h3 slot="header">legends</h3>
          <div class="flex">

            </div>
        </Accordion>

      <p>The blue splash at the center of this page&mdash;a lake known as Potholes Reservoir&mdash;is not directly connected to the turbines and pipelines of the Grand Coulee Dam to the north. Instead it is the result of unforeseen seepage from the Bureau of Reclamation's Columbia Basin Project.</p>

      <p>What you're lloking at on this map is some of the most productive agricultural land in the United States, featuring an amazing diversity of cultivated plants. Roll the cursor over the fields to identify the crop and the watering technique. Zoom closer and canals appear, connected to ditches which feed the sprinklers. At full zoom a spyglass opens up to show the material reality of the largest federal irrigation scheme in the US.</p>

      <p>All this was planned in the 1930s in an effort to return fertile land to thousands of small farmers fleeing the Dust Bowl. However, the Grand Coulee Dam with its massive hydropower production took center stage during WWII, and the irrigation project itself, which had motivated the building of the dam, was only begun in the early 1950s. By that point, those who could benefit were mostly not family farmers, but corporations.</p>

      <p>Due in part to its redistributive failures, the Columbia Basin Project stopped short of completion, leaving all the land east of the dotted line without the promised water. Here, in what's known as the Odessa Subarea, farmers and agiricultural corporations were granted special variances to dig wells and pump their irrigation water from the acquifer below. Their wells now extend as much as two thousand feet down, but bring up only briny water, barely fit for agricultural use.</p>

      <img src="images/ColumbiaPlateauGroundwater.png" class="fullwidth"><br>
      <div class="caption">source: <a href="https://www.usbr.gov/pn/programs/eis/odessa/finaleis/exec.pdf" target="_blank" rel="nofollow">Bureau of Reclamation</a></div>

      <p>To understand how the Columbia River will again be called to the rescue you have to look north, to the Grande Coulee dam, <span class="link" @click="emit('set-map-view', {center: [-119.012, 47.944], resolution: 10})">here</span>. Zoom in a bit more, and the spyglass reveals the extraordinary pipe system that rises three hundred feet from the dam's giant pumphouse. After the pumping, the water of the Columbia enters a canal that will fill the Grand Coulee, which is a great linear scar left on the face of the desert by the Missoula Floods. At the end of the Grand Coulee an aqueduct emerges from a dam, then plunges beneath an upsurge of basalt crust, only to reemerge a couple of miles away and flood the curving Lower Coulee. Ultimately the water is channeled into a canal system, whose two main branches serve <span class="link" @click="emit('set-map-view', {center: [-119.4, 46.89], resolution: 240})">the entire project.</span> This system can simply be turbocharged with more dam water pumped by more electricity. The seepage, while not intentional, has been naturalized as part of humanity's power to change everything for the better.</p>

      <p>The land has been flooded. The aquifer has been drained. Legislation has now been passed to complete the Bureau of Reclamation project, drawing further water from behind the Grand Coulee. What will happen to the Columbia River when even more corporate farmers try to make even more desert bloom?</p>

      <br>
      <Accordion>
        <h3 slot="header">sources</h3>
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
  name: 'MegaregionCropsBasinProject',
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
