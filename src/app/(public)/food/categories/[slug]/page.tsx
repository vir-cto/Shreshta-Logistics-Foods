// "use client";

// import Link from "next/link";
// import { useEffect, useMemo, useState } from "react";
// import { useParams } from "next/navigation";

// type ProductVariant = {
//   id: string;
//   label: string;
//   price: number;
// };

// type Product = {
//   id: string;
//   productId: string;
//   slug: string;
//   name: string;
//   category: string;
//   description: string;
//   image: string;
//   status: "ACTIVE" | "INACTIVE";
//   featured: boolean;
//   variants: ProductVariant[];
// };

// type ApiResponse =
//   | {
//       success: true;
//       data: Record<string, unknown>[];
//     }
//   | {
//       success: false;
//       error: {
//         code: string;
//         message: string;
//       };
//     };

// function slugify(value: string): string {
//   return value
//     .toLowerCase()
//     .trim()
//     .replace(/[^a-z0-9]+/g, "-")
//     .replace(/(^-|-$)/g, "");
// }

// function titleFromSlug(slug: string): string {
//   return slug
//     .split("-")
//     .filter(Boolean)
//     .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
//     .join(" ");
// }

// function normalizeProduct(
//   raw: Record<string, unknown>,
// ): Product | null {
//   const id = String(raw.id || raw.productId || "");
//   const productId = String(raw.productId || raw.id || id);
//   const name = String(raw.name || "").trim();
//   const slug = String(raw.slug || slugify(name) || id);

//   if (!id || !name) {
//     return null;
//   }

//   const status =
//     String(raw.status || "ACTIVE").toUpperCase() === "INACTIVE"
//       ? "INACTIVE"
//       : "ACTIVE";

//   if (status !== "ACTIVE") {
//     return null;
//   }

//   const category =
//     String(raw.categoryName || raw.category || "General").trim() ||
//     "General";

//   const image = String(
//     raw.imageUrl ||
//       raw.image ||
//       "/images/default-product-placeholder.png",
//   );

//   const description = String(raw.description || "");
//   const featured = Boolean(raw.featured);

//   const rawVariants = Array.isArray(raw.variants)
//     ? (raw.variants as Record<string, unknown>[])
//     : [];

//   const variants: ProductVariant[] = rawVariants
//     .map((variant, index) => {
//       const enabled =
//         variant.enabled === undefined
//           ? true
//           : Boolean(variant.enabled);

//       if (!enabled) {
//         return null;
//       }

//       const price = Number(variant.price);

//       if (!Number.isFinite(price) || price < 0) {
//         return null;
//       }

//       return {
//         id: String(
//           variant.variantId ||
//             variant.id ||
//             `${productId}-v${index}`,
//         ),
//         label: String(
//           variant.name ||
//             variant.label ||
//             `Option ${index + 1}`,
//         ),
//         price,
//       };
//     })
//     .filter(Boolean) as ProductVariant[];

//   if (variants.length === 0) {
//     return null;
//   }

//   return {
//     id,
//     productId,
//     slug,
//     name,
//     category,
//     description,
//     image,
//     status,
//     featured,
//     variants,
//   };
// }

// function Header() {
//   return (
//     <header
//       style={{
//         position: "sticky",
//         top: 0,
//         zIndex: 50,
//         background: "#fff",
//         borderBottom: "1px solid #f0e5d6",
//       }}
//     >
//       <div
//         className="container-site"
//         style={{
//           minHeight: 78,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//         }}
//       >
//         <Link href="/food">
//           <img
//             src="/images/sreshta-food-logo.png"
//             alt="Sreshta Foods"
//             style={{ width: 165 }}
//           />
//         </Link>

//         <nav style={{ display: "flex", gap: 25 }}>
//           <Link href="/food">Home</Link>
//           <Link href="/food/products">Products</Link>
//           <Link href="/food/categories">
//             Categories
//           </Link>
//         </nav>

