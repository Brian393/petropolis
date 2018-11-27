<style scoped>
.video {
position: relative; padding-bottom: 56.25%; height: 0;
}
.video iframe {
position: absolute; top: 0; left: 0; width: 100%; height: 100%;
}
.quote {
font-weight: bold; font-style: italic; color: #333333;  text-align: center;
}
.quote-2 {
font-weight: bold; font-style: italic; color: #333333;
}
</style>

<template>
  <div class="aside-content">
    <div class="title">
      <h1>Messenger of nature</h1>
    </div>
    <div class="video">
      <iframe width="350" height="197" src="https://www.youtube.com/embed/hERlmXgqv7o?&amp;start=87&amp;autoplay=1&amp;mute=0&amp;loop=1&amp;playlist=hERlmXgqv7o" frameborder="0" allow="autoplay; encrypted-media; loop" allowfullscreen></iframe>
    </div>
    <div class="caption">A voyage from land to sea and back again<br>&mdash;video by Diarmuid, <a href="https://www.youtube.com/channel/UCLAqBw-p3I6918YOVCIcIVQ">here</a>&mdash;</div>
    <br>
    <Accordion :open="false">
      <h3 slot="header">legends</h3>
      <div class="flex">
        <img src="images/ChinookAlevin.png" class="fullwidth"><br>Chinook alevin, <a href="https://www.seattleaquarium.org/blog/redd-alert-our-chinook-salmon-are-hatching">source</a>
      </div>
    </Accordion>
    <br>

    <p>The Pacific Northwest has always been about fish. Fish nets, fish wheels, fish canneries, fish hatcheries, fly fishing, fish tales. But how did later generations of settlers come to experience salmon as an entire range of autonomous beings, divided into mysterious creaturely clans, each with their own sense of home? Such an encounter, placed under the tragic sign of possible extinction and mediated by the very particular fishing demands of Native Americans, is definitely among the wellsprings of Cascadia.</a>

    <p>What you see on the map are the critical habitat areas of chinook, coho, chum and sockeye salmon in the US Pacific Northwest. Critical habitat means, not just anywhere the fish go, but stream reaches that have been determined essential to the continuing existence of unique wild populations. The health of a stream depends on the watershed surrounding it, so what's really at issue in the map is the terrestial ecology of the ocean-going fish. But since the our own health depends on that of the watersheds, it's also about the terrestrial ecology of world-traveling humans.</p>

    <p>The cartographic image simplifies their movements through the territory, condensing the migrations of all the different species into streams of a single color: survival lines. These life-lines ask you how the salmon maintain a generational bond between the mountains and the sea&mdash;and whether you can do so with them.</p>

    <p>The data prepared by the National Oceanic and Atmospheric Administration are far more complex than any graphic technique could reveal. They divide the four endangered species not only into distinct seasonal runs (spring, summer or fall) but also into distinct gene pools, associated with the real pools and gravel beds that call the fish back to spawn. These divisions separate the different populations in time; but in space they often overlay one another on the same stream, in a way that is not particularly susceptible to representation on a map.</p>

    <p>In effect, any stream reach can be home to multiple stocks of fish, or "evolutionarily significant units" (ESUs), which is the term used under the Endangered Species Act. This concept of ESUs, or localized inbreeding populations, allows us to think of salmon, not just as a tasty catch, but instead as distinct communities of fate, each of which struggles to survive and reproduce under very particular conditions. Something of the Indigenous respect for the integrity of each living species resurfaces here, under new scientific guises. Further NOAA documents locate the areas where populations have gone extinct, or where stream reaches have been entirely blocked by dams. More speculative studies try to assess the geographical range in which the fish <em>could</em> potentially flourish. This kind of science is beautiful, because it opens windows onto non-human worlds.</p>

    <p>A great challenge for cartography would be to render all this knowledge perceptible in the blink of an eye. But it's not obvious how, and besides, you can get lost in the data. The idea here is to focus on the most powerful message that the salmon have for us now, which is that of finding a pathway to the place where the cycles originate. What does that message mean for contemporary human beings?</p>

    <p>Five maps can be accessed from the buttons below. Roll the cursor over the landscape to find the streams through which each species moves. Locate the places that make you want to come closer. Think about river beds, currents, cascades, dreamy aquascapes and looming threats of all kinds, not just from bears and eagles, but mostly from human construction, clearcutting, agricultural runoff, debris and hot water.</p>

    <p>Can we still feel the link between the oceans and the mountains? Can we help keep this incredible connection alive?</p>
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
  name: 'WatershedFalls',
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
