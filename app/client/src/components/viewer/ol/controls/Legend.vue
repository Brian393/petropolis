<template>
  <v-card
    class="elevation-3"
    :width="isVisible ? '250px' : '0px'"
    style="z-index:100;position:absolute;left:25px;top:200px;max-width: 200px;min-height:150px;max-height:calc(100% - 360px);overflow-x:hidden;overflow-y:auto;"
  >
    <v-btn
      v-show="isVisible"
      @click="toggleLegend"
      class="legend-toggle-button white--text"
      text
      x-small
      style="z-index:100;background-color:rgb(228, 76, 107);position:fixed;left:193px;top:240px;"
    >
      <v-icon class="ml-2" x-small>fas fa-chevron-up</v-icon></v-btn
    >
    <v-tooltip v-show="!isVisible" right>
      <template v-slot:activator="{ on }">
        <v-btn
          v-on="on"
          style="position:fixed;left:16px;top:260px;"
          v-show="!isVisible"
          color="#DC143C"
          @click="toggleLegend"
          fab
          small
          class="white--text"
        >
          <v-icon>fas fa-layer-group</v-icon>
        </v-btn>
      </template>
      <span>Layers</span>
    </v-tooltip>

    <v-card-text
      class="pa-2 pb-0 mb-0 mr-0 pr-0"
      v-show="isVisible"
      v-if="isReady"
      style="height:100%;overflow-x:hidden;overflow-y:auto;"
    >
      <span class="black--text text--darken-2 subtitle-2 pb-6">
        {{ title }} Layers: On/Off
      </span>
      <v-divider class="mr-1 py-2 mt-1"></v-divider>

<!-- THIS MODULE WORKS PERFECT, ACTIVATE IF DESIRED

      <span class="ml-10 grey--text text--darken-2 subtitle-2">
        <a @click="toggleAllLayersVisibility(true)">select all </a> |
        <a @click="toggleAllLayersVisibility(false)"> clear all</a>
      </span>
      <v-divider class="mr-1 mb-2"></v-divider>

      UNCOMMENT TO ACTIVATE -->

      <template v-for="(item, index) in layers">
        <v-row
          :key="'layer-' + index"
          class="fill-height ma-0"
          v-if="item.get('displayInLegend')"
          v-show="
            item.get('group') !== 'backgroundLayers' &&
              item.get('isVisibleInResolution') === true
          "
        >
          <v-flex xs1>
            <span v-html="getGraphic(item)"></span>
          </v-flex>
          <v-flex xs11>
            <v-checkbox
              class="layer-input ml-1 pt-1 py-0 my-0"
              dense
              color="purple"
              :input-value="item.getVisible()"
              @change="toggleLayerVisibility(item)"
            >
              <template v-slot:label>
                <span class="grey--text text--darken-2 subtitle-2">
                  {{
                    item.get('legendDisplayName') || humanize(item.get('name'))
                  }}
                </span>
              </template>
            </v-checkbox>
          </v-flex>
        </v-row>
      </template>

      <br />
    </v-card-text>
  </v-card>
</template>
<script>
import { Mapable } from '../../../../mixins/Mapable';
import { mapGetters } from 'vuex';
import { humanize, debounce } from '../../../../utils/Helpers';
import { getLayerType } from '../../../../utils/Layer';

