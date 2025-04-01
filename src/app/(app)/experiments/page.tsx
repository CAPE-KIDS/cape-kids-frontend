"use client";
import PageHeader from "@/components/PageHeader";
import Link from "next/link";
import React from "react";

const Experiments = () => {
  return (
    <div>
      <PageHeader title="Experiments" subtitle="Manage your experiments">
        <div className="search">
          <input
            type="text"
            placeholder="Search for an experiment..."
            className="border-2 border-gray-300 rounded-lg p-2 w-full"
          />
        </div>

        <div className="button">
          <Link
            className="cursor-pointer bg-blue-500 text-white rounded-lg px-4 py-3 hover:bg-blue-600 transition duration-200"
            href={"/experiments/create"}
          >
            Create Experiment
          </Link>
        </div>
      </PageHeader>
    </div>
  );
};

export default Experiments;
