// Dynamic SVG Chart Generator
// Replaces Python Pygal (summary.py) with client-side SVG generation

/**
 * Generates an SVG bar chart string with Pygal-like styling.
 * @param {string} title Chart Title
 * @param {string[]} labels X-axis category labels
 * @param {number[]} values Numerical data values
 * @param {string} xTitle X-axis label
 * @param {string} yTitle Y-axis label
 * @returns {string} SVG markup string
 */
export function generateBarChartSvg(title, labels, values, xTitle, yTitle) {
  const width = 800;
  const height = 600;
  const margin = { top: 70, right: 40, bottom: 90, left: 90 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;

  const maxVal = Math.max(1, ...values);
  // Round up max for clean y-axis scale
  const yMax = Math.ceil(maxVal * 1.25);
  const numGridLines = 5;

  // Colors for bars
  const barColors = [
    '#3b82f6',
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#8b5cf6',
    '#ec4899',
    '#06b6d4',
    '#6366f1'
  ];

  // Grid lines and Y labels
  let gridLinesSvg = '';
  for (let i = 0; i <= numGridLines; i++) {
    const val = (yMax / numGridLines) * i;
    const yPos = margin.top + plotHeight - (plotHeight / numGridLines) * i;
    const formattedVal = Number.isInteger(val) ? val : val.toFixed(1);

    gridLinesSvg += `
      <line x1="${margin.left}" y1="${yPos}" x2="${margin.left + plotWidth}" y2="${yPos}" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="4,4" />
      <text x="${margin.left - 12}" y="${yPos + 4}" font-size="12" fill="#64748b" text-anchor="end" font-family="system-ui, sans-serif">${formattedVal}</text>
    `;
  }

  // Bars and X labels
  const barGapRatio = 0.35;
  const slotWidth = labels.length > 0 ? plotWidth / labels.length : plotWidth;
  const barWidth = Math.max(12, slotWidth * (1 - barGapRatio));
  const barOffset = (slotWidth - barWidth) / 2;

  let barsSvg = '';
  let xLabelsSvg = '';

  labels.forEach((label, idx) => {
    const val = values[idx] || 0;
    const barHeight = (val / yMax) * plotHeight;
    const x = margin.left + idx * slotWidth + barOffset;
    const y = margin.top + plotHeight - barHeight;
    const color = barColors[idx % barColors.length];

    barsSvg += `
      <g class="bar-group">
        <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" fill="${color}" rx="4" ry="4" opacity="0.88">
          <title>${label}: ${val}</title>
        </rect>
        <text x="${x + barWidth / 2}" y="${Math.max(margin.top + 16, y - 8)}" font-size="13" font-weight="bold" fill="#334155" text-anchor="middle" font-family="system-ui, sans-serif">
          ${val}
        </text>
      </g>
    `;

    // Rotate label if long or many items
    const shouldRotate = labels.length > 4 || label.length > 10;
    const labelX = margin.left + idx * slotWidth + slotWidth / 2;
    const labelY = margin.top + plotHeight + (shouldRotate ? 24 : 22);
    const transform = shouldRotate ? `transform="rotate(-25 ${labelX} ${labelY})"` : '';

    xLabelsSvg += `
      <text x="${labelX}" y="${labelY}" font-size="12" fill="#475569" text-anchor="${shouldRotate ? 'end' : 'middle'}" font-family="system-ui, sans-serif" ${transform}>
        ${label}
      </text>
    `;
  });

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" height="100%" style="background-color: #ffffff; border-radius: 8px;">
      <defs>
        <style>
          .bar-group rect { transition: all 0.2s ease; cursor: pointer; }
          .bar-group:hover rect { opacity: 1; transform: scaleY(1.02); transform-origin: bottom; }
        </style>
      </defs>
      
      <!-- Chart Title -->
      <text x="${width / 2}" y="38" font-size="20" font-weight="600" fill="#1e293b" text-anchor="middle" font-family="system-ui, sans-serif">
        ${title}
      </text>

      <!-- Plot Area Background -->
      <rect x="${margin.left}" y="${margin.top}" width="${plotWidth}" height="${plotHeight}" fill="#f8fafc" rx="4" />

      <!-- Grid lines -->
      ${gridLinesSvg}

      <!-- Axes Lines -->
      <line x1="${margin.left}" y1="${margin.top}" x2="${margin.left}" y2="${margin.top + plotHeight}" stroke="#94a3b8" stroke-width="1.5" />
      <line x1="${margin.left}" y1="${margin.top + plotHeight}" x2="${margin.left + plotWidth}" y2="${margin.top + plotHeight}" stroke="#94a3b8" stroke-width="1.5" />

      <!-- Bars -->
      ${barsSvg}

      <!-- X-axis Labels -->
      ${xLabelsSvg}

      <!-- Axis Titles -->
      <text x="${margin.left + plotWidth / 2}" y="${height - 15}" font-size="13" font-weight="600" fill="#64748b" text-anchor="middle" font-family="system-ui, sans-serif">
        ${xTitle || ''}
      </text>
      
      <text x="24" y="${margin.top + plotHeight / 2}" font-size="13" font-weight="600" fill="#64748b" text-anchor="middle" transform="rotate(-90 24 ${margin.top + plotHeight / 2})" font-family="system-ui, sans-serif">
        ${yTitle || ''}
      </text>
    </svg>
  `.trim();
}

/**
 * Builds all 4 system distribution graphs directly from database state.
 * @param {import('./db.js').Database} database
 * @returns {Record<string, string>} Mapping of graph keys to SVG strings
 */
export function generateAllCharts(database) {
  const users = database.getUsers();
  const requests = database.getRequests();
  const managers = database.getLocations();
  const orders = database.getOrders();

  // 1. User Role Distribution
  const roles = ['admin', 'manager', 'regular user'];
  const userCounts = roles.map((role) => users.filter((u) => u.role === role).length);
  const userRoleSvg = generateBarChartSvg(
    'User Role Distribution',
    roles,
    userCounts,
    'User Role',
    'Number of Users'
  );

  // 2. Request Status Distribution
  const statuses = ['pending', 'approved', 'rejected'];
  const requestCounts = statuses.map((status) => requests.filter((r) => r.status === status).length);
  const requestStatusSvg = generateBarChartSvg(
    'Request Status Distribution',
    statuses,
    requestCounts,
    'Request Status',
    'Number of Requests'
  );

  // 3. Orders Per User Distribution
  const userNames = [...new Set(users.map((u) => u.name))];
  const orderCounts = userNames.map((name) => orders.filter((o) => o.sender_name === name || o.user_id === users.find(u => u.name === name)?.id).length);
  const orderPerUserSvg = generateBarChartSvg(
    'Number of Orders per User',
    userNames,
    orderCounts,
    'User',
    'Number of Orders'
  );

  // 4. Courier Manager Location Distribution
  const cities = [...new Set(managers.map((m) => m.courier_manager_city))];
  const managerCounts = cities.map((city) => managers.filter((m) => m.courier_manager_city === city).length);
  const managerDistributionSvg = generateBarChartSvg(
    'Courier Manager Distribution',
    cities,
    managerCounts,
    'Location',
    'Number of Managers'
  );

  return {
    userRoleSvg,
    requestStatusSvg,
    orderPerUserSvg,
    managerDistributionSvg
  };
}
