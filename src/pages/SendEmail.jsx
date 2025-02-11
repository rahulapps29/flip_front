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
  const [lastEmployeeSentTime, setLastEmployeeSentTime] = useState(null);
  const [lastManagerSentTime, setLastManagerSentTime] = useState(null);
  const [cooldownEmployee, setCooldownEmployee] = useState(24);
  const [cooldownManager, setCooldownManager] = useState(24);
  const [remainingEmployeeTime, setRemainingEmployeeTime] = useState('');
  const [remainingManagerTime, setRemainingManagerTime] = useState('');

  useEffect(() => {
    fetchAllData();
    const interval = setInterval(() => {
      updateRemainingTimes();
      fetchRemainingEmails();
      fetchRemainingManagerEmails();
    }, 1000);
    return () => clearInterval(interval);
  }, [lastEmployeeSentTime, lastManagerSentTime, cooldownEmployee, cooldownManager]);

  const fetchAllData = async () => {
    await fetchLastSentTimes();
    await fetchRemainingEmails();
    await fetchRemainingManagerEmails();
  };

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

  const fetchLastSentTimes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://flipkartb.algoapp.in/api/max-email-times', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setLastEmployeeSentTime(data.lastEmailSentAt);
      setLastManagerSentTime(data.lastManagerEmailSentAt);
    } catch (error) {
      console.error('Error fetching last sent times:', error);
    }
  };

  const updateRemainingTimes = () => {
    setRemainingEmployeeTime(formatRemainingTime(lastEmployeeSentTime, cooldownEmployee));
    setRemainingManagerTime(formatRemainingTime(lastManagerSentTime, cooldownManager));
  };

  const formatRemainingTime = (lastSentTime, cooldownHours) => {
    if (!lastSentTime) return '00:00:00';
    const lastSentDate = new Date(lastSentTime);
    const now = new Date();
    const cooldownEnd = new Date(lastSentDate.getTime() + cooldownHours * 60 * 60 * 1000);
    const diff = cooldownEnd - now;

    if (diff <= 0) return '00:00:00';

    const hours = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, '0');
    const minutes = String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
    const seconds = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
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
      fetchAllData();
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
      fetchAllData();
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
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      setMessage('✅ Employee email statuses reset successfully.');
      fetchAllData(); // Refresh cooldown time and remaining count
    } catch (error) {
      setMessage('❌ Error resetting employee emails.');
    }
  };
  const handleResetManagerEmails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://flipkartb.algoapp.in/api/reset-manager-email-status', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      setMessage2('✅ Manager email statuses reset successfully.');
      fetchAllData(); // Refresh cooldown time and remaining count
    } catch (error) {
      setMessage2('❌ Error resetting manager emails.');
    }
  };
  



  return (
    <div className="send-email-container">
      <h1 className="send-email-title">Send Emails Manually</h1>

      <label className="send-email-label">
        Employee Batch Size:
        <input type="number" value={employeeBatchSize} onChange={(e) => setEmployeeBatchSize(e.target.value)} className="send-email-input" min="1" />
      </label>

      <label className="send-email-label">
        Cooldown Period (Hours):
        <input type="number" value={cooldownEmployee} onChange={(e) => setCooldownEmployee(Number(e.target.value))} className="send-email-input" min="1" />
      </label>

      <p>Cooldown Remaining: {remainingEmployeeTime}</p>
      <p>Remaining Employee Emails: {remainingEmails ?? 'Loading...'}</p>

      <button onClick={handleSendEmails} className="send-email-button" disabled={remainingEmployeeTime !== '00:00:00'}>
        {isSending ? 'Sending...' : `Send ${employeeBatchSize} Emails`}
      </button>
      <p className="send-email-message">{message}</p>

      <hr />

      <label className="send-email-label">
        Manager Batch Size:
        <input type="number" value={managerBatchSize} onChange={(e) => setManagerBatchSize(e.target.value)} className="send-email-input" min="1" />
      </label>

      <label className="send-email-label">
        Cooldown Period (Hours):
        <input type="number" value={cooldownManager} onChange={(e) => setCooldownManager(Number(e.target.value))} className="send-email-input" min="1" />
      </label>

      <p>Cooldown Remaining: {remainingManagerTime}</p>
      <p>Remaining Manager Emails: {remainingManagerEmails ?? 'Loading...'}</p>

      <button onClick={handleSendEmailsToManagers} className="send-email-button" disabled={remainingManagerTime !== '00:00:00'}>
        {isSendingManagers ? 'Sending...' : `Send ${managerBatchSize} Emails`}
      </button>
      <p className="send-email-message">{message2}</p>

      <hr />

      <button onClick={handleResetEmails} className="send-email-reset-button">Reset Employee Emails</button>
<button onClick={handleResetManagerEmails} className="send-email-reset-button">Reset Manager Emails</button>

    </div>
  );
};

export default SendEmailPage;
