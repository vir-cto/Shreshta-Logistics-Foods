// "use client";

// import { FormEvent, useEffect, useMemo, useState } from "react";
// import { useAuth } from "@/context/AuthContext";
// import { formatPhone } from "@/utils/formatters";

// type ReceiverStatus = "ACTIVE" | "INACTIVE";

// type Receiver = {
//   id: string;
//   receiverId: string;
//   name: string;
//   companyName?: string;
//   phone: string;
//   email?: string;
//   address?: string;
//   city?: string;
//   state?: string;
//   postalCode?: string;
//   gstin?: string;
//   status: ReceiverStatus;
//   createdAt?: string;
//   updatedAt?: string;
// };

// type ReceiverForm = {
//   name: string;
//   companyName: string;
//   phone: string;
//   email: string;
//   address: string;
//   city: string;
//   state: string;
//   postalCode: string;
//   gstin: string;
//   status: ReceiverStatus;
// };

// type ApiResponse =
//   | {
//       success: true;
//       data: Receiver[] | Receiver;
//       message?: string;
//     }
//   | {
//       success: false;
//       error: {
//         code: string;
//         message: string;
//       };
//     };

// const EMPTY_FORM: ReceiverForm = {
//   name: "",
//   companyName: "",
//   phone: "",
//   email: "",
//   address: "",
//   city: "",
//   state: "",
//   postalCode: "",
//   gstin: "",
//   status: "ACTIVE",
// };

// function normalizeReceiver(raw: Record<string, unknown>): Receiver | null {
//   const name = String(raw.name || "").trim();
//   if (!name) return null;

//   const receiverId = String(raw.receiverId || raw.id || "").trim();
//   if (!receiverId) return null;

//   const statusRaw = String(raw.status || "ACTIVE").toUpperCase();

//   return {
//     id: String(raw.id || receiverId),
//     receiverId,
//     name,
//     companyName: raw.companyName ? String(raw.companyName) : undefined,
//     phone: String(raw.phone || "").trim(),
//     email: raw.email ? String(raw.email) : undefined,
//     address: raw.address
//       ? String(raw.address)
//       : raw.addressLine1
//         ? String(raw.addressLine1)
//         : undefined,
//     city: raw.city ? String(raw.city) : undefined,
//     state: raw.state ? String(raw.state) : undefined,
//     postalCode: raw.postalCode ? String(raw.postalCode) : undefined,
//     gstin: raw.gstin ? String(raw.gstin) : undefined,
//     status: statusRaw === "INACTIVE" ? "INACTIVE" : "ACTIVE",
//     createdAt: raw.createdAt ? String(raw.createdAt) : undefined,
//     updatedAt: raw.updatedAt ? String(raw.updatedAt) : undefined,
//   };
// }

// function toForm(receiver?: Receiver | null): ReceiverForm {
//   if (!receiver) return { ...EMPTY_FORM };

//   return {
//     name: receiver.name || "",
//     companyName: receiver.companyName || "",
//     phone: receiver.phone || "",
//     email: receiver.email || "",
//     address: receiver.address || "",
//     city: receiver.city || "",
//     state: receiver.state || "",
//     postalCode: receiver.postalCode || "",
//     gstin: receiver.gstin || "",
//     status: receiver.status || "ACTIVE",
//   };
// }

// export default function ReceiversPage() {
//   const { user, loading: authLoading } = useAuth();

//   const [items, setItems] = useState<Receiver[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [message, setMessage] = useState<string | null>(null);
//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState<"ALL" | ReceiverStatus>(
//     "ALL",
//   );
//   const [reloadKey, setReloadKey] = useState(0);

//   const [formOpen, setFormOpen] = useState(false);
//   const [editing, setEditing] = useState<Receiver | null>(null);
//   const [form, setForm] = useState<ReceiverForm>(EMPTY_FORM);

//   useEffect(() => {
//     if (authLoading) return;

//     let cancelled = false;

//     async function loadReceivers() {
//       try {
//         setLoading(true);
//         setError(null);

//         if (!user) {
//           throw new Error(
//             "Authentication is required to manage receivers.",
//           );
//         }

//         const token = await user.getIdToken();

//         const res = await fetch("/api/logistics/receivers", {
//           method: "GET",
//           headers: {
//             Accept: "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           cache: "no-store",
//         });

//         const json = (await res.json()) as ApiResponse;

//         if (!json.success) {
//           throw new Error(
//             json.error?.message || "Failed to load receivers.",
//           );
//         }

//         const payload = json.data;
//         const list = Array.isArray(payload) ? payload : [];

//         const normalized = list
//           .map((item) =>
//             normalizeReceiver(item as unknown as Record<string, unknown>),
//           )
//           .filter(Boolean) as Receiver[];

//         if (!cancelled) {
//           setItems(normalized);
//         }
//       } catch (e) {
//         if (!cancelled) {
//           setError(
//             e instanceof Error ? e.message : "Failed to load receivers.",
//           );
//           setItems([]);
//         }
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     }

//     loadReceivers();

//     return () => {
//       cancelled = true;
//     };
//   }, [authLoading, user, reloadKey]);

//   const filtered = useMemo(() => {
//     const query = search.trim().toLowerCase();

//     return items.filter((item) => {
//       if (statusFilter !== "ALL" && item.status !== statusFilter) {
//         return false;
//       }

//       if (!query) return true;

//       return [
//         item.receiverId,
//         item.name,
//         item.companyName,
//         item.phone,
//         item.email,
//         item.city,
//         item.state,
//         item.gstin,
//       ]
//         .filter(Boolean)
//         .join(" ")
//         .toLowerCase()
//         .includes(query);
//     });
//   }, [items, search, statusFilter]);

//   function openCreate() {
//     setEditing(null);
//     setForm({ ...EMPTY_FORM });
//     setFormOpen(true);
//     setMessage(null);
//     setError(null);
//   }

//   function openEdit(receiver: Receiver) {
//     setEditing(receiver);
//     setForm(toForm(receiver));
//     setFormOpen(true);
//     setMessage(null);
//     setError(null);
//   }

//   function closeForm() {
//     setFormOpen(false);
//     setEditing(null);
//     setForm({ ...EMPTY_FORM });
//   }

//   function updateForm<K extends keyof ReceiverForm>(
//     key: K,
//     value: ReceiverForm[K],
//   ) {
//     setForm((current) => ({
//       ...current,
//       [key]: value,
//     }));
//   }

//   async function handleSubmit(event: FormEvent<HTMLFormElement>) {
//     event.preventDefault();

//     try {
//       setSaving(true);
//       setError(null);
//       setMessage(null);

//       if (!user) {
//         throw new Error("Authentication is required.");
//       }

//       const name = form.name.trim();
//       const phone = form.phone.trim();

//       if (!name) {
//         throw new Error("Receiver name is required.");
//       }

//       if (!phone) {
//         throw new Error("Phone is required.");
//       }

//       const token = await user.getIdToken();

//       const payload = {
//         name,
//         companyName: form.companyName.trim() || undefined,
//         phone,
//         email: form.email.trim() || undefined,
//         address: form.address.trim() || undefined,
//         city: form.city.trim() || undefined,
//         state: form.state.trim() || undefined,
//         postalCode: form.postalCode.trim() || undefined,
//         gstin: form.gstin.trim() || undefined,
//         status: form.status,
//         ...(editing ? { receiverId: editing.receiverId } : {}),
//       };

//       const res = await fetch("/api/logistics/receivers", {
//         method: editing ? "PATCH" : "POST",
//         headers: {
//           Accept: "application/json",
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       const json = (await res.json()) as ApiResponse;

//       if (!json.success) {
//         throw new Error(
//           json.error?.message || "Failed to save receiver.",
//         );
//       }

//       setMessage(
//         editing
//           ? "Receiver updated successfully."
//           : "Receiver created successfully.",
//       );
//       closeForm();
//       setReloadKey((value) => value + 1);
//     } catch (e) {
//       setError(e instanceof Error ? e.message : "Failed to save receiver.");
//     } finally {
//       setSaving(false);
//     }
//   }

//   async function toggleStatus(receiver: Receiver) {
//     try {
//       setError(null);
//       setMessage(null);

//       if (!user) {
//         throw new Error("Authentication is required.");
//       }

//       const token = await user.getIdToken();
//       const nextStatus: ReceiverStatus =
//         receiver.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

//       const res = await fetch("/api/logistics/receivers", {
//         method: "PATCH",
//         headers: {
//           Accept: "application/json",
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           receiverId: receiver.receiverId,
//           status: nextStatus,
//         }),
//       });

//       const json = (await res.json()) as ApiResponse;

//       if (!json.success) {
//         throw new Error(
//           json.error?.message || "Failed to update status.",
//         );
//       }

//       setMessage(
//         `Receiver marked as ${nextStatus === "ACTIVE" ? "active" : "inactive"}.`,
//       );
//       setReloadKey((value) => value + 1);
//     } catch (e) {
//       setError(
//         e instanceof Error ? e.message : "Failed to update status.",
//       );
//     }
//   }

//   const inputClass =
//     "h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-[#087f87] focus:ring-2 focus:ring-cyan-100";

//   return (
//     <div className="mx-auto max-w-[1400px]">
//       <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
//         <div>
//           <p className="text-xs font-bold uppercase tracking-widest text-[#087f87]">
//             Masters
//           </p>
//           <h2 className="mt-1 text-2xl font-bold text-[#06284c]">
//             Receivers
//           </h2>
//           <p className="mt-1 text-sm text-slate-500">
//             Manage shipment receiver and consignee records.
//           </p>
//         </div>

//         <div className="flex flex-wrap gap-2">
//           <button
//             type="button"
//             onClick={() => setReloadKey((value) => value + 1)}
//             className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700"
//           >
//             Refresh
//           </button>
//           <button
//             type="button"
//             onClick={openCreate}
//             className="rounded-lg bg-[#087f87] px-4 py-2.5 text-sm font-bold text-white"
//           >
//             + Add Receiver
//           </button>
//         </div>
//       </div>

//       <div className="mb-5 grid gap-3 md:grid-cols-[1fr_180px]">
//         <input
//           value={search}
//           onChange={(event) => setSearch(event.target.value)}
//           placeholder="Search by name, phone, city, GSTIN..."
//           className={inputClass}
//         />
//         <select
//           value={statusFilter}
//           onChange={(event) =>
//             setStatusFilter(event.target.value as "ALL" | ReceiverStatus)
//           }
//           className={inputClass}
//         >
//           <option value="ALL">All statuses</option>
//           <option value="ACTIVE">Active</option>
//           <option value="INACTIVE">Inactive</option>
//         </select>
//       </div>

