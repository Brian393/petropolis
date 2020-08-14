import Vue from 'vue';
import VueRouter from 'vue-router';
import Petropolis from '../views/Petropolis.vue';
Vue.use(VueRouter);
import { validateToken } from '../utils/Helpers';

const routes = [
  {
    path: '/',
    name: "map",
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
  },
  // Admin dashboard view...
  {
    path: '/petropolis/admin',
    // lazy-loaded
    component: () => import('../views/Admin.vue'),
    children: [
      {
        path: '',
        name: 'admin.dashboard',
        component: () => import('../components/dashboard/Dashboard.vue'),
        meta: {
          requiresAuth: true,
          scope: 'admin_user'
        }
      },
      {
        path: 'user',
        name: 'admin.users',
        component: () => import('../components/dashboard/User.vue'),
        meta: {
          requiresAuth: true,
          scope: 'admin_user'
        }
      },
      {
        path: 'settings',
        name: 'admin.settings',
        component: () => import('../components/dashboard/Settings.vue'),
        meta: {
          requiresAuth: true,
          scope: 'admin_user'
        }
      }
    ]
  }
];

const router = new VueRouter({
  routes
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth);
  if (!requiresAuth) {
    next();
  }
  // Get roles and check if user is allowed
  const token = localStorage.getItem('token');
  const decodedToken = validateToken(token);
  if (!decodedToken || !decodedToken.roles) {
    return next({ path: '/' });
  }

  const roleScope = to.meta.scope;
  if (
    Array.isArray(decodedToken.roles) &&
    decodedToken.roles.includes(roleScope)
  ) {
    next();
  } else {
    return next({ path: '/' });
  }
});

export default router;
