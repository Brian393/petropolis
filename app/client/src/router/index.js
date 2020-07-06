import Vue from 'vue';
import VueRouter from 'vue-router';
import Petropolis from '../views/Petropolis.vue';
Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/petropolis/oil'
  },
  {
    path: '/petropolis/oil',
    name: 'petropolisOil',
    component: Petropolis,
    props: { fuelGroup: 'oil', region: 'default' }
  },
  {
    path: '/petropolis/oil/local',
    name: 'petropolisOilLocal',
    component: Petropolis,
    props: { fuelGroup: 'oil', region: 'local' }
  },
  {
    path: '/petropolis/oil/global',
    name: 'petropolisOilGlobal',
    component: Petropolis,
    props: { fuelGroup: 'oil', region: 'global' }
  },
  {
    path: '/petropolis/coal',
    name: 'petropolisCoal',
    component: Petropolis,
    props: { fuelGroup: 'coal', region: 'default' }
  },
  {
    path: '/petropolis/coal/local',
    name: 'petropolisCoalLocal',
    component: Petropolis,
    props: { fuelGroup: 'coal', region: 'local' }
  },
  {
    path: '/petropolis/coal/global',
    name: 'petropolisCoalGlobal',
    component: Petropolis,
    props: { fuelGroup: 'coal', region: 'global' }
  },
  {
    path: '/petropolis/renewables',
    name: 'petropolisRenewables',
    component: Petropolis,
    props: { fuelGroup: 'renewables', region: 'default' }
  },
  {
    path: '/petropolis/renewables/local',
    name: 'petropolisRenewablesLocal',
    component: Petropolis,
    props: { fuelGroup: 'renewables', region: 'local' }
  },
  {
    path: '/petropolis/renewables/global',
    name: 'petropolisRenewablesGlobal',
    component: Petropolis,
    props: { fuelGroup: 'renewables', region: 'global' }
  }
];

const router = new VueRouter({
  routes
});


export default router;
