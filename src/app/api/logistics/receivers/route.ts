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

// type ReceiverStatus = "ACTIVE" | "INACTIVE";

// type ReceiverRecord = {
//   id: string;
//   receiverId: string;
//   name: string;
//   companyName?: string;
//   phone: string;
//   email?: string;
//   address?: string;
//   city?: string;
//   state?: string;
//   postalCode?: string;
//   gstin?: string;
//   status: ReceiverStatus;
//   createdAt: string;
//   updatedAt: string;
// };

// type CreateReceiverBody = {
//   name?: string;
//   companyName?: string;
//   phone?: string;
//   email?: string;
//   address?: string;
//   city?: string;
//   state?: string;
//   postalCode?: string;
//   gstin?: string;
//   status?: ReceiverStatus;
// };

// type UpdateReceiverBody = CreateReceiverBody & {
//   receiverId?: string;
// };

// function normalizeReceiver(id: string, data: DocumentData): ReceiverRecord {
//   const statusRaw = String(data.status || "ACTIVE").toUpperCase();

//   const addressObj =
//     data.address && typeof data.address === "object"
//       ? (data.address as Record<string, unknown>)
//       : null;

//   return {
//     id,
//     receiverId: String(data.receiverId || id),
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

// // function validatePayload(body: CreateReceiverBody, partial = false) {
// //   const errors: string[] = [];

// //   if (!partial || body.name !== undefined) {
// //     if (!body.name?.trim()) {
// //       errors.push("Receiver name is required.");
// //     }
// //   }

// //   if (!partial || body.phone !== undefined) {
// //     if (!body.phone?.trim()) {
// //       errors.push("Phone is required.");
// //     } else if (!isValidPhone(body.phone)) {
// //       errors.push("Please enter a valid Indian phone number.");
// //     }
// //   }

// //   if (body.email?.trim() && !isValidEmail(body.email)) {
// //     errors.push("Please enter a valid email address.");
// //   }

// //   if (body.postalCode?.trim() && !isValidIndianPinCode(body.postalCode)) {
// //     errors.push("Please enter a valid 6-digit PIN code.");
// //   }

// //   if (body.gstin?.trim() && !isValidGSTIN(body.gstin)) {
// //     errors.push("Please enter a valid GSTIN.");
// //   }

// //   if (
// //     body.status !== undefined &&
// //     body.status !== "ACTIVE" &&
// //     body.status !== "INACTIVE"
// //   ) {
// //     errors.push("Status must be ACTIVE or INACTIVE.");
// //   }

// //   return errors;
// // }

// function validatePayload(body: CreateReceiverBody, partial = false) {
//   const errors: string[] = [];
//   const require = (ok: boolean, msg: string) => {
//     if (!ok) errors.push(msg);
//   };

//   if (!partial || body.companyName !== undefined) {
//     require(!!str(body.companyName), "Company name is required.");
//   }
//   if (!partial || body.contactName !== undefined || body.name !== undefined) {
//     require(
//       !!str(body.contactName) || !!str(body.name),
//       "Contact name is required.",
//     );
//   }

//   // Telephone OPTIONAL
//   if (body.phone?.trim() && !isValidPhone(body.phone)) {
//     errors.push("Please enter a valid Indian phone number.");
//   }

//   // Mobile required (or make optional if you prefer)
//   if (!partial || body.mobile !== undefined) {
//     if (!str(body.mobile)) {
//       errors.push("Mobile number is required.");
//     } else if (!isValidPhone(body.mobile!)) {
//       errors.push("Please enter a valid mobile number.");
//     }
//   }

//   if (!partial || body.email !== undefined) {
//     if (!str(body.email)) errors.push("Email is required.");
//     else if (!isValidEmail(body.email!))
//       errors.push("Please enter a valid email address.");
//   }

//   const address1 = str(body.addressLine1) || str(body.address);
//   if (!partial || body.address !== undefined || body.addressLine1 !== undefined) {
//     require(!!address1, "Address 1 is required.");
//   }
//   // Address 2 OPTIONAL — do not require

