// import { NextRequest } from "next/server";

// import {
//   adminDb,
// } from "@/lib/firebase-admin";

// import {
//   getCurrentUser,
// } from "@/lib/auth";

// import {
//   can,
// } from "@/lib/permissions";

// import {
//   writeAuditLog,
// } from "@/lib/audit";

// import {
//   successResponse,
//   errorResponse,
// } from "@/lib/api-response";

// import {
//   isValidGSTIN,
//   isValidAWB,
//   positiveNumber,
// } from "@/utils/validators";

// type UpdateAWBBody = {
//   awb?: string;

//   customerId?: string;
//   senderId?: string;
//   receiverId?: string;

//   origin?: string;
//   destination?: string;

//   serviceId?: string;
//   serviceType?: string;

//   shipmentDate?: string;
//   description?: string;

//   gstin?: string;

//   charges?: {
//     freight?: number;
//     fuelSurcharge?: number;
//     handlingCharges?: number;
//     pickupCharges?: number;
//     deliveryCharges?: number;
//     otherCharges?: number;
//     discount?: number;
//   };
// };

// export async function PATCH(
//   request: NextRequest,
// ) {
//   try {
//     const user =
//       await getCurrentUser(request);

//     if (!user) {
//       return errorResponse(
//         "UNAUTHENTICATED",
//         "Authentication is required.",
//         401,
//       );
//     }

//     if (
//       !can(
//         user,
//         "LOGISTICS_AWB_UPDATE",
//       )
//     ) {
//       return errorResponse(
//         "FORBIDDEN",
//         "You do not have permission to update an AWB.",
//         403,
//       );
//     }

//     let body: UpdateAWBBody;

//     try {
//       body =
//         await request.json();
//     } catch {
//       return errorResponse(
//         "INVALID_JSON",
//         "Invalid JSON request body.",
//         400,
//       );
//     }

//     const awb =
//       body.awb?.trim();

//     if (
//       !awb ||
//       !isValidAWB(awb)
//     ) {
//       return errorResponse(
//         "INVALID_AWB",
//         "A valid AWB is required.",
//         400,
//       );
//     }

//     const query =
//       await adminDb
//         .collection("awbs")
//         .where(
//           "awb",
//           "==",
//           awb,
//         )
//         .limit(1)
//         .get();

//     if (query.empty) {
//       return errorResponse(
//         "AWB_NOT_FOUND",
//         "AWB was not found.",
//         404,
//       );
//     }

//     const doc =
//       query.docs[0];

//     const current =
//       doc.data();

//     const updates: Record<
//       string,
//       unknown
//     > = {
//       updatedBy:
//         user.userId,
//       updatedAt:
//         new Date().toISOString(),
//     };

//     const directFields = [
//       "customerId",
//       "senderId",
//       "receiverId",
//       "origin",
//       "destination",
//       "serviceId",
//       "serviceType",
//       "shipmentDate",
//       "description",
//     ] as const;

//     for (const field of directFields) {
//       const value =
//         body[field];

//       if (
//         typeof value ===
//         "string"
//       ) {
//         updates[field] =
//           value.trim();
//       }
//     }

//     if (body.gstin !== undefined) {
//       const gstin =
//         body.gstin.trim();

//       if (
//         gstin &&
//         !isValidGSTIN(gstin)
//       ) {
//         return errorResponse(
//           "INVALID_GSTIN",
//           "GSTIN is invalid.",
//           400,
//         );
//       }

//       updates[
//         "gstDetails.gstin"
//       ] = gstin || null;
//     }

//     if (body.charges) {
//       const oldCharges =
//         current.charges ?? {};

//       const freight =
//         body.charges.freight !==
//         undefined
//           ? positiveNumber(
//               body.charges.freight,
//               "freight",
//             )
//           : Number(
//               oldCharges.freight ?? 0,
//             );

//       const fuelSurcharge =
//         body.charges
//           .fuelSurcharge !==
//         undefined
//           ? positiveNumber(
//               body.charges
//                 .fuelSurcharge,
//               "fuelSurcharge",
//             )
//           : Number(
//               oldCharges.fuelSurcharge ??
//                 0,
//             );

//       const handlingCharges =
//         body.charges
//           .handlingCharges !==
//         undefined
//           ? positiveNumber(
//               body.charges
//                 .handlingCharges,
//               "handlingCharges",
//             )
//           : Number(
//               oldCharges
//                 .handlingCharges ??
//                 0,
//             );

//       const pickupCharges =
//         body.charges
//           .pickupCharges !==
//         undefined
//           ? positiveNumber(
//               body.charges
//                 .pickupCharges,
//               "pickupCharges",
//             )
//           : Number(
//               oldCharges.pickupCharges ??
//                 0,
//             );

//       const deliveryCharges =
//         body.charges
//           .deliveryCharges !==
//         undefined
//           ? positiveNumber(
//               body.charges
//                 .deliveryCharges,
//               "deliveryCharges",
//             )
//           : Number(
//               oldCharges
//                 .deliveryCharges ??
//                 0,
//             );

//       const otherCharges =
//         body.charges
//           .otherCharges !==
//         undefined
//           ? positiveNumber(
//               body.charges
//                 .otherCharges,
//               "otherCharges",
//             )
//           : Number(
//               oldCharges
//                 .otherCharges ??
//                 0,
//             );

//       const discount =
//         body.charges.discount !==
//         undefined
//           ? positiveNumber(
//               body.charges.discount,
//               "discount",
//             )
//           : Number(
//               oldCharges.discount ??
//                 0,
//             );

//       const taxableAmount =
//         Math.max(
//           0,
//           freight +
//             fuelSurcharge +
//             handlingCharges +
//             pickupCharges +
//             deliveryCharges +
//             otherCharges -
//             discount,
//         );

//       const gstRate =
//         Number(
//           current.gstRate ?? 18,
//         );

//       const gst =
//         taxableAmount *
//         (gstRate / 100);

//       updates.charges = {
//         freight,
//         fuelSurcharge,
//         handlingCharges,
//         pickupCharges,
//         deliveryCharges,
//         otherCharges,
//         discount,
//         taxableAmount,
//         gst,
//         total:
//           taxableAmount + gst,
//       };

//       updates[
//         "gstDetails.taxableAmount"
//       ] = taxableAmount;

//       updates[
//         "gstDetails.cgst"
//       ] = gst / 2;

//       updates[
//         "gstDetails.sgst"
//       ] = gst / 2;

//       updates[
//         "gstDetails.totalTax"
//       ] = gst;
//     }

//     await doc.ref.update(
//       updates,
//     );

//     await writeAuditLog({
//       userId:
//         user.userId,
//       action:
//         "AWB_UPDATED",
//       resourceType:
//         "AWB",
//       resourceId:
//         awb,
//       metadata: {
//         fields:
//           Object.keys(
//             updates,
//           ),
//       },
//     });

//     const updated =
//       await doc.ref.get();

//     return successResponse(
//       {
//         awb:
//           updated.data(),
//       },
//       200,
//       "AWB updated successfully.",
//     );
//   } catch (error) {
//     console.error(
//       "PATCH /api/logistics/awb/update:",
//       error,
//     );

//     return errorResponse(
//       "AWB_UPDATE_FAILED",
//       error instanceof Error
//         ? error.message
//         : "Unable to update AWB.",
//       500,
//     );
//   }
// }

// import { NextRequest } from "next/server";

// import { adminDb } from "@/lib/firebase-admin";
// import { getCurrentUser } from "@/lib/auth";
// import { can } from "@/lib/permissions";
// import { writeAuditLog } from "@/lib/audit";
// import { successResponse, errorResponse } from "@/lib/api-response";
// import {
//   isValidGSTIN,
//   isValidAWB,
//   positiveNumber,
//   positiveInteger,
// } from "@/utils/validators";
// import {
//   calculateChargeableWeight,
//   calculateVolumetricWeight,
// } from "@/utils/calculations";

// type PieceInput = {
//   quantity?: number;
//   actualWeightKg?: number;
//   lengthCm?: number;
//   widthCm?: number;
//   heightCm?: number;
//   description?: string;
//   division?: number;
// };

// type UpdateAWBBody = {
//   awb?: string;
//   existingAwb?: string;

//   customerId?: string;
//   customerName?: string;
//   customerCode?: string;
//   accountCode?: string;

//   origin?: string;
//   originCode?: string;
//   destination?: string;
//   destinationCode?: string;

//   serviceId?: string;
//   serviceType?: string;
//   service?: string;
//   product?: string;
//   vendor?: string;

//   shipmentDate?: string;
//   description?: string;
//   content?: string;
//   instruction?: string;

//   shipper?: Record<string, unknown>;
//   consignee?: Record<string, unknown>;
//   pieces?: PieceInput[];
//   items?: unknown[];

