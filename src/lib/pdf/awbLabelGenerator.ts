// import "server-only";

// import {
//   PDFDocument,
//   StandardFonts,
//   rgb,
//   degrees,
// } from "pdf-lib";

// export type AwbLabelData = {
//   awb: string;
//   accountCode?: string;
//   bookDate?: string;

//   shipperName: string;
//   shipperAddress: string;
//   shipperCity: string;
//   shipperState?: string;
//   shipperPincode?: string;
//   shipperPhone?: string;
//   shipperCountry?: string;

//   consigneeName: string;
//   consigneeAddress: string;
//   consigneeCity: string;
//   consigneeState?: string;
//   consigneePincode?: string;
//   consigneePhone?: string;
//   consigneeCountry?: string;

//   serviceType?: string;
//   product?: string;
//   vendor?: string;

//   pieces: number;
//   actualWeight: number;
//   chargeableWeight: number;
//   dimensions?: string; // e.g. "37*37*24*1=7"

//   declaredValue?: number;
//   currency?: string;
//   content?: string;
//   csbType?: string;
// };

// export async function generateAwbLabelPdf(
//   data: AwbLabelData,
// ): Promise<Uint8Array> {
//   const pdf = await PDFDocument.create();
//   const page = pdf.addPage([595.28, 841.89]); // A4
//   const { width, height } = page.getSize();

//   const font = await pdf.embedFont(StandardFonts.Helvetica);
//   const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

//   const margin = 28;
//   let y = height - margin;

//   const drawText = (
//     text: string,
//     x: number,
//     yPos: number,
//     size = 9,
//     isBold = false,
//   ) => {
//     page.drawText(text || "", {
//       x,
//       y: yPos,
//       size,
//       font: isBold ? bold : font,
//       color: rgb(0, 0, 0),
//     });
//   };

//   // Header bar
//   page.drawRectangle({
//     x: margin,
//     y: y - 22,
//     width: width - margin * 2,
//     height: 28,
//     color: rgb(0.05, 0.12, 0.23),
//   });
//   drawText("SHIPMENT LABEL", margin + 8, y - 14, 12, true);
//   drawText(
//     data.accountCode ? `Account: ${data.accountCode}` : "",
//     width - margin - 140,
//     y - 14,
//     10,
//     true,
//   );
//   y -= 40;

//   // AWB + Barcode placeholder
//   drawText(`AWB No: ${data.awb}`, margin, y, 14, true);
//   drawText(
//     data.bookDate ? `Date: ${data.bookDate}` : "",
//     width / 2,
//     y,
//     10,
//   );
//   y -= 8;

//   // Simple barcode representation (lines)
//   const barcodeY = y - 28;
//   page.drawRectangle({
//     x: margin,
//     y: barcodeY,
//     width: 220,
//     height: 32,
//     borderColor: rgb(0, 0, 0),
//     borderWidth: 1,
//   });
//   // Fake barcode lines
//   for (let i = 0; i < 40; i++) {
//     const bx = margin + 6 + i * 5;
//     const bh = 10 + (i % 3) * 6;
//     page.drawRectangle({
//       x: bx,
//       y: barcodeY + 4,
//       width: 1.5,
//       height: bh,
//       color: rgb(0, 0, 0),
//     });
//   }
//   drawText(data.awb, margin + 50, barcodeY - 12, 9);
//   y = barcodeY - 28;

//   // Two-column addresses
//   const colW = (width - margin * 2 - 12) / 2;

//   // Shipper box
//   page.drawRectangle({
//     x: margin,
//     y: y - 110,
//     width: colW,
//     height: 115,
//     borderColor: rgb(0.7, 0.7, 0.7),
//     borderWidth: 0.8,
//   });
//   drawText("FROM (SHIPPER)", margin + 6, y - 12, 8, true);
//   drawText(data.shipperName, margin + 6, y - 26, 10, true);
//   drawText(data.shipperAddress, margin + 6, y - 40, 8);
//   drawText(
//     `${data.shipperCity || ""} ${data.shipperState || ""} ${data.shipperPincode || ""}`,
//     margin + 6,
//     y - 52,
//     8,
//   );
//   drawText(data.shipperCountry || "INDIA", margin + 6, y - 64, 8);
//   if (data.shipperPhone) {
//     drawText(`Tel: ${data.shipperPhone}`, margin + 6, y - 78, 8);
//   }

//   // Consignee box
//   page.drawRectangle({
//     x: margin + colW + 12,
//     y: y - 110,
//     width: colW,
//     height: 115,
//     borderColor: rgb(0.7, 0.7, 0.7),
//     borderWidth: 0.8,
//   });
//   drawText("TO (CONSIGNEE)", margin + colW + 18, y - 12, 8, true);
//   drawText(data.consigneeName, margin + colW + 18, y - 26, 10, true);
//   drawText(data.consigneeAddress, margin + colW + 18, y - 40, 8);
//   drawText(
//     `${data.consigneeCity || ""} ${data.consigneeState || ""} ${data.consigneePincode || ""}`,
//     margin + colW + 18,
//     y - 52,
//     8,
//   );
//   drawText(
//     data.consigneeCountry || "",
//     margin + colW + 18,
//     y - 64,
//     8,
//   );
//   if (data.consigneePhone) {
//     drawText(
//       `Tel: ${data.consigneePhone}`,
//       margin + colW + 18,
//       y - 78,
//       8,
//     );
//   }

//   y -= 130;

//   // Service / Weight info
//   page.drawRectangle({
//     x: margin,
//     y: y - 70,
//     width: width - margin * 2,
//     height: 75,
//     borderColor: rgb(0.7, 0.7, 0.7),
//     borderWidth: 0.8,
//   });

//   const info = [
//     [`Service: ${data.serviceType || data.product || "-"}`, `Vendor: ${data.vendor || "-"}`],
//     [`Pieces: ${data.pieces}`, `Actual Wt: ${data.actualWeight} kg`],
//     [`Charged Wt: ${data.chargeableWeight} kg`, `Dims: ${data.dimensions || "-"}`],
//     [
//       `Declared Value: ${data.currency || "INR"} ${data.declaredValue ?? 0}`,
//       `CSB: ${data.csbType || "-"}`,
//     ],
//   ];

//   info.forEach((row, i) => {
//     drawText(row[0], margin + 8, y - 16 - i * 14, 9);
//     drawText(row[1], margin + 280, y - 16 - i * 14, 9);
//   });

//   y -= 90;

//   // Content
//   drawText("Contents:", margin, y, 9, true);
//   drawText(data.content || "USED CLOTHES / GIFT", margin + 60, y, 9);
//   y -= 24;

//   // POD box
//   page.drawRectangle({
//     x: margin,
//     y: y - 90,
//     width: width - margin * 2,
//     height: 95,
//     borderColor: rgb(0.7, 0.7, 0.7),
//     borderWidth: 0.8,
//   });
//   drawText("PROOF OF DELIVERY (POD)", margin + 8, y - 14, 9, true);
//   drawText("Receiver's Signature: _______________________________", margin + 8, y - 40, 9);
//   drawText("Date: ____ / ____ / ________    Time: ______ AM/PM", margin + 8, y - 60, 9);
//   drawText("(Capital letters very important)", margin + 8, y - 78, 7);

//   // Footer
//   drawText(
//     "Sreshta Logistics  •  Generated on " + new Date().toLocaleString("en-IN"),
//     margin,
//     30,
//     7,
//   );

//   return pdf.save();
// }










// import "server-only";

// import {
//   PDFDocument,
//   StandardFonts,
//   rgb,
//   PDFPage,
//   PDFFont,
// } from "pdf-lib";

// export type AwbLabelData = {
//   awb: string;
//   accountCode?: string;          // e.g. WH439 / WF439
//   bookDate?: string;             // YYYY-MM-DD or DD/MM/YYYY
//   printedAt?: string;

//   // Shipper
//   shipperName: string;
//   shipperAddress: string;
//   shipperCity?: string;
//   shipperState?: string;
//   shipperPincode?: string;
//   shipperPhone?: string;
//   shipperCountry?: string;

//   // Consignee
//   consigneeName: string;
//   consigneeAddress: string;
//   consigneeCity?: string;
//   consigneeState?: string;
//   consigneePincode?: string;
//   consigneePhone?: string;
//   consigneeCountry?: string;

//   // Service
//   serviceType?: string;          // SPX INTERNATIONAL PRIORITY
//   product?: string;
//   vendor?: string;               // FEDERAL EXPRESS CORPORATION / FDX

//   // Package
//   pieces: number;
//   actualWeight: number;
//   chargeableWeight: number;
//   dimensions?: string;           // e.g. "37*37*24*1=7"

//   // Customs
//   declaredValue?: number;
//   currency?: string;             // INR
//   content?: string;              // USED CLOTHES
//   csbType?: string;              // CSB4
//   specialInstructions?: string;
//   origin?: string;               // GUNTUR
// };

// export async function generateAwbLabelPdf(
//   data: AwbLabelData,
// ): Promise<Uint8Array> {
//   const pdf = await PDFDocument.create();
//   const page = pdf.addPage([595.28, 841.89]); // A4
//   const { width, height } = page.getSize();

//   const font = await pdf.embedFont(StandardFonts.Helvetica);
//   const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

//   const margin = 18;
//   const black = rgb(0, 0, 0);
//   const gray = rgb(0.35, 0.35, 0.35);
//   const lightGray = rgb(0.92, 0.92, 0.92);

//   const drawText = (
//     text: string,
//     x: number,
//     y: number,
//     size = 8,
//     isBold = false,
//     color = black,
//   ) => {
//     page.drawText(String(text || ""), {
//       x,
//       y,
//       size,
//       font: isBold ? bold : font,
//       color,
//     });
//   };

//   const drawRect = (
//     x: number,
//     y: number,
//     w: number,
//     h: number,
//     borderWidth = 0.8,
//     fill?: ReturnType<typeof rgb>,
//   ) => {
//     page.drawRectangle({
//       x,
//       y,
//       width: w,
//       height: h,
//       borderColor: black,
//       borderWidth,
//       color: fill,
//     });
//   };

//   // ========== TOP HEADER ==========
//   const topY = height - margin;

//   drawText(
//     data.printedAt ||
//       new Date().toLocaleString("en-IN", {
//         day: "2-digit",
//         month: "2-digit",
//         year: "numeric",
//         hour: "2-digit",
//         minute: "2-digit",
//       }),
//     margin,
//     topY - 10,
//     7,
//   );

//   drawText("Shipment Label", width / 2 - 35, topY - 10, 10, true);
//   drawText(
//     `Printed on  ${data.bookDate || new Date().toLocaleDateString("en-GB")}`,
//     width - margin - 130,
//     topY - 10,
//     7,
//   );

//   // Top thick line
//   page.drawLine({
//     start: { x: margin, y: topY - 16 },
//     end: { x: width - margin, y: topY - 16 },
//     thickness: 1.2,
//     color: black,
//   });

//   // ========== ACCOUNT / ORIGIN / AWB / CUSTOMER REF ==========
//   let y = topY - 34;

//   // Account Number box
//   drawRect(margin, y - 38, 145, 42);
//   drawText("1. ACCOUNT NUMBER", margin + 4, y - 10, 7, true);
//   drawText(data.accountCode || "WH439", margin + 4, y - 26, 14, true);

//   // Origin + AWB
//   drawRect(margin + 145, y - 38, 220, 42);
//   drawText(data.origin || "GUNTUR", margin + 155, y - 12, 11, true);
//   drawText(data.awb, margin + 155, y - 30, 16, true);

//   // Customer Reference
//   drawRect(margin + 365, y - 38, width - margin * 2 - 365, 42);
//   drawText("CUSTOMER REFERENCE", margin + 370, y - 10, 7, true);
//   drawText("SRESHTA COURIERS", margin + 370, y - 26, 10, true);

//   // ========== MAIN BODY - 3 COLUMNS ==========
//   y = y - 48;

//   const col1W = 195;
//   const col2W = 195;
//   const col3W = width - margin * 2 - col1W - col2W;

//   // ---- LEFT: SHIPPER ----
//   drawRect(margin, y - 155, col1W, 160);
//   drawText("S", margin + 4, y - 12, 9, true);
//   drawText("H", margin + 4, y - 24, 9, true);
//   drawText("I", margin + 4, y - 36, 9, true);
//   drawText("P", margin + 4, y - 48, 9, true);
//   drawText("P", margin + 4, y - 60, 9, true);
//   drawText("E", margin + 4, y - 72, 9, true);
//   drawText("R", margin + 4, y - 84, 9, true);

//   drawText(data.shipperName, margin + 18, y - 14, 9, true);
//   // Address lines
//   const shipAddrLines = wrapText(data.shipperAddress || "", 28);
//   shipAddrLines.forEach((line, i) => {
//     drawText(line, margin + 18, y - 28 - i * 11, 8);
//   });
//   drawText(
//     `${data.shipperCity || ""} ${data.shipperState || ""}`.trim(),
//     margin + 18,
//     y - 28 - shipAddrLines.length * 11,
//     8,
//   );
//   drawText(
//     data.shipperPincode || "",
//     margin + 18,
//     y - 40 - shipAddrLines.length * 11,
//     8,
//   );
//   if (data.shipperPhone) {
//     drawText(data.shipperPhone, margin + 18, y - 54 - shipAddrLines.length * 11, 8);
//   }

//   // ---- MIDDLE: CONSIGNEE ----
//   drawRect(margin + col1W, y - 155, col2W, 160);
//   drawText("C", margin + col1W + 4, y - 12, 9, true);
//   drawText("O", margin + col1W + 4, y - 24, 9, true);
//   drawText("N", margin + col1W + 4, y - 36, 9, true);
//   drawText("S", margin + col1W + 4, y - 48, 9, true);
//   drawText("I", margin + col1W + 4, y - 60, 9, true);
//   drawText("G", margin + col1W + 4, y - 72, 9, true);
//   drawText("N", margin + col1W + 4, y - 84, 9, true);
//   drawText("E", margin + col1W + 4, y - 96, 9, true);
//   drawText("E", margin + col1W + 4, y - 108, 9, true);

//   drawText(data.consigneeName, margin + col1W + 18, y - 14, 9, true);
//   const consAddrLines = wrapText(data.consigneeAddress || "", 26);
//   consAddrLines.forEach((line, i) => {
//     drawText(line, margin + col1W + 18, y - 28 - i * 11, 8);
//   });
//   drawText(
//     `${data.consigneeCity || ""} ${data.consigneeState || ""}`.trim(),
//     margin + col1W + 18,
//     y - 28 - consAddrLines.length * 11,
//     8,
//   );
//   drawText(
//     data.consigneePincode || "",
//     margin + col1W + 18,
//     y - 40 - consAddrLines.length * 11,
//     8,
//   );
//   drawText(
//     `Country : ${data.consigneeCountry || "U.S.A."}`,
//     margin + col1W + 18,
//     y - 54 - consAddrLines.length * 11,
//     8,
//   );
//   if (data.consigneePhone) {
//     drawText(
//       data.consigneePhone,
//       margin + col1W + 18,
//       y - 68 - consAddrLines.length * 11,
//       8,
//     );
//   }

//   // ---- RIGHT: SERVICE + CONTENTS + SIZE ----
//   drawRect(margin + col1W + col2W, y - 155, col3W, 160);

//   // Service Type
//   drawRect(margin + col1W + col2W, y - 28, col3W, 28, 0.6, lightGray);
//   drawText("SERVICE TYPE", margin + col1W + col2W + 4, y - 10, 7, true);
//   drawText(
//     data.serviceType || data.product || "SPX  INTERNATIONAL PRIORITY",
//     margin + col1W + col2W + 4,
//     y - 22,
//     8,
//     true,
//   );

//   drawText(
//     data.vendor || "FEDERAL EXPRESS CORPORATION",
//     margin + col1W + col2W + 4,
//     y - 42,
//     8,
//   );

//   drawText("FULL DESCRIPTION OF CONTENTS :-", margin + col1W + col2W + 4, y - 58, 7, true);
//   drawText(data.content || "USED CLOTHES", margin + col1W + col2W + 4, y - 70, 8);

//   drawText("SPECIAL INSTRUCTIONS :-", margin + col1W + col2W + 4, y - 90, 7, true);
//   drawText(data.specialInstructions || "", margin + col1W + col2W + 4, y - 102, 8);

//   // Size & Weight box
//   drawRect(margin + col1W + col2W, y - 155, col3W, 48);
//   drawText("SIZE & WEIGHT", margin + col1W + col2W + 4, y - 118, 7, true);
//   drawText(`Pieces :   ${data.pieces}`, margin + col1W + col2W + 4, y - 132, 8);
//   drawText(
//     `Weight   ${data.actualWeight.toFixed(3)}   Kgs`,
//     margin + col1W + col2W + 4,
//     y - 144,
//     8,
//   );

//   // ========== BOTTOM SECTION ==========
//   y = y - 170;

//   // Left: Sender Authorisation + POD
//   drawRect(margin, y - 175, 210, 180);

//   // ICL style logo placeholder
//   drawText("ICL", margin + 70, y - 25, 18, true);
//   drawText("Integrated Couriers & Logistics", margin + 30, y - 40, 7);

//   drawText("SENDER'S AUTHORISATION AND SIGNATURE", margin + 8, y - 58, 7, true);
//   drawText("SENDER'S SIGNATURE", margin + 8, y - 78, 8);
//   drawText("DATE", margin + 8, y - 98, 8);

//   // Thick line
//   page.drawLine({
//     start: { x: margin + 8, y: y - 110 },
//     end: { x: margin + 200, y: y - 110 },
//     thickness: 1,
//   });

//   drawText("PROOF OF DELIVERY (POD)", margin + 8, y - 128, 9, true);
//   drawText("RECEIVER'S SIGNATURE", margin + 8, y - 148, 8);
//   drawText("DATE    /     /            TIME     AM/PM", margin + 8, y - 168, 7);
//   drawText("(CAPITAL LETTERS VERY IMPORTANT)", margin + 8, y - 182, 6);

//   // Middle: Declared Value + CSB4 + Barcode
//   drawRect(margin + 210, y - 175, 175, 180);

//   drawText("DECLARED VALUE FOR", margin + 220, y - 18, 7, true);
//   drawText("CUSTOMS AND CURRENCY", margin + 220, y - 30, 7, true);
//   drawText(
//     `${data.declaredValue ?? 3200} ${data.currency || "INR"}`,
//     margin + 220,
//     y - 50,
//     14,
//     true,
//   );

//   // CSB4 big stamp
//   drawRect(margin + 230, y - 105, 130, 40, 1.5);
//   drawText(data.csbType || "CSB4", margin + 260, y - 90, 18, true);

//   // Barcode area
//   drawRect(margin + 220, y - 165, 155, 50);
//   // Simple barcode simulation
//   for (let i = 0; i < 42; i++) {
//     const bx = margin + 228 + i * 3.4;
//     const bh = 18 + (i % 4) * 5;
//     page.drawRectangle({
//       x: bx,
//       y: y - 155,
//       width: 1.4,
//       height: bh,
//       color: black,
//     });
//   }
//   drawText(data.awb, margin + 255, y - 172, 9, true);

//   // Right: Size & Weight details
//   drawRect(margin + 385, y - 175, width - margin * 2 - 385, 180);

//   drawText("SIZE & WEIGHT", margin + 395, y - 18, 8, true);
//   drawText(`Pieces :   ${data.pieces}`, margin + 395, y - 40, 10);
//   drawText(
//     `Weight   ${data.actualWeight.toFixed(3)}   Kgs`,
//     margin + 395,
//     y - 60,
//     10,
//   );
//   drawText(data.dimensions || "37*37*24*1=7", margin + 395, y - 85, 10);
//   drawText(
//     `CHARGED WEIGHT   ${data.chargeableWeight.toFixed(2)}`,
//     margin + 395,
//     y - 115,
//     11,
//     true,
//   );

//   // Footer
//   drawText(
//     "Sreshta Logistics  •  System Generated Label",
//     margin,
//     18,
//     7,
//     false,
//     gray,
//   );

//   return pdf.save();
// }

// // Simple text wrapper
// function wrapText(text: string, maxChars: number): string[] {
//   if (!text) return [];
//   const words = text.split(/\s+/);
//   const lines: string[] = [];
//   let current = "";

//   for (const word of words) {
//     if ((current + " " + word).trim().length <= maxChars) {
//       current = (current + " " + word).trim();
//     } else {
//       if (current) lines.push(current);
//       current = word;
//     }
//   }
//   if (current) lines.push(current);
//   return lines.slice(0, 5); // max 5 lines
// }

// import "server-only";

// import {
//   PDFDocument,
//   StandardFonts,
//   rgb,
// } from "pdf-lib";

// export type AwbLabelData = {
//   awb: string;
//   accountCode?: string;
//   bookDate?: string;
//   printedAt?: string;

//   // Shipper
//   shipperName: string;
//   shipperAddress: string;
//   shipperCity?: string;
//   shipperState?: string;
//   shipperPincode?: string;
//   shipperPhone?: string;
//   shipperCountry?: string;

//   // Consignee
//   consigneeName: string;
//   consigneeAddress: string;
//   consigneeCity?: string;
//   consigneeState?: string;
//   consigneePincode?: string;
//   consigneePhone?: string;
//   consigneeCountry?: string;

//   // Service
//   serviceType?: string;
//   product?: string;
//   vendor?: string;
//   customerReference?: string;

//   // Weight / pieces
//   pieces: number;
//   actualWeight: number;
//   chargeableWeight: number;
//   dimensions?: string;

//   // Customs
//   declaredValue?: number;
//   currency?: string;
//   content?: string;
//   csbType?: string;
//   specialInstructions?: string;
//   origin?: string;
// };

// /* ------------------------------------------------------------------ */
// /*  Minimal Code-128 barcode (subset B) – pure TS, no extra dependency */
// /* ------------------------------------------------------------------ */

// const CODE128_B: Record<string, string> = {
//   " ": "11011001100", "!": "11001101100", '"': "11001100110",
//   "#": "10010011000", "$": "10010001100", "%": "10001001100",
//   "&": "10011001000", "'": "10011000100", "(": "10001100100",
//   ")": "11001001000", "*": "11001000100", "+": "11000100100",
//   ",": "10110011100", "-": "10011011100", ".": "10011001110",
//   "/": "10111001100", "0": "10011101100", "1": "10011100110",
//   "2": "11001110010", "3": "11001011100", "4": "11001001110",
//   "5": "11011100100", "6": "11001110100", "7": "11101101110",
//   "8": "11101001100", "9": "11100101100", ":": "11100100110",
//   ";": "11101100100", "<": "11100110100", "=": "11100110010",
//   ">": "11011011000", "?": "11011000110", "@": "11000110110",
//   A: "10100011000", B: "10001011000", C: "10001000110",
//   D: "10110001000", E: "10001101000", F: "10001100010",
//   G: "11010001000", H: "11000101000", I: "11000100010",
//   J: "10110111000", K: "10110001110", L: "10001101110",
//   M: "10111011000", N: "10111000110", O: "10001110110",
//   P: "11101110110", Q: "11010001110", R: "11000101110",
//   S: "11011101000", T: "11011100010", U: "11011101110",
//   V: "11101011000", W: "11101000110", X: "11100010110",
//   Y: "11101101000", Z: "11101100010", "[": "11100011010",
//   "\\": "11101111010", "]": "11001000010", "^": "11110001010",
//   _: "10100110000", "`": "10100001100", a: "10010110000",
//   b: "10010000110", c: "10000101100", d: "10000100110",
//   e: "10110010000", f: "10110000100", g: "10011010000",
//   h: "10011000010", i: "10000110100", j: "10000110010",
//   k: "11000010010", l: "11001010000", m: "11110111010",
//   n: "11000010100", o: "10001111010", p: "10100111100",
//   q: "10010111100", r: "10010011110", s: "10111100100",
//   t: "10011110100", u: "10011110010", v: "11110100100",
//   w: "11110010100", x: "11110010010", y: "11011011110",
//   z: "11011110110", "{": "11110110110", "|": "10101111000",
//   "}": "10100011110", "~": "10001011110",
// };

// const START_B = "11010010000";
// const STOP = "1100011101011";

// function encodeCode128B(text: string): string {
//   const clean = String(text || "").toUpperCase().replace(/[^0-9A-Z\-\s]/g, "");
//   if (!clean) return START_B + STOP;

//   let pattern = START_B;
//   let checksum = 104; // Start B value

//   for (let i = 0; i < clean.length; i++) {
//     const ch = clean[i];
//     const bars = CODE128_B[ch];
//     if (!bars) continue;
//     pattern += bars;
//     // Code set B values: space=0 … ~ = 94
//     const value = ch.charCodeAt(0) - 32;
//     checksum += value * (i + 1);
//   }

//   const checkChar = checksum % 103;
//   // Map check value back to a character in set B
//   const checkCh = String.fromCharCode(checkChar + 32);
//   if (CODE128_B[checkCh]) {
//     pattern += CODE128_B[checkCh];
//   } else {
//     // fallback quiet pattern
//     pattern += "11011001100";
//   }

//   pattern += STOP;
//   return pattern;
// }

// function drawBarcode(
//   page: any,
//   x: number,
//   y: number,
//   height: number,
//   text: string,
//   moduleWidth = 1.15,
// ) {
//   const pattern = encodeCode128B(text);
//   let cx = x;

//   for (let i = 0; i < pattern.length; i++) {
//     if (pattern[i] === "1") {
//       page.drawRectangle({
//         x: cx,
//         y,
//         width: moduleWidth,
//         height,
//         color: rgb(0, 0, 0),
//       });
//     }
//     cx += moduleWidth;
//   }

//   return cx - x; // total width drawn
// }

// /* ------------------------------------------------------------------ */
// /*  Helpers                                                            */
// /* ------------------------------------------------------------------ */

// function wrapText(text: string, maxChars: number): string[] {
//   if (!text) return [];
//   const words = String(text).split(/\s+/);
//   const lines: string[] = [];
//   let current = "";

//   for (const word of words) {
//     const next = (current + " " + word).trim();
//     if (next.length <= maxChars) {
//       current = next;
//     } else {
//       if (current) lines.push(current);
//       current = word;
//     }
//   }
//   if (current) lines.push(current);
//   return lines.slice(0, 6);
// }

// function formatPrintedAt(value?: string): string {
//   if (value) return value;
//   const d = new Date();
//   const pad = (n: number) => String(n).padStart(2, "0");
//   return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
// }

// /* ------------------------------------------------------------------ */
// /*  Main generator                                                     */
// /* ------------------------------------------------------------------ */

// export async function generateAwbLabelPdf(
//   data: AwbLabelData,
// ): Promise<Uint8Array> {
//   const pdf = await PDFDocument.create();
//   // A4
//   const page = pdf.addPage([595.28, 841.89]);
//   const { width, height } = page.getSize();

//   const font = await pdf.embedFont(StandardFonts.Helvetica);
//   const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

//   const margin = 16;
//   const black = rgb(0, 0, 0);
//   const gray = rgb(0.35, 0.35, 0.35);
//   const lightGray = rgb(0.93, 0.93, 0.93);

//   const drawText = (
//     text: string,
//     x: number,
//     y: number,
//     size = 8,
//     isBold = false,
//     color = black,
//   ) => {
//     const t = String(text ?? "");
//     if (!t) return;
//     page.drawText(t, {
//       x,
//       y,
//       size,
//       font: isBold ? bold : font,
//       color,
//     });
//   };

//   const drawRect = (
//     x: number,
//     y: number,
//     w: number,
//     h: number,
//     borderWidth = 0.9,
//     fill?: ReturnType<typeof rgb>,
//   ) => {
//     page.drawRectangle({
//       x,
//       y,
//       width: w,
//       height: h,
//       borderColor: black,
//       borderWidth,
//       color: fill,
//     });
//   };

//   const contentWidth = width - margin * 2;
//   let y = height - margin;

//   /* ---------- TOP HEADER BAR ---------- */
//   drawRect(margin, y - 22, contentWidth, 22, 0.8, lightGray);

//   const printed = formatPrintedAt(data.printedAt);
//   drawText(printed.split(" ")[0] || printed, margin + 6, y - 15, 7);
//   drawText(
//     "https://icl.express.in/tracking/",
//     margin + 90,
//     y - 15,
//     7,
//   );
//   drawText("Shipment Label", margin + 250, y - 15, 9, true);
//   drawText(`Printed on  ${printed}`, margin + 380, y - 15, 7);

//   y -= 28;

//   /* ---------- ACCOUNT / ORIGIN / CUSTOMER REF HEADER ---------- */
//   const headerH = 38;
//   const colA = 150;
//   const colB = 160;
//   const colC = contentWidth - colA - colB;

//   // Account number
//   drawRect(margin, y - headerH, colA, headerH);
//   drawText("1  ACCOUNT NUMBER", margin + 4, y - 12, 7, true);
//   drawText(data.accountCode || "WF439", margin + 4, y - 28, 12, true);

//   // Origin city + AWB
//   drawRect(margin + colA, y - headerH, colB, headerH);
//   drawText((data.origin || "GUNTUR").toUpperCase(), margin + colA + 8, y - 14, 11, true);
//   drawText(data.awb, margin + colA + 8, y - 30, 11, true);

//   // Customer reference
//   drawRect(margin + colA + colB, y - headerH, colC, headerH);
//   drawText("CUSTOMER REFERENCE", margin + colA + colB + 6, y - 12, 7, true);
//   drawText(
//     (data.customerReference || "SRESHTA COURIERS").toUpperCase(),
//     margin + colA + colB + 6,
//     y - 28,
//     10,
//     true,
//   );

//   y -= headerH + 4;

//   /* ---------- THREE MAIN COLUMNS (Shipper / Consignee / Service) ---------- */
//   const midH = 168;
//   const leftW = 195;
//   const midW = 195;
//   const rightW = contentWidth - leftW - midW;

//   // ---- LEFT: SHIPPER ----
//   drawRect(margin, y - midH, leftW, midH);

//   // Vertical "SHIPPER" letters
//   const shipperLetters = ["S", "H", "I", "P", "P", "E", "R"];
//   shipperLetters.forEach((ch, i) => {
//     drawText(ch, margin + 5, y - 16 - i * 12, 9, true);
//   });

//   drawText("1", margin + 20, y - 14, 8, true);
//   drawText(data.shipperName || "", margin + 32, y - 14, 9, true);

//   const shipLines = wrapText(data.shipperAddress || "", 30);
//   shipLines.forEach((line, i) => {
//     drawText(line, margin + 20, y - 28 - i * 11, 8);
//   });

//   let shipY = y - 28 - shipLines.length * 11;
//   const cityState = [data.shipperCity, data.shipperState]
//     .filter(Boolean)
//     .join(", ");
//   if (cityState) {
//     drawText(cityState, margin + 20, shipY - 2, 8);
//     shipY -= 12;
//   }
//   if (data.shipperPincode) {
//     drawText(data.shipperPincode, margin + 20, shipY - 2, 8);
//     shipY -= 12;
//   }
//   if (data.shipperCountry) {
//     drawText(data.shipperCountry, margin + 20, shipY - 2, 8);
//     shipY -= 12;
//   }
//   if (data.shipperPhone) {
//     drawText(data.shipperPhone, margin + 20, shipY - 2, 8);
//   }

//   // ---- CENTER: CONSIGNEE ----
//   drawRect(margin + leftW, y - midH, midW, midH);

//   const consigneeLetters = ["C", "O", "N", "S", "I", "G", "N", "E", "E"];
//   consigneeLetters.forEach((ch, i) => {
//     drawText(ch, margin + leftW + 5, y - 16 - i * 12, 9, true);
//   });

//   drawText("2", margin + leftW + 20, y - 14, 8, true);
//   drawText(data.consigneeName || "", margin + leftW + 32, y - 14, 9, true);

//   const consLines = wrapText(data.consigneeAddress || "", 28);
//   consLines.forEach((line, i) => {
//     drawText(line, margin + leftW + 20, y - 28 - i * 11, 8);
//   });

//   let consY = y - 28 - consLines.length * 11;
//   const consCityState = [data.consigneeCity, data.consigneeState]
//     .filter(Boolean)
//     .join(", ");
//   if (consCityState) {
//     drawText(consCityState, margin + leftW + 20, consY - 2, 8);
//     consY -= 12;
//   }
//   if (data.consigneePincode) {
//     drawText(data.consigneePincode, margin + leftW + 20, consY - 2, 8);
//     consY -= 12;
//   }
//   drawText(
//     `Country : ${data.consigneeCountry || "U.S.A."}`,
//     margin + leftW + 20,
//     consY - 2,
//     8,
//   );
//   consY -= 12;
//   if (data.consigneePhone) {
//     drawText(data.consigneePhone, margin + leftW + 20, consY - 2, 8);
//   }

//   // ---- RIGHT: SERVICE / CONTENTS ----
//   drawRect(margin + leftW + midW, y - midH, rightW, midH);

//   drawText("SERVICE TYPE", margin + leftW + midW + 6, y - 14, 7, true);
//   drawRect(margin + leftW + midW + 6, y - 36, rightW - 12, 18, 0.7, lightGray);
//   drawText(
//     (data.serviceType || "SPX  INTERNATIONAL PRIORITY").toUpperCase(),
//     margin + leftW + midW + 10,
//     y - 30,
//     8,
//     true,
//   );

