import { NextRequest } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { getCurrentUser } from "@/lib/auth";
import { writeAuditLog } from "@/lib/audit";
import { successResponse, errorResponse } from "@/lib/api-response";

const DOC_PATH = "logisticsSettings/flagCharges";

type FlagCharges = {
  commercial: number;
  oda: number;
  medicalCharges: number;
  updatedAt?: string;
  updatedBy?: string;
};

const DEFAULTS: FlagCharges = {
  commercial: 0,
  oda: 0,
  medicalCharges: 0,
};

function toAmount(v: unknown): number {
  const n = Number(v);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Number(n.toFixed(2));
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return errorResponse("UNAUTHORIZED", "Authentication is required.", 401);
    }

    const snap = await adminDb.doc(DOC_PATH).get();
    if (!snap.exists) {
      return successResponse({ ...DEFAULTS });
    }

    const data = snap.data() || {};
    return successResponse({
      commercial: toAmount(data.commercial),
      oda: toAmount(data.oda),
      medicalCharges: toAmount(data.medicalCharges),
      updatedAt: data.updatedAt || null,
      updatedBy: data.updatedBy || null,
    });
  } catch (error) {
    console.error("GET flag-charges failed", error);
    return errorResponse(
      "FLAG_CHARGES_FETCH_FAILED",
      error instanceof Error ? error.message : "Failed to load flag charges.",
      500,
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return errorResponse("UNAUTHORIZED", "Authentication is required.", 401);
    }

    const role = String(user.role || "").toUpperCase();
    if (role !== "SUPER_ADMIN" && role !== "ADMIN") {
      return errorResponse(
        "FORBIDDEN",
        "Only Admin / Super Admin can update flag charge amounts.",
        403,
      );
    }

    let body: Partial<FlagCharges>;
    try {
      body = await request.json();
    } catch {
      return errorResponse("INVALID_JSON", "Invalid JSON body.", 400);
    }

    const record: FlagCharges = {
      commercial: toAmount(body.commercial),
      oda: toAmount(body.oda),
      medicalCharges: toAmount(body.medicalCharges),
      updatedAt: new Date().toISOString(),
      updatedBy: user.userId,
    };

    await adminDb.doc(DOC_PATH).set(record, { merge: true });

    try {
      await writeAuditLog({
        userId: user.userId,
        action: "FLAG_CHARGES_UPDATE",
        module: "LOGISTICS",
        resourceType: "flag_charges",
        resourceId: "flagCharges",
        metadata: record,
      });
    } catch (e) {
      console.error("audit FLAG_CHARGES_UPDATE failed", e);
    }

    return successResponse(record, 200, "Flag charge amounts saved.");
  } catch (error) {
    console.error("PUT flag-charges failed", error);
    return errorResponse(
      "FLAG_CHARGES_SAVE_FAILED",
      error instanceof Error ? error.message : "Failed to save flag charges.",
      500,
    );
  }
}