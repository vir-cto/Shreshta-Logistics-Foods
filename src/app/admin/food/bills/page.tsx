// "use client";

// import Link from "next/link";
// import type { UserRole } from "@/types/user"; // or wherever UserRole lives
// import { can, type PermissionUser } from "@/lib/permissions";
// import { useCallback, useEffect, useMemo, useState } from "react";
// import { Download, FileText, RefreshCw, Search } from "lucide-react";
// import { useAuth } from "@/context/AuthContext";
// // import { can } from "@/lib/permissions";

// type OrderRow = {
//   orderId: string;
//   customerName: string;
//   customerPhone?: string;
//   customerEmail?: string;
//   total: number;
//   status: string;
//   paymentStatus?: string;
//   createdAt?: string;
//   paidAt?: string;
// };

// type ApiResponse =
//   | {
//       success: true;
//       data:
//         | Record<string, unknown>[]
//         | {
//             orders?: Record<string, unknown>[];
//             data?: Record<string, unknown>[];
//             results?: Record<string, unknown>[];
//             items?: Record<string, unknown>[];
//           };
//     }
//   | {
//       success: false;
//       error: { code: string; message: string };
//     };

// function formatCurrency(amount: number): string {
//   if (!Number.isFinite(amount)) return "₹0";
//   return new Intl.NumberFormat("en-IN", {
//     style: "currency",
//     currency: "INR",
//     maximumFractionDigits: 0,
//   }).format(amount);
// }

// function formatDate(value?: string): string {
//   if (!value) return "—";
//   const d = new Date(value);
//   if (Number.isNaN(d.getTime())) return value;
//   return new Intl.DateTimeFormat("en-IN", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//   }).format(d);
// }

// function isBillEligible(row: {
//   paymentStatus?: string;
//   status?: string;
// }): boolean {
//   const pay = String(row.paymentStatus || "").toUpperCase();
//   const status = String(row.status || "").toUpperCase();

//   if (
//     pay === "SUCCESS" ||
//     pay === "PAID" ||
//     pay === "AUTHORIZED" ||
//     pay === "CAPTURED"
//   ) {
//     return true;
//   }

//   return [
//     "PAID",
//     "CONFIRMED",
//     "PROCESSING",
//     "PACKED",
//     "SHIPPED",
//     "OUT_FOR_DELIVERY",
//     "DELIVERED",
//   ].includes(status);
// }

// function extractList(data: unknown): Record<string, unknown>[] {
//   if (Array.isArray(data)) return data as Record<string, unknown>[];
//   if (!data || typeof data !== "object") return [];
//   const obj = data as Record<string, unknown>;
//   for (const key of ["orders", "items", "results", "data"]) {
//     if (Array.isArray(obj[key])) return obj[key] as Record<string, unknown>[];
//   }
//   return [];
// }

// function normalizeOrder(raw: Record<string, unknown>): OrderRow | null {
//   const orderId = String(raw.orderId || raw.id || "").trim();
//   if (!orderId) return null;

//   const customer =
//     raw.customer && typeof raw.customer === "object"
//       ? (raw.customer as Record<string, unknown>)
//       : {};

//   const customerName = String(
//     raw.customerName ||
//       customer.name ||
//       customer.fullName ||
//       customer.customerName ||
//       "—",
//   ).trim();

//   const total = Number(
//     raw.total ?? raw.grandTotal ?? raw.amount ?? 0,
//   );

//   return {
//     orderId,
//     customerName: customerName || "—",
//     customerPhone: String(
//       raw.customerPhone || customer.phone || customer.mobile || "",
//     ).trim() || undefined,
//     customerEmail: String(
//       raw.customerEmail || customer.email || "",
//     ).trim() || undefined,
//     total: Number.isFinite(total) ? total : 0,
//     status: String(raw.status || raw.currentStatus || "—").toUpperCase(),
//     paymentStatus: String(
//       raw.paymentStatus ||
//         (raw.paymentReference as { paymentStatus?: string } | undefined)
//           ?.paymentStatus ||
//         "",
//     )
//       .trim()
//       .toUpperCase() || undefined,
//     createdAt: String(raw.createdAt || raw.orderDate || "").trim() || undefined,
//     paidAt:
//       String(raw.paidAt || raw.paymentCompletedAt || "").trim() || undefined,
//   };
// }

