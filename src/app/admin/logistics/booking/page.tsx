// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useAuth } from "@/context/AuthContext";

// import AWBBookingForm, {
//   AWBBookingData,
// } from "@/components/logistics/AWBBookingForm";

// type ApiResponse =
//   | {
//       success: true;
//       data?: {
//         awb?: string;
//         orderId?: string;
//         documentId?: string;
//         [key: string]: unknown;
//       };
//       message?: string;
//     }
//   | {
//       success: false;
//       error: {
//         code: string;
//         message: string;
//       };
//     };

// function deriveServiceType(
//   product: string,
//   destination: string,
// ): string {
//   const p = (product || "").toUpperCase();
//   const d = (destination || "").toUpperCase();

//   if (
//     p.includes("INTERNATIONAL") ||
//     d.includes("USA") ||
//     d.includes("UK") ||
//     d.includes("UAE") ||
//     d.includes("CANADA") ||
//     d.includes("AUSTRALIA")
//   ) {
//     return "INTERNATIONAL";
//   }
//   if (p.includes("CARGO") || p.includes("FREIGHT")) {
//     return "CARGO";
//   }
//   if (p.includes("EXPRESS")) {
//     return "EXPRESS";
//   }
//   return "DOMESTIC";
// }

// export default function BookingPage() {
//   const router = useRouter();
//   const { user, loading: authLoading } = useAuth();

//   const [submitting, setSubmitting] = useState(false);
//   const [createdAwb, setCreatedAwb] = useState("");
//   const [error, setError] = useState<string | null>(null);
//   const [message, setMessage] = useState<string | null>(null);

//   // Temporary: while Firebase auth is deferred, treat any logged-in demo user as allowed
//   const role =
//     (user as { role?: string } | null)?.role ||
//     (typeof window !== "undefined"
//       ? JSON.parse(localStorage.getItem("sreshta-demo-auth") || "{}")
//           ?.role
//       : null);

//   const accountCode =
//     (user as { accountCode?: string; coLoaderCode?: string } | null)
//       ?.accountCode ||
//     (user as { coLoaderCode?: string } | null)?.coLoaderCode ||
//     (typeof window !== "undefined"
//       ? JSON.parse(localStorage.getItem("sreshta-demo-auth") || "{}")
//           ?.accountCode
//       : "") ||
//     "";

//   const canManageFuelSurcharge =
//     role === "SUPER_ADMIN" || role === "ADMIN";

//   async function handleSubmit(data: AWBBookingData) {
//     try {
//       setSubmitting(true);
//       setError(null);
//       setMessage(null);
//       setCreatedAwb("");

//       // Soft auth check while Firebase is deferred
//       if (!user && typeof window !== "undefined") {
//         const demo = localStorage.getItem("sreshta-demo-auth");
//         if (!demo) {
//           throw new Error(
//             "Authentication is required to create an AWB.",
//           );
//         }
//       }

//       const serviceType = deriveServiceType(
//         data.product,
//         data.destination,
//       );

//       const payload = {
//         customerId: data.customerId || data.customerCode || "WALKIN",
//         customerCode: data.customerCode,
//         customerName: data.customerName,
//         accountCode: data.accountCode || accountCode,

//         shipper: {
//           name: data.shipper.name,
//           company: data.shipper.company,
//           contactName: data.shipper.contactName,
//           phone: data.shipper.phone,
//           mobile: data.shipper.mobile,
//           email: data.shipper.email,
//           addressLine1: data.shipper.addressLine1,
//           addressLine2: data.shipper.addressLine2,
//           city: data.shipper.city,
//           state: data.shipper.state,
//           pincode: data.shipper.pincode,
//           country: data.shipper.country || "India",
//           gstin: data.shipper.gstin,
//           iecNo: data.shipper.iecNo,
//           documentType: data.shipper.documentType,
//           documentNo: data.shipper.documentNo,
//           origin: data.shipper.origin || data.origin,
//           originCode: data.shipper.originCode || data.originCode,
//         },
//         consignee: {
//           name: data.consignee.name,
//           company: data.consignee.company,
//           contactName: data.consignee.contactName,
//           phone: data.consignee.phone,
//           mobile: data.consignee.mobile,
//           email: data.consignee.email,
//           addressLine1: data.consignee.addressLine1,
//           addressLine2: data.consignee.addressLine2,
//           city: data.consignee.city,
//           state: data.consignee.state,
//           pincode: data.consignee.pincode,
//           country: data.consignee.country || "USA",
//           gstin: data.consignee.gstin,
//           iecNo: data.consignee.iecNo,
//           documentType: data.consignee.documentType,
//           documentNo: data.consignee.documentNo,
//         },

//         origin: data.origin || data.shipper.origin || data.shipper.city || "",
//         originCode: data.originCode || data.shipper.originCode,
//         destination: data.destination,
//         destinationCode: data.destinationCode,
//         product: data.product,
//         vendor: data.vendor,
//         service: data.service,
//         serviceType,
//         preCarriageBy: data.vendor || data.service,
//         bookDate: data.bookDate,
//         shipmentDate: data.bookDate,

//         pieces: data.pieces.map((p) => ({
//           quantity: p.quantity,
//           actualWeightKg: p.weightKg,
//           lengthCm: p.lengthCm,
//           widthCm: p.widthCm,
//           heightCm: p.heightCm,
//           division: p.division ?? 5000,
//           volumetricWeight: p.volumetricWeight,
//           chargeableWeight: p.chargeableWeight,
//           description: p.description,
//         })),
//         totalPieces: data.totalPieces,
//         actualWeight: data.actualWeight,
//         volumetricWeight: data.volumetricWeight,
//         chargeableWeight: data.chargeableWeight,
//         packageType: data.packageType,
//         declaredValue: data.shipmentValue,
//         currency: data.currency,

//         csbType: data.csbType,
//         termOfInvoice: data.termOfInvoice,
//         exportReason: data.exportReason,
//         gstInvoice: data.gstInvoice,
//         invoiceNo: data.invoiceNo,
//         invoiceDate: data.invoiceDate,
//         departmentNo: data.departmentNo,
//         format: data.format,
//         items: data.items,

//         charges: {
//           freight: data.charges.freight,
//           fuelSurcharge: data.charges.fuelSurcharge,
//           contractCharges: data.charges.contractCharges,
//           otherCharges: data.charges.otherCharges,
//           surcharge: data.charges.surcharge,
//           discount: data.charges.discount,
//           cgst: data.charges.cgst,
//           sgst: data.charges.sgst,
//           igst: data.charges.igst,
//           additionalCharges: data.charges.additionalCharges,
//         },

//         paymentType: data.paymentType,
//         referenceNo: data.referenceNo,
//         content: data.content,
//         instruction: data.instruction,
//         commercial: data.commercial,
//         oda: data.oda,
//         medicalCharges: data.medicalCharges,
//       };

//       // Prefer Firebase token when available; otherwise send demo header
//       const headers: Record<string, string> = {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//       };

//       if (user && typeof (user as { getIdToken?: () => Promise<string> }).getIdToken === "function") {
//         const token = await (user as { getIdToken: () => Promise<string> }).getIdToken();
//         headers.Authorization = `Bearer ${token}`;
//       } else if (typeof window !== "undefined") {
//         headers["X-Demo-Auth"] = localStorage.getItem("sreshta-demo-auth") || "";
//       }

//       const res = await fetch("/api/logistics/awb/create", {
//         method: "POST",
//         headers,
//         body: JSON.stringify(payload),
//       });

//       const json = (await res.json()) as ApiResponse;

//       if (!res.ok || !json.success) {
//         throw new Error(
//           !json.success
//             ? json.error?.message || "Failed to create AWB."
//             : "Failed to create AWB.",
//         );
//       }

//       const awb = String(
//         json.data?.awb ||
//           json.data?.documentId ||
//           "",
//       );

//       if (!awb) {
//         setMessage(
//           json.message ||
//             "AWB created successfully, but no AWB number was returned.",
//         );
//         return;
//       }

//       setCreatedAwb(awb);
//       setMessage(`AWB ${awb} created successfully.`);

//       // Best-effort PDF generation (does not block navigation)
//       try {
//         const totalAmount =
//           Number(data.charges.freight || 0) +
//           Number(data.charges.fuelSurcharge || 0) +
//           Number(data.charges.contractCharges || 0) +
//           Number(data.charges.otherCharges || 0) +
//           Number(data.charges.surcharge || 0) +
//           Number(data.charges.cgst || 0) +
//           Number(data.charges.sgst || 0) +
//           Number(data.charges.igst || 0) -
//           Number(data.charges.discount || 0);

//         await fetch("/api/admin/logistics/generate-pdf", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             type: "both",
//             awb,
//             accountCode: data.accountCode || accountCode,
//             bookDate: data.bookDate,
//             invoiceNo: data.invoiceNo || `INV-${awb}`,
//             invoiceDate: data.invoiceDate,
//             shipperName:
//               data.shipper.name || data.shipper.company || "",
//             shipperAddress: [
//               data.shipper.addressLine1,
//               data.shipper.addressLine2,
//               data.shipper.city,
//               data.shipper.state,
//               data.shipper.pincode,
//             ]
//               .filter(Boolean)
//               .join(", "),
//             shipperPhone: data.shipper.phone,
//             shipperTaxId:
//               data.shipper.gstin || data.shipper.documentNo,
//             consigneeName:
//               data.consignee.name || data.consignee.company || "",
//             consigneeAddress: [
//               data.consignee.addressLine1,
//               data.consignee.addressLine2,
//             ]
//               .filter(Boolean)
//               .join(", "),
//             consigneeCity: data.consignee.city,
//             consigneeState: data.consignee.state,
//             consigneePincode: data.consignee.pincode,
//             consigneeCountry: data.consignee.country,
//             consigneePhone: data.consignee.phone,
//             product: data.product,
//             vendor: data.vendor,
//             pieces: data.totalPieces,
//             actualWeight: data.actualWeight,
//             chargeableWeight: data.chargeableWeight,
//             declaredValue: data.shipmentValue,
//             currency: data.currency,
//             content: data.content || data.exportReason,
//             csbType: data.csbType,
//             exportReason: data.exportReason,
//             items: data.items.map((i) => ({
//               description: i.description,
//               shopName: i.shopName,
//               shopAddress: i.shopAddress,
//               hsCode: i.hsCode,
//               quantity: i.quantity,
//               weight: i.weight,
//               unitRate: i.unitRate,
//               amount: i.amount,
//             })),
//             totalAmount,
//           }),
//         });
//       } catch {
//         // PDF is best-effort
//       }