//   if (!partial || body.city !== undefined) require(!!str(body.city), "City is required.");
//   if (!partial || body.state !== undefined) require(!!str(body.state), "State is required.");

//   if (!partial || body.postalCode !== undefined) {
//     if (!str(body.postalCode)) errors.push("Pincode is required.");
//     else if (!isValidIndianPinCode(body.postalCode!))
//       errors.push("Please enter a valid 6-digit PIN code.");
//   }

//   if (!partial || body.country !== undefined) {
//     require(!!str(body.country), "Country is required.");
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
//         "You do not have permission to view receivers.",
//         403,
//       );
//     }

//     const { searchParams } = new URL(request.url);
//     const status = searchParams.get("status");
//     const q = searchParams.get("q")?.trim().toLowerCase();

//     const snapshot = await adminDb
//       .collection(FIRESTORE_COLLECTIONS.RECEIVERS)
//       .get();

//     let receivers = snapshot.docs.map((doc) =>
//       normalizeReceiver(doc.id, doc.data()),
//     );

//     if (status === "ACTIVE" || status === "INACTIVE") {
//       receivers = receivers.filter((item) => item.status === status);
//     }

//     if (q) {
//       receivers = receivers.filter((item) =>
//         [
//           item.receiverId,
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

//     receivers.sort((a, b) => a.name.localeCompare(b.name));

//     return successResponse(receivers);
//   } catch (error) {
//     console.error("GET /api/logistics/receivers failed", error);

//     return errorResponse(
//       "RECEIVERS_LIST_FAILED",
//       error instanceof Error ? error.message : "Failed to load receivers.",
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
//         "You do not have permission to create receivers.",
//         403,
//       );
//     }

//     let body: CreateReceiverBody;

//     try {
//       body = (await request.json()) as CreateReceiverBody;
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
//     const ref = adminDb.collection(FIRESTORE_COLLECTIONS.RECEIVERS).doc();

//     const record: ReceiverRecord = {
//       id: ref.id,
//       receiverId: ref.id,
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
//       action: "RECEIVER_CREATE",
//       module: "LOGISTICS",
//       resourceType: "receiver",
//       resourceId: record.receiverId,
//       metadata: {
//         name: record.name,
//         phone: record.phone,
//       },
//     });

//     return successResponse(record, 201, "Receiver created.");
//   } catch (error) {
//     console.error("POST /api/logistics/receivers failed", error);

//     return errorResponse(
//       "RECEIVER_CREATE_FAILED",
//       error instanceof Error ? error.message : "Failed to create receiver.",
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
//         "You do not have permission to update receivers.",
//         403,
//       );
//     }

//     let body: UpdateReceiverBody;

//     try {
//       body = (await request.json()) as UpdateReceiverBody;
//     } catch {
//       return errorResponse(
//         "INVALID_JSON",
//         "Invalid JSON request body.",
//         400,
//       );
//     }

//     const receiverId = body.receiverId?.trim();

//     if (!receiverId) {
//       return errorResponse(
//         "RECEIVER_ID_REQUIRED",
//         "receiverId is required.",
//         400,
//       );
//     }

//     const errors = validatePayload(body, true);

//     if (errors.length > 0) {
//       return errorResponse("VALIDATION_ERROR", errors[0]!, 400);
//     }

//     const ref = adminDb
//       .collection(FIRESTORE_COLLECTIONS.RECEIVERS)
//       .doc(receiverId);

//     const existing = await ref.get();

//     if (!existing.exists) {
//       return errorResponse(
//         "RECEIVER_NOT_FOUND",
//         "Receiver was not found.",
//         404,
//       );
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
//     const record = normalizeReceiver(updated.id, updated.data() || {});

//     await writeAuditLog({
//       userId: user.userId,
//       action: "RECEIVER_UPDATE",
//       module: "LOGISTICS",
//       resourceType: "receiver",
//       resourceId: record.receiverId,
//       metadata: patch,
//     });

//     return successResponse(record, 200, "Receiver updated.");
//   } catch (error) {
//     console.error("PATCH /api/logistics/receivers failed", error);