//       {message && (
//         <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
//           {message}
//         </div>
//       )}

//       {error && (
//         <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//           {error}
//         </div>
//       )}

//       {loading || authLoading ? (
//         <div className="rounded-xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
//           <h3 className="text-lg font-bold text-[#06284c]">
//             Loading receivers...
//           </h3>
//           <p className="mt-2 text-sm text-slate-500">
//             Fetching receiver records from the server.
//           </p>
//         </div>
//       ) : filtered.length === 0 ? (
//         <div className="rounded-xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
//           <h3 className="text-lg font-bold text-[#06284c]">
//             No receivers found
//           </h3>
//           <p className="mt-2 text-sm text-slate-500">
//             {items.length === 0
//               ? "Create the first receiver/consignee for AWB booking."
//               : "No receivers match your current search or filter."}
//           </p>
//           {items.length === 0 && (
//             <button
//               type="button"
//               onClick={openCreate}
//               className="mt-5 rounded-lg bg-[#087f87] px-4 py-2.5 text-sm font-bold text-white"
//             >
//               + Add Receiver
//             </button>
//           )}
//         </div>
//       ) : (
//         <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
//           <div className="overflow-x-auto">
//             <table className="min-w-full text-left text-sm">
//               <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
//                 <tr>
//                   <th className="px-4 py-3 font-semibold">Receiver</th>
//                   <th className="px-4 py-3 font-semibold">Phone</th>
//                   <th className="px-4 py-3 font-semibold">Location</th>
//                   <th className="px-4 py-3 font-semibold">GSTIN</th>
//                   <th className="px-4 py-3 font-semibold">Status</th>
//                   <th className="px-4 py-3 font-semibold text-right">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filtered.map((receiver) => (
//                   <tr
//                     key={receiver.receiverId}
//                     className="border-t border-slate-100"
//                   >
//                     <td className="px-4 py-3">
//                       <div className="font-semibold text-slate-900">
//                         {receiver.name}
//                       </div>
//                       <div className="mt-0.5 text-xs text-slate-500">
//                         {receiver.receiverId}
//                         {receiver.companyName
//                           ? ` · ${receiver.companyName}`
//                           : ""}
//                         {receiver.email ? ` · ${receiver.email}` : ""}
//                       </div>
//                     </td>
//                     <td className="px-4 py-3 text-slate-700">
//                       {formatPhone(receiver.phone)}
//                     </td>
//                     <td className="px-4 py-3 text-slate-700">
//                       {[receiver.city, receiver.state]
//                         .filter(Boolean)
//                         .join(", ") || "—"}
//                     </td>
//                     <td className="px-4 py-3 text-slate-700">
//                       {receiver.gstin || "—"}
//                     </td>
//                     <td className="px-4 py-3">
//                       <span
//                         className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
//                           receiver.status === "ACTIVE"
//                             ? "bg-emerald-50 text-emerald-700"
//                             : "bg-slate-100 text-slate-600"
//                         }`}
//                       >
//                         {receiver.status}
//                       </span>
//                     </td>
//                     <td className="px-4 py-3 text-right">
//                       <div className="flex justify-end gap-2">
//                         <button
//                           type="button"
//                           onClick={() => openEdit(receiver)}
//                           className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
//                         >
//                           Edit
//                         </button>
//                         <button
//                           type="button"
//                           onClick={() => toggleStatus(receiver)}
//                           className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
//                         >
//                           {receiver.status === "ACTIVE"
//                             ? "Deactivate"
//                             : "Activate"}
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//           <div className="border-t border-slate-100 px-4 py-3 text-xs text-slate-500">
//             Showing {filtered.length} of {items.length} receivers
//           </div>
//         </div>
//       )}

//       {formOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
//           <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
//             <div className="mb-5 flex items-start justify-between gap-4">
//               <div>
//                 <h3 className="text-lg font-bold text-[#06284c]">
//                   {editing ? "Edit receiver" : "Add receiver"}
//                 </h3>
//                 <p className="mt-1 text-sm text-slate-500">
//                   {editing
//                     ? `Updating ${editing.receiverId}`
//                     : "Create a receiver/consignee record for AWB booking."}
//                 </p>
//               </div>
//               <button
//                 type="button"
//                 onClick={closeForm}
//                 className="rounded-md px-2 py-1 text-sm font-semibold text-slate-500 hover:bg-slate-100"
//               >
//                 Close
//               </button>
//             </div>

//             <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
//               <div className="sm:col-span-2">
//                 <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                   Name *
//                 </label>
//                 <input
//                   value={form.name}
//                   onChange={(e) => updateForm("name", e.target.value)}
//                   className={inputClass}
//                   placeholder="Receiver / consignee name"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                   Company Name
//                 </label>
//                 <input
//                   value={form.companyName}
//                   onChange={(e) => updateForm("companyName", e.target.value)}
//                   className={inputClass}
//                   placeholder="Optional company"
//                 />
//               </div>

//               <div>
//                 <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                   Phone *
//                 </label>
//                 <input
//                   value={form.phone}
//                   onChange={(e) => updateForm("phone", e.target.value)}
//                   className={inputClass}
//                   placeholder="10-digit mobile"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                   Email
//                 </label>
//                 <input
//                   type="email"
//                   value={form.email}
//                   onChange={(e) => updateForm("email", e.target.value)}
//                   className={inputClass}
//                   placeholder="email@example.com"
//                 />
//               </div>

//               <div className="sm:col-span-2">
//                 <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                   Address
//                 </label>
//                 <textarea
//                   value={form.address}
//                   onChange={(e) => updateForm("address", e.target.value)}
//                   rows={2}
//                   className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#087f87] focus:ring-2 focus:ring-cyan-100"
//                   placeholder="Street address"
//                 />
//               </div>

//               <div>
//                 <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                   City
//                 </label>
//                 <input
//                   value={form.city}
//                   onChange={(e) => updateForm("city", e.target.value)}
//                   className={inputClass}
//                   placeholder="City"
//                 />
//               </div>

//               <div>
//                 <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                   State
//                 </label>
//                 <input
//                   value={form.state}
//                   onChange={(e) => updateForm("state", e.target.value)}
//                   className={inputClass}
//                   placeholder="State"
//                 />
//               </div>

//               <div>
//                 <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                   PIN Code
//                 </label>
//                 <input
//                   value={form.postalCode}
//                   onChange={(e) => updateForm("postalCode", e.target.value)}
//                   className={inputClass}
//                   placeholder="6-digit PIN"
//                 />
//               </div>

//               <div>
//                 <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                   GSTIN
//                 </label>
//                 <input
//                   value={form.gstin}
//                   onChange={(e) => updateForm("gstin", e.target.value)}
//                   className={inputClass}
//                   placeholder="GSTIN (optional)"
//                 />
//               </div>

//               <div>
//                 <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                   Status
//                 </label>
//                 <select
//                   value={form.status}
//                   onChange={(e) =>
//                     updateForm("status", e.target.value as ReceiverStatus)
//                   }
//                   className={inputClass}
//                 >
//                   <option value="ACTIVE">ACTIVE</option>
//                   <option value="INACTIVE">INACTIVE</option>
//                 </select>
//               </div>

//               <div className="sm:col-span-2 mt-2 flex justify-end gap-2">
//                 <button
//                   type="button"
//                   onClick={closeForm}
//                   className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700"
//                   disabled={saving}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={saving}
//                   className="rounded-lg bg-[#087f87] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60"
//                 >
//                   {saving
//                     ? "Saving..."
//                     : editing
//                       ? "Update Receiver"
//                       : "Create Receiver"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// "use client";

// import { FormEvent, useEffect, useMemo, useState } from "react";
// import { useAuth } from "@/context/AuthContext";
// import { formatPhone } from "@/utils/formatters";

// type ReceiverStatus = "ACTIVE" | "INACTIVE";

// type Receiver = {
//   id: string;
//   receiverId: string;
//   name: string;
//   companyName?: string;
//   phone: string;
//   email?: string;
//   address?: string;
//   city?: string;
//   state?: string;
//   postalCode?: string;
//   gstin?: string;
//   status: ReceiverStatus;
//   createdAt?: string;
//   updatedAt?: string;
// };

// type ReceiverForm = {
//   name: string;
//   companyName: string;
//   phone: string;
//   email: string;
//   address: string;
//   city: string;
//   state: string;
//   postalCode: string;
//   gstin: string;
//   status: ReceiverStatus;
// };

// type ApiResponse =
//   | {
//       success: true;
//       data:
//         | Receiver
//         | Receiver[]
//         | {
//             items?: Receiver[];
//             receivers?: Receiver[];
//             results?: Receiver[];
//           };
//       message?: string;
//     }
//   | {
//       success: false;
//       error: {
//         code: string;
//         message: string;
//       };
//     };

// const EMPTY_FORM: ReceiverForm = {
//   name: "",
//   companyName: "",
//   phone: "",
//   email: "",
//   address: "",
//   city: "",
//   state: "",
//   postalCode: "",
//   gstin: "",
//   status: "ACTIVE",
// };

// function normalizeReceiver(raw: Record<string, unknown>): Receiver | null {
//   const name = String(raw.name || "").trim();
//   if (!name) return null;

//   const receiverId = String(raw.receiverId || raw.id || "").trim();
//   if (!receiverId) return null;

//   const statusRaw = String(raw.status || "ACTIVE").toUpperCase();

//   return {
//     id: String(raw.id || receiverId),
//     receiverId,
//     name,
//     companyName: raw.companyName ? String(raw.companyName) : undefined,
//     phone: String(raw.phone || "").trim(),
//     email: raw.email ? String(raw.email) : undefined,
//     address: raw.address
//       ? String(raw.address)
//       : raw.addressLine1
//         ? String(raw.addressLine1)
//         : undefined,
//     city: raw.city ? String(raw.city) : undefined,
//     state: raw.state ? String(raw.state) : undefined,
//     postalCode: raw.postalCode ? String(raw.postalCode) : undefined,
//     gstin: raw.gstin ? String(raw.gstin) : undefined,
//     status: statusRaw === "INACTIVE" ? "INACTIVE" : "ACTIVE",
//     createdAt: raw.createdAt ? String(raw.createdAt) : undefined,
//     updatedAt: raw.updatedAt ? String(raw.updatedAt) : undefined,
//   };
// }

// function extractList(data: unknown): Record<string, unknown>[] {
//   if (Array.isArray(data)) {
//     return data as Record<string, unknown>[];
//   }

//   if (!data || typeof data !== "object") {
//     return [];
//   }

//   const obj = data as {
//     items?: unknown;
//     receivers?: unknown;
//     results?: unknown;
//   };

