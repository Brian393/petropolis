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
    <div class="title"><h1>Bioregional turn</h1></div>
    <img src="images/Cascade.jpg" class="fullwidth">
    <br>
    <div class="caption">Falling water, Olympic Peninsula</div>
    <br>
    <Accordion :open="false">
      <h3 slot="header">Work in progress!</h3>
      <div class="flex">
        <p>It looks good at first but rapidly falls apart. Check back after November 1 and the whole concept will be a lot clearer...</p>
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

<script>

export default {
  name: 'BioregionSalmonChum'
}
</script>
