// import { NextRequest, NextResponse } from "next/server";
// import { generateAwbLabelPdf } from "@/lib/pdf/awbLabelGenerator";
// import { generateProformaInvoicePdf } from "@/lib/pdf/proformaInvoiceGenerator";
// import { numberToWords } from "@/utils/numberToWords";

// export const runtime = "nodejs";

// type GeneratePdfBody = {
//   type: "awb-label" | "proforma" | "both";
//   // Shared / AWB fields
//   awb: string;
//   accountCode?: string;
//   bookDate?: string;
//   invoiceNo?: string;
//   invoiceDate?: string;

//   shipperName: string;
//   shipperAddress: string;
//   shipperCity?: string;
//   shipperState?: string;
//   shipperPincode?: string;
//   shipperPhone?: string;
//   shipperCountry?: string;
//   shipperTaxId?: string;

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
//   preCarriageBy?: string;
//   placeOfLoading?: string;
//   portOfDischarge?: string;
//   finalDestination?: string;
//   countryOfOrigin?: string;
//   countryOfDestination?: string;
//   termOfDelivery?: string;
//   otherReference?: string;
//   csbType?: string;
//   exportReason?: string;

//   pieces?: number;
//   actualWeight?: number;
//   chargeableWeight?: number;
//   dimensions?: string;
//   declaredValue?: number;
//   currency?: string;
//   content?: string;

//   items?: Array<{
//     description: string;
//     shopName?: string;
//     shopAddress?: string;
//     hsCode: string;
//     quantity: number;
//     weight?: number;
//     unitRate: number;
//     amount: number;
//   }>;
//   totalAmount?: number;
// };

// export async function POST(req: NextRequest) {
//   try {
//     const body = (await req.json()) as GeneratePdfBody;

//     if (!body.awb?.trim()) {
//       return NextResponse.json(
//         { error: "AWB number is required." },
//         { status: 400 },
//       );
//     }

//     if (!body.type) {
//       return NextResponse.json(
//         { error: "type must be 'awb-label' | 'proforma' | 'both'." },
//         { status: 400 },
//       );
//     }

//     const results: Record<string, string> = {};

//     // ---------- AWB Label ----------
//     if (body.type === "awb-label" || body.type === "both") {
//       const labelBytes = await generateAwbLabelPdf({
//         awb: body.awb,
//         accountCode: body.accountCode,
//         bookDate: body.bookDate,
//         shipperName: body.shipperName,
//         shipperAddress: body.shipperAddress,
//         shipperCity: body.shipperCity || "",
//         shipperState: body.shipperState,
//         shipperPincode: body.shipperPincode,
//         shipperPhone: body.shipperPhone,
//         shipperCountry: body.shipperCountry || "INDIA",
//         consigneeName: body.consigneeName,
//         consigneeAddress: body.consigneeAddress,
//         consigneeCity: body.consigneeCity || "",
//         consigneeState: body.consigneeState,
//         consigneePincode: body.consigneePincode,
//         consigneePhone: body.consigneePhone,
//         consigneeCountry: body.consigneeCountry,
//         serviceType: body.serviceType || body.product,
//         product: body.product,
//         vendor: body.vendor,
//         pieces: body.pieces ?? 1,
//         actualWeight: body.actualWeight ?? 0,
//         chargeableWeight: body.chargeableWeight ?? 0,
//         dimensions: body.dimensions,
//         declaredValue: body.declaredValue,
//         currency: body.currency || "INR",
//         content: body.content,
//         csbType: body.csbType,
//       });

//       results.awbLabel = Buffer.from(labelBytes).toString("base64");
//     }

//     // ---------- Proforma Invoice ----------
//     if (body.type === "proforma" || body.type === "both") {
//       const total = body.totalAmount ?? 0;

//       const proformaBytes = await generateProformaInvoicePdf({
//         awb: body.awb,
//         invoiceNo: body.invoiceNo || `INV-${body.awb}`,
//         invoiceDate: body.invoiceDate || new Date().toISOString().slice(0, 10),
//         accountCode: body.accountCode,
//         shipperName: body.shipperName,
//         shipperAddress: body.shipperAddress,
//         shipperPhone: body.shipperPhone,
//         shipperTaxId: body.shipperTaxId,
//         consigneeName: body.consigneeName,
//         consigneeAddress: body.consigneeAddress,
//         consigneeCity: body.consigneeCity,
//         consigneeState: body.consigneeState,
//         consigneePincode: body.consigneePincode,
//         consigneeCountry: body.consigneeCountry,
//         preCarriageBy: body.preCarriageBy || body.vendor,
//         placeOfLoading: body.placeOfLoading,
//         portOfDischarge: body.portOfDischarge,
//         finalDestination: body.finalDestination || body.consigneeCountry,
//         countryOfOrigin: body.countryOfOrigin || "INDIA",
//         countryOfDestination:
//           body.countryOfDestination || body.consigneeCountry,
//         termOfDelivery: body.termOfDelivery || "CIF",
//         otherReference: body.otherReference || body.exportReason,
//         csbType: body.csbType,
//         exportReason: body.exportReason,
//         items: body.items || [],
//         totalAmount: total,
//         totalPieces: body.pieces,
//         actualWeight: body.actualWeight,
//         chargeableWeight: body.chargeableWeight,
//         declaredValue: body.declaredValue,
//       });

//       results.proforma = Buffer.from(proformaBytes).toString("base64");
//       results.amountInWords = numberToWords(total);
//     }

//     return NextResponse.json({
//       success: true,
//       awb: body.awb,
//       ...results,
//     });
//   } catch (err) {
//     console.error("[generate-pdf]", err);
//     return NextResponse.json(
//       {
//         error:
//           err instanceof Error
//             ? err.message
//             : "Failed to generate PDF",
//       },
//       { status: 500 },
//     );
//   }
// }



// import { NextRequest, NextResponse } from "next/server";
// import { getCurrentUser } from "@/lib/auth";
// import { can } from "@/lib/permissions";
// import { successResponse, errorResponse } from "@/lib/api-response";

// import { generateAwbLabelPdf } from "@/lib/pdf/awbLabelGenerator";
// import { generateProformaInvoicePdf } from "@/lib/pdf/proformaInvoiceGenerator";

// export async function POST(request: NextRequest) {
//   try {
//     const user = await getCurrentUser(request);

//     if (!user) {
//       return errorResponse("UNAUTHENTICATED", "Authentication is required.", 401);
//     }

//     // Allow both Super Admin and Co-loaders who can create invoices
//     if (
//       !can(user, "LOGISTICS_INVOICE_CREATE") &&
//       !can(user, "LOGISTICS_AWB_CREATE")
//     ) {
//       return errorResponse(
//         "FORBIDDEN",
//         "You do not have permission to generate logistics documents.",
//         403,
//       );
//     }

//     const body = await request.json();

//     const type = body.type as "awb-label" | "proforma" | "both";

//     if (!type || !["awb-label", "proforma", "both"].includes(type)) {
//       return errorResponse(
//         "INVALID_TYPE",
//         "type must be 'awb-label', 'proforma' or 'both'.",
//         400,
//       );
//     }

//     if (!body.awb) {
//       return errorResponse("AWB_REQUIRED", "awb is required.", 400);
//     }

//     // ---------- Common data mapping ----------
//     const common = {
//       awb: String(body.awb),
//       accountCode: body.accountCode || "",
//       bookDate: body.bookDate || body.invoiceDate || "",
//       invoiceNo: body.invoiceNo || body.invoiceNumber || `INV-${body.awb}`,
//       invoiceDate: body.invoiceDate || body.bookDate || new Date().toLocaleDateString("en-GB"),

//       shipperName: body.shipperName || "",
//       shipperAddress: body.shipperAddress || "",
//       shipperCity: body.shipperCity || "",
//       shipperState: body.shipperState || "",
//       shipperPincode: body.shipperPincode || "",
//       shipperPhone: body.shipperPhone || "",
//       shipperCountry: body.shipperCountry || "INDIA",
//       shipperTaxId: body.shipperTaxId || body.shipperGstin || "",

//       consigneeName: body.consigneeName || "",
//       consigneeAddress: body.consigneeAddress || "",
//       consigneeCity: body.consigneeCity || "",
//       consigneeState: body.consigneeState || "",
//       consigneePincode: body.consigneePincode || "",
//       consigneePhone: body.consigneePhone || "",
//       consigneeCountry: body.consigneeCountry || "U.S.A.",

//       serviceType: body.serviceType || body.product || "SPX INTERNATIONAL PRIORITY",
//       vendor: body.vendor || body.preCarriageBy || "FEDERAL EXPRESS CORPORATION",
//       preCarriageBy: body.preCarriageBy || body.vendor || "FDX",
//       placeOfLoading: body.placeOfLoading || body.origin || "GUNTUR",
//       portOfDischarge: body.portOfDischarge || "",
//       finalDestination: body.finalDestination || body.consigneeCountry || "U.S.A.",
//       countryOfOrigin: body.countryOfOrigin || "INDIA",
//       countryOfDestination: body.countryOfDestination || body.consigneeCountry || "U.S.A.",
//       termOfDelivery: body.termOfDelivery || body.termOfInvoice || "CIF",
//       otherReference: body.otherReference || body.exportReason || "UNSOLICITED GIFT - NOT FOR SALE",
//       csbType: body.csbType || "CSB4",
//       content: body.content || "USED CLOTHES",
//       specialInstructions: body.specialInstructions || "",

//       pieces: Number(body.pieces || body.totalPieces || 1),
//       actualWeight: Number(body.actualWeight || 0),
//       chargeableWeight: Number(body.chargeableWeight || body.actualWeight || 0),
//       dimensions: body.dimensions || "",
//       declaredValue: Number(body.declaredValue || 0),
//       currency: body.currency || "INR",
//       totalAmount: Number(body.totalAmount || 0),

