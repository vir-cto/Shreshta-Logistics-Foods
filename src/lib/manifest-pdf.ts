// import "server-only";

// /**
//  * Manifest PDF — matches sample:
//  * Customer / Customer Code / DATE / MANIFEST No
//  * Table: SN | AWB No. | Forwarding No. | COUNTRY | CONSIGNEE | PCS | WEIGHT
//  * Totals + footer
//  */

// export type ManifestLine = {
//   awb: string;
//   forwardingNo?: string;
//   country?: string;
//   consignee?: string;
//   pcs?: number;
//   weightKg?: number;
// };

// export type ManifestPdfInput = {
//   customerName: string;
//   customerCode?: string;
//   manifestNo: string;
//   date: string; // e.g. 25-04-2026
//   lines: ManifestLine[];
//   totalAmount?: number;
// };

// function safeText(value: unknown, fallback = ""): string {
//   return String(value ?? "").trim() || fallback;
// }

// function formatWeight(n: number): string {
//   if (!Number.isFinite(n)) return "0.000";
//   return n.toFixed(3);
// }

// function formatAmount(n: number): string {
//   if (!Number.isFinite(n)) return "0.00";
//   return n.toLocaleString("en-IN", {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   });
// }

// export async function generateManifestPdf(
//   input: ManifestPdfInput,
// ): Promise<Uint8Array> {
//   const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");

//   const pdf = await PDFDocument.create();
//   const font = await pdf.embedFont(StandardFonts.Helvetica);
//   const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

//   const pageWidth = 842; // A4 landscape
//   const pageHeight = 595;
//   const marginX = 36;
//   const marginY = 28;
//   const black = rgb(0, 0, 0);
//   const gray = rgb(0.35, 0.35, 0.35);

//   const lines = Array.isArray(input.lines) ? input.lines : [];
//   const rowsPerPage = 18;
//   const totalPages = Math.max(1, Math.ceil(lines.length / rowsPerPage) || 1);

//   const totalWeight = lines.reduce(
//     (sum, l) => sum + (Number(l.weightKg) || 0),
//     0,
//   );
//   const totalAmount = Number(input.totalAmount) || 0;

//   const col = {
//     sn: marginX,
//     awb: marginX + 36,
//     fwd: marginX + 150,
//     country: marginX + 300,
//     consignee: marginX + 390,
//     pcs: marginX + 620,
//     weight: marginX + 680,
//   };
//   const tableRight = pageWidth - marginX;
//   const vLines = [
//     col.awb,
//     col.fwd,
//     col.country,
//     col.consignee,
//     col.pcs,
//     col.weight,
//   ];

//   for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
//     const page = pdf.addPage([pageWidth, pageHeight]);
//     let y = pageHeight - marginY - 10;

//     const drawText = (
//       text: string,
//       x: number,
//       yPos: number,
//       size: number,
//       useBold = false,
//       color = black,
//     ) => {
//       page.drawText(String(text || "").slice(0, 80), {
//         x,
//         y: yPos,
//         size,
//         font: useBold ? bold : font,
//         color,
//       });
//     };

//     // Title
//     const title = "MANIFEST";
//     const titleSize = 16;
//     const titleWidth = bold.widthOfTextAtSize(title, titleSize);
//     drawText(title, (pageWidth - titleWidth) / 2, y, titleSize, true);
//     y -= 22;

//     // Header box
//     const headerTop = y + 8;
//     const headerHeight = 44;
//     page.drawRectangle({
//       x: marginX,
//       y: headerTop - headerHeight,
//       width: tableRight - marginX,
//       height: headerHeight,
//       borderColor: black,
//       borderWidth: 1,
//     });
//     const midX = marginX + (tableRight - marginX) * 0.55;
//     page.drawLine({
//       start: { x: midX, y: headerTop },
//       end: { x: midX, y: headerTop - headerHeight },
//       thickness: 1,
//       color: black,
//     });
//     page.drawLine({
//       start: { x: marginX, y: headerTop - headerHeight / 2 },
//       end: { x: tableRight, y: headerTop - headerHeight / 2 },
//       thickness: 0.7,
//       color: black,
//     });

