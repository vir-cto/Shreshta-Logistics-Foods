// "use client";

// import Link from "next/link";
// import { useSearchParams } from "next/navigation";

// export default function OrderSuccessPage() {
//   const searchParams = useSearchParams();

//   const orderId =
//     searchParams.get("orderId") || "SFO-DEMO";

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
//             href="/food/products"
//             className="btn-primary"
//             style={{ background: "#d97706" }}
//           >
//             Continue Shopping
//           </Link>
//         </div>
//       </header>

//       <main
//         style={{
//           minHeight: "70vh",
//           display: "grid",
//           placeItems: "center",
//           padding: "80px 20px",
//           background: "#fffaf5",
//         }}
//       >
//         <div
//           style={{
//             width: "min(650px, 100%)",
//             textAlign: "center",
//             border: "1px solid #f0e5d6",
//             borderRadius: 18,
//             background: "#fff",
//             padding: 45,
//             boxShadow: "0 20px 60px rgba(120,70,20,.08)",
//           }}
//         >
//           <div
//             style={{
//               width: 75,
//               height: 75,
//               margin: "0 auto 25px",
//               display: "grid",
//               placeItems: "center",
//               borderRadius: "50%",
//               background: "#dcfce7",
//               color: "#15803d",
//               fontSize: 35,
//             }}
//           >
//             ✓
//           </div>

//           <span
//             className="section-label"
//             style={{
//               color: "#b45309",
//               justifyContent: "center",
//             }}
//           >
//             Order Confirmed
//           </span>

//           <h1
//             style={{
//               margin: 0,
//               color: "#451a03",
//               fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
//             }}
//           >
//             Thank You for Your Order!
//           </h1>

//           <p
//             style={{
//               color: "#78716c",
//               marginTop: 18,
//             }}
//           >
//             Your Sreshta Foods order has been created successfully.
//           </p>

//           <div
//             style={{
//               marginTop: 25,
//               borderRadius: 10,
//               background: "#fff7ed",
//               padding: 18,
//             }}
//           >
//             <span
//               style={{
//                 display: "block",
//                 color: "#78716c",
//                 fontSize: 12,
//                 textTransform: "uppercase",
//                 letterSpacing: ".08em",
//               }}
//             >
//               Order ID
//             </span>

//             <strong
//               style={{
//                 display: "block",
//                 marginTop: 5,
//                 color: "#92400e",
//                 fontSize: 22,
//               }}
//             >
//               {orderId}
//             </strong>
//           </div>

//           <div
//             style={{
//               display: "flex",
//               gap: 10,
//               justifyContent: "center",
//               flexWrap: "wrap",
//               marginTop: 28,
//             }}
//           >
//             <Link
//               href={`/food/track/${encodeURIComponent(orderId)}`}
//               className="btn-primary"
//               style={{ background: "#d97706" }}
//             >
//               Track Order
//             </Link>

//             <Link
//               href="/food/products"
//               className="btn-secondary"
//             >
//               Continue Shopping
//             </Link>
//           </div>

//           <p
//             style={{
//               marginTop: 25,
//               color: "#a8a29e",
//               fontSize: 12,
//             }}
//           >
//             Payment verification and order status will be connected to the
//             Cashfree/server workflow during backend integration.
//           </p>
//         </div>
//       </main>
//     </>
//   );
// }

// "use client";

// import Link from "next/link";
// import { useEffect } from "react";
// import { useSearchParams } from "next/navigation";

// const CART_STORAGE_KEY = "sreshta-food-cart";

// export default function OrderSuccessPage() {
//   const searchParams = useSearchParams();
//   const orderId = searchParams.get("orderId") || "SFO-DEMO";

//   // Clear guest cart after successful order
//   useEffect(() => {
//     try {
//       localStorage.removeItem(CART_STORAGE_KEY);
//       // Notify header cart badge if it listens to storage/focus
//       window.dispatchEvent(new Event("storage"));
//     } catch {
//       // ignore
//     }
//   }, []);

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
//             href="/food/products"
//             className="btn-primary"
//             style={{ background: "#d97706" }}
//           >
//             Continue Shopping
//           </Link>
//         </div>
//       </header>

//       <main
//         style={{
//           minHeight: "70vh",
//           display: "grid",
//           placeItems: "center",
//           padding: "80px 20px",
//           background: "#fffaf5",
//         }}
//       >
//         <div
//           style={{
//             width: "min(650px, 100%)",
//             textAlign: "center",
//             border: "1px solid #f0e5d6",
//             borderRadius: 18,
//             background: "#fff",
//             padding: 45,
//             boxShadow: "0 20px 60px rgba(120,70,20,.08)",
//           }}
//         >
//           <div
//             style={{
//               width: 75,
//               height: 75,
//               margin: "0 auto 25px",
//               display: "grid",
//               placeItems: "center",
//               borderRadius: "50%",
//               background: "#dcfce7",
//               color: "#15803d",
//               fontSize: 35,
//             }}
//           >
//             ✓
//           </div>

