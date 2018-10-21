<style scoped>
.quote {
font-weight: bold; font-style: italic; color: #333333;
}
</style>

<template>
  <div class="aside-content">
    <div class="title">
      <h1>The consequences</h1>
    </div>
    <div class="video">
      <img src="images/WasteTankInside.jpg" class="fullwidth">
    </div>
    <div class="caption">Inside a Hanford waste tank</div>
    <br>

        <Accordion :open="false">
          <h3 slot="header">legends</h3>
          <div class="flex">
            <p style="height:45px;"><strong>Nitrate</strong><br><img src="icons/legends/Nitrates_1.png"><img src="icons/legends/Nitrates_2.png"><br><span style='font-size: 80%;'>45,000 &nbsp;/&nbsp; 450,000 micrograms / liter</span></p>
            <p style="height:45px;"><strong>Iodine-129</strong><br><img src="icons/legends/Iodine-129.png"><img src="icons/legends/Iodine-129_2.png"><br><span style='font-size: 80%;'>1 &nbsp;/&nbsp; 10 pico-curies / liter</span></p>
            <p style="height:45px;"><strong>Technetium-99</strong><br><img src="icons/legends/Technetium-99_1.png"><img src="icons/legends/Technetium-99_2.png"><br><span style='font-size: 80%;'>900 &nbsp;/&nbsp; 9000 pico-curies / liter</span></p>
            <p style="height:45px;"><strong>Hexavalent chromium</strong><br><img src="icons/legends/HexavalentChromium_1.png"><img src="icons/legends/HexavalentChromium_2.png"><img src="icons/legends/HexavalentChromium_3.png"><br><span style='font-size: 80%;'>10 &nbsp;/&nbsp; 20 &nbsp;/&nbsp; 48-480 pico-curies / liter</span></p>
            <p style="height:45px;"><strong>Carbon Tetrachloride</strong><br><img src="icons/legends/CarbonTetrachloride_1.png"><img src="icons/legends/CarbonTetrachloride_2.png"><img src="icons/legends/CarbonTetrachloride_3.png"><img src="icons/legends/CarbonTetrachloride_4.png"><br><span style='font-size: 80%;'>5 &nbsp;/&nbsp; 50 &nbsp;/&nbsp; 500 &nbsp;/&nbsp; 1000 micrograms / liter</span></p>
            <p style="height:45px;"><strong>Strontium-90</strong><br><img src="icons/legends/Strontium_1.png"><img src="icons/legends/Strontium_2.png"><img src="icons/legends/Strontium_3.png"><img src="icons/legends/Strontium_4.png"><br><span style='font-size: 80%;'>8 &nbsp;/&nbsp; 80 &nbsp;/&nbsp; 800 &nbsp;/&nbsp; 8000 pico-curies / liter</span></p>
            <p style="height:45px;"><span style='font-size: 80%;'>All data is from 2015, except Iodine-129, which is from 2016. Since then, only the volume of hexavalent chromium has decreased significantly.</span></p>
          </div>
        </Accordion>

        <p>What you see on the map are plumes of contaminated groundwater spreading out from leaking tanks buried on the Central Plateau, or infiltrating from the many ditches, pools and pipelines where toxic chemicals were simply dumped without any pretense of containment.</p>

        <p>The plumes, which are artifically separated into distinct bodies by the graphic representation, have been identified and tracked by means of samples withdrawn by technicians from hundreds of test wells drilled into the Hanford Reservation, which is roughly twenty-five miles across from east to west.</p>

        <p>In addition to the groundwater contamination on the Plateau, the reactor sites along the Columbia River are marked by plumes of strontium-90. All these reactor sites are also surrounded by sinks of hexavalent chromium, which was added as an anti-corrosion agent to the cooling water. Hexavalent chromium is highly toxic to salmon in particular. It entered the river in large quantities during the period of Hanford's active operation.</p>

        <p>Over the last decade, billions of gallons of groundwater have been pumped out and filtered in a Herculean attempt to prevent further contamination. Yet the plumes persist, and hexavalent chromium still reaches the Columbia.</p>

        <p>On the Central Plateau, a massive Vitrification Plant is being constructed in an attempt to seal the tank waste inside glass rods for permanent burial. However, the $17-billion-and-counting "Vit plant," underway since 2002, has been plagued by technical difficulties, delays and cost overruns. High-level waste is not expected to be processed into glass until 2036&mdash;if ever, according to more skeptical evaluations.</p>

          <img src="images/WasteTank.jpg" class="fullwidth">
          <div class="caption">Hanford waste tank under construction</div>

        <p>Try to imagine the life of a single-shell carbon steel tank, up to one million gallons in capacity, welded together on site some fifty to seventy years ago, then encased in concrete, buried beneath the desert and gradually filled with chemical waste at high levels of radioactivity.</p>

        <p>Caustic solutions including sodium nitrate, sodium hydroxide, sodium aluminate and sodium phosphate are pumped to the tanks from neighboring facilities built to extract uranium and plutonium from the spent fuel slugs. Further solutions from equipment wash-downs are added to the mix. Suspended in the chemical bath are radionuclides including uranium, plutonium, strontium-90, cesium-137, americium-241 and technetium-99.</p>

        <p>Over time, water infiltrates into many of the 149 single-shell tanks, while others are subject to sustained high heat generated by the chemicals. The steel bubbles, pits and corrodes, while the concrete exterior slowly decays. The earliest tanks were designed for a useful life of only twenty years. Sixty-seven of the single-shell tanks eventually leak.</p>

        <p>When environmental cleanup finally begins, the liquid component of the waste is transferred from the leaking vessels to twenty-eight previously constructed double-shell tanks, which themselves were built anywhere from thirty to fifty years ago. Transfers are effected through existing vertical pipes leading down into the tank, some of them only a foot across. Extraordinarily dangerous vapors are released during the transfer process, which is done by relatively unprotected workers wrestling with pumps, pipes, remote-controlled devices and a plethora of plastic shrouds. Two of the supposedly safer double-shell tanks have also leaked. And as DOE acknowledges, chemical percipitates and radioactive waste remain behind in the drained single-shells:</p>

        <div class="quote"><p>"What’s left inside the tanks today are saltcakes, a material with the consistency of wet beach sand, and sludges. Also inside are wastes which resemble peanut butter, small broken icebergs, foam, or whitish crystals. None of these wastes are easily removed."</p></div>

        <img src="images/TankWorkers.jpg" class="fullwidth">
        <div class="caption">Tank workers at Hanford's C-farm</div>

        <p>Now try to imagine the lives of the workers who are nonetheless charged with monitoring the tanks, manipulating the pipes and valves, transferring the liquids and in some cases, removing the solids from the bottom of damaged units.</p>

        <p>The first thing to realize is that the empty "headspace" of each tank is suffused with toxic vapors from as many as 1,500 chemicals, which must be periodically vented to prevent explosions. Workers assigned to tank operations, often without air supplies or even masks, suddenly catch one bad breath of vapor. Just that breath can cause chemical burns in the lungs, followed by lifetime health consequences that may include neurological damage. In a frightening spate of events a few years ago, over seventy workers received medical examinations for vapor incidents during the period from March 2014 to September 2015. Statistics are hard to come by where Hanford employee injuries are concerned, but the number of workers seriously affected by vapor inhalation appears to run in the hundreds since environmental cleanup began.</p>

        <p>Other categories of workers have been exposed to airborne flakes of plutonium, which can lodge inside the body and cause lung, kidney and bone cancers. Thirty-one workers tested positive for plutonium inhalation after an incident that occurred during the demolition of the Plutonium Finishing Plant on June 8, 2017. In addition to entering their lungs, the microscopic flakes also accumulated on their clothes and even made it into their cars, carrying the contamination back to their homes and families.</p>

        <img src="images/PFPworkers.jpg" class="fullwidth">
        <div class="caption">Demolition of Plutionium Finishing Plant</div>

        <p>Workers and their advocates have pushed back. The Energy Employees Occupational Illness Compensation Program Act was passed in October 2000. It allows DOE nuclear workers to file claims for radiogenic cancers, berryllium poisoning and silicosis. To date, some 53,000 workers across the US have been awarded payouts capped at $400,000, for a total of approximately $12 billion. In March 2018, Washington state legislation was passed to relieve Hanford workers of the burden of proving which of the 1,500 vapor chemicals caused their illness (an impossible task in some cases). And in September 2018, in response to the spate of vapor incidents, the settlement of a Washington state lawsuit led to much more stringent safety measures for tank workers, including the systematic use of supplied air in vapor zones. These are major victories, which only became possible over a decade after the close of the Cold War.</p>

        <p>Local inhabitants have been a good deal less fortunate, such as the Hanford "downwinders" exposed to iodine-129 and other radioactive particles during the war. The immense majority of their cases (over three thousand) were rejected in 2015 after two decades of grueling litigation. DOE reportedly paid out a total of $60 million in legal fees, plus $7 million in compensation. And the official literature still tells you that nuclear reactors are no more dangerous than the cosmic rays absorbed during a flight across North America. The science of denial has been pushed to such extremes that all knowledge about the health effects of radioactive materials becomes dubious.</p>

        <p>Hanford is about the slow movement of toxic compounds through bodies, whether of soil, groundwater, river life or human flesh. Do the bodies in power even care? In 2018 the Department of Energy announced plans to to reclassify some of the solidified tank sludge as low-level waste, meaning that it could simply be covered in a specialized concrete, known as "grout" in cleanup jargon. The tank farms would then become de facto nuclear graveyards&mdash;abandoned for eternity, not thousands of feet underground in a natural chasm or a salt mine, but just a few feet below the surface.</p>
        <div class="video">
          <iframe width="350" height="197" src="https://www.youtube.com/embed/1FDp7cCG6rk?rel=0;showinfo=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
        </div>
        <div class="caption">A Culture of Silence at the Hanford Nuclear Site</div>

      <br>
      <Accordion>
        <h3 slot="header">sources</h3>

      <p>Data sources for the plumes:</p>
      <p>-- <a href="https://phoenix.pnnl.gov/apps/gisexplorer/index.html" target="_blank" rel="nofollow">Phoenix GIS Explorer</a></p>
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
import {eventBus} from '../../main'

export default {
  name: 'WatershedFalls',
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
  },
  methods: {
    emit: function (method, args) {
      eventBus.$emit(method, args)
    }
  }
}
</script>
