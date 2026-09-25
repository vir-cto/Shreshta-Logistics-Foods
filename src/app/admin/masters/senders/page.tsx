// "use client";

// import { FormEvent, useEffect, useMemo, useState } from "react";
// import { useAuth } from "@/context/AuthContext";
// import { formatPhone } from "@/utils/formatters";

// type SenderStatus = "ACTIVE" | "INACTIVE";

// type Sender = {
//   id: string;
//   senderId: string;
//   name: string;
//   companyName?: string;
//   phone: string;
//   email?: string;
//   address?: string;
//   city?: string;
//   state?: string;
//   postalCode?: string;
//   gstin?: string;
//   status: SenderStatus;
//   createdAt?: string;
//   updatedAt?: string;
// };

// type SenderForm = {
//   name: string;
//   companyName: string;
//   phone: string;
//   email: string;
//   address: string;
//   city: string;
//   state: string;
//   postalCode: string;
//   gstin: string;
//   status: SenderStatus;
// };

// type ApiResponse =
//   | {
//       success: true;
//       data: Sender[] | Sender;
//       message?: string;
//     }
//   | {
//       success: false;
//       error: {
//         code: string;
//         message: string;
//       };
//     };

// const EMPTY_FORM: SenderForm = {
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

// function normalizeSender(raw: Record<string, unknown>): Sender | null {
//   const name = String(raw.name || "").trim();
//   if (!name) return null;

//   const senderId = String(raw.senderId || raw.id || "").trim();
//   if (!senderId) return null;

//   const statusRaw = String(raw.status || "ACTIVE").toUpperCase();

//   return {
//     id: String(raw.id || senderId),
//     senderId,
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

// function toForm(sender?: Sender | null): SenderForm {
//   if (!sender) return { ...EMPTY_FORM };

//   return {
//     name: sender.name || "",
//     companyName: sender.companyName || "",
//     phone: sender.phone || "",
//     email: sender.email || "",
//     address: sender.address || "",
//     city: sender.city || "",
//     state: sender.state || "",
//     postalCode: sender.postalCode || "",
//     gstin: sender.gstin || "",
//     status: sender.status || "ACTIVE",
//   };
// }

// export default function SendersPage() {
//   const { user, loading: authLoading } = useAuth();

//   const [items, setItems] = useState<Sender[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [message, setMessage] = useState<string | null>(null);
//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState<"ALL" | SenderStatus>(
//     "ALL",
//   );
//   const [reloadKey, setReloadKey] = useState(0);

//   const [formOpen, setFormOpen] = useState(false);
//   const [editing, setEditing] = useState<Sender | null>(null);
//   const [form, setForm] = useState<SenderForm>(EMPTY_FORM);

//   useEffect(() => {
//     if (authLoading) return;

//     let cancelled = false;

//     async function loadSenders() {
//       try {
//         setLoading(true);
//         setError(null);

//         if (!user) {
//           throw new Error("Authentication is required to manage senders.");
//         }

//         const token = await user.getIdToken();

//         const res = await fetch("/api/logistics/senders", {
//           method: "GET",
//           headers: {
//             Accept: "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           cache: "no-store",
//         });

//         const json = (await res.json()) as ApiResponse;

//         if (!json.success) {
//           throw new Error(json.error?.message || "Failed to load senders.");
//         }

//         const payload = json.data;
//         const list = Array.isArray(payload) ? payload : [];

//         const normalized = list
//           .map((item) =>
//             normalizeSender(item as unknown as Record<string, unknown>),
//           )
//           .filter(Boolean) as Sender[];

//         if (!cancelled) {
//           setItems(normalized);
//         }
//       } catch (e) {
//         if (!cancelled) {
//           setError(
//             e instanceof Error ? e.message : "Failed to load senders.",
//           );
//           setItems([]);
//         }
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     }

//     loadSenders();

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
//         item.senderId,
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

//   function openEdit(sender: Sender) {
//     setEditing(sender);
//     setForm(toForm(sender));
//     setFormOpen(true);
//     setMessage(null);
//     setError(null);
//   }

//   function closeForm() {
//     setFormOpen(false);
//     setEditing(null);
//     setForm({ ...EMPTY_FORM });
//   }

//   function updateForm<K extends keyof SenderForm>(
//     key: K,
//     value: SenderForm[K],
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
//         throw new Error("Sender name is required.");
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
//         ...(editing ? { senderId: editing.senderId } : {}),
//       };

//       const res = await fetch("/api/logistics/senders", {
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
//         throw new Error(json.error?.message || "Failed to save sender.");
//       }

//       setMessage(
//         editing
//           ? "Sender updated successfully."
//           : "Sender created successfully.",
//       );
//       closeForm();
//       setReloadKey((value) => value + 1);
//     } catch (e) {
//       setError(e instanceof Error ? e.message : "Failed to save sender.");
//     } finally {
//       setSaving(false);
//     }
//   }

//   async function toggleStatus(sender: Sender) {
//     try {
//       setError(null);
//       setMessage(null);

//       if (!user) {
//         throw new Error("Authentication is required.");
//       }

//       const token = await user.getIdToken();
//       const nextStatus: SenderStatus =
//         sender.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

//       const res = await fetch("/api/logistics/senders", {
//         method: "PATCH",
//         headers: {
//           Accept: "application/json",
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           senderId: sender.senderId,
//           status: nextStatus,
//         }),
//       });

//       const json = (await res.json()) as ApiResponse;

//       if (!json.success) {
//         throw new Error(json.error?.message || "Failed to update status.");
//       }

//       setMessage(
//         `Sender marked as ${nextStatus === "ACTIVE" ? "active" : "inactive"}.`,
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
//           <h2 className="mt-1 text-2xl font-bold text-[#06284c]">Senders</h2>
//           <p className="mt-1 text-sm text-slate-500">
//             Manage shipment sender and shipper records.
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
//             + Add Sender
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
//             setStatusFilter(event.target.value as "ALL" | SenderStatus)
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
//             Loading senders...
//           </h3>
//           <p className="mt-2 text-sm text-slate-500">
//             Fetching sender records from the server.
//           </p>
//         </div>
//       ) : filtered.length === 0 ? (
//         <div className="rounded-xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
//           <h3 className="text-lg font-bold text-[#06284c]">
//             No senders found
//           </h3>
//           <p className="mt-2 text-sm text-slate-500">
//             {items.length === 0
//               ? "Create the first sender/shipper for AWB booking."
//               : "No senders match your current search or filter."}
//           </p>
//           {items.length === 0 && (
//             <button
//               type="button"
//               onClick={openCreate}
//               className="mt-5 rounded-lg bg-[#087f87] px-4 py-2.5 text-sm font-bold text-white"
//             >
//               + Add Sender
//             </button>
//           )}
//         </div>
//       ) : (
//         <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
//           <div className="overflow-x-auto">
//             <table className="min-w-full text-left text-sm">
//               <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
//                 <tr>
//                   <th className="px-4 py-3 font-semibold">Sender</th>
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
//                 {filtered.map((sender) => (
//                   <tr
//                     key={sender.senderId}
//                     className="border-t border-slate-100"
//                   >
//                     <td className="px-4 py-3">
//                       <div className="font-semibold text-slate-900">
//                         {sender.name}
//                       </div>
//                       <div className="mt-0.5 text-xs text-slate-500">
//                         {sender.senderId}
//                         {sender.companyName ? ` · ${sender.companyName}` : ""}
//                         {sender.email ? ` · ${sender.email}` : ""}
//                       </div>
//                     </td>
//                     <td className="px-4 py-3 text-slate-700">
//                       {formatPhone(sender.phone)}
//                     </td>
//                     <td className="px-4 py-3 text-slate-700">
//                       {[sender.city, sender.state]
//                         .filter(Boolean)
//                         .join(", ") || "—"}
//                     </td>
//                     <td className="px-4 py-3 text-slate-700">
//                       {sender.gstin || "—"}
//                     </td>
//                     <td className="px-4 py-3">
//                       <span
//                         className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
//                           sender.status === "ACTIVE"
//                             ? "bg-emerald-50 text-emerald-700"
//                             : "bg-slate-100 text-slate-600"
//                         }`}
//                       >
//                         {sender.status}
//                       </span>
//                     </td>
//                     <td className="px-4 py-3 text-right">
//                       <div className="flex justify-end gap-2">
//                         <button
//                           type="button"
//                           onClick={() => openEdit(sender)}
//                           className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
//                         >
//                           Edit
//                         </button>
//                         <button
//                           type="button"
//                           onClick={() => toggleStatus(sender)}
//                           className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
//                         >
//                           {sender.status === "ACTIVE"
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
//             Showing {filtered.length} of {items.length} senders
//           </div>
//         </div>
//       )}

