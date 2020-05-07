<template>
  <div v-if="!asideHidden">
    <div id="items" v-if="nav.items">
      <router-link v-for="item in nav.items" :key="item.name" :to="item.href" @click.native="routeClick(item.href)" class="btn">{{item.name}}</router-link>
    </div>

    <div id="subItems" v-if="navSubItems">
      <router-link v-for="subItem in navSubItems" :key="subItem.name" :to="subItem.href" @click.native="routeClick(subItem.href)" class="btn subItem">{{subItem.name}}</router-link>
    </div>
  </div>
</template>
<style scoped>
#items, #subItems {
  position: absolute;
  z-index: 1;
  border-radius: 6px;
  background-color: rgba(255,255,255, 0.9);
  display: flex;
  font-size: 1.15em;
}

#items {
  bottom: 20px;
  left: 1em;
  flex-direction: column;
  width: 150px;
  max-height: calc(100vh - 170px);
  overflow-y: auto;
}

#subItems {
  font-size: 1em;
  left: calc(150px + 0.5em);
  width: 100%;
  min-width: calc(100px - 0.2em);
  max-width: calc(100vw - 400px - 150px);
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  background-color: transparent;
  max-height: calc(100vh - 170px);
  bottom: 20px;
}

.btn {
  padding: 0.25em;
  text-align: center;
  border: thin solid darkgray;
  border-radius: 6px;
  margin: 0.1em;
  background-color: #F2F2F2;
  color: black;
  text-decoration: none;
}

.btn:hover, .router-link-active {
  color: #c21313;
  background: white;
}

.subItem {
  min-width: 100px;
  height: 1.25em;
}
@media (max-width: 1075px) {
  #items, #subItems {
    font-size: 1em;
  }
  .subItem {
    width: auto;
  }
}
@media (max-width: 850px) {
  #items, #subItems {
    position: static;
    font-size: 1.5em;
  }
  #items, .subItem {
    width: 100%;
  }
  #subItems {
    margin-top: 1em;
    min-width: 100%;
    max-width: 100%;
  }
}
</style>
<script>
import {mapGetters} from 'vuex'
import {eventBus} from '../main'

export default {
  name: 'AppNav',
  data: function () {
    return {
      nav: [],
      navSubItems: [],
      petropolis: {
        items: [
          {
            name: 'Oil',
            href: '/petropolis/oil'
          },
          {
            name: 'Natural Gas',
            href: '/petropolis/gas'
          },
          {
            name: 'Coal',
            href: '/petropolis/coal'
          }
        ]
      },
      subItems: {
        pipelines: [
          {
            name: 'Rest of the Oil',
            href: '/petropolis/oil/world'
          }
        ],
        gas: [
          {
            name: 'Rest of the Gas',
            href: '/petropolis/gas/world'
          }
        ],
        coal: [
          {
            name: 'Rest of the Coal',
            href: '/petropolis/coal/world'
          }
        ]
      }
    }
  },
  computed: {
    // mix the getters from vuex store into computed with object spread operator
    ...mapGetters([
      'asideHidden'
    ])
  },
  watch: {
    '$route' (to, from) {
      // react to route changes...
      this.initNav()
    }
  },
  mounted: function () {
    this.initNav()
  },
  methods: {
    initNav: function () {
      if (/petropolis/.test(this.$route.name)) {
        this.nav = this.petropolis
      } else {
        this.nav = []
      }
      if (/petropolisOil/.test(this.$route.name)) {
        this.navSubItems = this.subItems.pipelines
      } else if (/petropolisGas/.test(this.$route.name)) {
        this.navSubItems = this.subItems.gas
      } else if (/petropolisCoal/.test(this.$route.name)) {
        this.navSubItems = this.subItems.coal
      } else {
        this.navSubItems = []
      }
    },
    routeClick: function (to) {
      if (to === this.$route.path) {
        eventBus.$emit('route-click')
      }
    }
  }
}
</script>
