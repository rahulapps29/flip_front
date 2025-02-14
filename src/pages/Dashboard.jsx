import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faDownload,
  faSearch,
  faTimes,
  faEdit,
  faChevronLeft,
  faChevronRight,
  faEllipsisH,
  faUpload,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import "./Dashboard.css";
import CustomDialog from "../../ui/CustomDialog";
import Loader from "../../ui/Loader";

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogType, setDialogType] = useState("");
  const [dialogConfirmAction, setDialogConfirmAction] = useState(null);

  // No Data found (Search Bar)
  const [isDataNotFound, setIsDataNotFound] = useState(false);

  // Loading
  const [isLoading, setIsLoading] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const fetchEmployees = useCallback(async () => {
    setIsLoading(true); // Show loader
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://flipkartb.algoapp.in/api/dashboard",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setEmployees(response.data);
      setDataLoaded(response.data.length > 0);
    } catch (error) {
      console.error("Failed to fetch employee data.", error);
      setDataLoaded(false);
    } finally {
      setIsLoading(false); // Hide loader after fetching
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleDelete = async (id, event) => {
    event.stopPropagation();
    setDialogTitle("Delete Employee");
    setDialogMessage("Are you sure you want to delete this employee?");
    setDialogType("warning");
    setDialogConfirmAction(() => () => confirmDelete(id));
    setIsDialogOpen(true);
  };

  const confirmDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://flipkartb.algoapp.in/api/employee/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees((prev) => prev.filter((emp) => emp._id !== id));
      setIsDialogOpen(false);
    } catch (err) {
      console.error("Failed to delete record:", err);
    }
  };

  const handleDeleteAll = async () => {
    setDialogTitle("Delete All Employees");
    setDialogMessage(
      "Are you sure you want to delete ALL employee records? This action cannot be undone.⚠️",
    );
    setDialogType("warning");
    setDialogConfirmAction(() => confirmDeleteAll);
    setIsDialogOpen(true);
  };

  const confirmDeleteAll = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete("https://flipkartb.algoapp.in/api/delete-all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees([]);
      setDataLoaded(false);
      setIsDialogOpen(false);
    } catch (err) {
      console.error("Failed to delete all records:", err);
    }
  };

  const handleDownload = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://flipkartb.algoapp.in/api/dashboard",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const employees = response.data;

      // Flatten the data and include new fields
      const flattenedData = employees.flatMap((employee) =>
        employee.assets.map((asset) => ({
          internetEmail: employee.internetEmail,
          // itamOrganization: asset.itamOrganization ?? employee.itamOrganization ?? 'Unknown',
          emailSent: employee.emailSent ?? false, // Default to false if not available
          lastEmailSentAt: employee.lastEmailSentAt
            ? new Date(employee.lastEmailSentAt).toISOString()
            : "",
          managerEmailSent: employee.managerEmailSent ?? false, // Default to false if not available
          lastManagerEmailSentAt: employee.lastManagerEmailSentAt
            ? new Date(employee.lastManagerEmailSentAt).toISOString()
            : "",
          ...asset,
        })),
      );

      // Define the CSV headers based on the original CSV structure + new fields
      const headers = [
        "itamOrganization",
        "assetId",
        "serialNumber",
        "manufacturerName",
        "modelVersion",
        "building",
        "locationId",
        "internetEmail",
        "department",
        "employeeId",
        "managerEmployeeId",
        "managerEmailId",
        "assetCondition",
        "formOpened",
        "serialNumberEntered",
        "reconciliationStatus",
        "assetConditionEntered",
        "manufacturerNameEntered",
        "modelVersionEntered",
        "emailSent",
        "lastEmailSentAt",
        "managerEmailSent",
        "lastManagerEmailSentAt", // New fields
      ];

      // Convert data to CSV format
      const csvContent = [
        headers.join(","), // CSV headers
        ...flattenedData.map((row) =>
          headers
            .map((header) =>
              row[header] !== undefined
                ? `"${String(row[header]).replace(/"/g, '""')}"`
                : "",
            )
            .join(","),
        ),
      ].join("\n");

      // Trigger the download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "employees_transformed.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Failed to download data:", err);
    }
  };

  const handleView = (employee) => {
    setSelectedEmployee(employee);
    setFormData(employee.assets.map((asset) => ({ ...asset })));
    setIsModalOpen(true);
  };

  const toggleEditMode = () => {
    if (selectedEmployee) {
      setEditingEmployee(selectedEmployee);
    }
    setIsEditMode((prevMode) => !prevMode);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://flipkartb.algoapp.in/api/employee/${selectedEmployee._id}`,
        { assets: formData }, // Send only the modified assets
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setEmployees((prev) =>
        prev.map((emp) =>
          emp._id === selectedEmployee._id ? { ...emp, assets: formData } : emp,
        ),
      );
      setIsEditMode(false);
    } catch (err) {
      console.error("Failed to update the record:", err.response?.data || err);
    }
  };

  const handleChange = (e, assetIndex) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedAssets = [...prev];
      updatedAssets[assetIndex] = {
        ...updatedAssets[assetIndex],
        [name]: value,
      };
      return updatedAssets;
    });
  };

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);

    const filteredResults = employees.filter((emp) =>
      emp.internetEmail.toLowerCase().includes(searchValue),
    );

    if (searchValue && filteredResults.length === 0) {
      setIsDataNotFound(true); // Show 'Data Not Found' Dialog
    } else {
      setIsDataNotFound(false); // Hide Dialog if data exists
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
    setEditingEmployee(null);
    setFormData({});
    setIsEditMode(false);
  };

  const filteredEmployees = employees.filter((emp) =>
    emp.internetEmail.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const currentEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const getPaginationButtons = () => {
    const buttons = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(i);
      }
    } else {
      buttons.push(1);

      if (currentPage > 4) {
        buttons.push("ellipsis-start");
      }

      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        buttons.push(i);
      }

      if (currentPage < totalPages - 3) {
        buttons.push("ellipsis-end");
      }

      buttons.push(totalPages);
    }

    return buttons;
  };

  return isLoading ? (
    <Loader />
  ) : dataLoaded ? (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Employee Asset Dashboard</h1>
        <div className="dashboard-actions">
          <button onClick={handleDeleteAll} className="btn-delete-all">
            <FontAwesomeIcon icon={faTrash} /> Delete All
          </button>
          <button onClick={handleDownload} className="btn-download">
            <FontAwesomeIcon icon={faDownload} /> Download CSV
          </button>
        </div>
      </div>

      <div className="search-bar">
        <FontAwesomeIcon icon={faSearch} />
        <input
          type="text"
          placeholder="Search by Email ID..."
          value={searchTerm}
          onChange={handleSearch} // Call the new search function
        />
        {searchTerm && (
          <button className="clear-btn" onClick={() => setSearchTerm("")}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        )}
      </div>

      <CustomDialog
        isOpen={isDataNotFound}
        title="No Results Found"
        message="Sorry, no matching records were found. Please try again with a different search term."
        confirmText={<FontAwesomeIcon icon={faCheck} />}
        cancelText={<FontAwesomeIcon icon={faTimes} />}
        type="info"
        onConfirm={() => setIsDataNotFound(false)}
        onCancel={() => {
          setIsDataNotFound(false);
          setSearchTerm("");
        }}
      />

      <div className="cards-container">
        {currentEmployees
          .filter((emp) =>
            emp.internetEmail.toLowerCase().includes(searchTerm.toLowerCase()),
          )
          .map((employee) => (
            <div
              key={employee._id}
              className="employee-card"
              onClick={() => handleView(employee)}
            >
              <h3>{employee.internetEmail}</h3>
              <button
                className="btn-delete"
                onClick={(e) => handleDelete(employee._id, e)}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          ))}
      </div>

      {/* Custom Dialog Component */}
      <CustomDialog
        isOpen={isDialogOpen}
        title={dialogTitle}
        message={dialogMessage}
        confirmText={<FontAwesomeIcon icon={faCheck} />} /* Right Tick ✅ */
        cancelText={<FontAwesomeIcon icon={faTimes} />} /* Cross ❌ */
        type={dialogType}
        onConfirm={dialogConfirmAction}
        onCancel={() => setIsDialogOpen(false)}
      />

      {totalPages > 1 && (
        <div className="pagination">
          {currentPage > 1 && (
            <button
              className="page-btn"
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <FontAwesomeIcon icon={faChevronLeft} /> Prev
            </button>
          )}

          {getPaginationButtons().map((item, index) =>
            item === "ellipsis-start" || item === "ellipsis-end" ? (
              <span key={index} className="ellipsis">
                <FontAwesomeIcon icon={faEllipsisH} />
              </span>
            ) : (
              <button
                key={index}
                className={`page-number ${currentPage === item ? "active" : ""}`}
                onClick={() => handlePageChange(item)}
              >
                {item}
              </button>
            ),
          )}

          {currentPage < totalPages && (
            <button
              className="page-btn"
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next <FontAwesomeIcon icon={faChevronRight} />
            </button>
          )}
        </div>
      )}

      {isModalOpen && selectedEmployee && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className={`btn-edit ${isEditMode ? "active" : ""}`}
              onClick={toggleEditMode}
            >
              <FontAwesomeIcon icon={faEdit} />
            </button>
            <button className="modal-close" onClick={closeModal}>
              <FontAwesomeIcon icon={faTimes} />
            </button>

            <h2>{selectedEmployee.internetEmail}</h2>
            <hr className="modal-divider" />
            <h2>
              Trigger: {selectedEmployee.emailSent ? "Emp: Yes" : "Emp: No"} &{" "}
              {selectedEmployee.managerEmailSent
                ? "Mang: Yes"
                : "Mang: No"}{" "}
            </h2>

            <div className="tableContainer">
              <table>
                <thead>
                  <tr>
                    {Object.keys(selectedEmployee.assets[0])
                      .filter((key) => key !== "_id" && key !== "timestamp")
                      .map((key) => (
                        <th key={key}>{key.replace(/([A-Z])/g, " $1")}</th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {selectedEmployee.assets.map((asset, assetIndex) => (
                    <tr
                      key={assetIndex}
                      className={isEditMode ? "editable-row" : ""}
                    >
                      {Object.entries(asset)
                        .filter(([key]) => key !== "_id" && key !== "timestamp")
                        .map(([key, value]) => (
                          <td key={key}>
                            <input
                              type="text"
                              name={key}
                              value={formData[assetIndex]?.[key] ?? value}
                              readOnly={!isEditMode}
                              onChange={(e) => handleChange(e, assetIndex)}
                              className={isEditMode ? "editable-cell" : ""}
                            />
                          </td>
                        ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {isEditMode && (
              <button className="btn-update" onClick={handleUpdate}>
                Update
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  ) : (
    <div className="welcome-container">
      <h1>Welcome to the Employee Asset Dashboard</h1>
      <p>
        To view employee data, please upload the required data by navigating to
        the <a href="http://localhost:4042/upload">Upload Page</a>.
      </p>
      <a href="http://localhost:4042/upload" className="upload-button">
        <FontAwesomeIcon icon={faUpload} /> Upload Data
      </a>
    </div>
  );
};

export default Dashboard;
