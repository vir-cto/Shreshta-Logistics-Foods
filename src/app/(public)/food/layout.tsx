// import type { ReactNode } from "react";
// import PublicModuleToggle from "@/components/global/PublicModuleToggle";

// /**
//  * Public food layout.
//  * Ensures the LOGISTICS | FOODS module toggle is always available
//  * on every food public page (MDS dual-module requirement).
//  */
// export default function FoodPublicLayout({
//   children,
// }: {
//   children: ReactNode;
// }) {
//   return (
//     <>
//       <div
//         style={{
//           position: "sticky",
//           top: 0,
//           zIndex: 60,
//           display: "flex",
//           justifyContent: "center",
//           padding: "10px 16px",
//           background:
//             "linear-gradient(90deg, #2a1508 0%, #4a2a12 50%, #5c3210 100%)",
//           borderBottom: "1px solid rgba(232, 106, 23, 0.3)",
//         }}
//       >
//         <div
//           style={{
//             width: "min(1180px, 100%)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             gap: 16,
//           }}
//         >
//           <span
//             style={{
//               color: "rgba(255,255,255,0.7)",
//               fontSize: 12,
//               fontWeight: 600,
//               letterSpacing: "0.08em",
//               textTransform: "uppercase",
//             }}
//           >
//             Sreshta Logistics &amp; Foods
//           </span>
//           <PublicModuleToggle active="FOOD" />
//         </div>
//       </div>
//       {children}
//     </>
//   );
// }



// import type { ReactNode } from "react";
// import Link from "next/link";
// import PublicModuleToggle from "@/components/global/PublicModuleToggle";

// export default function FoodPublicLayout({
//   children,
// }: {
//   children: ReactNode;
// }) {
//   return (
//     <>
//       <div
//         style={{
//           position: "sticky",
//           top: 0,
//           zIndex: 60,
//           display: "flex",
//           justifyContent: "center",
//           padding: "10px 16px",
//           background:
//             "linear-gradient(90deg, #2a1508 0%, #4a2a12 50%, #5c3210 100%)",
//           borderBottom: "1px solid rgba(232, 106, 23, 0.3)",
//         }}
//       >
//         <div
//           style={{
//             width: "min(1180px, 100%)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             gap: 16,
//           }}
//         >
//           <span
//             style={{
//               color: "rgba(255,255,255,0.7)",
//               fontSize: 12,
//               fontWeight: 600,
//               letterSpacing: "0.08em",
//               textTransform: "uppercase",
//             }}
//           >
//             Sreshta Logistics &amp; Foods
//           </span>
//           <PublicModuleToggle active="FOOD" />
//         </div>
//       </div>

//       {children}

//       <footer
//         style={{
//           marginTop: 48,
//           borderTop: "1px solid #f0e5d6",
//           background: "#fffaf5",
//         }}
//       >
//         <div
//           style={{
//             width: "min(1180px, 100%)",
//             margin: "0 auto",
//             padding: "40px 16px 24px",
//             display: "grid",
//             gap: 28,
//             gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
//           }}
//         >
//           <div>
//             {/* <strong style={{ color: "#451a03" }}>Sreshta Foods</strong> */}
//             <Link href="/food">
//               <img
//                 src="/images/sreshta-food-logo.png"
//                 alt="Sreshta Foods"
//                 style={{ width: 165,marginTop: -60 }}
//               />
//             </Link>
//             <p style={{ marginTop: -40, color: "#78716c", fontSize: 14 }}>
//               Quality food products with simple ordering and delivery.
//             </p>
//           </div>

//           <div>
//             <strong style={{ color: "#451a03" }}>Shop</strong>
//             <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
//               <Link href="/food" style={{ color: "#78716c", fontSize: 14 }}>
//                 Home
//               </Link>
//               <Link
//                 href="/food/products"
//                 style={{ color: "#78716c", fontSize: 14 }}
//               >
//                 Products
//               </Link>
//               <Link
//                 href="/food/categories"
//                 style={{ color: "#78716c", fontSize: 14 }}
//               >
//                 Categories
//               </Link>
//               <Link
//                 href="/food/cart"
//                 style={{ color: "#78716c", fontSize: 14 }}
//               >
//                 Cart
//               </Link>
//             </div>
//           </div>

