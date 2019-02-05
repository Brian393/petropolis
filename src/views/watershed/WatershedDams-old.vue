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
      <iframe width="350" height="197" src="https://www.youtube.com/embed/oWdxY_5DHq0?rel=0&amp;start=26;autoplay=1&mute=1&amp;showinfo=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
    </div>
    <div class="caption">Echo of Water Against Rocks
      <br>Ian McCluskey &amp; Steve Mital</div>
    <br>

        <Accordion :open="false">
          <h3 slot="header">legends</h3>
          <div class="flex">
              Looking out over The Long Narrows is Tsagaglalal, "She Who Watches." Her legend is told by the Wishram people:<br><br><em>A woman had a house where the village of Nixluidix was later built. She was chief of all who lived in the region. That was a long time before Coyote came up the river and changed things and people were not yet real people.  After a time Coyote in his travels came to this place and asked the inhabitants if they were living well or ill. They sent him to their chief who lived up on the rocks, where she could look down on the village and know what was going on.<br><br>Coyote climbed up to the house on the rocks and asked "What kind of living do you give these people? Do you treat them well or are you one of those evil women?" "I am teaching them to live well and build good houses," she said.<br><br>"Soon the world will change," said Coyote, "and women will no longer be chiefs." Then he changed her into a rock with the command, "You shall stay here and watch over the people who live here."<br><br>All the people know that Tsagaglalal sees all things, for whenever they are looking at her those large eyes are watching them.</em><br><br>
              <img src="images/Tsagaglalal.png" class="fullwidth">
            </div>
        </Accordion>

      <p>On May 10, 1957, the gates of the powerhouse at The Dalles Dam were lowered, blocking the flow of the Columbia River. In just a few hours, the rapids that had roared through The Long Narrows since time immemorial were silenced by the rising waters.</p>

      <p>What changed on that day?</p>

      <p>Celilo Falls was the oldest continuously inhabited site in North America. Known as Wyam, it lay at the meeting-place between the Sahaptin and Upper Chinookian language groups, and was frequented by Native Americans from across the West, who there came to fish and to celebrate the First Salmon ceremony. It has been estimated that up to sixteen million salmon used to cross the falls every year. Innumerable <a href="https://www.google.com/search?q=celilo+falls+fishing&source=lnms&tbm=isch&sa=X&ved=0ahUKEwjb3er9pvzcAhVJR6wKHTyUC9AQ_AUICygC&biw=1920&bih=951" target= "_blank">photographs</a> dating back to the late nineteenth century show wooden dip-net platforms jutting out from the powerful basalt on the edges of the cataract. The historian Katrine Barber describes the scene:</p>

      <p class="quote">"At Celilo Falls, where the horseshoe-shaped precipice demanded portage, dozens of villages scattered about the shorelines. A maze of islands separated the small communities and provided fishing sites in the spring and fall. The villages, each an autonomous political unit, faced the river or the mouths of tributaries&mdash;anywhere the fishing was excellent and accessible. The Indian population may have reached as many as 10,000 in this nine-mile stretch of the river before postcontact disease devastated the tribes."</p>

      <p>Up to the date of the flood the Yakama Nation, the Confederated Tribes of Warm Springs, and the Walla Walla, Umatilla, and Cayuse peoples retained their treaty rights to fish at Celilo. They still do, but under vastly different circumstances.</p>

      <p>Rapids and waterfalls were scattered the length of the Columbia and of its tributaries. Many of them were important fisheries and ceremonial sites, in particular Kettle Falls, which is now also underwater (<span class="link" @click="emit('set-map-view', {center: [-118.109444, 48.639444], resolution: 120})">zoom to Kettle Falls</span>). In a rare case like that of <span class="link" @click="emit('set-map-view', {center: [-122.61763, 45.35239], resolution: 4})">Willamette Falls</span>, both salmon and lamprey still find their way across a roaring cascade. The locations of the major rapids and waterfalls are shown on the map, along with photographs of their historical state, which can be accessed by clicking on the waterfall icons.</p>

      <p>The Nez Perce of the Wallowa Valley were among those who depended on the salmon runs of Celilo Falls. Hinmahtooyahlatkekt, better known as Chief Joseph, did everything he could to find a path of coexistence between the new settlers of the valley and his band, who resisted arbitrary relocation to Idaho. Reflecting on the band's flight, pursuit and defeat in the tumultuous "Nez Perce War" of 1877, he seemed to see into the future:</p>

      <p class="quote">"I learned [since I was a boy] that we were but few, while the white men were many, and that we could not hold our own with them. We were like deer. They were like grizzly bears. We had a small country. Their country was large. We were contented to let things remain as the Great Spirit Chief made them. They were not; and would change the rivers and mountains if they did not suit them."</p>

      <p>In 1955, the Chief Joseph Dam was built on the Columbia River, at the edge of the Colville Reservation where the Chief himself had died in exile in 1904. To see what changed in the decades that followed, press "Transformation of the River," at the bottom of the page.</p>

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
  name: 'WatershedDams',
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
