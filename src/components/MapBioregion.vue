<script>
import Map from './Map.vue'

import {View} from 'ol'
import {Tile, Group} from 'ol/layer'
import {XYZ} from 'ol/source'
import {fromLonLat} from 'ol/proj'

import {eventBus} from '../main'

export default {
  name: 'MapBioregion',
  extends: Map,
  data: function () {
    return {
      centerPoints: {
        // #TODO: these probably could have better names like watershedIntroduction, watershedHanford, watershedHanfordLegacy to be a bit more semantically obvious
        introductionwater: {
          center: [-120.4, 46.1],
          resolution: 700
        },
        introductionbio: {
          center: [-125.2, 51.0],
          resolution: 4900
        },
        terminals: {
          center: [-122.9, 45.8],
          resolution: 220
        },
        hanford1: {
          center: [-119.54, 46.692],
          resolution: 4
        },
        legacy: {
          center: [-119.529, 46.555],
          resolution: 6
        },
        floods: {
          center: [-119.51, 46.607574],
          resolution: 50
        },
        plumes: {
          center: [-119.51, 46.607574],
          resolution: 50
        },
        stopit: {
          center: [-122.68, 45.84],
          resolution: 220
        },
        dams: {
          center: [-119.9, 46.9],
          resolution: 700
        },
        transformation: {
          center: [-118.0, 45.6],
          resolution: 1200
        }
      } // end centerPoints
    }
  },
  computed: {
    bioregionBaseLayers: function () {
      return [
        new Tile({
          source: new XYZ({
            url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}.png'
          }),
          opacity: 0.9,
          minResolution: 2,
          maxResolution: 16000
        }),
        new Tile({
          preload: Infinity,
          source: new XYZ({
            url: 'http://ecotopia.today/cascadia/Tiles/Cascadia/{z}/{x}/{y}.png'
          }),
          opacity: 1,
          minResolution: 2,
          maxResolution: 16000
        }),
        new Tile({
          source: new XYZ({
            url: 'https://services.arcgisonline.com/arcgis/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
          }),
          opacity: 0.7,
          minResolution: 2,
          maxResolution: 16
        })
      ]
    }
  },
  created: function () {
    eventBus.$on('route-click', this.initMap)
  },
  beforeDestroy: function () {
    eventBus.$off('route-click', this.initMap)
  },
  mounted: function () {
    this.initMap()
  },
  methods: {
    initMap: function () {
      switch (this.$route.name) {
        case 'bioegionIntroduction':
          this.initBioregionIntro()
          break
        default:
          this.initBioregionIntro()
      }
      this.olmap.on('pointermove', (e) => {
        const feature = this.olmap.forEachFeatureAtPixel(e.pixel, (feature) => { return feature })
        if (feature) {
          const props = feature.getProperties()
          if (props.key) {
            this.$refs.titletipContent.innerHTML = props.key
            this.titletip.setPosition(e.coordinate)
          }
        } else {
          this.closeTitletip()
          this.closeTooltip()
        }
      })
    },
    initBioregionIntro: function () {
      this.initBaseMap()
      this.olmap.setLayerGroup(new Group({
        layers: this.bioregionBaseLayers
      }))
      this.olmap.setView(new View({
        center: fromLonLat(this.centerPoints.introductionbio.center),
        resolution: this.centerPoints.introductionbio.resolution,
        minResolution: 2
        })
      )
    }
  }
}
</script>
