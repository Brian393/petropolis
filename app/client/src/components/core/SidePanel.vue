<template>
  <v-layout justify-space-between column fill-height>
    <vue-scroll v-if="!selectedCoorpNetworkEntity">
      <v-layout v-if="!selectedCoorpNetworkEntity">
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
            <div
              class="mt-4 ml-1"
              style="width: 100%;"
              v-if="popup.showInSidePanel"
            >
              <v-divider class="mb-1"></v-divider>
              <v-layout>
                <v-spacer></v-spacer>
                <v-btn
                  @click="findCoorporateNetwork"
                  text
                  small
                  class="mb-2 mt-1 mr-2"
                  v-if="popup.activeFeature.get('entity')"
                >
                  <v-icon small class="mr-1">public</v-icon>
                  Coorporate Network
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
              color="#DC143C"
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
          color="#DC143C"
        ></v-progress-linear>
        <vue-scroll>
          <v-container v-if="iframeUrl" class="pb-0">
            <div class="documentation-wrapper">
              <iframe
                @load="isIframeLoading = false"
                scrolling="no"
                :src="iframeUrl"
              >
              </iframe>
            </div>
          </v-container>
          <v-container v-if="!iframeUrl">
            <div class="body-2" v-for="item in popupInfo" :key="item.property">
              <span
                v-if="
                  popup.activeFeature &&
                    popup.activeFeature.get('entity') &&
                    popup.activeFeature
                      .get('entity')
                      .includes(selectedCoorpNetworkEntity) &&
                    !popup.hiddenProps.includes(item.property) &&
                    !['null', '---'].includes(item.value)
                "
                v-html="
                  `<strong>${mapPopupPropName(item)}: </strong>` + item.value
                "
              ></span>
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
      return this.$appConfig.map.corporateEntitiesUrls[
        this.selectedCoorpNetworkEntity
      ];
    },
    ...mapGetters('map', {
      map: 'map',
      activeLayerGroup: 'activeLayerGroup',
      popupInfo: 'popupInfo'
    }),
    ...mapFields('map', {
      popup: 'popup',
      selectedCoorpNetworkEntity: 'selectedCoorpNetworkEntity'
    })
  },
  methods: {
    parseUrl(url) {
      return UrlUtil.parseUrl(url);
    },
    closePopupInfo() {
      EventBus.$emit('closePopupInfo');
      this.popup.highlightLayer.getSource().clear();
      this.popup.worldExtentLayer.getSource().clear();
    },
    findCoorporateNetwork() {
      EventBus.$emit('findCoorporateNetwork');
    },
    closeCorpNetworkSelection() {
      this.closePopupInfo();
      this.selectedCoorpNetworkEntity = null;
      this.isIframeLoading = true;
    }
  }
};
</script>

<style lang="css" scoped>
.sidepanel-header {
  width: 100%;
  text-align: center;
}

.documentation-wrapper {
  margin: 10px;
  overflow: hidden;
  margin: 15px auto;
  max-width: 780px;
}

iframe {
  border: 0px none;
  margin-left: 10px;
  height: 1200px;
  width: 550px;
}
</style>
