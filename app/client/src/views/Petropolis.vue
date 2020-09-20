<template>
  <v-app id="wg-app" data-app :class="{ 'wg-app': true }">
    <v-expand-transition>
      <v-navigation-drawer
        v-model="drawer"
        :width="!selectedCoorpNetworkEntity ? 460 : 600"
        class="elevation-6"
        stateless
        app
        clipped
        right
      >
        <side-panel></side-panel>
      </v-navigation-drawer>
    </v-expand-transition>

    <v-app-bar app clipped-right height="60" color="#dc143c" dark>
      <v-toolbar-title
        @click="goToHome()"
        flat
        class="logo headline font-weight-bold black--text mr-3"
        >Just Transition</v-toolbar-title
      >
      <v-tooltip right>
        <template v-slot:activator="{ on }">
          <v-btn
            v-on="on"
            small
            depressed
            fab
            color="rgb(228, 76, 107)"
            class="ml-0"
            @click="openWebsite()"
            ><v-icon medium>fas fa-question</v-icon></v-btn
          > </template
        ><span>Open Website</span>
      </v-tooltip>

      <v-spacer></v-spacer>

      <div v-for="(fuelGroup, index) in fuelGroups" :key="index">
        <v-btn
          min-width="140"
          class="mx-10"
          :dark="activeLayerGroup.fuelGroup === fuelGroup.name ? false : true"
          @click="changeFuelGroup(fuelGroup)"
          :color="
            activeLayerGroup.fuelGroup === fuelGroup.name ? 'white' : '#E44C6B'
          "
          :class="{
            'elevation-0': activeLayerGroup.fuelGroup !== fuelGroup.name,
            'font-weight-bold black--text':
              activeLayerGroup.fuelGroup === fuelGroup.name,
            'elevation-6': activeLayerGroup.fuelGroup === fuelGroup.name
          }"
        >
          {{ fuelGroup.title }}
        </v-btn>
      </div>
      <v-spacer></v-spacer>
      <span class="title pr-5">before it's too late</span>
      <v-btn icon @click.stop="drawer = !drawer"
        ><v-icon medium>{{ drawer ? '$close' : '$menu' }}</v-icon></v-btn
      >
    </v-app-bar>

    <v-content>
      <v-container style="max-height: 100%;" fluid fill-height class="pa-0">
        <app-viewer />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { EventBus } from '../EventBus.js';
import Viewer from '../components/viewer/viewer';
import SidePanel from '../components/core/SidePanel';
//Store imports
import { mapMutations, mapGetters } from 'vuex';
import { mapFields } from 'vuex-map-fields';

export default {
  name: 'wg-app',
  props: ['fuelGroup', 'region'],
  computed: {
    ...mapFields('map', {
      selectedCoorpNetworkEntity: 'selectedCoorpNetworkEntity',
      fuelGroups: 'fuelGroups'
    }),
    ...mapGetters('map', {
      activeLayerGroup: 'activeLayerGroup',
      fuelGroups: 'fuelGroups'
    })
  },
  components: {
    'app-viewer': Viewer,
    'side-panel': SidePanel
  },
  data() {
    return {
      drawer: true
    };
  },
  methods: {
    goToHome() {
      if (this.$router.currentRoute.name === 'oil') {
        EventBus.$emit('resetMap');
      }
      this.$router.push({ name: 'oil' });
    },
    openWebsite() {
      window.open('https://its.timetochange.today', '_blank');
    },
    zoomToLocation() {
      if (this.region === 'local') {
        EventBus.$emit('zoomToLocation');
      }
    },

    changeFuelGroup(fuelGroup) {
      this.$router.push({ path: `/${fuelGroup.name}` });
      EventBus.$emit('noMapReset');
    },
    ...mapMutations('map', {
      setActiveLayerGroup: 'SET_ACTIVE_LAYERGROUP'
    })
  },
  created() {
    this.setActiveLayerGroup({
      fuelGroup: this.fuelGroup,
      region: this.region
    });
  },
  watch: {
    $route() {
      this.setActiveLayerGroup({
        fuelGroup: this.fuelGroup,
        region: this.region
      });
      this.zoomToLocation();
    }
  },
  mounted() {
    // inform registered cmps that the app is mounted and the dynamic
    // components are available
    EventBus.$emit('app-mounted');
  }
};
</script>
