// "use client";

// export type ShipperFormData = {
//   senderId?: string;
//   name: string;
//   company?: string;
//   contactName?: string;
//   phone: string;
//   mobile?: string;
//   email?: string;
//   addressLine1: string;
//   addressLine2?: string;
//   city: string;
//   state?: string;
//   pincode: string;
//   country: string;
//   // Extra fields for Xpression / customs
//   gstin?: string;
//   iecNo?: string;
//   documentType?: string;
//   documentNo?: string;
//   origin?: string;
//   originCode?: string;
// };

// type ShipperFormProps = {
//   value: ShipperFormData;
//   onChange: (value: ShipperFormData) => void;
//   disabled?: boolean;
// };

// const DOCUMENT_TYPES = [
//   "Select",
//   "GSTIN (Normal)",
//   "AADHAAR",
//   "PAN",
//   "PASSPORT",
//   "IEC",
//   "OTHER",
// ];

// export default function ShipperForm({
//   value,
//   onChange,
//   disabled = false,
// }: ShipperFormProps) {
//   const update = <K extends keyof ShipperFormData>(
//     field: K,
//     fieldValue: ShipperFormData[K],
//   ) => {
//     onChange({ ...value, [field]: fieldValue });
//   };

//   const input =
//     "h-9 w-full rounded border border-gray-300 bg-white px-2.5 text-sm outline-none focus:border-slate-600 disabled:bg-gray-50";
//   const label = "mb-1 block text-xs font-medium text-gray-600";

//   return (
//     <div className="space-y-3">
//       {/* Origin row */}
//       <div className="grid grid-cols-2 gap-2">
//         <div>
//           <label className={label}>Origin *</label>
//           <input
//             value={value.origin ?? ""}
//             onChange={(e) => update("origin", e.target.value)}
//             placeholder="HYDERABAD"
//             className={input}
//             disabled={disabled}
//           />
//         </div>
//         <div>
//           <label className={label}>Origin Code</label>
//           <input
//             value={value.originCode ?? ""}
//             onChange={(e) => update("originCode", e.target.value)}
//             placeholder="HYD"
//             className={input}
//             disabled={disabled}
//           />
//         </div>
//       </div>

//       <div>
//         <label className={label}>Company Name *</label>
//         <input
//           value={value.company ?? ""}
//           onChange={(e) => update("company", e.target.value)}
//           className={input}
//           disabled={disabled}
//         />
//       </div>

//       <div className="grid grid-cols-2 gap-2">
//         <div>
//           <label className={label}>Contact Name</label>
//           <input
//             value={value.contactName ?? value.name}
//             onChange={(e) => update("contactName", e.target.value)}
//             className={input}
//             disabled={disabled}
//           />
//         </div>
//         <div>
//           <label className={label}>Name *</label>
//           <input
//             value={value.name}
//             onChange={(e) => update("name", e.target.value)}
//             className={input}
//             disabled={disabled}
//             required
//           />
//         </div>
//       </div>

//       <div>
//         <label className={label}>Address 1 *</label>
//         <input
//           value={value.addressLine1}
//           onChange={(e) => update("addressLine1", e.target.value)}
//           className={input}
//           disabled={disabled}
//           required
//         />
//       </div>

//       <div>
//         <label className={label}>Address 2</label>
//         <input
//           value={value.addressLine2 ?? ""}
//           onChange={(e) => update("addressLine2", e.target.value)}
//           className={input}
//           disabled={disabled}
//         />
//       </div>

//       <div className="grid grid-cols-2 gap-2">
//         <div>
//           <label className={label}>Pincode</label>
//           <input
//             value={value.pincode}
//             onChange={(e) => update("pincode", e.target.value)}
//             className={input}
//             disabled={disabled}
//           />
//         </div>
//         <div>
//           <label className={label}>City *</label>
//           <input
//             value={value.city}
//             onChange={(e) => update("city", e.target.value)}
//             className={input}
//             disabled={disabled}
//             required
//           />
//         </div>
//       </div>

//       <div className="grid grid-cols-2 gap-2">
//         <div>
//           <label className={label}>State</label>
//           <input
//             value={value.state ?? ""}
//             onChange={(e) => update("state", e.target.value)}
//             className={input}
//             disabled={disabled}
//           />
//         </div>
//         <div>
//           <label className={label}>Telephone *</label>
//           <input
//             value={value.phone}
//             onChange={(e) => update("phone", e.target.value)}
//             className={input}
//             disabled={disabled}
//             required
//           />
//         </div>
//       </div>

//       <div className="grid grid-cols-2 gap-2">
//         <div>
//           <label className={label}>Mobile No.</label>
//           <input
//             value={value.mobile ?? ""}
//             onChange={(e) => update("mobile", e.target.value)}
//             className={input}
//             disabled={disabled}
//           />
//         </div>
//         <div>
//           <label className={label}>E-Mail</label>
//           <input
//             type="email"
//             value={value.email ?? ""}
//             onChange={(e) => update("email", e.target.value)}
//             className={input}
//             disabled={disabled}
//           />
//         </div>
//       </div>

//       <div className="grid grid-cols-2 gap-2">
//         <div>
//           <label className={label}>Country</label>
//           <input
//             value={value.country}
//             onChange={(e) => update("country", e.target.value)}
//             className={input}
//             disabled={disabled}
//           />
//         </div>
//         <div>
//           <label className={label}>IEC No.</label>
//           <input
//             value={value.iecNo ?? ""}
//             onChange={(e) => update("iecNo", e.target.value)}
//             className={input}
//             disabled={disabled}
//           />
//         </div>
//       </div>

//       <div className="grid grid-cols-2 gap-2">
//         <div>
//           <label className={label}>Document Type</label>
//           <select
//             value={value.documentType ?? ""}
//             onChange={(e) => update("documentType", e.target.value)}
//             className={input}
//             disabled={disabled}
//           >
//             {DOCUMENT_TYPES.map((t) => (
//               <option key={t} value={t === "Select" ? "" : t}>
//                 {t}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div>
//           <label className={label}>Document No.</label>
//           <input
//             value={value.documentNo ?? ""}
//             onChange={(e) => update("documentNo", e.target.value)}
//             className={input}
//             disabled={disabled}
//           />
//         </div>
//       </div>

//       <div>
//         <label className={label}>GSTIN</label>
//         <input
//           value={value.gstin ?? ""}
//           onChange={(e) =>
//             update("gstin", e.target.value.toUpperCase())
//           }
//           className={input}
//           disabled={disabled}
//         />
//       </div>
//     </div>
//   );
// }

// "use client";

// export type ShipperFormData = {
//   senderId?: string;
//   name: string;
//   company?: string;
//   contactName?: string;
//   phone: string;
//   mobile?: string;
//   email?: string;
//   addressLine1: string;
//   addressLine2?: string;
//   city: string;
//   state?: string;
//   pincode: string;
//   country: string;
//   gstin?: string;
//   iecNo?: string;
//   documentType?: string;
//   documentNo?: string;
//   origin?: string;
//   originCode?: string;
// };

// type ShipperFormProps = {
//   value: ShipperFormData;
//   onChange: (value: ShipperFormData) => void;
//   disabled?: boolean;
// };

// const DOCUMENT_TYPES = [
//   "Select",
//   "GSTIN (Normal)",
//   "AADHAAR",
//   "PAN",
//   "PASSPORT",
//   "IEC",
//   "OTHER",
// ];

// export default function ShipperForm({
//   value,
//   onChange,
//   disabled = false,
// }: ShipperFormProps) {
//   const update = <K extends keyof ShipperFormData>(
//     field: K,
//     fieldValue: ShipperFormData[K],
//   ) => {
//     onChange({ ...value, [field]: fieldValue });
//   };

//   const input =
//     "h-9 w-full rounded border border-gray-300 bg-white px-2.5 text-sm outline-none focus:border-slate-600 disabled:bg-gray-50";
//   const label = "mb-1 block text-xs font-medium text-gray-600";

//   return (
//     <div className="space-y-3">
//       <div className="grid grid-cols-2 gap-2">
//         <div>
//           <label className={label}>Origin *</label>
//           <input
//             value={value.origin ?? ""}
//             onChange={(e) => update("origin", e.target.value)}
//             placeholder="HYDERABAD"
//             className={input}
//             disabled={disabled}
//           />
//         </div>
//         <div>
//           <label className={label}>Origin Code</label>
//           <input
//             value={value.originCode ?? ""}
//             onChange={(e) => update("originCode", e.target.value)}
//             placeholder="HYD"
//             className={input}
//             disabled={disabled}
//           />
//         </div>
//       </div>

//       <div>
//         <label className={label}>Company Name *</label>
//         <input
//           value={value.company ?? ""}
//           onChange={(e) => update("company", e.target.value)}
//           className={input}
//           disabled={disabled}
//         />
//       </div>

//       {/* GSTIN directly under company name */}
//       <div>
//         <label className={label}>GSTIN</label>
//         <input
//           value={value.gstin ?? ""}
//           onChange={(e) => update("gstin", e.target.value.toUpperCase())}
//           placeholder="22AAAAA0000A1Z5"
//           className={input}
//           disabled={disabled}
//         />
//       </div>

//       <div className="grid grid-cols-2 gap-2">
//         <div>
//           <label className={label}>Contact Name</label>
//           <input
//             value={value.contactName ?? value.name}
//             onChange={(e) => update("contactName", e.target.value)}
//             className={input}
//             disabled={disabled}
//           />
//         </div>
//         <div>
//           <label className={label}>Name *</label>
//           <input
//             value={value.name}
//             onChange={(e) => update("name", e.target.value)}
//             className={input}
//             disabled={disabled}
//             required
//           />
//         </div>
//       </div>

//       <div>
//         <label className={label}>Address 1 *</label>
//         <input
//           value={value.addressLine1}
//           onChange={(e) => update("addressLine1", e.target.value)}
//           className={input}
//           disabled={disabled}
//           required
//         />
//       </div>

//       <div>
//         <label className={label}>Address 2</label>
//         <input
//           value={value.addressLine2 ?? ""}
//           onChange={(e) => update("addressLine2", e.target.value)}
//           className={input}
//           disabled={disabled}
//         />
//       </div>

//       <div className="grid grid-cols-2 gap-2">
//         <div>
//           <label className={label}>Pincode</label>
//           <input
//             value={value.pincode}
//             onChange={(e) => update("pincode", e.target.value)}
//             className={input}
//             disabled={disabled}
//           />
//         </div>
//         <div>
//           <label className={label}>City *</label>
//           <input
//             value={value.city}
//             onChange={(e) => update("city", e.target.value)}
//             className={input}
//             disabled={disabled}
//             required
//           />
//         </div>
//       </div>

//       <div className="grid grid-cols-2 gap-2">
//         <div>
//           <label className={label}>State</label>
//           <input
//             value={value.state ?? ""}
//             onChange={(e) => update("state", e.target.value)}
//             className={input}
//             disabled={disabled}
//           />
//         </div>
//         <div>
//           <label className={label}>Telephone *</label>
//           <input
//             value={value.phone}
//             onChange={(e) => update("phone", e.target.value)}
//             className={input}
//             disabled={disabled}
//             required
//           />
//         </div>
//       </div>

//       <div className="grid grid-cols-2 gap-2">
//         <div>
//           <label className={label}>Mobile No.</label>
//           <input
//             value={value.mobile ?? ""}
//             onChange={(e) => update("mobile", e.target.value)}
//             className={input}
//             disabled={disabled}
//           />
//         </div>
//         <div>
//           <label className={label}>E-Mail</label>
//           <input
//             type="email"
//             value={value.email ?? ""}
//             onChange={(e) => update("email", e.target.value)}
//             className={input}
//             disabled={disabled}
//           />
//         </div>
//       </div>

//       <div className="grid grid-cols-2 gap-2">
//         <div>
//           <label className={label}>Country</label>
//           <input
//             value={value.country}
//             onChange={(e) => update("country", e.target.value)}
//             className={input}
//             disabled={disabled}
//           />
//         </div>
//         <div>
//           <label className={label}>IEC No.</label>
//           <input
//             value={value.iecNo ?? ""}
//             onChange={(e) => update("iecNo", e.target.value)}
//             className={input}
//             disabled={disabled}
//           />
//         </div>
//       </div>

//       <div className="grid grid-cols-2 gap-2">
//         <div>
//           <label className={label}>Document Type</label>
//           <select
//             value={value.documentType ?? ""}
//             onChange={(e) => update("documentType", e.target.value)}
//             className={input}
//             disabled={disabled}
//           >
//             {DOCUMENT_TYPES.map((t) => (
//               <option key={t} value={t === "Select" ? "" : t}>
//                 {t}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div>
//           <label className={label}>Document No.</label>
//           <input
//             value={value.documentNo ?? ""}
//             onChange={(e) => update("documentNo", e.target.value)}
//             className={input}
//             disabled={disabled}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// "use client";

// export type ShipperFormData = {
//   senderId?: string;
//   /** Used by API / masters — synced from contactName */
//   name: string;
//   company?: string;
//   contactName?: string;
//   phone: string;
//   mobile?: string;
//   email?: string;
//   addressLine1: string;
//   addressLine2?: string;
//   city: string;
//   state?: string;
//   pincode: string;
//   country: string;
//   gstin?: string;
//   iecNo?: string;
//   documentType?: string;
//   documentNo?: string;
//   origin?: string;
//   originCode?: string; // ← keep
// };

// type ShipperFormProps = {
//   value: ShipperFormData;
//   onChange: (value: ShipperFormData) => void;
//   disabled?: boolean;
// };

// const DOCUMENT_TYPES = [
//   { value: "", label: "Select" },
//   { value: "AADHAAR", label: "Aadhaar Number" },
//   { value: "GSTIN (Normal)", label: "GSTIN (Normal)" },
//   { value: "PAN", label: "PAN Number" },
//   { value: "PASSPORT", label: "Passport Number" },
//   { value: "TAN", label: "TAN Number" },
//   { value: "VOTER_ID", label: "Voter Id" },
// ];

// export default function ShipperForm({
//   value,
//   onChange,
//   disabled = false,
// }: ShipperFormProps) {
//   const update = <K extends keyof ShipperFormData>(
//     field: K,
//     fieldValue: ShipperFormData[K],
//   ) => {
//     onChange({ ...value, [field]: fieldValue });
//   };

//   /** Contact Name drives display + API `name` */
//   const updateContactName = (contactName: string) => {
//     onChange({
//       ...value,
//       contactName,
//       name: contactName.trim() || value.company || value.name || "",
//     });
//   };

//   const input =
//     "h-9 w-full rounded border border-gray-300 bg-white px-2.5 text-sm outline-none focus:border-slate-600 disabled:bg-gray-50";
//   const label = "mb-1 block text-xs font-medium text-gray-600";

//   return (
//     <div className="space-y-3">
//       <div>
//         <label className={label}>Origin *</label>
//         <input
//           value={value.origin ?? ""}
//           onChange={(e) => update("origin", e.target.value)}
//           placeholder="HYDERABAD"
//           className={input}
//           disabled={disabled}
//         />
//       </div>

//       <div>
//         <label className={label}>Company Name *</label>
//         <input
//           value={value.company ?? ""}
//           onChange={(e) => update("company", e.target.value)}
//           className={input}
//           disabled={disabled}
//         />
//       </div>

