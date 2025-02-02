// File: src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [message, setMessage] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('https://flipkartb.algoapp.in/api/dashboard');
        setEmployees(response.data);
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
        const response = await axios.delete('https://flipkartb.algoapp.in/api/delete-all');
        setMessage(response.data.message);
        setEmployees([]);
      } catch (error) {
        console.error('Error deleting records:', error);
        setMessage('Failed to delete records.');
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        const response = await axios.delete(`https://flipkartb.algoapp.in/api/employee/${id}`);
        setMessage(response.data.message);
        setEmployees(employees.filter(employee => employee._id !== id));
      } catch (error) {
        console.error('Error deleting record:', error);
        setMessage('Failed to delete the record.');
      }
    }
  };

  const handleUpdate = (employee) => {
    setSelectedEmployee(employee);
    setFormData(employee);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (!selectedEmployee || !selectedEmployee._id) {
        throw new Error('Invalid employee ID.');
      }

      const response = await axios.put(
        `https://flipkartb.algoapp.in/api/employee/${selectedEmployee._id}`,
        formData
      );

      setMessage(response.data.message);
      setEmployees(employees.map(emp => emp._id === selectedEmployee._id ? response.data.employee : emp));
      setSelectedEmployee(null);
    } catch (error) {
      console.error('Error updating record:', error);
      setError('Failed to update the record.');
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
      {error && <div className="mb-4 text-red-500">{error}</div>}

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
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee, index) => (
            <tr key={employee._id} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
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
              <td className="border border-gray-300 p-2">
                <button
                  onClick={() => handleUpdate(employee)}
                  className="bg-blue-500 text-white py-1 px-2 rounded mr-2 hover:bg-blue-600"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(employee._id)}
                  className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
