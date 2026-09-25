// "use client";

// import { Plus, Trash2, Fuel } from "lucide-react";

// export type ChargeLine = {
//   id: string;
//   description: string;
//   rate?: number;
//   amount: number;
//   fuelApply?: boolean;
//   fuelAmt?: number;
//   taxApply?: boolean;
//   taxOnFuel?: number;
//   igst?: number;
//   sgst?: number;
//   cgst?: number;
//   total?: number;
// };

// /** Optional Super-Admin fuel vendor rows (DHL, FedEx, etc.) */
// export type FuelVendorRow = {
//   id: string;
//   name: string;
//   amount: number;
// };

// export type ChargeDetailsData = {
//   freight: number;
//   fuelSurcharge: number;
//   contractCharges: number;
//   otherCharges: number;
//   additionalCharges: ChargeLine[];
//   discount: number;
//   surcharge: number;
//   cgst: number;
//   sgst: number;
//   igst: number;
//   /** Super Admin managed vendor fuel rows (optional) */
//   fuelVendors?: FuelVendorRow[];
// };

// type ChargeDetailsProps = {
//   value: ChargeDetailsData;
//   onChange: (value: ChargeDetailsData) => void;
//   disabled?: boolean;
//   /** Super Admin only — edit fuel surcharge & vendor rows */
//   canManageFuel?: boolean;
// };

// export default function ChargeDetails({
//   value,
//   onChange,
//   disabled = false,
//   canManageFuel = false,
// }: ChargeDetailsProps) {
//   const fuelLocked = disabled || !canManageFuel;

//   const update = <K extends keyof ChargeDetailsData>(
//     field: K,
//     fieldValue: ChargeDetailsData[K],
//   ) => {
//     onChange({
//       ...value,
//       [field]: fieldValue,
//     });
//   };

//   const addCharge = () => {
//     update("additionalCharges", [
//       ...value.additionalCharges,
//       {
//         id: crypto.randomUUID(),
//         description: "",
//         rate: 0,
//         amount: 0,
//         fuelApply: false,
//         fuelAmt: 0,
//         taxApply: false,
//         taxOnFuel: 0,
//         igst: 0,
//         sgst: 0,
//         cgst: 0,
//         total: 0,
//       },
//     ]);
//   };

//   const updateCharge = (
//     id: string,
//     field: keyof ChargeLine,
//     fieldValue: string | number | boolean,
//   ) => {
//     update(
//       "additionalCharges",
//       value.additionalCharges.map((charge) => {
//         if (charge.id !== id) return charge;

//         const next: ChargeLine = {
//           ...charge,
//           [field]: fieldValue,
//         };

//         const amount = Number(next.amount || 0);
//         const fuel = next.fuelApply ? Number(next.fuelAmt || 0) : 0;
//         const taxOnFuel = next.taxApply ? Number(next.taxOnFuel || 0) : 0;
//         const igst = Number(next.igst || 0);
//         const sgst = Number(next.sgst || 0);
//         const cgst = Number(next.cgst || 0);

//         next.total = Number(
//           (amount + fuel + taxOnFuel + igst + sgst + cgst).toFixed(2),
//         );

//         return next;
//       }),
//     );
//   };

//   const removeCharge = (id: string) => {
//     update(
//       "additionalCharges",
//       value.additionalCharges.filter((c) => c.id !== id),
//     );
//   };

//   /* ---------- Super Admin fuel vendor rows ---------- */
//   const fuelVendors = value.fuelVendors ?? [];

//   const addFuelVendor = () => {
//     if (!canManageFuel) return;
//     const next = [
//       ...fuelVendors,
//       {
//         id: crypto.randomUUID(),
//         name: "",
//         amount: 0,
//       },
//     ];
//     const fuelTotal = next.reduce((s, r) => s + Number(r.amount || 0), 0);
//     onChange({
//       ...value,
//       fuelVendors: next,
//       fuelSurcharge: Number(fuelTotal.toFixed(2)),
//     });
//   };

//   const updateFuelVendor = (
//     id: string,
//     field: "name" | "amount",
//     fieldValue: string | number,
//   ) => {
//     if (!canManageFuel) return;
//     const next = fuelVendors.map((row) =>
//       row.id === id ? { ...row, [field]: fieldValue } : row,
//     );
//     const fuelTotal = next.reduce((s, r) => s + Number(r.amount || 0), 0);
//     onChange({
//       ...value,
//       fuelVendors: next,
//       fuelSurcharge: Number(fuelTotal.toFixed(2)),
//     });
//   };

//   const removeFuelVendor = (id: string) => {
//     if (!canManageFuel) return;
//     const next = fuelVendors.filter((r) => r.id !== id);
//     const fuelTotal = next.reduce((s, r) => s + Number(r.amount || 0), 0);
//     onChange({
//       ...value,
//       fuelVendors: next,
//       fuelSurcharge: Number(fuelTotal.toFixed(2)),
//     });
//   };

//   // Totals
//   const additionalTotal = value.additionalCharges.reduce(
//     (sum, c) => sum + Number(c.total ?? c.amount ?? 0),
//     0,
//   );

//   const taxTotal =
//     Number(value.cgst || 0) +
//     Number(value.sgst || 0) +
//     Number(value.igst || 0);

//   const grandTotal =
//     Number(value.freight || 0) +
//     Number(value.fuelSurcharge || 0) +
//     Number(value.contractCharges || 0) +
//     Number(value.otherCharges || 0) +
//     Number(value.surcharge || 0) +
//     additionalTotal +
//     taxTotal -
//     Number(value.discount || 0);

//   const input =
//     "h-9 w-full rounded border border-gray-300 bg-white px-2.5 text-sm outline-none focus:border-slate-600 disabled:bg-gray-50 disabled:text-gray-500";
//   const label = "mb-1 block text-xs font-medium text-gray-600";

//   return (
//     <section className="rounded-xl border bg-white shadow-sm">
//       <div className="border-b bg-slate-50 px-5 py-3">
//         <div className="flex items-center justify-between gap-2">
//           <div>
//             <h2 className="text-sm font-semibold text-slate-800">
//               Charge Details
//             </h2>
//             <p className="mt-0.5 text-xs text-gray-500">
//               Freight, fuel surcharge, contract/other charges and tax split.
//             </p>
//           </div>
//           {canManageFuel ? (
//             <span className="inline-flex items-center gap-1 rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-800">
//               <Fuel className="h-3 w-3" />
//               Fuel editable
//             </span>
//           ) : (
//             <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-600">
//               Fuel view only
//             </span>
//           )}
//         </div>
//       </div>

//       <div className="space-y-5 p-5">
//         {/* Super Admin: dynamic fuel vendor rows */}
//         {canManageFuel && (
//           <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-4">
//             <div className="mb-3 flex items-center justify-between">
//               <h3 className="text-sm font-semibold text-amber-900">
//                 Fuel Surcharge Vendors
//               </h3>
//               <button
//                 type="button"
//                 onClick={addFuelVendor}
//                 disabled={disabled}
//                 className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-medium text-amber-900 hover:bg-amber-50 disabled:opacity-50"
//               >
//                 <Plus className="h-3.5 w-3.5" />
//                 Add Fuel Surcharge
//               </button>
//             </div>

//             {fuelVendors.length === 0 ? (
//               <p className="text-xs text-amber-800/80">
//                 No vendor rows yet. Click &quot;Add Fuel Surcharge&quot; to add
//                 DHL / FedEx / etc. Totals auto-fill Fuel Surcharge below.
//               </p>
//             ) : (
//               <div className="space-y-2">
//                 {fuelVendors.map((row) => (
//                   <div
//                     key={row.id}
//                     className="flex flex-wrap items-center gap-2"
//                   >
//                     <input
//                       value={row.name}
//                       onChange={(e) =>
//                         updateFuelVendor(row.id, "name", e.target.value)
//                       }
//                       placeholder="Vendor (e.g. DHL, FedEx)"
//                       className={`${input} max-w-[220px]`}
//                       disabled={disabled}
//                     />
//                     <input
//                       type="number"
//                       min={0}
//                       step="0.01"
//                       value={row.amount}
//                       onChange={(e) =>
//                         updateFuelVendor(
//                           row.id,
//                           "amount",
//                           Number(e.target.value) || 0,
//                         )
//                       }
//                       placeholder="Amount"
//                       className={`${input} w-32`}
//                       disabled={disabled}
//                     />
//                     <button
//                       type="button"
//                       onClick={() => removeFuelVendor(row.id)}
//                       disabled={disabled}
//                       className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
//                       title="Remove"
//                     >
//                       <Trash2 className="h-4 w-4" />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}

//         {/* Top summary row */}
//         <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
//           <div>
//             <label className={label}>Contract Charges</label>
//             <input
//               type="number"
//               min={0}
//               step="0.01"
//               value={value.contractCharges}
//               onChange={(e) =>
//                 update("contractCharges", Number(e.target.value) || 0)
//               }
//               className={input}
//               disabled={disabled}
//             />
//           </div>

//           <div>
//             <label className={label}>Other Charges</label>
//             <input
//               type="number"
//               min={0}
//               step="0.01"
//               value={value.otherCharges}
//               onChange={(e) =>
//                 update("otherCharges", Number(e.target.value) || 0)
//               }
//               className={input}
//               disabled={disabled}
//             />
//           </div>

//           <div>
//             <label className={label}>Freight</label>
//             <input
//               type="number"
//               min={0}
//               step="0.01"
//               value={value.freight}
//               onChange={(e) =>
//                 update("freight", Number(e.target.value) || 0)
//               }
//               className={input}
//               disabled={disabled}
//             />
//           </div>

//           <div>
//             <label className={label}>
//               Fuel Surcharge
//               {fuelLocked && (
//                 <span className="ml-1 text-[10px] font-normal text-slate-400">
//                   (locked)
//                 </span>
//               )}
//             </label>
//             <input
//               type="number"
//               min={0}
//               step="0.01"
//               value={value.fuelSurcharge}
//               onChange={(e) =>
//                 update("fuelSurcharge", Number(e.target.value) || 0)
//               }
//               className={input}
//               disabled={fuelLocked}
//               title={
//                 fuelLocked
//                   ? "Only Super Admin can edit fuel surcharge"
//                   : undefined
//               }
//             />
//           </div>

//           <div>
//             <label className={label}>Surcharge</label>
//             <input
//               type="number"
//               min={0}
//               step="0.01"
//               value={value.surcharge}
//               onChange={(e) =>
//                 update("surcharge", Number(e.target.value) || 0)
//               }
//               className={input}
//               disabled={disabled}
//             />
//           </div>

//           <div>
//             <label className={label}>IGST</label>
//             <input
//               type="number"
//               min={0}
//               step="0.01"
//               value={value.igst}
//               onChange={(e) =>
//                 update("igst", Number(e.target.value) || 0)
//               }
//               className={input}
//               disabled={disabled}
//             />
//           </div>

//           <div>
//             <label className={label}>CGST</label>
//             <input
//               type="number"
//               min={0}
//               step="0.01"
//               value={value.cgst}
//               onChange={(e) =>
//                 update("cgst", Number(e.target.value) || 0)
//               }
//               className={input}
//               disabled={disabled}
//             />
//           </div>

//           <div>
//             <label className={label}>SGST</label>
//             <input
//               type="number"
//               min={0}
//               step="0.01"
//               value={value.sgst}
//               onChange={(e) =>
//                 update("sgst", Number(e.target.value) || 0)
//               }
//               className={input}
//               disabled={disabled}
//             />
//           </div>
//         </div>

//         {/* Discount */}
//         <div className="max-w-xs">
//           <label className={label}>Discount</label>
//           <input
//             type="number"
//             min={0}
//             step="0.01"
//             value={value.discount}
//             onChange={(e) =>
//               update("discount", Number(e.target.value) || 0)
//             }
//             className={input}
//             disabled={disabled}
//           />
//         </div>

//         {/* Additional charge lines */}
//         <div>
//           <div className="mb-3 flex items-center justify-between">
//             <h3 className="text-sm font-semibold text-gray-800">
//               Additional Charge Lines
//             </h3>
//             <button
//               type="button"
//               onClick={addCharge}
//               disabled={disabled}
//               className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-gray-50 disabled:opacity-50"
//             >
//               <Plus className="h-3.5 w-3.5" />
//               Add Line
//             </button>
//           </div>

