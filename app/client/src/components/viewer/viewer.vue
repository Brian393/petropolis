<template>
  <div>
    <!-- OL MAP -->
    <div class="fullscreen">
      <app-ol-map
        class="fullscreen"
        ref="olmap"
      ></app-ol-map>
    </div>
  </div>
</template>

<script>
import appMap from './ol/Map';

export default {
  name: 'app-viewer',
  components: {
    'app-ol-map': appMap
  },
  data() {
    return {};
  },
  methods: {}
};
</script>
<style lang="css" scoped>
.fullscreen {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}
</style>
