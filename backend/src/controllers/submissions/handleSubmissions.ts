import asyncHandler from "express-async-handler";
import {
  success,
  prisma,
  generateSettlementPDF,
  uploadFile,
  fail,
} from "../../lib/index.js";
import { aiService, emailService } from "../../services/index.js";

export const handleInjurySubmissions = asyncHandler(async (req, res) => {
  const formData = req.validatedBody;

  const medicalBillsUrl = await uploadFile(
    formData.medicalBillsFile,
    `medical-bills/${Date.now()}_${formData.fullName}`
  );

  let otherDocumentsUrl: string | null = null;
  if (formData.otherDocuments) {
    otherDocumentsUrl = await uploadFile(
      formData.otherDocuments,
      `other-documents/${Date.now()}_${formData.fullName}`
    );
  }

  const aiResponse = await aiService.generateSettlementEstimate(formData);

  const submission = await prisma.submission.create({
    data: {
      ...formData,
      medicalBillsFile: medicalBillsUrl,
      otherDocuments: otherDocumentsUrl,
      estimateLow: aiResponse.estimateLow,
      estimateHigh: aiResponse.estimateHigh,
    },
  });

  const pdf = await generateSettlementPDF(formData, aiResponse);

  await emailService.sendSettlementEmail(formData, aiResponse, pdf);

  return success(res, { submission, aiResponse });
});
