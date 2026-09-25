// "use client";

// import Link from "next/link";
// import { useEffect, useMemo, useState } from "react";
// import { useAuth } from "@/context/AuthContext";

// type TrackingStatus =
//   | "BOOKED"
//   | "PICKUP_REQUESTED"
//   | "PICKED_UP"
//   | "AT_ORIGIN"
//   | "IN_TRANSIT"
//   | "ARRIVED_DESTINATION"
//   | "OUT_FOR_DELIVERY"
//   | "DELIVERED"
//   | "ON_HOLD"
//   | "EXCEPTION"
//   | "CANCELLED";

// type AwbRow = {
//   awb: string;
//   customerName: string;
//   destination: string;
//   status: string;
//   bookedAt: string;
// };

// type ApiResponse =
//   | {
//       success: true;
//       data:
//         | Record<string, unknown>[]
//         | {
//             results?: Record<string, unknown>[];
//             items?: Record<string, unknown>[];
//             data?: Record<string, unknown>[];
//           };
//     }
//   | {
//       success: false;
//       error: {
//         code: string;
//         message: string;
//       };
//     };

// const STATUSES: Array<TrackingStatus | "ALL"> = [
//   "ALL",
//   "BOOKED",
//   "PICKUP_REQUESTED",
//   "PICKED_UP",
//   "AT_ORIGIN",
//   "IN_TRANSIT",
//   "ARRIVED_DESTINATION",
//   "OUT_FOR_DELIVERY",
//   "DELIVERED",
//   "ON_HOLD",
//   "EXCEPTION",
//   "CANCELLED",
// ];

// function formatDate(value?: string): string {
//   if (!value) {
//     return "—";
//   }

//   const date = new Date(value);

//   if (Number.isNaN(date.getTime())) {
//     return value;
//   }

//   return new Intl.DateTimeFormat("en-IN", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   }).format(date);
// }

// function normalizeAwb(
//   raw: Record<string, unknown>,
// ): AwbRow | null {
//   const awb = String(raw.awb || raw.documentId || "").trim();

//   if (!awb) {
//     return null;
//   }

//   const customerName = String(
//     raw.customerName ||
//       raw.customer ||
//       raw.customerId ||
//       "Customer",
//   );

//   const destination = String(
//     raw.destination ||
//       raw.destinationName ||
//       "—",
//   );

//   const status = String(
//     raw.currentStatus || raw.status || "BOOKED",
//   );

//   const bookedAt = formatDate(
//     raw.shipmentDate
//       ? String(raw.shipmentDate)
//       : raw.createdAt
//         ? String(raw.createdAt)
//         : undefined,
//   );

//   return {
//     awb,
//     customerName,
//     destination,
//     status,
//     bookedAt,
//   };
// }

// export default function AWBPage() {
//   const { firebaseUser, loading: authLoading } = useAuth();

//   const [rows, setRows] = useState<AwbRow[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [search, setSearch] = useState("");
//   const [status, setStatus] = useState<string>("ALL");
//   const [reloadKey, setReloadKey] = useState(0);

//   useEffect(() => {
//     if (authLoading) {
//       return;
//     }

//     let cancelled = false;

//     async function loadAwbs() {
//       try {
//         setLoading(true);
//         setError(null);

//         if (!firebaseUser) {
//           throw new Error(
//             "Authentication is required to view AWBs.",
//           );
//         }

//         const token = await firebaseUser.getIdToken();

//         const params = new URLSearchParams();
//         params.set("limit", "100");

//         if (status !== "ALL") {
//           params.set("status", status);
//         }

//         const res = await fetch(
//           `/api/logistics/awb/search?${params.toString()}`,
//           {
//             method: "GET",
//             headers: {
//               Accept: "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//             cache: "no-store",
//           },
//         );

//         const json = (await res.json()) as ApiResponse;

//         if (!res.ok || !json.success) {
//           throw new Error(
//             !json.success
//               ? json.error.message
//               : "Failed to load AWBs.",
//           );
//         }

//         const payload = json.data;
//         const list = Array.isArray(payload)
//           ? payload
//           : Array.isArray(payload.results)
//             ? payload.results
//             : Array.isArray(payload.items)
//               ? payload.items
//               : Array.isArray(payload.data)
//                 ? payload.data
//                 : [];

//         const normalized = list
//           .map((item) => normalizeAwb(item))
//           .filter(Boolean) as AwbRow[];

//         if (!cancelled) {
//           setRows(normalized);
//         }
//       } catch (e) {
//         if (!cancelled) {
//           setError(
//             e instanceof Error
//               ? e.message
//               : "Failed to load AWBs.",
//           );
//           setRows([]);
//         }
//       } finally {
//         if (!cancelled) {
//           setLoading(false);
//         }
//       }
//     }

//     loadAwbs();

//     return () => {
//       cancelled = true;
//     };
//   }, [authLoading, firebaseUser, status, reloadKey]);

//   const filtered = useMemo(() => {
//     const query = search.trim().toLowerCase();

//     if (!query) {
//       return rows;
//     }

//     return rows.filter((row) =>
//       [row.awb, row.customerName, row.destination, row.status, row.bookedAt]
//         .join(" ")
//         .toLowerCase()
//         .includes(query),
//     );
//   }, [rows, search]);

//   function exportCsv() {
//     const header = [
//       "AWB",
//       "Customer",
//       "Destination",
//       "Status",
//       "Booked",
//     ];

//     const lines = [
//       header.join(","),
//       ...filtered.map((row) =>
//         [
//           row.awb,
//           row.customerName,
//           row.destination,
//           row.status,
//           row.bookedAt,
//         ]
//           .map((value) => `"${String(value).replace(/"/g, '""')}"`)
//           .join(","),
//       ),
//     ];

//     const blob = new Blob([lines.join("\n")], {
//       type: "text/csv;charset=utf-8;",
//     });

//     const url = URL.createObjectURL(blob);
//     const anchor = document.createElement("a");
//     anchor.href = url;
//     anchor.download = `awbs-${new Date().toISOString().slice(0, 10)}.csv`;
//     anchor.click();
//     URL.revokeObjectURL(url);
//   }

//   return (
//     <div className="mx-auto max-w-[1500px]">
//       <PageHeader
//         title="AWB Management"
//         description="Search, review and manage airway bills."
//         action="/admin/logistics/booking"
//       />

//       <div className="mb-4 flex flex-col gap-3 md:flex-row">
//         <input
//           className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm md:max-w-md"
//           placeholder="Search AWB, customer, destination..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           disabled={loading || authLoading}
//         />

//         <select
//           value={status}
//           onChange={(e) => setStatus(e.target.value)}
//           disabled={loading || authLoading}
//           className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm"
//         >
//           {STATUSES.map((item) => (
//             <option key={item} value={item}>
//               {item === "ALL" ? "All Statuses" : item}
//             </option>
//           ))}
//         </select>

//         <button
//           type="button"
//           onClick={() => setReloadKey((value) => value + 1)}
//           className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold"
//         >
//           Refresh
//         </button>

//         <button
//           type="button"
//           onClick={exportCsv}
//           disabled={filtered.length === 0}
//           className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold disabled:opacity-50"
//         >
//           Export
//         </button>
//       </div>

//       {loading || authLoading ? (
//         <div className="rounded-xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
//           <h3 className="text-lg font-bold text-[#06284c]">
//             Loading AWBs...
//           </h3>
//           <p className="mt-2 text-sm text-slate-500">
//             Fetching airway bills from Firestore.
//           </p>
//         </div>
//       ) : error ? (
//         <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-16 text-center">
//           <h3 className="text-lg font-bold text-red-800">
//             Could not load AWBs
//           </h3>
//           <p className="mt-2 text-sm text-red-700">{error}</p>
//           <button
//             type="button"
//             onClick={() => setReloadKey((value) => value + 1)}
//             className="mt-4 rounded-lg bg-[#087f87] px-4 py-2.5 text-sm font-bold text-white"
//           >
//             Try again
//           </button>
//         </div>
//       ) : (
//         <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
//           <div className="overflow-x-auto">
//             <table className="w-full min-w-[900px] text-left text-sm">
//               <thead className="bg-slate-50 text-xs uppercase text-slate-500">
//                 <tr>
//                   <th className="px-5 py-3">AWB</th>
//                   <th className="px-5 py-3">Customer</th>
//                   <th className="px-5 py-3">Destination</th>
//                   <th className="px-5 py-3">Status</th>
//                   <th className="px-5 py-3">Booked</th>
//                   <th className="px-5 py-3">Action</th>
//                 </tr>
//               </thead>

//               <tbody className="divide-y divide-slate-100">
//                 {filtered.map((row) => (
//                   <tr key={row.awb} className="hover:bg-slate-50">
//                     <td className="px-5 py-4">
//                       <Link
//                         href={`/admin/logistics/awb/${encodeURIComponent(row.awb)}`}
//                         className="font-bold text-[#087f87]"
//                       >
//                         {row.awb}
//                       </Link>
//                     </td>

//                     <td className="px-5 py-4">{row.customerName}</td>
//                     <td className="px-5 py-4">{row.destination}</td>

//                     <td className="px-5 py-4">
//                       <Status value={row.status} />
//                     </td>

