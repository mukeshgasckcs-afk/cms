const Profile = {
    template: `
      <div class="container mt-2">
        <div class="row justify-content-center">
          <div class="col-md-5 text-center">
            <h2>Profile</h2>
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

      <!-- Button trigger modal for Requesting new Manager Location -->
      <button type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#requestCourierManagerModal">Become New Courier Manager</button>
      
      <!-- Modal for Create request of New Courier Manager -->
      <div class="modal fade" id="requestCourierManagerModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="requestCourierManagerModalLabel" aria-hidden="true">
          <div class="modal-dialog">
              <div class="modal-content">
                  <div class="modal-header">
                      <h1 class="modal-title fs-5" id="requestCourierManagerModalLabel"> New Courier Manager Form</h1>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                      <div class="modal-body">
                          <div class="row mb-4 ">
                              <label for="inputCourierManagernumber3" class="col-sm-4 col-form-label text-dark font-bold">Mobile Number</label>
                                  <div class="col-sm-10 ">
                                      <input v-model="newCourierManagernumber" type="tel" class="form-control" id="inputCourierManagernumber3" placeholder="Enter Mobile Number" pattern="[0-9]{10}" title="Please enter a 10-digit mobile number">
                                  </div>
                          </div>
                          

                          <div class="row mb-3 ">
                              <label for="inputCourierManageraddress3" class="col-sm-3 col-form-label text-dark font-bold">Address</label>
                                  <div class="col-sm-10 ">
                                      <input v-model ="newCourierManageraddress" type="text" class="form-control " id="inputCourierManageraddress3" placeholder="Enter Address" >
                                  </div>
                          </div>


                          <div class="row mb-3 ">
                              <label for="inputCourierManagercity3" class="col-sm-3 col-form-label text-dark font-bold">City Name</label>
                                  <div class="col-sm-10 ">
                                      <input v-model ="newCourierManagercity" type="text" class="form-control " id="inputCourierManagercity3" placeholder="Enter City Name" >
                                  </div>
                          </div>


                          <div class="row mb-3 ">
                              <label for="inputCourierManagerdistrict3" class="col-sm-3 col-form-label text-dark font-bold">District</label>
                                  <div class="col-sm-10 ">
                                      <input v-model ="newCourierManagerdistrict" type="text" class="form-control " id="inputCourierManagerdistrict3" placeholder="Enter District Name" >
                                  </div>
                          </div>

                          <div class="row mb-3">
                          <label for="inputCourierManagerstate3" class="col-sm-3 col-form-label text-dark font-bold">State</label>
                          <div class="col-sm-10">
                              <select v-model="newCourierManagerstate" class="form-control" id="inputCourierManagerstate3">
                                  <option value="" disabled selected>Select a State</option>
                                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                                  <option value="Karnataka">Karnataka</option>
                                  <option value="Kerala">Kerala</option>
                                  <option value="Puducherry">Puducherry</option>
                                  <option value="Tamil Nadu">Tamil Nadu</option>
                                  <option value="Telangana">Telangana</option>

                              </select>
                          </div>
                      </div>
                      


                          <div class="row mb-3 ">
                              <label for="inputCourierManagerpincode3" class="col-sm-3 col-form-label text-dark font-bold">Pincode</label>
                                  <div class="col-sm-10 ">
                                      <input v-model="newCourierManagerpincode" type="number" class="form-control" id="inputCourierManagerpincode3" placeholder="Enter Pincode" min="100000" max="999999">
                                  </div>
                          </div>

                      </div>
                  <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                      <button type="button" class="btn btn-primary" @click="requestCourierManager" data-bs-dismiss="modal" >Submit</button>
                  </div>
              </div>
          </div>
      </div>
      <div class="container" v-if="userRole === 'manager'">
      <div>
      <div>
      <div>
      <div class=" gap-3">
      <h4>Courier Sales-Revenue Report : </h4>
      <button @click="fetchAndDownloadCSV" type="button" class="btn btn-primary btn-dark ml-2 border-danger" >Download CSV</button>
    </div>
    </div>
    </div>
    </div>
    <div>
    <div>
    </div>
    </div>
      <h4>My Requests : </h4>
        <table class="table table-bordered table-striped text-center">
          <thead>
            <tr>
              <th class="text-center font-weight-bold">Request ID</th>
              <th class="text-center font-weight-bold">Requests</th>
              <th class="text-center font-weight-bold">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="request in requests" :key="request.request_id">
              <td class="text-center font-weight-bold">{{ request.request_id }}</td>
              <td class="text-center font-weight-bold">{{ request.action }}</td>
              <td class="text-center font-weight-bold">{{ request.status }}</td>
            </tr>
          </tbody>
        </table>
      </div>




    <div class="container">
      <h2>Orders:</h2>
      <div class="row">
        <div v-for="order in orders" :key="order.order_id" class="col-md-12">
          <div class="card mb-4">
            <div class="card-body">
            <div class="row">
            <div class="col-md-6">
            <p class="card-text ">
            <span class="font-weight-bold text-primary">Order ID: </span>
            <span class="text-primary">{{ order.order_id }}</span>
          </p>
              <p class="card-text">
                <span class="font-weight-bold text-primary">Order Date: </span>
                <span class="text-primary">{{ order.order_date }}</span>
              </p>
              <p class="card-text">
                <span class="font-weight-bold text-success">Total Order Value: </span>
                <span class="text-center">&#8377; {{ order.total_price.toFixed(2) }}</span>
              </p>
              <ul class="list-group ">
              
                <li class="font-weight-bold text-success">Sender Name: {{ order.sender_name }}</li>
                <li class="font-weight-bold text-success">Receiver Name: {{ order.recipient_name }}</li>
                <li class="font-weight-bold text-success">Weight: {{ order.weight }} gm</li>
                <li class="font-weight-bold text-success">Height: {{ order.height }} cm</li>
                <li class="font-weight-bold text-success">Width: {{ order.width }} cm</li>
                <li class="font-weight-bold text-success">Delivery Preferences: {{ order.delivery_preferences }}</li>
              </ul>
              <br/>
              <br/>
              </div>
              </div>

              <!-- Display tracking details for the order as a vertical list with arrows -->
              <h5 class="font-weight-bold text-center border">-------------------Tracking Details-------------------</h5>
              <br/>
              <table class="table text-center border">
                <thead>
                  <tr>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(tracking, index) in order.tracking_details" :key="index">
                    <td>{{ tracking.current_location }}</td>
                    <td>{{ tracking.statusMessage }}</td>
                    <td>{{ tracking.timestamp }}</td>
                </tbody>
              </table>
              <!-- Button trigger modal for Cancel Delivery-->
              <button type="button" class="btn btn-danger" data-bs-toggle="modal" :data-bs-target="'#cancelDeliveryModal' + order.order_id" @click="opencancelDeliveryModal(order.order_id)">Cancel Delivery</button>
    
              <!-- Modal for Delete Location -->
              <div class="modal fade" :id="'cancelDeliveryModal' + order.order_id" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="cancelDeliveryModalLabel" aria-hidden="true">
    
                  <div class="modal-dialog">
                      <div class="modal-content">
                          <div class="modal-header">
                              <h1 class="modal-title fs-5" id="cancelDeliveryModalLabel">Cancel Delivery</h1>
                              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                          </div>
                          <div class="modal-body">
                                  <p> Are you sure you want to Cancel this Delivery ?</p>
                          </div>
                          <div class="modal-footer">
                              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                              <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="cancelDelivery(cancelDeliveryId)" >Yes</button>
                          </div>
                      </div>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>






     `,
    data() {
      return {
        newCourierManagernumber: null,
        newCourierManageraddress: '',
        newCourierManagercity: '',
        newCourierManagerdistrict: '',
        newCourierManagerstate: '',
        newCourierManagerpincode: null,
        userRole: null, 
        requests: [],
        orders: [],
        cancelDeliveryId: null,
        successMessage: '',
        errorMessage: '',
        mapHtmlContent: '',
        manager_username:'',
      };
    },
    methods: {
      
        // Function to create a request of New Courier Manager
        requestCourierManager() {
          const requestCourierManager = {
            courier_manager_number: this.newCourierManagernumber,
            courier_manager_address: this.newCourierManageraddress,
            courier_manager_city: this.newCourierManagercity,
            courier_manager_district: this.newCourierManagerdistrict,
            courier_manager_state: this.newCourierManagerstate,
            courier_manager_pincode:this.newCourierManagerpincode,
          };
  
          fetch('/api/request_for_new_courier_manager', {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(requestCourierManager),
          })
          .then((response) => {
              if (response.status === 201) {
                  console.log("A Request of New Courier Manager Created");
                  this.successMessage = 'A Request of New Courier Manager created successfully.';
                  this.errorMessage = ''; 
              } else {
                  this.errorMessage = 'Failed to create a request of New Courier Manager.';
                  this.successMessage = ''; 
              }
          })
          .catch((error) => {
              this.errorMessage = 'Network error occurred.';
              this.successMessage = ''; 
          });
      },
      // Fetch user username for the current user
        get_manager_username() {
        fetch('/api/manager_username')
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            this.manager_username = data.manager_username; // Corrected property name to 'username'
          })
          .catch((error) => {
            console.error('Error fetching username:', error);
          });
      },


      getStatusMessage(status) {
        if (status === 'received') {
          return 'Not yet reached to this location';
        } else if (status === 'in transit') {
          return 'Received and forwarded to the next location';
        } else if (status === 'delivered') {
          return 'Delivered';
        } else if (status === 'cancel') {
          return 'Order canceled';
        }
        return 'Unknown status';
      },

          // Fetch user requests for the current user
      get_user_requests() {
        fetch('/api/user_requests')
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
          this.userRole = data.user_role;
          this.requests = data.requests;
          })
          .catch((error) => {
            console.error('Error fetching requests:', error);
          });
      },
    
      // Fetch user orders for the current user
      get_user_orders() {
        fetch('/api/user_orders')
          .then((response) => response.json())
          .then((data) => {
            data.forEach((order) => {
              order.tracking_details.forEach((tracking) => {
                tracking.statusMessage = this.getStatusMessage(tracking.status);
              });
            });
            this.orders = data;
          })
          .catch((error) => {
            console.error('Error fetching orders:', error);
            this.errorMessage = 'Failed to fetch orders';
          });
      },
   
      // Function to delete a location
      opencancelDeliveryModal(orderId) {
        this.cancelDeliveryId = orderId; 
    },
    // Function to cancel a deliery
    cancelDelivery(orderId) {
      if (!orderId) {
        console.error("orderId is not set or is invalid");
        return;
      }
    
      fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
      })
        .then((response) => {
          if (response.status === 200) {
            console.log("Cancelled Delivery with ID:", orderId);
            this.successMessage = 'Order has been successfully canceled.';
            this.errorMessage = '';
            this.get_user_orders();
          } else if (response.status === 404) {
            this.errorMessage = 'Order not found. Please check the order ID.';
            this.successMessage = '';
          } else if (response.status === 400) {
            this.errorMessage = 'This order has already been delivered and cannot be canceled.';
            this.successMessage = '';
          } else if (response.status === 401) {
            this.errorMessage = 'This order has already been canceled.';
            this.successMessage = '';
            console.log(this.errorMessage)
          } else {
            this.errorMessage = 'Failed to cancel delivery. Please try again later.';
            this.successMessage = '';
          }
        })
        .catch((error) => {
          this.errorMessage = 'Network error occurred. Please check your internet connection.';
          this.successMessage = '';
        });
    },

    async loadMapHtmlContent() {
      try {
        const response = await fetch('application/map.html'); // Adjust the path as needed
        if (response.ok) {
          this.mapHtmlContent = await response.text();
        } else {
          console.error('Failed to load map.html');
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    },


    // Fetch product CSV for the download to the manager
    fetchAndDownloadCSV() {
      fetch('/api/generate-csv')
        .then(response => {
          if (!response.ok) {
            console.error('CSV download failed:', response.status, response.statusText);
            throw new Error('CSV download failed');
          }
          return response.blob();
        })
        .then(blob => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          const fileName = `${this.manager_username}_report.csv`;
          link.setAttribute('download', fileName);
          document.body.appendChild(link);
          link.click();
          this.successMessage = 'CSV download succeeded';
          this.errorMessage = null;
        })
        .catch(error => {
          console.error('Error downloading CSV:', error);
        });
    },

    // Function to clear success and error messages
    clearMessages() {
      this.successMessage = null;
      this.errorMessage = null;
  },

    },
    mounted() {
        this.get_user_requests();
        this.get_user_orders();
        this.loadMapHtmlContent();
        this.get_manager_username();

    },
  };
  export default Profile;
  