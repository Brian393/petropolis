<template>
  <div>
    <div class="region-control">
      <v-layout row>
        <div v-for="(region, index) in regions" :key="index">
          <v-btn
            min-width="140"
            class="mx-2 mb-2 locate-button"
            dark
            @click="changeRegion(region)"
            :color="
              activeLayerGroup.region === region.name ? '#dc143c' : '#E44C6B'
            "
            :class="{
              'elevation-6': activeLayerGroup.region === region.name
            }"
          >
            {{ region.title }}
          </v-btn>
        </div>
      </v-layout>
    </div>
  </div>
</template>
<script>
//Store imports
import { mapGetters } from 'vuex';

// import the app-wide EventBus
import { EventBus } from '../../../../EventBus';

export default {
  name: 'route-control',
  methods: {
    changeRegion(region) {
      this.$router.push({
        path: `/${this.activeLayerGroup.fuelGroup}/${region.name}`
      });
      if (region.name === 'local') {
        EventBus.$emit('zoomToLocation');
      }
    }
  },
  computed: {
    ...mapGetters('map', {
      activeLayerGroup: 'activeLayerGroup',
      fuelGroups: 'fuelGroups',
      regions: 'regions'
    })
  }
};
</script>
<style lang="css" scoped>
.fuelgroup-control {
  position: absolute;
  left: 12px;
  bottom: 20px;
  z-index: 1;
}
.region-control {
  position: fixed;
  right: calc(50% + 25px);
  bottom: 20px;
  z-index: 1;
}
</style>
