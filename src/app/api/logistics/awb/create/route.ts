// import { NextRequest } from "next/server";
// import {
//   FieldValue,
// } from "firebase-admin/firestore";

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
//   calculateChargeableWeight,
//   calculateVolumetricWeight,
// } from "@/utils/calculations";

// import {
//   isValidGSTIN,
//   positiveNumber,
//   positiveInteger,
//   requiredString,
// } from "@/utils/validators";

// import type {
//   TrackingStatus,
//   ShipmentPiece,
// } from "@/types/logistics";

// type CreateAWBBody = {
//   customerId?: string;

//   senderId?: string;
//   receiverId?: string;

//   origin?: string;
//   destination?: string;

//   serviceId?: string;
//   serviceType?: string;

//   shipmentDate?: string;
//   description?: string;

//   pieces?: Array<{
//     quantity?: number;
//     actualWeightKg?: number;
//     lengthCm?: number;
//     widthCm?: number;
//     heightCm?: number;
//     description?: string;
//   }>;

//   gstin?: string;

//   freight?: number;
//   fuelSurcharge?: number;
//   handlingCharges?: number;
//   pickupCharges?: number;
//   deliveryCharges?: number;
//   otherCharges?: number;
//   discount?: number;
//   gstRate?: number;
// };

// function generateAWB() {
//   const timestamp =
//     Date.now()
//       .toString()
//       .slice(-8);

//   const random =
//     Math.floor(
//       1000 +
//         Math.random() * 9000,
//     );

//   return `SR${timestamp}${random}`;
// }

// export async function POST(
//   request: NextRequest,
// ) {
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
//       !can(
//         user,
//         "LOGISTICS_AWB_CREATE",
//       )
//     ) {
//       return errorResponse(
//         "FORBIDDEN",
//         "You do not have permission to create an AWB.",
//         403,
//       );
//     }

//     let body: CreateAWBBody;

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

//     const customerId =
//   typeof body.customerId === "string" && body.customerId.trim()
//     ? body.customerId.trim()
//     : "WALKIN";

// const senderId =
//   typeof body.senderId === "string" && body.senderId.trim()
//     ? body.senderId.trim()
//     : "WALKIN_SENDER";

// const receiverId =
//   typeof body.receiverId === "string" && body.receiverId.trim()
//     ? body.receiverId.trim()
//     : "WALKIN_RECEIVER";

// const origin =
//   typeof body.origin === "string" && body.origin.trim()
//     ? body.origin.trim()
//     : typeof (body as { shipper?: { city?: string } }).shipper?.city === "string"
//       ? String((body as { shipper?: { city?: string } }).shipper?.city).trim() || "ORIGIN"
//       : "ORIGIN";

// const destination =
//   typeof body.destination === "string" && body.destination.trim()
//     ? body.destination.trim()
//     : typeof (body as { consignee?: { country?: string } }).consignee?.country === "string"
//       ? String((body as { consignee?: { country?: string } }).consignee?.country).trim() || "DEST"
//       : "DEST";

//     // const serviceId =
//     //   requiredString(
//     //     body.serviceId,
//     //     "serviceId",
//     //   );

//       const serviceId =
//   typeof body.serviceId === "string" && body.serviceId.trim()
//     ? body.serviceId.trim()
//     : typeof body.service === "string" && body.service.trim()
//       ? body.service.trim()
//       : typeof body.product === "string" && body.product.trim()
//         ? body.product.trim()
//         : "SELF";

//     const shipmentDate =
//   typeof body.shipmentDate === "string" && body.shipmentDate.trim()
//     ? body.shipmentDate.trim()
//     : new Date().toISOString().slice(0, 10);

//     const piecesInput =
//       body.pieces ?? [];

//     if (
//       piecesInput.length === 0
//     ) {
//       return errorResponse(
//         "PIECES_REQUIRED",
//         "At least one shipment piece is required.",
//         400,
//       );
//     }

//     const pieces: ShipmentPiece[] =
//       piecesInput.map(
//         (piece, index) => {
//           const quantity =
//             positiveInteger(
//               piece.quantity ?? 1,
//               `pieces[${index}].quantity`,
//             );

//           const actualWeightKg =
//             positiveNumber(
//               piece.actualWeightKg ?? 0,
//               `pieces[${index}].actualWeightKg`,
//             );

//           const lengthCm =
//             positiveNumber(
//               piece.lengthCm ?? 0,
//               `pieces[${index}].lengthCm`,
//             );

//           const widthCm =
//             positiveNumber(
//               piece.widthCm ?? 0,
//               `pieces[${index}].widthCm`,
//             );

//           const heightCm =
//             positiveNumber(
//               piece.heightCm ?? 0,
//               `pieces[${index}].heightCm`,
//             );

//           const volumetricWeightKg =
//             calculateVolumetricWeight(
//               lengthCm,
//               widthCm,
//               heightCm,
//               quantity,
//             );

//           return {
//             pieceId:
//               `piece_${index + 1}`,
//             quantity,
//             actualWeightKg,
//             lengthCm,
//             widthCm,
//             heightCm,
//             volumetricWeightKg,
//             description:
//               piece.description?.trim(),
//           };
//         },
//       );

//     const actualWeightKg =
//       pieces.reduce(
//         (
//           total,
//           piece,
//         ) =>
//           total +
//           (piece.actualWeightKg ?? 0) *
//             piece.quantity,
//         0,
//       );

//     const volumetricWeightKg =
//       pieces.reduce(
//         (
//           total,
//           piece,
//         ) =>
//           total +
//           (piece.volumetricWeightKg ??
//             0),
//         0,
//       );

//     const chargeableWeightKg =
//       calculateChargeableWeight(
//         actualWeightKg,
//         volumetricWeightKg,
//       );

//     const gstin =
//       body.gstin?.trim();

//     if (
//       gstin &&
//       !isValidGSTIN(gstin)
//     ) {
//       return errorResponse(
//         "INVALID_GSTIN",
//         "GSTIN is invalid.",
//         400,
//       );
//     }

//     const freight =
//       positiveNumber(
//         body.freight ?? 0,
//         "freight",
//       );

//     const fuelSurcharge =
//       positiveNumber(
//         body.fuelSurcharge ?? 0,
//         "fuelSurcharge",
//       );

//     const handlingCharges =
//       positiveNumber(
//         body.handlingCharges ?? 0,
//         "handlingCharges",
//       );

//     const pickupCharges =
//       positiveNumber(
//         body.pickupCharges ?? 0,
//         "pickupCharges",
//       );

//     const deliveryCharges =
//       positiveNumber(
//         body.deliveryCharges ?? 0,
//         "deliveryCharges",
//       );

//     const otherCharges =
//       positiveNumber(
//         body.otherCharges ?? 0,
//         "otherCharges",
//       );

//     const discount =
//       positiveNumber(
//         body.discount ?? 0,
//         "discount",
//       );

//     const taxableAmount =
//       Math.max(
//         0,
//         freight +
//           fuelSurcharge +
//           handlingCharges +
//           pickupCharges +
//           deliveryCharges +
//           otherCharges -
//           discount,
//       );

//     const gstRate =
//       body.gstRate ?? 18;

//     const totalTax =
//       taxableAmount *
//       (gstRate / 100);

//     const total =
//       taxableAmount +
//       totalTax;

//     const awb =
//       generateAWB();

//     const now =
//       new Date().toISOString();

//     const trackingStageId =
//       "BOOKED";

//     const awbRef =
//       adminDb
//         .collection("awbs")
//         .doc();

//     const trackingEventRef =
//       adminDb
//         .collection("trackingEvents")
//         .doc();

//     const awbData = {
//       awb,

//       customerId,
//       senderId,
//       receiverId,

//       origin,
//       destination,

//       serviceId,
//       serviceType:
//         body.serviceType ??
//         null,

//       shipmentDate,

//       description:
//         body.description?.trim() ??
//         null,

//       pieces,

//       actualWeightKg,
//       volumetricWeightKg,
//       chargeableWeightKg,

//       gstDetails: {
//         gstin: gstin ?? null,
//         taxableAmount,
//         cgst:
//           totalTax / 2,
//         sgst:
//           totalTax / 2,
//         igst: 0,
//         totalTax,
//       },

//       charges: {
//         freight,
//         fuelSurcharge,
//         handlingCharges,
//         pickupCharges,
//         deliveryCharges,
//         otherCharges,
//         discount,
//         taxableAmount,
//         gst: totalTax,
//         total,
//       },

//       currentStatus:
//         "BOOKED" as TrackingStatus,

//       latestLocation:
//         origin,

//       createdBy:
//         user.userId,

//       updatedBy:
//         user.userId,

//       createdAt: now,
//       updatedAt: now,
//     };

//     const trackingEvent = {
//       trackingEventId:
//         trackingEventRef.id,

//       awb,

//       trackingStageId,

//       status:
//         "BOOKED" as TrackingStatus,

//       location: origin,

//       remarks:
//         "Shipment booked.",

//       eventTime: now,

//       createdBy:
//         user.userId,

//       createdAt:
//         FieldValue.serverTimestamp(),
//     };

//     const batch =
//       adminDb.batch();

//     batch.set(
//       awbRef,
//       {
//         ...awbData,
//         awbDocumentId:
//           awbRef.id,
//       },
//     );

//     batch.set(
//       trackingEventRef,
//       trackingEvent,
//     );

//     await batch.commit();

//     await writeAuditLog({
//       userId:
//         user.userId,
//       action:
//         "AWB_CREATED",
//       resourceType:
//         "AWB",
//       resourceId:
//         awb,
//       metadata: {
//         customerId,
//         senderId,
//         receiverId,
//         origin,
//         destination,
//         serviceId,
//         chargeableWeightKg,
//       },
//     });

//     return successResponse(
//       {
//         awb,
//         status:
//           "BOOKED",
//         trackingEventId:
//           trackingEventRef.id,
//         shipment: awbData,
//       },
//       201,
//       "AWB created successfully.",
//     );
//   } catch (error) {
//     console.error(
//       "POST /api/logistics/awb/create:",
//       error,
//     );

//     if (error instanceof Error && /is required|must be a valid|cannot be negative/i.test(error.message)) {
//       return errorResponse("VALIDATION_ERROR", error.message, 400);
//     }

//     return errorResponse(
//       "AWB_CREATE_FAILED",
//       error instanceof Error
//         ? error.message
//         : "Unable to create AWB.",
//       500,
//     );
//   }
// }

// import { NextRequest } from "next/server";
// import { FieldValue } from "firebase-admin/firestore";

// import { adminDb } from "@/lib/firebase-admin";
// import { getCurrentUser } from "@/lib/auth";
// import { can } from "@/lib/permissions";
// import { writeAuditLog } from "@/lib/audit";
// import { successResponse, errorResponse } from "@/lib/api-response";
// import { generateBusinessId } from "@/lib/business-id";
// import {
//   calculateChargeableWeight,
//   calculateVolumetricWeight,
// } from "@/utils/calculations";
// import {
//   isValidGSTIN,
//   positiveNumber,
//   positiveInteger,
// } from "@/utils/validators";

// import type { TrackingStatus, ShipmentPiece } from "@/types/logistics";

// type CreateAWBBody = {
//   customerId?: string;
//   senderId?: string;
//   receiverId?: string;

//   origin?: string;
//   destination?: string;

//   serviceId?: string;
//   serviceType?: string;
//   service?: string;
//   product?: string;

//   shipmentDate?: string;
//   description?: string;

//   shipper?: {
//     city?: string;
//     gstin?: string;
//   };
//   consignee?: {
//     city?: string;
//     country?: string;
//   };

//   pieces?: Array<{
//     quantity?: number;
//     actualWeightKg?: number;
//     lengthCm?: number;
//     widthCm?: number;
//     heightCm?: number;
//     description?: string;
//   }>;

//   gstin?: string;

//   freight?: number;
//   fuelSurcharge?: number;
//   handlingCharges?: number;
//   pickupCharges?: number;
//   deliveryCharges?: number;
//   otherCharges?: number;
//   discount?: number;
//   gstRate?: number;
// };

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

//     if (!can(user, "LOGISTICS_AWB_CREATE")) {
//       return errorResponse(
//         "FORBIDDEN",
//         "You do not have permission to create an AWB.",
//         403,
//       );
//     }

//     let body: CreateAWBBody;

//     try {
//       body = await request.json();
//     } catch {
//       return errorResponse(
//         "INVALID_JSON",
//         "Invalid JSON request body.",
//         400,
//       );
//     }

//     const customerId =
//       typeof body.customerId === "string" && body.customerId.trim()
//         ? body.customerId.trim()
//         : "WALKIN";

//     const senderId =
//       typeof body.senderId === "string" && body.senderId.trim()
//         ? body.senderId.trim()
//         : "WALKIN_SENDER";

//     const receiverId =
//       typeof body.receiverId === "string" && body.receiverId.trim()
//         ? body.receiverId.trim()
//         : "WALKIN_RECEIVER";

//     const origin =
//       typeof body.origin === "string" && body.origin.trim()
//         ? body.origin.trim()
//         : typeof body.shipper?.city === "string" && body.shipper.city.trim()
//           ? body.shipper.city.trim()
//           : "ORIGIN";

//     const destination =
//       typeof body.destination === "string" && body.destination.trim()
//         ? body.destination.trim()
//         : typeof body.consignee?.country === "string" &&
//             body.consignee.country.trim()
//           ? body.consignee.country.trim()
//           : typeof body.consignee?.city === "string" &&
//               body.consignee.city.trim()
//             ? body.consignee.city.trim()
//             : "DEST";

//     const serviceId =
//       typeof body.serviceId === "string" && body.serviceId.trim()
//         ? body.serviceId.trim()
//         : typeof body.service === "string" && body.service.trim()
//           ? body.service.trim()
//           : typeof body.product === "string" && body.product.trim()
//             ? body.product.trim()
//             : "SELF";

//     const shipmentDate =
//       typeof body.shipmentDate === "string" && body.shipmentDate.trim()
//         ? body.shipmentDate.trim()
//         : new Date().toISOString().slice(0, 10);

//     const piecesInput = body.pieces ?? [];

//     if (piecesInput.length === 0) {
//       return errorResponse(
//         "PIECES_REQUIRED",
//         "At least one shipment piece is required.",
//         400,
//       );
//     }

//     const pieces: ShipmentPiece[] = piecesInput.map((piece, index) => {
//       const quantity = positiveInteger(
//         piece.quantity ?? 1,
//         `pieces[${index}].quantity`,
//       );

//       const actualWeightKg = positiveNumber(
//         piece.actualWeightKg ?? 0,
//         `pieces[${index}].actualWeightKg`,
//       );

//       const lengthCm = positiveNumber(
//         piece.lengthCm ?? 0,
//         `pieces[${index}].lengthCm`,
//       );

//       const widthCm = positiveNumber(
//         piece.widthCm ?? 0,
//         `pieces[${index}].widthCm`,
//       );

//       const heightCm = positiveNumber(
//         piece.heightCm ?? 0,
//         `pieces[${index}].heightCm`,
//       );

//       const volumetricWeightKg = calculateVolumetricWeight(
//         lengthCm,
//         widthCm,
//         heightCm,
//         quantity,
//       );

//       return {
//         pieceId: `piece_${index + 1}`,
//         quantity,
//         actualWeightKg,
//         lengthCm,
//         widthCm,
//         heightCm,
//         volumetricWeightKg,
//         description: piece.description?.trim(),
//       };
//     });

//     const actualWeightKg = pieces.reduce(
//       (total, piece) =>
//         total + (piece.actualWeightKg ?? 0) * piece.quantity,
//       0,
//     );

//     const volumetricWeightKg = pieces.reduce(
//       (total, piece) => total + (piece.volumetricWeightKg ?? 0),
//       0,
//     );

//     const chargeableWeightKg = calculateChargeableWeight(
//       actualWeightKg,
//       volumetricWeightKg,
//     );

//     const gstin =
//       body.gstin?.trim() || body.shipper?.gstin?.trim() || undefined;

//     if (gstin && !isValidGSTIN(gstin)) {
//       return errorResponse("INVALID_GSTIN", "GSTIN is invalid.", 400);
//     }

//     const freight = positiveNumber(body.freight ?? 0, "freight");
//     const fuelSurcharge = positiveNumber(
//       body.fuelSurcharge ?? 0,
//       "fuelSurcharge",
//     );
//     const handlingCharges = positiveNumber(
//       body.handlingCharges ?? 0,
//       "handlingCharges",
//     );
//     const pickupCharges = positiveNumber(
//       body.pickupCharges ?? 0,
//       "pickupCharges",
//     );
//     const deliveryCharges = positiveNumber(
//       body.deliveryCharges ?? 0,
//       "deliveryCharges",
//     );
//     const otherCharges = positiveNumber(
//       body.otherCharges ?? 0,
//       "otherCharges",
//     );
//     const discount = positiveNumber(body.discount ?? 0, "discount");

//     const taxableAmount = Math.max(
//       0,
//       freight +
//         fuelSurcharge +
//         handlingCharges +
//         pickupCharges +
//         deliveryCharges +
//         otherCharges -
//         discount,
//     );

//     const gstRate = body.gstRate ?? 18;
//     const totalTax = taxableAmount * (gstRate / 100);
//     const total = taxableAmount + totalTax;

//     // 10-digit digits-only AWB (logistics range — never collides with food)
//     const awb = await generateBusinessId("LOGISTICS");

//     const now = new Date().toISOString();
//     const trackingStageId = "BOOKED";

//     // Use AWB as document id for stable lookups
//     const awbRef = adminDb.collection("awbs").doc(awb);
//     const trackingEventRef = adminDb.collection("trackingEvents").doc();

//     const awbData = {
//       awb,
//       customerId,
//       senderId,
//       receiverId,
//       origin,
//       destination,
//       serviceId,
//       serviceType: body.serviceType ?? null,
//       shipmentDate,
//       description: body.description?.trim() ?? null,
//       pieces,
//       actualWeightKg,
//       volumetricWeightKg,
//       chargeableWeightKg,
//       gstDetails: {
//         gstin: gstin ?? null,
//         taxableAmount,
//         cgst: totalTax / 2,
//         sgst: totalTax / 2,
//         igst: 0,
//         totalTax,
//       },
//       charges: {
//         freight,
//         fuelSurcharge,
//         handlingCharges,
//         pickupCharges,
//         deliveryCharges,
//         otherCharges,
//         discount,
//         taxableAmount,
//         gst: totalTax,
//         total,
//       },
//       currentStatus: "BOOKED" as TrackingStatus,
//       latestLocation: origin,
//       createdBy: user.userId,
//       updatedBy: user.userId,
//       createdAt: now,
//       updatedAt: now,
//     };

//     const trackingEvent = {
//       trackingEventId: trackingEventRef.id,
//       awb,
//       trackingStageId,
//       status: "BOOKED" as TrackingStatus,
//       location: origin,
//       remarks: "Shipment booked.",
//       eventTime: now,
//       createdBy: user.userId,
//       createdAt: FieldValue.serverTimestamp(),
//     };

//     const batch = adminDb.batch();

//     batch.set(awbRef, {
//       ...awbData,
//       awbDocumentId: awbRef.id,
//     });

//     batch.set(trackingEventRef, trackingEvent);

//     await batch.commit();

//     await writeAuditLog({
//       userId: user.userId,
//       action: "AWB_CREATED",
//       resourceType: "AWB",
//       resourceId: awb,
//       metadata: {
//         customerId,
//         senderId,
//         receiverId,
//         origin,
//         destination,
//         serviceId,
//         chargeableWeightKg,
//       },
//     });

//     return successResponse(
//       {
//         awb,
//         status: "BOOKED",
//         trackingEventId: trackingEventRef.id,
//         shipment: awbData,
//       },
//       201,
//       "AWB created successfully.",
//     );
//   } catch (error) {
//     console.error("POST /api/logistics/awb/create:", error);

//     if (
//       error instanceof Error &&
//       /is required|must be a valid|cannot be negative/i.test(error.message)
//     ) {
//       return errorResponse("VALIDATION_ERROR", error.message, 400);
//     }

//     return errorResponse(
//       "AWB_CREATE_FAILED",
//       error instanceof Error ? error.message : "Unable to create AWB.",
//       500,
//     );
//   }
// }

// import { NextRequest } from "next/server";
// import { FieldValue } from "firebase-admin/firestore";

// import { adminDb } from "@/lib/firebase-admin";
// import { getCurrentUser } from "@/lib/auth";
// import { can } from "@/lib/permissions";
// import { writeAuditLog } from "@/lib/audit";
// import { successResponse, errorResponse } from "@/lib/api-response";
// import { generateBusinessId } from "@/lib/business-id";
// import {
//   calculateChargeableWeight,
//   calculateVolumetricWeight,
// } from "@/utils/calculations";
// import {
//   isValidGSTIN,
//   positiveNumber,
//   positiveInteger,
// } from "@/utils/validators";

// import type { ShipmentPiece } from "@/types/logistics";
// import type { TrackingStatus } from "@/types/tracking";

