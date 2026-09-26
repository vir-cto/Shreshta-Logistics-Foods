// import { NextRequest } from "next/server";
// import type { DocumentData } from "firebase-admin/firestore";

// import { adminDb } from "@/lib/firebase-admin";
// import { getCurrentUser } from "@/lib/auth";
// import { can, type PermissionUser } from "@/lib/permissions";
// import { writeAuditLog } from "@/lib/audit";
// import { successResponse, errorResponse } from "@/lib/api-response";
// import { FIRESTORE_COLLECTIONS } from "@/utils/constants";

// export const runtime = "nodejs";
// export const dynamic = "force-dynamic";

// type RateType = "FLAT" | "PER_KG";

// type CarrierRateRecord = {
//   id: string;
//   rateId: string;
//   vendorName: string;
//   vendorCode: string;
//   country: string;
//   countryCode: string;
//   /** Inclusive lower weight (kg) */
//   weightFrom: number;
//   /** Inclusive upper weight (kg); same as weightFrom for single-point rows */
//   weightTo: number;
//   /** FLAT = total price for that slab; PER_KG = price × chargeable kg */
//   rateType: RateType;
//   price: number;
//   currency: string;
//   enabled: boolean;
//   notes: string;
//   createdAt: string;
//   updatedAt: string;
// };

// type Body = {
//   id?: string;
//   rateId?: string;
//   vendorName?: string;
//   vendorCode?: string;
//   country?: string;
//   countryCode?: string;
//   weightFrom?: number | string;
//   weightTo?: number | string;
//   rateType?: string;
//   price?: number | string;
//   currency?: string;
//   enabled?: boolean;
//   notes?: string;
// };

// function collectionRef() {
//   return adminDb.collection(
//     FIRESTORE_COLLECTIONS.CARRIER_RATES || "carrierRates",
//   );
// }

// function requireView(user: PermissionUser) {
//   return (
//     can(user, "LOGISTICS_RATE_VIEW") ||
//     can(user, "LOGISTICS_RATE_MANAGE") ||
//     can(user, "LOGISTICS_MASTERS_VIEW") ||
//     can(user, "LOGISTICS_MASTERS_MANAGE")
//   );
// }

// function requireManage(user: PermissionUser) {
//   return (
//     can(user, "LOGISTICS_RATE_MANAGE") ||
//     can(user, "LOGISTICS_MASTERS_MANAGE")
//   );
// }

// function num(v: unknown, fallback = 0): number {
//   const n = typeof v === "number" ? v : Number(v);
//   return Number.isFinite(n) ? n : fallback;
// }

// function str(v: unknown): string {
//   return String(v ?? "").trim();
// }

// function normalize(id: string, data: DocumentData): CarrierRateRecord {
//   const weightFrom = Math.max(0, num(data.weightFrom));
//   let weightTo = Math.max(0, num(data.weightTo, weightFrom));
//   if (weightTo < weightFrom) weightTo = weightFrom;

//   const rateTypeRaw = str(data.rateType).toUpperCase();
//   const rateType: RateType =
//     rateTypeRaw === "PER_KG" ? "PER_KG" : "FLAT";

//   return {
//     id,
//     rateId: str(data.rateId) || id,
//     vendorName: str(data.vendorName),
//     vendorCode: str(data.vendorCode),
//     country: str(data.country),
//     countryCode: str(data.countryCode).toUpperCase(),
//     weightFrom,
//     weightTo,
//     rateType,
//     price: Math.max(0, num(data.price)),
//     currency: str(data.currency) || "INR",
//     enabled: data.enabled === undefined ? true : Boolean(data.enabled),
//     notes: str(data.notes),
//     createdAt: str(data.createdAt) || new Date().toISOString(),
//     updatedAt: str(data.updatedAt) || new Date().toISOString(),
//   };
// }

