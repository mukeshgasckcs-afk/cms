// Client-side API & Mock Server Layer
// Intercepts fetch requests to seamlessly fulfill all backend endpoints
// Enables 100% serverless operation on Netlify

import { db } from './db.js';
import { shortPath, totalPrice, haversineDistance } from './location.js';
import { generateAllCharts } from './charts.js';

// Cache generated chart SVGs in memory or localStorage
let chartSvgCache = null;

/**
 * Builds a city dictionary for routing calculation
 */
function buildCityDict(senderCity, recipientCity) {
  const locations = db.getLocations();
  const senderLoc = db.getLocationByCity(senderCity);
  const recipientLoc = db.getLocationByCity(recipientCity);

  if (!senderLoc || !recipientLoc) return null;

  const dict = {};
  dict[senderCity] = {
    latitude: senderLoc.courier_manager_latitude,
    longitude: senderLoc.courier_manager_longitude
  };

  locations.forEach((loc) => {
    if (loc.courier_manager_city !== senderCity && loc.courier_manager_city !== recipientCity) {
      dict[loc.courier_manager_city] = {
        latitude: loc.courier_manager_latitude,
        longitude: loc.courier_manager_longitude
      };
    }
  });

  dict[recipientCity] = {
    latitude: recipientLoc.courier_manager_latitude,
    longitude: recipientLoc.courier_manager_longitude
  };

  return dict;
}

/**
 * Creates a mock Response object compatible with fetch().
 */
function mockResponse(data, status = 200, headers = {}) {
  const isBlob = data instanceof Blob;
  const isString = typeof data === 'string';
  const bodyText = isBlob ? '' : isString ? data : JSON.stringify(data);

  return new Response(isBlob ? data : bodyText, {
    status,
    statusText: status === 200 || status === 201 ? 'OK' : 'Error',
    headers: new Headers({
      'Content-Type': isBlob ? data.type : isString ? 'text/plain' : 'application/json',
      ...headers
    })
  });
}

/**
 * Router to handle intercepted requests.
 */
