<style scoped>
.caption {
text-align: center; font-style: italic; margin-top:5px;
}
.quote {
font-weight: bold; font-style: italic; color: #333333;
}
.justify {
text-align: justify;
}
</style>

<template>
  <div class="aside-content">
    <div class="title"><h1>Dog days</h1></div>
    <img src="images/ChumSalmon.jpg" class="fullwidth">
    <br>
    <div class="caption">Chum salmon in northern Cascadia</div>
    <br>
    <Accordion :open="false">
      <h3 slot="header">Work in progress!</h3>
      <div class="flex">
        <p>Check back after November 1 and the whole concept will be a lot clearer...</p>
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
  name: 'BioregionSalmonChum',
  components: {
    Accordion,
    AppLightBox
  }
}
</script>