//       items: Array.isArray(body.items)
//         ? body.items.map((item: any, index: number) => ({
//             description: item.description || "",
//             shopName: item.shopName || "",
//             shopAddress: item.shopAddress || "",
//             hsCode: item.hsCode || "",
//             quantity: Number(item.quantity || 1),
//             weight: item.weight != null ? Number(item.weight) : undefined,
//             unitRate: Number(item.unitRate || item.rate || 0),
//             amount: Number(item.amount || 0),
//             boxNo: item.boxNo || index + 1,
//           }))
//         : [],
//     };

//     // ---------- Generate PDFs ----------
//     const result: {
//       success: boolean;
//       awbLabel?: string;
//       proforma?: string;
//       message?: string;
//     } = { success: true };

//     if (type === "awb-label" || type === "both") {
//       const labelBytes = await generateAwbLabelPdf({
//         awb: common.awb,
//         accountCode: common.accountCode,
//         bookDate: common.bookDate,
//         shipperName: common.shipperName,
//         shipperAddress: common.shipperAddress,
//         shipperCity: common.shipperCity,
//         shipperState: common.shipperState,
//         shipperPincode: common.shipperPincode,
//         shipperPhone: common.shipperPhone,
//         shipperCountry: common.shipperCountry,
//         consigneeName: common.consigneeName,
//         consigneeAddress: common.consigneeAddress,
//         consigneeCity: common.consigneeCity,
//         consigneeState: common.consigneeState,
//         consigneePincode: common.consigneePincode,
//         consigneePhone: common.consigneePhone,
//         consigneeCountry: common.consigneeCountry,
//         serviceType: common.serviceType,
//         vendor: common.vendor,
//         pieces: common.pieces,
//         actualWeight: common.actualWeight,
//         chargeableWeight: common.chargeableWeight,
//         dimensions: common.dimensions,
//         declaredValue: common.declaredValue,
//         currency: common.currency,
//         content: common.content,
//         csbType: common.csbType,
//         specialInstructions: common.specialInstructions,
//         origin: common.placeOfLoading,
//       });

//       result.awbLabel = Buffer.from(labelBytes).toString("base64");
//     }

//     if (type === "proforma" || type === "both") {
//       const proformaBytes = await generateProformaInvoicePdf({
//         awb: common.awb,
//         invoiceNo: common.invoiceNo,
//         invoiceDate: common.invoiceDate,
//         accountCode: common.accountCode,
//         exporterRef: common.preCarriageBy,
//         shipperName: common.shipperName,
//         shipperAddress: common.shipperAddress,
//         shipperPhone: common.shipperPhone,
//         shipperTaxId: common.shipperTaxId,
//         shipperCity: common.shipperCity,
//         shipperState: common.shipperState,
//         shipperPincode: common.shipperPincode,
//         shipperCountry: common.shipperCountry,
//         consigneeName: common.consigneeName,
//         consigneeAddress: common.consigneeAddress,
//         consigneeCity: common.consigneeCity,
//         consigneeState: common.consigneeState,
//         consigneePincode: common.consigneePincode,
//         consigneeCountry: common.consigneeCountry,
//         consigneePhone: common.consigneePhone,
//         preCarriageBy: common.preCarriageBy,
//         placeOfLoading: common.placeOfLoading,
//         portOfDischarge: common.portOfDischarge,
//         finalDestination: common.finalDestination,
//         countryOfOrigin: common.countryOfOrigin,
//         countryOfDestination: common.countryOfDestination,
//         termOfDelivery: common.termOfDelivery,
//         otherReference: common.otherReference,
//         totalPieces: common.pieces,
//         packageType: "PKT",
//         actualWeight: common.actualWeight,
//         chargeableWeight: common.chargeableWeight,
//         declaredValue: common.declaredValue,
//         items: common.items,
//         totalAmount: common.totalAmount,
//       });

//       result.proforma = Buffer.from(proformaBytes).toString("base64");
//     }

//     return NextResponse.json(result);
//   } catch (error) {
//     console.error("POST /api/admin/logistics/generate-pdf", error);

//     return errorResponse(
//       "PDF_GENERATION_FAILED",
//       error instanceof Error ? error.message : "Unable to generate PDF.",
//       500,
//     );
//   }
// }


// import { NextRequest, NextResponse } from "next/server";
// import { getCurrentUser } from "@/lib/auth";
// import { can } from "@/lib/permissions";
// import { errorResponse } from "@/lib/api-response";

// import { generateAwbLabelPdf } from "@/lib/pdf/awbLabelGenerator";
// import { generateProformaInvoicePdf } from "@/lib/pdf/proformaInvoiceGenerator";

// export async function POST(request: NextRequest) {
//   try {
//     const user = await getCurrentUser(request);

//     if (!user) {
//       return errorResponse(
//         "UNAUTHENTICATED",
//         "Authentication is required.",
//         401,
//       );
//     }

//     // Allow Super Admin and users who can create invoices / AWBs
//     if (
//       !can(user, "LOGISTICS_INVOICE_CREATE") &&
//       !can(user, "LOGISTICS_AWB_CREATE")
//     ) {
//       return errorResponse(
//         "FORBIDDEN",
//         "You do not have permission to generate logistics documents.",
//         403,
//       );
//     }

//     const body = await request.json();

//     const type = body.type as "awb-label" | "proforma" | "both";

//     if (!type || !["awb-label", "proforma", "both"].includes(type)) {
//       return errorResponse(
//         "INVALID_TYPE",
//         "type must be 'awb-label', 'proforma' or 'both'.",
//         400,
//       );
//     }

//     if (!body.awb) {
//       return errorResponse("AWB_REQUIRED", "awb is required.", 400);
//     }

//     // ---------- Common data mapping ----------
//     const common = {
//       awb: String(body.awb).trim(),
//       accountCode: body.accountCode || "WF439",
//       bookDate:
//         body.bookDate ||
//         body.invoiceDate ||
//         new Date().toLocaleDateString("en-GB"),
//       invoiceNo:
//         body.invoiceNo || body.invoiceNumber || `INV-${body.awb}`,
//       invoiceDate:
//         body.invoiceDate ||
//         body.bookDate ||
//         new Date().toLocaleDateString("en-GB"),

//       // Shipper
//       shipperName: body.shipperName || "",
//       shipperAddress: body.shipperAddress || "",
//       shipperCity: body.shipperCity || "",
//       shipperState: body.shipperState || "",
//       shipperPincode: body.shipperPincode || "",
//       shipperPhone: body.shipperPhone || "",
//       shipperCountry: body.shipperCountry || "INDIA",
//       shipperTaxId: body.shipperTaxId || body.shipperGstin || "",

//       // Consignee
//       consigneeName: body.consigneeName || "",
//       consigneeAddress: body.consigneeAddress || "",
//       consigneeCity: body.consigneeCity || "",
//       consigneeState: body.consigneeState || "",
//       consigneePincode: body.consigneePincode || "",
//       consigneePhone: body.consigneePhone || "",
//       consigneeCountry: body.consigneeCountry || "U.S.A.",

//       // Service / routing
//       serviceType:
//         body.serviceType || body.product || "SPX  INTERNATIONAL PRIORITY",
//       vendor:
//         body.vendor ||
//         body.preCarriageBy ||
//         "FEDERAL EXPRESS CORPORATION",
//       product: body.product || "",
//       customerReference:
//         body.customerReference || "SRESHTA COURIERS",
//       preCarriageBy: body.preCarriageBy || body.vendor || "FDX",
//       placeOfLoading: body.placeOfLoading || body.origin || "GUNTUR",
//       portOfDischarge: body.portOfDischarge || "",
//       finalDestination:
//         body.finalDestination || body.consigneeCountry || "U.S.A.",
//       countryOfOrigin: body.countryOfOrigin || "INDIA",
//       countryOfDestination:
//         body.countryOfDestination || body.consigneeCountry || "U.S.A.",
//       termOfDelivery:
//         body.termOfDelivery || body.termOfInvoice || "CIF",
//       otherReference:
//         body.otherReference ||
//         body.exportReason ||
//         "UNSOLICITED GIFT - NOT FOR SALE",
//       csbType: body.csbType || "CSB4",
//       content: body.content || "USED CLOTHES",
//       specialInstructions: body.specialInstructions || "",
//       origin: body.origin || body.placeOfLoading || "GUNTUR",

//       // Weight / pieces
//       pieces: Number(body.pieces || body.totalPieces || 1),
//       actualWeight: Number(body.actualWeight || 0),
//       chargeableWeight: Number(
//         body.chargeableWeight || body.actualWeight || 0,
//       ),
//       dimensions: body.dimensions || "",
//       declaredValue: Number(body.declaredValue || 0),
//       currency: body.currency || "INR",
//       totalAmount: Number(body.totalAmount || 0),

//       // Line items (for proforma)
//       items: Array.isArray(body.items)
//         ? body.items.map((item: any, index: number) => ({
//             description: item.description || "",
//             shopName: item.shopName || "",
//             shopAddress: item.shopAddress || "",
//             hsCode: item.hsCode || "",
//             quantity: Number(item.quantity || 1),
//             weight:
//               item.weight != null ? Number(item.weight) : undefined,
//             unitRate: Number(item.unitRate || item.rate || 0),
//             amount: Number(item.amount || 0),
//             boxNo: item.boxNo || index + 1,
//           }))
//         : [],
//     };

