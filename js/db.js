// Browser-based persistent database engine using localStorage
// Replaces SQLite todos.db for Netlify deployment

const STORAGE_KEY = 'cms_database_v1';
const SESSION_KEY = 'cms_current_user_v1';

const INITIAL_DATA = {
  users: [
    {
      id: 1,
      name: 'System Administrator',
      username: 'admin',
      email: 'admin@courier.com',
      password: 'password123',
      role: 'admin'
    },
    {
      id: 2,
      name: 'Chennai Manager',
      username: 'manager_chennai',
      email: 'manager.chennai@courier.com',
      password: 'password123',
      role: 'manager'
    },
    {
      id: 3,
      name: 'Trichy Manager',
      username: 'manager_trichy',
      email: 'manager.trichy@courier.com',
      password: 'password123',
      role: 'manager'
    },
    {
      id: 4,
      name: 'Kumbakonam Manager',
      username: 'manager_kumbakonam',
      email: 'manager.kumbakonam@courier.com',
      password: 'password123',
      role: 'manager'
    },
    {
      id: 5,
      name: 'Rameswaram Manager',
      username: 'manager_rameswaram',
      email: 'manager.rameswaram@courier.com',
      password: 'password123',
      role: 'manager'
    },
    {
      id: 6,
      name: 'Karaikal Manager',
      username: 'manager_karaikal',
      email: 'manager.karaikal@courier.com',
      password: 'password123',
      role: 'manager'
    },
    {
      id: 7,
      name: 'Shib Kumar Saraf',
      username: 'shib',
      email: 'shibkumarsaraf05@gmail.com',
      password: 'password123',
      role: 'regular user'
    }
  ],
  courier_managers: [
    {
      courier_manager_location_id: 1,
      courier_manager_id: 2,
      courier_manager_name: 'Chennai Manager',
      courier_manager_username: 'manager_chennai',
      courier_manager_email: 'manager.chennai@courier.com',
      courier_manager_number: 9876543210,
      courier_manager_address: '12 Anna Salai, Mount Road',
      courier_manager_city: 'Chennai',
      courier_manager_district: 'Chennai',
      courier_manager_state: 'Tamil Nadu',
      courier_manager_pincode: 600001,
      courier_manager_latitude: 13.0827,
      courier_manager_longitude: 80.2707
    },
    {
      courier_manager_location_id: 2,
      courier_manager_id: 3,
      courier_manager_name: 'Trichy Manager',
      courier_manager_username: 'manager_trichy',
      courier_manager_email: 'manager.trichy@courier.com',
      courier_manager_number: 9876543211,
      courier_manager_address: '45 Cantonment Road',
      courier_manager_city: 'Trichy',
      courier_manager_district: 'Tiruchirappalli',
      courier_manager_state: 'Tamil Nadu',
      courier_manager_pincode: 620001,
      courier_manager_latitude: 10.7905,
      courier_manager_longitude: 78.7047
    },
    {
      courier_manager_location_id: 3,
      courier_manager_id: 4,
      courier_manager_name: 'Kumbakonam Manager',
      courier_manager_username: 'manager_kumbakonam',
      courier_manager_email: 'manager.kumbakonam@courier.com',
      courier_manager_number: 9876543212,
      courier_manager_address: '88 Gandhi Road',
      courier_manager_city: 'Kumbakonam',
      courier_manager_district: 'Thanjavur',
      courier_manager_state: 'Tamil Nadu',
      courier_manager_pincode: 612001,
      courier_manager_latitude: 10.9601,
      courier_manager_longitude: 79.3845
    },
    {
      courier_manager_location_id: 4,
      courier_manager_id: 5,
      courier_manager_name: 'Rameswaram Manager',
      courier_manager_username: 'manager_rameswaram',
      courier_manager_email: 'manager.rameswaram@courier.com',
      courier_manager_number: 9876543213,
      courier_manager_address: '5 Beach Road',
      courier_manager_city: 'Rameswaram',
      courier_manager_district: 'Ramanathapuram',
      courier_manager_state: 'Tamil Nadu',
      courier_manager_pincode: 623526,
      courier_manager_latitude: 9.2876,
      courier_manager_longitude: 79.3129
    },
    {
      courier_manager_location_id: 5,
      courier_manager_id: 6,
      courier_manager_name: 'Karaikal Manager',
      courier_manager_username: 'manager_karaikal',
      courier_manager_email: 'manager.karaikal@courier.com',
      courier_manager_number: 9876543214,
      courier_manager_address: '19 Church Street',
      courier_manager_city: 'Karaikal',
      courier_manager_district: 'Karaikal',
      courier_manager_state: 'Puducherry',
      courier_manager_pincode: 609602,
      courier_manager_latitude: 10.9254,
      courier_manager_longitude: 79.8380
    }
  ],
  requests: [
    {
      request_id: 1,
      courier_manager_id: 2,
      courier_manager_number: 9876543210,
      courier_manager_address: '12 Anna Salai, Mount Road',
      courier_manager_city: 'Chennai',
      courier_manager_district: 'Chennai',
      courier_manager_state: 'Tamil Nadu',
      courier_manager_pincode: 600001,
      courier_manager_latitude: 13.0827,
      courier_manager_longitude: 80.2707,
      action: 'add_location',
      status: 'approved'
    },
    {
      request_id: 2,
      courier_manager_id: 3,
      courier_manager_number: 9876543211,
      courier_manager_address: '45 Cantonment Road',
      courier_manager_city: 'Trichy',
      courier_manager_district: 'Tiruchirappalli',
      courier_manager_state: 'Tamil Nadu',
      courier_manager_pincode: 620001,
      courier_manager_latitude: 10.7905,
      courier_manager_longitude: 78.7047,
      action: 'add_location',
      status: 'approved'
    },
    {
      request_id: 3,
      courier_manager_id: 4,
      courier_manager_number: 9876543212,
      courier_manager_address: '88 Gandhi Road',
      courier_manager_city: 'Kumbakonam',
      courier_manager_district: 'Thanjavur',
      courier_manager_state: 'Tamil Nadu',
      courier_manager_pincode: 612001,
      courier_manager_latitude: 10.9601,
      courier_manager_longitude: 79.3845,
      action: 'add_location',
      status: 'approved'
    },
    {
      request_id: 4,
      courier_manager_id: 5,
      courier_manager_number: 9876543213,
      courier_manager_address: '5 Beach Road',
      courier_manager_city: 'Rameswaram',
      courier_manager_district: 'Ramanathapuram',
      courier_manager_state: 'Tamil Nadu',
      courier_manager_pincode: 623526,
      courier_manager_latitude: 9.2876,
      courier_manager_longitude: 79.3129,
      action: 'add_location',
      status: 'approved'
    },
    {
      request_id: 5,
      courier_manager_id: 6,
      courier_manager_number: 9876543214,
      courier_manager_address: '19 Church Street',
      courier_manager_city: 'Karaikal',
      courier_manager_district: 'Karaikal',
      courier_manager_state: 'Puducherry',
      courier_manager_pincode: 609602,
      courier_manager_latitude: 10.9254,
      courier_manager_longitude: 79.8380,
      action: 'add_location',
      status: 'approved'
    },
    {
      request_id: 6,
      courier_manager_id: 7,
      courier_manager_number: 9876543220,
      courier_manager_address: '100 Cross Cut Road',
      courier_manager_city: 'Coimbatore',
      courier_manager_district: 'Coimbatore',
      courier_manager_state: 'Tamil Nadu',
      courier_manager_pincode: 641012,
      courier_manager_latitude: 11.0168,
      courier_manager_longitude: 76.9558,
      action: 'add_location',
      status: 'pending'
    }
  ],
  carts: [
    {
      cart_id: 1,
      user_id: 7,
      created_at: new Date().toISOString()
    }
  ],
  cart_items: [],
  orders: [
    {
      order_id: '101',
      user_id: 7,
      sender_name: 'Shib Kumar Saraf',
      sender_number: 9876543215,
      sender_email: 'shibkumarsaraf05@gmail.com',
      sender_address: '10 Park Avenue',
      sender_city: 'Chennai',
      sender_district: 'Chennai',
      sender_state: 'Tamil Nadu',
      sender_pincode: 600001,
      sender_latitude: 13.0827,
      sender_longitude: 80.2707,
      recipient_name: 'Vignesh',
      recipient_number: 9876543216,
      recipient_email: 'vignesh@example.com',
      recipient_address: '22 South Street',
      recipient_city: 'Trichy',
      recipient_district: 'Tiruchirappalli',
      recipient_state: 'Tamil Nadu',
      recipient_pincode: 620001,
      recipient_latitude: 10.7905,
      recipient_longitude: 78.7047,
      package_number: 1,
      package_details: 'Urgent Documents',
      weight: 150,
      height: 10,
      width: 15,
      delivery_preferences: 'premium',
      total_price: 25.5,
      created_at: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      order_id: '102',
      user_id: 7,
      sender_name: 'Shib Kumar Saraf',
      sender_number: 9876543215,
      sender_email: 'shibkumarsaraf05@gmail.com',
      sender_address: '10 Park Avenue',
      sender_city: 'Trichy',
      sender_district: 'Tiruchirappalli',
      sender_state: 'Tamil Nadu',
      sender_pincode: 620001,
      sender_latitude: 10.7905,
      sender_longitude: 78.7047,
      recipient_name: 'Ananya',
      recipient_number: 9876543217,
      recipient_email: 'ananya@example.com',
      recipient_address: '54 East Car Street',
      recipient_city: 'Rameswaram',
      recipient_district: 'Ramanathapuram',
      recipient_state: 'Tamil Nadu',
      recipient_pincode: 623526,
      recipient_latitude: 9.2876,
      recipient_longitude: 79.3129,
      package_number: 2,
      package_details: 'Gift Package Box',
      weight: 500,
      height: 20,
      width: 20,
      delivery_preferences: 'standard',
      total_price: 45.0,
      created_at: new Date(Date.now() - 86400000).toISOString()
    }
  ],
  package_tracking: [
    {
      package_tracking_id: 1,
      user_id: 7,
      order_id: '101',
      timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
      city_list: 'Chennai,Trichy',
      current_location_id: 1,
      package_tracking_status: 'in transit'
    },
    {
      package_tracking_id: 2,
      user_id: 7,
      order_id: '101',
      timestamp: new Date(Date.now() - 86400000 * 1.5).toISOString(),
      city_list: 'Chennai,Trichy',
      current_location_id: 2,
      package_tracking_status: 'received'
    },
    {
      package_tracking_id: 3,
      user_id: 7,
      order_id: '102',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      city_list: 'Trichy,Rameswaram',
      current_location_id: 2,
      package_tracking_status: 'received'
    }
  ]
};

