"use client";

import { FormEvent, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

type FlagCharges = {
  commercial: number;
  oda: number;
  medicalCharges: number;
};

const EMPTY: FlagCharges = {
  commercial: 0,
  oda: 0,
  medicalCharges: 0,
};

export default function FlagChargesPage() {
  const { firebaseUser, user, loading: authLoading } = useAuth();
  const canManage =
    user?.role === "SUPER_ADMIN" || user?.role === "ADMIN";

  const [form, setForm] = useState<FlagCharges>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

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
      const res = await fetch("/api/logistics/settings/flag-charges", {
        method: "GET",
        headers,
        credentials: "include",
        cache: "no-store",
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json?.error?.message || "Failed to load amounts.");
      }
      const d = json.data || {};
      setForm({
        commercial: Number(d.commercial) || 0,
        oda: Number(d.oda) || 0,
        medicalCharges: Number(d.medicalCharges) || 0,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (authLoading || !firebaseUser) return;
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firebaseUser, authLoading]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canManage) {
      setError("Only Admin / Super Admin can save.");
      return;
    }
    try {
      setSaving(true);
      setError(null);
      setMessage(null);
      const headers = await authHeaders();
      const res = await fetch("/api/logistics/settings/flag-charges", {
        method: "PUT",
        headers,
        credentials: "include",
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json?.error?.message || "Failed to save.");
      }
      setMessage("Amounts saved. Booking will use these for Commercial / ODA / Medical.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-[#087f87]";

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-2xl font-bold text-[#06284c]">Flag charge amounts</h1>
      <p className="mt-1 text-sm text-slate-500">
        Amounts applied on AWB when Commercial, ODA, or Medical Charges is
        checked. Co-loaders cannot edit these.
      </p>

      {message && (
        <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </div>
      )}
      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="mt-5 space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        {loading ? (
          <p className="text-sm text-slate-400">Loading…</p>
        ) : (
          <>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Commercial Charges (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min={0}
                step="0.01"
                value={form.commercial}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    commercial: Number(e.target.value) || 0,
                  }))
                }
                className={inputClass}
                disabled={!canManage}
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                ODA Charges (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min={0}
                step="0.01"
                value={form.oda}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    oda: Number(e.target.value) || 0,
                  }))
                }
                className={inputClass}
                disabled={!canManage}
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Medical Charges (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min={0}
                step="0.01"
                value={form.medicalCharges}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    medicalCharges: Number(e.target.value) || 0,
                  }))
                }
                className={inputClass}
                disabled={!canManage}
                required
              />
            </div>

            {canManage && (
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-[#087f87] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save amounts"}
              </button>
            )}
          </>
        )}
      </form>
    </div>
  );
}