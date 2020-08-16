<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app clipped>
      <v-list dense>
        <div :key="item.text" v-for="item in items">
          <v-list-item :to="item.to" :exact="true">
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                {{ item.text }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </div>
      </v-list>

      <v-list dense> </v-list>
    </v-navigation-drawer>

    <v-app-bar app clipped-left color="#dc143c" dark dense>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title class="mr-12 align-center">
        <span class="title">Admin Dashboard</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- USER INFO AND LOGOUT (AUTHENTICATED)-->

      <!-- USER INFO AND LOGOUT (AUTHENTICATED)-->
      <template v-if="loggedUser">
        <v-menu
          origin="center center"
          offset-y
          :nudge-bottom="10"
          transition="scale-transition"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              small
              rounded
              color="rgb(228, 76, 107)"
              class="elevation-0"
              v-on="on"
              v-bind="attrs"
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
              @click="goToMap"
            >
              <v-list-item-icon>
                <v-icon>map</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Map</v-list-item-title>
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
    </v-app-bar>

    <v-content dark>
      <v-container dark>
        <v-row align="start">
          <v-col>
            <router-view></router-view>
          </v-col>
        </v-row>
      </v-container>
    </v-content>

    <snackbar />
  </v-app>
</template>

<script>
import Snackbar from '../components/core/Snackbar';
import { mapGetters } from 'vuex';

export default {
  props: {
    source: String
  },
  components: {
    Snackbar
  },
  data: () => ({
    drawer: null,
    items: [
      { icon: 'dashboard', text: 'Dashboard', to: { name: 'admin.dashboard' } },
      { icon: 'person', text: 'User', to: { name: 'admin.users' } },
      { icon: 'settings', text: 'Settings', to: { name: 'admin.settings' } }
    ]
  }),
  methods: {
    goToMap() {
      this.$router.push({ name: 'map' });
    },
    logOut() {
      this.$store.dispatch('auth/logout');
      this.goToMap();
    }
  },

  computed: {
    ...mapGetters('auth', {
      loggedUser: 'loggedUser'
    })
  }
};
</script>
