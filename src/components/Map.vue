<template>
  <div id="map">
  </div>
</template>

<script>
import 'ol/ol.css'
import {Map, View} from 'ol'
import {Tile, Vector as VectorLayer} from 'ol/layer' // TileLayer Group
import {XYZ, Vector as VectorSource} from 'ol/source' // OSM
import {GeoJSON} from 'ol/format'
import {Style, Stroke, Fill, Icon} from 'ol/style'
import {fromLonLat} from 'ol/proj'
import {bbox as LoadingStrategy} from 'ol/loadingstrategy'

export default {
  name: 'Map',
  data: function () {
    return {
      olmap: undefined,
      centerPoints: {
        bioregion: [-121.2, 51.0],
        watershed: [-118.8, 46.1],
        metropolis: [-122.112002, 45.564222],
        introductionwater: {
          center: [-118.8, 46.1],
          resolution: 700
        },
        introductionbio: {
          center: [-121.2, 51.0],
          resolution: 4500
        },
        introductionmetro: {
          center: [-122.112002, 45.564222],
          resolution: 180
        },
        energy: {
          center: [-119.023311, 46.864322],
          resolution: 798
        },
        terminals: {
          center: [-122.68, 45.84],
          resolution: 220
        },
        hanford1: {
          center: [-119.46, 46.637574],
          resolution: 70
        },
        legacy: {
          center: [-119.5199, 46.555],
          resolution: 6
        },
        floods: {
          center: [-119.46, 46.607574],
          resolution: 50
        },
        plumes: {
          center: [-119.46, 46.607574],
          resolution: 50
        },
        crops: {
          center: [-117.6, 46.5],
          resolution: 900
        },
        stopit: {
          center: [-122.68, 45.84],
          resolution: 220
        },
        dams: {
          center: [-117.9, 46.9],
          resolution: 700
        },
        coulee: {
          center: [-118.989, 47.948],
          resolution: 6
        },
        basin: {
          center: [-118.989, 46.9],
          resolution: 300
        }
      } // end centerPoints
    }
  },
  mounted: function () {
    this.initMap()
  },
  watch: {
    '$route' (to, from) {
      // react to route changes...
      // console.log('$route watch to:', to, 'from:', from)
      this.initMap()
    }
  },
  methods: {
    initMap: function () {
      console.log('initMap $route.name:', this.$route.name)
      switch (this.$route.name) {
        case 'watershedIntroduction':
          this.initWatershedIntro()
          break
        case 'watershedTerminals':
          this.initWatershedTerminals()
          break
        default:
          this.initWatershedIntro()
      }
    },
    makeGeoJSONPointVectorLayer: function (url, iconPath, label, minResolution, maxResolution) {
      return new VectorLayer({
        source: new VectorSource({
          url: url,
          format: new GeoJSON(),
          strategy: LoadingStrategy
        }),
        minResolution: minResolution,
        maxResolution: maxResolution,
        style: new Style({
          image: new Icon({
            src: iconPath
          })
        }),
        label: label,
        legendImgSrc: iconPath
      })
    },
    makeGeoJSONLineVectorLayer: function (url, label, minResolution, maxResolution, strokeColor, width) {
      return new VectorLayer({
        source: new VectorSource({
          format: new GeoJSON(),
          url: url
        }),
        minResolution: minResolution,
        maxResolution: maxResolution,
        style: new Style({
          stroke: new Stroke({
            color: strokeColor,
            width: width
          })
        }),
        label: label,
        strokeColor: strokeColor
      })
    },
    makeGeoJSONFillVectorLayer: function (url, label, minResolution, maxResolution, strokeColor, width, fillColor) {
      return new VectorLayer({
        source: new VectorSource({
          format: new GeoJSON(),
          url: url
        }),
        minResolution: minResolution,
        maxResolution: maxResolution,
        style: new Style({
          stroke: new Stroke({
            color: strokeColor,
            width: width
          }),
          fill: new Fill({
            color: fillColor
          })
        }),
        fill: fillColor,
        label: label,
        fillColor: fillColor
      })
    },
    initWatershedIntro: function () {
      this.olmap = new Map({
        target: 'map',
        layers: [
          // tiles[4]
          new Tile({
            source: new XYZ({
              url: 'https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}'
            }),
            opacity: 0.9,
            minResolution: 2,
            maxResolution: 16000,
            label: 'Introduction',
            initialViewKey: 'introductionwater'
          }),
          // tiles[3]
          new Tile({
            preload: Infinity,
            source: new XYZ({
              url: 'http://ecotopia.today/cascadia/Tiles/Columbia/{z}/{x}/{y}.png'
            }),
            opacity: 1,
            minResolution: 2,
            maxResolution: 16000,
            label: 'CustomTiles'
          }),
          // tiles[16]
          new Tile({
            source: new XYZ({
              url: 'https://basemap.nationalmap.gov/arcgis/rest/services/' +
                  'USGSTopo/MapServer/tile/{z}/{y}/{x}'
            }),
            opacity: 0.9,
            minResolution: 1,
            maxResolution: 8
          })
          // ,
          // Terminals
          // new Tile({
          //   layers: [
          //     this.makeGeoJSONPointVectorLayer('../../assets/geojson/stopped.geojson', '../../assets/icons/stop.png', null, 2, 32000),
          //     this.makeGeoJSONPointVectorLayer('../../assets/geojson/planned.geojson', '../../assets/icons/stopit.png', null, 2, 32000)
          //   ],
          //   label: 'Terminals',
          //   initialViewKey: 'terminals'
          // }),
          // Terminals.setVisible(false);
          // Dams
          // new Tile({
          //   layers: [
          //     this.makeGeoJSONPointVectorLayer('../../assets/geojson/Rapids.geojson', '../../assets/icons/waterfall.png', null, 2, 32000),
          //     this.makeGeoJSONPointVectorLayer('../../assets/geojson/MajorHydroCRB.geojson', '../../assets/icons/damOther.png', null, 2, 32000),
          //     this.makeGeoJSONPointVectorLayer('../../assets/geojson/Bureau.geojson', '../../assets/icons/damBR.png', null, 2, 32000),
          //     this.makeGeoJSONPointVectorLayer('../../assets/geojson/ArmyCorps.geojson', '../../assets/icons/damAC.png', null, 2, 32000)
          //   ],
          //   label: 'Dams',
          //   initialViewKey: 'dams'
          // }),
          // Dams.setVisible(false);
          // tiles[8]
          // new Tile({
          //   preload: Infinity,
          //   source: new XYZ({
          //     url: 'http://ecotopia.today/cascadia/Tiles/Hanford/{z}/{x}/{y}.png'
          //   }),
          //   opacity: 1,
          //   minResolution: 1,
          //   maxResolution: 160,
          //   label: 'Hanford',
          //   initialViewKey: 'hanford1'
          // }),
          // tiles[8].setVisible(false);
          //  Plumes
          // new Tile({
          //   layers: [
          //     new Tile({
          //       preload: Infinity,
          //       source: new XYZ({
          //         url: 'http://ecotopia.today/cascadia/Tiles/Hanford/{z}/{x}/{y}.png'
          //       }),
          //       opacity: 1,
          //       minResolution: 2,
          //       maxResolution: 80
          //     }),
          //     new Tile({
          //       preload: Infinity,
          //       source: new XYZ({
          //         url: 'http://ecotopia.today/cascadia/Tiles/Leaks/{z}/{x}/{y}.png'
          //       }),
          //       opacity: 1,
          //       minResolution: 2,
          //       maxResolution: 80
          //     }),
          //     new Tile({
          //       preload: Infinity,
          //       source: new XYZ({
          //         url: 'http://ecotopia.today/cascadia/Tiles/HanfordPlumes/{z}/{x}/{y}.png'
          //       }),
          //       opacity: 1,
          //       minResolution: 2,
          //       maxResolution: 80
          //     })
          //   ],
          //   label: 'Plumes',
          //   initialViewKey: 'plumes'
          // }),
          // Plumes.setVisible(false);
          //  tiles[2]
          // new Tile({
          //   preload: Infinity,
          //   source: new XYZ({
          //     url: 'http://ecotopia.today/cascadia/Tiles/Floods/{z}/{x}/{y}.png'
          //   }),
          //   opacity: 0.7,
          //   minResolution: 2,
          //   maxResolution: 16000,
          //   label: 'Missoula floods',
          //   initialViewKey: 'floods'
          // })
          // tiles[2].setVisible(false);
        ],
        view: new View({
          center: fromLonLat(this.centerPoints.introductionwater.center),
          resolution: this.centerPoints.introductionwater.resolution,
          zoom: 0
        })
      })
    }, // end initWatershedIntro()
    initWatershedTerminals: function () {
      this.olmap = new Map({
        target: 'map',
        layers: [
          // tiles[4]
          new Tile({
            source: new XYZ({
              url: 'https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}'
            }),
            opacity: 0.9,
            minResolution: 2,
            maxResolution: 16000,
            label: 'Introduction',
            initialViewKey: 'introductionwater'
          }),
          // tiles[3]
          new Tile({
            preload: Infinity,
            source: new XYZ({
              url: 'http://ecotopia.today/cascadia/Tiles/Columbia/{z}/{x}/{y}.png'
            }),
            opacity: 1,
            minResolution: 2,
            maxResolution: 16000,
            label: 'CustomTiles'
          }),
          // tiles[16]
          new Tile({
            source: new XYZ({
              url: 'https://basemap.nationalmap.gov/arcgis/rest/services/' +
                  'USGSTopo/MapServer/tile/{z}/{y}/{x}'
            }),
            opacity: 0.9,
            minResolution: 1,
            maxResolution: 8
          }),
          this.makeGeoJSONPointVectorLayer('/geojson/stopped.geojson', '/icons/stop.png', undefined, 2, 32000),
          this.makeGeoJSONPointVectorLayer('/geojson/planned.geojson', '/icons/stopit.png', undefined, 2, 32000)

          // Dams
          // new Tile({
          //   layers: [
          //     this.makeGeoJSONPointVectorLayer('../../assets/geojson/Rapids.geojson', '../../assets/icons/waterfall.png', null, 2, 32000),
          //     this.makeGeoJSONPointVectorLayer('../../assets/geojson/MajorHydroCRB.geojson', '../../assets/icons/damOther.png', null, 2, 32000),
          //     this.makeGeoJSONPointVectorLayer('../../assets/geojson/Bureau.geojson', '../../assets/icons/damBR.png', null, 2, 32000),
          //     this.makeGeoJSONPointVectorLayer('../../assets/geojson/ArmyCorps.geojson', '../../assets/icons/damAC.png', null, 2, 32000)
          //   ],
          //   label: 'Dams',
          //   initialViewKey: 'dams'
          // }),
          // Dams.setVisible(false);
          // tiles[8]
          // new Tile({
          //   preload: Infinity,
          //   source: new XYZ({
          //     url: 'http://ecotopia.today/cascadia/Tiles/Hanford/{z}/{x}/{y}.png'
          //   }),
          //   opacity: 1,
          //   minResolution: 1,
          //   maxResolution: 160,
          //   label: 'Hanford',
          //   initialViewKey: 'hanford1'
          // }),
          // tiles[8].setVisible(false);
          //  Plumes
          // new Tile({
          //   layers: [
          //     new Tile({
          //       preload: Infinity,
          //       source: new XYZ({
          //         url: 'http://ecotopia.today/cascadia/Tiles/Hanford/{z}/{x}/{y}.png'
          //       }),
          //       opacity: 1,
          //       minResolution: 2,
          //       maxResolution: 80
          //     }),
          //     new Tile({
          //       preload: Infinity,
          //       source: new XYZ({
          //         url: 'http://ecotopia.today/cascadia/Tiles/Leaks/{z}/{x}/{y}.png'
          //       }),
          //       opacity: 1,
          //       minResolution: 2,
          //       maxResolution: 80
          //     }),
          //     new Tile({
          //       preload: Infinity,
          //       source: new XYZ({
          //         url: 'http://ecotopia.today/cascadia/Tiles/HanfordPlumes/{z}/{x}/{y}.png'
          //       }),
          //       opacity: 1,
          //       minResolution: 2,
          //       maxResolution: 80
          //     })
          //   ],
          //   label: 'Plumes',
          //   initialViewKey: 'plumes'
          // }),
          // Plumes.setVisible(false);
          //  tiles[2]
          // new Tile({
          //   preload: Infinity,
          //   source: new XYZ({
          //     url: 'http://ecotopia.today/cascadia/Tiles/Floods/{z}/{x}/{y}.png'
          //   }),
          //   opacity: 0.7,
          //   minResolution: 2,
          //   maxResolution: 16000,
          //   label: 'Missoula floods',
          //   initialViewKey: 'floods'
          // })
          // tiles[2].setVisible(false);
        ],
        view: new View({
          center: fromLonLat(this.centerPoints.terminals.center),
          resolution: this.centerPoints.terminals.resolution,
          zoom: 0
        })
      })
    }

  }
}
</script>
