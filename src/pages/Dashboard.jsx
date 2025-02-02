import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faDownload, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({});
  const [editingEmployee, setEditingEmployee] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {http://
        const response = await axios.get('https://flipkartb.algoapp.in/api/dashboard');
        setEmployees(response.data);
      } catch (error) {
        console.error('Error fetching employees:', error);
        setMessage('Failed to fetch employee data.');
      }
    };
    fetchEmployees();
  }, []);

  const handleDelete = async (id) => {
    if (!id) return setError('Invalid ID provided.');

    try {
      await axios.delete(`https://flipkartb.algoapp.in/api/employee/${id}`);
      setEmployees(employees.filter((emp) => emp._id !== id));
    } catch (err) {
      console.error('Delete error:', err);
      setError('Failed to delete record.');
    }
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setFormData(employee);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`https://flipkartb.algoapp.in/api/employee/${editingEmployee._id}`, formData);
      setEmployees(employees.map((emp) => (emp._id === editingEmployee._id ? response.data : emp)));
      closeModal();
    } catch (err) {
      console.error('Update error:', err);
      setError('Failed to update the record.');
    }
  };

  const closeModal = () => {
    setFormData({});
    setEditingEmployee(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDeleteAll = async () => {
    try {
      await axios.delete('https://flipkartb.algoapp.in/api/delete-all');
      setEmployees([]);
    } catch (err) {
      console.error('Delete all error:', err);
      setError('Failed to delete all records.');
    }
  };

  const handleDownload = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      employees.map(e => Object.values(e).join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "employees.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const allKeys = employees.length > 0 ? Object.keys(employees[0]) : [];

  return (
    <div className="report-container p-4 shadow-lg rounded-lg bg-white">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Employee Dashboard</h1>
        <div>
          <button onClick={handleDeleteAll} className="icon-button text-red-500 mr-2">
            <FontAwesomeIcon icon={faTrashAlt} /> Delete All
          </button>
          <button onClick={handleDownload} className="icon-button text-green-500">
            <FontAwesomeIcon icon={faDownload} /> Download All
          </button>
        </div>
      </div>

      {message && <div className="message-success">{message}</div>}
      {error && <div className="message-error">{error}</div>}

      <table className="w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            {allKeys.map((key) => (
              <th key={key} className="border border-gray-300 px-4 py-2">{key}</th>
            ))}
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee._id} className="text-center">
              {allKeys.map((key) => (
                <td key={key} className="border border-gray-300 px-4 py-2">{employee[key]}</td>
              ))}
              <td className="border border-gray-300 px-4 py-2">
                <button onClick={() => handleEdit(employee)} className="icon-button text-blue-500 mr-2">
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button onClick={() => handleDelete(employee._id)} className="icon-button text-red-500">
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingEmployee && (
        <div className="modal fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="modal-content bg-white p-6 rounded-lg shadow-lg">
            <span className="close text-red-500 cursor-pointer" onClick={closeModal}>&times;</span>
            <h2 className="text-xl font-bold mb-4">Edit Employee</h2>
            <form onSubmit={handleUpdate}>
              {allKeys.map((key) => (
                <div key={key} className="form-group mb-2">
                  <label className="block text-sm font-medium">{key}:</label>
                  <input
                    type="text"
                    name={key}
                    value={formData[key] || ''}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
              ))}
              <button type="submit" className="update-button bg-blue-500 text-white py-2 px-4 rounded-md mr-2">Update</button>
              <button type="button" className="cancel-button bg-gray-500 text-white py-2 px-4 rounded-md" onClick={closeModal}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
