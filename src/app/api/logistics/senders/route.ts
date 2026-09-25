// import { NextRequest } from "next/server";
// import type { DocumentData } from "firebase-admin/firestore";

// import { adminDb } from "@/lib/firebase-admin";
// import { getCurrentUser } from "@/lib/auth";
// import { can } from "@/lib/permissions";
// import { writeAuditLog } from "@/lib/audit";
// import {
//   successResponse,
//   errorResponse,
// } from "@/lib/api-response";
// import { FIRESTORE_COLLECTIONS } from "@/utils/constants";
// import {
//   isValidEmail,
//   isValidPhone,
//   isValidIndianPinCode,
//   isValidGSTIN,
// } from "@/utils/validators";

// type SenderStatus = "ACTIVE" | "INACTIVE";

// type SenderRecord = {
//   id: string;
//   senderId: string;
//   name: string;
//   companyName?: string;
//   phone: string;
//   email?: string;
//   address?: string;
//   city?: string;
//   state?: string;
//   postalCode?: string;
//   gstin?: string;
//   status: SenderStatus;
//   createdAt: string;
//   updatedAt: string;
// };

// type CreateSenderBody = {
//   name?: string;
//   companyName?: string;
//   phone?: string;
//   email?: string;
//   address?: string;
//   city?: string;
//   state?: string;
//   postalCode?: string;
//   gstin?: string;
//   status?: SenderStatus;
// };

// type UpdateSenderBody = CreateSenderBody & {
//   senderId?: string;
// };

// function normalizeSender(id: string, data: DocumentData): SenderRecord {
//   const statusRaw = String(data.status || "ACTIVE").toUpperCase();

//   const addressObj =
//     data.address && typeof data.address === "object"
//       ? (data.address as Record<string, unknown>)
//       : null;

//   return {
//     id,
//     senderId: String(data.senderId || id),
//     name: String(data.name || "").trim(),
//     companyName: data.companyName
//       ? String(data.companyName).trim()
//       : undefined,
//     phone: String(data.phone || "").trim(),
//     email: data.email ? String(data.email).trim() : undefined,
//     address: data.addressLine1
//       ? String(data.addressLine1).trim()
//       : addressObj?.addressLine1
//         ? String(addressObj.addressLine1).trim()
//         : data.address && typeof data.address === "string"
//           ? String(data.address).trim()
//           : undefined,
//     city: data.city
//       ? String(data.city).trim()
//       : addressObj?.city
//         ? String(addressObj.city).trim()
//         : undefined,
//     state: data.state
//       ? String(data.state).trim()
//       : addressObj?.state
//         ? String(addressObj.state).trim()
//         : undefined,
//     postalCode: data.postalCode
//       ? String(data.postalCode).trim()
//       : addressObj?.postalCode
//         ? String(addressObj.postalCode).trim()
//         : undefined,
//     gstin: data.gstin ? String(data.gstin).trim().toUpperCase() : undefined,
//     status: statusRaw === "INACTIVE" ? "INACTIVE" : "ACTIVE",
//     createdAt: String(data.createdAt || new Date().toISOString()),
//     updatedAt: String(
//       data.updatedAt || data.createdAt || new Date().toISOString(),
//     ),
//   };
// }

// function validatePayload(body: CreateSenderBody, partial = false) {
//   const errors: string[] = [];

//   if (!partial || body.name !== undefined) {
//     if (!body.name?.trim()) {
//       errors.push("Sender name is required.");
//     }
//   }

//   if (!partial || body.phone !== undefined) {
//     if (!body.phone?.trim()) {
//       errors.push("Phone is required.");
//     } else if (!isValidPhone(body.phone)) {
//       errors.push("Please enter a valid Indian phone number.");
//     }
//   }

//   if (body.email?.trim() && !isValidEmail(body.email)) {
//     errors.push("Please enter a valid email address.");
//   }

//   if (body.postalCode?.trim() && !isValidIndianPinCode(body.postalCode)) {
//     errors.push("Please enter a valid 6-digit PIN code.");
//   }

//   if (body.gstin?.trim() && !isValidGSTIN(body.gstin)) {
//     errors.push("Please enter a valid GSTIN.");
//   }

//   if (
//     body.status !== undefined &&
//     body.status !== "ACTIVE" &&
//     body.status !== "INACTIVE"
//   ) {
//     errors.push("Status must be ACTIVE or INACTIVE.");
//   }

//   return errors;
// }

// export async function GET(request: NextRequest) {
//   try {
//     const user = await getCurrentUser(request);

//     if (!user) {
//       return errorResponse(
//         "UNAUTHORIZED",
//         "Authentication is required.",
//         401,
//       );
//     }

//     if (!can(user, "LOGISTICS_AWB_VIEW")) {
//       return errorResponse(
//         "FORBIDDEN",
//         "You do not have permission to view senders.",
//         403,
//       );
//     }

//     const { searchParams } = new URL(request.url);
//     const status = searchParams.get("status");
//     const q = searchParams.get("q")?.trim().toLowerCase();

//     const snapshot = await adminDb
//       .collection(FIRESTORE_COLLECTIONS.SENDERS)
//       .get();

