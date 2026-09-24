const Admin_Management = {
    template: `
                <div class="container mt-2">
                <div class="row justify-content-center">
                    <div class="col-md-5 text-center"> 
                        <h2>Admin Management</h2>
                    </div>
                </div>
            </div>


            <div>
            <div class="container mt-2">
            <div class="row justify-content-center">
                <div class="col-md-5 text-center"> 
                    <h4>-----------Request table----------- </h4>
                </div>
            </div>
        </div>          
        <table class="table table-bordered border-primary">
        <thead>
          <tr>
            <th class="text-center">Request ID</th>
            <th class="text-center">User ID</th>
            <th class="text-center">Name</th>
            <th class="text-center">Username</th>
            <th class="text-center">Email</th>
            <th class="text-center">Role</th>
            <th class="text-center">Courier Manager Number</th>
            <th class="text-center">Address</th>
            <th class="text-center">City Name</th>
            <th class="text-center">District</th>
            <th class="text-center">State</th>
            <th class="text-center">Pincode</th>
            <th class="text-center">Action</th>
            <th class="text-center">Status</th>
            <th class="text-center">Actions</th>
          </tr>
        </thead>
        <tbody class="text-center font-weight-bold">
          <tr v-for="request in requests" :key="request.request_id">
            <td class="text-center font-weight-bold">{{ request.request_id }}</td>
            <td class="text-center">{{ request.user_id }}</td>
            <td class="text-center">{{ request.name }}</td>
            <td class="text-center">{{ request.username }}</td>
            <td class="text-center">{{ request.email }}</td>
            <td class="text-center">{{ request.role }}</td>
            <td class="text-center">{{ request.courier_manager_number }}</td>
            <td class="text-center">{{ request.courier_manager_address }}</td>
            <td class="text-center">{{ request.courier_manager_city }}</td>
            <td class="text-center">{{ request.courier_manager_district }}</td>
            <td class="text-center">{{ request.courier_manager_state }}</td>
            <td class="text-center">{{ request.courier_manager_pincode }}</td>

            <td class="text-center">{{ request.action }}</td>
            <td class="text-center">{{ request.status }}</td>
            <td>
              <button @click="approveRequest(request.request_id)" class="btn btn-success mr-2 text-center">Approve</button>
              <button @click="rejectRequest(request.request_id)" class="btn btn-danger text-center">Reject</button>
            </td>
          </tr>
        </tbody>
      </table>
      
          </div>
          
      
          
        <div>
        <div>
            <!-- Display success and error messages here -->
            <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>
            <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
        </div>
    </div>
    `
,
data() {
    return {
        requests: [], // Store requests 
        errorMessage: '', // Store error message 
        successMessage: '', // Store success message

    };
  },
  methods: {

    // Make a Fetch API request to fetch requests
    loadRequests() {
      fetch('/api/requests')
        .then((response) => response.json())
        .then((data) => {
          this.requests = data;
          console.log("All Requests:", data);
        })
        .catch((error) => {
          console.error('Error fetching requests:', error);
          this.errorMessage = 'Error fetching requests.';
        });
    },

    // Make a Fetch API request to approve the request
    approveRequest(requestId) {
      fetch(`/api/request/approve/${requestId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'approve' }),
      })
        .then((response) => {
          if (response.ok) {
            this.successMessage = 'Request approved successfully.';
            this.loadRequests();
          } else {
            this.errorMessage = 'Error approving request.';
          }
        })
        .catch((error) => {
          console.error('Error approving request:', error);
          this.errorMessage = 'Error approving request.';
        });
    },

    // Make a Fetch API request to reject the request
    rejectRequest(requestId) {
      fetch(`/api/request/reject/${requestId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'reject' }),
      })
        .then((response) => {
          if (response.ok) {
            this.successMessage = 'Request rejected successfully.';
            this.loadRequests();
          } else {
            this.errorMessage = 'Error rejecting request.';
          }
        })
        .catch((error) => {
          console.error('Error rejecting request:', error);
          this.errorMessage = 'Error rejecting request.';
        });
    },

},
mounted() {
    this.loadRequests();

},
};


export default Admin_Management;