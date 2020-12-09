<template>
  <v-dialog v-model="show" persistent max-width="500px">
    <v-card v-if="command">
      <v-app-bar flat color="#dc143c" height="50" dark>
        <v-icon class="mr-3">playlist_add</v-icon>
        <v-toolbar-title>Expansion title</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-app-bar>
      <v-divider></v-divider>
      <v-card-text>
        <v-text-field class="mt-4" v-model="title" label="Title" />
      </v-card-text>

      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text color="error" @click="show = false">
          Close
        </v-btn>
        <v-btn :disabled="!this.title" color="primary" text @click="insert">
          Apply
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  data() {
    return {
      title: '',
      command: null,
      show: false
    };
  },
  methods: {
    showModal(command) {
      // Add the sent command
      this.clear();
      this.command = command;
      this.show = true;
    },
    insert() {
      const data = {
        command: this.command,
        data: {
          title: this.title
        }
      };

      this.$emit('onConfirm', data);
      this.show = false;
    },
    clear() {
      this.title = '';
    }
  }
};
</script>
