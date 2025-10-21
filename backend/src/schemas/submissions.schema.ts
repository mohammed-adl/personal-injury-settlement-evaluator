import { z } from "zod";

export const getAllSubmissionsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional().default(""),
});


export const injurySubmissionSchema = z.object({
  data: z.object({
    fields: z.array(
      z.object({
        label: z.string(),
        value: z.any(),
      })
    ).nonempty(),
  }),
});

export const injuryFormDataSchema = injurySubmissionSchema.transform(({ data }) => {
  const fields = Object.fromEntries(data.fields.map(f => [f.label.trim(), f.value]));

  return {
    fullName: fields["Full name"],
    email: fields["Email"],
    phone: fields["Phone"] || null,
    accident: fields["What happened (short description)"],
    treatmentLevel: Array.isArray(fields["Treatment level"])
      ? fields["Treatment level"][0]
      : fields["Treatment level"],
    weeksOfTreatment: fields["Weeks of treatment"],
    medicalBills: fields["Medical bills total (USD)"],
    lostWages: fields["Lost wages total (USD)"],
    sharedFault: fields["Shared fault % (0–100)"],
    medicalBillsFile: fields["Upload medical bills"]?.[0]?.url,
    otherDocuments: fields["Upload other documents"]?.[0]?.url || null,
  };
});
