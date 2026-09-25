// // "use client";

// // import { useCallback, useEffect, useMemo, useState } from "react";
// // import {
// //   Plus,
// //   Trash2,
// //   Save,
// //   RefreshCw,
// //   Pencil,
// //   X,
// // } from "lucide-react";
// // import { useAuth } from "@/context/AuthContext";
// // import { can } from "@/lib/permissions";

// // type RateType = "FLAT" | "PER_KG";

// // type CarrierRate = {
// //   id: string;
// //   rateId: string;
// //   vendorName: string;
// //   vendorCode: string;
// //   country: string;
// //   countryCode: string;
// //   weightFrom: number;
// //   weightTo: number;
// //   rateType: RateType;
// //   price: number;
// //   currency: string;
// //   enabled: boolean;
// //   notes: string;
// // };

// // type FormState = {
// //   vendorName: string;
// //   vendorCode: string;
// //   country: string;
// //   countryCode: string;
// //   weightFrom: string;
// //   weightTo: string;
// //   rateType: RateType;
// //   price: string;
// //   currency: string;
// //   enabled: boolean;
// //   notes: string;
// // };

// // type VendorOption = { id: string; name: string; code?: string };

// // const emptyForm: FormState = {
// //   vendorName: "",
// //   vendorCode: "",
// //   country: "",
// //   countryCode: "",
// //   weightFrom: "",
// //   weightTo: "",
// //   rateType: "FLAT",
// //   price: "",
// //   currency: "INR",
// //   enabled: true,
// //   notes: "",
// // };

// // const COUNTRY_PRESETS = [
// //   { name: "USA", code: "US" },
// //   { name: "Canada", code: "CA" },
// //   { name: "Australia", code: "AU" },
// //   { name: "United Kingdom", code: "UK" },
// //   { name: "UAE", code: "AE" },
// // ];

// // export default function CarrierRatesPage() {
// //   const { firebaseUser, user, loading: authLoading } = useAuth();

// //   const permUser = {
// //     userId: user?.userId ?? "",
// //     role: user?.role ?? null,
// //   };
// //   const canManage =
// //     can(permUser, "LOGISTICS_RATE_MANAGE") ||
// //     can(permUser, "LOGISTICS_MASTERS_MANAGE");

// //   const [rows, setRows] = useState<CarrierRate[]>([]);
// //   const [vendors, setVendors] = useState<VendorOption[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const [saving, setSaving] = useState(false);
// //   const [error, setError] = useState<string | null>(null);
// //   const [message, setMessage] = useState<string | null>(null);
// //   const [editingId, setEditingId] = useState<string | null>(null);
// //   const [form, setForm] = useState<FormState>(emptyForm);
// //   const [filterVendor, setFilterVendor] = useState("");
// //   const [filterCountry, setFilterCountry] = useState("");

// //   const authHeaders = useCallback(async (): Promise<HeadersInit> => {
// //     if (!firebaseUser) throw new Error("Authentication is required.");
// //     const token = await firebaseUser.getIdToken(true);
// //     return {
// //       Accept: "application/json",
// //       "Content-Type": "application/json",
// //       Authorization: `Bearer ${token}`,
// //     };
// //   }, [firebaseUser]);

// //   const loadVendors = useCallback(async () => {
// //     if (!firebaseUser) return;
// //     try {
// //       const headers = await authHeaders();
// //       // Prefer fuel surcharge carriers (FedEx etc.), fallback masters vendors
// //       const res = await fetch("/api/logistics/settings/fuel-surcharge", {
// //         headers,
// //         credentials: "include",
// //         cache: "no-store",
// //       });
// //       const json = await res.json();
// //       if (res.ok && json.success) {
// //         const list = Array.isArray(json.data)
// //           ? json.data
// //           : json.data?.items || [];
// //         const mapped: VendorOption[] = (list as Record<string, unknown>[])
// //           .map((r) => ({
// //             id: String(r.id || ""),
// //             name: String(r.name || "").trim(),
// //             code: String(r.code || "").trim() || undefined,
// //           }))
// //           .filter((v) => v.name);
// //         if (mapped.length) {
// //           setVendors(mapped);
// //           return;
// //         }
// //       }

// //       const vRes = await fetch("/api/logistics/vendors?status=ACTIVE", {
// //         headers,
// //         credentials: "include",
// //         cache: "no-store",
// //       });
// //       const vJson = await vRes.json();
// //       if (vRes.ok && vJson.success) {
// //         const list = Array.isArray(vJson.data)
// //           ? vJson.data
// //           : vJson.data?.items || vJson.data?.vendors || [];
// //         setVendors(
// //           (list as Record<string, unknown>[])
// //             .map((r) => ({
// //               id: String(r.id || r.vendorId || ""),
// //               name: String(r.name || "").trim(),
// //               code: String(r.code || "").trim() || undefined,
// //             }))
// //             .filter((v) => v.name),
// //         );
// //       }
// //     } catch {
// //       /* ignore */
// //     }
// //   }, [firebaseUser, authHeaders]);

// //   const loadData = useCallback(async () => {
// //     if (!firebaseUser) {
// //       setError("Authentication is required.");
// //       setRows([]);
// //       setLoading(false);
// //       return;
// //     }
// //     try {
// //       setLoading(true);
// //       setError(null);
// //       const headers = await authHeaders();
// //       const res = await fetch("/api/logistics/carrier-rates", {
// //         headers,
// //         credentials: "include",
// //         cache: "no-store",
// //       });
// //       const json = await res.json();
// //       if (!res.ok || !json.success) {
// //         throw new Error(
// //           json?.error?.message || "Failed to load carrier rates",
// //         );
// //       }
// //       const list = Array.isArray(json.data)
// //         ? json.data
// //         : json.data?.items || [];
// //       setRows(list as CarrierRate[]);
// //     } catch (e) {
// //       setError(e instanceof Error ? e.message : "Failed to load data");
// //       setRows([]);
// //     } finally {
// //       setLoading(false);
// //     }
// //   }, [firebaseUser, authHeaders]);

// //   useEffect(() => {
// //     if (authLoading) return;
// //     loadData();
// //     loadVendors();
// //   }, [authLoading, loadData, loadVendors]);

// //   const filtered = useMemo(() => {
// //     return rows.filter((r) => {
// //       if (
// //         filterVendor &&
// //         !r.vendorName.toLowerCase().includes(filterVendor.toLowerCase())
// //       ) {
// //         return false;
// //       }
// //       if (
// //         filterCountry &&
// //         !`${r.country} ${r.countryCode}`
// //           .toLowerCase()
// //           .includes(filterCountry.toLowerCase())
// //       ) {
// //         return false;
// //       }
// //       return true;
// //     });
// //   }, [rows, filterVendor, filterCountry]);

// //   function startEdit(row: CarrierRate) {
// //     if (!canManage) return;
// //     setEditingId(row.id);
// //     setForm({
// //       vendorName: row.vendorName,
// //       vendorCode: row.vendorCode || "",
// //       country: row.country,
// //       countryCode: row.countryCode || "",
// //       weightFrom: String(row.weightFrom),
// //       weightTo: String(row.weightTo),
// //       rateType: row.rateType || "FLAT",
// //       price: String(row.price),
// //       currency: row.currency || "INR",
// //       enabled: row.enabled !== false,
// //       notes: row.notes || "",
// //     });
// //     setMessage(null);
// //     setError(null);
// //   }

// //   function cancelEdit() {
// //     setEditingId(null);
// //     setForm(emptyForm);
// //   }

// //   function applyCountryPreset(name: string) {
// //     const p = COUNTRY_PRESETS.find((c) => c.name === name);
// //     setForm((f) => ({
// //       ...f,
// //       country: name,
// //       countryCode: p?.code || f.countryCode,
// //     }));
// //   }

// //   function applyVendor(name: string) {
// //     const v = vendors.find((x) => x.name === name);
// //     setForm((f) => ({
// //       ...f,
// //       vendorName: name,
// //       vendorCode: v?.code || f.vendorCode,
// //     }));
// //   }

// //   async function handleSave(e: React.FormEvent) {
// //     e.preventDefault();
// //     if (!firebaseUser || !canManage) {
// //       setError("You do not have permission to manage carrier rates.");
// //       return;
// //     }
// //     try {
// //       setSaving(true);
// //       setError(null);
// //       setMessage(null);

// //       if (!form.vendorName.trim()) throw new Error("Vendor is required.");
// //       if (!form.country.trim()) throw new Error("Country is required.");
// //       const weightFrom = Number(form.weightFrom);
// //       const weightTo = Number(form.weightTo || form.weightFrom);
// //       const price = Number(form.price);
// //       if (!Number.isFinite(weightFrom) || weightFrom < 0) {
// //         throw new Error("Weight from is invalid.");
// //       }
// //       if (!Number.isFinite(weightTo) || weightTo < weightFrom) {
// //         throw new Error("Weight to must be ≥ weight from.");
// //       }
// //       if (!Number.isFinite(price) || price < 0) {
// //         throw new Error("Price is invalid.");
// //       }

// //       const headers = await authHeaders();
// //       const payload = {
// //         id: editingId || undefined,
// //         vendorName: form.vendorName.trim(),
// //         vendorCode: form.vendorCode.trim(),
// //         country: form.country.trim(),
// //         countryCode: form.countryCode.trim().toUpperCase(),
// //         weightFrom,
// //         weightTo,
// //         rateType: form.rateType,
// //         price,
// //         currency: form.currency.trim() || "INR",
// //         enabled: form.enabled,
// //         notes: form.notes.trim(),
// //       };

// //       const res = await fetch("/api/logistics/carrier-rates", {
// //         method: editingId ? "PUT" : "POST",
// //         headers,
// //         credentials: "include",
// //         body: JSON.stringify(payload),
// //       });
// //       const json = await res.json();
// //       if (!res.ok || !json.success) {
// //         throw new Error(json?.error?.message || "Save failed");
// //       }

// //       setMessage(
// //         json.message ||
// //           (editingId ? "Rate updated." : "Rate created."),
// //       );
// //       cancelEdit();
// //       await loadData();
// //     } catch (err) {
// //       setError(err instanceof Error ? err.message : "Save failed");
// //     } finally {
// //       setSaving(false);
// //     }
// //   }

// //   async function handleDelete(id: string) {
// //     if (!firebaseUser || !canManage) return;
// //     if (!window.confirm("Delete this rate row?")) return;
// //     try {
// //       const headers = await authHeaders();
// //       const res = await fetch(
// //         `/api/logistics/carrier-rates?id=${encodeURIComponent(id)}`,
// //         { method: "DELETE", headers, credentials: "include" },
// //       );
// //       const json = await res.json();
// //       if (!res.ok || !json.success) {
// //         throw new Error(json?.error?.message || "Delete failed");
// //       }
// //       setMessage("Rate deleted.");
// //       if (editingId === id) cancelEdit();
// //       await loadData();
// //     } catch (err) {
// //       setError(err instanceof Error ? err.message : "Delete failed");
// //     }
// //   }