//     // ---------- Generate PDFs ----------
//     const result: {
//       success: boolean;
//       awbLabel?: string;
//       proforma?: string;
//       message?: string;
//     } = { success: true };

//     if (type === "awb-label" || type === "both") {
//       const printedAt = new Date().toLocaleString("en-IN", {
//         day: "2-digit",
//         month: "2-digit",
//         year: "numeric",
//         hour: "2-digit",
//         minute: "2-digit",
//       });

//       const labelBytes = await generateAwbLabelPdf({
//         awb: common.awb,
//         accountCode: common.accountCode,
//         bookDate: common.bookDate,
//         printedAt,

//         shipperName: common.shipperName,
//         shipperAddress: common.shipperAddress,
//         shipperCity: common.shipperCity,
//         shipperState: common.shipperState,
//         shipperPincode: common.shipperPincode,
//         shipperPhone: common.shipperPhone,
//         shipperCountry: common.shipperCountry,

//         consigneeName: common.consigneeName,
//         consigneeAddress: common.consigneeAddress,
//         consigneeCity: common.consigneeCity,
//         consigneeState: common.consigneeState,
//         consigneePincode: common.consigneePincode,
//         consigneePhone: common.consigneePhone,
//         consigneeCountry: common.consigneeCountry,

//         serviceType: common.serviceType,
//         product: common.product,
//         vendor: common.vendor,
//         customerReference: common.customerReference,

//         pieces: common.pieces,
//         actualWeight: common.actualWeight,
//         chargeableWeight: common.chargeableWeight,
//         dimensions: common.dimensions,

//         declaredValue: common.declaredValue,
//         currency: common.currency,
//         content: common.content,
//         csbType: common.csbType,
//         specialInstructions: common.specialInstructions,
//         origin: common.origin || common.placeOfLoading,
//       });

//       result.awbLabel = Buffer.from(labelBytes).toString("base64");
//     }

//     if (type === "proforma" || type === "both") {
//       const proformaBytes = await generateProformaInvoicePdf({
//         awb: common.awb,
//         invoiceNo: common.invoiceNo,
//         invoiceDate: common.invoiceDate,
//         accountCode: common.accountCode,
//         exporterRef: common.preCarriageBy,
//         shipperName: common.shipperName,
//         shipperAddress: common.shipperAddress,
//         shipperPhone: common.shipperPhone,
//         shipperTaxId: common.shipperTaxId,
//         shipperCity: common.shipperCity,
//         shipperState: common.shipperState,
//         shipperPincode: common.shipperPincode,
//         shipperCountry: common.shipperCountry,
//         consigneeName: common.consigneeName,
//         consigneeAddress: common.consigneeAddress,
//         consigneeCity: common.consigneeCity,
//         consigneeState: common.consigneeState,
//         consigneePincode: common.consigneePincode,
//         consigneeCountry: common.consigneeCountry,
//         consigneePhone: common.consigneePhone,
//         preCarriageBy: common.preCarriageBy,
//         placeOfLoading: common.placeOfLoading,
//         portOfDischarge: common.portOfDischarge,
//         finalDestination: common.finalDestination,
//         countryOfOrigin: common.countryOfOrigin,
//         countryOfDestination: common.countryOfDestination,
//         termOfDelivery: common.termOfDelivery,
//         otherReference: common.otherReference,
//         totalPieces: common.pieces,
//         packageType: "PKT",
//         actualWeight: common.actualWeight,
//         chargeableWeight: common.chargeableWeight,
//         declaredValue: common.declaredValue,
//         items: common.items,
//         totalAmount: common.totalAmount,
//       });

//       result.proforma = Buffer.from(proformaBytes).toString("base64");
//     }

//     return NextResponse.json(result);
//   } catch (error) {
//     console.error("POST /api/admin/logistics/generate-pdf", error);

//     return errorResponse(
//       "PDF_GENERATION_FAILED",
//       error instanceof Error
//         ? error.message
//         : "Unable to generate PDF.",
//       500,
//     );
//   }
// }
// import { NextRequest, NextResponse } from "next/server";
// import { getCurrentUser } from "@/lib/auth";
// import { can } from "@/lib/permissions";
// import { errorResponse } from "@/lib/api-response";

// import { generateAwbLabelPdf } from "@/lib/pdf/awbLabelGenerator";
// import { generateProformaInvoicePdf } from "@/lib/pdf/proformaInvoiceGenerator";

// type BoxKey = "BOX_1" | "BOX_2";

// type LineItem = {
//   description: string;
//   shopName: string;
//   shopAddress: string;
//   hsCode: string;
//   quantity: number;
//   weight?: number;
//   unitRate: number;
//   amount: number;
//   boxNo: BoxKey;
// };

// /** Normalize any box value to BOX_1 or BOX_2 */
// function toBoxKey(raw: unknown): BoxKey {
//   const s = String(raw ?? "BOX_1").toUpperCase().trim();
//   if (s.includes("2") || s === "2") return "BOX_2";
//   return "BOX_1";
// }

// export async function POST(request: NextRequest) {
//   try {
//     const user = await getCurrentUser(request);

//     if (!user) {
//       return errorResponse(
//         "UNAUTHENTICATED",
//         "Authentication is required.",
//         401,
//       );
//     }

//     if (
//       !can(user, "LOGISTICS_INVOICE_CREATE") &&
//       !can(user, "LOGISTICS_AWB_CREATE")
//     ) {
//       return errorResponse(
//         "FORBIDDEN",
//         "You do not have permission to generate logistics documents.",
//         403,
//       );
//     }

//     const body = await request.json();

//     const type = body.type as "awb-label" | "proforma" | "both";

//     if (!type || !["awb-label", "proforma", "both"].includes(type)) {
//       return errorResponse(
//         "INVALID_TYPE",
//         "type must be 'awb-label', 'proforma' or 'both'.",
//         400,
//       );
//     }

//     if (!body.awb) {
//       return errorResponse("AWB_REQUIRED", "awb is required.", 400);
//     }

//     // ---------- Line items (explicitly typed) ----------
//     const items: LineItem[] = Array.isArray(body.items)
//       ? body.items.map(
//           (item: Record<string, unknown>): LineItem => ({
//             description: String(item.description || ""),
//             shopName: String(item.shopName || ""),
//             shopAddress: String(item.shopAddress || ""),
//             hsCode: String(item.hsCode || ""),
//             quantity: Number(item.quantity || 1),
//             weight:
//               item.weight != null ? Number(item.weight) : undefined,
//             unitRate: Number(item.unitRate || item.rate || 0),
//             amount: Number(item.amount || 0),
//             boxNo: toBoxKey(item.boxNo),
//           }),
//         )
//       : [];

//     // ---------- Common data mapping ----------
//     const common = {
//       awb: String(body.awb).trim(),
//       accountCode: body.accountCode || "WF439",
//       bookDate:
//         body.bookDate ||
//         body.invoiceDate ||
//         new Date().toLocaleDateString("en-GB"),
//       invoiceNo:
//         body.invoiceNo || body.invoiceNumber || `INV-${body.awb}`,
//       invoiceDate:
//         body.invoiceDate ||
//         body.bookDate ||
//         new Date().toLocaleDateString("en-GB"),

//       shipperName: body.shipperName || "",
//       shipperAddress: body.shipperAddress || "",
//       shipperCity: body.shipperCity || "",
//       shipperState: body.shipperState || "",
//       shipperPincode: body.shipperPincode || "",
//       shipperPhone: body.shipperPhone || "",
//       shipperCountry: body.shipperCountry || "INDIA",
//       shipperTaxId: body.shipperTaxId || body.shipperGstin || "",

//       consigneeName: body.consigneeName || "",
//       consigneeAddress: body.consigneeAddress || "",
//       consigneeCity: body.consigneeCity || "",
//       consigneeState: body.consigneeState || "",
//       consigneePincode: body.consigneePincode || "",
//       consigneePhone: body.consigneePhone || "",
//       consigneeCountry: body.consigneeCountry || "U.S.A.",

//       serviceType:
//         body.serviceType || body.product || "SPX  INTERNATIONAL PRIORITY",
//       vendor:
//         body.vendor ||
//         body.preCarriageBy ||
//         "FEDERAL EXPRESS CORPORATION",
//       product: body.product || "",
//       customerReference:
//         body.customerReference || "SRESHTA COURIERS",
//       preCarriageBy: body.preCarriageBy || body.vendor || "FDX",
//       placeOfLoading: body.placeOfLoading || body.origin || "GUNTUR",
//       portOfDischarge: body.portOfDischarge || "",
//       finalDestination:
//         body.finalDestination || body.consigneeCountry || "U.S.A.",
//       countryOfOrigin: body.countryOfOrigin || "INDIA",
//       countryOfDestination:
//         body.countryOfDestination || body.consigneeCountry || "U.S.A.",
//       termOfDelivery:
//         body.termOfDelivery || body.termOfInvoice || "CIF",
//       otherReference:
//         body.otherReference ||
//         body.exportReason ||
//         "UNSOLICITED GIFT - NOT FOR SALE",
//       csbType: body.csbType || "CSB4",
//       content: body.content || "USED CLOTHES",
//       specialInstructions: body.specialInstructions || "",
//       origin: body.origin || body.placeOfLoading || "GUNTUR",

//       pieces: Number(body.pieces || body.totalPieces || 1),
//       actualWeight: Number(body.actualWeight || 0),
//       chargeableWeight: Number(
//         body.chargeableWeight || body.actualWeight || 0,
//       ),
//       dimensions: body.dimensions || "",
//       declaredValue: Number(body.declaredValue || 0),
//       currency: body.currency || "INR",
//       totalAmount: Number(body.totalAmount || 0),
//       items,
//     };

