import asyncHandler from "express-async-handler";

import { success, fail, prisma } from "../../lib/index.js";
import { aiService } from "../../services/index.js";

export const getinjurySubmissions = asyncHandler(async (req, res) => {
  const { formData } = req.body;
  if (!formData) return fail( "Form data is required", 400);

  const aiResponse = await aiService.generateSettlementEstimate(formData);

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
      otherDocuments: formData.otherDocuments,
      estimateLow: aiResponse.estimateLow,
      estimateHigh: aiResponse.estimateHigh
    }
  });

  return success(res, { submission, aiResponse });
});