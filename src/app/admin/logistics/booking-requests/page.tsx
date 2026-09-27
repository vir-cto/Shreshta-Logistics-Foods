"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshCw, Trash2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { can } from "@/lib/permissions";
import type { UserRole } from "@/types/user";

type BookingStatus =
  | "NEW"
  | "CONTACTED"
  | "QUOTED"
  | "CONVERTED"
  | "CANCELLED";

type BookingRow = {
  id: string;
  bookingRequestId: string;
  name: string;
  phone: string;
  email: string | null;
  shipmentType: string;
  origin: string;
  destination: string;
  weight: number | null;
  service: string | null;
  message: string | null;
  status: BookingStatus;
  createdAt: string;
};

type ApiResponse =
  | {
      success: true;
      data:
        | BookingRow[]
        | {
            results?: BookingRow[];
            items?: BookingRow[];
            data?: BookingRow[];
          };
    }
  | {
      success: false;
      error: { code: string; message: string };
    };

const STATUS_OPTIONS: Array<BookingStatus | "ALL"> = [
  "ALL",
  "NEW",
  "CONTACTED",
  "QUOTED",
  "CONVERTED",
  "CANCELLED",
];

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

function formatWhen(value?: string): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

function StatusBadge({ value }: { value: string }) {
  const styles: Record<string, string> = {
    NEW: "bg-cyan-100 text-cyan-800",
    CONTACTED: "bg-amber-100 text-amber-800",
    QUOTED: "bg-blue-100 text-blue-800",
    CONVERTED: "bg-emerald-100 text-emerald-800",
    CANCELLED: "bg-slate-100 text-slate-600",
  };
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
        styles[value] ?? "bg-slate-100 text-slate-600"
      }`}
    >
      {value}
    </span>
  );
}

export default function BookingRequestsPage() {
  const { firebaseUser, user, role, loading: authLoading } = useAuth();
  const permissionUser = toPermissionUser(
    user as { userId?: string; id?: string; role?: string } | null,
    role,
  );

  const canView =
    can(permissionUser, "LOGISTICS_AWB_VIEW") ||
    can(permissionUser, "LOGISTICS_TRACKING_VIEW");
  const canUpdate =
    can(permissionUser, "LOGISTICS_AWB_UPDATE") ||
    can(permissionUser, "LOGISTICS_TRACKING_UPDATE");

  const [rows, setRows] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "ALL">("ALL");
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const authHeaders = useCallback(async (): Promise<HeadersInit> => {
    if (!firebaseUser) throw new Error("Authentication is required.");
    const token = await firebaseUser.getIdToken(true);
    return {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }, [firebaseUser]);

  const load = useCallback(async () => {
    if (!firebaseUser || !canView) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const headers = await authHeaders();
      const qs =
        statusFilter !== "ALL"
          ? `?status=${encodeURIComponent(statusFilter)}`
          : "";
      const res = await fetch(`/api/logistics/book-request${qs}`, {
        method: "GET",
        headers,
        credentials: "include",
        cache: "no-store",
      });
      const json = (await res.json()) as ApiResponse;
      if (!res.ok || !json.success) {
        throw new Error(
          !json.success
            ? json.error.message
            : "Failed to load booking requests.",
        );
      }
      const data = json.data;
      let list: BookingRow[] = [];
      if (Array.isArray(data)) list = data;
      else if (data && typeof data === "object") {
        list =
          data.results ||
          data.items ||
          (Array.isArray(data.data) ? data.data : []) ||
          [];
      }
      setRows(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load.");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [firebaseUser, canView, authHeaders, statusFilter]);

  useEffect(() => {
    if (!authLoading) void load();
  }, [authLoading, load]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      [
        r.name,
        r.phone,
        r.email,
        r.origin,
        r.destination,
        r.shipmentType,
        r.service,
        r.bookingRequestId,
        r.status,
      ]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q)),
    );
  }, [rows, search]);

  async function updateStatus(row: BookingRow, status: BookingStatus) {
    if (!canUpdate || status === row.status) return;
    try {
      setUpdatingId(row.id);
      setError(null);
      const headers = await authHeaders();
      const res = await fetch("/api/logistics/book-request", {
        method: "PATCH",
        headers,
        credentials: "include",
        body: JSON.stringify({
          bookingRequestId: row.bookingRequestId || row.id,
          status,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json?.error?.message || "Failed to update status.");
      }
      setRows((prev) =>
        prev.map((r) => (r.id === row.id ? { ...r, status } : r)),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed.");
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDelete(row: BookingRow) {
    if (!canUpdate) return;
    const ok = window.confirm(
      `Delete booking request from "${row.name}" (${row.phone})?\nThis cannot be undone.`,
    );
    if (!ok) return;

    try {
      setDeletingId(row.id);
      setError(null);
      const headers = await authHeaders();
      const id = encodeURIComponent(row.bookingRequestId || row.id);
      const res = await fetch(
        `/api/logistics/book-request?bookingRequestId=${id}`,
        {
          method: "DELETE",
          headers,
          credentials: "include",
        },
      );
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json?.error?.message || "Failed to delete.");
      }
      setRows((prev) => prev.filter((r) => r.id !== row.id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed.");
    } finally {
      setDeletingId(null);
    }
  }

  const colCount = canUpdate ? 9 : 7;

  if (authLoading) {
    return (
      <div className="p-6 text-sm text-slate-500">Checking authentication…</div>
    );
  }

  if (!canView) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Access restricted</h2>
        <p className="mt-2 text-sm text-slate-500">
          You do not have permission to view booking requests.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#087f87]">
            Logistics
          </p>
          <h2 className="mt-1 text-2xl font-bold text-[#06284c]">
            Booking Requests
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Enquiries from the public{" "}
            <span className="font-medium">Book Freight</span> form.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, phone, origin, destination…"
          className="w-full max-w-md rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-[#087f87]"
        />
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as BookingStatus | "ALL")
          }
          className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s === "ALL" ? "All statuses" : s}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Submitted</th>
                <th className="px-4 py-3 font-semibold">Customer</th>
                <th className="px-4 py-3 font-semibold">Route</th>
                <th className="px-4 py-3 font-semibold">Type / Service</th>
                <th className="px-4 py-3 font-semibold">Weight</th>
                <th className="px-4 py-3 font-semibold">Notes</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                {canUpdate ? (
                  <>
                    <th className="px-4 py-3 font-semibold">Action</th>
                    <th className="px-4 py-3 font-semibold">Delete</th>
                  </>
                ) : null}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={colCount}
                    className="px-4 py-10 text-center text-slate-400"
                  >
                    Loading…
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={colCount}
                    className="px-4 py-10 text-center text-slate-400"
                  >
                    No booking requests found.
                  </td>
                </tr>
              ) : (
                filtered.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/80">
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {formatWhen(row.createdAt)}
                      <div className="mt-0.5 font-mono text-[10px] text-slate-400">
                        {row.bookingRequestId.slice(0, 10)}…
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-800">
                        {row.name}
                      </div>
                      <div className="text-xs text-slate-500">{row.phone}</div>
                      {row.email ? (
                        <div className="text-xs text-slate-400">{row.email}</div>
                      ) : null}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-slate-800">{row.origin || "—"}</div>
                      <div className="text-xs text-slate-500">
                        → {row.destination || "—"}
                      </div>
                    </td>
                    <td className="px-4 py-3 capitalize">
                      {row.shipmentType || "—"}
                      <div className="text-xs text-slate-500">
                        {row.service || "—"}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {row.weight != null ? `${row.weight} kg` : "—"}
                    </td>
                    <td className="max-w-[180px] px-4 py-3 text-xs text-slate-500">
                      {row.message || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge value={row.status} />
                    </td>
                    {canUpdate ? (
                      <>
                        <td className="px-4 py-3">
                          <select
                            value={row.status}
                            disabled={
                              updatingId === row.id || deletingId === row.id
                            }
                            onChange={(e) =>
                              void updateStatus(
                                row,
                                e.target.value as BookingStatus,
                              )
                            }
                            className="rounded-lg border border-slate-300 px-2 py-1.5 text-xs disabled:opacity-50"
                          >
                            {STATUS_OPTIONS.filter((s) => s !== "ALL").map(
                              (s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ),
                            )}
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => void handleDelete(row)}
                            disabled={
                              deletingId === row.id || updatingId === row.id
                            }
                            className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                            title={
                              deletingId === row.id
                                ? "Deleting…"
                                : "Delete request"
                            }
                            aria-label={`Delete booking request from ${row.name}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </>
                    ) : null}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}