//       {formOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
//           <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
//             <div className="mb-5 flex items-start justify-between gap-4">
//               <div>
//                 <h3 className="text-lg font-bold text-[#06284c]">
//                   {editing ? "Edit sender" : "Add sender"}
//                 </h3>
//                 <p className="mt-1 text-sm text-slate-500">
//                   {editing
//                     ? `Updating ${editing.senderId}`
//                     : "Create a sender/shipper record for AWB booking."}
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
//                   placeholder="Sender / shipper name"
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
//                     updateForm("status", e.target.value as SenderStatus)
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
//                       ? "Update Sender"
//                       : "Create Sender"}
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

// type SenderStatus = "ACTIVE" | "INACTIVE";

// type Sender = {
//   id: string;
//   senderId: string;
//   name: string;
//   companyName?: string;
//   contactName?: string;
//   phone: string;
//   mobile?: string;
//   email?: string;
//   address?: string;
//   addressLine2?: string;
//   city?: string;
//   state?: string;
//   postalCode?: string;
//   country?: string;
//   gstin?: string;
//   iecNo?: string;
//   documentType?: string;
//   documentNo?: string;
//   status: SenderStatus;
//   createdAt?: string;
//   updatedAt?: string;
// };

// type SenderForm = {
//   name: string;
//   companyName: string;
//   contactName: string;
//   phone: string;
//   mobile: string;
//   email: string;
//   address: string;
//   addressLine2: string;
//   city: string;
//   state: string;
//   postalCode: string;
//   country: string;
//   gstin: string;
//   iecNo: string;
//   documentType: string;
//   documentNo: string;
//   status: SenderStatus;
// };

// type ApiResponse =
//   | {
//       success: true;
//       data:
//         | Sender
//         | Sender[]
//         | {
//             items?: Sender[];
//             senders?: Sender[];
//             results?: Sender[];
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

// const EMPTY_FORM: SenderForm = {
//   name: "",
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

// // function normalizeSender(raw: Record<string, unknown>): Sender | null {
// //   const name = String(raw.name || "").trim();
// //   if (!name) return null;

// //   const senderId = String(raw.senderId || raw.id || "").trim();
// //   if (!senderId) return null;

// //   const statusRaw = String(raw.status || "ACTIVE").toUpperCase();

// //   return {
// //     id: String(raw.id || senderId),
// //     senderId,
// //     name,
// //     companyName: raw.companyName ? String(raw.companyName) : undefined,
// //     phone: String(raw.phone || "").trim(),
// //     email: raw.email ? String(raw.email) : undefined,
// //     address: raw.address
// //       ? String(raw.address)
// //       : raw.addressLine1
// //         ? String(raw.addressLine1)
// //         : undefined,
// //     city: raw.city ? String(raw.city) : undefined,
// //     state: raw.state ? String(raw.state) : undefined,
// //     postalCode: raw.postalCode ? String(raw.postalCode) : undefined,
// //     gstin: raw.gstin ? String(raw.gstin) : undefined,
// //     status: statusRaw === "INACTIVE" ? "INACTIVE" : "ACTIVE",
// //     createdAt: raw.createdAt ? String(raw.createdAt) : undefined,
// //     updatedAt: raw.updatedAt ? String(raw.updatedAt) : undefined,
// //   };
// // }

// function normalizeSender(raw: Record<string, unknown>): Sender | null {
//   const name = String(raw.name || raw.contactName || "").trim();
//   if (!name) return null;

//   const senderId = String(raw.senderId || raw.id || "").trim();
//   if (!senderId) return null;

//   const statusRaw = String(raw.status || "ACTIVE").toUpperCase();

//   return {
//     id: String(raw.id || senderId),
//     senderId,
//     name,
//     companyName: raw.companyName ? String(raw.companyName) : undefined,
//     contactName: raw.contactName
//       ? String(raw.contactName)
//       : name,
//     phone: String(raw.phone || "").trim(),
//     mobile: raw.mobile ? String(raw.mobile) : undefined,
//     email: raw.email ? String(raw.email) : undefined,
//     address: raw.address
//       ? String(raw.address)
//       : raw.addressLine1
//         ? String(raw.addressLine1)
//         : undefined,
//     addressLine2: raw.addressLine2
//       ? String(raw.addressLine2)
//       : undefined,
//     city: raw.city ? String(raw.city) : undefined,
//     state: raw.state ? String(raw.state) : undefined,
//     postalCode: raw.postalCode ? String(raw.postalCode) : undefined,
//     country: raw.country ? String(raw.country) : undefined,
//     gstin: raw.gstin ? String(raw.gstin) : undefined,
//     iecNo: raw.iecNo ? String(raw.iecNo) : undefined,
//     documentType: raw.documentType
//       ? String(raw.documentType)
//       : undefined,
//     documentNo: raw.documentNo ? String(raw.documentNo) : undefined,
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
//     senders?: unknown;
//     results?: unknown;
//   };

//   if (Array.isArray(obj.items)) return obj.items as Record<string, unknown>[];
//   if (Array.isArray(obj.senders)) return obj.senders as Record<string, unknown>[];
//   if (Array.isArray(obj.results)) return obj.results as Record<string, unknown>[];

//   return [];
// }

// // function toForm(sender?: Sender | null): SenderForm {
// //   if (!sender) return { ...EMPTY_FORM };

// //   return {
// //     name: sender.name || "",
// //     companyName: sender.companyName || "",
// //     phone: sender.phone || "",
// //     email: sender.email || "",
// //     address: sender.address || "",
// //     city: sender.city || "",
// //     state: sender.state || "",
// //     postalCode: sender.postalCode || "",
// //     gstin: sender.gstin || "",
// //     status: sender.status || "ACTIVE",
// //   };
// // }

// function toForm(sender?: Sender | null): SenderForm {
//   if (!sender) return { ...EMPTY_FORM };

