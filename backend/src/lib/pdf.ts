import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import type { FormData, AIResponse } from "../types/submission.types.js";

export const generateSettlementPDF = async (
  formData: FormData,
  aiResponse: AIResponse
) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([612, 792]);
  const { width, height } = page.getSize();

  const timesRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const timesRomanBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

  let yPosition = height - 80;

  page.drawText("LAW FIRM & ASSOCIATES", {
    x: 50,
    y: yPosition,
    size: 20,
    font: timesRomanBold,
    color: rgb(0, 0, 0.5),
  });

  yPosition -= 40;

  // Title
  page.drawText("Personal Injury Case Estimate", {
    x: 50,
    y: yPosition,
    size: 16,
    font: timesRomanBold,
  });

  yPosition -= 30;

  // Client Info
  page.drawText(`Client: ${formData.fullName}`, {
    x: 50,
    y: yPosition,
    size: 12,
    font: timesRoman,
  });

  yPosition -= 20;

  page.drawText(`Email: ${formData.email}`, {
    x: 50,
    y: yPosition,
    size: 12,
    font: timesRoman,
  });

  yPosition -= 40;

  // Settlement Range
  page.drawText("Estimated Settlement Range:", {
    x: 50,
    y: yPosition,
    size: 14,
    font: timesRomanBold,
  });

  yPosition -= 25;

  page.drawText(
    `$${aiResponse.estimateLow.toLocaleString()} - $${aiResponse.estimateHigh.toLocaleString()}`,
    {
      x: 50,
      y: yPosition,
      size: 18,
      font: timesRomanBold,
      color: rgb(0, 0.5, 0),
    }
  );

  yPosition -= 35;

  // Rationale
  page.drawText("Rationale:", {
    x: 50,
    y: yPosition,
    size: 14,
    font: timesRomanBold,
  });

  yPosition -= 20;

  const rationaleLines = splitText(aiResponse.rationale, 75);
  rationaleLines.forEach((line) => {
    page.drawText(line, {
      x: 50,
      y: yPosition,
      size: 11,
      font: timesRoman,
    });
    yPosition -= 15;
  });

  yPosition -= 25;

  // Similar Cases
  page.drawText("Similar Cases Won:", {
    x: 50,
    y: yPosition,
    size: 14,
    font: timesRomanBold,
  });

  yPosition -= 25;

  aiResponse.similarCases.forEach((caseItem, index) => {
    page.drawText(
      `${index + 1}. ${caseItem.title} - $${caseItem.outcome.toLocaleString()}`,
      {
        x: 50,
        y: yPosition,
        size: 12,
        font: timesRomanBold,
      }
    );
    yPosition -= 15;

    page.drawText(caseItem.summary, {
      x: 60,
      y: yPosition,
      size: 10,
      font: timesRoman,
    });
    yPosition -= 25;
  });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
};

function splitText(text: string, maxLength: number) {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine: string = "";

  words.forEach((word) => {
    if ((currentLine + word).length <= maxLength) {
      currentLine += (currentLine ? " " : "") + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  });

  if (currentLine) lines.push(currentLine);
  return lines;
}