// function toPermissionUser(
//   user: { userId?: string; id?: string; role?: string } | null,
// ) {
//   if (!user) return null;
//   return {
//     userId: String(user.userId || user.id || ""),
//     role: (String(user.role || "").toUpperCase() || null) as
//       | "SUPER_ADMIN"
//       | "ADMIN"
//       | "FOOD_MANAGER"
//       | "FOOD_OPERATOR"
//       | "ACCOUNTANT"
//       | "VIEWER"
//       | null,
//   };
// }

// async function downloadBillPdf(
//   orderId: string,
//   getToken: () => Promise<string>,
// ): Promise<void> {
//   const token = await getToken();
//   const res = await fetch(
//     `/api/food/orders/${encodeURIComponent(orderId)}/bill?format=base64`,
//     {
//       method: "GET",
//       headers: {
//         Accept: "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       cache: "no-store",
//     },
//   );

//   const contentType = res.headers.get("content-type") || "";

//   // JSON base64 response
//   if (contentType.includes("application/json")) {
//     const json = await res.json();
//     if (!res.ok || !json?.success) {
//       const msg =
//         typeof json?.error === "string"
//           ? json.error
//           : json?.error?.message || "Failed to download bill.";
//       throw new Error(msg);
//     }

//     const b64 =
//       json.data?.pdfBase64 ||
//       json.data?.base64 ||
//       json.pdfBase64 ||
//       json.base64;

//     if (!b64 || typeof b64 !== "string") {
//       throw new Error("Bill PDF was empty.");
//     }

//     const binary = atob(b64);
//     const bytes = new Uint8Array(binary.length);
//     for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
//     const blob = new Blob([bytes], { type: "application/pdf" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `bill-${orderId}.pdf`;
//     a.click();
//     URL.revokeObjectURL(url);
//     return;
//   }

//   // Raw PDF
//   if (!res.ok) {
//     throw new Error("Failed to download bill.");
//   }
//   const blob = await res.blob();
//   const url = URL.createObjectURL(blob);
//   const a = document.createElement("a");
//   a.href = url;
//   a.download = `bill-${orderId}.pdf`;
//   a.click();
//   URL.revokeObjectURL(url);
// }

// export default function FoodBillsPage() {
//   const { firebaseUser, user, loading: authLoading } = useAuth();

// //   const permissionUser = toPermissionUser(
// //     user as { userId?: string; id?: string; role?: string } | null,
// //   );

// //   const canView =
// //     can(permissionUser, "FOOD_ORDER_VIEW") ||
// //     user?.role === "SUPER_ADMIN" ||
// //     user?.role === "ADMIN";

// const permissionUser: PermissionUser | null = user
//   ? {
//       userId: String(
//         (user as { userId?: string }).userId ||
//           (user as { id?: string }).id ||
//           "",
//       ),
//       role: (String(user.role || "").toUpperCase() || null) as UserRole | null,
//     }
//   : null;

// const canView =
//   can(permissionUser, "FOOD_ORDER_VIEW") ||
//   role === "SUPER_ADMIN" ||
//   role === "ADMIN";

//   const [rows, setRows] = useState<OrderRow[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [search, setSearch] = useState("");
//   const [downloadingId, setDownloadingId] = useState<string | null>(null);
//   const [reloadKey, setReloadKey] = useState(0);

//   const loadBills = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       if (!firebaseUser) {
//         throw new Error("Authentication is required.");
//       }
//       if (!canView) {
//         throw new Error("You do not have permission to view food bills.");
//       }

//       const token = await firebaseUser.getIdToken(true);
//       const res = await fetch("/api/food/orders", {
//         method: "GET",
//         headers: {
//           Accept: "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         cache: "no-store",
//       });

//       const json = (await res.json()) as ApiResponse;

