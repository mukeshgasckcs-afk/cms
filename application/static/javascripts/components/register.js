const Register = {
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
                    <h3>Register Page</h3>
                </div>
            </div>
        </div>

        <div class="container mt-5">
        <div class="row justify-content-center">
          <div class="col-md-5">
            <div class="card border-danger">
              <h2 class="card-header text-center text-danger font-weight-bold">Register</h2>
              <div class="card-body">
                <form>
                  <div class="row mb-3">
                    <label for="inputUserName3" class="col-sm-3 col-form-label text-dark font-bold">Name</label>
                    <div class="col-sm-10">
                      <input v-model ="name" type="Name" class="form-control" id="inputUserName3" placeholder="Your Name" autocomplete="Name">
                    </div>
                  </div>
                  <div class="row mb-3">
                  <label for="inputUsername3" class="col-sm-3 col-form-label text-dark font-bold">Username</label>
                  <div class="col-sm-10">
                    <input v-model ="username" type="Username" class="form-control" id="inputUsername3" placeholder="Your Username" autocomplete="Username">
                  </div>
                </div>
                <div class="row mb-3">
                <label for="inputUseremail3" class="col-sm-3 col-form-label text-dark font-bold">Email</label>
                <div class="col-sm-10">
                  <input v-model ="email" type="Email" class="form-control" id="inputUseremail3" placeholder="Your email" autocomplete="Email">
                </div>
              </div>
                  <div class="row mb-3">
                    <label for="inputPassword3" class="col-sm-3 col-form-label text-dark font-bold">Password</label>
                    <div class="col-sm-10">
                      <input v-model ="password" type="password" class="form-control" id="inputPassword3" placeholder="Password" autocomplete="Password">
                    </div>
                  </div>
    
                  <div class="text-center gap-3">
                    <button type="button" class="btn btn-primary btn-dark ml-2 border-danger" @click="register">Register</button>
                  </div>
                  <router-link to="/" class="btn btn-link text-center">Already have an account? Login</router-link>
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
        name : '',
      username: '',
      email: '',
      password: '',

      flashMessage: ''
    };
  },
  methods: {
      async register() {
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
          if (data.role === 'admin') {
            this.$router.push({ name: 'login' });
          } else if (data.role === 'manager') {
            this.$router.push({ name: 'login' });
          } else {
            this.$router.push({ name: 'login' }); 
          }
        } else {
          this.flashMessage = data.message;
        }
      }
    },
  mounted() {
    
},

};


export default Register;