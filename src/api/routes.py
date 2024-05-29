"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api, resources={r"/*": {"origins": "*"}})

@api.route('/user', methods=['GET'])
@jwt_required()
def get_user():
    all_users = User.query.all()
    results = [user.serialize() for user in all_users]
    return jsonify(results), 200

@api.route('/login', methods=['POST'])
def login():
    email = request.json.get("email")
    password = request.json.get("password")
    
    if not email or not password:
        return jsonify({"message": "Missing email or password"}), 400

    user = User.query.filter_by(email=email).first()
    
    if user is None or password != user.password:
        return jsonify({"message": "Invalid email or password"}), 401
    
    access_token = create_access_token(identity=email)
    return jsonify(access_token=access_token), 200



@api.route('/check_user', methods=['GET'])
def check_user():
    email = request.args.get("email")
    
    if not email:
        return jsonify({"message": "Missing email parameter"}), 400

    user = User.query.filter_by(email=email).first()
    
    if user is None:
        return jsonify({"message": "User does not exist"}), 404
    
    return jsonify({"message": "User exists"}), 200



@api.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        body = request.get_json()
        if not body or "email" not in body or "password" not in body:
            return jsonify({"message": "Missing email or password"}), 400

        user = User.query.filter_by(email=body["email"]).first()
        if user is not None:
            return jsonify({"message": "The user already exists"}), 401

        new_user = User(email=body["email"], password=body["password"], is_active=True)
        db.session.add(new_user)
        db.session.commit()

        response_body = {"msg": "User created"}
        return jsonify(response_body), 200

    elif request.method == 'GET':
        try:
            all_users = User.query.all()
            users_list = [user.serialize() for user in all_users]
            return jsonify(users_list), 200
        except Exception as e:
            return jsonify({"message": str(e)}), 500

@api.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200



app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'super-secret-key'
jwt = JWTManager(app)
app.register_blueprint(api, url_prefix='/api')

if __name__ == '__main__':
    app.run()