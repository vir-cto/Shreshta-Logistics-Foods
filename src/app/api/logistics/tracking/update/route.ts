// import { NextRequest } from "next/server";

// import {
//   adminDb,
// } from "@/lib/firebase-admin";

// import {
//   getCurrentUser,
// } from "@/lib/auth";

// import {
//   can,
// } from "@/lib/permissions";

// import {
//   writeAuditLog,
// } from "@/lib/audit";

// import {
//   successResponse,
//   errorResponse,
// } from "@/lib/api-response";

// import {
//   isValidAWB,
//   requiredString,
// } from "@/utils/validators";

// import {
//   TRACKING_STATUSES,
//   type TrackingStatus,
// } from "@/types/tracking";

// type TrackingUpdateBody = {
//   awb?: string;

//   status?: TrackingStatus;

//   trackingStageId?: string;

//   location?: string;

//   remarks?: string;

//   eventTime?: string;
// };

// export async function POST(
//   request: NextRequest,
// ) {
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
//       !can(
//         user,
//         "LOGISTICS_TRACKING_UPDATE",
//       )
//     ) {
//       return errorResponse(
//         "FORBIDDEN",
//         "You do not have permission to update tracking.",
//         403,
//       );
//     }

//     let body: TrackingUpdateBody;

//     try {
//       body =
//         await request.json();
//     } catch {
//       return errorResponse(
//         "INVALID_JSON",
//         "Invalid JSON request body.",
//         400,
//       );
//     }

//     const awb =
//       requiredString(
//         body.awb,
//         "awb",
//       );

//     if (!isValidAWB(awb)) {
//       return errorResponse(
//         "INVALID_AWB",
//         "Invalid AWB.",
//         400,
//       );
//     }

//     const status =
//       body.status;

//     if (
//       !status ||
//       !TRACKING_STATUSES.includes(
//         status,
//       )
//     ) {
//       return errorResponse(
//         "INVALID_TRACKING_STATUS",
//         "Invalid tracking status.",
//         400,
//       );
//     }

//     const awbQuery =
//       await adminDb
//         .collection("awbs")
//         .where(
//           "awb",
//           "==",
//           awb,
//         )
//         .limit(1)
//         .get();

//     if (awbQuery.empty) {
//       return errorResponse(
//         "AWB_NOT_FOUND",
//         "AWB was not found.",
//         404,
//       );
//     }

//     const awbDoc =
//       awbQuery.docs[0];

//     const current =
//       awbDoc.data();

//     if (
//       current.currentStatus ===
//         "CANCELLED" &&
//       status !== "CANCELLED"
//     ) {
//       return errorResponse(
//         "CANCELLED_AWB",
//         "A cancelled shipment cannot be moved to another status.",
//         409,
//       );
//     }

//     if (
//       current.currentStatus ===
//         "DELIVERED" &&
//       status !== "DELIVERED"
//     ) {
//       return errorResponse(
//         "DELIVERED_AWB",
//         "A delivered shipment cannot be moved to another status.",
//         409,
//       );
//     }

//     const now =
//       body.eventTime ??
//       new Date().toISOString();

//     const eventRef =
//       adminDb
//         .collection(
//           "trackingEvents",
//         )
//         .doc();

//     const trackingEvent = {
//       trackingEventId:
//         eventRef.id,

//       awb,

//       trackingStageId:
//         body.trackingStageId ??
//         status,

//       status,

//       location:
//         body.location?.trim() ??
//         null,

//       remarks:
//         body.remarks?.trim() ??
//         null,

//       eventTime: now,

//       createdBy:
//         user.userId,

//       createdAt:
//         new Date().toISOString(),
//     };

//     const batch =
//       adminDb.batch();

//     batch.set(
//       eventRef,
//       trackingEvent,
//     );

//     batch.update(
//       awbDoc.ref,
//       {
//         currentStatus:
//           status,

//         latestLocation:
//           body.location?.trim() ??
//           current.latestLocation ??
//           null,

//         updatedBy:
//           user.userId,

//         updatedAt:
//           new Date().toISOString(),
//       },
//     );

