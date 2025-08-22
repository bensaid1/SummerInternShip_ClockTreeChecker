import { jsPDF } from "jspdf";

// Palette de couleurs harmonieuse
const COLORS = {
  header: "#7C3AED",         // Violet
  text: "#22223B",           // Gris foncé
  badgeValid: "#10B981",     // Vert
  badgeValidBg: "#D1FAE5",   // Vert clair
  badgeInvalid: "#EF4444",   // Rouge
  badgeInvalidBg: "#FEE2E2", // Rouge clair
  frameValid: "#7C3AED",     // Violet
  frameInvalid: "#EF4444",   // Rouge
  title: "#5B21B6",          // Violet foncé
  footer: "#6366F1",         // Indigo
  footerText: "#6B7280",     // Gris doux
};

export function addFooter(doc: jsPDF) {
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setDrawColor(220, 220, 220);
    doc.line(10, 275, 200, 275);
    doc.setFontSize(9);
    doc.setTextColor(COLORS.footer);
    doc.setFont("times", "bold");
    doc.text("ClockTree Validator", 10, 282);
    doc.setFont("times", "normal");
    doc.setTextColor(COLORS.footerText);
    doc.text("© 2025 Farah Kouki. All rights reserved.", 10, 288);
    doc.setTextColor(COLORS.header);
    doc.setFont("times", "bold"); 
    doc.text("Thank you for your trust!", 120, 288);
    doc.setTextColor(COLORS.footerText);
    doc.text(`Page ${i} / ${pageCount}`, 200, 282, { align: "right" });
  }
}

/**
 * Génère un PDF stylé pour un JSON validé
 */
export function generateSuccessPdf(result: { fileName: string; fileContent: string }) {
  const doc = new jsPDF();
  const now = new Date();
  const formattedDate = now.toLocaleString();

  // En-tête violet
  doc.setFillColor(COLORS.header);
  doc.rect(0, 0, 210, 22, "F");
  doc.setTextColor("#F3F4F6");
  doc.setFont("times", "bold");
  doc.setFontSize(18);
  doc.text("ClockTree Validation Report", 15, 15);

  // Infos fichier
  doc.setFont("times", "normal");
  doc.setFontSize(11);
  doc.setTextColor(COLORS.text);
  doc.text(`File: ${result.fileName}`, 15, 30);
  doc.text(`Generated: ${formattedDate}`, 15, 36);

  // Badge de succès
  doc.setDrawColor(COLORS.badgeValid);
  doc.setFillColor(COLORS.badgeValidBg);
  doc.roundedRect(15, 42, 60, 12, 3, 3, "FD");
  doc.setFont("times", "bold");
  doc.setFontSize(13);
  doc.setTextColor(COLORS.badgeValid);
  doc.text("VALID FILE", 45, 51, { align: "center" });

  // Titre JSON
  let y = 65;
  doc.setFont("times", "bold");
  doc.setFontSize(13);
  doc.setTextColor(COLORS.title);
 

  // Cadre stylé autour du JSON
  let prettyJson = "";
  try {
    prettyJson = JSON.stringify(JSON.parse(result.fileContent), null, 2);
  } catch {
    prettyJson = result.fileContent;
  }
  doc.setFont("courier", "normal");
  doc.setFontSize(9);
  doc.setTextColor(COLORS.text);

  const jsonLines = doc.splitTextToSize(prettyJson, 170);
  let i = 0;
  const marginX = 15;
  const marginY = 6;
  const boxWidth = 180;
  const boxHeight = 180;
  let jsonY = y + 6;

  // Fonction pour dessiner le cadre stylé
  const drawBox = (doc: jsPDF, y: number, height: number, color: string) => {
    doc.setDrawColor(color);
    doc.setLineWidth(0.7);
    doc.roundedRect(marginX, y, boxWidth, height, 4, 4);
  };

  // Remplir le cadre sur chaque page
  while (i < jsonLines.length) {
    if (jsonY + marginY > 265) {
      doc.addPage();
      jsonY = marginY + 10;
      // Redessiner le titre sur chaque page
      doc.setFont("times", "bold");
      doc.setFontSize(13);
      doc.setTextColor(COLORS.title);
      doc.text("JSON Content (continued)", 15, jsonY - 4);
    }
    drawBox(doc, jsonY - marginY, boxHeight, COLORS.frameValid);
    let startY = jsonY;
    let linesThisPage = Math.floor((boxHeight - marginY * 2) / 5);
    for (let l = 0; l < linesThisPage && i < jsonLines.length; l++, i++) {
      doc.text(jsonLines[i], marginX + 4, startY);
      startY += 5;
      if (startY > jsonY - marginY + boxHeight - 5) break;
    }
    jsonY = startY + marginY;
    if (i < jsonLines.length) {
      doc.addPage();
      jsonY = marginY + 10;
    }
  }

  // Footer visible sur chaque page
  addFooter(doc);

  doc.save(`${result.fileName.replace('.json', '')}_report.pdf`);
}

