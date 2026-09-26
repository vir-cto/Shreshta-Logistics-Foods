// import { NextRequest } from "next/server";
// import type { DocumentData } from "firebase-admin/firestore";

// import { adminDb } from "@/lib/firebase-admin";
// import { getCurrentUser } from "@/lib/auth";
// import { can } from "@/lib/permissions";
// import { writeAuditLog } from "@/lib/audit";
// import { successResponse, errorResponse } from "@/lib/api-response";
// import { FIRESTORE_COLLECTIONS } from "@/utils/constants";

// type OriginStatus = "ACTIVE" | "INACTIVE";

// type OriginRecord = {
//   id: string;
//   originId: string;
//   name: string;
//   code?: string;
//   status: OriginStatus;
//   enabled: boolean;
//   createdAt: string;
//   updatedAt: string;
// };

// type Body = {
//   originId?: string;
//   name?: string;
//   code?: string;
//   status?: OriginStatus;
// };

// function col() {
//   const name =
//     (FIRESTORE_COLLECTIONS as Record<string, string>).ORIGINS || "origins";
//   return adminDb.collection(name);
// }

// function optionalString(value: unknown): string | null {
//   const s = String(value ?? "").trim();
//   return s ? s : null;
// }

// function normalize(id: string, data: DocumentData): OriginRecord {
//   const statusRaw = String(data.status || "ACTIVE").toUpperCase();
//   const enabled =
//     data.enabled === undefined
//       ? statusRaw !== "INACTIVE"
//       : Boolean(data.enabled);

//   return {
//     id,
//     originId: String(data.originId || id),
//     name: String(data.name || "").trim(),
//     code: data.code ? String(data.code).trim().toUpperCase() : undefined,
//     status: enabled ? "ACTIVE" : "INACTIVE",
//     enabled,
//     createdAt: String(data.createdAt || new Date().toISOString()),
//     updatedAt: String(
//       data.updatedAt || data.createdAt || new Date().toISOString(),
//     ),
//   };
// }

// export async function GET(request: NextRequest) {
//   try {
//     const user = await getCurrentUser(request);
//     if (!user) {
//       return errorResponse("UNAUTHORIZED", "Authentication is required.", 401);
//     }

//     const snap = await col().limit(500).get();
//     const items = snap.docs
//       .map((d) => normalize(d.id, d.data() || {}))
//       .filter((o) => Boolean(o.name))
//       .sort((a, b) => a.name.localeCompare(b.name));

//     return successResponse({ items, origins: items });
//   } catch (error) {
//     console.error("GET /api/logistics/origins", error);
//     return errorResponse(
//       "ORIGINS_FETCH_FAILED",
//       error instanceof Error ? error.message : "Failed to load origins.",
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
//     if (
//       !can(user, "LOGISTICS_MASTERS_MANAGE") &&
//       !can(user, "LOGISTICS_AWB_CREATE") &&
//       user.role !== "SUPER_ADMIN" &&
//       user.role !== "ADMIN"
//     ) {
//       return errorResponse(
//         "FORBIDDEN",
//         "You do not have permission to create origins.",
//         403,
//       );
//     }

//     let body: Body;
//     try {
//       body = (await request.json()) as Body;
//     } catch {
//       return errorResponse("INVALID_JSON", "Invalid JSON request body.", 400);
//     }

//     const name = String(body.name || "").trim();
//     if (!name) {
//       return errorResponse("VALIDATION_ERROR", "Origin name is required.", 400);
//     }

//     const code = String(body.code || "").trim().toUpperCase() || undefined;
//     const status: OriginStatus =
//       body.status === "INACTIVE" ? "INACTIVE" : "ACTIVE";
//     const now = new Date().toISOString();
//     const ref = col().doc();

//     // const record: OriginRecord = {
//     //   id: ref.id,
//     //   originId: ref.id,
//     //   name,
//     //   code,
//     //   status,
//     //   enabled: status === "ACTIVE",
//     //   createdAt: now,
//     //   updatedAt: now,
//     // };

//     // await ref.set(record);

//     const record = {
//       id: ref.id,
//       originId: ref.id,
//       name,
//       code: optionalString(body.code)?.toUpperCase() ?? null,
//       state: optionalString(body.state),
//       country: String(body.country || "").trim() || "India",
//       status,
//       enabled: status === "ACTIVE",
//       createdAt: now,
//       updatedAt: now,
//     };
//     await ref.set(record);

//     await writeAuditLog({
//       userId: user.userId,
//       action: "ORIGIN_CREATE",
//       module: "LOGISTICS",
//       resourceType: "origin",
//       resourceId: record.originId,
//       metadata: { name: record.name, code: record.code },
//     });

//     return successResponse(record, 201, "Origin created.");
//   } catch (error) {
//     console.error("POST /api/logistics/origins", error);
//     return errorResponse(
//       "ORIGIN_CREATE_FAILED",
//       error instanceof Error ? error.message : "Failed to create origin.",
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
//     if (
//       !can(user, "LOGISTICS_MASTERS_MANAGE") &&
//       user.role !== "SUPER_ADMIN" &&
//       user.role !== "ADMIN"
//     ) {
//       return errorResponse(
//         "FORBIDDEN",
//         "You do not have permission to update origins.",
//         403,
//       );
//     }