// /** Public helper used by booking later */
// function matchCarrierRate(
//   rates: CarrierRateRecord[],
//   opts: {
//     vendorName?: string;
//     vendorCode?: string;
//     country?: string;
//     weightKg: number;
//   },
// ): CarrierRateRecord | null {
//   const weight = Math.max(0, Number(opts.weightKg) || 0);
//   if (weight <= 0) return null;

//   const vendorKey = str(opts.vendorName || opts.vendorCode).toUpperCase();
//   const countryKey = str(opts.country).toUpperCase();

//   const pool = rates.filter((r) => {
//     if (!r.enabled) return false;
//     const vOk =
//       !vendorKey ||
//       r.vendorName.toUpperCase() === vendorKey ||
//       r.vendorCode.toUpperCase() === vendorKey ||
//       r.vendorName.toUpperCase().startsWith(vendorKey);
//     const cOk =
//       !countryKey ||
//       r.country.toUpperCase() === countryKey ||
//       r.countryCode.toUpperCase() === countryKey ||
//       r.country.toUpperCase().includes(countryKey);
//     return vOk && cOk;
//   });

//   // Prefer exact / tightest band containing weight
//   const containing = pool
//     .filter((r) => weight >= r.weightFrom && weight <= r.weightTo)
//     .sort(
//       (a, b) =>
//         a.weightTo - a.weightFrom - (b.weightTo - b.weightFrom) ||
//         a.weightFrom - b.weightFrom,
//     );

//   if (containing.length > 0) return containing[0]!;

//   // Else nearest weightFrom <= weight (step table style)
//   const below = pool
//     .filter((r) => r.weightFrom <= weight)
//     .sort((a, b) => b.weightFrom - a.weightFrom);

//   return below[0] ?? null;
// }

// function computeFreightFromRate(
//   rate: CarrierRateRecord,
//   chargeableWeightKg: number,
// ): number {
//   const w = Math.max(0, Number(chargeableWeightKg) || 0);
//   if (rate.rateType === "PER_KG") {
//     return Math.round((rate.price * w + Number.EPSILON) * 100) / 100;
//   }
//   return Math.round((rate.price + Number.EPSILON) * 100) / 100;
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
//         "You do not have permission to view carrier rates.",
//         403,
//       );
//     }

//     const { searchParams } = new URL(request.url);
//     const vendor = searchParams.get("vendor")?.trim().toLowerCase() || "";
//     const country = searchParams.get("country")?.trim().toLowerCase() || "";
//     const enabledOnly = searchParams.get("enabled") === "true";

//     const snap = await collectionRef().get();
//     let rows = snap.docs.map((d) => normalize(d.id, d.data()));

//     if (vendor) {
//       rows = rows.filter(
//         (r) =>
//           r.vendorName.toLowerCase().includes(vendor) ||
//           r.vendorCode.toLowerCase().includes(vendor),
//       );
//     }
//     if (country) {
//       rows = rows.filter(
//         (r) =>
//           r.country.toLowerCase().includes(country) ||
//           r.countryCode.toLowerCase().includes(country),
//       );
//     }
//     if (enabledOnly) {
//       rows = rows.filter((r) => r.enabled);
//     }

//     rows.sort((a, b) => {
//       const v = a.vendorName.localeCompare(b.vendorName);
//       if (v !== 0) return v;
//       const c = a.country.localeCompare(b.country);
//       if (c !== 0) return c;
//       return a.weightFrom - b.weightFrom;
//     });

//     return successResponse({ items: rows, count: rows.length });
//   } catch (error) {
//     console.error("GET /api/logistics/carrier-rates:", error);
//     return errorResponse(
//       "CARRIER_RATES_LIST_FAILED",
//       error instanceof Error ? error.message : "Failed to load carrier rates.",
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
//         "You do not have permission to manage carrier rates.",
//         403,
//       );
//     }

//     let body: Body;
//     try {
//       body = (await request.json()) as Body;
//     } catch {
//       return errorResponse("INVALID_JSON", "Invalid JSON body.", 400);
//     }

