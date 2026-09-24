const Login = {
    template: `
        <div class="container mt-5">
        <div>
            <div>
          <div>
            <div>
                <h1 class ="text-center">Courier Management System</h1>
            </div>
          </div>
          </div>
          </div>
            <div class="row justify-content-center">
                <div class="col-md-5 text-center"> 
                    <h3>Login Page</h3>
                </div>
            </div>
        </div>

        <div class="container mt-5">
        <div class="row justify-content-center">
          <div class="col-md-5">
            <div class="card border-danger">
              <h2 class="card-header text-center text-danger font-weight-bold">Login</h2>
              <div class="card-body">
                <form>
                  <div class="row mb-3">
                    <label for="inputUsername3" class="col-sm-3 col-form-label text-dark font-bold">Username</label>
                    <div class="col-sm-10">
                      <input v-model ="username" type="Username" class="form-control" id="inputUsername3" placeholder="Your Username" autocomplete="Username">
                    </div>
                  </div>
                  <div class="row mb-3">
                    <label for="inputPassword3" class="col-sm-3 col-form-label text-dark font-bold">Password</label>
                    <div class="col-sm-10">
                      <input v-model ="password" type="password" class="form-control" id="inputPassword3" placeholder="Password" autocomplete="Password">
                    </div>
                  </div>
    
                  <div class="text-center gap-3">
                    <button type="button" class="btn btn-primary mr-2 border-danger" @click="login">Login</button>
                  </div>
                  <router-link to="/register" class="btn btn-link text-center">Don't have an account? Register..</router-link>
                  <br/>
                  <router-link to="/password-recovery" class="btn btn-link text-center">Forgot your password? Recover it here</router-link>

                </form>
              </div>
            </div>
            <div id="flashMessage" class="alert alert-danger mt-3 text-center" v-if="flashMessage">
              {{ flashMessage }}
            </div>
          </div>
        </div>
      </div>
    `
,
data() {
    return {
      username: '',
      password: '',
      flashMessage: ''
    };
  },
  methods: {
    async login() {
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
        console.log("Login successful");
        // Login successful, redirect based on role
        if (data.role === 'admin') {
          this.$router.push({ name: 'admin_dashboard' });
        } else if (data.role === 'manager') {
          this.$router.push({ name: 'manager_dashboard' });
        } else {
          this.$router.push({ name: 'home' }); // Regular user
        }
      } else {
        this.flashMessage = data.message;
      }
    },}
  ,
  mounted() {
    
},

};


export default Login;