//                     <td className="px-5 py-4 text-slate-500">
//                       {row.bookedAt}
//                     </td>

//                     <td className="px-5 py-4">
//                       <Link
//                         href={`/admin/logistics/awb/${encodeURIComponent(row.awb)}`}
//                         className="text-xs font-bold text-[#087f87]"
//                       >
//                         View →
//                       </Link>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {filtered.length === 0 && (
//             <div className="p-10 text-center text-sm text-slate-500">
//               {rows.length === 0
//                 ? "No AWBs found."
//                 : "No AWBs match your search."}
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// function PageHeader({
//   title,
//   description,
//   action,
// }: {
//   title: string;
//   description: string;
//   action: string;
// }) {
//   return (
//     <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
//       <div>
//         <p className="text-xs font-bold uppercase tracking-widest text-[#087f87]">
//           Logistics
//         </p>
//         <h2 className="mt-1 text-2xl font-bold text-[#06284c]">
//           {title}
//         </h2>
//         <p className="mt-1 text-sm text-slate-500">
//           {description}
//         </p>
//       </div>

//       <Link
//         href={action}
//         className="rounded-lg bg-[#087f87] px-4 py-2.5 text-sm font-bold text-white"
//       >
//         + New Booking
//       </Link>
//     </div>
//   );
// }

// function Status({ value }: { value: string }) {
//   const styles: Record<string, string> = {
//     DELIVERED: "bg-emerald-100 text-emerald-700",
//     EXCEPTION: "bg-red-100 text-red-700",
//     IN_TRANSIT: "bg-blue-100 text-blue-700",
//     BOOKED: "bg-cyan-100 text-cyan-700",
//     AT_ORIGIN: "bg-amber-100 text-amber-700",
//     OUT_FOR_DELIVERY: "bg-violet-100 text-violet-700",
//     PICKED_UP: "bg-indigo-100 text-indigo-700",
//     PICKUP_REQUESTED: "bg-sky-100 text-sky-700",
//     ARRIVED_DESTINATION: "bg-teal-100 text-teal-700",
//     ON_HOLD: "bg-yellow-100 text-yellow-700",
//     CANCELLED: "bg-slate-100 text-slate-600",
//   };

//   return (
//     <span
//       className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
//         styles[value] ?? "bg-slate-100 text-slate-600"
//       }`}
//     >
//       {value}
//     </span>
//   );
// }

// "use client";

// import Link from "next/link";
// import { useEffect, useMemo, useState } from "react";
// import { useAuth } from "@/context/AuthContext";

// type TrackingStatus =
//   | "BOOKED"
//   | "PICKUP_REQUESTED"
//   | "PICKED_UP"
//   | "AT_ORIGIN"
//   | "IN_TRANSIT"
//   | "ARRIVED_DESTINATION"
//   | "OUT_FOR_DELIVERY"
//   | "DELIVERED"
//   | "ON_HOLD"
//   | "EXCEPTION"
//   | "CANCELLED";

// type AwbRow = {
//   awb: string;
//   customerName: string;
//   destination: string;
//   status: string;
//   bookedAt: string;
// };

// type ApiResponse =
//   | {
//       success: true;
//       data:
//         | Record<string, unknown>[]
//         | {
//             results?: Record<string, unknown>[];
//             items?: Record<string, unknown>[];
//             data?: Record<string, unknown>[];
//           };
//     }
//   | {
//       success: false;
//       error: {
//         code: string;
//         message: string;
//       };
//     };

// const STATUSES: Array<TrackingStatus | "ALL"> = [
//   "ALL",
//   "BOOKED",
//   "PICKUP_REQUESTED",
//   "PICKED_UP",
//   "AT_ORIGIN",
//   "IN_TRANSIT",
//   "ARRIVED_DESTINATION",
//   "OUT_FOR_DELIVERY",
//   "DELIVERED",
//   "ON_HOLD",
//   "EXCEPTION",
//   "CANCELLED",
// ];

// function formatDate(value?: string): string {
//   if (!value) {
//     return "—";
//   }

//   const date = new Date(value);

//   if (Number.isNaN(date.getTime())) {
//     return value;
//   }

//   return new Intl.DateTimeFormat("en-IN", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   }).format(date);
// }

// function normalizeAwb(
//   raw: Record<string, unknown>,
// ): AwbRow | null {
//   const awb = String(raw.awb || raw.documentId || "").trim();

//   if (!awb) {
//     return null;
//   }

//   const customerName = String(
//     raw.customerName ||
//       raw.customer ||
//       raw.customerId ||
//       "Customer",
//   );

//   const destination = String(
//     raw.destination ||
//       raw.destinationName ||
//       "—",
//   );

//   const status = String(
//     raw.currentStatus || raw.status || "BOOKED",
//   );

//   const bookedAt = formatDate(
//     raw.shipmentDate
//       ? String(raw.shipmentDate)
//       : raw.createdAt
//         ? String(raw.createdAt)
//         : undefined,
//   );

//   return {
//     awb,
//     customerName,
//     destination,
//     status,
//     bookedAt,
//   };
// }

// export default function AWBPage() {
//   const {
//     firebaseUser,
//     user,
//     loading: authLoading,
//   } = useAuth();

//   /*
//    * Normalize the role so values such as:
//    * ADMIN
//    * admin
//    * Admin
//    *
//    * are all treated as ADMIN.
//    */
//   const role = String(
//     (user as { role?: string } | null)?.role || "",
//   )
//     .trim()
//     .toUpperCase();

//   const canCreateAwb =
//     role === "ADMIN" || role === "SUPER_ADMIN";

//   const [rows, setRows] = useState<AwbRow[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [search, setSearch] = useState("");
//   const [status, setStatus] = useState<string>("ALL");
//   const [reloadKey, setReloadKey] = useState(0);

//   useEffect(() => {
//     if (authLoading) {
//       return;
//     }

//     let cancelled = false;

//     async function loadAwbs() {
//       try {
//         setLoading(true);
//         setError(null);

//         if (!firebaseUser) {
//           throw new Error(
//             "Authentication is required to view AWBs.",
//           );
//         }

//         const token = await firebaseUser.getIdToken();

//         const params = new URLSearchParams();
//         params.set("limit", "100");

//         if (status !== "ALL") {
//           params.set("status", status);
//         }

//         const res = await fetch(
//           `/api/logistics/awb/search?${params.toString()}`,
//           {
//             method: "GET",
//             headers: {
//               Accept: "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//             cache: "no-store",
//           },
//         );

//         const json = (await res.json()) as ApiResponse;

//         if (!res.ok || !json.success) {
//           throw new Error(
//             !json.success
//               ? json.error.message
//               : "Failed to load AWBs.",
//           );
//         }

//         const payload = json.data;

//         const list = Array.isArray(payload)
//           ? payload
//           : Array.isArray(payload.results)
//             ? payload.results
//             : Array.isArray(payload.items)
//               ? payload.items
//               : Array.isArray(payload.data)
//                 ? payload.data
//                 : [];

//         const normalized = list
//           .map((item) => normalizeAwb(item))
//           .filter(Boolean) as AwbRow[];

//         if (!cancelled) {
//           setRows(normalized);
//         }
//       } catch (e) {
//         if (!cancelled) {
//           setError(
//             e instanceof Error
//               ? e.message
//               : "Failed to load AWBs.",
//           );
//           setRows([]);
//         }
//       } finally {
//         if (!cancelled) {
//           setLoading(false);
//         }
//       }
//     }

//     loadAwbs();

//     return () => {
//       cancelled = true;
//     };
//   }, [authLoading, firebaseUser, status, reloadKey]);

//   const filtered = useMemo(() => {
//     const query = search.trim().toLowerCase();

//     if (!query) {
//       return rows;
//     }

//     return rows.filter((row) =>
//       [
//         row.awb,
//         row.customerName,
//         row.destination,
//         row.status,
//         row.bookedAt,
//       ]
//         .join(" ")
//         .toLowerCase()
//         .includes(query),
//     );
//   }, [rows, search]);

//   function exportCsv() {
//     const header = [
//       "AWB",
//       "Customer",
//       "Destination",
//       "Status",
//       "Booked",
//     ];

//     const lines = [
//       header.join(","),
//       ...filtered.map((row) =>
//         [
//           row.awb,
//           row.customerName,
//           row.destination,
//           row.status,
//           row.bookedAt,
//         ]
//           .map((value) => `"${String(value).replace(/"/g, '""')}"`)
//           .join(","),
//       ),
//     ];

//     const blob = new Blob([lines.join("\n")], {
//       type: "text/csv;charset=utf-8;",
//     });

//     const url = URL.createObjectURL(blob);
//     const anchor = document.createElement("a");

//     anchor.href = url;
//     anchor.download = `awbs-${new Date()
//       .toISOString()
//       .slice(0, 10)}.csv`;

//     anchor.click();

//     URL.revokeObjectURL(url);
//   }

//   return (
//     <div className="mx-auto max-w-[1500px]">
//       <PageHeader
//         title="AWB Management"
//         description="Search, review and manage airway bills."
//         canCreateAwb={canCreateAwb}
//       />

//       <div className="mb-4 flex flex-col gap-3 md:flex-row">
//         <input
//           className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm md:max-w-md"
//           placeholder="Search AWB, customer, destination..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           disabled={loading || authLoading}
//         />

