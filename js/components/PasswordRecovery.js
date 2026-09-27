const PasswordRecovery = {
  template: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6 text-center">
          <h1 class="text-danger fw-bold mb-2">Courier Management System</h1>
          <p class="text-muted">Password Recovery</p>
        </div>
      </div>

      <div class="row justify-content-center mt-3">
        <div class="col-md-5">
          <div class="card border-danger shadow-sm">
            <h3 class="card-header text-center text-danger font-weight-bold bg-white border-bottom border-danger">Reset Password</h3>
            <div class="card-body p-4">
              <form @submit.prevent="handleSubmit">
                <div class="mb-3">
                  <label for="inputUserName3" class="form-label text-dark fw-bold">Full Name</label>
                  <input v-model="name" type="text" class="form-control" id="inputUserName3" placeholder="Registered full name" required>
                </div>
                <div class="mb-3">
                  <label for="inputUsername3" class="form-label text-dark fw-bold">Username</label>
                  <input v-model="username" type="text" class="form-control" id="inputUsername3" placeholder="Your username" required>
                </div>
                <div class="mb-3">
                  <label for="inputUseremail3" class="form-label text-dark fw-bold">Email</label>
                  <input v-model="email" type="email" class="form-control" id="inputUseremail3" placeholder="Registered email" required>
                </div>

                <div class="mb-3" v-if="passwordRecovery">
                  <label for="inputPassword3" class="form-label text-success fw-bold">Enter New Password</label>
                  <input v-model="newPassword" type="password" class="form-control border-success" id="inputPassword3" placeholder="New Password" required>
                </div>

                <div class="d-grid gap-2 mb-3">
                  <button v-if="check_user" type="button" class="btn btn-danger" @click="password_recovery">Verify Details</button>
                  <button v-if="passwordRecovery" type="button" class="btn btn-success" @click="submitNewPassword">Save New Password</button>
                </div>

                <div class="text-center">
                  <router-link to="/login" class="btn btn-link text-decoration-none">Back to Login</router-link>
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
      newPassword: '',
      check_user: true,
      passwordRecovery: false,
      flashMessage: '',
      successMessage: ''
    };
  },
  methods: {
    handleSubmit() {
      if (this.passwordRecovery) {
        this.submitNewPassword();
      } else {
        this.password_recovery();
      }
    },
    async password_recovery() {
      try {
        const response = await fetch('/api/check_user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: this.name,
            username: this.username,
            email: this.email
          })
        });

        const data = await response.json();

        if (response.status === 200) {
          this.passwordRecovery = true;
          this.check_user = false;
          this.flashMessage = '';
          this.successMessage = 'User verified! Please enter your new password below.';
        } else {
          this.flashMessage = data.message || 'User not found. Please check your details.';
          this.successMessage = '';
        }
      } catch (err) {
        this.flashMessage = 'Network error occurred.';
      }
    },
    async submitNewPassword() {
      if (!this.newPassword) {
        this.flashMessage = 'Please enter a new password.';
        return;
      }
      try {
        const response = await fetch('/api/update_password', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: this.username,
            newPassword: this.newPassword
          })
        });

        const data = await response.json();

        if (response.status === 200) {
          this.flashMessage = '';
          this.successMessage = 'Password updated successfully! Redirecting to login...';
          setTimeout(() => {
            this.$router.push({ name: 'login' });
          }, 1500);
        } else {
          this.flashMessage = data.message || 'Error updating password';
        }
      } catch (err) {
        this.flashMessage = 'Network error occurred.';
      }
    }
  }
};

export default PasswordRecovery;