//     return errorResponse(
//       "RECEIVER_UPDATE_FAILED",
//       error instanceof Error ? error.message : "Failed to update receiver.",
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

// type ReceiverStatus = "ACTIVE" | "INACTIVE";

// type ReceiverRecord = {
//   id: string;
//   receiverId: string;
//   name: string;
//   contactName: string;
//   companyName: string;
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
//   documentUrl?: string;
//   status: ReceiverStatus;
//   createdAt: string;
//   updatedAt: string;
// };

// type CreateReceiverBody = {
//   name?: string;
//   contactName?: string;
//   companyName?: string;
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
//   documentUrl?: string;
//   status?: ReceiverStatus;
// };

// type UpdateReceiverBody = CreateReceiverBody & {
//   receiverId?: string;
// };

// function str(v: unknown): string {
//   return String(v ?? "").trim();
// }

// function normalizeReceiver(id: string, data: DocumentData): ReceiverRecord {
//   const statusRaw = String(data.status || "ACTIVE").toUpperCase();
//   const companyName = str(data.companyName);
//   const contactName = str(data.contactName) || str(data.name);

//   const addressObj =
//     data.address && typeof data.address === "object"
//       ? (data.address as Record<string, unknown>)
//       : null;

//   const addressLine1 =
//     str(data.addressLine1) ||
//     (addressObj ? str(addressObj.addressLine1) : "") ||
//     (typeof data.address === "string" ? str(data.address) : "");

//   return {
//     id,
//     receiverId: str(data.receiverId) || id,
//     name: contactName,
//     contactName,
//     companyName,
//     phone: str(data.phone),
//     mobile: str(data.mobile) || undefined,
//     email: str(data.email) || undefined,
//     address: addressLine1 || undefined,
//     addressLine1: addressLine1 || undefined,
//     addressLine2: str(data.addressLine2) || undefined,
//     city:
//       str(data.city) ||
//       (addressObj ? str(addressObj.city) : "") ||
//       undefined,
//     state:
//       str(data.state) ||
//       (addressObj ? str(addressObj.state) : "") ||
//       undefined,
//     postalCode:
//       str(data.postalCode) ||
//       (addressObj ? str(addressObj.postalCode) : "") ||
//       undefined,
//     country: str(data.country) || undefined,
//     gstin: str(data.gstin).toUpperCase() || undefined,
//     iecNo: str(data.iecNo) || undefined,
//     documentType: str(data.documentType) || undefined,
//     documentNo: str(data.documentNo) || undefined,
//     documentUrl: str(data.documentUrl) || undefined,
//     status: statusRaw === "INACTIVE" ? "INACTIVE" : "ACTIVE",
//     createdAt: String(data.createdAt || new Date().toISOString()),
//     updatedAt: String(
//       data.updatedAt || data.createdAt || new Date().toISOString(),
//     ),
//   };
// }

// function validatePayload(body: CreateReceiverBody, partial = false) {
//   const errors: string[] = [];
//   const require = (ok: boolean, msg: string) => {
//     if (!ok) errors.push(msg);
//   };

//   if (!partial || body.companyName !== undefined) {
//     require(!!str(body.companyName), "Company name is required.");
//   }

//   if (!partial || body.contactName !== undefined || body.name !== undefined) {
//     require(
//       !!str(body.contactName) || !!str(body.name),
//       "Contact name is required.",
//     );
//   }

//   // Telephone OPTIONAL
//   if (body.phone?.trim() && !isValidPhone(body.phone)) {
//     errors.push("Please enter a valid Indian phone number.");
//   }

//   // Mobile required
//   if (!partial || body.mobile !== undefined) {
//     if (!str(body.mobile)) {
//       errors.push("Mobile number is required.");
//     } else if (!isValidPhone(body.mobile!)) {
//       errors.push("Please enter a valid mobile number.");
//     }
//   }

//   if (!partial || body.email !== undefined) {
//     if (!str(body.email)) errors.push("Email is required.");
//     else if (!isValidEmail(body.email!))
//       errors.push("Please enter a valid email address.");
//   }

