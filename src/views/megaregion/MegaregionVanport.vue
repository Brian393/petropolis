<style scoped>
.video {
position: relative; padding-bottom: 74.88%; height: 0;
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
      <h1>Planned city planned disaster</h1>
    </div>
    <div class="video">
      <iframe width="350" height="300" src="https://www.youtube.com/embed/z3Ncu-h_SEg?&ampmodestbranding=1&amp;autoplay=1&amp;autohide=1&amp;mute=1&amp;loop=1&amp;playlist=z3Ncu-h_SEg" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
    </div>
    <div class="caption">Vanport Flood</div>
    <br>

    <Accordion :open="false">
      <h3 slot="header">legends</h3>
      <div class="flex">
          <p>What you see is the plan of Vanport.<br><br>Streets and plazas are shown in green, buildings and facilities in gold, water features in bright blue.</p>
          <div class="quote-2">"All of the apartment buildings were constructed using an identical design. On the first floor, there were six two-bedroom apartments with single-bedroom apartments located on each end of the ground floor. Access to the apartments was via a stairwell situated between every two apartments. Four of these apartment buildings were connected to a central plant that provided heat, hot water, and electricity. Storage space for each apartment was also located in that building, as well as a laundry facility with four wringer washing machines."</div>
          <p>Source of the quote <a href="https://www.ohs.org/research-and-library/oregon-historical-quarterly/upload/Skovgaard-Vanport-Memories_OHQ-108_1_Spring-2007.pdf" target="_blank" rel="nofollow">here</a>.<br>Image of the original Vanport plan <a href="https://efiles.portlandoregon.gov/record/17133" target="_blank" rel="nofollow">here</a>.</p>
      </div>
    </Accordion>
    <br>

    <p>On May 30, 1948&mdash;it was Memorial Day, with everything ready for the downtown parade&mdash;residents of the workers' town of Vanport awoke to an official handbill slipped beneath the door:</p>

    <div class="quote"><p>REMEMBER<br>DIKES ARE SAFE AT PRESENT<br>YOU WILL BE WARNED IF NECESSARY<br>YOU WILL HAVE TIME TO LEAVE<br>DON'T GET EXCITED</p></div>

    <p>The Portland Housing Authority had built the city to provide lodging for over forty thousand laborers who took employment in the nearby Kaiser shipyards during World War II. The layout of the streets, buildings and plazas in the form of a recumbent lion was undoubtedly meant to evoke military power, bolstered by wartime production. The workers themselves came from across the state and across the country, drawn by patriotism, high wages, modern living, and for some, the prospect of relief from the racist violence of the South. There were all kinds of problems, but New Deal enthusiasm ran high. For a few short years, Vanport was a utopia.</p>

    <p>But Portland itself was a <a href="https://books.google.com/books?id=abhIDwAAQBAJ&lpg=PP1&dq=sundown%20town&pg=PT18#v=onepage&q&f=false" target="_blank" rel="nofollow">"sundown town"</a> that informally barred blacks from permanent inhabitation and property ownership, just as the state of Oregon had formally excluded black people by constitutional law at its foundation in 1859. Institutional racism was a heavy reality in the mid-1940s, despite the egalitarian policies of the federal government and the good will of fellow migrants, including many of Native American, Hispanic or Chinese origins.</p>

    <p>On that Memorial Day morning in 1948, three years after war's end, the population of the vast housing complex had shrunk to about 18,500. Of these, some 6,300 were black. Redlining in the city left them with nowhere else to go. The lowest point of Vanport was situated fifteen feet beneath the normal level of the Columbia River, so the threat to all the remaining migrants was obvious. Why didn't the Housing Authority take action?</p>

    <p>At 4:17 pm the disaster struck. A railroad embankment separating Vanport from Smith Lake gave way, as anyone could have predicted it would. Floodwaters from the Columbia River surged through the slough and into Vanport. The wall of water lifted entire buildings from the ground. In a matter of minutes, Oregon's second largest city was entirely destroyed. When the water receded the official death toll stood at fifteen, with seven more counted missing. But trust in anything official had been shattered. To this day, many believe the real toll was much higher.</p>

    <img src="images/VanportUnderwater.jpg">

    <p>Vanport&mdash;both the wartime city and the postwar flood&mdash;set the contradictory terms of racial coexistence in Portland, and more broadly, in the Pacific Northwest. The promise of an egalitarian society, offered by an idealistic democracy and violently undercut at street level, still characterizes the migrant experience. This is true for many black survivors of the flood, who settled in the nearby Albina neighborhood only to be driven out by the recent wave of gentrification. How long can the new Jim Crow continue?</p>

    <p>Yet the Vanport Flood has a second significance, also with decisive consequences. In the years after 1948, during the negotiation of the Columbia River Treaty with Canada, the flood was continually invoked as a justification for the construction of a fully integrated system of multipurpose dams. Every such dam, whatever its benefits, is also a planned disaster. Celilo Falls, along with untold numbers of sites held sacred by their Native American inhabitants, would be flooded with the same waters that had drowned the workers' metropolis. From Eugene Oregon to Vancouver BC, the bright lights of the Cascadian megaregion glitter against an historical background of raw coercive power, wielded over the destinies of beings both human and non-human.</p>

    <p>The flood tide of climate change advances, but remember just one thing. Dikes are safe at present. You will be warned if necessary. You will have time to leave. So don't get excited. Vanport is everywhere. Life goes on.</p>
    <br>
        <Accordion :open="false">
          <h3 slot="header">sources</h3>
          <div class="flex">
            <div>
              <p>For an introduction to Vanport, <a href="https://www.smithsonianmag.com/history/vanport-oregon-how-countrys-largest-housing-project-vanished-day-180954040/?no-ist" target="_blank" rel="nofollow">click here</a>.</p>
            </div>
          </div>
        </Accordion>

      <p></p>

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

export default {
  name: 'MegaregionVanport',
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
  }
}
</script>
