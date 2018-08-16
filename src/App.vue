<template>
  <div id="app">
    <main>
      <nav>
        <router-link to="/megaregion/introduction" v-bind:class="{active: $route.name && $route.name.match('megaregion')}">Megaregion</router-link>
        <router-link to="/watershed/introduction" v-bind:class="{active: $route.name && $route.name.match('watershed')}">Watershed</router-link>
        <router-link to="/bioregion/introduction" v-bind:class="{active: $route.name && $route.name.match('bioregion')}">Bioregion</router-link>

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
        <h1 id="aside-heading" v-bind:class="{hidden: this.asideHidden}">Learning From Cascadia</h1>
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
}
nav a {
  font-weight: bold;
  color: #0E8817;
  text-decoration: none;
  max-height: 50px;
  display: flex;
  align-items: center;
  font-size: 1.5em;
  padding: 5px 50px;
}
nav a:hover, nav a.active, nav a.router-link-exact-active {
  background-color: #0E8817;
  color: white;
}

#map {
  background-color: #f4f2f0;
  height: calc(100vh - 50px);
  border-top: thin solid #0E8817;
  box-sizing: border-box;
}

aside {
  background-color: #f4f2f0;
  border-left: thin solid #0E8817;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: scroll;
}

#aside-wraper {
  position: sticky;
  top: 0;
  color: white;
  background-color: #0E8817;
  z-index: 1;
  height: 51px;
}

#aside-toggle, #aside-scroll-to {
  padding-top: 12px;
  text-align: center;
  height: 38px;
  width: 100%;
  max-width: 50px;
  float: right;
  display: none;
}
#aside-toggle:hover, #aside-scroll-to:hover {
  color: #0E8817;
  background-color: white;
  cursor: hand;
}

#aside-scroll-to {
  display: block;
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
  max-height: calc(100vh - 50px);
  overflow-y: scroll;
}

#aside-heading {
  margin-top: 0.5em;
}

#content, #aside-heading {
  padding: 0 1em;
}

.aside-content h1{
  margin-top: 0.75em;
}

@media (max-width: 1075px) {
  nav a {
    font-size: 1.25em;
    padding: 5px 10px;
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
  #aside-toggle {
    display: block;
  }
  #aside-scroll-to {
    display: none;
  }
}

</style>

<script>
import { mapGetters } from 'vuex'
import AppNav from './components/AppNav.vue'

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
    }
  }
}

</script>
