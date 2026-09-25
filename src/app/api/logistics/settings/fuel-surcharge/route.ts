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

// type FuelStatus = "Active" | "Inactive";

// type FuelConfig = {
//   name: string;
//   effectiveFrom: string;
//   percentage: string;
//   minimumCharge: string;
//   maximumCharge: string;
//   status: FuelStatus;
//   updatedAt?: string;
//   updatedBy?: string;
// };

// const DOC_ID = "fuelSurcharge";

// const DEFAULT_CONFIG: FuelConfig = {
//   name: "Standard",
//   effectiveFrom: "",
//   percentage: "",
//   minimumCharge: "",
//   maximumCharge: "",
//   status: "Active",
// };

// function configRef() {
//   return adminDb
//     .collection(FIRESTORE_COLLECTIONS.SETTINGS || "settings")
//     .doc(DOC_ID);
// }

// function normalizeConfig(data?: DocumentData | null): FuelConfig {
//   const raw = data || {};
//   const statusRaw = String(raw.status || "Active");

//   return {
//     name: String(raw.name || DEFAULT_CONFIG.name).trim() || "Standard",
//     effectiveFrom: String(raw.effectiveFrom || "").trim(),
//     percentage: String(
//       raw.percentage !== undefined && raw.percentage !== null
//         ? raw.percentage
//         : "",
//     ).trim(),
//     minimumCharge: String(
//       raw.minimumCharge !== undefined && raw.minimumCharge !== null
//         ? raw.minimumCharge
//         : "",
//     ).trim(),
//     maximumCharge: String(
//       raw.maximumCharge !== undefined && raw.maximumCharge !== null
//         ? raw.maximumCharge
//         : "",
//     ).trim(),
//     status: statusRaw === "Inactive" ? "Inactive" : "Active",
//     updatedAt: raw.updatedAt ? String(raw.updatedAt) : undefined,
//     updatedBy: raw.updatedBy ? String(raw.updatedBy) : undefined,
//   };
// }

// function validateConfig(config: Partial<FuelConfig>): string[] {
//   const errors: string[] = [];

//   if (!config.name?.trim()) {
//     errors.push("Configuration name is required.");
//   }

//   if (config.percentage !== undefined && String(config.percentage).trim() !== "") {
//     const percentage = Number(config.percentage);
//     if (!Number.isFinite(percentage) || percentage < 0) {
//       errors.push("Percentage must be a valid non-negative number.");
//     }
//   }

//   if (
//     config.minimumCharge !== undefined &&
//     String(config.minimumCharge).trim() !== ""
//   ) {
//     const min = Number(config.minimumCharge);
//     if (!Number.isFinite(min) || min < 0) {
//       errors.push("Minimum charge must be a valid non-negative number.");
//     }
//   }

//   if (
//     config.maximumCharge !== undefined &&
//     String(config.maximumCharge).trim() !== ""
//   ) {
//     const max = Number(config.maximumCharge);
//     if (!Number.isFinite(max) || max < 0) {
//       errors.push("Maximum charge must be a valid non-negative number.");
//     }
//   }

//   const minVal =
//     config.minimumCharge && String(config.minimumCharge).trim() !== ""
//       ? Number(config.minimumCharge)
//       : null;
//   const maxVal =
//     config.maximumCharge && String(config.maximumCharge).trim() !== ""
//       ? Number(config.maximumCharge)
//       : null;

//   if (
//     minVal !== null &&
//     maxVal !== null &&
//     Number.isFinite(minVal) &&
//     Number.isFinite(maxVal) &&
//     maxVal < minVal
//   ) {
//     errors.push("Maximum charge cannot be less than minimum charge.");
//   }

//   if (
//     config.status !== undefined &&
//     config.status !== "Active" &&
//     config.status !== "Inactive"
//   ) {
//     errors.push("Status must be Active or Inactive.");
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
//         "You do not have permission to view fuel surcharge settings.",
//         403,
//       );
//     }

//     const snapshot = await configRef().get();

//     if (!snapshot.exists) {
//       return successResponse({
//         config: DEFAULT_CONFIG,
//         fuelSurcharge: DEFAULT_CONFIG,
//       });
//     }

//     const config = normalizeConfig(snapshot.data());

//     return successResponse({
//       config,
//       fuelSurcharge: config,
//     });
//   } catch (error) {
//     console.error(
//       "GET /api/logistics/settings/fuel-surcharge failed",
//       error,
//     );

//     return errorResponse(
//       "FUEL_SURCHARGE_LOAD_FAILED",
//       error instanceof Error
//         ? error.message
//         : "Failed to load fuel surcharge config.",
//       500,
//     );
//   }
// }

// export async function PUT(request: NextRequest) {
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
//         "You do not have permission to update fuel surcharge settings.",
//         403,
//       );
//     }

//     let body: {
//       config?: Partial<FuelConfig>;
//       fuelSurcharge?: Partial<FuelConfig>;
//     } & Partial<FuelConfig>;

//     try {
//       body = (await request.json()) as typeof body;
//     } catch {
//       return errorResponse(
//         "INVALID_JSON",
//         "Invalid JSON request body.",
//         400,
//       );
//     }

//     const incoming = body.config || body.fuelSurcharge || body;
//     const errors = validateConfig(incoming);

//     if (errors.length > 0) {
//       return errorResponse("VALIDATION_ERROR", errors[0]!, 400);
//     }

//     const now = new Date().toISOString();

//     const record: FuelConfig = {
//       name: String(incoming.name || "Standard").trim(),
//       effectiveFrom: String(incoming.effectiveFrom || "").trim(),
//       percentage: String(incoming.percentage ?? "").trim(),
//       minimumCharge: String(incoming.minimumCharge ?? "").trim(),
//       maximumCharge: String(incoming.maximumCharge ?? "").trim(),
//       status:
//         String(incoming.status || "Active") === "Inactive"
//           ? "Inactive"
//           : "Active",
//       updatedAt: now,
//       updatedBy: user.userId,
//     };

//     await configRef().set(record, { merge: true });