export default {
  mixins: [Mapable],
  name: 'map-legend',
  props: {
    color: { type: String, default: '#4CAF50' }
  },
  data() {
    return {
      isReady: false,
      title: '',
      isVisible: true
    };
  },
  methods: {
    humanize,
    onMapBound() {
      this.updateRows();
      this.map.getView().on('change:resolution', () => {
        this.updateLegendRows();
      });
    },
    updateLegendRows: debounce(function() {
      this.updateRows();
    }, 500),
    updateRows() {
      const currentRes = this.map.getView().getResolution();
      Object.keys(this.layers).forEach(key => {
        const layer = this.layers[key];

        const minRes = layer.getMinResolution();
        const maxRes = layer.getMaxResolution();
        if (currentRes >= minRes && currentRes <= maxRes) {
          layer.set('isVisibleInResolution', true);
        } else {
          layer.set('isVisibleInResolution', false);
        }
        if (this.isReady === false) {
          this.isReady = true;
        }
        this.$forceUpdate();
      });
    },
    getGraphic(layer) {
      const layerType = getLayerType(layer);
      if (layerType === 'VectorLayer' || layerType === 'VectorTileLayer') {
        let styleConf = layer.get('styleObj');
        if (!styleConf) return;
        styleConf = JSON.parse(styleConf);

        if (styleConf.iconUrl) {
          return `<img src="${styleConf.iconUrl}" class="icon-border" style="margin-top: 5px !important;object-fit:contain;" width="22" height="22">`;
        } else if (styleConf.radius || styleConf.type === 'circle') {
          return `<span class="circle" style="margin-top: 5px;background-color:${styleConf.fillColor};border: 1px solid ${styleConf.strokeColor};"></span>`;
        } else if (styleConf.fillColor) {
          // Polygon
          return `<span class="square" style="margin-top: 5px;background-color:${styleConf.fillColor};border: 1px solid ${styleConf.strokeColor};"></span>`;
        } else if (styleConf.strokeColor || styleConf.strokeWidth) {
          let lineType = 'solid';
          let lineWidth = '2px';

          if (styleConf.lineDash) {
            lineType = 'dashed';
          }
          if (!styleConf.strokeColor) {
            styleConf.strokeColor = 'black';
          }

          if (styleConf.styleField && styleConf.type === 'line') {
            const features = layer.getSource().getFeatures();
            if (styleConf.legendColor) {
              styleConf.strokeColor = styleConf.legendColor;
            } else if (Array.isArray(features) && features.length > 0) {
              styleConf.strokeColor = features[0].get(styleConf.styleField);
            }
          }

          return `<hr style="margin-top: 12px;border: ${lineWidth} ${lineType} ${styleConf.strokeColor};"></hr>`;
        }
      }
    },
    toggleLayerVisibility(item) {
      item.setVisible(!item.getVisible());
    },
    toggleAllLayersVisibility(state) {
      Object.keys(this.layers).forEach(key => {
        const layer = this.layers[key];
        if (
          layer.get('isVisibleInResolution') &&
          layer.get('displayInLegend')
        ) {
          layer.setVisible(state);
        }
      });
    },
    updateTitle() {
      let title = ``;
      this.fuelGroups.forEach(fuelGroup => {
        if (fuelGroup.name === this.activeLayerGroup.fuelGroup) {
          title += fuelGroup.title;
        }
      });
      this.regions.forEach(region => {
        if (region.name === this.activeLayerGroup.region) {
          title += ` ${region.title}`;
        }
      });
      this.title = title;
    },
    toggleLegend() {
      this.isVisible = !this.isVisible;
    }
  },
  mounted() {
    this.updateTitle();
  },
  computed: {
    ...mapGetters('map', {
      layers: 'layers',
      activeLayerGroup: 'activeLayerGroup',
      fuelGroups: 'fuelGroups',
      regions: 'regions'
    })
  },
  watch: {
    activeLayerGroup() {
      this.updateTitle();
      this.updateLegendRows();
    }
  }
};
</script>
<style lang="css" scoped>
.v-expansion-panel-header {
  min-height: 30px;
  padding: 5px;
}

.v-expansion-panel-content >>> .v-expansion-panel-content__wrap {
  padding: 2px 0px 0px 5px;
}

.layer-input >>> .v-messages {
  min-height: 0px;
}
.legend-toggle-button {
  transform: rotate(-90deg);
  -ms-transform: rotate(-90deg);
  -moz-transform: rotate(-90deg);
  -webkit-transform: rotate(-90deg);
  -o-transform: rotate(-90deg);
  transform-origin: bottom right;
}

* {
  scrollbar-width: thin;
  scrollbar-color: rgb(206, 206, 206) #ffffff;
}
*::-webkit-scrollbar {
  width: 12px;
}
*::-webkit-scrollbar-track {
  background: #ffffff;
}
*::-webkit-scrollbar-thumb {
  background-color: rgb(206, 206, 206);
  border-radius: 20px;
  border: 3px solid #ffffff;
}
</style>
