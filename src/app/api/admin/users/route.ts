// import { NextRequest } from "next/server";
// import type { DocumentData } from "firebase-admin/firestore";

// import { adminDb,adminAuth } from "@/lib/firebase-admin";
// import { getCurrentUser } from "@/lib/auth";
// import { can } from "@/lib/permissions";
// import { writeAuditLog } from "@/lib/audit";
// import {
//   successResponse,
//   errorResponse,
// } from "@/lib/api-response";
// import { FIRESTORE_COLLECTIONS, USER_ROLES } from "@/utils/constants";
// import { isValidEmail } from "@/utils/validators";
// import type { UserRole } from "@/types/user";

// type UserStatus = "ACTIVE" | "INACTIVE";
// type UserModule = "LOGISTICS" | "FOOD" | "BOTH";

// type AdminUserRecord = {
//   id: string;
//   userId: string;
//   name: string;
//   email: string;
//   role: UserRole;
//   module: UserModule;
//   status: UserStatus;
//   enabled: boolean;
//   createdAt: string;
//   updatedAt: string;
// };

// type CreateBody = {
//   name?: string;
//   email?: string;
//   password?: string;
//   role?: UserRole;
//   module?: UserModule;
//   status?: UserStatus;
// };

// type UpdateBody = CreateBody & {
//   userId?: string;
// };

// const ROLE_VALUES = Object.values(USER_ROLES) as UserRole[];
// const MODULE_VALUES: UserModule[] = ["LOGISTICS", "FOOD", "BOTH"];

// function isUserRole(value: string): value is UserRole {
//   return ROLE_VALUES.includes(value as UserRole);
// }

// function isUserModule(value: string): value is UserModule {
//   return MODULE_VALUES.includes(value as UserModule);
// }

// function usersRef() {
//   return adminDb.collection(FIRESTORE_COLLECTIONS.USERS || "users");
// }

// function normalizeUser(id: string, data: DocumentData): AdminUserRecord {
//   const statusRaw = String(data.status || "ACTIVE").toUpperCase();
  
//   const enabled =
//     data.enabled === undefined
//       ? statusRaw !== "INACTIVE"
//       : Boolean(data.enabled);

//   const roleRaw = String(data.role || "VIEWER").toUpperCase();
//   const moduleRaw = String(data.module || "BOTH").toUpperCase();

//   return {
//     id,
//     userId: String(data.userId || id),
//     // name: String(data.name || "").trim(),
//     name: String(data.name || data.displayName || "").trim(),
//     email: String(data.email || "").trim().toLowerCase(),
//     role: isUserRole(roleRaw) ? roleRaw : "VIEWER",
//     module: isUserModule(moduleRaw) ? moduleRaw : "BOTH",
//     status: enabled ? "ACTIVE" : "INACTIVE",
//     enabled,
//     createdAt: String(data.createdAt || new Date().toISOString()),
//     updatedAt: String(
//       data.updatedAt || data.createdAt || new Date().toISOString(),
//     ),
//   };
// }

// function validatePayload(body: CreateBody, partial = false): string[] {
//   const errors: string[] = [];

//   if (!partial || body.name !== undefined) {
//     if (!body.name?.trim()) errors.push("Name is required.");
//   }

//   if (!partial || body.email !== undefined) {
//     if (!body.email?.trim()) {
//       errors.push("Email is required.");
//     } else if (!isValidEmail(body.email)) {
//       errors.push("Please enter a valid email address.");
//     }
//   }

//   if (!partial || body.role !== undefined) {
//     if (!body.role || !isUserRole(String(body.role))) {
//       errors.push("A valid role is required.");
//     }
//   }

//   if (!partial || body.module !== undefined) {
//     if (!body.module || !isUserModule(String(body.module))) {
//       errors.push("Module must be LOGISTICS, FOOD, or BOTH.");
//     }
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

//     if (!can(user, "ADMIN_USER_MANAGE")) {
//       return errorResponse(
//         "FORBIDDEN",
//         "You do not have permission to manage users.",
//         403,
//       );
//     }

//     const { searchParams } = new URL(request.url);
//     const status = searchParams.get("status");
//     const moduleFilter = searchParams.get("module");
//     const q = searchParams.get("q")?.trim().toLowerCase();

//     const snapshot = await usersRef().get();

//     let users = snapshot.docs.map((doc) =>
//       normalizeUser(doc.id, doc.data()),
//     );

//     if (status === "ACTIVE" || status === "INACTIVE") {
//       users = users.filter((item) => item.status === status);
//     }

//     if (
//       moduleFilter === "LOGISTICS" ||
//       moduleFilter === "FOOD" ||
//       moduleFilter === "BOTH"
//     ) {
//       users = users.filter((item) => item.module === moduleFilter);
//     }

//     if (q) {
//       users = users.filter((item) =>
//         [item.userId, item.name, item.email, item.role, item.module, item.status]
//           .join(" ")
//           .toLowerCase()
//           .includes(q),
//       );
//     }

//     users.sort((a, b) => a.name.localeCompare(b.name));

//     return successResponse(users);
//   } catch (error) {
//     console.error("GET /api/admin/users failed", error);
//     return errorResponse(
//       "USERS_LIST_FAILED",
//       error instanceof Error ? error.message : "Failed to load users.",
//       500,
//     );
//   }
// }

// // export async function POST(request: NextRequest) {
// //   try {
// //     const user = await getCurrentUser(request);

// //     if (!user) {
// //       return errorResponse("UNAUTHORIZED", "Authentication is required.", 401);
// //     }

// //     if (!can(user, "ADMIN_USER_MANAGE")) {
// //       return errorResponse(
// //         "FORBIDDEN",
// //         "You do not have permission to manage users.",
// //         403,
// //       );
// //     }

// //     let body: CreateBody;
// //     try {
// //       body = (await request.json()) as CreateBody;
// //     } catch {
// //       return errorResponse("INVALID_JSON", "Invalid JSON request body.", 400);
// //     }

// //     const errors = validatePayload(body, false);
// //     if (errors.length > 0) {
// //       return errorResponse("VALIDATION_ERROR", errors[0]!, 400);
// //     }

// //     const email = body.email!.trim().toLowerCase();

// //     const existing = await usersRef().where("email", "==", email).limit(1).get();
// //     if (!existing.empty) {
// //       return errorResponse(
// //         "EMAIL_EXISTS",
// //         "A user with this email already exists.",
// //         409,
// //       );
// //     }

// //     const now = new Date().toISOString();
// //     const ref = usersRef().doc();
// //     const enabled = body.status !== "INACTIVE";

// //     const record: AdminUserRecord = {
// //       id: ref.id,
// //       userId: ref.id,
// //       name: body.name!.trim(),
// //       email,
// //       role: body.role!,
// //       module: body.module!,
// //       status: enabled ? "ACTIVE" : "INACTIVE",
// //       enabled,
// //       createdAt: now,
// //       updatedAt: now,
// //     };

// //     await ref.set(record);

// //     await writeAuditLog({
// //       userId: user.userId,
// //       action: "ADMIN_USER_CREATE",
// //       module: "SYSTEM",
// //       resourceType: "user",
// //       resourceId: record.userId,
// //       metadata: {
// //         email: record.email,
// //         role: record.role,
// //         module: record.module,
// //       },
// //     });

// //     return successResponse(record, 201, "User created.");
// //   } catch (error) {
// //     console.error("POST /api/admin/users failed", error);
// //     return errorResponse(
// //       "USER_CREATE_FAILED",
// //       error instanceof Error ? error.message : "Failed to create user.",
// //       500,
// //     );
// //   }
// // }