//           <span
//             className="section-label"
//             style={{ color: "#b45309", justifyContent: "center" }}
//           >
//             Order Confirmed
//           </span>

//           <h1
//             style={{
//               margin: 0,
//               color: "#451a03",
//               fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
//             }}
//           >
//             Thank You for Your Order!
//           </h1>

//           <p style={{ color: "#78716c", marginTop: 18 }}>
//             Your Sreshta Foods order has been created successfully. Your cart
//             has been cleared.
//           </p>

//           <div
//             style={{
//               marginTop: 25,
//               borderRadius: 10,
//               background: "#fff7ed",
//               padding: 18,
//             }}
//           >
//             <span
//               style={{
//                 display: "block",
//                 color: "#78716c",
//                 fontSize: 12,
//                 textTransform: "uppercase",
//                 letterSpacing: ".08em",
//               }}
//             >
//               Order ID
//             </span>
//             <strong
//               style={{
//                 display: "block",
//                 marginTop: 5,
//                 color: "#92400e",
//                 fontSize: 22,
//               }}
//             >
//               {orderId}
//             </strong>
//           </div>

//           <div
//             style={{
//               display: "flex",
//               gap: 10,
//               justifyContent: "center",
//               flexWrap: "wrap",
//               marginTop: 28,
//             }}
//           >
//             <Link
//               href={`/food/track/${encodeURIComponent(orderId)}`}
//               className="btn-primary"
//               style={{ background: "#d97706" }}
//             >
//               Track Order
//             </Link>
//             <Link href="/food/products" className="btn-secondary">
//               Continue Shopping
//             </Link>
//           </div>
//         </div>
//       </main>
//     </>
//   );
// }

// "use client";

// import Link from "next/link";
// import { useEffect, useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";

// const CART_STORAGE_KEY = "sreshta-food-cart";

// type OrderGate =
//   | { state: "loading" }
//   | { state: "paid"; orderId: string }
//   | { state: "unpaid"; orderId: string; reason: string }
//   | { state: "missing" };

// export default function OrderSuccessPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const orderIdParam = (searchParams.get("orderId") || "").trim();

//   const [gate, setGate] = useState<OrderGate>({ state: "loading" });
//   const [support, setSupport] = useState({ email: "", phone: "" });

//   useEffect(() => {
//   let cancelled = false;
//   (async () => {
//     try {
//       const res = await fetch("/api/food/settings", {
//         headers: { Accept: "application/json" },
//         cache: "no-store",
//       });
//       const json = await res.json();
//       if (!cancelled && json.success && json.data) {
//         setSupport({
//           email: String(json.data.supportEmail || ""),
//           phone: String(json.data.supportPhone || ""),
//         });
//       }
//     } catch {
//       /* ignore */
//     }
//   })();
//   return () => {
//     cancelled = true;
//   };
// }, []);

//   useEffect(() => {
//     if (!orderIdParam || orderIdParam === "SFO-DEMO") {
//       setGate({ state: "missing" });
//       return;
//     }

//     let cancelled = false;

//     async function verifyPayment() {
//       try {
//         const res = await fetch(
//           `/api/food/tracking?orderId=${encodeURIComponent(orderIdParam)}`,
//           {
//             method: "GET",
//             headers: { Accept: "application/json" },
//             cache: "no-store",
//           },
//         );

//         const json = await res.json();

//         if (!res.ok || !json.success) {
//           if (!cancelled) {
//             setGate({
//               state: "unpaid",
//               orderId: orderIdParam,
//               reason:
//                 json?.error?.message ||
//                 "Could not verify payment status.",
//             });
//           }
//           return;
//         }

//         const tracking = json.data?.tracking || json.data || {};
//         const status = String(
//           tracking.status || tracking.currentStatus || "",
//         ).toUpperCase();
//         const paymentStatus = String(
//           tracking.paymentStatus || "",
//         ).toUpperCase();

//         const isPaid =
//           status === "PAID" ||
//           paymentStatus === "PAID" ||
//           status === "CONFIRMED" ||
//           status === "PROCESSING" ||
//           status === "PACKED" ||
//           status === "SHIPPED" ||
//           status === "OUT_FOR_DELIVERY" ||
//           status === "DELIVERED";