//     // ---------- Generate PDFs ----------
//     const result: {
//       success: boolean;
//       awbLabel?: string;
//       proforma?: string;
//       proformaByBox?: Array<{ boxNo: string; base64: string }>;
//       message?: string;
//     } = { success: true };

//     if (type === "awb-label" || type === "both") {
//       const printedAt = new Date().toLocaleString("en-IN", {
//         day: "2-digit",
//         month: "2-digit",
//         year: "numeric",
//         hour: "2-digit",
//         minute: "2-digit",
//       });

//       const labelBytes = await generateAwbLabelPdf({
//         awb: common.awb,
//         accountCode: common.accountCode,
//         bookDate: common.bookDate,
//         printedAt,
//         shipperName: common.shipperName,
//         shipperAddress: common.shipperAddress,
//         shipperCity: common.shipperCity,
//         shipperState: common.shipperState,
//         shipperPincode: common.shipperPincode,
//         shipperPhone: common.shipperPhone,
//         shipperCountry: common.shipperCountry,
//         consigneeName: common.consigneeName,
//         consigneeAddress: common.consigneeAddress,
//         consigneeCity: common.consigneeCity,
//         consigneeState: common.consigneeState,
//         consigneePincode: common.consigneePincode,
//         consigneePhone: common.consigneePhone,
//         consigneeCountry: common.consigneeCountry,
//         serviceType: common.serviceType,
//         product: common.product,
//         vendor: common.vendor,
//         customerReference: common.customerReference,
//         pieces: common.pieces,
//         actualWeight: common.actualWeight,
//         chargeableWeight: common.chargeableWeight,
//         dimensions: common.dimensions,
//         declaredValue: common.declaredValue,
//         currency: common.currency,
//         content: common.content,
//         csbType: common.csbType,
//         specialInstructions: common.specialInstructions,
//         origin: common.origin || common.placeOfLoading,
//       });

//       result.awbLabel = Buffer.from(labelBytes).toString("base64");
//     }

//     if (type === "proforma" || type === "both") {
//       const allItems: LineItem[] = common.items;

//       const box1Items: LineItem[] = allItems.filter(
//         (it: LineItem) => it.boxNo === "BOX_1",
//       );
//       const box2Items: LineItem[] = allItems.filter(
//         (it: LineItem) => it.boxNo === "BOX_2",
//       );

//       const boxes: Array<{ key: BoxKey; items: LineItem[] }> = [];

//       if (box1Items.length > 0) {
//         boxes.push({ key: "BOX_1", items: box1Items });
//       }
//       if (box2Items.length > 0) {
//         boxes.push({ key: "BOX_2", items: box2Items });
//       }

//       // No items / no tags → single Box 1 proforma
//       if (boxes.length === 0) {
//         boxes.push({ key: "BOX_1", items: allItems });
//       }

//       const proformaByBox: Array<{ boxNo: string; base64: string }> = [];

//       for (const box of boxes) {
//         const boxTotal: number = box.items.reduce(
//           (sum: number, it: LineItem) => sum + Number(it.amount || 0),
//           0,
//         );

//         const invoiceSuffix = box.key === "BOX_2" ? "-B2" : "-B1";
//         const boxNumber = box.key === "BOX_2" ? 2 : 1;

//         const proformaBytes = await generateProformaInvoicePdf({
//           awb: common.awb,
//           invoiceNo: `${common.invoiceNo}${invoiceSuffix}`,
//           invoiceDate: common.invoiceDate,
//           accountCode: common.accountCode,
//           exporterRef: common.preCarriageBy,
//           shipperName: common.shipperName,
//           shipperAddress: common.shipperAddress,
//           shipperPhone: common.shipperPhone,
//           shipperTaxId: common.shipperTaxId,
//           shipperCity: common.shipperCity,
//           shipperState: common.shipperState,
//           shipperPincode: common.shipperPincode,
//           shipperCountry: common.shipperCountry,
//           consigneeName: common.consigneeName,
//           consigneeAddress: common.consigneeAddress,
//           consigneeCity: common.consigneeCity,
//           consigneeState: common.consigneeState,
//           consigneePincode: common.consigneePincode,
//           consigneeCountry: common.consigneeCountry,
//           consigneePhone: common.consigneePhone,
//           preCarriageBy: common.preCarriageBy,
//           placeOfLoading: common.placeOfLoading,
//           portOfDischarge: common.portOfDischarge,
//           finalDestination: common.finalDestination,
//           countryOfOrigin: common.countryOfOrigin,
//           countryOfDestination: common.countryOfDestination,
//           termOfDelivery: common.termOfDelivery,
//           otherReference: common.otherReference,
//           totalPieces: common.pieces,
//           packageType: "PKT",
//           actualWeight: common.actualWeight,
//           chargeableWeight: common.chargeableWeight,
//           declaredValue: boxTotal || common.declaredValue,
//           items: box.items.map((it: LineItem) => ({
//             description: it.description,
//             shopName: it.shopName,
//             shopAddress: it.shopAddress,
//             hsCode: it.hsCode,
//             quantity: it.quantity,
//             weight: it.weight,
//             unitRate: it.unitRate,
//             amount: it.amount,
//             boxNo: boxNumber,
//           })),
//           totalAmount: boxTotal || common.totalAmount,
//         });

//         proformaByBox.push({
//           boxNo: box.key,
//           base64: Buffer.from(proformaBytes).toString("base64"),
//         });
//       }

//       result.proforma = proformaByBox[0]?.base64;
//       result.proformaByBox = proformaByBox;

//       if (proformaByBox.length > 1) {
//         result.message =
//           "Separate proforma invoices generated for Box-1 and Box-2.";
//       }
//     }

//     return NextResponse.json(result);
//   } catch (error) {
//     console.error("POST /api/admin/logistics/generate-pdf", error);
//     return errorResponse(
//       "PDF_GENERATION_FAILED",
//       error instanceof Error
//         ? error.message
//         : "Unable to generate PDF.",
//       500,
//     );
//   }
// }

// import { NextRequest, NextResponse } from "next/server";
// import { PDFDocument } from "pdf-lib";

// import { getCurrentUser } from "@/lib/auth";
// import { can } from "@/lib/permissions";
// import { errorResponse } from "@/lib/api-response";

// import { generateAwbLabelPdf } from "@/lib/pdf/awbLabelGenerator";
// import { generateProformaInvoicePdf } from "@/lib/pdf/proformaInvoiceGenerator";
// import { generateManifestPdf, bytesToBase64 } from "@/lib/manifest-pdf";

// type BoxKey = "BOX_1" | "BOX_2";

// type LineItem = {
//   description: string;
//   shopName: string;
//   shopAddress: string;
//   hsCode: string;
//   quantity: number;
//   weight?: number;
//   unitRate: number;
//   amount: number;
//   boxNo: BoxKey;
// };

// function toBoxKey(raw: unknown): BoxKey {
//   const s = String(raw ?? "BOX_1").toUpperCase().trim();
//   if (s.includes("2") || s === "2") return "BOX_2";
//   return "BOX_1";
// }

// /** Merge several PDFs into one multi-page PDF (Box-1, then Box-2, …). */
// async function mergePdfBytes(parts: Uint8Array[]): Promise<Uint8Array> {
//   if (parts.length === 0) {
//     throw new Error("No proforma pages to merge.");
//   }
//   if (parts.length === 1) {
//     return parts[0]!;
//   }

//   const merged = await PDFDocument.create();
//   for (const part of parts) {
//     const src = await PDFDocument.load(part);
//     const pages = await merged.copyPages(src, src.getPageIndices());
//     for (const p of pages) {
//       merged.addPage(p);
//     }
//   }
//   return merged.save();
// }

// export async function POST(request: NextRequest) {
//   try {
//     const user = await getCurrentUser(request);

//     if (!user) {
//       return errorResponse(
//         "UNAUTHENTICATED",
//         "Authentication is required.",
//         401,
//       );
//     }

//     if (
//       !can(user, "LOGISTICS_INVOICE_CREATE") &&
//       !can(user, "LOGISTICS_AWB_CREATE")
//     ) {
//       return errorResponse(
//         "FORBIDDEN",
//         "You do not have permission to generate logistics documents.",
//         403,
//       );
//     }

//     const body = await request.json();

//     const type = body.type as "awb-label" | "proforma" | "both";

//     if (!type || !["awb-label", "proforma", "both"].includes(type)) {
//       return errorResponse(
//         "INVALID_TYPE",
//         "type must be 'awb-label', 'proforma' or 'both'.",
//         400,
//       );
//     }

//     if (!body.awb) {
//       return errorResponse("AWB_REQUIRED", "awb is required.", 400);
//     }

    

//     const items: LineItem[] = Array.isArray(body.items)
//       ? body.items.map(
//           (item: Record<string, unknown>): LineItem => ({
//             description: String(item.description || ""),
//             shopName: String(item.shopName || ""),
//             shopAddress: String(item.shopAddress || ""),
//             hsCode: String(item.hsCode || ""),
//             quantity: Number(item.quantity || 1),
//             weight: item.weight != null ? Number(item.weight) : undefined,
//             unitRate: Number(item.unitRate || item.rate || 0),
//             amount: Number(item.amount || 0),
//             boxNo: toBoxKey(item.boxNo),
//           }),
//         )
//       : [];

//     const common = {
//       awb: String(body.awb).trim(),
//       accountCode: body.accountCode || "WF439",
//       bookDate:
//         body.bookDate ||
//         body.invoiceDate ||
//         new Date().toLocaleDateString("en-GB"),
//       invoiceNo:
//         body.invoiceNo || body.invoiceNumber || `INV-${body.awb}`,
//       invoiceDate:
//         body.invoiceDate ||
//         body.bookDate ||
//         new Date().toLocaleDateString("en-GB"),

