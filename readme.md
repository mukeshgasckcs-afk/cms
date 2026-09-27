# 📦 Courier Management System (JavaScript / Netlify Edition)

A modern, full-featured **Courier & Logistics Management Single Page Application (SPA)** built with **JavaScript, Vue.js 3, and Bootstrap 5**, fully optimized for **instant zero-configuration deployment on [Netlify](https://www.netlify.com/)**.

> ⚡ **Migrated from Python/Flask to 100% JavaScript**: The application no longer requires Python runtimes, Flask servers, or local SQLite database installations. All backend routing, distance optimization, dynamic SVG analytics, and database operations run client-side with persistent `localStorage`.

---

## 🚀 How to Deploy on Netlify

### Option 1: Instant Drag & Drop (Easiest)
1. Go to **[Netlify Drop](https://app.netlify.com/drop)** in your web browser.
2. Sign in with your Netlify account.
3. Simply drag and drop the entire project folder (`Courier-Management-System-main`) onto the page.
4. Netlify will deploy your site in less than 10 seconds!

### Option 2: Deploy via Git (GitHub / GitLab / Bitbucket)
1. Push this repository to GitHub.
2. Log in to your **[Netlify Dashboard](https://app.netlify.com/)** and click **"Add new site" &rarr; "Import an existing project"**.
3. Select your repository.
4. Set the build settings:
   - **Build command**: *(leave blank)*
   - **Publish directory**: `.` *(current directory / root)*
5. Click **"Deploy site"**!

The repository already includes `netlify.toml` and `_redirects` to ensure Vue Router HTML5 history mode routes work smoothly without 404 errors on page refresh.

---

## 🔑 Default Demo Accounts

All demo accounts use the default password: **`password123`**

| Role | Username | Password | Access / Features |
| :--- | :--- | :--- | :--- |
| 🛡️ **Admin** | `admin` | `password123` | Hub Locations CRUD, Manager Applications Approval, Analytics Summary |
| 🚚 **Manager** | `manager_chennai` | `password123` | Chennai Hub Dashboard, Transit/Deliver Parcels, Export Revenue CSV |
| 🚚 **Manager** | `manager_trichy` | `password123` | Trichy Hub Dashboard, Transit/Deliver Parcels, Export Revenue CSV |
| 🚚 **Manager** | `manager_kumbakonam` | `password123` | Kumbakonam Hub Dashboard, Transit/Deliver Parcels |
| 🚚 **Manager** | `manager_rameswaram` | `password123` | Rameswaram Hub Dashboard, Transit/Deliver Parcels |
| 🚚 **Manager** | `manager_karaikal` | `password123` | Karaikal Hub Dashboard, Transit/Deliver Parcels |
| 👤 **Regular User** | `shib` | `password123` | New Courier Booking, Cart & Distance Price, Live Route Tracking, Profile |

*(You can also register a new account on the Register page. To request a manager role, prefix your username with `manager_`.)*

---

## 🛠️ Architecture & Tech Stack

- **Frontend**: Vue.js 3 (ES Modules), Vue Router 4 (Web History Mode), Bootstrap 5.3, Bootstrap Icons.
- **Data Engine (`js/db.js`)**: Browser-based database engine utilizing `localStorage` with pre-seeded data for users, hubs, orders, and tracking history.
- **Routing & Distance Engine (`js/location.js`)**:
  - Earth surface distance calculation using the **Haversine formula**.
  - Permutation-based shortest route optimization across intermediate logistics hubs.
  - Dimension, weight, and delivery preference pricing model.
- **Analytics Engine (`js/charts.js`)**: Real-time client-side SVG bar graph generator (replaces Python Pygal).
- **API Simulation Layer (`js/api.js`)**: Global `window.fetch` interceptor managing RESTful endpoints (`/api/...`), session states, and CSV blob downloads.

---

## 📁 Project Structure

```text
├── index.html            # Main HTML5 entry point for Netlify
├── netlify.toml          # Netlify configuration (publish directory & redirect rules)
├── _redirects            # SPA fallback rule (/* -> /index.html 200)
├── package.json          # Project metadata and local preview scripts
├── js/
│   ├── main.js           # Vue 3 root application initialization & navbar reactivity
│   ├── router.js         # Vue Router route configuration and route guards
│   ├── db.js             # LocalStorage database schema, seed data & CRUD helpers
│   ├── api.js            # Intercepts REST API calls and manages mock server responses
│   ├── location.js       # Haversine distance, shortest path permutations & pricing
│   ├── charts.js         # Dynamic SVG chart generator for analytics
│   └── components/
│       ├── login.js              # User authentication & demo credential helpers
│       ├── register.js           # Account creation
│       ├── PasswordRecovery.js   # User verification & password reset
│       ├── home.js               # Multi-step courier booking wizard
│       ├── cart.js               # Cart items, dimension editing & checkout
│       ├── profile.js            # Order history, live tracking & manager request
│       ├── admin_dashboard.js    # Hub location management (Add/Edit/Delete)
│       ├── admin_management.js   # Approve / Reject prospective hub managers
│       ├── manager_dashboard.js  # Hub parcel transit & delivery management
│       └── summary.js            # Analytics distribution graphs
└── screenshots/          # Application screenshot previews
```

---

## 💻 Local Testing (Optional)

You can view the project locally using any static web server:

```bash
# Using npx (Node.js)
npx serve .

# Or using Python's built-in static server (if installed)
python -m http.server 8080
```
Open `http://localhost:3000` (or `http://localhost:8080`) in your browser.

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
