
const Manager_Dashboard = {
    template: `
    <div class="container mt-4">
    <div class="row justify-content-center">
      <div class="col-md-5 text-center">
        <h2>Manager Dashboard</h2>
      </div>
    </div>
    <div>
      <!-- Display success and error messages here -->
      <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>
      <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
    </div>
    <div>
      <table class="table table-bordered table-striped">
        <thead class="thead-dark">
          <tr>
            <th>Order ID</th>
            <th>Package status</th>
            <th>Previous Received City</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.package_tracking_id">
            <td>{{ order.order_id }}</td>
            <td>{{ getStatusMessage(order.package_tracking_status, order.curr_city, order.city_list) }}</td>
            <td>{{ getPrevCityMessage(order.package_tracking_status, order.curr_city, order.city_list,order.previous_received_city) }}</td>

            <td v-if="order.package_tracking_status !== 'cancel' && order.package_tracking_status !== 'delivered'">
            <button @click="transitOrder(order.package_tracking_id)" class="btn btn-primary" v-if="['Now transit from origin', 'Received and forwarded to the next location', 'Transit to next location'].includes(getStatusMessage(order.package_tracking_status, order.curr_city, order.city_list))">yes</button>
            <button @click="deliverOrder(order.package_tracking_id)" class="btn btn-primary" v-if="['Now deliver'].includes(getStatusMessage(order.package_tracking_status, order.curr_city, order.city_list))">deliver</button>
          </td>
          <td v-else>
            <span v-if="order.package_tracking_status === 'cancel'">Cancelled</span>
            <span v-else-if="order.package_tracking_status === 'delivered'">Delivered</span>
          </td>
          
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="error" class="alert alert-danger">{{ error }}</div>
    </div>
  </div>
`,

    data() {
        return {
            successMessage: '',
            errorMessage: '',
            loading: true,
            orders: [],
            error: null,
            buttonLabel: 'Forward',

        };
    },
    methods:{
      getStatusMessage(status, currCity, cityList) {
        cityList = cityList.split(',')
        if (status === 'received' && currCity === cityList[0]) {
          return 'Now transit from origin';
        } else if (status === 'in transit' && currCity === cityList[cityList.length - 1]) {
          return 'Now deliver';
        }else if (status === 'in transit' && currCity === cityList[0]) {
            return 'Received and forwarded to the next location';
        } else if (status === 'received'&& currCity !== cityList[0]) {
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
    
      getPrevCityMessage(status, currCity, cityList,previous_received_city) {
        cityList = cityList.split(',')
        if (previous_received_city === ''){
        if (status === 'received' && currCity === cityList[0]) {
          return 'this is the origin';
        } else if (status === 'in transit' && currCity === cityList[cityList.length - 1]) {
          return cityList[-2];
        }else if (status === 'in transit' && currCity === cityList[0]) {
            return cityList[0];
        } else if (status === 'received' && currCity !== cityList[0]) {
          return 'not transitted yet';}


      }else {
        return previous_received_city;
      }

      },
    
    // Function to fetch the couriers by manager id
    async fetchOrdersByLocation() {
      try {
        const response = await fetch('/api/orders_by_location', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        this.orders = data;
        this.loading = false;
      } catch (error) {
        console.error(error);
        this.error = 'An error occurred while fetching data.';
        this.loading = false;
      }
    },
    // Function to transit the courier
    async transitOrder(trackingId) {
      try {
        const response = await fetch(`/transit_order/${trackingId}`, {
          method: 'POST',
        });
        if (response.status === 201) {
          this.fetchOrdersByLocation();
          this.successMessage = 'Order is now in transit';
          this.errorMessage = null;
        } else {
          throw new Error('Error: Could not update the order status');
        }
      } catch (error) {
        console.error(error);
        this.errorMessage = 'Could not update the order status';
        this.successMessage = null;
      }
    },
    // Function to deliver the courier
    async deliverOrder(trackingId) {
      try {
        const response = await fetch(`/deliver_order/${trackingId}`, {
          method: 'POST',
        });
        if (response.status === 201) {
          this.fetchOrdersByLocation();
          this.successMessage = 'Order has been delivered';
          this.errorMessage = null;
        } else {
          throw new Error('Error: Could not update the order status');
        }
      } catch (error) {
        console.error(error);
        this.errorMessage = 'Could not update the order status';
        this.successMessage = null;
      }
    },


    // Function to clear success and error messages
    clearMessages() {
      this.successMessage = null;
      this.errorMessage = null;
    },
  },
  mounted() {
    // Fetch orders when the component is mounted
    this.fetchOrdersByLocation();
  },
};

export default Manager_Dashboard;