//         <select
//           value={status}
//           onChange={(e) => setStatus(e.target.value)}
//           disabled={loading || authLoading}
//           className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm"
//         >
//           {STATUSES.map((item) => (
//             <option key={item} value={item}>
//               {item === "ALL" ? "All Statuses" : item}
//             </option>
//           ))}
//         </select>

//         <button
//           type="button"
//           onClick={() => setReloadKey((value) => value + 1)}
//           className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold"
//         >
//           Refresh
//         </button>

//         <button
//           type="button"
//           onClick={exportCsv}
//           disabled={filtered.length === 0}
//           className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold disabled:opacity-50"
//         >
//           Export
//         </button>
//       </div>

//       {loading || authLoading ? (
//         <div className="rounded-xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
//           <h3 className="text-lg font-bold text-[#06284c]">
//             Loading AWBs...
//           </h3>

//           <p className="mt-2 text-sm text-slate-500">
//             Fetching airway bills from Firestore.
//           </p>
//         </div>
//       ) : error ? (
//         <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-16 text-center">
//           <h3 className="text-lg font-bold text-red-800">
//             Could not load AWBs
//           </h3>

//           <p className="mt-2 text-sm text-red-700">
//             {error}
//           </p>

//           <button
//             type="button"
//             onClick={() => setReloadKey((value) => value + 1)}
//             className="mt-4 rounded-lg bg-[#087f87] px-4 py-2.5 text-sm font-bold text-white"
//           >
//             Try again
//           </button>
//         </div>
//       ) : (
//         <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
//           <div className="overflow-x-auto">
//             <table className="w-full min-w-[900px] text-left text-sm">
//               <thead className="bg-slate-50 text-xs uppercase text-slate-500">
//                 <tr>
//                   <th className="px-5 py-3">AWB</th>
//                   <th className="px-5 py-3">Customer</th>
//                   <th className="px-5 py-3">Destination</th>
//                   <th className="px-5 py-3">Status</th>
//                   <th className="px-5 py-3">Booked</th>
//                   <th className="px-5 py-3">Action</th>
//                 </tr>
//               </thead>

//               <tbody className="divide-y divide-slate-100">
//                 {filtered.map((row) => (
//                   <tr
//                     key={row.awb}
//                     className="hover:bg-slate-50"
//                   >
//                     <td className="px-5 py-4">
//                       <Link
//                         href={`/admin/logistics/awb/${encodeURIComponent(
//                           row.awb,
//                         )}`}
//                         className="font-bold text-[#087f87]"
//                       >
//                         {row.awb}
//                       </Link>
//                     </td>

//                     <td className="px-5 py-4">
//                       {row.customerName}
//                     </td>

//                     <td className="px-5 py-4">
//                       {row.destination}
//                     </td>

//                     <td className="px-5 py-4">
//                       <Status value={row.status} />
//                     </td>

//                     <td className="px-5 py-4 text-slate-500">
//                       {row.bookedAt}
//                     </td>

//                     <td className="px-5 py-4">
//                       <Link
//                         href={`/admin/logistics/awb/${encodeURIComponent(
//                           row.awb,
//                         )}`}
//                         className="text-xs font-bold text-[#087f87]"
//                       >
//                         View →
//                       </Link>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {filtered.length === 0 && (
//             <div className="p-10 text-center text-sm text-slate-500">
//               {rows.length === 0
//                 ? "No AWBs found."
//                 : "No AWBs match your search."}
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// function PageHeader({
//   title,
//   description,
//   canCreateAwb,
// }: {
//   title: string;
//   description: string;
//   canCreateAwb: boolean;
// }) {
//   return (
//     <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
//       <div>
//         <p className="text-xs font-bold uppercase tracking-widest text-[#087f87]">
//           Logistics
//         </p>

//         <h2 className="mt-1 text-2xl font-bold text-[#06284c]">
//           {title}
//         </h2>

//         <p className="mt-1 text-sm text-slate-500">
//           {description}
//         </p>
//       </div>

//       {canCreateAwb ? (
//         <Link
//           href="/admin/logistics/booking"
//           className="rounded-lg bg-[#087f87] px-4 py-2.5 text-sm font-bold text-white"
//         >
//           + New Booking
//         </Link>
//       ) : null}
//     </div>
//   );
// }

// function Status({ value }: { value: string }) {
//   const styles: Record<string, string> = {
//     DELIVERED: "bg-emerald-100 text-emerald-700",
//     EXCEPTION: "bg-red-100 text-red-700",
//     IN_TRANSIT: "bg-blue-100 text-blue-700",
//     BOOKED: "bg-cyan-100 text-cyan-700",
//     AT_ORIGIN: "bg-amber-100 text-amber-700",
//     OUT_FOR_DELIVERY: "bg-violet-100 text-violet-700",
//     PICKED_UP: "bg-indigo-100 text-indigo-700",
//     PICKUP_REQUESTED: "bg-sky-100 text-sky-700",
//     ARRIVED_DESTINATION: "bg-teal-100 text-teal-700",
//     ON_HOLD: "bg-yellow-100 text-yellow-700",
//     CANCELLED: "bg-slate-100 text-slate-600",
//   };

//   return (
//     <span
//       className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
//         styles[value] ?? "bg-slate-100 text-slate-600"
//       }`}
//     >
//       {value}
//     </span>
//   );
// }

// "use client";

// import Link from "next/link";
// import { useEffect, useMemo, useState } from "react";
// import { useAuth } from "@/context/AuthContext";
// import { can } from "@/lib/permissions";
// import type { UserRole } from "@/types/user";

// type TrackingStatus =
//   | "BOOKED"
//   | "PICKUP_REQUESTED"
//   | "PICKED_UP"
//   | "AT_ORIGIN"
//   | "IN_TRANSIT"
//   | "ARRIVED_DESTINATION"
//   | "OUT_FOR_DELIVERY"
//   | "DELIVERED"
//   | "ON_HOLD"
//   | "EXCEPTION"
//   | "CANCELLED";

// type AwbRow = {
//   awb: string;
//   customerName: string;
//   destination: string;
//   status: string;
//   bookedAt: string;
// };

// type ApiResponse =
//   | {
//       success: true;
//       data:
//         | Record<string, unknown>[]
//         | {
//             results?: Record<string, unknown>[];
//             items?: Record<string, unknown>[];
//             data?: Record<string, unknown>[];
//           };
//     }
//   | {
//       success: false;
//       error: {
//         code: string;
//         message: string;
//       };
//     };

// const STATUSES: Array<TrackingStatus | "ALL"> = [
//   "ALL",
//   "BOOKED",
//   "PICKUP_REQUESTED",
//   "PICKED_UP",
//   "AT_ORIGIN",
//   "IN_TRANSIT",
//   "ARRIVED_DESTINATION",
//   "OUT_FOR_DELIVERY",
//   "DELIVERED",
//   "ON_HOLD",
//   "EXCEPTION",
//   "CANCELLED",
// ];

// function formatDate(value?: string): string {
//   if (!value) {
//     return "—";
//   }

//   const date = new Date(value);

//   if (Number.isNaN(date.getTime())) {
//     return value;
//   }

//   return new Intl.DateTimeFormat("en-IN", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   }).format(date);
// }

// function normalizeAwb(raw: Record<string, unknown>): AwbRow | null {
//   const awb = String(raw.awb || raw.documentId || "").trim();

//   if (!awb) {
//     return null;
//   }

//   const customerName = String(
//     raw.customerName || raw.customer || raw.customerId || "Customer",
//   );

//   const destination = String(raw.destination || raw.destinationName || "—");

//   const status = String(raw.currentStatus || raw.status || "BOOKED");

//   const bookedAt = formatDate(
//     raw.shipmentDate
//       ? String(raw.shipmentDate)
//       : raw.createdAt
//         ? String(raw.createdAt)
//         : undefined,
//   );

//   return {
//     awb,
//     customerName,
//     destination,
//     status,
//     bookedAt,
//   };
// }

// export default function AWBPage() {
//   const { firebaseUser, user, loading: authLoading } = useAuth();

//   const permissionUser = user
//     ? {
//         userId: String(
//           (user as { userId?: string; id?: string }).userId ||
//             (user as { id?: string }).id ||
//             "",
//         ),
//         role: (String((user as { role?: string }).role || "")
//           .trim()
//           .toUpperCase() || null) as UserRole | null,
//       }
//     : null;

//   /** View list: LOGISTICS_AWB_VIEW */
//   const canViewAwb = can(permissionUser, "LOGISTICS_AWB_VIEW");

//   /** + New Booking link: LOGISTICS_AWB_CREATE */
//   const canCreateAwb = can(permissionUser, "LOGISTICS_AWB_CREATE");

//   const [rows, setRows] = useState<AwbRow[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [search, setSearch] = useState("");
//   const [status, setStatus] = useState<string>("ALL");
//   const [reloadKey, setReloadKey] = useState(0);

//   useEffect(() => {
//     if (authLoading) {
//       return;
//     }

//     let cancelled = false;

//     async function loadAwbs() {
//       try {
//         setLoading(true);
//         setError(null);

//         if (!firebaseUser) {
//           throw new Error("Authentication is required to view AWBs.");
//         }

