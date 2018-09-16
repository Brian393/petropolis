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
      <h1>War time</h1>
    </div>
      <img src="images/Hanford/B_reactor.png" class="fullwidth">
    <div class="caption">Workers inserting fuel rods to B Reactor</div>
    <br>

        <Accordion :open="false">
          <h3 slot="header">legends</h3>
          <div class="flex">

            </div>
        </Accordion>

        <p>The Hanford Nuclear Reservation is an entombed landscape&mdash;a vast outdoor monument to the madness of war and the overwhelming power of engineering.</p>

        <p>The site was frequented by the Yakama, Nez Perce and Umatilla tribes, and particularly by the Wanapum people who live along the banks of what used to be Priest Rapids. In the early twentieth century Hanford itself was just a tumbleweed town where a few hardscrabble settlers dreamed of irrigation schemes. In December of 1942, Lieutenant Colonel Frank Matthias planted his feet in the restless dust and said it was good: a vast empty peninsula crossed by high-tension lines from the Grand Coulee Dam, and bordered on two sides by the abundant cool waters of the Columbia River.</p>

        <p>Here the US government would create three uranium-fueled fission reactors and a seemingly endless series of chemical conversion facilities to produce plutonium for the first atomic test at Trinity and for the bomb that destroyed Nagasaki. Over the following two decades they would add six more reactors to guarantee "mutual assured destruction" throughout the Cold War.</p>

        <p>The site was managed by the Du Pont corporation, which set up model neighborhoods for officers, engineers, operators and staff in nearby Richland. The construction of the main facilities required a huge mancamp, with a peak workforce of 45,000 people in June 1944. In less than two years the Du Pont workers would build, not only the B, D and F Reactors, but also vast arrays of storage tanks, pipeline systems, underground railroad tracks and long, deep, canyonlike concrete buildings where the transuranic fission products could be chemically separated, mostly via small-batch processes requiring hand manipulation through gloveboxes with leaded-glass windows.</p>

        <p>Under the pressure of war and later under the threat of the arms race, nuclear materials were handled with scant knowledge of their consequences. Production was pushed to the highest possible speeds. Wastes were scattered everywhere. On December 2-3, 1949, the military ordered workers to skip the normal two-month waiting period during which short-lived isotopes lost the majority of their radioactive charge. The accelerated "Green Run" secretly released 5,500 to 12,000 curies of iodine-131 and an even larger amount of xenon-133 directly into the atmosphere. The aim was to simulate peak Soviet production, while using airborne equipment to record its radioactive signature. The levels of radioactivity could then be compared with those of Ozersk, half a world away, where it was believed that the Soviets were carrying out similarly accelerated production runs.</p>

        <p>Hanford "downwinders" and their survivors point to this egregious act of outright poisoning to underscore government culpability for their later health disasters. Yet the inexcusable release of cancer-causing fission products during a planned event like the Green Run was dwarfed by the cumulative daily release of radioactive materials over the lifetime of the project. Uranium and plutonium, along with a long list of transuranic fission products and a whole catalog of dangerous chemicals, were leaked as flakes, particles, liquids or aerosols into the land, the air, the inhabitants' bodies and the waters of the Columbia River.</p>

        <p>Most of the atomic piles were shut down by 1971, with the final closure of N Reactor in 1987. Today the old cores have been shrouded with simple construction materials for a proposed thirty-to-fifty year "cool-down" period, with the exception of B Reactor which has been turned into a kind of museum. Yet Hanford is still a highly active and radioactive place, with a civilian nuclear power plant and research facilities on the site, as well as a plethora of storage tanks, crumbling buildings, collapsing railroad tunnels, burial grounds and plumes of contaminants seeping through the groundwater. The exact same conditions also ensure that there are plenty of coveted jobs providing exceptionally high wages for scientists, engineers, staff and simple laborers.</p>

        <p>The suburban town of Richland, aptly dubbed "Plutopia" by investigative journalist Kate Brown, remains a model of Cold War prosperity for mainstream American society&mdash;while the vast site out in the desert remains a shrouded monument to the quasi-geological powers acquired by humanity in the Anthropocene.</p>
      <br>
      <Accordion>
        <h3 slot="header">sources</h3>
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
