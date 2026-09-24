from . import db
from flask_sqlalchemy import SQLAlchemy
from flask import Flask, render_template, request, redirect, url_for, flash, jsonify, abort,send_from_directory,send_file,Blueprint
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from datetime import datetime  
#from celery_wroker import Celery, make_celery
from .mail import send_confirmation_email,send_notification_email,send_transit_email,send_cancel_email,send_deliver_email
from sqlalchemy.exc import SQLAlchemyError
from .models import  User,Cart,CartItem,Order,Request,Courier_Manager,PackageTracking
from .location import get_city_dict,short_path,totalprice

# the user_views  blueprint
user_views = Blueprint("user_views", __name__)

# User Home Page
@user_views.route('/home', methods=['GET', 'POST'])
@login_required
def home():
    return render_template('base.html')

# Return a default role for unauthenticated users
@user_views.route('/api/user/role', methods=['GET'])
def get_user_role():
    if current_user.is_authenticated:
        user_role = current_user.role
        return jsonify({'role': user_role})
    else:
        return jsonify({'role': 'regular user'}) 

# API Endpoint to get Courier_Manager cities details
@user_views.route('/api/cities', methods=['GET'])
def get_cities():
    cities = db.session.query(Courier_Manager.courier_manager_city).distinct().all()
    city_names = [city[0] for city in cities]
    return jsonify(city_names)

# API Endpoint to get Courier_Manager districts details
@user_views.route('/api/districts', methods=['GET'])
def get_districts():
    districts = db.session.query(Courier_Manager.courier_manager_district).distinct().all()
    district_names = [district[0] for district in districts]
    return jsonify(district_names)

# API Endpoint to get Courier_Manager states details
@user_views.route('/api/states', methods=['GET'])
def get_states():
    states = db.session.query(Courier_Manager.courier_manager_state).distinct().all()
    state_names = [state[0] for state in states]
    return jsonify(state_names)


# API Endpoint to add courier to Cart
@user_views.route('/api/add_to_cart', methods=['POST'])
@login_required
def add_to_cart():
    try:
        courier_data = request.get_json()
        cart = Cart.query.filter_by(user_id=current_user.id).first()
        if not cart:
            cart = Cart(user_id=current_user.id, created_at=datetime.now())
            db.session.add(cart)
            db.session.commit()

        # Fetch the sender and recipient cities from the request data
        sender_city = courier_data.get('sender_city')
        recipient_city = courier_data.get('recipient_city')
        package_number=courier_data.get('package_number'),
        weight=courier_data.get('weight'),
        height=courier_data.get('height'),
        width=courier_data.get('width'),
        delivery_preferences=courier_data.get('delivery_preferences'),
        package_number = package_number[0]
        weight = weight[0]
        height = height[0]
        width = width[0]
        delivery_preferences = delivery_preferences[0]
        city_dict = get_city_dict(sender_city,recipient_city)
        shortest_path, shortest_distance = short_path(city_dict)
        print(shortest_path, shortest_distance)
        print(shortest_distance,package_number,weight, height, width, delivery_preferences)
        total_price= totalprice(shortest_distance,package_number, weight, height, width, delivery_preferences)
        print("hello")

        print(total_price)
        # Query the Courier_Manager table to get sender and recipient latitude and longitude
        sender_courier_manager = Courier_Manager.query.filter_by(courier_manager_city=sender_city).first()
        recipient_courier_manager = Courier_Manager.query.filter_by(courier_manager_city=recipient_city).first()

        if sender_courier_manager and recipient_courier_manager:
            sender_latitude = sender_courier_manager.courier_manager_latitude
            sender_longitude = sender_courier_manager.courier_manager_longitude
            recipient_latitude = recipient_courier_manager.courier_manager_latitude
            recipient_longitude = recipient_courier_manager.courier_manager_longitude
            # Create a new cart item and associate it with the user's cart
            cart_item = CartItem(
                cart_id=cart.cart_id,
                user_id=current_user.id,
                sender_name=courier_data.get('sender_name'),
                sender_number=courier_data.get('sender_number'),
                sender_email=courier_data.get('sender_email'),
                sender_address=courier_data.get('sender_address'),
                sender_city=sender_city,
                sender_district=courier_data.get('sender_district'),
                sender_state=courier_data.get('sender_state'),
                sender_pincode=courier_data.get('sender_pincode'),
                sender_latitude=sender_latitude,
                sender_longitude=sender_longitude,

                # Add more fields as needed
                recipient_name=courier_data.get('recipient_name'),
                recipient_number=courier_data.get('recipient_number'),
                recipient_email=courier_data.get('recipient_email'),
                recipient_address=courier_data.get('recipient_address'),
                recipient_city=recipient_city,
                recipient_district=courier_data.get('recipient_district'),
                recipient_state=courier_data.get('recipient_state'),
                recipient_pincode=courier_data.get('recipient_pincode'),
                recipient_latitude=recipient_latitude,
                recipient_longitude=recipient_longitude,
                # Add more recipient fields as needed
                package_number=package_number,
                package_details=courier_data.get('package_details'),
                weight=weight,
                height=height,
                width=width,
                delivery_preferences=delivery_preferences,
                total_price=total_price
            )

            # Add the cart item to the database
            db.session.add(cart_item)
            db.session.commit()

            return jsonify({'message': 'Courier added to cart successfully'}), 200
        else:
            return jsonify({'error': 'Sender or recipient city not found in the Courier Manager table'}), 404

    except Exception as e:
        return jsonify({'error': 'Failed to add courier to cart'}), 500