// export async function POST(request: NextRequest) {
//   try {
//     const user = await getCurrentUser(request);

//     if (!user) {
//       return errorResponse("UNAUTHORIZED", "Authentication is required.", 401);
//     }

//     if (!can(user, "ADMIN_USER_MANAGE")) {
//       return errorResponse(
//         "FORBIDDEN",
//         "You do not have permission to manage users.",
//         403,
//       );
//     }

//     let body: CreateBody;
//     try {
//       body = (await request.json()) as CreateBody;
//     } catch {
//       return errorResponse("INVALID_JSON", "Invalid JSON request body.", 400);
//     }

//     const errors = validatePayload(body, false);
//     if (errors.length > 0) {
//       return errorResponse("VALIDATION_ERROR", errors[0]!, 400);
//     }

//     const email = body.email!.trim().toLowerCase();
//     const password = String(body.password || "");
//     const name = body.name!.trim();

//     if (password.length < 6) {
//       return errorResponse(
//         "VALIDATION_ERROR",
//         "Password must be at least 6 characters.",
//         400,
//       );
//     }

//     const existingProfile = await usersRef()
//       .where("email", "==", email)
//       .limit(1)
//       .get();
//     if (!existingProfile.empty) {
//       return errorResponse(
//         "EMAIL_EXISTS",
//         "A user with this email already exists.",
//         409,
//       );
//     }

//     let authUser;
//     try {
//       authUser = await adminAuth.createUser({
//         email,
//         password,
//         displayName: name,
//         emailVerified: false,
//         disabled: body.status === "INACTIVE",
//       });
//     } catch (authError: unknown) {
//       const code =
//         authError &&
//         typeof authError === "object" &&
//         "code" in authError
//           ? String((authError as { code: string }).code)
//           : "";

//       if (code === "auth/email-already-exists") {
//         return errorResponse(
//           "EMAIL_EXISTS",
//           "This email already has a Firebase Auth account.",
//           409,
//         );
//       }
//       if (code === "auth/invalid-password") {
//         return errorResponse(
//           "VALIDATION_ERROR",
//           "Password is too weak.",
//           400,
//         );
//       }

//       throw authError;
//     }

//     const now = new Date().toISOString();
//     const enabled = body.status !== "INACTIVE";
//     const uid = authUser.uid;

//     // Document ID MUST equal Auth UID
//     const record: AdminUserRecord = {
//       id: uid,
//       userId: uid,
//       name,
//       email,
//       role: body.role!,
//       module: body.module!,
//       status: enabled ? "ACTIVE" : "INACTIVE",
//       enabled,
//       createdAt: now,
//       updatedAt: now,
//     };

//     await usersRef()
//       .doc(uid)
//       .set({
//         ...record,
//         displayName: name,
//         isActive: enabled,
//       });

//     await writeAuditLog({
//       userId: user.userId,
//       action: "ADMIN_USER_CREATE",
//       module: "SYSTEM",
//       resourceType: "user",
//       resourceId: uid,
//       metadata: {
//         email: record.email,
//         role: record.role,
//         module: record.module,
//       },
//     });

//     return successResponse(record, 201, "User created. They can log in now.");
//   } catch (error) {
//     console.error("POST /api/admin/users failed", error);
//     return errorResponse(
//       "USER_CREATE_FAILED",
//       error instanceof Error ? error.message : "Failed to create user.",
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

//     if (!can(user, "ADMIN_USER_MANAGE")) {
//       return errorResponse(
//         "FORBIDDEN",
//         "You do not have permission to manage users.",
//         403,
//       );
//     }

//     let body: UpdateBody;
//     try {
//       body = (await request.json()) as UpdateBody;
//     } catch {
//       return errorResponse("INVALID_JSON", "Invalid JSON request body.", 400);
//     }

//     const userId = body.userId?.trim();
//     if (!userId) {
//       return errorResponse("USER_ID_REQUIRED", "userId is required.", 400);
//     }

//     const errors = validatePayload(body, true);
//     if (errors.length > 0) {
//       return errorResponse("VALIDATION_ERROR", errors[0]!, 400);
//     }

//     const ref = usersRef().doc(userId);
//     const existing = await ref.get();

//     if (!existing.exists) {
//       return errorResponse("USER_NOT_FOUND", "User was not found.", 404);
//     }

//     if (body.email?.trim()) {
//       const email = body.email.trim().toLowerCase();
//       const dup = await usersRef().where("email", "==", email).limit(5).get();
//       const conflict = dup.docs.some((doc) => doc.id !== userId);
//       if (conflict) {
//         return errorResponse(
//           "EMAIL_EXISTS",
//           "A user with this email already exists.",
//           409,
//         );
//       }
//     }

//     const patch: Record<string, unknown> = {
//       updatedAt: new Date().toISOString(),
//     };

//     if (body.name !== undefined) patch.name = body.name.trim();
//     if (body.email !== undefined) patch.email = body.email.trim().toLowerCase();
//     if (body.role !== undefined) patch.role = body.role;
//     if (body.module !== undefined) patch.module = body.module;
//     if (body.status !== undefined) {
//       patch.status = body.status;
//       patch.enabled = body.status === "ACTIVE";
//     }

//     await ref.set(patch, { merge: true });

//     const updated = await ref.get();
//     const record = normalizeUser(updated.id, updated.data() || {});

//     await writeAuditLog({
//       userId: user.userId,
//       action: "ADMIN_USER_UPDATE",
//       module: "SYSTEM",
//       resourceType: "user",
//       resourceId: record.userId,
//       metadata: patch,
//     });

//     return successResponse(record, 200, "User updated.");
//   } catch (error) {
//     console.error("PATCH /api/admin/users failed", error);
//     return errorResponse(
//       "USER_UPDATE_FAILED",
//       error instanceof Error ? error.message : "Failed to update user.",
//       500,
//     );
//   }
// }

// import { NextRequest } from "next/server";
// import type { DocumentData } from "firebase-admin/firestore";

// import { adminDb, adminAuth } from "@/lib/firebase-admin";
// import { getCurrentUser } from "@/lib/auth";
// import { can } from "@/lib/permissions";
// import { writeAuditLog } from "@/lib/audit";
// import { successResponse, errorResponse } from "@/lib/api-response";
// import { FIRESTORE_COLLECTIONS, USER_ROLES } from "@/utils/constants";
// import { isValidEmail } from "@/utils/validators";
// import type { UserRole } from "@/types/user";

// type UserStatus = "ACTIVE" | "INACTIVE";
// type UserModule = "LOGISTICS" | "FOOD" | "BOTH";

// type AdminUserRecord = {
//   id: string;
//   userId: string;
//   name: string;
//   email: string;
//   role: UserRole;
//   module: UserModule;
//   status: UserStatus;
//   enabled: boolean;
//   createdAt: string;
//   updatedAt: string;
// };

// type CreateBody = {
//   name?: string;
//   email?: string;
//   password?: string;
//   role?: UserRole;
//   module?: UserModule;
//   status?: UserStatus;
//   coLoaderCode?: string;
//   accountCode?: string;
// };

// type UpdateBody = CreateBody & {
//   userId?: string;
// };

// const ROLE_VALUES = Object.values(USER_ROLES) as UserRole[];
// const MODULE_VALUES: UserModule[] = ["LOGISTICS", "FOOD", "BOTH"];

// function isUserRole(value: string): value is UserRole {
//   return ROLE_VALUES.includes(value as UserRole);
// }

// function isUserModule(value: string): value is UserModule {
//   return MODULE_VALUES.includes(value as UserModule);
// }

// function usersRef() {
//   return adminDb.collection(FIRESTORE_COLLECTIONS.USERS || "users");
// }