//         <Link
//           href="/food/cart"
//           className="btn-primary"
//           style={{ background: "#d97706" }}
//         >
//           🛒 Cart
//         </Link>
//       </div>
//     </header>
//   );
// }

// export default function CategoryPage() {
//   const params = useParams<{ slug: string }>();
//   const slug = String(params.slug || "").trim().toLowerCase();

//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     let cancelled = false;

//     async function loadProducts() {
//       try {
//         setLoading(true);
//         setError(null);

//         const res = await fetch("/api/food/products", {
//           method: "GET",
//           headers: {
//             Accept: "application/json",
//           },
//           cache: "no-store",
//         });

//         const json = (await res.json()) as ApiResponse;

//         if (!res.ok || !json.success) {
//           throw new Error(
//             !json.success
//               ? json.error.message
//               : "Failed to load products.",
//           );
//         }

//         const list = Array.isArray(json.data) ? json.data : [];
//         const normalized = list
//           .map((item) => normalizeProduct(item))
//           .filter(Boolean) as Product[];

//         if (!cancelled) {
//           setProducts(normalized);
//         }
//       } catch (e) {
//         if (!cancelled) {
//           setError(
//             e instanceof Error
//               ? e.message
//               : "Failed to load products.",
//           );
//           setProducts([]);
//         }
//       } finally {
//         if (!cancelled) {
//           setLoading(false);
//         }
//       }
//     }

//     loadProducts();

//     return () => {
//       cancelled = true;
//     };
//   }, []);

//   const categoryName = useMemo(() => {
//     if (!slug) {
//       return "Category";
//     }

//     const match = products.find(
//       (product) => slugify(product.category) === slug,
//     );

//     if (match) {
//       return match.category;
//     }

//     return titleFromSlug(slug);
//   }, [products, slug]);

//   const categoryProducts = useMemo(() => {
//     if (!slug) {
//       return [];
//     }

//     return products.filter(
//       (product) => slugify(product.category) === slug,
//     );
//   }, [products, slug]);

//   return (
//     <>
//       <Header />

//       <main>
//         <section
//           style={{
//             background: "#fff7ed",
//             padding: "75px 0",
//           }}
//         >
//           <div className="container-site">
//             <span
//               className="section-label"
//               style={{ color: "#b45309" }}
//             >
//               Category
//             </span>

//             <h1
//               className="section-title"
//               style={{ color: "#451a03" }}
//             >
//               {categoryName}
//             </h1>

//             <p className="section-description">
//               Explore products available in the{" "}
//               {categoryName.toLowerCase()} collection.
//             </p>
//           </div>
//         </section>

//         <section className="section">
//           <div className="container-site">
//             {loading ? (
//               <div
//                 style={{
//                   textAlign: "center",
//                   padding: 70,
//                   border: "1px solid #f0e5d6",
//                   borderRadius: 14,
//                   background: "#fff",
//                 }}
//               >
//                 <h2 style={{ color: "#451a03", marginBottom: 8 }}>
//                   Loading products...
//                 </h2>
//                 <p style={{ color: "#78716c", margin: 0 }}>
//                   Please wait while we fetch this category.
//                 </p>
//               </div>
//             ) : error ? (
//               <div
//                 style={{
//                   textAlign: "center",
//                   padding: 70,
//                   border: "1px solid #fecaca",
//                   borderRadius: 14,
//                   background: "#fef2f2",
//                 }}
//               >
//                 <h2 style={{ color: "#991b1b", marginBottom: 8 }}>
//                   Could not load products
//                 </h2>
//                 <p style={{ color: "#7f1d1d", margin: 0 }}>
//                   {error}
//                 </p>
//                 <button
//                   type="button"
//                   className="btn-primary"
//                   style={{
//                     marginTop: 20,
//                     background: "#d97706",
//                   }}
//                   onClick={() => window.location.reload()}
//                 >
//                   Try again
//                 </button>
//               </div>
//             ) : categoryProducts.length === 0 ? (
//               <div
//                 style={{
//                   textAlign: "center",
//                   padding: 70,
//                   border: "1px solid #f0e5d6",
//                   borderRadius: 14,
//                   background: "#fffaf5",
//                 }}
//               >
//                 <div style={{ fontSize: 45 }}>🎁</div>

