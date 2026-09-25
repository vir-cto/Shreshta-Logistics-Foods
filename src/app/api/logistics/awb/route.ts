import { NextRequest } from "next/server";

import { adminDb } from "@/lib/firebase-admin";
import { getCurrentUser } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { writeAuditLog } from "@/lib/audit";
import { successResponse, errorResponse } from "@/lib/api-response";
import { FIRESTORE_COLLECTIONS } from "@/utils/constants";

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

    const role = String(user.role || "").toUpperCase();
    const allowed =
      role === "SUPER_ADMIN" ||
      role === "ADMIN" ||
      can(user, "LOGISTICS_AWB_CREATE");

    if (!allowed) {
      return errorResponse(
        "FORBIDDEN",
        "You do not have permission to delete an AWB.",
        403,
      );
    }

    const { searchParams } = new URL(request.url);
    let awb = (searchParams.get("awb") || searchParams.get("id") || "").trim();

    if (!awb) {
      try {
        const body = await request.json();
        awb = String(body?.awb || body?.id || "").trim();
      } catch {
        // no body
      }
    }

    if (!awb) {
      return errorResponse(
        "VALIDATION_ERROR",
        "AWB number is required.",
        400,
      );
    }

    const awbsCol = adminDb.collection(
      FIRESTORE_COLLECTIONS.AWBS || "awbs",
    );

    let ref = awbsCol.doc(awb);
    let snap = await ref.get();

    if (!snap.exists) {
      const byField = await awbsCol.where("awb", "==", awb).limit(1).get();
      if (byField.empty) {
        return errorResponse(
          "AWB_NOT_FOUND",
          `AWB ${awb} was not found.`,
          404,
        );
      }
      ref = byField.docs[0]!.ref;
      snap = byField.docs[0]!;
    }

    const data = snap.data() || {};
    const batch = adminDb.batch();

    const childAwbs = Array.isArray(data.childAwbs) ? data.childAwbs : [];

    for (const child of childAwbs) {
      const childAwb = String(
        typeof child === "object" && child !== null
          ? (child as { awb?: string }).awb || ""
          : child,
      ).trim();
      if (!childAwb) continue;

      batch.delete(awbsCol.doc(childAwb));

      const childEvents = await adminDb
        .collection("trackingEvents")
        .where("awb", "==", childAwb)
        .limit(50)
        .get();
      childEvents.docs.forEach((d) => batch.delete(d.ref));
    }

    batch.delete(ref);

    const parentEvents = await adminDb
      .collection("trackingEvents")
      .where("awb", "==", awb)
      .limit(50)
      .get();
    parentEvents.docs.forEach((d) => batch.delete(d.ref));

    await batch.commit();

    await writeAuditLog({
      userId: user.userId,
      action: "AWB_DELETED",
      resourceType: "AWB",
      resourceId: awb,
      module: "LOGISTICS",
      metadata: {
        deletedAwb: awb,
        childAwbs,
        deletedByRole: user.role,
      },
    });

    return successResponse(
      { awb, deleted: true },
      200,
      `AWB ${awb} deleted.`,
    );
  } catch (error) {
    console.error("DELETE /api/logistics/awb failed", error);
    return errorResponse(
      "AWB_DELETE_FAILED",
      error instanceof Error ? error.message : "Failed to delete AWB.",
      500,
    );
  }
}