//     const vendorName = str(body.vendorName);
//     const country = str(body.country);
//     const weightFrom = num(body.weightFrom);
//     const weightTo = num(body.weightTo, weightFrom);
//     const price = num(body.price);
//     const rateType: RateType =
//       str(body.rateType).toUpperCase() === "PER_KG" ? "PER_KG" : "FLAT";

//     if (!vendorName) {
//       return errorResponse("VALIDATION_ERROR", "Vendor name is required.", 400);
//     }
//     if (!country) {
//       return errorResponse("VALIDATION_ERROR", "Country is required.", 400);
//     }
//     if (weightFrom < 0 || weightTo < weightFrom) {
//       return errorResponse(
//         "VALIDATION_ERROR",
//         "Invalid weight range (weightFrom / weightTo).",
//         400,
//       );
//     }
//     if (price < 0) {
//       return errorResponse("VALIDATION_ERROR", "Price cannot be negative.", 400);
//     }

//     const now = new Date().toISOString();
//     const ref = collectionRef().doc();
//     const record: CarrierRateRecord = {
//       id: ref.id,
//       rateId: ref.id,
//       vendorName,
//       vendorCode: str(body.vendorCode),
//       country,
//       countryCode: str(body.countryCode).toUpperCase(),
//       weightFrom,
//       weightTo: weightTo || weightFrom,
//       rateType,
//       price,
//       currency: str(body.currency) || "INR",
//       enabled: body.enabled === false ? false : true,
//       notes: str(body.notes),
//       createdAt: now,
//       updatedAt: now,
//     };

//     await ref.set(record);

//     await writeAuditLog({
//       userId: user.userId,
//       action: "CARRIER_RATE_CREATE",
//       module: "LOGISTICS",
//       resourceType: "carrierRate",
//       resourceId: ref.id,
//       metadata: {
//         vendorName,
//         country,
//         weightFrom,
//         weightTo: record.weightTo,
//         price,
//         rateType,
//       },
//     });

//     return successResponse(record, 201, "Carrier rate created.");
//   } catch (error) {
//     console.error("POST /api/logistics/carrier-rates:", error);
//     return errorResponse(
//       "CARRIER_RATE_CREATE_FAILED",
//       error instanceof Error ? error.message : "Failed to create rate.",
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
//         "You do not have permission to manage carrier rates.",
//         403,
//       );
//     }

//     let body: Body;
//     try {
//       body = (await request.json()) as Body;
//     } catch {
//       return errorResponse("INVALID_JSON", "Invalid JSON body.", 400);
//     }

//     const id = str(body.id || body.rateId);
//     if (!id) {
//       return errorResponse("ID_REQUIRED", "id is required.", 400);
//     }

//     const ref = collectionRef().doc(id);
//     const existing = await ref.get();
//     if (!existing.exists) {
//       return errorResponse("NOT_FOUND", "Carrier rate not found.", 404);
//     }

//     const patch: Record<string, unknown> = {
//       updatedAt: new Date().toISOString(),
//     };

//     if (body.vendorName !== undefined) patch.vendorName = str(body.vendorName);
//     if (body.vendorCode !== undefined) patch.vendorCode = str(body.vendorCode);
//     if (body.country !== undefined) patch.country = str(body.country);
//     if (body.countryCode !== undefined) {
//       patch.countryCode = str(body.countryCode).toUpperCase();
//     }
//     if (body.weightFrom !== undefined) {
//       patch.weightFrom = Math.max(0, num(body.weightFrom));
//     }
//     if (body.weightTo !== undefined) {
//       patch.weightTo = Math.max(0, num(body.weightTo));
//     }
//     if (body.rateType !== undefined) {
//       patch.rateType =
//         str(body.rateType).toUpperCase() === "PER_KG" ? "PER_KG" : "FLAT";
//     }
//     if (body.price !== undefined) patch.price = Math.max(0, num(body.price));
//     if (body.currency !== undefined) {
//       patch.currency = str(body.currency) || "INR";
//     }
//     if (body.enabled !== undefined) patch.enabled = Boolean(body.enabled);
//     if (body.notes !== undefined) patch.notes = str(body.notes);