// type CreateAWBBody = {
//   customerId?: string;
//   senderId?: string;
//   receiverId?: string;

//   origin?: string;
//   destination?: string;

//   serviceId?: string;
//   serviceType?: string;
//   service?: string;
//   product?: string;

//   shipmentDate?: string;
//   description?: string;

//   shipper?: {
//     city?: string;
//     gstin?: string;
//   };
//   consignee?: {
//     city?: string;
//     country?: string;
//   };

//   pieces?: Array<{
//     quantity?: number;
//     actualWeightKg?: number;
//     lengthCm?: number;
//     widthCm?: number;
//     heightCm?: number;
//     description?: string;
//   }>;

//   gstin?: string;

//   freight?: number;
//   fuelSurcharge?: number;
//   handlingCharges?: number;
//   pickupCharges?: number;
//   deliveryCharges?: number;
//   otherCharges?: number;
//   discount?: number;
//   gstRate?: number;
// };

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

//     if (!can(user, "LOGISTICS_AWB_CREATE")) {
//       return errorResponse(
//         "FORBIDDEN",
//         "You do not have permission to create an AWB.",
//         403,
//       );
//     }

//     let body: CreateAWBBody;

//     try {
//       body = await request.json();
//     } catch {
//       return errorResponse(
//         "INVALID_JSON",
//         "Invalid JSON request body.",
//         400,
//       );
//     }

//     const customerId =
//       typeof body.customerId === "string" && body.customerId.trim()
//         ? body.customerId.trim()
//         : "WALKIN";

//     const senderId =
//       typeof body.senderId === "string" && body.senderId.trim()
//         ? body.senderId.trim()
//         : "WALKIN_SENDER";

//     const receiverId =
//       typeof body.receiverId === "string" && body.receiverId.trim()
//         ? body.receiverId.trim()
//         : "WALKIN_RECEIVER";

//     const origin =
//       typeof body.origin === "string" && body.origin.trim()
//         ? body.origin.trim()
//         : typeof body.shipper?.city === "string" && body.shipper.city.trim()
//           ? body.shipper.city.trim()
//           : "ORIGIN";

//     const destination =
//       typeof body.destination === "string" && body.destination.trim()
//         ? body.destination.trim()
//         : typeof body.consignee?.country === "string" &&
//             body.consignee.country.trim()
//           ? body.consignee.country.trim()
//           : typeof body.consignee?.city === "string" &&
//               body.consignee.city.trim()
//             ? body.consignee.city.trim()
//             : "DEST";

//     const serviceId =
//       typeof body.serviceId === "string" && body.serviceId.trim()
//         ? body.serviceId.trim()
//         : typeof body.service === "string" && body.service.trim()
//           ? body.service.trim()
//           : typeof body.product === "string" && body.product.trim()
//             ? body.product.trim()
//             : "SELF";

//     const shipmentDate =
//       typeof body.shipmentDate === "string" && body.shipmentDate.trim()
//         ? body.shipmentDate.trim()
//         : new Date().toISOString().slice(0, 10);

//     const piecesInput = body.pieces ?? [];

//     if (piecesInput.length === 0) {
//       return errorResponse(
//         "PIECES_REQUIRED",
//         "At least one shipment piece is required.",
//         400,
//       );
//     }

//     const pieces: ShipmentPiece[] = piecesInput.map((piece, index) => {
//       const quantity = positiveInteger(
//         piece.quantity ?? 1,
//         `pieces[${index}].quantity`,
//       );

//       const actualWeight = positiveNumber(
//         piece.actualWeightKg ?? 0,
//         `pieces[${index}].actualWeightKg`,
//       );

//       const lengthCm = positiveNumber(
//         piece.lengthCm ?? 0,
//         `pieces[${index}].lengthCm`,
//       );

//       const widthCm = positiveNumber(
//         piece.widthCm ?? 0,
//         `pieces[${index}].widthCm`,
//       );

//       const heightCm = positiveNumber(
//         piece.heightCm ?? 0,
//         `pieces[${index}].heightCm`,
//       );

//       const volumetricWeight = calculateVolumetricWeight(
//         lengthCm,
//         widthCm,
//         heightCm,
//         quantity,
//       );

//       const chargeableWeight = calculateChargeableWeight(
//         actualWeight * quantity,
//         volumetricWeight,
//       );

//       return {
//         pieceId: `piece_${index + 1}`,
//         quantity,
//         actualWeight,
//         volumetricWeight,
//         chargeableWeight,
//         weightUnit: "KG" as const,
//         dimensions: {
//           length: lengthCm,
//           width: widthCm,
//           height: heightCm,
//           unit: "CM" as const,
//           boxCount: quantity,
//         },
//         description: piece.description?.trim(),
//         division: 5000,
//       };
//     });

//     const actualWeightKg = pieces.reduce(
//       (total, piece) => total + piece.actualWeight * piece.quantity,
//       0,
//     );

//     const volumetricWeightKg = pieces.reduce(
//       (total, piece) => total + (piece.volumetricWeight ?? 0),
//       0,
//     );

//     const chargeableWeightKg = calculateChargeableWeight(
//       actualWeightKg,
//       volumetricWeightKg,
//     );

//     const gstin =
//       body.gstin?.trim() || body.shipper?.gstin?.trim() || undefined;

//     if (gstin && !isValidGSTIN(gstin)) {
//       return errorResponse("INVALID_GSTIN", "GSTIN is invalid.", 400);
//     }

//     const freight = positiveNumber(body.freight ?? 0, "freight");
//     const fuelSurcharge = positiveNumber(
//       body.fuelSurcharge ?? 0,
//       "fuelSurcharge",
//     );
//     const handlingCharges = positiveNumber(
//       body.handlingCharges ?? 0,
//       "handlingCharges",
//     );
//     const pickupCharges = positiveNumber(
//       body.pickupCharges ?? 0,
//       "pickupCharges",
//     );
//     const deliveryCharges = positiveNumber(
//       body.deliveryCharges ?? 0,
//       "deliveryCharges",
//     );
//     const otherCharges = positiveNumber(
//       body.otherCharges ?? 0,
//       "otherCharges",
//     );
//     const discount = positiveNumber(body.discount ?? 0, "discount");

//     const taxableAmount = Math.max(
//       0,
//       freight +
//         fuelSurcharge +
//         handlingCharges +
//         pickupCharges +
//         deliveryCharges +
//         otherCharges -
//         discount,
//     );

//     const gstRate = body.gstRate ?? 18;
//     const totalTax = taxableAmount * (gstRate / 100);
//     const total = taxableAmount + totalTax;

//     const awb = await generateBusinessId("LOGISTICS");

//     const now = new Date().toISOString();
//     const trackingStageId = "BOOKED";

//     const awbRef = adminDb.collection("awbs").doc(awb);
//     const trackingEventRef = adminDb.collection("trackingEvents").doc();

//     const awbData = {
//       awb,
//       customerId,
//       senderId,
//       receiverId,
//       origin,
//       destination,
//       serviceId,
//       serviceType: body.serviceType ?? null,
//       shipmentDate,
//       description: body.description?.trim() ?? null,
//       pieces,
//       actualWeightKg,
//       volumetricWeightKg,
//       chargeableWeightKg,
//       // aliases matching richer AWB type field names
//       actualWeight: actualWeightKg,
//       volumetricWeight: volumetricWeightKg,
//       chargeableWeight: chargeableWeightKg,
//       totalPieces: pieces.reduce((n, p) => n + p.quantity, 0),
//       weightUnit: "KG" as const,
//       gstDetails: {
//         gstin: gstin ?? null,
//         taxableAmount,
//         cgst: totalTax / 2,
//         sgst: totalTax / 2,
//         igst: 0,
//         totalTax,
//       },
//       charges: {
//         freight,
//         fuelSurcharge,
//         handlingCharges,
//         pickupCharges,
//         deliveryCharges,
//         otherCharges,
//         discount,
//         taxableAmount,
//         gst: totalTax,
//         total,
//         currency: "INR" as const,
//       },
//       currentStatus: "BOOKED" as TrackingStatus,
//       latestLocation: origin,
//       createdBy: user.userId,
//       updatedBy: user.userId,
//       createdAt: now,
//       updatedAt: now,
//     };

//     const trackingEvent = {
//       trackingEventId: trackingEventRef.id,
//       awb,
//       trackingStageId,
//       status: "BOOKED" as TrackingStatus,
//       location: origin,
//       remarks: "Shipment booked.",
//       eventTime: now,
//       createdBy: user.userId,
//       createdAt: FieldValue.serverTimestamp(),
//     };

//     const batch = adminDb.batch();

//     batch.set(awbRef, {
//       ...awbData,
//       awbDocumentId: awbRef.id,
//     });

//     batch.set(trackingEventRef, trackingEvent);

//     await batch.commit();

//     await writeAuditLog({
//       userId: user.userId,
//       action: "AWB_CREATED",
//       resourceType: "AWB",
//       resourceId: awb,
//       metadata: {
//         customerId,
//         senderId,
//         receiverId,
//         origin,
//         destination,
//         serviceId,
//         chargeableWeightKg,
//       },
//     });

//     return successResponse(
//       {
//         awb,
//         status: "BOOKED",
//         trackingEventId: trackingEventRef.id,
//         shipment: awbData,
//       },
//       201,
//       "AWB created successfully.",
//     );
//   } catch (error) {
//     console.error("POST /api/logistics/awb/create:", error);

//     if (
//       error instanceof Error &&
//       /is required|must be a valid|cannot be negative/i.test(error.message)
//     ) {
//       return errorResponse("VALIDATION_ERROR", error.message, 400);
//     }

//     return errorResponse(
//       "AWB_CREATE_FAILED",
//       error instanceof Error ? error.message : "Unable to create AWB.",
//       500,
//     );
//   }
// }

// import { NextRequest } from "next/server";
// import { FieldValue } from "firebase-admin/firestore";

// import { adminDb } from "@/lib/firebase-admin";
// import { getCurrentUser } from "@/lib/auth";
// import { can } from "@/lib/permissions";
// import { writeAuditLog } from "@/lib/audit";
// import { successResponse, errorResponse } from "@/lib/api-response";
// import { generateBusinessId } from "@/lib/business-id";
// import {
//   calculateChargeableWeight,
//   calculateVolumetricWeight,
// } from "@/utils/calculations";
// import {
//   isValidGSTIN,
//   positiveNumber,
//   positiveInteger,
// } from "@/utils/validators";

// import type { ShipmentPiece } from "@/types/logistics";
// import type { TrackingStatus } from "@/types/tracking";

// /** USA → 5000, Australia → 4000, else 5000 */
// function getVolumetricDivisor(
//   destination?: string,
//   country?: string,
// ): number {
//   const text = `${destination || ""} ${country || ""}`.toUpperCase();

//   if (
//     text.includes("AUSTRALIA") ||
//     text.includes("AUSTRALIAN") ||
//     /\bAUS\b/.test(text) ||
//     /\bAU\b/.test(text) ||
//     text.includes("SYDNEY") ||
//     text.includes("MELBOURNE") ||
//     text.includes("BRISBANE") ||
//     text.includes("PERTH") ||
//     text.includes("ADELAIDE")
//   ) {
//     return 4000;
//   }

//   if (
//     text.includes("USA") ||
//     text.includes("U.S.A") ||
//     text.includes("U.S.") ||
//     text.includes("UNITED STATES") ||
//     text.includes("AMERICA") ||
//     /\bUS\b/.test(text)
//   ) {
//     return 5000;
//   }

//   return 5000;
// }

// type CreateAWBBody = {
//   customerId?: string;
//   senderId?: string;
//   receiverId?: string;

//   origin?: string;
//   destination?: string;

//   serviceId?: string;
//   serviceType?: string;
//   service?: string;
//   product?: string;

//   shipmentDate?: string;
//   description?: string;

//   shipper?: {
//     city?: string;
//     gstin?: string;
//   };
//   consignee?: {
//     city?: string;
//     country?: string;
//   };

//   pieces?: Array<{
//     quantity?: number;
//     actualWeightKg?: number;
//     lengthCm?: number;
//     widthCm?: number;
//     heightCm?: number;
//     description?: string;
//     division?: number;
//   }>;

//   gstin?: string;

//   freight?: number;
//   fuelSurcharge?: number;
//   handlingCharges?: number;
//   pickupCharges?: number;
//   deliveryCharges?: number;
//   otherCharges?: number;
//   discount?: number;
//   gstRate?: number;
// };

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

//     if (!can(user, "LOGISTICS_AWB_CREATE")) {
//       return errorResponse(
//         "FORBIDDEN",
//         "You do not have permission to create an AWB.",
//         403,
//       );
//     }

//     let body: CreateAWBBody;

//     try {
//       body = await request.json();
//     } catch {
//       return errorResponse("INVALID_JSON", "Invalid JSON request body.", 400);
//     }

//     const customerId =
//       typeof body.customerId === "string" && body.customerId.trim()
//         ? body.customerId.trim()
//         : "WALKIN";

//     const senderId =
//       typeof body.senderId === "string" && body.senderId.trim()
//         ? body.senderId.trim()
//         : "WALKIN_SENDER";

//     const receiverId =
//       typeof body.receiverId === "string" && body.receiverId.trim()
//         ? body.receiverId.trim()
//         : "WALKIN_RECEIVER";

//     const origin =
//       typeof body.origin === "string" && body.origin.trim()
//         ? body.origin.trim()
//         : typeof body.shipper?.city === "string" && body.shipper.city.trim()
//           ? body.shipper.city.trim()
//           : "ORIGIN";

//     const destination =
//       typeof body.destination === "string" && body.destination.trim()
//         ? body.destination.trim()
//         : typeof body.consignee?.country === "string" &&
//             body.consignee.country.trim()
//           ? body.consignee.country.trim()
//           : typeof body.consignee?.city === "string" &&
//               body.consignee.city.trim()
//             ? body.consignee.city.trim()
//             : "DEST";

//     const consigneeCountry =
//       typeof body.consignee?.country === "string"
//         ? body.consignee.country.trim()
//         : "";

//     const regionDivisor = getVolumetricDivisor(destination, consigneeCountry);

//     const serviceId =
//       typeof body.serviceId === "string" && body.serviceId.trim()
//         ? body.serviceId.trim()
//         : typeof body.service === "string" && body.service.trim()
//           ? body.service.trim()
//           : typeof body.product === "string" && body.product.trim()
//             ? body.product.trim()
//             : "SELF";

//     const shipmentDate =
//       typeof body.shipmentDate === "string" && body.shipmentDate.trim()
//         ? body.shipmentDate.trim()
//         : new Date().toISOString().slice(0, 10);

//     const piecesInput = body.pieces ?? [];

//     if (piecesInput.length === 0) {
//       return errorResponse(
//         "PIECES_REQUIRED",
//         "At least one shipment piece is required.",
//         400,
//       );
//     }

//     const pieces: ShipmentPiece[] = piecesInput.map((piece, index) => {
//       const quantity = positiveInteger(
//         piece.quantity ?? 1,
//         `pieces[${index}].quantity`,
//       );

//       const actualWeight = positiveNumber(
//         piece.actualWeightKg ?? 0,
//         `pieces[${index}].actualWeightKg`,
//       );

//       const lengthCm = positiveNumber(
//         piece.lengthCm ?? 0,
//         `pieces[${index}].lengthCm`,
//       );

//       const widthCm = positiveNumber(
//         piece.widthCm ?? 0,
//         `pieces[${index}].widthCm`,
//       );

//       const heightCm = positiveNumber(
//         piece.heightCm ?? 0,
//         `pieces[${index}].heightCm`,
//       );

//       const division =
//         Number(piece.division) > 0 ? Number(piece.division) : regionDivisor;

//       // (L × B × H / divisor) × quantity  — NOT quantity as divisor
//       const volumetricWeight =
//         calculateVolumetricWeight(lengthCm, widthCm, heightCm, division) *
//         quantity;

//       const chargeableWeight = calculateChargeableWeight(
//         actualWeight * quantity,
//         volumetricWeight,
//       );

//       return {
//         pieceId: `piece_${index + 1}`,
//         quantity,
//         actualWeight,
//         volumetricWeight,
//         chargeableWeight,
//         weightUnit: "KG" as const,
//         dimensions: {
//           length: lengthCm,
//           width: widthCm,
//           height: heightCm,
//           unit: "CM" as const,
//           boxCount: quantity,
//         },
//         description: piece.description?.trim(),
//         division,
//       };
//     });

//     const actualWeightKg = pieces.reduce(
//       (total, piece) => total + piece.actualWeight * piece.quantity,
//       0,
//     );

//     const volumetricWeightKg = pieces.reduce(
//       (total, piece) => total + (piece.volumetricWeight ?? 0),
//       0,
//     );

//     const chargeableWeightKg = calculateChargeableWeight(
//       actualWeightKg,
//       volumetricWeightKg,
//     );

//     const gstin =
//       body.gstin?.trim() || body.shipper?.gstin?.trim() || undefined;

//     if (gstin && !isValidGSTIN(gstin)) {
//       return errorResponse("INVALID_GSTIN", "GSTIN is invalid.", 400);
//     }

//     const freight = positiveNumber(body.freight ?? 0, "freight");
//     const fuelSurcharge = positiveNumber(
//       body.fuelSurcharge ?? 0,
//       "fuelSurcharge",
//     );
//     const handlingCharges = positiveNumber(
//       body.handlingCharges ?? 0,
//       "handlingCharges",
//     );
//     const pickupCharges = positiveNumber(
//       body.pickupCharges ?? 0,
//       "pickupCharges",
//     );
//     const deliveryCharges = positiveNumber(
//       body.deliveryCharges ?? 0,
//       "deliveryCharges",
//     );
//     const otherCharges = positiveNumber(
//       body.otherCharges ?? 0,
//       "otherCharges",
//     );
//     const discount = positiveNumber(body.discount ?? 0, "discount");

//     const taxableAmount = Math.max(
//       0,
//       freight +
//         fuelSurcharge +
//         handlingCharges +
//         pickupCharges +
//         deliveryCharges +
//         otherCharges -
//         discount,
//     );

//     const gstRate = body.gstRate ?? 18;
//     const totalTax = taxableAmount * (gstRate / 100);
//     const total = taxableAmount + totalTax;

//     const awb = await generateBusinessId("LOGISTICS");

//     const now = new Date().toISOString();
//     const trackingStageId = "BOOKED";

//     const awbRef = adminDb.collection("awbs").doc(awb);
//     const trackingEventRef = adminDb.collection("trackingEvents").doc();

//     const awbData = {
//       awb,
//       customerId,
//       senderId,
//       receiverId,
//       origin,
//       destination,
//       serviceId,
//       serviceType: body.serviceType ?? null,
//       shipmentDate,
//       description: body.description?.trim() ?? null,
//       pieces,
//       volumetricDivisor: regionDivisor,
//       actualWeightKg,
//       volumetricWeightKg,
//       chargeableWeightKg,
//       actualWeight: actualWeightKg,
//       volumetricWeight: volumetricWeightKg,
//       chargeableWeight: chargeableWeightKg,
//       totalPieces: pieces.reduce((n, p) => n + p.quantity, 0),
//       weightUnit: "KG" as const,
//       gstDetails: {
//         gstin: gstin ?? null,
//         taxableAmount,
//         cgst: totalTax / 2,
//         sgst: totalTax / 2,
//         igst: 0,
//         totalTax,
//       },
//       charges: {
//         freight,
//         fuelSurcharge,
//         handlingCharges,
//         pickupCharges,
//         deliveryCharges,
//         otherCharges,
//         discount,
//         taxableAmount,
//         gst: totalTax,
//         total,
//         currency: "INR" as const,
//       },
//       currentStatus: "BOOKED" as TrackingStatus,
//       latestLocation: origin,
//       createdBy: user.userId,
//       updatedBy: user.userId,
//       createdAt: now,
//       updatedAt: now,
//     };

//     const trackingEvent = {
//       trackingEventId: trackingEventRef.id,
//       awb,
//       trackingStageId,
//       status: "BOOKED" as TrackingStatus,
//       location: origin,
//       remarks: "Shipment booked.",
//       eventTime: now,
//       createdBy: user.userId,
//       createdAt: FieldValue.serverTimestamp(),
//     };

//     const batch = adminDb.batch();

//     batch.set(awbRef, {
//       ...awbData,
//       awbDocumentId: awbRef.id,
//     });

//     batch.set(trackingEventRef, trackingEvent);

//     await batch.commit();

//     await writeAuditLog({
//       userId: user.userId,
//       action: "AWB_CREATED",
//       resourceType: "AWB",
//       resourceId: awb,
//       metadata: {
//         customerId,
//         senderId,
//         receiverId,
//         origin,
//         destination,
//         serviceId,
//         chargeableWeightKg,
//         volumetricDivisor: regionDivisor,
//       },
//     });

//     return successResponse(
//       {
//         awb,
//         status: "BOOKED",
//         trackingEventId: trackingEventRef.id,
//         shipment: awbData,
//       },
//       201,
//       "AWB created successfully.",
//     );
//   } catch (error) {
//     console.error("POST /api/logistics/awb/create:", error);