//     await writeAuditLog({
//       userId: user.userId,
//       action: "FUEL_SURCHARGE_UPDATE",
//       module: "LOGISTICS",
//       resourceType: "settings",
//       resourceId: DOC_ID,
//       metadata: {
//         name: record.name,
//         percentage: record.percentage,
//         status: record.status,
//       },
//     });

//     return successResponse(
//       {
//         config: record,
//         fuelSurcharge: record,
//       },
//       200,
//       "Fuel surcharge configuration saved.",
//     );
//   } catch (error) {
//     console.error(
//       "PUT /api/logistics/settings/fuel-surcharge failed",
//       error,
//     );

//     return errorResponse(
//       "FUEL_SURCHARGE_SAVE_FAILED",
//       error instanceof Error
//         ? error.message
//         : "Failed to save fuel surcharge config.",
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
// import { FIRESTORE_COLLECTIONS } from "@/utils/constants";

// type FuelSurchargeRecord = {
//   id: string;
//   name: string;
//   percentage: number | null;
//   amount: number | null;
//   enabled: boolean;
//   effectiveFrom: string | null;
//   effectiveTo: string | null;
//   createdAt: string;
//   updatedAt: string;
//   createdBy?: string;
//   updatedBy?: string;
// };

// function collectionRef() {
//   return adminDb.collection(FIRESTORE_COLLECTIONS.FUEL_SURCHARGES);
// }

// function toNumberOrNull(value: unknown): number | null {
//   if (value === null || value === undefined || value === "") return null;
//   const n = typeof value === "number" ? value : Number(value);
//   if (!Number.isFinite(n)) return null;
//   return n;
// }

// function mapDoc(
//   id: string,
//   data: FirebaseFirestore.DocumentData,
// ): FuelSurchargeRecord {
//   return {
//     id,
//     name: String(data.name || "").trim() || "Unnamed",
//     percentage: toNumberOrNull(data.percentage),
//     amount: toNumberOrNull(data.amount),
//     enabled: data.enabled !== false && data.status !== "Inactive",
//     effectiveFrom: data.effectiveFrom ? String(data.effectiveFrom) : null,
//     effectiveTo: data.effectiveTo ? String(data.effectiveTo) : null,
//     createdAt: String(data.createdAt || new Date().toISOString()),
//     updatedAt: String(
//       data.updatedAt || data.createdAt || new Date().toISOString(),
//     ),
//     createdBy: data.createdBy ? String(data.createdBy) : undefined,
//     updatedBy: data.updatedBy ? String(data.updatedBy) : undefined,
//   };
// }

// function validateBody(
//   body: Record<string, unknown>,
//   partial = false,
// ): string | null {
//   if (!partial || body.name !== undefined) {
//     if (!String(body.name ?? "").trim()) {
//       return "Name is required.";
//     }
//   }

//   if (
//     body.percentage !== undefined &&
//     body.percentage !== null &&
//     body.percentage !== ""
//   ) {
//     const p = Number(body.percentage);
//     if (!Number.isFinite(p) || p < 0 || p > 100) {
//       return "Percentage must be between 0 and 100.";
//     }
//   }

//   if (
//     body.amount !== undefined &&
//     body.amount !== null &&
//     body.amount !== ""
//   ) {
//     const a = Number(body.amount);
//     if (!Number.isFinite(a) || a < 0) {
//       return "Fixed amount cannot be negative.";
//     }
//   }

//   const hasPct =
//     body.percentage !== undefined &&
//     body.percentage !== null &&
//     String(body.percentage).trim() !== "";
//   const hasAmt =
//     body.amount !== undefined &&
//     body.amount !== null &&
//     String(body.amount).trim() !== "";

//   if (!partial && !hasPct && !hasAmt) {
//     return "Provide at least a percentage or a fixed amount.";
//   }

//   return null;
// }

// export async function GET(request: NextRequest) {
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
//       !can(user, "LOGISTICS_FUEL_SURCHARGE_VIEW") &&
//       !can(user, "LOGISTICS_AWB_VIEW")
//     ) {
//       return errorResponse(
//         "FORBIDDEN",
//         "You do not have permission to view fuel surcharges.",
//         403,
//       );
//     }

//     const snap = await collectionRef().limit(200).get();
//     const items = snap.docs
//       .map((doc) => mapDoc(doc.id, doc.data()))
//       .sort((a, b) => a.name.localeCompare(b.name));

//     return successResponse({ items });
//   } catch (error) {
//     console.error("GET /api/logistics/settings/fuel-surcharge:", error);
//     return errorResponse(
//       "FUEL_SURCHARGE_LOAD_FAILED",
//       "Failed to load fuel surcharges.",
//       500,
//     );
//   }
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
//       !can(user, "LOGISTICS_FUEL_SURCHARGE_MANAGE") &&
//       !can(user, "LOGISTICS_AWB_UPDATE")
//     ) {
//       return errorResponse(
//         "FORBIDDEN",
//         "You do not have permission to manage fuel surcharges.",
//         403,
//       );
//     }

//     let body: Record<string, unknown>;
//     try {
//       body = await request.json();
//     } catch {
//       return errorResponse("INVALID_JSON", "Invalid JSON request body.", 400);
//     }

//     const validationError = validateBody(body, false);
//     if (validationError) {
//       return errorResponse("VALIDATION_ERROR", validationError, 400);
//     }

//     const now = new Date().toISOString();
//     const ref = collectionRef().doc();

//     const record: FuelSurchargeRecord = {
//       id: ref.id,
//       name: String(body.name).trim(),
//       percentage: toNumberOrNull(body.percentage),
//       amount: toNumberOrNull(body.amount),
//       enabled: body.enabled === false ? false : true,
//       effectiveFrom: body.effectiveFrom
//         ? String(body.effectiveFrom).trim()
//         : null,
//       effectiveTo: body.effectiveTo ? String(body.effectiveTo).trim() : null,
//       createdAt: now,
//       updatedAt: now,
//       createdBy: user.userId,
//       updatedBy: user.userId,
//     };

//     await ref.set(record);

//     await writeAuditLog({
//       userId: user.userId,
//       action: "FUEL_SURCHARGE_CREATE",
//       module: "LOGISTICS",
//       resourceType: "FUEL_SURCHARGE",
//       resourceId: ref.id,
//       metadata: { name: record.name, percentage: record.percentage },
//     });

