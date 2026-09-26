import { NextRequest } from "next/server";
import type { DocumentData } from "firebase-admin/firestore";

import { adminDb } from "@/lib/firebase-admin";
import { getCurrentUser } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-response";
import { FIRESTORE_COLLECTIONS } from "@/utils/constants";

const COLLECTION =
  (FIRESTORE_COLLECTIONS as Record<string, string>).CURRENCIES || "currencies";

type CurrencyRecord = {
  id: string;
  code: string;
  name: string;
  symbol: string;
  enabled: boolean;
  isBase: boolean;
  rateToBase: number;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

function clean(input: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(input)) {
    if (v !== undefined) out[k] = v;
  }
  return out;
}

function normalize(id: string, data: DocumentData): CurrencyRecord {
  const enabled =
    data.enabled === undefined
      ? String(data.status || "ACTIVE").toUpperCase() !== "INACTIVE"
      : Boolean(data.enabled);

  return {
    id,
    code: String(data.code || id).trim().toUpperCase(),
    name: String(data.name || "").trim(),
    symbol: String(data.symbol || data.code || "").trim() || String(data.code || ""),
    enabled,
    isBase: Boolean(data.isBase),
    rateToBase: Number(data.rateToBase) > 0 ? Number(data.rateToBase) : 1,
    sortOrder: Number(data.sortOrder) || 0,
    createdAt: String(data.createdAt || new Date().toISOString()),
    updatedAt: String(data.updatedAt || data.createdAt || new Date().toISOString()),
  };
}

function isAdmin(role: string | null | undefined) {
  return role === "SUPER_ADMIN" || role === "ADMIN";
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return errorResponse("UNAUTHORIZED", "Authentication is required.", 401);
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const snap = await adminDb.collection(COLLECTION).get();
    let rows = snap.docs.map((d) => normalize(d.id, d.data()));

    if (status === "ACTIVE") rows = rows.filter((r) => r.enabled);
    if (status === "INACTIVE") rows = rows.filter((r) => !r.enabled);

    rows.sort(
      (a, b) =>
        (a.sortOrder || 0) - (b.sortOrder || 0) ||
        a.code.localeCompare(b.code),
    );

    return successResponse(rows);
  } catch (error) {
    console.error("GET currencies", error);
    return errorResponse(
      "CURRENCIES_LIST_FAILED",
      error instanceof Error ? error.message : "Failed to load currencies.",
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
    if (!isAdmin(user.role)) {
      return errorResponse("FORBIDDEN", "Only admin can manage currencies.", 403);
    }

    const body = await request.json();
    const code = String(body.code || "").trim().toUpperCase();
    const name = String(body.name || "").trim();
    const symbol = String(body.symbol || code).trim();
    const rateToBase = Number(body.rateToBase);
    const isBase = Boolean(body.isBase);
    const enabled = body.enabled !== false && body.status !== "INACTIVE";

    if (!code || !name) {
      return errorResponse("VALIDATION", "code and name are required.", 400);
    }
    if (!Number.isFinite(rateToBase) || rateToBase <= 0) {
      return errorResponse("VALIDATION", "rateToBase must be a positive number.", 400);
    }

    const existing = await adminDb
      .collection(COLLECTION)
      .where("code", "==", code)
      .limit(1)
      .get();
    if (!existing.empty) {
      return errorResponse("DUPLICATE", `Currency ${code} already exists.`, 409);
    }

    const now = new Date().toISOString();
    const ref = adminDb.collection(COLLECTION).doc();
    const record = clean({
      code,
      name,
      symbol,
      rateToBase: isBase ? 1 : rateToBase,
      isBase,
      enabled,
      sortOrder: Number(body.sortOrder) || 0,
      createdAt: now,
      updatedAt: now,
      createdBy: (user as { userId?: string }).userId || null,
    });

    await ref.set(record);
    return successResponse(normalize(ref.id, record), 201, "Currency created.");
  } catch (error) {
    console.error("POST currencies", error);
    return errorResponse(
      "CURRENCY_CREATE_FAILED",
      error instanceof Error ? error.message : "Failed to create currency.",
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
    if (!isAdmin(user.role)) {
      return errorResponse("FORBIDDEN", "Only admin can manage currencies.", 403);
    }

    const body = await request.json();
    const id = String(body.id || body.currencyId || "").trim();
    if (!id) {
      return errorResponse("VALIDATION", "id is required.", 400);
    }

    const ref = adminDb.collection(COLLECTION).doc(id);
    const snap = await ref.get();
    if (!snap.exists) {
      return errorResponse("NOT_FOUND", "Currency not found.", 404);
    }

    const patch: Record<string, unknown> = {
      updatedAt: new Date().toISOString(),
    };

    if (body.name !== undefined) patch.name = String(body.name).trim();
    if (body.symbol !== undefined) patch.symbol = String(body.symbol).trim();
    if (body.rateToBase !== undefined) {
      const rate = Number(body.rateToBase);
      if (!Number.isFinite(rate) || rate <= 0) {
        return errorResponse("VALIDATION", "rateToBase must be positive.", 400);
      }
      patch.rateToBase = rate;
    }
    if (body.isBase !== undefined) {
      patch.isBase = Boolean(body.isBase);
      if (body.isBase) patch.rateToBase = 1;
    }
    if (body.enabled !== undefined) patch.enabled = Boolean(body.enabled);
    if (body.status !== undefined) {
      patch.enabled = String(body.status).toUpperCase() !== "INACTIVE";
    }
    if (body.sortOrder !== undefined) patch.sortOrder = Number(body.sortOrder) || 0;

    await ref.update(clean(patch));
    const updated = await ref.get();
    return successResponse(
      normalize(updated.id, updated.data() || {}),
      200,
      "Currency updated.",
    );
  } catch (error) {
    console.error("PATCH currencies", error);
    return errorResponse(
      "CURRENCY_UPDATE_FAILED",
      error instanceof Error ? error.message : "Failed to update currency.",
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
    if (!isAdmin(user.role)) {
      return errorResponse("FORBIDDEN", "Only admin can manage currencies.", 403);
    }

    const { searchParams } = new URL(request.url);
    const id =
      searchParams.get("id")?.trim() ||
      searchParams.get("currencyId")?.trim();

    if (!id) {
      return errorResponse("VALIDATION", "id query param is required.", 400);
    }

    const ref = adminDb.collection(COLLECTION).doc(id);
    const snap = await ref.get();
    if (!snap.exists) {
      return errorResponse("NOT_FOUND", "Currency not found.", 404);
    }

    const data = snap.data() || {};

    // Optional safety: block deleting the base currency
    if (Boolean(data.isBase)) {
      return errorResponse(
        "FORBIDDEN",
        "Cannot delete the base currency. Set another currency as base first.",
        400,
      );
    }

    await ref.delete();

    return successResponse(
      { id, code: data.code },
      200,
      "Currency deleted.",
    );
  } catch (error) {
    console.error("DELETE currencies", error);
    return errorResponse(
      "CURRENCY_DELETE_FAILED",
      error instanceof Error ? error.message : "Failed to delete currency.",
      500,
    );
  }
}