from datetime import datetime  
# API Endpoint to Retrieve Cart Data
@user_views.route('/api/cart', methods=['GET','POST'])
@login_required
def get_cart_data():
    user_id = current_user.id
    
    cart = Cart.query.filter_by(user_id=user_id).first()
    if not cart:
        cart = Cart(user_id=current_user.id, created_at=datetime.now())
        db.session.add(cart)
        db.session.commit()
        return jsonify(message="Cart is created"), 201
    cart_items = CartItem.query.filter_by(cart_id=cart.cart_id).all()
    
    cart_data = {
        'cart_id': cart.cart_id,
        'user_id': cart.user_id,
        'created_at': cart.created_at.strftime('%Y-%m-%d %H:%M:%S'),
        'cart_items': [
            {
                'item_id': item.item_id,
                'sender_name': item.sender_name,
                'sender_number': item.sender_number,
                'sender_email': item.sender_email,
                'sender_address': item.sender_address,
                'sender_city': item.sender_city,
                'sender_district': item.sender_district,
                'sender_state': item.sender_state,
                'sender_pincode': item.sender_pincode,
                'recipient_name': item.recipient_name,
                'recipient_number': item.recipient_number,
                'recipient_email': item.recipient_email,
                'recipient_address': item.recipient_address,
                'recipient_city': item.recipient_city,
                'recipient_district': item.recipient_district,
                'recipient_state': item.recipient_state,
                'recipient_pincode': item.recipient_pincode,
                'package_number': item.package_number,
                'package_details': item.package_details,
                'weight': item.weight,
                'height': item.height,
                'width': item.width,
                'delivery_preferences': item.delivery_preferences,
                'total_price': item.total_price,
            }
            for item in cart_items
        ],
        'total_price': sum(item.total_price for item in cart_items)
    }
    return jsonify(cart_data)