//         if (!can(permissionUser, "LOGISTICS_AWB_VIEW")) {
//           throw new Error("You do not have permission to view AWBs.");
//         }

//         const token = await firebaseUser.getIdToken(true);

//         const params = new URLSearchParams();
//         params.set("limit", "100");

//         if (status !== "ALL") {
//           params.set("status", status);
//         }

//         const res = await fetch(
//           `/api/logistics/awb/search?${params.toString()}`,
//           {
//             method: "GET",
//             headers: {
//               Accept: "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//             cache: "no-store",
//           },
//         );

//         const json = (await res.json()) as ApiResponse;

//         if (!res.ok || !json.success) {
//           throw new Error(
//             !json.success ? json.error.message : "Failed to load AWBs.",
//           );
//         }

//         const payload = json.data;

//         const list = Array.isArray(payload)
//           ? payload
//           : Array.isArray(payload.results)
//             ? payload.results
//             : Array.isArray(payload.items)
//               ? payload.items
//               : Array.isArray(payload.data)
//                 ? payload.data
//                 : [];

//         const normalized = list
//           .map((item) => normalizeAwb(item))
//           .filter(Boolean) as AwbRow[];

//         if (!cancelled) {
//           setRows(normalized);
//         }
//       } catch (e) {
//         if (!cancelled) {
//           setError(
//             e instanceof Error ? e.message : "Failed to load AWBs.",
//           );
//           setRows([]);
//         }
//       } finally {
//         if (!cancelled) {
//           setLoading(false);
//         }
//       }
//     }

//     loadAwbs();

//     return () => {
//       cancelled = true;
//     };
//   }, [authLoading, firebaseUser, user, status, reloadKey]);

//   const filtered = useMemo(() => {
//     const query = search.trim().toLowerCase();

//     if (!query) {
//       return rows;
//     }

//     return rows.filter((row) =>
//       [row.awb, row.customerName, row.destination, row.status, row.bookedAt]
//         .join(" ")
//         .toLowerCase()
//         .includes(query),
//     );
//   }, [rows, search]);

//   function exportCsv() {
//     const header = ["AWB", "Customer", "Destination", "Status", "Booked"];

//     const lines = [
//       header.join(","),
//       ...filtered.map((row) =>
//         [row.awb, row.customerName, row.destination, row.status, row.bookedAt]
//           .map((value) => `"${String(value).replace(/"/g, '""')}"`)
//           .join(","),
//       ),
//     ];

//     const blob = new Blob([lines.join("\n")], {
//       type: "text/csv;charset=utf-8;",
//     });

//     const url = URL.createObjectURL(blob);
//     const anchor = document.createElement("a");

//     anchor.href = url;
//     anchor.download = `awbs-${new Date().toISOString().slice(0, 10)}.csv`;
//     anchor.click();

//     URL.revokeObjectURL(url);
//   }

//   if (!authLoading && user && !canViewAwb) {
//     return (
//       <div className="mx-auto max-w-[1500px]">
//         <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-16 text-center">
//           <h3 className="text-lg font-bold text-red-800">Access denied</h3>
//           <p className="mt-2 text-sm text-red-700">
//             You do not have permission to view AWBs (
//             <code className="font-mono">LOGISTICS_AWB_VIEW</code>).
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="mx-auto max-w-[1500px]">
//       <PageHeader
//         title="AWB Management"
//         description="Search, review and manage airway bills."
//         canCreateAwb={canCreateAwb}
//       />

//       <div className="mb-4 flex flex-col gap-3 md:flex-row">
//         <input
//           className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm md:max-w-md"
//           placeholder="Search AWB, customer, destination..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           disabled={loading || authLoading}
//         />

//         <select
//           value={status}
//           onChange={(e) => setStatus(e.target.value)}
//           disabled={loading || authLoading}
//           className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm"
//         >
//           {STATUSES.map((item) => (
//             <option key={item} value={item}>
//               {item === "ALL" ? "All Statuses" : item}
//             </option>
//           ))}
//         </select>

//         <button
//           type="button"
//           onClick={() => setReloadKey((value) => value + 1)}
//           className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold"
//         >
//           Refresh
//         </button>

//         <button
//           type="button"
//           onClick={exportCsv}
//           disabled={filtered.length === 0}
//           className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold disabled:opacity-50"
//         >
//           Export
//         </button>
//       </div>

//       {loading || authLoading ? (
//         <div className="rounded-xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
//           <h3 className="text-lg font-bold text-[#06284c]">Loading AWBs...</h3>
//           <p className="mt-2 text-sm text-slate-500">
//             Fetching airway bills from Firestore.
//           </p>
//         </div>
//       ) : error ? (
//         <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-16 text-center">
//           <h3 className="text-lg font-bold text-red-800">
//             Could not load AWBs
//           </h3>
//           <p className="mt-2 text-sm text-red-700">{error}</p>
//           <button
//             type="button"
//             onClick={() => setReloadKey((value) => value + 1)}
//             className="mt-4 rounded-lg bg-[#087f87] px-4 py-2.5 text-sm font-bold text-white"
//           >
//             Try again
//           </button>
//         </div>
//       ) : (
//         <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
//           <div className="overflow-x-auto">
//             <table className="w-full min-w-[900px] text-left text-sm">
//               <thead className="bg-slate-50 text-xs uppercase text-slate-500">
//                 <tr>
//                   <th className="px-5 py-3">AWB</th>
//                   <th className="px-5 py-3">Customer</th>
//                   <th className="px-5 py-3">Destination</th>
//                   <th className="px-5 py-3">Status</th>
//                   <th className="px-5 py-3">Booked</th>
//                   <th className="px-5 py-3">Action</th>
//                 </tr>
//               </thead>

//               <tbody className="divide-y divide-slate-100">
//                 {filtered.map((row) => (
//                   <tr key={row.awb} className="hover:bg-slate-50">
//                     <td className="px-5 py-4">
//                       <Link
//                         href={`/admin/logistics/awb/${encodeURIComponent(
//                           row.awb,
//                         )}`}
//                         className="font-bold text-[#087f87]"
//                       >
//                         {row.awb}
//                       </Link>
//                     </td>
//                     <td className="px-5 py-4">{row.customerName}</td>
//                     <td className="px-5 py-4">{row.destination}</td>
//                     <td className="px-5 py-4">
//                       <Status value={row.status} />
//                     </td>
//                     <td className="px-5 py-4 text-slate-500">{row.bookedAt}</td>
//                     <td className="px-5 py-4">
//                       <Link
//                         href={`/admin/logistics/awb/${encodeURIComponent(
//                           row.awb,
//                         )}`}
//                         className="text-xs font-bold text-[#087f87]"
//                       >
//                         View →
//                       </Link>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {filtered.length === 0 && (
//             <div className="p-10 text-center text-sm text-slate-500">
//               {rows.length === 0
//                 ? "No AWBs found."
//                 : "No AWBs match your search."}
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// function PageHeader({
//   title,
//   description,
//   canCreateAwb,
// }: {
//   title: string;
//   description: string;
//   canCreateAwb: boolean;
// }) {
//   return (
//     <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
//       <div>
//         <p className="text-xs font-bold uppercase tracking-widest text-[#087f87]">
//           Logistics
//         </p>
//         <h2 className="mt-1 text-2xl font-bold text-[#06284c]">{title}</h2>
//         <p className="mt-1 text-sm text-slate-500">{description}</p>
//       </div>

//       {canCreateAwb ? (
//         <Link
//           href="/admin/logistics/booking"
//           className="rounded-lg bg-[#087f87] px-4 py-2.5 text-sm font-bold text-white"
//         >
//           + New Booking
//         </Link>
//       ) : null}
//     </div>
//   );
// }

// function Status({ value }: { value: string }) {
//   const styles: Record<string, string> = {
//     DELIVERED: "bg-emerald-100 text-emerald-700",
//     EXCEPTION: "bg-red-100 text-red-700",
//     IN_TRANSIT: "bg-blue-100 text-blue-700",
//     BOOKED: "bg-cyan-100 text-cyan-700",
//     AT_ORIGIN: "bg-amber-100 text-amber-700",
//     OUT_FOR_DELIVERY: "bg-violet-100 text-violet-700",
//     PICKED_UP: "bg-indigo-100 text-indigo-700",
//     PICKUP_REQUESTED: "bg-sky-100 text-sky-700",
//     ARRIVED_DESTINATION: "bg-teal-100 text-teal-700",
//     ON_HOLD: "bg-yellow-100 text-yellow-700",
//     CANCELLED: "bg-slate-100 text-slate-600",
//   };

//   return (
//     <span
//       className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
//         styles[value] ?? "bg-slate-100 text-slate-600"
//       }`}
//     >
//       {value}
//     </span>
//   );
// }

// "use client";

// import Link from "next/link";
// import { useEffect, useMemo, useState } from "react";
// import { ArrowDown, ArrowUp, ArrowUpDown, Trash2 } from "lucide-react";
// import { useAuth } from "@/context/AuthContext";
// import { can } from "@/lib/permissions";
// import type { UserRole } from "@/types/user";

