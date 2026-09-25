// "use client";

// export type ConsigneeFormData = {
//   receiverId?: string;
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
//   // Extra
//   gstin?: string;
//   iecNo?: string;
//   documentType?: string;
//   documentNo?: string;
//   destinationCode?: string;
// };

// type ConsigneeFormProps = {
//   value: ConsigneeFormData;
//   onChange: (value: ConsigneeFormData) => void;
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

// export default function ConsigneeForm({
//   value,
//   onChange,
//   disabled = false,
// }: ConsigneeFormProps) {
//   const update = <K extends keyof ConsigneeFormData>(
//     field: K,
//     fieldValue: ConsigneeFormData[K],
//   ) => {
//     onChange({ ...value, [field]: fieldValue });
//   };

//   const input =
//     "h-9 w-full rounded border border-gray-300 bg-white px-2.5 text-sm outline-none focus:border-slate-600 disabled:bg-gray-50";
//   const label = "mb-1 block text-xs font-medium text-gray-600";

//   return (
//     <div className="space-y-3">
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
//             value={value.contactName ?? ""}
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
//           <label className={label}>Pincode *</label>
//           <input
//             value={value.pincode}
//             onChange={(e) => update("pincode", e.target.value)}
//             className={input}
//             disabled={disabled}
//             required
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
//           <label className={label}>State *</label>
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

// import { useState } from "react";
// import { Loader2, Upload, FileText } from "lucide-react";
// import { useAuth } from "@/context/AuthContext";

// export type ConsigneeFormData = {
//   receiverId?: string;
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
//   destinationCode?: string;
//   /** Uploaded ID / passport / document image or PDF URL */
//   documentUrl?: string;
// };

// type ConsigneeFormProps = {
//   value: ConsigneeFormData;
//   onChange: (value: ConsigneeFormData) => void;
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

// export default function ConsigneeForm({
//   value,
//   onChange,
//   disabled = false,
// }: ConsigneeFormProps) {
//   const { firebaseUser } = useAuth();
//   const [uploading, setUploading] = useState(false);
//   const [uploadError, setUploadError] = useState<string | null>(null);

//   const update = <K extends keyof ConsigneeFormData>(
//     field: K,
//     fieldValue: ConsigneeFormData[K],
//   ) => {
//     onChange({ ...value, [field]: fieldValue });
//   };

//   const input =
//     "h-9 w-full rounded border border-gray-300 bg-white px-2.5 text-sm outline-none focus:border-slate-600 disabled:bg-gray-50";
//   const label = "mb-1 block text-xs font-medium text-gray-600";

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

//     try {
//       setUploading(true);
//       setUploadError(null);

//       if (!firebaseUser) {
//         throw new Error("Sign in required to upload documents.");
//       }

//       const token = await firebaseUser.getIdToken(true);
//       const body = new FormData();
//       body.append("file", file);
//       body.append("context", "consignee-document");
//       body.append("ownerId", firebaseUser.uid);

//       const res = await fetch("/api/uploads", {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}` },
//         body,
//       });

//       const json = await res.json();
//       if (!res.ok || !json.success) {
//         throw new Error(
//           json.error?.message || "Failed to upload document.",
//         );
//       }

//       const url = String(
//         json.data?.downloadUrl || json.data?.url || "",
//       ).trim();
//       if (!url) throw new Error("Upload succeeded but no URL returned.");

//       update("documentUrl", url);
//     } catch (e) {
//       setUploadError(
//         e instanceof Error ? e.message : "Upload failed.",
//       );
//     } finally {
//       setUploading(false);
//     }
//   }

//   return (
//     <div className="space-y-3">
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
//             value={value.contactName ?? ""}
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
//           <label className={label}>Pincode *</label>
//           <input
//             value={value.pincode}
//             onChange={(e) => update("pincode", e.target.value)}
//             className={input}
//             disabled={disabled}
//             required
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
//           <label className={label}>State *</label>
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

