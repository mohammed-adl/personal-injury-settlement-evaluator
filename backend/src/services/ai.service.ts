import OpenAI from "openai";
import { fail } from "../lib/index.js";

const openai = new OpenAI({
  apiKey: process.env!.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are a personal injury settlement estimator for a law firm. Based on case details, provide:
1. Estimated settlement range (low and high amounts in USD)
2. A brief rationale for the estimate
3. Three similar cases the firm has won with titles, settlement amounts, and one-line summaries

Return your response in JSON format:
{
  "estimateLow": number,
  "estimateHigh": number,
  "rationale": "string",
  "similarCases": [
    {
      "title": "string",
      "outcome": number,
      "summary": "string"
    }
  ]
}`;

const aiService = {
  async generateSettlementEstimate(formData: any) {
    const caseDetails = `Case details:
- Accident: ${formData.accident}
- Treatment Level: ${formData.treatmentLevel}
- Weeks of Treatment: ${formData.weeksOfTreatment}
- Medical Bills: $${formData.medicalBills}
- Lost Wages: $${formData.lostWages}
- Shared Fault: ${formData.sharedFault}%

Provide settlement estimate and similar cases.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: caseDetails },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const content = completion?.choices?.[0]?.message?.content;
    if (!content) return fail("LLM error", 500);

    return JSON.parse(content);
  },
};

export default aiService;
