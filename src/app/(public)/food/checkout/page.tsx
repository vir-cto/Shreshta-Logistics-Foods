// "use client";

// import Link from "next/link";
// import { FormEvent, useEffect, useMemo, useState } from "react";
// import { useRouter } from "next/navigation";

// type CartItem = {
//   productId: string;
//   variantId: string;
//   productName: string;
//   variantLabel: string;
//   price: number;
//   quantity: number;
//   image: string;
// };

// export default function CheckoutPage() {
//   const router = useRouter();

//   const [items, setItems] = useState<CartItem[]>([]);
//   const [submitting, setSubmitting] = useState(false);

//   useEffect(() => {
//     const raw = localStorage.getItem("sreshta-food-cart");

//     if (!raw) return;

//     try {
//       setItems(JSON.parse(raw));
//     } catch {
//       setItems([]);
//     }
//   }, []);

//   const subtotal = useMemo(
//     () =>
//       items.reduce(
//         (total, item) =>
//           total + item.price * item.quantity,
//         0,
//       ),
//     [items],
//   );

//   const deliveryFee =
//     subtotal > 999 || subtotal === 0 ? 0 : 60;

//   const discount = 0;
//   const total = subtotal - discount + deliveryFee;

//   function handleSubmit(event: FormEvent<HTMLFormElement>) {
//     event.preventDefault();

//     if (items.length === 0) {
//       return;
//     }

//     setSubmitting(true);

//     const form = new FormData(event.currentTarget);

//     const orderId = `SFO-${Date.now()
//       .toString()
//       .slice(-8)}`;

//     const order = {
//       orderId,
//       status: "PENDING_PAYMENT",
//       paymentStatus: "PENDING",
//       customer: {
//         name: String(form.get("name") || ""),
//         phone: String(form.get("phone") || ""),
//         email: String(form.get("email") || ""),
//       },
//       shipping: {
//         address: String(form.get("address") || ""),
//         city: String(form.get("city") || ""),
//         state: String(form.get("state") || ""),
//         pinCode: String(form.get("pinCode") || ""),
//       },
//       items,
//       subtotal,
//       discount,
//       deliveryFee,
//       total,
//       createdAt: new Date().toISOString(),
//     };

//     localStorage.setItem(
//       "sreshta-food-last-order",
//       JSON.stringify(order),
//     );

//     /*
//      * FRONTEND-ONLY MOCK
//      *
//      * Real implementation will:
//      *
//      * POST /api/food/orders
//      *       ↓
//      * Create local order
//      *       ↓
//      * POST /api/payments/cashfree/create-order
//      *       ↓
//      * Cashfree payment
//      *       ↓
//      * Server-side webhook verification
//      *       ↓
//      * Mark order PAID
//      */

//     setTimeout(() => {
//       localStorage.removeItem("sreshta-food-cart");

//       router.push(
//         `/food/order-success?orderId=${encodeURIComponent(
//           orderId,
//         )}`,
//       );
//     }, 700);
//   }

//   if (items.length === 0) {
//     return (
//       <>
//         <header className="site-header">
//           <div className="container-site header-inner">
//             <Link href="/food">
//               <img
//                 src="/images/sreshta-food-logo.png"
//                 alt="Sreshta Foods"
//                 className="header-logo"
//               />
//             </Link>

//             <Link
//               href="/food/products"
//               className="btn-primary"
//               style={{ background: "#d97706" }}
//             >
//               Shop Products
//             </Link>
//           </div>
//         </header>

//         <main className="section">
//           <div
//             className="container-site"
//             style={{
//               textAlign: "center",
//               paddingTop: 80,
//               paddingBottom: 80,
//             }}
//           >
//             <h1 style={{ color: "#451a03" }}>
//               Your cart is empty
//             </h1>

//             <p>
//               Add products before continuing to checkout.
//             </p>

//             <Link
//               href="/food/products"
//               className="btn-primary"
//               style={{
//                 marginTop: 20,
//                 background: "#d97706",
//               }}
//             >
//               Browse Products
//             </Link>
//           </div>
//         </main>
//       </>
//     );
//   }

//   return (
//     <>
//       <header className="site-header">
//         <div className="container-site header-inner">
//           <Link href="/food">
//             <img
//               src="/images/sreshta-food-logo.png"
//               alt="Sreshta Foods"
//               className="header-logo"
//             />
//           </Link>

//           <Link
//             href="/food/cart"
//             className="btn-secondary"
//           >
//             ← Back to Cart
//           </Link>
//         </div>
//       </header>

//       <main>
//         <section
//           style={{
//             background: "#fff7ed",
//             padding: "65px 0",
//           }}
//         >
//           <div className="container-site">
//             <span
//               className="section-label"
//               style={{ color: "#b45309" }}
//             >
//               Checkout
//             </span>

//             <h1
//               className="section-title"
//               style={{ color: "#451a03" }}
//             >
//               Complete Your Order
//             </h1>
//           </div>
//         </section>

//         <section className="section">
//           <div className="container-site">
//             <div
//               style={{
//                 display: "grid",
//                 gridTemplateColumns: "1.4fr .8fr",
//                 gap: 30,
//                 alignItems: "start",
//               }}
//             >
//               <div className="form-shell">
//                 <span
//                   className="section-label"
//                   style={{ color: "#b45309" }}
//                 >
//                   Customer Details
//                 </span>

//                 <h2
//                   className="section-title"
//                   style={{
//                     color: "#451a03",
//                     fontSize: "2rem",
//                   }}
//                 >
//                   Delivery Information
//                 </h2>

//                 <form onSubmit={handleSubmit}>
//                   <div
//                     className="form-grid"
//                     style={{ marginTop: 28 }}
//                   >
//                     <div className="form-group">
//                       <label
//                         className="form-label"
//                         htmlFor="name"
//                       >
//                         Full Name *
//                       </label>

//                       <input
//                         id="name"
//                         name="name"
//                         className="input"
//                         placeholder="Your full name"
//                         required
//                       />
//                     </div>

//                     <div className="form-group">
//                       <label
//                         className="form-label"
//                         htmlFor="phone"
//                       >
//                         Phone *
//                       </label>

//                       <input
//                         id="phone"
//                         name="phone"
//                         className="input"
//                         type="tel"
//                         placeholder="10-digit phone number"
//                         required
//                       />
//                     </div>

//                     <div className="form-group full">
//                       <label
//                         className="form-label"
//                         htmlFor="email"
//                       >
//                         Email *
//                       </label>

//                       <input
//                         id="email"
//                         name="email"
//                         className="input"
//                         type="email"
//                         placeholder="you@example.com"
//                         required
//                       />
//                     </div>

//                     <div className="form-group full">
//                       <label
//                         className="form-label"
//                         htmlFor="address"
//                       >
//                         Delivery Address *
//                       </label>

//                       <textarea
//                         id="address"
//                         name="address"
//                         className="textarea"
//                         placeholder="House / flat, street, locality"
//                         required
//                       />
//                     </div>

//                     <div className="form-group">
//                       <label
//                         className="form-label"
//                         htmlFor="city"
//                       >
//                         City *
//                       </label>

//                       <input
//                         id="city"
//                         name="city"
//                         className="input"
//                         placeholder="City"
//                         required
//                       />
//                     </div>

//                     <div className="form-group">
//                       <label
//                         className="form-label"
//                         htmlFor="state"
//                       >
//                         State *
//                       </label>

//                       <input
//                         id="state"
//                         name="state"
//                         className="input"
//                         placeholder="State"
//                         required
//                       />
//                     </div>

//                     <div className="form-group">
//                       <label
//                         className="form-label"
//                         htmlFor="pinCode"
//                       >
//                         PIN Code *
//                       </label>

//                       <input
//                         id="pinCode"
//                         name="pinCode"
//                         className="input"
//                         placeholder="PIN code"
//                         required
//                       />
//                     </div>
//                   </div>

//                   <div
//                     style={{
//                       marginTop: 28,
//                       border: "1px solid #f0e5d6",
//                       borderRadius: 10,
//                       background: "#fffaf5",
//                       padding: 16,
//                     }}
//                   >
//                     <strong style={{ color: "#451a03" }}>
//                       Payment
//                     </strong>

//                     <p
//                       style={{
//                         margin: "7px 0 0",
//                         color: "#78716c",
//                         fontSize: 13,
//                       }}
//                     >
//                       Online payment will be processed through Cashfree after
//                       backend integration.
//                     </p>
//                   </div>

//                   <button
//                     className="btn-primary"
//                     type="submit"
//                     disabled={submitting}
//                     style={{
//                       marginTop: 25,
//                       width: "100%",
//                       background: "#d97706",
//                       minHeight: 54,
//                     }}
//                   >
//                     {submitting
//                       ? "Creating Order..."
//                       : `Continue to Payment · ₹${total}`}
//                   </button>
//                 </form>
//               </div>

//               <aside
//                 style={{
//                   border: "1px solid #f0e5d6",
//                   borderRadius: 14,
//                   background: "#fffaf5",
//                   padding: 25,
//                   position: "sticky",
//                   top: 100,
//                 }}
//               >
//                 <h2
//                   style={{
//                     color: "#451a03",
//                     marginTop: 0,
//                   }}
//                 >
//                   Order Summary
//                 </h2>

//                 <div
//                   style={{
//                     display: "grid",
//                     gap: 14,
//                   }}
//                 >
//                   {items.map((item) => (
//                     <div
//                       key={`${item.productId}-${item.variantId}`}
//                       style={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                         gap: 15,
//                       }}
//                     >
//                       <div>
//                         <strong
//                           style={{
//                             color: "#451a03",
//                             fontSize: 13,
//                           }}
//                         >
//                           {item.productName}
//                         </strong>

//                         <div
//                           style={{
//                             color: "#78716c",
//                             fontSize: 12,
//                           }}
//                         >
//                           {item.variantLabel} ×{" "}
//                           {item.quantity}
//                         </div>
//                       </div>

//                       <strong>
//                         ₹{item.price * item.quantity}
//                       </strong>
//                     </div>
//                   ))}

//                   <div
//                     style={{
//                       borderTop: "1px solid #eadbca",
//                       paddingTop: 15,
//                       display: "grid",
//                       gap: 10,
//                     }}
//                   >
//                     <div
//                       style={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                       }}
//                     >
//                       <span>Subtotal</span>
//                       <strong>₹{subtotal}</strong>
//                     </div>

//                     <div
//                       style={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                       }}
//                     >
//                       <span>Delivery</span>
//                       <strong>
//                         {deliveryFee === 0
//                           ? "FREE"
//                           : `₹${deliveryFee}`}
//                       </strong>
//                     </div>

//                     <div
//                       style={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                         fontSize: 19,
//                         color: "#451a03",
//                       }}
//                     >
//                       <strong>Total</strong>
//                       <strong>₹{total}</strong>
//                     </div>
//                   </div>
//                 </div>
//               </aside>
//             </div>
//           </div>
//         </section>
//       </main>
//     </>
//   );
// }











// "use client";

// import Link from "next/link";
// import {
//   FormEvent,
//   useEffect,
//   useMemo,
//   useState,
// } from "react";
// import { useRouter } from "next/navigation";

// type CartItem = {
//   productId: string;
//   variantId: string;
//   productName: string;
//   variantLabel: string;
//   price: number;
//   quantity: number;
//   image?: string;
// };

// type ApiSuccess<T> = {
//   success: true;
//   data: T;
//   message?: string;
// };

// type ApiError = {
//   success: false;
//   error: {
//     code: string;
//     message: string;
//   };
// };

// type ApiResponse<T> = ApiSuccess<T> | ApiError;

// type CreateOrderData = {
//   orderId: string;
//   order?: {
//     orderId: string;
//     total: number;
//     status: string;
//     paymentStatus: string;
//   };
// };

// type CashfreeCreateData = {
//   orderId: string;
//   paymentReferenceId?: string;
//   cashfreeOrderId?: string;
//   paymentSessionId?: string;
//   orderStatus?: string;
// };

// const CART_STORAGE_KEY = "sreshta-food-cart";

// declare global {
//   interface Window {
//     Cashfree?: (options: { mode: "sandbox" | "production" }) => {
//       checkout: (options: {
//         paymentSessionId: string;
//         redirectTarget?: "_self" | "_blank";
//       }) => Promise<unknown>;
//     };
//   }
// }

// function loadCashfreeScript(): Promise<void> {
//   return new Promise((resolve, reject) => {
//     if (typeof window === "undefined") {
//       reject(new Error("Cashfree can only load in the browser."));
//       return;
//     }

//     if (window.Cashfree) {
//       resolve();
//       return;
//     }

//     const existing = document.querySelector<HTMLScriptElement>(
//       'script[data-cashfree="sdk"]',
//     );

//     if (existing) {
//       existing.addEventListener("load", () => resolve(), { once: true });
//       existing.addEventListener(
//         "error",
//         () => reject(new Error("Failed to load Cashfree SDK.")),
//         { once: true },
//       );
//       return;
//     }

//     const script = document.createElement("script");
//     script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
//     script.async = true;
//     script.dataset.cashfree = "sdk";
//     script.onload = () => resolve();
//     script.onerror = () =>
//       reject(new Error("Failed to load Cashfree SDK."));
//     document.body.appendChild(script);
//   });
// }

// function getCashfreeMode(): "sandbox" | "production" {
//   const env =
//     process.env.NEXT_PUBLIC_CASHFREE_ENVIRONMENT ||
//     process.env.NEXT_PUBLIC_CASHFREE_MODE;

//   return env === "production" ? "production" : "sandbox";
// }

// export default function CheckoutPage() {
//   const router = useRouter();

//   const [items, setItems] = useState<CartItem[]>([]);
//   const [hydrated, setHydrated] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     try {
//       const raw = localStorage.getItem(CART_STORAGE_KEY);

//       if (!raw) {
//         setItems([]);
//         return;
//       }

//       const parsed = JSON.parse(raw) as unknown;

//       if (!Array.isArray(parsed)) {
//         setItems([]);
//         return;
//       }

//       const normalized = parsed
//         .map((row) => {
//           const item = row as Record<string, unknown>;
//           const productId = String(item.productId || "").trim();
//           const variantId = String(item.variantId || "").trim();

//           if (!productId || !variantId) return null;

//           return {
//             productId,
//             variantId,
//             productName: String(
//               item.productName || item.name || "Product",
//             ),
//             variantLabel: String(
//               item.variantLabel ||
//                 item.variantName ||
//                 item.label ||
//                 "Variant",
//             ),
//             price: Number(item.price || 0),
//             quantity: Math.max(1, Math.floor(Number(item.quantity || 1))),
//             image: item.image
//               ? String(item.image)
//               : item.imageUrl
//                 ? String(item.imageUrl)
//                 : undefined,
//           } satisfies CartItem;
//         })
//         .filter(Boolean) as CartItem[];

//       setItems(normalized);
//     } catch {
//       setItems([]);
//     } finally {
//       setHydrated(true);
//     }
//   }, []);

//   const subtotal = useMemo(
//     () =>
//       items.reduce(
//         (total, item) => total + item.price * item.quantity,
//         0,
//       ),
//     [items],
//   );

//   const deliveryFee =
//     subtotal > 999 || subtotal === 0 ? 0 : 60;

//   const discount = 0;
//   const total = Math.max(0, subtotal - discount + deliveryFee);

//   async function handleSubmit(event: FormEvent<HTMLFormElement>) {
//     event.preventDefault();

//     if (items.length === 0 || submitting) {
//       return;
//     }

//     setSubmitting(true);
//     setError(null);

//     try {
//       const form = new FormData(event.currentTarget);

//       const name = String(form.get("name") || "").trim();
//       const phone = String(form.get("phone") || "").trim();
//       const email = String(form.get("email") || "").trim();
//       const addressLine1 = String(form.get("address") || "").trim();
//       const city = String(form.get("city") || "").trim();
//       const state = String(form.get("state") || "").trim();
//       const postalCode = String(form.get("pinCode") || "").trim();

//       if (!name || !phone || !email || !addressLine1 || !city || !state || !postalCode) {
//         throw new Error("Please fill in all required delivery fields.");
//       }

//       // 1) Create local food order (server is price authority)
//       const orderRes = await fetch("/api/food/orders", {
//         method: "POST",
//         headers: {
//           Accept: "application/json",
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           customer: {
//             name,
//             phone,
//             email,
//             addressLine1,
//             city,
//             state,
//             postalCode,
//             country: "India",
//           },
//           items: items.map((item) => ({
//             productId: item.productId,
//             variantId: item.variantId,
//             quantity: item.quantity,
//           })),
//           deliveryFee,
//         }),
//       });

//       const orderJson =
//         (await orderRes.json()) as ApiResponse<CreateOrderData>;

//       if (!orderJson.success) {
//         throw new Error(
//           orderJson.error?.message || "Failed to create order.",
//         );
//       }

//       const orderId = String(orderJson.data.orderId || "").trim();

//       if (!orderId) {
//         throw new Error("Order was created without an orderId.");
//       }

//       // Keep a lightweight client reference for success/track pages
//       localStorage.setItem(
//         "sreshta-food-last-order",
//         JSON.stringify({
//           orderId,
//           status: "PENDING_PAYMENT",
//           paymentStatus: "PENDING",
//           total: orderJson.data.order?.total ?? total,
//           createdAt: new Date().toISOString(),
//         }),
//       );

//       // 2) Create Cashfree payment session
//       const paymentRes = await fetch(
//         "/api/payments/cashfree/create-order",
//         {
//           method: "POST",
//           headers: {
//             Accept: "application/json",
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ orderId }),
//         },
//       );

//       const paymentJson =
//         (await paymentRes.json()) as ApiResponse<CashfreeCreateData>;

//       if (!paymentJson.success) {
//         // Order exists; send user to success/track with pending payment
//         throw new Error(
//           paymentJson.error?.message ||
//             "Order created, but payment session failed. You can retry payment from order tracking.",
//         );
//       }

//       const paymentSessionId =
//         paymentJson.data.paymentSessionId?.trim() || "";

//       // Clear cart only after order + payment session succeed
//       localStorage.removeItem(CART_STORAGE_KEY);
//       setItems([]);

//       // 3) Launch Cashfree Checkout when session is available
//       if (paymentSessionId) {
//         try {
//           await loadCashfreeScript();

//           if (!window.Cashfree) {
//             throw new Error("Cashfree SDK is unavailable.");
//           }

//           const cashfree = window.Cashfree({
//             mode: getCashfreeMode(),
//           });

//           await cashfree.checkout({
//             paymentSessionId,
//             redirectTarget: "_self",
//           });

//           // Cashfree redirects to return_url on completion.
//           return;
//         } catch (sdkError) {
//           // Fallback: still land on success page with orderId
//           console.error("Cashfree checkout launch failed", sdkError);
//         }
//       }

