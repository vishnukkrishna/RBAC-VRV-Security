import React, { useState, useEffect } from "react";
import Navbar from "../Common/Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTrash, FaSearch, FaEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import AddPermissionModal from "../Modal/AddModal/AddPermissionModal";
import EditPermissionModal from "../Modal/EditModal/EditPermissionModal";

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const Permissions = () => {
  const headings = [
    { key: "id", value: "ID" },
    { key: "permission", value: "Permission" },
    { key: "description", value: "Description" },
    { key: "action", value: "Actions" },
  ];

  const initialUsers = [
    {
      id: 1,
      permission: "Read",
      description: "Allows reading of data",
    },
    {
      id: 2,
      permission: "Write",
      description: "Allows writing of data",
    },
    {
      id: 3,
      permission: "Execute",
      description: "Allows execution of operations",
    },
    {
      id: 4,
      permission: "Delete",
      description: "Allows deletion of records",
    },
    {
      id: 5,
      permission: "Admin",
      description: "Full administrative permissions",
    },
    {
      id: 6,
      permission: "View Reports",
      description: "Permission to view reports",
    },
  ];

  const [users, setUsers] = useState(initialUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editPermissionData, setEditPermissionData] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [permissionFilter, setPermissionFilter] = useState(""); // New state for filtering by permission
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.permission
        .toLowerCase()
        .includes(debouncedSearchTerm.toLowerCase()) ||
      user.description
        .toLowerCase()
        .includes(debouncedSearchTerm.toLowerCase());

    const matchesPermissionFilter =
      permissionFilter === "" || user.permission === permissionFilter;

    return matchesSearch && matchesPermissionFilter;
  });

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedUsers = filteredUsers.sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key])
      return sortConfig.direction === "asc" ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key])
      return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const paginatedUsers = sortedUsers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  const totalPages = Math.ceil(sortedUsers.length / rowsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getRowDetail = (event, id) => {
    const rows = [...selectedRows];
    if (rows.includes(id)) {
      setSelectedRows(rows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...rows, id]);
    }
  };

  const selectAllCheckbox = (event) => {
    const newSelectedRows = [];
    if (event.target.checked) {
      users.forEach((user) => {
        newSelectedRows.push(user.id);
      });
    }
    setSelectedRows(newSelectedRows);
  };

  const handleEdit = (userId) => {
    const userToEdit = users.find((user) => user.id === userId);
    if (userToEdit) {
      setEditPermissionData(userToEdit);
      setIsModalOpen(true);
    }
  };

  const handleDelete = (userId) => {
    Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete permission with ID ${userId}. This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        setUsers(users.filter((user) => user.id !== userId));
        toast.success(`Permission with ID ${userId} deleted successfully`, {
          position: "top-right",
        });
      }
    });
  };

  const handleBulkDelete = () => {
    if (selectedRows.length === 0) {
      toast.error("No permissions selected for deletion", {
        position: "top-right",
      });
      return;
    }

    Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete ${selectedRows.length} permission(s). This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete them!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        setUsers(users.filter((user) => !selectedRows.includes(user.id)));
        toast.success(
          `${selectedRows.length} permission(s) deleted successfully`,
          {
            position: "top-right",
          }
        );
        setSelectedRows([]);
      }
    });
  };

  const handleSaveEdit = (updatedPermission) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === updatedPermission.id ? updatedPermission : user
      )
    );
    toast.success("Permission updated successfully!", {
      position: "top-right",
    });
  };

  // Get unique permissions for the filter dropdown
  const uniquePermissions = Array.from(
    new Set(users.map((user) => user.permission))
  );

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <Navbar />
      <ToastContainer />
      <div className="bg-white rounded-lg shadow-md mt-6 p-6 sm:p-8">
        <div className="container mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4">
            Permission Table
          </h1>
          <div className="mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row sm:space-x-4 w-full sm:w-auto items-start sm:items-center">
              <div className="relative w-full sm:w-56">
                <input
                  type="text"
                  className="p-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-300 ease-in-out w-full"
                  placeholder="Search permissions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 transition duration-200 ease-in-out" />
              </div>
              <div className="relative w-full sm:w-56 md:mt-0 mt-3">
                <select
                  className="p-2 pl-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-300 ease-in-out w-full"
                  value={permissionFilter}
                  onChange={(e) => setPermissionFilter(e.target.value)}
                >
                  <option value="">All Permissions</option>
                  {uniquePermissions.map((permission) => (
                    <option key={permission} value={permission}>
                      {permission}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-center items-center gap-3">
              <AddPermissionModal />
              <button
                className="flex items-center gap-2 bg-red-600 text-white px-2 py-1 rounded-lg hover:bg-red-700 transition-colors duration-300"
                onClick={handleBulkDelete}
              >
                <FaTrash className="w-5 h-5" />
                Delete Selected
              </button>
            </div>
          </div>

          <div className="overflow-x-auto shadow rounded-lg border border-gray-200">
            <table className="table-auto w-full text-left text-sm text-gray-900">
              <thead className="bg-gray-100 text-xs uppercase">
                <tr>
                  <th className="px-6 py-3">
                    <input
                      type="checkbox"
                      className="rowCheckbox"
                      onChange={selectAllCheckbox}
                    />
                  </th>
                  {headings.map((heading) => (
                    <th
                      key={heading.key}
                      className="px-6 py-3 font-semibold text-gray-700 cursor-pointer"
                      onClick={() => handleSort(heading.key)}
                    >
                      {heading.value}
                      {sortConfig.key === heading.key &&
                        (sortConfig.direction === "asc" ? " ↑" : " ↓")}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 transition duration-200"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        className="rowCheckbox"
                        checked={selectedRows.includes(user.id)}
                        onChange={(event) => getRowDetail(event, user.id)}
                      />
                    </td>
                    <td className="px-6 py-4">{user.id}</td>
                    <td className="px-6 py-4">{user.permission}</td>
                    <td className="px-6 py-4">{user.description}</td>
                    <td className="px-6 py-4 flex items-center gap-5">
                      <button
                        className="text-blue-600 hover:text-blue-800 transition-colors duration-300"
                        onClick={() => handleEdit(user.id)}
                      >
                        <FaEdit size={23} />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800 transition-colors duration-300"
                        onClick={() => handleDelete(user.id)}
                      >
                        <FaTrash size={23} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {isModalOpen && (
            <EditPermissionModal
              permissionData={editPermissionData}
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSave={(updatedData) => {
                handleSaveEdit(updatedData);
                setIsModalOpen(false);
              }}
            />
          )}

          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex space-x-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={`px-3 py-1 rounded-lg ${
                    i + 1 === currentPage
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  } hover:bg-blue-700 hover:text-white transition-colors duration-300`}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Permissions;
