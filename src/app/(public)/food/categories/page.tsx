"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type CategoryCard = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  products: number;
};

type CategoriesApiResponse =
  | {
      success: true;
      data:
        | Record<string, unknown>[]
        | {
            categories?: Record<string, unknown>[];
            data?: Record<string, unknown>[];
          };
    }
  | {
      success: false;
      error: { code: string; message: string };
    };

type ProductsApiResponse =
  | {
      success: true;
      data: Record<string, unknown>[];
    }
  | {
      success: false;
      error: { code: string; message: string };
    };

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function extractList(data: unknown): Record<string, unknown>[] {
  if (Array.isArray(data)) return data as Record<string, unknown>[];
  if (!data || typeof data !== "object") return [];
  const obj = data as Record<string, unknown>;
  for (const key of ["categories", "items", "results", "data"]) {
    if (Array.isArray(obj[key])) return obj[key] as Record<string, unknown>[];
  }
  return [];
}

function Header() {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "#fff",
        borderBottom: "1px solid #f0e5d6",
      }}
    >
      <div
        className="container-site"
        style={{
          minHeight: 78,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link href="/food">
          <img
            src="/images/sreshta-food-logo.png"
            alt="Sreshta Foods"
            className="food-header-logo"
            style={{ width: 165 }}
          />
        </Link>

        <nav className="food-header-nav" style={{ display: "flex", gap: 25 }}>
          <Link href="/food">Home</Link>
          <Link href="/food/products">Products</Link>
          <Link href="/food/categories">Categories</Link>
        </nav>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Link
            href="/food/track"
            className="btn-secondary"
            style={{ borderColor: "#f59e0b", color: "#b45309" }}
          >
            Track Order
          </Link>
          <Link
            href="/food/cart"
            className="btn-primary"
            style={{ background: "#d97706" }}
          >
            🛒 Cart
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function CategoriesIndexPage() {
  const [categories, setCategories] = useState<CategoryCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        // 1) Prefer categories master (ACTIVE only)
        const catRes = await fetch("/api/food/categories?status=ACTIVE", {
          method: "GET",
          headers: { Accept: "application/json" },
          cache: "no-store",
        });
        const catJson = (await catRes.json()) as CategoriesApiResponse;

        if (catRes.ok && catJson.success) {
          const list = extractList(catJson.data)
            .map((row) => {
              const name = String(row.name || "").trim();
              if (!name) return null;
              const enabled =
                row.enabled === undefined
                  ? String(row.status || "ACTIVE").toUpperCase() !== "INACTIVE"
                  : Boolean(row.enabled);
              if (!enabled) return null;

              const slug = String(row.slug || slugify(name)).trim() || slugify(name);
              return {
                id: String(row.categoryId || row.id || slug),
                name,
                slug,
                description: String(row.description || "").trim() || undefined,
                products: Number(row.products || 0) || 0,
              } satisfies CategoryCard;
            })
            .filter(Boolean) as CategoryCard[];

          if (list.length > 0) {
            list.sort((a, b) => a.name.localeCompare(b.name));
            if (!cancelled) setCategories(list);
            return;
          }
        }

        // 2) Fallback: derive unique categories from products
        const prodRes = await fetch("/api/food/products", {
          method: "GET",
          headers: { Accept: "application/json" },
          cache: "no-store",
        });
        const prodJson = (await prodRes.json()) as ProductsApiResponse;

        if (!prodRes.ok || !prodJson.success) {
          throw new Error(
            !prodJson.success
              ? prodJson.error.message
              : "Failed to load categories.",
          );
        }

        const products = Array.isArray(prodJson.data) ? prodJson.data : [];
        const map = new Map<string, CategoryCard>();

        for (const raw of products) {
          const status = String(raw.status || "ACTIVE").toUpperCase();
          if (status === "INACTIVE") continue;

          const name =
            String(raw.categoryName || raw.category || "").trim() || "General";
          const slug = slugify(name);
          const existing = map.get(slug);
          if (existing) {
            existing.products += 1;
          } else {
            map.set(slug, {
              id: slug,
              name,
              slug,
              products: 1,
            });
          }
        }

        const derived = Array.from(map.values()).sort((a, b) =>
          a.name.localeCompare(b.name),
        );

        if (!cancelled) setCategories(derived);
      } catch (e) {
        if (!cancelled) {
          setError(
            e instanceof Error ? e.message : "Failed to load categories.",
          );
          setCategories([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const countLabel = useMemo(() => {
    const n = categories.length;
    return n === 1 ? "1 category" : `${n} categories`;
  }, [categories.length]);

  return (
    <>
      <Header />

      <main>
        <section style={{ background: "#fff7ed", padding: "75px 0" }}>
          <div className="container-site">
            <span className="section-label" style={{ color: "#b45309" }}>
              Shop by category
            </span>
            <h1 className="section-title" style={{ color: "#451a03" }}>
              All Categories
            </h1>
            <p className="section-description">
              Browse every collection available in the Sreshta Foods catalog.
            </p>
          </div>
        </section>

        <section className="section">
          <div className="container-site">
            {!loading && !error && categories.length > 0 ? (
              <p
                style={{
                  marginBottom: 24,
                  color: "#78716c",
                  fontSize: 14,
                }}
              >
                Showing {countLabel}
              </p>
            ) : null}

            {loading ? (
              <div
                style={{
                  textAlign: "center",
                  padding: 70,
                  border: "1px solid #f0e5d6",
                  borderRadius: 14,
                  background: "#fff",
                }}
              >
                <h2 style={{ color: "#451a03", marginBottom: 8 }}>
                  Loading categories...
                </h2>
                <p style={{ color: "#78716c", margin: 0 }}>
                  Please wait while we fetch the catalog.
                </p>
              </div>
            ) : error ? (
              <div
                style={{
                  textAlign: "center",
                  padding: 70,
                  border: "1px solid #fecaca",
                  borderRadius: 14,
                  background: "#fef2f2",
                }}
              >
                <h2 style={{ color: "#991b1b", marginBottom: 8 }}>
                  Could not load categories
                </h2>
                <p style={{ color: "#7f1d1d", margin: 0 }}>{error}</p>
                <button
                  type="button"
                  className="btn-primary"
                  style={{ marginTop: 20, background: "#d97706" }}
                  onClick={() => window.location.reload()}
                >
                  Try again
                </button>
              </div>
            ) : categories.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: 70,
                  border: "1px solid #f0e5d6",
                  borderRadius: 14,
                  background: "#fffaf5",
                }}
              >
                <h2 style={{ color: "#451a03" }}>No categories yet</h2>
                <p style={{ color: "#78716c" }}>
                  Categories will appear here once products are published.
                </p>
                <Link
                  href="/food/products"
                  className="btn-primary"
                  style={{ marginTop: 15, background: "#d97706" }}
                >
                  Browse All Products
                </Link>
              </div>
            ) : (
              <div className="card-grid">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/food/categories/${encodeURIComponent(cat.slug)}`}
                    style={{
                      display: "block",
                      padding: 24,
                      border: "1px solid #f0e5d6",
                      borderRadius: 14,
                      background: "#fff",
                      textDecoration: "none",
                    }}
                  >
                    <span
                      style={{
                        color: "#b45309",
                        fontSize: 12,
                        fontWeight: 750,
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                      }}
                    >
                      Category
                    </span>
                    <h3
                      style={{
                        color: "#451a03",
                        margin: "8px 0 6px",
                        fontSize: 20,
                      }}
                    >
                      {cat.name}
                    </h3>
                    {cat.description ? (
                      <p
                        style={{
                          margin: "0 0 12px",
                          color: "#78716c",
                          fontSize: 13,
                          lineHeight: 1.5,
                        }}
                      >
                        {cat.description}
                      </p>
                    ) : (
                      <p
                        style={{
                          margin: "0 0 12px",
                          color: "#a8a29e",
                          fontSize: 13,
                        }}
                      >
                        Explore products in this collection
                      </p>
                    )}
                    <strong style={{ color: "#92400e", fontSize: 13 }}>
                      {cat.products > 0
                        ? `${cat.products} product${cat.products === 1 ? "" : "s"} →`
                        : "View products →"}
                    </strong>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}