//       // Fallback / no session: go to success (webhook still owns paid status)
//       router.push(
//         `/food/order-success?orderId=${encodeURIComponent(orderId)}`,
//       );
//     } catch (e) {
//       setError(
//         e instanceof Error
//           ? e.message
//           : "Unable to complete checkout. Please try again.",
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   if (!hydrated) {
//     return (
//       <main className="section">
//         <div
//           className="container-site"
//           style={{ textAlign: "center", padding: "80px 0" }}
//         >
//           <h1 style={{ color: "#451a03" }}>Loading checkout…</h1>
//         </div>
//       </main>
//     );
//   }

//   if (items.length === 0) {
//     return (
//       <>
//         <header className="site-header">
//           <div className="container-site header-inner">
//             <Link href="/food">
//               <img
//                 src="/images/sreshta-food-logo.png"
//                 alt="Sreshta Foods"
//                 className="header-logo"
//               />
//             </Link>

//             <Link
//               href="/food/products"
//               className="btn-primary"
//               style={{ background: "#d97706" }}
//             >
//               Shop Products
//             </Link>
//           </div>
//         </header>

//         <main className="section">
//           <div
//             className="container-site"
//             style={{
//               textAlign: "center",
//               paddingTop: 80,
//               paddingBottom: 80,
//             }}
//           >
//             <h1 style={{ color: "#451a03" }}>Your cart is empty</h1>
//             <p>Add products before continuing to checkout.</p>
//             <Link
//               href="/food/products"
//               className="btn-primary"
//               style={{ marginTop: 20, background: "#d97706" }}
//             >
//               Browse Products
//             </Link>
//           </div>
//         </main>
//       </>
//     );
//   }

//   return (
//     <>
//       <header className="site-header">
//         <div className="container-site header-inner">
//           <Link href="/food">
//             <img
//               src="/images/sreshta-food-logo.png"
//               alt="Sreshta Foods"
//               className="header-logo"
//             />
//           </Link>

//           <Link href="/food/cart" className="btn-secondary">
//             ← Back to Cart
//           </Link>
//         </div>
//       </header>

//       <main>
//         <section style={{ background: "#fff7ed", padding: "65px 0" }}>
//           <div className="container-site">
//             <span className="section-label" style={{ color: "#b45309" }}>
//               Checkout
//             </span>
//             <h1 className="section-title" style={{ color: "#451a03" }}>
//               Complete Your Order
//             </h1>
//           </div>
//         </section>

//         <section className="section">
//           <div className="container-site">
//             <div
//               style={{
//                 display: "grid",
//                 gridTemplateColumns: "1.4fr .8fr",
//                 gap: 30,
//                 alignItems: "start",
//               }}
//             >
//               <div className="form-shell">
//                 <span className="section-label" style={{ color: "#b45309" }}>
//                   Customer Details
//                 </span>

//                 <h2
//                   className="section-title"
//                   style={{ color: "#451a03", fontSize: "2rem" }}
//                 >
//                   Delivery Information
//                 </h2>

//                 <form onSubmit={handleSubmit}>
//                   <div className="form-grid" style={{ marginTop: 28 }}>
//                     <div className="form-group">
//                       <label className="form-label" htmlFor="name">
//                         Full Name *
//                       </label>
//                       <input
//                         id="name"
//                         name="name"
//                         className="input"
//                         placeholder="Your full name"
//                         required
//                       />
//                     </div>

//                     <div className="form-group">
//                       <label className="form-label" htmlFor="phone">
//                         Phone *
//                       </label>
//                       <input
//                         id="phone"
//                         name="phone"
//                         className="input"
//                         type="tel"
//                         placeholder="10-digit phone number"
//                         required
//                       />
//                     </div>

//                     <div className="form-group full">
//                       <label className="form-label" htmlFor="email">
//                         Email *
//                       </label>
//                       <input
//                         id="email"
//                         name="email"
//                         className="input"
//                         type="email"
//                         placeholder="you@example.com"
//                         required
//                       />
//                     </div>

//                     <div className="form-group full">
//                       <label className="form-label" htmlFor="address">
//                         Delivery Address *
//                       </label>
//                       <textarea
//                         id="address"
//                         name="address"
//                         className="textarea"
//                         placeholder="House / flat, street, locality"
//                         required
//                       />
//                     </div>

//                     <div className="form-group">
//                       <label className="form-label" htmlFor="city">
//                         City *
//                       </label>
//                       <input
//                         id="city"
//                         name="city"
//                         className="input"
//                         placeholder="City"
//                         required
//                       />
//                     </div>

//                     <div className="form-group">
//                       <label className="form-label" htmlFor="state">
//                         State *
//                       </label>
//                       <input
//                         id="state"
//                         name="state"
//                         className="input"
//                         placeholder="State"
//                         required
//                       />
//                     </div>

//                     <div className="form-group">
//                       <label className="form-label" htmlFor="pinCode">
//                         PIN Code *
//                       </label>
//                       <input
//                         id="pinCode"
//                         name="pinCode"
//                         className="input"
//                         placeholder="PIN code"
//                         required
//                       />
//                     </div>
//                   </div>

//                   <div
//                     style={{
//                       marginTop: 28,
//                       border: "1px solid #f0e5d6",
//                       borderRadius: 10,
//                       background: "#fffaf5",
//                       padding: 16,
//                     }}
//                   >
//                     <strong style={{ color: "#451a03" }}>Payment</strong>
//                     <p
//                       style={{
//                         margin: "7px 0 0",
//                         color: "#78716c",
//                         fontSize: 13,
//                       }}
//                     >
//                       You will be redirected to Cashfree to complete secure
//                       online payment. Order status is confirmed only after
//                       server-side payment verification.
//                     </p>
//                   </div>

//                   {error && (
//                     <div
//                       style={{
//                         marginTop: 16,
//                         borderRadius: 10,
//                         background: "#fef2f2",
//                         color: "#b91c1c",
//                         padding: "12px 14px",
//                         fontSize: 14,
//                       }}
//                     >
//                       {error}
//                     </div>
//                   )}

//                   <button
//                     className="btn-primary"
//                     type="submit"
//                     disabled={submitting}
//                     style={{
//                       marginTop: 25,
//                       width: "100%",
//                       background: "#d97706",
//                       minHeight: 54,
//                     }}
//                   >
//                     {submitting
//                       ? "Creating order & opening payment…"
//                       : `Continue to Payment · ₹${total}`}
//                   </button>
//                 </form>
//               </div>

//               <aside
//                 style={{
//                   border: "1px solid #f0e5d6",
//                   borderRadius: 14,
//                   background: "#fffaf5",
//                   padding: 25,
//                   position: "sticky",
//                   top: 100,
//                 }}
//               >
//                 <h2 style={{ color: "#451a03", marginTop: 0 }}>
//                   Order Summary
//                 </h2>

//                 <div style={{ display: "grid", gap: 14 }}>
//                   {items.map((item) => (
//                     <div
//                       key={`${item.productId}-${item.variantId}`}
//                       style={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                         gap: 15,
//                       }}
//                     >
//                       <div>
//                         <strong
//                           style={{ color: "#451a03", fontSize: 13 }}
//                         >
//                           {item.productName}
//                         </strong>
//                         <div style={{ color: "#78716c", fontSize: 12 }}>
//                           {item.variantLabel} × {item.quantity}
//                         </div>
//                       </div>
//                       <strong>₹{item.price * item.quantity}</strong>
//                     </div>
//                   ))}

//                   <div
//                     style={{
//                       borderTop: "1px solid #eadbca",
//                       paddingTop: 15,
//                       display: "grid",
//                       gap: 10,
//                     }}
//                   >
//                     <div
//                       style={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                       }}
//                     >
//                       <span>Subtotal</span>
//                       <strong>₹{subtotal}</strong>
//                     </div>

//                     <div
//                       style={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                       }}
//                     >
//                       <span>Delivery</span>
//                       <strong>
//                         {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
//                       </strong>
//                     </div>

//                     <div
//                       style={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                         fontSize: 19,
//                         color: "#451a03",
//                       }}
//                     >
//                       <strong>Total</strong>
//                       <strong>₹{total}</strong>
//                     </div>
//                   </div>
//                 </div>
//               </aside>
//             </div>
//           </div>
//         </section>
//       </main>
//     </>
//   );
// }

// "use client";

// import Link from "next/link";
// import { useSearchParams } from "next/navigation"
// import {
//   FormEvent,
//   useEffect,
//   useMemo,
//   useState,
// } from "react";
// import { useRouter } from "next/navigation";

// type CartItem = {
//   productId: string;
//   variantId: string;
//   productName: string;
//   variantLabel: string;
//   price: number;
//   quantity: number;
//   image?: string;
// };

// type AppliedCoupon = {
//   couponId: string;
//   code: string; // UI label only — not sent to order API as couponCode
//   type: "PERCENTAGE" | "FIXED";
//   value: number;
//   maximumDiscount?: number | null;
// };

// type ApiSuccess<T> = {
//   success: true;
//   data: T;
//   message?: string;
// };

// type ApiError = {
//   success: false;
//   error: {
//     code: string;
//     message: string;
//   };
// };

// type ApiResponse<T> = ApiSuccess<T> | ApiError;

// type CreateOrderData = {
//   orderId: string;
//   order?: {
//     orderId: string;
//     total: number;
//     subtotal?: number;
//     discount?: number;
//     status: string;
//     paymentStatus: string;
//   };
// };

// type CashfreeCreateData = {
//   orderId: string;
//   paymentReferenceId?: string;
//   cashfreeOrderId?: string;
//   paymentSessionId?: string;
//   orderStatus?: string;
// };

// const CART_STORAGE_KEY = "sreshta-food-cart";

// declare global {
//   interface Window {
//     Cashfree?: (options: { mode: "sandbox" | "production" }) => {
//       checkout: (options: {
//         paymentSessionId: string;
//         redirectTarget?: "_self" | "_blank";
//       }) => Promise<unknown>;
//     };
//   }
// }

// function loadCashfreeScript(): Promise<void> {
//   return new Promise((resolve, reject) => {
//     if (typeof window === "undefined") {
//       reject(new Error("Cashfree can only load in the browser."));
//       return;
//     }

//     if (window.Cashfree) {
//       resolve();
//       return;
//     }

//     const existing = document.querySelector<HTMLScriptElement>(
//       'script[data-cashfree="sdk"]',
//     );

//     if (existing) {
//       existing.addEventListener("load", () => resolve(), { once: true });
//       existing.addEventListener(
//         "error",
//         () => reject(new Error("Failed to load Cashfree SDK.")),
//         { once: true },
//       );
//       return;
//     }

//     const script = document.createElement("script");
//     script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
//     script.async = true;
//     script.dataset.cashfree = "sdk";
//     script.onload = () => resolve();
//     script.onerror = () =>
//       reject(new Error("Failed to load Cashfree SDK."));
//     document.body.appendChild(script);
//   });
// }

// function getCashfreeMode(): "sandbox" | "production" {
//   const env =
//     process.env.NEXT_PUBLIC_CASHFREE_ENVIRONMENT ||
//     process.env.NEXT_PUBLIC_CASHFREE_MODE;

//   return env === "production" ? "production" : "sandbox";
// }

// function formatMoney(value: number): string {
//   return `₹${Number(value || 0).toFixed(2)}`;
// }

// export default function CheckoutPage() {
//   const router = useRouter();

//   const [items, setItems] = useState<CartItem[]>([]);
//   const [hydrated, setHydrated] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const [couponInput, setCouponInput] = useState("");
//   const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(
//     null,
//   );
//   const [couponMessage, setCouponMessage] = useState<string | null>(null);
//   const [couponLoading, setCouponLoading] = useState(false);

//     const searchParams = useSearchParams(); // add: import { useSearchParams } from "next/navigation"

//   useEffect(() => {
//     const payment = searchParams.get("payment");
//     if (payment === "incomplete") {
//       setError(
//         "Payment was not completed or was cancelled. You can try again from checkout.",
//       );
//     }
//   }, [searchParams]);

//   // useEffect(() => {
//   //   try {
//   //     const raw = localStorage.getItem(CART_STORAGE_KEY);

//   //     if (!raw) {
//   //       setItems([]);
//   //       return;
//   //     }

//   //     const parsed = JSON.parse(raw) as unknown;

//   //     if (!Array.isArray(parsed)) {
//   //       setItems([]);
//   //       return;
//   //     }

//   //     const normalized = parsed
//   //       .map((row) => {
//   //         const item = row as Record<string, unknown>;
//   //         const productId = String(item.productId || "").trim();
//   //         const variantId = String(item.variantId || "").trim();

//   //         if (!productId || !variantId) return null;

//   //         return {
//   //           productId,
//   //           variantId,
//   //           productName: String(
//   //             item.productName || item.name || "Product",
//   //           ),
//   //           variantLabel: String(
//   //             item.variantLabel ||
//   //               item.variantName ||
//   //               item.label ||
//   //               "Variant",
//   //           ),
//   //           price: Number(item.price || 0),
//   //           quantity: Math.max(1, Math.floor(Number(item.quantity || 1))),
//   //           image: item.image
//   //             ? String(item.image)
//   //             : item.imageUrl
//   //               ? String(item.imageUrl)
//   //               : undefined,
//   //         } satisfies CartItem;
//   //       })
//   //       .filter(Boolean) as CartItem[];

//   //     setItems(normalized);
//   //   } catch {
//   //     setItems([]);
//   //   } finally {
//   //     setHydrated(true);
//   //   }
//   // }, []);

//     useEffect(() => {
//     try {
//       const raw = localStorage.getItem(CART_STORAGE_KEY);

//       if (!raw) {
//         setItems([]);
//         return;
//       }

//       const parsed = JSON.parse(raw) as unknown;

//       // Support both formats:
//       // 1) legacy: CartItem[]
//       // 2) cart page: { items: CartItem[], updatedAt?: number }
//       let list: unknown[] = [];

//       if (Array.isArray(parsed)) {
//         list = parsed;
//       } else if (
//         parsed &&
//         typeof parsed === "object" &&
//         Array.isArray((parsed as { items?: unknown }).items)
//       ) {
//         list = (parsed as { items: unknown[] }).items;
//       } else {
//         setItems([]);
//         return;
//       }

//       const normalized = list
//         .map((row) => {
//           const item = row as Record<string, unknown>;
//           const productId = String(item.productId || "").trim();
//           const variantId = String(item.variantId || "").trim();

//           if (!productId || !variantId) return null;

//           return {
//             productId,
//             variantId,
//             productName: String(
//               item.productName || item.name || "Product",
//             ),
//             variantLabel: String(
//               item.variantLabel ||
//                 item.variantName ||
//                 item.label ||
//                 "Variant",
//             ),
//             price: Number(item.price || 0),
//             quantity: Math.max(1, Math.floor(Number(item.quantity || 1))),
//             image: item.image
//               ? String(item.image)
//               : item.imageUrl
//                 ? String(item.imageUrl)
//                 : undefined,
//           } satisfies CartItem;
//         })
//         .filter(Boolean) as CartItem[];

//       setItems(normalized);
//     } catch {
//       setItems([]);
//     } finally {
//       setHydrated(true);
//     }
//   }, []);

//   const subtotal = useMemo(
//     () =>
//       items.reduce(
//         (sum, item) => sum + item.price * item.quantity,
//         0,
//       ),
//     [items],
//   );

//   const deliveryFee = subtotal > 999 || subtotal === 0 ? 0 : 60;

//   const discount = useMemo(() => {
//     if (!appliedCoupon || subtotal <= 0) return 0;

//     let amount = 0;
//     if (appliedCoupon.type === "PERCENTAGE") {
//       amount = (subtotal * appliedCoupon.value) / 100;
//       if (
//         appliedCoupon.maximumDiscount != null &&
//         Number.isFinite(appliedCoupon.maximumDiscount)
//       ) {
//         amount = Math.min(amount, Number(appliedCoupon.maximumDiscount));
//       }
//     } else {
//       amount = appliedCoupon.value;
//     }

//     return Math.min(Math.max(0, amount), subtotal);
//   }, [appliedCoupon, subtotal]);

//   const total = Math.max(0, subtotal - discount + deliveryFee);

//   async function applyCoupon() {
//     const code = couponInput.trim().toUpperCase();
//     if (!code) {
//       setCouponMessage("Enter a coupon code (optional).");
//       return;
//     }

//     try {
//       setCouponLoading(true);
//       setCouponMessage(null);

//       const res = await fetch(
//         `/api/food/coupons/validate?code=${encodeURIComponent(code)}&subtotal=${subtotal}`,
//         { cache: "no-store" },
//       );
//       const json = await res.json();

//       if (!res.ok || !json.success) {
//         setAppliedCoupon(null);
//         throw new Error(
//           json.error?.message || "Invalid or expired coupon.",
//         );
//       }

//       const c = json.data?.coupon || json.coupon;
//       setAppliedCoupon({
//         couponId: String(c.couponId || c.id),
//         code: String(c.code || code).toUpperCase(),
//         type: c.type === "FIXED" ? "FIXED" : "PERCENTAGE",
//         value: Number(c.value),
//         maximumDiscount: c.maximumDiscount ?? null,
//       });
//       setCouponMessage(
//         `Coupon ${String(c.code || code).toUpperCase()} applied.`,
//       );
//     } catch (e) {
//       setAppliedCoupon(null);
//       setCouponMessage(
//         e instanceof Error ? e.message : "Could not apply coupon.",
//       );
//     } finally {
//       setCouponLoading(false);
//     }
//   }

//   function removeCoupon() {
//     setAppliedCoupon(null);
//     setCouponInput("");
//     setCouponMessage(null);
//   }

//   // async function handleSubmit(event: FormEvent<HTMLFormElement>) {
//   //   event.preventDefault();

//   //   if (items.length === 0 || submitting) {
//   //     return;
//   //   }

//   //   setSubmitting(true);
//   //   setError(null);

//   //   try {
//   //     const form = new FormData(event.currentTarget);

//   //     const name = String(form.get("name") || "").trim();
//   //     const phone = String(form.get("phone") || "").trim();
//   //     const email = String(form.get("email") || "").trim();
//   //     const addressLine1 = String(form.get("address") || "").trim();
//   //     const city = String(form.get("city") || "").trim();
//   //     const state = String(form.get("state") || "").trim();
//   //     const postalCode = String(form.get("pinCode") || "").trim();

//   //     if (
//   //       !name ||
//   //       !phone ||
//   //       !email ||
//   //       !addressLine1 ||
//   //       !city ||
//   //       !state ||
//   //       !postalCode
//   //     ) {
//   //       throw new Error("Please fill in all required delivery fields.");
//   //     }

//   //     const orderRes = await fetch("/api/food/orders", {
//   //       method: "POST",
//   //       headers: {
//   //         Accept: "application/json",
//   //         "Content-Type": "application/json",
//   //       },
//   //       body: JSON.stringify({
//   //         customer: {
//   //           name,
//   //           phone,
//   //           email,
//   //           addressLine1,
//   //           city,
//   //           state,
//   //           postalCode,
//   //           country: "India",
//   //         },
//   //         items: items.map((item) => ({
//   //           productId: item.productId,
//   //           variantId: item.variantId,
//   //           quantity: item.quantity,
//   //         })),
//   //         deliveryFee,
//   //         // only couponId — optional
//   //         couponId: appliedCoupon?.couponId || null,
//   //       }),
//   //     });

//   //     const orderJson =
//   //       (await orderRes.json()) as ApiResponse<CreateOrderData>;

//   //     if (!orderJson.success) {
//   //       throw new Error(
//   //         orderJson.error?.message || "Failed to create order.",
//   //       );
//   //     }

//   //     const orderId = String(orderJson.data.orderId || "").trim();

//   //     if (!orderId) {
//   //       throw new Error("Order was created without an orderId.");
//   //     }

//   //     localStorage.setItem(
//   //       "sreshta-food-last-order",
//   //       JSON.stringify({
//   //         orderId,
//   //         status: "PENDING_PAYMENT",
//   //         paymentStatus: "PENDING",
//   //         total: orderJson.data.order?.total ?? total,
//   //         discount: orderJson.data.order?.discount ?? discount,
//   //         createdAt: new Date().toISOString(),
//   //       }),
//   //     );

//   //     const paymentRes = await fetch(
//   //       "/api/payments/cashfree/create-order",
//   //       {
//   //         method: "POST",
//   //         headers: {
//   //           Accept: "application/json",
//   //           "Content-Type": "application/json",
//   //         },
//   //         body: JSON.stringify({ orderId }),
//   //       },
//   //     );

//   //     const paymentJson =
//   //       (await paymentRes.json()) as ApiResponse<CashfreeCreateData>;

//   //     if (!paymentJson.success) {
//   //       throw new Error(
//   //         paymentJson.error?.message ||
//   //           "Order created, but payment session failed. You can retry payment from order tracking.",
//   //       );
//   //     }

//   //     const paymentSessionId =
//   //       paymentJson.data.paymentSessionId?.trim() || "";

//   //     localStorage.removeItem(CART_STORAGE_KEY);
//   //     setItems([]);

//   //     if (paymentSessionId) {
//   //       try {
//   //         await loadCashfreeScript();

//   //         if (!window.Cashfree) {
//   //           throw new Error("Cashfree SDK is unavailable.");
//   //         }

//   //         const cashfree = window.Cashfree({
//   //           mode: getCashfreeMode(),
//   //         });

//   //         await cashfree.checkout({
//   //           paymentSessionId,
//   //           redirectTarget: "_self",
//   //         });

//   //         return;
//   //       } catch (sdkError) {
//   //         console.error("Cashfree checkout launch failed", sdkError);
//   //       }
//   //     }

//   //     router.push(
//   //       `/food/order-success?orderId=${encodeURIComponent(orderId)}`,
//   //     );
//   //   } catch (e) {
//   //     setError(
//   //       e instanceof Error
//   //         ? e.message
//   //         : "Unable to complete checkout. Please try again.",
//   //     );
//   //   } finally {
//   //     setSubmitting(false);
//   //   }
//   // }

//     async function handleSubmit(event: FormEvent<HTMLFormElement>) {
//     event.preventDefault();

//     if (items.length === 0 || submitting) {
//       return;
//     }

//     setSubmitting(true);
//     setError(null);

//     try {
//       const form = new FormData(event.currentTarget);

//       const name = String(form.get("name") || "").trim();
//       const phone = String(form.get("phone") || "").trim();
//       const email = String(form.get("email") || "").trim();
//       const addressLine1 = String(form.get("address") || "").trim();
//       const city = String(form.get("city") || "").trim();
//       const state = String(form.get("state") || "").trim();
//       const postalCode = String(form.get("pinCode") || "").trim();

//       if (
//         !name ||
//         !phone ||
//         !email ||
//         !addressLine1 ||
//         !city ||
//         !state ||
//         !postalCode
//       ) {
//         throw new Error("Please fill in all required delivery fields.");
//       }

//       // 1) Create order
//       const orderRes = await fetch("/api/food/orders", {
//         method: "POST",
//         headers: {
//           Accept: "application/json",
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           customer: {
//             name,
//             phone,
//             email,
//             addressLine1,
//             city,
//             state,
//             postalCode,
//             country: "India",
//           },
//           items: items.map((item) => ({
//             productId: item.productId,
//             variantId: item.variantId,
//             quantity: item.quantity,
//           })),
//           deliveryFee,
//           couponId: appliedCoupon?.couponId || null,
//         }),
//       });

//       const orderJson =
//         (await orderRes.json()) as ApiResponse<CreateOrderData>;

//       if (!orderJson.success) {
//         throw new Error(
//           orderJson.error?.message || "Failed to create order.",
//         );
//       }

//       const orderId = String(orderJson.data.orderId || "").trim();

//       if (!orderId) {
//         throw new Error("Order was created without an orderId.");
//       }

//       localStorage.setItem(
//         "sreshta-food-last-order",
//         JSON.stringify({
//           orderId,
//           status: "PENDING_PAYMENT",
//           paymentStatus: "PENDING",
//           total: orderJson.data.order?.total ?? total,
//           discount: orderJson.data.order?.discount ?? discount,
//           createdAt: new Date().toISOString(),
//         }),
//       );

//       // 2) Create Cashfree session
//       const paymentRes = await fetch(
//         "/api/payments/cashfree/create-order",
//         {
//           method: "POST",
//           headers: {
//             Accept: "application/json",
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ orderId }),
//         },
//       );