//     return successResponse({ item: record }, 201, "Fuel surcharge created.");
//   } catch (error) {
//     console.error("POST /api/logistics/settings/fuel-surcharge:", error);
//     return errorResponse(
//       "FUEL_SURCHARGE_CREATE_FAILED",
//       "Failed to create fuel surcharge.",
//       500,
//     );
//   }
// }

// export async function PUT(request: NextRequest) {
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
//       !can(user, "LOGISTICS_FUEL_SURCHARGE_MANAGE") &&
//       !can(user, "LOGISTICS_AWB_UPDATE")
//     ) {
//       return errorResponse(
//         "FORBIDDEN",
//         "You do not have permission to manage fuel surcharges.",
//         403,
//       );
//     }

//     let body: Record<string, unknown>;
//     try {
//       body = await request.json();
//     } catch {
//       return errorResponse("INVALID_JSON", "Invalid JSON request body.", 400);
//     }

//     const id = String(body.id || "").trim();
//     if (!id) {
//       return errorResponse("ID_REQUIRED", "id is required for update.", 400);
//     }

//     const validationError = validateBody(body, true);
//     if (validationError) {
//       return errorResponse("VALIDATION_ERROR", validationError, 400);
//     }

//     const ref = collectionRef().doc(id);
//     const existing = await ref.get();
//     if (!existing.exists) {
//       return errorResponse("NOT_FOUND", "Fuel surcharge not found.", 404);
//     }

//     const now = new Date().toISOString();
//     const prev = existing.data() || {};

//     const record: FuelSurchargeRecord = {
//       id,
//       name:
//         body.name !== undefined
//           ? String(body.name).trim()
//           : String(prev.name || ""),
//       percentage:
//         body.percentage !== undefined
//           ? toNumberOrNull(body.percentage)
//           : toNumberOrNull(prev.percentage),
//       amount:
//         body.amount !== undefined
//           ? toNumberOrNull(body.amount)
//           : toNumberOrNull(prev.amount),
//       enabled:
//         body.enabled !== undefined
//           ? body.enabled !== false
//           : prev.enabled !== false,
//       effectiveFrom:
//         body.effectiveFrom !== undefined
//           ? body.effectiveFrom
//             ? String(body.effectiveFrom).trim()
//             : null
//           : prev.effectiveFrom
//             ? String(prev.effectiveFrom)
//             : null,
//       effectiveTo:
//         body.effectiveTo !== undefined
//           ? body.effectiveTo
//             ? String(body.effectiveTo).trim()
//             : null
//           : prev.effectiveTo
//             ? String(prev.effectiveTo)
//             : null,
//       createdAt: String(prev.createdAt || now),
//       updatedAt: now,
//       createdBy: prev.createdBy ? String(prev.createdBy) : undefined,
//       updatedBy: user.userId,
//     };

//     await ref.set(record, { merge: true });

//     await writeAuditLog({
//       userId: user.userId,
//       action: "FUEL_SURCHARGE_UPDATE",
//       module: "LOGISTICS",
//       resourceType: "FUEL_SURCHARGE",
//       resourceId: id,
//       metadata: { name: record.name, enabled: record.enabled },
//     });

//     return successResponse({ item: record }, 200, "Fuel surcharge updated.");
//   } catch (error) {
//     console.error("PUT /api/logistics/settings/fuel-surcharge:", error);
//     return errorResponse(
//       "FUEL_SURCHARGE_UPDATE_FAILED",
//       "Failed to update fuel surcharge.",
//       500,
//     );
//   }
// }

// export async function DELETE(request: NextRequest) {
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
//       !can(user, "LOGISTICS_FUEL_SURCHARGE_MANAGE") &&
//       !can(user, "LOGISTICS_AWB_UPDATE")
//     ) {
//       return errorResponse(
//         "FORBIDDEN",
//         "You do not have permission to manage fuel surcharges.",
//         403,
//       );
//     }

//     const { searchParams } = new URL(request.url);
//     const id = searchParams.get("id")?.trim();

//     if (!id) {
//       return errorResponse("ID_REQUIRED", "id query param is required.", 400);
//     }

//     const ref = collectionRef().doc(id);
//     const existing = await ref.get();
//     if (!existing.exists) {
//       return errorResponse("NOT_FOUND", "Fuel surcharge not found.", 404);
//     }

//     await ref.delete();

//     await writeAuditLog({
//       userId: user.userId,
//       action: "FUEL_SURCHARGE_DELETE",
//       module: "LOGISTICS",
//       resourceType: "FUEL_SURCHARGE",
//       resourceId: id,
//       metadata: { name: existing.data()?.name },
//     });

//     return successResponse({ id }, 200, "Fuel surcharge deleted.");
//   } catch (error) {
//     console.error("DELETE /api/logistics/settings/fuel-surcharge:", error);
//     return errorResponse(
//       "FUEL_SURCHARGE_DELETE_FAILED",
//       "Failed to delete fuel surcharge.",
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
// import { FIRESTORE_COLLECTIONS } from "@/utils/constants";
// import { type PermissionUser } from "@/lib/permissions";

// type FuelSurchargeRecord = {
//   id: string;
//   name: string;
//   percentage: number | null;
//   amount: number | null;
//   enabled: boolean;
//   effectiveFrom: string | null;
//   effectiveTo: string | null;
//   createdAt: string;
//   updatedAt: string;
//   createdBy?: string;
//   updatedBy?: string;
// };

// function collectionRef() {
//   return adminDb.collection(FIRESTORE_COLLECTIONS.FUEL_SURCHARGES);
// }

// function toNumberOrNull(value: unknown): number | null {
//   if (value === null || value === undefined || value === "") return null;
//   const n = typeof value === "number" ? value : Number(value);
//   if (!Number.isFinite(n)) return null;
//   return n;
// }

