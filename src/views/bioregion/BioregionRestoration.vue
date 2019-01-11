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
      <h1>Liza Jane McAlister:<br>Where was that river?</h1>
    </div>
    <div class="video">
      <iframe width="350" height="197" src="https://player.vimeo.com/video/298431466?title=0&byline=0&portrait=0" style="position:absolute;top:0;left:0;width:100%;height:100%;" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
    </div>
    <div class="caption">&mdash;video by Jodi Darby&mdash;</div>
    <br>
    <Accordion :open="false">
      <h3 slot="header">legends</h3>
      <div class="flex">
        <p>Pictured here is the Wallowa as it flows over 6 Ranch. Run the mouse along the stream: a topographical layer shows the old watercourse. Zoom in for a closer look at the new meanders&mdash;right where the old ones used to be.</p>
      </div>
    </Accordion>

    <p>Liza Jane McAlister is a fourth-generation rancher out in the Wallowa River Valley near Enterprise, Oregon, on an exceptionally beautiful piece of land called the 6 Ranch. She's a spirited, original woman with roots in the ground and ideas as free as the clouds. She's also fiercely loyal to her region, her neighbors and their long experience of cattle ranching, forestry and land management. Her son and daughter are part of the story as well: James is a fishing and hunting guide on the family land, and Adele runs a neighboring cattle ranch with her husband.</p>

    <p>In the video above, Liza Jane recounts her experience with two large stream restoration projects on the ranch. These projects have brought the meanders of the Wallowa River out of a straightened and radically simplified channel that was bulldozed along the bluff sometime shortly after WWII. That work was done in order to control flooding and protect the railway; but it inadvertently ruined fish, animal, bird and insect habitat in the process.</p>

    <p>The new river seeks to be a fusion of art and nature, restoring a complex stream bed rich in habitat of many kinds, while still stabilizing the river's course and preventing it from damaging both the ranch and public infrastructures. However this project too required massive earth-moving equipment, as well as a plethora of hydrologists, biologists, ecologists, foresters, wildlife specialists and many others, all coordinated by the Grande Ronde Model Watershed. That organization in its turn is part of the Oregon Watershed Enhancement Board, OWEB, which funds local watershed councils and restoration initiatives across the state. It is amazing to see that the watershed council, one of the key proposals of 1970s-era bioregionalism, has now been instituted as part of state government&mdash;with all the ambivalent results that can bring.</p>

    <p>Let's say it out loud, just as Liza Jane does. The common wisdom east of the Cascades is that if you let the government on your property, they'll take over your land. A woman needs courage to buck that deep-rooted belief, and also lots of stubborn negotiation and caeful strategy&mdash;because if you look into it, you will find there is some truth to the common wisdom.</p>

    <p>Liza Jane McAlister thinks that the restoration of the Wallowa River was well worth the effort, and she has strong ideas that can apply to both sides of the notorious urban-rural divide. In particular, she does not accept the principle that grazing inevitably destroys riverine environments, and she proposes using cattle as a tool of land management, in a practice also known as "regenerative grazing." Underlying this message is another, deeper one: the land will not be restored without the positive contributions of the people who actually live there. As the video makes clear, the 6 Ranch produces food for thought, along with very tasty things to eat.</p>

    <div class="video">
      <iframe width="350" height="197" src="https://player.vimeo.com/video/298434933?title=0&byline=0&portrait=0" style="position:absolute;top:0;left:0;width:100%;height:100%;" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
    </div>
    <div class="caption">&mdash;video by Jodi Darby&mdash;</div>
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
