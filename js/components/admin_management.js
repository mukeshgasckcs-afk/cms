const Admin_Management = {
  template: `
    <div class="container mt-4">
      <div class="row justify-content-between align-items-center mb-4">
        <div class="col-md-6">
          <h2 class="fw-bold text-danger">Admin Management</h2>
          <p class="text-muted mb-0">Review Applications for Courier Manager Roles</p>
        </div>
        <div class="col-md-6 text-end">
          <router-link to="/admin_dashboard" class="btn btn-outline-danger me-2">Hub Locations</router-link>
          <router-link to="/summary" class="btn btn-danger">Analytics Summary</router-link>
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

      <div class="card shadow-sm border-0 mb-4">
        <div class="card-header bg-white py-3">
          <h5 class="fw-bold mb-0">Courier Manager Applications ({{ requests.length }})</h5>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead class="table-light">
                <tr>
                  <th>Req ID</th>
                  <th>Applicant</th>
                  <th>Contact</th>
                  <th>Location</th>
                  <th>State & Pincode</th>
                  <th>Status</th>
                  <th class="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="req in requests" :key="req.request_id">
                  <td class="fw-bold">#{{ req.request_id }}</td>
                  <td>
                    <div class="fw-bold">{{ req.name || 'N/A' }}</div>
                    <small class="text-muted">@{{ req.username }} ({{ req.email }})</small>
                  </td>
                  <td>
                    {{ req.courier_manager_number || 'N/A' }}
                    <small class="d-block text-muted">{{ req.courier_manager_address }}</small>
                  </td>
                  <td>
                    <div class="fw-bold text-primary">{{ req.courier_manager_city || 'Pending' }}</div>
                    <small class="text-muted">{{ req.courier_manager_district }}</small>
                  </td>
                  <td>
                    {{ req.courier_manager_state || 'N/A' }}
                    <small class="d-block text-muted">{{ req.courier_manager_pincode }}</small>
                  </td>
                  <td>
                    <span class="badge" :class="{'bg-warning text-dark': req.status === 'pending', 'bg-success': req.status === 'approved', 'bg-danger': req.status === 'rejected'}">
                      {{ req.status }}
                    </span>
                  </td>
                  <td class="text-center">
                    <div v-if="req.status === 'pending'" class="btn-group btn-group-sm">
                      <button @click="approveRequest(req.request_id)" class="btn btn-success">Approve</button>
                      <button @click="rejectRequest(req.request_id)" class="btn btn-outline-danger">Reject</button>
                    </div>
                    <span v-else class="text-muted small">Processed</span>
                  </td>
                </tr>
                <tr v-if="requests.length === 0">
                  <td colspan="7" class="text-center py-4 text-muted">No manager requests found.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      requests: [],
      errorMessage: '',
      successMessage: ''
    };
  },
  methods: {
    loadRequests() {
      fetch('/api/requests')
        .then((res) => res.json())
        .then((data) => {
          this.requests = data || [];
        })
        .catch((err) => {
          this.errorMessage = 'Failed to load requests.';
        });
    },
    approveRequest(requestId) {
      fetch(`/api/request/approve/${requestId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve' })
      })
        .then((res) => {
          if (res.ok) {
            this.successMessage = `Request #${requestId} approved! User promoted to Manager.`;
            this.loadRequests();
          } else {
            this.errorMessage = 'Failed to approve request.';
          }
        })
        .catch(console.error);
    },
    rejectRequest(requestId) {
      fetch(`/api/request/reject/${requestId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reject' })
      })
        .then((res) => {
          if (res.ok) {
            this.successMessage = `Request #${requestId} rejected.`;
            this.loadRequests();
          } else {
            this.errorMessage = 'Failed to reject request.';
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
    this.loadRequests();
  }
};

export default Admin_Management;