// function mapDoc(
//   id: string,
//   data: FirebaseFirestore.DocumentData,
// ): FuelSurchargeRecord {
//   return {
//     id,
//     name: String(data.name || "").trim() || "Unnamed",
//     percentage: toNumberOrNull(data.percentage),
//     amount: toNumberOrNull(data.amount),
//     enabled: data.enabled !== false && data.status !== "Inactive",
//     effectiveFrom: data.effectiveFrom ? String(data.effectiveFrom) : null,
//     effectiveTo: data.effectiveTo ? String(data.effectiveTo) : null,
//     createdAt: String(data.createdAt || new Date().toISOString()),
//     updatedAt: String(
//       data.updatedAt || data.createdAt || new Date().toISOString(),
//     ),
//     createdBy: data.createdBy ? String(data.createdBy) : undefined,
//     updatedBy: data.updatedBy ? String(data.updatedBy) : undefined,
//   };
// }

// function validateBody(
//   body: Record<string, unknown>,
//   partial = false,
// ): string | null {
//   if (!partial || body.name !== undefined) {
//     if (!String(body.name ?? "").trim()) return "Name is required.";
//   }

//   if (
//     body.percentage !== undefined &&
//     body.percentage !== null &&
//     body.percentage !== ""
//   ) {
//     const p = Number(body.percentage);
//     if (!Number.isFinite(p) || p < 0 || p > 100) {
//       return "Percentage must be between 0 and 100.";
//     }
//   }

//   if (
//     body.amount !== undefined &&
//     body.amount !== null &&
//     body.amount !== ""
//   ) {
//     const a = Number(body.amount);
//     if (!Number.isFinite(a) || a < 0) {
//       return "Fixed amount cannot be negative.";
//     }
//   }

//   if (!partial) {
//     const hasPct =
//       body.percentage !== undefined &&
//       body.percentage !== null &&
//       String(body.percentage).trim() !== "";
//     const hasAmt =
//       body.amount !== undefined &&
//       body.amount !== null &&
//       String(body.amount).trim() !== "";
//     if (!hasPct && !hasAmt) {
//       return "Provide at least a percentage or a fixed amount.";
//     }
//   }

//   return null;
// }

// function requireManage(user: PermissionUser): boolean {
//   return can(user, "LOGISTICS_FUEL_SURCHARGE_MANAGE");
// }

// function requireView(user: PermissionUser): boolean {
//   return (
//     can(user, "LOGISTICS_FUEL_SURCHARGE_VIEW") ||
//     can(user, "LOGISTICS_FUEL_SURCHARGE_MANAGE")
//   );
// }

// export async function GET(request: NextRequest) {
//   try {
//     const user = await getCurrentUser(request);
//     if (!user) {
//       return errorResponse(
//         "UNAUTHENTICATED",
//         "Authentication is required.",
//         401,
//       );
//     }
//     if (!requireView(user)) {
//       return errorResponse(
//         "FORBIDDEN",
//         "You do not have permission to view fuel surcharges.",
//         403,
//       );
//     }

//     const snap = await collectionRef().limit(200).get();
//     const items = snap.docs
//       .map((doc) => mapDoc(doc.id, doc.data()))
//       .sort((a, b) => a.name.localeCompare(b.name));

//     return successResponse({ items });
//   } catch (error) {
//     console.error("GET fuel-surcharge:", error);
//     return errorResponse(
//       "FUEL_SURCHARGE_LOAD_FAILED",
//       "Failed to load fuel surcharges.",
//       500,
//     );
//   }
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
//     if (!requireManage(user)) {
//       return errorResponse(
//         "FORBIDDEN",
//         "Only Super Admin can manage fuel surcharges.",
//         403,
//       );
//     }

//     let body: Record<string, unknown>;
//     try {
//       body = await request.json();
//     } catch {
//       return errorResponse("INVALID_JSON", "Invalid JSON request body.", 400);
//     }

//     const validationError = validateBody(body, false);
//     if (validationError) {
//       return errorResponse("VALIDATION_ERROR", validationError, 400);
//     }

//     const now = new Date().toISOString();
//     const ref = collectionRef().doc();

//     const record: FuelSurchargeRecord = {
//       id: ref.id,
//       name: String(body.name).trim(),
//       percentage: toNumberOrNull(body.percentage),
//       amount: toNumberOrNull(body.amount),
//       enabled: body.enabled === false ? false : true,
//       effectiveFrom: body.effectiveFrom
//         ? String(body.effectiveFrom).trim()
//         : null,
//       effectiveTo: body.effectiveTo ? String(body.effectiveTo).trim() : null,
//       createdAt: now,
//       updatedAt: now,
//       createdBy: user.userId,
//       updatedBy: user.userId,
//     };

//     await ref.set(record);

//     await writeAuditLog({
//       userId: user.userId,
//       action: "FUEL_SURCHARGE_CREATE",
//       module: "LOGISTICS",
//       resourceType: "FUEL_SURCHARGE",
//       resourceId: ref.id,
//       metadata: { name: record.name, percentage: record.percentage },
//     });

//     return successResponse({ item: record }, 201, "Fuel surcharge created.");
//   } catch (error) {
//     console.error("POST fuel-surcharge:", error);
//     return errorResponse(
//       "FUEL_SURCHARGE_CREATE_FAILED",
//       "Failed to create fuel surcharge.",
//       500,
//     );
//   }
// }

// export async function PUT(request: NextRequest) {
//   try {
//     const user = await getCurrentUser(request);
//     if (!user) {
//       return errorResponse(
//         "UNAUTHENTICATED",
//         "Authentication is required.",
//         401,
//       );
//     }
//     if (!requireManage(user)) {
//       return errorResponse(
//         "FORBIDDEN",
//         "Only Super Admin can manage fuel surcharges.",
//         403,
//       );
//     }

//     let body: Record<string, unknown>;
//     try {
//       body = await request.json();
//     } catch {
//       return errorResponse("INVALID_JSON", "Invalid JSON request body.", 400);
//     }

//     const id = String(body.id || "").trim();
//     if (!id) {
//       return errorResponse("ID_REQUIRED", "id is required for update.", 400);
//     }

//     const validationError = validateBody(body, true);
//     if (validationError) {
//       return errorResponse("VALIDATION_ERROR", validationError, 400);
//     }