//                 <h2 style={{ color: "#451a03" }}>
//                   This collection is coming soon
//                 </h2>

//                 <p style={{ color: "#78716c" }}>
//                   More products will be available in this
//                   category.
//                 </p>

//                 <Link
//                   href="/food/products"
//                   className="btn-primary"
//                   style={{
//                     marginTop: 15,
//                     background: "#d97706",
//                   }}
//                 >
//                   Browse All Products
//                 </Link>
//               </div>
//             ) : (
//               <div className="card-grid">
//                 {categoryProducts.map((product) => (
//                   <Link
//                     href={`/food/products/${product.slug}`}
//                     key={product.productId}
//                     style={{
//                       overflow: "hidden",
//                       border: "1px solid #f0e5d6",
//                       borderRadius: 14,
//                       background: "#fff",
//                     }}
//                   >
//                     <div
//                       style={{
//                         aspectRatio: "1",
//                         background: "#fff8ef",
//                         display: "grid",
//                         placeItems: "center",
//                       }}
//                     >
//                       <img
//                         src={product.image}
//                         alt={product.name}
//                         style={{
//                           width: "100%",
//                           height: "100%",
//                           objectFit: "cover",
//                         }}
//                       />
//                     </div>

//                     <div style={{ padding: 20 }}>
//                       <span
//                         style={{
//                           color: "#b45309",
//                           fontSize: 12,
//                           fontWeight: 750,
//                         }}
//                       >
//                         {product.category}
//                       </span>

//                       <h3
//                         style={{
//                           color: "#451a03",
//                           margin: "7px 0",
//                         }}
//                       >
//                         {product.name}
//                       </h3>

//                       <p
//                         style={{
//                           margin: 0,
//                           color: "#78716c",
//                           fontSize: 13,
//                         }}
//                       >
//                         {product.description}
//                       </p>

//                       <strong
//                         style={{
//                           display: "block",
//                           marginTop: 14,
//                           color: "#92400e",
//                         }}
//                       >
//                         From ₹
//                         {Math.min(
//                           ...product.variants.map(
//                             (variant) => variant.price,
//                           ),
//                         )}
//                       </strong>
//                     </div>
//                   </Link>
//                 ))}
//               </div>
//             )}
//           </div>
//         </section>
//       </main>
//     </>
//   );
// }

"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";

type ProductVariant = {
  id: string;
  label: string;
  price: number;
  stock: number;
  enabled: boolean;
};

type Product = {
  id: string;
  productId: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  image: string;
  status: "ACTIVE" | "INACTIVE";
  featured: boolean;
  variants: ProductVariant[];
  inStock: boolean;
};

type FoodSettingsPublic = {
  showOutOfStockProducts: boolean;
  acceptNewOrders: boolean;
};

type ApiResponse =
  | {
      success: true;
      data: Record<string, unknown>[];
    }
  | {
      success: false;
      error: {
        code: string;
        message: string;
      };
    };

const DEFAULT_SETTINGS: FoodSettingsPublic = {
  showOutOfStockProducts: false,
  acceptNewOrders: true,
};

