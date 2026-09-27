const Register = {
  template: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6 text-center"> 
          <h1 class="text-danger fw-bold mb-2">Courier Management System</h1>
          <p class="text-muted">Create a new account</p>
        </div>
      </div>

      <div class="row justify-content-center mt-3">
        <div class="col-md-5">
          <div class="card border-danger shadow-sm">
            <h3 class="card-header text-center text-danger font-weight-bold bg-white border-bottom border-danger">Register</h3>
            <div class="card-body p-4">
              <form @submit.prevent="register">
                <div class="mb-3">
                  <label for="inputUserName3" class="form-label text-dark fw-bold">Full Name</label>
                  <input v-model="name" type="text" class="form-control" id="inputUserName3" placeholder="Your Name" required>
                </div>
                <div class="mb-3">
                  <label for="inputUsername3" class="form-label text-dark fw-bold">Username</label>
                  <input v-model="username" type="text" class="form-control" id="inputUsername3" placeholder="Choose a username" required>
                  <small class="text-muted">Prefix with "manager" (e.g. manager_delhi) to request manager role.</small>
                </div>
                <div class="mb-3">
                  <label for="inputUseremail3" class="form-label text-dark fw-bold">Email</label>
                  <input v-model="email" type="email" class="form-control" id="inputUseremail3" placeholder="name@example.com" required>
                </div>
                <div class="mb-3">
                  <label for="inputPassword3" class="form-label text-dark fw-bold">Password</label>
                  <input v-model="password" type="password" class="form-control" id="inputPassword3" placeholder="Create password" required>
                </div>

                <div class="d-grid gap-2 mb-3">
                  <button type="submit" class="btn btn-danger">Register</button>
                </div>
                <div class="text-center">
                  <router-link to="/login" class="btn btn-link text-decoration-none">Already have an account? Login</router-link>
                </div>
              </form>
            </div>
          </div>
          <div id="flashMessage" class="alert alert-danger mt-3 text-center" v-if="flashMessage">
            {{ flashMessage }}
          </div>
          <div class="alert alert-success mt-3 text-center" v-if="successMessage">
            {{ successMessage }}
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      name: '',
      username: '',
      email: '',
      password: '',
      flashMessage: '',
      successMessage: ''
    };
  },
  methods: {
    async register() {
      try {
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: this.name,
            username: this.username,
            email: this.email,
            password: this.password
          })
        });

        const data = await response.json();

        if (response.status === 200) {
          this.flashMessage = '';
          this.successMessage = 'Registration successful! Redirecting to login...';
          setTimeout(() => {
            this.$router.push({ name: 'login' });
          }, 1200);
        } else {
          this.flashMessage = data.message || 'Registration failed';
        }
      } catch (err) {
        console.error('Registration error:', err);
        this.flashMessage = 'Network error occurred. Please try again.';
      }
    }
  }
};

export default Register;
