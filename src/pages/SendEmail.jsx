
// File: src/pages/SendEmail.jsx
import React, { useState } from 'react';

const SendEmailPage = () => {
  const [message, setMessage] = useState('');

  const handleSendEmails = async () => {
    const response = await fetch('http://localhost:5000/api/send-emails', {
      method: 'POST',
    });
    const data = await response.json();
    setMessage(data.message);
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl mb-4">Send Emails</h1>
      <button
        onClick={handleSendEmails}
        className="bg-blue-500 text-white py-2 px-4 rounded"
      >
        Send Emails to All Employees
      </button>
      {message && <div className="mt-4 text-green-500">{message}</div>}
    </div>
  );
};

export default SendEmailPage;