//       <div>
//         <label className={label}>GSTIN</label>
//         <input
//           value={value.gstin ?? ""}
//           onChange={(e) => update("gstin", e.target.value.toUpperCase())}
//           placeholder="22AAAAA0000A1Z5"
//           className={input}
//           disabled={disabled}
//         />
//       </div>

//       <div>
//         <label className={label}>Contact Name *</label>
//         <input
//           value={value.contactName ?? value.name ?? ""}
//           onChange={(e) => updateContactName(e.target.value)}
//           className={input}
//           disabled={disabled}
//         />
//       </div>

//       <div>
//         <label className={label}>Address 1 *</label>
//         <input
//           value={value.addressLine1}
//           onChange={(e) => update("addressLine1", e.target.value)}
//           className={input}
//           disabled={disabled}
//         />
//       </div>

//       <div>
//         <label className={label}>Address 2</label>
//         <input
//           value={value.addressLine2 ?? ""}
//           onChange={(e) => update("addressLine2", e.target.value)}
//           className={input}
//           disabled={disabled}
//         />
//       </div>

//       <div className="grid grid-cols-2 gap-2">
//         <div>
//           <label className={label}>Pincode</label>
//           <input
//             value={value.pincode}
//             onChange={(e) => update("pincode", e.target.value)}
//             className={input}
//             disabled={disabled}
//           />
//         </div>
//         <div>
//           <label className={label}>City *</label>
//           <input
//             value={value.city}
//             onChange={(e) => update("city", e.target.value)}
//             className={input}
//             disabled={disabled}
//           />
//         </div>
//       </div>

//       <div className="grid grid-cols-2 gap-2">
//         <div>
//           <label className={label}>State</label>
//           <input
//             value={value.state ?? ""}
//             onChange={(e) => update("state", e.target.value)}
//             className={input}
//             disabled={disabled}
//           />
//         </div>
//         <div>
//           <label className={label}>Telephone *</label>
//           <input
//             value={value.phone}
//             onChange={(e) => update("phone", e.target.value)}
//             className={input}
//             disabled={disabled}
//           />
//         </div>
//       </div>

//       <div className="grid grid-cols-2 gap-2">
//         <div>
//           <label className={label}>Mobile No.</label>
//           <input
//             value={value.mobile ?? ""}
//             onChange={(e) => update("mobile", e.target.value)}
//             className={input}
//             disabled={disabled}
//           />
//         </div>
//         <div>
//           <label className={label}>E-Mail</label>
//           <input
//             type="email"
//             value={value.email ?? ""}
//             onChange={(e) => update("email", e.target.value)}
//             className={input}
//             disabled={disabled}
//           />
//         </div>
//       </div>

//       <div className="grid grid-cols-2 gap-2">
//         <div>
//           <label className={label}>Country</label>
//           <input
//             value={value.country}
//             onChange={(e) => update("country", e.target.value)}
//             className={input}
//             disabled={disabled}
//           />
//         </div>
//         <div>
//           <label className={label}>IEC No.</label>
//           <input
//             value={value.iecNo ?? ""}
//             onChange={(e) => update("iecNo", e.target.value)}
//             className={input}
//             disabled={disabled}
//           />
//         </div>
//       </div>

//       <div className="grid grid-cols-2 gap-2">
//         <div>
//           <label className={label}>Document Type</label>
//           <select
//             value={value.documentType ?? ""}
//             onChange={(e) => update("documentType", e.target.value)}
//             className={input}
//             disabled={disabled}
//           >
//             {DOCUMENT_TYPES.map((t) => (
//               <option key={t.value || "select"} value={t.value}>
//                 {t.label}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div>
//           <label className={label}>Document No.</label>
//           <input
//             value={value.documentNo ?? ""}
//             onChange={(e) => update("documentNo", e.target.value)}
//             className={input}
//             disabled={disabled}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// "use client";

// export type ShipperFormData = {
//   senderId?: string;
//   /** Used by API / masters — synced from contactName */
//   name: string;
//   company?: string;
//   contactName?: string;
//   phone: string;
//   mobile?: string;
//   email?: string;
//   addressLine1: string;
//   addressLine2?: string;
//   city: string;
//   state?: string;
//   pincode: string;
//   country: string;
//   gstin?: string;
//   iecNo?: string;
//   documentType?: string;
//   documentNo?: string;
//   origin?: string;
//   originCode?: string;
// };

// type ShipperFormProps = {
//   value: ShipperFormData;
//   onChange: (value: ShipperFormData) => void;
//   disabled?: boolean;
// };

// const DOCUMENT_TYPES = [
//   { value: "", label: "Select" },
//   { value: "AADHAAR", label: "Aadhaar Number" },
//   { value: "GSTIN (Normal)", label: "GSTIN (Normal)" },
//   { value: "PAN", label: "PAN Number" },
//   { value: "PASSPORT", label: "Passport Number" },
//   { value: "TAN", label: "TAN Number" },
//   { value: "VOTER_ID", label: "Voter Id" },
// ];

// export default function ShipperForm({
//   value,
//   onChange,
//   disabled = false,
// }: ShipperFormProps) {
//   const update = <K extends keyof ShipperFormData>(
//     field: K,
//     fieldValue: ShipperFormData[K],
//   ) => {
//     onChange({ ...value, [field]: fieldValue });
//   };

//   /** Contact Name drives display + API `name` */
//   const updateContactName = (contactName: string) => {
//     onChange({
//       ...value,
//       contactName,
//       name: contactName.trim() || value.company || value.name || "",
//     });
//   };

//   const input =
//     "h-9 w-full rounded border border-gray-300 bg-white px-2.5 text-sm outline-none focus:border-slate-600 disabled:bg-gray-50";
//   const label = "mb-1 block text-xs font-medium text-gray-600";

//   return (
//     <div className="space-y-3">
//       <div className="grid grid-cols-2 gap-2">
//         <div>
//           <label className={label}>Origin *</label>
//           <input
//             value={value.origin ?? ""}
//             onChange={(e) => update("origin", e.target.value)}
//             placeholder="HYDERABAD"
//             className={input}
//             disabled={disabled}
//           />
//         </div>
//         <div>
//           <label className={label}>Origin Code</label>
//           <input
//             value={value.originCode ?? ""}
//             onChange={(e) => update("originCode", e.target.value)}
//             placeholder="HYD"
//             className={input}
//             disabled={disabled}
//           />
//         </div>
//       </div>

//       <div>
//         <label className={label}>Company Name *</label>
//         <input
//           value={value.company ?? ""}
//           onChange={(e) => update("company", e.target.value)}
//           className={input}
//           disabled={disabled}
//         />
//       </div>

//       <div>
//         <label className={label}>GSTIN</label>
//         <input
//           value={value.gstin ?? ""}
//           onChange={(e) => update("gstin", e.target.value.toUpperCase())}
//           placeholder="22AAAAA0000A1Z5"
//           className={input}
//           disabled={disabled}
//         />
//       </div>

//       <div>
//         <label className={label}>Contact Name *</label>
//         <input
//           value={value.contactName ?? value.name ?? ""}
//           onChange={(e) => updateContactName(e.target.value)}
//           className={input}
//           disabled={disabled}
//         />
//       </div>

//       <div>
//         <label className={label}>Address 1 *</label>
//         <input
//           value={value.addressLine1}
//           onChange={(e) => update("addressLine1", e.target.value)}
//           className={input}
//           disabled={disabled}
//         />
//       </div>

//       <div>
//         <label className={label}>Address 2</label>
//         <input
//           value={value.addressLine2 ?? ""}
//           onChange={(e) => update("addressLine2", e.target.value)}
//           className={input}
//           disabled={disabled}
//         />
//       </div>

//       <div className="grid grid-cols-2 gap-2">
//         <div>
//           <label className={label}>Pincode</label>
//           <input
//             value={value.pincode}
//             onChange={(e) => update("pincode", e.target.value)}
//             className={input}
//             disabled={disabled}
//           />
//         </div>
//         <div>
//           <label className={label}>City *</label>
//           <input
//             value={value.city}
//             onChange={(e) => update("city", e.target.value)}
//             className={input}
//             disabled={disabled}
//           />
//         </div>
//       </div>

//       <div className="grid grid-cols-2 gap-2">
//         <div>
//           <label className={label}>State</label>
//           <input
//             value={value.state ?? ""}
//             onChange={(e) => update("state", e.target.value)}
//             className={input}
//             disabled={disabled}
//           />
//         </div>
//         <div>
//           <label className={label}>Telephone *</label>
//           <input
//             value={value.phone}
//             onChange={(e) => update("phone", e.target.value)}
//             className={input}
//             disabled={disabled}
//           />
//         </div>
//       </div>

//       <div className="grid grid-cols-2 gap-2">
//         <div>
//           <label className={label}>Mobile No.</label>
//           <input
//             value={value.mobile ?? ""}
//             onChange={(e) => update("mobile", e.target.value)}
//             className={input}
//             disabled={disabled}
//           />
//         </div>
//         <div>
//           <label className={label}>E-Mail</label>
//           <input
//             type="email"
//             value={value.email ?? ""}
//             onChange={(e) => update("email", e.target.value)}
//             className={input}
//             disabled={disabled}
//           />
//         </div>
//       </div>

//       <div className="grid grid-cols-2 gap-2">
//         <div>
//           <label className={label}>Country</label>
//           <input
//             value={value.country}
//             onChange={(e) => update("country", e.target.value)}
//             className={input}
//             disabled={disabled}
//           />
//         </div>
//         <div>
//           <label className={label}>IEC No.</label>
//           <input
//             value={value.iecNo ?? ""}
//             onChange={(e) => update("iecNo", e.target.value)}
//             className={input}
//             disabled={disabled}
//           />
//         </div>
//       </div>

//       <div className="grid grid-cols-2 gap-2">
//         <div>
//           <label className={label}>Document Type</label>
//           <select
//             value={value.documentType ?? ""}
//             onChange={(e) => update("documentType", e.target.value)}
//             className={input}
//             disabled={disabled}
//           >
//             {DOCUMENT_TYPES.map((t) => (
//               <option key={t.value || "select"} value={t.value}>
//                 {t.label}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div>
//           <label className={label}>Document No.</label>
//           <input
//             value={value.documentNo ?? ""}
//             onChange={(e) => update("documentNo", e.target.value)}
//             className={input}
//             disabled={disabled}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// "use client";

// export type ShipperFormData = {
//   senderId?: string;
//   /** Used by API / masters — synced from contactName */
//   name: string;
//   company?: string;
//   contactName?: string;
//   phone: string;
//   mobile?: string;
//   email?: string;
//   addressLine1: string;
//   addressLine2?: string;
//   city: string;
//   state?: string;
//   pincode: string;
//   country: string;
//   gstin?: string;
//   iecNo?: string;
//   documentType?: string;
//   documentNo?: string;
//   origin?: string;
//   originCode?: string;
// };

// export type ShipperSenderOption = {
//   id: string;
//   senderId: string;
//   name: string;
//   companyName?: string;
//   code?: string;
//   phone?: string;
// };

// type ShipperFormProps = {
//   value: ShipperFormData;
//   onChange: (value: ShipperFormData) => void;
//   disabled?: boolean;
//   /** Existing senders for Company Name dropdown */
//   senders?: ShipperSenderOption[];
//   selectedSenderId?: string;
//   onSelectSender?: (id: string) => void;
// };

// const DOCUMENT_TYPES = [
//   { value: "", label: "Select" },
//   { value: "AADHAAR", label: "Aadhaar Number" },
//   { value: "GSTIN (Normal)", label: "GSTIN (Normal)" },
//   { value: "PAN", label: "PAN Number" },
//   { value: "PASSPORT", label: "Passport Number" },
//   { value: "TAN", label: "TAN Number" },
//   { value: "VOTER_ID", label: "Voter Id" },
// ];

// export default function ShipperForm({
//   value,
//   onChange,
//   disabled = false,
//   senders = [],
//   selectedSenderId = "",
//   onSelectSender,
// }: ShipperFormProps) {
//   const update = <K extends keyof ShipperFormData>(
//     field: K,
//     fieldValue: ShipperFormData[K],
//   ) => {
//     onChange({ ...value, [field]: fieldValue });
//   };

//   const updateContactName = (contactName: string) => {
//     onChange({
//       ...value,
//       contactName,
//       name: contactName.trim() || value.company || value.name || "",
//     });
//   };

//   const input =
//     "h-9 w-full rounded border border-gray-300 bg-white px-2.5 text-sm outline-none focus:border-slate-600 disabled:bg-gray-50";
//   const label = "mb-1 block text-xs font-medium text-gray-600";

//   return (
//     <div className="space-y-3">
//       {/* Origin | Origin Code */}
//       <div className="grid grid-cols-2 gap-2">
//         <div>
//           <label className={label}>
//             Origin <span className="text-red-500">*</span>
//           </label>
//           <input
//             value={value.origin ?? ""}
//             onChange={(e) => update("origin", e.target.value)}
//             placeholder="HYDERABAD"
//             className={input}
//             disabled={disabled}
//           />
//         </div>
//         <div>
//           <label className={label}>Origin Code</label>
//           <input
//             value={value.originCode ?? ""}
//             onChange={(e) => update("originCode", e.target.value)}
//             placeholder="HYD"
//             className={input}
//             disabled={disabled}
//           />
//         </div>
//       </div>

//       {/* Company Name — dropdown when senders exist */}
//       <div>
//         <label className={label}>
//           Company Name <span className="text-red-500">*</span>
//         </label>
//         {senders.length > 0 ? (
//           <select
//             value={selectedSenderId}
//             onChange={(e) => {
//               const id = e.target.value;
//               if (onSelectSender) {
//                 onSelectSender(id);
//               } else if (!id) {
//                 update("senderId", "");
//               }
//             }}
//             className={input}
//             disabled={disabled}
//           >
//             <option value="">— New / type below —</option>
//             {senders.map((s) => {
//               const labelText =
//                 (s.companyName || s.name || "Sender") +
//                 (s.code ? ` (${s.code})` : s.phone ? ` · ${s.phone}` : "");
//               return (
//                 <option key={s.id} value={s.id}>
//                   {labelText}
//                 </option>
//               );
//             })}
//           </select>
//         ) : null}

//         {/* Always allow manual company name (editable after select too) */}
//         <input
//           value={value.company ?? ""}
//           onChange={(e) => update("company", e.target.value)}
//           placeholder="Company name"
//           className={`${input} ${senders.length > 0 ? "mt-1.5" : ""}`}
//           disabled={disabled}
//         />
//       </div>

//       {/* GSTIN (kept — your field) */}
//       <div>
//         <label className={label}>GSTIN</label>
//         <input
//           value={value.gstin ?? ""}
//           onChange={(e) => update("gstin", e.target.value.toUpperCase())}
//           placeholder="22AAAAA0000A1Z5"
//           className={input}
//           disabled={disabled}
//         />
//       </div>

