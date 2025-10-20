import asyncHandler from "express-async-handler";
import { success, fail } from "../../lib/index.js";
import { prisma } from "../../lib/index.js";

export const getinjurySubmissions = asyncHandler(async (req, res) => {
  const { formData } = req.body;

  const submission = await prisma.submission.create({
    data: {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      accident: formData.accident,
      treatmentLevel: formData.treatmentLevel,
      weeksOfTreatment: formData.weeksOfTreatment,
      medicalBills: formData.medicalBills,
      lostWages: formData.lostWages,
      sharedFault: formData.sharedFault,
      medicalBillsFile: formData.medicalBillsFile,
      otherDocuments: formData.otherDocuments
    }
  });

  return success(res, { submission });
});