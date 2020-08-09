<template>
  <v-app id="wg-app" data-app :class="{ 'wg-app': true }">
    <v-expand-transition>
      <v-navigation-drawer
        v-model="drawer"
        :width="!selectedCoorpNetworkEntity ? 460 : 600"
        class="elevation-6"
        stateless
        app
        clipped
        right
      >
        <side-panel></side-panel>
      </v-navigation-drawer>
    </v-expand-transition>

    <v-app-bar app clipped-right height="60" color="#dc143c" dark>
      <!-- USER LOGIN BUTTON -->
      <template v-if="!loggedUser">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              v-on="on"
              @click="openLoginPopup"
              style="margin-left:-4px;"
              icon
            >
              <v-icon large>account_circle</v-icon>
            </v-btn>
          </template>
          <span>Log In</span>
        </v-tooltip>
      </template>

      <!-- USER INFO AND LOGOUT -->
      <template v-if="loggedUser" style="margin-left:-4px;">
        <v-chip color="rgb(228, 76, 107)" text-color="white">
          <v-avatar left>
            <v-icon>mdi-account-circle</v-icon>
          </v-avatar>
          {{ `${loggedUser.user.firstName} ${loggedUser.user.lastName}     ` }}
        </v-chip>
        <template
          v-if="
            Array.isArray(loggedUser.roles) &&
              loggedUser.roles.includes('admin_user')
          "
        >
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                v-on="on"
                @click="logOut"
                class="mx-2 elevation-0"
                color="rgb(228, 76, 107)"
                fab
                x-small
                dark
              >
                <v-icon>dashboard</v-icon>
              </v-btn>
            </template>
            <span>Dashboard</span>
          </v-tooltip>
        </template>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              v-on="on"
              @click="logOut"
              class="mx-2 elevation-0"
              color="rgb(228, 76, 107)"
              fab
              x-small
              dark
            >
              <v-icon>exit_to_app</v-icon>
            </v-btn>
          </template>
          <span>Log Out</span>
        </v-tooltip>
      </template>

      <v-spacer></v-spacer>
      <v-toolbar-title
        style="margin-left:90px;"
        @click="goToHome()"
        flat
        class="logo headline font-weight-bold black--text"
        >Just Transition</v-toolbar-title
      >
      <v-spacer></v-spacer>
      <span class="title pr-5">before it's too late</span>

      <v-btn icon @click.stop="drawer = !drawer"
        ><v-icon medium>{{ drawer ? '$close' : '$menu' }}</v-icon></v-btn
      >
    </v-app-bar>

    <v-content>
      <v-container style="max-height: 100%;" fluid fill-height class="pa-0">
        <app-viewer />
      </v-container>
    </v-content>
    <login :visible="showLoginDialog" @close="showLoginDialog = false"> </login>
  </v-app>
</template>

<script>
import { EventBus } from '../EventBus.js';
import Viewer from '../components/viewer/viewer';
import Login from '../components/core/Login';
import SidePanel from '../components/core/SidePanel';
//Store imports
import { mapMutations, mapGetters } from 'vuex';
import { mapFields } from 'vuex-map-fields';

export default {
  name: 'wg-app',
  props: ['fuelGroup', 'region'],
  computed: {
    ...mapFields('map', {
      selectedCoorpNetworkEntity: 'selectedCoorpNetworkEntity'
    }),
    ...mapGetters('auth', {
      loggedUser: 'loggedUser'
    })
  },
  components: {
    login: Login,
    'app-viewer': Viewer,
    'side-panel': SidePanel
  },
  data() {
    return {
      drawer: true,
      showLoginDialog: false
    };
  },
  methods: {
    goToHome() {
      if (this.$router.currentRoute.name === 'petropolisOil') {
        EventBus.$emit('resetMap');
      }
      this.$router.push({ name: 'petropolisOil' });
    },
    zoomToLocation() {
      if (this.region === 'local') {
        EventBus.$emit('zoomToLocation');
      }
    },
    openLoginPopup() {
      this.showLoginDialog = true;
    },
    logOut() {
      this.$store.dispatch('auth/logout');
    },
    ...mapMutations('map', {
      setActiveLayerGroup: 'SET_ACTIVE_LAYERGROUP'
    })
  },
  created() {
    this.setActiveLayerGroup({
      fuelGroup: this.fuelGroup,
      region: this.region
    });
  },
  watch: {
    $route() {
      this.setActiveLayerGroup({
        fuelGroup: this.fuelGroup,
        region: this.region
      });
      this.zoomToLocation();
    }
  },
  mounted() {
    // inform registered cmps that the app is mounted and the dynamic
    // components are available
    EventBus.$emit('app-mounted');
  }
};
</script>