//     let senders = snapshot.docs.map((doc) =>
//       normalizeSender(doc.id, doc.data()),
//     );

//     if (status === "ACTIVE" || status === "INACTIVE") {
//       senders = senders.filter((item) => item.status === status);
//     }

//     if (q) {
//       senders = senders.filter((item) =>
//         [
//           item.senderId,
//           item.name,
//           item.companyName,
//           item.phone,
//           item.email,
//           item.city,
//           item.state,
//           item.gstin,
//         ]
//           .filter(Boolean)
//           .join(" ")
//           .toLowerCase()
//           .includes(q),
//       );
//     }

//     senders.sort((a, b) => a.name.localeCompare(b.name));

//     return successResponse(senders);
//   } catch (error) {
//     console.error("GET /api/logistics/senders failed", error);

//     return errorResponse(
//       "SENDERS_LIST_FAILED",
//       error instanceof Error ? error.message : "Failed to load senders.",
//       500,
//     );
//   }
// }

// export async function POST(request: NextRequest) {
//   try {
//     const user = await getCurrentUser(request);

//     if (!user) {
//       return errorResponse(
//         "UNAUTHORIZED",
//         "Authentication is required.",
//         401,
//       );
//     }

//     if (!can(user, "LOGISTICS_AWB_CREATE")) {
//       return errorResponse(
//         "FORBIDDEN",
//         "You do not have permission to create senders.",
//         403,
//       );
//     }

//     let body: CreateSenderBody;

//     try {
//       body = (await request.json()) as CreateSenderBody;
//     } catch {
//       return errorResponse(
//         "INVALID_JSON",
//         "Invalid JSON request body.",
//         400,
//       );
//     }

//     const errors = validatePayload(body, false);

//     if (errors.length > 0) {
//       return errorResponse("VALIDATION_ERROR", errors[0]!, 400);
//     }

//     const now = new Date().toISOString();
//     const ref = adminDb.collection(FIRESTORE_COLLECTIONS.SENDERS).doc();

//     const record: SenderRecord = {
//       id: ref.id,
//       senderId: ref.id,
//       name: body.name!.trim(),
//       companyName: body.companyName?.trim() || undefined,
//       phone: body.phone!.trim(),
//       email: body.email?.trim() || undefined,
//       address: body.address?.trim() || undefined,
//       city: body.city?.trim() || undefined,
//       state: body.state?.trim() || undefined,
//       postalCode: body.postalCode?.trim() || undefined,
//       gstin: body.gstin?.trim().toUpperCase() || undefined,
//       status: body.status === "INACTIVE" ? "INACTIVE" : "ACTIVE",
//       createdAt: now,
//       updatedAt: now,
//     };

//     await ref.set({
//       ...record,
//       addressLine1: record.address || null,
//     });

//     await writeAuditLog({
//       userId: user.userId,
//       action: "SENDER_CREATE",
//       module: "LOGISTICS",
//       resourceType: "sender",
//       resourceId: record.senderId,
//       metadata: {
//         name: record.name,
//         phone: record.phone,
//       },
//     });

//     return successResponse(record, 201, "Sender created.");
//   } catch (error) {
//     console.error("POST /api/logistics/senders failed", error);

//     return errorResponse(
//       "SENDER_CREATE_FAILED",
//       error instanceof Error ? error.message : "Failed to create sender.",
//       500,
//     );
//   }
// }

// export async function PATCH(request: NextRequest) {
//   try {
//     const user = await getCurrentUser(request);

//     if (!user) {
//       return errorResponse(
//         "UNAUTHORIZED",
//         "Authentication is required.",
//         401,
//       );
//     }

//     if (!can(user, "LOGISTICS_AWB_UPDATE")) {
//       return errorResponse(
//         "FORBIDDEN",
//         "You do not have permission to update senders.",
//         403,
//       );
//     }

//     let body: UpdateSenderBody;

//     try {
//       body = (await request.json()) as UpdateSenderBody;
//     } catch {
//       return errorResponse(
//         "INVALID_JSON",
//         "Invalid JSON request body.",
//         400,
//       );
//     }

//     const senderId = body.senderId?.trim();

//     if (!senderId) {
//       return errorResponse(
//         "SENDER_ID_REQUIRED",
//         "senderId is required.",
//         400,
//       );
//     }

//     const errors = validatePayload(body, true);

//     if (errors.length > 0) {
//       return errorResponse("VALIDATION_ERROR", errors[0]!, 400);
//     }

//     const ref = adminDb
//       .collection(FIRESTORE_COLLECTIONS.SENDERS)
//       .doc(senderId);

//     const existing = await ref.get();

//     if (!existing.exists) {
//       return errorResponse("SENDER_NOT_FOUND", "Sender was not found.", 404);
//     }

//     const patch: Record<string, unknown> = {
//       updatedAt: new Date().toISOString(),
//     };