//     if (
//       error instanceof Error &&
//       /is required|must be a valid|cannot be negative/i.test(error.message)
//     ) {
//       return errorResponse("VALIDATION_ERROR", error.message, 400);
//     }

//     return errorResponse(
//       "AWB_CREATE_FAILED",
//       error instanceof Error ? error.message : "Unable to create AWB.",
//       500,
//     );
//   }
// }

// import { NextRequest } from "next/server";
// import { FieldValue } from "firebase-admin/firestore";

// import { adminDb } from "@/lib/firebase-admin";
// import { getCurrentUser } from "@/lib/auth";
// import { can } from "@/lib/permissions";
// import { writeAuditLog } from "@/lib/audit";
// import { successResponse, errorResponse } from "@/lib/api-response";
// import { generateBusinessId } from "@/lib/business-id";
// import {
//   calculateChargeableWeight,
//   calculateVolumetricWeight,
// } from "@/utils/calculations";
// import {
//   isValidGSTIN,
//   positiveNumber,
//   positiveInteger,
// } from "@/utils/validators";

// import type { ShipmentPiece } from "@/types/logistics";
// import type { TrackingStatus } from "@/types/tracking";

// function getVolumetricDivisor(
//   destination?: string,
//   country?: string,
// ): number {
//   const text = `${destination || ""} ${country || ""}`.toUpperCase();

//   if (
//     text.includes("AUSTRALIA") ||
//     text.includes("AUSTRALIAN") ||
//     /\bAUS\b/.test(text) ||
//     /\bAU\b/.test(text) ||
//     text.includes("SYDNEY") ||
//     text.includes("MELBOURNE") ||
//     text.includes("BRISBANE") ||
//     text.includes("PERTH") ||
//     text.includes("ADELAIDE")
//   ) {
//     return 4000;
//   }

//   if (
//     text.includes("USA") ||
//     text.includes("U.S.A") ||
//     text.includes("U.S.") ||
//     text.includes("UNITED STATES") ||
//     text.includes("AMERICA") ||
//     /\bUS\b/.test(text)
//   ) {
//     return 5000;
//   }

//   return 5000;
// }

// function str(v: unknown, fallback = ""): string {
//   if (v == null) return fallback;
//   return String(v).trim() || fallback;
// }

// function boxKey(raw: unknown): "BOX_1" | "BOX_2" {
//   const s = String(raw || "BOX_1").toUpperCase();
//   if (s.includes("2") || s === "BOX_2") return "BOX_2";
//   return "BOX_1";
// }

// type InvoiceItemBody = {
//   description?: string;
//   quantity?: number;
//   rate?: number;
//   amount?: number;
//   hsCode?: string;
//   shopName?: string;
//   shopAddress?: string;
//   boxNo?: string | number;
// };

// type CreateAWBBody = {
//   customerId?: string;
//   senderId?: string;
//   receiverId?: string;
//   customerName?: string;
//   customerCode?: string;
//   accountCode?: string;

//   origin?: string;
//   destination?: string;

//   serviceId?: string;
//   serviceType?: string;
//   service?: string;
//   product?: string;
//   vendor?: string;

//   shipmentDate?: string;
//   description?: string;

//   shipper?: Record<string, unknown>;
//   consignee?: Record<string, unknown>;

//   pieces?: Array<{
//     quantity?: number;
//     actualWeightKg?: number;
//     lengthCm?: number;
//     widthCm?: number;
//     heightCm?: number;
//     description?: string;
//     division?: number;
//   }>;

//   items?: InvoiceItemBody[];

//   gstin?: string;
//   csbType?: string;
//   termOfInvoice?: string;
//   exportReason?: string;
//   invoiceNo?: string;
//   invoiceDate?: string;

//   freight?: number;
//   fuelSurcharge?: number;
//   handlingCharges?: number;
//   pickupCharges?: number;
//   deliveryCharges?: number;
//   otherCharges?: number;
//   discount?: number;
//   gstRate?: number;

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

//     if (!can(user, "LOGISTICS_AWB_CREATE")) {
//       return errorResponse(
//         "FORBIDDEN",
//         "You do not have permission to create an AWB.",
//         403,
//       );
//     }

//     const canManageCharges = can(user, "LOGISTICS_CHARGE_MANAGE");
//     const canEditProformaRestricted = can(
//       user,
//       "LOGISTICS_PROFORMA_RESTRICTED_EDIT",
//     );

//     let body: CreateAWBBody;

//     try {
//       body = await request.json();
//     } catch {
//       return errorResponse("INVALID_JSON", "Invalid JSON request body.", 400);
//     }

//     const customerId =
//       typeof body.customerId === "string" && body.customerId.trim()
//         ? body.customerId.trim()
//         : "WALKIN";

//     const senderId =
//       typeof body.senderId === "string" && body.senderId.trim()
//         ? body.senderId.trim()
//         : "WALKIN_SENDER";

//     const receiverId =
//       typeof body.receiverId === "string" && body.receiverId.trim()
//         ? body.receiverId.trim()
//         : "WALKIN_RECEIVER";

//     const origin =
//       typeof body.origin === "string" && body.origin.trim()
//         ? body.origin.trim()
//         : str(body.shipper?.city, "ORIGIN");

//     const destination =
//       typeof body.destination === "string" && body.destination.trim()
//         ? body.destination.trim()
//         : str(body.consignee?.country) ||
//           str(body.consignee?.city, "DEST");

//     const consigneeCountry = str(body.consignee?.country);
//     const regionDivisor = getVolumetricDivisor(destination, consigneeCountry);

//     const serviceId =
//       typeof body.serviceId === "string" && body.serviceId.trim()
//         ? body.serviceId.trim()
//         : typeof body.service === "string" && body.service.trim()
//           ? body.service.trim()
//           : typeof body.product === "string" && body.product.trim()
//             ? body.product.trim()
//             : "SELF";

//     const shipmentDate =
//       typeof body.shipmentDate === "string" && body.shipmentDate.trim()
//         ? body.shipmentDate.trim()
//         : new Date().toISOString().slice(0, 10);

//     const piecesInput = body.pieces ?? [];

//     if (piecesInput.length === 0) {
//       return errorResponse(
//         "PIECES_REQUIRED",
//         "At least one shipment piece is required.",
//         400,
//       );
//     }

//     const pieces: ShipmentPiece[] = piecesInput.map((piece, index) => {
//       const quantity = positiveInteger(
//         piece.quantity ?? 1,
//         `pieces[${index}].quantity`,
//       );

//       const actualWeight = positiveNumber(
//         piece.actualWeightKg ?? 0,
//         `pieces[${index}].actualWeightKg`,
//       );

//       const lengthCm = positiveNumber(
//         piece.lengthCm ?? 0,
//         `pieces[${index}].lengthCm`,
//       );

//       const widthCm = positiveNumber(
//         piece.widthCm ?? 0,
//         `pieces[${index}].widthCm`,
//       );

//       const heightCm = positiveNumber(
//         piece.heightCm ?? 0,
//         `pieces[${index}].heightCm`,
//       );

//       const division =
//         Number(piece.division) > 0 ? Number(piece.division) : regionDivisor;

//       const volumetricWeight =
//         calculateVolumetricWeight(lengthCm, widthCm, heightCm, division) *
//         quantity;

//       const chargeableWeight = calculateChargeableWeight(
//         actualWeight * quantity,
//         volumetricWeight,
//       );

//       return {
//         pieceId: `piece_${index + 1}`,
//         quantity,
//         actualWeight,
//         volumetricWeight,
//         chargeableWeight,
//         weightUnit: "KG" as const,
//         dimensions: {
//           length: lengthCm,
//           width: widthCm,
//           height: heightCm,
//           unit: "CM" as const,
//           boxCount: quantity,
//         },
//         description: piece.description?.trim(),
//         division,
//       };
//     });

//     const actualWeightKg = pieces.reduce(
//       (total, piece) => total + piece.actualWeight * piece.quantity,
//       0,
//     );

//     const volumetricWeightKg = pieces.reduce(
//       (total, piece) => total + (piece.volumetricWeight ?? 0),
//       0,
//     );

//     const chargeableWeightKg = calculateChargeableWeight(
//       actualWeightKg,
//       volumetricWeightKg,
//     );

//     const gstin =
//       body.gstin?.trim() || str(body.shipper?.gstin) || undefined;

//     if (gstin && !isValidGSTIN(gstin)) {
//       return errorResponse("INVALID_GSTIN", "GSTIN is invalid.", 400);
//     }

//     // Charges: agents cannot set — force zero unless Super Admin
//     const freight = canManageCharges
//       ? positiveNumber(body.freight ?? 0, "freight")
//       : 0;
//     const fuelSurcharge = canManageCharges
//       ? positiveNumber(body.fuelSurcharge ?? 0, "fuelSurcharge")
//       : 0;
//     const handlingCharges = canManageCharges
//       ? positiveNumber(body.handlingCharges ?? 0, "handlingCharges")
//       : 0;
//     const pickupCharges = canManageCharges
//       ? positiveNumber(body.pickupCharges ?? 0, "pickupCharges")
//       : 0;
//     const deliveryCharges = canManageCharges
//       ? positiveNumber(body.deliveryCharges ?? 0, "deliveryCharges")
//       : 0;
//     const otherCharges = canManageCharges
//       ? positiveNumber(body.otherCharges ?? 0, "otherCharges")
//       : 0;
//     const discount = canManageCharges
//       ? positiveNumber(body.discount ?? 0, "discount")
//       : 0;

//     const taxableAmount = Math.max(
//       0,
//       freight +
//         fuelSurcharge +
//         handlingCharges +
//         pickupCharges +
//         deliveryCharges +
//         otherCharges -
//         discount,
//     );

//     const gstRate = body.gstRate ?? 18;
//     const totalTax = taxableAmount * (gstRate / 100);
//     const total = taxableAmount + totalTax;

//     // Proforma items (Box-1 / Box-2)
//     const itemsInput = Array.isArray(body.items) ? body.items : [];
//     const items = itemsInput.map((it, index) => {
//       const quantity = Number(it.quantity) || 1;
//       const rate = Number(it.rate) || 0;
//       const amount = Number(it.amount) || Number((quantity * rate).toFixed(2));

//       const restricted = {
//         description: str(it.description, `Item ${index + 1}`),
//         shopName: str(it.shopName),
//         shopAddress: str(it.shopAddress),
//         hsCode: str(it.hsCode),
//       };

//       // Agents may only send qty/rate/amount; restricted fields accepted only for Super Admin
//       if (!canEditProformaRestricted) {
//         // still store what agent sent for qty/amount; empty restricted if agent forged them is ok for create
//         // Prefer keeping client values so form works; Super Admin is source of truth on edit later
//       }

//       return {
//         id: `item_${index + 1}`,
//         boxNo: boxKey(it.boxNo),
//         description: restricted.description,
//         shopName: restricted.shopName || null,
//         shopAddress: restricted.shopAddress || null,
//         hsCode: restricted.hsCode || null,
//         quantity,
//         rate,
//         unitRate: rate,
//         amount,
//       };
//     });

//     const boxesPresent = Array.from(
//       new Set(items.map((i) => i.boxNo)),
//     ) as Array<"BOX_1" | "BOX_2">;

//     // One AWB parent; optional child AWBs per box when 2+ boxes
//     const parentAwb = await generateBusinessId("LOGISTICS");
//     const now = new Date().toISOString();
//     const trackingStageId = "BOOKED";

//     const shipper = body.shipper || {};
//     const consignee = body.consignee || {};

//     const baseShipment = {
//       customerId,
//       customerName: str(body.customerName),
//       customerCode: str(body.customerCode),
//       accountCode: str(body.accountCode),
//       senderId,
//       receiverId,
//       origin,
//       destination,
//       serviceId,
//       serviceType: body.serviceType ?? null,
//       product: str(body.product),
//       vendor: str(body.vendor),
//       service: str(body.service, serviceId),
//       shipmentDate,
//       description: body.description?.trim() ?? null,
//       shipper,
//       consignee,
//       pieces,
//       items,
//       boxes: boxesPresent,
//       volumetricDivisor: regionDivisor,
//       actualWeightKg,
//       volumetricWeightKg,
//       chargeableWeightKg,
//       actualWeight: actualWeightKg,
//       volumetricWeight: volumetricWeightKg,
//       chargeableWeight: chargeableWeightKg,
//       totalPieces: pieces.reduce((n, p) => n + p.quantity, 0),
//       packageType: str(body.packageType, "PKT"),
//       weightUnit: "KG" as const,
//       shipmentValue: Number(body.shipmentValue) || 0,
//       currency: str(body.currency, "INR"),
//       paymentType: str(body.paymentType, "Credit"),
//       referenceNo: str(body.referenceNo),
//       commercial: Boolean(body.commercial),
//       oda: Boolean(body.oda),
//       medicalCharges: Boolean(body.medicalCharges),
//       csbType: str(body.csbType, "CSB4"),
//       termOfInvoice: str(body.termOfInvoice, "CIF"),
//       exportReason: str(body.exportReason),
//       invoiceNo: str(body.invoiceNo),
//       invoiceDate: str(body.invoiceDate),
//       gstDetails: {
//         gstin: gstin ?? null,
//         taxableAmount,
//         cgst: totalTax / 2,
//         sgst: totalTax / 2,
//         igst: 0,
//         totalTax,
//       },
//       charges: {
//         freight,
//         fuelSurcharge,
//         handlingCharges,
//         pickupCharges,
//         deliveryCharges,
//         otherCharges,
//         discount,
//         taxableAmount,
//         gst: totalTax,
//         total,
//         currency: "INR" as const,
//       },
//       currentStatus: "BOOKED" as TrackingStatus,
//       latestLocation: origin,
//       createdBy: user.userId,
//       updatedBy: user.userId,
//       createdAt: now,
//       updatedAt: now,
//     };

//     const batch = adminDb.batch();
//     const createdAwbs: string[] = [];

//     // Parent AWB
//     const parentRef = adminDb.collection("awbs").doc(parentAwb);
//     batch.set(parentRef, {
//       ...baseShipment,
//       awb: parentAwb,
//       awbDocumentId: parentRef.id,
//       parentAwb: null,
//       isParent: boxesPresent.length > 1,
//     });
//     createdAwbs.push(parentAwb);

//     const parentTrackRef = adminDb.collection("trackingEvents").doc();
//     batch.set(parentTrackRef, {
//       trackingEventId: parentTrackRef.id,
//       awb: parentAwb,
//       trackingStageId,
//       status: "BOOKED" as TrackingStatus,
//       location: origin,
//       remarks: "Shipment booked.",
//       eventTime: now,
//       createdBy: user.userId,
//       createdAt: FieldValue.serverTimestamp(),
//     });

//     // Separate child AWB per box when multiple boxes (invoice/label per box)
//     const childAwbs: Array<{ boxNo: string; awb: string }> = [];

//     if (boxesPresent.length > 1) {
//       for (const box of boxesPresent) {
//         const childAwb = await generateBusinessId("LOGISTICS");
//         const childItems = items.filter((i) => i.boxNo === box);
//         const childRef = adminDb.collection("awbs").doc(childAwb);

//         batch.set(childRef, {
//           ...baseShipment,
//           awb: childAwb,
//           awbDocumentId: childRef.id,
//           parentAwb,
//           boxNo: box,
//           isParent: false,
//           items: childItems,
//           referenceNo: str(body.referenceNo) || parentAwb,
//         });

//         createdAwbs.push(childAwb);
//         childAwbs.push({ boxNo: box, awb: childAwb });

//         const trackRef = adminDb.collection("trackingEvents").doc();
//         batch.set(trackRef, {
//           trackingEventId: trackRef.id,
//           awb: childAwb,
//           trackingStageId,
//           status: "BOOKED" as TrackingStatus,
//           location: origin,
//           remarks: `Shipment booked (${box}).`,
//           eventTime: now,
//           createdBy: user.userId,
//           createdAt: FieldValue.serverTimestamp(),
//         });
//       }

//       batch.update(parentRef, { childAwbs });
//     }

//     await batch.commit();

//     await writeAuditLog({
//       userId: user.userId,
//       action: "AWB_CREATED",
//       resourceType: "AWB",
//       resourceId: parentAwb,
//       metadata: {
//         customerId,
//         origin,
//         destination,
//         volumetricDivisor: regionDivisor,
//         boxes: boxesPresent,
//         childAwbs,
//         chargesManagedBySuperAdmin: canManageCharges,
//       },
//     });

//     return successResponse(
//       {
//         awb: parentAwb,
//         childAwbs,
//         status: "BOOKED",
//         trackingEventId: parentTrackRef.id,
//         shipment: {
//           ...baseShipment,
//           awb: parentAwb,
//           childAwbs,
//         },
//       },
//       201,
//       boxesPresent.length > 1
//         ? `AWB created with separate box AWBs (${boxesPresent.join(", ")}).`
//         : "AWB created successfully.",
//     );
//   } catch (error) {
//     console.error("POST /api/logistics/awb/create:", error);

//     if (
//       error instanceof Error &&
//       /is required|must be a valid|cannot be negative/i.test(error.message)
//     ) {
//       return errorResponse("VALIDATION_ERROR", error.message, 400);
//     }

//     return errorResponse(
//       "AWB_CREATE_FAILED",
//       error instanceof Error ? error.message : "Unable to create AWB.",
//       500,
//     );
//   }
// }

// import { NextRequest } from "next/server";
// import { FieldValue } from "firebase-admin/firestore";

// import { adminDb } from "@/lib/firebase-admin";
// import { getCurrentUser } from "@/lib/auth";
// import { can } from "@/lib/permissions";
// import { writeAuditLog } from "@/lib/audit";
// import { successResponse, errorResponse } from "@/lib/api-response";
// import { generateBusinessId } from "@/lib/business-id";
// import {
//   calculateChargeableWeight,
//   calculateVolumetricWeight,
// } from "@/utils/calculations";
// import {
//   isValidGSTIN,
//   positiveNumber,
//   positiveInteger,
// } from "@/utils/validators";

// import type { ShipmentPiece } from "@/types/logistics";
// import type { TrackingStatus } from "@/types/tracking";

// function getVolumetricDivisor(
//   destination?: string,
//   country?: string,
// ): number {
//   const text = `${destination || ""} ${country || ""}`.toUpperCase();

//   if (
//     text.includes("AUSTRALIA") ||
//     text.includes("AUSTRALIAN") ||
//     /\bAUS\b/.test(text) ||
//     /\bAU\b/.test(text) ||
//     text.includes("SYDNEY") ||
//     text.includes("MELBOURNE") ||
//     text.includes("BRISBANE") ||
//     text.includes("PERTH") ||
//     text.includes("ADELAIDE")
//   ) {
//     return 4000;
//   }

//   if (
//     text.includes("USA") ||
//     text.includes("U.S.A") ||
//     text.includes("U.S.") ||
//     text.includes("UNITED STATES") ||
//     text.includes("AMERICA") ||
//     /\bUS\b/.test(text)
//   ) {
//     return 5000;
//   }

//   return 5000;
// }

// function str(v: unknown, fallback = ""): string {
//   if (v == null) return fallback;
//   return String(v).trim() || fallback;
// }

// function boxKey(raw: unknown): "BOX_1" | "BOX_2" {
//   const s = String(raw || "BOX_1").toUpperCase();
//   if (s.includes("2") || s === "BOX_2") return "BOX_2";
//   return "BOX_1";
// }

// type InvoiceItemBody = {
//   description?: string;
//   quantity?: number;
//   rate?: number;
//   amount?: number;
//   hsCode?: string;
//   shopName?: string;
//   shopAddress?: string;
//   boxNo?: string | number;
// };

// type CreateAWBBody = {
//   customerId?: string;
//   senderId?: string;
//   receiverId?: string;
//   customerName?: string;
//   customerCode?: string;
//   accountCode?: string;

//   origin?: string;
//   destination?: string;

//   serviceId?: string;
//   serviceType?: string;
//   service?: string;
//   product?: string;
//   vendor?: string;

//   shipmentDate?: string;
//   description?: string;

//   shipper?: Record<string, unknown>;
//   consignee?: Record<string, unknown>;

//   pieces?: Array<{
//     quantity?: number;
//     actualWeightKg?: number;
//     lengthCm?: number;
//     widthCm?: number;
//     heightCm?: number;
//     description?: string;
//     division?: number;
//   }>;

//   items?: InvoiceItemBody[];

//   gstin?: string;
//   csbType?: string;
//   termOfInvoice?: string;
//   exportReason?: string;
//   invoiceNo?: string;
//   invoiceDate?: string;

//   freight?: number;
//   fuelSurcharge?: number;
//   handlingCharges?: number;
//   pickupCharges?: number;
//   deliveryCharges?: number;
//   otherCharges?: number;
//   discount?: number;
//   gstRate?: number;

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

