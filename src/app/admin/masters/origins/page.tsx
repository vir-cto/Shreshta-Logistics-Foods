// "use client";

// import { FormEvent, useEffect, useMemo, useState } from "react";
// import { useAuth } from "@/context/AuthContext";

// type OriginStatus = "ACTIVE" | "INACTIVE";

// type Origin = {
//   id: string;
//   originId: string;
//   name: string;
//   code?: string;
//   status: OriginStatus;
// };

// type OriginForm = {
//   name: string;
//   code: string;
//   status: OriginStatus;
// };

// type ApiResponse =
//   | {
//       success: true;
//       data:
//         | Origin
//         | Origin[]
//         | { items?: Origin[]; origins?: Origin[] };
//       message?: string;
//     }
//   | { success: false; error: { code: string; message: string } };

// const EMPTY: OriginForm = { name: "", code: "", status: "ACTIVE" };

// function extractList(data: unknown): Record<string, unknown>[] {
//   if (Array.isArray(data)) return data as Record<string, unknown>[];
//   if (!data || typeof data !== "object") return [];
//   const o = data as Record<string, unknown>;
//   for (const k of ["items", "origins", "results", "data"]) {
//     if (Array.isArray(o[k])) return o[k] as Record<string, unknown>[];
//   }
//   return [];
// }

// function normalize(raw: Record<string, unknown>): Origin | null {
//   const name = String(raw.name || "").trim();
//   if (!name) return null;
//   const originId = String(raw.originId || raw.id || "").trim();
//   if (!originId) return null;
//   const statusRaw = String(raw.status || "ACTIVE").toUpperCase();
//   const enabled =
//     raw.enabled === undefined ? statusRaw !== "INACTIVE" : Boolean(raw.enabled);
//   return {
//     id: String(raw.id || originId),
//     originId,
//     name,
//     code: raw.code ? String(raw.code).trim() : undefined,
//     status: enabled ? "ACTIVE" : "INACTIVE",
//   };
// }

// export default function OriginsPage() {
//   const { firebaseUser, loading: authLoading } = useAuth();
//   const [items, setItems] = useState<Origin[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [message, setMessage] = useState<string | null>(null);
//   const [search, setSearch] = useState("");
//   const [formOpen, setFormOpen] = useState(false);
//   const [editing, setEditing] = useState<Origin | null>(null);
//   const [form, setForm] = useState<OriginForm>(EMPTY);
//   const [reloadKey, setReloadKey] = useState(0);

//   useEffect(() => {
//     if (authLoading) return;
//     let cancelled = false;

//     async function load() {
//       try {
//         setLoading(true);
//         setError(null);
//         if (!firebaseUser) throw new Error("Authentication is required.");

//         const token = await firebaseUser.getIdToken(true);
//         const res = await fetch("/api/logistics/origins", {
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
//               ? json.error?.message || "Failed to load origins."
//               : "Failed to load origins.",
//           );
//         }
//         if (cancelled) return;
//         const list = extractList(json.data)
//           .map((r) => normalize(r))
//           .filter((x): x is Origin => Boolean(x));
//         setItems(list);
//       } catch (e) {
//         if (!cancelled) {
//           setError(e instanceof Error ? e.message : "Failed to load origins.");
//           setItems([]);
//         }
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     }

//     void load();
//     return () => {
//       cancelled = true;
//     };
//   }, [authLoading, firebaseUser, reloadKey]);

//   const filtered = useMemo(() => {
//     const q = search.trim().toLowerCase();
//     if (!q) return items;
//     return items.filter(
//       (o) =>
//         o.name.toLowerCase().includes(q) ||
//         (o.code || "").toLowerCase().includes(q),
//     );
//   }, [items, search]);

//   function openCreate() {
//     setEditing(null);
//     setForm(EMPTY);
//     setFormOpen(true);
//     setMessage(null);
//     setError(null);
//   }

//   function openEdit(o: Origin) {
//     setEditing(o);
//     setForm({
//       name: o.name,
//       code: o.code || "",
//       status: o.status,
//     });
//     setFormOpen(true);
//     setMessage(null);
//     setError(null);
//   }