//   gstin?: string;
//   csbType?: string;
//   termOfInvoice?: string;
//   exportReason?: string;
//   gstInvoice?: boolean;
//   invoiceNo?: string;
//   invoiceDate?: string;
//   departmentNo?: string;
//   format?: string;

//   freight?: number;
//   fuelSurcharge?: number;
//   handlingCharges?: number;
//   pickupCharges?: number;
//   deliveryCharges?: number;
//   otherCharges?: number;
//   discount?: number;
//   gstRate?: number;
//   charges?: {
//     freight?: number;
//     fuelSurcharge?: number;
//     handlingCharges?: number;
//     pickupCharges?: number;
//     deliveryCharges?: number;
//     otherCharges?: number;
//     contractCharges?: number;
//     surcharge?: number;
//     discount?: number;
//     additionalCharges?: unknown[];
//     cgst?: number;
//     sgst?: number;
//     igst?: number;
//   };

//   paymentType?: string;
//   referenceNo?: string;
//   commercial?: boolean;
//   oda?: boolean;
//   medicalCharges?: boolean;
//   totalPieces?: number;
//   packageType?: string;
//   actualWeight?: number;
//   volumetricWeight?: number;
//   chargeableWeight?: number;
//   shipmentValue?: number;
//   currency?: string;
// };

// function str(v: unknown, fallback = ""): string {
//   if (v == null) return fallback;
//   return String(v).trim() || fallback;
// }

// export async function PATCH(request: NextRequest) {
//   try {
//     const user = await getCurrentUser(request);

//     if (!user) {
//       return errorResponse(
//         "UNAUTHENTICATED",
//         "Authentication is required.",
//         401,
//       );
//     }

//     if (!can(user, "LOGISTICS_AWB_UPDATE")) {
//       return errorResponse(
//         "FORBIDDEN",
//         "You do not have permission to update an AWB.",
//         403,
//       );
//     }

//     let body: UpdateAWBBody;
//     try {
//       body = await request.json();
//     } catch {
//       return errorResponse("INVALID_JSON", "Invalid JSON request body.", 400);
//     }

//     const awb = str(body.awb || body.existingAwb);

//     if (!awb || !isValidAWB(awb)) {
//       return errorResponse("INVALID_AWB", "A valid AWB is required.", 400);
//     }

//     const query = await adminDb
//       .collection("awbs")
//       .where("awb", "==", awb)
//       .limit(1)
//       .get();

//     if (query.empty) {
//       return errorResponse("AWB_NOT_FOUND", "AWB was not found.", 404);
//     }

//     const doc = query.docs[0]!;
//     const current = doc.data() || {};
//     const canManageCharges = user.role === "SUPER_ADMIN";

//     const updates: Record<string, unknown> = {
//       updatedBy: user.userId,
//       updatedAt: new Date().toISOString(),
//     };

//     const stringFields: Array<[keyof UpdateAWBBody, string]> = [
//       ["customerId", "customerId"],
//       ["customerName", "customerName"],
//       ["customerCode", "customerCode"],
//       ["accountCode", "accountCode"],
//       ["origin", "origin"],
//       ["originCode", "originCode"],
//       ["destination", "destination"],
//       ["destinationCode", "destinationCode"],
//       ["serviceId", "serviceId"],
//       ["serviceType", "serviceType"],
//       ["service", "service"],
//       ["product", "product"],
//       ["vendor", "vendor"],
//       ["shipmentDate", "shipmentDate"],
//       ["description", "description"],
//       ["content", "content"],
//       ["instruction", "instruction"],
//       ["csbType", "csbType"],
//       ["termOfInvoice", "termOfInvoice"],
//       ["exportReason", "exportReason"],
//       ["invoiceNo", "invoiceNo"],
//       ["invoiceDate", "invoiceDate"],
//       ["departmentNo", "departmentNo"],
//       ["format", "format"],
//       ["paymentType", "paymentType"],
//       ["referenceNo", "referenceNo"],
//       ["packageType", "packageType"],
//       ["currency", "currency"],
//     ];

//     for (const [bodyKey, docKey] of stringFields) {
//       const value = body[bodyKey];
//       if (typeof value === "string") {
//         updates[docKey] = value.trim();
//       }
//     }

//     if (body.gstInvoice !== undefined) {
//       updates.gstInvoice = Boolean(body.gstInvoice);
//     }
//     if (body.commercial !== undefined) {
//       updates.commercial = Boolean(body.commercial);
//     }
//     if (body.oda !== undefined) {
//       updates.oda = Boolean(body.oda);
//     }
//     if (body.medicalCharges !== undefined) {
//       updates.medicalCharges = Boolean(body.medicalCharges);
//     }
//     if (body.shipmentValue !== undefined) {
//       updates.shipmentValue = Number(body.shipmentValue) || 0;
//     }
//     if (body.totalPieces !== undefined) {
//       updates.totalPieces = Number(body.totalPieces) || 0;
//     }

//     if (body.shipper && typeof body.shipper === "object") {
//       updates.shipper = body.shipper;
//       const originFromShipper = str(
//         body.shipper.origin || body.origin || current.origin,
//       );
//       const originCodeFromShipper = str(
//         body.shipper.originCode || body.originCode || current.originCode,
//       );
//       if (originFromShipper) updates.origin = originFromShipper;
//       if (originCodeFromShipper) updates.originCode = originCodeFromShipper;
//     }

//     if (body.consignee && typeof body.consignee === "object") {
//       updates.consignee = body.consignee;
//     }

//     if (Array.isArray(body.items)) {
//       updates.items = body.items;
//     }

//     if (Array.isArray(body.pieces) && body.pieces.length > 0) {
//       const pieces = body.pieces.map((piece, index) => {
//         const quantity = positiveInteger(
//           piece.quantity ?? 1,
//           `pieces[${index}].quantity`,
//         );
//         const actualWeight = positiveNumber(
//           piece.actualWeightKg ?? 0,
//           `pieces[${index}].actualWeightKg`,
//         );
//         const lengthCm = positiveNumber(
//           piece.lengthCm ?? 0,
//           `pieces[${index}].lengthCm`,
//         );
//         const widthCm = positiveNumber(
//           piece.widthCm ?? 0,
//           `pieces[${index}].widthCm`,
//         );
//         const heightCm = positiveNumber(
//           piece.heightCm ?? 0,
//           `pieces[${index}].heightCm`,
//         );
//         const division =
//           Number(piece.division) > 0 ? Number(piece.division) : 5000;

//         const volumetricWeight =
//           calculateVolumetricWeight(lengthCm, widthCm, heightCm, division) *
//           quantity;
//         const chargeableWeight = calculateChargeableWeight(
//           actualWeight * quantity,
//           volumetricWeight,
//         );

//         return {
//           pieceId: `piece_${index + 1}`,
//           quantity,
//           actualWeight,
//           volumetricWeight,
//           chargeableWeight,
//           weightUnit: "KG" as const,
//           dimensions: {
//             length: lengthCm,
//             width: widthCm,
//             height: heightCm,
//             unit: "CM" as const,
//             boxCount: quantity,
//           },
//           description: piece.description?.trim(),
//           division,
//         };
//       });

//       const actualWeightKg = pieces.reduce(
//         (total, piece) => total + piece.actualWeight * piece.quantity,
//         0,
//       );
//       const volumetricWeightKg = pieces.reduce(
//         (total, piece) => total + (piece.volumetricWeight ?? 0),
//         0,
//       );
//       const chargeableWeightKg = calculateChargeableWeight(
//         actualWeightKg,
//         volumetricWeightKg,
//       );

//       updates.pieces = pieces;
//       updates.actualWeightKg = actualWeightKg;
//       updates.volumetricWeightKg = volumetricWeightKg;
//       updates.chargeableWeightKg = chargeableWeightKg;
//       updates.actualWeight = actualWeightKg;
//       updates.volumetricWeight = volumetricWeightKg;
//       updates.chargeableWeight = chargeableWeightKg;
//       updates.totalPieces = pieces.reduce((n, p) => n + p.quantity, 0);
//     } else {
//       if (body.actualWeight !== undefined) {
//         updates.actualWeight = Number(body.actualWeight) || 0;
//         updates.actualWeightKg = Number(body.actualWeight) || 0;
//       }
//       if (body.volumetricWeight !== undefined) {
//         updates.volumetricWeight = Number(body.volumetricWeight) || 0;
//         updates.volumetricWeightKg = Number(body.volumetricWeight) || 0;
//       }
//       if (body.chargeableWeight !== undefined) {
//         updates.chargeableWeight = Number(body.chargeableWeight) || 0;
//         updates.chargeableWeightKg = Number(body.chargeableWeight) || 0;
//       }
//     }

//     const gstin =
//       body.gstin !== undefined
//         ? str(body.gstin)
//         : str(body.shipper?.gstin);

