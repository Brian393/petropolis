<template>
  <div id="map">
  </div>
</template>

<script>
import 'ol/ol.css'
import {Map, View} from 'ol'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
export default {
  name: 'MapBioregion',
  data: function () {
    return {
      olmap: undefined
    }
  },
  mounted: function () {
    console.log('$route.name:', this.$route.name, ' $route.params.subitem:', this.$route.params.subitem)
    this.olmap = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        center: [0, 0],
        zoom: 0
      })
    })
  }
}
</script>
