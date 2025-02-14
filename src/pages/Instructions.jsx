import React from "react";
import { Link } from "react-router-dom";
import "./Instructions.css"; // Import the CSS file

const Instructions = () => {
  return (
    <div className="instructions-container">
      <div className="instructions-header">
        <h1>📌 How to Use the Send Email Page</h1>
      </div>

      <p className="instructions-text">
        The Send Email Page allows you to manually send emails to employees and
        managers in batches while managing cooldown periods to prevent excessive
        email sending.
      </p>

      <div className="instructions-content">
        <ol className="instructions-list">
          <li>
            <strong>📩 Set Batch Size:</strong>
            <ul>
              <li>
                Enter the number of emails to send in one batch under{" "}
                <em>Employee Batch Size</em> or <em>Manager Batch Size</em>.
              </li>
              <li>Default batch size: 1400 emails per batch.</li>
            </ul>
          </li>

          <li>
            <strong>⏳ Check Cooldown Period:</strong>
            <ul>
              <li>
                Each email type has a cooldown period to prevent frequent email
                sending.
              </li>
              <li>Default cooldown: 24 hours after the last batch was sent.</li>
              <li>
                The countdown timer next to "Cooldown Remaining" shows the
                remaining time before the next batch can be sent.
              </li>
            </ul>
          </li>

          <li>
            <strong>❄️ Freeze & Unfreeze Cooldown:</strong>
            <ul>
              <li>
                By default, the cooldown cannot be changed manually while emails
                are pending.
              </li>
              <li>Click "Unfreeze Cooldown" to enable manual adjustments.</li>
              <li>
                After making changes, click "Freeze Cooldown" to lock it again.
              </li>
              <li>
                Freeze/Unfreeze buttons work independently for employees and
                managers.
              </li>
            </ul>
          </li>

          <li>
            <strong>🚀 Send Emails:</strong>
            <ul>
              <li>
                Click "Send Emails" (for employees) or "Send Manager Emails"
                (for managers).
              </li>
              <li>
                The button is disabled until the cooldown period reaches
                00:00:00.
              </li>
              <li>
                After sending, the cooldown resets to 24 hours automatically.
              </li>
            </ul>
          </li>

          <li>
            <strong>🔄 Reset Emails (Admin Only):</strong>
            <ul>
              <li>
                Click "Reset Employee Emails" to reset all employee email
                statuses.
              </li>
              <li>
                Click "Reset Manager Emails" to reset all manager email
                statuses.
              </li>
              <li>
                The cooldown instantly resets to 00:00:00, allowing immediate
                email sending.
              </li>
            </ul>
          </li>

          <li>
            <strong>⚠️ Automatic Cooldown Handling:</strong>
            <ul>
              <li>
                If you send an email batch, the cooldown input will
                automatically reset to 24 hours.
              </li>
              <li>
                If you reset email statuses, the cooldown timer will instantly
                reset to 00:00:00, allowing emails to be sent immediately.
              </li>
              <li>
                Resetting also relocks (freezes) cooldown input fields,
                requiring you to "Unfreeze" them again if you need to edit.
              </li>
            </ul>
          </li>

          <li>
            <strong>🚨 Error Handling:</strong>
            <ul>
              <li>
                If there is an issue (e.g., server down or token expired), an
                error message will be displayed instead of email counts.
              </li>
              <li>
                Refresh the page or check your authorization token to fix
                errors.
              </li>
            </ul>
          </li>
        </ol>
      </div>

      <div className="instructions-footer">
        <Link to="/send-email" className="back-link">
          ← Back to Send Emails Page
        </Link>
      </div>
    </div>
  );
};

export default Instructions;