//       if (!json.success) {
//         throw new Error(
//           json.error?.message || "Failed to load orders for bills.",
//         );
//       }

//       const list = extractList(json.data);
//       const normalized = list
//         .map((raw) => normalizeOrder(raw))
//         .filter(Boolean) as OrderRow[];

//       // Only bill-eligible (paid / progressed) orders
//       const bills = normalized
//         .filter((row) => isBillEligible(row))
//         .sort((a, b) => {
//           const ta = new Date(a.paidAt || a.createdAt || 0).getTime();
//           const tb = new Date(b.paidAt || b.createdAt || 0).getTime();
//           return tb - ta;
//         });

//       setRows(bills);
//     } catch (e) {
//       setError(e instanceof Error ? e.message : "Failed to load bills.");
//       setRows([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [firebaseUser, canView]);

//   useEffect(() => {
//     if (authLoading) return;
//     void loadBills();
//   }, [authLoading, loadBills, reloadKey]);

//   const filtered = useMemo(() => {
//     const q = search.trim().toLowerCase();
//     if (!q) return rows;
//     return rows.filter((row) =>
//       [
//         row.orderId,
//         row.customerName,
//         row.customerPhone || "",
//         row.customerEmail || "",
//         row.status,
//         row.paymentStatus || "",
//       ]
//         .join(" ")
//         .toLowerCase()
//         .includes(q),
//     );
//   }, [rows, search]);

//   async function handleDownload(orderId: string) {
//     try {
//       setDownloadingId(orderId);
//       setError(null);
//       if (!firebaseUser) throw new Error("Authentication is required.");
//       await downloadBillPdf(orderId, () => firebaseUser.getIdToken(true));
//     } catch (e) {
//       setError(e instanceof Error ? e.message : "Download failed.");
//     } finally {
//       setDownloadingId(null);
//     }
//   }

//   return (
//     <div className="mx-auto max-w-[1400px]">
//       <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
//         <div>
//           <p className="text-xs font-bold uppercase tracking-widest text-orange-600">
//             Food
//           </p>
//           <h2 className="mt-1 text-2xl font-bold text-[#06284c]">Bills</h2>
//           <p className="mt-1 text-sm text-slate-500">
//             Download invoices for paid and confirmed food orders.
//           </p>
//         </div>

//         <div className="flex gap-2">
//           <button
//             type="button"
//             onClick={() => setReloadKey((v) => v + 1)}
//             disabled={loading || authLoading}
//             className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold disabled:opacity-50"
//           >
//             <RefreshCw className="h-4 w-4" />
//             Refresh
//           </button>
//           <Link
//             href="/admin/food/orders"
//             className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold"
//           >
//             All Orders
//           </Link>
//         </div>
//       </div>

//       {error ? (
//         <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//           {error}
//         </div>
//       ) : null}

//       <div className="mb-4">
//         <div className="relative max-w-md">
//           <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
//           <input
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             placeholder="Search order ID, customer, phone…"
//             className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-4 text-sm outline-none focus:border-orange-400"
//           />
//         </div>
//       </div>

