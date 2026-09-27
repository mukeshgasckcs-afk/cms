const Cart = {
  template: `
    <div class="container mt-4">
      <div class="row justify-content-center">
        <div class="col-md-6 text-center">
          <h2 class="fw-bold text-primary">Shopping Cart</h2>
          <p class="text-muted">Review and confirm your courier dispatches</p>
        </div>
      </div>

      <!-- Messages -->
      <div class="row justify-content-center" v-if="successMessage || errorMessage">
        <div class="col-md-10">
          <div v-if="successMessage" class="alert alert-success alert-dismissible fade show" role="alert">
            {{ successMessage }}
            <button type="button" class="btn-close" @click="clearMessages"></button>
          </div>
          <div v-if="errorMessage" class="alert alert-danger alert-dismissible fade show" role="alert">
            {{ errorMessage }}
            <button type="button" class="btn-close" @click="clearMessages"></button>
          </div>
        </div>
      </div>

      <div class="card shadow-sm border-0 mb-4">
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead class="table-light">
                <tr>
                  <th scope="col" style="min-width: 220px;">Package Details</th>
                  <th scope="col" style="min-width: 220px;">Sender</th>
                  <th scope="col" style="min-width: 220px;">Recipient</th>
                  <th scope="col" style="min-width: 150px;">Preference</th>
                  <th scope="col" class="text-end" style="min-width: 120px;">Price</th>
                  <th scope="col" class="text-center" style="min-width: 100px;">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in cartItems" :key="item.item_id">
                  <td>
                    <div class="fw-bold text-dark">{{ item.package_details || 'Parcel' }}</div>
                    <small class="text-muted d-block">Qty: {{ item.package_number }} | Wt: {{ item.weight }}g</small>
                    <small class="text-muted d-block">Dim: {{ item.height }}x{{ item.width }} cm</small>
                    <button type="button" class="btn btn-sm btn-outline-primary mt-2" @click="openPackageEditModal(item)">
                      Edit Package
                    </button>
                  </td>
                  <td>
                    <div class="fw-bold">{{ item.sender_name }}</div>
                    <small class="text-muted d-block">{{ item.sender_number }}</small>
                    <small class="text-muted d-block">{{ item.sender_address }}</small>
                    <small class="text-muted d-block">{{ item.sender_city }}, {{ item.sender_pincode }}</small>
                    <button type="button" class="btn btn-sm btn-outline-primary mt-2" @click="openSenderEditModal(item)">
                      Edit Sender
                    </button>
                  </td>
                  <td>
                    <div class="fw-bold">{{ item.recipient_name }}</div>
                    <small class="text-muted d-block">{{ item.recipient_number }}</small>
                    <small class="text-muted d-block">{{ item.recipient_address }}</small>
                    <small class="text-muted d-block">{{ item.recipient_city }}, {{ item.recipient_pincode }}</small>
                    <button type="button" class="btn btn-sm btn-outline-primary mt-2" @click="openRecipientEditModal(item)">
                      Edit Recipient
                    </button>
                  </td>
                  <td>
                    <select v-model="item.delivery_preferences" @change="updateDeliveryPreferences(item)" class="form-select form-select-sm">
                      <option value="standard">Standard</option>
                      <option value="premium">Premium</option>
                    </select>
                  </td>
                  <td class="text-end fw-bold text-success">
                    &#8377; {{ Number(item.total_price || 0).toFixed(2) }}
                  </td>
                  <td class="text-center">
                    <button @click="removeItem(item.item_id)" class="btn btn-sm btn-danger">
                      Remove
                    </button>
                  </td>
                </tr>

                <tr v-if="cartItems.length === 0">
                  <td colspan="6" class="text-center py-5">
                    <h5 class="text-muted">Your cart is empty.</h5>
                    <router-link to="/home" class="btn btn-primary mt-2">Book a Courier Now</router-link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div class="card-footer bg-white d-flex justify-content-between align-items-center p-3" v-if="cartItems.length > 0">
          <div>
            <span class="fs-5 fw-bold">Grand Total: </span>
            <span class="fs-4 fw-bold text-success">&#8377; {{ Number(grandTotal).toFixed(2) }}</span>
          </div>
          <button @click="checkout" class="btn btn-success btn-lg px-4 fw-bold">
            Proceed to Checkout
          </button>
        </div>
      </div>

      <!-- MODAL: EDIT PACKAGE -->
      <div v-if="activeModal === 'package'" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title fw-bold">Edit Package Details</h5>
              <button type="button" class="btn-close" @click="closeModals"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label fw-bold">Number of Packages</label>
                <input v-model="newPackageNumber" type="number" class="form-control" min="1">
              </div>
              <div class="mb-3">
                <label class="form-label fw-bold">Details / Contents</label>
                <input v-model="newPackageDetails" type="text" class="form-control">
              </div>
              <div class="row g-2">
                <div class="col-md-4">
                  <label class="form-label fw-bold">Weight (g)</label>
                  <input v-model="newWeight" type="number" class="form-control" min="1">
                </div>
                <div class="col-md-4">
                  <label class="form-label fw-bold">Height (cm)</label>
                  <input v-model="newHeight" type="number" class="form-control" min="1">
                </div>
                <div class="col-md-4">
                  <label class="form-label fw-bold">Width (cm)</label>
                  <input v-model="newWidth" type="number" class="form-control" min="1">
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeModals">Cancel</button>
              <button type="button" class="btn btn-primary" @click="savePackageDetails">Save Changes</button>
            </div>
          </div>
        </div>
      </div>

      <!-- MODAL: EDIT SENDER -->
      <div v-if="activeModal === 'sender'" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title fw-bold">Edit Sender Information</h5>
              <button type="button" class="btn-close" @click="closeModals"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label fw-bold">Sender Name</label>
                <input v-model="newSenderName" type="text" class="form-control">
              </div>
              <div class="mb-3">
                <label class="form-label fw-bold">Contact Number</label>
                <input v-model="newSenderNumber" type="tel" class="form-control">
              </div>
              <div class="mb-3">
                <label class="form-label fw-bold">Email</label>
                <input v-model="newSenderEmail" type="email" class="form-control">
              </div>
              <div class="mb-3">
                <label class="form-label fw-bold">Address</label>
                <input v-model="newSenderAddress" type="text" class="form-control">
              </div>
              <div class="row g-2">
                <div class="col-md-6">
                  <label class="form-label fw-bold">City</label>
                  <select v-model="newSenderCity" class="form-select">
                    <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-bold">Pincode</label>
                  <input v-model="newSenderPincode" type="number" class="form-control">
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeModals">Cancel</button>
              <button type="button" class="btn btn-primary" @click="saveSenderDetails">Save Changes</button>
            </div>
          </div>
        </div>
      </div>

      <!-- MODAL: EDIT RECIPIENT -->
      <div v-if="activeModal === 'recipient'" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title fw-bold">Edit Recipient Information</h5>
              <button type="button" class="btn-close" @click="closeModals"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label fw-bold">Recipient Name</label>
                <input v-model="newRecipientName" type="text" class="form-control">
              </div>
              <div class="mb-3">
                <label class="form-label fw-bold">Contact Number</label>
                <input v-model="newRecipientNumber" type="tel" class="form-control">
              </div>
              <div class="mb-3">
                <label class="form-label fw-bold">Email</label>
                <input v-model="newRecipientEmail" type="email" class="form-control">
              </div>
              <div class="mb-3">
                <label class="form-label fw-bold">Address</label>
                <input v-model="newRecipientAddress" type="text" class="form-control">
              </div>
              <div class="row g-2">
                <div class="col-md-6">
                  <label class="form-label fw-bold">City</label>
                  <select v-model="newRecipientCity" class="form-select">
                    <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-bold">Pincode</label>
                  <input v-model="newRecipientPincode" type="number" class="form-control">
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeModals">Cancel</button>
              <button type="button" class="btn btn-primary" @click="saveRecipientDetails">Save Changes</button>
            </div>
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
      activeModal: null, // 'package' | 'sender' | 'recipient' | null

      cities: [],
      districts: [],
      states: [],

      edititemId: null,
      newPackageNumber: 1,
      newPackageDetails: '',
      newWeight: 0,
      newHeight: 0,
      newWidth: 0,

      newSenderName: '',
      newSenderNumber: '',
      newSenderEmail: '',
      newSenderAddress: '',
      newSenderCity: '',
      newSenderDistrict: '',
      newSenderState: '',
      newSenderPincode: null,

      newRecipientName: '',
      newRecipientNumber: '',
      newRecipientEmail: '',
      newRecipientAddress: '',
      newRecipientCity: '',
      newRecipientDistrict: '',
      newRecipientState: '',
      newRecipientPincode: null
    };
  },
  methods: {
    get_cities() {
      fetch('/api/cities')
        .then((r) => r.json())
        .then((data) => (this.cities = data))
        .catch(console.error);
    },
    fetchCartData() {
      fetch('/api/cart')
        .then((r) => r.json())
        .then((data) => {
          this.cartItems = data.cart_items || [];
          this.grandTotal = data.total_price || 0;
        })
        .catch((err) => {
          this.errorMessage = 'Failed to load cart.';
        });
    },
    closeModals() {
      this.activeModal = null;
    },
    openPackageEditModal(item) {
      this.edititemId = item.item_id;
      this.newPackageNumber = item.package_number;
      this.newPackageDetails = item.package_details;
      this.newWeight = item.weight;
      this.newHeight = item.height;
      this.newWidth = item.width;
      this.activeModal = 'package';
    },
    savePackageDetails() {
      fetch(`/api/cart/update_package_details/${this.edititemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          package_number: this.newPackageNumber,
          package_details: this.newPackageDetails,
          weight: this.newWeight,
          height: this.newHeight,
          width: this.newWidth
        })
      })
        .then((res) => {
          if (res.status === 200) {
            this.successMessage = 'Package details updated successfully.';
            this.fetchCartData();
            this.closeModals();
          } else {
            this.errorMessage = 'Failed to update package details.';
          }
        })
        .catch(console.error);
    },
    openSenderEditModal(item) {
      this.edititemId = item.item_id;
      this.newSenderName = item.sender_name;
      this.newSenderNumber = item.sender_number;
      this.newSenderEmail = item.sender_email;
      this.newSenderAddress = item.sender_address;
      this.newSenderCity = item.sender_city;
      this.newSenderDistrict = item.sender_district;
      this.newSenderState = item.sender_state;
      this.newSenderPincode = item.sender_pincode;
      this.activeModal = 'sender';
    },
    saveSenderDetails() {
      fetch(`/api/cart/update_sender_details/${this.edititemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_name: this.newSenderName,
          sender_number: this.newSenderNumber,
          sender_email: this.newSenderEmail,
          sender_address: this.newSenderAddress,
          sender_city: this.newSenderCity,
          sender_district: this.newSenderDistrict,
          sender_state: this.newSenderState,
          sender_pincode: this.newSenderPincode
        })
      })
        .then((res) => {
          if (res.status === 200) {
            this.successMessage = 'Sender details updated successfully.';
            this.fetchCartData();
            this.closeModals();
          } else {
            this.errorMessage = 'Failed to update sender details.';
          }
        })
        .catch(console.error);
    },
    openRecipientEditModal(item) {
      this.edititemId = item.item_id;
      this.newRecipientName = item.recipient_name;
      this.newRecipientNumber = item.recipient_number;
      this.newRecipientEmail = item.recipient_email;
      this.newRecipientAddress = item.recipient_address;
      this.newRecipientCity = item.recipient_city;
      this.newRecipientDistrict = item.recipient_district;
      this.newRecipientState = item.recipient_state;
      this.newRecipientPincode = item.recipient_pincode;
      this.activeModal = 'recipient';
    },
    saveRecipientDetails() {
      fetch(`/api/cart/update_recipient_details/${this.edititemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipient_name: this.newRecipientName,
          recipient_number: this.newRecipientNumber,
          recipient_email: this.newRecipientEmail,
          recipient_address: this.newRecipientAddress,
          recipient_city: this.newRecipientCity,
          recipient_district: this.newRecipientDistrict,
          recipient_state: this.newRecipientState,
          recipient_pincode: this.newRecipientPincode
        })
      })
        .then((res) => {
          if (res.status === 200) {
            this.successMessage = 'Recipient details updated successfully.';
            this.fetchCartData();
            this.closeModals();
          } else {
            this.errorMessage = 'Failed to update recipient details.';
          }
        })
        .catch(console.error);
    },
    updateDeliveryPreferences(item) {
      fetch(`/api/cart/update_delivery_preferences/${item.item_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delivery_preferences: item.delivery_preferences })
      })
        .then(() => {
          this.fetchCartData();
          this.successMessage = 'Delivery preferences updated.';
        })
        .catch(console.error);
    },
    removeItem(itemId) {
      fetch(`/api/cart/remove_item/${itemId}`, { method: 'DELETE' })
        .then(() => {
          this.fetchCartData();
          this.successMessage = 'Item removed from cart.';
        })
        .catch(console.error);
    },
    checkout() {
      fetch('/api/checkout', { method: 'POST' })
        .then((res) => {
          if (res.status === 200) {
            this.successMessage = 'Checkout successful! Your order has been placed.';
            this.fetchCartData();
            setTimeout(() => {
              this.$router.push({ name: 'profile' });
            }, 1200);
          } else {
            this.errorMessage = 'Checkout failed.';
          }
        })
        .catch(console.error);
    },
    clearMessages() {
      this.successMessage = '';
      this.errorMessage = '';
    }
  },
  mounted() {
    this.fetchCartData();
    this.get_cities();
  }
};

export default Cart;