//   if (Array.isArray(obj.items)) return obj.items as Record<string, unknown>[];
//   if (Array.isArray(obj.receivers))
//     return obj.receivers as Record<string, unknown>[];
//   if (Array.isArray(obj.results))
//     return obj.results as Record<string, unknown>[];

//   return [];
// }

// function toForm(receiver?: Receiver | null): ReceiverForm {
//   if (!receiver) return { ...EMPTY_FORM };

//   return {
//     name: receiver.name || "",
//     companyName: receiver.companyName || "",
//     phone: receiver.phone || "",
//     email: receiver.email || "",
//     address: receiver.address || "",
//     city: receiver.city || "",
//     state: receiver.state || "",
//     postalCode: receiver.postalCode || "",
//     gstin: receiver.gstin || "",
//     status: receiver.status || "ACTIVE",
//   };
// }

// export default function ReceiversPage() {
//   const {
//     firebaseUser,
//     user,
//     loading: authLoading,
//   } = useAuth();

//   const [items, setItems] = useState<Receiver[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [message, setMessage] = useState<string | null>(null);
//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState<"ALL" | ReceiverStatus>(
//     "ALL",
//   );
//   const [reloadKey, setReloadKey] = useState(0);

//   const [formOpen, setFormOpen] = useState(false);
//   const [editing, setEditing] = useState<Receiver | null>(null);
//   const [form, setForm] = useState<ReceiverForm>(EMPTY_FORM);

//   useEffect(() => {
//     if (authLoading) return;

//     let cancelled = false;

//     async function loadReceivers() {
//       try {
//         setLoading(true);
//         setError(null);

//         if (!firebaseUser) {
//           throw new Error(
//             "Authentication is required to manage receivers.",
//           );
//         }

//         const token = await firebaseUser.getIdToken(true);

//         const res = await fetch("/api/logistics/receivers", {
//           method: "GET",
//           headers: {
//             Accept: "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           cache: "no-store",
//         });

//         const json = (await res.json()) as ApiResponse;

//         if (!res.ok || !json.success) {
//           throw new Error(
//             !json.success
//               ? json.error?.message || "Failed to load receivers."
//               : "Failed to load receivers.",
//           );
//         }

//         const list = extractList(json.data);
//         const normalized = list
//           .map((item) => normalizeReceiver(item))
//           .filter(Boolean) as Receiver[];

//         if (!cancelled) {
//           setItems(normalized);
//         }
//       } catch (e) {
//         if (!cancelled) {
//           setError(
//             e instanceof Error ? e.message : "Failed to load receivers.",
//           );
//           setItems([]);
//         }
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     }

//     loadReceivers();

//     return () => {
//       cancelled = true;
//     };
//   }, [authLoading, firebaseUser, reloadKey]);

//   const filtered = useMemo(() => {
//     const query = search.trim().toLowerCase();

//     return items.filter((item) => {
//       if (statusFilter !== "ALL" && item.status !== statusFilter) {
//         return false;
//       }

//       if (!query) return true;

//       return [
//         item.receiverId,
//         item.name,
//         item.companyName,
//         item.phone,
//         item.email,
//         item.city,
//         item.state,
//         item.gstin,
//       ]
//         .filter(Boolean)
//         .join(" ")
//         .toLowerCase()
//         .includes(query);
//     });
//   }, [items, search, statusFilter]);

//   function openCreate() {
//     setEditing(null);
//     setForm({ ...EMPTY_FORM });
//     setFormOpen(true);
//     setMessage(null);
//     setError(null);
//   }

//   function openEdit(receiver: Receiver) {
//     setEditing(receiver);
//     setForm(toForm(receiver));
//     setFormOpen(true);
//     setMessage(null);
//     setError(null);
//   }

//   function closeForm() {
//     setFormOpen(false);
//     setEditing(null);
//     setForm({ ...EMPTY_FORM });
//   }

//   function updateForm<K extends keyof ReceiverForm>(
//     key: K,
//     value: ReceiverForm[K],
//   ) {
//     setForm((current) => ({
//       ...current,
//       [key]: value,
//     }));
//   }

//   async function handleSubmit(event: FormEvent<HTMLFormElement>) {
//     event.preventDefault();

//     try {
//       setSaving(true);
//       setError(null);
//       setMessage(null);

//       if (!firebaseUser) {
//         throw new Error("Authentication is required.");
//       }

//       const name = form.name.trim();
//       const phone = form.phone.trim();

//       if (!name) {
//         throw new Error("Receiver name is required.");
//       }

//       if (!phone) {
//         throw new Error("Phone is required.");
//       }

//       const token = await firebaseUser.getIdToken(true);

//       const payload = {
//         name,
//         companyName: form.companyName.trim() || undefined,
//         phone,
//         email: form.email.trim() || undefined,
//         address: form.address.trim() || undefined,
//         city: form.city.trim() || undefined,
//         state: form.state.trim() || undefined,
//         postalCode: form.postalCode.trim() || undefined,
//         gstin: form.gstin.trim() || undefined,
//         status: form.status,
//         ...(editing ? { receiverId: editing.receiverId } : {}),
//       };

//       const res = await fetch("/api/logistics/receivers", {
//         method: editing ? "PATCH" : "POST",
//         headers: {
//           Accept: "application/json",
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       const json = (await res.json()) as ApiResponse;

//       if (!res.ok || !json.success) {
//         throw new Error(
//           !json.success
//             ? json.error?.message || "Failed to save receiver."
//             : "Failed to save receiver.",
//         );
//       }

//       setMessage(
//         editing
//           ? "Receiver updated successfully."
//           : "Receiver created successfully.",
//       );
//       closeForm();
//       setReloadKey((value) => value + 1);
//     } catch (e) {
//       setError(e instanceof Error ? e.message : "Failed to save receiver.");
//     } finally {
//       setSaving(false);
//     }
//   }

//   async function toggleStatus(receiver: Receiver) {
//     try {
//       setError(null);
//       setMessage(null);

//       if (!firebaseUser) {
//         throw new Error("Authentication is required.");
//       }

//       const token = await firebaseUser.getIdToken(true);
//       const nextStatus: ReceiverStatus =
//         receiver.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

//       const res = await fetch("/api/logistics/receivers", {
//         method: "PATCH",
//         headers: {
//           Accept: "application/json",
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           receiverId: receiver.receiverId,
//           status: nextStatus,
//         }),
//       });

//       const json = (await res.json()) as ApiResponse;

//       if (!res.ok || !json.success) {
//         throw new Error(
//           !json.success
//             ? json.error?.message || "Failed to update status."
//             : "Failed to update status.",
//         );
//       }

//       setMessage(
//         `Receiver marked as ${nextStatus === "ACTIVE" ? "active" : "inactive"}.`,
//       );
//       setReloadKey((value) => value + 1);
//     } catch (e) {
//       setError(
//         e instanceof Error ? e.message : "Failed to update status.",
//       );
//     }
//   }

//   const inputClass =
//     "h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-[#087f87] focus:ring-2 focus:ring-cyan-100";

//   return (
//     <div className="mx-auto max-w-[1400px]">
//       <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
//         <div>
//           <p className="text-xs font-bold uppercase tracking-widest text-[#087f87]">
//             Masters
//           </p>
//           <h2 className="mt-1 text-2xl font-bold text-[#06284c]">
//             Receivers
//           </h2>
//           <p className="mt-1 text-sm text-slate-500">
//             Manage shipment receiver and consignee records.
//           </p>
//           {user?.role ? (
//             <p className="mt-1 text-xs text-slate-400">
//               Signed in as role: <strong>{user.role}</strong>
//             </p>
//           ) : null}
//         </div>

//         <div className="flex flex-wrap gap-2">
//           <button
//             type="button"
//             onClick={() => setReloadKey((value) => value + 1)}
//             className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700"
//           >
//             Refresh
//           </button>
//           <button
//             type="button"
//             onClick={openCreate}
//             disabled={!firebaseUser}
//             className="rounded-lg bg-[#087f87] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60"
//           >
//             + Add Receiver
//           </button>
//         </div>
//       </div>

//       <div className="mb-5 grid gap-3 md:grid-cols-[1fr_180px]">
//         <input
//           value={search}
//           onChange={(event) => setSearch(event.target.value)}
//           placeholder="Search by name, phone, city, GSTIN..."
//           className={inputClass}
//         />
//         <select
//           value={statusFilter}
//           onChange={(event) =>
//             setStatusFilter(event.target.value as "ALL" | ReceiverStatus)
//           }
//           className={inputClass}
//         >
//           <option value="ALL">All statuses</option>
//           <option value="ACTIVE">Active</option>
//           <option value="INACTIVE">Inactive</option>
//         </select>
//       </div>

//       {message && (
//         <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
//           {message}
//         </div>
//       )}

//       {error && (
//         <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//           {error}
//         </div>
//       )}

//       {loading || authLoading ? (
//         <div className="rounded-xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
//           <h3 className="text-lg font-bold text-[#06284c]">
//             Loading receivers...
//           </h3>
//           <p className="mt-2 text-sm text-slate-500">
//             Fetching receiver records from the server.
//           </p>
//         </div>
//       ) : !firebaseUser ? (
//         <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-10 text-center text-sm text-red-700">
//           Authentication is required to manage receivers.
//         </div>
//       ) : filtered.length === 0 ? (
//         <div className="rounded-xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
//           <h3 className="text-lg font-bold text-[#06284c]">
//             No receivers found
//           </h3>
//           <p className="mt-2 text-sm text-slate-500">
//             {items.length === 0
//               ? "Create the first receiver/consignee for AWB booking."
//               : "No receivers match your current search or filter."}
//           </p>
//           {items.length === 0 && (
//             <button
//               type="button"
//               onClick={openCreate}
//               className="mt-5 rounded-lg bg-[#087f87] px-4 py-2.5 text-sm font-bold text-white"
//             >
//               + Add Receiver
//             </button>
//           )}
//         </div>
//       ) : (
//         <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
//           <div className="overflow-x-auto">
//             <table className="min-w-full text-left text-sm">
//               <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
//                 <tr>
//                   <th className="px-4 py-3 font-semibold">Receiver</th>
//                   <th className="px-4 py-3 font-semibold">Phone</th>
//                   <th className="px-4 py-3 font-semibold">Location</th>
//                   <th className="px-4 py-3 font-semibold">GSTIN</th>
//                   <th className="px-4 py-3 font-semibold">Status</th>
//                   <th className="px-4 py-3 font-semibold text-right">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filtered.map((receiver) => (
//                   <tr
//                     key={receiver.receiverId}
//                     className="border-t border-slate-100"
//                   >
//                     <td className="px-4 py-3">
//                       <div className="font-semibold text-slate-900">
//                         {receiver.name}
//                       </div>
//                       <div className="mt-0.5 text-xs text-slate-500">
//                         {receiver.receiverId}
//                         {receiver.companyName
//                           ? ` · ${receiver.companyName}`
//                           : ""}
//                         {receiver.email ? ` · ${receiver.email}` : ""}
//                       </div>
//                     </td>
//                     <td className="px-4 py-3 text-slate-700">
//                       {formatPhone(receiver.phone)}
//                     </td>
//                     <td className="px-4 py-3 text-slate-700">
//                       {[receiver.city, receiver.state]
//                         .filter(Boolean)
//                         .join(", ") || "—"}
//                     </td>
//                     <td className="px-4 py-3 text-slate-700">
//                       {receiver.gstin || "—"}
//                     </td>
//                     <td className="px-4 py-3">
//                       <span
//                         className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
//                           receiver.status === "ACTIVE"
//                             ? "bg-emerald-50 text-emerald-700"
//                             : "bg-slate-100 text-slate-600"
//                         }`}
//                       >
//                         {receiver.status}
//                       </span>
//                     </td>
//                     <td className="px-4 py-3 text-right">
//                       <div className="flex justify-end gap-2">
//                         <button
//                           type="button"
//                           onClick={() => openEdit(receiver)}
//                           className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
//                         >
//                           Edit
//                         </button>
//                         <button
//                           type="button"
//                           onClick={() => toggleStatus(receiver)}
//                           className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
//                         >
//                           {receiver.status === "ACTIVE"
//                             ? "Deactivate"
//                             : "Activate"}
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//           <div className="border-t border-slate-100 px-4 py-3 text-xs text-slate-500">
//             Showing {filtered.length} of {items.length} receivers
//           </div>
//         </div>
//       )}

