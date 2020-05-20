<template>
  <div>
    <v-tooltip right>
      <template v-slot:activator="{ on }">
        <v-btn
          class="mx-2 locate-button"
          style="top:170px;"
          v-on="on"
          fab
          dark
          x-small
          color="#DC143C"
          @click="locate()"
        >
          <v-icon medium>fas fa-location-arrow</v-icon>
        </v-btn>
      </template>
      <span>Locate Me</span>
    </v-tooltip>
  </div>
</template>
<script>
export default {
  props: {
    map: { type: Object, required: true }
  },
  name: 'locate',
  methods: {
    locate() {}
  }
};
</script>
<style lang="css" scoped>
.locate-button {
  position: absolute;
  left: 12px;
  z-index: 1;
}
</style>
