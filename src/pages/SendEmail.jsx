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
  const [cooldownEmployeeFixed, setCooldownEmployeeFixed] = useState(24);
  const [cooldownManagerFixed, setCooldownManagerFixed] = useState(24);

  // Loader
  const [isLoading, setIsLoading] = useState(true);



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
    setIsLoading(true);
    await fetchLastSentTimes();
    await fetchRemainingEmails();
    await fetchRemainingManagerEmails();
    setIsLoading(false);
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
    if (!lastEmployeeSentTime || cooldownEmployeeFixed === 0) {
      setRemainingEmployeeTime('00:00:00');
    } else {
      setRemainingEmployeeTime(formatRemainingTime(lastEmployeeSentTime, cooldownEmployeeFixed));
    }

    if (!lastManagerSentTime || cooldownManagerFixed === 0) {
      setRemainingManagerTime('00:00:00');
    } else {
      setRemainingManagerTime(formatRemainingTime(lastManagerSentTime, cooldownManagerFixed));
    }
  };


  const resetEmployeeCooldown = () => {
    setLastEmployeeSentTime(null);
    setRemainingEmployeeTime('00:00:00');
    setCooldownEmployeeFixed(0);
    setIsCooldownEmployeeEnabled(true);  // Enable input after reset
  };

  const resetManagerCooldown = () => {
    setLastManagerSentTime(null);
    setRemainingManagerTime('00:00:00');
    setCooldownManagerFixed(0);
    setIsCooldownManagerEnabled(true);  // Enable input after reset
  };



  const formatRemainingTime = (lastSentTime, cooldownHoursFixed) => {
    if (!lastSentTime || cooldownHoursFixed === 0) return '00:00:00';

    const lastSentDate = new Date(lastSentTime);
    const now = new Date();
    const cooldownEnd = new Date(lastSentDate.getTime() + cooldownHoursFixed * 60 * 60 * 1000);
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

      // Lock the cooldown input after sending emails
      setLastEmployeeSentTime(new Date());
      setCooldownEmployeeFixed(cooldownEmployee);
      setIsCooldownEmployeeEnabled(false); // Keep input disabled after sending

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

      // Lock the cooldown input after sending emails
      setLastManagerSentTime(new Date());
      setCooldownManagerFixed(cooldownManager);
      setIsCooldownManagerEnabled(false); // Keep input disabled after sending

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

        // Reset everything
        setLastEmployeeSentTime(null);
        setRemainingEmployeeTime('00:00:00');
        setCooldownEmployee(24);
        setIsCooldownEmployeeEnabled(false); // Freeze cooldown after reset
        // setIsCooldownManagerEnabled(false); // Ensure mutual exclusivity
        setEmployeeBatchSize(1400);
        setRemainingEmails('Loading...');

        setTimeout(fetchRemainingEmails, 1500);
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

        // Reset everything
        setLastManagerSentTime(null);
        setRemainingManagerTime('00:00:00');
        setCooldownManager(24);
        setIsCooldownManagerEnabled(false); // Freeze cooldown after reset
        // setIsCooldownEmployeeEnabled(false); // Ensure mutual exclusivity
        setManagerBatchSize(1400);
        setRemainingManagerEmails('Loading...');

        setTimeout(fetchRemainingManagerEmails, 1500);
      } else {
        setMessage2('❌ Error resetting manager emails.');
      }
    } catch (error) {
      setMessage2('❌ Error resetting manager emails.');
    }
  };









  return (
    <div className="send-email-container">
      <div className='send-email-header'>
        <h1>Send Emails Manually</h1>
      </div>
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
        <input
          type="number"
          value={cooldownEmployee}
          onChange={(e) => setCooldownEmployee(Math.max(0, parseInt(e.target.value) || 0))}
          className="send-email-input"
          min="0"
          disabled={!isCooldownEmployeeEnabled}  // Start disabled & disable after sending
        />
      </label>

      <button
        className="send-email-unfreeze-button"
        onClick={() => setIsCooldownEmployeeEnabled(!isCooldownEmployeeEnabled)}
      >
        {isCooldownEmployeeEnabled ? 'Freeze Cooldown' : 'Unfreeze Cooldown'}
      </button>




      <button
        onClick={resetEmployeeCooldown}
        className="send-email-reset-button"
      >
        Reset Employee cooldown Timer
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
        <input
          type="number"
          value={cooldownManager}
          onChange={(e) => setCooldownManager(Math.max(0, parseInt(e.target.value) || 0))}
          className="send-email-input"
          min="0"
          disabled={!isCooldownManagerEnabled}
        />
      </label>

      <button
        className="send-email-unfreeze-button"
        onClick={() => setIsCooldownManagerEnabled(!isCooldownManagerEnabled)}
      >
        {isCooldownManagerEnabled ? 'Freeze Cooldown' : 'Unfreeze Cooldown'}
      </button>




      <button
        onClick={resetManagerCooldown}
        className="send-email-reset-button"
      >
        Reset Manager Cooldownt Timer
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
