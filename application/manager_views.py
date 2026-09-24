from . import db
from datetime import datetime  
import csv
import os
from .mail import send_confirmation_email,send_notification_email,send_transit_email,send_cancel_email,send_deliver_email
from .models import  User,Cart,CartItem,Order,Request,Courier_Manager,PackageTracking
from flask import Flask, render_template, request, redirect, url_for, flash, jsonify, abort,send_from_directory,send_file,Blueprint
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
#from celery_wroker import Celery, make_celery
from flask_mail import Mail, Message
from sqlalchemy.exc import SQLAlchemyError
from .authentication import authentication,role_required


# the manager  blueprint
manager_views = Blueprint("manager_views", __name__)

# API endpoint for getting orders by location
@manager_views.route('/api/orders_by_location', methods=['GET'])
@login_required 
@role_required('manager')
def get_orders_by_location():
    try:
        curr_courier_manager = Courier_Manager.query.filter_by(courier_manager_id=current_user.id).first()
        curr_courier_manager_location_id = curr_courier_manager.courier_manager_location_id
        orders = PackageTracking.query.filter_by(current_location_id=curr_courier_manager_location_id).all()
        orders_list = []
        for order in orders:
            city_list = order.city_list.split(',') 
            current_city_index = city_list.index(curr_courier_manager.courier_manager_city)
            if current_city_index >0:
                previous_received_city = None
                for i in range(current_city_index):
                    city = city_list[i]
                    location = Courier_Manager.query.filter_by(courier_manager_city=city).first()
                    if location:
                        location_id = location.courier_manager_location_id
                        prev_order = PackageTracking.query.filter_by(order_id=order.order_id, current_location_id=location_id).first()
                        if prev_order and prev_order.package_tracking_status == 'in transit':
                            previous_received_city = city 
                if previous_received_city is not None:
                    order_details = {
                        'package_tracking_id': order.package_tracking_id,
                        'user_id': order.user_id,
                        'order_id': order.order_id,
                        'timestamp': order.timestamp,
                        'city_list': order.city_list,
                        'curr_city':curr_courier_manager.courier_manager_city,
                        'package_tracking_status': order.package_tracking_status,
                        'previous_received_city': previous_received_city
                    }
                    
                    orders_list.append(order_details)
                orders.remove(order)
        # The remaining orders are processed here
        for order in orders:
            order_details = {
                'package_tracking_id': order.package_tracking_id,
                'user_id': order.user_id,
                'order_id': order.order_id,
                'timestamp': order.timestamp,
                'city_list': order.city_list,
                'curr_city':curr_courier_manager.courier_manager_city,
                'package_tracking_status': order.package_tracking_status,
                'previous_received_city': '' 
            }
            
            orders_list.append(order_details)
        return jsonify(orders_list)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# API endpoint for transitting order
@manager_views.route('/transit_order/<int:tracking_id>', methods=['POST'])
@login_required 
@role_required('manager')
def transit_order(tracking_id):
    try:
        # Fetch the PackageTracking record by tracking_id
        package_tracking= PackageTracking.query.get(tracking_id)
        # Update status and timestamp
        
        package_tracking.package_tracking_status = 'in transit'
        package_tracking.timestamp = datetime.now()

        # Commit changes to the database
        db.session.commit()
        send_transit_email()
        return jsonify({'message': 'Order is now in transit', 'status': 'In transit'}),201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# API endpoint for delivering order
@manager_views.route('/deliver_order/<int:tracking_id>', methods=['POST'])
@login_required 
@role_required('manager')
def deliver_order(tracking_id):
    try:
        # Fetch the PackageTracking record by tracking_id
        package_trackings = PackageTracking.query.get(tracking_id)
        package_trackings = PackageTracking.query.filter_by(order_id=package_trackings.order_id).all()

        # Update status and timestamp
        for package_tracking in package_trackings:
            package_tracking.package_tracking_status = 'delivered'
            package_tracking.timestamp = datetime.now()

        # Commit changes to the database
        db.session.commit()
        send_deliver_email()
        return jsonify({'message': 'Order has been delivered', 'status': 'Delivered'}),201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# API endpoint for getting manager username
@manager_views.route('/api/manager_username', methods=['GET'])
@login_required 
@role_required('manager')
def get_manager_username():
    curr_courier_manager = Courier_Manager.query.filter_by(courier_manager_id=current_user.id).first()
    manager_username = curr_courier_manager.courier_manager_username
    try:
        manager_username = manager_username
        return jsonify({'manager_username': manager_username})
    except Exception as e:
        return jsonify({'error': 'An error occurred while fetching the manager_username.', 'details': str(e)})

# API endpoint for generattingcsv
@manager_views.route('/api/generate-csv', methods=['GET'])
@login_required
@role_required('manager')
def generate_csv():
    curr_courier_manager = Courier_Manager.query.filter_by(courier_manager_id=current_user.id).first()
    manager_username = curr_courier_manager.courier_manager_username
    orders = PackageTracking.query.filter_by(current_location_id=curr_courier_manager.courier_manager_location_id).all()
    csv_directory = 'System/application/static/manager_csv'
    os.makedirs(csv_directory, exist_ok=True)
    csv_filename = os.path.join(csv_directory, f'{manager_username}_report.csv')
    with open(csv_filename, 'w', newline='') as csvfile:
        fieldnames = ['Order ID', 'Package Number', 'Delivery Preferences', 'Total Price']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        for order in orders:
            order_id = order.order_id
            order_details = Order.query.get(order_id)
            package_number = order_details.package_number
            delivery_preferences = order_details.delivery_preferences
            total_price = order_details.total_price
            writer.writerow({
                'Order ID': order_id,
                'Package Number': package_number,
                'Delivery Preferences': delivery_preferences,
                'Total Price': total_price,
            }) 
        send_notification_email()   
    return send_from_directory('static/manager_csv', f'{manager_username}_report.csv', as_attachment=True)


