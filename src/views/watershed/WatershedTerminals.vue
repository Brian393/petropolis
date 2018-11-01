<style scoped>

.quote {
font-weight: bold; font-style: italic; color: #333333; text-align: center;
}

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
      <h1>Coal, Oil, Gas: None Shall Pass</h1>
    </div>
    <img src="images/OilGas.jpg">
    <br>
    <div class="caption">Portland City Hall, Nov. 4, 2015</div>
    <br>
    <Accordion :open="false">
      <h3 slot="header">legends</h3>
      <div class="flex">
        <img src="icons/stop.png">&nbsp;Each marker locates one of the fossil-fuel terminals that has been stopped by citizen activism. A history of the movement, by its participants, is contained in the Twitter feeds that show up when you click on the icons.
      </div>
    </Accordion>
    <div class="justify">
      <p>One thing Cascadia has to teach is activism&mdash;successful activism. Success takes organized groups and spontaneous grassroots movements. The following sections of the map have been developed with an advocacy group, <a href="https://columbiariverkeeper.org" target="_blank" rel="nofollow">Columbia Riverkeeper</a>, in solidarity with dozens of regional organizations and initiatives.</p>

      <p>From the 2000s onward North America has witnessed a surge in oil and gas extraction, driven by the spread of unconventional techniques like hydraulic fracking as well as deliberate government policies. Wild schemes, improvised crews, ramshackle equipment: nothing was too quick or too dirty for the energy tycoons of North Dakota's Bakken and Canada's Tar Sands. Even the coal kingpins of Wyoming's Powder River Basin wanted a piece of the action. But all that dinosaur blood needed deepwater ports on the Pacific Ocean in order to reach the world's thirstiest markets in Asia. Between the devil and the deep blue sea stood the environmentalists of Oregon, Washington and British Columbia.</p>

      <p>The Lower Columbia River, from Portland to the mouth of the estuary, remains the multi-billion-dollar prize. Here, climate-wrecking energy can flow in by pipeline, or even worse, by rail, and ocean-going tankers can carry it away from numerous underused ports in two different states. Or at least, they could carry it away, if the region's inhabitants would let them.</p>

      <p>Over the last decade, a dozen proposed oil, coal and liquified natural gas terminals have been stopped dead in the water. Taking a remarkable step forward in December 2015, Portland's city council used zoning regulations to pass a <a href="https://www.portlandoregon.gov/citycode/article/557499" target="_blank" rel="nofollow">resolution</a> banning any installation of new fossil fuel terminals and any expansion of previously existing ones. On June 3, 2016, the derailment of a Union Pacific train carrying explosive Bakken crude through the Columbia Gorge town of Mosier, Oregon, showed just how dangerous the remaining facilities are to the local environment. Success is always relative and almost everything is yet to be done in the struggle against climate change.</p>

      <p> Click on the markers to see how an unprecedented spectrum of grassroots activists, teachers, students, faith-based groups, health professionals, unions, social-justice movements, tribes, environmentalists, NGOs and principled public officials have held the <a href="https://www.sightline.org/research/thin-green-line" target="_blank" rel="nofollow">Thin Green Line</a>, blocking the implementation of some of the world's most devastating energy plans. Each click shows a Twitter feed next to the site of an abandoned terminal project. An extraordinary range of people tell the story in their own words and images, with links to important press accounts and to the websites of those who are directly defending the river itself and the health of everyone on its shores.</p>

      <p>This story is hardly over. The orange markers show two proposed sites for a methanol plant that would turn a flood of fracked natural gas into useless plastic, polluting the air, the water and the quality of all our lives. So it's time to take action again:</p>

      <div class="quote"><p>No methanol on the Columbia!</p><br></div>

      <div class="video">
        <iframe width="375" height="211" src="https://www.youtube.com/embed/rNCb-1cDxUE?rel=0&amp;showinfo=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>></iframe>
      </div>
      <br>
    </div>
  </div>
</template>

<script>
import AppLightBox from '../../components/AppLightBox.vue'
import Accordion from '../../components/Accordion.vue'
import {eventBus} from '../../main'

export default {
  name: 'WatershedHanfordFloods',
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
  },
  mounted: function () {
    window.twttr.widgets.createTimeline(
      {
        sourceType: 'url',
        url: 'https://twitter.com/ColumbiaRKeeper'
      },
      this.$refs.riverkeeper
    )
  }
}
</script>
