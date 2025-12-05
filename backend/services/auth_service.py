import pyotp
import secrets
import re
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, create_refresh_token, decode_token
from extensions import db
from models.user import User

def register_user(data):
    username = data.get('username')
    email = data.get('email')
    phone = data.get('phone')
    password = data.get('password')

    # Check if user already exists
    existing_user = User.query.filter(
        (User.username == username) |
        (User.email == email) |
        (User.phone == phone)
    ).first()
    if existing_user:
        return {"error": "User with this username, email, or phone already exists"}

    # Hash the password
    password_hash = generate_password_hash(password)

    # Create new user
    new_user = User(
        username=username,
        email=email,
        phone=phone,
        password_hash=password_hash
    )

    # Save to database
    db.session.add(new_user)
    db.session.commit()

    return {"message": "User registered successfully", "user_id": new_user.id}

def authenticate_user(email_or_username, password):
    user = User.query.filter(
        (User.email == email_or_username) |
        (User.username == email_or_username)
    ).first()

    if user and check_password_hash(user.password_hash, password):
        user.last_login = datetime.utcnow()
        db.session.commit()
        access_token = create_access_token(identity=user.id)
        refresh_token = create_refresh_token(identity=user.id)
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "phone": user.phone,
                "is_verified": user.is_verified,
                "kyc_status": user.kyc_status
            }
        }
    return None

def re_authenticate_admin(user_id, password):
    user = User.query.get(user_id)
    if user and user.role == 'admin' and check_password_hash(user.password_hash, password):
        return True
    return False
