import Home from "./components/home.js";
import Admin_Dashboard from "./components/admin_dashboard.js";
import Manager_Dashboard from "./components/manager_dashboard.js";
import Login from "./components/login.js";

import Profile from "./components/profile.js";
import Cart from "./components/cart.js";
import Admin_Management from "./components/admin_management.js";
import Register from "./components/register.js"
import Summary from "./components/summary.js";
import PasswordRecovery from "./components/PasswordRecovery.js"

// routes
const routes = [
    {
        path: '/admin_dashboard',
        component: Admin_Dashboard,
        name: 'admin_dashboard',
        meta: { title: 'Admin Dashboard' }
    },
    {
        path: '/admin_management',
        component: Admin_Management,
        name: 'admin_management',
        meta: { title: 'Admin Management' }
    },
    {
        path: '/manager_dashboard',
        component: Manager_Dashboard,
        name: 'manager_dashboard',
        meta: { title: 'Manager Dashboard' }
    },

    {
        path: '/logout',
        component: Login,
        name: 'logout',
        meta: { title: 'Login Page' , showNavbar: false }
    },
    {
        path: '/profile',
        component: Profile,
        name: 'profile',
        meta: { title: 'Profile Page' }
    },
    {
        path: '/summary',
        component: Summary,
        name: 'summary',
        meta: { title: 'Summary Page' }
    },
    {
        path: '/home',
        component: Home,
        name: 'home',
        meta: { title: 'Home' }
    },

    {
        path: '/cart',
        component: Cart,
        name: 'cart',
        meta: { title: 'Cart' }
    },
    {
        path: '/password-recovery',
        component: PasswordRecovery,
        name: 'password-recovery',
        meta: { title: 'Password Recovery Page', showNavbar: false  }

    },
    {
        path: '/register',
        component: Register,
        name: 'register',
        meta: { title: 'Register Page', showNavbar: false  }

    },
    {
        path: '/login',
        component: Login,
        name: 'login',
        meta: { title: 'Login Page', showNavbar: false  }

    }
,
{
    path: '/',
    component: Login,
    name: 'login',
    meta: { title: 'Login Page', showNavbar: false  }
    
}
];


// Vue Router instance
const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes
});

export default router;