//       const paymentJson =
//         (await paymentRes.json()) as ApiResponse<CashfreeCreateData>;

//       if (!paymentJson.success) {
//         throw new Error(
//           paymentJson.error?.message ||
//             "Could not start payment. Please try again.",
//         );
//       }

//       const paymentSessionId =
//         paymentJson.data.paymentSessionId?.trim() || "";

//       if (!paymentSessionId) {
//         throw new Error(
//           "Payment session was not created. Check Cashfree sandbox keys.",
//         );
//       }

//       // 3) Open Cashfree — do NOT clear cart or go to success until checkout launches
//       await loadCashfreeScript();

//       if (!window.Cashfree) {
//         throw new Error("Cashfree SDK is unavailable.");
//       }

//       const cashfree = window.Cashfree({
//         mode: getCashfreeMode(),
//       });

//       // Only clear cart after we successfully hand off to Cashfree
//       // localStorage.removeItem(CART_STORAGE_KEY);
//       // setItems([]);

//       await cashfree.checkout({
//         paymentSessionId,
//         redirectTarget: "_self",
//       });

//       // Cashfree takes over the page. If user closes / cancels,
//       // they return via return_url with order still PENDING_PAYMENT.
//       // Do not push order-success here.
//     } catch (e) {
//       setError(
//         e instanceof Error
//           ? e.message
//           : "Unable to complete checkout. Please try again.",
//       );
//       // Stay on checkout — cart still in localStorage if clear never ran
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   if (!hydrated) {
//     return (
//       <main className="section">
//         <div
//           className="container-site"
//           style={{ textAlign: "center", padding: "80px 0" }}
//         >
//           <h1 style={{ color: "#451a03" }}>Loading checkout…</h1>
//         </div>
//       </main>
//     );
//   }

//   if (items.length === 0) {
//     return (
//       <>
//         <header className="site-header">
//           <div className="container-site header-inner">
//             <Link href="/food">
//               <img
//                 src="/images/sreshta-food-logo.png"
//                 alt="Sreshta Foods"
//                 className="header-logo"
//               />
//             </Link>
//             <Link
//               href="/food/products"
//               className="btn-primary"
//               style={{ background: "#d97706" }}
//             >
//               Shop Products
//             </Link>
//           </div>
//         </header>

//         <main className="section">
//           <div
//             className="container-site"
//             style={{
//               textAlign: "center",
//               paddingTop: 80,
//               paddingBottom: 80,
//             }}
//           >
//             <h1 style={{ color: "#451a03" }}>Your cart is empty</h1>
//             <p>Add products before continuing to checkout.</p>
//             <Link
//               href="/food/products"
//               className="btn-primary"
//               style={{ marginTop: 20, background: "#d97706" }}
//             >
//               Browse Products
//             </Link>
//           </div>
//         </main>
//       </>
//     );
//   }

//   return (
//     <>
//       <header className="site-header">
//         <div className="container-site header-inner">
//           <Link href="/food">
//             <img
//               src="/images/sreshta-food-logo.png"
//               alt="Sreshta Foods"
//               className="header-logo"
//             />
//           </Link>
//           <Link href="/food/cart" className="btn-secondary">
//             ← Back to Cart
//           </Link>
//         </div>
//       </header>

//       <main>
//         <section style={{ background: "#fff7ed", padding: "65px 0" }}>
//           <div className="container-site">
//             <span className="section-label" style={{ color: "#b45309" }}>
//               Checkout
//             </span>
//             <h1 className="section-title" style={{ color: "#451a03" }}>
//               Complete Your Order
//             </h1>
//           </div>
//         </section>

//         <section className="section">
//           <div className="container-site">
//             <div
//               style={{
//                 display: "grid",
//                 gridTemplateColumns: "1.4fr .8fr",
//                 gap: 30,
//                 alignItems: "start",
//               }}
//             >
//               <div className="form-shell">
//                 <span className="section-label" style={{ color: "#b45309" }}>
//                   Customer Details
//                 </span>
//                 <h2
//                   className="section-title"
//                   style={{ color: "#451a03", fontSize: "2rem" }}
//                 >
//                   Delivery Information
//                 </h2>

//                 <form onSubmit={handleSubmit}>
//                   <div className="form-grid" style={{ marginTop: 28 }}>
//                     <div className="form-group">
//                       <label className="form-label" htmlFor="name">
//                         Full Name *
//                       </label>
//                       <input
//                         id="name"
//                         name="name"
//                         className="input"
//                         placeholder="Your full name"
//                         required
//                       />
//                     </div>

//                     <div className="form-group">
//                       <label className="form-label" htmlFor="phone">
//                         Phone *
//                       </label>
//                       <input
//                         id="phone"
//                         name="phone"
//                         className="input"
//                         type="tel"
//                         placeholder="10-digit phone number"
//                         required
//                       />
//                     </div>

//                     <div className="form-group full">
//                       <label className="form-label" htmlFor="email">
//                         Email *
//                       </label>
//                       <input
//                         id="email"
//                         name="email"
//                         className="input"
//                         type="email"
//                         placeholder="you@example.com"
//                         required
//                       />
//                     </div>

//                     <div className="form-group full">
//                       <label className="form-label" htmlFor="address">
//                         Delivery Address *
//                       </label>
//                       <textarea
//                         id="address"
//                         name="address"
//                         className="textarea"
//                         placeholder="House / flat, street, locality"
//                         required
//                       />
//                     </div>

//                     <div className="form-group">
//                       <label className="form-label" htmlFor="city">
//                         City *
//                       </label>
//                       <input
//                         id="city"
//                         name="city"
//                         className="input"
//                         placeholder="City"
//                         required
//                       />
//                     </div>

//                     <div className="form-group">
//                       <label className="form-label" htmlFor="state">
//                         State *
//                       </label>
//                       <input
//                         id="state"
//                         name="state"
//                         className="input"
//                         placeholder="State"
//                         required
//                       />
//                     </div>

//                     <div className="form-group">
//                       <label className="form-label" htmlFor="pinCode">
//                         PIN Code *
//                       </label>
//                       <input
//                         id="pinCode"
//                         name="pinCode"
//                         className="input"
//                         placeholder="PIN code"
//                         required
//                       />
//                     </div>

//                     {/* Optional coupon */}
//                     <div className="form-group full">
//                       <label className="form-label" htmlFor="couponInput">
//                         Coupon code{" "}
//                         <span style={{ fontWeight: 400, opacity: 0.7 }}>
//                           (optional)
//                         </span>
//                       </label>
//                       <div
//                         style={{
//                           display: "flex",
//                           gap: 8,
//                           flexWrap: "wrap",
//                         }}
//                       >
//                         <input
//                           id="couponInput"
//                           className="input"
//                           style={{ flex: 1, minWidth: 160 }}
//                           placeholder="e.g. WELCOME10"
//                           value={couponInput}
//                           onChange={(e) =>
//                             setCouponInput(e.target.value.toUpperCase())
//                           }
//                           disabled={!!appliedCoupon}
//                         />
//                         {!appliedCoupon ? (
//                           <button
//                             type="button"
//                             className="btn-primary"
//                             style={{ background: "#d97706" }}
//                             onClick={applyCoupon}
//                             disabled={couponLoading || subtotal <= 0}
//                           >
//                             {couponLoading ? "Checking…" : "Apply"}
//                           </button>
//                         ) : (
//                           <button
//                             type="button"
//                             className="btn-secondary"
//                             onClick={removeCoupon}
//                           >
//                             Remove
//                           </button>
//                         )}
//                       </div>
//                       {couponMessage && (
//                         <p
//                           style={{
//                             marginTop: 8,
//                             fontSize: 13,
//                             color: appliedCoupon ? "#166534" : "#b91c1c",
//                           }}
//                         >
//                           {couponMessage}
//                         </p>
//                       )}
//                     </div>
//                   </div>

//                   <div
//                     style={{
//                       marginTop: 28,
//                       border: "1px solid #f0e5d6",
//                       borderRadius: 10,
//                       background: "#fffaf5",
//                       padding: 16,
//                     }}
//                   >
//                     <strong style={{ color: "#451a03" }}>Payment</strong>
//                     <p
//                       style={{
//                         margin: "7px 0 0",
//                         color: "#78716c",
//                         fontSize: 13,
//                       }}
//                     >
//                       You will be redirected to Cashfree to complete secure
//                       online payment. Amount charged is the total after any
//                       coupon discount. Order status is confirmed only after
//                       server-side payment verification.
//                     </p>
//                   </div>

//                   {error && (
//                     <div
//                       style={{
//                         marginTop: 16,
//                         borderRadius: 10,
//                         background: "#fef2f2",
//                         color: "#b91c1c",
//                         padding: "12px 14px",
//                         fontSize: 14,
//                       }}
//                     >
//                       {error}
//                     </div>
//                   )}

//                   <button
//                     className="btn-primary"
//                     type="submit"
//                     disabled={submitting}
//                     style={{
//                       marginTop: 25,
//                       width: "100%",
//                       background: "#d97706",
//                       minHeight: 54,
//                     }}
//                   >
//                     {submitting
//                       ? "Creating order & opening payment…"
//                       : `Continue to Payment · ${formatMoney(total)}`}
//                   </button>
//                 </form>
//               </div>

//               <aside
//                 style={{
//                   border: "1px solid #f0e5d6",
//                   borderRadius: 14,
//                   background: "#fffaf5",
//                   padding: 25,
//                   position: "sticky",
//                   top: 100,
//                 }}
//               >
//                 <h2 style={{ color: "#451a03", marginTop: 0 }}>
//                   Order Summary
//                 </h2>

//                 <div style={{ display: "grid", gap: 14 }}>
//                   {items.map((item) => (
//                     <div
//                       key={`${item.productId}-${item.variantId}`}
//                       style={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                         gap: 15,
//                       }}
//                     >
//                       <div>
//                         <strong style={{ color: "#451a03", fontSize: 13 }}>
//                           {item.productName}
//                         </strong>
//                         <div style={{ color: "#78716c", fontSize: 12 }}>
//                           {item.variantLabel} × {item.quantity}
//                         </div>
//                       </div>
//                       <strong>
//                         {formatMoney(item.price * item.quantity)}
//                       </strong>
//                     </div>
//                   ))}

//                   <div
//                     style={{
//                       borderTop: "1px solid #eadbca",
//                       paddingTop: 15,
//                       display: "grid",
//                       gap: 10,
//                     }}
//                   >
//                     <div
//                       style={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                       }}
//                     >
//                       <span>Subtotal</span>
//                       <strong>{formatMoney(subtotal)}</strong>
//                     </div>

//                     {discount > 0 && (
//                       <div
//                         style={{
//                           display: "flex",
//                           justifyContent: "space-between",
//                           color: "#166534",
//                         }}
//                       >
//                         <span>
//                           Discount
//                           {appliedCoupon?.code
//                             ? ` (${appliedCoupon.code})`
//                             : ""}
//                         </span>
//                         <strong>-{formatMoney(discount)}</strong>
//                       </div>
//                     )}

//                     <div
//                       style={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                       }}
//                     >
//                       <span>Delivery</span>
//                       <strong>
//                         {deliveryFee === 0
//                           ? "FREE"
//                           : formatMoney(deliveryFee)}
//                       </strong>
//                     </div>

//                     <div
//                       style={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                         fontSize: 19,
//                         color: "#451a03",
//                       }}
//                     >
//                       <strong>Total payable</strong>
//                       <strong>{formatMoney(total)}</strong>
//                     </div>
//                   </div>
//                 </div>
//               </aside>
//             </div>
//           </div>
//         </section>
//       </main>
//     </>
//   );
// }

// "use client";

// import Link from "next/link";
// import {
//   FormEvent,
//   useEffect,
//   useMemo,
//   useState,
// } from "react";
// import { useSearchParams } from "next/navigation";

// type CartItem = {
//   productId: string;
//   variantId: string;
//   productName: string;
//   variantLabel: string;
//   price: number;
//   quantity: number;
//   image?: string;
// };

// type AppliedCoupon = {
//   couponId: string;
//   code: string;
//   type: "PERCENTAGE" | "FIXED";
//   value: number;
//   maximumDiscount?: number | null;
// };

// type CheckoutDraft = {
//   name: string;
//   phone: string;
//   email: string;
//   address: string;
//   city: string;
//   state: string;
//   pinCode: string;
// };

// type ApiSuccess<T> = {
//   success: true;
//   data: T;
//   message?: string;
// };

// type ApiError = {
//   success: false;
//   error: {
//     code: string;
//     message: string;
//   };
// };

// type ApiResponse<T> = ApiSuccess<T> | ApiError;

// type CreateOrderData = {
//   orderId: string;
//   order?: {
//     orderId: string;
//     total: number;
//     subtotal?: number;
//     discount?: number;
//     status: string;
//     paymentStatus: string;
//   };
// };

// type CashfreeCreateData = {
//   orderId: string;
//   paymentReferenceId?: string;
//   cashfreeOrderId?: string;
//   paymentSessionId?: string;
//   orderStatus?: string;
// };

// const CART_STORAGE_KEY = "sreshta-food-cart";
// const CHECKOUT_DRAFT_KEY = "sreshta-food-checkout-draft";

// const EMPTY_DRAFT: CheckoutDraft = {
//   name: "",
//   phone: "",
//   email: "",
//   address: "",
//   city: "",
//   state: "",
//   pinCode: "",
// };

// declare global {
//   interface Window {
//     Cashfree?: (options: { mode: "sandbox" | "production" }) => {
//       checkout: (options: {
//         paymentSessionId: string;
//         redirectTarget?: "_self" | "_blank";
//       }) => Promise<unknown>;
//     };
//   }
// }

// function loadCashfreeScript(): Promise<void> {
//   return new Promise((resolve, reject) => {
//     if (typeof window === "undefined") {
//       reject(new Error("Cashfree can only load in the browser."));
//       return;
//     }

//     if (window.Cashfree) {
//       resolve();
//       return;
//     }

//     const existing = document.querySelector<HTMLScriptElement>(
//       'script[data-cashfree="sdk"]',
//     );

//     if (existing) {
//       existing.addEventListener("load", () => resolve(), { once: true });
//       existing.addEventListener(
//         "error",
//         () => reject(new Error("Failed to load Cashfree SDK.")),
//         { once: true },
//       );
//       return;
//     }

//     const script = document.createElement("script");
//     script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
//     script.async = true;
//     script.dataset.cashfree = "sdk";
//     script.onload = () => resolve();
//     script.onerror = () =>
//       reject(new Error("Failed to load Cashfree SDK."));
//     document.body.appendChild(script);
//   });
// }

// function getCashfreeMode(): "sandbox" | "production" {
//   const env =
//     process.env.NEXT_PUBLIC_CASHFREE_ENVIRONMENT ||
//     process.env.NEXT_PUBLIC_CASHFREE_MODE;

//   return env === "production" ? "production" : "sandbox";
// }

// function formatMoney(value: number): string {
//   return `₹${Number(value || 0).toFixed(2)}`;
// }

// export default function CheckoutPage() {
//   const searchParams = useSearchParams();

//   const [items, setItems] = useState<CartItem[]>([]);
//   const [hydrated, setHydrated] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const [draft, setDraft] = useState<CheckoutDraft>(EMPTY_DRAFT);

//   const [couponInput, setCouponInput] = useState("");
//   const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(
//     null,
//   );
//   const [couponMessage, setCouponMessage] = useState<string | null>(null);
//   const [couponLoading, setCouponLoading] = useState(false);

//   function updateDraft<K extends keyof CheckoutDraft>(
//     key: K,
//     value: CheckoutDraft[K],
//   ) {
//     setDraft((prev) => {
//       const next = { ...prev, [key]: value };
//       try {
//         localStorage.setItem(CHECKOUT_DRAFT_KEY, JSON.stringify(next));
//       } catch {
//         // ignore
//       }
//       return next;
//     });
//   }

//   // Restore cart (array or { items }) + delivery draft
//   useEffect(() => {
//     try {
//       const raw = localStorage.getItem(CART_STORAGE_KEY);

//       if (!raw) {
//         setItems([]);
//       } else {
//         const parsed = JSON.parse(raw) as unknown;
//         let list: unknown[] = [];

//         if (Array.isArray(parsed)) {
//           list = parsed;
//         } else if (
//           parsed &&
//           typeof parsed === "object" &&
//           Array.isArray((parsed as { items?: unknown }).items)
//         ) {
//           list = (parsed as { items: unknown[] }).items;
//         }

//         const normalized = list
//           .map((row) => {
//             const item = row as Record<string, unknown>;
//             const productId = String(item.productId || "").trim();
//             const variantId = String(item.variantId || "").trim();

//             if (!productId || !variantId) return null;

//             return {
//               productId,
//               variantId,
//               productName: String(
//                 item.productName || item.name || "Product",
//               ),
//               variantLabel: String(
//                 item.variantLabel ||
//                   item.variantName ||
//                   item.label ||
//                   "Variant",
//               ),
//               price: Number(item.price || 0),
//               quantity: Math.max(
//                 1,
//                 Math.floor(Number(item.quantity || 1)),
//               ),
//               image: item.image
//                 ? String(item.image)
//                 : item.imageUrl
//                   ? String(item.imageUrl)
//                   : undefined,
//             } satisfies CartItem;
//           })
//           .filter(Boolean) as CartItem[];

//         setItems(normalized);
//       }

//       const draftRaw = localStorage.getItem(CHECKOUT_DRAFT_KEY);
//       if (draftRaw) {
//         const parsed = JSON.parse(draftRaw) as Partial<CheckoutDraft>;
//         setDraft({
//           name: String(parsed.name || ""),
//           phone: String(parsed.phone || ""),
//           email: String(parsed.email || ""),
//           address: String(parsed.address || ""),
//           city: String(parsed.city || ""),
//           state: String(parsed.state || ""),
//           pinCode: String(parsed.pinCode || ""),
//         });
//       }
//     } catch {
//       setItems([]);
//     } finally {
//       setHydrated(true);
//     }
//   }, []);

//   // Message when returning from cancelled / incomplete payment
//   useEffect(() => {
//     const payment = searchParams.get("payment");
//     if (payment === "incomplete") {
//       setError(
//         "Payment was not completed or was cancelled. Your details are still here — you can try again.",
//       );
//     }
//   }, [searchParams]);

//   const subtotal = useMemo(
//     () =>
//       items.reduce(
//         (sum, item) => sum + item.price * item.quantity,
//         0,
//       ),
//     [items],
//   );

//   const deliveryFee = subtotal > 999 || subtotal === 0 ? 0 : 60;

//   const discount = useMemo(() => {
//     if (!appliedCoupon || subtotal <= 0) return 0;

//     let amount = 0;
//     if (appliedCoupon.type === "PERCENTAGE") {
//       amount = (subtotal * appliedCoupon.value) / 100;
//       if (
//         appliedCoupon.maximumDiscount != null &&
//         Number.isFinite(appliedCoupon.maximumDiscount)
//       ) {
//         amount = Math.min(amount, Number(appliedCoupon.maximumDiscount));
//       }
//     } else {
//       amount = appliedCoupon.value;
//     }

//     return Math.min(Math.max(0, amount), subtotal);
//   }, [appliedCoupon, subtotal]);

//   const total = Math.max(0, subtotal - discount + deliveryFee);

//   async function applyCoupon() {
//     const code = couponInput.trim().toUpperCase();
//     if (!code) {
//       setCouponMessage("Enter a coupon code (optional).");
//       return;
//     }

//     try {
//       setCouponLoading(true);
//       setCouponMessage(null);

//       const res = await fetch(
//         `/api/food/coupons/validate?code=${encodeURIComponent(code)}&subtotal=${subtotal}`,
//         { cache: "no-store" },
//       );
//       const json = await res.json();

//       if (!res.ok || !json.success) {
//         setAppliedCoupon(null);
//         throw new Error(
//           json.error?.message || "Invalid or expired coupon.",
//         );
//       }

//       const c = json.data?.coupon || json.coupon;
//       setAppliedCoupon({
//         couponId: String(c.couponId || c.id),
//         code: String(c.code || code).toUpperCase(),
//         type: c.type === "FIXED" ? "FIXED" : "PERCENTAGE",
//         value: Number(c.value),
//         maximumDiscount: c.maximumDiscount ?? null,
//       });
//       setCouponMessage(
//         `Coupon ${String(c.code || code).toUpperCase()} applied.`,
//       );
//     } catch (e) {
//       setAppliedCoupon(null);
//       setCouponMessage(
//         e instanceof Error ? e.message : "Could not apply coupon.",
//       );
//     } finally {
//       setCouponLoading(false);
//     }
//   }

//   function removeCoupon() {
//     setAppliedCoupon(null);
//     setCouponInput("");
//     setCouponMessage(null);
//   }

//   async function handleSubmit(event: FormEvent<HTMLFormElement>) {
//     event.preventDefault();

//     if (items.length === 0 || submitting) {
//       return;
//     }

//     setSubmitting(true);
//     setError(null);

//     try {
//       const name = draft.name.trim();
//       const phone = draft.phone.trim();
//       const email = draft.email.trim();
//       const addressLine1 = draft.address.trim();
//       const city = draft.city.trim();
//       const state = draft.state.trim();
//       const postalCode = draft.pinCode.trim();

//       if (
//         !name ||
//         !phone ||
//         !email ||
//         !addressLine1 ||
//         !city ||
//         !state ||
//         !postalCode
//       ) {
//         throw new Error("Please fill in all required delivery fields.");
//       }

//       // Keep details if user cancels Cashfree / returns unpaid
//       try {
//         localStorage.setItem(
//           CHECKOUT_DRAFT_KEY,
//           JSON.stringify({
//             name,
//             phone,
//             email,
//             address: addressLine1,
//             city,
//             state,
//             pinCode: postalCode,
//           } satisfies CheckoutDraft),
//         );
//       } catch {
//         // ignore
//       }

//       const orderRes = await fetch("/api/food/orders", {
//         method: "POST",
//         headers: {
//           Accept: "application/json",
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           customer: {
//             name,
//             phone,
//             email,
//             addressLine1,
//             city,
//             state,
//             postalCode,
//             country: "India",
//           },
//           items: items.map((item) => ({
//             productId: item.productId,
//             variantId: item.variantId,
//             quantity: item.quantity,
//           })),
//           deliveryFee,
//           couponId: appliedCoupon?.couponId || null,
//         }),
//       });

//       const orderJson =
//         (await orderRes.json()) as ApiResponse<CreateOrderData>;

//       if (!orderJson.success) {
//         throw new Error(
//           orderJson.error?.message || "Failed to create order.",
//         );
//       }

//       const orderId = String(orderJson.data.orderId || "").trim();

//       if (!orderId) {
//         throw new Error("Order was created without an orderId.");
//       }

//       localStorage.setItem(
//         "sreshta-food-last-order",
//         JSON.stringify({
//           orderId,
//           status: "PENDING_PAYMENT",
//           paymentStatus: "PENDING",
//           total: orderJson.data.order?.total ?? total,
//           discount: orderJson.data.order?.discount ?? discount,
//           createdAt: new Date().toISOString(),
//         }),
//       );

//       const paymentRes = await fetch(
//         "/api/payments/cashfree/create-order",
//         {
//           method: "POST",
//           headers: {
//             Accept: "application/json",
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ orderId }),
//         },
//       );