//       {loading || authLoading ? (
//         <div className="rounded-xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
//           <p className="text-sm font-semibold text-slate-600">Loading bills…</p>
//         </div>
//       ) : filtered.length === 0 ? (
//         <div className="rounded-xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
//           <FileText className="mx-auto h-10 w-10 text-slate-300" />
//           <h3 className="mt-3 text-lg font-bold text-[#06284c]">
//             No bills yet
//           </h3>
//           <p className="mt-1 text-sm text-slate-500">
//             Bills appear here after payment succeeds or the order is confirmed.
//           </p>
//         </div>
//       ) : (
//         <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
//           <div className="overflow-x-auto">
//             <table className="w-full min-w-[900px] text-left text-sm">
//               <thead className="bg-slate-50 text-xs uppercase text-slate-500">
//                 <tr>
//                   <th className="px-5 py-3">Order</th>
//                   <th className="px-5 py-3">Customer</th>
//                   <th className="px-5 py-3">Amount</th>
//                   <th className="px-5 py-3">Payment</th>
//                   <th className="px-5 py-3">Status</th>
//                   <th className="px-5 py-3">Date</th>
//                   <th className="px-5 py-3">Action</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-100">
//                 {filtered.map((row) => (
//                   <tr key={row.orderId} className="hover:bg-slate-50/60">
//                     <td className="px-5 py-4">
//                       <p className="font-mono text-xs font-bold text-orange-700">
//                         {row.orderId}
//                       </p>
//                     </td>
//                     <td className="px-5 py-4">
//                       <p className="font-semibold text-slate-800">
//                         {row.customerName}
//                       </p>
//                       {row.customerPhone ? (
//                         <p className="text-xs text-slate-400">
//                           {row.customerPhone}
//                         </p>
//                       ) : null}
//                     </td>
//                     <td className="px-5 py-4 font-bold text-[#06284c]">
//                       {formatCurrency(row.total)}
//                     </td>
//                     <td className="px-5 py-4">
//                       <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
//                         {row.paymentStatus || "PAID"}
//                       </span>
//                     </td>
//                     <td className="px-5 py-4">
//                       <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600">
//                         {row.status}
//                       </span>
//                     </td>
//                     <td className="px-5 py-4 text-xs text-slate-500">
//                       {formatDate(row.paidAt || row.createdAt)}
//                     </td>
//                     <td className="px-5 py-4">
//                       <div className="flex flex-wrap items-center gap-3">
//                         <button
//                           type="button"
//                           onClick={() => handleDownload(row.orderId)}
//                           disabled={downloadingId === row.orderId}
//                           className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 disabled:opacity-50"
//                         >
//                           <Download className="h-3.5 w-3.5" />
//                           {downloadingId === row.orderId
//                             ? "Downloading…"
//                             : "Download Bill"}
//                         </button>
//                         <Link
//                           href={`/admin/food/orders/${encodeURIComponent(row.orderId)}`}
//                           className="text-xs font-bold text-[#087f87]"
//                         >
//                           View order
//                         </Link>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//           <div className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
//             Showing {filtered.length} bill{filtered.length === 1 ? "" : "s"}
//           </div>
//         </div>
//       )}

//       <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800">
//         Bills use{" "}
//         <code className="font-mono">GET /api/food/orders/[orderId]/bill</code>.
//         Only paid or confirmed orders are listed.
//       </div>
//     </div>
//   );
// }

"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Download, FileText, RefreshCw, Search } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

type OrderRow = {
  orderId: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  total: number;
  status: string;
  paymentStatus?: string;
  createdAt?: string;
  paidAt?: string;
};

type ApiResponse =
  | {
      success: true;
      data:
        | Record<string, unknown>[]
        | {
            orders?: Record<string, unknown>[];
            data?: Record<string, unknown>[];
            results?: Record<string, unknown>[];
            items?: Record<string, unknown>[];
          };
    }
  | {
      success: false;
      error: { code: string; message: string };
    };

function formatCurrency(amount: number): string {
  if (!Number.isFinite(amount)) return "Rs. 0";
  return (
    "Rs. " +
    new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(amount)
  );
}

function formatDate(value?: string): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

function isBillEligible(row: {
  paymentStatus?: string;
  status?: string;
}): boolean {
  const pay = String(row.paymentStatus || "").toUpperCase();
  const status = String(row.status || "").toUpperCase();

  if (
    pay === "SUCCESS" ||
    pay === "PAID" ||
    pay === "AUTHORIZED" ||
    pay === "CAPTURED"
  ) {
    return true;
  }

  return [
    "PAID",
    "CONFIRMED",
    "PROCESSING",
    "PACKED",
    "SHIPPED",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
  ].includes(status);
}

function extractList(data: unknown): Record<string, unknown>[] {
  if (Array.isArray(data)) return data as Record<string, unknown>[];
  if (!data || typeof data !== "object") return [];
  const obj = data as Record<string, unknown>;
  for (const key of ["orders", "items", "results", "data"]) {
    if (Array.isArray(obj[key])) return obj[key] as Record<string, unknown>[];
  }
  return [];
}