//   drawText(
//     (data.vendor || data.product || "FEDERAL EXPRESS CORPORATION").toUpperCase(),
//     margin + leftW + midW + 6,
//     y - 52,
//     8,
//   );

//   drawText("FULL DESCRIPTION OF CONTENTS :-", margin + leftW + midW + 6, y - 72, 7, true);
//   const contentLines = wrapText(data.content || "USED CLOTHES", 28);
//   contentLines.forEach((line, i) => {
//     drawText(line, margin + leftW + midW + 6, y - 86 - i * 11, 8);
//   });

//   drawText("SPECIAL INSTRUCTIONS :-", margin + leftW + midW + 6, y - 130, 7, true);
//   const instrLines = wrapText(data.specialInstructions || "", 28);
//   instrLines.forEach((line, i) => {
//     drawText(line, margin + leftW + midW + 6, y - 144 - i * 11, 8);
//   });

//   y -= midH + 6;

//   /* ---------- BOTTOM SECTION (Sender Auth + Declared + Size) ---------- */
//   const botH = 195;
//   const botLeftW = 210;
//   const botMidW = 175;
//   const botRightW = contentWidth - botLeftW - botMidW;

//   // LEFT: Sender authorisation + ICL logo area + POD
//   drawRect(margin, y - botH, botLeftW, botH);

//   drawText("3  SENDER'S AUTHORISATION AND SIGNATURE", margin + 6, y - 14, 7, true);

//   // ICL logo block (text representation matching sample)
//   drawRect(margin + 10, y - 78, 120, 52, 1.2);
//   drawText("ICL", margin + 28, y - 42, 22, true);
//   drawText("®", margin + 78, y - 38, 10);
//   drawText("Integrated Couriers & Logistics", margin + 14, y - 58, 6);
//   drawText("SENDER'S SIGNATURE", margin + 14, y - 72, 7);

//   drawText("DATE", margin + 10, y - 98, 8);
//   page.drawLine({
//     start: { x: margin + 40, y: y - 100 },
//     end: { x: margin + 190, y: y - 100 },
//     thickness: 0.8,
//   });

//   drawText("PROOF OF DELIVERY (POD)", margin + 10, y - 122, 9, true);
//   drawText("RECEIVER'S SIGNATURE", margin + 10, y - 142, 8);
//   page.drawLine({
//     start: { x: margin + 10, y: y - 156 },
//     end: { x: margin + 190, y: y - 156 },
//     thickness: 0.8,
//   });
//   drawText("DATE    /     /            TIME     AM/PM", margin + 10, y - 172, 7);
//   drawText("(CAPITAL LETTERS VERY IMPORTANT)", margin + 10, y - 186, 6);

//   // CENTER: Declared value + CSB + Barcode
//   drawRect(margin + botLeftW, y - botH, botMidW, botH);

//   drawText("DECLARED VALUE FOR", margin + botLeftW + 10, y - 16, 7, true);
//   drawText("CUSTOMS AND CURRENCY", margin + botLeftW + 10, y - 28, 7, true);
//   drawText(
//     `${data.declaredValue ?? 0} ${data.currency || "INR"}`,
//     margin + botLeftW + 10,
//     y - 50,
//     16,
//     true,
//   );

//   // CSB badge
//   drawRect(margin + botLeftW + 25, y - 100, 120, 36, 1.8);
//   drawText(
//     (data.csbType || "CSB4").toUpperCase(),
//     margin + botLeftW + 55,
//     y - 82,
//     18,
//     true,
//   );

//   // Real Code-128 barcode (AWB number)
//   const barcodeX = margin + botLeftW + 12;
//   const barcodeY = y - 155;
//   const barcodeH = 32;
//   drawBarcode(page, barcodeX, barcodeY, barcodeH, data.awb, 1.05);

//   // Human-readable AWB under barcode
//   drawText(data.awb, margin + botLeftW + 45, y - 172, 10, true);

//   // RIGHT: Size & Weight
//   drawRect(margin + botLeftW + botMidW, y - botH, botRightW, botH);

//   drawText("SIZE & WEIGHT", margin + botLeftW + botMidW + 8, y - 16, 8, true);

//   drawText(`Pieces :   ${data.pieces ?? 1}`, margin + botLeftW + botMidW + 8, y - 42, 11);
//   drawText(
//     `Weight   ${(data.actualWeight ?? 0).toFixed(3)}   Kgs`,
//     margin + botLeftW + botMidW + 8,
//     y - 64,
//     11,
//   );
//   drawText(
//     data.dimensions || "",
//     margin + botLeftW + botMidW + 8,
//     y - 90,
//     10,
//   );
//   drawText(
//     `CHARGED WEIGHT   ${(data.chargeableWeight ?? 0).toFixed(2)}`,
//     margin + botLeftW + botMidW + 8,
//     y - 122,
//     11,
//     true,
//   );

//   /* ---------- FOOTER ---------- */
//   drawText(
//     "Sreshta Logistics  •  System Generated Label  •  ICL Network",
//     margin,
//     14,
//     7,
//     false,
//     gray,
//   );

//   return pdf.save();
// }

// import "server-only";

// import {
//   PDFDocument,
//   StandardFonts,
//   rgb,
// } from "pdf-lib";

// export type AwbLabelData = {
//   awb: string;
//   accountCode?: string;
//   bookDate?: string;
//   printedAt?: string;

//   shipperName: string;
//   shipperAddress: string;
//   shipperCity?: string;
//   shipperState?: string;
//   shipperPincode?: string;
//   shipperPhone?: string;
//   shipperCountry?: string;

//   consigneeName: string;
//   consigneeAddress: string;
//   consigneeCity?: string;
//   consigneeState?: string;
//   consigneePincode?: string;
//   consigneePhone?: string;
//   consigneeCountry?: string;

//   serviceType?: string;
//   product?: string;
//   vendor?: string;
//   customerReference?: string;

//   pieces: number;
//   actualWeight: number;
//   chargeableWeight: number;
//   dimensions?: string;

//   declaredValue?: number;
//   currency?: string;
//   content?: string;
//   csbType?: string;
//   specialInstructions?: string;
//   origin?: string;
// };

// /* ------------------------------------------------------------------ */
// /*  Code-128 Subset B (pure TS – no extra dependency)                 */
// /* ------------------------------------------------------------------ */

// const CODE128_B: Record<string, string> = {
//   " ": "11011001100", "!": "11001101100", '"': "11001100110",
//   "#": "10010011000", "$": "10010001100", "%": "10001001100",
//   "&": "10011001000", "'": "10011000100", "(": "10001100100",
//   ")": "11001001000", "*": "11001000100", "+": "11000100100",
//   ",": "10110011100", "-": "10011011100", ".": "10011001110",
//   "/": "10111001100", "0": "10011101100", "1": "10011100110",
//   "2": "11001110010", "3": "11001011100", "4": "11001001110",
//   "5": "11011100100", "6": "11001110100", "7": "11101101110",
//   "8": "11101001100", "9": "11100101100", ":": "11100100110",
//   ";": "11101100100", "<": "11100110100", "=": "11100110010",
//   ">": "11011011000", "?": "11011000110", "@": "11000110110",
//   A: "10100011000", B: "10001011000", C: "10001000110",
//   D: "10110001000", E: "10001101000", F: "10001100010",
//   G: "11010001000", H: "11000101000", I: "11000100010",
//   J: "10110111000", K: "10110001110", L: "10001101110",
//   M: "10111011000", N: "10111000110", O: "10001110110",
//   P: "11101110110", Q: "11010001110", R: "11000101110",
//   S: "11011101000", T: "11011100010", U: "11011101110",
//   V: "11101011000", W: "11101000110", X: "11100010110",
//   Y: "11101101000", Z: "11101100010", "[": "11100011010",
//   "\\": "11101111010", "]": "11001000010", "^": "11110001010",
//   _: "10100110000", "`": "10100001100", a: "10100110000",
//   b: "10010000110", c: "10000101100", d: "10000100110",
//   e: "10110010000", f: "10110000100", g: "10011010000",
//   h: "10011000010", i: "10000110100", j: "10000110010",
//   k: "11000010010", l: "11001010000", m: "11110111010",
//   n: "11000010100", o: "10001111010", p: "10100111100",
//   q: "10010111100", r: "10010011110", s: "10111100100",
//   t: "10011110100", u: "10011110010", v: "11110100100",
//   w: "11110010100", x: "11110010010", y: "11011011110",
//   z: "11011110110", "{": "11110110110", "|": "10101111000",
//   "}": "10100011110", "~": "10001011110",
// };

// const START_B = "11010010000";
// const STOP = "1100011101011";

// function encodeCode128B(text: string): string {
//   const clean = String(text || "")
//     .toUpperCase()
//     .replace(/[^0-9A-Z\- ]/g, "");
//   if (!clean) return START_B + STOP;

//   let pattern = START_B;
//   let checksum = 104; // Start B

//   for (let i = 0; i < clean.length; i++) {
//     const ch = clean[i];
//     const bars = CODE128_B[ch];
//     if (!bars) continue;
//     pattern += bars;
//     checksum += (ch.charCodeAt(0) - 32) * (i + 1);
//   }

//   const checkVal = checksum % 103;
//   const checkCh = String.fromCharCode(checkVal + 32);
//   pattern += CODE128_B[checkCh] || "11011001100";
//   pattern += STOP;
//   return pattern;
// }

// function drawBarcode(
//   page: any,
//   x: number,
//   y: number,
//   barHeight: number,
//   text: string,
//   moduleWidth = 1.1,
// ) {
//   const pattern = encodeCode128B(text);
//   let cx = x;
//   for (let i = 0; i < pattern.length; i++) {
//     if (pattern[i] === "1") {
//       page.drawRectangle({
//         x: cx,
//         y,
//         width: moduleWidth,
//         height: barHeight,
//         color: rgb(0, 0, 0),
//       });
//     }
//     cx += moduleWidth;
//   }
//   return cx - x;
// }

// /* ------------------------------------------------------------------ */
// /*  Helpers                                                            */
// /* ------------------------------------------------------------------ */

// function wrapText(text: string, maxChars: number): string[] {
//   if (!text) return [];
//   const words = String(text).split(/\s+/);
//   const lines: string[] = [];
//   let current = "";
//   for (const word of words) {
//     const next = (current + " " + word).trim();
//     if (next.length <= maxChars) {
//       current = next;
//     } else {
//       if (current) lines.push(current);
//       current = word;
//     }
//   }
//   if (current) lines.push(current);
//   return lines.slice(0, 7);
// }

// function formatPrintedAt(value?: string): string {
//   if (value) return value;
//   const d = new Date();
//   const pad = (n: number) => String(n).padStart(2, "0");
//   return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
// }

// function formatDateOnly(value?: string): string {
//   if (value) {
//     // try to extract DD-MM-YYYY or DD/MM/YYYY
//     const m = value.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/);
//     if (m) return `${m[1].padStart(2, "0")}-${m[2].padStart(2, "0")}-${m[3]}`;
//   }
//   const d = new Date();
//   const pad = (n: number) => String(n).padStart(2, "0");
//   return `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()}`;
// }

// /* ------------------------------------------------------------------ */
// /*  Main generator – exact table structure from sample                 */
// /* ------------------------------------------------------------------ */

// export async function generateAwbLabelPdf(
//   data: AwbLabelData,
// ): Promise<Uint8Array> {
//   const pdf = await PDFDocument.create();
//   const page = pdf.addPage([595.28, 841.89]); // A4
//   const { width, height } = page.getSize();

//   const font = await pdf.embedFont(StandardFonts.Helvetica);
//   const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

//   const margin = 14;
//   const black = rgb(0, 0, 0);
//   const gray = rgb(0.3, 0.3, 0.3);
//   const lightGray = rgb(0.94, 0.94, 0.94);

//   const drawText = (
//     text: string,
//     x: number,
//     y: number,
//     size = 8,
//     isBold = false,
//     color = black,
//   ) => {
//     const t = String(text ?? "");
//     if (!t) return;
//     page.drawText(t, {
//       x,
//       y,
//       size,
//       font: isBold ? bold : font,
//       color,
//     });
//   };

//   const drawRect = (
//     x: number,
//     y: number,
//     w: number,
//     h: number,
//     borderWidth = 0.9,
//     fill?: ReturnType<typeof rgb>,
//   ) => {
//     page.drawRectangle({
//       x,
//       y,
//       width: w,
//       height: h,
//       borderColor: black,
//       borderWidth,
//       color: fill,
//     });
//   };

//   const contentW = width - margin * 2;
//   let y = height - margin;

//   /* ================================================================
//      1. TOP HEADER BAR
//      ================================================================ */
//   const headerH = 18;
//   drawRect(margin, y - headerH, contentW, headerH, 0.7);

//   const dateStr = formatDateOnly(data.printedAt || data.bookDate);
//   const printedStr = formatPrintedAt(data.printedAt);

//   drawText(dateStr, margin + 4, y - 13, 7);
//   drawText("https://iclexpress.in/tracking/", margin + 70, y - 13, 7);
//   drawText("Shipment Label", margin + 250, y - 13, 9, true);
//   drawText(`Printed on  ${printedStr}`, margin + 380, y - 13, 7);

//   y -= headerH;

//   /* ================================================================
//      2. ACCOUNT / ORIGIN+AWB / CUSTOMER REFERENCE ROW
//      ================================================================ */
//   const row1H = 36;
//   const colAcc = 155;
//   const colOrigin = 175;
//   const colRef = contentW - colAcc - colOrigin;

//   // Account
//   drawRect(margin, y - row1H, colAcc, row1H);
//   drawText("1.  ACCOUNT NUMBER", margin + 4, y - 12, 7, true);
//   drawText(
//     (data.accountCode || "WH439").toUpperCase(),
//     margin + 4,
//     y - 28,
//     12,
//     true,
//   );

//   // Origin + AWB
//   drawRect(margin + colAcc, y - row1H, colOrigin, row1H);
//   drawText(
//     (data.origin || "GUNTUR").toUpperCase(),
//     margin + colAcc + 8,
//     y - 14,
//     11,
//     true,
//   );
//   drawText(data.awb, margin + colAcc + 8, y - 30, 11, true);

//   // Customer Reference
//   drawRect(margin + colAcc + colOrigin, y - row1H, colRef, row1H);
//   drawText(
//     "CUSTOMER REFERENCE",
//     margin + colAcc + colOrigin + 6,
//     y - 12,
//     7,
//     true,
//   );
//   drawText(
//     (data.customerReference || "SRESHTA COURIERS").toUpperCase(),
//     margin + colAcc + colOrigin + 6,
//     y - 28,
//     10,
//     true,
//   );

//   y -= row1H;

//   /* ================================================================
//      3. MAIN BODY – three columns
//         Left  = Shipper (top) + Sender Auth / POD (bottom)
//         Center = Consignee (top) + Declared Value + CSB + Barcode
//         Right  = Service / Contents (top) + Size & Weight (bottom)
//      ================================================================ */

//   const leftW = 200;
//   const midW = 195;
//   const rightW = contentW - leftW - midW;

//   // Heights
//   const shipperH = 130;          // top-left
//   const consigneeH = 130;        // top-center
//   const serviceH = 130;          // top-right

//   const senderAuthH = 210;       // bottom-left (taller)
//   const declaredH = 210;         // bottom-center
//   const sizeWeightH = 210;       // bottom-right

//   /* ---------- TOP-LEFT: SHIPPER ---------- */
//   drawRect(margin, y - shipperH, leftW, shipperH);

//   // Vertical SHIPPER letters
//   const shipperLetters = ["S", "H", "I", "P", "P", "E", "R"];
//   shipperLetters.forEach((ch, i) => {
//     drawText(ch, margin + 4, y - 16 - i * 13, 9, true);
//   });

//   drawText("1.", margin + 20, y - 14, 8, true);
//   drawText(data.shipperName || "", margin + 34, y - 14, 9, true);

//   const shipLines = wrapText(data.shipperAddress || "", 32);
//   shipLines.forEach((line, i) => {
//     drawText(line, margin + 20, y - 28 - i * 11, 8);
//   });

//   let sy = y - 28 - shipLines.length * 11;
//   if (data.shipperCity) {
//     drawText(data.shipperCity, margin + 20, sy - 2, 8);
//     sy -= 12;
//   }
//   if (data.shipperState) {
//     drawText(data.shipperState, margin + 20, sy - 2, 8);
//     sy -= 12;
//   }
//   if (data.shipperPincode) {
//     drawText(data.shipperPincode, margin + 20, sy - 2, 8);
//     sy -= 12;
//   }
//   if (data.shipperPhone) {
//     drawText(data.shipperPhone, margin + 20, sy - 2, 8);
//   }

//   /* ---------- TOP-CENTER: CONSIGNEE ---------- */
//   drawRect(margin + leftW, y - consigneeH, midW, consigneeH);

//   const consigneeLetters = ["C", "O", "N", "S", "I", "G", "N", "E", "E"];
//   consigneeLetters.forEach((ch, i) => {
//     drawText(ch, margin + leftW + 4, y - 16 - i * 12, 9, true);
//   });

//   drawText("2.", margin + leftW + 20, y - 14, 8, true);
//   drawText(data.consigneeName || "", margin + leftW + 34, y - 14, 9, true);

//   const consLines = wrapText(data.consigneeAddress || "", 30);
//   consLines.forEach((line, i) => {
//     drawText(line, margin + leftW + 20, y - 28 - i * 11, 8);
//   });

//   let cy = y - 28 - consLines.length * 11;
//   if (data.consigneeCity) {
//     drawText(data.consigneeCity, margin + leftW + 20, cy - 2, 8);
//     cy -= 12;
//   }
//   if (data.consigneeState) {
//     drawText(data.consigneeState, margin + leftW + 20, cy - 2, 8);
//     cy -= 12;
//   }
//   if (data.consigneePincode) {
//     drawText(data.consigneePincode, margin + leftW + 20, cy - 2, 8);
//     cy -= 12;
//   }
//   drawText(
//     `Country : ${data.consigneeCountry || "U.S.A."}`,
//     margin + leftW + 20,
//     cy - 2,
//     8,
//   );
//   cy -= 12;
//   if (data.consigneePhone) {
//     drawText(data.consigneePhone, margin + leftW + 20, cy - 2, 8);
//   }

//   /* ---------- TOP-RIGHT: SERVICE TYPE / CONTENTS ---------- */
//   drawRect(margin + leftW + midW, y - serviceH, rightW, serviceH);

//   // Service type header
//   drawRect(
//     margin + leftW + midW,
//     y - 18,
//     rightW,
//     18,
//     0.7,
//     lightGray,
//   );
//   drawText(
//     "SERVICE TYPE",
//     margin + leftW + midW + 6,
//     y - 13,
//     7,
//     true,
//   );

//   // SPX + International Priority
//   drawRect(margin + leftW + midW, y - 40, rightW, 22);
//   drawText(
//     (data.serviceType || "SPX  INTERNATIONAL PRIORITY").toUpperCase(),
//     margin + leftW + midW + 6,
//     y - 33,
//     8,
//     true,
//   );

//   // Vendor / carrier
//   drawText(
//     (data.vendor || "FEDERAL EXPRESS CORPORATION").toUpperCase(),
//     margin + leftW + midW + 6,
//     y - 55,
//     8,
//   );

//   // Contents
//   drawText(
//     "FULL DESCRIPTION OF CONTENTS :-",
//     margin + leftW + midW + 6,
//     y - 75,
//     7,
//     true,
//   );
//   const contentLines = wrapText(data.content || "USED CLOTHES", 28);
//   contentLines.forEach((line, i) => {
//     drawText(line, margin + leftW + midW + 6, y - 90 - i * 11, 8);
//   });

//   // Special instructions
//   drawText(
//     "SPECIAL INSTRUCTIONS :-",
//     margin + leftW + midW + 6,
//     y - 118,
//     7,
//     true,
//   );
//   const instrLines = wrapText(data.specialInstructions || "", 28);
//   instrLines.forEach((line, i) => {
//     drawText(line, margin + leftW + midW + 6, y - 132 - i * 11, 8);
//   });

//   /* ---------- Move Y to bottom section ---------- */
//   y -= Math.max(shipperH, consigneeH, serviceH);

//   /* ---------- BOTTOM-LEFT: SENDER'S AUTHORISATION + ICL + POD ---------- */
//   drawRect(margin, y - senderAuthH, leftW, senderAuthH);

//   drawText(
//     "3.  SENDER'S AUTHORISATION AND SIGNATURE",
//     margin + 4,
//     y - 14,
//     7,
//     true,
//   );

//   // ICL logo block
//   drawRect(margin + 18, y - 78, 130, 52, 1.3);
//   drawText("ICL", margin + 42, y - 42, 26, true);
//   drawText("®", margin + 108, y - 38, 11);
//   drawText(
//     "Integrated Couriers & Logistics",
//     margin + 22,
//     y - 62,
//     6,
//   );

//   drawText("SENDER'S SIGNATURE", margin + 8, y - 96, 8);
//   page.drawLine({
//     start: { x: margin + 8, y: y - 110 },
//     end: { x: margin + leftW - 10, y: y - 110 },
//     thickness: 0.8,
//   });

//   drawText("DATE", margin + 8, y - 128, 8);

//   drawText("PROOF OF DELIVERY (POD)", margin + 8, y - 150, 10, true);
//   drawText("RECEIVER'S SIGNATURE", margin + 8, y - 168, 8);
//   page.drawLine({
//     start: { x: margin + 8, y: y - 182 },
//     end: { x: margin + leftW - 10, y: y - 182 },
//     thickness: 0.8,
//   });

//   drawText("DATE    /     /", margin + 8, y - 198, 7);
//   drawText("TIME     AM/PM", margin + 100, y - 198, 7);
//   drawText(
//     "(CAPITAL LETTERS VERY IMPORTANT)",
//     margin + 8,
//     y - 212,
//     6,
//   );

//   /* ---------- BOTTOM-CENTER: DECLARED VALUE + CSB4 + BARCODE ---------- */
//   drawRect(margin + leftW, y - declaredH, midW, declaredH);

//   // Declared value header
//   drawRect(
//     margin + leftW,
//     y - 48,
//     midW,
//     48,
//     0.9,
//   );
//   drawText(
//     "DECLARED VALUE FOR",
//     margin + leftW + 12,
//     y - 16,
//     8,
//     true,
//   );
//   drawText(
//     "CUSTOMS AND CURRENCY",
//     margin + leftW + 12,
//     y - 28,
//     8,
//     true,
//   );
//   drawText(
//     `${data.declaredValue ?? 0} ${data.currency || "INR"}`,
//     margin + leftW + 50,
//     y - 44,
//     14,
//     true,
//   );

//   // CSB4 box
//   drawRect(margin + leftW + 30, y - 100, 130, 40, 1.8);
//   drawText(
//     (data.csbType || "CSB4").toUpperCase(),
//     margin + leftW + 60,
//     y - 82,
//     18,
//     true,
//   );

//   // Barcode
//   const barcodeX = margin + leftW + 18;
//   const barcodeY = y - 160;
//   const barcodeH = 36;
//   drawBarcode(page, barcodeX, barcodeY, barcodeH, data.awb, 1.05);

//   // Human readable AWB under barcode
//   const awbText = data.awb;
//   const awbWidth = bold.widthOfTextAtSize(awbText, 11);
//   drawText(
//     awbText,
//     margin + leftW + (midW - awbWidth) / 2,
//     y - 178,
//     11,
//     true,
//   );

//   /* ---------- BOTTOM-RIGHT: SIZE & WEIGHT ---------- */
//   drawRect(margin + leftW + midW, y - sizeWeightH, rightW, sizeWeightH);

//   drawRect(
//     margin + leftW + midW,
//     y - 18,
//     rightW,
//     18,
//     0.7,
//     lightGray,
//   );
//   drawText(
//     "SIZE & WEIGHT",
//     margin + leftW + midW + 8,
//     y - 13,
//     8,
//     true,
//   );

//   drawText(
//     `Pieces :   ${data.pieces ?? 1}`,
//     margin + leftW + midW + 8,
//     y - 42,
//     11,
//   );

//   drawText(
//     `Weight   ${(data.actualWeight ?? 0).toFixed(3)}   Kgs`,
//     margin + leftW + midW + 8,
//     y - 66,
//     11,
//   );

//   // Dimensions line
//   drawRect(margin + leftW + midW, y - 100, rightW, 28);
//   drawText(
//     data.dimensions || "",
//     margin + leftW + midW + 8,
//     y - 88,
//     10,
//   );

//   // Charged weight
//   drawRect(margin + leftW + midW, y - 140, rightW, 32);
//   drawText(
//     "CHARGED WEIGHT",
//     margin + leftW + midW + 8,
//     y - 122,
//     9,
//     true,
//   );
//   drawText(
//     `${(data.chargeableWeight ?? 0).toFixed(2)}`,
//     margin + leftW + midW + 8,
//     y - 138,
//     14,
//     true,
//   );

//   /* ---------- FOOTER ---------- */
//   drawText(
//     "Sreshta Logistics  •  System Generated Label  •  ICL Network",
//     margin,
//     12,
//     7,
//     false,
//     gray,
//   );

//   return pdf.save();
// }

// import "server-only";

// import {
//   PDFDocument,
//   StandardFonts,
//   rgb,
// } from "pdf-lib";

// export type AwbLabelData = {
//   awb: string;
//   accountCode?: string;
//   bookDate?: string;
//   printedAt?: string;

//   shipperName: string;
//   shipperAddress: string;
//   shipperCity?: string;
//   shipperState?: string;
//   shipperPincode?: string;
//   shipperPhone?: string;
//   shipperCountry?: string;

//   consigneeName: string;
//   consigneeAddress: string;
//   consigneeCity?: string;
//   consigneeState?: string;
//   consigneePincode?: string;
//   consigneePhone?: string;
//   consigneeCountry?: string;

//   serviceType?: string;
//   product?: string;
//   vendor?: string;
//   customerReference?: string;

//   pieces: number;
//   actualWeight: number;
//   chargeableWeight: number;
//   dimensions?: string;

//   declaredValue?: number;
//   currency?: string;
//   content?: string;
//   csbType?: string;
//   specialInstructions?: string;
//   origin?: string;
// };

// /* ------------------------------------------------------------------ */
// /*  Code-128 Subset B – corrected & scannable                         */
// /* ------------------------------------------------------------------ */

// // Patterns for Code Set B (value 0–102)
// // Index = character value (space = 0 … DEL-ish)
// const CODE128_PATTERNS: string[] = [
//   "11011001100", "11001101100", "11001100110", "10010011000", // 0-3
//   "10010001100", "10001001100", "10011001000", "10011000100", // 4-7
//   "10001100100", "11001001000", "11001000100", "11000100100", // 8-11
//   "10110011100", "10011011100", "10011001110", "10111001100", // 12-15
//   "10011101100", "10011100110", "11001110010", "11001011100", // 16-19
//   "11001001110", "11011100100", "11001110100", "11101101110", // 20-23
//   "11101001100", "11100101100", "11100100110", "11101100100", // 24-27
//   "11100110100", "11100110010", "11011011000", "11011000110", // 28-31
//   "11000110110", "10100011000", "10001011000", "10001000110", // 32-35
//   "10110001000", "10001101000", "10001100010", "11010001000", // 36-39
//   "11000101000", "11000100010", "10110111000", "10110001110", // 40-43
//   "10001101110", "10111011000", "10111000110", "10001110110", // 44-47
//   "11101110110", "11010001110", "11000101110", "11011101000", // 48-51
//   "11011100010", "11011101110", "11101011000", "11101000110", // 52-55
//   "11100010110", "11101101000", "11101100010", "11100011010", // 56-59
//   "11101111010", "11001000010", "11110001010", "10100110000", // 60-63
//   "10100001100", "10010110000", "10010000110", "10000101100", // 64-67
//   "10000100110", "10110010000", "10110000100", "10011010000", // 68-71
//   "10011000010", "10000110100", "10000110010", "11000010010", // 72-75
//   "11001010000", "11110111010", "11000010100", "10001111010", // 76-79
//   "10100111100", "10010111100", "10010011110", "10111100100", // 80-83
//   "10011110100", "10011110010", "11110100100", "11110010100", // 84-87
//   "11110010010", "11011011110", "11011110110", "11110110110", // 88-91
//   "10101111000", "10100011110", "10001011110", "10111101000", // 92-95
//   "10111100010", "11110101000", "11110100010", "10111011110", // 96-99
//   "10111101110", "11101011110", "11101011010",                // 100-102
// ];

// const START_B = 104; // Start Code B value
// const STOP_PATTERN = "1100011101011";

// function getPattern(value: number): string {
//   if (value >= 0 && value < CODE128_PATTERNS.length) {
//     return CODE128_PATTERNS[value];
//   }
//   // Fallback for Start B (104) and other high values – use known Start B pattern
//   if (value === 104) return "11010010000"; // Start B
//   if (value === 105) return "11010011100"; // Start C (unused)
//   if (value === 106) return "11000111010"; // Stop (without final bar)
//   return "11011001100";
// }

// /**
//  * Encode text as Code-128 Subset B.
//  * Returns full binary pattern: Start B + data + checksum + Stop.
//  */
// function encodeCode128B(text: string): string {
//   // Keep only printable ASCII that exists in Code Set B (32–126)
//   const clean = String(text || "")
//     .split("")
//     .filter((ch) => {
//       const code = ch.charCodeAt(0);
//       return code >= 32 && code <= 126;
//     })
//     .join("");

//   if (!clean) {
//     return getPattern(START_B) + STOP_PATTERN;
//   }

//   const values: number[] = [START_B];

//   for (let i = 0; i < clean.length; i++) {
//     // Code Set B value = ASCII code − 32
//     values.push(clean.charCodeAt(i) - 32);
//   }

//   // Checksum = (Start + Σ value_i × position_i) mod 103
//   // position starts at 1 for the first data character
//   let checksum = values[0];
//   for (let i = 1; i < values.length; i++) {
//     checksum += values[i] * i;
//   }
//   checksum = checksum % 103;
//   values.push(checksum);

//   let pattern = "";
//   for (const v of values) {
//     pattern += getPattern(v);
//   }
//   pattern += STOP_PATTERN;

//   return pattern;
// }

// /**
//  * Draw a scannable Code-128 barcode.
//  * Includes quiet zones on both sides (required by scanners).
//  */
// function drawBarcode(
//   page: any,
//   x: number,
//   y: number,
//   barHeight: number,
//   text: string,
//   moduleWidth = 1.35,
// ) {
//   const pattern = encodeCode128B(text);

//   // Quiet zone (white space) – scanners need this
//   const quietZone = moduleWidth * 10;
//   let cx = x + quietZone;

//   for (let i = 0; i < pattern.length; i++) {
//     if (pattern[i] === "1") {
//       page.drawRectangle({
//         x: cx,
//         y,
//         width: moduleWidth,
//         height: barHeight,
//         color: rgb(0, 0, 0),
//       });
//     }
//     cx += moduleWidth;
//   }

//   // Right quiet zone
//   return cx + quietZone - x;
// }

// /* ------------------------------------------------------------------ */
// /*  Helpers                                                            */
// /* ------------------------------------------------------------------ */

// function wrapText(text: string, maxChars: number): string[] {
//   if (!text) return [];
//   const words = String(text).split(/\s+/);
//   const lines: string[] = [];
//   let current = "";
//   for (const word of words) {
//     const next = (current + " " + word).trim();
//     if (next.length <= maxChars) {
//       current = next;
//     } else {
//       if (current) lines.push(current);
//       current = word;
//     }
//   }
//   if (current) lines.push(current);
//   return lines.slice(0, 7);
// }

// function formatPrintedAt(value?: string): string {
//   if (value) return value;
//   const d = new Date();
//   const pad = (n: number) => String(n).padStart(2, "0");
//   return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
// }

// function formatDateOnly(value?: string): string {
//   if (value) {
//     const m = value.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/);
//     if (m) {
//       return `${m[1].padStart(2, "0")}-${m[2].padStart(2, "0")}-${m[3]}`;
//     }
//   }
//   const d = new Date();
//   const pad = (n: number) => String(n).padStart(2, "0");
//   return `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()}`;
// }

// /* ------------------------------------------------------------------ */
// /*  Main generator – exact table structure from sample                 */
// /* ------------------------------------------------------------------ */

// export async function generateAwbLabelPdf(
//   data: AwbLabelData,
// ): Promise<Uint8Array> {
//   const pdf = await PDFDocument.create();
//   const page = pdf.addPage([595.28, 841.89]); // A4
//   const { width, height } = page.getSize();

//   const font = await pdf.embedFont(StandardFonts.Helvetica);
//   const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

//   const margin = 14;
//   const black = rgb(0, 0, 0);
//   const gray = rgb(0.3, 0.3, 0.3);
//   const lightGray = rgb(0.94, 0.94, 0.94);

//   const drawText = (
//     text: string,
//     x: number,
//     y: number,
//     size = 8,
//     isBold = false,
//     color = black,
//   ) => {
//     const t = String(text ?? "");
//     if (!t) return;
//     page.drawText(t, {
//       x,
//       y,
//       size,
//       font: isBold ? bold : font,
//       color,
//     });
//   };

//   const drawRect = (
//     x: number,
//     y: number,
//     w: number,
//     h: number,
//     borderWidth = 0.9,
//     fill?: ReturnType<typeof rgb>,
//   ) => {
//     page.drawRectangle({
//       x,
//       y,
//       width: w,
//       height: h,
//       borderColor: black,
//       borderWidth,
//       color: fill,
//     });
//   };

