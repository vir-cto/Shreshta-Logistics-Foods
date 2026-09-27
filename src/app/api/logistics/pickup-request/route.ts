// import { NextRequest } from "next/server";
// import { FieldValue } from "firebase-admin/firestore";

// import { adminDb } from "@/lib/firebase-admin";
// import { successResponse, errorResponse } from "@/lib/api-response";
// import { FIRESTORE_COLLECTIONS } from "@/utils/constants";
// import {
//   isValidEmail,
//   isValidPhone,
//   isValidIndianPinCode,
//   validateRequiredFields,
// } from "@/utils/validators";

// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();

//     const name = String(body.name || "").trim();
//     const phone = String(body.phone || "").trim();
//     const email = String(body.email || "").trim();
//     const date = String(body.date || "").trim();
//     const address = String(body.address || "").trim();
//     const city = String(body.city || "").trim();
//     const pinCode = String(body.pinCode || "").trim();
//     const shipmentType = String(body.shipmentType || "").trim();
//     const weight =
//       body.weight === undefined || body.weight === ""
//         ? null
//         : Number(body.weight);
//     const message = String(body.message || "").trim();

//     const required = validateRequiredFields(
//       {
//         name,
//         phone,
//         date,
//         address,
//         city,
//         pinCode,
//         shipmentType,
//       },
//       {
//         name: "Name",
//         phone: "Phone",
//         date: "Preferred date",
//         address: "Pickup address",
//         city: "City",
//         pinCode: "PIN code",
//         shipmentType: "Shipment type",
//       },
//     );

//     if (!required.valid) {
//       const firstError = Object.values(required.errors)[0];
//       return errorResponse("VALIDATION_ERROR", firstError, 400);
//     }

//     if (!isValidPhone(phone)) {
//       return errorResponse(
//         "INVALID_PHONE",
//         "Please enter a valid Indian phone number.",
//         400,
//       );
//     }

//     if (email && !isValidEmail(email)) {
//       return errorResponse(
//         "INVALID_EMAIL",
//         "Please enter a valid email address.",
//         400,
//       );
//     }

//     if (!isValidIndianPinCode(pinCode)) {
//       return errorResponse(
//         "INVALID_PIN",
//         "Please enter a valid 6-digit PIN code.",
//         400,
//       );
//     }

//     if (weight !== null && (!Number.isFinite(weight) || weight < 0)) {
//       return errorResponse(
//         "INVALID_WEIGHT",
//         "Weight must be a valid non-negative number.",
//         400,
//       );
//     }

//     const allowedTypes = ["document", "parcel", "commercial", "cargo"];
//     if (!allowedTypes.includes(shipmentType)) {
//       return errorResponse(
//         "INVALID_SHIPMENT_TYPE",
//         "Invalid shipment type.",
//         400,
//       );
//     }

//     // Basic date check (YYYY-MM-DD)
//     const preferredDate = new Date(date);
//     if (Number.isNaN(preferredDate.getTime())) {
//       return errorResponse(
//         "INVALID_DATE",
//         "Please enter a valid preferred date.",
//         400,
//       );
//     }

//     const ref = adminDb
//       .collection(FIRESTORE_COLLECTIONS.PICKUP_REQUESTS)
//       .doc();

//     const payload = {
//       id: ref.id,
//       pickupRequestId: ref.id,
//       name,
//       phone,
//       email: email || null,
//       preferredDate: date,
//       address,
//       city,
//       pinCode,
//       shipmentType,
//       weight,
//       message: message || null,
//       status: "NEW",
//       source: "PUBLIC_PICKUP_REQUEST",
//       createdAt: FieldValue.serverTimestamp(),
//       updatedAt: FieldValue.serverTimestamp(),
//     };

//     await ref.set(payload);

//     return successResponse(
//       {
//         pickupRequestId: ref.id,
//         status: "NEW",
//       },
//       201,
//       "Pickup request submitted successfully.",
//     );
//   } catch (error) {
//     console.error("POST /api/logistics/pickup-request:", error);
//     return errorResponse(
//       "PICKUP_REQUEST_FAILED",
//       "Unable to submit pickup request right now.",
//       500,
//     );
//   }
// }

import { NextRequest } from "next/server";
import { FieldValue, type DocumentData } from "firebase-admin/firestore";

import { adminDb } from "@/lib/firebase-admin";
import { getCurrentUser } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { successResponse, errorResponse } from "@/lib/api-response";
import { FIRESTORE_COLLECTIONS } from "@/utils/constants";
import {
  isValidEmail,
  isValidPhone,
  isValidIndianPinCode,
  validateRequiredFields,
} from "@/utils/validators";

type PickupStatus =
  | "NEW"
  | "CONTACTED"
  | "SCHEDULED"
  | "COMPLETED"
  | "CANCELLED";