function normalizeOrder(raw: Record<string, unknown>): OrderRow | null {
  const orderId = String(raw.orderId || raw.id || "").trim();
  if (!orderId) return null;

  const customer =
    raw.customer && typeof raw.customer === "object"
      ? (raw.customer as Record<string, unknown>)
      : {};

  const customerName = String(
    raw.customerName ||
      customer.name ||
      customer.fullName ||
      customer.customerName ||
      "—",
  ).trim();

  const total = Number(raw.total ?? raw.grandTotal ?? raw.amount ?? 0);

  return {
    orderId,
    customerName: customerName || "—",
    customerPhone:
      String(
        raw.customerPhone || customer.phone || customer.mobile || "",
      ).trim() || undefined,
    customerEmail:
      String(raw.customerEmail || customer.email || "").trim() || undefined,
    total: Number.isFinite(total) ? total : 0,
    status: String(raw.status || raw.currentStatus || "—").toUpperCase(),
    paymentStatus:
      String(
        raw.paymentStatus ||
          (raw.paymentReference as { paymentStatus?: string } | undefined)
            ?.paymentStatus ||
          "",
      )
        .trim()
        .toUpperCase() || undefined,
    createdAt: String(raw.createdAt || raw.orderDate || "").trim() || undefined,
    paidAt:
      String(raw.paidAt || raw.paymentCompletedAt || "").trim() || undefined,
  };
}

async function downloadBillPdf(
  orderId: string,
  getToken: () => Promise<string>,
): Promise<void> {
  const token = await getToken();
  const res = await fetch(
    `/api/food/orders/${encodeURIComponent(orderId)}/bill?format=base64`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    },
  );

  const contentType = res.headers.get("content-type") || "";

//   if (contentType.includes("application/json")) {
//     const json = await res.json();
//     if (!res.ok || !json?.success) {
//       const msg =
//         typeof json?.error === "string"
//           ? json.error
//           : json?.error?.message || "Failed to download bill.";
//       throw new Error(msg);
//     }

//     const b64 =
//       json.data?.pdfBase64 ||
//       json.data?.base64 ||
//       json.pdfBase64 ||
//       json.base64;

//     if (!b64 || typeof b64 !== "string") {
//       throw new Error("Bill PDF was empty.");
//     }

//     const binary = atob(b64);
//     const bytes = new Uint8Array(binary.length);
//     for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
//     const blob = new Blob([bytes], { type: "application/pdf" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `bill-${orderId}.pdf`;
//     a.click();
//     URL.revokeObjectURL(url);
//     return;
//   }