//       {/* Contact Name | Address 1 */}
//       <div className="grid grid-cols-2 gap-2">
//         <div>
//           <label className={label}>
//             Contact Name <span className="text-red-500">*</span>
//           </label>
//           <input
//             value={value.contactName ?? value.name ?? ""}
//             onChange={(e) => updateContactName(e.target.value)}
//             className={input}
//             disabled={disabled}
//           />
//         </div>
//         <div>
//           <label className={label}>
//             Address 1 <span className="text-red-500">*</span>
//           </label>
//           <input
//             value={value.addressLine1}
//             onChange={(e) => update("addressLine1", e.target.value)}
//             className={input}
//             disabled={disabled}
//           />
//         </div>
//       </div>

//       {/* Address 2 */}
//       <div>
//         <label className={label}>Address 2</label>
//         <input
//           value={value.addressLine2 ?? ""}
//           onChange={(e) => update("addressLine2", e.target.value)}
//           className={input}
//           disabled={disabled}
//         />
//       </div>

//       {/* Pincode | City */}
//       <div className="grid grid-cols-2 gap-2">
//         <div>
//           <label className={label}>Pincode</label>
//           <input
//             value={value.pincode}
//             onChange={(e) => update("pincode", e.target.value)}
//             className={input}
//             disabled={disabled}
//           />
//         </div>
//         <div>
//           <label className={label}>
//             City <span className="text-red-500">*</span>
//           </label>
//           <input
//             value={value.city}
//             onChange={(e) => update("city", e.target.value)}
//             className={input}
//             disabled={disabled}
//           />
//         </div>
//       </div>

//       {/* State | Telephone */}
//       <div className="grid grid-cols-2 gap-2">
//         <div>
//           <label className={label}>State</label>
//           <input
//             value={value.state ?? ""}
//             onChange={(e) => update("state", e.target.value)}
//             className={input}
//             disabled={disabled}
//           />
//         </div>
//         <div>
//           <label className={label}>
//             Telephone <span className="text-red-500">*</span>
//           </label>
//           <input
//             value={value.phone}
//             onChange={(e) => update("phone", e.target.value)}
//             className={input}
//             disabled={disabled}
//           />
//         </div>
//       </div>

//       {/* Mobile | E-Mail */}
//       <div className="grid grid-cols-2 gap-2">
//         <div>
//           <label className={label}>Mobile No.</label>
//           <input
//             value={value.mobile ?? ""}
//             onChange={(e) => update("mobile", e.target.value)}
//             className={input}
//             disabled={disabled}
//           />
//         </div>
//         <div>
//           <label className={label}>E-Mail</label>
//           <input
//             type="email"
//             value={value.email ?? ""}
//             onChange={(e) => update("email", e.target.value)}
//             className={input}
//             disabled={disabled}
//           />
//         </div>
//       </div>

//       {/* Country | IEC No. */}
//       <div className="grid grid-cols-2 gap-2">
//         <div>
//           <label className={label}>Country</label>
//           <input
//             value={value.country}
//             onChange={(e) => update("country", e.target.value)}
//             className={input}
//             disabled={disabled}
//           />
//         </div>
//         <div>
//           <label className={label}>IEC No.</label>
//           <input
//             value={value.iecNo ?? ""}
//             onChange={(e) => update("iecNo", e.target.value)}
//             className={input}
//             disabled={disabled}
//           />
//         </div>
//       </div>

//       {/* Document Type | Document No. */}
//       <div className="grid grid-cols-2 gap-2">
//         <div>
//           <label className={label}>Document Type</label>
//           <select
//             value={value.documentType ?? ""}
//             onChange={(e) => update("documentType", e.target.value)}
//             className={input}
//             disabled={disabled}
//           >
//             {DOCUMENT_TYPES.map((t) => (
//               <option key={t.value || "select"} value={t.value}>
//                 {t.label}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div>
//           <label className={label}>Document No.</label>
//           <input
//             value={value.documentNo ?? ""}
//             onChange={(e) => update("documentNo", e.target.value)}
//             className={input}
//             disabled={disabled}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// "use client";

// export type ShipperFormData = {
//   senderId?: string;
//   name: string;
//   company?: string;
//   contactName?: string;
//   phone: string;
//   mobile?: string;
//   email?: string;
//   addressLine1: string;
//   addressLine2?: string;
//   city: string;
//   state?: string;
//   pincode: string;
//   country: string;
//   gstin?: string;
//   iecNo?: string;
//   documentType?: string;
//   documentNo?: string;
//   origin?: string;
//   originCode?: string;
// };

// export type ShipperSenderOption = {
//   id: string;
//   senderId: string;
//   name: string;
//   companyName?: string;
//   code?: string;
//   phone?: string;
// };

// type ShipperFormProps = {
//   value: ShipperFormData;
//   onChange: (value: ShipperFormData) => void;
//   disabled?: boolean;
//   senders?: ShipperSenderOption[];
//   selectedSenderId?: string;
//   onSelectSender?: (id: string) => void;
// };

// const DOCUMENT_TYPES = [
//   { value: "", label: "Select" },
//   { value: "AADHAAR", label: "Aadhaar Number" },
//   { value: "GSTIN (Normal)", label: "GSTIN (Normal)" },
//   { value: "PAN", label: "PAN Number" },
//   { value: "PASSPORT", label: "Passport Number" },
//   { value: "TAN", label: "TAN Number" },
//   { value: "VOTER_ID", label: "Voter Id" },
// ];

// export default function ShipperForm({
//   value,
//   onChange,
//   disabled = false,
//   senders = [],
//   selectedSenderId = "",
//   onSelectSender,
// }: ShipperFormProps) {
//   const update = <K extends keyof ShipperFormData>(
//     field: K,
//     fieldValue: ShipperFormData[K],
//   ) => {
//     onChange({ ...value, [field]: fieldValue });
//   };

//   const updateContactName = (contactName: string) => {
//     onChange({
//       ...value,
//       contactName,
//       name: contactName.trim() || value.company || value.name || "",
//     });
//   };

//   const input =
//     "h-9 w-full rounded border border-gray-300 bg-white px-2.5 text-sm outline-none focus:border-slate-600 disabled:bg-gray-50";
//   const label = "mb-1 block text-xs font-medium text-gray-600";

//   const isNewSender = !selectedSenderId;

//   return (
//     <div className="space-y-3">
//       {/* Origin | Origin Code — booking only; not stored on sender master */}
//       <div className="grid grid-cols-2 gap-2">
//         <div>
//           <label className={label}>
//             Origin <span className="text-red-500">*</span>
//           </label>
//           <input
//             value={value.origin ?? ""}
//             onChange={(e) => update("origin", e.target.value)}
//             placeholder="HYDERABAD"
//             className={input}
//             disabled={disabled}
//           />
//         </div>
//         <div>
//           <label className={label}>Origin Code</label>
//           <input
//             value={value.originCode ?? ""}
//             onChange={(e) => update("originCode", e.target.value)}
//             placeholder="HYD"
//             className={input}
//             disabled={disabled}
//           />
//         </div>
//       </div>

//       {/* Company Name — dropdown only (no phone in label) */}
//       <div>
//         <label className={label}>
//           Company Name <span className="text-red-500">*</span>
//         </label>
//         {senders.length > 0 ? (
//           <select
//             value={selectedSenderId}
//             onChange={(e) => onSelectSender?.(e.target.value)}
//             className={input}
//             disabled={disabled}
//           >
//             <option value="">— New / type below —</option>
//             {senders.map((s) => {
//               const label = (s.companyName || s.name || "").trim() || s.senderId;
//               return (
//                 <option key={s.id} value={s.id}>
//                   {label}
//                 </option>
//               );
//             })}
//           </select>
//         ) : null}

//         {/* Manual company only for NEW sender (no duplicate field when selected) */}
//         {isNewSender ? (
//           <input
//             value={value.company ?? ""}
//             onChange={(e) => update("company", e.target.value)}
//             placeholder="Company name"
//             className={`${input} ${senders.length > 0 ? "mt-1.5" : ""}`}
//             disabled={disabled}
//           />
//         ) : null}
//       </div>

//       <div>
//         <label className={label}>GSTIN</label>
//         <input
//           value={value.gstin ?? ""}
//           onChange={(e) => update("gstin", e.target.value.toUpperCase())}
//           placeholder="22AAAAA0000A1Z5"
//           className={input}
//           disabled={disabled}
//         />
//       </div>

//       <div className="grid grid-cols-2 gap-2">
//         <div>
//           <label className={label}>
//             Contact Name <span className="text-red-500">*</span>
//           </label>
//           <input
//             value={value.contactName ?? value.name ?? ""}
//             onChange={(e) => updateContactName(e.target.value)}
//             className={input}
//             disabled={disabled}
//           />
//         </div>
//         <div>
//           <label className={label}>
//             Address 1 <span className="text-red-500">*</span>
//           </label>
//           <input
//             value={value.addressLine1}
//             onChange={(e) => update("addressLine1", e.target.value)}
//             className={input}
//             disabled={disabled}
//           />
//         </div>
//       </div>

//       <div>
//         <label className={label}>Address 2</label>
//         <input
//           value={value.addressLine2 ?? ""}
//           onChange={(e) => update("addressLine2", e.target.value)}
//           className={input}
//           disabled={disabled}
//         />
//       </div>

//       <div className="grid grid-cols-2 gap-2">
//         <div>
//           <label className={label}>Pincode</label>
//           <input
//             value={value.pincode}
//             onChange={(e) => update("pincode", e.target.value)}
//             className={input}
//             disabled={disabled}
//           />
//         </div>
//         <div>
//           <label className={label}>
//             City <span className="text-red-500">*</span>
//           </label>
//           <input
//             value={value.city}
//             onChange={(e) => update("city", e.target.value)}
//             className={input}
//             disabled={disabled}
//           />
//         </div>
//       </div>

//       <div className="grid grid-cols-2 gap-2">
//         <div>
//           <label className={label}>State</label>
//           <input
//             value={value.state ?? ""}
//             onChange={(e) => update("state", e.target.value)}
//             className={input}
//             disabled={disabled}
//           />
//         </div>
//         <div>
//           <label className={label}>
//             Telephone <span className="text-red-500">*</span>
//           </label>
//           <input
//             value={value.phone}
//             onChange={(e) => update("phone", e.target.value)}
//             className={input}
//             disabled={disabled}
//           />
//         </div>
//       </div>

//       <div className="grid grid-cols-2 gap-2">
//         <div>
//           <label className={label}>Mobile No.</label>
//           <input
//             value={value.mobile ?? ""}
//             onChange={(e) => update("mobile", e.target.value)}
//             className={input}
//             disabled={disabled}
//           />
//         </div>
//         <div>
//           <label className={label}>E-Mail</label>
//           <input
//             type="email"
//             value={value.email ?? ""}
//             onChange={(e) => update("email", e.target.value)}
//             className={input}
//             disabled={disabled}
//           />
//         </div>
//       </div>

//       <div className="grid grid-cols-2 gap-2">
//         <div>
//           <label className={label}>Country</label>
//           <input
//             value={value.country}
//             onChange={(e) => update("country", e.target.value)}
//             className={input}
//             disabled={disabled}
//           />
//         </div>
//         <div>
//           <label className={label}>IEC No.</label>
//           <input
//             value={value.iecNo ?? ""}
//             onChange={(e) => update("iecNo", e.target.value)}
//             className={input}
//             disabled={disabled}
//           />
//         </div>
//       </div>

//       <div className="grid grid-cols-2 gap-2">
//         <div>
//           <label className={label}>Document Type</label>
//           <select
//             value={value.documentType ?? ""}
//             onChange={(e) => update("documentType", e.target.value)}
//             className={input}
//             disabled={disabled}
//           >
//             {DOCUMENT_TYPES.map((t) => (
//               <option key={t.value || "select"} value={t.value}>
//                 {t.label}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div>
//           <label className={label}>Document No.</label>
//           <input
//             value={value.documentNo ?? ""}
//             onChange={(e) => update("documentNo", e.target.value)}
//             className={input}
//             disabled={disabled}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// "use client";

// export type ShipperFormData = {
//   senderId?: string;
//   name: string;
//   company?: string;
//   contactName?: string;
//   phone: string;
//   mobile?: string;
//   email?: string;
//   addressLine1: string;
//   addressLine2?: string;
//   city: string;
//   state?: string;
//   pincode: string;
//   country: string;
//   gstin?: string;
//   iecNo?: string;
//   documentType?: string;
//   documentNo?: string;
//   /** Booking-level only (not stored on Sender master) */
//   origin?: string;
//   originCode?: string;
// };

// export type ShipperSenderOption = {
//   id: string;
//   senderId: string;
//   name: string;
//   companyName?: string;
//   phone?: string;
// };

// type ShipperFormProps = {
//   value: ShipperFormData;
//   onChange: (value: ShipperFormData) => void;
//   disabled?: boolean;
//   senders?: ShipperSenderOption[];
//   selectedSenderId?: string;
//   onSelectSender?: (id: string) => void;
//   /** When true, shipper fields are read-only after selecting a master sender */
//   lockFieldsFromSender?: boolean;
// };

// const DOCUMENT_TYPES = [
//   { value: "", label: "Select" },
//   { value: "AADHAAR", label: "Aadhaar Number" },
//   { value: "GSTIN (Normal)", label: "GSTIN (Normal)" },
//   { value: "PAN", label: "PAN Number" },
//   { value: "PASSPORT", label: "Passport Number" },
//   { value: "TAN", label: "TAN Number" },
//   { value: "VOTER_ID", label: "Voter Id" },
// ];

// export default function ShipperForm({
//   value,
//   onChange,
//   disabled = false,
//   senders = [],
//   selectedSenderId = "",
//   onSelectSender,
//   lockFieldsFromSender = true,
// }: ShipperFormProps) {
//   const update = <K extends keyof ShipperFormData>(
//     field: K,
//     fieldValue: ShipperFormData[K],
//   ) => {
//     onChange({ ...value, [field]: fieldValue });
//   };

//   const input =
//     "h-9 w-full rounded border border-gray-300 bg-white px-2.5 text-sm outline-none focus:border-slate-600 disabled:bg-gray-50 disabled:text-gray-600";
//   const label = "mb-1 block text-xs font-medium text-gray-600";

//   // Fields locked when a master sender is selected
//   const fieldsLocked =
//     disabled || (lockFieldsFromSender && Boolean(selectedSenderId));

//   return (
//     <div className="space-y-3">
//       {/* Select from Masters / Senders — no Origin fields here */}
//       <div>
//         <label className={label}>
//           Select Sender <span className="text-red-500">*</span>
//         </label>
//         <select
//           value={selectedSenderId}
//           onChange={(e) => onSelectSender?.(e.target.value)}
//           className={input}
//           disabled={disabled}
//         >
//           <option value="">— Select from Senders master —</option>
//           {senders.map((s) => (
//             <option key={s.id || s.senderId} value={s.id || s.senderId}>
//               {(s.companyName || s.name) +
//                 (s.phone ? ` · ${s.phone}` : "") +
//                 (s.name && s.companyName ? ` (${s.name})` : "")}
//             </option>
//           ))}
//         </select>
//         {senders.length === 0 ? (
//           <p className="mt-1 text-[11px] text-amber-700">
//             No active senders found. Add them under Masters → Senders.
//           </p>
//         ) : (
//           <p className="mt-1 text-[11px] text-slate-400">
//             Choosing a sender fills all shipper fields automatically.
//           </p>
//         )}
//       </div>

