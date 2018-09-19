<style scoped>
.video {
position: relative; padding-bottom: 56.25%; height: 0;
}
.video iframe {
position: absolute; top: 0; left: 0; width: 100%; height: 100%;
}
</style>

<template>
  <div class="aside-content">
    <div class="title">
      <h1>"Dikes are safe at present"</h1>
    </div>
    <div class="video">
      <iframe width="350" height="300" src="https://www.youtube.com/embed/j6XQTXYDxFU?rel=0&amp;start=1027;autoplay=1&mute=1&amp;showinfo=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
    </div>
    <div class="caption">Vanport and the Columbia River Floods of 1948</div>
    <br>


        <Accordion :open="false">
          <h3 slot="header">legends</h3>
          <div class="flex">
            <div>
              <img src="icons/coal.png">
              Coal-fired plant
            </div>
            <div>
              <img src="icons/dam.png">
              Hydroelectric dam
            </div>
            <div>
              <img src="icons/natgas.png">
              Natural gas generator
            </div>
            <div>
              <img src="icons/nukes.png">
              Nuclear plant
            </div><div>
              <img src="icons/wind.png">
              Wind turbine
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
  name: 'MegaregionEnergy',
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
