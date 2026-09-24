const Admin_Dashboard = {
    template: `
        <div class="container mt-2">
            <div class="row justify-content-center">
                <div class="col-md-5 text-center"> 
                    <h2>Admin Dashboard</h2>
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



        <div>
        <div class="container mt-2">
        <div class="row justify-content-center">
            <div class="col-md-5 text-center"> 
                <h4>-----------Location table----------- </h4>
            </div>
        </div>
    </div>          
    <table class="table table-bordered border-primary">
    <thead>
      <tr>
        <th class="text-center">Location ID</th>
        <th class="text-center">City Name</th>
        <th class="text-center">District</th>
        <th class="text-center">State</th>
        <th class="text-center">Pincode</th>
        <th class="text-center">Actions</th>
      </tr>
    </thead>
    <tbody class="text-center font-weight-bold">
      <tr v-for="location in locations" :key="location.courier_manager_location_id">
        <td class="text-center font-weight-bold">{{ location.courier_manager_location_id }}</td>
        <td class="text-center">{{ location.courier_manager_city }}</td>
        <td class="text-center">{{ location.courier_manager_district }}</td>
        <td class="text-center">{{ location.courier_manager_state }}</td>
        <td class="text-center">{{ location.courier_manager_pincode }}</td>
  
        <td>
          <!-- Edit button to open the location edit modal -->
          


          <!-- Button trigger modal for Edit location-->
          <button type="button" class="btn btn-primary" data-bs-toggle="modal" :data-bs-target="'#editlocationModal' + location.courier_manager_location_id" @click="openlocationEditModal(location.courier_manager_location_id)">Edit </button>

          <!-- Modal for Edit location -->
          <div class="modal fade" :id="'editlocationModal' + location.courier_manager_location_id" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="editLocationModalLabel" aria-hidden="true">

              <div class="modal-dialog">
                  <div class="modal-content">
                      <div class="modal-header">
                          <h1 class="modal-title fs-5" id="editLocationModalLabel">Edit Location</h1>
                          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                          <div class="modal-body">
                              <div class="row mb-3 ">
                                  <label for="editLocationCityname3" class="col-sm-3 col-form-label text-dark font-bold">City</label>
                                      <div class="col-sm-10 ">
                                          <input v-model ="newLocationCityname" type="text" class="form-control " id="editLocationCityname3" placeholder="City Name" >
                                      </div>
                              </div>

                              <div class="row mb-3 ">
                                  <label for="editLocationDistrictname3" class="col-sm-3 col-form-label text-dark font-bold">District</label>
                                      <div class="col-sm-10 ">
                                          <input v-model ="newLocationDistrictname"  type="text" class="form-control " id="editLocationDistrictname3" placeholder="District Name " >
                                      </div>
                              </div>

                              <div class="row mb-3 ">
                                  <label for="editLocationStatename3" class="col-sm-3 col-form-label text-dark font-bold">State</label>
                                      <div class="col-sm-10 ">
                                          <input v-model ="newLocationStatename"  type="text" class="form-control " id="editLocationStatename3" placeholder="State Name" >
                                      </div>
                              </div>

                              <div class="row mb-3 ">
                                  <label for="editLocationPincode3" class="col-sm-3 col-form-label text-dark font-bold">Pincode</label>
                                      <div class="col-sm-10 ">
                                          <input v-model ="newLocationPincode"  type="number" class="form-control " id="editLocationPincode3" placeholder="Pincode" >
                                      </div>
                              </div>
                          </div>      

                          <div class="modal-footer">
                              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                              <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="updateLocation(editlocationId,newLocationCityname, newLocationDistrictname,newLocationStatename,newLocationPincode)" >Submit</button>
                          </div>
                  </div>
              </div>
          </div>
          





          <!-- Button trigger modal for Delete Location-->
          <button type="button" class="btn btn-danger" data-bs-toggle="modal" :data-bs-target="'#deleteLocationModal' + location.courier_manager_location_id" @click="openlocationDeleteModal(location.courier_manager_location_id)">Delete</button>

          <!-- Modal for Delete Location -->
          <div class="modal fade" :id="'deleteLocationModal' + location.courier_manager_location_id" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="deleteLocationModalLabel" aria-hidden="true">

              <div class="modal-dialog">
                  <div class="modal-content">
                      <div class="modal-header">
                          <h1 class="modal-title fs-5" id="deleteLocationModalLabel">Delete Location</h1>
                          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <div class="modal-body">
                              <p> Are you sure you want to delete this Location ?</p>
                      </div>
                      <div class="modal-footer">
                          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                          <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="deleteLocation(deleteLocationId)" >Yes</button>
                      </div>
                  </div>
              </div>
          </div>

        </td>
      </tr>
    </tbody>
  </table>




                        
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,

    data() {
        return {
            locations: [],
            editlocationId : null,
            newLocationCityname: '',
            newLocationDistrictname: '',
            newLocationStatename: '',
            newLocationPincode: null,
            deleteLocationId: null,

        };
    },
    methods: {
        // Fetch all lcations 
        loadlocations() {
            fetch('/api/locations')
              .then((response) => response.json())
              .then((data) => {
                this.locations = data;
                console.log("All locations:", data);
              })
              .catch((error) => {
                console.error('Error fetching locations:', error);
                this.errorMessage = 'Error fetching locations.';
              });
          },
       // Function to delete a location
       openlocationDeleteModal(locationId) {
        this.deleteLocationId = locationId; 
    },
    deleteLocation(locationId) {
        if (!locationId) {
            console.error("locationId is not set or is invalid");
            return;
        }
        fetch(`/api/locations/${locationId}`, {
            method: 'DELETE',
        })
            .then((response) => {
                if (response.status === 200) {
                    console.log("Deleted location with ID:", locationId);
                    this.successMessage = 'location deleted successfully.';
                    this.errorMessage = ''; 
                    this.loadlocations(); 
                } else if (response.status === 404) {
                    this.errorMessage = 'Location not found.';
                    this.successMessage = ''; 
                } else {
                    this.errorMessage = 'Failed to delete Location.';
                    this.successMessage = ''; 
                }
            })
            .catch((error) => {
                this.errorMessage = 'Network error occurred.';
                this.successMessage = ''; 
            });
    },

    // Function to edit a location
    openlocationEditModal(locationId) {
        this.editlocationId = locationId; 
    },
    updateLocation(locationId,newLocationCityname, newLocationDistrictname,newLocationStatename,newLocationPincode) {
        fetch(`/api/locations/${locationId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                courier_manager_city: newLocationCityname,
                courier_manager_district: newLocationDistrictname,
                courier_manager_state: newLocationStatename,
                courier_manager_pincode:newLocationPincode
            }),
        })
            .then((response) => {
                if (response.status === 200) {
                    console.log("Edited location with ID:", locationId);
                    this.loadlocations(); 
                    this.successMessage = "Location updated successfully.";
                } else if (response.status === 400) {
                    this.errorMessage = "Location name is required.";
                } else if (response.status === 404) {
                    this.errorMessage = "Location not found.";
                } else {
                    this.errorMessage = "Failed to update Location.";
                }
            })
            .catch((error) => {
                this.errorMessage = "Network error occurred.";
            });
    },

        },

    mounted() {
        this.loadlocations();
        
    },
};

export default Admin_Dashboard;