//   const contentW = width - margin * 2;
//   let y = height - margin;

//   /* ================================================================
//      1. TOP HEADER BAR
//      ================================================================ */
//   const headerH = 18;
//   drawRect(margin, y - headerH, contentW, headerH, 0.7);

//   const dateStr = formatDateOnly(data.printedAt || data.bookDate);
//   const printedStr = formatPrintedAt(data.printedAt);

//   drawText(dateStr, margin + 4, y - 13, 7);
//   drawText("https://iclexpress.in/tracking/", margin + 70, y - 13, 7);
//   drawText("Shipment Label", margin + 250, y - 13, 9, true);
//   drawText(`Printed on  ${printedStr}`, margin + 380, y - 13, 7);

//   y -= headerH;

//   /* ================================================================
//      2. ACCOUNT / ORIGIN+AWB / CUSTOMER REFERENCE ROW
//      ================================================================ */
//   const row1H = 36;
//   const colAcc = 155;
//   const colOrigin = 175;
//   const colRef = contentW - colAcc - colOrigin;

//   // Account
//   drawRect(margin, y - row1H, colAcc, row1H);
//   drawText("1.  ACCOUNT NUMBER", margin + 4, y - 12, 7, true);
//   drawText(
//     (data.accountCode || "WH439").toUpperCase(),
//     margin + 4,
//     y - 28,
//     12,
//     true,
//   );

//   // Origin + AWB
//   drawRect(margin + colAcc, y - row1H, colOrigin, row1H);
//   drawText(
//     (data.origin || "GUNTUR").toUpperCase(),
//     margin + colAcc + 8,
//     y - 14,
//     11,
//     true,
//   );
//   drawText(data.awb, margin + colAcc + 8, y - 30, 11, true);

//   // Customer Reference
//   drawRect(margin + colAcc + colOrigin, y - row1H, colRef, row1H);
//   drawText(
//     "CUSTOMER REFERENCE",
//     margin + colAcc + colOrigin + 6,
//     y - 12,
//     7,
//     true,
//   );
//   drawText(
//     (data.customerReference || "SRESHTA COURIERS").toUpperCase(),
//     margin + colAcc + colOrigin + 6,
//     y - 28,
//     10,
//     true,
//   );

//   y -= row1H;

//   /* ================================================================
//      3. MAIN BODY – three columns
//      ================================================================ */

//   const leftW = 200;
//   const midW = 195;
//   const rightW = contentW - leftW - midW;

//   const shipperH = 130;
//   const consigneeH = 130;
//   const serviceH = 130;

//   const senderAuthH = 210;
//   const declaredH = 210;
//   const sizeWeightH = 210;

//   /* ---------- TOP-LEFT: SHIPPER ---------- */
//   drawRect(margin, y - shipperH, leftW, shipperH);

//   const shipperLetters = ["S", "H", "I", "P", "P", "E", "R"];
//   shipperLetters.forEach((ch, i) => {
//     drawText(ch, margin + 4, y - 16 - i * 13, 9, true);
//   });

//   drawText("1.", margin + 20, y - 14, 8, true);
//   drawText(data.shipperName || "", margin + 34, y - 14, 9, true);

//   const shipLines = wrapText(data.shipperAddress || "", 32);
//   shipLines.forEach((line, i) => {
//     drawText(line, margin + 20, y - 28 - i * 11, 8);
//   });

//   let sy = y - 28 - shipLines.length * 11;
//   if (data.shipperCity) {
//     drawText(data.shipperCity, margin + 20, sy - 2, 8);
//     sy -= 12;
//   }
//   if (data.shipperState) {
//     drawText(data.shipperState, margin + 20, sy - 2, 8);
//     sy -= 12;
//   }
//   if (data.shipperPincode) {
//     drawText(data.shipperPincode, margin + 20, sy - 2, 8);
//     sy -= 12;
//   }
//   if (data.shipperPhone) {
//     drawText(data.shipperPhone, margin + 20, sy - 2, 8);
//   }

//   /* ---------- TOP-CENTER: CONSIGNEE ---------- */
//   drawRect(margin + leftW, y - consigneeH, midW, consigneeH);

//   const consigneeLetters = ["C", "O", "N", "S", "I", "G", "N", "E", "E"];
//   consigneeLetters.forEach((ch, i) => {
//     drawText(ch, margin + leftW + 4, y - 16 - i * 12, 9, true);
//   });

//   drawText("2.", margin + leftW + 20, y - 14, 8, true);
//   drawText(data.consigneeName || "", margin + leftW + 34, y - 14, 9, true);

//   const consLines = wrapText(data.consigneeAddress || "", 30);
//   consLines.forEach((line, i) => {
//     drawText(line, margin + leftW + 20, y - 28 - i * 11, 8);
//   });

//   let cy = y - 28 - consLines.length * 11;
//   if (data.consigneeCity) {
//     drawText(data.consigneeCity, margin + leftW + 20, cy - 2, 8);
//     cy -= 12;
//   }
//   if (data.consigneeState) {
//     drawText(data.consigneeState, margin + leftW + 20, cy - 2, 8);
//     cy -= 12;
//   }
//   if (data.consigneePincode) {
//     drawText(data.consigneePincode, margin + leftW + 20, cy - 2, 8);
//     cy -= 12;
//   }
//   drawText(
//     `Country : ${data.consigneeCountry || "U.S.A."}`,
//     margin + leftW + 20,
//     cy - 2,
//     8,
//   );
//   cy -= 12;
//   if (data.consigneePhone) {
//     drawText(data.consigneePhone, margin + leftW + 20, cy - 2, 8);
//   }

//   /* ---------- TOP-RIGHT: SERVICE TYPE / CONTENTS ---------- */
//   drawRect(margin + leftW + midW, y - serviceH, rightW, serviceH);

//   drawRect(
//     margin + leftW + midW,
//     y - 18,
//     rightW,
//     18,
//     0.7,
//     lightGray,
//   );
//   drawText(
//     "SERVICE TYPE",
//     margin + leftW + midW + 6,
//     y - 13,
//     7,
//     true,
//   );

//   drawRect(margin + leftW + midW, y - 40, rightW, 22);
//   drawText(
//     (data.serviceType || "SPX  INTERNATIONAL PRIORITY").toUpperCase(),
//     margin + leftW + midW + 6,
//     y - 33,
//     8,
//     true,
//   );

//   drawText(
//     (data.vendor || "FEDERAL EXPRESS CORPORATION").toUpperCase(),
//     margin + leftW + midW + 6,
//     y - 55,
//     8,
//   );

//   drawText(
//     "FULL DESCRIPTION OF CONTENTS :-",
//     margin + leftW + midW + 6,
//     y - 75,
//     7,
//     true,
//   );
//   const contentLines = wrapText(data.content || "USED CLOTHES", 28);
//   contentLines.forEach((line, i) => {
//     drawText(line, margin + leftW + midW + 6, y - 90 - i * 11, 8);
//   });

//   drawText(
//     "SPECIAL INSTRUCTIONS :-",
//     margin + leftW + midW + 6,
//     y - 118,
//     7,
//     true,
//   );
//   const instrLines = wrapText(data.specialInstructions || "", 28);
//   instrLines.forEach((line, i) => {
//     drawText(line, margin + leftW + midW + 6, y - 132 - i * 11, 8);
//   });

//   /* ---------- Move Y to bottom section ---------- */
//   y -= Math.max(shipperH, consigneeH, serviceH);

//   /* ---------- BOTTOM-LEFT: SENDER'S AUTHORISATION + ICL + POD ---------- */
//   drawRect(margin, y - senderAuthH, leftW, senderAuthH);

//   drawText(
//     "3.  SENDER'S AUTHORISATION AND SIGNATURE",
//     margin + 4,
//     y - 14,
//     7,
//     true,
//   );

//   // ICL logo block
//   drawRect(margin + 18, y - 78, 130, 52, 1.3);
//   drawText("ICL", margin + 42, y - 42, 26, true);
//   drawText("®", margin + 108, y - 38, 11);
//   drawText(
//     "Integrated Couriers & Logistics",
//     margin + 22,
//     y - 62,
//     6,
//   );

//   drawText("SENDER'S SIGNATURE", margin + 8, y - 96, 8);
//   page.drawLine({
//     start: { x: margin + 8, y: y - 110 },
//     end: { x: margin + leftW - 10, y: y - 110 },
//     thickness: 0.8,
//   });

//   drawText("DATE", margin + 8, y - 128, 8);

//   drawText("PROOF OF DELIVERY (POD)", margin + 8, y - 150, 10, true);
//   drawText("RECEIVER'S SIGNATURE", margin + 8, y - 168, 8);
//   page.drawLine({
//     start: { x: margin + 8, y: y - 182 },
//     end: { x: margin + leftW - 10, y: y - 182 },
//     thickness: 0.8,
//   });

//   drawText("DATE    /     /", margin + 8, y - 198, 7);
//   drawText("TIME     AM/PM", margin + 100, y - 198, 7);
//   drawText(
//     "(CAPITAL LETTERS VERY IMPORTANT)",
//     margin + 8,
//     y - 212,
//     6,
//   );

//   /* ---------- BOTTOM-CENTER: DECLARED VALUE + CSB4 + BARCODE ---------- */
//   drawRect(margin + leftW, y - declaredH, midW, declaredH);

//   // Declared value
//   drawRect(margin + leftW, y - 48, midW, 48, 0.9);
//   drawText(
//     "DECLARED VALUE FOR",
//     margin + leftW + 12,
//     y - 16,
//     8,
//     true,
//   );
//   drawText(
//     "CUSTOMS AND CURRENCY",
//     margin + leftW + 12,
//     y - 28,
//     8,
//     true,
//   );
//   drawText(
//     `${data.declaredValue ?? 0} ${data.currency || "INR"}`,
//     margin + leftW + 50,
//     y - 44,
//     14,
//     true,
//   );

//   // CSB4 box
//   drawRect(margin + leftW + 30, y - 100, 130, 40, 1.8);
//   drawText(
//     (data.csbType || "CSB4").toUpperCase(),
//     margin + leftW + 60,
//     y - 82,
//     18,
//     true,
//   );

//   // Scannable Code-128 barcode of the AWB number
//   const barcodeX = margin + leftW + 8;
//   const barcodeY = y - 168;
//   const barcodeH = 42;
//   drawBarcode(page, barcodeX, barcodeY, barcodeH, data.awb, 1.35);

//   // Human-readable AWB under barcode
//   const awbText = data.awb;
//   const awbWidth = bold.widthOfTextAtSize(awbText, 11);
//   drawText(
//     awbText,
//     margin + leftW + (midW - awbWidth) / 2,
//     y - 186,
//     11,
//     true,
//   );

//   /* ---------- BOTTOM-RIGHT: SIZE & WEIGHT ---------- */
//   drawRect(margin + leftW + midW, y - sizeWeightH, rightW, sizeWeightH);

//   drawRect(
//     margin + leftW + midW,
//     y - 18,
//     rightW,
//     18,
//     0.7,
//     lightGray,
//   );
//   drawText(
//     "SIZE & WEIGHT",
//     margin + leftW + midW + 8,
//     y - 13,
//     8,
//     true,
//   );

//   drawText(
//     `Pieces :   ${data.pieces ?? 1}`,
//     margin + leftW + midW + 8,
//     y - 42,
//     11,
//   );

//   drawText(
//     `Weight   ${(data.actualWeight ?? 0).toFixed(3)}   Kgs`,
//     margin + leftW + midW + 8,
//     y - 66,
//     11,
//   );

//   drawRect(margin + leftW + midW, y - 100, rightW, 28);
//   drawText(
//     data.dimensions || "",
//     margin + leftW + midW + 8,
//     y - 88,
//     10,
//   );

//   drawRect(margin + leftW + midW, y - 140, rightW, 32);
//   drawText(
//     "CHARGED WEIGHT",
//     margin + leftW + midW + 8,
//     y - 122,
//     9,
//     true,
//   );
//   drawText(
//     `${(data.chargeableWeight ?? 0).toFixed(2)}`,
//     margin + leftW + midW + 8,
//     y - 138,
//     14,
//     true,
//   );

//   /* ---------- FOOTER ---------- */
//   drawText(
//     "Sreshta Logistics  •  System Generated Label  •  ICL Network",
//     margin,
//     12,
//     7,
//     false,
//     gray,
//   );

//   return pdf.save();
// }

// import "server-only";

// import {
//   PDFDocument,
//   StandardFonts,
//   rgb,
// } from "pdf-lib";

// export type AwbLabelData = {
//   awb: string;
//   accountCode?: string;
//   bookDate?: string;
//   printedAt?: string;

//   shipperName: string;
//   shipperAddress: string;
//   shipperCity?: string;
//   shipperState?: string;
//   shipperPincode?: string;
//   shipperPhone?: string;
//   shipperCountry?: string;

//   consigneeName: string;
//   consigneeAddress: string;
//   consigneeCity?: string;
//   consigneeState?: string;
//   consigneePincode?: string;
//   consigneePhone?: string;
//   consigneeCountry?: string;

//   serviceType?: string;
//   product?: string;
//   vendor?: string;
//   customerReference?: string;

//   pieces: number;
//   actualWeight: number;
//   chargeableWeight: number;
//   dimensions?: string;

//   declaredValue?: number;
//   currency?: string;
//   content?: string;
//   csbType?: string;
//   specialInstructions?: string;
//   origin?: string;
// };

// /* ------------------------------------------------------------------ */
// /*  Code-128 Subset B                                                 */
// /* ------------------------------------------------------------------ */

// const CODE128_PATTERNS: string[] = [
//   "11011001100", "11001101100", "11001100110", "10010011000",
//   "10010001100", "10001001100", "10011001000", "10011000100",
//   "10001100100", "11001001000", "11001000100", "11000100100",
//   "10110011100", "10011011100", "10011001110", "10111001100",
//   "10011101100", "10011100110", "11001110010", "11001011100",
//   "11001001110", "11011100100", "11001110100", "11101101110",
//   "11101001100", "11100101100", "11100100110", "11101100100",
//   "11100110100", "11100110010", "11011011000", "11011000110",
//   "11000110110", "10100011000", "10001011000", "10001000110",
//   "10110001000", "10001101000", "10001100010", "11010001000",
//   "11000101000", "11000100010", "10110111000", "10110001110",
//   "10001101110", "10111011000", "10111000110", "10001110110",
//   "11101110110", "11010001110", "11000101110", "11011101000",
//   "11011100010", "11011101110", "11101011000", "11101000110",
//   "11100010110", "11101101000", "11101100010", "11100011010",
//   "11101111010", "11001000010", "11110001010", "10100110000",
//   "10100001100", "10010110000", "10010000110", "10000101100",
//   "10000100110", "10110010000", "10110000100", "10011010000",
//   "10011000010", "10000110100", "10000110010", "11000010010",
//   "11001010000", "11110111010", "11000010100", "10001111010",
//   "10100111100", "10010111100", "10010011110", "10111100100",
//   "10011110100", "10011110010", "11110100100", "11110010100",
//   "11110010010", "11011011110", "11011110110", "11110110110",
//   "10101111000", "10100011110", "10001011110", "10111101000",
//   "10111100010", "11110101000", "11110100010", "10111011110",
//   "10111101110", "11101011110", "11101011010",
// ];

// const START_B = 104;
// const STOP_PATTERN = "1100011101011";

// function getPattern(value: number): string {
//   if (value >= 0 && value < CODE128_PATTERNS.length) {
//     return CODE128_PATTERNS[value];
//   }
//   if (value === 104) return "11010010000";
//   if (value === 105) return "11010011100";
//   if (value === 106) return "11000111010";
//   return "11011001100";
// }

// function encodeCode128B(text: string): string {
//   const clean = String(text || "")
//     .split("")
//     .filter((ch) => {
//       const code = ch.charCodeAt(0);
//       return code >= 32 && code <= 126;
//     })
//     .join("");

//   if (!clean) {
//     return getPattern(START_B) + STOP_PATTERN;
//   }

//   const values: number[] = [START_B];
//   for (let i = 0; i < clean.length; i++) {
//     values.push(clean.charCodeAt(i) - 32);
//   }

//   let checksum = values[0];
//   for (let i = 1; i < values.length; i++) {
//     checksum += values[i] * i;
//   }
//   checksum = checksum % 103;
//   values.push(checksum);

//   let pattern = "";
//   for (const v of values) {
//     pattern += getPattern(v);
//   }
//   pattern += STOP_PATTERN;
//   return pattern;
// }

// function drawBarcode(
//   page: any,
//   x: number,
//   y: number,
//   barHeight: number,
//   text: string,
//   moduleWidth = 1.35,
// ) {
//   const pattern = encodeCode128B(text);
//   const quietZone = moduleWidth * 10;
//   let cx = x + quietZone;

//   for (let i = 0; i < pattern.length; i++) {
//     if (pattern[i] === "1") {
//       page.drawRectangle({
//         x: cx,
//         y,
//         width: moduleWidth,
//         height: barHeight,
//         color: rgb(0, 0, 0),
//       });
//     }
//     cx += moduleWidth;
//   }
//   return cx + quietZone - x;
// }

// function wrapText(text: string, maxChars: number): string[] {
//   if (!text) return [];
//   const words = String(text).split(/\s+/);
//   const lines: string[] = [];
//   let current = "";
//   for (const word of words) {
//     const next = (current + " " + word).trim();
//     if (next.length <= maxChars) {
//       current = next;
//     } else {
//       if (current) lines.push(current);
//       current = word;
//     }
//   }
//   if (current) lines.push(current);
//   return lines.slice(0, 7);
// }

// function formatPrintedAt(value?: string): string {
//   if (value) return value;
//   const d = new Date();
//   const pad = (n: number) => String(n).padStart(2, "0");
//   return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
// }

// function formatDateOnly(value?: string): string {
//   if (value) {
//     const m = value.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/);
//     if (m) {
//       return `${m[1].padStart(2, "0")}-${m[2].padStart(2, "0")}-${m[3]}`;
//     }
//   }
//   const d = new Date();
//   const pad = (n: number) => String(n).padStart(2, "0");
//   return `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()}`;
// }

// export async function generateAwbLabelPdf(
//   data: AwbLabelData,
// ): Promise<Uint8Array> {
//   const pdf = await PDFDocument.create();
//   const page = pdf.addPage([595.28, 841.89]);
//   const { width, height } = page.getSize();

//   const font = await pdf.embedFont(StandardFonts.Helvetica);
//   const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

//   const margin = 14;
//   const black = rgb(0, 0, 0);
//   const gray = rgb(0.3, 0.3, 0.3);
//   const lightGray = rgb(0.94, 0.94, 0.94);

//   // Safe numeric values (never print blank / NaN)
//   const pieces = Number(data.pieces) > 0 ? Number(data.pieces) : 1;
//   const actualW = Number(data.actualWeight) || 0;
//   const chargeW = Math.max(Number(data.chargeableWeight) || 0, actualW);
//   const declared = Number(data.declaredValue) || 0;
//   const currency = data.currency || "INR";
//   const contentText =
//     data.content || "UNSOLICITED GIFT - NOT FOR SALE";
//   const csb = (data.csbType || "CSB4").toUpperCase();

//   const drawText = (
//     text: string,
//     x: number,
//     y: number,
//     size = 8,
//     isBold = false,
//     color = black,
//   ) => {
//     const t = String(text ?? "");
//     if (!t) return;
//     page.drawText(t, {
//       x,
//       y,
//       size,
//       font: isBold ? bold : font,
//       color,
//     });
//   };

//   const drawRect = (
//     x: number,
//     y: number,
//     w: number,
//     h: number,
//     borderWidth = 0.9,
//     fill?: ReturnType<typeof rgb>,
//   ) => {
//     page.drawRectangle({
//       x,
//       y,
//       width: w,
//       height: h,
//       borderColor: black,
//       borderWidth,
//       color: fill,
//     });
//   };

//   const contentW = width - margin * 2;
//   let y = height - margin;

//   /* ---- Header ---- */
//   const headerH = 18;
//   drawRect(margin, y - headerH, contentW, headerH, 0.7);
//   const dateStr = formatDateOnly(data.printedAt || data.bookDate);
//   const printedStr = formatPrintedAt(data.printedAt);
//   drawText(dateStr, margin + 4, y - 13, 7);
//   drawText("https://iclexpress.in/tracking/", margin + 70, y - 13, 7);
//   drawText("Shipment Label", margin + 250, y - 13, 9, true);
//   drawText(`Printed on  ${printedStr}`, margin + 380, y - 13, 7);
//   y -= headerH;

//   /* ---- Account / Origin / Ref ---- */
//   const row1H = 36;
//   const colAcc = 155;
//   const colOrigin = 175;
//   const colRef = contentW - colAcc - colOrigin;

//   drawRect(margin, y - row1H, colAcc, row1H);
//   drawText("1.  ACCOUNT NUMBER", margin + 4, y - 12, 7, true);
//   drawText(
//     (data.accountCode || "WH439").toUpperCase(),
//     margin + 4,
//     y - 28,
//     12,
//     true,
//   );

//   drawRect(margin + colAcc, y - row1H, colOrigin, row1H);
//   drawText(
//     (data.origin || "GUNTUR").toUpperCase(),
//     margin + colAcc + 8,
//     y - 14,
//     11,
//     true,
//   );
//   drawText(data.awb, margin + colAcc + 8, y - 30, 11, true);

//   drawRect(margin + colAcc + colOrigin, y - row1H, colRef, row1H);
//   drawText(
//     "CUSTOMER REFERENCE",
//     margin + colAcc + colOrigin + 6,
//     y - 12,
//     7,
//     true,
//   );
//   drawText(
//     (data.customerReference || "SRESHTA COURIERS").toUpperCase(),
//     margin + colAcc + colOrigin + 6,
//     y - 28,
//     10,
//     true,
//   );
//   y -= row1H;

//   /* ---- Three columns top ---- */
//   const leftW = 200;
//   const midW = 195;
//   const rightW = contentW - leftW - midW;
//   const shipperH = 130;
//   const senderAuthH = 210;
//   const declaredH = 210;
//   const sizeWeightH = 210;

//   // SHIPPER
//   drawRect(margin, y - shipperH, leftW, shipperH);
//   ["S", "H", "I", "P", "P", "E", "R"].forEach((ch, i) => {
//     drawText(ch, margin + 4, y - 16 - i * 13, 9, true);
//   });
//   drawText("1.", margin + 20, y - 14, 8, true);
//   drawText(data.shipperName || "", margin + 34, y - 14, 9, true);
//   const shipLines = wrapText(data.shipperAddress || "", 32);
//   shipLines.forEach((line, i) => {
//     drawText(line, margin + 20, y - 28 - i * 11, 8);
//   });
//   let sy = y - 28 - shipLines.length * 11;
//   if (data.shipperCity) {
//     drawText(data.shipperCity, margin + 20, sy - 2, 8);
//     sy -= 12;
//   }
//   if (data.shipperState) {
//     drawText(data.shipperState, margin + 20, sy - 2, 8);
//     sy -= 12;
//   }
//   if (data.shipperPincode) {
//     drawText(data.shipperPincode, margin + 20, sy - 2, 8);
//     sy -= 12;
//   }
//   if (data.shipperPhone) {
//     drawText(data.shipperPhone, margin + 20, sy - 2, 8);
//   }

//   // CONSIGNEE
//   drawRect(margin + leftW, y - shipperH, midW, shipperH);
//   ["C", "O", "N", "S", "I", "G", "N", "E", "E"].forEach((ch, i) => {
//     drawText(ch, margin + leftW + 4, y - 16 - i * 12, 9, true);
//   });
//   drawText("2.", margin + leftW + 20, y - 14, 8, true);
//   drawText(data.consigneeName || "", margin + leftW + 34, y - 14, 9, true);
//   const consLines = wrapText(data.consigneeAddress || "", 30);
//   consLines.forEach((line, i) => {
//     drawText(line, margin + leftW + 20, y - 28 - i * 11, 8);
//   });
//   let cy = y - 28 - consLines.length * 11;
//   if (data.consigneeCity) {
//     drawText(data.consigneeCity, margin + leftW + 20, cy - 2, 8);
//     cy -= 12;
//   }
//   if (data.consigneeState) {
//     drawText(data.consigneeState, margin + leftW + 20, cy - 2, 8);
//     cy -= 12;
//   }
//   if (data.consigneePincode) {
//     drawText(data.consigneePincode, margin + leftW + 20, cy - 2, 8);
//     cy -= 12;
//   }
//   drawText(
//     `Country : ${data.consigneeCountry || "U.S.A."}`,
//     margin + leftW + 20,
//     cy - 2,
//     8,
//   );
//   cy -= 12;
//   if (data.consigneePhone) {
//     drawText(data.consigneePhone, margin + leftW + 20, cy - 2, 8);
//   }

//   // SERVICE
//   drawRect(margin + leftW + midW, y - shipperH, rightW, shipperH);
//   drawRect(margin + leftW + midW, y - 18, rightW, 18, 0.7, lightGray);
//   drawText("SERVICE TYPE", margin + leftW + midW + 6, y - 13, 7, true);
//   drawRect(margin + leftW + midW, y - 40, rightW, 22);
//   drawText(
//     (data.serviceType || "INTERNATIONAL").toUpperCase(),
//     margin + leftW + midW + 6,
//     y - 33,
//     8,
//     true,
//   );
//   drawText(
//     (data.vendor || "FEDEX").toUpperCase(),
//     margin + leftW + midW + 6,
//     y - 55,
//     8,
//   );
//   drawText(
//     "FULL DESCRIPTION OF CONTENTS :-",
//     margin + leftW + midW + 6,
//     y - 75,
//     7,
//     true,
//   );
//   wrapText(contentText, 28).forEach((line, i) => {
//     drawText(line, margin + leftW + midW + 6, y - 90 - i * 11, 8);
//   });
//   drawText(
//     "SPECIAL INSTRUCTIONS :-",
//     margin + leftW + midW + 6,
//     y - 118,
//     7,
//     true,
//   );
//   wrapText(data.specialInstructions || "", 28).forEach((line, i) => {
//     drawText(line, margin + leftW + midW + 6, y - 132 - i * 11, 8);
//   });

//   y -= shipperH;

//   /* ---- Bottom left: auth + POD ---- */
//   drawRect(margin, y - senderAuthH, leftW, senderAuthH);
//   drawText(
//     "3.  SENDER'S AUTHORISATION AND SIGNATURE",
//     margin + 4,
//     y - 14,
//     7,
//     true,
//   );
//   drawRect(margin + 18, y - 78, 130, 52, 1.3);
//   drawText("ICL", margin + 42, y - 42, 26, true);
//   drawText("®", margin + 108, y - 38, 11);
//   drawText("Integrated Couriers & Logistics", margin + 22, y - 62, 6);
//   drawText("SENDER'S SIGNATURE", margin + 8, y - 96, 8);
//   page.drawLine({
//     start: { x: margin + 8, y: y - 110 },
//     end: { x: margin + leftW - 10, y: y - 110 },
//     thickness: 0.8,
//   });
//   drawText("DATE", margin + 8, y - 128, 8);
//   drawText("PROOF OF DELIVERY (POD)", margin + 8, y - 150, 9, true);
//   drawText("RECEIVER'S SIGNATURE", margin + 8, y - 168, 8);
//   page.drawLine({
//     start: { x: margin + 8, y: y - 182 },
//     end: { x: margin + leftW - 10, y: y - 182 },
//     thickness: 0.8,
//   });
//   drawText("DATE    /     /", margin + 8, y - 198, 7);
//   drawText("TIME     AM/PM", margin + 100, y - 198, 7);
//   drawText("(CAPITAL LETTERS VERY IMPORTANT)", margin + 8, y - 210, 5.5);

//   /* ---- Bottom center: declared + CSB + barcode ---- */
//   drawRect(margin + leftW, y - declaredH, midW, declaredH);
//   drawRect(margin + leftW, y - 48, midW, 48, 0.9);
//   drawText("DECLARED VALUE FOR", margin + leftW + 12, y - 16, 8, true);
//   drawText("CUSTOMS AND CURRENCY", margin + leftW + 12, y - 28, 8, true);
//   drawText(
//     `${declared > 0 ? declared.toFixed(0) : "0"} ${currency}`,
//     margin + leftW + 40,
//     y - 44,
//     14,
//     true,
//   );

//   drawRect(margin + leftW + 30, y - 100, 130, 40, 1.8);
//   drawText(csb, margin + leftW + 55, y - 82, 18, true);

//   drawBarcode(page, margin + leftW + 8, y - 168, 42, data.awb, 1.35);
//   const awbWidth = bold.widthOfTextAtSize(data.awb, 11);
//   drawText(
//     data.awb,
//     margin + leftW + (midW - awbWidth) / 2,
//     y - 186,
//     11,
//     true,
//   );

//   /* ---- Bottom right: size & weight ---- */
//   drawRect(margin + leftW + midW, y - sizeWeightH, rightW, sizeWeightH);
//   drawRect(margin + leftW + midW, y - 18, rightW, 18, 0.7, lightGray);
//   drawText("SIZE & WEIGHT", margin + leftW + midW + 8, y - 13, 8, true);
//   drawText(`Pieces :   ${pieces}`, margin + leftW + midW + 8, y - 42, 11);
//   drawText(
//     `Weight   ${actualW.toFixed(3)}   Kgs`,
//     margin + leftW + midW + 8,
//     y - 66,
//     11,
//   );
//   drawRect(margin + leftW + midW, y - 100, rightW, 28);
//   drawText(data.dimensions || "", margin + leftW + midW + 8, y - 88, 10);
//   drawRect(margin + leftW + midW, y - 140, rightW, 32);
//   drawText("CHARGED WEIGHT", margin + leftW + midW + 8, y - 122, 9, true);
//   drawText(
//     chargeW.toFixed(2),
//     margin + leftW + midW + 8,
//     y - 138,
//     14,
//     true,
//   );

//   drawText(
//     "Sreshta Logistics  •  System Generated Label  •  ICL Network",
//     margin,
//     12,
//     7,
//     false,
//     gray,
//   );

//   return pdf.save();
// }

// import "server-only";

// import {
//   PDFDocument,
//   StandardFonts,
//   rgb,
//   type PDFPage,
// } from "pdf-lib";

// export type AwbLabelData = {
//   awb: string;
//   accountCode?: string;
//   bookDate?: string;
//   printedAt?: string;

//   shipperName: string;
//   shipperAddress: string;
//   shipperCity?: string;
//   shipperState?: string;
//   shipperPincode?: string;
//   shipperPhone?: string;
//   shipperCountry?: string;

//   consigneeName: string;
//   consigneeAddress: string;
//   consigneeCity?: string;
//   consigneeState?: string;
//   consigneePincode?: string;
//   consigneePhone?: string;
//   consigneeCountry?: string;

//   serviceType?: string;
//   product?: string;
//   vendor?: string;
//   customerReference?: string;

//   pieces: number;
//   actualWeight: number;
//   chargeableWeight: number;
//   dimensions?: string;

//   declaredValue?: number;
//   currency?: string;
//   content?: string;
//   csbType?: string;
//   specialInstructions?: string;
//   origin?: string;
// };

// /* ------------------------------------------------------------------ */
// /*  Code-128 Subset B                                                 */
// /* ------------------------------------------------------------------ */

// const CODE128_PATTERNS: string[] = [
//   "11011001100", "11001101100", "11001100110", "10010011000",
//   "10010001100", "10001001100", "10011001000", "10011000100",
//   "10001100100", "11001001000", "11001000100", "11000100100",
//   "10110011100", "10011011100", "10011001110", "10111001100",
//   "10011101100", "10011100110", "11001110010", "11001011100",
//   "11001001110", "11011100100", "11001110100", "11101101110",
//   "11101001100", "11100101100", "11100100110", "11101100100",
//   "11100110100", "11100110010", "11011011000", "11011000110",
//   "11000110110", "10100011000", "10001011000", "10001000110",
//   "10110001000", "10001101000", "10001100010", "11010001000",
//   "11000101000", "11000100010", "10110111000", "10110001110",
//   "10001101110", "10111011000", "10111000110", "10001110110",
//   "11101110110", "11010001110", "11000101110", "11011101000",
//   "11011100010", "11011101110", "11101011000", "11101000110",
//   "11100010110", "11101101000", "11101100010", "11100011010",
//   "11101111010", "11001000010", "11110001010", "10100110000",
//   "10100001100", "10010110000", "10010000110", "10000101100",
//   "10000100110", "10110010000", "10110000100", "10011010000",
//   "10011000010", "10000110100", "10000110010", "11000010010",
//   "11001010000", "11110111010", "11000010100", "10001111010",
//   "10100111100", "10010111100", "10010011110", "10111100100",
//   "10011110100", "10011110010", "11110100100", "11110010100",
//   "11110010010", "11011011110", "11011110110", "11110110110",
//   "10101111000", "10100011110", "10001011110", "10111101000",
//   "10111100010", "11110101000", "11110100010", "10111011110",
//   "10111101110", "11101011110", "11101011010",
// ];

// const START_B = 104;
// const STOP_PATTERN = "1100011101011";

// function getPattern(value: number): string {
//   if (value >= 0 && value < CODE128_PATTERNS.length) {
//     return CODE128_PATTERNS[value]!;
//   }
//   if (value === 104) return "11010010000";
//   if (value === 105) return "11010011100";
//   if (value === 106) return "11000111010";
//   return "11011001100";
// }