//       const paymentJson =
//         (await paymentRes.json()) as ApiResponse<CashfreeCreateData>;

//       if (!paymentJson.success) {
//         throw new Error(
//           paymentJson.error?.message ||
//             "Could not start payment. Please try again.",
//         );
//       }

//       const paymentSessionId =
//         paymentJson.data.paymentSessionId?.trim() || "";

//       if (!paymentSessionId) {
//         throw new Error(
//           "Payment session was not created. Check Cashfree sandbox keys.",
//         );
//       }

//       await loadCashfreeScript();

//       if (!window.Cashfree) {
//         throw new Error("Cashfree SDK is unavailable.");
//       }

//       const cashfree = window.Cashfree({
//         mode: getCashfreeMode(),
//       });

//       // Do NOT clear cart here — only clear on paid success page
//       await cashfree.checkout({
//         paymentSessionId,
//         redirectTarget: "_self",
//       });
//     } catch (e) {
//       setError(
//         e instanceof Error
//           ? e.message
//           : "Unable to complete checkout. Please try again.",
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   if (!hydrated) {
//     return (
//       <main className="section">
//         <div
//           className="container-site"
//           style={{ textAlign: "center", padding: "80px 0" }}
//         >
//           <h1 style={{ color: "#451a03" }}>Loading checkout…</h1>
//         </div>
//       </main>
//     );
//   }

//   if (items.length === 0) {
//     return (
//       <>
//         <header className="site-header">
//           <div className="container-site header-inner">
//             <Link href="/food">
//               <img
//                 src="/images/sreshta-food-logo.png"
//                 alt="Sreshta Foods"
//                 className="header-logo"
//               />
//             </Link>
//             <Link
//               href="/food/products"
//               className="btn-primary"
//               style={{ background: "#d97706" }}
//             >
//               Shop Products
//             </Link>
//           </div>
//         </header>

//         <main className="section">
//           <div
//             className="container-site"
//             style={{
//               textAlign: "center",
//               paddingTop: 80,
//               paddingBottom: 80,
//             }}
//           >
//             <h1 style={{ color: "#451a03" }}>Your cart is empty</h1>
//             <p>Add products before continuing to checkout.</p>
//             <Link
//               href="/food/products"
//               className="btn-primary"
//               style={{ marginTop: 20, background: "#d97706" }}
//             >
//               Browse Products
//             </Link>
//           </div>
//         </main>
//       </>
//     );
//   }

//   return (
//     <>
//       <header className="site-header">
//         <div className="container-site header-inner">
//           <Link href="/food">
//             <img
//               src="/images/sreshta-food-logo.png"
//               alt="Sreshta Foods"
//               className="header-logo"
//             />
//           </Link>
//           <Link href="/food/cart" className="btn-secondary">
//             ← Back to Cart
//           </Link>
//         </div>
//       </header>

//       <main>
//         <section style={{ background: "#fff7ed", padding: "65px 0" }}>
//           <div className="container-site">
//             <span className="section-label" style={{ color: "#b45309" }}>
//               Checkout
//             </span>
//             <h1 className="section-title" style={{ color: "#451a03" }}>
//               Complete Your Order
//             </h1>
//           </div>
//         </section>

//         <section className="section">
//           <div className="container-site">
//             <div
//               style={{
//                 display: "grid",
//                 gridTemplateColumns: "1.4fr .8fr",
//                 gap: 30,
//                 alignItems: "start",
//               }}
//             >
//               <div className="form-shell">
//                 <span className="section-label" style={{ color: "#b45309" }}>
//                   Customer Details
//                 </span>
//                 <h2
//                   className="section-title"
//                   style={{ color: "#451a03", fontSize: "2rem" }}
//                 >
//                   Delivery Information
//                 </h2>

//                 <form onSubmit={handleSubmit}>
//                   <div className="form-grid" style={{ marginTop: 28 }}>
//                     <div className="form-group">
//                       <label className="form-label" htmlFor="name">
//                         Full Name *
//                       </label>
//                       <input
//                         id="name"
//                         name="name"
//                         className="input"
//                         placeholder="Your full name"
//                         required
//                         value={draft.name}
//                         onChange={(e) => updateDraft("name", e.target.value)}
//                       />
//                     </div>

//                     <div className="form-group">
//                       <label className="form-label" htmlFor="phone">
//                         Phone 
//                       </label>
//                       <input
//                         id="phone"
//                         name="phone"
//                         className="input"
//                         type="tel"
//                         placeholder="10-digit phone number"
//                         required
//                         value={draft.phone}
//                         onChange={(e) => updateDraft("phone", e.target.value)}
//                       />
//                     </div>

//                     <div className="form-group full">
//                       <label className="form-label" htmlFor="email">
//                         Email *
//                       </label>
//                       <input
//                         id="email"
//                         name="email"
//                         className="input"
//                         type="email"
//                         placeholder="you@example.com"
//                         required
//                         value={draft.email}
//                         onChange={(e) => updateDraft("email", e.target.value)}
//                       />
//                     </div>

//                     <div className="form-group full">
//                       <label className="form-label" htmlFor="address">
//                         Delivery Address *
//                       </label>
//                       <textarea
//                         id="address"
//                         name="address"
//                         className="textarea"
//                         placeholder="House / flat, street, locality"
//                         required
//                         value={draft.address}
//                         onChange={(e) =>
//                           updateDraft("address", e.target.value)
//                         }
//                       />
//                     </div>

//                     <div className="form-group">
//                       <label className="form-label" htmlFor="city">
//                         City *
//                       </label>
//                       <input
//                         id="city"
//                         name="city"
//                         className="input"
//                         placeholder="City"
//                         required
//                         value={draft.city}
//                         onChange={(e) => updateDraft("city", e.target.value)}
//                       />
//                     </div>

//                     <div className="form-group">
//                       <label className="form-label" htmlFor="state">
//                         State *
//                       </label>
//                       <input
//                         id="state"
//                         name="state"
//                         className="input"
//                         placeholder="State"
//                         required
//                         value={draft.state}
//                         onChange={(e) => updateDraft("state", e.target.value)}
//                       />
//                     </div>

//                     <div className="form-group">
//                       <label className="form-label" htmlFor="pinCode">
//                         PIN Code *
//                       </label>
//                       <input
//                         id="pinCode"
//                         name="pinCode"
//                         className="input"
//                         placeholder="PIN code"
//                         required
//                         value={draft.pinCode}
//                         onChange={(e) =>
//                           updateDraft("pinCode", e.target.value)
//                         }
//                       />
//                     </div>

//                     <div className="form-group full">
//                       <label className="form-label" htmlFor="couponInput">
//                         Coupon code{" "}
//                         <span style={{ fontWeight: 400, opacity: 0.7 }}>
//                           (optional)
//                         </span>
//                       </label>
//                       <div
//                         style={{
//                           display: "flex",
//                           gap: 8,
//                           flexWrap: "wrap",
//                         }}
//                       >
//                         <input
//                           id="couponInput"
//                           className="input"
//                           style={{ flex: 1, minWidth: 160 }}
//                           placeholder="e.g. WELCOME10"
//                           value={couponInput}
//                           onChange={(e) =>
//                             setCouponInput(e.target.value.toUpperCase())
//                           }
//                           disabled={!!appliedCoupon}
//                         />
//                         {!appliedCoupon ? (
//                           <button
//                             type="button"
//                             className="btn-primary"
//                             style={{ background: "#d97706" }}
//                             onClick={applyCoupon}
//                             disabled={couponLoading || subtotal <= 0}
//                           >
//                             {couponLoading ? "Checking…" : "Apply"}
//                           </button>
//                         ) : (
//                           <button
//                             type="button"
//                             className="btn-secondary"
//                             onClick={removeCoupon}
//                           >
//                             Remove
//                           </button>
//                         )}
//                       </div>
//                       {couponMessage && (
//                         <p
//                           style={{
//                             marginTop: 8,
//                             fontSize: 13,
//                             color: appliedCoupon ? "#166534" : "#b91c1c",
//                           }}
//                         >
//                           {couponMessage}
//                         </p>
//                       )}
//                     </div>
//                   </div>

//                   <div
//                     style={{
//                       marginTop: 28,
//                       border: "1px solid #f0e5d6",
//                       borderRadius: 10,
//                       background: "#fffaf5",
//                       padding: 16,
//                     }}
//                   >
//                     <strong style={{ color: "#451a03" }}>Payment</strong>
//                     <p
//                       style={{
//                         margin: "7px 0 0",
//                         color: "#78716c",
//                         fontSize: 13,
//                       }}
//                     >
//                       You will be redirected to Cashfree to complete secure
//                       online payment. Amount charged is the total after any
//                       coupon discount. Order status is confirmed only after
//                       server-side payment verification.
//                     </p>
//                   </div>

//                   {error && (
//                     <div
//                       style={{
//                         marginTop: 16,
//                         borderRadius: 10,
//                         background: "#fef2f2",
//                         color: "#b91c1c",
//                         padding: "12px 14px",
//                         fontSize: 14,
//                       }}
//                     >
//                       {error}
//                     </div>
//                   )}

                  

//                   <button
//                     className="btn-primary"
//                     type="submit"
//                     disabled={submitting}
//                     style={{
//                       marginTop: 25,
//                       width: "100%",
//                       background: "#d97706",
//                       minHeight: 54,
//                     }}
//                   >
//                     {submitting
//                       ? "Creating order & opening payment…"
//                       : `Continue to Payment · ${formatMoney(total)}`}
//                   </button>
//                 </form>
//               </div>

//               <aside
//                 style={{
//                   border: "1px solid #f0e5d6",
//                   borderRadius: 14,
//                   background: "#fffaf5",
//                   padding: 25,
//                   position: "sticky",
//                   top: 100,
//                 }}
//               >
//                 <h2 style={{ color: "#451a03", marginTop: 0 }}>
//                   Order Summary
//                 </h2>

//                 <div style={{ display: "grid", gap: 14 }}>
//                   {items.map((item) => (
//                     <div
//                       key={`${item.productId}-${item.variantId}`}
//                       style={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                         gap: 15,
//                       }}
//                     >
//                       <div>
//                         <strong style={{ color: "#451a03", fontSize: 13 }}>
//                           {item.productName}
//                         </strong>
//                         <div style={{ color: "#78716c", fontSize: 12 }}>
//                           {item.variantLabel} × {item.quantity}
//                         </div>
//                       </div>
//                       <strong>
//                         {formatMoney(item.price * item.quantity)}
//                       </strong>
//                     </div>
//                   ))}

//                   <div
//                     style={{
//                       borderTop: "1px solid #eadbca",
//                       paddingTop: 15,
//                       display: "grid",
//                       gap: 10,
//                     }}
//                   >
//                     <div
//                       style={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                       }}
//                     >
//                       <span>Subtotal</span>
//                       <strong>{formatMoney(subtotal)}</strong>
//                     </div>

//                     {discount > 0 && (
//                       <div
//                         style={{
//                           display: "flex",
//                           justifyContent: "space-between",
//                           color: "#166534",
//                         }}
//                       >
//                         <span>
//                           Discount
//                           {appliedCoupon?.code
//                             ? ` (${appliedCoupon.code})`
//                             : ""}
//                         </span>
//                         <strong>-{formatMoney(discount)}</strong>
//                       </div>
//                     )}

//                     <div
//                       style={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                       }}
//                     >
//                       <span>Delivery</span>
//                       <strong>
//                         {deliveryFee === 0
//                           ? "FREE"
//                           : formatMoney(deliveryFee)}
//                       </strong>
//                     </div>

//                     <div
//                       style={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                         fontSize: 19,
//                         color: "#451a03",
//                       }}
//                     >
//                       <strong>Total payable</strong>
//                       <strong>{formatMoney(total)}</strong>
//                     </div>
//                   </div>
//                 </div>
//               </aside>
//             </div>
//           </div>
//         </section>
//       </main>
//     </>
//   );
// }

// "use client";

// import Link from "next/link";
// import {
//   FormEvent,
//   useEffect,
//   useMemo,
//   useState,
// } from "react";
// import { useSearchParams } from "next/navigation";

// type CartItem = {
//   productId: string;
//   variantId: string;
//   productName: string;
//   variantLabel: string;
//   price: number;
//   quantity: number;
//   image?: string;
// };

// type AppliedCoupon = {
//   couponId: string;
//   code: string;
//   type: "PERCENTAGE" | "FIXED";
//   value: number;
//   maximumDiscount?: number | null;
// };

// type CheckoutDraft = {
//   name: string;
//   phone: string;
//   email: string;
//   address: string;
//   city: string;
//   state: string;
//   pinCode: string;
// };

// type FoodSettingsPublic = {
//   acceptNewOrders: boolean;
//   enableCashfreePayments: boolean;
//   storeName: string;
// };

// type ApiSuccess<T> = {
//   success: true;
//   data: T;
//   message?: string;
// };

// type ApiError = {
//   success: false;
//   error: {
//     code: string;
//     message: string;
//   };
// };

// type ApiResponse<T> = ApiSuccess<T> | ApiError;

// type CreateOrderData = {
//   orderId: string;
//   order?: {
//     orderId: string;
//     total: number;
//     subtotal?: number;
//     discount?: number;
//     status: string;
//     paymentStatus: string;
//   };
// };

// type CashfreeCreateData = {
//   orderId: string;
//   paymentReferenceId?: string;
//   cashfreeOrderId?: string;
//   paymentSessionId?: string;
//   orderStatus?: string;
// };

// const CART_STORAGE_KEY = "sreshta-food-cart";
// const CHECKOUT_DRAFT_KEY = "sreshta-food-checkout-draft";

// const EMPTY_DRAFT: CheckoutDraft = {
//   name: "",
//   phone: "",
//   email: "",
//   address: "",
//   city: "",
//   state: "",
//   pinCode: "",
// };

// const DEFAULT_SETTINGS: FoodSettingsPublic = {
//   acceptNewOrders: true,
//   enableCashfreePayments: false,
//   storeName: "Sreshta Foods",
// };

// async function loadFoodSettings(): Promise<FoodSettingsPublic> {
//   try {
//     const res = await fetch("/api/food/settings", {
//       method: "GET",
//       headers: { Accept: "application/json" },
//       cache: "no-store",
//     });
//     const json = await res.json();
//     if (!res.ok || !json.success) return DEFAULT_SETTINGS;
//     return { ...DEFAULT_SETTINGS, ...json.data };
//   } catch {
//     return DEFAULT_SETTINGS;
//   }
// }

// declare global {
//   interface Window {
//     Cashfree?: (options: { mode: "sandbox" | "production" }) => {
//       checkout: (options: {
//         paymentSessionId: string;
//         redirectTarget?: "_self" | "_blank";
//       }) => Promise<unknown>;
//     };
//   }
// }

// function loadCashfreeScript(): Promise<void> {
//   return new Promise((resolve, reject) => {
//     if (typeof window === "undefined") {
//       reject(new Error("Cashfree can only load in the browser."));
//       return;
//     }

//     if (window.Cashfree) {
//       resolve();
//       return;
//     }

//     const existing = document.querySelector<HTMLScriptElement>(
//       'script[data-cashfree="sdk"]',
//     );

//     if (existing) {
//       existing.addEventListener("load", () => resolve(), { once: true });
//       existing.addEventListener(
//         "error",
//         () => reject(new Error("Failed to load Cashfree SDK.")),
//         { once: true },
//       );
//       return;
//     }

//     const script = document.createElement("script");
//     script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
//     script.async = true;
//     script.dataset.cashfree = "sdk";
//     script.onload = () => resolve();
//     script.onerror = () =>
//       reject(new Error("Failed to load Cashfree SDK."));
//     document.body.appendChild(script);
//   });
// }

// function getCashfreeMode(): "sandbox" | "production" {
//   const env =
//     process.env.NEXT_PUBLIC_CASHFREE_ENVIRONMENT ||
//     process.env.NEXT_PUBLIC_CASHFREE_MODE;

//   return env === "production" ? "production" : "sandbox";
// }

// function formatMoney(value: number): string {
//   return `₹${Number(value || 0).toFixed(2)}`;
// }

// export default function CheckoutPage() {
//   const searchParams = useSearchParams();

//   const [items, setItems] = useState<CartItem[]>([]);
//   const [hydrated, setHydrated] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const [draft, setDraft] = useState<CheckoutDraft>(EMPTY_DRAFT);
//   const [settings, setSettings] =
//     useState<FoodSettingsPublic>(DEFAULT_SETTINGS);

//   const [couponInput, setCouponInput] = useState("");
//   const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(
//     null,
//   );
//   const [couponMessage, setCouponMessage] = useState<string | null>(null);
//   const [couponLoading, setCouponLoading] = useState(false);

//   const canCheckout =
//     settings.acceptNewOrders && settings.enableCashfreePayments;

//   function updateDraft<K extends keyof CheckoutDraft>(
//     key: K,
//     value: CheckoutDraft[K],
//   ) {
//     setDraft((prev) => {
//       const next = { ...prev, [key]: value };
//       try {
//         localStorage.setItem(CHECKOUT_DRAFT_KEY, JSON.stringify(next));
//       } catch {
//         // ignore
//       }
//       return next;
//     });
//   }

//   useEffect(() => {
//     let cancelled = false;

//     (async () => {
//       const s = await loadFoodSettings();
//       if (!cancelled) setSettings(s);
//     })();

//     return () => {
//       cancelled = true;
//     };
//   }, []);

//   useEffect(() => {
//     try {
//       const raw = localStorage.getItem(CART_STORAGE_KEY);

//       if (!raw) {
//         setItems([]);
//       } else {
//         const parsed = JSON.parse(raw) as unknown;
//         let list: unknown[] = [];

//         if (Array.isArray(parsed)) {
//           list = parsed;
//         } else if (
//           parsed &&
//           typeof parsed === "object" &&
//           Array.isArray((parsed as { items?: unknown }).items)
//         ) {
//           list = (parsed as { items: unknown[] }).items;
//         }

//         const normalized = list
//           .map((row) => {
//             const item = row as Record<string, unknown>;
//             const productId = String(item.productId || "").trim();
//             const variantId = String(item.variantId || "").trim();

//             if (!productId || !variantId) return null;

//             return {
//               productId,
//               variantId,
//               productName: String(
//                 item.productName || item.name || "Product",
//               ),
//               variantLabel: String(
//                 item.variantLabel ||
//                   item.variantName ||
//                   item.label ||
//                   "Variant",
//               ),
//               price: Number(item.price || 0),
//               quantity: Math.max(
//                 1,
//                 Math.floor(Number(item.quantity || 1)),
//               ),
//               image: item.image
//                 ? String(item.image)
//                 : item.imageUrl
//                   ? String(item.imageUrl)
//                   : undefined,
//             } satisfies CartItem;
//           })
//           .filter(Boolean) as CartItem[];

//         setItems(normalized);
//       }

//       const draftRaw = localStorage.getItem(CHECKOUT_DRAFT_KEY);
//       if (draftRaw) {
//         const parsed = JSON.parse(draftRaw) as Partial<CheckoutDraft>;
//         setDraft({
//           name: String(parsed.name || ""),
//           phone: String(parsed.phone || ""),
//           email: String(parsed.email || ""),
//           address: String(parsed.address || ""),
//           city: String(parsed.city || ""),
//           state: String(parsed.state || ""),
//           pinCode: String(parsed.pinCode || ""),
//         });
//       }
//     } catch {
//       setItems([]);
//     } finally {
//       setHydrated(true);
//     }
//   }, []);

//   useEffect(() => {
//     const payment = searchParams.get("payment");
//     if (payment === "incomplete") {
//       setError(
//         "Payment was not completed or was cancelled. Your details are still here — you can try again.",
//       );
//     }
//   }, [searchParams]);

//   const subtotal = useMemo(
//     () =>
//       items.reduce(
//         (sum, item) => sum + item.price * item.quantity,
//         0,
//       ),
//     [items],
//   );

//   const deliveryFee = subtotal > 999 || subtotal === 0 ? 0 : 60;

//   const discount = useMemo(() => {
//     if (!appliedCoupon || subtotal <= 0) return 0;

//     let amount = 0;
//     if (appliedCoupon.type === "PERCENTAGE") {
//       amount = (subtotal * appliedCoupon.value) / 100;
//       if (
//         appliedCoupon.maximumDiscount != null &&
//         Number.isFinite(appliedCoupon.maximumDiscount)
//       ) {
//         amount = Math.min(amount, Number(appliedCoupon.maximumDiscount));
//       }
//     } else {
//       amount = appliedCoupon.value;
//     }

//     return Math.min(Math.max(0, amount), subtotal);
//   }, [appliedCoupon, subtotal]);

//   const total = Math.max(0, subtotal - discount + deliveryFee);

//   async function applyCoupon() {
//     const code = couponInput.trim().toUpperCase();
//     if (!code) {
//       setCouponMessage("Enter a coupon code (optional).");
//       return;
//     }

//     try {
//       setCouponLoading(true);
//       setCouponMessage(null);

//       const res = await fetch(
//         `/api/food/coupons/validate?code=${encodeURIComponent(code)}&subtotal=${subtotal}`,
//         { cache: "no-store" },
//       );
//       const json = await res.json();

//       if (!res.ok || !json.success) {
//         setAppliedCoupon(null);
//         throw new Error(
//           json.error?.message || "Invalid or expired coupon.",
//         );
//       }

//       const c = json.data?.coupon || json.coupon;
//       setAppliedCoupon({
//         couponId: String(c.couponId || c.id),
//         code: String(c.code || code).toUpperCase(),
//         type: c.type === "FIXED" ? "FIXED" : "PERCENTAGE",
//         value: Number(c.value),
//         maximumDiscount: c.maximumDiscount ?? null,
//       });
//       setCouponMessage(
//         `Coupon ${String(c.code || code).toUpperCase()} applied.`,
//       );
//     } catch (e) {
//       setAppliedCoupon(null);
//       setCouponMessage(
//         e instanceof Error ? e.message : "Could not apply coupon.",
//       );
//     } finally {
//       setCouponLoading(false);
//     }
//   }

//   function removeCoupon() {
//     setAppliedCoupon(null);
//     setCouponInput("");
//     setCouponMessage(null);
//   }

//   async function handleSubmit(event: FormEvent<HTMLFormElement>) {
//     event.preventDefault();

//     if (items.length === 0 || submitting) return;

//     setSubmitting(true);
//     setError(null);

//     try {
//       // Always re-check settings at submit time
//       const liveSettings = await loadFoodSettings();
//       setSettings(liveSettings);

//       if (!liveSettings.acceptNewOrders) {
//         throw new Error(
//           "We are not accepting new orders at the moment.",
//         );
//       }

//       if (!liveSettings.enableCashfreePayments) {
//         throw new Error(
//           "Online payment is temporarily disabled. Please contact support.",
//         );
//       }

//       const name = draft.name.trim();
//       const phone = draft.phone.trim();
//       const email = draft.email.trim();
//       const addressLine1 = draft.address.trim();
//       const city = draft.city.trim();
//       const state = draft.state.trim();
//       const postalCode = draft.pinCode.trim();

//       if (
//         !name ||
//         !phone ||
//         !email ||
//         !addressLine1 ||
//         !city ||
//         !state ||
//         !postalCode
//       ) {
//         throw new Error("Please fill in all required delivery fields.");
//       }

//       try {
//         localStorage.setItem(
//           CHECKOUT_DRAFT_KEY,
//           JSON.stringify({
//             name,
//             phone,
//             email,
//             address: addressLine1,
//             city,
//             state,
//             pinCode: postalCode,
//           } satisfies CheckoutDraft),
//         );
//       } catch {
//         // ignore
//       }

//       const orderRes = await fetch("/api/food/orders", {
//         method: "POST",
//         headers: {
//           Accept: "application/json",
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           customer: {
//             name,
//             phone,
//             email,
//             addressLine1,
//             city,
//             state,
//             postalCode,
//             country: "India",
//           },
//           items: items.map((item) => ({
//             productId: item.productId,
//             variantId: item.variantId,
//             quantity: item.quantity,
//           })),
//           deliveryFee,
//           couponId: appliedCoupon?.couponId || null,
//         }),
//       });

//       const orderJson =
//         (await orderRes.json()) as ApiResponse<CreateOrderData>;

//       if (!orderJson.success) {
//         throw new Error(
//           orderJson.error?.message || "Failed to create order.",
//         );
//       }

//       const orderId = String(orderJson.data.orderId || "").trim();

//       if (!orderId) {
//         throw new Error("Order was created without an orderId.");
//       }

//       localStorage.setItem(
//         "sreshta-food-last-order",
//         JSON.stringify({
//           orderId,
//           status: "PENDING_PAYMENT",
//           paymentStatus: "PENDING",
//           total: orderJson.data.order?.total ?? total,
//           discount: orderJson.data.order?.discount ?? discount,
//           createdAt: new Date().toISOString(),
//         }),
//       );

//       const paymentRes = await fetch(
//         "/api/payments/cashfree/create-order",
//         {
//           method: "POST",
//           headers: {
//             Accept: "application/json",
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ orderId }),
//         },
//       );

