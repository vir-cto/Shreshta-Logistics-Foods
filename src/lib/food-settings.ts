// import type { DocumentData } from "firebase-admin/firestore";
// import { adminDb } from "@/lib/firebase-admin";
// import { FIRESTORE_COLLECTIONS } from "@/utils/constants";

// export type FoodSettings = {
//   storeName: string;
//   defaultCurrency: string;
//   supportEmail: string;
//   supportPhone: string;
//   allowProductVariants: boolean;
//   showOutOfStockProducts: boolean;
//   allowProductReviews: boolean;
//   acceptNewOrders: boolean;
//   requirePaymentBeforeProcessing: boolean;
//   enableOrderNotifications: boolean;
//   paymentProvider: string;
//   enableCashfreePayments: boolean;
// };

// const SETTINGS_DOC_ID = "food";

// export const DEFAULT_FOOD_SETTINGS: FoodSettings = {
//   storeName: "Sreshta Foods",
//   defaultCurrency: "INR",
//   supportEmail: "",
//   supportPhone: "",
//   allowProductVariants: true,
//   showOutOfStockProducts: false,
//   allowProductReviews: false,
//   acceptNewOrders: true,
//   requirePaymentBeforeProcessing: true,
//   enableOrderNotifications: true,
//   paymentProvider: "Cashfree",
//   enableCashfreePayments: false,
// };

// function normalizeSettings(data?: DocumentData | null): FoodSettings {
//   const raw = data || {};
//   return {
//     storeName: String(raw.storeName || DEFAULT_FOOD_SETTINGS.storeName).trim(),
//     defaultCurrency: String(
//       raw.defaultCurrency || DEFAULT_FOOD_SETTINGS.defaultCurrency,
//     )
//       .trim()
//       .toUpperCase(),
//     supportEmail: String(raw.supportEmail || "").trim().toLowerCase(),
//     supportPhone: String(raw.supportPhone || "").trim(),
//     allowProductVariants:
//       raw.allowProductVariants === undefined
//         ? DEFAULT_FOOD_SETTINGS.allowProductVariants
//         : Boolean(raw.allowProductVariants),
//     showOutOfStockProducts:
//       raw.showOutOfStockProducts === undefined
//         ? DEFAULT_FOOD_SETTINGS.showOutOfStockProducts
//         : Boolean(raw.showOutOfStockProducts),
//     allowProductReviews:
//       raw.allowProductReviews === undefined
//         ? DEFAULT_FOOD_SETTINGS.allowProductReviews
//         : Boolean(raw.allowProductReviews),
//     acceptNewOrders:
//       raw.acceptNewOrders === undefined
//         ? DEFAULT_FOOD_SETTINGS.acceptNewOrders
//         : Boolean(raw.acceptNewOrders),
//     requirePaymentBeforeProcessing:
//       raw.requirePaymentBeforeProcessing === undefined
//         ? DEFAULT_FOOD_SETTINGS.requirePaymentBeforeProcessing
//         : Boolean(raw.requirePaymentBeforeProcessing),
//     enableOrderNotifications:
//       raw.enableOrderNotifications === undefined
//         ? DEFAULT_FOOD_SETTINGS.enableOrderNotifications
//         : Boolean(raw.enableOrderNotifications),
//     paymentProvider: String(
//       raw.paymentProvider || DEFAULT_FOOD_SETTINGS.paymentProvider,
//     ).trim(),
//     enableCashfreePayments:
//       raw.enableCashfreePayments === undefined
//         ? DEFAULT_FOOD_SETTINGS.enableCashfreePayments
//         : Boolean(raw.enableCashfreePayments),
//   };
// }

// export async function getFoodSettingsServer(): Promise<FoodSettings> {
//   try {
//     const snap = await adminDb
//       .collection(FIRESTORE_COLLECTIONS.SETTINGS || "settings")
//       .doc(SETTINGS_DOC_ID)
//       .get();
//     if (!snap.exists) return DEFAULT_FOOD_SETTINGS;
//     return normalizeSettings(snap.data());
//   } catch {
//     return DEFAULT_FOOD_SETTINGS;
//   }
// }

// import type { DocumentData } from "firebase-admin/firestore";
// import { adminDb } from "@/lib/firebase-admin";
// import { FIRESTORE_COLLECTIONS } from "@/utils/constants";