// function normalizeUser(id: string, data: DocumentData): AdminUserRecord {
//   const statusRaw = String(data.status || "ACTIVE").toUpperCase();

//   const enabled =
//     data.enabled === undefined
//       ? statusRaw !== "INACTIVE"
//       : Boolean(data.enabled);

//   const roleRaw = String(data.role || "CO_LOADER").toUpperCase();
//   const moduleRaw = String(data.module || "BOTH").toUpperCase();

//   return {
//     id,
//     userId: String(data.userId || id),
//     name: String(data.name || data.displayName || "").trim(),
//     email: String(data.email || "").trim().toLowerCase(),
//     // Only SUPER_ADMIN | ADMIN | CO_LOADER — never VIEWER
//     role: isUserRole(roleRaw) ? roleRaw : "CO_LOADER",
//     module: isUserModule(moduleRaw) ? moduleRaw : "BOTH",
//     status: enabled ? "ACTIVE" : "INACTIVE",
//     enabled,
//     createdAt: String(data.createdAt || new Date().toISOString()),
//     updatedAt: String(
//       data.updatedAt || data.createdAt || new Date().toISOString(),
//     ),
//   };
// }

// function validatePayload(body: CreateBody, partial = false): string[] {
//   const errors: string[] = [];

//   if (!partial || body.name !== undefined) {
//     if (!body.name?.trim()) errors.push("Name is required.");
//   }

//   if (!partial || body.email !== undefined) {
//     if (!body.email?.trim()) {
//       errors.push("Email is required.");
//     } else if (!isValidEmail(body.email)) {
//       errors.push("Please enter a valid email address.");
//     }
//   }

//   if (!partial || body.role !== undefined) {
//     if (!body.role || !isUserRole(String(body.role))) {
//       errors.push("Role must be SUPER_ADMIN, ADMIN, or CO_LOADER.");
//     }
//   }

//   if (!partial || body.module !== undefined) {
//     if (!body.module || !isUserModule(String(body.module))) {
//       errors.push("Module must be LOGISTICS, FOOD, or BOTH.");
//     }
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

//     if (!can(user, "ADMIN_USER_MANAGE")) {
//       return errorResponse(
//         "FORBIDDEN",
//         "You do not have permission to manage users.",
//         403,
//       );
//     }

//     const { searchParams } = new URL(request.url);
//     const status = searchParams.get("status");
//     const moduleFilter = searchParams.get("module");
//     const q = searchParams.get("q")?.trim().toLowerCase();

//     const snapshot = await usersRef().get();

//     let users = snapshot.docs.map((doc) =>
//       normalizeUser(doc.id, doc.data()),
//     );

//     if (status === "ACTIVE" || status === "INACTIVE") {
//       users = users.filter((item) => item.status === status);
//     }

//     if (
//       moduleFilter === "LOGISTICS" ||
//       moduleFilter === "FOOD" ||
//       moduleFilter === "BOTH"
//     ) {
//       users = users.filter((item) => item.module === moduleFilter);
//     }

//     if (q) {
//       users = users.filter((item) =>
//         [item.userId, item.name, item.email, item.role, item.module, item.status]
//           .join(" ")
//           .toLowerCase()
//           .includes(q),
//       );
//     }

//     users.sort((a, b) => a.name.localeCompare(b.name));

//     return successResponse(users);
//   } catch (error) {
//     console.error("GET /api/admin/users failed", error);
//     return errorResponse(
//       "USERS_LIST_FAILED",
//       error instanceof Error ? error.message : "Failed to load users.",
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

//     if (!can(user, "ADMIN_USER_MANAGE")) {
//       return errorResponse(
//         "FORBIDDEN",
//         "You do not have permission to manage users.",
//         403,
//       );
//     }

//     let body: CreateBody;
//     try {
//       body = (await request.json()) as CreateBody;
//     } catch {
//       return errorResponse("INVALID_JSON", "Invalid JSON request body.", 400);
//     }

//     const errors = validatePayload(body, false);
//     if (errors.length > 0) {
//       return errorResponse("VALIDATION_ERROR", errors[0]!, 400);
//     }

//     const email = body.email!.trim().toLowerCase();
//     const password = String(body.password || "");
//     const name = body.name!.trim();

//     if (password.length < 6) {
//       return errorResponse(
//         "VALIDATION_ERROR",
//         "Password must be at least 6 characters.",
//         400,
//       );
//     }

//     const existingProfile = await usersRef()
//       .where("email", "==", email)
//       .limit(1)
//       .get();
//     if (!existingProfile.empty) {
//       return errorResponse(
//         "EMAIL_EXISTS",
//         "A user with this email already exists.",
//         409,
//       );
//     }

//     let authUser;
//     try {
//       authUser = await adminAuth.createUser({
//         email,
//         password,
//         displayName: name,
//         emailVerified: false,
//         disabled: body.status === "INACTIVE",
//       });
//     } catch (authError: unknown) {
//       const code =
//         authError &&
//         typeof authError === "object" &&
//         "code" in authError
//           ? String((authError as { code: string }).code)
//           : "";

//       if (code === "auth/email-already-exists") {
//         return errorResponse(
//           "EMAIL_EXISTS",
//           "This email already has a Firebase Auth account.",
//           409,
//         );
//       }
//       if (code === "auth/invalid-password") {
//         return errorResponse(
//           "VALIDATION_ERROR",
//           "Password is too weak.",
//           400,
//         );
//       }

//       throw authError;
//     }

//     const now = new Date().toISOString();
//     const enabled = body.status !== "INACTIVE";
//     const uid = authUser.uid;

//     const role: UserRole = isUserRole(String(body.role))
//       ? (body.role as UserRole)
//       : "CO_LOADER";

//     const module: UserModule = isUserModule(String(body.module))
//       ? (body.module as UserModule)
//       : "BOTH";

//     const record: AdminUserRecord = {
//       id: uid,
//       userId: uid,
//       name,
//       email,
//       role,
//       module,
//       status: enabled ? "ACTIVE" : "INACTIVE",
//       enabled,
//       createdAt: now,
//       updatedAt: now,
//     };

//     await usersRef()
//       .doc(uid)
//       .set({
//         ...record,
//         displayName: name,
//         isActive: enabled,
//       });

//     await writeAuditLog({
//       userId: user.userId,
//       action: "ADMIN_USER_CREATE",
//       module: "SYSTEM",
//       resourceType: "user",
//       resourceId: uid,
//       metadata: {
//         email: record.email,
//         role: record.role,
//         module: record.module,
//       },
//     });

//     return successResponse(record, 201, "User created. They can log in now.");
//   } catch (error) {
//     console.error("POST /api/admin/users failed", error);
//     return errorResponse(
//       "USER_CREATE_FAILED",
//       error instanceof Error ? error.message : "Failed to create user.",
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

//     if (!can(user, "ADMIN_USER_MANAGE")) {
//       return errorResponse(
//         "FORBIDDEN",
//         "You do not have permission to manage users.",
//         403,
//       );
//     }

//     let body: UpdateBody;
//     try {
//       body = (await request.json()) as UpdateBody;
//     } catch {
//       return errorResponse("INVALID_JSON", "Invalid JSON request body.", 400);
//     }

//     const userId = body.userId?.trim();
//     if (!userId) {
//       return errorResponse("USER_ID_REQUIRED", "userId is required.", 400);
//     }

//     const errors = validatePayload(body, true);
//     if (errors.length > 0) {
//       return errorResponse("VALIDATION_ERROR", errors[0]!, 400);
//     }

//     const ref = usersRef().doc(userId);
//     const existing = await ref.get();

//     if (!existing.exists) {
//       return errorResponse("USER_NOT_FOUND", "User was not found.", 404);
//     }

