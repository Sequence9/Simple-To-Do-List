from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os

print("Starting Flask application...")

app = Flask(__name__)
CORS(app)
DATA_FILE = 'tasks.json'

def load_tasks():
    if not os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'w') as f:
            json.dump([], f)
        return []
    try:
        with open(DATA_FILE, 'r') as f:
            return json.load(f)
    except json.JSONDecodeError:
        return []
    except PermissionError as e:
        app.logger.error(f"PermissionError: {e}")
        raise

def save_tasks(tasks):
    try:
        with open(DATA_FILE, 'w') as f:
            json.dump(tasks, f)
    except PermissionError as e:
        app.logger.error(f"PermissionError: {e}")
        raise

@app.route('/tasks', methods=['GET'])
def get_tasks():
    try:
        status = request.args.get('status')
        tasks = load_tasks()
        if status:
            tasks = [task for task in tasks if task['status'] == status]
        return jsonify(tasks)
    except Exception as e:
        app.logger.error(f"Error getting tasks: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500

@app.route('/tasks', methods=['POST'])
def add_task():
    try:
        tasks = load_tasks()
        new_task = request.json
        tasks.append(new_task)
        save_tasks(tasks)
        return jsonify(new_task), 201
    except PermissionError as e:
        return jsonify({'error': 'Permission denied'}), 500
    except Exception as e:
        app.logger.error(f"Error adding task: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500

@app.route('/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    try:
        tasks = load_tasks()
        task = next((task for task in tasks if task['id'] == task_id), None)
        if task:
            task.update(request.json)
            save_tasks(tasks)
            return jsonify(task)
        return jsonify({'error': 'Task not found'}), 404
    except Exception as e:
        app.logger.error(f"Error updating task: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500

@app.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    try:
        tasks = load_tasks()
        tasks = [task for task in tasks if task['id'] != task_id]
        save_tasks(tasks)
        return '', 204
    except Exception as e:
        app.logger.error(f"Error deleting task: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500

if __name__ == '__main__':
    print("Running Flask app...")
    app.run(debug=True)