// "use client";

// import { FormEvent, useEffect, useState } from "react";
// import { useAuth } from "@/context/AuthContext";
// import { can } from "@/lib/permissions";
// import { Loader2, Pencil, Trash2, Plus } from "lucide-react";

// type Country = {
//   id: string;
//   name: string;
//   code: string;
//   volumetricDivisor: number;
//   enabled: boolean;
// };

// type ApiResponse =
//   | { success: true; data: { items?: Country[]; countries?: Country[] } }
//   | { success: false; error: { message: string } };

// const EMPTY = {
//   name: "",
//   code: "",
//   volumetricDivisor: "5000",
//   enabled: true,
// };

// export default function CountriesMasterPage() {
//   const { firebaseUser, user, loading: authLoading } = useAuth();
//   const permUser = {
//     userId: user?.userId ?? "",
//     role: user?.role ?? null,
//   };
//   const canManage =
//     can(permUser, "LOGISTICS_MASTERS_MANAGE") ||
//     user?.role === "SUPER_ADMIN" ||
//     user?.role === "ADMIN";

//   const [rows, setRows] = useState<Country[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [message, setMessage] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [form, setForm] = useState(EMPTY);
//   const [editId, setEditId] = useState<string | null>(null);

//   async function headers() {
//     const h: HeadersInit = {
//       Accept: "application/json",
//       "Content-Type": "application/json",
//     };
//     if (firebaseUser) {
//       h.Authorization = `Bearer ${await firebaseUser.getIdToken(true)}`;
//     }
//     return h;
//   }

//   async function load() {
//     try {
//       setLoading(true);
//       setError(null);
//       const res = await fetch(
//         "/api/logistics/masters/countries?enabled=false",
//         {
//           headers: await headers(),
//           cache: "no-store",
//         },
//       );
//       const json = (await res.json()) as ApiResponse;
//       if (!res.ok || !json.success) {
//         throw new Error(
//           !json.success ? json.error.message : "Failed to load",
//         );
//       }
//       const list =
//         json.data.items || json.data.countries || [];
//       setRows(list);
//     } catch (e) {
//       setError(e instanceof Error ? e.message : "Load failed");
//       setRows([]);
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     if (!authLoading && firebaseUser) load();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [authLoading, firebaseUser]);

//   async function onSubmit(e: FormEvent) {
//     e.preventDefault();
//     if (!canManage) {
//       setError("You do not have permission to manage countries.");
//       return;
//     }
//     try {
//       setSaving(true);
//       setError(null);
//       setMessage(null);

//       const body = {
//         id: editId || undefined,
//         name: form.name.trim(),
//         code: form.code.trim().toUpperCase(),
//         volumetricDivisor: Number(form.volumetricDivisor) || 5000,
//         enabled: form.enabled,
//       };

//       const res = await fetch("/api/logistics/masters/countries", {
//         method: editId ? "PATCH" : "POST",
//         headers: await headers(),
//         body: JSON.stringify(body),
//       });
//       const json = await res.json();
//       if (!res.ok || !json.success) {
//         throw new Error(json.error?.message || "Save failed");
//       }

//       setMessage(editId ? "Country updated." : "Country created.");
//       setForm(EMPTY);
//       setEditId(null);
//       await load();
//     } catch (e) {
//       setError(e instanceof Error ? e.message : "Save failed");
//     } finally {
//       setSaving(false);
//     }
//   }

//   function startEdit(row: Country) {
//     setEditId(row.id);
//     setForm({
//       name: row.name,
//       code: row.code,
//       volumetricDivisor: String(row.volumetricDivisor || 5000),
//       enabled: row.enabled,
//     });
//   }

//   async function remove(id: string) {
//     if (!canManage) return;
//     if (!confirm("Delete this country?")) return;
//     try {
//       const res = await fetch(
//         `/api/logistics/masters/countries?id=${encodeURIComponent(id)}`,
//         { method: "DELETE", headers: await headers() },
//       );
//       const json = await res.json();
//       if (!res.ok || !json.success) {
//         throw new Error(json.error?.message || "Delete failed");
//       }
//       await load();
//     } catch (e) {
//       setError(e instanceof Error ? e.message : "Delete failed");
//     }
//   }

