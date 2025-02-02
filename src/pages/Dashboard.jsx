import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faDownload } from '@fortawesome/free-solid-svg-icons';

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('https://flipkartb.algoapp.in/api/dashboard');
        setEmployees(response.data);
      } catch (error) {
        console.error('Failed to fetch employee data.');
      }
    };
    fetchEmployees();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://flipkartb.algoapp.in/api/employee/${id}`);
      setEmployees(employees.filter(emp => emp._id !== id));
    } catch (err) {
      console.error('Failed to delete record.');
    }
  };

  const handleDeleteAll = async () => {
    if (window.confirm('Are you sure you want to delete all employee records?')) {
      try {
        await axios.delete('https://flipkartb.algoapp.in/api/delete-all');
        setEmployees([]);
      } catch (err) {
        console.error('Failed to delete all records.');
      }
    }
  };

  const handleEdit = (employee) => {
    const { _id, __v, ...editableData } = employee; // Exclude _id and __v
    setEditingEmployee(employee);
    setFormData(editableData);
    setIsModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://flipkartb.algoapp.in/api/employee/${editingEmployee._id}`, formData);
      const updatedEmployees = employees.map(emp => 
        emp._id === editingEmployee._id ? { ...emp, ...formData } : emp
      );
      setEmployees(updatedEmployees);
      closeModal();
    } catch (err) {
      console.error('Failed to update the record.');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEmployee(null);
    setFormData({});
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const allKeys = employees.length > 0 ? Object.keys(employees[0]).filter(key => key !== '__v' && key !== '_id') : [];

  return (
    <div className="p-4 shadow-lg rounded-lg bg-white">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Employee Dashboard</h1>
        <div>
          <button onClick={handleDeleteAll} className="bg-red-500 text-white px-4 py-2 rounded mr-2">
            <FontAwesomeIcon icon={faTrash} /> Delete All
          </button>
          <button onClick={handleDownload} className="bg-green-500 text-white px-4 py-2 rounded">
            <FontAwesomeIcon icon={faDownload} /> Download All
          </button>
        </div>
      </div>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            {allKeys.map(key => (
              <th key={key} className="border px-4 py-2">{key}</th>
            ))}
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(employee => (
            <tr key={employee._id} className="text-center">
              {allKeys.map(key => (
                <td key={key} className="border px-4 py-2">{employee[key]}</td>
              ))}
              <td className="border px-4 py-2">
                <button onClick={() => handleEdit(employee)} className="text-blue-500 mr-2">
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button onClick={() => handleDelete(employee._id)} className="text-red-500">
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <button className="text-red-500 text-2xl" onClick={closeModal}>&times;</button>
            <h2 className="text-xl font-bold mb-4">Edit Employee</h2>
            <form onSubmit={handleUpdate}>
              {allKeys.map(key => (
                <div key={key} className="mb-2">
                  <label className="block text-sm font-medium mb-1">{key}</label>
                  <input
                    type="text"
                    name={key}
                    value={formData[key] || ''}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
              ))}
              <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded mr-2">Update</button>
              <button type="button" className="bg-gray-500 text-white py-2 px-4 rounded" onClick={closeModal}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;