<template>
  <v-card>
    <v-jsoneditor
      v-model="json"
      :options="options"
      :plus="false"
      :height="'400px'"
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
        hello: 'vue'
      }
    };
  },
  methods: {
    onError() {
      console.log('error');
    }
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