//     if (body.email?.trim()) {
//       const email = body.email.trim().toLowerCase();
//       const dup = await usersRef().where("email", "==", email).limit(5).get();
//       const conflict = dup.docs.some((doc) => doc.id !== userId);
//       if (conflict) {
//         return errorResponse(
//           "EMAIL_EXISTS",
//           "A user with this email already exists.",
//           409,
//         );
//       }
//     }

//     const patch: Record<string, unknown> = {
//       updatedAt: new Date().toISOString(),
//     };

//     if (body.name !== undefined) patch.name = body.name.trim();
//     if (body.email !== undefined) patch.email = body.email.trim().toLowerCase();
//     if (body.role !== undefined) {
//       patch.role = isUserRole(String(body.role)) ? body.role : "CO_LOADER";
//     }
//     if (body.module !== undefined) patch.module = body.module;
//     if (body.status !== undefined) {
//       patch.status = body.status;
//       patch.enabled = body.status === "ACTIVE";
//       patch.isActive = body.status === "ACTIVE";
//     }

//     await ref.set(patch, { merge: true });

//     const updated = await ref.get();
//     const record = normalizeUser(updated.id, updated.data() || {});

//     await writeAuditLog({
//       userId: user.userId,
//       action: "ADMIN_USER_UPDATE",
//       module: "SYSTEM",
//       resourceType: "user",
//       resourceId: record.userId,
//       metadata: patch,
//     });

//     return successResponse(record, 200, "User updated.");
//   } catch (error) {
//     console.error("PATCH /api/admin/users failed", error);
//     return errorResponse(
//       "USER_UPDATE_FAILED",
//       error instanceof Error ? error.message : "Failed to update user.",
//       500,
//     );
//   }
// }

// import { NextRequest } from "next/server";
// import type { DocumentData } from "firebase-admin/firestore";

// import { adminDb, adminAuth } from "@/lib/firebase-admin";
// import { getCurrentUser } from "@/lib/auth";
// import { can } from "@/lib/permissions";
// import { writeAuditLog } from "@/lib/audit";
// import { successResponse, errorResponse } from "@/lib/api-response";
// import { FIRESTORE_COLLECTIONS, USER_ROLES } from "@/utils/constants";
// import { isValidEmail } from "@/utils/validators";
// import type { UserRole } from "@/types/user";

// type UserStatus = "ACTIVE" | "INACTIVE";
// type UserModule = "LOGISTICS" | "FOOD" | "BOTH";

// type AdminUserRecord = {
//   id: string;
//   userId: string;
//   name: string;
//   email: string;
//   role: UserRole;
//   module: UserModule;
//   status: UserStatus;
//   enabled: boolean;
//   coLoaderCode?: string;
//   accountCode?: string;
//   createdAt: string;
//   updatedAt: string;
// };

// type CreateBody = {
//   name?: string;
//   email?: string;
//   password?: string;
//   role?: UserRole;
//   module?: UserModule;
//   status?: UserStatus;
//   coLoaderCode?: string;
//   accountCode?: string;
// };

// type UpdateBody = CreateBody & {
//   userId?: string;
// };

// const ROLE_VALUES = Object.values(USER_ROLES) as UserRole[];
// const MODULE_VALUES: UserModule[] = ["LOGISTICS", "FOOD", "BOTH"];

// function isUserRole(value: string): value is UserRole {
//   return ROLE_VALUES.includes(value as UserRole);
// }

// function isUserModule(value: string): value is UserModule {
//   return MODULE_VALUES.includes(value as UserModule);
// }

// function usersRef() {
//   return adminDb.collection(FIRESTORE_COLLECTIONS.USERS || "users");
// }

// function normalizeCoLoaderCode(body: {
//   coLoaderCode?: string;
//   accountCode?: string;
// }): string {
//   return String(body.coLoaderCode || body.accountCode || "")
//     .trim()
//     .toUpperCase();
// }

// function normalizeUser(id: string, data: DocumentData): AdminUserRecord {
//   const statusRaw = String(data.status || "ACTIVE").toUpperCase();

//   const enabled =
//     data.enabled === undefined
//       ? statusRaw !== "INACTIVE"
//       : Boolean(data.enabled);

//   const roleRaw = String(data.role || "CO_LOADER").toUpperCase();
//   const moduleRaw = String(data.module || "LOGISTICS").toUpperCase();

//   const coLoaderCode = String(
//     data.coLoaderCode || data.coloaderCode || data.accountCode || "",
//   )
//     .trim()
//     .toUpperCase();

//   return {
//     id,
//     userId: String(data.userId || id),
//     name: String(data.name || data.displayName || "").trim(),
//     email: String(data.email || "").trim().toLowerCase(),
//     role: isUserRole(roleRaw) ? roleRaw : "CO_LOADER",
//     module: isUserModule(moduleRaw) ? moduleRaw : "LOGISTICS",
//     status: enabled ? "ACTIVE" : "INACTIVE",
//     enabled,
//     coLoaderCode: coLoaderCode || undefined,
//     accountCode: coLoaderCode || undefined,
//     createdAt: String(data.createdAt || new Date().toISOString()),
//     updatedAt: String(
//       data.updatedAt || data.createdAt || new Date().toISOString(),
//     ),
//   };
// }

// function validatePayload(body: CreateBody, partial = false): string[] {
//   const errors: string[] = [];

//   if (!partial || body.name !== undefined) {
//     if (!body.name?.trim()) errors.push("Name is required.");
//   }

//   if (!partial || body.email !== undefined) {
//     if (!body.email?.trim()) {
//       errors.push("Email is required.");
//     } else if (!isValidEmail(body.email)) {
//       errors.push("Please enter a valid email address.");
//     }
//   }

//   if (!partial || body.role !== undefined) {
//     if (!body.role || !isUserRole(String(body.role))) {
//       errors.push("Role must be SUPER_ADMIN, ADMIN, or CO_LOADER.");
//     }
//   }

//   if (!partial || body.module !== undefined) {
//     if (!body.module || !isUserModule(String(body.module))) {
//       errors.push("Module must be LOGISTICS, FOOD, or BOTH.");
//     }
//   }

//   // Co-loader code required when creating a CO_LOADER (or when field is sent)
//   if (!partial) {
//     const role = String(body.role || "CO_LOADER").toUpperCase();
//     if (role === "CO_LOADER") {
//       const code = normalizeCoLoaderCode(body);
//       if (!code) {
//         errors.push("Co-loader Code is required (e.g. WF439).");
//       }
//     }
//   } else if (
//     body.coLoaderCode !== undefined ||
//     body.accountCode !== undefined
//   ) {
//     const code = normalizeCoLoaderCode(body);
//     if (!code) {
//       errors.push("Co-loader Code cannot be empty.");
//     }
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

// // export async function GET(request: NextRequest) {
// //   try {
// //     const user = await getCurrentUser(request);

// //     if (!user) {
// //       return errorResponse("UNAUTHORIZED", "Authentication is required.", 401);
// //     }

// //     if (!can(user, "ADMIN_USER_MANAGE")) {
// //       return errorResponse(
// //         "FORBIDDEN",
// //         "You do not have permission to manage users.",
// //         403,
// //       );
// //     }

// //     const { searchParams } = new URL(request.url);
// //     const status = searchParams.get("status");
// //     const moduleFilter = searchParams.get("module");
// //     const q = searchParams.get("q")?.trim().toLowerCase();

// //     const snapshot = await usersRef().get();

// //     let users = snapshot.docs.map((doc) =>
// //       normalizeUser(doc.id, doc.data()),
// //     );

