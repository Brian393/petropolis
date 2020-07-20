<template>
  <div>
    <v-tooltip right>
      <template v-slot:activator="{ on }">
        <v-btn
          class="mx-2 zoom-buttons"
          style="top:20px;"
          v-on="on"
          fab
          dark
          x-small
          color="#dc143c"
          @click="zoom(1)"
        >
          <span style="font-size:22px;">+</span>
        </v-btn>
      </template>
      <span>Zoom In</span>
    </v-tooltip>
    <v-tooltip right>
      <template v-slot:activator="{ on }">
        <v-btn
          class="mx-2 zoom-buttons"
          style="top:60px;"
          v-on="on"
          fab
          dark
          x-small
          color="#dc143c"
          @click="zoom(-1)"
        >
          <span style="font-size:22px;">−</span>
        </v-btn>
      </template>
      <span>Zoom Out</span>
    </v-tooltip>
  </div>
</template>
<script>
import { easeOut } from 'ol/easing';

export default {
  props: {
    map: { type: Object, required: true }
  },
  name: 'zoom-control',
  methods: {
    zoom(delta) {
      if (!this.map || !this.map.getView()) {
        return;
      }
      const view = this.map.getView();
      const currentZoom = view.getZoom();
      if (currentZoom !== undefined) {
        const newZoom = view.getConstrainedZoom(currentZoom + delta);
        if (view.getAnimating()) {
          view.cancelAnimations();
        }
        view.animate({
          zoom: newZoom,
          duration: 250,
          easing: easeOut
        });
      }
    }
  }
};
</script>
<style lang="css" scoped>
.zoom-buttons {
  position: absolute;
  left: 12px;
  z-index: 1;
}
</style>
