import asyncHandler from "express-async-handler";
import { success, fail, prisma, submissionsSelect } from "../../lib/index.js";

export const getAllSubmissions = asyncHandler(async (req, res) => {
  const submissions = await prisma.submission.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    select: submissionsSelect
  });

  return success(res, { submissions });
});