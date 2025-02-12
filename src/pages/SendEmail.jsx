import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
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
  const [isCooldownEmployeeEnabled, setIsCooldownEmployeeEnabled] = useState(false);
  const [isCooldownManagerEnabled, setIsCooldownManagerEnabled] = useState(false);
  
  
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

      // Correctly start the 24-hour cooldown
      const now = new Date();
      setLastEmployeeSentTime(now);
      setCooldownEmployee(24);

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

    // Correctly start the 24-hour cooldown
    const now = new Date();
    setLastManagerSentTime(now);
    setCooldownManager(24);

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

    if (response.ok) {
      setMessage('✅ Employee email statuses reset successfully.');

      // 🌟 Full Reset: Initialize Everything
      setLastEmployeeSentTime(null);
      setRemainingEmployeeTime('00:00:00');
      setCooldownEmployee(24);
      setIsCooldownEmployeeEnabled(false);
      setEmployeeBatchSize(1400); // Reset batch size to default
      setRemainingEmails(null); // Reset UI for remaining emails
      
      // 🌟 Ensure we don't fetch old last sent time immediately
      setTimeout(() => {
        fetchRemainingEmails(); // Fetch only remaining email count, NOT last sent time
      }, 1500);
    } else {
      setMessage('❌ Error resetting employee emails.');
    }
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

    if (response.ok) {
      setMessage2('✅ Manager email statuses reset successfully.');

      // 🌟 Full Reset: Initialize Everything
      setLastManagerSentTime(null);
      setRemainingManagerTime('00:00:00');
      setCooldownManager(24);
      setIsCooldownManagerEnabled(false);
      setManagerBatchSize(1400); // Reset batch size to default
      setRemainingManagerEmails(null); // Reset UI for remaining manager emails
      
      // 🌟 Ensure we don't fetch old last sent time immediately
      setTimeout(() => {
        fetchRemainingManagerEmails(); // Fetch only remaining count, NOT last sent time
      }, 1500);
    } else {
      setMessage2('❌ Error resetting manager emails.');
    }
  } catch (error) {
    setMessage2('❌ Error resetting manager emails.');
  }
};




  



  return (
    <div className="send-email-container">
      <h1 className="send-email-title">Send Emails Manually</h1>
      <p className="mb-4">Use this page to send emails to employees and managers in batches.</p>
<Link to="/instructions" className="text-blue-600 hover:underline">
  📖 Read Instructions
</Link>

      <label className="send-email-label">
        Employee Batch Size:
        <input type="number" value={employeeBatchSize} onChange={(e) => setEmployeeBatchSize(e.target.value)} className="send-email-input" min="1" />
      </label>

      <label className="send-email-label">
        Cooldown Period (Hours):
        {/* <input type="number" value={cooldownEmployee} onChange={(e) => setCooldownEmployee(Number(e.target.value))} className="send-email-input" min="1" /> */}
        <input 
  type="number" 
  value={cooldownEmployee} 
  onChange={(e) => setCooldownEmployee(Math.max(0, parseInt(e.target.value) || 0))} 
  className="send-email-input" 
  min="0" 
  disabled={!isCooldownEmployeeEnabled && (remainingEmployeeTime !== '00:00:00' || isSending)} 
/>


      </label>
      <button 
  className="send-email-unfreeze-button" 
  onClick={() => setIsCooldownEmployeeEnabled(true)}
  disabled={isCooldownEmployeeEnabled}
>
  Unfreeze Cooldown
</button>


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
        {/* <input type="number" value={cooldownManager} onChange={(e) => setCooldownManager(Number(e.target.value))} className="send-email-input" min="1" /> */}
        <input 
  type="number" 
  value={cooldownManager} 
  onChange={(e) => setCooldownManager(Math.max(0, parseInt(e.target.value) || 0))} 
  className="send-email-input" 
  min="0" 
  disabled={!isCooldownManagerEnabled && (remainingManagerTime !== '00:00:00' || isSendingManagers)} 
/>


      </label>
      <button 
  className="send-email-unfreeze-button" 
  onClick={() => setIsCooldownManagerEnabled(true)}
  disabled={isCooldownManagerEnabled}
>
  Unfreeze Cooldown
</button>


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
