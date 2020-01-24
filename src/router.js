import Vue from 'vue'
import Router from 'vue-router'
import Walkaboutit2020 from './views/walkaboutit/Walkaboutit2020.vue'
import MapWalkaboutit from './components/MapWalkaboutit.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/walkaboutit/2020'
    },
    {
      path: '/walkaboutit/2020',
      name: 'walkaboutit2020',
      components: {
        default: Walkaboutit2020,
        map: MapWalkaboutit
      }
    },
    {
      path: '/walkaboutit/previous',
      name: 'walkaboutitPrevious',
      components: {
        default: () => import('./views/walkaboutit/WalkaboutitPrevious.vue'),
        map: MapWalkaboutit
      }
    }
  ]
})
