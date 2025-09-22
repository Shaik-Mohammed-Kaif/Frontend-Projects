#!/usr/bin/env python3
"""
GymPro Website Backend API
Flask application serving gym exercise and reservation data from CSV files
Author: S Mohammed Kaif
GitHub: https://github.com/Shaik-Mohammed-Kaif/GymPro-Website
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import csv
import os
import json
from datetime import datetime

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# CSV file paths
MENU_CSV = 'menu.csv'
RESERVATIONS_CSV = 'reservations.csv'
USERS_CSV = 'users.csv'

def init_csv_files():
    """Initialize CSV files with headers if they don't exist"""
    
    # Initialize menu.csv
    if not os.path.exists(MENU_CSV):
        with open(MENU_CSV, 'w', newline='', encoding='utf-8') as file:
            writer = csv.writer(file)
            writer.writerow(['id', 'exercise_name', 'duration', 'calories_burn', 'description', 'difficulty'])
            # Add sample data
            sample_exercises = [
                [1, 'Strength Training', '45 minutes', 350, 'Build muscle and strength with comprehensive weight training', 'Intermediate'],
                [2, 'Cardio Blast', '30 minutes', 400, 'High-intensity cardio workout to boost heart rate', 'Beginner'],
                [3, 'Yoga Flow', '60 minutes', 250, 'Improve flexibility, balance, and mindfulness', 'Beginner'],
                [4, 'Personal Training', '50 minutes', 450, 'One-on-one training sessions customized to your goals', 'Advanced'],
                [5, 'HIIT Circuit', '35 minutes', 500, 'High-Intensity Interval Training for maximum calorie burn', 'Advanced'],
                [6, 'Pilates Core', '45 minutes', 300, 'Strengthen your core and improve posture', 'Intermediate']
            ]
            writer.writerows(sample_exercises)
    
    # Initialize reservations.csv
    if not os.path.exists(RESERVATIONS_CSV):
        with open(RESERVATIONS_CSV, 'w', newline='', encoding='utf-8') as file:
            writer = csv.writer(file)
            writer.writerow(['id', 'name', 'date', 'time', 'trainer', 'session_type', 'email', 'phone', 'created_at'])
            # Add sample reservation
            writer.writerow([1, 'John Doe', '2024-01-15', '09:00', 'Mike Johnson', 'Strength Training', 'john.doe@email.com', '+1-555-0123', datetime.now().isoformat()])
    
    # Initialize users.csv
    if not os.path.exists(USERS_CSV):
        with open(USERS_CSV, 'w', newline='', encoding='utf-8') as file:
            writer = csv.writer(file)
            writer.writerow(['id', 'name', 'email', 'membership_type', 'created_at'])
            # Add sample users
            sample_users = [
                [1, 'John Doe', 'john.doe@email.com', 'Premium', datetime.now().isoformat()],
                [2, 'Jane Smith', 'jane.smith@email.com', 'Basic', datetime.now().isoformat()],
                [3, 'Mike Wilson', 'mike.wilson@email.com', 'VIP', datetime.now().isoformat()]
            ]
            writer.writerows(sample_users)

def read_csv_file(filename):
    """Read CSV file and return data as list of dictionaries"""
    try:
        with open(filename, 'r', newline='', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            return list(reader)
    except FileNotFoundError:
        return []
    except Exception as e:
        print(f"Error reading {filename}: {e}")
        return []

def write_csv_file(filename, data, fieldnames):
    """Write data to CSV file"""
    try:
        with open(filename, 'w', newline='', encoding='utf-8') as file:
            writer = csv.DictWriter(file, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(data)
        return True
    except Exception as e:
        print(f"Error writing to {filename}: {e}")
        return False

def get_next_id(filename):
    """Get the next available ID for a CSV file"""
    data = read_csv_file(filename)
    if not data:
        return 1
    try:
        max_id = max(int(row['id']) for row in data if row.get('id'))
        return max_id + 1
    except (ValueError, KeyError):
        return len(data) + 1

# Routes

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'GymPro API is running',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/exercises', methods=['GET'])
def get_exercises():
    """Get all exercises from menu.csv"""
    try:
        exercises = read_csv_file(MENU_CSV)
        
        # Convert string values to appropriate types
        for exercise in exercises:
            try:
                exercise['calories_burn'] = int(exercise['calories_burn'])
                exercise['id'] = int(exercise['id'])
            except (ValueError, KeyError):
                pass
        
        return jsonify({
            'success': True,
            'data': exercises,
            'count': len(exercises)
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Failed to fetch exercises: {str(e)}'
        }), 500

@app.route('/api/exercises/<int:exercise_id>', methods=['GET'])
def get_exercise_by_id(exercise_id):
    """Get specific exercise by ID"""
    try:
        exercises = read_csv_file(MENU_CSV)
        exercise = next((ex for ex in exercises if int(ex['id']) == exercise_id), None)
        
        if exercise:
            exercise['calories_burn'] = int(exercise['calories_burn'])
            exercise['id'] = int(exercise['id'])
            return jsonify({
                'success': True,
                'data': exercise
            }), 200
        else:
            return jsonify({
                'success': False,
                'error': 'Exercise not found'
            }), 404
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Failed to fetch exercise: {str(e)}'
        }), 500

@app.route('/api/reservations', methods=['GET'])
def get_reservations():
    """Get all reservations from reservations.csv"""
    try:
        reservations = read_csv_file(RESERVATIONS_CSV)
        
        # Convert string IDs to integers
        for reservation in reservations:
            try:
                reservation['id'] = int(reservation['id'])
            except (ValueError, KeyError):
                pass
        
        return jsonify({
            'success': True,
            'data': reservations,
            'count': len(reservations)
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Failed to fetch reservations: {str(e)}'
        }), 500