// Database state management
class Database {
  constructor() {
    this.data = this.load();
  }

  load() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Could not read from localStorage, using default data:', e);
    }
    const cloned = JSON.parse(JSON.stringify(INITIAL_DATA));
    this.save(cloned);
    return cloned;
  }

  save(dataToSave) {
    if (dataToSave) this.data = dataToSave;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }

  reset() {
    const fresh = JSON.parse(JSON.stringify(INITIAL_DATA));
    this.save(fresh);
    return fresh;
  }

  // --- User Operations ---
  getUsers() {
    return this.data.users || [];
  }

  getUserById(id) {
    return this.getUsers().find((u) => u.id === Number(id));
  }

  getUserByUsername(username) {
    return this.getUsers().find((u) => u.username.toLowerCase() === (username || '').toLowerCase());
  }

  createUser(userData) {
    const users = this.getUsers();
    const newId = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
    const user = { id: newId, ...userData };
    users.push(user);
    this.save();
    return user;
  }

  updateUser(id, updates) {
    const user = this.getUserById(id);
    if (!user) return null;
    Object.assign(user, updates);
    this.save();
    return user;
  }

  // --- Session Operations ---
  getCurrentUser() {
    try {
      const stored = localStorage.getItem(SESSION_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Refresh with latest from database
        const dbUser = this.getUserById(parsed.id);
        return dbUser || parsed;
      }
    } catch (e) {
      console.warn('Error reading session:', e);
    }
    return null;
  }

  setCurrentUser(user) {
    if (!user) {
      localStorage.removeItem(SESSION_KEY);
    } else {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    }
  }

  clearCurrentUser() {
    localStorage.removeItem(SESSION_KEY);
  }

  // --- Location / Courier Manager Operations ---
  getLocations() {
    return this.data.courier_managers || [];
  }

  getLocationById(id) {
    return this.getLocations().find((l) => l.courier_manager_location_id === Number(id));
  }

  getLocationByCity(city) {
    if (!city) return null;
    return this.getLocations().find((l) => l.courier_manager_city.toLowerCase() === city.toLowerCase());
  }

  getLocationByManagerId(managerId) {
    return this.getLocations().find((l) => l.courier_manager_id === Number(managerId));
  }

  createLocation(locationData) {
    const locs = this.getLocations();
    const newId =
      locs.length > 0 ? Math.max(...locs.map((l) => l.courier_manager_location_id)) + 1 : 1;
    const loc = { courier_manager_location_id: newId, ...locationData };
    locs.push(loc);
    this.save();
    return loc;
  }

  updateLocation(id, updates) {
    const loc = this.getLocationById(id);
    if (!loc) return null;
    Object.assign(loc, updates);
    this.save();
    return loc;
  }

  deleteLocation(id) {
    const initialLen = this.data.courier_managers.length;
    this.data.courier_managers = this.data.courier_managers.filter(
      (l) => l.courier_manager_location_id !== Number(id)
    );
    this.save();
    return this.data.courier_managers.length < initialLen;
  }

  // --- Requests Operations ---
  getRequests() {
    return this.data.requests || [];
  }

  getRequestById(id) {
    return this.getRequests().find((r) => r.request_id === Number(id));
  }

  getRequestByManagerId(userId) {
    return this.getRequests().find((r) => r.courier_manager_id === Number(userId));
  }

  createRequest(requestData) {
    const reqs = this.getRequests();
    const newId = reqs.length > 0 ? Math.max(...reqs.map((r) => r.request_id)) + 1 : 1;
    const req = { request_id: newId, ...requestData };
    reqs.push(req);
    this.save();
    return req;
  }

  updateRequest(id, updates) {
    const req = this.getRequestById(id);
    if (!req) return null;
    Object.assign(req, updates);
    this.save();
    return req;
  }

  // --- Cart Operations ---
  getCart(userId) {
    let cart = (this.data.carts || []).find((c) => c.user_id === Number(userId));
    if (!cart) {
      const carts = this.data.carts || [];
      const newId = carts.length > 0 ? Math.max(...carts.map((c) => c.cart_id)) + 1 : 1;
      cart = { cart_id: newId, user_id: Number(userId), created_at: new Date().toISOString() };
      carts.push(cart);
      this.data.carts = carts;
      this.save();
    }
    return cart;
  }

  getCartItems(cartId) {
    return (this.data.cart_items || []).filter((item) => item.cart_id === Number(cartId));
  }

  getCartItemById(itemId) {
    return (this.data.cart_items || []).find((item) => item.item_id === Number(itemId));
  }

  addCartItem(itemData) {
    const items = this.data.cart_items || [];
    const newId = items.length > 0 ? Math.max(...items.map((i) => i.item_id)) + 1 : 1;
    const item = { item_id: newId, ...itemData };
    items.push(item);
    this.data.cart_items = items;
    this.save();
    return item;
  }

  updateCartItem(itemId, updates) {
    const item = this.getCartItemById(itemId);
    if (!item) return null;
    Object.assign(item, updates);
    this.save();
    return item;
  }

  removeCartItem(itemId) {
    const initialLen = (this.data.cart_items || []).length;
    this.data.cart_items = (this.data.cart_items || []).filter(
      (item) => item.item_id !== Number(itemId)
    );
    this.save();
    return this.data.cart_items.length < initialLen;
  }

  clearUserCartItems(userId) {
    this.data.cart_items = (this.data.cart_items || []).filter(
      (item) => item.user_id !== Number(userId)
    );
    this.save();
  }

  // --- Order Operations ---
  getOrders(userId = null) {
    if (userId) {
      return (this.data.orders || []).filter((o) => o.user_id === Number(userId));
    }
    return this.data.orders || [];
  }

  getOrderById(id) {
    return (this.data.orders || []).find((o) => String(o.order_id) === String(id));
  }

  createOrder(orderData) {
    const orders = this.data.orders || [];
    orders.push(orderData);
    this.data.orders = orders;
    this.save();
    return orderData;
  }

  // --- Tracking Operations ---
  getTrackingRecords() {
    return this.data.package_tracking || [];
  }

  getTrackingByOrderId(orderId) {
    return this.getTrackingRecords().filter((t) => String(t.order_id) === String(orderId));
  }

  getTrackingById(trackingId) {
    return this.getTrackingRecords().find((t) => t.package_tracking_id === Number(trackingId));
  }

  getTrackingByLocationId(locationId) {
    return this.getTrackingRecords().filter(
      (t) => Number(t.current_location_id) === Number(locationId)
    );
  }

  createTrackingEntry(trackingData) {
    const trackings = this.data.package_tracking || [];
    const newId =
      trackings.length > 0 ? Math.max(...trackings.map((t) => t.package_tracking_id)) + 1 : 1;
    const entry = { package_tracking_id: newId, ...trackingData };
    trackings.push(entry);
    this.data.package_tracking = trackings;
    this.save();
    return entry;
  }

  updateTracking(id, updates) {
    const entry = this.getTrackingById(id);
    if (!entry) return null;
    Object.assign(entry, updates);
    this.save();
    return entry;
  }
}

export const db = new Database();