//       const paymentJson =
//         (await paymentRes.json()) as ApiResponse<CashfreeCreateData>;

//       if (!paymentJson.success) {
//         throw new Error(
//           paymentJson.error?.message ||
//             "Could not start payment. Please try again.",
//         );
//       }

//       const paymentSessionId =
//         paymentJson.data.paymentSessionId?.trim() || "";

//       if (!paymentSessionId) {
//         throw new Error(
//           "Payment session was not created. Check Cashfree sandbox keys.",
//         );
//       }

//       await loadCashfreeScript();

//       if (!window.Cashfree) {
//         throw new Error("Cashfree SDK is unavailable.");
//       }

//       const cashfree = window.Cashfree({
//         mode: getCashfreeMode(),
//       });

//       // Do NOT clear cart here — only clear on paid success page
//       await cashfree.checkout({
//         paymentSessionId,
//         redirectTarget: "_self",
//       });
//     } catch (e) {
//       setError(
//         e instanceof Error
//           ? e.message
//           : "Unable to complete checkout. Please try again.",
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   if (!hydrated) {
//     return (
//       <main className="section">
//         <div
//           className="container-site"
//           style={{ textAlign: "center", padding: "80px 0" }}
//         >
//           <h1 style={{ color: "#451a03" }}>Loading checkout…</h1>
//         </div>
//       </main>
//     );
//   }

//   if (items.length === 0) {
//     return (
//       <>
//         <header className="site-header">
//           <div className="container-site header-inner">
//             <Link href="/food">
//               <img
//                 src="/images/sreshta-food-logo.png"
//                 alt="Sreshta Foods"
//                 className="header-logo"
//               />
//             </Link>
//             <Link
//               href="/food/products"
//               className="btn-primary"
//               style={{ background: "#d97706" }}
//             >
//               Shop Products
//             </Link>
//           </div>
//         </header>

//         <main className="section">
//           <div
//             className="container-site"
//             style={{
//               textAlign: "center",
//               paddingTop: 80,
//               paddingBottom: 80,
//             }}
//           >
//             <h1 style={{ color: "#451a03" }}>Your cart is empty</h1>
//             <p>Add products before continuing to checkout.</p>
//             <Link
//               href="/food/products"
//               className="btn-primary"
//               style={{ marginTop: 20, background: "#d97706" }}
//             >
//               Browse Products
//             </Link>
//           </div>
//         </main>
//       </>
//     );
//   }

//   return (
//     <>
//       <header className="site-header">
//         <div className="container-site header-inner">
//           <Link href="/food">
//             <img
//               src="/images/sreshta-food-logo.png"
//               alt="Sreshta Foods"
//               className="header-logo"
//             />
//           </Link>
//           <Link href="/food/cart" className="btn-secondary">
//             ← Back to Cart
//           </Link>
//         </div>
//       </header>

//       <main>
//         <section style={{ background: "#fff7ed", padding: "65px 0" }}>
//           <div className="container-site">
//             <span className="section-label" style={{ color: "#b45309" }}>
//               Checkout
//             </span>
//             <h1 className="section-title" style={{ color: "#451a03" }}>
//               Complete Your Order
//             </h1>
//           </div>
//         </section>

//         <section className="section">
//           <div className="container-site">
//             {!settings.acceptNewOrders && (
//               <div
//                 style={{
//                   marginBottom: 20,
//                   borderRadius: 12,
//                   border: "1px solid #fde68a",
//                   background: "#fffbeb",
//                   color: "#92400e",
//                   padding: "14px 16px",
//                   fontSize: 14,
//                   fontWeight: 600,
//                 }}
//               >
//                 We are not accepting new orders right now. Please try again
//                 later.
//               </div>
//             )}

//             {settings.acceptNewOrders && !settings.enableCashfreePayments && (
//               <div
//                 style={{
//                   marginBottom: 20,
//                   borderRadius: 12,
//                   border: "1px solid #fecaca",
//                   background: "#fef2f2",
//                   color: "#991b1b",
//                   padding: "14px 16px",
//                   fontSize: 14,
//                   fontWeight: 600,
//                 }}
//               >
//                 Online payment is temporarily disabled. Please contact
//                 support.
//               </div>
//             )}

//             <div
//               style={{
//                 display: "grid",
//                 gridTemplateColumns: "1.4fr .8fr",
//                 gap: 30,
//                 alignItems: "start",
//               }}
//             >
//               <div className="form-shell">
//                 <span className="section-label" style={{ color: "#b45309" }}>
//                   Customer Details
//                 </span>
//                 <h2
//                   className="section-title"
//                   style={{ color: "#451a03", fontSize: "2rem" }}
//                 >
//                   Delivery Information
//                 </h2>

//                 <form onSubmit={handleSubmit}>
//                   <div className="form-grid" style={{ marginTop: 28 }}>
//                     <div className="form-group">
//                       <label className="form-label" htmlFor="name">
//                         Full Name *
//                       </label>
//                       <input
//                         id="name"
//                         name="name"
//                         className="input"
//                         placeholder="Your full name"
//                         required
//                         value={draft.name}
//                         onChange={(e) => updateDraft("name", e.target.value)}
//                         disabled={!canCheckout}
//                       />
//                     </div>

//                     <div className="form-group">
//                       <label className="form-label" htmlFor="phone">
//                         Phone *
//                       </label>
//                       <input
//                         id="phone"
//                         name="phone"
//                         className="input"
//                         type="tel"
//                         placeholder="10-digit phone number"
//                         required
//                         value={draft.phone}
//                         onChange={(e) => updateDraft("phone", e.target.value)}
//                         disabled={!canCheckout}
//                       />
//                     </div>

//                     <div className="form-group full">
//                       <label className="form-label" htmlFor="email">
//                         Email *
//                       </label>
//                       <input
//                         id="email"
//                         name="email"
//                         className="input"
//                         type="email"
//                         placeholder="you@example.com"
//                         required
//                         value={draft.email}
//                         onChange={(e) => updateDraft("email", e.target.value)}
//                         disabled={!canCheckout}
//                       />
//                     </div>

//                     <div className="form-group full">
//                       <label className="form-label" htmlFor="address">
//                         Delivery Address *
//                       </label>
//                       <textarea
//                         id="address"
//                         name="address"
//                         className="textarea"
//                         placeholder="House / flat, street, locality"
//                         required
//                         value={draft.address}
//                         onChange={(e) =>
//                           updateDraft("address", e.target.value)
//                         }
//                         disabled={!canCheckout}
//                       />
//                     </div>

//                     <div className="form-group">
//                       <label className="form-label" htmlFor="city">
//                         City *
//                       </label>
//                       <input
//                         id="city"
//                         name="city"
//                         className="input"
//                         placeholder="City"
//                         required
//                         value={draft.city}
//                         onChange={(e) => updateDraft("city", e.target.value)}
//                         disabled={!canCheckout}
//                       />
//                     </div>

//                     <div className="form-group">
//                       <label className="form-label" htmlFor="state">
//                         State *
//                       </label>
//                       <input
//                         id="state"
//                         name="state"
//                         className="input"
//                         placeholder="State"
//                         required
//                         value={draft.state}
//                         onChange={(e) => updateDraft("state", e.target.value)}
//                         disabled={!canCheckout}
//                       />
//                     </div>

//                     <div className="form-group">
//                       <label className="form-label" htmlFor="pinCode">
//                         PIN Code *
//                       </label>
//                       <input
//                         id="pinCode"
//                         name="pinCode"
//                         className="input"
//                         placeholder="PIN code"
//                         required
//                         value={draft.pinCode}
//                         onChange={(e) =>
//                           updateDraft("pinCode", e.target.value)
//                         }
//                         disabled={!canCheckout}
//                       />
//                     </div>

//                     <div className="form-group full">
//                       <label className="form-label" htmlFor="couponInput">
//                         Coupon code{" "}
//                         <span style={{ fontWeight: 400, opacity: 0.7 }}>
//                           (optional)
//                         </span>
//                       </label>
//                       <div
//                         style={{
//                           display: "flex",
//                           gap: 8,
//                           flexWrap: "wrap",
//                         }}
//                       >
//                         <input
//                           id="couponInput"
//                           className="input"
//                           style={{ flex: 1, minWidth: 160 }}
//                           placeholder="e.g. WELCOME10"
//                           value={couponInput}
//                           onChange={(e) =>
//                             setCouponInput(e.target.value.toUpperCase())
//                           }
//                           disabled={!!appliedCoupon || !canCheckout}
//                         />
//                         {!appliedCoupon ? (
//                           <button
//                             type="button"
//                             className="btn-primary"
//                             style={{ background: "#d97706" }}
//                             onClick={applyCoupon}
//                             disabled={
//                               couponLoading || subtotal <= 0 || !canCheckout
//                             }
//                           >
//                             {couponLoading ? "Checking…" : "Apply"}
//                           </button>
//                         ) : (
//                           <button
//                             type="button"
//                             className="btn-secondary"
//                             onClick={removeCoupon}
//                             disabled={!canCheckout}
//                           >
//                             Remove
//                           </button>
//                         )}
//                       </div>
//                       {couponMessage && (
//                         <p
//                           style={{
//                             marginTop: 8,
//                             fontSize: 13,
//                             color: appliedCoupon ? "#166534" : "#b91c1c",
//                           }}
//                         >
//                           {couponMessage}
//                         </p>
//                       )}
//                     </div>
//                   </div>

//                   <div
//                     style={{
//                       marginTop: 28,
//                       border: "1px solid #f0e5d6",
//                       borderRadius: 10,
//                       background: "#fffaf5",
//                       padding: 16,
//                     }}
//                   >
//                     <strong style={{ color: "#451a03" }}>Payment</strong>
//                     <p
//                       style={{
//                         margin: "7px 0 0",
//                         color: "#78716c",
//                         fontSize: 13,
//                       }}
//                     >
//                       {settings.enableCashfreePayments
//                         ? "You will be redirected to Cashfree to complete secure online payment. Order status is confirmed only after server-side payment verification."
//                         : "Cashfree payments are currently disabled in store settings."}
//                     </p>
//                   </div>

//                   {error && (
//                     <div
//                       style={{
//                         marginTop: 16,
//                         borderRadius: 10,
//                         background: "#fef2f2",
//                         color: "#b91c1c",
//                         padding: "12px 14px",
//                         fontSize: 14,
//                       }}
//                     >
//                       {error}
//                     </div>
//                   )}

//                   <button
//                     className="btn-primary"
//                     type="submit"
//                     disabled={submitting || !canCheckout}
//                     style={{
//                       marginTop: 25,
//                       width: "100%",
//                       background: canCheckout ? "#d97706" : "#a8a29e",
//                       minHeight: 54,
//                       cursor: canCheckout ? "pointer" : "not-allowed",
//                     }}
//                   >
//                     {submitting
//                       ? "Creating order & opening payment…"
//                       : !settings.acceptNewOrders
//                         ? "Ordering paused"
//                         : !settings.enableCashfreePayments
//                           ? "Payments disabled"
//                           : `Continue to Payment · ${formatMoney(total)}`}
//                   </button>
//                 </form>
//               </div>

//               <aside
//                 style={{
//                   border: "1px solid #f0e5d6",
//                   borderRadius: 14,
//                   background: "#fffaf5",
//                   padding: 25,
//                   position: "sticky",
//                   top: 100,
//                 }}
//               >
//                 <h2 style={{ color: "#451a03", marginTop: 0 }}>
//                   Order Summary
//                 </h2>

//                 <div style={{ display: "grid", gap: 14 }}>
//                   {items.map((item) => (
//                     <div
//                       key={`${item.productId}-${item.variantId}`}
//                       style={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                         gap: 15,
//                       }}
//                     >
//                       <div>
//                         <strong style={{ color: "#451a03", fontSize: 13 }}>
//                           {item.productName}
//                         </strong>
//                         <div style={{ color: "#78716c", fontSize: 12 }}>
//                           {item.variantLabel} × {item.quantity}
//                         </div>
//                       </div>
//                       <strong>
//                         {formatMoney(item.price * item.quantity)}
//                       </strong>
//                     </div>
//                   ))}

//                   <div
//                     style={{
//                       borderTop: "1px solid #eadbca",
//                       paddingTop: 15,
//                       display: "grid",
//                       gap: 10,
//                     }}
//                   >
//                     <div
//                       style={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                       }}
//                     >
//                       <span>Subtotal</span>
//                       <strong>{formatMoney(subtotal)}</strong>
//                     </div>

//                     {discount > 0 && (
//                       <div
//                         style={{
//                           display: "flex",
//                           justifyContent: "space-between",
//                           color: "#166534",
//                         }}
//                       >
//                         <span>
//                           Discount
//                           {appliedCoupon?.code
//                             ? ` (${appliedCoupon.code})`
//                             : ""}
//                         </span>
//                         <strong>-{formatMoney(discount)}</strong>
//                       </div>
//                     )}

//                     <div
//                       style={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                       }}
//                     >
//                       <span>Delivery</span>
//                       <strong>
//                         {deliveryFee === 0
//                           ? "FREE"
//                           : formatMoney(deliveryFee)}
//                       </strong>
//                     </div>

//                     <div
//                       style={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                         fontSize: 19,
//                         color: "#451a03",
//                       }}
//                     >
//                       <strong>Total payable</strong>
//                       <strong>{formatMoney(total)}</strong>
//                     </div>
//                   </div>
//                 </div>
//               </aside>
//             </div>
//           </div>
//         </section>
//       </main>
//     </>
//   );
// }

// "use client";

// import Link from "next/link";
// import {
//   FormEvent,
//   useEffect,
//   useMemo,
//   useState,
// } from "react";
// import { useSearchParams } from "next/navigation";

// type CartItem = {
//   productId: string;
//   variantId: string;
//   productName: string;
//   variantLabel: string;
//   price: number;
//   quantity: number;
//   image?: string;
// };

// type AppliedCoupon = {
//   couponId: string;
//   code: string;
//   type: "PERCENTAGE" | "FIXED";
//   value: number;
//   maximumDiscount?: number | null;
// };

// type CheckoutDraft = {
//   name: string;
//   phone: string;
//   email: string;
//   address: string;
//   city: string;
//   state: string;
//   pinCode: string;
// };

// type FoodSettingsPublic = {
//   acceptNewOrders: boolean;
//   enableCashfreePayments: boolean;
//   storeName: string;
// };

// type ApiSuccess<T> = {
//   success: true;
//   data: T;
//   message?: string;
// };

// type ApiError = {
//   success: false;
//   error: {
//     code: string;
//     message: string;
//   };
// };

// type ApiResponse<T> = ApiSuccess<T> | ApiError;

// type CreateOrderData = {
//   orderId: string;
//   order?: {
//     orderId: string;
//     total: number;
//     subtotal?: number;
//     discount?: number;
//     status: string;
//     paymentStatus: string;
//   };
// };

// type CashfreeCreateData = {
//   orderId: string;
//   paymentReferenceId?: string;
//   cashfreeOrderId?: string;
//   paymentSessionId?: string;
//   orderStatus?: string;
// };

// const CART_STORAGE_KEY = "sreshta-food-cart";
// const CHECKOUT_DRAFT_KEY = "sreshta-food-checkout-draft";

// const EMPTY_DRAFT: CheckoutDraft = {
//   name: "",
//   phone: "",
//   email: "",
//   address: "",
//   city: "",
//   state: "",
//   pinCode: "",
// };

// const DEFAULT_SETTINGS: FoodSettingsPublic = {
//   acceptNewOrders: true,
//   enableCashfreePayments: false,
//   storeName: "Sreshta Foods",
// };

// async function loadFoodSettings(): Promise<FoodSettingsPublic> {
//   try {
//     const res = await fetch("/api/food/settings", {
//       method: "GET",
//       headers: { Accept: "application/json" },
//       cache: "no-store",
//     });
//     const json = await res.json();
//     if (!res.ok || !json.success) return DEFAULT_SETTINGS;
//     return { ...DEFAULT_SETTINGS, ...json.data };
//   } catch {
//     return DEFAULT_SETTINGS;
//   }
// }

// declare global {
//   interface Window {
//     Cashfree?: (options: { mode: "sandbox" | "production" }) => {
//       checkout: (options: {
//         paymentSessionId: string;
//         redirectTarget?: "_self" | "_blank";
//       }) => Promise<unknown>;
//     };
//   }
// }

// function loadCashfreeScript(): Promise<void> {
//   return new Promise((resolve, reject) => {
//     if (typeof window === "undefined") {
//       reject(new Error("Cashfree can only load in the browser."));
//       return;
//     }

//     if (window.Cashfree) {
//       resolve();
//       return;
//     }

//     const existing = document.querySelector<HTMLScriptElement>(
//       'script[data-cashfree="sdk"]',
//     );

//     if (existing) {
//       existing.addEventListener("load", () => resolve(), { once: true });
//       existing.addEventListener(
//         "error",
//         () => reject(new Error("Failed to load Cashfree SDK.")),
//         { once: true },
//       );
//       return;
//     }

//     const script = document.createElement("script");
//     script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
//     script.async = true;
//     script.dataset.cashfree = "sdk";
//     script.onload = () => resolve();
//     script.onerror = () =>
//       reject(new Error("Failed to load Cashfree SDK."));
//     document.body.appendChild(script);
//   });
// }

// function getCashfreeMode(): "sandbox" | "production" {
//   const env =
//     process.env.NEXT_PUBLIC_CASHFREE_ENVIRONMENT ||
//     process.env.NEXT_PUBLIC_CASHFREE_MODE;

//   return env === "production" ? "production" : "sandbox";
// }

// function formatMoney(value: number): string {
//   return `₹${Number(value || 0).toFixed(2)}`;
// }

// export default function CheckoutPage() {
//   const searchParams = useSearchParams();

//   const [items, setItems] = useState<CartItem[]>([]);
//   const [hydrated, setHydrated] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const [draft, setDraft] = useState<CheckoutDraft>(EMPTY_DRAFT);
//   const [settings, setSettings] =
//     useState<FoodSettingsPublic>(DEFAULT_SETTINGS);

//   const [couponInput, setCouponInput] = useState("");
//   const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(
//     null,
//   );
//   const [couponMessage, setCouponMessage] = useState<string | null>(null);
//   const [couponLoading, setCouponLoading] = useState(false);

//   const canCheckout =
//     settings.acceptNewOrders && settings.enableCashfreePayments;

//   function updateDraft<K extends keyof CheckoutDraft>(
//     key: K,
//     value: CheckoutDraft[K],
//   ) {
//     setDraft((prev) => {
//       const next = { ...prev, [key]: value };
//       try {
//         localStorage.setItem(CHECKOUT_DRAFT_KEY, JSON.stringify(next));
//       } catch {
//         // ignore
//       }
//       return next;
//     });
//   }

//   useEffect(() => {
//     let cancelled = false;

//     (async () => {
//       const s = await loadFoodSettings();
//       if (!cancelled) setSettings(s);
//     })();

//     return () => {
//       cancelled = true;
//     };
//   }, []);

//   useEffect(() => {
//     try {
//       const raw = localStorage.getItem(CART_STORAGE_KEY);

//       if (!raw) {
//         setItems([]);
//       } else {
//         const parsed = JSON.parse(raw) as unknown;
//         let list: unknown[] = [];

//         if (Array.isArray(parsed)) {
//           list = parsed;
//         } else if (
//           parsed &&
//           typeof parsed === "object" &&
//           Array.isArray((parsed as { items?: unknown }).items)
//         ) {
//           list = (parsed as { items: unknown[] }).items;
//         }

//         const normalized = list
//           .map((row) => {
//             const item = row as Record<string, unknown>;
//             const productId = String(item.productId || "").trim();
//             const variantId = String(item.variantId || "").trim();

//             if (!productId || !variantId) return null;

//             return {
//               productId,
//               variantId,
//               productName: String(
//                 item.productName || item.name || "Product",
//               ),
//               variantLabel: String(
//                 item.variantLabel ||
//                   item.variantName ||
//                   item.label ||
//                   "Variant",
//               ),
//               price: Number(item.price || 0),
//               quantity: Math.max(
//                 1,
//                 Math.floor(Number(item.quantity || 1)),
//               ),
//               image: item.image
//                 ? String(item.image)
//                 : item.imageUrl
//                   ? String(item.imageUrl)
//                   : undefined,
//             } satisfies CartItem;
//           })
//           .filter(Boolean) as CartItem[];

//         setItems(normalized);
//       }

//       const draftRaw = localStorage.getItem(CHECKOUT_DRAFT_KEY);
//       if (draftRaw) {
//         const parsed = JSON.parse(draftRaw) as Partial<CheckoutDraft>;
//         setDraft({
//           name: String(parsed.name || ""),
//           phone: String(parsed.phone || ""),
//           email: String(parsed.email || ""),
//           address: String(parsed.address || ""),
//           city: String(parsed.city || ""),
//           state: String(parsed.state || ""),
//           pinCode: String(parsed.pinCode || ""),
//         });
//       }
//     } catch {
//       setItems([]);
//     } finally {
//       setHydrated(true);
//     }
//   }, []);

//   useEffect(() => {
//     const payment = searchParams.get("payment");
//     if (payment === "incomplete") {
//       setError(
//         "Payment was not completed or was cancelled. Your details are still here — you can try again.",
//       );
//     }
//   }, [searchParams]);

//   // Auto-dismiss floating toast after 8s
//   useEffect(() => {
//     if (!error) return;
//     const t = window.setTimeout(() => setError(null), 8000);
//     return () => window.clearTimeout(t);
//   }, [error]);

//   // const subtotal = useMemo(
//   //   () =>
//   //     items.reduce(
//   //       (sum, item) => sum + item.price * item.quantity,
//   //       0,
//   //     ),
//   //   [items],
//   // );

//   // const isTest1 = appliedCoupon?.code === "TEST1";
//   // const deliveryFee = subtotal > 999 || subtotal === 0 ? 0 : 60;

//   // const discount = useMemo(() => {
//   //   if (!appliedCoupon || subtotal <= 0) return 0;

//   //   let amount = 0;
//   //   if (appliedCoupon.type === "PERCENTAGE") {
//   //     amount = (subtotal * appliedCoupon.value) / 100;
//   //     if (
//   //       appliedCoupon.maximumDiscount != null &&
//   //       Number.isFinite(appliedCoupon.maximumDiscount)
//   //     ) {
//   //       amount = Math.min(amount, Number(appliedCoupon.maximumDiscount));
//   //     }
//   //   } else {
//   //     amount = appliedCoupon.value;
//   //   }

//   //   return Math.min(Math.max(0, amount), subtotal);
//   // }, [appliedCoupon, subtotal]);

//   // // const total = Math.max(0, subtotal - discount + deliveryFee);
//   // const total = isTest1
//   // ? 1
//   // : Math.max(0, subtotal - discount + deliveryFee);

//     const subtotal = useMemo(
//     () =>
//       items.reduce(
//         (sum, item) => sum + item.price * item.quantity,
//         0,
//       ),
//     [items],
//   );

//   const isTest1 =
//     String(appliedCoupon?.code || "").toUpperCase() === "TEST1";

//   // Normal delivery rule
//   const baseDeliveryFee =
//     subtotal > 999 || subtotal === 0 ? 0 : 60;

//   // Product discount (never exceeds subtotal for normal coupons)
//   const productDiscount = useMemo(() => {
//     if (!appliedCoupon || subtotal <= 0) return 0;

//     // TEST1: full product amount off (delivery shown separately)
//     if (String(appliedCoupon.code).toUpperCase() === "TEST1") {
//       return subtotal;
//     }

//     let amount = 0;
//     if (appliedCoupon.type === "PERCENTAGE") {
//       amount = (subtotal * appliedCoupon.value) / 100;
//       if (
//         appliedCoupon.maximumDiscount != null &&
//         Number.isFinite(appliedCoupon.maximumDiscount)
//       ) {
//         amount = Math.min(amount, Number(appliedCoupon.maximumDiscount));
//       }
//     } else {
//       amount = appliedCoupon.value;
//     }

//     return Math.min(Math.max(0, amount), subtotal);
//   }, [appliedCoupon, subtotal]);

//   // TEST1 also waives delivery (show as -₹60)
//   const deliveryDiscount = isTest1 ? baseDeliveryFee : 0;

//   // What customer is charged for delivery after waiver
//   const deliveryFee = Math.max(0, baseDeliveryFee - deliveryDiscount);

//   // Combined discount for messages / last-order snapshot
//   const discount = productDiscount + deliveryDiscount;

//   // TEST1 always pays ₹1; others normal math
//   const total = isTest1
//     ? 1
//     : Math.max(0, subtotal - productDiscount + deliveryFee);

//   async function applyCoupon() {
//     const code = couponInput.trim().toUpperCase();
//     if (!code) {
//       setCouponMessage("Enter a coupon code (optional).");
//       return;
//     }

//     // ── TEST coupon: pay ₹1 total ──
//     if (code === "TEST1") {
//       setAppliedCoupon({
//         couponId: "TEST1",
//         code: "TEST1",
//         type: "FIXED",
//         value: 999999,
//         maximumDiscount: null,
//       });
//       setCouponMessage("Coupon TEST1 applied — products + delivery discounted. Payable ₹1.",);
//       setCouponLoading(false);
//       return;
//     }

//     try {
//       setCouponLoading(true);
//       setCouponMessage(null);

//       const res = await fetch(
//         `/api/food/coupons/validate?code=${encodeURIComponent(code)}&subtotal=${subtotal}`,
//         { cache: "no-store" },
//       );
//       const json = await res.json();

//       if (!res.ok || !json.success) {
//         setAppliedCoupon(null);
//         throw new Error(
//           json.error?.message || "Invalid or expired coupon.",
//         );
//       }

//       const c = json.data?.coupon || json.coupon;
//       setAppliedCoupon({
//         couponId: String(c.couponId || c.id),
//         code: String(c.code || code).toUpperCase(),
//         type: c.type === "FIXED" ? "FIXED" : "PERCENTAGE",
//         value: Number(c.value),
//         maximumDiscount: c.maximumDiscount ?? null,
//       });
//       setCouponMessage(
//         `Coupon ${String(c.code || code).toUpperCase()} applied.`,
//       );
//     } catch (e) {
//       setAppliedCoupon(null);
//       setCouponMessage(
//         e instanceof Error ? e.message : "Could not apply coupon.",
//       );
//     } finally {
//       setCouponLoading(false);
//     }
//   }

//   function removeCoupon() {
//     setAppliedCoupon(null);
//     setCouponInput("");
//     setCouponMessage(null);
//   }

//   async function handleSubmit(event: FormEvent<HTMLFormElement>) {
//     event.preventDefault();

//     if (items.length === 0 || submitting) return;

//     setSubmitting(true);
//     setError(null);

//     try {
//       const liveSettings = await loadFoodSettings();
//       setSettings(liveSettings);

//       if (!liveSettings.acceptNewOrders) {
//         throw new Error(
//           "We are not accepting new orders at the moment.",
//         );
//       }

//       if (!liveSettings.enableCashfreePayments) {
//         throw new Error(
//           "Online payment is temporarily disabled. Please contact support.",
//         );
//       }

//       const name = draft.name.trim();
//       const phone = draft.phone.trim();
//       const email = draft.email.trim();
//       const addressLine1 = draft.address.trim();
//       const city = draft.city.trim();
//       const state = draft.state.trim();
//       const postalCode = draft.pinCode.trim();

//       if (
//         !name ||
//         !phone ||
//         !email ||
//         !addressLine1 ||
//         !city ||
//         !state ||
//         !postalCode
//       ) {
//         throw new Error("Please fill in all required delivery fields.");
//       }

//       try {
//         localStorage.setItem(
//           CHECKOUT_DRAFT_KEY,
//           JSON.stringify({
//             name,
//             phone,
//             email,
//             address: addressLine1,
//             city,
//             state,
//             pinCode: postalCode,
//           } satisfies CheckoutDraft),
//         );
//       } catch {
//         // ignore
//       }

//       const orderRes = await fetch("/api/food/orders", {
//         method: "POST",
//         headers: {
//           Accept: "application/json",
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           customer: {
//             name,
//             phone,
//             email,
//             addressLine1,
//             city,
//             state,
//             postalCode,
//             country: "India",
//           },
//           items: items.map((item) => ({
//             productId: item.productId,
//             variantId: item.variantId,
//             quantity: item.quantity,
//           })),
//           deliveryFee,
//           couponId: appliedCoupon?.couponId || null,
//         }),
//       });

//       const orderJson =
//         (await orderRes.json()) as ApiResponse<CreateOrderData>;

//       if (!orderJson.success) {
//         throw new Error(
//           orderJson.error?.message || "Failed to create order.",
//         );
//       }

//       const orderId = String(orderJson.data.orderId || "").trim();

//       if (!orderId) {
//         throw new Error("Order was created without an orderId.");
//       }

//       localStorage.setItem(
//         "sreshta-food-last-order",
//         JSON.stringify({
//           orderId,
//           status: "PENDING_PAYMENT",
//           paymentStatus: "PENDING",
//           total: orderJson.data.order?.total ?? total,
//           discount: orderJson.data.order?.discount ?? discount,
//           createdAt: new Date().toISOString(),
//         }),
//       );

//       const paymentRes = await fetch(
//         "/api/payments/cashfree/create-order",
//         {
//           method: "POST",
//           headers: {
//             Accept: "application/json",
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ orderId }),
//         },
//       );

