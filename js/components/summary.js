import { generateAllCharts } from '../charts.js';
import { db } from '../db.js';

const Summary = {
  template: `
    <div class="container mt-4">
      <div class="row justify-content-between align-items-center mb-4">
        <div class="col-md-6">
          <h2 class="fw-bold text-danger">Analytics & Performance Summary</h2>
          <p class="text-muted mb-0">Live graphical visualizations of users, orders, and courier logistics</p>
        </div>
        <div class="col-md-6 text-end">
          <router-link to="/admin_dashboard" class="btn btn-outline-danger me-2">Hub Locations</router-link>
          <button @click="loadGraphs" class="btn btn-danger">Refresh Analytics</button>
        </div>
      </div>

      <div class="row g-4">
        <div class="col-md-6" v-for="graph in graphs" :key="graph.title">
          <div class="card shadow-sm border-0 h-100">
            <div class="card-header bg-white py-3 border-bottom">
              <h5 class="fw-bold mb-0 text-dark">{{ graph.title }}</h5>
            </div>
            <div class="card-body p-3 d-flex align-items-center justify-content-center" style="min-height: 400px;">
              <div v-if="graph.svg" v-html="graph.svg" class="w-100 h-100"></div>
              <div v-else class="text-muted">Loading chart...</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      graphs: [
        { title: 'User Role Distribution', svg: '' },
        { title: 'Request Status Distribution', svg: '' },
        { title: 'Number of Orders per User', svg: '' },
        { title: 'Courier Manager Distribution', svg: '' }
      ]
    };
  },
  methods: {
    loadGraphs() {
      // First, trigger API endpoint
      fetch('/api/generate_graphs')
        .then(() => {
          // Generate directly from current database state for instantaneous rendering
          const charts = generateAllCharts(db);
          this.graphs[0].svg = charts.userRoleSvg;
          this.graphs[1].svg = charts.requestStatusSvg;
          this.graphs[2].svg = charts.orderPerUserSvg;
          this.graphs[3].svg = charts.managerDistributionSvg;
        })
        .catch((err) => {
          console.error('Error generating graphs:', err);
        });
    }
  },
  mounted() {
    this.loadGraphs();
  }
};

export default Summary;
