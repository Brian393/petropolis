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
      <h1>Let it flow</h1>
    </div>
    <div class="video">
      <iframe width="350" height="197" src="https://www.youtube.com/embed/ZkGIwzPPc4M?&amp;autoplay=1&amp;mute=1&amp;loop=1&amp;playlist=ZkGIwzPPc4M" frameborder="0" allow="autoplay; encrypted-media; loop" allowfullscreen></iframe>
    </div>
    <div class="caption">The River Emerges<br>&mdash;video by Olympic National Park, <a href="https://www.nps.gov/olym/learn/nature/restorationoftheelwha.htm">here</a>&mdash;</div>
    <br>
    <Accordion :open="false">
      <h3 slot="header">legends</h3>
      <div class="flex">
        <p></p>
      </div>
    </Accordion>
    <br>

<p>Maps are said to lie. They do; but just as often they fall behind the changing times. Because the landscape moves very rapidly in our era: "There was a river here once. Ooops, now there's a gigantic dam. Whoaaah, check it out, there's a river here again!""</p>

<p>This beautifully made topographic map shows the site of what used to be the Elwha Dam. You can see Power Plant Road, which goes through some kind of metamorphosis at the canyon wall, to become Lower Dam Road. There's nothing more ordinary on an American river: the water rises, the water falls, it goes through the turbines and the generators hum, the beat goes on. But if you drive there today, there's no there there. Instead there's something formerly unknown: the Elwha River.</p>

<p>Further upstream was another massive engineering work, Glines Dam, you can see the site <span class="link" @click="emit('set-map-view', {center: [-123.605, 47.999], resolution: 4})">here</span>. The federal government acquired them both under the Elwha River Ecosystem and Fisheries Restoration Act of 1992, opening the way for removal. Demolition began in 2011 and proceded in stages, to avoid the sudden damaging surge of trapped sediments that would have been released by a single explosion. In March of 2012, the dams were a memory&mdash;but a memory inscribed deeply into both the land and the people.</p>

<img src="images/FormerLake.jpg" class="fullwidth">
<div class="caption">Former Lake Allwell after dam removal<br>(<a href="https://en.wikipedia.org/wiki/Elwha_Dam#/media/File:Lake_Alwell_after_dam_removal.jpg" target="_blank" rel="nofollow">source</a>)</div>

<p>In this case it's worth turning up the volume, hitting full screen and watching the video. Listen to the narrator's voice: you can still hear faint accents of the heroic Army Corps of Engineers videos that were made for Bonneville Dam, The Dalles, and so many others. Listen to the demolition man: he undoubtedly learned his trade at the height of industrial modernism, under the shadow of the big corporate construction firms and their megaprojects. When you listen close, there's something very familiar, but also very new in these voices. Deconstruction was about language when they taught it at universities in the 1980s. Now it's about cement, pure and simple.</p>

<p>These are not easy transitions. That power plant was still worth something, it could still produce electricity. What's more, it was worth the lives of the people who built and maintained it, giving their best work over generations. How to pay respect to past efforts as the landscape changes?</p>

<p>Ecological restoration is at the heart of the Cascadian project. It's no longer a speculative utopia: instead it has become the science and engineering of the twenty-first century. It creates a new ideal of coexistence between humanity and nature, which is rooted in many existing forms of practice. It requires everyone's best, along with a conviction that deconstruction itself is worth something, and that it's viable over both the short and the long term.</p>

<p>This section of Learning from Cascadia explores various types of restoration projects, at scales from local to regional. Two more interviews will be put online in the upcoming weeks. And hopefully we'l do further investigations over the next year.</p>
<br>

<Accordion>
  <h3 slot="header">sources</h3>
  The map used here is called <a href="http://toposm.ahlzen.com/" target="_blank" rel="nofollow">Toposm</a>. It's a topographic map based on federal data sources for hydrography and elevation, plus OpenStreetMap for the roads and cities. More information <a href="https://wiki.openstreetmap.org/wiki/TopOSM" target="_blank" rel="nofollow"> here</a>.
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
  name: 'BioregionRestoration',
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