//     if (body.gstin !== undefined || body.shipper?.gstin !== undefined) {
//       if (gstin && !isValidGSTIN(gstin)) {
//         return errorResponse("INVALID_GSTIN", "GSTIN is invalid.", 400);
//       }
//       updates["gstDetails.gstin"] = gstin || null;
//     }

//     if (canManageCharges) {
//       const oldCharges = (current.charges || {}) as Record<string, number>;
//       const ch = body.charges || {};

//       const freight =
//         body.freight !== undefined
//           ? positiveNumber(body.freight, "freight")
//           : ch.freight !== undefined
//             ? positiveNumber(ch.freight, "freight")
//             : Number(oldCharges.freight ?? 0);

//       const fuelSurcharge =
//         body.fuelSurcharge !== undefined
//           ? positiveNumber(body.fuelSurcharge, "fuelSurcharge")
//           : ch.fuelSurcharge !== undefined
//             ? positiveNumber(ch.fuelSurcharge, "fuelSurcharge")
//             : Number(oldCharges.fuelSurcharge ?? 0);

//       const otherCharges =
//         body.otherCharges !== undefined
//           ? positiveNumber(body.otherCharges, "otherCharges")
//           : ch.otherCharges !== undefined
//             ? positiveNumber(ch.otherCharges, "otherCharges")
//             : Number(oldCharges.otherCharges ?? 0);

//       const discount =
//         body.discount !== undefined
//           ? positiveNumber(body.discount, "discount")
//           : ch.discount !== undefined
//             ? positiveNumber(ch.discount, "discount")
//             : Number(oldCharges.discount ?? 0);

//       const handlingCharges = Number(
//         ch.handlingCharges ?? oldCharges.handlingCharges ?? 0,
//       );
//       const pickupCharges = Number(
//         ch.pickupCharges ?? oldCharges.pickupCharges ?? 0,
//       );
//       const deliveryCharges = Number(
//         ch.deliveryCharges ?? oldCharges.deliveryCharges ?? 0,
//       );

//       const taxableAmount = Math.max(
//         0,
//         freight +
//           fuelSurcharge +
//           handlingCharges +
//           pickupCharges +
//           deliveryCharges +
//           otherCharges -
//           discount,
//       );

//       const gstRate = Number(body.gstRate ?? current.gstRate ?? 18);
//       const gst = taxableAmount * (gstRate / 100);

//       updates.charges = {
//         freight,
//         fuelSurcharge,
//         handlingCharges,
//         pickupCharges,
//         deliveryCharges,
//         otherCharges,
//         contractCharges: Number(ch.contractCharges ?? 0),
//         surcharge: Number(ch.surcharge ?? 0),
//         discount,
//         additionalCharges: Array.isArray(ch.additionalCharges)
//           ? ch.additionalCharges
//           : [],
//         taxableAmount,
//         gst,
//         total: taxableAmount + gst,
//         cgst: Number(ch.cgst ?? gst / 2),
//         sgst: Number(ch.sgst ?? gst / 2),
//         igst: Number(ch.igst ?? 0),
//         currency: "INR",
//       };

//       updates["gstDetails.taxableAmount"] = taxableAmount;
//       updates["gstDetails.cgst"] = gst / 2;
//       updates["gstDetails.sgst"] = gst / 2;
//       updates["gstDetails.totalTax"] = gst;
//       if (gstin) updates["gstDetails.gstin"] = gstin;
//     }

//     // Never change the AWB number
//     delete updates.awb;

//     await doc.ref.update(updates);

//     await writeAuditLog({
//       userId: user.userId,
//       action: "AWB_UPDATED",
//       resourceType: "AWB",
//       resourceId: awb,
//       module: "LOGISTICS",
//       metadata: {
//         fields: Object.keys(updates),
//       },
//     });

//     const updated = await doc.ref.get();
//     const data = updated.data() || {};

//     return successResponse(
//       {
//         awb, // string — same AWB
//         documentId: doc.id,
//         shipment: data,
//       },
//       200,
//       "AWB updated successfully.",
//     );
//   } catch (error) {
//     console.error("PATCH /api/logistics/awb/update:", error);

//     if (
//       error instanceof Error &&
//       /is required|must be a valid|cannot be negative/i.test(error.message)
//     ) {
//       return errorResponse("VALIDATION_ERROR", error.message, 400);
//     }

//     return errorResponse(
//       "AWB_UPDATE_FAILED",
//       error instanceof Error ? error.message : "Unable to update AWB.",
//       500,
//     );
//   }
// }


// import { NextRequest } from "next/server";

// import { adminDb } from "@/lib/firebase-admin";
// import { getCurrentUser } from "@/lib/auth";
// import { can } from "@/lib/permissions";
// import { writeAuditLog } from "@/lib/audit";
// import { successResponse, errorResponse } from "@/lib/api-response";
// import {
//   isValidGSTIN,
//   isValidAWB,
//   positiveNumber,
//   positiveInteger,
// } from "@/utils/validators";
// import {
//   calculateChargeableWeight,
//   calculateVolumetricWeight,
// } from "@/utils/calculations";

// type PieceInput = {
//   quantity?: number;
//   actualWeightKg?: number;
//   lengthCm?: number;
//   widthCm?: number;
//   heightCm?: number;
//   description?: string;
//   division?: number;
// };

// type UpdateAWBBody = {
//   awb?: string;
//   existingAwb?: string;

//   customerId?: string;
//   customerName?: string;
//   customerCode?: string;
//   accountCode?: string;

//   origin?: string;
//   originCode?: string;
//   destination?: string;
//   destinationCode?: string;

//   serviceId?: string;
//   serviceType?: string;
//   service?: string;
//   product?: string;
//   vendor?: string;

//   shipmentDate?: string;
//   description?: string;
//   content?: string;
//   instruction?: string;

//   shipper?: Record<string, unknown>;
//   consignee?: Record<string, unknown>;
//   pieces?: PieceInput[];
//   items?: unknown[];

//   gstin?: string;
//   csbType?: string;
//   termOfInvoice?: string;
//   exportReason?: string;
//   gstInvoice?: boolean;
//   invoiceNo?: string;
//   invoiceDate?: string;
//   departmentNo?: string;
//   format?: string;

//   freight?: number;
//   fuelSurcharge?: number;
//   handlingCharges?: number;
//   pickupCharges?: number;
//   deliveryCharges?: number;
//   otherCharges?: number;
//   discount?: number;
//   gstRate?: number;
//   charges?: {
//     freight?: number;
//     fuelSurcharge?: number;
//     handlingCharges?: number;
//     pickupCharges?: number;
//     deliveryCharges?: number;
//     otherCharges?: number;
//     contractCharges?: number;
//     surcharge?: number;
//     discount?: number;
//     additionalCharges?: unknown[];
//     cgst?: number;
//     sgst?: number;
//     igst?: number;
//   };

//   paymentType?: string;
//   referenceNo?: string;
//   commercial?: boolean;
//   oda?: boolean;
//   medicalCharges?: boolean;
//   totalPieces?: number;
//   packageType?: string;
//   actualWeight?: number;
//   volumetricWeight?: number;
//   chargeableWeight?: number;
//   shipmentValue?: number;
//   currency?: string;
// };

// function str(v: unknown, fallback = ""): string {
//   if (v == null) return fallback;
//   return String(v).trim() || fallback;
// }

// export async function PATCH(request: NextRequest) {
//   try {
//     const user = await getCurrentUser(request);

//     if (!user) {
//       return errorResponse(
//         "UNAUTHENTICATED",
//         "Authentication is required.",
//         401,
//       );
//     }

//     if (!can(user, "LOGISTICS_AWB_UPDATE")) {
//       return errorResponse(
//         "FORBIDDEN",
//         "You do not have permission to update an AWB.",
//         403,
//       );
//     }

//     let body: UpdateAWBBody;
//     try {
//       body = await request.json();
//     } catch {
//       return errorResponse("INVALID_JSON", "Invalid JSON request body.", 400);
//     }

//     const awb = str(body.awb || body.existingAwb);

//     if (!awb || !isValidAWB(awb)) {
//       return errorResponse("INVALID_AWB", "A valid AWB is required.", 400);
//     }

//     const query = await adminDb
//       .collection("awbs")
//       .where("awb", "==", awb)
//       .limit(1)
//       .get();

//     if (query.empty) {
//       return errorResponse("AWB_NOT_FOUND", "AWB was not found.", 404);
//     }

//     const doc = query.docs[0]!;
//     const current = doc.data() || {};
//     const isSuperAdmin = user.role === "SUPER_ADMIN";

//     const updates: Record<string, unknown> = {
//       updatedBy: user.userId,
//       updatedAt: new Date().toISOString(),
//     };