// //   const inputCls =
// //     "w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-100";
// //   const labelCls = "mb-1.5 block text-xs font-bold text-slate-600";

// //   return (
// //     <div className="mx-auto max-w-[1200px] space-y-6">
// //       <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
// //         <div>
// //           <p className="text-xs font-bold uppercase tracking-widest text-[#087f87]">
// //             Masters
// //           </p>
// //           <h1 className="mt-1 text-2xl font-bold text-[#06284c]">
// //             Carrier Rates
// //           </h1>
// //           <p className="mt-1 text-sm text-slate-500">
// //             Weight-slab freight by vendor and country (e.g. FedEx Express USA /
// //             Canada). Use FLAT for fixed slab price; PER_KG for bands like
// //             21–40 kg.
// //           </p>
// //         </div>
// //         <button
// //           type="button"
// //           onClick={() => loadData()}
// //           disabled={loading || authLoading}
// //           className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
// //         >
// //           <RefreshCw className="h-4 w-4" />
// //           Refresh
// //         </button>
// //       </div>

// //       {error ? (
// //         <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
// //           {error}
// //         </div>
// //       ) : null}
// //       {message ? (
// //         <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
// //           {message}
// //         </div>
// //       ) : null}

// //       {canManage ? (
// //         <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
// //           <div className="mb-4 flex items-center justify-between">
// //             <h2 className="font-bold text-[#06284c]">
// //               {editingId ? "Edit rate row" : "Add rate row"}
// //             </h2>
// //             {editingId ? (
// //               <button
// //                 type="button"
// //                 onClick={cancelEdit}
// //                 className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500"
// //               >
// //                 <X className="h-3.5 w-3.5" />
// //                 Cancel
// //               </button>
// //             ) : null}
// //           </div>

// //           <form
// //             onSubmit={handleSave}
// //             className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
// //           >
// //             <div className="sm:col-span-2">
// //               <label className={labelCls}>Vendor / Carrier *</label>
// //               {vendors.length > 0 ? (
// //                 <select
// //                   value={form.vendorName}
// //                   onChange={(e) => applyVendor(e.target.value)}
// //                   className={inputCls}
// //                   required
// //                 >
// //                   <option value="">Select vendor</option>
// //                   {vendors.map((v) => (
// //                     <option key={v.id || v.name} value={v.name}>
// //                       {v.name}
// //                       {v.code ? ` (${v.code})` : ""}
// //                     </option>
// //                   ))}
// //                 </select>
// //               ) : (
// //                 <input
// //                   value={form.vendorName}
// //                   onChange={(e) =>
// //                     setForm((f) => ({ ...f, vendorName: e.target.value }))
// //                   }
// //                   placeholder="FedEx"
// //                   className={inputCls}
// //                   required
// //                 />
// //               )}
// //               <p className="mt-1 text-[11px] text-slate-400">
// //                 Vendors load from Fuel Surcharges (or Masters → Vendors).
// //               </p>
// //             </div>

// //             <div>
// //               <label className={labelCls}>Vendor code</label>
// //               <input
// //                 value={form.vendorCode}
// //                 onChange={(e) =>
// //                   setForm((f) => ({ ...f, vendorCode: e.target.value }))
// //                 }
// //                 className={inputCls}
// //                 placeholder="FDX"
// //               />
// //             </div>

// //             <div>
// //               <label className={labelCls}>Country *</label>
// //               <select
// //                 value={form.country}
// //                 onChange={(e) => {
// //                   if (
// //                     COUNTRY_PRESETS.some((c) => c.name === e.target.value)
// //                   ) {
// //                     applyCountryPreset(e.target.value);
// //                   } else {
// //                     setForm((f) => ({ ...f, country: e.target.value }));
// //                   }
// //                 }}
// //                 className={inputCls}
// //                 required
// //               >
// //                 <option value="">Select country</option>
// //                 {COUNTRY_PRESETS.map((c) => (
// //                   <option key={c.code} value={c.name}>
// //                     {c.name}
// //                   </option>
// //                 ))}
// //               </select>
// //             </div>

// //             <div>
// //               <label className={labelCls}>Country code</label>
// //               <input
// //                 value={form.countryCode}
// //                 onChange={(e) =>
// //                   setForm((f) => ({
// //                     ...f,
// //                     countryCode: e.target.value.toUpperCase(),
// //                   }))
// //                 }
// //                 className={inputCls}
// //                 placeholder="US"
// //               />
// //             </div>

// //             <div>
// //               <label className={labelCls}>Weight from (kg) *</label>
// //               <input
// //                 type="number"
// //                 min={0}
// //                 step="0.5"
// //                 value={form.weightFrom}
// //                 onChange={(e) =>
// //                   setForm((f) => ({
// //                     ...f,
// //                     weightFrom: e.target.value,
// //                     weightTo: f.weightTo || e.target.value,
// //                   }))
// //                 }
// //                 className={inputCls}
// //                 required
// //                 placeholder="0.5"
// //               />
// //             </div>

// //             <div>
// //               <label className={labelCls}>Weight to (kg) *</label>
// //               <input
// //                 type="number"
// //                 min={0}
// //                 step="0.5"
// //                 value={form.weightTo}
// //                 onChange={(e) =>
// //                   setForm((f) => ({ ...f, weightTo: e.target.value }))
// //                 }
// //                 className={inputCls}
// //                 required
// //                 placeholder="0.5 or 40 for band"
// //               />
// //             </div>

// //             <div>
// //               <label className={labelCls}>Rate type *</label>
// //               <select
// //                 value={form.rateType}
// //                 onChange={(e) =>
// //                   setForm((f) => ({
// //                     ...f,
// //                     rateType: e.target.value as RateType,
// //                   }))
// //                 }
// //                 className={inputCls}
// //               >
// //                 <option value="FLAT">FLAT (total for slab)</option>
// //                 <option value="PER_KG">PER_KG (× chargeable kg)</option>
// //               </select>
// //             </div>

// //             <div>
// //               <label className={labelCls}>Price (₹) *</label>
// //               <input
// //                 type="number"
// //                 min={0}
// //                 step="0.01"
// //                 value={form.price}
// //                 onChange={(e) =>
// //                   setForm((f) => ({ ...f, price: e.target.value }))
// //                 }
// //                 className={inputCls}
// //                 required
// //                 placeholder="2110"
// //               />
// //             </div>

// //             <div className="flex items-end">
// //               <label className="flex items-center gap-2 text-sm font-medium">
// //                 <input
// //                   type="checkbox"
// //                   checked={form.enabled}
// //                   onChange={(e) =>
// //                     setForm((f) => ({ ...f, enabled: e.target.checked }))
// //                   }
// //                   className="h-4 w-4"
// //                 />
// //                 Active
// //               </label>
// //             </div>

// //             <div className="sm:col-span-2 lg:col-span-3">
// //               <label className={labelCls}>Notes</label>
// //               <input
// //                 value={form.notes}
// //                 onChange={(e) =>
// //                   setForm((f) => ({ ...f, notes: e.target.value }))
// //                 }
// //                 className={inputCls}
// //                 placeholder="Optional"
// //               />
// //             </div>

// //             <div className="flex items-end">
// //               <button
// //                 type="submit"
// //                 disabled={saving}
// //                 className="inline-flex items-center gap-2 rounded-lg bg-[#087f87] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60"
// //               >
// //                 {editingId ? (
// //                   <Save className="h-4 w-4" />
// //                 ) : (
// //                   <Plus className="h-4 w-4" />
// //                 )}
// //                 {saving
// //                   ? "Saving…"
// //                   : editingId
// //                     ? "Update row"
// //                     : "Add row"}
// //               </button>
// //             </div>
// //           </form>

// //           <p className="mt-3 text-xs text-slate-500">
// //             Example: USA 0.5–0.5 FLAT ₹2110 · Canada 5–5 FLAT ₹5060 · USA
// //             21–40 PER_KG ₹767 · USA 45–70 PER_KG ₹765
// //           </p>
// //         </section>
// //       ) : (
// //         <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
// //           View only — rate manage / masters manage permission required.
// //         </div>
// //       )}

// //       <div className="flex flex-wrap gap-3">
// //         <input
// //           value={filterVendor}
// //           onChange={(e) => setFilterVendor(e.target.value)}
// //           placeholder="Filter vendor…"
// //           className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
// //         />
// //         <input
// //           value={filterCountry}
// //           onChange={(e) => setFilterCountry(e.target.value)}
// //           placeholder="Filter country…"
// //           className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
// //         />
// //       </div>

// //       <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
// //         <div className="border-b border-slate-100 px-5 py-4">
// //           <h2 className="font-bold text-[#06284c]">
// //             Rate table
// //             <span className="ml-2 text-xs font-normal text-slate-400">
// //               {filtered.length} row(s)
// //             </span>
// //           </h2>
// //         </div>

// //         {loading || authLoading ? (
// //           <div className="py-16 text-center text-sm text-slate-500">
// //             Loading…
// //           </div>
// //         ) : filtered.length === 0 ? (
// //           <div className="px-5 py-16 text-center text-sm text-slate-500">
// //             No carrier rates yet. Add rows matching your FedEx sheet.
// //           </div>
// //         ) : (
// //           <div className="overflow-x-auto">
// //             <table className="w-full min-w-[900px] text-left text-sm">
// //               <thead className="bg-slate-50 text-xs uppercase text-slate-500">
// //                 <tr>
// //                   <th className="px-4 py-3">Vendor</th>
// //                   <th className="px-4 py-3">Country</th>
// //                   <th className="px-4 py-3">Weight (kg)</th>
// //                   <th className="px-4 py-3">Type</th>
// //                   <th className="px-4 py-3">Price</th>
// //                   <th className="px-4 py-3">Status</th>
// //                   {canManage ? <th className="px-4 py-3">Actions</th> : null}
// //                 </tr>
// //               </thead>
// //               <tbody className="divide-y divide-slate-100">
// //                 {filtered.map((row) => (
// //                   <tr key={row.id} className="hover:bg-slate-50/50">
// //                     <td className="px-4 py-3 font-semibold text-slate-800">
// //                       {row.vendorName}
// //                       {row.vendorCode ? (
// //                         <span className="ml-1 text-xs text-slate-400">
// //                           ({row.vendorCode})
// //                         </span>
// //                       ) : null}
// //                     </td>
// //                     <td className="px-4 py-3">
// //                       {row.country}
// //                       {row.countryCode ? ` (${row.countryCode})` : ""}
// //                     </td>
// //                     <td className="px-4 py-3">
// //                       {row.weightFrom === row.weightTo
// //                         ? row.weightFrom
// //                         : `${row.weightFrom} – ${row.weightTo}`}
// //                     </td>
// //                     <td className="px-4 py-3">{row.rateType}</td>
// //                     <td className="px-4 py-3 font-semibold">
// //                       ₹{Number(row.price).toLocaleString("en-IN")}
// //                       {row.rateType === "PER_KG" ? "/kg" : ""}
// //                     </td>
// //                     <td className="px-4 py-3">
// //                       <span
// //                         className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
// //                           row.enabled
// //                             ? "bg-emerald-100 text-emerald-700"
// //                             : "bg-slate-100 text-slate-500"
// //                         }`}
// //                       >
// //                         {row.enabled ? "Active" : "Disabled"}
// //                       </span>
// //                     </td>
// //                     {canManage ? (
// //                       <td className="px-4 py-3">
// //                         <div className="flex gap-1">
// //                           <button
// //                             type="button"
// //                             onClick={() => startEdit(row)}
// //                             className="rounded p-1.5 text-slate-500 hover:bg-slate-100"
// //                           >
// //                             <Pencil className="h-4 w-4" />
// //                           </button>
// //                           <button
// //                             type="button"
// //                             onClick={() => handleDelete(row.id)}
// //                             className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
// //                           >
// //                             <Trash2 className="h-4 w-4" />
// //                           </button>
// //                         </div>
// //                       </td>
// //                     ) : null}
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //           </div>
// //         )}
// //       </section>
// //     </div>
// //   );
// // }

