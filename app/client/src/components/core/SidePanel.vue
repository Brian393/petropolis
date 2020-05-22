<template>
  <v-layout justify-space-between column fill-height>
    <vue-scroll>
      <v-layout>
        <div class="px-1">
          <v-row align="center" class="my-2 mx-3">
            <div class="sidepanel-header">
              <h1><span style="font-align:center;color:#c00;">Legend</span></h1>
            </div>

            <!-- LEGEND IMAGE -->
            <v-img
              class="my-3"
              max-width="350"
              :src="
                popup.showInSidePanel === true &&
                popup.activeFeature &&
                popup.activeFeature.get('imageUrl')
                  ? parseUrl(popup.activeFeature.get('imageUrl'))
                  : visibleGroup.sidePanel.legendUrl
              "
            >
            </v-img>
            <template v-if="!popup.showInSidePanel">
              <!-- CAPTION -->
              <div class="caption font-italic font-weight-medium">
                * these features appear when you zoom in
              </div>
              <!-- HEADER -->
              <p class="mt-4" style="font-size:120%;">
                <strong
                  ><em
                    ><span
                      v-html="visibleGroup.sidePanel.headerText"
                    ></span></em
                ></strong>
              </p>
              <!-- BODY -->
              <p v-html="visibleGroup.sidePanel.bodyText"></p>
            </template>

            <!-- VISIBLE ONLY WHEN USER HAS CLICKED DIVE/SHOW ALL FEATURE -->
            <div class="mt-4 ml-1" v-if="popup.showInSidePanel">
              <v-divider class="mb-1"></v-divider>
              <v-layout>
                <v-spacer></v-spacer>
                <v-btn @click="closePopupInfo" text small class="mb-2 mt-1">
                  <v-icon small class="mr-1">close</v-icon>
                  Close
                </v-btn>
              </v-layout>

              <v-divider class="mb-4"></v-divider>
              <div
                class="body-2"
                v-for="item in popupInfo"
                :key="item.property"
              >
                <span
                  v-if="
                    !popup.hiddenProps.includes(item.property) &&
                      !['null', '---'].includes(item.value)
                  "
                  v-html="
                    `<strong>${mapPopupPropName(item)}: </strong>` + item.value
                  "
                ></span>
              </div>
              <v-divider class="mt-4"></v-divider>
            </div>
          </v-row>
        </div>
      </v-layout>
    </vue-scroll>
  </v-layout>
</template>

<script>
//Store imports
import { mapGetters } from 'vuex';
import { mapFields } from 'vuex-map-fields';
import UrlUtil from '../../utils/Url';
import { SharedMethods } from '../../mixins/SharedMethods';

export default {
  mixins: [SharedMethods],
  computed: {
    visibleGroup() {
      const visibleGroup = this.$appConfig.map.groups[
        this.activeLayerGroup.fuelGroup
      ][this.activeLayerGroup.region];
      return visibleGroup;
    },
    ...mapGetters('map', {
      activeLayerGroup: 'activeLayerGroup',
      popupInfo: 'popupInfo'
    }),
    ...mapFields('map', {
      popup: 'popup'
    })
  },
  methods: {
    parseUrl(url) {
      return UrlUtil.parseUrl(url);
    },
    closePopupInfo() {
      if (this.popup.highlightLayer) {
        this.popup.highlightLayer.getSource().clear();
      }
      this.popup.showInSidePanel = false;
      this.popup.activeFeature = null;
      this.popup.activeLayer = null;
    }
  }
};
</script>

<style lang="css" scoped>
.sidepanel-header {
  width: 100%;
  text-align: center;
}
</style>