//     if (body.name !== undefined) patch.name = body.name.trim();
//     if (body.companyName !== undefined) {
//       patch.companyName = body.companyName.trim() || null;
//     }
//     if (body.phone !== undefined) patch.phone = body.phone.trim();
//     if (body.email !== undefined) {
//       patch.email = body.email.trim() || null;
//     }
//     if (body.address !== undefined) {
//       patch.address = body.address.trim() || null;
//       patch.addressLine1 = body.address.trim() || null;
//     }
//     if (body.city !== undefined) patch.city = body.city.trim() || null;
//     if (body.state !== undefined) patch.state = body.state.trim() || null;
//     if (body.postalCode !== undefined) {
//       patch.postalCode = body.postalCode.trim() || null;
//     }
//     if (body.gstin !== undefined) {
//       patch.gstin = body.gstin.trim().toUpperCase() || null;
//     }
//     if (body.status !== undefined) patch.status = body.status;

//     await ref.set(patch, { merge: true });

//     const updated = await ref.get();
//     const record = normalizeSender(updated.id, updated.data() || {});

//     await writeAuditLog({
//       userId: user.userId,
//       action: "SENDER_UPDATE",
//       module: "LOGISTICS",
//       resourceType: "sender",
//       resourceId: record.senderId,
//       metadata: patch,
//     });

//     return successResponse(record, 200, "Sender updated.");
//   } catch (error) {
//     console.error("PATCH /api/logistics/senders failed", error);

//     return errorResponse(
//       "SENDER_UPDATE_FAILED",
//       error instanceof Error ? error.message : "Failed to update sender.",
//       500,
//     );
//   }
// }

// import { NextRequest } from "next/server";
// import type { DocumentData } from "firebase-admin/firestore";

// import { adminDb } from "@/lib/firebase-admin";
// import { getCurrentUser } from "@/lib/auth";
// import { can } from "@/lib/permissions";
// import { writeAuditLog } from "@/lib/audit";
// import { successResponse, errorResponse } from "@/lib/api-response";
// import { FIRESTORE_COLLECTIONS } from "@/utils/constants";
// import {
//   isValidEmail,
//   isValidPhone,
//   isValidIndianPinCode,
//   isValidGSTIN,
// } from "@/utils/validators";

// type SenderStatus = "ACTIVE" | "INACTIVE";

// type SenderRecord = {
//   id: string;
//   senderId: string;
//   name: string;
//   companyName?: string;
//   phone: string;
//   mobile?: string;
//   email?: string;
//   address?: string;
//   addressLine1?: string;
//   addressLine2?: string;
//   city?: string;
//   state?: string;
//   postalCode?: string;
//   country?: string;
//   gstin?: string;
//   iecNo?: string;
//   documentType?: string;
//   documentNo?: string;
//   contactName?: string;
//   status: SenderStatus;
//   createdAt: string;
//   updatedAt: string;
// };

// type CreateSenderBody = {
//   name?: string;
//   companyName?: string;
//   contactName?: string;
//   phone?: string;
//   mobile?: string;
//   email?: string;
//   address?: string;
//   addressLine1?: string;
//   addressLine2?: string;
//   city?: string;
//   state?: string;
//   postalCode?: string;
//   country?: string;
//   gstin?: string;
//   iecNo?: string;
//   documentType?: string;
//   documentNo?: string;
//   status?: SenderStatus;
// };

// type UpdateSenderBody = CreateSenderBody & {
//   senderId?: string;
// };

// function str(v: unknown): string {
//   if (v == null) return "";
//   return String(v).trim();
// }

// function normalizeSender(id: string, data: DocumentData): SenderRecord {
//   const statusRaw = String(data.status || "ACTIVE").toUpperCase();

//   const addressObj =
//     data.address && typeof data.address === "object"
//       ? (data.address as Record<string, unknown>)
//       : null;

//   const addressLine1 =
//     str(data.addressLine1) ||
//     str(addressObj?.addressLine1) ||
//     (typeof data.address === "string" ? str(data.address) : "");

//   return {
//     id,
//     senderId: str(data.senderId) || id,
//     name: str(data.name) || str(data.contactName),
//     companyName: str(data.companyName) || undefined,
//     contactName: str(data.contactName) || undefined,
//     phone: str(data.phone),
//     mobile: str(data.mobile) || undefined,
//     email: str(data.email) || undefined,
//     address: addressLine1 || undefined,
//     addressLine1: addressLine1 || undefined,
//     addressLine2: str(data.addressLine2) || undefined,
//     city: str(data.city) || str(addressObj?.city) || undefined,
//     state: str(data.state) || str(addressObj?.state) || undefined,
//     postalCode:
//       str(data.postalCode) || str(addressObj?.postalCode) || undefined,
//     country: str(data.country) || undefined,
//     gstin: str(data.gstin).toUpperCase() || undefined,
//     iecNo: str(data.iecNo) || undefined,
//     documentType: str(data.documentType) || undefined,
//     documentNo: str(data.documentNo) || undefined,
//     status: statusRaw === "INACTIVE" ? "INACTIVE" : "ACTIVE",
//     createdAt: str(data.createdAt) || new Date().toISOString(),
//     updatedAt:
//       str(data.updatedAt) ||
//       str(data.createdAt) ||
//       new Date().toISOString(),
//   };
// }

// function validatePayload(body: CreateSenderBody, partial = false) {
//   const errors: string[] = [];