# API Endpoint to update package details of courier in  Cart
@user_views.route('/api/cart/update_package_details/<int:item_id>', methods=['PUT'])
@login_required
def update_package_details_cart(item_id):
    data = request.get_json()

    try:
        cart_item = CartItem.query.get(item_id)
        cart_item.package_number = data['package_number']
        cart_item.package_details = data['package_details'] 
        cart_item.weight = data['weight'] 
        cart_item.height = data['height'] 
        cart_item.width = data['width']
        city_dict = get_city_dict(cart_item.sender_city, cart_item.recipient_city)
        shortest_path, shortest_distance = short_path(city_dict)
        cart_item.total_price = totalprice(shortest_distance, data['package_number'], data['weight'], data['height'], data['width'], cart_item.delivery_preferences)
        db.session.commit()
        return jsonify({"message": "Package Details updated successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# API endpoint to update courier's sender details in cart
@user_views.route('/api/cart/update_sender_details/<int:item_id>', methods=['PUT'])
@login_required
def update_sender_details_cart(item_id):
    data = request.get_json()
    # Fetch the sender and recipient cities from the request data
    sender_city = data.get('sender_city')

    # Query the Courier_Manager table to get sender and recipient latitude and longitude
    sender_courier_manager = Courier_Manager.query.filter_by(courier_manager_city=sender_city).first()

    if sender_courier_manager:
        sender_latitude = sender_courier_manager.courier_manager_latitude
        sender_longitude = sender_courier_manager.courier_manager_longitude

    try:
        cart_item = CartItem.query.get(item_id)
        cart_item.sender_name = data['sender_name']
        cart_item.sender_number = data['sender_number']
        cart_item.sender_email = data['sender_email']
        cart_item.sender_address = data['sender_address']
        cart_item.sender_city = sender_city
        cart_item.sender_district = data['sender_district']
        cart_item.sender_state = data['sender_state']
        cart_item.sender_pincode = data['sender_pincode']
        cart_item.sender_latitude = sender_latitude
        cart_item.sender_longitude = sender_longitude
        city_dict = get_city_dict(sender_city,cart_item.recipient_city)
        shortest_path, shortest_distance = short_path(city_dict)
        cart_item.total_price= totalprice(shortest_distance,cart_item.package_number, cart_item.weight, cart_item.height, cart_item.width, cart_item.delivery_preferences)
        db.session.commit()
        return jsonify({"message": "Sender Details updated successfully"}),200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    
# API endpoint to update courier's recipient details in cart
@user_views.route('/api/cart/update_recipient_details/<int:item_id>', methods=['PUT'])
@login_required
def update_recipient_details_cart(item_id):
    data = request.get_json()
    # Fetch the recipient cities from the request data
    recipient_city = data.get('recipient_city')

    # Query the Courier_Manager table to get sender and recipient latitude and longitude
    recipient_courier_manager = Courier_Manager.query.filter_by(courier_manager_city=recipient_city).first()

    if   recipient_courier_manager:
        recipient_latitude = recipient_courier_manager.courier_manager_latitude
        recipient_longitude = recipient_courier_manager.courier_manager_longitude

    try:
        cart_item = CartItem.query.get(item_id)
        cart_item.recipient_name = data['recipient_name']
        cart_item.recipient_number = data['recipient_number']
        cart_item.recipient_email = data['recipient_email']
        cart_item.recipient_address = data['recipient_address']
        cart_item.recipient_city = recipient_city
        cart_item.recipient_district = data['recipient_district']
        cart_item.recipient_state = data['recipient_state']
        cart_item.recipient_pincode = data['recipient_pincode']
        cart_item.recipient_latitude = recipient_latitude
        cart_item.recipient_longitude = recipient_longitude
        city_dict = get_city_dict(cart_item.sender_city,recipient_city)
        shortest_path, shortest_distance = short_path(city_dict)
        cart_item.total_price= totalprice(shortest_distance,cart_item.package_number, cart_item.weight, cart_item.height, cart_item.width, cart_item.delivery_preferences)
        
        db.session.commit()
        return jsonify({"message": "Recipient Details updated successfully"}),200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# API endpoint to update courier's delivery preferences in cart
@user_views.route('/api/cart/update_delivery_preferences/<int:item_id>', methods=['PUT'])
@login_required
def update_delivery_preferences_cart(item_id):
    data = request.get_json()
    try:
        cart_item = CartItem.query.get(item_id)
        cart_item.delivery_preferences = data['delivery_preferences']
        city_dict = get_city_dict(cart_item.sender_city,cart_item.recipient_city)
        shortest_path, shortest_distance = short_path(city_dict)
        cart_item.total_price= totalprice(shortest_distance,cart_item.package_number, cart_item.weight, cart_item.height, cart_item.width, data['delivery_preferences'])
        db.session.commit()
        return jsonify({"message": "Delivery Preferences updated successfully"}),200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# API endpoint to remove courier from cart
@user_views.route('/api/cart/remove_item/<int:item_id>', methods=['DELETE'])
@login_required
def remove_item(item_id):
    try:
        cart_item = CartItem.query.get(item_id)
        db.session.delete(cart_item)
        db.session.commit()
        return jsonify({"message": "Item removed successfully"}),200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

import random
# Function to generate a custom order ID for courier
def generate_order_id(user_id, i):
    # You can customize the format of your order ID here
    order_id = f"{user_id}{i}{random.randint(100000000, 999999999)}"
    return order_id # Use 2 digits with leading zeros

# API endpoint for checkout
@user_views.route('/api/checkout', methods=['POST'])
@login_required
def checkout():
    try:
        user = User.query.get(current_user.id)
        cartitems = CartItem.query.filter_by(user_id=user.id).all()
        if not cartitems:
            return jsonify({'error': 'Cart is empty. Please add some products first.'}), 400

        # Create a new session
        with db.session.begin_nested():
            for i, cart_item in enumerate(cartitems, start=1):
                # Generate a custom order ID with sequential numbers
                custom_order_id = generate_order_id(user.id, i)

                # Create the Order object within the same transaction context
                order = Order(
                    order_id=custom_order_id,
                    user_id=cart_item.user_id,
                    sender_name=cart_item.sender_name,
                    sender_number=cart_item.sender_number,
                    sender_email=cart_item.sender_email,
                    sender_address=cart_item.sender_address,
                    sender_city=cart_item.sender_city,
                    sender_district=cart_item.sender_district,
                    sender_state=cart_item.sender_state,
                    sender_pincode=cart_item.sender_pincode,
                    sender_latitude=cart_item.sender_latitude,
                    sender_longitude=cart_item.sender_longitude,
                    recipient_name=cart_item.recipient_name,
                    recipient_number=cart_item.recipient_number,
                    recipient_email=cart_item.recipient_email,
                    recipient_address=cart_item.recipient_address,
                    recipient_city=cart_item.recipient_city,
                    recipient_district=cart_item.recipient_district,
                    recipient_state=cart_item.recipient_state,
                    recipient_pincode=cart_item.recipient_pincode,
                    recipient_latitude=cart_item.recipient_latitude,
                    recipient_longitude=cart_item.recipient_longitude,
                    package_number=cart_item.package_number,
                    package_details=cart_item.package_details,
                    weight=cart_item.weight,
                    height=cart_item.height,
                    width=cart_item.width,
                    delivery_preferences=cart_item.delivery_preferences,
                    total_price=cart_item.total_price,
                    created_at=datetime.now()
                )

         

                db.session.add(order)
                db.session.delete(cart_item)

                # Create package tracking entries
                city_dict = get_city_dict(cart_item.sender_city, cart_item.recipient_city)
                shortest_path, shortest_distance = short_path(city_dict)

                for city in shortest_path:
                    courier_manager = Courier_Manager.query.filter_by(courier_manager_city=city).first()
                    if courier_manager:
                        tracking_entry = PackageTracking(
                            user_id=user.id,
                            order_id=custom_order_id,
                            timestamp=datetime.now(),
                            city_list=','.join(shortest_path),
                            current_location_id=courier_manager.courier_manager_location_id,
                            package_tracking_status='received'
                        )

                        db.session.add(tracking_entry)
        db.session.commit()
        send_confirmation_email()
        return jsonify({'message': 'Checkout successful'}), 200

    except Exception as e:

        db.session.rollback()
        print('error', str(e))
        return jsonify({'error': str(e)}), 500

# API endpoint to request for new courier manager courier
@user_views.route('/api/request_for_new_courier_manager', methods=['PUT'])
@login_required
def create_request_for_new_courier_manager():
    data = request.get_json()
    courier_manager_number = data.get('courier_manager_number')
    courier_manager_address = data.get('courier_manager_address')
    courier_manager_city = data.get('courier_manager_city')
    courier_manager_district = data.get('courier_manager_district')
    courier_manager_state = data.get('courier_manager_state')
    courier_manager_pincode = data.get('courier_manager_pincode')
    
    # Get courier_manager_latitude and courier_manager_longitude from another source or function
    courier_manager_latitude = 1 #get_latitude(data.get('courier_manager_city'))
    courier_manager_longitude = 1 #get_longitude(data.get('courier_manager_city'))
    
    # Validate data
    if not all([courier_manager_number, courier_manager_address, courier_manager_city, courier_manager_district, courier_manager_state, courier_manager_pincode, courier_manager_latitude, courier_manager_longitude]):
        return jsonify({'message': 'Missing required fields'}), 400
    # Retrieve the existing request by courier_manager_id
    new_request = Request.query.filter_by(courier_manager_id=current_user.id).first()
    if new_request is None:
        return jsonify({'message': 'Request not found'}), 404

    # Update the request attributes
    new_request.courier_manager_number = courier_manager_number
    new_request.courier_manager_address = courier_manager_address
    new_request.courier_manager_city = courier_manager_city
    new_request.courier_manager_district = courier_manager_district
    new_request.courier_manager_state = courier_manager_state
    new_request.courier_manager_pincode = courier_manager_pincode
    new_request.courier_manager_latitude = courier_manager_latitude
    new_request.courier_manager_longitude = courier_manager_longitude
    # Commit the changes to the database
    try:
        db.session.commit()
    except Exception as e:
        return jsonify({'message': 'Failed to update the request', 'error': str(e)}), 500
    return jsonify({'message': 'Request updated successfully'}), 201


# API endpoint to Fetch requests for the current user
@user_views.route('/api/user_requests', methods=['GET'])
@login_required  
def get_user_requests():
    try:
        user_requests = Request.query.filter_by(courier_manager_id=current_user.id).all()
        user_role = current_user.role

        response_data = {
            'user_role': user_role,
            'requests': [{
                'request_id': request.request_id,
                'action': 'Become a Courier Manager',
                'status': request.status
            } for request in user_requests]
        }
        return jsonify(response_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500 



# API endpoint to get user's orders with tracking details
@user_views.route('/api/user_orders', methods=['GET'])
@login_required
def get_user_orders():
    try:
        curr_user = current_user
        orders = Order.query.filter_by(user_id=curr_user.id).all()
        order_details = []
        for order in orders:
            formatted_order_date = order.created_at.strftime("%Y-%m-%d %I:%M %p")
            # Get the tracking details for the order
            tracking_details = PackageTracking.query.filter_by(order_id=order.order_id).all()
            order_info = {
                "order_id": order.order_id,
                "order_date": formatted_order_date,
                "sender_name": order.sender_name,
                "recipient_name": order.recipient_name,
                "package_number": order.package_number,
                "weight": order.weight,
                "height": order.height,
                "width": order.width,
                "delivery_preferences": order.delivery_preferences,
                "total_price": order.total_price,
                "tracking_details": [{"timestamp": tracking.timestamp.strftime("%Y-%m-%d %I:%M %p"),
                                      "current_location": location.courier_manager_city,
                                      "status": tracking.package_tracking_status,}
                    for tracking in tracking_details
                    for location in [Courier_Manager.query.filter_by(courier_manager_location_id=tracking.current_location_id).first()]]
                }
            order_details.append(order_info)
        return jsonify(order_details), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500



# API endpoint to cancel delivery
@user_views.route('/api/orders/<int:order_id>', methods=['PUT'])
@login_required
def cancel_delivery(order_id):
    try:
        # Find the location by its order_id
        tracking_entries = PackageTracking.query.filter_by(order_id=order_id).all()
        
        if not tracking_entries:
            return jsonify({'error': 'Order not found'}), 404
        last_entry = tracking_entries[-1]  # Get the latest tracking entry
        if last_entry.package_tracking_status == 'delivered':
            return jsonify({'error': 'Order is already delivered and cannot be canceled'}), 400
        elif last_entry.package_tracking_status == 'cancel':
            return jsonify({'error': 'Order is already canceled and cannot be canceled again'}), 401
        else:
            # Update the status to 'cancel'
            last_entry.timestamp = datetime.now()
            last_entry.package_tracking_status = 'cancel'
            db.session.commit()
            send_cancel_email()
            return jsonify({'message': 'Delivery has been successfully canceled'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@user_views.route('/<path:path>')
def catch_all(path):
    return render_template('base.html')
