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
    path: '/petropolis/gas',
    name: 'petropolisGas',
    component: Petropolis,
    props: { fuelGroup: 'gas', region: 'default' }
  },
  {
    path: '/petropolis/gas/local',
    name: 'petropolisGasLocal',
    component: Petropolis,
    props: { fuelGroup: 'gas', region: 'local' }
  },
  {
    path: '/petropolis/gas/global',
    name: 'petropolisGasGlobal',
    component: Petropolis,
    props: { fuelGroup: 'gas', region: 'global' }
  }
];

const router = new VueRouter({
  routes
});


export default router;