//     const stringFields: Array<[keyof UpdateAWBBody, string]> = [
//       ["customerId", "customerId"],
//       ["customerName", "customerName"],
//       ["customerCode", "customerCode"],
//       ["accountCode", "accountCode"],
//       ["origin", "origin"],
//       ["originCode", "originCode"],
//       ["destination", "destination"],
//       ["destinationCode", "destinationCode"],
//       ["serviceId", "serviceId"],
//       ["serviceType", "serviceType"],
//       ["service", "service"],
//       ["product", "product"],
//       ["vendor", "vendor"],
//       ["shipmentDate", "shipmentDate"],
//       ["description", "description"],
//       ["content", "content"],
//       ["instruction", "instruction"],
//       ["csbType", "csbType"],
//       ["termOfInvoice", "termOfInvoice"],
//       ["exportReason", "exportReason"],
//       ["invoiceNo", "invoiceNo"],
//       ["invoiceDate", "invoiceDate"],
//       ["departmentNo", "departmentNo"],
//       ["format", "format"],
//       ["paymentType", "paymentType"],
//       ["referenceNo", "referenceNo"],
//       ["packageType", "packageType"],
//       ["currency", "currency"],
//     ];

//     for (const [bodyKey, docKey] of stringFields) {
//       const value = body[bodyKey];
//       if (typeof value === "string") {
//         updates[docKey] = value.trim();
//       }
//     }

//     if (body.gstInvoice !== undefined) {
//       updates.gstInvoice = Boolean(body.gstInvoice);
//     }
//     if (body.commercial !== undefined) {
//       updates.commercial = Boolean(body.commercial);
//     }
//     if (body.oda !== undefined) {
//       updates.oda = Boolean(body.oda);
//     }
//     if (body.medicalCharges !== undefined) {
//       updates.medicalCharges = Boolean(body.medicalCharges);
//     }
//     if (body.shipmentValue !== undefined) {
//       updates.shipmentValue = Number(body.shipmentValue) || 0;
//     }
//     if (body.totalPieces !== undefined) {
//       updates.totalPieces = Number(body.totalPieces) || 0;
//     }

//     if (body.shipper && typeof body.shipper === "object") {
//       updates.shipper = body.shipper;
//       const originFromShipper = str(
//         body.shipper.origin || body.origin || current.origin,
//       );
//       const originCodeFromShipper = str(
//         body.shipper.originCode || body.originCode || current.originCode,
//       );
//       if (originFromShipper) updates.origin = originFromShipper;
//       if (originCodeFromShipper) updates.originCode = originCodeFromShipper;
//     }

//     if (body.consignee && typeof body.consignee === "object") {
//       updates.consignee = body.consignee;
//     }

//     if (Array.isArray(body.items)) {
//       updates.items = body.items;
//     }

//     if (Array.isArray(body.pieces) && body.pieces.length > 0) {
//       const pieces = body.pieces.map((piece, index) => {
//         const quantity = positiveInteger(
//           piece.quantity ?? 1,
//           `pieces[${index}].quantity`,
//         );
//         const actualWeight = positiveNumber(
//           piece.actualWeightKg ?? 0,
//           `pieces[${index}].actualWeightKg`,
//         );
//         const lengthCm = positiveNumber(
//           piece.lengthCm ?? 0,
//           `pieces[${index}].lengthCm`,
//         );
//         const widthCm = positiveNumber(
//           piece.widthCm ?? 0,
//           `pieces[${index}].widthCm`,
//         );
//         const heightCm = positiveNumber(
//           piece.heightCm ?? 0,
//           `pieces[${index}].heightCm`,
//         );
//         const division =
//           Number(piece.division) > 0 ? Number(piece.division) : 5000;

//         const volumetricWeight =
//           calculateVolumetricWeight(lengthCm, widthCm, heightCm, division) *
//           quantity;
//         const chargeableWeight = calculateChargeableWeight(
//           actualWeight * quantity,
//           volumetricWeight,
//         );

//         return {
//           pieceId: `piece_${index + 1}`,
//           quantity,
//           actualWeight,
//           volumetricWeight,
//           chargeableWeight,
//           weightUnit: "KG" as const,
//           dimensions: {
//             length: lengthCm,
//             width: widthCm,
//             height: heightCm,
//             unit: "CM" as const,
//             boxCount: quantity,
//           },
//           description: piece.description?.trim(),
//           division,
//         };
//       });

//       const actualWeightKg = pieces.reduce(
//         (total, piece) => total + piece.actualWeight * piece.quantity,
//         0,
//       );
//       const volumetricWeightKg = pieces.reduce(
//         (total, piece) => total + (piece.volumetricWeight ?? 0),
//         0,
//       );
//       const chargeableWeightKg = calculateChargeableWeight(
//         actualWeightKg,
//         volumetricWeightKg,
//       );

//       updates.pieces = pieces;
//       updates.actualWeightKg = actualWeightKg;
//       updates.volumetricWeightKg = volumetricWeightKg;
//       updates.chargeableWeightKg = chargeableWeightKg;
//       updates.actualWeight = actualWeightKg;
//       updates.volumetricWeight = volumetricWeightKg;
//       updates.chargeableWeight = chargeableWeightKg;
//       updates.totalPieces = pieces.reduce((n, p) => n + p.quantity, 0);
//     } else {
//       if (body.actualWeight !== undefined) {
//         updates.actualWeight = Number(body.actualWeight) || 0;
//         updates.actualWeightKg = Number(body.actualWeight) || 0;
//       }
//       if (body.volumetricWeight !== undefined) {
//         updates.volumetricWeight = Number(body.volumetricWeight) || 0;
//         updates.volumetricWeightKg = Number(body.volumetricWeight) || 0;
//       }
//       if (body.chargeableWeight !== undefined) {
//         updates.chargeableWeight = Number(body.chargeableWeight) || 0;
//         updates.chargeableWeightKg = Number(body.chargeableWeight) || 0;
//       }
//     }

//     const gstin =
//       body.gstin !== undefined
//         ? str(body.gstin)
//         : str(body.shipper?.gstin);

//     if (body.gstin !== undefined || body.shipper?.gstin !== undefined) {
//       if (gstin && !isValidGSTIN(gstin)) {
//         return errorResponse("INVALID_GSTIN", "GSTIN is invalid.", 400);
//       }
//       updates["gstDetails.gstin"] = gstin || null;
//     }

//     const oldCharges = (current.charges || {}) as Record<string, number>;
//     const ch = body.charges || {};

//     const freight =
//       body.freight !== undefined
//         ? positiveNumber(body.freight, "freight")
//         : ch.freight !== undefined
//           ? positiveNumber(ch.freight, "freight")
//           : Number(oldCharges.freight ?? 0);

//     const fuelSurcharge =
//       body.fuelSurcharge !== undefined
//         ? positiveNumber(body.fuelSurcharge, "fuelSurcharge")
//         : ch.fuelSurcharge !== undefined
//           ? positiveNumber(ch.fuelSurcharge, "fuelSurcharge")
//           : Number(oldCharges.fuelSurcharge ?? 0);

//     if (isSuperAdmin) {
//       const otherCharges =
//         body.otherCharges !== undefined
//           ? positiveNumber(body.otherCharges, "otherCharges")
//           : ch.otherCharges !== undefined
//             ? positiveNumber(ch.otherCharges, "otherCharges")
//             : Number(oldCharges.otherCharges ?? 0);

//       const discount =
//         body.discount !== undefined
//           ? positiveNumber(body.discount, "discount")
//           : ch.discount !== undefined
//             ? positiveNumber(ch.discount, "discount")
//             : Number(oldCharges.discount ?? 0);

//       const handlingCharges = Number(
//         ch.handlingCharges ?? oldCharges.handlingCharges ?? 0,
//       );
//       const pickupCharges = Number(
//         ch.pickupCharges ?? oldCharges.pickupCharges ?? 0,
//       );
//       const deliveryCharges = Number(
//         ch.deliveryCharges ?? oldCharges.deliveryCharges ?? 0,
//       );

//       const taxableAmount = Math.max(
//         0,
//         freight +
//           fuelSurcharge +
//           handlingCharges +
//           pickupCharges +
//           deliveryCharges +
//           otherCharges -
//           discount,
//       );

//       const gstRate = Number(body.gstRate ?? current.gstRate ?? 18);
//       const gst = taxableAmount * (gstRate / 100);

//       updates.charges = {
//         freight,
//         fuelSurcharge,
//         handlingCharges,
//         pickupCharges,
//         deliveryCharges,
//         otherCharges,
//         contractCharges: Number(ch.contractCharges ?? 0),
//         surcharge: Number(ch.surcharge ?? 0),
//         discount,
//         additionalCharges: Array.isArray(ch.additionalCharges)
//           ? ch.additionalCharges
//           : [],
//         taxableAmount,
//         gst,
//         total: taxableAmount + gst,
//         cgst: Number(ch.cgst ?? gst / 2),
//         sgst: Number(ch.sgst ?? gst / 2),
//         igst: Number(ch.igst ?? 0),
//         currency: "INR",
//       };

