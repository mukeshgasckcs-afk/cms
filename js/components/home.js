const Home = {
  template: `
    <div class="container mt-4">
      <div class="row justify-content-center">
        <div class="col-md-8 text-center"> 
          <h2 class="fw-bold text-primary">New Courier Booking</h2>
          <p class="text-muted">Fill out the details below to dispatch your parcel</p>
        </div>
      </div>

      <div class="row justify-content-center" v-if="successMessage || errorMessage">
        <div class="col-md-8">
          <div v-if="successMessage" class="alert alert-success alert-dismissible fade show" role="alert">
            {{ successMessage }}
            <router-link to="/cart" class="btn btn-sm btn-outline-success ms-2">View Cart</router-link>
            <button type="button" class="btn-close" @click="clearMessages"></button>
          </div>
          <div v-if="errorMessage" class="alert alert-danger alert-dismissible fade show" role="alert">
            {{ errorMessage }}
            <button type="button" class="btn-close" @click="clearMessages"></button>
          </div>
        </div>
      </div>

      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card shadow-sm border-danger">
            <!-- Progress Tracker Bar -->
            <div class="card-header bg-white border-bottom p-3">
              <div class="d-flex justify-content-between text-center fw-bold">
                <span :class="{'text-danger': showSender, 'text-muted': !showSender}">1. Sender Details</span>
                <span>&rarr;</span>
                <span :class="{'text-danger': showReceiver, 'text-muted': !showReceiver}">2. Receiver Details</span>
                <span>&rarr;</span>
                <span :class="{'text-danger': showPackage, 'text-muted': !showPackage}">3. Package & Preference</span>
              </div>
            </div>

            <div class="card-body p-4">
              <!-- STEP 1: SENDER FORM -->
              <form v-show="showSender" @submit.prevent="showReceiverForm">
                <h5 class="card-title text-danger mb-3">Sender Information</h5>
                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label fw-bold">Sender Name</label>
                    <input v-model="sender_name" type="text" class="form-control" placeholder="Full Name" required>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-bold">Contact Number</label>
                    <input v-model="sender_number" type="tel" class="form-control" placeholder="10-digit number" required>
                  </div>
                  <div class="col-md-12">
                    <label class="form-label fw-bold">Sender Email</label>
                    <input v-model="sender_email" type="email" class="form-control" placeholder="Email address" required>
                  </div>
                  <div class="col-md-12">
                    <label class="form-label fw-bold">Pickup Address</label>
                    <input v-model="sender_address" type="text" class="form-control" placeholder="Street, Door No, Landmark" required>
                  </div>
                  <div class="col-md-4">
                    <label class="form-label fw-bold">Sender City</label>
                    <select v-model="sender_city" class="form-select" required>
                      <option value="">Select City</option>
                      <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
                    </select>
                  </div>
                  <div class="col-md-4">
                    <label class="form-label fw-bold">District</label>
                    <select v-model="sender_district" class="form-select" required>
                      <option value="">Select District</option>
                      <option v-for="district in districts" :key="district" :value="district">{{ district }}</option>
                    </select>
                  </div>
                  <div class="col-md-4">
                    <label class="form-label fw-bold">State</label>
                    <select v-model="sender_state" class="form-select" required>
                      <option value="">Select State</option>
                      <option v-for="state in states" :key="state" :value="state">{{ state }}</option>
                    </select>
                  </div>
                  <div class="col-md-4">
                    <label class="form-label fw-bold">Pincode</label>
                    <input v-model="sender_pincode" type="number" class="form-control" placeholder="6-digit pincode" min="100000" max="999999" required>
                  </div>
                </div>

                <div class="text-end mt-4">
                  <button type="submit" class="btn btn-danger">Next: Receiver &rarr;</button>
                </div>
              </form>

              <!-- STEP 2: RECEIVER FORM -->
              <form v-show="showReceiver" @submit.prevent="showPackageForm">
                <h5 class="card-title text-danger mb-3">Receiver Information</h5>
                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label fw-bold">Receiver Name</label>
                    <input v-model="recipient_name" type="text" class="form-control" placeholder="Full Name" required>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-bold">Contact Number</label>
                    <input v-model="recipient_number" type="tel" class="form-control" placeholder="10-digit number" required>
                  </div>
                  <div class="col-md-12">
                    <label class="form-label fw-bold">Receiver Email</label>
                    <input v-model="recipient_email" type="email" class="form-control" placeholder="Email address" required>
                  </div>
                  <div class="col-md-12">
                    <label class="form-label fw-bold">Delivery Address</label>
                    <input v-model="recipient_address" type="text" class="form-control" placeholder="Street, Door No, Landmark" required>
                  </div>
                  <div class="col-md-4">
                    <label class="form-label fw-bold">Destination City</label>
                    <select v-model="recipient_city" class="form-select" required>
                      <option value="">Select City</option>
                      <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
                    </select>
                  </div>
                  <div class="col-md-4">
                    <label class="form-label fw-bold">District</label>
                    <select v-model="recipient_district" class="form-select" required>
                      <option value="">Select District</option>
                      <option v-for="district in districts" :key="district" :value="district">{{ district }}</option>
                    </select>
                  </div>
                  <div class="col-md-4">
                    <label class="form-label fw-bold">State</label>
                    <select v-model="recipient_state" class="form-select" required>
                      <option value="">Select State</option>
                      <option v-for="state in states" :key="state" :value="state">{{ state }}</option>
                    </select>
                  </div>
                  <div class="col-md-4">
                    <label class="form-label fw-bold">Pincode</label>
                    <input v-model="recipient_pincode" type="number" class="form-control" placeholder="6-digit pincode" min="100000" max="999999" required>
                  </div>
                </div>

                <div class="d-flex justify-content-between mt-4">
                  <button type="button" class="btn btn-outline-secondary" @click="showSenderForm()">&larr; Back</button>
                  <button type="submit" class="btn btn-danger">Next: Package &rarr;</button>
                </div>
              </form>

              <!-- STEP 3: PACKAGE FORM -->
              <form v-show="showPackage" @submit.prevent="addCourierToCart">
                <h5 class="card-title text-danger mb-3">Package Details & Preference</h5>
                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label fw-bold">Number of Packages</label>
                    <input v-model="package_number" type="number" class="form-control" placeholder="e.g. 1" min="1" required>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-bold">Weight (grams)</label>
                    <input v-model="weight" type="number" class="form-control" placeholder="Weight in gm (e.g. 250)" min="1" required>
                  </div>
                  <div class="col-md-12">
                    <label class="form-label fw-bold">Package Contents / Description</label>
                    <input v-model="package_details" type="text" class="form-control" placeholder="e.g. Documents, Electronic Device, Clothes" required>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-bold">Height (cm)</label>
                    <input v-model="height" type="number" class="form-control" placeholder="Height in cm" min="1" required>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-bold">Width (cm)</label>
                    <input v-model="width" type="number" class="form-control" placeholder="Width in cm" min="1" required>
                  </div>
                  <div class="col-md-12">
                    <label class="form-label fw-bold">Delivery Speed / Preference</label>
                    <select v-model="delivery_preferences" class="form-select" required>
                      <option value="standard">Standard Delivery</option>
                      <option value="premium">Premium Express Delivery</option>
                    </select>
                  </div>
                </div>

                <div class="d-flex justify-content-between mt-4">
                  <button type="button" class="btn btn-outline-secondary" @click="showReceiverForm()">&larr; Back</button>
                  <button type="submit" class="btn btn-success fw-bold">Add to Cart & Calculate Price</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      successMessage: '',
      errorMessage: '',
      showSender: true,
      showReceiver: false,
      showPackage: false,

      cities: [],
      districts: [],
      states: [],

      sender_name: '',
      sender_number: '',
      sender_email: '',
      sender_address: '',
      sender_city: '',
      sender_district: '',
      sender_state: '',
      sender_pincode: null,

      recipient_name: '',
      recipient_number: '',
      recipient_email: '',
      recipient_address: '',
      recipient_city: '',
      recipient_district: '',
      recipient_state: '',
      recipient_pincode: null,

      package_number: 1,
      package_details: '',
      weight: 100,
      height: 10,
      width: 10,
      delivery_preferences: 'standard'
    };
  },
  methods: {
    get_cities() {
      fetch('/api/cities')
        .then((res) => res.json())
        .then((data) => {
          this.cities = data;
        })
        .catch((err) => console.error('Failed to fetch cities:', err));
    },
    get_districts() {
      fetch('/api/districts')
        .then((res) => res.json())
        .then((data) => {
          this.districts = data;
        })
        .catch((err) => console.error('Failed to fetch districts:', err));
    },
    get_states() {
      fetch('/api/states')
        .then((res) => res.json())
        .then((data) => {
          this.states = data;
        })
        .catch((err) => console.error('Failed to fetch states:', err));
    },
    addCourierToCart() {
      const courierData = {
        sender_name: this.sender_name,
        sender_number: this.sender_number,
        sender_email: this.sender_email,
        sender_address: this.sender_address,
        sender_city: this.sender_city,
        sender_district: this.sender_district,
        sender_state: this.sender_state,
        sender_pincode: this.sender_pincode,
        recipient_name: this.recipient_name,
        recipient_number: this.recipient_number,
        recipient_email: this.recipient_email,
        recipient_address: this.recipient_address,
        recipient_city: this.recipient_city,
        recipient_district: this.recipient_district,
        recipient_state: this.recipient_state,
        recipient_pincode: this.recipient_pincode,
        package_number: Number(this.package_number),
        package_details: this.package_details,
        weight: Number(this.weight),
        height: Number(this.height),
        width: Number(this.width),
        delivery_preferences: this.delivery_preferences
      };

      fetch('/api/add_to_cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courierData)
      })
        .then((response) => {
          if (response.status === 200) {
            this.successMessage = 'Courier calculated and added to cart successfully!';
            this.errorMessage = '';
            // Reset to step 1
            this.showSenderForm();
          } else {
            this.errorMessage = 'Failed to add courier to cart. Please check cities selected.';
            this.successMessage = '';
          }
        })
        .catch((err) => {
          this.errorMessage = 'Network error occurred.';
          this.successMessage = '';
        });
    },
    showSenderForm() {
      this.showSender = true;
      this.showReceiver = false;
      this.showPackage = false;
    },
    showReceiverForm() {
      if (!this.sender_city) {
        this.errorMessage = 'Please select a sender city first.';
        return;
      }
      this.clearMessages();
      this.showSender = false;
      this.showReceiver = true;
      this.showPackage = false;
    },
    showPackageForm() {
      if (!this.recipient_city) {
        this.errorMessage = 'Please select a recipient city.';
        return;
      }
      this.clearMessages();
      this.showSender = false;
      this.showReceiver = false;
      this.showPackage = true;
    },
    clearMessages() {
      this.successMessage = '';
      this.errorMessage = '';
    }
  },
  mounted() {
    this.get_cities();
    this.get_districts();
    this.get_states();
  }
};

export default Home;
