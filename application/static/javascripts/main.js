import router from "./router.js";
async function fetchUserRoleFromAPI() {
    try {
      const response = await fetch('/api/user/role'); 
      const data = await response.json();
      console.log('user role:', data.role);
      return data.role; 

    } catch (error) {
      console.error('Error fetching user role:', error);
      return 'regular user'; 
    }
  }
const app = Vue.createApp({
    data() {
        return {
            message: '',
            userRole: '',


        };
    },
    delimiters: ['{', '}'],
    methods: {},
    async created() {
        // Fetching the user role and provide it to all child components
        this.userRole = await fetchUserRoleFromAPI();
      },
});

router.beforeEach((to, from, next) => {
    document.title = to.meta.title || 'Default Title'; // Setting the document title or use a default title
    next();
    
  });
  
// Use the router with the Vue app
app.use(router);
app.mount('#app');