// type TrackingStatus =
//   | "BOOKED"
//   | "PICKUP_REQUESTED"
//   | "PICKED_UP"
//   | "AT_ORIGIN"
//   | "IN_TRANSIT"
//   | "ARRIVED_DESTINATION"
//   | "OUT_FOR_DELIVERY"
//   | "DELIVERED"
//   | "ON_HOLD"
//   | "EXCEPTION"
//   | "CANCELLED";

// type AwbRow = {
//   awb: string;
//   customerName: string;
//   destination: string;
//   status: string;
//   bookedAt: string;
//   /** ISO / raw date for sorting */
//   bookedAtRaw: string;
// };

// type SortKey = "awb" | "customerName" | "destination" | "status" | "bookedAt";
// type SortDir = "asc" | "desc";

// type ApiResponse =
//   | {
//       success: true;
//       data:
//         | Record<string, unknown>[]
//         | {
//             results?: Record<string, unknown>[];
//             items?: Record<string, unknown>[];
//             data?: Record<string, unknown>[];
//           };
//     }
//   | {
//       success: false;
//       error: {
//         code: string;
//         message: string;
//       };
//     };

// const STATUSES: Array<TrackingStatus | "ALL"> = [
//   "ALL",
//   "BOOKED",
//   "PICKUP_REQUESTED",
//   "PICKED_UP",
//   "AT_ORIGIN",
//   "IN_TRANSIT",
//   "ARRIVED_DESTINATION",
//   "OUT_FOR_DELIVERY",
//   "DELIVERED",
//   "ON_HOLD",
//   "EXCEPTION",
//   "CANCELLED",
// ];

// function formatDate(value?: string): string {
//   if (!value) {
//     return "—";
//   }

//   const date = new Date(value);

//   if (Number.isNaN(date.getTime())) {
//     return value;
//   }

//   return new Intl.DateTimeFormat("en-IN", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   }).format(date);
// }

// function normalizeAwb(raw: Record<string, unknown>): AwbRow | null {
//   const awb = String(raw.awb || raw.documentId || "").trim();

//   if (!awb) {
//     return null;
//   }

//   const customerName = String(
//     raw.customerName || raw.customer || raw.customerId || "Customer",
//   );

//   const destination = String(raw.destination || raw.destinationName || "—");

//   const status = String(raw.currentStatus || raw.status || "BOOKED");

//   const bookedAtRaw = String(
//     raw.shipmentDate || raw.createdAt || raw.bookDate || "",
//   ).trim();

//   return {
//     awb,
//     customerName,
//     destination,
//     status,
//     bookedAt: formatDate(bookedAtRaw || undefined),
//     bookedAtRaw,
//   };
// }

// function compareRows(a: AwbRow, b: AwbRow, key: SortKey, dir: SortDir): number {
//   let cmp = 0;

//   if (key === "bookedAt") {
//     const ta = a.bookedAtRaw ? new Date(a.bookedAtRaw).getTime() : 0;
//     const tb = b.bookedAtRaw ? new Date(b.bookedAtRaw).getTime() : 0;
//     const na = Number.isFinite(ta) ? ta : 0;
//     const nb = Number.isFinite(tb) ? tb : 0;
//     cmp = na - nb;
//   } else {
//     const va = String(a[key] || "").toLowerCase();
//     const vb = String(b[key] || "").toLowerCase();
//     cmp = va.localeCompare(vb, undefined, { numeric: true, sensitivity: "base" });
//   }

//   return dir === "asc" ? cmp : -cmp;
// }

// export default function AWBPage() {
//   const { firebaseUser, user, loading: authLoading } = useAuth();

//   const permissionUser = user
//     ? {
//         userId: String(
//           (user as { userId?: string; id?: string }).userId ||
//             (user as { id?: string }).id ||
//             "",
//         ),
//         role: (String((user as { role?: string }).role || "")
//           .trim()
//           .toUpperCase() || null) as UserRole | null,
//       }
//     : null;

//   const canViewAwb = can(permissionUser, "LOGISTICS_AWB_VIEW");
//   const canCreateAwb = can(permissionUser, "LOGISTICS_AWB_CREATE");
//   // const canDeleteAwb =
//   //   can(permissionUser, "LOGISTICS_AWB_DELETE") ||
//   //   can(permissionUser, "LOGISTICS_AWB_CREATE") ||
//   //   String(permissionUser?.role || "") === "SUPER_ADMIN" ||
//   //   String(permissionUser?.role || "") === "ADMIN";

//     const canDeleteAwb =
//     String(permissionUser?.role || "") === "SUPER_ADMIN" ||
//     String(permissionUser?.role || "") === "ADMIN" ||
//     can(permissionUser, "LOGISTICS_AWB_CREATE");

//   const [rows, setRows] = useState<AwbRow[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [search, setSearch] = useState("");
//   const [status, setStatus] = useState<string>("ALL");
//   const [reloadKey, setReloadKey] = useState(0);
//   const [sortKey, setSortKey] = useState<SortKey>("bookedAt");
//   const [sortDir, setSortDir] = useState<SortDir>("desc");
//   const [deletingAwb, setDeletingAwb] = useState<string | null>(null);

//   useEffect(() => {
//     if (authLoading) {
//       return;
//     }

//     let cancelled = false;

//     async function loadAwbs() {
//       try {
//         setLoading(true);
//         setError(null);

//         if (!firebaseUser) {
//           throw new Error("Authentication is required to view AWBs.");
//         }

//         if (!can(permissionUser, "LOGISTICS_AWB_VIEW")) {
//           throw new Error("You do not have permission to view AWBs.");
//         }

//         const token = await firebaseUser.getIdToken(true);

//         const params = new URLSearchParams();
//         params.set("limit", "100");

//         if (status !== "ALL") {
//           params.set("status", status);
//         }

//         const res = await fetch(
//           `/api/logistics/awb/search?${params.toString()}`,
//           {
//             method: "GET",
//             headers: {
//               Accept: "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//             cache: "no-store",
//           },
//         );

//         const json = (await res.json()) as ApiResponse;

//         if (!res.ok || !json.success) {
//           throw new Error(
//             !json.success ? json.error.message : "Failed to load AWBs.",
//           );
//         }

//         const payload = json.data;

//         const list = Array.isArray(payload)
//           ? payload
//           : Array.isArray(payload.results)
//             ? payload.results
//             : Array.isArray(payload.items)
//               ? payload.items
//               : Array.isArray(payload.data)
//                 ? payload.data
//                 : [];

//         const normalized = list
//           .map((item) => normalizeAwb(item))
//           .filter(Boolean) as AwbRow[];

//         if (!cancelled) {
//           setRows(normalized);
//         }
//       } catch (e) {
//         if (!cancelled) {
//           setError(
//             e instanceof Error ? e.message : "Failed to load AWBs.",
//           );
//           setRows([]);
//         }
//       } finally {
//         if (!cancelled) {
//           setLoading(false);
//         }
//       }
//     }

//     loadAwbs();

//     return () => {
//       cancelled = true;
//     };
//   }, [authLoading, firebaseUser, user, status, reloadKey]);

//   const filtered = useMemo(() => {
//     const query = search.trim().toLowerCase();

//     let list = rows;
//     if (query) {
//       list = rows.filter((row) =>
//         [row.awb, row.customerName, row.destination, row.status, row.bookedAt]
//           .join(" ")
//           .toLowerCase()
//           .includes(query),
//       );
//     }

//     return [...list].sort((a, b) => compareRows(a, b, sortKey, sortDir));
//   }, [rows, search, sortKey, sortDir]);

//   function toggleSort(key: SortKey) {
//     if (sortKey === key) {
//       setSortDir((d) => (d === "asc" ? "desc" : "asc"));
//     } else {
//       setSortKey(key);
//       setSortDir(key === "bookedAt" ? "desc" : "asc");
//     }
//   }

//   async function handleDelete(row: AwbRow) {
//     if (!canDeleteAwb || !firebaseUser) return;

//     const ok = window.confirm(
//       `Delete AWB ${row.awb}?\n\nThis cannot be undone.`,
//     );
//     if (!ok) return;

//     try {
//       setDeletingAwb(row.awb);
//       setError(null);

//       const token = await firebaseUser.getIdToken(true);

//       const res = await fetch(
//         `/api/logistics/awb?awb=${encodeURIComponent(row.awb)}`,
//         {
//           method: "DELETE",
//           headers: {
//             Accept: "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         },
//       );

//       const json = (await res.json()) as
//         | { success: true; message?: string }
//         | { success: false; error: { code: string; message: string } };

//       if (!res.ok || !json.success) {
//         throw new Error(
//           !json.success
//             ? json.error.message
//             : `Delete failed (HTTP ${res.status}).`,
//         );
//       }

//       setRows((prev) => prev.filter((r) => r.awb !== row.awb));
//     } catch (e) {
//       setError(e instanceof Error ? e.message : "Failed to delete AWB.");
//     } finally {
//       setDeletingAwb(null);
//     }
//   }

//   function exportCsv() {
//     const header = ["AWB", "Customer", "Destination", "Status", "Booked"];

//     const lines = [
//       header.join(","),
//       ...filtered.map((row) =>
//         [row.awb, row.customerName, row.destination, row.status, row.bookedAt]
//           .map((value) => `"${String(value).replace(/"/g, '""')}"`)
//           .join(","),
//       ),
//     ];