// function encodeCode128B(text: string): string {
//   const clean = String(text || "")
//     .split("")
//     .filter((ch) => {
//       const code = ch.charCodeAt(0);
//       return code >= 32 && code <= 126;
//     })
//     .join("");

//   if (!clean) return getPattern(START_B) + STOP_PATTERN;

//   const values: number[] = [START_B];
//   for (let i = 0; i < clean.length; i++) {
//     values.push(clean.charCodeAt(i) - 32);
//   }

//   let checksum = values[0]!;
//   for (let i = 1; i < values.length; i++) {
//     checksum += values[i]! * i;
//   }
//   checksum %= 103;
//   values.push(checksum);

//   let pattern = "";
//   for (const v of values) pattern += getPattern(v);
//   pattern += STOP_PATTERN;
//   return pattern;
// }

// function drawBarcode(
//   page: PDFPage,
//   x: number,
//   y: number,
//   barHeight: number,
//   text: string,
//   moduleWidth = 1.05,
// ): number {
//   const pattern = encodeCode128B(text);
//   const quietZone = moduleWidth * 8;
//   let cx = x + quietZone;
//   for (let i = 0; i < pattern.length; i++) {
//     if (pattern[i] === "1") {
//       page.drawRectangle({
//         x: cx,
//         y,
//         width: moduleWidth,
//         height: barHeight,
//         color: rgb(0, 0, 0),
//       });
//     }
//     cx += moduleWidth;
//   }
//   return cx + quietZone - x;
// }

// function wrapText(text: string, maxChars: number): string[] {
//   if (!text) return [];
//   const words = String(text).split(/\s+/).filter(Boolean);
//   const lines: string[] = [];
//   let current = "";
//   for (const word of words) {
//     const next = current ? `${current} ${word}` : word;
//     if (next.length <= maxChars) {
//       current = next;
//     } else {
//       if (current) lines.push(current);
//       if (word.length > maxChars) {
//         let rest = word;
//         while (rest.length > maxChars) {
//           lines.push(rest.slice(0, maxChars));
//           rest = rest.slice(maxChars);
//         }
//         current = rest;
//       } else {
//         current = word;
//       }
//     }
//   }
//   if (current) lines.push(current);
//   return lines;
// }

// function formatPrintedAt(value?: string): string {
//   if (value) return value;
//   const d = new Date();
//   const pad = (n: number) => String(n).padStart(2, "0");
//   const h24 = d.getHours();
//   const h12 = h24 % 12 || 12;
//   const ampm = h24 >= 12 ? "pm" : "am";
//   return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}  ${pad(h12)}:${pad(d.getMinutes())}${ampm}`;
// }

// function formatDateOnly(value?: string): string {
//   if (value) {
//     const m = value.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/);
//     if (m) {
//       return `${m[1]!.padStart(2, "0")}-${m[2]!.padStart(2, "0")}-${m[3]}`;
//     }
//   }
//   const d = new Date();
//   const pad = (n: number) => String(n).padStart(2, "0");
//   return `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()}`;
// }

// /** Skip city/state/pin if already present inside address */
// function extraLocationLines(
//   address: string,
//   city?: string,
//   state?: string,
//   pincode?: string,
// ): string[] {
//   const hay = address.toLowerCase();
//   const out: string[] = [];
//   const pushIfNew = (v?: string) => {
//     const t = String(v || "").trim();
//     if (!t) return;
//     if (hay.includes(t.toLowerCase())) return;
//     out.push(t);
//   };
//   pushIfNew(city);
//   pushIfNew(state);
//   pushIfNew(pincode);
//   return out;
// }

// /**
//  * Colored ICL logo (approximates brand mark without external image).
//  * Teal + navy + orange accents similar to ICL network labels.
//  */
// function drawIclLogo(
//   page: PDFPage,
//   bold: Awaited<ReturnType<PDFDocument["embedFont"]>>,
//   font: Awaited<ReturnType<PDFDocument["embedFont"]>>,
//   x: number,
//   y: number,
//   boxW: number,
//   boxH: number,
// ) {
//   const navy = rgb(0.05, 0.2, 0.45);
//   const teal = rgb(0.0, 0.55, 0.65);
//   const orange = rgb(0.92, 0.45, 0.1);
//   const black = rgb(0, 0, 0);

//   // Outer frame
//   page.drawRectangle({
//     x,
//     y,
//     width: boxW,
//     height: boxH,
//     borderColor: black,
//     borderWidth: 1.4,
//     color: rgb(1, 1, 1),
//   });

//   // Accent bar at top
//   page.drawRectangle({
//     x: x + 1,
//     y: y + boxH - 6,
//     width: boxW - 2,
//     height: 5,
//     color: teal,
//   });

//   // I C L letters in color
//   const letterSize = 22;
//   const word = "ICL";
//   const totalW =
//     bold.widthOfTextAtSize("I", letterSize) +
//     bold.widthOfTextAtSize("C", letterSize) +
//     bold.widthOfTextAtSize("L", letterSize) +
//     4;
//   let lx = x + (boxW - totalW) / 2;
//   const ly = y + boxH / 2 - 2;

//   page.drawText("I", {
//     x: lx,
//     y: ly,
//     size: letterSize,
//     font: bold,
//     color: navy,
//   });
//   lx += bold.widthOfTextAtSize("I", letterSize) + 2;

//   page.drawText("C", {
//     x: lx,
//     y: ly,
//     size: letterSize,
//     font: bold,
//     color: teal,
//   });
//   lx += bold.widthOfTextAtSize("C", letterSize) + 2;

//   page.drawText("L", {
//     x: lx,
//     y: ly,
//     size: letterSize,
//     font: bold,
//     color: orange,
//   });

//   // Registered mark
//   page.drawText("®", {
//     x: x + boxW - 14,
//     y: y + boxH - 16,
//     size: 8,
//     font: bold,
//     color: navy,
//   });

//   // Tagline
//   const tag = "Integrated Couriers & Logistics";
//   const tagSize = 5.5;
//   const tagW = font.widthOfTextAtSize(tag, tagSize);
//   page.drawText(tag, {
//     x: x + (boxW - tagW) / 2,
//     y: y + 6,
//     size: tagSize,
//     font,
//     color: navy,
//   });
// }

// export async function generateAwbLabelPdf(
//   data: AwbLabelData,
// ): Promise<Uint8Array> {
//   const pdf = await PDFDocument.create();
//   const page = pdf.addPage([595.28, 841.89]); // A4
//   const { width, height } = page.getSize();

//   const font = await pdf.embedFont(StandardFonts.Helvetica);
//   const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

//   const margin = 16;
//   const black = rgb(0, 0, 0);
//   const gray = rgb(0.35, 0.35, 0.35);
//   const lightGray = rgb(0.92, 0.92, 0.92);

//   const pieces = Number(data.pieces) > 0 ? Number(data.pieces) : 1;
//   const actualW = Number(data.actualWeight) || 0;
//   const chargeW = Math.max(Number(data.chargeableWeight) || 0, actualW);
//   const declared = Number(data.declaredValue) || 0;
//   const currency = (data.currency || "INR").toUpperCase();
//   const contentText = data.content || "USED CLOTHES";
//   const csb = (data.csbType || "CSB4").toUpperCase();
//   const awb = String(data.awb || "").trim().toUpperCase();

//   const drawText = (
//     text: string,
//     x: number,
//     y: number,
//     size = 8,
//     isBold = false,
//     color = black,
//   ) => {
//     const t = String(text ?? "");
//     if (!t.trim()) return;
//     page.drawText(t, {
//       x,
//       y,
//       size,
//       font: isBold ? bold : font,
//       color,
//     });
//   };

//   const drawRect = (
//     x: number,
//     y: number,
//     w: number,
//     h: number,
//     borderWidth = 0.9,
//     fill?: ReturnType<typeof rgb>,
//   ) => {
//     page.drawRectangle({
//       x,
//       y,
//       width: w,
//       height: h,
//       borderColor: black,
//       borderWidth,
//       color: fill,
//     });
//   };

//   const contentW = width - margin * 2;
//   // Compact label block (matches reference — not full-page)
//   let y = height - margin;

//   /* ===================== HEADER ===================== */
//   const headerH = 14;
//   drawRect(margin, y - headerH, contentW, headerH, 0.7);
//   drawText(formatDateOnly(data.printedAt || data.bookDate), margin + 4, y - 10, 6.5);
//   drawText("https://iclexpress.in/tracking/", margin + 72, y - 10, 6.5);
//   drawText("Shipment Label", margin + 248, y - 10, 8, true);
//   drawText(`Printed on  ${formatPrintedAt(data.printedAt)}`, margin + 360, y - 10, 6.5);
//   y -= headerH;

//   /* ===================== ACCOUNT / ORIGIN / REF ===================== */
//   const row1H = 34;
//   const colAcc = 145;
//   const colOrigin = 175;
//   const colRef = contentW - colAcc - colOrigin;

//   drawRect(margin, y - row1H, colAcc, row1H);
//   drawText("1.  ACCOUNT NUMBER", margin + 5, y - 11, 6.5, true);
//   drawText((data.accountCode || "—").toUpperCase(), margin + 5, y - 27, 12, true);

//   drawRect(margin + colAcc, y - row1H, colOrigin, row1H);
//   drawText((data.origin || "—").toUpperCase(), margin + colAcc + 8, y - 12, 11, true);
//   drawText(awb, margin + colAcc + 8, y - 28, 11, true);

//   drawRect(margin + colAcc + colOrigin, y - row1H, colRef, row1H);
//   drawText("CUSTOMER REFERENCE", margin + colAcc + colOrigin + 6, y - 11, 6.5, true);
//   drawText(
//     (data.customerReference || "SRESHTA COURIERS").toUpperCase(),
//     margin + colAcc + colOrigin + 6,
//     y - 27,
//     10,
//     true,
//   );
//   y -= row1H;

//   /* ===================== 3-COLUMN GRID ===================== */
//   // Reference layout: top row = Shipper | Consignee | Service
//   //                   bottom row = Auth+POD | Declared+CSB+Barcode | Size&Weight
//   const leftW = 190;
//   const midW = 200;
//   const rightW = contentW - leftW - midW;
//   const topH = 118;
//   const bottomH = 200;
//   const stripW = 12;

//   /* ---------- TOP-LEFT: SHIPPER ---------- */
//   drawRect(margin, y - topH, leftW, topH);
//   drawRect(margin, y - topH, stripW, topH, 0.5, lightGray);
//   ["S", "H", "I", "P", "P", "E", "R"].forEach((ch, i) => {
//     drawText(ch, margin + 2.5, y - 14 - i * 13, 8, true);
//   });

//   const shipX = margin + stripW + 5;
//   drawText("1.", shipX, y - 12, 8, true);
//   drawText(data.shipperName || "", shipX + 12, y - 12, 8.5, true);

//   let sy = y - 24;
//   wrapText(data.shipperAddress || "", 28)
//     .slice(0, 4)
//     .forEach((line) => {
//       drawText(line, shipX, sy, 7.5);
//       sy -= 10;
//     });
//   extraLocationLines(
//     data.shipperAddress || "",
//     data.shipperCity,
//     data.shipperState,
//     data.shipperPincode,
//   ).forEach((line) => {
//     if (sy < y - topH + 16) return;
//     drawText(line, shipX, sy, 7.5);
//     sy -= 10;
//   });
//   if (data.shipperPhone && sy >= y - topH + 12) {
//     drawText(String(data.shipperPhone), shipX, sy, 7.5);
//   }

//   /* ---------- TOP-MIDDLE: CONSIGNEE ---------- */
//   drawRect(margin + leftW, y - topH, midW, topH);
//   drawRect(margin + leftW, y - topH, stripW, topH, 0.5, lightGray);
//   ["C", "O", "N", "S", "I", "G", "N", "E", "E"].forEach((ch, i) => {
//     drawText(ch, margin + leftW + 2.5, y - 13 - i * 11, 7.5, true);
//   });

//   const consX = margin + leftW + stripW + 5;
//   drawText("2.", consX, y - 12, 8, true);
//   drawText(data.consigneeName || "", consX + 12, y - 12, 8.5, true);

//   let cy = y - 24;
//   wrapText(data.consigneeAddress || "", 28)
//     .slice(0, 4)
//     .forEach((line) => {
//       drawText(line, consX, cy, 7.5);
//       cy -= 10;
//     });
//   extraLocationLines(
//     data.consigneeAddress || "",
//     data.consigneeCity,
//     data.consigneeState,
//     data.consigneePincode,
//   ).forEach((line) => {
//     if (cy < y - topH + 28) return;
//     drawText(line, consX, cy, 7.5);
//     cy -= 10;
//   });
//   if (cy >= y - topH + 20) {
//     drawText(
//       `Country : ${(data.consigneeCountry || "U.S.A.").toUpperCase()}`,
//       consX,
//       cy,
//       7.5,
//     );
//     cy -= 10;
//   }
//   if (data.consigneePhone && cy >= y - topH + 12) {
//     drawText(String(data.consigneePhone), consX, cy, 7.5);
//   }

//   /* ---------- TOP-RIGHT: SERVICE TYPE ---------- */
//   drawRect(margin + leftW + midW, y - topH, rightW, topH);
//   drawRect(margin + leftW + midW, y - 16, rightW, 16, 0.7, lightGray);
//   drawText("SERVICE TYPE", margin + leftW + midW + 5, y - 12, 6.5, true);

//   drawText(
//     (data.serviceType || "SPX  INTERNATIONAL PRIORITY").toUpperCase(),
//     margin + leftW + midW + 5,
//     y - 32,
//     7.5,
//     true,
//   );
//   drawText(
//     (data.vendor || "FEDERAL EXPRESS CORPORATION").toUpperCase(),
//     margin + leftW + midW + 5,
//     y - 46,
//     7,
//   );

//   drawText(
//     "FULL DESCRIPTION OF CONTENTS :-",
//     margin + leftW + midW + 5,
//     y - 64,
//     6,
//     true,
//   );
//   wrapText(contentText, 26)
//     .slice(0, 2)
//     .forEach((line, i) => {
//       drawText(line, margin + leftW + midW + 5, y - 76 - i * 10, 7.5);
//     });

//   drawText(
//     "SPECIAL INSTRUCTIONS :-",
//     margin + leftW + midW + 5,
//     y - 100,
//     6,
//     true,
//   );
//   wrapText(data.specialInstructions || "", 26)
//     .slice(0, 1)
//     .forEach((line, i) => {
//       drawText(line, margin + leftW + midW + 5, y - 112 - i * 10, 7.5);
//     });

//   y -= topH;

//   /* ---------- BOTTOM-LEFT: AUTH + ICL + POD ---------- */
//   drawRect(margin, y - bottomH, leftW, bottomH);
//   drawText(
//     "3.  SENDER'S AUTHORISATION AND SIGNATURE",
//     margin + 4,
//     y - 12,
//     6,
//     true,
//   );

//   // Colored ICL logo
//   const logoW = 130;
//   const logoH = 48;
//   const logoX = margin + (leftW - logoW) / 2;
//   const logoY = y - 68;
//   drawIclLogo(page, bold, font, logoX, logoY, logoW, logoH);

//   drawText("SENDER'S SIGNATURE", margin + 6, y - 84, 7.5);
//   page.drawLine({
//     start: { x: margin + 6, y: y - 96 },
//     end: { x: margin + leftW - 8, y: y - 96 },
//     thickness: 0.7,
//     color: black,
//   });
//   drawText("DATE", margin + 6, y - 110, 7.5);

//   drawText("PROOF OF DELIVERY (POD)", margin + 6, y - 132, 8, true);
//   drawText("RECEIVER'S SIGNATURE", margin + 6, y - 148, 7.5);
//   page.drawLine({
//     start: { x: margin + 6, y: y - 160 },
//     end: { x: margin + leftW - 8, y: y - 160 },
//     thickness: 0.7,
//     color: black,
//   });
//   drawText("DATE    /     /", margin + 6, y - 176, 6.5);
//   drawText("TIME     AM/PM", margin + 90, y - 176, 6.5);
//   drawText(
//     "(CAPITAL LETTERS VERY IMPORTANT)",
//     margin + 6,
//     y - 192,
//     5,
//     false,
//     gray,
//   );

//   /* ---------- BOTTOM-MIDDLE: DECLARED + CSB + BARCODE ---------- */
//   drawRect(margin + leftW, y - bottomH, midW, bottomH);

//   // Declared value band
//   drawRect(margin + leftW, y - 48, midW, 48, 0.8);
//   drawText("DECLARED VALUE FOR", margin + leftW + 12, y - 14, 7.5, true);
//   drawText("CUSTOMS AND CURRENCY", margin + leftW + 12, y - 26, 7.5, true);
//   const declaredLabel = `${declared > 0 ? declared.toFixed(0) : "0"} ${currency}`;
//   const declaredW = bold.widthOfTextAtSize(declaredLabel, 13);
//   drawText(
//     declaredLabel,
//     margin + leftW + (midW - declaredW) / 2,
//     y - 44,
//     13,
//     true,
//   );

//   // CSB box
//   const csbBoxW = 110;
//   const csbBoxH = 32;
//   const csbBoxX = margin + leftW + (midW - csbBoxW) / 2;
//   const csbBoxY = y - 100;
//   drawRect(csbBoxX, csbBoxY, csbBoxW, csbBoxH, 1.6);
//   const csbTextW = bold.widthOfTextAtSize(csb, 15);
//   drawText(csb, csbBoxX + (csbBoxW - csbTextW) / 2, csbBoxY + 10, 15, true);

//   // Barcode centered
//   const barH = 36;
//   const barY = y - bottomH + 30;
//   const barModule = 1.0;
//   const pattern = encodeCode128B(awb);
//   const quiet = barModule * 8;
//   const barTotalW = pattern.length * barModule + quiet * 2;
//   const barX = margin + leftW + Math.max(4, (midW - barTotalW) / 2);
//   drawBarcode(page, barX, barY, barH, awb, barModule);

//   const awbTextW = bold.widthOfTextAtSize(awb, 10);
//   drawText(
//     awb,
//     margin + leftW + (midW - awbTextW) / 2,
//     barY - 12,
//     10,
//     true,
//   );

//   /* ---------- BOTTOM-RIGHT: SIZE & WEIGHT ---------- */
//   drawRect(margin + leftW + midW, y - bottomH, rightW, bottomH);
//   drawRect(margin + leftW + midW, y - 16, rightW, 16, 0.7, lightGray);
//   drawText("SIZE & WEIGHT", margin + leftW + midW + 6, y - 12, 7, true);

//   // Pieces row
//   drawRect(margin + leftW + midW, y - 40, rightW, 24);
//   drawText("Pieces :", margin + leftW + midW + 8, y - 32, 9);
//   drawText(String(pieces), margin + leftW + midW + 70, y - 32, 10, true);

//   // Weight row
//   drawRect(margin + leftW + midW, y - 64, rightW, 24);
//   drawText("Weight", margin + leftW + midW + 8, y - 56, 9);
//   drawText(
//     `${actualW.toFixed(3)}   Kgs`,
//     margin + leftW + midW + 55,
//     y - 56,
//     10,
//     true,
//   );

//   // Dimensions row
//   drawRect(margin + leftW + midW, y - 100, rightW, 36);
//   const dim = String(data.dimensions || "").trim();
//   if (dim) {
//     drawText(dim, margin + leftW + midW + 8, y - 82, 9);
//   }

//   // Charged weight
//   drawRect(margin + leftW + midW, y - bottomH, rightW, bottomH - 100);
//   drawText("CHARGED WEIGHT", margin + leftW + midW + 8, y - 120, 8, true);
//   const chargeLabel = chargeW.toFixed(2);
//   const chargeTw = bold.widthOfTextAtSize(chargeLabel, 16);
//   drawText(
//     chargeLabel,
//     margin + leftW + midW + (rightW - chargeTw) / 2,
//     y - 155,
//     16,
//     true,
//   );

//   return pdf.save();
// }

// import "server-only";

// import { readFileSync, existsSync } from "fs";
// import { join } from "path";

// import {
//   PDFDocument,
//   StandardFonts,
//   rgb,
//   type PDFPage,
//   type PDFImage,
// } from "pdf-lib";

// export type AwbLabelData = {
//   awb: string;
//   accountCode?: string;
//   bookDate?: string;
//   printedAt?: string;

//   shipperName: string;
//   shipperAddress: string;
//   shipperCity?: string;
//   shipperState?: string;
//   shipperPincode?: string;
//   shipperPhone?: string;
//   shipperCountry?: string;

//   consigneeName: string;
//   consigneeAddress: string;
//   consigneeCity?: string;
//   consigneeState?: string;
//   consigneePincode?: string;
//   consigneePhone?: string;
//   consigneeCountry?: string;

//   serviceType?: string;
//   product?: string;
//   vendor?: string;
//   customerReference?: string;

//   pieces: number;
//   actualWeight: number;
//   chargeableWeight: number;
//   dimensions?: string;

//   declaredValue?: number;
//   currency?: string;
//   content?: string;
//   csbType?: string;
//   specialInstructions?: string;
//   origin?: string;
// };

// /* ------------------------------------------------------------------ */
// /*  Code-128 Subset B                                                 */
// /* ------------------------------------------------------------------ */

// const CODE128_PATTERNS: string[] = [
//   "11011001100", "11001101100", "11001100110", "10010011000",
//   "10010001100", "10001001100", "10011001000", "10011000100",
//   "10001100100", "11001001000", "11001000100", "11000100100",
//   "10110011100", "10011011100", "10011001110", "10111001100",
//   "10011101100", "10011100110", "11001110010", "11001011100",
//   "11001001110", "11011100100", "11001110100", "11101101110",
//   "11101001100", "11100101100", "11100100110", "11101100100",
//   "11100110100", "11100110010", "11011011000", "11011000110",
//   "11000110110", "10100011000", "10001011000", "10001000110",
//   "10110001000", "10001101000", "10001100010", "11010001000",
//   "11000101000", "11000100010", "10110111000", "10110001110",
//   "10001101110", "10111011000", "10111000110", "10001110110",
//   "11101110110", "11010001110", "11000101110", "11011101000",
//   "11011100010", "11011101110", "11101011000", "11101000110",
//   "11100010110", "11101101000", "11101100010", "11100011010",
//   "11101111010", "11001000010", "11110001010", "10100110000",
//   "10100001100", "10010110000", "10010000110", "10000101100",
//   "10000100110", "10110010000", "10110000100", "10011010000",
//   "10011000010", "10000110100", "10000110010", "11000010010",
//   "11001010000", "11110111010", "11000010100", "10001111010",
//   "10100111100", "10010111100", "10010011110", "10111100100",
//   "10011110100", "10011110010", "11110100100", "11110010100",
//   "11110010010", "11011011110", "11011110110", "11110110110",
//   "10101111000", "10100011110", "10001011110", "10111101000",
//   "10111100010", "11110101000", "11110100010", "10111011110",
//   "10111101110", "11101011110", "11101011010",
// ];

// const START_B = 104;
// const STOP_PATTERN = "1100011101011";

// function getPattern(value: number): string {
//   if (value >= 0 && value < CODE128_PATTERNS.length) {
//     return CODE128_PATTERNS[value]!;
//   }
//   if (value === 104) return "11010010000";
//   if (value === 105) return "11010011100";
//   if (value === 106) return "11000111010";
//   return "11011001100";
// }

// function encodeCode128B(text: string): string {
//   const clean = String(text || "")
//     .split("")
//     .filter((ch) => {
//       const code = ch.charCodeAt(0);
//       return code >= 32 && code <= 126;
//     })
//     .join("");

//   if (!clean) return getPattern(START_B) + STOP_PATTERN;

//   const values: number[] = [START_B];
//   for (let i = 0; i < clean.length; i++) {
//     values.push(clean.charCodeAt(i) - 32);
//   }

//   let checksum = values[0]!;
//   for (let i = 1; i < values.length; i++) {
//     checksum += values[i]! * i;
//   }
//   checksum %= 103;
//   values.push(checksum);

//   let pattern = "";
//   for (const v of values) pattern += getPattern(v);
//   pattern += STOP_PATTERN;
//   return pattern;
// }

// function drawBarcode(
//   page: PDFPage,
//   x: number,
//   y: number,
//   barHeight: number,
//   text: string,
//   moduleWidth = 1.05,
// ): number {
//   const pattern = encodeCode128B(text);
//   const quietZone = moduleWidth * 8;
//   let cx = x + quietZone;
//   for (let i = 0; i < pattern.length; i++) {
//     if (pattern[i] === "1") {
//       page.drawRectangle({
//         x: cx,
//         y,
//         width: moduleWidth,
//         height: barHeight,
//         color: rgb(0, 0, 0),
//       });
//     }
//     cx += moduleWidth;
//   }
//   return cx + quietZone - x;
// }

// function wrapText(text: string, maxChars: number): string[] {
//   if (!text) return [];
//   const words = String(text).split(/\s+/).filter(Boolean);
//   const lines: string[] = [];
//   let current = "";
//   for (const word of words) {
//     const next = current ? `${current} ${word}` : word;
//     if (next.length <= maxChars) {
//       current = next;
//     } else {
//       if (current) lines.push(current);
//       if (word.length > maxChars) {
//         let rest = word;
//         while (rest.length > maxChars) {
//           lines.push(rest.slice(0, maxChars));
//           rest = rest.slice(maxChars);
//         }
//         current = rest;
//       } else {
//         current = word;
//       }
//     }
//   }
//   if (current) lines.push(current);
//   return lines;
// }

// function formatPrintedAt(value?: string): string {
//   if (value) return value;
//   const d = new Date();
//   const pad = (n: number) => String(n).padStart(2, "0");
//   const h24 = d.getHours();
//   const h12 = h24 % 12 || 12;
//   const ampm = h24 >= 12 ? "pm" : "am";
//   return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}  ${pad(h12)}:${pad(d.getMinutes())}${ampm}`;
// }

// function formatDateOnly(value?: string): string {
//   if (value) {
//     const m = value.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/);
//     if (m) {
//       return `${m[1]!.padStart(2, "0")}-${m[2]!.padStart(2, "0")}-${m[3]}`;
//     }
//   }
//   const d = new Date();
//   const pad = (n: number) => String(n).padStart(2, "0");
//   return `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()}`;
// }

// function extraLocationLines(
//   address: string,
//   city?: string,
//   state?: string,
//   pincode?: string,
// ): string[] {
//   const hay = address.toLowerCase();
//   const out: string[] = [];
//   const pushIfNew = (v?: string) => {
//     const t = String(v || "").trim();
//     if (!t) return;
//     if (hay.includes(t.toLowerCase())) return;
//     out.push(t);
//   };
//   pushIfNew(city);
//   pushIfNew(state);
//   pushIfNew(pincode);
//   return out;
// }

// function getTrackingUrl(): string {
//   const base = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(
//     /\/$/,
//     "",
//   );
//   return `${base}/logistics/track`;
// }

// function loadSreshtaLogoBytes(): Uint8Array | null {
//   const candidates = [
//     join(process.cwd(), "public", "images", "sreshta-logistics-logo.png"),
//     join(process.cwd(), "public", "images", "sreshta-logistics-logo.PNG"),
//     join(process.cwd(), "public", "sreshta-logistics-logo.png"),
//   ];
//   for (const p of candidates) {
//     if (existsSync(p)) {
//       return readFileSync(p);
//     }
//   }
//   return null;
// }

// function drawSreshtaLogoBox(
//   page: PDFPage,
//   logoImage: PDFImage | null,
//   bold: Awaited<ReturnType<PDFDocument["embedFont"]>>,
//   font: Awaited<ReturnType<PDFDocument["embedFont"]>>,
//   x: number,
//   y: number,
//   boxW: number,
//   boxH: number,
// ) {
//   const black = rgb(0, 0, 0);
//   const navy = rgb(0.024, 0.157, 0.298);

//   page.drawRectangle({
//     x,
//     y,
//     width: boxW,
//     height: boxH,
//     borderColor: black,
//     borderWidth: 1.2,
//     color: rgb(1, 1, 1),
//   });

//   if (logoImage) {
//     const pad = 6;
//     const maxW = boxW - pad * 2;
//     const maxH = boxH - pad * 2;
//     const scale = Math.min(maxW / logoImage.width, maxH / logoImage.height);
//     const drawW = logoImage.width * scale;
//     const drawH = logoImage.height * scale;
//     page.drawImage(logoImage, {
//       x: x + (boxW - drawW) / 2,
//       y: y + (boxH - drawH) / 2,
//       width: drawW,
//       height: drawH,
//     });
//     return;
//   }

//   page.drawText("SRESHTA", {
//     x: x + 18,
//     y: y + boxH / 2 + 2,
//     size: 14,
//     font: bold,
//     color: navy,
//   });
//   page.drawText("LOGISTICS", {
//     x: x + 18,
//     y: y + boxH / 2 - 12,
//     size: 10,
//     font,
//     color: rgb(0.03, 0.5, 0.53),
//   });
// }

// export async function generateAwbLabelPdf(
//   data: AwbLabelData,
// ): Promise<Uint8Array> {
//   const pdf = await PDFDocument.create();
//   const page = pdf.addPage([595.28, 841.89]);
//   const { width, height } = page.getSize();

//   const font = await pdf.embedFont(StandardFonts.Helvetica);
//   const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

//   let logoImage: PDFImage | null = null;
//   try {
//     const bytes = loadSreshtaLogoBytes();
//     if (bytes) {
//       logoImage = await pdf.embedPng(bytes);
//     }
//   } catch (err) {
//     console.warn("Could not embed Sreshta logistics logo:", err);
//     logoImage = null;
//   }

//   const margin = 16;
//   const black = rgb(0, 0, 0);
//   const gray = rgb(0.35, 0.35, 0.35);
//   const lightGray = rgb(0.92, 0.92, 0.92);

//   const pieces = Number(data.pieces) > 0 ? Number(data.pieces) : 1;
//   const actualW = Number(data.actualWeight) || 0;
//   const chargeW = Math.max(Number(data.chargeableWeight) || 0, actualW);
//   const declared = Number(data.declaredValue) || 0;
//   const currency = (data.currency || "INR").toUpperCase();
//   const contentText = data.content || "USED CLOTHES";
//   const csb = (data.csbType || "CSB4").toUpperCase();
//   const awb = String(data.awb || "").trim().toUpperCase();
//   const trackingUrl = getTrackingUrl();

//   const drawText = (
//     text: string,
//     x: number,
//     y: number,
//     size = 8,
//     isBold = false,
//     color = black,
//   ) => {
//     const t = String(text ?? "");
//     if (!t.trim()) return;
//     page.drawText(t, {
//       x,
//       y,
//       size,
//       font: isBold ? bold : font,
//       color,
//     });
//   };

//   const drawRect = (
//     x: number,
//     y: number,
//     w: number,
//     h: number,
//     borderWidth = 0.9,
//     fill?: ReturnType<typeof rgb>,
//   ) => {
//     page.drawRectangle({
//       x,
//       y,
//       width: w,
//       height: h,
//       borderColor: black,
//       borderWidth,
//       color: fill,
//     });
//   };

//   const contentW = width - margin * 2;
//   let y = height - margin;

//   /* ===================== HEADER ===================== */
//   const headerH = 14;
//   drawRect(margin, y - headerH, contentW, headerH, 0.7);
//   drawText(formatDateOnly(data.printedAt || data.bookDate), margin + 4, y - 10, 6.5);
//   drawText(trackingUrl, margin + 72, y - 10, 6.5);
//   drawText("Shipment Label", margin + 280, y - 10, 8, true);
//   drawText(`Printed on  ${formatPrintedAt(data.printedAt)}`, margin + 385, y - 10, 6.5);
//   y -= headerH;

//   /* ===================== ACCOUNT / ORIGIN / REF ===================== */
//   const row1H = 34;
//   const colAcc = 145;
//   const colOrigin = 175;
//   const colRef = contentW - colAcc - colOrigin;

//   drawRect(margin, y - row1H, colAcc, row1H);
//   drawText("1.  ACCOUNT NUMBER", margin + 5, y - 11, 6.5, true);
//   drawText((data.accountCode || "—").toUpperCase(), margin + 5, y - 27, 12, true);

//   drawRect(margin + colAcc, y - row1H, colOrigin, row1H);
//   drawText((data.origin || "—").toUpperCase(), margin + colAcc + 8, y - 12, 11, true);
//   drawText(awb, margin + colAcc + 8, y - 28, 11, true);

//   drawRect(margin + colAcc + colOrigin, y - row1H, colRef, row1H);
//   drawText("CUSTOMER REFERENCE", margin + colAcc + colOrigin + 6, y - 11, 6.5, true);
//   drawText(
//     (data.customerReference || "SRESHTA COURIERS").toUpperCase(),
//     margin + colAcc + colOrigin + 6,
//     y - 27,
//     10,
//     true,
//   );
//   y -= row1H;

//   /* ===================== 3-COLUMN GRID ===================== */
//   const leftW = 190;
//   const midW = 200;
//   const rightW = contentW - leftW - midW;
//   const topH = 118;
//   const bottomH = 200;
//   const stripW = 12;

