"use client";
import PageHeader from "@/components/PageHeader";
import React from "react";

const Trainings = () => {
  return (
    <div>
      <PageHeader title="Trainings" subtitle="Manage your trainings">
        <div className="search">
          <input
            type="text"
            placeholder="Search for an training..."
            className="border-2 border-gray-300 rounded-lg p-2 w-full"
          />
        </div>

        <div className="button">
          <button
            className="cursor-pointer bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition duration-200"
            onClick={() => {
              alert("Create Training");
            }}
          >
            Create Training
          </button>
        </div>
      </PageHeader>
    </div>
  );
};

export default Trainings;
