<template>
  <v-expansion-panels
    class="elevation-3"
    style="position:absolute;bottom:35px;right:10px;maxWidth: 250px;"
  >
    <v-expansion-panel :style="`background-color: white;`">
      <v-expansion-panel-header
        class="white--text subtitle-2"
        :style="`background-color: ${color};`"
        >Legend
        <template v-slot:actions>
          <v-icon color="white" small>$vuetify.icons.expand</v-icon>
        </template>
      </v-expansion-panel-header>
      <v-expansion-panel-content v-if="isReady" style="max-height:280px;">
        <vue-scroll>
          <span class="grey--text text--darken-2 subtitle-2">
            {{ title }} Layers: Status
          </span>
          <v-divider class="mr-3"></v-divider>

          <span class="ml-12 grey--text text--darken-2 subtitle-2">
            <a @click="toggleAllLayersVisibility(true)">select all </a> |
            <a @click="toggleAllLayersVisibility(false)"> clear all</a>
          </span>
          <v-divider class="mr-3 mb-2"></v-divider>

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
                        item.get('legendDisplayName') ||
                          humanize(item.get('name'))
                      }}
                    </span>
                  </template>
                </v-checkbox>
              </v-flex>
            </v-row>
          </template>

          <br />
        </vue-scroll>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
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
      title: ''
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
        } else if (styleConf.radius) {
          return `<span class="circle" style="margin-top: 5px;background-color:${styleConf.fillColor};border: 1px solid ${styleConf.strokeColor};"></span>`;
        } else if (styleConf.fillColor) {
          // Polygon
          return `<span class="square" style="margin-top: 5px;background-color:${styleConf.fillColor};border: 1px solid ${styleConf.strokeColor};"></span>`;
        } else if (styleConf.strokeColor || styleConf.strokeWidth) {
          let lineType = 'solid';
          let lineWidth = '3px';

          if (styleConf.lineDash) {
            lineType = 'dashed';
            lineWidth = '2px';
          }

          if (!styleConf.strokeColor) {
            styleConf.strokeColor = 'black';
          }

          return `<span class="square" style="margin-top: 5px;border: ${lineWidth} ${lineType} ${styleConf.strokeColor};"></span>`;
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
</style>