//   return {
//     name: sender.name || "",
//     companyName: sender.companyName || "",
//     contactName: sender.contactName || sender.name || "",
//     phone: sender.phone || "",
//     mobile: sender.mobile || "",
//     email: sender.email || "",
//     address: sender.address || "",
//     addressLine2: sender.addressLine2 || "",
//     city: sender.city || "",
//     state: sender.state || "",
//     postalCode: sender.postalCode || "",
//     country: sender.country || "",
//     gstin: sender.gstin || "",
//     iecNo: sender.iecNo || "",
//     documentType: sender.documentType || "",
//     documentNo: sender.documentNo || "",
//     status: sender.status || "ACTIVE",
//   };
// }

// export default function SendersPage() {
//   const {
//     firebaseUser,
//     user,
//     loading: authLoading,
//   } = useAuth();

//   const [items, setItems] = useState<Sender[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [message, setMessage] = useState<string | null>(null);
//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState<"ALL" | SenderStatus>(
//     "ALL",
//   );
//   const [reloadKey, setReloadKey] = useState(0);

//   const [formOpen, setFormOpen] = useState(false);
//   const [editing, setEditing] = useState<Sender | null>(null);
//   const [form, setForm] = useState<SenderForm>(EMPTY_FORM);

//   useEffect(() => {
//     if (authLoading) return;

//     let cancelled = false;

//     async function loadSenders() {
//       try {
//         setLoading(true);
//         setError(null);

//         if (!firebaseUser) {
//           throw new Error("Authentication is required to manage senders.");
//         }

//         const token = await firebaseUser.getIdToken(true);

//         const res = await fetch("/api/logistics/senders", {
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
//               ? json.error?.message || "Failed to load senders."
//               : "Failed to load senders.",
//           );
//         }

//         const list = extractList(json.data);
//         const normalized = list
//           .map((item) => normalizeSender(item))
//           .filter(Boolean) as Sender[];

//         if (!cancelled) {
//           setItems(normalized);
//         }
//       } catch (e) {
//         if (!cancelled) {
//           setError(
//             e instanceof Error ? e.message : "Failed to load senders.",
//           );
//           setItems([]);
//         }
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     }

//     loadSenders();

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
//         item.senderId,
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

//   function openEdit(sender: Sender) {
//     setEditing(sender);
//     setForm(toForm(sender));
//     setFormOpen(true);
//     setMessage(null);
//     setError(null);
//   }

//   function closeForm() {
//     setFormOpen(false);
//     setEditing(null);
//     setForm({ ...EMPTY_FORM });
//   }

//   function updateForm<K extends keyof SenderForm>(
//     key: K,
//     value: SenderForm[K],
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
//         throw new Error("Sender name is required.");
//       }

//       if (!phone) {
//         throw new Error("Phone is required.");
//       }

//       const token = await firebaseUser.getIdToken(true);

//       // const payload = {
//       //   name,
//       //   companyName: form.companyName.trim() || undefined,
//       //   phone,
//       //   email: form.email.trim() || undefined,
//       //   address: form.address.trim() || undefined,
//       //   city: form.city.trim() || undefined,
//       //   state: form.state.trim() || undefined,
//       //   postalCode: form.postalCode.trim() || undefined,
//       //   gstin: form.gstin.trim() || undefined,
//       //   status: form.status,
//       //   ...(editing ? { senderId: editing.senderId } : {}),
//       // };

//       const payload = {
//         name: form.contactName.trim() || form.name.trim(),
//         contactName: form.contactName.trim() || form.name.trim(),
//         companyName: form.companyName.trim() || undefined,
//         phone: form.phone.trim(),
//         mobile: form.mobile.trim() || undefined,
//         email: form.email.trim() || undefined,
//         address: form.address.trim() || undefined,
//         addressLine1: form.address.trim() || undefined,
//         addressLine2: form.addressLine2.trim() || undefined,
//         city: form.city.trim() || undefined,
//         state: form.state.trim() || undefined,
//         postalCode: form.postalCode.trim() || undefined,
//         country: form.country.trim() || undefined,
//         gstin: form.gstin.trim() || undefined,
//         iecNo: form.iecNo.trim() || undefined,
//         documentType: form.documentType.trim() || undefined,
//         documentNo: form.documentNo.trim() || undefined,
//         status: form.status,
//         ...(editing ? { senderId: editing.senderId } : {}),
//       };

//       const res = await fetch("/api/logistics/senders", {
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
//             ? json.error?.message || "Failed to save sender."
//             : "Failed to save sender.",
//         );
//       }

//       setMessage(
//         editing
//           ? "Sender updated successfully."
//           : "Sender created successfully.",
//       );
//       closeForm();
//       setReloadKey((value) => value + 1);
//     } catch (e) {
//       setError(e instanceof Error ? e.message : "Failed to save sender.");
//     } finally {
//       setSaving(false);
//     }
//   }

//   async function toggleStatus(sender: Sender) {
//     try {
//       setError(null);
//       setMessage(null);

//       if (!firebaseUser) {
//         throw new Error("Authentication is required.");
//       }

//       const token = await firebaseUser.getIdToken(true);
//       const nextStatus: SenderStatus =
//         sender.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

//       const res = await fetch("/api/logistics/senders", {
//         method: "PATCH",
//         headers: {
//           Accept: "application/json",
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           senderId: sender.senderId,
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
//         `Sender marked as ${nextStatus === "ACTIVE" ? "active" : "inactive"}.`,
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
//           <h2 className="mt-1 text-2xl font-bold text-[#06284c]">Senders</h2>
//           <p className="mt-1 text-sm text-slate-500">
//             Manage shipment sender and shipper records.
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
//             + Add Sender
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
//             setStatusFilter(event.target.value as "ALL" | SenderStatus)
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
//             Loading senders...
//           </h3>
//           <p className="mt-2 text-sm text-slate-500">
//             Fetching sender records from the server.
//           </p>
//         </div>
//       ) : !firebaseUser ? (
//         <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-10 text-center text-sm text-red-700">
//           Authentication is required to manage senders.
//         </div>
//       ) : filtered.length === 0 ? (
//         <div className="rounded-xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
//           <h3 className="text-lg font-bold text-[#06284c]">
//             No senders found
//           </h3>
//           <p className="mt-2 text-sm text-slate-500">
//             {items.length === 0
//               ? "Create the first sender/shipper for AWB booking."
//               : "No senders match your current search or filter."}
//           </p>
//           {items.length === 0 && (
//             <button
//               type="button"
//               onClick={openCreate}
//               className="mt-5 rounded-lg bg-[#087f87] px-4 py-2.5 text-sm font-bold text-white"
//             >
//               + Add Sender
//             </button>
//           )}
//         </div>
//       ) : (
//         <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
//           <div className="overflow-x-auto">
//             <table className="min-w-full text-left text-sm">
//               <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
//                 <tr>
//                   <th className="px-4 py-3 font-semibold">Sender</th>
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
//                 {filtered.map((sender) => (
//                   <tr
//                     key={sender.senderId}
//                     className="border-t border-slate-100"
//                   >
//                     <td className="px-4 py-3">
//                       <div className="font-semibold text-slate-900">
//                         {sender.name}
//                       </div>
//                       <div className="mt-0.5 text-xs text-slate-500">
//                         {sender.senderId}
//                         {sender.companyName ? ` · ${sender.companyName}` : ""}
//                         {sender.email ? ` · ${sender.email}` : ""}
//                       </div>
//                     </td>
//                     <td className="px-4 py-3 text-slate-700">
//                       {formatPhone(sender.phone)}
//                     </td>
//                     <td className="px-4 py-3 text-slate-700">
//                       {[sender.city, sender.state]
//                         .filter(Boolean)
//                         .join(", ") || "—"}
//                     </td>
//                     <td className="px-4 py-3 text-slate-700">
//                       {sender.gstin || "—"}
//                     </td>
//                     <td className="px-4 py-3">
//                       <span
//                         className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
//                           sender.status === "ACTIVE"
//                             ? "bg-emerald-50 text-emerald-700"
//                             : "bg-slate-100 text-slate-600"
//                         }`}
//                       >
//                         {sender.status}
//                       </span>
//                     </td>
//                     <td className="px-4 py-3 text-right">
//                       <div className="flex justify-end gap-2">
//                         <button
//                           type="button"
//                           onClick={() => openEdit(sender)}
//                           className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
//                         >
//                           Edit
//                         </button>
//                         <button
//                           type="button"
//                           onClick={() => toggleStatus(sender)}
//                           className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
//                         >
//                           {sender.status === "ACTIVE"
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
//             Showing {filtered.length} of {items.length} senders
//           </div>
//         </div>
//       )}