//       <div className="grid grid-cols-2 gap-2">
//         <div>
//           <label className={label}>Company Name</label>
//           <input
//             value={value.company ?? ""}
//             onChange={(e) => update("company", e.target.value)}
//             className={input}
//             disabled={fieldsLocked}
//             readOnly={fieldsLocked}
//           />
//         </div>
//         <div>
//           <label className={label}>Contact Name</label>
//           <input
//             value={value.contactName ?? value.name ?? ""}
//             onChange={(e) =>
//               onChange({
//                 ...value,
//                 contactName: e.target.value,
//                 name: e.target.value,
//               })
//             }
//             className={input}
//             disabled={fieldsLocked}
//             readOnly={fieldsLocked}
//           />
//         </div>
//       </div>

//       <div>
//         <label className={label}>GSTIN</label>
//         <input
//           value={value.gstin ?? ""}
//           onChange={(e) => update("gstin", e.target.value.toUpperCase())}
//           className={input}
//           disabled={fieldsLocked}
//           readOnly={fieldsLocked}
//         />
//       </div>

//       <div>
//         <label className={label}>Address 1</label>
//         <input
//           value={value.addressLine1}
//           onChange={(e) => update("addressLine1", e.target.value)}
//           className={input}
//           disabled={fieldsLocked}
//           readOnly={fieldsLocked}
//         />
//       </div>

//       <div>
//         <label className={label}>Address 2</label>
//         <input
//           value={value.addressLine2 ?? ""}
//           onChange={(e) => update("addressLine2", e.target.value)}
//           className={input}
//           disabled={fieldsLocked}
//           readOnly={fieldsLocked}
//         />
//       </div>

//       <div className="grid grid-cols-2 gap-2">
//         <div>
//           <label className={label}>City</label>
//           <input
//             value={value.city}
//             onChange={(e) => update("city", e.target.value)}
//             className={input}
//             disabled={fieldsLocked}
//             readOnly={fieldsLocked}
//           />
//         </div>
//         <div>
//           <label className={label}>Pincode</label>
//           <input
//             value={value.pincode}
//             onChange={(e) => update("pincode", e.target.value)}
//             className={input}
//             disabled={fieldsLocked}
//             readOnly={fieldsLocked}
//           />
//         </div>
//       </div>

//       <div className="grid grid-cols-2 gap-2">
//         <div>
//           <label className={label}>State</label>
//           <input
//             value={value.state ?? ""}
//             onChange={(e) => update("state", e.target.value)}
//             className={input}
//             disabled={fieldsLocked}
//             readOnly={fieldsLocked}
//           />
//         </div>
//         <div>
//           <label className={label}>Telephone</label>
//           <input
//             value={value.phone}
//             onChange={(e) => update("phone", e.target.value)}
//             className={input}
//             disabled={fieldsLocked}
//             readOnly={fieldsLocked}
//           />
//         </div>
//       </div>

//       <div className="grid grid-cols-2 gap-2">
//         <div>
//           <label className={label}>Mobile No.</label>
//           <input
//             value={value.mobile ?? ""}
//             onChange={(e) => update("mobile", e.target.value)}
//             className={input}
//             disabled={fieldsLocked}
//             readOnly={fieldsLocked}
//           />
//         </div>
//         <div>
//           <label className={label}>E-Mail</label>
//           <input
//             type="email"
//             value={value.email ?? ""}
//             onChange={(e) => update("email", e.target.value)}
//             className={input}
//             disabled={fieldsLocked}
//             readOnly={fieldsLocked}
//           />
//         </div>
//       </div>

//       <div className="grid grid-cols-2 gap-2">
//         <div>
//           <label className={label}>Country</label>
//           <input
//             value={value.country}
//             onChange={(e) => update("country", e.target.value)}
//             className={input}
//             disabled={fieldsLocked}
//             readOnly={fieldsLocked}
//           />
//         </div>
//         <div>
//           <label className={label}>IEC No.</label>
//           <input
//             value={value.iecNo ?? ""}
//             onChange={(e) => update("iecNo", e.target.value)}
//             className={input}
//             disabled={fieldsLocked}
//             readOnly={fieldsLocked}
//           />
//         </div>
//       </div>

//       <div className="grid grid-cols-2 gap-2">
//         <div>
//           <label className={label}>Document Type</label>
//           <select
//             value={value.documentType ?? ""}
//             onChange={(e) => update("documentType", e.target.value)}
//             className={input}
//             disabled={fieldsLocked}
//           >
//             {DOCUMENT_TYPES.map((t) => (
//               <option key={t.value || "select"} value={t.value}>
//                 {t.label}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div>
//           <label className={label}>Document No.</label>
//           <input
//             value={value.documentNo ?? ""}
//             onChange={(e) => update("documentNo", e.target.value)}
//             className={input}
//             disabled={fieldsLocked}
//             readOnly={fieldsLocked}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// "use client";

// export type ShipperFormData = {
//   senderId?: string;
//   name: string;
//   company?: string;
//   contactName?: string;
//   phone: string;
//   mobile?: string;
//   email?: string;
//   addressLine1: string;
//   addressLine2?: string;
//   city: string;
//   state?: string;
//   pincode: string;
//   country: string;
//   gstin?: string;
//   iecNo?: string;
//   documentType?: string;
//   documentNo?: string;
//   /** Booking-level (not on Sender master) */
//   origin?: string;
//   originCode?: string;
// };

// export type ShipperSenderOption = {
//   id: string;
//   senderId: string;
//   name: string;
//   companyName?: string;
//   phone?: string;
// };

// type ShipperFormProps = {
//   value: ShipperFormData;
//   onChange: (value: ShipperFormData) => void;
//   disabled?: boolean;
//   senders?: ShipperSenderOption[];
//   selectedSenderId?: string;
//   onSelectSender?: (id: string) => void;
//   lockFieldsFromSender?: boolean;
// };

// const DOCUMENT_TYPES = [
//   { value: "", label: "Select" },
//   { value: "AADHAAR", label: "Aadhaar Number" },
//   { value: "GSTIN (Normal)", label: "GSTIN (Normal)" },
//   { value: "PAN", label: "PAN Number" },
//   { value: "PASSPORT", label: "Passport Number" },
//   { value: "TAN", label: "TAN Number" },
//   { value: "VOTER_ID", label: "Voter Id" },
// ];

// export default function ShipperForm({
//   value,
//   onChange,
//   disabled = false,
//   senders = [],
//   selectedSenderId = "",
//   onSelectSender,
//   lockFieldsFromSender = true,
// }: ShipperFormProps) {
//   const update = <K extends keyof ShipperFormData>(
//     field: K,
//     fieldValue: ShipperFormData[K],
//   ) => {
//     onChange({ ...value, [field]: fieldValue });
//   };

//   const input =
//     "h-9 w-full rounded border border-gray-300 bg-white px-2.5 text-sm outline-none focus:border-slate-600 disabled:bg-gray-50 disabled:text-gray-600";
//   const label = "mb-1 block text-xs font-medium text-gray-600";

//   // Master sender fields locked; Origin / Origin Code stay editable
//   const fieldsLocked =
//     disabled || (lockFieldsFromSender && Boolean(selectedSenderId));

//   return (
//     <div className="space-y-3">
//       <div className="grid grid-cols-2 gap-2">
//         <div>
//           <label className={label}>
//             Origin <span className="text-red-500">*</span>
//           </label>
//           <input
//             value={value.origin ?? ""}
//             onChange={(e) => update("origin", e.target.value)}
//             className={input}
//             disabled={disabled}
//             placeholder="e.g. Guntur"
//           />
//         </div>
//         <div>
//           <label className={label}>
//             Origin Code{" "}
//             <span className="font-normal text-slate-400">(optional)</span>
//           </label>
//           <input
//             value={value.originCode ?? ""}
//             onChange={(e) =>
//               update("originCode", e.target.value.toUpperCase())
//             }
//             className={input}
//             disabled={disabled}
//             placeholder="e.g. GNT"
//           />
//         </div>
//       </div>

//       <div>
//         <label className={label}>
//           Select Sender <span className="text-red-500">*</span>
//         </label>
//         <select
//           value={selectedSenderId}
//           onChange={(e) => onSelectSender?.(e.target.value)}
//           className={input}
//           disabled={disabled}
//         >
//           <option value="">— Select from Senders master —</option>
//           {senders.map((s) => (
//             <option key={s.id || s.senderId} value={s.id || s.senderId}>
//               {(s.companyName || s.name) +
//                 (s.phone ? ` · ${s.phone}` : "") +
//                 (s.name && s.companyName ? ` (${s.name})` : "")}
//             </option>
//           ))}
//         </select>
//         {senders.length === 0 ? (
//           <p className="mt-1 text-[11px] text-amber-700">
//             No active senders found. Add them under Masters → Senders.
//           </p>
//         ) : (
//           <p className="mt-1 text-[11px] text-slate-400">
//             Choosing a sender fills shipper fields. Clear selection to empty the form.
//           </p>
//         )}
//       </div>

//       {/* Origin + Origin Code (same pattern as Destination / Dest. Code) */}
      

//       <div className="grid grid-cols-2 gap-2">
//         <div>
//           <label className={label}>Company Name</label>
//           <input
//             value={value.company ?? ""}
//             onChange={(e) => update("company", e.target.value)}
//             className={input}
//             disabled={fieldsLocked}
//             readOnly={fieldsLocked}
//           />
//         </div>
//         <div>
//           <label className={label}>Contact Name</label>
//           <input
//             value={value.contactName ?? value.name ?? ""}
//             onChange={(e) =>
//               onChange({
//                 ...value,
//                 contactName: e.target.value,
//                 name: e.target.value,
//               })
//             }
//             className={input}
//             disabled={fieldsLocked}
//             readOnly={fieldsLocked}
//           />
//         </div>
//       </div>

//       <div>
//         <label className={label}>GSTIN</label>
//         <input
//           value={value.gstin ?? ""}
//           onChange={(e) => update("gstin", e.target.value.toUpperCase())}
//           className={input}
//           disabled={fieldsLocked}
//           readOnly={fieldsLocked}
//         />
//       </div>

//       <div>
//         <label className={label}>Address 1</label>
//         <input
//           value={value.addressLine1}
//           onChange={(e) => update("addressLine1", e.target.value)}
//           className={input}
//           disabled={fieldsLocked}
//           readOnly={fieldsLocked}
//         />
//       </div>

//       <div>
//         <label className={label}>Address 2</label>
//         <input
//           value={value.addressLine2 ?? ""}
//           onChange={(e) => update("addressLine2", e.target.value)}
//           className={input}
//           disabled={fieldsLocked}
//           readOnly={fieldsLocked}
//         />
//       </div>

//       <div className="grid grid-cols-2 gap-2">
//         <div>
//           <label className={label}>City</label>
//           <input
//             value={value.city}
//             onChange={(e) => update("city", e.target.value)}
//             className={input}
//             disabled={fieldsLocked}
//             readOnly={fieldsLocked}
//           />
//         </div>
//         <div>
//           <label className={label}>Pincode</label>
//           <input
//             value={value.pincode}
//             onChange={(e) => update("pincode", e.target.value)}
//             className={input}
//             disabled={fieldsLocked}
//             readOnly={fieldsLocked}
//           />
//         </div>
//       </div>

//       <div className="grid grid-cols-2 gap-2">
//         <div>
//           <label className={label}>State</label>
//           <input
//             value={value.state ?? ""}
//             onChange={(e) => update("state", e.target.value)}
//             className={input}
//             disabled={fieldsLocked}
//             readOnly={fieldsLocked}
//           />
//         </div>
//         <div>
//           <label className={label}>Telephone</label>
//           <input
//             value={value.phone}
//             onChange={(e) => update("phone", e.target.value)}
//             className={input}
//             disabled={fieldsLocked}
//             readOnly={fieldsLocked}
//           />
//         </div>
//       </div>

//       <div className="grid grid-cols-2 gap-2">
//         <div>
//           <label className={label}>Mobile No.</label>
//           <input
//             value={value.mobile ?? ""}
//             onChange={(e) => update("mobile", e.target.value)}
//             className={input}
//             disabled={fieldsLocked}
//             readOnly={fieldsLocked}
//           />
//         </div>
//         <div>
//           <label className={label}>E-Mail</label>
//           <input
//             type="email"
//             value={value.email ?? ""}
//             onChange={(e) => update("email", e.target.value)}
//             className={input}
//             disabled={fieldsLocked}
//             readOnly={fieldsLocked}
//           />
//         </div>
//       </div>

//       <div className="grid grid-cols-2 gap-2">
//         <div>
//           <label className={label}>Country</label>
//           <input
//             value={value.country}
//             onChange={(e) => update("country", e.target.value)}
//             className={input}
//             disabled={fieldsLocked}
//             readOnly={fieldsLocked}
//           />
//         </div>
//         <div>
//           <label className={label}>IEC No.</label>
//           <input
//             value={value.iecNo ?? ""}
//             onChange={(e) => update("iecNo", e.target.value)}
//             className={input}
//             disabled={fieldsLocked}
//             readOnly={fieldsLocked}
//           />
//         </div>
//       </div>

//       <div className="grid grid-cols-2 gap-2">
//         <div>
//           <label className={label}>Document Type</label>
//           <select
//             value={value.documentType ?? ""}
//             onChange={(e) => update("documentType", e.target.value)}
//             className={input}
//             disabled={fieldsLocked}
//           >
//             {DOCUMENT_TYPES.map((t) => (
//               <option key={t.value || "select"} value={t.value}>
//                 {t.label}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div>
//           <label className={label}>Document No.</label>
//           <input
//             value={value.documentNo ?? ""}
//             onChange={(e) => update("documentNo", e.target.value)}
//             className={input}
//             disabled={fieldsLocked}
//             readOnly={fieldsLocked}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// "use client";

// export type ShipperFormData = {
//   senderId?: string;
//   name: string;
//   company?: string;
//   contactName?: string;
//   phone: string;
//   mobile?: string;
//   email?: string;
//   addressLine1: string;
//   addressLine2?: string;
//   city: string;
//   state?: string;
//   pincode: string;
//   country: string;
//   gstin?: string;
//   iecNo?: string;
//   documentType?: string;
//   documentNo?: string;
//   origin?: string;
//   originCode?: string;
// };

// export type ShipperSenderOption = {
//   id: string;
//   senderId: string;
//   name: string;
//   companyName?: string;
//   phone?: string;
// };

// type ShipperFormProps = {
//   value: ShipperFormData;
//   onChange: (value: ShipperFormData) => void;
//   disabled?: boolean;
//   senders?: ShipperSenderOption[];
//   selectedSenderId?: string;
//   onSelectSender?: (id: string) => void;
//   lockFieldsFromSender?: boolean;
// };

// const DOCUMENT_TYPES = [
//   { value: "", label: "Select" },
//   { value: "AADHAAR", label: "Aadhaar Number" },
//   { value: "GSTIN (Normal)", label: "GSTIN (Normal)" },
//   { value: "PAN", label: "PAN Number" },
//   { value: "PASSPORT", label: "Passport Number" },
//   { value: "TAN", label: "TAN Number" },
//   { value: "VOTER_ID", label: "Voter Id" },
// ];