//     const ref = collectionRef().doc(id);
//     const existing = await ref.get();
//     if (!existing.exists) {
//       return errorResponse("NOT_FOUND", "Fuel surcharge not found.", 404);
//     }

//     const now = new Date().toISOString();
//     const prev = existing.data() || {};

//     const record: FuelSurchargeRecord = {
//       id,
//       name:
//         body.name !== undefined
//           ? String(body.name).trim()
//           : String(prev.name || ""),
//       percentage:
//         body.percentage !== undefined
//           ? toNumberOrNull(body.percentage)
//           : toNumberOrNull(prev.percentage),
//       amount:
//         body.amount !== undefined
//           ? toNumberOrNull(body.amount)
//           : toNumberOrNull(prev.amount),
//       enabled:
//         body.enabled !== undefined
//           ? body.enabled !== false
//           : prev.enabled !== false,
//       effectiveFrom:
//         body.effectiveFrom !== undefined
//           ? body.effectiveFrom
//             ? String(body.effectiveFrom).trim()
//             : null
//           : prev.effectiveFrom
//             ? String(prev.effectiveFrom)
//             : null,
//       effectiveTo:
//         body.effectiveTo !== undefined
//           ? body.effectiveTo
//             ? String(body.effectiveTo).trim()
//             : null
//           : prev.effectiveTo
//             ? String(prev.effectiveTo)
//             : null,
//       createdAt: String(prev.createdAt || now),
//       updatedAt: now,
//       createdBy: prev.createdBy ? String(prev.createdBy) : undefined,
//       updatedBy: user.userId,
//     };

//     await ref.set(record, { merge: true });

//     await writeAuditLog({
//       userId: user.userId,
//       action: "FUEL_SURCHARGE_UPDATE",
//       module: "LOGISTICS",
//       resourceType: "FUEL_SURCHARGE",
//       resourceId: id,
//       metadata: { name: record.name, enabled: record.enabled },
//     });

//     return successResponse({ item: record }, 200, "Fuel surcharge updated.");
//   } catch (error) {
//     console.error("PUT fuel-surcharge:", error);
//     return errorResponse(
//       "FUEL_SURCHARGE_UPDATE_FAILED",
//       "Failed to update fuel surcharge.",
//       500,
//     );
//   }
// }

// export async function DELETE(request: NextRequest) {
//   try {
//     const user = await getCurrentUser(request);
//     if (!user) {
//       return errorResponse(
//         "UNAUTHENTICATED",
//         "Authentication is required.",
//         401,
//       );
//     }
//     if (!requireManage(user)) {
//       return errorResponse(
//         "FORBIDDEN",
//         "Only Super Admin can manage fuel surcharges.",
//         403,
//       );
//     }

//     const { searchParams } = new URL(request.url);
//     const id = searchParams.get("id")?.trim();
//     if (!id) {
//       return errorResponse("ID_REQUIRED", "id query param is required.", 400);
//     }

//     const ref = collectionRef().doc(id);
//     const existing = await ref.get();
//     if (!existing.exists) {
//       return errorResponse("NOT_FOUND", "Fuel surcharge not found.", 404);
//     }

//     await ref.delete();

//     await writeAuditLog({
//       userId: user.userId,
//       action: "FUEL_SURCHARGE_DELETE",
//       module: "LOGISTICS",
//       resourceType: "FUEL_SURCHARGE",
//       resourceId: id,
//       metadata: { name: existing.data()?.name },
//     });

//     return successResponse({ id }, 200, "Fuel surcharge deleted.");
//   } catch (error) {
//     console.error("DELETE fuel-surcharge:", error);
//     return errorResponse(
//       "FUEL_SURCHARGE_DELETE_FAILED",
//       "Failed to delete fuel surcharge.",
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

// type FuelSurchargeRecord = {
//   id: string;
//   name: string;
//   percentage: number | null;
//   amount: number | null;
//   enabled: boolean;
//   effectiveFrom: string | null;
//   effectiveTo: string | null;
//   createdAt?: string;
//   updatedAt?: string;
// };

// function collectionRef() {
//   const cols = FIRESTORE_COLLECTIONS as Record<string, string>;
//   const name =
//     cols.FUEL_SURCHARGES ||
//     cols.FUEL_SURCHARGE ||
//     "fuelSurcharges";
//   return adminDb.collection(name);
// }

// function normalize(id: string, data: DocumentData): FuelSurchargeRecord {
//   const percentage =
//     data.percentage != null && Number.isFinite(Number(data.percentage))
//       ? Number(data.percentage)
//       : null;
//   const amount =
//     data.amount != null && Number.isFinite(Number(data.amount))
//       ? Number(data.amount)
//       : null;

//   return {
//     id,
//     name: String(data.name || data.vendor || data.carrier || "").trim(),
//     percentage,
//     amount,
//     enabled: data.enabled === false ? false : true,
//     effectiveFrom: data.effectiveFrom
//       ? String(data.effectiveFrom)
//       : null,
//     effectiveTo: data.effectiveTo ? String(data.effectiveTo) : null,
//     createdAt: data.createdAt ? String(data.createdAt) : undefined,
//     updatedAt: data.updatedAt ? String(data.updatedAt) : undefined,
//   };
// }

// export async function GET(request: NextRequest) {
//   try {
//     const user = await getCurrentUser(request);

//     if (!user) {
//       return errorResponse(
//         "UNAUTHENTICATED",
//         "Authentication is required.",
//         401,
//       );
//     }

//     // Booking form also needs this list while creating AWB
//     if (
//       !can(user, "LOGISTICS_FUEL_SURCHARGE_VIEW") &&
//       !can(user, "LOGISTICS_AWB_VIEW") &&
//       !can(user, "LOGISTICS_AWB_CREATE")
//     ) {
//       return errorResponse(
//         "FORBIDDEN",
//         "You do not have permission to view fuel surcharges.",
//         403,
//       );
//     }

//     const { searchParams } = new URL(request.url);
//     const onlyEnabled = searchParams.get("all") !== "1";

//     const snap = await collectionRef().get();
//     let rows = snap.docs.map((doc) => normalize(doc.id, doc.data()));