//     await ref.set(patch, { merge: true });

//     const updated = await ref.get();
//     const record = normalize(updated.id, updated.data() || {});

//     await writeAuditLog({
//       userId: user.userId,
//       action: "CARRIER_RATE_UPDATE",
//       module: "LOGISTICS",
//       resourceType: "carrierRate",
//       resourceId: id,
//       metadata: patch,
//     });

//     return successResponse(record, 200, "Carrier rate updated.");
//   } catch (error) {
//     console.error("PUT /api/logistics/carrier-rates:", error);
//     return errorResponse(
//       "CARRIER_RATE_UPDATE_FAILED",
//       error instanceof Error ? error.message : "Failed to update rate.",
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
//         "You do not have permission to delete carrier rates.",
//         403,
//       );
//     }

//     const id = new URL(request.url).searchParams.get("id")?.trim();
//     if (!id) {
//       return errorResponse("ID_REQUIRED", "id query param is required.", 400);
//     }

//     const ref = collectionRef().doc(id);
//     const existing = await ref.get();
//     if (!existing.exists) {
//       return errorResponse("NOT_FOUND", "Carrier rate not found.", 404);
//     }

//     const data = existing.data() || {};
//     await ref.delete();

//     await writeAuditLog({
//       userId: user.userId,
//       action: "CARRIER_RATE_DELETE",
//       module: "LOGISTICS",
//       resourceType: "carrierRate",
//       resourceId: id,
//       metadata: {
//         vendorName: data.vendorName,
//         country: data.country,
//         weightFrom: data.weightFrom,
//       },
//     });

//     return successResponse({ id }, 200, "Carrier rate deleted.");
//   } catch (error) {
//     console.error("DELETE /api/logistics/carrier-rates:", error);
//     return errorResponse(
//       "CARRIER_RATE_DELETE_FAILED",
//       error instanceof Error ? error.message : "Failed to delete rate.",
//       500,
//     );
//   }
// }

import { NextRequest } from "next/server";
import type { DocumentData } from "firebase-admin/firestore";

import { adminDb } from "@/lib/firebase-admin";
import { getCurrentUser } from "@/lib/auth";
import { can, type PermissionUser } from "@/lib/permissions";
import { writeAuditLog } from "@/lib/audit";
import { successResponse, errorResponse } from "@/lib/api-response";
import { FIRESTORE_COLLECTIONS } from "@/utils/constants";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RateType = "FLAT" | "PER_KG";