//       {/* Document image / PDF */}
//       <div>
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
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useState } from "react";
// import { Loader2, Upload, FileText } from "lucide-react";
// import { useAuth } from "@/context/AuthContext";

// export type ConsigneeFormData = {
//   receiverId?: string;
//   /** Synced from contactName for API / masters */
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
//   iecNo?: string;
//   documentType?: string;
//   documentNo?: string;
//   /** Uploaded ID / passport / document image or PDF URL */
//   documentUrl?: string;
// };

// type ConsigneeFormProps = {
//   value: ConsigneeFormData;
//   onChange: (value: ConsigneeFormData) => void;
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

// export default function ConsigneeForm({
//   value,
//   onChange,
//   disabled = false,
// }: ConsigneeFormProps) {
//   const { firebaseUser } = useAuth();
//   const [uploading, setUploading] = useState(false);
//   const [uploadError, setUploadError] = useState<string | null>(null);

//   const update = <K extends keyof ConsigneeFormData>(
//     field: K,
//     fieldValue: ConsigneeFormData[K],
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

//     try {
//       setUploading(true);
//       setUploadError(null);

//       if (!firebaseUser) {
//         throw new Error("Sign in required to upload documents.");
//       }

//       const token = await firebaseUser.getIdToken(true);
//       const body = new FormData();
//       body.append("file", file);
//       body.append("context", "consignee-document");
//       body.append("ownerId", firebaseUser.uid);

//       const res = await fetch("/api/uploads", {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}` },
//         body,
//       });

//       const json = await res.json();
//       if (!res.ok || !json.success) {
//         throw new Error(json.error?.message || "Failed to upload document.");
//       }

//       const url = String(
//         json.data?.downloadUrl || json.data?.url || "",
//       ).trim();
//       if (!url) throw new Error("Upload succeeded but no URL returned.");

//       update("documentUrl", url);
//     } catch (e) {
//       setUploadError(e instanceof Error ? e.message : "Upload failed.");
//     } finally {
//       setUploading(false);
//     }
//   }

//   return (
//     <div className="space-y-3">
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
//           <label className={label}>Pincode *</label>
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
//           <label className={label}>State *</label>
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

//       {/* Document image / PDF — kept */}
//       <div>
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
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useState } from "react";
// import { Loader2, Upload, FileText } from "lucide-react";
// import { useAuth } from "@/context/AuthContext";

// export type ConsigneeFormData = {
//   receiverId?: string;
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
//   iecNo?: string;
//   documentType?: string;
//   documentNo?: string;
//   documentUrl?: string;
// };

// export type ConsigneeReceiverOption = {
//   id: string;
//   receiverId: string;
//   name: string;
//   companyName?: string;
//   phone?: string;
// };

// type ConsigneeFormProps = {
//   value: ConsigneeFormData;
//   onChange: (value: ConsigneeFormData) => void;
//   disabled?: boolean;
//   receivers?: ConsigneeReceiverOption[];
//   selectedReceiverId?: string;
//   onSelectReceiver?: (id: string) => void;
//   lockFieldsFromReceiver?: boolean;
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

// export default function ConsigneeForm({
//   value,
//   onChange,
//   disabled = false,
//   receivers = [],
//   selectedReceiverId = "",
//   onSelectReceiver,
//   lockFieldsFromReceiver = true,
// }: ConsigneeFormProps) {
//   const { firebaseUser } = useAuth();
//   const [uploading, setUploading] = useState(false);
//   const [uploadError, setUploadError] = useState<string | null>(null);

//   const update = <K extends keyof ConsigneeFormData>(
//     field: K,
//     fieldValue: ConsigneeFormData[K],
//   ) => {
//     onChange({ ...value, [field]: fieldValue });
//   };

//   const input =
//     "h-9 w-full rounded border border-gray-300 bg-white px-2.5 text-sm outline-none focus:border-slate-600 disabled:bg-gray-50 disabled:text-gray-600";
//   const label = "mb-1 block text-xs font-medium text-gray-600";

