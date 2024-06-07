import React, { useState } from 'react';

const Task = ({ task, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [taskText, setTaskText] = useState(task.text);

  const handleUpdate = () => {
    onUpdate({ ...task, text: taskText });
    setIsEditing(false);
  };

  return (
    <div className="card mb-2">
      <div className="card-body d-flex justify-content-between align-items-center">
        {isEditing ? (
          <>
            <input
              type="text"
              className="form-control me-2"
              value={taskText}
              onChange={(e) => setTaskText(e.target.value)}
            />
            <button className="btn btn-success" onClick={handleUpdate}>Save</button>
          </>
        ) : (
          <>
            <span className={`me-2 ${task.status === 'complete' ? 'text-decoration-line-through' : ''}`}>
              {task.text}
            </span>
            <button className="btn btn-secondary me-2" onClick={() => setIsEditing(true)}>Edit</button>
          </>
        )}
        <div>
          <button
            className="btn btn-success me-2"
            onClick={() => onUpdate({ ...task, status: task.status === 'complete' ? 'incomplete' : 'complete' })}
          >
            {task.status === 'complete' ? 'Undo' : 'Complete'}
          </button>
          <button className="btn btn-danger" onClick={() => onDelete(task.id)}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default Task;