import asyncHandler from "express-async-handler";
import { success, fail, prisma, submissionsSelect } from "../../lib/index.js";
import { Prisma } from "@prisma/client";

export const getAllSubmissions = asyncHandler(async (req, res) => {
  const { page = "1", limit = "10", search = "" } = req.query as {
    page?: string;
    limit?: string;
    search?: string;
  };

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  let where: Prisma.SubmissionWhereInput = {};

  if (search !== "") {
    where = {
      OR: [
        { fullName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ],
    };
  }

  const [submissions, total] = await Promise.all([
    prisma.submission.findMany({
      where,
      skip,
      take: limitNum,
      orderBy: { createdAt: "desc" },
      select: submissionsSelect,
    }),
    prisma.submission.count({ where }),
  ]);

  return success(res, {
    submissions,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
      hasMore: skip + submissions.length < total,
    },
  });
});
