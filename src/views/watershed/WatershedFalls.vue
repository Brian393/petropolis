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
      <h1>The Falls are sleeping</h1>
    </div>
    <div class="video">
      <iframe width="350" height="197" src="https://www.youtube.com/embed/oWdxY_5DHq0?&amp;start=26&amp;autoplay=1&amp;mute=1&amp;loop=1&amp;playlist=oWdxY_5DHq0" frameborder="0" allow="autoplay; encrypted-media; loop" allowfullscreen></iframe>
    </div>
    <div class="caption">Echo of Water Against Rocks
      <br>Ian McCluskey &amp; Steve Mital</div>
    <br>

        <Accordion :open="false">
          <h3 slot="header">legends</h3>
          <div class="flex">
              <img src="images/Tsagaglalal.png" class="fullwidth">
              <div class="legendtext"><span style="text-align: center;">Looking over The Narrows is Tsagaglalal, "She Who Watches."</span></div>
            </div>
        </Accordion>

      <p>On May 10, 1957, the gates of the powerhouse at The Dalles Dam were lowered, blocking the flow of the Columbia River. In just a few hours, the rapids that had roared through The Long Narrows since time immemorial were silenced by the rising waters.</p>

      <p>What changed on that day?</p>

      <p>Celilo Falls was the oldest continuously inhabited site in North America. Known as Wyam, it lay at the meeting-place between the Sahaptin and Upper Chinookian language groups, and it attracted regular migrations of Native Americans from across the West, who came there to fish and to celebrate the First Salmon ceremony. The catch at the base of the falls, carefully regulated by the Salmon Chief, was abundant beyond today's imagining. It has been estimated that up to sixteen million salmon crossed the falls every year&mdash;compared to the 1.2 million that made it over Bonneville Dam in 2017.</p>

      <p>The roaring river, the leaping salmon, the bustling fisherfolk at the shore have left their traces in travelers' accounts and in tribal memories. Innumerable <a href="https://www.google.com/search?q=celilo+falls+fishing&source=lnms&tbm=isch&sa=X&ved=0ahUKEwjb3er9pvzcAhVJR6wKHTyUC9AQ_AUICygC&biw=1920&bih=951" target= "_blank">photographs</a> dating back to the late nineteenth century show wooden dip-net platforms jutting out from the powerful basalt on the edges of the cataract. Historian Katrine Barber describes the scene:</p>

      <p class="quote">"At Celilo Falls, where the horseshoe-shaped precipice demanded portage, dozens of villages scattered about the shorelines. A maze of islands separated the small communities and provided fishing sites in the spring and fall. The villages, each an autonomous political unit, faced the river or the mouths of tributaries&mdash;anywhere the fishing was excellent and accessible. The Indian population may have reached as many as 10,000 in this nine-mile stretch of the river before postcontact disease devastated the tribes."</p>

      <p>Despite the disasters of first contact, the summertime convergence at the falls persisted into the middle of the twentieth century. The Yakama Nation, the Confederated Tribes of Warm Springs and the Walla Walla, Umatilla, and Cayuse peoples retained their treaty rights to fish at Celilo up to the date of the flooding. They still retain those rights today, but in a vastly different landscape.</p>

      <p>Before the dams turned the wild river into a series of slackwater pools, rapids and waterfalls had been scattered the length of the Columbia and of its tributaries. Many were important fisheries and ceremonial sites, in particular Kettle Falls, now underwater, drowned by the Grand Coulee Dam (<span class="link" @click="emit('set-map-view', {center: [-118.109, 48.639], resolution: 120})">zoom to Kettle Falls</span>). Only in rare cases do salmon still leap across a surging cascade, notably at <span class="link" @click="emit('set-map-view', {center: [-122.617, 45.352], resolution: 6})">Willamette Falls</span> just south of Portland, where lamprey too are still caught in the traditional way, by hand. The locations of the major rapids and waterfalls are shown on the map, each marked with a photograph of its historical condition.</p>

      <p>The Nez Perce of the Wallowa Valley were among those who depended on the salmon runs of Celilo Falls. Their leader, Chief Joseph, had done everything he could to find a path of coexistence between the new settlers and his band, who resisted arbitrary relocation to Idaho. Reflecting on the band's flight, pursuit and defeat in the tumultuous "Nez Perce War" of 1877, he seemed to see into the future:</p>

      <p class="quote">"I learned that we were but few, while the white men were many, and that we could not hold our own with them. We were like deer. They were like grizzly bears. We had a small country. Their country was large. We were contented to let things remain as the Great Spirit Chief made them. They were not; and would change the rivers and mountains if they did not suit them."</p>

      <p>In 1955, the Chief Joseph Dam was built on the Columbia River, at the edge of the Colville Reservation where Joseph himself had died in exile in 1904. It was part of a larger process, driven by the economy and the state, which would almost entirely transform both the river and the world around it.</p>

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
