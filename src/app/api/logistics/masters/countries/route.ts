import { NextRequest } from "next/server";
import type { DocumentData } from "firebase-admin/firestore";

import { adminDb } from "@/lib/firebase-admin";
import { getCurrentUser } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { writeAuditLog } from "@/lib/audit";
import { successResponse, errorResponse } from "@/lib/api-response";

const COLLECTION = "countries";

export type CountryRecord = {
  id: string;
  name: string;
  code: string;
  volumetricDivisor: number;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
};

function normalize(id: string, data: DocumentData): CountryRecord {
  return {
    id,
    name: String(data.name || "").trim(),
    code: String(data.code || "").trim().toUpperCase(),
    volumetricDivisor: Number(data.volumetricDivisor) > 0
      ? Number(data.volumetricDivisor)
      : 5000,
    enabled: data.enabled !== false,
    createdAt: String(data.createdAt || ""),
    updatedAt: String(data.updatedAt || ""),
  };
}

function collectionRef() {
  return adminDb.collection(COLLECTION);
}

/** Public + admin: list countries (booking form needs this) */
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    // Allow any authenticated logistics user to list (for booking dropdown)
    if (!user) {
      return errorResponse("UNAUTHENTICATED", "Authentication is required.", 401);
    }

    const { searchParams } = new URL(request.url);
    const onlyEnabled = searchParams.get("enabled") !== "false";

    let query = collectionRef().orderBy("name", "asc");
    const snap = await query.get();

    let items = snap.docs.map((d) => normalize(d.id, d.data()));
    if (onlyEnabled) {
      items = items.filter((c) => c.enabled);
    }

    return successResponse({ items, countries: items });
  } catch (error) {
    console.error("GET /api/logistics/masters/countries:", error);
    return errorResponse(
      "COUNTRIES_FETCH_FAILED",
      error instanceof Error ? error.message : "Unable to load countries.",
      500,
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return errorResponse("UNAUTHENTICATED", "Authentication is required.", 401);
    }

    if (
      !can(user, "LOGISTICS_MASTERS_MANAGE") &&
      user.role !== "SUPER_ADMIN" &&
      user.role !== "ADMIN"
    ) {
      return errorResponse(
        "FORBIDDEN",
        "You do not have permission to manage countries.",
        403,
      );
    }

    let body: {
      name?: string;
      code?: string;
      volumetricDivisor?: number;
      enabled?: boolean;
    };
    try {
      body = await request.json();
    } catch {
      return errorResponse("INVALID_JSON", "Invalid JSON body.", 400);
    }

    const name = String(body.name || "").trim();
    const code = String(body.code || "").trim().toUpperCase();
    const volumetricDivisor =
      Number(body.volumetricDivisor) > 0 ? Number(body.volumetricDivisor) : 5000;

    if (!name || !code) {
      return errorResponse(
        "VALIDATION_ERROR",
        "Name and code are required.",
        400,
      );
    }

    const existing = await collectionRef().where("code", "==", code).limit(1).get();
    if (!existing.empty) {
      return errorResponse(
        "DUPLICATE_CODE",
        `Country code ${code} already exists.`,
        409,
      );
    }

    const now = new Date().toISOString();
    const ref = collectionRef().doc();
    const record = {
      name,
      code,
      volumetricDivisor,
      enabled: body.enabled !== false,
      createdAt: now,
      updatedAt: now,
      createdBy: user.userId,
    };

    await ref.set(record);

    await writeAuditLog({
      userId: user.userId,
      action: "COUNTRY_CREATED",
      module: "LOGISTICS",
      resourceType: "COUNTRY",
      resourceId: ref.id,
      metadata: { name, code },
    });

    return successResponse(
      { country: normalize(ref.id, record) },
      201,
      "Country created.",
    );
  } catch (error) {
    console.error("POST /api/logistics/masters/countries:", error);
    return errorResponse(
      "COUNTRY_CREATE_FAILED",
      error instanceof Error ? error.message : "Unable to create country.",
      500,
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return errorResponse("UNAUTHENTICATED", "Authentication is required.", 401);
    }

    if (
      !can(user, "LOGISTICS_MASTERS_MANAGE") &&
      user.role !== "SUPER_ADMIN" &&
      user.role !== "ADMIN"
    ) {
      return errorResponse("FORBIDDEN", "Permission denied.", 403);
    }

    let body: {
      id?: string;
      name?: string;
      code?: string;
      volumetricDivisor?: number;
      enabled?: boolean;
    };
    try {
      body = await request.json();
    } catch {
      return errorResponse("INVALID_JSON", "Invalid JSON body.", 400);
    }

    const id = String(body.id || "").trim();
    if (!id) {
      return errorResponse("ID_REQUIRED", "Country id is required.", 400);
    }

    const ref = collectionRef().doc(id);
    const snap = await ref.get();
    if (!snap.exists) {
      return errorResponse("NOT_FOUND", "Country not found.", 404);
    }

    const patch: Record<string, unknown> = {
      updatedAt: new Date().toISOString(),
      updatedBy: user.userId,
    };
    if (body.name != null) patch.name = String(body.name).trim();
    if (body.code != null) patch.code = String(body.code).trim().toUpperCase();
    if (body.volumetricDivisor != null) {
      patch.volumetricDivisor =
        Number(body.volumetricDivisor) > 0
          ? Number(body.volumetricDivisor)
          : 5000;
    }
    if (body.enabled != null) patch.enabled = Boolean(body.enabled);

    await ref.set(patch, { merge: true });
    const updated = await ref.get();

    return successResponse({
      country: normalize(id, updated.data() || {}),
    });
  } catch (error) {
    console.error("PATCH /api/logistics/masters/countries:", error);
    return errorResponse(
      "COUNTRY_UPDATE_FAILED",
      error instanceof Error ? error.message : "Unable to update country.",
      500,
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return errorResponse("UNAUTHENTICATED", "Authentication is required.", 401);
    }

    if (user.role !== "SUPER_ADMIN" && user.role !== "ADMIN") {
      return errorResponse("FORBIDDEN", "Only admin can delete countries.", 403);
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id")?.trim();
    if (!id) {
      return errorResponse("ID_REQUIRED", "id query param required.", 400);
    }

    await collectionRef().doc(id).delete();

    await writeAuditLog({
      userId: user.userId,
      action: "COUNTRY_DELETED",
      module: "LOGISTICS",
      resourceType: "COUNTRY",
      resourceId: id,
    });

    return successResponse({ id }, 200, "Country deleted.");
  } catch (error) {
    console.error("DELETE /api/logistics/masters/countries:", error);
    return errorResponse(
      "COUNTRY_DELETE_FAILED",
      error instanceof Error ? error.message : "Unable to delete country.",
      500,
    );
  }
}