//       updates["gstDetails.taxableAmount"] = taxableAmount;
//       updates["gstDetails.cgst"] = gst / 2;
//       updates["gstDetails.sgst"] = gst / 2;
//       updates["gstDetails.totalTax"] = gst;
//       if (gstin) updates["gstDetails.gstin"] = gstin;
//     } else if (
//       body.freight !== undefined ||
//       body.fuelSurcharge !== undefined ||
//       body.charges
//     ) {
//       // Co-loader: update freight + fuel only; keep other charge fields
//       const taxableAmount = Math.max(
//         0,
//         freight +
//           fuelSurcharge +
//           Number(oldCharges.handlingCharges ?? 0) +
//           Number(oldCharges.pickupCharges ?? 0) +
//           Number(oldCharges.deliveryCharges ?? 0) +
//           Number(oldCharges.otherCharges ?? 0) -
//           Number(oldCharges.discount ?? 0),
//       );
//       const gstRate = Number(current.gstRate ?? 18);
//       const gst = taxableAmount * (gstRate / 100);

//       updates.charges = {
//         ...oldCharges,
//         freight,
//         fuelSurcharge,
//         taxableAmount,
//         gst,
//         total: taxableAmount + gst,
//       };
//       updates["gstDetails.taxableAmount"] = taxableAmount;
//       updates["gstDetails.cgst"] = gst / 2;
//       updates["gstDetails.sgst"] = gst / 2;
//       updates["gstDetails.totalTax"] = gst;
//     }

//     delete updates.awb;

//     await doc.ref.update(updates);

//     await writeAuditLog({
//       userId: user.userId,
//       action: "AWB_UPDATED",
//       resourceType: "AWB",
//       resourceId: awb,
//       module: "LOGISTICS",
//       metadata: {
//         fields: Object.keys(updates),
//         isSuperAdmin,
//       },
//     });

//     const updated = await doc.ref.get();
//     const data = updated.data() || {};

//     return successResponse(
//       {
//         awb,
//         documentId: doc.id,
//         shipment: data,
//       },
//       200,
//       "AWB updated successfully.",
//     );
//   } catch (error) {
//     console.error("PATCH /api/logistics/awb/update:", error);

//     if (
//       error instanceof Error &&
//       /is required|must be a valid|cannot be negative/i.test(error.message)
//     ) {
//       return errorResponse("VALIDATION_ERROR", error.message, 400);
//     }

//     return errorResponse(
//       "AWB_UPDATE_FAILED",
//       error instanceof Error ? error.message : "Unable to update AWB.",
//       500,
//     );
//   }
// }

// import { NextRequest } from "next/server";

// import { adminDb } from "@/lib/firebase-admin";
// import { getCurrentUser } from "@/lib/auth";
// import { can } from "@/lib/permissions";
// import { writeAuditLog } from "@/lib/audit";
// import { successResponse, errorResponse } from "@/lib/api-response";
// import {
//   isValidGSTIN,
//   isValidAWB,
//   positiveNumber,
//   positiveInteger,
// } from "@/utils/validators";
// import {
//   calculateChargeableWeight,
//   calculateVolumetricWeight,
// } from "@/utils/calculations";

// type PieceInput = {
//   quantity?: number;
//   actualWeightKg?: number;
//   lengthCm?: number;
//   widthCm?: number;
//   heightCm?: number;
//   description?: string;
//   division?: number;
// };

// type UpdateAWBBody = {
//   awb?: string;
//   existingAwb?: string;

//   customerId?: string;
//   customerName?: string;
//   customerCode?: string;
//   accountCode?: string;

//   origin?: string;
//   destination?: string;
//   destinationCode?: string;

//   serviceId?: string;
//   serviceType?: string;
//   service?: string;
//   product?: string;
//   vendor?: string;

//   shipmentDate?: string;
//   description?: string;
//   content?: string;
//   instruction?: string;

//   shipper?: Record<string, unknown>;
//   consignee?: Record<string, unknown>;
//   pieces?: PieceInput[];
//   items?: unknown[];

//   gstin?: string;
//   csbType?: string;
//   termOfInvoice?: string;
//   exportReason?: string;
//   gstInvoice?: boolean;
//   invoiceNo?: string;
//   invoiceDate?: string;
//   departmentNo?: string;
//   format?: string;

//   freight?: number;
//   fuelSurcharge?: number;
//   handlingCharges?: number;
//   pickupCharges?: number;
//   deliveryCharges?: number;
//   otherCharges?: number;
//   discount?: number;
//   gstRate?: number;
//   charges?: {
//     freight?: number;
//     fuelSurcharge?: number;
//     handlingCharges?: number;
//     pickupCharges?: number;
//     deliveryCharges?: number;
//     otherCharges?: number;
//     contractCharges?: number;
//     surcharge?: number;
//     discount?: number;
//     additionalCharges?: unknown[];
//     cgst?: number;
//     sgst?: number;
//     igst?: number;
//   };

//   paymentType?: string;
//   referenceNo?: string;
//   commercial?: boolean;
//   oda?: boolean;
//   medicalCharges?: boolean;
//   totalPieces?: number;
//   packageType?: string;
//   actualWeight?: number;
//   volumetricWeight?: number;
//   chargeableWeight?: number;
//   shipmentValue?: number;
//   currency?: string;
// };

// function str(v: unknown, fallback = ""): string {
//   if (v == null) return fallback;
//   return String(v).trim() || fallback;
// }

// export async function PATCH(request: NextRequest) {
//   try {
//     const user = await getCurrentUser(request);

//     if (!user) {
//       return errorResponse(
//         "UNAUTHENTICATED",
//         "Authentication is required.",
//         401,
//       );
//     }

//     if (!can(user, "LOGISTICS_AWB_UPDATE")) {
//       return errorResponse(
//         "FORBIDDEN",
//         "You do not have permission to update an AWB.",
//         403,
//       );
//     }

//     let body: UpdateAWBBody;
//     try {
//       body = await request.json();
//     } catch {
//       return errorResponse("INVALID_JSON", "Invalid JSON request body.", 400);
//     }

//     const awb = str(body.awb || body.existingAwb);

//     if (!awb || !isValidAWB(awb)) {
//       return errorResponse("INVALID_AWB", "A valid AWB is required.", 400);
//     }

//     const query = await adminDb
//       .collection("awbs")
//       .where("awb", "==", awb)
//       .limit(1)
//       .get();

//     if (query.empty) {
//       return errorResponse("AWB_NOT_FOUND", "AWB was not found.", 404);
//     }

//     const doc = query.docs[0]!;
//     const current = doc.data() || {};
//     const isSuperAdmin = user.role === "SUPER_ADMIN";

//     const updates: Record<string, unknown> = {
//       updatedBy: user.userId,
//       updatedAt: new Date().toISOString(),
//     };

//     const stringFields: Array<[keyof UpdateAWBBody, string]> = [
//       ["customerId", "customerId"],
//       ["customerName", "customerName"],
//       ["customerCode", "customerCode"],
//       ["accountCode", "accountCode"],
//       ["origin", "origin"],
//       ["destination", "destination"],
//       ["destinationCode", "destinationCode"],
//       ["serviceId", "serviceId"],
//       ["serviceType", "serviceType"],
//       ["service", "service"],
//       ["product", "product"],
//       ["vendor", "vendor"],
//       ["shipmentDate", "shipmentDate"],
//       ["description", "description"],
//       ["content", "content"],
//       ["instruction", "instruction"],
//       ["csbType", "csbType"],
//       ["termOfInvoice", "termOfInvoice"],
//       ["exportReason", "exportReason"],
//       ["invoiceNo", "invoiceNo"],
//       ["invoiceDate", "invoiceDate"],
//       ["departmentNo", "departmentNo"],
//       ["format", "format"],
//       ["paymentType", "paymentType"],
//       ["referenceNo", "referenceNo"],
//       ["packageType", "packageType"],
//       ["currency", "currency"],
//     ];

//     for (const [bodyKey, docKey] of stringFields) {
//       const value = body[bodyKey];
//       if (typeof value === "string") {
//         updates[docKey] = value.trim();
//       }
//     }

//     if (body.gstInvoice !== undefined) {
//       updates.gstInvoice = Boolean(body.gstInvoice);
//     }
//     if (body.commercial !== undefined) {
//       updates.commercial = Boolean(body.commercial);
//     }
//     if (body.oda !== undefined) {
//       updates.oda = Boolean(body.oda);
//     }
//     if (body.medicalCharges !== undefined) {
//       updates.medicalCharges = Boolean(body.medicalCharges);
//     }
//     if (body.shipmentValue !== undefined) {
//       updates.shipmentValue = Number(body.shipmentValue) || 0;
//     }
//     if (body.totalPieces !== undefined) {
//       updates.totalPieces = Number(body.totalPieces) || 0;
//     }

