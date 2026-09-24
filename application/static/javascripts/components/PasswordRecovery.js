const PasswordRecovery = {
    template: `
      <div class="container mt-5">
        <div>
          <div>
            <div>
              <div>
                <h1 class="text-center">Courier Management System</h1>
              </div>
            </div>
          </div>
        </div>
        <div class="row justify-content-center">
          <div class="col-md-5 text-center">
            <h3>Password Recovery Page</h3>
          </div>
        </div>
      </div>
  
      <div class="container mt-5">
        <div class="row justify-content-center">
          <div class="col-md-5">
            <div class="card border-danger">
              <h2 class="card-header text-center text-danger font-weight-bold">Password Recovery</h2>
              <div class="card-body">
                <form>
                  <div class="row mb-3">
                    <label for="inputUserName3" class="col-sm-3 col-form-label text-dark font-bold">Name</label>
                    <div class="col-sm-10">
                      <input v-model="name" type="text" class="form-control" id="inputUserName3" placeholder="Your Name" autocomplete="Name">
                    </div>
                  </div>
                  <div class="row mb-3">
                    <label for="inputUsername3" class="col-sm-3 col-form-label text-dark font-bold">Username</label>
                    <div class="col-sm-10">
                      <input v-model="username" type="text" class="form-control" id="inputUsername3" placeholder="Your Username" autocomplete="Username">
                    </div>
                  </div>
                  <div class="row mb-3">
                    <label for="inputUseremail3" class="col-sm-3 col-form-label text-dark font-bold">Email</label>
                    <div class="col-sm-10">
                      <input v-model="email" type="email" class="form-control" id="inputUseremail3" placeholder="Your email" autocomplete="Email">
                    </div>
                  </div>
                  <div class="row mb-3" v-show="passwordRecovery">
                    <label for="inputPassword3" class="col-sm-3 col-form-label text-dark font-bold">Enter New Password</label>
                    <div class="col-sm-10">
                      <input v-model="newPassword" type="password" class="form-control" id="inputPassword3" placeholder="New Password" autocomplete="new-password">
                    </div>
                  </div>
  
                  <div class="text-center gap-3">
                    <button v-show="check_user" type="button" class="btn btn-primary btn-dark ml-2 border-danger" @click="password_recovery">Submit</button>
                    <button v-show="passwordRecovery" type="button" class="btn btn-primary btn-dark ml-2 border-danger" @click="submitNewPassword">Submit</button>
                    <br/>
                    <button type="button" class="btn btn-link" @click="goToLogin">Go to Login Page</button>
                  </div>
                </form>
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
        name: '',
        username: '',
        email: '',
        newPassword: '',
        check_user: true,
        passwordRecovery: false,
        flashMessage: '',
      };
    },
    methods: {
      async password_recovery() {
        // Check if the provided name, username, and email match in the database
        const response = await fetch('/api/check_user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: this.name,
            username: this.username,
            email: this.email,
          }),
        });
  
        const data = await response.json();
  
        if (response.status === 200) {
          this.passwordRecovery = true;
          this.check_user= false
        } else {
          this.flashMessage = 'User not found. Please check your details.';
        }
      },
      async submitNewPassword() {
        const response = await fetch('/api/update_password', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: this.username,
            newPassword: this.newPassword,
          }),
        });
  
        const data = await response.json();
  
        if (response.status === 200) {
          this.$router.push({ name: 'login' });
        } else {
          this.flashMessage = data.message;
        }
      },
      goToLogin() {
        this.$router.push({ name: 'login' });
      },
    },
    mounted() {
    },
  };
  
  export default PasswordRecovery;
  