import { formatDate } from 'date-fns';
import React from 'react';

const TaskDetailsModal = ({ task, onClose }) => {
  if (!task) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg w-1/3 p-6">
        <h3 className="text-2xl font-semibold mb-4">{task.title || 'Untitled Task'}</h3>
        <p><strong>Description:</strong> {task.description || 'No description available'}</p>
        <p><strong>Assigned to:</strong> {task.assignedUser?.user?.user_name || 'N/A'}</p>
        <p><strong>Status:</strong> {task.status || 'in_progress'}</p>
        <p><strong>Due Date:</strong> {formatDate(task.due_date)}</p>
        <div className="mt-4 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Close</button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsModal;
