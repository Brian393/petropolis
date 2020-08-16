import Vue from 'vue';
import VueRouter from 'vue-router';
import Petropolis from '../views/Petropolis.vue';
Vue.use(VueRouter);
import { validateToken } from '../utils/Helpers';

const routes = [
  {
    path: '/',
    name: 'map',
    redirect: '/oil'
  },
  {
    path: '/oil',
    name: 'oil',
    component: Petropolis,
    props: { fuelGroup: 'oil', region: 'default' }
  },
  {
    path: '/oil/local',
    name: 'oilLocal',
    component: Petropolis,
    props: { fuelGroup: 'oil', region: 'local' }
  },
  {
    path: '/oil/global',
    name: 'oilGlobal',
    component: Petropolis,
    props: { fuelGroup: 'oil', region: 'global' }
  },
  {
    path: '/coal',
    name: 'coal',
    component: Petropolis,
    props: { fuelGroup: 'coal', region: 'default' }
  },
  {
    path: '/coal/local',
    name: 'coalLocal',
    component: Petropolis,
    props: { fuelGroup: 'coal', region: 'local' }
  },
  {
    path: '/coal/global',
    name: 'coalGlobal',
    component: Petropolis,
    props: { fuelGroup: 'coal', region: 'global' }
  },
  {
    path: '/renewables',
    name: 'renewables',
    component: Petropolis,
    props: { fuelGroup: 'renewables', region: 'default' }
  },
  {
    path: '/renewables/local',
    name: 'renewablesLocal',
    component: Petropolis,
    props: { fuelGroup: 'renewables', region: 'local' }
  },
  {
    path: '/renewables/global',
    name: 'renewablesGlobal',
    component: Petropolis,
    props: { fuelGroup: 'renewables', region: 'global' }
  },
  // Admin dashboard view...
  {
    path: '/admin',
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
        },
        redirect: 'user'
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
    return next();
  }
  // Get roles and check if user is allowed
  const token = localStorage.getItem('token');
  const decodedToken = validateToken(token);
  if (!decodedToken || !decodedToken.roles) {
    return next({ path: '/', params: { showLogin: true } });
  }

  const roleScope = to.meta.scope;
  if (
    Array.isArray(decodedToken.roles) &&
    decodedToken.roles.includes(roleScope)
  ) {
    return next();
  } else {
    return next({ path: '/', params: { showLogin: true } });
  }
});

export default router;
