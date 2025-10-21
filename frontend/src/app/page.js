"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  FileText,
  DollarSign,
  Calendar,
  TrendingUp,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { handleGetSubmissions } from "@/fetchers";

export default function Home() {
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useQuery({
    queryKey: ["submissions", currentPage, searchTerm],
    queryFn: () =>
      handleGetSubmissions({
        page: currentPage,
        limit,
        search: searchTerm,
      }),
  });

  const submissions = data?.submissions || [];
  const pagination = data?.pagination || {};
  const totalPages = pagination.totalPages || 1;
  const totalCount = pagination.total || 0;

  const calculateScore = (sub) => {
    const medicalScore = Math.min((sub.medicalBills / 50000) * 30, 30);
    const weeksScore = Math.min((sub.weeksOfTreatment / 20) * 30, 30);
    const wagesScore = Math.min((sub.lostWages / 20000) * 20, 20);
    const faultScore = Math.max(20 - (sub.sharedFault / 100) * 20, 0);
    return Math.round(medicalScore + weeksScore + wagesScore + faultScore);
  };

  const getScoreColor = (score) => {
    if (score >= 75) return "text-green-600 bg-green-50";
    if (score >= 50) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getTreatmentBadge = (level) => {
    const colors = {
      surgery: "bg-red-100 text-red-800",
      specialist: "bg-orange-100 text-orange-800",
      "physical therapy": "bg-blue-100 text-blue-800",
      chiropractor: "bg-purple-100 text-purple-800",
      "primary care": "bg-green-100 text-green-800",
      "urgent care": "bg-yellow-100 text-yellow-800",
      none: "bg-gray-100 text-gray-800",
    };
    return colors[level?.toLowerCase()] || "bg-gray-100 text-gray-800";
  };

  const avgSettlement =
    submissions.length > 0
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

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const handleSearch = () => {
    setSearchTerm(searchInput);
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-slate-900" />
      </div>
    );
  }

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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Total Cases</p>
                <p className="text-3xl font-bold text-slate-900">
                  {totalCount}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Avg Settlement</p>
                <p className="text-3xl font-bold text-slate-900">
                  ${avgSettlement.toLocaleString()}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">This Month</p>
                <p className="text-3xl font-bold text-slate-900">
                  {monthlyCount}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">High Priority</p>
                <p className="text-3xl font-bold text-slate-900">
                  {highPriorityCount}
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name or email"
              value={searchInput}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                    Name
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                    Email
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                    Treatment
                  </th>
                  <th className="text-center px-6 py-4 text-sm font-semibold text-slate-700">
                    Weeks
                  </th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-slate-700">
                    Medical Bills
                  </th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-slate-700">
                    Lost Wages
                  </th>
                  <th className="text-center px-6 py-4 text-sm font-semibold text-slate-700">
                    Fault %
                  </th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-slate-700">
                    Est. Settlement
                  </th>
                  <th className="text-center px-6 py-4 text-sm font-semibold text-slate-700">
                    Docs
                  </th>
                  <th className="text-center px-6 py-4 text-sm font-semibold text-slate-700">
                    Score
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {submissions.map((sub) => {
                  const score = calculateScore(sub);
                  const docCount =
                    (sub.medicalBillsFile ? 1 : 0) +
                    (sub.otherDocuments ? 1 : 0);

                  return (
                    <tr
                      key={sub.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">
                          {sub.fullName}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-600">
                          {sub.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getTreatmentBadge(
                            sub.treatmentLevel
                          )}`}
                        >
                          {sub.treatmentLevel}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-slate-700">
                        {sub.weeksOfTreatment}
                      </td>
                      <td className="px-6 py-4 text-right text-slate-700 font-medium">
                        ${sub.medicalBills?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right text-slate-700 font-medium">
                        ${sub.lostWages?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-slate-700">
                          {sub.sharedFault}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="font-semibold text-slate-900">
                          ${sub.estimateLow?.toLocaleString()} - $
                          {sub.estimateHigh?.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-700 text-sm font-medium">
                          {docCount}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg ${getScoreColor(
                            score
                          )}`}
                        >
                          {score}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
              <div className="text-sm text-slate-600">
                Showing {(currentPage - 1) * limit + 1} to{" "}
                {Math.min(currentPage * limit, totalCount)} of {totalCount}{" "}
                results
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {getPageNumbers().map((page, idx) =>
                  page === "..." ? (
                    <span
                      key={`ellipsis-${idx}`}
                      className="px-3 py-2 text-slate-600"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-lg border transition-colors ${
                        currentPage === page
                          ? "bg-slate-900 text-white border-slate-900"
                          : "border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {submissions.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            No submissions found
          </div>
        )}
      </div>
    </div>
  );
}
