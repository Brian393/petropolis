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
      <h1>Go superfund me</h1>
    </div>
    <img src="images/Arkema.jpg" class="fullwidth">
    <div class="caption">Cleanup at Arkema site</div>
    <br>

    <Accordion :open="false">
      <h3 slot="header"></h3>
      <div class="flex">
      </div>
    </Accordion>
    <br>

    <p>Half the problem of the Willamette River is up on the banks, where industrial leaks and residues continue to percolate into the water. So far this map covers only the upland sites managed by Oregon's Department of Environmental Quality. Zoom in for a look at the sites through the spyglass. Click the dark red shapes for a link to DEQ's reports on each site.</p>
    <br>
        <Accordion :open="false">
          <h3 slot="header">sources</h3>
          <div class="flex">
            <div>
              <p>Upland sites polgons based on:<br><a href="https://www.oregon.gov/deq/FilterDocs/PortlandHarborMap.pdf" target="_blank" rel="nofollow">DEQ interactive map</a><br><br>Street, railroad and building data from:<br><a href="https://www.openstreetmap.org" target="_blank" rel="nofollow">OpenStreetMap</a><br><br>Aerial image for spyglass:<br><a href="https://www.bing.com/maps" target="_blank" rel="nofollow">BingMaps</a><br><br>Topgraphic hillshade files:<br><a href="https://gis.dogami.oregon.gov/maps/lidarviewer" target="_blank" rel="nofollow">DOGAMI Lidar Viewer</a></p>
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
  name: 'MegaregionWillamette',
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