@app.route('/api/reservations', methods=['POST'])
def create_reservation():
    """Create a new reservation"""
    try:
        # Validate request data
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'error': 'No data provided'
            }), 400
        
        # Required fields validation
        required_fields = ['name', 'date', 'time', 'trainer', 'session_type']
        missing_fields = [field for field in required_fields if not data.get(field)]
        
        if missing_fields:
            return jsonify({
                'success': False,
                'error': f'Missing required fields: {", ".join(missing_fields)}'
            }), 400
        
        # Validate date format
        try:
            datetime.strptime(data['date'], '%Y-%m-%d')
        except ValueError:
            return jsonify({
                'success': False,
                'error': 'Invalid date format. Use YYYY-MM-DD'
            }), 400
        
        # Validate time format
        try:
            datetime.strptime(data['time'], '%H:%M')
        except ValueError:
            return jsonify({
                'success': False,
                'error': 'Invalid time format. Use HH:MM'
            }), 400
        
        # Read existing reservations
        reservations = read_csv_file(RESERVATIONS_CSV)
        
        # Check for time slot conflicts
        conflict = any(
            res['date'] == data['date'] and 
            res['time'] == data['time'] and 
            res['trainer'] == data['trainer']
            for res in reservations
        )
        
        if conflict:
            return jsonify({
                'success': False,
                'error': f'Time slot {data["time"]} on {data["date"]} with {data["trainer"]} is already booked'
            }), 409
        
        # Create new reservation
        new_reservation = {
            'id': get_next_id(RESERVATIONS_CSV),
            'name': data['name'].strip(),
            'date': data['date'],
            'time': data['time'],
            'trainer': data['trainer'].strip(),
            'session_type': data['session_type'].strip(),
            'email': data.get('email', '').strip(),
            'phone': data.get('phone', '').strip(),
            'created_at': datetime.now().isoformat()
        }
        
        # Add to reservations list
        reservations.append(new_reservation)
        
        # Write back to CSV
        fieldnames = ['id', 'name', 'date', 'time', 'trainer', 'session_type', 'email', 'phone', 'created_at']
        if write_csv_file(RESERVATIONS_CSV, reservations, fieldnames):
            return jsonify({
                'success': True,
                'message': 'Reservation created successfully',
                'data': new_reservation
            }), 201
        else:
            return jsonify({
                'success': False,
                'error': 'Failed to save reservation'
            }), 500
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Failed to create reservation: {str(e)}'
        }), 500

@app.route('/api/users', methods=['GET'])
def get_users():
    """Get all users from users.csv"""
    try:
        users = read_csv_file(USERS_CSV)
        
        # Convert string IDs to integers
        for user in users:
            try:
                user['id'] = int(user['id'])
            except (ValueError, KeyError):
                pass
        
        return jsonify({
            'success': True,
            'data': users,
            'count': len(users)
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Failed to fetch users: {str(e)}'
        }), 500

@app.route('/api/users', methods=['POST'])
def create_user():
    """Create a new user"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'error': 'No data provided'
            }), 400
        
        # Required fields validation
        required_fields = ['name', 'email', 'membership_type']
        missing_fields = [field for field in required_fields if not data.get(field)]
        
        if missing_fields:
            return jsonify({
                'success': False,
                'error': f'Missing required fields: {", ".join(missing_fields)}'
            }), 400
        
        # Validate membership type
        valid_memberships = ['Basic', 'Premium', 'VIP']
        if data['membership_type'] not in valid_memberships:
            return jsonify({
                'success': False,
                'error': f'Invalid membership type. Must be one of: {", ".join(valid_memberships)}'
            }), 400
        
        # Read existing users
        users = read_csv_file(USERS_CSV)
        
        # Check for duplicate email
        if any(user['email'].lower() == data['email'].lower() for user in users):
            return jsonify({
                'success': False,
                'error': 'Email already exists'
            }), 409
        
        # Create new user
        new_user = {
            'id': get_next_id(USERS_CSV),
            'name': data['name'].strip(),
            'email': data['email'].strip().lower(),
            'membership_type': data['membership_type'],
            'created_at': datetime.now().isoformat()
        }
        
        # Add to users list
        users.append(new_user)
        
        # Write back to CSV
        fieldnames = ['id', 'name', 'email', 'membership_type', 'created_at']
        if write_csv_file(USERS_CSV, users, fieldnames):
            return jsonify({
                'success': True,
                'message': 'User created successfully',
                'data': new_user
            }), 201
        else:
            return jsonify({
                'success': False,
                'error': 'Failed to save user'
            }), 500
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Failed to create user: {str(e)}'
        }), 500

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'success': False,
        'error': 'Endpoint not found'
    }), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        'success': False,
        'error': 'Internal server error'
    }), 500

if __name__ == '__main__':
    # Initialize CSV files
    init_csv_files()
    
    # Run the app
    print("🏋️ GymPro API Server Starting...")
    print("📁 CSV files initialized")
    print("🌐 Server running on http://localhost:5000")
    print("📖 API Documentation:")
    print("   GET  /api/health       - Health check")
    print("   GET  /api/exercises    - Get all exercises")
    print("   GET  /api/reservations - Get all reservations")
    print("   POST /api/reservations - Create new reservation")
    print("   GET  /api/users        - Get all users")
    print("   POST /api/users        - Create new user")
    
    app.run(debug=True, host='0.0.0.0', port=5000)