//   if (!partial || body.name !== undefined) {
//     if (!body.name?.trim() && !body.contactName?.trim()) {
//       errors.push("Sender name is required.");
//     }
//   }

//   if (!partial || body.phone !== undefined) {
//     if (!body.phone?.trim()) {
//       errors.push("Phone is required.");
//     } else if (!isValidPhone(body.phone)) {
//       errors.push("Please enter a valid Indian phone number.");
//     }
//   }

//   if (body.email?.trim() && !isValidEmail(body.email)) {
//     errors.push("Please enter a valid email address.");
//   }

//   if (body.postalCode?.trim() && !isValidIndianPinCode(body.postalCode)) {
//     errors.push("Please enter a valid 6-digit PIN code.");
//   }

//   if (body.gstin?.trim() && !isValidGSTIN(body.gstin)) {
//     errors.push("Please enter a valid GSTIN.");
//   }

//   if (
//     body.status !== undefined &&
//     body.status !== "ACTIVE" &&
//     body.status !== "INACTIVE"
//   ) {
//     errors.push("Status must be ACTIVE or INACTIVE.");
//   }

//   return errors;
// }

// export async function GET(request: NextRequest) {
//   try {
//     const user = await getCurrentUser(request);

//     if (!user) {
//       return errorResponse("UNAUTHORIZED", "Authentication is required.", 401);
//     }

//     if (!can(user, "LOGISTICS_AWB_VIEW")) {
//       return errorResponse(
//         "FORBIDDEN",
//         "You do not have permission to view senders.",
//         403,
//       );
//     }

//     const { searchParams } = new URL(request.url);
//     const status = searchParams.get("status");
//     const q = searchParams.get("q")?.trim().toLowerCase();

//     const snapshot = await adminDb
//       .collection(FIRESTORE_COLLECTIONS.SENDERS)
//       .get();

//     let senders = snapshot.docs.map((doc) =>
//       normalizeSender(doc.id, doc.data()),
//     );

//     if (status === "ACTIVE" || status === "INACTIVE") {
//       senders = senders.filter((item) => item.status === status);
//     }

//     if (q) {
//       senders = senders.filter((item) =>
//         [
//           item.senderId,
//           item.name,
//           item.contactName,
//           item.companyName,
//           item.phone,
//           item.mobile,
//           item.email,
//           item.city,
//           item.state,
//           item.gstin,
//           item.country,
//         ]
//           .filter(Boolean)
//           .join(" ")
//           .toLowerCase()
//           .includes(q),
//       );
//     }

//     senders.sort((a, b) => a.name.localeCompare(b.name));

//     return successResponse(senders);
//   } catch (error) {
//     console.error("GET /api/logistics/senders failed", error);
//     return errorResponse(
//       "SENDERS_LIST_FAILED",
//       error instanceof Error ? error.message : "Failed to load senders.",
//       500,
//     );
//   }
// }

// export async function POST(request: NextRequest) {
//   try {
//     const user = await getCurrentUser(request);

//     if (!user) {
//       return errorResponse("UNAUTHORIZED", "Authentication is required.", 401);
//     }

//     if (!can(user, "LOGISTICS_AWB_CREATE")) {
//       return errorResponse(
//         "FORBIDDEN",
//         "You do not have permission to create senders.",
//         403,
//       );
//     }

//     let body: CreateSenderBody;
//     try {
//       body = (await request.json()) as CreateSenderBody;
//     } catch {
//       return errorResponse("INVALID_JSON", "Invalid JSON request body.", 400);
//     }

//     const errors = validatePayload(body, false);
//     if (errors.length > 0) {
//       return errorResponse("VALIDATION_ERROR", errors[0]!, 400);
//     }

//     const now = new Date().toISOString();
//     const ref = adminDb.collection(FIRESTORE_COLLECTIONS.SENDERS).doc();

//     const contactName =
//       str(body.contactName) || str(body.name);
//     const addressLine1 =
//       str(body.addressLine1) || str(body.address);

//     const record: SenderRecord = {
//       id: ref.id,
//       senderId: ref.id,
//       name: contactName,
//       contactName: contactName || undefined,
//       companyName: str(body.companyName) || undefined,
//       phone: str(body.phone),
//       mobile: str(body.mobile) || undefined,
//       email: str(body.email) || undefined,
//       address: addressLine1 || undefined,
//       addressLine1: addressLine1 || undefined,
//       addressLine2: str(body.addressLine2) || undefined,
//       city: str(body.city) || undefined,
//       state: str(body.state) || undefined,
//       postalCode: str(body.postalCode) || undefined,
//       country: str(body.country) || undefined,
//       gstin: str(body.gstin).toUpperCase() || undefined,
//       iecNo: str(body.iecNo) || undefined,
//       documentType: str(body.documentType) || undefined,
//       documentNo: str(body.documentNo) || undefined,
//       status: body.status === "INACTIVE" ? "INACTIVE" : "ACTIVE",
//       createdAt: now,
//       updatedAt: now,
//     };

//     await ref.set(record);

//     await writeAuditLog({
//       userId: user.userId,
//       action: "SENDER_CREATE",
//       module: "LOGISTICS",
//       resourceType: "sender",
//       resourceId: record.senderId,
//       metadata: { name: record.name, phone: record.phone },
//     });