//   function closeForm() {
//     setFormOpen(false);
//     setEditing(null);
//     setForm(EMPTY);
//   }

//   async function onSubmit(e: FormEvent) {
//     e.preventDefault();
//     try {
//       setSaving(true);
//       setError(null);
//       setMessage(null);
//       if (!firebaseUser) throw new Error("Authentication is required.");
//       if (!form.name.trim()) throw new Error("Origin name is required.");

//       const token = await firebaseUser.getIdToken(true);
//       const payload = {
//         name: form.name.trim(),
//         code: form.code.trim().toUpperCase(),
//         status: form.status,
//         ...(editing ? { originId: editing.originId } : {}),
//       };

//       const res = await fetch("/api/logistics/origins", {
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
//             ? json.error?.message || "Failed to save origin."
//             : "Failed to save origin.",
//         );
//       }

//       setMessage(editing ? "Origin updated." : "Origin created.");
//       closeForm();
//       setReloadKey((v) => v + 1);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Failed to save origin.");
//     } finally {
//       setSaving(false);
//     }
//   }

//   async function toggleStatus(o: Origin) {
//     try {
//       if (!firebaseUser) throw new Error("Authentication is required.");
//       const token = await firebaseUser.getIdToken(true);
//       const next: OriginStatus =
//         o.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
//       const res = await fetch("/api/logistics/origins", {
//         method: "PATCH",
//         headers: {
//           Accept: "application/json",
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ originId: o.originId, status: next }),
//       });
//       const json = (await res.json()) as ApiResponse;
//       if (!res.ok || !json.success) {
//         throw new Error(
//           !json.success
//             ? json.error?.message || "Failed to update status."
//             : "Failed to update status.",
//         );
//       }
//       setReloadKey((v) => v + 1);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Failed to update status.");
//     }
//   }

//   const inputClass =
//     "w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-[#087f87]";

//   return (
//     <div className="p-6">
//       <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
//         <div>
//           <p className="text-xs font-bold uppercase tracking-widest text-[#087f87]">
//             Masters
//           </p>
//           <h2 className="mt-1 text-2xl font-bold text-[#06284c]">Origins</h2>
//           <p className="mt-1 text-sm text-slate-500">
//             Origin locations used on AWB booking (name + code).
//           </p>
//         </div>
//         <button
//           type="button"
//           onClick={openCreate}
//           className="rounded-lg bg-[#087f87] px-4 py-2.5 text-sm font-bold text-white"
//         >
//           + Add Origin
//         </button>
//       </div>

//       <div className="mb-4">
//         <input
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           placeholder="Search name or code…"
//           className="w-full max-w-md rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
//         />
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

//       {loading ? (
//         <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
//           Loading origins…
//         </div>
//       ) : (
//         <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
//           <div className="overflow-x-auto">
//             <table className="min-w-full text-left text-sm">
//               <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
//                 <tr>
//                   <th className="px-4 py-3 font-semibold">Origin</th>
//                   <th className="px-4 py-3 font-semibold">Code</th>
//                   <th className="px-4 py-3 font-semibold">Status</th>
//                   <th className="px-4 py-3 font-semibold text-right">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filtered.length === 0 ? (
//                   <tr>
//                     <td
//                       colSpan={4}
//                       className="px-4 py-8 text-center text-slate-500"
//                     >
//                       No origins yet. Add Guntur, Hyderabad, etc.
//                     </td>
//                   </tr>
//                 ) : (
//                   filtered.map((o) => (
//                     <tr key={o.originId} className="border-t border-slate-100">
//                       <td className="px-4 py-3 font-semibold text-slate-900">
//                         {o.name}
//                       </td>
//                       <td className="px-4 py-3 font-mono text-xs">
//                         {o.code || "—"}
//                       </td>
//                       <td className="px-4 py-3">
//                         <span
//                           className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
//                             o.status === "ACTIVE"
//                               ? "bg-emerald-100 text-emerald-700"
//                               : "bg-slate-100 text-slate-500"
//                           }`}
//                         >
//                           {o.status}
//                         </span>
//                       </td>
//                       <td className="px-4 py-3 text-right">
//                         <div className="flex justify-end gap-2">
//                           <button
//                             type="button"
//                             onClick={() => openEdit(o)}
//                             className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold"
//                           >
//                             Edit
//                           </button>
//                           <button
//                             type="button"
//                             onClick={() => toggleStatus(o)}
//                             className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold"
//                           >
//                             {o.status === "ACTIVE" ? "Deactivate" : "Activate"}
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//           <div className="border-t border-slate-100 px-4 py-3 text-xs text-slate-500">
//             Showing {filtered.length} of {items.length}
//           </div>
//         </div>
//       )}

