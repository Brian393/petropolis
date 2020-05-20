import Vue from 'vue';
import VueRouter from 'vue-router';
import Petropolis from '../views/Petropolis.vue';
Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
  {
    path: '/',
    redirect: '/petropolis/oil',
  },
  {
    path: '/petropolis/oil',
    name: 'petropolisOil',
    component: Petropolis,
    props: { fuelGroup: 'oil', region: 'default' }
  },
  {
    path: '/petropolis/oil/industry',
    name: 'petropolisOilIndustry',
    component: Petropolis,
    props: { fuelGroup: 'oil', region: 'industry' }
  },
  {
    path: '/petropolis/oil/world',
    name: 'petropolisOilWorld',
    component: Petropolis,
    props: { fuelGroup: 'oil', region: 'world' }
  },
  {
    path: '/petropolis/coal',
    name: 'petropolisCoal',
    components: Petropolis,
    props: { fuelGroup: 'coal', region: 'default' }
  },
  {
    path: '/petropolis/coal/industry',
    name: 'petropolisCoalIndustry',
    components: Petropolis,
    props: { fuelGroup: 'coal', region: 'industry' }
  },
  {
    path: '/petropolis/coal/world',
    name: 'petropolisCoalWorld',
    components: Petropolis,
    props: { fuelGroup: 'coal', region: 'world' }
  },
  {
    path: '/petropolis/gas',
    name: 'petropolisGas',
    components: Petropolis,
    props: { fuelGroup: 'gas', region: 'default' }
  },
  {
    path: '/petropolis/gas/industry',
    name: 'petropolisGasIndustry',
    components: Petropolis,
    props: { fuelGroup: 'gas', region: 'industry' }
  },
  {
    path: '/petropolis/gas/world',
    name: 'petropolisGasWorld',
    components: Petropolis,
    props: { fuelGroup: 'gas', region: 'world' }
  }
]
});

export default router;
