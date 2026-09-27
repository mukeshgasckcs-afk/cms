const Manager_Dashboard = {
  template: `
    <div class="container mt-4">
      <div class="row justify-content-between align-items-center mb-4">
        <div class="col-md-6">
          <h2 class="fw-bold text-primary">Manager Hub Dashboard</h2>
          <p class="text-muted mb-0">Manage dispatches, transits, and deliveries at your courier hub</p>
        </div>
        <div class="col-md-6 text-end">
          <router-link to="/profile" class="btn btn-outline-primary me-2">Download Reports</router-link>
          <button @click="fetchOrdersByLocation" class="btn btn-primary">Refresh Orders</button>
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
          <h5 class="fw-bold mb-0">Incoming & Active Orders ({{ orders.length }})</h5>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead class="table-light">
                <tr>
                  <th>Order ID</th>
                  <th>Route Overview</th>
                  <th>Current Hub Status</th>
                  <th>Previous Hub</th>
                  <th class="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="order in orders" :key="order.package_tracking_id">
                  <td class="fw-bold text-primary">#{{ order.order_id }}</td>
                  <td>
                    <span class="badge bg-light text-dark border">{{ order.city_list }}</span>
                  </td>
                  <td>
                    <span class="badge" :class="getStatusBadge(order.package_tracking_status)">
                      {{ getStatusMessage(order.package_tracking_status, order.curr_city, order.city_list) }}
                    </span>
                  </td>
                  <td>
                    <span class="text-muted small">
                      {{ getPrevCityMessage(order.package_tracking_status, order.curr_city, order.city_list, order.previous_received_city) }}
                    </span>
                  </td>
                  <td class="text-center">
                    <div v-if="order.package_tracking_status !== 'cancel' && order.package_tracking_status !== 'delivered'">
                      <button 
                        v-if="['Now transit from origin', 'Received and forwarded to the next location', 'Transit to next location'].includes(getStatusMessage(order.package_tracking_status, order.curr_city, order.city_list))"
                        @click="transitOrder(order.package_tracking_id)"
                        class="btn btn-sm btn-primary fw-bold"
                      >
                        Forward / Transit
                      </button>

                      <button 
                        v-if="['Now deliver'].includes(getStatusMessage(order.package_tracking_status, order.curr_city, order.city_list))"
                        @click="deliverOrder(order.package_tracking_id)"
                        class="btn btn-sm btn-success fw-bold"
                      >
                        Mark Delivered
                      </button>
                    </div>
                    <div v-else>
                      <span v-if="order.package_tracking_status === 'cancel'" class="badge bg-danger">Cancelled</span>
                      <span v-else-if="order.package_tracking_status === 'delivered'" class="badge bg-success">Delivered</span>
                    </div>
                  </td>
                </tr>

                <tr v-if="orders.length === 0">
                  <td colspan="5" class="text-center py-4 text-muted">
                    No active parcels currently scheduled for your hub.
                  </td>
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
      successMessage: '',
      errorMessage: '',
      loading: true,
      orders: []
    };
  },
  methods: {
    getStatusBadge(status) {
      if (status === 'delivered') return 'bg-success';
      if (status === 'cancel') return 'bg-danger';
      if (status === 'in transit') return 'bg-primary';
      return 'bg-warning text-dark';
    },
    getStatusMessage(status, currCity, cityList) {
      const cities = (cityList || '').split(',');
      if (status === 'received' && currCity === cities[0]) {
        return 'Now transit from origin';
      } else if (status === 'in transit' && currCity === cities[cities.length - 1]) {
        return 'Now deliver';
      } else if (status === 'in transit' && currCity === cities[0]) {
        return 'Received and forwarded to the next location';
      } else if (status === 'received' && currCity !== cities[0]) {
        return 'Transit to next location';
      } else if (status === 'in transit') {
        return 'Received and forwarded to the next location';
      } else if (status === 'delivered') {
        return 'Delivered';
      } else if (status === 'cancel') {
        return 'Order canceled';
      }
      return 'Unknown status';
    },
    getPrevCityMessage(status, currCity, cityList, prevCity) {
      const cities = (cityList || '').split(',');
      if (!prevCity) {
        if (status === 'received' && currCity === cities[0]) {
          return 'Origin Location';
        } else if (status === 'in transit' && currCity === cities[cities.length - 1]) {
          return cities[cities.length - 2] || 'Previous Hub';
        } else if (status === 'received' && currCity !== cities[0]) {
          return 'Awaiting transit';
        }
        return 'N/A';
      }
      return prevCity;
    },
    async fetchOrdersByLocation() {
      try {
        const response = await fetch('/api/orders_by_location');
        if (response.ok) {
          this.orders = await response.json();
        } else {
          this.errorMessage = 'Could not fetch orders for your hub.';
        }
      } catch (err) {
        this.errorMessage = 'Network error fetching orders.';
      }
    },
    async transitOrder(trackingId) {
      try {
        const res = await fetch(`/transit_order/${trackingId}`, { method: 'POST' });
        if (res.status === 201) {
          this.successMessage = 'Parcel status updated to IN TRANSIT!';
          this.fetchOrdersByLocation();
        } else {
          this.errorMessage = 'Failed to update order transit status.';
        }
      } catch (err) {
        this.errorMessage = 'Network error updating transit.';
      }
    },
    async deliverOrder(trackingId) {
      try {
        const res = await fetch(`/deliver_order/${trackingId}`, { method: 'POST' });
        if (res.status === 201) {
          this.successMessage = 'Parcel has been marked DELIVERED successfully!';
          this.fetchOrdersByLocation();
        } else {
          this.errorMessage = 'Failed to mark parcel delivered.';
        }
      } catch (err) {
        this.errorMessage = 'Network error marking delivered.';
      }
    },
    clearMessages() {
      this.successMessage = '';
      this.errorMessage = '';
    }
  },
  mounted() {
    this.fetchOrdersByLocation();
  }
};

export default Manager_Dashboard;
