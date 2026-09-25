// "use client";

// import Link from "next/link";
// import { useSearchParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import { useAuth } from "@/context/AuthContext";
// import {
//   TRACKING_STATUSES,
//   type TrackingStatus,
// } from "@/types/tracking";

// type ApiResponse =
//   | {
//       success: true;
//       data?: unknown;
//       message?: string;
//     }
//   | {
//       success: false;
//       error: {
//         code: string;
//         message: string;
//       };
//     };

// export default function TrackingPage() {
//   const searchParams = useSearchParams();
//   const { firebaseUser, loading: authLoading } = useAuth();

//   const [awb, setAwb] = useState("");
//   const [status, setStatus] =
//     useState<TrackingStatus>("IN_TRANSIT");
//   const [location, setLocation] = useState("");
//   const [remarks, setRemarks] = useState("");
//   const [submitting, setSubmitting] = useState(false);
//   const [message, setMessage] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fromQuery = searchParams.get("awb");

//     if (fromQuery) {
//       try {
//         setAwb(decodeURIComponent(fromQuery).trim());
//       } catch {
//         setAwb(fromQuery.trim());
//       }
//     }
//   }, [searchParams]);

//   async function updateTracking() {
//     try {
//       setSubmitting(true);
//       setMessage(null);
//       setError(null);

//       const normalizedAwb = awb.trim();
//       const normalizedLocation = location.trim();

//       if (!normalizedAwb) {
//         throw new Error("AWB is required.");
//       }

//       if (!normalizedLocation) {
//         throw new Error("Location is required.");
//       }

//       if (!firebaseUser) {
//         throw new Error(
//           "Authentication is required to update tracking.",
//         );
//       }

//       const token = await firebaseUser.getIdToken();

//       const res = await fetch("/api/logistics/tracking/update", {
//         method: "POST",
//         headers: {
//           Accept: "application/json",
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           awb: normalizedAwb,
//           status,
//           trackingStageId: status,
//           location: normalizedLocation,
//           remarks: remarks.trim() || undefined,
//         }),
//       });

//       const json = (await res.json()) as ApiResponse;

//       if (!res.ok || !json.success) {
//         throw new Error(
//           !json.success
//             ? json.error.message
//             : "Failed to update tracking.",
//         );
//       }

//       setMessage(
//         json.message ||
//           `Tracking updated: ${normalizedAwb} → ${status} at ${normalizedLocation}.`,
//       );