const ALLOWED_STATUSES: PickupStatus[] = [
  "NEW",
  "CONTACTED",
  "SCHEDULED",
  "COMPLETED",
  "CANCELLED",
];

function collectionRef() {
  return adminDb.collection(FIRESTORE_COLLECTIONS.PICKUP_REQUESTS);
}

function normalizePickup(id: string, data: DocumentData) {
  const statusRaw = String(data.status || "NEW").toUpperCase();
  const status = ALLOWED_STATUSES.includes(statusRaw as PickupStatus)
    ? (statusRaw as PickupStatus)
    : "NEW";

  const createdAt =
    data.createdAt && typeof data.createdAt.toDate === "function"
      ? data.createdAt.toDate().toISOString()
      : String(data.createdAt || "");

  const updatedAt =
    data.updatedAt && typeof data.updatedAt.toDate === "function"
      ? data.updatedAt.toDate().toISOString()
      : String(data.updatedAt || createdAt);

  return {
    id,
    pickupRequestId: String(data.pickupRequestId || id),
    name: String(data.name || "").trim(),
    phone: String(data.phone || "").trim(),
    email: data.email ? String(data.email).trim() : null,
    preferredDate: String(data.preferredDate || data.date || "").trim(),
    address: String(data.address || "").trim(),
    city: String(data.city || "").trim(),
    pinCode: String(data.pinCode || "").trim(),
    shipmentType: String(data.shipmentType || "").trim(),
    weight:
      data.weight === null || data.weight === undefined
        ? null
        : Number(data.weight),
    message: data.message ? String(data.message).trim() : null,
    status,
    source: String(data.source || "PUBLIC_PICKUP_REQUEST"),
    createdAt,
    updatedAt,
  };
}

/** Public submit — no auth */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const name = String(body.name || "").trim();
    const phone = String(body.phone || "").trim();
    const email = String(body.email || "").trim();
    const date = String(body.date || "").trim();
    const address = String(body.address || "").trim();
    const city = String(body.city || "").trim();
    const pinCode = String(body.pinCode || "").trim();
    const shipmentType = String(body.shipmentType || "").trim();
    const weight =
      body.weight === undefined || body.weight === ""
        ? null
        : Number(body.weight);
    const message = String(body.message || "").trim();

    const required = validateRequiredFields(
      {
        name,
        phone,
        date,
        address,
        city,
        pinCode,
        shipmentType,
      },
      {
        name: "Name",
        phone: "Phone",
        date: "Preferred date",
        address: "Pickup address",
        city: "City",
        pinCode: "PIN code",
        shipmentType: "Shipment type",
      },
    );

    if (!required.valid) {
      const firstError = Object.values(required.errors)[0];
      return errorResponse("VALIDATION_ERROR", firstError, 400);
    }

    if (!isValidPhone(phone)) {
      return errorResponse(
        "INVALID_PHONE",
        "Please enter a valid Indian phone number.",
        400,
      );
    }

    if (email && !isValidEmail(email)) {
      return errorResponse(
        "INVALID_EMAIL",
        "Please enter a valid email address.",
        400,
      );
    }

    if (!isValidIndianPinCode(pinCode)) {
      return errorResponse(
        "INVALID_PIN",
        "Please enter a valid 6-digit PIN code.",
        400,
      );
    }

    if (weight !== null && (!Number.isFinite(weight) || weight < 0)) {
      return errorResponse(
        "INVALID_WEIGHT",
        "Weight must be a valid non-negative number.",
        400,
      );
    }

    const allowedTypes = ["document", "parcel", "commercial", "cargo"];
    if (!allowedTypes.includes(shipmentType)) {
      return errorResponse(
        "INVALID_SHIPMENT_TYPE",
        "Invalid shipment type.",
        400,
      );
    }

    const preferredDate = new Date(date);
    if (Number.isNaN(preferredDate.getTime())) {
      return errorResponse(
        "INVALID_DATE",
        "Please enter a valid preferred date.",
        400,
      );
    }

    const ref = collectionRef().doc();

    const payload = {
      id: ref.id,
      pickupRequestId: ref.id,
      name,
      phone,
      email: email || null,
      preferredDate: date,
      address,
      city,
      pinCode,
      shipmentType,
      weight,
      message: message || null,
      status: "NEW" as const,
      source: "PUBLIC_PICKUP_REQUEST",
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    await ref.set(payload);

    return successResponse(
      {
        pickupRequestId: ref.id,
        status: "NEW",
      },
      201,
      "Pickup request submitted successfully.",
    );
  } catch (error) {
    console.error("POST /api/logistics/pickup-request:", error);
    return errorResponse(
      "PICKUP_REQUEST_FAILED",
      "Unable to submit pickup request right now.",
      500,
    );
  }
}

