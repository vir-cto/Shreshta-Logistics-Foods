// import { NextRequest } from "next/server";
// import type { DocumentData } from "firebase-admin/firestore";

// import { adminDb } from "@/lib/firebase-admin";
// import { getCurrentUser } from "@/lib/auth";
// import { can } from "@/lib/permissions";
// import { writeAuditLog } from "@/lib/audit";
// import { successResponse, errorResponse } from "@/lib/api-response";

// type ProductStatus = "ACTIVE" | "INACTIVE";

// type ProductRecord = {
//   id: string;
//   productId: string;
//   name: string;
//   code?: string;
//   description?: string;
//   status: ProductStatus;
//   enabled: boolean;
//   createdAt: string;
//   updatedAt: string;
// };

// type CreateBody = {
//   name?: string;
//   code?: string;
//   description?: string;
//   status?: ProductStatus;
// };

// type UpdateBody = CreateBody & {
//   productId?: string;
// };

// const COLLECTION = "logisticsProducts";

// function productsRef() {
//   return adminDb.collection(COLLECTION);
// }

// function normalizeProduct(id: string, data: DocumentData): ProductRecord {
//   const statusRaw = String(data.status || "ACTIVE").toUpperCase();
//   const enabled =
//     data.enabled === undefined
//       ? statusRaw !== "INACTIVE"
//       : Boolean(data.enabled);

//   return {
//     id,
//     productId: String(data.productId || id),
//     name: String(data.name || "").trim(),
//     code: data.code ? String(data.code).trim() : undefined,
//     description: data.description
//       ? String(data.description).trim()
//       : undefined,
//     status: enabled ? "ACTIVE" : "INACTIVE",
//     enabled,
//     createdAt: String(data.createdAt || new Date().toISOString()),
//     updatedAt: String(data.updatedAt || data.createdAt || new Date().toISOString()),
//   };
// }

// function validatePayload(body: CreateBody, partial: boolean): string[] {
//   const errors: string[] = [];
//   if (!partial || body.name !== undefined) {
//     if (!String(body.name || "").trim()) {
//       errors.push("Product name is required.");
//     }
//   }
//   if (body.status !== undefined && body.status !== "ACTIVE" && body.status !== "INACTIVE") {
//     errors.push("Status must be ACTIVE or INACTIVE.");
//   }
//   return errors;
// }

// export async function GET(request: NextRequest) {
//   try {
//     const user = await getCurrentUser(request);
//     if (!user) {
//       return errorResponse("UNAUTHORIZED", "Authentication is required.", 401);
//     }

//     const { searchParams } = new URL(request.url);
//     const status = String(searchParams.get("status") || "").toUpperCase();
//     const q = String(searchParams.get("q") || "").trim().toLowerCase();

//     const snap = await productsRef().get();
//     let products = snap.docs.map((doc) => normalizeProduct(doc.id, doc.data() || {}));

//     if (status === "ACTIVE" || status === "INACTIVE") {
//       products = products.filter((p) => p.status === status);
//     }
//     if (q) {
//       products = products.filter((p) =>
//         [p.productId, p.name, p.code, p.description]
//           .filter(Boolean)
//           .join(" ")
//           .toLowerCase()
//           .includes(q),
//       );
//     }

//     products.sort((a, b) => a.name.localeCompare(b.name));
//     return successResponse(products);
//   } catch (error) {
//     console.error("GET /api/logistics/shipment-products failed", error);
//     return errorResponse(
//       "PRODUCTS_LIST_FAILED",
//       error instanceof Error ? error.message : "Failed to load products.",
//       500,
//     );
//   }
// }

// export async function POST(request: NextRequest) {
//   try {
//     const user = await getCurrentUser(request);
//     if (!user) {
//       return errorResponse("UNAUTHORIZED", "Authentication is required.", 401);
//     }
//     if (
//       !can(user, "LOGISTICS_AWB_CREATE") &&
//       user.role !== "SUPER_ADMIN" &&
//       user.role !== "ADMIN"
//     ) {
//       return errorResponse(
//         "FORBIDDEN",
//         "You do not have permission to create products.",
//         403,
//       );
//     }

//     let body: CreateBody;
//     try {
//       body = (await request.json()) as CreateBody;
//     } catch {
//       return errorResponse("INVALID_JSON", "Invalid JSON request body.", 400);
//     }

//     const errors = validatePayload(body, false);
//     if (errors.length > 0) {
//       return errorResponse("VALIDATION_ERROR", errors[0]!, 400);
//     }

//     const now = new Date().toISOString();
//     const ref = productsRef().doc();
//     const enabled = body.status !== "INACTIVE";

//     const record: ProductRecord = {
//       id: ref.id,
//       productId: ref.id,
//       name: body.name!.trim(),
//       code: body.code?.trim() || undefined,
//       description: body.description?.trim() || undefined,
//       status: enabled ? "ACTIVE" : "INACTIVE",
//       enabled,
//       createdAt: now,
//       updatedAt: now,
//     };

