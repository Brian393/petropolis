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
    <div class="caption">Can you imagine walking all the way here?<br>(video by Gary O. Grimm, <a href="https://vimeo.com/44999906">here</a>)</div>
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

<script>

export default {
  name: 'BioregionSalmonChinook'
}
</script>
