<style scoped>
.video {
position: relative; padding-bottom: 56.3%; height: 0;
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
      <h1>Swim to the mountains</h1>
    </div>
    <div class="video">
      <iframe width="350" height="197" src="https://player.vimeo.com/video/44999906?background=1" style="position:absolute;top:0;left:0;width:100%;height:100%;" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
    </div>
    <div class="caption">Chinook Salmon at Dagger Falls, Idaho<br>&mdash;video by Gary O. Grimm, <a href="https://vimeo.com/44999906">here</a>&mdash;</div>
    <br>
    <Accordion :open="false">
      <h3 slot="header">Legends</h3>
      <div class="flex">

      </div>
    </Accordion>
    <br>

<p></p>
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

export default {
  name: 'BioregionSalmonChinook',
  components: {
    Accordion,
    AppLightBox
  }
}
</script>