async function loadFoodSettings(): Promise<FoodSettingsPublic> {
  try {
    const res = await fetch("/api/food/settings", {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    const json = await res.json();
    if (!res.ok || !json.success) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...json.data };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function titleFromSlug(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function parseStock(value: unknown, enabled: boolean): number {
  if (value === 0 || value === "0") return 0;
  if (value === undefined || value === null || value === "") {
    return enabled ? 999 : 0;
  }
  const n = Number(value);
  if (!Number.isFinite(n)) return enabled ? 999 : 0;
  return Math.max(0, Math.floor(n));
}

function normalizeProduct(raw: Record<string, unknown>): Product | null {
  const id = String(raw.id || raw.productId || "");
  const productId = String(raw.productId || raw.id || id);
  const name = String(raw.name || "").trim();
  const slug = String(raw.slug || slugify(name) || id);

  if (!id || !name) return null;

  const status =
    String(raw.status || "ACTIVE").toUpperCase() === "INACTIVE"
      ? "INACTIVE"
      : "ACTIVE";

  if (status !== "ACTIVE") return null;

  const category =
    String(raw.categoryName || raw.category || "General").trim() ||
    "General";

  const image = String(
    raw.imageUrl ||
      raw.image ||
      "/images/default-product-placeholder.png",
  );

  const description = String(raw.description || "");
  const featured = Boolean(raw.featured);

  const rawVariants = Array.isArray(raw.variants)
    ? (raw.variants as Record<string, unknown>[])
    : [];

  const variants: ProductVariant[] = rawVariants
    .map((variant, index) => {
      const enabled =
        variant.enabled === undefined ? true : Boolean(variant.enabled);

      const price = Number(variant.price);
      if (!Number.isFinite(price) || price < 0) return null;

      const stock = parseStock(variant.stock, enabled);

      return {
        id: String(
          variant.variantId || variant.id || `${productId}-v${index}`,
        ),
        label: String(
          variant.name || variant.label || `Option ${index + 1}`,
        ),
        price,
        stock,
        enabled,
      };
    })
    .filter(Boolean) as ProductVariant[];

  if (variants.length === 0) return null;

  const inStock = variants.some((v) => v.enabled && v.stock > 0);

  return {
    id,
    productId,
    slug,
    name,
    category,
    description,
    image,
    status,
    featured,
    variants,
    inStock,
  };
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
            style={{ width: 165 }}
          />
        </Link>

        <nav style={{ display: "flex", gap: 25 }}>
          <Link href="/food">Home</Link>
          <Link href="/food/products">Products</Link>
          <Link href="/food/categories">Categories</Link>
        </nav>

        <Link
          href="/food/cart"
          className="btn-primary"
          style={{ background: "#d97706" }}
        >
          🛒 Cart
        </Link>
      </div>
    </header>
  );
}

export default function CategoryPage() {
  const params = useParams<{ slug: string }>();
  const slug = String(params.slug || "").trim().toLowerCase();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] =
    useState<FoodSettingsPublic>(DEFAULT_SETTINGS);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const s = await loadFoodSettings();
      if (!cancelled) setSettings(s);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/food/products", {
          method: "GET",
          headers: { Accept: "application/json" },
          cache: "no-store",
        });

        const json = (await res.json()) as ApiResponse;

        if (!res.ok || !json.success) {
          throw new Error(
            !json.success
              ? json.error.message
              : "Failed to load products.",
          );
        }

        const list = Array.isArray(json.data) ? json.data : [];
        const normalized = list
          .map((item) => normalizeProduct(item))
          .filter(Boolean) as Product[];

        if (!cancelled) setProducts(normalized);
      } catch (e) {
        if (!cancelled) {
          setError(
            e instanceof Error ? e.message : "Failed to load products.",
          );
          setProducts([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  const categoryName = useMemo(() => {
    if (!slug) return "Category";

    const match = products.find(
      (product) => slugify(product.category) === slug,
    );

    if (match) return match.category;
    return titleFromSlug(slug);
  }, [products, slug]);

  const categoryProducts = useMemo(() => {
    if (!slug) return [];

    return products.filter((product) => {
      if (slugify(product.category) !== slug) return false;
      if (!settings.showOutOfStockProducts && !product.inStock) {
        return false;
      }
      return true;
    });
  }, [products, slug, settings.showOutOfStockProducts]);

  return (
    <>
      <Header />

      <main>
        <section
          style={{
            background: "#fff7ed",
            padding: "75px 0",
          }}
        >
          <div className="container-site">
            <span className="section-label" style={{ color: "#b45309" }}>
              Category
            </span>

            <h1 className="section-title" style={{ color: "#451a03" }}>
              {categoryName}
            </h1>

            <p className="section-description">
              Explore products available in the{" "}
              {categoryName.toLowerCase()} collection.
            </p>
          </div>
        </section>

        <section className="section">
          <div className="container-site">
            {!settings.acceptNewOrders && (
              <div
                style={{
                  marginBottom: 20,
                  borderRadius: 12,
                  border: "1px solid #fde68a",
                  background: "#fffbeb",
                  color: "#92400e",
                  padding: "12px 16px",
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                We are not accepting new orders right now. You can still
                browse products.
              </div>
            )}

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
                  Loading products...
                </h2>
                <p style={{ color: "#78716c", margin: 0 }}>
                  Please wait while we fetch this category.
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
                  Could not load products
                </h2>
                <p style={{ color: "#7f1d1d", margin: 0 }}>{error}</p>
                <button
                  type="button"
                  className="btn-primary"
                  style={{
                    marginTop: 20,
                    background: "#d97706",
                  }}
                  onClick={() => window.location.reload()}
                >
                  Try again
                </button>
              </div>
            ) : categoryProducts.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: 70,
                  border: "1px solid #f0e5d6",
                  borderRadius: 14,
                  background: "#fffaf5",
                }}
              >
                <div style={{ fontSize: 45 }}>🎁</div>

                <h2 style={{ color: "#451a03" }}>
                  This collection is coming soon
                </h2>

                <p style={{ color: "#78716c" }}>
                  More products will be available in this category.
                </p>

                <Link
                  href="/food/products"
                  className="btn-primary"
                  style={{
                    marginTop: 15,
                    background: "#d97706",
                  }}
                >
                  Browse All Products
                </Link>
              </div>
            ) : (
              <div className="card-grid">
                {categoryProducts.map((product) => (
                  <Link
                    href={`/food/products/${product.slug}`}
                    key={product.productId}
                    style={{
                      overflow: "hidden",
                      border: "1px solid #f0e5d6",
                      borderRadius: 14,
                      background: "#fff",
                    }}
                  >
                    <div
                      style={{
                        aspectRatio: "1",
                        background: "#fff8ef",
                        display: "grid",
                        placeItems: "center",
                        position: "relative",
                      }}
                    >
                      {!product.inStock && (
                        <span
                          style={{
                            position: "absolute",
                            top: 12,
                            left: 12,
                            zIndex: 2,
                            background: "#dc2626",
                            color: "#fff",
                            fontSize: 11,
                            fontWeight: 800,
                            letterSpacing: "0.04em",
                            textTransform: "uppercase",
                            padding: "6px 10px",
                            borderRadius: 999,
                            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                          }}
                        >
                          Out of stock
                        </span>
                      )}

                      <img
                        src={product.image}
                        alt={product.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          opacity: product.inStock ? 1 : 0.55,
                        }}
                      />
                    </div>

                    <div style={{ padding: 20 }}>
                      <span
                        style={{
                          color: "#b45309",
                          fontSize: 12,
                          fontWeight: 750,
                        }}
                      >
                        {product.category}
                      </span>

                      <h3
                        style={{
                          color: "#451a03",
                          margin: "7px 0",
                        }}
                      >
                        {product.name}
                      </h3>

                      <p
                        style={{
                          margin: 0,
                          color: "#78716c",
                          fontSize: 13,
                        }}
                      >
                        {product.description}
                      </p>

                      <strong
                        style={{
                          display: "block",
                          marginTop: 14,
                          color: product.inStock ? "#92400e" : "#b91c1c",
                        }}
                      >
                        {product.inStock
                          ? `From ₹${Math.min(
                              ...product.variants.map((v) => v.price),
                            )}`
                          : "Out of stock"}
                      </strong>
                    </div>
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