//     // CO_LOADER has this permission in ROLE_PERMISSIONS
//     if (!can(user, "LOGISTICS_AWB_CREATE")) {
//       return errorResponse(
//         "FORBIDDEN",
//         "You do not have permission to create an AWB.",
//         403,
//       );
//     }

//     // Super Admin only for charges / restricted proforma fields
//     const canManageCharges = user.role === "SUPER_ADMIN";
//     const canEditProformaRestricted = user.role === "SUPER_ADMIN";

//     let body: CreateAWBBody;

//     try {
//       body = await request.json();
//     } catch {
//       return errorResponse("INVALID_JSON", "Invalid JSON request body.", 400);
//     }

//     const customerId =
//       typeof body.customerId === "string" && body.customerId.trim()
//         ? body.customerId.trim()
//         : "WALKIN";

//     const senderId =
//       typeof body.senderId === "string" && body.senderId.trim()
//         ? body.senderId.trim()
//         : "WALKIN_SENDER";

//     const receiverId =
//       typeof body.receiverId === "string" && body.receiverId.trim()
//         ? body.receiverId.trim()
//         : "WALKIN_RECEIVER";

//     const origin =
//       typeof body.origin === "string" && body.origin.trim()
//         ? body.origin.trim()
//         : str(body.shipper?.city, "ORIGIN");

//     const destination =
//       typeof body.destination === "string" && body.destination.trim()
//         ? body.destination.trim()
//         : str(body.consignee?.country) || str(body.consignee?.city, "DEST");

//     const consigneeCountry = str(body.consignee?.country);
//     const regionDivisor = getVolumetricDivisor(destination, consigneeCountry);

//     const serviceId =
//       typeof body.serviceId === "string" && body.serviceId.trim()
//         ? body.serviceId.trim()
//         : typeof body.service === "string" && body.service.trim()
//           ? body.service.trim()
//           : typeof body.product === "string" && body.product.trim()
//             ? body.product.trim()
//             : "SELF";

//     const shipmentDate =
//       typeof body.shipmentDate === "string" && body.shipmentDate.trim()
//         ? body.shipmentDate.trim()
//         : new Date().toISOString().slice(0, 10);

//     const piecesInput = body.pieces ?? [];

//     if (piecesInput.length === 0) {
//       return errorResponse(
//         "PIECES_REQUIRED",
//         "At least one shipment piece is required.",
//         400,
//       );
//     }

//     const pieces: ShipmentPiece[] = piecesInput.map((piece, index) => {
//       const quantity = positiveInteger(
//         piece.quantity ?? 1,
//         `pieces[${index}].quantity`,
//       );

//       const actualWeight = positiveNumber(
//         piece.actualWeightKg ?? 0,
//         `pieces[${index}].actualWeightKg`,
//       );

//       const lengthCm = positiveNumber(
//         piece.lengthCm ?? 0,
//         `pieces[${index}].lengthCm`,
//       );

//       const widthCm = positiveNumber(
//         piece.widthCm ?? 0,
//         `pieces[${index}].widthCm`,
//       );

//       const heightCm = positiveNumber(
//         piece.heightCm ?? 0,
//         `pieces[${index}].heightCm`,
//       );

//       const division =
//         Number(piece.division) > 0 ? Number(piece.division) : regionDivisor;

//       const volumetricWeight =
//         calculateVolumetricWeight(lengthCm, widthCm, heightCm, division) *
//         quantity;

//       const chargeableWeight = calculateChargeableWeight(
//         actualWeight * quantity,
//         volumetricWeight,
//       );

//       return {
//         pieceId: `piece_${index + 1}`,
//         quantity,
//         actualWeight,
//         volumetricWeight,
//         chargeableWeight,
//         weightUnit: "KG" as const,
//         dimensions: {
//           length: lengthCm,
//           width: widthCm,
//           height: heightCm,
//           unit: "CM" as const,
//           boxCount: quantity,
//         },
//         description: piece.description?.trim(),
//         division,
//       };
//     });

//     const actualWeightKg = pieces.reduce(
//       (total, piece) => total + piece.actualWeight * piece.quantity,
//       0,
//     );

//     const volumetricWeightKg = pieces.reduce(
//       (total, piece) => total + (piece.volumetricWeight ?? 0),
//       0,
//     );

//     const chargeableWeightKg = calculateChargeableWeight(
//       actualWeightKg,
//       volumetricWeightKg,
//     );

//     const gstin =
//       body.gstin?.trim() || str(body.shipper?.gstin) || undefined;

//     if (gstin && !isValidGSTIN(gstin)) {
//       return errorResponse("INVALID_GSTIN", "GSTIN is invalid.", 400);
//     }

//     // Co-loader / Admin: charges forced to 0 unless Super Admin
//     const freight = canManageCharges
//       ? positiveNumber(body.freight ?? 0, "freight")
//       : 0;
//     const fuelSurcharge = canManageCharges
//       ? positiveNumber(body.fuelSurcharge ?? 0, "fuelSurcharge")
//       : 0;
//     const handlingCharges = canManageCharges
//       ? positiveNumber(body.handlingCharges ?? 0, "handlingCharges")
//       : 0;
//     const pickupCharges = canManageCharges
//       ? positiveNumber(body.pickupCharges ?? 0, "pickupCharges")
//       : 0;
//     const deliveryCharges = canManageCharges
//       ? positiveNumber(body.deliveryCharges ?? 0, "deliveryCharges")
//       : 0;
//     const otherCharges = canManageCharges
//       ? positiveNumber(body.otherCharges ?? 0, "otherCharges")
//       : 0;
//     const discount = canManageCharges
//       ? positiveNumber(body.discount ?? 0, "discount")
//       : 0;

//     const taxableAmount = Math.max(
//       0,
//       freight +
//         fuelSurcharge +
//         handlingCharges +
//         pickupCharges +
//         deliveryCharges +
//         otherCharges -
//         discount,
//     );

//     const gstRate = body.gstRate ?? 18;
//     const totalTax = taxableAmount * (gstRate / 100);
//     const total = taxableAmount + totalTax;

//     const itemsInput = Array.isArray(body.items) ? body.items : [];
//     const items = itemsInput.map((it, index) => {
//       const quantity = Number(it.quantity) || 1;
//       const rate = Number(it.rate) || 0;
//       const amount =
//         Number(it.amount) || Number((quantity * rate).toFixed(2));

//       return {
//         id: `item_${index + 1}`,
//         boxNo: boxKey(it.boxNo),
//         description: str(it.description, `Item ${index + 1}`),
//         shopName: canEditProformaRestricted
//           ? str(it.shopName) || null
//           : str(it.shopName) || null,
//         shopAddress: canEditProformaRestricted
//           ? str(it.shopAddress) || null
//           : str(it.shopAddress) || null,
//         hsCode: canEditProformaRestricted
//           ? str(it.hsCode) || null
//           : str(it.hsCode) || null,
//         quantity,
//         rate,
//         unitRate: rate,
//         amount,
//       };
//     });

//     const boxesPresent = Array.from(
//       new Set(items.map((i) => i.boxNo)),
//     ) as Array<"BOX_1" | "BOX_2">;

//     const parentAwb = await generateBusinessId("LOGISTICS");
//     const now = new Date().toISOString();
//     const trackingStageId = "BOOKED";

//     const shipper = body.shipper || {};
//     const consignee = body.consignee || {};

//     const baseShipment = {
//       customerId,
//       customerName: str(body.customerName),
//       customerCode: str(body.customerCode),
//       accountCode: str(body.accountCode),
//       senderId,
//       receiverId,
//       origin,
//       destination,
//       serviceId,
//       serviceType: body.serviceType ?? null,
//       product: str(body.product),
//       vendor: str(body.vendor),
//       service: str(body.service, serviceId),
//       shipmentDate,
//       description: body.description?.trim() ?? null,
//       shipper,
//       consignee,
//       pieces,
//       items,
//       boxes: boxesPresent,
//       volumetricDivisor: regionDivisor,
//       actualWeightKg,
//       volumetricWeightKg,
//       chargeableWeightKg,
//       actualWeight: actualWeightKg,
//       volumetricWeight: volumetricWeightKg,
//       chargeableWeight: chargeableWeightKg,
//       totalPieces: pieces.reduce((n, p) => n + p.quantity, 0),
//       packageType: str(body.packageType, "PKT"),
//       weightUnit: "KG" as const,
//       shipmentValue: Number(body.shipmentValue) || 0,
//       currency: str(body.currency, "INR"),
//       paymentType: str(body.paymentType, "Credit"),
//       referenceNo: str(body.referenceNo),
//       commercial: Boolean(body.commercial),
//       oda: Boolean(body.oda),
//       medicalCharges: Boolean(body.medicalCharges),
//       csbType: str(body.csbType, "CSB4"),
//       termOfInvoice: str(body.termOfInvoice, "CIF"),
//       exportReason: str(body.exportReason),
//       invoiceNo: str(body.invoiceNo),
//       invoiceDate: str(body.invoiceDate),
//       gstDetails: {
//         gstin: gstin ?? null,
//         taxableAmount,
//         cgst: totalTax / 2,
//         sgst: totalTax / 2,
//         igst: 0,
//         totalTax,
//       },
//       charges: {
//         freight,
//         fuelSurcharge,
//         handlingCharges,
//         pickupCharges,
//         deliveryCharges,
//         otherCharges,
//         discount,
//         taxableAmount,
//         gst: totalTax,
//         total,
//         currency: "INR" as const,
//       },
//       currentStatus: "BOOKED" as TrackingStatus,
//       latestLocation: origin,
//       createdBy: user.userId,
//       updatedBy: user.userId,
//       createdAt: now,
//       updatedAt: now,
//     };

//     const batch = adminDb.batch();
//     const createdAwbs: string[] = [];

//     const parentRef = adminDb.collection("awbs").doc(parentAwb);
//     batch.set(parentRef, {
//       ...baseShipment,
//       awb: parentAwb,
//       awbDocumentId: parentRef.id,
//       parentAwb: null,
//       isParent: boxesPresent.length > 1,
//     });
//     createdAwbs.push(parentAwb);

//     const parentTrackRef = adminDb.collection("trackingEvents").doc();
//     batch.set(parentTrackRef, {
//       trackingEventId: parentTrackRef.id,
//       awb: parentAwb,
//       trackingStageId,
//       status: "BOOKED" as TrackingStatus,
//       location: origin,
//       remarks: "Shipment booked.",
//       eventTime: now,
//       createdBy: user.userId,
//       createdAt: FieldValue.serverTimestamp(),
//     });

//     const childAwbs: Array<{ boxNo: string; awb: string }> = [];

//     if (boxesPresent.length > 1) {
//       for (const box of boxesPresent) {
//         const childAwb = await generateBusinessId("LOGISTICS");
//         const childItems = items.filter((i) => i.boxNo === box);
//         const childRef = adminDb.collection("awbs").doc(childAwb);

//         batch.set(childRef, {
//           ...baseShipment,
//           awb: childAwb,
//           awbDocumentId: childRef.id,
//           parentAwb,
//           boxNo: box,
//           isParent: false,
//           items: childItems,
//           referenceNo: str(body.referenceNo) || parentAwb,
//         });

//         createdAwbs.push(childAwb);
//         childAwbs.push({ boxNo: box, awb: childAwb });

//         const trackRef = adminDb.collection("trackingEvents").doc();
//         batch.set(trackRef, {
//           trackingEventId: trackRef.id,
//           awb: childAwb,
//           trackingStageId,
//           status: "BOOKED" as TrackingStatus,
//           location: origin,
//           remarks: `Shipment booked (${box}).`,
//           eventTime: now,
//           createdBy: user.userId,
//           createdAt: FieldValue.serverTimestamp(),
//         });
//       }

//       batch.update(parentRef, { childAwbs });
//     }

//     await batch.commit();

//     await writeAuditLog({
//       userId: user.userId,
//       action: "AWB_CREATED",
//       resourceType: "AWB",
//       resourceId: parentAwb,
//       metadata: {
//         customerId,
//         origin,
//         destination,
//         volumetricDivisor: regionDivisor,
//         boxes: boxesPresent,
//         childAwbs,
//         chargesManagedBySuperAdmin: canManageCharges,
//         createdByRole: user.role,
//       },
//     });

//     return successResponse(
//       {
//         awb: parentAwb,
//         childAwbs,
//         status: "BOOKED",
//         trackingEventId: parentTrackRef.id,
//         shipment: {
//           ...baseShipment,
//           awb: parentAwb,
//           childAwbs,
//         },
//       },
//       201,
//       boxesPresent.length > 1
//         ? `AWB created with separate box AWBs (${boxesPresent.join(", ")}).`
//         : "AWB created successfully.",
//     );
//   } catch (error) {
//     console.error("POST /api/logistics/awb/create:", error);

//     if (
//       error instanceof Error &&
//       /is required|must be a valid|cannot be negative/i.test(error.message)
//     ) {
//       return errorResponse("VALIDATION_ERROR", error.message, 400);
//     }

//     return errorResponse(
//       "AWB_CREATE_FAILED",
//       error instanceof Error ? error.message : "Unable to create AWB.",
//       500,
//     );
//   }
// }

// import { NextRequest } from "next/server";
// import { FieldValue } from "firebase-admin/firestore";
// import type { QueryDocumentSnapshot } from "firebase-admin/firestore";
// import { adminDb } from "@/lib/firebase-admin";
// import { getCurrentUser } from "@/lib/auth";
// import { can } from "@/lib/permissions";
// import { writeAuditLog } from "@/lib/audit";
// import { successResponse, errorResponse } from "@/lib/api-response";
// import { generateBusinessId } from "@/lib/business-id";
// import {
//   calculateChargeableWeight,
//   calculateVolumetricWeight,
// } from "@/utils/calculations";
// import {
//   isValidGSTIN,
//   positiveNumber,
//   positiveInteger,
// } from "@/utils/validators";
// import { FIRESTORE_COLLECTIONS } from "@/utils/constants";

// import type { ShipmentPiece } from "@/types/logistics";
// import type { TrackingStatus } from "@/types/tracking";

// function getVolumetricDivisor(
//   destination?: string,
//   country?: string,
// ): number {
//   const text = `${destination || ""} ${country || ""}`.toUpperCase();

//   if (
//     text.includes("AUSTRALIA") ||
//     text.includes("AUSTRALIAN") ||
//     /\bAUS\b/.test(text) ||
//     /\bAU\b/.test(text) ||
//     text.includes("SYDNEY") ||
//     text.includes("MELBOURNE") ||
//     text.includes("BRISBANE") ||
//     text.includes("PERTH") ||
//     text.includes("ADELAIDE")
//   ) {
//     return 4000;
//   }

//   if (
//     text.includes("USA") ||
//     text.includes("U.S.A") ||
//     text.includes("U.S.") ||
//     text.includes("UNITED STATES") ||
//     text.includes("AMERICA") ||
//     /\bUS\b/.test(text)
//   ) {
//     return 5000;
//   }

//   return 5000;
// }

// function str(v: unknown, fallback = ""): string {
//   if (v == null) return fallback;
//   return String(v).trim() || fallback;
// }

// function digitsPhone(v: unknown): string {
//   return str(v).replace(/\D/g, "");
// }

// function boxKey(raw: unknown): "BOX_1" | "BOX_2" {
//   const s = String(raw || "BOX_1").toUpperCase();
//   if (s.includes("2") || s === "BOX_2") return "BOX_2";
//   return "BOX_1";
// }

// function partyAddress(party: Record<string, unknown>): string {
//   return (
//     str(party.addressLine1) ||
//     str(party.address) ||
//     [str(party.addressLine1), str(party.addressLine2)].filter(Boolean).join(", ")
//   );
// }

// /**
//  * Upsert Masters → Senders from shipper block.
//  * Match existing by phone digits; else create.
//  */
// async function upsertSenderFromShipper(
//   shipper: Record<string, unknown>,
//   userId: string,
// ): Promise<{ senderId: string; created: boolean }> {
//   const name = str(shipper.name) || str(shipper.companyName);
//   const phone = str(shipper.phone);
//   const phoneDigits = digitsPhone(phone);

//   if (!name) {
//     return { senderId: "WALKIN_SENDER", created: false };
//   }

//   const col = adminDb.collection(FIRESTORE_COLLECTIONS.SENDERS || "senders");
//   const now = new Date().toISOString();

//   let match: QueryDocumentSnapshot | undefined;

//   if (phoneDigits.length >= 8) {
//     const snap = await col.where("phone", "==", phone).limit(5).get();
//     match = snap.empty ? undefined : snap.docs[0];

//     if (!match) {
//       const all = await col.limit(500).get();
//       const last10 = phoneDigits.slice(-10);

//       match = all.docs.find((d) => {
//         const p = digitsPhone(d.data()?.phone);
//         if (!p) return false;
//         return (
//           p === phoneDigits ||
//           (last10.length >= 8 && p.endsWith(last10))
//         );
//       });
//     }
//   }

//   if (match) {
//     await match.ref.set(
//       {
//         name,
//         companyName: str(shipper.companyName) || null,
//         phone: phone || str(match.data().phone),
//         email: str(shipper.email) || null,
//         address: partyAddress(shipper) || null,
//         addressLine1: partyAddress(shipper) || null,
//         city: str(shipper.city) || null,
//         state: str(shipper.state) || null,
//         postalCode: str(shipper.pincode || shipper.postalCode) || null,
//         gstin: str(shipper.gstin).toUpperCase() || null,
//         country: str(shipper.country, "India") || null,
//         updatedAt: now,
//         updatedBy: userId,
//         status: "ACTIVE",
//       },
//       { merge: true },
//     );
//     return { senderId: match.id, created: false };
//   }

//   const ref = col.doc();
//   await ref.set({
//     id: ref.id,
//     senderId: ref.id,
//     name,
//     companyName: str(shipper.companyName) || null,
//     phone: phone || "0000000000",
//     email: str(shipper.email) || null,
//     address: partyAddress(shipper) || null,
//     addressLine1: partyAddress(shipper) || null,
//     city: str(shipper.city) || null,
//     state: str(shipper.state) || null,
//     postalCode: str(shipper.pincode || shipper.postalCode) || null,
//     gstin: str(shipper.gstin).toUpperCase() || null,
//     country: str(shipper.country, "India") || null,
//     status: "ACTIVE",
//     source: "AWB_BOOKING",
//     createdAt: now,
//     updatedAt: now,
//     createdBy: userId,
//   });

//   return { senderId: ref.id, created: true };
// }

// /**
//  * Upsert Masters → Receivers from consignee block.
//  * International phones allowed (not forced to Indian format).
//  */

// async function upsertReceiverFromConsignee(
//   consignee: Record<string, unknown>,
//   userId: string,
// ): Promise<{ receiverId: string; created: boolean }> {
//   const name = str(consignee.name) || str(consignee.companyName);
//   const phone = str(consignee.phone);
//   const phoneDigits = digitsPhone(phone);

//   if (!name) {
//     return { receiverId: "WALKIN_RECEIVER", created: false };
//   }

//   const col = adminDb.collection(
//     FIRESTORE_COLLECTIONS.RECEIVERS || "receivers",
//   );
//   const now = new Date().toISOString();

//   let match: QueryDocumentSnapshot | undefined;

//   if (phoneDigits.length >= 8) {
//     const snap = await col.where("phone", "==", phone).limit(5).get();
//     match = snap.empty ? undefined : snap.docs[0];

//     if (!match) {
//       const all = await col.limit(500).get();
//       const last10 = phoneDigits.slice(-10);

//       match = all.docs.find((d) => {
//         const p = digitsPhone(d.data()?.phone);
//         if (!p) return false;
//         return (
//           p === phoneDigits ||
//           (last10.length >= 8 && p.endsWith(last10))
//         );
//       });
//     }
//   }

//   if (match) {
//     await match.ref.set(
//       {
//         name,
//         companyName: str(consignee.companyName) || null,
//         phone: phone || str(match.data().phone),
//         email: str(consignee.email) || null,
//         address: partyAddress(consignee) || null,
//         addressLine1: partyAddress(consignee) || null,
//         city: str(consignee.city) || null,
//         state: str(consignee.state) || null,
//         postalCode: str(consignee.pincode || consignee.postalCode) || null,
//         gstin: str(consignee.gstin).toUpperCase() || null,
//         country: str(consignee.country) || null,
//         updatedAt: now,
//         updatedBy: userId,
//         status: "ACTIVE",
//       },
//       { merge: true },
//     );
//     return { receiverId: match.id, created: false };
//   }

//   const ref = col.doc();
//   await ref.set({
//     id: ref.id,
//     receiverId: ref.id,
//     name,
//     companyName: str(consignee.companyName) || null,
//     phone: phone || "0000000000",
//     email: str(consignee.email) || null,
//     address: partyAddress(consignee) || null,
//     addressLine1: partyAddress(consignee) || null,
//     city: str(consignee.city) || null,
//     state: str(consignee.state) || null,
//     postalCode: str(consignee.pincode || consignee.postalCode) || null,
//     gstin: str(consignee.gstin).toUpperCase() || null,
//     country: str(consignee.country) || null,
//     status: "ACTIVE",
//     source: "AWB_BOOKING",
//     createdAt: now,
//     updatedAt: now,
//     createdBy: userId,
//   });

