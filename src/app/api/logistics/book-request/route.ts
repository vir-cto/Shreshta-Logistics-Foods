// import { NextRequest } from "next/server";
// import { FieldValue } from "firebase-admin/firestore";

// import { adminDb } from "@/lib/firebase-admin";
// import { successResponse, errorResponse } from "@/lib/api-response";
// import {
//   isValidEmail,
//   isValidPhone,
//   validateRequiredFields,
// } from "@/utils/validators";

// const BOOKING_REQUESTS = "bookingRequests";

// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();

//     const name = String(body.name || "").trim();
//     const phone = String(body.phone || "").trim();
//     const email = String(body.email || "").trim();
//     const shipmentType = String(body.shipmentType || "").trim();
//     const origin = String(body.origin || "").trim();
//     const destination = String(body.destination || "").trim();
//     const weight =
//       body.weight === undefined || body.weight === ""
//         ? null
//         : Number(body.weight);
//     const service = String(body.service || "").trim();
//     const message = String(body.message || "").trim();

//     const required = validateRequiredFields(
//       { name, phone, shipmentType, origin, destination },
//       {
//         name: "Full name",
//         phone: "Phone",
//         shipmentType: "Shipment type",
//         origin: "Origin",
//         destination: "Destination",
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

//     if (weight !== null && (!Number.isFinite(weight) || weight < 0)) {
//       return errorResponse(
//         "INVALID_WEIGHT",
//         "Weight must be a valid non-negative number.",
//         400,
//       );
//     }

//     const allowedShipmentTypes = [
//       "document",
//       "parcel",
//       "commercial",
//       "cargo",
//     ];
//     if (!allowedShipmentTypes.includes(shipmentType)) {
//       return errorResponse(
//         "INVALID_SHIPMENT_TYPE",
//         "Invalid shipment type.",
//         400,
//       );
//     }

//     const ref = adminDb.collection(BOOKING_REQUESTS).doc();

//     const payload = {
//       id: ref.id,
//       bookingRequestId: ref.id,
//       name,
//       phone,
//       email: email || null,
//       shipmentType,
//       origin,
//       destination,
//       weight,
//       service: service || null,
//       message: message || null,
//       status: "NEW",
//       source: "PUBLIC_BOOK_FREIGHT",
//       createdAt: FieldValue.serverTimestamp(),
//       updatedAt: FieldValue.serverTimestamp(),
//     };

//     await ref.set(payload);

//     return successResponse(
//       {
//         bookingRequestId: ref.id,
//         status: "NEW",
//       },
//       201,
//       "Booking request submitted successfully.",
//     );
//   } catch (error) {
//     console.error("POST /api/logistics/book-request:", error);
//     return errorResponse(
//       "BOOK_REQUEST_FAILED",
//       "Unable to submit booking request right now.",
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
import {
  isValidEmail,
  isValidPhone,
  validateRequiredFields,
} from "@/utils/validators";

const BOOKING_REQUESTS = "bookingRequests";

type BookingStatus =
  | "NEW"
  | "CONTACTED"
  | "QUOTED"
  | "CONVERTED"
  | "CANCELLED";

const ALLOWED_STATUSES: BookingStatus[] = [
  "NEW",
  "CONTACTED",
  "QUOTED",
  "CONVERTED",
  "CANCELLED",
];

function collectionRef() {
  return adminDb.collection(BOOKING_REQUESTS);
}

