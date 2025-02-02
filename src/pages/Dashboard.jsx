import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faDownload } from '@fortawesome/free-solid-svg-icons';
import './Dashboard.css';

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem('token'); // Get the token from localStorage
        const response = await axios.get('https://flipkartb.algoapp.in/api/dashboard', {
          headers: {
            'Authorization': `Bearer ${token}`, // Attach token
          },
        });
        setEmployees(response.data);
      } catch (error) {
        console.error('Failed to fetch employee data.');
      }
    };
    fetchEmployees();
  }, []);
  

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token'); // Get token from localStorage
      await axios.delete(`https://flipkartb.algoapp.in/api/employee/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`, // Attach token
        },
      });
      setEmployees(employees.filter(emp => emp._id !== id));
    } catch (err) {
      console.error('Failed to delete record:', err.response?.data || err);
      alert(`Failed to delete record: ${err.response?.data?.message || 'Unknown error'}`);
    }
  };
  
  const handleDeleteAll = async () => {
    if (window.confirm('Are you sure you want to delete all employee records?')) {
      try {
        const token = localStorage.getItem('token'); // Get token from localStorage
        await axios.delete('https://flipkartb.algoapp.in/api/delete-all', {
          headers: {
            'Authorization': `Bearer ${token}`, // Attach token
          },
        });
        setEmployees([]);
      } catch (err) {
        console.error('Failed to delete all records:', err.response?.data || err);
        alert(`Failed to delete all records: ${err.response?.data?.message || 'Unknown error'}`);
      }
    }
  };

  const handleEdit = (employee) => {
    const { _id, __v, ...editableData } = employee;
    setEditingEmployee(employee);
    setFormData(editableData);
    setIsModalOpen(true);
  };

  const handleUpdate = async (e) => {
  e.preventDefault();
  try {
    const token = localStorage.getItem('token'); // Get the token
    await axios.put(
      `https://flipkartb.algoapp.in/api/employee/${editingEmployee._id}`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${token}`, // Attach token
        },
      }
    );

    const updatedEmployees = employees.map(emp =>
      emp._id === editingEmployee._id ? { ...emp, ...formData } : emp
    );
    setEmployees(updatedEmployees);
    closeModal();
  } catch (err) {
    console.error('Failed to update the record:', err.response?.data || err);
  }
};


  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEmployee(null);
    setFormData({});
  };

  const handleDownload = async () => {
    try {
      const token = localStorage.getItem('token'); // Get token from localStorage
      const response = await axios.get('https://flipkartb.algoapp.in/api/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`, // Attach token
        },
      });
  
      const csvContent = "data:text/csv;charset=utf-8," +
        response.data.map(e => Object.values(e).join(",")).join("\n");
  
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "employees.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Failed to download data:', err.response?.data || err);
      alert(`Failed to download data: ${err.response?.data?.message || 'Unknown error'}`);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const allKeys = employees.length > 0 ? Object.keys(employees[0]).filter(key => key !== '__v' && key !== '_id') : [];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Employee Dashboard</h1>
        <div className="dashboard-actions">
          <button onClick={handleDeleteAll} className="btn-delete-all">
            <FontAwesomeIcon icon={faTrash} /> Delete All
          </button>
          <button onClick={handleDownload} className="btn-download">
            <FontAwesomeIcon icon={faDownload} /> Download All
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="dashboard-table">
          <thead>
            <tr>
              {allKeys.map(key => (
                <th key={key}>{key}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(employee => (
              <tr key={employee._id}>
                {allKeys.map(key => (
                  <td key={key}>{employee[key]}</td>
                ))}
                <td>
                  <button onClick={() => handleEdit(employee)} className="btn-edit">
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button onClick={() => handleDelete(employee._id)} className="btn-delete">
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={closeModal}>&times;</button>
            <h2>Edit Employee</h2>
            <form onSubmit={handleUpdate} className="modal-form">
              {allKeys.map(key => (
                <div key={key} className="form-group">
                  <label>{key}</label>
                  <input
                    type="text"
                    name={key}
                    value={formData[key] || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
              ))}
              <div className="modal-buttons">
                <button type="submit" className="btn-update">Update</button>
                <button type="button" className="btn-cancel" onClick={closeModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