//     await batch.commit();

//     await writeAuditLog({
//       userId:
//         user.userId,
//       action:
//         "TRACKING_STATUS_CHANGED",
//       resourceType:
//         "AWB",
//       resourceId:
//         awb,
//       metadata: {
//         previousStatus:
//           current.currentStatus,
//         newStatus:
//           status,
//         location:
//           body.location ??
//           null,
//         trackingEventId:
//           eventRef.id,
//       },
//     });

//     return successResponse(
//       {
//         trackingEventId:
//           eventRef.id,

//         awb,

//         status,

//         event:
//           trackingEvent,
//       },
//       201,
//       "Tracking updated successfully.",
//     );
//   } catch (error) {
//     console.error(
//       "POST /api/logistics/tracking/update:",
//       error,
//     );

//     return errorResponse(
//       "TRACKING_UPDATE_FAILED",
//       error instanceof Error
//         ? error.message
//         : "Unable to update tracking.",
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
// import { isValidAWB } from "@/utils/validators";
// import { TRACKING_STATUSES, type TrackingStatus } from "@/types/tracking";
// import { FIRESTORE_COLLECTIONS } from "@/utils/constants";

// // type TrackingUpdateBody = {
// //   awb?: string;
// //   status?: string;
// //   trackingStageId?: string;
// //   location?: string;
// //   remarks?: string;
// //   eventTime?: string;
// // };

// type TrackingUpdateBody = {
//   awb?: string;
//   status?: string;
//   trackingStageId?: string;
//   location?: string;
//   remarks?: string;
//   eventTime?: string;
//   forwardingNumber?: string;
// };

// async function isAllowedStage(code: string): Promise<boolean> {
//   const normalized = code.trim().toUpperCase();
//   if (!normalized) return false;

//   // Built-in statuses
//   if ((TRACKING_STATUSES as readonly string[]).includes(normalized)) {
//     return true;
//   }

//   // Stages from Tracking Matrix (Configure stages)
//   try {
//     const col =
//       FIRESTORE_COLLECTIONS.TRACKING_STAGE_CONFIGS || "trackingStageConfigs";
//     const snap = await adminDb.collection(col).get();
//     for (const doc of snap.docs) {
//       const d = doc.data() || {};
//       const stageCode = String(d.code || d.trackingStageId || doc.id)
//         .trim()
//         .toUpperCase();
//       const enabled =
//         d.enabled === undefined
//           ? String(d.status || "ACTIVE").toUpperCase() !== "INACTIVE"
//           : Boolean(d.enabled);
//       if (enabled && stageCode === normalized) return true;
//     }
//   } catch (e) {
//     console.warn("Could not load tracking stages for validation:", e);
//   }

//   return false;
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

//     if (!can(user, "LOGISTICS_TRACKING_UPDATE")) {
//       return errorResponse(
//         "FORBIDDEN",
//         "You do not have permission to update tracking.",
//         403,
//       );
//     }

//     let body: TrackingUpdateBody;
//     try {
//       body = await request.json();
//     } catch {
//       return errorResponse("INVALID_JSON", "Invalid JSON request body.", 400);
//     }

//     const awb = String(body.awb || "").trim();
//     if (!awb) {
//       return errorResponse("VALIDATION", "AWB is required.", 400);
//     }
//     if (!isValidAWB(awb)) {
//       return errorResponse("INVALID_AWB", "Invalid AWB.", 400);
//     }

//     const status = String(body.status || body.trackingStageId || "")
//       .trim()
//       .toUpperCase();

//     if (!status) {
//       return errorResponse(
//         "INVALID_TRACKING_STATUS",
//         "Tracking status is required.",
//         400,
//       );
//     }

//     if (!(await isAllowedStage(status))) {
//       return errorResponse(
//         "INVALID_TRACKING_STATUS",
//         `Invalid tracking status "${status}". Use a stage from Configure stages.`,
//         400,
//       );
//     }

//     const location = String(body.location || "").trim();
//     if (!location) {
//       return errorResponse("VALIDATION", "Location is required.", 400);
//     }
//     const forwardingNumber = String(body.forwardingNumber || "").trim();

