from flask_sqlalchemy import SQLAlchemy
from flask import Flask, render_template, request, redirect, url_for, flash, jsonify, abort,send_from_directory,send_file
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from datetime import datetime, timedelta  
from functools import wraps
#from celery_wroker import Celery, make_celery
from flask_mail import Mail, Message
from flask_bcrypt import Bcrypt
from sqlalchemy.exc import SQLAlchemyError
from os import path

bcrypt = Bcrypt()

db = SQLAlchemy(session_options={"autoflush": False})
mail = Mail()

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'cf559170bf7a85a6f3f7e4dcfdb5bc11'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///todos.db'

    db.init_app(app)
    # Push the app context
    app.app_context().push()
    # Celery configuration
    #app.config['CELERY_BROKER_URL'] = 'redis://localhost:6379/0'
    #app.config['CELERY_RESULT_BACKEND'] = 'redis://localhost:6379/0'

    # Email configuration
    app.config['MAIL_SERVER'] = 'smtp.gmail.com'
    app.config['MAIL_PORT'] = 465  # Use the appropriate port
    app.config['MAIL_USERNAME'] = 'mad2023may@gmail.com'
    app.config['MAIL_PASSWORD'] = 'suun mevp tjok wntk'
    app.config['MAIL_USE_TLS'] = False
    app.config['MAIL_USE_SSL'] = True
    # Create a Celery instance
    #celery = make_celery(app)

    # Initialize Flask-Mail
    mail.init_app(app)



    # Import and register the views blueprint
    from .user_views import user_views
    app.register_blueprint(user_views,url_prefix="/")

    from .admin_views import admin_views
    app.register_blueprint(admin_views,url_prefix="/")

    from .manager_views import manager_views
    app.register_blueprint(manager_views,url_prefix="/")
    # Import and register the authentication blueprint
    from .authentication import authentication
    app.register_blueprint(authentication,url_prefix="/")

    from .models import  User,Cart,CartItem,Order,Request,Courier_Manager,PackageTracking
    create_database()
    # Initialize the LoginManager
    login_manager = LoginManager(app)
    
  # Login Manager Configuration
    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))
        
    return app

def create_database():
    if not path.exists("applicaton/"+"todos.db"):
        db.create_all()
        print("Created database!")

    