function normalizeBooking(id: string, data: DocumentData) {
  const statusRaw = String(data.status || "NEW").toUpperCase();
  const status = ALLOWED_STATUSES.includes(statusRaw as BookingStatus)
    ? (statusRaw as BookingStatus)
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
    bookingRequestId: String(data.bookingRequestId || id),
    name: String(data.name || "").trim(),
    phone: String(data.phone || "").trim(),
    email: data.email ? String(data.email).trim() : null,
    shipmentType: String(data.shipmentType || "").trim(),
    origin: String(data.origin || "").trim(),
    destination: String(data.destination || "").trim(),
    weight:
      data.weight === null || data.weight === undefined
        ? null
        : Number(data.weight),
    service: data.service ? String(data.service).trim() : null,
    message: data.message ? String(data.message).trim() : null,
    status,
    source: String(data.source || "PUBLIC_BOOK_FREIGHT"),
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
    const shipmentType = String(body.shipmentType || "").trim();
    const origin = String(body.origin || "").trim();
    const destination = String(body.destination || "").trim();
    const weight =
      body.weight === undefined || body.weight === ""
        ? null
        : Number(body.weight);
    const service = String(body.service || "").trim();
    const message = String(body.message || "").trim();

    const required = validateRequiredFields(
      { name, phone, shipmentType, origin, destination },
      {
        name: "Full name",
        phone: "Phone",
        shipmentType: "Shipment type",
        origin: "Origin",
        destination: "Destination",
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

    if (weight !== null && (!Number.isFinite(weight) || weight < 0)) {
      return errorResponse(
        "INVALID_WEIGHT",
        "Weight must be a valid non-negative number.",
        400,
      );
    }

    const allowedShipmentTypes = [
      "document",
      "parcel",
      "commercial",
      "cargo",
    ];
    if (!allowedShipmentTypes.includes(shipmentType)) {
      return errorResponse(
        "INVALID_SHIPMENT_TYPE",
        "Invalid shipment type.",
        400,
      );
    }

    const ref = collectionRef().doc();

    const payload = {
      id: ref.id,
      bookingRequestId: ref.id,
      name,
      phone,
      email: email || null,
      shipmentType,
      origin,
      destination,
      weight,
      service: service || null,
      message: message || null,
      status: "NEW" as const,
      source: "PUBLIC_BOOK_FREIGHT",
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    await ref.set(payload);

    return successResponse(
      {
        bookingRequestId: ref.id,
        status: "NEW",
      },
      201,
      "Booking request submitted successfully.",
    );
  } catch (error) {
    console.error("POST /api/logistics/book-request:", error);
    return errorResponse(
      "BOOK_REQUEST_FAILED",
      "Unable to submit booking request right now.",
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
        "You do not have permission to view booking requests.",
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
      normalizeBooking(doc.id, doc.data() || {}),
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
    console.error("GET /api/logistics/book-request:", error);
    return errorResponse(
      "BOOK_REQUEST_LIST_FAILED",
      "Unable to load booking requests.",
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
        "You do not have permission to update booking requests.",
        403,
      );
    }

    let body: {
      bookingRequestId?: string;
      id?: string;
      status?: string;
    };
    try {
      body = await request.json();
    } catch {
      return errorResponse("INVALID_JSON", "Invalid JSON body.", 400);
    }

    const id = String(body.bookingRequestId || body.id || "").trim();
    const statusRaw = String(body.status || "").trim().toUpperCase();

    if (!id) {
      return errorResponse(
        "VALIDATION_ERROR",
        "bookingRequestId is required.",
        400,
      );
    }

    if (!ALLOWED_STATUSES.includes(statusRaw as BookingStatus)) {
      return errorResponse(
        "INVALID_STATUS",
        `Status must be one of: ${ALLOWED_STATUSES.join(", ")}`,
        400,
      );
    }

    const ref = collectionRef().doc(id);
    const snap = await ref.get();
    if (!snap.exists) {
      return errorResponse("NOT_FOUND", "Booking request not found.", 404);
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
    const record = normalizeBooking(updated.id, updated.data() || {});

    return successResponse(record, 200, "Booking request updated.");
  } catch (error) {
    console.error("PATCH /api/logistics/book-request:", error);
    return errorResponse(
      "BOOK_REQUEST_UPDATE_FAILED",
      "Unable to update booking request.",
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
        "You do not have permission to delete booking requests.",
        403,
      );
    }

    const { searchParams } = new URL(request.url);
    let id = String(
      searchParams.get("id") || searchParams.get("bookingRequestId") || "",
    ).trim();

    if (!id) {
      try {
        const body = await request.json();
        id = String(body?.bookingRequestId || body?.id || "").trim();
      } catch {
        // no body
      }
    }

    if (!id) {
      return errorResponse(
        "VALIDATION_ERROR",
        "bookingRequestId is required.",
        400,
      );
    }

    const ref = collectionRef().doc(id);
    const snap = await ref.get();
    if (!snap.exists) {
      return errorResponse("NOT_FOUND", "Booking request not found.", 404);
    }

    await ref.delete();

    return successResponse(
      { bookingRequestId: id, deleted: true },
      200,
      "Booking request deleted.",
    );
  } catch (error) {
    console.error("DELETE /api/logistics/book-request:", error);
    return errorResponse(
      "BOOK_REQUEST_DELETE_FAILED",
      "Unable to delete booking request.",
      500,
    );
  }
}