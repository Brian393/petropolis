<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      :max-width="options.width"
      @keydown.esc="cancel"
      v-bind:style="{ zIndex: options.zIndex }"
    >
      <v-card>
        <v-card-title class="headline">{{ title }}</v-card-title>
        <v-card-text v-if="message">{{ message }}</v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary darken-1" text @click.native="agree">{{
            confirmText
          }}</v-btn>
          <v-btn color="#DC143C" text @click.native="cancel">{{
            cancelText
          }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  data: () => ({
    dialog: false,
    resolve: null,
    reject: null,
    message: null,
    confirmText: null,
    cancelText: null,
    title: null,
    options: {
      color: 'primary',
      width: 290,
      zIndex: 200
    }
  }),
  methods: {
    open(title, message, confirmText, cancelText, options) {
      this.dialog = true;
      this.title = title;
      this.message = message;
      this.confirmText = confirmText;
      this.cancelText = cancelText;
      this.options = Object.assign(this.options, options);
      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    },
    agree() {
      this.resolve(true);
      this.dialog = false;
    },
    cancel() {
      this.resolve(false);
      this.dialog = false;
    }
  }
};
/**
 * Vuetify Confirm Dialog component
 *
 * Insert component where you want to use it:
 * <confirm ref="confirm"></confirm>
 *
 * Call it:
 * this.$refs.confirm.open('Delete', 'Are you sure?', { color: 'red' }).then((confirm) => {})
 * Or use await:
 * if (await this.$refs.confirm.open('Delete', 'Are you sure?', { color: 'red' })) {
 *   // yes
 * }
 * else {
 *   // cancel
 * }
 *
 * Alternatively you can place it in main App component and access it globally via this.$root.$confirm
 * <template>
 *   <v-app>
 *     ...
 *     <confirm ref="confirm"></confirm>
 *   </v-app>
 * </template>
 *
 * mounted() {
 *   this.$root.$confirm = this.$refs.confirm.open
 * }
 */
</script>