//       const paymentJson =
//         (await paymentRes.json()) as ApiResponse<CashfreeCreateData>;

//       if (!paymentJson.success) {
//         throw new Error(
//           paymentJson.error?.message ||
//             "Could not start payment. Please try again.",
//         );
//       }

//       const paymentSessionId =
//         paymentJson.data.paymentSessionId?.trim() || "";

//       if (!paymentSessionId) {
//         throw new Error(
//           "Payment session was not created. Check Cashfree sandbox keys.",
//         );
//       }

//       await loadCashfreeScript();

//       if (!window.Cashfree) {
//         throw new Error("Cashfree SDK is unavailable.");
//       }

//       const cashfree = window.Cashfree({
//         mode: getCashfreeMode(),
//       });

//       await cashfree.checkout({
//         paymentSessionId,
//         redirectTarget: "_self",
//       });
//     } catch (e) {
//       setError(
//         e instanceof Error
//           ? e.message
//           : "Unable to complete checkout. Please try again.",
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   if (!hydrated) {
//     return (
//       <main className="section">
//         <div
//           className="container-site"
//           style={{ textAlign: "center", padding: "80px 0" }}
//         >
//           <h1 style={{ color: "#451a03" }}>Loading checkout…</h1>
//         </div>
//       </main>
//     );
//   }

//   if (items.length === 0) {
//     return (
//       <>
//         <header className="site-header">
//           <div className="container-site header-inner">
//             <Link href="/food">
//               <img
//                 src="/images/sreshta-food-logo.png"
//                 alt="Sreshta Foods"
//                 className="header-logo"
//               />
//             </Link>
//             <Link
//               href="/food/products"
//               className="btn-primary"
//               style={{ background: "#d97706" }}
//             >
//               Shop Products
//             </Link>
//           </div>
//         </header>

//         <main className="section">
//           <div
//             className="container-site"
//             style={{
//               textAlign: "center",
//               paddingTop: 80,
//               paddingBottom: 80,
//             }}
//           >
//             <h1 style={{ color: "#451a03" }}>Your cart is empty</h1>
//             <p>Add products before continuing to checkout.</p>
//             <Link
//               href="/food/products"
//               className="btn-primary"
//               style={{ marginTop: 20, background: "#d97706" }}
//             >
//               Browse Products
//             </Link>
//           </div>
//         </main>
//       </>
//     );
//   }

//   return (
//     <>
//       {/* Top-right floating toast */}
//       {error && (
//         <div
//           role="alert"
//           style={{
//             position: "fixed",
//             top: 20,
//             right: 20,
//             zIndex: 9999,
//             maxWidth: "min(420px, calc(100vw - 32px))",
//             borderRadius: 12,
//             border: "1px solid #fecaca",
//             background: "#fff",
//             boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
//             padding: "14px 16px",
//             display: "flex",
//             alignItems: "flex-start",
//             gap: 12,
//           }}
//         >
//           <div
//             style={{
//               flexShrink: 0,
//               width: 28,
//               height: 28,
//               borderRadius: "50%",
//               background: "#fef2f2",
//               color: "#b91c1c",
//               display: "grid",
//               placeItems: "center",
//               fontWeight: 800,
//               fontSize: 14,
//             }}
//           >
//             !
//           </div>
//           <div style={{ flex: 1, minWidth: 0 }}>
//             <strong
//               style={{
//                 display: "block",
//                 color: "#991b1b",
//                 fontSize: 13,
//                 marginBottom: 4,
//               }}
//             >
//               Payment notice
//             </strong>
//             <p
//               style={{
//                 margin: 0,
//                 color: "#7f1d1d",
//                 fontSize: 13,
//                 lineHeight: 1.45,
//               }}
//             >
//               {error}
//             </p>
//           </div>
//           <button
//             type="button"
//             onClick={() => setError(null)}
//             aria-label="Dismiss"
//             style={{
//               flexShrink: 0,
//               border: "none",
//               background: "transparent",
//               color: "#a8a29e",
//               cursor: "pointer",
//               fontSize: 18,
//               lineHeight: 1,
//               padding: 0,
//             }}
//           >
//             ×
//           </button>
//         </div>
//       )}

//       <header className="site-header">
//         <div className="container-site header-inner">
//           <Link href="/food">
//             <img
//               src="/images/sreshta-food-logo.png"
//               alt="Sreshta Foods"
//               className="header-logo"
//             />
//           </Link>
//           <Link href="/food/cart" className="btn-secondary">
//             ← Back to Cart
//           </Link>
//         </div>
//       </header>

//       <main>
//         <section style={{ background: "#fff7ed", padding: "65px 0" }}>
//           <div className="container-site">
//             <span className="section-label" style={{ color: "#b45309" }}>
//               Checkout
//             </span>
//             <h1 className="section-title" style={{ color: "#451a03" }}>
//               Complete Your Order
//             </h1>
//           </div>
//         </section>

//         <section className="section">
//           <div className="container-site">
//             {!settings.acceptNewOrders && (
//               <div
//                 style={{
//                   marginBottom: 20,
//                   borderRadius: 12,
//                   border: "1px solid #fde68a",
//                   background: "#fffbeb",
//                   color: "#92400e",
//                   padding: "14px 16px",
//                   fontSize: 14,
//                   fontWeight: 600,
//                 }}
//               >
//                 We are not accepting new orders right now. Please try again
//                 later.
//               </div>
//             )}

//             {settings.acceptNewOrders && !settings.enableCashfreePayments && (
//               <div
//                 style={{
//                   marginBottom: 20,
//                   borderRadius: 12,
//                   border: "1px solid #fecaca",
//                   background: "#fef2f2",
//                   color: "#991b1b",
//                   padding: "14px 16px",
//                   fontSize: 14,
//                   fontWeight: 600,
//                 }}
//               >
//                 Online payment is temporarily disabled. Please contact
//                 support.
//               </div>
//             )}

//             <div
//               style={{
//                 display: "grid",
//                 gridTemplateColumns: "1.4fr .8fr",
//                 gap: 30,
//                 alignItems: "start",
//               }}
//             >
//               <div className="form-shell">
//                 <span className="section-label" style={{ color: "#b45309" }}>
//                   Customer Details
//                 </span>
//                 <h2
//                   className="section-title"
//                   style={{ color: "#451a03", fontSize: "2rem" }}
//                 >
//                   Delivery Information
//                 </h2>

//                 <form onSubmit={handleSubmit}>
//                   <div className="form-grid" style={{ marginTop: 28 }}>
//                     <div className="form-group">
//                       <label className="form-label" htmlFor="name">
//                         Full Name *
//                       </label>
//                       <input
//                         id="name"
//                         name="name"
//                         className="input"
//                         placeholder="Your full name"
//                         required
//                         value={draft.name}
//                         onChange={(e) => updateDraft("name", e.target.value)}
//                         disabled={!canCheckout}
//                       />
//                     </div>

//                     <div className="form-group">
//                       <label className="form-label" htmlFor="phone">
//                         Phone *
//                       </label>
//                       <input
//                         id="phone"
//                         name="phone"
//                         className="input"
//                         type="tel"
//                         placeholder="10-digit phone number"
//                         required
//                         value={draft.phone}
//                         onChange={(e) => updateDraft("phone", e.target.value)}
//                         disabled={!canCheckout}
//                       />
//                     </div>

//                     <div className="form-group full">
//                       <label className="form-label" htmlFor="email">
//                         Email *
//                       </label>
//                       <input
//                         id="email"
//                         name="email"
//                         className="input"
//                         type="email"
//                         placeholder="you@example.com"
//                         required
//                         value={draft.email}
//                         onChange={(e) => updateDraft("email", e.target.value)}
//                         disabled={!canCheckout}
//                       />
//                     </div>

//                     <div className="form-group full">
//                       <label className="form-label" htmlFor="address">
//                         Delivery Address *
//                       </label>
//                       <textarea
//                         id="address"
//                         name="address"
//                         className="textarea"
//                         placeholder="House / flat, street, locality"
//                         required
//                         value={draft.address}
//                         onChange={(e) =>
//                           updateDraft("address", e.target.value)
//                         }
//                         disabled={!canCheckout}
//                       />
//                     </div>

//                     <div className="form-group">
//                       <label className="form-label" htmlFor="city">
//                         City *
//                       </label>
//                       <input
//                         id="city"
//                         name="city"
//                         className="input"
//                         placeholder="City"
//                         required
//                         value={draft.city}
//                         onChange={(e) => updateDraft("city", e.target.value)}
//                         disabled={!canCheckout}
//                       />
//                     </div>

//                     <div className="form-group">
//                       <label className="form-label" htmlFor="state">
//                         State *
//                       </label>
//                       <input
//                         id="state"
//                         name="state"
//                         className="input"
//                         placeholder="State"
//                         required
//                         value={draft.state}
//                         onChange={(e) => updateDraft("state", e.target.value)}
//                         disabled={!canCheckout}
//                       />
//                     </div>

//                     <div className="form-group">
//                       <label className="form-label" htmlFor="pinCode">
//                         PIN Code *
//                       </label>
//                       <input
//                         id="pinCode"
//                         name="pinCode"
//                         className="input"
//                         placeholder="PIN code"
//                         required
//                         value={draft.pinCode}
//                         onChange={(e) =>
//                           updateDraft("pinCode", e.target.value)
//                         }
//                         disabled={!canCheckout}
//                       />
//                     </div>

//                     <div className="form-group full">
//                       <label className="form-label" htmlFor="couponInput">
//                         Coupon code{" "}
//                         <span style={{ fontWeight: 400, opacity: 0.7 }}>
//                           (optional)
//                         </span>
//                       </label>
//                       <div
//                         style={{
//                           display: "flex",
//                           gap: 8,
//                           flexWrap: "wrap",
//                         }}
//                       >
//                         <input
//                           id="couponInput"
//                           className="input"
//                           style={{ flex: 1, minWidth: 160 }}
//                           placeholder="e.g. WELCOME10"
//                           value={couponInput}
//                           onChange={(e) =>
//                             setCouponInput(e.target.value.toUpperCase())
//                           }
//                           disabled={!!appliedCoupon || !canCheckout}
//                         />
//                         {!appliedCoupon ? (
//                           <button
//                             type="button"
//                             className="btn-primary"
//                             style={{ background: "#d97706" }}
//                             onClick={applyCoupon}
//                             disabled={
//                               couponLoading || subtotal <= 0 || !canCheckout
//                             }
//                           >
//                             {couponLoading ? "Checking…" : "Apply"}
//                           </button>
//                         ) : (
//                           <button
//                             type="button"
//                             className="btn-secondary"
//                             onClick={removeCoupon}
//                             disabled={!canCheckout}
//                           >
//                             Remove
//                           </button>
//                         )}
//                       </div>
//                       {couponMessage && (
//                         <p
//                           style={{
//                             marginTop: 8,
//                             fontSize: 13,
//                             color: appliedCoupon ? "#166534" : "#b91c1c",
//                           }}
//                         >
//                           {couponMessage}
//                         </p>
//                       )}
//                     </div>
//                   </div>

//                   <div
//                     style={{
//                       marginTop: 28,
//                       border: "1px solid #f0e5d6",
//                       borderRadius: 10,
//                       background: "#fffaf5",
//                       padding: 16,
//                     }}
//                   >
//                     <strong style={{ color: "#451a03" }}>Payment</strong>
//                     <p
//                       style={{
//                         margin: "7px 0 0",
//                         color: "#78716c",
//                         fontSize: 13,
//                       }}
//                     >
//                       {settings.enableCashfreePayments
//                         ? "You will be redirected to Cashfree to complete secure online payment. Order status is confirmed only after server-side payment verification."
//                         : "Cashfree payments are currently disabled in store settings."}
//                     </p>
//                   </div>

//                   <button
//                     className="btn-primary"
//                     type="submit"
//                     disabled={submitting || !canCheckout}
//                     style={{
//                       marginTop: 25,
//                       width: "100%",
//                       background: canCheckout ? "#d97706" : "#a8a29e",
//                       minHeight: 54,
//                       cursor: canCheckout ? "pointer" : "not-allowed",
//                     }}
//                   >
//                     {submitting
//                       ? "Creating order & opening payment…"
//                       : !settings.acceptNewOrders
//                         ? "Ordering paused"
//                         : !settings.enableCashfreePayments
//                           ? "Payments disabled"
//                           : `Continue to Payment · ${formatMoney(total)}`}
//                   </button>
//                 </form>
//               </div>

//               <aside
//                 style={{
//                   border: "1px solid #f0e5d6",
//                   borderRadius: 14,
//                   background: "#fffaf5",
//                   padding: 25,
//                   position: "sticky",
//                   top: 100,
//                 }}
//               >
//                 <h2 style={{ color: "#451a03", marginTop: 0 }}>
//                   Order Summary
//                 </h2>

//                 <div style={{ display: "grid", gap: 14 }}>
//                   {items.map((item) => (
//                     <div
//                       key={`${item.productId}-${item.variantId}`}
//                       style={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                         gap: 15,
//                       }}
//                     >
//                       <div>
//                         <strong style={{ color: "#451a03", fontSize: 13 }}>
//                           {item.productName}
//                         </strong>
//                         <div style={{ color: "#78716c", fontSize: 12 }}>
//                           {item.variantLabel} × {item.quantity}
//                         </div>
//                       </div>
//                       <strong>
//                         {formatMoney(item.price * item.quantity)}
//                       </strong>
//                     </div>
//                   ))}

//                   <div
//                     style={{
//                       borderTop: "1px solid #eadbca",
//                       paddingTop: 15,
//                       display: "grid",
//                       gap: 10,
//                     }}
//                   >
//                     <div
//                       style={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                       }}
//                     >
//                       <span>Subtotal</span>
//                       <strong>{formatMoney(subtotal)}</strong>
//                     </div>

//                     {discount > 0 && (
//                       <div
//                         style={{
//                           display: "flex",
//                           justifyContent: "space-between",
//                           color: "#166534",
//                         }}
//                       >
//                         <span>
//                           Discount
//                           {appliedCoupon?.code
//                             ? ` (${appliedCoupon.code})`
//                             : ""}
//                         </span>
//                         <strong>-{formatMoney(discount)}</strong>
//                       </div>
//                     )}

//                     <div
//                       style={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                       }}
//                     >
//                       <span>Delivery</span>
//                       <strong>
//                         {deliveryFee === 0
//                           ? "FREE"
//                           : formatMoney(deliveryFee)}
//                       </strong>
//                     </div>

//                     <div
//                       style={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                         fontSize: 19,
//                         color: "#451a03",
//                       }}
//                     >
//                       <strong>Total payable</strong>
//                       <strong>{formatMoney(total)}</strong>
//                     </div>
//                   </div>
//                 </div>
//               </aside>
//             </div>
//           </div>
//         </section>
//       </main>
//     </>
//   );
// }

"use client";

import Link from "next/link";
import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useSearchParams } from "next/navigation";