//       setLocation("");
//       setRemarks("");
//     } catch (e) {
//       setError(
//         e instanceof Error
//           ? e.message
//           : "Failed to update tracking.",
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   return (
//     <div className="mx-auto max-w-[1100px]">
//       <Header />

//       <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
//         <div className="border-b border-slate-200 px-5 py-4">
//           <h3 className="font-bold text-[#06284c]">
//             Update Shipment Tracking
//           </h3>
//         </div>

//         <div className="grid gap-5 p-5 md:grid-cols-2">
//           <Field
//             label="AWB"
//             value={awb}
//             onChange={setAwb}
//             placeholder="AWB-260814001"
//           />

//           <div>
//             <label className="mb-1.5 block text-xs font-bold text-slate-600">
//               Tracking Status
//             </label>

//             <select
//               value={status}
//               onChange={(e) =>
//                 setStatus(e.target.value as TrackingStatus)
//               }
//               className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm"
//             >
//               {TRACKING_STATUSES.map((item) => (
//                 <option key={item} value={item}>
//                   {item}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <Field
//             label="Current Location"
//             value={location}
//             onChange={setLocation}
//             placeholder="Hyderabad Hub"
//           />

//           <Field
//             label="Event Date / Time"
//             value="Server timestamp"
//             onChange={() => {}}
//             placeholder="Use server timestamp"
//             disabled
//           />

//           <div className="md:col-span-2">
//             <label className="mb-1.5 block text-xs font-bold text-slate-600">
//               Internal Note
//             </label>

//             <textarea
//               value={remarks}
//               onChange={(e) => setRemarks(e.target.value)}
//               className="min-h-28 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
//               placeholder="Operational note..."
//             />
//           </div>
//         </div>

//         <div className="flex flex-wrap items-center gap-3 border-t border-slate-200 px-5 py-4">
//           <button
//             type="button"
//             onClick={updateTracking}
//             disabled={submitting || authLoading}
//             className="rounded-lg bg-[#087f87] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60"
//           >
//             {submitting ? "Updating..." : "Update Tracking"}
//           </button>

//           {awb.trim() && (
//             <Link
//               href={`/admin/logistics/awb/${encodeURIComponent(awb.trim())}`}
//               className="text-sm font-bold text-[#087f87]"
//             >
//               View AWB →
//             </Link>
//           )}
//         </div>
//       </section>

//       {message && (
//         <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
//           {message}
//         </div>
//       )}

//       {error && (
//         <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
//           {error}
//         </div>
//       )}
//     </div>
//   );
// }

// function Header() {
//   return (
//     <div className="mb-6">
//       <p className="text-xs font-bold uppercase tracking-widest text-[#087f87]">
//         Logistics
//       </p>

//       <h2 className="mt-1 text-2xl font-bold text-[#06284c]">
//         Shipment Tracking
//       </h2>

//       <p className="mt-1 text-sm text-slate-500">
//         Add or update shipment tracking events.
//       </p>
//     </div>
//   );
// }

// function Field({
//   label,
//   value,
//   onChange,
//   placeholder,
//   disabled,
// }: {
//   label: string;
//   value: string;
//   onChange: (value: string) => void;
//   placeholder?: string;
//   disabled?: boolean;
// }) {
//   return (
//     <div>
//       <label className="mb-1.5 block text-xs font-bold text-slate-600">
//         {label}
//       </label>

//       <input
//         value={value}
//         disabled={disabled}
//         onChange={(e) => onChange(e.target.value)}
//         placeholder={placeholder}
//         className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm disabled:bg-slate-100"
//       />
//     </div>
//   );
// }

// "use client";

// import Link from "next/link";
// import { useSearchParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import { useAuth } from "@/context/AuthContext";
// import {
//   TRACKING_STATUSES,
//   type TrackingStatus,
// } from "@/types/tracking";

// type ApiResponse =
//   | {
//       success: true;
//       data?: unknown;
//       message?: string;
//     }
//   | {
//       success: false;
//       error: {
//         code: string;
//         message: string;
//       };
//     };

// export default function TrackingPage() {
//   const searchParams = useSearchParams();

//   const {
//     firebaseUser,
//     user,
//     role,
//     loading: authLoading,
//   } = useAuth();

//   const normalizedRole = String(
//     role ||
//       (user as { role?: string } | null)?.role ||
//       "",
//   )
//     .trim()
//     .toUpperCase();

//   const canUpdateTracking =
//     normalizedRole === "ADMIN" ||
//     normalizedRole === "SUPER_ADMIN";

//   const [awb, setAwb] = useState("");
//   const [status, setStatus] =
//     useState<TrackingStatus>("IN_TRANSIT");
//   const [location, setLocation] = useState("");
//   const [remarks, setRemarks] = useState("");
//   const [submitting, setSubmitting] = useState(false);
//   const [message, setMessage] =
//     useState<string | null>(null);
//   const [error, setError] =
//     useState<string | null>(null);

//   useEffect(() => {
//     const fromQuery =
//       searchParams.get("awb");

//     if (fromQuery) {
//       try {
//         setAwb(
//           decodeURIComponent(
//             fromQuery,
//           ).trim(),
//         );
//       } catch {
//         setAwb(fromQuery.trim());
//       }
//     }
//   }, [searchParams]);

//   async function updateTracking() {
//     try {
//       setSubmitting(true);
//       setMessage(null);
//       setError(null);

//       /*
//        * IMPORTANT:
//        * Only ADMIN and SUPER_ADMIN can update tracking.
//        *
//        * This check happens before the API request.
//        */
//       if (!canUpdateTracking) {
//         throw new Error(
//           "You do not have permission to update tracking. Only ADMIN and SUPER_ADMIN users can update tracking.",
//         );
//       }

//       const normalizedAwb =
//         awb.trim();

//       const normalizedLocation =
//         location.trim();

//       if (!normalizedAwb) {
//         throw new Error(
//           "AWB is required.",
//         );
//       }

//       if (!normalizedLocation) {
//         throw new Error(
//           "Location is required.",
//         );
//       }

//       if (!firebaseUser) {
//         throw new Error(
//           "Authentication is required to update tracking.",
//         );
//       }

//       const token =
//         await firebaseUser.getIdToken(
//           true,
//         );

//       const res = await fetch(
//         "/api/logistics/tracking/update",
//         {
//           method: "POST",

//           headers: {
//             Accept:
//               "application/json",
//             "Content-Type":
//               "application/json",
//             Authorization:
//               `Bearer ${token}`,
//           },

//           body: JSON.stringify({
//             awb: normalizedAwb,
//             status,
//             trackingStageId: status,
//             location:
//               normalizedLocation,
//             remarks:
//               remarks.trim() ||
//               undefined,
//           }),
//         },
//       );

//       const json =
//         (await res.json()) as ApiResponse;

//       if (
//         !res.ok ||
//         !json.success
//       ) {
//         throw new Error(
//           !json.success
//             ? json.error.message
//             : "Failed to update tracking.",
//         );
//       }

//       setMessage(
//         json.message ||
//           `Tracking updated: ${normalizedAwb} → ${status} at ${normalizedLocation}.`,
//       );

//       setLocation("");
//       setRemarks("");
//     } catch (e) {
//       setError(
//         e instanceof Error
//           ? e.message
//           : "Failed to update tracking.",
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   /*
//    * While authentication / Firestore role is loading,
//    * don't allow the update form to be submitted.
//    */
//   if (authLoading) {
//     return (
//       <div className="mx-auto max-w-[1100px]">
//         <Header />

//         <section className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
//           <p className="text-sm text-slate-500">
//             Loading user permissions...
//           </p>
//         </section>
//       </div>
//     );
//   }

//   return (
//     <div className="mx-auto max-w-[1100px]">
//       <Header />

//       {!canUpdateTracking ? (
//         <section className="rounded-xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
//           <div className="flex items-start gap-4">
//             <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-lg">
//               🔒
//             </div>

//             <div>
//               <h3 className="font-bold text-amber-900">
//                 Tracking Update Restricted
//               </h3>

//               <p className="mt-1 text-sm text-amber-800">
//                 Your role is{" "}
//                 <strong>
//                   {normalizedRole ||
//                     "VIEWER"}
//                 </strong>
//                 . Only{" "}
//                 <strong>
//                   ADMIN
//                 </strong>{" "}
//                 and{" "}
//                 <strong>
//                   SUPER_ADMIN
//                 </strong>{" "}
//                 users can update shipment tracking.
//               </p>

//               {awb.trim() && (
//                 <Link
//                   href={`/admin/logistics/awb/${encodeURIComponent(
//                     awb.trim(),
//                   )}`}
//                   className="mt-4 inline-block text-sm font-bold text-[#087f87]"
//                 >
//                   View AWB →
//                 </Link>
//               )}
//             </div>
//           </div>
//         </section>
//       ) : (
//         <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
//           <div className="border-b border-slate-200 px-5 py-4">
//             <h3 className="font-bold text-[#06284c]">
//               Update Shipment Tracking
//             </h3>

//             <p className="mt-1 text-xs text-slate-500">
//               Signed in as{" "}
//               <strong>
//                 {normalizedRole}
//               </strong>
//             </p>
//           </div>

//           <div className="grid gap-5 p-5 md:grid-cols-2">
//             <Field
//               label="AWB"
//               value={awb}
//               onChange={setAwb}
//               placeholder="AWB-260814001"
//             />

//             <div>
//               <label className="mb-1.5 block text-xs font-bold text-slate-600">
//                 Tracking Status
//               </label>

//               <select
//                 value={status}
//                 onChange={(e) =>
//                   setStatus(
//                     e.target.value as TrackingStatus,
//                   )
//                 }
//                 className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm"
//               >
//                 {TRACKING_STATUSES.map(
//                   (item) => (
//                     <option
//                       key={item}
//                       value={item}
//                     >
//                       {item}
//                     </option>
//                   ),
//                 )}
//               </select>
//             </div>

//             <Field
//               label="Current Location"
//               value={location}
//               onChange={setLocation}
//               placeholder="Hyderabad Hub"
//             />

//             <Field
//               label="Event Date / Time"
//               value="Server timestamp"
//               onChange={() => {}}
//               placeholder="Use server timestamp"
//               disabled
//             />

//             <div className="md:col-span-2">
//               <label className="mb-1.5 block text-xs font-bold text-slate-600">
//                 Internal Note
//               </label>

//               <textarea
//                 value={remarks}
//                 onChange={(e) =>
//                   setRemarks(
//                     e.target.value,
//                   )
//                 }
//                 className="min-h-28 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
//                 placeholder="Operational note..."
//               />
//             </div>
//           </div>

//           <div className="flex flex-wrap items-center gap-3 border-t border-slate-200 px-5 py-4">
//             <button
//               type="button"
//               onClick={updateTracking}
//               disabled={
//                 submitting ||
//                 authLoading ||
//                 !canUpdateTracking
//               }
//               className="rounded-lg bg-[#087f87] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60"
//             >
//               {submitting
//                 ? "Updating..."
//                 : "Update Tracking"}
//             </button>

//             {awb.trim() && (
//               <Link
//                 href={`/admin/logistics/awb/${encodeURIComponent(
//                   awb.trim(),
//                 )}`}
//                 className="text-sm font-bold text-[#087f87]"
//               >
//                 View AWB →
//               </Link>
//             )}
//           </div>
//         </section>
//       )}

//       {message && (
//         <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
//           {message}
//         </div>
//       )}

//       {error && (
//         <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
//           {error}
//         </div>
//       )}
//     </div>
//   );
// }

// function Header() {
//   return (
//     <div className="mb-6">
//       <p className="text-xs font-bold uppercase tracking-widest text-[#087f87]">
//         Logistics
//       </p>

//       <h2 className="mt-1 text-2xl font-bold text-[#06284c]">
//         Shipment Tracking
//       </h2>

//       <p className="mt-1 text-sm text-slate-500">
//         Add or update shipment tracking events.
//       </p>
//     </div>
//   );
// }

// function Field({
//   label,
//   value,
//   onChange,
//   placeholder,
//   disabled,
// }: {
//   label: string;
//   value: string;
//   onChange: (
//     value: string,
//   ) => void;
//   placeholder?: string;
//   disabled?: boolean;
// }) {
//   return (
//     <div>
//       <label className="mb-1.5 block text-xs font-bold text-slate-600">
//         {label}
//       </label>

//       <input
//         value={value}
//         disabled={disabled}
//         onChange={(e) =>
//           onChange(e.target.value)
//         }
//         placeholder={placeholder}
//         className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm disabled:bg-slate-100"
//       />
//     </div>
//   );
// }

// "use client";

// import Link from "next/link";
// import { useSearchParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import { useAuth } from "@/context/AuthContext";
// import { can } from "@/lib/permissions";
// import type { UserRole } from "@/types/user";
// import {
//   TRACKING_STATUSES,
//   type TrackingStatus,
// } from "@/types/tracking";

// type ApiResponse =
//   | {
//       success: true;
//       data?: unknown;
//       message?: string;
//     }
//   | {
//       success: false;
//       error: {
//         code: string;
//         message: string;
//       };
//     };

// function toPermissionUser(
//   user: { userId?: string; id?: string; role?: string } | null,
//   roleFromAuth?: string | null,
// ) {
//   if (!user && !roleFromAuth) return null;

//   const roleRaw = String(roleFromAuth || user?.role || "")
//     .trim()
//     .toUpperCase();

//   return {
//     userId: String(user?.userId || user?.id || ""),
//     role: (roleRaw || null) as UserRole | null,
//   };
// }

// export default function TrackingPage() {
//   const searchParams = useSearchParams();
//   const {
//     firebaseUser,
//     user,
//     role,
//     loading: authLoading,
//   } = useAuth();

//   const permissionUser = toPermissionUser(
//     user as { userId?: string; id?: string; role?: string } | null,
//     role,
//   );

//   const roleLabel =
//     String(permissionUser?.role || "").toUpperCase() || "UNKNOWN";

//   /** View / enter tracking screen */
//   const canViewTracking = can(permissionUser, "LOGISTICS_TRACKING_VIEW");

//   /** Submit tracking updates */
//   const canUpdateTracking = can(
//     permissionUser,
//     "LOGISTICS_TRACKING_UPDATE",
//   );

//   const [awb, setAwb] = useState("");
//   const [status, setStatus] =
//     useState<TrackingStatus>("IN_TRANSIT");
//   const [location, setLocation] = useState("");
//   const [remarks, setRemarks] = useState("");
//   const [submitting, setSubmitting] = useState(false);
//   const [message, setMessage] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fromQuery = searchParams.get("awb");

//     if (fromQuery) {
//       try {
//         setAwb(decodeURIComponent(fromQuery).trim());
//       } catch {
//         setAwb(fromQuery.trim());
//       }
//     }
//   }, [searchParams]);

//   async function updateTracking() {
//     try {
//       setSubmitting(true);
//       setMessage(null);
//       setError(null);

//       if (!canUpdateTracking) {
//         throw new Error(
//           "You do not have permission to update tracking (LOGISTICS_TRACKING_UPDATE).",
//         );
//       }

//       const normalizedAwb = awb.trim();
//       const normalizedLocation = location.trim();

//       if (!normalizedAwb) {
//         throw new Error("AWB is required.");
//       }

//       if (!normalizedLocation) {
//         throw new Error("Location is required.");
//       }

//       if (!firebaseUser) {
//         throw new Error(
//           "Authentication is required to update tracking.",
//         );
//       }

//       const token = await firebaseUser.getIdToken(true);

//       const res = await fetch("/api/logistics/tracking/update", {
//         method: "POST",
//         headers: {
//           Accept: "application/json",
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           awb: normalizedAwb,
//           status,
//           trackingStageId: status,
//           location: normalizedLocation,
//           remarks: remarks.trim() || undefined,
//         }),
//       });

//       const json = (await res.json()) as ApiResponse;

//       if (!res.ok || !json.success) {
//         throw new Error(
//           !json.success
//             ? json.error.message
//             : "Failed to update tracking.",
//         );
//       }

//       setMessage(
//         json.message ||
//           `Tracking updated: ${normalizedAwb} → ${status} at ${normalizedLocation}.`,
//       );
//       setLocation("");
//       setRemarks("");
//     } catch (e) {
//       setError(
//         e instanceof Error
//           ? e.message
//           : "Failed to update tracking.",
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   if (authLoading) {
//     return (
//       <div className="mx-auto max-w-[1100px]">
//         <Header />
//         <section className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
//           <p className="text-sm text-slate-500">
//             Loading user permissions...
//           </p>
//         </section>
//       </div>
//     );
//   }

//   if (user && !canViewTracking) {
//     return (
//       <div className="mx-auto max-w-[1100px]">
//         <Header />
//         <section className="rounded-xl border border-red-200 bg-red-50 p-6 shadow-sm">
//           <h3 className="font-bold text-red-900">Access denied</h3>
//           <p className="mt-1 text-sm text-red-800">
//             Your role is <strong>{roleLabel}</strong>. You need{" "}
//             <code className="font-mono">LOGISTICS_TRACKING_VIEW</code> to
//             open this page.
//           </p>
//         </section>
//       </div>
//     );
//   }

//   return (
//     <div className="mx-auto max-w-[1100px]">
//       <Header />

//       {!canUpdateTracking ? (
//         <section className="rounded-xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
//           <div className="flex items-start gap-4">
//             <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-lg">
//               🔒
//             </div>
//             <div>
//               <h3 className="font-bold text-amber-900">
//                 Tracking Update Restricted
//               </h3>
//               <p className="mt-1 text-sm text-amber-800">
//                 Your role is <strong>{roleLabel}</strong>. Updating
//                 tracking requires{" "}
//                 <code className="font-mono">
//                   LOGISTICS_TRACKING_UPDATE
//                 </code>
//                 .
//               </p>
//               {awb.trim() && (
//                 <Link
//                   href={`/admin/logistics/awb/${encodeURIComponent(
//                     awb.trim(),
//                   )}`}
//                   className="mt-4 inline-block text-sm font-bold text-[#087f87]"
//                 >
//                   View AWB →
//                 </Link>
//               )}
//             </div>
//           </div>
//         </section>
//       ) : (
//         <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
//           <div className="border-b border-slate-200 px-5 py-4">
//             <h3 className="font-bold text-[#06284c]">
//               Update Shipment Tracking
//             </h3>
//             <p className="mt-1 text-xs text-slate-500">
//               Signed in as <strong>{roleLabel}</strong>
//             </p>
//           </div>

//           <div className="grid gap-5 p-5 md:grid-cols-2">
//             <Field
//               label="AWB"
//               value={awb}
//               onChange={setAwb}
//               placeholder="AWB-260814001"
//             />

//             <div>
//               <label className="mb-1.5 block text-xs font-bold text-slate-600">
//                 Tracking Status
//               </label>
//               <select
//                 value={status}
//                 onChange={(e) =>
//                   setStatus(e.target.value as TrackingStatus)
//                 }
//                 className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm"
//               >
//                 {TRACKING_STATUSES.map((item) => (
//                   <option key={item} value={item}>
//                     {item}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <Field
//               label="Current Location"
//               value={location}
//               onChange={setLocation}
//               placeholder="Hyderabad Hub"
//             />

//             <Field
//               label="Event Date / Time"
//               value="Server timestamp"
//               onChange={() => {}}
//               placeholder="Use server timestamp"
//               disabled
//             />

//             <div className="md:col-span-2">
//               <label className="mb-1.5 block text-xs font-bold text-slate-600">
//                 Internal Note
//               </label>
//               <textarea
//                 value={remarks}
//                 onChange={(e) => setRemarks(e.target.value)}
//                 className="min-h-28 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
//                 placeholder="Operational note..."
//               />
//             </div>
//           </div>

//           <div className="flex flex-wrap items-center gap-3 border-t border-slate-200 px-5 py-4">
//             <button
//               type="button"
//               onClick={updateTracking}
//               disabled={
//                 submitting || authLoading || !canUpdateTracking
//               }
//               className="rounded-lg bg-[#087f87] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60"
//             >
//               {submitting ? "Updating..." : "Update Tracking"}
//             </button>

//             {awb.trim() && (
//               <Link
//                 href={`/admin/logistics/awb/${encodeURIComponent(
//                   awb.trim(),
//                 )}`}
//                 className="text-sm font-bold text-[#087f87]"
//               >
//                 View AWB →
//               </Link>
//             )}
//           </div>
//         </section>
//       )}

//       {message && (
//         <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
//           {message}
//         </div>
//       )}

//       {error && (
//         <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
//           {error}
//         </div>
//       )}
//     </div>
//   );
// }

// function Header() {
//   return (
//     <div className="mb-6">
//       <p className="text-xs font-bold uppercase tracking-widest text-[#087f87]">
//         Logistics
//       </p>
//       <h2 className="mt-1 text-2xl font-bold text-[#06284c]">
//         Shipment Tracking
//       </h2>
//       <p className="mt-1 text-sm text-slate-500">
//         Add or update shipment tracking events.
//       </p>
//     </div>
//   );
// }

// function Field({
//   label,
//   value,
//   onChange,
//   placeholder,
//   disabled,
// }: {
//   label: string;
//   value: string;
//   onChange: (value: string) => void;
//   placeholder?: string;
//   disabled?: boolean;
// }) {
//   return (
//     <div>
//       <label className="mb-1.5 block text-xs font-bold text-slate-600">
//         {label}
//       </label>
//       <input
//         value={value}
//         disabled={disabled}
//         onChange={(e) => onChange(e.target.value)}
//         placeholder={placeholder}
//         className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm disabled:bg-slate-100"
//       />
//     </div>
//   );
// }

"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { can } from "@/lib/permissions";

type StageOption = {
  code: string;
  label: string;
};

type ApiResponse =
  | {
      success: true;
      data?: unknown;
      stages?: unknown;
      message?: string;
    }
  | {
      success: false;
      error: {
        code: string;
        message: string;
      };
    };

function extractStages(payload: unknown): StageOption[] {
  if (!payload) return [];

  let list: unknown[] = [];

  if (Array.isArray(payload)) {
    list = payload;
  } else if (typeof payload === "object") {
    const obj = payload as Record<string, unknown>;
    if (Array.isArray(obj.stages)) list = obj.stages;
    else if (Array.isArray(obj.data)) list = obj.data;
    else if (
      obj.data &&
      typeof obj.data === "object" &&
      Array.isArray((obj.data as { stages?: unknown[] }).stages)
    ) {
      list = (obj.data as { stages: unknown[] }).stages;
    }
  }

  return list
    .map((row) => {
      const r = row as Record<string, unknown>;
      const code = String(r.code || r.trackingStageId || r.id || "")
        .trim()
        .toUpperCase();
      if (!code) return null;
      const enabled =
        r.enabled === undefined
          ? String(r.status || "ACTIVE").toUpperCase() !== "INACTIVE"
          : Boolean(r.enabled);
      if (!enabled) return null;
      return {
        code,
        label: String(r.label || code).trim() || code,
      };
    })
    .filter(Boolean) as StageOption[];
}

export default function TrackingPage() {
  const searchParams = useSearchParams();

  const { firebaseUser, user, loading: authLoading } = useAuth();

  const permUser = {
    userId: user?.userId ?? "",
    role: user?.role ?? null,
  };

  const canUpdateTracking = can(permUser, "LOGISTICS_TRACKING_UPDATE");

  const [awb, setAwb] = useState("");
  const [status, setStatus] = useState("");
  const [location, setLocation] = useState("");
  const [remarks, setRemarks] = useState("");
  const [stages, setStages] = useState<StageOption[]>([]);
  const [stagesLoading, setStagesLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [forwardingNumber, setForwardingNumber] = useState("");

  useEffect(() => {
    const fromQuery = searchParams.get("awb");
    if (fromQuery) {
      try {
        setAwb(decodeURIComponent(fromQuery).trim());
      } catch {
        setAwb(fromQuery.trim());
      }
    }
  }, [searchParams]);

  // Same source as Configure stages / public track
  useEffect(() => {
    if (authLoading) return;

    let cancelled = false;

    async function loadStages() {
      try {
        setStagesLoading(true);
        setError(null);

        const headers: HeadersInit = { Accept: "application/json" };
        if (firebaseUser) {
          const token = await firebaseUser.getIdToken(true);
          headers.Authorization = `Bearer ${token}`;
        }

        const res = await fetch("/api/logistics/tracking/stages", {
          method: "GET",
          headers,
          cache: "no-store",
        });

        const json = (await res.json()) as ApiResponse;

        if (!res.ok || !json.success) {
          throw new Error(
            !json.success
              ? json.error.message
              : "Failed to load tracking stages.",
          );
        }

        const list = extractStages(json);
        if (!list.length) {
          // try data field shape
          const alt = extractStages(json.data);
          if (!cancelled) {
            setStages(alt);
            if (alt[0] && !status) setStatus(alt[0].code);
          }
        } else if (!cancelled) {
          setStages(list);
          if (list[0] && !status) setStatus(list[0].code);
        }
      } catch (e) {
        if (!cancelled) {
          setStages([]);
          setError(
            e instanceof Error
              ? e.message
              : "Failed to load configure stages.",
          );
        }
      } finally {
        if (!cancelled) setStagesLoading(false);
      }
    }

    loadStages();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, firebaseUser]);

  async function updateTracking() {
    try {
      setSubmitting(true);
      setMessage(null);
      setError(null);

      if (!canUpdateTracking) {
        throw new Error(
          "You do not have permission to update tracking.",
        );
      }

      const normalizedAwb = awb.trim();
      const normalizedLocation = location.trim();
      const normalizedStatus = status.trim().toUpperCase();

      if (!normalizedAwb) throw new Error("AWB is required.");
      if (!normalizedStatus) {
        throw new Error("Select a stage from Configure stages.");
      }
      if (!normalizedLocation) throw new Error("Location is required.");
      if (!firebaseUser) {
        throw new Error("Authentication is required to update tracking.");
      }

      const allowed = stages.some((s) => s.code === normalizedStatus);
      if (!allowed) {
        throw new Error(
          "Selected stage is not in Configure stages. Refresh and try again.",
        );
      }

      const token = await firebaseUser.getIdToken(true);

      const res = await fetch("/api/logistics/tracking/update", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        // body: JSON.stringify({
        //   awb: normalizedAwb,
        //   status: normalizedStatus,
        //   trackingStageId: normalizedStatus,
        //   location: normalizedLocation,
        //   remarks: remarks.trim() || undefined,
        // }),
        body: JSON.stringify({
          awb: normalizedAwb,
          status: normalizedStatus,
          trackingStageId: normalizedStatus,
          location: normalizedLocation,
          remarks: remarks.trim() || undefined,
          forwardingNumber: forwardingNumber.trim() || undefined,
        }),
      });

      const json = (await res.json()) as ApiResponse;

      if (!res.ok || !json.success) {
        throw new Error(
          !json.success
            ? json.error.message
            : "Failed to update tracking.",
        );
      }

      setMessage(
        json.message ||
          `Tracking updated: ${normalizedAwb} → ${normalizedStatus} at ${normalizedLocation}.`,
      );

      setLocation("");
      setRemarks("");
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Failed to update tracking.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (authLoading) {
    return (
      <div className="mx-auto max-w-[1100px]">
        <Header />
        <section className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <p className="text-sm text-slate-500">Loading user permissions...</p>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1100px]">
      <Header />

      {!canUpdateTracking ? (
        <section className="rounded-xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-lg">
              🔒
            </div>
            <div>
              <h3 className="font-bold text-amber-900">
                Tracking Update Restricted
              </h3>
              <p className="mt-1 text-sm text-amber-800">
                Your role is <strong>{user?.role || "—"}</strong>. Required
                permission: <strong>LOGISTICS_TRACKING_UPDATE</strong>.
              </p>
              {awb.trim() && (
                <Link
                  href={`/admin/logistics/awb/${encodeURIComponent(awb.trim())}`}
                  className="mt-4 inline-block text-sm font-bold text-[#087f87]"
                >
                  View AWB →
                </Link>
              )}
            </div>
          </div>
        </section>
      ) : (
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="mb-4 text-xs text-slate-500">
            Status list comes from{" "}
            <Link
              href="/admin/logistics/tracking/matrix"
              className="font-bold text-[#087f87]"
            >
              Tracking Matrix → Configure stages
            </Link>
            . Add/remove stages there to change this dropdown and public track.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="AWB"
              value={awb}
              onChange={setAwb}
              placeholder="AWB number"
            />

            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-600">
                Stage (Configure stages)
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                disabled={stagesLoading || stages.length === 0}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm disabled:bg-slate-100"
              >
                {stagesLoading ? (
                  <option value="">Loading stages…</option>
                ) : stages.length === 0 ? (
                  <option value="">No stages configured</option>
                ) : (
                  stages.map((s) => (
                    <option key={s.code} value={s.code}>
                      {s.label} ({s.code})
                    </option>
                  ))
                )}
              </select>
            </div>

            <Field
              label="Location"
              value={location}
              onChange={setLocation}
              placeholder="City / hub"
            />

            <Field
              label="Forwarding number"
              value={forwardingNumber}
              onChange={setForwardingNumber}
              placeholder="Carrier / forwarding AWB"
            />

            <Field
              label="Remarks (optional)"
              value={remarks}
              onChange={setRemarks}
              placeholder="Notes"
            />
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={updateTracking}
              disabled={submitting || stages.length === 0}
              className="rounded-lg bg-[#087f87] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60"
            >
              {submitting ? "Updating..." : "Update Tracking"}
            </button>

            {awb.trim() && (
              <Link
                href={`/admin/logistics/awb/${encodeURIComponent(awb.trim())}`}
                className="text-sm font-bold text-[#087f87]"
              >
                View AWB →
              </Link>
            )}

            <Link
              href="/admin/logistics/tracking/matrix"
              className="text-sm font-bold text-slate-600"
            >
              Configure stages →
            </Link>
          </div>
        </section>
      )}

      {message && (
        <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          {message}
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}
    </div>
  );
}

function Header() {
  return (
    <div className="mb-6">
      <p className="text-xs font-bold uppercase tracking-widest text-[#087f87]">
        Logistics
      </p>
      <h2 className="mt-1 text-2xl font-bold text-[#06284c]">
        Shipment Tracking
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        Update shipment status using stages from Configure stages only.
      </p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold text-slate-600">
        {label}
      </label>
      <input
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm disabled:bg-slate-100"
      />
    </div>
  );
}