type CarrierRateRecord = {
  id: string;
  rateId: string;
  vendorName: string;
  vendorCode: string;
  country: string;
  countryCode: string;
  weightFrom: number;
  weightTo: number;
  rateType: RateType;
  price: number;
  currency: string;
  enabled: boolean;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

type Body = {
  id?: string;
  rateId?: string;
  vendorName?: string;
  vendorCode?: string;
  country?: string;
  countryCode?: string;
  weightFrom?: number | string;
  weightTo?: number | string;
  rateType?: string;
  price?: number | string;
  currency?: string;
  enabled?: boolean;
  notes?: string;
};

function collectionRef() {
  return adminDb.collection(
    FIRESTORE_COLLECTIONS.CARRIER_RATES || "carrierRates",
  );
}

function requireView(user: PermissionUser) {
  return (
    can(user, "LOGISTICS_RATE_VIEW") ||
    can(user, "LOGISTICS_RATE_MANAGE") ||
    can(user, "LOGISTICS_MASTERS_VIEW") ||
    can(user, "LOGISTICS_MASTERS_MANAGE")
  );
}

function requireManage(user: PermissionUser) {
  return (
    can(user, "LOGISTICS_RATE_MANAGE") ||
    can(user, "LOGISTICS_MASTERS_MANAGE")
  );
}

function num(v: unknown, fallback = 0): number {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function str(v: unknown): string {
  return String(v ?? "").trim();
}

function normalize(id: string, data: DocumentData): CarrierRateRecord {
  const weightFrom = Math.max(0, num(data.weightFrom));
  let weightTo = Math.max(0, num(data.weightTo, weightFrom));
  if (weightTo < weightFrom) weightTo = weightFrom;

  const rateTypeRaw = str(data.rateType).toUpperCase();
  const rateType: RateType =
    rateTypeRaw === "PER_KG" ? "PER_KG" : "FLAT";

  return {
    id,
    rateId: str(data.rateId) || id,
    vendorName: str(data.vendorName),
    vendorCode: str(data.vendorCode),
    country: str(data.country),
    countryCode: str(data.countryCode).toUpperCase(),
    weightFrom,
    weightTo,
    rateType,
    price: Math.max(0, num(data.price)),
    currency: str(data.currency) || "INR",
    enabled: data.enabled === undefined ? true : Boolean(data.enabled),
    notes: str(data.notes),
    createdAt: str(data.createdAt) || new Date().toISOString(),
    updatedAt: str(data.updatedAt) || new Date().toISOString(),
  };
}

/** Internal helpers — do NOT export from this route file */
function matchCarrierRate(
  rates: CarrierRateRecord[],
  opts: {
    vendorName?: string;
    vendorCode?: string;
    country?: string;
    weightKg: number;
  },
): CarrierRateRecord | null {
  const weight = Math.max(0, Number(opts.weightKg) || 0);
  if (weight <= 0) return null;

  const vendorKey = str(opts.vendorName || opts.vendorCode).toUpperCase();
  const countryKey = str(opts.country).toUpperCase();

  const pool = rates.filter((r) => {
    if (!r.enabled) return false;
    const vOk =
      !vendorKey ||
      r.vendorName.toUpperCase() === vendorKey ||
      r.vendorCode.toUpperCase() === vendorKey ||
      r.vendorName.toUpperCase().startsWith(vendorKey);
    const cOk =
      !countryKey ||
      r.country.toUpperCase() === countryKey ||
      r.countryCode.toUpperCase() === countryKey ||
      r.country.toUpperCase().includes(countryKey);
    return vOk && cOk;
  });

  const containing = pool
    .filter((r) => weight >= r.weightFrom && weight <= r.weightTo)
    .sort(
      (a, b) =>
        a.weightTo - a.weightFrom - (b.weightTo - b.weightFrom) ||
        a.weightFrom - b.weightFrom,
    );

  if (containing.length > 0) return containing[0]!;

  const below = pool
    .filter((r) => r.weightFrom <= weight)
    .sort((a, b) => b.weightFrom - a.weightFrom);

  return below[0] ?? null;
}

/** Match "UK EXPRESS", "UKEXPRESS", "uk-express" the same way */
function normalizeVendorKey(v: unknown): string {
  return String(v ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function computeFreightFromRate(
  rate: CarrierRateRecord,
  chargeableWeightKg: number,
): number {
  const w = Math.max(0, Number(chargeableWeightKg) || 0);
  if (rate.rateType === "PER_KG") {
    return Math.round((rate.price * w + Number.EPSILON) * 100) / 100;
  }
  return Math.round((rate.price + Number.EPSILON) * 100) / 100;
}

// silence unused if not referenced in handlers yet
void matchCarrierRate;
void computeFreightFromRate;

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

    if (!requireView(user)) {
      return errorResponse(
        "FORBIDDEN",
        "You do not have permission to view carrier rates.",
        403,
      );
    }

    const { searchParams } = new URL(request.url);
    const vendor = searchParams.get("vendor")?.trim().toLowerCase() || "";
    const country = searchParams.get("country")?.trim().toLowerCase() || "";
    const enabledOnly = searchParams.get("enabled") === "true";

    // const snap = await collectionRef().get();
    // let rows = snap.docs.map((d) => normalize(d.id, d.data()));

    // if (vendor) {
    //   rows = rows.filter(
    //     (r) =>
    //       r.vendorName.toLowerCase().includes(vendor) ||
    //       r.vendorCode.toLowerCase().includes(vendor),
    //   );
    // }
    // if (country) {
    //   rows = rows.filter(
    //     (r) =>
    //       r.country.toLowerCase().includes(country) ||
    //       r.countryCode.toLowerCase().includes(country),
    //   );
    // }
    // if (enabledOnly) {
    //   rows = rows.filter((r) => r.enabled);
    // }

        const snap = await collectionRef().get();
    let rows = snap.docs.map((d) => normalize(d.id, d.data()));

    if (vendor) {
      const vendorNorm = normalizeVendorKey(vendor);
      rows = rows.filter((r) => {
        const nameNorm = normalizeVendorKey(r.vendorName);
        const codeNorm = normalizeVendorKey(r.vendorCode);
        return (
          nameNorm.includes(vendorNorm) ||
          vendorNorm.includes(nameNorm) ||
          codeNorm.includes(vendorNorm) ||
          vendorNorm.includes(codeNorm) ||
          r.vendorName.toLowerCase().includes(vendor) ||
          r.vendorCode.toLowerCase().includes(vendor)
        );
      });
    }
    if (country) {
      rows = rows.filter(
        (r) =>
          r.country.toLowerCase().includes(country) ||
          r.countryCode.toLowerCase().includes(country),
      );
    }
    if (enabledOnly) {
      rows = rows.filter((r) => r.enabled);
    }

    rows.sort((a, b) => {
      const v = a.vendorName.localeCompare(b.vendorName);
      if (v !== 0) return v;
      const c = a.country.localeCompare(b.country);
      if (c !== 0) return c;
      return a.weightFrom - b.weightFrom;
    });

    return successResponse({ items: rows, count: rows.length });
  } catch (error) {
    console.error("GET /api/logistics/carrier-rates:", error);
    return errorResponse(
      "CARRIER_RATES_LIST_FAILED",
      error instanceof Error ? error.message : "Failed to load carrier rates.",
      500,
    );
  }
}

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

    if (!requireManage(user)) {
      return errorResponse(
        "FORBIDDEN",
        "You do not have permission to create carrier rates.",
        403,
      );
    }

    const body = (await request.json()) as Body;
    const vendorName = str(body.vendorName);
    const country = str(body.country);
    const weightFrom = Math.max(0, num(body.weightFrom));
    let weightTo = Math.max(0, num(body.weightTo, weightFrom));
    if (weightTo < weightFrom) weightTo = weightFrom;
    const price = Math.max(0, num(body.price));
    const rateType: RateType =
      str(body.rateType).toUpperCase() === "PER_KG" ? "PER_KG" : "FLAT";

    if (!vendorName) {
      return errorResponse("VALIDATION_ERROR", "vendorName is required.", 400);
    }
    if (!country) {
      return errorResponse("VALIDATION_ERROR", "country is required.", 400);
    }
    if (price < 0) {
      return errorResponse("VALIDATION_ERROR", "price is invalid.", 400);
    }

    const now = new Date().toISOString();
    const ref = collectionRef().doc();

    const record: Omit<CarrierRateRecord, "id"> & { createdBy: string } = {
      rateId: ref.id,
      vendorName,
      vendorCode: str(body.vendorCode),
      country,
      countryCode: str(body.countryCode).toUpperCase(),
      weightFrom,
      weightTo,
      rateType,
      price,
      currency: str(body.currency) || "INR",
      enabled: body.enabled === undefined ? true : Boolean(body.enabled),
      notes: str(body.notes),
      createdAt: now,
      updatedAt: now,
      createdBy: user.userId,
    };

    await ref.set(record);

    await writeAuditLog({
      userId: user.userId,
      action: "CARRIER_RATE_CREATE",
      module: "LOGISTICS",
      resourceType: "carrierRate",
      resourceId: ref.id,
      metadata: {
        vendorName,
        country,
        weightFrom,
        weightTo,
        price,
      },
    });

    return successResponse(
      normalize(ref.id, { ...record }),
      201,
      "Carrier rate created.",
    );
  } catch (error) {
    console.error("POST /api/logistics/carrier-rates:", error);
    return errorResponse(
      "CARRIER_RATE_CREATE_FAILED",
      error instanceof Error ? error.message : "Failed to create rate.",
      500,
    );
  }
}

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

    if (!requireManage(user)) {
      return errorResponse(
        "FORBIDDEN",
        "You do not have permission to update carrier rates.",
        403,
      );
    }

    const body = (await request.json()) as Body;
    const id = str(body.id || body.rateId);
    if (!id) {
      return errorResponse("VALIDATION_ERROR", "id is required.", 400);
    }

    const ref = collectionRef().doc(id);
    const existing = await ref.get();
    if (!existing.exists) {
      return errorResponse("NOT_FOUND", "Carrier rate not found.", 404);
    }

    const patch: Record<string, unknown> = {
      updatedAt: new Date().toISOString(),
      updatedBy: user.userId,
    };

    if (body.vendorName !== undefined) patch.vendorName = str(body.vendorName);
    if (body.vendorCode !== undefined) patch.vendorCode = str(body.vendorCode);
    if (body.country !== undefined) patch.country = str(body.country);
    if (body.countryCode !== undefined) {
      patch.countryCode = str(body.countryCode).toUpperCase();
    }
    if (body.weightFrom !== undefined) {
      patch.weightFrom = Math.max(0, num(body.weightFrom));
    }
    if (body.weightTo !== undefined) {
      patch.weightTo = Math.max(0, num(body.weightTo));
    }
    if (body.rateType !== undefined) {
      patch.rateType =
        str(body.rateType).toUpperCase() === "PER_KG" ? "PER_KG" : "FLAT";
    }
    if (body.price !== undefined) patch.price = Math.max(0, num(body.price));
    if (body.currency !== undefined) {
      patch.currency = str(body.currency) || "INR";
    }
    if (body.enabled !== undefined) patch.enabled = Boolean(body.enabled);
    if (body.notes !== undefined) patch.notes = str(body.notes);

    await ref.set(patch, { merge: true });

    const updated = await ref.get();
    const record = normalize(updated.id, updated.data() || {});

    await writeAuditLog({
      userId: user.userId,
      action: "CARRIER_RATE_UPDATE",
      module: "LOGISTICS",
      resourceType: "carrierRate",
      resourceId: id,
      metadata: patch,
    });

    return successResponse(record, 200, "Carrier rate updated.");
  } catch (error) {
    console.error("PUT /api/logistics/carrier-rates:", error);
    return errorResponse(
      "CARRIER_RATE_UPDATE_FAILED",
      error instanceof Error ? error.message : "Failed to update rate.",
      500,
    );
  }
}

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

    if (!requireManage(user)) {
      return errorResponse(
        "FORBIDDEN",
        "You do not have permission to delete carrier rates.",
        403,
      );
    }

    const id = new URL(request.url).searchParams.get("id")?.trim();
    if (!id) {
      return errorResponse("ID_REQUIRED", "id query param is required.", 400);
    }

    const ref = collectionRef().doc(id);
    const existing = await ref.get();
    if (!existing.exists) {
      return errorResponse("NOT_FOUND", "Carrier rate not found.", 404);
    }

    const data = existing.data() || {};
    await ref.delete();

    await writeAuditLog({
      userId: user.userId,
      action: "CARRIER_RATE_DELETE",
      module: "LOGISTICS",
      resourceType: "carrierRate",
      resourceId: id,
      metadata: {
        vendorName: data.vendorName,
        country: data.country,
        weightFrom: data.weightFrom,
      },
    });

    return successResponse({ id }, 200, "Carrier rate deleted.");
  } catch (error) {
    console.error("DELETE /api/logistics/carrier-rates:", error);
    return errorResponse(
      "CARRIER_RATE_DELETE_FAILED",
      error instanceof Error ? error.message : "Failed to delete rate.",
      500,
    );
  }
}