//     if (body.shipper && typeof body.shipper === "object") {
//       const shipper = { ...body.shipper };

//       // Keep API `name` in sync with Contact Name / company
//       const contactName = str(shipper.contactName);
//       const company = str(shipper.company) || str(shipper.companyName);
//       if (contactName) {
//         shipper.name = contactName;
//       } else if (company && !str(shipper.name)) {
//         shipper.name = company;
//       }
//       if (company) {
//         shipper.companyName = company;
//       }

//       updates.shipper = shipper;

//       const originFromShipper = str(
//         shipper.origin || body.origin || current.origin,
//       );
//       if (originFromShipper) {
//         updates.origin = originFromShipper;
//       }
//     }

//     if (body.consignee && typeof body.consignee === "object") {
//       updates.consignee = body.consignee;
//     }

//     if (Array.isArray(body.items)) {
//       updates.items = body.items;
//     }

//     if (Array.isArray(body.pieces) && body.pieces.length > 0) {
//       const pieces = body.pieces.map((piece, index) => {
//         const quantity = positiveInteger(
//           piece.quantity ?? 1,
//           `pieces[${index}].quantity`,
//         );
//         const actualWeight = positiveNumber(
//           piece.actualWeightKg ?? 0,
//           `pieces[${index}].actualWeightKg`,
//         );
//         const lengthCm = positiveNumber(
//           piece.lengthCm ?? 0,
//           `pieces[${index}].lengthCm`,
//         );
//         const widthCm = positiveNumber(
//           piece.widthCm ?? 0,
//           `pieces[${index}].widthCm`,
//         );
//         const heightCm = positiveNumber(
//           piece.heightCm ?? 0,
//           `pieces[${index}].heightCm`,
//         );
//         const division =
//           Number(piece.division) > 0 ? Number(piece.division) : 5000;

//         const volumetricWeight =
//           calculateVolumetricWeight(lengthCm, widthCm, heightCm, division) *
//           quantity;
//         const chargeableWeight = calculateChargeableWeight(
//           actualWeight * quantity,
//           volumetricWeight,
//         );

//         return {
//           pieceId: `piece_${index + 1}`,
//           quantity,
//           actualWeight,
//           volumetricWeight,
//           chargeableWeight,
//           weightUnit: "KG" as const,
//           dimensions: {
//             length: lengthCm,
//             width: widthCm,
//             height: heightCm,
//             unit: "CM" as const,
//             boxCount: quantity,
//           },
//           description: piece.description?.trim(),
//           division,
//         };
//       });

//       const actualWeightKg = pieces.reduce(
//         (total, piece) => total + piece.actualWeight * piece.quantity,
//         0,
//       );
//       const volumetricWeightKg = pieces.reduce(
//         (total, piece) => total + (piece.volumetricWeight ?? 0),
//         0,
//       );
//       const chargeableWeightKg = calculateChargeableWeight(
//         actualWeightKg,
//         volumetricWeightKg,
//       );

//       updates.pieces = pieces;
//       updates.actualWeightKg = actualWeightKg;
//       updates.volumetricWeightKg = volumetricWeightKg;
//       updates.chargeableWeightKg = chargeableWeightKg;
//       updates.actualWeight = actualWeightKg;
//       updates.volumetricWeight = volumetricWeightKg;
//       updates.chargeableWeight = chargeableWeightKg;
//       updates.totalPieces = pieces.reduce((n, p) => n + p.quantity, 0);
//     } else {
//       if (body.actualWeight !== undefined) {
//         updates.actualWeight = Number(body.actualWeight) || 0;
//         updates.actualWeightKg = Number(body.actualWeight) || 0;
//       }
//       if (body.volumetricWeight !== undefined) {
//         updates.volumetricWeight = Number(body.volumetricWeight) || 0;
//         updates.volumetricWeightKg = Number(body.volumetricWeight) || 0;
//       }
//       if (body.chargeableWeight !== undefined) {
//         updates.chargeableWeight = Number(body.chargeableWeight) || 0;
//         updates.chargeableWeightKg = Number(body.chargeableWeight) || 0;
//       }
//     }

//     const gstin =
//       body.gstin !== undefined
//         ? str(body.gstin).toUpperCase()
//         : str(body.shipper?.gstin).toUpperCase();

//     if (body.gstin !== undefined || body.shipper?.gstin !== undefined) {
//       if (gstin && !isValidGSTIN(gstin)) {
//         return errorResponse("INVALID_GSTIN", "GSTIN is invalid.", 400);
//       }
//       updates["gstDetails.gstin"] = gstin || null;
//     }

//     const oldCharges = (current.charges || {}) as Record<string, number>;
//     const ch = body.charges || {};

//     const freight =
//       body.freight !== undefined
//         ? positiveNumber(body.freight, "freight")
//         : ch.freight !== undefined
//           ? positiveNumber(ch.freight, "freight")
//           : Number(oldCharges.freight ?? 0);

//     const fuelSurcharge =
//       body.fuelSurcharge !== undefined
//         ? positiveNumber(body.fuelSurcharge, "fuelSurcharge")
//         : ch.fuelSurcharge !== undefined
//           ? positiveNumber(ch.fuelSurcharge, "fuelSurcharge")
//           : Number(oldCharges.fuelSurcharge ?? 0);

//     if (isSuperAdmin) {
//       const otherCharges =
//         body.otherCharges !== undefined
//           ? positiveNumber(body.otherCharges, "otherCharges")
//           : ch.otherCharges !== undefined
//             ? positiveNumber(ch.otherCharges, "otherCharges")
//             : Number(oldCharges.otherCharges ?? 0);

//       const discount =
//         body.discount !== undefined
//           ? positiveNumber(body.discount, "discount")
//           : ch.discount !== undefined
//             ? positiveNumber(ch.discount, "discount")
//             : Number(oldCharges.discount ?? 0);

//       const handlingCharges = Number(
//         ch.handlingCharges ?? oldCharges.handlingCharges ?? 0,
//       );
//       const pickupCharges = Number(
//         ch.pickupCharges ?? oldCharges.pickupCharges ?? 0,
//       );
//       const deliveryCharges = Number(
//         ch.deliveryCharges ?? oldCharges.deliveryCharges ?? 0,
//       );

//       const taxableAmount = Math.max(
//         0,
//         freight +
//           fuelSurcharge +
//           handlingCharges +
//           pickupCharges +
//           deliveryCharges +
//           otherCharges -
//           discount,
//       );

//       const gstRate = Number(body.gstRate ?? current.gstRate ?? 18);
//       const gst = taxableAmount * (gstRate / 100);

//       updates.charges = {
//         freight,
//         fuelSurcharge,
//         handlingCharges,
//         pickupCharges,
//         deliveryCharges,
//         otherCharges,
//         contractCharges: Number(ch.contractCharges ?? 0),
//         surcharge: Number(ch.surcharge ?? 0),
//         discount,
//         additionalCharges: Array.isArray(ch.additionalCharges)
//           ? ch.additionalCharges
//           : [],
//         taxableAmount,
//         gst,
//         total: taxableAmount + gst,
//         cgst: Number(ch.cgst ?? gst / 2),
//         sgst: Number(ch.sgst ?? gst / 2),
//         igst: Number(ch.igst ?? 0),
//         currency: "INR",
//       };

//       updates["gstDetails.taxableAmount"] = taxableAmount;
//       updates["gstDetails.cgst"] = gst / 2;
//       updates["gstDetails.sgst"] = gst / 2;
//       updates["gstDetails.totalTax"] = gst;
//       if (gstin) updates["gstDetails.gstin"] = gstin;
//     } else if (
//       body.freight !== undefined ||
//       body.fuelSurcharge !== undefined ||
//       body.charges
//     ) {
//       const taxableAmount = Math.max(
//         0,
//         freight +
//           fuelSurcharge +
//           Number(oldCharges.handlingCharges ?? 0) +
//           Number(oldCharges.pickupCharges ?? 0) +
//           Number(oldCharges.deliveryCharges ?? 0) +
//           Number(oldCharges.otherCharges ?? 0) -
//           Number(oldCharges.discount ?? 0),
//       );
//       const gstRate = Number(current.gstRate ?? 18);
//       const gst = taxableAmount * (gstRate / 100);

//       updates.charges = {
//         ...oldCharges,
//         freight,
//         fuelSurcharge,
//         taxableAmount,
//         gst,
//         total: taxableAmount + gst,
//       };
//       updates["gstDetails.taxableAmount"] = taxableAmount;
//       updates["gstDetails.cgst"] = gst / 2;
//       updates["gstDetails.sgst"] = gst / 2;
//       updates["gstDetails.totalTax"] = gst;
//     }

//     delete updates.awb;

//     await doc.ref.update(updates);

