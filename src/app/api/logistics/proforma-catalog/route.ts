import { NextRequest } from "next/server";
import type { DocumentData } from "firebase-admin/firestore";

import { adminDb } from "@/lib/firebase-admin";
import { getCurrentUser } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-response";
import { FIRESTORE_COLLECTIONS } from "@/utils/constants";

const COLLECTION =
  (FIRESTORE_COLLECTIONS as Record<string, string>).PROFORMA_CATALOG_ITEMS ||
  "proformaCatalogItems";

export type ProformaCatalogItem = {
  id: string;
  catalogItemId: string;
  description: string;
  shopName: string;
  shopAddress: string;
  hsCode: string;
  defaultRate: number;
  defaultQty: number;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
};

function normalize(id: string, data: DocumentData): ProformaCatalogItem {
  return {
    id,
    catalogItemId: String(data.catalogItemId || id),
    description: String(data.description || "").trim(),
    shopName: String(data.shopName || "").trim(),
    shopAddress: String(data.shopAddress || "").trim(),
    hsCode: String(data.hsCode || "").trim(),
    defaultRate: Number(data.defaultRate || 0),
    defaultQty: Number(data.defaultQty || 0),
    enabled: data.enabled !== false,
    createdAt: String(data.createdAt || new Date().toISOString()),
    updatedAt: String(
      data.updatedAt || data.createdAt || new Date().toISOString(),
    ),
  };
}

function isAdminRole(role: string | undefined | null): boolean {
  return role === "SUPER_ADMIN" || role === "ADMIN";
}

/** GET — list items */
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return errorResponse(
        "UNAUTHORIZED",
        "Authentication is required.",
        401,
      );
    }

    const { searchParams } = new URL(request.url);
    const enabledOnly = searchParams.get("enabled") !== "false";

    const snapshot = await adminDb.collection(COLLECTION).get();
    let items = snapshot.docs.map((doc) =>
      normalize(doc.id, doc.data()),
    );

    if (enabledOnly) {
      items = items.filter((i) => i.enabled);
    }

    items.sort((a, b) => a.description.localeCompare(b.description));

    // successResponse(data, status?, message?)
    return successResponse(items, 200);
  } catch (error) {
    console.error("GET /api/logistics/proforma-catalog", error);
    return errorResponse(
      "CATALOG_LIST_FAILED",
      error instanceof Error
        ? error.message
        : "Failed to load catalog.",
      500,
    );
  }
}

/** POST — create (Super Admin / Admin only) */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return errorResponse(
        "UNAUTHORIZED",
        "Authentication is required.",
        401,
      );
    }

    if (!isAdminRole(user.role)) {
      return errorResponse(
        "FORBIDDEN",
        "Only admin can manage catalog items.",
        403,
      );
    }

    const body = await request.json();
    const description = String(body.description || "").trim();
    if (!description) {
      return errorResponse(
        "VALIDATION",
        "Description is required.",
        400,
      );
    }

    const ref = adminDb.collection(COLLECTION).doc();
    const now = new Date().toISOString();

    const createdBy =
      (user as { userId?: string }).userId ||
      (user as { id?: string }).id ||
      "";

    const record = {
      catalogItemId: ref.id,
      description,
      shopName: String(body.shopName || "").trim(),
      shopAddress: String(body.shopAddress || "").trim(),
      hsCode: String(body.hsCode || "").trim(),
      defaultRate: Number(body.defaultRate || 0),
      defaultQty: Number(body.defaultQty || 1),
      enabled: body.enabled !== false,
      createdAt: now,
      updatedAt: now,
      createdBy,
    };

    await ref.set(record);

    return successResponse(
      normalize(ref.id, record),
      201,
      "Catalog item created.",
    );
  } catch (error) {
    console.error("POST /api/logistics/proforma-catalog", error);
    return errorResponse(
      "CATALOG_CREATE_FAILED",
      error instanceof Error
        ? error.message
        : "Failed to create item.",
      500,
    );
  }
}

/** PUT — update */
export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return errorResponse(
        "UNAUTHORIZED",
        "Authentication is required.",
        401,
      );
    }

    if (!isAdminRole(user.role)) {
      return errorResponse(
        "FORBIDDEN",
        "Only admin can manage catalog items.",
        403,
      );
    }

    const body = await request.json();
    const id = String(body.id || body.catalogItemId || "").trim();
    if (!id) {
      return errorResponse("VALIDATION", "id is required.", 400);
    }

    const ref = adminDb.collection(COLLECTION).doc(id);
    const snap = await ref.get();
    if (!snap.exists) {
      return errorResponse("NOT_FOUND", "Catalog item not found.", 404);
    }

    const patch: Record<string, unknown> = {
      updatedAt: new Date().toISOString(),
    };

    if (body.description !== undefined) {
      patch.description = String(body.description).trim();
    }
    if (body.shopName !== undefined) {
      patch.shopName = String(body.shopName).trim();
    }
    if (body.shopAddress !== undefined) {
      patch.shopAddress = String(body.shopAddress).trim();
    }
    if (body.hsCode !== undefined) {
      patch.hsCode = String(body.hsCode).trim();
    }
    if (body.defaultRate !== undefined) {
      patch.defaultRate = Number(body.defaultRate || 0);
    }
    if (body.defaultQty !== undefined) {
      patch.defaultQty = Number(body.defaultQty || 1);
    }
    if (body.enabled !== undefined) {
      patch.enabled = Boolean(body.enabled);
    }

    await ref.update(patch);

    const updated = await ref.get();
    const data = updated.data();
    if (!data) {
      return errorResponse(
        "NOT_FOUND",
        "Catalog item not found after update.",
        404,
      );
    }

    return successResponse(normalize(updated.id, data), 200, "Updated.");
  } catch (error) {
    console.error("PUT /api/logistics/proforma-catalog", error);
    return errorResponse(
      "CATALOG_UPDATE_FAILED",
      error instanceof Error
        ? error.message
        : "Failed to update item.",
      500,
    );
  }
}

/** DELETE */
export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return errorResponse(
        "UNAUTHORIZED",
        "Authentication is required.",
        401,
      );
    }

    if (!isAdminRole(user.role)) {
      return errorResponse(
        "FORBIDDEN",
        "Only admin can manage catalog items.",
        403,
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id")?.trim();
    if (!id) {
      return errorResponse("VALIDATION", "id is required.", 400);
    }

    await adminDb.collection(COLLECTION).doc(id).delete();

    return successResponse({ id }, 200, "Deleted.");
  } catch (error) {
    console.error("DELETE /api/logistics/proforma-catalog", error);
    return errorResponse(
      "CATALOG_DELETE_FAILED",
      error instanceof Error
        ? error.message
        : "Failed to delete item.",
      500,
    );
  }
}