//         if (cancelled) return;

//         if (isPaid) {
//           // Clear cart only after real payment success
//           // try {
//           //   localStorage.removeItem(CART_STORAGE_KEY);
//           //   window.dispatchEvent(new Event("storage"));
//           // } catch {
//           //   // ignore
//           // }
//           // setGate({ state: "paid", orderId: orderIdParam });
//           // return;

//           try {
//             localStorage.removeItem("sreshta-food-checkout-draft");
//             localStorage.removeItem("sreshta-food-cart");
//             window.dispatchEvent(new Event("storage"));
//           } catch {
//             // ignore
//           }
//           setGate({ state: "paid", orderId: orderIdParam });
//           return;
//         }

//         // Not paid / cancelled / failed → send back to checkout
//         setGate({
//           state: "unpaid",
//           orderId: orderIdParam,
//           reason:
//             status === "CANCELLED"
//               ? "This order was cancelled."
//               : paymentStatus === "FAILED"
//                 ? "Payment failed or was cancelled."
//                 : "Payment was not completed.",
//         });

//         router.replace(
//           `/food/checkout?payment=incomplete&orderId=${encodeURIComponent(
//             orderIdParam,
//           )}`,
//         );
//       } catch {
//         if (!cancelled) {
//           setGate({
//             state: "unpaid",
//             orderId: orderIdParam,
//             reason: "Could not verify payment. Please try again.",
//           });
//           router.replace(
//             `/food/checkout?payment=incomplete&orderId=${encodeURIComponent(
//               orderIdParam,
//             )}`,
//           );
//         }
//       }
//     }

//     verifyPayment();

//     return () => {
//       cancelled = true;
//     };
//   }, [orderIdParam, router]);

//   if (gate.state === "loading") {
//     return (
//       <main
//         style={{
//           minHeight: "70vh",
//           display: "grid",
//           placeItems: "center",
//           padding: 40,
//           background: "#fffaf5",
//         }}
//       >
//         <p style={{ color: "#78716c" }}>Verifying payment…</p>
//       </main>
//     );
//   }

//   if (gate.state === "missing") {
//     return (
//       <main
//         style={{
//           minHeight: "70vh",
//           display: "grid",
//           placeItems: "center",
//           padding: 40,
//           background: "#fffaf5",
//         }}
//       >
//         <div style={{ textAlign: "center" }}>
//           <h1 style={{ color: "#451a03" }}>No order found</h1>
//           <Link
//             href="/food/checkout"
//             className="btn-primary"
//             style={{ background: "#d97706", marginTop: 16 }}
//           >
//             Go to Checkout
//           </Link>
//         </div>
//       </main>
//     );
//   }

//   if (gate.state === "unpaid") {
//     // Brief message while redirect runs
//     return (
//       <main
//         style={{
//           minHeight: "70vh",
//           display: "grid",
//           placeItems: "center",
//           padding: 40,
//           background: "#fffaf5",
//         }}
//       >
//         <div style={{ textAlign: "center", maxWidth: 420 }}>
//           <h1 style={{ color: "#451a03" }}>Payment not completed</h1>
//           <p style={{ color: "#78716c" }}>{gate.reason}</p>
//           <p style={{ color: "#78716c", fontSize: 14 }}>
//             Redirecting you back to checkout…
//           </p>
//           <Link
//             href={`/food/checkout?payment=incomplete&orderId=${encodeURIComponent(
//               gate.orderId,
//             )}`}
//             className="btn-primary"
//             style={{ background: "#d97706", marginTop: 16 }}
//           >
//             Return to Checkout
//           </Link>
//         </div>
//       </main>
//     );
//   }

//   // Paid
//   const orderId = gate.orderId;

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
//             href="/food/products"
//             className="btn-primary"
//             style={{ background: "#d97706" }}
//           >
//             Continue Shopping
//           </Link>
//         </div>
//       </header>

//       <main
//         style={{
//           minHeight: "70vh",
//           display: "grid",
//           placeItems: "center",
//           padding: "80px 20px",
//           background: "#fffaf5",
//         }}
//       >
//         <div
//           style={{
//             width: "min(650px, 100%)",
//             textAlign: "center",
//             border: "1px solid #f0e5d6",
//             borderRadius: 18,
//             background: "#fff",
//             padding: 45,
//             boxShadow: "0 20px 60px rgba(120,70,20,.08)",
//           }}
//         >
//           <div
//             style={{
//               width: 75,
//               height: 75,
//               margin: "0 auto 25px",
//               display: "grid",
//               placeItems: "center",
//               borderRadius: "50%",
//               background: "#dcfce7",
//               color: "#15803d",
//               fontSize: 35,
//             }}
//           >
//             ✓
//           </div>