//     drawText(
//       `Customer :  ${safeText(input.customerName, "—")}`,
//       marginX + 8,
//       headerTop - 14,
//       9,
//       true,
//     );
//     drawText(
//       `Customer Code :  ${safeText(input.customerCode, "—")}`,
//       marginX + 8,
//       headerTop - headerHeight / 2 - 14,
//       9,
//       true,
//     );
//     drawText(
//       `DATE :  ${safeText(input.date)}`,
//       midX + 8,
//       headerTop - 14,
//       9,
//       true,
//     );
//     drawText(
//       `MANIFEST No :  ${safeText(input.manifestNo)}`,
//       midX + 8,
//       headerTop - headerHeight / 2 - 14,
//       9,
//       true,
//     );

//     y = headerTop - headerHeight - 4;

//     // Table header
//     const rowH = 18;
//     const tableHeaderY = y;
//     page.drawRectangle({
//       x: marginX,
//       y: tableHeaderY - rowH,
//       width: tableRight - marginX,
//       height: rowH,
//       borderColor: black,
//       borderWidth: 1,
//     });
//     const headers = [
//       { label: "SN", x: col.sn + 6 },
//       { label: "AWB No.", x: col.awb + 4 },
//       { label: "Forwarding No.", x: col.fwd + 4 },
//       { label: "COUNTRY", x: col.country + 4 },
//       { label: "CONSIGNEE", x: col.consignee + 4 },
//       { label: "PCS", x: col.pcs + 4 },
//       { label: "WEIGHT", x: col.weight + 4 },
//     ];
//     for (const h of headers) {
//       drawText(h.label, h.x, tableHeaderY - 13, 8, true);
//     }
//     for (const vx of vLines) {
//       page.drawLine({
//         start: { x: vx, y: tableHeaderY },
//         end: { x: vx, y: tableHeaderY - rowH },
//         thickness: 0.6,
//         color: black,
//       });
//     }

//     y = tableHeaderY - rowH;

//     const pageLines = lines.slice(
//       pageIndex * rowsPerPage,
//       pageIndex * rowsPerPage + rowsPerPage,
//     );

//     for (let i = 0; i < pageLines.length; i++) {
//       const line = pageLines[i]!;
//       const sn = pageIndex * rowsPerPage + i + 1;
//       const rowTop = y;

//       page.drawRectangle({
//         x: marginX,
//         y: rowTop - rowH,
//         width: tableRight - marginX,
//         height: rowH,
//         borderColor: black,
//         borderWidth: 0.7,
//       });
//       for (const vx of vLines) {
//         page.drawLine({
//           start: { x: vx, y: rowTop },
//           end: { x: vx, y: rowTop - rowH },
//           thickness: 0.5,
//           color: black,
//         });
//       }

//       drawText(String(sn), col.sn + 8, rowTop - 13, 8);
//       drawText(safeText(line.awb), col.awb + 4, rowTop - 13, 8);
//       drawText(safeText(line.forwardingNo), col.fwd + 4, rowTop - 13, 8);
//       drawText(safeText(line.country), col.country + 4, rowTop - 13, 8);
//       drawText(
//         safeText(line.consignee).slice(0, 36),
//         col.consignee + 4,
//         rowTop - 13,
//         8,
//       );
//       drawText(String(line.pcs ?? 0), col.pcs + 8, rowTop - 13, 8);
//       drawText(
//         formatWeight(Number(line.weightKg) || 0),
//         col.weight + 4,
//         rowTop - 13,
//         8,
//       );

//       y = rowTop - rowH;
//     }

//     // Totals on last page
//     if (pageIndex === totalPages - 1) {
//       const totalRowTop = y;
//       page.drawRectangle({
//         x: marginX,
//         y: totalRowTop - rowH,
//         width: tableRight - marginX,
//         height: rowH,
//         borderColor: black,
//         borderWidth: 0.7,
//       });
//       drawText(
//         formatWeight(totalWeight),
//         col.weight + 4,
//         totalRowTop - 13,
//         8,
//         true,
//       );
//       y = totalRowTop - rowH - 14;

//       drawText("Total Amount :", col.consignee + 4, y, 10, true);
//       drawText(formatAmount(totalAmount), col.weight - 20, y, 10, true);
//     }

//     // Footer
//     drawText(
//       `Date : ${safeText(input.date)}`,
//       marginX,
//       marginY,
//       8,
//       false,
//       gray,
//     );
//     const pageLabel = `Page No. : ${pageIndex + 1}`;
//     const pageLabelWidth = font.widthOfTextAtSize(pageLabel, 8);
//     drawText(
//       pageLabel,
//       pageWidth - marginX - pageLabelWidth,
//       marginY,
//       8,
//       false,
//       gray,
//     );
//   }