// "use client";

// import { useCallback, useEffect, useMemo, useState } from "react";
// import {
//   Plus,
//   Trash2,
//   Save,
//   RefreshCw,
//   Pencil,
//   X,
// } from "lucide-react";
// import { useAuth } from "@/context/AuthContext";
// import { can } from "@/lib/permissions";

// type RateType = "FLAT" | "PER_KG";

// type CarrierRate = {
//   id: string;
//   rateId: string;
//   vendorName: string;
//   vendorCode: string;
//   country: string;
//   countryCode: string;
//   weightFrom: number;
//   weightTo: number;
//   rateType: RateType;
//   price: number;
//   currency: string;
//   enabled: boolean;
//   notes: string;
// };

// type FormState = {
//   vendorName: string;
//   vendorCode: string;
//   country: string;
//   countryCode: string;
//   weightFrom: string;
//   weightTo: string;
//   rateType: RateType;
//   price: string;
//   currency: string;
//   enabled: boolean;
//   notes: string;
// };

// type VendorOption = { id: string; name: string; code?: string };
// type CountryOption = { id: string; name: string; code: string };

// const emptyForm: FormState = {
//   vendorName: "",
//   vendorCode: "",
//   country: "",
//   countryCode: "",
//   weightFrom: "",
//   weightTo: "",
//   rateType: "FLAT",
//   price: "",
//   currency: "INR",
//   enabled: true,
//   notes: "",
// };

// export default function CarrierRatesPage() {
//   const { firebaseUser, user, loading: authLoading } = useAuth();

//   const permUser = {
//     userId: user?.userId ?? "",
//     role: user?.role ?? null,
//   };
//   const canManage =
//     can(permUser, "LOGISTICS_RATE_MANAGE") ||
//     can(permUser, "LOGISTICS_MASTERS_MANAGE");

//   const [rows, setRows] = useState<CarrierRate[]>([]);
//   const [vendors, setVendors] = useState<VendorOption[]>([]);
//   const [countries, setCountries] = useState<CountryOption[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [message, setMessage] = useState<string | null>(null);
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [form, setForm] = useState<FormState>(emptyForm);
//   const [filterVendor, setFilterVendor] = useState("");
//   const [filterCountry, setFilterCountry] = useState("");

//   const authHeaders = useCallback(async (): Promise<HeadersInit> => {
//     if (!firebaseUser) throw new Error("Authentication is required.");
//     const token = await firebaseUser.getIdToken(true);
//     return {
//       Accept: "application/json",
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     };
//   }, [firebaseUser]);

//   const loadVendors = useCallback(async () => {
//     if (!firebaseUser) return;
//     try {
//       const headers = await authHeaders();
//       const res = await fetch("/api/logistics/settings/fuel-surcharge", {
//         headers,
//         credentials: "include",
//         cache: "no-store",
//       });
//       const json = await res.json();
//       if (res.ok && json.success) {
//         const list = Array.isArray(json.data)
//           ? json.data
//           : json.data?.items || [];
//         const mapped: VendorOption[] = (list as Record<string, unknown>[])
//           .map((r) => ({
//             id: String(r.id || ""),
//             name: String(r.name || "").trim(),
//             code: String(r.code || "").trim() || undefined,
//           }))
//           .filter((v) => v.name);
//         if (mapped.length) {
//           setVendors(mapped);
//           return;
//         }
//       }

//       const vRes = await fetch("/api/logistics/vendors?status=ACTIVE", {
//         headers,
//         credentials: "include",
//         cache: "no-store",
//       });
//       const vJson = await vRes.json();
//       if (vRes.ok && vJson.success) {
//         const list = Array.isArray(vJson.data)
//           ? vJson.data
//           : vJson.data?.items || vJson.data?.vendors || [];
//         setVendors(
//           (list as Record<string, unknown>[])
//             .map((r) => ({
//               id: String(r.id || r.vendorId || ""),
//               name: String(r.name || "").trim(),
//               code: String(r.code || "").trim() || undefined,
//             }))
//             .filter((v) => v.name),
//         );
//       }
//     } catch {
//       /* ignore */
//     }
//   }, [firebaseUser, authHeaders]);

//   const loadCountries = useCallback(async () => {
//     if (!firebaseUser) return;
//     try {
//       const headers = await authHeaders();
//       const res = await fetch("/api/logistics/masters/countries", {
//         headers,
//         credentials: "include",
//         cache: "no-store",
//       });
//       const json = await res.json();
//       if (!res.ok || !json.success) return;
//       const list = Array.isArray(json.data?.items)
//         ? json.data.items
//         : Array.isArray(json.data?.countries)
//           ? json.data.countries
//           : Array.isArray(json.data)
//             ? json.data
//             : [];
//       setCountries(
//         (list as Record<string, unknown>[])
//           .map((r) => ({
//             id: String(r.id || ""),
//             name: String(r.name || "").trim(),
//             code: String(r.code || "").trim().toUpperCase(),
//           }))
//           .filter((c) => c.name),
//       );
//     } catch {
//       /* ignore */
//     }
//   }, [firebaseUser, authHeaders]);

//   const loadData = useCallback(async () => {
//     if (!firebaseUser) {
//       setError("Authentication is required.");
//       setRows([]);
//       setLoading(false);
//       return;
//     }
//     try {
//       setLoading(true);
//       setError(null);
//       const headers = await authHeaders();
//       const res = await fetch("/api/logistics/carrier-rates", {
//         headers,
//         credentials: "include",
//         cache: "no-store",
//       });
//       const json = await res.json();
//       if (!res.ok || !json.success) {
//         throw new Error(
//           json?.error?.message || "Failed to load carrier rates",
//         );
//       }
//       const list = Array.isArray(json.data)
//         ? json.data
//         : json.data?.items || [];
//       setRows(list as CarrierRate[]);
//     } catch (e) {
//       setError(e instanceof Error ? e.message : "Failed to load data");
//       setRows([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [firebaseUser, authHeaders]);

//   useEffect(() => {
//     if (authLoading) return;
//     loadData();
//     loadVendors();
//     loadCountries();
//   }, [authLoading, loadData, loadVendors, loadCountries]);

//   const filtered = useMemo(() => {
//     return rows.filter((r) => {
//       if (
//         filterVendor &&
//         !r.vendorName.toLowerCase().includes(filterVendor.toLowerCase())
//       ) {
//         return false;
//       }
//       if (
//         filterCountry &&
//         !`${r.country} ${r.countryCode}`
//           .toLowerCase()
//           .includes(filterCountry.toLowerCase())
//       ) {
//         return false;
//       }
//       return true;
//     });
//   }, [rows, filterVendor, filterCountry]);

//   function startEdit(row: CarrierRate) {
//     if (!canManage) return;
//     setEditingId(row.id);
//     setForm({
//       vendorName: row.vendorName,
//       vendorCode: row.vendorCode || "",
//       country: row.country,
//       countryCode: row.countryCode || "",
//       weightFrom: String(row.weightFrom),
//       weightTo: String(row.weightTo),
//       rateType: row.rateType || "FLAT",
//       price: String(row.price),
//       currency: row.currency || "INR",
//       enabled: row.enabled !== false,
//       notes: row.notes || "",
//     });
//     setMessage(null);
//     setError(null);
//   }

//   function cancelEdit() {
//     setEditingId(null);
//     setForm(emptyForm);
//   }

//   function applyCountry(name: string) {
//     const c = countries.find((x) => x.name === name);
//     setForm((f) => ({
//       ...f,
//       country: name,
//       countryCode: c?.code || f.countryCode,
//     }));
//   }

//   function applyVendor(name: string) {
//     const v = vendors.find((x) => x.name === name);
//     setForm((f) => ({
//       ...f,
//       vendorName: name,
//       vendorCode: v?.code || f.vendorCode,
//     }));
//   }

//   async function handleSave(e: React.FormEvent) {
//     e.preventDefault();
//     if (!firebaseUser || !canManage) {
//       setError("You do not have permission to manage carrier rates.");
//       return;
//     }
//     try {
//       setSaving(true);
//       setError(null);
//       setMessage(null);

//       if (!form.vendorName.trim()) throw new Error("Vendor is required.");
//       if (!form.country.trim()) throw new Error("Country is required.");
//       const weightFrom = Number(form.weightFrom);
//       const weightTo = Number(form.weightTo || form.weightFrom);
//       const price = Number(form.price);
//       if (!Number.isFinite(weightFrom) || weightFrom < 0) {
//         throw new Error("Weight from is invalid.");
//       }
//       if (!Number.isFinite(weightTo) || weightTo < weightFrom) {
//         throw new Error("Weight to must be ≥ weight from.");
//       }
//       if (!Number.isFinite(price) || price < 0) {
//         throw new Error("Price is invalid.");
//       }

//       const headers = await authHeaders();
//       const payload = {
//         id: editingId || undefined,
//         vendorName: form.vendorName.trim(),
//         vendorCode: form.vendorCode.trim(),
//         country: form.country.trim(),
//         countryCode: form.countryCode.trim().toUpperCase(),
//         weightFrom,
//         weightTo,
//         rateType: form.rateType,
//         price,
//         currency: form.currency.trim() || "INR",
//         enabled: form.enabled,
//         notes: form.notes.trim(),
//       };

//       const res = await fetch("/api/logistics/carrier-rates", {
//         method: editingId ? "PUT" : "POST",
//         headers,
//         credentials: "include",
//         body: JSON.stringify(payload),
//       });
//       const json = await res.json();
//       if (!res.ok || !json.success) {
//         throw new Error(json?.error?.message || "Save failed");
//       }

//       setMessage(
//         json.message ||
//           (editingId ? "Rate updated." : "Rate created."),
//       );
//       cancelEdit();
//       await loadData();
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Save failed");
//     } finally {
//       setSaving(false);
//     }
//   }

//   async function handleDelete(id: string) {
//     if (!firebaseUser || !canManage) return;
//     if (!window.confirm("Delete this rate row?")) return;
//     try {
//       const headers = await authHeaders();
//       const res = await fetch(
//         `/api/logistics/carrier-rates?id=${encodeURIComponent(id)}`,
//         { method: "DELETE", headers, credentials: "include" },
//       );
//       const json = await res.json();
//       if (!res.ok || !json.success) {
//         throw new Error(json?.error?.message || "Delete failed");
//       }
//       setMessage("Rate deleted.");
//       if (editingId === id) cancelEdit();
//       await loadData();
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Delete failed");
//     }
//   }