// export type FoodSettings = {
//   storeName: string;
//   defaultCurrency: string;
//   supportEmail: string;
//   supportPhone: string;
//   allowProductVariants: boolean;
//   showOutOfStockProducts: boolean;
//   allowProductReviews: boolean;
//   acceptNewOrders: boolean;
//   requirePaymentBeforeProcessing: boolean;
//   enableOrderNotifications: boolean;
//   paymentProvider: string;
//   enableCashfreePayments: boolean;
//   updatedAt?: string;
//   updatedBy?: string;
// };

// export const DEFAULT_FOOD_SETTINGS: FoodSettings = {
//   storeName: "Sreshta Foods",
//   defaultCurrency: "INR",
//   supportEmail: "",
//   supportPhone: "",
//   allowProductVariants: true,
//   showOutOfStockProducts: false,
//   allowProductReviews: false,
//   acceptNewOrders: true,
//   requirePaymentBeforeProcessing: true,
//   enableOrderNotifications: true,
//   paymentProvider: "Cashfree",
//   enableCashfreePayments: false,
// };

// const SETTINGS_DOC_ID = "food";

// function settingsRef() {
//   return adminDb
//     .collection(FIRESTORE_COLLECTIONS.SETTINGS || "settings")
//     .doc(SETTINGS_DOC_ID);
// }

// function normalizeSettings(data: DocumentData | undefined): FoodSettings {
//   const d = data || {};
//   return {
//     storeName: String(d.storeName || DEFAULT_FOOD_SETTINGS.storeName),
//     defaultCurrency: String(
//       d.defaultCurrency || DEFAULT_FOOD_SETTINGS.defaultCurrency,
//     ),
//     supportEmail: String(d.supportEmail || ""),
//     supportPhone: String(d.supportPhone || ""),
//     allowProductVariants:
//       d.allowProductVariants === undefined
//         ? DEFAULT_FOOD_SETTINGS.allowProductVariants
//         : Boolean(d.allowProductVariants),
//     showOutOfStockProducts:
//       d.showOutOfStockProducts === undefined
//         ? DEFAULT_FOOD_SETTINGS.showOutOfStockProducts
//         : Boolean(d.showOutOfStockProducts),
//     allowProductReviews:
//       d.allowProductReviews === undefined
//         ? DEFAULT_FOOD_SETTINGS.allowProductReviews
//         : Boolean(d.allowProductReviews),
//     acceptNewOrders:
//       d.acceptNewOrders === undefined
//         ? DEFAULT_FOOD_SETTINGS.acceptNewOrders
//         : Boolean(d.acceptNewOrders),
//     requirePaymentBeforeProcessing:
//       d.requirePaymentBeforeProcessing === undefined
//         ? DEFAULT_FOOD_SETTINGS.requirePaymentBeforeProcessing
//         : Boolean(d.requirePaymentBeforeProcessing),
//     enableOrderNotifications:
//       d.enableOrderNotifications === undefined
//         ? DEFAULT_FOOD_SETTINGS.enableOrderNotifications
//         : Boolean(d.enableOrderNotifications),
//     paymentProvider: String(
//       d.paymentProvider || DEFAULT_FOOD_SETTINGS.paymentProvider,
//     ),
//     enableCashfreePayments:
//       d.enableCashfreePayments === undefined
//         ? DEFAULT_FOOD_SETTINGS.enableCashfreePayments
//         : Boolean(d.enableCashfreePayments),
//     updatedAt: d.updatedAt ? String(d.updatedAt) : undefined,
//     updatedBy: d.updatedBy ? String(d.updatedBy) : undefined,
//   };
// }

// /** Server-only helper — import from @/lib/food-settings, never from a route file */
// export async function getFoodSettingsServer(): Promise<FoodSettings> {
//   try {
//     const snap = await settingsRef().get();
//     if (!snap.exists) return { ...DEFAULT_FOOD_SETTINGS };
//     return normalizeSettings(snap.data());
//   } catch (e) {
//     console.error("getFoodSettingsServer failed", e);
//     return { ...DEFAULT_FOOD_SETTINGS };
//   }
// }

