import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const FormPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState('');
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await fetch(`https://flipkart.algoapp.in/api/validate-token?token=${token}`);
        const data = await response.json();
        if (data.message !== 'Valid token') {
          setIsValid(false);
          setMessage(data.message);
        }
      } catch (error) {
        setIsValid(false);
        setMessage('Invalid or expired link.');
      }
    };

    if (token) {
      validateToken();
    } else {
      setIsValid(false);
      setMessage('No token provided.');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('https://flipkart.algoapp.in/api/submit-form', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, formDetails: formData }),
    });
    const data = await response.json();
    setMessage(data.message);
  };

  return (
    <div className="p-5">
      {isValid ? (
        <>
          <h1 className="text-2xl mb-4">Form Submission</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Name"
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="border p-2"
              required
            />
            <input
              type="email"
              placeholder="Email"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="border p-2"
              required
            />
            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
              Submit
            </button>
          </form>
        </>
      ) : (
        <div className="text-red-500">{message}</div>
      )}
    </div>
  );
};

export default FormPage;