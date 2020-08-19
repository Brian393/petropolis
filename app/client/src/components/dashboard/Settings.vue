<template>
  <v-card>
    <v-jsoneditor
      v-model="json"
      :plus="false"
      :height="'100%'"
      @error="onError"
    ></v-jsoneditor>
  </v-card>
</template>

<script>
import VJsoneditor from 'v-jsoneditor/src/index';

export default {
  components: {
    VJsoneditor
  },
  data() {
    return {
      json: {
        
      }
    };
  },
  methods: {
    onError() {
      console.log('error');
    }
  },
  created() {
    this.json = this.$appConfig;
  }
};
</script>

<style>
.jsoneditor-menu {
  background-color: #dc143c;
}

.jsoneditor {
  border: white;
}
</style>