//   return (
//     <div className="mx-auto max-w-4xl space-y-6 p-4 md:p-6">
//       <div>
//         <p className="text-xs font-bold uppercase tracking-widest text-[#087f87]">
//           Masters
//         </p>
//         <h1 className="mt-1 text-2xl font-bold text-[#06284c]">Countries</h1>
//         <p className="mt-1 text-sm text-slate-500">
//           Used in AWB Booking → Services Details → Destination country.
//           Australia should use divisor 4000; most others 5000.
//         </p>
//       </div>

//       {message && (
//         <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-800">
//           {message}
//         </div>
//       )}
//       {error && (
//         <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
//           {error}
//         </div>
//       )}

//       {canManage && (
//         <form
//           onSubmit={onSubmit}
//           className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
//         >
//           <h2 className="mb-4 font-bold text-[#06284c]">
//             {editId ? "Edit country" : "Add country"}
//           </h2>
//           <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
//             <div>
//               <label className="mb-1 block text-xs font-bold text-slate-600">
//                 Name *
//               </label>
//               <input
//                 required
//                 value={form.name}
//                 onChange={(e) =>
//                   setForm((f) => ({ ...f, name: e.target.value }))
//                 }
//                 placeholder="Australia"
//                 className="h-9 w-full rounded border border-slate-300 px-2.5 text-sm"
//               />
//             </div>
//             <div>
//               <label className="mb-1 block text-xs font-bold text-slate-600">
//                 Code *
//               </label>
//               <input
//                 required
//                 value={form.code}
//                 onChange={(e) =>
//                   setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))
//                 }
//                 placeholder="AU"
//                 className="h-9 w-full rounded border border-slate-300 px-2.5 text-sm"
//               />
//             </div>
//             <div>
//               <label className="mb-1 block text-xs font-bold text-slate-600">
//                 Volumetric divisor
//               </label>
//               <input
//                 type="number"
//                 min={1}
//                 value={form.volumetricDivisor}
//                 onChange={(e) =>
//                   setForm((f) => ({
//                     ...f,
//                     volumetricDivisor: e.target.value,
//                   }))
//                 }
//                 className="h-9 w-full rounded border border-slate-300 px-2.5 text-sm"
//               />
//             </div>
//             <div className="flex items-end gap-3">
//               <label className="flex items-center gap-2 text-sm">
//                 <input
//                   type="checkbox"
//                   checked={form.enabled}
//                   onChange={(e) =>
//                     setForm((f) => ({ ...f, enabled: e.target.checked }))
//                   }
//                 />
//                 Enabled
//               </label>
//               <button
//                 type="submit"
//                 disabled={saving}
//                 className="inline-flex h-9 items-center gap-1 rounded-lg bg-[#087f87] px-4 text-sm font-bold text-white disabled:opacity-60"
//               >
//                 {saving ? (
//                   <Loader2 className="h-4 w-4 animate-spin" />
//                 ) : (
//                   <Plus className="h-4 w-4" />
//                 )}
//                 {editId ? "Update" : "Add"}
//               </button>
//               {editId && (
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setEditId(null);
//                     setForm(EMPTY);
//                   }}
//                   className="h-9 rounded-lg border px-3 text-sm"
//                 >
//                   Cancel
//                 </button>
//               )}
//             </div>
//           </div>
//         </form>
//       )}