//       {formOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
//           <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl">
//             <h3 className="text-lg font-bold text-[#06284c]">
//               {editing ? "Edit Origin" : "Add Origin"}
//             </h3>
//             <form onSubmit={onSubmit} className="mt-4 grid gap-3">
//               <div>
//                 <label className="mb-1.5 block text-xs font-bold text-slate-600">
//                   Name <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   value={form.name}
//                   onChange={(e) =>
//                     setForm((p) => ({ ...p, name: e.target.value }))
//                   }
//                   required
//                   className={inputClass}
//                   placeholder="e.g. Guntur"
//                 />
//               </div>
//               <div>
//                 <label className="mb-1.5 block text-xs font-bold text-slate-600">
//                   Code <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   value={form.code}
//                   onChange={(e) =>
//                     setForm((p) => ({
//                       ...p,
//                       code: e.target.value.toUpperCase(),
//                     }))
//                   }
//                   className={inputClass}
//                   placeholder="e.g. GNT"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="mb-1.5 block text-xs font-bold text-slate-600">
//                   Status <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   value={form.status}
//                   onChange={(e) =>
//                     setForm((p) => ({
//                       ...p,
//                       status: e.target.value as OriginStatus,
//                     }))
//                   }
//                   className={inputClass}
//                 >
//                   <option value="ACTIVE">ACTIVE</option>
//                   <option value="INACTIVE">INACTIVE</option>
//                 </select>
//               </div>
//               <div className="mt-2 flex justify-end gap-2">
//                 <button
//                   type="button"
//                   onClick={closeForm}
//                   className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold"
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
//                     ? "Saving…"
//                     : editing
//                       ? "Update Origin"
//                       : "Create Origin"}
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
import { useAuth } from "@/context/AuthContext";
import { Pencil, Trash2 } from "lucide-react";

type OriginStatus = "ACTIVE" | "INACTIVE";

