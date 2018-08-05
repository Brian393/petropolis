<template>
  <div id="app">
    <main>
      <nav>
        <md-menu md-direction="bottom-start">
          <md-button md-menu-trigger v-bind:class="{ 'md-primary': $route.name === 'megaregion' }">Megaregion</md-button>
          <md-menu-content>
            <md-menu-item to="/megaregion/introduction">Introduction</md-menu-item>
          </md-menu-content>
        </md-menu>

        <md-menu md-direction="bottom-start">
          <md-button md-menu-trigger v-bind:class="{ 'md-primary': $route.name === 'watershed' }">Watershed</md-button>
          <md-menu-content>
            <md-menu-item to="/watershed/introduction">Introduction</md-menu-item>
            <md-menu-item to="/watershed/terminals">Terminals</md-menu-item>
          </md-menu-content>
        </md-menu>

        <md-menu md-direction="bottom-start">
          <md-button md-menu-trigger v-bind:class="{ 'md-primary': $route.name === 'bioregion' }">Bioregion</md-button>
          <md-menu-content>
            <md-menu-item to="/bioregion/introduction">Introduction</md-menu-item>
          </md-menu-content>
        </md-menu>

      </nav>
      <router-view name="map" id="map" />
    </main>
    <aside v-bind:class="{ 'no-flex': this.asideHidden}">
      <div id="aside-wraper">
        <div v-on:click="toggleAside" id="aside-toggle">
          <i v-if="asideHidden" class="material-icons">menu</i>
          <i v-else class="material-icons">close</i>
        </div>
        <h1 id="aside-heading" v-bind:class="{hidden: this.asideHidden}">Learning From Cascadia</h1>
      </div>
      <div id="content" v-bind:class="{hidden: this.asideHidden}">
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
  justify-content: space-around;
  align-items: center;
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

#aside-toggle {
  padding-top: 12px;
  text-align: center;
  height: 50px;
  width: 100%;
  max-width: 50px;
  float: right;
  display: none;
}
#aside-toggle:hover{
  color: #0E8817;
  background-color: white;
  cursor: hand;
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

@media (min-width: 850px) {
  #app {
    flex-direction: row;
    height: 100vh;
  }
  main {
    flex: 1;
    margin: 0;
  }
  aside {
    flex: 0 0 400px;
  }
  #aside-toggle {
    display: block;
  }
}

</style>

<script>
export default {
  name: 'App',
  data: function () {
    return {
      asideHidden: false
    }
  },
  methods: {
    toggleAside () {
      this.asideHidden = !this.asideHidden
    }
  }
}

</script>
