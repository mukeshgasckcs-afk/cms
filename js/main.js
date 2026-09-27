// Main Vue Application Entry Point
import './api.js'; // Ensure fetch interceptor is loaded before components execute
import router from './router.js';
import { db } from './db.js';

const app = Vue.createApp({
  data() {
    return {
      userRole: '',
      currentUsername: ''
    };
  },
  computed: {
    isLoggedIn() {
      return !!this.currentUsername;
    }
  },
  methods: {
    refreshUser() {
      const user = db.getCurrentUser();
      if (user) {
        this.userRole = user.role;
        this.currentUsername = user.username;
      } else {
        this.userRole = '';
        this.currentUsername = '';
      }
    },
    updateUserRole(role) {
      this.userRole = role;
      const user = db.getCurrentUser();
      this.currentUsername = user ? user.username : '';
    },
    logout() {
      db.clearCurrentUser();
      this.userRole = '';
      this.currentUsername = '';
      router.push({ name: 'login' });
    }
  },
  created() {
    this.refreshUser();
  },
  mounted() {
    // Keep user state updated across route changes
    router.afterEach(() => {
      this.refreshUser();
    });
  }
});

app.use(router);
app.mount('#app');