type CartItem = {
  productId: string;
  variantId: string;
  productName: string;
  variantLabel: string;
  price: number;
  quantity: number;
  image?: string;
};

type AppliedCoupon = {
  couponId: string;
  code: string;
  type: "PERCENTAGE" | "FIXED";
  value: number;
  maximumDiscount?: number | null;
};

type CheckoutDraft = {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
};

type FoodSettingsPublic = {
  acceptNewOrders: boolean;
  enableCashfreePayments: boolean;
  storeName: string;
};

type ApiSuccess<T> = {
  success: true;
  data: T;
  message?: string;
};

type ApiError = {
  success: false;
  error: {
    code: string;
    message: string;
  };
};

type ApiResponse<T> = ApiSuccess<T> | ApiError;

type CreateOrderData = {
  orderId: string;
  order?: {
    orderId: string;
    total: number;
    subtotal?: number;
    discount?: number;
    status: string;
    paymentStatus: string;
  };
};

type CashfreeCreateData = {
  orderId: string;
  paymentReferenceId?: string;
  cashfreeOrderId?: string;
  paymentSessionId?: string;
  orderStatus?: string;
};

const CART_STORAGE_KEY = "sreshta-food-cart";
const CHECKOUT_DRAFT_KEY = "sreshta-food-checkout-draft";

const EMPTY_DRAFT: CheckoutDraft = {
  name: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  state: "",
  pinCode: "",
};

const DEFAULT_SETTINGS: FoodSettingsPublic = {
  acceptNewOrders: true,
  enableCashfreePayments: false,
  storeName: "Sreshta Foods",
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

declare global {
  interface Window {
    Cashfree?: (options: { mode: "sandbox" | "production" }) => {
      checkout: (options: {
        paymentSessionId: string;
        redirectTarget?: "_self" | "_blank";
      }) => Promise<unknown>;
    };
  }
}

function loadCashfreeScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Cashfree can only load in the browser."));
      return;
    }

    if (window.Cashfree) {
      resolve();
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-cashfree="sdk"]',
    );

    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("Failed to load Cashfree SDK.")),
        { once: true },
      );
      return;
    }

    const script = document.createElement("script");
    script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
    script.async = true;
    script.dataset.cashfree = "sdk";
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("Failed to load Cashfree SDK."));
    document.body.appendChild(script);
  });
}

