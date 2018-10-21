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
      <h1>Urban metabolism</h1>
    </div>
    <div class="video">
      <iframe width="350" height="300" src="https://www.youtube.com/embed/EdmpFE7QnoU?&amp;autoplay=1&amp;mute=1&amp;loop=1&amp;playlist=EdmpFE7QnoU" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
    </div>
    <div class="caption">BENEATH OUR FEET
      <br>by Linda Wysong &amp; Pamela Chipman</div>
    <br>

        <Accordion :open="false">
          <h3 slot="header">legends</h3>
          <div class="flex">
            <div>
              <img src="icons/legends/urbangrid.png">
              Urban grid
            </div>
            <div>
              <img src="icons/legends/substation.png">
              Electric substation
            </div>
            <div>
              <img src="icons/legends/transmission.png">
              Transmission line
            </div>
            <div>
              <img src="icons/legends/traffic.png">
              Automobile traffic
            </div><div>
              <img src="icons/legends/railroad.png">
              Railroad line
            </div><div>
              <img src="icons/legends/lights.png">
              Earth at night
            </div>
      <div class="legendtext"><em>Layers change as you move in and out.</em></div>
      <em>Use SHIFT + vertical arrows to adjust the spyglass at max zoom.</em>
          </div>
        </Accordion>

      <p>The image to your left shows the Portland metro area, with streets in dark blue, railways in orange and automobile traffic in bright green (it'll shift to yellow and red at rush hour). Underneath the traffic, a dendritic tangle of crimson filaments represents the regional electric grid&mdash;just one of the ways the metropolis reaches out to the countryside for resources.</p>

      <p>Where does the city stop? By itself, Portland is immense. Yet it's only a nighttime gleam in a much larger constellation of interconnected urban systems stretching along the coastline of the Pacific Northwest. Taken together, these urbanized areas constitute what geographer Jean Gottman termed a <a href="http://www.esperdy.net/wp-content/uploads/2009/09/Gottman-Introduction.pdf" target="_blank" rel="nofollow">megalopolis</a>, or what's now called a <a href="http://www.america2050.org/content/megaregions.html" target="_blank" rel="nofollow">megaregion</a>.</p>

      <p>Linked by Interstate 5&mdash;and maybe someday by high-speed rail&mdash;Eugene, Salem, Portland, Tacoma, Seattle, Everett, Bellingham, Vancouver and half a dozen smaller conurbations make up the Cascadian megaregion (see <AppLightBox :images="megaImages">promotional map</AppLightBox>). In its turn, Cascadia is but one of eleven US megaregions, which themselves take their place among some forty global urban clusters, including such giants as Hong Kong-Shenhzen-Guangzhou and Rio de Janeiro-Sao Paulo. The megaregion has recently been defined as <a href="https://books.google.com/books?id=jIEZBgAAQBAJ&lpg=PP1&dq=Megaregions&pg=PP1#v=onepage&q&f=false" target="_blank" rel="nofollow">globalization's urban form</a>.</p>

      <p>Zoom out to see Cascadia's place in the network of US megaregions, or <span class="link" @click="emit('set-map-view', {center: [-98.201, 38.889], resolution: 6000})">click here</span>. Zoom further out for the entire global network.</p>

      <p>Represented in this way, Cascadia is at antipodes from the bioregion celebrated by Peter Berg and Raymond Dasmann. The Cascadian megaregion emerges not from poetry, but from the raw violence of domination. Its political economy, currrently measured in dollars and cents, should rather be measured by the gigatons of carbon dioxide that it adds to the earth's atmosphere every year, contributing to the melt of the polar icecaps and the onrushing chaos of climate change.</p>

      <p>Yet just as humans are an animal population, so Cascadia is part of the earth system. Its consumption of fossil fuels, its thirst for channeled water and its dependence on industrial agriculture together constitute a <a href="https://www.anthropocene-curriculum.org/pages/root/campus-2016/techno-metabolism/" target= "_blank">techno-metabolism</a>, whose organic structure and temporal pulse remain obscure for the majority of its inhabitants. Taking a cue from artists Lynda Wysong and Pamela Chipman, we could all start exploring the ground beneath our feet.</p>

      <p>This section of <strong>Learning from Cascadia</strong> maps out what may be called "the Anthropocene city"&mdash;its spatial contours, its historical legacies of colonialism and racism, its energy technologies and its resource use, in short its capacity to reshape the surrounding environment and outselves at the same time. The idea is to lay bare the challenges of the climate-change era. Can we name the social matrix that all this emerged from? Can we represent and quantify a regional metabolism? Can we own it and take responsibility for it? Can we discover new sources of species-level agency within the current dynamics of unchecked growth and carrying-capacity overshoot? These are just a few of the unanswered questions of political ecology.</p>
      <br>
      <Accordion>
        <h3 slot="header">sources</h3>
      <p>For a full-spectrum investigation of the civilizational transformations leading up to and beyond climate change, see <a href="https://www.anthropocene-curriculum.org" target="blank">The Anthropocene Curriculum</a>, with which "Learning from Cascadia" is affiliated.</p>
      <p>Data sources for this page include:</p>
      <p>-- <a href="" target="_blank" rel="nofollow"></a></p>
      <p>-- <a href="" target="_blank" rel="nofollow"></a></p>
      <p>-- <a href="" target="_blank" rel="nofollow"></a></p>
      <p>-- <a href="" target="_blank" rel="nofollow"></a></p>
      <p>-- <a href="" target="__blank"></a></p>
      <p>-- <a href="" target="_blank" rel="nofollow"></a></p>
      <p>-- <a href="" target="_blank" rel="nofollow"></a></p>
      <p>-- <a href="" target="_blank" rel="nofollow"></a></p>
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
  name: 'MegaregionIntroduction',
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