//           <div>
//             <strong style={{ color: "#451a03" }}>Account</strong>
//             <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
//               <Link href="/login" style={{ color: "#78716c", fontSize: 14 }}>
//                 Admin Login
//               </Link>
//               <Link
//                 href="/admin/dashboard"
//                 style={{ color: "#78716c", fontSize: 14 }}
//               >
//                 Admin Panel
//               </Link>
//               <Link
//                 href="/logistics"
//                 style={{ color: "#78716c", fontSize: 14 }}
//               >
//                 Logistics Site
//               </Link>
//             </div>
//           </div>
//         </div>

//         <div
//           style={{
//             width: "min(1180px, 100%)",
//             margin: "0 auto",
//             padding: "16px",
//             borderTop: "1px solid #eadbca",
//             color: "#a8a29e",
//             fontSize: 12,
//           }}
//         >
//           © {new Date().getFullYear()} Sreshta Foods. All rights reserved.
//         </div>
//       </footer>
//     </>
//   );
// }

// import type { ReactNode } from "react";
// import Link from "next/link";
// import PublicModuleToggle from "@/components/global/PublicModuleToggle";

// export default function FoodPublicLayout({
//   children,
// }: {
//   children: ReactNode;
// }) {
//   return (
//     <>
//       <div
//         style={{
//           position: "sticky",
//           top: 0,
//           zIndex: 60,
//           display: "flex",
//           justifyContent: "center",
//           padding: "10px 16px",
//           background:
//             "linear-gradient(90deg, #2a1508 0%, #4a2a12 50%, #5c3210 100%)",
//           borderBottom: "1px solid rgba(232, 106, 23, 0.3)",
//         }}
//       >
//         <div
//           style={{
//             width: "min(1180px, 100%)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             gap: 16,
//           }}
//         >
//           <span
//             style={{
//               color: "rgba(255,255,255,0.7)",
//               fontSize: 12,
//               fontWeight: 600,
//               letterSpacing: "0.08em",
//               textTransform: "uppercase",
//             }}
//           >
//             Sreshta Logistics &amp; Foods
//           </span>
//           <PublicModuleToggle active="FOOD" />
//         </div>
//       </div>

//       {children}

//       <footer
//         style={{
//           marginTop: 48,
//           borderTop: "1px solid #f0e5d6",
//           background: "#fffaf5",
//         }}
//       >
//         <div
//           style={{
//             width: "min(1180px, 100%)",
//             margin: "0 auto",
//             padding: "40px 16px 24px",
//             display: "grid",
//             gap: 28,
//             gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
//           }}
//         >
//           <div>
//             <Link href="/food">
//               <img
//                 src="/images/sreshta-food-logo.png"
//                 alt="Sreshta Foods"
//                 style={{ width: 165, marginTop: -60 }}
//               />
//             </Link>
//             <p style={{ marginTop: -40, color: "#78716c", fontSize: 14 }}>
//               Quality food products with simple ordering and delivery.
//             </p>
//           </div>

//           <div>
//             <strong style={{ color: "#451a03" }}>Shop</strong>
//             <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
//               <Link href="/food" style={{ color: "#78716c", fontSize: 14 }}>
//                 Home
//               </Link>
//               <Link
//                 href="/food/products"
//                 style={{ color: "#78716c", fontSize: 14 }}
//               >
//                 Products
//               </Link>
//               <Link
//                 href="/food/categories"
//                 style={{ color: "#78716c", fontSize: 14 }}
//               >
//                 Categories
//               </Link>
//               <Link
//                 href="/food/cart"
//                 style={{ color: "#78716c", fontSize: 14 }}
//               >
//                 Cart
//               </Link>
//             </div>
//           </div>

//           <div>
//             <strong style={{ color: "#451a03" }}>Account</strong>
//             <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
//               <Link href="/login" style={{ color: "#78716c", fontSize: 14 }}>
//                 Admin Login
//               </Link>
//               <Link
//                 href="/admin/dashboard"
//                 style={{ color: "#78716c", fontSize: 14 }}
//               >
//                 Admin Panel
//               </Link>
//               <Link
//                 href="/logistics"
//                 style={{ color: "#78716c", fontSize: 14 }}
//               >
//                 Logistics Site
//               </Link>
//             </div>
//           </div>