//       shipperName: body.shipperName || "",
//       shipperAddress: body.shipperAddress || "",
//       shipperCity: body.shipperCity || "",
//       shipperState: body.shipperState || "",
//       shipperPincode: body.shipperPincode || "",
//       shipperPhone: body.shipperPhone || "",
//       shipperCountry: body.shipperCountry || "INDIA",
//       shipperTaxId: body.shipperTaxId || body.shipperGstin || "",

//       consigneeName: body.consigneeName || "",
//       consigneeAddress: body.consigneeAddress || "",
//       consigneeCity: body.consigneeCity || "",
//       consigneeState: body.consigneeState || "",
//       consigneePincode: body.consigneePincode || "",
//       consigneePhone: body.consigneePhone || "",
//       consigneeCountry: body.consigneeCountry || "U.S.A.",

//       serviceType:
//         body.serviceType || body.product || "SPX  INTERNATIONAL PRIORITY",
//       vendor:
//         body.vendor ||
//         body.preCarriageBy ||
//         "FEDERAL EXPRESS CORPORATION",
//       product: body.product || "",
//       customerReference:
//         body.customerReference || "SRESHTA COURIERS",
//       preCarriageBy: body.preCarriageBy || body.vendor || "FDX",
//       placeOfLoading: body.placeOfLoading || body.origin || "GUNTUR",
//       portOfDischarge: body.portOfDischarge || "",
//       finalDestination:
//         body.finalDestination || body.consigneeCountry || "U.S.A.",
//       countryOfOrigin: body.countryOfOrigin || "INDIA",
//       countryOfDestination:
//         body.countryOfDestination || body.consigneeCountry || "U.S.A.",
//       termOfDelivery:
//         body.termOfDelivery || body.termOfInvoice || "CIF",
//       otherReference:
//         body.otherReference ||
//         body.exportReason ||
//         "UNSOLICITED GIFT - NOT FOR SALE",
//       csbType: body.csbType || "CSB4",
//       content: body.content || "USED CLOTHES",
//       specialInstructions: body.specialInstructions || "",
//       origin: body.origin || body.placeOfLoading || "GUNTUR",

//       pieces: Number(body.pieces || body.totalPieces || 1),
//       actualWeight: Number(body.actualWeight || 0),
//       chargeableWeight: Number(
//         body.chargeableWeight || body.actualWeight || 0,
//       ),
//       dimensions: body.dimensions || "",
//       declaredValue: Number(body.declaredValue || 0),
//       currency: body.currency || "INR",
//       totalAmount: Number(body.totalAmount || 0),
//       items,
//     };

//     const result: {
//       success: boolean;
//       awbLabel?: string;
//       proforma?: string;
//       proformaByBox?: Array<{ boxNo: string; base64: string }>;
//       message?: string;
//     } = { success: true };

//     if (type === "awb-label" || type === "both") {
//       const printedAt = new Date().toLocaleString("en-IN", {
//         day: "2-digit",
//         month: "2-digit",
//         year: "numeric",
//         hour: "2-digit",
//         minute: "2-digit",
//       });

//       const labelBytes = await generateAwbLabelPdf({
//         awb: common.awb,
//         accountCode: common.accountCode,
//         bookDate: common.bookDate,
//         printedAt,
//         shipperName: common.shipperName,
//         shipperAddress: common.shipperAddress,
//         shipperCity: common.shipperCity,
//         shipperState: common.shipperState,
//         shipperPincode: common.shipperPincode,
//         shipperPhone: common.shipperPhone,
//         shipperCountry: common.shipperCountry,
//         consigneeName: common.consigneeName,
//         consigneeAddress: common.consigneeAddress,
//         consigneeCity: common.consigneeCity,
//         consigneeState: common.consigneeState,
//         consigneePincode: common.consigneePincode,
//         consigneePhone: common.consigneePhone,
//         consigneeCountry: common.consigneeCountry,
//         serviceType: common.serviceType,
//         product: common.product,
//         vendor: common.vendor,
//         customerReference: common.customerReference,
//         pieces: common.pieces,
//         actualWeight: common.actualWeight,
//         chargeableWeight: common.chargeableWeight,
//         dimensions: common.dimensions,
//         declaredValue: common.declaredValue,
//         currency: common.currency,
//         content: common.content,
//         csbType: common.csbType,
//         specialInstructions: common.specialInstructions,
//         origin: common.origin || common.placeOfLoading,
//       });

//       result.awbLabel = Buffer.from(labelBytes).toString("base64");
//     }

//     if (type === "proforma" || type === "both") {
//       const allItems: LineItem[] = common.items;

//       const box1Items = allItems.filter((it) => it.boxNo === "BOX_1");
//       const box2Items = allItems.filter((it) => it.boxNo === "BOX_2");

//       const boxes: Array<{ key: BoxKey; items: LineItem[] }> = [];

//       if (box1Items.length > 0) {
//         boxes.push({ key: "BOX_1", items: box1Items });
//       }
//       if (box2Items.length > 0) {
//         boxes.push({ key: "BOX_2", items: box2Items });
//       }

//       // No box tags → single Box-1 proforma
//       if (boxes.length === 0) {
//         boxes.push({ key: "BOX_1", items: allItems });
//       }

//       const proformaBytesList: Uint8Array[] = [];
//       const proformaByBox: Array<{ boxNo: string; base64: string }> = [];

//       for (const box of boxes) {
//         const boxTotal = box.items.reduce(
//           (sum, it) => sum + Number(it.amount || 0),
//           0,
//         );

//         const invoiceSuffix = box.key === "BOX_2" ? "-B2" : "-B1";
//         const boxNumber = box.key === "BOX_2" ? 2 : 1;

//         const proformaBytes = await generateProformaInvoicePdf({
//           awb: common.awb,
//           invoiceNo: `${common.invoiceNo}${invoiceSuffix}`,
//           invoiceDate: common.invoiceDate,
//           accountCode: common.accountCode,
//           exporterRef: common.preCarriageBy,
//           shipperName: common.shipperName,
//           shipperAddress: common.shipperAddress,
//           shipperPhone: common.shipperPhone,
//           shipperTaxId: common.shipperTaxId,
//           shipperCity: common.shipperCity,
//           shipperState: common.shipperState,
//           shipperPincode: common.shipperPincode,
//           shipperCountry: common.shipperCountry,
//           consigneeName: common.consigneeName,
//           consigneeAddress: common.consigneeAddress,
//           consigneeCity: common.consigneeCity,
//           consigneeState: common.consigneeState,
//           consigneePincode: common.consigneePincode,
//           consigneeCountry: common.consigneeCountry,
//           consigneePhone: common.consigneePhone,
//           preCarriageBy: common.preCarriageBy,
//           placeOfLoading: common.placeOfLoading,
//           portOfDischarge: common.portOfDischarge,
//           finalDestination: common.finalDestination,
//           countryOfOrigin: common.countryOfOrigin,
//           countryOfDestination: common.countryOfDestination,
//           termOfDelivery: common.termOfDelivery,
//           otherReference: common.otherReference,
//           totalPieces: common.pieces,
//           packageType: "PKT",
//           actualWeight: common.actualWeight,
//           chargeableWeight: common.chargeableWeight,
//           declaredValue: boxTotal || common.declaredValue,
//           items: box.items.map((it) => ({
//             description: it.description,
//             shopName: it.shopName,
//             shopAddress: it.shopAddress,
//             hsCode: it.hsCode,
//             quantity: it.quantity,
//             weight: it.weight,
//             unitRate: it.unitRate,
//             amount: it.amount,
//             boxNo: boxNumber,
//           })),
//           totalAmount: boxTotal || common.totalAmount,
//         });

//         proformaBytesList.push(proformaBytes);
//         proformaByBox.push({
//           boxNo: box.key,
//           base64: Buffer.from(proformaBytes).toString("base64"),
//         });
//       }

//       // One PDF: page(s) for Box-1, then page(s) for Box-2
//       const mergedBytes = await mergePdfBytes(proformaBytesList);

//       result.proforma = Buffer.from(mergedBytes).toString("base64");
//       result.proformaByBox = proformaByBox; // optional; not used for download

//       if (proformaByBox.length > 1) {
//         result.message =
//           "Combined proforma invoice generated (Box-1 and Box-2 in one PDF).";
//       }
//     }

//     return NextResponse.json(result);
//   } catch (error) {
//     console.error("POST /api/admin/logistics/generate-pdf", error);
//     return errorResponse(
//       "PDF_GENERATION_FAILED",
//       error instanceof Error
//         ? error.message
//         : "Unable to generate PDF.",
//       500,
//     );
//   }
// }

// import { NextRequest, NextResponse } from "next/server";
// import { PDFDocument } from "pdf-lib";
// import { getCurrentUser } from "@/lib/auth";
// import { can } from "@/lib/permissions";
// import { errorResponse } from "@/lib/api-response";
// import { generateAwbLabelPdf } from "@/lib/pdf/awbLabelGenerator";
// import { generateProformaInvoicePdf } from "@/lib/pdf/proformaInvoiceGenerator";
// import { generateManifestPdf, bytesToBase64 } from "@/lib/manifest-pdf";

// type BoxKey = "BOX_1" | "BOX_2";

// type LineItem = {
//   description: string;
//   shopName: string;
//   shopAddress: string;
//   hsCode: string;
//   quantity: number;
//   weight?: number;
//   unitRate: number;
//   amount: number;
//   boxNo: BoxKey;
// };