//     let body: Body;
//     try {
//       body = (await request.json()) as Body;
//     } catch {
//       return errorResponse("INVALID_JSON", "Invalid JSON request body.", 400);
//     }

//     const originId = String(body.originId || "").trim();
//     if (!originId) {
//       return errorResponse(
//         "ORIGIN_ID_REQUIRED",
//         "originId is required.",
//         400,
//       );
//     }

//     const ref = col().doc(originId);
//     const existing = await ref.get();
//     if (!existing.exists) {
//       return errorResponse("ORIGIN_NOT_FOUND", "Origin was not found.", 404);
//     }

//     const patch: Record<string, unknown> = {
//       updatedAt: new Date().toISOString(),
//     };

//     if (body.name !== undefined) {
//       const name = String(body.name || "").trim();
//       if (!name) {
//         return errorResponse(
//           "VALIDATION_ERROR",
//           "Origin name is required.",
//           400,
//         );
//       }
//       patch.name = name;
//     }
//     if (body.code !== undefined) {
//       patch.code = String(body.code || "").trim().toUpperCase() || null;
//     }
//     if (body.status !== undefined) {
//       const status: OriginStatus =
//         body.status === "INACTIVE" ? "INACTIVE" : "ACTIVE";
//       patch.status = status;
//       patch.enabled = status === "ACTIVE";
//     }

//     await ref.set(patch, { merge: true });
//     const next = await ref.get();
//     const record = normalize(next.id, next.data() || {});

//     await writeAuditLog({
//       userId: user.userId,
//       action: "ORIGIN_UPDATE",
//       module: "LOGISTICS",
//       resourceType: "origin",
//       resourceId: originId,
//       metadata: patch,
//     });

//     return successResponse(record, 200, "Origin updated.");
//   } catch (error) {
//     console.error("PATCH /api/logistics/origins", error);
//     return errorResponse(
//       "ORIGIN_UPDATE_FAILED",
//       error instanceof Error ? error.message : "Failed to update origin.",
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

type OriginStatus = "ACTIVE" | "INACTIVE";

type OriginRecord = {
  id: string;
  originId: string;
  name: string;
  code: string | null;
  state: string | null;
  country: string;
  status: OriginStatus;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
};

type Body = {
  originId?: string;
  name?: string;
  code?: string;
  state?: string;
  country?: string;
  status?: OriginStatus;
};

function col() {
  const name =
    (FIRESTORE_COLLECTIONS as Record<string, string>).ORIGINS || "origins";
  return adminDb.collection(name);
}

/** Firestore rejects `undefined` — use null for empty optionals. */
function optionalString(value: unknown): string | null {
  const s = String(value ?? "").trim();
  return s ? s : null;
}

