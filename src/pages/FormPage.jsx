import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './FormPage.css'; // Importing CSS for styling

const FormPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');

  const [formData, setFormData] = useState({ serialNumbers: [''] });
  const [employeeData, setEmployeeData] = useState({ name: '', email: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await fetch(`https://flipkartb.algoapp.in/api/form?token=${token}`);
        const data = await response.json();

        if (data.email && data.name) { // Adjusted to match new API response
          setEmployeeData({ name: data.name, email: data.email });
        } else {
          setMessage('Invalid or expired link.');
        }
      } catch (error) {
        setMessage('Error fetching data.');
      }
    };

    if (token) {
      fetchEmployeeData();
    }
  }, [token]);

  const handleInputChange = (index, value) => {
    const updatedSerialNumbers = [...formData.serialNumbers];
    updatedSerialNumbers[index] = value;
    setFormData({ ...formData, serialNumbers: updatedSerialNumbers });
  };

  const addSerialNumberField = () => {
    setFormData({ ...formData, serialNumbers: [...formData.serialNumbers, ''] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('https://flipkartb.algoapp.in/api/submit-form', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, formDetails: formData }),
    });
    const data = await response.json();
    setMessage(data.message);
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Asset User Form</h1>
      {employeeData.email ? (
        <form onSubmit={handleSubmit} className="form-content">
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              value={employeeData.name}
              readOnly
              className="form-input read-only"
            />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={employeeData.email}
              readOnly
              className="form-input read-only"
            />
          </div>

          <div className="form-group">
            <label>Laptop Condition:</label>
            <select
              className="form-input"
              onChange={(e) => setFormData({ ...formData, laptopCondition: e.target.value })}
              required
            >
              <option value="">Select Condition</option>
              <option value="Good">Good</option>
              <option value="Damaged">Damaged</option>
              <option value="Need repair">Need repair</option>
            </select>
          </div>

          {formData.serialNumbers.map((serial, index) => (
            <div className="form-group" key={index}>
              <label>Serial Number {index + 1}:</label>
              <input
                type="text"
                value={serial}
                onChange={(e) => handleInputChange(index, e.target.value)}
                className="form-input"
                required
              />
            </div>
          ))}

          <button
            type="button"
            onClick={addSerialNumberField}
            className="add-button"
          >
            + Add More Assets
          </button>

          <button
            type="submit"
            className="submit-button"
          >
            Submit
          </button>
        </form>
      ) : (
        <div className="error-message">{message}</div>
      )}
    </div>
  );
};

export default FormPage;
