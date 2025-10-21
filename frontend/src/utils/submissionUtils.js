// Calculate case score based on multiple weighted factors
export const calculateScore = (sub) => {
  const medicalScore = Math.min((sub.medicalBills / 50000) * 30, 30);
  const weeksScore = Math.min((sub.weeksOfTreatment / 20) * 30, 30);
  const wagesScore = Math.min((sub.lostWages / 20000) * 20, 20);
  const faultScore = Math.max(20 - (sub.sharedFault / 100) * 20, 0);
  return Math.round(medicalScore + weeksScore + wagesScore + faultScore);
};

// Color class for score badge
export const getScoreColor = (score) => {
  if (score >= 75) return "text-green-600 bg-green-50";
  if (score >= 50) return "text-yellow-600 bg-yellow-50";
  return "text-red-600 bg-red-50";
};

// Badge color for treatment type
export const getTreatmentBadge = (level) => {
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

// Average settlement
export const calculateAvgSettlement = (submissions) => {
  if (!submissions.length) return 0;
  const total = submissions.reduce(
    (acc, sub) => acc + (sub.estimateLow + sub.estimateHigh) / 2,
    0
  );
  return Math.round(total / submissions.length);
};

// Count recent submissions (within 30 days)
export const calculateMonthlyCount = (submissions) => {
  const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  return submissions.filter((s) => new Date(s.createdAt) > monthAgo).length;
};

// Count high-priority cases (score ≥ 75)
export const calculateHighPriorityCount = (submissions) =>
  submissions.filter((s) => calculateScore(s) >= 75).length;

// Generate pagination numbers
export const getPageNumbers = (currentPage, totalPages) => {
  const pages = [];
  const maxVisible = 5;

  if (totalPages <= maxVisible) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
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