//           <div>
//             <strong style={{ color: "#451a03" }}>Food License</strong>
//             <div style={{ marginTop: 12, display: "grid", gap: 6 }}>
//               <span
//                 style={{
//                   color: "#78716c",
//                   fontSize: 13,
//                   fontWeight: 400,
//                   letterSpacing: "0.02em",
//                 }}
//               >
//                 FSSAI License No.
//               </span>
//               <span
//                 style={{
//                   color: "#451a03",
//                   fontSize: 14,
//                   fontWeight: 400,
//                   letterSpacing: "0.04em",
//                 }}
//               >
//                 20126141001875
//               </span>
//             </div>
//           </div>
//         </div>

//         <div
//           style={{
//             width: "min(1180px, 100%)",
//             margin: "0 auto",
//             padding: "16px",
//             borderTop: "1px solid #eadbca",
//             color: "#a8a29e",
//             fontSize: 12,
//             display: "flex",
//             flexWrap: "wrap",
//             alignItems: "center",
//             justifyContent: "space-between",
//             gap: 8,
//           }}
//         >
//           <span>
//             © {new Date().getFullYear()} Sreshta Foods. All rights reserved.
//           </span>
//           {/* <span style={{ color: "#78716c" }}>
//             FSSAI: <strong style={{ color: "#451a03" }}>20126141001875</strong>
//           </span> */}
//         </div>
//       </footer>
//     </>
//   );
// }

// import type { ReactNode } from "react";
// import Link from "next/link";
// import PublicModuleToggle from "@/components/global/PublicModuleToggle";
// import { getFoodSettingsServer } from "@/lib/food-settings";
// import FoodWishPopup from "@/components/public/food/FoodWishPopup";
// // import { getFoodSettingsServer } from "@/lib/food-settings";

// export default async function FoodPublicLayout({
//   children,
// }: {
//   children: ReactNode;
// }) {
//   const settings = await getFoodSettingsServer();
//   const storeName = settings.storeName || "Sreshta Foods";
//   const supportEmail = settings.supportEmail?.trim() || "";
//   const supportPhone = settings.supportPhone?.trim() || "";

//   return (
//     <>
//       <div
//         style={{
//           position: "sticky",
//           top: 0,
//           zIndex: 60,
//           display: "flex",
//           justifyContent: "center",
//           padding: "10px 16px",
//           background:
//             "linear-gradient(90deg, #2a1508 0%, #4a2a12 50%, #5c3210 100%)",
//           borderBottom: "1px solid rgba(232, 106, 23, 0.3)",
//         }}
//       >
//         <div
//           style={{
//             width: "min(1180px, 100%)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             gap: 16,
//           }}
//         >
//           <span
//             style={{
//               color: "rgba(255,255,255,0.7)",
//               fontSize: 12,
//               fontWeight: 600,
//               letterSpacing: "0.08em",
//               textTransform: "uppercase",
//             }}
//           >
//             Sreshta Logistics &amp; Foods
//           </span>
//           <PublicModuleToggle active="FOOD" />
//         </div>
//       </div>

//       {children}

//       <footer
//         style={{
//           marginTop: 48,
//           borderTop: "1px solid #f0e5d6",
//           background: "#fffaf5",
//         }}
//       >
//         <div
//           style={{
//             width: "min(1180px, 100%)",
//             margin: "0 auto",
//             padding: "40px 16px 24px",
//             display: "grid",
//             gap: 28,
//             gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
//           }}
//         >
//           <div>
//             <Link href="/food">
//               <img
//                 src="/images/sreshta-food-logo.png"
//                 alt={storeName}
//                 style={{ width: 165, marginTop: -60 }}
//               />
//             </Link>
//             <p style={{ marginTop: -40, color: "#78716c", fontSize: 14 }}>
//               Quality food products with simple ordering and delivery.
//             </p>
//           </div>

