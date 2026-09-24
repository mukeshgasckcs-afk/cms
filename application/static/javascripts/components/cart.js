const Cart = {
    template: `
   
    <div class="container mt-2">
      <div class="row justify-content-center">
        <div class="col-md-5 text-center">
          <h2>Cart</h2>
        </div>
      </div>
      <div>
        <table class="table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Sender Details</th>
              <th>Recipient Details</th>
              <th>Delivery Preferences</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in cartItems" :key="item.item_id">
            <td>
            <br>Number of Packages : {{ item.package_number }}</br>
            <br>Details of Packages :  {{ item.package_details }}</br>
            <br>Weight :  {{ item.weight }}</br>
            <br>Height :  {{ item.height }}</br>
            <br>Width :  {{ item.width }}</br>
          


            <!-- Button trigger modal for Edit Package-->
            <br><button type="button" class="btn btn-primary" data-bs-toggle="modal" :data-bs-target="'#editPackageModal' + item.item_id" @click="openPackageEditModal(item.item_id)">Edit </button></br>
  
            <!-- Modal for Edit Package -->
            <div class="modal fade" :id="'editPackageModal' + item.item_id" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="editPackageModalLabel" aria-hidden="true">
  
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="editPackageModalLabel">Edit Package</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                        <div class="row mb-3 ">
                            <label for="editPackageNumber3" class="col-sm-3 col-form-label text-dark font-bold">Numbers of Package</label>
                                <div class="col-sm-10 ">
                                    <input v-model ="newPackageNumber" type="number" class="form-control " id="editPackageNumber3" placeholder="Numbers of Package" >
                                </div>
                        </div>
                            <div class="modal-body">
                                <div class="row mb-3 ">
                                    <label for="editPackageDetails3" class="col-sm-3 col-form-label text-dark font-bold">Details of Package</label>
                                        <div class="col-sm-10 ">
                                            <input v-model ="newPackageDetails" type="text" class="form-control " id="editPackageDetails3" placeholder="Details of Package" >
                                        </div>
                                </div>
  
                                <div class="row mb-3 ">
                                    <label for="editPackageWeightname3" class="col-sm-3 col-form-label text-dark font-bold">Weight</label>
                                        <div class="col-sm-10 ">
                                            <input v-model ="newWeight"  type="number" class="form-control " id="editPackageWeightname3" placeholder="Weight in gm" >
                                        </div>
                                </div>
  
                                <div class="row mb-3 ">
                                    <label for="editPackageHeightname3" class="col-sm-3 col-form-label text-dark font-bold">Height</label>
                                        <div class="col-sm-10 ">
                                            <input v-model ="newHeight"  type="number" class="form-control " id="editPackageHeightname3" placeholder="Height in cm">
                                        </div>
                                </div>
  
                                <div class="row mb-3 ">
                                    <label for="editPackageWidthname3" class="col-sm-3 col-form-label text-dark font-bold">Width</label>
                                        <div class="col-sm-10 ">
                                            <input v-model ="newWidth"  type="number" class="form-control " id="editPackageWidthname3" placeholder="Width in cm" >
                                        </div>
                                </div>
                            </div>      
  
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="updatePackageDetails(edititemId,newPackageNumber, newPackageDetails,newWeight,newHeight,newWidth)" >Submit</button>
                            </div>
                    </div>
                </div>
            </div>
            </td>
              <td>
              <br>Sender Name : {{ item.sender_name }}</br>
              <br>Mobile Number :  {{ item.sender_number }}</br>
              <br> Email :  {{ item.sender_email }}</br>
              <br>Address :  {{ item.sender_address }}</br>
              <br>City :  {{ item.sender_city }}</br>
              <br>District :  {{ item.sender_district }}</br>
              <br>State :  {{ item.sender_state }}</br>
              <br>Pincode :  {{ item.sender_pincode }}</br>
              <!-- Button trigger modal for Edit Sender-->
              <br> <button type="button" class="btn btn-primary" data-bs-toggle="modal" :data-bs-target="'#editSenderModal' + item.item_id" @click="openSenderEditModal(item.item_id)">Edit </button></br>
    
              <!-- Modal for Edit Sender -->
              <div class="modal fade" :id="'editSenderModal' + item.item_id" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="editSenderModalLabel" aria-hidden="true">
    
                  <div class="modal-dialog">
                      <div class="modal-content">
                          <div class="modal-header">
                              <h1 class="modal-title fs-5" id="editSenderModalLabel">Edit Sender</h1>
                              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                          </div>
                          <div class="modal-body">
                          <div class="row mb-3 ">
                              <label for="editSenderName3" class="col-sm-3 col-form-label text-dark font-bold">Sender's Name</label>
                                  <div class="col-sm-10 ">
                                      <input v-model ="newSenderName" type="text" class="form-control " id="editSenderName3" placeholder="Name of Sender" >
                                  </div>
                          </div>
                              <div class="modal-body">
                                  <div class="row mb-3 ">
                                      <label for="editSenderNumber3" class="col-sm-3 col-form-label text-dark font-bold">Sender's Number</label>
                                          <div class="col-sm-10 ">
                                              <input v-model ="newSenderNumber" type="number" class="form-control " id="editSenderNumber3" placeholder="Number of Sender" >
                                          </div>
                                  </div>
    
                                  <div class="row mb-3 ">
                                      <label for="editSenderEmail3" class="col-sm-3 col-form-label text-dark font-bold">Email</label>
                                          <div class="col-sm-10 ">
                                              <input v-model ="newSenderEmail"  type="email" class="form-control " id="editSenderEmail3" placeholder="Email" >
                                          </div>
                                  </div>
    
                                  <div class="modal-body">
                                  <div class="row mb-3 ">
                                      <label for="editSenderAddress3" class="col-sm-3 col-form-label text-dark font-bold">Address</label>
                                          <div class="col-sm-10 ">
                                              <input v-model ="newSenderAddress" type="text" class="form-control " id="editSenderAddress3" placeholder="Address" >
                                          </div>
                                  </div>

                                  <div class="modal-body">
                                  <div class="row mb-3 ">
                                      <label for="editSenderCity3" class="col-sm-3 col-form-label text-dark font-bold">City</label>
                                          <div class="col-sm-10 ">
                                              <select v-model="newSenderCity" class="form-control" id="editSenderCity3">
                                              <option value="">Select City</option>
                                              <option v-for="city in cities" :key="city">{{ city }}</option>
                                            </select>
                                          </div>
                                  </div>


                                  <div class="row mb-3 ">
                                      <label for="editSenderDistrict3" class="col-sm-3 col-form-label text-dark font-bold">District</label>
                                          <div class="col-sm-10 ">
                                              <select v-model="newSenderDistrict" class="form-control" id="editSenderDistrict3">
                                              <option value="">Select District</option>
                                              <option v-for="district in districts" :key="district">{{ district }}</option>
                                            </select>
                                          </div>
                                  </div>
                                      <div class="row mb-3 ">
                                      <label for="editSenderState3" class="col-sm-3 col-form-label text-dark font-bold">State</label>
                                          <div class="col-sm-10 ">
                                          <select v-model="newSenderState" class="form-control" id="editSenderState3">
                                          <option value="">Select State</option>
                                          <option v-for="state in states" :key="state">{{ state }}</option>
                                        </select>
                                          </div>
                                  </div>
                                  <div class="row mb-3 ">
                                      <label for="editSenderPincode3" class="col-sm-3 col-form-label text-dark font-bold">Pincode</label>
                                          <div class="col-sm-10 ">
                                              <input v-model ="newSenderPincode"  type="number" class="form-control " id="editSenderPincode3" placeholder="Pincode" >
                                          </div>
                                  </div>
                              </div>      
    
                              <div class="modal-footer">
                                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                  <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="updateSenderDetails(edititemId,newSenderName, newSenderNumber,newSenderEmail,newSenderAddress,newSenderCity,newSenderDistrict,newSenderState,newSenderPincode)" >Submit</button>
                              </div>
                      </div>
                  </div>
              </div>
              </td>
              <td>
              <br>Recipient Name : {{ item.recipient_name }}</br>
              <br>Mobile Number :  {{ item.recipient_number }}</br>
              <br> Email :  {{ item.recipient_email }}</br>
              <br>Address :  {{ item.recipient_address }}</br>
              <br>City :  {{ item.recipient_city }}</br>
              <br>District :  {{ item.recipient_district }}</br>
              <br>State :  {{ item.recipient_state }}</br>
              <br>Pincode :  {{ item.recipient_pincode }}</br>

              <!-- Button trigger modal for Edit Recipient-->
              <br> <button type="button" class="btn btn-primary" data-bs-toggle="modal" :data-bs-target="'#editRecipientModal' + item.item_id" @click="openRecipientEditModal(item.item_id)">Edit </button></br>
    
              <!-- Modal for Edit Recipient -->
              <div class="modal fade" :id="'editRecipientModal' + item.item_id" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="editRecipientModalLabel" aria-hidden="true">
    
                  <div class="modal-dialog">
                      <div class="modal-content">
                          <div class="modal-header">
                              <h1 class="modal-title fs-5" id="editRecipientModalLabel">Edit Recipient</h1>
                              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                          </div>
                          <div class="modal-body">
                          <div class="row mb-3 ">
                              <label for="editRecipientName3" class="col-sm-3 col-form-label text-dark font-bold">Recipient's Name</label>
                                  <div class="col-sm-10 ">
                                      <input v-model ="newRecipientName" type="text" class="form-control " id="editRecipientName3" placeholder="Name of Recipient" >
                                  </div>
                          </div>
                              <div class="modal-body">
                                  <div class="row mb-3 ">
                                      <label for="editRecipientNumber3" class="col-sm-3 col-form-label text-dark font-bold">Recipient's Number</label>
                                          <div class="col-sm-10 ">
                                              <input v-model ="newRecipientNumber" type="number" class="form-control " id="editRecipientNumber3" placeholder="Number of Recipient" >
                                          </div>
                                  </div>
    
                                  <div class="row mb-3 ">
                                      <label for="editRecipientEmail3" class="col-sm-3 col-form-label text-dark font-bold">Email</label>
                                          <div class="col-sm-10 ">
                                              <input v-model ="newRecipientEmail"  type="email" class="form-control " id="editRecipientEmail3" placeholder="Email" >
                                          </div>
                                  </div>
    
                                  <div class="modal-body">
                                  <div class="row mb-3 ">
                                      <label for="editRecipientAddress3" class="col-sm-3 col-form-label text-dark font-bold">Address</label>
                                          <div class="col-sm-10 ">
                                              <input v-model ="newRecipientAddress" type="text" class="form-control " id="editRecipientAddress3" placeholder="Address" >
                                          </div>
                                  </div>

                                  <div class="modal-body">
                                  <div class="row mb-3 ">
                                      <label for="editRecipientCity3" class="col-sm-3 col-form-label text-dark font-bold">City</label>
                                          <div class="col-sm-10 ">
                                          <select v-model="newRecipientCity" class="form-control" id="editRecipientCity3">
                                          <option value="">Select City</option>
                                          <option v-for="city in cities" :key="state">{{ city }}</option>
                                       </select> 
                                       </div>
                                  </div>


                                  <div class="row mb-3 ">
                                      <label for="editRecipientDistrict3" class="col-sm-3 col-form-label text-dark font-bold">District</label>
                                          <div class="col-sm-10 ">
                                          <select v-model="newRecipientDistrict" class="form-control" id="editRecipientDistrict3">
                                          <option value="">Select District</option>
                                          <option v-for="district in districts" :key="state">{{ district }}</option>
                                       </select>                                           
                                       </div>
                                  </div>
                                      <div class="row mb-3 ">
                                      <label for="editRecipientState3" class="col-sm-3 col-form-label text-dark font-bold">State</label>
                                          <div class="col-sm-10 ">
                                            <select v-model="newRecipientState" class="form-control" id="editRecipientState3">
                                               <option value="">Select state</option>
                                               <option v-for="state in states" :key="state">{{ state }}</option>
                                            </select>                                          
                                        </div>
                                  </div>
                                  <div class="row mb-3 ">
                                      <label for="editRecipientPincode3" class="col-sm-3 col-form-label text-dark font-bold">Pincode</label>
                                          <div class="col-sm-10 ">
                                              <input v-model ="newRecipientPincode"  type="number" class="form-control " id="editRecipientPincode3" placeholder="Pincode" >
                                          </div>
                                  </div>
                              </div>      
    
                              <div class="modal-footer">
                                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                  <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="updateRecipientDetails(edititemId,newRecipientName, newRecipientNumber,newRecipientEmail,newRecipientAddress,newRecipientCity,newRecipientDistrict,newRecipientState,newRecipientPincode)" >Submit</button>
                              </div>
                      </div>
                  </div>
              </div>

              </td>
              <td>
              <select v-model="item.delivery_preferences"@change="updateDeliveryPreferences(item)" class="form-control" id="inputPackagedelivery_preferences3">
              <option value="standard">Standard</option>
              <option value="premium">Premium</option>
              </select>
              </td>
              <td>&#8377;  {{ (item.total_price).toFixed(2) }}</td>
              <td>
                <button @click="removeItem(item.item_id)" class="btn btn-danger">Remove</button>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-if="cartItems.length === 0">Your cart is empty.</p>
        <div>
          <strong>Total Price: &#8377; {{ (grandTotal).toFixed(2) }}</strong>
        </div>
        <button @click="checkout()" class="btn btn-success">Checkout</button>
      </div>
      <div>
      <div>
      <div>
          <!-- Display success and error messages here -->
          <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>
          <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
      </div>
      </div>
      </div>
    </div>
    `,
    data() {
      return {
        cartItems: [],
        grandTotal: 0.0,
        successMessage: '',
        errorMessage: '',

        cities: [],
        districts: [],
        states: [],

        edititemId : null,
        newPackageNumber: null,
        newPackageDetails: '',
        newWeight: null,
        newHeight: null,
        newWidth: null,

        newSenderName:'',
        newSenderNumber:null,
        newSenderEmail:'',
        newSenderAddress:'',
        newSenderCity:'',
        newSenderDistrict:'',
        newSenderState:'',
        newSenderPincode:null,


        newRecipientName:'',
        newRecipientNumber:null,
        newRecipientEmail:'',
        newRecipientAddress:'',
        newRecipientCity:'',
        newRecipientDistrict:'',
        newRecipientState:'',
        newRecipientPincode:null,
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


      //fetch data of cart
        fetchCartData() {
            fetch('/api/cart')
              .then((response) => response.json())
              .then((data) => {
                this.cartItems = data.cart_items; 
                this.calculateGrandTotal();
              })
              .catch((error) => {
                console.error('Error fetching cart data:', error);
                this.errorMessage = 'Failed to fetch cart data';
              });
          },
      
      // Function to edit Package Details
      openPackageEditModal(itemId) {
          this.edititemId = itemId; 
      },
      updatePackageDetails(itemId,newPackageNumber, newPackageDetails,newWeight,newHeight,newWidth) {
          fetch(`/api/cart/update_package_details/${itemId}`, {
              method: "PUT",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify({
                package_number: newPackageNumber,
                package_details: newPackageDetails,
                weight: newWeight,
                height:newHeight,
                width:newWidth
              }),
          })
              .then((response) => {
                  if (response.status === 200) {
                      console.log("Edited Package Details with ID:", itemId);
                      this.fetchCartData(); 
                      this.successMessage = "Package Details updated successfully.";
                  } else if (response.status === 400) {
                      this.errorMessage = "Package Details is required.";
                  } else if (response.status === 404) {
                      this.errorMessage = "Package Details not found.";
                  } else {
                      this.errorMessage = "Failed to update Package Details.";
                  }
              })
              .catch((error) => {
                  this.errorMessage = "Network error occurred.";
              });
      },

      // Function to edit Sender Details
      openSenderEditModal(itemId) {
        this.edititemId = itemId; 
    },
    updateSenderDetails(itemId,newSenderName, newSenderNumber,newSenderEmail,newSenderAddress,newSenderCity,newSenderDistrict,newSenderState,newSenderPincode) {
        fetch(`/api/cart/update_sender_details/${itemId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
              sender_name: newSenderName,
              sender_number: newSenderNumber,
              sender_email: newSenderEmail,
              sender_address:newSenderAddress,
              sender_city:newSenderCity,
              sender_district:newSenderDistrict,
              sender_state:newSenderState,
              sender_pincode:newSenderPincode,

            }),
        })
            .then((response) => {
                if (response.status === 200) {
                    console.log("Edited Sender Details with ID:", itemId);
                    this.fetchCartData(); 
                    this.successMessage = "Sender Details updated successfully.";
                } else if (response.status === 400) {
                    this.errorMessage = "Sender Details is required.";
                } else if (response.status === 404) {
                    this.errorMessage = "Sender Details not found.";
                } else {
                    this.errorMessage = "Failed to update Sender Details.";
                }
            })
            .catch((error) => {
                this.errorMessage = "Network error occurred.";
            });
    },

      // Function to edit Recipient Details
      openRecipientEditModal(itemId) {
        this.edititemId = itemId; 
    },
    updateRecipientDetails(itemId,newRecipientName, newRecipientNumber,newRecipientEmail,newRecipientAddress,newRecipientCity,newRecipientDistrict,newRecipientState,newRecipientPincode) {
        fetch(`/api/cart/update_recipient_details/${itemId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
              recipient_name: newRecipientName,
              recipient_number: newRecipientNumber,
              recipient_email: newRecipientEmail,
              recipient_address:newRecipientAddress,
              recipient_city:newRecipientCity,
              recipient_district:newRecipientDistrict,
              recipient_state:newRecipientState,
              recipient_pincode:newRecipientPincode,

            }),
        })
            .then((response) => {
                if (response.status === 200) {
                    console.log("Edited Recipient Details with ID:", itemId);
                    this.fetchCartData(); 
                    this.successMessage = "Recipient Details updated successfully.";
                } else if (response.status === 400) {
                    this.errorMessage = "Recipient Details is required.";
                } else if (response.status === 404) {
                    this.errorMessage = "Recipient Details not found.";
                } else {
                    this.errorMessage = "Failed to update Recipient Details.";
                }
            })
            .catch((error) => {
                this.errorMessage = "Network error occurred.";
            });
    },





      //Update function to update Delivery Preferences from cart
      updateDeliveryPreferences(item) {
        fetch(`/api/cart/update_delivery_preferences/${item.item_id}`, {  
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ delivery_preferences: item.delivery_preferences }),
        })
          .then(() => {
            this.fetchCartData();
            this.successMessage = "Delivery Preferences updated successfully";
          })
          .catch((error) => {
            console.error('Error updating cart:', error);
            this.errorMessage = "Failed to update Cart's delivery_preferences";
          });
      },

      //Remove function to delete products from cart
      removeItem(itemId) {
        fetch(`/api/cart/remove_item/${itemId}`, {
          method: 'DELETE',
        })
          .then(() => {
            this.fetchCartData(); // Refresh cart data
            this.successMessage = 'Item removed successfully';
          })
          .catch((error) => {
            console.error('Error removing item:', error);
            this.errorMessage = 'Failed to remove item';
          });
      },

      //Checkout function
      checkout() {
        fetch('/api/checkout', {
          method: 'POST',
        })
          .then((response) => {
            console.log("check out");
            if (response.status === 200) {
              this.successMessage = 'Checkout successful';
              this.errorMessage = ''; 
              this.fetchCartData(); 
            } else if (response.status === 400) {
              this.successMessage = '';
              this.errorMessage = 'Cart is empty. Please add something first.';
            } else {
              this.successMessage = '';
              this.errorMessage = 'Checkout failed';
            }
          })
          .catch((error) => {
            console.error('Error during checkout:', error);
            this.successMessage = '';
            this.errorMessage = 'Checkout failed';
          });
      },

      // Calculate Grand Total of order
      calculateGrandTotal() {
        this.grandTotal = this.cartItems.reduce((total, item) => {
          return total + item.total_price; 
        }, 0);
      },
    },
    mounted() {
      this.fetchCartData();
      this.get_cities();
      this.get_districts();
      this.get_states();
    },
  };
  
  export default Cart;
  