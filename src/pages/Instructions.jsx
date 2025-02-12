import React from "react";
import { Link } from "react-router-dom";

const Instructions = () => {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4">📌 How to Use the Send Email Page</h1>
      <p className="mb-4">
        The Send Email Page allows you to manually send emails to employees and managers in **batches**, while managing **cooldown periods** to prevent excessive email sending. 
      </p>

      <ol className="list-decimal pl-5 space-y-3">
        <li>
          <strong>Set Batch Size:</strong>  
          - Enter the number of emails to send in **one batch** under <em>Employee Batch Size</em> or <em>Manager Batch Size</em>.  
          - Default batch size: **1400** emails per batch.
        </li>

        <li>
          <strong>Check Cooldown Period:</strong>  
          - Each email type (employee/manager) has a **cooldown period** that prevents frequent email sending.  
          - Default cooldown: **24 hours** after the last batch was sent.  
          - The countdown timer next to **"Cooldown Remaining"** shows how much time is left before you can send another batch.  
          - The cooldown input field is **disabled** while emails are being sent.
        </li>

        <li>
          <strong>Freeze & Unfreeze Cooldown Period:</strong>  
          - By default, the cooldown **cannot be changed manually** while emails are pending.  
          - If needed, click **"Unfreeze Cooldown"** to make the input field editable.  
          - After making changes, you can **click "Freeze Cooldown"** to lock it again.
          - The Freeze/Unfreeze buttons **work independently** for Employee and Manager cooldowns.
          - **How it works:**
            <ul className="list-disc pl-5">
              <li>If the cooldown is **frozen**, the input is **disabled**, and emails follow the default cooldown period.</li>
              <li>If the cooldown is **unfrozen**, the input becomes **editable**, allowing manual adjustments.</li>
              <li>You can always **toggle between Freeze & Unfreeze** as needed.</li>
            </ul>
        </li>

        <li>
          <strong>Send Emails:</strong>  
          - Click **"Send Emails"** (for employees) or **"Send Manager Emails"** (for managers).  
          - The button remains **disabled** until the cooldown period reaches **00:00:00**.  
          - Once clicked, the system will:
            <ul className="list-disc pl-5">
              <li>Send the specified number of emails in batches.</li>
              <li>Reset the cooldown period **back to 24 hours**.</li>
              <li>Update the remaining email count for employees and managers.</li>
            </ul>
          - After sending, the **cooldown period resets to 24 hours automatically**, preventing further emails until it expires.
        </li>

        <li>
          <strong>Reset Emails (Admin Only):</strong>  
          - If emails need to be resent **immediately**, click:
            <ul className="list-disc pl-5">
              <li>**"Reset Employee Emails"** – to reset all pending employee email statuses.</li>
              <li>**"Reset Manager Emails"** – to reset all pending manager email statuses.</li>
            </ul>
          - **Effect of Reset:**  
            <ul className="list-disc pl-5">
              <li>Cooldown **immediately resets to 00:00:00**, allowing emails to be sent again.</li>
              <li>All previous pending emails are removed from the system.</li>
              <li>The cooldown input fields are **frozen again automatically** after reset.</li>
              <li>It does not delete employee/manager records but resets their email status.</li>
            </ul>
        </li>

        <li>
          <strong>Automatic Cooldown Handling:</strong>  
          - If you **send an email batch**, the cooldown input will **automatically reset to 24 hours**.  
          - If you **reset email statuses**, the cooldown timer will **instantly reset to 00:00:00**, allowing emails to be sent immediately.
          - Resetting also **relocks (freezes) cooldown input fields**, requiring you to **Unfreeze** them again if you need to edit.
        </li>

        <li>
          <strong>Error Handling:</strong>  
          - If there is an issue (e.g., server down or token expired), an **error message** will be displayed instead of email counts.  
          - Refresh the page or check your **authorization token** to fix errors.
        </li>
      </ol>

      <div className="mt-6">
        <Link to="/" className="text-blue-600 hover:underline">← Back to Main Page</Link>
      </div>
    </div>
  );
};

export default Instructions;