//     // Prefer exact AWB match; also try uppercase
//     let awbQuery = await adminDb
//       .collection("awbs")
//       .where("awb", "==", awb)
//       .limit(1)
//       .get();

//     if (awbQuery.empty && awb !== awb.toUpperCase()) {
//       awbQuery = await adminDb
//         .collection("awbs")
//         .where("awb", "==", awb.toUpperCase())
//         .limit(1)
//         .get();
//     }

//     if (awbQuery.empty) {
//       return errorResponse("AWB_NOT_FOUND", "AWB was not found.", 404);
//     }

//     const awbDoc = awbQuery.docs[0]!;
//     const current = awbDoc.data() || {};
//     const storedAwb = String(current.awb || awb).trim();

//     if (
//       current.currentStatus === "CANCELLED" &&
//       status !== "CANCELLED"
//     ) {
//       return errorResponse(
//         "CANCELLED_AWB",
//         "A cancelled shipment cannot be moved to another status.",
//         409,
//       );
//     }

//     if (
//       current.currentStatus === "DELIVERED" &&
//       status !== "DELIVERED"
//     ) {
//       return errorResponse(
//         "DELIVERED_AWB",
//         "A delivered shipment cannot be moved to another status.",
//         409,
//       );
//     }

//     const now = body.eventTime || new Date().toISOString();

//     const eventRef = adminDb.collection("trackingEvents").doc();

//     // const trackingEvent = {
//     //   trackingEventId: eventRef.id,
//     //   awb: storedAwb,
//     //   trackingStageId: String(body.trackingStageId || status).trim().toUpperCase(),
//     //   status,
//     //   location,
//     //   remarks: body.remarks?.trim() || null,
//     //   eventTime: now,
//     //   createdBy: user.userId,
//     //   createdAt: new Date().toISOString(),
//     // };

//     // const batch = adminDb.batch();

//     // batch.set(eventRef, trackingEvent);

//     // batch.update(awbDoc.ref, {
//     //   currentStatus: status,
//     //   latestLocation: location,
//     //   updatedBy: user.userId,
//     //   updatedAt: new Date().toISOString(),
//     // });

//         const trackingEvent = {
//       trackingEventId: eventRef.id,
//       awb: storedAwb,
//       trackingStageId: String(body.trackingStageId || status)
//         .trim()
//         .toUpperCase(),
//       status,
//       location,
//       remarks: body.remarks?.trim() || null,
//       forwardingNumber: forwardingNumber || null,
//       eventTime: now,
//       createdBy: user.userId,
//       createdAt: new Date().toISOString(),
//     };

//     const batch = adminDb.batch();

//     batch.set(eventRef, trackingEvent);

//     const awbPatch: Record<string, unknown> = {
//       currentStatus: status,
//       latestLocation: location,
//       updatedBy: user.userId,
//       updatedAt: new Date().toISOString(),
//     };

//     // Only overwrite when admin sent a value
//     if (forwardingNumber) {
//       awbPatch.forwardingNumber = forwardingNumber;
//       awbPatch.forwardingNo = forwardingNumber;
//     }

//     batch.update(awbDoc.ref, awbPatch);
    
//     await batch.commit();

//     try {
//       await writeAuditLog({
//         userId: user.userId,
//         action: "TRACKING_STATUS_CHANGED",
//         resourceType: "AWB",
//         resourceId: storedAwb,
//         metadata: {
//           previousStatus: current.currentStatus ?? null,
//           newStatus: status,
//           location,
//           trackingEventId: eventRef.id,
//         },
//       });
//     } catch (auditErr) {
//       console.warn("Audit log failed (tracking still saved):", auditErr);
//     }