//     if (onlyEnabled) {
//       rows = rows.filter((r) => r.enabled);
//     }

//     rows.sort((a, b) => a.name.localeCompare(b.name));

//     return successResponse(rows);
//   } catch (error) {
//     console.error("GET /api/logistics/settings/fuel-surcharge", error);
//     return errorResponse(
//       "FUEL_SURCHARGE_LIST_FAILED",
//       error instanceof Error ? error.message : "Failed to load fuel surcharges.",
//       500,
//     );
//   }
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

//     if (!can(user, "LOGISTICS_FUEL_SURCHARGE_MANAGE")) {
//       return errorResponse(
//         "FORBIDDEN",
//         "You do not have permission to manage fuel surcharges.",
//         403,
//       );
//     }

//     let body: Record<string, unknown>;
//     try {
//       body = await request.json();
//     } catch {
//       return errorResponse("INVALID_JSON", "Invalid JSON body.", 400);
//     }

//     const name = String(body.name || "").trim();
//     if (!name) {
//       return errorResponse("VALIDATION_ERROR", "Name is required.", 400);
//     }

//     const percentage =
//       body.percentage != null && body.percentage !== ""
//         ? Number(body.percentage)
//         : null;
//     const amount =
//       body.amount != null && body.amount !== ""
//         ? Number(body.amount)
//         : null;

//     if (
//       (percentage == null || !Number.isFinite(percentage)) &&
//       (amount == null || !Number.isFinite(amount))
//     ) {
//       return errorResponse(
//         "VALIDATION_ERROR",
//         "Enter a percentage and/or fixed amount.",
//         400,
//       );
//     }

//     const now = new Date().toISOString();
//     const ref = collectionRef().doc();

//     const record = {
//       id: ref.id,
//       name,
//       percentage:
//         percentage != null && Number.isFinite(percentage) ? percentage : null,
//       amount: amount != null && Number.isFinite(amount) ? amount : null,
//       enabled: body.enabled === false ? false : true,
//       effectiveFrom: body.effectiveFrom
//         ? String(body.effectiveFrom)
//         : null,
//       effectiveTo: body.effectiveTo ? String(body.effectiveTo) : null,
//       createdAt: now,
//       updatedAt: now,
//       createdBy: user.userId,
//     };

//     await ref.set(record);

//     await writeAuditLog({
//       userId: user.userId,
//       action: "FUEL_SURCHARGE_CREATE",
//       module: "LOGISTICS",
//       resourceType: "fuel_surcharge",
//       resourceId: ref.id,
//       metadata: { name },
//     });

//     return successResponse(normalize(ref.id, record), 201, "Fuel surcharge created.");
//   } catch (error) {
//     console.error("POST /api/logistics/settings/fuel-surcharge", error);
//     return errorResponse(
//       "FUEL_SURCHARGE_CREATE_FAILED",
//       error instanceof Error ? error.message : "Failed to create.",
//       500,
//     );
//   }
// }

// export async function PUT(request: NextRequest) {
//   try {
//     const user = await getCurrentUser(request);

//     if (!user) {
//       return errorResponse(
//         "UNAUTHENTICATED",
//         "Authentication is required.",
//         401,
//       );
//     }

//     if (!can(user, "LOGISTICS_FUEL_SURCHARGE_MANAGE")) {
//       return errorResponse(
//         "FORBIDDEN",
//         "You do not have permission to manage fuel surcharges.",
//         403,
//       );
//     }

//     let body: Record<string, unknown>;
//     try {
//       body = await request.json();
//     } catch {
//       return errorResponse("INVALID_JSON", "Invalid JSON body.", 400);
//     }

//     const id = String(body.id || "").trim();
//     if (!id) {
//       return errorResponse("VALIDATION_ERROR", "id is required.", 400);
//     }

//     const ref = collectionRef().doc(id);
//     const existing = await ref.get();
//     if (!existing.exists) {
//       return errorResponse("NOT_FOUND", "Fuel surcharge not found.", 404);
//     }

//     const name = String(body.name || "").trim();
//     if (!name) {
//       return errorResponse("VALIDATION_ERROR", "Name is required.", 400);
//     }

//     const percentage =
//       body.percentage != null && body.percentage !== ""
//         ? Number(body.percentage)
//         : null;
//     const amount =
//       body.amount != null && body.amount !== ""
//         ? Number(body.amount)
//         : null;

//     const patch = {
//       name,
//       percentage:
//         percentage != null && Number.isFinite(percentage) ? percentage : null,
//       amount: amount != null && Number.isFinite(amount) ? amount : null,
//       enabled: body.enabled === false ? false : true,
//       effectiveFrom: body.effectiveFrom
//         ? String(body.effectiveFrom)
//         : null,
//       effectiveTo: body.effectiveTo ? String(body.effectiveTo) : null,
//       updatedAt: new Date().toISOString(),
//       updatedBy: user.userId,
//     };

//     await ref.set(patch, { merge: true });

//     const updated = await ref.get();
//     const record = normalize(updated.id, updated.data() || {});

//     await writeAuditLog({
//       userId: user.userId,
//       action: "FUEL_SURCHARGE_UPDATE",
//       module: "LOGISTICS",
//       resourceType: "fuel_surcharge",
//       resourceId: id,
//       metadata: patch,
//     });

//     return successResponse(record, 200, "Fuel surcharge updated.");
//   } catch (error) {
//     console.error("PUT /api/logistics/settings/fuel-surcharge", error);
//     return errorResponse(
//       "FUEL_SURCHARGE_UPDATE_FAILED",
//       error instanceof Error ? error.message : "Failed to update.",
//       500,
//     );
//   }
// }

// export async function DELETE(request: NextRequest) {
//   try {
//     const user = await getCurrentUser(request);

//     if (!user) {
//       return errorResponse(
//         "UNAUTHENTICATED",
//         "Authentication is required.",
//         401,
//       );
//     }

//     if (!can(user, "LOGISTICS_FUEL_SURCHARGE_MANAGE")) {
//       return errorResponse(
//         "FORBIDDEN",
//         "You do not have permission to manage fuel surcharges.",
//         403,
//       );
//     }