//   const inputCls =
//     "w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-100";
//   const labelCls = "mb-1.5 block text-xs font-bold text-slate-600";

//   return (
//     <div className="mx-auto max-w-[1200px] space-y-6">
//       <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
//         <div>
//           <p className="text-xs font-bold uppercase tracking-widest text-[#087f87]">
//             Masters
//           </p>
//           <h1 className="mt-1 text-2xl font-bold text-[#06284c]">
//             Carrier Rates
//           </h1>
//           <p className="mt-1 text-sm text-slate-500">
//             Weight-slab freight by vendor and country (e.g. FedEx Express USA /
//             Canada). Use FLAT for fixed slab price; PER_KG for bands like
//             21–40 kg.
//           </p>
//         </div>
//         <button
//           type="button"
//           onClick={() => loadData()}
//           disabled={loading || authLoading}
//           className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
//         >
//           <RefreshCw className="h-4 w-4" />
//           Refresh
//         </button>
//       </div>

//       {error ? (
//         <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//           {error}
//         </div>
//       ) : null}
//       {message ? (
//         <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
//           {message}
//         </div>
//       ) : null}

//       {canManage ? (
//         <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
//           <div className="mb-4 flex items-center justify-between">
//             <h2 className="font-bold text-[#06284c]">
//               {editingId ? "Edit rate row" : "Add rate row"}
//             </h2>
//             {editingId ? (
//               <button
//                 type="button"
//                 onClick={cancelEdit}
//                 className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500"
//               >
//                 <X className="h-3.5 w-3.5" />
//                 Cancel
//               </button>
//             ) : null}
//           </div>

//           <form
//             onSubmit={handleSave}
//             className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
//           >
//             <div className="sm:col-span-2">
//               <label className={labelCls}>Vendor / Carrier *</label>
//               {vendors.length > 0 ? (
//                 <select
//                   value={form.vendorName}
//                   onChange={(e) => applyVendor(e.target.value)}
//                   className={inputCls}
//                   required
//                 >
//                   <option value="">Select vendor</option>
//                   {vendors.map((v) => (
//                     <option key={v.id || v.name} value={v.name}>
//                       {v.name}
//                       {v.code ? ` (${v.code})` : ""}
//                     </option>
//                   ))}
//                 </select>
//               ) : (
//                 <input
//                   value={form.vendorName}
//                   onChange={(e) =>
//                     setForm((f) => ({ ...f, vendorName: e.target.value }))
//                   }
//                   placeholder="FedEx"
//                   className={inputCls}
//                   required
//                 />
//               )}
//               <p className="mt-1 text-[11px] text-slate-400">
//                 Vendors load from Fuel Surcharges (or Masters → Vendors).
//               </p>
//             </div>

//             <div>
//               <label className={labelCls}>Vendor code</label>
//               <input
//                 value={form.vendorCode}
//                 onChange={(e) =>
//                   setForm((f) => ({ ...f, vendorCode: e.target.value }))
//                 }
//                 className={inputCls}
//                 placeholder="FDX"
//               />
//             </div>

//             <div>
//               <label className={labelCls}>Country *</label>
//               {countries.length > 0 ? (
//                 <select
//                   value={form.country}
//                   onChange={(e) => applyCountry(e.target.value)}
//                   className={inputCls}
//                   required
//                 >
//                   <option value="">Select country</option>
//                   {countries.map((c) => (
//                     <option key={c.id || c.code} value={c.name}>
//                       {c.name}
//                       {c.code ? ` (${c.code})` : ""}
//                     </option>
//                   ))}
//                 </select>
//               ) : (
//                 <input
//                   value={form.country}
//                   onChange={(e) =>
//                     setForm((f) => ({ ...f, country: e.target.value }))
//                   }
//                   className={inputCls}
//                   required
//                   placeholder="USA"
//                 />
//               )}
//               <p className="mt-1 text-[11px] text-slate-400">
//                 From Masters → Countries.
//               </p>
//             </div>

//             <div>
//               <label className={labelCls}>Country code</label>
//               <input
//                 value={form.countryCode}
//                 onChange={(e) =>
//                   setForm((f) => ({
//                     ...f,
//                     countryCode: e.target.value.toUpperCase(),
//                   }))
//                 }
//                 className={inputCls}
//                 placeholder="US"
//               />
//             </div>

//             <div>
//               <label className={labelCls}>Weight from (kg) *</label>
//               <input
//                 type="number"
//                 min={0}
//                 step="0.5"
//                 value={form.weightFrom}
//                 onChange={(e) =>
//                   setForm((f) => ({
//                     ...f,
//                     weightFrom: e.target.value,
//                     // single-weight convenience: keep To in sync when empty
//                     weightTo: f.weightTo || e.target.value,
//                   }))
//                 }
//                 className={inputCls}
//                 required
//                 placeholder="0.5"
//               />
//             </div>

//             <div>
//               <label className={labelCls}>Weight to (kg) *</label>
//               <input
//                 type="number"
//                 min={0}
//                 step="0.5"
//                 value={form.weightTo}
//                 onChange={(e) =>
//                   setForm((f) => ({ ...f, weightTo: e.target.value }))
//                 }
//                 className={inputCls}
//                 required
//                 placeholder="0.5 or 40 for band"
//               />
//             </div>

//             <div>
//               <label className={labelCls}>Rate type *</label>
//               <select
//                 value={form.rateType}
//                 onChange={(e) =>
//                   setForm((f) => ({
//                     ...f,
//                     rateType: e.target.value as RateType,
//                   }))
//                 }
//                 className={inputCls}
//               >
//                 <option value="FLAT">FLAT (total for slab)</option>
//                 <option value="PER_KG">PER_KG (× chargeable kg)</option>
//               </select>
//             </div>

//             <div>
//               <label className={labelCls}>Price (₹) *</label>
//               <input
//                 type="number"
//                 min={0}
//                 step="0.01"
//                 value={form.price}
//                 onChange={(e) =>
//                   setForm((f) => ({ ...f, price: e.target.value }))
//                 }
//                 className={inputCls}
//                 required
//                 placeholder="2110"
//               />
//             </div>

//             <div className="flex items-end">
//               <label className="flex items-center gap-2 text-sm font-medium">
//                 <input
//                   type="checkbox"
//                   checked={form.enabled}
//                   onChange={(e) =>
//                     setForm((f) => ({ ...f, enabled: e.target.checked }))
//                   }
//                   className="h-4 w-4"
//                 />
//                 Active
//               </label>
//             </div>

//             <div className="sm:col-span-2 lg:col-span-3">
//               <label className={labelCls}>Notes</label>
//               <input
//                 value={form.notes}
//                 onChange={(e) =>
//                   setForm((f) => ({ ...f, notes: e.target.value }))
//                 }
//                 className={inputCls}
//                 placeholder="Optional"
//               />
//             </div>

//             <div className="flex items-end">
//               <button
//                 type="submit"
//                 disabled={saving}
//                 className="inline-flex items-center gap-2 rounded-lg bg-[#087f87] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60"
//               >
//                 {editingId ? (
//                   <Save className="h-4 w-4" />
//                 ) : (
//                   <Plus className="h-4 w-4" />
//                 )}
//                 {saving
//                   ? "Saving…"
//                   : editingId
//                     ? "Update row"
//                     : "Add row"}
//               </button>
//             </div>
//           </form>

//           <p className="mt-3 text-xs text-slate-500">
//             Example: USA 0.5–0.5 FLAT ₹2110 · Canada 5–5 FLAT ₹5060 · USA
//             21–40 PER_KG ₹767 · USA 45–70 PER_KG ₹765
//           </p>
//         </section>
//       ) : (
//         <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
//           View only — rate manage / masters manage permission required.
//         </div>
//       )}

//       <div className="flex flex-wrap gap-3">
//         <input
//           value={filterVendor}
//           onChange={(e) => setFilterVendor(e.target.value)}
//           placeholder="Filter vendor…"
//           className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
//         />
//         <input
//           value={filterCountry}
//           onChange={(e) => setFilterCountry(e.target.value)}
//           placeholder="Filter country…"
//           className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
//         />
//       </div>

//       <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
//         <div className="border-b border-slate-100 px-5 py-4">
//           <h2 className="font-bold text-[#06284c]">
//             Rate table
//             <span className="ml-2 text-xs font-normal text-slate-400">
//               {filtered.length} row(s)
//             </span>
//           </h2>
//         </div>

//         {loading || authLoading ? (
//           <div className="py-16 text-center text-sm text-slate-500">
//             Loading…
//           </div>
//         ) : filtered.length === 0 ? (
//           <div className="px-5 py-16 text-center text-sm text-slate-500">
//             No carrier rates yet. Add rows matching your FedEx sheet.
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full min-w-[900px] text-left text-sm">
//               <thead className="bg-slate-50 text-xs uppercase text-slate-500">
//                 <tr>
//                   <th className="px-4 py-3">Vendor</th>
//                   <th className="px-4 py-3">Country</th>
//                   <th className="px-4 py-3">Weight (kg)</th>
//                   <th className="px-4 py-3">Type</th>
//                   <th className="px-4 py-3">Price</th>
//                   <th className="px-4 py-3">Status</th>
//                   {canManage ? <th className="px-4 py-3">Actions</th> : null}
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-100">
//                 {filtered.map((row) => (
//                   <tr key={row.id} className="hover:bg-slate-50/50">
//                     <td className="px-4 py-3 font-semibold text-slate-800">
//                       {row.vendorName}
//                       {row.vendorCode ? (
//                         <span className="ml-1 text-xs text-slate-400">
//                           ({row.vendorCode})
//                         </span>
//                       ) : null}
//                     </td>
//                     <td className="px-4 py-3">
//                       {row.country}
//                       {row.countryCode ? ` (${row.countryCode})` : ""}
//                     </td>
//                     <td className="px-4 py-3">
//                       {row.weightFrom === row.weightTo
//                         ? row.weightFrom
//                         : `${row.weightFrom} – ${row.weightTo}`}
//                     </td>
//                     <td className="px-4 py-3">{row.rateType}</td>
//                     <td className="px-4 py-3 font-semibold">
//                       ₹{Number(row.price).toLocaleString("en-IN")}
//                       {row.rateType === "PER_KG" ? "/kg" : ""}
//                     </td>
//                     <td className="px-4 py-3">
//                       <span
//                         className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
//                           row.enabled
//                             ? "bg-emerald-100 text-emerald-700"
//                             : "bg-slate-100 text-slate-500"
//                         }`}
//                       >
//                         {row.enabled ? "Active" : "Disabled"}
//                       </span>
//                     </td>
//                     {canManage ? (
//                       <td className="px-4 py-3">
//                         <div className="flex gap-1">
//                           <button
//                             type="button"
//                             onClick={() => startEdit(row)}
//                             className="rounded p-1.5 text-slate-500 hover:bg-slate-100"
//                           >
//                             <Pencil className="h-4 w-4" />
//                           </button>
//                           <button
//                             type="button"
//                             onClick={() => handleDelete(row.id)}
//                             className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
//                           >
//                             <Trash2 className="h-4 w-4" />
//                           </button>
//                         </div>
//                       </td>
//                     ) : null}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </section>
//     </div>
//   );
// }