function getCashfreeMode(): "sandbox" | "production" {
  const env =
    process.env.NEXT_PUBLIC_CASHFREE_ENVIRONMENT ||
    process.env.NEXT_PUBLIC_CASHFREE_MODE;

  return env === "production" ? "production" : "sandbox";
}

function formatMoney(value: number): string {
  return `₹${Number(value || 0).toFixed(2)}`;
}

export default function CheckoutPage() {
  const searchParams = useSearchParams();

  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [draft, setDraft] = useState<CheckoutDraft>(EMPTY_DRAFT);
  const [settings, setSettings] =
    useState<FoodSettingsPublic>(DEFAULT_SETTINGS);

  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(
    null,
  );
  const [couponMessage, setCouponMessage] = useState<string | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);

  const canCheckout =
    settings.acceptNewOrders && settings.enableCashfreePayments;

  function updateDraft<K extends keyof CheckoutDraft>(
    key: K,
    value: CheckoutDraft[K],
  ) {
    setDraft((prev) => {
      const next = { ...prev, [key]: value };
      try {
        localStorage.setItem(CHECKOUT_DRAFT_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }

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
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);

      if (!raw) {
        setItems([]);
      } else {
        const parsed = JSON.parse(raw) as unknown;
        let list: unknown[] = [];

        if (Array.isArray(parsed)) {
          list = parsed;
        } else if (
          parsed &&
          typeof parsed === "object" &&
          Array.isArray((parsed as { items?: unknown }).items)
        ) {
          list = (parsed as { items: unknown[] }).items;
        }

        const normalized = list
          .map((row) => {
            const item = row as Record<string, unknown>;
            const productId = String(item.productId || "").trim();
            const variantId = String(item.variantId || "").trim();

            if (!productId || !variantId) return null;

            return {
              productId,
              variantId,
              productName: String(
                item.productName || item.name || "Product",
              ),
              variantLabel: String(
                item.variantLabel ||
                  item.variantName ||
                  item.label ||
                  "Variant",
              ),
              price: Number(item.price || 0),
              quantity: Math.max(
                1,
                Math.floor(Number(item.quantity || 1)),
              ),
              image: item.image
                ? String(item.image)
                : item.imageUrl
                  ? String(item.imageUrl)
                  : undefined,
            } satisfies CartItem;
          })
          .filter(Boolean) as CartItem[];

        setItems(normalized);
      }

      const draftRaw = localStorage.getItem(CHECKOUT_DRAFT_KEY);
      if (draftRaw) {
        const parsed = JSON.parse(draftRaw) as Partial<CheckoutDraft>;
        setDraft({
          name: String(parsed.name || ""),
          phone: String(parsed.phone || ""),
          email: String(parsed.email || ""),
          address: String(parsed.address || ""),
          city: String(parsed.city || ""),
          state: String(parsed.state || ""),
          pinCode: String(parsed.pinCode || ""),
        });
      }
    } catch {
      setItems([]);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    const payment = searchParams.get("payment");
    if (payment === "incomplete") {
      setError(
        "Payment was not completed or was cancelled. Your details are still here — you can try again.",
      );
    }
  }, [searchParams]);

  useEffect(() => {
    if (!error) return;
    const t = window.setTimeout(() => setError(null), 8000);
    return () => window.clearTimeout(t);
  }, [error]);

  const subtotal = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      ),
    [items],
  );

  const isTest1 =
    String(appliedCoupon?.code || "").toUpperCase() === "TEST1";

  const baseDeliveryFee =
    subtotal > 999 || subtotal === 0 ? 0 : 60;

  const productDiscount = useMemo(() => {
    if (!appliedCoupon || subtotal <= 0) return 0;

    if (String(appliedCoupon.code).toUpperCase() === "TEST1") {
      return subtotal;
    }

    let amount = 0;
    if (appliedCoupon.type === "PERCENTAGE") {
      amount = (subtotal * appliedCoupon.value) / 100;
      if (
        appliedCoupon.maximumDiscount != null &&
        Number.isFinite(appliedCoupon.maximumDiscount)
      ) {
        amount = Math.min(amount, Number(appliedCoupon.maximumDiscount));
      }
    } else {
      amount = appliedCoupon.value;
    }

    return Math.min(Math.max(0, amount), subtotal);
  }, [appliedCoupon, subtotal]);

  const deliveryDiscount = isTest1 ? baseDeliveryFee : 0;
  const deliveryFee = Math.max(0, baseDeliveryFee - deliveryDiscount);
  const discount = productDiscount + deliveryDiscount;

  const total = isTest1
    ? 1
    : Math.max(0, subtotal - productDiscount + deliveryFee);

  async function applyCoupon() {
    const code = couponInput.trim().toUpperCase();
    if (!code) {
      setCouponMessage("Enter a coupon code (optional).");
      return;
    }

    if (code === "TEST1") {
      setAppliedCoupon({
        couponId: "TEST1",
        code: "TEST1",
        type: "FIXED",
        value: 999999,
        maximumDiscount: null,
      });
      setCouponMessage(
        "Coupon TEST1 applied — products + delivery discounted. Payable ₹1.",
      );
      setCouponLoading(false);
      return;
    }

    try {
      setCouponLoading(true);
      setCouponMessage(null);

      const res = await fetch(
        `/api/food/coupons/validate?code=${encodeURIComponent(code)}&subtotal=${subtotal}`,
        { cache: "no-store" },
      );
      const json = await res.json();

      if (!res.ok || !json.success) {
        setAppliedCoupon(null);
        throw new Error(
          json.error?.message || "Invalid or expired coupon.",
        );
      }

      const c = json.data?.coupon || json.coupon;
      setAppliedCoupon({
        couponId: String(c.couponId || c.id),
        code: String(c.code || code).toUpperCase(),
        type: c.type === "FIXED" ? "FIXED" : "PERCENTAGE",
        value: Number(c.value),
        maximumDiscount: c.maximumDiscount ?? null,
      });
      setCouponMessage(
        `Coupon ${String(c.code || code).toUpperCase()} applied.`,
      );
    } catch (e) {
      setAppliedCoupon(null);
      setCouponMessage(
        e instanceof Error ? e.message : "Could not apply coupon.",
      );
    } finally {
      setCouponLoading(false);
    }
  }

  function removeCoupon() {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponMessage(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (items.length === 0 || submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      const liveSettings = await loadFoodSettings();
      setSettings(liveSettings);

      if (!liveSettings.acceptNewOrders) {
        throw new Error(
          "We are not accepting new orders at the moment.",
        );
      }

      if (!liveSettings.enableCashfreePayments) {
        throw new Error(
          "Online payment is temporarily disabled. Please contact support.",
        );
      }

      const name = draft.name.trim();
      const phone = draft.phone.trim();
      const email = draft.email.trim();
      const addressLine1 = draft.address.trim();
      const city = draft.city.trim();
      const state = draft.state.trim();
      const postalCode = draft.pinCode.trim();

      if (
        !name ||
        !phone ||
        !email ||
        !addressLine1 ||
        !city ||
        !state ||
        !postalCode
      ) {
        throw new Error("Please fill in all required delivery fields.");
      }

      try {
        localStorage.setItem(
          CHECKOUT_DRAFT_KEY,
          JSON.stringify({
            name,
            phone,
            email,
            address: addressLine1,
            city,
            state,
            pinCode: postalCode,
          } satisfies CheckoutDraft),
        );
      } catch {
        // ignore
      }

      const orderRes = await fetch("/api/food/orders", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: {
            name,
            phone,
            email,
            addressLine1,
            city,
            state,
            postalCode,
            country: "India",
          },
          items: items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
          })),
          deliveryFee,
          couponId: appliedCoupon?.couponId || null,
          // Help server if you later special-case TEST1
          testPayAmount: isTest1 ? 1 : undefined,
        }),
      });

      const orderJson =
        (await orderRes.json()) as ApiResponse<CreateOrderData>;

      if (!orderJson.success) {
        throw new Error(
          orderJson.error?.message || "Failed to create order.",
        );
      }

      const orderId = String(orderJson.data.orderId || "").trim();

      if (!orderId) {
        throw new Error("Order was created without an orderId.");
      }

      localStorage.setItem(
        "sreshta-food-last-order",
        JSON.stringify({
          orderId,
          status: "PENDING_PAYMENT",
          paymentStatus: "PENDING",
          total: orderJson.data.order?.total ?? total,
          discount: orderJson.data.order?.discount ?? discount,
          createdAt: new Date().toISOString(),
        }),
      );

      const paymentRes = await fetch(
        "/api/payments/cashfree/create-order",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ orderId }),
        },
      );

      const paymentJson =
        (await paymentRes.json()) as ApiResponse<CashfreeCreateData>;

      if (!paymentJson.success) {
        throw new Error(
          paymentJson.error?.message ||
            "Could not start payment. Please try again.",
        );
      }

      const paymentSessionId =
        paymentJson.data.paymentSessionId?.trim() || "";

      if (!paymentSessionId) {
        throw new Error(
          "Payment session was not created. Check Cashfree sandbox keys.",
        );
      }

      await loadCashfreeScript();

      if (!window.Cashfree) {
        throw new Error("Cashfree SDK is unavailable.");
      }

      const cashfree = window.Cashfree({
        mode: getCashfreeMode(),
      });

      await cashfree.checkout({
        paymentSessionId,
        redirectTarget: "_self",
      });
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Unable to complete checkout. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (!hydrated) {
    return (
      <main className="section">
        <div
          className="container-site"
          style={{ textAlign: "center", padding: "80px 0" }}
        >
          <h1 style={{ color: "#451a03" }}>Loading checkout…</h1>
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <>
        <header className="site-header">
          <div className="container-site header-inner">
            <Link href="/food">
              <img
                src="/images/sreshta-food-logo.png"
                alt="Sreshta Foods"
                className="header-logo"
              />
            </Link>
            <Link
              href="/food/products"
              className="btn-primary"
              style={{ background: "#d97706" }}
            >
              Shop Products
            </Link>
          </div>
        </header>

        <main className="section">
          <div
            className="container-site"
            style={{
              textAlign: "center",
              paddingTop: 80,
              paddingBottom: 80,
            }}
          >
            <h1 style={{ color: "#451a03" }}>Your cart is empty</h1>
            <p>Add products before continuing to checkout.</p>
            <Link
              href="/food/products"
              className="btn-primary"
              style={{ marginTop: 20, background: "#d97706" }}
            >
              Browse Products
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      {error && (
        <div
          role="alert"
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            zIndex: 9999,
            maxWidth: "min(420px, calc(100vw - 32px))",
            borderRadius: 12,
            border: "1px solid #fecaca",
            background: "#fff",
            boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
            padding: "14px 16px",
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
          }}
        >
          <div
            style={{
              flexShrink: 0,
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "#fef2f2",
              color: "#b91c1c",
              display: "grid",
              placeItems: "center",
              fontWeight: 800,
              fontSize: 14,
            }}
          >
            !
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <strong
              style={{
                display: "block",
                color: "#991b1b",
                fontSize: 13,
                marginBottom: 4,
              }}
            >
              Payment notice
            </strong>
            <p
              style={{
                margin: 0,
                color: "#7f1d1d",
                fontSize: 13,
                lineHeight: 1.45,
              }}
            >
              {error}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setError(null)}
            aria-label="Dismiss"
            style={{
              flexShrink: 0,
              border: "none",
              background: "transparent",
              color: "#a8a29e",
              cursor: "pointer",
              fontSize: 18,
              lineHeight: 1,
              padding: 0,
            }}
          >
            ×
          </button>
        </div>
      )}

      <header className="site-header">
        <div className="container-site header-inner">
          <Link href="/food">
            <img
              src="/images/sreshta-food-logo.png"
              alt="Sreshta Foods"
              className="header-logo"
            />
          </Link>
          <Link href="/food/cart" className="btn-secondary">
            ← Back to Cart
          </Link>
        </div>
      </header>

      <main>
        <section style={{ background: "#fff7ed", padding: "65px 0" }}>
          <div className="container-site">
            <span className="section-label" style={{ color: "#b45309" }}>
              Checkout
            </span>
            <h1 className="section-title" style={{ color: "#451a03" }}>
              Complete Your Order
            </h1>
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
                  padding: "14px 16px",
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                We are not accepting new orders right now. Please try again
                later.
              </div>
            )}

            {settings.acceptNewOrders && !settings.enableCashfreePayments && (
              <div
                style={{
                  marginBottom: 20,
                  borderRadius: 12,
                  border: "1px solid #fecaca",
                  background: "#fef2f2",
                  color: "#991b1b",
                  padding: "14px 16px",
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                Online payment is temporarily disabled. Please contact
                support.
              </div>
            )}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.4fr .8fr",
                gap: 30,
                alignItems: "start",
              }}
            >
              <div className="form-shell">
                <span className="section-label" style={{ color: "#b45309" }}>
                  Customer Details
                </span>
                <h2
                  className="section-title"
                  style={{ color: "#451a03", fontSize: "2rem" }}
                >
                  Delivery Information
                </h2>

                <form onSubmit={handleSubmit}>
                  <div className="form-grid" style={{ marginTop: 28 }}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="name">
                        Full Name *
                      </label>
                      <input
                        id="name"
                        name="name"
                        className="input"
                        placeholder="Your full name"
                        required
                        value={draft.name}
                        onChange={(e) => updateDraft("name", e.target.value)}
                        disabled={!canCheckout}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="phone">
                        Phone *
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        className="input"
                        type="tel"
                        placeholder="10-digit phone number"
                        required
                        value={draft.phone}
                        onChange={(e) => updateDraft("phone", e.target.value)}
                        disabled={!canCheckout}
                      />
                    </div>

                    <div className="form-group full">
                      <label className="form-label" htmlFor="email">
                        Email *
                      </label>
                      <input
                        id="email"
                        name="email"
                        className="input"
                        type="email"
                        placeholder="you@example.com"
                        required
                        value={draft.email}
                        onChange={(e) => updateDraft("email", e.target.value)}
                        disabled={!canCheckout}
                      />
                    </div>

                    <div className="form-group full">
                      <label className="form-label" htmlFor="address">
                        Delivery Address *
                      </label>
                      <textarea
                        id="address"
                        name="address"
                        className="textarea"
                        placeholder="House / flat, street, locality"
                        required
                        value={draft.address}
                        onChange={(e) =>
                          updateDraft("address", e.target.value)
                        }
                        disabled={!canCheckout}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="city">
                        City *
                      </label>
                      <input
                        id="city"
                        name="city"
                        className="input"
                        placeholder="City"
                        required
                        value={draft.city}
                        onChange={(e) => updateDraft("city", e.target.value)}
                        disabled={!canCheckout}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="state">
                        State *
                      </label>
                      <input
                        id="state"
                        name="state"
                        className="input"
                        placeholder="State"
                        required
                        value={draft.state}
                        onChange={(e) => updateDraft("state", e.target.value)}
                        disabled={!canCheckout}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="pinCode">
                        PIN Code *
                      </label>
                      <input
                        id="pinCode"
                        name="pinCode"
                        className="input"
                        placeholder="PIN code"
                        required
                        value={draft.pinCode}
                        onChange={(e) =>
                          updateDraft("pinCode", e.target.value)
                        }
                        disabled={!canCheckout}
                      />
                    </div>

                    <div className="form-group full">
                      <label className="form-label" htmlFor="couponInput">
                        Coupon code{" "}
                        <span style={{ fontWeight: 400, opacity: 0.7 }}>
                          (optional)
                        </span>
                      </label>
                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                          flexWrap: "wrap",
                        }}
                      >
                        <input
                          id="couponInput"
                          className="input"
                          style={{ flex: 1, minWidth: 160 }}
                          placeholder="e.g. WELCOME10"
                          value={couponInput}
                          onChange={(e) =>
                            setCouponInput(e.target.value.toUpperCase())
                          }
                          disabled={!!appliedCoupon || !canCheckout}
                        />
                        {!appliedCoupon ? (
                          <button
                            type="button"
                            className="btn-primary"
                            style={{ background: "#d97706" }}
                            onClick={applyCoupon}
                            disabled={
                              couponLoading || subtotal <= 0 || !canCheckout
                            }
                          >
                            {couponLoading ? "Checking…" : "Apply"}
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="btn-secondary"
                            onClick={removeCoupon}
                            disabled={!canCheckout}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      {couponMessage && (
                        <p
                          style={{
                            marginTop: 8,
                            fontSize: 13,
                            color: appliedCoupon ? "#166534" : "#b91c1c",
                          }}
                        >
                          {couponMessage}
                        </p>
                      )}
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop: 28,
                      border: "1px solid #f0e5d6",
                      borderRadius: 10,
                      background: "#fffaf5",
                      padding: 16,
                    }}
                  >
                    <strong style={{ color: "#451a03" }}>Payment</strong>
                    <p
                      style={{
                        margin: "7px 0 0",
                        color: "#78716c",
                        fontSize: 13,
                      }}
                    >
                      {settings.enableCashfreePayments
                        ? "You will be redirected to Cashfree to complete secure online payment. Order status is confirmed only after server-side payment verification."
                        : "Cashfree payments are currently disabled in store settings."}
                    </p>
                  </div>

                  <button
                    className="btn-primary"
                    type="submit"
                    disabled={submitting || !canCheckout}
                    style={{
                      marginTop: 25,
                      width: "100%",
                      background: canCheckout ? "#d97706" : "#a8a29e",
                      minHeight: 54,
                      cursor: canCheckout ? "pointer" : "not-allowed",
                    }}
                  >
                    {submitting
                      ? "Creating order & opening payment…"
                      : !settings.acceptNewOrders
                        ? "Ordering paused"
                        : !settings.enableCashfreePayments
                          ? "Payments disabled"
                          : `Continue to Payment · ${formatMoney(total)}`}
                  </button>
                </form>
              </div>

              <aside
                style={{
                  border: "1px solid #f0e5d6",
                  borderRadius: 14,
                  background: "#fffaf5",
                  padding: 25,
                  position: "sticky",
                  top: 100,
                }}
              >
                <h2 style={{ color: "#451a03", marginTop: 0 }}>
                  Order Summary
                </h2>

                <div style={{ display: "grid", gap: 14 }}>
                  {items.map((item) => (
                    <div
                      key={`${item.productId}-${item.variantId}`}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 15,
                      }}
                    >
                      <div>
                        <strong style={{ color: "#451a03", fontSize: 13 }}>
                          {item.productName}
                        </strong>
                        <div style={{ color: "#78716c", fontSize: 12 }}>
                          {item.variantLabel} × {item.quantity}
                        </div>
                      </div>
                      <strong>
                        {formatMoney(item.price * item.quantity)}
                      </strong>
                    </div>
                  ))}

                  <div
                    style={{
                      borderTop: "1px solid #eadbca",
                      paddingTop: 15,
                      display: "grid",
                      gap: 10,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>Subtotal</span>
                      <strong>{formatMoney(subtotal)}</strong>
                    </div>

                    {productDiscount > 0 && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          color: "#166534",
                        }}
                      >
                        <span>
                          Discount
                          {appliedCoupon?.code
                            ? ` (${appliedCoupon.code})`
                            : ""}
                        </span>
                        <strong>-{formatMoney(productDiscount)}</strong>
                      </div>
                    )}

                    {deliveryDiscount > 0 && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          color: "#166534",
                        }}
                      >
                        <span>
                          Delivery
                          {appliedCoupon?.code
                            ? ` (${appliedCoupon.code})`
                            : ""}
                        </span>
                        <strong>-{formatMoney(deliveryDiscount)}</strong>
                      </div>
                    )}

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>Delivery</span>
                      <strong>
                        {deliveryFee === 0
                          ? "FREE"
                          : formatMoney(deliveryFee)}
                      </strong>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: 19,
                        color: "#451a03",
                      }}
                    >
                      <strong>Total payable</strong>
                      <strong>{formatMoney(total)}</strong>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}