//   return { receiverId: ref.id, created: true };
// }

// type InvoiceItemBody = {
//   description?: string;
//   quantity?: number;
//   rate?: number;
//   amount?: number;
//   hsCode?: string;
//   shopName?: string;
//   shopAddress?: string;
//   boxNo?: string | number;
// };

// type CreateAWBBody = {
//   customerId?: string;
//   senderId?: string;
//   receiverId?: string;
//   customerName?: string;
//   customerCode?: string;
//   accountCode?: string;
//   origin?: string;
//   destination?: string;
//   serviceId?: string;
//   serviceType?: string;
//   service?: string;
//   product?: string;
//   vendor?: string;
//   shipmentDate?: string;
//   description?: string;
//   shipper?: Record<string, unknown>;
//   consignee?: Record<string, unknown>;
//   pieces?: Array<{
//     quantity?: number;
//     actualWeightKg?: number;
//     lengthCm?: number;
//     widthCm?: number;
//     heightCm?: number;
//     description?: string;
//     division?: number;
//   }>;
//   items?: InvoiceItemBody[];
//   gstin?: string;
//   csbType?: string;
//   termOfInvoice?: string;
//   exportReason?: string;
//   invoiceNo?: string;
//   invoiceDate?: string;
//   freight?: number;
//   fuelSurcharge?: number;
//   handlingCharges?: number;
//   pickupCharges?: number;
//   deliveryCharges?: number;
//   otherCharges?: number;
//   discount?: number;
//   gstRate?: number;
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

//     if (!can(user, "LOGISTICS_AWB_CREATE")) {
//       return errorResponse(
//         "FORBIDDEN",
//         "You do not have permission to create an AWB.",
//         403,
//       );
//     }

//     const canManageCharges = user.role === "SUPER_ADMIN";
//     const canEditProformaRestricted = user.role === "SUPER_ADMIN";

//     let body: CreateAWBBody;

//     try {
//       body = await request.json();
//     } catch {
//       return errorResponse("INVALID_JSON", "Invalid JSON request body.", 400);
//     }

//     const shipper = body.shipper || {};
//     const consignee = body.consignee || {};

//     // Masters: Senders + Receivers from booking parties
//     const [senderResult, receiverResult] = await Promise.all([
//       upsertSenderFromShipper(shipper, user.userId),
//       upsertReceiverFromConsignee(consignee, user.userId),
//     ]);

//     const senderId =
//       typeof body.senderId === "string" &&
//       body.senderId.trim() &&
//       body.senderId.trim() !== "WALKIN_SENDER"
//         ? body.senderId.trim()
//         : senderResult.senderId;

//     const receiverId =
//       typeof body.receiverId === "string" &&
//       body.receiverId.trim() &&
//       body.receiverId.trim() !== "WALKIN_RECEIVER"
//         ? body.receiverId.trim()
//         : receiverResult.receiverId;

//     const customerId =
//       typeof body.customerId === "string" && body.customerId.trim()
//         ? body.customerId.trim()
//         : "WALKIN";

//     const origin =
//       typeof body.origin === "string" && body.origin.trim()
//         ? body.origin.trim()
//         : str(shipper.city, "ORIGIN");

//     const destination =
//       typeof body.destination === "string" && body.destination.trim()
//         ? body.destination.trim()
//         : str(consignee.country) || str(consignee.city, "DEST");

//     const consigneeCountry = str(consignee.country);
//     const regionDivisor = getVolumetricDivisor(destination, consigneeCountry);

//     const serviceId =
//       typeof body.serviceId === "string" && body.serviceId.trim()
//         ? body.serviceId.trim()
//         : typeof body.service === "string" && body.service.trim()
//           ? body.service.trim()
//           : typeof body.product === "string" && body.product.trim()
//             ? body.product.trim()
//             : "SELF";

//     const shipmentDate =
//       typeof body.shipmentDate === "string" && body.shipmentDate.trim()
//         ? body.shipmentDate.trim()
//         : new Date().toISOString().slice(0, 10);

//     const piecesInput = body.pieces ?? [];

//     if (piecesInput.length === 0) {
//       return errorResponse(
//         "PIECES_REQUIRED",
//         "At least one shipment piece is required.",
//         400,
//       );
//     }

//     const pieces: ShipmentPiece[] = piecesInput.map((piece, index) => {
//       const quantity = positiveInteger(
//         piece.quantity ?? 1,
//         `pieces[${index}].quantity`,
//       );

//       const actualWeight = positiveNumber(
//         piece.actualWeightKg ?? 0,
//         `pieces[${index}].actualWeightKg`,
//       );

//       const lengthCm = positiveNumber(
//         piece.lengthCm ?? 0,
//         `pieces[${index}].lengthCm`,
//       );

//       const widthCm = positiveNumber(
//         piece.widthCm ?? 0,
//         `pieces[${index}].widthCm`,
//       );

//       const heightCm = positiveNumber(
//         piece.heightCm ?? 0,
//         `pieces[${index}].heightCm`,
//       );

//       const division =
//         Number(piece.division) > 0 ? Number(piece.division) : regionDivisor;

//       const volumetricWeight =
//         calculateVolumetricWeight(lengthCm, widthCm, heightCm, division) *
//         quantity;

//       const chargeableWeight = calculateChargeableWeight(
//         actualWeight * quantity,
//         volumetricWeight,
//       );

//       return {
//         pieceId: `piece_${index + 1}`,
//         quantity,
//         actualWeight,
//         volumetricWeight,
//         chargeableWeight,
//         weightUnit: "KG" as const,
//         dimensions: {
//           length: lengthCm,
//           width: widthCm,
//           height: heightCm,
//           unit: "CM" as const,
//           boxCount: quantity,
//         },
//         description: piece.description?.trim(),
//         division,
//       };
//     });

//     const actualWeightKg = pieces.reduce(
//       (total, piece) => total + piece.actualWeight * piece.quantity,
//       0,
//     );

//     const volumetricWeightKg = pieces.reduce(
//       (total, piece) => total + (piece.volumetricWeight ?? 0),
//       0,
//     );

//     const chargeableWeightKg = calculateChargeableWeight(
//       actualWeightKg,
//       volumetricWeightKg,
//     );

//     const gstin =
//       body.gstin?.trim() || str(shipper.gstin) || undefined;

//     if (gstin && !isValidGSTIN(gstin)) {
//       return errorResponse("INVALID_GSTIN", "GSTIN is invalid.", 400);
//     }

//     const freight = canManageCharges
//       ? positiveNumber(body.freight ?? 0, "freight")
//       : 0;
//     const fuelSurcharge = canManageCharges
//       ? positiveNumber(body.fuelSurcharge ?? 0, "fuelSurcharge")
//       : 0;
//     const handlingCharges = canManageCharges
//       ? positiveNumber(body.handlingCharges ?? 0, "handlingCharges")
//       : 0;
//     const pickupCharges = canManageCharges
//       ? positiveNumber(body.pickupCharges ?? 0, "pickupCharges")
//       : 0;
//     const deliveryCharges = canManageCharges
//       ? positiveNumber(body.deliveryCharges ?? 0, "deliveryCharges")
//       : 0;
//     const otherCharges = canManageCharges
//       ? positiveNumber(body.otherCharges ?? 0, "otherCharges")
//       : 0;
//     const discount = canManageCharges
//       ? positiveNumber(body.discount ?? 0, "discount")
//       : 0;

//     const taxableAmount = Math.max(
//       0,
//       freight +
//         fuelSurcharge +
//         handlingCharges +
//         pickupCharges +
//         deliveryCharges +
//         otherCharges -
//         discount,
//     );

//     const gstRate = body.gstRate ?? 18;
//     const totalTax = taxableAmount * (gstRate / 100);
//     const total = taxableAmount + totalTax;

//     const itemsInput = Array.isArray(body.items) ? body.items : [];
//     const items = itemsInput.map((it, index) => {
//       const quantity = Number(it.quantity) || 1;
//       const rate = Number(it.rate) || 0;
//       const amount =
//         Number(it.amount) || Number((quantity * rate).toFixed(2));

//       return {
//         id: `item_${index + 1}`,
//         boxNo: boxKey(it.boxNo),
//         description: str(it.description, `Item ${index + 1}`),
//         shopName: str(it.shopName) || null,
//         shopAddress: str(it.shopAddress) || null,
//         hsCode: str(it.hsCode) || null,
//         quantity,
//         rate,
//         unitRate: rate,
//         amount,
//       };
//     });

//     const boxesPresent = Array.from(
//       new Set(items.map((i) => i.boxNo)),
//     ) as Array<"BOX_1" | "BOX_2">;

//     const parentAwb = await generateBusinessId("LOGISTICS");
//     const now = new Date().toISOString();
//     const trackingStageId = "BOOKED";

//     const baseShipment = {
//       customerId,
//       customerName: str(body.customerName),
//       customerCode: str(body.customerCode),
//       accountCode: str(body.accountCode),
//       senderId,
//       receiverId,
//       origin,
//       destination,
//       serviceId,
//       serviceType: body.serviceType ?? null,
//       product: str(body.product),
//       vendor: str(body.vendor),
//       service: str(body.service, serviceId),
//       shipmentDate,
//       description: body.description?.trim() ?? null,
//       shipper,
//       consignee,
//       pieces,
//       items,
//       boxes: boxesPresent,
//       volumetricDivisor: regionDivisor,
//       actualWeightKg,
//       volumetricWeightKg,
//       chargeableWeightKg,
//       actualWeight: actualWeightKg,
//       volumetricWeight: volumetricWeightKg,
//       chargeableWeight: chargeableWeightKg,
//       totalPieces: pieces.reduce((n, p) => n + p.quantity, 0),
//       packageType: str(body.packageType, "PKT"),
//       weightUnit: "KG" as const,
//       shipmentValue: Number(body.shipmentValue) || 0,
//       currency: str(body.currency, "INR"),
//       paymentType: str(body.paymentType, "Credit"),
//       referenceNo: str(body.referenceNo),
//       commercial: Boolean(body.commercial),
//       oda: Boolean(body.oda),
//       medicalCharges: Boolean(body.medicalCharges),
//       csbType: str(body.csbType, "CSB4"),
//       termOfInvoice: str(body.termOfInvoice, "CIF"),
//       exportReason: str(body.exportReason),
//       invoiceNo: str(body.invoiceNo),
//       invoiceDate: str(body.invoiceDate),
//       gstDetails: {
//         gstin: gstin ?? null,
//         taxableAmount,
//         cgst: totalTax / 2,
//         sgst: totalTax / 2,
//         igst: 0,
//         totalTax,
//       },
//       charges: {
//         freight,
//         fuelSurcharge,
//         handlingCharges,
//         pickupCharges,
//         deliveryCharges,
//         otherCharges,
//         discount,
//         taxableAmount,
//         gst: totalTax,
//         total,
//         currency: "INR" as const,
//       },
//       currentStatus: "BOOKED" as TrackingStatus,
//       latestLocation: origin,
//       createdBy: user.userId,
//       updatedBy: user.userId,
//       createdAt: now,
//       updatedAt: now,
//     };

//     const batch = adminDb.batch();
//     const createdAwbs: string[] = [];

//     const parentRef = adminDb.collection("awbs").doc(parentAwb);
//     batch.set(parentRef, {
//       ...baseShipment,
//       awb: parentAwb,
//       awbDocumentId: parentRef.id,
//       parentAwb: null,
//       isParent: boxesPresent.length > 1,
//     });
//     createdAwbs.push(parentAwb);

//     const parentTrackRef = adminDb.collection("trackingEvents").doc();
//     batch.set(parentTrackRef, {
//       trackingEventId: parentTrackRef.id,
//       awb: parentAwb,
//       trackingStageId,
//       status: "BOOKED" as TrackingStatus,
//       location: origin,
//       remarks: "Shipment booked.",
//       eventTime: now,
//       createdBy: user.userId,
//       createdAt: FieldValue.serverTimestamp(),
//     });

//     const childAwbs: Array<{ boxNo: string; awb: string }> = [];

//     if (boxesPresent.length > 1) {
//       for (const box of boxesPresent) {
//         const childAwb = await generateBusinessId("LOGISTICS");
//         const childItems = items.filter((i) => i.boxNo === box);
//         const childRef = adminDb.collection("awbs").doc(childAwb);

//         batch.set(childRef, {
//           ...baseShipment,
//           awb: childAwb,
//           awbDocumentId: childRef.id,
//           parentAwb,
//           boxNo: box,
//           isParent: false,
//           items: childItems,
//           referenceNo: str(body.referenceNo) || parentAwb,
//         });

//         createdAwbs.push(childAwb);
//         childAwbs.push({ boxNo: box, awb: childAwb });

//         const trackRef = adminDb.collection("trackingEvents").doc();
//         batch.set(trackRef, {
//           trackingEventId: trackRef.id,
//           awb: childAwb,
//           trackingStageId,
//           status: "BOOKED" as TrackingStatus,
//           location: origin,
//           remarks: `Shipment booked (${box}).`,
//           eventTime: now,
//           createdBy: user.userId,
//           createdAt: FieldValue.serverTimestamp(),
//         });
//       }

//       batch.update(parentRef, { childAwbs });
//     }

//     await batch.commit();

//     await writeAuditLog({
//       userId: user.userId,
//       action: "AWB_CREATED",
//       resourceType: "AWB",
//       resourceId: parentAwb,
//       module: "LOGISTICS",
//       metadata: {
//         customerId,
//         senderId,
//         receiverId,
//         senderCreated: senderResult.created,
//         receiverCreated: receiverResult.created,
//         origin,
//         destination,
//         volumetricDivisor: regionDivisor,
//         boxes: boxesPresent,
//         childAwbs,
//         chargesManagedBySuperAdmin: canManageCharges,
//         createdByRole: user.role,
//       },
//     });

//     return successResponse(
//       {
//         awb: parentAwb,
//         childAwbs,
//         senderId,
//         receiverId,
//         status: "BOOKED",
//         trackingEventId: parentTrackRef.id,
//         shipment: {
//           ...baseShipment,
//           awb: parentAwb,
//           childAwbs,
//         },
//       },
//       201,
//       boxesPresent.length > 1
//         ? `AWB created with separate box AWBs (${boxesPresent.join(", ")}).`
//         : "AWB created successfully.",
//     );
//   } catch (error) {
//     console.error("POST /api/logistics/awb/create:", error);

//     if (
//       error instanceof Error &&
//       /is required|must be a valid|cannot be negative/i.test(error.message)
//     ) {
//       return errorResponse("VALIDATION_ERROR", error.message, 400);
//     }

//     return errorResponse(
//       "AWB_CREATE_FAILED",
//       error instanceof Error ? error.message : "Unable to create AWB.",
//       500,
//     );
//   }
// }

// import { NextRequest } from "next/server";
// import { FieldValue } from "firebase-admin/firestore";
// import type { QueryDocumentSnapshot } from "firebase-admin/firestore";
// import { adminDb } from "@/lib/firebase-admin";
// import { getCurrentUser } from "@/lib/auth";
// import { can } from "@/lib/permissions";
// import { writeAuditLog } from "@/lib/audit";
// import { successResponse, errorResponse } from "@/lib/api-response";
// import { generateBusinessId } from "@/lib/business-id";
// import {
//   calculateChargeableWeight,
//   calculateVolumetricWeight,
// } from "@/utils/calculations";
// import {
//   isValidGSTIN,
//   positiveNumber,
//   positiveInteger,
// } from "@/utils/validators";
// import { FIRESTORE_COLLECTIONS } from "@/utils/constants";

// import type { ShipmentPiece } from "@/types/logistics";
// import type { TrackingStatus } from "@/types/tracking";

// function getVolumetricDivisor(
//   destination?: string,
//   country?: string,
// ): number {
//   const text = `${destination || ""} ${country || ""}`.toUpperCase();

//   if (
//     text.includes("AUSTRALIA") ||
//     text.includes("AUSTRALIAN") ||
//     /\bAUS\b/.test(text) ||
//     /\bAU\b/.test(text) ||
//     text.includes("SYDNEY") ||
//     text.includes("MELBOURNE") ||
//     text.includes("BRISBANE") ||
//     text.includes("PERTH") ||
//     text.includes("ADELAIDE")
//   ) {
//     return 4000;
//   }

//   if (
//     text.includes("USA") ||
//     text.includes("U.S.A") ||
//     text.includes("U.S.") ||
//     text.includes("UNITED STATES") ||
//     text.includes("AMERICA") ||
//     /\bUS\b/.test(text)
//   ) {
//     return 5000;
//   }

//   return 5000;
// }

// function str(v: unknown, fallback = ""): string {
//   if (v == null) return fallback;
//   return String(v).trim() || fallback;
// }

// function digitsPhone(v: unknown): string {
//   return str(v).replace(/\D/g, "");
// }

// function boxKey(raw: unknown): "BOX_1" | "BOX_2" {
//   const s = String(raw || "BOX_1").toUpperCase();
//   if (s.includes("2") || s === "BOX_2") return "BOX_2";
//   return "BOX_1";
// }

// function partyAddress(party: Record<string, unknown>): string {
//   return (
//     str(party.addressLine1) ||
//     str(party.address) ||
//     [str(party.addressLine1), str(party.addressLine2)].filter(Boolean).join(", ")
//   );
// }

// async function upsertSenderFromShipper(
//   shipper: Record<string, unknown>,
//   userId: string,
// ): Promise<{ senderId: string; created: boolean }> {
//   const name =
//   str(shipper.contactName) ||
//   str(shipper.name) ||
//   str(shipper.company) ||
//   str(shipper.companyName);

// // when writing:
//   companyName: str(shipper.company) || str(shipper.companyName) || null;
//   const phone = str(shipper.phone);
//   const phoneDigits = digitsPhone(phone);

//   if (!name) {
//     return { senderId: "WALKIN_SENDER", created: false };
//   }

//   const col = adminDb.collection(FIRESTORE_COLLECTIONS.SENDERS || "senders");
//   const now = new Date().toISOString();

//   let match: QueryDocumentSnapshot | undefined;

//   if (phoneDigits.length >= 8) {
//     const snap = await col.where("phone", "==", phone).limit(5).get();
//     match = snap.empty ? undefined : snap.docs[0];

//     if (!match) {
//       const all = await col.limit(500).get();
//       const last10 = phoneDigits.slice(-10);

//       match = all.docs.find((d) => {
//         const p = digitsPhone(d.data()?.phone);
//         if (!p) return false;
//         return (
//           p === phoneDigits ||
//           (last10.length >= 8 && p.endsWith(last10))
//         );
//       });
//     }
//   }

//   if (match) {
//     await match.ref.set(
//       {
//         name,
//         companyName: str(shipper.companyName) || null,
//         phone: phone || str(match.data().phone),
//         email: str(shipper.email) || null,
//         address: partyAddress(shipper) || null,
//         addressLine1: partyAddress(shipper) || null,
//         city: str(shipper.city) || null,
//         state: str(shipper.state) || null,
//         postalCode: str(shipper.pincode || shipper.postalCode) || null,
//         gstin: str(shipper.gstin).toUpperCase() || null,
//         country: str(shipper.country, "India") || null,
//         updatedAt: now,
//         updatedBy: userId,
//         status: "ACTIVE",
//       },
//       { merge: true },
//     );
//     return { senderId: match.id, created: false };
//   }

//   const ref = col.doc();
//   await ref.set({
//     id: ref.id,
//     senderId: ref.id,
//     name,
//     companyName: str(shipper.companyName) || null,
//     phone: phone || "0000000000",
//     email: str(shipper.email) || null,
//     address: partyAddress(shipper) || null,
//     addressLine1: partyAddress(shipper) || null,
//     city: str(shipper.city) || null,
//     state: str(shipper.state) || null,
//     postalCode: str(shipper.pincode || shipper.postalCode) || null,
//     gstin: str(shipper.gstin).toUpperCase() || null,
//     country: str(shipper.country, "India") || null,
//     status: "ACTIVE",
//     source: "AWB_BOOKING",
//     createdAt: now,
//     updatedAt: now,
//     createdBy: userId,
//   });

//   return { senderId: ref.id, created: true };
// }

// async function upsertReceiverFromConsignee(
//   consignee: Record<string, unknown>,
//   userId: string,
// ): Promise<{ receiverId: string; created: boolean }> {
//   const name = str(consignee.name) || str(consignee.companyName);
//   const phone = str(consignee.phone);
//   const phoneDigits = digitsPhone(phone);

//   if (!name) {
//     return { receiverId: "WALKIN_RECEIVER", created: false };
//   }

//   const col = adminDb.collection(
//     FIRESTORE_COLLECTIONS.RECEIVERS || "receivers",
//   );
//   const now = new Date().toISOString();

//   let match: QueryDocumentSnapshot | undefined;