//   /* ---------- TOP-LEFT: SHIPPER ---------- */
//   drawRect(margin, y - topH, leftW, topH);
//   drawRect(margin, y - topH, stripW, topH, 0.5, lightGray);
//   ["S", "H", "I", "P", "P", "E", "R"].forEach((ch, i) => {
//     drawText(ch, margin + 2.5, y - 14 - i * 13, 8, true);
//   });

//   const shipX = margin + stripW + 5;
//   drawText("1.", shipX, y - 12, 8, true);
//   drawText(data.shipperName || "", shipX + 12, y - 12, 8.5, true);

//   let sy = y - 24;
//   wrapText(data.shipperAddress || "", 28)
//     .slice(0, 4)
//     .forEach((line) => {
//       drawText(line, shipX, sy, 7.5);
//       sy -= 10;
//     });
//   extraLocationLines(
//     data.shipperAddress || "",
//     data.shipperCity,
//     data.shipperState,
//     data.shipperPincode,
//   ).forEach((line) => {
//     if (sy < y - topH + 16) return;
//     drawText(line, shipX, sy, 7.5);
//     sy -= 10;
//   });
//   if (data.shipperPhone && sy >= y - topH + 12) {
//     drawText(String(data.shipperPhone), shipX, sy, 7.5);
//   }

//   /* ---------- TOP-MIDDLE: CONSIGNEE ---------- */
//   drawRect(margin + leftW, y - topH, midW, topH);
//   drawRect(margin + leftW, y - topH, stripW, topH, 0.5, lightGray);
//   ["C", "O", "N", "S", "I", "G", "N", "E", "E"].forEach((ch, i) => {
//     drawText(ch, margin + leftW + 2.5, y - 13 - i * 11, 7.5, true);
//   });

//   const consX = margin + leftW + stripW + 5;
//   drawText("2.", consX, y - 12, 8, true);
//   drawText(data.consigneeName || "", consX + 12, y - 12, 8.5, true);

//   let cy = y - 24;
//   wrapText(data.consigneeAddress || "", 28)
//     .slice(0, 4)
//     .forEach((line) => {
//       drawText(line, consX, cy, 7.5);
//       cy -= 10;
//     });
//   extraLocationLines(
//     data.consigneeAddress || "",
//     data.consigneeCity,
//     data.consigneeState,
//     data.consigneePincode,
//   ).forEach((line) => {
//     if (cy < y - topH + 28) return;
//     drawText(line, consX, cy, 7.5);
//     cy -= 10;
//   });
//   if (cy >= y - topH + 20) {
//     drawText(
//       `Country : ${(data.consigneeCountry || "U.S.A.").toUpperCase()}`,
//       consX,
//       cy,
//       7.5,
//     );
//     cy -= 10;
//   }
//   if (data.consigneePhone && cy >= y - topH + 12) {
//     drawText(String(data.consigneePhone), consX, cy, 7.5);
//   }

//   /* ---------- TOP-RIGHT: SERVICE TYPE ---------- */
//   drawRect(margin + leftW + midW, y - topH, rightW, topH);
//   drawRect(margin + leftW + midW, y - 16, rightW, 16, 0.7, lightGray);
//   drawText("SERVICE TYPE", margin + leftW + midW + 5, y - 12, 6.5, true);

//   drawText(
//     (data.serviceType || "SPX  INTERNATIONAL PRIORITY").toUpperCase(),
//     margin + leftW + midW + 5,
//     y - 32,
//     7.5,
//     true,
//   );
//   drawText(
//     (data.vendor || "FEDERAL EXPRESS CORPORATION").toUpperCase(),
//     margin + leftW + midW + 5,
//     y - 46,
//     7,
//   );

//   drawText(
//     "FULL DESCRIPTION OF CONTENTS :-",
//     margin + leftW + midW + 5,
//     y - 64,
//     6,
//     true,
//   );
//   wrapText(contentText, 26)
//     .slice(0, 2)
//     .forEach((line, i) => {
//       drawText(line, margin + leftW + midW + 5, y - 76 - i * 10, 7.5);
//     });

//   drawText(
//     "SPECIAL INSTRUCTIONS :-",
//     margin + leftW + midW + 5,
//     y - 100,
//     6,
//     true,
//   );
//   wrapText(data.specialInstructions || "", 26)
//     .slice(0, 1)
//     .forEach((line, i) => {
//       drawText(line, margin + leftW + midW + 5, y - 112 - i * 10, 7.5);
//     });

//   y -= topH;

//   /* ---------- BOTTOM-LEFT: AUTH + SRESHTA LOGO + POD ---------- */
//   drawRect(margin, y - bottomH, leftW, bottomH);
//   drawText(
//     "3.  SENDER'S AUTHORISATION AND SIGNATURE",
//     margin + 4,
//     y - 12,
//     6,
//     true,
//   );

//   const logoW = 140;
//   const logoH = 52;
//   const logoX = margin + (leftW - logoW) / 2;
//   const logoY = y - 72;
//   drawSreshtaLogoBox(page, logoImage, bold, font, logoX, logoY, logoW, logoH);

//   drawText("SENDER'S SIGNATURE", margin + 6, y - 88, 7.5);
//   page.drawLine({
//     start: { x: margin + 6, y: y - 100 },
//     end: { x: margin + leftW - 8, y: y - 100 },
//     thickness: 0.7,
//     color: black,
//   });
//   drawText("DATE", margin + 6, y - 114, 7.5);

//   drawText("PROOF OF DELIVERY (POD)", margin + 6, y - 136, 8, true);
//   drawText("RECEIVER'S SIGNATURE", margin + 6, y - 152, 7.5);
//   page.drawLine({
//     start: { x: margin + 6, y: y - 164 },
//     end: { x: margin + leftW - 8, y: y - 164 },
//     thickness: 0.7,
//     color: black,
//   });
//   drawText("DATE    /     /", margin + 6, y - 180, 6.5);
//   drawText("TIME     AM/PM", margin + 90, y - 180, 6.5);
//   drawText(
//     "(CAPITAL LETTERS VERY IMPORTANT)",
//     margin + 6,
//     y - 194,
//     5,
//     false,
//     gray,
//   );

//   /* ---------- BOTTOM-MIDDLE: DECLARED + CSB + BARCODE ---------- */
//   drawRect(margin + leftW, y - bottomH, midW, bottomH);

//   drawRect(margin + leftW, y - 48, midW, 48, 0.8);
//   drawText("DECLARED VALUE FOR", margin + leftW + 12, y - 14, 7.5, true);
//   drawText("CUSTOMS AND CURRENCY", margin + leftW + 12, y - 26, 7.5, true);
//   const declaredLabel = `${declared > 0 ? declared.toFixed(0) : "0"} ${currency}`;
//   const declaredW = bold.widthOfTextAtSize(declaredLabel, 13);
//   drawText(
//     declaredLabel,
//     margin + leftW + (midW - declaredW) / 2,
//     y - 44,
//     13,
//     true,
//   );

//   const csbBoxW = 110;
//   const csbBoxH = 32;
//   const csbBoxX = margin + leftW + (midW - csbBoxW) / 2;
//   const csbBoxY = y - 100;
//   drawRect(csbBoxX, csbBoxY, csbBoxW, csbBoxH, 1.6);
//   const csbTextW = bold.widthOfTextAtSize(csb, 15);
//   drawText(csb, csbBoxX + (csbBoxW - csbTextW) / 2, csbBoxY + 10, 15, true);

//   const barH = 36;
//   const barY = y - bottomH + 30;
//   const barModule = 1.0;
//   const pattern = encodeCode128B(awb);
//   const quiet = barModule * 8;
//   const barTotalW = pattern.length * barModule + quiet * 2;
//   const barX = margin + leftW + Math.max(4, (midW - barTotalW) / 2);
//   drawBarcode(page, barX, barY, barH, awb, barModule);

//   const awbTextW = bold.widthOfTextAtSize(awb, 10);
//   drawText(
//     awb,
//     margin + leftW + (midW - awbTextW) / 2,
//     barY - 12,
//     10,
//     true,
//   );

//   /* ---------- BOTTOM-RIGHT: SIZE & WEIGHT ---------- */
//   drawRect(margin + leftW + midW, y - bottomH, rightW, bottomH);
//   drawRect(margin + leftW + midW, y - 16, rightW, 16, 0.7, lightGray);
//   drawText("SIZE & WEIGHT", margin + leftW + midW + 6, y - 12, 7, true);

//   drawRect(margin + leftW + midW, y - 40, rightW, 24);
//   drawText("Pieces :", margin + leftW + midW + 8, y - 32, 9);
//   drawText(String(pieces), margin + leftW + midW + 70, y - 32, 10, true);

//   drawRect(margin + leftW + midW, y - 64, rightW, 24);
//   drawText("Weight", margin + leftW + midW + 8, y - 56, 9);
//   drawText(
//     `${actualW.toFixed(3)}   Kgs`,
//     margin + leftW + midW + 55,
//     y - 56,
//     10,
//     true,
//   );

//   drawRect(margin + leftW + midW, y - 100, rightW, 36);
//   const dim = String(data.dimensions || "").trim();
//   if (dim) {
//     drawText(dim, margin + leftW + midW + 8, y - 82, 9);
//   }

//   drawRect(margin + leftW + midW, y - bottomH, rightW, bottomH - 100);
//   drawText("CHARGED WEIGHT", margin + leftW + midW + 8, y - 120, 8, true);
//   const chargeLabel = chargeW.toFixed(2);
//   const chargeTw = bold.widthOfTextAtSize(chargeLabel, 16);
//   drawText(
//     chargeLabel,
//     margin + leftW + midW + (rightW - chargeTw) / 2,
//     y - 155,
//     16,
//     true,
//   );

//   return pdf.save();
// }

// import "server-only";

// import { readFileSync, existsSync } from "fs";
// import { join } from "path";

// import {
//   PDFDocument,
//   StandardFonts,
//   rgb,
//   type PDFPage,
//   type PDFImage,
// } from "pdf-lib";

// export type AwbLabelData = {
//   awb: string;
//   accountCode?: string;
//   bookDate?: string;
//   printedAt?: string;

//   shipperName: string;
//   shipperAddress: string;
//   shipperCity?: string;
//   shipperState?: string;
//   shipperPincode?: string;
//   shipperPhone?: string;
//   shipperCountry?: string;

//   consigneeName: string;
//   consigneeAddress: string;
//   consigneeCity?: string;
//   consigneeState?: string;
//   consigneePincode?: string;
//   consigneePhone?: string;
//   consigneeCountry?: string;

//   serviceType?: string;
//   product?: string;
//   vendor?: string;
//   customerReference?: string;

//   pieces: number;
//   actualWeight: number;
//   chargeableWeight: number;
//   dimensions?: string;

//   declaredValue?: number;
//   currency?: string;
//   content?: string;
//   csbType?: string;
//   specialInstructions?: string;
//   origin?: string;
// };

// /* ------------------------------------------------------------------ */
// /*  Code-128 Subset B                                                 */
// /* ------------------------------------------------------------------ */

// const CODE128_PATTERNS: string[] = [
//   "11011001100", "11001101100", "11001100110", "10010011000",
//   "10010001100", "10001001100", "10011001000", "10011000100",
//   "10001100100", "11001001000", "11001000100", "11000100100",
//   "10110011100", "10011011100", "10011001110", "10111001100",
//   "10011101100", "10011100110", "11001110010", "11001011100",
//   "11001001110", "11011100100", "11001110100", "11101101110",
//   "11101001100", "11100101100", "11100100110", "11101100100",
//   "11100110100", "11100110010", "11011011000", "11011000110",
//   "11000110110", "10100011000", "10001011000", "10001000110",
//   "10110001000", "10001101000", "10001100010", "11010001000",
//   "11000101000", "11000100010", "10110111000", "10110001110",
//   "10001101110", "10111011000", "10111000110", "10001110110",
//   "11101110110", "11010001110", "11000101110", "11011101000",
//   "11011100010", "11011101110", "11101011000", "11101000110",
//   "11100010110", "11101101000", "11101100010", "11100011010",
//   "11101111010", "11001000010", "11110001010", "10100110000",
//   "10100001100", "10010110000", "10010000110", "10000101100",
//   "10000100110", "10110010000", "10110000100", "10011010000",
//   "10011000010", "10000110100", "10000110010", "11000010010",
//   "11001010000", "11110111010", "11000010100", "10001111010",
//   "10100111100", "10010111100", "10010011110", "10111100100",
//   "10011110100", "10011110010", "11110100100", "11110010100",
//   "11110010010", "11011011110", "11011110110", "11110110110",
//   "10101111000", "10100011110", "10001011110", "10111101000",
//   "10111100010", "11110101000", "11110100010", "10111011110",
//   "10111101110", "11101011110", "11101011010",
// ];

// const START_B = 104;
// const STOP_PATTERN = "1100011101011";

// function getPattern(value: number): string {
//   if (value >= 0 && value < CODE128_PATTERNS.length) {
//     return CODE128_PATTERNS[value]!;
//   }
//   if (value === 104) return "11010010000";
//   if (value === 105) return "11010011100";
//   if (value === 106) return "11000111010";
//   return "11011001100";
// }

// function encodeCode128B(text: string): string {
//   const clean = String(text || "")
//     .split("")
//     .filter((ch) => {
//       const code = ch.charCodeAt(0);
//       return code >= 32 && code <= 126;
//     })
//     .join("");

//   if (!clean) return getPattern(START_B) + STOP_PATTERN;

//   const values: number[] = [START_B];
//   for (let i = 0; i < clean.length; i++) {
//     values.push(clean.charCodeAt(i) - 32);
//   }

//   let checksum = values[0]!;
//   for (let i = 1; i < values.length; i++) {
//     checksum += values[i]! * i;
//   }
//   checksum %= 103;
//   values.push(checksum);

//   let pattern = "";
//   for (const v of values) pattern += getPattern(v);
//   pattern += STOP_PATTERN;
//   return pattern;
// }

// function drawBarcode(
//   page: PDFPage,
//   x: number,
//   y: number,
//   barHeight: number,
//   text: string,
//   moduleWidth = 1.05,
// ): number {
//   const pattern = encodeCode128B(text);
//   const quietZone = moduleWidth * 8;
//   let cx = x + quietZone;
//   for (let i = 0; i < pattern.length; i++) {
//     if (pattern[i] === "1") {
//       page.drawRectangle({
//         x: cx,
//         y,
//         width: moduleWidth,
//         height: barHeight,
//         color: rgb(0, 0, 0),
//       });
//     }
//     cx += moduleWidth;
//   }
//   return cx + quietZone - x;
// }

// function wrapText(text: string, maxChars: number): string[] {
//   if (!text) return [];
//   const words = String(text).split(/\s+/).filter(Boolean);
//   const lines: string[] = [];
//   let current = "";
//   for (const word of words) {
//     const next = current ? `${current} ${word}` : word;
//     if (next.length <= maxChars) {
//       current = next;
//     } else {
//       if (current) lines.push(current);
//       if (word.length > maxChars) {
//         let rest = word;
//         while (rest.length > maxChars) {
//           lines.push(rest.slice(0, maxChars));
//           rest = rest.slice(maxChars);
//         }
//         current = rest;
//       } else {
//         current = word;
//       }
//     }
//   }
//   if (current) lines.push(current);
//   return lines;
// }

// function formatPrintedAt(value?: string): string {
//   if (value) return value;
//   const d = new Date();
//   const pad = (n: number) => String(n).padStart(2, "0");
//   const h24 = d.getHours();
//   const h12 = h24 % 12 || 12;
//   const ampm = h24 >= 12 ? "pm" : "am";
//   return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}  ${pad(h12)}:${pad(d.getMinutes())}${ampm}`;
// }

// function formatDateOnly(value?: string): string {
//   if (value) {
//     const m = value.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/);
//     if (m) {
//       return `${m[1]!.padStart(2, "0")}-${m[2]!.padStart(2, "0")}-${m[3]}`;
//     }
//   }
//   const d = new Date();
//   const pad = (n: number) => String(n).padStart(2, "0");
//   return `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()}`;
// }

// function extraLocationLines(
//   address: string,
//   city?: string,
//   state?: string,
//   pincode?: string,
// ): string[] {
//   const hay = address.toLowerCase();
//   const out: string[] = [];
//   const pushIfNew = (v?: string) => {
//     const t = String(v || "").trim();
//     if (!t) return;
//     if (hay.includes(t.toLowerCase())) return;
//     out.push(t);
//   };
//   pushIfNew(city);
//   pushIfNew(state);
//   pushIfNew(pincode);
//   return out;
// }

// function getTrackingUrl(): string {
//   const base = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(
//     /\/$/,
//     "",
//   );
//   return `${base}/logistics/track`;
// }

// function loadSreshtaLogoBytes(): Uint8Array | null {
//   const candidates = [
//     join(process.cwd(), "public", "images", "sreshta-logistics-logo.png"),
//     join(process.cwd(), "public", "images", "sreshta-logistics-logo.PNG"),
//     join(process.cwd(), "public", "sreshta-logistics-logo.png"),
//   ];
//   for (const p of candidates) {
//     if (existsSync(p)) {
//       return readFileSync(p);
//     }
//   }
//   return null;
// }

// /** Logo only — no border around the image */
// function drawSreshtaLogo(
//   page: PDFPage,
//   logoImage: PDFImage | null,
//   bold: Awaited<ReturnType<PDFDocument["embedFont"]>>,
//   font: Awaited<ReturnType<PDFDocument["embedFont"]>>,
//   x: number,
//   y: number,
//   boxW: number,
//   boxH: number,
// ) {
//   const navy = rgb(0.024, 0.157, 0.298);
//   const teal = rgb(0.03, 0.5, 0.53);

//   if (logoImage) {
//     const scale = Math.min(boxW / logoImage.width, boxH / logoImage.height);
//     const drawW = logoImage.width * scale;
//     const drawH = logoImage.height * scale;
//     page.drawImage(logoImage, {
//       x: x + (boxW - drawW) / 2,
//       y: y + (boxH - drawH) / 2,
//       width: drawW,
//       height: drawH,
//     });
//     return;
//   }

//   // Text fallback if PNG missing (still no border)
//   page.drawText("SRESHTA", {
//     x: x + 10,
//     y: y + boxH / 2 + 2,
//     size: 14,
//     font: bold,
//     color: navy,
//   });
//   page.drawText("LOGISTICS", {
//     x: x + 10,
//     y: y + boxH / 2 - 12,
//     size: 10,
//     font,
//     color: teal,
//   });
// }

// // export async function generateAwbLabelPdf(
// //   data: AwbLabelData,
// // ): Promise<Uint8Array> {
// //   const pdf = await PDFDocument.create();
// //   const page = pdf.addPage([595.28, 841.89]);
// //   const { width, height } = page.getSize();

// //   const font = await pdf.embedFont(StandardFonts.Helvetica);
// //   const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

// //   let logoImage: PDFImage | null = null;
// //   try {
// //     const bytes = loadSreshtaLogoBytes();
// //     if (bytes) {
// //       logoImage = await pdf.embedPng(bytes);
// //     }
// //   } catch (err) {
// //     console.warn("Could not embed Sreshta logistics logo:", err);
// //     logoImage = null;
// //   }

// //   const margin = 16;
// //   const black = rgb(0, 0, 0);
// //   const gray = rgb(0.35, 0.35, 0.35);
// //   const lightGray = rgb(0.92, 0.92, 0.92);
// //   // Link-style blue for tracking URL
// //   const linkBlue = rgb(0.05, 0.35, 0.85);

// //   const pieces = Number(data.pieces) > 0 ? Number(data.pieces) : 1;
// //   const actualW = Number(data.actualWeight) || 0;
// //   const chargeW = Math.max(Number(data.chargeableWeight) || 0, actualW);
// //   const declared = Number(data.declaredValue) || 0;
// //   const currency = (data.currency || "INR").toUpperCase();
// //   const contentText = data.content || "USED CLOTHES";
// //   const csb = (data.csbType || "CSB4").toUpperCase();
// //   const awb = String(data.awb || "").trim().toUpperCase();
// //   const trackingUrl = getTrackingUrl();

// //   const drawText = (
// //     text: string,
// //     x: number,
// //     y: number,
// //     size = 8,
// //     isBold = false,
// //     color = black,
// //   ) => {
// //     const t = String(text ?? "");
// //     if (!t.trim()) return;
// //     page.drawText(t, {
// //       x,
// //       y,
// //       size,
// //       font: isBold ? bold : font,
// //       color,
// //     });
// //   };

// //   const drawRect = (
// //     x: number,
// //     y: number,
// //     w: number,
// //     h: number,
// //     borderWidth = 0.9,
// //     fill?: ReturnType<typeof rgb>,
// //   ) => {
// //     page.drawRectangle({
// //       x,
// //       y,
// //       width: w,
// //       height: h,
// //       borderColor: black,
// //       borderWidth,
// //       color: fill,
// //     });
// //   };

// //   const contentW = width - margin * 2;
// //   let y = height - margin;

// //   /* ===================== HEADER ===================== */
// //   const headerH = 14;
// //   drawRect(margin, y - headerH, contentW, headerH, 0.7);
// //   drawText(formatDateOnly(data.printedAt || data.bookDate), margin + 4, y - 10, 6.5);
// //   // Tracking URL in blue (link style)
// //   drawText(trackingUrl, margin + 72, y - 10, 6.5, false, linkBlue);
// //   drawText("Shipment Label", margin + 280, y - 10, 8, true);
// //   drawText(`Printed on  ${formatPrintedAt(data.printedAt)}`, margin + 385, y - 10, 6.5);
// //   y -= headerH;

// //   /* ===================== ACCOUNT / ORIGIN / REF ===================== */
// //   const row1H = 34;
// //   const colAcc = 145;
// //   const colOrigin = 175;
// //   const colRef = contentW - colAcc - colOrigin;

// //   drawRect(margin, y - row1H, colAcc, row1H);
// //   drawText("1.  ACCOUNT NUMBER", margin + 5, y - 11, 6.5, true);
// //   drawText((data.accountCode || "—").toUpperCase(), margin + 5, y - 27, 12, true);

// //   drawRect(margin + colAcc, y - row1H, colOrigin, row1H);
// //   drawText((data.origin || "—").toUpperCase(), margin + colAcc + 8, y - 12, 11, true);
// //   drawText(awb, margin + colAcc + 8, y - 28, 11, true);

// //   drawRect(margin + colAcc + colOrigin, y - row1H, colRef, row1H);
// //   drawText("CUSTOMER REFERENCE", margin + colAcc + colOrigin + 6, y - 11, 6.5, true);
// //   drawText(
// //     (data.customerReference || "SRESHTA COURIERS").toUpperCase(),
// //     margin + colAcc + colOrigin + 6,
// //     y - 27,
// //     10,
// //     true,
// //   );
// //   y -= row1H;

// //   /* ===================== 3-COLUMN GRID ===================== */
// //   const leftW = 190;
// //   const midW = 200;
// //   const rightW = contentW - leftW - midW;
// //   const topH = 118;
// //   const bottomH = 200;
// //   const stripW = 12;

// //   /* ---------- TOP-LEFT: SHIPPER ---------- */
// //   drawRect(margin, y - topH, leftW, topH);
// //   drawRect(margin, y - topH, stripW, topH, 0.5, lightGray);
// //   ["S", "H", "I", "P", "P", "E", "R"].forEach((ch, i) => {
// //     drawText(ch, margin + 2.5, y - 14 - i * 13, 8, true);
// //   });

// //   const shipX = margin + stripW + 5;
// //   drawText("1.", shipX, y - 12, 8, true);
// //   drawText(data.shipperName || "", shipX + 12, y - 12, 8.5, true);

// //   let sy = y - 24;
// //   wrapText(data.shipperAddress || "", 28)
// //     .slice(0, 4)
// //     .forEach((line) => {
// //       drawText(line, shipX, sy, 7.5);
// //       sy -= 10;
// //     });
// //   extraLocationLines(
// //     data.shipperAddress || "",
// //     data.shipperCity,
// //     data.shipperState,
// //     data.shipperPincode,
// //   ).forEach((line) => {
// //     if (sy < y - topH + 16) return;
// //     drawText(line, shipX, sy, 7.5);
// //     sy -= 10;
// //   });
// //   if (data.shipperPhone && sy >= y - topH + 12) {
// //     drawText(String(data.shipperPhone), shipX, sy, 7.5);
// //   }

// //   /* ---------- TOP-MIDDLE: CONSIGNEE ---------- */
// //   drawRect(margin + leftW, y - topH, midW, topH);
// //   drawRect(margin + leftW, y - topH, stripW, topH, 0.5, lightGray);
// //   ["C", "O", "N", "S", "I", "G", "N", "E", "E"].forEach((ch, i) => {
// //     drawText(ch, margin + leftW + 2.5, y - 13 - i * 11, 7.5, true);
// //   });

// //   const consX = margin + leftW + stripW + 5;
// //   drawText("2.", consX, y - 12, 8, true);
// //   drawText(data.consigneeName || "", consX + 12, y - 12, 8.5, true);

// //   let cy = y - 24;
// //   wrapText(data.consigneeAddress || "", 28)
// //     .slice(0, 4)
// //     .forEach((line) => {
// //       drawText(line, consX, cy, 7.5);
// //       cy -= 10;
// //     });
// //   extraLocationLines(
// //     data.consigneeAddress || "",
// //     data.consigneeCity,
// //     data.consigneeState,
// //     data.consigneePincode,
// //   ).forEach((line) => {
// //     if (cy < y - topH + 28) return;
// //     drawText(line, consX, cy, 7.5);
// //     cy -= 10;
// //   });
// //   if (cy >= y - topH + 20) {
// //     drawText(
// //       `Country : ${(data.consigneeCountry || "U.S.A.").toUpperCase()}`,
// //       consX,
// //       cy,
// //       7.5,
// //     );
// //     cy -= 10;
// //   }
// //   if (data.consigneePhone && cy >= y - topH + 12) {
// //     drawText(String(data.consigneePhone), consX, cy, 7.5);
// //   }

// //   /* ---------- TOP-RIGHT: SERVICE TYPE ---------- */
// //   drawRect(margin + leftW + midW, y - topH, rightW, topH);
// //   drawRect(margin + leftW + midW, y - 16, rightW, 16, 0.7, lightGray);
// //   drawText("SERVICE TYPE", margin + leftW + midW + 5, y - 12, 6.5, true);

// //   drawText(
// //     (data.serviceType || "SPX  INTERNATIONAL PRIORITY").toUpperCase(),
// //     margin + leftW + midW + 5,
// //     y - 32,
// //     7.5,
// //     true,
// //   );
// //   drawText(
// //     (data.vendor || "FEDERAL EXPRESS CORPORATION").toUpperCase(),
// //     margin + leftW + midW + 5,
// //     y - 46,
// //     7,
// //   );

// //   drawText(
// //     "FULL DESCRIPTION OF CONTENTS :-",
// //     margin + leftW + midW + 5,
// //     y - 64,
// //     6,
// //     true,
// //   );
// //   wrapText(contentText, 26)
// //     .slice(0, 2)
// //     .forEach((line, i) => {
// //       drawText(line, margin + leftW + midW + 5, y - 76 - i * 10, 7.5);
// //     });

// //   drawText(
// //     "SPECIAL INSTRUCTIONS :-",
// //     margin + leftW + midW + 5,
// //     y - 100,
// //     6,
// //     true,
// //   );
// //   wrapText(data.specialInstructions || "", 26)
// //     .slice(0, 1)
// //     .forEach((line, i) => {
// //       drawText(line, margin + leftW + midW + 5, y - 112 - i * 10, 7.5);
// //     });

// //   y -= topH;

// //   /* ---------- BOTTOM-LEFT: AUTH + LOGO (no border) + POD ---------- */
// //   drawRect(margin, y - bottomH, leftW, bottomH);
// //   drawText(
// //     "3.  SENDER'S AUTHORISATION AND SIGNATURE",
// //     margin + 4,
// //     y - 12,
// //     6,
// //     true,
// //   );

// //   // Logo without border
// //   const logoW = 140;
// //   const logoH = 48;
// //   const logoX = margin + (leftW - logoW) / 2;
// //   const logoY = y - 70;
// //   drawSreshtaLogo(page, logoImage, bold, font, logoX, logoY, logoW, logoH);

// //   drawText("SENDER'S SIGNATURE", margin + 6, y - 88, 7.5);
// //   page.drawLine({
// //     start: { x: margin + 6, y: y - 100 },
// //     end: { x: margin + leftW - 8, y: y - 100 },
// //     thickness: 0.7,
// //     color: black,
// //   });
// //   drawText("DATE", margin + 6, y - 114, 7.5);

// //   drawText("PROOF OF DELIVERY (POD)", margin + 6, y - 136, 8, true);
// //   drawText("RECEIVER'S SIGNATURE", margin + 6, y - 152, 7.5);
// //   page.drawLine({
// //     start: { x: margin + 6, y: y - 164 },
// //     end: { x: margin + leftW - 8, y: y - 164 },
// //     thickness: 0.7,
// //     color: black,
// //   });
// //   drawText("DATE    /     /", margin + 6, y - 180, 6.5);
// //   drawText("TIME     AM/PM", margin + 90, y - 180, 6.5);
// //   drawText(
// //     "(CAPITAL LETTERS VERY IMPORTANT)",
// //     margin + 6,
// //     y - 194,
// //     5,
// //     false,
// //     gray,
// //   );

// //   /* ---------- BOTTOM-MIDDLE: DECLARED + CSB + BARCODE ---------- */
// //   drawRect(margin + leftW, y - bottomH, midW, bottomH);

// //   drawRect(margin + leftW, y - 48, midW, 48, 0.8);
// //   drawText("DECLARED VALUE FOR", margin + leftW + 12, y - 14, 7.5, true);
// //   drawText("CUSTOMS AND CURRENCY", margin + leftW + 12, y - 26, 7.5, true);
// //   const declaredLabel = `${declared > 0 ? declared.toFixed(0) : "0"} ${currency}`;
// //   const declaredW = bold.widthOfTextAtSize(declaredLabel, 13);
// //   drawText(
// //     declaredLabel,
// //     margin + leftW + (midW - declaredW) / 2,
// //     y - 44,
// //     13,
// //     true,
// //   );

// //   const csbBoxW = 110;
// //   const csbBoxH = 32;
// //   const csbBoxX = margin + leftW + (midW - csbBoxW) / 2;
// //   const csbBoxY = y - 100;
// //   drawRect(csbBoxX, csbBoxY, csbBoxW, csbBoxH, 1.6);
// //   const csbTextW = bold.widthOfTextAtSize(csb, 15);
// //   drawText(csb, csbBoxX + (csbBoxW - csbTextW) / 2, csbBoxY + 10, 15, true);

// //   const barH = 36;
// //   const barY = y - bottomH + 30;
// //   const barModule = 1.0;
// //   const pattern = encodeCode128B(awb);
// //   const quiet = barModule * 8;
// //   const barTotalW = pattern.length * barModule + quiet * 2;
// //   const barX = margin + leftW + Math.max(4, (midW - barTotalW) / 2);
// //   drawBarcode(page, barX, barY, barH, awb, barModule);

// //   const awbTextW = bold.widthOfTextAtSize(awb, 10);
// //   drawText(
// //     awb,
// //     margin + leftW + (midW - awbTextW) / 2,
// //     barY - 12,
// //     10,
// //     true,
// //   );

// //   /* ---------- BOTTOM-RIGHT: SIZE & WEIGHT ---------- */
// //   drawRect(margin + leftW + midW, y - bottomH, rightW, bottomH);
// //   drawRect(margin + leftW + midW, y - 16, rightW, 16, 0.7, lightGray);
// //   drawText("SIZE & WEIGHT", margin + leftW + midW + 6, y - 12, 7, true);

// //   drawRect(margin + leftW + midW, y - 40, rightW, 24);
// //   drawText("Pieces :", margin + leftW + midW + 8, y - 32, 9);
// //   drawText(String(pieces), margin + leftW + midW + 70, y - 32, 10, true);

// //   drawRect(margin + leftW + midW, y - 64, rightW, 24);
// //   drawText("Weight", margin + leftW + midW + 8, y - 56, 9);
// //   drawText(
// //     `${actualW.toFixed(3)}   Kgs`,
// //     margin + leftW + midW + 55,
// //     y - 56,
// //     10,
// //     true,
// //   );

// //   drawRect(margin + leftW + midW, y - 100, rightW, 36);
// //   const dim = String(data.dimensions || "").trim();
// //   if (dim) {
// //     drawText(dim, margin + leftW + midW + 8, y - 82, 9);
// //   }

// //   drawRect(margin + leftW + midW, y - bottomH, rightW, bottomH - 100);
// //   drawText("CHARGED WEIGHT", margin + leftW + midW + 8, y - 120, 8, true);
// //   const chargeLabel = chargeW.toFixed(2);
// //   const chargeTw = bold.widthOfTextAtSize(chargeLabel, 16);
// //   drawText(
// //     chargeLabel,
// //     margin + leftW + midW + (rightW - chargeTw) / 2,
// //     y - 155,
// //     16,
// //     true,
// //   );

// //   return pdf.save();
// // }

// export async function generateAwbLabelPdf(
//   data: AwbLabelData,
// ): Promise<Uint8Array> {
//   const pdf = await PDFDocument.create();
//   // A4
//   const page = pdf.addPage([595.28, 841.89]);
//   const { width, height } = page.getSize();
//   const font = await pdf.embedFont(StandardFonts.Helvetica);
//   const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

