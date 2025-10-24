import { Resend } from "resend";
import type { FormData, AIResponse } from "../types/submission.types.js";

const resend = new Resend(process.env.RESEND_API_KEY);

const emailService = {
  async sendSettlementEmail(
    formData: FormData,
    aiResponse: AIResponse,
    pdfBuffer: Buffer
  ) {
    const { fullName, email } = formData;
    const { estimateLow, estimateHigh, rationale, similarCases } = aiResponse;

    const similarCasesHtml = similarCases
      .map(
        (c) => `
        <li>
          <strong>${
            c.title
          }</strong> — settled for $${c.outcome.toLocaleString()}<br>
          <span style="color: #666;">${c.summary}</span>
        </li>
      `
      )
      .join("");

    const htmlContent = `
      <p>Hi ${fullName},</p>
      
      <p>Thank you for sharing details about your accident. Based on the information you provided, our estimated settlement range is <strong>$${estimateLow.toLocaleString()} – $${estimateHigh.toLocaleString()}</strong>.</p>
      
      <p><strong>Rationale:</strong><br>${rationale}</p>
      
      <p><strong>Here are some similar cases our firm has successfully handled:</strong></p>
      <ul>
        ${similarCasesHtml}
      </ul>
      
      <p>Please reference the attached PDF for a deeper dive into your case and detailed breakdowns of these examples.</p>
      
      <p>Our legal team will review your case in more detail. Please book a consultation here so we can discuss your situation: <a href="https://calendly.com/lawfirm">Book Consultation</a>.</p>
      
      <p>Every case is unique, so treat this as an initial estimate only. We've shared your information with the attorney, and they're looking forward to speaking with you soon.</p>
      
      <p>Best,<br>Law Firm Team</p>
    `;

    await resend.emails.send({
      from: "Law Firm <onboarding@resend.dev>",
      to: email,
      subject: "Your Personal Injury Case Estimate",
      html: htmlContent,
      attachments: [
        {
          filename: `${fullName.replace(/\s+/g, "_")}_Settlement_Estimate.pdf`,
          content: pdfBuffer,
        },
      ],
    });
  },
};

export default emailService;
