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
      <h1>Chinook Salmon</h1>
    </div>
    <div class="video">
      <iframe width="350" height="197" src="https://www.youtube.com/embed/SOllUTBYZtE?&amp;autoplay=1&amp;mute=1&amp;loop=1&amp;playlist=SOllUTBYZtE" frameborder="0" allow="autoplay; encrypted-media; loop" allowfullscreen></iframe>
    </div>
    <div class="caption">Chinook salmon spawning</div>
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
  name: 'BioregionSalmonChinook'
}
</script>