// //     if (status === "ACTIVE" || status === "INACTIVE") {
// //       users = users.filter((item) => item.status === status);
// //     }

// //     if (
// //       moduleFilter === "LOGISTICS" ||
// //       moduleFilter === "FOOD" ||
// //       moduleFilter === "BOTH"
// //     ) {
// //       users = users.filter((item) => item.module === moduleFilter);
// //     }

// //     if (q) {
// //       users = users.filter((item) =>
// //         [
// //           item.userId,
// //           item.name,
// //           item.email,
// //           item.role,
// //           item.module,
// //           item.status,
// //           item.coLoaderCode || "",
// //           item.accountCode || "",
// //         ]
// //           .join(" ")
// //           .toLowerCase()
// //           .includes(q),
// //       );
// //     }

// //     users.sort((a, b) => a.name.localeCompare(b.name));

// //     return successResponse(users);
// //   } catch (error) {
// //     console.error("GET /api/admin/users failed", error);
// //     return errorResponse(
// //       "USERS_LIST_FAILED",
// //       error instanceof Error ? error.message : "Failed to load users.",
// //       500,
// //     );
// //   }
// // }

// export async function GET(request: NextRequest) {
//   try {
//     const user = await getCurrentUser(request);

//     if (!user) {
//       return errorResponse("UNAUTHORIZED", "Authentication is required.", 401);
//     }

//     const { searchParams } = new URL(request.url);
//     const status = searchParams.get("status");
//     const moduleFilter = searchParams.get("module");
//     const roleFilter = searchParams.get("role")?.trim().toUpperCase() || "";
//     const q = searchParams.get("q")?.trim().toLowerCase();

//     const isAdminManage = can(user, "ADMIN_USER_MANAGE");
//     const isBookingColoaderList =
//       roleFilter === "CO_LOADER" &&
//       (can(user, "LOGISTICS_AWB_VIEW") ||
//         can(user, "LOGISTICS_AWB_CREATE") ||
//         can(user, "LOGISTICS_COLOADER_VIEW"));

//     if (!isAdminManage && !isBookingColoaderList) {
//       return errorResponse(
//         "FORBIDDEN",
//         "You do not have permission to list users.",
//         403,
//       );
//     }

//     // Booking may only request CO_LOADER list (not full user directory)
//     if (!isAdminManage && roleFilter !== "CO_LOADER") {
//       return errorResponse(
//         "FORBIDDEN",
//         "Only CO_LOADER listing is allowed without user-manage permission.",
//         403,
//       );
//     }

//     const snapshot = await usersRef().get();

//     let users = snapshot.docs.map((doc) =>
//       normalizeUser(doc.id, doc.data()),
//     );

//     if (roleFilter && isUserRole(roleFilter)) {
//       users = users.filter((item) => item.role === roleFilter);
//     }

//     if (status === "ACTIVE" || status === "INACTIVE") {
//       users = users.filter((item) => item.status === status);
//     }

//     if (
//       moduleFilter === "LOGISTICS" ||
//       moduleFilter === "FOOD" ||
//       moduleFilter === "BOTH"
//     ) {
//       users = users.filter((item) => item.module === moduleFilter);
//     }

//     if (q) {
//       users = users.filter((item) =>
//         [
//           item.userId,
//           item.name,
//           item.email,
//           item.role,
//           item.module,
//           item.status,
//           item.coLoaderCode || "",
//           item.accountCode || "",
//         ]
//           .join(" ")
//           .toLowerCase()
//           .includes(q),
//       );
//     }

//     // Booking list: only active CO_LOADERS with a code
//     if (isBookingColoaderList) {
//       users = users.filter((item) => {
//         const code = String(item.coLoaderCode || item.accountCode || "").trim();
//         return item.role === "CO_LOADER" && item.enabled && Boolean(code);
//       });
//     }

//     users.sort((a, b) => a.name.localeCompare(b.name));

//     // Booking response: slim shape (code + name)
//     if (isBookingColoaderList && !isAdminManage) {
//       return successResponse(
//         users.map((u) => ({
//           id: u.userId,
//           userId: u.userId,
//           code: String(u.coLoaderCode || u.accountCode || "").toUpperCase(),
//           coLoaderCode: String(u.coLoaderCode || u.accountCode || "").toUpperCase(),
//           accountCode: String(u.coLoaderCode || u.accountCode || "").toUpperCase(),
//           name: u.name,
//           email: u.email,
//           role: u.role,
//           status: u.status,
//           enabled: u.enabled,
//         })),
//       );
//     }

//     return successResponse(users);
//   } catch (error) {
//     console.error("GET /api/admin/users failed", error);
//     return errorResponse(
//       "USERS_LIST_FAILED",
//       error instanceof Error ? error.message : "Failed to load users.",
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

//     if (!can(user, "ADMIN_USER_MANAGE")) {
//       return errorResponse(
//         "FORBIDDEN",
//         "You do not have permission to manage users.",
//         403,
//       );
//     }

//     let body: CreateBody;
//     try {
//       body = (await request.json()) as CreateBody;
//     } catch {
//       return errorResponse("INVALID_JSON", "Invalid JSON request body.", 400);
//     }

//     const errors = validatePayload(body, false);
//     if (errors.length > 0) {
//       return errorResponse("VALIDATION_ERROR", errors[0]!, 400);
//     }

//     const email = body.email!.trim().toLowerCase();
//     const password = String(body.password || "");
//     const name = body.name!.trim();
//     const coLoaderCode = normalizeCoLoaderCode(body);

//     if (password.length < 6) {
//       return errorResponse(
//         "VALIDATION_ERROR",
//         "Password must be at least 6 characters.",
//         400,
//       );
//     }

//     const existingProfile = await usersRef()
//       .where("email", "==", email)
//       .limit(1)
//       .get();
//     if (!existingProfile.empty) {
//       return errorResponse(
//         "EMAIL_EXISTS",
//         "A user with this email already exists.",
//         409,
//       );
//     }

//     let authUser;
//     try {
//       authUser = await adminAuth.createUser({
//         email,
//         password,
//         displayName: name,
//         emailVerified: false,
//         disabled: body.status === "INACTIVE",
//       });
//     } catch (authError: unknown) {
//       const code =
//         authError &&
//         typeof authError === "object" &&
//         "code" in authError
//           ? String((authError as { code: string }).code)
//           : "";

//       if (code === "auth/email-already-exists") {
//         return errorResponse(
//           "EMAIL_EXISTS",
//           "This email already has a Firebase Auth account.",
//           409,
//         );
//       }
//       if (code === "auth/invalid-password") {
//         return errorResponse(
//           "VALIDATION_ERROR",
//           "Password is too weak.",
//           400,
//         );
//       }

//       throw authError;
//     }

//     const now = new Date().toISOString();
//     const enabled = body.status !== "INACTIVE";
//     const uid = authUser.uid;

//     const role: UserRole = isUserRole(String(body.role))
//       ? (body.role as UserRole)
//       : "CO_LOADER";

//     const module: UserModule = isUserModule(String(body.module))
//       ? (body.module as UserModule)
//       : "LOGISTICS";

//     const record: AdminUserRecord = {
//       id: uid,
//       userId: uid,
//       name,
//       email,
//       role,
//       module,
//       status: enabled ? "ACTIVE" : "INACTIVE",
//       enabled,
//       coLoaderCode: coLoaderCode || undefined,
//       accountCode: coLoaderCode || undefined,
//       createdAt: now,
//       updatedAt: now,
//     };

//     await usersRef()
//       .doc(uid)
//       .set({
//         ...record,
//         displayName: name,
//         isActive: enabled,
//         coLoaderCode: coLoaderCode || null,
//         accountCode: coLoaderCode || null,
//       });