//       {formOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
//           <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
//             <div className="mb-5 flex items-start justify-between gap-4">
//               <div>
//                 <h3 className="text-lg font-bold text-[#06284c]">
//                   {editing ? "Edit sender" : "Add sender"}
//                 </h3>
//                 <p className="mt-1 text-sm text-slate-500">
//                   {editing
//                     ? `Updating ${editing.senderId}`
//                     : "Create a sender/shipper record for AWB booking."}
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
//                   placeholder="Sender / shipper name"
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
//                   required
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
//                   required
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
//                   required
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
//                   required
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
//                   required
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
//                   required
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
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                   Status
//                 </label>
//                 <select
//                   value={form.status}
//                   onChange={(e) =>
//                     updateForm("status", e.target.value as SenderStatus)
//                   }
//                   required
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
//                       ? "Update Sender"
//                       : "Create Sender"}
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

// type SenderStatus = "ACTIVE" | "INACTIVE";

// type Sender = {
//   id: string;
//   senderId: string;
//   name: string;
//   companyName?: string;
//   contactName?: string;
//   phone: string;
//   mobile?: string;
//   email?: string;
//   address?: string;
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
//   status: SenderStatus;
//   createdAt?: string;
//   updatedAt?: string;
// };

// type SenderForm = {
//   companyName: string;
//   contactName: string;
//   phone: string;
//   mobile: string;
//   email: string;
//   address: string;
//   addressLine2: string;
//   city: string;
//   state: string;
//   postalCode: string;
//   country: string;
//   gstin: string;
//   iecNo: string;
//   documentType: string;
//   documentNo: string;
//   documentUrl: string;
//   status: SenderStatus;
// };

// type ApiResponse =
//   | {
//       success: true;
//       data:
//         | Sender
//         | Sender[]
//         | {
//             items?: Sender[];
//             senders?: Sender[];
//             results?: Sender[];
//           };
//       message?: string;
//     }
//   | {
//       success: false;
//       error: { code: string; message: string };
//     };

// const EMPTY_FORM: SenderForm = {
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
//   documentUrl: "",
//   status: "ACTIVE",
// };

// const DOCUMENT_TYPES = [
//   { value: "", label: "Select document type" },
//   { value: "AADHAAR", label: "Aadhaar Number" },
//   { value: "GSTIN (Normal)", label: "GSTIN (Normal)" },
//   { value: "PAN", label: "PAN Number" },
//   { value: "PASSPORT", label: "Passport Number" },
//   { value: "TAN", label: "TAN Number" },
//   { value: "VOTER_ID", label: "Voter Id" },
// ];

// function normalizeSender(raw: Record<string, unknown>): Sender | null {
//   const senderId = String(raw.senderId || raw.id || "").trim();
//   if (!senderId) return null;

//   const companyName = String(raw.companyName || "").trim();
//   const contactName = String(
//     raw.contactName || raw.name || "",
//   ).trim();

//   if (!companyName && !contactName) return null;

//   const statusRaw = String(raw.status || "ACTIVE").toUpperCase();

//   return {
//     id: String(raw.id || senderId),
//     senderId,
//     name: contactName || companyName,
//     companyName: companyName || undefined,
//     contactName: contactName || undefined,
//     phone: String(raw.phone || "").trim(),
//     mobile: raw.mobile ? String(raw.mobile) : undefined,
//     email: raw.email ? String(raw.email) : undefined,
//     address: raw.address
//       ? String(raw.address)
//       : raw.addressLine1
//         ? String(raw.addressLine1)
//         : undefined,
//     addressLine2: raw.addressLine2 ? String(raw.addressLine2) : undefined,
//     city: raw.city ? String(raw.city) : undefined,
//     state: raw.state ? String(raw.state) : undefined,
//     postalCode: raw.postalCode ? String(raw.postalCode) : undefined,
//     country: raw.country ? String(raw.country) : undefined,
//     gstin: raw.gstin ? String(raw.gstin) : undefined,
//     iecNo: raw.iecNo ? String(raw.iecNo) : undefined,
//     documentType: raw.documentType ? String(raw.documentType) : undefined,
//     documentNo: raw.documentNo ? String(raw.documentNo) : undefined,
//     documentUrl: raw.documentUrl ? String(raw.documentUrl) : undefined,
//     status: statusRaw === "INACTIVE" ? "INACTIVE" : "ACTIVE",
//     createdAt: raw.createdAt ? String(raw.createdAt) : undefined,
//     updatedAt: raw.updatedAt ? String(raw.updatedAt) : undefined,
//   };
// }

// function extractList(data: unknown): Record<string, unknown>[] {
//   if (Array.isArray(data)) return data as Record<string, unknown>[];
//   if (!data || typeof data !== "object") return [];
//   const obj = data as {
//     items?: unknown;
//     senders?: unknown;
//     results?: unknown;
//   };
//   if (Array.isArray(obj.items)) return obj.items as Record<string, unknown>[];
//   if (Array.isArray(obj.senders))
//     return obj.senders as Record<string, unknown>[];
//   if (Array.isArray(obj.results))
//     return obj.results as Record<string, unknown>[];
//   return [];
// }

// function toForm(sender?: Sender | null): SenderForm {
//   if (!sender) return { ...EMPTY_FORM };
//   return {
//     companyName: sender.companyName || "",
//     contactName: sender.contactName || sender.name || "",
//     phone: sender.phone || "",
//     mobile: sender.mobile || "",
//     email: sender.email || "",
//     address: sender.address || "",
//     addressLine2: sender.addressLine2 || "",
//     city: sender.city || "",
//     state: sender.state || "",
//     postalCode: sender.postalCode || "",
//     country: sender.country || "",
//     gstin: sender.gstin || "",
//     iecNo: sender.iecNo || "",
//     documentType: sender.documentType || "",
//     documentNo: sender.documentNo || "",
//     documentUrl: sender.documentUrl || "",
//     status: sender.status || "ACTIVE",
//   };
// }

