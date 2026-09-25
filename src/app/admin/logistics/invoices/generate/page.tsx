"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { can } from "@/lib/permissions";

type ApiResponse =
  | {
      success: true;
      data?: {
        invoice?: { invoiceId?: string; invoiceNumber?: string };
        invoices?: Array<{ invoiceId?: string; invoiceNumber?: string }>;
      };
      message?: string;
    }
  | {
      success: false;
      error: { code: string; message: string } | string;
    };

export default function GenerateInvoicePage() {
  const router = useRouter();
  const { user, firebaseUser, loading: authLoading } = useAuth();

  const permUser = {
    userId: user?.userId ?? "",
    role: user?.role ?? null,
  };

  const canCreate =
    can(permUser, "LOGISTICS_INVOICE_CREATE") ||
    can(permUser, "LOGISTICS_AWB_CREATE");

  const [awb, setAwb] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const value = awb.trim().toUpperCase();
    if (!value) {
      setError("Enter an AWB number.");
      return;
    }
    if (!firebaseUser) {
      setError("Authentication is required.");
      return;
    }
    if (!canCreate) {
      setError("You do not have permission to generate invoices.");
      return;
    }

    try {
      setSubmitting(true);
      const token = await firebaseUser.getIdToken(true);
      const res = await fetch("/api/invoices/generate", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({ awb: value }),
      });

      const json = (await res.json()) as ApiResponse;

      if (!res.ok || !json.success) {
        const msg =
          !json.success && typeof json.error === "object"
            ? json.error.message
            : !json.success && typeof json.error === "string"
              ? json.error
              : "Failed to generate invoice.";
        throw new Error(msg);
      }

      const first =
        json.data?.invoice ||
        (Array.isArray(json.data?.invoices) ? json.data.invoices[0] : null);

      const invoiceId = first?.invoiceId?.trim();
      if (!invoiceId) {
        setMessage(
          json.message ||
            "Invoice generated, but no invoiceId was returned. Check the invoices list.",
        );
        return;
      }

      setMessage(json.message || "Invoice generated.");
      router.push(
        `/admin/logistics/invoices/${encodeURIComponent(invoiceId)}`,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate invoice.");
    } finally {
      setSubmitting(false);
    }
  }

  if (authLoading) {
    return (
      <div className="p-6 text-sm text-slate-500">Loading…</div>
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-6 p-4 md:p-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-[#087f87]">
          Logistics
        </p>
        <h1 className="mt-1 text-2xl font-bold text-[#06284c]">
          Generate Invoice
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Create a logistics invoice from an existing AWB.
        </p>
      </div>

      {!canCreate ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          You do not have permission to generate invoices.
        </div>
      ) : (
        <form
          onSubmit={onSubmit}
          className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-600">
              AWB *
            </label>
            <input
              value={awb}
              onChange={(e) => setAwb(e.target.value)}
              placeholder="Enter AWB number"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
              disabled={submitting}
            />
          </div>

          {error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          ) : null}
          {message ? (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
              {message}
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-[#087f87] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60"
            >
              {submitting ? "Generating…" : "Generate Invoice"}
            </button>
            <Link
              href="/admin/logistics/invoices"
              className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700"
            >
              Back to Invoices
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}