//     const { searchParams } = new URL(request.url);
//     let id = searchParams.get("id")?.trim() || "";

//     if (!id) {
//       try {
//         const body = await request.json();
//         id = String(body?.id || "").trim();
//       } catch {
//         // no body
//       }
//     }

//     if (!id) {
//       return errorResponse("VALIDATION_ERROR", "id is required.", 400);
//     }

//     const ref = collectionRef().doc(id);
//     const existing = await ref.get();
//     if (!existing.exists) {
//       return errorResponse("NOT_FOUND", "Fuel surcharge not found.", 404);
//     }

//     await ref.delete();

//     await writeAuditLog({
//       userId: user.userId,
//       action: "FUEL_SURCHARGE_DELETE",
//       module: "LOGISTICS",
//       resourceType: "fuel_surcharge",
//       resourceId: id,
//     });

//     return successResponse({ deleted: id }, 200, "Fuel surcharge deleted.");
//   } catch (error) {
//     console.error("DELETE /api/logistics/settings/fuel-surcharge", error);
//     return errorResponse(
//       "FUEL_SURCHARGE_DELETE_FAILED",
//       error instanceof Error ? error.message : "Failed to delete.",
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
import { FIRESTORE_COLLECTIONS } from "@/utils/constants";

type FuelSurchargeRecord = {
  id: string;
  name: string;
  percentage: number | null;
  amount: number | null;
  /** GST rates (%) applied on taxable base in booking */
  cgst: number | null;
  sgst: number | null;
  igst: number | null;
  /** Optional defaults used when booking with this vendor */
  contractCharges: number | null;
  otherCharges: number | null;
  discount: number | null;
  enabled: boolean;
  effectiveFrom: string | null;
  effectiveTo: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
};

function collectionRef() {
  return adminDb.collection(
    FIRESTORE_COLLECTIONS.FUEL_SURCHARGES || "fuelSurcharges",
  );
}

function toNumberOrNull(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return null;
  return n;
}

function mapDoc(
  id: string,
  data: FirebaseFirestore.DocumentData,
): FuelSurchargeRecord {
  return {
    id,
    name: String(data.name || "").trim() || "Unnamed",
    percentage: toNumberOrNull(data.percentage),
    amount: toNumberOrNull(data.amount),
    cgst: toNumberOrNull(data.cgst),
    sgst: toNumberOrNull(data.sgst),
    igst: toNumberOrNull(data.igst),
    contractCharges: toNumberOrNull(data.contractCharges),
    otherCharges: toNumberOrNull(data.otherCharges),
    discount: toNumberOrNull(data.discount),
    enabled: data.enabled !== false && data.status !== "Inactive",
    effectiveFrom: data.effectiveFrom ? String(data.effectiveFrom) : null,
    effectiveTo: data.effectiveTo ? String(data.effectiveTo) : null,
    createdAt: String(data.createdAt || new Date().toISOString()),
    updatedAt: String(
      data.updatedAt || data.createdAt || new Date().toISOString(),
    ),
    createdBy: data.createdBy ? String(data.createdBy) : undefined,
    updatedBy: data.updatedBy ? String(data.updatedBy) : undefined,
  };
}

function validateBody(
  body: Record<string, unknown>,
  partial = false,
): string | null {
  if (!partial || body.name !== undefined) {
    if (!String(body.name ?? "").trim()) {
      return "Name is required.";
    }
  }

  if (
    body.percentage !== undefined &&
    body.percentage !== null &&
    body.percentage !== ""
  ) {
    const p = Number(body.percentage);
    if (!Number.isFinite(p) || p < 0 || p > 100) {
      return "Percentage must be between 0 and 100.";
    }
  }

  if (body.amount !== undefined && body.amount !== null && body.amount !== "") {
    const a = Number(body.amount);
    if (!Number.isFinite(a) || a < 0) {
      return "Fixed amount cannot be negative.";
    }
  }

  for (const key of ["cgst", "sgst", "igst"] as const) {
    if (body[key] !== undefined && body[key] !== null && body[key] !== "") {
      const t = Number(body[key]);
      if (!Number.isFinite(t) || t < 0 || t > 100) {
        return `${key.toUpperCase()} must be between 0 and 100.`;
      }
    }
  }

  for (const key of ["contractCharges", "otherCharges", "discount"] as const) {
    if (body[key] !== undefined && body[key] !== null && body[key] !== "") {
      const n = Number(body[key]);
      if (!Number.isFinite(n) || n < 0) {
        return `${key} cannot be negative.`;
      }
    }
  }

  const hasPct =
    body.percentage !== undefined &&
    body.percentage !== null &&
    String(body.percentage).trim() !== "";
  const hasAmt =
    body.amount !== undefined &&
    body.amount !== null &&
    String(body.amount).trim() !== "";

  if (!partial && !hasPct && !hasAmt) {
    return "Provide at least a percentage or a fixed amount.";
  }

  return null;
}

function buildRecord(
  id: string,
  body: Record<string, unknown>,
  prev: FirebaseFirestore.DocumentData | null,
  userId: string,
  now: string,
): FuelSurchargeRecord {
  const pickNum = (key: string) =>
    body[key] !== undefined
      ? toNumberOrNull(body[key])
      : prev
        ? toNumberOrNull(prev[key])
        : null;

  return {
    id,
    name:
      body.name !== undefined
        ? String(body.name).trim()
        : String(prev?.name || ""),
    percentage: pickNum("percentage"),
    amount: pickNum("amount"),
    cgst: pickNum("cgst"),
    sgst: pickNum("sgst"),
    igst: pickNum("igst"),
    contractCharges: pickNum("contractCharges"),
    otherCharges: pickNum("otherCharges"),
    discount: pickNum("discount"),
    enabled:
      body.enabled !== undefined
        ? body.enabled !== false
        : prev
          ? prev.enabled !== false
          : true,
    effectiveFrom:
      body.effectiveFrom !== undefined
        ? body.effectiveFrom
          ? String(body.effectiveFrom).trim()
          : null
        : prev?.effectiveFrom
          ? String(prev.effectiveFrom)
          : null,
    effectiveTo:
      body.effectiveTo !== undefined
        ? body.effectiveTo
          ? String(body.effectiveTo).trim()
          : null
        : prev?.effectiveTo
          ? String(prev.effectiveTo)
          : null,
    createdAt: String(prev?.createdAt || now),
    updatedAt: now,
    createdBy: prev?.createdBy ? String(prev.createdBy) : userId,
    updatedBy: userId,
  };
}