//     const blob = new Blob([lines.join("\n")], {
//       type: "text/csv;charset=utf-8;",
//     });

//     const url = URL.createObjectURL(blob);
//     const anchor = document.createElement("a");

//     anchor.href = url;
//     anchor.download = `awbs-${new Date().toISOString().slice(0, 10)}.csv`;
//     anchor.click();

//     URL.revokeObjectURL(url);
//   }

//   if (!authLoading && user && !canViewAwb) {
//     return (
//       <div className="mx-auto max-w-[1500px]">
//         <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-16 text-center">
//           <h3 className="text-lg font-bold text-red-800">Access denied</h3>
//           <p className="mt-2 text-sm text-red-700">
//             You do not have permission to view AWBs (
//             <code className="font-mono">LOGISTICS_AWB_VIEW</code>).
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="mx-auto max-w-[1500px]">
//       <PageHeader
//         title="AWB Management"
//         description="Search, review and manage airway bills."
//         canCreateAwb={canCreateAwb}
//       />

//       <div className="mb-4 flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center">
//         <input
//           className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm md:max-w-md"
//           placeholder="Search AWB, customer, destination..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           disabled={loading || authLoading}
//         />

//         <select
//           value={status}
//           onChange={(e) => setStatus(e.target.value)}
//           disabled={loading || authLoading}
//           className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm"
//         >
//           {STATUSES.map((item) => (
//             <option key={item} value={item}>
//               {item === "ALL" ? "All Statuses" : item}
//             </option>
//           ))}
//         </select>

//         <select
//           value={`${sortKey}:${sortDir}`}
//           onChange={(e) => {
//             const [k, d] = e.target.value.split(":") as [SortKey, SortDir];
//             setSortKey(k);
//             setSortDir(d);
//           }}
//           disabled={loading || authLoading}
//           className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm"
//           title="Sort by"
//         >
//           <option value="bookedAt:desc">Date (newest first)</option>
//           <option value="bookedAt:asc">Date (oldest first)</option>
//           <option value="awb:asc">AWB (A → Z)</option>
//           <option value="awb:desc">AWB (Z → A)</option>
//           <option value="customerName:asc">Customer (A → Z)</option>
//           <option value="customerName:desc">Customer (Z → A)</option>
//           <option value="destination:asc">Destination (A → Z)</option>
//           <option value="destination:desc">Destination (Z → A)</option>
//           <option value="status:asc">Status (A → Z)</option>
//           <option value="status:desc">Status (Z → A)</option>
//         </select>

//         <button
//           type="button"
//           onClick={() => setReloadKey((value) => value + 1)}
//           className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold"
//         >
//           Refresh
//         </button>

//         <button
//           type="button"
//           onClick={exportCsv}
//           disabled={filtered.length === 0}
//           className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold disabled:opacity-50"
//         >
//           Export
//         </button>
//       </div>

//       {loading || authLoading ? (
//         <div className="rounded-xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
//           <h3 className="text-lg font-bold text-[#06284c]">Loading AWBs...</h3>
//           <p className="mt-2 text-sm text-slate-500">
//             Fetching airway bills from Firestore.
//           </p>
//         </div>
//       ) : error ? (
//         <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-16 text-center">
//           <h3 className="text-lg font-bold text-red-800">
//             Could not load AWBs
//           </h3>
//           <p className="mt-2 text-sm text-red-700">{error}</p>
//           <button
//             type="button"
//             onClick={() => setReloadKey((value) => value + 1)}
//             className="mt-4 rounded-lg bg-[#087f87] px-4 py-2.5 text-sm font-bold text-white"
//           >
//             Try again
//           </button>
//         </div>
//       ) : (
//         <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
//           <div className="overflow-x-auto">
//             <table className="w-full min-w-[900px] text-left text-sm">
//               <thead className="bg-slate-50 text-xs uppercase text-slate-500">
//                 <tr>
//                   <SortableTh
//                     label="AWB"
//                     active={sortKey === "awb"}
//                     dir={sortDir}
//                     onClick={() => toggleSort("awb")}
//                   />
//                   <SortableTh
//                     label="Customer"
//                     active={sortKey === "customerName"}
//                     dir={sortDir}
//                     onClick={() => toggleSort("customerName")}
//                   />
//                   <SortableTh
//                     label="Destination"
//                     active={sortKey === "destination"}
//                     dir={sortDir}
//                     onClick={() => toggleSort("destination")}
//                   />
//                   <SortableTh
//                     label="Status"
//                     active={sortKey === "status"}
//                     dir={sortDir}
//                     onClick={() => toggleSort("status")}
//                   />
//                   <SortableTh
//                     label="Booked"
//                     active={sortKey === "bookedAt"}
//                     dir={sortDir}
//                     onClick={() => toggleSort("bookedAt")}
//                   />
//                   <th className="px-5 py-3">Action</th>
//                 </tr>
//               </thead>