function normalize(id: string, data: DocumentData): OriginRecord {
  const statusRaw = String(data.status || "ACTIVE").toUpperCase();
  const enabled =
    data.enabled === undefined
      ? statusRaw !== "INACTIVE"
      : Boolean(data.enabled);

  return {
    id,
    originId: String(data.originId || id),
    name: String(data.name || "").trim(),
    code: optionalString(data.code)
      ? String(optionalString(data.code)).toUpperCase()
      : null,
    state: optionalString(data.state),
    country: String(data.country || "").trim() || "India",
    status: enabled ? "ACTIVE" : "INACTIVE",
    enabled,
    createdAt: String(data.createdAt || new Date().toISOString()),
    updatedAt: String(
      data.updatedAt || data.createdAt || new Date().toISOString(),
    ),
  };
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return errorResponse("UNAUTHORIZED", "Authentication is required.", 401);
    }

    const snap = await col().limit(500).get();
    const items = snap.docs
      .map((d) => normalize(d.id, d.data() || {}))
      .filter((o) => Boolean(o.name))
      .sort((a, b) => a.name.localeCompare(b.name));

    return successResponse({ items, origins: items });
  } catch (error) {
    console.error("GET /api/logistics/origins", error);
    return errorResponse(
      "ORIGINS_FETCH_FAILED",
      error instanceof Error ? error.message : "Failed to load origins.",
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
    if (
      !can(user, "LOGISTICS_MASTERS_MANAGE") &&
      !can(user, "LOGISTICS_AWB_CREATE") &&
      user.role !== "SUPER_ADMIN" &&
      user.role !== "ADMIN"
    ) {
      return errorResponse(
        "FORBIDDEN",
        "You do not have permission to create origins.",
        403,
      );
    }

    let body: Body;
    try {
      body = (await request.json()) as Body;
    } catch {
      return errorResponse("INVALID_JSON", "Invalid JSON request body.", 400);
    }

    const name = String(body.name || "").trim();
    if (!name) {
      return errorResponse("VALIDATION_ERROR", "Origin name is required.", 400);
    }

    const country = String(body.country || "").trim();
    if (!country) {
      return errorResponse("VALIDATION_ERROR", "Country is required.", 400);
    }

    const status: OriginStatus =
      body.status === "INACTIVE" ? "INACTIVE" : "ACTIVE";
    const now = new Date().toISOString();
    const ref = col().doc();

    const codeVal = optionalString(body.code);
    const record: OriginRecord = {
      id: ref.id,
      originId: ref.id,
      name,
      code: codeVal ? codeVal.toUpperCase() : null,
      state: optionalString(body.state),
      country,
      status,
      enabled: status === "ACTIVE",
      createdAt: now,
      updatedAt: now,
    };

    await ref.set(record);

    await writeAuditLog({
      userId: user.userId,
      action: "ORIGIN_CREATE",
      module: "LOGISTICS",
      resourceType: "origin",
      resourceId: record.originId,
      metadata: {
        name: record.name,
        code: record.code,
        country: record.country,
      },
    });

    return successResponse(record, 201, "Origin created.");
  } catch (error) {
    console.error("POST /api/logistics/origins", error);
    return errorResponse(
      "ORIGIN_CREATE_FAILED",
      error instanceof Error ? error.message : "Failed to create origin.",
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
    if (
      !can(user, "LOGISTICS_MASTERS_MANAGE") &&
      user.role !== "SUPER_ADMIN" &&
      user.role !== "ADMIN"
    ) {
      return errorResponse(
        "FORBIDDEN",
        "You do not have permission to update origins.",
        403,
      );
    }

    let body: Body;
    try {
      body = (await request.json()) as Body;
    } catch {
      return errorResponse("INVALID_JSON", "Invalid JSON request body.", 400);
    }

    const originId = String(body.originId || "").trim();
    if (!originId) {
      return errorResponse(
        "ORIGIN_ID_REQUIRED",
        "originId is required.",
        400,
      );
    }

    const ref = col().doc(originId);
    const existing = await ref.get();
    if (!existing.exists) {
      return errorResponse("ORIGIN_NOT_FOUND", "Origin was not found.", 404);
    }

    const patch: Record<string, unknown> = {
      updatedAt: new Date().toISOString(),
    };

    if (body.name !== undefined) {
      const name = String(body.name || "").trim();
      if (!name) {
        return errorResponse(
          "VALIDATION_ERROR",
          "Origin name is required.",
          400,
        );
      }
      patch.name = name;
    }

    if (body.code !== undefined) {
      const c = optionalString(body.code);
      patch.code = c ? c.toUpperCase() : null;
    }

    if (body.state !== undefined) {
      patch.state = optionalString(body.state);
    }

    if (body.country !== undefined) {
      const country = String(body.country || "").trim();
      if (!country) {
        return errorResponse(
          "VALIDATION_ERROR",
          "Country is required.",
          400,
        );
      }
      patch.country = country;
    }

    if (body.status !== undefined) {
      const status: OriginStatus =
        body.status === "INACTIVE" ? "INACTIVE" : "ACTIVE";
      patch.status = status;
      patch.enabled = status === "ACTIVE";
    }

    await ref.set(patch, { merge: true });
    const next = await ref.get();
    const record = normalize(next.id, next.data() || {});

    await writeAuditLog({
      userId: user.userId,
      action: "ORIGIN_UPDATE",
      module: "LOGISTICS",
      resourceType: "origin",
      resourceId: originId,
      metadata: {
        name: record.name,
        status: record.status,
      },
    });

    return successResponse(record, 200, "Origin updated.");
  } catch (error) {
    console.error("PATCH /api/logistics/origins", error);
    return errorResponse(
      "ORIGIN_UPDATE_FAILED",
      error instanceof Error ? error.message : "Failed to update origin.",
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
    if (
      !can(user, "LOGISTICS_MASTERS_MANAGE") &&
      user.role !== "SUPER_ADMIN" &&
      user.role !== "ADMIN"
    ) {
      return errorResponse(
        "FORBIDDEN",
        "You do not have permission to delete origins.",
        403,
      );
    }

    const { searchParams } = new URL(request.url);
    const originId =
      searchParams.get("id")?.trim() ||
      searchParams.get("originId")?.trim();

    if (!originId) {
      return errorResponse(
        "ORIGIN_ID_REQUIRED",
        "id (or originId) query param is required.",
        400,
      );
    }

    const ref = col().doc(originId);
    const existing = await ref.get();
    if (!existing.exists) {
      return errorResponse("ORIGIN_NOT_FOUND", "Origin was not found.", 404);
    }

    const data = existing.data() || {};
    await ref.delete();

    await writeAuditLog({
      userId: user.userId,
      action: "ORIGIN_DELETE",
      module: "LOGISTICS",
      resourceType: "origin",
      resourceId: originId,
      metadata: { name: data.name, code: data.code },
    });

    return successResponse({ id: originId }, 200, "Origin deleted.");
  } catch (error) {
    console.error("DELETE /api/logistics/origins", error);
    return errorResponse(
      "ORIGIN_DELETE_FAILED",
      error instanceof Error ? error.message : "Failed to delete origin.",
      500,
    );
  }
}