//           <span
//             className="section-label"
//             style={{ color: "#b45309", justifyContent: "center" }}
//           >
//             Order Confirmed
//           </span>

//           <h1
//             style={{
//               margin: 0,
//               color: "#451a03",
//               fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
//             }}
//           >
//             Thank You for Your Order!
//           </h1>

//           <p style={{ color: "#78716c", marginTop: 18 }}>
//             Payment was verified successfully. Your order is confirmed.
//           </p>

//           <div
//             style={{
//               marginTop: 25,
//               borderRadius: 10,
//               background: "#fff7ed",
//               padding: 18,
//             }}
//           >
//             <span
//               style={{
//                 display: "block",
//                 color: "#78716c",
//                 fontSize: 12,
//                 textTransform: "uppercase",
//                 letterSpacing: ".08em",
//               }}
//             >
//               Order ID
//             </span>
//             <strong
//               style={{
//                 display: "block",
//                 marginTop: 5,
//                 color: "#92400e",
//                 fontSize: 22,
//               }}
//             >
//               {orderId}
//             </strong>
//           </div>

//           <div
//             style={{
//               display: "flex",
//               gap: 10,
//               justifyContent: "center",
//               flexWrap: "wrap",
//               marginTop: 28,
//             }}
//           >
//             <Link
//               href={`/food/track/${encodeURIComponent(orderId)}`}
//               className="btn-primary"
//               style={{ background: "#d97706" }}
//             >
//               Track Order
//             </Link>
//             <Link href="/food/products" className="btn-secondary">
//               Continue Shopping
//             </Link>
//           </div>
//         </div>
//       </main>
//     </>
//   );
// }

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type OrderGate =
  | { state: "loading" }
  | { state: "paid"; orderId: string }
  | { state: "unpaid"; orderId: string; reason: string }
  | { state: "missing" };