//       router.push(
//         `/admin/logistics/awb/${encodeURIComponent(awb)}`,
//       );
//     } catch (e) {
//       setError(
//         e instanceof Error ? e.message : "Failed to create AWB.",
//       );
//       throw e;
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   if (authLoading) {
//     return (
//       <div className="flex min-h-[40vh] items-center justify-center text-sm text-slate-500">
//         Loading…
//       </div>
//     );
//   }

//   return (
//     <div className="mx-auto max-w-[1400px]">
//       <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
//         <div>
//           <p className="text-xs font-bold uppercase tracking-widest text-[#087f87]">
//             Logistics
//           </p>
//           <h2 className="mt-1 text-2xl font-bold text-[#06284c]">
//             AWB Entry / Booking
//           </h2>
//           <p className="mt-1 text-sm text-slate-500">
//             Xpression-style single-page booking with performa, pieces
//             &amp; charges.
//           </p>
//         </div>

//         <Link
//           href="/admin/logistics/awb"
//           className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50"
//         >
//           ← Back to AWB List
//         </Link>
//       </div>

//       {message && (
//         <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
//           {message}
//           {createdAwb && (
//             <Link
//               href={`/admin/logistics/awb/${encodeURIComponent(createdAwb)}`}
//               className="ml-2 font-bold underline"
//             >
//               Open AWB
//             </Link>
//           )}
//         </div>
//       )}

//       {error && (
//         <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
//           {error}
//         </div>
//       )}

//       <AWBBookingForm
//         onSubmit={handleSubmit}
//         defaultAccountCode={accountCode}
//         canManageFuelSurcharge={canManageFuelSurcharge}
//       />
//     </div>
//   );
// }

// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";

// import { useAuth } from "@/context/AuthContext";
// import AWBBookingForm, {
//   type AWBBookingData,
// } from "@/components/logistics/AWBBookingForm";
// import { ROUTES } from "@/utils/constants";

// type ApiResponse =
//   | {
//       success: true;
//       data?: {
//         awb?: string;
//         documentId?: string;
//         [key: string]: unknown;
//       };
//       message?: string;
//     }
//   | {
//       success: false;
//       error: {
//         code: string;
//         message: string;
//       };
//     };

// // async function buildAuthHeaders(
// //   firebaseUser: { getIdToken: (force?: boolean) => Promise<string> } | null,
// // ): Promise<HeadersInit> {
// //   const headers: Record<string, string> = {
// //     Accept: "application/json",
// //     "Content-Type": "application/json",
// //   };

// //   if (firebaseUser) {
// //     const token = await firebaseUser.getIdToken(true);
// //     headers.Authorization = `Bearer ${token}`;
// //   }

// //   return headers;
// // }

// async function buildAuthHeaders(
//   firebaseUser: { getIdToken: (force?: boolean) => Promise<string> } | null,
// ): Promise<HeadersInit> {
//   const headers: Record<string, string> = {
//     Accept: "application/json",
//     "Content-Type": "application/json",
//   };

//   if (firebaseUser) {
//     const token = await firebaseUser.getIdToken(true);
//     headers.Authorization = `Bearer ${token}`;
//   }

//   return headers;
// }

// function deriveServiceType(product: string, destination: string): string {
//   const p = (product || "").toUpperCase();
//   const d = (destination || "").toUpperCase();

//   if (
//     p.includes("INTERNATIONAL") ||
//     ["USA", "UK", "UAE", "CANADA", "AUSTRALIA", "U.S.A"].some((x) =>
//       d.includes(x),
//     )
//   ) {
//     return "INTERNATIONAL";
//   }
//   if (p.includes("CARGO") || p.includes("FREIGHT")) return "CARGO";
//   if (p.includes("EXPRESS")) return "EXPRESS";
//   return "DOMESTIC";
// }

// /** Map rich form → current create API body (expand API later if needed) */
// function mapFormToCreateBody(data: AWBBookingData) {
//   return {
//     customerId: data.customerId || data.customerCode || "WALKIN",
//     senderId: "WALKIN_SENDER",
//   receiverId: "WALKIN_RECEIVER",
//     customerName: data.customerName,
//     customerCode: data.customerCode,
//     accountCode: data.accountCode,

//     origin: data.origin || data.shipper.city || data.shipper.pincode,
//     destination:
//       data.destination || data.consignee.city || data.consignee.country,

//     serviceType: deriveServiceType(data.product, data.destination),
//     product: data.product,
//     vendor: data.vendor,
//     serviceId: data.service || data.product || "SELF",
//     service: data.service,

//     shipmentDate: data.bookDate,
//     description: data.content || data.instruction,

//     shipper: data.shipper,
//     consignee: data.consignee,

//     pieces: (data.pieces || []).map((p, i) => ({
//       quantity: Number(p.quantity) || 1,
//       actualWeightKg: Number(p.weightKg) || 0,
//       lengthCm: Number(p.lengthCm) || 0,
//       widthCm: Number(p.widthCm) || 0,
//       heightCm: Number(p.heightCm) || 0,
//       description: p.description?.trim() || `Piece ${i + 1}`,
//     })),

//     gstin: data.shipper.gstin || undefined,
//     csbType: data.csbType,
//     termOfInvoice: data.termOfInvoice,
//     exportReason: data.exportReason,
//     invoiceNo: data.invoiceNo,
//     invoiceDate: data.invoiceDate,
//     items: data.items,

//     freight: data.charges?.freight ?? 0,
//     fuelSurcharge: data.charges?.fuelSurcharge ?? 0,
//     otherCharges:
//       (data.charges?.otherCharges ?? 0) +
//       (data.charges?.contractCharges ?? 0) +
//       (data.charges?.surcharge ?? 0),
//     discount: data.charges?.discount ?? 0,
//     gstRate: 18,

//     paymentType: data.paymentType,
//     referenceNo: data.referenceNo,
//     commercial: data.commercial,
//     oda: data.oda,
//     medicalCharges: data.medicalCharges,
//     totalPieces: data.totalPieces,
//     packageType: data.packageType,
//     actualWeight: data.actualWeight,
//     volumetricWeight: data.volumetricWeight,
//     chargeableWeight: data.chargeableWeight,
//     shipmentValue: data.shipmentValue,
//     currency: data.currency,
//   };
// }

// export default function BookingPage() {
//   const router = useRouter();
//   const { firebaseUser, user, loading: authLoading } = useAuth();

//   const [submitting, setSubmitting] = useState(false);
//   const [createdAwb, setCreatedAwb] = useState("");
//   const [error, setError] = useState<string | null>(null);
//   const [message, setMessage] = useState<string | null>(null);

//   const role = (user as { role?: string } | null)?.role ?? null;

//   const accountCode =
//     (user as { accountCode?: string; coLoaderCode?: string } | null)
//       ?.accountCode ||
//     (user as { coLoaderCode?: string } | null)?.coLoaderCode ||
//     "";

//   const canManageFuelSurcharge =
//     role === "SUPER_ADMIN" || role === "ADMIN";

//   async function handleSubmit(data: AWBBookingData) {
//     try {
//       setSubmitting(true);
//       setError(null);
//       setMessage(null);
//       setCreatedAwb("");

//       if (!firebaseUser) {
//         setError("You must be signed in to create an AWB.");
//         return;
//       }

//       const headers = await buildAuthHeaders(firebaseUser);
//       const body = mapFormToCreateBody(data);

//       const res = await fetch("/api/logistics/awb/create", {
//         method: "POST",
//         headers,
//         body: JSON.stringify(body),
//       });

//       const json = (await res.json()) as ApiResponse;

//       if (!res.ok || !json.success) {
//         const msg =
//           !json.success && json.error?.message
//             ? json.error.message
//             : `Create failed (${res.status})`;
//         setError(msg);
//         return;
//       }

//       const awb = json.data?.awb || "";
//       setCreatedAwb(awb);
//       setMessage(json.message || "AWB created successfully.");

//       if (awb) {
//         // Optional: navigate after short delay
//         // router.push(`/admin/logistics/awb/${encodeURIComponent(awb)}`);
//       }
//     } catch (e) {
//       console.error("Booking submit error:", e);
//       setError(
//         e instanceof Error ? e.message : "Unable to create AWB. Try again.",
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   if (authLoading) {
//     return (
//       <div className="flex min-h-[40vh] items-center justify-center gap-2 text-slate-600">
//         <Loader2 className="h-5 w-5 animate-spin" />
//         Loading…
//       </div>
//     );
//   }

//   return (
//     <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-6">
//       {/* Header */}
//       <div className="flex flex-wrap items-center justify-between gap-3">
//         <div>
//           <div className="mb-1 flex items-center gap-2 text-sm text-slate-500">
//             <Link
//               href={ROUTES.ADMIN_LOGISTICS_AWB || "/admin/logistics/awb"}
//               className="inline-flex items-center gap-1 hover:text-slate-800"
//             >
//               <ArrowLeft className="h-4 w-4" />
//               AWBs
//             </Link>
//             <span>/</span>
//             <span>Booking</span>
//           </div>
//           <h1 className="text-xl font-bold text-slate-900 md:text-2xl">
//             AWB Booking / Entry
//           </h1>
//           <p className="mt-0.5 text-sm text-slate-500">
//             Create shipment, calculate charges, and start tracking.
//           </p>
//         </div>

//         {accountCode ? (
//           <div className="rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-sm font-semibold text-teal-900">
//             Account: {accountCode}
//           </div>
//         ) : null}
//       </div>

//       {/* Success */}
//       {createdAwb ? (
//         <div className="flex flex-wrap items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
//           <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
//           <div className="flex-1">
//             <p className="font-semibold">AWB created</p>
//             <p className="mt-1 font-mono text-lg">{createdAwb}</p>
//             {message ? (
//               <p className="mt-1 text-sm text-emerald-800">{message}</p>
//             ) : null}
//             <div className="mt-3 flex flex-wrap gap-2">
//               <Link
//                 href={`/admin/logistics/awb/${encodeURIComponent(createdAwb)}`}
//                 className="rounded-lg bg-emerald-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-800"
//               >
//                 Open AWB
//               </Link>
//               <Link
//                 href={`/admin/logistics/tracking/matrix`}
//                 className="rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-sm font-medium text-emerald-900"
//               >
//                 Tracking matrix
//               </Link>
//               <button
//                 type="button"
//                 onClick={() => {
//                   setCreatedAwb("");
//                   setMessage(null);
//                 }}
//                 className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700"
//               >
//                 Book another
//               </button>
//             </div>
//           </div>
//         </div>
//       ) : null}

//       {/* Error */}
//       {error ? (
//         <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
//           {error}
//         </div>
//       ) : null}

//       {/* Form */}
//       <AWBBookingForm
//         defaultAccountCode={accountCode}
//         canManageFuelSurcharge={canManageFuelSurcharge}
//         onSubmit={handleSubmit}
//       />

//       {submitting ? (
//         <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/20">
//           <div className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 shadow-lg">
//             <Loader2 className="h-5 w-5 animate-spin text-teal-700" />
//             <span className="text-sm font-medium text-slate-800">
//               Creating AWB…
//             </span>
//           </div>
//         </div>
//       ) : null}
//     </div>
//   );
// }

// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";

// import { useAuth } from "@/context/AuthContext";
// import AWBBookingForm, {
//   type AWBBookingData,
// } from "@/components/logistics/AWBBookingForm";
// import { ROUTES } from "@/utils/constants";

// type ApiResponse =
//   | {
//       success: true;
//       data?: {
//         awb?: string;
//         documentId?: string;
//         [key: string]: unknown;
//       };
//       message?: string;
//     }
//   | {
//       success: false;
//       error: {
//         code: string;
//         message: string;
//       };
//     };

// async function buildAuthHeaders(
//   firebaseUser: {
//     getIdToken: (force?: boolean) => Promise<string>;
//   } | null,
// ): Promise<HeadersInit> {
//   const headers: Record<string, string> = {
//     Accept: "application/json",
//     "Content-Type": "application/json",
//   };

//   if (firebaseUser) {
//     const token = await firebaseUser.getIdToken(true);
//     headers.Authorization = `Bearer ${token}`;
//   }

//   return headers;
// }

// function deriveServiceType(
//   product: string,
//   destination: string,
// ): string {
//   const p = (product || "").toUpperCase();
//   const d = (destination || "").toUpperCase();

//   if (
//     p.includes("INTERNATIONAL") ||
//     ["USA", "UK", "UAE", "CANADA", "AUSTRALIA", "U.S.A"].some(
//       (x) => d.includes(x),
//     )
//   ) {
//     return "INTERNATIONAL";
//   }

//   if (p.includes("CARGO") || p.includes("FREIGHT")) {
//     return "CARGO";
//   }

//   if (p.includes("EXPRESS")) {
//     return "EXPRESS";
//   }

//   return "DOMESTIC";
// }

// /** Map rich form → current create API body */
// function mapFormToCreateBody(data: AWBBookingData) {
//   return {
//     customerId: data.customerId || data.customerCode || "WALKIN",

//     senderId: "WALKIN_SENDER",

//     receiverId: "WALKIN_RECEIVER",

//     customerName: data.customerName,

//     customerCode: data.customerCode,

//     accountCode: data.accountCode,

//     origin:
//       data.origin ||
//       data.shipper.city ||
//       data.shipper.pincode,

//     destination:
//       data.destination ||
//       data.consignee.city ||
//       data.consignee.country,

//     serviceType: deriveServiceType(
//       data.product,
//       data.destination,
//     ),

//     product: data.product,

//     vendor: data.vendor,

//     serviceId:
//       data.service ||
//       data.product ||
//       "SELF",

//     service: data.service,

//     shipmentDate: data.bookDate,

//     description:
//       data.content ||
//       data.instruction,

//     shipper: data.shipper,

//     consignee: data.consignee,

//     pieces: (data.pieces || []).map((p, i) => ({
//       quantity: Number(p.quantity) || 1,
//       actualWeightKg: Number(p.weightKg) || 0,
//       lengthCm: Number(p.lengthCm) || 0,
//       widthCm: Number(p.widthCm) || 0,
//       heightCm: Number(p.heightCm) || 0,
//       description:
//         p.description?.trim() ||
//         `Piece ${i + 1}`,
//     })),

//     gstin:
//       data.shipper.gstin ||
//       undefined,

//     csbType: data.csbType,

//     termOfInvoice: data.termOfInvoice,

//     exportReason: data.exportReason,

//     invoiceNo: data.invoiceNo,

//     invoiceDate: data.invoiceDate,

//     items: data.items,

//     freight:
//       data.charges?.freight ?? 0,

//     fuelSurcharge:
//       data.charges?.fuelSurcharge ?? 0,

//     otherCharges:
//       (data.charges?.otherCharges ?? 0) +
//       (data.charges?.contractCharges ?? 0) +
//       (data.charges?.surcharge ?? 0),

//     discount:
//       data.charges?.discount ?? 0,

//     gstRate: 18,

//     paymentType: data.paymentType,

//     referenceNo: data.referenceNo,

//     commercial: data.commercial,

//     oda: data.oda,

//     medicalCharges: data.medicalCharges,

//     totalPieces: data.totalPieces,

//     packageType: data.packageType,

//     actualWeight: data.actualWeight,

//     volumetricWeight: data.volumetricWeight,

//     chargeableWeight: data.chargeableWeight,

//     shipmentValue: data.shipmentValue,

//     currency: data.currency,
//   };
// }

// export default function BookingPage() {
//   const { firebaseUser, user, loading: authLoading } =
//     useAuth();

//   const [submitting, setSubmitting] =
//     useState(false);

//   const [createdAwb, setCreatedAwb] =
//     useState("");

//   const [error, setError] =
//     useState<string | null>(null);

//   const [message, setMessage] =
//     useState<string | null>(null);

//   /*
//    * Get and normalize user role.
//    *
//    * Allowed:
//    * ADMIN
//    * SUPER_ADMIN
//    *
//    * Not allowed:
//    * VIEWER
//    */
//   const role = String(
//     (user as { role?: string } | null)?.role || "",
//   )
//     .trim()
//     .toUpperCase();

//   /*
//    * Only ADMIN and SUPER_ADMIN
//    * can create/add AWBs.
//    */
//   const canCreateAwb =
//     role === "ADMIN" ||
//     role === "SUPER_ADMIN";

//   const accountCode =
//     (user as {
//       accountCode?: string;
//       coLoaderCode?: string;
//     } | null)?.accountCode ||
//     (user as {
//       coLoaderCode?: string;
//     } | null)?.coLoaderCode ||
//     "";

//   /*
//    * Only ADMIN and SUPER_ADMIN
//    * can manage fuel surcharge.
//    */
//   const canManageFuelSurcharge =
//     role === "SUPER_ADMIN" ||
//     role === "ADMIN";

//   async function handleSubmit(
//     data: AWBBookingData,
//   ) {
//     /*
//      * Extra role protection.
//      * VIEWER cannot submit the form.
//      */
//     if (!canCreateAwb) {
//       setError(
//         "You do not have permission to create an AWB. Only ADMIN and SUPER_ADMIN users can create AWBs.",
//       );
//       return;
//     }

//     try {
//       setSubmitting(true);
//       setError(null);
//       setMessage(null);
//       setCreatedAwb("");

//       if (!firebaseUser) {
//         setError(
//           "You must be signed in to create an AWB.",
//         );
//         return;
//       }

//       const headers =
//         await buildAuthHeaders(firebaseUser);

//       const body =
//         mapFormToCreateBody(data);

//       const res = await fetch(
//         "/api/logistics/awb/create",
//         {
//           method: "POST",
//           headers,
//           body: JSON.stringify(body),
//         },
//       );

//       const json =
//         (await res.json()) as ApiResponse;

//       if (!res.ok || !json.success) {
//         const msg =
//           !json.success &&
//           json.error?.message
//             ? json.error.message
//             : `Create failed (${res.status})`;

//         setError(msg);
//         return;
//       }

//       const awb =
//         json.data?.awb || "";

//       setCreatedAwb(awb);

//       setMessage(
//         json.message ||
//           "AWB created successfully.",
//       );
//     } catch (e) {
//       console.error(
//         "Booking submit error:",
//         e,
//       );

//       setError(
//         e instanceof Error
//           ? e.message
//           : "Unable to create AWB. Try again.",
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   if (authLoading) {
//     return (
//       <div className="flex min-h-[40vh] items-center justify-center gap-2 text-slate-600">
//         <Loader2 className="h-5 w-5 animate-spin" />
//         Loading…
//       </div>
//     );
//   }

//   return (
//     <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-6">

//       {/* Header */}
//       <div className="flex flex-wrap items-center justify-between gap-3">
//         <div>
//           <div className="mb-1 flex items-center gap-2 text-sm text-slate-500">
//             <Link
//               href={
//                 ROUTES.ADMIN_LOGISTICS_AWB ||
//                 "/admin/logistics/awb"
//               }
//               className="inline-flex items-center gap-1 hover:text-slate-800"
//             >
//               <ArrowLeft className="h-4 w-4" />
//               AWBs
//             </Link>

//             <span>/</span>

//             <span>Booking</span>
//           </div>

//           <h1 className="text-xl font-bold text-slate-900 md:text-2xl">
//             AWB Booking / Entry
//           </h1>

//           <p className="mt-0.5 text-sm text-slate-500">
//             Create shipment, calculate charges,
//             and start tracking.
//           </p>

//           {role ? (
//             <p className="mt-1 text-xs text-slate-400">
//               Signed in as:{" "}
//               <span className="font-semibold">
//                 {role}
//               </span>
//             </p>
//           ) : null}
//         </div>

//         {accountCode ? (
//           <div className="rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-sm font-semibold text-teal-900">
//             Account: {accountCode}
//           </div>
//         ) : null}
//       </div>

//       {/* Permission message for VIEWER */}
//       {!canCreateAwb ? (
//         <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
//           <div className="flex items-start gap-3">
//             <div className="mt-0.5 text-amber-600">
//               ⚠
//             </div>

//             <div>
//               <h2 className="font-semibold text-amber-900">
//                 Booking access restricted
//               </h2>

//               <p className="mt-1 text-sm text-amber-800">
//                 Your current role is{" "}
//                 <strong>
//                   {role || "VIEWER"}
//                 </strong>
//                 . Only{" "}
//                 <strong>ADMIN</strong> and{" "}
//                 <strong>SUPER_ADMIN</strong>{" "}
//                 users can add or create AWBs.
//               </p>

//               <p className="mt-1 text-sm text-amber-800">
//                 You can still view existing AWBs.
//               </p>
//             </div>
//           </div>
//         </div>
//       ) : null}

//       {/* Success */}
//       {createdAwb ? (
//         <div className="flex flex-wrap items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
//           <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />

//           <div className="flex-1">
//             <p className="font-semibold">
//               AWB created
//             </p>

//             <p className="mt-1 font-mono text-lg">
//               {createdAwb}
//             </p>

//             {message ? (
//               <p className="mt-1 text-sm text-emerald-800">
//                 {message}
//               </p>
//             ) : null}

//             <div className="mt-3 flex flex-wrap gap-2">
//               <Link
//                 href={`/admin/logistics/awb/${encodeURIComponent(
//                   createdAwb,
//                 )}`}
//                 className="rounded-lg bg-emerald-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-800"
//               >
//                 Open AWB
//               </Link>

//               <Link
//                 href="/admin/logistics/tracking/matrix"
//                 className="rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-sm font-medium text-emerald-900"
//               >
//                 Tracking matrix
//               </Link>

//               <button
//                 type="button"
//                 onClick={() => {
//                   setCreatedAwb("");
//                   setMessage(null);
//                 }}
//                 className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700"
//               >
//                 Book another
//               </button>
//             </div>
//           </div>
//         </div>
//       ) : null}

//       {/* Error */}
//       {error ? (
//         <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
//           {error}
//         </div>
//       ) : null}

//       {/* Booking Form */}
//       {canCreateAwb ? (
//         <AWBBookingForm
//           defaultAccountCode={accountCode}
//           canManageFuelSurcharge={
//             canManageFuelSurcharge
//           }
//           onSubmit={handleSubmit}
//         />
//       ) : (
//         <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
//           <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl">
//             🔒
//           </div>

//           <h2 className="mt-4 text-lg font-bold text-slate-900">
//             AWB creation is restricted
//           </h2>

//           <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
//             You do not have permission to create
//             a new AWB. Please contact an ADMIN or
//             SUPER_ADMIN if you need to create a
//             shipment.
//           </p>

//           <Link
//             href={
//               ROUTES.ADMIN_LOGISTICS_AWB ||
//               "/admin/logistics/awb"
//             }
//             className="mt-5 inline-flex rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
//           >
//             View Existing AWBs
//           </Link>
//         </div>
//       )}

//       {/* Submitting Overlay */}
//       {submitting ? (
//         <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/20">
//           <div className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 shadow-lg">
//             <Loader2 className="h-5 w-5 animate-spin text-teal-700" />

//             <span className="text-sm font-medium text-slate-800">
//               Creating AWB…
//             </span>
//           </div>
//         </div>
//       ) : null}
//     </div>
//   );
// }

// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";

// import { useAuth } from "@/context/AuthContext";
// import { can } from "@/lib/permissions";
// import AWBBookingForm, {
//   type AWBBookingData,
// } from "@/components/logistics/AWBBookingForm";
// import { ROUTES } from "@/utils/constants";

// type ApiResponse =
//   | {
//       success: true;
//       data?: {
//         awb?: string;
//         documentId?: string;
//         [key: string]: unknown;
//       };
//       message?: string;
//     }
//   | {
//       success: false;
//       error: {
//         code: string;
//         message: string;
//       };
//     };

// async function buildAuthHeaders(
//   firebaseUser: {
//     getIdToken: (force?: boolean) => Promise<string>;
//   } | null,
// ): Promise<HeadersInit> {
//   const headers: Record<string, string> = {
//     Accept: "application/json",
//     "Content-Type": "application/json",
//   };

//   if (firebaseUser) {
//     const token = await firebaseUser.getIdToken(true);
//     headers.Authorization = `Bearer ${token}`;
//   }

//   return headers;
// }

// function deriveServiceType(product: string, destination: string): string {
//   const p = (product || "").toUpperCase();
//   const d = (destination || "").toUpperCase();

//   if (
//     p.includes("INTERNATIONAL") ||
//     ["USA", "UK", "UAE", "CANADA", "AUSTRALIA", "U.S.A"].some((x) =>
//       d.includes(x),
//     )
//   ) {
//     return "INTERNATIONAL";
//   }

//   if (p.includes("CARGO") || p.includes("FREIGHT")) {
//     return "CARGO";
//   }

//   if (p.includes("EXPRESS")) {
//     return "EXPRESS";
//   }

//   return "DOMESTIC";
// }

// /** Map rich form → current create API body */
// function mapFormToCreateBody(data: AWBBookingData) {
//   return {
//     customerId: data.customerId || data.customerCode || "WALKIN",
//     senderId: "WALKIN_SENDER",
//     receiverId: "WALKIN_RECEIVER",
//     customerName: data.customerName,
//     customerCode: data.customerCode,
//     accountCode: data.accountCode,
//     origin: data.origin || data.shipper.city || data.shipper.pincode,
//     destination:
//       data.destination || data.consignee.city || data.consignee.country,
//     serviceType: deriveServiceType(data.product, data.destination),
//     product: data.product,
//     vendor: data.vendor,
//     serviceId: data.service || data.product || "SELF",
//     service: data.service,
//     shipmentDate: data.bookDate,
//     description: data.content || data.instruction,
//     shipper: data.shipper,
//     consignee: data.consignee,
//     pieces: (data.pieces || []).map((p, i) => ({
//       quantity: Number(p.quantity) || 1,
//       actualWeightKg: Number(p.weightKg) || 0,
//       lengthCm: Number(p.lengthCm) || 0,
//       widthCm: Number(p.widthCm) || 0,
//       heightCm: Number(p.heightCm) || 0,
//       description: p.description?.trim() || `Piece ${i + 1}`,
//     })),
//     gstin: data.shipper.gstin || undefined,
//     csbType: data.csbType,
//     termOfInvoice: data.termOfInvoice,
//     exportReason: data.exportReason,
//     invoiceNo: data.invoiceNo,
//     invoiceDate: data.invoiceDate,
//     items: data.items,
//     freight: data.charges?.freight ?? 0,
//     fuelSurcharge: data.charges?.fuelSurcharge ?? 0,
//     otherCharges:
//       (data.charges?.otherCharges ?? 0) +
//       (data.charges?.contractCharges ?? 0) +
//       (data.charges?.surcharge ?? 0),
//     discount: data.charges?.discount ?? 0,
//     gstRate: 18,
//     paymentType: data.paymentType,
//     referenceNo: data.referenceNo,
//     commercial: data.commercial,
//     oda: data.oda,
//     medicalCharges: data.medicalCharges,
//     totalPieces: data.totalPieces,
//     packageType: data.packageType,
//     actualWeight: data.actualWeight,
//     volumetricWeight: data.volumetricWeight,
//     chargeableWeight: data.chargeableWeight,
//     shipmentValue: data.shipmentValue,
//     currency: data.currency,
//   };
// }

// export default function BookingPage() {
//   const { firebaseUser, user, loading: authLoading } = useAuth();

//   const [submitting, setSubmitting] = useState(false);
//   const [createdAwb, setCreatedAwb] = useState("");
//   const [error, setError] = useState<string | null>(null);
//   const [message, setMessage] = useState<string | null>(null);

//   const permUser = {
//     userId: user?.userId ?? "",
//     role: user?.role ?? null,
//   };

//   const canCreateAwb = can(permUser, "LOGISTICS_AWB_CREATE");
//   const canManageFuelSurcharge = can(
//     permUser,
//     "LOGISTICS_FUEL_SURCHARGE_MANAGE",
//   );

//   const role = String(user?.role || "").trim().toUpperCase();

//   const accountCode =
//     (user as { accountCode?: string; coLoaderCode?: string } | null)
//       ?.accountCode ||
//     (user as { coLoaderCode?: string } | null)?.coLoaderCode ||
//     "";

//   async function handleSubmit(data: AWBBookingData) {
//     if (!canCreateAwb) {
//       setError("You do not have permission to create an AWB.");
//       return;
//     }

//     try {
//       setSubmitting(true);
//       setError(null);
//       setMessage(null);
//       setCreatedAwb("");

//       if (!firebaseUser) {
//         setError("You must be signed in to create an AWB.");
//         return;
//       }

//       const headers = await buildAuthHeaders(firebaseUser);
//       const body = mapFormToCreateBody(data);

//       const res = await fetch("/api/logistics/awb/create", {
//         method: "POST",
//         headers,
//         body: JSON.stringify(body),
//       });

//       const json = (await res.json()) as ApiResponse;

//       if (!res.ok || !json.success) {
//         const msg =
//           !json.success && json.error?.message
//             ? json.error.message
//             : `Create failed (${res.status})`;
//         setError(msg);
//         return;
//       }

//       const awb = json.data?.awb || "";
//       setCreatedAwb(awb);
//       setMessage(json.message || "AWB created successfully.");
//     } catch (e) {
//       console.error("Booking submit error:", e);
//       setError(
//         e instanceof Error ? e.message : "Unable to create AWB. Try again.",
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   if (authLoading) {
//     return (
//       <div className="flex min-h-[40vh] items-center justify-center gap-2 text-slate-600">
//         <Loader2 className="h-5 w-5 animate-spin" />
//         Loading…
//       </div>
//     );
//   }

//   return (
//     <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-6">
//       <div className="flex flex-wrap items-center justify-between gap-3">
//         <div>
//           <div className="mb-1 flex items-center gap-2 text-sm text-slate-500">
//             <Link
//               href={ROUTES.ADMIN_LOGISTICS_AWB || "/admin/logistics/awb"}
//               className="inline-flex items-center gap-1 hover:text-slate-800"
//             >
//               <ArrowLeft className="h-4 w-4" />
//               AWBs
//             </Link>
//             <span>/</span>
//             <span>Booking</span>
//           </div>

//           <h1 className="text-xl font-bold text-slate-900 md:text-2xl">
//             AWB Booking / Entry
//           </h1>

//           <p className="mt-0.5 text-sm text-slate-500">
//             Create shipment, calculate charges, and start tracking.
//           </p>

//           {role ? (
//             <p className="mt-1 text-xs text-slate-400">
//               Signed in as: <span className="font-semibold">{role}</span>
//             </p>
//           ) : null}
//         </div>

//         {accountCode ? (
//           <div className="rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-sm font-semibold text-teal-900">
//             Account: {accountCode}
//           </div>
//         ) : null}
//       </div>

//       {!canCreateAwb ? (
//         <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
//           <div className="flex items-start gap-3">
//             <div className="mt-0.5 text-amber-600">⚠</div>
//             <div>
//               <h2 className="font-semibold text-amber-900">
//                 Booking access restricted
//               </h2>
//               <p className="mt-1 text-sm text-amber-800">
//                 Your role does not include{" "}
//                 <strong>LOGISTICS_AWB_CREATE</strong>. You cannot create AWBs.
//               </p>
//               <p className="mt-1 text-sm text-amber-800">
//                 You can still view existing AWBs if you have view permission.
//               </p>
//             </div>
//           </div>
//         </div>
//       ) : null}

//       {createdAwb ? (
//         <div className="flex flex-wrap items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
//           <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
//           <div className="flex-1">
//             <p className="font-semibold">AWB created</p>
//             <p className="mt-1 font-mono text-lg">{createdAwb}</p>
//             {message ? (
//               <p className="mt-1 text-sm text-emerald-800">{message}</p>
//             ) : null}
//             <div className="mt-3 flex flex-wrap gap-2">
//               <Link
//                 href={`/admin/logistics/awb/${encodeURIComponent(createdAwb)}`}
//                 className="rounded-lg bg-emerald-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-800"
//               >
//                 Open AWB
//               </Link>
//               <Link
//                 href="/admin/logistics/tracking/matrix"
//                 className="rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-sm font-medium text-emerald-900"
//               >
//                 Tracking matrix
//               </Link>
//               <button
//                 type="button"
//                 onClick={() => {
//                   setCreatedAwb("");
//                   setMessage(null);
//                 }}
//                 className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700"
//               >
//                 Book another
//               </button>
//             </div>
//           </div>
//         </div>
//       ) : null}

//       {error ? (
//         <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
//           {error}
//         </div>
//       ) : null}

//       {canCreateAwb ? (
//         <AWBBookingForm
//           defaultAccountCode={accountCode}
//           canManageFuelSurcharge={canManageFuelSurcharge}
//           onSubmit={handleSubmit}
//         />
//       ) : (
//         <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
//           <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl">
//             🔒
//           </div>
//           <h2 className="mt-4 text-lg font-bold text-slate-900">
//             AWB creation is restricted
//           </h2>
//           <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
//             AWB create permission required. Contact an administrator if you need
//             booking access.
//           </p>
//           <Link
//             href={ROUTES.ADMIN_LOGISTICS_AWB || "/admin/logistics/awb"}
//             className="mt-5 inline-flex rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
//           >
//             View Existing AWBs
//           </Link>
//         </div>
//       )}

//       {submitting ? (
//         <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/20">
//           <div className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 shadow-lg">
//             <Loader2 className="h-5 w-5 animate-spin text-teal-700" />
//             <span className="text-sm font-medium text-slate-800">
//               Creating AWB…
//             </span>
//           </div>
//         </div>
//       ) : null}
//     </div>
//   );
// }

// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { useSearchParams } from "next/navigation";
// import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";

// import { useAuth } from "@/context/AuthContext";
// import { can } from "@/lib/permissions";
// import AWBBookingForm, {
//   type AWBBookingData,
// } from "@/components/logistics/AWBBookingForm";
// import { ROUTES } from "@/utils/constants";

// type ApiResponse =
//   | {
//       success: true;
//       data?: {
//         awb?: string;
//         documentId?: string;
//         results?: Record<string, unknown>[];
//         [key: string]: unknown;
//       };
//       message?: string;
//     }
//   | {
//       success: false;
//       error: {
//         code: string;
//         message: string;
//       };
//     };

// async function buildAuthHeaders(
//   firebaseUser: {
//     getIdToken: (force?: boolean) => Promise<string>;
//   } | null,
// ): Promise<HeadersInit> {
//   const headers: Record<string, string> = {
//     Accept: "application/json",
//     "Content-Type": "application/json",
//   };

//   if (firebaseUser) {
//     const token = await firebaseUser.getIdToken(true);
//     headers.Authorization = `Bearer ${token}`;
//   }

//   return headers;
// }

// function deriveServiceType(product: string, destination: string): string {
//   const p = (product || "").toUpperCase();
//   const d = (destination || "").toUpperCase();

//   if (
//     p.includes("INTERNATIONAL") ||
//     ["USA", "UK", "UAE", "CANADA", "AUSTRALIA", "U.S.A"].some((x) =>
//       d.includes(x),
//     )
//   ) {
//     return "INTERNATIONAL";
//   }

//   if (p.includes("CARGO") || p.includes("FREIGHT")) {
//     return "CARGO";
//   }

//   if (p.includes("EXPRESS")) {
//     return "EXPRESS";
//   }

//   return "DOMESTIC";
// }

// function asRecord(value: unknown): Record<string, unknown> {
//   if (value && typeof value === "object" && !Array.isArray(value)) {
//     return value as Record<string, unknown>;
//   }
//   return {};
// }

// function str(value: unknown, fallback = ""): string {
//   if (value == null) return fallback;
//   const s = String(value).trim();
//   if (s === "—" || s === "--" || s === "-") return fallback;
//   return s;
// }

// function num(value: unknown, fallback = 0): number {
//   const n = Number(value);
//   return Number.isFinite(n) ? n : fallback;
// }

// function asCurrency(value: unknown): "INR" | "USD" {
//   return String(value || "INR").toUpperCase() === "USD" ? "USD" : "INR";
// }

// /** API AWB document → form shape */
// function mapAwbDocToForm(
//   raw: Record<string, unknown>,
// ): Partial<AWBBookingData> {
//   const shipper = asRecord(raw.shipper);
//   const consignee = asRecord(raw.consignee);
//   const charges = asRecord(raw.charges);

//   const piecesRaw = Array.isArray(raw.pieces) ? raw.pieces : [];
//   const pieces = piecesRaw.map((p, i) => {
//     const row = asRecord(p);
//     const dims = asRecord(row.dimensions);
//     return {
//       quantity: num(row.quantity, 1),
//       weightKg: num(
//         row.weightKg ?? row.actualWeightKg ?? row.actualWeight,
//         0,
//       ),
//       lengthCm: num(row.lengthCm ?? dims.length, 0),
//       widthCm: num(row.widthCm ?? dims.width, 0),
//       heightCm: num(row.heightCm ?? dims.height, 0),
//       description: str(row.description, `Piece ${i + 1}`),
//     };
//   });

//   const itemsRaw = Array.isArray(raw.items) ? raw.items : [];
//   const items = itemsRaw.map((item, i) => {
//     const row = asRecord(item);
//     return {
//       description: str(row.description, `Item ${i + 1}`),
//       quantity: num(row.quantity, 1),
//       rate: num(row.rate ?? row.unitRate, 0),
//       amount: num(row.amount, 0),
//       hsCode: str(row.hsCode),
//       shopName: str(row.shopName),
//       shopAddress: str(row.shopAddress),
//     };
//   });

//   const fallbackPieces =
//     pieces.length > 0
//       ? pieces
//       : [
//           {
//             quantity: num(raw.totalPieces, 1) || 1,
//             weightKg: num(raw.actualWeight, 0),
//             lengthCm: 0,
//             widthCm: 0,
//             heightCm: 0,
//             description: "Piece 1",
//           },
//         ];

//   const additionalCharges = Array.isArray(charges.additionalCharges)
//     ? charges.additionalCharges
//     : [];

//     return {
//       customerId: str(raw.customerId),
//       customerName: str(raw.customerName),
//       customerCode: str(raw.customerCode),
//       accountCode: str(raw.accountCode),
//       origin: str(raw.origin),
//       originCode: str(raw.originCode),
//       destination: str(raw.destination),
//       destinationCode: str(raw.destinationCode),
//       product: str(raw.product ?? raw.serviceType),
//       vendor: str(raw.vendor),
//       service: str(raw.service ?? raw.serviceId) || "SELF",
//       bookDate: str(raw.shipmentDate ?? raw.bookDate).slice(0, 10) || undefined,
//       content: str(raw.description ?? raw.content),
//       instruction: str(raw.instruction),
//       shipper: {
//         name: str(shipper.name ?? shipper.companyName ?? raw.senderName),
//         addressLine1: str(
//           shipper.addressLine1 ?? shipper.address ?? raw.senderAddress,
//         ),
//         addressLine2: str(shipper.addressLine2),
//         city: str(shipper.city ?? raw.senderCity),
//         state: str(shipper.state ?? raw.senderState),
//         pincode: str(shipper.pincode ?? raw.senderPincode),
//         country: str(shipper.country ?? raw.senderCountry, "India"),
//         phone: str(shipper.phone ?? raw.senderPhone),
//         email: str(shipper.email),
//         gstin: str(shipper.gstin ?? raw.senderTaxId ?? raw.gstin),
//       },
//       consignee: {
//         name: str(
//           consignee.name ?? consignee.companyName ?? raw.receiverName,
//         ),
//         addressLine1: str(
//           consignee.addressLine1 ??
//             consignee.address ??
//             raw.receiverAddress,
//         ),
//         addressLine2: str(consignee.addressLine2),
//         city: str(consignee.city ?? raw.receiverCity),
//         state: str(consignee.state ?? raw.receiverState),
//         pincode: str(consignee.pincode ?? raw.receiverPincode),
//         country: str(consignee.country ?? raw.receiverCountry, "USA"),
//         phone: str(consignee.phone ?? raw.receiverPhone),
//         email: str(consignee.email),
//       },
//       pieces: fallbackPieces as unknown as AWBBookingData["pieces"],
//       items: items as unknown as AWBBookingData["items"],
//       csbType: str(raw.csbType) || "CSB4",
//       termOfInvoice: str(raw.termOfInvoice) || "CIF",
//       exportReason:
//         str(raw.exportReason) || "UNSOLICITED GIFT - NOT FOR SALE",
//       gstInvoice: Boolean(raw.gstInvoice),
//       invoiceNo: str(raw.invoiceNo),
//       invoiceDate: str(raw.invoiceDate).slice(0, 10) || undefined,
//       departmentNo: str(raw.departmentNo),
//       format: str(raw.format) || "performainv1",
//       charges: {
//         freight: num(charges.freight ?? raw.freight, 0),
//         fuelSurcharge: num(charges.fuelSurcharge ?? raw.fuelSurcharge, 0),
//         additionalCharges:
//           additionalCharges as unknown as AWBBookingData["charges"]["additionalCharges"],
//         otherCharges: num(charges.otherCharges ?? raw.otherCharges, 0),
//         contractCharges: num(charges.contractCharges, 0),
//         surcharge: num(charges.surcharge, 0),
//         discount: num(charges.discount ?? raw.discount, 0),
//         cgst: num(charges.cgst, 0),
//         sgst: num(charges.sgst, 0),
//         igst: num(charges.igst ?? charges.tax ?? raw.tax, 0),
//       },
//       paymentType: str(raw.paymentType) || "Credit",
//       referenceNo: str(raw.referenceNo ?? raw.awb),
//       commercial: Boolean(raw.commercial),
//       oda: Boolean(raw.oda),
//       medicalCharges: Boolean(raw.medicalCharges),
//       totalPieces: num(raw.totalPieces, fallbackPieces.length || 1),
//       packageType: str(raw.packageType) || "PKT",
//       actualWeight: num(raw.actualWeight, 0),
//       volumetricWeight: num(raw.volumetricWeight, 0),
//       chargeableWeight: num(raw.chargeableWeight, 0),
//       shipmentValue: num(raw.shipmentValue ?? raw.declaredValue, 0),
//       currency: asCurrency(raw.currency),
//     };
//   }
// /** Map rich form → current create API body */
// function mapFormToCreateBody(data: AWBBookingData) {
//   return {
//     customerId: data.customerId || data.customerCode || "WALKIN",
//     senderId: "WALKIN_SENDER",
//     receiverId: "WALKIN_RECEIVER",
//     customerName: data.customerName,
//     customerCode: data.customerCode,
//     accountCode: data.accountCode,
//     origin: data.origin || data.shipper.city || data.shipper.pincode,
//     destination:
//       data.destination || data.consignee.city || data.consignee.country,
//     serviceType: deriveServiceType(data.product, data.destination),
//     product: data.product,
//     vendor: data.vendor,
//     serviceId: data.service || data.product || "SELF",
//     service: data.service,
//     shipmentDate: data.bookDate,
//     description: data.content || data.instruction,
//     shipper: data.shipper,
//     consignee: data.consignee,
//     pieces: (data.pieces || []).map((p, i) => ({
//       quantity: Number(p.quantity) || 1,
//       actualWeightKg: Number(p.weightKg) || 0,
//       lengthCm: Number(p.lengthCm) || 0,
//       widthCm: Number(p.widthCm) || 0,
//       heightCm: Number(p.heightCm) || 0,
//       description: p.description?.trim() || `Piece ${i + 1}`,
//     })),
//     gstin: data.shipper.gstin || undefined,
//     csbType: data.csbType,
//     termOfInvoice: data.termOfInvoice,
//     exportReason: data.exportReason,
//     invoiceNo: data.invoiceNo,
//     invoiceDate: data.invoiceDate,
//     items: data.items,
//     freight: data.charges?.freight ?? 0,
//     fuelSurcharge: data.charges?.fuelSurcharge ?? 0,
//     otherCharges:
//       (data.charges?.otherCharges ?? 0) +
//       (data.charges?.contractCharges ?? 0) +
//       (data.charges?.surcharge ?? 0),
//     discount: data.charges?.discount ?? 0,
//     gstRate: 18,
//     paymentType: data.paymentType,
//     referenceNo: data.referenceNo,
//     commercial: data.commercial,
//     oda: data.oda,
//     medicalCharges: data.medicalCharges,
//     totalPieces: data.totalPieces,
//     packageType: data.packageType,
//     actualWeight: data.actualWeight,
//     volumetricWeight: data.volumetricWeight,
//     chargeableWeight: data.chargeableWeight,
//     shipmentValue: data.shipmentValue,
//     currency: data.currency,
//   };
// }

// export default function BookingPage() {
//   const searchParams = useSearchParams();
//   const editAwb = (searchParams.get("awb") || "").trim();

//   const { firebaseUser, user, loading: authLoading } = useAuth();

//   const [submitting, setSubmitting] = useState(false);
//   const [createdAwb, setCreatedAwb] = useState("");
//   const [error, setError] = useState<string | null>(null);
//   const [message, setMessage] = useState<string | null>(null);

//   const [loadingAwb, setLoadingAwb] = useState(Boolean(editAwb));
//   const [initialData, setInitialData] =
//     useState<Partial<AWBBookingData> | null>(null);

//   const permUser = {
//     userId: user?.userId ?? "",
//     role: user?.role ?? null,
//   };

//   const canCreateAwb = can(permUser, "LOGISTICS_AWB_CREATE");
//   const canUpdateAwb = can(permUser, "LOGISTICS_AWB_UPDATE");
//   const canManageFuelSurcharge = can(
//     permUser,
//     "LOGISTICS_FUEL_SURCHARGE_MANAGE",
//   );

//   const role = String(user?.role || "").trim().toUpperCase();

//   const accountCode =
//     (user as { accountCode?: string; coLoaderCode?: string } | null)
//       ?.accountCode ||
//     (user as { coLoaderCode?: string } | null)?.coLoaderCode ||
//     "";

//   useEffect(() => {
//     if (authLoading) return;
//     if (!editAwb) {
//       setLoadingAwb(false);
//       setInitialData(null);
//       return;
//     }

//     let cancelled = false;

//     async function loadExisting() {
//       try {
//         setLoadingAwb(true);
//         setError(null);

//         if (!firebaseUser) {
//           throw new Error("Authentication is required to load AWB.");
//         }

//         if (!can(permUser, "LOGISTICS_AWB_VIEW") && !canUpdateAwb) {
//           throw new Error("You do not have permission to load this AWB.");
//         }

//         const headers = await buildAuthHeaders(firebaseUser);
//         const res = await fetch(
//           `/api/logistics/awb/search?awb=${encodeURIComponent(editAwb)}&limit=1`,
//           {
//             method: "GET",
//             headers,
//             cache: "no-store",
//           },
//         );

//         const json = (await res.json()) as ApiResponse;

//         if (!res.ok || !json.success) {
//           throw new Error(
//             !json.success
//               ? json.error.message
//               : "Failed to load AWB for editing.",
//           );
//         }

//         const list = Array.isArray(json.data?.results)
//           ? json.data.results
//           : [];

//         if (list.length === 0) {
//           throw new Error(`AWB ${editAwb} was not found.`);
//         }

//         if (!cancelled) {
//           setInitialData(
//             mapAwbDocToForm(list[0] as Record<string, unknown>),
//           );
//         }
//       } catch (e) {
//         if (!cancelled) {
//           setInitialData(null);
//           setError(
//             e instanceof Error
//               ? e.message
//               : "Failed to load AWB for editing.",
//           );
//         }
//       } finally {
//         if (!cancelled) setLoadingAwb(false);
//       }
//     }

//     loadExisting();
//     return () => {
//       cancelled = true;
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [authLoading, firebaseUser, editAwb]);

//   async function handleSubmit(data: AWBBookingData) {
//     if (!canCreateAwb && !canUpdateAwb) {
//       setError("You do not have permission to create or update an AWB.");
//       return;
//     }

//     try {
//       setSubmitting(true);
//       setError(null);
//       setMessage(null);
//       setCreatedAwb("");

//       if (!firebaseUser) {
//         setError("You must be signed in to create an AWB.");
//         return;
//       }

//       const headers = await buildAuthHeaders(firebaseUser);
//       const body = mapFormToCreateBody(data);

//       if (editAwb) {
//         (body as Record<string, unknown>).awb = editAwb;
//         (body as Record<string, unknown>).existingAwb = editAwb;
//       }

//       const res = await fetch("/api/logistics/awb/create", {
//         method: "POST",
//         headers,
//         body: JSON.stringify(body),
//       });

//       const json = (await res.json()) as ApiResponse;

//       if (!res.ok || !json.success) {
//         const msg =
//           !json.success && json.error?.message
//             ? json.error.message
//             : `Create failed (${res.status})`;
//         setError(msg);
//         return;
//       }

//       const awb = json.data?.awb || editAwb || "";
//       setCreatedAwb(awb);
//       setMessage(
//         json.message ||
//           (editAwb
//             ? "AWB updated successfully."
//             : "AWB created successfully."),
//       );
//     } catch (e) {
//       console.error("Booking submit error:", e);
//       setError(
//         e instanceof Error ? e.message : "Unable to create AWB. Try again.",
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   if (authLoading) {
//     return (
//       <div className="flex min-h-[40vh] items-center justify-center gap-2 text-slate-600">
//         <Loader2 className="h-5 w-5 animate-spin" />
//         Loading…
//       </div>
//     );
//   }

//   const canUseForm = canCreateAwb || (Boolean(editAwb) && canUpdateAwb);

//   return (
//     <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-6">
//       <div className="flex flex-wrap items-center justify-between gap-3">
//         <div>
//           <div className="mb-1 flex items-center gap-2 text-sm text-slate-500">
//             <Link
//               href={ROUTES.ADMIN_LOGISTICS_AWB || "/admin/logistics/awb"}
//               className="inline-flex items-center gap-1 hover:text-slate-800"
//             >
//               <ArrowLeft className="h-4 w-4" />
//               AWBs
//             </Link>
//             <span>/</span>
//             <span>{editAwb ? "Update booking" : "Booking"}</span>
//           </div>

//           <h1 className="text-xl font-bold text-slate-900 md:text-2xl">
//             {editAwb ? `Update AWB · ${editAwb}` : "AWB Booking / Entry"}
//           </h1>

//           <p className="mt-0.5 text-sm text-slate-500">
//             {editAwb
//               ? "Review and update shipment details for this AWB."
//               : "Create shipment, calculate charges, and start tracking."}
//           </p>

//           {role ? (
//             <p className="mt-1 text-xs text-slate-400">
//               Signed in as: <span className="font-semibold">{role}</span>
//             </p>
//           ) : null}
//         </div>

//         {accountCode ? (
//           <div className="rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-sm font-semibold text-teal-900">
//             Account: {accountCode}
//           </div>
//         ) : null}
//       </div>

//       {!canUseForm ? (
//         <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
//           <h2 className="font-semibold text-amber-900">
//             Booking access restricted
//           </h2>
//           <p className="mt-1 text-sm text-amber-800">
//             Required permission:{" "}
//             <strong>
//               {editAwb ? "LOGISTICS_AWB_UPDATE" : "LOGISTICS_AWB_CREATE"}
//             </strong>
//             .
//           </p>
//         </div>
//       ) : null}

//       {createdAwb ? (
//         <div className="flex flex-wrap items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
//           <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
//           <div className="flex-1">
//             <p className="font-semibold">
//               {editAwb ? "AWB saved" : "AWB created"}
//             </p>
//             <p className="mt-1 font-mono text-lg">{createdAwb}</p>
//             {message ? (
//               <p className="mt-1 text-sm text-emerald-800">{message}</p>
//             ) : null}
//             <div className="mt-3 flex flex-wrap gap-2">
//               <Link
//                 href={`/admin/logistics/awb/${encodeURIComponent(createdAwb)}`}
//                 className="rounded-lg bg-emerald-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-800"
//               >
//                 Open AWB
//               </Link>
//               <Link
//                 href="/admin/logistics/tracking/matrix"
//                 className="rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-sm font-medium text-emerald-900"
//               >
//                 Tracking matrix
//               </Link>
//               <button
//                 type="button"
//                 onClick={() => {
//                   setCreatedAwb("");
//                   setMessage(null);
//                 }}
//                 className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700"
//               >
//                 Book another
//               </button>
//             </div>
//           </div>
//         </div>
//       ) : null}

//       {error ? (
//         <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
//           {error}
//         </div>
//       ) : null}

//       {canUseForm && loadingAwb ? (
//         <div className="flex min-h-[30vh] items-center justify-center gap-2 text-slate-600">
//           <Loader2 className="h-5 w-5 animate-spin" />
//           Loading AWB {editAwb}…
//         </div>
//       ) : null}

//       {canUseForm && !loadingAwb ? (
//         <AWBBookingForm
//           key={editAwb || "new"}
//           defaultAccountCode={accountCode}
//           canManageCharges={canManageFuelSurcharge}
//           initialValue={initialData}
//           editAwb={editAwb || undefined}
//           onSubmit={handleSubmit}
//         />
//       ) : null}

//       {!canUseForm ? (
//         <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
//           <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl">
//             🔒
//           </div>
//           <h2 className="mt-4 text-lg font-bold text-slate-900">
//             AWB booking is restricted
//           </h2>
//           <Link
//             href={ROUTES.ADMIN_LOGISTICS_AWB || "/admin/logistics/awb"}
//             className="mt-5 inline-flex rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
//           >
//             View Existing AWBs
//           </Link>
//         </div>
//       ) : null}

//       {submitting ? (
//         <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/20">
//           <div className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 shadow-lg">
//             <Loader2 className="h-5 w-5 animate-spin text-teal-700" />
//             <span className="text-sm font-medium text-slate-800">
//               {editAwb ? "Saving AWB…" : "Creating AWB…"}
//             </span>
//           </div>
//         </div>
//       ) : null}
//     </div>
//   );
// }

// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { useSearchParams } from "next/navigation";
// import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";

// import { useAuth } from "@/context/AuthContext";
// import { can } from "@/lib/permissions";
// import AWBBookingForm, {
//   type AWBBookingData,
// } from "@/components/logistics/AWBBookingForm";
// import { ROUTES } from "@/utils/constants";

// type ApiResponse =
//   | {
//       success: true;
//       data?: {
//         awb?: string;
//         documentId?: string;
//         results?: Record<string, unknown>[];
//         [key: string]: unknown;
//       };
//       message?: string;
//     }
//   | {
//       success: false;
//       error: {
//         code: string;
//         message: string;
//       };
//     };

// async function buildAuthHeaders(
//   firebaseUser: {
//     getIdToken: (force?: boolean) => Promise<string>;
//   } | null,
// ): Promise<HeadersInit> {
//   const headers: Record<string, string> = {
//     Accept: "application/json",
//     "Content-Type": "application/json",
//   };

//   if (firebaseUser) {
//     const token = await firebaseUser.getIdToken(true);
//     headers.Authorization = `Bearer ${token}`;
//   }

//   return headers;
// }

// function deriveServiceType(product: string, destination: string): string {
//   const p = (product || "").toUpperCase();
//   const d = (destination || "").toUpperCase();

//   if (
//     p.includes("INTERNATIONAL") ||
//     ["USA", "UK", "UAE", "CANADA", "AUSTRALIA", "U.S.A"].some((x) =>
//       d.includes(x),
//     )
//   ) {
//     return "INTERNATIONAL";
//   }

//   if (p.includes("CARGO") || p.includes("FREIGHT")) {
//     return "CARGO";
//   }

//   if (p.includes("EXPRESS")) {
//     return "EXPRESS";
//   }

//   return "DOMESTIC";
// }

// function asRecord(value: unknown): Record<string, unknown> {
//   if (value && typeof value === "object" && !Array.isArray(value)) {
//     return value as Record<string, unknown>;
//   }
//   return {};
// }

// function str(value: unknown, fallback = ""): string {
//   if (value == null) return fallback;
//   const s = String(value).trim();
//   if (s === "—" || s === "--" || s === "-") return fallback;
//   return s;
// }

// function num(value: unknown, fallback = 0): number {
//   const n = Number(value);
//   return Number.isFinite(n) ? n : fallback;
// }

// function asCurrency(value: unknown): "INR" | "USD" {
//   return String(value || "INR").toUpperCase() === "USD" ? "USD" : "INR";
// }

// function mapAwbDocToForm(
//   raw: Record<string, unknown>,
// ): Partial<AWBBookingData> {
//   const shipper = asRecord(raw.shipper);
//   const consignee = asRecord(raw.consignee);
//   const charges = asRecord(raw.charges);

//   const piecesRaw = Array.isArray(raw.pieces) ? raw.pieces : [];
//   const pieces = piecesRaw.map((p, i) => {
//     const row = asRecord(p);
//     const dims = asRecord(row.dimensions);
//     return {
//       quantity: num(row.quantity, 1),
//       weightKg: num(
//         row.weightKg ?? row.actualWeightKg ?? row.actualWeight,
//         0,
//       ),
//       lengthCm: num(row.lengthCm ?? dims.length, 0),
//       widthCm: num(row.widthCm ?? dims.width, 0),
//       heightCm: num(row.heightCm ?? dims.height, 0),
//       description: str(row.description, `Piece ${i + 1}`),
//     };
//   });

//   const itemsRaw = Array.isArray(raw.items) ? raw.items : [];
//   const items = itemsRaw.map((item, i) => {
//     const row = asRecord(item);
//     return {
//       description: str(row.description, `Item ${i + 1}`),
//       quantity: num(row.quantity, 1),
//       rate: num(row.rate ?? row.unitRate, 0),
//       amount: num(row.amount, 0),
//       hsCode: str(row.hsCode),
//       shopName: str(row.shopName),
//       shopAddress: str(row.shopAddress),
//     };
//   });

//   const fallbackPieces =
//     pieces.length > 0
//       ? pieces
//       : [
//           {
//             quantity: num(raw.totalPieces, 1) || 1,
//             weightKg: num(raw.actualWeight, 0),
//             lengthCm: 0,
//             widthCm: 0,
//             heightCm: 0,
//             description: "Piece 1",
//           },
//         ];

//   const additionalCharges = Array.isArray(charges.additionalCharges)
//     ? charges.additionalCharges
//     : [];

//   return {
//     customerId: str(raw.customerId),
//     customerName: str(raw.customerName),
//     customerCode: str(raw.customerCode),
//     accountCode: str(raw.accountCode),
//     origin: str(raw.origin),
//     originCode: str(raw.originCode),
//     destination: str(raw.destination),
//     destinationCode: str(raw.destinationCode),
//     product: str(raw.product ?? raw.serviceType),
//     vendor: str(raw.vendor),
//     service: str(raw.service ?? raw.serviceId) || "SELF",
//     bookDate: str(raw.shipmentDate ?? raw.bookDate).slice(0, 10) || undefined,
//     content: str(raw.description ?? raw.content),
//     instruction: str(raw.instruction),
//     shipper: {
//       name: str(shipper.name ?? shipper.companyName ?? raw.senderName),
//       addressLine1: str(
//         shipper.addressLine1 ?? shipper.address ?? raw.senderAddress,
//       ),
//       addressLine2: str(shipper.addressLine2),
//       city: str(shipper.city ?? raw.senderCity),
//       state: str(shipper.state ?? raw.senderState),
//       pincode: str(shipper.pincode ?? raw.senderPincode),
//       country: str(shipper.country ?? raw.senderCountry, "India"),
//       phone: str(shipper.phone ?? raw.senderPhone),
//       email: str(shipper.email),
//       gstin: str(shipper.gstin ?? raw.senderTaxId ?? raw.gstin),
//     },
//     consignee: {
//       name: str(
//         consignee.name ?? consignee.companyName ?? raw.receiverName,
//       ),
//       addressLine1: str(
//         consignee.addressLine1 ??
//           consignee.address ??
//           raw.receiverAddress,
//       ),
//       addressLine2: str(consignee.addressLine2),
//       city: str(consignee.city ?? raw.receiverCity),
//       state: str(consignee.state ?? raw.receiverState),
//       pincode: str(consignee.pincode ?? raw.receiverPincode),
//       country: str(consignee.country ?? raw.receiverCountry, "USA"),
//       phone: str(consignee.phone ?? raw.receiverPhone),
//       email: str(consignee.email),
//     },
//     pieces: fallbackPieces as unknown as AWBBookingData["pieces"],
//     items: items as unknown as AWBBookingData["items"],
//     csbType: str(raw.csbType) || "CSB4",
//     termOfInvoice: str(raw.termOfInvoice) || "CIF",
//     exportReason:
//       str(raw.exportReason) || "UNSOLICITED GIFT - NOT FOR SALE",
//     gstInvoice: Boolean(raw.gstInvoice),
//     invoiceNo: str(raw.invoiceNo),
//     invoiceDate: str(raw.invoiceDate).slice(0, 10) || undefined,
//     departmentNo: str(raw.departmentNo),
//     format: str(raw.format) || "performainv1",
//     charges: {
//       freight: num(charges.freight ?? raw.freight, 0),
//       fuelSurcharge: num(charges.fuelSurcharge ?? raw.fuelSurcharge, 0),
//       additionalCharges:
//         additionalCharges as unknown as AWBBookingData["charges"]["additionalCharges"],
//       otherCharges: num(charges.otherCharges ?? raw.otherCharges, 0),
//       contractCharges: num(charges.contractCharges, 0),
//       surcharge: num(charges.surcharge, 0),
//       discount: num(charges.discount ?? raw.discount, 0),
//       cgst: num(charges.cgst, 0),
//       sgst: num(charges.sgst, 0),
//       igst: num(charges.igst ?? charges.tax ?? raw.tax, 0),
//     },
//     paymentType: str(raw.paymentType) || "Credit",
//     referenceNo: str(raw.referenceNo ?? raw.awb),
//     commercial: Boolean(raw.commercial),
//     oda: Boolean(raw.oda),
//     medicalCharges: Boolean(raw.medicalCharges),
//     totalPieces: num(raw.totalPieces, fallbackPieces.length || 1),
//     packageType: str(raw.packageType) || "PKT",
//     actualWeight: num(raw.actualWeight, 0),
//     volumetricWeight: num(raw.volumetricWeight, 0),
//     chargeableWeight: num(raw.chargeableWeight, 0),
//     shipmentValue: num(raw.shipmentValue ?? raw.declaredValue, 0),
//     currency: asCurrency(raw.currency),
//   };
// }

// function mapFormToCreateBody(data: AWBBookingData) {
//   return {
//     customerId: data.customerId || data.customerCode || "WALKIN",
//     senderId: "WALKIN_SENDER",
//     receiverId: "WALKIN_RECEIVER",
//     customerName: data.customerName,
//     customerCode: data.customerCode,
//     accountCode: data.accountCode,
//     origin: data.origin || data.shipper.city || data.shipper.pincode,
//     destination:
//       data.destination || data.consignee.city || data.consignee.country,
//     serviceType: deriveServiceType(data.product, data.destination),
//     product: data.product,
//     vendor: data.vendor,
//     serviceId: data.service || data.product || "SELF",
//     service: data.service,
//     shipmentDate: data.bookDate,
//     description: data.content || data.instruction,
//     shipper: data.shipper,
//     consignee: data.consignee,
//     pieces: (data.pieces || []).map((p, i) => ({
//       quantity: Number(p.quantity) || 1,
//       actualWeightKg: Number(p.weightKg) || 0,
//       lengthCm: Number(p.lengthCm) || 0,
//       widthCm: Number(p.widthCm) || 0,
//       heightCm: Number(p.heightCm) || 0,
//       description: p.description?.trim() || `Piece ${i + 1}`,
//       division: Number(p.division) || undefined,
//     })),
//     gstin: data.shipper.gstin || undefined,
//     csbType: data.csbType,
//     termOfInvoice: data.termOfInvoice,
//     exportReason: data.exportReason,
//     invoiceNo: data.invoiceNo,
//     invoiceDate: data.invoiceDate,
//     items: data.items,
//     freight: data.charges?.freight ?? 0,
//     fuelSurcharge: data.charges?.fuelSurcharge ?? 0,
//     otherCharges:
//       (data.charges?.otherCharges ?? 0) +
//       (data.charges?.contractCharges ?? 0) +
//       (data.charges?.surcharge ?? 0),
//     discount: data.charges?.discount ?? 0,
//     gstRate: 18,
//     paymentType: data.paymentType,
//     referenceNo: data.referenceNo,
//     commercial: data.commercial,
//     oda: data.oda,
//     medicalCharges: data.medicalCharges,
//     totalPieces: data.totalPieces,
//     packageType: data.packageType,
//     actualWeight: data.actualWeight,
//     volumetricWeight: data.volumetricWeight,
//     chargeableWeight: data.chargeableWeight,
//     shipmentValue: data.shipmentValue,
//     currency: data.currency,
//   };
// }

// export default function BookingPage() {
//   const searchParams = useSearchParams();
//   const editAwb = (searchParams.get("awb") || "").trim();

//   const { firebaseUser, user, loading: authLoading } = useAuth();

//   const [submitting, setSubmitting] = useState(false);
//   const [createdAwb, setCreatedAwb] = useState("");
//   const [error, setError] = useState<string | null>(null);
//   const [message, setMessage] = useState<string | null>(null);

//   const [loadingAwb, setLoadingAwb] = useState(Boolean(editAwb));
//   const [initialData, setInitialData] =
//     useState<Partial<AWBBookingData> | null>(null);

//   const permUser = {
//     userId: user?.userId ?? "",
//     role: user?.role ?? null,
//   };

//   const canCreateAwb = can(permUser, "LOGISTICS_AWB_CREATE");
//   const canUpdateAwb = can(permUser, "LOGISTICS_AWB_UPDATE");
//   const canManageCharges = can(permUser, "LOGISTICS_CHARGE_MANAGE");
//   const canEditProformaRestricted = can(
//     permUser,
//     "LOGISTICS_PROFORMA_RESTRICTED_EDIT",
//   );

//   const role = String(user?.role || "").trim().toUpperCase();

//   const accountCode =
//     (user as { accountCode?: string; coLoaderCode?: string } | null)
//       ?.accountCode ||
//     (user as { coLoaderCode?: string } | null)?.coLoaderCode ||
//     "";

//   useEffect(() => {
//     if (authLoading) return;
//     if (!editAwb) {
//       setLoadingAwb(false);
//       setInitialData(null);
//       return;
//     }

//     let cancelled = false;

//     async function loadExisting() {
//       try {
//         setLoadingAwb(true);
//         setError(null);

//         if (!firebaseUser) {
//           throw new Error("Authentication is required to load AWB.");
//         }

//         if (!can(permUser, "LOGISTICS_AWB_VIEW") && !canUpdateAwb) {
//           throw new Error("You do not have permission to load this AWB.");
//         }

//         const headers = await buildAuthHeaders(firebaseUser);
//         const res = await fetch(
//           `/api/logistics/awb/search?awb=${encodeURIComponent(editAwb)}&limit=1`,
//           {
//             method: "GET",
//             headers,
//             cache: "no-store",
//           },
//         );

//         const json = (await res.json()) as ApiResponse;

//         if (!res.ok || !json.success) {
//           throw new Error(
//             !json.success
//               ? json.error.message
//               : "Failed to load AWB for editing.",
//           );
//         }

//         const list = Array.isArray(json.data?.results)
//           ? json.data.results
//           : [];

//         if (list.length === 0) {
//           throw new Error(`AWB ${editAwb} was not found.`);
//         }

//         if (!cancelled) {
//           setInitialData(
//             mapAwbDocToForm(list[0] as Record<string, unknown>),
//           );
//         }
//       } catch (e) {
//         if (!cancelled) {
//           setInitialData(null);
//           setError(
//             e instanceof Error
//               ? e.message
//               : "Failed to load AWB for editing.",
//           );
//         }
//       } finally {
//         if (!cancelled) setLoadingAwb(false);
//       }
//     }

//     loadExisting();
//     return () => {
//       cancelled = true;
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [authLoading, firebaseUser, editAwb]);

//   async function handleSubmit(data: AWBBookingData) {
//     if (!canCreateAwb && !canUpdateAwb) {
//       setError("You do not have permission to create or update an AWB.");
//       return;
//     }

//     try {
//       setSubmitting(true);
//       setError(null);
//       setMessage(null);
//       setCreatedAwb("");

//       if (!firebaseUser) {
//         setError("You must be signed in to create an AWB.");
//         return;
//       }

//       const headers = await buildAuthHeaders(firebaseUser);
//       const body = mapFormToCreateBody(data);

//       if (editAwb) {
//         (body as Record<string, unknown>).awb = editAwb;
//         (body as Record<string, unknown>).existingAwb = editAwb;
//       }

//       const res = await fetch("/api/logistics/awb/create", {
//         method: "POST",
//         headers,
//         body: JSON.stringify(body),
//       });

//       const json = (await res.json()) as ApiResponse;

//       if (!res.ok || !json.success) {
//         const msg =
//           !json.success && json.error?.message
//             ? json.error.message
//             : `Create failed (${res.status})`;
//         setError(msg);
//         return;
//       }

//       const awb = json.data?.awb || editAwb || "";
//       setCreatedAwb(awb);
//       setMessage(
//         json.message ||
//           (editAwb
//             ? "AWB updated successfully."
//             : "AWB created successfully."),
//       );
//     } catch (e) {
//       console.error("Booking submit error:", e);
//       setError(
//         e instanceof Error ? e.message : "Unable to create AWB. Try again.",
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   if (authLoading) {
//     return (
//       <div className="flex min-h-[40vh] items-center justify-center gap-2 text-slate-600">
//         <Loader2 className="h-5 w-5 animate-spin" />
//         Loading…
//       </div>
//     );
//   }

//   const canUseForm = canCreateAwb || (Boolean(editAwb) && canUpdateAwb);

//   return (
//     <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-6">
//       <div className="flex flex-wrap items-center justify-between gap-3">
//         <div>
//           <div className="mb-1 flex items-center gap-2 text-sm text-slate-500">
//             <Link
//               href={ROUTES.ADMIN_LOGISTICS_AWB || "/admin/logistics/awb"}
//               className="inline-flex items-center gap-1 hover:text-slate-800"
//             >
//               <ArrowLeft className="h-4 w-4" />
//               AWBs
//             </Link>
//             <span>/</span>
//             <span>{editAwb ? "Update booking" : "Booking"}</span>
//           </div>

//           <h1 className="text-xl font-bold text-slate-900 md:text-2xl">
//             {editAwb ? `Update AWB · ${editAwb}` : "AWB Booking / Entry"}
//           </h1>

//           <p className="mt-0.5 text-sm text-slate-500">
//             {editAwb
//               ? "Review and update shipment details for this AWB."
//               : "Create shipment, calculate charges, and start tracking."}
//           </p>

//           {role ? (
//             <p className="mt-1 text-xs text-slate-400">
//               Signed in as: <span className="font-semibold">{role}</span>
//             </p>
//           ) : null}
//         </div>

//         {accountCode ? (
//           <div className="rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-sm font-semibold text-teal-900">
//             Account: {accountCode}
//           </div>
//         ) : null}
//       </div>

//       {!canUseForm ? (
//         <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
//           <h2 className="font-semibold text-amber-900">
//             Booking access restricted
//           </h2>
//           <p className="mt-1 text-sm text-amber-800">
//             Required permission:{" "}
//             <strong>
//               {editAwb ? "LOGISTICS_AWB_UPDATE" : "LOGISTICS_AWB_CREATE"}
//             </strong>
//             .
//           </p>
//         </div>
//       ) : null}

//       {createdAwb ? (
//         <div className="flex flex-wrap items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
//           <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
//           <div className="flex-1">
//             <p className="font-semibold">
//               {editAwb ? "AWB saved" : "AWB created"}
//             </p>
//             <p className="mt-1 font-mono text-lg">{createdAwb}</p>
//             {message ? (
//               <p className="mt-1 text-sm text-emerald-800">{message}</p>
//             ) : null}
//             <div className="mt-3 flex flex-wrap gap-2">
//               <Link
//                 href={`/admin/logistics/awb/${encodeURIComponent(createdAwb)}`}
//                 className="rounded-lg bg-emerald-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-800"
//               >
//                 Open AWB
//               </Link>
//               <Link
//                 href="/admin/logistics/tracking/matrix"
//                 className="rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-sm font-medium text-emerald-900"
//               >
//                 Tracking matrix
//               </Link>
//               <button
//                 type="button"
//                 onClick={() => {
//                   setCreatedAwb("");
//                   setMessage(null);
//                 }}
//                 className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700"
//               >
//                 Book another
//               </button>
//             </div>
//           </div>
//         </div>
//       ) : null}

//       {error ? (
//         <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
//           {error}
//         </div>
//       ) : null}

//       {canUseForm && loadingAwb ? (
//         <div className="flex min-h-[30vh] items-center justify-center gap-2 text-slate-600">
//           <Loader2 className="h-5 w-5 animate-spin" />
//           Loading AWB {editAwb}…
//         </div>
//       ) : null}

//       {canUseForm && !loadingAwb ? (
//         <AWBBookingForm
//           key={editAwb || "new"}
//           defaultAccountCode={accountCode}
//           canManageCharges={canManageCharges}
//           canEditProformaRestricted={canEditProformaRestricted}
//           initialValue={initialData}
//           editAwb={editAwb || undefined}
//           onSubmit={handleSubmit}
//         />
//       ) : null}

//       {!canUseForm ? (
//         <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
//           <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl">
//             🔒
//           </div>
//           <h2 className="mt-4 text-lg font-bold text-slate-900">
//             AWB booking is restricted
//           </h2>
//           <Link
//             href={ROUTES.ADMIN_LOGISTICS_AWB || "/admin/logistics/awb"}
//             className="mt-5 inline-flex rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
//           >
//             View Existing AWBs
//           </Link>
//         </div>
//       ) : null}

//       {submitting ? (
//         <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/20">
//           <div className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 shadow-lg">
//             <Loader2 className="h-5 w-5 animate-spin text-teal-700" />
//             <span className="text-sm font-medium text-slate-800">
//               {editAwb ? "Saving AWB…" : "Creating AWB…"}
//             </span>
//           </div>
//         </div>
//       ) : null}
//     </div>
//   );
// }

// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { useSearchParams } from "next/navigation";
// import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";

// import { useAuth } from "@/context/AuthContext";
// import { can } from "@/lib/permissions";
// import AWBBookingForm, {
//   type AWBBookingData,
// } from "@/components/logistics/AWBBookingForm";
// import { ROUTES } from "@/utils/constants";

// type ApiResponse =
//   | {
//       success: true;
//       data?: {
//         awb?: string;
//         documentId?: string;
//         results?: Record<string, unknown>[];
//         [key: string]: unknown;
//       };
//       message?: string;
//     }
//   | {
//       success: false;
//       error: {
//         code: string;
//         message: string;
//       };
//     };

// async function buildAuthHeaders(
//   firebaseUser: {
//     getIdToken: (force?: boolean) => Promise<string>;
//   } | null,
// ): Promise<HeadersInit> {
//   const headers: Record<string, string> = {
//     Accept: "application/json",
//     "Content-Type": "application/json",
//   };

//   if (firebaseUser) {
//     const token = await firebaseUser.getIdToken(true);
//     headers.Authorization = `Bearer ${token}`;
//   }

//   return headers;
// }

// function deriveServiceType(product: string, destination: string): string {
//   const p = (product || "").toUpperCase();
//   const d = (destination || "").toUpperCase();

//   if (
//     p.includes("INTERNATIONAL") ||
//     ["USA", "UK", "UAE", "CANADA", "AUSTRALIA", "U.S.A"].some((x) =>
//       d.includes(x),
//     )
//   ) {
//     return "INTERNATIONAL";
//   }

//   if (p.includes("CARGO") || p.includes("FREIGHT")) {
//     return "CARGO";
//   }

//   if (p.includes("EXPRESS")) {
//     return "EXPRESS";
//   }

//   return "DOMESTIC";
// }

// function asRecord(value: unknown): Record<string, unknown> {
//   if (value && typeof value === "object" && !Array.isArray(value)) {
//     return value as Record<string, unknown>;
//   }
//   return {};
// }

// function str(value: unknown, fallback = ""): string {
//   if (value == null) return fallback;
//   const s = String(value).trim();
//   if (s === "—" || s === "--" || s === "-") return fallback;
//   return s;
// }

// function num(value: unknown, fallback = 0): number {
//   const n = Number(value);
//   return Number.isFinite(n) ? n : fallback;
// }

// function asCurrency(value: unknown): "INR" | "USD" {
//   return String(value || "INR").toUpperCase() === "USD" ? "USD" : "INR";
// }

// function mapAwbDocToForm(
//   raw: Record<string, unknown>,
// ): Partial<AWBBookingData> {
//   const shipper = asRecord(raw.shipper);
//   const consignee = asRecord(raw.consignee);
//   const charges = asRecord(raw.charges);

//   const piecesRaw = Array.isArray(raw.pieces) ? raw.pieces : [];
//   const pieces = piecesRaw.map((p, i) => {
//     const row = asRecord(p);
//     const dims = asRecord(row.dimensions);
//     return {
//       quantity: num(row.quantity, 1),
//       weightKg: num(
//         row.weightKg ?? row.actualWeightKg ?? row.actualWeight,
//         0,
//       ),
//       lengthCm: num(row.lengthCm ?? dims.length, 0),
//       widthCm: num(row.widthCm ?? dims.width, 0),
//       heightCm: num(row.heightCm ?? dims.height, 0),
//       description: str(row.description, `Piece ${i + 1}`),
//     };
//   });

//   const itemsRaw = Array.isArray(raw.items) ? raw.items : [];
//   const items = itemsRaw.map((item, i) => {
//     const row = asRecord(item);
//     return {
//       description: str(row.description, `Item ${i + 1}`),
//       quantity: num(row.quantity, 1),
//       rate: num(row.rate ?? row.unitRate, 0),
//       amount: num(row.amount, 0),
//       hsCode: str(row.hsCode),
//       shopName: str(row.shopName),
//       shopAddress: str(row.shopAddress),
//     };
//   });

//   const fallbackPieces =
//     pieces.length > 0
//       ? pieces
//       : [
//           {
//             quantity: num(raw.totalPieces, 1) || 1,
//             weightKg: num(raw.actualWeight, 0),
//             lengthCm: 0,
//             widthCm: 0,
//             heightCm: 0,
//             description: "Piece 1",
//           },
//         ];

//   const additionalCharges = Array.isArray(charges.additionalCharges)
//     ? charges.additionalCharges
//     : [];

//   return {
//     customerId: str(raw.customerId),
//     customerName: str(raw.customerName),
//     customerCode: str(raw.customerCode),
//     accountCode: str(raw.accountCode),
//     origin: str(raw.origin),
//     originCode: str(raw.originCode),
//     destination: str(raw.destination),
//     destinationCode: str(raw.destinationCode),
//     product: str(raw.product ?? raw.serviceType),
//     vendor: str(raw.vendor),
//     service: str(raw.service ?? raw.serviceId) || "SELF",
//     bookDate: str(raw.shipmentDate ?? raw.bookDate).slice(0, 10) || undefined,
//     content: str(raw.description ?? raw.content),
//     instruction: str(raw.instruction),
//     shipper: {
//       name: str(shipper.name ?? shipper.companyName ?? raw.senderName),
//       addressLine1: str(
//         shipper.addressLine1 ?? shipper.address ?? raw.senderAddress,
//       ),
//       addressLine2: str(shipper.addressLine2),
//       city: str(shipper.city ?? raw.senderCity),
//       state: str(shipper.state ?? raw.senderState),
//       pincode: str(shipper.pincode ?? raw.senderPincode),
//       country: str(shipper.country ?? raw.senderCountry, "India"),
//       phone: str(shipper.phone ?? raw.senderPhone),
//       email: str(shipper.email),
//       gstin: str(shipper.gstin ?? raw.senderTaxId ?? raw.gstin),
//     },
//     consignee: {
//       name: str(
//         consignee.name ?? consignee.companyName ?? raw.receiverName,
//       ),
//       addressLine1: str(
//         consignee.addressLine1 ??
//           consignee.address ??
//           raw.receiverAddress,
//       ),
//       addressLine2: str(consignee.addressLine2),
//       city: str(consignee.city ?? raw.receiverCity),
//       state: str(consignee.state ?? raw.receiverState),
//       pincode: str(consignee.pincode ?? raw.receiverPincode),
//       country: str(consignee.country ?? raw.receiverCountry, "USA"),
//       phone: str(consignee.phone ?? raw.receiverPhone),
//       email: str(consignee.email),
//     },
//     pieces: fallbackPieces as unknown as AWBBookingData["pieces"],
//     items: items as unknown as AWBBookingData["items"],
//     csbType: str(raw.csbType) || "CSB4",
//     termOfInvoice: str(raw.termOfInvoice) || "CIF",
//     exportReason:
//       str(raw.exportReason) || "UNSOLICITED GIFT - NOT FOR SALE",
//     gstInvoice: Boolean(raw.gstInvoice),
//     invoiceNo: str(raw.invoiceNo),
//     invoiceDate: str(raw.invoiceDate).slice(0, 10) || undefined,
//     departmentNo: str(raw.departmentNo),
//     format: str(raw.format) || "performainv1",
//     charges: {
//       freight: num(charges.freight ?? raw.freight, 0),
//       fuelSurcharge: num(charges.fuelSurcharge ?? raw.fuelSurcharge, 0),
//       additionalCharges:
//         additionalCharges as unknown as AWBBookingData["charges"]["additionalCharges"],
//       otherCharges: num(charges.otherCharges ?? raw.otherCharges, 0),
//       contractCharges: num(charges.contractCharges, 0),
//       surcharge: num(charges.surcharge, 0),
//       discount: num(charges.discount ?? raw.discount, 0),
//       cgst: num(charges.cgst, 0),
//       sgst: num(charges.sgst, 0),
//       igst: num(charges.igst ?? charges.tax ?? raw.tax, 0),
//     },
//     paymentType: str(raw.paymentType) || "Credit",
//     referenceNo: str(raw.referenceNo ?? raw.awb),
//     commercial: Boolean(raw.commercial),
//     oda: Boolean(raw.oda),
//     medicalCharges: Boolean(raw.medicalCharges),
//     totalPieces: num(raw.totalPieces, fallbackPieces.length || 1),
//     packageType: str(raw.packageType) || "PKT",
//     actualWeight: num(raw.actualWeight, 0),
//     volumetricWeight: num(raw.volumetricWeight, 0),
//     chargeableWeight: num(raw.chargeableWeight, 0),
//     shipmentValue: num(raw.shipmentValue ?? raw.declaredValue, 0),
//     currency: asCurrency(raw.currency),
//   };
// }

// function mapFormToCreateBody(data: AWBBookingData) {
//   return {
//     customerId: data.customerId || data.accountCode || "WALKIN",
//     senderId: "WALKIN_SENDER",
//     receiverId: "WALKIN_RECEIVER",
//     customerName: data.customerName,
//     customerCode: data.customerCode || data.accountCode || "",
//     accountCode: data.accountCode,
//     origin: data.origin || data.shipper.city || data.shipper.pincode,
//     destination:
//       data.destination || data.consignee.city || data.consignee.country,
//     serviceType: deriveServiceType(data.product, data.destination),
//     product: data.product,
//     vendor: data.vendor,
//     serviceId: data.service || data.product || "SELF",
//     service: data.service,
//     shipmentDate: data.bookDate,
//     description: data.content || data.instruction,
//     shipper: data.shipper,
//     consignee: data.consignee,
//     pieces: (data.pieces || []).map((p, i) => ({
//       quantity: Number(p.quantity) || 1,
//       actualWeightKg: Number(p.weightKg) || 0,
//       lengthCm: Number(p.lengthCm) || 0,
//       widthCm: Number(p.widthCm) || 0,
//       heightCm: Number(p.heightCm) || 0,
//       description: p.description?.trim() || `Piece ${i + 1}`,
//       division: Number(p.division) || undefined,
//     })),
//     gstin: data.shipper.gstin || undefined,
//     csbType: data.csbType,
//     termOfInvoice: data.termOfInvoice,
//     exportReason: data.exportReason,
//     invoiceNo: data.invoiceNo,
//     invoiceDate: data.invoiceDate,
//     items: data.items,
//     freight: data.charges?.freight ?? 0,
//     fuelSurcharge: data.charges?.fuelSurcharge ?? 0,
//     otherCharges:
//       (data.charges?.otherCharges ?? 0) +
//       (data.charges?.contractCharges ?? 0) +
//       (data.charges?.surcharge ?? 0),
//     discount: data.charges?.discount ?? 0,
//     gstRate: 18,
//     paymentType: data.paymentType,
//     referenceNo: data.referenceNo,
//     commercial: data.commercial,
//     oda: data.oda,
//     medicalCharges: data.medicalCharges,
//     totalPieces: data.totalPieces,
//     packageType: data.packageType,
//     actualWeight: data.actualWeight,
//     volumetricWeight: data.volumetricWeight,
//     chargeableWeight: data.chargeableWeight,
//     shipmentValue: data.shipmentValue,
//     currency: data.currency,
//   };
// }

// export default function BookingPage() {
//   const searchParams = useSearchParams();
//   const editAwb = (searchParams.get("awb") || "").trim();

//   const { firebaseUser, user, loading: authLoading } = useAuth();

//   const [submitting, setSubmitting] = useState(false);
//   const [createdAwb, setCreatedAwb] = useState("");
//   const [error, setError] = useState<string | null>(null);
//   const [message, setMessage] = useState<string | null>(null);

//   const [loadingAwb, setLoadingAwb] = useState(Boolean(editAwb));
//   const [initialData, setInitialData] =
//     useState<Partial<AWBBookingData> | null>(null);

//   const permUser = {
//     userId: user?.userId ?? "",
//     role: user?.role ?? null,
//   };

//   const canCreateAwb = can(permUser, "LOGISTICS_AWB_CREATE");
//   const canUpdateAwb = can(permUser, "LOGISTICS_AWB_UPDATE");
//   const canManageCharges = can(permUser, "LOGISTICS_CHARGE_MANAGE");
//   const canEditProformaRestricted = can(
//     permUser,
//     "LOGISTICS_PROFORMA_RESTRICTED_EDIT",
//   );

//   const role = String(user?.role || "").trim().toUpperCase();
//   const isCoLoader = role === "CO_LOADER";

//   const profile = user as {
//     accountCode?: string;
//     coLoaderCode?: string;
//     coloaderId?: string;
//     coLoaderId?: string;
//     displayName?: string;
//     name?: string;
//     companyName?: string;
//   } | null;

//   // Co-loader hub code from profile; Super Admin → empty
//   const defaultAccountCode = isCoLoader
//     ? profile?.accountCode ||
//       profile?.coLoaderCode ||
//       profile?.coloaderId ||
//       profile?.coLoaderId ||
//       ""
//     : "";

//   // Co-loader client name from profile; Super Admin → empty
//   const defaultClientName = isCoLoader
//     ? profile?.displayName ||
//       profile?.companyName ||
//       profile?.name ||
//       ""
//     : "";

//   const lockAccountFields = isCoLoader;

//   useEffect(() => {
//     if (authLoading) return;
//     if (!editAwb) {
//       setLoadingAwb(false);
//       setInitialData(null);
//       return;
//     }

//     let cancelled = false;

//     async function loadExisting() {
//       try {
//         setLoadingAwb(true);
//         setError(null);

//         if (!firebaseUser) {
//           throw new Error("Authentication is required to load AWB.");
//         }

//         if (!can(permUser, "LOGISTICS_AWB_VIEW") && !canUpdateAwb) {
//           throw new Error("You do not have permission to load this AWB.");
//         }

//         const headers = await buildAuthHeaders(firebaseUser);
//         const res = await fetch(
//           `/api/logistics/awb/search?awb=${encodeURIComponent(editAwb)}&limit=1`,
//           {
//             method: "GET",
//             headers,
//             cache: "no-store",
//           },
//         );

//         const json = (await res.json()) as ApiResponse;

//         if (!res.ok || !json.success) {
//           throw new Error(
//             !json.success
//               ? json.error.message
//               : "Failed to load AWB for editing.",
//           );
//         }

//         const list = Array.isArray(json.data?.results)
//           ? json.data.results
//           : [];

//         if (list.length === 0) {
//           throw new Error(`AWB ${editAwb} was not found.`);
//         }

//         if (!cancelled) {
//           setInitialData(
//             mapAwbDocToForm(list[0] as Record<string, unknown>),
//           );
//         }
//       } catch (e) {
//         if (!cancelled) {
//           setInitialData(null);
//           setError(
//             e instanceof Error
//               ? e.message
//               : "Failed to load AWB for editing.",
//           );
//         }
//       } finally {
//         if (!cancelled) setLoadingAwb(false);
//       }
//     }

//     loadExisting();
//     return () => {
//       cancelled = true;
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [authLoading, firebaseUser, editAwb]);

//   async function handleSubmit(data: AWBBookingData) {
//     if (!canCreateAwb && !canUpdateAwb) {
//       setError("You do not have permission to create or update an AWB.");
//       return;
//     }

//     try {
//       setSubmitting(true);
//       setError(null);
//       setMessage(null);
//       setCreatedAwb("");

//       if (!firebaseUser) {
//         setError("You must be signed in to create an AWB.");
//         return;
//       }

//       const headers = await buildAuthHeaders(firebaseUser);

//       // Force co-loader identity on server payload
//       const safeData: AWBBookingData = lockAccountFields
//         ? {
//             ...data,
//             accountCode: defaultAccountCode || data.accountCode,
//             customerName: defaultClientName || data.customerName,
//           }
//         : data;

//       const body = mapFormToCreateBody(safeData);

//       if (editAwb) {
//         (body as Record<string, unknown>).awb = editAwb;
//         (body as Record<string, unknown>).existingAwb = editAwb;
//       }

//       const res = await fetch("/api/logistics/awb/create", {
//         method: "POST",
//         headers,
//         body: JSON.stringify(body),
//       });

//       const json = (await res.json()) as ApiResponse;

//       if (!res.ok || !json.success) {
//         const msg =
//           !json.success && json.error?.message
//             ? json.error.message
//             : `Create failed (${res.status})`;
//         setError(msg);
//         return;
//       }

//       const awb = json.data?.awb || editAwb || "";
//       setCreatedAwb(awb);
//       setMessage(
//         json.message ||
//           (editAwb
//             ? "AWB updated successfully."
//             : "AWB created successfully."),
//       );
//     } catch (e) {
//       console.error("Booking submit error:", e);
//       setError(
//         e instanceof Error ? e.message : "Unable to create AWB. Try again.",
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   if (authLoading) {
//     return (
//       <div className="flex min-h-[40vh] items-center justify-center gap-2 text-slate-600">
//         <Loader2 className="h-5 w-5 animate-spin" />
//         Loading…
//       </div>
//     );
//   }

//   const canUseForm = canCreateAwb || (Boolean(editAwb) && canUpdateAwb);

//   return (
//     <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-6">
//       <div className="flex flex-wrap items-center justify-between gap-3">
//         <div>
//           <div className="mb-1 flex items-center gap-2 text-sm text-slate-500">
//             <Link
//               href={ROUTES.ADMIN_LOGISTICS_AWB || "/admin/logistics/awb"}
//               className="inline-flex items-center gap-1 hover:text-slate-800"
//             >
//               <ArrowLeft className="h-4 w-4" />
//               AWBs
//             </Link>
//             <span>/</span>
//             <span>{editAwb ? "Update booking" : "Booking"}</span>
//           </div>

//           <h1 className="text-xl font-bold text-slate-900 md:text-2xl">
//             {editAwb ? `Update AWB · ${editAwb}` : "AWB Booking / Entry"}
//           </h1>

//           <p className="mt-0.5 text-sm text-slate-500">
//             {editAwb
//               ? "Review and update shipment details for this AWB."
//               : "Create shipment, calculate charges, and start tracking."}
//           </p>

//           {role ? (
//             <p className="mt-1 text-xs text-slate-400">
//               Signed in as: <span className="font-semibold">{role}</span>
//             </p>
//           ) : null}
//         </div>

//         {isCoLoader && defaultAccountCode ? (
//           <div className="rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-sm font-semibold text-teal-900">
//             Account: {defaultAccountCode}
//             {defaultClientName ? ` · ${defaultClientName}` : ""}
//           </div>
//         ) : null}
//       </div>

//       {!canUseForm ? (
//         <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
//           <h2 className="font-semibold text-amber-900">
//             Booking access restricted
//           </h2>
//           <p className="mt-1 text-sm text-amber-800">
//             Required permission:{" "}
//             <strong>
//               {editAwb ? "LOGISTICS_AWB_UPDATE" : "LOGISTICS_AWB_CREATE"}
//             </strong>
//             .
//           </p>
//         </div>
//       ) : null}

//       {createdAwb ? (
//         <div className="flex flex-wrap items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
//           <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
//           <div className="flex-1">
//             <p className="font-semibold">
//               {editAwb ? "AWB saved" : "AWB created"}
//             </p>
//             <p className="mt-1 font-mono text-lg">{createdAwb}</p>
//             {message ? (
//               <p className="mt-1 text-sm text-emerald-800">{message}</p>
//             ) : null}
//             <div className="mt-3 flex flex-wrap gap-2">
//               <Link
//                 href={`/admin/logistics/awb/${encodeURIComponent(createdAwb)}`}
//                 className="rounded-lg bg-emerald-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-800"
//               >
//                 Open AWB
//               </Link>
//               <Link
//                 href="/admin/logistics/tracking/matrix"
//                 className="rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-sm font-medium text-emerald-900"
//               >
//                 Tracking matrix
//               </Link>
//               <button
//                 type="button"
//                 onClick={() => {
//                   setCreatedAwb("");
//                   setMessage(null);
//                 }}
//                 className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700"
//               >
//                 Book another
//               </button>
//             </div>
//           </div>
//         </div>
//       ) : null}

//       {error ? (
//         <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
//           {error}
//         </div>
//       ) : null}

//       {canUseForm && loadingAwb ? (
//         <div className="flex min-h-[30vh] items-center justify-center gap-2 text-slate-600">
//           <Loader2 className="h-5 w-5 animate-spin" />
//           Loading AWB {editAwb}…
//         </div>
//       ) : null}

//       {canUseForm && !loadingAwb ? (
//         <AWBBookingForm
//           key={editAwb || "new"}
//           defaultAccountCode={defaultAccountCode}
//           defaultClientName={defaultClientName}
//           lockAccountFields={lockAccountFields}
//           canManageCharges={canManageCharges}
//           canEditProformaRestricted={canEditProformaRestricted}
//           initialValue={initialData}
//           editAwb={editAwb || undefined}
//           onSubmit={handleSubmit}
//         />
//       ) : null}

//       {!canUseForm ? (
//         <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
//           <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl">
//             🔒
//           </div>
//           <h2 className="mt-4 text-lg font-bold text-slate-900">
//             AWB booking is restricted
//           </h2>
//           <Link
//             href={ROUTES.ADMIN_LOGISTICS_AWB || "/admin/logistics/awb"}
//             className="mt-5 inline-flex rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
//           >
//             View Existing AWBs
//           </Link>
//         </div>
//       ) : null}

//       {submitting ? (
//         <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/20">
//           <div className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 shadow-lg">
//             <Loader2 className="h-5 w-5 animate-spin text-teal-700" />
//             <span className="text-sm font-medium text-slate-800">
//               {editAwb ? "Saving AWB…" : "Creating AWB…"}
//             </span>
//           </div>
//         </div>
//       ) : null}
//     </div>
//   );
// }

// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { useSearchParams } from "next/navigation";
// import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";

// import { useAuth } from "@/context/AuthContext";
// import { can } from "@/lib/permissions";
// import AWBBookingForm, {
//   type AWBBookingData,
// } from "@/components/logistics/AWBBookingForm";
// import { ROUTES } from "@/utils/constants";

// type ApiResponse =
//   | {
//       success: true;
//       data?: {
//         awb?: string;
//         documentId?: string;
//         results?: Record<string, unknown>[];
//         [key: string]: unknown;
//       };
//       message?: string;
//     }
//   | {
//       success: false;
//       error: {
//         code: string;
//         message: string;
//       };
//     };

// async function buildAuthHeaders(
//   firebaseUser: {
//     getIdToken: (force?: boolean) => Promise<string>;
//   } | null,
// ): Promise<HeadersInit> {
//   const headers: Record<string, string> = {
//     Accept: "application/json",
//     "Content-Type": "application/json",
//   };

//   if (firebaseUser) {
//     const token = await firebaseUser.getIdToken(true);
//     headers.Authorization = `Bearer ${token}`;
//   }

//   return headers;
// }

// function deriveServiceType(product: string, destination: string): string {
//   const p = (product || "").toUpperCase();
//   const d = (destination || "").toUpperCase();

//   if (
//     p.includes("INTERNATIONAL") ||
//     ["USA", "UK", "UAE", "CANADA", "AUSTRALIA", "U.S.A"].some((x) =>
//       d.includes(x),
//     )
//   ) {
//     return "INTERNATIONAL";
//   }

//   if (p.includes("CARGO") || p.includes("FREIGHT")) {
//     return "CARGO";
//   }

//   if (p.includes("EXPRESS")) {
//     return "EXPRESS";
//   }

//   return "DOMESTIC";
// }

// function asRecord(value: unknown): Record<string, unknown> {
//   if (value && typeof value === "object" && !Array.isArray(value)) {
//     return value as Record<string, unknown>;
//   }
//   return {};
// }

// function str(value: unknown, fallback = ""): string {
//   if (value == null) return fallback;
//   const s = String(value).trim();
//   if (s === "—" || s === "--" || s === "-") return fallback;
//   return s;
// }

// function num(value: unknown, fallback = 0): number {
//   const n = Number(value);
//   return Number.isFinite(n) ? n : fallback;
// }

// function asCurrency(value: unknown): "INR" | "USD" {
//   return String(value || "INR").toUpperCase() === "USD" ? "USD" : "INR";
// }

// function mapAwbDocToForm(
//   raw: Record<string, unknown>,
// ): Partial<AWBBookingData> {
//   const shipper = asRecord(raw.shipper);
//   const consignee = asRecord(raw.consignee);
//   const charges = asRecord(raw.charges);

//   const piecesRaw = Array.isArray(raw.pieces) ? raw.pieces : [];
//   const pieces = piecesRaw.map((p, i) => {
//     const row = asRecord(p);
//     const dims = asRecord(row.dimensions);
//     return {
//       quantity: num(row.quantity, 1),
//       weightKg: num(
//         row.weightKg ?? row.actualWeightKg ?? row.actualWeight,
//         0,
//       ),
//       lengthCm: num(row.lengthCm ?? dims.length, 0),
//       widthCm: num(row.widthCm ?? dims.width, 0),
//       heightCm: num(row.heightCm ?? dims.height, 0),
//       description: str(row.description, `Piece ${i + 1}`),
//     };
//   });

//   const itemsRaw = Array.isArray(raw.items) ? raw.items : [];
//   const items = itemsRaw.map((item, i) => {
//     const row = asRecord(item);
//     return {
//       description: str(row.description, `Item ${i + 1}`),
//       quantity: num(row.quantity, 1),
//       rate: num(row.rate ?? row.unitRate, 0),
//       amount: num(row.amount, 0),
//       hsCode: str(row.hsCode),
//       shopName: str(row.shopName),
//       shopAddress: str(row.shopAddress),
//     };
//   });

//   const fallbackPieces =
//     pieces.length > 0
//       ? pieces
//       : [
//           {
//             quantity: num(raw.totalPieces, 1) || 1,
//             weightKg: num(raw.actualWeight, 0),
//             lengthCm: 0,
//             widthCm: 0,
//             heightCm: 0,
//             description: "Piece 1",
//           },
//         ];

//   const additionalCharges = Array.isArray(charges.additionalCharges)
//     ? charges.additionalCharges
//     : [];

//   return {
//     customerId: str(raw.customerId),
//     customerName: str(raw.customerName),
//     customerCode: str(raw.customerCode),
//     accountCode: str(raw.accountCode),
//     origin: str(raw.origin),
//     originCode: str(raw.originCode),
//     destination: str(raw.destination),
//     destinationCode: str(raw.destinationCode),
//     product: str(raw.product ?? raw.serviceType),
//     vendor: str(raw.vendor),
//     service: str(raw.service ?? raw.serviceId) || "SELF",
//     bookDate: str(raw.shipmentDate ?? raw.bookDate).slice(0, 10) || undefined,
//     content: str(raw.description ?? raw.content),
//     instruction: str(raw.instruction),
//     shipper: {
//       name: str(shipper.name ?? shipper.companyName ?? raw.senderName),
//       addressLine1: str(
//         shipper.addressLine1 ?? shipper.address ?? raw.senderAddress,
//       ),
//       addressLine2: str(shipper.addressLine2),
//       city: str(shipper.city ?? raw.senderCity),
//       state: str(shipper.state ?? raw.senderState),
//       pincode: str(shipper.pincode ?? raw.senderPincode),
//       country: str(shipper.country ?? raw.senderCountry, "India"),
//       phone: str(shipper.phone ?? raw.senderPhone),
//       email: str(shipper.email),
//       gstin: str(shipper.gstin ?? raw.senderTaxId ?? raw.gstin),
//     },
//     consignee: {
//       name: str(
//         consignee.name ?? consignee.companyName ?? raw.receiverName,
//       ),
//       addressLine1: str(
//         consignee.addressLine1 ??
//           consignee.address ??
//           raw.receiverAddress,
//       ),
//       addressLine2: str(consignee.addressLine2),
//       city: str(consignee.city ?? raw.receiverCity),
//       state: str(consignee.state ?? raw.receiverState),
//       pincode: str(consignee.pincode ?? raw.receiverPincode),
//       country: str(consignee.country ?? raw.receiverCountry, "USA"),
//       phone: str(consignee.phone ?? raw.receiverPhone),
//       email: str(consignee.email),
//     },
//     pieces: fallbackPieces as unknown as AWBBookingData["pieces"],
//     items: items as unknown as AWBBookingData["items"],
//     csbType: str(raw.csbType) || "CSB4",
//     termOfInvoice: str(raw.termOfInvoice) || "CIF",
//     exportReason:
//       str(raw.exportReason) || "UNSOLICITED GIFT - NOT FOR SALE",
//     gstInvoice: Boolean(raw.gstInvoice),
//     invoiceNo: str(raw.invoiceNo),
//     invoiceDate: str(raw.invoiceDate).slice(0, 10) || undefined,
//     departmentNo: str(raw.departmentNo),
//     format: str(raw.format) || "performainv1",
//     charges: {
//       freight: num(charges.freight ?? raw.freight, 0),
//       fuelSurcharge: num(charges.fuelSurcharge ?? raw.fuelSurcharge, 0),
//       additionalCharges:
//         additionalCharges as unknown as AWBBookingData["charges"]["additionalCharges"],
//       otherCharges: num(charges.otherCharges ?? raw.otherCharges, 0),
//       contractCharges: num(charges.contractCharges, 0),
//       surcharge: num(charges.surcharge, 0),
//       discount: num(charges.discount ?? raw.discount, 0),
//       cgst: num(charges.cgst, 0),
//       sgst: num(charges.sgst, 0),
//       igst: num(charges.igst ?? charges.tax ?? raw.tax, 0),
//     },
//     paymentType: str(raw.paymentType) || "Credit",
//     referenceNo: str(raw.referenceNo ?? raw.awb),
//     commercial: Boolean(raw.commercial),
//     oda: Boolean(raw.oda),
//     medicalCharges: Boolean(raw.medicalCharges),
//     totalPieces: num(raw.totalPieces, fallbackPieces.length || 1),
//     packageType: str(raw.packageType) || "PKT",
//     actualWeight: num(raw.actualWeight, 0),
//     volumetricWeight: num(raw.volumetricWeight, 0),
//     chargeableWeight: num(raw.chargeableWeight, 0),
//     shipmentValue: num(raw.shipmentValue ?? raw.declaredValue, 0),
//     currency: asCurrency(raw.currency),
//   };
// }

// function mapFormToCreateBody(data: AWBBookingData) {
//   return {
//     customerId: data.customerId || data.accountCode || "WALKIN",
//     senderId: "WALKIN_SENDER",
//     receiverId: "WALKIN_RECEIVER",
//     customerName: data.customerName,
//     customerCode: data.customerCode || data.accountCode || "",
//     accountCode: data.accountCode,
//     origin: data.origin || data.shipper.city || data.shipper.pincode,
//     destination:
//       data.destination || data.consignee.city || data.consignee.country,
//     serviceType: deriveServiceType(data.product, data.destination),
//     product: data.product,
//     vendor: data.vendor,
//     serviceId: data.service || data.product || "SELF",
//     service: data.service,
//     shipmentDate: data.bookDate,
//     description: data.content || data.instruction,
//     shipper: data.shipper,
//     consignee: data.consignee,
//     pieces: (data.pieces || []).map((p, i) => ({
//       quantity: Number(p.quantity) || 1,
//       actualWeightKg: Number(p.weightKg) || 0,
//       lengthCm: Number(p.lengthCm) || 0,
//       widthCm: Number(p.widthCm) || 0,
//       heightCm: Number(p.heightCm) || 0,
//       description: p.description?.trim() || `Piece ${i + 1}`,
//       division: Number(p.division) || undefined,
//     })),
//     gstin: data.shipper.gstin || undefined,
//     csbType: data.csbType,
//     termOfInvoice: data.termOfInvoice,
//     exportReason: data.exportReason,
//     invoiceNo: data.invoiceNo,
//     invoiceDate: data.invoiceDate,
//     items: data.items,
//     freight: data.charges?.freight ?? 0,
//     fuelSurcharge: data.charges?.fuelSurcharge ?? 0,
//     otherCharges:
//       (data.charges?.otherCharges ?? 0) +
//       (data.charges?.contractCharges ?? 0) +
//       (data.charges?.surcharge ?? 0),
//     discount: data.charges?.discount ?? 0,
//     gstRate: 18,
//     paymentType: data.paymentType,
//     referenceNo: data.referenceNo,
//     commercial: data.commercial,
//     oda: data.oda,
//     medicalCharges: data.medicalCharges,
//     totalPieces: data.totalPieces,
//     packageType: data.packageType,
//     actualWeight: data.actualWeight,
//     volumetricWeight: data.volumetricWeight,
//     chargeableWeight: data.chargeableWeight,
//     shipmentValue: data.shipmentValue,
//     currency: data.currency,
//   };
// }

// export default function BookingPage() {
//   const searchParams = useSearchParams();
//   const editAwb = (searchParams.get("awb") || "").trim();

//   const { firebaseUser, user, loading: authLoading } = useAuth();

//   const [submitting, setSubmitting] = useState(false);
//   const [createdAwb, setCreatedAwb] = useState("");
//   const [error, setError] = useState<string | null>(null);
//   const [message, setMessage] = useState<string | null>(null);

//   const [loadingAwb, setLoadingAwb] = useState(Boolean(editAwb));
//   const [initialData, setInitialData] =
//     useState<Partial<AWBBookingData> | null>(null);

//   const permUser = {
//     userId: user?.userId ?? "",
//     role: user?.role ?? null,
//   };

//   const canCreateAwb = can(permUser, "LOGISTICS_AWB_CREATE");
//   const canUpdateAwb = can(permUser, "LOGISTICS_AWB_UPDATE");

//   const role = String(user?.role || "").trim().toUpperCase();
//   const isCoLoader = role === "CO_LOADER";
//   const isSuperAdmin = role === "SUPER_ADMIN";

//   // Only Super Admin may set freight / restricted proforma fields
//   const canManageCharges = isSuperAdmin;
//   const canEditProformaRestricted = isSuperAdmin;

//   const profile = user as {
//     accountCode?: string;
//     coLoaderCode?: string;
//     coloaderId?: string;
//     coLoaderId?: string;
//     displayName?: string;
//     name?: string;
//     companyName?: string;
//   } | null;

//   const defaultAccountCode = isCoLoader
//     ? profile?.accountCode ||
//       profile?.coLoaderCode ||
//       profile?.coloaderId ||
//       profile?.coLoaderId ||
//       ""
//     : "";

//   const defaultClientName = isCoLoader
//     ? profile?.displayName ||
//       profile?.companyName ||
//       profile?.name ||
//       ""
//     : "";

//   const lockAccountFields = isCoLoader;

//   useEffect(() => {
//     if (authLoading) return;
//     if (!editAwb) {
//       setLoadingAwb(false);
//       setInitialData(null);
//       return;
//     }

//     let cancelled = false;

//     async function loadExisting() {
//       try {
//         setLoadingAwb(true);
//         setError(null);

//         if (!firebaseUser) {
//           throw new Error("Authentication is required to load AWB.");
//         }

//         if (!can(permUser, "LOGISTICS_AWB_VIEW") && !canUpdateAwb) {
//           throw new Error("You do not have permission to load this AWB.");
//         }

//         const headers = await buildAuthHeaders(firebaseUser);
//         const res = await fetch(
//           `/api/logistics/awb/search?awb=${encodeURIComponent(editAwb)}&limit=1`,
//           {
//             method: "GET",
//             headers,
//             cache: "no-store",
//           },
//         );

//         const json = (await res.json()) as ApiResponse;

//         if (!res.ok || !json.success) {
//           throw new Error(
//             !json.success
//               ? json.error.message
//               : "Failed to load AWB for editing.",
//           );
//         }

//         const list = Array.isArray(json.data?.results)
//           ? json.data.results
//           : [];

//         if (list.length === 0) {
//           throw new Error(`AWB ${editAwb} was not found.`);
//         }

//         if (!cancelled) {
//           setInitialData(
//             mapAwbDocToForm(list[0] as Record<string, unknown>),
//           );
//         }
//       } catch (e) {
//         if (!cancelled) {
//           setInitialData(null);
//           setError(
//             e instanceof Error
//               ? e.message
//               : "Failed to load AWB for editing.",
//           );
//         }
//       } finally {
//         if (!cancelled) setLoadingAwb(false);
//       }
//     }

//     loadExisting();
//     return () => {
//       cancelled = true;
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [authLoading, firebaseUser, editAwb]);

//   async function handleSubmit(data: AWBBookingData) {
//     if (!canCreateAwb && !canUpdateAwb) {
//       setError("You do not have permission to create or update an AWB.");
//       return;
//     }

//     try {
//       setSubmitting(true);
//       setError(null);
//       setMessage(null);
//       setCreatedAwb("");

//       if (!firebaseUser) {
//         setError("You must be signed in to create an AWB.");
//         return;
//       }

//       const headers = await buildAuthHeaders(firebaseUser);

//       const safeData: AWBBookingData = lockAccountFields
//         ? {
//             ...data,
//             accountCode: defaultAccountCode || data.accountCode,
//             customerName: defaultClientName || data.customerName,
//           }
//         : data;

//       const body = mapFormToCreateBody(safeData);

//       if (editAwb) {
//         (body as Record<string, unknown>).awb = editAwb;
//         (body as Record<string, unknown>).existingAwb = editAwb;
//       }

//       const res = await fetch("/api/logistics/awb/create", {
//         method: "POST",
//         headers,
//         body: JSON.stringify(body),
//       });

//       const json = (await res.json()) as ApiResponse;

//       if (!res.ok || !json.success) {
//         const msg =
//           !json.success && json.error?.message
//             ? json.error.message
//             : `Create failed (${res.status})`;
//         setError(msg);
//         return;
//       }

//       const awb = json.data?.awb || editAwb || "";
//       setCreatedAwb(awb);
//       setMessage(
//         json.message ||
//           (editAwb
//             ? "AWB updated successfully."
//             : "AWB created successfully."),
//       );
//     } catch (e) {
//       console.error("Booking submit error:", e);
//       setError(
//         e instanceof Error ? e.message : "Unable to create AWB. Try again.",
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   if (authLoading) {
//     return (
//       <div className="flex min-h-[40vh] items-center justify-center gap-2 text-slate-600">
//         <Loader2 className="h-5 w-5 animate-spin" />
//         Loading…
//       </div>
//     );
//   }

//   const canUseForm = canCreateAwb || (Boolean(editAwb) && canUpdateAwb);

//   return (
//     <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-6">
//       <div className="flex flex-wrap items-center justify-between gap-3">
//         <div>
//           <div className="mb-1 flex items-center gap-2 text-sm text-slate-500">
//             <Link
//               href={ROUTES.ADMIN_LOGISTICS_AWB || "/admin/logistics/awb"}
//               className="inline-flex items-center gap-1 hover:text-slate-800"
//             >
//               <ArrowLeft className="h-4 w-4" />
//               AWBs
//             </Link>
//             <span>/</span>
//             <span>{editAwb ? "Update booking" : "Booking"}</span>
//           </div>

//           <h1 className="text-xl font-bold text-slate-900 md:text-2xl">
//             {editAwb ? `Update AWB · ${editAwb}` : "AWB Booking / Entry"}
//           </h1>

//           <p className="mt-0.5 text-sm text-slate-500">
//             {editAwb
//               ? "Review and update shipment details for this AWB."
//               : "Create shipment, calculate charges, and start tracking."}
//           </p>

//           {role ? (
//             <p className="mt-1 text-xs text-slate-400">
//               Signed in as: <span className="font-semibold">{role}</span>
//             </p>
//           ) : null}
//         </div>

//         {isCoLoader && defaultAccountCode ? (
//           <div className="rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-sm font-semibold text-teal-900">
//             Account: {defaultAccountCode}
//             {defaultClientName ? ` · ${defaultClientName}` : ""}
//           </div>
//         ) : null}
//       </div>

//       {!canUseForm ? (
//         <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
//           <h2 className="font-semibold text-amber-900">
//             Booking access restricted
//           </h2>
//           <p className="mt-1 text-sm text-amber-800">
//             Required permission:{" "}
//             <strong>
//               {editAwb ? "LOGISTICS_AWB_UPDATE" : "LOGISTICS_AWB_CREATE"}
//             </strong>
//             .
//           </p>
//         </div>
//       ) : null}

//       {createdAwb ? (
//         <div className="flex flex-wrap items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
//           <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
//           <div className="flex-1">
//             <p className="font-semibold">
//               {editAwb ? "AWB saved" : "AWB created"}
//             </p>
//             <p className="mt-1 font-mono text-lg">{createdAwb}</p>
//             {message ? (
//               <p className="mt-1 text-sm text-emerald-800">{message}</p>
//             ) : null}
//             <div className="mt-3 flex flex-wrap gap-2">
//               <Link
//                 href={`/admin/logistics/awb/${encodeURIComponent(createdAwb)}`}
//                 className="rounded-lg bg-emerald-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-800"
//               >
//                 Open AWB
//               </Link>
//               <Link
//                 href="/admin/logistics/tracking/matrix"
//                 className="rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-sm font-medium text-emerald-900"
//               >
//                 Tracking matrix
//               </Link>
//               <button
//                 type="button"
//                 onClick={() => {
//                   setCreatedAwb("");
//                   setMessage(null);
//                 }}
//                 className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700"
//               >
//                 Book another
//               </button>
//             </div>
//           </div>
//         </div>
//       ) : null}

//       {error ? (
//         <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
//           {error}
//         </div>
//       ) : null}

//       {canUseForm && loadingAwb ? (
//         <div className="flex min-h-[30vh] items-center justify-center gap-2 text-slate-600">
//           <Loader2 className="h-5 w-5 animate-spin" />
//           Loading AWB {editAwb}…
//         </div>
//       ) : null}

//       {canUseForm && !loadingAwb ? (
//         <AWBBookingForm
//           key={editAwb || "new"}
//           defaultAccountCode={defaultAccountCode}
//           defaultClientName={defaultClientName}
//           lockAccountFields={lockAccountFields}
//           canManageCharges={canManageCharges}
//           canEditProformaRestricted={canEditProformaRestricted}
//           initialValue={initialData}
//           editAwb={editAwb || undefined}
//           onSubmit={handleSubmit}
//         />
//       ) : null}

//       {!canUseForm ? (
//         <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
//           <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl">
//             🔒
//           </div>
//           <h2 className="mt-4 text-lg font-bold text-slate-900">
//             AWB booking is restricted
//           </h2>
//           <Link
//             href={ROUTES.ADMIN_LOGISTICS_AWB || "/admin/logistics/awb"}
//             className="mt-5 inline-flex rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
//           >
//             View Existing AWBs
//           </Link>
//         </div>
//       ) : null}

//       {submitting ? (
//         <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/20">
//           <div className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 shadow-lg">
//             <Loader2 className="h-5 w-5 animate-spin text-teal-700" />
//             <span className="text-sm font-medium text-slate-800">
//               {editAwb ? "Saving AWB…" : "Creating AWB…"}
//             </span>
//           </div>
//         </div>
//       ) : null}
//     </div>
//   );
// }

// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { useSearchParams } from "next/navigation";
// import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";

// import { useAuth } from "@/context/AuthContext";
// import { can } from "@/lib/permissions";
// import AWBBookingForm, {
//   type AWBBookingData,
// } from "@/components/logistics/AWBBookingForm";
// import { ROUTES } from "@/utils/constants";

// type ApiResponse =
//   | {
//       success: true;
//       data?: {
//         awb?: string;
//         documentId?: string;
//         results?: Record<string, unknown>[];
//         [key: string]: unknown;
//       };
//       message?: string;
//     }
//   | {
//       success: false;
//       error: {
//         code: string;
//         message: string;
//       };
//     };

// type CoLoaderMe = {
//   code?: string;
//   contactPerson?: string;
//   name?: string;
//   accountCode?: string;
// };

// async function buildAuthHeaders(
//   firebaseUser: {
//     getIdToken: (force?: boolean) => Promise<string>;
//   } | null,
// ): Promise<HeadersInit> {
//   const headers: Record<string, string> = {
//     Accept: "application/json",
//     "Content-Type": "application/json",
//   };

//   if (firebaseUser) {
//     const token = await firebaseUser.getIdToken(true);
//     headers.Authorization = `Bearer ${token}`;
//   }

//   return headers;
// }

// function deriveServiceType(product: string, destination: string): string {
//   const p = (product || "").toUpperCase();
//   const d = (destination || "").toUpperCase();

//   if (
//     p.includes("INTERNATIONAL") ||
//     ["USA", "UK", "UAE", "CANADA", "AUSTRALIA", "U.S.A"].some((x) =>
//       d.includes(x),
//     )
//   ) {
//     return "INTERNATIONAL";
//   }

//   if (p.includes("CARGO") || p.includes("FREIGHT")) {
//     return "CARGO";
//   }

//   if (p.includes("EXPRESS")) {
//     return "EXPRESS";
//   }

//   return "DOMESTIC";
// }

// function asRecord(value: unknown): Record<string, unknown> {
//   if (value && typeof value === "object" && !Array.isArray(value)) {
//     return value as Record<string, unknown>;
//   }
//   return {};
// }

// function str(value: unknown, fallback = ""): string {
//   if (value == null) return fallback;
//   const s = String(value).trim();
//   if (s === "—" || s === "--" || s === "-") return fallback;
//   return s;
// }

// function num(value: unknown, fallback = 0): number {
//   const n = Number(value);
//   return Number.isFinite(n) ? n : fallback;
// }

// function asCurrency(value: unknown): "INR" | "USD" {
//   return String(value || "INR").toUpperCase() === "USD" ? "USD" : "INR";
// }

// function mapAwbDocToForm(
//   raw: Record<string, unknown>,
// ): Partial<AWBBookingData> {
//   const shipper = asRecord(raw.shipper);
//   const consignee = asRecord(raw.consignee);
//   const charges = asRecord(raw.charges);

//   const piecesRaw = Array.isArray(raw.pieces) ? raw.pieces : [];
//   const pieces = piecesRaw.map((p, i) => {
//     const row = asRecord(p);
//     const dims = asRecord(row.dimensions);
//     return {
//       quantity: num(row.quantity, 1),
//       weightKg: num(
//         row.weightKg ?? row.actualWeightKg ?? row.actualWeight,
//         0,
//       ),
//       lengthCm: num(row.lengthCm ?? dims.length, 0),
//       widthCm: num(row.widthCm ?? dims.width, 0),
//       heightCm: num(row.heightCm ?? dims.height, 0),
//       description: str(row.description, `Piece ${i + 1}`),
//     };
//   });

//   const itemsRaw = Array.isArray(raw.items) ? raw.items : [];
//   const items = itemsRaw.map((item, i) => {
//     const row = asRecord(item);
//     return {
//       description: str(row.description, `Item ${i + 1}`),
//       quantity: num(row.quantity, 1),
//       rate: num(row.rate ?? row.unitRate, 0),
//       amount: num(row.amount, 0),
//       hsCode: str(row.hsCode),
//       shopName: str(row.shopName),
//       shopAddress: str(row.shopAddress),
//     };
//   });

//   const fallbackPieces =
//     pieces.length > 0
//       ? pieces
//       : [
//           {
//             quantity: num(raw.totalPieces, 1) || 1,
//             weightKg: num(raw.actualWeight, 0),
//             lengthCm: 0,
//             widthCm: 0,
//             heightCm: 0,
//             description: "Piece 1",
//           },
//         ];

//   const additionalCharges = Array.isArray(charges.additionalCharges)
//     ? charges.additionalCharges
//     : [];

//   return {
//     customerId: str(raw.customerId),
//     customerName: str(raw.customerName),
//     customerCode: str(raw.customerCode),
//     accountCode: str(raw.accountCode),
//     origin: str(raw.origin),
//     originCode: str(raw.originCode),
//     destination: str(raw.destination),
//     destinationCode: str(raw.destinationCode),
//     product: str(raw.product ?? raw.serviceType),
//     vendor: str(raw.vendor),
//     service: str(raw.service ?? raw.serviceId) || "SELF",
//     bookDate: str(raw.shipmentDate ?? raw.bookDate).slice(0, 10) || undefined,
//     content: str(raw.description ?? raw.content),
//     instruction: str(raw.instruction),
//     shipper: {
//       name: str(shipper.name ?? shipper.companyName ?? raw.senderName),
//       addressLine1: str(
//         shipper.addressLine1 ?? shipper.address ?? raw.senderAddress,
//       ),
//       addressLine2: str(shipper.addressLine2),
//       city: str(shipper.city ?? raw.senderCity),
//       state: str(shipper.state ?? raw.senderState),
//       pincode: str(shipper.pincode ?? raw.senderPincode),
//       country: str(shipper.country ?? raw.senderCountry, "India"),
//       phone: str(shipper.phone ?? raw.senderPhone),
//       email: str(shipper.email),
//       gstin: str(shipper.gstin ?? raw.senderTaxId ?? raw.gstin),
//     },
//     consignee: {
//       name: str(
//         consignee.name ?? consignee.companyName ?? raw.receiverName,
//       ),
//       addressLine1: str(
//         consignee.addressLine1 ??
//           consignee.address ??
//           raw.receiverAddress,
//       ),
//       addressLine2: str(consignee.addressLine2),
//       city: str(consignee.city ?? raw.receiverCity),
//       state: str(consignee.state ?? raw.receiverState),
//       pincode: str(consignee.pincode ?? raw.receiverPincode),
//       country: str(consignee.country ?? raw.receiverCountry, "USA"),
//       phone: str(consignee.phone ?? raw.receiverPhone),
//       email: str(consignee.email),
//     },
//     pieces: fallbackPieces as unknown as AWBBookingData["pieces"],
//     items: items as unknown as AWBBookingData["items"],
//     csbType: str(raw.csbType) || "CSB4",
//     termOfInvoice: str(raw.termOfInvoice) || "CIF",
//     exportReason:
//       str(raw.exportReason) || "UNSOLICITED GIFT - NOT FOR SALE",
//     gstInvoice: Boolean(raw.gstInvoice),
//     invoiceNo: str(raw.invoiceNo),
//     invoiceDate: str(raw.invoiceDate).slice(0, 10) || undefined,
//     departmentNo: str(raw.departmentNo),
//     format: str(raw.format) || "performainv1",
//     charges: {
//       freight: num(charges.freight ?? raw.freight, 0),
//       fuelSurcharge: num(charges.fuelSurcharge ?? raw.fuelSurcharge, 0),
//       additionalCharges:
//         additionalCharges as unknown as AWBBookingData["charges"]["additionalCharges"],
//       otherCharges: num(charges.otherCharges ?? raw.otherCharges, 0),
//       contractCharges: num(charges.contractCharges, 0),
//       surcharge: num(charges.surcharge, 0),
//       discount: num(charges.discount ?? raw.discount, 0),
//       cgst: num(charges.cgst, 0),
//       sgst: num(charges.sgst, 0),
//       igst: num(charges.igst ?? charges.tax ?? raw.tax, 0),
//     },
//     paymentType: str(raw.paymentType) || "Credit",
//     referenceNo: str(raw.referenceNo ?? raw.awb),
//     commercial: Boolean(raw.commercial),
//     oda: Boolean(raw.oda),
//     medicalCharges: Boolean(raw.medicalCharges),
//     totalPieces: num(raw.totalPieces, fallbackPieces.length || 1),
//     packageType: str(raw.packageType) || "PKT",
//     actualWeight: num(raw.actualWeight, 0),
//     volumetricWeight: num(raw.volumetricWeight, 0),
//     chargeableWeight: num(raw.chargeableWeight, 0),
//     shipmentValue: num(raw.shipmentValue ?? raw.declaredValue, 0),
//     currency: asCurrency(raw.currency),
//   };
// }

// function mapFormToCreateBody(data: AWBBookingData) {
//   return {
//     customerId: data.customerId || data.accountCode || "WALKIN",
//     senderId: "WALKIN_SENDER",
//     receiverId: "WALKIN_RECEIVER",
//     customerName: data.customerName,
//     customerCode: data.customerCode || data.accountCode || "",
//     accountCode: data.accountCode,
//     origin: data.origin || data.shipper.city || data.shipper.pincode,
//     destination:
//       data.destination || data.consignee.city || data.consignee.country,
//     serviceType: deriveServiceType(data.product, data.destination),
//     product: data.product,
//     vendor: data.vendor,
//     serviceId: data.service || data.product || "SELF",
//     service: data.service,
//     shipmentDate: data.bookDate,
//     description: data.content || data.instruction,
//     shipper: data.shipper,
//     consignee: data.consignee,
//     pieces: (data.pieces || []).map((p, i) => ({
//       quantity: Number(p.quantity) || 1,
//       actualWeightKg: Number(p.weightKg) || 0,
//       lengthCm: Number(p.lengthCm) || 0,
//       widthCm: Number(p.widthCm) || 0,
//       heightCm: Number(p.heightCm) || 0,
//       description: p.description?.trim() || `Piece ${i + 1}`,
//       division: Number(p.division) || undefined,
//     })),
//     gstin: data.shipper.gstin || undefined,
//     csbType: data.csbType,
//     termOfInvoice: data.termOfInvoice,
//     exportReason: data.exportReason,
//     invoiceNo: data.invoiceNo,
//     invoiceDate: data.invoiceDate,
//     items: data.items,
//     freight: data.charges?.freight ?? 0,
//     fuelSurcharge: data.charges?.fuelSurcharge ?? 0,
//     otherCharges:
//       (data.charges?.otherCharges ?? 0) +
//       (data.charges?.contractCharges ?? 0) +
//       (data.charges?.surcharge ?? 0),
//     discount: data.charges?.discount ?? 0,
//     gstRate: 18,
//     paymentType: data.paymentType,
//     referenceNo: data.referenceNo,
//     commercial: data.commercial,
//     oda: data.oda,
//     medicalCharges: data.medicalCharges,
//     totalPieces: data.totalPieces,
//     packageType: data.packageType,
//     actualWeight: data.actualWeight,
//     volumetricWeight: data.volumetricWeight,
//     chargeableWeight: data.chargeableWeight,
//     shipmentValue: data.shipmentValue,
//     currency: data.currency,
//   };
// }

// export default function BookingPage() {
//   const searchParams = useSearchParams();
//   const editAwb = (searchParams.get("awb") || "").trim();

//   const { firebaseUser, user, loading: authLoading } = useAuth();

//   const [submitting, setSubmitting] = useState(false);
//   const [createdAwb, setCreatedAwb] = useState("");
//   const [error, setError] = useState<string | null>(null);
//   const [message, setMessage] = useState<string | null>(null);

//   const [loadingAwb, setLoadingAwb] = useState(Boolean(editAwb));
//   const [initialData, setInitialData] =
//     useState<Partial<AWBBookingData> | null>(null);

//   // Co-loader locked fields: code + contactPerson from profile / API
//   const [defaultAccountCode, setDefaultAccountCode] = useState("");
//   const [defaultClientName, setDefaultClientName] = useState("");
//   const [loadingCoLoaderProfile, setLoadingCoLoaderProfile] = useState(false);

//   const permUser = {
//     userId: user?.userId ?? "",
//     role: user?.role ?? null,
//   };

//   const canCreateAwb = can(permUser, "LOGISTICS_AWB_CREATE");
//   const canUpdateAwb = can(permUser, "LOGISTICS_AWB_UPDATE");

//   const role = String(user?.role || "").trim().toUpperCase();
//   const isCoLoader = role === "CO_LOADER";
//   const isSuperAdmin = role === "SUPER_ADMIN";

//   const canManageCharges = isSuperAdmin;
//   const canEditProformaRestricted = isSuperAdmin;
//   const lockAccountFields = isCoLoader;

//   /**
//    * CO_LOADER:
//    *   Co-loader Code = Firestore `code` (e.g. WF444)
//    *   Client Name    = Firestore `contactPerson` (e.g. Ram)
//    * Never use company name (XYZ) for Client Name.
//    */
//   useEffect(() => {
//     if (authLoading) return;

//     if (!isCoLoader || !firebaseUser) {
//       setDefaultAccountCode("");
//       setDefaultClientName("");
//       setLoadingCoLoaderProfile(false);
//       return;
//     }

//     let cancelled = false;

//     async function loadCoLoaderDefaults() {
//       try {
//         setLoadingCoLoaderProfile(true);

//         const profile = user as {
//           code?: string;
//           accountCode?: string;
//           contactPerson?: string;
//           coLoaderCode?: string;
//         } | null;

//         // Prefer user doc fields if already synced
//         const fromCode = String(
//           profile?.code ||
//             profile?.accountCode ||
//             profile?.coLoaderCode ||
//             "",
//         )
//           .trim()
//           .toUpperCase();
//         const fromContact = String(profile?.contactPerson || "").trim();

//         if (fromCode && fromContact) {
//           if (!cancelled) {
//             setDefaultAccountCode(fromCode);
//             setDefaultClientName(fromContact);
//           }
//           return;
//         }

//         // Fetch own co-loader profile (API returns data.me for CO_LOADER)
//         const headers = await buildAuthHeaders(firebaseUser);
//         const res = await fetch("/api/logistics/coloaders", {
//           method: "GET",
//           headers,
//           credentials: "include",
//           cache: "no-store",
//         });
//         const json = await res.json();

//         if (!res.ok || !json.success || cancelled) {
//           if (fromCode && !cancelled) setDefaultAccountCode(fromCode);
//           if (fromContact && !cancelled) setDefaultClientName(fromContact);
//           return;
//         }

//         const me = (json.data?.me || null) as CoLoaderMe | null;

//         const code = String(me?.code || me?.accountCode || fromCode || "")
//           .trim()
//           .toUpperCase();
//         // Client Name = contactPerson only (not company name)
//         const clientName = String(me?.contactPerson || fromContact || "").trim();

//         if (!cancelled) {
//           setDefaultAccountCode(code);
//           setDefaultClientName(clientName);
//         }
//       } catch {
//         // keep empty; form will show placeholders
//       } finally {
//         if (!cancelled) setLoadingCoLoaderProfile(false);
//       }
//     }

//     loadCoLoaderDefaults();
//     return () => {
//       cancelled = true;
//     };
//   }, [authLoading, isCoLoader, firebaseUser, user]);

//   useEffect(() => {
//     if (authLoading) return;
//     if (!editAwb) {
//       setLoadingAwb(false);
//       setInitialData(null);
//       return;
//     }

//     let cancelled = false;

//     async function loadExisting() {
//       try {
//         setLoadingAwb(true);
//         setError(null);

//         if (!firebaseUser) {
//           throw new Error("Authentication is required to load AWB.");
//         }

//         if (!can(permUser, "LOGISTICS_AWB_VIEW") && !canUpdateAwb) {
//           throw new Error("You do not have permission to load this AWB.");
//         }

//         const headers = await buildAuthHeaders(firebaseUser);
//         const res = await fetch(
//           `/api/logistics/awb/search?awb=${encodeURIComponent(editAwb)}&limit=1`,
//           {
//             method: "GET",
//             headers,
//             cache: "no-store",
//           },
//         );

//         const json = (await res.json()) as ApiResponse;

//         if (!res.ok || !json.success) {
//           throw new Error(
//             !json.success
//               ? json.error.message
//               : "Failed to load AWB for editing.",
//           );
//         }

//         const list = Array.isArray(json.data?.results)
//           ? json.data.results
//           : [];

//         if (list.length === 0) {
//           throw new Error(`AWB ${editAwb} was not found.`);
//         }

//         if (!cancelled) {
//           setInitialData(
//             mapAwbDocToForm(list[0] as Record<string, unknown>),
//           );
//         }
//       } catch (e) {
//         if (!cancelled) {
//           setInitialData(null);
//           setError(
//             e instanceof Error
//               ? e.message
//               : "Failed to load AWB for editing.",
//           );
//         }
//       } finally {
//         if (!cancelled) setLoadingAwb(false);
//       }
//     }

//     loadExisting();
//     return () => {
//       cancelled = true;
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [authLoading, firebaseUser, editAwb]);

//   async function handleSubmit(data: AWBBookingData) {
//     if (!canCreateAwb && !canUpdateAwb) {
//       setError("You do not have permission to create or update an AWB.");
//       return;
//     }

//     try {
//       setSubmitting(true);
//       setError(null);
//       setMessage(null);
//       setCreatedAwb("");

//       if (!firebaseUser) {
//         setError("You must be signed in to create an AWB.");
//         return;
//       }

//       const headers = await buildAuthHeaders(firebaseUser);

//       const safeData: AWBBookingData = lockAccountFields
//         ? {
//             ...data,
//             accountCode: defaultAccountCode || data.accountCode,
//             customerName: defaultClientName || data.customerName,
//           }
//         : data;

//       const body = mapFormToCreateBody(safeData);

//       if (editAwb) {
//         (body as Record<string, unknown>).awb = editAwb;
//         (body as Record<string, unknown>).existingAwb = editAwb;
//       }

//       const res = await fetch("/api/logistics/awb/create", {
//         method: "POST",
//         headers,
//         body: JSON.stringify(body),
//       });

//       const json = (await res.json()) as ApiResponse;

//       if (!res.ok || !json.success) {
//         const msg =
//           !json.success && json.error?.message
//             ? json.error.message
//             : `Create failed (${res.status})`;
//         setError(msg);
//         return;
//       }

//       const awb = json.data?.awb || editAwb || "";
//       setCreatedAwb(awb);
//       setMessage(
//         json.message ||
//           (editAwb
//             ? "AWB updated successfully."
//             : "AWB created successfully."),
//       );
//     } catch (e) {
//       console.error("Booking submit error:", e);
//       setError(
//         e instanceof Error ? e.message : "Unable to create AWB. Try again.",
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   if (authLoading) {
//     return (
//       <div className="flex min-h-[40vh] items-center justify-center gap-2 text-slate-600">
//         <Loader2 className="h-5 w-5 animate-spin" />
//         Loading…
//       </div>
//     );
//   }

//   const canUseForm = canCreateAwb || (Boolean(editAwb) && canUpdateAwb);

//   return (
//     <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-6">
//       <div className="flex flex-wrap items-center justify-between gap-3">
//         <div>
//           <div className="mb-1 flex items-center gap-2 text-sm text-slate-500">
//             <Link
//               href={ROUTES.ADMIN_LOGISTICS_AWB || "/admin/logistics/awb"}
//               className="inline-flex items-center gap-1 hover:text-slate-800"
//             >
//               <ArrowLeft className="h-4 w-4" />
//               AWBs
//             </Link>
//             <span>/</span>
//             <span>{editAwb ? "Update booking" : "Booking"}</span>
//           </div>

//           <h1 className="text-xl font-bold text-slate-900 md:text-2xl">
//             {editAwb ? `Update AWB · ${editAwb}` : "AWB Booking / Entry"}
//           </h1>

//           <p className="mt-0.5 text-sm text-slate-500">
//             {editAwb
//               ? "Review and update shipment details for this AWB."
//               : "Create shipment, calculate charges, and start tracking."}
//           </p>

//           {role ? (
//             <p className="mt-1 text-xs text-slate-400">
//               Signed in as: <span className="font-semibold">{role}</span>
//             </p>
//           ) : null}
//         </div>

//         {isCoLoader && (defaultAccountCode || defaultClientName) ? (
//           <div className="rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-sm font-semibold text-teal-900">
//             Account: {defaultAccountCode || "—"}
//             {defaultClientName ? ` · ${defaultClientName}` : ""}
//           </div>
//         ) : null}
//       </div>

//       {!canUseForm ? (
//         <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
//           <h2 className="font-semibold text-amber-900">
//             Booking access restricted
//           </h2>
//           <p className="mt-1 text-sm text-amber-800">
//             Required permission:{" "}
//             <strong>
//               {editAwb ? "LOGISTICS_AWB_UPDATE" : "LOGISTICS_AWB_CREATE"}
//             </strong>
//             .
//           </p>
//         </div>
//       ) : null}

//       {createdAwb ? (
//         <div className="flex flex-wrap items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
//           <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
//           <div className="flex-1">
//             <p className="font-semibold">
//               {editAwb ? "AWB saved" : "AWB created"}
//             </p>
//             <p className="mt-1 font-mono text-lg">{createdAwb}</p>
//             {message ? (
//               <p className="mt-1 text-sm text-emerald-800">{message}</p>
//             ) : null}
//             <div className="mt-3 flex flex-wrap gap-2">
//               <Link
//                 href={`/admin/logistics/awb/${encodeURIComponent(createdAwb)}`}
//                 className="rounded-lg bg-emerald-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-800"
//               >
//                 Open AWB
//               </Link>
//               <Link
//                 href="/admin/logistics/tracking/matrix"
//                 className="rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-sm font-medium text-emerald-900"
//               >
//                 Tracking matrix
//               </Link>
//               <button
//                 type="button"
//                 onClick={() => {
//                   setCreatedAwb("");
//                   setMessage(null);
//                 }}
//                 className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700"
//               >
//                 Book another
//               </button>
//             </div>
//           </div>
//         </div>
//       ) : null}

//       {error ? (
//         <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
//           {error}
//         </div>
//       ) : null}

//       {canUseForm && (loadingAwb || (isCoLoader && loadingCoLoaderProfile)) ? (
//         <div className="flex min-h-[30vh] items-center justify-center gap-2 text-slate-600">
//           <Loader2 className="h-5 w-5 animate-spin" />
//           {loadingAwb
//             ? `Loading AWB ${editAwb}…`
//             : "Loading co-loader profile…"}
//         </div>
//       ) : null}

//       {canUseForm &&
//       !loadingAwb &&
//       !(isCoLoader && loadingCoLoaderProfile) ? (
//         <AWBBookingForm
//           key={
//             editAwb ||
//             `new-${defaultAccountCode}-${defaultClientName}`
//           }
//           defaultAccountCode={defaultAccountCode}
//           defaultClientName={defaultClientName}
//           lockAccountFields={lockAccountFields}
//           canManageCharges={canManageCharges}
//           canEditProformaRestricted={canEditProformaRestricted}
//           initialValue={initialData}
//           editAwb={editAwb || undefined}
//           onSubmit={handleSubmit}
//         />
//       ) : null}

//       {!canUseForm ? (
//         <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
//           <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl">
//             🔒
//           </div>
//           <h2 className="mt-4 text-lg font-bold text-slate-900">
//             AWB booking is restricted
//           </h2>
//           <Link
//             href={ROUTES.ADMIN_LOGISTICS_AWB || "/admin/logistics/awb"}
//             className="mt-5 inline-flex rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
//           >
//             View Existing AWBs
//           </Link>
//         </div>
//       ) : null}

//       {submitting ? (
//         <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/20">
//           <div className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 shadow-lg">
//             <Loader2 className="h-5 w-5 animate-spin text-teal-700" />
//             <span className="text-sm font-medium text-slate-800">
//               {editAwb ? "Saving AWB…" : "Creating AWB…"}
//             </span>
//           </div>
//         </div>
//       ) : null}
//     </div>
//   );
// }

// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { useRouter, useSearchParams } from "next/navigation";
// import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";

// import { useAuth } from "@/context/AuthContext";
// import { can } from "@/lib/permissions";
// import AWBBookingForm, {
//   type AWBBookingData,
// } from "@/components/logistics/AWBBookingForm";
// import { ROUTES } from "@/utils/constants";

// type ApiResponse =
//   | {
//       success: true;
//       data?: {
//         awb?: string | Record<string, unknown>;
//         documentId?: string;
//         results?: Record<string, unknown>[];
//         [key: string]: unknown;
//       };
//       message?: string;
//     }
//   | {
//       success: false;
//       error: {
//         code: string;
//         message: string;
//       };
//     };

// type CoLoaderMe = {
//   code?: string;
//   contactPerson?: string;
//   name?: string;
//   accountCode?: string;
// };

// async function buildAuthHeaders(
//   firebaseUser: {
//     getIdToken: (force?: boolean) => Promise<string>;
//   } | null,
// ): Promise<HeadersInit> {
//   const headers: Record<string, string> = {
//     Accept: "application/json",
//     "Content-Type": "application/json",
//   };

//   if (firebaseUser) {
//     const token = await firebaseUser.getIdToken(true);
//     headers.Authorization = `Bearer ${token}`;
//   }

//   return headers;
// }

// function deriveServiceType(product: string, destination: string): string {
//   const p = (product || "").toUpperCase();
//   const d = (destination || "").toUpperCase();

//   if (
//     p.includes("INTERNATIONAL") ||
//     ["USA", "UK", "UAE", "CANADA", "AUSTRALIA", "U.S.A"].some((x) =>
//       d.includes(x),
//     )
//   ) {
//     return "INTERNATIONAL";
//   }

//   if (p.includes("CARGO") || p.includes("FREIGHT")) {
//     return "CARGO";
//   }

//   if (p.includes("EXPRESS")) {
//     return "EXPRESS";
//   }

//   return "DOMESTIC";
// }

// function asRecord(value: unknown): Record<string, unknown> {
//   if (value && typeof value === "object" && !Array.isArray(value)) {
//     return value as Record<string, unknown>;
//   }
//   return {};
// }

// function str(value: unknown, fallback = ""): string {
//   if (value == null) return fallback;
//   const s = String(value).trim();
//   if (s === "—" || s === "--" || s === "-") return fallback;
//   return s;
// }

// function num(value: unknown, fallback = 0): number {
//   const n = Number(value);
//   return Number.isFinite(n) ? n : fallback;
// }

// function asCurrency(value: unknown): "INR" | "USD" {
//   return String(value || "INR").toUpperCase() === "USD" ? "USD" : "INR";
// }

// function mapAwbDocToForm(
//   raw: Record<string, unknown>,
// ): Partial<AWBBookingData> {
//   const shipper = asRecord(raw.shipper ?? raw.sender);
//   const consignee = asRecord(raw.consignee ?? raw.receiver);
//   const charges = asRecord(raw.charges);

//   const origin = str(
//     shipper.origin ?? raw.origin ?? shipper.city ?? raw.senderCity,
//   );
//   const originCode = str(
//     shipper.originCode ?? raw.originCode ?? shipper.cityCode,
//   );

//   const piecesRaw = Array.isArray(raw.pieces) ? raw.pieces : [];
//   const pieces = piecesRaw.map((p, i) => {
//     const row = asRecord(p);
//     const dims = asRecord(row.dimensions);
//     return {
//       quantity: num(row.quantity, 1),
//       weightKg: num(
//         row.weightKg ?? row.actualWeightKg ?? row.actualWeight,
//         0,
//       ),
//       lengthCm: num(row.lengthCm ?? dims.length, 0),
//       widthCm: num(row.widthCm ?? dims.width, 0),
//       heightCm: num(row.heightCm ?? dims.height, 0),
//       description: str(row.description, `Piece ${i + 1}`),
//       division: num(row.division, 0) || undefined,
//     };
//   });

//   const itemsRaw = Array.isArray(raw.items) ? raw.items : [];
//   const items = itemsRaw.map((item, i) => {
//     const row = asRecord(item);
//     return {
//       description: str(row.description, `Item ${i + 1}`),
//       quantity: num(row.quantity, 1),
//       rate: num(row.rate ?? row.unitRate, 0),
//       amount: num(row.amount, 0),
//       hsCode: str(row.hsCode),
//       shopName: str(row.shopName),
//       shopAddress: str(row.shopAddress),
//       boxNo: str(row.boxNo, "BOX_1"),
//     };
//   });

//   const fallbackPieces =
//     pieces.length > 0
//       ? pieces
//       : [
//           {
//             quantity: num(raw.totalPieces, 1) || 1,
//             weightKg: num(
//               raw.actualWeight ?? raw.actualWeightKg,
//               0,
//             ),
//             lengthCm: 0,
//             widthCm: 0,
//             heightCm: 0,
//             description: "Piece 1",
//           },
//         ];

//   const additionalCharges = Array.isArray(charges.additionalCharges)
//     ? charges.additionalCharges
//     : [];

//   const shipperName = str(
//     shipper.name ?? shipper.companyName ?? raw.senderName,
//   );
//   const shipperCompany = str(
//     shipper.company ?? shipper.companyName ?? raw.senderCompany,
//   );

//   return {
//     customerId: str(raw.customerId),
//     customerName: str(raw.customerName),
//     customerCode: str(raw.customerCode),
//     accountCode: str(raw.accountCode),
//     origin,
//     originCode,
//     destination: str(raw.destination),
//     destinationCode: str(raw.destinationCode),
//     product: str(raw.product ?? raw.serviceType),
//     vendor: str(raw.vendor),
//     service: str(raw.service ?? raw.serviceId) || "SELF",
//     bookDate:
//       str(raw.shipmentDate ?? raw.bookDate).slice(0, 10) || undefined,
//     content: str(raw.description ?? raw.content),
//     instruction: str(raw.instruction),
//     shipper: {
//       name: shipperName,
//       company: shipperCompany,
//       contactName: str(
//         shipper.contactName ?? shipper.contact ?? shipperName,
//       ),
//       addressLine1: str(
//         shipper.addressLine1 ?? shipper.address ?? raw.senderAddress,
//       ),
//       addressLine2: str(shipper.addressLine2),
//       city: str(shipper.city ?? raw.senderCity),
//       state: str(shipper.state ?? raw.senderState),
//       pincode: str(
//         shipper.pincode ?? shipper.postalCode ?? raw.senderPincode,
//       ),
//       country: str(shipper.country ?? raw.senderCountry, "India"),
//       phone: str(shipper.phone ?? raw.senderPhone),
//       mobile: str(shipper.mobile),
//       email: str(shipper.email),
//       gstin: str(shipper.gstin ?? raw.senderTaxId ?? raw.gstin),
//       iecNo: str(shipper.iecNo),
//       documentType: str(shipper.documentType),
//       documentNo: str(shipper.documentNo),
//       origin,
//       originCode,
//     },
//     // consignee: {
//     //   name: str(
//     //     consignee.name ?? consignee.companyName ?? raw.receiverName,
//     //   ),
//     //   company: str(
//     //     consignee.company ??
//     //       consignee.companyName ??
//     //       raw.receiverCompany,
//     //   ),
//     //   contactName: str(
//     //     consignee.contactName ??
//     //       consignee.contact ??
//     //       consignee.name ??
//     //       raw.receiverName,
//     //   ),
//     //   addressLine1: str(
//     //     consignee.addressLine1 ??
//     //       consignee.address ??
//     //       raw.receiverAddress,
//     //   ),
//     //   addressLine2: str(consignee.addressLine2),
//     //   city: str(consignee.city ?? raw.receiverCity),
//     //   state: str(consignee.state ?? raw.receiverState),
//     //   pincode: str(
//     //     consignee.pincode ??
//     //       consignee.postalCode ??
//     //       raw.receiverPincode,
//     //   ),
//     //   country: str(consignee.country ?? raw.receiverCountry, ""),
//     //   phone: str(consignee.phone ?? raw.receiverPhone),
//     //   mobile: str(consignee.mobile),
//     //   email: str(consignee.email),
//     //   gstin: str(consignee.gstin),
//     //   iecNo: str(consignee.iecNo),
//     //   documentType: str(consignee.documentType),
//     //   documentNo: str(consignee.documentNo),
//     //   documentUrl: str(consignee.documentUrl),
//     //   destinationCode: str(
//     //     consignee.destinationCode ?? raw.destinationCode,
//     //   ),
//     // },

//         consignee: {
//       name: str(
//         consignee.name ?? consignee.companyName ?? raw.receiverName,
//       ),
//       company: str(
//         consignee.company ??
//           consignee.companyName ??
//           raw.receiverCompany,
//       ),
//       contactName: str(
//         consignee.contactName ??
//           consignee.contact ??
//           consignee.name ??
//           raw.receiverName,
//       ),
//       addressLine1: str(
//         consignee.addressLine1 ??
//           consignee.address ??
//           raw.receiverAddress,
//       ),
//       addressLine2: str(consignee.addressLine2),
//       city: str(consignee.city ?? raw.receiverCity),
//       state: str(consignee.state ?? raw.receiverState),
//       pincode: str(
//         consignee.pincode ??
//           consignee.postalCode ??
//           raw.receiverPincode,
//       ),
//       country: str(consignee.country ?? raw.receiverCountry, ""),
//       phone: str(consignee.phone ?? raw.receiverPhone),
//       mobile: str(consignee.mobile),
//       email: str(consignee.email),
//       gstin: str(consignee.gstin),
//       iecNo: str(consignee.iecNo),
//       documentType: str(consignee.documentType),
//       documentNo: str(consignee.documentNo),
//       documentUrl: str(consignee.documentUrl),
//       // do NOT put destinationCode here — use root destinationCode only
//     },
//     pieces: fallbackPieces as unknown as AWBBookingData["pieces"],
//     items: items as unknown as AWBBookingData["items"],
//     csbType: str(raw.csbType) || "CSB4",
//     termOfInvoice: str(raw.termOfInvoice) || "CIF",
//     exportReason:
//       str(raw.exportReason) || "UNSOLICITED GIFT - NOT FOR SALE",
//     gstInvoice: Boolean(raw.gstInvoice),
//     invoiceNo: str(raw.invoiceNo),
//     invoiceDate: str(raw.invoiceDate).slice(0, 10) || undefined,
//     departmentNo: str(raw.departmentNo),
//     format: str(raw.format) || "performainv1",
//     charges: {
//       freight: num(charges.freight ?? raw.freight, 0),
//       fuelSurcharge: num(
//         charges.fuelSurcharge ?? raw.fuelSurcharge,
//         0,
//       ),
//       additionalCharges:
//         additionalCharges as unknown as AWBBookingData["charges"]["additionalCharges"],
//       otherCharges: num(charges.otherCharges ?? raw.otherCharges, 0),
//       contractCharges: num(charges.contractCharges, 0),
//       surcharge: num(charges.surcharge, 0),
//       discount: num(charges.discount ?? raw.discount, 0),
//       cgst: num(charges.cgst, 0),
//       sgst: num(charges.sgst, 0),
//       igst: num(charges.igst ?? charges.tax ?? raw.tax, 0),
//     },
//     paymentType: str(raw.paymentType) || "Credit",
//     referenceNo: str(raw.referenceNo ?? raw.awb),
//     commercial: Boolean(raw.commercial),
//     oda: Boolean(raw.oda),
//     medicalCharges: Boolean(raw.medicalCharges),
//     totalPieces: num(raw.totalPieces, fallbackPieces.length || 1),
//     packageType: str(raw.packageType) || "PKT",
//     actualWeight: num(raw.actualWeight ?? raw.actualWeightKg, 0),
//     volumetricWeight: num(
//       raw.volumetricWeight ?? raw.volumetricWeightKg,
//       0,
//     ),
//     chargeableWeight: num(
//       raw.chargeableWeight ?? raw.chargeableWeightKg,
//       0,
//     ),
//     shipmentValue: num(raw.shipmentValue ?? raw.declaredValue, 0),
//     currency: asCurrency(raw.currency),
//   };
// }

// function mapFormToBody(data: AWBBookingData, existingAwb?: string) {
//   const origin =
//     data.origin ||
//     data.shipper.origin ||
//     data.shipper.city ||
//     data.shipper.pincode ||
//     "";
//   const originCode =
//     data.originCode || data.shipper.originCode || "";

//   return {
//     ...(existingAwb
//       ? { awb: existingAwb, existingAwb }
//       : {}),
//     customerId: data.customerId || data.accountCode || "WALKIN",
//     senderId: "WALKIN_SENDER",
//     receiverId: "WALKIN_RECEIVER",
//     customerName: data.customerName,
//     customerCode: data.customerCode || data.accountCode || "",
//     accountCode: data.accountCode,
//     origin,
//     originCode,
//     destination:
//       data.destination || data.consignee.city || data.consignee.country,
//     destinationCode: data.destinationCode,
//     serviceType: deriveServiceType(data.product, data.destination),
//     product: data.product,
//     vendor: data.vendor,
//     serviceId: data.service || data.product || "SELF",
//     service: data.service,
//     shipmentDate: data.bookDate,
//     description: data.content || data.instruction,
//     content: data.content,
//     instruction: data.instruction,
//     shipper: {
//       ...data.shipper,
//       company: data.shipper.company,
//       companyName: data.shipper.company,
//       contactName: data.shipper.contactName,
//       origin,
//       originCode,
//     },
//     consignee: {
//       ...data.consignee,
//       company: data.consignee.company,
//       companyName: data.consignee.company,
//       contactName: data.consignee.contactName,
//     },
//     pieces: (data.pieces || []).map((p, i) => ({
//       quantity: Number(p.quantity) || 1,
//       actualWeightKg: Number(p.weightKg) || 0,
//       lengthCm: Number(p.lengthCm) || 0,
//       widthCm: Number(p.widthCm) || 0,
//       heightCm: Number(p.heightCm) || 0,
//       description: p.description?.trim() || `Piece ${i + 1}`,
//       division: Number(p.division) || undefined,
//     })),
//     gstin: data.shipper.gstin || undefined,
//     csbType: data.csbType,
//     termOfInvoice: data.termOfInvoice,
//     exportReason: data.exportReason,
//     gstInvoice: data.gstInvoice,
//     invoiceNo: data.invoiceNo,
//     invoiceDate: data.invoiceDate,
//     departmentNo: data.departmentNo,
//     format: data.format,
//     items: data.items,
//     freight: data.charges?.freight ?? 0,
//     fuelSurcharge: data.charges?.fuelSurcharge ?? 0,
//     otherCharges:
//       (data.charges?.otherCharges ?? 0) +
//       (data.charges?.contractCharges ?? 0) +
//       (data.charges?.surcharge ?? 0),
//     discount: data.charges?.discount ?? 0,
//     charges: data.charges,
//     gstRate: 18,
//     paymentType: data.paymentType,
//     referenceNo: data.referenceNo,
//     commercial: data.commercial,
//     oda: data.oda,
//     medicalCharges: data.medicalCharges,
//     totalPieces: data.totalPieces,
//     packageType: data.packageType,
//     actualWeight: data.actualWeight,
//     volumetricWeight: data.volumetricWeight,
//     chargeableWeight: data.chargeableWeight,
//     shipmentValue: data.shipmentValue,
//     currency: data.currency,
//   };
// }

// export default function BookingPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const editAwb = (searchParams.get("awb") || "").trim();

//   const { firebaseUser, user, loading: authLoading } = useAuth();

//   const [submitting, setSubmitting] = useState(false);
//   const [createdAwb, setCreatedAwb] = useState("");
//   const [error, setError] = useState<string | null>(null);
//   const [message, setMessage] = useState<string | null>(null);

//   const [loadingAwb, setLoadingAwb] = useState(Boolean(editAwb));
//   const [initialData, setInitialData] =
//     useState<Partial<AWBBookingData> | null>(null);

//   const [defaultAccountCode, setDefaultAccountCode] = useState("");
//   const [defaultClientName, setDefaultClientName] = useState("");
//   const [loadingCoLoaderProfile, setLoadingCoLoaderProfile] =
//     useState(false);

//   const permUser = {
//     userId: user?.userId ?? "",
//     role: user?.role ?? null,
//   };

//   const canCreateAwb = can(permUser, "LOGISTICS_AWB_CREATE");
//   const canUpdateAwb = can(permUser, "LOGISTICS_AWB_UPDATE");

//   const role = String(user?.role || "").trim().toUpperCase();
//   const isCoLoader = role === "CO_LOADER";
//   const isSuperAdmin = role === "SUPER_ADMIN";

//   const canManageCharges = isSuperAdmin;
//   const canEditProformaRestricted = isSuperAdmin;
//   const lockAccountFields = isCoLoader;

//   useEffect(() => {
//     if (authLoading) return;

//     if (!isCoLoader || !firebaseUser) {
//       setDefaultAccountCode("");
//       setDefaultClientName("");
//       setLoadingCoLoaderProfile(false);
//       return;
//     }

//     let cancelled = false;

//     async function loadCoLoaderDefaults() {
//       try {
//         setLoadingCoLoaderProfile(true);

//         const profile = user as {
//           code?: string;
//           accountCode?: string;
//           contactPerson?: string;
//           coLoaderCode?: string;
//         } | null;

//         const fromCode = String(
//           profile?.code ||
//             profile?.accountCode ||
//             profile?.coLoaderCode ||
//             "",
//         )
//           .trim()
//           .toUpperCase();
//         const fromContact = String(profile?.contactPerson || "").trim();

//         if (fromCode && fromContact) {
//           if (!cancelled) {
//             setDefaultAccountCode(fromCode);
//             setDefaultClientName(fromContact);
//           }
//           return;
//         }

//         const headers = await buildAuthHeaders(firebaseUser);
//         const res = await fetch("/api/logistics/coloaders", {
//           method: "GET",
//           headers,
//           credentials: "include",
//           cache: "no-store",
//         });
//         const json = await res.json();

//         if (!res.ok || !json.success || cancelled) {
//           if (fromCode && !cancelled) setDefaultAccountCode(fromCode);
//           if (fromContact && !cancelled) setDefaultClientName(fromContact);
//           return;
//         }

//         const me = (json.data?.me || null) as CoLoaderMe | null;

//         const code = String(me?.code || me?.accountCode || fromCode || "")
//           .trim()
//           .toUpperCase();
//         const clientName = String(
//           me?.contactPerson || fromContact || "",
//         ).trim();

//         if (!cancelled) {
//           setDefaultAccountCode(code);
//           setDefaultClientName(clientName);
//         }
//       } catch {
//         /* ignore */
//       } finally {
//         if (!cancelled) setLoadingCoLoaderProfile(false);
//       }
//     }

//     loadCoLoaderDefaults();
//     return () => {
//       cancelled = true;
//     };
//   }, [authLoading, isCoLoader, firebaseUser, user]);

//   useEffect(() => {
//     if (authLoading) return;
//     if (!editAwb) {
//       setLoadingAwb(false);
//       setInitialData(null);
//       return;
//     }

//     let cancelled = false;

//     async function loadExisting() {
//       try {
//         setLoadingAwb(true);
//         setError(null);

//         if (!firebaseUser) {
//           throw new Error("Authentication is required to load AWB.");
//         }

//         if (!can(permUser, "LOGISTICS_AWB_VIEW") && !canUpdateAwb) {
//           throw new Error("You do not have permission to load this AWB.");
//         }

//         const headers = await buildAuthHeaders(firebaseUser);
//         const res = await fetch(
//           `/api/logistics/awb/search?awb=${encodeURIComponent(editAwb)}&limit=1`,
//           {
//             method: "GET",
//             headers,
//             cache: "no-store",
//           },
//         );

//         const json = (await res.json()) as ApiResponse;

//         if (!res.ok || !json.success) {
//           throw new Error(
//             !json.success
//               ? json.error.message
//               : "Failed to load AWB for editing.",
//           );
//         }

//         const list = Array.isArray(json.data?.results)
//           ? json.data.results
//           : [];

//         if (list.length === 0) {
//           throw new Error(`AWB ${editAwb} was not found.`);
//         }

//         if (!cancelled) {
//           setInitialData(
//             mapAwbDocToForm(list[0] as Record<string, unknown>),
//           );
//         }
//       } catch (e) {
//         if (!cancelled) {
//           setInitialData(null);
//           setError(
//             e instanceof Error
//               ? e.message
//               : "Failed to load AWB for editing.",
//           );
//         }
//       } finally {
//         if (!cancelled) setLoadingAwb(false);
//       }
//     }

//     loadExisting();
//     return () => {
//       cancelled = true;
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [authLoading, firebaseUser, editAwb]);

//   async function handleSubmit(data: AWBBookingData) {
//     if (!canCreateAwb && !canUpdateAwb) {
//       setError("You do not have permission to create or update an AWB.");
//       return;
//     }

//     if (editAwb && !canUpdateAwb) {
//       setError("You do not have permission to update this AWB.");
//       return;
//     }

//     if (!editAwb && !canCreateAwb) {
//       setError("You do not have permission to create an AWB.");
//       return;
//     }

//     try {
//       setSubmitting(true);
//       setError(null);
//       setMessage(null);
//       setCreatedAwb("");

//       if (!firebaseUser) {
//         setError("You must be signed in to save an AWB.");
//         return;
//       }

//       const headers = await buildAuthHeaders(firebaseUser);

//       const safeData: AWBBookingData = lockAccountFields
//         ? {
//             ...data,
//             accountCode: defaultAccountCode || data.accountCode,
//             customerName: defaultClientName || data.customerName,
//           }
//         : data;

//       const isEdit = Boolean(editAwb);
//       const body = mapFormToBody(safeData, isEdit ? editAwb : undefined);

//       const res = await fetch(
//         isEdit
//           ? "/api/logistics/awb/update"
//           : "/api/logistics/awb/create",
//         {
//           method: isEdit ? "PATCH" : "POST",
//           headers,
//           body: JSON.stringify(body),
//         },
//       );

//       const json = (await res.json()) as ApiResponse;

//       if (!res.ok || !json.success) {
//         const msg =
//           !json.success && json.error?.message
//             ? json.error.message
//             : `Save failed (${res.status})`;
//         setError(msg);
//         return;
//       }

//       const awbRaw = json.data?.awb;
//       const awb =
//         typeof awbRaw === "string"
//           ? awbRaw
//           : awbRaw && typeof awbRaw === "object"
//             ? str((awbRaw as Record<string, unknown>).awb, editAwb)
//             : editAwb || "";

//       if (isEdit) {
//         setMessage(json.message || "AWB updated successfully.");
//         router.push(
//           ROUTES.ADMIN_LOGISTICS_AWB || "/admin/logistics/awb",
//         );
//         return;
//       }

//       setCreatedAwb(awb);
//       setMessage(json.message || "AWB created successfully.");
//     } catch (e) {
//       console.error("Booking submit error:", e);
//       setError(
//         e instanceof Error ? e.message : "Unable to save AWB. Try again.",
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   if (authLoading) {
//     return (
//       <div className="flex min-h-[40vh] items-center justify-center gap-2 text-slate-600">
//         <Loader2 className="h-5 w-5 animate-spin" />
//         Loading…
//       </div>
//     );
//   }

//   const canUseForm = canCreateAwb || (Boolean(editAwb) && canUpdateAwb);

//   return (
//     <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-6">
//       <div className="flex flex-wrap items-center justify-between gap-3">
//         <div>
//           <div className="mb-1 flex items-center gap-2 text-sm text-slate-500">
//             <Link
//               href={ROUTES.ADMIN_LOGISTICS_AWB || "/admin/logistics/awb"}
//               className="inline-flex items-center gap-1 hover:text-slate-800"
//             >
//               <ArrowLeft className="h-4 w-4" />
//               AWBs
//             </Link>
//             <span>/</span>
//             <span>{editAwb ? "Update booking" : "Booking"}</span>
//           </div>

//           <h1 className="text-xl font-bold text-slate-900 md:text-2xl">
//             {editAwb ? `Update AWB · ${editAwb}` : "AWB Booking / Entry"}
//           </h1>

//           <p className="mt-0.5 text-sm text-slate-500">
//             {editAwb
//               ? "Review and update shipment details for this AWB."
//               : "Create shipment, calculate charges, and start tracking."}
//           </p>

//           {role ? (
//             <p className="mt-1 text-xs text-slate-400">
//               Signed in as: <span className="font-semibold">{role}</span>
//             </p>
//           ) : null}
//         </div>

//         {isCoLoader && (defaultAccountCode || defaultClientName) ? (
//           <div className="rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-sm font-semibold text-teal-900">
//             Account: {defaultAccountCode || "—"}
//             {defaultClientName ? ` · ${defaultClientName}` : ""}
//           </div>
//         ) : null}
//       </div>

//       {!canUseForm ? (
//         <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
//           <h2 className="font-semibold text-amber-900">
//             Booking access restricted
//           </h2>
//           <p className="mt-1 text-sm text-amber-800">
//             Required permission:{" "}
//             <strong>
//               {editAwb ? "LOGISTICS_AWB_UPDATE" : "LOGISTICS_AWB_CREATE"}
//             </strong>
//             .
//           </p>
//         </div>
//       ) : null}

//       {createdAwb ? (
//         <div className="flex flex-wrap items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
//           <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
//           <div className="flex-1">
//             <p className="font-semibold">AWB created</p>
//             <p className="mt-1 font-mono text-lg">{createdAwb}</p>
//             {message ? (
//               <p className="mt-1 text-sm text-emerald-800">{message}</p>
//             ) : null}
//             <div className="mt-3 flex flex-wrap gap-2">
//               <Link
//                 href={`/admin/logistics/awb/${encodeURIComponent(createdAwb)}`}
//                 className="rounded-lg bg-emerald-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-800"
//               >
//                 Open AWB
//               </Link>
//               <Link
//                 href="/admin/logistics/awb"
//                 className="rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-sm font-medium text-emerald-900"
//               >
//                 AWB list
//               </Link>
//               <button
//                 type="button"
//                 onClick={() => {
//                   setCreatedAwb("");
//                   setMessage(null);
//                 }}
//                 className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700"
//               >
//                 Book another
//               </button>
//             </div>
//           </div>
//         </div>
//       ) : null}

//       {error ? (
//         <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
//           {error}
//         </div>
//       ) : null}

//       {canUseForm &&
//       (loadingAwb || (isCoLoader && loadingCoLoaderProfile)) ? (
//         <div className="flex min-h-[30vh] items-center justify-center gap-2 text-slate-600">
//           <Loader2 className="h-5 w-5 animate-spin" />
//           {loadingAwb
//             ? `Loading AWB ${editAwb}…`
//             : "Loading co-loader profile…"}
//         </div>
//       ) : null}

//       {canUseForm &&
//       !loadingAwb &&
//       !(isCoLoader && loadingCoLoaderProfile) ? (
//         <AWBBookingForm
//           key={
//             editAwb ||
//             `new-${defaultAccountCode}-${defaultClientName}`
//           }
//           defaultAccountCode={defaultAccountCode}
//           defaultClientName={defaultClientName}
//           lockAccountFields={lockAccountFields}
//           canManageCharges={canManageCharges}
//           canEditProformaRestricted={canEditProformaRestricted}
//           initialValue={initialData}
//           editAwb={editAwb || undefined}
//           onSubmit={handleSubmit}
//         />
//       ) : null}

//       {!canUseForm ? (
//         <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
//           <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl">
//             🔒
//           </div>
//           <h2 className="mt-4 text-lg font-bold text-slate-900">
//             AWB booking is restricted
//           </h2>
//           <Link
//             href={ROUTES.ADMIN_LOGISTICS_AWB || "/admin/logistics/awb"}
//             className="mt-5 inline-flex rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
//           >
//             View Existing AWBs
//           </Link>
//         </div>
//       ) : null}

//       {submitting ? (
//         <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/20">
//           <div className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 shadow-lg">
//             <Loader2 className="h-5 w-5 animate-spin text-teal-700" />
//             <span className="text-sm font-medium text-slate-800">
//               {editAwb ? "Saving AWB…" : "Creating AWB…"}
//             </span>
//           </div>
//         </div>
//       ) : null}
//     </div>
//   );
// }


// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { useRouter, useSearchParams } from "next/navigation";
// import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";

// import { useAuth } from "@/context/AuthContext";
// import { can } from "@/lib/permissions";
// import AWBBookingForm, {
//   type AWBBookingData,
// } from "@/components/logistics/AWBBookingForm";
// import { ROUTES } from "@/utils/constants";

// type ApiResponse =
//   | {
//       success: true;
//       data?: {
//         awb?: string | Record<string, unknown>;
//         documentId?: string;
//         results?: Record<string, unknown>[];
//         [key: string]: unknown;
//       };
//       message?: string;
//     }
//   | {
//       success: false;
//       error: {
//         code: string;
//         message: string;
//       };
//     };

// type CoLoaderMe = {
//   code?: string;
//   contactPerson?: string;
//   name?: string;
//   accountCode?: string;
//   email?: string;
//   id?: string;
//   coLoaderId?: string;
// };

// async function buildAuthHeaders(
//   firebaseUser: {
//     getIdToken: (force?: boolean) => Promise<string>;
//   } | null,
// ): Promise<HeadersInit> {
//   const headers: Record<string, string> = {
//     Accept: "application/json",
//     "Content-Type": "application/json",
//   };

//   if (firebaseUser) {
//     const token = await firebaseUser.getIdToken(true);
//     headers.Authorization = `Bearer ${token}`;
//   }

//   return headers;
// }

// function deriveServiceType(product: string, destination: string): string {
//   const p = (product || "").toUpperCase();
//   const d = (destination || "").toUpperCase();

//   if (
//     p.includes("INTERNATIONAL") ||
//     ["USA", "UK", "UAE", "CANADA", "AUSTRALIA", "U.S.A"].some((x) =>
//       d.includes(x),
//     )
//   ) {
//     return "INTERNATIONAL";
//   }

//   if (p.includes("CARGO") || p.includes("FREIGHT")) {
//     return "CARGO";
//   }

//   if (p.includes("EXPRESS")) {
//     return "EXPRESS";
//   }

//   return "DOMESTIC";
// }

// function asRecord(value: unknown): Record<string, unknown> {
//   if (value && typeof value === "object" && !Array.isArray(value)) {
//     return value as Record<string, unknown>;
//   }
//   return {};
// }

// function str(value: unknown, fallback = ""): string {
//   if (value == null) return fallback;
//   const s = String(value).trim();
//   if (s === "—" || s === "--" || s === "-") return fallback;
//   return s;
// }

// function num(value: unknown, fallback = 0): number {
//   const n = Number(value);
//   return Number.isFinite(n) ? n : fallback;
// }

// function asCurrency(value: unknown): "INR" | "USD" {
//   return String(value || "INR").toUpperCase() === "USD" ? "USD" : "INR";
// }

// function extractList(data: unknown): Record<string, unknown>[] {
//   if (Array.isArray(data)) return data as Record<string, unknown>[];
//   if (!data || typeof data !== "object") return [];
//   const obj = data as Record<string, unknown>;
//   for (const key of [
//     "items",
//     "results",
//     "coloaders",
//     "coLoaders",
//     "rows",
//     "data",
//   ]) {
//     if (Array.isArray(obj[key])) return obj[key] as Record<string, unknown>[];
//   }
//   return [];
// }

// function mapAwbDocToForm(
//   raw: Record<string, unknown>,
// ): Partial<AWBBookingData> {
//   const shipper = asRecord(raw.shipper ?? raw.sender);
//   const consignee = asRecord(raw.consignee ?? raw.receiver);
//   const charges = asRecord(raw.charges);

//   const origin = str(
//     shipper.origin ?? raw.origin ?? shipper.city ?? raw.senderCity,
//   );
//   const originCode = str(
//     shipper.originCode ?? raw.originCode ?? shipper.cityCode,
//   );

//   const piecesRaw = Array.isArray(raw.pieces) ? raw.pieces : [];
//   const pieces = piecesRaw.map((p, i) => {
//     const row = asRecord(p);
//     const dims = asRecord(row.dimensions);
//     return {
//       quantity: num(row.quantity, 1),
//       weightKg: num(
//         row.weightKg ?? row.actualWeightKg ?? row.actualWeight,
//         0,
//       ),
//       lengthCm: num(row.lengthCm ?? dims.length, 0),
//       widthCm: num(row.widthCm ?? dims.width, 0),
//       heightCm: num(row.heightCm ?? dims.height, 0),
//       description: str(row.description, `Piece ${i + 1}`),
//       division: num(row.division, 0) || undefined,
//     };
//   });

//   const itemsRaw = Array.isArray(raw.items) ? raw.items : [];
//   const items = itemsRaw.map((item, i) => {
//     const row = asRecord(item);
//     return {
//       description: str(row.description, `Item ${i + 1}`),
//       quantity: num(row.quantity, 1),
//       rate: num(row.rate ?? row.unitRate, 0),
//       amount: num(row.amount, 0),
//       hsCode: str(row.hsCode),
//       shopName: str(row.shopName),
//       shopAddress: str(row.shopAddress),
//       boxNo: str(row.boxNo, "BOX_1"),
//     };
//   });

//   const fallbackPieces =
//     pieces.length > 0
//       ? pieces
//       : [
//           {
//             quantity: num(raw.totalPieces, 1) || 1,
//             weightKg: num(raw.actualWeight ?? raw.actualWeightKg, 0),
//             lengthCm: 0,
//             widthCm: 0,
//             heightCm: 0,
//             description: "Piece 1",
//           },
//         ];

//   const additionalCharges = Array.isArray(charges.additionalCharges)
//     ? charges.additionalCharges
//     : [];

//   const shipperName = str(
//     shipper.name ?? shipper.companyName ?? raw.senderName,
//   );
//   const shipperCompany = str(
//     shipper.company ?? shipper.companyName ?? raw.senderCompany,
//   );

//   return {
//     customerId: str(raw.customerId),
//     customerName: str(raw.customerName),
//     customerCode: str(raw.customerCode),
//     accountCode: str(raw.accountCode),
//     origin,
//     originCode,
//     destination: str(raw.destination),
//     destinationCode: str(raw.destinationCode),
//     product: str(raw.product ?? raw.serviceType),
//     vendor: str(raw.vendor),
//     service: str(raw.service ?? raw.serviceId) || "SELF",
//     bookDate:
//       str(raw.shipmentDate ?? raw.bookDate).slice(0, 10) || undefined,
//     content: str(raw.description ?? raw.content),
//     instruction: str(raw.instruction),
//     shipper: {
//       name: shipperName,
//       company: shipperCompany,
//       contactName: str(
//         shipper.contactName ?? shipper.contact ?? shipperName,
//       ),
//       addressLine1: str(
//         shipper.addressLine1 ?? shipper.address ?? raw.senderAddress,
//       ),
//       addressLine2: str(shipper.addressLine2),
//       city: str(shipper.city ?? raw.senderCity),
//       state: str(shipper.state ?? raw.senderState),
//       pincode: str(
//         shipper.pincode ?? shipper.postalCode ?? raw.senderPincode,
//       ),
//       country: str(shipper.country ?? raw.senderCountry, "India"),
//       phone: str(shipper.phone ?? raw.senderPhone),
//       mobile: str(shipper.mobile),
//       email: str(shipper.email),
//       gstin: str(shipper.gstin ?? raw.senderTaxId ?? raw.gstin),
//       iecNo: str(shipper.iecNo),
//       documentType: str(shipper.documentType),
//       documentNo: str(shipper.documentNo),
//       origin,
//       originCode,
//     },
//     consignee: {
//       name: str(
//         consignee.name ?? consignee.companyName ?? raw.receiverName,
//       ),
//       company: str(
//         consignee.company ??
//           consignee.companyName ??
//           raw.receiverCompany,
//       ),
//       contactName: str(
//         consignee.contactName ??
//           consignee.contact ??
//           consignee.name ??
//           raw.receiverName,
//       ),
//       addressLine1: str(
//         consignee.addressLine1 ??
//           consignee.address ??
//           raw.receiverAddress,
//       ),
//       addressLine2: str(consignee.addressLine2),
//       city: str(consignee.city ?? raw.receiverCity),
//       state: str(consignee.state ?? raw.receiverState),
//       pincode: str(
//         consignee.pincode ??
//           consignee.postalCode ??
//           raw.receiverPincode,
//       ),
//       country: str(consignee.country ?? raw.receiverCountry, ""),
//       phone: str(consignee.phone ?? raw.receiverPhone),
//       mobile: str(consignee.mobile),
//       email: str(consignee.email),
//       gstin: str(consignee.gstin),
//       iecNo: str(consignee.iecNo),
//       documentType: str(consignee.documentType),
//       documentNo: str(consignee.documentNo),
//       documentUrl: str(consignee.documentUrl),
//     },
//     pieces: fallbackPieces as unknown as AWBBookingData["pieces"],
//     items: items as unknown as AWBBookingData["items"],
//     csbType: str(raw.csbType) || "CSB4",
//     termOfInvoice: str(raw.termOfInvoice) || "CIF",
//     exportReason:
//       str(raw.exportReason) || "UNSOLICITED GIFT - NOT FOR SALE",
//     gstInvoice: Boolean(raw.gstInvoice),
//     invoiceNo: str(raw.invoiceNo),
//     invoiceDate: str(raw.invoiceDate).slice(0, 10) || undefined,
//     departmentNo: str(raw.departmentNo),
//     format: str(raw.format) || "performainv1",
//     charges: {
//       freight: num(charges.freight ?? raw.freight, 0),
//       fuelSurcharge: num(
//         charges.fuelSurcharge ?? raw.fuelSurcharge,
//         0,
//       ),
//       additionalCharges:
//         additionalCharges as unknown as AWBBookingData["charges"]["additionalCharges"],
//       otherCharges: num(charges.otherCharges ?? raw.otherCharges, 0),
//       contractCharges: num(charges.contractCharges, 0),
//       surcharge: num(charges.surcharge, 0),
//       discount: num(charges.discount ?? raw.discount, 0),
//       cgst: num(charges.cgst, 0),
//       sgst: num(charges.sgst, 0),
//       igst: num(charges.igst ?? charges.tax ?? raw.tax, 0),
//     },
//     paymentType: str(raw.paymentType) || "Credit",
//     referenceNo: str(raw.referenceNo ?? raw.awb),
//     commercial: Boolean(raw.commercial),
//     oda: Boolean(raw.oda),
//     medicalCharges: Boolean(raw.medicalCharges),
//     totalPieces: num(raw.totalPieces, fallbackPieces.length || 1),
//     packageType: str(raw.packageType) || "PKT",
//     actualWeight: num(raw.actualWeight ?? raw.actualWeightKg, 0),
//     volumetricWeight: num(
//       raw.volumetricWeight ?? raw.volumetricWeightKg,
//       0,
//     ),
//     chargeableWeight: num(
//       raw.chargeableWeight ?? raw.chargeableWeightKg,
//       0,
//     ),
//     shipmentValue: num(raw.shipmentValue ?? raw.declaredValue, 0),
//     currency: asCurrency(raw.currency),
//   };
// }

// function mapFormToBody(data: AWBBookingData, existingAwb?: string) {
//   const origin =
//     data.origin ||
//     data.shipper.origin ||
//     data.shipper.city ||
//     data.shipper.pincode ||
//     "";
//   const originCode =
//     data.originCode || data.shipper.originCode || "";

//   return {
//     ...(existingAwb ? { awb: existingAwb, existingAwb } : {}),
//     customerId: data.customerId || data.accountCode || "WALKIN",
//     senderId: "WALKIN_SENDER",
//     receiverId: "WALKIN_RECEIVER",
//     customerName: data.customerName,
//     customerCode: data.customerCode || data.accountCode || "",
//     accountCode: data.accountCode,
//     origin,
//     originCode,
//     destination:
//       data.destination || data.consignee.city || data.consignee.country,
//     destinationCode: data.destinationCode,
//     serviceType: deriveServiceType(data.product, data.destination),
//     product: data.product,
//     vendor: data.vendor,
//     serviceId: data.service || data.product || "SELF",
//     service: data.service,
//     shipmentDate: data.bookDate,
//     description: data.content || data.instruction,
//     content: data.content,
//     instruction: data.instruction,
//     shipper: {
//       ...data.shipper,
//       company: data.shipper.company,
//       companyName: data.shipper.company,
//       contactName: data.shipper.contactName,
//       origin,
//       originCode,
//     },
//     consignee: {
//       ...data.consignee,
//       company: data.consignee.company,
//       companyName: data.consignee.company,
//       contactName: data.consignee.contactName,
//     },
//     pieces: (data.pieces || []).map((p, i) => ({
//       quantity: Number(p.quantity) || 1,
//       actualWeightKg: Number(p.weightKg) || 0,
//       lengthCm: Number(p.lengthCm) || 0,
//       widthCm: Number(p.widthCm) || 0,
//       heightCm: Number(p.heightCm) || 0,
//       description: p.description?.trim() || `Piece ${i + 1}`,
//       division: Number(p.division) || undefined,
//     })),
//     gstin: data.shipper.gstin || undefined,
//     csbType: data.csbType,
//     termOfInvoice: data.termOfInvoice,
//     exportReason: data.exportReason,
//     gstInvoice: data.gstInvoice,
//     invoiceNo: data.invoiceNo,
//     invoiceDate: data.invoiceDate,
//     departmentNo: data.departmentNo,
//     format: data.format,
//     items: data.items,
//     freight: data.charges?.freight ?? 0,
//     fuelSurcharge: data.charges?.fuelSurcharge ?? 0,
//     otherCharges:
//       (data.charges?.otherCharges ?? 0) +
//       (data.charges?.contractCharges ?? 0) +
//       (data.charges?.surcharge ?? 0),
//     discount: data.charges?.discount ?? 0,
//     charges: data.charges,
//     gstRate: 18,
//     paymentType: data.paymentType,
//     referenceNo: data.referenceNo,
//     commercial: data.commercial,
//     oda: data.oda,
//     medicalCharges: data.medicalCharges,
//     totalPieces: data.totalPieces,
//     packageType: data.packageType,
//     actualWeight: data.actualWeight,
//     volumetricWeight: data.volumetricWeight,
//     chargeableWeight: data.chargeableWeight,
//     shipmentValue: data.shipmentValue,
//     currency: data.currency,
//   };
// }

// export default function BookingPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const editAwb = (searchParams.get("awb") || "").trim();

//   const { firebaseUser, user, loading: authLoading } = useAuth();

//   const [submitting, setSubmitting] = useState(false);
//   const [createdAwb, setCreatedAwb] = useState("");
//   const [error, setError] = useState<string | null>(null);
//   const [message, setMessage] = useState<string | null>(null);

//   const [loadingAwb, setLoadingAwb] = useState(Boolean(editAwb));
//   const [initialData, setInitialData] =
//     useState<Partial<AWBBookingData> | null>(null);

//   const [defaultAccountCode, setDefaultAccountCode] = useState("");
//   const [defaultClientName, setDefaultClientName] = useState("");
//   const [loadingCoLoaderProfile, setLoadingCoLoaderProfile] =
//     useState(false);

//   const permUser = {
//     userId: user?.userId ?? "",
//     role: user?.role ?? null,
//   };

//   const canCreateAwb = can(permUser, "LOGISTICS_AWB_CREATE");
//   const canUpdateAwb = can(permUser, "LOGISTICS_AWB_UPDATE");

//   const role = String(user?.role || "").trim().toUpperCase();
//   const isCoLoader = role === "CO_LOADER";
//   const isSuperAdmin = role === "SUPER_ADMIN";

//   const canManageCharges = isSuperAdmin;
//   const canEditProformaRestricted = isSuperAdmin;
//   const lockAccountFields = isCoLoader;

//   useEffect(() => {
//     if (authLoading) return;

//     if (!isCoLoader || !firebaseUser) {
//       setDefaultAccountCode("");
//       setDefaultClientName("");
//       setLoadingCoLoaderProfile(false);
//       return;
//     }

//     let cancelled = false;

//     async function loadCoLoaderDefaults() {
//       try {
//         setLoadingCoLoaderProfile(true);

//         const profile = user as {
//           userId?: string;
//           id?: string;
//           email?: string;
//           displayName?: string;
//           name?: string;
//           code?: string;
//           accountCode?: string;
//           coLoaderCode?: string;
//           contactPerson?: string;
//         } | null;

//         const userEmail = String(profile?.email || "").trim().toLowerCase();
//         const userId = String(
//           profile?.userId || profile?.id || firebaseUser?.uid || "",
//         ).trim();

//         // 1) Fields already on auth user document
//         let code = String(
//           profile?.coLoaderCode ||
//             profile?.code ||
//             profile?.accountCode ||
//             "",
//         )
//           .trim()
//           .toUpperCase();

//         let clientName = String(
//           profile?.contactPerson ||
//             profile?.displayName ||
//             profile?.name ||
//             "",
//         ).trim();

//         // 2) Enrich from co-loaders master (match by email / userId / code)
//         try {
//           const headers = await buildAuthHeaders(firebaseUser);
//           const res = await fetch("/api/logistics/coloaders", {
//             method: "GET",
//             headers,
//             credentials: "include",
//             cache: "no-store",
//           });
//           const json = await res.json();

//           if (res.ok && json.success && !cancelled) {
//             const me = (json.data?.me || null) as CoLoaderMe | null;
//             const list = extractList(json.data);

//             const matched =
//               me ||
//               list.find((row) => {
//                 const email = String(row.email || "")
//                   .trim()
//                   .toLowerCase();
//                 const id = String(
//                   row.id || row.coLoaderId || row.userId || "",
//                 ).trim();
//                 const rowCode = String(
//                   row.code || row.coLoaderCode || row.accountCode || "",
//                 )
//                   .trim()
//                   .toUpperCase();

//                 if (userEmail && email && email === userEmail) return true;
//                 if (userId && id && id === userId) return true;
//                 if (code && rowCode && rowCode === code) return true;
//                 return false;
//               }) ||
//               null;

//             if (matched) {
//               const m = matched as CoLoaderMe & Record<string, unknown>;
//               const mCode = String(
//                 m.code || m.accountCode || m.coLoaderCode || "",
//               )
//                 .trim()
//                 .toUpperCase();
//               const mName = String(
//                 m.contactPerson || m.name || "",
//               ).trim();

//               if (mCode) code = mCode;
//               if (mName) clientName = mName;
//             }
//           }
//         } catch {
//           /* keep profile-only values */
//         }

//         // 3) Last resort — never leave Client Name blank for co-loader
//         if (!clientName) {
//           clientName = String(
//             profile?.displayName ||
//               profile?.name ||
//               profile?.email ||
//               "Co-loader",
//           ).trim();
//         }

//         if (!cancelled) {
//           setDefaultAccountCode(code);
//           setDefaultClientName(clientName);
//         }
//       } catch {
//         if (!cancelled) {
//           setDefaultClientName(
//             String(
//               (user as { displayName?: string; name?: string; email?: string })
//                 ?.displayName ||
//                 (user as { name?: string })?.name ||
//                 (user as { email?: string })?.email ||
//                 "Co-loader",
//             ).trim(),
//           );
//         }
//       } finally {
//         if (!cancelled) setLoadingCoLoaderProfile(false);
//       }
//     }

//     loadCoLoaderDefaults();
//     return () => {
//       cancelled = true;
//     };
//   }, [authLoading, isCoLoader, firebaseUser, user]);

//   useEffect(() => {
//     if (authLoading) return;
//     if (!editAwb) {
//       setLoadingAwb(false);
//       setInitialData(null);
//       return;
//     }

//     let cancelled = false;

//     async function loadExisting() {
//       try {
//         setLoadingAwb(true);
//         setError(null);

//         if (!firebaseUser) {
//           throw new Error("Authentication is required to load AWB.");
//         }

//         if (!can(permUser, "LOGISTICS_AWB_VIEW") && !canUpdateAwb) {
//           throw new Error("You do not have permission to load this AWB.");
//         }

//         const headers = await buildAuthHeaders(firebaseUser);
//         const res = await fetch(
//           `/api/logistics/awb/search?awb=${encodeURIComponent(editAwb)}&limit=1`,
//           {
//             method: "GET",
//             headers,
//             cache: "no-store",
//           },
//         );

//         const json = (await res.json()) as ApiResponse;

//         if (!res.ok || !json.success) {
//           throw new Error(
//             !json.success
//               ? json.error.message
//               : "Failed to load AWB for editing.",
//           );
//         }

//         const list = Array.isArray(json.data?.results)
//           ? json.data.results
//           : [];

//         if (list.length === 0) {
//           throw new Error(`AWB ${editAwb} was not found.`);
//         }

//         if (!cancelled) {
//           setInitialData(
//             mapAwbDocToForm(list[0] as Record<string, unknown>),
//           );
//         }
//       } catch (e) {
//         if (!cancelled) {
//           setInitialData(null);
//           setError(
//             e instanceof Error
//               ? e.message
//               : "Failed to load AWB for editing.",
//           );
//         }
//       } finally {
//         if (!cancelled) setLoadingAwb(false);
//       }
//     }

//     loadExisting();
//     return () => {
//       cancelled = true;
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [authLoading, firebaseUser, editAwb]);

//   async function handleSubmit(data: AWBBookingData) {
//     if (!canCreateAwb && !canUpdateAwb) {
//       setError("You do not have permission to create or update an AWB.");
//       return;
//     }

//     if (editAwb && !canUpdateAwb) {
//       setError("You do not have permission to update this AWB.");
//       return;
//     }

//     if (!editAwb && !canCreateAwb) {
//       setError("You do not have permission to create an AWB.");
//       return;
//     }

//     try {
//       setSubmitting(true);
//       setError(null);
//       setMessage(null);
//       setCreatedAwb("");

//       if (!firebaseUser) {
//         setError("You must be signed in to save an AWB.");
//         return;
//       }

//       const headers = await buildAuthHeaders(firebaseUser);

//       const safeData: AWBBookingData = lockAccountFields
//         ? {
//             ...data,
//             accountCode: defaultAccountCode || data.accountCode,
//             customerName: defaultClientName || data.customerName,
//           }
//         : data;

//       const isEdit = Boolean(editAwb);
//       const body = mapFormToBody(safeData, isEdit ? editAwb : undefined);

//       const res = await fetch(
//         isEdit
//           ? "/api/logistics/awb/update"
//           : "/api/logistics/awb/create",
//         {
//           method: isEdit ? "PATCH" : "POST",
//           headers,
//           body: JSON.stringify(body),
//         },
//       );

//       const json = (await res.json()) as ApiResponse;

//       if (!res.ok || !json.success) {
//         const msg =
//           !json.success && json.error?.message
//             ? json.error.message
//             : `Save failed (${res.status})`;
//         setError(msg);
//         return;
//       }

//       const awbRaw = json.data?.awb;
//       const awb =
//         typeof awbRaw === "string"
//           ? awbRaw
//           : awbRaw && typeof awbRaw === "object"
//             ? str((awbRaw as Record<string, unknown>).awb, editAwb)
//             : editAwb || "";

//       if (isEdit) {
//         setMessage(json.message || "AWB updated successfully.");
//         router.push(
//           ROUTES.ADMIN_LOGISTICS_AWB || "/admin/logistics/awb",
//         );
//         return;
//       }

//       setCreatedAwb(awb);
//       setMessage(json.message || "AWB created successfully.");
//     } catch (e) {
//       console.error("Booking submit error:", e);
//       setError(
//         e instanceof Error ? e.message : "Unable to save AWB. Try again.",
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   if (authLoading) {
//     return (
//       <div className="flex min-h-[40vh] items-center justify-center gap-2 text-slate-600">
//         <Loader2 className="h-5 w-5 animate-spin" />
//         Loading…
//       </div>
//     );
//   }

//   const canUseForm = canCreateAwb || (Boolean(editAwb) && canUpdateAwb);

//   return (
//     <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-6">
//       <div className="flex flex-wrap items-center justify-between gap-3">
//         <div>
//           <div className="mb-1 flex items-center gap-2 text-sm text-slate-500">
//             <Link
//               href={ROUTES.ADMIN_LOGISTICS_AWB || "/admin/logistics/awb"}
//               className="inline-flex items-center gap-1 hover:text-slate-800"
//             >
//               <ArrowLeft className="h-4 w-4" />
//               AWBs
//             </Link>
//             <span>/</span>
//             <span>{editAwb ? "Update booking" : "Booking"}</span>
//           </div>

//           <h1 className="text-xl font-bold text-slate-900 md:text-2xl">
//             {editAwb ? `Update AWB · ${editAwb}` : "AWB Booking / Entry"}
//           </h1>

//           <p className="mt-0.5 text-sm text-slate-500">
//             {editAwb
//               ? "Review and update shipment details for this AWB."
//               : "Create shipment, calculate charges, and start tracking."}
//           </p>

//           {role ? (
//             <p className="mt-1 text-xs text-slate-400">
//               Signed in as: <span className="font-semibold">{role}</span>
//             </p>
//           ) : null}
//         </div>

//         {isCoLoader ? (
//           <div className="rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-sm font-semibold text-teal-900">
//             Account: {defaultAccountCode || "—"}
//             {defaultClientName ? ` · ${defaultClientName}` : ""}
//           </div>
//         ) : null}
//       </div>

//       {!canUseForm ? (
//         <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
//           <h2 className="font-semibold text-amber-900">
//             Booking access restricted
//           </h2>
//           <p className="mt-1 text-sm text-amber-800">
//             Required permission:{" "}
//             <strong>
//               {editAwb ? "LOGISTICS_AWB_UPDATE" : "LOGISTICS_AWB_CREATE"}
//             </strong>
//             .
//           </p>
//         </div>
//       ) : null}

//       {createdAwb ? (
//         <div className="flex flex-wrap items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
//           <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
//           <div className="flex-1">
//             <p className="font-semibold">AWB created</p>
//             <p className="mt-1 font-mono text-lg">{createdAwb}</p>
//             {message ? (
//               <p className="mt-1 text-sm text-emerald-800">{message}</p>
//             ) : null}
//             <div className="mt-3 flex flex-wrap gap-2">
//               <Link
//                 href={`/admin/logistics/awb/${encodeURIComponent(createdAwb)}`}
//                 className="rounded-lg bg-emerald-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-800"
//               >
//                 Open AWB
//               </Link>
//               <Link
//                 href="/admin/logistics/awb"
//                 className="rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-sm font-medium text-emerald-900"
//               >
//                 AWB list
//               </Link>
//               <button
//                 type="button"
//                 onClick={() => {
//                   setCreatedAwb("");
//                   setMessage(null);
//                 }}
//                 className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700"
//               >
//                 Book another
//               </button>
//             </div>
//           </div>
//         </div>
//       ) : null}

//       {error ? (
//         <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
//           {error}
//         </div>
//       ) : null}

//       {canUseForm &&
//       (loadingAwb || (isCoLoader && loadingCoLoaderProfile)) ? (
//         <div className="flex min-h-[30vh] items-center justify-center gap-2 text-slate-600">
//           <Loader2 className="h-5 w-5 animate-spin" />
//           {loadingAwb
//             ? `Loading AWB ${editAwb}…`
//             : "Loading co-loader profile…"}
//         </div>
//       ) : null}

//       {canUseForm &&
//       !loadingAwb &&
//       !(isCoLoader && loadingCoLoaderProfile) ? (
//         <AWBBookingForm
//           key={
//             editAwb ||
//             `new-${defaultAccountCode}-${defaultClientName}`
//           }
//           defaultAccountCode={defaultAccountCode}
//           defaultClientName={defaultClientName}
//           lockAccountFields={lockAccountFields}
//           canManageCharges={canManageCharges}
//           canEditProformaRestricted={canEditProformaRestricted}
//           initialValue={initialData}
//           editAwb={editAwb || undefined}
//           onSubmit={handleSubmit}
//         />
//       ) : null}

//       {!canUseForm ? (
//         <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
//           <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl">
//             🔒
//           </div>
//           <h2 className="mt-4 text-lg font-bold text-slate-900">
//             AWB booking is restricted
//           </h2>
//           <Link
//             href={ROUTES.ADMIN_LOGISTICS_AWB || "/admin/logistics/awb"}
//             className="mt-5 inline-flex rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
//           >
//             View Existing AWBs
//           </Link>
//         </div>
//       ) : null}

//       {submitting ? (
//         <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/20">
//           <div className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 shadow-lg">
//             <Loader2 className="h-5 w-5 animate-spin text-teal-700" />
//             <span className="text-sm font-medium text-slate-800">
//               {editAwb ? "Saving AWB…" : "Creating AWB…"}
//             </span>
//           </div>
//         </div>
//       ) : null}
//     </div>
//   );
// }

// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { useRouter, useSearchParams } from "next/navigation";
// import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";

// import { useAuth } from "@/context/AuthContext";
// import { can } from "@/lib/permissions";
// import AWBBookingForm, {
//   type AWBBookingData,
// } from "@/components/logistics/AWBBookingForm";
// import { ROUTES } from "@/utils/constants";

// type ApiResponse =
//   | {
//       success: true;
//       data?: {
//         awb?: string | Record<string, unknown>;
//         documentId?: string;
//         results?: Record<string, unknown>[];
//         [key: string]: unknown;
//       };
//       message?: string;
//     }
//   | {
//       success: false;
//       error: {
//         code: string;
//         message: string;
//       };
//     };

// async function buildAuthHeaders(
//   firebaseUser: {
//     getIdToken: (force?: boolean) => Promise<string>;
//   } | null,
// ): Promise<HeadersInit> {
//   const headers: Record<string, string> = {
//     Accept: "application/json",
//     "Content-Type": "application/json",
//   };

//   if (firebaseUser) {
//     const token = await firebaseUser.getIdToken(true);
//     headers.Authorization = `Bearer ${token}`;
//   }

//   return headers;
// }

// function deriveServiceType(product: string, destination: string): string {
//   const p = (product || "").toUpperCase();
//   const d = (destination || "").toUpperCase();

//   if (
//     p.includes("INTERNATIONAL") ||
//     ["USA", "UK", "UAE", "CANADA", "AUSTRALIA", "U.S.A"].some((x) =>
//       d.includes(x),
//     )
//   ) {
//     return "INTERNATIONAL";
//   }

//   if (p.includes("CARGO") || p.includes("FREIGHT")) {
//     return "CARGO";
//   }

//   if (p.includes("EXPRESS")) {
//     return "EXPRESS";
//   }

//   return "DOMESTIC";
// }

// function asRecord(value: unknown): Record<string, unknown> {
//   if (value && typeof value === "object" && !Array.isArray(value)) {
//     return value as Record<string, unknown>;
//   }
//   return {};
// }

// function str(value: unknown, fallback = ""): string {
//   if (value == null) return fallback;
//   const s = String(value).trim();
//   if (s === "—" || s === "--" || s === "-") return fallback;
//   return s;
// }

// function num(value: unknown, fallback = 0): number {
//   const n = Number(value);
//   return Number.isFinite(n) ? n : fallback;
// }

// function asCurrency(value: unknown): "INR" | "USD" {
//   return String(value || "INR").toUpperCase() === "USD" ? "USD" : "INR";
// }

// function extractList(data: unknown): Record<string, unknown>[] {
//   if (Array.isArray(data)) return data as Record<string, unknown>[];
//   if (!data || typeof data !== "object") return [];
//   const obj = data as Record<string, unknown>;
//   for (const key of [
//     "items",
//     "results",
//     "coloaders",
//     "coLoaders",
//     "rows",
//     "data",
//   ]) {
//     if (Array.isArray(obj[key])) return obj[key] as Record<string, unknown>[];
//   }
//   return [];
// }

// function mapAwbDocToForm(
//   raw: Record<string, unknown>,
// ): Partial<AWBBookingData> {
//   const shipper = asRecord(raw.shipper ?? raw.sender);
//   const consignee = asRecord(raw.consignee ?? raw.receiver);
//   const charges = asRecord(raw.charges);

//   const origin = str(
//     shipper.origin ?? raw.origin ?? shipper.city ?? raw.senderCity,
//   );
//   const originCode = str(
//     shipper.originCode ?? raw.originCode ?? shipper.cityCode,
//   );

//   const piecesRaw = Array.isArray(raw.pieces) ? raw.pieces : [];
//   const pieces = piecesRaw.map((p, i) => {
//     const row = asRecord(p);
//     const dims = asRecord(row.dimensions);
//     return {
//       quantity: num(row.quantity, 1),
//       weightKg: num(
//         row.weightKg ?? row.actualWeightKg ?? row.actualWeight,
//         0,
//       ),
//       lengthCm: num(row.lengthCm ?? dims.length, 0),
//       widthCm: num(row.widthCm ?? dims.width, 0),
//       heightCm: num(row.heightCm ?? dims.height, 0),
//       description: str(row.description, `Piece ${i + 1}`),
//       division: num(row.division, 0) || undefined,
//     };
//   });

//   const itemsRaw = Array.isArray(raw.items) ? raw.items : [];
//   const items = itemsRaw.map((item, i) => {
//     const row = asRecord(item);
//     return {
//       description: str(row.description, `Item ${i + 1}`),
//       quantity: num(row.quantity, 1),
//       rate: num(row.rate ?? row.unitRate, 0),
//       amount: num(row.amount, 0),
//       hsCode: str(row.hsCode),
//       shopName: str(row.shopName),
//       shopAddress: str(row.shopAddress),
//       boxNo: str(row.boxNo, "BOX_1"),
//     };
//   });

//   const fallbackPieces =
//     pieces.length > 0
//       ? pieces
//       : [
//           {
//             quantity: num(raw.totalPieces, 1) || 1,
//             weightKg: num(raw.actualWeight ?? raw.actualWeightKg, 0),
//             lengthCm: 0,
//             widthCm: 0,
//             heightCm: 0,
//             description: "Piece 1",
//           },
//         ];

//   const additionalCharges = Array.isArray(charges.additionalCharges)
//     ? charges.additionalCharges
//     : [];

//   const shipperName = str(
//     shipper.name ?? shipper.companyName ?? raw.senderName,
//   );
//   const shipperCompany = str(
//     shipper.company ?? shipper.companyName ?? raw.senderCompany,
//   );

//   return {
//     customerId: str(raw.customerId),
//     customerName: str(raw.customerName),
//     customerCode: str(raw.customerCode),
//     accountCode: str(raw.accountCode),
//     origin,
//     originCode,
//     destination: str(raw.destination),
//     destinationCode: str(raw.destinationCode),
//     product: str(raw.product ?? raw.serviceType),
//     vendor: str(raw.vendor),
//     service: str(raw.service ?? raw.serviceId) || "SELF",
//     bookDate:
//       str(raw.shipmentDate ?? raw.bookDate).slice(0, 10) || undefined,
//     content: str(raw.description ?? raw.content),
//     instruction: str(raw.instruction),
//     shipper: {
//       name: shipperName,
//       company: shipperCompany,
//       contactName: str(
//         shipper.contactName ?? shipper.contact ?? shipperName,
//       ),
//       addressLine1: str(
//         shipper.addressLine1 ?? shipper.address ?? raw.senderAddress,
//       ),
//       addressLine2: str(shipper.addressLine2),
//       city: str(shipper.city ?? raw.senderCity),
//       state: str(shipper.state ?? raw.senderState),
//       pincode: str(
//         shipper.pincode ?? shipper.postalCode ?? raw.senderPincode,
//       ),
//       country: str(shipper.country ?? raw.senderCountry, "India"),
//       phone: str(shipper.phone ?? raw.senderPhone),
//       mobile: str(shipper.mobile),
//       email: str(shipper.email),
//       gstin: str(shipper.gstin ?? raw.senderTaxId ?? raw.gstin),
//       iecNo: str(shipper.iecNo),
//       documentType: str(shipper.documentType),
//       documentNo: str(shipper.documentNo),
//       origin,
//       originCode,
//     },
//     consignee: {
//       name: str(
//         consignee.name ?? consignee.companyName ?? raw.receiverName,
//       ),
//       company: str(
//         consignee.company ??
//           consignee.companyName ??
//           raw.receiverCompany,
//       ),
//       contactName: str(
//         consignee.contactName ??
//           consignee.contact ??
//           consignee.name ??
//           raw.receiverName,
//       ),
//       addressLine1: str(
//         consignee.addressLine1 ??
//           consignee.address ??
//           raw.receiverAddress,
//       ),
//       addressLine2: str(consignee.addressLine2),
//       city: str(consignee.city ?? raw.receiverCity),
//       state: str(consignee.state ?? raw.receiverState),
//       pincode: str(
//         consignee.pincode ??
//           consignee.postalCode ??
//           raw.receiverPincode,
//       ),
//       country: str(consignee.country ?? raw.receiverCountry, ""),
//       phone: str(consignee.phone ?? raw.receiverPhone),
//       mobile: str(consignee.mobile),
//       email: str(consignee.email),
//       gstin: str(consignee.gstin),
//       iecNo: str(consignee.iecNo),
//       documentType: str(consignee.documentType),
//       documentNo: str(consignee.documentNo),
//       documentUrl: str(consignee.documentUrl),
//     },
//     pieces: fallbackPieces as unknown as AWBBookingData["pieces"],
//     items: items as unknown as AWBBookingData["items"],
//     csbType: str(raw.csbType) || "CSB4",
//     termOfInvoice: str(raw.termOfInvoice) || "CIF",
//     exportReason:
//       str(raw.exportReason) || "UNSOLICITED GIFT - NOT FOR SALE",
//     gstInvoice: Boolean(raw.gstInvoice),
//     invoiceNo: str(raw.invoiceNo),
//     invoiceDate: str(raw.invoiceDate).slice(0, 10) || undefined,
//     departmentNo: str(raw.departmentNo),
//     format: str(raw.format) || "performainv1",
//     charges: {
//       freight: num(charges.freight ?? raw.freight, 0),
//       fuelSurcharge: num(
//         charges.fuelSurcharge ?? raw.fuelSurcharge,
//         0,
//       ),
//       additionalCharges:
//         additionalCharges as unknown as AWBBookingData["charges"]["additionalCharges"],
//       otherCharges: num(charges.otherCharges ?? raw.otherCharges, 0),
//       contractCharges: num(charges.contractCharges, 0),
//       surcharge: num(charges.surcharge, 0),
//       discount: num(charges.discount ?? raw.discount, 0),
//       cgst: num(charges.cgst, 0),
//       sgst: num(charges.sgst, 0),
//       igst: num(charges.igst ?? charges.tax ?? raw.tax, 0),
//     },
//     paymentType: str(raw.paymentType) || "Credit",
//     referenceNo: str(raw.referenceNo ?? raw.awb),
//     commercial: Boolean(raw.commercial),
//     oda: Boolean(raw.oda),
//     medicalCharges: Boolean(raw.medicalCharges),
//     totalPieces: num(raw.totalPieces, fallbackPieces.length || 1),
//     packageType: str(raw.packageType) || "PKT",
//     actualWeight: num(raw.actualWeight ?? raw.actualWeightKg, 0),
//     volumetricWeight: num(
//       raw.volumetricWeight ?? raw.volumetricWeightKg,
//       0,
//     ),
//     chargeableWeight: num(
//       raw.chargeableWeight ?? raw.chargeableWeightKg,
//       0,
//     ),
//     shipmentValue: num(raw.shipmentValue ?? raw.declaredValue, 0),
//     currency: asCurrency(raw.currency),
//   };
// }

// function mapFormToBody(data: AWBBookingData, existingAwb?: string) {
//   const origin =
//     data.origin ||
//     data.shipper.origin ||
//     data.shipper.city ||
//     data.shipper.pincode ||
//     "";
//   const originCode =
//     data.originCode || data.shipper.originCode || "";

//   return {
//     ...(existingAwb ? { awb: existingAwb, existingAwb } : {}),
//     customerId: data.customerId || data.accountCode || "WALKIN",
//     senderId: "WALKIN_SENDER",
//     receiverId: "WALKIN_RECEIVER",
//     customerName: data.customerName,
//     customerCode: data.customerCode || data.accountCode || "",
//     accountCode: data.accountCode,
//     origin,
//     originCode,
//     destination:
//       data.destination || data.consignee.city || data.consignee.country,
//     destinationCode: data.destinationCode,
//     serviceType: deriveServiceType(data.product, data.destination),
//     product: data.product,
//     vendor: data.vendor,
//     serviceId: data.service || data.product || "SELF",
//     service: data.service,
//     shipmentDate: data.bookDate,
//     description: data.content || data.instruction,
//     content: data.content,
//     instruction: data.instruction,
//     shipper: {
//       ...data.shipper,
//       company: data.shipper.company,
//       companyName: data.shipper.company,
//       contactName: data.shipper.contactName,
//       origin,
//       originCode,
//     },
//     consignee: {
//       ...data.consignee,
//       company: data.consignee.company,
//       companyName: data.consignee.company,
//       contactName: data.consignee.contactName,
//     },
//     pieces: (data.pieces || []).map((p, i) => ({
//       quantity: Number(p.quantity) || 1,
//       actualWeightKg: Number(p.weightKg) || 0,
//       lengthCm: Number(p.lengthCm) || 0,
//       widthCm: Number(p.widthCm) || 0,
//       heightCm: Number(p.heightCm) || 0,
//       description: p.description?.trim() || `Piece ${i + 1}`,
//       division: Number(p.division) || undefined,
//     })),
//     gstin: data.shipper.gstin || undefined,
//     csbType: data.csbType,
//     termOfInvoice: data.termOfInvoice,
//     exportReason: data.exportReason,
//     gstInvoice: data.gstInvoice,
//     invoiceNo: data.invoiceNo,
//     invoiceDate: data.invoiceDate,
//     departmentNo: data.departmentNo,
//     format: data.format,
//     items: data.items,
//     freight: data.charges?.freight ?? 0,
//     fuelSurcharge: data.charges?.fuelSurcharge ?? 0,
//     otherCharges:
//       (data.charges?.otherCharges ?? 0) +
//       (data.charges?.contractCharges ?? 0) +
//       (data.charges?.surcharge ?? 0),
//     discount: data.charges?.discount ?? 0,
//     charges: data.charges,
//     gstRate: 18,
//     paymentType: data.paymentType,
//     referenceNo: data.referenceNo,
//     commercial: data.commercial,
//     oda: data.oda,
//     medicalCharges: data.medicalCharges,
//     totalPieces: data.totalPieces,
//     packageType: data.packageType,
//     actualWeight: data.actualWeight,
//     volumetricWeight: data.volumetricWeight,
//     chargeableWeight: data.chargeableWeight,
//     shipmentValue: data.shipmentValue,
//     currency: data.currency,
//   };
// }

// export default function BookingPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const editAwb = (searchParams.get("awb") || "").trim();

//   const { firebaseUser, user, loading: authLoading } = useAuth();

//   const [submitting, setSubmitting] = useState(false);
//   const [createdAwb, setCreatedAwb] = useState("");
//   const [error, setError] = useState<string | null>(null);
//   const [message, setMessage] = useState<string | null>(null);

//   const [loadingAwb, setLoadingAwb] = useState(Boolean(editAwb));
//   const [initialData, setInitialData] =
//     useState<Partial<AWBBookingData> | null>(null);

//   const [defaultAccountCode, setDefaultAccountCode] = useState("");
//   const [defaultClientName, setDefaultClientName] = useState("");
//   const [loadingCoLoaderProfile, setLoadingCoLoaderProfile] =
//     useState(false);

//   const permUser = {
//     userId: user?.userId ?? "",
//     role: user?.role ?? null,
//   };

//   const canCreateAwb = can(permUser, "LOGISTICS_AWB_CREATE");
//   const canUpdateAwb = can(permUser, "LOGISTICS_AWB_UPDATE");

//   const role = String(user?.role || "").trim().toUpperCase();
//   const isCoLoader = role === "CO_LOADER";
//   const isSuperAdmin = role === "SUPER_ADMIN";

//   const canManageCharges = isSuperAdmin;
//   const canEditProformaRestricted = isSuperAdmin;
//   const lockAccountFields = isCoLoader;

//   useEffect(() => {
//     if (authLoading) return;

//     if (!isCoLoader || !firebaseUser) {
//       setDefaultAccountCode("");
//       setDefaultClientName("");
//       setLoadingCoLoaderProfile(false);
//       return;
//     }

//     let cancelled = false;

//     async function loadCoLoaderDefaults() {
//       try {
//         setLoadingCoLoaderProfile(true);

//         const profile = user as {
//           userId?: string;
//           id?: string;
//           email?: string;
//           displayName?: string;
//           name?: string;
//           code?: string;
//           accountCode?: string;
//           coLoaderCode?: string;
//           contactPerson?: string;
//         } | null;

//         const authUid = String(firebaseUser.uid || "").trim();
//         const userEmail = String(
//           profile?.email || firebaseUser.email || "",
//         )
//           .trim()
//           .toLowerCase();
//         const userId = String(
//           profile?.userId || profile?.id || authUid,
//         ).trim();

//         // Optional fields already on users/{uid}
//         let code = String(
//           profile?.coLoaderCode ||
//             profile?.code ||
//             profile?.accountCode ||
//             "",
//         )
//           .trim()
//           .toUpperCase();

//         let clientName = String(
//           profile?.contactPerson ||
//             profile?.displayName ||
//             profile?.name ||
//             "",
//         ).trim();

//         // Primary source: co-loaders master (your Firestore shape)
//         // code, contactPerson, authUid, email, coLoaderId, ...
//         try {
//           const headers = await buildAuthHeaders(firebaseUser);
//           const res = await fetch("/api/logistics/coloaders", {
//             method: "GET",
//             headers,
//             credentials: "include",
//             cache: "no-store",
//           });
//           const json = await res.json();

//           if (res.ok && json.success && !cancelled) {
//             const list = extractList(json.data);

//             // Prefer data.me if API provides it
//             const me =
//               json.data &&
//               typeof json.data === "object" &&
//               !Array.isArray(json.data) &&
//               (json.data as Record<string, unknown>).me
//                 ? asRecord((json.data as Record<string, unknown>).me)
//                 : null;

//             const matched =
//               me ||
//               list.find((row) => {
//                 const rowAuthUid = String(
//                   row.authUid || row.userId || row.uid || "",
//                 ).trim();
//                 const rowEmail = String(row.email || "")
//                   .trim()
//                   .toLowerCase();
//                 const rowCode = String(
//                   row.code || row.coLoaderCode || row.accountCode || "",
//                 )
//                   .trim()
//                   .toUpperCase();
//                 const rowId = String(
//                   row.id || row.coLoaderId || "",
//                 ).trim();

//                 // 1) Same Firebase Auth UID (your doc: authUid)
//                 if (authUid && rowAuthUid && rowAuthUid === authUid) {
//                   return true;
//                 }
//                 // 2) Same email
//                 if (userEmail && rowEmail && rowEmail === userEmail) {
//                   return true;
//                 }
//                 // 3) Same user id
//                 if (userId && rowId && rowId === userId) return true;
//                 if (userId && rowAuthUid && rowAuthUid === userId) {
//                   return true;
//                 }
//                 // 4) Code already known on profile
//                 if (code && rowCode && rowCode === code) return true;
//                 return false;
//               }) ||
//               null;

//             if (matched) {
//               const mCode = String(
//                 matched.code ||
//                   matched.coLoaderCode ||
//                   matched.accountCode ||
//                   "",
//               )
//                 .trim()
//                 .toUpperCase();
//               const mName = String(
//                 matched.contactPerson || matched.name || "",
//               ).trim();

//               if (mCode) code = mCode; // e.g. WF444
//               if (mName) clientName = mName; // e.g. Ram
//             }
//           }
//         } catch {
//           /* keep profile-only values */
//         }

//         // Last resort for Client Name
//         if (!clientName) {
//           clientName = String(
//             profile?.displayName ||
//               profile?.name ||
//               profile?.email ||
//               firebaseUser.email ||
//               "Co-loader",
//           ).trim();
//         }

//         if (!cancelled) {
//           setDefaultAccountCode(code);
//           setDefaultClientName(clientName);
//         }
//       } catch {
//         if (!cancelled) {
//           setDefaultClientName(
//             String(
//               (user as { displayName?: string; name?: string; email?: string })
//                 ?.displayName ||
//                 (user as { name?: string })?.name ||
//                 (user as { email?: string })?.email ||
//                 firebaseUser.email ||
//                 "Co-loader",
//             ).trim(),
//           );
//         }
//       } finally {
//         if (!cancelled) setLoadingCoLoaderProfile(false);
//       }
//     }

//     loadCoLoaderDefaults();
//     return () => {
//       cancelled = true;
//     };
//   }, [authLoading, isCoLoader, firebaseUser, user]);

//   useEffect(() => {
//     if (authLoading) return;
//     if (!editAwb) {
//       setLoadingAwb(false);
//       setInitialData(null);
//       return;
//     }

//     let cancelled = false;

//     async function loadExisting() {
//       try {
//         setLoadingAwb(true);
//         setError(null);

//         if (!firebaseUser) {
//           throw new Error("Authentication is required to load AWB.");
//         }

//         if (!can(permUser, "LOGISTICS_AWB_VIEW") && !canUpdateAwb) {
//           throw new Error("You do not have permission to load this AWB.");
//         }

//         const headers = await buildAuthHeaders(firebaseUser);
//         const res = await fetch(
//           `/api/logistics/awb/search?awb=${encodeURIComponent(editAwb)}&limit=1`,
//           {
//             method: "GET",
//             headers,
//             cache: "no-store",
//           },
//         );

//         const json = (await res.json()) as ApiResponse;

//         if (!res.ok || !json.success) {
//           throw new Error(
//             !json.success
//               ? json.error.message
//               : "Failed to load AWB for editing.",
//           );
//         }

//         const list = Array.isArray(json.data?.results)
//           ? json.data.results
//           : [];

//         if (list.length === 0) {
//           throw new Error(`AWB ${editAwb} was not found.`);
//         }

//         if (!cancelled) {
//           setInitialData(
//             mapAwbDocToForm(list[0] as Record<string, unknown>),
//           );
//         }
//       } catch (e) {
//         if (!cancelled) {
//           setInitialData(null);
//           setError(
//             e instanceof Error
//               ? e.message
//               : "Failed to load AWB for editing.",
//           );
//         }
//       } finally {
//         if (!cancelled) setLoadingAwb(false);
//       }
//     }

//     loadExisting();
//     return () => {
//       cancelled = true;
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [authLoading, firebaseUser, editAwb]);

//   async function handleSubmit(data: AWBBookingData) {
//     if (!canCreateAwb && !canUpdateAwb) {
//       setError("You do not have permission to create or update an AWB.");
//       return;
//     }

//     if (editAwb && !canUpdateAwb) {
//       setError("You do not have permission to update this AWB.");
//       return;
//     }

//     if (!editAwb && !canCreateAwb) {
//       setError("You do not have permission to create an AWB.");
//       return;
//     }

//     try {
//       setSubmitting(true);
//       setError(null);
//       setMessage(null);
//       setCreatedAwb("");

//       if (!firebaseUser) {
//         setError("You must be signed in to save an AWB.");
//         return;
//       }

//       const headers = await buildAuthHeaders(firebaseUser);

//       const safeData: AWBBookingData = lockAccountFields
//         ? {
//             ...data,
//             accountCode: defaultAccountCode || data.accountCode,
//             customerName: defaultClientName || data.customerName,
//           }
//         : data;

//       const isEdit = Boolean(editAwb);
//       const body = mapFormToBody(safeData, isEdit ? editAwb : undefined);

//       const res = await fetch(
//         isEdit
//           ? "/api/logistics/awb/update"
//           : "/api/logistics/awb/create",
//         {
//           method: isEdit ? "PATCH" : "POST",
//           headers,
//           body: JSON.stringify(body),
//         },
//       );

//       const json = (await res.json()) as ApiResponse;

//       if (!res.ok || !json.success) {
//         const msg =
//           !json.success && json.error?.message
//             ? json.error.message
//             : `Save failed (${res.status})`;
//         setError(msg);
//         return;
//       }

//       const awbRaw = json.data?.awb;
//       const awb =
//         typeof awbRaw === "string"
//           ? awbRaw
//           : awbRaw && typeof awbRaw === "object"
//             ? str((awbRaw as Record<string, unknown>).awb, editAwb)
//             : editAwb || "";

//       if (isEdit) {
//         setMessage(json.message || "AWB updated successfully.");
//         router.push(
//           ROUTES.ADMIN_LOGISTICS_AWB || "/admin/logistics/awb",
//         );
//         return;
//       }

//       setCreatedAwb(awb);
//       setMessage(json.message || "AWB created successfully.");
//     } catch (e) {
//       console.error("Booking submit error:", e);
//       setError(
//         e instanceof Error ? e.message : "Unable to save AWB. Try again.",
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   if (authLoading) {
//     return (
//       <div className="flex min-h-[40vh] items-center justify-center gap-2 text-slate-600">
//         <Loader2 className="h-5 w-5 animate-spin" />
//         Loading…
//       </div>
//     );
//   }

//   const canUseForm = canCreateAwb || (Boolean(editAwb) && canUpdateAwb);

//   return (
//     <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-6">
//       <div className="flex flex-wrap items-center justify-between gap-3">
//         <div>
//           <div className="mb-1 flex items-center gap-2 text-sm text-slate-500">
//             <Link
//               href={ROUTES.ADMIN_LOGISTICS_AWB || "/admin/logistics/awb"}
//               className="inline-flex items-center gap-1 hover:text-slate-800"
//             >
//               <ArrowLeft className="h-4 w-4" />
//               AWBs
//             </Link>
//             <span>/</span>
//             <span>{editAwb ? "Update booking" : "Booking"}</span>
//           </div>

//           <h1 className="text-xl font-bold text-slate-900 md:text-2xl">
//             {editAwb ? `Update AWB · ${editAwb}` : "AWB Booking / Entry"}
//           </h1>

//           <p className="mt-0.5 text-sm text-slate-500">
//             {editAwb
//               ? "Review and update shipment details for this AWB."
//               : "Create shipment, calculate charges, and start tracking."}
//           </p>

//           {role ? (
//             <p className="mt-1 text-xs text-slate-400">
//               Signed in as: <span className="font-semibold">{role}</span>
//             </p>
//           ) : null}
//         </div>

//         {isCoLoader ? (
//           <div className="rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-sm font-semibold text-teal-900">
//             Account: {defaultAccountCode || "—"}
//             {defaultClientName ? ` · ${defaultClientName}` : ""}
//           </div>
//         ) : null}
//       </div>

//       {!canUseForm ? (
//         <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
//           <h2 className="font-semibold text-amber-900">
//             Booking access restricted
//           </h2>
//           <p className="mt-1 text-sm text-amber-800">
//             Required permission:{" "}
//             <strong>
//               {editAwb ? "LOGISTICS_AWB_UPDATE" : "LOGISTICS_AWB_CREATE"}
//             </strong>
//             .
//           </p>
//         </div>
//       ) : null}

//       {createdAwb ? (
//         <div className="flex flex-wrap items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
//           <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
//           <div className="flex-1">
//             <p className="font-semibold">AWB created</p>
//             <p className="mt-1 font-mono text-lg">{createdAwb}</p>
//             {message ? (
//               <p className="mt-1 text-sm text-emerald-800">{message}</p>
//             ) : null}
//             <div className="mt-3 flex flex-wrap gap-2">
//               <Link
//                 href={`/admin/logistics/awb/${encodeURIComponent(createdAwb)}`}
//                 className="rounded-lg bg-emerald-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-800"
//               >
//                 Open AWB
//               </Link>
//               <Link
//                 href="/admin/logistics/awb"
//                 className="rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-sm font-medium text-emerald-900"
//               >
//                 AWB list
//               </Link>
//               <button
//                 type="button"
//                 onClick={() => {
//                   setCreatedAwb("");
//                   setMessage(null);
//                 }}
//                 className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700"
//               >
//                 Book another
//               </button>
//             </div>
//           </div>
//         </div>
//       ) : null}

//       {error ? (
//         <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
//           {error}
//         </div>
//       ) : null}

//       {canUseForm &&
//       (loadingAwb || (isCoLoader && loadingCoLoaderProfile)) ? (
//         <div className="flex min-h-[30vh] items-center justify-center gap-2 text-slate-600">
//           <Loader2 className="h-5 w-5 animate-spin" />
//           {loadingAwb
//             ? `Loading AWB ${editAwb}…`
//             : "Loading co-loader profile…"}
//         </div>
//       ) : null}

//       {canUseForm &&
//       !loadingAwb &&
//       !(isCoLoader && loadingCoLoaderProfile) ? (
//         <AWBBookingForm
//           key={
//             editAwb ||
//             `new-${defaultAccountCode}-${defaultClientName}`
//           }
//           defaultAccountCode={defaultAccountCode}
//           defaultClientName={defaultClientName}
//           lockAccountFields={lockAccountFields}
//           canManageCharges={canManageCharges}
//           canEditProformaRestricted={canEditProformaRestricted}
//           initialValue={initialData}
//           editAwb={editAwb || undefined}
//           onSubmit={handleSubmit}
//         />
//       ) : null}

//       {!canUseForm ? (
//         <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
//           <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl">
//             🔒
//           </div>
//           <h2 className="mt-4 text-lg font-bold text-slate-900">
//             AWB booking is restricted
//           </h2>
//           <Link
//             href={ROUTES.ADMIN_LOGISTICS_AWB || "/admin/logistics/awb"}
//             className="mt-5 inline-flex rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
//           >
//             View Existing AWBs
//           </Link>
//         </div>
//       ) : null}

//       {submitting ? (
//         <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/20">
//           <div className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 shadow-lg">
//             <Loader2 className="h-5 w-5 animate-spin text-teal-700" />
//             <span className="text-sm font-medium text-slate-800">
//               {editAwb ? "Saving AWB…" : "Creating AWB…"}
//             </span>
//           </div>
//         </div>
//       ) : null}
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { can } from "@/lib/permissions";
import AWBBookingForm, {
  type AWBBookingData,
} from "@/components/logistics/AWBBookingForm";
import { ROUTES } from "@/utils/constants";

type ApiResponse =
  | {
      success: true;
      data?: {
        awb?: string | Record<string, unknown>;
        documentId?: string;
        results?: Record<string, unknown>[];
        [key: string]: unknown;
      };
      message?: string;
    }
  | {
      success: false;
      error: {
        code: string;
        message: string;
      };
    };

async function buildAuthHeaders(
  firebaseUser: {
    getIdToken: (force?: boolean) => Promise<string>;
    uid?: string;
    email?: string | null;
  } | null,
): Promise<HeadersInit> {
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  if (firebaseUser) {
    const token = await firebaseUser.getIdToken(true);
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

// function deriveServiceType(product: string, destination: string): string {
//   const p = (product || "").toUpperCase();
//   const d = (destination || "").toUpperCase();

//   if (
//     p.includes("INTERNATIONAL") ||
//     ["USA", "UK", "UAE", "CANADA", "AUSTRALIA", "U.S.A"].some((x) =>
//       d.includes(x),
//     )
//   ) {
//     return "INTERNATIONAL";
//   }

//   if (p.includes("CARGO") || p.includes("FREIGHT")) {
//     return "CARGO";
//   }

//   if (p.includes("EXPRESS")) {
//     return "EXPRESS";
//   }

//   return "DOMESTIC";
// }

function asRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {};
}

function str(value: unknown, fallback = ""): string {
  if (value == null) return fallback;
  const s = String(value).trim();
  if (s === "—" || s === "--" || s === "-") return fallback;
  return s;
}

function num(value: unknown, fallback = 0): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function asCurrency(value: unknown): "INR" | "USD" {
  return String(value || "INR").toUpperCase() === "USD" ? "USD" : "INR";
}

function extractList(data: unknown): Record<string, unknown>[] {
  if (Array.isArray(data)) return data as Record<string, unknown>[];
  if (!data || typeof data !== "object") return [];
  const obj = data as Record<string, unknown>;
  for (const key of [
    "items",
    "results",
    "coloaders",
    "coLoaders",
    "rows",
    "data",
  ]) {
    if (Array.isArray(obj[key])) {
      return obj[key] as Record<string, unknown>[];
    }
  }
  return [];
}

// function mapAwbDocToForm(
//   raw: Record<string, unknown>,
// ): Partial<AWBBookingData> {
//   const shipper = asRecord(raw.shipper ?? raw.sender);
//   const consignee = asRecord(raw.consignee ?? raw.receiver);
//   const charges = asRecord(raw.charges);

//   const origin = str(
//     shipper.origin ?? raw.origin ?? shipper.city ?? raw.senderCity,
//   );
//   const originCode = str(
//     shipper.originCode ?? raw.originCode ?? shipper.cityCode,
//   );

//   const piecesRaw = Array.isArray(raw.pieces) ? raw.pieces : [];
//   const pieces = piecesRaw.map((p, i) => {
//     const row = asRecord(p);
//     const dims = asRecord(row.dimensions);
//     return {
//       quantity: num(row.quantity, 1),
//       weightKg: num(
//         row.weightKg ?? row.actualWeightKg ?? row.actualWeight,
//         0,
//       ),
//       lengthCm: num(row.lengthCm ?? dims.length, 0),
//       widthCm: num(row.widthCm ?? dims.width, 0),
//       heightCm: num(row.heightCm ?? dims.height, 0),
//       description: str(row.description, `Piece ${i + 1}`),
//       division: num(row.division, 0) || undefined,
//     };
//   });

//   const itemsRaw = Array.isArray(raw.items) ? raw.items : [];
//   const items = itemsRaw.map((item, i) => {
//     const row = asRecord(item);
//     return {
//       description: str(row.description, `Item ${i + 1}`),
//       quantity: num(row.quantity, 1),
//       rate: num(row.rate ?? row.unitRate, 0),
//       amount: num(row.amount, 0),
//       hsCode: str(row.hsCode),
//       shopName: str(row.shopName),
//       shopAddress: str(row.shopAddress),
//       boxNo: str(row.boxNo, "BOX_1"),
//     };
//   });

//   const fallbackPieces =
//     pieces.length > 0
//       ? pieces
//       : [
//           {
//             quantity: num(raw.totalPieces, 1) || 1,
//             weightKg: num(raw.actualWeight ?? raw.actualWeightKg, 0),
//             lengthCm: 0,
//             widthCm: 0,
//             heightCm: 0,
//             description: "Piece 1",
//           },
//         ];

//   const additionalCharges = Array.isArray(charges.additionalCharges)
//     ? charges.additionalCharges
//     : [];

//   const shipperName = str(
//     shipper.name ?? shipper.companyName ?? raw.senderName,
//   );
//   const shipperCompany = str(
//     shipper.company ?? shipper.companyName ?? raw.senderCompany,
//   );

//   return {
//     customerId: str(raw.customerId),
//     customerName: str(raw.customerName),
//     customerCode: str(raw.customerCode),
//     accountCode: str(raw.accountCode),
//     origin,
//     originCode,
//     destination: str(raw.destination),
//     destinationCode: str(raw.destinationCode),
//     product: str(raw.product ?? raw.serviceType),
//     vendor: str(raw.vendor),
//     service: str(raw.service ?? raw.serviceId) || "SELF",
//     bookDate:
//       str(raw.shipmentDate ?? raw.bookDate).slice(0, 10) || undefined,
//     content: str(raw.description ?? raw.content),
//     instruction: str(raw.instruction),
//     shipper: {
//       name: shipperName,
//       company: shipperCompany,
//       contactName: str(
//         shipper.contactName ?? shipper.contact ?? shipperName,
//       ),
//       addressLine1: str(
//         shipper.addressLine1 ?? shipper.address ?? raw.senderAddress,
//       ),
//       addressLine2: str(shipper.addressLine2),
//       city: str(shipper.city ?? raw.senderCity),
//       state: str(shipper.state ?? raw.senderState),
//       pincode: str(
//         shipper.pincode ?? shipper.postalCode ?? raw.senderPincode,
//       ),
//       country: str(shipper.country ?? raw.senderCountry, "India"),
//       phone: str(shipper.phone ?? raw.senderPhone),
//       mobile: str(shipper.mobile),
//       email: str(shipper.email),
//       gstin: str(shipper.gstin ?? raw.senderTaxId ?? raw.gstin),
//       iecNo: str(shipper.iecNo),
//       documentType: str(shipper.documentType),
//       documentNo: str(shipper.documentNo),
//       origin,
//       originCode,
//     },
//     consignee: {
//       name: str(
//         consignee.name ?? consignee.companyName ?? raw.receiverName,
//       ),
//       company: str(
//         consignee.company ??
//           consignee.companyName ??
//           raw.receiverCompany,
//       ),
//       contactName: str(
//         consignee.contactName ??
//           consignee.contact ??
//           consignee.name ??
//           raw.receiverName,
//       ),
//       addressLine1: str(
//         consignee.addressLine1 ??
//           consignee.address ??
//           raw.receiverAddress,
//       ),
//       addressLine2: str(consignee.addressLine2),
//       city: str(consignee.city ?? raw.receiverCity),
//       state: str(consignee.state ?? raw.receiverState),
//       pincode: str(
//         consignee.pincode ??
//           consignee.postalCode ??
//           raw.receiverPincode,
//       ),
//       country: str(consignee.country ?? raw.receiverCountry, ""),
//       phone: str(consignee.phone ?? raw.receiverPhone),
//       mobile: str(consignee.mobile),
//       email: str(consignee.email),
//       gstin: str(consignee.gstin),
//       iecNo: str(consignee.iecNo),
//       documentType: str(consignee.documentType),
//       documentNo: str(consignee.documentNo),
//       documentUrl: str(consignee.documentUrl),
//     },
//     pieces: fallbackPieces as unknown as AWBBookingData["pieces"],
//     items: items as unknown as AWBBookingData["items"],
//     csbType: str(raw.csbType) || "CSB4",
//     termOfInvoice: str(raw.termOfInvoice) || "CIF",
//     exportReason:
//       str(raw.exportReason) || "UNSOLICITED GIFT - NOT FOR SALE",
//     gstInvoice: Boolean(raw.gstInvoice),
//     invoiceNo: str(raw.invoiceNo),
//     invoiceDate: str(raw.invoiceDate).slice(0, 10) || undefined,
//     departmentNo: str(raw.departmentNo),
//     format: str(raw.format) || "performainv1",
//     charges: {
//       freight: num(charges.freight ?? raw.freight, 0),
//       fuelSurcharge: num(
//         charges.fuelSurcharge ?? raw.fuelSurcharge,
//         0,
//       ),
//       additionalCharges:
//         additionalCharges as unknown as AWBBookingData["charges"]["additionalCharges"],
//       otherCharges: num(charges.otherCharges ?? raw.otherCharges, 0),
//       contractCharges: num(charges.contractCharges, 0),
//       surcharge: num(charges.surcharge, 0),
//       discount: num(charges.discount ?? raw.discount, 0),
//       cgst: num(charges.cgst, 0),
//       sgst: num(charges.sgst, 0),
//       igst: num(charges.igst ?? charges.tax ?? raw.tax, 0),
//     },
//     paymentType: str(raw.paymentType) || "Credit",
//     referenceNo: str(raw.referenceNo ?? raw.awb),
//     commercial: Boolean(raw.commercial),
//     oda: Boolean(raw.oda),
//     medicalCharges: Boolean(raw.medicalCharges),
//     totalPieces: num(raw.totalPieces, fallbackPieces.length || 1),
//     packageType: str(raw.packageType) || "PKT",
//     actualWeight: num(raw.actualWeight ?? raw.actualWeightKg, 0),
//     volumetricWeight: num(
//       raw.volumetricWeight ?? raw.volumetricWeightKg,
//       0,
//     ),
//     chargeableWeight: num(
//       raw.chargeableWeight ?? raw.chargeableWeightKg,
//       0,
//     ),
//     shipmentValue: num(raw.shipmentValue ?? raw.declaredValue, 0),
//     currency: asCurrency(raw.currency),
//   };
// }

function mapAwbDocToForm(
  raw: Record<string, unknown>,
): Partial<AWBBookingData> {
  const shipper = asRecord(raw.shipper ?? raw.sender);
  const consignee = asRecord(raw.consignee ?? raw.receiver);
  const charges = asRecord(raw.charges);

  const origin = str(
    shipper.origin ?? raw.origin ?? shipper.city ?? raw.senderCity,
  );
  const originCode = str(
    shipper.originCode ?? raw.originCode ?? shipper.cityCode,
  );

  // const destination = str(
  //   raw.destination ?? consignee.city ?? consignee.country,
  // );
  // const destinationCode = str(
  //   raw.destinationCode ?? consignee.destinationCode,
  // );

    const destination = str(
    raw.destination ?? consignee.city ?? consignee.country,
  );
  const destinationCode = str(
    raw.destinationCode ||
      consignee.destinationCode ||
      (consignee as { destCode?: string }).destCode ||
      "",
  );
  
  const consigneeCountry = str(
    consignee.country ??
      raw.receiverCountry ??
      raw.destinationCountry ??
      "",
  );

  const piecesRaw = Array.isArray(raw.pieces) ? raw.pieces : [];
  const pieces = piecesRaw.map((p, i) => {
    const row = asRecord(p);
    const dims = asRecord(row.dimensions);
    return {
      quantity: num(row.quantity, 1),
      weightKg: num(
        row.weightKg ?? row.actualWeightKg ?? row.actualWeight,
        0,
      ),
      lengthCm: num(row.lengthCm ?? dims.length, 0),
      widthCm: num(row.widthCm ?? dims.width, 0),
      heightCm: num(row.heightCm ?? dims.height, 0),
      description: str(row.description, `Piece ${i + 1}`),
      division: num(row.division, 0) || undefined,
    };
  });

  const itemsRaw = Array.isArray(raw.items) ? raw.items : [];
  const items = itemsRaw.map((item, i) => {
    const row = asRecord(item);
    return {
      description: str(row.description, `Item ${i + 1}`),
      quantity: num(row.quantity, 1),
      rate: num(row.rate ?? row.unitRate, 0),
      amount: num(row.amount, 0),
      hsCode: str(row.hsCode),
      shopName: str(row.shopName),
      shopAddress: str(row.shopAddress),
      boxNo: str(row.boxNo, "BOX_1"),
    };
  });

  const fallbackPieces =
    pieces.length > 0
      ? pieces
      : [
          {
            quantity: num(raw.totalPieces, 1) || 1,
            weightKg: num(raw.actualWeight ?? raw.actualWeightKg, 0),
            lengthCm: 0,
            widthCm: 0,
            heightCm: 0,
            description: "Piece 1",
          },
        ];

  const additionalCharges = Array.isArray(charges.additionalCharges)
    ? charges.additionalCharges
    : [];

  const shipperName = str(
    shipper.name ?? shipper.companyName ?? raw.senderName,
  );
  const shipperCompany = str(
    shipper.company ?? shipper.companyName ?? raw.senderCompany,
  );

  return {
    // customerId: str(raw.customerId),
    // customerName: str(raw.customerName),
    // customerCode: str(raw.customerCode),
    // accountCode: str(raw.accountCode),
    // origin,
    // originCode,
    // destination,
    // destinationCode,
    // product: str(raw.product ?? raw.serviceType),
    // vendor: str(raw.vendor),
    // service: str(raw.service ?? raw.serviceId) || "SELF",
    customerId: str(raw.customerId),
    // customerName: str(raw.customerName),
    customerName: str(
      raw.customerName ||
        raw.coLoaderName ||
        raw.coloaderName ||
        "",
    ),
    // customerCode: str(raw.customerCode ?? raw.accountCode),
    customerCode: str(
      raw.customerCode ||
        raw.accountCode ||
        raw.coLoaderCode ||
        "",
    ),
    // accountCode: str(
    //   raw.accountCode ?? raw.customerCode ?? raw.coLoaderCode,
    // ),
    accountCode: str(
      raw.accountCode ||
        raw.customerCode ||
        raw.coLoaderCode ||
        raw.coloaderCode ||
        "",
    ),
    origin,
    originCode,
    destination,
    destinationCode,
    product: str(raw.product ?? raw.serviceType),
    productCode: str(raw.productCode),
    vendor: str(raw.vendor),
    service: str(raw.service ?? raw.serviceId) || "SELF",
    serviceCode: str(raw.serviceCode),
    bookDate:
      str(raw.shipmentDate ?? raw.bookDate).slice(0, 10) || undefined,
    content: str(raw.description ?? raw.content),
    instruction: str(raw.instruction),
    shipper: {
      name: shipperName,
      company: shipperCompany,
      contactName: str(
        shipper.contactName ?? shipper.contact ?? shipperName,
      ),
      addressLine1: str(
        shipper.addressLine1 ?? shipper.address ?? raw.senderAddress,
      ),
      addressLine2: str(shipper.addressLine2),
      city: str(shipper.city ?? raw.senderCity),
      state: str(shipper.state ?? raw.senderState),
      pincode: str(
        shipper.pincode ?? shipper.postalCode ?? raw.senderPincode,
      ),
      country: str(shipper.country ?? raw.senderCountry, "India"),
      phone: str(shipper.phone ?? raw.senderPhone),
      mobile: str(shipper.mobile),
      email: str(shipper.email),
      gstin: str(shipper.gstin ?? raw.senderTaxId ?? raw.gstin),
      iecNo: str(shipper.iecNo),
      documentType: str(shipper.documentType),
      documentNo: str(shipper.documentNo),
      origin,
      originCode,
    },
    consignee: {
      name: str(
        consignee.name ?? consignee.companyName ?? raw.receiverName,
      ),
      company: str(
        consignee.company ??
          consignee.companyName ??
          raw.receiverCompany,
      ),
      contactName: str(
        consignee.contactName ??
          consignee.contact ??
          consignee.name ??
          raw.receiverName,
      ),
      addressLine1: str(
        consignee.addressLine1 ??
          consignee.address ??
          raw.receiverAddress,
      ),
      addressLine2: str(consignee.addressLine2),
      city: str(consignee.city ?? raw.receiverCity ?? destination),
      state: str(consignee.state ?? raw.receiverState),
      pincode: str(
        consignee.pincode ??
          consignee.postalCode ??
          raw.receiverPincode,
      ),
      country: consigneeCountry,
      phone: str(consignee.phone ?? raw.receiverPhone),
      mobile: str(consignee.mobile),
      email: str(consignee.email),
      gstin: str(consignee.gstin),
      iecNo: str(consignee.iecNo),
      documentType: str(consignee.documentType),
      documentNo: str(consignee.documentNo),
      documentUrl: str(consignee.documentUrl),
    },
    pieces: fallbackPieces as unknown as AWBBookingData["pieces"],
    items: items as unknown as AWBBookingData["items"],
    csbType: str(raw.csbType) || "CSB4",
    termOfInvoice: str(raw.termOfInvoice) || "CIF",
    exportReason:
      str(raw.exportReason) || "UNSOLICITED GIFT - NOT FOR SALE",
    gstInvoice: Boolean(raw.gstInvoice),
    invoiceNo: str(raw.invoiceNo),
    invoiceDate: str(raw.invoiceDate).slice(0, 10) || undefined,
    departmentNo: str(raw.departmentNo),
    format: str(raw.format) || "performainv1",
    charges: {
      freight: num(charges.freight ?? raw.freight, 0),
      fuelSurcharge: num(
        charges.fuelSurcharge ?? raw.fuelSurcharge,
        0,
      ),
      additionalCharges:
        additionalCharges as unknown as AWBBookingData["charges"]["additionalCharges"],
      otherCharges: num(charges.otherCharges ?? raw.otherCharges, 0),
      contractCharges: num(charges.contractCharges, 0),
      surcharge: num(charges.surcharge, 0),
      discount: num(charges.discount ?? raw.discount, 0),
      cgst: num(charges.cgst, 0),
      sgst: num(charges.sgst, 0),
      igst: num(charges.igst ?? charges.tax ?? raw.tax, 0),
    },
    paymentType: str(raw.paymentType) || "Credit",
    referenceNo: str(raw.referenceNo ?? raw.awb),
    commercial: Boolean(raw.commercial),
    oda: Boolean(raw.oda),
    medicalCharges: Boolean(raw.medicalCharges),
    totalPieces: num(raw.totalPieces, fallbackPieces.length || 1),
    packageType: str(raw.packageType) || "PKT",
    actualWeight: num(raw.actualWeight ?? raw.actualWeightKg, 0),
    volumetricWeight: num(
      raw.volumetricWeight ?? raw.volumetricWeightKg,
      0,
    ),
    chargeableWeight: num(
      raw.chargeableWeight ?? raw.chargeableWeightKg,
      0,
    ),
    shipmentValue: num(raw.shipmentValue ?? raw.declaredValue, 0),
    currency: asCurrency(raw.currency),
  };
}

// function mapFormToBody(data: AWBBookingData, existingAwb?: string) {
//   const origin =
//     data.origin ||
//     data.shipper.origin ||
//     data.shipper.city ||
//     data.shipper.pincode ||
//     "";
//   const originCode = data.originCode || data.shipper.originCode || "";
//   const senderId =
//     str(data.shipper.senderId).trim() || "WALKIN_SENDER";
//   const receiverId =
//     str(data.consignee.receiverId).trim() || "WALKIN_RECEIVER";

//   return {
//     ...(existingAwb ? { awb: existingAwb, existingAwb } : {}),
//     customerId: data.customerId || data.accountCode || "WALKIN",
//     senderId,
//     receiverId,
//     customerName: data.customerName,
//     customerCode: data.customerCode || data.accountCode || "",
//     accountCode: data.accountCode,
//     origin,
//     originCode,
//     destination:
//       data.destination || data.consignee.city || data.consignee.country,
//     destinationCode: data.destinationCode,
//     serviceType: deriveServiceType(data.product, data.destination),
//     product: data.product,
//     vendor: data.vendor,
//     serviceId: data.service || data.product || "SELF",
//     service: data.service,
//     shipmentDate: data.bookDate,
//     description: data.content || data.instruction,
//     content: data.content,
//     instruction: data.instruction,
//     shipper: {
//       ...data.shipper,
//       company: data.shipper.company,
//       companyName: data.shipper.company,
//       contactName: data.shipper.contactName,
//       origin,
//       originCode,
//     },
//     consignee: {
//       ...data.consignee,
//       company: data.consignee.company,
//       companyName: data.consignee.company,
//       contactName: data.consignee.contactName,
//     },
//     pieces: (data.pieces || []).map((p, i) => ({
//       quantity: Number(p.quantity) || 1,
//       actualWeightKg: Number(p.weightKg) || 0,
//       lengthCm: Number(p.lengthCm) || 0,
//       widthCm: Number(p.widthCm) || 0,
//       heightCm: Number(p.heightCm) || 0,
//       description: p.description?.trim() || `Piece ${i + 1}`,
//       division: Number(p.division) || undefined,
//     })),
//     gstin: data.shipper.gstin || undefined,
//     csbType: data.csbType,
//     termOfInvoice: data.termOfInvoice,
//     exportReason: data.exportReason,
//     gstInvoice: data.gstInvoice,
//     invoiceNo: data.invoiceNo,
//     invoiceDate: data.invoiceDate,
//     departmentNo: data.departmentNo,
//     format: data.format,
//     items: data.items,
//     freight: data.charges?.freight ?? 0,
//     fuelSurcharge: data.charges?.fuelSurcharge ?? 0,
//     otherCharges:
//       (data.charges?.otherCharges ?? 0) +
//       (data.charges?.contractCharges ?? 0) +
//       (data.charges?.surcharge ?? 0),
//     discount: data.charges?.discount ?? 0,
//     charges: data.charges,
//     gstRate: 18,
//     paymentType: data.paymentType,
//     referenceNo: data.referenceNo,
//     commercial: data.commercial,
//     oda: data.oda,
//     medicalCharges: data.medicalCharges,
//     totalPieces: data.totalPieces,
//     packageType: data.packageType,
//     actualWeight: data.actualWeight,
//     volumetricWeight: data.volumetricWeight,
//     chargeableWeight: data.chargeableWeight,
//     shipmentValue: data.shipmentValue,
//     currency: data.currency,
//   };
// }

// function mapFormToBody(data: AWBBookingData, existingAwb?: string) {
//   const origin =
//     data.origin ||
//     data.shipper.origin ||
//     data.shipper.city ||
//     data.shipper.pincode ||
//     "";
//   const originCode = data.originCode || data.shipper.originCode || "";
//   const senderId =
//     str(data.shipper.senderId).trim() || "WALKIN_SENDER";
//   const receiverId =
//     str(data.consignee.receiverId).trim() || "WALKIN_RECEIVER";

//   return {
//     ...(existingAwb ? { awb: existingAwb, existingAwb } : {}),
//     customerId: data.customerId || data.accountCode || "WALKIN",
//     senderId,
//     receiverId,
//     customerName: data.customerName,
//     customerCode: data.customerCode || data.accountCode || "",
//     accountCode: data.accountCode,
//     origin,
//     originCode,
//     destination:
//       data.destination || data.consignee.city || data.consignee.country,
//     destinationCode: data.destinationCode,
//     serviceType: deriveServiceType(data.product, data.destination),
//     product: data.product,
//     vendor: data.vendor,
//     serviceId: data.service || data.product || "SELF",
//     service: data.service,
//     shipmentDate: data.bookDate,
//     description: data.content || data.instruction,
//     content: data.content,
//     instruction: data.instruction,
//     shipper: {
//       ...data.shipper,
//       company: data.shipper.company,
//       companyName: data.shipper.company,
//       contactName: data.shipper.contactName,
//       origin,
//       originCode,
//     },
//     consignee: {
//       ...data.consignee,
//       company: data.consignee.company,
//       companyName: data.consignee.company,
//       contactName: data.consignee.contactName,
//       country: data.consignee.country,
//     },
//     pieces: (data.pieces || []).map((p, i) => ({
//       quantity: Number(p.quantity) || 1,
//       actualWeightKg: Number(p.weightKg) || 0,
//       lengthCm: Number(p.lengthCm) || 0,
//       widthCm: Number(p.widthCm) || 0,
//       heightCm: Number(p.heightCm) || 0,
//       description: p.description?.trim() || `Piece ${i + 1}`,
//       division: Number(p.division) || undefined,
//     })),
//     gstin: data.shipper.gstin || undefined,
//     csbType: data.csbType,
//     termOfInvoice: data.termOfInvoice,
//     exportReason: data.exportReason,
//     gstInvoice: data.gstInvoice,
//     invoiceNo: data.invoiceNo,
//     invoiceDate: data.invoiceDate,
//     departmentNo: data.departmentNo,
//     format: data.format,
//     items: data.items,
//     freight: data.charges?.freight ?? 0,
//     fuelSurcharge: data.charges?.fuelSurcharge ?? 0,
//     otherCharges:
//       (data.charges?.otherCharges ?? 0) +
//       (data.charges?.contractCharges ?? 0) +
//       (data.charges?.surcharge ?? 0),
//     discount: data.charges?.discount ?? 0,
//     charges: data.charges,
//     gstRate: 18,
//     paymentType: data.paymentType,
//     referenceNo: data.referenceNo,
//     commercial: data.commercial,
//     oda: data.oda,
//     medicalCharges: data.medicalCharges,
//     totalPieces: data.totalPieces,
//     packageType: data.packageType,
//     actualWeight: data.actualWeight,
//     volumetricWeight: data.volumetricWeight,
//     chargeableWeight: data.chargeableWeight,
//     shipmentValue: data.shipmentValue,
//     declaredValue: data.shipmentValue,
//     currency: data.currency,
//   };
// }

function mapFormToBody(data: AWBBookingData, existingAwb?: string) {
  const origin =
    data.origin ||
    data.shipper.origin ||
    data.shipper.city ||
    data.shipper.pincode ||
    "";
  const originCode = data.originCode || data.shipper.originCode || "";
  const senderId =
    str(data.shipper.senderId).trim() || "WALKIN_SENDER";
  const receiverId =
    str(data.consignee.receiverId).trim() || "WALKIN_RECEIVER";

  // Exact values from the form dropdown — no predefined mapping
  const selectedService = String(data.service || data.product || "").trim();
  const selectedProduct = String(data.product || data.service || "").trim();
    const contentFromItems = (data.items || [])
    .map((it) => {
      const d = String(it.description || "").trim();
      const s = String(it.shopName || "").trim();
      if (d && s) return `${d} (${s})`;
      return d || s;
    })
    .filter(Boolean)
    .join("; ");

  
  return {
    ...(existingAwb ? { awb: existingAwb, existingAwb } : {}),
    customerId: data.customerId || data.accountCode || "WALKIN",
    senderId,
    receiverId,
    customerName: data.customerName,
    customerCode: data.customerCode || data.accountCode || "",
    accountCode: data.accountCode,
    origin,
    originCode,
    destination:
      data.destination || data.consignee.city || data.consignee.country,
    destinationCode: data.destinationCode,

    // Service: store exactly what was selected for this AWB
    // product: selectedProduct,
    // service: selectedService,
    // serviceId: selectedService || selectedProduct || "SELF",
    // serviceType: selectedService || selectedProduct,

    // vendor: data.vendor,

    product: selectedProduct,
    productCode: str(data.productCode),
    service: selectedService,
    serviceCode: str(data.serviceCode),
    serviceId: selectedService || selectedProduct || "SELF",
    serviceType: selectedService || selectedProduct,
    vendor: data.vendor,
    shipmentDate: data.bookDate,
    description: data.content || data.instruction,
    // content: data.content,
    content: contentFromItems || data.content || "",
    instruction: data.instruction,
    specialInstructions: data.instruction,
    // instruction: data.instruction,
    shipper: {
      ...data.shipper,
      company: data.shipper.company,
      companyName: data.shipper.company,
      contactName: data.shipper.contactName,
      origin,
      originCode,
    },
    consignee: {
      ...data.consignee,
      company: data.consignee.company,
      companyName: data.consignee.company,
      contactName: data.consignee.contactName,
      country: data.consignee.country,
    },
    pieces: (data.pieces || []).map((p, i) => ({
      quantity: Number(p.quantity) || 1,
      actualWeightKg: Number(p.weightKg) || 0,
      lengthCm: Number(p.lengthCm) || 0,
      widthCm: Number(p.widthCm) || 0,
      heightCm: Number(p.heightCm) || 0,
      description: p.description?.trim() || `Piece ${i + 1}`,
      division: Number(p.division) || undefined,
    })),
    gstin: data.shipper.gstin || undefined,
    csbType: data.csbType,
    termOfInvoice: data.termOfInvoice,
    exportReason: data.exportReason,
    gstInvoice: data.gstInvoice,
    invoiceNo: data.invoiceNo,
    invoiceDate: data.invoiceDate,
    departmentNo: data.departmentNo,
    format: data.format,
    items: data.items,
    freight: data.charges?.freight ?? 0,
    fuelSurcharge: data.charges?.fuelSurcharge ?? 0,
    otherCharges:
      (data.charges?.otherCharges ?? 0) +
      (data.charges?.contractCharges ?? 0) +
      (data.charges?.surcharge ?? 0),
    discount: data.charges?.discount ?? 0,
    charges: data.charges,
    gstRate: 18,
    paymentType: data.paymentType,
    referenceNo: data.referenceNo,
    commercial: data.commercial,
    oda: data.oda,
    medicalCharges: data.medicalCharges,
    totalPieces: data.totalPieces,
    packageType: data.packageType,
    actualWeight: data.actualWeight,
    volumetricWeight: data.volumetricWeight,
    chargeableWeight: data.chargeableWeight,
    shipmentValue: data.shipmentValue,
    declaredValue: data.shipmentValue,
    currency: data.currency,
  };
}

export default function BookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editAwb = (searchParams.get("awb") || "").trim();

  const { firebaseUser, user, loading: authLoading } = useAuth();

  const [submitting, setSubmitting] = useState(false);
  const [createdAwb, setCreatedAwb] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [loadingAwb, setLoadingAwb] = useState(Boolean(editAwb));
  const [initialData, setInitialData] =
    useState<Partial<AWBBookingData> | null>(null);

  const [defaultAccountCode, setDefaultAccountCode] = useState("");
  const [defaultClientName, setDefaultClientName] = useState("");
  const [loadingCoLoaderProfile, setLoadingCoLoaderProfile] =
    useState(false);

  const permUser = {
    userId: user?.userId ?? "",
    role: user?.role ?? null,
  };

  const canCreateAwb = can(permUser, "LOGISTICS_AWB_CREATE");
  const canUpdateAwb = can(permUser, "LOGISTICS_AWB_UPDATE");

  const role = String(user?.role || "").trim().toUpperCase();
  const isCoLoader = role === "CO_LOADER";
  const isSuperAdmin = role === "SUPER_ADMIN";

  const canManageCharges = isSuperAdmin;
  const canEditProformaRestricted = isSuperAdmin;
  const lockAccountFields = isCoLoader;

  useEffect(() => {
    if (authLoading) return;

    if (!isCoLoader || !firebaseUser) {
      setDefaultAccountCode("");
      setDefaultClientName("");
      setLoadingCoLoaderProfile(false);
      return;
    }

    const fbUser = firebaseUser;
    let cancelled = false;

    async function loadCoLoaderDefaults() {
      try {
        setLoadingCoLoaderProfile(true);

        const profile = user as {
          userId?: string;
          id?: string;
          email?: string;
          displayName?: string;
          name?: string;
          code?: string;
          accountCode?: string;
          coLoaderCode?: string;
          contactPerson?: string;
        } | null;

        const authUid = String(fbUser.uid || "").trim();
        const userEmail = String(profile?.email || fbUser.email || "")
          .trim()
          .toLowerCase();
        const userId = String(
          profile?.userId || profile?.id || authUid,
        ).trim();

        let code = String(
          profile?.coLoaderCode ||
            profile?.code ||
            profile?.accountCode ||
            "",
        )
          .trim()
          .toUpperCase();

        let clientName = String(
          profile?.contactPerson ||
            profile?.displayName ||
            profile?.name ||
            "",
        ).trim();

        try {
          const headers = await buildAuthHeaders(fbUser);
          const res = await fetch("/api/logistics/coloaders", {
            method: "GET",
            headers,
            credentials: "include",
            cache: "no-store",
          });
          const json = await res.json();

          if (res.ok && json.success && !cancelled) {
            const list = extractList(json.data);

            let me: Record<string, unknown> | null = null;
            if (
              json.data &&
              typeof json.data === "object" &&
              !Array.isArray(json.data)
            ) {
              const maybeMe = (json.data as Record<string, unknown>).me;
              if (maybeMe && typeof maybeMe === "object") {
                me = asRecord(maybeMe);
              }
            }

            const matched =
              me ||
              list.find((row) => {
                const rowAuthUid = String(
                  row.authUid || row.userId || row.uid || "",
                ).trim();
                const rowEmail = String(row.email || "")
                  .trim()
                  .toLowerCase();
                const rowCode = String(
                  row.code || row.coLoaderCode || row.accountCode || "",
                )
                  .trim()
                  .toUpperCase();
                const rowId = String(
                  row.id || row.coLoaderId || "",
                ).trim();

                if (authUid && rowAuthUid && rowAuthUid === authUid) {
                  return true;
                }
                if (userEmail && rowEmail && rowEmail === userEmail) {
                  return true;
                }
                if (userId && rowId && rowId === userId) return true;
                if (userId && rowAuthUid && rowAuthUid === userId) {
                  return true;
                }
                if (code && rowCode && rowCode === code) return true;
                return false;
              }) ||
              null;

            if (matched) {
              const mCode = String(
                matched.code ||
                  matched.coLoaderCode ||
                  matched.accountCode ||
                  "",
              )
                .trim()
                .toUpperCase();
              const mName = String(
                matched.contactPerson || matched.name || "",
              ).trim();
              if (mCode) code = mCode;
              if (mName) clientName = mName;
            }
          }
        } catch {
          // ignore network errors
        }

        if (!clientName) {
          clientName = String(
            profile?.displayName ||
              profile?.name ||
              profile?.email ||
              fbUser.email ||
              "Co-loader",
          ).trim();
        }

        if (!cancelled) {
          setDefaultAccountCode(code);
          setDefaultClientName(clientName);
        }
      } catch {
        if (!cancelled) {
          setDefaultClientName(
            String(
              (user as { displayName?: string } | null)?.displayName ||
                (user as { name?: string } | null)?.name ||
                (user as { email?: string } | null)?.email ||
                fbUser.email ||
                "Co-loader",
            ).trim(),
          );
        }
      } finally {
        if (!cancelled) setLoadingCoLoaderProfile(false);
      }
    }

    loadCoLoaderDefaults();

    return () => {
      cancelled = true;
    };
  }, [authLoading, isCoLoader, firebaseUser, user]);

  useEffect(() => {
    if (authLoading) return;

    if (!editAwb) {
      setLoadingAwb(false);
      setInitialData(null);
      return;
    }

    let cancelled = false;

    async function loadExisting() {
      try {
        setLoadingAwb(true);
        setError(null);

        if (!firebaseUser) {
          throw new Error("Authentication is required to load AWB.");
        }

        if (!can(permUser, "LOGISTICS_AWB_VIEW") && !canUpdateAwb) {
          throw new Error("You do not have permission to load this AWB.");
        }

        const headers = await buildAuthHeaders(firebaseUser);
        const res = await fetch(
          `/api/logistics/awb/search?awb=${encodeURIComponent(editAwb)}&limit=1`,
          {
            method: "GET",
            headers,
            cache: "no-store",
          },
        );

        const json = (await res.json()) as ApiResponse;

        if (!res.ok || !json.success) {
          throw new Error(
            !json.success
              ? json.error.message
              : "Failed to load AWB for editing.",
          );
        }

        const list = Array.isArray(json.data?.results)
          ? json.data.results
          : [];

        if (list.length === 0) {
          throw new Error(`AWB ${editAwb} was not found.`);
        }

        if (!cancelled) {
          setInitialData(
            mapAwbDocToForm(list[0] as Record<string, unknown>),
          );
        }
      } catch (e) {
        if (!cancelled) {
          setInitialData(null);
          setError(
            e instanceof Error
              ? e.message
              : "Failed to load AWB for editing.",
          );
        }
      } finally {
        if (!cancelled) setLoadingAwb(false);
      }
    }

    loadExisting();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, firebaseUser, editAwb]);

  async function handleSubmit(data: AWBBookingData) {
    if (!canCreateAwb && !canUpdateAwb) {
      setError("You do not have permission to create or update an AWB.");
      return;
    }

    if (editAwb && !canUpdateAwb) {
      setError("You do not have permission to update this AWB.");
      return;
    }

    if (!editAwb && !canCreateAwb) {
      setError("You do not have permission to create an AWB.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setMessage(null);
      setCreatedAwb("");

      if (!firebaseUser) {
        setError("You must be signed in to save an AWB.");
        return;
      }

      const headers = await buildAuthHeaders(firebaseUser);

      const safeData: AWBBookingData = lockAccountFields
        ? {
            ...data,
            accountCode: defaultAccountCode || data.accountCode,
            customerName: defaultClientName || data.customerName,
          }
        : data;

      const isEdit = Boolean(editAwb);
      const body = mapFormToBody(safeData, isEdit ? editAwb : undefined);

      const res = await fetch(
        isEdit
          ? "/api/logistics/awb/update"
          : "/api/logistics/awb/create",
        {
          method: isEdit ? "PATCH" : "POST",
          headers,
          body: JSON.stringify(body),
        },
      );

      const json = (await res.json()) as ApiResponse;

      if (!res.ok || !json.success) {
        const msg =
          !json.success && json.error?.message
            ? json.error.message
            : `Save failed (${res.status})`;
        setError(msg);
        return;
      }

      const awbRaw = json.data?.awb;
      const awb =
        typeof awbRaw === "string"
          ? awbRaw
          : awbRaw && typeof awbRaw === "object"
            ? str((awbRaw as Record<string, unknown>).awb, editAwb)
            : editAwb || "";

      // if (isEdit) {
      //   setMessage(json.message || "AWB updated successfully.");
      //   router.push(
      //     ROUTES.ADMIN_LOGISTICS_AWB || "/admin/logistics/awb",
      //   );
      //   return;
      // }

      // setCreatedAwb(awb);
      // setMessage(json.message || "AWB created successfully.");
      // if (isEdit) {
      //   setMessage(json.message || "AWB updated successfully.");
      //   router.push(
      //     `/admin/logistics/awb/${encodeURIComponent(editAwb)}`,
      //   );
      //   return;
      // }

      // if (isEdit) {
      //   setMessage(json.message || "AWB updated successfully.");
      //   router.push(
      //     `/admin/logistics/awb/${encodeURIComponent(editAwb)}?t=${Date.now()}`,
      //   );
      //   router.refresh();
      //   return;
      // }

      if (isEdit) {
        setMessage(json.message || "AWB updated successfully.");
        router.push(
          `/admin/logistics/awb/${encodeURIComponent(editAwb)}?t=${Date.now()}`,
        );
        router.refresh();
        return;
      }

      if (!awb) {
        setError("AWB was created but no AWB number was returned.");
        return;
      }

      // Redirect to detail page, e.g. /admin/logistics/awb/2609230001
      router.push(`/admin/logistics/awb/${encodeURIComponent(awb)}`);
    } catch (e) {
      console.error("Booking submit error:", e);
      setError(
        e instanceof Error ? e.message : "Unable to save AWB. Try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (authLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center gap-2 text-slate-600">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading…
      </div>
    );
  }

  const canUseForm = canCreateAwb || (Boolean(editAwb) && canUpdateAwb);

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="mb-1 flex items-center gap-2 text-sm text-slate-500">
            <Link
              href={ROUTES.ADMIN_LOGISTICS_AWB || "/admin/logistics/awb"}
              className="inline-flex items-center gap-1 hover:text-slate-800"
            >
              <ArrowLeft className="h-4 w-4" />
              AWBs
            </Link>
            <span>/</span>
            <span>{editAwb ? "Update booking" : "Booking"}</span>
          </div>

          <h1 className="text-xl font-bold text-slate-900 md:text-2xl">
            {editAwb ? `Update AWB · ${editAwb}` : "AWB Booking / Entry"}
          </h1>

          <p className="mt-0.5 text-sm text-slate-500">
            {editAwb
              ? "Review and update shipment details for this AWB."
              : "Create shipment, calculate charges, and start tracking."}
          </p>

          {role ? (
            <p className="mt-1 text-xs text-slate-400">
              Signed in as: <span className="font-semibold">{role}</span>
            </p>
          ) : null}
        </div>

        {isCoLoader ? (
          <div className="rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-sm font-semibold text-teal-900">
            Account: {defaultAccountCode || "—"}
            {defaultClientName ? ` · ${defaultClientName}` : ""}
          </div>
        ) : null}
      </div>

      {!canUseForm ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
          <h2 className="font-semibold text-amber-900">
            Booking access restricted
          </h2>
          <p className="mt-1 text-sm text-amber-800">
            Required permission:{" "}
            <strong>
              {editAwb ? "LOGISTICS_AWB_UPDATE" : "LOGISTICS_AWB_CREATE"}
            </strong>
            .
          </p>
        </div>
      ) : null}

      {createdAwb ? (
        <div className="flex flex-wrap items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
          <div className="flex-1">
            <p className="font-semibold">AWB created</p>
            <p className="mt-1 font-mono text-lg">{createdAwb}</p>
            {message ? (
              <p className="mt-1 text-sm text-emerald-800">{message}</p>
            ) : null}
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                href={`/admin/logistics/awb/${encodeURIComponent(createdAwb)}`}
                className="rounded-lg bg-emerald-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-800"
              >
                Open AWB
              </Link>
              <Link
                href="/admin/logistics/awb"
                className="rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-sm font-medium text-emerald-900"
              >
                AWB list
              </Link>
              <button
                type="button"
                onClick={() => {
                  setCreatedAwb("");
                  setMessage(null);
                }}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700"
              >
                Book another
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      ) : null}

      {canUseForm &&
      (loadingAwb || (isCoLoader && loadingCoLoaderProfile)) ? (
        <div className="flex min-h-[30vh] items-center justify-center gap-2 text-slate-600">
          <Loader2 className="h-5 w-5 animate-spin" />
          {loadingAwb
            ? `Loading AWB ${editAwb}…`
            : "Loading co-loader profile…"}
        </div>
      ) : null}

      {canUseForm &&
      !loadingAwb &&
      !(isCoLoader && loadingCoLoaderProfile) ? (
        <AWBBookingForm
          key={
            editAwb || `new-${defaultAccountCode}-${defaultClientName}`
          }
          defaultAccountCode={defaultAccountCode}
          defaultClientName={defaultClientName}
          lockAccountFields={lockAccountFields}
          canManageCharges={canManageCharges}
          canEditProformaRestricted={canEditProformaRestricted}
          initialValue={initialData}
          editAwb={editAwb || undefined}
          onSubmit={handleSubmit}
        />
      ) : null}

      {!canUseForm ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl">
            🔒
          </div>
          <h2 className="mt-4 text-lg font-bold text-slate-900">
            AWB booking is restricted
          </h2>
          <Link
            href={ROUTES.ADMIN_LOGISTICS_AWB || "/admin/logistics/awb"}
            className="mt-5 inline-flex rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            View Existing AWBs
          </Link>
        </div>
      ) : null}

      {submitting ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/20">
          <div className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 shadow-lg">
            <Loader2 className="h-5 w-5 animate-spin text-teal-700" />
            <span className="text-sm font-medium text-slate-800">
              {editAwb ? "Saving AWB…" : "Creating AWB…"}
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
}