// export default function SendersPage() {
//   const { firebaseUser, user, loading: authLoading } = useAuth();

//   const [items, setItems] = useState<Sender[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [message, setMessage] = useState<string | null>(null);
//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState<"ALL" | SenderStatus>(
//     "ALL",
//   );
//   const [reloadKey, setReloadKey] = useState(0);

//   const [formOpen, setFormOpen] = useState(false);
//   const [editing, setEditing] = useState<Sender | null>(null);
//   const [form, setForm] = useState<SenderForm>(EMPTY_FORM);
//   const [uploadingDoc, setUploadingDoc] = useState(false);

//   useEffect(() => {
//     if (authLoading) return;
//     let cancelled = false;

//     async function loadSenders() {
//       try {
//         setLoading(true);
//         setError(null);
//         if (!firebaseUser) {
//           throw new Error("Authentication is required to manage senders.");
//         }
//         const token = await firebaseUser.getIdToken(true);
//         const res = await fetch("/api/logistics/senders", {
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
//               ? json.error?.message || "Failed to load senders."
//               : "Failed to load senders.",
//           );
//         }
//         const list = extractList(json.data);
//         const normalized = list
//           .map((item) => normalizeSender(item))
//           .filter(Boolean) as Sender[];
//         if (!cancelled) setItems(normalized);
//       } catch (e) {
//         if (!cancelled) {
//           setError(e instanceof Error ? e.message : "Failed to load senders.");
//           setItems([]);
//         }
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     }

//     loadSenders();
//     return () => {
//       cancelled = true;
//     };
//   }, [authLoading, firebaseUser, reloadKey]);

//   const filtered = useMemo(() => {
//     const query = search.trim().toLowerCase();
//     return items.filter((item) => {
//       if (statusFilter !== "ALL" && item.status !== statusFilter) return false;
//       if (!query) return true;
//       return [
//         item.senderId,
//         item.name,
//         item.companyName,
//         item.contactName,
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

//   function openEdit(sender: Sender) {
//     setEditing(sender);
//     setForm(toForm(sender));
//     setFormOpen(true);
//     setMessage(null);
//     setError(null);
//   }

//   function closeForm() {
//     setFormOpen(false);
//     setEditing(null);
//     setForm({ ...EMPTY_FORM });
//   }

//   function updateForm<K extends keyof SenderForm>(key: K, value: SenderForm[K]) {
//     setForm((current) => ({ ...current, [key]: value }));
//   }

//   async function uploadSenderDocument(file: File | null) {
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
//     fd.append("context", "sender-document");
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

//       if (!firebaseUser) throw new Error("Authentication is required.");

//       const required: Array<[keyof SenderForm, string]> = [
//         // ["companyName", "Company name"],
//         ["contactName", "Contact name"],
//         // ["phone", "Telephone"],
//         ["mobile", "Mobile"],
//         // ["email", "Email"],
//         ["address", "Address 1"],
//         // ["addressLine2", "Address 2"],
//         ["city", "City"],
//         ["state", "State"],
//         ["postalCode", "Pincode"],
//         ["country", "Country"],
//         // ["gstin", "GSTIN"],
//         // ["iecNo", "IEC No."],
//         ["documentType", "Document type"],
//         ["documentNo", "Document number"],
//       ];

//       for (const [key, label] of required) {
//         if (!String(form[key] || "").trim()) {
//           throw new Error(`${label} is required.`);
//         }
//       }

//       const token = await firebaseUser.getIdToken(true);
//       const contactName = form.contactName.trim();
//       const companyName = form.companyName.trim();

//       const payload = {
//         name: contactName,
//         contactName,
//         companyName,
//         phone: form.phone.trim(),
//         mobile: form.mobile.trim(),
//         email: form.email.trim(),
//         address: form.address.trim(),
//         addressLine1: form.address.trim(),
//         addressLine2: form.addressLine2.trim(),
//         city: form.city.trim(),
//         state: form.state.trim(),
//         postalCode: form.postalCode.trim(),
//         country: form.country.trim(),
//         gstin: form.gstin.trim().toUpperCase(),
//         iecNo: form.iecNo.trim(),
//         documentType: form.documentType.trim(),
//         documentNo: form.documentNo.trim(),
//         documentUrl: form.documentUrl.trim() || null,
//         status: form.status,
//         ...(editing ? { senderId: editing.senderId } : {}),
//       };

//       const res = await fetch("/api/logistics/senders", {
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
//             ? json.error?.message || "Failed to save sender."
//             : "Failed to save sender.",
//         );
//       }

//       setMessage(
//         editing ? "Sender updated successfully." : "Sender created successfully.",
//       );
//       closeForm();
//       setReloadKey((v) => v + 1);
//     } catch (e) {
//       setError(e instanceof Error ? e.message : "Failed to save sender.");
//     } finally {
//       setSaving(false);
//     }
//   }

//   async function toggleStatus(sender: Sender) {
//     try {
//       setError(null);
//       setMessage(null);
//       if (!firebaseUser) throw new Error("Authentication is required.");
//       const token = await firebaseUser.getIdToken(true);
//       const nextStatus: SenderStatus =
//         sender.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

//       const res = await fetch("/api/logistics/senders", {
//         method: "PATCH",
//         headers: {
//           Accept: "application/json",
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           senderId: sender.senderId,
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
//         `Sender marked as ${nextStatus === "ACTIVE" ? "active" : "inactive"}.`,
//       );
//       setReloadKey((v) => v + 1);
//     } catch (e) {
//       setError(e instanceof Error ? e.message : "Failed to update status.");
//     }
//   }

//   const inputClass =
//     "h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-[#087f87] focus:ring-2 focus:ring-cyan-100";
//   const labelClass = "mb-1.5 block text-sm font-medium text-slate-700";

//   return (
//     <div className="mx-auto max-w-[1400px]">
//       <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
//         <div>
//           <p className="text-xs font-bold uppercase tracking-widest text-[#087f87]">
//             Masters
//           </p>
//           <h2 className="mt-1 text-2xl font-bold text-[#06284c]">Senders</h2>
//           <p className="mt-1 text-sm text-slate-500">
//             Manage shipment sender and shipper records. All fields are required.
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
//             onClick={() => setReloadKey((v) => v + 1)}
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
//             + Add Sender
//           </button>
//         </div>
//       </div>