//           <div>
//             <strong style={{ color: "#451a03" }}>Shop</strong>
//             <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
//               <Link href="/food" style={{ color: "#78716c", fontSize: 14 }}>
//                 Home
//               </Link>
//               <Link
//                 href="/food/products"
//                 style={{ color: "#78716c", fontSize: 14 }}
//               >
//                 Products
//               </Link>
//               <Link
//                 href="/food/categories"
//                 style={{ color: "#78716c", fontSize: 14 }}
//               >
//                 Categories
//               </Link>
//               <Link
//                 href="/food/cart"
//                 style={{ color: "#78716c", fontSize: 14 }}
//               >
//                 Cart
//               </Link>
//             </div>
//           </div>

//           <div>
//             <strong style={{ color: "#451a03" }}>Account</strong>
//             <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
//               {/* {supportEmail ? (
//                 <a
//                   href={`mailto:${supportEmail}`}
//                   style={{ color: "#78716c", fontSize: 14 }}
//                 >
//                   {supportEmail}
//                 </a>
//               ) : null}
//               {supportPhone ? (
//                 <a
//                   href={`tel:${supportPhone.replace(/\s/g, "")}`}
//                   style={{ color: "#78716c", fontSize: 14 }}
//                 >
//                   {supportPhone}
//                 </a>
//               ) : null}
//               {!supportEmail && !supportPhone ? (
//                 <span style={{ color: "#a8a29e", fontSize: 13 }}>
//                   Contact details coming soon
//                 </span>
//               ) : null} */}
//               <Link href="/login" style={{ color: "#78716c", fontSize: 14 }}>
//                 Admin Login
//               </Link>
//               <Link
//                 href="/admin/dashboard"
//                 style={{ color: "#78716c", fontSize: 14 }}
//               >
//                 Admin Panel
//               </Link>
//               <Link
//                 href="/logistics"
//                 style={{ color: "#78716c", fontSize: 14 }}
//               >
//                 Logistics Site
//               </Link>
//             </div>
//           </div>

//           <div>
//             <strong style={{ color: "#451a03" }}>Food License</strong>
//             <div style={{ marginTop: 12, display: "grid", gap: 6 }}>
//               <span
//                 style={{
//                   color: "#78716c",
//                   fontSize: 13,
//                   fontWeight: 400,
//                   letterSpacing: "0.02em",
//                 }}
//               >
//                 FSSAI License No.
//               </span>
//               <span
//                 style={{
//                   color: "#451a03",
//                   fontSize: 14,
//                   fontWeight: 400,
//                   letterSpacing: "0.04em",
//                 }}
//               >
//                 20126141001875
//               </span>
//             </div>
//           </div>
//         </div>

//         <div
//           style={{
//             width: "min(1180px, 100%)",
//             margin: "0 auto",
//             padding: "16px",
//             borderTop: "1px solid #eadbca",
//             color: "#a8a29e",
//             fontSize: 12,
//             display: "flex",
//             flexWrap: "wrap",
//             alignItems: "center",
//             justifyContent: "space-between",
//             gap: 8,
//           }}
//         >
//           <span>
//             © {new Date().getFullYear()} {storeName}. All rights reserved.
//           </span>
//         </div>
//       </footer>
//     </>
//   );
// }

// import type { ReactNode } from "react";
// import Link from "next/link";
// import PublicModuleToggle from "@/components/global/PublicModuleToggle";
// import { getFoodSettingsServer } from "@/lib/food-settings";
// import FoodWishPopup from "@/components/public/food/FoodWishPopup";

// export default async function FoodPublicLayout({
//   children,
// }: {
//   children: ReactNode;
// }) {
//   const settings = await getFoodSettingsServer();
//   const storeName = settings.storeName || "Sreshta Foods";
//   const supportEmail = settings.supportEmail?.trim() || "";
//   const supportPhone = settings.supportPhone?.trim() || "";

