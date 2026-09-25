"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";

type ProductStatus = "ACTIVE" | "INACTIVE";

type LogisticsProduct = {
  id: string;
  productId: string;
  name: string;
  code?: string;
  description?: string;
  status: ProductStatus;
  enabled?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

type ProductForm = {
  name: string;
  code: string;
  description: string;
  status: ProductStatus;
};

type ApiResponse =
  | {
      success: true;
      data:
        | LogisticsProduct
        | LogisticsProduct[]
        | { items?: LogisticsProduct[]; products?: LogisticsProduct[] };
      message?: string;
    }
  | {
      success: false;
      error: { code: string; message: string };
    };

const EMPTY_FORM: ProductForm = {
  name: "",
  code: "",
  description: "",
  status: "ACTIVE",
};

function extractList(data: unknown): Record<string, unknown>[] {
  if (Array.isArray(data)) return data as Record<string, unknown>[];
  if (!data || typeof data !== "object") return [];
  const obj = data as Record<string, unknown>;
  for (const key of ["items", "products", "results", "data"]) {
    if (Array.isArray(obj[key])) return obj[key] as Record<string, unknown>[];
  }
  return [];
}

function normalizeProduct(raw: Record<string, unknown>): LogisticsProduct | null {
  const productId = String(raw.productId || raw.id || "").trim();
  const name = String(raw.name || "").trim();
  if (!productId || !name) return null;
  const statusRaw = String(raw.status || "ACTIVE").toUpperCase();
  const enabled =
    raw.enabled === undefined
      ? statusRaw !== "INACTIVE"
      : Boolean(raw.enabled);
  return {
    id: String(raw.id || productId),
    productId,
    name,
    code: String(raw.code || "").trim() || undefined,
    description: String(raw.description || "").trim() || undefined,
    status: enabled ? "ACTIVE" : "INACTIVE",
    enabled,
    createdAt: String(raw.createdAt || ""),
    updatedAt: String(raw.updatedAt || ""),
  };
}

function toForm(p?: LogisticsProduct | null): ProductForm {
  if (!p) return { ...EMPTY_FORM };
  return {
    name: p.name || "",
    code: p.code || "",
    description: p.description || "",
    status: p.status === "INACTIVE" ? "INACTIVE" : "ACTIVE",
  };
}

export default function LogisticsProductsPage() {
  const { firebaseUser, user, loading: authLoading } = useAuth();
  const canManage =
    user?.role === "SUPER_ADMIN" ||
    user?.role === "ADMIN" ||
    user?.role === "CO_LOADER";

  const [items, setItems] = useState<LogisticsProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<LogisticsProduct | null>(null);
  const [form, setForm] = useState<ProductForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  async function authHeaders(): Promise<HeadersInit> {
    if (!firebaseUser) throw new Error("Authentication is required.");
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
      const res = await fetch("/api/logistics/shipment-products", {
        method: "GET",
        headers,
        credentials: "include",
        cache: "no-store",
      });
      const json = (await res.json()) as ApiResponse;
      if (!res.ok || !json.success) {
        throw new Error(
          !json.success ? json.error.message : "Failed to load products.",
        );
      }
      const list = extractList(json.data)
        .map((row) => normalizeProduct(row))
        .filter(Boolean) as LogisticsProduct[];
      setItems(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load products.");
      setItems([]);
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

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((p) =>
      [p.name, p.code, p.productId, p.description, p.status]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [items, search]);

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormOpen(true);
    setMessage(null);
    setError(null);
  }

  function openEdit(p: LogisticsProduct) {
    setEditing(p);
    setForm(toForm(p));
    setFormOpen(true);
    setMessage(null);
    setError(null);
  }

  function closeForm() {
    setFormOpen(false);
    setEditing(null);
    setForm(EMPTY_FORM);
  }

  function updateForm<K extends keyof ProductForm>(key: K, value: ProductForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canManage) {
      setError("You do not have permission to manage products.");
      return;
    }
    if (!form.name.trim()) {
      setError("Product name is required.");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setMessage(null);
      const headers = await authHeaders();
      const body = {
        name: form.name.trim(),
        code: form.code.trim() || null,
        description: form.description.trim() || null,
        status: form.status,
        ...(editing ? { productId: editing.productId } : {}),
        };

      const res = await fetch("/api/logistics/shipment-products", {
        method: editing ? "PATCH" : "POST",
        headers,
        credentials: "include",
        body: JSON.stringify(body),
      });
      const json = (await res.json()) as ApiResponse;
      if (!res.ok || !json.success) {
        throw new Error(
          !json.success
            ? json.error.message
            : editing
              ? "Failed to update product."
              : "Failed to create product.",
        );
      }
      setMessage(editing ? "Product updated." : "Product created.");
      closeForm();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleStatus(p: LogisticsProduct) {
    if (!canManage) return;
    try {
      setError(null);
      const headers = await authHeaders();
      const next: ProductStatus =
        p.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      const res = await fetch("/api/logistics/shipment-products", {
        method: "PATCH",
        headers,
        credentials: "include",
        body: JSON.stringify({ productId: p.productId, status: next }),
      });
      const json = (await res.json()) as ApiResponse;
      if (!res.ok || !json.success) {
        throw new Error(
          !json.success ? json.error.message : "Failed to update status.",
        );
      }
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Status update failed.");
    }
  }

  const inputClass =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#087f87] focus:ring-2 focus:ring-cyan-100";

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#06284c]">Products</h1>
          <p className="mt-1 text-sm text-slate-500">
            Logistics products used on AWB booking (Service Details).
          </p>
        </div>
        {canManage ? (
          <button
            type="button"
            onClick={openCreate}
            className="rounded-lg bg-[#087f87] px-4 py-2.5 text-sm font-bold text-white"
          >
            + Add Product
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

      <div className="mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, code..."
          className="w-full max-w-md rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-[#087f87]"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Code</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-slate-400">
                    Loading…
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-slate-400">
                    No products yet. Add one to use in booking.
                  </td>
                </tr>
              ) : (
                filtered.map((row) => (
                  <tr key={row.productId} className="hover:bg-slate-50/80">
                    <td className="px-5 py-4 font-semibold text-slate-800">
                      {row.name}
                      {row.description ? (
                        <div className="mt-0.5 text-xs font-normal text-slate-400">
                          {row.description}
                        </div>
                      ) : null}
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-slate-600">
                      {row.code || "—"}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                          row.status === "ACTIVE"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        {canManage ? (
                          <>
                            <button
                              type="button"
                              onClick={() => openEdit(row)}
                              className="text-xs font-bold text-[#087f87]"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => toggleStatus(row)}
                              className="text-xs font-bold text-slate-600"
                            >
                              {row.status === "ACTIVE" ? "Disable" : "Enable"}
                            </button>
                          </>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-4">
          <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
            <div className="flex shrink-0 items-start justify-between border-b px-5 py-4">
              <div>
                <h2 className="text-lg font-bold text-[#06284c]">
                  {editing ? "Edit product" : "Add product"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Shown in AWB → Services Details → Product.
                </p>
              </div>
              <button
                type="button"
                onClick={closeForm}
                className="text-sm font-semibold text-slate-500"
              >
                Close
              </button>
            </div>

            <form
              id="product-form"
              onSubmit={handleSubmit}
              className="min-h-0 flex-1 overflow-y-auto p-5"
            >
              <div className="grid gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={form.name}
                    onChange={(e) => updateForm("name", e.target.value)}
                    className={inputClass}
                    placeholder="e.g. NON-DOX, Documents, Cargo"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={form.code}
                    onChange={(e) => updateForm("code", e.target.value)}
                    className={inputClass}
                    placeholder="Optional short code"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Description
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => updateForm("description", e.target.value)}
                    rows={2}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      updateForm("status", e.target.value as ProductStatus)
                    }
                    className={inputClass}
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              </div>
            </form>

            <div className="flex shrink-0 justify-end gap-2 border-t px-5 py-4">
              <button
                type="button"
                onClick={closeForm}
                className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                form="product-form"
                disabled={saving || !firebaseUser}
                className="rounded-lg bg-[#087f87] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : editing
                    ? "Update Product"
                    : "Create Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}