//   const address1 = str(body.addressLine1) || str(body.address);
//   if (
//     !partial ||
//     body.address !== undefined ||
//     body.addressLine1 !== undefined
//   ) {
//     require(!!address1, "Address 1 is required.");
//   }
//   // Address 2 OPTIONAL

//   if (!partial || body.city !== undefined) {
//     require(!!str(body.city), "City is required.");
//   }
//   if (!partial || body.state !== undefined) {
//     require(!!str(body.state), "State is required.");
//   }

//   if (!partial || body.postalCode !== undefined) {
//     if (!str(body.postalCode)) errors.push("Pincode is required.");
//     else if (!isValidIndianPinCode(body.postalCode!))
//       errors.push("Please enter a valid 6-digit PIN code.");
//   }

//   if (!partial || body.country !== undefined) {
//     require(!!str(body.country), "Country is required.");
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
//         "You do not have permission to view receivers.",
//         403,
//       );
//     }

//     const { searchParams } = new URL(request.url);
//     const status = searchParams.get("status");
//     const q = searchParams.get("q")?.trim().toLowerCase();

//     const snapshot = await adminDb
//       .collection(FIRESTORE_COLLECTIONS.RECEIVERS)
//       .get();

//     let receivers = snapshot.docs.map((doc) =>
//       normalizeReceiver(doc.id, doc.data()),
//     );

//     if (status === "ACTIVE" || status === "INACTIVE") {
//       receivers = receivers.filter((item) => item.status === status);
//     }

//     if (q) {
//       receivers = receivers.filter((item) =>
//         [
//           item.receiverId,
//           item.name,
//           item.contactName,
//           item.companyName,
//           item.phone,
//           item.mobile,
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

//     receivers.sort((a, b) =>
//       (a.companyName || a.name).localeCompare(b.companyName || b.name),
//     );

//     return successResponse(receivers);
//   } catch (error) {
//     console.error("GET /api/logistics/receivers failed", error);
//     return errorResponse(
//       "RECEIVERS_LIST_FAILED",
//       error instanceof Error ? error.message : "Failed to load receivers.",
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
//         "You do not have permission to create receivers.",
//         403,
//       );
//     }

//     let body: CreateReceiverBody;
//     try {
//       body = (await request.json()) as CreateReceiverBody;
//     } catch {
//       return errorResponse("INVALID_JSON", "Invalid JSON request body.", 400);
//     }

//     const errors = validatePayload(body, false);
//     if (errors.length > 0) {
//       return errorResponse("VALIDATION_ERROR", errors[0]!, 400);
//     }

//     const now = new Date().toISOString();
//     const ref = adminDb.collection(FIRESTORE_COLLECTIONS.RECEIVERS).doc();
//     const contactName = str(body.contactName) || str(body.name);
//     const address1 = str(body.addressLine1) || str(body.address);

//     const record: ReceiverRecord = {
//       id: ref.id,
//       receiverId: ref.id,
//       name: contactName,
//       contactName,
//       companyName: str(body.companyName),
//       phone: str(body.phone),
//       mobile: str(body.mobile) || undefined,
//       email: str(body.email) || undefined,
//       address: address1 || undefined,
//       addressLine1: address1 || undefined,
//       addressLine2: str(body.addressLine2) || undefined,
//       city: str(body.city) || undefined,
//       state: str(body.state) || undefined,
//       postalCode: str(body.postalCode) || undefined,
//       country: str(body.country) || undefined,
//       gstin: str(body.gstin).toUpperCase() || undefined,
//       iecNo: str(body.iecNo) || undefined,
//       documentType: str(body.documentType) || undefined,
//       documentNo: str(body.documentNo) || undefined,
//       documentUrl: str(body.documentUrl) || undefined,
//       status: body.status === "INACTIVE" ? "INACTIVE" : "ACTIVE",
//       createdAt: now,
//       updatedAt: now,
//     };

//     await ref.set({
//       ...record,
//       addressLine1: record.addressLine1 || null,
//       addressLine2: record.addressLine2 || null,
//       phone: record.phone || null,
//       mobile: record.mobile || null,
//     });