//     await writeAuditLog({
//       userId: user.userId,
//       action: "AWB_UPDATED",
//       resourceType: "AWB",
//       resourceId: awb,
//       module: "LOGISTICS",
//       metadata: {
//         fields: Object.keys(updates),
//         isSuperAdmin,
//       },
//     });

//     const updated = await doc.ref.get();
//     const data = updated.data() || {};

//     return successResponse(
//       {
//         awb,
//         documentId: doc.id,
//         shipment: data,
//       },
//       200,
//       "AWB updated successfully.",
//     );
//   } catch (error) {
//     console.error("PATCH /api/logistics/awb/update:", error);

//     if (
//       error instanceof Error &&
//       /is required|must be a valid|cannot be negative/i.test(error.message)
//     ) {
//       return errorResponse("VALIDATION_ERROR", error.message, 400);
//     }

//     return errorResponse(
//       "AWB_UPDATE_FAILED",
//       error instanceof Error ? error.message : "Unable to update AWB.",
//       500,
//     );
//   }
// }

import { NextRequest } from "next/server";

import { adminDb } from "@/lib/firebase-admin";
import { getCurrentUser } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { writeAuditLog } from "@/lib/audit";
import { successResponse, errorResponse } from "@/lib/api-response";
import {
  isValidGSTIN,
  isValidAWB,
  positiveNumber,
  positiveInteger,
} from "@/utils/validators";
import {
  calculateChargeableWeight,
  calculateVolumetricWeight,
} from "@/utils/calculations";

type PieceInput = {
  quantity?: number;
  actualWeightKg?: number;
  lengthCm?: number;
  widthCm?: number;
  heightCm?: number;
  description?: string;
  division?: number;
};

type UpdateAWBBody = {
  awb?: string;
  existingAwb?: string;

  customerId?: string;
  customerName?: string;
  customerCode?: string;
  accountCode?: string;

  origin?: string;
  originCode?: string;
  destination?: string;
  destinationCode?: string;

  serviceId?: string;
  serviceType?: string;
  service?: string;
  product?: string;
  vendor?: string;

  shipmentDate?: string;
  description?: string;
  content?: string;
  instruction?: string;

  shipper?: Record<string, unknown>;
  consignee?: Record<string, unknown>;
  pieces?: PieceInput[];
  items?: unknown[];

  gstin?: string;
  csbType?: string;
  termOfInvoice?: string;
  exportReason?: string;
  gstInvoice?: boolean;
  invoiceNo?: string;
  invoiceDate?: string;
  departmentNo?: string;
  format?: string;

  freight?: number;
  fuelSurcharge?: number;
  handlingCharges?: number;
  pickupCharges?: number;
  deliveryCharges?: number;
  otherCharges?: number;
  discount?: number;
  gstRate?: number;
  charges?: {
    freight?: number;
    fuelSurcharge?: number;
    handlingCharges?: number;
    pickupCharges?: number;
    deliveryCharges?: number;
    otherCharges?: number;
    contractCharges?: number;
    surcharge?: number;
    discount?: number;
    additionalCharges?: unknown[];
    cgst?: number;
    sgst?: number;
    igst?: number;
  };

  paymentType?: string;
  referenceNo?: string;
  commercial?: boolean;
  oda?: boolean;
  medicalCharges?: boolean;
  totalPieces?: number;
  packageType?: string;
  actualWeight?: number;
  volumetricWeight?: number;
  chargeableWeight?: number;
  shipmentValue?: number;
  declaredValue?: number;
  currency?: string;
};

