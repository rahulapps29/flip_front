import React, { useState } from "react";
import "./Upload.css"; // Import the new CSS file
import Loader from "../../ui/Loader";

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");

  // Loader
  const [isUploading, setIsUploading] = useState(false);

  const [validationErrors, setValidationErrors] = useState([]); // Store multiple validation errors

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setUploadMessage("Please select a file first ❌");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        "https://flipkartb.algoapp.in/api/bulk-upload",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        },
      );

      const data = await response.json();

      if (response.status === 400 && data.errors) {
        setValidationErrors(data.errors);
        setUploadMessage("Validation errors found ❌");
      } else {
        setValidationErrors([]);
        setUploadMessage(data.message || "Upload successful ✅");
      }
    } catch (error) {
      setUploadMessage("Failed to upload file ❌");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="upload-container">
      {isUploading && (
        <div className="loader-overlay">
          <Loader />
        </div>
      )}
      <div className="upload-header">
        <h1> Upload CSV file </h1>
      </div>

      {/* Upload Form */}
      <form onSubmit={handleFileUpload} className="upload-form">
        {/* Custom File Input Wrapper */}
        <div className="upload-input-container">
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files[0])}
            className="upload-input"
            disabled={isUploading}
          />
          <span className="upload-label">
            {file ? file.name : "Choose File"}
          </span>
        </div>

        {/* Upload Button */}
        <button
          type="submit"
          className="upload-file-btn"
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {/* Upload Response Message */}
      {uploadMessage && <div className="upload-message">{uploadMessage}</div>}

      {/* Display multiple validation errors */}
      {validationErrors.length > 0 && (
        <div className="error-container">
          <h3>Validation Errors:</h3>
          <ul>
            {validationErrors.map((err, index) => (
              <li key={index}>
                {err.row === "Header Validation"
                  ? `${err.error}`
                  : `Row ${err.row}: ${err.error}`}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 📌 Instructions for user */}
      <div className="upload-instructions">
        <h2 className="instructions-title">📌 File Requirements:</h2>
        <p className="instructions-text">
          Please upload a <strong>CSV file</strong> containing the following{" "}
          <strong>(23 fields)</strong> fields given in the tables{" "}
          <strong>(13+10)</strong> below:- <br />
          <strong>All 23 fields must have headers</strong>, 'internetEmail' and
          'managerEmailId' fields can not be blank and should be in proper meail
          format any other field may or may not have data.
          <br /> <strong>You can keep the last 10 fields as blank.</strong>
          <br />
          <strong>
            {" "}
            You may use any file name of your choice for the CSV file.
          </strong>
        </p>
        <hr />
        <p className="instructions-subtitle">
          Input data field values field values ( first 13 fields )
        </p>
        <ul className="instructions-list">
          {/* // input field values field values  */}
          {/* <p><strong>Input field values field values</strong> </p> */}
          <li>
            <strong>itamOrganization</strong> - Organization name (e.g.,
            "Flipkart", "Myntra")
          </li>
          <li>
            <strong>assetId</strong> - Unique asset identifier (e.g., "A12345")
          </li>
          <li>
            <strong>serialNumber</strong> - Device serial number (e.g., "S1",
            "S2")
          </li>
          <li>
            <strong>manufacturerName</strong> - Name of device manufacturer
            (e.g., "Dell", "HP", "Lenovo")
          </li>
          <li>
            <strong>modelVersion</strong> - Model version of the device (e.g.,
            "XPS 15", "EliteBook 840")
          </li>
          <li>
            <strong>building</strong> - Location of the device (e.g.,
            "Headquarters", "Branch Office")
          </li>
          <li>
            <strong>locationId</strong> - Office location ID (e.g., "L001",
            "L002")
          </li>
          <li>
            <strong>internetEmail</strong> - Employee’s email address
          </li>
          <li>
            <strong>department</strong> - Employee's department (e.g., "IT",
            "Finance", "HR")
          </li>
          <li>
            <strong>employeeId</strong> - Unique employee identifier (e.g.,
            "E001")
          </li>
          <li>
            <strong>managerEmployeeId</strong> - Manager's employee ID (e.g.,
            "M001")
          </li>
          <li>
            <strong>managerEmailId</strong> - Manager's email address
          </li>
          <li>
            <strong>assetCondition</strong> - Asset (e.g., "Good", "bad ", "Need
            repairs", "HR")
          </li>
        </ul>

        <p className="instructions-subtitle">
          Field values entered by form user and system generated computed fields
          ( last 10 fields )
        </p>
        {/* // field values entered by form user and system generated computed fields  */}
        <ul className="instructions-list">
          <li>
            <strong>formOpened:</strong> System-generated indicate the if user
            have clicked the sent link
          </li>
          <li>
            <strong>serialNumberEntered:</strong> user will enter serial number
          </li>
          <li>
            <strong>reconciliationStatus:</strong> System-generated values
            indicating the current state, such as <code>"Yes"</code>,{" "}
            <code>"No"</code>
          </li>
          <li>
            <strong>assetConditionEntered:</strong> user will enter asset
            condition from dropdown
          </li>
          <li>
            <strong>manufacturerNameEntered:</strong> user will enter
            Manufacturer from dropdown
          </li>
          <li>
            <strong>modelVersionEntered:</strong> user will inputed specific
            model details like <code>"ThinkPad X1 Carbon"</code> or{" "}
            <code>"MacBook Pro M1"</code>.
          </li>
          <li>
            <strong>emailSent:</strong> System-generated values indicate whether
            an email notification was sent, typically as <code>"Yes"</code> or{" "}
            <code>"No"</code>.
          </li>
          <li>
            <strong>lastEmailSentAt:</strong> System-generated timestamps
            showing the last time an email was dispatched (only employee).
          </li>
          <li>
            <strong>managerEmailSent:</strong> System-generated values
            indicating if an email was sent to the manager, typically as{" "}
            <code>"Yes"</code> or <code>"No"</code>.
          </li>
          <li>
            <strong>lastManagerEmailSentAt:</strong> System-generated timestamps
            showing the last time an email was dispatched (employee and manger
            in cc).
          </li>
        </ul>

        {/* Possible Values Section */}
        {/* <h3 className="instructions-subtitle">✅ Possible Values:</h3>
            <ul className="instructions-list">
              <li><strong>reconciliationStatus</strong>: <code>"Verified"</code>, <code>"Pending"</code>, <code>"Mismatch"</code></li>
              <li><strong>assetCondition</strong>: <code>"Good"</code>, <code>"Bad"</code>, <code>"Damaged"</code></li>
              <li><strong>formOpened, serialNumberEntered, assetConditionEntered, manufacturerNameEntered, modelVersionEntered, emailSent, managerEmailSent</strong>: <code>"Yes"</code>, <code>"No"</code></li>
            </ul> */}
      </div>
    </div>
  );
};

export default UploadPage;
