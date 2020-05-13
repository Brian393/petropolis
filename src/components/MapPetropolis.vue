<script>
import Map from './Map.vue'

import {View} from 'ol'
import {Tile, Group} from 'ol/layer'
import {XYZ} from 'ol/source'
import MVT from 'ol/format/MVT'
import VectorTileLayer from 'ol/layer/VectorTile'
import VectorTileSource from 'ol/source/VectorTile'
import {fromLonLat} from 'ol/proj'

import {Style, Stroke, Circle, Fill} from 'ol/style'
import {eventBus} from '../main'
import MediaLightBox from './MediaLightBox.js'

export default {
  name: 'MapPetropolis',
  extends: Map,
  data: function () {
    return {
      centerPoints: {
        pipelines: {
          center: [-99, 42.9],
          resolution: 9000
        },
        pipelinesContested: {
          center: [-99, 42.9],
          resolution: 9000
        },
        pipelinesAll: {
          center: [ 2.44, 30.81 ],
          resolution: 25000
        },
        coal: {
          center: [-97.5, 41],
          resolution: 5700
        },
        coalWorld: {
          center: [2.44, 30.81],
          resolution: 25000
        },
        gas: {
          center: [-94, 37],
          resolution: 9000
        },
        gasIndustry: {
          center: [-97, 37],
          resolution: 4500
        },
        gasWorld: {
          center: [2.44, 31.01],
          resolution: 30000
        }
      }, // end centerPoints, radius controls spotlight size
      radius: 300,
      mousePosition: undefined
    }
  },
  computed: {
    baseLayers: function () {
      let esriMapTile = new Tile({
        source: new XYZ({
          attributions: ['Powered by Esri',
            'Source: Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community'],
          url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        }),
        minResolution: 0.5,
        maxResolution: 20
      })
      esriMapTile.on('precompose', (e) => {
        this.spotlight(e)
      })
      esriMapTile.on('postcompose', function (e) {
        e.context.restore()
      })
      return [
        esriMapTile
      ]
    },
    petropolisOilLayers: function () {
      return [
      // Aerial
      ...this.baseLayers,
  //    this.makeGeoJSONFillVectorLayer('geojson/Crude_Terminals.geojson', 0.25, 40, 'rgba(169, 169, 169, 0.9)', 3, 'rgba(169, 169, 169, 0.4)'),
      this.makeGeoJSONLineVectorLayer('geojson/NorAm.geojson', 0, 1, 64000, 'gray', 0.7),
      new Tile({
        source: new XYZ({
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Reference_Overlay/MapServer/tile/{z}/{y}/{x}'
        }),
        opacity: 1,
        minResolution: 1,
        maxResolution: 4000
      }),
      this.makeGeoJSONLineVectorLayerWithStyle1('geojson/CancelledOilLines.geojson', 0, 1, 32000, 3),
      this.makeGeoJSONLineVectorLayer('geojson/OilPipes1.geojson', -10, 1, 64000, 'black', 3),
      this.makeGeoJSONLineVectorLayer('geojson/OilPipes2.geojson', 0, 1, 64000, 'black', 3),
      this.makeGeoJSONLineVectorLayer('geojson/CanadianPipes.geojson', 0, 1, 64000, 'black', 3),
      this.makeGeoJSONLineVectorLayer('geojson/ContestedOilLines.geojson', 100, 1, 16000, 'black', 8.5),
      this.makeGeoJSONLineVectorLayer('geojson/ContestedOilLines.geojson', 100, 1, 16000, '#fb5c04', 3.5)
    ]
  },
    petropolisOilPipelineLayers: function () {
      return [
        new Tile({
          source: new XYZ({
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}.png'
          }),
          opacity: 1,
          minResolution: 0.25
        }),
            // Aerial
        ...this.baseLayers,
        //    this.makeGeoJSONFillVectorLayer('geojson/Crude_Terminals.geojson', 0.25, 40, 'rgba(169, 169, 169, 0.9)', 3, 'rgba(169, 169, 169, 0.4)'),
        this.makeGeoJSONPointVectorLayerWithCircleStyle('geojson/Spills_20yrs.geojson', null, 4, 2000, 'rgba(134, 40, 26, 0.4)', 1, 'rgba(134, 40, 26, 0.3)'),
        this.makeGeoJSONLineVectorLayer('geojson/NA-RR.geojson', 0, 16, 4000, 'rgba(105, 105, 105, 0.4)', 1),
        this.makeGeoJSONPointVectorLayer('geojson/Terminals.geojson', 'icons/terminal.png', null, 1, 2000),
        this.makeGeoJSONLineVectorLayerWithStyle1('geojson/CancelledOilLines.geojson', 0, 1, 32000, 3),
        this.makeGeoJSONLineVectorLayer('geojson/OilPipes1.geojson', 0, 1, 64000, 'black', 3),
        this.makeGeoJSONLineVectorLayer('geojson/OilPipes2.geojson', 0, 1, 64000, 'black', 3),
        this.makeGeoJSONLineVectorLayer('geojson/CanadianPipes.geojson', 0, 1, 64000, 'black', 3),
        this.makeGeoJSONLineVectorLayer('geojson/ContestedOilLines.geojson', 0, 1, 16000, 'black', 8.5),
        this.makeGeoJSONLineVectorLayer('geojson/ContestedOilLines.geojson', 0, 1, 16000, '#fb5c04', 3.5),
        this.makeGeoJSONLineVectorLayer('geojson/GlobalPipelines.geojson', 0, 20, 64000, '#000000', 2.5),
        this.makeGeoJSONPointVectorLayer('geojson/US_Refineries.geojson', 'icons/Refinery3.png', null, 1, 16000),
        this.makeGeoJSONPointVectorLayer('geojson/GlobalRefineries.geojson', 'icons/Refinery3.png', null, 1, 16000),
        this.makeGeoJSONPointVectorLayer('geojson/CrudeDerailments.geojson', 'icons/Explosion3.png', null, 1, 16000),
        this.makeGeoJSONPointVectorLayer('geojson/VideoOilIndustry.geojson', 'icons/Warning.png', null, 1, 4000)
//        this.makeGeoJSONPointVectorLayer('geojson/EIP-Oil.geojson', 'icons/redpin2.png', null, 1, 8000)
      ]
    },
    petropolisOilWorldLayers: function () {
      return [
        new Tile({
          source: new XYZ({
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}'
          }),
          opacity: 1,
          minResolution: 200
        }),
        new Tile({
          source: new XYZ({
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Reference_Overlay/MapServer/tile/{z}/{y}/{x}'
          }),
          opacity: 1,
          minResolution: 200,
          maxResolution: 32000
        }),
        new Tile({
          source: new XYZ({
            url: 'https://stamen-tiles-{a-d}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png'
          }),
          opacity: 1,
          minResolution: 0.25,
          maxResolution: 200
        }),
        // quadKeyLayer   https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.
        new Tile({
          minResolution: 0.25,
          opacity: 1,
          source: new XYZ({
            tileUrlFunction: (tileCoord, pixelRatio, projection) => {
              const z = tileCoord[0]
              const x = tileCoord[1]
              const y = -tileCoord[2] - 1
              return 'https://t0.tiles.virtualearth.net/tiles/t' + this.computeQuadKey(x, y, z) + '.jpg'
            }
          }),
          maxZoom: 17, // XYZ's default is 18
          loadTilesWhileAnimating: true,
          loadTilesWhileInteracting: true
        }),
        // esriMapsAerial
        ...this.baseLayers,
//        this.makeGeoJSONFillVectorLayer('geojson/Crude_Terminals.geojson', 0.25, 40, 'rgba(169, 169, 169, 0.9)', 3, 'rgba(169, 169, 169, 0.4)'),
        this.makeGeoJSONLineVectorLayer('geojson/OilPipes1.geojson', 0, 1, 64000, 'black', 3),
        this.makeGeoJSONLineVectorLayer('geojson/OilPipes2.geojson', 0, 1, 64000, 'black', 3),
        this.makeGeoJSONPointVectorLayerWithCircleStyle2('geojson/GiantOilFields.geojson', null, 4, 4000, 'rgba(134, 40, 26, 0.4)', 1, 'rgba(134, 40, 26, 0.3)'),
        this.makeGeoJSONLineVectorLayer('geojson/CanadianPipes.geojson', 0, 1, 64000, 'black', 3),
        this.makeGeoJSONLineVectorLayer('geojson/ContestedOilLines.geojson', 0, 1, 8000, 'black', 7),
        this.makeGeoJSONLineVectorLayer('geojson/ContestedOilLines.geojson', 0, 1, 8000, '#fd6a02', 3.5),
        this.makeGeoJSONLineVectorLayer('geojson/GlobalPipelines.geojson', 0, 20, 64000, '#000000', 2.5),
        this.makeGeoJSONPointVectorLayer('geojson/OilPorts.geojson', 'icons/Tanker2.png', null, 1, 8000),
        this.makeGeoJSONPointVectorLayer('geojson/US_Refineries.geojson', 'icons/Refinery3.png', null, 1, 8000),
        this.makeGeoJSONPointVectorLayer('geojson/GlobalRefineries.geojson', 'icons/Refinery3.png', null, 1, 8000),
        this.makeGeoJSONPointVectorLayer('geojson/US_Refineries.geojson', 'icons/Refinery4.png', null, 8000, 32000),
        this.makeGeoJSONPointVectorLayer('geojson/GlobalRefineries.geojson', 'icons/Refinery4.png', null, 8000, 32000)
      ]
    },
    petropolisGasLayers: function () {
      return [
        new Tile({
          source: new XYZ({
            url: 'https://{a-d}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png'
          }),
          opacity: 0.6,
          minResolution: 200
        }),
        new Tile({
          source: new XYZ({
            url: 'https://services.arcgisonline.com/arcgis/rest/services/Elevation/World_Hillshade/MapServer/tile/{z}/{y}/{x}.png'
          }),
          opacity: 0.5,
          minResolution: 0.5
        }),
      // Aerial
      ...this.baseLayers,
  //    this.makeGeoJSONFillVectorLayer('geojson/Crude_Terminals.geojson', 0.25, 40, 'rgba(169, 169, 169, 0.9)', 3, 'rgba(169, 169, 169, 0.4)'),



      this.makeGeoJSONFillVectorLayer('geojson/ShaleBasins-EIA.geojson', 40, 64000, 'rgba(239, 98, 47, 0.9)', 2, 'rgba(247, 206, 149, 0.3)'),
      this.makeGeoJSONLineVectorLayer('geojson/NorAm.geojson', 0, 1.5, 64000, 'black', 0.6),

      new VectorTileLayer({
        source: new VectorTileSource({
          format: new MVT(),
          url: 'https://ecotopia.today/Petropolis/GasPipes2/{z}/{x}/{y}.pbf'
        }),
        style: new Style({
          stroke: new Stroke({
            color: '#00c8f0',
            width: 0.6,
            opacity: 1
          })
        })
      }),

//        new Tile({
//          source: new XYZ({
//            url: 'https://ecotopia.today/Petropolis/WellTiles/{z}/{x}/{y}.png'
//          }),
//          opacity: 1,
//          minResolution: 0.25
//        }),

      this.makeGeoJSONPointVectorLayer('geojson/USnatGas.geojson', 'icons/NatGas3.png', null, 0.25, 80),
      this.makeGeoJSONPointVectorLayer('geojson/USnatGas.geojson', 'icons/NatGas2.png', null, 80, 400),
      this.makeGeoJSONPointVectorLayer('geojson/USnatGas.geojson', 'icons/NatGas1.png', null, 400, 8000),
//      this.makeGeoJSONPointVectorLayer('geojson/USnatGas.geojson', 'icons/NatGas0.png', null, 1000, 5000)
//      this.makeGeoJSONLineVectorLayer('geojson/ContestedGasLines.geojson', 0, 0.5, 16000, 'black', 6.5),
//      this.makeGeoJSONLineVectorLayer('geojson/ContestedGasLines.geojson', 0, 0.5, 16000, '#00c8f0', 3)
      ]
    },
    petropolisGasIndustryLayers: function () {
      return [
        new Tile({
          source: new XYZ({
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Specialty/DeLorme_World_Base_Map/MapServer/tile/{z}/{y}/{x}'
          }),
          opacity: 0.8,
          minResolution: 0.25
        }),
        // esriMapsAerial
        ...this.baseLayers,
        this.makeGeoJSONFillVectorLayer('geojson/ShalePlays.geojson', 40, 64000, 'rgba(91, 73, 14, 0.7)', 0.5, 'rgba(91, 73, 14, 0.3)'),

        new VectorTileLayer({
          source: new VectorTileSource({
            format: new MVT(),
            url: 'https://ecotopia.today/Petropolis/GasPipes2/{z}/{x}/{y}.pbf'
          }),
          style: new Style({
            stroke: new Stroke({
              color: '#00c8f0',
              width: 1.5,
              opacity: 1
            })
          })
        }),

        this.makeGeoJSONLineVectorLayer('geojson/ContestedGasLines.geojson', 0, 0.5, 16000, 'black', 6.5),
        this.makeGeoJSONLineVectorLayer('geojson/ContestedGasLines.geojson', 0, 0.5, 16000, '#00c8f0', 3),
        this.makeGeoJSONPointVectorLayer('geojson/GlobalNatGas.geojson', 'icons/NatGas1.png', null, 8000, 32000),
//        this.makeGeoJSONPointVectorLayer('geojson/EIP-NatGas.geojson', 'icons/redpin2.png', null, 1, 2000),
        this.makeGeoJSONPointVectorLayer('geojson/LNGterminals.geojson', 'icons/LNGterminal.png', null, 1, 16000),
        this.makeGeoJSONPointVectorLayer('geojson/Gasland.geojson', 'icons/PetropolisGasland2.gif', null, 4, 8000)
      ]
    },
    petropolisGasWorldLayers: function () {
      return [
        new Tile({
          source: new XYZ({
            url: 'https://maps.heigit.org/openmapsurfer/tiles/roads/webmercator/{z}/{x}/{y}.png'
          }),
          opacity: 1,
          minResolution: 0.25
        }),
        // esriMapsAerial
        ...this.baseLayers,
        this.makeGeoJSONFillVectorLayer('geojson/ShaleBasins.geojson', 0.25, 64000, 'rgba(56, 132, 189, 0.7)', 0.5, 'rgba(7, 29, 81, 0.2)'),
        this.makeGeoJSONPointVectorLayer('geojson/USnatGas.geojson', 'icons/NatGas2.png', null, 1, 64000),
        this.makeGeoJSONPointVectorLayer('geojson/GlobalNatGas.geojson', 'icons/NatGas2.png', null, 1, 64000),
        this.makeGeoJSONPointVectorLayer('geojson/USnatGas.geojson', 'icons/NatGas2.png', null, 1, 64000),
        this.makeGeoJSONPointVectorLayer('geojson/GlobalNatGas.geojson', 'icons/NatGas2.png', null, 1, 64000)
      ]
    },
    petropolisCoalLayers: function () {
      return [
      new Tile({
        source: new XYZ({
          url: 'https://{a-d}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png'
        }),
        opacity: 1,
        minResolution: 0.5
      }),
      new Tile({
        source: new XYZ({
          url: 'https://services.arcgisonline.com/arcgis/rest/services/Elevation/World_Hillshade/MapServer/tile/{z}/{y}/{x}.png'
        }),
        opacity: 0.3,
        minResolution: 0.5
      }),
//      this.makeGeoJSONFillVectorLayer('geojson/NApolitical.geojson', 0.25, 64000, 'rgba(250, 250, 248, 0.85)', 0.5, 'rgba(0, 0, 0, 0.8)'),
      // Aerial
      ...this.baseLayers,
  //        this.makeGeoJSONLineVectorLayer('geojson/NorAm.geojson', 0, 1, 64000, 'gray', 0.7),
        this.makeGeoJSONLineVectorLayer('geojson/NA-RR.geojson', 0, 16, 16000, 'rgba(255, 255, 255, 0.6)', 1),
    //    this.makeGeoJSONPointVectorLayerWithCircleStyle1('geojson/UndergroundCoal.geojson', 'icons/CoalWagon.png', null, 1, 800),
    //    this.makeGeoJSONPointVectorLayer('geojson/CoalAsh.geojson', 'icons/CoalAsh.png', null, 1, 16000),
        this.makeGeoJSONPointVectorLayer('geojson/Coal.geojson', 'icons/Smokestack6.png', null, 1, 64000),
        this.makeGeoJSONPointVectorLayerWithCircleStyle1('geojson/Coal_Mines.geojson', null, 4, 64000, 'rgba(134, 40, 26, 0.4)', 1, 'rgba(134, 40, 26, 0.3)')
//        this.makeGeoJSONPointVectorLayer('geojson/Coal.geojson', 'icons/CoalPlant7.png', null, 1, 8000),
//        this.makeGeoJSONPointVectorLayer('geojson/Coal.geojson', 'icons/CoalPlant6.png', null, 8000, 64000)
      ]
    },
    petropolisCoalIndustryLayers: function () {
      return [
        new Tile({
          source: new XYZ({
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}.png'
          }),
          opacity: 1,
          minResolution: 0.25
        }),
        // esriMapsAerial
        ...this.baseLayers,
//        this.makeGeoJSONLineVectorLayer('geojson/NA-RR.geojson', 0, 16, 8000, 'rgba(105, 105, 105, 0.5)', 1),
        this.makeGeoJSONPointVectorLayer('geojson/SurfaceCoal.geojson', 'icons/Truck.png', null, 1, 800),
        this.makeGeoJSONPointVectorLayer('geojson/UndergroundCoal.geojson', 'icons/CoalWagon.png', null, 1, 800),
        this.makeGeoJSONPointVectorLayer('geojson/CoalAsh.geojson', 'icons/CoalAsh3.png', null, 1, 16000),
        this.makeGeoJSONPointVectorLayer('geojson/Coal.geojson', 'icons/Smokestack3.png', null, 1, 8000),
      ]
    },
    petropolisCoalWorldLayers: function () {
      return [
        new Tile({
          source: new XYZ({
            url: 'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_CityLights_2012/default/GoogleMapsCompatible_Level8/{z}/{y}/{x}.jpg'
          }),
          opacity: 1,
          minResolution: 200
        }),
        new Tile({
          source: new XYZ({
            url: 'https://cartocdn_{a-d}.global.ssl.fastly.net/base-midnight/{z}/{x}/{y}.png'
          }),
          opacity: 0.8,
          minResolution: 0.25,
          maxResolution: 800,
          transition: 750
        }),
        // openrailwaymap
        new Tile({
          title: 'OpenRailwayMap',
          visible: true,
          minResolution: 40,
          opacity: 1,
          source: new XYZ({
            url: 'https://{a-c}.tiles.openrailwaymap.org/signals/{z}/{x}/{y}.png',
            crossOrigin: null, // make it work inside canvas
            tilePixelRatio: 2, // server returns 512px img for 256 tiles
            maxZoom: 21, // XYZ's default is 18
            opaque: false,
            loadTilesWhileAnimating: true,
            loadTilesWhileInteracting: true
          }),
          opacity: 0.6,
          minResolution: 2,
          maxResolution: 4000
        }),
        // esriMapsAerial
        ...this.baseLayers,
        this.makeGeoJSONLineVectorLayer('geojson/NA-RR.geojson', 0, 16, 8000, 'rgba(105, 105, 105, 0.5)', 1),
        this.makeGeoJSONPointVectorLayer('geojson/CoalMines.geojson', 'icons/CoalMine.png', null, 1, 2000),
        this.makeGeoJSONPointVectorLayer('geojson/Coal.geojson', 'icons/Smokestack3.png', null, 1, 6000),
        this.makeGeoJSONPointVectorLayer('geojson/Coal.geojson', 'icons/Smokestack4.png', null, 6000, 64000)
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
    window.addEventListener('keydown', (e) => {
      if (e.keyCode === 38) { // up arrow key
        this.radius = Math.min(this.radius + 5, 800)
        this.olmap.render()
      } else if (e.keyCode === 40) { // down arrow key
        this.radius = Math.max(this.radius - 5, 0)
        this.olmap.render()
      }
    })
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
      this.mousePosition = this.olmap.getEventPixel(e.originalEvent)
      this.olmap.render()
    })
  },
  methods: {
    initMap: function () {
      switch (this.$route.name) {
        case 'petropolisOil':
          this.initPetropolisOil()
          break
        case 'petropolisOilIndustry':
          this.initpetropolisOilIndustry()
          break
        case 'petropolisOilWorld':
          this.initPetropolisOilWorld()
          break
        case 'petropolisCoal':
          this.initPetropolisCoal()
          break
        case 'petropolisCoalIndustry':
          this.initPetropolisCoalIndustry()
          break
        case 'petropolisCoalWorld':
          this.initPetropolisCoalWorld()
          break
        case 'petropolisGas':
          this.initPetropolisGas()
          break
        case 'petropolisGasIndustry':
          this.initPetropolisGasIndustry()
          break
        case 'petropolisGasWorld':
          this.initPetropolisGasWorld()
          break
        default:
          this.initPetropolisOil()
      }
    },
    initPetropolisOil: function () {
      this.initBaseMap()
      this.olmap.setLayerGroup(new Group({
        layers: this.petropolisOilLayers
      }))
      this.olmap.setView(new View({
        center: fromLonLat(this.centerPoints.pipelines.center),
        resolution: this.centerPoints.pipelines.resolution,
        minResolution: 0.5,
        maxResolution: 32000
      }))
    },
    initpetropolisOilIndustry: function () {
      this.initBaseMap()
      this.olmap.setLayerGroup(new Group({
        layers: this.petropolisOilPipelineLayers
      }))
      this.olmap.setView(new View({
        center: fromLonLat(this.centerPoints.pipelinesContested.center),
        resolution: this.centerPoints.pipelinesContested.resolution,
        minResolution: 0.5,
        maxResolution: 32000
      }))
      if (this.olmap) {
        this.olmap.on('singleclick', (e) => {
          const feature = this.olmap.forEachFeatureAtPixel(e.pixel, (feature) => { return feature })
          if (feature) {
            const props = feature.getProperties()
            if (props.vimeoSrc) {
              const mediabox = new MediaLightBox(props.vimeoSrc)
              mediabox.open()
            }
          }
        })
      }
    },
    initPetropolisOilWorld: function () {
      this.initBaseMap()
      this.olmap.setLayerGroup(new Group({
        layers: this.petropolisOilWorldLayers
      }))
      this.olmap.setView(new View({
        center: fromLonLat(this.centerPoints.pipelinesAll.center),
        resolution: this.centerPoints.pipelinesAll.resolution,
        minResolution: 0.5,
        maxResolution: 32000
      }))
    },
    initPetropolisCoal: function () {
      this.initBaseMap()
      this.olmap.setLayerGroup(new Group({
        layers: this.petropolisCoalLayers
      }))
      this.olmap.setView(new View({
        center: fromLonLat(this.centerPoints.coal.center),
        resolution: this.centerPoints.coal.resolution,
        minResolution: 0.5,
        maxResolution: 64000
      }))
    },
    initPetropolisCoalIndustry: function () {
      this.initBaseMap()
      this.olmap.setLayerGroup(new Group({
        layers: this.petropolisCoalIndustryLayers
      }))
      this.olmap.setView(new View({
        center: fromLonLat(this.centerPoints.coal.center),
        resolution: this.centerPoints.coal.resolution,
        minResolution: 0.5,
        maxResolution: 64000
      }))
    },
    initPetropolisCoalWorld: function () {
      this.initBaseMap()
      this.olmap.setLayerGroup(new Group({
        layers: this.petropolisCoalWorldLayers
      }))
      this.olmap.setView(new View({
        center: fromLonLat(this.centerPoints.coalWorld.center),
        resolution: this.centerPoints.coalWorld.resolution,
        minResolution: 0.5,
        maxResolution: 64000
      }))
    },
    initPetropolisGas: function () {
      this.initBaseMap()
      this.olmap.setLayerGroup(new Group({
        layers: this.petropolisGasLayers
      }))
      this.olmap.setView(new View({
        center: fromLonLat(this.centerPoints.gas.center),
        resolution: this.centerPoints.gas.resolution,
        minResolution: 0.5,
        maxResolution: 16000
      }))
    },
    initPetropolisGasIndustry: function () {
      this.initBaseMap()
      this.olmap.setLayerGroup(new Group({
        layers: this.petropolisGasIndustryLayers
      }))
      this.olmap.setView(new View({
        center: fromLonLat(this.centerPoints.gasIndustry.center),
        resolution: this.centerPoints.gasIndustry.resolution,
        minResolution: 0.5,
        maxResolution: 16000
      }))
    },
    initPetropolisGasWorld: function () {
      this.initBaseMap()
      this.olmap.setLayerGroup(new Group({
        layers: this.petropolisGasWorldLayers
      }))
      this.olmap.setView(new View({
        center: fromLonLat(this.centerPoints.gasWorld.center),
        resolution: this.centerPoints.gasWorld.resolution,
        minResolution: 0.5,
        maxResolution: 32000
      }))
    },
    initPetropolisTarSands: function () {
      this.initBaseMap()
      this.olmap.setLayerGroup(new Group({
        layers: this.petropolisTarSandsLayers
      }))
      this.olmap.setView(new View({
        center: fromLonLat(this.centerPoints.tarsands.center),
        resolution: this.centerPoints.tarsands.resolution,
        minResolution: 0.5,
        maxResolution: 16000
      }))
      // Had to change props to vimeoSrc2 - here and in geojson - or else it doesn't close
      if (this.olmap) {
        this.olmap.on('singleclick', (e) => {
          const feature = this.olmap.forEachFeatureAtPixel(e.pixel, (feature) => { return feature })
          if (feature) {
            const props = feature.getProperties()
            if (props.vimeoSrc2) {
              const mediabox = new MediaLightBox(props.vimeoSrc2)
              mediabox.open()
            }
          }
        })
      }
    },
    computeQuadKey: function (x, y, z) {
      let quadKeyDigits = []
      for (let i = z; i > 0; i--) {
        let digit = 0
        const mask = 1 << (i - 1)
        if ((x & mask) !== 0) {
          digit++
        }
        if ((y & mask) !== 0) {
          digit = digit + 2
        }
        quadKeyDigits.push(digit)
      }
      return quadKeyDigits.join('')
    },
    spotlight: function (e) {
      let ctx = e.context
      const pixelRatio = e.frameState.pixelRatio
      ctx.save()
      ctx.beginPath()
      if (this.mousePosition) {
        // Only show a circle around the mouse --
        ctx.arc(this.mousePosition[0] * pixelRatio, this.mousePosition[1] * pixelRatio,
          this.radius * pixelRatio, 0, 2 * Math.PI)
        ctx.lineWidth = 6 * pixelRatio
        ctx.strokeStyle = 'rgba(0,0,0,0.5)'
        ctx.stroke()
      }
      ctx.clip()
    }
  }
}
</script>