//     await writeAuditLog({
//       userId: user.userId,
//       action: "RECEIVER_CREATE",
//       module: "LOGISTICS",
//       resourceType: "receiver",
//       resourceId: record.receiverId,
//       metadata: { name: record.name, companyName: record.companyName },
//     });

//     return successResponse(record, 201, "Receiver created.");
//   } catch (error) {
//     console.error("POST /api/logistics/receivers failed", error);
//     return errorResponse(
//       "RECEIVER_CREATE_FAILED",
//       error instanceof Error ? error.message : "Failed to create receiver.",
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
//         "You do not have permission to update receivers.",
//         403,
//       );
//     }

//     let body: UpdateReceiverBody;
//     try {
//       body = (await request.json()) as UpdateReceiverBody;
//     } catch {
//       return errorResponse("INVALID_JSON", "Invalid JSON request body.", 400);
//     }

//     const receiverId = body.receiverId?.trim();
//     if (!receiverId) {
//       return errorResponse(
//         "RECEIVER_ID_REQUIRED",
//         "receiverId is required.",
//         400,
//       );
//     }

//     const errors = validatePayload(body, true);
//     if (errors.length > 0) {
//       return errorResponse("VALIDATION_ERROR", errors[0]!, 400);
//     }

//     const ref = adminDb
//       .collection(FIRESTORE_COLLECTIONS.RECEIVERS)
//       .doc(receiverId);
//     const existing = await ref.get();
//     if (!existing.exists) {
//       return errorResponse("RECEIVER_NOT_FOUND", "Receiver was not found.", 404);
//     }

//     const patch: Record<string, unknown> = {
//       updatedAt: new Date().toISOString(),
//     };

//     if (body.contactName !== undefined || body.name !== undefined) {
//       const contact = str(body.contactName) || str(body.name);
//       patch.contactName = contact;
//       patch.name = contact;
//     }
//     if (body.companyName !== undefined) {
//       patch.companyName = str(body.companyName) || null;
//     }
//     if (body.phone !== undefined) patch.phone = str(body.phone) || null;
//     if (body.mobile !== undefined) patch.mobile = str(body.mobile) || null;
//     if (body.email !== undefined) patch.email = str(body.email) || null;
//     if (body.address !== undefined || body.addressLine1 !== undefined) {
//       const a1 = str(body.addressLine1) || str(body.address);
//       patch.address = a1 || null;
//       patch.addressLine1 = a1 || null;
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
//     if (body.documentUrl !== undefined) {
//       patch.documentUrl = str(body.documentUrl) || null;
//     }
//     if (body.status !== undefined) patch.status = body.status;

//     await ref.set(patch, { merge: true });

//     const updated = await ref.get();
//     const record = normalizeReceiver(updated.id, updated.data() || {});

//     await writeAuditLog({
//       userId: user.userId,
//       action: "RECEIVER_UPDATE",
//       module: "LOGISTICS",
//       resourceType: "receiver",
//       resourceId: record.receiverId,
//       metadata: patch,
//     });

//     return successResponse(record, 200, "Receiver updated.");
//   } catch (error) {
//     console.error("PATCH /api/logistics/receivers failed", error);
//     return errorResponse(
//       "RECEIVER_UPDATE_FAILED",
//       error instanceof Error ? error.message : "Failed to update receiver.",
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

type ReceiverStatus = "ACTIVE" | "INACTIVE";

type ReceiverRecord = {
  id: string;
  receiverId: string;
  name: string;
  contactName: string;
  companyName: string;
  phone: string;
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
  documentUrl?: string;
  status: ReceiverStatus;
  createdAt: string;
  updatedAt: string;
};

type CreateReceiverBody = {
  name?: string;
  contactName?: string;
  companyName?: string;
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
  documentUrl?: string;
  status?: ReceiverStatus;
};

type UpdateReceiverBody = CreateReceiverBody & {
  receiverId?: string;
};

function str(v: unknown): string {
  return String(v ?? "").trim();
}

function isIndia(country?: string): boolean {
  const c = str(country).toUpperCase();
  return !c || c === "INDIA" || c === "IN" || c === "IND";
}