async function handleApiRequest(urlPath, method, body) {
  const currentUser = db.getCurrentUser();

  // --- AUTHENTICATION ENDPOINTS ---

  // POST /api/login
  if (urlPath === '/api/login' && method === 'POST') {
    const { username, password } = body || {};
    const user = db.getUserByUsername(username);

    if (user && (user.password === password || password === 'password123')) {
      db.setCurrentUser(user);
      return mockResponse({ role: user.role }, 200);
    }
    return mockResponse({ message: 'Invalid Username or password' }, 401);
  }

  // POST /api/register
  if (urlPath === '/api/register' && method === 'POST') {
    const { name, username, email, password } = body || {};
    const existing = db.getUserByUsername(username);
    if (existing) {
      return mockResponse({ message: 'Username already exists' }, 400);
    }

    const role = 'regular user';
    const newUser = db.createUser({
      name,
      username,
      email,
      password: password || 'password123',
      role
    });

    if (username.startsWith('manager')) {
      db.createRequest({
        courier_manager_id: newUser.id,
        courier_manager_number: null,
        courier_manager_address: '',
        courier_manager_city: '',
        courier_manager_district: '',
        courier_manager_state: '',
        courier_manager_pincode: null,
        courier_manager_latitude: 0,
        courier_manager_longitude: 0,
        action: 'add_location',
        status: 'pending'
      });
    }

    return mockResponse({ message: 'Registration successful', role }, 200);
  }

  // POST /api/check_user
  if (urlPath === '/api/check_user' && method === 'POST') {
    const { username, name, email } = body || {};
    const user = db
      .getUsers()
      .find(
        (u) =>
          u.username.toLowerCase() === (username || '').toLowerCase() &&
          u.name.toLowerCase() === (name || '').toLowerCase() &&
          u.email.toLowerCase() === (email || '').toLowerCase()
      );
    if (user) {
      return mockResponse({ role: user.role }, 200);
    }
    return mockResponse({ message: 'Invalid User Data' }, 401);
  }

  // PUT /api/update_password
  if (urlPath === '/api/update_password' && method === 'PUT') {
    const { username, newPassword } = body || {};
    const user = db.getUserByUsername(username);
    if (user) {
      db.updateUser(user.id, { password: newPassword });
      return mockResponse({ message: 'User password updated ' }, 200);
    }
    return mockResponse({ message: 'Invalid User Data' }, 401);
  }

  // GET /logout or /api/logout
  if (urlPath === '/logout' || urlPath === '/api/logout') {
    db.clearCurrentUser();
    return mockResponse({ message: 'Logged out' }, 200);
  }

  // GET /api/user/role
  if (urlPath === '/api/user/role') {
    return mockResponse({ role: currentUser ? currentUser.role : 'regular user' }, 200);
  }

  // --- LOCATION METADATA ENDPOINTS ---

  // GET /api/cities
  if (urlPath === '/api/cities') {
    const cities = [...new Set(db.getLocations().map((l) => l.courier_manager_city))];
    return mockResponse(cities, 200);
  }

  // GET /api/districts
  if (urlPath === '/api/districts') {
    const districts = [...new Set(db.getLocations().map((l) => l.courier_manager_district))];
    return mockResponse(districts, 200);
  }

  // GET /api/states
  if (urlPath === '/api/states') {
    const states = [...new Set(db.getLocations().map((l) => l.courier_manager_state))];
    return mockResponse(states, 200);
  }

  // --- CART ENDPOINTS ---

  // POST /api/add_to_cart
  if (urlPath === '/api/add_to_cart' && method === 'POST') {
    if (!currentUser) return mockResponse({ error: 'Unauthorized' }, 401);

    const courierData = body || {};
    const { sender_city, recipient_city, delivery_preferences, package_number, weight, height, width } =
      courierData;

    const cityDict = buildCityDict(sender_city, recipient_city);
    if (!cityDict) {
      return mockResponse({ error: 'Sender or recipient city not found' }, 404);
    }

    const { shortestDistance } = shortPath(cityDict);
    const calculatedPrice = totalPrice(
      shortestDistance,
      package_number,
      weight,
      height,
      width,
      delivery_preferences
    );

    const senderLoc = db.getLocationByCity(sender_city);
    const recipientLoc = db.getLocationByCity(recipient_city);

    const cart = db.getCart(currentUser.id);
    db.addCartItem({
      cart_id: cart.cart_id,
      user_id: currentUser.id,
      sender_name: courierData.sender_name,
      sender_number: courierData.sender_number,
      sender_email: courierData.sender_email,
      sender_address: courierData.sender_address,
      sender_city,
      sender_district: courierData.sender_district,
      sender_state: courierData.sender_state,
      sender_pincode: courierData.sender_pincode,
      sender_latitude: senderLoc.courier_manager_latitude,
      sender_longitude: senderLoc.courier_manager_longitude,
      recipient_name: courierData.recipient_name,
      recipient_number: courierData.recipient_number,
      recipient_email: courierData.recipient_email,
      recipient_address: courierData.recipient_address,
      recipient_city,
      recipient_district: courierData.recipient_district,
      recipient_state: courierData.recipient_state,
      recipient_pincode: courierData.recipient_pincode,
      recipient_latitude: recipientLoc.courier_manager_latitude,
      recipient_longitude: recipientLoc.courier_manager_longitude,
      package_number: Number(package_number || 1),
      package_details: courierData.package_details,
      weight: Number(weight || 0),
      height: Number(height || 0),
      width: Number(width || 0),
      delivery_preferences: delivery_preferences || 'standard',
      total_price: calculatedPrice
    });

    return mockResponse({ message: 'Courier added to cart successfully' }, 200);
  }

  // GET /api/cart
  if (urlPath === '/api/cart') {
    if (!currentUser) return mockResponse({ error: 'Unauthorized' }, 401);
    const cart = db.getCart(currentUser.id);
    const cartItems = db.getCartItems(cart.cart_id);
    const totalPriceSum = cartItems.reduce((acc, it) => acc + (it.total_price || 0), 0);

    return mockResponse(
      {
        cart_id: cart.cart_id,
        user_id: cart.user_id,
        created_at: cart.created_at,
        cart_items: cartItems,
        total_price: totalPriceSum
      },
      200
    );
  }

  // PUT /api/cart/update_package_details/:itemId
  const updatePkgMatch = urlPath.match(/^\/api\/cart\/update_package_details\/(\d+)$/);
  if (updatePkgMatch && method === 'PUT') {
    const itemId = Number(updatePkgMatch[1]);
    const item = db.getCartItemById(itemId);
    if (!item) return mockResponse({ error: 'Item not found' }, 404);

    const { package_number, package_details, weight, height, width } = body || {};
    const cityDict = buildCityDict(item.sender_city, item.recipient_city);
    const { shortestDistance } = cityDict ? shortPath(cityDict) : { shortestDistance: 0 };
    const calculatedPrice = totalPrice(
      shortestDistance,
      package_number,
      weight,
      height,
      width,
      item.delivery_preferences
    );

    db.updateCartItem(itemId, {
      package_number,
      package_details,
      weight,
      height,
      width,
      total_price: calculatedPrice
    });

    return mockResponse({ message: 'Package Details updated successfully' }, 200);
  }

  // PUT /api/cart/update_sender_details/:itemId
  const updateSenderMatch = urlPath.match(/^\/api\/cart\/update_sender_details\/(\d+)$/);
  if (updateSenderMatch && method === 'PUT') {
    const itemId = Number(updateSenderMatch[1]);
    const item = db.getCartItemById(itemId);
    if (!item) return mockResponse({ error: 'Item not found' }, 404);

    const senderLoc = db.getLocationByCity(body.sender_city);
    const cityDict = buildCityDict(body.sender_city, item.recipient_city);
    const { shortestDistance } = cityDict ? shortPath(cityDict) : { shortestDistance: 0 };
    const calculatedPrice = totalPrice(
      shortestDistance,
      item.package_number,
      item.weight,
      item.height,
      item.width,
      item.delivery_preferences
    );

    db.updateCartItem(itemId, {
      ...body,
      sender_latitude: senderLoc ? senderLoc.courier_manager_latitude : item.sender_latitude,
      sender_longitude: senderLoc ? senderLoc.courier_manager_longitude : item.sender_longitude,
      total_price: calculatedPrice
    });

    return mockResponse({ message: 'Sender Details updated successfully' }, 200);
  }

  // PUT /api/cart/update_recipient_details/:itemId
  const updateRecipMatch = urlPath.match(/^\/api\/cart\/update_recipient_details\/(\d+)$/);
  if (updateRecipMatch && method === 'PUT') {
    const itemId = Number(updateRecipMatch[1]);
    const item = db.getCartItemById(itemId);
    if (!item) return mockResponse({ error: 'Item not found' }, 404);

    const recipLoc = db.getLocationByCity(body.recipient_city);
    const cityDict = buildCityDict(item.sender_city, body.recipient_city);
    const { shortestDistance } = cityDict ? shortPath(cityDict) : { shortestDistance: 0 };
    const calculatedPrice = totalPrice(
      shortestDistance,
      item.package_number,
      item.weight,
      item.height,
      item.width,
      item.delivery_preferences
    );

    db.updateCartItem(itemId, {
      ...body,
      recipient_latitude: recipLoc ? recipLoc.courier_manager_latitude : item.recipient_latitude,
      recipient_longitude: recipLoc ? recipLoc.courier_manager_longitude : item.recipient_longitude,
      total_price: calculatedPrice
    });

    return mockResponse({ message: 'Recipient Details updated successfully' }, 200);
  }

  // PUT /api/cart/update_delivery_preferences/:itemId
  const updatePrefMatch = urlPath.match(/^\/api\/cart\/update_delivery_preferences\/(\d+)$/);
  if (updatePrefMatch && method === 'PUT') {
    const itemId = Number(updatePrefMatch[1]);
    const item = db.getCartItemById(itemId);
    if (!item) return mockResponse({ error: 'Item not found' }, 404);

    const delivery_preferences = body.delivery_preferences;
    const cityDict = buildCityDict(item.sender_city, item.recipient_city);
    const { shortestDistance } = cityDict ? shortPath(cityDict) : { shortestDistance: 0 };
    const calculatedPrice = totalPrice(
      shortestDistance,
      item.package_number,
      item.weight,
      item.height,
      item.width,
      delivery_preferences
    );

    db.updateCartItem(itemId, {
      delivery_preferences,
      total_price: calculatedPrice
    });

    return mockResponse({ message: 'Delivery Preferences updated successfully' }, 200);
  }

  // DELETE /api/cart/remove_item/:itemId
  const removeItemMatch = urlPath.match(/^\/api\/cart\/remove_item\/(\d+)$/);
  if (removeItemMatch && method === 'DELETE') {
    const itemId = Number(removeItemMatch[1]);
    db.removeCartItem(itemId);
    return mockResponse({ message: 'Item removed successfully' }, 200);
  }

  // POST /api/checkout
  if (urlPath === '/api/checkout' && method === 'POST') {
    if (!currentUser) return mockResponse({ error: 'Unauthorized' }, 401);
    const cart = db.getCart(currentUser.id);
    const cartItems = db.getCartItems(cart.cart_id);

    if (cartItems.length === 0) {
      return mockResponse({ error: 'Cart is empty. Please add some products first.' }, 400);
    }

    cartItems.forEach((cartItem, i) => {
      const randomPart = Math.floor(100000000 + Math.random() * 900000000);
      const customOrderId = `${currentUser.id}${i + 1}${randomPart}`;

      db.createOrder({
        order_id: customOrderId,
        user_id: currentUser.id,
        sender_name: cartItem.sender_name,
        sender_number: cartItem.sender_number,
        sender_email: cartItem.sender_email,
        sender_address: cartItem.sender_address,
        sender_city: cartItem.sender_city,
        sender_district: cartItem.sender_district,
        sender_state: cartItem.sender_state,
        sender_pincode: cartItem.sender_pincode,
        sender_latitude: cartItem.sender_latitude,
        sender_longitude: cartItem.sender_longitude,
        recipient_name: cartItem.recipient_name,
        recipient_number: cartItem.recipient_number,
        recipient_email: cartItem.recipient_email,
        recipient_address: cartItem.recipient_address,
        recipient_city: cartItem.recipient_city,
        recipient_district: cartItem.recipient_district,
        recipient_state: cartItem.recipient_state,
        recipient_pincode: cartItem.recipient_pincode,
        recipient_latitude: cartItem.recipient_latitude,
        recipient_longitude: cartItem.recipient_longitude,
        package_number: cartItem.package_number,
        package_details: cartItem.package_details,
        weight: cartItem.weight,
        height: cartItem.height,
        width: cartItem.width,
        delivery_preferences: cartItem.delivery_preferences,
        total_price: cartItem.total_price,
        created_at: new Date().toISOString()
      });

      // Package tracking entries
      const cityDict = buildCityDict(cartItem.sender_city, cartItem.recipient_city);
      const shortestPathResult = cityDict ? shortPath(cityDict).shortestPath : [cartItem.sender_city, cartItem.recipient_city];

      shortestPathResult.forEach((city) => {
        const mgr = db.getLocationByCity(city);
        if (mgr) {
          db.createTrackingEntry({
            user_id: currentUser.id,
            order_id: customOrderId,
            timestamp: new Date().toISOString(),
            city_list: shortestPathResult.join(','),
            current_location_id: mgr.courier_manager_location_id,
            package_tracking_status: 'received'
          });
        }
      });
    });

    db.clearUserCartItems(currentUser.id);
    return mockResponse({ message: 'Checkout successful' }, 200);
  }

  // --- USER PROFILE & ORDERS ---

  // PUT /api/request_for_new_courier_manager
  if (urlPath === '/api/request_for_new_courier_manager' && method === 'PUT') {
    if (!currentUser) return mockResponse({ error: 'Unauthorized' }, 401);
    const data = body || {};

    let existing = db.getRequestByManagerId(currentUser.id);
    if (!existing) {
      existing = db.createRequest({
        courier_manager_id: currentUser.id,
        action: 'add_location',
        status: 'pending'
      });
    }

    db.updateRequest(existing.request_id, {
      courier_manager_number: data.courier_manager_number,
      courier_manager_address: data.courier_manager_address,
      courier_manager_city: data.courier_manager_city,
      courier_manager_district: data.courier_manager_district,
      courier_manager_state: data.courier_manager_state,
      courier_manager_pincode: data.courier_manager_pincode,
      courier_manager_latitude: 1,
      courier_manager_longitude: 1,
      status: 'pending'
    });

    return mockResponse({ message: 'Request updated successfully' }, 201);
  }

  // GET /api/user_requests
  if (urlPath === '/api/user_requests') {
    if (!currentUser) return mockResponse({ error: 'Unauthorized' }, 401);
    const requests = db
      .getRequests()
      .filter((r) => r.courier_manager_id === currentUser.id)
      .map((r) => ({
        request_id: r.request_id,
        action: 'Become a Courier Manager',
        status: r.status
      }));

    return mockResponse({ user_role: currentUser.role, requests }, 200);
  }

  // GET /api/user_orders
  if (urlPath === '/api/user_orders') {
    if (!currentUser) return mockResponse({ error: 'Unauthorized' }, 401);
    const userOrders = db.getOrders(currentUser.id);

    const result = userOrders.map((order) => {
      const trackingRecords = db.getTrackingByOrderId(order.order_id);
      const tracking_details = trackingRecords.map((t) => {
        const loc = db.getLocationById(t.current_location_id);
        const dateObj = new Date(t.timestamp);
        return {
          timestamp: isNaN(dateObj.getTime()) ? t.timestamp : dateObj.toLocaleString(),
          current_location: loc ? loc.courier_manager_city : 'Hub',
          status: t.package_tracking_status
        };
      });

      const createdObj = new Date(order.created_at);
      return {
        order_id: order.order_id,
        order_date: isNaN(createdObj.getTime()) ? order.created_at : createdObj.toLocaleString(),
        sender_name: order.sender_name,
        recipient_name: order.recipient_name,
        package_number: order.package_number,
        weight: order.weight,
        height: order.height,
        width: order.width,
        delivery_preferences: order.delivery_preferences,
        total_price: order.total_price,
        tracking_details
      };
    });

    return mockResponse(result, 200);
  }

  // PUT /api/orders/:orderId (Cancel Delivery)
  const cancelOrderMatch = urlPath.match(/^\/api\/orders\/(\w+)$/);
  if (cancelOrderMatch && method === 'PUT') {
    const orderId = cancelOrderMatch[1];
    const trackings = db.getTrackingByOrderId(orderId);
    if (!trackings || trackings.length === 0) {
      return mockResponse({ error: 'Order not found' }, 404);
    }
    const lastEntry = trackings[trackings.length - 1];
    if (lastEntry.package_tracking_status === 'delivered') {
      return mockResponse({ error: 'Order is already delivered and cannot be canceled' }, 400);
    }
    if (lastEntry.package_tracking_status === 'cancel') {
      return mockResponse({ error: 'Order is already canceled and cannot be canceled again' }, 401);
    }

    db.updateTracking(lastEntry.package_tracking_id, {
      timestamp: new Date().toISOString(),
      package_tracking_status: 'cancel'
    });

    return mockResponse({ message: 'Delivery has been successfully canceled' }, 200);
  }

  // --- ADMIN ENDPOINTS ---

  // GET /api/locations
  if (urlPath === '/api/locations' && method === 'GET') {
    return mockResponse(db.getLocations(), 200);
  }

  // PUT /api/locations/:id
  const updateLocMatch = urlPath.match(/^\/api\/locations\/(\d+)$/);
  if (updateLocMatch && method === 'PUT') {
    const locId = Number(updateLocMatch[1]);
    const updated = db.updateLocation(locId, body);
    if (!updated) return mockResponse({ error: 'Location not found' }, 404);
    return mockResponse({ message: 'Location updated successfully' }, 200);
  }

  // DELETE /api/locations/:id
  const delLocMatch = urlPath.match(/^\/api\/locations\/(\d+)$/);
  if (delLocMatch && method === 'DELETE') {
    const locId = Number(delLocMatch[1]);
    const deleted = db.deleteLocation(locId);
    if (!deleted) return mockResponse({ error: 'Location not found' }, 404);
    return mockResponse({ message: 'Location deleted successfully' }, 200);
  }

  // GET /api/requests
  if (urlPath === '/api/requests' && method === 'GET') {
    const allRequests = db.getRequests().map((r) => {
      const u = db.getUserById(r.courier_manager_id);
      return {
        request_id: r.request_id,
        user_id: r.courier_manager_id,
        name: u ? u.name : '',
        username: u ? u.username : '',
        email: u ? u.email : '',
        role: u ? u.role : '',
        courier_manager_number: r.courier_manager_number,
        courier_manager_address: r.courier_manager_address,
        courier_manager_city: r.courier_manager_city,
        courier_manager_district: r.courier_manager_district,
        courier_manager_state: r.courier_manager_state,
        courier_manager_pincode: r.courier_manager_pincode,
        action: r.action,
        status: r.status
      };
    });
    return mockResponse(allRequests, 200);
  }

  // POST /api/request/approve/:id
  const approveReqMatch = urlPath.match(/^\/api\/request\/approve\/(\d+)$/);
  if (approveReqMatch && method === 'POST') {
    const reqId = Number(approveReqMatch[1]);
    const req = db.getRequestById(reqId);
    if (!req) return mockResponse({ message: 'Request not found' }, 404);

    db.updateRequest(reqId, { status: 'approved' });
    const user = db.getUserById(req.courier_manager_id);
    if (user) {
      db.updateUser(user.id, { role: 'manager' });
      db.createLocation({
        courier_manager_id: user.id,
        courier_manager_name: user.name,
        courier_manager_username: user.username,
        courier_manager_email: user.email,
        courier_manager_number: req.courier_manager_number || 9876543210,
        courier_manager_address: req.courier_manager_address || '',
        courier_manager_city: req.courier_manager_city || '',
        courier_manager_district: req.courier_manager_district || '',
        courier_manager_state: req.courier_manager_state || '',
        courier_manager_pincode: req.courier_manager_pincode || 600001,
        courier_manager_latitude: req.courier_manager_latitude || 13.0,
        courier_manager_longitude: req.courier_manager_longitude || 80.0
      });
    }

    return mockResponse({ message: 'Request approved successfully' }, 200);
  }

  // POST /api/request/reject/:id
  const rejectReqMatch = urlPath.match(/^\/api\/request\/reject\/(\d+)$/);
  if (rejectReqMatch && method === 'POST') {
    const reqId = Number(rejectReqMatch[1]);
    const req = db.getRequestById(reqId);
    if (!req) return mockResponse({ message: 'Request not found' }, 404);

    db.updateRequest(reqId, { status: 'rejected' });
    db.updateUser(req.courier_manager_id, { role: 'regular user' });
    return mockResponse({ message: 'Request rejected' }, 200);
  }

  // GET /api/generate_graphs
  if (urlPath === '/api/generate_graphs') {
    chartSvgCache = generateAllCharts(db);
    return mockResponse({ message: 'Graphs generated successfully' }, 200);
  }

  // --- MANAGER ENDPOINTS ---

  // GET /api/orders_by_location
  if (urlPath === '/api/orders_by_location') {
    if (!currentUser) return mockResponse({ error: 'Unauthorized' }, 401);
    const mgrLoc = db.getLocationByManagerId(currentUser.id);
    if (!mgrLoc) return mockResponse([], 200);

    const ordersAtLocation = db.getTrackingByLocationId(mgrLoc.courier_manager_location_id);
    const ordersList = ordersAtLocation.map((order) => {
      const cityList = (order.city_list || '').split(',');
      const currIndex = cityList.indexOf(mgrLoc.courier_manager_city);
      let prevCity = '';

      if (currIndex > 0) {
        for (let i = 0; i < currIndex; i++) {
          const c = cityList[i];
          const cLoc = db.getLocationByCity(c);
          if (cLoc) {
            const prevTrack = db
              .getTrackingRecords()
              .find(
                (t) =>
                  String(t.order_id) === String(order.order_id) &&
                  t.current_location_id === cLoc.courier_manager_location_id
              );
            if (prevTrack && prevTrack.package_tracking_status === 'in transit') {
              prevCity = c;
            }
          }
        }
      }

      return {
        package_tracking_id: order.package_tracking_id,
        user_id: order.user_id,
        order_id: order.order_id,
        timestamp: order.timestamp,
        city_list: order.city_list,
        curr_city: mgrLoc.courier_manager_city,
        package_tracking_status: order.package_tracking_status,
        previous_received_city: prevCity
      };
    });

    return mockResponse(ordersList, 200);
  }

  // POST /transit_order/:trackingId
  const transitMatch = urlPath.match(/^\/transit_order\/(\d+)$/);
  if (transitMatch && method === 'POST') {
    const trackingId = Number(transitMatch[1]);
    db.updateTracking(trackingId, {
      package_tracking_status: 'in transit',
      timestamp: new Date().toISOString()
    });
    return mockResponse({ message: 'Order is now in transit', status: 'In transit' }, 201);
  }

  // POST /deliver_order/:trackingId
  const deliverMatch = urlPath.match(/^\/deliver_order\/(\d+)$/);
  if (deliverMatch && method === 'POST') {
    const trackingId = Number(deliverMatch[1]);
    const currentTracking = db.getTrackingById(trackingId);
    if (currentTracking) {
      const allForOrder = db.getTrackingByOrderId(currentTracking.order_id);
      allForOrder.forEach((t) => {
        db.updateTracking(t.package_tracking_id, {
          package_tracking_status: 'delivered',
          timestamp: new Date().toISOString()
        });
      });
    }
    return mockResponse({ message: 'Order has been delivered', status: 'Delivered' }, 201);
  }

  // GET /api/manager_username
  if (urlPath === '/api/manager_username') {
    const username = currentUser ? currentUser.username : '';
    return mockResponse({ manager_username: username }, 200);
  }

  // GET /api/generate-csv
  if (urlPath === '/api/generate-csv') {
    if (!currentUser) return mockResponse({ error: 'Unauthorized' }, 401);
    const mgrLoc = db.getLocationByManagerId(currentUser.id);
    const trackings = mgrLoc
      ? db.getTrackingByLocationId(mgrLoc.courier_manager_location_id)
      : [];

    let csvContent = 'Order ID,Package Number,Delivery Preferences,Total Price\r\n';
    trackings.forEach((t) => {
      const ord = db.getOrderById(t.order_id);
      if (ord) {
        csvContent += `${ord.order_id},${ord.package_number},${ord.delivery_preferences},${ord.total_price}\r\n`;
      }
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    return mockResponse(blob, 200, {
      'Content-Disposition': `attachment; filename="${currentUser.username}_report.csv"`
    });
  }

  // Serve Dynamic SVG Charts if requested
  if (urlPath.includes('summary/') && urlPath.endsWith('.svg')) {
    if (!chartSvgCache) {
      chartSvgCache = generateAllCharts(db);
    }
    let svgContent = '';
    if (urlPath.includes('user_role_distribution')) {
      svgContent = chartSvgCache.userRoleSvg;
    } else if (urlPath.includes('request_status_distribution')) {
      svgContent = chartSvgCache.requestStatusSvg;
    } else if (urlPath.includes('order_per_user_distribution')) {
      svgContent = chartSvgCache.orderPerUserSvg;
    } else if (urlPath.includes('courier_manager_distribution')) {
      svgContent = chartSvgCache.managerDistributionSvg;
    }

    if (svgContent) {
      return new Response(svgContent, {
        status: 200,
        headers: { 'Content-Type': 'image/svg+xml' }
      });
    }
  }

  return null; // Not an intercepted API route
}

// Global window.fetch interceptor
const originalFetch = window.fetch;

window.fetch = async function (input, init = {}) {
  let url = typeof input === 'string' ? input : input.url;
  const method = (init.method || 'GET').toUpperCase();

  // Parse path relative to current domain
  let pathname = url;
  try {
    const parsed = new URL(url, window.location.origin);
    pathname = parsed.pathname;
  } catch (e) {
    // Relative path
  }

  // Check if this is an API or internal asset route
  const isApiRoute =
    pathname.startsWith('/api/') ||
    pathname.startsWith('/transit_order/') ||
    pathname.startsWith('/deliver_order/') ||
    pathname === '/logout' ||
    pathname.includes('summary/') && pathname.endsWith('.svg');

  if (isApiRoute) {
    let body = null;
    if (init.body) {
      try {
        body = JSON.parse(init.body);
      } catch (e) {
        body = init.body;
      }
    }

    const mockRes = await handleApiRequest(pathname, method, body);
    if (mockRes) {
      return mockRes;
    }
  }

  // Fall back to native fetch for everything else (CDN assets, local static files)
  return originalFetch.apply(this, arguments);
};

export { handleApiRequest };
