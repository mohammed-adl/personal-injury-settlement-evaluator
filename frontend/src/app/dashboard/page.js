"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { handleGetSubmissions } from "@/fetchers";
import { calculateScore } from "@/utils/submissionUtils";

import SubmissionsTable from "./SubmissionsTable";
import { Spinner } from "@/components/ui";
import MetricsOverview from "./MetricsOverview";
import SearchBar from "./SearchBar";

export default function Dashboard() {
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["submissions", currentPage, searchTerm],
    queryFn: () =>
      handleGetSubmissions({
        page: currentPage,
        limit,
        search: searchTerm,
      }),
    retry: 1,
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <Spinner />;
  if (isError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-slate-600">
        <p className="mb-4 text-lg font-medium">Failed to load submissions.</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
        >
          Retry
        </button>
        <p className="text-sm text-slate-400 mt-2"></p>
      </div>
    );
  }

  const { submissions = [], pagination = {} } = data || {};
  const { totalPages = 1, total = 0 } = pagination;

  const avgSettlement = submissions.length
    ? Math.round(
        submissions.reduce(
          (acc, sub) => acc + (sub.estimateLow + sub.estimateHigh) / 2,
          0
        ) / submissions.length
      )
    : 0;

  const monthlyCount = submissions.filter(
    (s) =>
      new Date(s.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  ).length;

  const highPriorityCount = submissions.filter(
    (s) => calculateScore(s) >= 75
  ).length;

  const handleSearch = () => {
    setSearchTerm(searchInput);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-[1600px] mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Personal Injury Cases
          </h1>
          <p className="text-slate-600">
            Review and manage all case submissions
          </p>
        </div>

        <MetricsOverview
          totalCount={total}
          avgSettlement={avgSettlement}
          monthlyCount={monthlyCount}
          highPriorityCount={highPriorityCount}
        />

        <SearchBar
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          handleSearch={handleSearch}
        />

        <SubmissionsTable
          submissions={submissions}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          totalCount={total}
          limit={limit}
        />

        {submissions.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            No submissions found
          </div>
        )}
      </div>
    </div>
  );
}
