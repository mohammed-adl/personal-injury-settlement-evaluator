import asyncHandler from "express-async-handler";
import { success, fail, prisma, generateSettlementPDF } from "../../lib/index.js";
import { aiService, emailService } from "../../services/index.js";

export const handleInjurySubmissions = asyncHandler(async (req, res) => {
  const { data } = req.body;

  if (!data || !Array.isArray(data.fields)) {
    return fail("Invalid webhook payload", 400);
  }

  const fields = Object.fromEntries(
    data.fields.map(f => [f.label.trim(), f.value])
  );

  const formData = {
    fullName: fields["Full name"] || null,
    email: fields["Email"] || null,
    phone: fields["Phone"] || null,
    accident: fields["What happened (short description)"] || null,
    treatmentLevel: Array.isArray(fields["Treatment level"])
      ? fields["Treatment level"][0]
      : fields["Treatment level"] || null,
    weeksOfTreatment: fields["Weeks of treatment"] || null,
    medicalBills: fields["Medical bills total (USD)"] || null,
    lostWages: fields["Lost wages total (USD)"] || null,
    sharedFault: fields["Shared fault % (0–100)"] || null,
    medicalBillsFile: fields["Upload medical bills"]?.[0]?.url || null,
    otherDocuments: fields["Upload other documents"]?.[0]?.url || null,
  };

 if (
  !formData.fullName ||
  !formData.email ||
  !formData.accident ||
  !formData.treatmentLevel ||
  !formData.weeksOfTreatment ||
  !formData.medicalBills ||
  !formData.lostWages ||
  !formData.sharedFault ||
  !formData.medicalBillsFile
) {
  return fail("Missing required fields", 400);
}

  const aiResponse = await aiService.generateSettlementEstimate(formData);

  const submission = await prisma.submission.create({
    data: {
      ...formData,
      estimateLow: aiResponse.estimateLow,
      estimateHigh: aiResponse.estimateHigh,
    },
  });

  const pdf = await generateSettlementPDF(formData, aiResponse);

  await emailService.sendSettlementEmail(formData, aiResponse, pdf);

  return success(res, { submission, aiResponse });
});
