// File: src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchEmployees = async () => {
      const response = await fetch('http://localhost:5000/api/dashboard');
      const data = await response.json();
      setEmployees(data);
    };
    fetchEmployees();
  }, []);

  const handleDeleteAll = async () => {
    if (window.confirm('Are you sure you want to delete all records?')) {
      const response = await fetch('http://localhost:5000/api/delete-all', {
        method: 'DELETE',
      });
      const data = await response.json();
      setMessage(data.message);
      setEmployees([]); // Clear the table after deletion
    }
  };

  return (
    <div className="p-5">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl">Employee Dashboard</h1>
        <button
          onClick={handleDeleteAll}
          className="bg-red-500 text-white py-2 px-4 rounded"
        >
          Delete All Records
        </button>
      </div>
      {message && <div className="mb-4 text-green-500">{message}</div>}
      <table className="table-auto w-full border-collapse border border-gray-400">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Email</th>
            <th className="border border-gray-300 p-2">Name</th>
            <th className="border border-gray-300 p-2">Serial Numbers</th>
            <th className="border border-gray-300 p-2">Form Filled</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee, index) => (
            <tr key={index}>
              <td className="border border-gray-300 p-2">{employee.email}</td>
              <td className="border border-gray-300 p-2">{employee.name}</td>
              <td className="border border-gray-300 p-2">{employee.serialNumbers.join(', ')}</td>
              <td className="border border-gray-300 p-2">{employee.formFilled ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
