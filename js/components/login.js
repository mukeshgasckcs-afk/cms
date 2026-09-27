const Login = {
  template: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6 text-center"> 
          <h1 class="text-danger fw-bold mb-2">Courier Management System</h1>
          <p class="text-muted">Fast, reliable, and trackable courier logistics</p>
        </div>
      </div>

      <div class="row justify-content-center mt-3">
        <div class="col-md-5">
          <div class="card border-danger shadow-sm">
            <h3 class="card-header text-center text-danger font-weight-bold bg-white border-bottom border-danger">Login</h3>
            <div class="card-body p-4">
              <form @submit.prevent="login">
                <div class="mb-3">
                  <label for="inputUsername3" class="form-label text-dark fw-bold">Username</label>
                  <input v-model="username" type="text" class="form-control" id="inputUsername3" placeholder="Enter your username" autocomplete="username" required>
                </div>
                <div class="mb-3">
                  <label for="inputPassword3" class="form-label text-dark fw-bold">Password</label>
                  <input v-model="password" type="password" class="form-control" id="inputPassword3" placeholder="Enter your password" autocomplete="current-password" required>
                </div>
  
                <div class="d-grid gap-2 mb-3">
                  <button type="submit" class="btn btn-danger">Login</button>
                </div>

                <div class="text-center">
                  <router-link to="/register" class="btn btn-link text-decoration-none">Don't have an account? Register</router-link>
                  <br/>
                  <router-link to="/password-recovery" class="btn btn-link text-muted text-decoration-none small">Forgot your password? Recover it here</router-link>
                </div>
              </form>
            </div>
          </div>

          <!-- Demo Accounts Helper Box -->
          <div class="card mt-3 border-info shadow-sm bg-light">
            <div class="card-body p-3">
              <h6 class="card-title text-info fw-bold mb-2">Demo Credentials (Password: <code>password123</code>):</h6>
              <div class="d-flex flex-wrap gap-2">
                <button type="button" class="btn btn-sm btn-outline-dark" @click="fillDemo('admin')">Admin</button>
                <button type="button" class="btn btn-sm btn-outline-dark" @click="fillDemo('manager_chennai')">Manager (Chennai)</button>
                <button type="button" class="btn btn-sm btn-outline-dark" @click="fillDemo('manager_trichy')">Manager (Trichy)</button>
                <button type="button" class="btn btn-sm btn-outline-dark" @click="fillDemo('shib')">User (Shib)</button>
              </div>
            </div>
          </div>

          <div id="flashMessage" class="alert alert-danger mt-3 text-center" v-if="flashMessage">
            {{ flashMessage }}
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      username: '',
      password: '',
      flashMessage: ''
    };
  },
  methods: {
    fillDemo(demoUsername) {
      this.username = demoUsername;
      this.password = 'password123';
    },
    async login() {
      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: this.username,
            password: this.password
          })
        });

        const data = await response.json();

        if (response.status === 200) {
          console.log('Login successful:', data.role);
          // Update root userRole reactively
          if (this.$root && this.$root.updateUserRole) {
            this.$root.updateUserRole(data.role);
          }

          if (data.role === 'admin') {
            this.$router.push({ name: 'admin_dashboard' });
          } else if (data.role === 'manager') {
            this.$router.push({ name: 'manager_dashboard' });
          } else {
            this.$router.push({ name: 'home' });
          }
        } else {
          this.flashMessage = data.message || 'Login failed';
        }
      } catch (err) {
        console.error('Login error:', err);
        this.flashMessage = 'Network error occurred. Please try again.';
      }
    }
  }
};

export default Login;