//     await ref.set(record);

//     try {
//       await writeAuditLog({
//         userId: user.userId,
//         action: "LOGISTICS_PRODUCT_CREATE",
//         module: "LOGISTICS",
//         resourceType: "logistics_product",
//         resourceId: record.productId,
//         metadata: { name: record.name, code: record.code },
//       });
//     } catch (e) {
//       console.error("audit LOGISTICS_PRODUCT_CREATE failed", e);
//     }

//     return successResponse(record, 201, "Product created.");
//   } catch (error) {
//     console.error("POST /api/logistics/shipment-products failed", error);
//     return errorResponse(
//       "PRODUCT_CREATE_FAILED",
//       error instanceof Error ? error.message : "Failed to create product.",
//       500,
//     );
//   }
// }

// export async function PATCH(request: NextRequest) {
//   try {
//     const user = await getCurrentUser(request);
//     if (!user) {
//       return errorResponse("UNAUTHORIZED", "Authentication is required.", 401);
//     }
//     if (
//       !can(user, "LOGISTICS_AWB_CREATE") &&
//       user.role !== "SUPER_ADMIN" &&
//       user.role !== "ADMIN"
//     ) {
//       return errorResponse(
//         "FORBIDDEN",
//         "You do not have permission to update products.",
//         403,
//       );
//     }

//     let body: UpdateBody;
//     try {
//       body = (await request.json()) as UpdateBody;
//     } catch {
//       return errorResponse("INVALID_JSON", "Invalid JSON request body.", 400);
//     }

//     const productId = String(body.productId || "").trim();
//     if (!productId) {
//       return errorResponse("VALIDATION_ERROR", "productId is required.", 400);
//     }

//     const ref = productsRef().doc(productId);
//     const snap = await ref.get();
//     if (!snap.exists) {
//       return errorResponse("NOT_FOUND", "Product not found.", 404);
//     }

//     const isStatusOnly =
//       body.status !== undefined &&
//       body.name === undefined &&
//       body.code === undefined &&
//       body.description === undefined;

//     if (!isStatusOnly) {
//       const errors = validatePayload(body, true);
//       if (errors.length > 0) {
//         return errorResponse("VALIDATION_ERROR", errors[0]!, 400);
//       }
//     }

//     const patch: Record<string, unknown> = {
//       updatedAt: new Date().toISOString(),
//     };

//     if (body.name !== undefined) patch.name = body.name.trim();
//     if (body.code !== undefined) patch.code = body.code.trim() || null;
//     if (body.description !== undefined) {
//       patch.description = body.description.trim() || null;
//     }
//     if (body.status !== undefined) {
//       patch.status = body.status;
//       patch.enabled = body.status === "ACTIVE";
//     }

//     await ref.set(patch, { merge: true });

//     const updated = await ref.get();
//     const record = normalizeProduct(updated.id, updated.data() || {});

//     try {
//       await writeAuditLog({
//         userId: user.userId,
//         action: "LOGISTICS_PRODUCT_UPDATE",
//         module: "LOGISTICS",
//         resourceType: "logistics_product",
//         resourceId: record.productId,
//         metadata: patch,
//       });
//     } catch (e) {
//       console.error("audit LOGISTICS_PRODUCT_UPDATE failed", e);
//     }

//     return successResponse(record, 200, "Product updated.");
//   } catch (error) {
//     console.error("PATCH /api/logistics/shipment-products failed", error);
//     return errorResponse(
//       "PRODUCT_UPDATE_FAILED",
//       error instanceof Error ? error.message : "Failed to update product.",
//       500,
//     );
//   }
// }

import { NextRequest } from "next/server";
import type { DocumentData } from "firebase-admin/firestore";

import { adminDb } from "@/lib/firebase-admin";
import { getCurrentUser } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-response";
import { FIRESTORE_COLLECTIONS } from "@/utils/constants";

const COLLECTION =
  (FIRESTORE_COLLECTIONS as Record<string, string>).SHIPMENT_PRODUCTS ||
  "shipmentProducts";

type ProductStatus = "ACTIVE" | "INACTIVE";

type ProductRecord = {
  id: string;
  productId: string;
  name: string;
  code: string | null;
  description: string | null;
  status: ProductStatus;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
};

function normalize(id: string, data: DocumentData): ProductRecord {
  const statusRaw = String(data.status || "ACTIVE").toUpperCase();
  const enabled =
    data.enabled === undefined
      ? statusRaw !== "INACTIVE"
      : Boolean(data.enabled);

  return {
    id,
    productId: String(data.productId || id),
    name: String(data.name || "").trim(),
    code: data.code != null && String(data.code).trim()
      ? String(data.code).trim()
      : null,
    description:
      data.description != null && String(data.description).trim()
        ? String(data.description).trim()
        : null,
    status: enabled ? "ACTIVE" : "INACTIVE",
    enabled,
    createdAt: String(data.createdAt || new Date().toISOString()),
    updatedAt: String(
      data.updatedAt || data.createdAt || new Date().toISOString(),
    ),
  };
}

