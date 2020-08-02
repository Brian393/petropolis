<template>
  <v-layout justify-space-between column fill-height>
    <vue-scroll v-if="!selectedCoorpNetworkEntity">
      <v-layout v-if="!selectedCoorpNetworkEntity">
        <div class="px-1">
          <v-row align="center" class="my-2 mx-3 pt-4">
            <div class="sidepanel-header">
              <h1><span style="font-align:center;color:#c00;"></span></h1>
            </div>

            <!-- LEGEND IMAGE -->
            <v-img
              class="my-3"
              max-width="425"
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
              <!-- CAPTION - USE BY UNCOMMENTING
              <div class="caption font-italic font-weight-medium">
                some features only appear when you zoom in
              </div>  -->
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
            <div
              class="mt-4 ml-1"
              style="width: 100%;"
              v-if="popup.showInSidePanel"
            >
              <v-divider class="mb-1"></v-divider>
              <v-layout>
                <v-spacer></v-spacer>
                <v-btn
                  @click="findCorporateNetwork"
                  text
                  small
                  class="mb-2 mt-1 mr-2"
                  v-if="
                    popup.activeFeature.get('entity') &&
                      popup.activeLayer.get('includeInSearch') !== false
                  "
                >
                  <v-icon small class="mr-1">public</v-icon>
                  {{ searchLabel }}
                </v-btn>
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
    <v-layout
      style="overflow:hidden;"
      fill-height
      v-if="selectedCoorpNetworkEntity"
    >
      <v-row align="center" justify="center" class="mx-0" style="width:100%;">
        <v-layout align-center class="elevation-3 mb-1" style="width:100%;">
          <v-flex
            xs10
            justify-center
            align-center
            style="border-right: 1px solid rgba(0, 0, 0, 0.12);"
          >
            <div class="sidepanel-header">
              <h1>
                <span style="font-align:center;color:#c00;">{{
                  selectedCoorpNetworkEntity
                }}</span>
              </h1>
            </div>
          </v-flex>
          <v-flex xs2 class="d-flex justify-center">
            <v-btn
              @click="closeCorpNetworkSelection()"
              dark
              color="#dc143c"
              small
              class="ml-1 elevation-0"
            >
              EXIT
            </v-btn>
          </v-flex>
        </v-layout>
        <v-progress-linear
          v-show="iframeUrl && isIframeLoading === true"
          class="mt-n1"
          indeterminate
          height="5"
          color="#dc143c"
        ></v-progress-linear>
        <vue-scroll>
          <v-container
            v-if="iframeUrl"
            style="overflow:hidden;"
            class="pt-0 mt-0"
            fill-height
          >
            <v-row style="height: 100%;" class="mr-6">
              <iframe
                @load="isIframeLoading = false"
                style="overflow:hidden;position:absolute;border:none;margin-left:11px;"
                height="95%"
                width="100%"
                :src="iframeUrl"
              >
              </iframe>
            </v-row>
          </v-container>

          <v-container
            class="pb-5 mb-3"
            v-if="!iframeUrl && popup.selectedCorpNetworkLayer"
          >
            <div
              v-for="(feature,
              index) in popup.selectedCorpNetworkLayer
                .getSource()
                .getFeatures()"
              :key="index"
              class="my-3"
              @mouseover="mouseOver(feature)"
              @mouseout="mouseOut()"
            >
              <div
                class="body-2 my-1"
                v-for="item in formatPopupRows(feature, popup.exludedProps)"
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
              <v-divider></v-divider>
            </div>
          </v-container>
        </vue-scroll>
      </v-row>
    </v-layout>
  </v-layout>
</template>

<script>
//Store imports
import { mapGetters } from 'vuex';
import { mapFields } from 'vuex-map-fields';
import UrlUtil from '../../utils/Url';
import { SharedMethods } from '../../mixins/SharedMethods';
import { EventBus } from '../../EventBus';
import { formatPopupRows, getIframeUrl } from '../../utils/Layer';

export default {
  mixins: [SharedMethods],
  data() {
    return {
      isIframeLoading: true
    };
  },
  computed: {
    visibleGroup() {
      const visibleGroup = this.$appConfig.map.groups[
        this.activeLayerGroup.fuelGroup
      ][this.activeLayerGroup.region];
      return visibleGroup;
    },
    iframeUrl() {
      return getIframeUrl(
        this.splittedEntities,
        this.$appConfig.map.corporateEntitiesUrls,
        this.selectedCoorpNetworkEntity
      );
    },

    searchLabel() {
      const searchLabel = this.popup.activeLayer.get('searchLabel');
      if (searchLabel) {
        return searchLabel;
      }
      if (this.visibleGroup.searchLabel) {
        return this.visibleGroup.searchLabel.toUpperCase();
      }
      return 'CORPORATE NETWORK';
    },
    ...mapGetters('map', {
      map: 'map',
      activeLayerGroup: 'activeLayerGroup',
      popupInfo: 'popupInfo',
      splittedEntities: 'splittedEntities'
    }),
    ...mapFields('map', {
      popup: 'popup',
      selectedCoorpNetworkEntity: 'selectedCoorpNetworkEntity'
    })
  },
  methods: {
    formatPopupRows,
    parseUrl(url) {
      return UrlUtil.parseUrl(url);
    },
    closePopupInfo() {
      EventBus.$emit('closePopupInfo');
      this.popup.highlightLayer.getSource().clear();
      this.popup.selectedCorpNetworkLayer.getSource().clear();
      this.popup.worldExtentLayer.getSource().clear();
    },
    findCorporateNetwork() {
      EventBus.$emit('findCorporateNetwork');
    },
    closeCorpNetworkSelection() {
      this.closePopupInfo();
      this.selectedCoorpNetworkEntity = null;
      this.isIframeLoading = true;
    },
    mouseOver(feature) {
      this.popup.highlightLayer.getSource().clear();
      const clonedFeature = feature.clone();
      clonedFeature.setStyle(null);
      this.popup.highlightLayer.getSource().addFeature(clonedFeature);
    },
    mouseOut() {
      this.popup.highlightLayer.getSource().clear();
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