//       <div className="mb-5 grid gap-3 md:grid-cols-[1fr_180px]">
//         <input
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           placeholder="Search by company, contact, phone, city, GSTIN..."
//           className={inputClass}
//         />
//         <select
//           value={statusFilter}
//           onChange={(e) =>
//             setStatusFilter(e.target.value as "ALL" | SenderStatus)
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
//           <h3 className="text-lg font-bold text-[#06284c]">Loading senders...</h3>
//         </div>
//       ) : !firebaseUser ? (
//         <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-10 text-center text-sm text-red-700">
//           Authentication is required to manage senders.
//         </div>
//       ) : filtered.length === 0 ? (
//         <div className="rounded-xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
//           <h3 className="text-lg font-bold text-[#06284c]">No senders found</h3>
//           <p className="mt-2 text-sm text-slate-500">
//             {items.length === 0
//               ? "Create the first sender for AWB booking."
//               : "No senders match your search."}
//           </p>
//           {items.length === 0 && (
//             <button
//               type="button"
//               onClick={openCreate}
//               className="mt-5 rounded-lg bg-[#087f87] px-4 py-2.5 text-sm font-bold text-white"
//             >
//               + Add Sender
//             </button>
//           )}
//         </div>
//       ) : (
//         <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
//           <div className="overflow-x-auto">
//             <table className="min-w-full text-left text-sm">
//               <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
//                 <tr>
//                   <th className="px-4 py-3 font-semibold">Company / Contact</th>
//                   <th className="px-4 py-3 font-semibold">Phone</th>
//                   <th className="px-4 py-3 font-semibold">Location</th>
//                   <th className="px-4 py-3 font-semibold">GSTIN</th>
//                   <th className="px-4 py-3 font-semibold">Status</th>
//                   <th className="px-4 py-3 font-semibold text-right">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filtered.map((sender) => (
//                   <tr key={sender.senderId} className="border-t border-slate-100">
//                     <td className="px-4 py-3">
//                       <div className="font-semibold text-slate-900">
//                         {sender.companyName || "—"}
//                       </div>
//                       <div className="mt-0.5 text-xs text-slate-500">
//                         {sender.contactName || sender.name}
//                         {sender.email ? ` · ${sender.email}` : ""}
//                       </div>
//                     </td>
//                     <td className="px-4 py-3 text-slate-700">
//                       {formatPhone(sender.phone)}
//                     </td>
//                     <td className="px-4 py-3 text-slate-700">
//                       {[sender.city, sender.state].filter(Boolean).join(", ") ||
//                         "—"}
//                     </td>
//                     <td className="px-4 py-3 text-slate-700">
//                       {sender.gstin || "—"}
//                     </td>
//                     <td className="px-4 py-3">
//                       <span
//                         className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
//                           sender.status === "ACTIVE"
//                             ? "bg-emerald-50 text-emerald-700"
//                             : "bg-slate-100 text-slate-600"
//                         }`}
//                       >
//                         {sender.status}
//                       </span>
//                     </td>
//                     <td className="px-4 py-3 text-right">
//                       <div className="flex justify-end gap-2">
//                         <button
//                           type="button"
//                           onClick={() => openEdit(sender)}
//                           className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
//                         >
//                           Edit
//                         </button>
//                         <button
//                           type="button"
//                           onClick={() => toggleStatus(sender)}
//                           className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
//                         >
//                           {sender.status === "ACTIVE" ? "Deactivate" : "Activate"}
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//           <div className="border-t border-slate-100 px-4 py-3 text-xs text-slate-500">
//             Showing {filtered.length} of {items.length} senders
//           </div>
//         </div>
//       )}

//       {formOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
//           <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
//             <div className="mb-5 flex items-start justify-between gap-4">
//               <div>
//                 <h3 className="text-lg font-bold text-[#06284c]">
//                   {editing ? "Edit sender" : "Add sender"}
//                 </h3>
//                 <p className="mt-1 text-sm text-slate-500">
//                   All fields marked * are mandatory.
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
//               <div>
//                 <label className={labelClass}>
//                   Company Name
//                 </label>
//                 <input
//                   value={form.companyName}
//                   onChange={(e) => updateForm("companyName", e.target.value)}
//                   className={inputClass}
                  
//                 />
//               </div>
//               <div>
//                 <label className={labelClass}>
//                   Name <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   value={form.contactName}
//                   onChange={(e) => updateForm("contactName", e.target.value)}
//                   className={inputClass}
//                   required
//                 />
//               </div>
//               <div>
//                 <label className={labelClass}>
//                   Telephone <span className="text-red-500"></span>
//                   <span className="font-normal text-slate-400">(optional)</span>
//                 </label>
//                 <input
//                   value={form.phone}
//                   onChange={(e) => updateForm("phone", e.target.value)}
//                   className={inputClass}
//                 />
//               </div>
//               <div>
//                 <label className={labelClass}>
//                   Mobile <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   value={form.mobile}
//                   onChange={(e) => updateForm("mobile", e.target.value)}
//                   className={inputClass}
//                   required
//                 />
//               </div>
              
//               <div className="sm:col-span-2">
//                 <label className={labelClass}>
//                   Email
//                 </label>
//                 <input
//                   type="email"
//                   value={form.email}
//                   onChange={(e) => updateForm("email", e.target.value)}
//                   className={inputClass}
                  
//                 />
//               </div>

//               <div className="sm:col-span-2">
//                 <label className={labelClass}>
//                   Address 1 <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   value={form.address}
//                   onChange={(e) => updateForm("address", e.target.value)}
//                   // className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#087f87] focus:ring-2 focus:ring-cyan-100"
//                   className={inputClass}
//                   required
//                 />
//               </div>
//               <div className="sm:col-span-2">
//                 <label className={labelClass}>
//                   Address 2 <span className="font-normal text-slate-400">(optional)</span>
//                 </label>
//                 <input
//                   value={form.addressLine2}
//                   onChange={(e) => updateForm("addressLine2", e.target.value)}
//                   className={inputClass}
//                 />
//               </div>
//               <div>
//                 <label className={labelClass}>
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
//                 <label className={labelClass}>
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
//                 <label className={labelClass}>
//                   Pincode <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   value={form.postalCode}
//                   onChange={(e) => updateForm("postalCode", e.target.value)}
//                   className={inputClass}
//                   required
//                 />
//               </div>
//               <div>
//                 <label className={labelClass}>
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
//                 <label className={labelClass}>
//                   GSTIN 
//                 </label>
//                 <input
//                   value={form.gstin}
//                   onChange={(e) =>
//                     updateForm("gstin", e.target.value.toUpperCase())
//                   }
//                   className={inputClass}
//                 />
//               </div>
//               <div>
//                 <label className={labelClass}>
//                   IEC No. 
//                 </label>
//                 <input
//                   value={form.iecNo}
//                   onChange={(e) => updateForm("iecNo", e.target.value)}
//                   className={inputClass}
//                 />
//               </div>
//               <div>
//                 <label className={labelClass}>
//                   Document Type <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   value={form.documentType}
//                   onChange={(e) => updateForm("documentType", e.target.value)}
//                   className={inputClass}
//                   required
//                 >
//                   {DOCUMENT_TYPES.map((t) => (
//                     <option key={t.value || "empty"} value={t.value}>
//                       {t.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className={labelClass}>
//                   Document No. <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   value={form.documentNo}
//                   onChange={(e) => updateForm("documentNo", e.target.value)}
//                   className={inputClass}
//                   required
//                 />
//               </div>
//                 <div className="sm:col-span-2">
//                 <label className={labelClass}>Document file (image / PDF)</label>
//                 <label
//                   className={[
//                     "mt-1 flex h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50",
//                     saving || uploadingDoc || !firebaseUser
//                       ? "pointer-events-none opacity-60"
//                       : "",
//                   ].join(" ")}
//                 >
//                   {uploadingDoc ? "Uploading…" : "Upload image or PDF"}
//                   <input
//                     type="file"
//                     accept="image/jpeg,image/png,image/webp,application/pdf"
//                     className="hidden"
//                     disabled={saving || uploadingDoc || !firebaseUser}
//                     onChange={(e) =>
//                       uploadSenderDocument(e.target.files?.[0] ?? null)
//                     }
//                   />
//                 </label>
//                 {form.documentUrl ? (
//                   <a
//                     href={form.documentUrl}
//                     target="_blank"
//                     rel="noreferrer"
//                     className="mt-2 inline-block text-xs font-semibold text-[#087f87] hover:underline"
//                   >
//                     View uploaded document
//                   </a>
//                 ) : null}
//               </div>
//               <div>
//                 <label className={labelClass}>Status <span className="text-red-500">*</span></label>
//                 <select
//                   value={form.status}
//                   onChange={(e) =>
//                     updateForm("status", e.target.value as SenderStatus)
//                   }
//                   className={inputClass}
//                   required
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
//                       ? "Update Sender"
//                       : "Create Sender"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, Trash2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { formatPhone } from "@/utils/formatters";