//     return successResponse(
//       {
//         trackingEventId: eventRef.id,
//         awb: storedAwb,
//         status,
//         event: trackingEvent,
//       },
//       201,
//       "Tracking updated successfully.",
//     );
//   } catch (error) {
//     console.error("POST /api/logistics/tracking/update:", error);
//     return errorResponse(
//       "TRACKING_UPDATE_FAILED",
//       error instanceof Error ? error.message : "Unable to update tracking.",
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
import { isValidAWB } from "@/utils/validators";
import { TRACKING_STATUSES } from "@/types/tracking";
import { FIRESTORE_COLLECTIONS } from "@/utils/constants";

type TrackingUpdateBody = {
  awb?: string;
  status?: string;
  trackingStageId?: string;
  location?: string;
  remarks?: string;
  eventTime?: string;
  forwardingNumber?: string;
};

async function isAllowedStage(code: string): Promise<boolean> {
  const normalized = code.trim().toUpperCase();
  if (!normalized) return false;

  if ((TRACKING_STATUSES as readonly string[]).includes(normalized)) {
    return true;
  }

  try {
    const col =
      FIRESTORE_COLLECTIONS.TRACKING_STAGE_CONFIGS || "trackingStageConfigs";
    const snap = await adminDb.collection(col).get();
    for (const doc of snap.docs) {
      const d = doc.data() || {};
      const stageCode = String(d.code || d.trackingStageId || doc.id)
        .trim()
        .toUpperCase();
      const enabled =
        d.enabled === undefined
          ? String(d.status || "ACTIVE").toUpperCase() !== "INACTIVE"
          : Boolean(d.enabled);
      if (enabled && stageCode === normalized) return true;
    }
  } catch (e) {
    console.warn("Could not load tracking stages for validation:", e);
  }

  return false;
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

    if (!can(user, "LOGISTICS_TRACKING_UPDATE")) {
      return errorResponse(
        "FORBIDDEN",
        "You do not have permission to update tracking.",
        403,
      );
    }

    let body: TrackingUpdateBody;
    try {
      body = await request.json();
    } catch {
      return errorResponse("INVALID_JSON", "Invalid JSON request body.", 400);
    }

    const awb = String(body.awb || "").trim();
    if (!awb) {
      return errorResponse("VALIDATION", "AWB is required.", 400);
    }
    if (!isValidAWB(awb)) {
      return errorResponse("INVALID_AWB", "Invalid AWB.", 400);
    }

    const status = String(body.status || body.trackingStageId || "")
      .trim()
      .toUpperCase();

    if (!status) {
      return errorResponse(
        "INVALID_TRACKING_STATUS",
        "Tracking status is required.",
        400,
      );
    }

    if (!(await isAllowedStage(status))) {
      return errorResponse(
        "INVALID_TRACKING_STATUS",
        `Invalid tracking status "${status}". Use a stage from Configure stages.`,
        400,
      );
    }

    const location = String(body.location || "").trim();
    if (!location) {
      return errorResponse("VALIDATION", "Location is required.", 400);
    }

    const forwardingNumber = String(body.forwardingNumber || "").trim();
    const remarks = body.remarks?.trim() || null;
    const now = body.eventTime || new Date().toISOString();

    let awbQuery = await adminDb
      .collection("awbs")
      .where("awb", "==", awb)
      .limit(1)
      .get();

    if (awbQuery.empty && awb !== awb.toUpperCase()) {
      awbQuery = await adminDb
        .collection("awbs")
        .where("awb", "==", awb.toUpperCase())
        .limit(1)
        .get();
    }

    if (awbQuery.empty) {
      return errorResponse("AWB_NOT_FOUND", "AWB was not found.", 404);
    }

    const awbDoc = awbQuery.docs[0]!;
    const current = awbDoc.data() || {};
    const storedAwb = String(current.awb || awb).trim();

    if (current.currentStatus === "CANCELLED" && status !== "CANCELLED") {
      return errorResponse(
        "CANCELLED_AWB",
        "A cancelled shipment cannot be moved to another status.",
        409,
      );
    }

    if (current.currentStatus === "DELIVERED" && status !== "DELIVERED") {
      return errorResponse(
        "DELIVERED_AWB",
        "A delivered shipment cannot be moved to another status.",
        409,
      );
    }

    // Find existing event for same AWB + status (update instead of duplicate)
    const existingSnap = await adminDb
      .collection("trackingEvents")
      .where("awb", "==", storedAwb)
      .where("status", "==", status)
      .limit(20)
      .get();

    // Prefer most recent if multiple already exist
    let existingDoc = existingSnap.empty ? null : existingSnap.docs[0]!;
    if (existingSnap.size > 1) {
      existingDoc = [...existingSnap.docs].sort((a, b) => {
        const ta = new Date(
          String(a.data().eventTime || a.data().createdAt || 0),
        ).getTime();
        const tb = new Date(
          String(b.data().eventTime || b.data().createdAt || 0),
        ).getTime();
        return tb - ta;
      })[0]!;
    }

    const batch = adminDb.batch();
    let trackingEventId: string;
    let trackingEvent: Record<string, unknown>;
    let wasUpdated = false;

    if (existingDoc) {
      wasUpdated = true;
      trackingEventId = existingDoc.id;
      trackingEvent = {
        trackingEventId,
        awb: storedAwb,
        trackingStageId: String(body.trackingStageId || status)
          .trim()
          .toUpperCase(),
        status,
        location,
        remarks,
        forwardingNumber: forwardingNumber || existingDoc.data().forwardingNumber || null,
        eventTime: now,
        updatedBy: user.userId,
        updatedAt: new Date().toISOString(),
        // keep original createdBy / createdAt
        createdBy: existingDoc.data().createdBy ?? user.userId,
        createdAt:
          existingDoc.data().createdAt || new Date().toISOString(),
      };
      batch.update(existingDoc.ref, {
        location,
        remarks,
        forwardingNumber: forwardingNumber || null,
        eventTime: now,
        trackingStageId: trackingEvent.trackingStageId,
        updatedBy: user.userId,
        updatedAt: new Date().toISOString(),
      });

      // Remove extra duplicates for same awb+status (keep the one we updated)
      for (const d of existingSnap.docs) {
        if (d.id !== existingDoc.id) {
          batch.delete(d.ref);
        }
      }
    } else {
      const eventRef = adminDb.collection("trackingEvents").doc();
      trackingEventId = eventRef.id;
      trackingEvent = {
        trackingEventId,
        awb: storedAwb,
        trackingStageId: String(body.trackingStageId || status)
          .trim()
          .toUpperCase(),
        status,
        location,
        remarks,
        forwardingNumber: forwardingNumber || null,
        eventTime: now,
        createdBy: user.userId,
        createdAt: new Date().toISOString(),
      };
      batch.set(eventRef, trackingEvent);
    }

    const awbPatch: Record<string, unknown> = {
      currentStatus: status,
      latestLocation: location,
      updatedBy: user.userId,
      updatedAt: new Date().toISOString(),
    };

    if (forwardingNumber) {
      awbPatch.forwardingNumber = forwardingNumber;
      awbPatch.forwardingNo = forwardingNumber;
    }

    batch.update(awbDoc.ref, awbPatch);
    await batch.commit();

    try {
      await writeAuditLog({
        userId: user.userId,
        action: wasUpdated
          ? "TRACKING_STATUS_UPDATED"
          : "TRACKING_STATUS_CHANGED",
        resourceType: "AWB",
        resourceId: storedAwb,
        metadata: {
          previousStatus: current.currentStatus ?? null,
          newStatus: status,
          location,
          trackingEventId,
          upsert: wasUpdated ? "update" : "create",
        },
      });
    } catch (auditErr) {
      console.warn("Audit log failed (tracking still saved):", auditErr);
    }

    return successResponse(
      {
        trackingEventId,
        awb: storedAwb,
        status,
        event: trackingEvent,
        updated: wasUpdated,
      },
      wasUpdated ? 200 : 201,
      wasUpdated
        ? "Tracking stage updated (location/time refreshed)."
        : "Tracking updated successfully.",
    );
  } catch (error) {
    console.error("POST /api/logistics/tracking/update:", error);
    return errorResponse(
      "TRACKING_UPDATE_FAILED",
      error instanceof Error ? error.message : "Unable to update tracking.",
      500,
    );
  }
}