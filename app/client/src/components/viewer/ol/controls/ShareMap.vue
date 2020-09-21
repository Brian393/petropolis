<template>
  <!-- CREATE SCENARIO DIALOG -->
  <v-dialog v-model="show" max-width="400" @keydown.esc="shareMap = false">
    <v-card class="pb-1">
      <v-app-bar color="#dc143c" flat height="50" dark>
        <v-icon class="mr-3">fas fa-share</v-icon>
        <v-toolbar-title>Link to map </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-app-bar-nav-icon @click.stop="show = false"
          ><v-icon>close</v-icon></v-app-bar-nav-icon
        >
      </v-app-bar>
      <v-card-text class="mt-5">
        <v-form>
          <v-text-field
            ref="mapLink"
            readonly
            :value="mapShareLink"
            label="Map shareable link"
          >
            <template slot="append-outer">
              <v-tooltip left>
                <template v-slot:activator="{ on }"
                  ><v-icon @click="copyMapLink" v-on="on"
                    >content_copy</v-icon
                  ></template
                ><span>Copy</span>
              </v-tooltip>
            </template>
          </v-text-field>
        </v-form>
      </v-card-text>
      <v-alert class="mx-2 mb-1" dense outlined type="info" elevation="0">
        Copy and paste the link to share the map.
      </v-alert>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    visible: { type: Boolean },
    map: { type: Object, required: true }
  },
  data: () => ({
    mapShareLink: ''
  }),
  computed: {
    show: {
      get() {
        return this.visible;
      },
      set(value) {
        if (!value) {
          this.$emit('close');
          this.mapShareLink = '';
        }
      }
    }
  },
  methods: {
    createShareLink() {
      let url = window.location.href;
      url = url.split('?')[0];
      const center = this.map.getView().getCenter();
      const zoom = this.map.getView().getZoom();
      const visibleLayers = [];
      this.map
        .getLayers()
        .getArray()
        .forEach(layer => {
          if (layer.getVisible() && layer.get('displayInLegend')) {
            visibleLayers.push(layer.get('name'));
          }
        });
      this.mapShareLink = `${url}?coordinate=${center.toString()}&zoom=${zoom.toString()}&layers=${visibleLayers.toString()}`;
    },
    copyMapLink() {
      let mapLink = this.$refs.mapLink.$el.querySelector('input');
      mapLink.select();
      document.execCommand('copy');
    }
  },
  watch: {
    show() {
      if (this.show === true && this.map) {
        this.createShareLink();
      }
    }
  }
};
</script>

<style scoped>
.v-card__text,
.v-card__title {
  word-break: normal !important;
}
</style>
