const Profile = {
  template: `
    <div class="container mt-4">
      <div class="row justify-content-between align-items-center mb-4">
        <div class="col-md-6">
          <h2 class="fw-bold text-primary">User Profile</h2>
          <p class="text-muted mb-0">Role: <span class="badge bg-danger">{{ userRole || 'regular user' }}</span></p>
        </div>
        <div class="col-md-6 text-end">
          <button type="button" class="btn btn-outline-success" @click="showRequestModal = true">
            Request to Become Courier Manager
          </button>
        </div>
      </div>

      <!-- Messages -->
      <div v-if="successMessage" class="alert alert-success alert-dismissible fade show" role="alert">
        {{ successMessage }}
        <button type="button" class="btn-close" @click="clearMessages"></button>
      </div>
      <div v-if="errorMessage" class="alert alert-danger alert-dismissible fade show" role="alert">
        {{ errorMessage }}
        <button type="button" class="btn-close" @click="clearMessages"></button>
      </div>

      <!-- MANAGER ACTIONS (Only visible if role is manager) -->
      <div class="card shadow-sm border-0 mb-4 bg-light" v-if="userRole === 'manager'">
        <div class="card-body d-flex justify-content-between align-items-center">
          <div>
            <h5 class="fw-bold mb-1">Manager Quick Actions</h5>
            <small class="text-muted">Export your hub's delivery performance & orders</small>
          </div>
          <button @click="fetchAndDownloadCSV" class="btn btn-dark">
            <i class="bi bi-download"></i> Download Hub Revenue Report (CSV)
          </button>
        </div>
      </div>

      <!-- MY REQUESTS SECTION -->
      <div class="card shadow-sm border-0 mb-4" v-if="requests && requests.length > 0">
        <div class="card-header bg-white py-3">
          <h5 class="card-title fw-bold mb-0">My Applications & Requests</h5>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <thead class="table-light">
                <tr>
                  <th>Request ID</th>
                  <th>Type</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="req in requests" :key="req.request_id">
                  <td class="fw-bold">#{{ req.request_id }}</td>
                  <td>{{ req.action }}</td>
                  <td>
                    <span :class="{'badge bg-warning text-dark': req.status === 'pending', 'badge bg-success': req.status === 'approved', 'badge bg-danger': req.status === 'rejected'}">
                      {{ req.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- USER ORDERS SECTION -->
      <div class="mb-5">
        <h4 class="fw-bold text-dark mb-3">Order History & Live Tracking</h4>

        <div v-if="orders.length === 0" class="text-center py-5 bg-white rounded shadow-sm">
          <p class="text-muted mb-2">You haven't placed any courier orders yet.</p>
          <router-link to="/home" class="btn btn-primary">Book Your First Courier</router-link>
        </div>

        <div v-for="order in orders" :key="order.order_id" class="card shadow-sm border-0 mb-4">
          <div class="card-header bg-white border-bottom d-flex justify-content-between align-items-center py-3">
            <div>
              <span class="fw-bold text-primary fs-5">Order #{{ order.order_id }}</span>
              <span class="text-muted ms-3 small">{{ order.order_date }}</span>
            </div>
            <div>
              <span class="fs-5 fw-bold text-success me-3">&#8377; {{ Number(order.total_price || 0).toFixed(2) }}</span>
              <button 
                type="button" 
                class="btn btn-sm btn-outline-danger" 
                @click="openCancelModal(order.order_id)"
                :disabled="isDeliveredOrCancelled(order)"
              >
                Cancel Delivery
              </button>
            </div>
          </div>

          <div class="card-body">
            <div class="row mb-3">
              <div class="col-md-6 border-end">
                <h6 class="text-muted text-uppercase small fw-bold">Sender</h6>
                <div class="fw-bold">{{ order.sender_name }}</div>
              </div>
              <div class="col-md-6 ps-md-4">
                <h6 class="text-muted text-uppercase small fw-bold">Recipient</h6>
                <div class="fw-bold">{{ order.recipient_name }}</div>
              </div>
            </div>

            <div class="row g-2 p-2 bg-light rounded mb-3 small">
              <div class="col-sm-3"><strong>Weight:</strong> {{ order.weight }} g</div>
              <div class="col-sm-3"><strong>Dimensions:</strong> {{ order.height }}x{{ order.width }} cm</div>
              <div class="col-sm-3"><strong>Packages:</strong> {{ order.package_number }}</div>
              <div class="col-sm-3"><strong>Preference:</strong> <span class="text-capitalize">{{ order.delivery_preferences }}</span></div>
            </div>

            <h6 class="fw-bold text-dark mt-4 mb-2">Live Route Tracking</h6>
            <div class="table-responsive">
              <table class="table table-bordered table-sm align-middle text-center mb-0">
                <thead class="table-light">
                  <tr>
                    <th>Hub / City</th>
                    <th>Status</th>
                    <th>Last Updated</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(tracking, idx) in order.tracking_details" :key="idx">
                    <td class="fw-bold">{{ tracking.current_location }}</td>
                    <td>
                      <span class="badge" :class="getStatusBadgeClass(tracking.status)">
                        {{ tracking.statusMessage || tracking.status }}
                      </span>
                    </td>
                    <td class="text-muted small">{{ tracking.timestamp }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- MODAL: REQUEST TO BECOME COURIER MANAGER -->
      <div v-if="showRequestModal" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title fw-bold">Courier Hub Manager Application</h5>
              <button type="button" class="btn-close" @click="showRequestModal = false"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="requestCourierManager">
                <div class="mb-3">
                  <label class="form-label fw-bold">Mobile Number</label>
                  <input v-model="newCourierManagernumber" type="tel" class="form-control" placeholder="10-digit number" required>
                </div>
                <div class="mb-3">
                  <label class="form-label fw-bold">Hub Office Address</label>
                  <input v-model="newCourierManageraddress" type="text" class="form-control" placeholder="Office location address" required>
                </div>
                <div class="mb-3">
                  <label class="form-label fw-bold">City Name</label>
                  <input v-model="newCourierManagercity" type="text" class="form-control" placeholder="City" required>
                </div>
                <div class="mb-3">
                  <label class="form-label fw-bold">District</label>
                  <input v-model="newCourierManagerdistrict" type="text" class="form-control" placeholder="District" required>
                </div>
                <div class="mb-3">
                  <label class="form-label fw-bold">State</label>
                  <select v-model="newCourierManagerstate" class="form-select" required>
                    <option value="" disabled>Select State</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Puducherry">Puducherry</option>
                    <option value="Kerala">Kerala</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                    <option value="Telangana">Telangana</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label class="form-label fw-bold">Pincode</label>
                  <input v-model="newCourierManagerpincode" type="number" class="form-control" placeholder="Pincode" min="100000" max="999999" required>
                </div>
                <div class="d-flex justify-content-end gap-2">
                  <button type="button" class="btn btn-secondary" @click="showRequestModal = false">Cancel</button>
                  <button type="submit" class="btn btn-primary">Submit Application</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- MODAL: CONFIRM CANCEL DELIVERY -->
      <div v-if="cancelModalOrderId" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title text-danger fw-bold">Cancel Delivery</h5>
              <button type="button" class="btn-close" @click="cancelModalOrderId = null"></button>
            </div>
            <div class="modal-body">
              Are you sure you want to cancel courier order <strong>#{{ cancelModalOrderId }}</strong>? This action cannot be undone.
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="cancelModalOrderId = null">Back</button>
              <button type="button" class="btn btn-danger" @click="cancelDelivery(cancelModalOrderId)">Confirm Cancellation</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      newCourierManagernumber: '',
      newCourierManageraddress: '',
      newCourierManagercity: '',
      newCourierManagerdistrict: '',
      newCourierManagerstate: 'Tamil Nadu',
      newCourierManagerpincode: null,

      userRole: null,
      requests: [],
      orders: [],
      manager_username: '',

      showRequestModal: false,
      cancelModalOrderId: null,
      successMessage: '',
      errorMessage: ''
    };
  },
  methods: {
    getStatusBadgeClass(status) {
      if (status === 'delivered') return 'bg-success';
      if (status === 'cancel') return 'bg-danger';
      if (status === 'in transit') return 'bg-primary';
      return 'bg-warning text-dark';
    },
    getStatusMessage(status) {
      if (status === 'received') return 'Received at Hub';
      if (status === 'in transit') return 'In Transit to Next Hub';
      if (status === 'delivered') return 'Delivered';
      if (status === 'cancel') return 'Cancelled';
      return status;
    },
    isDeliveredOrCancelled(order) {
      const details = order.tracking_details || [];
      const last = details[details.length - 1];
      return last && (last.status === 'delivered' || last.status === 'cancel');
    },
    get_user_requests() {
      fetch('/api/user_requests')
        .then((r) => r.json())
        .then((data) => {
          this.userRole = data.user_role;
          this.requests = data.requests || [];
        })
        .catch(console.error);
    },
    get_user_orders() {
      fetch('/api/user_orders')
        .then((r) => r.json())
        .then((data) => {
          (data || []).forEach((order) => {
            (order.tracking_details || []).forEach((tracking) => {
              tracking.statusMessage = this.getStatusMessage(tracking.status);
            });
          });
          this.orders = data || [];
        })
        .catch((err) => {
          this.errorMessage = 'Failed to load order history.';
        });
    },
    get_manager_username() {
      fetch('/api/manager_username')
        .then((r) => r.json())
        .then((data) => {
          this.manager_username = data.manager_username;
        })
        .catch(console.error);
    },
    requestCourierManager() {
      const payload = {
        courier_manager_number: this.newCourierManagernumber,
        courier_manager_address: this.newCourierManageraddress,
        courier_manager_city: this.newCourierManagercity,
        courier_manager_district: this.newCourierManagerdistrict,
        courier_manager_state: this.newCourierManagerstate,
        courier_manager_pincode: this.newCourierManagerpincode
      };

      fetch('/api/request_for_new_courier_manager', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then((res) => {
          if (res.status === 201) {
            this.successMessage = 'Your application to become a Courier Hub Manager was submitted!';
            this.showRequestModal = false;
            this.get_user_requests();
          } else {
            this.errorMessage = 'Failed to submit application.';
          }
        })
        .catch(console.error);
    },
    openCancelModal(orderId) {
      this.cancelModalOrderId = orderId;
    },
    cancelDelivery(orderId) {
      fetch(`/api/orders/${orderId}`, { method: 'PUT' })
        .then((res) => {
          if (res.status === 200) {
            this.successMessage = 'Order has been successfully canceled.';
            this.cancelModalOrderId = null;
            this.get_user_orders();
          } else {
            this.errorMessage = 'Order cannot be canceled.';
            this.cancelModalOrderId = null;
          }
        })
        .catch(console.error);
    },
    fetchAndDownloadCSV() {
      fetch('/api/generate-csv')
        .then((res) => res.blob())
        .then((blob) => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `${this.manager_username || 'manager'}_report.csv`);
          document.body.appendChild(link);
          link.click();
          link.remove();
          this.successMessage = 'Report downloaded successfully!';
        })
        .catch(console.error);
    },
    clearMessages() {
      this.successMessage = '';
      this.errorMessage = '';
    }
  },
  mounted() {
    this.get_user_requests();
    this.get_user_orders();
    this.get_manager_username();
  }
};

export default Profile;