//       {formOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
//           <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
//             <div className="mb-5 flex items-start justify-between gap-4">
//               <div>
//                 <h3 className="text-lg font-bold text-[#06284c]">
//                   {editing ? "Edit receiver" : "Add receiver"}
//                 </h3>
//                 <p className="mt-1 text-sm text-slate-500">
//                   {editing
//                     ? `Updating ${editing.receiverId}`
//                     : "Create a receiver/consignee record for AWB booking."}
//                 </p>
//               </div>
//               <button
//                 type="button"
//                 onClick={closeForm}
//                 className="rounded-md px-2 py-1 text-sm font-semibold text-slate-500 hover:bg-slate-100"
//               >
//                 Close
//               </button>
//             </div>

//             <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
//               <div className="sm:col-span-2">
//                 <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                   Name *
//                 </label>
//                 <input
//                   value={form.name}
//                   onChange={(e) => updateForm("name", e.target.value)}
//                   className={inputClass}
//                   placeholder="Receiver / consignee name"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                   Company Name
//                 </label>
//                 <input
//                   value={form.companyName}
//                   onChange={(e) => updateForm("companyName", e.target.value)}
//                   className={inputClass}
//                   placeholder="Optional company"
//                 />
//               </div>

//               <div>
//                 <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                   Phone *
//                 </label>
//                 <input
//                   value={form.phone}
//                   onChange={(e) => updateForm("phone", e.target.value)}
//                   className={inputClass}
//                   placeholder="10-digit mobile"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                   Email
//                 </label>
//                 <input
//                   type="email"
//                   value={form.email}
//                   onChange={(e) => updateForm("email", e.target.value)}
//                   className={inputClass}
//                   placeholder="email@example.com"
//                 />
//               </div>

//               <div className="sm:col-span-2">
//                 <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                   Address
//                 </label>
//                 <textarea
//                   value={form.address}
//                   onChange={(e) => updateForm("address", e.target.value)}
//                   rows={2}
//                   className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#087f87] focus:ring-2 focus:ring-cyan-100"
//                   placeholder="Street address"
//                 />
//               </div>

//               <div>
//                 <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                   City
//                 </label>
//                 <input
//                   value={form.city}
//                   onChange={(e) => updateForm("city", e.target.value)}
//                   className={inputClass}
//                   placeholder="City"
//                 />
//               </div>

//               <div>
//                 <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                   State
//                 </label>
//                 <input
//                   value={form.state}
//                   onChange={(e) => updateForm("state", e.target.value)}
//                   className={inputClass}
//                   placeholder="State"
//                 />
//               </div>

//               <div>
//                 <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                   PIN Code
//                 </label>
//                 <input
//                   value={form.postalCode}
//                   onChange={(e) => updateForm("postalCode", e.target.value)}
//                   className={inputClass}
//                   placeholder="6-digit PIN"
//                 />
//               </div>

//               <div>
//                 <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                   GSTIN
//                 </label>
//                 <input
//                   value={form.gstin}
//                   onChange={(e) => updateForm("gstin", e.target.value)}
//                   className={inputClass}
//                   placeholder="GSTIN (optional)"
//                 />
//               </div>

//               <div>
//                 <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                   Status
//                 </label>
//                 <select
//                   value={form.status}
//                   onChange={(e) =>
//                     updateForm("status", e.target.value as ReceiverStatus)
//                   }
//                   className={inputClass}
//                 >
//                   <option value="ACTIVE">ACTIVE</option>
//                   <option value="INACTIVE">INACTIVE</option>
//                 </select>
//               </div>

//               <div className="sm:col-span-2 mt-2 flex justify-end gap-2">
//                 <button
//                   type="button"
//                   onClick={closeForm}
//                   className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700"
//                   disabled={saving}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={saving || !firebaseUser}
//                   className="rounded-lg bg-[#087f87] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60"
//                 >
//                   {saving
//                     ? "Saving..."
//                     : editing
//                       ? "Update Receiver"
//                       : "Create Receiver"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// "use client";

// import { FormEvent, useEffect, useMemo, useState } from "react";
// import { useAuth } from "@/context/AuthContext";
// import { formatPhone } from "@/utils/formatters";

// type ReceiverStatus = "ACTIVE" | "INACTIVE";

// type Receiver = {
//   id: string;
//   receiverId: string;
//   name: string;
//   contactName?: string;
//   companyName?: string;
//   phone?: string;
//   mobile?: string;
//   email?: string;
//   address?: string;
//   addressLine1?: string;
//   addressLine2?: string;
//   city?: string;
//   state?: string;
//   postalCode?: string;
//   country?: string;
//   gstin?: string;
//   iecNo?: string;
//   documentType?: string;
//   documentNo?: string;
//   documentUrl?: string;
//   status: ReceiverStatus;
//   createdAt?: string;
//   updatedAt?: string;
// };

// type ReceiverForm = {
//   companyName: string;
//   contactName: string;
//   phone: string; // Telephone — optional
//   mobile: string;
//   email: string;
//   address: string; // Address 1
//   addressLine2: string; // optional
//   city: string;
//   state: string;
//   postalCode: string;
//   country: string;
//   gstin: string;
//   iecNo: string;
//   documentType: string;
//   documentNo: string;
//   documentUrl: string; // ← add
//   status: ReceiverStatus;
// };

// type ApiResponse =
//   | {
//       success: true;
//       data:
//         | Receiver
//         | Receiver[]
//         | {
//             items?: Receiver[];
//             receivers?: Receiver[];
//             results?: Receiver[];
//           };
//       message?: string;
//     }
//   | {
//       success: false;
//       error: {
//         code: string;
//         message: string;
//       };
//     };

// const EMPTY_FORM: ReceiverForm = {
//   companyName: "",
//   contactName: "",
//   phone: "",
//   mobile: "",
//   email: "",
//   address: "",
//   addressLine2: "",
//   city: "",
//   state: "",
//   postalCode: "",
//   country: "",
//   gstin: "",
//   iecNo: "",
//   documentType: "",
//   documentNo: "",
//   documentUrl: "", // ← add
//   status: "ACTIVE",
// };

// const DOCUMENT_TYPES = [
//   { value: "", label: "Select" },
//   { value: "AADHAAR", label: "Aadhaar Number" },
//   { value: "GSTIN (Normal)", label: "GSTIN (Normal)" },
//   { value: "PAN", label: "PAN Number" },
//   { value: "PASSPORT", label: "Passport Number" },
//   { value: "TAN", label: "TAN Number" },
//   { value: "VOTER_ID", label: "Voter Id" },
// ];

// function extractList(data: unknown): Record<string, unknown>[] {
//   if (Array.isArray(data)) return data as Record<string, unknown>[];
//   if (!data || typeof data !== "object") return [];
//   const obj = data as Record<string, unknown>;
//   for (const key of ["receivers", "items", "results", "data"]) {
//     if (Array.isArray(obj[key])) return obj[key] as Record<string, unknown>[];
//   }
//   return [];
// }

// function normalizeReceiver(raw: Record<string, unknown>): Receiver | null {
//   const companyName = String(raw.companyName || "").trim();
//   const contactName = String(
//     raw.contactName || raw.name || "",
//   ).trim();
//   if (!companyName && !contactName) return null;

//   const receiverId = String(raw.receiverId || raw.id || "").trim();
//   if (!receiverId) return null;

//   const statusRaw = String(raw.status || "ACTIVE").toUpperCase();
//   const addressLine1 = String(
//     raw.addressLine1 ||
//       (typeof raw.address === "string" ? raw.address : "") ||
//       "",
//   ).trim();

//   return {
//     id: String(raw.id || receiverId),
//     receiverId,
//     name: contactName || companyName,
//     contactName: contactName || companyName,
//     companyName: companyName || undefined,
//     phone: String(raw.phone || "").trim() || undefined,
//     mobile: String(raw.mobile || "").trim() || undefined,
//     email: String(raw.email || "").trim() || undefined,
//     address: addressLine1 || undefined,
//     addressLine1: addressLine1 || undefined,
//     addressLine2: String(raw.addressLine2 || "").trim() || undefined,
//     city: String(raw.city || "").trim() || undefined,
//     state: String(raw.state || "").trim() || undefined,
//     postalCode: String(raw.postalCode || "").trim() || undefined,
//     country: String(raw.country || "").trim() || undefined,
//     gstin: String(raw.gstin || "").trim() || undefined,
//     iecNo: String(raw.iecNo || "").trim() || undefined,
//     documentType: String(raw.documentType || "").trim() || undefined,
//     documentNo: String(raw.documentNo || "").trim() || undefined,
//     documentUrl: String(raw.documentUrl || "").trim() || undefined,
//     status: statusRaw === "INACTIVE" ? "INACTIVE" : "ACTIVE",
//     createdAt: raw.createdAt ? String(raw.createdAt) : undefined,
//     updatedAt: raw.updatedAt ? String(raw.updatedAt) : undefined,
//   };
// }