/** GET — list all fuel surcharges */
export async function GET(request: NextRequest) {
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
      !can(user, "LOGISTICS_FUEL_SURCHARGE_VIEW") &&
      !can(user, "LOGISTICS_FUEL_SURCHARGE_MANAGE") &&
      !can(user, "LOGISTICS_AWB_VIEW") &&
      !can(user, "LOGISTICS_AWB_CREATE")
    ) {
      return errorResponse(
        "FORBIDDEN",
        "You do not have permission to view fuel surcharges.",
        403,
      );
    }

    const snap = await collectionRef().limit(200).get();
    const items = snap.docs
      .map((doc) => mapDoc(doc.id, doc.data()))
      .sort((a, b) => a.name.localeCompare(b.name));

    return successResponse({ items, data: items });
  } catch (error) {
    console.error("GET /api/logistics/settings/fuel-surcharge:", error);
    return errorResponse(
      "FUEL_SURCHARGE_LOAD_FAILED",
      "Failed to load fuel surcharges.",
      500,
    );
  }
}

/** POST — create */
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

    if (!can(user, "LOGISTICS_FUEL_SURCHARGE_MANAGE")) {
      return errorResponse(
        "FORBIDDEN",
        "You do not have permission to manage fuel surcharges.",
        403,
      );
    }

    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return errorResponse("INVALID_JSON", "Invalid JSON request body.", 400);
    }

    const validationError = validateBody(body, false);
    if (validationError) {
      return errorResponse("VALIDATION_ERROR", validationError, 400);
    }

    const now = new Date().toISOString();
    const ref = collectionRef().doc();
    const record = buildRecord(ref.id, body, null, user.userId, now);

    await ref.set(record);

    await writeAuditLog({
      userId: user.userId,
      action: "FUEL_SURCHARGE_CREATE",
      module: "LOGISTICS",
      resourceType: "FUEL_SURCHARGE",
      resourceId: ref.id,
      metadata: {
        name: record.name,
        percentage: record.percentage,
        cgst: record.cgst,
        sgst: record.sgst,
        igst: record.igst,
      },
    });

    return successResponse(
      { item: record },
      201,
      "Fuel surcharge created.",
    );
  } catch (error) {
    console.error("POST /api/logistics/settings/fuel-surcharge:", error);
    return errorResponse(
      "FUEL_SURCHARGE_CREATE_FAILED",
      "Failed to create fuel surcharge.",
      500,
    );
  }
}

/** PUT — update existing (body.id required) */
export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);

    if (!user) {
      return errorResponse(
        "UNAUTHENTICATED",
        "Authentication is required.",
        401,
      );
    }

    if (!can(user, "LOGISTICS_FUEL_SURCHARGE_MANAGE")) {
      return errorResponse(
        "FORBIDDEN",
        "You do not have permission to manage fuel surcharges.",
        403,
      );
    }

    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return errorResponse("INVALID_JSON", "Invalid JSON request body.", 400);
    }

    const id = String(body.id || "").trim();
    if (!id) {
      return errorResponse("ID_REQUIRED", "id is required for update.", 400);
    }

    const validationError = validateBody(body, true);
    if (validationError) {
      return errorResponse("VALIDATION_ERROR", validationError, 400);
    }

    const ref = collectionRef().doc(id);
    const existing = await ref.get();
    if (!existing.exists) {
      return errorResponse("NOT_FOUND", "Fuel surcharge not found.", 404);
    }

    const now = new Date().toISOString();
    const record = buildRecord(
      id,
      body,
      existing.data() || null,
      user.userId,
      now,
    );

    await ref.set(record, { merge: true });

    await writeAuditLog({
      userId: user.userId,
      action: "FUEL_SURCHARGE_UPDATE",
      module: "LOGISTICS",
      resourceType: "FUEL_SURCHARGE",
      resourceId: id,
      metadata: {
        name: record.name,
        enabled: record.enabled,
        cgst: record.cgst,
        sgst: record.sgst,
        igst: record.igst,
      },
    });

    return successResponse(
      { item: record },
      200,
      "Fuel surcharge updated.",
    );
  } catch (error) {
    console.error("PUT /api/logistics/settings/fuel-surcharge:", error);
    return errorResponse(
      "FUEL_SURCHARGE_UPDATE_FAILED",
      "Failed to update fuel surcharge.",
      500,
    );
  }
}

/** DELETE — ?id=xxx */
export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);

    if (!user) {
      return errorResponse(
        "UNAUTHENTICATED",
        "Authentication is required.",
        401,
      );
    }

    if (!can(user, "LOGISTICS_FUEL_SURCHARGE_MANAGE")) {
      return errorResponse(
        "FORBIDDEN",
        "You do not have permission to manage fuel surcharges.",
        403,
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id")?.trim();

    if (!id) {
      return errorResponse("ID_REQUIRED", "id query param is required.", 400);
    }

    const ref = collectionRef().doc(id);
    const existing = await ref.get();
    if (!existing.exists) {
      return errorResponse("NOT_FOUND", "Fuel surcharge not found.", 404);
    }

    await ref.delete();

    await writeAuditLog({
      userId: user.userId,
      action: "FUEL_SURCHARGE_DELETE",
      module: "LOGISTICS",
      resourceType: "FUEL_SURCHARGE",
      resourceId: id,
      metadata: { name: existing.data()?.name },
    });

    return successResponse({ id }, 200, "Fuel surcharge deleted.");
  } catch (error) {
    console.error("DELETE /api/logistics/settings/fuel-surcharge:", error);
    return errorResponse(
      "FUEL_SURCHARGE_DELETE_FAILED",
      "Failed to delete fuel surcharge.",
      500,
    );
  }
}