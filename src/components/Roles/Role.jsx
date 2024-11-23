import React from "react";
import Navbar from "../Common/Navbar";

const Role = () => {
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <Navbar />
      <div className="bg-white rounded-lg shadow-md mt-6 p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">Role Content</h2>
        <p className="text-sm sm:text-base">Role Datas</p>
      </div>
    </div>
  );
};

export default Role;