//       <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
//         {loading || authLoading ? (
//           <div className="flex items-center justify-center gap-2 py-16 text-slate-500">
//             <Loader2 className="h-5 w-5 animate-spin" />
//             Loading…
//           </div>
//         ) : (
//           <table className="w-full text-left text-sm">
//             <thead className="bg-slate-50 text-xs uppercase text-slate-500">
//               <tr>
//                 <th className="px-4 py-3">Name</th>
//                 <th className="px-4 py-3">Code</th>
//                 <th className="px-4 py-3">Divisor</th>
//                 <th className="px-4 py-3">Status</th>
//                 {canManage && <th className="px-4 py-3">Actions</th>}
//               </tr>
//             </thead>
//             <tbody className="divide-y">
//               {rows.length === 0 ? (
//                 <tr>
//                   <td
//                     colSpan={5}
//                     className="px-4 py-12 text-center text-slate-500"
//                   >
//                     No countries yet. Add USA (5000) and Australia (4000).
//                   </td>
//                 </tr>
//               ) : (
//                 rows.map((row) => (
//                   <tr key={row.id}>
//                     <td className="px-4 py-3 font-semibold">{row.name}</td>
//                     <td className="px-4 py-3 font-mono text-xs">{row.code}</td>
//                     <td className="px-4 py-3">÷{row.volumetricDivisor}</td>
//                     <td className="px-4 py-3">
//                       <span
//                         className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
//                           row.enabled
//                             ? "bg-emerald-100 text-emerald-700"
//                             : "bg-slate-100 text-slate-500"
//                         }`}
//                       >
//                         {row.enabled ? "Active" : "Off"}
//                       </span>
//                     </td>
//                     {canManage && (
//                       <td className="px-4 py-3">
//                         <div className="flex gap-2">
//                           <button
//                             type="button"
//                             onClick={() => startEdit(row)}
//                             className="rounded p-1.5 text-slate-500 hover:bg-slate-100"
//                           >
//                             <Pencil className="h-4 w-4" />
//                           </button>
//                           <button
//                             type="button"
//                             onClick={() => remove(row.id)}
//                             className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
//                           >
//                             <Trash2 className="h-4 w-4" />
//                           </button>
//                         </div>
//                       </td>
//                     )}
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { Plus, Pencil, Trash2, RefreshCw, X, Save } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { can } from "@/lib/permissions";
import type { UserRole } from "@/types/user";

type CountryRow = {
  id: string;
  name: string;
  code: string;
  volumetricDivisor: number;
  enabled: boolean;
};

type FormState = {
  name: string;
  code: string;
  volumetricDivisor: string;
  enabled: boolean;
};

const emptyForm: FormState = {
  name: "",
  code: "",
  volumetricDivisor: "5000",
  enabled: true,
};

function toPermissionUser(
  user: { userId?: string; id?: string; role?: string } | null,
  roleFromAuth?: string | null,
) {
  if (!user && !roleFromAuth) return null;
  const roleRaw = String(roleFromAuth || user?.role || "")
    .trim()
    .toUpperCase();
  return {
    userId: String(user?.userId || user?.id || ""),
    role: (roleRaw || null) as UserRole | null,
  };
}