// "use client";

// import { useCallback, useEffect, useMemo, useState } from "react";
// import {
//   Plus,
//   Trash2,
//   Save,
//   RefreshCw,
//   Pencil,
//   X,
// } from "lucide-react";
// import { useAuth } from "@/context/AuthContext";
// import { can } from "@/lib/permissions";

// type RateType = "FLAT" | "PER_KG";

// type CarrierRate = {
//   id: string;
//   rateId: string;
//   vendorName: string;
//   vendorCode: string;
//   country: string;
//   countryCode: string;
//   weightFrom: number;
//   weightTo: number;
//   rateType: RateType;
//   price: number;
//   currency: string;
//   enabled: boolean;
//   notes: string;
// };

// type FormState = {
//   vendorName: string;
//   vendorCode: string;
//   country: string;
//   countryCode: string;
//   weightFrom: string;
//   weightTo: string;
//   rateType: RateType;
//   price: string;
//   currency: string;
//   enabled: boolean;
//   notes: string;
// };

// type VendorOption = { id: string; name: string; code?: string };
// type CountryOption = { id: string; name: string; code: string };

// const emptyForm: FormState = {
//   vendorName: "",
//   vendorCode: "",
//   country: "",
//   countryCode: "",
//   weightFrom: "",
//   weightTo: "",
//   rateType: "FLAT",
//   price: "",
//   currency: "INR",
//   enabled: true,
//   notes: "",
// };

// /** Derive a short code when master has no code field (common for fuel surcharges) */
// function deriveVendorCode(name: string, existing?: string): string {
//   const fromMaster = String(existing || "").trim().toUpperCase();
//   if (fromMaster) return fromMaster;

//   const base = String(name || "")
//     .split(" (")[0]
//     .trim()
//     .toUpperCase()
//     .replace(/[^A-Z0-9]/g, "");

//   return base.slice(0, 8);
// }

// function normalizeVendorName(name: string): string {
//   return String(name || "")
//     .split(" (")[0]
//     .trim()
//     .toUpperCase();
// }

// export default function CarrierRatesPage() {
//   const { firebaseUser, user, loading: authLoading } = useAuth();

//   const permUser = {
//     userId: user?.userId ?? "",
//     role: user?.role ?? null,
//   };
//   const canManage =
//     can(permUser, "LOGISTICS_RATE_MANAGE") ||
//     can(permUser, "LOGISTICS_MASTERS_MANAGE");

//   const [rows, setRows] = useState<CarrierRate[]>([]);
//   const [vendors, setVendors] = useState<VendorOption[]>([]);
//   const [countries, setCountries] = useState<CountryOption[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [message, setMessage] = useState<string | null>(null);
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [form, setForm] = useState<FormState>(emptyForm);
//   const [filterVendor, setFilterVendor] = useState("");
//   const [filterCountry, setFilterCountry] = useState("");

//   const authHeaders = useCallback(async (): Promise<HeadersInit> => {
//     if (!firebaseUser) throw new Error("Authentication is required.");
//     const token = await firebaseUser.getIdToken(true);
//     return {
//       Accept: "application/json",
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     };
//   }, [firebaseUser]);

//   const loadVendors = useCallback(async () => {
//     if (!firebaseUser) return;
//     try {
//       const headers = await authHeaders();

//       // 1) Fuel surcharges (primary — same names used on booking)
//       const res = await fetch("/api/logistics/settings/fuel-surcharge", {
//         headers,
//         credentials: "include",
//         cache: "no-store",
//       });
//       const json = await res.json();
//       if (res.ok && json.success) {
//         const list = Array.isArray(json.data)
//           ? json.data
//           : json.data?.items || [];
//         const mapped: VendorOption[] = (list as Record<string, unknown>[])
//           .map((r) => {
//             const name = String(r.name || "").trim();
//             const code = deriveVendorCode(
//               name,
//               String(r.code || r.vendorCode || ""),
//             );
//             return {
//               id: String(r.id || name),
//               name,
//               code: code || undefined,
//             };
//           })
//           .filter((v) => v.name);

//         if (mapped.length) {
//           setVendors(mapped);
//           return;
//         }
//       }

//       // 2) Fallback: masters vendors
//       const vRes = await fetch("/api/logistics/vendors?status=ACTIVE", {
//         headers,
//         credentials: "include",
//         cache: "no-store",
//       });
//       const vJson = await vRes.json();
//       if (vRes.ok && vJson.success) {
//         const list = Array.isArray(vJson.data)
//           ? vJson.data
//           : vJson.data?.items || vJson.data?.vendors || [];
//         setVendors(
//           (list as Record<string, unknown>[])
//             .map((r) => {
//               const name = String(r.name || "").trim();
//               return {
//                 id: String(r.id || r.vendorId || name),
//                 name,
//                 code:
//                   deriveVendorCode(
//                     name,
//                     String(r.code || r.vendorCode || ""),
//                   ) || undefined,
//               };
//             })
//             .filter((v) => v.name),
//         );
//       }
//     } catch {
//       /* ignore */
//     }
//   }, [firebaseUser, authHeaders]);

//   const loadCountries = useCallback(async () => {
//     if (!firebaseUser) return;
//     try {
//       const headers = await authHeaders();
//       const res = await fetch("/api/logistics/masters/countries", {
//         headers,
//         credentials: "include",
//         cache: "no-store",
//       });
//       const json = await res.json();
//       if (!res.ok || !json.success) return;

//       const list = Array.isArray(json.data?.items)
//         ? json.data.items
//         : Array.isArray(json.data?.countries)
//           ? json.data.countries
//           : Array.isArray(json.data)
//             ? json.data
//             : [];

//     //   setCountries(
//     //     (list as Record<string, unknown>[])
//     //       .map((r) => {
//     //         const name = String(r.name || "").trim();
//     //         const code = String(r.code || "")
//     //           .trim()
//     //           .toUpperCase();
//     //         return {
//     //           id: String(r.id || code || name),
//     //           name,
//     //           code,
//     //         };
//     //       })
//     //       .filter((c) => c.name && c.enabled !== false),
//     //   );

//     setCountries(
//   (list as Record<string, unknown>[])
//     .filter((r) => {
//       const name = String(r.name || "").trim();
//       if (!name) return false;
//       // raw docs may have enabled; treat missing as active
//       if (r.enabled === false) return false;
//       const status = String(r.status || "ACTIVE").toUpperCase();
//       if (status === "INACTIVE") return false;
//       return true;
//     })
//     .map((r) => {
//       const name = String(r.name || "").trim();
//       const code = String(r.code || "")
//         .trim()
//         .toUpperCase();
//       return {
//         id: String(r.id || code || name),
//         name,
//         code,
//       };
//     }),
// );
//     } catch {
//       /* ignore */
//     }
//   }, [firebaseUser, authHeaders]);

//   const loadData = useCallback(async () => {
//     if (!firebaseUser) {
//       setError("Authentication is required.");
//       setRows([]);
//       setLoading(false);
//       return;
//     }
//     try {
//       setLoading(true);
//       setError(null);
//       const headers = await authHeaders();
//       const res = await fetch("/api/logistics/carrier-rates", {
//         headers,
//         credentials: "include",
//         cache: "no-store",
//       });
//       const json = await res.json();
//       if (!res.ok || !json.success) {
//         throw new Error(
//           json?.error?.message || "Failed to load carrier rates",
//         );
//       }
//       const list = Array.isArray(json.data)
//         ? json.data
//         : json.data?.items || [];
//       setRows(list as CarrierRate[]);
//     } catch (e) {
//       setError(e instanceof Error ? e.message : "Failed to load data");
//       setRows([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [firebaseUser, authHeaders]);

//   useEffect(() => {
//     if (authLoading) return;
//     loadData();
//     loadVendors();
//     loadCountries();
//   }, [authLoading, loadData, loadVendors, loadCountries]);

//   const filtered = useMemo(() => {
//     return rows.filter((r) => {
//       if (
//         filterVendor &&
//         !r.vendorName.toLowerCase().includes(filterVendor.toLowerCase())
//       ) {
//         return false;
//       }
//       if (
//         filterCountry &&
//         !`${r.country} ${r.countryCode}`
//           .toLowerCase()
//           .includes(filterCountry.toLowerCase())
//       ) {
//         return false;
//       }
//       return true;
//     });
//   }, [rows, filterVendor, filterCountry]);

//   function startEdit(row: CarrierRate) {
//     if (!canManage) return;
//     setEditingId(row.id);
//     setForm({
//       vendorName: row.vendorName,
//       vendorCode: row.vendorCode || "",
//       country: row.country,
//       countryCode: row.countryCode || "",
//       weightFrom: String(row.weightFrom),
//       weightTo: String(row.weightTo),
//       rateType: row.rateType || "FLAT",
//       price: String(row.price),
//       currency: row.currency || "INR",
//       enabled: row.enabled !== false,
//       notes: row.notes || "",
//     });
//     setMessage(null);
//     setError(null);
//   }

//   function cancelEdit() {
//     setEditingId(null);
//     setForm(emptyForm);
//   }

//   /** Country select → auto country code */
//   function applyCountry(name: string) {
//     if (!name) {
//       setForm((f) => ({ ...f, country: "", countryCode: "" }));
//       return;
//     }

//     const c =
//       countries.find((x) => x.name === name) ||
//       countries.find(
//         (x) => x.name.toLowerCase() === name.toLowerCase(),
//       ) ||
//       countries.find((x) => x.code === name.toUpperCase());

//     setForm((f) => ({
//       ...f,
//       country: c?.name || name,
//       countryCode: (c?.code || "").toUpperCase(),
//     }));
//   }

//   /** Vendor select → auto vendor code */
//   function applyVendor(name: string) {
//     if (!name) {
//       setForm((f) => ({ ...f, vendorName: "", vendorCode: "" }));
//       return;
//     }

//     const key = normalizeVendorName(name);

//     const v =
//       vendors.find((x) => x.name === name) ||
//       vendors.find((x) => normalizeVendorName(x.name) === key) ||
//       vendors.find((x) => normalizeVendorName(x.name).startsWith(key)) ||
//       vendors.find((x) => key.startsWith(normalizeVendorName(x.name)));

//     const resolvedName = v?.name || name;
//     const code = deriveVendorCode(resolvedName, v?.code);

//     setForm((f) => ({
//       ...f,
//       vendorName: resolvedName,
//       vendorCode: code,
//     }));
//   }

//   async function handleSave(e: React.FormEvent) {
//     e.preventDefault();
//     if (!firebaseUser || !canManage) {
//       setError("You do not have permission to manage carrier rates.");
//       return;
//     }
//     try {
//       setSaving(true);
//       setError(null);
//       setMessage(null);