/** Allow Indian 10-digit or general international (8–15 digits). */
function isValidMobileLoose(phone: string, country?: string): boolean {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return false;
  if (isIndia(country)) return isValidPhone(phone);
  return digits.length >= 8 && digits.length <= 15;
}

function normalizeReceiver(id: string, data: DocumentData): ReceiverRecord {
  const statusRaw = String(data.status || "ACTIVE").toUpperCase();
  const companyName = str(data.companyName);
  const contactName = str(data.contactName) || str(data.name);

  const addressObj =
    data.address && typeof data.address === "object"
      ? (data.address as Record<string, unknown>)
      : null;

  const addressLine1 =
    str(data.addressLine1) ||
    (addressObj ? str(addressObj.addressLine1) : "") ||
    (typeof data.address === "string" ? str(data.address) : "");

  return {
    id,
    receiverId: str(data.receiverId) || id,
    name: contactName,
    contactName,
    companyName,
    phone: str(data.phone),
    mobile: str(data.mobile) || undefined,
    email: str(data.email) || undefined,
    address: addressLine1 || undefined,
    addressLine1: addressLine1 || undefined,
    addressLine2: str(data.addressLine2) || undefined,
    city:
      str(data.city) ||
      (addressObj ? str(addressObj.city) : "") ||
      undefined,
    state:
      str(data.state) ||
      (addressObj ? str(addressObj.state) : "") ||
      undefined,
    postalCode:
      str(data.postalCode) ||
      (addressObj ? str(addressObj.postalCode) : "") ||
      undefined,
    country: str(data.country) || undefined,
    gstin: str(data.gstin).toUpperCase() || undefined,
    iecNo: str(data.iecNo) || undefined,
    documentType: str(data.documentType) || undefined,
    documentNo: str(data.documentNo) || undefined,
    documentUrl: str(data.documentUrl) || undefined,
    status: statusRaw === "INACTIVE" ? "INACTIVE" : "ACTIVE",
    createdAt: String(data.createdAt || new Date().toISOString()),
    updatedAt: String(
      data.updatedAt || data.createdAt || new Date().toISOString(),
    ),
  };
}