//   let logoImage: PDFImage | null = null;
//   try {
//     const bytes = loadSreshtaLogoBytes();
//     if (bytes) logoImage = await pdf.embedPng(bytes);
//   } catch (err) {
//     console.warn("Could not embed Sreshta logistics logo:", err);
//   }

//   const margin = 14;
//   const black = rgb(0, 0, 0);
//   const gray = rgb(0.32, 0.32, 0.32);
//   const lightGray = rgb(0.93, 0.93, 0.93);
//   const linkBlue = rgb(0.05, 0.35, 0.85);

//   const pieces = Number(data.pieces) > 0 ? Number(data.pieces) : 1;
//   const actualW = Number(data.actualWeight) || 0;
//   const chargeW = Math.max(Number(data.chargeableWeight) || 0, actualW);
//   const declared = Number(data.declaredValue) || 0;
//   const currency = (data.currency || "INR").toUpperCase();
//   const contentText = data.content || "—";
//   const csb = (data.csbType || "CSB4").toUpperCase();
//   const awb = String(data.awb || "").trim().toUpperCase();
//   const trackingUrl = getTrackingUrl();

//   const drawText = (
//     text: string,
//     x: number,
//     y: number,
//     size = 8,
//     isBold = false,
//     color = black,
//   ) => {
//     const t = String(text ?? "");
//     if (!t.trim()) return;
//     page.drawText(t, {
//       x,
//       y,
//       size,
//       font: isBold ? bold : font,
//       color,
//     });
//   };

//   const drawRect = (
//     x: number,
//     y: number,
//     w: number,
//     h: number,
//     borderWidth = 0.85,
//     fill?: ReturnType<typeof rgb>,
//   ) => {
//     page.drawRectangle({
//       x,
//       y,
//       width: w,
//       height: h,
//       borderColor: black,
//       borderWidth,
//       color: fill,
//     });
//   };

//   const contentW = width - margin * 2;
//   let y = height - margin;

//   /* ===================== 1) HEADER (date | URL | title | printed) ===================== */
//   const headerH = 16;
//   drawRect(margin, y - headerH, contentW, headerH, 0.7);

//   drawText(formatDateOnly(data.printedAt || data.bookDate), margin + 4, y - 11, 7);
//   drawText(trackingUrl, margin + 70, y - 11, 7, false, linkBlue);
//   drawText("Shipment Label", margin + 268, y - 11, 9, true);
//   drawText(
//     `Printed on  ${formatPrintedAt(data.printedAt)}`,
//     margin + 372,
//     y - 11,
//     7,
//   );
//   y -= headerH;

//   /* ===================== 2) ACCOUNT | ORIGIN+AWB | CUSTOMER REF ===================== */
//   const row1H = 36;
//   const colAcc = 150;
//   const colOrigin = 185;
//   const colRef = contentW - colAcc - colOrigin;

//   // Account
//   drawRect(margin, y - row1H, colAcc, row1H);
//   drawText("1.  ACCOUNT NUMBER", margin + 5, y - 12, 6.5, true);
//   drawText(
//     (data.accountCode || "—").toUpperCase(),
//     margin + 5,
//     y - 28,
//     13,
//     true,
//   );

//   // Origin + AWB (like GUNTUR / 6003358371)
//   drawRect(margin + colAcc, y - row1H, colOrigin, row1H);
//   drawText(
//     (data.origin || "—").toUpperCase(),
//     margin + colAcc + 8,
//     y - 13,
//     12,
//     true,
//   );
//   drawText(awb || "—", margin + colAcc + 8, y - 29, 12, true);

//   // Customer reference
//   drawRect(margin + colAcc + colOrigin, y - row1H, colRef, row1H);
//   drawText(
//     "CUSTOMER REFERENCE",
//     margin + colAcc + colOrigin + 6,
//     y - 12,
//     6.5,
//     true,
//   );
//   drawText(
//     (data.customerReference || "SRESHTA COURIERS").toUpperCase(),
//     margin + colAcc + colOrigin + 6,
//     y - 28,
//     10,
//     true,
//   );
//   y -= row1H;

//   /* ===================== 3) TOP: SHIPPER | CONSIGNEE | SERVICE ===================== */
//   const leftW = 188;
//   const midW = 198;
//   const rightW = contentW - leftW - midW;
//   const topH = 122;
//   const stripW = 12;

//   // --- Shipper ---
//   drawRect(margin, y - topH, leftW, topH);
//   drawRect(margin, y - topH, stripW, topH, 0.5, lightGray);
//   ["S", "H", "I", "P", "P", "E", "R"].forEach((ch, i) => {
//     drawText(ch, margin + 2.8, y - 15 - i * 13.5, 8, true);
//   });

//   const shipX = margin + stripW + 5;
//   drawText("1.", shipX, y - 13, 8, true);
//   drawText(data.shipperName || "", shipX + 12, y - 13, 8.5, true);

//   let sy = y - 26;
//   wrapText(data.shipperAddress || "", 28)
//     .slice(0, 5)
//     .forEach((line) => {
//       drawText(line, shipX, sy, 7.5);
//       sy -= 10;
//     });
//   extraLocationLines(
//     data.shipperAddress || "",
//     data.shipperCity,
//     data.shipperState,
//     data.shipperPincode,
//   ).forEach((line) => {
//     if (sy < y - topH + 16) return;
//     drawText(line, shipX, sy, 7.5);
//     sy -= 10;
//   });
//   if (data.shipperPhone && sy >= y - topH + 12) {
//     drawText(String(data.shipperPhone), shipX, sy, 7.5);
//   }

//   // --- Consignee ---
//   drawRect(margin + leftW, y - topH, midW, topH);
//   drawRect(margin + leftW, y - topH, stripW, topH, 0.5, lightGray);
//   ["C", "O", "N", "S", "I", "G", "N", "E", "E"].forEach((ch, i) => {
//     drawText(ch, margin + leftW + 2.5, y - 14 - i * 11.5, 7.5, true);
//   });

//   const consX = margin + leftW + stripW + 5;
//   drawText("2.", consX, y - 13, 8, true);
//   drawText(data.consigneeName || "", consX + 12, y - 13, 8.5, true);

//   let cy = y - 26;
//   wrapText(data.consigneeAddress || "", 28)
//     .slice(0, 4)
//     .forEach((line) => {
//       drawText(line, consX, cy, 7.5);
//       cy -= 10;
//     });
//   extraLocationLines(
//     data.consigneeAddress || "",
//     data.consigneeCity,
//     data.consigneeState,
//     data.consigneePincode,
//   ).forEach((line) => {
//     if (cy < y - topH + 30) return;
//     drawText(line, consX, cy, 7.5);
//     cy -= 10;
//   });
//   if (cy >= y - topH + 22) {
//     drawText(
//       `Country : ${(data.consigneeCountry || "—").toUpperCase()}`,
//       consX,
//       cy,
//       7.5,
//     );
//     cy -= 10;
//   }
//   if (data.consigneePhone && cy >= y - topH + 12) {
//     drawText(String(data.consigneePhone), consX, cy, 7.5);
//   }

//   // --- Service type (right) ---
//   drawRect(margin + leftW + midW, y - topH, rightW, topH);
//   drawRect(margin + leftW + midW, y - 15, rightW, 15, 0.7, lightGray);
//   drawText("SERVICE TYPE", margin + leftW + midW + 5, y - 11, 6.5, true);

//   // Product / service line (e.g. SPX  INTERNATIONAL PRIORITY)
//   const serviceLine = (
//     data.serviceType ||
//     data.product ||
//     "INTERNATIONAL PRIORITY"
//   ).toUpperCase();
//   drawText(serviceLine, margin + leftW + midW + 5, y - 30, 7.5, true);

//   drawText(
//     (data.vendor || "—").toUpperCase(),
//     margin + leftW + midW + 5,
//     y - 44,
//     7,
//   );

//   drawText(
//     "FULL DESCRIPTION OF CONTENTS :-",
//     margin + leftW + midW + 5,
//     y - 62,
//     6,
//     true,
//   );
//   wrapText(contentText, 26)
//     .slice(0, 2)
//     .forEach((line, i) => {
//       drawText(line, margin + leftW + midW + 5, y - 74 - i * 10, 7.5);
//     });

//   drawText(
//     "SPECIAL INSTRUCTIONS :-",
//     margin + leftW + midW + 5,
//     y - 98,
//     6,
//     true,
//   );
//   wrapText(data.specialInstructions || "", 26)
//     .slice(0, 1)
//     .forEach((line) => {
//       drawText(line, margin + leftW + midW + 5, y - 110, 7.5);
//     });

//   y -= topH;

//   /* ===================== 4) BOTTOM: AUTH | DECLARED+CSB+BAR | SIZE ===================== */
//   const bottomH = 210;

//   // --- Bottom-left: Auth + logo + POD ---
//   drawRect(margin, y - bottomH, leftW, bottomH);
//   drawText(
//     "3.  SENDER'S AUTHORISATION AND SIGNATURE",
//     margin + 4,
//     y - 12,
//     6,
//     true,
//   );

//   const logoW = 132;
//   const logoH = 46;
//   const logoX = margin + (leftW - logoW) / 2;
//   const logoY = y - 68;
//   drawSreshtaLogo(page, logoImage, bold, font, logoX, logoY, logoW, logoH);

//   drawText("SENDER'S SIGNATURE", margin + 6, y - 88, 7.5);
//   page.drawLine({
//     start: { x: margin + 6, y: y - 100 },
//     end: { x: margin + leftW - 8, y: y - 100 },
//     thickness: 0.7,
//     color: black,
//   });
//   drawText("DATE", margin + 6, y - 114, 7.5);

//   drawText("PROOF OF DELIVERY (POD)", margin + 6, y - 138, 8, true);
//   drawText("RECEIVER'S SIGNATURE", margin + 6, y - 154, 7.5);
//   page.drawLine({
//     start: { x: margin + 6, y: y - 166 },
//     end: { x: margin + leftW - 8, y: y - 166 },
//     thickness: 0.7,
//     color: black,
//   });
//   drawText("DATE    /     /", margin + 6, y - 182, 6.5);
//   drawText("TIME     AM/PM", margin + 88, y - 182, 6.5);
//   drawText(
//     "(CAPITAL LETTERS VERY IMPORTANT)",
//     margin + 6,
//     y - 198,
//     5,
//     false,
//     gray,
//   );

//   // --- Bottom-middle: Declared value + CSB + barcode ---
//   drawRect(margin + leftW, y - bottomH, midW, bottomH);

//   // Declared value box (top of middle column)
//   drawRect(margin + leftW, y - 50, midW, 50, 0.9);
//   drawText("DECLARED VALUE FOR", margin + leftW + 14, y - 15, 7.5, true);
//   drawText("CUSTOMS AND CURRENCY", margin + leftW + 14, y - 28, 7.5, true);
//   const declaredLabel = `${declared > 0 ? declared.toFixed(0) : "0"} ${currency}`;
//   const declaredTw = bold.widthOfTextAtSize(declaredLabel, 14);
//   drawText(
//     declaredLabel,
//     margin + leftW + (midW - declaredTw) / 2,
//     y - 45,
//     14,
//     true,
//   );

//   // CSB box (centered, like sample CSB4)
//   const csbBoxW = 120;
//   const csbBoxH = 34;
//   const csbBoxX = margin + leftW + (midW - csbBoxW) / 2;
//   const csbBoxY = y - 102;
//   drawRect(csbBoxX, csbBoxY, csbBoxW, csbBoxH, 1.8);
//   const csbTw = bold.widthOfTextAtSize(csb, 16);
//   drawText(csb, csbBoxX + (csbBoxW - csbTw) / 2, csbBoxY + 11, 16, true);

//   // Code-128 barcode + human-readable AWB under it
//   const barH = 40;
//   const barY = y - bottomH + 28;
//   const barModule = 1.05;
//   const pattern = encodeCode128B(awb);
//   const quiet = barModule * 8;
//   const barTotalW = pattern.length * barModule + quiet * 2;
//   const barX = margin + leftW + Math.max(6, (midW - barTotalW) / 2);
//   drawBarcode(page, barX, barY, barH, awb, barModule);

//   const awbTw = bold.widthOfTextAtSize(awb, 11);
//   drawText(
//     awb,
//     margin + leftW + (midW - awbTw) / 2,
//     barY - 13,
//     11,
//     true,
//   );

//   // --- Bottom-right: Size & Weight (match sample) ---
//   drawRect(margin + leftW + midW, y - bottomH, rightW, bottomH);

//   // Header band
//   drawRect(margin + leftW + midW, y - 16, rightW, 16, 0.7, lightGray);
//   drawText("SIZE & WEIGHT", margin + leftW + midW + 6, y - 12, 7, true);

//   // Pieces
//   drawRect(margin + leftW + midW, y - 42, rightW, 26);
//   drawText("Pieces :", margin + leftW + midW + 8, y - 33, 9);
//   drawText(String(pieces), margin + leftW + midW + 72, y - 33, 11, true);

//   // Weight
//   drawRect(margin + leftW + midW, y - 68, rightW, 26);
//   drawText("Weight", margin + leftW + midW + 8, y - 59, 9);
//   drawText(
//     `${actualW.toFixed(3)}`,
//     margin + leftW + midW + 58,
//     y - 59,
//     11,
//     true,
//   );
//   drawText("Kgs", margin + leftW + midW + rightW - 32, y - 59, 9);

//   // Dimensions (e.g. 37*37*24*1=7)
//   drawRect(margin + leftW + midW, y - 108, rightW, 40);
//   const dim = String(data.dimensions || "").trim();
//   if (dim) {
//     drawText(dim, margin + leftW + midW + 8, y - 90, 9);
//   }

//   // Charged weight (large, bottom)
//   drawRect(margin + leftW + midW, y - bottomH, rightW, bottomH - 108);
//   drawText(
//     "CHARGED WEIGHT",
//     margin + leftW + midW + 8,
//     y - 128,
//     8,
//     true,
//   );
//   const chargeLabel = chargeW.toFixed(2);
//   const chargeTw = bold.widthOfTextAtSize(chargeLabel, 18);
//   drawText(
//     chargeLabel,
//     margin + leftW + midW + (rightW - chargeTw) / 2,
//     y - 165,
//     18,
//     true,
//   );

//   return pdf.save();
// }

// import "server-only";

// import { readFileSync, existsSync } from "fs";
// import { join } from "path";
// import {
//   PDFDocument,
//   StandardFonts,
//   rgb,
//   type PDFPage,
//   type PDFImage,
//   type PDFFont,
// } from "pdf-lib";

// /* ------------------------------------------------------------------ */
// /*  Types                                                              */
// /* ------------------------------------------------------------------ */

// export type AwbLabelData = {
//   awb: string;
//   accountCode?: string;
//   bookDate?: string;
//   printedAt?: string;
//   shipperName: string;
//   shipperAddress: string;
//   shipperCity?: string;
//   shipperState?: string;
//   shipperPincode?: string;
//   shipperPhone?: string;
//   shipperCountry?: string;
//   consigneeName: string;
//   consigneeAddress: string;
//   consigneeCity?: string;
//   consigneeState?: string;
//   consigneePincode?: string;
//   consigneePhone?: string;
//   consigneeCountry?: string;
//   serviceType?: string;
//   product?: string;
//   vendor?: string;
//   customerReference?: string;
//   pieces: number;
//   actualWeight: number;
//   chargeableWeight: number;
//   dimensions?: string;
//   declaredValue?: number;
//   currency?: string;
//   content?: string;
//   csbType?: string;
//   specialInstructions?: string;
//   origin?: string;
// };

// /* ------------------------------------------------------------------ */
// /*  Code-128 Subset B                                                  */
// /* ------------------------------------------------------------------ */

// // const CODE128_PATTERNS: string[] = [
// //   "11011001100", "11001101100", "11001100110", "10010011000",
// //   "10010001100", "10001001100", "10011001000", "10011000100",
// //   "10001100100", "11001001000", "11001000100", "11000100100",
// //   "10110011100", "10011011100", "10011001110", "10111001100",
// //   "10011101100", "10011100110", "11001110010", "11001011100",
// //   "11001001110", "11011100100", "11001110100", "11101101110",
// //   "11101001100", "11100101100", "11100100110", "11101100100",
// //   "11100110100", "11100110010", "11011011000", "11011000110",
// //   "11000110110", "10100011000", "10001011000", "10001000110",
// //   "10110001000", "10001101000", "10001100010", "11010001000",
// //   "11000101000", "11000100010", "10110111000", "10110001110",
// //   "10001101110", "10111011000", "10111000110", "10001110110",
// //   "11101110110", "11010001110", "11000101110", "11011101000",
// //   "11011100010", "11011101110", "11101011000", "11101000110",
// //   "11100010110", "11101101000", "11101100010", "11100011010",
// //   "11101111010", "11001000010", "11110001010", "10100110000",
// //   "10100001100", "10010110000", "10010000110", "10000101100",
// //   "10000100110", "10110010000", "10110000100", "10011010000",
// //   "10011000010", "10000110100", "10000110010", "11000010010",
// //   "11001010000", "11110111010", "11000010100", "10001111010",
// //   "10100111100", "10010111100", "10010011110", "10111100100",
// //   "10011110100", "10011110010", "11110100100", "11110010100",
// //   "11110010010", "11011011110", "11011110110", "11110110110",
// //   "10101111000", "10100011110", "10001011110", "10111101000",
// //   "10111100010", "11110101000", "11110100010", "10111011110",
// //   "10111101110", "11101011110", "11110111010",
// // ];

// const CODE128_PATTERNS: string[] = [
//   "11011001100", "11001101100", "11001100110", "10010011000",
//   "10010001100", "10001001100", "10011001000", "10011000100",
//   "10001100100", "11001001000", "11001000100", "11000100100",
//   "10110011100", "10011011100", "10011001110", "10111001100",
//   "10011101100", "10011100110", "11001110010", "11001011100",
//   "11001001110", "11011100100", "11001110100", "11101101110",
//   "11101001100", "11100101100", "11100100110", "11101100100",
//   "11100110100", "11100110010", "11011011000", "11011000110",
//   "11000110110", "10100011000", "10001011000", "10001000110",
//   "10110001000", "10001101000", "10001100010", "11010001000",
//   "11000101000", "11000100010", "10110111000", "10110001110",
//   "10001101110", "10111011000", "10111000110", "10001110110",
//   "11101110110", "11010001110", "11000101110", "11011101000",
//   "11011100010", "11011101110", "11101011000", "11101000110",
//   "11100010110", "11101101000", "11101100010", "11100011010",
//   "11101111010", "11001000010", "11110001010", "10100110000",
//   "10100001100", "10010110000", "10010000110", "10000101100",
//   "10000100110", "10110010000", "10110000100", "10011010000",
//   "10011000010", "10000110100", "10000110010", "11000010010",
//   "11001010000", "11110111010", "11000010100", "10001111010",
//   "10100111100", "10010111100", "10010011110", "10111100100",
//   "10011110100", "10011110010", "11110100100", "11110010100",
//   "11110010010", "11011011110", "11011110110", "11110110110",
//   "10101111000", "10100011110", "10001011110", "10111101000",
//   "10111100010", "11110101000", "11110100010", "10111011110",
//   "10111101110", "11101011110", "11110101110",
// ];

// // const START_B = 104;
// // const STOP_PATTERN = "1100011101011";

// // function getPattern(value: number): string {
// //   if (value >= 0 && value < CODE128_PATTERNS.length) {
// //     return CODE128_PATTERNS[value]!;
// //   }
// //   if (value === 104) return "11010010000";
// //   if (value === 105) return "11010011100";
// //   if (value === 106) return "11000111010";
// //   return "11011001100";
// // }

// // function encodeCode128B(text: string): string {
// //   const clean = String(text || "")
// //     .split("")
// //     .filter((ch) => {
// //       const code = ch.charCodeAt(0);
// //       return code >= 32 && code <= 126;
// //     })
// //     .join("");

// //   if (!clean) return getPattern(START_B) + STOP_PATTERN;

// //   const values: number[] = [START_B];
// //   for (let i = 0; i < clean.length; i++) {
// //     values.push(clean.charCodeAt(i) - 32);
// //   }

// //   let checksum = values[0]!;
// //   for (let i = 1; i < values.length; i++) {
// //     checksum += values[i]! * i;
// //   }
// //   checksum %= 103;
// //   values.push(checksum);

// //   let pattern = "";
// //   for (const v of values) pattern += getPattern(v);
// //   pattern += STOP_PATTERN;
// //   return pattern;
// // }

// const START_B = 104;
// const STOP_PATTERN = "1100011101011";

// function getPattern(value: number): string {
//   if (value >= 0 && value < CODE128_PATTERNS.length) {
//     return CODE128_PATTERNS[value]!;
//   }
//   if (value === 104) return "11010010000";
//   if (value === 105) return "11010011100";
//   if (value === 106) return "11000111010";
//   return "11011001100";
// }

// /** Clean AWB for barcode: printable ASCII only (Code-128B). */
// function sanitizeBarcodeText(text: string): string {
//   return String(text || "")
//     .trim()
//     .toUpperCase()
//     .split("")
//     .filter((ch) => {
//       const code = ch.charCodeAt(0);
//       return code >= 32 && code <= 126;
//     })
//     .join("");
// }

// function encodeCode128B(text: string): string {
//   const clean = sanitizeBarcodeText(text);
//   if (!clean) return getPattern(START_B) + STOP_PATTERN;

//   const values: number[] = [START_B];
//   for (let i = 0; i < clean.length; i++) {
//     values.push(clean.charCodeAt(i)! - 32);
//   }

//   let checksum = values[0]!;
//   for (let i = 1; i < values.length; i++) {
//     checksum += values[i]! * i;
//   }
//   checksum %= 103;
//   values.push(checksum);

//   let pattern = "";
//   for (const v of values) pattern += getPattern(v);
//   pattern += STOP_PATTERN;
//   return pattern;
// }

// // function drawBarcode(
// //   page: PDFPage,
// //   x: number,
// //   y: number,
// //   barHeight: number,
// //   text: string,
// //   moduleWidth = 1.0,
// // ): number {
// //   const pattern = encodeCode128B(text);
// //   const quietZone = moduleWidth * 10;
// //   let cx = x + quietZone;

// //   for (let i = 0; i < pattern.length; i++) {
// //     if (pattern[i] === "1") {
// //       page.drawRectangle({
// //         x: cx,
// //         y,
// //         width: moduleWidth,
// //         height: barHeight,
// //         color: rgb(0, 0, 0),
// //       });
// //     }
// //     cx += moduleWidth;
// //   }

// //   return cx + quietZone - x;
// // }

// function drawBarcode(
//   page: PDFPage,
//   x: number,
//   y: number,
//   barHeight: number,
//   text: string,
//   moduleWidth = 1.25,
// ): number {
//   const pattern = encodeCode128B(text);
//   const quietZone = moduleWidth * 10; // ≥10 modules each side
//   let cx = x + quietZone;

//   for (let i = 0; i < pattern.length; i++) {
//     if (pattern[i] === "1") {
//       page.drawRectangle({
//         x: cx,
//         y,
//         width: moduleWidth,
//         height: barHeight,
//         color: rgb(0, 0, 0),
//       });
//     }
//     cx += moduleWidth;
//   }

//   return cx + quietZone - x;
// }

// /**
//  * Human-readable AWB under barcode — spaced digits across barcode width
//  * (matches sample: 6 0 0 3 3 5 8 3 7 1).
//  */
// function drawSpacedBarcodeText(
//   page: PDFPage,
//   text: string,
//   centerX: number,
//   y: number,
//   targetWidth: number,
//   font: PDFFont,
//   size: number,
// ) {
//   const chars = sanitizeBarcodeText(text).split("").filter(Boolean);
//   if (!chars.length) return;

//   const charWidths = chars.map((c) => font.widthOfTextAtSize(c, size));
//   const totalCharW = charWidths.reduce((a, b) => a + b, 0);

//   // Spread characters across targetWidth (barcode body width)
//   const gaps = chars.length > 1 ? chars.length - 1 : 1;
//   let gap =
//     chars.length > 1 ? (targetWidth - totalCharW) / gaps : 0;
//   // Cap gap so digits don't fly apart on short AWBs
//   gap = Math.min(Math.max(gap, 2), 14);

//   const usedW =
//     totalCharW + (chars.length > 1 ? gap * (chars.length - 1) : 0);
//   let x = centerX - usedW / 2;

//   for (let i = 0; i < chars.length; i++) {
//     page.drawText(chars[i]!, {
//       x,
//       y,
//       size,
//       font,
//       color: rgb(0, 0, 0),
//     });
//     x += charWidths[i]! + gap;
//   }
// }

// /* ------------------------------------------------------------------ */
// /*  Text helpers                                                       */
// /* ------------------------------------------------------------------ */

// function wrapText(text: string, maxChars: number): string[] {
//   if (!text) return [];
//   const words = String(text).split(/\s+/).filter(Boolean);
//   const lines: string[] = [];
//   let current = "";

//   for (const word of words) {
//     const next = current ? `${current} ${word}` : word;
//     if (next.length <= maxChars) {
//       current = next;
//     } else {
//       if (current) lines.push(current);
//       if (word.length > maxChars) {
//         let rest = word;
//         while (rest.length > maxChars) {
//           lines.push(rest.slice(0, maxChars));
//           rest = rest.slice(maxChars);
//         }
//         current = rest;
//       } else {
//         current = word;
//       }
//     }
//   }
//   if (current) lines.push(current);
//   return lines;
// }

// /** Header left date: DD-MM-YYYY (sample: 20-06-2026) */
// function formatDateOnly(value?: string): string {
//   if (value) {
//     const m = value.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/);
//     if (m) {
//       const d = m[1]!.padStart(2, "0");
//       const mo = m[2]!.padStart(2, "0");
//       const y = m[3]!.length === 2 ? `20${m[3]}` : m[3]!;
//       return `${d}-${mo}-${y}`;
//     }
//     const parsed = new Date(value);
//     if (!Number.isNaN(parsed.getTime())) {
//       const pad = (n: number) => String(n).padStart(2, "0");
//       return `${pad(parsed.getDate())}-${pad(parsed.getMonth() + 1)}-${parsed.getFullYear()}`;
//     }
//   }
//   const d = new Date();
//   const pad = (n: number) => String(n).padStart(2, "0");
//   return `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()}`;
// }

// /** Printed on: DD/MM/YYYY HH:mm:ss (sample: 20/06/2026 15:41:44) */
// function formatPrintedAt(value?: string): string {
//   if (value) {
//     const parsed = new Date(value);
//     if (!Number.isNaN(parsed.getTime())) {
//       const pad = (n: number) => String(n).padStart(2, "0");
//       return `${pad(parsed.getDate())}/${pad(parsed.getMonth() + 1)}/${parsed.getFullYear()} ${pad(parsed.getHours())}:${pad(parsed.getMinutes())}:${pad(parsed.getSeconds())}`;
//     }
//     return value;
//   }
//   const d = new Date();
//   const pad = (n: number) => String(n).padStart(2, "0");
//   return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
// }

// function extraLocationLines(
//   address: string,
//   city?: string,
//   state?: string,
//   pincode?: string,
// ): string[] {
//   const hay = address.toLowerCase();
//   const out: string[] = [];
//   const pushIfNew = (v?: string) => {
//     const t = String(v || "").trim();
//     if (!t) return;
//     if (hay.includes(t.toLowerCase())) return;
//     out.push(t);
//   };
//   pushIfNew(city);
//   pushIfNew(state);
//   pushIfNew(pincode);
//   return out;
// }

// function getTrackingUrl(): string {
//   const base = (
//     process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
//   ).replace(/\/$/, "");
//   return `${base}/logistics/track`;
// }

// function loadSreshtaLogoBytes(): Uint8Array | null {
//   const candidates = [
//     join(process.cwd(), "public", "images", "sreshta-logistics-logo.png"),
//     join(process.cwd(), "public", "images", "sreshta-logistics-logo.PNG"),
//     join(process.cwd(), "public", "sreshta-logistics-logo.png"),
//   ];
//   for (const p of candidates) {
//     if (existsSync(p)) return readFileSync(p);
//   }
//   return null;
// }

// function drawSreshtaLogo(
//   page: PDFPage,
//   logoImage: PDFImage | null,
//   bold: PDFFont,
//   font: PDFFont,
//   x: number,
//   y: number,
//   boxW: number,
//   boxH: number,
// ) {
//   const navy = rgb(0.024, 0.157, 0.298);
//   const teal = rgb(0.03, 0.5, 0.53);

//   if (logoImage) {
//     const scale = Math.min(
//       (boxW * 0.95) / logoImage.width,
//       (boxH * 0.95) / logoImage.height,
//     );
//     const drawW = logoImage.width * scale;
//     const drawH = logoImage.height * scale;
//     page.drawImage(logoImage, {
//       x: x + (boxW - drawW) / 2,
//       y: y + (boxH - drawH) / 2,
//       width: drawW,
//       height: drawH,
//     });
//     return;
//   }

//   page.drawText("SRESHTA", {
//     x: x + 8,
//     y: y + boxH / 2 + 4,
//     size: 13,
//     font: bold,
//     color: navy,
//   });
//   page.drawText("LOGISTICS", {
//     x: x + 8,
//     y: y + boxH / 2 - 10,
//     size: 9,
//     font,
//     color: teal,
//   });
// }

// /* ------------------------------------------------------------------ */
// /*  Main generator — layout matches sample AWB label                   */
// /* ------------------------------------------------------------------ */

// export async function generateAwbLabelPdf(
//   data: AwbLabelData,
// ): Promise<Uint8Array> {
//   const pdf = await PDFDocument.create();
//   // A4 portrait
//   const page = pdf.addPage([595.28, 841.89]);
//   const { width, height } = page.getSize();

//   // const font = await pdf.embedFont(StandardFonts.Helvetica);
//   // const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

//   const font = await pdf.embedFont(StandardFonts.Helvetica);
//   const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
//   const ocrFont = await pdf.embedFont(StandardFonts.CourierBold);

//   let logoImage: PDFImage | null = null;
//   try {
//     const bytes = loadSreshtaLogoBytes();
//     if (bytes) logoImage = await pdf.embedPng(bytes);
//   } catch (err) {
//     console.warn("Could not embed Sreshta logistics logo:", err);
//   }

//   const margin = 12;
//   const black = rgb(0, 0, 0);
//   const gray = rgb(0.3, 0.3, 0.3);
//   const lightGray = rgb(0.92, 0.92, 0.92);
//   const linkBlue = rgb(0.0, 0.2, 0.75);

//   const pieces = Number(data.pieces) > 0 ? Number(data.pieces) : 1;
//   const actualW = Number(data.actualWeight) || 0;
//   const chargeW = Math.max(Number(data.chargeableWeight) || 0, actualW);
//   const declared = Number(data.declaredValue) || 0;
//   const currency = (data.currency || "INR").toUpperCase();
//   const contentText = (data.content || "").trim() || "—";
//   const csb = (data.csbType || "CSB4").toUpperCase();
//   const awb = String(data.awb || "").trim().toUpperCase();
//   const trackingUrl = getTrackingUrl();

//   const drawText = (
//     text: string,
//     x: number,
//     y: number,
//     size = 8,
//     isBold = false,
//     color = black,
//   ) => {
//     const t = String(text ?? "");
//     if (!t) return;
//     page.drawText(t, {
//       x,
//       y,
//       size,
//       font: isBold ? bold : font,
//       color,
//     });
//   };

//   /** Table cell: border always; optional fill */
//   const cell = (
//     x: number,
//     y: number,
//     w: number,
//     h: number,
//     borderWidth = 0.9,
//     fill?: ReturnType<typeof rgb>,
//   ) => {
//     page.drawRectangle({
//       x,
//       y,
//       width: w,
//       height: h,
//       borderColor: black,
//       borderWidth,
//       color: fill,
//     });
//   };

//   const contentW = width - margin * 2;
//   let y = height - margin;

//   /* ================================================================
//    * 1) HEADER BAR
//    *    [DD-MM-YYYY] [tracking URL] [Shipment Label] [Printed on …]
//    * ================================================================ */
//   const headerH = 15;
//   cell(margin, y - headerH, contentW, headerH, 0.75);

//   drawText(formatDateOnly(data.printedAt || data.bookDate), margin + 3, y - 10.5, 6.5);
//   drawText(trackingUrl, margin + 68, y - 10.5, 6.5, false, linkBlue);

//   const title = "Shipment Label";
//   const titleW = bold.widthOfTextAtSize(title, 8.5);
//   drawText(title, margin + (contentW - titleW) / 2, y - 10.5, 8.5, true);

//   const printed = `Printed on  ${formatPrintedAt(data.printedAt)}`;
//   const printedW = font.widthOfTextAtSize(printed, 6.5);
//   drawText(printed, margin + contentW - printedW - 4, y - 10.5, 6.5);

//   y -= headerH;

//   /* ================================================================
//    * 2) ACCOUNT | ORIGIN + AWB | CUSTOMER REFERENCE
//    * ================================================================ */
//   const row1H = 34;
//   const colAcc = 148;
//   const colOrigin = 178;
//   const colRef = contentW - colAcc - colOrigin;

//   // Account
//   cell(margin, y - row1H, colAcc, row1H);
//   drawText("1.  ACCOUNT NUMBER", margin + 4, y - 11, 6.5, true);
//   drawText(
//     (data.accountCode || "—").toUpperCase(),
//     margin + 4,
//     y - 27,
//     12,
//     true,
//   );

