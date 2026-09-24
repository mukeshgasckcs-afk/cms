const Summary = {
    template: `
    <div class="container mt-2">
    <div class="row">
      <div class="col-md-6" v-for="(graph, index) in graphs" :key="index">
        <div class="graph-box p-2 border border-success mb-4 mt-4">
          <object :data="graph.src" type="image/svg+xml" class="img-fluid" @error="retryLoad(graph)"></object>
          </div>
      </div>
    </div>
  </div>

`,
  data() {
    return {
      graphs: [
        {
          title: 'User Role Distribution',
          src: 'static/summary/user_role_distribution.svg',
        },
        {
          title: 'Request Status Distribution',
          src: 'static/summary/request_status_distribution.svg',
        },
        {
          title: 'Order  Per User Distribution',
          src: 'static/summary/order_per_user_distribution.svg',
        },
        {
          title: 'Courier Manager Distribution',
          src: 'static/summary/courier_manager_distribution.svg',
        },
 
      ],
    };
  },
      methods: {
        retryLoad(graph) {
          // Implement retry logic here
          console.log(`Retrying to load: ${graph.src}`);
          const timestamp = new Date().getTime();
          graph.src = `${graph.src}?t=${timestamp}`;
        },
        onLoad(graph) {
          console.log(`Loaded: ${graph.src}`);
        },
      },
      mounted() {
        // Fetch the graphs from the Flask API
        fetch('/api/generate_graphs', {
          method: 'GET',
        })
          .then((response) => {
            if (response.status === 200) {
              console.log('Graphs generated successfully');
            } else {
              console.error('Error generating graphs');
            }
          })
          .catch((error) => {
            console.error('Error:', error);
          });
      },
    };

export default Summary;