//               <tbody className="divide-y divide-slate-100">
//                 {filtered.map((row) => (
//                   <tr key={row.awb} className="hover:bg-slate-50">
//                     <td className="px-5 py-4">
//                       <Link
//                         href={`/admin/logistics/awb/${encodeURIComponent(
//                           row.awb,
//                         )}`}
//                         className="font-bold text-[#087f87]"
//                       >
//                         {row.awb}
//                       </Link>
//                     </td>
//                     <td className="px-5 py-4">{row.customerName}</td>
//                     <td className="px-5 py-4">{row.destination}</td>
//                     <td className="px-5 py-4">
//                       <Status value={row.status} />
//                     </td>
//                     <td className="px-5 py-4 text-slate-500">{row.bookedAt}</td>
//                     <td className="px-5 py-4">
//                       <div className="flex items-center gap-2">
//                         <Link
//                           href={`/admin/logistics/awb/${encodeURIComponent(
//                             row.awb,
//                           )}`}
//                           className="text-xs font-bold text-[#087f87]"
//                         >
//                           View →
//                         </Link>
//                         {canDeleteAwb ? (
//                           <button
//                             type="button"
//                             onClick={() => handleDelete(row)}
//                             disabled={deletingAwb === row.awb}
//                             className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
//                             title={
//                               deletingAwb === row.awb
//                                 ? "Deleting…"
//                                 : `Delete ${row.awb}`
//                             }
//                             aria-label={`Delete ${row.awb}`}
//                           >
//                             <Trash2 className="h-4 w-4" />
//                           </button>
//                         ) : null}
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {filtered.length === 0 && (
//             <div className="p-10 text-center text-sm text-slate-500">
//               {rows.length === 0
//                 ? "No AWBs found."
//                 : "No AWBs match your search."}
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// function SortableTh({
//   label,
//   active,
//   dir,
//   onClick,
// }: {
//   label: string;
//   active: boolean;
//   dir: SortDir;
//   onClick: () => void;
// }) {
//   return (
//     <th className="px-5 py-3">
//       <button
//         type="button"
//         onClick={onClick}
//         className="inline-flex items-center gap-1 font-semibold uppercase tracking-wide hover:text-slate-800"
//       >
//         {label}
//         {active ? (
//           dir === "asc" ? (
//             <ArrowUp className="h-3.5 w-3.5" />
//           ) : (
//             <ArrowDown className="h-3.5 w-3.5" />
//           )
//         ) : (
//           <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />
//         )}
//       </button>
//     </th>
//   );
// }

// function PageHeader({
//   title,
//   description,
//   canCreateAwb,
// }: {
//   title: string;
//   description: string;
//   canCreateAwb: boolean;
// }) {
//   return (
//     <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
//       <div>
//         <p className="text-xs font-bold uppercase tracking-widest text-[#087f87]">
//           Logistics
//         </p>
//         <h2 className="mt-1 text-2xl font-bold text-[#06284c]">{title}</h2>
//         <p className="mt-1 text-sm text-slate-500">{description}</p>
//       </div>

//       {canCreateAwb ? (
//         <Link
//           href="/admin/logistics/booking"
//           className="rounded-lg bg-[#087f87] px-4 py-2.5 text-sm font-bold text-white"
//         >
//           + New Booking
//         </Link>
//       ) : null}
//     </div>
//   );
// }

// function Status({ value }: { value: string }) {
//   const styles: Record<string, string> = {
//     DELIVERED: "bg-emerald-100 text-emerald-700",
//     EXCEPTION: "bg-red-100 text-red-700",
//     IN_TRANSIT: "bg-blue-100 text-blue-700",
//     BOOKED: "bg-cyan-100 text-cyan-700",
//     AT_ORIGIN: "bg-amber-100 text-amber-700",
//     OUT_FOR_DELIVERY: "bg-violet-100 text-violet-700",
//     PICKED_UP: "bg-indigo-100 text-indigo-700",
//     PICKUP_REQUESTED: "bg-sky-100 text-sky-700",
//     ARRIVED_DESTINATION: "bg-teal-100 text-teal-700",
//     ON_HOLD: "bg-yellow-100 text-yellow-700",
//     CANCELLED: "bg-slate-100 text-slate-600",
//   };

//   return (
//     <span
//       className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
//         styles[value] ?? "bg-slate-100 text-slate-600"
//       }`}
//     >
//       {value}
//     </span>
//   );
// }

"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, Trash2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { can } from "@/lib/permissions";
import type { UserRole } from "@/types/user";

type AwbRow = {
  awb: string;
  customerName: string;
  destination: string;
  status: string;
  bookedAt: string;
  bookedAtRaw: string;
};

type TrackingStageOption = {
  code: string;
  label: string;
  enabled: boolean;
  order: number;
};

type SortKey = "awb" | "customerName" | "destination" | "status" | "bookedAt";
type SortDir = "asc" | "desc";

type ApiResponse =
  | {
      success: true;
      data:
        | Record<string, unknown>[]
        | {
            results?: Record<string, unknown>[];
            items?: Record<string, unknown>[];
            data?: Record<string, unknown>[];
            stages?: Record<string, unknown>[];
          };
      stages?: Record<string, unknown>[];
    }
  | {
      success: false;
      error: {
        code: string;
        message: string;
      };
    };

const STATUS_BADGE_STYLES: Record<string, string> = {
  DELIVERED: "bg-emerald-100 text-emerald-700",
  EXCEPTION: "bg-red-100 text-red-700",
  IN_TRANSIT: "bg-blue-100 text-blue-700",
  BOOKED: "bg-cyan-100 text-cyan-700",
  BOOKING_CONFIRMED: "bg-cyan-100 text-cyan-700",
  AT_ORIGIN: "bg-amber-100 text-amber-700",
  OUT_FOR_DELIVERY: "bg-violet-100 text-violet-700",
  PICKED_UP: "bg-indigo-100 text-indigo-700",
  PICKUP_REQUESTED: "bg-sky-100 text-sky-700",
  ARRIVED_DESTINATION: "bg-teal-100 text-teal-700",
  ON_HOLD: "bg-yellow-100 text-yellow-700",
  CANCELLED: "bg-slate-100 text-slate-600",
  SHIPMENT_RECEIVED: "bg-sky-100 text-sky-700",
  HANDLING_IN_PROGRESS: "bg-amber-100 text-amber-700",
  PROCESSED_AND_PACKED: "bg-indigo-100 text-indigo-700",
  SHIPPING_LABEL_GENERATED: "bg-violet-100 text-violet-700",
  FORWARDED_TO_AIRPORT: "bg-blue-100 text-blue-700",
};

function formatDate(value?: string): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function asRecord(
  value: unknown,
): Record<string, unknown> | undefined {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return undefined;
}

function normalizeStage(
  raw: Record<string, unknown>,
): TrackingStageOption | null {
  const code = String(raw.code || raw.trackingStageId || raw.id || "")
    .trim()
    .toUpperCase();
  if (!code) return null;

  const label = String(raw.label || raw.name || code).trim() || code;
  const enabled =
    raw.enabled === undefined
      ? String(raw.status || "ACTIVE").toUpperCase() !== "INACTIVE"
      : Boolean(raw.enabled);
  const order = Number(raw.order ?? raw.sortOrder ?? 0);

  return {
    code,
    label,
    enabled,
    order: Number.isFinite(order) ? order : 0,
  };
}

/** Destination column = consignee country (from booking consignee form) */
function resolveDestinationCountry(raw: Record<string, unknown>): string {
  const consignee =
    asRecord(raw.consignee) || asRecord(raw.receiver) || {};
  const country = String(
    consignee.country ||
      raw.consigneeCountry ||
      raw.receiverCountry ||
      raw.destinationCountry ||
      raw.countryOfDestination ||
      "",
  ).trim();

  if (country) return country;

  // Fallback only if country was never stored
  return String(
    raw.destination || raw.destinationName || raw.destinationCode || "—",
  ).trim() || "—";
}

function normalizeAwb(raw: Record<string, unknown>): AwbRow | null {
  const awb = String(raw.awb || raw.documentId || "").trim();
  if (!awb) return null;

  const customerName = String(
    raw.customerName || raw.customer || raw.customerId || "Customer",
  );

  const destination = resolveDestinationCountry(raw);

  const status = String(raw.currentStatus || raw.status || "BOOKED")
    .trim()
    .toUpperCase();

  const bookedAtRaw = String(
    raw.shipmentDate || raw.createdAt || raw.bookDate || "",
  ).trim();

  return {
    awb,
    customerName,
    destination,
    status,
    bookedAt: formatDate(bookedAtRaw || undefined),
    bookedAtRaw,
  };
}

function compareRows(a: AwbRow, b: AwbRow, key: SortKey, dir: SortDir): number {
  let cmp = 0;
  if (key === "bookedAt") {
    const ta = a.bookedAtRaw ? new Date(a.bookedAtRaw).getTime() : 0;
    const tb = b.bookedAtRaw ? new Date(b.bookedAtRaw).getTime() : 0;
    const na = Number.isFinite(ta) ? ta : 0;
    const nb = Number.isFinite(tb) ? tb : 0;
    cmp = na - nb;
  } else {
    const va = String(a[key] || "").toLowerCase();
    const vb = String(b[key] || "").toLowerCase();
    cmp = va.localeCompare(vb, undefined, {
      numeric: true,
      sensitivity: "base",
    });
  }
  return dir === "asc" ? cmp : -cmp;
}

export default function AWBPage() {
  const { firebaseUser, user, loading: authLoading } = useAuth();

  const permissionUser = user
    ? {
        userId: String(
          (user as { userId?: string; id?: string }).userId ||
            (user as { id?: string }).id ||
            "",
        ),
        role: (String((user as { role?: string }).role || "")
          .trim()
          .toUpperCase() || null) as UserRole | null,
      }
    : null;

  const canViewAwb = can(permissionUser, "LOGISTICS_AWB_VIEW");
  const canCreateAwb = can(permissionUser, "LOGISTICS_AWB_CREATE");
  const canDeleteAwb =
    String(permissionUser?.role || "") === "SUPER_ADMIN" ||
    String(permissionUser?.role || "") === "ADMIN" ||
    can(permissionUser, "LOGISTICS_AWB_CREATE");

  const [rows, setRows] = useState<AwbRow[]>([]);
  const [stages, setStages] = useState<TrackingStageOption[]>([]);
  const [stagesLoading, setStagesLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("ALL");
  const [reloadKey, setReloadKey] = useState(0);
  const [sortKey, setSortKey] = useState<SortKey>("bookedAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [deletingAwb, setDeletingAwb] = useState<string | null>(null);

  const stageLabelByCode = useMemo(() => {
    const map = new Map<string, string>();
    for (const s of stages) {
      map.set(s.code.toUpperCase(), s.label);
    }
    return map;
  }, [stages]);

  const statusFilterOptions = useMemo(
    () => [
      { code: "ALL", label: "All Statuses" },
      ...stages.map((s) => ({ code: s.code, label: s.label })),
    ],
    [stages],
  );

  // Configure stages — realtime from API (same as tracking matrix)
  useEffect(() => {
    if (authLoading || !firebaseUser) return;

    let cancelled = false;

    async function loadStages() {
      try {
        setStagesLoading(true);
        const token = await firebaseUser!.getIdToken(true);
        const res = await fetch("/api/logistics/tracking/stages", {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });
        const json = await res.json();

        if (!res.ok || !json.success) {
          if (!cancelled) setStages([]);
          return;
        }

        const rawList = Array.isArray(json.stages)
          ? json.stages
          : Array.isArray(json.data)
            ? json.data
            : Array.isArray(json.data?.stages)
              ? json.data.stages
              : Array.isArray(json.data?.results)
                ? json.data.results
                : [];

        const normalized = (rawList as Record<string, unknown>[])
          .map((row) => normalizeStage(row))
          .filter(Boolean) as TrackingStageOption[];

        const enabled = normalized
          .filter((s) => s.enabled)
          .sort(
            (a, b) => a.order - b.order || a.label.localeCompare(b.label),
          );

        if (!cancelled) setStages(enabled);
      } catch {
        if (!cancelled) setStages([]);
      } finally {
        if (!cancelled) setStagesLoading(false);
      }
    }

    loadStages();
    return () => {
      cancelled = true;
    };
  }, [authLoading, firebaseUser, reloadKey]);

  // If selected stage was removed in Configure stages, reset filter
  useEffect(() => {
    if (stagesLoading) return;
    if (status === "ALL") return;
    if (!stages.some((s) => s.code === status)) {
      setStatus("ALL");
    }
  }, [stages, stagesLoading, status]);

  useEffect(() => {
    if (authLoading) return;

    let cancelled = false;

    async function loadAwbs() {
      try {
        setLoading(true);
        setError(null);

        if (!firebaseUser) {
          throw new Error("Authentication is required to view AWBs.");
        }

        if (!can(permissionUser, "LOGISTICS_AWB_VIEW")) {
          throw new Error("You do not have permission to view AWBs.");
        }

        const token = await firebaseUser.getIdToken(true);
        const params = new URLSearchParams();
        params.set("limit", "100");
        if (status !== "ALL") {
          params.set("status", status);
        }

        const res = await fetch(
          `/api/logistics/awb/search?${params.toString()}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
          },
        );

        const json = (await res.json()) as ApiResponse;

        if (!res.ok || !json.success) {
          throw new Error(
            !json.success ? json.error.message : "Failed to load AWBs.",
          );
        }

        const payload = json.data;
        const list = Array.isArray(payload)
          ? payload
          : Array.isArray(
                (payload as { results?: unknown[] }).results,
              )
            ? (payload as { results: Record<string, unknown>[] }).results
            : Array.isArray((payload as { items?: unknown[] }).items)
              ? (payload as { items: Record<string, unknown>[] }).items
              : Array.isArray((payload as { data?: unknown[] }).data)
                ? (payload as { data: Record<string, unknown>[] }).data
                : [];

        const normalized = list
          .map((item) => normalizeAwb(item))
          .filter(Boolean) as AwbRow[];

        if (!cancelled) setRows(normalized);
      } catch (e) {
        if (!cancelled) {
          setError(
            e instanceof Error ? e.message : "Failed to load AWBs.",
          );
          setRows([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadAwbs();
    return () => {
      cancelled = true;
    };
  }, [authLoading, firebaseUser, user, status, reloadKey]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    let list = rows;
    if (query) {
      list = rows.filter((row) => {
        const label =
          stageLabelByCode.get(row.status.toUpperCase()) || row.status;
        return [
          row.awb,
          row.customerName,
          row.destination,
          row.status,
          label,
          row.bookedAt,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);
      });
    }
    return [...list].sort((a, b) => compareRows(a, b, sortKey, sortDir));
  }, [rows, search, sortKey, sortDir, stageLabelByCode]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "bookedAt" ? "desc" : "asc");
    }
  }

  async function handleDelete(row: AwbRow) {
    if (!canDeleteAwb || !firebaseUser) return;

    const ok = window.confirm(
      `Delete AWB ${row.awb}?\n\nThis cannot be undone.`,
    );
    if (!ok) return;

    try {
      setDeletingAwb(row.awb);
      setError(null);
      const token = await firebaseUser.getIdToken(true);

      const res = await fetch(
        `/api/logistics/awb?awb=${encodeURIComponent(row.awb)}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const json = (await res.json()) as
        | { success: true; message?: string }
        | { success: false; error: { code: string; message: string } };

      if (!res.ok || !json.success) {
        throw new Error(
          !json.success
            ? json.error.message
            : `Delete failed (HTTP ${res.status}).`,
        );
      }

      setRows((prev) => prev.filter((r) => r.awb !== row.awb));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete AWB.");
    } finally {
      setDeletingAwb(null);
    }
  }

  function exportCsv() {
    const header = ["AWB", "Customer", "Destination", "Status", "Booked"];
    const lines = [
      header.join(","),
      ...filtered.map((row) => {
        const label =
          stageLabelByCode.get(row.status.toUpperCase()) || row.status;
        return [
          row.awb,
          row.customerName,
          row.destination,
          label,
          row.bookedAt,
        ]
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",");
      }),
    ];

    const blob = new Blob([lines.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `awbs-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  if (!authLoading && user && !canViewAwb) {
    return (
      <div className="mx-auto max-w-[1500px]">
        <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-16 text-center">
          <h3 className="text-lg font-bold text-red-800">Access denied</h3>
          <p className="mt-2 text-sm text-red-700">
            You do not have permission to view AWBs (
            <code className="font-mono">LOGISTICS_AWB_VIEW</code>).
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1500px]">
      <PageHeader
        title="AWB Management"
        description="Search, review and manage airway bills."
        canCreateAwb={canCreateAwb}
      />

      <div className="mb-4 flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center">
        <input
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm md:max-w-md"
          placeholder="Search AWB, customer, destination..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          disabled={loading || authLoading}
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          disabled={loading || authLoading || stagesLoading}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm"
        >
          {stagesLoading ? (
            <option value="ALL">Loading stages…</option>
          ) : (
            statusFilterOptions.map((item) => (
              <option key={item.code} value={item.code}>
                {item.label}
              </option>
            ))
          )}
        </select>

        <select
          value={`${sortKey}:${sortDir}`}
          onChange={(e) => {
            const [k, d] = e.target.value.split(":") as [SortKey, SortDir];
            setSortKey(k);
            setSortDir(d);
          }}
          disabled={loading || authLoading}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm"
          title="Sort by"
        >
          <option value="bookedAt:desc">Date (newest first)</option>
          <option value="bookedAt:asc">Date (oldest first)</option>
          <option value="awb:asc">AWB (A → Z)</option>
          <option value="awb:desc">AWB (Z → A)</option>
          <option value="customerName:asc">Customer (A → Z)</option>
          <option value="customerName:desc">Customer (Z → A)</option>
          <option value="destination:asc">Destination (A → Z)</option>
          <option value="destination:desc">Destination (Z → A)</option>
          <option value="status:asc">Status (A → Z)</option>
          <option value="status:desc">Status (Z → A)</option>
        </select>

        <button
          type="button"
          onClick={() => setReloadKey((value) => value + 1)}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold"
        >
          Refresh
        </button>

        <button
          type="button"
          onClick={exportCsv}
          disabled={filtered.length === 0}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold disabled:opacity-50"
        >
          Export
        </button>
      </div>

      {loading || authLoading ? (
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
          <h3 className="text-lg font-bold text-[#06284c]">Loading AWBs...</h3>
          <p className="mt-2 text-sm text-slate-500">
            Fetching airway bills from Firestore.
          </p>
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-16 text-center">
          <h3 className="text-lg font-bold text-red-800">
            Could not load AWBs
          </h3>
          <p className="mt-2 text-sm text-red-700">{error}</p>
          <button
            type="button"
            onClick={() => setReloadKey((value) => value + 1)}
            className="mt-4 rounded-lg bg-[#087f87] px-4 py-2.5 text-sm font-bold text-white"
          >
            Try again
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <SortableTh
                    label="AWB"
                    active={sortKey === "awb"}
                    dir={sortDir}
                    onClick={() => toggleSort("awb")}
                  />
                  <SortableTh
                    label="Customer"
                    active={sortKey === "customerName"}
                    dir={sortDir}
                    onClick={() => toggleSort("customerName")}
                  />
                  <SortableTh
                    label="Destination"
                    active={sortKey === "destination"}
                    dir={sortDir}
                    onClick={() => toggleSort("destination")}
                  />
                  <SortableTh
                    label="Status"
                    active={sortKey === "status"}
                    dir={sortDir}
                    onClick={() => toggleSort("status")}
                  />
                  <SortableTh
                    label="Booked"
                    active={sortKey === "bookedAt"}
                    dir={sortDir}
                    onClick={() => toggleSort("bookedAt")}
                  />
                  <th className="px-5 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((row) => (
                  <tr key={row.awb} className="hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/logistics/awb/${encodeURIComponent(
                          row.awb,
                        )}`}
                        className="font-bold text-[#087f87]"
                      >
                        {row.awb}
                      </Link>
                    </td>
                    <td className="px-5 py-4">{row.customerName}</td>
                    <td className="px-5 py-4">{row.destination}</td>
                    <td className="px-5 py-4">
                      <Status
                        value={row.status}
                        label={
                          stageLabelByCode.get(row.status.toUpperCase()) ||
                          row.status
                        }
                      />
                    </td>
                    <td className="px-5 py-4 text-slate-500">{row.bookedAt}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/logistics/awb/${encodeURIComponent(
                            row.awb,
                          )}`}
                          className="text-xs font-bold text-[#087f87]"
                        >
                          View →
                        </Link>
                        {canDeleteAwb ? (
                          <button
                            type="button"
                            onClick={() => handleDelete(row)}
                            disabled={deletingAwb === row.awb}
                            className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                            title={
                              deletingAwb === row.awb
                                ? "Deleting…"
                                : `Delete ${row.awb}`
                            }
                            aria-label={`Delete ${row.awb}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="p-10 text-center text-sm text-slate-500">
              {rows.length === 0
                ? "No AWBs found."
                : "No AWBs match your search."}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SortableTh({
  label,
  active,
  dir,
  onClick,
}: {
  label: string;
  active: boolean;
  dir: SortDir;
  onClick: () => void;
}) {
  return (
    <th className="px-5 py-3">
      <button
        type="button"
        onClick={onClick}
        className="inline-flex items-center gap-1 font-semibold uppercase tracking-wide hover:text-slate-800"
      >
        {label}
        {active ? (
          dir === "asc" ? (
            <ArrowUp className="h-3.5 w-3.5" />
          ) : (
            <ArrowDown className="h-3.5 w-3.5" />
          )
        ) : (
          <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />
        )}
      </button>
    </th>
  );
}

function PageHeader({
  title,
  description,
  canCreateAwb,
}: {
  title: string;
  description: string;
  canCreateAwb: boolean;
}) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-[#087f87]">
          Logistics
        </p>
        <h2 className="mt-1 text-2xl font-bold text-[#06284c]">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
      {canCreateAwb ? (
        <Link
          href="/admin/logistics/booking"
          className="rounded-lg bg-[#087f87] px-4 py-2.5 text-sm font-bold text-white"
        >
          + New Booking
        </Link>
      ) : null}
    </div>
  );
}

function Status({ value, label }: { value: string; label?: string }) {
  const code = String(value || "").toUpperCase();
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
        STATUS_BADGE_STYLES[code] ?? "bg-slate-100 text-slate-600"
      }`}
    >
      {label || value}
    </span>
  );
}