import type { DocumentData } from "firebase-admin/firestore";

import { adminDb } from "@/lib/firebase-admin";
import { FIRESTORE_COLLECTIONS } from "@/utils/constants";

export type FoodSettings = {
  storeName: string;
  defaultCurrency: string;
  supportEmail: string;
  supportPhone: string;
  allowProductVariants: boolean;
  showOutOfStockProducts: boolean;
  allowProductReviews: boolean;
  acceptNewOrders: boolean;
  requirePaymentBeforeProcessing: boolean;
  enableOrderNotifications: boolean;
  paymentProvider: string;
  enableCashfreePayments: boolean;
  updatedAt?: string;
  updatedBy?: string;
};

export const DEFAULT_FOOD_SETTINGS: FoodSettings = {
  storeName: "Sreshta Foods",
  defaultCurrency: "INR",
  supportEmail: "",
  supportPhone: "",
  allowProductVariants: true,
  showOutOfStockProducts: false,
  allowProductReviews: false,
  acceptNewOrders: true,
  requirePaymentBeforeProcessing: true,
  enableOrderNotifications: true,
  paymentProvider: "Cashfree",
  enableCashfreePayments: false,
};

const SETTINGS_DOC_ID = "food";

function settingsRef() {
  return adminDb
    .collection(FIRESTORE_COLLECTIONS.SETTINGS || "settings")
    .doc(SETTINGS_DOC_ID);
}

export function normalizeFoodSettings(
  data?: DocumentData | null,
): FoodSettings {
  const raw = data || {};

  return {
    storeName: String(raw.storeName || DEFAULT_FOOD_SETTINGS.storeName).trim(),
    defaultCurrency: String(
      raw.defaultCurrency || DEFAULT_FOOD_SETTINGS.defaultCurrency,
    )
      .trim()
      .toUpperCase(),
    supportEmail: String(raw.supportEmail || "").trim().toLowerCase(),
    supportPhone: String(raw.supportPhone || "").trim(),
    allowProductVariants:
      raw.allowProductVariants === undefined
        ? DEFAULT_FOOD_SETTINGS.allowProductVariants
        : Boolean(raw.allowProductVariants),
    showOutOfStockProducts:
      raw.showOutOfStockProducts === undefined
        ? DEFAULT_FOOD_SETTINGS.showOutOfStockProducts
        : Boolean(raw.showOutOfStockProducts),
    allowProductReviews:
      raw.allowProductReviews === undefined
        ? DEFAULT_FOOD_SETTINGS.allowProductReviews
        : Boolean(raw.allowProductReviews),
    acceptNewOrders:
      raw.acceptNewOrders === undefined
        ? DEFAULT_FOOD_SETTINGS.acceptNewOrders
        : Boolean(raw.acceptNewOrders),
    requirePaymentBeforeProcessing:
      raw.requirePaymentBeforeProcessing === undefined
        ? DEFAULT_FOOD_SETTINGS.requirePaymentBeforeProcessing
        : Boolean(raw.requirePaymentBeforeProcessing),
    enableOrderNotifications:
      raw.enableOrderNotifications === undefined
        ? DEFAULT_FOOD_SETTINGS.enableOrderNotifications
        : Boolean(raw.enableOrderNotifications),
    paymentProvider: String(
      raw.paymentProvider || DEFAULT_FOOD_SETTINGS.paymentProvider,
    ).trim(),
    enableCashfreePayments:
      raw.enableCashfreePayments === undefined
        ? DEFAULT_FOOD_SETTINGS.enableCashfreePayments
        : Boolean(raw.enableCashfreePayments),
    updatedAt: raw.updatedAt ? String(raw.updatedAt) : undefined,
    updatedBy: raw.updatedBy ? String(raw.updatedBy) : undefined,
  };
}

/** Server-only — import from @/lib/food-settings, never from a route file */
export async function getFoodSettingsServer(): Promise<FoodSettings> {
  try {
    const snapshot = await settingsRef().get();
    if (!snapshot.exists) return { ...DEFAULT_FOOD_SETTINGS };
    return normalizeFoodSettings(snapshot.data());
  } catch (error) {
    console.error("getFoodSettingsServer failed", error);
    return { ...DEFAULT_FOOD_SETTINGS };
  }
}