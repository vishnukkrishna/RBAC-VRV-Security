import React, { useState, useEffect } from "react";
import Navbar from "../Common/Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTrash, FaSearch, FaEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import EditRoleModal from "../Modal/EditModal/EditRoleModal";
import AddRole from "../Modal/AddModal/AddRoleModal";

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

const Role = () => {
  const headings = [
    { key: "Id", value: "ID" },
    { key: "rolename", value: "Role" },
    { key: "description", value: "Description" },
    { key: "permission", value: "Permission" },
    { key: "action", value: "Actions" },
  ];

  const initialRoles = [
    {
      roleId: 1,
      rolename: "Admin",
      description: "Has full access to all resources.",
      permissions: {
        read: true,
        write: true,
        delete: true,
        manageRoles: true,
        viewAnalytics: true,
      },
    },
    {
      roleId: 2,
      rolename: "User",
      description: "Has limited access to resources.",
      permissions: {
        read: true,
        write: false,
        delete: false,
        manageRoles: false,
        viewAnalytics: false,
      },
    },
    {
      roleId: 3,
      rolename: "Moderator",
      description: "Can moderate content.",
      permissions: {
        read: true,
        write: true,
        delete: false,
        manageRoles: false,
        viewAnalytics: false,
      },
    },
    {
      roleId: 4,
      rolename: "Moderator",
      description: "Can moderate content.",
      permissions: {
        read: true,
        write: true,
        delete: false,
        manageRoles: false,
        viewAnalytics: false,
      },
    },
    {
      roleId: 5,
      rolename: "Moderator",
      description: "Can moderate content.",
      permissions: {
        read: true,
        write: true,
        delete: false,
        manageRoles: false,
        viewAnalytics: false,
      },
    },
    {
      roleId: 6,
      rolename: "Moderator",
      description: "Can moderate content.",
      permissions: {
        read: true,
        write: true,
        delete: false,
        manageRoles: false,
        viewAnalytics: false,
      },
    },
  ];

  const [roles, setRoles] = useState(initialRoles);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("rolename");
  const [filter, setFilter] = useState({ role: "" });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  const [sortConfig, setSortConfig] = useState({
    key: "roleId",
    direction: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const filteredRoles = roles.filter((role) => {
    if (searchCategory === "rolename") {
      return (
        role.rolename
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase()) ||
        role.description
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase())
      );
    }
    return role[searchCategory]
      .toLowerCase()
      .includes(debouncedSearchTerm.toLowerCase());
  });

  const filteredByRole = filteredRoles.filter((role) => {
    return filter.role ? role.rolename === filter.role : true;
  });

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedRoles = filteredByRole.sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key])
      return sortConfig.direction === "asc" ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key])
      return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const paginatedRoles = sortedRoles.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  const totalPages = Math.ceil(sortedRoles.length / rowsPerPage);

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
      roles.forEach((role) => {
        newSelectedRows.push(role.roleId);
      });
    }
    setSelectedRows(newSelectedRows);
  };

  const handleEdit = (roleId) => {
    const roleToEdit = roles.find((role) => role.roleId === roleId);
    setSelectedRole(roleToEdit);
    setIsEditModalOpen(true);
  };

  const handleDelete = (roleId) => {
    Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete role with ID ${roleId}. This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        setRoles(roles.filter((role) => role.roleId !== roleId));
        toast.success(`Role with ID ${roleId} deleted successfully`, {
          position: "top-right",
        });
      }
    });
  };

  const handleBulkDelete = () => {
    if (selectedRows.length === 0) {
      toast.error("No roles selected for deletion", { position: "top-right" });
      return;
    }

    Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete ${selectedRows.length} role(s). This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete them!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        setRoles(roles.filter((role) => !selectedRows.includes(role.roleId)));
        toast.success(`${selectedRows.length} role(s) deleted successfully`, {
          position: "top-right",
        });
        setSelectedRows([]);
      }
    });
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <Navbar />
      <div className="bg-white rounded-lg shadow-md mt-6 p-6 sm:p-8">
        <div className="container mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4">Role Table</h1>
          <div className="mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
            <div className="relative flex gap-5">
              <input
                type="text"
                className="p-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-300 ease-in-out w-full"
                placeholder="Search roles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 transition duration-200 ease-in-out" />
              <select
                className="p-1 border rounded-lg w-36 sm:w-52 sm:mt-0 focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-300 ease-in-out"
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
            </div>
            <div className="flex justify-center items-center gap-3">
              <AddRole />

              <div className="">
                <button
                  className="flex items-center gap-2 bg-red-600 text-white px-2 py-1 rounded-lg hover:bg-red-700 transition-colors duration-300"
                  onClick={handleBulkDelete}
                >
                  <FaTrash className="w-5 h-5" />
                  Delete Selected
                </button>
              </div>
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
                {paginatedRoles.map((role) => (
                  <tr key={role.roleId} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        className="rowCheckbox"
                        checked={selectedRows.includes(role.roleId)}
                        onChange={(e) => getRowDetail(e, role.roleId)}
                      />
                    </td>
                    <td className="px-6 py-4">{role.roleId}</td>
                    <td className="px-6 py-4">{role.rolename}</td>
                    <td className="px-6 py-4">{role.description}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-5 border rounded">
                        {Object.entries(role.permissions)
                          .filter(([permission, isActive]) => isActive)
                          .map(([permission, isActive]) => (
                            <div
                              key={permission}
                              className="flex items-center space-x-2 pl-3"
                            >
                              <input
                                type="checkbox"
                                checked={isActive}
                                disabled
                                className="h-4 w-4"
                              />
                              <label className="text-sm">
                                {permission
                                  .replace(/([A-Z])/g, " $1")
                                  .toUpperCase()}
                              </label>
                            </div>
                          ))}
                      </div>
                    </td>

                    <td className="px-6 py-4 flex items-center gap-5">
                      <button
                        className="text-blue-600 hover:text-blue-800 transition-colors duration-300"
                        onClick={() => handleEdit(role.roleId)}
                      >
                        <FaEdit size={23} />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800 transition-colors duration-300"
                        onClick={() => handleDelete(role.roleId)}
                      >
                        <FaTrash size={23} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {isEditModalOpen && (
            <EditRoleModal
              isOpen={isEditModalOpen}
              onClose={() => setIsEditModalOpen(false)}
              roleData={selectedRole}
              updateRole={(updatedRole) => {
                setRoles(
                  roles.map((role) =>
                    role.roleId === updatedRole.roleId ? updatedRole : role
                  )
                );
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
      <ToastContainer />
    </div>
  );
};

export default Role;