//     await writeAuditLog({
//       userId: user.userId,
//       action: "ADMIN_USER_CREATE",
//       module: "SYSTEM",
//       resourceType: "user",
//       resourceId: uid,
//       metadata: {
//         email: record.email,
//         role: record.role,
//         module: record.module,
//         coLoaderCode: coLoaderCode || null,
//       },
//     });

//     return successResponse(record, 201, "User created. They can log in now.");
//   } catch (error) {
//     console.error("POST /api/admin/users failed", error);
//     return errorResponse(
//       "USER_CREATE_FAILED",
//       error instanceof Error ? error.message : "Failed to create user.",
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

//     if (!can(user, "ADMIN_USER_MANAGE")) {
//       return errorResponse(
//         "FORBIDDEN",
//         "You do not have permission to manage users.",
//         403,
//       );
//     }

//     let body: UpdateBody;
//     try {
//       body = (await request.json()) as UpdateBody;
//     } catch {
//       return errorResponse("INVALID_JSON", "Invalid JSON request body.", 400);
//     }

//     const userId = body.userId?.trim();
//     if (!userId) {
//       return errorResponse("USER_ID_REQUIRED", "userId is required.", 400);
//     }

//     const errors = validatePayload(body, true);
//     if (errors.length > 0) {
//       return errorResponse("VALIDATION_ERROR", errors[0]!, 400);
//     }

//     const ref = usersRef().doc(userId);
//     const existing = await ref.get();

//     if (!existing.exists) {
//       return errorResponse("USER_NOT_FOUND", "User was not found.", 404);
//     }

//     if (body.email?.trim()) {
//       const email = body.email.trim().toLowerCase();
//       const dup = await usersRef().where("email", "==", email).limit(5).get();
//       const conflict = dup.docs.some((doc) => doc.id !== userId);
//       if (conflict) {
//         return errorResponse(
//           "EMAIL_EXISTS",
//           "A user with this email already exists.",
//           409,
//         );
//       }
//     }

//     const patch: Record<string, unknown> = {
//       updatedAt: new Date().toISOString(),
//     };

//     if (body.name !== undefined) patch.name = body.name.trim();
//     if (body.email !== undefined) {
//       patch.email = body.email.trim().toLowerCase();
//     }
//     if (body.role !== undefined) {
//       patch.role = isUserRole(String(body.role)) ? body.role : "CO_LOADER";
//     }
//     if (body.module !== undefined) patch.module = body.module;
//     if (body.status !== undefined) {
//       patch.status = body.status;
//       patch.enabled = body.status === "ACTIVE";
//       patch.isActive = body.status === "ACTIVE";
//     }

//     if (
//       body.coLoaderCode !== undefined ||
//       body.accountCode !== undefined
//     ) {
//       const code = normalizeCoLoaderCode(body);
//       patch.coLoaderCode = code || null;
//       patch.accountCode = code || null;
//     }

//     await ref.set(patch, { merge: true });

//     const updated = await ref.get();
//     const record = normalizeUser(updated.id, updated.data() || {});

//     await writeAuditLog({
//       userId: user.userId,
//       action: "ADMIN_USER_UPDATE",
//       module: "SYSTEM",
//       resourceType: "user",
//       resourceId: record.userId,
//       metadata: patch,
//     });

//     return successResponse(record, 200, "User updated.");
//   } catch (error) {
//     console.error("PATCH /api/admin/users failed", error);
//     return errorResponse(
//       "USER_UPDATE_FAILED",
//       error instanceof Error ? error.message : "Failed to update user.",
//       500,
//     );
//   }
// }

// export async function DELETE(request: NextRequest) {
//   try {
//     const user = await getCurrentUser(request);

//     if (!user) {
//       return errorResponse("UNAUTHORIZED", "Authentication is required.", 401);
//     }

//     if (!can(user, "ADMIN_USER_MANAGE")) {
//       return errorResponse(
//         "FORBIDDEN",
//         "You do not have permission to delete users.",
//         403,
//       );
//     }

//     const { searchParams } = new URL(request.url);
//     let userId = searchParams.get("userId")?.trim() || searchParams.get("id")?.trim() || "";

//     if (!userId) {
//       try {
//         const body = await request.json();
//         userId = String(body?.userId || body?.id || "").trim();
//       } catch {
//         // no body
//       }
//     }

//     if (!userId) {
//       return errorResponse("USER_ID_REQUIRED", "userId is required.", 400);
//     }

//     if (userId === user.userId) {
//       return errorResponse(
//         "CANNOT_DELETE_SELF",
//         "You cannot delete your own account.",
//         400,
//       );
//     }

//     const ref = usersRef().doc(userId);
//     const existing = await ref.get();

//     if (!existing.exists) {
//       return errorResponse("USER_NOT_FOUND", "User was not found.", 404);
//     }

//     const data = existing.data() || {};
//     const email = String(data.email || "");
//     const name = String(data.name || data.displayName || "");
//     const role = String(data.role || "");

//     // Delete Firestore profile first
//     await ref.delete();

//     // Then Firebase Auth account
//     try {
//       await adminAuth.deleteUser(userId);
//     } catch (authErr) {
//       console.error("Failed to delete Auth user", userId, authErr);
//       // Profile already gone; still report partial success path via audit
//     }

//     await writeAuditLog({
//       userId: user.userId,
//       action: "ADMIN_USER_DELETE",
//       module: "SYSTEM",
//       resourceType: "user",
//       resourceId: userId,
//       metadata: { email, name, role },
//     });

//     return successResponse({ userId }, 200, "User deleted.");
//   } catch (error) {
//     console.error("DELETE /api/admin/users failed", error);
//     return errorResponse(
//       "USER_DELETE_FAILED",
//       error instanceof Error ? error.message : "Failed to delete user.",
//       500,
//     );
//   }
// }

import { NextRequest } from "next/server";
import type { DocumentData } from "firebase-admin/firestore";

import { adminDb, adminAuth } from "@/lib/firebase-admin";
import { getCurrentUser } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { writeAuditLog } from "@/lib/audit";
import { successResponse, errorResponse } from "@/lib/api-response";
import { FIRESTORE_COLLECTIONS } from "@/utils/constants";
import { isValidEmail } from "@/utils/validators";
import type { UserRole } from "@/types/user";

type UserStatus = "ACTIVE" | "INACTIVE";
type UserModule = "LOGISTICS" | "FOOD" | "BOTH";

/** Explicit allow-list — do not rely only on USER_ROLES object shape */
const ALLOWED_ROLES: UserRole[] = [
  "SUPER_ADMIN",
  "ADMIN",
  "CO_LOADER",
] as UserRole[];

const MODULE_VALUES: UserModule[] = ["LOGISTICS", "FOOD", "BOTH"];

type AdminUserRecord = {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  module: UserModule;
  status: UserStatus;
  enabled: boolean;
  coLoaderCode?: string;
  accountCode?: string;
  createdAt: string;
  updatedAt: string;
};

type CreateBody = {
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  module?: UserModule;
  status?: UserStatus;
  coLoaderCode?: string;
  accountCode?: string;
};

type UpdateBody = CreateBody & {
  userId?: string;
};

function isUserRole(value: string): value is UserRole {
  return ALLOWED_ROLES.includes(value as UserRole);
}

function isUserModule(value: string): value is UserModule {
  return MODULE_VALUES.includes(value as UserModule);
}

function usersRef() {
  return adminDb.collection(FIRESTORE_COLLECTIONS.USERS || "users");
}

function normalizeCoLoaderCode(body: {
  coLoaderCode?: string;
  accountCode?: string;
}): string {
  return String(body.coLoaderCode || body.accountCode || "")
    .trim()
    .toUpperCase();
}