// function toForm(receiver?: Receiver | null): ReceiverForm {
//   if (!receiver) return { ...EMPTY_FORM };
//   return {
//     companyName: receiver.companyName || "",
//     contactName: receiver.contactName || receiver.name || "",
//     phone: receiver.phone || "",
//     mobile: receiver.mobile || "",
//     email: receiver.email || "",
//     address: receiver.addressLine1 || receiver.address || "",
//     addressLine2: receiver.addressLine2 || "",
//     city: receiver.city || "",
//     state: receiver.state || "",
//     postalCode: receiver.postalCode || "",
//     country: receiver.country || "",
//     gstin: receiver.gstin || "",
//     iecNo: receiver.iecNo || "",
//     documentType: receiver.documentType || "",
//     documentNo: receiver.documentNo || "",
//     documentUrl: receiver.documentUrl || "", // ← add
//     status: receiver.status || "ACTIVE",
//   };
// }

// export default function ReceiversPage() {
//   const {
//     firebaseUser,
//     user,
//     loading: authLoading,
//   } = useAuth();

//   const [items, setItems] = useState<Receiver[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [message, setMessage] = useState<string | null>(null);
//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState<"ALL" | ReceiverStatus>(
//     "ALL",
//   );
//   const [reloadKey, setReloadKey] = useState(0);

//   const [formOpen, setFormOpen] = useState(false);
//   const [editing, setEditing] = useState<Receiver | null>(null);
//   const [form, setForm] = useState<ReceiverForm>(EMPTY_FORM);
//   const [uploadingDoc, setUploadingDoc] = useState(false);

//   useEffect(() => {
//     if (authLoading) return;

//     let cancelled = false;

//     async function loadReceivers() {
//       try {
//         setLoading(true);
//         setError(null);

//         if (!firebaseUser) {
//           throw new Error("Authentication is required to manage receivers.");
//         }

//         const token = await firebaseUser.getIdToken(true);

//         const res = await fetch("/api/logistics/receivers", {
//           method: "GET",
//           headers: {
//             Accept: "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           cache: "no-store",
//         });

//         const json = (await res.json()) as ApiResponse;

//         if (!res.ok || !json.success) {
//           throw new Error(
//             !json.success
//               ? json.error?.message || "Failed to load receivers."
//               : "Failed to load receivers.",
//           );
//         }

//         const list = extractList(json.data);
//         const normalized = list
//           .map((item) => normalizeReceiver(item))
//           .filter(Boolean) as Receiver[];

//         if (!cancelled) {
//           setItems(normalized);
//         }
//       } catch (e) {
//         if (!cancelled) {
//           setError(
//             e instanceof Error ? e.message : "Failed to load receivers.",
//           );
//           setItems([]);
//         }
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     }

//     loadReceivers();

//     return () => {
//       cancelled = true;
//     };
//   }, [authLoading, firebaseUser, reloadKey]);

//   const filtered = useMemo(() => {
//     const q = search.trim().toLowerCase();
//     return items.filter((item) => {
//       if (statusFilter !== "ALL" && item.status !== statusFilter) return false;
//       if (!q) return true;
//       return [
//         item.receiverId,
//         item.name,
//         item.contactName,
//         item.companyName,
//         item.phone,
//         item.mobile,
//         item.email,
//         item.city,
//         item.state,
//         item.postalCode,
//         item.country,
//         item.gstin,
//       ]
//         .filter(Boolean)
//         .join(" ")
//         .toLowerCase()
//         .includes(q);
//     });
//   }, [items, search, statusFilter]);

//   function openCreate() {
//     setEditing(null);
//     setForm({ ...EMPTY_FORM });
//     setFormOpen(true);
//     setMessage(null);
//     setError(null);
//   }

//   function openEdit(receiver: Receiver) {
//     setEditing(receiver);
//     setForm(toForm(receiver));
//     setFormOpen(true);
//     setMessage(null);
//     setError(null);
//   }

//   function closeForm() {
//     setFormOpen(false);
//     setEditing(null);
//     setForm({ ...EMPTY_FORM });
//   }

//   function updateForm<K extends keyof ReceiverForm>(
//     key: K,
//     value: ReceiverForm[K],
//   ) {
//     setForm((current) => ({
//       ...current,
//       [key]: value,
//     }));
//   }

//   async function uploadReceiverDocument(file: File | null) {
//   if (!file || !firebaseUser) return;
//   const allowed = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
//   if (!allowed.includes(file.type)) {
//     setError("Only JPG, PNG, WebP, or PDF allowed.");
//     return;
//   }
//   if (file.size > 10 * 1024 * 1024) {
//     setError("File must be 10 MB or smaller.");
//     return;
//   }
//   try {
//     setUploadingDoc(true);
//     setError(null);
//     const token = await firebaseUser.getIdToken(true);
//     const fd = new FormData();
//     fd.append("file", file);
//     fd.append("context", "receiver-document");
//     const res = await fetch("/api/uploads", {
//       method: "POST",
//       headers: { Authorization: `Bearer ${token}` },
//       body: fd,
//     });
//     const json = await res.json();
//     if (!res.ok || !json.success) {
//       throw new Error(json?.error?.message || "Upload failed.");
//     }
//     const url = String(
//       json.data?.downloadUrl || json.data?.url || "",
//     ).trim();
//     if (!url) throw new Error("No download URL returned.");
//     updateForm("documentUrl", url);
//   } catch (e) {
//     setError(e instanceof Error ? e.message : "Upload failed.");
//   } finally {
//     setUploadingDoc(false);
//   }
// }

//   async function handleSubmit(event: FormEvent<HTMLFormElement>) {
//     event.preventDefault();

//     try {
//       setSaving(true);
//       setError(null);
//       setMessage(null);

//       if (!firebaseUser) {
//         throw new Error("Authentication is required.");
//       }

//       // Match Consignee / API rules
//       const required: Array<[keyof ReceiverForm, string]> = [
//         ["companyName", "Company name"],
//         ["contactName", "Contact name"],
//         ["mobile", "Mobile number"],
//         ["email", "Email"],
//         ["address", "Address 1"],
//         ["city", "City"],
//         ["state", "State"],
//         ["postalCode", "Pincode"],
//         ["country", "Country"],
//       ];

//       for (const [key, label] of required) {
//         if (!String(form[key] || "").trim()) {
//           throw new Error(`${label} is required.`);
//         }
//       }

//       // Telephone (phone) and Address 2 are optional — no check

//       const token = await firebaseUser.getIdToken(true);

//       const contactName = form.contactName.trim();
//       const payload = {
//         name: contactName,
//         contactName,
//         companyName: form.companyName.trim(),
//         phone: form.phone.trim() || undefined, // optional telephone
//         mobile: form.mobile.trim(),
//         email: form.email.trim(),
//         address: form.address.trim(),
//         addressLine1: form.address.trim(),
//         addressLine2: form.addressLine2.trim() || undefined, // optional
//         city: form.city.trim(),
//         state: form.state.trim(),
//         postalCode: form.postalCode.trim(),
//         country: form.country.trim(),
//         gstin: form.gstin.trim() || undefined,
//         iecNo: form.iecNo.trim() || undefined,
//         documentType: form.documentType.trim() || undefined,
//         documentNo: form.documentNo.trim() || undefined,
//         documentUrl: form.documentUrl.trim() || null, // ← add (null, not undefined)
//         status: form.status,
//         ...(editing ? { receiverId: editing.receiverId } : {}),
//       };

//       const res = await fetch("/api/logistics/receivers", {
//         method: editing ? "PATCH" : "POST",
//         headers: {
//           Accept: "application/json",
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       const json = (await res.json()) as ApiResponse;

//       if (!res.ok || !json.success) {
//         throw new Error(
//           !json.success
//             ? json.error?.message || "Failed to save receiver."
//             : "Failed to save receiver.",
//         );
//       }

//       setMessage(
//         editing
//           ? "Receiver updated successfully."
//           : "Receiver created successfully.",
//       );
//       closeForm();
//       setReloadKey((value) => value + 1);
//     } catch (e) {
//       setError(e instanceof Error ? e.message : "Failed to save receiver.");
//     } finally {
//       setSaving(false);
//     }
//   }

//   async function toggleStatus(receiver: Receiver) {
//     try {
//       setError(null);
//       setMessage(null);

//       if (!firebaseUser) {
//         throw new Error("Authentication is required.");
//       }

//       const token = await firebaseUser.getIdToken(true);
//       const nextStatus: ReceiverStatus =
//         receiver.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

//       const res = await fetch("/api/logistics/receivers", {
//         method: "PATCH",
//         headers: {
//           Accept: "application/json",
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           receiverId: receiver.receiverId,
//           status: nextStatus,
//         }),
//       });

//       const json = (await res.json()) as ApiResponse;

//       if (!res.ok || !json.success) {
//         throw new Error(
//           !json.success
//             ? json.error?.message || "Failed to update status."
//             : "Failed to update status.",
//         );
//       }

//       setMessage(
//         nextStatus === "ACTIVE"
//           ? "Receiver enabled."
//           : "Receiver disabled.",
//       );
//       setReloadKey((value) => value + 1);
//     } catch (e) {
//       setError(e instanceof Error ? e.message : "Failed to update status.");
//     }
//   }

//   const inputClass =
//     "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#087f87] focus:ring-2 focus:ring-cyan-100";

//   return (
//     <div className="mx-auto max-w-6xl">
//       <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h1 className="text-xl font-bold text-[#06284c]">Receivers</h1>
//           <p className="mt-1 text-sm text-slate-500">
//             Master list for Consignee details on AWB booking.
//           </p>
//         </div>
//         <button
//           type="button"
//           onClick={openCreate}
//           disabled={!firebaseUser}
//           className="rounded-lg bg-[#087f87] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60"
//         >
//           + Add Receiver
//         </button>
//       </div>

//       {message && (
//         <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
//           {message}
//         </div>
//       )}
//       {error && (
//         <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//           {error}
//         </div>
//       )}

//       <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
//         <input
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           placeholder="Search name, company, phone, city..."
//           className="w-full max-w-md rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-[#087f87]"
//         />
//         <select
//           value={statusFilter}
//           onChange={(e) =>
//             setStatusFilter(e.target.value as "ALL" | ReceiverStatus)
//           }
//           className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
//         >
//           <option value="ALL">All statuses</option>
//           <option value="ACTIVE">ACTIVE</option>
//           <option value="INACTIVE">INACTIVE</option>
//         </select>
//       </div>