if (contentType.includes("application/json") || contentType.includes("text/json")) {
    const json = await res.json();

    if (!res.ok || !json?.success) {
      const msg =
        typeof json?.error === "string"
          ? json.error
          : json?.error?.message || "Failed to download bill.";
      throw new Error(msg);
    }

    // API returns: { success, pdf, fileName }
    const b64 =
      json.pdf ||
      json.data?.pdf ||
      json.data?.pdfBase64 ||
      json.pdfBase64 ||
      json.data?.base64 ||
      json.base64;

    if (!b64 || typeof b64 !== "string") {
      throw new Error("Bill PDF was empty.");
    }

    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

    const blob = new Blob([bytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download =
      String(json.fileName || json.data?.fileName || `bill-${orderId}.pdf`);
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    return;
  }

  if (!res.ok) {
    throw new Error("Failed to download bill.");
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `bill-${orderId}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function FoodBillsPage() {
  const { firebaseUser, user, loading: authLoading } = useAuth();

  const role = String(user?.role || "")
    .trim()
    .toUpperCase();

  const canView =
    role === "SUPER_ADMIN" ||
    role === "ADMIN" ||
    role === "FOOD_MANAGER" ||
    role === "FOOD_OPERATOR" ||
    role === "ACCOUNTANT";

  const [rows, setRows] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const loadBills = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (!firebaseUser) {
        throw new Error("Authentication is required.");
      }
      if (!canView) {
        throw new Error("You do not have permission to view food bills.");
      }

      const token = await firebaseUser.getIdToken(true);
      const res = await fetch("/api/food/orders", {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      const json = (await res.json()) as ApiResponse;

      if (!json.success) {
        throw new Error(
          json.error?.message || "Failed to load orders for bills.",
        );
      }

      const list = extractList(json.data);
      const normalized = list
        .map((raw) => normalizeOrder(raw))
        .filter(Boolean) as OrderRow[];

      const bills = normalized
        .filter((row) => isBillEligible(row))
        .sort((a, b) => {
          const ta = new Date(a.paidAt || a.createdAt || 0).getTime();
          const tb = new Date(b.paidAt || b.createdAt || 0).getTime();
          return tb - ta;
        });

      setRows(bills);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load bills.");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [firebaseUser, canView]);

  useEffect(() => {
    if (authLoading) return;
    void loadBills();
  }, [authLoading, loadBills, reloadKey]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((row) =>
      [
        row.orderId,
        row.customerName,
        row.customerPhone || "",
        row.customerEmail || "",
        row.status,
        row.paymentStatus || "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [rows, search]);

  async function handleDownload(orderId: string) {
    try {
      setDownloadingId(orderId);
      setError(null);
      if (!firebaseUser) throw new Error("Authentication is required.");
      await downloadBillPdf(orderId, () => firebaseUser.getIdToken(true));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Download failed.");
    } finally {
      setDownloadingId(null);
    }
  }

  return (
    <div className="mx-auto max-w-[1400px]">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-orange-600">
            Food
          </p>
          <h2 className="mt-1 text-2xl font-bold text-[#06284c]">Bills</h2>
          <p className="mt-1 text-sm text-slate-500">
            Download invoices for paid and confirmed food orders.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setReloadKey((v) => v + 1)}
            disabled={loading || authLoading}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold disabled:opacity-50"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
          <Link
            href="/admin/food/orders"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold"
          >
            All Orders
          </Link>
        </div>
      </div>

      {error ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="mb-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order ID, customer, phone…"
            className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-4 text-sm outline-none focus:border-orange-400"
          />
        </div>
      </div>

      {loading || authLoading ? (
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
          <p className="text-sm font-semibold text-slate-600">Loading bills…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
          <FileText className="mx-auto h-10 w-10 text-slate-300" />
          <h3 className="mt-3 text-lg font-bold text-[#06284c]">No bills yet</h3>
          <p className="mt-1 text-sm text-slate-500">
            Bills appear here after payment succeeds or the order is confirmed.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3">Order</th>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Amount</th>
                  <th className="px-5 py-3">Payment</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((row) => (
                  <tr key={row.orderId} className="hover:bg-slate-50/60">
                    <td className="px-5 py-4">
                      <p className="font-mono text-xs font-bold text-orange-700">
                        {row.orderId}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-800">
                        {row.customerName}
                      </p>
                      {row.customerPhone ? (
                        <p className="text-xs text-slate-400">
                          {row.customerPhone}
                        </p>
                      ) : null}
                    </td>
                    <td className="px-5 py-4 font-bold text-[#06284c]">
                      {formatCurrency(row.total)}
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                        {row.paymentStatus || "PAID"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600">
                        {row.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-500">
                      {formatDate(row.paidAt || row.createdAt)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleDownload(row.orderId)}
                          disabled={downloadingId === row.orderId}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 disabled:opacity-50"
                        >
                          <Download className="h-3.5 w-3.5" />
                          {downloadingId === row.orderId
                            ? "Downloading…"
                            : "Download Bill"}
                        </button>
                        <Link
                          href={`/admin/food/orders/${encodeURIComponent(row.orderId)}`}
                          className="text-xs font-bold text-[#087f87]"
                        >
                          View order
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
            Showing {filtered.length} bill{filtered.length === 1 ? "" : "s"}
          </div>
        </div>
      )}

      <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800">
        Bills use{" "}
        <code className="font-mono">GET /api/food/orders/[orderId]/bill</code>.
        Only paid or confirmed orders are listed.
      </div>
    </div>
  );
}