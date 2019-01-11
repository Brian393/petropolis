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
.quote-3 {
color: #333333; font-style: italic; text-align: center;
}
</style>

<template>
  <div class="aside-content">
    <div class="title">
      <h1>THE ARROWHEAD</h1></div>
      <h3>(An Indigenous Deconstruction of Historic and Contemporary Economic Racism)</h3><br>
      <img src="images/Redface.jpg" class="fullwidth">
      <br>
      <div class="caption">"Indian Chief," Redface intervention at PNCA, Sara Siestreem</div>
      <br>

<Accordion>
  <h3 slot="header">legends</h3>
  <div class="flex">
    <p>*at the request of the curator, I have provided an Indigenous deconstruction of historic and contemporary instances of racist economic strategies (cultural appropriation) in our community.<br><br><em>Digital photographs and text created by Sara Siestreem (<span style="font-variant: small-caps;">hanis coos</span>), 2018. Electrical and safety tape, commercially sourced.</em></p>
  </div>
</Accordion>

<p>The primary building that houses PNCA is a former federal post office designed by Lewis Parsons Hobart (American), opened in 1919. Carved into the travertine over eight of the doors on the ground floor are identical male “Chieftain” heads.</p>

<p>It is a racist act for people who are not Indigenous to use our people or reference to our culture as decoration or enhancement of their economic enterprise.</p>

<p>If the architect had been a Tribal member and the carvings were individualized to commemorate specific humans or contextualized within the carving tradition of his family, this would be an acceptable inclusion of the space. It would be informed by the culture that it referenced and the beneficiary would be appropriate.</p>

<p>For a hundred years this subtle feature has been imprinting the fallacy of acceptability and elevation of colonial entitlement to Indigenous property to every person who enters the space.</p>

<p>In order to negate this and draw attention to it, I have covered the faces of the carvings with red tape, identifying them as “red face”, a term that indicates the masquerading of Indigenous identity by a Euro descent person. I have covered the circular halo around the heads with yellow flourescent safety tape. These two colors combined indicate ambulance, or emergency health vehicles. I am working to protect all of us while we are in the space from the virus of institutionalized racism and deactivate the carvings for as long as I am permitted to.</p>

<img src="images/Hallway.jpg" class="fullwidth">

<p>There is a certain safety to look at these historical instances because the authors are gone and the guilt is somehow further out there. It is quite a bit more uncomfortable to look closer to home, to places and people who we love today.</p>

<p>I recently stayed at a popular resort in Seaview, Washington. This town is in the ancestral and contemporary territory of the Chinook Tribe. The owner of the resort has a stellar reputation as a fair and beloved businesswoman who does wonderful things for her community and employees. The theme of this resort is vintage trailers and eclectic accommodations. somehow looping in an invented Wester animal into the theme. The curtains had sort of a Western hunting theme, buffalo and other game animals and English hunting dogs.</p>

<p>On the first page of the resorts web site they say “come join the sea-tribe.” The term Tribe on this land mass refers to Indigenous people of this place. You must be born into one, you cannot join them. Pretending that you are in a Tribe or referring to you and your community as a Tribe if you are not a part of the original groups here is an act of red face. The website promised you could “explore the rich history,” yet at no time mentions the Chinook people.</p>

<p>The owner and this business are not Chinook, the actual sea-tribe's land they are occupying.</p>

<p>If you use the Arrowhead motif or commercial reference on this land mass, you are referring to Indigenous culture. We invented them and have been using them here for thousands and thousands of years. Arrowhead is a brand of travel trailer that were manufactured in the fifties (vintage cultural appropriation is still racist). They put me in the Arrowhead trailer.</p>

<p>The trailer was decorated with a collection of “Indian kitsch” that are ripe with differing problematics. On the bed there was a pillow decorated with an embroidered tee-pee. The Chinook people have plank houses, not tee-pees. There was a figurine of an owl in the bathroom. To many of the local Tribes of this region, an owl is a messenger of death and catastrophic change. This is a fairly sinister suggestion to causally encounter for an overnight stay. The gas stove that is in the trailer is a “Princess” brand. The “Indian Princess” stereotype works to fuel the epidemic of sexual violence against Indigenous women. Then there were the Cowboys (because you can’t have Indians without cowboys, right?). There was a refrigerator magnet of a Jack-a-lope, somehow looping an invented Western animal into the theme. The curtains had sort of a Western hunting theme, buffalo and other game animals and English hunting dogs.</p>

<p>Now I want to look at the dollars. The Arrowhead trailer rates are $113 for midweek days, $163 for Saturdays and $133 for Sundays. If the trailer were rented at every day of the year it could earn $44,772.00. Even if it were to only rent 50% of the time, it would earn $22,386.00. It is most likely it is somewhere in between the two at $30,000.00 (ish). The resort does not give the Chinook or any other Tribe any portion of that income.</p>

<p>The fortunate thing for the resort is that this particular trailer does not actually have the Arrowhead motif or word anywhere on it. They do not even need any machinery to fix this. If they were to stop calling this trailer “The Arrowhead,” remove the “join the sea-tribe” verbiage from their website, and do a once over throughout the resort to remove other kitsch items that refer to cultures not their own, they could eradicate the racist incidence they are currently benefiting from and align their business with their beliefs in a more successful manner.</p>

<p>As a way to pass the $163-dollar night of hot rage and impotent nausea I experienced in the Arrowhead, I made art that night. I photo documented each item and constructed some verbiage to deconstruct the problems. Most of that is contained here and is installed above the architectural interventions in the lobby of PNCA.</p>

<p>Today, I spoke with the owner about all of this at length. They said they have been called out on the verbiage on the website and other issues along these same lines in other trailers (African Queen, etc.) but decided to stick with it. They said they will think about the issues I pointed out and speak with their board about it. They said they would get back to me.</p>
<br>

<Accordion>
  <h3 slot="header"></h3>

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
  name: 'BioregionAwakeningDancing',
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