// function toBoxKey(raw: unknown): BoxKey {
//   const s = String(raw ?? "BOX_1").toUpperCase().trim();
//   if (s.includes("2") || s === "2") return "BOX_2";
//   return "BOX_1";
// }

// /** Merge several PDFs into one multi-page PDF (Box-1, then Box-2, …). */
// async function mergePdfBytes(parts: Uint8Array[]): Promise<Uint8Array> {
//   if (parts.length === 0) {
//     throw new Error("No proforma pages to merge.");
//   }
//   if (parts.length === 1) {
//     return parts[0]!;
//   }
//   const merged = await PDFDocument.create();
//   for (const part of parts) {
//     const src = await PDFDocument.load(part);
//     const pages = await merged.copyPages(src, src.getPageIndices());
//     for (const p of pages) {
//       merged.addPage(p);
//     }
//   }
//   return merged.save();
// }

// function formatManifestDate(raw: unknown): string {
//   const s = String(raw || "").trim();
//   if (!s) {
//     return new Date().toLocaleDateString("en-GB"); // DD/MM/YYYY
//   }
//   // YYYY-MM-DD → DD-MM-YYYY
//   if (/^\d{4}-\d{2}-\d{2}/.test(s)) {
//     const [y, m, d] = s.slice(0, 10).split("-");
//     return `${d}-${m}-${y}`;
//   }
//   // already DD-MM-YYYY or similar
//   return s;
// }

// export async function POST(request: NextRequest) {
//   try {
//     const user = await getCurrentUser(request);
//     if (!user) {
//       return errorResponse(
//         "UNAUTHENTICATED",
//         "Authentication is required.",
//         401,
//       );
//     }

//     if (
//       !can(user, "LOGISTICS_INVOICE_CREATE") &&
//       !can(user, "LOGISTICS_AWB_CREATE")
//     ) {
//       return errorResponse(
//         "FORBIDDEN",
//         "You do not have permission to generate logistics documents.",
//         403,
//       );
//     }

//     const body = await request.json();
//     const type = body.type as "awb-label" | "proforma" | "both" | "manifest";

//     if (
//       !type ||
//       !["awb-label", "proforma", "both", "manifest"].includes(type)
//     ) {
//       return errorResponse(
//         "INVALID_TYPE",
//         "type must be 'awb-label', 'proforma', 'both' or 'manifest'.",
//         400,
//       );
//     }

//     if (!body.awb) {
//       return errorResponse("AWB_REQUIRED", "awb is required.", 400);
//     }

//     // ── Manifest (single-AWB or multi-line) ──────────────────────────
//     if (type === "manifest") {
//       const dateLabel = formatManifestDate(body.bookDate || body.date);
//       const manifestNo = String(
//         body.manifestNo ||
//           body.accountCode ||
//           body.customerCode ||
//           body.awb ||
//           Date.now().toString().slice(-6),
//       );

//       const lines =
//         Array.isArray(body.lines) && body.lines.length > 0
//           ? body.lines.map((row: Record<string, unknown>) => ({
//               awb: String(row.awb || body.awb || ""),
//               forwardingNo: String(
//                 row.forwardingNo ||
//                   row.trackingNo ||
//                   row.awb ||
//                   body.forwardingNo ||
//                   body.awb ||
//                   "",
//               ),
//               country: String(
//                 row.country ||
//                   row.consigneeCountry ||
//                   body.consigneeCountry ||
//                   body.destination ||
//                   "",
//               ),
//               consignee: String(
//                 row.consignee ||
//                   row.consigneeName ||
//                   body.consigneeName ||
//                   "",
//               ),
//               pcs: Number(row.pcs ?? row.pieces ?? body.pieces ?? 1),
//               weightKg: Number(
//                 row.weightKg ??
//                   row.actualWeight ??
//                   body.actualWeight ??
//                   body.chargeableWeight ??
//                   0,
//               ),
//             }))
//           : [
//               {
//                 awb: String(body.awb || ""),
//                 forwardingNo: String(
//                   body.forwardingNo || body.trackingNo || body.awb || "",
//                 ),
//                 country: String(
//                   body.consigneeCountry || body.destination || "",
//                 ),
//                 consignee: String(body.consigneeName || ""),
//                 pcs: Number(body.pieces || body.totalPieces || 1),
//                 weightKg: Number(
//                   body.actualWeight || body.chargeableWeight || 0,
//                 ),
//               },
//             ];

//       const bytes = await generateManifestPdf({
//         customerName: String(
//           body.customerName || body.shipperName || "Customer",
//         ),
//         customerCode: String(
//           body.accountCode || body.customerCode || "",
//         ),
//         manifestNo,
//         date: dateLabel,
//         lines,
//         totalAmount: Number(body.totalAmount || 0),
//       });

//       return NextResponse.json({
//         success: true,
//         manifest: bytesToBase64(bytes),
//       });
//     }

//     const items: LineItem[] = Array.isArray(body.items)
//       ? body.items.map(
//           (item: Record<string, unknown>): LineItem => ({
//             description: String(item.description || ""),
//             shopName: String(item.shopName || ""),
//             shopAddress: String(item.shopAddress || ""),
//             hsCode: String(item.hsCode || ""),
//             quantity: Number(item.quantity || 1),
//             weight: item.weight != null ? Number(item.weight) : undefined,
//             unitRate: Number(item.unitRate || item.rate || 0),
//             amount: Number(item.amount || 0),
//             boxNo: toBoxKey(item.boxNo),
//           }),
//         )
//       : [];

//     const common = {
//       awb: String(body.awb).trim(),
//       accountCode: body.accountCode || "WF439",
//       bookDate:
//         body.bookDate ||
//         body.invoiceDate ||
//         new Date().toLocaleDateString("en-GB"),
//       invoiceNo:
//         body.invoiceNo || body.invoiceNumber || `INV-${body.awb}`,
//       invoiceDate:
//         body.invoiceDate ||
//         body.bookDate ||
//         new Date().toLocaleDateString("en-GB"),
//       shipperName: body.shipperName || "",
//       shipperAddress: body.shipperAddress || "",
//       shipperCity: body.shipperCity || "",
//       shipperState: body.shipperState || "",
//       shipperPincode: body.shipperPincode || "",
//       shipperPhone: body.shipperPhone || "",
//       shipperCountry: body.shipperCountry || "INDIA",
//       shipperTaxId: body.shipperTaxId || body.shipperGstin || "",
//       consigneeName: body.consigneeName || "",
//       consigneeAddress: body.consigneeAddress || "",
//       consigneeCity: body.consigneeCity || "",
//       consigneeState: body.consigneeState || "",
//       consigneePincode: body.consigneePincode || "",
//       consigneePhone: body.consigneePhone || "",
//       consigneeCountry: body.consigneeCountry || "U.S.A.",
//       serviceType:
//         body.serviceType || body.product || "SPX  INTERNATIONAL PRIORITY",
//       vendor:
//         body.vendor ||
//         body.preCarriageBy ||
//         "FEDERAL EXPRESS CORPORATION",
//       product: body.product || "",
//       customerReference:
//         body.customerReference || "SRESHTA COURIERS",
//       preCarriageBy: body.preCarriageBy || body.vendor || "FDX",
//       placeOfLoading: body.placeOfLoading || body.origin || "GUNTUR",
//       portOfDischarge: body.portOfDischarge || "",
//       finalDestination:
//         body.finalDestination || body.consigneeCountry || "U.S.A.",
//       countryOfOrigin: body.countryOfOrigin || "INDIA",
//       countryOfDestination:
//         body.countryOfDestination || body.consigneeCountry || "U.S.A.",
//       termOfDelivery:
//         body.termOfDelivery || body.termOfInvoice || "CIF",
//       otherReference:
//         body.otherReference ||
//         body.exportReason ||
//         "UNSOLICITED GIFT - NOT FOR SALE",
//       csbType: body.csbType || "CSB4",
//       content: body.content || "USED CLOTHES",
//       specialInstructions: body.specialInstructions || "",
//       origin: body.origin || body.placeOfLoading || "GUNTUR",
//       pieces: Number(body.pieces || body.totalPieces || 1),
//       actualWeight: Number(body.actualWeight || 0),
//       chargeableWeight: Number(
//         body.chargeableWeight || body.actualWeight || 0,
//       ),
//       dimensions: body.dimensions || "",
//       declaredValue: Number(body.declaredValue || 0),
//       currency: body.currency || "INR",
//       totalAmount: Number(body.totalAmount || 0),
//       items,
//     };

//     const result: {
//       success: boolean;
//       awbLabel?: string;
//       proforma?: string;
//       proformaByBox?: Array<{ boxNo: string; base64: string }>;
//       message?: string;
//     } = { success: true };

//     if (type === "awb-label" || type === "both") {
//       const printedAt = new Date().toLocaleString("en-IN", {
//         day: "2-digit",
//         month: "2-digit",
//         year: "numeric",
//         hour: "2-digit",
//         minute: "2-digit",
//       });
//       const labelBytes = await generateAwbLabelPdf({
//         awb: common.awb,
//         accountCode: common.accountCode,
//         bookDate: common.bookDate,
//         printedAt,
//         shipperName: common.shipperName,
//         shipperAddress: common.shipperAddress,
//         shipperCity: common.shipperCity,
//         shipperState: common.shipperState,
//         shipperPincode: common.shipperPincode,
//         shipperPhone: common.shipperPhone,
//         shipperCountry: common.shipperCountry,
//         consigneeName: common.consigneeName,
//         consigneeAddress: common.consigneeAddress,
//         consigneeCity: common.consigneeCity,
//         consigneeState: common.consigneeState,
//         consigneePincode: common.consigneePincode,
//         consigneePhone: common.consigneePhone,
//         consigneeCountry: common.consigneeCountry,
//         serviceType: common.serviceType,
//         product: common.product,
//         vendor: common.vendor,
//         customerReference: common.customerReference,
//         pieces: common.pieces,
//         actualWeight: common.actualWeight,
//         chargeableWeight: common.chargeableWeight,
//         dimensions: common.dimensions,
//         declaredValue: common.declaredValue,
//         currency: common.currency,
//         content: common.content,
//         csbType: common.csbType,
//         specialInstructions: common.specialInstructions,
//         origin: common.origin || common.placeOfLoading,
//       });
//       result.awbLabel = Buffer.from(labelBytes).toString("base64");
//     }