//   if (phoneDigits.length >= 8) {
//     const snap = await col.where("phone", "==", phone).limit(5).get();
//     match = snap.empty ? undefined : snap.docs[0];

//     if (!match) {
//       const all = await col.limit(500).get();
//       const last10 = phoneDigits.slice(-10);

//       match = all.docs.find((d) => {
//         const p = digitsPhone(d.data()?.phone);
//         if (!p) return false;
//         return (
//           p === phoneDigits ||
//           (last10.length >= 8 && p.endsWith(last10))
//         );
//       });
//     }
//   }

//   if (match) {
//     await match.ref.set(
//       {
//         name,
//         companyName: str(consignee.companyName) || null,
//         phone: phone || str(match.data().phone),
//         email: str(consignee.email) || null,
//         address: partyAddress(consignee) || null,
//         addressLine1: partyAddress(consignee) || null,
//         city: str(consignee.city) || null,
//         state: str(consignee.state) || null,
//         postalCode: str(consignee.pincode || consignee.postalCode) || null,
//         gstin: str(consignee.gstin).toUpperCase() || null,
//         country: str(consignee.country) || null,
//         updatedAt: now,
//         updatedBy: userId,
//         status: "ACTIVE",
//       },
//       { merge: true },
//     );
//     return { receiverId: match.id, created: false };
//   }

//   const ref = col.doc();
//   await ref.set({
//     id: ref.id,
//     receiverId: ref.id,
//     name,
//     companyName: str(consignee.companyName) || null,
//     phone: phone || "0000000000",
//     email: str(consignee.email) || null,
//     address: partyAddress(consignee) || null,
//     addressLine1: partyAddress(consignee) || null,
//     city: str(consignee.city) || null,
//     state: str(consignee.state) || null,
//     postalCode: str(consignee.pincode || consignee.postalCode) || null,
//     gstin: str(consignee.gstin).toUpperCase() || null,
//     country: str(consignee.country) || null,
//     status: "ACTIVE",
//     source: "AWB_BOOKING",
//     createdAt: now,
//     updatedAt: now,
//     createdBy: userId,
//   });

//   return { receiverId: ref.id, created: true };
// }

// type InvoiceItemBody = {
//   description?: string;
//   quantity?: number;
//   rate?: number;
//   amount?: number;
//   hsCode?: string;
//   shopName?: string;
//   shopAddress?: string;
//   boxNo?: string | number;
// };

// type CreateAWBBody = {
//   customerId?: string;
//   senderId?: string;
//   receiverId?: string;
//   customerName?: string;
//   customerCode?: string;
//   accountCode?: string;
//   origin?: string;
//   destination?: string;
//   serviceId?: string;
//   serviceType?: string;
//   service?: string;
//   product?: string;
//   vendor?: string;
//   shipmentDate?: string;
//   description?: string;
//   shipper?: Record<string, unknown>;
//   consignee?: Record<string, unknown>;
//   pieces?: Array<{
//     quantity?: number;
//     actualWeightKg?: number;
//     lengthCm?: number;
//     widthCm?: number;
//     heightCm?: number;
//     description?: string;
//     division?: number;
//   }>;
//   items?: InvoiceItemBody[];
//   gstin?: string;
//   csbType?: string;
//   termOfInvoice?: string;
//   exportReason?: string;
//   invoiceNo?: string;
//   invoiceDate?: string;
//   freight?: number;
//   fuelSurcharge?: number;
//   handlingCharges?: number;
//   pickupCharges?: number;
//   deliveryCharges?: number;
//   otherCharges?: number;
//   discount?: number;
//   gstRate?: number;
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

//     if (!can(user, "LOGISTICS_AWB_CREATE")) {
//       return errorResponse(
//         "FORBIDDEN",
//         "You do not have permission to create an AWB.",
//         403,
//       );
//     }

//     const isSuperAdmin = user.role === "SUPER_ADMIN";
//     const canManageCharges = isSuperAdmin;
//     const canEditProformaRestricted = isSuperAdmin;

//     let body: CreateAWBBody;

//     try {
//       body = await request.json();
//     } catch {
//       return errorResponse("INVALID_JSON", "Invalid JSON request body.", 400);
//     }

//     const shipper = body.shipper || {};
//     const consignee = body.consignee || {};

//     const [senderResult, receiverResult] = await Promise.all([
//       upsertSenderFromShipper(shipper, user.userId),
//       upsertReceiverFromConsignee(consignee, user.userId),
//     ]);

//     const senderId =
//       typeof body.senderId === "string" &&
//       body.senderId.trim() &&
//       body.senderId.trim() !== "WALKIN_SENDER"
//         ? body.senderId.trim()
//         : senderResult.senderId;

//     const receiverId =
//       typeof body.receiverId === "string" &&
//       body.receiverId.trim() &&
//       body.receiverId.trim() !== "WALKIN_RECEIVER"
//         ? body.receiverId.trim()
//         : receiverResult.receiverId;

//     const customerId =
//       typeof body.customerId === "string" && body.customerId.trim()
//         ? body.customerId.trim()
//         : "WALKIN";

//     const origin =
//       typeof body.origin === "string" && body.origin.trim()
//         ? body.origin.trim()
//         : str(shipper.city, "ORIGIN");

//     const destination =
//       typeof body.destination === "string" && body.destination.trim()
//         ? body.destination.trim()
//         : str(consignee.country) || str(consignee.city, "DEST");

//     const consigneeCountry = str(consignee.country);
//     const regionDivisor = getVolumetricDivisor(destination, consigneeCountry);

//     const serviceId =
//       typeof body.serviceId === "string" && body.serviceId.trim()
//         ? body.serviceId.trim()
//         : typeof body.service === "string" && body.service.trim()
//           ? body.service.trim()
//           : typeof body.product === "string" && body.product.trim()
//             ? body.product.trim()
//             : "SELF";

//     const shipmentDate =
//       typeof body.shipmentDate === "string" && body.shipmentDate.trim()
//         ? body.shipmentDate.trim()
//         : new Date().toISOString().slice(0, 10);

//     const piecesInput = body.pieces ?? [];

//     if (piecesInput.length === 0) {
//       return errorResponse(
//         "PIECES_REQUIRED",
//         "At least one shipment piece is required.",
//         400,
//       );
//     }

//     const pieces: ShipmentPiece[] = piecesInput.map((piece, index) => {
//       const quantity = positiveInteger(
//         piece.quantity ?? 1,
//         `pieces[${index}].quantity`,
//       );

//       const actualWeight = positiveNumber(
//         piece.actualWeightKg ?? 0,
//         `pieces[${index}].actualWeightKg`,
//       );

//       const lengthCm = positiveNumber(
//         piece.lengthCm ?? 0,
//         `pieces[${index}].lengthCm`,
//       );

//       const widthCm = positiveNumber(
//         piece.widthCm ?? 0,
//         `pieces[${index}].widthCm`,
//       );

//       const heightCm = positiveNumber(
//         piece.heightCm ?? 0,
//         `pieces[${index}].heightCm`,
//       );

//       const division =
//         Number(piece.division) > 0 ? Number(piece.division) : regionDivisor;

//       const volumetricWeight =
//         calculateVolumetricWeight(lengthCm, widthCm, heightCm, division) *
//         quantity;

//       const chargeableWeight = calculateChargeableWeight(
//         actualWeight * quantity,
//         volumetricWeight,
//       );

//       return {
//         pieceId: `piece_${index + 1}`,
//         quantity,
//         actualWeight,
//         volumetricWeight,
//         chargeableWeight,
//         weightUnit: "KG" as const,
//         dimensions: {
//           length: lengthCm,
//           width: widthCm,
//           height: heightCm,
//           unit: "CM" as const,
//           boxCount: quantity,
//         },
//         description: piece.description?.trim(),
//         division,
//       };
//     });

//     const actualWeightKg = pieces.reduce(
//       (total, piece) => total + piece.actualWeight * piece.quantity,
//       0,
//     );

//     const volumetricWeightKg = pieces.reduce(
//       (total, piece) => total + (piece.volumetricWeight ?? 0),
//       0,
//     );

//     const chargeableWeightKg = calculateChargeableWeight(
//       actualWeightKg,
//       volumetricWeightKg,
//     );

//     const gstin =
//       body.gstin?.trim() || str(shipper.gstin) || undefined;

//     if (gstin && !isValidGSTIN(gstin)) {
//       return errorResponse("INVALID_GSTIN", "GSTIN is invalid.", 400);
//     }

//     // Co-loader / operator: freight + fuel from form (vendor %).
//     // Super Admin: full charge control.
//     const freight = positiveNumber(body.freight ?? 0, "freight");
//     const fuelSurcharge = positiveNumber(
//       body.fuelSurcharge ?? 0,
//       "fuelSurcharge",
//     );
//     const handlingCharges = isSuperAdmin
//       ? positiveNumber(body.handlingCharges ?? 0, "handlingCharges")
//       : 0;
//     const pickupCharges = isSuperAdmin
//       ? positiveNumber(body.pickupCharges ?? 0, "pickupCharges")
//       : 0;
//     const deliveryCharges = isSuperAdmin
//       ? positiveNumber(body.deliveryCharges ?? 0, "deliveryCharges")
//       : 0;
//     const otherCharges = isSuperAdmin
//       ? positiveNumber(body.otherCharges ?? 0, "otherCharges")
//       : 0;
//     const discount = isSuperAdmin
//       ? positiveNumber(body.discount ?? 0, "discount")
//       : 0;

//     const taxableAmount = Math.max(
//       0,
//       freight +
//         fuelSurcharge +
//         handlingCharges +
//         pickupCharges +
//         deliveryCharges +
//         otherCharges -
//         discount,
//     );

//     const gstRate = body.gstRate ?? 18;
//     const totalTax = taxableAmount * (gstRate / 100);
//     const total = taxableAmount + totalTax;

//     const itemsInput = Array.isArray(body.items) ? body.items : [];
//     const items = itemsInput.map((it, index) => {
//       const quantity = Number(it.quantity) || 1;
//       const rate = Number(it.rate) || 0;
//       const amount =
//         Number(it.amount) || Number((quantity * rate).toFixed(2));

//       return {
//         id: `item_${index + 1}`,
//         boxNo: boxKey(it.boxNo),
//         description: str(it.description, `Item ${index + 1}`),
//         shopName: str(it.shopName) || null,
//         shopAddress: str(it.shopAddress) || null,
//         hsCode: str(it.hsCode) || null,
//         quantity,
//         rate,
//         unitRate: rate,
//         amount,
//       };
//     });

//     const boxesPresent = Array.from(
//       new Set(items.map((i) => i.boxNo)),
//     ) as Array<"BOX_1" | "BOX_2">;

//     const parentAwb = await generateBusinessId("LOGISTICS");
//     const now = new Date().toISOString();
//     const trackingStageId = "BOOKED";

//     const baseShipment = {
//       customerId,
//       customerName: str(body.customerName),
//       customerCode: str(body.customerCode),
//       accountCode: str(body.accountCode),
//       senderId,
//       receiverId,
//       origin,
//       destination,
//       serviceId,
//       serviceType: body.serviceType ?? null,
//       product: str(body.product),
//       vendor: str(body.vendor),
//       service: str(body.service, serviceId),
//       shipmentDate,
//       description: body.description?.trim() ?? null,
//       shipper,
//       consignee,
//       pieces,
//       items,
//       boxes: boxesPresent,
//       volumetricDivisor: regionDivisor,
//       actualWeightKg,
//       volumetricWeightKg,
//       chargeableWeightKg,
//       actualWeight: actualWeightKg,
//       volumetricWeight: volumetricWeightKg,
//       chargeableWeight: chargeableWeightKg,
//       totalPieces: pieces.reduce((n, p) => n + p.quantity, 0),
//       packageType: str(body.packageType, "PKT"),
//       weightUnit: "KG" as const,
//       shipmentValue: Number(body.shipmentValue) || 0,
//       currency: str(body.currency, "INR"),
//       paymentType: str(body.paymentType, "Credit"),
//       referenceNo: str(body.referenceNo),
//       commercial: Boolean(body.commercial),
//       oda: Boolean(body.oda),
//       medicalCharges: Boolean(body.medicalCharges),
//       csbType: str(body.csbType, "CSB4"),
//       termOfInvoice: str(body.termOfInvoice, "CIF"),
//       exportReason: str(body.exportReason),
//       invoiceNo: str(body.invoiceNo),
//       invoiceDate: str(body.invoiceDate),
//       gstDetails: {
//         gstin: gstin ?? null,
//         taxableAmount,
//         cgst: totalTax / 2,
//         sgst: totalTax / 2,
//         igst: 0,
//         totalTax,
//       },
//       charges: {
//         freight,
//         fuelSurcharge,
//         handlingCharges,
//         pickupCharges,
//         deliveryCharges,
//         otherCharges,
//         discount,
//         taxableAmount,
//         gst: totalTax,
//         total,
//         currency: "INR" as const,
//       },
//       currentStatus: "BOOKED" as TrackingStatus,
//       latestLocation: origin,
//       createdBy: user.userId,
//       updatedBy: user.userId,
//       createdAt: now,
//       updatedAt: now,
//     };

//     const batch = adminDb.batch();
//     const createdAwbs: string[] = [];

//     const parentRef = adminDb.collection("awbs").doc(parentAwb);
//     batch.set(parentRef, {
//       ...baseShipment,
//       awb: parentAwb,
//       awbDocumentId: parentRef.id,
//       parentAwb: null,
//       isParent: boxesPresent.length > 1,
//     });
//     createdAwbs.push(parentAwb);

//     const parentTrackRef = adminDb.collection("trackingEvents").doc();
//     batch.set(parentTrackRef, {
//       trackingEventId: parentTrackRef.id,
//       awb: parentAwb,
//       trackingStageId,
//       status: "BOOKED" as TrackingStatus,
//       location: origin,
//       remarks: "Shipment booked.",
//       eventTime: now,
//       createdBy: user.userId,
//       createdAt: FieldValue.serverTimestamp(),
//     });

//     const childAwbs: Array<{ boxNo: string; awb: string }> = [];

//     if (boxesPresent.length > 1) {
//       for (const box of boxesPresent) {
//         const childAwb = await generateBusinessId("LOGISTICS");
//         const childItems = items.filter((i) => i.boxNo === box);
//         const childRef = adminDb.collection("awbs").doc(childAwb);

//         batch.set(childRef, {
//           ...baseShipment,
//           awb: childAwb,
//           awbDocumentId: childRef.id,
//           parentAwb,
//           boxNo: box,
//           isParent: false,
//           items: childItems,
//           referenceNo: str(body.referenceNo) || parentAwb,
//         });

//         createdAwbs.push(childAwb);
//         childAwbs.push({ boxNo: box, awb: childAwb });

//         const trackRef = adminDb.collection("trackingEvents").doc();
//         batch.set(trackRef, {
//           trackingEventId: trackRef.id,
//           awb: childAwb,
//           trackingStageId,
//           status: "BOOKED" as TrackingStatus,
//           location: origin,
//           remarks: `Shipment booked (${box}).`,
//           eventTime: now,
//           createdBy: user.userId,
//           createdAt: FieldValue.serverTimestamp(),
//         });
//       }

//       batch.update(parentRef, { childAwbs });
//     }

//     await batch.commit();

//     await writeAuditLog({
//       userId: user.userId,
//       action: "AWB_CREATED",
//       resourceType: "AWB",
//       resourceId: parentAwb,
//       module: "LOGISTICS",
//       metadata: {
//         customerId,
//         senderId,
//         receiverId,
//         senderCreated: senderResult.created,
//         receiverCreated: receiverResult.created,
//         origin,
//         destination,
//         volumetricDivisor: regionDivisor,
//         boxes: boxesPresent,
//         childAwbs,
//         chargesManagedBySuperAdmin: canManageCharges,
//         freightSaved: freight,
//         fuelSurchargeSaved: fuelSurcharge,
//         createdByRole: user.role,
//       },
//     });

//     return successResponse(
//       {
//         awb: parentAwb,
//         childAwbs,
//         senderId,
//         receiverId,
//         status: "BOOKED",
//         trackingEventId: parentTrackRef.id,
//         shipment: {
//           ...baseShipment,
//           awb: parentAwb,
//           childAwbs,
//         },
//       },
//       201,
//       boxesPresent.length > 1
//         ? `AWB created with separate box AWBs (${boxesPresent.join(", ")}).`
//         : "AWB created successfully.",
//     );
//   } catch (error) {
//     console.error("POST /api/logistics/awb/create:", error);

//     if (
//       error instanceof Error &&
//       /is required|must be a valid|cannot be negative/i.test(error.message)
//     ) {
//       return errorResponse("VALIDATION_ERROR", error.message, 400);
//     }

//     return errorResponse(
//       "AWB_CREATE_FAILED",
//       error instanceof Error ? error.message : "Unable to create AWB.",
//       500,
//     );
//   }
// }

// import { NextRequest } from "next/server";
// import { FieldValue } from "firebase-admin/firestore";
// import type { QueryDocumentSnapshot } from "firebase-admin/firestore";
// import { adminDb } from "@/lib/firebase-admin";
// import { getCurrentUser } from "@/lib/auth";
// import { can } from "@/lib/permissions";
// import { writeAuditLog } from "@/lib/audit";
// import { successResponse, errorResponse } from "@/lib/api-response";
// import { generateBusinessId } from "@/lib/business-id";
// import {
//   calculateChargeableWeight,
//   calculateVolumetricWeight,
// } from "@/utils/calculations";
// import {
//   isValidGSTIN,
//   positiveNumber,
//   positiveInteger,
// } from "@/utils/validators";
// import { FIRESTORE_COLLECTIONS } from "@/utils/constants";

// import type { ShipmentPiece } from "@/types/logistics";
// import type { TrackingStatus } from "@/types/tracking";

// function getVolumetricDivisor(
//   destination?: string,
//   country?: string,
// ): number {
//   const text = `${destination || ""} ${country || ""}`.toUpperCase();

//   if (
//     text.includes("AUSTRALIA") ||
//     text.includes("AUSTRALIAN") ||
//     /\bAUS\b/.test(text) ||
//     /\bAU\b/.test(text) ||
//     text.includes("SYDNEY") ||
//     text.includes("MELBOURNE") ||
//     text.includes("BRISBANE") ||
//     text.includes("PERTH") ||
//     text.includes("ADELAIDE")
//   ) {
//     return 4000;
//   }

//   if (
//     text.includes("USA") ||
//     text.includes("U.S.A") ||
//     text.includes("U.S.") ||
//     text.includes("UNITED STATES") ||
//     text.includes("AMERICA") ||
//     /\bUS\b/.test(text)
//   ) {
//     return 5000;
//   }

//   return 5000;
// }

// function str(v: unknown, fallback = ""): string {
//   if (v == null) return fallback;
//   return String(v).trim() || fallback;
// }

// function digitsPhone(v: unknown): string {
//   return str(v).replace(/\D/g, "");
// }

// function boxKey(raw: unknown): "BOX_1" | "BOX_2" {
//   const s = String(raw || "BOX_1").toUpperCase();
//   if (s.includes("2") || s === "BOX_2") return "BOX_2";
//   return "BOX_1";
// }

// function partyAddress(party: Record<string, unknown>): string {
//   return (
//     str(party.addressLine1) ||
//     str(party.address) ||
//     [str(party.addressLine1), str(party.addressLine2)]
//       .filter(Boolean)
//       .join(", ")
//   );
// }

// /** Prefer contactName → name → company (form field) → companyName */
// function partyDisplayName(party: Record<string, unknown>): string {
//   return (
//     str(party.contactName) ||
//     str(party.name) ||
//     str(party.company) ||
//     str(party.companyName)
//   );
// }

// function partyCompany(party: Record<string, unknown>): string {
//   return str(party.company) || str(party.companyName);
// }

// async function upsertSenderFromShipper(
//   shipper: Record<string, unknown>,
//   userId: string,
// ): Promise<{ senderId: string; created: boolean }> {
//   const name = partyDisplayName(shipper);
//   const phone = str(shipper.phone) || str(shipper.mobile);
//   const phoneDigits = digitsPhone(phone);
//   const companyName = partyCompany(shipper) || null;
//   const gstin = str(shipper.gstin).toUpperCase() || null;

//   if (!name && !companyName) {
//     return { senderId: "WALKIN_SENDER", created: false };
//   }

//   const col = adminDb.collection(FIRESTORE_COLLECTIONS.SENDERS || "senders");
//   const now = new Date().toISOString();

//   let match: QueryDocumentSnapshot | undefined;

//   if (phoneDigits.length >= 8) {
//     const snap = await col.where("phone", "==", phone).limit(5).get();
//     match = snap.empty ? undefined : snap.docs[0];

//     if (!match) {
//       const all = await col.limit(500).get();
//       const last10 = phoneDigits.slice(-10);

//       match = all.docs.find((d) => {
//         const p = digitsPhone(d.data()?.phone);
//         if (!p) return false;
//         return (
//           p === phoneDigits ||
//           (last10.length >= 8 && p.endsWith(last10))
//         );
//       });
//     }
//   }

