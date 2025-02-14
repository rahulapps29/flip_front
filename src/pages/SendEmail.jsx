import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CustomDialog from "../../ui/CustomDialog";
import "./SendEmail.css";

const SendEmailPage = () => {
  const [employeeBatchSize, setEmployeeBatchSize] = useState(1400);
  const [managerBatchSize, setManagerBatchSize] = useState(1400);
  const [message, setMessage] = useState("");
  const [message2, setMessage2] = useState("");
  const [remainingEmails, setRemainingEmails] = useState(null);
  const [remainingManagerEmails, setRemainingManagerEmails] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [isSendingManagers, setIsSendingManagers] = useState(false);
  const [lastEmployeeSentTime, setLastEmployeeSentTime] = useState(null);
  const [lastManagerSentTime, setLastManagerSentTime] = useState(null);
  const [cooldownEmployee, setCooldownEmployee] = useState(24);
  const [cooldownManager, setCooldownManager] = useState(24);
  const [remainingEmployeeTime, setRemainingEmployeeTime] = useState("");
  const [remainingManagerTime, setRemainingManagerTime] = useState("");
  const [isCooldownEmployeeEnabled, setIsCooldownEmployeeEnabled] =
    useState(false);
  const [isCooldownManagerEnabled, setIsCooldownManagerEnabled] =
    useState(false);
  const [cooldownEmployeeFixed, setCooldownEmployeeFixed] = useState(24);
  const [cooldownManagerFixed, setCooldownManagerFixed] = useState(24);

  // Loader
  const [isLoading, setIsLoading] = useState(true);

  // State for custom dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogAction, setDialogAction] = useState(null);

  useEffect(() => {
    fetchAllData();
    const interval = setInterval(() => {
      updateRemainingTimes();
      fetchRemainingEmails();
      fetchRemainingManagerEmails();
    }, 1000);
    return () => clearInterval(interval);
  }, [
    lastEmployeeSentTime,
    lastManagerSentTime,
    cooldownEmployee,
    cooldownManager,
  ]);

  const fetchAllData = async () => {
    setIsLoading(true);
    await fetchLastSentTimes();
    await fetchRemainingEmails();
    await fetchRemainingManagerEmails();
    setIsLoading(false);
  };

  const fetchRemainingEmails = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://flipkartb.algoapp.in/api/remaining-emails",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await response.json();
      setRemainingEmails(data.remaining);
    } catch (error) {
      setRemainingEmails("Error fetching data");
    }
  };

  const fetchRemainingManagerEmails = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://flipkartb.algoapp.in/api/remaining-manager-emails",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await response.json();
      setRemainingManagerEmails(data.remaining);
    } catch (error) {
      setRemainingManagerEmails("Error fetching data");
    }
  };

  const fetchLastSentTimes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://flipkartb.algoapp.in/api/max-email-times",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await response.json();
      setLastEmployeeSentTime(data.lastEmailSentAt);
      setLastManagerSentTime(data.lastManagerEmailSentAt);
    } catch (error) {
      console.error("Error fetching last sent times:", error);
    }
  };

  const updateRemainingTimes = () => {
    if (!lastEmployeeSentTime || cooldownEmployeeFixed === 0) {
      setRemainingEmployeeTime("00:00:00");
    } else {
      setRemainingEmployeeTime(
        formatRemainingTime(lastEmployeeSentTime, cooldownEmployeeFixed),
      );
    }

    if (!lastManagerSentTime || cooldownManagerFixed === 0) {
      setRemainingManagerTime("00:00:00");
    } else {
      setRemainingManagerTime(
        formatRemainingTime(lastManagerSentTime, cooldownManagerFixed),
      );
    }
  };

  // Function to handle confirmation dialogs
  const handleOpenDialog = (message, action) => {
    setDialogMessage(message);
    setDialogAction(() => () => {
      action();
      setDialogOpen(false);
    });
    setDialogOpen(true);
  };

  const resetEmployeeCooldown = () => {
    handleOpenDialog(
      "This will temporarily reset the timer, letting you send your next batch immediately.Refresh page or press F5 to restore the timer. Proceed?",
      () => {
        setLastEmployeeSentTime(null);
        setRemainingEmployeeTime("00:00:00");
        setCooldownEmployeeFixed(0);
        setIsCooldownEmployeeEnabled(true);
      },
    );
  };

  const resetManagerCooldown = () => {
    handleOpenDialog(
      "This will temporarily reset the timer, letting you send your next batch immediately.Refresh page or press F5 to restore the timer. Proceed?",
      () => {
        setLastManagerSentTime(null);
        setRemainingManagerTime("00:00:00");
        setCooldownManagerFixed(0);
        setIsCooldownManagerEnabled(true);
      },
    );
  };

  const formatRemainingTime = (lastSentTime, cooldownHoursFixed) => {
    if (!lastSentTime || cooldownHoursFixed === 0) return "00:00:00";

    const lastSentDate = new Date(lastSentTime);
    const now = new Date();
    const cooldownEnd = new Date(
      lastSentDate.getTime() + cooldownHoursFixed * 60 * 60 * 1000,
    );
    const diff = cooldownEnd - now;

    if (diff <= 0) return "00:00:00";

    const hours = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, "0");
    const minutes = String(
      Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    ).padStart(2, "0");
    const seconds = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(
      2,
      "0",
    );

    return `${hours}:${minutes}:${seconds}`;
  };

  const handleSendEmails = async () => {
    setIsSending(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://flipkartb.algoapp.in/api/send-emails?batchSize=${employeeBatchSize}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await response.json();
      setMessage(data.message);

      // Lock the cooldown input after sending emails
      setLastEmployeeSentTime(new Date());
      setCooldownEmployeeFixed(cooldownEmployee);
      setIsCooldownEmployeeEnabled(false); // Keep input disabled after sending

      fetchAllData();
    } catch (error) {
      setMessage("Error sending emails.");
    }
    setIsSending(false);
  };

  const handleSendEmailsToManagers = async () => {
    setIsSendingManagers(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://flipkartb.algoapp.in/api/send-emails-to-managers?batchSize=${managerBatchSize}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await response.json();
      setMessage2(data.message);

      // Lock the cooldown input after sending emails
      setLastManagerSentTime(new Date());
      setCooldownManagerFixed(cooldownManager);
      setIsCooldownManagerEnabled(false); // Keep input disabled after sending

      fetchAllData();
    } catch (error) {
      setMessage2("Error sending emails to managers.");
    }
    setIsSendingManagers(false);
  };

  const handleResetEmails = async () => {
    handleOpenDialog(
      "This will erase employee email sent flags and time details. Do you want to proceed?",
      async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(
            "https://flipkartb.algoapp.in/api/reset-email-status",
            {
              method: "POST",
              headers: { Authorization: `Bearer ${token}` },
            },
          );

          if (response.ok) {
            setMessage("✅ Employee email statuses reset successfully.");
            setLastEmployeeSentTime(null);
            setRemainingEmployeeTime("00:00:00");
            setCooldownEmployee(24);
            setIsCooldownEmployeeEnabled(false);
            setEmployeeBatchSize(1400);
            setRemainingEmails("Loading...");
            setTimeout(fetchRemainingEmails, 1500);
          } else {
            setMessage("❌ Error resetting employee emails.");
          }
        } catch (error) {
          setMessage("❌ Error resetting employee emails.");
        }
      },
    );
  };

  const handleResetManagerEmails = async () => {
    handleOpenDialog(
      "This will erase manager email sent flags and time details. Do you want to proceed?",
      async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(
            "https://flipkartb.algoapp.in/api/reset-manager-email-status",
            {
              method: "POST",
              headers: { Authorization: `Bearer ${token}` },
            },
          );

          if (response.ok) {
            setMessage2("✅ Manager email statuses reset successfully.");
            setLastManagerSentTime(null);
            setRemainingManagerTime("00:00:00");
            setCooldownManager(24);
            setIsCooldownManagerEnabled(false);
            setManagerBatchSize(1400);
            setRemainingManagerEmails("Loading...");
            setTimeout(fetchRemainingManagerEmails, 1500);
          } else {
            setMessage2("❌ Error resetting manager emails.");
          }
        } catch (error) {
          setMessage2("❌ Error resetting manager emails.");
        }
      },
    );
  };

  return (
    <div className="send-email-container">
      <div className="send-email-header">
        <h1>
          Send Emails Manually{" "}
          <span className="instructions-link">
            (<Link to="/instructions">Read Instructions</Link>)
          </span>
        </h1>
      </div>
      <p className="mb-4">
        Use this page to send emails to employees and managers in batches.
      </p>

      {/* Custom Dialog for Confirmation */}
      <CustomDialog
        isOpen={dialogOpen}
        title="Confirmation Required"
        message={dialogMessage}
        confirmText="Yes"
        cancelText="No"
        onConfirm={dialogAction}
        onCancel={() => setDialogOpen(false)}
      />

      <div className="cooldown-box">
        <h3>Employee</h3>

        {/* Employee Section - Cooldown & Timer in One Row */}
        <div className="cooldown-row">
          <div className="cooldown-box">
            <div className="cooldown-group">
              <label className="batch-size-label">Batch Size:</label>
              <input
                type="number"
                value={employeeBatchSize}
                onChange={(e) => setEmployeeBatchSize(e.target.value)}
                className="batch-size-input"
                min="1"
              />
            </div>
          </div>
          {/* Employee Cooldown Box */}
          <div className="cooldown-box">
            <div className="cooldown-group">
              <label>Cooldown (Hours):</label>
              <input
                type="number"
                value={cooldownEmployee}
                onChange={(e) =>
                  setCooldownEmployee(
                    Math.max(0, parseInt(e.target.value) || 0),
                  )
                }
                min="0"
                disabled={!isCooldownEmployeeEnabled}
              />
              <button
                className="freeze-button"
                onClick={() =>
                  setIsCooldownEmployeeEnabled(!isCooldownEmployeeEnabled)
                }
              >
                {isCooldownEmployeeEnabled ? "Freeze" : "Unfreeze"}
              </button>
            </div>
          </div>

          {/* Employee Timer Box */}
          <div className="timer-box">
            {/* <h3>Employee Timer</h3> */}

            <div className="timer-group">
              <p className="timer-text">{remainingEmployeeTime}</p>
              <button
                onClick={resetEmployeeCooldown}
                className={`reset-button ${
                  remainingEmployeeTime === "00:00:00" ? "disabled" : ""
                }`}
                disabled={remainingEmployeeTime === "00:00:00"}
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        <p>Remaining Employee Emails: {remainingEmails ?? "Loading..."}</p>
        <div className="send-email-buttons">
          <button
            onClick={handleSendEmails}
            className="send-email-button"
            disabled={remainingEmployeeTime !== "00:00:00"}
          >
            {isSending ? "Sending..." : `Send ${employeeBatchSize} Emails`}
          </button>
          <button
            onClick={handleResetEmails}
            className="send-email-reset-button"
          >
            Reset Employee Email sent flags & timestamps
          </button>
          <p className="send-email-message">{message}</p>
        </div>
      </div>
      <hr />

      <div className="cooldown-box">
        <h3>Manager</h3>

        {/* Manager Section - Cooldown & Timer in One Row */}
        <div className="cooldown-row">
          <div className="cooldown-box">
            <div className="cooldown-group">
              <label className="batch-size-label">Batch Size:</label>
              <input
                type="number"
                value={managerBatchSize}
                onChange={(e) => setManagerBatchSize(e.target.value)}
                className="batch-size-input"
                min="1"
              />
            </div>
          </div>
          {/* Manager Cooldown Box */}
          <div className="cooldown-box">
            <div className="cooldown-group">
              <label>Cooldown (Hours):</label>
              <input
                type="number"
                value={cooldownManager}
                onChange={(e) =>
                  setCooldownManager(Math.max(0, parseInt(e.target.value) || 0))
                }
                min="0"
                disabled={!isCooldownManagerEnabled}
              />
              <button
                className="freeze-button"
                onClick={() =>
                  setIsCooldownManagerEnabled(!isCooldownManagerEnabled)
                }
              >
                {isCooldownManagerEnabled ? "Freeze" : "Unfreeze"}
              </button>
            </div>
          </div>

          {/* Manager Timer Box */}
          <div className="timer-box">
            {/* <h3>Manager Timer</h3> */}

            <div className="timer-group">
              <p className="timer-text">{remainingManagerTime}</p>
              <button
                onClick={resetManagerCooldown}
                className={`reset-button ${
                  remainingManagerTime === "00:00:00" ? "disabled" : ""
                }`}
                disabled={remainingManagerTime === "00:00:00"}
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        <p>
          Remaining Manager Emails: {remainingManagerEmails ?? "Loading..."}
        </p>

        <div className="send-email-buttons">
          <button
            onClick={handleSendEmailsToManagers}
            className="send-email-button"
            disabled={remainingManagerTime !== "00:00:00"}
          >
            {isSendingManagers
              ? "Sending..."
              : `Send ${managerBatchSize} Emails`}
          </button>
          <button
            onClick={handleResetManagerEmails}
            className="send-email-reset-button"
          >
            Reset Manger Email sent flags & timestamps
          </button>
          <p className="send-email-message">{message2}</p>
        </div>
      </div>
    </div>
  );
};

export default SendEmailPage;