export default function CountriesMasterPage() {
  const { firebaseUser, user, role, loading: authLoading } = useAuth();
  const permissionUser = toPermissionUser(
    user as { userId?: string; id?: string; role?: string } | null,
    role,
  );

  const canView =
    can(permissionUser, "LOGISTICS_MASTERS_VIEW") ||
    can(permissionUser, "LOGISTICS_MASTERS_MANAGE");
  const canManage = can(permissionUser, "LOGISTICS_MASTERS_MANAGE");

  const [rows, setRows] = useState<CountryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  const authHeaders = useCallback(async (): Promise<HeadersInit> => {
    if (!firebaseUser) throw new Error("Authentication is required.");
    const token = await firebaseUser.getIdToken(true);
    return {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }, [firebaseUser]);

  const loadData = useCallback(async () => {
    if (!firebaseUser) {
      setError("Authentication is required.");
      setRows([]);
      setLoading(false);
      return;
    }
    if (!canView) {
      setError("You do not have permission to view countries.");
      setRows([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const headers = await authHeaders();
      const res = await fetch(
        "/api/logistics/masters/countries?all=true",
        { headers, cache: "no-store" },
      );
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json?.error?.message || "Failed to load countries");
      }
      const list = Array.isArray(json.data?.items)
        ? json.data.items
        : Array.isArray(json.data?.countries)
          ? json.data.countries
          : [];
      setRows(list as CountryRow[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [firebaseUser, authHeaders, canView]);

  useEffect(() => {
    if (authLoading) return;
    loadData();
  }, [authLoading, loadData]);

  function startEdit(row: CountryRow) {
    if (!canManage) return;
    setEditingId(row.id);
    setForm({
      name: row.name,
      code: row.code,
      volumetricDivisor: String(row.volumetricDivisor || 5000),
      enabled: row.enabled !== false,
    });
    setMessage(null);
    setError(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSave(e?: FormEvent) {
    e?.preventDefault();
    if (!canManage || !firebaseUser) return;

    try {
      setSaving(true);
      setError(null);
      setMessage(null);

      if (!form.name.trim() || !form.code.trim()) {
        throw new Error("Name and code are required.");
      }

      const headers = await authHeaders();
      const payload = {
        id: editingId || undefined,
        name: form.name.trim(),
        code: form.code.trim().toUpperCase(),
        volumetricDivisor: Number(form.volumetricDivisor) || 5000,
        enabled: form.enabled,
      };

      const res = await fetch("/api/logistics/masters/countries", {
        method: editingId ? "PUT" : "POST",
        headers,
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json?.error?.message || "Save failed");
      }

      setMessage(editingId ? "Country updated." : "Country created.");
      cancelEdit();
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!canManage || !firebaseUser) return;
    if (!window.confirm("Delete this country?")) return;

    try {
      setError(null);
      const headers = await authHeaders();
      const res = await fetch(
        `/api/logistics/masters/countries?id=${encodeURIComponent(id)}`,
        { method: "DELETE", headers },
      );
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json?.error?.message || "Delete failed");
      }
      setMessage("Country deleted.");
      if (editingId === id) cancelEdit();
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  }

  if (authLoading) {
    return (
      <div className="p-10 text-center text-sm text-slate-500">Loading…</div>
    );
  }

  if (user && !canView) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <h3 className="font-bold text-red-900">Access denied</h3>
        <p className="mt-1 text-sm text-red-800">
          Requires LOGISTICS_MASTERS_VIEW or LOGISTICS_MASTERS_MANAGE.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1000px] space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#087f87]">
            Masters
          </p>
          <h1 className="mt-1 text-2xl font-bold text-[#06284c]">Countries</h1>
          <p className="mt-1 text-sm text-slate-500">
            Destination countries and volumetric weight divisors (e.g. AU ÷
            4000).
          </p>
        </div>
        <button
          type="button"
          onClick={() => loadData()}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {message && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {message}
        </div>
      )}

      {canManage && (
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-[#06284c]">
              {editingId ? "Edit country" : "Add country"}
            </h2>
            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500"
              >
                <X className="h-3.5 w-3.5" />
                Cancel
              </button>
            )}
          </div>
          <form
            onSubmit={handleSave}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-600">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-600">
                Code <span className="text-red-500">*</span>
              </label>
              <input
                value={form.code}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    code: e.target.value.toUpperCase(),
                  }))
                }
                placeholder="US / AU / UK"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-600">
                Volumetric divisor <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min={1}
                value={form.volumetricDivisor}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    volumetricDivisor: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
                required
              />
            </div>
            <div className="flex items-end gap-4">
              <label className="flex items-center gap-2 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={form.enabled}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, enabled: e.target.checked }))
                  }
                  className="h-4 w-4"
                />
                Enabled
              </label>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-lg bg-[#087f87] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60"
              >
                {editingId ? (
                  <Save className="h-4 w-4" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                {saving ? "Saving…" : editingId ? "Update" : "Add"}
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="py-16 text-center text-sm text-slate-500">
            Loading…
          </div>
        ) : rows.length === 0 ? (
          <div className="px-5 py-16 text-center text-sm text-slate-500">
            No countries yet. Add United States (5000), Australia (4000), etc.
          </div>
        ) : (
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Code</th>
                <th className="px-5 py-3">Vol. divisor</th>
                <th className="px-5 py-3">Status</th>
                {canManage && <th className="px-5 py-3">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/50">
                  <td className="px-5 py-3 font-semibold">{row.name}</td>
                  <td className="px-5 py-3 font-mono text-xs">{row.code}</td>
                  <td className="px-5 py-3">÷ {row.volumetricDivisor}</td>
                  <td className="px-5 py-3">
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
                  {canManage && (
                    <td className="px-5 py-3">
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
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}