//   // Origin (city) + AWB number stacked (sample: GUNTUR / 6003358371)
//   cell(margin + colAcc, y - row1H, colOrigin, row1H);
//   drawText(
//     (data.origin || "—").toUpperCase(),
//     margin + colAcc + 6,
//     y - 12,
//     11,
//     true,
//   );
//   drawText(awb || "—", margin + colAcc + 6, y - 28, 11, true);

//   // Customer reference
//   cell(margin + colAcc + colOrigin, y - row1H, colRef, row1H);
//   drawText(
//     "CUSTOMER REFERENCE",
//     margin + colAcc + colOrigin + 5,
//     y - 11,
//     6.5,
//     true,
//   );
//   drawText(
//     (data.customerReference || "SRESHTA COURIERS").toUpperCase(),
//     margin + colAcc + colOrigin + 5,
//     y - 27,
//     10,
//     true,
//   );

//   y -= row1H;

//   /* ================================================================
//    * 3) TOP GRID: SHIPPER | CONSIGNEE | SERVICE TYPE
//    * ================================================================ */
//   const leftW = 186;
//   const midW = 196;
//   const rightW = contentW - leftW - midW;
//   const topH = 124;
//   const stripW = 11;

//   /* --- Shipper (left) --- */
//   cell(margin, y - topH, leftW, topH);
//   cell(margin, y - topH, stripW, topH, 0.55, lightGray);
//   ["S", "H", "I", "P", "P", "E", "R"].forEach((ch, i) => {
//     drawText(ch, margin + 2.2, y - 14 - i * 14, 8, true);
//   });

//   const shipX = margin + stripW + 4;
//   drawText("1.", shipX, y - 12, 8, true);
//   drawText((data.shipperName || "").toUpperCase(), shipX + 12, y - 12, 8, true);

//   let sy = y - 24;
//   wrapText(data.shipperAddress || "", 30)
//     .slice(0, 5)
//     .forEach((line) => {
//       drawText(line.toUpperCase(), shipX, sy, 7);
//       sy -= 9.5;
//     });
//   extraLocationLines(
//     data.shipperAddress || "",
//     data.shipperCity,
//     data.shipperState,
//     data.shipperPincode,
//   ).forEach((line) => {
//     if (sy < y - topH + 14) return;
//     drawText(line.toUpperCase(), shipX, sy, 7);
//     sy -= 9.5;
//   });
//   if (data.shipperPhone && sy >= y - topH + 11) {
//     drawText(String(data.shipperPhone), shipX, sy, 7);
//   }

//   /* --- Consignee (middle) --- */
//   cell(margin + leftW, y - topH, midW, topH);
//   cell(margin + leftW, y - topH, stripW, topH, 0.55, lightGray);
//   ["C", "O", "N", "S", "I", "G", "N", "E", "E"].forEach((ch, i) => {
//     drawText(ch, margin + leftW + 2, y - 13 - i * 11.5, 7.5, true);
//   });

//   const consX = margin + leftW + stripW + 4;
//   drawText("2.", consX, y - 12, 8, true);
//   drawText(
//     (data.consigneeName || "").toUpperCase(),
//     consX + 12,
//     y - 12,
//     8,
//     true,
//   );

//   let cy = y - 24;
//   wrapText(data.consigneeAddress || "", 30)
//     .slice(0, 4)
//     .forEach((line) => {
//       drawText(line.toUpperCase(), consX, cy, 7);
//       cy -= 9.5;
//     });
//   extraLocationLines(
//     data.consigneeAddress || "",
//     data.consigneeCity,
//     data.consigneeState,
//     data.consigneePincode,
//   ).forEach((line) => {
//     if (cy < y - topH + 32) return;
//     drawText(line.toUpperCase(), consX, cy, 7);
//     cy -= 9.5;
//   });
//   if (cy >= y - topH + 22) {
//     drawText(
//       `Country : ${(data.consigneeCountry || "—").toUpperCase()}`,
//       consX,
//       cy,
//       7,
//     );
//     cy -= 9.5;
//   }
//   if (data.consigneePhone && cy >= y - topH + 11) {
//     drawText(String(data.consigneePhone), consX, cy, 7);
//   }

//   /* --- Service type (right) — stacked rows like sample --- */
//   const svcX = margin + leftW + midW;
//   cell(svcX, y - topH, rightW, topH);

//   // Header band
//   cell(svcX, y - 14, rightW, 14, 0.7, lightGray);
//   drawText("SERVICE TYPE", svcX + 4, y - 10, 6.5, true);

//   // Service / product line
//   cell(svcX, y - 32, rightW, 18);
//   const serviceLine = (
//     data.serviceType ||
//     data.product ||
//     "INTERNATIONAL PRIORITY"
//   ).toUpperCase();
//   drawText(serviceLine, svcX + 4, y - 26, 7.5, true);

//   // Vendor / carrier
//   cell(svcX, y - 50, rightW, 18);
//   drawText(
//     (data.vendor || "—").toUpperCase(),
//     svcX + 4,
//     y - 44,
//     7,
//   );

//   // Contents
//   cell(svcX, y - 88, rightW, 38);
//   drawText("FULL DESCRIPTION OF CONTENTS :-", svcX + 4, y - 58, 6, true);
//   wrapText(contentText.toUpperCase(), 28)
//     .slice(0, 2)
//     .forEach((line, i) => {
//       drawText(line, svcX + 4, y - 70 - i * 10, 7.5);
//     });

//   // Special instructions
//   cell(svcX, y - topH, rightW, topH - 88);
//   drawText("SPECIAL INSTRUCTIONS :-", svcX + 4, y - 98, 6, true);
//   wrapText((data.specialInstructions || "").toUpperCase(), 28)
//     .slice(0, 2)
//     .forEach((line, i) => {
//       drawText(line, svcX + 4, y - 110 - i * 10, 7);
//     });

//   y -= topH;

//   /* ================================================================
//    * 4) BOTTOM GRID: AUTH/POD | DECLARED+CSB+BARCODE | SIZE & WEIGHT
//    * ================================================================ */
//   const bottomH = 220;

//   /* --- Bottom-left: sender auth + logo + POD --- */
//   cell(margin, y - bottomH, leftW, bottomH);

//   drawText(
//     "3.  SENDER'S AUTHORISATION AND SIGNATURE",
//     margin + 3,
//     y - 11,
//     5.8,
//     true,
//   );

//   // Logo area (no outer border around image — matches sample logo placement)
//   const logoW = 128;
//   const logoH = 44;
//   const logoX = margin + (leftW - logoW) / 2;
//   const logoY = y - 64;
//   drawSreshtaLogo(page, logoImage, bold, font, logoX, logoY, logoW, logoH);

//   drawText("SENDER'S SIGNATURE", margin + 5, y - 82, 7.5);
//   page.drawLine({
//     start: { x: margin + 5, y: y - 94 },
//     end: { x: margin + leftW - 6, y: y - 94 },
//     thickness: 0.7,
//     color: black,
//   });
//   drawText("DATE", margin + 5, y - 108, 7.5);

//   drawText("PROOF OF DELIVERY (POD)", margin + 5, y - 132, 8, true);
//   drawText("RECEIVER'S SIGNATURE", margin + 5, y - 148, 7.5);
//   page.drawLine({
//     start: { x: margin + 5, y: y - 160 },
//     end: { x: margin + leftW - 6, y: y - 160 },
//     thickness: 0.7,
//     color: black,
//   });

//   drawText("DATE    /     /", margin + 5, y - 178, 6.5);
//   drawText("TIME     AM/PM", margin + 88, y - 178, 6.5);
//   drawText(
//     "(CAPITAL LETTERS VERY IMPORTANT)",
//     margin + 5,
//     y - 198,
//     5,
//     false,
//     gray,
//   );

//   /* --- Bottom-middle: declared value + CSB + barcode --- */
//   const midX = margin + leftW;
//   cell(midX, y - bottomH, midW, bottomH);

//   // Declared value box
//   cell(midX, y - 52, midW, 52, 0.95);
//   drawText("DECLARED VALUE FOR", midX + 14, y - 16, 7.5, true);
//   drawText("CUSTOMS AND CURRENCY", midX + 14, y - 28, 7.5, true);
//   const declaredLabel =
//     declared > 0 ? `${declared.toFixed(0)} ${currency}` : `0 ${currency}`;
//   const declaredTw = bold.widthOfTextAtSize(declaredLabel, 13);
//   drawText(declaredLabel, midX + (midW - declaredTw) / 2, y - 46, 13, true);

//   // CSB box (bold border, centered) — sample: CSB4
//   const csbBoxW = 118;
//   const csbBoxH = 36;
//   const csbBoxX = midX + (midW - csbBoxW) / 2;
//   const csbBoxY = y - 108;
//   cell(csbBoxX, csbBoxY, csbBoxW, csbBoxH, 2.0);
//   const csbTw = bold.widthOfTextAtSize(csb, 16);
//   drawText(csb, csbBoxX + (csbBoxW - csbTw) / 2, csbBoxY + 12, 16, true);

//   // Barcode (Code-128) + human-readable AWB under bars
//   const barH = 42;
//   const barY = y - bottomH + 32;
//   const barModule = 1.0;
//   const pattern = encodeCode128B(awb);
//   const quiet = barModule * 10;
//   const barTotalW = pattern.length * barModule + quiet * 2;
//   const barX = midX + Math.max(4, (midW - barTotalW) / 2);
//   drawBarcode(page, barX, barY, barH, awb, barModule);

//   const awbTw = bold.widthOfTextAtSize(awb, 11);
//   drawText(awb, midX + (midW - awbTw) / 2, barY - 14, 11, true);

//   /* --- Bottom-right: SIZE & WEIGHT (exact sample rows) --- */
//   const szX = margin + leftW + midW;
//   cell(szX, y - bottomH, rightW, bottomH);

//   // Title band
//   cell(szX, y - 16, rightW, 16, 0.7, lightGray);
//   drawText("SIZE & WEIGHT", szX + 5, y - 12, 7, true);

//   // Pieces row
//   cell(szX, y - 42, rightW, 26);
//   drawText("Pieces :", szX + 6, y - 33, 9);
//   drawText(String(pieces), szX + 68, y - 33, 11, true);

//   // Weight row
//   cell(szX, y - 68, rightW, 26);
//   drawText("Weight", szX + 6, y - 59, 9);
//   drawText(actualW.toFixed(3), szX + 58, y - 59, 11, true);
//   drawText("Kgs", szX + rightW - 30, y - 59, 9);

//   // Dimensions row (e.g. 37*37*24*1=7)
//   cell(szX, y - 112, rightW, 44);
//   const dim = String(data.dimensions || "").trim();
//   if (dim) {
//     drawText(dim, szX + 6, y - 92, 9);
//   }

//   // Charged weight (large)
//   cell(szX, y - bottomH, rightW, bottomH - 112);
//   drawText("CHARGED WEIGHT", szX + 6, y - 132, 8, true);
//   const chargeLabel = chargeW.toFixed(2);
//   const chargeTw = bold.widthOfTextAtSize(chargeLabel, 18);
//   drawText(
//     chargeLabel,
//     szX + (rightW - chargeTw) / 2,
//     y - 172,
//     18,
//     true,
//   );

//   return pdf.save();
// }

// import "server-only";

// import { readFileSync, existsSync } from "fs";
// import { join } from "path";
// import {
//   PDFDocument,
//   StandardFonts,
//   rgb,
//   type PDFPage,
//   type PDFImage,
//   type PDFFont,
// } from "pdf-lib";

// /* ------------------------------------------------------------------ */
// /*  Types                                                              */
// /* ------------------------------------------------------------------ */

// export type AwbLabelData = {
//   awb: string;
//   accountCode?: string;
//   bookDate?: string;
//   printedAt?: string;
//   shipperName: string;
//   shipperAddress: string;
//   shipperCity?: string;
//   shipperState?: string;
//   shipperPincode?: string;
//   shipperPhone?: string;
//   shipperCountry?: string;
//   consigneeName: string;
//   consigneeAddress: string;
//   consigneeCity?: string;
//   consigneeState?: string;
//   consigneePincode?: string;
//   consigneePhone?: string;
//   consigneeCountry?: string;
//   serviceType?: string;
//   product?: string;
//   vendor?: string;
//   customerReference?: string;
//   pieces: number;
//   actualWeight: number;
//   chargeableWeight: number;
//   dimensions?: string;
//   declaredValue?: number;
//   currency?: string;
//   content?: string;
//   csbType?: string;
//   specialInstructions?: string;
//   origin?: string;
// };

// /* ------------------------------------------------------------------ */
// /*  Code-128 Subset B                                                  */
// /* ------------------------------------------------------------------ */

// const CODE128_PATTERNS: string[] = [
//   "11011001100", "11001101100", "11001100110", "10010011000",
//   "10010001100", "10001001100", "10011001000", "10011000100",
//   "10001100100", "11001001000", "11001000100", "11000100100",
//   "10110011100", "10011011100", "10011001110", "10111001100",
//   "10011101100", "10011100110", "11001110010", "11001011100",
//   "11001001110", "11011100100", "11001110100", "11101101110",
//   "11101001100", "11100101100", "11100100110", "11101100100",
//   "11100110100", "11100110010", "11011011000", "11011000110",
//   "11000110110", "10100011000", "10001011000", "10001000110",
//   "10110001000", "10001101000", "10001100010", "11010001000",
//   "11000101000", "11000100010", "10110111000", "10110001110",
//   "10001101110", "10111011000", "10111000110", "10001110110",
//   "11101110110", "11010001110", "11000101110", "11011101000",
//   "11011100010", "11011101110", "11101011000", "11101000110",
//   "11100010110", "11101101000", "11101100010", "11100011010",
//   "11101111010", "11001000010", "11110001010", "10100110000",
//   "10100001100", "10010110000", "10010000110", "10000101100",
//   "10000100110", "10110010000", "10110000100", "10011010000",
//   "10011000010", "10000110100", "10000110010", "11000010010",
//   "11001010000", "11110111010", "11000010100", "10001111010",
//   "10100111100", "10010111100", "10010011110", "10111100100",
//   "10011110100", "10011110010", "11110100100", "11110010100",
//   "11110010010", "11011011110", "11011110110", "11110110110",
//   "10101111000", "10100011110", "10001011110", "10111101000",
//   "10111100010", "11110101000", "11110100010", "10111011110",
//   "10111101110", "11101011110", "11110111010",
// ];

// const START_B = 104;
// const STOP_PATTERN = "1100011101011";

// function getPattern(value: number): string {
//   if (value >= 0 && value < CODE128_PATTERNS.length) {
//     return CODE128_PATTERNS[value]!;
//   }
//   if (value === 104) return "11010010000";
//   if (value === 105) return "11010011100";
//   if (value === 106) return "11000111010";
//   return "11011001100";
// }

// /** Clean AWB for barcode: printable ASCII only (Code-128B). */
// function sanitizeBarcodeText(text: string): string {
//   return String(text || "")
//     .trim()
//     .toUpperCase()
//     .split("")
//     .filter((ch) => {
//       const code = ch.charCodeAt(0);
//       return code >= 32 && code <= 126;
//     })
//     .join("");
// }

// function encodeCode128B(text: string): string {
//   const clean = sanitizeBarcodeText(text);
//   if (!clean) return getPattern(START_B) + STOP_PATTERN;

//   const values: number[] = [START_B];
//   for (let i = 0; i < clean.length; i++) {
//     values.push(clean.charCodeAt(i)! - 32);
//   }

//   let checksum = values[0]!;
//   for (let i = 1; i < values.length; i++) {
//     checksum += values[i]! * i;
//   }
//   checksum %= 103;
//   values.push(checksum);

//   let pattern = "";
//   for (const v of values) pattern += getPattern(v);
//   pattern += STOP_PATTERN;
//   return pattern;
// }

// /**
//  * Draws Code-128B bars. Returns total drawn width (including quiet zones).
//  * moduleWidth ~1.2–1.5 pt scans reliably on phone cameras.
//  */
// function drawBarcode(
//   page: PDFPage,
//   x: number,
//   y: number,
//   barHeight: number,
//   text: string,
//   moduleWidth = 1.25,
// ): number {
//   const pattern = encodeCode128B(text);
//   const quietZone = moduleWidth * 10; // ≥10 modules each side
//   let cx = x + quietZone;

//   for (let i = 0; i < pattern.length; i++) {
//     if (pattern[i] === "1") {
//       page.drawRectangle({
//         x: cx,
//         y,
//         width: moduleWidth,
//         height: barHeight,
//         color: rgb(0, 0, 0),
//       });
//     }
//     cx += moduleWidth;
//   }

//   return cx + quietZone - x;
// }

// /**
//  * Human-readable AWB under barcode — spaced digits across barcode width
//  * (matches sample: 6 0 0 3 3 5 8 3 7 1).
//  */
// function drawSpacedBarcodeText(
//   page: PDFPage,
//   text: string,
//   centerX: number,
//   y: number,
//   targetWidth: number,
//   font: PDFFont,
//   size: number,
// ) {
//   const chars = sanitizeBarcodeText(text).split("").filter(Boolean);
//   if (!chars.length) return;

//   const charWidths = chars.map((c) => font.widthOfTextAtSize(c, size));
//   const totalCharW = charWidths.reduce((a, b) => a + b, 0);

//   let gap = chars.length > 1 ? (targetWidth - totalCharW) / (chars.length - 1) : 0;
//   gap = Math.min(Math.max(gap, 2), 14);

//   const usedW =
//     totalCharW + (chars.length > 1 ? gap * (chars.length - 1) : 0);
//   let x = centerX - usedW / 2;

//   for (let i = 0; i < chars.length; i++) {
//     page.drawText(chars[i]!, {
//       x,
//       y,
//       size,
//       font,
//       color: rgb(0, 0, 0),
//     });
//     x += charWidths[i]! + gap;
//   }
// }

// /* ------------------------------------------------------------------ */
// /*  Text helpers                                                       */
// /* ------------------------------------------------------------------ */

// function wrapText(text: string, maxChars: number): string[] {
//   if (!text) return [];
//   const words = String(text).split(/\s+/).filter(Boolean);
//   const lines: string[] = [];
//   let current = "";

//   for (const word of words) {
//     const next = current ? `${current} ${word}` : word;
//     if (next.length <= maxChars) {
//       current = next;
//     } else {
//       if (current) lines.push(current);
//       if (word.length > maxChars) {
//         let rest = word;
//         while (rest.length > maxChars) {
//           lines.push(rest.slice(0, maxChars));
//           rest = rest.slice(maxChars);
//         }
//         current = rest;
//       } else {
//         current = word;
//       }
//     }
//   }
//   if (current) lines.push(current);
//   return lines;
// }

// /** Header left date: DD-MM-YYYY (sample: 20-06-2026) */
// function formatDateOnly(value?: string): string {
//   if (value) {
//     const m = value.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/);
//     if (m) {
//       const d = m[1]!.padStart(2, "0");
//       const mo = m[2]!.padStart(2, "0");
//       const y = m[3]!.length === 2 ? `20${m[3]}` : m[3]!;
//       return `${d}-${mo}-${y}`;
//     }
//     const parsed = new Date(value);
//     if (!Number.isNaN(parsed.getTime())) {
//       const pad = (n: number) => String(n).padStart(2, "0");
//       return `${pad(parsed.getDate())}-${pad(parsed.getMonth() + 1)}-${parsed.getFullYear()}`;
//     }
//   }
//   const d = new Date();
//   const pad = (n: number) => String(n).padStart(2, "0");
//   return `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()}`;
// }

// /** Printed on: DD/MM/YYYY HH:mm:ss (sample: 20/06/2026 15:41:44) */
// function formatPrintedAt(value?: string): string {
//   if (value) {
//     const parsed = new Date(value);
//     if (!Number.isNaN(parsed.getTime())) {
//       const pad = (n: number) => String(n).padStart(2, "0");
//       return `${pad(parsed.getDate())}/${pad(parsed.getMonth() + 1)}/${parsed.getFullYear()} ${pad(parsed.getHours())}:${pad(parsed.getMinutes())}:${pad(parsed.getSeconds())}`;
//     }
//     return value;
//   }
//   const d = new Date();
//   const pad = (n: number) => String(n).padStart(2, "0");
//   return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
// }

// function extraLocationLines(
//   address: string,
//   city?: string,
//   state?: string,
//   pincode?: string,
// ): string[] {
//   const hay = address.toLowerCase();
//   const out: string[] = [];
//   const pushIfNew = (v?: string) => {
//     const t = String(v || "").trim();
//     if (!t) return;
//     if (hay.includes(t.toLowerCase())) return;
//     out.push(t);
//   };
//   pushIfNew(city);
//   pushIfNew(state);
//   pushIfNew(pincode);
//   return out;
// }

// function getTrackingUrl(): string {
//   const base = (
//     process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
//   ).replace(/\/$/, "");
//   return `${base}/logistics/track`;
// }

// function loadSreshtaLogoBytes(): Uint8Array | null {
//   const candidates = [
//     join(process.cwd(), "public", "images", "sreshta-logistics-logo.png"),
//     join(process.cwd(), "public", "images", "sreshta-logistics-logo.PNG"),
//     join(process.cwd(), "public", "sreshta-logistics-logo.png"),
//   ];
//   for (const p of candidates) {
//     if (existsSync(p)) return readFileSync(p);
//   }
//   return null;
// }

// function drawSreshtaLogo(
//   page: PDFPage,
//   logoImage: PDFImage | null,
//   bold: PDFFont,
//   font: PDFFont,
//   x: number,
//   y: number,
//   boxW: number,
//   boxH: number,
// ) {
//   const navy = rgb(0.024, 0.157, 0.298);
//   const teal = rgb(0.03, 0.5, 0.53);

//   if (logoImage) {
//     const scale = Math.min(
//       (boxW * 0.95) / logoImage.width,
//       (boxH * 0.95) / logoImage.height,
//     );
//     const drawW = logoImage.width * scale;
//     const drawH = logoImage.height * scale;
//     page.drawImage(logoImage, {
//       x: x + (boxW - drawW) / 2,
//       y: y + (boxH - drawH) / 2,
//       width: drawW,
//       height: drawH,
//     });
//     return;
//   }

//   page.drawText("SRESHTA", {
//     x: x + 8,
//     y: y + boxH / 2 + 4,
//     size: 13,
//     font: bold,
//     color: navy,
//   });
//   page.drawText("LOGISTICS", {
//     x: x + 8,
//     y: y + boxH / 2 - 10,
//     size: 9,
//     font,
//     color: teal,
//   });
// }

// /* ------------------------------------------------------------------ */
// /*  Main generator — layout matches sample AWB label                   */
// /* ------------------------------------------------------------------ */

// export async function generateAwbLabelPdf(
//   data: AwbLabelData,
// ): Promise<Uint8Array> {
//   const pdf = await PDFDocument.create();
//   // A4 portrait
//   const page = pdf.addPage([595.28, 841.89]);
//   const { width, height } = page.getSize();

//   const font = await pdf.embedFont(StandardFonts.Helvetica);
//   const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
//   const ocrFont = await pdf.embedFont(StandardFonts.CourierBold);

//   let logoImage: PDFImage | null = null;
//   try {
//     const bytes = loadSreshtaLogoBytes();
//     if (bytes) logoImage = await pdf.embedPng(bytes);
//   } catch (err) {
//     console.warn("Could not embed Sreshta logistics logo:", err);
//   }

//   const margin = 12;
//   const black = rgb(0, 0, 0);
//   const gray = rgb(0.3, 0.3, 0.3);
//   const lightGray = rgb(0.92, 0.92, 0.92);
//   const linkBlue = rgb(0.0, 0.2, 0.75);

//   const pieces = Number(data.pieces) > 0 ? Number(data.pieces) : 1;
//   const actualW = Number(data.actualWeight) || 0;
//   const chargeW = Math.max(Number(data.chargeableWeight) || 0, actualW);
//   const declared = Number(data.declaredValue) || 0;
//   const currency = (data.currency || "INR").toUpperCase();
//   const contentText = (data.content || "").trim() || "—";
//   const csb = (data.csbType || "CSB4").toUpperCase();
//   const awb = String(data.awb || "").trim().toUpperCase();
//   const trackingUrl = getTrackingUrl();

//   const drawText = (
//     text: string,
//     x: number,
//     y: number,
//     size = 8,
//     isBold = false,
//     color = black,
//   ) => {
//     const t = String(text ?? "");
//     if (!t) return;
//     page.drawText(t, {
//       x,
//       y,
//       size,
//       font: isBold ? bold : font,
//       color,
//     });
//   };

//   /** Table cell: border always; optional fill */
//   const cell = (
//     x: number,
//     y: number,
//     w: number,
//     h: number,
//     borderWidth = 0.9,
//     fill?: ReturnType<typeof rgb>,
//   ) => {
//     page.drawRectangle({
//       x,
//       y,
//       width: w,
//       height: h,
//       borderColor: black,
//       borderWidth,
//       color: fill,
//     });
//   };

//   const contentW = width - margin * 2;
//   let y = height - margin;

//   /* ================================================================
//    * 1) HEADER BAR
//    * ================================================================ */
//   const headerH = 15;
//   cell(margin, y - headerH, contentW, headerH, 0.75);

//   drawText(formatDateOnly(data.printedAt || data.bookDate), margin + 3, y - 10.5, 6.5);
//   drawText(trackingUrl, margin + 68, y - 10.5, 6.5, false, linkBlue);

//   const title = "Shipment Label";
//   const titleW = bold.widthOfTextAtSize(title, 8.5);
//   drawText(title, margin + (contentW - titleW) / 2, y - 10.5, 8.5, true);

//   const printed = `Printed on  ${formatPrintedAt(data.printedAt)}`;
//   const printedW = font.widthOfTextAtSize(printed, 6.5);
//   drawText(printed, margin + contentW - printedW - 4, y - 10.5, 6.5);

//   y -= headerH;

//   /* ================================================================
//    * 2) ACCOUNT | ORIGIN + AWB | CUSTOMER REFERENCE
//    * ================================================================ */
//   const row1H = 34;
//   const colAcc = 148;
//   const colOrigin = 178;
//   const colRef = contentW - colAcc - colOrigin;

//   cell(margin, y - row1H, colAcc, row1H);
//   drawText("1.  ACCOUNT NUMBER", margin + 4, y - 11, 6.5, true);
//   drawText(
//     (data.accountCode || "—").toUpperCase(),
//     margin + 4,
//     y - 27,
//     12,
//     true,
//   );

//   cell(margin + colAcc, y - row1H, colOrigin, row1H);
//   drawText(
//     (data.origin || "—").toUpperCase(),
//     margin + colAcc + 6,
//     y - 12,
//     11,
//     true,
//   );
//   drawText(awb || "—", margin + colAcc + 6, y - 28, 11, true);

//   cell(margin + colAcc + colOrigin, y - row1H, colRef, row1H);
//   drawText(
//     "CUSTOMER REFERENCE",
//     margin + colAcc + colOrigin + 5,
//     y - 11,
//     6.5,
//     true,
//   );
//   drawText(
//     (data.customerReference || "SRESHTA COURIERS").toUpperCase(),
//     margin + colAcc + colOrigin + 5,
//     y - 27,
//     10,
//     true,
//   );

//   y -= row1H;

//   /* ================================================================
//    * 3) TOP GRID: SHIPPER | CONSIGNEE | SERVICE TYPE
//    * ================================================================ */
//   const leftW = 186;
//   const midW = 196;
//   const rightW = contentW - leftW - midW;
//   const topH = 124;
//   const stripW = 11;

//   cell(margin, y - topH, leftW, topH);
//   cell(margin, y - topH, stripW, topH, 0.55, lightGray);
//   ["S", "H", "I", "P", "P", "E", "R"].forEach((ch, i) => {
//     drawText(ch, margin + 2.2, y - 14 - i * 14, 8, true);
//   });

//   const shipX = margin + stripW + 4;
//   drawText("1.", shipX, y - 12, 8, true);
//   drawText((data.shipperName || "").toUpperCase(), shipX + 12, y - 12, 8, true);

//   let sy = y - 24;
//   wrapText(data.shipperAddress || "", 30)
//     .slice(0, 5)
//     .forEach((line) => {
//       drawText(line.toUpperCase(), shipX, sy, 7);
//       sy -= 9.5;
//     });
//   extraLocationLines(
//     data.shipperAddress || "",
//     data.shipperCity,
//     data.shipperState,
//     data.shipperPincode,
//   ).forEach((line) => {
//     if (sy < y - topH + 14) return;
//     drawText(line.toUpperCase(), shipX, sy, 7);
//     sy -= 9.5;
//   });
//   if (data.shipperPhone && sy >= y - topH + 11) {
//     drawText(String(data.shipperPhone), shipX, sy, 7);
//   }

//   cell(margin + leftW, y - topH, midW, topH);
//   cell(margin + leftW, y - topH, stripW, topH, 0.55, lightGray);
//   ["C", "O", "N", "S", "I", "G", "N", "E", "E"].forEach((ch, i) => {
//     drawText(ch, margin + leftW + 2, y - 13 - i * 11.5, 7.5, true);
//   });

//   const consX = margin + leftW + stripW + 4;
//   drawText("2.", consX, y - 12, 8, true);
//   drawText(
//     (data.consigneeName || "").toUpperCase(),
//     consX + 12,
//     y - 12,
//     8,
//     true,
//   );

//   let cy = y - 24;
//   wrapText(data.consigneeAddress || "", 30)
//     .slice(0, 4)
//     .forEach((line) => {
//       drawText(line.toUpperCase(), consX, cy, 7);
//       cy -= 9.5;
//     });
//   extraLocationLines(
//     data.consigneeAddress || "",
//     data.consigneeCity,
//     data.consigneeState,
//     data.consigneePincode,
//   ).forEach((line) => {
//     if (cy < y - topH + 32) return;
//     drawText(line.toUpperCase(), consX, cy, 7);
//     cy -= 9.5;
//   });
//   if (cy >= y - topH + 22) {
//     drawText(
//       `Country : ${(data.consigneeCountry || "—").toUpperCase()}`,
//       consX,
//       cy,
//       7,
//     );
//     cy -= 9.5;
//   }
//   if (data.consigneePhone && cy >= y - topH + 11) {
//     drawText(String(data.consigneePhone), consX, cy, 7);
//   }

//   const svcX = margin + leftW + midW;
//   cell(svcX, y - topH, rightW, topH);

//   cell(svcX, y - 14, rightW, 14, 0.7, lightGray);
//   drawText("SERVICE TYPE", svcX + 4, y - 10, 6.5, true);

//   cell(svcX, y - 32, rightW, 18);
//   const serviceLine = (
//     data.serviceType ||
//     data.product ||
//     "INTERNATIONAL PRIORITY"
//   ).toUpperCase();
//   drawText(serviceLine, svcX + 4, y - 26, 7.5, true);

//   cell(svcX, y - 50, rightW, 18);
//   drawText(
//     (data.vendor || "—").toUpperCase(),
//     svcX + 4,
//     y - 44,
//     7,
//   );

//   cell(svcX, y - 88, rightW, 38);
//   drawText("FULL DESCRIPTION OF CONTENTS :-", svcX + 4, y - 58, 6, true);
//   wrapText(contentText.toUpperCase(), 28)
//     .slice(0, 2)
//     .forEach((line, i) => {
//       drawText(line, svcX + 4, y - 70 - i * 10, 7.5);
//     });

//   cell(svcX, y - topH, rightW, topH - 88);
//   drawText("SPECIAL INSTRUCTIONS :-", svcX + 4, y - 98, 6, true);
//   wrapText((data.specialInstructions || "").toUpperCase(), 28)
//     .slice(0, 2)
//     .forEach((line, i) => {
//       drawText(line, svcX + 4, y - 110 - i * 10, 7);
//     });

//   y -= topH;

//   /* ================================================================
//    * 4) BOTTOM GRID: AUTH/POD | DECLARED+CSB+BARCODE | SIZE & WEIGHT
//    * ================================================================ */
//   const bottomH = 220;

//   cell(margin, y - bottomH, leftW, bottomH);

//   drawText(
//     "3.  SENDER'S AUTHORISATION AND SIGNATURE",
//     margin + 3,
//     y - 11,
//     5.8,
//     true,
//   );

//   const logoW = 128;
//   const logoH = 44;
//   const logoX = margin + (leftW - logoW) / 2;
//   const logoY = y - 64;
//   drawSreshtaLogo(page, logoImage, bold, font, logoX, logoY, logoW, logoH);

//   drawText("SENDER'S SIGNATURE", margin + 5, y - 82, 7.5);
//   page.drawLine({
//     start: { x: margin + 5, y: y - 94 },
//     end: { x: margin + leftW - 6, y: y - 94 },
//     thickness: 0.7,
//     color: black,
//   });
//   drawText("DATE", margin + 5, y - 108, 7.5);

//   drawText("PROOF OF DELIVERY (POD)", margin + 5, y - 132, 8, true);
//   drawText("RECEIVER'S SIGNATURE", margin + 5, y - 148, 7.5);
//   page.drawLine({
//     start: { x: margin + 5, y: y - 160 },
//     end: { x: margin + leftW - 6, y: y - 160 },
//     thickness: 0.7,
//     color: black,
//   });