//     return successResponse(record, 201, "Sender created.");
//   } catch (error) {
//     console.error("POST /api/logistics/senders failed", error);
//     return errorResponse(
//       "SENDER_CREATE_FAILED",
//       error instanceof Error ? error.message : "Failed to create sender.",
//       500,
//     );
//   }
// }

// export async function PATCH(request: NextRequest) {
//   try {
//     const user = await getCurrentUser(request);

//     if (!user) {
//       return errorResponse("UNAUTHORIZED", "Authentication is required.", 401);
//     }

//     if (!can(user, "LOGISTICS_AWB_UPDATE")) {
//       return errorResponse(
//         "FORBIDDEN",
//         "You do not have permission to update senders.",
//         403,
//       );
//     }

//     let body: UpdateSenderBody;
//     try {
//       body = (await request.json()) as UpdateSenderBody;
//     } catch {
//       return errorResponse("INVALID_JSON", "Invalid JSON request body.", 400);
//     }

//     const senderId = body.senderId?.trim();
//     if (!senderId) {
//       return errorResponse("SENDER_ID_REQUIRED", "senderId is required.", 400);
//     }

//     const errors = validatePayload(body, true);
//     if (errors.length > 0) {
//       return errorResponse("VALIDATION_ERROR", errors[0]!, 400);
//     }

//     const ref = adminDb
//       .collection(FIRESTORE_COLLECTIONS.SENDERS)
//       .doc(senderId);

//     const existing = await ref.get();
//     if (!existing.exists) {
//       return errorResponse("SENDER_NOT_FOUND", "Sender was not found.", 404);
//     }

//     const patch: Record<string, unknown> = {
//       updatedAt: new Date().toISOString(),
//     };

//     if (body.name !== undefined || body.contactName !== undefined) {
//       const n = str(body.contactName) || str(body.name);
//       if (n) {
//         patch.name = n;
//         patch.contactName = n;
//       }
//     }
//     if (body.companyName !== undefined) {
//       patch.companyName = str(body.companyName) || null;
//     }
//     if (body.phone !== undefined) patch.phone = str(body.phone);
//     if (body.mobile !== undefined) patch.mobile = str(body.mobile) || null;
//     if (body.email !== undefined) patch.email = str(body.email) || null;

//     if (body.address !== undefined || body.addressLine1 !== undefined) {
//       const a = str(body.addressLine1) || str(body.address);
//       patch.address = a || null;
//       patch.addressLine1 = a || null;
//     }
//     if (body.addressLine2 !== undefined) {
//       patch.addressLine2 = str(body.addressLine2) || null;
//     }
//     if (body.city !== undefined) patch.city = str(body.city) || null;
//     if (body.state !== undefined) patch.state = str(body.state) || null;
//     if (body.postalCode !== undefined) {
//       patch.postalCode = str(body.postalCode) || null;
//     }
//     if (body.country !== undefined) patch.country = str(body.country) || null;
//     if (body.gstin !== undefined) {
//       patch.gstin = str(body.gstin).toUpperCase() || null;
//     }
//     if (body.iecNo !== undefined) patch.iecNo = str(body.iecNo) || null;
//     if (body.documentType !== undefined) {
//       patch.documentType = str(body.documentType) || null;
//     }
//     if (body.documentNo !== undefined) {
//       patch.documentNo = str(body.documentNo) || null;
//     }
//     if (body.status !== undefined) patch.status = body.status;

//     await ref.set(patch, { merge: true });

//     const updated = await ref.get();
//     const record = normalizeSender(updated.id, updated.data() || {});

//     await writeAuditLog({
//       userId: user.userId,
//       action: "SENDER_UPDATE",
//       module: "LOGISTICS",
//       resourceType: "sender",
//       resourceId: record.senderId,
//       metadata: patch,
//     });

//     return successResponse(record, 200, "Sender updated.");
//   } catch (error) {
//     console.error("PATCH /api/logistics/senders failed", error);
//     return errorResponse(
//       "SENDER_UPDATE_FAILED",
//       error instanceof Error ? error.message : "Failed to update sender.",
//       500,
//     );
//   }
// }

import { NextRequest } from "next/server";
import type { DocumentData } from "firebase-admin/firestore";

import { adminDb } from "@/lib/firebase-admin";
import { getCurrentUser } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { writeAuditLog } from "@/lib/audit";
import { successResponse, errorResponse } from "@/lib/api-response";
import { FIRESTORE_COLLECTIONS } from "@/utils/constants";
import {
  isValidEmail,
  isValidPhone,
  isValidIndianPinCode,
  isValidGSTIN,
} from "@/utils/validators";

type SenderStatus = "ACTIVE" | "INACTIVE";

type SenderRecord = {
  id: string;
  senderId: string;
  name: string;
  companyName: string;
  contactName: string;
  phone: string;
  mobile: string | null;
  email: string | null;
  address: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: string | null;
  gstin: string | null;
  iecNo: string | null;
  documentType: string | null;
  documentNo: string | null;
  status: SenderStatus;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
};