function isAdminOrCoLoader(role: string | undefined | null): boolean {
  return (
    role === "SUPER_ADMIN" ||
    role === "ADMIN" ||
    role === "CO_LOADER"
  );
}

/** Strip undefined so Firestore never receives it */
function cleanFirestoreData(
  input: Record<string, unknown>,
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(input)) {
    if (value === undefined) continue;
    out[key] = value;
  }
  return out;
}

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
    const status = searchParams.get("status");

    const snapshot = await adminDb.collection(COLLECTION).get();
    let products = snapshot.docs.map((doc) =>
      normalize(doc.id, doc.data()),
    );

    if (status === "ACTIVE" || status === "INACTIVE") {
      products = products.filter((p) => p.status === status);
    }

    products.sort((a, b) => a.name.localeCompare(b.name));

    return successResponse(products, 200);
  } catch (error) {
    console.error("GET /api/logistics/shipment-products", error);
    return errorResponse(
      "PRODUCTS_LIST_FAILED",
      error instanceof Error
        ? error.message
        : "Failed to load products.",
      500,
    );
  }
}

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

    if (!isAdminOrCoLoader(user.role)) {
      return errorResponse(
        "FORBIDDEN",
        "You do not have permission to create products.",
        403,
      );
    }

    const body = await request.json();
    const name = String(body.name || "").trim();
    if (!name) {
      return errorResponse("VALIDATION", "Product name is required.", 400);
    }

    const codeRaw = body.code != null ? String(body.code).trim() : "";
    const descRaw =
      body.description != null ? String(body.description).trim() : "";
    const status: ProductStatus =
      String(body.status || "ACTIVE").toUpperCase() === "INACTIVE"
        ? "INACTIVE"
        : "ACTIVE";

    const ref = adminDb.collection(COLLECTION).doc();
    const now = new Date().toISOString();

    // Use null for empty optionals — never undefined
    const record = cleanFirestoreData({
      productId: ref.id,
      name,
      code: codeRaw || null,
      description: descRaw || null,
      status,
      enabled: status === "ACTIVE",
      createdAt: now,
      updatedAt: now,
      createdBy:
        (user as { userId?: string }).userId ||
        (user as { id?: string }).id ||
        null,
    });

    await ref.set(record);

    return successResponse(
      normalize(ref.id, record),
      201,
      "Product created.",
    );
  } catch (error) {
    console.error("POST /api/logistics/shipment-products", error);
    return errorResponse(
      "PRODUCT_CREATE_FAILED",
      error instanceof Error
        ? error.message
        : "Failed to create product.",
      500,
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return errorResponse(
        "UNAUTHORIZED",
        "Authentication is required.",
        401,
      );
    }

    if (!isAdminOrCoLoader(user.role)) {
      return errorResponse(
        "FORBIDDEN",
        "You do not have permission to update products.",
        403,
      );
    }

    const body = await request.json();
    const productId = String(body.productId || body.id || "").trim();
    if (!productId) {
      return errorResponse("VALIDATION", "productId is required.", 400);
    }

    const ref = adminDb.collection(COLLECTION).doc(productId);
    const snap = await ref.get();
    if (!snap.exists) {
      return errorResponse("NOT_FOUND", "Product not found.", 404);
    }

    const patch: Record<string, unknown> = {
      updatedAt: new Date().toISOString(),
    };

    if (body.name !== undefined) {
      const name = String(body.name || "").trim();
      if (!name) {
        return errorResponse("VALIDATION", "Product name is required.", 400);
      }
      patch.name = name;
    }

    if (body.code !== undefined) {
      const code = String(body.code || "").trim();
      patch.code = code || null;
    }

    if (body.description !== undefined) {
      const description = String(body.description || "").trim();
      patch.description = description || null;
    }

    if (body.status !== undefined) {
      const status: ProductStatus =
        String(body.status).toUpperCase() === "INACTIVE"
          ? "INACTIVE"
          : "ACTIVE";
      patch.status = status;
      patch.enabled = status === "ACTIVE";
    }

    await ref.update(cleanFirestoreData(patch));

    const updated = await ref.get();
    const data = updated.data();
    if (!data) {
      return errorResponse("NOT_FOUND", "Product not found after update.", 404);
    }

    return successResponse(normalize(updated.id, data), 200, "Product updated.");
  } catch (error) {
    console.error("PATCH /api/logistics/shipment-products", error);
    return errorResponse(
      "PRODUCT_UPDATE_FAILED",
      error instanceof Error
        ? error.message
        : "Failed to update product.",
      500,
    );
  }
}