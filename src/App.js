import React, { useState, useEffect } from 'react';
import Task from './Task';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchTasks();
  }, [filter]);

  const fetchTasks = async () => {
    try {
      const result = await axios.get(`/tasks?status=${filter === 'all' ? '' : filter}`);
      setTasks(result.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const addTask = async () => {
    try {
      const result = await axios.post('/tasks', { id: Date.now(), text: newTask, status: 'incomplete' });
      setTasks([...tasks, result.data]);
      setNewTask('');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const updateTask = async (updatedTask) => {
    try {
      await axios.put(`/tasks/${updatedTask.id}`, updatedTask);
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`/tasks/${taskId}`);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">To-Do List</h1>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add new task"
        />
        <button className="btn btn-primary" onClick={addTask}>Add Task</button>
      </div>
      <div className="btn-group mb-4">
        <button className="btn btn-secondary" onClick={() => setFilter('all')}>All</button>
        <button className="btn btn-secondary" onClick={() => setFilter('complete')}>Completed</button>
        <button className="btn btn-secondary" onClick={() => setFilter('incomplete')}>Incomplete</button>
      </div>
      {tasks.map((task) => (
        <Task key={task.id} task={task} onUpdate={updateTask} onDelete={deleteTask} />
      ))}
    </div>
  );
};

export default App;