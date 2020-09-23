<template>
  <div class="mt-4">
    <v-tooltip right>
      <template v-slot:activator="{ on }">
        <v-btn
          class="share-button"
          v-on="on"
          @click="visible = true"
          color="#dc143c"
          fab
          dark
          x-small
          ><v-icon medium>fas fa-share</v-icon></v-btn
        >
      </template>
      <span>Share Map</span>
    </v-tooltip>
    <!-- CREATE SCENARIO DIALOG -->
    <v-dialog v-model="show" max-width="400" @keydown.esc="visible = false">
      <v-card class="pb-1">
        <v-app-bar color="#dc143c" flat height="50" dark>
          <v-icon class="mr-3">fas fa-share</v-icon>
          <v-toolbar-title>Link to map </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-app-bar-nav-icon @click.stop="visible = false"
            ><v-icon>close</v-icon></v-app-bar-nav-icon
          >
        </v-app-bar>
        <v-card-text class="mt-5">
          <v-form>
            <v-text-field
              ref="mapLink"
              readonly
              :value="mapShareLink"
              label="Map shareable link"
            >
              <template slot="append-outer">
                <v-tooltip left>
                  <template v-slot:activator="{ on }"
                    ><v-icon @click="copyMapLink" v-on="on"
                      >content_copy</v-icon
                    ></template
                  ><span>Copy</span>
                </v-tooltip>
              </template>
            </v-text-field>
          </v-form>
        </v-card-text>
        <v-alert class="mx-2 mb-1" dense outlined type="info" elevation="0">
          Copy and paste the link to share the map.
        </v-alert>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { toLonLat, fromLonLat } from 'ol/proj';

export default {
  props: {
    map: { type: Object, required: true }
  },
  data: () => ({
    mapShareLink: '',
    visible: false,
    previousMapZoom: null
  }),
  computed: {
    show: {
      get() {
        return this.visible;
      },
      set(value) {
        if (!value) {
          this.$emit('close');
          this.mapShareLink = '';
        }
      }
    }
  },
  methods: {
    createShareLink() {
      let url = window.location.href;
      url = url.split('?')[0];
      const center = this.map.getView().getCenter();
      const zoom = this.map.getView().getZoom();
      const visibleLayers = [];
      this.map
        .getLayers()
        .getArray()
        .forEach(layer => {
          if (layer.getVisible() && layer.get('displayInLegend')) {
            visibleLayers.push(layer.get('name'));
          }
        });
      const centerLonLat = toLonLat(center).map(e => e.toFixed(3)).reverse();
      this.mapShareLink = `${url}?center=${centerLonLat.toString()}&zoom=${zoom
        .toFixed(3)
        .toString()}&layers=${visibleLayers.toString()}`;
    },
    copyMapLink() {
      let mapLink = this.$refs.mapLink.$el.querySelector('input');
      mapLink.select();
      document.execCommand('copy');
    },
    updateRouterQuery() {
      const center = this.map.getView().getCenter();
      const centerLonLat = toLonLat(center).map(e => e.toFixed(3)).reverse();
      this.$route.meta.fromEvent = true;
      this.$router.replace({ query: { center: centerLonLat.toString() } });
    },
    updateMap() {
      // Set  map center
      if (this.$route.query && this.$route.query.center) {
        const coordinate = this.$route.query.center.split(',').map(Number);
        this.map.getView().setCenter(fromLonLat(coordinate.reverse()));
      } else {
        this.updateRouterQuery();
      }
      const zoom = this.$route.query.zoom || this.previousMapZoom;
      // Set map zoom
      if (zoom) {
        this.map.getView().setZoom(parseFloat(zoom));
      }
      let queryVisibleLayers;
      if (this.$route.query && this.$route.query.layers) {
        queryVisibleLayers = this.$route.query.layers.split(',');
      }
      this.map
        .getLayers()
        .getArray()
        .forEach(layer => {
          // Turn on/off layers based on the query data if user pastes a shareable map link.
          if (
            Array.isArray(queryVisibleLayers) &&
            layer.get('displayInLegend')
          ) {
            if (queryVisibleLayers.includes(layer.get('name'))) {
              layer.setVisible(true);
            } else {
              layer.setVisible(false);
            }
          }
        });
    }
  },
  watch: {
    show() {
      if (this.show === true && this.map) {
        this.createShareLink();
      }
    },
    $route(newValue, oldValue) {
      // Reset previous zoom if group is changed..
      if (newValue.path !== oldValue.path) {
        this.previousMapZoom = null;
      }
      if (newValue.meta.fromEvent === true) {
        newValue.meta.fromEvent = false;
        return;
      }
      this.updateMap();
    }
  },
  mounted() {
    if (this.map) {
      this.updateMap();
      this.map.on('moveend', () => {
        this.previousMapZoom = this.map.getView().getZoom();
        this.updateRouterQuery();
      });
    }
  }
};
</script>

<style scoped>
.v-card__text,
.v-card__title {
  word-break: normal !important;
}
.share-button {
  z-index: 1;
}
</style>
