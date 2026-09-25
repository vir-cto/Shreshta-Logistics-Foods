import { NextRequest, NextResponse } from "next/server";

import { adminDb } from "@/lib/firebase-admin";
import { getCurrentUser } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { FIRESTORE_COLLECTIONS } from "@/utils/constants";
import {
  generateFoodOrderBillPdf,
  isFoodOrderBillEligible,
  type FoodBillData,
  type FoodBillItem,
} from "@/lib/pdf/foodOrderBillGenerator";

export const runtime = "nodejs";

function bytesToBase64(bytes: Uint8Array): string {
  return Buffer.from(bytes).toString("base64");
}

function mapItems(raw: unknown): FoodBillItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((entry) => {
    const row = (entry || {}) as Record<string, unknown>;
    const quantity = Number(row.quantity || 0);
    const price = Number(row.price || 0);
    const amount = Number(
      row.amount !== undefined ? row.amount : price * quantity,
    );
    return {
      productName: String(row.productName || row.name || "Product"),
      variantName: String(
        row.variantName || row.variantLabel || row.label || "—",
      ),
      quantity: Number.isFinite(quantity) ? quantity : 0,
      price: Number.isFinite(price) ? price : 0,
      amount: Number.isFinite(amount) ? amount : 0,
    };
  });
}

function formatAddress(customer: Record<string, unknown> | null): string {
  if (!customer) return "";
  return [
    customer.addressLine1,
    customer.addressLine2,
    customer.city,
    customer.state,
    customer.postalCode,
    customer.country,
  ]
    .map((p) => String(p || "").trim())
    .filter(Boolean)
    .join(", ");
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ orderId: string }> | { orderId: string } },
) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "UNAUTHENTICATED",
            message: "Authentication is required.",
          },
        },
        { status: 401 },
      );
    }

    if (!can(user, "FOOD_ORDER_VIEW")) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "FORBIDDEN",
            message: "You do not have permission to download bills.",
          },
        },
        { status: 403 },
      );
    }

    const resolved =
      typeof (context.params as Promise<{ orderId: string }>).then ===
      "function"
        ? await (context.params as Promise<{ orderId: string }>)
        : (context.params as { orderId: string });

    let orderId = String(resolved.orderId || "").trim();
    try {
      orderId = decodeURIComponent(orderId);
    } catch {
      // keep
    }

    if (!orderId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "ORDER_ID_REQUIRED",
            message: "orderId is required.",
          },
        },
        { status: 400 },
      );
    }

    const snap = await adminDb
      .collection(FIRESTORE_COLLECTIONS.FOOD_ORDERS)
      .doc(orderId)
      .get();

    if (!snap.exists) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "ORDER_NOT_FOUND",
            message: "Order was not found.",
          },
        },
        { status: 404 },
      );
    }

    const data = snap.data() || {};
    const customer =
      (data.customer as Record<string, unknown> | undefined) || null;
    const paymentReference =
      (data.paymentReference as Record<string, unknown> | undefined) ||
      undefined;

    const paymentStatus = String(
      data.paymentStatus ||
        paymentReference?.paymentStatus ||
        paymentReference?.status ||
        "PENDING",
    );
    const status = String(
      data.status || data.currentStatus || "PENDING_PAYMENT",
    );

    if (!isFoodOrderBillEligible({ paymentStatus, status })) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "BILL_NOT_AVAILABLE",
            message: "Bill is available only after successful payment.",
          },
        },
        { status: 400 },
      );
    }

    let storeName = "Sreshta Foods";
    let supportEmail = "";
    let supportPhone = "";
    try {
      const settingsSnap = await adminDb
        .collection(
          (FIRESTORE_COLLECTIONS as Record<string, string>).FOOD_SETTINGS ||
            "settings",
        )
        .doc("food")
        .get();
      if (settingsSnap.exists) {
        const s = settingsSnap.data() || {};
        if (s.storeName) storeName = String(s.storeName);
        if (s.supportEmail) supportEmail = String(s.supportEmail);
        if (s.supportPhone) supportPhone = String(s.supportPhone);
      }
    } catch {
      // ignore
    }

    const billData: FoodBillData = {
      orderId: String(data.orderId || orderId),
      billNumber: `BILL-${String(data.orderId || orderId).slice(-10)}`,
      orderDate: data.createdAt ? String(data.createdAt) : undefined,
      paidAt: data.updatedAt ? String(data.updatedAt) : undefined,
      storeName,
      supportEmail,
      supportPhone,
      customerName: String(
        customer?.name || data.customerName || "Customer",
      ),
      customerPhone: String(customer?.phone || data.customerPhone || ""),
      customerEmail: String(customer?.email || data.customerEmail || ""),
      shippingAddress: formatAddress(customer),
      items: mapItems(data.items),
      subtotal: Number(data.subtotal || 0),
      deliveryFee: Number(data.deliveryFee || 0),
      discount: Number(data.discount || 0),
      total: Number(data.total || 0),
      currency: String(data.currency || "INR"),
      paymentStatus,
      paymentProvider: String(paymentReference?.provider || "CASHFREE"),
      paymentReferenceId: paymentReference?.paymentReferenceId
        ? String(paymentReference.paymentReferenceId)
        : undefined,
      cashfreeOrderId: paymentReference?.cashfreeOrderId
        ? String(paymentReference.cashfreeOrderId)
        : undefined,
      couponId: data.couponId ? String(data.couponId) : undefined,
    };

    const pdfBytes = await generateFoodOrderBillPdf(billData);
    const fileName = `Food_Bill_${billData.orderId}.pdf`;

    const { searchParams } = new URL(request.url);
    const asBase64 = searchParams.get("format") === "base64";

    if (asBase64) {
      return NextResponse.json({
        success: true,
        pdf: bytesToBase64(pdfBytes),
        fileName,
        orderId: billData.orderId,
      });
    }

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("GET /api/food/orders/[orderId]/bill", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "BILL_GENERATE_FAILED",
          message:
            error instanceof Error
              ? error.message
              : "Unable to generate bill.",
        },
      },
      { status: 500 },
    );
  }
}