//   return (
//     <>
//       <div
//         style={{
//           position: "sticky",
//           top: 0,
//           zIndex: 60,
//           display: "flex",
//           justifyContent: "center",
//           padding: "10px 16px",
//           background:
//             "linear-gradient(90deg, #2a1508 0%, #4a2a12 50%, #5c3210 100%)",
//           borderBottom: "1px solid rgba(232, 106, 23, 0.3)",
//         }}
//       >
//         <div
//           style={{
//             width: "min(1180px, 100%)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             gap: 16,
//           }}
//         >
//           <span
//             style={{
//               color: "rgba(255,255,255,0.7)",
//               fontSize: 12,
//               fontWeight: 600,
//               letterSpacing: "0.08em",
//               textTransform: "uppercase",
//             }}
//           >
//             Sreshta Logistics &amp; Foods
//           </span>
//           <PublicModuleToggle active="FOOD" />
//         </div>
//       </div>

//       {children}

//       {/* Festival / wish floating popup */}
//       <FoodWishPopup
//         enabled={Boolean(settings.popupEnabled)}
//         imageUrl={settings.popupImageUrl || ""}
//         title={settings.popupTitle || undefined}
//       />

//       <footer
//         style={{
//           marginTop: 48,
//           borderTop: "1px solid #f0e5d6",
//           background: "#fffaf5",
//         }}
//       >
//         <div
//           style={{
//             width: "min(1180px, 100%)",
//             margin: "0 auto",
//             padding: "40px 16px 24px",
//             display: "grid",
//             gap: 28,
//             gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
//           }}
//         >
//           <div>
//             <Link href="/food">
//               <img
//                 src="/images/sreshta-food-logo.png"
//                 alt={storeName}
//                 style={{ width: 165, marginTop: -60 }}
//               />
//             </Link>
//             <p style={{ marginTop: -40, color: "#78716c", fontSize: 14 }}>
//               Quality food products with simple ordering and delivery.
//             </p>
//           </div>
//           <div>
//             <strong style={{ color: "#451a03" }}>Shop</strong>
//             <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
//               <Link href="/food" style={{ color: "#78716c", fontSize: 14 }}>
//                 Home
//               </Link>
//               <Link
//                 href="/food/products"
//                 style={{ color: "#78716c", fontSize: 14 }}
//               >
//                 Products
//               </Link>
//               <Link
//                 href="/food/categories"
//                 style={{ color: "#78716c", fontSize: 14 }}
//               >
//                 Categories
//               </Link>
//               <Link
//                 href="/food/cart"
//                 style={{ color: "#78716c", fontSize: 14 }}
//               >
//                 Cart
//               </Link>
//             </div>
//           </div>
//           <div>
//             <strong style={{ color: "#451a03" }}>Account</strong>
//             <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
//               <Link href="/login" style={{ color: "#78716c", fontSize: 14 }}>
//                 Admin Login
//               </Link>
//               <Link
//                 href="/admin/dashboard"
//                 style={{ color: "#78716c", fontSize: 14 }}
//               >
//                 Admin Panel
//               </Link>
//               <Link
//                 href="/logistics"
//                 style={{ color: "#78716c", fontSize: 14 }}
//               >
//                 Logistics Site
//               </Link>
//             </div>
//           </div>
//           <div>
//             <strong style={{ color: "#451a03" }}>Food License</strong>
//             <div style={{ marginTop: 12, display: "grid", gap: 6 }}>
//               <span
//                 style={{
//                   color: "#78716c",
//                   fontSize: 13,
//                   fontWeight: 400,
//                   letterSpacing: "0.02em",
//                 }}
//               >
//                 FSSAI License No.
//               </span>
//               <span
//                 style={{
//                   color: "#451a03",
//                   fontSize: 14,
//                   fontWeight: 400,
//                   letterSpacing: "0.04em",
//                 }}
//               >
//                 20126141001875
//               </span>
//             </div>
//           </div>
//         </div>
//         <div
//           style={{
//             width: "min(1180px, 100%)",
//             margin: "0 auto",
//             padding: "16px",
//             borderTop: "1px solid #eadbca",
//             color: "#a8a29e",
//             fontSize: 12,
//             display: "flex",
//             flexWrap: "wrap",
//             alignItems: "center",
//             justifyContent: "space-between",
//             gap: 8,
//           }}
//         >
//           <span>
//             © {new Date().getFullYear()} {storeName}. All rights reserved.
//           </span>
//         </div>
//       </footer>
//     </>
//   );
// }

