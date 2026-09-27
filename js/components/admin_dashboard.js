const Admin_Dashboard = {
  template: `
    <div class="container mt-4">
      <div class="row justify-content-between align-items-center mb-4">
        <div class="col-md-6">
          <h2 class="fw-bold text-danger">Admin Dashboard</h2>
          <p class="text-muted mb-0">Courier Distribution Hubs & Locations</p>
        </div>
        <div class="col-md-6 text-end">
          <router-link to="/admin_management" class="btn btn-outline-danger me-2">Manager Requests</router-link>
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
        <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
          <h5 class="fw-bold mb-0">Active Courier Locations ({{ locations.length }})</h5>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead class="table-light">
                <tr>
                  <th class="text-center">ID</th>
                  <th>City</th>
                  <th>District</th>
                  <th>State</th>
                  <th>Pincode</th>
                  <th class="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="location in locations" :key="location.courier_manager_location_id">
                  <td class="text-center fw-bold">#{{ location.courier_manager_location_id }}</td>
                  <td class="fw-bold text-primary">{{ location.courier_manager_city }}</td>
                  <td>{{ location.courier_manager_district }}</td>
                  <td>{{ location.courier_manager_state }}</td>
                  <td>{{ location.courier_manager_pincode }}</td>
                  <td class="text-center">
                    <button type="button" class="btn btn-sm btn-outline-primary me-2" @click="openlocationEditModal(location)">
                      Edit
                    </button>
                    <button type="button" class="btn btn-sm btn-outline-danger" @click="openlocationDeleteModal(location.courier_manager_location_id)">
                      Delete
                    </button>
                  </td>
                </tr>
                <tr v-if="locations.length === 0">
                  <td colspan="6" class="text-center py-4 text-muted">No locations currently configured.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- MODAL: EDIT LOCATION -->
      <div v-if="editlocationId" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title fw-bold">Edit Location #{{ editlocationId }}</h5>
              <button type="button" class="btn-close" @click="editlocationId = null"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label fw-bold">City Name</label>
                <input v-model="newLocationCityname" type="text" class="form-control" required>
              </div>
              <div class="mb-3">
                <label class="form-label fw-bold">District</label>
                <input v-model="newLocationDistrictname" type="text" class="form-control" required>
              </div>
              <div class="mb-3">
                <label class="form-label fw-bold">State</label>
                <input v-model="newLocationStatename" type="text" class="form-control" required>
              </div>
              <div class="mb-3">
                <label class="form-label fw-bold">Pincode</label>
                <input v-model="newLocationPincode" type="number" class="form-control" required>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="editlocationId = null">Cancel</button>
              <button type="button" class="btn btn-primary" @click="updateLocation">Save Location</button>
            </div>
          </div>
        </div>
      </div>

      <!-- MODAL: DELETE LOCATION -->
      <div v-if="deleteLocationId" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title text-danger fw-bold">Confirm Deletion</h5>
              <button type="button" class="btn-close" @click="deleteLocationId = null"></button>
            </div>
            <div class="modal-body">
              Are you sure you want to remove Location hub <strong>#{{ deleteLocationId }}</strong>? Orders routed through this hub may be affected.
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="deleteLocationId = null">Cancel</button>
              <button type="button" class="btn btn-danger" @click="confirmDelete">Delete Location</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      locations: [],
      editlocationId: null,
      newLocationCityname: '',
      newLocationDistrictname: '',
      newLocationStatename: '',
      newLocationPincode: null,
      deleteLocationId: null,
      successMessage: '',
      errorMessage: ''
    };
  },
  methods: {
    loadlocations() {
      fetch('/api/locations')
        .then((res) => res.json())
        .then((data) => {
          this.locations = data || [];
        })
        .catch((err) => {
          this.errorMessage = 'Error loading locations.';
        });
    },
    openlocationDeleteModal(locationId) {
      this.deleteLocationId = locationId;
    },
    confirmDelete() {
      fetch(`/api/locations/${this.deleteLocationId}`, { method: 'DELETE' })
        .then((res) => {
          if (res.status === 200) {
            this.successMessage = 'Location deleted successfully.';
            this.deleteLocationId = null;
            this.loadlocations();
          } else {
            this.errorMessage = 'Failed to delete location.';
          }
        })
        .catch(console.error);
    },
    openlocationEditModal(location) {
      this.editlocationId = location.courier_manager_location_id;
      this.newLocationCityname = location.courier_manager_city;
      this.newLocationDistrictname = location.courier_manager_district;
      this.newLocationStatename = location.courier_manager_state;
      this.newLocationPincode = location.courier_manager_pincode;
    },
    updateLocation() {
      fetch(`/api/locations/${this.editlocationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courier_manager_city: this.newLocationCityname,
          courier_manager_district: this.newLocationDistrictname,
          courier_manager_state: this.newLocationStatename,
          courier_manager_pincode: this.newLocationPincode
        })
      })
        .then((res) => {
          if (res.status === 200) {
            this.successMessage = 'Location updated successfully.';
            this.editlocationId = null;
            this.loadlocations();
          } else {
            this.errorMessage = 'Failed to update location.';
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
    this.loadlocations();
  }
};

export default Admin_Dashboard;
