<template>
  <div class="aside-content">
    <div class="title"><p><h1>Outside in</h1></p></div>
    <img src="images/waterbody.png"><br><div class="caption">Does the territory inhabit you?</div><br>

      <Accordion :open="false">
        <h2 slot="header">map legend</h2>
        <div class="flex">
          <div>
            <img src="icons/nukes.gif">
            Nukes
          </div>
          <div>
            <img src="icons/natgas.png">
            Nat Gas
          </div>
          <div>
            <img src="icons/dam.png">
            Dam
          </div>
        </div>
      </Accordion>

<p>The Columbia Gorge is one of the most beautiful sights on earth. But a watershed is a lot more than a beautiful view.</p>

<p>The Columbia River watershed is a far-flung territory including parts of six US states and one Canadian province. Its border is traced, not by governments or treaties, but by every drop of liquid that finds a common path to the ocean.</p>

<p>Rainfall washes over forested slopes and grassy plains. Snow and ice collect on mountain peaks. Dew glistens on high deserts. Groundwater bubbles up from artesian springs. Pools spill over into rivulets that become creeks and gushing torrents, before rejoining rivers that gradually converge into a powerful flood. A watershed is defined by endless circulation through a territory. What it takes from the clouds, it gives back to the sea.</p>

<p>Human bodies are up to 60% water. We too are part of the shed, along with other living species. What we do outside ourselves inevitably seeps back in.</p>

<p>This map is about political ecology. It suggests that human decisions are shaped by exterior realities that have always already gotten under our skin. Like most maps, this one will guide you to real and imaginary places. It will deliver loads of information, with a wealth of topographical detail that increases as you zoom in. It will also show you texts and images, and it will even talk to you via multimedia recordings. The aim is to provide multiple viewpoints on a reality that is at once pragmatic and utopian.</p>

<p>The main sections are accessed through the navigational bar at the top, while specific locations and themes are reached by the panel at lower left. Sometimes further buttons appear at the bottom of the map, to take you through more complex stories. When in doubt, just click on any word or marker or object that you see, and there's a good chance it will reveal something.</p>

<p>Watershed is a scientific category that provides the frame for citizen activism and advocacy. Two riskier and more speculative headings also appear: Megaregion and Bioregion. They're like the red and the blue pill. Which one will you choose? Which one is which?</p>

<p>This project has been made using public research and open-source software, with generous contributions from a growing list of local organizations and inhabitants. A legend for each map can be found at the top of the text column. Sources and collaborators are identified at the end. Pages will be added as new possibilities emerge. The whole thing has been coordinated by a Portland-based artist and curator, Mack McFarland, and by an inquisitive stranger, Brian Holmes, who came to the Pacific Northwest with the quixotic hope of "Learning from Cascadia."</p>

      <Accordion>
        <h2 slot="header">sources</h2>
              A Link: <a href="http://ecotopia.today/" target="_blank" title="ecotopia.today">Link to ecotopia.today.</a> Images: <AppLightBox :images="images">Dam Light Box</AppLightBox>
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

export default {
  name: 'WatershedIntroduction',
  components: {
    Accordion,
    AppLightBox
  },
  data: function () {
    return {
      images: [
        {
          thumb: 'images/Dams/ArrowLakesDam.jpg',
          src: 'images/Dams/ArrowLakesDam.jpg',
          caption: 'ArrowLakesDam'
        },
        {
          thumb: 'images/Dams/BonnevilleDam.jpg',
          src: 'images/Dams/BonnevilleDam.jpg',
          caption: 'BonnevilleDam'
        },
        {
          thumb: 'images/Dams/BoundaryDam.jpg',
          src: 'images/Dams/BoundaryDam.jpg',
          caption: 'BoundaryDam'
        },
        {
          thumb: 'images/Dams/BridgeRiverDam.jpg',
          src: 'images/Dams/BridgeRiverDam.jpg',
          caption: 'BridgeRiverDam'
        }
      ]
    }
  }
}
</script>
