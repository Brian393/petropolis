<template>
  <div id="app">
    <main>
      <nav>
        <span>&nbsp;</span>
        <router-link to="/megaregion/introduction" v-bind:class="{active: $route.name && $route.name.match('megaregion')}" @click.native="routeClick('/megaregion/introduction')">Megaregion</router-link>
        <router-link to="/watershed/introduction" v-bind:class="{active: $route.name && $route.name.match('watershed')}" @click.native="routeClick('/watershed/introduction')">Watershed</router-link>
        <router-link to="/bioregion/introduction" v-bind:class="{active: $route.name && $route.name.match('bioregion')}" @click.native="routeClick('/bioregion/introduction')">Bioregion</router-link>
        <span>&nbsp;</span>
        <div v-on:click="scrollToAside" id="aside-scroll-to" title="Skip To Content">
          <i class="material-icons">keyboard_arrow_down</i>
        </div>

      </nav>
      <router-view name="map" id="map" />
    </main>
    <AppNav></AppNav>
    <aside v-bind:class="{ 'no-flex': this.asideHidden}">
      <div id="aside-wraper">
        <div v-on:click="toggleAside" id="aside-toggle" title="Toggle Content">
          <i v-if="asideHidden" class="material-icons">menu</i>
          <i v-else class="material-icons">close</i>
        </div>
        <p id="aside-heading" v-bind:class="{hidden: this.asideHidden}">LEARNING FROM CASCADIA</p>
      </div>
      <div id="content" v-bind:class="{hidden: this.asideHidden}" ref="asideContent">
        <router-view/>
      </div>
    </aside>
  </div>
</template>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: flex;
  flex: 1 0 auto; /* 2 */
  flex-direction: column;
}

nav {
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: teal;      /*navbar background color */
}
nav a {
  font-weight: bold;
  color: #003232;              /*navbar text color */
  text-decoration: none;
  max-height: 50px;
  display: flex;
  align-items: center;
  font-size: 1em;            /*no idea what this does */
  padding: 5px 50px;
  line-height: 40px;
}
nav a.active, nav a.router-link-exact-active {
  background-color: #008000;       /*background color when active */
  color: white;                    /*text color when active */
}
nav a:hover {
  color: #dcdcdc;
}
#map {
  background-color: #f4f2f0;
  height: calc(100vh - 50px);
  border-top: thin solid #008000;
  box-sizing: border-box;
}

aside {
  background-color: #f4f2f0;
  border-left: medium solid #008000;
  border-bottom: medium solid #008000;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: visible;
}

#aside-wraper {
  position: sticky;
  top: 0;
  color: white;
  background-color: #008000;
  z-index: 1;
  height: 51px;
}

#aside-toggle, #aside-scroll-to {
  cursor: pointer;
  padding-top: 12px;
  text-align: center;
  height: 38px;
  width: 100%;
  max-width: 50px;
  float: right;
  display: none;
}
#aside-toggle:hover, #aside-scroll-to:hover {
  color: #008000;
  background-color: white;
  cursor: hand;
}

#aside-scroll-to {
  display: block;
}

aside .fullwidth {
  width: 100%;
}

.no-flex{
  position: absolute;
  top: 0;
  right: 0;
  height: 50px;
  width: 50px;
}
.hidden {
  display: none;
}

#content {
  max-height: 100%;
  overflow-y: visible;
  text-align: justify;
}

#aside-heading {
  margin-top: 0.8em;
  padding: 0;
  text-align: center;
  font-size: 1.2em;             /* sidebar header title, "Learning" */
  color: #dcdcdc;

}

#content {
  padding: 0 1em;
}

.aside-content h1{             /* sidebar item title settings */
  margin-top: 0.75em;
  margin-bottom: 0.75em;
  color: #800000;
}

.caption {
text-align: center; font-style: italic; font-size: 90%; margin-top:5px; margin-bottom:8px;
}

.quote {
font-weight: bold; font-style: italic; color: #333333;
}

@media (min-width: 1075px) {
  nav a {
    font-size: 1.5em;
    padding: 5px 50px;
  }
}

@media (min-width: 850px) {
  #app {
    flex-direction: row;
    height: 100vh;
  }
  main {
    flex: 1;
    margin: 0;
  }
  nav {
    justify-content: space-around;
  }
  aside {
    flex: 0 0 400px;
  }
  #aside-heading {
    padding: 0 0.6em;
    text-align: left;
  }
  #aside-toggle {
    display: block;
  }
  #aside-scroll-to {
    display: none;
  }
  #content, aside {
    overflow-x: hidden;           /*these scrolls affect hamburger button at upper right! */
    overflow-y: auto;        /*they create all kinds of weird micro arrows, very strange */
    max-height: 100vh;
  }
}

@media (max-width: 850px) {
  nav a {
    font-size: 1.25em;
  }
}
@media (max-width: 500px) {
  nav a {
    font-size: 1em;
    padding: 5px 5px;
  }
}

</style>

<script>
import { mapGetters } from 'vuex'
import AppNav from './components/AppNav.vue'
import {eventBus} from './main'

export default {
  name: 'App',
  components: {
    AppNav
  },
  watch: {
    '$route' (to, from) {
      // react to route changes...
      document.querySelector('aside > #content').scrollTop = 0
    }
  },
  computed: {
    // mix the getters into computed with object spread operator
    ...mapGetters([
      'asideHidden'
    ])
  },
  methods: {
    toggleAside () {
      this.$store.dispatch('toggle')
    },
    scrollToAside () {
      this.$refs.asideContent.scrollIntoView()
    },
    routeClick: function (to) {
      if (to === this.$route.path) {
        eventBus.$emit('route-click')
      }
    }
  }
}

</script>