//   return pdf.save();
// }

// export function bytesToBase64(bytes: Uint8Array): string {
//   return Buffer.from(bytes).toString("base64");

// }

import "server-only";

/**
 * Manifest PDF — A4 PORTRAIT
 * Header: Customer, Customer Code, DATE, MANIFEST No
 * Table: SN | AWB No. | Forwarding No. | COUNTRY | CONSIGNEE | PCS | WEIGHT
 * Totals + footer
 */

export type ManifestLine = {
  awb: string;
  forwardingNo?: string;
  country?: string;
  consignee?: string;
  pcs?: number;
  weightKg?: number;
};

export type ManifestPdfInput = {
  customerName: string;
  customerCode?: string;
  manifestNo: string;
  date: string; // e.g. 25-04-2026
  lines: ManifestLine[];
  totalAmount?: number;
};

function safeText(value: unknown, fallback = ""): string {
  return String(value ?? "").trim() || fallback;
}

function formatWeight(n: number): string {
  if (!Number.isFinite(n)) return "0.000";
  return n.toFixed(3);
}

function formatAmount(n: number): string {
  if (!Number.isFinite(n)) return "0.00";
  return n.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export async function generateManifestPdf(
  input: ManifestPdfInput,
): Promise<Uint8Array> {
  const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");

  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  // A4 PORTRAIT
  const pageWidth = 595;
  const pageHeight = 842;
  const marginX = 28;
  const marginY = 28;

  const black = rgb(0, 0, 0);
  const gray = rgb(0.35, 0.35, 0.35);

  const lines = Array.isArray(input.lines) ? input.lines : [];
  const rowsPerPage = 28;
  const totalPages = Math.max(1, Math.ceil(lines.length / rowsPerPage) || 1);

  const totalWeight = lines.reduce(
    (sum, l) => sum + (Number(l.weightKg) || 0),
    0,
  );
  const totalAmount = Number(input.totalAmount) || 0;

  // Column x positions (portrait width ~539 usable)
  const col = {
    sn: marginX,
    awb: marginX + 28,
    fwd: marginX + 110,
    country: marginX + 210,
    consignee: marginX + 280,
    pcs: marginX + 430,
    weight: marginX + 470,
  };
  const tableRight = pageWidth - marginX;
  const vLines = [
    col.awb,
    col.fwd,
    col.country,
    col.consignee,
    col.pcs,
    col.weight,
  ];

  for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
    const page = pdf.addPage([pageWidth, pageHeight]);
    let y = pageHeight - marginY - 8;

    const drawText = (
      text: string,
      x: number,
      yPos: number,
      size: number,
      useBold = false,
      color = black,
    ) => {
      page.drawText(String(text || "").slice(0, 60), {
        x,
        y: yPos,
        size,
        font: useBold ? bold : font,
        color,
      });
    };

    // Title
    const title = "MANIFEST";
    const titleSize = 16;
    const titleWidth = bold.widthOfTextAtSize(title, titleSize);
    drawText(title, (pageWidth - titleWidth) / 2, y, titleSize, true);
    y -= 20;

    // Header box
    const headerTop = y + 6;
    const headerHeight = 40;
    page.drawRectangle({
      x: marginX,
      y: headerTop - headerHeight,
      width: tableRight - marginX,
      height: headerHeight,
      borderColor: black,
      borderWidth: 1,
    });

    const midX = marginX + (tableRight - marginX) * 0.55;
    page.drawLine({
      start: { x: midX, y: headerTop },
      end: { x: midX, y: headerTop - headerHeight },
      thickness: 1,
      color: black,
    });
    page.drawLine({
      start: { x: marginX, y: headerTop - headerHeight / 2 },
      end: { x: tableRight, y: headerTop - headerHeight / 2 },
      thickness: 0.7,
      color: black,
    });

    drawText(
      `Customer :  ${safeText(input.customerName, "—")}`,
      marginX + 6,
      headerTop - 13,
      8,
      true,
    );
    drawText(
      `Customer Code :  ${safeText(input.customerCode, "—")}`,
      marginX + 6,
      headerTop - headerHeight / 2 - 13,
      8,
      true,
    );
    drawText(
      `DATE :  ${safeText(input.date)}`,
      midX + 6,
      headerTop - 13,
      8,
      true,
    );
    drawText(
      `MANIFEST No :  ${safeText(input.manifestNo)}`,
      midX + 6,
      headerTop - headerHeight / 2 - 13,
      8,
      true,
    );

    y = headerTop - headerHeight - 4;

    // Table header
    const rowH = 16;
    const tableHeaderY = y;
    page.drawRectangle({
      x: marginX,
      y: tableHeaderY - rowH,
      width: tableRight - marginX,
      height: rowH,
      borderColor: black,
      borderWidth: 1,
    });

    const headers = [
      { label: "SN", x: col.sn + 4 },
      { label: "AWB No.", x: col.awb + 3 },
      { label: "Forwarding No.", x: col.fwd + 3 },
      { label: "COUNTRY", x: col.country + 3 },
      { label: "CONSIGNEE", x: col.consignee + 3 },
      { label: "PCS", x: col.pcs + 3 },
      { label: "WEIGHT", x: col.weight + 3 },
    ];
    for (const h of headers) {
      drawText(h.label, h.x, tableHeaderY - 11, 7, true);
    }
    for (const vx of vLines) {
      page.drawLine({
        start: { x: vx, y: tableHeaderY },
        end: { x: vx, y: tableHeaderY - rowH },
        thickness: 0.6,
        color: black,
      });
    }

    y = tableHeaderY - rowH;

    const pageLines = lines.slice(
      pageIndex * rowsPerPage,
      pageIndex * rowsPerPage + rowsPerPage,
    );

    for (let i = 0; i < pageLines.length; i++) {
      const line = pageLines[i]!;
      const sn = pageIndex * rowsPerPage + i + 1;
      const rowTop = y;

      page.drawRectangle({
        x: marginX,
        y: rowTop - rowH,
        width: tableRight - marginX,
        height: rowH,
        borderColor: black,
        borderWidth: 0.7,
      });
      for (const vx of vLines) {
        page.drawLine({
          start: { x: vx, y: rowTop },
          end: { x: vx, y: rowTop - rowH },
          thickness: 0.5,
          color: black,
        });
      }

      drawText(String(sn), col.sn + 6, rowTop - 11, 7);
      drawText(safeText(line.awb), col.awb + 3, rowTop - 11, 7);
      drawText(safeText(line.forwardingNo), col.fwd + 3, rowTop - 11, 7);
      drawText(safeText(line.country), col.country + 3, rowTop - 11, 7);
      drawText(
        safeText(line.consignee).slice(0, 28),
        col.consignee + 3,
        rowTop - 11,
        7,
      );
      drawText(String(line.pcs ?? 0), col.pcs + 6, rowTop - 11, 7);
      drawText(
        formatWeight(Number(line.weightKg) || 0),
        col.weight + 3,
        rowTop - 11,
        7,
      );

      y = rowTop - rowH;
    }

    // Totals on last page
    if (pageIndex === totalPages - 1) {
      const totalRowTop = y;
      page.drawRectangle({
        x: marginX,
        y: totalRowTop - rowH,
        width: tableRight - marginX,
        height: rowH,
        borderColor: black,
        borderWidth: 0.7,
      });
      drawText(
        formatWeight(totalWeight),
        col.weight + 3,
        totalRowTop - 11,
        7,
        true,
      );
      y = totalRowTop - rowH - 14;

      // drawText("Total Amount :", col.consignee + 3, y, 9, true);
      drawText("Shipment Value :", col.consignee + 3, y, 9, true);
      drawText(formatAmount(totalAmount), col.weight - 10, y, 9, true);
    }

    // Footer
    drawText(
      `Date : ${safeText(input.date)}`,
      marginX,
      marginY,
      8,
      false,
      gray,
    );
    const pageLabel = `Page No. : ${pageIndex + 1}`;
    const pageLabelWidth = font.widthOfTextAtSize(pageLabel, 8);
    drawText(
      pageLabel,
      pageWidth - marginX - pageLabelWidth,
      marginY,
      8,
      false,
      gray,
    );
  }

  return pdf.save();
}

export function bytesToBase64(bytes: Uint8Array): string {
  return Buffer.from(bytes).toString("base64");
}