/** Admin list */
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return errorResponse("UNAUTHENTICATED", "Authentication is required.", 401);
    }

    if (
      !can(user, "LOGISTICS_AWB_VIEW") &&
      !can(user, "LOGISTICS_TRACKING_VIEW")
    ) {
      return errorResponse(
        "FORBIDDEN",
        "You do not have permission to view pickup requests.",
        403,
      );
    }

    const { searchParams } = new URL(request.url);
    const statusFilter = String(searchParams.get("status") || "")
      .trim()
      .toUpperCase();
    const limitRaw = Number(searchParams.get("limit") || 100);
    const limit = Math.min(Math.max(1, limitRaw || 100), 300);

    const snapshot = await collectionRef().limit(limit).get();

    let rows = snapshot.docs.map((doc) =>
      normalizePickup(doc.id, doc.data() || {}),
    );

    if (statusFilter && statusFilter !== "ALL") {
      rows = rows.filter((r) => r.status === statusFilter);
    }

    rows.sort((a, b) => {
      const ta = a.createdAt || "";
      const tb = b.createdAt || "";
      return tb.localeCompare(ta);
    });

    return successResponse({
      results: rows,
      count: rows.length,
    });
  } catch (error) {
    console.error("GET /api/logistics/pickup-request:", error);
    return errorResponse(
      "PICKUP_LIST_FAILED",
      "Unable to load pickup requests.",
      500,
    );
  }
}

/** Admin update status */
export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return errorResponse("UNAUTHENTICATED", "Authentication is required.", 401);
    }

    if (
      !can(user, "LOGISTICS_AWB_UPDATE") &&
      !can(user, "LOGISTICS_TRACKING_UPDATE")
    ) {
      return errorResponse(
        "FORBIDDEN",
        "You do not have permission to update pickup requests.",
        403,
      );
    }

    let body: {
      pickupRequestId?: string;
      id?: string;
      status?: string;
    };
    try {
      body = await request.json();
    } catch {
      return errorResponse("INVALID_JSON", "Invalid JSON body.", 400);
    }

    const id = String(body.pickupRequestId || body.id || "").trim();
    const statusRaw = String(body.status || "").trim().toUpperCase();

    if (!id) {
      return errorResponse(
        "VALIDATION_ERROR",
        "pickupRequestId is required.",
        400,
      );
    }

    if (!ALLOWED_STATUSES.includes(statusRaw as PickupStatus)) {
      return errorResponse(
        "INVALID_STATUS",
        `Status must be one of: ${ALLOWED_STATUSES.join(", ")}`,
        400,
      );
    }

    const ref = collectionRef().doc(id);
    const snap = await ref.get();
    if (!snap.exists) {
      return errorResponse("NOT_FOUND", "Pickup request not found.", 404);
    }

    await ref.set(
      {
        status: statusRaw,
        updatedAt: FieldValue.serverTimestamp(),
        updatedBy: user.userId,
      },
      { merge: true },
    );

    const updated = await ref.get();
    const record = normalizePickup(updated.id, updated.data() || {});

    return successResponse(record, 200, "Pickup request updated.");
  } catch (error) {
    console.error("PATCH /api/logistics/pickup-request:", error);
    return errorResponse(
      "PICKUP_UPDATE_FAILED",
      "Unable to update pickup request.",
      500,
    );
  }
}

/** Admin delete */
export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return errorResponse("UNAUTHENTICATED", "Authentication is required.", 401);
    }

    if (
      !can(user, "LOGISTICS_AWB_UPDATE") &&
      !can(user, "LOGISTICS_TRACKING_UPDATE")
    ) {
      return errorResponse(
        "FORBIDDEN",
        "You do not have permission to delete pickup requests.",
        403,
      );
    }

    const { searchParams } = new URL(request.url);
    let id = String(searchParams.get("id") || searchParams.get("pickupRequestId") || "").trim();

    if (!id) {
      try {
        const body = await request.json();
        id = String(body?.pickupRequestId || body?.id || "").trim();
      } catch {
        // no body
      }
    }

    if (!id) {
      return errorResponse(
        "VALIDATION_ERROR",
        "pickupRequestId is required.",
        400,
      );
    }

    const ref = collectionRef().doc(id);
    const snap = await ref.get();
    if (!snap.exists) {
      return errorResponse("NOT_FOUND", "Pickup request not found.", 404);
    }

    await ref.delete();

    return successResponse(
      { pickupRequestId: id, deleted: true },
      200,
      "Pickup request deleted.",
    );
  } catch (error) {
    console.error("DELETE /api/logistics/pickup-request:", error);
    return errorResponse(
      "PICKUP_DELETE_FAILED",
      "Unable to delete pickup request.",
      500,
    );
  }
}