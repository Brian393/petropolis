<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-app-bar dark color="#dc143c" dense flat>
          <v-app-bar-nav-icon
            ><v-icon>{{ options.icon }}</v-icon></v-app-bar-nav-icon
          >
          <v-toolbar-title class="white--text">{{ title }}</v-toolbar-title>
        </v-app-bar>
        <v-card-text>
          <v-container>
            <v-form
              v-if="['new', 'update'].includes(mode)"
              ref="userForm"
              v-model="valid"
            >
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="user.firstName"
                    label="First name*"
                    prepend-icon="person"
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="user.lastName"
                    label="Last name*"
                    prepend-icon="person"
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="user.email"
                    label="Email*"
                    prepend-icon="email"
                    :rules="[rules.required, rules.email]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-if="mode === 'new'"
                    v-model="user.password"
                    label="Password*"
                    prepend-icon="lock"
                    type="password"
                    :rules="[
                      rules.required,
                      rules.password,
                      rules.passwordNumber
                    ]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-if="mode === 'new'"
                    v-model="confirmPassword"
                    label="Confirm Password*"
                    prepend-icon="lock"
                    type="password"
                    :rules="[rules.required, passwordConfirmationRule]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-select
                    prepend-icon="supervisor_account"
                    v-model="user.relatedRoleID"
                    :items="roleItems"
                    item-text="display"
                    item-value="value"
                    label="Role*"
                    :rules="[rules.required]"
                  ></v-select>
                </v-col>
              </v-row>
            </v-form>
            <v-form v-if="mode === 'updatePassword'" ref="updatePassword">
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-if="mode === 'new'"
                    v-model="user.password"
                    label="Password*"
                    prepend-icon="lock"
                    type="password"
                    :rules="[
                      rules.required,
                      rules.password,
                      rules.passwordNumber
                    ]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-if="mode === 'new'"
                    v-model="confirmPassword"
                    label="Confirm Password*"
                    prepend-icon="lock"
                    type="password"
                    :rules="[rules.required, passwordConfirmationRule]"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            :disabled="valid === false"
            color="blue darken-1"
            text
            @click="save"
            >Save</v-btn
          >
          <v-btn color="red darken-1" text @click="cancel">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import User from '../../models/user';
import UserUpdateDTO from '../../models/userUpdateDTO';

import { mapMutations } from 'vuex';

export default {
  data: () => ({
    user: new User(),
    confirmPassword: '',
    valid: true,
    dialog: false,
    resolve: null,
    reject: null,
    confirmText: null,
    cancelText: null,
    title: null,
    mode: ``,
    options: {
      color: 'primary',
      width: 320,
      icon: 'person',
      zIndex: 200
    },
    roleItems: [
      { value: 1, display: 'Admin User' },
      { value: 2, display: 'Regular User' }
    ],
    rules: {
      required: value => !!value || 'Required.',
      password: value => (value && value.length >= 8) || 'minimum 8 characters',
      passwordNumber: v => /(?=.*\d)/.test(v) || 'Must have one number',
      email: value => /.+@.+/.test(value) || 'E-mail must be valid'
    }
  }),
  methods: {
    open(mode, title, confirmText, cancelText, options, user) {
      this.mode = mode;
      if (user) {
        this.user = new UserUpdateDTO(
          user.userID,
          user.userName,
          user.email,
          user.firstName,
          user.lastName,
          user.relatedRoleID
        );
      }
      this.dialog = true;
      this.title = title;
      this.confirmText = confirmText;
      this.cancelText = cancelText;
      this.options = Object.assign(this.options, options);
    },
    save() {
      let api = '';
      let messageSuccess = '';
      let messageError = '';
      this.user.username = this.user.email;
      if (this.mode === 'new') {
        api = 'registerUser';
        messageSuccess = 'User create succesfully';
        messageError = "Can't register user";
      } else if (this.mode === 'udpate') {
        api = 'updateUser';
        messageSuccess = 'User updated succesfully';
        messageError = "Can't update user";
      } else if (this.mode === 'updatePassword') {
        api = 'updatePassword';
        messageSuccess = 'Password changed succesfully';
        messageError = "Can't change password";
      }

      this.$store.dispatch(`auth/${api}`, this.user).then(
        () => {
          this.toggleSnackbar({
            type: 'success',
            message: messageSuccess,
            state: true,
            timeout: 2000
          });
          this.$store.dispatch('auth/getUsers');
        },
        () => {
          this.toggleSnackbar({
            type: 'error',
            message: messageError,
            state: true,
            timeout: 2000
          });
        }
      );

      this.cancel();
    },
    cancel() {
      this.user = new User();
      this.confirmPassword = '';
      if (this.$refs.userForm) {
        this.$refs.userForm.reset();
      }
      if (this.$refs.updatePassword) {
        this.$refs.updatePassword.reset();
      }

      this.dialog = false;
    },
    ...mapMutations('map', {
      toggleSnackbar: 'TOGGLE_SNACKBAR'
    })
  },
  computed: {
    passwordConfirmationRule() {
      return () =>
        this.user.password === this.confirmPassword || 'Password must match';
    }
  }
};
</script>