//   const payload = {
//     name: name || companyName || "Shipper",
//     companyName,
//     contactName: str(shipper.contactName) || name || null,
//     phone: phone || "0000000000",
//     mobile: str(shipper.mobile) || null,
//     email: str(shipper.email) || null,
//     address: partyAddress(shipper) || null,
//     addressLine1: str(shipper.addressLine1) || partyAddress(shipper) || null,
//     addressLine2: str(shipper.addressLine2) || null,
//     city: str(shipper.city) || null,
//     state: str(shipper.state) || null,
//     postalCode: str(shipper.pincode || shipper.postalCode) || null,
//     gstin,
//     iecNo: str(shipper.iecNo) || null,
//     documentType: str(shipper.documentType) || null,
//     documentNo: str(shipper.documentNo) || null,
//     country: str(shipper.country, "India") || null,
//     origin: str(shipper.origin) || null,
//     updatedAt: now,
//     updatedBy: userId,
//     status: "ACTIVE" as const,
//   };

//   if (match) {
//     await match.ref.set(payload, { merge: true });
//     return { senderId: match.id, created: false };
//   }

//   const ref = col.doc();
//   await ref.set({
//     id: ref.id,
//     senderId: ref.id,
//     ...payload,
//     source: "AWB_BOOKING",
//     createdAt: now,
//     createdBy: userId,
//   });

//   return { senderId: ref.id, created: true };
// }

// async function upsertReceiverFromConsignee(
//   consignee: Record<string, unknown>,
//   userId: string,
// ): Promise<{ receiverId: string; created: boolean }> {
//   const name = partyDisplayName(consignee);
//   const phone = str(consignee.phone) || str(consignee.mobile);
//   const phoneDigits = digitsPhone(phone);
//   const companyName = partyCompany(consignee) || null;
//   const gstin = str(consignee.gstin).toUpperCase() || null;

//   if (!name && !companyName) {
//     return { receiverId: "WALKIN_RECEIVER", created: false };
//   }

//   const col = adminDb.collection(
//     FIRESTORE_COLLECTIONS.RECEIVERS || "receivers",
//   );
//   const now = new Date().toISOString();

//   let match: QueryDocumentSnapshot | undefined;

//   if (phoneDigits.length >= 8) {
//     const snap = await col.where("phone", "==", phone).limit(5).get();
//     match = snap.empty ? undefined : snap.docs[0];

//     if (!match) {
//       const all = await col.limit(500).get();
//       const last10 = phoneDigits.slice(-10);

//       match = all.docs.find((d) => {
//         const p = digitsPhone(d.data()?.phone);
//         if (!p) return false;
//         return (
//           p === phoneDigits ||
//           (last10.length >= 8 && p.endsWith(last10))
//         );
//       });
//     }
//   }

//   const payload = {
//     name: name || companyName || "Consignee",
//     companyName,
//     contactName: str(consignee.contactName) || name || null,
//     phone: phone || "0000000000",
//     mobile: str(consignee.mobile) || null,
//     email: str(consignee.email) || null,
//     address: partyAddress(consignee) || null,
//     addressLine1:
//       str(consignee.addressLine1) || partyAddress(consignee) || null,
//     addressLine2: str(consignee.addressLine2) || null,
//     city: str(consignee.city) || null,
//     state: str(consignee.state) || null,
//     postalCode: str(consignee.pincode || consignee.postalCode) || null,
//     gstin,
//     country: str(consignee.country) || null,
//     updatedAt: now,
//     updatedBy: userId,
//     status: "ACTIVE" as const,
//   };

//   if (match) {
//     await match.ref.set(payload, { merge: true });
//     return { receiverId: match.id, created: false };
//   }

//   const ref = col.doc();
//   await ref.set({
//     id: ref.id,
//     receiverId: ref.id,
//     ...payload,
//     source: "AWB_BOOKING",
//     createdAt: now,
//     createdBy: userId,
//   });

//   return { receiverId: ref.id, created: true };
// }

// type InvoiceItemBody = {
//   description?: string;
//   quantity?: number;
//   rate?: number;
//   amount?: number;
//   hsCode?: string;
//   shopName?: string;
//   shopAddress?: string;
//   boxNo?: string | number;
// };

// type CreateAWBBody = {
//   customerId?: string;
//   senderId?: string;
//   receiverId?: string;
//   customerName?: string;
//   customerCode?: string;
//   accountCode?: string;
//   origin?: string;
//   destination?: string;
//   serviceId?: string;
//   serviceType?: string;
//   service?: string;
//   product?: string;
//   vendor?: string;
//   shipmentDate?: string;
//   description?: string;
//   shipper?: Record<string, unknown>;
//   consignee?: Record<string, unknown>;
//   pieces?: Array<{
//     quantity?: number;
//     actualWeightKg?: number;
//     lengthCm?: number;
//     widthCm?: number;
//     heightCm?: number;
//     description?: string;
//     division?: number;
//   }>;
//   items?: InvoiceItemBody[];
//   gstin?: string;
//   csbType?: string;
//   termOfInvoice?: string;
//   exportReason?: string;
//   invoiceNo?: string;
//   invoiceDate?: string;
//   freight?: number;
//   fuelSurcharge?: number;
//   handlingCharges?: number;
//   pickupCharges?: number;
//   deliveryCharges?: number;
//   otherCharges?: number;
//   discount?: number;
//   gstRate?: number;
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
//   content?: string;
//   instruction?: string;
// };

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

//     if (!can(user, "LOGISTICS_AWB_CREATE")) {
//       return errorResponse(
//         "FORBIDDEN",
//         "You do not have permission to create an AWB.",
//         403,
//       );
//     }

//     const isSuperAdmin = user.role === "SUPER_ADMIN";
//     const canManageCharges = isSuperAdmin;

//     let body: CreateAWBBody;

//     try {
//       body = await request.json();
//     } catch {
//       return errorResponse("INVALID_JSON", "Invalid JSON request body.", 400);
//     }

//     const shipper = body.shipper || {};
//     const consignee = body.consignee || {};

//     const [senderResult, receiverResult] = await Promise.all([
//       upsertSenderFromShipper(shipper, user.userId),
//       upsertReceiverFromConsignee(consignee, user.userId),
//     ]);

//     const senderId =
//       typeof body.senderId === "string" &&
//       body.senderId.trim() &&
//       body.senderId.trim() !== "WALKIN_SENDER"
//         ? body.senderId.trim()
//         : senderResult.senderId;

//     const receiverId =
//       typeof body.receiverId === "string" &&
//       body.receiverId.trim() &&
//       body.receiverId.trim() !== "WALKIN_RECEIVER"
//         ? body.receiverId.trim()
//         : receiverResult.receiverId;

//     const customerId =
//       typeof body.customerId === "string" && body.customerId.trim()
//         ? body.customerId.trim()
//         : "WALKIN";

//     const origin =
//       (typeof body.origin === "string" && body.origin.trim()
//         ? body.origin.trim()
//         : "") ||
//       str(shipper.origin) ||
//       str(shipper.city, "ORIGIN");

//     const destination =
//       typeof body.destination === "string" && body.destination.trim()
//         ? body.destination.trim()
//         : str(consignee.country) || str(consignee.city, "DEST");

//     const consigneeCountry = str(consignee.country);
//     const regionDivisor = getVolumetricDivisor(destination, consigneeCountry);

//     const serviceId =
//       typeof body.serviceId === "string" && body.serviceId.trim()
//         ? body.serviceId.trim()
//         : typeof body.service === "string" && body.service.trim()
//           ? body.service.trim()
//           : typeof body.product === "string" && body.product.trim()
//             ? body.product.trim()
//             : "SELF";

//     const shipmentDate =
//       typeof body.shipmentDate === "string" && body.shipmentDate.trim()
//         ? body.shipmentDate.trim()
//         : new Date().toISOString().slice(0, 10);

//     const piecesInput = body.pieces ?? [];

//     if (piecesInput.length === 0) {
//       return errorResponse(
//         "PIECES_REQUIRED",
//         "At least one shipment piece is required.",
//         400,
//       );
//     }

//     const pieces: ShipmentPiece[] = piecesInput.map((piece, index) => {
//       const quantity = positiveInteger(
//         piece.quantity ?? 1,
//         `pieces[${index}].quantity`,
//       );

//       const actualWeight = positiveNumber(
//         piece.actualWeightKg ?? 0,
//         `pieces[${index}].actualWeightKg`,
//       );

//       const lengthCm = positiveNumber(
//         piece.lengthCm ?? 0,
//         `pieces[${index}].lengthCm`,
//       );

//       const widthCm = positiveNumber(
//         piece.widthCm ?? 0,
//         `pieces[${index}].widthCm`,
//       );

//       const heightCm = positiveNumber(
//         piece.heightCm ?? 0,
//         `pieces[${index}].heightCm`,
//       );

//       const division =
//         Number(piece.division) > 0 ? Number(piece.division) : regionDivisor;

//       const volumetricWeight =
//         calculateVolumetricWeight(lengthCm, widthCm, heightCm, division) *
//         quantity;

//       const chargeableWeight = calculateChargeableWeight(
//         actualWeight * quantity,
//         volumetricWeight,
//       );

//       return {
//         pieceId: `piece_${index + 1}`,
//         quantity,
//         actualWeight,
//         volumetricWeight,
//         chargeableWeight,
//         weightUnit: "KG" as const,
//         dimensions: {
//           length: lengthCm,
//           width: widthCm,
//           height: heightCm,
//           unit: "CM" as const,
//           boxCount: quantity,
//         },
//         description: piece.description?.trim(),
//         division,
//       };
//     });

//     const actualWeightKg = pieces.reduce(
//       (total, piece) => total + piece.actualWeight * piece.quantity,
//       0,
//     );

//     const volumetricWeightKg = pieces.reduce(
//       (total, piece) => total + (piece.volumetricWeight ?? 0),
//       0,
//     );

//     const chargeableWeightKg = calculateChargeableWeight(
//       actualWeightKg,
//       volumetricWeightKg,
//     );

//     const gstin =
//       body.gstin?.trim() || str(shipper.gstin).toUpperCase() || undefined;

//     if (gstin && !isValidGSTIN(gstin)) {
//       return errorResponse("INVALID_GSTIN", "GSTIN is invalid.", 400);
//     }

//     const freight = positiveNumber(body.freight ?? 0, "freight");
//     const fuelSurcharge = positiveNumber(
//       body.fuelSurcharge ?? 0,
//       "fuelSurcharge",
//     );
//     const handlingCharges = isSuperAdmin
//       ? positiveNumber(body.handlingCharges ?? 0, "handlingCharges")
//       : 0;
//     const pickupCharges = isSuperAdmin
//       ? positiveNumber(body.pickupCharges ?? 0, "pickupCharges")
//       : 0;
//     const deliveryCharges = isSuperAdmin
//       ? positiveNumber(body.deliveryCharges ?? 0, "deliveryCharges")
//       : 0;
//     const otherCharges = isSuperAdmin
//       ? positiveNumber(body.otherCharges ?? 0, "otherCharges")
//       : 0;
//     const discount = isSuperAdmin
//       ? positiveNumber(body.discount ?? 0, "discount")
//       : 0;

//     const taxableAmount = Math.max(
//       0,
//       freight +
//         fuelSurcharge +
//         handlingCharges +
//         pickupCharges +
//         deliveryCharges +
//         otherCharges -
//         discount,
//     );

//     const gstRate = body.gstRate ?? 18;
//     const totalTax = taxableAmount * (gstRate / 100);
//     const total = taxableAmount + totalTax;

//     const itemsInput = Array.isArray(body.items) ? body.items : [];
//     const items = itemsInput.map((it, index) => {
//       const quantity = Number(it.quantity) || 1;
//       const rate = Number(it.rate) || 0;
//       const amount =
//         Number(it.amount) || Number((quantity * rate).toFixed(2));

//       return {
//         id: `item_${index + 1}`,
//         boxNo: boxKey(it.boxNo),
//         description: str(it.description, `Item ${index + 1}`),
//         shopName: str(it.shopName) || null,
//         shopAddress: str(it.shopAddress) || null,
//         hsCode: str(it.hsCode) || null,
//         quantity,
//         rate,
//         unitRate: rate,
//         amount,
//       };
//     });

//     const boxesPresent = Array.from(
//       new Set(items.map((i) => i.boxNo)),
//     ) as Array<"BOX_1" | "BOX_2">;

//     const parentAwb = await generateBusinessId("LOGISTICS");
//     const now = new Date().toISOString();
//     const trackingStageId = "BOOKED";

//     const baseShipment = {
//       customerId,
//       customerName: str(body.customerName),
//       customerCode: str(body.customerCode),
//       accountCode: str(body.accountCode),
//       senderId,
//       receiverId,
//       origin,
//       destination,
//       serviceId,
//       serviceType: body.serviceType ?? null,
//       product: str(body.product),
//       vendor: str(body.vendor),
//       service: str(body.service, serviceId),
//       shipmentDate,
//       description: body.description?.trim() ?? null,
//       content: str(body.content),
//       instruction: str(body.instruction),
//       shipper,
//       consignee,
//       pieces,
//       items,
//       boxes: boxesPresent,
//       volumetricDivisor: regionDivisor,
//       actualWeightKg,
//       volumetricWeightKg,
//       chargeableWeightKg,
//       actualWeight: actualWeightKg,
//       volumetricWeight: volumetricWeightKg,
//       chargeableWeight: chargeableWeightKg,
//       totalPieces: pieces.reduce((n, p) => n + p.quantity, 0),
//       packageType: str(body.packageType, "PKT"),
//       weightUnit: "KG" as const,
//       shipmentValue: Number(body.shipmentValue) || 0,
//       currency: str(body.currency, "INR"),
//       paymentType: str(body.paymentType, "Credit"),
//       referenceNo: str(body.referenceNo),
//       commercial: Boolean(body.commercial),
//       oda: Boolean(body.oda),
//       medicalCharges: Boolean(body.medicalCharges),
//       csbType: str(body.csbType, "CSB4"),
//       termOfInvoice: str(body.termOfInvoice, "CIF"),
//       exportReason: str(body.exportReason),
//       invoiceNo: str(body.invoiceNo),
//       invoiceDate: str(body.invoiceDate),
//       gstDetails: {
//         gstin: gstin ?? null,
//         taxableAmount,
//         cgst: totalTax / 2,
//         sgst: totalTax / 2,
//         igst: 0,
//         totalTax,
//       },
//       charges: {
//         freight,
//         fuelSurcharge,
//         handlingCharges,
//         pickupCharges,
//         deliveryCharges,
//         otherCharges,
//         discount,
//         taxableAmount,
//         gst: totalTax,
//         total,
//         currency: "INR" as const,
//       },
//       currentStatus: "BOOKED" as TrackingStatus,
//       latestLocation: origin,
//       createdBy: user.userId,
//       updatedBy: user.userId,
//       createdAt: now,
//       updatedAt: now,
//     };

//     const batch = adminDb.batch();
//     const createdAwbs: string[] = [];

//     const parentRef = adminDb.collection("awbs").doc(parentAwb);
//     batch.set(parentRef, {
//       ...baseShipment,
//       awb: parentAwb,
//       awbDocumentId: parentRef.id,
//       parentAwb: null,
//       isParent: boxesPresent.length > 1,
//     });
//     createdAwbs.push(parentAwb);

//     const parentTrackRef = adminDb.collection("trackingEvents").doc();
//     batch.set(parentTrackRef, {
//       trackingEventId: parentTrackRef.id,
//       awb: parentAwb,
//       trackingStageId,
//       status: "BOOKED" as TrackingStatus,
//       location: origin,
//       remarks: "Shipment booked.",
//       eventTime: now,
//       createdBy: user.userId,
//       createdAt: FieldValue.serverTimestamp(),
//     });

//     const childAwbs: Array<{ boxNo: string; awb: string }> = [];

//     if (boxesPresent.length > 1) {
//       for (const box of boxesPresent) {
//         const childAwb = await generateBusinessId("LOGISTICS");
//         const childItems = items.filter((i) => i.boxNo === box);
//         const childRef = adminDb.collection("awbs").doc(childAwb);

//         batch.set(childRef, {
//           ...baseShipment,
//           awb: childAwb,
//           awbDocumentId: childRef.id,
//           parentAwb,
//           boxNo: box,
//           isParent: false,
//           items: childItems,
//           referenceNo: str(body.referenceNo) || parentAwb,
//         });

//         createdAwbs.push(childAwb);
//         childAwbs.push({ boxNo: box, awb: childAwb });

//         const trackRef = adminDb.collection("trackingEvents").doc();
//         batch.set(trackRef, {
//           trackingEventId: trackRef.id,
//           awb: childAwb,
//           trackingStageId,
//           status: "BOOKED" as TrackingStatus,
//           location: origin,
//           remarks: `Shipment booked (${box}).`,
//           eventTime: now,
//           createdBy: user.userId,
//           createdAt: FieldValue.serverTimestamp(),
//         });
//       }

//       batch.update(parentRef, { childAwbs });
//     }

//     await batch.commit();

//     await writeAuditLog({
//       userId: user.userId,
//       action: "AWB_CREATED",
//       resourceType: "AWB",
//       resourceId: parentAwb,
//       module: "LOGISTICS",
//       metadata: {
//         customerId,
//         senderId,
//         receiverId,
//         senderCreated: senderResult.created,
//         receiverCreated: receiverResult.created,
//         origin,
//         destination,
//         volumetricDivisor: regionDivisor,
//         boxes: boxesPresent,
//         childAwbs,
//         chargesManagedBySuperAdmin: canManageCharges,
//         freightSaved: freight,
//         fuelSurchargeSaved: fuelSurcharge,
//         createdByRole: user.role,
//       },
//     });

//     return successResponse(
//       {
//         awb: parentAwb,
//         childAwbs,
//         senderId,
//         receiverId,
//         status: "BOOKED",
//         trackingEventId: parentTrackRef.id,
//         shipment: {
//           ...baseShipment,
//           awb: parentAwb,
//           childAwbs,
//         },
//       },
//       201,
//       boxesPresent.length > 1
//         ? `AWB created with separate box AWBs (${boxesPresent.join(", ")}).`
//         : "AWB created successfully.",
//     );
//   } catch (error) {
//     console.error("POST /api/logistics/awb/create:", error);

//     if (
//       error instanceof Error &&
//       /is required|must be a valid|cannot be negative/i.test(error.message)
//     ) {
//       return errorResponse("VALIDATION_ERROR", error.message, 400);
//     }

//     return errorResponse(
//       "AWB_CREATE_FAILED",
//       error instanceof Error ? error.message : "Unable to create AWB.",
//       500,
//     );
//   }
// }

import { NextRequest } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import type { QueryDocumentSnapshot } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";
import { getCurrentUser } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { writeAuditLog } from "@/lib/audit";
import { successResponse, errorResponse } from "@/lib/api-response";
import { generateBusinessId } from "@/lib/business-id";
import {
  calculateChargeableWeight,
  calculateVolumetricWeight,
} from "@/utils/calculations";
import {
  isValidGSTIN,
  positiveNumber,
  positiveInteger,
} from "@/utils/validators";
import { FIRESTORE_COLLECTIONS } from "@/utils/constants";

import type { ShipmentPiece } from "@/types/logistics";
import type { TrackingStatus } from "@/types/tracking";

function getVolumetricDivisor(
  destination?: string,
  country?: string,
): number {
  const text = `${destination || ""} ${country || ""}`.toUpperCase();

  if (
    text.includes("AUSTRALIA") ||
    text.includes("AUSTRALIAN") ||
    /\bAUS\b/.test(text) ||
    /\bAU\b/.test(text) ||
    text.includes("SYDNEY") ||
    text.includes("MELBOURNE") ||
    text.includes("BRISBANE") ||
    text.includes("PERTH") ||
    text.includes("ADELAIDE")
  ) {
    return 4000;
  }

  if (
    text.includes("USA") ||
    text.includes("U.S.A") ||
    text.includes("U.S.") ||
    text.includes("UNITED STATES") ||
    text.includes("AMERICA") ||
    /\bUS\b/.test(text)
  ) {
    return 5000;
  }

  return 5000;
}

function str(v: unknown, fallback = ""): string {
  if (v == null) return fallback;
  return String(v).trim() || fallback;
}

function digitsPhone(v: unknown): string {
  return str(v).replace(/\D/g, "");
}

function boxKey(raw: unknown): "BOX_1" | "BOX_2" {
  const s = String(raw || "BOX_1").toUpperCase();
  if (s.includes("2") || s === "BOX_2") return "BOX_2";
  return "BOX_1";
}

function partyAddress(party: Record<string, unknown>): string {
  return (
    str(party.addressLine1) ||
    str(party.address) ||
    [str(party.addressLine1), str(party.addressLine2)]
      .filter(Boolean)
      .join(", ")
  );
}