// export default function ShipperForm({
//   value,
//   onChange,
//   disabled = false,
//   senders = [],
//   selectedSenderId = "",
//   onSelectSender,
//   lockFieldsFromSender = true,
// }: ShipperFormProps) {
//   const update = <K extends keyof ShipperFormData>(
//     field: K,
//     fieldValue: ShipperFormData[K],
//   ) => {
//     onChange({ ...value, [field]: fieldValue });
//   };

//   const input =
//     "h-9 w-full rounded border border-gray-300 bg-white px-2.5 text-sm outline-none focus:border-slate-600 disabled:bg-gray-50 disabled:text-gray-600";
//   const label = "mb-1 block text-xs font-medium text-gray-600";
//   const fieldsLocked = Boolean(lockFieldsFromSender && selectedSenderId);

//   return (
//     <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
//       <h3 className="mb-3 text-sm font-bold text-slate-800">Shipper Details</h3>

//       <div className="grid gap-3 sm:grid-cols-2">
//         <div>
//           <label className={label}>
//             Origin <span className="text-red-500">*</span>
//           </label>
//           <input
//             value={value.origin || ""}
//             onChange={(e) => update("origin", e.target.value)}
//             placeholder="e.g. Guntur"
//             disabled={disabled}
//             required
//             className={input}
//           />
//         </div>
//         <div>
//           <label className={label}>Origin Code (optional)</label>
//           <input
//             value={value.originCode || ""}
//             onChange={(e) => update("originCode", e.target.value)}
//             placeholder="e.g. GNT"
//             disabled={disabled}
//             className={input}
//           />
//         </div>
//       </div>

//       <div className="mt-3">
//         <label className={label}>
//           Select Sender <span className="text-red-500">*</span>
//         </label>
//         <select
//           value={selectedSenderId}
//           onChange={(e) => onSelectSender?.(e.target.value)}
//           disabled={disabled}
//           required
//           className={input}
//         >
//           <option value="">— Select from Senders master —</option>
//           {senders.map((s) => (
//             <option key={s.id || s.senderId} value={s.senderId || s.id}>
//               {s.companyName || s.name}
//               {s.phone ? ` (${s.phone})` : ""}
//             </option>
//           ))}
//         </select>
//         <p className="mt-1 text-[11px] text-slate-400">
//           Choosing a sender fills shipper fields. Clear selection to empty the form.
//         </p>
//       </div>

//       <div className="mt-3 grid gap-3 sm:grid-cols-2">
//         <div>
//           <label className={label}>
//             Company Name <span className="text-red-500">*</span>
//           </label>
//           <input
//             value={value.company || ""}
//             onChange={(e) => update("company", e.target.value)}
//             disabled={disabled || fieldsLocked}
//             required
//             className={input}
//           />
//         </div>
//         <div>
//           <label className={label}>
//             Contact Name <span className="text-red-500">*</span>
//           </label>
//           <input
//             value={value.contactName || value.name || ""}
//             onChange={(e) => {
//               update("contactName", e.target.value);
//               update("name", e.target.value);
//             }}
//             disabled={disabled || fieldsLocked}
//             required
//             className={input}
//           />
//         </div>
//       </div>

//       <div className="mt-3">
//         <label className={label}>
//           GSTIN <span className="text-red-500">*</span>
//         </label>
//         <input
//           value={value.gstin || ""}
//           onChange={(e) => update("gstin", e.target.value.toUpperCase())}
//           disabled={disabled || fieldsLocked}
//           required
//           className={input}
//         />
//       </div>

//       <div className="mt-3">
//         <label className={label}>
//           Address 1 <span className="text-red-500">*</span>
//         </label>
//         <input
//           value={value.addressLine1 || ""}
//           onChange={(e) => update("addressLine1", e.target.value)}
//           disabled={disabled || fieldsLocked}
//           required
//           className={input}
//         />
//       </div>

//       <div className="mt-3">
//         <label className={label}>
//           Address 2 <span className="text-red-500">*</span>
//         </label>
//         <input
//           value={value.addressLine2 || ""}
//           onChange={(e) => update("addressLine2", e.target.value)}
//           disabled={disabled || fieldsLocked}
//           required
//           className={input}
//         />
//       </div>

//       <div className="mt-3 grid gap-3 sm:grid-cols-2">
//         <div>
//           <label className={label}>
//             City <span className="text-red-500">*</span>
//           </label>
//           <input
//             value={value.city || ""}
//             onChange={(e) => update("city", e.target.value)}
//             disabled={disabled || fieldsLocked}
//             required
//             className={input}
//           />
//         </div>
//         <div>
//           <label className={label}>
//             Pincode <span className="text-red-500">*</span>
//           </label>
//           <input
//             value={value.pincode || ""}
//             onChange={(e) => update("pincode", e.target.value)}
//             disabled={disabled || fieldsLocked}
//             required
//             className={input}
//           />
//         </div>
//       </div>

//       <div className="mt-3 grid gap-3 sm:grid-cols-2">
//         <div>
//           <label className={label}>
//             State <span className="text-red-500">*</span>
//           </label>
//           <input
//             value={value.state || ""}
//             onChange={(e) => update("state", e.target.value)}
//             disabled={disabled || fieldsLocked}
//             required
//             className={input}
//           />
//         </div>
//         <div>
//           <label className={label}>
//             Telephone <span className="text-red-500">*</span>
//           </label>
//           <input
//             value={value.phone || ""}
//             onChange={(e) => update("phone", e.target.value)}
//             disabled={disabled || fieldsLocked}
//             required
//             className={input}
//           />
//         </div>
//       </div>

//       <div className="mt-3 grid gap-3 sm:grid-cols-2">
//         <div>
//           <label className={label}>
//             Mobile No. <span className="text-red-500">*</span>
//           </label>
//           <input
//             value={value.mobile || ""}
//             onChange={(e) => update("mobile", e.target.value)}
//             disabled={disabled || fieldsLocked}
//             required
//             className={input}
//           />
//         </div>
//         <div>
//           <label className={label}>
//             E-Mail <span className="text-red-500">*</span>
//           </label>
//           <input
//             type="email"
//             value={value.email || ""}
//             onChange={(e) => update("email", e.target.value)}
//             disabled={disabled || fieldsLocked}
//             required
//             className={input}
//           />
//         </div>
//       </div>

//       <div className="mt-3 grid gap-3 sm:grid-cols-2">
//         <div>
//           <label className={label}>
//             Country <span className="text-red-500">*</span>
//           </label>
//           <input
//             value={value.country || ""}
//             onChange={(e) => update("country", e.target.value)}
//             disabled={disabled || fieldsLocked}
//             required
//             className={input}
//           />
//         </div>
//         <div>
//           <label className={label}>
//             IEC No. <span className="text-red-500">*</span>
//           </label>
//           <input
//             value={value.iecNo || ""}
//             onChange={(e) => update("iecNo", e.target.value)}
//             disabled={disabled || fieldsLocked}
//             required
//             className={input}
//           />
//         </div>
//       </div>

//       <div className="mt-3 grid gap-3 sm:grid-cols-2">
//         <div>
//           <label className={label}>
//             Document Type <span className="text-red-500">*</span>
//           </label>
//           <select
//             value={value.documentType || ""}
//             onChange={(e) => update("documentType", e.target.value)}
//             disabled={disabled || fieldsLocked}
//             required
//             className={input}
//           >
//             {DOCUMENT_TYPES.map((t) => (
//               <option key={t.value || "empty"} value={t.value}>
//                 {t.label}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div>
//           <label className={label}>
//             Document No. <span className="text-red-500">*</span>
//           </label>
//           <input
//             value={value.documentNo || ""}
//             onChange={(e) => update("documentNo", e.target.value)}
//             disabled={disabled || fieldsLocked}
//             required
//             className={input}
//           />
//         </div>
//       </div>
//     </section>
//   );
// }

// "use client";

// export type ShipperFormData = {
//   senderId?: string;
//   name: string;
//   company?: string;
//   contactName?: string;
//   phone: string;
//   mobile?: string;
//   email?: string;
//   addressLine1: string;
//   addressLine2?: string;
//   city: string;
//   state?: string;
//   pincode: string;
//   country: string;
//   gstin?: string;
//   iecNo?: string;
//   documentType?: string;
//   documentNo?: string;
//   origin?: string;
//   originCode?: string;
// };

// export type ShipperSenderOption = {
//   id: string;
//   senderId: string;
//   name: string;
//   companyName?: string;
//   phone?: string;
// };

// export type ShipperOriginOption = {
//   id: string;
//   name: string;
//   code?: string;
// };

// type ShipperFormProps = {
//   value: ShipperFormData;
//   onChange: (value: ShipperFormData) => void;
//   disabled?: boolean;
//   senders?: ShipperSenderOption[];
//   selectedSenderId?: string;
//   onSelectSender?: (id: string) => void;
//   lockFieldsFromSender?: boolean;
//   /** From Masters → Origins */
//   origins?: ShipperOriginOption[];
// };

// const DOCUMENT_TYPES = [
//   { value: "", label: "Select" },
//   { value: "AADHAAR", label: "Aadhaar Number" },
//   { value: "GSTIN (Normal)", label: "GSTIN (Normal)" },
//   { value: "PAN", label: "PAN Number" },
//   { value: "PASSPORT", label: "Passport Number" },
//   { value: "TAN", label: "TAN Number" },
//   { value: "VOTER_ID", label: "Voter Id" },
// ];

// export default function ShipperForm({
//   value,
//   onChange,
//   disabled = false,
//   senders = [],
//   selectedSenderId = "",
//   onSelectSender,
//   lockFieldsFromSender = true,
//   origins = [],
// }: ShipperFormProps) {
//   const update = <K extends keyof ShipperFormData>(
//     field: K,
//     fieldValue: ShipperFormData[K],
//   ) => {
//     onChange({ ...value, [field]: fieldValue });
//   };

//   const input =
//     "h-9 w-full rounded border border-gray-300 bg-white px-2.5 text-sm outline-none focus:border-slate-600 disabled:bg-gray-50 disabled:text-gray-600";
//   const label = "mb-1 block text-xs font-medium text-gray-600";
//   const fieldsLocked = Boolean(lockFieldsFromSender && selectedSenderId);

//   function onOriginChange(name: string) {
//     const o = origins.find(
//       (x) => x.name === name || x.id === name || x.code === name,
//     );
//     onChange({
//       ...value,
//       origin: o?.name || name,
//       originCode: o?.code || "",
//     });
//   }

//   return (
//     <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
//       <h3 className="mb-3 text-sm font-bold text-slate-800">Shipper Details</h3>

//       <div className="grid gap-3 sm:grid-cols-2">
//         <div>
//           <label className={label}>
//             Origin <span className="text-red-500">*</span>
//           </label>
//           {origins.length > 0 ? (
//             <select
//               value={value.origin || ""}
//               onChange={(e) => onOriginChange(e.target.value)}
//               disabled={disabled}
//               required
//               className={input}
//             >
//               <option value="">Select origin</option>
//               {origins.map((o) => (
//                 <option key={o.id || o.name} value={o.name}>
//                   {o.name}
//                   {o.code ? ` (${o.code})` : ""}
//                 </option>
//               ))}
//             </select>
//           ) : (
//             <input
//               value={value.origin || ""}
//               onChange={(e) => update("origin", e.target.value)}
//               placeholder="e.g. Guntur"
//               disabled={disabled}
//               required
//               className={input}
//             />
//           )}
//           {origins.length === 0 ? (
//             <p className="mt-1 text-[11px] text-amber-700">
//               No origins in master. Add under Masters → Origins.
//             </p>
//           ) : null}
//         </div>
//         <div>
//           <label className={label}>Origin Code</label>
//           <input
//             value={value.originCode || ""}
//             onChange={(e) => update("originCode", e.target.value)}
//             placeholder="Auto from master"
//             disabled={disabled || origins.length > 0}
//             className={
//               origins.length > 0 ? `${input} bg-gray-50 font-semibold` : input
//             }
//           />
//         </div>
//       </div>

//       <div className="mt-3">
//         <label className={label}>
//           Select Sender <span className="text-red-500">*</span>
//         </label>
//         <select
//           value={selectedSenderId}
//           onChange={(e) => onSelectSender?.(e.target.value)}
//           disabled={disabled}
//           required
//           className={input}
//         >
//           <option value="">— Select from Senders master —</option>
//           {senders.map((s) => (
//             <option key={s.id || s.senderId} value={s.senderId || s.id}>
//               {/* company name only — no phone */}
//               {s.companyName || s.name}
//             </option>
//           ))}
//         </select>
//         <p className="mt-1 text-[11px] text-slate-400">
//           Choosing a sender fills shipper fields. Clear selection to empty the
//           form.
//         </p>
//       </div>

//       {/* rest of fields unchanged — company, contact, GSTIN, addresses, etc. */}
//       <div className="mt-3 grid gap-3 sm:grid-cols-2">
//         <div>
//           <label className={label}>
//             Company Name <span className="text-red-500">*</span>
//           </label>
//           <input
//             value={value.company || ""}
//             onChange={(e) => update("company", e.target.value)}
//             disabled={disabled || fieldsLocked}
//             required
//             className={input}
//           />
//         </div>
//         <div>
//           <label className={label}>
//             Contact Name <span className="text-red-500">*</span>
//           </label>
//           <input
//             value={value.contactName || value.name || ""}
//             onChange={(e) => {
//               update("contactName", e.target.value);
//               update("name", e.target.value);
//             }}
//             disabled={disabled || fieldsLocked}
//             required
//             className={input}
//           />
//         </div>
//       </div>

//       <div className="mt-3">
//         <label className={label}>
//           GSTIN <span className="text-red-500">*</span>
//         </label>
//         <input
//           value={value.gstin || ""}
//           onChange={(e) => update("gstin", e.target.value.toUpperCase())}
//           disabled={disabled || fieldsLocked}
//           required
//           className={input}
//         />
//       </div>

//       <div className="mt-3">
//         <label className={label}>
//           Address 1 <span className="text-red-500">*</span>
//         </label>
//         <input
//           value={value.addressLine1 || ""}
//           onChange={(e) => update("addressLine1", e.target.value)}
//           disabled={disabled || fieldsLocked}
//           required
//           className={input}
//         />
//       </div>

//       <div className="mt-3">
//         <label className={label}>
//           Address 2 <span className="text-red-500">*</span>
//         </label>
//         <input
//           value={value.addressLine2 || ""}
//           onChange={(e) => update("addressLine2", e.target.value)}
//           disabled={disabled || fieldsLocked}
//           required
//           className={input}
//         />
//       </div>

//       <div className="mt-3 grid gap-3 sm:grid-cols-2">
//         <div>
//           <label className={label}>
//             City <span className="text-red-500">*</span>
//           </label>
//           <input
//             value={value.city || ""}
//             onChange={(e) => update("city", e.target.value)}
//             disabled={disabled || fieldsLocked}
//             required
//             className={input}
//           />
//         </div>
//         <div>
//           <label className={label}>
//             Pincode <span className="text-red-500">*</span>
//           </label>
//           <input
//             value={value.pincode || ""}
//             onChange={(e) => update("pincode", e.target.value)}
//             disabled={disabled || fieldsLocked}
//             required
//             className={input}
//           />
//         </div>
//       </div>

