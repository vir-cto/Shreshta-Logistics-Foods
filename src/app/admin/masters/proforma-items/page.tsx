"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Pencil, Trash2, RefreshCw } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

type CatalogItem = {
  id: string;
  catalogItemId: string;
  description: string;
  shopName: string;
  shopAddress: string;
  hsCode: string;
  defaultRate: number;
  defaultQty: number;
  enabled: boolean;
};

const emptyForm = {
  description: "",
  shopName: "",
  shopAddress: "",
  hsCode: "",
  defaultRate: 0,
  defaultQty: 1,
  enabled: true,
};

export default function ProformaItemsMasterPage() {
  const { firebaseUser, user } = useAuth();
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const isAdmin =
    user?.role === "SUPER_ADMIN" || user?.role === "ADMIN";

  const load = useCallback(async () => {
    if (!firebaseUser) return;
    setLoading(true);
    setError(null);
    try {
      const token = await firebaseUser.getIdToken(true);
      const res = await fetch("/api/logistics/proforma-catalog?enabled=false", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json?.error?.message || "Failed to load items.");
      }
      setItems(json.data || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load.");
    } finally {
      setLoading(false);
    }
  }, [firebaseUser]);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (item: CatalogItem) => {
    setEditingId(item.id);
    setForm({
      description: item.description,
      shopName: item.shopName,
      shopAddress: item.shopAddress,
      hsCode: item.hsCode,
      defaultRate: item.defaultRate,
      defaultQty: item.defaultQty,
      enabled: item.enabled,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!firebaseUser || !form.description.trim()) {
      setError("Description is required.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const token = await firebaseUser.getIdToken(true);
      const method = editingId ? "PUT" : "POST";
      const body = editingId ? { id: editingId, ...form } : form;

      const res = await fetch("/api/logistics/proforma-catalog", {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json?.error?.message || "Save failed.");
      }
      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!firebaseUser || !confirm("Delete this catalog item?")) return;
    try {
      const token = await firebaseUser.getIdToken(true);
      const res = await fetch(`/api/logistics/proforma-catalog?id=${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json?.error?.message || "Delete failed.");
      }
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed.");
    }
  };

  if (!isAdmin) {
    return (
      <div className="p-6">
        <p className="text-sm text-red-600">Only Super Admin / Admin can manage Proforma Items.</p>
      </div>
    );
  }

  const input =
    "h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-slate-600";

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Proforma Items</h1>
          <p className="mt-1 text-sm text-gray-500">
            Add items manually. Agents will pick them from a dropdown on booking — Description, Shop and HS Code fill automatically.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={load}
            className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" />
            Add Item
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {showForm && (
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-slate-800">
            {editingId ? "Edit Item" : "New Item"}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-gray-600">Description <span className="text-red-500">*</span></label>
              <input
                className={input}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="e.g. KIDS WEAR TSHIRT MADE OF 100% COTTON"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Shop Name <span className="text-red-500">*</span></label>
              <input
                className={input}
                value={form.shopName}
                onChange={(e) => setForm({ ...form, shopName: e.target.value })}
                placeholder="Shop name"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">HS Code <span className="text-red-500">*</span></label>
              <input
                className={input}
                value={form.hsCode}
                onChange={(e) => setForm({ ...form, hsCode: e.target.value })}
                placeholder="e.g. 6109901009"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-gray-600">Shop Address <span className="text-red-500">*</span></label>
              <input
                className={input}
                value={form.shopAddress}
                onChange={(e) => setForm({ ...form, shopAddress: e.target.value })}
                placeholder="Full shop address"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Default Rate <span className="text-red-500">*</span></label>
              <input
                type="number"
                min={0}
                step="0.01"
                className={input}
                value={form.defaultRate}
                onChange={(e) => setForm({ ...form, defaultRate: Number(e.target.value) || 0 })}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Default Qty <span className="text-red-500">*</span></label>
              <input
                type="number"
                min={1}
                className={input}
                value={form.defaultQty}
                onChange={(e) => setForm({ ...form, defaultQty: Number(e.target.value) || 1 })}
                required
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                id="enabled"
                type="checkbox"
                checked={form.enabled}
                onChange={(e) => setForm({ ...form, enabled: e.target.checked })}
              />
              <label htmlFor="enabled" className="text-sm text-gray-700">Enabled (show in booking dropdown)</label>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
              }}
              className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
        <table className="w-full min-w-[800px] text-sm">
          <thead>
            <tr className="bg-slate-800 text-left text-xs font-semibold uppercase text-white">
              <th className="px-3 py-3">Description</th>
              <th className="px-3 py-3">Shop Name</th>
              <th className="px-3 py-3">HS Code</th>
              <th className="px-3 py-3">Rate</th>
              <th className="px-3 py-3">Qty</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3 w-24">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-3 py-8 text-center text-gray-500">
                  Loading…
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-3 py-8 text-center text-gray-500">
                  No items yet. Click <strong>Add Item</strong> and fill the empty fields.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-3 py-2.5">{item.description}</td>
                  <td className="px-3 py-2.5">{item.shopName || "—"}</td>
                  <td className="px-3 py-2.5 font-mono text-xs">{item.hsCode || "—"}</td>
                  <td className="px-3 py-2.5">{item.defaultRate}</td>
                  <td className="px-3 py-2.5">{item.defaultQty}</td>
                  <td className="px-3 py-2.5">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        item.enabled
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {item.enabled ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => openEdit(item)}
                        className="rounded p-1.5 text-gray-500 hover:bg-slate-100 hover:text-slate-800"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}