//       <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
//         <div className="overflow-x-auto">
//           <table className="min-w-full text-left text-sm">
//             <thead className="border-b bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
//               <tr>
//                 <th className="px-4 py-3">Company</th>
//                 <th className="px-4 py-3">Contact</th>
//                 <th className="px-4 py-3">Mobile</th>
//                 <th className="px-4 py-3">City</th>
//                 <th className="px-4 py-3">Country</th>
//                 <th className="px-4 py-3">Status</th>
//                 <th className="px-4 py-3">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-100">
//               {loading || authLoading ? (
//                 <tr>
//                   <td
//                     colSpan={7}
//                     className="px-4 py-10 text-center text-slate-400"
//                   >
//                     Loading receivers…
//                   </td>
//                 </tr>
//               ) : filtered.length === 0 ? (
//                 <tr>
//                   <td
//                     colSpan={7}
//                     className="px-4 py-10 text-center text-slate-400"
//                   >
//                     No receivers found. Add one to use in Consignee Details.
//                   </td>
//                 </tr>
//               ) : (
//                 filtered.map((row) => (
//                   <tr key={row.id} className="hover:bg-slate-50/80">
//                     <td className="px-4 py-3 font-medium text-slate-800">
//                       {row.companyName || "—"}
//                     </td>
//                     <td className="px-4 py-3 text-slate-700">
//                       {row.contactName || row.name}
//                     </td>
//                     <td className="px-4 py-3 text-slate-600">
//                       {row.mobile
//                         ? formatPhone(row.mobile)
//                         : row.phone
//                           ? formatPhone(row.phone)
//                           : "—"}
//                     </td>
//                     <td className="px-4 py-3 text-slate-600">
//                       {row.city || "—"}
//                     </td>
//                     <td className="px-4 py-3 text-slate-600">
//                       {row.country || "—"}
//                     </td>
//                     <td className="px-4 py-3">
//                       <span
//                         className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
//                           row.status === "ACTIVE"
//                             ? "bg-emerald-100 text-emerald-700"
//                             : "bg-slate-100 text-slate-500"
//                         }`}
//                       >
//                         {row.status}
//                       </span>
//                     </td>
//                     <td className="px-4 py-3">
//                       <div className="flex flex-wrap gap-2">
//                         <button
//                           type="button"
//                           onClick={() => openEdit(row)}
//                           className="text-xs font-bold text-[#087f87]"
//                         >
//                           Edit
//                         </button>
//                         <button
//                           type="button"
//                           onClick={() => toggleStatus(row)}
//                           className="text-xs font-bold text-slate-600"
//                         >
//                           {row.status === "ACTIVE" ? "Disable" : "Enable"}
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* {formOpen && (
//         <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 sm:items-center">
//           <div className="w-full max-w-2xl rounded-xl border border-slate-200 bg-white shadow-xl">
//             <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
//               <div>
//                 <h2 className="text-lg font-bold text-[#06284c]">
//                   {editing ? "Edit receiver" : "Add receiver"}
//                 </h2>
//                 <p className="mt-1 text-sm text-slate-500">
//                   Fields match Consignee Details on AWB booking.
//                 </p>
//               </div>
//               <button
//                 type="button"
//                 onClick={closeForm}
//                 className="text-sm font-semibold text-slate-500 hover:text-slate-800"
//               >
//                 Close
//               </button>
//             </div>

//             <form
//               onSubmit={handleSubmit}
//               className="grid gap-4 p-5 sm:grid-cols-2"
//             >
//               <div>
//                 <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                   Company Name <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   value={form.companyName}
//                   onChange={(e) => updateForm("companyName", e.target.value)}
//                   className={inputClass}
//                   placeholder="Company name"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                   Contact Name <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   value={form.contactName}
//                   onChange={(e) => updateForm("contactName", e.target.value)}
//                   className={inputClass}
//                   placeholder="Contact / consignee name"
//                   required
//                 />
//               </div>

//               <div className="sm:col-span-2">
//                 <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                   Address 1 <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   value={form.address}
//                   onChange={(e) => updateForm("address", e.target.value)}
//                   className={inputClass}
//                   placeholder="Street address"
//                   required
//                 />
//               </div>

//               <div className="sm:col-span-2">
//                 <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                   Address 2{" "}
//                   <span className="font-normal text-slate-400">(optional)</span>
//                 </label>
//                 <input
//                   value={form.addressLine2}
//                   onChange={(e) => updateForm("addressLine2", e.target.value)}
//                   className={inputClass}
//                   placeholder="Apartment, suite, etc."
//                 />
//               </div>

//               <div>
//                 <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                   City <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   value={form.city}
//                   onChange={(e) => updateForm("city", e.target.value)}
//                   className={inputClass}
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                   Pincode <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   value={form.postalCode}
//                   onChange={(e) => updateForm("postalCode", e.target.value)}
//                   className={inputClass}
//                   placeholder="6-digit PIN"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                   State <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   value={form.state}
//                   onChange={(e) => updateForm("state", e.target.value)}
//                   className={inputClass}
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                   Telephone{" "}
//                   <span className="font-normal text-slate-400">(optional)</span>
//                 </label>
//                 <input
//                   value={form.phone}
//                   onChange={(e) => updateForm("phone", e.target.value)}
//                   className={inputClass}
//                   placeholder="Landline / alternate"
//                 />
//               </div>

//               <div>
//                 <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                   Mobile No. <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   value={form.mobile}
//                   onChange={(e) => updateForm("mobile", e.target.value)}
//                   className={inputClass}
//                   placeholder="10-digit mobile"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                   E-Mail <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="email"
//                   value={form.email}
//                   onChange={(e) => updateForm("email", e.target.value)}
//                   className={inputClass}
//                   placeholder="email@example.com"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                   Country <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   value={form.country}
//                   onChange={(e) => updateForm("country", e.target.value)}
//                   className={inputClass}
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                   IEC No.
//                 </label>
//                 <input
//                   value={form.iecNo}
//                   onChange={(e) => updateForm("iecNo", e.target.value)}
//                   className={inputClass}
//                 />
//               </div>

//               <div>
//                 <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                   GSTIN
//                 </label>
//                 <input
//                   value={form.gstin}
//                   onChange={(e) => updateForm("gstin", e.target.value)}
//                   className={inputClass}
//                   placeholder="GSTIN (optional)"
//                 />
//               </div>

//               <div>
//                 <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                   Document Type
//                 </label>
//                 <select
//                   value={form.documentType}
//                   onChange={(e) => updateForm("documentType", e.target.value)}
//                   className={inputClass}
//                 >
//                   {DOCUMENT_TYPES.map((t) => (
//                     <option key={t.value || "select"} value={t.value}>
//                       {t.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                   Document No.
//                 </label>
//                 <input
//                   value={form.documentNo}
//                   onChange={(e) => updateForm("documentNo", e.target.value)}
//                   className={inputClass}
//                 />
//               </div>

//               <div>
//                 <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                   Status
//                 </label>
//                 <select
//                   value={form.status}
//                   onChange={(e) =>
//                     updateForm("status", e.target.value as ReceiverStatus)
//                   }
//                   className={inputClass}
//                 >
//                   <option value="ACTIVE">ACTIVE</option>
//                   <option value="INACTIVE">INACTIVE</option>
//                 </select>
//               </div>

//               <div className="sm:col-span-2 mt-2 flex justify-end gap-2">
//                 <button
//                   type="button"
//                   onClick={closeForm}
//                   className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700"
//                   disabled={saving}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={saving || !firebaseUser}
//                   className="rounded-lg bg-[#087f87] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60"
//                 >
//                   {saving
//                     ? "Saving..."
//                     : editing
//                       ? "Update Receiver"
//                       : "Create Receiver"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )} */}
//             {formOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
//           <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
//             {/* Sticky header */}
//             <div className="flex shrink-0 items-start justify-between  border-slate-200 px-5 py-4">
//               <div>
//                 <h2 className="text-lg font-bold text-[#06284c]">
//                   {editing ? "Edit receiver" : "Add receiver"}
//                 </h2>
//                 <p className="mt-1 text-sm text-slate-500">
//                   {/* Fields match Consignee Details on AWB booking. */}
//                   All fields marked * are mandatory.
//                 </p>
//               </div>
//               <button
//                 type="button"
//                 onClick={closeForm}
//                 className="text-sm font-semibold text-slate-500 hover:text-slate-800"
//               >
//                 Close
//               </button>
//             </div>

//             {/* Scrollable form body */}
//             <form
//               id="receiver-form"
//               onSubmit={handleSubmit}
//               className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
//             >
//               <div className="grid gap-4 p-5 sm:grid-cols-2">
//                 <div>
//                   <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                     Company Name 
//                   </label>
//                   <input
//                     value={form.companyName}
//                     onChange={(e) => updateForm("companyName", e.target.value)}
//                     className={inputClass}
//                     placeholder=""
//                   />
//                 </div>

//                 <div>
//                   <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                     Name <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     value={form.contactName}
//                     onChange={(e) => updateForm("contactName", e.target.value)}
//                     className={inputClass}
//                     placeholder=""
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                     Telephone
//                     <span className="font-normal text-slate-400">(optional)</span>
//                   </label>
//                   <input
//                     value={form.phone}
//                     onChange={(e) => updateForm("phone", e.target.value)}
//                     className={inputClass}
//                     placeholder=""
//                   />
//                 </div>

//                 <div>
//                   <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                     Mobile No. <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     value={form.mobile}
//                     onChange={(e) => updateForm("mobile", e.target.value)}
//                     className={inputClass}
//                     placeholder=""
//                     required
//                   />
//                 </div>

//                 <div  className="sm:col-span-2">
//                   <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                     E-Mail 
//                   </label>
//                   <input
//                     type="email"
//                     value={form.email}
//                     onChange={(e) => updateForm("email", e.target.value)}
//                     className={inputClass}
//                     placeholder=""
//                   />
//                 </div>

//                 <div className="sm:col-span-2">
//                   <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                     Address 1 <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     value={form.address}
//                     onChange={(e) => updateForm("address", e.target.value)}
//                     className={inputClass}
//                     placeholder=""
//                     required
//                   />
//                 </div>

//                 <div className="sm:col-span-2">
//                   <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                     Address 2{" "}
//                     <span className="font-normal text-slate-400">(optional)</span>
//                   </label>
//                   <input
//                     value={form.addressLine2}
//                     onChange={(e) => updateForm("addressLine2", e.target.value)}
//                     className={inputClass}
//                     placeholder=""
//                   />
//                 </div>

//                 <div>
//                   <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                     State <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     value={form.state}
//                     onChange={(e) => updateForm("state", e.target.value)}
//                     className={inputClass}
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                     City <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     value={form.city}
//                     onChange={(e) => updateForm("city", e.target.value)}
//                     className={inputClass}
//                     required
//                   />
//                 </div>

                

//                 <div>
//                   <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                     Pincode <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     value={form.postalCode}
//                     onChange={(e) => updateForm("postalCode", e.target.value)}
//                     className={inputClass}
//                     placeholder=""
//                     required
//                   />
//                 </div>

                

                

                

                

//                 <div>
//                   <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                     Country <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     value={form.country}
//                     onChange={(e) => updateForm("country", e.target.value)}
//                     className={inputClass}
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                     IEC No.
//                   </label>
//                   <input
//                     value={form.iecNo}
//                     onChange={(e) => updateForm("iecNo", e.target.value)}
//                     className={inputClass}
//                   />
//                 </div>

//                 <div>
//                   <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                     GSTIN
//                   </label>
//                   <input
//                     value={form.gstin}
//                     onChange={(e) => updateForm("gstin", e.target.value)}
//                     className={inputClass}
//                     placeholder=""
//                   />
//                 </div>

//                 <div>
//                   <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                     Document Type<span className="text-red-500"> *</span>
//                   </label>
//                   <select
//                     value={form.documentType}
//                     onChange={(e) => updateForm("documentType", e.target.value)}
//                     className={inputClass}
//                     required
//                   >
//                     {DOCUMENT_TYPES.map((t) => (
//                       <option key={t.value || "select"} value={t.value}>
//                         {t.label}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                     Document No.<span className="text-red-500"> *</span>
//                   </label>
//                   <input
//                     value={form.documentNo}
//                     onChange={(e) => updateForm("documentNo", e.target.value)}
//                     className={inputClass}
//                     required
//                   />
//                 </div>

//                 <div className="sm:col-span-2">
//                   <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                     Document file (image / PDF)
//                   </label>
//                   <label
//                     className={[
//                       "mt-1 flex h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50",
//                       saving || uploadingDoc || !firebaseUser
//                         ? "pointer-events-none opacity-60"
//                         : "",
//                     ].join(" ")}
//                   >
//                     {uploadingDoc ? "Uploading…" : "Upload image or PDF"}
//                     <input
//                       type="file"
//                       accept="image/jpeg,image/png,image/webp,application/pdf"
//                       className="hidden"
//                       disabled={saving || uploadingDoc || !firebaseUser}
//                       onChange={(e) =>
//                         uploadReceiverDocument(e.target.files?.[0] ?? null)
//                       }
//                     />
//                   </label>
//                   {form.documentUrl ? (
//                     <a
//                       href={form.documentUrl}
//                       target="_blank"
//                       rel="noreferrer"
//                       className="mt-2 inline-block text-xs font-semibold text-[#087f87] hover:underline"
//                     >
//                       View uploaded document
//                     </a>
//                   ) : null}
//                 </div>

//                 <div>
//                   <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                     Status<span className="text-red-500"> *</span>
//                   </label>
//                   <select
//                     value={form.status}
//                     onChange={(e) =>
//                       updateForm("status", e.target.value as ReceiverStatus)
//                     }
//                     className={inputClass}
//                   >
//                     <option value="ACTIVE">ACTIVE</option>
//                     <option value="INACTIVE">INACTIVE</option>
//                   </select>
//                 </div>
//               </div>
//             </form>

//             {/* Sticky footer actions */}
//             <div className="flex shrink-0 justify-end gap-2 border-t border-slate-200 bg-white px-5 py-4">
//               <button
//                 type="button"
//                 onClick={closeForm}
//                 className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700"
//                 disabled={saving}
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 form="receiver-form"
//                 disabled={saving || !firebaseUser}
//                 className="rounded-lg bg-[#087f87] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60"
//               >
//                 {saving
//                   ? "Saving..."
//                   : editing
//                     ? "Update Receiver"
//                     : "Create Receiver"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { formatPhone } from "@/utils/formatters";

type ReceiverStatus = "ACTIVE" | "INACTIVE";

type Receiver = {
  id: string;
  receiverId: string;
  name: string;
  contactName?: string;
  companyName?: string;
  phone?: string;
  mobile?: string;
  email?: string;
  address?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  gstin?: string;
  iecNo?: string;
  documentType?: string;
  documentNo?: string;
  documentUrl?: string;
  status: ReceiverStatus;
  createdAt?: string;
  updatedAt?: string;
};

type ReceiverForm = {
  companyName: string;
  contactName: string;
  phone: string;
  mobile: string;
  email: string;
  address: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  gstin: string;
  iecNo: string;
  documentType: string;
  documentNo: string;
  documentUrl: string;
  status: ReceiverStatus;
};

type ApiResponse =
  | {
      success: true;
      data:
        | Receiver
        | Receiver[]
        | {
            items?: Receiver[];
            receivers?: Receiver[];
            results?: Receiver[];
          };
      message?: string;
    }
  | {
      success: false;
      error: {
        code: string;
        message: string;
      };
    };

const EMPTY_FORM: ReceiverForm = {
  companyName: "",
  contactName: "",
  phone: "",
  mobile: "",
  email: "",
  address: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
  gstin: "",
  iecNo: "",
  documentType: "",
  documentNo: "",
  documentUrl: "",
  status: "ACTIVE",
};

const DOCUMENT_TYPES = [
  { value: "", label: "Select document type" },
  { value: "AADHAAR", label: "Aadhaar Number" },
  { value: "GSTIN (Normal)", label: "GSTIN (Normal)" },
  { value: "PAN", label: "PAN Number" },
  { value: "PASSPORT", label: "Passport Number" },
  { value: "TAN", label: "TAN Number" },
  { value: "VOTER_ID", label: "Voter Id" },
];

function extractList(data: unknown): Record<string, unknown>[] {
  if (Array.isArray(data)) return data as Record<string, unknown>[];
  if (!data || typeof data !== "object") return [];
  const obj = data as Record<string, unknown>;
  for (const key of ["receivers", "items", "results", "data"]) {
    if (Array.isArray(obj[key])) return obj[key] as Record<string, unknown>[];
  }
  return [];
}

function normalizeReceiver(raw: Record<string, unknown>): Receiver | null {
  const companyName = String(raw.companyName || "").trim();
  const contactName = String(raw.contactName || raw.name || "").trim();
  if (!companyName && !contactName) return null;

  const receiverId = String(raw.receiverId || raw.id || "").trim();
  if (!receiverId) return null;

  const statusRaw = String(raw.status || "ACTIVE").toUpperCase();
  const addressLine1 = String(
    raw.addressLine1 ||
      (typeof raw.address === "string" ? raw.address : "") ||
      "",
  ).trim();

  return {
    id: String(raw.id || receiverId),
    receiverId,
    name: contactName || companyName,
    contactName: contactName || companyName,
    companyName: companyName || undefined,
    phone: String(raw.phone || "").trim() || undefined,
    mobile: String(raw.mobile || "").trim() || undefined,
    email: String(raw.email || "").trim() || undefined,
    address: addressLine1 || undefined,
    addressLine1: addressLine1 || undefined,
    addressLine2: String(raw.addressLine2 || "").trim() || undefined,
    city: String(raw.city || "").trim() || undefined,
    state: String(raw.state || "").trim() || undefined,
    postalCode: String(raw.postalCode || "").trim() || undefined,
    country: String(raw.country || "").trim() || undefined,
    gstin: String(raw.gstin || "").trim() || undefined,
    iecNo: String(raw.iecNo || "").trim() || undefined,
    documentType: String(raw.documentType || "").trim() || undefined,
    documentNo: String(raw.documentNo || "").trim() || undefined,
    documentUrl: String(raw.documentUrl || "").trim() || undefined,
    status: statusRaw === "INACTIVE" ? "INACTIVE" : "ACTIVE",
    createdAt: raw.createdAt ? String(raw.createdAt) : undefined,
    updatedAt: raw.updatedAt ? String(raw.updatedAt) : undefined,
  };
}

function toForm(receiver?: Receiver | null): ReceiverForm {
  if (!receiver) return { ...EMPTY_FORM };
  return {
    companyName: receiver.companyName || "",
    contactName: receiver.contactName || receiver.name || "",
    phone: receiver.phone || "",
    mobile: receiver.mobile || "",
    email: receiver.email || "",
    address: receiver.addressLine1 || receiver.address || "",
    addressLine2: receiver.addressLine2 || "",
    city: receiver.city || "",
    state: receiver.state || "",
    postalCode: receiver.postalCode || "",
    country: receiver.country || "",
    gstin: receiver.gstin || "",
    iecNo: receiver.iecNo || "",
    documentType: receiver.documentType || "",
    documentNo: receiver.documentNo || "",
    documentUrl: receiver.documentUrl || "",
    status: receiver.status || "ACTIVE",
  };
}

export default function ReceiversPage() {
  const { firebaseUser, user, loading: authLoading } = useAuth();

  const [items, setItems] = useState<Receiver[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | ReceiverStatus>(
    "ALL",
  );
  const [reloadKey, setReloadKey] = useState(0);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Receiver | null>(null);
  const [form, setForm] = useState<ReceiverForm>(EMPTY_FORM);
  const [uploadingDoc, setUploadingDoc] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    let cancelled = false;

    async function loadReceivers() {
      try {
        setLoading(true);
        setError(null);

        if (!firebaseUser) {
          throw new Error("Authentication is required to manage receivers.");
        }

        const token = await firebaseUser.getIdToken(true);
        const res = await fetch("/api/logistics/receivers", {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        const json = (await res.json()) as ApiResponse;

        if (!res.ok || !json.success) {
          throw new Error(
            !json.success
              ? json.error?.message || "Failed to load receivers."
              : "Failed to load receivers.",
          );
        }

        const list = extractList(json.data);
        const normalized = list
          .map((item) => normalizeReceiver(item))
          .filter(Boolean) as Receiver[];

        if (!cancelled) setItems(normalized);
      } catch (e) {
        if (!cancelled) {
          setError(
            e instanceof Error ? e.message : "Failed to load receivers.",
          );
          setItems([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadReceivers();

    return () => {
      cancelled = true;
    };
  }, [authLoading, firebaseUser, reloadKey]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((item) => {
      if (statusFilter !== "ALL" && item.status !== statusFilter) return false;
      if (!q) return true;
      return [
        item.receiverId,
        item.name,
        item.contactName,
        item.companyName,
        item.phone,
        item.mobile,
        item.email,
        item.city,
        item.state,
        item.postalCode,
        item.country,
        item.gstin,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [items, search, statusFilter]);

  function openCreate() {
    setEditing(null);
    setForm({ ...EMPTY_FORM });
    setFormOpen(true);
    setMessage(null);
    setError(null);
  }

  function openEdit(receiver: Receiver) {
    setEditing(receiver);
    setForm(toForm(receiver));
    setFormOpen(true);
    setMessage(null);
    setError(null);
  }

  function closeForm() {
    setFormOpen(false);
    setEditing(null);
    setForm({ ...EMPTY_FORM });
  }

  function updateForm<K extends keyof ReceiverForm>(
    key: K,
    value: ReceiverForm[K],
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function uploadReceiverDocument(file: File | null) {
    if (!file || !firebaseUser) return;

    const allowed = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];
    if (!allowed.includes(file.type)) {
      setError("Only JPG, PNG, WebP, or PDF allowed.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("File must be 10 MB or smaller.");
      return;
    }

    try {
      setUploadingDoc(true);
      setError(null);
      const token = await firebaseUser.getIdToken(true);
      const fd = new FormData();
      fd.append("file", file);
      fd.append("context", "receiver-document");

      const res = await fetch("/api/uploads", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json?.error?.message || "Upload failed.");
      }

      const url = String(
        json.data?.downloadUrl || json.data?.url || "",
      ).trim();
      if (!url) throw new Error("No download URL returned.");
      updateForm("documentUrl", url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploadingDoc(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSaving(true);
      setError(null);
      setMessage(null);

      if (!firebaseUser) {
        throw new Error("Authentication is required.");
      }

      // Optional: companyName, phone, email, addressLine2, gstin, iecNo
      const required: Array<[keyof ReceiverForm, string]> = [
        ["contactName", "Name"],
        ["mobile", "Mobile number"],
        ["address", "Address 1"],
        ["city", "City"],
        ["state", "State"],
        ["postalCode", "Pincode"],
        ["country", "Country"],
        // ["documentType", "Document type"],
        // ["documentNo", "Document number"],
      ];

      for (const [key, label] of required) {
        if (!String(form[key] || "").trim()) {
          throw new Error(`${label} is required.`);
        }
      }

      const token = await firebaseUser.getIdToken(true);
      const contactName = form.contactName.trim();

      const payload = {
        name: contactName,
        contactName,
        companyName: form.companyName.trim() || undefined,
        phone: form.phone.trim() || undefined,
        mobile: form.mobile.trim(),
        ...(form.email.trim() ? { email: form.email.trim() } : {}),
        address: form.address.trim(),
        addressLine1: form.address.trim(),
        addressLine2: form.addressLine2.trim() || undefined,
        city: form.city.trim(),
        state: form.state.trim(),
        postalCode: form.postalCode.trim(),
        country: form.country.trim(),
        gstin: form.gstin.trim() || undefined,
        iecNo: form.iecNo.trim() || undefined,
        documentType: form.documentType.trim(),
        documentNo: form.documentNo.trim(),
        documentUrl: form.documentUrl.trim() || null,
        status: form.status,
        ...(editing ? { receiverId: editing.receiverId } : {}),
      };

      const res = await fetch("/api/logistics/receivers", {
        method: editing ? "PATCH" : "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const json = (await res.json()) as ApiResponse;

      if (!res.ok || !json.success) {
        throw new Error(
          !json.success
            ? json.error?.message || "Failed to save receiver."
            : "Failed to save receiver.",
        );
      }

      setMessage(
        editing
          ? "Receiver updated successfully."
          : "Receiver created successfully.",
      );
      closeForm();
      setReloadKey((value) => value + 1);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save receiver.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleStatus(receiver: Receiver) {
    try {
      setError(null);
      setMessage(null);

      if (!firebaseUser) {
        throw new Error("Authentication is required.");
      }

      const token = await firebaseUser.getIdToken(true);
      const nextStatus: ReceiverStatus =
        receiver.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

      const res = await fetch("/api/logistics/receivers", {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiverId: receiver.receiverId,
          status: nextStatus,
        }),
      });

      const json = (await res.json()) as ApiResponse;

      if (!res.ok || !json.success) {
        throw new Error(
          !json.success
            ? json.error?.message || "Failed to update status."
            : "Failed to update status.",
        );
      }

      setMessage(
        `Receiver marked as ${
          nextStatus === "ACTIVE" ? "active" : "inactive"
        }.`,
      );
      setReloadKey((value) => value + 1);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update status.");
    }
  }

  const inputClass =
    "h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-[#087f87] focus:ring-2 focus:ring-cyan-100";
  const labelClass = "mb-1.5 block text-sm font-medium text-slate-700";

  return (
    <div className="mx-auto max-w-[1400px]">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#087f87]">
            Masters
          </p>
          <h2 className="mt-1 text-2xl font-bold text-[#06284c]">Receivers</h2>
          <p className="mt-1 text-sm text-slate-500">
            Manage consignee / receiver records for AWB booking.
          </p>
          {user?.role ? (
            <p className="mt-1 text-xs text-slate-400">
              Signed in as role: <strong>{user.role}</strong>
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setReloadKey((v) => v + 1)}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700"
          >
            Refresh
          </button>
          <button
            type="button"
            onClick={openCreate}
            disabled={!firebaseUser}
            className="rounded-lg bg-[#087f87] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60"
          >
            + Add Receiver
          </button>
        </div>
      </div>

      <div className="mb-5 grid gap-3 md:grid-cols-[1fr_180px]">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by company, contact, phone, city..."
          className={inputClass}
        />
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as "ALL" | ReceiverStatus)
          }
          className={inputClass}
        >
          <option value="ALL">All statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>

      {message && (
        <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {message}
        </div>
      )}
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading || authLoading ? (
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
          <h3 className="text-lg font-bold text-[#06284c]">
            Loading receivers...
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            Fetching receiver records from the server.
          </p>
        </div>
      ) : !firebaseUser ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-10 text-center text-sm text-red-700">
          Authentication is required to manage receivers.
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
          <h3 className="text-lg font-bold text-[#06284c]">
            No receivers found
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            {items.length === 0
              ? "Create the first receiver for AWB booking."
              : "No receivers match your search."}
          </p>
          {items.length === 0 && (
            <button
              type="button"
              onClick={openCreate}
              className="mt-5 rounded-lg bg-[#087f87] px-4 py-2.5 text-sm font-bold text-white"
            >
              + Add Receiver
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Company / Contact</th>
                  <th className="px-4 py-3 font-semibold">Phone</th>
                  <th className="px-4 py-3 font-semibold">Location</th>
                  <th className="px-4 py-3 font-semibold">Country</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr
                    key={row.receiverId}
                    className="border-t border-slate-100"
                  >
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900">
                        {row.companyName || "—"}
                      </div>
                      <div className="mt-0.5 text-xs text-slate-500">
                        {row.contactName || row.name}
                        {row.email ? ` · ${row.email}` : ""}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {row.mobile
                        ? formatPhone(row.mobile)
                        : row.phone
                          ? formatPhone(row.phone)
                          : "—"}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {[row.city, row.state].filter(Boolean).join(", ") || "—"}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {row.country || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                          row.status === "ACTIVE"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(row)}
                          className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleStatus(row)}
                          className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          {row.status === "ACTIVE" ? "Deactivate" : "Activate"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-slate-100 px-4 py-3 text-xs text-slate-500">
            Showing {filtered.length} of {items.length} receivers
          </div>
        </div>
      )}

      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-[#06284c]">
                  {editing ? "Edit receiver" : "Add receiver"}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  All fields marked * are mandatory.
                </p>
              </div>
              <button
                type="button"
                onClick={closeForm}
                className="rounded-md px-2 py-1 text-sm font-semibold text-slate-500 hover:bg-slate-100"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Company Name</label>
                <input
                  value={form.companyName}
                  onChange={(e) => updateForm("companyName", e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.contactName}
                  onChange={(e) => updateForm("contactName", e.target.value)}
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className={labelClass}>
                  Telephone{" "}
                  <span className="font-normal text-slate-400">
                    (optional)
                  </span>
                </label>
                <input
                  value={form.phone}
                  onChange={(e) => updateForm("phone", e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Mobile <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.mobile}
                  onChange={(e) => updateForm("mobile", e.target.value)}
                  className={inputClass}
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass}>Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => updateForm("email", e.target.value)}
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass}>
                  Address 1 <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.address}
                  onChange={(e) => updateForm("address", e.target.value)}
                  className={inputClass}
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass}>
                  Address 2{" "}
                  <span className="font-normal text-slate-400">
                    (optional)
                  </span>
                </label>
                <input
                  value={form.addressLine2}
                  onChange={(e) => updateForm("addressLine2", e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.city}
                  onChange={(e) => updateForm("city", e.target.value)}
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className={labelClass}>
                  State <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.state}
                  onChange={(e) => updateForm("state", e.target.value)}
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className={labelClass}>
                  Pincode <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.postalCode}
                  onChange={(e) => updateForm("postalCode", e.target.value)}
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className={labelClass}>
                  Country <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.country}
                  onChange={(e) => updateForm("country", e.target.value)}
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className={labelClass}>GSTIN</label>
                <input
                  value={form.gstin}
                  onChange={(e) =>
                    updateForm("gstin", e.target.value.toUpperCase())
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>IEC No.</label>
                <input
                  value={form.iecNo}
                  onChange={(e) => updateForm("iecNo", e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Document Type
                </label>
                <select
                  value={form.documentType}
                  onChange={(e) => updateForm("documentType", e.target.value)}
                  className={inputClass}
                >
                  {DOCUMENT_TYPES.map((t) => (
                    <option key={t.value || "empty"} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>
                  Document No. 
                </label>
                <input
                  value={form.documentNo}
                  onChange={(e) => updateForm("documentNo", e.target.value)}
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass}>Document file (image / PDF)</label>
                <label
                  className={[
                    "mt-1 flex h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50",
                    saving || uploadingDoc || !firebaseUser
                      ? "pointer-events-none opacity-60"
                      : "",
                  ].join(" ")}
                >
                  {uploadingDoc ? "Uploading…" : "Upload image or PDF"}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,application/pdf"
                    className="hidden"
                    disabled={saving || uploadingDoc || !firebaseUser}
                    onChange={(e) =>
                      uploadReceiverDocument(e.target.files?.[0] ?? null)
                    }
                  />
                </label>
                {form.documentUrl ? (
                  <a
                    href={form.documentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-block text-xs font-semibold text-[#087f87] hover:underline"
                  >
                    View uploaded document
                  </a>
                ) : null}
              </div>

              <div>
                <label className={labelClass}>
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    updateForm("status", e.target.value as ReceiverStatus)
                  }
                  className={inputClass}
                  required
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>

              <div className="sm:col-span-2 mt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || !firebaseUser}
                  className="rounded-lg bg-[#087f87] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editing
                      ? "Update Receiver"
                      : "Create Receiver"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}