type SenderStatus = "ACTIVE" | "INACTIVE";

type Sender = {
  id: string;
  senderId: string;
  name: string;
  companyName?: string;
  contactName?: string;
  phone: string;
  mobile?: string;
  email?: string;
  address?: string;
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
  status: SenderStatus;
  createdAt?: string;
  updatedAt?: string;
};

type SenderForm = {
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
  status: SenderStatus;
};

type SortKey = "companyName" | "phone" | "city" | "status";
type SortDir = "asc" | "desc";

type ApiResponse =
  | {
      success: true;
      data:
        | Sender
        | Sender[]
        | {
            items?: Sender[];
            senders?: Sender[];
            results?: Sender[];
          };
      message?: string;
    }
  | {
      success: false;
      error: { code: string; message: string };
    };

const EMPTY_FORM: SenderForm = {
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

function normalizeSender(raw: Record<string, unknown>): Sender | null {
  const senderId = String(raw.senderId || raw.id || "").trim();
  if (!senderId) return null;

  const companyName = String(raw.companyName || "").trim();
  const contactName = String(raw.contactName || raw.name || "").trim();
  if (!companyName && !contactName) return null;

  const statusRaw = String(raw.status || "ACTIVE").toUpperCase();

  return {
    id: String(raw.id || senderId),
    senderId,
    name: contactName || companyName,
    companyName: companyName || undefined,
    contactName: contactName || undefined,
    phone: String(raw.phone || "").trim(),
    mobile: raw.mobile ? String(raw.mobile) : undefined,
    email: raw.email ? String(raw.email) : undefined,
    address: raw.address
      ? String(raw.address)
      : raw.addressLine1
        ? String(raw.addressLine1)
        : undefined,
    addressLine2: raw.addressLine2 ? String(raw.addressLine2) : undefined,
    city: raw.city ? String(raw.city) : undefined,
    state: raw.state ? String(raw.state) : undefined,
    postalCode: raw.postalCode ? String(raw.postalCode) : undefined,
    country: raw.country ? String(raw.country) : undefined,
    gstin: raw.gstin ? String(raw.gstin) : undefined,
    iecNo: raw.iecNo ? String(raw.iecNo) : undefined,
    documentType: raw.documentType ? String(raw.documentType) : undefined,
    documentNo: raw.documentNo ? String(raw.documentNo) : undefined,
    documentUrl: raw.documentUrl ? String(raw.documentUrl) : undefined,
    status: statusRaw === "INACTIVE" ? "INACTIVE" : "ACTIVE",
    createdAt: raw.createdAt ? String(raw.createdAt) : undefined,
    updatedAt: raw.updatedAt ? String(raw.updatedAt) : undefined,
  };
}

function extractList(data: unknown): Record<string, unknown>[] {
  if (Array.isArray(data)) return data as Record<string, unknown>[];
  if (!data || typeof data !== "object") return [];
  const obj = data as {
    items?: unknown;
    senders?: unknown;
    results?: unknown;
  };
  if (Array.isArray(obj.items)) return obj.items as Record<string, unknown>[];
  if (Array.isArray(obj.senders))
    return obj.senders as Record<string, unknown>[];
  if (Array.isArray(obj.results))
    return obj.results as Record<string, unknown>[];
  return [];
}

function toForm(sender?: Sender | null): SenderForm {
  if (!sender) return { ...EMPTY_FORM };
  return {
    companyName: sender.companyName || "",
    contactName: sender.contactName || sender.name || "",
    phone: sender.phone || "",
    mobile: sender.mobile || "",
    email: sender.email || "",
    address: sender.address || "",
    addressLine2: sender.addressLine2 || "",
    city: sender.city || "",
    state: sender.state || "",
    postalCode: sender.postalCode || "",
    country: sender.country || "",
    gstin: sender.gstin || "",
    iecNo: sender.iecNo || "",
    documentType: sender.documentType || "",
    documentNo: sender.documentNo || "",
    documentUrl: sender.documentUrl || "",
    status: sender.status || "ACTIVE",
  };
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
    <th className="px-4 py-3">
      <button
        type="button"
        onClick={onClick}
        className="inline-flex items-center gap-1 font-semibold uppercase tracking-wide text-slate-500 hover:text-slate-800"
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

export default function SendersPage() {
  const { firebaseUser, user, loading: authLoading } = useAuth();

  const [items, setItems] = useState<Sender[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | SenderStatus>(
    "ALL",
  );
  const [reloadKey, setReloadKey] = useState(0);
  const [sortKey, setSortKey] = useState<SortKey>("companyName");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Sender | null>(null);
  const [form, setForm] = useState<SenderForm>(EMPTY_FORM);
  const [uploadingDoc, setUploadingDoc] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    let cancelled = false;

    async function loadSenders() {
      try {
        setLoading(true);
        setError(null);
        if (!firebaseUser) {
          throw new Error("Authentication is required to manage senders.");
        }
        const token = await firebaseUser.getIdToken(true);
        const res = await fetch("/api/logistics/senders", {
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
              ? json.error?.message || "Failed to load senders."
              : "Failed to load senders.",
          );
        }
        const list = extractList(json.data);
        const normalized = list
          .map((item) => normalizeSender(item))
          .filter(Boolean) as Sender[];
        if (!cancelled) setItems(normalized);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load senders.");
          setItems([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadSenders();
    return () => {
      cancelled = true;
    };
  }, [authLoading, firebaseUser, reloadKey]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    let list = items.filter((item) => {
      if (statusFilter !== "ALL" && item.status !== statusFilter) return false;
      if (!query) return true;
      return [
        item.senderId,
        item.name,
        item.companyName,
        item.contactName,
        item.phone,
        item.mobile,
        item.email,
        item.city,
        item.state,
        item.gstin,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query);
    });

    list = [...list].sort((a, b) => {
      const va =
        sortKey === "companyName"
          ? String(a.companyName || a.name || "")
          : sortKey === "phone"
            ? String(a.mobile || a.phone || "")
            : sortKey === "city"
              ? String(a.city || "")
              : String(a.status || "");
      const vb =
        sortKey === "companyName"
          ? String(b.companyName || b.name || "")
          : sortKey === "phone"
            ? String(b.mobile || b.phone || "")
            : sortKey === "city"
              ? String(b.city || "")
              : String(b.status || "");
      const cmp = va.localeCompare(vb, undefined, {
        numeric: true,
        sensitivity: "base",
      });
      return sortDir === "asc" ? cmp : -cmp;
    });

    return list;
  }, [items, search, statusFilter, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  function openCreate() {
    setEditing(null);
    setForm({ ...EMPTY_FORM });
    setFormOpen(true);
    setMessage(null);
    setError(null);
  }

  function openEdit(sender: Sender) {
    setEditing(sender);
    setForm(toForm(sender));
    setFormOpen(true);
    setMessage(null);
    setError(null);
  }

  function closeForm() {
    setFormOpen(false);
    setEditing(null);
    setForm({ ...EMPTY_FORM });
  }

  function updateForm<K extends keyof SenderForm>(key: K, value: SenderForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function uploadSenderDocument(file: File | null) {
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
      fd.append("context", "sender-document");
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

      if (!firebaseUser) throw new Error("Authentication is required.");

      const required: Array<[keyof SenderForm, string]> = [
        ["contactName", "Contact name"],
        ["mobile", "Mobile"],
        ["address", "Address 1"],
        ["city", "City"],
        ["state", "State"],
        ["postalCode", "Pincode"],
        ["country", "Country"],
        ["documentType", "Document type"],
        ["documentNo", "Document number"],
      ];

      for (const [key, label] of required) {
        if (!String(form[key] || "").trim()) {
          throw new Error(`${label} is required.`);
        }
      }

      const token = await firebaseUser.getIdToken(true);
      const contactName = form.contactName.trim();
      const companyName = form.companyName.trim();

      const payload = {
        name: contactName,
        contactName,
        companyName,
        phone: form.phone.trim(),
        mobile: form.mobile.trim(),
        email: form.email.trim(),
        address: form.address.trim(),
        addressLine1: form.address.trim(),
        addressLine2: form.addressLine2.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        postalCode: form.postalCode.trim(),
        country: form.country.trim(),
        gstin: form.gstin.trim().toUpperCase(),
        iecNo: form.iecNo.trim(),
        documentType: form.documentType.trim(),
        documentNo: form.documentNo.trim(),
        documentUrl: form.documentUrl.trim() || null,
        status: form.status,
        ...(editing ? { senderId: editing.senderId } : {}),
      };

      const res = await fetch("/api/logistics/senders", {
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
            ? json.error?.message || "Failed to save sender."
            : "Failed to save sender.",
        );
      }

      setMessage(
        editing
          ? "Sender updated successfully."
          : "Sender created successfully.",
      );
      closeForm();
      setReloadKey((v) => v + 1);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save sender.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleStatus(sender: Sender) {
    try {
      setError(null);
      setMessage(null);
      if (!firebaseUser) throw new Error("Authentication is required.");
      const token = await firebaseUser.getIdToken(true);
      const nextStatus: SenderStatus =
        sender.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

      const res = await fetch("/api/logistics/senders", {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          senderId: sender.senderId,
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
        `Sender marked as ${nextStatus === "ACTIVE" ? "active" : "inactive"}.`,
      );
      setReloadKey((v) => v + 1);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update status.");
    }
  }

  async function handleDelete(sender: Sender) {
    if (!firebaseUser) return;
    const label = sender.companyName || sender.contactName || sender.name;
    if (
      !window.confirm(
        `Delete sender "${label}" permanently?\n\nThis cannot be undone.`,
      )
    ) {
      return;
    }

    try {
      setDeletingId(sender.senderId);
      setError(null);
      setMessage(null);
      const token = await firebaseUser.getIdToken(true);
      const res = await fetch(
        `/api/logistics/senders?senderId=${encodeURIComponent(sender.senderId)}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json?.error?.message || "Failed to delete sender.");
      }
      setMessage("Sender deleted.");
      setReloadKey((v) => v + 1);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete sender.");
    } finally {
      setDeletingId(null);
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
          <h2 className="mt-1 text-2xl font-bold text-[#06284c]">Senders</h2>
          <p className="mt-1 text-sm text-slate-500">
            Manage shipment sender and shipper records.
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
            + Add Sender
          </button>
        </div>
      </div>

      <div className="mb-5 grid gap-3 md:grid-cols-[1fr_180px]">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by company, contact, phone, city, GSTIN..."
          className={inputClass}
        />
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as "ALL" | SenderStatus)
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
          <h3 className="text-lg font-bold text-[#06284c]">Loading senders...</h3>
        </div>
      ) : !firebaseUser ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-10 text-center text-sm text-red-700">
          Authentication is required to manage senders.
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
          <h3 className="text-lg font-bold text-[#06284c]">No senders found</h3>
          <p className="mt-2 text-sm text-slate-500">
            {items.length === 0
              ? "Create the first sender for AWB booking."
              : "No senders match your search."}
          </p>
          {items.length === 0 && (
            <button
              type="button"
              onClick={openCreate}
              className="mt-5 rounded-lg bg-[#087f87] px-4 py-2.5 text-sm font-bold text-white"
            >
              + Add Sender
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <SortableTh
                    label="Company / Contact"
                    active={sortKey === "companyName"}
                    dir={sortDir}
                    onClick={() => toggleSort("companyName")}
                  />
                  <SortableTh
                    label="Phone"
                    active={sortKey === "phone"}
                    dir={sortDir}
                    onClick={() => toggleSort("phone")}
                  />
                  <SortableTh
                    label="Location"
                    active={sortKey === "city"}
                    dir={sortDir}
                    onClick={() => toggleSort("city")}
                  />
                  <th className="px-4 py-3 font-semibold">GSTIN</th>
                  <SortableTh
                    label="Status"
                    active={sortKey === "status"}
                    dir={sortDir}
                    onClick={() => toggleSort("status")}
                  />
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((sender) => (
                  <tr
                    key={sender.senderId}
                    className="border-t border-slate-100"
                  >
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900">
                        {sender.companyName || "—"}
                      </div>
                      <div className="mt-0.5 text-xs text-slate-500">
                        {sender.contactName || sender.name}
                        {sender.email ? ` · ${sender.email}` : ""}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {formatPhone(sender.mobile || sender.phone || "")}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {[sender.city, sender.state].filter(Boolean).join(", ") ||
                        "—"}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {sender.gstin || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                          sender.status === "ACTIVE"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {sender.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(sender)}
                          className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleStatus(sender)}
                          className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          {sender.status === "ACTIVE"
                            ? "Deactivate"
                            : "Activate"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(sender)}
                          disabled={deletingId === sender.senderId}
                          className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                          title={
                            deletingId === sender.senderId
                              ? "Deleting…"
                              : "Delete sender"
                          }
                          aria-label={`Delete ${sender.companyName || sender.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-slate-100 px-4 py-3 text-xs text-slate-500">
            Showing {filtered.length} of {items.length} senders
          </div>
        </div>
      )}

      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-[#06284c]">
                  {editing ? "Edit sender" : "Add sender"}
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
                  <span className="font-normal text-slate-400">(optional)</span>
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
                  <span className="font-normal text-slate-400">(optional)</span>
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
                  Document Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.documentType}
                  onChange={(e) => updateForm("documentType", e.target.value)}
                  className={inputClass}
                  required
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
                  Document No. <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.documentNo}
                  onChange={(e) => updateForm("documentNo", e.target.value)}
                  className={inputClass}
                  required
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
                      uploadSenderDocument(e.target.files?.[0] ?? null)
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
                    updateForm("status", e.target.value as SenderStatus)
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
                      ? "Update Sender"
                      : "Create Sender"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}