type CreateSenderBody = {
  name?: string;
  companyName?: string;
  contactName?: string;
  phone?: string;
  mobile?: string;
  email?: string;
  address?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  gstin?: string;
  iecNo?: string;
  documentType?: string;
  documentNo?: string;
  status?: SenderStatus;
};

type UpdateSenderBody = CreateSenderBody & {
  senderId?: string;
};

function str(v: unknown): string {
  if (v == null) return "";
  return String(v).trim();
}

/** Never pass undefined into Firestore */
function cleanForFirestore(
  data: Record<string, unknown>,
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(data)) {
    if (v !== undefined) out[k] = v;
  }
  return out;
}

function optionalOrNull(v: unknown): string | null {
  const s = str(v);
  return s ? s : null;
}

// function normalizeSender(id: string, data: DocumentData): SenderRecord {
//   const statusRaw = String(data.status || "ACTIVE").toUpperCase();

//   const addressObj =
//     data.address && typeof data.address === "object"
//       ? (data.address as Record<string, unknown>)
//       : null;

//   const addressLine1 =
//     str(data.addressLine1) ||
//     str(addressObj?.addressLine1) ||
//     (typeof data.address === "string" ? str(data.address) : "");

//   const companyName = str(data.companyName);
//   const contactName =
//     str(data.contactName) || str(data.name) || companyName;

//   return {
//     id,
//     senderId: str(data.senderId) || id,
//     // name stays as contact for API compatibility; UI dropdown uses companyName
//     name: contactName,
//     companyName: companyName || contactName,
//     contactName,
//     phone: str(data.phone),
//     mobile: optionalOrNull(data.mobile),
//     email: optionalOrNull(data.email),
//     address: addressLine1 || null,
//     addressLine1: addressLine1 || null,
//     addressLine2: optionalOrNull(data.addressLine2),
//     city: optionalOrNull(data.city) || optionalOrNull(addressObj?.city),
//     state: optionalOrNull(data.state) || optionalOrNull(addressObj?.state),
//     postalCode:
//       optionalOrNull(data.postalCode) ||
//       optionalOrNull(addressObj?.postalCode),
//     country: optionalOrNull(data.country),
//     gstin: str(data.gstin).toUpperCase() || null,
//     iecNo: optionalOrNull(data.iecNo),
//     documentType: optionalOrNull(data.documentType),
//     documentNo: optionalOrNull(data.documentNo),
//     status: statusRaw === "INACTIVE" ? "INACTIVE" : "ACTIVE",
//     createdAt: str(data.createdAt) || new Date().toISOString(),
//     updatedAt:
//       str(data.updatedAt) ||
//       str(data.createdAt) ||
//       new Date().toISOString(),
//   };
// }

function normalizeSender(id: string, data: DocumentData): SenderRecord {
  const statusRaw = String(data.status || "ACTIVE").toUpperCase();

  const addressObj =
    data.address && typeof data.address === "object"
      ? (data.address as Record<string, unknown>)
      : null;

  const addressLine1 =
    str(data.addressLine1) ||
    str(addressObj?.addressLine1) ||
    (typeof data.address === "string" ? str(data.address) : "");

  // Keep company and contact separate — never copy contact into company
  const companyName = str(data.companyName);
  const contactName =
    str(data.contactName) || str(data.name) || "";

  return {
    id,
    senderId: str(data.senderId) || id,
    name: contactName || companyName,
    companyName, // may be "" if missing — UI should require it on create
    contactName: contactName || companyName,
    phone: str(data.phone),
    mobile: optionalOrNull(data.mobile),
    email: optionalOrNull(data.email),
    address: addressLine1 || null,
    addressLine1: addressLine1 || null,
    addressLine2: optionalOrNull(data.addressLine2),
    city: optionalOrNull(data.city) || optionalOrNull(addressObj?.city),
    state: optionalOrNull(data.state) || optionalOrNull(addressObj?.state),
    postalCode:
      optionalOrNull(data.postalCode) ||
      optionalOrNull(addressObj?.postalCode),
    country: optionalOrNull(data.country),
    gstin: str(data.gstin).toUpperCase() || null,
    iecNo: optionalOrNull(data.iecNo),
    documentType: optionalOrNull(data.documentType),
    documentNo: optionalOrNull(data.documentNo),
    status: statusRaw === "INACTIVE" ? "INACTIVE" : "ACTIVE",
    createdAt: str(data.createdAt) || new Date().toISOString(),
    updatedAt:
      str(data.updatedAt) ||
      str(data.createdAt) ||
      new Date().toISOString(),
  };
}