//       if (!form.vendorName.trim()) throw new Error("Vendor is required.");
//       if (!form.country.trim()) throw new Error("Country is required.");

//       const weightFrom = Number(form.weightFrom);
//       const weightTo = Number(form.weightTo || form.weightFrom);
//       const price = Number(form.price);

//       if (!Number.isFinite(weightFrom) || weightFrom < 0) {
//         throw new Error("Weight from is invalid.");
//       }
//       if (!Number.isFinite(weightTo) || weightTo < weightFrom) {
//         throw new Error("Weight to must be ≥ weight from.");
//       }
//       if (!Number.isFinite(price) || price < 0) {
//         throw new Error("Price is invalid.");
//       }

//       const headers = await authHeaders();
//       const payload = {
//         id: editingId || undefined,
//         vendorName: form.vendorName.trim(),
//         vendorCode:
//           form.vendorCode.trim() ||
//           deriveVendorCode(form.vendorName),
//         country: form.country.trim(),
//         countryCode: form.countryCode.trim().toUpperCase(),
//         weightFrom,
//         weightTo,
//         rateType: form.rateType,
//         price,
//         currency: form.currency.trim() || "INR",
//         enabled: form.enabled,
//         notes: form.notes.trim(),
//       };

//       const res = await fetch("/api/logistics/carrier-rates", {
//         method: editingId ? "PUT" : "POST",
//         headers,
//         credentials: "include",
//         body: JSON.stringify(payload),
//       });
//       const json = await res.json();
//       if (!res.ok || !json.success) {
//         throw new Error(json?.error?.message || "Save failed");
//       }

//       setMessage(
//         json.message || (editingId ? "Rate updated." : "Rate created."),
//       );
//       cancelEdit();
//       await loadData();
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Save failed");
//     } finally {
//       setSaving(false);
//     }
//   }

//   async function handleDelete(id: string) {
//     if (!firebaseUser || !canManage) return;
//     if (!window.confirm("Delete this rate row?")) return;
//     try {
//       const headers = await authHeaders();
//       const res = await fetch(
//         `/api/logistics/carrier-rates?id=${encodeURIComponent(id)}`,
//         { method: "DELETE", headers, credentials: "include" },
//       );
//       const json = await res.json();
//       if (!res.ok || !json.success) {
//         throw new Error(json?.error?.message || "Delete failed");
//       }
//       setMessage("Rate deleted.");
//       if (editingId === id) cancelEdit();
//       await loadData();
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Delete failed");
//     }
//   }

//   const inputCls =
//     "w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-100";
//   const labelCls = "mb-1.5 block text-xs font-bold text-slate-600";
//   const readOnlyCls = `${inputCls} bg-gray-50 font-semibold`;

//   return (
//     <div className="mx-auto max-w-[1200px] space-y-6">
//       <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
//         <div>
//           <p className="text-xs font-bold uppercase tracking-widest text-[#087f87]">
//             Masters
//           </p>
//           <h1 className="mt-1 text-2xl font-bold text-[#06284c]">
//             Carrier Rates
//           </h1>
//           <p className="mt-1 text-sm text-slate-500">
//             Weight-slab freight by vendor and country (e.g. FedEx Express USA /
//             Canada). Use FLAT for fixed slab price; PER_KG for bands like
//             21–40 kg.
//           </p>
//         </div>
//         <button
//           type="button"
//           onClick={() => loadData()}
//           disabled={loading || authLoading}
//           className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
//         >
//           <RefreshCw className="h-4 w-4" />
//           Refresh
//         </button>
//       </div>

//       {error ? (
//         <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//           {error}
//         </div>
//       ) : null}
//       {message ? (
//         <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
//           {message}
//         </div>
//       ) : null}

//       {canManage ? (
//         <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
//           <div className="mb-4 flex items-center justify-between">
//             <h2 className="font-bold text-[#06284c]">
//               {editingId ? "Edit rate row" : "Add rate row"}
//             </h2>
//             {editingId ? (
//               <button
//                 type="button"
//                 onClick={cancelEdit}
//                 className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500"
//               >
//                 <X className="h-3.5 w-3.5" />
//                 Cancel
//               </button>
//             ) : null}
//           </div>

//           <form
//             onSubmit={handleSave}
//             className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
//           >
//             <div className="sm:col-span-2">
//               <label className={labelCls}>Vendor / Carrier <span className="text-red-500">*</span></label>
//               {vendors.length > 0 ? (
//                 <select
//                   value={form.vendorName}
//                   onChange={(e) => applyVendor(e.target.value)}
//                   className={inputCls}
//                   required
//                 >
//                   <option value="">Select vendor</option>
//                   {vendors.map((v) => (
//                     <option key={v.id || v.name} value={v.name}>
//                       {(v.name || "").split(" (")[0] || v.name}
//                       {v.code ? ` (${v.code})` : ""}
//                     </option>
//                   ))}
//                 </select>
//               ) : (
//                 <input
//                   value={form.vendorName}
//                   onChange={(e) => applyVendor(e.target.value)}
//                   placeholder="FedEx"
//                   className={inputCls}
//                   required
//                 />
//               )}
//               <p className="mt-1 text-[11px] text-slate-400">
//                 From Fuel Surcharges (or Masters → Vendors). Code fills
//                 automatically.
//               </p>
//             </div>

//             {/* <div>
//               <label className={labelCls}>Vendor code <span className="text-red-500">*</span></label>
//               <input
//                 value={form.vendorCode}
//                 readOnly={vendors.length > 0}
//                 onChange={(e) =>
//                   setForm((f) => ({
//                     ...f,
//                     vendorCode: e.target.value.toUpperCase(),
//                   }))
//                 }
//                 className={vendors.length > 0 ? readOnlyCls : inputCls}
//                 placeholder="Vendor Code"
//                 required
//               />
//             </div> */}

//             <div>
//               <label className={labelCls}>
//                 Vendor code <span className="text-red-500">*</span>
//               </label>
//               <input
//                 value={form.vendorCode}
//                 readOnly
//                 placeholder="Vendor Code"
//                 className={`${inputCls}`}
//                 required
//               />
//             </div>

//             <div>
//               <label className={labelCls}>Country <span className="text-red-500">*</span></label>
//               {countries.length > 0 ? (
//                 <select
//                   value={form.country}
//                   onChange={(e) => applyCountry(e.target.value)}
//                   className={inputCls}
//                   required
//                 >
//                   <option value="">Select country</option>
//                   {countries.map((c) => (
//                     <option key={c.id || c.code} value={c.name}>
//                       {c.name}
//                       {c.code ? ` (${c.code})` : ""}
//                     </option>
//                   ))}
//                 </select>
//               ) : (
//                 <input
//                   value={form.country}
//                   onChange={(e) => applyCountry(e.target.value)}
//                   className={inputCls}
//                   required
//                   placeholder="USA"
//                 />
//               )}
//               <p className="mt-1 text-[11px] text-slate-400">
//                 From Masters → Countries. Code fills automatically.
//               </p>
//             </div>

//             <div>
//               <label className={labelCls}>Country code <span className="text-red-500">*</span></label>
//               <input
//                 value={form.countryCode}
//                 readOnly={countries.length > 0}
//                 onChange={(e) =>
//                   setForm((f) => ({
//                     ...f,
//                     countryCode: e.target.value.toUpperCase(),
//                   }))
//                 }
//                 // className={countries.length > 0 ? readOnlyCls : inputCls}
//                 className={`${inputCls}`}
//                 placeholder="Country Code"
//               />
//             </div>

//             <div>
//               <label className={labelCls}>Weight from (kg) <span className="text-red-500">*</span></label>
//               <input
//                 type="number"
//                 min={0}
//                 step="0.5"
//                 value={form.weightFrom}
//                 onChange={(e) =>
//                   setForm((f) => ({
//                     ...f,
//                     weightFrom: e.target.value,
//                     weightTo: f.weightTo || e.target.value,
//                   }))
//                 }
//                 className={inputCls}
//                 required
//                 placeholder="0.5"
//               />
//             </div>

//             <div>
//               <label className={labelCls}>Weight to (kg) <span className="text-red-500">*</span></label>
//               <input
//                 type="number"
//                 min={0}
//                 step="0.5"
//                 value={form.weightTo}
//                 onChange={(e) =>
//                   setForm((f) => ({ ...f, weightTo: e.target.value }))
//                 }
//                 className={inputCls}
//                 required
//                 placeholder="0.5 or 40 for band"
//               />
//             </div>

//             <div>
//               <label className={labelCls}>Rate type <span className="text-red-500">*</span></label>
//               <select
//                 value={form.rateType}
//                 onChange={(e) =>
//                   setForm((f) => ({
//                     ...f,
//                     rateType: e.target.value as RateType,
//                   }))
//                 }
//                 required
//                 className={inputCls}
//               >
//                 <option value="FLAT">FLAT (total for slab)</option>
//                 <option value="PER_KG">PER_KG (× chargeable kg)</option>
//               </select>
//             </div>

//             <div>
//               <label className={labelCls}>Price (₹) <span className="text-red-500">*</span></label>
//               <input
//                 type="number"
//                 min={0}
//                 step="0.01"
//                 value={form.price}
//                 onChange={(e) =>
//                   setForm((f) => ({ ...f, price: e.target.value }))
//                 }
//                 className={inputCls}
//                 required
//                 placeholder="2110"
//               />
//             </div>

//             <div className="flex items-end">
//               <label className="flex items-center gap-2 text-sm font-medium">
//                 <input
//                   type="checkbox"
//                   checked={form.enabled}
//                   onChange={(e) =>
//                     setForm((f) => ({ ...f, enabled: e.target.checked }))
//                   }
//                   className="h-4 w-4"
//                 />
//                 Active
//               </label>
//             </div>

//             <div className="sm:col-span-2 lg:col-span-3">
//               <label className={labelCls}>Notes</label>
//               <input
//                 value={form.notes}
//                 onChange={(e) =>
//                   setForm((f) => ({ ...f, notes: e.target.value }))
//                 }
//                 className={inputCls}
//                 placeholder="Optional"
//               />
//             </div>

//             <div className="flex items-end">
//               <button
//                 type="submit"
//                 disabled={saving}
//                 className="inline-flex items-center gap-2 rounded-lg bg-[#087f87] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60"
//               >
//                 {editingId ? (
//                   <Save className="h-4 w-4" />
//                 ) : (
//                   <Plus className="h-4 w-4" />
//                 )}
//                 {saving
//                   ? "Saving…"
//                   : editingId
//                     ? "Update row"
//                     : "Add row"}
//               </button>
//             </div>
//           </form>

//           <p className="mt-3 text-xs text-slate-500">
//             Example: USA 0.5–0.5 FLAT ₹2110 · Canada 5–5 FLAT ₹5060 · USA
//             21–40 PER_KG ₹767 · USA 45–70 PER_KG ₹765
//           </p>
//         </section>
//       ) : (
//         <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
//           View only — rate manage / masters manage permission required.
//         </div>
//       )}