//   const fieldsLocked =
//     disabled || (lockFieldsFromReceiver && Boolean(selectedReceiverId));

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
//       body.append("context", "consignee-document");
//       body.append("ownerId", firebaseUser.uid);

//       const res = await fetch("/api/uploads", {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}` },
//         body,
//       });
//       const json = await res.json();
//       if (!res.ok || !json.success) {
//         throw new Error(
//           json?.error?.message || "Failed to upload document.",
//         );
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
//       <div>
//         <label className={label}>
//           Select Receiver <span className="text-red-500">*</span>
//         </label>
//         <select
//           value={selectedReceiverId}
//           onChange={(e) => onSelectReceiver?.(e.target.value)}
//           className={input}
//           disabled={disabled}
//         >
//           <option value="">— Select from Receivers master —</option>
//           {receivers.map((r) => (
//             <option key={r.id || r.receiverId} value={r.id || r.receiverId}>
//               {(r.companyName || r.name) +
//                 (r.phone ? ` · ${r.phone}` : "") +
//                 (r.name && r.companyName ? ` (${r.name})` : "")}
//             </option>
//           ))}
//         </select>
//         {receivers.length === 0 ? (
//           <p className="mt-1 text-[11px] text-amber-700">
//             No active receivers found. Add them under Masters → Receivers.
//           </p>
//         ) : (
//           <p className="mt-1 text-[11px] text-slate-400">
//             Choosing a receiver fills consignee fields automatically.
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
//         <label className={label}>
//           Address 2 <span className="font-normal text-slate-400">(optional)</span>
//         </label>
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
//           <label className={label}>
//             Telephone <span className="font-normal text-slate-400">(optional)</span>
//           </label>
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

//       <div>
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
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useState } from "react";
// import { Loader2, Upload, FileText } from "lucide-react";
// import { useAuth } from "@/context/AuthContext";

// export type ConsigneeFormData = {
//   receiverId?: string;
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
//   iecNo?: string;
//   documentType?: string;
//   documentNo?: string;
//   documentUrl?: string;
// };

// export type ConsigneeReceiverOption = {
//   id: string;
//   receiverId: string;
//   name: string;
//   companyName?: string;
//   phone?: string;
// };

// type ConsigneeFormProps = {
//   value: ConsigneeFormData;
//   onChange: (value: ConsigneeFormData) => void;
//   disabled?: boolean;
//   // receivers?: ConsigneeReceiverOption[];
//   // selectedReceiverId?: string;
//   // onSelectReceiver?: (id: string) => void;
//   // lockFieldsFromReceiver?: boolean;
//   receivers?: ConsigneeReceiverOption[];
// selectedReceiverId?: string;
// onSelectReceiver?: (id: string) => void;
// lockFieldsFromReceiver?: boolean;
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

// export default function ConsigneeForm({
//   value,
//   onChange,
//   disabled = false,
//   receivers = [],
//   selectedReceiverId = "",
//   onSelectReceiver,
//   lockFieldsFromReceiver = true,
// }: ConsigneeFormProps) {
//   const { firebaseUser } = useAuth();
//   const [uploading, setUploading] = useState(false);
//   const [uploadError, setUploadError] = useState<string | null>(null);

//   const update = <K extends keyof ConsigneeFormData>(
//     field: K,
//     fieldValue: ConsigneeFormData[K],
//   ) => {
//     onChange({ ...value, [field]: fieldValue });
//   };

//   const input =
//     "h-9 w-full rounded border border-gray-300 bg-white px-2.5 text-sm outline-none focus:border-slate-600 disabled:bg-gray-50 disabled:text-gray-600";
//   const label = "mb-1 block text-xs font-medium text-gray-600";

