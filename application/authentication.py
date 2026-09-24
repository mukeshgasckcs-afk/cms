from . import db
from .models import  User,Cart,CartItem,Order,Request,Courier_Manager,PackageTracking
from flask import Flask, render_template, request, redirect, url_for, flash, jsonify, abort,send_from_directory,send_file,Blueprint
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from functools import wraps
from flask_bcrypt import Bcrypt
import os  

bcrypt = Bcrypt()

# the authentication  blueprint
authentication = Blueprint("authentication",__name__)

# role decorator
def role_required(role):
    def decorator(func):
        @wraps(func)
        def decorated_function(*args, **kwargs):
            if not current_user.is_authenticated:
                abort(401)  # Unauthorized
            if current_user.role != role:
                abort(403)  # Forbidden
            return func(*args, **kwargs)
        return decorated_function
    return decorator


# index Route
@authentication.route('/')
def index():
    return render_template('base.html')



# API endpoints

# route for register user
@authentication.route('/api/register', methods=['POST'])
def register_user():
    data = request.get_json()
    name = data.get('name')
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    role = "regular user"
    
    if username.startswith("manager"):
        existing_manager = User.query.filter_by(username=username).first()
        if existing_manager:
            return jsonify({"message": "Username already exists"}), 400
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        new_user = User(name =name,username=username,email=email, password=hashed_password, role=role)
        db.session.add(new_user)
        db.session.commit()
        add_manager_request = Request(courier_manager_id=new_user.id, action='add_location')
        db.session.add(add_manager_request)
        db.session.commit()
        flash("Request to sign up as manager has been sent to the admin for review.")
    else:
        existing_user = User.query.filter_by(username=username).first()
        if existing_user:
            return jsonify({"message": "Username already exists"}), 400
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        new_user = User(name =name,username=username,email=email, password=hashed_password, role=role)
        db.session.add(new_user)
        db.session.commit()

    return jsonify({"message": "Registration successful", "role": role})

# route for login
@authentication.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    user = User.query.filter_by(username=username).first()
    if user and  bcrypt.check_password_hash(user.password, password):
        login_user(user)
        return jsonify({"role": user.role}), 200
    return jsonify({"message": "Invalid Username or password"}), 401

# route for check_user to proceed password recovery
@authentication.route('/api/check_user', methods=['POST'])
def check_user():
    data = request.get_json()
    username = data.get('username')
    name = data.get('name')
    email = data.get('email')
    user = User.query.filter_by(username=username,name=name,email=email).first()
    if user:
        return jsonify({"role": user.role}), 200
    return jsonify({"message": "Invalid User Data"}), 401


# route for update password
@authentication.route('/api/update_password', methods=['PUT'])
def update_password():
    data = request.get_json()
    username = data.get('username')
    password = data.get('newPassword')
    user = User.query.filter_by(username=username).first()
    if user:
        user.password = bcrypt.generate_password_hash(password).decode('utf-8')
        db.session.commit()
        return jsonify({"message": "User password updated "}), 200
    return jsonify({"message": "Invalid User Data"}), 401

# route for logout
@authentication.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('authentication.index'))