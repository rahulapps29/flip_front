import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faDownload, faSearch, faTimes, faEdit, faChevronLeft, faChevronRight, faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import './Dashboard.css';

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  const fetchEmployees = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://flipkartb.algoapp.in/api/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(response.data);
    } catch (error) {
      console.error('Failed to fetch employee data.', error);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleDelete = async (id, event) => {
    event.stopPropagation();
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`https://flipkartb.algoapp.in/api/employee/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmployees((prev) => prev.filter((emp) => emp._id !== id));
      } catch (err) {
        console.error('Failed to delete record:', err);
      }
    }
  };

  const handleDeleteAll = async () => {
    if (window.confirm('⚠️ Are you sure you want to delete ALL employee records?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete('https://flipkartb.algoapp.in/api/delete-all', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmployees([]);
      } catch (err) {
        console.error('Failed to delete all records:', err);
      }
    }
  };

  const handleDownload = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://flipkartb.algoapp.in/api/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = response.data.map(({ _id, __v, ...rest }) => rest);
      const headers = Object.keys(data[0]);

      const csvContent =
        'data:text/csv;charset=utf-8,' +
        [headers.join(','), ...data.map((e) =>
          headers
            .map((header) =>
              Array.isArray(e[header])
                ? e[header].map((item) => (typeof item === 'object' ? Object.values(item).join(' | ') : item)).join('; ')
                : e[header]
            )
            .join(',')
        )].join('\n');

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', 'employees.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Failed to download data:', err);
    }
  };

  const handleView = (employee) => {
    setSelectedEmployee(employee);
    setFormData(employee.assets.map(asset => ({ ...asset })));
    setIsModalOpen(true);
  };


  const toggleEditMode = () => {
    if (selectedEmployee) {
      setEditingEmployee(selectedEmployee);
    }
    setIsEditMode((prevMode) => !prevMode);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `https://flipkartb.algoapp.in/api/employee/${selectedEmployee._id}`,
        { assets: formData }, // Send only the modified assets
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEmployees((prev) =>
        prev.map((emp) =>
          emp._id === selectedEmployee._id ? { ...emp, assets: formData } : emp
        )
      );
      setIsEditMode(false);
    } catch (err) {
      console.error('Failed to update the record:', err.response?.data || err);
    }
  };

  const handleChange = (e, assetIndex) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedAssets = [...prev];
      updatedAssets[assetIndex] = { ...updatedAssets[assetIndex], [name]: value };
      return updatedAssets;
    });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
    setEditingEmployee(null);
    setFormData({});
    setIsEditMode(false);
  };

  const totalPages = Math.ceil(employees.length / itemsPerPage);
  const currentEmployees = employees.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const getPaginationButtons = () => {
    const buttons = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(i);
      }
    } else {
      buttons.push(1);

      if (currentPage > 4) {
        buttons.push('ellipsis-start');
      }

      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        buttons.push(i);
      }

      if (currentPage < totalPages - 3) {
        buttons.push('ellipsis-end');
      }

      buttons.push(totalPages);
    }

    return buttons;
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Employee Asset Dashboard</h1>
        <div className="dashboard-actions">
          <button onClick={handleDeleteAll} className="btn-delete-all">
            <FontAwesomeIcon icon={faTrash} /> Delete All
          </button>
          <button onClick={handleDownload} className="btn-download">
            <FontAwesomeIcon icon={faDownload} /> Download CSV
          </button>
        </div>
      </div>

      <div className="search-bar">
        <FontAwesomeIcon icon={faSearch} />
        <input
          type="text"
          placeholder="Search by Email ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button className="clear-btn" onClick={() => setSearchTerm('')}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        )}
      </div>

      <div className="cards-container">
        {currentEmployees
          .filter((emp) =>
            emp.internetEmail.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((employee) => (
            <div key={employee._id} className="employee-card" onClick={() => handleView(employee)}>
              <h3>{employee.internetEmail}</h3>
              <button
                className="btn-delete"
                onClick={(e) => handleDelete(employee._id, e)}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          ))}
      </div>

      <div className="pagination">
        <button
          className="page-btn"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <FontAwesomeIcon icon={faChevronLeft} /> Prev
        </button>

        {getPaginationButtons().map((item, index) =>
          item === 'ellipsis-start' || item === 'ellipsis-end' ? (
            <span key={index} className="ellipsis">
              <FontAwesomeIcon icon={faEllipsisH} />
            </span>
          ) : (
            <button
              key={index}
              className={`page-number ${currentPage === item ? 'active' : ''}`}
              onClick={() => handlePageChange(item)}
            >
              {item}
            </button>
          )
        )}

        <button
          className="page-btn"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>

      {isModalOpen && selectedEmployee && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className={`btn-edit ${isEditMode ? 'active' : ''}`} onClick={toggleEditMode}>
              <FontAwesomeIcon icon={faEdit} />
            </button>
            <button className="modal-close" onClick={closeModal}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <h2>Employee: {selectedEmployee.internetEmail}</h2>
            <div className='tableContainer'>
              <table>
                <thead>
                  <tr>
                    {Object.keys(selectedEmployee.assets[0])
                      .filter((key) => key !== '_id' && key !== 'timestamp')
                      .map((key) => (
                        <th key={key}>{key.replace(/([A-Z])/g, ' $1')}</th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {selectedEmployee.assets.map((asset, assetIndex) => (
                    <tr key={assetIndex} className={isEditMode ? 'editable-row' : ''}>
                      {Object.entries(asset)
                        .filter(([key]) => key !== '_id' && key !== 'timestamp')
                        .map(([key, value]) => (
                          <td key={key}>
                            <input
                              type="text"
                              name={key}
                              value={formData[assetIndex]?.[key] ?? value}
                              readOnly={!isEditMode}
                              onChange={(e) => handleChange(e, assetIndex)}
                              className={isEditMode ? 'editable-cell' : ''}
                            />
                          </td>
                        ))}
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
            {isEditMode && (
              <button className="btn-update" onClick={handleUpdate}>
                Update
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