//   const fieldsLocked =
//     disabled || (lockFieldsFromReceiver && Boolean(selectedReceiverId));

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
//       body.append("context", "consignee-document");
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
//       <div>
//         <label className={label}>
//           Select Receiver <span className="text-red-500">*</span>
//         </label>
//         <select
//           value={selectedReceiverId}
//           onChange={(e) => onSelectReceiver?.(e.target.value)}
//           className={input}
//           disabled={disabled}
//         >
//           <option value="">— Select from Receivers master —</option>
//           {receivers.map((r) => (
//             <option key={r.id || r.receiverId} value={r.id || r.receiverId}>
//               {(r.companyName || r.name) +
//                 (r.phone ? ` · ${r.phone}` : "") +
//                 (r.name && r.companyName ? ` (${r.name})` : "")}
//             </option>
//           ))}
//         </select>
//         {receivers.length === 0 ? (
//           <p className="mt-1 text-[11px] text-amber-700">
//             No active receivers found. Add them under Masters → Receivers.
//           </p>
//         ) : (
//           <p className="mt-1 text-[11px] text-slate-400">
//             Choosing a receiver fills consignee fields automatically.
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
//         <label className={label}>
//           Address 2{" "}
//           <span className="font-normal text-slate-400">(optional)</span>
//         </label>
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
//           <label className={label}>
//             Telephone{" "}
//             <span className="font-normal text-slate-400">(optional)</span>
//           </label>
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

//       <div>
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
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useState } from "react";
// import { Loader2, Upload, FileText } from "lucide-react";
// import { useAuth } from "@/context/AuthContext";

// export type ConsigneeFormData = {
//   receiverId?: string;
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
// };

// export type ConsigneeReceiverOption = {
//   id: string;
//   receiverId: string;
//   name: string;
//   companyName?: string;
//   phone?: string;
// };

// type ConsigneeFormProps = {
//   value: ConsigneeFormData;
//   onChange: (value: ConsigneeFormData) => void;
//   disabled?: boolean;
//   receivers?: ConsigneeReceiverOption[];
//   selectedReceiverId?: string;
//   onSelectReceiver?: (id: string) => void;
//   lockFieldsFromReceiver?: boolean;
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

// export default function ConsigneeForm({
//   value,
//   onChange,
//   disabled = false,
//   receivers = [],
//   selectedReceiverId = "",
//   onSelectReceiver,
//   lockFieldsFromReceiver = true,
// }: ConsigneeFormProps) {
//   const { firebaseUser } = useAuth();
//   const [uploading, setUploading] = useState(false);
//   const [uploadError, setUploadError] = useState<string | null>(null);

//   const update = <K extends keyof ConsigneeFormData>(
//     field: K,
//     fieldValue: ConsigneeFormData[K],
//   ) => {
//     onChange({ ...value, [field]: fieldValue });
//   };

//   const input =
//     "h-9 w-full rounded border border-gray-300 bg-white px-2.5 text-sm outline-none focus:border-slate-600 disabled:bg-gray-50 disabled:text-gray-600";
//   const label = "mb-1 block text-xs font-medium text-gray-600";

//   const fieldsLocked =
//     disabled || (lockFieldsFromReceiver && Boolean(selectedReceiverId));

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
//       body.append("context", "consignee-document");
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
//       <div>
//         <label className={label}>
//           Select Receiver <span className="text-red-500">*</span>
//         </label>
//         <select
//           value={selectedReceiverId}
//           onChange={(e) => onSelectReceiver?.(e.target.value)}
//           className={input}
//           disabled={disabled}
//         >
//           <option value="">— Select from Receivers master —</option>
//           {receivers.map((r) => (
//             <option key={r.id || r.receiverId} value={r.id || r.receiverId}>
//               {(r.companyName || r.name) +
//                 (r.phone ? ` · ${r.phone}` : "") +
//                 (r.name && r.companyName ? ` (${r.name})` : "")}
//             </option>
//           ))}
//         </select>
//         {receivers.length === 0 ? (
//           <p className="mt-1 text-[11px] text-amber-700">
//             No active receivers found. Add them under Masters → Receivers.
//           </p>
//         ) : (
//           <p className="mt-1 text-[11px] text-slate-400">
//             Choosing a receiver auto-fills all fields below.
//           </p>
//         )}
//       </div>