//       <div className="mt-3 grid gap-3 sm:grid-cols-2">
//         <div>
//           <label className={label}>
//             State <span className="text-red-500">*</span>
//           </label>
//           <input
//             value={value.state || ""}
//             onChange={(e) => update("state", e.target.value)}
//             disabled={disabled || fieldsLocked}
//             required
//             className={input}
//           />
//         </div>
//         <div>
//           <label className={label}>
//             Telephone <span className="text-red-500">*</span>
//           </label>
//           <input
//             value={value.phone || ""}
//             onChange={(e) => update("phone", e.target.value)}
//             disabled={disabled || fieldsLocked}
//             required
//             className={input}
//           />
//         </div>
//       </div>

//       <div className="mt-3 grid gap-3 sm:grid-cols-2">
//         <div>
//           <label className={label}>
//             Mobile No. <span className="text-red-500">*</span>
//           </label>
//           <input
//             value={value.mobile || ""}
//             onChange={(e) => update("mobile", e.target.value)}
//             disabled={disabled || fieldsLocked}
//             required
//             className={input}
//           />
//         </div>
//         <div>
//           <label className={label}>
//             E-Mail <span className="text-red-500">*</span>
//           </label>
//           <input
//             type="email"
//             value={value.email || ""}
//             onChange={(e) => update("email", e.target.value)}
//             disabled={disabled || fieldsLocked}
//             required
//             className={input}
//           />
//         </div>
//       </div>

//       <div className="mt-3 grid gap-3 sm:grid-cols-2">
//         <div>
//           <label className={label}>
//             Country <span className="text-red-500">*</span>
//           </label>
//           <input
//             value={value.country || ""}
//             onChange={(e) => update("country", e.target.value)}
//             disabled={disabled || fieldsLocked}
//             required
//             className={input}
//           />
//         </div>
//         <div>
//           <label className={label}>
//             IEC No. <span className="text-red-500">*</span>
//           </label>
//           <input
//             value={value.iecNo || ""}
//             onChange={(e) => update("iecNo", e.target.value)}
//             disabled={disabled || fieldsLocked}
//             required
//             className={input}
//           />
//         </div>
//       </div>

//       <div className="mt-3 grid gap-3 sm:grid-cols-2">
//         <div>
//           <label className={label}>
//             Document Type <span className="text-red-500">*</span>
//           </label>
//           <select
//             value={value.documentType || ""}
//             onChange={(e) => update("documentType", e.target.value)}
//             disabled={disabled || fieldsLocked}
//             required
//             className={input}
//           >
//             {DOCUMENT_TYPES.map((t) => (
//               <option key={t.value || "empty"} value={t.value}>
//                 {t.label}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div>
//           <label className={label}>
//             Document No. <span className="text-red-500">*</span>
//           </label>
//           <input
//             value={value.documentNo || ""}
//             onChange={(e) => update("documentNo", e.target.value)}
//             disabled={disabled || fieldsLocked}
//             required
//             className={input}
//           />
//         </div>
//       </div>
//     </section>
//   );
// }

// "use client";

// export type ShipperFormData = {
//   senderId?: string;
//   name: string;
//   company?: string;
//   contactName?: string;
//   phone: string;
//   mobile?: string;
//   email?: string;
//   addressLine1: string;
//   addressLine2?: string;
//   city: string;
//   state?: string;
//   pincode: string;
//   country: string;
//   gstin?: string;
//   iecNo?: string;
//   documentType?: string;
//   documentNo?: string;
//   origin?: string;
//   originCode?: string;
// };

// export type ShipperSenderOption = {
//   id: string;
//   senderId: string;
//   name: string;
//   companyName?: string;
//   phone?: string;
// };

// export type ShipperOriginOption = {
//   id: string;
//   name: string;
//   code?: string;
// };

// type ShipperFormProps = {
//   value: ShipperFormData;
//   onChange: (value: ShipperFormData) => void;
//   disabled?: boolean;
//   senders?: ShipperSenderOption[];
//   selectedSenderId?: string;
//   onSelectSender?: (id: string) => void;
//   lockFieldsFromSender?: boolean;
//   origins?: ShipperOriginOption[];
// };

// const DOCUMENT_TYPES = [
//   { value: "", label: "Select" },
//   { value: "AADHAAR", label: "Aadhaar Number" },
//   { value: "GSTIN (Normal)", label: "GSTIN (Normal)" },
//   { value: "PAN", label: "PAN Number" },
//   { value: "PASSPORT", label: "Passport Number" },
//   { value: "TAN", label: "TAN Number" },
//   { value: "VOTER_ID", label: "Voter Id" },
// ];

// export default function ShipperForm({
//   value,
//   onChange,
//   disabled = false,
//   senders = [],
//   selectedSenderId = "",
//   onSelectSender,
//   lockFieldsFromSender = true,
//   origins = [],
// }: ShipperFormProps) {
//   const update = <K extends keyof ShipperFormData>(
//     field: K,
//     fieldValue: ShipperFormData[K],
//   ) => {
//     onChange({ ...value, [field]: fieldValue });
//   };

//   const input =
//     "h-9 w-full rounded border border-gray-300 bg-white px-2.5 text-sm outline-none focus:border-slate-600 disabled:bg-gray-50 disabled:text-gray-600";
//   const label = "mb-1 block text-xs font-medium text-gray-600";
//   const fieldsLocked = Boolean(lockFieldsFromSender && selectedSenderId);

//   function onOriginChange(name: string) {
//     const o = origins.find(
//       (x) => x.name === name || x.id === name || x.code === name,
//     );
//     onChange({
//       ...value,
//       origin: o?.name || name,
//       originCode: o?.code || "",
//     });
//   }

//   return (
//     <div className="space-y-3">
//       <div className="grid gap-3 sm:grid-cols-2">
//         <div>
//           <label className={label}>
//             Origin <span className="text-red-500">*</span>
//           </label>
//           {origins.length > 0 ? (
//             <select
//               value={value.origin || ""}
//               onChange={(e) => onOriginChange(e.target.value)}
//               disabled={disabled}
//               required
//               className={input}
//             >
//               <option value="">Select origin</option>
//               {origins.map((o) => (
//                 <option key={o.id || o.name} value={o.name}>
//                   {o.name}
//                   {o.code ? ` (${o.code})` : ""}
//                 </option>
//               ))}
//             </select>
//           ) : (
//             <input
//               value={value.origin || ""}
//               onChange={(e) => update("origin", e.target.value)}
//               placeholder="e.g. Guntur"
//               disabled={disabled}
//               required
//               className={input}
//             />
//           )}
//           {origins.length === 0 ? (
//             <p className="mt-1 text-[11px] text-amber-700">
//               No origins in master. Add under Masters → Origins.
//             </p>
//           ) : null}
//         </div>
//         <div>
//           <label className={label}>Origin Code</label>
//           <input
//             value={value.originCode || ""}
//             onChange={(e) => update("originCode", e.target.value)}
//             placeholder="Auto from master"
//             disabled={disabled || origins.length > 0}
//             className={
//               origins.length > 0 ? `${input} bg-gray-50 font-semibold` : input
//             }
//           />
//         </div>
//       </div>

//       <div>
//         <label className={label}>
//           Select Sender <span className="text-red-500">*</span>
//         </label>
//         <select
//           value={selectedSenderId}
//           onChange={(e) => onSelectSender?.(e.target.value)}
//           disabled={disabled}
//           required
//           className={input}
//         >
//           <option value="">— Select from Senders master —</option>
//           {senders.map((s) => (
//             <option key={s.id || s.senderId} value={s.senderId || s.id}>
//               {s.companyName || s.name}
//             </option>
//           ))}
//         </select>
//         <p className="mt-1 text-[11px] text-slate-400">
//           Choosing a sender fills shipper fields. Clear selection to empty the
//           form.
//         </p>
//       </div>

//       <div className="grid gap-3 sm:grid-cols-2">
//         <div>
//           <label className={label}>
//             Company Name <span className="text-red-500">*</span>
//           </label>
//           <input
//             value={value.company || ""}
//             onChange={(e) => update("company", e.target.value)}
//             disabled={disabled || fieldsLocked}
//             required
//             className={input}
//           />
//         </div>
//         <div>
//           <label className={label}>
//             Contact Name <span className="text-red-500">*</span>
//           </label>
//           <input
//             value={value.contactName || value.name || ""}
//             onChange={(e) => {
//               update("contactName", e.target.value);
//               update("name", e.target.value);
//             }}
//             disabled={disabled || fieldsLocked}
//             required
//             className={input}
//           />
//         </div>
//       </div>

//       <div>
//         <label className={label}>
//           GSTIN <span className="text-red-500">*</span>
//         </label>
//         <input
//           value={value.gstin || ""}
//           onChange={(e) => update("gstin", e.target.value.toUpperCase())}
//           disabled={disabled || fieldsLocked}
//           required
//           className={input}
//         />
//       </div>

//       <div>
//         <label className={label}>
//           Address 1 <span className="text-red-500">*</span>
//         </label>
//         <input
//           value={value.addressLine1 || ""}
//           onChange={(e) => update("addressLine1", e.target.value)}
//           disabled={disabled || fieldsLocked}
//           required
//           className={input}
//         />
//       </div>

//       <div>
//         <label className={label}>
//           Address 2 <span className="text-red-500">*</span>
//         </label>
//         <input
//           value={value.addressLine2 || ""}
//           onChange={(e) => update("addressLine2", e.target.value)}
//           disabled={disabled || fieldsLocked}
//           required
//           className={input}
//         />
//       </div>

//       <div className="grid gap-3 sm:grid-cols-2">
//         <div>
//           <label className={label}>
//             City <span className="text-red-500">*</span>
//           </label>
//           <input
//             value={value.city || ""}
//             onChange={(e) => update("city", e.target.value)}
//             disabled={disabled || fieldsLocked}
//             required
//             className={input}
//           />
//         </div>
//         <div>
//           <label className={label}>
//             Pincode <span className="text-red-500">*</span>
//           </label>
//           <input
//             value={value.pincode || ""}
//             onChange={(e) => update("pincode", e.target.value)}
//             disabled={disabled || fieldsLocked}
//             required
//             className={input}
//           />
//         </div>
//       </div>

//       <div className="grid gap-3 sm:grid-cols-2">
//         <div>
//           <label className={label}>
//             State <span className="text-red-500">*</span>
//           </label>
//           <input
//             value={value.state || ""}
//             onChange={(e) => update("state", e.target.value)}
//             disabled={disabled || fieldsLocked}
//             required
//             className={input}
//           />
//         </div>
//         <div>
//           <label className={label}>
//             Telephone <span className="text-red-500">*</span>
//           </label>
//           <input
//             value={value.phone || ""}
//             onChange={(e) => update("phone", e.target.value)}
//             disabled={disabled || fieldsLocked}
//             required
//             className={input}
//           />
//         </div>
//       </div>

//       <div className="grid gap-3 sm:grid-cols-2">
//         <div>
//           <label className={label}>
//             Mobile No. <span className="text-red-500">*</span>
//           </label>
//           <input
//             value={value.mobile || ""}
//             onChange={(e) => update("mobile", e.target.value)}
//             disabled={disabled || fieldsLocked}
//             required
//             className={input}
//           />
//         </div>
//         <div>
//           <label className={label}>
//             E-Mail <span className="text-red-500">*</span>
//           </label>
//           <input
//             type="email"
//             value={value.email || ""}
//             onChange={(e) => update("email", e.target.value)}
//             disabled={disabled || fieldsLocked}
//             required
//             className={input}
//           />
//         </div>
//       </div>

//       <div className="grid gap-3 sm:grid-cols-2">
//         <div>
//           <label className={label}>
//             Country <span className="text-red-500">*</span>
//           </label>
//           <input
//             value={value.country || ""}
//             onChange={(e) => update("country", e.target.value)}
//             disabled={disabled || fieldsLocked}
//             required
//             className={input}
//           />
//         </div>
//         <div>
//           <label className={label}>
//             IEC No. <span className="text-red-500">*</span>
//           </label>
//           <input
//             value={value.iecNo || ""}
//             onChange={(e) => update("iecNo", e.target.value)}
//             disabled={disabled || fieldsLocked}
//             required
//             className={input}
//           />
//         </div>
//       </div>

//       <div className="grid gap-3 sm:grid-cols-2">
//         <div>
//           <label className={label}>
//             Document Type <span className="text-red-500">*</span>
//           </label>
//           <select
//             value={value.documentType || ""}
//             onChange={(e) => update("documentType", e.target.value)}
//             disabled={disabled || fieldsLocked}
//             required
//             className={input}
//           >
//             {DOCUMENT_TYPES.map((t) => (
//               <option key={t.value || "empty"} value={t.value}>
//                 {t.label}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div>
//           <label className={label}>
//             Document No. <span className="text-red-500">*</span>
//           </label>
//           <input
//             value={value.documentNo || ""}
//             onChange={(e) => update("documentNo", e.target.value)}
//             disabled={disabled || fieldsLocked}
//             required
//             className={input}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useState } from "react";
// import { Loader2, Upload, FileText } from "lucide-react";
// import { useAuth } from "@/context/AuthContext";

// export type ShipperFormData = {
//   senderId?: string;
//   name: string;
//   company?: string;
//   contactName?: string;
//   phone: string;
//   mobile?: string;
//   email?: string;
//   addressLine1: string;
//   addressLine2?: string;
//   city: string;
//   state?: string;
//   pincode: string;
//   country: string;
//   gstin?: string;
//   iecNo?: string;
//   documentType?: string;
//   documentNo?: string;
//   documentUrl?: string;
//   origin?: string;
//   originCode?: string;
// };

// export type ShipperSenderOption = {
//   id: string;
//   senderId: string;
//   name: string;
//   companyName?: string;
//   phone?: string;
// };

// export type ShipperOriginOption = {
//   id: string;
//   name: string;
//   code?: string;
// };

// type ShipperFormProps = {
//   value: ShipperFormData;
//   onChange: (value: ShipperFormData) => void;
//   disabled?: boolean;
//   senders?: ShipperSenderOption[];
//   selectedSenderId?: string;
//   onSelectSender?: (id: string) => void;
//   lockFieldsFromSender?: boolean;
//   origins?: ShipperOriginOption[];
// };

// const DOCUMENT_TYPES = [
//   { value: "", label: "Select" },
//   { value: "AADHAAR", label: "Aadhaar Number" },
//   { value: "GSTIN (Normal)", label: "GSTIN (Normal)" },
//   { value: "PAN", label: "PAN Number" },
//   { value: "PASSPORT", label: "Passport Number" },
//   { value: "TAN", label: "TAN Number" },
//   { value: "VOTER_ID", label: "Voter Id" },
// ];

// // function DocumentPreview({
// //   url,
// //   onClear,
// // }: {
// //   url: string;
// //   onClear?: () => void;
// // }) {
// //   const [open, setOpen] = useState(false);
// //   const isPdf = /\.pdf(\?|$)/i.test(url) || url.toLowerCase().includes("application/pdf");