function str(v: unknown, fallback = ""): string {
  if (v == null) return fallback;
  return String(v).trim() || fallback;
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);

    if (!user) {
      return errorResponse(
        "UNAUTHENTICATED",
        "Authentication is required.",
        401,
      );
    }

    if (!can(user, "LOGISTICS_AWB_UPDATE")) {
      return errorResponse(
        "FORBIDDEN",
        "You do not have permission to update an AWB.",
        403,
      );
    }

    let body: UpdateAWBBody;
    try {
      body = await request.json();
    } catch {
      return errorResponse("INVALID_JSON", "Invalid JSON request body.", 400);
    }

    const awb = str(body.awb || body.existingAwb);

    if (!awb || !isValidAWB(awb)) {
      return errorResponse("INVALID_AWB", "A valid AWB is required.", 400);
    }

    const query = await adminDb
      .collection("awbs")
      .where("awb", "==", awb)
      .limit(1)
      .get();

    if (query.empty) {
      return errorResponse("AWB_NOT_FOUND", "AWB was not found.", 404);
    }

    const doc = query.docs[0]!;
    const current = doc.data() || {};
    const isSuperAdmin = user.role === "SUPER_ADMIN";

    const updates: Record<string, unknown> = {
      updatedBy: user.userId,
      updatedAt: new Date().toISOString(),
    };

    const stringFields: Array<[keyof UpdateAWBBody, string]> = [
      ["customerId", "customerId"],
      ["customerName", "customerName"],
      ["customerCode", "customerCode"],
      ["accountCode", "accountCode"],
      ["origin", "origin"],
      ["originCode", "originCode"],
      ["destination", "destination"],
      ["destinationCode", "destinationCode"],
      ["serviceId", "serviceId"],
      ["serviceType", "serviceType"],
      ["service", "service"],
      ["product", "product"],
      ["vendor", "vendor"],
      ["shipmentDate", "shipmentDate"],
      ["description", "description"],
      ["content", "content"],
      ["instruction", "instruction"],
      ["csbType", "csbType"],
      ["termOfInvoice", "termOfInvoice"],
      ["exportReason", "exportReason"],
      ["invoiceNo", "invoiceNo"],
      ["invoiceDate", "invoiceDate"],
      ["departmentNo", "departmentNo"],
      ["format", "format"],
      ["paymentType", "paymentType"],
      ["referenceNo", "referenceNo"],
      ["packageType", "packageType"],
      ["currency", "currency"],
    ];

    for (const [bodyKey, docKey] of stringFields) {
      const value = body[bodyKey];
      if (typeof value === "string") {
        updates[docKey] = value.trim();
      }
    }

    if (body.gstInvoice !== undefined) {
      updates.gstInvoice = Boolean(body.gstInvoice);
    }
    if (body.commercial !== undefined) {
      updates.commercial = Boolean(body.commercial);
    }
    if (body.oda !== undefined) {
      updates.oda = Boolean(body.oda);
    }
    if (body.medicalCharges !== undefined) {
      updates.medicalCharges = Boolean(body.medicalCharges);
    }

    if (body.shipmentValue !== undefined || body.declaredValue !== undefined) {
      const v =
        Number(
          body.shipmentValue !== undefined
            ? body.shipmentValue
            : body.declaredValue,
        ) || 0;
      updates.shipmentValue = v;
      updates.declaredValue = v;
    }

    if (body.totalPieces !== undefined) {
      updates.totalPieces = Number(body.totalPieces) || 0;
    }

    if (body.shipper && typeof body.shipper === "object") {
      const shipper = { ...body.shipper };

      const contactName = str(shipper.contactName);
      const company = str(shipper.company) || str(shipper.companyName);
      if (contactName) {
        shipper.name = contactName;
      } else if (company && !str(shipper.name)) {
        shipper.name = company;
      }
      if (company) {
        shipper.companyName = company;
      }

      updates.shipper = shipper;

      updates.senderName =
        contactName || company || str(shipper.name) || "";
      updates.senderPhone = str(shipper.phone) || str(shipper.mobile);
      updates.senderMobile = str(shipper.mobile) || str(shipper.phone);
      updates.senderAddress =
        str(shipper.addressLine1) || str(shipper.address) || "";
      updates.senderCity = str(shipper.city);
      updates.senderState = str(shipper.state);
      updates.senderPincode = str(shipper.pincode || shipper.postalCode);
      updates.senderCountry = str(shipper.country) || "India";
      updates.senderTaxId = str(shipper.gstin);

      const originFromShipper = str(
        shipper.origin || body.origin || current.origin,
      );
      if (originFromShipper) {
        updates.origin = originFromShipper;
      }

      const originCodeFromShipper = str(
        shipper.originCode || body.originCode || current.originCode,
      );
      if (originCodeFromShipper) {
        updates.originCode = originCodeFromShipper;
      }
    }

    if (body.consignee && typeof body.consignee === "object") {
      const consignee = { ...body.consignee };

      const contactName = str(consignee.contactName);
      const company = str(consignee.company) || str(consignee.companyName);
      if (contactName) {
        consignee.name = contactName;
      } else if (company && !str(consignee.name)) {
        consignee.name = company;
      }
      if (company) {
        consignee.companyName = company;
      }

      updates.consignee = consignee;

      updates.receiverName =
        contactName || company || str(consignee.name) || "";
      updates.receiverPhone =
        str(consignee.phone) || str(consignee.mobile);
      updates.receiverMobile =
        str(consignee.mobile) || str(consignee.phone);
      updates.receiverAddress =
        str(consignee.addressLine1) || str(consignee.address) || "";
      updates.receiverCity = str(consignee.city);
      updates.receiverState = str(consignee.state);
      updates.receiverPincode = str(
        consignee.pincode || consignee.postalCode,
      );
      updates.receiverCountry = str(consignee.country);

      if (!str(body.destination) && !str(updates.destination as string)) {
        const dest =
          str(consignee.city) ||
          str(consignee.country) ||
          str(current.destination);
        if (dest) updates.destination = dest;
      }
    }

    if (Array.isArray(body.items)) {
      updates.items = body.items;
    }

    if (Array.isArray(body.pieces) && body.pieces.length > 0) {
      const pieces = body.pieces.map((piece, index) => {
        const quantity = positiveInteger(
          piece.quantity ?? 1,
          `pieces[${index}].quantity`,
        );
        const actualWeight = positiveNumber(
          piece.actualWeightKg ?? 0,
          `pieces[${index}].actualWeightKg`,
        );
        const lengthCm = positiveNumber(
          piece.lengthCm ?? 0,
          `pieces[${index}].lengthCm`,
        );
        const widthCm = positiveNumber(
          piece.widthCm ?? 0,
          `pieces[${index}].widthCm`,
        );
        const heightCm = positiveNumber(
          piece.heightCm ?? 0,
          `pieces[${index}].heightCm`,
        );
        const division =
          Number(piece.division) > 0 ? Number(piece.division) : 5000;

        const volumetricWeight =
          calculateVolumetricWeight(lengthCm, widthCm, heightCm, division) *
          quantity;
        const chargeableWeight = calculateChargeableWeight(
          actualWeight * quantity,
          volumetricWeight,
        );

        return {
          pieceId: `piece_${index + 1}`,
          quantity,
          actualWeight,
          volumetricWeight,
          chargeableWeight,
          weightUnit: "KG" as const,
          dimensions: {
            length: lengthCm,
            width: widthCm,
            height: heightCm,
            unit: "CM" as const,
            boxCount: quantity,
          },
          description: piece.description?.trim(),
          division,
        };
      });

      const actualWeightKg = pieces.reduce(
        (total, piece) => total + piece.actualWeight * piece.quantity,
        0,
      );
      const volumetricWeightKg = pieces.reduce(
        (total, piece) => total + (piece.volumetricWeight ?? 0),
        0,
      );
      const chargeableWeightKg = calculateChargeableWeight(
        actualWeightKg,
        volumetricWeightKg,
      );

      updates.pieces = pieces;
      updates.actualWeightKg = actualWeightKg;
      updates.volumetricWeightKg = volumetricWeightKg;
      updates.chargeableWeightKg = chargeableWeightKg;
      updates.actualWeight = actualWeightKg;
      updates.volumetricWeight = volumetricWeightKg;
      updates.chargeableWeight = chargeableWeightKg;
      updates.totalPieces = pieces.reduce((n, p) => n + p.quantity, 0);
    } else {
      if (body.actualWeight !== undefined) {
        updates.actualWeight = Number(body.actualWeight) || 0;
        updates.actualWeightKg = Number(body.actualWeight) || 0;
      }
      if (body.volumetricWeight !== undefined) {
        updates.volumetricWeight = Number(body.volumetricWeight) || 0;
        updates.volumetricWeightKg = Number(body.volumetricWeight) || 0;
      }
      if (body.chargeableWeight !== undefined) {
        updates.chargeableWeight = Number(body.chargeableWeight) || 0;
        updates.chargeableWeightKg = Number(body.chargeableWeight) || 0;
      }
    }

    const gstin =
      body.gstin !== undefined
        ? str(body.gstin).toUpperCase()
        : str(body.shipper?.gstin).toUpperCase();

    if (body.gstin !== undefined || body.shipper?.gstin !== undefined) {
      if (gstin && !isValidGSTIN(gstin)) {
        return errorResponse("INVALID_GSTIN", "GSTIN is invalid.", 400);
      }
      updates["gstDetails.gstin"] = gstin || null;
    }

    const oldCharges = (current.charges || {}) as Record<string, number>;
    const ch = body.charges || {};

    const freight =
      body.freight !== undefined
        ? positiveNumber(body.freight, "freight")
        : ch.freight !== undefined
          ? positiveNumber(ch.freight, "freight")
          : Number(oldCharges.freight ?? 0);

    const fuelSurcharge =
      body.fuelSurcharge !== undefined
        ? positiveNumber(body.fuelSurcharge, "fuelSurcharge")
        : ch.fuelSurcharge !== undefined
          ? positiveNumber(ch.fuelSurcharge, "fuelSurcharge")
          : Number(oldCharges.fuelSurcharge ?? 0);

    if (isSuperAdmin) {
      const otherCharges =
        body.otherCharges !== undefined
          ? positiveNumber(body.otherCharges, "otherCharges")
          : ch.otherCharges !== undefined
            ? positiveNumber(ch.otherCharges, "otherCharges")
            : Number(oldCharges.otherCharges ?? 0);

      const discount =
        body.discount !== undefined
          ? positiveNumber(body.discount, "discount")
          : ch.discount !== undefined
            ? positiveNumber(ch.discount, "discount")
            : Number(oldCharges.discount ?? 0);

      const handlingCharges = Number(
        ch.handlingCharges ?? oldCharges.handlingCharges ?? 0,
      );
      const pickupCharges = Number(
        ch.pickupCharges ?? oldCharges.pickupCharges ?? 0,
      );
      const deliveryCharges = Number(
        ch.deliveryCharges ?? oldCharges.deliveryCharges ?? 0,
      );

      const taxableAmount = Math.max(
        0,
        freight +
          fuelSurcharge +
          handlingCharges +
          pickupCharges +
          deliveryCharges +
          otherCharges -
          discount,
      );

      const gstRate = Number(body.gstRate ?? current.gstRate ?? 18);
      const gst = taxableAmount * (gstRate / 100);

      updates.charges = {
        freight,
        fuelSurcharge,
        handlingCharges,
        pickupCharges,
        deliveryCharges,
        otherCharges,
        contractCharges: Number(ch.contractCharges ?? 0),
        surcharge: Number(ch.surcharge ?? 0),
        discount,
        additionalCharges: Array.isArray(ch.additionalCharges)
          ? ch.additionalCharges
          : [],
        taxableAmount,
        gst,
        total: taxableAmount + gst,
        cgst: Number(ch.cgst ?? gst / 2),
        sgst: Number(ch.sgst ?? gst / 2),
        igst: Number(ch.igst ?? 0),
        currency: str(body.currency) || "INR",
      };

      updates["gstDetails.taxableAmount"] = taxableAmount;
      updates["gstDetails.cgst"] = gst / 2;
      updates["gstDetails.sgst"] = gst / 2;
      updates["gstDetails.totalTax"] = gst;
      if (gstin) updates["gstDetails.gstin"] = gstin;
    } else if (
      body.freight !== undefined ||
      body.fuelSurcharge !== undefined ||
      body.charges
    ) {
      const taxableAmount = Math.max(
        0,
        freight +
          fuelSurcharge +
          Number(oldCharges.handlingCharges ?? 0) +
          Number(oldCharges.pickupCharges ?? 0) +
          Number(oldCharges.deliveryCharges ?? 0) +
          Number(oldCharges.otherCharges ?? 0) -
          Number(oldCharges.discount ?? 0),
      );
      const gstRate = Number(current.gstRate ?? 18);
      const gst = taxableAmount * (gstRate / 100);

      updates.charges = {
        ...oldCharges,
        freight,
        fuelSurcharge,
        taxableAmount,
        gst,
        total: taxableAmount + gst,
      };
      updates["gstDetails.taxableAmount"] = taxableAmount;
      updates["gstDetails.cgst"] = gst / 2;
      updates["gstDetails.sgst"] = gst / 2;
      updates["gstDetails.totalTax"] = gst;
    }

    delete updates.awb;

    await doc.ref.update(updates);

    await writeAuditLog({
      userId: user.userId,
      action: "AWB_UPDATED",
      resourceType: "AWB",
      resourceId: awb,
      module: "LOGISTICS",
      metadata: {
        fields: Object.keys(updates),
        isSuperAdmin,
      },
    });

    const updated = await doc.ref.get();
    const data = updated.data() || {};

    return successResponse(
      {
        awb,
        documentId: doc.id,
        shipment: data,
      },
      200,
      "AWB updated successfully.",
    );
  } catch (error) {
    console.error("PATCH /api/logistics/awb/update:", error);

    if (
      error instanceof Error &&
      /is required|must be a valid|cannot be negative/i.test(error.message)
    ) {
      return errorResponse("VALIDATION_ERROR", error.message, 400);
    }

    return errorResponse(
      "AWB_UPDATE_FAILED",
      error instanceof Error ? error.message : "Unable to update AWB.",
      500,
    );
  }
}