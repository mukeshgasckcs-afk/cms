import Home from './components/home.js';
import Admin_Dashboard from './components/admin_dashboard.js';
import Manager_Dashboard from './components/manager_dashboard.js';
import Login from './components/login.js';
import Profile from './components/profile.js';
import Cart from './components/cart.js';
import Admin_Management from './components/admin_management.js';
import Register from './components/register.js';
import Summary from './components/summary.js';
import PasswordRecovery from './components/PasswordRecovery.js';
import { db } from './db.js';

const routes = [
  {
    path: '/admin_dashboard',
    component: Admin_Dashboard,
    name: 'admin_dashboard',
    meta: { title: 'Admin Dashboard', requiresAuth: true, role: 'admin' }
  },
  {
    path: '/admin_management',
    component: Admin_Management,
    name: 'admin_management',
    meta: { title: 'Admin Management', requiresAuth: true, role: 'admin' }
  },
  {
    path: '/manager_dashboard',
    component: Manager_Dashboard,
    name: 'manager_dashboard',
    meta: { title: 'Manager Dashboard', requiresAuth: true, role: 'manager' }
  },
  {
    path: '/logout',
    name: 'logout',
    beforeEnter: (to, from, next) => {
      db.clearCurrentUser();
      next({ name: 'login' });
    }
  },
  {
    path: '/profile',
    component: Profile,
    name: 'profile',
    meta: { title: 'Profile Page', requiresAuth: true }
  },
  {
    path: '/summary',
    component: Summary,
    name: 'summary',
    meta: { title: 'Summary Page', requiresAuth: true, role: 'admin' }
  },
  {
    path: '/home',
    component: Home,
    name: 'home',
    meta: { title: 'Home - New Courier', requiresAuth: true }
  },
  {
    path: '/cart',
    component: Cart,
    name: 'cart',
    meta: { title: 'Cart', requiresAuth: true }
  },
  {
    path: '/password-recovery',
    component: PasswordRecovery,
    name: 'password-recovery',
    meta: { title: 'Password Recovery', showNavbar: false }
  },
  {
    path: '/register',
    component: Register,
    name: 'register',
    meta: { title: 'Register', showNavbar: false }
  },
  {
    path: '/login',
    component: Login,
    name: 'login',
    meta: { title: 'Login', showNavbar: false }
  },
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login'
  }
];

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} - Courier System` : 'Courier System';
  const currentUser = db.getCurrentUser();

  if (to.meta.requiresAuth && !currentUser) {
    next({ name: 'login' });
  } else if ((to.name === 'login' || to.name === 'register') && currentUser) {
    if (currentUser.role === 'admin') next({ name: 'admin_dashboard' });
    else if (currentUser.role === 'manager') next({ name: 'manager_dashboard' });
    else next({ name: 'home' });
  } else {
    next();
  }
});

export default router;