//       <div className="grid grid-cols-2 gap-2">
//         <div>
//           <label className={label}>
//             Company Name <span className="text-red-500">*</span>
//           </label>
//           <input
//             value={value.company ?? ""}
//             onChange={(e) => update("company", e.target.value)}
//             className={input}
//             disabled={fieldsLocked}
//             readOnly={fieldsLocked}
//           />
//         </div>
//         <div>
//           <label className={label}>
//             Contact Name <span className="text-red-500">*</span>
//           </label>
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
//         <label className={label}>
//           Address 1 <span className="text-red-500">*</span>
//         </label>
//         <input
//           value={value.addressLine1}
//           onChange={(e) => update("addressLine1", e.target.value)}
//           className={input}
//           disabled={fieldsLocked}
//           readOnly={fieldsLocked}
//         />
//       </div>

//       <div>
//         <label className={label}>
//           Address 2{" "}
//           <span className="font-normal text-slate-400">(optional)</span>
//         </label>
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
//           <label className={label}>
//             City <span className="text-red-500">*</span>
//           </label>
//           <input
//             value={value.city}
//             onChange={(e) => update("city", e.target.value)}
//             className={input}
//             disabled={fieldsLocked}
//             readOnly={fieldsLocked}
//           />
//         </div>
//         <div>
//           <label className={label}>
//             Pincode <span className="text-red-500">*</span>
//           </label>
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
//           <label className={label}>
//             State <span className="text-red-500">*</span>
//           </label>
//           <input
//             value={value.state ?? ""}
//             onChange={(e) => update("state", e.target.value)}
//             className={input}
//             disabled={fieldsLocked}
//             readOnly={fieldsLocked}
//           />
//         </div>
//         <div>
//           <label className={label}>
//             Telephone{" "}
//             <span className="font-normal text-slate-400">(optional)</span>
//           </label>
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
//           <label className={label}>
//             Mobile No. <span className="text-red-500">*</span>
//           </label>
//           <input
//             value={value.mobile ?? ""}
//             onChange={(e) => update("mobile", e.target.value)}
//             className={input}
//             disabled={fieldsLocked}
//             readOnly={fieldsLocked}
//           />
//         </div>
//         <div>
//           <label className={label}>
//             E-Mail <span className="text-red-500">*</span>
//           </label>
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
//           <label className={label}>
//             Country <span className="text-red-500">*</span>
//           </label>
//           <input
//             value={value.country}
//             onChange={(e) => update("country", e.target.value)}
//             className={input}
//             disabled={fieldsLocked}
//             readOnly={fieldsLocked}
//           />
//         </div>
//         <div>
//           <label className={label}>IEC No.<span className="text-red-500">*</span></label>
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
//           <label className={label}>Document Type<span className="text-red-500">*</span></label>
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
//           <label className={label}>Document No.<span className="text-red-500">*</span></label>
//           <input
//             value={value.documentNo ?? ""}
//             onChange={(e) => update("documentNo", e.target.value)}
//             className={input}
//             disabled={fieldsLocked}
//             readOnly={fieldsLocked}
//           />
//         </div>
//       </div>

//       <div>
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
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useState } from "react";
// import { FileText } from "lucide-react";

// export type ConsigneeFormData = {
//   receiverId?: string;
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
// };

// export type ConsigneeReceiverOption = {
//   id: string;
//   receiverId: string;
//   name: string;
//   companyName?: string;
//   phone?: string;
// };

// type ConsigneeFormProps = {
//   value: ConsigneeFormData;
//   onChange: (value: ConsigneeFormData) => void;
//   disabled?: boolean;
//   receivers?: ConsigneeReceiverOption[];
//   selectedReceiverId?: string;
//   onSelectReceiver?: (id: string) => void;
//   lockFieldsFromReceiver?: boolean;
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

