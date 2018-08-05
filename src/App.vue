<template>
  <div id="app">
    <main>
      <nav>
        <router-link to="/megaregion">Megaregion</router-link>
        <router-link to="/watershed">Watershed</router-link>
        <router-link to="/bioregion">Bioregion</router-link>
      </nav>
      <router-view name="map" id="map" />
    </main>
    <aside>
      <div id="aside-wraper">
        <div v-on:click="toggleAside" id="aside-toggle">
          <i v-if="asideHidden" class="material-icons">
          menu
          </i>
          <i v-else class="material-icons">
          close
          </i>
        </div>
        <h1 id="aside-heading">Learning From Cascadia</h1>
      </div>
      <div id="content">
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

nav a:hover, nav a.router-link-exact-active {
  background-color: #0E8817;
  color: white;
}

#map {
  background-color: rgba(147, 128, 108, 0.1);
  height: calc(100vh - 50px);
}

aside {
  display: flex;
  flex-direction: column;
  overflow: scroll;
  padding-left: 1em;
}

aside h1 {
  margin: 0.25em;
}

#aside-wraper {
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1;
}

#aside-toggle {
  padding-top: 12px;
  text-align: center;
  height: 40px;
  width: 40px;
  float: right;
}
#aside-toggle:hover{
  color: white;
  background-color: #0E8817;
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
  padding-right: 1em;
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
  nav {
    justify-content: space-around;
  }
  main {
    flex: 1;
    margin: 0;
  }
  aside {
    flex: 0 0 400px;
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
      if (this.asideHidden) {
        document.getElementById('content').classList.remove('hidden')
        document.getElementById('aside-heading').classList.remove('hidden')
        document.getElementsByTagName('aside')[0].classList.remove('no-flex')
        this.asideHidden = false
      } else {
        document.getElementById('content').classList.add('hidden')
        document.getElementById('aside-heading').classList.add('hidden')
        document.getElementsByTagName('aside')[0].classList.add('no-flex')
        this.asideHidden = true
      }
    }
  }
}

</script>