//     if (type === "proforma" || type === "both") {
//       const allItems: LineItem[] = common.items;
//       const box1Items = allItems.filter((it) => it.boxNo === "BOX_1");
//       const box2Items = allItems.filter((it) => it.boxNo === "BOX_2");
//       const boxes: Array<{ key: BoxKey; items: LineItem[] }> = [];
//       if (box1Items.length > 0) {
//         boxes.push({ key: "BOX_1", items: box1Items });
//       }
//       if (box2Items.length > 0) {
//         boxes.push({ key: "BOX_2", items: box2Items });
//       }
//       if (boxes.length === 0) {
//         boxes.push({ key: "BOX_1", items: allItems });
//       }

//       const proformaBytesList: Uint8Array[] = [];
//       const proformaByBox: Array<{ boxNo: string; base64: string }> = [];

//       for (const box of boxes) {
//         const boxTotal = box.items.reduce(
//           (sum, it) => sum + Number(it.amount || 0),
//           0,
//         );
//         const invoiceSuffix = box.key === "BOX_2" ? "-B2" : "-B1";
//         const boxNumber = box.key === "BOX_2" ? 2 : 1;
//         const proformaBytes = await generateProformaInvoicePdf({
//           awb: common.awb,
//           invoiceNo: `${common.invoiceNo}${invoiceSuffix}`,
//           invoiceDate: common.invoiceDate,
//           accountCode: common.accountCode,
//           exporterRef: common.preCarriageBy,
//           shipperName: common.shipperName,
//           shipperAddress: common.shipperAddress,
//           shipperPhone: common.shipperPhone,
//           shipperTaxId: common.shipperTaxId,
//           shipperCity: common.shipperCity,
//           shipperState: common.shipperState,
//           shipperPincode: common.shipperPincode,
//           shipperCountry: common.shipperCountry,
//           consigneeName: common.consigneeName,
//           consigneeAddress: common.consigneeAddress,
//           consigneeCity: common.consigneeCity,
//           consigneeState: common.consigneeState,
//           consigneePincode: common.consigneePincode,
//           consigneeCountry: common.consigneeCountry,
//           consigneePhone: common.consigneePhone,
//           preCarriageBy: common.preCarriageBy,
//           placeOfLoading: common.placeOfLoading,
//           portOfDischarge: common.portOfDischarge,
//           finalDestination: common.finalDestination,
//           countryOfOrigin: common.countryOfOrigin,
//           countryOfDestination: common.countryOfDestination,
//           termOfDelivery: common.termOfDelivery,
//           otherReference: common.otherReference,
//           totalPieces: common.pieces,
//           packageType: "PKT",
//           actualWeight: common.actualWeight,
//           chargeableWeight: common.chargeableWeight,
//           declaredValue: boxTotal || common.declaredValue,
//           items: box.items.map((it) => ({
//             description: it.description,
//             shopName: it.shopName,
//             shopAddress: it.shopAddress,
//             hsCode: it.hsCode,
//             quantity: it.quantity,
//             weight: it.weight,
//             unitRate: it.unitRate,
//             amount: it.amount,
//             boxNo: boxNumber,
//           })),
//           totalAmount: boxTotal || common.totalAmount,
//         });
//         proformaBytesList.push(proformaBytes);
//         proformaByBox.push({
//           boxNo: box.key,
//           base64: Buffer.from(proformaBytes).toString("base64"),
//         });
//       }

//       const mergedBytes = await mergePdfBytes(proformaBytesList);
//       result.proforma = Buffer.from(mergedBytes).toString("base64");
//       result.proformaByBox = proformaByBox;
//       if (proformaByBox.length > 1) {
//         result.message =
//           "Combined proforma invoice generated (Box-1 and Box-2 in one PDF).";
//       }
//     }

//     return NextResponse.json(result);
//   } catch (error) {
//     console.error("POST /api/admin/logistics/generate-pdf", error);
//     return errorResponse(
//       "PDF_GENERATION_FAILED",
//       error instanceof Error
//         ? error.message
//         : "Unable to generate PDF.",
//       500,
//     );
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";
import { getCurrentUser } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { errorResponse } from "@/lib/api-response";
import { generateAwbLabelPdf } from "@/lib/pdf/awbLabelGenerator";
import { generateProformaInvoicePdf } from "@/lib/pdf/proformaInvoiceGenerator";
import { generateManifestPdf, bytesToBase64 } from "@/lib/manifest-pdf";

type BoxKey = "BOX_1" | "BOX_2";

type LineItem = {
  description: string;
  shopName: string;
  shopAddress: string;
  hsCode: string;
  quantity: number;
  weight?: number;
  unitRate: number;
  amount: number;
  boxNo: BoxKey;
};

function toBoxKey(raw: unknown): BoxKey {
  const s = String(raw ?? "BOX_1").toUpperCase().trim();
  if (s.includes("2") || s === "2") return "BOX_2";
  return "BOX_1";
}

/** Merge several PDFs into one multi-page PDF (Box-1, then Box-2, …). */
async function mergePdfBytes(parts: Uint8Array[]): Promise<Uint8Array> {
  if (parts.length === 0) {
    throw new Error("No proforma pages to merge.");
  }
  if (parts.length === 1) {
    return parts[0]!;
  }
  const merged = await PDFDocument.create();
  for (const part of parts) {
    const src = await PDFDocument.load(part);
    const pages = await merged.copyPages(src, src.getPageIndices());
    for (const p of pages) {
      merged.addPage(p);
    }
  }
  return merged.save();
}

