<template>
  <div>
    <div id="items" v-if="nav.items">
      <router-link v-for="item in nav.items" :key="item.name" :to="item.href" class="btn">{{item.name}}</router-link>
    </div>

    <div id="subItems" v-if="navSubItems">
      <router-link v-for="subItem in navSubItems" :key="subItem.name" :to="subItem.href" class="btn subItem">{{subItem.name}}</router-link>
    </div>
  </div>
</template>
<style scoped>
#items, #subItems {
  position: absolute;
  bottom: 20px;
  z-index: 1;
  border-radius: 6px;
  background-color: rgba(255,255,255, 0.5);
  display: flex;
}

#items {
  left: 0.25em;
  flex-direction: column;
  width: 150px;
}

#subItems {
  left: calc(150px + 0.5em);
  min-width: calc(100px - 0.2em);
  max-width: calc(100vw - 400px - 150px - 3em);
  flex-direction: row;
  flex-wrap: wrap;
}

.btn {
  padding: 0.25em;
  text-align: center;
  border: thin solid darkgray;
  border-radius: 6px;
  margin: 0.1em;
  background-color: rgba(255,255,255, 0.5);
  color: black;
  text-decoration: none;
}

.btn:hover, .router-link-active {
  background-color: #0E8817;
  color: white;
}

.subItem {
  width: 100px;
}

</style>
<script>
export default {
  name: 'AppNav',
  data: function () {
    return {
      nav: [],
      navSubItems: [],
      watershed: {
        items: [
          {
            name: 'Introduction',
            href: '/watershed/introduction'
          },
          {
            name: 'Terminals',
            href: '/watershed/terminals'
          },
          {
            name: 'Dams',
            href: '/watershed/dams'
          },
          {
            name: 'Hanford',
            href: '/watershed/hanford'
          }
        ]
      },
      subItems: {
        hanford: [
          {
            name: 'Legacy',
            href: '/watershed/hanford/legacy'
          },
          {
            name: 'Plumes',
            href: '/watershed/hanford/plumes'
          },
          {
            name: 'Floods',
            href: '/watershed/hanford/floods'
          }
        ]
      }
    }
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
      if (/watershed/.test(this.$route.name)) {
        this.nav = this.watershed
      } else {
        this.nav = []
      }
      if (/watershedHanford/.test(this.$route.name)) {
        this.navSubItems = this.subItems.hanford
      } else {
        this.navSubItems = []
      }
    }
  }
}
</script>