/** All fields required on create (partial=false). On update, only validate provided keys. */
function validatePayload(body: CreateSenderBody, partial = false) {
  const errors: string[] = [];

  const require = (ok: boolean, msg: string) => {
    if (!ok) errors.push(msg);
  };

  // if (!partial || body.companyName !== undefined) {
  //   require(!!str(body.companyName), "Company name is required.");
  // }

  if (!partial || body.contactName !== undefined || body.name !== undefined) {
    require(
      !!str(body.contactName) || !!str(body.name),
      "Contact name is required.",
    );
  }

  // if (!partial || body.phone !== undefined) {
  //   if (!str(body.phone)) {
  //     errors.push("Telephone is required.");
  //   } else if (!isValidPhone(body.phone!)) {
  //     errors.push("Please enter a valid Indian phone number.");
  //   }
  // }

  if (!partial || body.mobile !== undefined) {
    if (!str(body.mobile)) {
      errors.push("Mobile number is required.");
    } else if (!isValidPhone(body.mobile!)) {
      errors.push("Please enter a valid mobile number.");
    }
  }

  // if (!partial || body.email !== undefined) {
  //   if (!str(body.email)) {
  //     errors.push("Email is required.");
  //   } else if (!isValidEmail(body.email!)) {
  //     errors.push("Please enter a valid email address.");
  //   }
  // }

  const address1 = str(body.addressLine1) || str(body.address);
  if (!partial || body.address !== undefined || body.addressLine1 !== undefined) {
    require(!!address1, "Address 1 is required.");
  }

  // if (!partial || body.addressLine2 !== undefined) {
  //   require(!!str(body.addressLine2), "Address 2 is required.");
  // }

  if (!partial || body.city !== undefined) {
    require(!!str(body.city), "City is required.");
  }

  if (!partial || body.state !== undefined) {
    require(!!str(body.state), "State is required.");
  }

  if (!partial || body.postalCode !== undefined) {
    if (!str(body.postalCode)) {
      errors.push("Pincode is required.");
    } else if (!isValidIndianPinCode(body.postalCode!)) {
      errors.push("Please enter a valid 6-digit PIN code.");
    }
  }

  if (!partial || body.country !== undefined) {
    require(!!str(body.country), "Country is required.");
  }

  // if (!partial || body.gstin !== undefined) {
  //   if (!str(body.gstin)) {
  //     errors.push("GSTIN is required.");
  //   } else if (!isValidGSTIN(body.gstin!)) {
  //     errors.push("Please enter a valid GSTIN.");
  //   }
  // }

  // if (!partial || body.iecNo !== undefined) {
  //   require(!!str(body.iecNo), "IEC No. is required.");
  // }

  if (!partial || body.documentType !== undefined) {
    require(!!str(body.documentType), "Document type is required.");
  }

  if (!partial || body.documentNo !== undefined) {
    require(!!str(body.documentNo), "Document number is required.");
  }

  if (
    body.status !== undefined &&
    body.status !== "ACTIVE" &&
    body.status !== "INACTIVE"
  ) {
    errors.push("Status must be ACTIVE or INACTIVE.");
  }

  return errors;
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);

    if (!user) {
      return errorResponse("UNAUTHORIZED", "Authentication is required.", 401);
    }

    if (!can(user, "LOGISTICS_AWB_VIEW")) {
      return errorResponse(
        "FORBIDDEN",
        "You do not have permission to view senders.",
        403,
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const q = searchParams.get("q")?.trim().toLowerCase();

    const snapshot = await adminDb
      .collection(FIRESTORE_COLLECTIONS.SENDERS)
      .get();

    let senders = snapshot.docs.map((doc) =>
      normalizeSender(doc.id, doc.data()),
    );

    if (status === "ACTIVE" || status === "INACTIVE") {
      senders = senders.filter((item) => item.status === status);
    }

    if (q) {
      senders = senders.filter((item) =>
        [
          item.senderId,
          item.name,
          item.contactName,
          item.companyName,
          item.phone,
          item.mobile,
          item.email,
          item.city,
          item.state,
          item.gstin,
          item.country,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(q),
      );
    }

    // Sort by company name for dropdown UX
    senders.sort((a, b) =>
      (a.companyName || a.name).localeCompare(b.companyName || b.name),
    );

    return successResponse(senders);
  } catch (error) {
    console.error("GET /api/logistics/senders failed", error);
    return errorResponse(
      "SENDERS_LIST_FAILED",
      error instanceof Error ? error.message : "Failed to load senders.",
      500,
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);

    if (!user) {
      return errorResponse("UNAUTHORIZED", "Authentication is required.", 401);
    }

    if (!can(user, "LOGISTICS_AWB_CREATE")) {
      return errorResponse(
        "FORBIDDEN",
        "You do not have permission to create senders.",
        403,
      );
    }

    let body: CreateSenderBody;
    try {
      body = (await request.json()) as CreateSenderBody;
    } catch {
      return errorResponse("INVALID_JSON", "Invalid JSON request body.", 400);
    }

    const errors = validatePayload(body, false);
    if (errors.length > 0) {
      return errorResponse("VALIDATION_ERROR", errors[0]!, 400);
    }

    const now = new Date().toISOString();
    const ref = adminDb.collection(FIRESTORE_COLLECTIONS.SENDERS).doc();

    const companyName = str(body.companyName);
    const contactName = str(body.contactName) || str(body.name);
    const addressLine1 = str(body.addressLine1) || str(body.address);

    const record = cleanForFirestore({
      id: ref.id,
      senderId: ref.id,
      name: contactName,
      contactName,
      companyName,
      phone: str(body.phone),
      mobile: optionalOrNull(body.mobile),
      email: optionalOrNull(body.email),
      address: addressLine1 || null,
      addressLine1: addressLine1 || null,
      addressLine2: optionalOrNull(body.addressLine2),
      city: optionalOrNull(body.city),
      state: optionalOrNull(body.state),
      postalCode: optionalOrNull(body.postalCode),
      country: optionalOrNull(body.country),
      gstin: str(body.gstin).toUpperCase() || null,
      iecNo: optionalOrNull(body.iecNo),
      documentType: optionalOrNull(body.documentType),
      documentNo: optionalOrNull(body.documentNo),
      status: body.status === "INACTIVE" ? "INACTIVE" : "ACTIVE",
      createdAt: now,
      updatedAt: now,
      createdBy: user.userId,
    });

    await ref.set(record);

    await writeAuditLog({
      userId: user.userId,
      action: "SENDER_CREATE",
      module: "LOGISTICS",
      resourceType: "sender",
      resourceId: ref.id,
      metadata: {
        companyName,
        contactName,
        phone: str(body.phone),
      },
    });

    return successResponse(
      normalizeSender(ref.id, record),
      201,
      "Sender created.",
    );
  } catch (error) {
    console.error("POST /api/logistics/senders failed", error);
    return errorResponse(
      "SENDER_CREATE_FAILED",
      error instanceof Error ? error.message : "Failed to create sender.",
      500,
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);

    if (!user) {
      return errorResponse("UNAUTHORIZED", "Authentication is required.", 401);
    }

    if (!can(user, "LOGISTICS_AWB_UPDATE")) {
      return errorResponse(
        "FORBIDDEN",
        "You do not have permission to update senders.",
        403,
      );
    }

    let body: UpdateSenderBody;
    try {
      body = (await request.json()) as UpdateSenderBody;
    } catch {
      return errorResponse("INVALID_JSON", "Invalid JSON request body.", 400);
    }

    const senderId = body.senderId?.trim();
    if (!senderId) {
      return errorResponse("SENDER_ID_REQUIRED", "senderId is required.", 400);
    }

    const errors = validatePayload(body, true);
    if (errors.length > 0) {
      return errorResponse("VALIDATION_ERROR", errors[0]!, 400);
    }

    const ref = adminDb
      .collection(FIRESTORE_COLLECTIONS.SENDERS)
      .doc(senderId);

    const existing = await ref.get();
    if (!existing.exists) {
      return errorResponse("SENDER_NOT_FOUND", "Sender was not found.", 404);
    }

    const patch: Record<string, unknown> = {
      updatedAt: new Date().toISOString(),
      updatedBy: user.userId,
    };

    if (body.name !== undefined || body.contactName !== undefined) {
      const n = str(body.contactName) || str(body.name);
      if (n) {
        patch.name = n;
        patch.contactName = n;
      }
    }

    // if (body.companyName !== undefined) {
    //   const c = str(body.companyName);
    //   if (!c) {
    //     return errorResponse(
    //       "VALIDATION_ERROR",
    //       "Company name is required.",
    //       400,
    //     );
    //   }
    //   patch.companyName = c;
    // }

    // if (body.phone !== undefined) patch.phone = str(body.phone);
    if (body.mobile !== undefined) patch.mobile = optionalOrNull(body.mobile);
    // if (body.email !== undefined) patch.email = optionalOrNull(body.email);

    if (body.address !== undefined || body.addressLine1 !== undefined) {
      const a = str(body.addressLine1) || str(body.address);
      patch.address = a || null;
      patch.addressLine1 = a || null;
    }
    if (body.addressLine2 !== undefined) {
      patch.addressLine2 = optionalOrNull(body.addressLine2);
    }
    if (body.city !== undefined) patch.city = optionalOrNull(body.city);
    if (body.state !== undefined) patch.state = optionalOrNull(body.state);
    if (body.postalCode !== undefined) {
      patch.postalCode = optionalOrNull(body.postalCode);
    }
    if (body.country !== undefined) {
      patch.country = optionalOrNull(body.country);
    }
    if (body.gstin !== undefined) {
      patch.gstin = str(body.gstin).toUpperCase() || null;
    }
    if (body.iecNo !== undefined) patch.iecNo = optionalOrNull(body.iecNo);
    if (body.documentType !== undefined) {
      patch.documentType = optionalOrNull(body.documentType);
    }
    if (body.documentNo !== undefined) {
      patch.documentNo = optionalOrNull(body.documentNo);
    }
    if (body.status !== undefined) patch.status = body.status;

    await ref.set(cleanForFirestore(patch), { merge: true });

    const updated = await ref.get();
    const record = normalizeSender(updated.id, updated.data() || {});

    await writeAuditLog({
      userId: user.userId,
      action: "SENDER_UPDATE",
      module: "LOGISTICS",
      resourceType: "sender",
      resourceId: record.senderId,
      metadata: cleanForFirestore(patch),
    });

    return successResponse(record, 200, "Sender updated.");
  } catch (error) {
    console.error("PATCH /api/logistics/senders failed", error);
    return errorResponse(
      "SENDER_UPDATE_FAILED",
      error instanceof Error ? error.message : "Failed to update sender.",
      500,
    );
  }
}