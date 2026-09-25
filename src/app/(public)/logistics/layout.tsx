// import type { ReactNode } from "react";
// import PublicModuleToggle from "@/components/global/PublicModuleToggle";

// /**
//  * Public logistics layout.
//  * Ensures the LOGISTICS | FOODS module toggle is always available
//  * on every logistics public page (MDS dual-module requirement).
//  */
// export default function LogisticsPublicLayout({
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
//             "linear-gradient(90deg, #041d38 0%, #082d55 50%, #0a3a4a 100%)",
//           borderBottom: "1px solid rgba(8, 165, 174, 0.25)",
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
//           <PublicModuleToggle active="LOGISTICS" />
//         </div>
//       </div>
//       {children}
//     </>
//   );
// }

import type { ReactNode } from "react";
import Link from "next/link";
import PublicModuleToggle from "@/components/global/PublicModuleToggle";
import { CONTACTS, ROUTES } from "@/utils/constants";

function LogisticsFooter() {
  return (
    <footer className="footer">
      <div className="container-site footer-main">
        <div>
          <img
            src="/images/sreshta-logistics-logo.png"
            alt="Sreshta Logistics"
            className="footer-logo"
          />
          <p>
            Professional logistics solutions designed around reliable movement,
            clear communication and shipment visibility.
          </p>
        </div>

        <div>
          <h3>Services</h3>
          <div className="footer-links">
            <Link href={ROUTES.LOGISTICS_INTERNATIONAL}>International</Link>
            <Link href={ROUTES.LOGISTICS_DOMESTIC}>Domestic</Link>
            <Link href={ROUTES.LOGISTICS_CARGO}>Cargo & Freight</Link>
            <Link href={ROUTES.LOGISTICS_PICKUP}>Pickup Request</Link>
          </div>
        </div>

        <div>
          <h3>Company</h3>
          <div className="footer-links">
            <Link href={ROUTES.LOGISTICS_ABOUT}>About Us</Link>
            <Link href={ROUTES.LOGISTICS_PARTNERSHIP}>Partnership</Link>
            <Link href={ROUTES.LOGISTICS_CONTACT}>Contact</Link>
            <Link href={ROUTES.LOGISTICS_TRACK}>Track Shipment</Link>
          </div>
        </div>

        <div>
          <h3>Account</h3>
          <div className="footer-links">
            <Link href={ROUTES.LOGIN ?? "/login"}>Admin Login</Link>
            <Link href={ROUTES.ADMIN ?? "/admin"}>Admin Panel</Link>
            <Link href={ROUTES.FOOD ?? "/food"}>Food Site</Link>
          </div>
        </div>

        <div>
          <h3>Get in Touch</h3>
          <div className="footer-links">
            <p
              style={{
                margin: "0 0 2px",
                fontSize: 12,
                fontWeight: 400,
                letterSpacing: "0.04em",
                opacity: 0.85,
              }}
            >
              Phone
            </p>

            <div style={{ marginBottom: 10 }}>
              <h3 style={{ display: "block", lineHeight: 1.2, margin: 0, fontSize: 14 }}>
                {CONTACTS.MANAGING_DIRECTOR.name}
              </h3>
              <span style={{ display: "block", fontSize: 12, marginTop: 4, opacity: 0.85 }}>
                {CONTACTS.MANAGING_DIRECTOR.role}
              </span>
              <a
                href={`tel:+91${CONTACTS.MANAGING_DIRECTOR.phone}`}
                style={{ display: "inline-block", marginTop: 4 }}
              >
                {CONTACTS.MANAGING_DIRECTOR.phone}
              </a>
            </div>

            <div style={{ marginBottom: 8 }}>
              <h3 style={{ display: "block", lineHeight: 1.2, margin: 0, fontSize: 14 }}>
                {CONTACTS.PARTNER.name}
              </h3>
              <span style={{ display: "block", fontSize: 12, marginTop: 4, opacity: 0.85 }}>
                {CONTACTS.PARTNER.role}
              </span>
              <a
                href={`tel:+91${CONTACTS.PARTNER.phone}`}
                style={{ display: "inline-block", marginTop: 4 }}
              >
                {CONTACTS.PARTNER.phone}
              </a>
            </div>

            <span>India</span>
          </div>
        </div>
      </div>

      <div className="container-site footer-bottom">
        © {new Date().getFullYear()} Sreshta Logistics. All rights reserved.
      </div>
    </footer>
  );
}

export default function LogisticsPublicLayout({
  children,
}: {
  children: ReactNode;
}) {
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
            "linear-gradient(90deg, #041d38 0%, #082d55 50%, #0a3a4a 100%)",
          borderBottom: "1px solid rgba(8, 165, 174, 0.25)",
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
          <PublicModuleToggle active="LOGISTICS" />
        </div>
      </div>

      {children}

      <LogisticsFooter />
    </>
  );
}