//       <div className="flex flex-wrap gap-3">
//         <input
//           value={filterVendor}
//           onChange={(e) => setFilterVendor(e.target.value)}
//           placeholder="Filter vendor…"
//           className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
//         />
//         <input
//           value={filterCountry}
//           onChange={(e) => setFilterCountry(e.target.value)}
//           placeholder="Filter country…"
//           className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
//         />
//       </div>

//       <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
//         <div className="border-b border-slate-100 px-5 py-4">
//           <h2 className="font-bold text-[#06284c]">
//             Rate table
//             <span className="ml-2 text-xs font-normal text-slate-400">
//               {filtered.length} row(s)
//             </span>
//           </h2>
//         </div>

//         {loading || authLoading ? (
//           <div className="py-16 text-center text-sm text-slate-500">
//             Loading…
//           </div>
//         ) : filtered.length === 0 ? (
//           <div className="px-5 py-16 text-center text-sm text-slate-500">
//             No carrier rates yet. Add rows matching your FedEx sheet.
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full min-w-[900px] text-left text-sm">
//               <thead className="bg-slate-50 text-xs uppercase text-slate-500">
//                 <tr>
//                   <th className="px-4 py-3">Vendor</th>
//                   <th className="px-4 py-3">Country</th>
//                   <th className="px-4 py-3">Weight (kg)</th>
//                   <th className="px-4 py-3">Type</th>
//                   <th className="px-4 py-3">Price</th>
//                   <th className="px-4 py-3">Status</th>
//                   {canManage ? <th className="px-4 py-3">Actions</th> : null}
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-100">
//                 {filtered.map((row) => (
//                   <tr key={row.id} className="hover:bg-slate-50/50">
//                     <td className="px-4 py-3 font-semibold text-slate-800">
//                       {row.vendorName}
//                       {row.vendorCode ? (
//                         <span className="ml-1 text-xs text-slate-400">
//                           ({row.vendorCode})
//                         </span>
//                       ) : null}
//                     </td>
//                     <td className="px-4 py-3">
//                       {row.country}
//                       {row.countryCode ? ` (${row.countryCode})` : ""}
//                     </td>
//                     <td className="px-4 py-3">
//                       {row.weightFrom === row.weightTo
//                         ? row.weightFrom
//                         : `${row.weightFrom} – ${row.weightTo}`}
//                     </td>
//                     <td className="px-4 py-3">{row.rateType}</td>
//                     <td className="px-4 py-3 font-semibold">
//                       ₹{Number(row.price).toLocaleString("en-IN")}
//                       {row.rateType === "PER_KG" ? "/kg" : ""}
//                     </td>
//                     <td className="px-4 py-3">
//                       <span
//                         className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
//                           row.enabled
//                             ? "bg-emerald-100 text-emerald-700"
//                             : "bg-slate-100 text-slate-500"
//                         }`}
//                       >
//                         {row.enabled ? "Active" : "Disabled"}
//                       </span>
//                     </td>
//                     {canManage ? (
//                       <td className="px-4 py-3">
//                         <div className="flex gap-1">
//                           <button
//                             type="button"
//                             onClick={() => startEdit(row)}
//                             className="rounded p-1.5 text-slate-500 hover:bg-slate-100"
//                           >
//                             <Pencil className="h-4 w-4" />
//                           </button>
//                           <button
//                             type="button"
//                             onClick={() => handleDelete(row.id)}
//                             className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
//                           >
//                             <Trash2 className="h-4 w-4" />
//                           </button>
//                         </div>
//                       </td>
//                     ) : null}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </section>
//     </div>
//   );
// }

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Plus,
  Trash2,
  Save,
  RefreshCw,
  Pencil,
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { can } from "@/lib/permissions";

type RateType = "FLAT" | "PER_KG";

type CarrierRate = {
  id: string;
  rateId: string;
  vendorName: string;
  vendorCode: string;
  country: string;
  countryCode: string;
  weightFrom: number;
  weightTo: number;
  rateType: RateType;
  price: number;
  currency: string;
  enabled: boolean;
  notes: string;
};

type FormState = {
  vendorName: string;
  vendorCode: string;
  country: string;
  countryCode: string;
  weightFrom: string;
  weightTo: string;
  rateType: RateType;
  price: string;
  currency: string;
  enabled: boolean;
  notes: string;
};

type VendorOption = { id: string; name: string; code?: string };
type CountryOption = { id: string; name: string; code: string };

const emptyForm: FormState = {
  vendorName: "",
  vendorCode: "",
  country: "",
  countryCode: "",
  weightFrom: "",
  weightTo: "",
  rateType: "FLAT",
  price: "",
  currency: "INR",
  enabled: true,
  notes: "",
};

/** Derive a short code when master has no code field (common for fuel surcharges) */
function deriveVendorCode(name: string, existing?: string): string {
  const fromMaster = String(existing || "").trim().toUpperCase();
  if (fromMaster) return fromMaster;

  const base = String(name || "")
    .split(" (")[0]
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");

  return base.slice(0, 8);
}

function normalizeVendorName(name: string): string {
  return String(name || "")
    .split(" (")[0]
    .trim()
    .toUpperCase();
}