// //   return (
// //     <>
// //       <div className="flex items-start gap-3">
// //         <button
// //           type="button"
// //           onClick={() => setOpen(true)}
// //           className="group relative h-16 w-16 overflow-hidden rounded border border-slate-200 bg-slate-50"
// //           title="Click to enlarge"
// //         >
// //           {isPdf ? (
// //             <span className="flex h-full w-full flex-col items-center justify-center text-[10px] font-bold text-slate-600">
// //               <FileText className="mb-0.5 h-5 w-5 text-[#087f87]" />
// //               PDF
// //             </span>
// //           ) : (
// //             // eslint-disable-next-line @next/next/no-img-element
// //             <img
// //               src={url}
// //               alt="Document"
// //               className="h-full w-full object-cover transition group-hover:opacity-90"
// //             />
// //           )}
// //         </button>
// //         <div className="flex flex-col gap-1 text-xs">
// //           <button
// //             type="button"
// //             onClick={() => setOpen(true)}
// //             className="text-left font-semibold text-[#087f87] hover:underline"
// //           >
// //             View / enlarge
// //           </button>
// //           <a
// //             href={url}
// //             target="_blank"
// //             rel="noreferrer"
// //             className="text-slate-500 hover:underline"
// //           >
// //             Open in new tab
// //           </a>
// //           {onClear ? (
// //             <button
// //               type="button"
// //               onClick={onClear}
// //               className="text-left text-red-600 hover:underline"
// //             >
// //               Remove
// //             </button>
// //           ) : null}
// //         </div>
// //       </div>

// //       {open ? (
// //         <div
// //           className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"
// //           onClick={() => setOpen(false)}
// //         >
// //           <div
// //             className="relative max-h-[90vh] max-w-[90vw] overflow-auto rounded-lg bg-white p-2 shadow-xl"
// //             onClick={(e) => e.stopPropagation()}
// //           >
// //             <button
// //               type="button"
// //               onClick={() => setOpen(false)}
// //               className="absolute right-2 top-2 z-10 rounded bg-slate-900/80 px-2 py-1 text-xs font-bold text-white"
// //             >
// //               Close
// //             </button>
// //             {isPdf ? (
// //               <iframe
// //                 src={url}
// //                 title="Document"
// //                 className="h-[80vh] w-[min(900px,90vw)] rounded border-0"
// //               />
// //             ) : (
// //               // eslint-disable-next-line @next/next/no-img-element
// //               <img
// //                 src={url}
// //                 alt="Document full size"
// //                 className="max-h-[85vh] max-w-full object-contain"
// //               />
// //             )}
// //           </div>
// //         </div>
// //       ) : null}
// //     </>
// //   );
// // }

// function DocumentPreview({ url }: { url: string }) {
//   const [open, setOpen] = useState(false);
//   const isPdf =
//     /\.pdf(\?|$)/i.test(url) ||
//     url.toLowerCase().includes("application/pdf");

//   return (
//     <>
//       <div className="flex items-start gap-3">
//         <button
//           type="button"
//           onClick={() => setOpen(true)}
//           className="group relative h-16 w-16 overflow-hidden rounded border border-slate-200 bg-slate-50"
//           title="Click to enlarge"
//         >
//           {isPdf ? (
//             <span className="flex h-full w-full flex-col items-center justify-center text-[10px] font-bold text-slate-600">
//               <FileText className="mb-0.5 h-5 w-5 text-[#087f87]" />
//               PDF
//             </span>
//           ) : (
//             // eslint-disable-next-line @next/next/no-img-element
//             <img
//               src={url}
//               alt="Document"
//               className="h-full w-full object-cover transition group-hover:opacity-90"
//             />
//           )}
//         </button>
//         <div className="flex flex-col gap-1 text-xs">
//           <button
//             type="button"
//             onClick={() => setOpen(true)}
//             className="text-left font-semibold text-[#087f87] hover:underline"
//           >
//             View / enlarge
//           </button>
//           <a
//             href={url}
//             target="_blank"
//             rel="noreferrer"
//             className="text-slate-500 hover:underline"
//           >
//             Open in new tab
//           </a>
//         </div>
//       </div>

//       {open ? (
//         <div
//           className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"
//           onClick={() => setOpen(false)}
//         >
//           <div
//             className="relative max-h-[90vh] max-w-[90vw] overflow-auto rounded-lg bg-white p-2 shadow-xl"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <button
//               type="button"
//               onClick={() => setOpen(false)}
//               className="absolute right-2 top-2 z-10 rounded bg-slate-900/80 px-2 py-1 text-xs font-bold text-white"
//             >
//               Close
//             </button>
//             {isPdf ? (
//               <iframe
//                 src={url}
//                 title="Document"
//                 className="h-[80vh] w-[min(900px,90vw)] rounded border-0"
//               />
//             ) : (
//               // eslint-disable-next-line @next/next/no-img-element
//               <img
//                 src={url}
//                 alt="Document full size"
//                 className="max-h-[85vh] max-w-full object-contain"
//               />
//             )}
//           </div>
//         </div>
//       ) : null}
//     </>
//   );
// }

// export default function ShipperForm({
//   value,
//   onChange,
//   disabled = false,
//   senders = [],
//   selectedSenderId = "",
//   onSelectSender,
//   lockFieldsFromSender = true,
//   origins = [],
// }: ShipperFormProps) {
//   const { firebaseUser } = useAuth();
//   const [uploading, setUploading] = useState(false);
//   const [uploadError, setUploadError] = useState<string | null>(null);

//   const update = <K extends keyof ShipperFormData>(
//     field: K,
//     fieldValue: ShipperFormData[K],
//   ) => {
//     onChange({ ...value, [field]: fieldValue });
//   };

//   const input =
//     "h-9 w-full rounded border border-gray-300 bg-white px-2.5 text-sm outline-none focus:border-slate-600 disabled:bg-gray-50 disabled:text-gray-600";
//   const label = "mb-1 block text-xs font-medium text-gray-600";
//   const fieldsLocked = Boolean(lockFieldsFromSender && selectedSenderId);

//   function onOriginChange(name: string) {
//     const o = origins.find(
//       (x) => x.name === name || x.id === name || x.code === name,
//     );
//     onChange({
//       ...value,
//       origin: o?.name || name,
//       originCode: o?.code || "",
//     });
//   }

//   async function handleDocumentUpload(file: File | null) {
//     if (!file || disabled) return;

//     const allowed = [
//       "image/jpeg",
//       "image/png",
//       "image/webp",
//       "application/pdf",
//     ];
//     if (!allowed.includes(file.type)) {
//       setUploadError("Only JPG, PNG, WebP, or PDF allowed.");
//       return;
//     }
//     if (file.size > 10 * 1024 * 1024) {
//       setUploadError("File must be 10 MB or smaller.");
//       return;
//     }
//     if (!firebaseUser) {
//       setUploadError("Authentication is required to upload.");
//       return;
//     }

//     try {
//       setUploading(true);
//       setUploadError(null);

//       const token = await firebaseUser.getIdToken(true);
//       const body = new FormData();
//       body.append("file", file);
//       body.append("context", "shipper-document");
//       body.append("ownerId", firebaseUser.uid);

//       const res = await fetch("/api/uploads", {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}` },
//         body,
//       });
//       const json = await res.json();

//       if (!res.ok || !json.success) {
//         throw new Error(json?.error?.message || "Failed to upload document.");
//       }

//       const url = String(
//         json.data?.downloadUrl || json.data?.url || "",
//       ).trim();
//       if (!url) throw new Error("Upload succeeded but no URL returned.");

//       update("documentUrl", url);
//     } catch (e) {
//       setUploadError(
//         e instanceof Error ? e.message : "Failed to upload document.",
//       );
//     } finally {
//       setUploading(false);
//     }
//   }

//   return (
//     <div className="space-y-3">
//       <div className="grid gap-3 sm:grid-cols-2">
//         <div>
//           <label className={label}>
//             Origin <span className="text-red-500">*</span>
//           </label>
//           {origins.length > 0 ? (
//             <select
//               value={value.origin || ""}
//               onChange={(e) => onOriginChange(e.target.value)}
//               disabled={disabled}
//               required
//               className={input}
//             >
//               <option value="">Select origin</option>
//               {origins.map((o) => (
//                 <option key={o.id || o.name} value={o.name}>
//                   {o.name}
//                   {o.code ? ` (${o.code})` : ""}
//                 </option>
//               ))}
//             </select>
//           ) : (
//             <input
//               value={value.origin || ""}
//               onChange={(e) => update("origin", e.target.value)}
//               placeholder="e.g. Guntur"
//               disabled={disabled}
//               required
//               className={input}
//             />
//           )}
//           {origins.length === 0 ? (
//             <p className="mt-1 text-[11px] text-amber-700">
//               No origins in master. Add under Masters → Origins.
//             </p>
//           ) : null}
//         </div>
//         {/* <div>
//           <label className={label}>Origin Code</label>
//           <input
//             value={value.originCode || ""}
//             onChange={(e) => update("originCode", e.target.value)}
//             placeholder="Origin Code"
//             disabled={disabled || origins.length > 0}
//             className={
//               origins.length > 0 ? `${input} bg-gray-50` : input
//             }
//           />
//         </div> */}
//         <div>
//         <label className={label}>Origin Code</label>
//         <input
//           value={value.originCode || ""}
//           readOnly
//           placeholder="Origin Code"
//           className={`${input} bg-gray-50`}
//         />
//       </div>
//       </div>

//       <div>
//         <label className={label}>
//           Select Sender <span className="text-red-500">*</span>
//         </label>
//         <select
//           value={selectedSenderId}
//           onChange={(e) => onSelectSender?.(e.target.value)}
//           disabled={disabled}
//           required
//           className={input}
//         >
//           <option value="">— Select from Senders master —</option>
//           {senders.map((s) => (
//             <option key={s.id || s.senderId} value={s.senderId || s.id}>
//               {s.companyName || s.name}
//             </option>
//           ))}
//         </select>
//         <p className="mt-1 text-[11px] text-slate-400">
//           Choosing a sender fills shipper fields. Clear selection to empty the
//           form.
//         </p>
//       </div>

//       <div className="grid gap-3 sm:grid-cols-2">
//         <div>
//           <label className={label}>
//             Company Name <span className="text-red-500">*</span>
//           </label>
//           <input
//             value={value.company || ""}
//             onChange={(e) => update("company", e.target.value)}
//             disabled={disabled || fieldsLocked}
//             required
//             className={input}
//           />
//         </div>
//         <div>
//           <label className={label}>
//             Contact Name <span className="text-red-500">*</span>
//           </label>
//           <input
//             value={value.contactName || value.name || ""}
//             onChange={(e) => {
//               onChange({
//                 ...value,
//                 contactName: e.target.value,
//                 name: e.target.value,
//               });
//             }}
//             disabled={disabled || fieldsLocked}
//             required
//             className={input}
//           />
//         </div>
//       </div>

//       <div>
//         <label className={label}>
//           GSTIN <span className="text-red-500">*</span>
//         </label>
//         <input
//           value={value.gstin || ""}
//           onChange={(e) => update("gstin", e.target.value.toUpperCase())}
//           disabled={disabled || fieldsLocked}
//           required
//           className={input}
//         />
//       </div>

//       <div>
//         <label className={label}>
//           Address 1 <span className="text-red-500">*</span>
//         </label>
//         <input
//           value={value.addressLine1 || ""}
//           onChange={(e) => update("addressLine1", e.target.value)}
//           disabled={disabled || fieldsLocked}
//           required
//           className={input}
//         />
//       </div>

//       <div>
//         <label className={label}>
//           Address 2 <span className="text-red-500">*</span>
//         </label>
//         <input
//           value={value.addressLine2 || ""}
//           onChange={(e) => update("addressLine2", e.target.value)}
//           disabled={disabled || fieldsLocked}
//           required
//           className={input}
//         />
//       </div>

//       <div className="grid gap-3 sm:grid-cols-2">
//         <div>
//           <label className={label}>
//             City <span className="text-red-500">*</span>
//           </label>
//           <input
//             value={value.city || ""}
//             onChange={(e) => update("city", e.target.value)}
//             disabled={disabled || fieldsLocked}
//             required
//             className={input}
//           />
//         </div>
//         <div>
//           <label className={label}>
//             Pincode <span className="text-red-500">*</span>
//           </label>
//           <input
//             value={value.pincode || ""}
//             onChange={(e) => update("pincode", e.target.value)}
//             disabled={disabled || fieldsLocked}
//             required
//             className={input}
//           />
//         </div>
//       </div>

//       <div className="grid gap-3 sm:grid-cols-2">
//         <div>
//           <label className={label}>
//             State <span className="text-red-500">*</span>
//           </label>
//           <input
//             value={value.state || ""}
//             onChange={(e) => update("state", e.target.value)}
//             disabled={disabled || fieldsLocked}
//             required
//             className={input}
//           />
//         </div>
//         <div>
//           <label className={label}>
//             Telephone <span className="text-red-500">*</span>
//           </label>
//           <input
//             value={value.phone || ""}
//             onChange={(e) => update("phone", e.target.value)}
//             disabled={disabled || fieldsLocked}
//             required
//             className={input}
//           />
//         </div>
//       </div>

//       <div className="grid gap-3 sm:grid-cols-2">
//         <div>
//           <label className={label}>
//             Mobile No. <span className="text-red-500">*</span>
//           </label>
//           <input
//             value={value.mobile || ""}
//             onChange={(e) => update("mobile", e.target.value)}
//             disabled={disabled || fieldsLocked}
//             required
//             className={input}
//           />
//         </div>
//         <div>
//           <label className={label}>
//             E-Mail <span className="text-red-500">*</span>
//           </label>
//           <input
//             type="email"
//             value={value.email || ""}
//             onChange={(e) => update("email", e.target.value)}
//             disabled={disabled || fieldsLocked}
//             required
//             className={input}
//           />
//         </div>
//       </div>

//       <div className="grid gap-3 sm:grid-cols-2">
//         <div>
//           <label className={label}>
//             Country <span className="text-red-500">*</span>
//           </label>
//           <input
//             value={value.country || ""}
//             onChange={(e) => update("country", e.target.value)}
//             disabled={disabled || fieldsLocked}
//             required
//             className={input}
//           />
//         </div>
//         <div>
//           <label className={label}>
//             IEC No. <span className="text-red-500">*</span>
//           </label>
//           <input
//             value={value.iecNo || ""}
//             onChange={(e) => update("iecNo", e.target.value)}
//             disabled={disabled || fieldsLocked}
//             required
//             className={input}
//           />
//         </div>
//       </div>

//       <div className="grid gap-3 sm:grid-cols-2">
//         <div>
//           <label className={label}>
//             Document Type <span className="text-red-500">*</span>
//           </label>
//           <select
//             value={value.documentType || ""}
//             onChange={(e) => update("documentType", e.target.value)}
//             disabled={disabled || fieldsLocked}
//             required
//             className={input}
//           >
//             {DOCUMENT_TYPES.map((t) => (
//               <option key={t.value || "empty"} value={t.value}>
//                 {t.label}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div>
//           <label className={label}>
//             Document No. <span className="text-red-500">*</span>
//           </label>
//           <input
//             value={value.documentNo || ""}
//             onChange={(e) => update("documentNo", e.target.value)}
//             disabled={disabled || fieldsLocked}
//             required
//             className={input}
//           />
//         </div>
//       </div>