import type { ReactNode } from "react";
import Link from "next/link";
import PublicModuleToggle from "@/components/global/PublicModuleToggle";
import { getFoodSettingsServer } from "@/lib/food-settings";
import FoodWishPopup from "@/components/public/food/FoodWishPopup";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function FoodPublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  const settings = await getFoodSettingsServer();
  const storeName = settings.storeName || "Sreshta Foods";

  return (
    <>
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 60,
          display: "flex",
          justifyContent: "center",
          padding: "10px 16px",
          background:
            "linear-gradient(90deg, #2a1508 0%, #4a2a12 50%, #5c3210 100%)",
          borderBottom: "1px solid rgba(232, 106, 23, 0.3)",
        }}
      >
        <div
          style={{
            width: "min(1180px, 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <span
            style={{
              color: "rgba(255,255,255,0.7)",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Sreshta Logistics &amp; Foods
          </span>
          <PublicModuleToggle active="FOOD" />
        </div>
      </div>

      {children}

      <FoodWishPopup
        enabled={Boolean(settings.popupEnabled)}
        imageUrl={settings.popupImageUrl || ""}
        title={settings.popupTitle || undefined}
      />

      <footer
        style={{
          marginTop: 48,
          borderTop: "1px solid #f0e5d6",
          background: "#fffaf5",
        }}
      >
        <div
          style={{
            width: "min(1180px, 100%)",
            margin: "0 auto",
            padding: "40px 16px 24px",
            display: "grid",
            gap: 28,
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          }}
        >
          <div>
            <Link href="/food">
              <img
                src="/images/sreshta-food-logo.png"
                alt={storeName}
                style={{ width: 165, marginTop: -60 }}
              />
            </Link>
            <p style={{ marginTop: -40, color: "#78716c", fontSize: 14 }}>
              Quality food products with simple ordering and delivery.
            </p>
          </div>
          <div>
            <strong style={{ color: "#451a03" }}>Shop</strong>
            <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
              <Link href="/food" style={{ color: "#78716c", fontSize: 14 }}>
                Home
              </Link>
              <Link
                href="/food/products"
                style={{ color: "#78716c", fontSize: 14 }}
              >
                Products
              </Link>
              <Link
                href="/food/categories"
                style={{ color: "#78716c", fontSize: 14 }}
              >
                Categories
              </Link>
              <Link href="/food/cart" style={{ color: "#78716c", fontSize: 14 }}>
                Cart
              </Link>
            </div>
          </div>
          <div>
            <strong style={{ color: "#451a03" }}>Account</strong>
            <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
              <Link href="/login" style={{ color: "#78716c", fontSize: 14 }}>
                Admin Login
              </Link>
              <Link
                href="/admin/dashboard"
                style={{ color: "#78716c", fontSize: 14 }}
              >
                Admin Panel
              </Link>
              <Link
                href="/logistics"
                style={{ color: "#78716c", fontSize: 14 }}
              >
                Logistics Site
              </Link>
            </div>
          </div>
          <div>
            <strong style={{ color: "#451a03" }}>Food License</strong>
            <div style={{ marginTop: 12, display: "grid", gap: 6 }}>
              <span
                style={{
                  color: "#78716c",
                  fontSize: 13,
                  fontWeight: 400,
                  letterSpacing: "0.02em",
                }}
              >
                FSSAI License No.
              </span>
              <span
                style={{
                  color: "#451a03",
                  fontSize: 14,
                  fontWeight: 400,
                  letterSpacing: "0.04em",
                }}
              >
                20126141001875
              </span>
            </div>
          </div>
        </div>
        <div
          style={{
            width: "min(1180px, 100%)",
            margin: "0 auto",
            padding: "16px",
            borderTop: "1px solid #eadbca",
            color: "#a8a29e",
            fontSize: 12,
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
          }}
        >
          <span>
            © {new Date().getFullYear()} {storeName}. All rights reserved.
          </span>
        </div>
      </footer>
    </>
  );
}