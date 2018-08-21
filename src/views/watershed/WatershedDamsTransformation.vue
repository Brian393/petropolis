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
      <h1>The rivers didn't suit them</h1>
    </div>
      <img src="images/BonnevilleConstruction.png" class="fullwidth">
    <div class="caption">Construction of Bonneville Dam, 1936</div>
    <br>

        <Accordion :open="false">
          <h3 slot="header">legends</h3>
          <div class="flex">
              Looking out over The Long Narrows is Tsagaglalal, "She Who Watches." Her legend is told by the Wishram people:<br><br><em>A woman had a house where the village of Nixluidix was later built. She was chief of all who lived in the region. That was a long time before Coyote came up the river and changed things and people were not yet real people.  After a time Coyote in his travels came to this place and asked the inhabitants if they were living well or ill. They sent him to their chief who lived up on the rocks, where she could look down on the village and know what was going on.<br><br>Coyote climbed up to the house on the rocks and asked "What kind of living do you give these people? Do you treat them well or are you one of those evil women?" "I am teaching them to live well and build good houses," she said.<br><br>"Soon the world will change," said Coyote, "and women will no longer be chiefs." Then he changed her into a rock with the command, "You shall stay here and watch over the people who live here."<br><br>All the people know that Tsagaglalal sees all things, for whenever they are looking at her those large eyes are watching them.</em><br><br>
              <img src="images/Tsagaglalal.png" class="fullwidth">
            </div>
        </Accordion>

      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam convallis lacus purus, nec sollicitudin lorem vulputate vitae. Nullam rutrum convallis nisi, eu pretium nisi pulvinar at. Quisque dolor risus, tempus at sem sed, venenatis semper eros. Aenean vel imperdiet quam. Duis eu mattis sem. Suspendisse bibendum vulputate magna eget malesuada. Morbi in commodo dui. Integer luctus ac ex in fermentum. Suspendisse finibus nulla at est gravida, et ultrices tellus varius.<br><br>Nunc ut lorem neque. Nullam lobortis eleifend faucibus. Ut posuere massa faucibus convallis fringilla. Phasellus ultrices laoreet est eu blandit. Sed congue ex quis ultrices pharetra. Proin urna velit, feugiat et convallis dapibus, gravida a libero. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Pellentesque luctus ultrices sapien ut molestie. Maecenas pulvinar vulputate sodales. Phasellus ut dui sit amet eros malesuada ultricies vitae vel lectus. Fusce purus purus, pellentesque ut faucibus feugiat, egestas ut nunc. Maecenas rutrum mauris id sem venenatis eleifend. Suspendisse id tempor arcu, vitae fringilla ex. Nam a ultrices tortor. Duis at tincidunt sem. Quisque mollis magna at mattis vestibulum.<br><br>Praesent gravida nisl mauris, sed fringilla eros fermentum eget. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Praesent quis dolor non ante gravida rutrum ac vitae enim. Pellentesque tristique mauris tristique nunc vehicula, id porta urna laoreet. Phasellus tempus, ex at volutpat varius, quam dui molestie ligula, ac pretium tellus mi at neque. Aenean vestibulum est blandit nisl eleifend placerat. Nunc et feugiat metus, at aliquet nisl. Donec commodo, turpis at fermentum efficitur, velit quam tristique nunc, eu pretium dui eros sit amet risus..</p>

      <br>
      <Accordion>
        <h3 slot="header">sources</h3>
      <p>For a full-spectrum investigation of the civilizational transformations leading up to and beyond climate change, see <a href="https://www.anthropocene-curriculum.org" target="blank">The Anthropocene Curriculum</a>, with which "Learning from Cascadia" is affiliated.</p>
      <p>Data sources for this page include:</p>
      <p>-- <a href="" target="_blank"></a></p>
      <p>-- <a href="" target="_blank"></a></p>
      <p>-- <a href="" target="_blank"></a></p>
      <p>-- <a href="" target="_blank"></a></p>
      <p>-- <a href="" target="__blank"></a></p>
      <p>-- <a href="" target="_blank"></a></p>
      <p>-- <a href="" target="_blank"></a></p>
      <p>-- <a href="" target="_blank"></a></p>
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

export default {
  name: 'WatershedDamsTransformation',
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
