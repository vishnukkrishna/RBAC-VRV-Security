export const users = [
  {
    userId: 1,
    username: "vishnu",
    role: "Admin",
    status: "Active",
    created: "2024-01-01",
  },
  {
    userId: 2,
    username: "jishnu",
    role: "User",
    status: "Inactive",
    created: "2024-02-15",
  },
  {
    userId: 3,
    username: "akhil",
    role: "User",
    status: "Active",
    created: "2024-03-12",
  },
  {
    userId: 4,
    username: "arun",
    role: "Manager",
    status: "Active",
    created: "2024-04-05",
  },
  {
    userId: 5,
    username: "arjun",
    role: "Admin",
    status: "Inactive",
    created: "2024-05-20",
  },
  {
    userId: 6,
    username: "priya",
    role: "Manager",
    status: "Active",
    created: "2024-06-10",
  },
];

export const roles = [
  {
    Id: 1,
    rolename: "Admin",
    description:
      "Has full access to all resources and can manage all users and data.",
    permissions: [
      "Read",
      "Write",
      "Execute",
      "Delete",
      "Manage Users",
      "Manage Roles",
    ],
  },
  {
    Id: 2,
    rolename: "User",
    description:
      "Can read and write their own data, but cannot modify others' data.",
    permissions: ["Read", "Write"],
  },
  {
    Id: 3,
    rolename: "Manager",
    description:
      "Can manage users, assign roles, and view reports, but cannot delete data.",
    permissions: ["Read", "Write", "Manage Users", "View Reports"],
  },
  {
    Id: 4,
    rolename: "Guest",
    description:
      "Has limited access to view content but cannot make changes or access sensitive data.",
    permissions: ["Read"],
  },
  {
    Id: 5,
    rolename: "Moderator",
    description:
      "Can moderate user-generated content and manage user activities.",
    permissions: ["Read", "Write", "Manage Content", "Moderate Comments"],
  },
  {
    Id: 6,
    rolename: "Super Admin",
    description:
      "Has the highest level of access, can perform any action across the platform, including system-level management.",
    permissions: [
      "Read",
      "Write",
      "Execute",
      "Delete",
      "Manage Users",
      "Manage Roles",
      "System Configuration",
    ],
  },
];

export const permissions = [
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