/**
 * Génère un PDF stylé pour un JSON invalide
 */
export function generateErrorPdf(result: { fileName: string; errors: string[] }) {
  const doc = new jsPDF();
  const now = new Date();
  const formattedDate = now.toLocaleString();

  // En-tête rouge
  doc.setFillColor(COLORS.badgeInvalid);
  doc.rect(0, 0, 210, 22, "F");
  doc.setTextColor("#F3F4F6");
  doc.setFont("times", "bold");
  doc.setFontSize(18);
  doc.text("ClockTree Validation Report", 15, 15);

  // Infos fichier
  doc.setFont("times", "normal");
  doc.setFontSize(11);
  doc.setTextColor(COLORS.text);
  doc.text(`File: ${result.fileName}`, 15, 30);
  doc.text(`Generated: ${formattedDate}`, 15, 36);

  // Badge d'échec
  doc.setDrawColor(COLORS.badgeInvalid);
  doc.setFillColor(COLORS.badgeInvalidBg);
  doc.roundedRect(15, 42, 60, 12, 3, 3, "FD");
  doc.setFont("times", "bold");
  doc.setFontSize(13);
  doc.setTextColor(COLORS.badgeInvalid);
  doc.text("INVALID FILE", 45, 51, { align: "center" });

  // Titre erreurs
  let y = 65;
  doc.setFont("times", "bold");
  doc.setFontSize(13);
  doc.setTextColor(COLORS.badgeInvalid);
  doc.text("Error List", 15, y);

  // Cadre stylé autour des erreurs
  doc.setFont("courier", "normal");
  doc.setFontSize(9);
  doc.setTextColor(COLORS.text);

  const errorLines = result.errors.map((err, idx) => `${idx + 1}. ${err}`);
  const errorChunks = doc.splitTextToSize(errorLines.join("\n"), 170);
  let i = 0;
  const marginX = 15;
  const marginY = 6;
  const boxWidth = 180;
  const boxHeight = 180;
  let errorY = y + 6;

  const drawBox = (doc: jsPDF, y: number, height: number, color: string) => {
    doc.setDrawColor(color);
    doc.setLineWidth(0.7);
    doc.roundedRect(marginX, y, boxWidth, height, 4, 4);
  };

  while (i < errorChunks.length) {
    if (errorY + marginY > 265) {
      doc.addPage();
      errorY = marginY + 10;
      doc.setFont("times", "bold");
      doc.setFontSize(13);
      doc.setTextColor(COLORS.badgeInvalid);
      doc.text("Error List (continued)", 15, errorY - 4);
    }
    drawBox(doc, errorY - marginY, boxHeight, COLORS.frameInvalid);
    let startY = errorY;
    let linesThisPage = Math.floor((boxHeight - marginY * 2) / 5);
    for (let l = 0; l < linesThisPage && i < errorChunks.length; l++, i++) {
      doc.text(errorChunks[i], marginX + 4, startY);
      startY += 5;
      if (startY > errorY - marginY + boxHeight - 5) break;
    }
    errorY = startY + marginY;
    if (i < errorChunks.length) {
      doc.addPage();
      errorY = marginY + 10;
    }
  }

  addFooter(doc);

  doc.save(`${result.fileName.replace('.json', '')}_report.pdf`);
}