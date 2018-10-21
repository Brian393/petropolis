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
      <h1>The site</h1>
    </div>
      <img src="images/Hanford/HanfordEmergency.gif" class="fullwidth">
    <div class="caption">Something's always happening at Hanford</div>
    <br>
        <Accordion :open="false">
          <h3 slot="header">legends</h3>
          <div class="flex">
            <p>This map uses a combination of satellite imagery and Lidar elevation data to show the texture of the desert.</p>
          </div>
        </Accordion>

        <p>The Hanford Nuclear Reservation is an entombed landscape—a vast outdoor monument to the madness of war and the overwhelming power of engineering.</p>

        <p>The natural area was used by the Yakama, Nez Perce and Umatilla tribes, and especially by the Wanapum people who lived there year-round. The village of Hanford, like the other settlements surrounding it, was a tumbleweed town where hardscrabble farmers dreamt of irrigation schemes. In December of 1942 Lieutenant Colonel Frank Matthias planted his feet in the dust and said it was good: a vast empty peninsula far from any urban center, but close to existing railroad tracks and high-tension lines from the Bonneville and Grand Coulee dams, and bordered on two sides by the abundant cool waters of the Columbia River.</p>

        <p>During World War II the US government would create three uranium-fueled fission reactors and two chemical conversion plants on this 586 square-mile site, in order to make plutonium for the first atomic test at Trinity and for the bomb that destroyed Nagasaki. Over the following two decades they would add six more reactors and a large quantity of supporting infrastructure, not to produce electricity, but to guarantee "mutual assured destruction" during the Cold War.</p>

        <p>The site was initially managed by the Du Pont corporation, which set up model neighborhoods for officers, engineers, operators and staff in the nearby city of Richland. The construction of the main facilities required a huge mancamp, with a peak workforce of 45,000 people in June 1944. In less than two years the Du Pont workers would build, not only the B, D and F Reactors, but also vast arrays of storage tanks, pipeline systems, underground railroad tracks and long, deep, canyonlike concrete buildings where the nuclear fission products could be chemically separated, so as to yield purified plutonium. Remotely operated mechanisms and closed-circuit TV systems were invented for these separation processes, while small-batch tests requiring hand manipulation were performed in sealed gloveboxes with leaded-glass windows.</p>

        <img src="images/GloveBox.jpg" class="fullwidth">

        <p>Under the pressure of war, nuclear materials were handled with scant knowledge of their consequences. Production was pushed to high speeds. Wastes were scattered everywhere. The tension redoubled when the Soviets exploded their first nuclear device. On December 2-3, 1949, the top brass ordered Hanford workers to skip the normal eighty-day period during which the irradiated fuel slugs remained underwater, waiting for the short-lived isotopes to lose most of their deadly charge. Instead the material would be run through the processing plants after only eight days. This accelerated <a href="http://www.hanfordproject.com/greenrun.html" target="_blank" rel="nofollow"> Green Run</a> secretly released approximately 8,000 curies of iodine-131, dispersed directly into the air. The resulting levels of atmospheric radiation could then be compared with those of Ozersk, half a world away, where the Soviets' plutonium facilities were located. By poisoning the Hanford area, the military obtained a yardstick with which to measure the opposing side's production.</p>

        <p>Although it decays very rapidly, iodine-131 is among the most feared fission products, because it causes thyroid cancer. Untold numbers of people were exposed, with vegetation samples at nearby Kennewick showing levels a thousand times higher than the recommended daily limit. Hanford "downwinders" and their survivors rightly point to this callous open-air experiment to prove government responsibility for their later health disasters. Yet the inexcusable release of iodine-131 during the Green Run was dwarfed by the cumulative daily release of multiple radioactive materials over the active lifetime of the site. Uranium and plutonium, along with a long list of transuranic fission products and a whole catalog of dangerous chemicals, were leaked as flakes, particles, liquids or aerosols into the land, the air, the inhabitants' bodies and the waters of the Columbia River.</p>

        <p>Most of the atomic piles were shut down by 1971, with the final closure of N Reactor in 1987. Today the old cores have been shrouded with simple construction materials for a proposed thirty-to-fifty year "cool-down" period, with the exception of B Reactor which has been turned into a kind of museum. Yet Hanford is still a highly active and radioactive place, with a civilian nuclear power plant and research facilities on the site, as well as a plethora of rusting storage tanks, crumbling buildings, collapsing railroad tunnels, burial grounds and plumes of contaminants seeping through the groundwater.</p>

        <p>These same conditions ensure a profusion of coveted clean-up jobs providing exceptionally high wages for scientists, engineers, staff and simple laborers. The engineers in the offices have it made. The dangers that the workers encounter—such as the accidental inhalation of concentrated gasrs vented from corroded storage tanks—are generally not understood until the incidents occur.</p>

        <p>The suburban town of Richland, aptly dubbed "Plutopia" by investigative journalist Kate Brown, is still a model of Cold War prosperity. Visit it to see the good life. Meanwhile the vast site out in the desert remains a shrouded monument to the geological powers wielded by humanity in the Anthropocene.</p>
      <br>
      <Accordion>
        <h3 slot="header">sources</h3>
      <p>Data sources for this page include:</p>
      <p>-- <a href="" target="_blank" rel="nofollow"></a></p>
      <p>-- <a href="" target="_blank" rel="nofollow"></a></p>
      <p>-- <a href="" target="_blank" rel="nofollow"></a></p>
      <p>-- <a href="" target="_blank" rel="nofollow"></a></p>
      <p>-- <a href="" target="__blank"></a></p>
      <p>-- <a href="" target="_blank" rel="nofollow"></a></p>
      <p>-- <a href="" target="_blank" rel="nofollow"></a></p>
      <p>-- <a href="" target="_blank" rel="nofollow"></a></p>
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
  name: 'WatershedHanford',
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
