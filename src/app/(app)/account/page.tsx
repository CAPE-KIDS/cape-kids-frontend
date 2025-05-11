"use client";
import { useAuth } from "@/hooks/useAuth";
import React from "react";

const Account = () => {
  const { user } = useAuth();
  console.log("User data:", user);
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Account</h1>
      {user ? (
        <div className="bg-white p-6 rounded shadow-md">
          <h2 className="text-xl font-semibold mb-2">User Information</h2>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
        </div>
      ) : (
        <p className="text-red-500">No user information available.</p>
      )}
    </div>
  );
};

export default Account;
