const Home = {
  template: `       
    <div class="container mt-2">
    <div class="row justify-content-center">
      <div class="col-md-5 text-center"> 
        <h2>Home</h2>
      </div>
    </div>
  </div>

  <div>
    <div>
      <!-- Display success and error messages here -->
      <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>
      <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
    </div>
  </div>

  <div class="container mt-8">
  <div class="row justify-content-center">
    <div class="col-md-8">
        <h2 class="card-header text-center text-danger font-weight-bold">New Courier</h2>
        <div class="card-body">
          <form v-show="showSender">
            <div class="row mb-4">
              <label for="inputSenderName3" class="col-sm-3 col-form-label text-dark font-bold">Sender Name</label>
              <div class="col-sm-10">
                <input v-model ="sender_name" type="Name" class="form-control" id="inputSenderName3" placeholder="Sender Name">
              </div>
            </div>
            <div class="row mb-4">
            <label for="inputSendernumber3" class="col-sm-3 col-form-label text-dark font-bold">Sender Number</label>
            <div class="col-sm-10">
              <input v-model ="sender_number" type="number" class="form-control" id="inputSendernumber3" placeholder="Sender Number">
            </div>
          </div>
          <div class="row mb-4">
          <label for="inputSenderemail3" class="col-sm-3 col-form-label text-dark font-bold">Sender Email</label>
          <div class="col-sm-10">
            <input v-model ="sender_email" type="Email" class="form-control" id="inputSenderemail3" placeholder="Sender email">
          </div>
        </div>
            <div class="row mb-4">
              <label for="inputSenderaddress3" class="col-sm-3 col-form-label text-dark font-bold">Sender Address</label>
              <div class="col-sm-10">
                <input v-model ="sender_address" type="text" class="form-control" id="inputSenderaddress3" placeholder="Sender Address">
              </div>
            </div>

            

            <div class="row mb-4">
            <label for="inputSenderCity3" class="col-sm-3 col-form-label text-dark font-bold">Sender City</label>
            <div class="col-sm-10">
              <select v-model="sender_city" class="form-control" id="inputSenderCity3">
                <option value="">Select City</option>
                <option v-for="city in cities" :key="city">{{ city }}</option>
              </select>
            </div>
          </div>

          <div class="row mb-4">
          <label for="inputSenderdistrict3" class="col-sm-3 col-form-label text-dark font-bold">Sender district</label>
          <div class="col-sm-10">
            <select v-model="sender_district" class="form-control" id="inputSenderdistrict3">
              <option value="">Select district</option>
              <option v-for="district in districts" :key="district">{{ district }}</option>
            </select>
          </div>
        </div>

        <div class="row mb-4">
        <label for="inputSenderstate3" class="col-sm-3 col-form-label text-dark font-bold">Sender State</label>
        <div class="col-sm-10">
        <select v-model="sender_state" class="form-control" id="inputSenderstate3">
        <option value="">Select state</option>
        <option v-for="state in states" :key="state">{{ state }}</option>
      </select>
      </div>
      </div>


      <div class="row mb-4">
      <label for="inputSenderpincode3" class="col-sm-3 col-form-label text-dark font-bold">Sender Pincode</label>
      <div class="col-sm-10">
        <input v-model ="sender_pincode" type="number" class="form-control" id="inputSenderpincode3" placeholder="Sender Pincode"  min="100000" max="999999">
      </div>
    </div>
            <div class="text-center gap-3">
            <button type="button" class="btn btn-primary btn-dark ml-2 border-danger" @click="showReceiverForm()">Next</button>
            </div>




          </form>

          <form v-show="showReceiver">
            <div class="row mb-4">
              <label for="inputReceiverName3" class="col-sm-3 col-form-label text-dark font-bold">Receiver Name</label>
              <div class="col-sm-10">
                <input v-model ="recipient_name" type="Name" class="form-control" id="inputReceiverName3" placeholder="Receiver Name">
              </div>
            </div>
            <div class="row mb-4">
            <label for="inputReceivernumber3" class="col-sm-3 col-form-label text-dark font-bold">Receiver Number</label>
            <div class="col-sm-10">
              <input v-model ="recipient_number" type="number" class="form-control" id="inputReceivernumber3" placeholder="Receiver Number">
            </div>
          </div>
          <div class="row mb-4">
          <label for="inputReceiveremail3" class="col-sm-3 col-form-label text-dark font-bold">Receiver Email</label>
          <div class="col-sm-10">
            <input v-model ="recipient_email" type="Email" class="form-control" id="inputReceiveremail3" placeholder="Receiver email">
          </div>
        </div>
            <div class="row mb-4">
              <label for="inputReceiveraddress3" class="col-sm-3 col-form-label text-dark font-bold">Receiver Address</label>
              <div class="col-sm-10">
                <input v-model ="recipient_address" type="text" class="form-control" id="inputReceiveraddress3" placeholder="Receiver Address">
              </div>
            </div>
            <div class="row mb-4">
            <label for="inputReceivercity3" class="col-sm-3 col-form-label text-dark font-bold">Receiver City</label>
            <div class="col-sm-10">
            <select v-model="recipient_city" class="form-control" id="inputReceivercity3">
            <option value="">Select City</option>
            <option v-for="city in cities" :key="city">{{ city }}</option>
          </select>
           </div>
          </div>

          <div class="row mb-4">
          <label for="inputReceiverdistrict3" class="col-sm-3 col-form-label text-dark font-bold">Receiver District</label>
          <div class="col-sm-10">
          <select v-model="recipient_district" class="form-control" id="inputReceiverdistrict3">
          <option value="">Select district</option>
          <option v-for="district in districts" :key="district">{{ district }}</option>
        </select>
         </div>
        </div>

        <div class="row mb-4">
        <label for="inputReceiverstate3" class="col-sm-3 col-form-label text-dark font-bold">Receiver State</label>
        <div class="col-sm-10">
        <select v-model="recipient_state" class="form-control" id="inputReceiverstate3">
        <option value="">Select state</option>
        <option v-for="state in states" :key="state">{{ state }}</option>
      </select>
      </div>
      </div>


      <div class="row mb-4">
      <label for="inputReceiverpincode3" class="col-sm-3 col-form-label text-dark font-bold">Receiver Pincode</label>
      <div class="col-sm-10">
        <input v-model ="recipient_pincode" type="number" class="form-control" id="inputReceiverpincode3" placeholder="Receiver Pincode" min="100000" max="999999">
      </div>
    </div>
            <div class="text-center gap-3">
              <button type="button" class="btn btn-primary btn-dark ml-2 border-danger" @click="showSenderForm()">Back</button>
              <button type="button" class="btn btn-primary btn-dark ml-2 border-danger" @click="showPackageForm()">Next</button>
            </div>
          </form>



          <form v-show="showPackage">
  
            <div class="row mb-4">
            <label for="inputPackagenumber3" class="col-sm-3 col-form-label text-dark font-bold">Number of Package</label>
            <div class="col-sm-10">
              <input v-model ="package_number" type="number" class="form-control" id="inputPackagenumber3" placeholder="Number of Package" min="1">
            </div>
          </div>
   
            <div class="row mb-4">
              <label for="inputPackagedeatails3" class="col-sm-3 col-form-label text-dark font-bold">Details of Package</label>
              <div class="col-sm-10">
                <input v-model ="package_details" type="text" class="form-control" id="inputPackagedeatails3" placeholder="Details of Package">
              </div>
            </div>
            <div class="row mb-4">
            <label for="inputPackageweight3" class="col-sm-3 col-form-label text-dark font-bold">Weight of Package</label>
            <div class="col-sm-10">
              <input v-model ="weight" type="number" class="form-control" id="inputPackageweight3" placeholder="Weight of Package in grams" min="10" max="999">
            </div>
          </div>

          <div class="row mb-4">
          <label for="inputPackageheight3" class="col-sm-3 col-form-label text-dark font-bold">Height of Package</label>
          <div class="col-sm-10">
            <input v-model ="height" type="number" class="form-control" id="inputPackageheight3" placeholder="Height of Package in cm " min="1" max="999">
          </div>
        </div>

        <div class="row mb-4">
        <label for="inputPackagewidth3" class="col-sm-3 col-form-label text-dark font-bold">Width of Package</label>
        <div class="col-sm-10">
          <input v-model ="width" type="number" class="form-control" id="inputPackagewidth3" placeholder="Width of Package in cm " min="1" max="999">
        </div>
      </div>


      <div class="row mb-4">
      <label for="inputPackagedelivery_preferences3" class="col-sm-3 col-form-label text-dark font-bold">Delivery Preference</label>
      <div class="col-sm-10">
         <select v-model="delivery_preferences" class="form-control" id="inputPackagedelivery_preferences3">
                      <option value="standard">Standard</option>
                      <option value="premium">Premium</option>
          </select>
      </div>
    </div>
              <div class="text-center gap-3">
              <button type="button" class="btn btn-primary btn-dark ml-2 border-danger" @click="showReceiverForm()">Back</button>
              <button type="button" class="btn btn-primary btn-dark ml-2 border-danger" @click="addCourierToCart()">Submit</button>
            </div>
          </form>



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
      sender_number: null,
      sender_email: '',
      sender_address: '',
      sender_city: '',
      sender_district:'',
      sender_state:'',
      sender_pincode:null,
      // Add more fields as needed
      recipient_name: '',
      recipient_number: null,
      recipient_email: '',
      recipient_address: '',
      recipient_city: '',
      recipient_district:'',
      recipient_state:'',
      recipient_pincode:null,
      // Add more recipient fields as needed
      package_number: null,
      package_details: '',
      weight: null,
      height:null,
      width: null,
      delivery_preferences:'',
    };
  },
  methods: {
  // Fetch city names from your Flask API
  get_cities() {
    fetch('/api/cities')
    .then((response) => response.json())
    .then((data) => {
      this.cities = data; // Update the cities data property
    })
    .catch((error) => {
      console.error('Failed to fetch cities:', error);
    });

  },
  // Fetch district names from your Flask API
  get_districts() {
    fetch('/api/districts')
    .then((response) => response.json())
    .then((data) => {
      this.districts = data; // Update the districts data property
    })
    .catch((error) => {
      console.error('Failed to fetch districts:', error);
    });

  },

  // Fetch state names from your Flask API
  get_states() {
    fetch('/api/states')
    .then((response) => response.json())
    .then((data) => {
      this.states = data; // Update the states data property
    })
    .catch((error) => {
      console.error('Failed to fetch states:', error);
    });

  },




  // Function to add a courier to the cart
  addCourierToCart() {
    // Create a data object with courier details
    const courierData = {
      sender_name: this.sender_name,
      sender_number: this.sender_number,
      sender_email: this.sender_email,
      sender_address: this.sender_address,
      sender_city: this.sender_city,
      sender_district:this.sender_district,
      sender_state:this.sender_state,
      sender_pincode:this.sender_pincode,
      // Add more fields as needed
      recipient_name: this.recipient_name,
      recipient_number: this.recipient_number,
      recipient_email: this.recipient_email,
      recipient_address: this.recipient_address,
      recipient_city: this.recipient_city,
      recipient_district:this.recipient_district,
      recipient_state:this.recipient_state,
      recipient_pincode:this.recipient_pincode,
      // Add more recipient fields as needed
      package_number: this.package_number,
      package_details: this.package_details,
      weight: this.weight,
      height: this.height,
      width: this.width,
      delivery_preferences: this.delivery_preferences,
    };

    // Make a POST request to the Flask API endpoint
    fetch('/api/add_to_cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(courierData),
    })
      .then((response) => {
        if (response.status === 200) {
          console.log("Courier added to cart successfully");
          this.successMessage = 'Courier added to cart successfully.';
          this.errorMessage = '';
        } else if (response.status === 400) {
          this.errorMessage = 'Invalid courier data.';
          this.successMessage = '';
        } else {
          this.errorMessage = 'Failed to add courier to cart.';
          this.successMessage = '';
        }
      })
      .catch((error) => {
        this.errorMessage = 'Network error occurred.';
        this.successMessage = '';
      });
  },
    showSenderForm(){
      this.showSender = true;
      this.showReceiver = false;
      this.showPackage = false;
    },

    showReceiverForm() {
      this.showSender = false;
      this.showReceiver = true;
      this.showPackage = false;

    },
    showPackageForm(){
      this.showSender = false;
      this.showReceiver = false;
      this.showPackage = true;

    },

    // Function to clear success and error messages
    clearMessages() {
      this.successMessage = null;
      this.errorMessage = null;
    },
  },
  mounted() {
    this.get_cities();
    this.get_districts();
    this.get_states();
  },
};


export default Home;