function validatePayload(body: CreateReceiverBody, partial = false) {
  const errors: string[] = [];
  const require = (ok: boolean, msg: string) => {
    if (!ok) errors.push(msg);
  };

  const country = str(body.country) || undefined;

  // if (!partial || body.companyName !== undefined) {
  //   require(!!str(body.companyName), "Company name is required.");
  // }

  if (!partial || body.contactName !== undefined || body.name !== undefined) {
    require(
      !!str(body.contactName) || !!str(body.name),
      "Contact name is required.",
    );
  }

  // Telephone OPTIONAL — validate only if provided
  if (str(body.phone)) {
    if (!isValidMobileLoose(body.phone!, country)) {
      errors.push("Please enter a valid telephone number.");
    }
  }

  // Mobile required on full create; on partial only if field is sent
  if (!partial || body.mobile !== undefined) {
    if (!str(body.mobile)) {
      errors.push("Mobile number is required.");
    } else if (!isValidMobileLoose(body.mobile!, country)) {
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
  if (
    !partial ||
    body.address !== undefined ||
    body.addressLine1 !== undefined
  ) {
    require(!!address1, "Address 1 is required.");
  }
  // Address 2 OPTIONAL — never required

  if (!partial || body.city !== undefined) {
    require(!!str(body.city), "City is required.");
  }
  if (!partial || body.state !== undefined) {
    require(!!str(body.state), "State is required.");
  }

  if (!partial || body.postalCode !== undefined) {
    if (!str(body.postalCode)) {
      errors.push("Pincode is required.");
    } else if (
      isIndia(country) &&
      !isValidIndianPinCode(body.postalCode!)
    ) {
      // Only enforce 6-digit Indian PIN when country is India
      errors.push("Please enter a valid 6-digit PIN code.");
    }
  }

  if (!partial || body.country !== undefined) {
    require(!!str(body.country), "Country is required.");
  }

  // if (str(body.gstin) && !isValidGSTIN(body.gstin!)) {
  //   errors.push("Please enter a valid GSTIN.");
  // }

  if (
    body.status !== undefined &&
    body.status !== "ACTIVE" &&
    body.status !== "INACTIVE"
  ) {
    errors.push("Status must be ACTIVE or INACTIVE.");
  }

  return errors;
}

/** True when PATCH body is only status (Enable/Disable). */
function isStatusOnlyPatch(body: UpdateReceiverBody): boolean {
  const keys = Object.keys(body).filter(
    (k) => k !== "receiverId" && (body as Record<string, unknown>)[k] !== undefined,
  );
  return keys.length === 1 && keys[0] === "status";
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
        "You do not have permission to view receivers.",
        403,
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const q = searchParams.get("q")?.trim().toLowerCase();

    const snapshot = await adminDb
      .collection(FIRESTORE_COLLECTIONS.RECEIVERS || "receivers")
      .get();

    let receivers = snapshot.docs.map((doc) =>
      normalizeReceiver(doc.id, doc.data()),
    );

    if (status === "ACTIVE" || status === "INACTIVE") {
      receivers = receivers.filter((item) => item.status === status);
    }

    if (q) {
      receivers = receivers.filter((item) =>
        [
          item.receiverId,
          item.name,
          item.contactName,
          item.companyName,
          item.phone,
          item.mobile,
          item.email,
          item.city,
          item.state,
          item.gstin,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(q),
      );
    }

    receivers.sort((a, b) =>
      (a.companyName || a.name).localeCompare(b.companyName || b.name),
    );

    return successResponse(receivers);
  } catch (error) {
    console.error("GET /api/logistics/receivers failed", error);
    return errorResponse(
      "RECEIVERS_LIST_FAILED",
      error instanceof Error ? error.message : "Failed to load receivers.",
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
        "You do not have permission to create receivers.",
        403,
      );
    }

    let body: CreateReceiverBody;
    try {
      body = (await request.json()) as CreateReceiverBody;
    } catch {
      return errorResponse("INVALID_JSON", "Invalid JSON request body.", 400);
    }

    const errors = validatePayload(body, false);
    if (errors.length > 0) {
      return errorResponse("VALIDATION_ERROR", errors[0]!, 400);
    }

    const now = new Date().toISOString();
    const ref = adminDb
      .collection(FIRESTORE_COLLECTIONS.RECEIVERS || "receivers")
      .doc();
    const contactName = str(body.contactName) || str(body.name);
    const address1 = str(body.addressLine1) || str(body.address);

    const record: ReceiverRecord = {
      id: ref.id,
      receiverId: ref.id,
      name: contactName,
      contactName,
      companyName: str(body.companyName),
      phone: str(body.phone),
      mobile: str(body.mobile) || undefined,
      email: str(body.email) || undefined,
      address: address1 || undefined,
      addressLine1: address1 || undefined,
      addressLine2: str(body.addressLine2) || undefined,
      city: str(body.city) || undefined,
      state: str(body.state) || undefined,
      postalCode: str(body.postalCode) || undefined,
      country: str(body.country) || undefined,
      gstin: str(body.gstin).toUpperCase() || undefined,
      iecNo: str(body.iecNo) || undefined,
      documentType: str(body.documentType) || undefined,
      documentNo: str(body.documentNo) || undefined,
      documentUrl: str(body.documentUrl) || undefined,
      status: body.status === "INACTIVE" ? "INACTIVE" : "ACTIVE",
      createdAt: now,
      updatedAt: now,
    };

    await ref.set({
      ...record,
      addressLine1: record.addressLine1 || null,
      addressLine2: record.addressLine2 || null,
      phone: record.phone || null,
      mobile: record.mobile || null,
      email: record.email || null,
      gstin: record.gstin || null,
      iecNo: record.iecNo || null,
      documentType: record.documentType || null,
      documentNo: record.documentNo || null,
      documentUrl: record.documentUrl || null,
    });

    await writeAuditLog({
      userId: user.userId,
      action: "RECEIVER_CREATE",
      module: "LOGISTICS",
      resourceType: "receiver",
      resourceId: record.receiverId,
      metadata: { name: record.name, companyName: record.companyName },
    });

    return successResponse(record, 201, "Receiver created.");
  } catch (error) {
    console.error("POST /api/logistics/receivers failed", error);
    return errorResponse(
      "RECEIVER_CREATE_FAILED",
      error instanceof Error ? error.message : "Failed to create receiver.",
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
        "You do not have permission to update receivers.",
        403,
      );
    }

    let body: UpdateReceiverBody;
    try {
      body = (await request.json()) as UpdateReceiverBody;
    } catch {
      return errorResponse("INVALID_JSON", "Invalid JSON request body.", 400);
    }

    const receiverId = body.receiverId?.trim();
    if (!receiverId) {
      return errorResponse(
        "RECEIVER_ID_REQUIRED",
        "receiverId is required.",
        400,
      );
    }

    // Enable/Disable only — skip full field validation
    if (!isStatusOnlyPatch(body)) {
      const errors = validatePayload(body, true);
      if (errors.length > 0) {
        return errorResponse("VALIDATION_ERROR", errors[0]!, 400);
      }
    } else if (
      body.status !== "ACTIVE" &&
      body.status !== "INACTIVE"
    ) {
      return errorResponse(
        "VALIDATION_ERROR",
        "Status must be ACTIVE or INACTIVE.",
        400,
      );
    }

    const ref = adminDb
      .collection(FIRESTORE_COLLECTIONS.RECEIVERS || "receivers")
      .doc(receiverId);
    const existing = await ref.get();
    if (!existing.exists) {
      return errorResponse(
        "RECEIVER_NOT_FOUND",
        "Receiver was not found.",
        404,
      );
    }

    const patch: Record<string, unknown> = {
      updatedAt: new Date().toISOString(),
    };

    if (body.contactName !== undefined || body.name !== undefined) {
      const contact = str(body.contactName) || str(body.name);
      patch.contactName = contact;
      patch.name = contact;
    }
    if (body.companyName !== undefined) {
      patch.companyName = str(body.companyName) || null;
    }
    if (body.phone !== undefined) patch.phone = str(body.phone) || null;
    if (body.mobile !== undefined) patch.mobile = str(body.mobile) || null;
    if (body.email !== undefined) patch.email = str(body.email) || null;
    if (body.address !== undefined || body.addressLine1 !== undefined) {
      const a1 = str(body.addressLine1) || str(body.address);
      patch.address = a1 || null;
      patch.addressLine1 = a1 || null;
    }
    if (body.addressLine2 !== undefined) {
      patch.addressLine2 = str(body.addressLine2) || null;
    }
    if (body.city !== undefined) patch.city = str(body.city) || null;
    if (body.state !== undefined) patch.state = str(body.state) || null;
    if (body.postalCode !== undefined) {
      patch.postalCode = str(body.postalCode) || null;
    }
    if (body.country !== undefined) patch.country = str(body.country) || null;
    if (body.gstin !== undefined) {
      patch.gstin = str(body.gstin).toUpperCase() || null;
    }
    if (body.iecNo !== undefined) patch.iecNo = str(body.iecNo) || null;
    if (body.documentType !== undefined) {
      patch.documentType = str(body.documentType) || null;
    }
    if (body.documentNo !== undefined) {
      patch.documentNo = str(body.documentNo) || null;
    }
    if (body.documentUrl !== undefined) {
      patch.documentUrl = str(body.documentUrl) || null;
    }
    if (body.status !== undefined) patch.status = body.status;

    await ref.set(patch, { merge: true });

    const updated = await ref.get();
    const record = normalizeReceiver(updated.id, updated.data() || {});

    await writeAuditLog({
      userId: user.userId,
      action: "RECEIVER_UPDATE",
      module: "LOGISTICS",
      resourceType: "receiver",
      resourceId: record.receiverId,
      metadata: patch,
    });

    return successResponse(record, 200, "Receiver updated.");
  } catch (error) {
    console.error("PATCH /api/logistics/receivers failed", error);
    return errorResponse(
      "RECEIVER_UPDATE_FAILED",
      error instanceof Error ? error.message : "Failed to update receiver.",
      500,
    );
  }
}