export default function CarrierRatesPage() {
  const { firebaseUser, user, loading: authLoading } = useAuth();

  const permUser = {
    userId: user?.userId ?? "",
    role: user?.role ?? null,
  };
  const canManage =
    can(permUser, "LOGISTICS_RATE_MANAGE") ||
    can(permUser, "LOGISTICS_MASTERS_MANAGE");

  const [rows, setRows] = useState<CarrierRate[]>([]);
  const [vendors, setVendors] = useState<VendorOption[]>([]);
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [filterVendor, setFilterVendor] = useState("");
  const [filterCountry, setFilterCountry] = useState("");

  const authHeaders = useCallback(async (): Promise<HeadersInit> => {
    if (!firebaseUser) throw new Error("Authentication is required.");
    const token = await firebaseUser.getIdToken(true);
    return {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }, [firebaseUser]);

  const loadVendors = useCallback(async () => {
    if (!firebaseUser) return;
    try {
      const headers = await authHeaders();

      // 1) Fuel surcharges (primary — same names used on booking)
      const res = await fetch("/api/logistics/settings/fuel-surcharge", {
        headers,
        credentials: "include",
        cache: "no-store",
      });
      const json = await res.json();
      if (res.ok && json.success) {
        const list = Array.isArray(json.data)
          ? json.data
          : json.data?.items || [];
        const mapped: VendorOption[] = (list as Record<string, unknown>[])
          .map((r) => {
            const name = String(r.name || "").trim();
            const code = deriveVendorCode(
              name,
              String(r.code || r.vendorCode || ""),
            );
            return {
              id: String(r.id || name),
              name,
              code: code || undefined,
            };
          })
          .filter((v) => v.name);

        if (mapped.length) {
          setVendors(mapped);
          return;
        }
      }

      // 2) Fallback: masters vendors
      const vRes = await fetch("/api/logistics/vendors?status=ACTIVE", {
        headers,
        credentials: "include",
        cache: "no-store",
      });
      const vJson = await vRes.json();
      if (vRes.ok && vJson.success) {
        const list = Array.isArray(vJson.data)
          ? vJson.data
          : vJson.data?.items || vJson.data?.vendors || [];
        setVendors(
          (list as Record<string, unknown>[])
            .map((r) => {
              const name = String(r.name || "").trim();
              return {
                id: String(r.id || r.vendorId || name),
                name,
                code:
                  deriveVendorCode(
                    name,
                    String(r.code || r.vendorCode || ""),
                  ) || undefined,
              };
            })
            .filter((v) => v.name),
        );
      }
    } catch {
      /* ignore */
    }
  }, [firebaseUser, authHeaders]);

  const loadCountries = useCallback(async () => {
    if (!firebaseUser) return;
    try {
      const headers = await authHeaders();
      const res = await fetch("/api/logistics/masters/countries", {
        headers,
        credentials: "include",
        cache: "no-store",
      });
      const json = await res.json();
      if (!res.ok || !json.success) return;

      const list = Array.isArray(json.data?.items)
        ? json.data.items
        : Array.isArray(json.data?.countries)
          ? json.data.countries
          : Array.isArray(json.data)
            ? json.data
            : [];

      setCountries(
        (list as Record<string, unknown>[])
          .filter((r) => {
            const name = String(r.name || "").trim();
            if (!name) return false;
            if (r.enabled === false) return false;
            const status = String(r.status || "ACTIVE").toUpperCase();
            if (status === "INACTIVE") return false;
            return true;
          })
          .map((r) => {
            const name = String(r.name || "").trim();
            const code = String(r.code || "")
              .trim()
              .toUpperCase();
            return {
              id: String(r.id || code || name),
              name,
              code,
            };
          }),
      );
    } catch {
      /* ignore */
    }
  }, [firebaseUser, authHeaders]);

  const loadData = useCallback(async () => {
    if (!firebaseUser) {
      setError("Authentication is required.");
      setRows([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const headers = await authHeaders();
      const res = await fetch("/api/logistics/carrier-rates", {
        headers,
        credentials: "include",
        cache: "no-store",
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(
          json?.error?.message || "Failed to load carrier rates",
        );
      }
      const list = Array.isArray(json.data)
        ? json.data
        : json.data?.items || [];
      setRows(list as CarrierRate[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load data");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [firebaseUser, authHeaders]);

  useEffect(() => {
    if (authLoading) return;
    loadData();
    loadVendors();
    loadCountries();
  }, [authLoading, loadData, loadVendors, loadCountries]);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (filterVendor) {
        const key = filterVendor.toLowerCase();
        const name = r.vendorName.toLowerCase();
        const code = (r.vendorCode || "").toLowerCase();
        if (!name.includes(key) && !code.includes(key) && name !== key) {
          return false;
        }
      }
      if (filterCountry) {
        const key = filterCountry.toLowerCase();
        const name = r.country.toLowerCase();
        const code = (r.countryCode || "").toLowerCase();
        if (!name.includes(key) && !code.includes(key) && name !== key) {
          return false;
        }
      }
      return true;
    });
  }, [rows, filterVendor, filterCountry]);

  function startEdit(row: CarrierRate) {
    if (!canManage) return;
    setEditingId(row.id);
    setForm({
      vendorName: row.vendorName,
      vendorCode: row.vendorCode || "",
      country: row.country,
      countryCode: row.countryCode || "",
      weightFrom: String(row.weightFrom),
      weightTo: String(row.weightTo),
      rateType: row.rateType || "FLAT",
      price: String(row.price),
      currency: row.currency || "INR",
      enabled: row.enabled !== false,
      notes: row.notes || "",
    });
    setMessage(null);
    setError(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  /** Country select → auto country code */
  function applyCountry(name: string) {
    if (!name) {
      setForm((f) => ({ ...f, country: "", countryCode: "" }));
      return;
    }

    const c =
      countries.find((x) => x.name === name) ||
      countries.find(
        (x) => x.name.toLowerCase() === name.toLowerCase(),
      ) ||
      countries.find((x) => x.code === name.toUpperCase());

    setForm((f) => ({
      ...f,
      country: c?.name || name,
      countryCode: (c?.code || "").toUpperCase(),
    }));
  }

  /** Vendor select → auto vendor code */
  function applyVendor(name: string) {
    if (!name) {
      setForm((f) => ({ ...f, vendorName: "", vendorCode: "" }));
      return;
    }

    const key = normalizeVendorName(name);

    const v =
      vendors.find((x) => x.name === name) ||
      vendors.find((x) => normalizeVendorName(x.name) === key) ||
      vendors.find((x) => normalizeVendorName(x.name).startsWith(key)) ||
      vendors.find((x) => key.startsWith(normalizeVendorName(x.name)));

    const resolvedName = v?.name || name;
    const code = deriveVendorCode(resolvedName, v?.code);

    setForm((f) => ({
      ...f,
      vendorName: resolvedName,
      vendorCode: code,
    }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!firebaseUser || !canManage) {
      setError("You do not have permission to manage carrier rates.");
      return;
    }
    try {
      setSaving(true);
      setError(null);
      setMessage(null);

      if (!form.vendorName.trim()) throw new Error("Vendor is required.");
      if (!form.country.trim()) throw new Error("Country is required.");

      const weightFrom = Number(form.weightFrom);
      const weightTo = Number(form.weightTo || form.weightFrom);
      const price = Number(form.price);

      if (!Number.isFinite(weightFrom) || weightFrom < 0) {
        throw new Error("Weight from is invalid.");
      }
      if (!Number.isFinite(weightTo) || weightTo < weightFrom) {
        throw new Error("Weight to must be ≥ weight from.");
      }
      if (!Number.isFinite(price) || price < 0) {
        throw new Error("Price is invalid.");
      }

      const headers = await authHeaders();
      const payload = {
        id: editingId || undefined,
        vendorName: form.vendorName.trim(),
        vendorCode:
          form.vendorCode.trim() ||
          deriveVendorCode(form.vendorName),
        country: form.country.trim(),
        countryCode: form.countryCode.trim().toUpperCase(),
        weightFrom,
        weightTo,
        rateType: form.rateType,
        price,
        currency: form.currency.trim() || "INR",
        enabled: form.enabled,
        notes: form.notes.trim(),
      };

      const res = await fetch("/api/logistics/carrier-rates", {
        method: editingId ? "PUT" : "POST",
        headers,
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json?.error?.message || "Save failed");
      }

      setMessage(
        json.message || (editingId ? "Rate updated." : "Rate created."),
      );
      cancelEdit();
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!firebaseUser || !canManage) return;
    if (!window.confirm("Delete this rate row?")) return;
    try {
      const headers = await authHeaders();
      const res = await fetch(
        `/api/logistics/carrier-rates?id=${encodeURIComponent(id)}`,
        { method: "DELETE", headers, credentials: "include" },
      );
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json?.error?.message || "Delete failed");
      }
      setMessage("Rate deleted.");
      if (editingId === id) cancelEdit();
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  }

  const inputCls =
    "w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-100";
  const labelCls = "mb-1.5 block text-xs font-bold text-slate-600";
  const readOnlyCls = `${inputCls} bg-gray-50 font-semibold`;

  return (
    <div className="mx-auto max-w-[1200px] space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#087f87]">
            Masters
          </p>
          <h1 className="mt-1 text-2xl font-bold text-[#06284c]">
            Carrier Rates
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Weight-slab freight by vendor and country (e.g. FedEx Express USA /
            Canada). Use FLAT for fixed slab price; PER_KG for bands like
            21–40 kg.
          </p>
        </div>
        <button
          type="button"
          onClick={() => loadData()}
          disabled={loading || authLoading}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}
      {message ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {message}
        </div>
      ) : null}

      {canManage ? (
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-[#06284c]">
              {editingId ? "Edit rate row" : "Add rate row"}
            </h2>
            {editingId ? (
              <button
                type="button"
                onClick={cancelEdit}
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500"
              >
                <X className="h-3.5 w-3.5" />
                Cancel
              </button>
            ) : null}
          </div>

          <form
            onSubmit={handleSave}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            <div className="sm:col-span-2">
              <label className={labelCls}>
                Vendor / Carrier <span className="text-red-500">*</span>
              </label>
              {vendors.length > 0 ? (
                <select
                  value={form.vendorName}
                  onChange={(e) => applyVendor(e.target.value)}
                  className={inputCls}
                  required
                >
                  <option value="">Select vendor</option>
                  {vendors.map((v) => (
                    <option key={v.id || v.name} value={v.name}>
                      {(v.name || "").split(" (")[0] || v.name}
                      {v.code ? ` (${v.code})` : ""}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  value={form.vendorName}
                  onChange={(e) => applyVendor(e.target.value)}
                  placeholder="FedEx"
                  className={inputCls}
                  required
                />
              )}
              <p className="mt-1 text-[11px] text-slate-400">
                From Fuel Surcharges (or Masters → Vendors). Code fills
                automatically.
              </p>
            </div>

            <div>
              <label className={labelCls}>
                Vendor code <span className="text-red-500">*</span>
              </label>
              <input
                value={form.vendorCode}
                readOnly
                placeholder="Vendor Code"
                className={readOnlyCls}
                required
              />
            </div>

            <div>
              <label className={labelCls}>
                Country <span className="text-red-500">*</span>
              </label>
              {countries.length > 0 ? (
                <select
                  value={form.country}
                  onChange={(e) => applyCountry(e.target.value)}
                  className={inputCls}
                  required
                >
                  <option value="">Select country</option>
                  {countries.map((c) => (
                    <option key={c.id || c.code} value={c.name}>
                      {c.name}
                      {c.code ? ` (${c.code})` : ""}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  value={form.country}
                  onChange={(e) => applyCountry(e.target.value)}
                  className={inputCls}
                  required
                  placeholder="USA"
                />
              )}
              <p className="mt-1 text-[11px] text-slate-400">
                From Masters → Countries. Code fills automatically.
              </p>
            </div>

            <div>
              <label className={labelCls}>
                Country code <span className="text-red-500">*</span>
              </label>
              <input
                value={form.countryCode}
                readOnly
                placeholder="Country Code"
                className={readOnlyCls}
              />
            </div>

            <div>
              <label className={labelCls}>
                Weight from (kg) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min={0}
                step="0.5"
                value={form.weightFrom}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    weightFrom: e.target.value,
                    weightTo: f.weightTo || e.target.value,
                  }))
                }
                className={inputCls}
                required
                placeholder="0.5"
              />
            </div>

            <div>
              <label className={labelCls}>
                Weight to (kg) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min={0}
                step="0.5"
                value={form.weightTo}
                onChange={(e) =>
                  setForm((f) => ({ ...f, weightTo: e.target.value }))
                }
                className={inputCls}
                required
                placeholder="0.5 or 40 for band"
              />
            </div>

            <div>
              <label className={labelCls}>
                Rate type <span className="text-red-500">*</span>
              </label>
              <select
                value={form.rateType}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    rateType: e.target.value as RateType,
                  }))
                }
                required
                className={inputCls}
              >
                <option value="FLAT">FLAT (total for slab)</option>
                <option value="PER_KG">PER_KG (× chargeable kg)</option>
              </select>
            </div>

            <div>
              <label className={labelCls}>
                Price (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min={0}
                step="0.01"
                value={form.price}
                onChange={(e) =>
                  setForm((f) => ({ ...f, price: e.target.value }))
                }
                className={inputCls}
                required
                placeholder="2110"
              />
            </div>

            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={form.enabled}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, enabled: e.target.checked }))
                  }
                  className="h-4 w-4"
                />
                Active
              </label>
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <label className={labelCls}>Notes</label>
              <input
                value={form.notes}
                onChange={(e) =>
                  setForm((f) => ({ ...f, notes: e.target.value }))
                }
                className={inputCls}
                placeholder="Optional"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-lg bg-[#087f87] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60"
              >
                {editingId ? (
                  <Save className="h-4 w-4" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                {saving
                  ? "Saving…"
                  : editingId
                    ? "Update row"
                    : "Add row"}
              </button>
            </div>
          </form>

          <p className="mt-3 text-xs text-slate-500">
            Example: USA 0.5–0.5 FLAT ₹2110 · Canada 5–5 FLAT ₹5060 · USA
            21–40 PER_KG ₹767 · USA 45–70 PER_KG ₹765
          </p>
        </section>
      ) : (
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          View only — rate manage / masters manage permission required.
        </div>
      )}

      {/* Filters — dropdowns from fuel surcharges + countries master */}
      <div className="flex flex-wrap gap-3">
        <select
          value={filterVendor}
          onChange={(e) => setFilterVendor(e.target.value)}
          className="min-w-[200px] rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-500"
        >
          <option value="">All vendors</option>
          {vendors.map((v) => (
            <option key={v.id || v.name} value={v.name}>
              {(v.name || "").split(" (")[0] || v.name}
              {v.code ? ` (${v.code})` : ""}
            </option>
          ))}
        </select>

        <select
          value={filterCountry}
          onChange={(e) => setFilterCountry(e.target.value)}
          className="min-w-[200px] rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-500"
        >
          <option value="">All countries</option>
          {countries.map((c) => (
            <option key={c.id || c.code} value={c.name}>
              {c.name}
              {c.code ? ` (${c.code})` : ""}
            </option>
          ))}
        </select>
      </div>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="font-bold text-[#06284c]">
            Rate table
            <span className="ml-2 text-xs font-normal text-slate-400">
              {filtered.length} row(s)
            </span>
          </h2>
        </div>

        {loading || authLoading ? (
          <div className="py-16 text-center text-sm text-slate-500">
            Loading…
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-5 py-16 text-center text-sm text-slate-500">
            No carrier rates yet. Add rows matching your FedEx sheet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Vendor</th>
                  <th className="px-4 py-3">Country</th>
                  <th className="px-4 py-3">Weight (kg)</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Status</th>
                  {canManage ? <th className="px-4 py-3">Actions</th> : null}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-semibold text-slate-800">
                      {row.vendorName}
                      {row.vendorCode ? (
                        <span className="ml-1 text-xs text-slate-400">
                          ({row.vendorCode})
                        </span>
                      ) : null}
                    </td>
                    <td className="px-4 py-3">
                      {row.country}
                      {row.countryCode ? ` (${row.countryCode})` : ""}
                    </td>
                    <td className="px-4 py-3">
                      {row.weightFrom === row.weightTo
                        ? row.weightFrom
                        : `${row.weightFrom} – ${row.weightTo}`}
                    </td>
                    <td className="px-4 py-3">{row.rateType}</td>
                    <td className="px-4 py-3 font-semibold">
                      ₹{Number(row.price).toLocaleString("en-IN")}
                      {row.rateType === "PER_KG" ? "/kg" : ""}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                          row.enabled
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {row.enabled ? "Active" : "Disabled"}
                      </span>
                    </td>
                    {canManage ? (
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => startEdit(row)}
                            className="rounded p-1.5 text-slate-500 hover:bg-slate-100"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(row.id)}
                            className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    ) : null}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}