// export default function ConsigneeForm({
//   value,
//   onChange,
//   disabled = false,
//   receivers = [],
//   selectedReceiverId = "",
//   onSelectReceiver,
//   lockFieldsFromReceiver = true,
// }: ConsigneeFormProps) {
//   const update = <K extends keyof ConsigneeFormData>(
//     field: K,
//     fieldValue: ConsigneeFormData[K],
//   ) => {
//     onChange({ ...value, [field]: fieldValue });
//   };

//   const input =
//     "h-9 w-full rounded border border-gray-300 bg-white px-2.5 text-sm outline-none focus:border-slate-600 disabled:bg-gray-50 disabled:text-gray-600";
//   const label = "mb-1 block text-xs font-medium text-gray-600";

//   const fieldsLocked =
//     disabled || (lockFieldsFromReceiver && Boolean(selectedReceiverId));

//   return (
//     <div className="space-y-3">
//       <div>
//         <label className={label}>
//           Select Receiver <span className="text-red-500">*</span>
//         </label>
//         <select
//           value={selectedReceiverId}
//           onChange={(e) => onSelectReceiver?.(e.target.value)}
//           className={input}
//           disabled={disabled}
//         >
//           <option value="">— Select from Receivers master —</option>
//           {receivers.map((r) => (
//             <option key={r.id || r.receiverId} value={r.id || r.receiverId}>
//               {(r.companyName || r.name || "").trim()}
//             </option>
//           ))}
//         </select>
//         {receivers.length === 0 ? (
//           <p className="mt-1 text-[11px] text-amber-700">
//             No active receivers found. Add them under Masters → Receivers.
//           </p>
//         ) : (
//           <p className="mt-1 text-[11px] text-slate-400">
//             Choosing a receiver fills fields below. Upload documents under
//             Masters → Receivers.
//           </p>
//         )}
//       </div>

//       <div className="grid grid-cols-2 gap-2">
//         <div>
//           <label className={label}>
//             Company Name <span className="text-red-500">*</span>
//           </label>
//           <input
//             value={value.company ?? ""}
//             onChange={(e) => update("company", e.target.value)}
//             className={input}
//             disabled={fieldsLocked}
//             readOnly={fieldsLocked}
//           />
//         </div>
//         <div>
//           <label className={label}>
//             Contact Name <span className="text-red-500">*</span>
//           </label>
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
//         <label className={label}>
//           Address 1 <span className="text-red-500">*</span>
//         </label>
//         <input
//           value={value.addressLine1}
//           onChange={(e) => update("addressLine1", e.target.value)}
//           className={input}
//           disabled={fieldsLocked}
//           readOnly={fieldsLocked}
//         />
//       </div>

//       <div>
//         <label className={label}>
//           Address 2{" "}
//           <span className="font-normal text-slate-400">(optional)</span>
//         </label>
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
//           <label className={label}>
//             City <span className="text-red-500">*</span>
//           </label>
//           <input
//             value={value.city}
//             onChange={(e) => update("city", e.target.value)}
//             className={input}
//             disabled={fieldsLocked}
//             readOnly={fieldsLocked}
//           />
//         </div>
//         <div>
//           <label className={label}>
//             Pincode <span className="text-red-500">*</span>
//           </label>
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
//           <label className={label}>
//             State <span className="text-red-500">*</span>
//           </label>
//           <input
//             value={value.state ?? ""}
//             onChange={(e) => update("state", e.target.value)}
//             className={input}
//             disabled={fieldsLocked}
//             readOnly={fieldsLocked}
//           />
//         </div>
//         <div>
//           <label className={label}>
//             Telephone{" "}
//             <span className="font-normal text-slate-400">(optional)</span>
//           </label>
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
//           <label className={label}>
//             Mobile No. <span className="text-red-500">*</span>
//           </label>
//           <input
//             value={value.mobile ?? ""}
//             onChange={(e) => update("mobile", e.target.value)}
//             className={input}
//             disabled={fieldsLocked}
//             readOnly={fieldsLocked}
//           />
//         </div>
//         <div>
//           <label className={label}>
//             E-Mail <span className="text-red-500">*</span>
//           </label>
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
//           <label className={label}>
//             Country <span className="text-red-500">*</span>
//           </label>
//           <input
//             value={value.country}
//             onChange={(e) => update("country", e.target.value)}
//             className={input}
//             disabled={fieldsLocked}
//             readOnly={fieldsLocked}
//           />
//         </div>
//         <div>
//           <label className={label}>
//             IEC No. <span className="text-red-500">*</span>
//           </label>
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
//           <label className={label}>
//             Document Type <span className="text-red-500">*</span>
//           </label>
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
//           <label className={label}>
//             Document No. <span className="text-red-500">*</span>
//           </label>
//           <input
//             value={value.documentNo ?? ""}
//             onChange={(e) => update("documentNo", e.target.value)}
//             className={input}
//             disabled={fieldsLocked}
//             readOnly={fieldsLocked}
//           />
//         </div>
//       </div>