//   drawText("DATE    /     /", margin + 5, y - 178, 6.5);
//   drawText("TIME     AM/PM", margin + 88, y - 178, 6.5);
//   drawText(
//     "(CAPITAL LETTERS VERY IMPORTANT)",
//     margin + 5,
//     y - 198,
//     5,
//     false,
//     gray,
//   );

//   const midX = margin + leftW;
//   cell(midX, y - bottomH, midW, bottomH);

//   cell(midX, y - 52, midW, 52, 0.95);
//   drawText("DECLARED VALUE FOR", midX + 14, y - 16, 7.5, true);
//   drawText("CUSTOMS AND CURRENCY", midX + 14, y - 28, 7.5, true);
//   const declaredLabel =
//     declared > 0 ? `${declared.toFixed(0)} ${currency}` : `0 ${currency}`;
//   const declaredTw = bold.widthOfTextAtSize(declaredLabel, 13);
//   drawText(declaredLabel, midX + (midW - declaredTw) / 2, y - 46, 13, true);

//   const csbBoxW = 118;
//   const csbBoxH = 36;
//   const csbBoxX = midX + (midW - csbBoxW) / 2;
//   const csbBoxY = y - 108;
//   cell(csbBoxX, csbBoxY, csbBoxW, csbBoxH, 2.0);
//   const csbTw = bold.widthOfTextAtSize(csb, 16);
//   drawText(csb, csbBoxX + (csbBoxW - csbTw) / 2, csbBoxY + 12, 16, true);

//   // Barcode (Code-128B) — encodes exact AWB; scannable module width
//   const barcodePayload = sanitizeBarcodeText(awb);
//   const barH = 44;
//   const barY = y - bottomH + 34;
//   const barModule = 1.3;

//   const pattern = encodeCode128B(barcodePayload);
//   const quiet = barModule * 10;
//   let module = barModule;
//   let totalW = pattern.length * module + quiet * 2;
//   const maxBarW = midW - 12;
//   if (totalW > maxBarW) {
//     module = (maxBarW - quiet * 2) / Math.max(pattern.length, 1);
//     module = Math.max(0.9, module);
//     totalW = pattern.length * module + quiet * 2;
//   }

//   const quietActual = module * 10;
//   const barX = midX + (midW - totalW) / 2;
//   const drawnW = drawBarcode(
//     page,
//     barX,
//     barY,
//     barH,
//     barcodePayload,
//     module,
//   );

//   // Human-readable digits under bars (spaced like sample: 6 0 0 3 3 5 8 3 7 1)
//   const bodyW = Math.max(40, drawnW - quietActual * 2);
//   drawSpacedBarcodeText(
//     page,
//     barcodePayload,
//     midX + midW / 2,
//     barY - 13,
//     bodyW,
//     ocrFont,
//     11,
//   );

//   const szX = margin + leftW + midW;
//   cell(szX, y - bottomH, rightW, bottomH);

//   cell(szX, y - 16, rightW, 16, 0.7, lightGray);
//   drawText("SIZE & WEIGHT", szX + 5, y - 12, 7, true);

//   cell(szX, y - 42, rightW, 26);
//   drawText("Pieces :", szX + 6, y - 33, 9);
//   drawText(String(pieces), szX + 68, y - 33, 11, true);

//   cell(szX, y - 68, rightW, 26);
//   drawText("Weight", szX + 6, y - 59, 9);
//   drawText(actualW.toFixed(3), szX + 58, y - 59, 11, true);
//   drawText("Kgs", szX + rightW - 30, y - 59, 9);

//   cell(szX, y - 112, rightW, 44);
//   const dim = String(data.dimensions || "").trim();
//   if (dim) {
//     drawText(dim, szX + 6, y - 92, 9);
//   }

//   cell(szX, y - bottomH, rightW, bottomH - 112);
//   drawText("CHARGED WEIGHT", szX + 6, y - 132, 8, true);
//   const chargeLabel = chargeW.toFixed(2);
//   const chargeTw = bold.widthOfTextAtSize(chargeLabel, 18);
//   drawText(
//     chargeLabel,
//     szX + (rightW - chargeTw) / 2,
//     y - 172,
//     18,
//     true,
//   );

//   return pdf.save();
// }

import "server-only";

import { readFileSync, existsSync } from "fs";
import { join } from "path";
import {
  PDFDocument,
  StandardFonts,
  rgb,
  type PDFPage,
  type PDFImage,
  type PDFFont,
} from "pdf-lib";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

// export type AwbLabelData = {
//   awb: string;
//   accountCode?: string;
//   bookDate?: string;
//   printedAt?: string;
//   shipperName: string;
//   shipperAddress: string;
//   shipperCity?: string;
//   shipperState?: string;
//   shipperPincode?: string;
//   shipperPhone?: string;
//   shipperCountry?: string;
//   consigneeName: string;
//   consigneeAddress: string;
//   consigneeCity?: string;
//   consigneeState?: string;
//   consigneePincode?: string;
//   consigneePhone?: string;
//   consigneeCountry?: string;
//   serviceType?: string;
//   product?: string;
//   vendor?: string;
//   customerReference?: string;
//   pieces: number;
//   actualWeight: number;
//   chargeableWeight: number;
//   dimensions?: string;
//   declaredValue?: number;
//   currency?: string;
//   content?: string;
//   csbType?: string;
//   specialInstructions?: string;
//   origin?: string;
// };


export type AwbLabelData = {
  awb: string;
  accountCode?: string;
  bookDate?: string;
  printedAt?: string;
  shipperName: string;
  shipperAddress: string;
  shipperCity?: string;
  shipperState?: string;
  shipperPincode?: string;
  shipperPhone?: string;
  shipperCountry?: string;
  consigneeName: string;
  consigneeAddress: string;
  consigneeCity?: string;
  consigneeState?: string;
  consigneePincode?: string;
  consigneePhone?: string;
  consigneeMobile?: string; // NEW
  consigneeCountry?: string;
  serviceType?: string;
  product?: string;
  vendor?: string;
  customerReference?: string;
  pieces: number;
  actualWeight: number;
  chargeableWeight: number;
  dimensions?: string;
  declaredValue?: number;
  currency?: string;
  content?: string;
  csbType?: string;
  specialInstructions?: string;
  origin?: string;
};


/* ------------------------------------------------------------------ */
/*  Code-128 Subset B                                                  */
/* ------------------------------------------------------------------ */

const CODE128_PATTERNS: string[] = [
  "11011001100", "11001101100", "11001100110", "10010011000",
  "10010001100", "10001001100", "10011001000", "10011000100",
  "10001100100", "11001001000", "11001000100", "11000100100",
  "10110011100", "10011011100", "10011001110", "10111001100",
  "10011101100", "10011100110", "11001110010", "11001011100",
  "11001001110", "11011100100", "11001110100", "11101101110",
  "11101001100", "11100101100", "11100100110", "11101100100",
  "11100110100", "11100110010", "11011011000", "11011000110",
  "11000110110", "10100011000", "10001011000", "10001000110",
  "10110001000", "10001101000", "10001100010", "11010001000",
  "11000101000", "11000100010", "10110111000", "10110001110",
  "10001101110", "10111011000", "10111000110", "10001110110",
  "11101110110", "11010001110", "11000101110", "11011101000",
  "11011100010", "11011101110", "11101011000", "11101000110",
  "11100010110", "11101101000", "11101100010", "11100011010",
  "11101111010", "11001000010", "11110001010", "10100110000",
  "10100001100", "10010110000", "10010000110", "10000101100",
  "10000100110", "10110010000", "10110000100", "10011010000",
  "10011000010", "10000110100", "10000110010", "11000010010",
  "11001010000", "11110111010", "11000010100", "10001111010",
  "10100111100", "10010111100", "10010011110", "10111100100",
  "10011110100", "10011110010", "11110100100", "11110010100",
  "11110010010", "11011011110", "11011110110", "11110110110",
  "10101111000", "10100011110", "10001011110", "10111101000",
  "10111100010", "11110101000", "11110100010", "10111011110",
  "10111101110", "11101011110", "11110111010",
];

const START_B = 104;
const STOP_PATTERN = "1100011101011";

function getPattern(value: number): string {
  if (value >= 0 && value < CODE128_PATTERNS.length) {
    return CODE128_PATTERNS[value]!;
  }
  if (value === 104) return "11010010000";
  if (value === 105) return "11010011100";
  if (value === 106) return "11000111010";
  return "11011001100";
}

/** Clean AWB for barcode: printable ASCII only (Code-128B). */
function sanitizeBarcodeText(text: string): string {
  return String(text || "")
    .trim()
    .toUpperCase()
    .split("")
    .filter((ch) => {
      const code = ch.charCodeAt(0);
      return code >= 32 && code <= 126;
    })
    .join("");
}

function encodeCode128B(text: string): string {
  const clean = sanitizeBarcodeText(text);
  if (!clean) return getPattern(START_B) + STOP_PATTERN;

  const values: number[] = [START_B];
  for (let i = 0; i < clean.length; i++) {
    values.push(clean.charCodeAt(i)! - 32);
  }

  let checksum = values[0]!;
  for (let i = 1; i < values.length; i++) {
    checksum += values[i]! * i;
  }
  checksum %= 103;
  values.push(checksum);

  let pattern = "";
  for (const v of values) pattern += getPattern(v);
  pattern += STOP_PATTERN;
  return pattern;
}

/**
 * Draws Code-128B bars. Returns total drawn width (including quiet zones).
 * moduleWidth ~1.2–1.5 pt scans reliably on phone cameras.
 */
function drawBarcode(
  page: PDFPage,
  x: number,
  y: number,
  barHeight: number,
  text: string,
  moduleWidth = 1.25,
): number {
  const pattern = encodeCode128B(text);
  const quietZone = moduleWidth * 10;
  let cx = x + quietZone;

  for (let i = 0; i < pattern.length; i++) {
    if (pattern[i] === "1") {
      page.drawRectangle({
        x: cx,
        y,
        width: moduleWidth,
        height: barHeight,
        color: rgb(0, 0, 0),
      });
    }
    cx += moduleWidth;
  }

  return cx + quietZone - x;
}

/**
 * Human-readable AWB under barcode — spaced digits across barcode width
 * (matches sample: 6 0 0 3 3 5 8 3 7 1).
 */
function drawSpacedBarcodeText(
  page: PDFPage,
  text: string,
  centerX: number,
  y: number,
  targetWidth: number,
  font: PDFFont,
  size: number,
) {
  const chars = sanitizeBarcodeText(text).split("").filter(Boolean);
  if (!chars.length) return;

  const charWidths = chars.map((c) => font.widthOfTextAtSize(c, size));
  const totalCharW = charWidths.reduce((a, b) => a + b, 0);

  let gap =
    chars.length > 1 ? (targetWidth - totalCharW) / (chars.length - 1) : 0;
  gap = Math.min(Math.max(gap, 2), 14);

  const usedW =
    totalCharW + (chars.length > 1 ? gap * (chars.length - 1) : 0);
  let x = centerX - usedW / 2;

  for (let i = 0; i < chars.length; i++) {
    page.drawText(chars[i]!, {
      x,
      y,
      size,
      font,
      color: rgb(0, 0, 0),
    });
    x += charWidths[i]! + gap;
  }
}

/* ------------------------------------------------------------------ */
/*  Text helpers                                                       */
/* ------------------------------------------------------------------ */

function wrapText(text: string, maxChars: number): string[] {
  if (!text) return [];
  const words = String(text).split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length <= maxChars) {
      current = next;
    } else {
      if (current) lines.push(current);
      if (word.length > maxChars) {
        let rest = word;
        while (rest.length > maxChars) {
          lines.push(rest.slice(0, maxChars));
          rest = rest.slice(maxChars);
        }
        current = rest;
      } else {
        current = word;
      }
    }
  }
  if (current) lines.push(current);
  return lines;
}

/** Header left date: DD-MM-YYYY */
function formatDateOnly(value?: string): string {
  if (value) {
    const m = value.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/);
    if (m) {
      const d = m[1]!.padStart(2, "0");
      const mo = m[2]!.padStart(2, "0");
      const y = m[3]!.length === 2 ? `20${m[3]}` : m[3]!;
      return `${d}-${mo}-${y}`;
    }
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      const pad = (n: number) => String(n).padStart(2, "0");
      return `${pad(parsed.getDate())}-${pad(parsed.getMonth() + 1)}-${parsed.getFullYear()}`;
    }
  }
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()}`;
}

/** Printed on: DD/MM/YYYY HH:mm:ss */
function formatPrintedAt(value?: string): string {
  if (value) {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      const pad = (n: number) => String(n).padStart(2, "0");
      return `${pad(parsed.getDate())}/${pad(parsed.getMonth() + 1)}/${parsed.getFullYear()} ${pad(parsed.getHours())}:${pad(parsed.getMinutes())}:${pad(parsed.getSeconds())}`;
    }
    return value;
  }
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

/** POD: DD/MM/YYYY + HH:mm + only AM or only PM */
function formatPodDateTime(value?: string): {
  date: string;
  time: string;
  meridiem: "AM" | "PM";
} {
  const d = value ? new Date(value) : new Date();
  const safe = Number.isNaN(d.getTime()) ? new Date() : d;
  const pad = (n: number) => String(n).padStart(2, "0");
  const date = `${pad(safe.getDate())}/${pad(safe.getMonth() + 1)}/${safe.getFullYear()}`;
  let hours = safe.getHours();
  const meridiem: "AM" | "PM" = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  if (hours === 0) hours = 12;
  const time = `${pad(hours)}:${pad(safe.getMinutes())}`;
  return { date, time, meridiem };
}

function extraLocationLines(
  address: string,
  city?: string,
  state?: string,
  pincode?: string,
): string[] {
  const hay = address.toLowerCase();
  const out: string[] = [];
  const pushIfNew = (v?: string) => {
    const t = String(v || "").trim();
    if (!t) return;
    if (hay.includes(t.toLowerCase())) return;
    out.push(t);
  };
  pushIfNew(city);
  pushIfNew(state);
  pushIfNew(pincode);
  return out;
}

function getTrackingUrl(): string {
  const base = (
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ).replace(/\/$/, "");
  return `${base}/logistics/track`;
}

function loadSreshtaLogoBytes(): Uint8Array | null {
  const candidates = [
    join(process.cwd(), "public", "images", "sreshta-logistics-logo.png"),
    join(process.cwd(), "public", "images", "sreshta-logistics-logo.PNG"),
    join(process.cwd(), "public", "sreshta-logistics-logo.png"),
  ];
  for (const p of candidates) {
    if (existsSync(p)) return readFileSync(p);
  }
  return null;
}

function drawSreshtaLogo(
  page: PDFPage,
  logoImage: PDFImage | null,
  bold: PDFFont,
  font: PDFFont,
  x: number,
  y: number,
  boxW: number,
  boxH: number,
) {
  const navy = rgb(0.024, 0.157, 0.298);
  const teal = rgb(0.03, 0.5, 0.53);

  if (logoImage) {
    const scale = Math.min(
      (boxW * 0.95) / logoImage.width,
      (boxH * 0.95) / logoImage.height,
    );
    const drawW = logoImage.width * scale;
    const drawH = logoImage.height * scale;
    page.drawImage(logoImage, {
      x: x + (boxW - drawW) / 2,
      y: y + (boxH - drawH) / 2,
      width: drawW,
      height: drawH,
    });
    return;
  }

  page.drawText("SRESHTA", {
    x: x + 8,
    y: y + boxH / 2 + 4,
    size: 13,
    font: bold,
    color: navy,
  });
  page.drawText("LOGISTICS", {
    x: x + 8,
    y: y + boxH / 2 - 10,
    size: 9,
    font,
    color: teal,
  });
}

/* ------------------------------------------------------------------ */
/*  Main generator                                                     */
/* ------------------------------------------------------------------ */

export async function generateAwbLabelPdf(
  data: AwbLabelData,
): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595.28, 841.89]);
  const { width, height } = page.getSize();

  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const ocrFont = await pdf.embedFont(StandardFonts.CourierBold);

  let logoImage: PDFImage | null = null;
  try {
    const bytes = loadSreshtaLogoBytes();
    if (bytes) logoImage = await pdf.embedPng(bytes);
  } catch (err) {
    console.warn("Could not embed Sreshta logistics logo:", err);
  }

  const margin = 12;
  const black = rgb(0, 0, 0);
  const gray = rgb(0.3, 0.3, 0.3);
  const lightGray = rgb(0.92, 0.92, 0.92);
  const linkBlue = rgb(0.0, 0.2, 0.75);

  const pieces = Number(data.pieces) > 0 ? Number(data.pieces) : 1;
  const actualW = Number(data.actualWeight) || 0;
  const chargeW = Math.max(Number(data.chargeableWeight) || 0, actualW);
  const declared = Number(data.declaredValue) || 0;
  const currency = (data.currency || "INR").toUpperCase();
  const contentText = (data.content || "").trim() || "—";
  const csb = (data.csbType || "CSB4").toUpperCase();
  const awb = String(data.awb || "").trim().toUpperCase();
  const trackingUrl = getTrackingUrl();

  const drawText = (
    text: string,
    x: number,
    y: number,
    size = 8,
    isBold = false,
    color = black,
  ) => {
    const t = String(text ?? "");
    if (!t) return;
    page.drawText(t, {
      x,
      y,
      size,
      font: isBold ? bold : font,
      color,
    });
  };

  const cell = (
    x: number,
    y: number,
    w: number,
    h: number,
    borderWidth = 0.9,
    fill?: ReturnType<typeof rgb>,
  ) => {
    page.drawRectangle({
      x,
      y,
      width: w,
      height: h,
      borderColor: black,
      borderWidth,
      color: fill,
    });
  };

  const contentW = width - margin * 2;
  let y = height - margin;

  /* 1) HEADER BAR */
  const headerH = 15;
  cell(margin, y - headerH, contentW, headerH, 0.75);

  drawText(formatDateOnly(data.printedAt || data.bookDate), margin + 3, y - 10.5, 6.5);
  drawText(trackingUrl, margin + 68, y - 10.5, 6.5, false, linkBlue);

  const title = "Shipment Label";
  const titleW = bold.widthOfTextAtSize(title, 8.5);
  drawText(title, margin + (contentW - titleW) / 2, y - 10.5, 8.5, true);

  const printed = `Printed on  ${formatPrintedAt(data.printedAt)}`;
  const printedW = font.widthOfTextAtSize(printed, 6.5);
  drawText(printed, margin + contentW - printedW - 4, y - 10.5, 6.5);

  y -= headerH;

  /* 2) ACCOUNT | ORIGIN + AWB | CUSTOMER REFERENCE */
  const row1H = 34;
  const colAcc = 148;
  const colOrigin = 178;
  const colRef = contentW - colAcc - colOrigin;

  cell(margin, y - row1H, colAcc, row1H);
  drawText("1.  ACCOUNT NUMBER", margin + 4, y - 11, 6.5, true);
  drawText(
    (data.accountCode || "—").toUpperCase(),
    margin + 4,
    y - 27,
    12,
    true,
  );

  cell(margin + colAcc, y - row1H, colOrigin, row1H);
  drawText(
    (data.origin || "—").toUpperCase(),
    margin + colAcc + 6,
    y - 12,
    11,
    true,
  );
  drawText(awb || "—", margin + colAcc + 6, y - 28, 11, true);

  cell(margin + colAcc + colOrigin, y - row1H, colRef, row1H);
  drawText(
    "CUSTOMER REFERENCE",
    margin + colAcc + colOrigin + 5,
    y - 11,
    6.5,
    true,
  );
  drawText(
    (data.customerReference || "SRESHTA COURIERS").toUpperCase(),
    margin + colAcc + colOrigin + 5,
    y - 27,
    10,
    true,
  );

  y -= row1H;

  /* 3) SHIPPER | CONSIGNEE | SERVICE TYPE */
  const leftW = 186;
  const midW = 196;
  const rightW = contentW - leftW - midW;
  const topH = 124;
  const stripW = 11;

  cell(margin, y - topH, leftW, topH);
  cell(margin, y - topH, stripW, topH, 0.55, lightGray);
  ["S", "H", "I", "P", "P", "E", "R"].forEach((ch, i) => {
    drawText(ch, margin + 2.2, y - 14 - i * 14, 8, true);
  });

  const shipX = margin + stripW + 4;
  drawText("1.", shipX, y - 12, 8, true);
  drawText((data.shipperName || "").toUpperCase(), shipX + 12, y - 12, 8, true);

  let sy = y - 24;
  wrapText(data.shipperAddress || "", 30)
    .slice(0, 5)
    .forEach((line) => {
      drawText(line.toUpperCase(), shipX, sy, 7);
      sy -= 9.5;
    });
  extraLocationLines(
    data.shipperAddress || "",
    data.shipperCity,
    data.shipperState,
    data.shipperPincode,
  ).forEach((line) => {
    if (sy < y - topH + 14) return;
    drawText(line.toUpperCase(), shipX, sy, 7);
    sy -= 9.5;
  });
  if (data.shipperPhone && sy >= y - topH + 11) {
    drawText(String(data.shipperPhone), shipX, sy, 7);
  }

  cell(margin + leftW, y - topH, midW, topH);
  cell(margin + leftW, y - topH, stripW, topH, 0.55, lightGray);
  ["C", "O", "N", "S", "I", "G", "N", "E", "E"].forEach((ch, i) => {
    drawText(ch, margin + leftW + 2, y - 13 - i * 11.5, 7.5, true);
  });

  // const consX = margin + leftW + stripW + 4;
  // drawText("2.", consX, y - 12, 8, true);
  // drawText(
  //   (data.consigneeName || "").toUpperCase(),
  //   consX + 12,
  //   y - 12,
  //   8,
  //   true,
  // );

  // let cy = y - 24;
  // wrapText(data.consigneeAddress || "", 30)
  //   .slice(0, 4)
  //   .forEach((line) => {
  //     drawText(line.toUpperCase(), consX, cy, 7);
  //     cy -= 9.5;
  //   });
  // extraLocationLines(
  //   data.consigneeAddress || "",
  //   data.consigneeCity,
  //   data.consigneeState,
  //   data.consigneePincode,
  // ).forEach((line) => {
  //   if (cy < y - topH + 32) return;
  //   drawText(line.toUpperCase(), consX, cy, 7);
  //   cy -= 9.5;
  // });
  // if (cy >= y - topH + 22) {
  //   drawText(
  //     `Country : ${(data.consigneeCountry || "—").toUpperCase()}`,
  //     consX,
  //     cy,
  //     7,
  //   );
  //   cy -= 9.5;
  // }
  // if (data.consigneePhone && cy >= y - topH + 11) {
  //   drawText(String(data.consigneePhone), consX, cy, 7);
  // }

  //   const consX = margin + leftW + stripW + 4;
  // drawText("2.", consX, y - 12, 8, true);
  // drawText(
  //   (data.consigneeName || "").toUpperCase(),
  //   consX + 12,
  //   y - 12,
  //   8,
  //   true,
  // );

  // // Keep space at bottom for phone so it never gets clipped
  // const phoneReserve = 14;
  // const addressBottom = y - topH + phoneReserve + 4;

  // let cy = y - 24;
  // wrapText(data.consigneeAddress || "", 30)
  //   .slice(0, 4)
  //   .forEach((line) => {
  //     if (cy < addressBottom) return;
  //     drawText(line.toUpperCase(), consX, cy, 7);
  //     cy -= 9.5;
  //   });
  // extraLocationLines(
  //   data.consigneeAddress || "",
  //   data.consigneeCity,
  //   data.consigneeState,
  //   data.consigneePincode,
  // ).forEach((line) => {
  //   if (cy < addressBottom) return;
  //   drawText(line.toUpperCase(), consX, cy, 7);
  //   cy -= 9.5;
  // });
  // if (cy >= addressBottom) {
  //   drawText(
  //     `Country : ${(data.consigneeCountry || "—").toUpperCase()}`,
  //     consX,
  //     cy,
  //     7,
  //   );
  // }

  // // Always print mobile/phone at bottom of consignee box
  // const consigneePhone = String(
  //   data.consigneeMobile || data.consigneePhone || "",
  // ).trim();
  // if (consigneePhone) {
  //   drawText(`Mob: ${consigneePhone}`, consX, y - topH + 6, 7.5, true);
  // }
    const consX = margin + leftW + stripW + 4;
  drawText("2.", consX, y - 12, 8, true);
  drawText(
    (data.consigneeName || "").toUpperCase(),
    consX + 12,
    y - 12,
    8,
    true,
  );

  let cy = y - 24;
  wrapText(data.consigneeAddress || "", 30)
    .slice(0, 5)
    .forEach((line) => {
      drawText(line.toUpperCase(), consX, cy, 7);
      cy -= 9.5;
    });
  extraLocationLines(
    data.consigneeAddress || "",
    data.consigneeCity,
    data.consigneeState,
    data.consigneePincode,
  ).forEach((line) => {
    if (cy < y - topH + 14) return;
    drawText(line.toUpperCase(), consX, cy, 7);
    cy -= 9.5;
  });
  // Mobile — same placement as shipper (next line after address)
  const consigneePhone = String(
    data.consigneeMobile || data.consigneePhone || "",
  ).trim();
  if (consigneePhone && cy >= y - topH + 11) {
    drawText(consigneePhone, consX, cy, 7);
  }
  

  const svcX = margin + leftW + midW;
  cell(svcX, y - topH, rightW, topH);

  cell(svcX, y - 14, rightW, 14, 0.7, lightGray);
  drawText("SERVICE TYPE", svcX + 4, y - 10, 6.5, true);

  cell(svcX, y - 32, rightW, 18);
  const serviceLine = (
    data.serviceType ||
    data.product ||
    "INTERNATIONAL PRIORITY"
  ).toUpperCase();
  drawText(serviceLine, svcX + 4, y - 26, 7.5, true);

  cell(svcX, y - 50, rightW, 18);
  drawText((data.vendor || "—").toUpperCase(), svcX + 4, y - 44, 7);

  cell(svcX, y - 88, rightW, 38);
  drawText("FULL DESCRIPTION OF CONTENTS :-", svcX + 4, y - 58, 6, true);
  wrapText(contentText.toUpperCase(), 28)
    .slice(0, 2)
    .forEach((line, i) => {
      drawText(line, svcX + 4, y - 70 - i * 10, 7.5);
    });

  cell(svcX, y - topH, rightW, topH - 88);
  drawText("SPECIAL INSTRUCTIONS :-", svcX + 4, y - 98, 6, true);
  wrapText((data.specialInstructions || "").toUpperCase(), 28)
    .slice(0, 2)
    .forEach((line, i) => {
      drawText(line, svcX + 4, y - 110 - i * 10, 7);
    });

  y -= topH;

  /* 4) AUTH/POD | DECLARED+CSB+BARCODE | SIZE & WEIGHT */
  const bottomH = 220;

  cell(margin, y - bottomH, leftW, bottomH);

  drawText(
    "3.  SENDER'S AUTHORISATION AND SIGNATURE",
    margin + 3,
    y - 11,
    5.8,
    true,
  );

  // const logoW = 128;
  // const logoH = 44;
  // const logoX = margin + (leftW - logoW) / 2;
  // const logoY = y - 64;
  // drawSreshtaLogo(page, logoImage, bold, font, logoX, logoY, logoW, logoH);

  // drawText("SENDER'S SIGNATURE", margin + 5, y - 82, 7.5);
  // page.drawLine({
  //   start: { x: margin + 5, y: y - 94 },
  //   end: { x: margin + leftW - 6, y: y - 94 },
  //   thickness: 0.7,
  //   color: black,
  // });
  // drawText("DATE", margin + 5, y - 108, 7.5);

  // drawText("PROOF OF DELIVERY (POD)", margin + 5, y - 132, 8, true);
  // drawText("RECEIVER'S SIGNATURE", margin + 5, y - 148, 7.5);
  // page.drawLine({
  //   start: { x: margin + 5, y: y - 160 },
  //   end: { x: margin + leftW - 6, y: y - 160 },
  //   thickness: 0.7,
  //   color: black,
  // });

  // // Current date + time; only AM or only PM
  // {
  //   const pod = formatPodDateTime(data.printedAt);
  //   drawText(`DATE  ${pod.date}`, margin + 5, y - 178, 6.5);
  //   drawText(`TIME  ${pod.time} ${pod.meridiem}`, margin + 88, y - 178, 6.5);
  // }
  // drawText(
  //   "(CAPITAL LETTERS VERY IMPORTANT)",
  //   margin + 5,
  //   y - 198,
  //   5,
  //   false,
  //   gray,
  // );

    // Larger logo (fits leftW ≈ 186)
  const logoW = 168;
  const logoH = 62;
  const logoX = margin + (leftW - logoW) / 2;
  const logoY = y - 82;
  drawSreshtaLogo(page, logoImage, bold, font, logoX, logoY, logoW, logoH);

  drawText("SENDER'S SIGNATURE", margin + 5, y - 100, 7.5);
  page.drawLine({
    start: { x: margin + 5, y: y - 112 },
    end: { x: margin + leftW - 6, y: y - 112 },
    thickness: 0.7,
    color: black,
  });
  drawText("DATE", margin + 5, y - 126, 7.5);

  drawText("PROOF OF DELIVERY (POD)", margin + 5, y - 148, 8, true);
  drawText("RECEIVER'S SIGNATURE", margin + 5, y - 164, 7.5);
  page.drawLine({
    start: { x: margin + 5, y: y - 176 },
    end: { x: margin + leftW - 6, y: y - 176 },
    thickness: 0.7,
    color: black,
  });

  {
    const pod = formatPodDateTime(data.printedAt);
    drawText(`DATE  ${pod.date}`, margin + 5, y - 192, 6.5);
    drawText(`TIME  ${pod.time} ${pod.meridiem}`, margin + 88, y - 192, 6.5);
  }
  drawText(
    "(CAPITAL LETTERS PLEASE IMPORTANT)",
    margin + 5,
    y - 210,
    5,
    false,
    gray,
  );

  const midX = margin + leftW;
  cell(midX, y - bottomH, midW, bottomH);

  cell(midX, y - 52, midW, 52, 0.95);
  drawText("DECLARED VALUE FOR", midX + 14, y - 16, 7.5, true);
  drawText("CUSTOMS AND CURRENCY", midX + 14, y - 28, 7.5, true);
  const declaredLabel =
    declared > 0 ? `${declared.toFixed(0)} ${currency}` : `0 ${currency}`;
  const declaredTw = bold.widthOfTextAtSize(declaredLabel, 13);
  drawText(declaredLabel, midX + (midW - declaredTw) / 2, y - 46, 13, true);

  const csbBoxW = 118;
  const csbBoxH = 36;
  const csbBoxX = midX + (midW - csbBoxW) / 2;
  const csbBoxY = y - 108;
  cell(csbBoxX, csbBoxY, csbBoxW, csbBoxH, 2.0);
  const csbTw = bold.widthOfTextAtSize(csb, 16);
  drawText(csb, csbBoxX + (csbBoxW - csbTw) / 2, csbBoxY + 12, 16, true);

  // Scannable Code-128B barcode
  const barcodePayload = sanitizeBarcodeText(awb);
  const barH = 44;
  const barY = y - bottomH + 34;
  const barModule = 1.3;

  const pattern = encodeCode128B(barcodePayload);
  const quiet = barModule * 10;
  let module = barModule;
  let totalW = pattern.length * module + quiet * 2;
  const maxBarW = midW - 12;
  if (totalW > maxBarW) {
    module = (maxBarW - quiet * 2) / Math.max(pattern.length, 1);
    module = Math.max(0.9, module);
    totalW = pattern.length * module + quiet * 2;
  }

  const quietActual = module * 10;
  const barX = midX + (midW - totalW) / 2;
  const drawnW = drawBarcode(
    page,
    barX,
    barY,
    barH,
    barcodePayload,
    module,
  );

  const bodyW = Math.max(40, drawnW - quietActual * 2);
  drawSpacedBarcodeText(
    page,
    barcodePayload,
    midX + midW / 2,
    barY - 13,
    bodyW,
    ocrFont,
    11,
  );

  const szX = margin + leftW + midW;
  cell(szX, y - bottomH, rightW, bottomH);

  cell(szX, y - 16, rightW, 16, 0.7, lightGray);
  drawText("SIZE & WEIGHT", szX + 5, y - 12, 7, true);

  // Pieces (same as sample)
  cell(szX, y - 42, rightW, 26);
  drawText("Pieces :", szX + 6, y - 33, 9);
  drawText(String(pieces), szX + 72, y - 33, 11, true);

  cell(szX, y - 68, rightW, 26);
  drawText("Weight", szX + 6, y - 59, 9);
  drawText(actualW.toFixed(3), szX + 58, y - 59, 11, true);
  drawText("Kgs", szX + rightW - 30, y - 59, 9);

  cell(szX, y - 112, rightW, 44);
  const dim = String(data.dimensions || "").trim();
  if (dim) {
    drawText(dim, szX + 6, y - 92, 9);
  }

  cell(szX, y - bottomH, rightW, bottomH - 112);
  drawText("CHARGED WEIGHT", szX + 6, y - 132, 8, true);
  const chargeLabel = chargeW.toFixed(2);
  const chargeTw = bold.widthOfTextAtSize(chargeLabel, 18);
  drawText(
    chargeLabel,
    szX + (rightW - chargeTw) / 2,
    y - 172,
    18,
    true,
  );

  return pdf.save();
}