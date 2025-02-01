// File: src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('https://flipkartb.algoapp.in/api/dashboard');
        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        console.error('Error fetching employees:', error);
        setMessage('Failed to fetch employee data.');
      }
    };
    fetchEmployees();
  }, []);

  const handleDeleteAll = async () => {
    if (window.confirm('Are you sure you want to delete all records?')) {
      try {
        const response = await fetch('https://flipkartb.algoapp.in/api/delete-all', {
          method: 'DELETE',
        });
        const data = await response.json();
        setMessage(data.message);
        setEmployees([]); // Clear the table after deletion
      } catch (error) {
        console.error('Error deleting records:', error);
        setMessage('Failed to delete records.');
      }
    }
  };

  return (
    <div className="p-5">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl">Employee Dashboard</h1>
        <button
          onClick={handleDeleteAll}
          className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
        >
          Delete All Records
        </button>
      </div>
      {message && <div className="mb-4 text-green-500">{message}</div>}
      <table className="table-auto w-full border-collapse border border-gray-400">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">ITAM Organization</th>
            <th className="border border-gray-300 p-2">Asset ID</th>
            <th className="border border-gray-300 p-2">Serial Number</th>
            <th className="border border-gray-300 p-2">Manufacturer</th>
            <th className="border border-gray-300 p-2">Model/Version</th>
            <th className="border border-gray-300 p-2">Building</th>
            <th className="border border-gray-300 p-2">Location ID</th>
            <th className="border border-gray-300 p-2">Email</th>
            <th className="border border-gray-300 p-2">Department</th>
            <th className="border border-gray-300 p-2">Employee ID</th>
            <th className="border border-gray-300 p-2">Manager Email</th>
            <th className="border border-gray-300 p-2">Email Delivery</th>
            <th className="border border-gray-300 p-2">Reconciliation Status</th>
            <th className="border border-gray-300 p-2">Asset Condition</th>
            <th className="border border-gray-300 p-2">Form Filled</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
              <td className="border border-gray-300 p-2">{employee.itamOrganization}</td>
              <td className="border border-gray-300 p-2">{employee.assetId}</td>
              <td className="border border-gray-300 p-2">{employee.serialNumber}</td>
              <td className="border border-gray-300 p-2">{employee.manufacturerName}</td>
              <td className="border border-gray-300 p-2">{employee.modelVersion}</td>
              <td className="border border-gray-300 p-2">{employee.building}</td>
              <td className="border border-gray-300 p-2">{employee.locationId}</td>
              <td className="border border-gray-300 p-2">{employee.internetEmail}</td>
              <td className="border border-gray-300 p-2">{employee.department}</td>
              <td className="border border-gray-300 p-2">{employee.employeeId}</td>
              <td className="border border-gray-300 p-2">{employee.managerEmailId}</td>
              <td className="border border-gray-300 p-2">{employee.emailDelivery}</td>
              <td className="border border-gray-300 p-2">{employee.reconciliationStatus}</td>
              <td className="border border-gray-300 p-2">{employee.assetCondition}</td>
              <td className="border border-gray-300 p-2">{employee.formFilled ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;