//       {/* Same as Shipper: preview only — upload on Masters → Receivers */}
//       <div>
//         <label className={label}>Document file</label>
//         {value.documentUrl ? (
//           <DocumentPreview url={value.documentUrl} />
//         ) : (
//           <p className="text-xs text-slate-400">
//             No document. Upload under Masters → Receivers, then select
//             receiver.
//           </p>
//         )}
//       </div>
//     </div>
//   );
// }

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

"use client";

import { useState } from "react";
import { Loader2, Upload, FileText } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export type ConsigneeFormData = {
  receiverId?: string;
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
};

export type ConsigneeReceiverOption = {
  id: string;
  receiverId: string;
  name: string;
  companyName?: string;
  phone?: string;
};

type ConsigneeFormProps = {
  value: ConsigneeFormData;
  onChange: (value: ConsigneeFormData) => void;
  disabled?: boolean;
  receivers?: ConsigneeReceiverOption[];
  selectedReceiverId?: string;
  onSelectReceiver?: (id: string) => void;
  lockFieldsFromReceiver?: boolean;
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

export default function ConsigneeForm({
  value,
  onChange,
  disabled = false,
  receivers = [],
  selectedReceiverId = "",
  onSelectReceiver,
  lockFieldsFromReceiver = true,
}: ConsigneeFormProps) {
  const { firebaseUser } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const update = <K extends keyof ConsigneeFormData>(
    field: K,
    fieldValue: ConsigneeFormData[K],
  ) => {
    if (selectedReceiverId && onSelectReceiver) {
      onSelectReceiver("");
    }
    onChange({
      ...value,
      [field]: fieldValue,
      receiverId: undefined,
    });
  };

  const input =
    "h-9 w-full rounded border border-gray-300 bg-white px-2.5 text-sm outline-none focus:border-slate-600 disabled:bg-gray-50 disabled:text-gray-600";
  const label = "mb-1 block text-xs font-medium text-gray-600";

  const fieldsLocked = Boolean(
    lockFieldsFromReceiver && selectedReceiverId && !disabled,
  );
  const canEditFields = !disabled && !fieldsLocked;

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
      body.append("context", "consignee-document");
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
        receiverId: undefined,
      });
      if (selectedReceiverId && onSelectReceiver) onSelectReceiver("");
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
      <div>
        <label className={label}>Select Receiver (optional)</label>
        <select
          value={selectedReceiverId}
          onChange={(e) => onSelectReceiver?.(e.target.value)}
          className={input}
          disabled={disabled}
        >
          <option value="">— Enter manually / clear selection —</option>
          {receivers.map((r) => (
            <option key={r.id || r.receiverId} value={r.id || r.receiverId}>
              {(r.companyName || r.name || "").trim()}
            </option>
          ))}
        </select>
        {receivers.length === 0 ? (
          <p className="mt-1 text-[11px] text-amber-700">
            No active receivers. Add under Masters → Receivers, or type below.
          </p>
        ) : (
          <p className="mt-1 text-[11px] text-slate-400">
            Pick a receiver to auto-fill, or leave empty and type details. New
            manual entries are saved under Masters → Receivers when the AWB is
            created.
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className={label}>
            Company Name
          </label>
          <input
            value={value.company ?? ""}
            onChange={(e) => update("company", e.target.value)}
            className={input}
            disabled={!canEditFields}
          />
        </div>
        <div>
          <label className={label}>
            Name <span className="text-red-500">*</span>
          </label>
          <input
            value={value.contactName ?? value.name ?? ""}
            onChange={(e) => {
              if (selectedReceiverId && onSelectReceiver) {
                onSelectReceiver("");
              }
              onChange({
                ...value,
                contactName: e.target.value,
                name: e.target.value,
                receiverId: undefined,
              });
            }}
            className={input}
            disabled={!canEditFields}
            required
          />
        </div>
      </div>

      <div>
        <label className={label}>
          Address 1 <span className="text-red-500">*</span>
        </label>
        <input
          value={value.addressLine1}
          onChange={(e) => update("addressLine1", e.target.value)}
          className={input}
          disabled={!canEditFields}
          required
        />
      </div>

      <div>
        <label className={label}>
          Address 2{" "}
          <span className="font-normal text-slate-400">(optional)</span>
        </label>
        <input
          value={value.addressLine2 ?? ""}
          onChange={(e) => update("addressLine2", e.target.value)}
          className={input}
          disabled={!canEditFields}
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className={label}>
            City <span className="text-red-500">*</span>
          </label>
          <input
            value={value.city}
            onChange={(e) => update("city", e.target.value)}
            className={input}
            disabled={!canEditFields}
            required
          />
        </div>
        <div>
          <label className={label}>
            Pincode <span className="text-red-500">*</span>
          </label>
          <input
            value={value.pincode}
            onChange={(e) => update("pincode", e.target.value)}
            className={input}
            disabled={!canEditFields}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className={label}>
            State <span className="text-red-500">*</span>
          </label>
          <input
            value={value.state ?? ""}
            onChange={(e) => update("state", e.target.value)}
            className={input}
            disabled={!canEditFields}
            required
          />
        </div>
        <div>
          <label className={label}>
            Telephone{" "}
            <span className="font-normal text-slate-400">(optional)</span>
          </label>
          <input
            value={value.phone}
            onChange={(e) => update("phone", e.target.value)}
            className={input}
            disabled={!canEditFields}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className={label}>
            Mobile No. <span className="text-red-500">*</span>
          </label>
          <input
            value={value.mobile ?? ""}
            onChange={(e) => update("mobile", e.target.value)}
            className={input}
            disabled={!canEditFields}
            required
          />
        </div>
        <div>
          <label className={label}>
            E-Mail
          </label>
          <input
            type="email"
            value={value.email ?? ""}
            onChange={(e) => update("email", e.target.value)}
            className={input}
            disabled={!canEditFields}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className={label}>
            Country <span className="text-red-500">*</span>
          </label>
          <input
            value={value.country}
            onChange={(e) => update("country", e.target.value)}
            className={input}
            disabled={!canEditFields}
            required
          />
        </div>
        <div>
          <label className={label}>IEC No.</label>
          <input
            value={value.iecNo ?? ""}
            onChange={(e) => update("iecNo", e.target.value)}
            className={input}
            disabled={!canEditFields}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className={label}>Document Type</label>
          <select
            value={value.documentType ?? ""}
            onChange={(e) => update("documentType", e.target.value)}
            className={input}
            disabled={!canEditFields}
          >
            {DOCUMENT_TYPES.map((t) => (
              <option key={t.value || "select"} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={label}>Document No.</label>
          <input
            value={value.documentNo ?? ""}
            onChange={(e) => update("documentNo", e.target.value)}
            className={input}
            disabled={!canEditFields}
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
              No document on this receiver. Upload under Masters → Receivers.
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