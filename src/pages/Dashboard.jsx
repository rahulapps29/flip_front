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
        const token = localStorage.getItem('token');
        const response = await axios.get('https://flipkartb.algoapp.in/api/dashboard', {
          headers: {
            'Authorization': `Bearer ${token}`,
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
      const token = localStorage.getItem('token');
      await axios.delete(`https://flipkartb.algoapp.in/api/employee/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
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
        const token = localStorage.getItem('token');
        await axios.delete('https://flipkartb.algoapp.in/api/delete-all', {
          headers: {
            'Authorization': `Bearer ${token}`,
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
      const token = localStorage.getItem('token');
      await axios.put(
        `https://flipkartb.algoapp.in/api/employee/${editingEmployee._id}`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
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
      const token = localStorage.getItem('token');
      const response = await axios.get('https://flipkartb.algoapp.in/api/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = response.data.map(({ _id, __v, ...rest }) => rest);
      const headers = Object.keys(data[0]);

      const csvContent = "data:text/csv;charset=utf-8," +
        [headers.join(","), ...data.map(e => headers.map(header => e[header]).join(","))].join("\n");

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

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Asset Compliance Dashboard</h1>
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
              <th>Email</th>
              <th>Assets</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(employee => (
              <tr key={employee._id}>
                <td>{employee.internetEmail}</td>
                <td>
                  {employee.assets && employee.assets.length > 0 ? (
                    <table>
                      <thead>
                        <tr>
                          <th>Asset ID</th>
                          <th>Serial Number</th>
                          <th>Model</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {employee.assets.map((asset, index) => (
                          <tr key={index}>
                            <td>{asset.assetId}</td>
                            <td>{asset.serialNumber}</td>
                            <td>{asset.model || 'N/A'}</td>
                            <td>{asset.status || 'Unknown'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    'No Assets'
                  )}
                </td>
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
              <div className="form-group">
                <label>Email</label>
                <input
                  type="text"
                  name="internetEmail"
                  value={formData.internetEmail || ''}
                  onChange={handleChange}
                  required
                />
              </div>
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