//           {value.additionalCharges.length === 0 ? (
//             <p className="rounded-lg border border-dashed p-4 text-center text-xs text-gray-500">
//               No additional charge lines.
//             </p>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full min-w-[900px] border-collapse text-sm">
//                 <thead>
//                   <tr className="bg-slate-900 text-left text-xs font-semibold uppercase tracking-wide text-white">
//                     <th className="px-3 py-2">Description</th>
//                     <th className="px-3 py-2">Amount</th>
//                     <th className="px-3 py-2">Fuel Apply</th>
//                     <th className="px-3 py-2">Fuel Amt</th>
//                     <th className="px-3 py-2">Tax Apply</th>
//                     <th className="px-3 py-2">Tax on Fuel</th>
//                     <th className="px-3 py-2">IGST</th>
//                     <th className="px-3 py-2">SGST</th>
//                     <th className="px-3 py-2">CGST</th>
//                     <th className="px-3 py-2">Total</th>
//                     <th className="px-3 py-2 w-10" />
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {value.additionalCharges.map((charge) => (
//                     <tr
//                       key={charge.id}
//                       className="border-b border-gray-100 odd:bg-gray-50/50"
//                     >
//                       <td className="px-2 py-1.5">
//                         <input
//                           value={charge.description}
//                           onChange={(e) =>
//                             updateCharge(
//                               charge.id,
//                               "description",
//                               e.target.value,
//                             )
//                           }
//                           placeholder="Description"
//                           className={input}
//                           disabled={disabled}
//                         />
//                       </td>
//                       <td className="px-2 py-1.5">
//                         <input
//                           type="number"
//                           min={0}
//                           step="0.01"
//                           value={charge.amount}
//                           onChange={(e) =>
//                             updateCharge(
//                               charge.id,
//                               "amount",
//                               Number(e.target.value) || 0,
//                             )
//                           }
//                           className={`${input} w-24`}
//                           disabled={disabled}
//                         />
//                       </td>
//                       <td className="px-2 py-1.5 text-center">
//                         <input
//                           type="checkbox"
//                           checked={!!charge.fuelApply}
//                           onChange={(e) =>
//                             updateCharge(
//                               charge.id,
//                               "fuelApply",
//                               e.target.checked,
//                             )
//                           }
//                           disabled={disabled}
//                         />
//                       </td>
//                       <td className="px-2 py-1.5">
//                         <input
//                           type="number"
//                           min={0}
//                           step="0.01"
//                           value={charge.fuelAmt ?? 0}
//                           onChange={(e) =>
//                             updateCharge(
//                               charge.id,
//                               "fuelAmt",
//                               Number(e.target.value) || 0,
//                             )
//                           }
//                           className={`${input} w-20`}
//                           disabled={disabled || !charge.fuelApply}
//                         />
//                       </td>
//                       <td className="px-2 py-1.5 text-center">
//                         <input
//                           type="checkbox"
//                           checked={!!charge.taxApply}
//                           onChange={(e) =>
//                             updateCharge(
//                               charge.id,
//                               "taxApply",
//                               e.target.checked,
//                             )
//                           }
//                           disabled={disabled}
//                         />
//                       </td>
//                       <td className="px-2 py-1.5">
//                         <input
//                           type="number"
//                           min={0}
//                           step="0.01"
//                           value={charge.taxOnFuel ?? 0}
//                           onChange={(e) =>
//                             updateCharge(
//                               charge.id,
//                               "taxOnFuel",
//                               Number(e.target.value) || 0,
//                             )
//                           }
//                           className={`${input} w-20`}
//                           disabled={disabled || !charge.taxApply}
//                         />
//                       </td>
//                       <td className="px-2 py-1.5">
//                         <input
//                           type="number"
//                           min={0}
//                           step="0.01"
//                           value={charge.igst ?? 0}
//                           onChange={(e) =>
//                             updateCharge(
//                               charge.id,
//                               "igst",
//                               Number(e.target.value) || 0,
//                             )
//                           }
//                           className={`${input} w-20`}
//                           disabled={disabled}
//                         />
//                       </td>
//                       <td className="px-2 py-1.5">
//                         <input
//                           type="number"
//                           min={0}
//                           step="0.01"
//                           value={charge.sgst ?? 0}
//                           onChange={(e) =>
//                             updateCharge(
//                               charge.id,
//                               "sgst",
//                               Number(e.target.value) || 0,
//                             )
//                           }
//                           className={`${input} w-20`}
//                           disabled={disabled}
//                         />
//                       </td>
//                       <td className="px-2 py-1.5">
//                         <input
//                           type="number"
//                           min={0}
//                           step="0.01"
//                           value={charge.cgst ?? 0}
//                           onChange={(e) =>
//                             updateCharge(
//                               charge.id,
//                               "cgst",
//                               Number(e.target.value) || 0,
//                             )
//                           }
//                           className={`${input} w-20`}
//                           disabled={disabled}
//                         />
//                       </td>
//                       <td className="px-2 py-1.5">
//                         <input
//                           type="number"
//                           value={charge.total ?? 0}
//                           readOnly
//                           className={`${input} w-24 bg-gray-50 font-medium`}
//                         />
//                       </td>
//                       <td className="px-2 py-1.5 text-center">
//                         <button
//                           type="button"
//                           onClick={() => removeCharge(charge.id)}
//                           disabled={disabled}
//                           className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
//                         >
//                           <Trash2 className="h-4 w-4" />
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>

//         {/* Grand total */}
//         <div className="rounded-xl bg-slate-900 px-5 py-4 text-white">
//           <div className="flex flex-wrap items-center justify-between gap-3">
//             <div className="text-sm text-slate-300">
//               Freight + Fuel + Contract + Other + Surcharge + Lines + Tax −
//               Discount
//             </div>
//             <div className="text-2xl font-bold">
//               ₹{grandTotal.toFixed(2)}
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// "use client";

// import { Plus, Trash2, Fuel } from "lucide-react";

// export type ChargeLine = {
//   id: string;
//   description: string;
//   rate?: number;
//   amount: number;
//   fuelApply?: boolean;
//   fuelAmt?: number;
//   taxApply?: boolean;
//   taxOnFuel?: number;
//   igst?: number;
//   sgst?: number;
//   cgst?: number;
//   total?: number;
// };

// export type FuelVendorRow = {
//   id: string;
//   name: string;
//   amount: number;
// };

// export type ChargeDetailsData = {
//   freight: number;
//   fuelSurcharge: number;
//   contractCharges: number;
//   otherCharges: number;
//   additionalCharges: ChargeLine[];
//   discount: number;
//   surcharge: number;
//   cgst: number;
//   sgst: number;
//   igst: number;
//   fuelVendors?: FuelVendorRow[];
// };

// type ChargeDetailsProps = {
//   value: ChargeDetailsData;
//   onChange: (value: ChargeDetailsData) => void;
//   disabled?: boolean;
//   /** Super Admin only — entire section hidden for agents */
//   canManageCharges?: boolean;
// };

// export default function ChargeDetails({
//   value,
//   onChange,
//   disabled = false,
//   canManageCharges = false,
// }: ChargeDetailsProps) {
//   // Agents must not see charge details
//   if (!canManageCharges) {
//     return null;
//   }

//   const update = <K extends keyof ChargeDetailsData>(
//     field: K,
//     fieldValue: ChargeDetailsData[K],
//   ) => {
//     onChange({
//       ...value,
//       [field]: fieldValue,
//     });
//   };

//   const addCharge = () => {
//     update("additionalCharges", [
//       ...value.additionalCharges,
//       {
//         id: crypto.randomUUID(),
//         description: "",
//         rate: 0,
//         amount: 0,
//         fuelApply: false,
//         fuelAmt: 0,
//         taxApply: false,
//         taxOnFuel: 0,
//         igst: 0,
//         sgst: 0,
//         cgst: 0,
//         total: 0,
//       },
//     ]);
//   };

//   const updateCharge = (
//     id: string,
//     field: keyof ChargeLine,
//     fieldValue: string | number | boolean,
//   ) => {
//     update(
//       "additionalCharges",
//       value.additionalCharges.map((charge) => {
//         if (charge.id !== id) return charge;

//         const next: ChargeLine = {
//           ...charge,
//           [field]: fieldValue,
//         };

//         const amount = Number(next.amount || 0);
//         const fuel = next.fuelApply ? Number(next.fuelAmt || 0) : 0;
//         const taxOnFuel = next.taxApply ? Number(next.taxOnFuel || 0) : 0;
//         const igst = Number(next.igst || 0);
//         const sgst = Number(next.sgst || 0);
//         const cgst = Number(next.cgst || 0);

//         next.total = Number(
//           (amount + fuel + taxOnFuel + igst + sgst + cgst).toFixed(2),
//         );

//         return next;
//       }),
//     );
//   };

//   const removeCharge = (id: string) => {
//     update(
//       "additionalCharges",
//       value.additionalCharges.filter((c) => c.id !== id),
//     );
//   };

//   const fuelVendors = value.fuelVendors ?? [];

//   const addFuelVendor = () => {
//     const next = [
//       ...fuelVendors,
//       { id: crypto.randomUUID(), name: "", amount: 0 },
//     ];
//     const fuelTotal = next.reduce((s, r) => s + Number(r.amount || 0), 0);
//     onChange({
//       ...value,
//       fuelVendors: next,
//       fuelSurcharge: Number(fuelTotal.toFixed(2)),
//     });
//   };

//   const updateFuelVendor = (
//     id: string,
//     field: "name" | "amount",
//     fieldValue: string | number,
//   ) => {
//     const next = fuelVendors.map((row) =>
//       row.id === id ? { ...row, [field]: fieldValue } : row,
//     );
//     const fuelTotal = next.reduce((s, r) => s + Number(r.amount || 0), 0);
//     onChange({
//       ...value,
//       fuelVendors: next,
//       fuelSurcharge: Number(fuelTotal.toFixed(2)),
//     });
//   };

//   const removeFuelVendor = (id: string) => {
//     const next = fuelVendors.filter((r) => r.id !== id);
//     const fuelTotal = next.reduce((s, r) => s + Number(r.amount || 0), 0);
//     onChange({
//       ...value,
//       fuelVendors: next,
//       fuelSurcharge: Number(fuelTotal.toFixed(2)),
//     });
//   };

//   const additionalTotal = value.additionalCharges.reduce(
//     (sum, c) => sum + Number(c.total ?? c.amount ?? 0),
//     0,
//   );

//   const taxTotal =
//     Number(value.cgst || 0) +
//     Number(value.sgst || 0) +
//     Number(value.igst || 0);

//   const grandTotal =
//     Number(value.freight || 0) +
//     Number(value.fuelSurcharge || 0) +
//     Number(value.contractCharges || 0) +
//     Number(value.otherCharges || 0) +
//     Number(value.surcharge || 0) +
//     additionalTotal +
//     taxTotal -
//     Number(value.discount || 0);

//   const input =
//     "h-9 w-full rounded border border-gray-300 bg-white px-2.5 text-sm outline-none focus:border-slate-600 disabled:bg-gray-50 disabled:text-gray-500";
//   const label = "mb-1 block text-xs font-medium text-gray-600";

//   return (
//     <section className="rounded-xl border bg-white shadow-sm">
//       <div className="border-b bg-slate-50 px-5 py-3">
//         <div className="flex items-center justify-between gap-2">
//           <div>
//             <h2 className="text-sm font-semibold text-slate-800">
//               Charge Details
//             </h2>
//             <p className="mt-0.5 text-xs text-gray-500">
//               Super Admin only — not visible to agents.
//             </p>
//           </div>
//           <span className="inline-flex items-center gap-1 rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-800">
//             <Fuel className="h-3 w-3" />
//             Super Admin
//           </span>
//         </div>
//       </div>

//       <div className="space-y-5 p-5">
//         <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-4">
//           <div className="mb-3 flex items-center justify-between">
//             <h3 className="text-sm font-semibold text-amber-900">
//               Fuel Surcharge Vendors
//             </h3>
//             <button
//               type="button"
//               onClick={addFuelVendor}
//               disabled={disabled}
//               className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-medium text-amber-900 hover:bg-amber-50 disabled:opacity-50"
//             >
//               <Plus className="h-3.5 w-3.5" />
//               Add Fuel Surcharge
//             </button>
//           </div>

//           {fuelVendors.length === 0 ? (
//             <p className="text-xs text-amber-800/80">
//               No vendor rows yet. Add DHL / FedEx / etc. Totals fill Fuel
//               Surcharge below.
//             </p>
//           ) : (
//             <div className="space-y-2">
//               {fuelVendors.map((row) => (
//                 <div
//                   key={row.id}
//                   className="flex flex-wrap items-center gap-2"
//                 >
//                   <input
//                     value={row.name}
//                     onChange={(e) =>
//                       updateFuelVendor(row.id, "name", e.target.value)
//                     }
//                     placeholder="Vendor (e.g. DHL, FedEx)"
//                     className={`${input} max-w-[220px]`}
//                     disabled={disabled}
//                   />
//                   <input
//                     type="number"
//                     min={0}
//                     step="0.01"
//                     value={row.amount}
//                     onChange={(e) =>
//                       updateFuelVendor(
//                         row.id,
//                         "amount",
//                         Number(e.target.value) || 0,
//                       )
//                     }
//                     placeholder="Amount"
//                     className={`${input} w-32`}
//                     disabled={disabled}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => removeFuelVendor(row.id)}
//                     disabled={disabled}
//                     className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
//                   >
//                     <Trash2 className="h-4 w-4" />
//                   </button>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
//           <div>
//             <label className={label}>Contract Charges</label>
//             <input
//               type="number"
//               min={0}
//               step="0.01"
//               value={value.contractCharges}
//               onChange={(e) =>
//                 update("contractCharges", Number(e.target.value) || 0)
//               }
//               className={input}
//               disabled={disabled}
//             />
//           </div>

//           <div>
//             <label className={label}>Other Charges</label>
//             <input
//               type="number"
//               min={0}
//               step="0.01"
//               value={value.otherCharges}
//               onChange={(e) =>
//                 update("otherCharges", Number(e.target.value) || 0)
//               }
//               className={input}
//               disabled={disabled}
//             />
//           </div>

//           <div>
//             <label className={label}>Freight</label>
//             <input
//               type="number"
//               min={0}
//               step="0.01"
//               value={value.freight}
//               onChange={(e) =>
//                 update("freight", Number(e.target.value) || 0)
//               }
//               className={input}
//               disabled={disabled}
//             />
//           </div>

//           <div>
//             <label className={label}>Fuel Surcharge</label>
//             <input
//               type="number"
//               min={0}
//               step="0.01"
//               value={value.fuelSurcharge}
//               onChange={(e) =>
//                 update("fuelSurcharge", Number(e.target.value) || 0)
//               }
//               className={input}
//               disabled={disabled}
//             />
//           </div>

//           <div>
//             <label className={label}>Surcharge</label>
//             <input
//               type="number"
//               min={0}
//               step="0.01"
//               value={value.surcharge}
//               onChange={(e) =>
//                 update("surcharge", Number(e.target.value) || 0)
//               }
//               className={input}
//               disabled={disabled}
//             />
//           </div>

//           <div>
//             <label className={label}>IGST</label>
//             <input
//               type="number"
//               min={0}
//               step="0.01"
//               value={value.igst}
//               onChange={(e) => update("igst", Number(e.target.value) || 0)}
//               className={input}
//               disabled={disabled}
//             />
//           </div>

//           <div>
//             <label className={label}>CGST</label>
//             <input
//               type="number"
//               min={0}
//               step="0.01"
//               value={value.cgst}
//               onChange={(e) => update("cgst", Number(e.target.value) || 0)}
//               className={input}
//               disabled={disabled}
//             />
//           </div>

//           <div>
//             <label className={label}>SGST</label>
//             <input
//               type="number"
//               min={0}
//               step="0.01"
//               value={value.sgst}
//               onChange={(e) => update("sgst", Number(e.target.value) || 0)}
//               className={input}
//               disabled={disabled}
//             />
//           </div>
//         </div>

//         <div className="max-w-xs">
//           <label className={label}>Discount</label>
//           <input
//             type="number"
//             min={0}
//             step="0.01"
//             value={value.discount}
//             onChange={(e) =>
//               update("discount", Number(e.target.value) || 0)
//             }
//             className={input}
//             disabled={disabled}
//           />
//         </div>

//         <div>
//           <div className="mb-3 flex items-center justify-between">
//             <h3 className="text-sm font-semibold text-gray-800">
//               Additional Charge Lines
//             </h3>
//             <button
//               type="button"
//               onClick={addCharge}
//               disabled={disabled}
//               className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-gray-50 disabled:opacity-50"
//             >
//               <Plus className="h-3.5 w-3.5" />
//               Add Line
//             </button>
//           </div>

//           {value.additionalCharges.length === 0 ? (
//             <p className="rounded-lg border border-dashed p-4 text-center text-xs text-gray-500">
//               No additional charge lines.
//             </p>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full min-w-[900px] border-collapse text-sm">
//                 <thead>
//                   <tr className="bg-slate-900 text-left text-xs font-semibold uppercase tracking-wide text-white">
//                     <th className="px-3 py-2">Description</th>
//                     <th className="px-3 py-2">Amount</th>
//                     <th className="px-3 py-2">Fuel Apply</th>
//                     <th className="px-3 py-2">Fuel Amt</th>
//                     <th className="px-3 py-2">Tax Apply</th>
//                     <th className="px-3 py-2">Tax on Fuel</th>
//                     <th className="px-3 py-2">IGST</th>
//                     <th className="px-3 py-2">SGST</th>
//                     <th className="px-3 py-2">CGST</th>
//                     <th className="px-3 py-2">Total</th>
//                     <th className="px-3 py-2 w-10" />
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {value.additionalCharges.map((charge) => (
//                     <tr
//                       key={charge.id}
//                       className="border-b border-gray-100 odd:bg-gray-50/50"
//                     >
//                       <td className="px-2 py-1.5">
//                         <input
//                           value={charge.description}
//                           onChange={(e) =>
//                             updateCharge(
//                               charge.id,
//                               "description",
//                               e.target.value,
//                             )
//                           }
//                           className={input}
//                           disabled={disabled}
//                         />
//                       </td>
//                       <td className="px-2 py-1.5">
//                         <input
//                           type="number"
//                           min={0}
//                           step="0.01"
//                           value={charge.amount}
//                           onChange={(e) =>
//                             updateCharge(
//                               charge.id,
//                               "amount",
//                               Number(e.target.value) || 0,
//                             )
//                           }
//                           className={`${input} w-24`}
//                           disabled={disabled}
//                         />
//                       </td>
//                       <td className="px-2 py-1.5 text-center">
//                         <input
//                           type="checkbox"
//                           checked={!!charge.fuelApply}
//                           onChange={(e) =>
//                             updateCharge(
//                               charge.id,
//                               "fuelApply",
//                               e.target.checked,
//                             )
//                           }
//                           disabled={disabled}
//                         />
//                       </td>
//                       <td className="px-2 py-1.5">
//                         <input
//                           type="number"
//                           min={0}
//                           step="0.01"
//                           value={charge.fuelAmt ?? 0}
//                           onChange={(e) =>
//                             updateCharge(
//                               charge.id,
//                               "fuelAmt",
//                               Number(e.target.value) || 0,
//                             )
//                           }
//                           className={`${input} w-20`}
//                           disabled={disabled || !charge.fuelApply}
//                         />
//                       </td>
//                       <td className="px-2 py-1.5 text-center">
//                         <input
//                           type="checkbox"
//                           checked={!!charge.taxApply}
//                           onChange={(e) =>
//                             updateCharge(
//                               charge.id,
//                               "taxApply",
//                               e.target.checked,
//                             )
//                           }
//                           disabled={disabled}
//                         />
//                       </td>
//                       <td className="px-2 py-1.5">
//                         <input
//                           type="number"
//                           min={0}
//                           step="0.01"
//                           value={charge.taxOnFuel ?? 0}
//                           onChange={(e) =>
//                             updateCharge(
//                               charge.id,
//                               "taxOnFuel",
//                               Number(e.target.value) || 0,
//                             )
//                           }
//                           className={`${input} w-20`}
//                           disabled={disabled || !charge.taxApply}
//                         />
//                       </td>
//                       <td className="px-2 py-1.5">
//                         <input
//                           type="number"
//                           min={0}
//                           step="0.01"
//                           value={charge.igst ?? 0}
//                           onChange={(e) =>
//                             updateCharge(
//                               charge.id,
//                               "igst",
//                               Number(e.target.value) || 0,
//                             )
//                           }
//                           className={`${input} w-20`}
//                           disabled={disabled}
//                         />
//                       </td>
//                       <td className="px-2 py-1.5">
//                         <input
//                           type="number"
//                           min={0}
//                           step="0.01"
//                           value={charge.sgst ?? 0}
//                           onChange={(e) =>
//                             updateCharge(
//                               charge.id,
//                               "sgst",
//                               Number(e.target.value) || 0,
//                             )
//                           }
//                           className={`${input} w-20`}
//                           disabled={disabled}
//                         />
//                       </td>
//                       <td className="px-2 py-1.5">
//                         <input
//                           type="number"
//                           min={0}
//                           step="0.01"
//                           value={charge.cgst ?? 0}
//                           onChange={(e) =>
//                             updateCharge(
//                               charge.id,
//                               "cgst",
//                               Number(e.target.value) || 0,
//                             )
//                           }
//                           className={`${input} w-20`}
//                           disabled={disabled}
//                         />
//                       </td>
//                       <td className="px-2 py-1.5">
//                         <input
//                           type="number"
//                           value={charge.total ?? 0}
//                           readOnly
//                           className={`${input} w-24 bg-gray-50 font-medium`}
//                         />
//                       </td>
//                       <td className="px-2 py-1.5 text-center">
//                         <button
//                           type="button"
//                           onClick={() => removeCharge(charge.id)}
//                           disabled={disabled}
//                           className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
//                         >
//                           <Trash2 className="h-4 w-4" />
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>

//         <div className="rounded-xl bg-slate-900 px-5 py-4 text-white">
//           <div className="flex flex-wrap items-center justify-between gap-3">
//             <div className="text-sm text-slate-300">
//               Freight + Fuel + Contract + Other + Surcharge + Lines + Tax −
//               Discount
//             </div>
//             <div className="text-2xl font-bold">
//               ₹{grandTotal.toFixed(2)}
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// "use client";

// import { Plus, Trash2, Fuel } from "lucide-react";

// export type ChargeLine = {
//   id: string;
//   description: string;
//   rate?: number;
//   amount: number;
//   fuelApply?: boolean;
//   fuelAmt?: number;
//   taxApply?: boolean;
//   taxOnFuel?: number;
//   igst?: number;
//   sgst?: number;
//   cgst?: number;
//   total?: number;
// };

// export type FuelVendorRow = {
//   id: string;
//   name: string;
//   amount: number;
// };

// /** Options from fuel-surcharge master (booking form) */
// export type FuelVendorOption = {
//   id: string;
//   name: string;
//   code?: string;
//   percentage?: number;
//   amount?: number;
// };

// export type ChargeDetailsData = {
//   freight: number;
//   fuelSurcharge: number;
//   contractCharges: number;
//   otherCharges: number;
//   additionalCharges: ChargeLine[];
//   discount: number;
//   surcharge: number;
//   cgst: number;
//   sgst: number;
//   igst: number;
//   fuelVendors?: FuelVendorRow[];
// };

// type ChargeDetailsProps = {
//   value: ChargeDetailsData;
//   onChange: (value: ChargeDetailsData) => void;
//   disabled?: boolean;
//   /** Super Admin only — entire section hidden for agents */
//   canManageCharges?: boolean;
//   /** Master list from /api/logistics/settings/fuel-surcharge */
//   fuelVendors?: FuelVendorOption[];
//   selectedVendor?: string;
//   chargeableWeight?: number;
//   freightHint?: number;
// };

// function parsePctFromLabel(name: string): number | null {
//   const m = name.match(/\(([\d.]+)%\)/);
//   if (!m) return null;
//   const n = Number(m[1]);
//   return Number.isFinite(n) ? n : null;
// }

// function parseFixedFromLabel(name: string): number | null {
//   const m = name.match(/\(₹\s*([\d.]+)\)/i);
//   if (!m) return null;
//   const n = Number(m[1]);
//   return Number.isFinite(n) ? n : null;
// }

// export default function ChargeDetails({
//   value,
//   onChange,
//   disabled = false,
//   canManageCharges = false,
//   fuelVendors: masterVendors = [],
//   selectedVendor = "",
//   freightHint = 0,
// }: ChargeDetailsProps) {
//   if (!canManageCharges) {
//     return null;
//   }

//   const update = <K extends keyof ChargeDetailsData>(
//     field: K,
//     fieldValue: ChargeDetailsData[K],
//   ) => {
//     onChange({
//       ...value,
//       [field]: fieldValue,
//     });
//   };

//   const addCharge = () => {
//     update("additionalCharges", [
//       ...value.additionalCharges,
//       {
//         id: crypto.randomUUID(),
//         description: "",
//         rate: 0,
//         amount: 0,
//         fuelApply: false,
//         fuelAmt: 0,
//         taxApply: false,
//         taxOnFuel: 0,
//         igst: 0,
//         sgst: 0,
//         cgst: 0,
//         total: 0,
//       },
//     ]);
//   };

//   const updateCharge = (
//     id: string,
//     field: keyof ChargeLine,
//     fieldValue: string | number | boolean,
//   ) => {
//     update(
//       "additionalCharges",
//       value.additionalCharges.map((charge) => {
//         if (charge.id !== id) return charge;

//         const next: ChargeLine = {
//           ...charge,
//           [field]: fieldValue,
//         };

//         const amount = Number(next.amount || 0);
//         const fuel = next.fuelApply ? Number(next.fuelAmt || 0) : 0;
//         const taxOnFuel = next.taxApply ? Number(next.taxOnFuel || 0) : 0;
//         const igst = Number(next.igst || 0);
//         const sgst = Number(next.sgst || 0);
//         const cgst = Number(next.cgst || 0);

//         next.total = Number(
//           (amount + fuel + taxOnFuel + igst + sgst + cgst).toFixed(2),
//         );

//         return next;
//       }),
//     );
//   };

//   const removeCharge = (id: string) => {
//     update(
//       "additionalCharges",
//       value.additionalCharges.filter((c) => c.id !== id),
//     );
//   };

//   const vendorRows = value.fuelVendors ?? [];

//   const syncFuelTotal = (rows: FuelVendorRow[]) => {
//     const fuelTotal = rows.reduce((s, r) => s + Number(r.amount || 0), 0);
//     onChange({
//       ...value,
//       fuelVendors: rows,
//       fuelSurcharge: Number(fuelTotal.toFixed(2)),
//     });
//   };

//   /** Blank row */
//   const addFuelVendorBlank = () => {
//     syncFuelTotal([
//       ...vendorRows,
//       { id: crypto.randomUUID(), name: "", amount: 0 },
//     ]);
//   };

//   /** Add from fuel-surcharge master (or Services vendor) */
//   const addFuelVendorFromMaster = (vendorKey: string) => {
//     if (!vendorKey) {
//       addFuelVendorBlank();
//       return;
//     }

//     const master = masterVendors.find(
//       (v) =>
//         v.id === vendorKey ||
//         v.code === vendorKey ||
//         v.name === vendorKey ||
//         v.name.startsWith(vendorKey),
//     );

//     const freight = Number(value.freight || freightHint || 0);
//     let amount = 0;
//     let name = vendorKey;

//     if (master) {
//       name = master.code || master.name.replace(/\s*\([^)]*\)\s*$/, "").trim();
//       const pct =
//         master.percentage != null && Number.isFinite(Number(master.percentage))
//           ? Number(master.percentage)
//           : parsePctFromLabel(master.name);
//       const fixed =
//         master.amount != null && Number.isFinite(Number(master.amount))
//           ? Number(master.amount)
//           : parseFixedFromLabel(master.name);

//       if (pct != null && pct > 0 && freight > 0) {
//         amount = Number(((freight * pct) / 100).toFixed(2));
//       } else if (fixed != null) {
//         amount = Number(fixed.toFixed(2));
//       }
//     }

//     syncFuelTotal([
//       ...vendorRows,
//       { id: crypto.randomUUID(), name, amount },
//     ]);
//   };

//   const updateFuelVendor = (
//     id: string,
//     field: "name" | "amount",
//     fieldValue: string | number,
//   ) => {
//     const next = vendorRows.map((row) =>
//       row.id === id ? { ...row, [field]: fieldValue } : row,
//     );
//     syncFuelTotal(next);
//   };

//   const removeFuelVendor = (id: string) => {
//     syncFuelTotal(vendorRows.filter((r) => r.id !== id));
//   };

//   const additionalTotal = value.additionalCharges.reduce(
//     (sum, c) => sum + Number(c.total ?? c.amount ?? 0),
//     0,
//   );

//   const taxTotal =
//     Number(value.cgst || 0) +
//     Number(value.sgst || 0) +
//     Number(value.igst || 0);

//   const grandTotal =
//     Number(value.freight || 0) +
//     Number(value.fuelSurcharge || 0) +
//     Number(value.contractCharges || 0) +
//     Number(value.otherCharges || 0) +
//     Number(value.surcharge || 0) +
//     additionalTotal +
//     taxTotal -
//     Number(value.discount || 0);

//   const input =
//     "h-9 w-full rounded border border-gray-300 bg-white px-2.5 text-sm outline-none focus:border-slate-600 disabled:bg-gray-50 disabled:text-gray-500";
//   const label = "mb-1 block text-xs font-medium text-gray-600";

//   return (
//     <section className="rounded-xl border bg-white shadow-sm">
//       <div className="border-b bg-slate-50 px-5 py-3">
//         <div className="flex items-center justify-between gap-2">
//           <div>
//             <h2 className="text-sm font-semibold text-slate-800">
//               Charge Details
//             </h2>
//             <p className="mt-0.5 text-xs text-gray-500">
//               Freight, fuel surcharge, contract/other charges and tax split.
//             </p>
//           </div>
//           <span className="inline-flex items-center gap-1 rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-800">
//             <Fuel className="h-3 w-3" />
//             Fuel editable
//           </span>
//         </div>
//       </div>

//       <div className="space-y-5 p-5">
//         <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-4">
//           <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
//             <h3 className="text-sm font-semibold text-amber-900">
//               Fuel Surcharge Vendors
//             </h3>
//             <div className="flex flex-wrap items-center gap-2">
//               {masterVendors.length > 0 ? (
//                 <select
//                   className={`${input} w-auto min-w-[180px]`}
//                   defaultValue=""
//                   disabled={disabled}
//                   onChange={(e) => {
//                     const v = e.target.value;
//                     if (!v) return;
//                     addFuelVendorFromMaster(v);
//                     e.target.value = "";
//                   }}
//                 >
//                   <option value="">+ Add from master…</option>
//                   {masterVendors.map((v) => (
//                     <option key={v.id} value={v.id}>
//                       {v.name}
//                     </option>
//                   ))}
//                 </select>
//               ) : null}

//               {selectedVendor ? (
//                 <button
//                   type="button"
//                   disabled={disabled}
//                   onClick={() => addFuelVendorFromMaster(selectedVendor)}
//                   className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-medium text-amber-900 hover:bg-amber-50 disabled:opacity-50"
//                 >
//                   <Plus className="h-3.5 w-3.5" />
//                   Use selected vendor
//                 </button>
//               ) : null}

//               <button
//                 type="button"
//                 onClick={addFuelVendorBlank}
//                 disabled={disabled}
//                 className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-medium text-amber-900 hover:bg-amber-50 disabled:opacity-50"
//               >
//                 <Plus className="h-3.5 w-3.5" />
//                 Add Fuel Surcharge
//               </button>
//             </div>
//           </div>

//           {vendorRows.length === 0 ? (
//             <p className="text-xs text-amber-800/80">
//               No vendor rows yet.{" "}
//               {masterVendors.length > 0
//                 ? 'Pick from master or click "Add Fuel Surcharge".'
//                 : 'Click "Add Fuel Surcharge" to add DHL / FedEx / etc. Totals auto-fill Fuel Surcharge below.'}
//             </p>
//           ) : (
//             <div className="space-y-2">
//               {vendorRows.map((row) => (
//                 <div
//                   key={row.id}
//                   className="flex flex-wrap items-center gap-2"
//                 >
//                   <input
//                     value={row.name}
//                     onChange={(e) =>
//                       updateFuelVendor(row.id, "name", e.target.value)
//                     }
//                     placeholder="Vendor (e.g. DHL, FedEx)"
//                     className={`${input} max-w-[220px]`}
//                     disabled={disabled}
//                   />
//                   <input
//                     type="number"
//                     min={0}
//                     step="0.01"
//                     value={row.amount}
//                     onChange={(e) =>
//                       updateFuelVendor(
//                         row.id,
//                         "amount",
//                         Number(e.target.value) || 0,
//                       )
//                     }
//                     placeholder="Amount"
//                     className={`${input} w-32`}
//                     disabled={disabled}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => removeFuelVendor(row.id)}
//                     disabled={disabled}
//                     className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
//                   >
//                     <Trash2 className="h-4 w-4" />
//                   </button>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
//           <div>
//             <label className={label}>Contract Charges</label>
//             <input
//               type="number"
//               min={0}
//               step="0.01"
//               value={value.contractCharges}
//               onChange={(e) =>
//                 update("contractCharges", Number(e.target.value) || 0)
//               }
//               className={input}
//               disabled={disabled}
//             />
//           </div>

//           <div>
//             <label className={label}>Other Charges</label>
//             <input
//               type="number"
//               min={0}
//               step="0.01"
//               value={value.otherCharges}
//               onChange={(e) =>
//                 update("otherCharges", Number(e.target.value) || 0)
//               }
//               className={input}
//               disabled={disabled}
//             />
//           </div>

//           <div>
//             <label className={label}>Freight</label>
//             <input
//               type="number"
//               min={0}
//               step="0.01"
//               value={value.freight}
//               onChange={(e) =>
//                 update("freight", Number(e.target.value) || 0)
//               }
//               className={input}
//               disabled={disabled}
//             />
//           </div>

//           <div>
//             <label className={label}>Fuel Surcharge</label>
//             <input
//               type="number"
//               min={0}
//               step="0.01"
//               value={value.fuelSurcharge}
//               onChange={(e) =>
//                 update("fuelSurcharge", Number(e.target.value) || 0)
//               }
//               className={input}
//               disabled={disabled}
//             />
//           </div>

//           <div>
//             <label className={label}>Surcharge</label>
//             <input
//               type="number"
//               min={0}
//               step="0.01"
//               value={value.surcharge}
//               onChange={(e) =>
//                 update("surcharge", Number(e.target.value) || 0)
//               }
//               className={input}
//               disabled={disabled}
//             />
//           </div>

//           <div>
//             <label className={label}>IGST</label>
//             <input
//               type="number"
//               min={0}
//               step="0.01"
//               value={value.igst}
//               onChange={(e) => update("igst", Number(e.target.value) || 0)}
//               className={input}
//               disabled={disabled}
//             />
//           </div>

//           <div>
//             <label className={label}>CGST</label>
//             <input
//               type="number"
//               min={0}
//               step="0.01"
//               value={value.cgst}
//               onChange={(e) => update("cgst", Number(e.target.value) || 0)}
//               className={input}
//               disabled={disabled}
//             />
//           </div>

//           <div>
//             <label className={label}>SGST</label>
//             <input
//               type="number"
//               min={0}
//               step="0.01"
//               value={value.sgst}
//               onChange={(e) => update("sgst", Number(e.target.value) || 0)}
//               className={input}
//               disabled={disabled}
//             />
//           </div>
//         </div>

//         <div className="max-w-xs">
//           <label className={label}>Discount</label>
//           <input
//             type="number"
//             min={0}
//             step="0.01"
//             value={value.discount}
//             onChange={(e) =>
//               update("discount", Number(e.target.value) || 0)
//             }
//             className={input}
//             disabled={disabled}
//           />
//         </div>

//         <div>
//           <div className="mb-3 flex items-center justify-between">
//             <h3 className="text-sm font-semibold text-gray-800">
//               Additional Charge Lines
//             </h3>
//             <button
//               type="button"
//               onClick={addCharge}
//               disabled={disabled}
//               className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-gray-50 disabled:opacity-50"
//             >
//               <Plus className="h-3.5 w-3.5" />
//               Add Line
//             </button>
//           </div>

//           {value.additionalCharges.length === 0 ? (
//             <p className="rounded-lg border border-dashed p-4 text-center text-xs text-gray-500">
//               No additional charge lines.
//             </p>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full min-w-[900px] border-collapse text-sm">
//                 <thead>
//                   <tr className="bg-slate-900 text-left text-xs font-semibold uppercase tracking-wide text-white">
//                     <th className="px-3 py-2">Description</th>
//                     <th className="px-3 py-2">Amount</th>
//                     <th className="px-3 py-2">Fuel Apply</th>
//                     <th className="px-3 py-2">Fuel Amt</th>
//                     <th className="px-3 py-2">Tax Apply</th>
//                     <th className="px-3 py-2">Tax on Fuel</th>
//                     <th className="px-3 py-2">IGST</th>
//                     <th className="px-3 py-2">SGST</th>
//                     <th className="px-3 py-2">CGST</th>
//                     <th className="px-3 py-2">Total</th>
//                     <th className="px-3 py-2 w-10" />
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {value.additionalCharges.map((charge) => (
//                     <tr
//                       key={charge.id}
//                       className="border-b border-gray-100 odd:bg-gray-50/50"
//                     >
//                       <td className="px-2 py-1.5">
//                         <input
//                           value={charge.description}
//                           onChange={(e) =>
//                             updateCharge(
//                               charge.id,
//                               "description",
//                               e.target.value,
//                             )
//                           }
//                           className={input}
//                           disabled={disabled}
//                         />
//                       </td>
//                       <td className="px-2 py-1.5">
//                         <input
//                           type="number"
//                           min={0}
//                           step="0.01"
//                           value={charge.amount}
//                           onChange={(e) =>
//                             updateCharge(
//                               charge.id,
//                               "amount",
//                               Number(e.target.value) || 0,
//                             )
//                           }
//                           className={`${input} w-24`}
//                           disabled={disabled}
//                         />
//                       </td>
//                       <td className="px-2 py-1.5 text-center">
//                         <input
//                           type="checkbox"
//                           checked={!!charge.fuelApply}
//                           onChange={(e) =>
//                             updateCharge(
//                               charge.id,
//                               "fuelApply",
//                               e.target.checked,
//                             )
//                           }
//                           disabled={disabled}
//                         />
//                       </td>
//                       <td className="px-2 py-1.5">
//                         <input
//                           type="number"
//                           min={0}
//                           step="0.01"
//                           value={charge.fuelAmt ?? 0}
//                           onChange={(e) =>
//                             updateCharge(
//                               charge.id,
//                               "fuelAmt",
//                               Number(e.target.value) || 0,
//                             )
//                           }
//                           className={`${input} w-20`}
//                           disabled={disabled || !charge.fuelApply}
//                         />
//                       </td>
//                       <td className="px-2 py-1.5 text-center">
//                         <input
//                           type="checkbox"
//                           checked={!!charge.taxApply}
//                           onChange={(e) =>
//                             updateCharge(
//                               charge.id,
//                               "taxApply",
//                               e.target.checked,
//                             )
//                           }
//                           disabled={disabled}
//                         />
//                       </td>
//                       <td className="px-2 py-1.5">
//                         <input
//                           type="number"
//                           min={0}
//                           step="0.01"
//                           value={charge.taxOnFuel ?? 0}
//                           onChange={(e) =>
//                             updateCharge(
//                               charge.id,
//                               "taxOnFuel",
//                               Number(e.target.value) || 0,
//                             )
//                           }
//                           className={`${input} w-20`}
//                           disabled={disabled || !charge.taxApply}
//                         />
//                       </td>
//                       <td className="px-2 py-1.5">
//                         <input
//                           type="number"
//                           min={0}
//                           step="0.01"
//                           value={charge.igst ?? 0}
//                           onChange={(e) =>
//                             updateCharge(
//                               charge.id,
//                               "igst",
//                               Number(e.target.value) || 0,
//                             )
//                           }
//                           className={`${input} w-20`}
//                           disabled={disabled}
//                         />
//                       </td>
//                       <td className="px-2 py-1.5">
//                         <input
//                           type="number"
//                           min={0}
//                           step="0.01"
//                           value={charge.sgst ?? 0}
//                           onChange={(e) =>
//                             updateCharge(
//                               charge.id,
//                               "sgst",
//                               Number(e.target.value) || 0,
//                             )
//                           }
//                           className={`${input} w-20`}
//                           disabled={disabled}
//                         />
//                       </td>
//                       <td className="px-2 py-1.5">
//                         <input
//                           type="number"
//                           min={0}
//                           step="0.01"
//                           value={charge.cgst ?? 0}
//                           onChange={(e) =>
//                             updateCharge(
//                               charge.id,
//                               "cgst",
//                               Number(e.target.value) || 0,
//                             )
//                           }
//                           className={`${input} w-20`}
//                           disabled={disabled}
//                         />
//                       </td>
//                       <td className="px-2 py-1.5">
//                         <input
//                           type="number"
//                           value={charge.total ?? 0}
//                           readOnly
//                           className={`${input} w-24 bg-gray-50 font-medium`}
//                         />
//                       </td>
//                       <td className="px-2 py-1.5 text-center">
//                         <button
//                           type="button"
//                           onClick={() => removeCharge(charge.id)}
//                           disabled={disabled}
//                           className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
//                         >
//                           <Trash2 className="h-4 w-4" />
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>

//         <div className="rounded-xl bg-slate-900 px-5 py-4 text-white">
//           <div className="flex flex-wrap items-center justify-between gap-3">
//             <div className="text-sm text-slate-300">
//               Freight + Fuel + Contract + Other + Surcharge + Lines + Tax −
//               Discount
//             </div>
//             <div className="text-2xl font-bold">
//               ₹{grandTotal.toFixed(2)}
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// "use client";

// import { Plus, Trash2, Fuel } from "lucide-react";

// export type ChargeLine = {
//   id: string;
//   description: string;
//   rate?: number;
//   amount: number;
//   fuelApply?: boolean;
//   fuelAmt?: number;
//   taxApply?: boolean;
//   taxOnFuel?: number;
//   igst?: number;
//   sgst?: number;
//   cgst?: number;
//   total?: number;
// };

// export type ChargeDetailsData = {
//   freight: number;
//   fuelSurcharge: number;
//   contractCharges: number;
//   otherCharges: number;
//   additionalCharges: ChargeLine[];
//   discount: number;
//   surcharge: number;
//   cgst: number;
//   sgst: number;
//   igst: number;
// };

// type ChargeDetailsProps = {
//   value: ChargeDetailsData;
//   onChange: (value: ChargeDetailsData) => void;
//   disabled?: boolean;
//   canManageCharges?: boolean;
//   /** Display only — e.g. "fedex (4.99%)" from Services Details */
//   selectedVendorLabel?: string;
// };

// export default function ChargeDetails({
//   value,
//   onChange,
//   disabled = false,
//   canManageCharges = false,
//   selectedVendorLabel = "",
// }: ChargeDetailsProps) {
//   if (!canManageCharges) {
//     return null;
//   }

//   const update = <K extends keyof ChargeDetailsData>(
//     field: K,
//     fieldValue: ChargeDetailsData[K],
//   ) => {
//     onChange({
//       ...value,
//       [field]: fieldValue,
//     });
//   };

//   const addCharge = () => {
//     update("additionalCharges", [
//       ...value.additionalCharges,
//       {
//         id: crypto.randomUUID(),
//         description: "",
//         rate: 0,
//         amount: 0,
//         fuelApply: false,
//         fuelAmt: 0,
//         taxApply: false,
//         taxOnFuel: 0,
//         igst: 0,
//         sgst: 0,
//         cgst: 0,
//         total: 0,
//       },
//     ]);
//   };

//   const updateCharge = (
//     id: string,
//     field: keyof ChargeLine,
//     fieldValue: string | number | boolean,
//   ) => {
//     update(
//       "additionalCharges",
//       value.additionalCharges.map((charge) => {
//         if (charge.id !== id) return charge;

//         const next: ChargeLine = {
//           ...charge,
//           [field]: fieldValue,
//         };

//         const amount = Number(next.amount || 0);
//         const fuel = next.fuelApply ? Number(next.fuelAmt || 0) : 0;
//         const taxOnFuel = next.taxApply ? Number(next.taxOnFuel || 0) : 0;
//         const igst = Number(next.igst || 0);
//         const sgst = Number(next.sgst || 0);
//         const cgst = Number(next.cgst || 0);

//         next.total = Number(
//           (amount + fuel + taxOnFuel + igst + sgst + cgst).toFixed(2),
//         );

//         return next;
//       }),
//     );
//   };

//   const removeCharge = (id: string) => {
//     update(
//       "additionalCharges",
//       value.additionalCharges.filter((c) => c.id !== id),
//     );
//   };

//   const additionalTotal = value.additionalCharges.reduce(
//     (sum, c) => sum + Number(c.total ?? c.amount ?? 0),
//     0,
//   );

//   const taxTotal =
//     Number(value.cgst || 0) +
//     Number(value.sgst || 0) +
//     Number(value.igst || 0);

//   const grandTotal =
//     Number(value.freight || 0) +
//     Number(value.fuelSurcharge || 0) +
//     Number(value.contractCharges || 0) +
//     Number(value.otherCharges || 0) +
//     Number(value.surcharge || 0) +
//     additionalTotal +
//     taxTotal -
//     Number(value.discount || 0);

//   const input =
//     "h-9 w-full rounded border border-gray-300 bg-white px-2.5 text-sm outline-none focus:border-slate-600 disabled:bg-gray-50 disabled:text-gray-500";
//   const label = "mb-1 block text-xs font-medium text-gray-600";

//   return (
//     <section className="rounded-xl border bg-white shadow-sm">
//       <div className="border-b bg-slate-50 px-5 py-3">
//         <div className="flex items-center justify-between gap-2">
//           <div>
//             <h2 className="text-sm font-semibold text-slate-800">
//               Charge Details
//             </h2>
//             <p className="mt-0.5 text-xs text-gray-500">
//               Fuel surcharge follows the Vendor selected in Services Details.
//             </p>
//           </div>
//           <span className="inline-flex items-center gap-1 rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-800">
//             <Fuel className="h-3 w-3" />
//             Super Admin
//           </span>
//         </div>
//       </div>

//       <div className="space-y-5 p-5">
//         {selectedVendorLabel ? (
//           <div className="rounded-lg border border-amber-200 bg-amber-50/60 px-4 py-3 text-sm text-amber-950">
//             <span className="font-semibold">Vendor: </span>
//             {selectedVendorLabel}
//             <span className="mt-1 block text-xs text-amber-800/90">
//               Fuel Surcharge is auto-calculated from this vendor (% of Freight or
//               fixed amount). Change Vendor under Services Details to update it.
//             </span>
//           </div>
//         ) : (
//           <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
//             Select a Vendor in Services Details to auto-fill Fuel Surcharge.
//           </div>
//         )}

//         <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
//           <div>
//             <label className={label}>Contract Charges</label>
//             <input
//               type="number"
//               min={0}
//               step="0.01"
//               value={value.contractCharges}
//               onChange={(e) =>
//                 update("contractCharges", Number(e.target.value) || 0)
//               }
//               className={input}
//               disabled={disabled}
//             />
//           </div>

//           <div>
//             <label className={label}>Other Charges</label>
//             <input
//               type="number"
//               min={0}
//               step="0.01"
//               value={value.otherCharges}
//               onChange={(e) =>
//                 update("otherCharges", Number(e.target.value) || 0)
//               }
//               className={input}
//               disabled={disabled}
//             />
//           </div>

//           <div>
//             <label className={label}>Freight</label>
//             <input
//               type="number"
//               min={0}
//               step="0.01"
//               value={value.freight}
//               onChange={(e) =>
//                 update("freight", Number(e.target.value) || 0)
//               }
//               className={input}
//               disabled={disabled}
//             />
//           </div>

//           <div>
//             <label className={label}>Fuel Surcharge (auto)</label>
//             <input
//               type="number"
//               min={0}
//               step="0.01"
//               value={value.fuelSurcharge}
//               readOnly
//               className={`${input} bg-gray-50 font-semibold`}
//               title="Auto from Services → Vendor"
//             />
//           </div>

//           {/* <div>
//             <label className={label}>Surcharge</label>
//             <input
//               type="number"
//               min={0}
//               step="0.01"
//               value={value.surcharge}
//               onChange={(e) =>
//                 update("surcharge", Number(e.target.value) || 0)
//               }
//               className={input}
//               disabled={disabled}
//             />
//           </div> */}

//           <div>
//             <label className={label}>IGST</label>
//             <input
//               type="number"
//               min={0}
//               step="0.01"
//               value={value.igst}
//               onChange={(e) => update("igst", Number(e.target.value) || 0)}
//               className={input}
//               disabled={disabled}
//             />
//           </div>

//           <div>
//             <label className={label}>CGST</label>
//             <input
//               type="number"
//               min={0}
//               step="0.01"
//               value={value.cgst}
//               onChange={(e) => update("cgst", Number(e.target.value) || 0)}
//               className={input}
//               disabled={disabled}
//             />
//           </div>

//           <div>
//             <label className={label}>SGST</label>
//             <input
//               type="number"
//               min={0}
//               step="0.01"
//               value={value.sgst}
//               onChange={(e) => update("sgst", Number(e.target.value) || 0)}
//               className={input}
//               disabled={disabled}
//             />
//           </div>
//         </div>

//         <div className="max-w-xs">
//           <label className={label}>Discount</label>
//           <input
//             type="number"
//             min={0}
//             step="0.01"
//             value={value.discount}
//             onChange={(e) =>
//               update("discount", Number(e.target.value) || 0)
//             }
//             className={input}
//             disabled={disabled}
//           />
//         </div>

//         <div>
//           <div className="mb-3 flex items-center justify-between">
//             <h3 className="text-sm font-semibold text-gray-800">
//               Additional Charge Lines
//             </h3>
//             <button
//               type="button"
//               onClick={addCharge}
//               disabled={disabled}
//               className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-gray-50 disabled:opacity-50"
//             >
//               <Plus className="h-3.5 w-3.5" />
//               Add Line
//             </button>
//           </div>

//           {value.additionalCharges.length === 0 ? (
//             <p className="rounded-lg border border-dashed p-4 text-center text-xs text-gray-500">
//               No additional charge lines.
//             </p>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full min-w-[900px] border-collapse text-sm">
//                 <thead>
//                   <tr className="bg-slate-900 text-left text-xs font-semibold uppercase tracking-wide text-white">
//                     <th className="px-3 py-2">Description</th>
//                     <th className="px-3 py-2">Amount</th>
//                     <th className="px-3 py-2">Fuel Apply</th>
//                     <th className="px-3 py-2">Fuel Amt</th>
//                     <th className="px-3 py-2">Tax Apply</th>
//                     <th className="px-3 py-2">Tax on Fuel</th>
//                     <th className="px-3 py-2">IGST</th>
//                     <th className="px-3 py-2">SGST</th>
//                     <th className="px-3 py-2">CGST</th>
//                     <th className="px-3 py-2">Total</th>
//                     <th className="px-3 py-2 w-10" />
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {value.additionalCharges.map((charge) => (
//                     <tr
//                       key={charge.id}
//                       className="border-b border-gray-100 odd:bg-gray-50/50"
//                     >
//                       <td className="px-2 py-1.5">
//                         <input
//                           value={charge.description}
//                           onChange={(e) =>
//                             updateCharge(
//                               charge.id,
//                               "description",
//                               e.target.value,
//                             )
//                           }
//                           className={input}
//                           disabled={disabled}
//                         />
//                       </td>
//                       <td className="px-2 py-1.5">
//                         <input
//                           type="number"
//                           min={0}
//                           step="0.01"
//                           value={charge.amount}
//                           onChange={(e) =>
//                             updateCharge(
//                               charge.id,
//                               "amount",
//                               Number(e.target.value) || 0,
//                             )
//                           }
//                           className={`${input} w-24`}
//                           disabled={disabled}
//                         />
//                       </td>
//                       <td className="px-2 py-1.5 text-center">
//                         <input
//                           type="checkbox"
//                           checked={!!charge.fuelApply}
//                           onChange={(e) =>
//                             updateCharge(
//                               charge.id,
//                               "fuelApply",
//                               e.target.checked,
//                             )
//                           }
//                           disabled={disabled}
//                         />
//                       </td>
//                       <td className="px-2 py-1.5">
//                         <input
//                           type="number"
//                           min={0}
//                           step="0.01"
//                           value={charge.fuelAmt ?? 0}
//                           onChange={(e) =>
//                             updateCharge(
//                               charge.id,
//                               "fuelAmt",
//                               Number(e.target.value) || 0,
//                             )
//                           }
//                           className={`${input} w-20`}
//                           disabled={disabled || !charge.fuelApply}
//                         />
//                       </td>
//                       <td className="px-2 py-1.5 text-center">
//                         <input
//                           type="checkbox"
//                           checked={!!charge.taxApply}
//                           onChange={(e) =>
//                             updateCharge(
//                               charge.id,
//                               "taxApply",
//                               e.target.checked,
//                             )
//                           }
//                           disabled={disabled}
//                         />
//                       </td>
//                       <td className="px-2 py-1.5">
//                         <input
//                           type="number"
//                           min={0}
//                           step="0.01"
//                           value={charge.taxOnFuel ?? 0}
//                           onChange={(e) =>
//                             updateCharge(
//                               charge.id,
//                               "taxOnFuel",
//                               Number(e.target.value) || 0,
//                             )
//                           }
//                           className={`${input} w-20`}
//                           disabled={disabled || !charge.taxApply}
//                         />
//                       </td>
//                       <td className="px-2 py-1.5">
//                         <input
//                           type="number"
//                           min={0}
//                           step="0.01"
//                           value={charge.igst ?? 0}
//                           onChange={(e) =>
//                             updateCharge(
//                               charge.id,
//                               "igst",
//                               Number(e.target.value) || 0,
//                             )
//                           }
//                           className={`${input} w-20`}
//                           disabled={disabled}
//                         />
//                       </td>
//                       <td className="px-2 py-1.5">
//                         <input
//                           type="number"
//                           min={0}
//                           step="0.01"
//                           value={charge.sgst ?? 0}
//                           onChange={(e) =>
//                             updateCharge(
//                               charge.id,
//                               "sgst",
//                               Number(e.target.value) || 0,
//                             )
//                           }
//                           className={`${input} w-20`}
//                           disabled={disabled}
//                         />
//                       </td>
//                       <td className="px-2 py-1.5">
//                         <input
//                           type="number"
//                           min={0}
//                           step="0.01"
//                           value={charge.cgst ?? 0}
//                           onChange={(e) =>
//                             updateCharge(
//                               charge.id,
//                               "cgst",
//                               Number(e.target.value) || 0,
//                             )
//                           }
//                           className={`${input} w-20`}
//                           disabled={disabled}
//                         />
//                       </td>
//                       <td className="px-2 py-1.5">
//                         <input
//                           type="number"
//                           value={charge.total ?? 0}
//                           readOnly
//                           className={`${input} w-24 bg-gray-50 font-medium`}
//                         />
//                       </td>
//                       <td className="px-2 py-1.5 text-center">
//                         <button
//                           type="button"
//                           onClick={() => removeCharge(charge.id)}
//                           disabled={disabled}
//                           className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
//                         >
//                           <Trash2 className="h-4 w-4" />
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>

//         <div className="rounded-xl bg-slate-900 px-5 py-4 text-white">
//           <div className="flex flex-wrap items-center justify-between gap-3">
//             <div className="text-sm text-slate-300">
//               Freight + Fuel + Contract + Other + Surcharge + Lines + Tax −
//               Discount
//             </div>
//             <div className="text-2xl font-bold">
//               ₹{grandTotal.toFixed(2)}
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// "use client";

// import { Plus, Trash2, Fuel } from "lucide-react";

// export type ChargeLine = {
//   id: string;
//   description: string;
//   rate?: number;
//   amount: number;
//   fuelApply?: boolean;
//   fuelAmt?: number;
//   taxApply?: boolean;
//   taxOnFuel?: number;
//   igst?: number;
//   sgst?: number;
//   cgst?: number;
//   total?: number;
// };

// export type ChargeDetailsData = {
//   freight: number;
//   fuelSurcharge: number;
//   contractCharges: number;
//   otherCharges: number;
//   additionalCharges: ChargeLine[];
//   discount: number;
//   surcharge: number;
//   cgst: number;
//   sgst: number;
//   igst: number;
// };

// type ChargeDetailsProps = {
//   value: ChargeDetailsData;
//   onChange: (value: ChargeDetailsData) => void;
//   disabled?: boolean;
//   /** Super Admin: full edit. Co-loader / others: view + Freight only */
//   canManageCharges?: boolean;
//   selectedVendorLabel?: string;
// };

// export default function ChargeDetails({
//   value,
//   onChange,
//   disabled = false,
//   canManageCharges = false,
//   selectedVendorLabel = "",
// }: ChargeDetailsProps) {
//   /** Only Freight is editable for co-loaders; Super Admin edits everything */
//   const freightOnly = !canManageCharges;
//   const lockExtras = disabled || freightOnly;

//   const update = <K extends keyof ChargeDetailsData>(
//     field: K,
//     fieldValue: ChargeDetailsData[K],
//   ) => {
//     if (freightOnly && field !== "freight") return;
//     onChange({
//       ...value,
//       [field]: fieldValue,
//     });
//   };

//   const addCharge = () => {
//     if (freightOnly || disabled) return;
//     update("additionalCharges", [
//       ...value.additionalCharges,
//       {
//         id: crypto.randomUUID(),
//         description: "",
//         rate: 0,
//         amount: 0,
//         fuelApply: false,
//         fuelAmt: 0,
//         taxApply: false,
//         taxOnFuel: 0,
//         igst: 0,
//         sgst: 0,
//         cgst: 0,
//         total: 0,
//       },
//     ]);
//   };

//   const updateCharge = (
//     id: string,
//     field: keyof ChargeLine,
//     fieldValue: string | number | boolean,
//   ) => {
//     if (freightOnly || disabled) return;
//     update(
//       "additionalCharges",
//       value.additionalCharges.map((charge) => {
//         if (charge.id !== id) return charge;

//         const next: ChargeLine = {
//           ...charge,
//           [field]: fieldValue,
//         };

//         const amount = Number(next.amount || 0);
//         const fuel = next.fuelApply ? Number(next.fuelAmt || 0) : 0;
//         const taxOnFuel = next.taxApply ? Number(next.taxOnFuel || 0) : 0;
//         const igst = Number(next.igst || 0);
//         const sgst = Number(next.sgst || 0);
//         const cgst = Number(next.cgst || 0);

//         next.total = Number(
//           (amount + fuel + taxOnFuel + igst + sgst + cgst).toFixed(2),
//         );

//         return next;
//       }),
//     );
//   };

//   const removeCharge = (id: string) => {
//     if (freightOnly || disabled) return;
//     update(
//       "additionalCharges",
//       value.additionalCharges.filter((c) => c.id !== id),
//     );
//   };

//   const additionalTotal = value.additionalCharges.reduce(
//     (sum, c) => sum + Number(c.total ?? c.amount ?? 0),
//     0,
//   );

//   const taxTotal =
//     Number(value.cgst || 0) +
//     Number(value.sgst || 0) +
//     Number(value.igst || 0);

//   const grandTotal =
//     Number(value.freight || 0) +
//     Number(value.fuelSurcharge || 0) +
//     Number(value.contractCharges || 0) +
//     Number(value.otherCharges || 0) +
//     Number(value.surcharge || 0) +
//     additionalTotal +
//     taxTotal -
//     Number(value.discount || 0);

//   const input =
//     "h-9 w-full rounded border border-gray-300 bg-white px-2.5 text-sm outline-none focus:border-slate-600 disabled:bg-gray-50 disabled:text-gray-500";
//   const inputLocked = `${input} bg-gray-50 cursor-not-allowed`;
//   const label = "mb-1 block text-xs font-medium text-gray-600";

//   return (
//     <section className="rounded-xl border bg-white shadow-sm">
//       <div className="border-b bg-slate-50 px-5 py-3">
//         <div className="flex items-center justify-between gap-2">
//           <div>
//             <h2 className="text-sm font-semibold text-slate-800">
//               Charge Details
//             </h2>
//             <p className="mt-0.5 text-xs text-gray-500">
//               {freightOnly
//                 ? "Freight is editable. Fuel follows Vendor in Services Details. Other fields are view-only."
//                 : "Fuel surcharge follows the Vendor selected in Services Details."}
//             </p>
//           </div>
//           {canManageCharges ? (
//             <span className="inline-flex items-center gap-1 rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-800">
//               <Fuel className="h-3 w-3" />
//               Super Admin
//             </span>
//           ) : (
//             <span className="inline-flex items-center gap-1 rounded bg-teal-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-teal-800">
//               Freight only
//             </span>
//           )}
//         </div>
//       </div>

//       <div className="space-y-5 p-5">
//         {selectedVendorLabel ? (
//           <div className="rounded-lg border border-amber-200 bg-amber-50/60 px-4 py-3 text-sm text-amber-950">
//             <span className="font-semibold">Vendor: </span>
//             {selectedVendorLabel}
//             <span className="mt-1 block text-xs text-amber-800/90">
//               Fuel Surcharge is auto-calculated from this vendor (% of Freight or
//               fixed amount). Change Vendor under Services Details to update it.
//             </span>
//           </div>
//         ) : (
//           <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
//             Select a Vendor in Services Details to auto-fill Fuel Surcharge.
//           </div>
//         )}

//         <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
//           <div>
//             <label className={label}>Contract Charges</label>
//             <input
//               type="number"
//               min={0}
//               step="0.01"
//               value={value.contractCharges}
//               onChange={(e) =>
//                 update("contractCharges", Number(e.target.value) || 0)
//               }
//               className={lockExtras ? inputLocked : input}
//               disabled={lockExtras}
//               readOnly={lockExtras}
//             />
//           </div>

//           <div>
//             <label className={label}>Other Charges</label>
//             <input
//               type="number"
//               min={0}
//               step="0.01"
//               value={value.otherCharges}
//               onChange={(e) =>
//                 update("otherCharges", Number(e.target.value) || 0)
//               }
//               className={lockExtras ? inputLocked : input}
//               disabled={lockExtras}
//               readOnly={lockExtras}
//             />
//           </div>

//           <div>
//             <label className={label}>
//               Freight{freightOnly ? " *" : ""}
//             </label>
//             <input
//               type="number"
//               min={0}
//               step="0.01"
//               value={value.freight}
//               onChange={(e) =>
//                 update("freight", Number(e.target.value) || 0)
//               }
//               className={
//                 disabled
//                   ? inputLocked
//                   : `${input} ${freightOnly ? "border-teal-400 ring-1 ring-teal-100" : ""}`
//               }
//               disabled={disabled}
//             />
//           </div>

//           <div>
//             <label className={label}>Fuel Surcharge (auto)</label>
//             <input
//               type="number"
//               min={0}
//               step="0.01"
//               value={value.fuelSurcharge}
//               readOnly
//               className={`${input} bg-gray-50 font-semibold`}
//               title="Auto from Services → Vendor"
//             />
//           </div>

//           <div>
//             <label className={label}>IGST</label>
//             <input
//               type="number"
//               min={0}
//               step="0.01"
//               value={value.igst}
//               onChange={(e) => update("igst", Number(e.target.value) || 0)}
//               className={lockExtras ? inputLocked : input}
//               disabled={lockExtras}
//               readOnly={lockExtras}
//             />
//           </div>

//           <div>
//             <label className={label}>CGST</label>
//             <input
//               type="number"
//               min={0}
//               step="0.01"
//               value={value.cgst}
//               onChange={(e) => update("cgst", Number(e.target.value) || 0)}
//               className={lockExtras ? inputLocked : input}
//               disabled={lockExtras}
//               readOnly={lockExtras}
//             />
//           </div>

//           <div>
//             <label className={label}>SGST</label>
//             <input
//               type="number"
//               min={0}
//               step="0.01"
//               value={value.sgst}
//               onChange={(e) => update("sgst", Number(e.target.value) || 0)}
//               className={lockExtras ? inputLocked : input}
//               disabled={lockExtras}
//               readOnly={lockExtras}
//             />
//           </div>
//         </div>

//         <div className="max-w-xs">
//           <label className={label}>Discount</label>
//           <input
//             type="number"
//             min={0}
//             step="0.01"
//             value={value.discount}
//             onChange={(e) =>
//               update("discount", Number(e.target.value) || 0)
//             }
//             className={lockExtras ? inputLocked : input}
//             disabled={lockExtras}
//             readOnly={lockExtras}
//           />
//         </div>

//         <div>
//           <div className="mb-3 flex items-center justify-between">
//             <h3 className="text-sm font-semibold text-gray-800">
//               Additional Charge Lines
//             </h3>
//             {canManageCharges ? (
//               <button
//                 type="button"
//                 onClick={addCharge}
//                 disabled={disabled}
//                 className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-gray-50 disabled:opacity-50"
//               >
//                 <Plus className="h-3.5 w-3.5" />
//                 Add Line
//               </button>
//             ) : null}
//           </div>

//           {value.additionalCharges.length === 0 ? (
//             <p className="rounded-lg border border-dashed p-4 text-center text-xs text-gray-500">
//               No additional charge lines.
//             </p>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full min-w-[900px] border-collapse text-sm">
//                 <thead>
//                   <tr className="bg-slate-900 text-left text-xs font-semibold uppercase tracking-wide text-white">
//                     <th className="px-3 py-2">Description</th>
//                     <th className="px-3 py-2">Amount</th>
//                     <th className="px-3 py-2">Fuel Apply</th>
//                     <th className="px-3 py-2">Fuel Amt</th>
//                     <th className="px-3 py-2">Tax Apply</th>
//                     <th className="px-3 py-2">Tax on Fuel</th>
//                     <th className="px-3 py-2">IGST</th>
//                     <th className="px-3 py-2">SGST</th>
//                     <th className="px-3 py-2">CGST</th>
//                     <th className="px-3 py-2">Total</th>
//                     {canManageCharges ? (
//                       <th className="px-3 py-2 w-10" />
//                     ) : null}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {value.additionalCharges.map((charge) => (
//                     <tr
//                       key={charge.id}
//                       className="border-b border-gray-100 odd:bg-gray-50/50"
//                     >
//                       <td className="px-2 py-1.5">
//                         <input
//                           value={charge.description}
//                           onChange={(e) =>
//                             updateCharge(
//                               charge.id,
//                               "description",
//                               e.target.value,
//                             )
//                           }
//                           className={lockExtras ? inputLocked : input}
//                           disabled={lockExtras}
//                           readOnly={lockExtras}
//                         />
//                       </td>
//                       <td className="px-2 py-1.5">
//                         <input
//                           type="number"
//                           min={0}
//                           step="0.01"
//                           value={charge.amount}
//                           onChange={(e) =>
//                             updateCharge(
//                               charge.id,
//                               "amount",
//                               Number(e.target.value) || 0,
//                             )
//                           }
//                           className={`${lockExtras ? inputLocked : input} w-24`}
//                           disabled={lockExtras}
//                           readOnly={lockExtras}
//                         />
//                       </td>
//                       <td className="px-2 py-1.5 text-center">
//                         <input
//                           type="checkbox"
//                           checked={!!charge.fuelApply}
//                           onChange={(e) =>
//                             updateCharge(
//                               charge.id,
//                               "fuelApply",
//                               e.target.checked,
//                             )
//                           }
//                           disabled={lockExtras}
//                         />
//                       </td>
//                       <td className="px-2 py-1.5">
//                         <input
//                           type="number"
//                           min={0}
//                           step="0.01"
//                           value={charge.fuelAmt ?? 0}
//                           onChange={(e) =>
//                             updateCharge(
//                               charge.id,
//                               "fuelAmt",
//                               Number(e.target.value) || 0,
//                             )
//                           }
//                           className={`${lockExtras ? inputLocked : input} w-20`}
//                           disabled={lockExtras || !charge.fuelApply}
//                           readOnly={lockExtras}
//                         />
//                       </td>
//                       <td className="px-2 py-1.5 text-center">
//                         <input
//                           type="checkbox"
//                           checked={!!charge.taxApply}
//                           onChange={(e) =>
//                             updateCharge(
//                               charge.id,
//                               "taxApply",
//                               e.target.checked,
//                             )
//                           }
//                           disabled={lockExtras}
//                         />
//                       </td>
//                       <td className="px-2 py-1.5">
//                         <input
//                           type="number"
//                           min={0}
//                           step="0.01"
//                           value={charge.taxOnFuel ?? 0}
//                           onChange={(e) =>
//                             updateCharge(
//                               charge.id,
//                               "taxOnFuel",
//                               Number(e.target.value) || 0,
//                             )
//                           }
//                           className={`${lockExtras ? inputLocked : input} w-20`}
//                           disabled={lockExtras || !charge.taxApply}
//                           readOnly={lockExtras}
//                         />
//                       </td>
//                       <td className="px-2 py-1.5">
//                         <input
//                           type="number"
//                           min={0}
//                           step="0.01"
//                           value={charge.igst ?? 0}
//                           onChange={(e) =>
//                             updateCharge(
//                               charge.id,
//                               "igst",
//                               Number(e.target.value) || 0,
//                             )
//                           }
//                           className={`${lockExtras ? inputLocked : input} w-20`}
//                           disabled={lockExtras}
//                           readOnly={lockExtras}
//                         />
//                       </td>
//                       <td className="px-2 py-1.5">
//                         <input
//                           type="number"
//                           min={0}
//                           step="0.01"
//                           value={charge.sgst ?? 0}
//                           onChange={(e) =>
//                             updateCharge(
//                               charge.id,
//                               "sgst",
//                               Number(e.target.value) || 0,
//                             )
//                           }
//                           className={`${lockExtras ? inputLocked : input} w-20`}
//                           disabled={lockExtras}
//                           readOnly={lockExtras}
//                         />
//                       </td>
//                       <td className="px-2 py-1.5">
//                         <input
//                           type="number"
//                           min={0}
//                           step="0.01"
//                           value={charge.cgst ?? 0}
//                           onChange={(e) =>
//                             updateCharge(
//                               charge.id,
//                               "cgst",
//                               Number(e.target.value) || 0,
//                             )
//                           }
//                           className={`${lockExtras ? inputLocked : input} w-20`}
//                           disabled={lockExtras}
//                           readOnly={lockExtras}
//                         />
//                       </td>
//                       <td className="px-2 py-1.5">
//                         <input
//                           type="number"
//                           value={charge.total ?? 0}
//                           readOnly
//                           className={`${input} w-24 bg-gray-50 font-medium`}
//                         />
//                       </td>
//                       {canManageCharges ? (
//                         <td className="px-2 py-1.5 text-center">
//                           <button
//                             type="button"
//                             onClick={() => removeCharge(charge.id)}
//                             disabled={disabled}
//                             className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
//                           >
//                             <Trash2 className="h-4 w-4" />
//                           </button>
//                         </td>
//                       ) : null}
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>

//         <div className="rounded-xl bg-slate-900 px-5 py-4 text-white">
//           <div className="flex flex-wrap items-center justify-between gap-3">
//             <div className="text-sm text-slate-300">
//               Freight + Fuel + Contract + Other + Lines + Tax − Discount
//             </div>
//             <div className="text-2xl font-bold">
//               ₹{grandTotal.toFixed(2)}
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// "use client";

// import { Plus, Trash2 } from "lucide-react";

// export type ChargeLine = {
//   id: string;
//   description: string;
//   rate?: number;
//   amount: number;
//   fuelApply?: boolean;
//   fuelAmt?: number;
//   taxApply?: boolean;
//   taxOnFuel?: number;
//   igst?: number;
//   sgst?: number;
//   cgst?: number;
//   total?: number;
// };

// export type ChargeDetailsData = {
//   freight: number;
//   fuelSurcharge: number;
//   contractCharges: number;
//   otherCharges: number;
//   additionalCharges: ChargeLine[];
//   discount: number;
//   surcharge: number;
//   cgst: number;
//   sgst: number;
//   igst: number;
// };

// type ChargeDetailsProps = {
//   value: ChargeDetailsData;
//   onChange: (value: ChargeDetailsData) => void;
//   disabled?: boolean;
//   /** Super Admin = full edit; co-loader = freight only + rest read-only */
//   canManageCharges?: boolean;
//   /** e.g. "fedex (4.99%)" from Services Details */
//   selectedVendorLabel?: string;
// };

// export default function ChargeDetails({
//   value,
//   onChange,
//   disabled = false,
//   canManageCharges = false,
//   selectedVendorLabel = "",
// }: ChargeDetailsProps) {
//   // Co-loader: show section, only freight editable
//   const freightOnly = !canManageCharges;
//   const lockExtras = disabled || freightOnly;

//   const update = <K extends keyof ChargeDetailsData>(
//     field: K,
//     fieldValue: ChargeDetailsData[K],
//   ) => {
//     if (freightOnly && field !== "freight") return;
//     onChange({
//       ...value,
//       [field]: fieldValue,
//     });
//   };

//   const addCharge = () => {
//     if (lockExtras) return;
//     update("additionalCharges", [
//       ...value.additionalCharges,
//       {
//         id: crypto.randomUUID(),
//         description: "",
//         rate: 0,
//         amount: 0,
//         fuelApply: false,
//         fuelAmt: 0,
//         taxApply: false,
//         taxOnFuel: 0,
//         igst: 0,
//         sgst: 0,
//         cgst: 0,
//         total: 0,
//       },
//     ]);
//   };

//   const updateCharge = (id: string, patch: Partial<ChargeLine>) => {
//     if (lockExtras) return;
//     update(
//       "additionalCharges",
//       value.additionalCharges.map((c) => {
//         if (c.id !== id) return c;
//         const next = { ...c, ...patch };
//         const amount = Number(next.amount) || 0;
//         const fuelAmt = Number(next.fuelAmt) || 0;
//         const taxOnFuel = Number(next.taxOnFuel) || 0;
//         const igst = Number(next.igst) || 0;
//         const sgst = Number(next.sgst) || 0;
//         const cgst = Number(next.cgst) || 0;
//         next.total = amount + fuelAmt + taxOnFuel + igst + sgst + cgst;
//         return next;
//       }),
//     );
//   };

//   const removeCharge = (id: string) => {
//     if (lockExtras) return;
//     update(
//       "additionalCharges",
//       value.additionalCharges.filter((c) => c.id !== id),
//     );
//   };

//   const additionalTotal = value.additionalCharges.reduce(
//     (sum, c) => sum + (Number(c.total) || Number(c.amount) || 0),
//     0,
//   );

//   const taxTotal =
//     Number(value.igst || 0) + Number(value.cgst || 0) + Number(value.sgst || 0);

//   const grandTotal =
//     Number(value.freight || 0) +
//     Number(value.fuelSurcharge || 0) +
//     Number(value.contractCharges || 0) +
//     Number(value.otherCharges || 0) +
//     Number(value.surcharge || 0) +
//     additionalTotal +
//     taxTotal -
//     Number(value.discount || 0);

//   const input =
//     "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-200";
//   const lockedInput = `${input} bg-slate-50 text-slate-600 cursor-not-allowed`;
//   const freightInput = freightOnly
//     ? `${input} border-teal-400 bg-teal-50/40 font-semibold`
//     : input;

//   return (
//     <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
//       <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
//         <div>
//           <h3 className="text-base font-bold text-[#06284c]">Charge Details</h3>
//           <p className="mt-0.5 text-xs text-slate-500">
//             Fuel surcharge follows the Vendor selected in Services Details.
//           </p>
//         </div>
//         {canManageCharges ? (
//           <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold text-amber-800">
//             SUPER ADMIN
//           </span>
//         ) : (
//           <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600">
//             FREIGHT ONLY
//           </span>
//         )}
//       </div>

//       {selectedVendorLabel ? (
//         <div className="mb-4 rounded-lg border border-teal-100 bg-teal-50 px-3 py-2 text-xs text-teal-800">
//           Vendor: <strong>{selectedVendorLabel}</strong> — fuel surcharge is
//           calculated automatically from freight.
//         </div>
//       ) : (
//         <div className="mb-4 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-xs text-slate-500">
//           Select a Vendor in Services Details to auto-fill Fuel Surcharge.
//         </div>
//       )}

//       <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
//         <div>
//           <label className="mb-1 block text-xs font-semibold text-slate-600">
//             Contract Charges
//           </label>
//           <input
//             type="number"
//             min={0}
//             step="0.01"
//             value={value.contractCharges || 0}
//             onChange={(e) =>
//               update("contractCharges", Number(e.target.value) || 0)
//             }
//             disabled={lockExtras}
//             readOnly={lockExtras}
//             className={lockExtras ? lockedInput : input}
//           />
//         </div>

//         <div>
//           <label className="mb-1 block text-xs font-semibold text-slate-600">
//             Other Charges
//           </label>
//           <input
//             type="number"
//             min={0}
//             step="0.01"
//             value={value.otherCharges || 0}
//             onChange={(e) =>
//               update("otherCharges", Number(e.target.value) || 0)
//             }
//             disabled={lockExtras}
//             readOnly={lockExtras}
//             className={lockExtras ? lockedInput : input}
//           />
//         </div>

//         <div>
//           <label className="mb-1 block text-xs font-semibold text-slate-600">
//             Freight {freightOnly ? "*" : ""}
//           </label>
//           <input
//             type="number"
//             min={0}
//             step="0.01"
//             value={value.freight || 0}
//             onChange={(e) => update("freight", Number(e.target.value) || 0)}
//             disabled={disabled}
//             className={freightInput}
//           />
//         </div>

//         <div>
//           <label className="mb-1 block text-xs font-semibold text-slate-600">
//             Fuel Surcharge (auto)
//           </label>
//           <input
//             type="number"
//             min={0}
//             step="0.01"
//             value={value.fuelSurcharge || 0}
//             readOnly
//             disabled
//             className={lockedInput}
//             title="Auto from Vendor % × Freight"
//           />
//         </div>

//         <div>
//           <label className="mb-1 block text-xs font-semibold text-slate-600">
//             IGST
//           </label>
//           <input
//             type="number"
//             min={0}
//             step="0.01"
//             value={value.igst || 0}
//             onChange={(e) => update("igst", Number(e.target.value) || 0)}
//             disabled={lockExtras}
//             readOnly={lockExtras}
//             className={lockExtras ? lockedInput : input}
//           />
//         </div>

//         <div>
//           <label className="mb-1 block text-xs font-semibold text-slate-600">
//             CGST
//           </label>
//           <input
//             type="number"
//             min={0}
//             step="0.01"
//             value={value.cgst || 0}
//             onChange={(e) => update("cgst", Number(e.target.value) || 0)}
//             disabled={lockExtras}
//             readOnly={lockExtras}
//             className={lockExtras ? lockedInput : input}
//           />
//         </div>

//         <div>
//           <label className="mb-1 block text-xs font-semibold text-slate-600">
//             SGST
//           </label>
//           <input
//             type="number"
//             min={0}
//             step="0.01"
//             value={value.sgst || 0}
//             onChange={(e) => update("sgst", Number(e.target.value) || 0)}
//             disabled={lockExtras}
//             readOnly={lockExtras}
//             className={lockExtras ? lockedInput : input}
//           />
//         </div>

//         <div>
//           <label className="mb-1 block text-xs font-semibold text-slate-600">
//             Discount
//           </label>
//           <input
//             type="number"
//             min={0}
//             step="0.01"
//             value={value.discount || 0}
//             onChange={(e) => update("discount", Number(e.target.value) || 0)}
//             disabled={lockExtras}
//             readOnly={lockExtras}
//             className={lockExtras ? lockedInput : input}
//           />
//         </div>
//       </div>

//       {/* Additional lines — Super Admin only edit */}
//       <div className="mt-5">
//         <div className="mb-2 flex items-center justify-between">
//           <h4 className="text-sm font-bold text-slate-700">
//             Additional Charge Lines
//           </h4>
//           {!lockExtras ? (
//             <button
//               type="button"
//               onClick={addCharge}
//               className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
//             >
//               <Plus className="h-3.5 w-3.5" />
//               Add Line
//             </button>
//           ) : null}
//         </div>

//         {value.additionalCharges.length === 0 ? (
//           <div className="rounded-lg border border-dashed border-slate-200 px-4 py-6 text-center text-xs text-slate-400">
//             No additional charge lines.
//           </div>
//         ) : (
//           <div className="overflow-x-auto rounded-lg border border-slate-200">
//             <table className="min-w-full text-left text-xs">
//               <thead className="bg-slate-50 text-slate-500">
//                 <tr>
//                   <th className="px-3 py-2 font-semibold">Description</th>
//                   <th className="px-3 py-2 font-semibold">Amount</th>
//                   <th className="px-3 py-2 font-semibold">Total</th>
//                   {!lockExtras ? (
//                     <th className="px-3 py-2 font-semibold"> </th>
//                   ) : null}
//                 </tr>
//               </thead>
//               <tbody>
//                 {value.additionalCharges.map((charge) => (
//                   <tr key={charge.id} className="border-t border-slate-100">
//                     <td className="px-3 py-1.5">
//                       <input
//                         value={charge.description}
//                         onChange={(e) =>
//                           updateCharge(charge.id, {
//                             description: e.target.value,
//                           })
//                         }
//                         disabled={lockExtras}
//                         readOnly={lockExtras}
//                         className={lockExtras ? lockedInput : input}
//                       />
//                     </td>
//                     <td className="px-3 py-1.5">
//                       <input
//                         type="number"
//                         value={charge.amount || 0}
//                         onChange={(e) =>
//                           updateCharge(charge.id, {
//                             amount: Number(e.target.value) || 0,
//                           })
//                         }
//                         disabled={lockExtras}
//                         readOnly={lockExtras}
//                         className={`${lockExtras ? lockedInput : input} w-24`}
//                       />
//                     </td>
//                     <td className="px-3 py-1.5">
//                       <input
//                         type="number"
//                         value={charge.total ?? charge.amount ?? 0}
//                         readOnly
//                         className={`${lockedInput} w-24 font-medium`}
//                       />
//                     </td>
//                     {!lockExtras ? (
//                       <td className="px-3 py-1.5 text-center">
//                         <button
//                           type="button"
//                           onClick={() => removeCharge(charge.id)}
//                           className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
//                         >
//                           <Trash2 className="h-4 w-4" />
//                         </button>
//                       </td>
//                     ) : null}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       <div className="mt-5 rounded-xl bg-slate-900 px-5 py-4 text-white">
//         <div className="flex flex-wrap items-center justify-between gap-3">
//           <div className="text-sm text-slate-300">
//             Freight + Fuel + Contract + Other + Lines + Tax − Discount
//           </div>
//           <div className="text-2xl font-bold">
//             ₹
//             {grandTotal.toLocaleString("en-IN", {
//               minimumFractionDigits: 2,
//               maximumFractionDigits: 2,
//             })}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// "use client";

// import { Plus, Trash2 } from "lucide-react";

// export type ChargeLine = {
//   id: string;
//   description: string;
//   rate?: number;
//   amount: number;
//   fuelApply?: boolean;
//   fuelAmt?: number;
//   taxApply?: boolean;
//   taxOnFuel?: number;
//   igst?: number;
//   sgst?: number;
//   cgst?: number;
//   total?: number;
// };

// export type ChargeDetailsData = {
//   freight: number;
//   fuelSurcharge: number;
//   contractCharges: number;
//   otherCharges: number;
//   additionalCharges: ChargeLine[];
//   discount: number;
//   surcharge: number;
//   /** Stored as ₹ amounts (auto-calculated from vendor % × taxable base) */
//   cgst: number;
//   sgst: number;
//   igst: number;
// };

// type ChargeDetailsProps = {
//   value: ChargeDetailsData;
//   onChange: (value: ChargeDetailsData) => void;
//   disabled?: boolean;
//   canManageCharges?: boolean;
//   selectedVendorLabel?: string;
//   /** Vendor GST rates (%) — display only */
//   taxRates?: {
//     cgst?: number;
//     sgst?: number;
//     igst?: number;
//   };
// };

// function formatPct(rate: number | undefined | null): string {
//   if (rate == null || !Number.isFinite(rate) || rate <= 0) return "—";
//   return `${Number(rate)}%`;
// }

// export default function ChargeDetails({
//   value,
//   onChange,
//   disabled = false,
//   canManageCharges = false,
//   selectedVendorLabel = "",
//   taxRates,
// }: ChargeDetailsProps) {
//   const freightOnly = !canManageCharges;
//   const lockExtras = disabled || freightOnly;

//   const update = <K extends keyof ChargeDetailsData>(
//     field: K,
//     fieldValue: ChargeDetailsData[K],
//   ) => {
//     if (freightOnly && field !== "freight") return;
//     onChange({
//       ...value,
//       [field]: fieldValue,
//     });
//   };

//   const addCharge = () => {
//     if (lockExtras) return;
//     update("additionalCharges", [
//       ...value.additionalCharges,
//       {
//         id: crypto.randomUUID(),
//         description: "",
//         rate: 0,
//         amount: 0,
//         fuelApply: false,
//         fuelAmt: 0,
//         taxApply: false,
//         taxOnFuel: 0,
//         igst: 0,
//         sgst: 0,
//         cgst: 0,
//         total: 0,
//       },
//     ]);
//   };

//   const updateCharge = (id: string, patch: Partial<ChargeLine>) => {
//     if (lockExtras) return;
//     update(
//       "additionalCharges",
//       value.additionalCharges.map((c) => {
//         if (c.id !== id) return c;
//         const next = { ...c, ...patch };
//         const amount = Number(next.amount) || 0;
//         const fuelAmt = Number(next.fuelAmt) || 0;
//         const taxOnFuel = Number(next.taxOnFuel) || 0;
//         const igst = Number(next.igst) || 0;
//         const sgst = Number(next.sgst) || 0;
//         const cgst = Number(next.cgst) || 0;
//         next.total = amount + fuelAmt + taxOnFuel + igst + sgst + cgst;
//         return next;
//       }),
//     );
//   };

//   const removeCharge = (id: string) => {
//     if (lockExtras) return;
//     update(
//       "additionalCharges",
//       value.additionalCharges.filter((c) => c.id !== id),
//     );
//   };

//   const additionalTotal = value.additionalCharges.reduce(
//     (sum, c) => sum + (Number(c.total) || Number(c.amount) || 0),
//     0,
//   );

//   const taxTotal =
//     Number(value.igst || 0) + Number(value.cgst || 0) + Number(value.sgst || 0);

//   const grandTotal =
//     Number(value.freight || 0) +
//     Number(value.fuelSurcharge || 0) +
//     Number(value.contractCharges || 0) +
//     Number(value.otherCharges || 0) +
//     Number(value.surcharge || 0) +
//     additionalTotal +
//     taxTotal -
//     Number(value.discount || 0);

//   const input =
//     "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-200";
//   const lockedInput = `${input} bg-slate-50 text-slate-600 cursor-not-allowed`;
//   const freightInput = freightOnly
//     ? `${input} border-teal-400 bg-teal-50/40 font-semibold`
//     : input;
//   const pctBox =
//     "flex h-[38px] w-full items-center rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-800";

//   return (
//     <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
//       <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
//         <div>
//           <h3 className="text-base font-bold text-[#06284c]">Charge Details</h3>
//           <p className="mt-0.5 text-xs text-slate-500">
//             Fuel surcharge and GST % follow the Vendor selected in Services
//             Details. Tax is applied automatically on the grand total.
//           </p>
//         </div>
//         {canManageCharges ? (
//           <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold text-amber-800">
//             SUPER ADMIN
//           </span>
//         ) : (
//           <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600">
//             FREIGHT ONLY
//           </span>
//         )}
//       </div>

//       {selectedVendorLabel ? (
//         <div className="mb-4 rounded-lg border border-teal-100 bg-teal-50 px-3 py-2 text-xs text-teal-800">
//           Vendor: <strong>{selectedVendorLabel}</strong> — fuel % and GST % are
//           taken from this vendor.
//         </div>
//       ) : (
//         <div className="mb-4 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-xs text-slate-500">
//           Select a Vendor in Services Details to auto-fill Fuel Surcharge and
//           GST %.
//         </div>
//       )}

//       <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
//         <div>
//           <label className="mb-1 block text-xs font-semibold text-slate-600">
//             Contract Charges (₹)
//           </label>
//           <input
//             type="number"
//             min={0}
//             step="0.01"
//             value={value.contractCharges || 0}
//             onChange={(e) =>
//               update("contractCharges", Number(e.target.value) || 0)
//             }
//             disabled={lockExtras}
//             readOnly={lockExtras}
//             className={lockExtras ? lockedInput : input}
//           />
//         </div>

//         <div>
//           <label className="mb-1 block text-xs font-semibold text-slate-600">
//             Other Charges (₹)
//           </label>
//           <input
//             type="number"
//             min={0}
//             step="0.01"
//             value={value.otherCharges || 0}
//             onChange={(e) =>
//               update("otherCharges", Number(e.target.value) || 0)
//             }
//             disabled={lockExtras}
//             readOnly={lockExtras}
//             className={lockExtras ? lockedInput : input}
//           />
//         </div>

//         <div>
//           <label className="mb-1 block text-xs font-semibold text-slate-600">
//             Freight {freightOnly ? "*" : ""} (₹)
//           </label>
//           <input
//             type="number"
//             min={0}
//             step="0.01"
//             value={value.freight || 0}
//             onChange={(e) => update("freight", Number(e.target.value) || 0)}
//             disabled={disabled}
//             className={freightInput}
//           />
//         </div>

//         <div>
//           <label className="mb-1 block text-xs font-semibold text-slate-600">
//             Fuel Surcharge (₹, auto)
//           </label>
//           <input
//             type="number"
//             min={0}
//             step="0.01"
//             value={value.fuelSurcharge || 0}
//             readOnly
//             disabled
//             className={lockedInput}
//             title="Auto from Vendor % × Freight"
//           />
//         </div>

//         {/* GST — percentage only (from vendor master) */}
//         <div>
//           <label className="mb-1 block text-xs font-semibold text-slate-600">
//             IGST (%)
//           </label>
//           <div className={pctBox}>{formatPct(taxRates?.igst)}</div>
//         </div>

//         <div>
//           <label className="mb-1 block text-xs font-semibold text-slate-600">
//             CGST (%)
//           </label>
//           <div className={pctBox}>{formatPct(taxRates?.cgst)}</div>
//         </div>

//         <div>
//           <label className="mb-1 block text-xs font-semibold text-slate-600">
//             SGST (%)
//           </label>
//           <div className={pctBox}>{formatPct(taxRates?.sgst)}</div>
//         </div>

//         <div>
//           <label className="mb-1 block text-xs font-semibold text-slate-600">
//             Discount (₹)
//           </label>
//           <input
//             type="number"
//             min={0}
//             step="0.01"
//             value={value.discount || 0}
//             onChange={(e) => update("discount", Number(e.target.value) || 0)}
//             disabled={lockExtras}
//             readOnly={lockExtras}
//             className={lockExtras ? lockedInput : input}
//           />
//         </div>
//       </div>

//       <p className="mt-2 text-[11px] text-slate-400">
//         CGST / SGST / IGST are shown as % from the vendor master. The rupee tax
//         is calculated automatically and included in the grand total below.
//       </p>

//       <div className="mt-5">
//         <div className="mb-2 flex items-center justify-between">
//           <h4 className="text-sm font-bold text-slate-700">
//             Additional Charge Lines
//           </h4>
//           {!lockExtras ? (
//             <button
//               type="button"
//               onClick={addCharge}
//               className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
//             >
//               <Plus className="h-3.5 w-3.5" />
//               Add Line
//             </button>
//           ) : null}
//         </div>

//         {value.additionalCharges.length === 0 ? (
//           <div className="rounded-lg border border-dashed border-slate-200 px-4 py-6 text-center text-xs text-slate-400">
//             No additional charge lines.
//           </div>
//         ) : (
//           <div className="overflow-x-auto rounded-lg border border-slate-200">
//             <table className="min-w-full text-left text-xs">
//               <thead className="bg-slate-50 text-slate-500">
//                 <tr>
//                   <th className="px-3 py-2 font-semibold">Description</th>
//                   <th className="px-3 py-2 font-semibold">Amount (₹)</th>
//                   <th className="px-3 py-2 font-semibold">Total (₹)</th>
//                   {!lockExtras ? (
//                     <th className="px-3 py-2 font-semibold"> </th>
//                   ) : null}
//                 </tr>
//               </thead>
//               <tbody>
//                 {value.additionalCharges.map((charge) => (
//                   <tr key={charge.id} className="border-t border-slate-100">
//                     <td className="px-3 py-1.5">
//                       <input
//                         value={charge.description}
//                         onChange={(e) =>
//                           updateCharge(charge.id, {
//                             description: e.target.value,
//                           })
//                         }
//                         disabled={lockExtras}
//                         readOnly={lockExtras}
//                         className={lockExtras ? lockedInput : input}
//                       />
//                     </td>
//                     <td className="px-3 py-1.5">
//                       <input
//                         type="number"
//                         value={charge.amount || 0}
//                         onChange={(e) =>
//                           updateCharge(charge.id, {
//                             amount: Number(e.target.value) || 0,
//                           })
//                         }
//                         disabled={lockExtras}
//                         readOnly={lockExtras}
//                         className={`${lockExtras ? lockedInput : input} w-24`}
//                       />
//                     </td>
//                     <td className="px-3 py-1.5">
//                       <input
//                         type="number"
//                         value={charge.total ?? charge.amount ?? 0}
//                         readOnly
//                         className={`${lockedInput} w-24 font-medium`}
//                       />
//                     </td>
//                     {!lockExtras ? (
//                       <td className="px-3 py-1.5 text-center">
//                         <button
//                           type="button"
//                           onClick={() => removeCharge(charge.id)}
//                           className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
//                         >
//                           <Trash2 className="h-4 w-4" />
//                         </button>
//                       </td>
//                     ) : null}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       <div className="mt-5 rounded-xl bg-slate-900 px-5 py-4 text-white">
//         <div className="flex flex-wrap items-center justify-between gap-3">
//           <div className="text-sm text-slate-300">
//             Freight + Fuel + Contract + Other + Lines + Tax − Discount
//           </div>
//           <div className="text-2xl font-bold">
//             ₹
//             {grandTotal.toLocaleString("en-IN", {
//               minimumFractionDigits: 2,
//               maximumFractionDigits: 2,
//             })}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// "use client";

// import { Plus, Trash2 } from "lucide-react";

// export type ChargeLine = {
//   id: string;
//   description: string;
//   rate?: number;
//   amount: number;
//   fuelApply?: boolean;
//   fuelAmt?: number;
//   taxApply?: boolean;
//   taxOnFuel?: number;
//   igst?: number;
//   sgst?: number;
//   cgst?: number;
//   total?: number;
// };

// export type ChargeDetailsData = {
//   freight: number;
//   fuelSurcharge: number;
//   contractCharges: number;
//   otherCharges: number;
//   additionalCharges: ChargeLine[];
//   discount: number;
//   surcharge: number;
//   /** ₹ amounts auto-calculated from vendor % × taxable base */
//   cgst: number;
//   sgst: number;
//   igst: number;
// };

// /** Flag lines — amount set by admin only */
// export const FLAG_CHARGE_DESCRIPTIONS = new Set([
//   "Commercial Charges",
//   "ODA Charges",
//   "Medical Charges",
// ]);

// type ChargeDetailsProps = {
//   value: ChargeDetailsData;
//   onChange: (value: ChargeDetailsData) => void;
//   disabled?: boolean;
//   canManageCharges?: boolean;
//   selectedVendorLabel?: string;
//   /** Vendor GST rates (%) — display only */
//   taxRates?: {
//     cgst?: number;
//     sgst?: number;
//     igst?: number;
//   };
// };

// function formatPct(rate: number | undefined | null): string {
//   if (rate == null || !Number.isFinite(rate) || rate <= 0) return "—";
//   return `${Number(rate)}%`;
// }

// export default function ChargeDetails({
//   value,
//   onChange,
//   disabled = false,
//   canManageCharges = false,
//   selectedVendorLabel = "",
//   taxRates,
// }: ChargeDetailsProps) {
//   const freightOnly = !canManageCharges;
//   const lockExtras = disabled || freightOnly;

//   const update = <K extends keyof ChargeDetailsData>(
//     field: K,
//     fieldValue: ChargeDetailsData[K],
//   ) => {
//     if (freightOnly && field !== "freight") return;
//     onChange({
//       ...value,
//       [field]: fieldValue,
//     });
//   };

//   const addCharge = () => {
//     if (lockExtras) return;
//     update("additionalCharges", [
//       ...value.additionalCharges,
//       {
//         id: crypto.randomUUID(),
//         description: "",
//         rate: 0,
//         amount: 0,
//         fuelApply: false,
//         fuelAmt: 0,
//         taxApply: false,
//         taxOnFuel: 0,
//         igst: 0,
//         sgst: 0,
//         cgst: 0,
//         total: 0,
//       },
//     ]);
//   };

//   const updateCharge = (id: string, patch: Partial<ChargeLine>) => {
//     if (lockExtras) return;

//     update(
//       "additionalCharges",
//       value.additionalCharges.map((c) => {
//         if (c.id !== id) return c;

//         const isFlag = FLAG_CHARGE_DESCRIPTIONS.has(
//           String(c.description || ""),
//         );

//         // Agents cannot change flag-line amounts
//         if (isFlag && !canManageCharges && patch.amount !== undefined) {
//           return c;
//         }

//         // Flag line description is fixed
//         if (isFlag && patch.description !== undefined) {
//           const { description: _d, ...rest } = patch;
//           patch = rest;
//         }

//         const next = { ...c, ...patch };
//         const amount = Number(next.amount) || 0;
//         const fuelAmt = Number(next.fuelAmt) || 0;
//         const taxOnFuel = Number(next.taxOnFuel) || 0;
//         const igst = Number(next.igst) || 0;
//         const sgst = Number(next.sgst) || 0;
//         const cgst = Number(next.cgst) || 0;
//         next.total = amount + fuelAmt + taxOnFuel + igst + sgst + cgst;
//         return next;
//       }),
//     );
//   };

//   const removeCharge = (id: string) => {
//     if (lockExtras) return;
//     const line = value.additionalCharges.find((c) => c.id === id);
//     if (
//       line &&
//       FLAG_CHARGE_DESCRIPTIONS.has(String(line.description || ""))
//     ) {
//       // Flag lines are removed only by unticking the checkbox in Services Details
//       return;
//     }
//     update(
//       "additionalCharges",
//       value.additionalCharges.filter((c) => c.id !== id),
//     );
//   };

//   const additionalTotal = value.additionalCharges.reduce(
//     (sum, c) => sum + (Number(c.total) || Number(c.amount) || 0),
//     0,
//   );

//   const taxTotal =
//     Number(value.igst || 0) + Number(value.cgst || 0) + Number(value.sgst || 0);

//   const grandTotal =
//     Number(value.freight || 0) +
//     Number(value.fuelSurcharge || 0) +
//     Number(value.contractCharges || 0) +
//     Number(value.otherCharges || 0) +
//     Number(value.surcharge || 0) +
//     additionalTotal +
//     taxTotal -
//     Number(value.discount || 0);

//   const input =
//     "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-200";
//   const lockedInput = `${input} bg-slate-50 text-slate-600 cursor-not-allowed`;
//   const freightInput = freightOnly
//     ? `${input} border-teal-400 bg-teal-50/40 font-semibold`
//     : input;
//   const pctBox =
//     "flex h-[38px] w-full items-center rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-800";

//   return (
//     <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
//       <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
//         <div>
//           <h3 className="text-base font-bold text-[#06284c]">Charge Details</h3>
//           <p className="mt-0.5 text-xs text-slate-500">
//             Fuel surcharge and GST % follow the Vendor selected in Services
//             Details. Tax is applied automatically on the grand total.
//           </p>
//         </div>
//         {canManageCharges ? (
//           <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold text-amber-800">
//             SUPER ADMIN
//           </span>
//         ) : (
//           <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600">
//             FREIGHT ONLY
//           </span>
//         )}
//       </div>

//       {selectedVendorLabel ? (
//         <div className="mb-4 rounded-lg border border-teal-100 bg-teal-50 px-3 py-2 text-xs text-teal-800">
//           Vendor: <strong>{selectedVendorLabel}</strong> — fuel % and GST % are
//           taken from this vendor.
//         </div>
//       ) : (
//         <div className="mb-4 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-xs text-slate-500">
//           Select a Vendor in Services Details to auto-fill Fuel Surcharge and
//           GST %.
//         </div>
//       )}

//       <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
//         <div>
//           <label className="mb-1 block text-xs font-semibold text-slate-600">
//             Contract Charges (₹)
//           </label>
//           <input
//             type="number"
//             min={0}
//             step="0.01"
//             value={value.contractCharges || 0}
//             onChange={(e) =>
//               update("contractCharges", Number(e.target.value) || 0)
//             }
//             disabled={lockExtras}
//             readOnly={lockExtras}
//             className={lockExtras ? lockedInput : input}
//           />
//         </div>

//         <div>
//           <label className="mb-1 block text-xs font-semibold text-slate-600">
//             Other Charges (₹)
//           </label>
//           <input
//             type="number"
//             min={0}
//             step="0.01"
//             value={value.otherCharges || 0}
//             onChange={(e) =>
//               update("otherCharges", Number(e.target.value) || 0)
//             }
//             disabled={lockExtras}
//             readOnly={lockExtras}
//             className={lockExtras ? lockedInput : input}
//           />
//         </div>

//         <div>
//           <label className="mb-1 block text-xs font-semibold text-slate-600">
//             Freight {freightOnly ? "*" : ""} (₹)
//           </label>
//           <input
//             type="number"
//             min={0}
//             step="0.01"
//             value={value.freight || 0}
//             onChange={(e) => update("freight", Number(e.target.value) || 0)}
//             disabled={disabled}
//             className={freightInput}
//           />
//         </div>

//         <div>
//           <label className="mb-1 block text-xs font-semibold text-slate-600">
//             Fuel Surcharge (₹, auto)
//           </label>
//           <input
//             type="number"
//             min={0}
//             step="0.01"
//             value={value.fuelSurcharge || 0}
//             readOnly
//             disabled
//             className={lockedInput}
//             title="Auto from Vendor % × Freight"
//           />
//         </div>

//         <div>
//           <label className="mb-1 block text-xs font-semibold text-slate-600">
//             IGST (%)
//           </label>
//           <div className={pctBox}>{formatPct(taxRates?.igst)}</div>
//         </div>

//         <div>
//           <label className="mb-1 block text-xs font-semibold text-slate-600">
//             CGST (%)
//           </label>
//           <div className={pctBox}>{formatPct(taxRates?.cgst)}</div>
//         </div>

//         <div>
//           <label className="mb-1 block text-xs font-semibold text-slate-600">
//             SGST (%)
//           </label>
//           <div className={pctBox}>{formatPct(taxRates?.sgst)}</div>
//         </div>

//         <div>
//           <label className="mb-1 block text-xs font-semibold text-slate-600">
//             Discount (₹)
//           </label>
//           <input
//             type="number"
//             min={0}
//             step="0.01"
//             value={value.discount || 0}
//             onChange={(e) => update("discount", Number(e.target.value) || 0)}
//             disabled={lockExtras}
//             readOnly={lockExtras}
//             className={lockExtras ? lockedInput : input}
//           />
//         </div>
//       </div>

//       <p className="mt-2 text-[11px] text-slate-400">
//         CGST / SGST / IGST are shown as % from the vendor master. Rupee tax is
//         calculated automatically and included in the grand total.
//       </p>

//       <div className="mt-5">
//         <div className="mb-2 flex items-center justify-between">
//           <h4 className="text-sm font-bold text-slate-700">
//             Additional Charge Lines
//           </h4>
//           {!lockExtras ? (
//             <button
//               type="button"
//               onClick={addCharge}
//               className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
//             >
//               <Plus className="h-3.5 w-3.5" />
//               Add Line
//             </button>
//           ) : null}
//         </div>

//         {value.additionalCharges.length === 0 ? (
//           <div className="rounded-lg border border-dashed border-slate-200 px-4 py-6 text-center text-xs text-slate-400">
//             No additional charge lines. Tick Commercial / ODA / Medical in
//             Services Details to add admin-priced lines.
//           </div>
//         ) : (
//           <div className="overflow-x-auto rounded-lg border border-slate-200">
//             <table className="min-w-full text-left text-xs">
//               <thead className="bg-slate-50 text-slate-500">
//                 <tr>
//                   <th className="px-3 py-2 font-semibold">Description</th>
//                   <th className="px-3 py-2 font-semibold">Amount (₹)</th>
//                   <th className="px-3 py-2 font-semibold">Total (₹)</th>
//                   {!lockExtras ? (
//                     <th className="px-3 py-2 font-semibold"> </th>
//                   ) : null}
//                 </tr>
//               </thead>
//               <tbody>
//                 {value.additionalCharges.map((charge) => {
//                   const isFlag = FLAG_CHARGE_DESCRIPTIONS.has(
//                     String(charge.description || ""),
//                   );
//                   const amountLocked =
//                     lockExtras || (isFlag && !canManageCharges);
//                   const descLocked = lockExtras || isFlag;

//                   return (
//                     <tr key={charge.id} className="border-t border-slate-100">
//                       <td className="px-3 py-1.5">
//                         <input
//                           value={charge.description}
//                           onChange={(e) =>
//                             updateCharge(charge.id, {
//                               description: e.target.value,
//                             })
//                           }
//                           disabled={descLocked}
//                           readOnly={descLocked}
//                           className={descLocked ? lockedInput : input}
//                         />
//                       </td>
//                       <td className="px-3 py-1.5">
//                         <input
//                           type="number"
//                           value={charge.amount || 0}
//                           onChange={(e) =>
//                             updateCharge(charge.id, {
//                               amount: Number(e.target.value) || 0,
//                             })
//                           }
//                           disabled={amountLocked}
//                           readOnly={amountLocked}
//                           className={`${amountLocked ? lockedInput : input} w-24`}
//                           title={
//                             isFlag && !canManageCharges
//                               ? "Amount set by admin only"
//                               : undefined
//                           }
//                         />
//                       </td>
//                       <td className="px-3 py-1.5">
//                         <input
//                           type="number"
//                           value={charge.total ?? charge.amount ?? 0}
//                           readOnly
//                           className={`${lockedInput} w-24 font-medium`}
//                         />
//                       </td>
//                       {!lockExtras ? (
//                         <td className="px-3 py-1.5 text-center">
//                           {!isFlag ? (
//                             <button
//                               type="button"
//                               onClick={() => removeCharge(charge.id)}
//                               className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
//                             >
//                               <Trash2 className="h-4 w-4" />
//                             </button>
//                           ) : (
//                             <span className="text-[10px] text-slate-400">
//                               via checkbox
//                             </span>
//                           )}
//                         </td>
//                       ) : null}
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       <div className="mt-5 rounded-xl bg-slate-900 px-5 py-4 text-white">
//         <div className="flex flex-wrap items-center justify-between gap-3">
//           <div className="text-sm text-slate-300">
//             Freight + Fuel + Contract + Other + Lines + Tax − Discount
//           </div>
//           <div className="text-2xl font-bold">
//             ₹
//             {grandTotal.toLocaleString("en-IN", {
//               minimumFractionDigits: 2,
//               maximumFractionDigits: 2,
//             })}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";

import { Plus, Trash2 } from "lucide-react";

export type ChargeLine = {
  id: string;
  description: string;
  rate?: number;
  amount: number;
  fuelApply?: boolean;
  fuelAmt?: number;
  taxApply?: boolean;
  taxOnFuel?: number;
  igst?: number;
  sgst?: number;
  cgst?: number;
  total?: number;
};

export type ChargeDetailsData = {
  freight: number;
  fuelSurcharge: number;
  contractCharges: number;
  otherCharges: number;
  additionalCharges: ChargeLine[];
  discount: number;
  surcharge: number;
  cgst: number;
  sgst: number;
  igst: number;
};

export const FLAG_CHARGE_DESCRIPTIONS = new Set([
  "Commercial Charges",
  "ODA Charges",
  "Medical Charges",
]);

type ChargeDetailsProps = {
  value: ChargeDetailsData;
  onChange: (value: ChargeDetailsData) => void;
  disabled?: boolean;
  canManageCharges?: boolean;
  selectedVendorLabel?: string;
  taxRates?: { cgst?: number; sgst?: number; igst?: number };
  /** From Masters → Currencies (selected shipment currency) */
  currencyCode?: string;
  currencySymbol?: string;
};

function formatPct(rate: number | undefined | null): string {
  if (rate == null || !Number.isFinite(rate) || rate <= 0) return "—";
  return `${Number(rate)}%`;
}

export default function ChargeDetails({
  value,
  onChange,
  disabled = false,
  canManageCharges = false,
  selectedVendorLabel = "",
  taxRates,
  currencyCode = "INR",
  currencySymbol = "₹",
}: ChargeDetailsProps) {
  const freightOnly = !canManageCharges;
  const lockExtras = disabled || freightOnly;
  const sym = currencySymbol || currencyCode || "₹";
  const unit = `(${sym})`;

  const update = <K extends keyof ChargeDetailsData>(
    field: K,
    fieldValue: ChargeDetailsData[K],
  ) => {
    if (freightOnly && field !== "freight") return;
    onChange({ ...value, [field]: fieldValue });
  };

  const addCharge = () => {
    if (lockExtras) return;
    update("additionalCharges", [
      ...value.additionalCharges,
      {
        id: crypto.randomUUID(),
        description: "",
        rate: 0,
        amount: 0,
        fuelApply: false,
        fuelAmt: 0,
        taxApply: false,
        taxOnFuel: 0,
        igst: 0,
        sgst: 0,
        cgst: 0,
        total: 0,
      },
    ]);
  };

  const updateCharge = (id: string, patch: Partial<ChargeLine>) => {
    if (lockExtras) return;
    update(
      "additionalCharges",
      value.additionalCharges.map((c) => {
        if (c.id !== id) return c;
        const isFlag = FLAG_CHARGE_DESCRIPTIONS.has(String(c.description || ""));
        if (isFlag && !canManageCharges && patch.amount !== undefined) return c;
        if (isFlag && patch.description !== undefined) {
          const { description: _d, ...rest } = patch;
          patch = rest;
        }
        const next = { ...c, ...patch };
        const amount = Number(next.amount) || 0;
        const fuelAmt = Number(next.fuelAmt) || 0;
        const taxOnFuel = Number(next.taxOnFuel) || 0;
        const igst = Number(next.igst) || 0;
        const sgst = Number(next.sgst) || 0;
        const cgst = Number(next.cgst) || 0;
        next.total = amount + fuelAmt + taxOnFuel + igst + sgst + cgst;
        return next;
      }),
    );
  };

  const removeCharge = (id: string) => {
    if (lockExtras) return;
    const line = value.additionalCharges.find((c) => c.id === id);
    if (line && FLAG_CHARGE_DESCRIPTIONS.has(String(line.description || ""))) {
      return;
    }
    update(
      "additionalCharges",
      value.additionalCharges.filter((c) => c.id !== id),
    );
  };

  const additionalTotal = value.additionalCharges.reduce(
    (sum, c) => sum + (Number(c.total) || Number(c.amount) || 0),
    0,
  );
  const taxTotal =
    Number(value.igst || 0) + Number(value.cgst || 0) + Number(value.sgst || 0);
  const grandTotal =
    Number(value.freight || 0) +
    Number(value.fuelSurcharge || 0) +
    Number(value.contractCharges || 0) +
    Number(value.otherCharges || 0) +
    Number(value.surcharge || 0) +
    additionalTotal +
    taxTotal -
    Number(value.discount || 0);

  const input =
    "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-200";
  const lockedInput = `${input} bg-slate-50 text-slate-600 cursor-not-allowed`;
  const freightInput = freightOnly
    ? `${input} border-teal-400 bg-teal-50/40 font-semibold`
    : input;
  const pctBox =
    "flex h-[38px] w-full items-center rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-800";

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-[#06284c]">Charge Details</h3>
          <p className="mt-0.5 text-xs text-slate-500">
            Amounts in <strong>{currencyCode}</strong> ({sym}). Fuel % and GST %
            follow the selected vendor.
          </p>
        </div>
        {canManageCharges ? (
          <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold text-amber-800">
            SUPER ADMIN
          </span>
        ) : (
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600">
            FREIGHT ONLY
          </span>
        )}
      </div>

      {selectedVendorLabel ? (
        <div className="mb-4 rounded-lg border border-teal-100 bg-teal-50 px-3 py-2 text-xs text-teal-800">
          Vendor: <strong>{selectedVendorLabel}</strong>
        </div>
      ) : (
        <div className="mb-4 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-xs text-slate-500">
          Select a Vendor in Services Details to auto-fill Fuel Surcharge and GST %.
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-600">
            Contract Charges {unit}
          </label>
          <input
            type="number"
            min={0}
            step="0.01"
            value={value.contractCharges || 0}
            onChange={(e) => update("contractCharges", Number(e.target.value) || 0)}
            disabled={lockExtras}
            readOnly={lockExtras}
            className={lockExtras ? lockedInput : input}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-600">
            Other Charges {unit}
          </label>
          <input
            type="number"
            min={0}
            step="0.01"
            value={value.otherCharges || 0}
            onChange={(e) => update("otherCharges", Number(e.target.value) || 0)}
            disabled={lockExtras}
            readOnly={lockExtras}
            className={lockExtras ? lockedInput : input}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-600">
            Freight {freightOnly ? "*" : ""} {unit}
          </label>
          <input
            type="number"
            min={0}
            step="0.01"
            value={value.freight || 0}
            onChange={(e) => update("freight", Number(e.target.value) || 0)}
            disabled={disabled}
            className={freightInput}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-600">
            Fuel Surcharge {unit}, auto
          </label>
          <input
            type="number"
            min={0}
            step="0.01"
            value={value.fuelSurcharge || 0}
            readOnly
            disabled
            className={lockedInput}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-600">IGST (%)</label>
          <div className={pctBox}>{formatPct(taxRates?.igst)}</div>
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-600">CGST (%)</label>
          <div className={pctBox}>{formatPct(taxRates?.cgst)}</div>
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-600">SGST (%)</label>
          <div className={pctBox}>{formatPct(taxRates?.sgst)}</div>
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-600">
            Discount {unit}
          </label>
          <input
            type="number"
            min={0}
            step="0.01"
            value={value.discount || 0}
            onChange={(e) => update("discount", Number(e.target.value) || 0)}
            disabled={lockExtras}
            readOnly={lockExtras}
            className={lockExtras ? lockedInput : input}
          />
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-700">Additional Charge Lines</h4>
          {!lockExtras ? (
            <button
              type="button"
              onClick={addCharge}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Line
            </button>
          ) : null}
        </div>

        {value.additionalCharges.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-200 px-4 py-6 text-center text-xs text-slate-400">
            No additional charge lines.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="min-w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-3 py-2 font-semibold">Description</th>
                  <th className="px-3 py-2 font-semibold">Amount {unit}</th>
                  <th className="px-3 py-2 font-semibold">Total {unit}</th>
                  {!lockExtras ? <th className="px-3 py-2" /> : null}
                </tr>
              </thead>
              <tbody>
                {value.additionalCharges.map((charge) => {
                  const isFlag = FLAG_CHARGE_DESCRIPTIONS.has(
                    String(charge.description || ""),
                  );
                  const amountLocked = lockExtras || (isFlag && !canManageCharges);
                  const descLocked = lockExtras || isFlag;
                  return (
                    <tr key={charge.id} className="border-t border-slate-100">
                      <td className="px-3 py-1.5">
                        <input
                          value={charge.description}
                          onChange={(e) =>
                            updateCharge(charge.id, { description: e.target.value })
                          }
                          disabled={descLocked}
                          readOnly={descLocked}
                          className={descLocked ? lockedInput : input}
                        />
                      </td>
                      <td className="px-3 py-1.5">
                        <input
                          type="number"
                          value={charge.amount || 0}
                          onChange={(e) =>
                            updateCharge(charge.id, {
                              amount: Number(e.target.value) || 0,
                            })
                          }
                          disabled={amountLocked}
                          readOnly={amountLocked}
                          className={`${amountLocked ? lockedInput : input} w-24`}
                        />
                      </td>
                      <td className="px-3 py-1.5">
                        <input
                          type="number"
                          value={charge.total ?? charge.amount ?? 0}
                          readOnly
                          className={`${lockedInput} w-24 font-medium`}
                        />
                      </td>
                      {!lockExtras ? (
                        <td className="px-3 py-1.5 text-center">
                          {!isFlag ? (
                            <button
                              type="button"
                              onClick={() => removeCharge(charge.id)}
                              className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-400">via checkbox</span>
                          )}
                        </td>
                      ) : null}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

            <div className="mt-5 rounded-xl bg-slate-900 px-5 py-4 text-white">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-slate-300">
            Contract + Other + Freight + Fuel + Lines + Tax − Discount
          </div>
          <div className="text-2xl font-bold">
            {sym}
            {grandTotal.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        </div>
      </div>
    </section>
  );
}