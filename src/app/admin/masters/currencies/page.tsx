"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Pencil, Trash2 } from "lucide-react";

type CurrencyRow = {
  id: string;
  code: string;
  name: string;
  symbol: string;
  enabled: boolean;
  isBase: boolean;
  rateToBase: number;
  sortOrder: number;
};

type FormState = {
  code: string;
  name: string;
  symbol: string;
  rateToBase: string;
  isBase: boolean;
  enabled: boolean;
};

const EMPTY: FormState = {
  code: "",
  name: "",
  symbol: "",
  rateToBase: "1",
  isBase: false,
  enabled: true,
};

function extractList(data: unknown): Record<string, unknown>[] {
  if (Array.isArray(data)) return data as Record<string, unknown>[];
  if (data && typeof data === "object") {
    const o = data as Record<string, unknown>;
    for (const k of ["items", "results", "data"]) {
      if (Array.isArray(o[k])) return o[k] as Record<string, unknown>[];
    }
  }
  return [];
}

export default function CurrenciesMasterPage() {
  const { firebaseUser, user, loading: authLoading } = useAuth();
  const canManage =
    user?.role === "SUPER_ADMIN" || user?.role === "ADMIN";

  const [rows, setRows] = useState<CurrencyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<CurrencyRow | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [saving, setSaving] = useState(false);

  async function authHeaders(): Promise<HeadersInit> {
    if (!firebaseUser) throw new Error("Authentication required");
    const token = await firebaseUser.getIdToken(true);
    return {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const headers = await authHeaders();
      const res = await fetch("/api/logistics/masters/currencies", {
        method: "GET",
        headers,
        credentials: "include",
        cache: "no-store",
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json?.error?.message || "Failed to load currencies");
      }
      const list = extractList(json.data).map((r) => ({
        id: String(r.id),
        code: String(r.code || "").toUpperCase(),
        name: String(r.name || ""),
        symbol: String(r.symbol || r.code || ""),
        enabled: r.enabled !== false,
        isBase: Boolean(r.isBase),
        rateToBase: Number(r.rateToBase) || 1,
        sortOrder: Number(r.sortOrder) || 0,
      }));
      setRows(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Load failed");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (authLoading) return;
    if (!firebaseUser) {
      setLoading(false);
      setError("Authentication is required.");
      return;
    }
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firebaseUser, authLoading]);

  function openCreate() {
    setEditing(null);
    setForm(EMPTY);
    setFormOpen(true);
    setMessage(null);
    setError(null);
  }

  function openEdit(row: CurrencyRow) {
    setEditing(row);
    setForm({
      code: row.code,
      name: row.name,
      symbol: row.symbol,
      rateToBase: String(row.rateToBase),
      isBase: row.isBase,
      enabled: row.enabled,
    });
    setFormOpen(true);
    setMessage(null);
    setError(null);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canManage) {
      setError("Only admin can manage currencies.");
      return;
    }
    try {
      setSaving(true);
      setError(null);
      const headers = await authHeaders();
      const body = editing
        ? {
            id: editing.id,
            name: form.name.trim(),
            symbol: form.symbol.trim(),
            rateToBase: Number(form.rateToBase),
            isBase: form.isBase,
            enabled: form.enabled,
          }
        : {
            code: form.code.trim().toUpperCase(),
            name: form.name.trim(),
            symbol: form.symbol.trim() || form.code.trim().toUpperCase(),
            rateToBase: Number(form.rateToBase),
            isBase: form.isBase,
            enabled: form.enabled,
          };

      const res = await fetch("/api/logistics/masters/currencies", {
        method: editing ? "PATCH" : "POST",
        headers,
        credentials: "include",
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json?.error?.message || "Save failed");
      }
      setMessage(editing ? "Currency updated." : "Currency created.");
      setFormOpen(false);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function toggleEnabled(row: CurrencyRow) {
    if (!canManage) return;
    try {
      const headers = await authHeaders();
      const res = await fetch("/api/logistics/masters/currencies", {
        method: "PATCH",
        headers,
        credentials: "include",
        body: JSON.stringify({ id: row.id, enabled: !row.enabled }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json?.error?.message || "Update failed");
      }
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    }
  }

    async function handleDelete(row: CurrencyRow) {
    if (!canManage) return;
    if (row.isBase) {
      setError("Cannot delete the base currency. Set another as base first.");
      return;
    }

    const ok = window.confirm(
      `Delete currency "${row.code}" (${row.name})?\nThis cannot be undone.`,
    );
    if (!ok) return;

    try {
      setError(null);
      setMessage(null);
      const headers = await authHeaders();
      const res = await fetch(
        `/api/logistics/masters/currencies?id=${encodeURIComponent(row.id)}`,
        {
          method: "DELETE",
          headers,
          credentials: "include",
        },
      );
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json?.error?.message || "Delete failed");
      }
      setMessage(`Currency ${row.code} deleted.`);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  }

  const inputClass =
    "w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-[#087f87]";

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#06284c]">Currencies</h1>
          <p className="mt-1 text-sm text-slate-500">
            Admin sets daily rate to base (INR). Booking uses these for
            shipment value and charge labels.
          </p>
        </div>
        {canManage ? (
          <button
            type="button"
            onClick={openCreate}
            className="rounded-lg bg-[#087f87] px-4 py-2.5 text-sm font-bold text-white"
          >
            + Add Currency
          </button>
        ) : null}
      </div>

      {message ? (
        <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </div>
      ) : null}
      {error ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Symbol</th>
              <th className="px-4 py-3">Rate → base</th>
              <th className="px-4 py-3">Base?</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                  Loading…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                  No currencies yet. Add INR (base) and USD, etc.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/80">
                  <td className="px-4 py-3 font-mono font-semibold">{row.code}</td>
                  <td className="px-4 py-3">{row.name}</td>
                  <td className="px-4 py-3 text-lg">{row.symbol}</td>
                  <td className="px-4 py-3 font-semibold">{row.rateToBase}</td>
                  <td className="px-4 py-3">{row.isBase ? "Yes" : "—"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                        row.enabled
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {row.enabled ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </td>
                  {/* <td className="px-4 py-3">
                    {canManage ? (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(row)}
                          className="text-xs font-bold text-[#087f87]"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleEnabled(row)}
                          className="text-xs font-bold text-slate-600"
                        >
                          {row.enabled ? "Disable" : "Enable"}
                        </button>
                      </div>
                    ) : (
                      "—"
                    )}
                  </td> */}

                                    <td className="px-4 py-3">
                    {canManage ? (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(row)}
                          title="Edit"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleEnabled(row)}
                          className="rounded-md border border-slate-300 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                        >
                          {row.enabled ? "Disable" : "Enable"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(row)}
                          title={row.isBase ? "Cannot delete base currency" : "Delete"}
                          disabled={row.isBase}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-red-200 text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {formOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl border bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <h2 className="text-lg font-bold text-[#06284c]">
                {editing ? `Edit ${editing.code}` : "Add currency"}
              </h2>
              <button type="button" onClick={() => setFormOpen(false)} className="text-sm text-slate-500">
                Close
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3 p-5">
              {!editing ? (
                <div>
                  <label className="mb-1 block text-sm font-medium">Code *</label>
                  <input
                    value={form.code}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))
                    }
                    className={inputClass}
                    placeholder="USD"
                    required
                  />
                </div>
              ) : null}
              <div>
                <label className="mb-1 block text-sm font-medium">Name *</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  className={inputClass}
                  placeholder="US Dollar"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Symbol</label>
                <input
                  value={form.symbol}
                  onChange={(e) => setForm((p) => ({ ...p, symbol: e.target.value }))}
                  className={inputClass}
                  placeholder="$"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Rate to base (1 unit = ? INR) *
                </label>
                <input
                  type="number"
                  min={0.0001}
                  step="any"
                  value={form.rateToBase}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, rateToBase: e.target.value }))
                  }
                  className={inputClass}
                  required
                  disabled={form.isBase}
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  Update this daily for non-base currencies. Base is always 1.
                </p>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.isBase}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      isBase: e.target.checked,
                      rateToBase: e.target.checked ? "1" : p.rateToBase,
                    }))
                  }
                />
                Base currency (INR)
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.enabled}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, enabled: e.target.checked }))
                  }
                />
                Enabled
              </label>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="rounded-lg border px-4 py-2 text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-[#087f87] px-4 py-2 text-sm font-bold text-white disabled:opacity-60"
                >
                  {saving ? "Saving…" : editing ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}