type Origin = {
  id: string;
  originId: string;
  name: string;
  code?: string;
  state?: string;
  country: string;
  status: OriginStatus;
  enabled?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

type OriginForm = {
  name: string;
  code: string;
  state: string;
  country: string;
  status: OriginStatus;
};

type ApiResponse =
  | {
      success: true;
      data:
        | Origin
        | Origin[]
        | {
            items?: Origin[];
            origins?: Origin[];
            results?: Origin[];
          };
      message?: string;
    }
  | {
      success: false;
      error: { code: string; message: string };
    };

const EMPTY_FORM: OriginForm = {
  name: "",
  code: "",
  state: "",
  country: "",
  status: "ACTIVE",
};

function extractList(data: unknown): Record<string, unknown>[] {
  if (Array.isArray(data)) return data as Record<string, unknown>[];
  if (!data || typeof data !== "object") return [];
  const o = data as Record<string, unknown>;
  for (const k of ["items", "origins", "results", "data"]) {
    if (Array.isArray(o[k])) return o[k] as Record<string, unknown>[];
  }
  return [];
}

function normalize(raw: Record<string, unknown>): Origin | null {
  const name = String(raw.name || "").trim();
  if (!name) return null;

  const originId = String(raw.originId || raw.id || "").trim();
  if (!originId) return null;

  const statusRaw = String(raw.status || "ACTIVE").toUpperCase();
  const enabled =
    raw.enabled === undefined
      ? statusRaw !== "INACTIVE"
      : Boolean(raw.enabled);

  return {
    id: String(raw.id || originId),
    originId,
    name,
    code: raw.code ? String(raw.code).trim() : undefined,
    state: raw.state ? String(raw.state).trim() : undefined,
    country: String(raw.country || "").trim(),
    status: enabled ? "ACTIVE" : "INACTIVE",
    enabled,
    createdAt: raw.createdAt ? String(raw.createdAt) : undefined,
    updatedAt: raw.updatedAt ? String(raw.updatedAt) : undefined,
  };
}

function toForm(origin?: Origin | null): OriginForm {
  if (!origin) return { ...EMPTY_FORM };
  return {
    name: origin.name || "",
    code: origin.code || "",
    state: origin.state || "",
    country: origin.country || "",
    status: origin.status || "ACTIVE",
  };
}

export default function OriginsPage() {
  const { firebaseUser, user, loading: authLoading } = useAuth();

  const [items, setItems] = useState<Origin[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | OriginStatus>("ALL");
  const [reloadKey, setReloadKey] = useState(0);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Origin | null>(null);
  const [form, setForm] = useState<OriginForm>(EMPTY_FORM);

  useEffect(() => {
    if (authLoading) return;
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        if (!firebaseUser) {
          throw new Error("Authentication is required to manage origins.");
        }

        const token = await firebaseUser.getIdToken(true);
        const res = await fetch("/api/logistics/origins", {
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
              ? json.error?.message || "Failed to load origins."
              : "Failed to load origins.",
          );
        }

        if (cancelled) return;

        const list = extractList(json.data)
          .map((r) => normalize(r))
          .filter((x): x is Origin => Boolean(x));
        setItems(list);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load origins.");
          setItems([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [authLoading, firebaseUser, reloadKey]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((item) => {
      if (statusFilter !== "ALL" && item.status !== statusFilter) return false;
      if (!q) return true;
      return [item.originId, item.name, item.code, item.state, item.country]
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

  function openEdit(o: Origin) {
    setEditing(o);
    setForm(toForm(o));
    setFormOpen(true);
    setMessage(null);
    setError(null);
  }

  function closeForm() {
    setFormOpen(false);
    setEditing(null);
    setForm({ ...EMPTY_FORM });
  }

  function updateForm<K extends keyof OriginForm>(key: K, value: OriginForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setSaving(true);
      setError(null);
      setMessage(null);

      if (!firebaseUser) throw new Error("Authentication is required.");

      const name = form.name.trim();
      const country = form.country.trim();
      if (!name) throw new Error("Origin name is required.");
      if (!country) throw new Error("Country is required.");

      const token = await firebaseUser.getIdToken(true);

      const payload = {
        name,
        code: form.code.trim(),
        state: form.state.trim(),
        country,
        status: form.status,
        ...(editing ? { originId: editing.originId } : {}),
      };

      const res = await fetch("/api/logistics/origins", {
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
            ? json.error?.message || "Failed to save origin."
            : "Failed to save origin.",
        );
      }

      setMessage(
        editing ? "Origin updated successfully." : "Origin created successfully.",
      );
      closeForm();
      setReloadKey((v) => v + 1);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save origin.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleStatus(o: Origin) {
    try {
      setError(null);
      setMessage(null);
      if (!firebaseUser) throw new Error("Authentication is required.");

      const token = await firebaseUser.getIdToken(true);
      const nextStatus: OriginStatus =
        o.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

      const res = await fetch("/api/logistics/origins", {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ originId: o.originId, status: nextStatus }),
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
        `Origin marked as ${nextStatus === "ACTIVE" ? "active" : "inactive"}.`,
      );
      setReloadKey((v) => v + 1);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update status.");
    }
  }

    async function handleDelete(o: Origin) {
    const ok = window.confirm(
      `Delete origin "${o.name}"?\nThis cannot be undone.`,
    );
    if (!ok) return;

    try {
      setError(null);
      setMessage(null);
      if (!firebaseUser) throw new Error("Authentication is required.");

      const token = await firebaseUser.getIdToken(true);
      const res = await fetch(
        `/api/logistics/origins?id=${encodeURIComponent(o.originId)}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const json = (await res.json()) as ApiResponse;
      if (!res.ok || !json.success) {
        throw new Error(
          !json.success
            ? json.error?.message || "Failed to delete origin."
            : "Failed to delete origin.",
        );
      }

      setMessage(`Origin "${o.name}" deleted.`);
      setReloadKey((v) => v + 1);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete origin.");
    }
  }

  const inputClass =
    "h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-[#087f87] focus:ring-2 focus:ring-cyan-100";

  return (
    <div className="mx-auto max-w-[1400px]">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#087f87]">
            Masters
          </p>
          <h2 className="mt-1 text-2xl font-bold text-[#06284c]">Origins</h2>
          <p className="mt-1 text-sm text-slate-500">
            Manage origin locations used on AWB booking.
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
            + Add Origin
          </button>
        </div>
      </div>

      <div className="mb-5 grid gap-3 md:grid-cols-[1fr_180px]">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, state, code..."
          className={inputClass}
        />
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as "ALL" | OriginStatus)
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
          <h3 className="text-lg font-bold text-[#06284c]">Loading origins...</h3>
        </div>
      ) : !firebaseUser ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-10 text-center text-sm text-red-700">
          Authentication is required to manage origins.
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
          <h3 className="text-lg font-bold text-[#06284c]">No origins found</h3>
          <p className="mt-2 text-sm text-slate-500">
            {items.length === 0
              ? "Create the first origin for AWB booking."
              : "No origins match your search or filter."}
          </p>
          {items.length === 0 && (
            <button
              type="button"
              onClick={openCreate}
              className="mt-5 rounded-lg bg-[#087f87] px-4 py-2.5 text-sm font-bold text-white"
            >
              + Add Origin
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Origin</th>
                  <th className="px-4 py-3 font-semibold">Code</th>
                  <th className="px-4 py-3 font-semibold">State</th>
                  <th className="px-4 py-3 font-semibold">Country</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((origin) => (
                  <tr
                    key={origin.originId}
                    className="border-t border-slate-100"
                  >
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900">
                        {origin.name}
                      </div>
                      <div className="mt-0.5 text-xs text-slate-500">
                        {origin.originId}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {origin.code || "—"}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {origin.state || "—"}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {origin.country || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                          origin.status === "ACTIVE"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {origin.status}
                      </span>
                    </td>
                    {/* <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(origin)}
                          className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleStatus(origin)}
                          className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          {origin.status === "ACTIVE"
                            ? "Deactivate"
                            : "Activate"}
                        </button>
                      </div>
                    </td> */}

                                        <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(origin)}
                          title="Edit"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleStatus(origin)}
                          className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          {origin.status === "ACTIVE"
                            ? "Deactivate"
                            : "Activate"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(origin)}
                          title="Delete"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-red-200 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-slate-100 px-4 py-3 text-xs text-slate-500">
            Showing {filtered.length} of {items.length} origins
          </div>
        </div>
      )}

      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-[#06284c]">
                  {editing ? "Edit origin" : "Add origin"}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  {editing
                    ? `Updating ${editing.originId}`
                    : "Create an origin for AWB booking."}
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

            <form
              onSubmit={handleSubmit}
              className="grid gap-4 sm:grid-cols-2"
            >
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Origin Name <span className="text-red-400">*</span>
                </label>
                <input
                  value={form.name}
                  onChange={(e) => updateForm("name", e.target.value)}
                  className={inputClass}
                  placeholder="Guntur"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Code
                </label>
                <input
                  value={form.code}
                  onChange={(e) => updateForm("code", e.target.value)}
                  className={inputClass}
                  placeholder="GNT"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  State <span className="text-red-400">*</span>
                </label>
                <input
                  value={form.state}
                  onChange={(e) => updateForm("state", e.target.value)}
                  className={inputClass}
                  placeholder="Andhra Pradesh"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Country <span className="text-red-400">*</span>
                </label>
                <input
                  value={form.country}
                  onChange={(e) => updateForm("country", e.target.value)}
                  className={inputClass}
                  placeholder="India"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    updateForm("status", e.target.value as OriginStatus)
                  }
                  className={inputClass}
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
                      ? "Update Origin"
                      : "Create Origin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}