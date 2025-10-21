"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  calculateScore,
  getScoreColor,
  getTreatmentBadge,
  getPageNumbers,
} from "@/utils/submissionUtils";

export default function SubmissionsTable({
  submissions,
  currentPage,
  setCurrentPage,
  totalPages,
  totalCount,
  limit,
}) {
  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <TableHeader>Name</TableHeader>
              <TableHeader>Email</TableHeader>
              <TableHeader>Treatment</TableHeader>
              <TableHeader align="center">Weeks</TableHeader>
              <TableHeader align="right">Medical Bills</TableHeader>
              <TableHeader align="right">Lost Wages</TableHeader>
              <TableHeader align="center">Fault %</TableHeader>
              <TableHeader align="right">Est. Settlement</TableHeader>
              <TableHeader align="center">Docs</TableHeader>
              <TableHeader align="center">Score</TableHeader>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200">
            {submissions.map((sub) => {
              const score = calculateScore(sub);
              const docCount =
                (sub.medicalBillsFile ? 1 : 0) + (sub.otherDocuments ? 1 : 0);

              return (
                <tr
                  key={sub.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {sub.fullName}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {sub.email}
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
                  <td className="px-6 py-4 text-center text-slate-700">
                    {sub.sharedFault}%
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-slate-900">
                    ${sub.estimateLow?.toLocaleString()} - $
                    {sub.estimateHigh?.toLocaleString()}
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
            {Math.min(currentPage * limit, totalCount)} of {totalCount} results
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {pages.map((page, idx) =>
              page === "..." ? (
                <span key={idx} className="px-3 py-2 text-slate-600">
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-lg border transition-colors cursor-pointer ${
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
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* Small helper for table headers */
function TableHeader({ children, align = "left" }) {
  const alignClass =
    align === "center"
      ? "text-center"
      : align === "right"
      ? "text-right"
      : "text-left";
  return (
    <th
      className={`${alignClass} px-6 py-4 text-sm font-semibold text-slate-700`}
    >
      {children}
    </th>
  );
}
