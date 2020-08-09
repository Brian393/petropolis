<template>
  <v-dialog v-model="show" max-width="355px">
    <v-card flat>
      <v-app-bar flat color="#dc143c" height="50" dark>
        <v-spacer></v-spacer>
        <v-toolbar-title>Sign In</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-app-bar>
      <v-divider></v-divider>
      <v-progress-linear
        :active="loading"
        indeterminate
        color="#dc143c"
      ></v-progress-linear>
      <v-alert class="ma-2" outlined v-if="error" type="error">
        {{ error }}
      </v-alert>
      <v-card-text class="mt-5">
        <v-form
          @keyup.native.enter="handleLogin"
          @submit.prevent="handleLogin"
          v-model="valid"
          lazy-validation
        >
          <v-text-field
            v-model="user.username"
            prepend-icon="person"
            name="username"
            label="Username"
            type="text"
            :rules="[rules.required]"
            :disabled="loading"
          ></v-text-field>
          <v-text-field
            v-model="user.password"
            prepend-icon="lock"
            name="password"
            :append-icon="value ? 'visibility' : 'visibility_off'"
            @click:append="() => (value = !value)"
            :type="value ? 'password' : 'text'"
            :rules="[rules.required]"
            label="Password"
            required
            :disabled="loading"
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions class="my-1">
        <v-spacer></v-spacer>
        <v-btn
          :disabled="loading"
          class="white--text"
          @click="handleLogin"
          color="#dc143c"
        >
          <v-icon left>fas fa-sign-in-alt</v-icon> Login</v-btn
        >
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import User from '../../models/user';

export default {
  data: () => ({
    user: new User('', ''),
    valid: true,
    loading: false,
    error: '',
    value: String,
    rules: {
      required: value => !!value || 'Required.'
    }
  }),
  props: ['visible'],
  computed: {
    show: {
      get() {
        return this.visible;
      },
      set(value) {
        if (!value) {
          this.$emit('close');
        }
      }
    }
  },
  methods: {
    handleLogin() {
      if (!this.valid) {
        this.loading = false;
        return;
      }
      this.error = '';
      this.loading = true;
      this.$store.dispatch('auth/login', this.user).then(
        () => {
          this.loading = false;
          this.error = '';
          this.$emit('close');
        },
        error => {
          this.loading = false;
          this.error =
            error.response && error.response.data && error.response.data.err
              ? error.response.data.err
              : "Can't login in with provider credentials";
        }
      );
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
