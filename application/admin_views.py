from . import db
from application.summary import generate_graphs
from flask import Flask, render_template, request, redirect, url_for, flash, jsonify, abort,send_from_directory,send_file,Blueprint
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
#from celery_wroker import Celery, make_celery
from flask_mail import Mail, Message
from sqlalchemy.exc import SQLAlchemyError
from .models import  User,Cart,CartItem,Order,Request,Courier_Manager,PackageTracking
from .authentication import authentication,role_required
from .user_views import user_views

# the admin_views  blueprint
admin_views = Blueprint("admin_views", __name__)

# admin Section 

#  API endpoint to get all locations
@admin_views.route('/api/locations', methods=['GET'])
@login_required
def get_locations():
    locations = Courier_Manager.query.all()
    locations_list = []

    for location in locations:
        locations_data = {
            'courier_manager_location_id': location.courier_manager_location_id,
            'courier_manager_id': location.courier_manager_id,
            'courier_manager_city': location.courier_manager_city,
            'courier_manager_district': location.courier_manager_district,
            'courier_manager_state':location.courier_manager_state,
            'courier_manager_pincode': location.courier_manager_pincode,

        }
        locations_list.append(locations_data)
    return jsonify(locations_list)



# Update an existing location of courier manager
@admin_views.route('/api/locations/<int:courier_manager_location_id>', methods=['PUT'])
@login_required
def update_location(courier_manager_location_id):
    data = request.json
    #print("Received JSON Data:", data) 

    courier_manager_city = data.get('courier_manager_city')
    courier_manager_district = data.get('courier_manager_district')
    courier_manager_state= data.get('courier_manager_state')
    courier_manager_pincode= data.get('courier_manager_pincode')

    if not all([courier_manager_city,courier_manager_district, courier_manager_state, courier_manager_pincode]):
            return jsonify({'message': 'Missing required fields'}), 400
    location = Courier_Manager.query.get_or_404(courier_manager_location_id)
    try:
        location.courier_manager_city = courier_manager_city
        location.courier_manager_district = courier_manager_district
        location.courier_manager_state = courier_manager_state
        location.courier_manager_pincode = courier_manager_pincode
        db.session.commit()
    except Exception as e:
            return jsonify({'message': 'Failed to edit the location', 'error': str(e)}), 500
    return jsonify({'message': 'Location updated successfully'}), 200

# Delete an existing location of courier manager
@admin_views.route('/api/locations/<int:courier_manager_location_id>', methods=['DELETE'])
@login_required
def delete_location(courier_manager_location_id):
    try:
        # Find the location by its ID
        location = Courier_Manager.query.get(courier_manager_location_id)
        if location:
            # Delete the product
            db.session.delete(location)
            db.session.commit()
            return jsonify({'message': 'Location deleted successfully'}), 200
        else:
            return jsonify({'error': 'Location not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500


#  API endpoint to get all requests from future courier manager
@admin_views.route('/api/requests', methods=['GET'])
@login_required
def get_requests():
    requests = Request.query.all()
    request_list = []

    for request in requests:
        request_data = {
            'request_id': request.request_id,
            'user_id': request.courier_manager_id,
            'name': request.user.name,
            'username': request.user.username,
            'email': request.user.email,
            'role': request.user.role,
            'courier_manager_number': request.courier_manager_number,
            'courier_manager_address': request.courier_manager_address,
            'courier_manager_city': request.courier_manager_city,
            'courier_manager_district': request.courier_manager_district,
            'courier_manager_state':request.courier_manager_state,
            'courier_manager_pincode': request.courier_manager_pincode,
            'action': request.action,
            'status': request.status,
        }
        request_list.append(request_data)
    return jsonify(request_list)


# API endpoint to approve manager request
@admin_views.route('/api/request/approve/<int:request_id>', methods=['POST'])
@login_required
@role_required('admin')
def approve_request(request_id):
    try:
        request_data = request.get_json()
        request_obj = Request.query.get(request_id)

        if request_obj is None:
            return jsonify({'message': 'Request not found'}), 404

        if request_data['action'] == 'approve':
            request_obj.status = 'approved'

            if request_obj.action == 'add_location':
                # Update the user's role to 'manager'
                user_obj = User.query.get(request_obj.courier_manager_id)
                if user_obj:
                    user_obj.role = 'manager'

                # Create a new Courier_Manager entry with the approved request details
                new_courier_manager = Courier_Manager(
                    courier_manager_id=request_obj.courier_manager_id,
                    courier_manager_name=user_obj.name,
                    courier_manager_username=user_obj.username,
                    courier_manager_email=user_obj.email,
                    courier_manager_number=request_obj.courier_manager_number,
                    courier_manager_address=request_obj.courier_manager_address,
                    courier_manager_city=request_obj.courier_manager_city,
                    courier_manager_district=request_obj.courier_manager_district,
                    courier_manager_state=request_obj.courier_manager_state,
                    courier_manager_pincode=request_obj.courier_manager_pincode,
                    courier_manager_latitude=request_obj.courier_manager_latitude,
                    courier_manager_longitude=request_obj.courier_manager_longitude
                )

                # Add the new_courier_manager object to the session and commit it
                db.session.add(new_courier_manager)
                db.session.commit()

            # Return a success message as a response
            return jsonify({'message': 'Request approved successfully'}), 200
        else:
            return jsonify({'message': 'Invalid action'}), 400

    except Exception as e:
        return jsonify({'message': str(e)}), 500


# API endpoint to reject manager request
@admin_views.route('/api/request/reject/<int:request_id>', methods=['POST'])
@login_required
@role_required('admin')
def reject_request(request_id):
    try:
        request_data = request.get_json()
        request_obj = Request.query.get(request_id)
        user_obj = User.query.get(request_obj.courier_manager_id)
        print(user_obj)
        if request_obj is None:
            return jsonify({'message': 'Request not found'}), 404

        if request_data['action'] == 'reject':
            request_obj.status = 'rejected'
            user_obj.role = 'regular user'
            db.session.commit()
            return jsonify({'message': 'Request rejected'})

        else:
            return jsonify({'message': 'Invalid action'}), 400

    except Exception as e:
        return jsonify({'message': str(e)}), 500


# API endpoint for generating and serving graphs
@admin_views.route('/api/generate_graphs', methods=['GET'])
@login_required
@role_required('admin')
def generate_and_serve_graphs():
    try:
        generate_graphs()  # Generate the graphs
        return jsonify({'message': 'Graphs generated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500