//       {/* Same upload UI as Consignee */}
//       {/* <div>
//         <label className={label}>Document file (image / PDF)</label>
//         <div className="flex flex-col gap-2">
//           <label
//             className={[
//               "flex h-9 cursor-pointer items-center justify-center gap-2 rounded border border-dashed border-gray-300 bg-white px-2 text-xs font-medium text-slate-700 hover:bg-slate-50",
//               disabled || uploading ? "pointer-events-none opacity-60" : "",
//             ].join(" ")}
//           >
//             {uploading ? (
//               <>
//                 <Loader2 className="h-3.5 w-3.5 animate-spin" />
//                 Uploading…
//               </>
//             ) : (
//               <>
//                 <Upload className="h-3.5 w-3.5" />
//                 Upload image or PDF
//               </>
//             )}
//             <input
//               type="file"
//               accept="image/jpeg,image/png,image/webp,application/pdf"
//               className="hidden"
//               disabled={disabled || uploading}
//               onChange={(e) =>
//                 handleDocumentUpload(e.target.files?.[0] ?? null)
//               }
//             />
//           </label>

//           {value.documentUrl ? (
//             <a
//               href={value.documentUrl}
//               target="_blank"
//               rel="noreferrer"
//               className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#087f87] hover:underline"
//             >
//               <FileText className="h-3.5 w-3.5" />
//               View uploaded document
//             </a>
//           ) : null}

//           {uploadError ? (
//             <p className="text-xs text-red-600">{uploadError}</p>
//           ) : null}
//         </div>
//       </div> */}

//       {/* Document file */}
// {/* <div>
//   <label className={label}>Document file (image / PDF)</label>
//   <div className="flex flex-col gap-2">
//     <label
//       className={[
//         "flex h-9 cursor-pointer items-center justify-center gap-2 rounded border border-dashed border-gray-300 bg-white px-2 text-xs font-medium text-slate-700 hover:bg-slate-50",
//         disabled || uploading ? "pointer-events-none opacity-60" : "",
//       ].join(" ")}
//     >
//       {uploading ? (
//         <>
//           <Loader2 className="h-3.5 w-3.5 animate-spin" />
//           Uploading…
//         </>
//       ) : (
//         <>
//           <Upload className="h-3.5 w-3.5" />
//           Upload image or PDF
//         </>
//       )}
//       <input
//         type="file"
//         accept="image/jpeg,image/png,image/webp,application/pdf"
//         className="hidden"
//         disabled={disabled || uploading}
//         onChange={(e) =>
//           handleDocumentUpload(e.target.files?.[0] ?? null)
//         }
//       />
//     </label>

//     {value.documentUrl ? (
//       <DocumentPreview
//         url={value.documentUrl}
//         onClear={
//           disabled
//             ? undefined
//             : () => update("documentUrl", "")
//         }
//       />
//     ) : null}

//     {uploadError ? (
//       <p className="text-xs text-red-600">{uploadError}</p>
//     ) : null}
//   </div>
// </div> */}

//       {/* Document from Senders master only — no upload here */}
//       <div>
//         <label className={label}>Document file</label>
//         {value.documentUrl ? (
//           <DocumentPreview url={value.documentUrl} />
//         ) : (
//           <p className="text-xs text-slate-400">
//             No document. Upload under Masters → Senders, then select sender.
//           </p>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { Loader2, Upload, FileText } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export type ShipperFormData = {
  senderId?: string;
  name: string;
  company?: string;
  contactName?: string;
  phone: string;
  mobile?: string;
  email?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  pincode: string;
  country: string;
  gstin?: string;
  iecNo?: string;
  documentType?: string;
  documentNo?: string;
  documentUrl?: string;
  origin?: string;
  originCode?: string;
};

export type ShipperSenderOption = {
  id: string;
  senderId: string;
  name: string;
  companyName?: string;
  phone?: string;
};

export type ShipperOriginOption = {
  id: string;
  name: string;
  code?: string;
};

type ShipperFormProps = {
  value: ShipperFormData;
  onChange: (value: ShipperFormData) => void;
  disabled?: boolean;
  senders?: ShipperSenderOption[];
  selectedSenderId?: string;
  onSelectSender?: (id: string) => void;
  lockFieldsFromSender?: boolean;
  origins?: ShipperOriginOption[];
};

const DOCUMENT_TYPES = [
  { value: "", label: "Select" },
  { value: "AADHAAR", label: "Aadhaar Number" },
  { value: "GSTIN (Normal)", label: "GSTIN (Normal)" },
  { value: "PAN", label: "PAN Number" },
  { value: "PASSPORT", label: "Passport Number" },
  { value: "TAN", label: "TAN Number" },
  { value: "VOTER_ID", label: "Voter Id" },
];

function DocumentPreview({ url }: { url: string }) {
  const [open, setOpen] = useState(false);
  const isPdf =
    /\.pdf(\?|$)/i.test(url) ||
    url.toLowerCase().includes("application/pdf");

  return (
    <>
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group relative h-16 w-16 overflow-hidden rounded border border-slate-200 bg-slate-50"
          title="Click to enlarge"
        >
          {isPdf ? (
            <span className="flex h-full w-full flex-col items-center justify-center text-[10px] font-bold text-slate-600">
              <FileText className="mb-0.5 h-5 w-5 text-[#087f87]" />
              PDF
            </span>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={url}
              alt="Document"
              className="h-full w-full object-cover transition group-hover:opacity-90"
            />
          )}
        </button>
        <div className="flex flex-col gap-1 text-xs">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="text-left font-semibold text-[#087f87] hover:underline"
          >
            View / enlarge
          </button>
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="text-slate-500 hover:underline"
          >
            Open in new tab
          </a>
        </div>
      </div>

      {open ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative max-h-[90vh] max-w-[90vw] overflow-auto rounded-lg bg-white p-2 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-2 top-2 z-10 rounded bg-slate-900/80 px-2 py-1 text-xs font-bold text-white"
            >
              Close
            </button>
            {isPdf ? (
              <iframe
                src={url}
                title="Document"
                className="h-[80vh] w-[min(900px,90vw)] rounded border-0"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={url}
                alt="Document full size"
                className="max-h-[85vh] max-w-full object-contain"
              />
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}

export default function ShipperForm({
  value,
  onChange,
  disabled = false,
  senders = [],
  selectedSenderId = "",
  onSelectSender,
  lockFieldsFromSender = true,
  origins = [],
}: ShipperFormProps) {
  const { firebaseUser } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const update = <K extends keyof ShipperFormData>(
    field: K,
    fieldValue: ShipperFormData[K],
  ) => {
    // Manual edit → clear linked master so create API can upsert as new/update
    if (selectedSenderId && onSelectSender) {
      onSelectSender("");
    }
    onChange({
      ...value,
      [field]: fieldValue,
      senderId: undefined,
    });
  };

  const input =
    "h-9 w-full rounded border border-gray-300 bg-white px-2.5 text-sm outline-none focus:border-slate-600 disabled:bg-gray-50 disabled:text-gray-600";
  const label = "mb-1 block text-xs font-medium text-gray-600";

  // Only lock when a master is selected AND lock flag is on
  const fieldsLocked = Boolean(
    lockFieldsFromSender && selectedSenderId && !disabled,
  );
  const canEditFields = !disabled && !fieldsLocked;

  function onOriginChange(name: string) {
    const o = origins.find(
      (x) => x.name === name || x.id === name || x.code === name,
    );
    onChange({
      ...value,
      origin: o?.name || name,
      originCode: o?.code || "",
    });
  }

  async function handleDocumentUpload(file: File | null) {
    if (!file || disabled || fieldsLocked) return;

    const allowed = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];
    if (!allowed.includes(file.type)) {
      setUploadError("Only JPG, PNG, WebP, or PDF allowed.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("File must be 10 MB or smaller.");
      return;
    }
    if (!firebaseUser) {
      setUploadError("Authentication is required to upload.");
      return;
    }

    try {
      setUploading(true);
      setUploadError(null);

      const token = await firebaseUser.getIdToken(true);
      const body = new FormData();
      body.append("file", file);
      body.append("context", "shipper-document");
      body.append("ownerId", firebaseUser.uid);

      const res = await fetch("/api/uploads", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body,
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json?.error?.message || "Failed to upload document.");
      }

      const url = String(
        json.data?.downloadUrl || json.data?.url || "",
      ).trim();
      if (!url) throw new Error("Upload succeeded but no URL returned.");

      onChange({
        ...value,
        documentUrl: url,
        senderId: undefined,
      });
      if (selectedSenderId && onSelectSender) onSelectSender("");
    } catch (e) {
      setUploadError(
        e instanceof Error ? e.message : "Failed to upload document.",
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={label}>
            Origin <span className="text-red-500">*</span>
          </label>
          {origins.length > 0 ? (
            <select
              value={value.origin || ""}
              onChange={(e) => onOriginChange(e.target.value)}
              disabled={disabled}
              required
              className={input}
            >
              <option value="">Select origin</option>
              {origins.map((o) => (
                <option key={o.id || o.name} value={o.name}>
                  {o.name}
                  {o.code ? ` (${o.code})` : ""}
                </option>
              ))}
            </select>
          ) : (
            <input
              value={value.origin || ""}
              onChange={(e) =>
                onChange({ ...value, origin: e.target.value })
              }
              placeholder="e.g. Guntur"
              disabled={disabled}
              required
              className={input}
            />
          )}
          {origins.length === 0 ? (
            <p className="mt-1 text-[11px] text-amber-700">
              No origins in master. Add under Masters → Origins.
            </p>
          ) : null}
        </div>
        <div>
          <label className={label}>Origin Code</label>
          <input
            value={value.originCode || ""}
            readOnly
            placeholder="Origin Code"
            className={`${input} bg-gray-50`}
          />
        </div>
      </div>

      <div>
        <label className={label}>Select Sender (optional)</label>
        <select
          value={selectedSenderId}
          onChange={(e) => onSelectSender?.(e.target.value)}
          disabled={disabled}
          className={input}
        >
          <option value="">— Enter manually / clear selection —</option>
          {senders.map((s) => (
            <option key={s.id || s.senderId} value={s.senderId || s.id}>
              {s.companyName || s.name}
            </option>
          ))}
        </select>
        <p className="mt-1 text-[11px] text-slate-400">
          Pick a sender to auto-fill, or leave empty and type details. New
          manual entries are saved under Masters → Senders when the AWB is
          created.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={label}>
            Company Name
          </label>
          <input
            value={value.company || ""}
            onChange={(e) => update("company", e.target.value)}
            disabled={!canEditFields}
            className={input}
          />
        </div>
        <div>
          <label className={label}>
            Name <span className="text-red-500">*</span>
          </label>
          <input
            value={value.contactName || value.name || ""}
            onChange={(e) => {
              if (selectedSenderId && onSelectSender) onSelectSender("");
              onChange({
                ...value,
                contactName: e.target.value,
                name: e.target.value,
                senderId: undefined,
              });
            }}
            disabled={!canEditFields}
            required
            className={input}
          />
        </div>
      </div>

      <div>
        <label className={label}>
          GSTIN
        </label>
        <input
          value={value.gstin || ""}
          onChange={(e) => update("gstin", e.target.value.toUpperCase())}
          disabled={!canEditFields}
          className={input}
        />
      </div>

      <div>
        <label className={label}>
          Address 1 <span className="text-red-500">*</span>
        </label>
        <input
          value={value.addressLine1 || ""}
          onChange={(e) => update("addressLine1", e.target.value)}
          disabled={!canEditFields}
          required
          className={input}
        />
      </div>

      <div>
        <label className={label}>Address 2<span className="font-normal text-slate-400">(optional)</span></label>
        <input
          value={value.addressLine2 || ""}
          onChange={(e) => update("addressLine2", e.target.value)}
          disabled={!canEditFields}
          className={input}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={label}>
            City <span className="text-red-500">*</span>
          </label>
          <input
            value={value.city || ""}
            onChange={(e) => update("city", e.target.value)}
            disabled={!canEditFields}
            required
            className={input}
          />
        </div>
        <div>
          <label className={label}>
            Pincode <span className="text-red-500">*</span>
          </label>
          <input
            value={value.pincode || ""}
            onChange={(e) => update("pincode", e.target.value)}
            disabled={!canEditFields}
            required
            className={input}
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={label}>
            State <span className="text-red-500">*</span>
          </label>
          <input
            value={value.state || ""}
            onChange={(e) => update("state", e.target.value)}
            disabled={!canEditFields}
            required
            className={input}
          />
        </div>
        <div>
          <label className={label}>Telephone<span className="font-normal text-slate-400">(optional)</span></label>
          <input
            value={value.phone || ""}
            onChange={(e) => update("phone", e.target.value)}
            disabled={!canEditFields}
            className={input}
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={label}>
            Mobile No. <span className="text-red-500">*</span>
          </label>
          <input
            value={value.mobile || ""}
            onChange={(e) => update("mobile", e.target.value)}
            disabled={!canEditFields}
            required
            className={input}
          />
        </div>
        <div>
          <label className={label}>
            E-Mail
          </label>
          <input
            type="email"
            value={value.email || ""}
            onChange={(e) => update("email", e.target.value)}
            disabled={!canEditFields}
            className={input}
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={label}>
            Country <span className="text-red-500">*</span>
          </label>
          <input
            value={value.country || ""}
            onChange={(e) => update("country", e.target.value)}
            disabled={!canEditFields}
            required
            className={input}
          />
        </div>
        <div>
          <label className={label}>
            IEC No. 
          </label>
          <input
            value={value.iecNo || ""}
            onChange={(e) => update("iecNo", e.target.value)}
            disabled={!canEditFields}
            className={input}
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={label}>
            Document Type <span className="text-red-500">*</span>
          </label>
          <select
            value={value.documentType || ""}
            onChange={(e) => update("documentType", e.target.value)}
            disabled={!canEditFields}
            required
            className={input}
          >
            {DOCUMENT_TYPES.map((t) => (
              <option key={t.value || "empty"} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={label}>
            Document No. <span className="text-red-500">*</span>
          </label>
          <input
            value={value.documentNo || ""}
            onChange={(e) => update("documentNo", e.target.value)}
            disabled={!canEditFields}
            required
            className={input}
          />
        </div>
      </div>

      <div>
        <label className={label}>Document file</label>
        {fieldsLocked ? (
          value.documentUrl ? (
            <DocumentPreview url={value.documentUrl} />
          ) : (
            <p className="text-xs text-slate-400">
              No document on this sender. Upload under Masters → Senders.
            </p>
          )
        ) : (
          <div className="flex flex-col gap-2">
            <label
              className={[
                "flex h-9 cursor-pointer items-center justify-center gap-2 rounded border border-dashed border-gray-300 bg-white px-2 text-xs font-medium text-slate-700 hover:bg-slate-50",
                disabled || uploading ? "pointer-events-none opacity-60" : "",
              ].join(" ")}
            >
              {uploading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Uploading…
                </>
              ) : (
                <>
                  <Upload className="h-3.5 w-3.5" />
                  Upload image or PDF
                </>
              )}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,application/pdf"
                className="hidden"
                disabled={disabled || uploading}
                onChange={(e) =>
                  handleDocumentUpload(e.target.files?.[0] ?? null)
                }
              />
            </label>
            {value.documentUrl ? (
              <DocumentPreview url={value.documentUrl} />
            ) : null}
            {uploadError ? (
              <p className="text-xs text-red-600">{uploadError}</p>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}