function normalizeUser(id: string, data: DocumentData): AdminUserRecord {
  const statusRaw = String(data.status || "ACTIVE").toUpperCase();
  const enabled =
    data.enabled === undefined
      ? statusRaw !== "INACTIVE"
      : Boolean(data.enabled);

  const roleRaw = String(data.role || "ADMIN").toUpperCase();
  const moduleRaw = String(data.module || "BOTH").toUpperCase();

  const coLoaderCode = String(
    data.coLoaderCode || data.coloaderCode || data.accountCode || "",
  )
    .trim()
    .toUpperCase();

  return {
    id,
    userId: String(data.userId || id),
    name: String(data.name || data.displayName || "").trim(),
    email: String(data.email || "").trim().toLowerCase(),
    role: isUserRole(roleRaw) ? roleRaw : "ADMIN",
    module: isUserModule(moduleRaw) ? moduleRaw : "BOTH",
    status: enabled ? "ACTIVE" : "INACTIVE",
    enabled,
    coLoaderCode: coLoaderCode || undefined,
    accountCode: coLoaderCode || undefined,
    createdAt: String(data.createdAt || new Date().toISOString()),
    updatedAt: String(
      data.updatedAt || data.createdAt || new Date().toISOString(),
    ),
  };
}

function validatePayload(body: CreateBody, partial = false): string[] {
  const errors: string[] = [];

  if (!partial || body.name !== undefined) {
    if (!body.name?.trim()) errors.push("Name is required.");
  }

  if (!partial || body.email !== undefined) {
    if (!body.email?.trim()) {
      errors.push("Email is required.");
    } else if (!isValidEmail(body.email)) {
      errors.push("Please enter a valid email address.");
    }
  }

  if (!partial || body.role !== undefined) {
    if (!body.role || !isUserRole(String(body.role).toUpperCase())) {
      errors.push("Role must be SUPER_ADMIN, ADMIN, or CO_LOADER.");
    }
  }

  if (!partial || body.module !== undefined) {
    if (!body.module || !isUserModule(String(body.module).toUpperCase())) {
      errors.push("Module must be LOGISTICS, FOOD, or BOTH.");
    }
  }

  if (!partial) {
    const role = String(body.role || "ADMIN").toUpperCase();
    if (role === "CO_LOADER") {
      const code = normalizeCoLoaderCode(body);
      if (!code) {
        errors.push("Co-loader Code is required (e.g. WF439).");
      }
    }
  } else if (
    body.coLoaderCode !== undefined ||
    body.accountCode !== undefined
  ) {
    const code = normalizeCoLoaderCode(body);
    if (!code) {
      errors.push("Co-loader Code cannot be empty.");
    }
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

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const moduleFilter = searchParams.get("module");
    const roleFilter = searchParams.get("role")?.trim().toUpperCase() || "";
    const q = searchParams.get("q")?.trim().toLowerCase();

    const isAdminManage = can(user, "ADMIN_USER_MANAGE");
    const isBookingColoaderList =
      roleFilter === "CO_LOADER" &&
      (can(user, "LOGISTICS_AWB_VIEW") ||
        can(user, "LOGISTICS_AWB_CREATE") ||
        can(user, "LOGISTICS_COLOADER_VIEW"));

    if (!isAdminManage && !isBookingColoaderList) {
      return errorResponse(
        "FORBIDDEN",
        "You do not have permission to list users.",
        403,
      );
    }

    if (!isAdminManage && roleFilter !== "CO_LOADER") {
      return errorResponse(
        "FORBIDDEN",
        "Only CO_LOADER listing is allowed without user-manage permission.",
        403,
      );
    }

    const snapshot = await usersRef().get();
    let users = snapshot.docs.map((doc) =>
      normalizeUser(doc.id, doc.data()),
    );

    if (roleFilter && isUserRole(roleFilter)) {
      users = users.filter((item) => item.role === roleFilter);
    }

    if (status === "ACTIVE" || status === "INACTIVE") {
      users = users.filter((item) => item.status === status);
    }

    if (
      moduleFilter === "LOGISTICS" ||
      moduleFilter === "FOOD" ||
      moduleFilter === "BOTH"
    ) {
      users = users.filter((item) => item.module === moduleFilter);
    }

    if (q) {
      users = users.filter((item) =>
        [
          item.userId,
          item.name,
          item.email,
          item.role,
          item.module,
          item.status,
          item.coLoaderCode || "",
          item.accountCode || "",
        ]
          .join(" ")
          .toLowerCase()
          .includes(q),
      );
    }

    if (isBookingColoaderList) {
      users = users.filter((item) => {
        const code = String(item.coLoaderCode || item.accountCode || "").trim();
        return item.role === "CO_LOADER" && item.enabled && Boolean(code);
      });
    }

    users.sort((a, b) => a.name.localeCompare(b.name));

    if (isBookingColoaderList && !isAdminManage) {
      return successResponse(
        users.map((u) => ({
          id: u.userId,
          userId: u.userId,
          code: String(u.coLoaderCode || u.accountCode || "").toUpperCase(),
          coLoaderCode: String(
            u.coLoaderCode || u.accountCode || "",
          ).toUpperCase(),
          accountCode: String(
            u.coLoaderCode || u.accountCode || "",
          ).toUpperCase(),
          name: u.name,
          email: u.email,
          role: u.role,
          status: u.status,
          enabled: u.enabled,
        })),
      );
    }

    return successResponse(users);
  } catch (error) {
    console.error("GET /api/admin/users failed", error);
    return errorResponse(
      "USERS_LIST_FAILED",
      error instanceof Error ? error.message : "Failed to load users.",
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

    if (!can(user, "ADMIN_USER_MANAGE")) {
      return errorResponse(
        "FORBIDDEN",
        "You do not have permission to manage users.",
        403,
      );
    }

    let body: CreateBody;
    try {
      body = (await request.json()) as CreateBody;
    } catch {
      return errorResponse("INVALID_JSON", "Invalid JSON request body.", 400);
    }

    const errors = validatePayload(body, false);
    if (errors.length > 0) {
      return errorResponse("VALIDATION_ERROR", errors[0]!, 400);
    }

    const email = body.email!.trim().toLowerCase();
    const password = String(body.password || "");
    const name = body.name!.trim();
    const coLoaderCode = normalizeCoLoaderCode(body);

    // Default ADMIN for staff Users page (not CO_LOADER)
    const roleRaw = String(body.role || "ADMIN").toUpperCase();
    const role: UserRole = isUserRole(roleRaw) ? roleRaw : "ADMIN";

    const moduleRaw = String(body.module || "BOTH").toUpperCase();
    const module: UserModule = isUserModule(moduleRaw) ? moduleRaw : "BOTH";

    if (password.length < 6) {
      return errorResponse(
        "VALIDATION_ERROR",
        "Password must be at least 6 characters.",
        400,
      );
    }

    if (role === "CO_LOADER" && !coLoaderCode) {
      return errorResponse(
        "VALIDATION_ERROR",
        "Co-loader Code is required for CO_LOADER.",
        400,
      );
    }

    const existingProfile = await usersRef()
      .where("email", "==", email)
      .limit(1)
      .get();
    if (!existingProfile.empty) {
      return errorResponse(
        "EMAIL_EXISTS",
        "A user with this email already exists in Firestore.",
        409,
      );
    }

    let authUser;
    try {
      authUser = await adminAuth.createUser({
        email,
        password,
        displayName: name,
        emailVerified: false,
        disabled: body.status === "INACTIVE",
      });
    } catch (authError: unknown) {
      const code =
        authError &&
        typeof authError === "object" &&
        "code" in authError
          ? String((authError as { code: string }).code)
          : "";
      const message =
        authError instanceof Error ? authError.message : "Auth create failed.";

      console.error("adminAuth.createUser failed", code, message, authError);

      if (code === "auth/email-already-exists") {
        return errorResponse(
          "EMAIL_EXISTS",
          "This email already has a Firebase Auth account. Delete it in Authentication or use another email.",
          409,
        );
      }
      if (code === "auth/invalid-password") {
        return errorResponse(
          "VALIDATION_ERROR",
          "Password is too weak (min 6 characters).",
          400,
        );
      }
      if (code === "auth/operation-not-allowed") {
        return errorResponse(
          "AUTH_PROVIDER_DISABLED",
          "Email/Password sign-in is disabled. Enable it in Firebase Console → Authentication → Sign-in method.",
          400,
        );
      }
      if (code === "auth/project-not-found" || code === "auth/invalid-credential") {
        return errorResponse(
          "ADMIN_CREDENTIALS_INVALID",
          "Firebase Admin credentials are invalid or for the wrong project. Check secrets/firebase-admin.json and restart the server.",
          500,
        );
      }

      return errorResponse(
        "AUTH_CREATE_FAILED",
        `Firebase Auth error: ${code || message}`,
        500,
      );
    }

    const now = new Date().toISOString();
    const enabled = body.status !== "INACTIVE";
    const uid = authUser.uid;

    const record: AdminUserRecord = {
      id: uid,
      userId: uid,
      name,
      email,
      role,
      module,
      status: enabled ? "ACTIVE" : "INACTIVE",
      enabled,
      coLoaderCode: role === "CO_LOADER" ? coLoaderCode || undefined : undefined,
      accountCode: role === "CO_LOADER" ? coLoaderCode || undefined : undefined,
      createdAt: now,
      updatedAt: now,
    };

    await usersRef()
      .doc(uid)
      .set({
        ...record,
        displayName: name,
        isActive: enabled,
        coLoaderCode: role === "CO_LOADER" ? coLoaderCode || null : null,
        accountCode: role === "CO_LOADER" ? coLoaderCode || null : null,
      });

    await writeAuditLog({
      userId: user.userId,
      action: "ADMIN_USER_CREATE",
      module: "SYSTEM",
      resourceType: "user",
      resourceId: uid,
      metadata: {
        email: record.email,
        role: record.role,
        module: record.module,
        coLoaderCode: record.coLoaderCode || null,
      },
    });

    return successResponse(record, 201, "User created. They can log in now.");
  } catch (error) {
    console.error("POST /api/admin/users failed", error);
    return errorResponse(
      "USER_CREATE_FAILED",
      error instanceof Error ? error.message : "Failed to create user.",
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

    if (!can(user, "ADMIN_USER_MANAGE")) {
      return errorResponse(
        "FORBIDDEN",
        "You do not have permission to manage users.",
        403,
      );
    }

    let body: UpdateBody;
    try {
      body = (await request.json()) as UpdateBody;
    } catch {
      return errorResponse("INVALID_JSON", "Invalid JSON request body.", 400);
    }

    const userId = body.userId?.trim();
    if (!userId) {
      return errorResponse("USER_ID_REQUIRED", "userId is required.", 400);
    }

    const errors = validatePayload(body, true);
    if (errors.length > 0) {
      return errorResponse("VALIDATION_ERROR", errors[0]!, 400);
    }

    const ref = usersRef().doc(userId);
    const existing = await ref.get();

    if (!existing.exists) {
      return errorResponse("USER_NOT_FOUND", "User was not found.", 404);
    }

    if (body.email?.trim()) {
      const email = body.email.trim().toLowerCase();
      const dup = await usersRef().where("email", "==", email).limit(5).get();
      const conflict = dup.docs.some((doc) => doc.id !== userId);
      if (conflict) {
        return errorResponse(
          "EMAIL_EXISTS",
          "A user with this email already exists.",
          409,
        );
      }
    }

    const patch: Record<string, unknown> = {
      updatedAt: new Date().toISOString(),
    };

    if (body.name !== undefined) {
      patch.name = body.name.trim();
      patch.displayName = body.name.trim();
    }
    if (body.email !== undefined) {
      patch.email = body.email.trim().toLowerCase();
    }
    if (body.role !== undefined) {
      const roleRaw = String(body.role).toUpperCase();
      patch.role = isUserRole(roleRaw) ? roleRaw : "ADMIN";
    }
    if (body.module !== undefined) patch.module = body.module;
    if (body.status !== undefined) {
      patch.status = body.status;
      patch.enabled = body.status === "ACTIVE";
      patch.isActive = body.status === "ACTIVE";

      try {
        await adminAuth.updateUser(userId, {
          disabled: body.status === "INACTIVE",
        });
      } catch (e) {
        console.error("adminAuth.updateUser (disable) failed", e);
      }
    }

    if (
      body.coLoaderCode !== undefined ||
      body.accountCode !== undefined
    ) {
      const code = normalizeCoLoaderCode(body);
      patch.coLoaderCode = code || null;
      patch.accountCode = code || null;
    }

    await ref.set(patch, { merge: true });

    const updated = await ref.get();
    const record = normalizeUser(updated.id, updated.data() || {});

    await writeAuditLog({
      userId: user.userId,
      action: "ADMIN_USER_UPDATE",
      module: "SYSTEM",
      resourceType: "user",
      resourceId: record.userId,
      metadata: patch,
    });

    return successResponse(record, 200, "User updated.");
  } catch (error) {
    console.error("PATCH /api/admin/users failed", error);
    return errorResponse(
      "USER_UPDATE_FAILED",
      error instanceof Error ? error.message : "Failed to update user.",
      500,
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);

    if (!user) {
      return errorResponse("UNAUTHORIZED", "Authentication is required.", 401);
    }

    if (!can(user, "ADMIN_USER_MANAGE")) {
      return errorResponse(
        "FORBIDDEN",
        "You do not have permission to delete users.",
        403,
      );
    }

    const { searchParams } = new URL(request.url);
    let userId =
      searchParams.get("userId")?.trim() ||
      searchParams.get("id")?.trim() ||
      "";

    if (!userId) {
      try {
        const body = await request.json();
        userId = String(body?.userId || body?.id || "").trim();
      } catch {
        // no body
      }
    }

    if (!userId) {
      return errorResponse("USER_ID_REQUIRED", "userId is required.", 400);
    }

    if (userId === user.userId) {
      return errorResponse(
        "CANNOT_DELETE_SELF",
        "You cannot delete your own account.",
        400,
      );
    }

    const ref = usersRef().doc(userId);
    const existing = await ref.get();

    if (!existing.exists) {
      return errorResponse("USER_NOT_FOUND", "User was not found.", 404);
    }

    const data = existing.data() || {};
    const email = String(data.email || "");
    const name = String(data.name || data.displayName || "");
    const role = String(data.role || "");

    await ref.delete();

    try {
      await adminAuth.deleteUser(userId);
    } catch (authErr) {
      console.error("Failed to delete Auth user", userId, authErr);
    }

    await writeAuditLog({
      userId: user.userId,
      action: "ADMIN_USER_DELETE",
      module: "SYSTEM",
      resourceType: "user",
      resourceId: userId,
      metadata: { email, name, role },
    });

    return successResponse({ userId }, 200, "User deleted.");
  } catch (error) {
    console.error("DELETE /api/admin/users failed", error);
    return errorResponse(
      "USER_DELETE_FAILED",
      error instanceof Error ? error.message : "Failed to delete user.",
      500,
    );
  }
}