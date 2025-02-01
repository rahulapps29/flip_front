// File: src/pages/Home.jsx
import React, { useState } from 'react';

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setUploadMessage('Please select a file first.');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('http://localhost:5000/api/bulk-upload', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    setUploadMessage(data.message);
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl mb-4">Upload CSV File</h1>
      <form onSubmit={handleFileUpload} className="flex flex-col gap-4 mt-4">
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files[0])}
          className="border p-2"
        />
        <button type="submit" className="bg-green-500 text-white py-2 px-4 rounded">
          Upload
        </button>
      </form>
      {uploadMessage && <div className="mt-4 text-green-500">{uploadMessage}</div>}
    </div>
  );
};

export default UploadPage;