export default function OrderSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderIdParam = (searchParams.get("orderId") || "").trim();

  const [gate, setGate] = useState<OrderGate>({ state: "loading" });
  const [support, setSupport] = useState({ email: "", phone: "" });

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/api/food/settings", {
          headers: { Accept: "application/json" },
          cache: "no-store",
        });
        const json = await res.json();
        if (!cancelled && json.success && json.data) {
          setSupport({
            email: String(json.data.supportEmail || "").trim(),
            phone: String(json.data.supportPhone || "").trim(),
          });
        }
      } catch {
        /* ignore */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!orderIdParam || orderIdParam === "SFO-DEMO") {
      setGate({ state: "missing" });
      return;
    }

    let cancelled = false;

    async function verifyPayment() {
      try {
        const res = await fetch(
          `/api/food/tracking?orderId=${encodeURIComponent(orderIdParam)}`,
          {
            method: "GET",
            headers: { Accept: "application/json" },
            cache: "no-store",
          },
        );

        const json = await res.json();

        if (!res.ok || !json.success) {
          if (!cancelled) {
            setGate({
              state: "unpaid",
              orderId: orderIdParam,
              reason:
                json?.error?.message ||
                "Could not verify payment status.",
            });
          }
          return;
        }

        const tracking = json.data?.tracking || json.data || {};
        const status = String(
          tracking.status || tracking.currentStatus || "",
        ).toUpperCase();
        const paymentStatus = String(
          tracking.paymentStatus || "",
        ).toUpperCase();

        const isPaid =
          status === "PAID" ||
          paymentStatus === "PAID" ||
          status === "CONFIRMED" ||
          status === "PROCESSING" ||
          status === "PACKED" ||
          status === "SHIPPED" ||
          status === "OUT_FOR_DELIVERY" ||
          status === "DELIVERED";

        if (cancelled) return;

        if (isPaid) {
          try {
            localStorage.removeItem("sreshta-food-checkout-draft");
            localStorage.removeItem("sreshta-food-cart");
            window.dispatchEvent(new Event("storage"));
          } catch {
            // ignore
          }
          setGate({ state: "paid", orderId: orderIdParam });
          return;
        }

        setGate({
          state: "unpaid",
          orderId: orderIdParam,
          reason:
            status === "CANCELLED"
              ? "This order was cancelled."
              : paymentStatus === "FAILED"
                ? "Payment failed or was cancelled."
                : "Payment was not completed.",
        });

        router.replace(
          `/food/checkout?payment=incomplete&orderId=${encodeURIComponent(
            orderIdParam,
          )}`,
        );
      } catch {
        if (!cancelled) {
          setGate({
            state: "unpaid",
            orderId: orderIdParam,
            reason: "Could not verify payment. Please try again.",
          });
          router.replace(
            `/food/checkout?payment=incomplete&orderId=${encodeURIComponent(
              orderIdParam,
            )}`,
          );
        }
      }
    }

    verifyPayment();

    return () => {
      cancelled = true;
    };
  }, [orderIdParam, router]);

  if (gate.state === "loading") {
    return (
      <main
        style={{
          minHeight: "70vh",
          display: "grid",
          placeItems: "center",
          padding: 40,
          background: "#fffaf5",
        }}
      >
        <p style={{ color: "#78716c" }}>Verifying payment…</p>
      </main>
    );
  }

  if (gate.state === "missing") {
    return (
      <main
        style={{
          minHeight: "70vh",
          display: "grid",
          placeItems: "center",
          padding: 40,
          background: "#fffaf5",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h1 style={{ color: "#451a03" }}>No order found</h1>
          <Link
            href="/food/checkout"
            className="btn-primary"
            style={{ background: "#d97706", marginTop: 16 }}
          >
            Go to Checkout
          </Link>
        </div>
      </main>
    );
  }

  if (gate.state === "unpaid") {
    return (
      <main
        style={{
          minHeight: "70vh",
          display: "grid",
          placeItems: "center",
          padding: 40,
          background: "#fffaf5",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: 420 }}>
          <h1 style={{ color: "#451a03" }}>Payment not completed</h1>
          <p style={{ color: "#78716c" }}>{gate.reason}</p>
          <p style={{ color: "#78716c", fontSize: 14 }}>
            Redirecting you back to checkout…
          </p>
          <Link
            href={`/food/checkout?payment=incomplete&orderId=${encodeURIComponent(
              gate.orderId,
            )}`}
            className="btn-primary"
            style={{ background: "#d97706", marginTop: 16 }}
          >
            Return to Checkout
          </Link>
        </div>
      </main>
    );
  }

  const orderId = gate.orderId;

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
            Continue Shopping
          </Link>
        </div>
      </header>

      <main
        style={{
          minHeight: "70vh",
          display: "grid",
          placeItems: "center",
          padding: "80px 20px",
          background: "#fffaf5",
        }}
      >
        <div
          style={{
            width: "min(650px, 100%)",
            textAlign: "center",
            border: "1px solid #f0e5d6",
            borderRadius: 18,
            background: "#fff",
            padding: 45,
            boxShadow: "0 20px 60px rgba(120,70,20,.08)",
          }}
        >
          <div
            style={{
              width: 75,
              height: 75,
              margin: "0 auto 25px",
              display: "grid",
              placeItems: "center",
              borderRadius: "50%",
              background: "#dcfce7",
              color: "#15803d",
              fontSize: 35,
            }}
          >
            ✓
          </div>

          <span
            className="section-label"
            style={{ color: "#b45309", justifyContent: "center" }}
          >
            Order Confirmed
          </span>

          <h1
            style={{
              margin: 0,
              color: "#451a03",
              fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
            }}
          >
            Thank You for Your Order!
          </h1>

          <p style={{ color: "#78716c", marginTop: 18 }}>
            Payment was verified successfully. Your order is confirmed.
          </p>

          <div
            style={{
              marginTop: 25,
              borderRadius: 10,
              background: "#fff7ed",
              padding: 18,
            }}
          >
            <span
              style={{
                display: "block",
                color: "#78716c",
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: ".08em",
              }}
            >
              Order ID
            </span>
            <strong
              style={{
                display: "block",
                marginTop: 5,
                color: "#92400e",
                fontSize: 22,
              }}
            >
              {orderId}
            </strong>
          </div>

          {(support.email || support.phone) && (
            <p style={{ marginTop: 16, color: "#78716c", fontSize: 14 }}>
              Need help?
              {support.email ? (
                <>
                  {" "}
                  <a href={`mailto:${support.email}`}>{support.email}</a>
                </>
              ) : null}
              {support.email && support.phone ? " · " : null}
              {support.phone ? (
                <a href={`tel:${support.phone.replace(/\s/g, "")}`}>
                  {support.phone}
                </a>
              ) : null}
            </p>
          )}

          <div
            style={{
              display: "flex",
              gap: 10,
              justifyContent: "center",
              flexWrap: "wrap",
              marginTop: 28,
            }}
          >
            <Link
              href={`/food/track/${encodeURIComponent(orderId)}`}
              className="btn-primary"
              style={{ background: "#d97706" }}
            >
              Track Order
            </Link>
            <Link href="/food/products" className="btn-secondary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}