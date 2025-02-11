import React, { useState, useEffect } from 'react';
import './SendEmail.css';

const SendEmailPage = () => {
  const [employeeBatchSize, setEmployeeBatchSize] = useState(1400);
  const [managerBatchSize, setManagerBatchSize] = useState(1400);
  const [message, setMessage] = useState('');
  const [message2, setMessage2] = useState('');
  const [remainingEmails, setRemainingEmails] = useState(null);
  const [remainingManagerEmails, setRemainingManagerEmails] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [isSendingManagers, setIsSendingManagers] = useState(false);

  useEffect(() => {
    fetchRemainingEmails();
    fetchRemainingManagerEmails();
  }, []);

  const fetchRemainingEmails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://flipkartb.algoapp.in/api/remaining-emails', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setRemainingEmails(data.remaining);
    } catch (error) {
      setRemainingEmails('Error fetching data');
    }
  };

  const fetchRemainingManagerEmails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://flipkartb.algoapp.in/api/remaining-manager-emails', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setRemainingManagerEmails(data.remaining);
    } catch (error) {
      setRemainingManagerEmails('Error fetching data');
    }
  };

  const handleSendEmails = async () => {
    setIsSending(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://flipkartb.algoapp.in/api/send-emails?batchSize=${employeeBatchSize}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      setMessage(data.message);
      fetchRemainingEmails();
    } catch (error) {
      setMessage('Error sending emails.');
    }
    setIsSending(false);
  };

  const handleSendEmailsToManagers = async () => {
    setIsSendingManagers(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://flipkartb.algoapp.in/api/send-emails-to-managers?batchSize=${managerBatchSize}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      setMessage2(data.message);
      fetchRemainingManagerEmails();
    } catch (error) {
      setMessage2('Error sending emails to managers.');
    }
    setIsSendingManagers(false);
  };

  const handleResetEmails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://flipkartb.algoapp.in/api/reset-email-status', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      const data = await response.json();
      setMessage(data.message);
      fetchRemainingEmails();
    } catch (error) {
      setMessage('Error resetting emails.');
    }
  };

  const handleResetManagerEmails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://flipkartb.algoapp.in/api/reset-manager-email-status', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      const data = await response.json();
      setMessage2(data.message);
      fetchRemainingManagerEmails();
    } catch (error) {
      setMessage2('Error resetting manager emails.');
    }
  };

  return (
    <div className="send-email-container">
      <h1 className="send-email-title">Send Emails Manually</h1>
      
      <label className="send-email-label">
        Employee Batch Size:
        <input
          type="number"
          value={employeeBatchSize}
          onChange={(e) => setEmployeeBatchSize(e.target.value)}
          className="send-email-input"
          min="1"
        />
      </label>
      <button onClick={handleSendEmails} className="send-email-button" disabled={isSending}>
        {isSending ? 'Sending...' : `Send ${employeeBatchSize} Emails to Employees`}
      </button>
      <p className="send-email-message">{message}</p>
        <br />
      <button onClick={handleResetEmails} className="send-email-reset-button">
        Reset Employee Email Statuses
      </button>
      
      {remainingEmails !== null ? (
        <p className="send-email-remaining">Remaining Employee Emails: {remainingEmails}</p>
      ) : (
        <p className="send-email-remaining">Loading employee email count...</p>
      )}
      
      <hr className="my-4" />
      
      <h2 className="send-email-admin">Send Emails to Employees & Managers</h2>
      <label className="send-email-label">
        Manager Batch Size:
        <input
          type="number"
          value={managerBatchSize}
          onChange={(e) => setManagerBatchSize(e.target.value)}
          className="send-email-input"
          min="1"
        />
      </label>
      <button onClick={handleSendEmailsToManagers} className="send-email-button" disabled={isSendingManagers}>
        {isSendingManagers ? 'Sending...' : `Send ${managerBatchSize} Emails (Including Managers)`}
      </button>
      <p className="send-email-message">{message2}</p>
      <br />
      <button onClick={handleResetManagerEmails} className="send-email-reset-button send-email-reset-button-managers">
        Reset Manager Email Statuses
      </button>
      
      {remainingManagerEmails !== null ? (
        <p className="send-email-remaining">Remaining Manager Emails: {remainingManagerEmails}</p>
      ) : (
        <p className="send-email-remaining">Loading manager email count...</p>
      )}
    </div>
  );
};

export default SendEmailPage;
