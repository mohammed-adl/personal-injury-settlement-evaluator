import asyncHandler from "express-async-handler";
import { success, prisma, submissionsSelect } from "../../lib/index.js";

export const getAllSubmissions = asyncHandler(async (req, res) => {
  const { page, limit, search } = req.validatedQuery!;

  const skip = (page - 1) * limit;

  let where: any = {};
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
      take: limit,
      orderBy: { createdAt: "desc" },
      select: submissionsSelect,
    }),
    prisma.submission.count({ where }),
  ]);

  return success(res, {
    submissions,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasMore: skip + submissions.length < total,
    },
  });
});
