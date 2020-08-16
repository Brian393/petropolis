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
              rounded
              v-bind="attrs"
              color="rgb(228, 76, 107)"
              class="elevation-0"
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

      <v-spacer></v-spacer>

      <div v-for="(fuelGroup, index) in fuelGroups" :key="index">
        <v-btn
          min-width="140"
          class="mx-10"
    
          :dark="activeLayerGroup.fuelGroup === fuelGroup.name ? false : true"
          @click="changeFuelGroup(fuelGroup)"
          :color="
            activeLayerGroup.fuelGroup === fuelGroup.name ? 'white' : '#E44C6B'
          "
          :class="{
            'elevation-0': activeLayerGroup.fuelGroup !== fuelGroup.name,
            'font-weight-bold black--text':
              activeLayerGroup.fuelGroup === fuelGroup.name,
            'elevation-6': activeLayerGroup.fuelGroup === fuelGroup.name
          }"
        >
          {{ fuelGroup.title }}
        </v-btn>
      </div>

      <v-spacer></v-spacer>
      <v-toolbar-title
        @click="goToHome()"
        flat
        class="logo headline font-weight-bold black--text mr-3"
        >Just Transition</v-toolbar-title
      >

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
      selectedCoorpNetworkEntity: 'selectedCoorpNetworkEntity',
      fuelGroups: 'fuelGroups'
    }),
    ...mapGetters('auth', {
      loggedUser: 'loggedUser'
    }),
    ...mapGetters('map', {
      activeLayerGroup: 'activeLayerGroup',
      fuelGroups: 'fuelGroups'
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
      if (this.$router.currentRoute.name === 'oil') {
        EventBus.$emit('resetMap');
      }
      this.$router.push({ name: 'oil' });
    },
    goToAdminDashboard() {
      this.$router.push({ name: 'admin.dashboard' });
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
    changeFuelGroup(fuelGroup) {
      this.$router.push({ path: `/${fuelGroup.name}` });
    },
    ...mapMutations('map', {
      setActiveLayerGroup: 'SET_ACTIVE_LAYERGROUP'
    })
  },
  created() {
     console.log(this.$router.currentRoute)
    this.setActiveLayerGroup({
      fuelGroup: this.fuelGroup,
      region: this.region
    });
  },
  watch: {
    $route() {
      console.log(this.$router.currentRoute)
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
