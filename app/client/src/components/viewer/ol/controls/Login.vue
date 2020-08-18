<template>
  <div class="my-4">
    <!-- USER LOGIN BUTTON -->
    <template v-if="!loggedUser">
      <v-tooltip right>
        <template v-slot:activator="{ on }">
          <v-btn
            class="login-button"
            v-on="on"
            @click="openLoginPopup"
            color="#dc143c"
            fab
            dark
            x-small
          >
            <v-icon medium>fas fa-user</v-icon>
          </v-btn>
        </template>
        <span>Log In</span>
      </v-tooltip>
    </template>
    <!-- USER INFO AND LOGOUT (AUTHENTICATED)-->
    <template v-if="loggedUser">
      <v-menu
        class="login-button"
        origin="center center"
        offset-y
        :nudge-bottom="10"
        transition="scale-transition"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            class="login-button"
            dark
            rounded
            v-bind="attrs"
            color="#dc143c"
            v-on="on"
            ><v-icon left>person</v-icon>
            {{
              `${loggedUser.user.firstName} ${loggedUser.user.lastName}     `
            }}</v-btn
          >
        </template>

        <v-list dense>
          <v-list-item
            v-if="
              Array.isArray(loggedUser.roles) &&
                loggedUser.roles.includes('admin_user')
            "
            @click="goToAdminDashboard"
          >
            <v-list-item-icon>
              <v-icon>dashboard</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Dashboard</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="logOut">
            <v-list-item-icon>
              <v-icon>exit_to_app</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Logout</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
    <login :visible="showLoginDialog" @close="showLoginDialog = false"> </login>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import Login from '../../../../components/core/Login';

export default {
  name: 'login-button',
  data: () => ({
    showLoginDialog: false
  }),
  computed: {
    ...mapGetters('auth', {
      loggedUser: 'loggedUser'
    })
  },
  components: {
    login: Login
  },
  methods: {
    /**
     * Switch to/from fullscreen mode.
     * Must be triggered by mouse event
     */
    goToAdminDashboard() {
      this.$router.push({ name: 'admin.dashboard' });
    },
    logOut() {
      this.$store.dispatch('auth/logout');
    },
    openLoginPopup() {
      this.showLoginDialog = true;
    }
  }
};
</script>
<style lang="css" scoped>
.login-button {
  z-index: 1;
}
</style>
