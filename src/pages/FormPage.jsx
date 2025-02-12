import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './FormPage.css';

const FormPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');

  const [formData, setFormData] = useState([]);
  const [employeeData, setEmployeeData] = useState({ name: '', email: '' });
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await fetch(`https://flipkartb.algoapp.in/api/form?token=${token}`);
        const data = await response.json();

        if (data.email && data.name) {
          setEmployeeData({ name: data.name, email: data.email });

          const assetResponse = await fetch(`https://flipkartb.algoapp.in/api/employee-assets?token=${token}`);
          const { assetCount } = await assetResponse.json();

          const initializedData = Array.from({ length: assetCount }, () => ({
            serialNumber: '',
            assetConditionEntered: '',
            manufacturerNameEntered: '',
            modelVersionEntered: '',
          }));

          setFormData(initializedData);
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

  const handleInputChange = (index, field, value) => {
    const updatedData = [...formData];
    updatedData[index][field] = value;
    setFormData(updatedData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://flipkartb.algoapp.in/api/submit-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          formDetails: formData,
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        setMessage('An error occurred while submitting the form.');
      }
    } catch (error) {
      setMessage('Error submitting the form.');
    }
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Asset Compliance Form</h1>

      {isSubmitted ? (
        <div className="thank-you-message">
          <h2>Thank you! Your form has been successfully submitted.</h2>
          <p>If you need to submit the form again, please refresh the page.</p>
        </div>
      ) : employeeData.email ? (
        <form onSubmit={handleSubmit} className="form-content">
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              value={employeeData.name}
              disabled
              className="form-input disabled-input"
              placeholder="Employee Name"
            />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={employeeData.email}
              disabled
              className="form-input disabled-input"
              placeholder="Employee Email"
            />
          </div>

          {formData.map((asset, index) => (
            <div key={index} className="asset-section">
              <h3>Asset {index + 1}</h3>

              <div className="form-group">
                <label>Serial Number: <span className="required">*</span></label>
                <input
                  type="text"
                  value={asset.serialNumber}
                  onChange={(e) => handleInputChange(index, 'serialNumber', e.target.value)}
                  className="form-input"
                  required
                  placeholder="Enter Serial Number"
                />
              </div>

              <div className="form-group">
                <label>Asset Condition: <span className="required">*</span></label>
                <select
                  className="form-input"
                  value={asset.assetConditionEntered}
                  onChange={(e) => handleInputChange(index, 'assetConditionEntered', e.target.value)}
                  required
                >
                  <option value="">Select Asset Condition</option>
                  <option value="Working">Working</option>
                  <option value="Not Working">Not Working</option>
                  <option value="Damaged">Damaged</option>
                  <option value="Needs Repair">Needs Repair</option>
                </select>
              </div>

              <div className="form-group">
                <label>Manufacturer Name: <span className="required">*</span></label>
                <select
                  className="form-input"
                  value={asset.manufacturerNameEntered}
                  onChange={(e) => handleInputChange(index, 'manufacturerNameEntered', e.target.value)}
                  required
                >
                  <option value="">Select Manufacturer Name</option>
                  <option value="Apple">Apple</option>
                  <option value="Dell">Dell</option>
                  <option value="Hp">Hp</option>
                  <option value="Lenovo">Lenovo</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              <div className="form-group">
                <label>Model Version: <span className="required">*</span></label>
                <input
                  type="text"
                  value={asset.modelVersionEntered}
                  onChange={(e) => handleInputChange(index, 'modelVersionEntered', e.target.value)}
                  className="form-input"
                  required
                  placeholder="Enter Model Version"
                />
              </div>
            </div>
          ))}

          <button type="submit" className="submit-button">
            Submit
          </button>
        </form>
      ) : (
        <div className="error-message">{message}</div>
      )}

      {message && <div className="success-message">{message}</div>}
    </div>
  );
};

export default FormPage;
