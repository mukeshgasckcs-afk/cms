from . import db
from flask_login import UserMixin

# the User model
class User(UserMixin, db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(50), nullable=False)
    password = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # "admin", "manager", "regular user"
    
    requests = db.relationship('Request', backref='user', lazy='dynamic', cascade='all, delete-orphan', single_parent=True)
    cart = db.relationship('Cart', backref='user', lazy=True, uselist=False) 
    cart_items = db.relationship('CartItem', backref='user', lazy=True, cascade='all, delete-orphan', single_parent=True)
    orders = db.relationship('Order', backref='user', lazy=True, cascade='all, delete-orphan', single_parent=True)
    packagetracking = db.relationship('PackageTracking', backref='user', lazy=True, cascade='all, delete-orphan', single_parent=True)


# the Request model
class Request(db.Model):
    __tablename__ = 'request'
    request_id = db.Column(db.Integer, primary_key=True)
    courier_manager_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    courier_manager_number = db.Column(db.Integer)
    courier_manager_address = db.Column(db.String(200))
    courier_manager_city = db.Column(db.String(200))
    courier_manager_district = db.Column(db.String(200))
    courier_manager_state = db.Column(db.String(200))
    courier_manager_pincode = db.Column(db.Integer)
    courier_manager_latitude = db.Column(db.Float)
    courier_manager_longitude = db.Column(db.Float)
    action = db.Column(db.String(20), nullable=False)  # 'add_location'
    status = db.Column(db.String(20), default='pending')  # 'pending', 'approved', 'rejected'

# the Courier Manager model
class Courier_Manager(db.Model):
    __tablename__ = 'courier_manager'
    courier_manager_location_id = db.Column(db.Integer, primary_key=True)
    courier_manager_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    courier_manager_name = db.Column(db.String(100), db.ForeignKey('user.name'), nullable=False)
    courier_manager_username = db.Column(db.String(50),db.ForeignKey('user.username'), nullable=False)
    courier_manager_email = db.Column(db.String(50),db.ForeignKey('user.email'), nullable=False)
    courier_manager_number = db.Column(db.Integer,nullable=False)
    courier_manager_address = db.Column(db.String(200),  nullable=False)
    courier_manager_city = db.Column(db.String(200),nullable=False)
    courier_manager_district = db.Column(db.String(200),nullable=False)
    courier_manager_state = db.Column(db.String(200), nullable=False)
    courier_manager_pincode = db.Column(db.Integer,nullable=False)
    courier_manager_latitude = db.Column(db.Float, nullable=False)
    courier_manager_longitude = db.Column(db.Float,nullable=False)
    packagetracking = db.relationship('PackageTracking', backref='courier_manager', lazy=True, cascade='all, delete-orphan', single_parent=True)

# the Cart model
class Cart(db.Model):
    __tablename__ = 'cart'
    cart_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False)
    cart_items = db.relationship('CartItem', backref='cart', lazy=True)

# the CartItem model
class CartItem(db.Model):
    __tablename__ = 'cart_item'
    item_id = db.Column(db.Integer, primary_key=True)
    cart_id = db.Column(db.Integer, db.ForeignKey('cart.cart_id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    sender_name = db.Column(db.String(100), nullable=False)
    sender_number = db.Column(db.Integer, nullable=False)
    sender_email = db.Column(db.String(100), nullable=False)  
    sender_address = db.Column(db.String(200), nullable=False)
    sender_city = db.Column(db.String(200), nullable=False)
    sender_district = db.Column(db.String(200), nullable=False)
    sender_state = db.Column(db.String(200), nullable=False)
    sender_pincode = db.Column(db.Integer, nullable=False)
    sender_latitude = db.Column(db.Float, nullable=False)
    sender_longitude = db.Column(db.Float, nullable=False)
    
    recipient_name = db.Column(db.String(100), nullable=False)
    recipient_number = db.Column(db.Integer, nullable=False)
    recipient_email = db.Column(db.String(100), nullable=False)  
    recipient_address = db.Column(db.String(200), nullable=False)
    recipient_city = db.Column(db.String(200), nullable=False)
    recipient_district = db.Column(db.String(200), nullable=False)
    recipient_state = db.Column(db.String(200), nullable=False)
    recipient_pincode = db.Column(db.Integer, nullable=False)
    recipient_latitude = db.Column(db.Float, nullable=False)
    recipient_longitude = db.Column(db.Float, nullable=False)
    
    package_number = db.Column(db.Integer,nullable=False,default=0.0)
    package_details = db.Column(db.String(200))
    weight = db.Column(db.Float)  # Add fields for weight, height, width, etc.
    height = db.Column(db.Float)
    width = db.Column(db.Float)
    delivery_preferences = db.Column(db.String(200),nullable=False,default='standard')
    total_price = db.Column(db.Float, nullable=False, default=0.0)


# the Order model
class Order(db.Model):
    __tablename__ = 'order'
    order_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    sender_name = db.Column(db.String(100), nullable=False)
    sender_number = db.Column(db.Integer, nullable=False)
    sender_email = db.Column(db.String(100), nullable=False)  
    sender_address = db.Column(db.String(200), nullable=False)
    sender_city = db.Column(db.String(200), nullable=False)
    sender_district = db.Column(db.String(200), nullable=False)
    sender_state = db.Column(db.String(200), nullable=False)
    sender_pincode = db.Column(db.Integer, nullable=False)
    sender_latitude = db.Column(db.Float, nullable=False)
    sender_longitude = db.Column(db.Float, nullable=False)
    
    recipient_name = db.Column(db.String(100), nullable=False)
    recipient_number = db.Column(db.Integer, nullable=False)
    recipient_email = db.Column(db.String(100), nullable=False)  
    recipient_address = db.Column(db.String(200), nullable=False)
    recipient_city = db.Column(db.String(200), nullable=False)
    recipient_district = db.Column(db.String(200), nullable=False)
    recipient_state = db.Column(db.String(200), nullable=False)
    recipient_pincode = db.Column(db.Integer, nullable=False)
    recipient_latitude = db.Column(db.Float, nullable=False)
    recipient_longitude = db.Column(db.Float, nullable=False)
    
    package_number = db.Column(db.Integer,nullable=False,default=0.0)
    package_details = db.Column(db.String(200))
    weight = db.Column(db.Float)  
    height = db.Column(db.Float)
    width = db.Column(db.Float)
    delivery_preferences = db.Column(db.String(200),nullable=False,default='standard')
    total_price = db.Column(db.Float, nullable=False, default=0.0)
    created_at = db.Column(db.DateTime, nullable=False)
    
    packagetracking = db.relationship('PackageTracking', backref='order', lazy=True, cascade='all, delete-orphan', single_parent=True)

# the PackageTracking model
class PackageTracking(db.Model):
    __tablename__ = 'package_tracking'
    package_tracking_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    order_id = db.Column(db.Integer, db.ForeignKey('order.order_id'), nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False)
    city_list = db.Column(db.String(200),nullable=False)
    current_location_id = db.Column(db.String(200),db.ForeignKey('courier_manager.courier_manager_location_id'), nullable=False)
    package_tracking_status = db.Column(db.String(20), default='received',nullable=False)  # received,'in transit',cancel,delivered 