/** Prefer contactName → name → company → companyName */
function partyDisplayName(party: Record<string, unknown>): string {
  return (
    str(party.contactName) ||
    str(party.name) ||
    str(party.company) ||
    str(party.companyName)
  );
}

function partyCompany(party: Record<string, unknown>): string {
  return str(party.company) || str(party.companyName);
}

async function upsertSenderFromShipper(
  shipper: Record<string, unknown>,
  userId: string,
): Promise<{ senderId: string; created: boolean }> {
  const name = partyDisplayName(shipper);
  const phone = str(shipper.phone) || str(shipper.mobile);
  const phoneDigits = digitsPhone(phone);
  const companyName = partyCompany(shipper) || null;
  const gstin = str(shipper.gstin).toUpperCase() || null;

  if (!name && !companyName) {
    return { senderId: "WALKIN_SENDER", created: false };
  }

  const col = adminDb.collection(FIRESTORE_COLLECTIONS.SENDERS || "senders");
  const now = new Date().toISOString();

  let match: QueryDocumentSnapshot | undefined;

  if (phoneDigits.length >= 8) {
    const snap = await col.where("phone", "==", phone).limit(5).get();
    match = snap.empty ? undefined : snap.docs[0];

    if (!match) {
      const all = await col.limit(500).get();
      const last10 = phoneDigits.slice(-10);

      match = all.docs.find((d) => {
        const p = digitsPhone(d.data()?.phone);
        if (!p) return false;
        return (
          p === phoneDigits ||
          (last10.length >= 8 && p.endsWith(last10))
        );
      });
    }
  }

  // const payload = {
  //   name: name || companyName || "Shipper",
  //   companyName,
  //   contactName: str(shipper.contactName) || name || null,
  //   phone: phone || "0000000000",
  //   mobile: str(shipper.mobile) || null,
  //   email: str(shipper.email) || null,
  //   address: partyAddress(shipper) || null,
  //   addressLine1: str(shipper.addressLine1) || partyAddress(shipper) || null,
  //   addressLine2: str(shipper.addressLine2) || null,
  //   city: str(shipper.city) || null,
  //   state: str(shipper.state) || null,
  //   postalCode: str(shipper.pincode || shipper.postalCode) || null,
  //   gstin,
  //   iecNo: str(shipper.iecNo) || null,
  //   documentType: str(shipper.documentType) || null,
  //   documentNo: str(shipper.documentNo) || null,
  //   country: str(shipper.country, "India") || null,
  //   origin: str(shipper.origin) || null,
  //   updatedAt: now,
  //   updatedBy: userId,
  //   status: "ACTIVE" as const,
  // };

    const payload = {
    name: name || companyName || "Shipper",
    companyName,
    contactName: str(shipper.contactName) || name || null,
    phone: phone || "0000000000",
    mobile: str(shipper.mobile) || null,
    email: str(shipper.email) || null,
    address: partyAddress(shipper) || null,
    addressLine1: str(shipper.addressLine1) || partyAddress(shipper) || null,
    addressLine2: str(shipper.addressLine2) || null,
    city: str(shipper.city) || null,
    state: str(shipper.state) || null,
    postalCode: str(shipper.pincode || shipper.postalCode) || null,
    gstin,
    iecNo: str(shipper.iecNo) || null,
    documentType: str(shipper.documentType) || null,
    documentNo: str(shipper.documentNo) || null,
    documentUrl: str(shipper.documentUrl) || null, // ← add
    country: str(shipper.country, "India") || null,
    origin: str(shipper.origin) || null,
    updatedAt: now,
    updatedBy: userId,
    status: "ACTIVE" as const,
  };

  if (match) {
    await match.ref.set(payload, { merge: true });
    return { senderId: match.id, created: false };
  }

  const ref = col.doc();
  await ref.set({
    id: ref.id,
    senderId: ref.id,
    ...payload,
    source: "AWB_BOOKING",
    createdAt: now,
    createdBy: userId,
  });

  return { senderId: ref.id, created: true };
}

async function upsertReceiverFromConsignee(
  consignee: Record<string, unknown>,
  userId: string,
): Promise<{ receiverId: string; created: boolean }> {
  const name = partyDisplayName(consignee);
  const phone = str(consignee.phone) || str(consignee.mobile);
  const phoneDigits = digitsPhone(phone);
  const companyName = partyCompany(consignee) || null;
  const gstin = str(consignee.gstin).toUpperCase() || null;

  if (!name && !companyName) {
    return { receiverId: "WALKIN_RECEIVER", created: false };
  }

  const col = adminDb.collection(
    FIRESTORE_COLLECTIONS.RECEIVERS || "receivers",
  );
  const now = new Date().toISOString();

  let match: QueryDocumentSnapshot | undefined;

  if (phoneDigits.length >= 8) {
    const snap = await col.where("phone", "==", phone).limit(5).get();
    match = snap.empty ? undefined : snap.docs[0];

    if (!match) {
      const all = await col.limit(500).get();
      const last10 = phoneDigits.slice(-10);

      match = all.docs.find((d) => {
        const p = digitsPhone(d.data()?.phone);
        if (!p) return false;
        return (
          p === phoneDigits ||
          (last10.length >= 8 && p.endsWith(last10))
        );
      });
    }
  }

  const payload = {
    name: name || companyName || "Consignee",
    companyName,
    contactName: str(consignee.contactName) || name || null,
    phone: phone || "0000000000",
    mobile: str(consignee.mobile) || null,
    email: str(consignee.email) || null,
    address: partyAddress(consignee) || null,
    addressLine1:
      str(consignee.addressLine1) || partyAddress(consignee) || null,
    addressLine2: str(consignee.addressLine2) || null,
    city: str(consignee.city) || null,
    state: str(consignee.state) || null,
    postalCode: str(consignee.pincode || consignee.postalCode) || null,
    gstin,
    iecNo: str(consignee.iecNo) || null,
    documentType: str(consignee.documentType) || null,
    documentNo: str(consignee.documentNo) || null,
    documentUrl: str(consignee.documentUrl) || null,
    country: str(consignee.country) || null,
    updatedAt: now,
    updatedBy: userId,
    status: "ACTIVE" as const,
  };

  if (match) {
    await match.ref.set(payload, { merge: true });
    return { receiverId: match.id, created: false };
  }

  const ref = col.doc();
  await ref.set({
    id: ref.id,
    receiverId: ref.id,
    ...payload,
    source: "AWB_BOOKING",
    createdAt: now,
    createdBy: userId,
  });

  return { receiverId: ref.id, created: true };
}

type InvoiceItemBody = {
  description?: string;
  quantity?: number;
  rate?: number;
  amount?: number;
  hsCode?: string;
  shopName?: string;
  shopAddress?: string;
  boxNo?: string | number;
};

type CreateAWBBody = {
  customerId?: string;
  senderId?: string;
  receiverId?: string;
  customerName?: string;
  customerCode?: string;
  accountCode?: string;
  origin?: string;
  originCode?:string;
  destination?: string;
  destinationCode?: string;
  serviceId?: string;
  serviceType?: string;
  service?: string;
  product?: string;
  vendor?: string;
  shipmentDate?: string;
  description?: string;
  shipper?: Record<string, unknown>;
  consignee?: Record<string, unknown>;
  pieces?: Array<{
    quantity?: number;
    actualWeightKg?: number;
    lengthCm?: number;
    widthCm?: number;
    heightCm?: number;
    description?: string;
    division?: number;
  }>;
  items?: InvoiceItemBody[];
  gstin?: string;
  csbType?: string;
  termOfInvoice?: string;
  exportReason?: string;
  invoiceNo?: string;
  invoiceDate?: string;
  freight?: number;
  fuelSurcharge?: number;
  handlingCharges?: number;
  pickupCharges?: number;
  deliveryCharges?: number;
  otherCharges?: number;
  discount?: number;
  gstRate?: number;
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
  currency?: string;
  content?: string;
  instruction?: string;
};

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

    if (!can(user, "LOGISTICS_AWB_CREATE")) {
      return errorResponse(
        "FORBIDDEN",
        "You do not have permission to create an AWB.",
        403,
      );
    }

    const isSuperAdmin = user.role === "SUPER_ADMIN";
    const canManageCharges = isSuperAdmin;

    let body: CreateAWBBody;

    try {
      body = await request.json();
    } catch {
      return errorResponse("INVALID_JSON", "Invalid JSON request body.", 400);
    }

    const shipper = body.shipper || {};
    const consignee = body.consignee || {};

    const [senderResult, receiverResult] = await Promise.all([
      upsertSenderFromShipper(shipper, user.userId),
      upsertReceiverFromConsignee(consignee, user.userId),
    ]);

    const senderId =
      typeof body.senderId === "string" &&
      body.senderId.trim() &&
      body.senderId.trim() !== "WALKIN_SENDER"
        ? body.senderId.trim()
        : senderResult.senderId;

    const receiverId =
      typeof body.receiverId === "string" &&
      body.receiverId.trim() &&
      body.receiverId.trim() !== "WALKIN_RECEIVER"
        ? body.receiverId.trim()
        : receiverResult.receiverId;

    const customerId =
      typeof body.customerId === "string" && body.customerId.trim()
        ? body.customerId.trim()
        : "WALKIN";

    const origin =
      (typeof body.origin === "string" && body.origin.trim()
        ? body.origin.trim()
        : "") ||
      str(shipper.origin) ||
      str(shipper.city, "ORIGIN");

    const originCode =
      (typeof body.originCode === "string" && body.originCode.trim()
        ? body.originCode.trim().toUpperCase()
        : "") || str(shipper.originCode).toUpperCase();

    const destination =
      typeof body.destination === "string" && body.destination.trim()
        ? body.destination.trim()
        : str(consignee.country) || str(consignee.city, "DEST");

    const destinationCode = str(body.destinationCode);

    const consigneeCountry = str(consignee.country);
    const regionDivisor = getVolumetricDivisor(destination, consigneeCountry);

    const serviceId =
      typeof body.serviceId === "string" && body.serviceId.trim()
        ? body.serviceId.trim()
        : typeof body.service === "string" && body.service.trim()
          ? body.service.trim()
          : typeof body.product === "string" && body.product.trim()
            ? body.product.trim()
            : "SELF";

    const shipmentDate =
      typeof body.shipmentDate === "string" && body.shipmentDate.trim()
        ? body.shipmentDate.trim()
        : new Date().toISOString().slice(0, 10);

    const piecesInput = body.pieces ?? [];

    if (piecesInput.length === 0) {
      return errorResponse(
        "PIECES_REQUIRED",
        "At least one shipment piece is required.",
        400,
      );
    }

    const pieces: ShipmentPiece[] = piecesInput.map((piece, index) => {
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
        Number(piece.division) > 0 ? Number(piece.division) : regionDivisor;

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

    const gstin =
      body.gstin?.trim() || str(shipper.gstin).toUpperCase() || undefined;

    if (gstin && !isValidGSTIN(gstin)) {
      return errorResponse("INVALID_GSTIN", "GSTIN is invalid.", 400);
    }

    const freight = positiveNumber(body.freight ?? 0, "freight");
    const fuelSurcharge = positiveNumber(
      body.fuelSurcharge ?? 0,
      "fuelSurcharge",
    );
    const handlingCharges = isSuperAdmin
      ? positiveNumber(body.handlingCharges ?? 0, "handlingCharges")
      : 0;
    const pickupCharges = isSuperAdmin
      ? positiveNumber(body.pickupCharges ?? 0, "pickupCharges")
      : 0;
    const deliveryCharges = isSuperAdmin
      ? positiveNumber(body.deliveryCharges ?? 0, "deliveryCharges")
      : 0;
    const otherCharges = isSuperAdmin
      ? positiveNumber(body.otherCharges ?? 0, "otherCharges")
      : 0;
    const discount = isSuperAdmin
      ? positiveNumber(body.discount ?? 0, "discount")
      : 0;

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

    const gstRate = body.gstRate ?? 18;
    const totalTax = taxableAmount * (gstRate / 100);
    const total = taxableAmount + totalTax;

    const itemsInput = Array.isArray(body.items) ? body.items : [];
    const items = itemsInput.map((it, index) => {
      const quantity = Number(it.quantity) || 1;
      const rate = Number(it.rate) || 0;
      const amount =
        Number(it.amount) || Number((quantity * rate).toFixed(2));

      return {
        id: `item_${index + 1}`,
        boxNo: boxKey(it.boxNo),
        description: str(it.description, `Item ${index + 1}`),
        shopName: str(it.shopName) || null,
        shopAddress: str(it.shopAddress) || null,
        hsCode: str(it.hsCode) || null,
        quantity,
        rate,
        unitRate: rate,
        amount,
      };
    });

    const boxesPresent = Array.from(
      new Set(items.map((i) => i.boxNo)),
    ) as Array<"BOX_1" | "BOX_2">;

    const parentAwb = await generateBusinessId("LOGISTICS");
    const now = new Date().toISOString();
    const trackingStageId = "BOOKED";

    const baseShipment = {
      customerId,
      customerName: str(body.customerName),
      customerCode: str(body.customerCode),
      accountCode: str(body.accountCode),
      senderId,
      receiverId,
      origin,
      originCode: originCode || null,
      destination,
      destinationCode: destinationCode || null,
      serviceId,
      serviceType: body.serviceType ?? null,
      product: str(body.product),
      productCode: str((body as { productCode?: string }).productCode) || null,
      vendor: str(body.vendor),
      service: str(body.service, serviceId),
      serviceCode: str((body as { serviceCode?: string }).serviceCode) || null,
      shipmentDate,
      description: body.description?.trim() ?? null,
      content: str(body.content),
      instruction: str(body.instruction),
      shipper,
      consignee,
      pieces,
      items,
      boxes: boxesPresent,
      volumetricDivisor: regionDivisor,
      actualWeightKg,
      volumetricWeightKg,
      chargeableWeightKg,
      actualWeight: actualWeightKg,
      volumetricWeight: volumetricWeightKg,
      chargeableWeight: chargeableWeightKg,
      totalPieces: pieces.reduce((n, p) => n + p.quantity, 0),
      packageType: str(body.packageType, "PKT"),
      weightUnit: "KG" as const,
      shipmentValue: Number(body.shipmentValue) || 0,
      currency: str(body.currency, "INR"),
      paymentType: str(body.paymentType, "Credit"),
      referenceNo: str(body.referenceNo),
      commercial: Boolean(body.commercial),
      oda: Boolean(body.oda),
      medicalCharges: Boolean(body.medicalCharges),
      csbType: str(body.csbType, "CSB4"),
      termOfInvoice: str(body.termOfInvoice, "CIF"),
      exportReason: str(body.exportReason),
      invoiceNo: str(body.invoiceNo),
      invoiceDate: str(body.invoiceDate),
      gstDetails: {
        gstin: gstin ?? null,
        taxableAmount,
        cgst: totalTax / 2,
        sgst: totalTax / 2,
        igst: 0,
        totalTax,
      },
      charges: {
        freight,
        fuelSurcharge,
        handlingCharges,
        pickupCharges,
        deliveryCharges,
        otherCharges,
        discount,
        taxableAmount,
        gst: totalTax,
        total,
        currency: "INR" as const,
      },
      currentStatus: "BOOKED" as TrackingStatus,
      latestLocation: origin,
      createdBy: user.userId,
      updatedBy: user.userId,
      createdAt: now,
      updatedAt: now,
    };

    // const batch = adminDb.batch();
    // const createdAwbs: string[] = [];

    // const parentRef = adminDb.collection("awbs").doc(parentAwb);
    // batch.set(parentRef, {
    //   ...baseShipment,
    //   awb: parentAwb,
    //   awbDocumentId: parentRef.id,
    //   parentAwb: null,
    //   isParent: boxesPresent.length > 1,
    // });
    // createdAwbs.push(parentAwb);

    // const parentTrackRef = adminDb.collection("trackingEvents").doc();
    // batch.set(parentTrackRef, {
    //   trackingEventId: parentTrackRef.id,
    //   awb: parentAwb,
    //   trackingStageId,
    //   status: "BOOKED" as TrackingStatus,
    //   location: origin,
    //   remarks: "Shipment booked.",
    //   eventTime: now,
    //   createdBy: user.userId,
    //   createdAt: FieldValue.serverTimestamp(),
    // });

    // const childAwbs: Array<{ boxNo: string; awb: string }> = [];

    // if (boxesPresent.length > 1) {
    //   for (const box of boxesPresent) {
    //     const childAwb = await generateBusinessId("LOGISTICS");
    //     const childItems = items.filter((i) => i.boxNo === box);
    //     const childRef = adminDb.collection("awbs").doc(childAwb);

    //     batch.set(childRef, {
    //       ...baseShipment,
    //       awb: childAwb,
    //       awbDocumentId: childRef.id,
    //       parentAwb,
    //       boxNo: box,
    //       isParent: false,
    //       items: childItems,
    //       referenceNo: str(body.referenceNo) || parentAwb,
    //     });

    //     createdAwbs.push(childAwb);
    //     childAwbs.push({ boxNo: box, awb: childAwb });

    //     const trackRef = adminDb.collection("trackingEvents").doc();
    //     batch.set(trackRef, {
    //       trackingEventId: trackRef.id,
    //       awb: childAwb,
    //       trackingStageId,
    //       status: "BOOKED" as TrackingStatus,
    //       location: origin,
    //       remarks: `Shipment booked (${box}).`,
    //       eventTime: now,
    //       createdBy: user.userId,
    //       createdAt: FieldValue.serverTimestamp(),
    //     });
    //   }

    //   batch.update(parentRef, { childAwbs });
    // }

    // await batch.commit();

    // await writeAuditLog({
    //   userId: user.userId,
    //   action: "AWB_CREATED",
    //   resourceType: "AWB",
    //   resourceId: parentAwb,
    //   module: "LOGISTICS",
    //   metadata: {
    //     customerId,
    //     senderId,
    //     receiverId,
    //     senderCreated: senderResult.created,
    //     receiverCreated: receiverResult.created,
    //     origin,
    //     destination,
    //     destinationCode,
    //     volumetricDivisor: regionDivisor,
    //     boxes: boxesPresent,
    //     childAwbs,
    //     chargesManagedBySuperAdmin: canManageCharges,
    //     freightSaved: freight,
    //     fuelSurchargeSaved: fuelSurcharge,
    //     createdByRole: user.role,
    //   },
    // });

    // return successResponse(
    //   {
    //     awb: parentAwb,
    //     childAwbs,
    //     senderId,
    //     receiverId,
    //     status: "BOOKED",
    //     trackingEventId: parentTrackRef.id,
    //     shipment: {
    //       ...baseShipment,
    //       awb: parentAwb,
    //       childAwbs,
    //     },
    //   },
    //   201,
    //   boxesPresent.length > 1
    //     ? `AWB created with separate box AWBs (${boxesPresent.join(", ")}).`
    //     : "AWB created successfully.",
    // );

        const batch = adminDb.batch();

    const parentRef = adminDb.collection("awbs").doc(parentAwb);
    batch.set(parentRef, {
      ...baseShipment,
      awb: parentAwb,
      awbDocumentId: parentRef.id,
      parentAwb: null,
      isParent: true,
      // still store which boxes exist on the single document
      boxes: boxesPresent,
      childAwbs: [],
    });

    const parentTrackRef = adminDb.collection("trackingEvents").doc();
    batch.set(parentTrackRef, {
      trackingEventId: parentTrackRef.id,
      awb: parentAwb,
      trackingStageId,
      status: "BOOKED" as TrackingStatus,
      location: origin,
      remarks: "Shipment booked.",
      eventTime: now,
      createdBy: user.userId,
      createdAt: FieldValue.serverTimestamp(),
    });

    await batch.commit();

    await writeAuditLog({
      userId: user.userId,
      action: "AWB_CREATED",
      resourceType: "AWB",
      resourceId: parentAwb,
      module: "LOGISTICS",
      metadata: {
        customerId,
        senderId,
        receiverId,
        senderCreated: senderResult.created,
        receiverCreated: receiverResult.created,
        origin,
        destination,
        destinationCode,
        volumetricDivisor: regionDivisor,
        boxes: boxesPresent,
        childAwbs: [],
        chargesManagedBySuperAdmin: canManageCharges,
        freightSaved: freight,
        fuelSurchargeSaved: fuelSurcharge,
        createdByRole: user.role,
      },
    });

    return successResponse(
      {
        awb: parentAwb,
        childAwbs: [],
        senderId,
        receiverId,
        status: "BOOKED",
        trackingEventId: parentTrackRef.id,
        shipment: {
          ...baseShipment,
          awb: parentAwb,
          childAwbs: [],
        },
      },
      201,
      "AWB created successfully.",
    );
  } catch (error) {
    console.error("POST /api/logistics/awb/create:", error);

    if (
      error instanceof Error &&
      /is required|must be a valid|cannot be negative/i.test(error.message)
    ) {
      return errorResponse("VALIDATION_ERROR", error.message, 400);
    }

    return errorResponse(
      "AWB_CREATE_FAILED",
      error instanceof Error ? error.message : "Unable to create AWB.",
      500,
    );
  }
}