function formatManifestDate(raw: unknown): string {
  const s = String(raw || "").trim();
  if (!s) {
    return new Date().toLocaleDateString("en-GB");
  }
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) {
    const [y, m, d] = s.slice(0, 10).split("-");
    return `${d}-${m}-${y}`;
  }
  return s;
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return errorResponse(
        "UNAUTHENTICATED",
        "Authentication is required.",
        401,
      );
    }

    if (
      !can(user, "LOGISTICS_INVOICE_CREATE") &&
      !can(user, "LOGISTICS_AWB_CREATE")
    ) {
      return errorResponse(
        "FORBIDDEN",
        "You do not have permission to generate logistics documents.",
        403,
      );
    }

    const body = await request.json();
    const type = body.type as "awb-label" | "proforma" | "both" | "manifest";

    if (
      !type ||
      !["awb-label", "proforma", "both", "manifest"].includes(type)
    ) {
      return errorResponse(
        "INVALID_TYPE",
        "type must be 'awb-label', 'proforma', 'both' or 'manifest'.",
        400,
      );
    }

    if (!body.awb) {
      return errorResponse("AWB_REQUIRED", "awb is required.", 400);
    }

    // ── Manifest ───────────────────────────────────────────────────
    if (type === "manifest") {
      const dateLabel = formatManifestDate(body.bookDate || body.date);
      const manifestNo = String(
        body.manifestNo ||
          body.accountCode ||
          body.customerCode ||
          body.awb ||
          Date.now().toString().slice(-6),
      );

      const lines =
        Array.isArray(body.lines) && body.lines.length > 0
          ? body.lines.map((row: Record<string, unknown>) => ({
              awb: String(row.awb || body.awb || ""),
              forwardingNo: String(
                row.forwardingNo ||
                  row.trackingNo ||
                  row.awb ||
                  body.forwardingNo ||
                  body.awb ||
                  "",
              ),
              country: String(
                row.country ||
                  row.consigneeCountry ||
                  body.consigneeCountry ||
                  body.destination ||
                  "",
              ),
              consignee: String(
                row.consignee ||
                  row.consigneeName ||
                  body.consigneeName ||
                  "",
              ),
              pcs: Number(row.pcs ?? row.pieces ?? body.pieces ?? 1),
              weightKg: Number(
                row.weightKg ??
                  row.actualWeight ??
                  body.actualWeight ??
                  body.chargeableWeight ??
                  0,
              ),
            }))
          : [
              {
                awb: String(body.awb || ""),
                forwardingNo: String(
                  body.forwardingNo || body.trackingNo || body.awb || "",
                ),
                country: String(
                  body.consigneeCountry || body.destination || "",
                ),
                consignee: String(body.consigneeName || ""),
                pcs: Number(body.pieces || body.totalPieces || 1),
                weightKg: Number(
                  body.actualWeight || body.chargeableWeight || 0,
                ),
              },
            ];

      const bytes = await generateManifestPdf({
        customerName: String(
          body.customerName || body.shipperName || "Customer",
        ),
        customerCode: String(body.accountCode || body.customerCode || ""),
        manifestNo,
        date: dateLabel,
        lines,
        totalAmount: Number(body.totalAmount || 0),
      });

      return NextResponse.json({
        success: true,
        manifest: bytesToBase64(bytes),
      });
    }

    const items: LineItem[] = Array.isArray(body.items)
      ? body.items.map(
          (item: Record<string, unknown>): LineItem => ({
            description: String(item.description || ""),
            shopName: String(item.shopName || ""),
            shopAddress: String(item.shopAddress || ""),
            hsCode: String(item.hsCode || ""),
            quantity: Number(item.quantity || 1),
            weight: item.weight != null ? Number(item.weight) : undefined,
            unitRate: Number(item.unitRate || item.rate || 0),
            amount: Number(item.amount || 0),
            boxNo: toBoxKey(item.boxNo),
          }),
        )
      : [];

          // After `items` is built…
    const contentFromItems = items
      .map((it) => {
        const desc = String(it.description || "").trim();
        const shop = String(it.shopName || "").trim();
        if (!desc && !shop) return "";
        if (desc && shop) return `${desc} (${shop})`;
        return desc || shop;
      })
      .filter(Boolean)
      .join("; ");

    const contentText =
      contentFromItems ||
      String(body.content || body.description || "").trim() ||
      "USED CLOTHES";

    const specialInstructions = String(
      body.specialInstructions ||
        body.instruction ||
        body.instructions ||
        "",
    ).trim();

    const consigneePhone = String(
      body.consigneePhone ||
        body.consigneeMobile ||
        body.receiverPhone ||
        body.receiverMobile ||
        "",
    ).trim();

    // Co-loader / client name → CUSTOMER REFERENCE on AWB label
    const customerReference = String(
      body.customerReference ||
        body.customerName ||
        body.coLoaderName ||
        body.accountName ||
        "SRESHTA COURIERS",
    ).trim();

    const common = {
      awb: String(body.awb).trim(),
      accountCode: body.accountCode || "WF439",
      bookDate:
        body.bookDate ||
        body.invoiceDate ||
        new Date().toLocaleDateString("en-GB"),
      invoiceNo:
        body.invoiceNo || body.invoiceNumber || `INV-${body.awb}`,
      invoiceDate:
        body.invoiceDate ||
        body.bookDate ||
        new Date().toLocaleDateString("en-GB"),
      shipperName: body.shipperName || "",
      shipperAddress: body.shipperAddress || "",
      shipperCity: body.shipperCity || "",
      shipperState: body.shipperState || "",
      shipperPincode: body.shipperPincode || "",
      shipperPhone: body.shipperPhone || "",
      shipperCountry: body.shipperCountry || "INDIA",
      shipperTaxId: body.shipperTaxId || body.shipperGstin || "",
      consigneeName: body.consigneeName || "",
      consigneeAddress: body.consigneeAddress || "",
      consigneeCity: body.consigneeCity || "",
      consigneeState: body.consigneeState || "",
      consigneePincode: body.consigneePincode || "",
      consigneePhone,
      content: contentText,
      specialInstructions,
      consigneeMobile: String(
        body.consigneeMobile || body.receiverMobile || consigneePhone,
      ).trim(),
      consigneeCountry: body.consigneeCountry || "U.S.A.",
      serviceType:
        body.serviceType || body.product || "SPX  INTERNATIONAL PRIORITY",
      vendor:
        body.vendor ||
        body.preCarriageBy ||
        "FEDERAL EXPRESS CORPORATION",
      product: body.product || "",
      customerReference,
      preCarriageBy: body.preCarriageBy || body.vendor || "FDX",
      placeOfLoading: body.placeOfLoading || body.origin || "GUNTUR",
      portOfDischarge: body.portOfDischarge || "",
      finalDestination:
        body.finalDestination || body.consigneeCountry || "U.S.A.",
      countryOfOrigin: body.countryOfOrigin || "INDIA",
      countryOfDestination:
        body.countryOfDestination || body.consigneeCountry || "U.S.A.",
      termOfDelivery:
        body.termOfDelivery || body.termOfInvoice || "CIF",
      otherReference:
        body.otherReference ||
        body.exportReason ||
        "UNSOLICITED GIFT - NOT FOR SALE",
      csbType: body.csbType || "CSB4",
      // content: body.content || "USED CLOTHES",
      // specialInstructions: body.specialInstructions || "",
      origin: body.origin || body.placeOfLoading || "GUNTUR",
      pieces: Number(body.pieces || body.totalPieces || 1),
      actualWeight: Number(body.actualWeight || 0),
      chargeableWeight: Number(
        body.chargeableWeight || body.actualWeight || 0,
      ),
      dimensions: body.dimensions || "",
      declaredValue: Number(body.declaredValue || 0),
      currency: body.currency || "INR",
      totalAmount: Number(body.totalAmount || 0),
      items,
    };

    const result: {
      success: boolean;
      awbLabel?: string;
      proforma?: string;
      proformaByBox?: Array<{ boxNo: string; base64: string }>;
      message?: string;
    } = { success: true };

    if (type === "awb-label" || type === "both") {
      const printedAt = new Date().toLocaleString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      const labelBytes = await generateAwbLabelPdf({
        awb: common.awb,
        accountCode: common.accountCode,
        bookDate: common.bookDate,
        printedAt,
        shipperName: common.shipperName,
        shipperAddress: common.shipperAddress,
        shipperCity: common.shipperCity,
        shipperState: common.shipperState,
        shipperPincode: common.shipperPincode,
        shipperPhone: common.shipperPhone,
        shipperCountry: common.shipperCountry,
        consigneeName: common.consigneeName,
        consigneeAddress: common.consigneeAddress,
        consigneeCity: common.consigneeCity,
        consigneeState: common.consigneeState,
        consigneePincode: common.consigneePincode,
        consigneePhone: common.consigneePhone,
        consigneeMobile: common.consigneeMobile,
        consigneeCountry: common.consigneeCountry,
        serviceType: common.serviceType,
        product: common.product,
        vendor: common.vendor,
        customerReference: common.customerReference,
        pieces: common.pieces,
        actualWeight: common.actualWeight,
        chargeableWeight: common.chargeableWeight,
        dimensions: common.dimensions,
        declaredValue: common.declaredValue,
        currency: common.currency,
        content: common.content,
        csbType: common.csbType,
        specialInstructions: common.specialInstructions,
        origin: common.origin || common.placeOfLoading,
      });
      result.awbLabel = Buffer.from(labelBytes).toString("base64");
    }

    if (type === "proforma" || type === "both") {
      const allItems: LineItem[] = common.items;
      const box1Items = allItems.filter((it) => it.boxNo === "BOX_1");
      const box2Items = allItems.filter((it) => it.boxNo === "BOX_2");
      const boxes: Array<{ key: BoxKey; items: LineItem[] }> = [];
      if (box1Items.length > 0) {
        boxes.push({ key: "BOX_1", items: box1Items });
      }
      if (box2Items.length > 0) {
        boxes.push({ key: "BOX_2", items: box2Items });
      }
      if (boxes.length === 0) {
        boxes.push({ key: "BOX_1", items: allItems });
      }

      const proformaBytesList: Uint8Array[] = [];
      const proformaByBox: Array<{ boxNo: string; base64: string }> = [];

      for (const box of boxes) {
        const boxTotal = box.items.reduce(
          (sum, it) => sum + Number(it.amount || 0),
          0,
        );
        const invoiceSuffix = box.key === "BOX_2" ? "-B2" : "-B1";
        const boxNumber = box.key === "BOX_2" ? 2 : 1;
        const proformaBytes = await generateProformaInvoicePdf({
          awb: common.awb,
          invoiceNo: `${common.invoiceNo}${invoiceSuffix}`,
          invoiceDate: common.invoiceDate,
          accountCode: common.accountCode,
          exporterRef: common.preCarriageBy,
          shipperName: common.shipperName,
          shipperAddress: common.shipperAddress,
          shipperPhone: common.shipperPhone,
          shipperTaxId: common.shipperTaxId,
          shipperCity: common.shipperCity,
          shipperState: common.shipperState,
          shipperPincode: common.shipperPincode,
          shipperCountry: common.shipperCountry,
          consigneeName: common.consigneeName,
          consigneeAddress: common.consigneeAddress,
          consigneeCity: common.consigneeCity,
          consigneeState: common.consigneeState,
          consigneePincode: common.consigneePincode,
          consigneeCountry: common.consigneeCountry,
          consigneePhone: common.consigneePhone,
          preCarriageBy: common.preCarriageBy,
          placeOfLoading: common.placeOfLoading,
          portOfDischarge: common.portOfDischarge,
          finalDestination: common.finalDestination,
          countryOfOrigin: common.countryOfOrigin,
          countryOfDestination: common.countryOfDestination,
          termOfDelivery: common.termOfDelivery,
          otherReference: common.otherReference,
          totalPieces: common.pieces,
          packageType: "PKT",
          actualWeight: common.actualWeight,
          chargeableWeight: common.chargeableWeight,
          declaredValue: boxTotal || common.declaredValue,
          items: box.items.map((it) => ({
            description: it.description,
            shopName: it.shopName,
            shopAddress: it.shopAddress,
            hsCode: it.hsCode,
            quantity: it.quantity,
            weight: it.weight,
            unitRate: it.unitRate,
            amount: it.amount,
            boxNo: boxNumber,
          })),
          totalAmount: boxTotal || common.totalAmount,
        });
        proformaBytesList.push(proformaBytes);
        proformaByBox.push({
          boxNo: box.key,
          base64: Buffer.from(proformaBytes).toString("base64"),
        });
      }

      const mergedBytes = await mergePdfBytes(proformaBytesList);
      result.proforma = Buffer.from(mergedBytes).toString("base64");
      result.proformaByBox = proformaByBox;
      if (proformaByBox.length > 1) {
        result.message =
          "Combined proforma invoice generated (Box-1 and Box-2 in one PDF).";
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("POST /api/admin/logistics/generate-pdf", error);
    return errorResponse(
      "PDF_GENERATION_FAILED",
      error instanceof Error
        ? error.message
        : "Unable to generate PDF.",
      500,
    );
  }
}