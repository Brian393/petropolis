<template>
  <div>
    <div class="fuelgroup-control">
      <div v-for="(fuelGroup, index) in fuelGroups" :key="index">
        <v-btn
          min-width="140"
          class="mx-2 mb-2 locate-button"
          dark
          @click="changeFuelGroup(fuelGroup)"
          :color="
            activeLayerGroup.fuelGroup === fuelGroup.name
              ? '#dc143c'
              : '#E44C6B'
          "
          :class="{
            'elevation-6': activeLayerGroup.fuelGroup === fuelGroup.name
          }"
        >
          {{ fuelGroup.title }}
        </v-btn>
      </div>
    </div>
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
    changeFuelGroup(fuelGroup) {
      this.$router.push({ path: `/petropolis/${fuelGroup.name}` });
    },
    changeRegion(region) {
      this.$router.push({
        path: `/petropolis/${this.activeLayerGroup.fuelGroup}/${region.name}`
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
  position: absolute;
  left: 45%;
  bottom: 20px;
  z-index: 1;
}
</style>
