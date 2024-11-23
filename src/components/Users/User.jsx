import React, { useState, useEffect } from "react";
import Navbar from "../Common/Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTrash, FaSearch, FaEdit, FaUsers } from "react-icons/fa";
import Swal from "sweetalert2";

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

const User = () => {
  const headings = [
    { key: "userId", value: "User ID" },
    { key: "username", value: "Username" },
    { key: "role", value: "Role" },
    { key: "status", value: "Status" },
    { key: "created", value: "Created" },
    { key: "action", value: "Actions" },
  ];

  const initialUsers = [
    {
      userId: 1,
      username: "vishnu",
      role: "Admin",
      status: "Active",
      created: "2023-05-12",
    },
    {
      userId: 2,
      username: "jishnu",
      role: "User",
      status: "Inactive",
      created: "2022-11-20",
    },
    {
      userId: 3,
      username: "priya",
      role: "Moderator",
      status: "Active",
      created: "2021-08-30",
    },
    {
      userId: 4,
      username: "akhil",
      role: "User",
      status: "Active",
      created: "2020-03-17",
    },
    {
      userId: 5,
      username: "arun",
      role: "Admin",
      status: "Inactive",
      created: "2019-10-04",
    },
    {
      userId: 6,
      username: "arju",
      role: "Admin",
      status: "Inactive",
      created: "2019-10-04",
    },
  ];

  const [users, setUsers] = useState(initialUsers);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("user");
  const [filter, setFilter] = useState({ role: "", status: "" });
  const [sortConfig, setSortConfig] = useState({
    key: "userId",
    direction: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const filteredUsers = users.filter((user) => {
    if (searchCategory === "user") {
      return (
        user.username
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        user.status.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        user.created.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
    } else {
      return user[searchCategory]
        .toLowerCase()
        .includes(debouncedSearchTerm.toLowerCase());
    }
  });

  const filteredByRoleAndStatus = filteredUsers.filter((user) => {
    return (
      (filter.role ? user.role === filter.role : true) &&
      (filter.status ? user.status === filter.status : true)
    );
  });

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedUsers = filteredByRoleAndStatus.sort((a, b) => {
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
        newSelectedRows.push(user.userId);
      });
    }
    setSelectedRows(newSelectedRows);
  };

  const handleEdit = (userId) => {
    toast.info(`Edit user with ID: ${userId}`, { position: "top-right" });
  };

  const handleDelete = (userId) => {
    Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete user with ID ${userId}. This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        setUsers(users.filter((user) => user.userId !== userId));
        toast.success(`User with ID ${userId} deleted successfully`, {
          position: "top-right",
        });
      }
    });
  };

  const handleBulkDelete = () => {
    if (selectedRows.length === 0) {
      toast.error("No users selected for deletion", { position: "top-right" });
      return;
    }

    Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete ${selectedRows.length} user(s). This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete them!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        setUsers(users.filter((user) => !selectedRows.includes(user.userId)));
        toast.success(`${selectedRows.length} user(s) deleted successfully`, {
          position: "top-right",
        });
        setSelectedRows([]);
      }
    });
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <Navbar />
      <ToastContainer />
      <div className="bg-white rounded-lg shadow-md mt-6 p-6 sm:p-8">
        <div className="container mx-auto">
          <h1 className="text-3xl py-4 border-b mb-10">Users Table</h1>
          <div className="mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row sm:space-x-4 w-full sm:w-auto items-start sm:items-center">
              <div className="relative w-full sm:w-56">
                <input
                  type="text"
                  className="p-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-300 ease-in-out w-full"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 transition duration-200 ease-in-out" />
              </div>

              <select
                className="p-2 border rounded-lg w-full sm:w-40 mt-2 sm:mt-0 focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-300 ease-in-out"
                value={filter.role}
                onChange={(e) => setFilter({ ...filter, role: e.target.value })}
              >
                <option value="" className="text-gray-600">
                  Filter by Role
                </option>
                <option value="Admin" className="text-gray-600">
                  Admin
                </option>
                <option value="User" className="text-gray-600">
                  User
                </option>
                <option value="Moderator" className="text-gray-600">
                  Moderator
                </option>
              </select>

              <select
                className="p-2 border rounded-lg w-full sm:w-40 mt-2 sm:mt-0 focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-300 ease-in-out"
                value={filter.status}
                onChange={(e) =>
                  setFilter({ ...filter, status: e.target.value })
                }
              >
                <option value="" className="text-gray-600">
                  Filter by Status
                </option>
                <option value="Active" className="text-gray-600">
                  Active
                </option>
                <option value="Inactive" className="text-gray-600">
                  Inactive
                </option>
              </select>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <button className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors duration-300 w-full sm:w-auto">
                <FaUsers className="w-5 h-5" />
                Add User
              </button>
              <button
                className="flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition-colors duration-300 w-full sm:w-auto"
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
                  <tr key={user.userId} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        className="rowCheckbox"
                        checked={selectedRows.includes(user.userId)}
                        onChange={(e) => getRowDetail(e, user.userId)}
                      />
                    </td>
                    <td className="px-6 py-4">{user.userId}</td>
                    <td className="px-6 py-4">{user.username}</td>
                    <td className="px-6 py-4">{user.role}</td>
                    <td className="px-6 py-4">{user.status}</td>
                    <td className="px-6 py-4">{user.created}</td>
                    <td className="px-6 py-4 flex space-x-2">
                      <button
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                        onClick={() => handleEdit(user.userId)}
                      >
                        <FaEdit className="w-5 h-5" />
                      </button>
                      <button
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-300"
                        onClick={() => handleDelete(user.userId)}
                      >
                        <FaTrash className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm">
              Showing page {currentPage} of {totalPages}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-300"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-300"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;
