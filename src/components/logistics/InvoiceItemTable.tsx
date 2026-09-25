// "use client";

// import { Plus, Trash2 } from "lucide-react";
// import HsCodeSelect from "./HsCodeSelect";

// export type InvoiceLineItemForm = {
//   id: string;
//   boxNo?: number;
//   packages?: number;
//   description: string;
//   shopName?: string;
//   shopAddress?: string;
//   hsCode: string;
//   quantity: number;
//   weight?: number;
//   unit: "PCS" | "KG" | "SET" | "BOX";
//   unitRate: number;
//   amount: number;
//   igstPercent?: number;
//   igstAmount?: number;
// };

// type InvoiceItemTableProps = {
//   items: InvoiceLineItemForm[];
//   onChange: (items: InvoiceLineItemForm[]) => void;
//   disabled?: boolean;
// };

// export default function InvoiceItemTable({
//   items,
//   onChange,
//   disabled = false,
// }: InvoiceItemTableProps) {
//   const addItem = () => {
//     onChange([
//       ...items,
//       {
//         id: crypto.randomUUID(),
//         boxNo: items.length + 1,
//         packages: 1,
//         description: "",
//         shopName: "",
//         shopAddress: "",
//         hsCode: "",
//         quantity: 1,
//         weight: 0,
//         unit: "PCS",
//         unitRate: 0,
//         amount: 0,
//         igstPercent: 0,
//         igstAmount: 0,
//       },
//     ]);
//   };

//   const updateItem = (
//     id: string,
//     field: keyof InvoiceLineItemForm,
//     value: string | number,
//   ) => {
//     onChange(
//       items.map((item) => {
//         if (item.id !== id) return item;

//         const next = { ...item, [field]: value };

//         // Auto-calculate amount
//         if (field === "quantity" || field === "unitRate") {
//           const qty =
//             field === "quantity" ? Number(value) : Number(next.quantity);
//           const rate =
//             field === "unitRate" ? Number(value) : Number(next.unitRate);
//           next.amount = Number((qty * rate).toFixed(2));
//         }

//         // Auto-calculate IGST amount
//         if (
//           field === "igstPercent" ||
//           field === "quantity" ||
//           field === "unitRate"
//         ) {
//           const percent = Number(next.igstPercent || 0);
//           next.igstAmount = Number(
//             ((next.amount * percent) / 100).toFixed(2),
//           );
//         }

//         return next;
//       }),
//     );
//   };

//   const removeItem = (id: string) => {
//     onChange(items.filter((item) => item.id !== id));
//   };

//   const totals = items.reduce(
//     (acc, item) => {
//       acc.quantity += Number(item.quantity || 0);
//       acc.weight += Number(item.weight || 0);
//       acc.amount += Number(item.amount || 0);
//       acc.igst += Number(item.igstAmount || 0);
//       return acc;
//     },
//     { quantity: 0, weight: 0, amount: 0, igst: 0 },
//   );

//   const input =
//     "h-9 w-full rounded border px-2 text-sm outline-none focus:border-slate-500 disabled:bg-gray-50";

//   return (
//     <section className="rounded-xl border bg-white">
//       <div className="flex flex-col justify-between gap-3 border-b px-5 py-4 sm:flex-row sm:items-center">
//         <div>
//           <h2 className="font-semibold text-gray-900">
//             Performa / Invoice Items
//           </h2>
//           <p className="mt-1 text-xs text-gray-500">
//             Add item description, shop details, HS code, quantity and rate.
//           </p>
//         </div>

//         <button
//           type="button"
//           onClick={addItem}
//           disabled={disabled}
//           className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
//         >
//           <Plus className="h-4 w-4" />
//           Add Item
//         </button>
//       </div>

//       <div className="overflow-x-auto p-5">
//         {items.length === 0 ? (
//           <div className="rounded-lg border border-dashed p-8 text-center">
//             <p className="text-sm text-gray-500">No invoice items added.</p>
//             <button
//               type="button"
//               onClick={addItem}
//               className="mt-3 text-sm font-semibold text-slate-900 hover:underline"
//             >
//               Add the first item
//             </button>
//           </div>
//         ) : (
//           <table className="w-full min-w-[1100px] border-collapse text-sm">
//             <thead>
//               <tr className="bg-slate-900 text-left text-xs font-semibold uppercase tracking-wide text-white">
//                 <th className="px-3 py-2.5">Box</th>
//                 <th className="px-3 py-2.5">Description</th>
//                 <th className="px-3 py-2.5">Shop Name</th>
//                 <th className="px-3 py-2.5">Shop Address</th>
//                 <th className="px-3 py-2.5">HS Code</th>
//                 <th className="px-3 py-2.5">Qty</th>
//                 <th className="px-3 py-2.5">Weight</th>
//                 <th className="px-3 py-2.5">Unit</th>
//                 <th className="px-3 py-2.5">Rate</th>
//                 <th className="px-3 py-2.5">Amount</th>
//                 <th className="px-3 py-2.5">IGST %</th>
//                 <th className="px-3 py-2.5">IGST Amt</th>
//                 <th className="px-3 py-2.5 w-12" />
//               </tr>
//             </thead>

//             <tbody>
//               {items.map((item, index) => (
//                 <tr
//                   key={item.id}
//                   className="border-b border-gray-100 odd:bg-gray-50/60"
//                 >
//                   <td className="px-2 py-2">
//                     <input
//                       type="number"
//                       min={1}
//                       value={item.boxNo ?? index + 1}
//                       onChange={(e) =>
//                         updateItem(item.id, "boxNo", Number(e.target.value))
//                       }
//                       className={input + " w-16"}
//                       disabled={disabled}
//                     />
//                   </td>

//                   <td className="px-2 py-2 min-w-[180px]">
//                     <input
//                       value={item.description}
//                       onChange={(e) =>
//                         updateItem(item.id, "description", e.target.value)
//                       }
//                       placeholder="Item description"
//                       className={input}
//                       disabled={disabled}
//                     />
//                   </td>

//                   <td className="px-2 py-2 min-w-[140px]">
//                     <input
//                       value={item.shopName ?? ""}
//                       onChange={(e) =>
//                         updateItem(item.id, "shopName", e.target.value)
//                       }
//                       placeholder="Shop name"
//                       className={input}
//                       disabled={disabled}
//                     />
//                   </td>

//                   <td className="px-2 py-2 min-w-[180px]">
//                     <input
//                       value={item.shopAddress ?? ""}
//                       onChange={(e) =>
//                         updateItem(item.id, "shopAddress", e.target.value)
//                       }
//                       placeholder="Shop address"
//                       className={input}
//                       disabled={disabled}
//                     />
//                   </td>

//                   <td className="px-2 py-2 min-w-[130px]">
//                     <HsCodeSelect
//                       value={item.hsCode}
//                       onChange={(code) =>
//                         updateItem(item.id, "hsCode", code)
//                       }
//                       disabled={disabled}
//                     />
//                   </td>

//                   <td className="px-2 py-2">
//                     <input
//                       type="number"
//                       min={0}
//                       step="1"
//                       value={item.quantity}
//                       onChange={(e) =>
//                         updateItem(item.id, "quantity", Number(e.target.value))
//                       }
//                       className={input + " w-20"}
//                       disabled={disabled}
//                     />
//                   </td>

//                   <td className="px-2 py-2">
//                     <input
//                       type="number"
//                       min={0}
//                       step="0.001"
//                       value={item.weight ?? ""}
//                       onChange={(e) =>
//                         updateItem(item.id, "weight", Number(e.target.value))
//                       }
//                       className={input + " w-20"}
//                       disabled={disabled}
//                     />
//                   </td>

//                   <td className="px-2 py-2">
//                     <select
//                       value={item.unit}
//                       onChange={(e) =>
//                         updateItem(
//                           item.id,
//                           "unit",
//                           e.target.value as InvoiceLineItemForm["unit"],
//                         )
//                       }
//                       className={input + " w-20"}
//                       disabled={disabled}
//                     >
//                       <option value="PCS">PCS</option>
//                       <option value="KG">KG</option>
//                       <option value="SET">SET</option>
//                       <option value="BOX">BOX</option>
//                     </select>
//                   </td>

//                   <td className="px-2 py-2">
//                     <input
//                       type="number"
//                       min={0}
//                       step="0.01"
//                       value={item.unitRate}
//                       onChange={(e) =>
//                         updateItem(item.id, "unitRate", Number(e.target.value))
//                       }
//                       className={input + " w-24"}
//                       disabled={disabled}
//                     />
//                   </td>

//                   <td className="px-2 py-2">
//                     <input
//                       type="number"
//                       value={item.amount}
//                       readOnly
//                       className={input + " w-24 bg-gray-50"}
//                     />
//                   </td>

//                   <td className="px-2 py-2">
//                     <input
//                       type="number"
//                       min={0}
//                       step="0.01"
//                       value={item.igstPercent ?? 0}
//                       onChange={(e) =>
//                         updateItem(
//                           item.id,
//                           "igstPercent",
//                           Number(e.target.value),
//                         )
//                       }
//                       className={input + " w-20"}
//                       disabled={disabled}
//                     />
//                   </td>

//                   <td className="px-2 py-2">
//                     <input
//                       type="number"
//                       value={item.igstAmount ?? 0}
//                       readOnly
//                       className={input + " w-24 bg-gray-50"}
//                     />
//                   </td>

//                   <td className="px-2 py-2 text-center">
//                     <button
//                       type="button"
//                       onClick={() => removeItem(item.id)}
//                       disabled={disabled}
//                       className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
//                     >
//                       <Trash2 className="h-4 w-4" />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>

//             <tfoot>
//               <tr className="bg-slate-100 font-semibold">
//                 <td colSpan={5} className="px-3 py-2.5 text-right">
//                   Totals
//                 </td>
//                 <td className="px-3 py-2.5">{totals.quantity}</td>
//                 <td className="px-3 py-2.5">
//                   {totals.weight.toFixed(3)}
//                 </td>
//                 <td />
//                 <td />
//                 <td className="px-3 py-2.5">
//                   ₹{totals.amount.toFixed(2)}
//                 </td>
//                 <td />
//                 <td className="px-3 py-2.5">
//                   ₹{totals.igst.toFixed(2)}
//                 </td>
//                 <td />
//               </tr>
//             </tfoot>
//           </table>
//         )}
//       </div>
//     </section>
//   );
// }

// "use client";

// import { Plus, Trash2 } from "lucide-react";

// export type InvoiceLineItemForm = {
//   id?: string;
//   description: string;
//   quantity: number;
//   rate: number;
//   amount: number;
//   hsCode?: string;
//   shopName?: string;
//   shopAddress?: string;
//   /** Box-1 / Box-2 for separate proforma lines */
//   boxNo?: "BOX_1" | "BOX_2" | string;
// };

// type InvoiceItemTableProps = {
//   items: InvoiceLineItemForm[];
//   onChange: (items: InvoiceLineItemForm[]) => void;
//   disabled?: boolean;
//   /**
//    * Super Admin only.
//    * When false: description, shopName, shopAddress, hsCode are read-only.
//    * Qty / rate / amount stay editable for agents.
//    */
//   canEditRestricted?: boolean;
// };

// function newItem(): InvoiceLineItemForm {
//   return {
//     id: crypto.randomUUID(),
//     description: "",
//     quantity: 1,
//     rate: 0,
//     amount: 0,
//     hsCode: "",
//     shopName: "",
//     shopAddress: "",
//     boxNo: "BOX_1",
//   };
// }

// export default function InvoiceItemTable({
//   items,
//   onChange,
//   disabled = false,
//   canEditRestricted = false,
// }: InvoiceItemTableProps) {
//   const restrictedLocked = disabled || !canEditRestricted;

//   const addRow = () => {
//     onChange([...items, newItem()]);
//   };

//   const updateRow = (
//     index: number,
//     field: keyof InvoiceLineItemForm,
//     value: string | number,
//   ) => {
//     onChange(
//       items.map((item, i) => {
//         if (i !== index) return item;

//         const next: InvoiceLineItemForm = {
//           ...item,
//           [field]: value,
//         };

//         // Recalc amount when qty or rate changes
//         if (field === "quantity" || field === "rate") {
//           const qty = Number(next.quantity || 0);
//           const rate = Number(next.rate || 0);
//           next.amount = Number((qty * rate).toFixed(2));
//         }

//         return next;
//       }),
//     );
//   };

//   const removeRow = (index: number) => {
//     onChange(items.filter((_, i) => i !== index));
//   };

//   const input =
//     "h-9 w-full rounded border border-gray-300 bg-white px-2 text-sm outline-none focus:border-slate-600 disabled:bg-gray-50 disabled:text-gray-500";

//   return (
//     <section className="rounded-xl border bg-white shadow-sm">
//       <div className="flex flex-col justify-between gap-3 border-b bg-slate-50 px-5 py-3 sm:flex-row sm:items-center">
//         <div>
//           <h2 className="text-sm font-semibold text-slate-800">
//             Proforma Invoice Items
//           </h2>
//           <p className="mt-0.5 text-xs text-gray-500">
//             Separate lines for Box-1 &amp; Box-2. Description / shop / HS code
//             {canEditRestricted
//               ? " editable (Super Admin)."
//               : " locked for agents — only Qty / Rate / Amount editable."}
//           </p>
//         </div>

//         <button
//           type="button"
//           onClick={addRow}
//           disabled={disabled}
//           className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
//         >
//           <Plus className="h-4 w-4" />
//           Add Item
//         </button>
//       </div>

//       <div className="overflow-x-auto p-4">
//         {items.length === 0 ? (
//           <div className="rounded-lg border border-dashed p-8 text-center">
//             <p className="text-sm text-gray-500">No invoice items yet.</p>
//             <button
//               type="button"
//               onClick={addRow}
//               className="mt-2 text-sm font-semibold text-slate-900 hover:underline"
//             >
//               Add the first item
//             </button>
//           </div>
//         ) : (
//           <table className="w-full min-w-[1100px] border-collapse text-sm">
//             <thead>
//               <tr className="bg-slate-900 text-left text-xs font-semibold uppercase tracking-wide text-white">
//                 <th className="px-3 py-2.5">Box</th>
//                 <th className="px-3 py-2.5">Description</th>
//                 <th className="px-3 py-2.5">Shop Name</th>
//                 <th className="px-3 py-2.5">Shop Address</th>
//                 <th className="px-3 py-2.5">HS Code</th>
//                 <th className="px-3 py-2.5">Qty</th>
//                 <th className="px-3 py-2.5">Rate</th>
//                 <th className="px-3 py-2.5">Amount</th>
//                 <th className="px-3 py-2.5 w-12" />
//               </tr>
//             </thead>
//             <tbody>
//               {items.map((item, index) => (
//                 <tr
//                   key={item.id || index}
//                   className="border-b border-gray-100 odd:bg-gray-50/50"
//                 >
//                   <td className="px-2 py-2">
//                     <select
//                       value={item.boxNo || "BOX_1"}
//                       onChange={(e) =>
//                         updateRow(index, "boxNo", e.target.value)
//                       }
//                       className={`${input} w-24`}
//                       disabled={disabled}
//                     >
//                       <option value="BOX_1">Box-1</option>
//                       <option value="BOX_2">Box-2</option>
//                     </select>
//                   </td>

//                   <td className="px-2 py-2">
//                     <input
//                       value={item.description}
//                       onChange={(e) =>
//                         updateRow(index, "description", e.target.value)
//                       }
//                       placeholder="Description"
//                       className={`${input} min-w-[140px]`}
//                       disabled={restrictedLocked}
//                       title={
//                         restrictedLocked
//                           ? "Only Super Admin can edit description"
//                           : undefined
//                       }
//                     />
//                   </td>

//                   <td className="px-2 py-2">
//                     <input
//                       value={item.shopName || ""}
//                       onChange={(e) =>
//                         updateRow(index, "shopName", e.target.value)
//                       }
//                       placeholder="Shop name"
//                       className={`${input} min-w-[120px]`}
//                       disabled={restrictedLocked}
//                     />
//                   </td>

//                   <td className="px-2 py-2">
//                     <input
//                       value={item.shopAddress || ""}
//                       onChange={(e) =>
//                         updateRow(index, "shopAddress", e.target.value)
//                       }
//                       placeholder="Shop address"
//                       className={`${input} min-w-[140px]`}
//                       disabled={restrictedLocked}
//                     />
//                   </td>

//                   <td className="px-2 py-2">
//                     <input
//                       value={item.hsCode || ""}
//                       onChange={(e) =>
//                         updateRow(index, "hsCode", e.target.value)
//                       }
//                       placeholder="HS code"
//                       className={`${input} w-24`}
//                       disabled={restrictedLocked}
//                     />
//                   </td>

//                   <td className="px-2 py-2">
//                     <input
//                       type="number"
//                       min={0}
//                       step="1"
//                       value={item.quantity}
//                       onChange={(e) =>
//                         updateRow(
//                           index,
//                           "quantity",
//                           Number(e.target.value) || 0,
//                         )
//                       }
//                       className={`${input} w-20`}
//                       disabled={disabled}
//                     />
//                   </td>

//                   <td className="px-2 py-2">
//                     <input
//                       type="number"
//                       min={0}
//                       step="0.01"
//                       value={item.rate}
//                       onChange={(e) =>
//                         updateRow(index, "rate", Number(e.target.value) || 0)
//                       }
//                       className={`${input} w-24`}
//                       disabled={disabled}
//                     />
//                   </td>

//                   <td className="px-2 py-2">
//                     <input
//                       type="number"
//                       min={0}
//                       step="0.01"
//                       value={item.amount}
//                       onChange={(e) =>
//                         updateRow(
//                           index,
//                           "amount",
//                           Number(e.target.value) || 0,
//                         )
//                       }
//                       className={`${input} w-24 font-medium`}
//                       disabled={disabled}
//                     />
//                   </td>

//                   <td className="px-2 py-2 text-center">
//                     <button
//                       type="button"
//                       onClick={() => removeRow(index)}
//                       disabled={disabled}
//                       className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
//                     >
//                       <Trash2 className="h-4 w-4" />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </section>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export type InvoiceLineItemForm = {
  id?: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  hsCode?: string;
  shopName?: string;
  shopAddress?: string;
  boxNo?: "BOX_1" | "BOX_2" | string;
  catalogId?: string;
};

type CatalogItem = {
  id: string;
  description: string;
  shopName: string;
  shopAddress: string;
  hsCode: string;
  defaultRate: number;
  defaultQty: number;
};

type InvoiceItemTableProps = {
  items: InvoiceLineItemForm[];
  onChange: (items: InvoiceLineItemForm[]) => void;
  disabled?: boolean;
  canEditRestricted?: boolean;
};

function newItem(): InvoiceLineItemForm {
  return {
    id: crypto.randomUUID(),
    description: "",
    quantity: 1,
    rate: 0,
    amount: 0,
    hsCode: "",
    shopName: "",
    shopAddress: "",
    boxNo: "BOX_1",
    catalogId: "",
  };
}

export default function InvoiceItemTable({
  items,
  onChange,
  disabled = false,
  canEditRestricted = false,
}: InvoiceItemTableProps) {
  const { firebaseUser } = useAuth();
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const restrictedLocked = disabled || !canEditRestricted;

  useEffect(() => {
    let cancelled = false;
    async function loadCatalog() {
      if (!firebaseUser) return;
      try {
        const token = await firebaseUser.getIdToken(true);
        const res = await fetch("/api/logistics/proforma-catalog", {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });
        const json = await res.json();
        if (!cancelled && res.ok && json.success) {
          setCatalog(json.data || []);
        }
      } catch {
        // silent — dropdown stays empty
      }
    }
    loadCatalog();
    return () => {
      cancelled = true;
    };
  }, [firebaseUser]);

  const addRow = () => onChange([...items, newItem()]);

  const updateRow = (
    index: number,
    field: keyof InvoiceLineItemForm,
    value: string | number,
  ) => {
    onChange(
      items.map((item, i) => {
        if (i !== index) return item;
        const next = { ...item, [field]: value };
        if (field === "quantity" || field === "rate") {
          next.amount = Number(
            (Number(next.quantity || 0) * Number(next.rate || 0)).toFixed(2),
          );
        }
        return next;
      }),
    );
  };

  const selectCatalogItem = (index: number, catalogId: string) => {
    const cat = catalog.find((c) => c.id === catalogId);
    onChange(
      items.map((item, i) => {
        if (i !== index) return item;
        if (!cat) {
          return { ...item, catalogId: "" };
        }
        const qty = cat.defaultQty || 1;
        const rate = cat.defaultRate || 0;
        return {
          ...item,
          catalogId: cat.id,
          description: cat.description,
          shopName: cat.shopName,
          shopAddress: cat.shopAddress,
          hsCode: cat.hsCode,
          quantity: qty,
          rate,
          amount: Number((qty * rate).toFixed(2)),
        };
      }),
    );
  };

  const removeRow = (index: number) =>
    onChange(items.filter((_, i) => i !== index));

  const input =
    "h-9 w-full rounded border border-gray-300 bg-white px-2 text-sm outline-none focus:border-slate-600 disabled:bg-gray-50 disabled:text-gray-500";

  return (
    <section className="rounded-xl border bg-white shadow-sm">
      <div className="flex flex-col justify-between gap-3 border-b bg-slate-50 px-5 py-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-sm font-semibold text-slate-800">
            Proforma Invoice Items
          </h2>
          <p className="mt-0.5 text-xs text-gray-500">
            Select an item from the dropdown (managed by Admin). Description / Shop / HS
            fill automatically. Only Qty / Rate / Amount editable for agents.
          </p>
        </div>
        <button
          type="button"
          onClick={addRow}
          disabled={disabled}
          className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          Add Item
        </button>
      </div>

      <div className="overflow-x-auto p-4">
        {items.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 py-10 text-center">
            <p className="text-sm text-gray-500">No invoice items yet.</p>
            <button
              type="button"
              onClick={addRow}
              disabled={disabled}
              className="mt-2 text-sm font-medium text-slate-700 underline"
            >
              Add the first item
            </button>
          </div>
        ) : (
          <table className="w-full min-w-[960px] border-collapse text-sm">
            <thead>
              <tr className="bg-slate-800 text-left text-xs font-semibold uppercase tracking-wide text-white">
                <th className="px-2 py-2.5">Box</th>
                <th className="px-2 py-2.5 min-w-[180px]">Select Item</th>
                <th className="px-2 py-2.5">Description</th>
                <th className="px-2 py-2.5">Shop Name</th>
                <th className="px-2 py-2.5">Shop Address</th>
                <th className="px-2 py-2.5">HS Code</th>
                <th className="px-2 py-2.5">Qty</th>
                <th className="px-2 py-2.5">Rate</th>
                <th className="px-2 py-2.5">Amount</th>
                <th className="px-2 py-2.5 w-10" />
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.id || index} className="border-b border-gray-100">
                  <td className="px-2 py-2">
                    <select
                      value={item.boxNo || "BOX_1"}
                      onChange={(e) => updateRow(index, "boxNo", e.target.value)}
                      className={`${input} w-20`}
                      disabled={disabled}
                    >
                      <option value="BOX_1">Box 1</option>
                      <option value="BOX_2">Box 2</option>
                    </select>
                  </td>

                  <td className="px-2 py-2">
                    <select
                      value={item.catalogId || ""}
                      onChange={(e) => selectCatalogItem(index, e.target.value)}
                      className={`${input} min-w-[160px]`}
                      disabled={disabled}
                    >
                      <option value="">— Select item —</option>
                      {catalog.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.description}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="px-2 py-2">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateRow(index, "description", e.target.value)}
                      className={`${input} min-w-[140px]`}
                      disabled={restrictedLocked}
                      placeholder="Description"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <input
                      type="text"
                      value={item.shopName || ""}
                      onChange={(e) => updateRow(index, "shopName", e.target.value)}
                      className={`${input} min-w-[110px]`}
                      disabled={restrictedLocked}
                      placeholder="Shop name"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <input
                      type="text"
                      value={item.shopAddress || ""}
                      onChange={(e) => updateRow(index, "shopAddress", e.target.value)}
                      className={`${input} min-w-[140px]`}
                      disabled={restrictedLocked}
                      placeholder="Shop address"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <input
                      type="text"
                      value={item.hsCode || ""}
                      onChange={(e) => updateRow(index, "hsCode", e.target.value)}
                      className={`${input} w-28`}
                      disabled={restrictedLocked}
                      placeholder="HS code"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) =>
                        updateRow(index, "quantity", Number(e.target.value) || 1)
                      }
                      className={`${input} w-16`}
                      disabled={disabled}
                    />
                  </td>
                  <td className="px-2 py-2">
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      value={item.rate}
                      onChange={(e) =>
                        updateRow(index, "rate", Number(e.target.value) || 0)
                      }
                      className={`${input} w-24`}
                      disabled={disabled}
                    />
                  </td>
                  <td className="px-2 py-2">
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      value={item.amount}
                      onChange={(e) =>
                        updateRow(index, "amount", Number(e.target.value) || 0)
                      }
                      className={`${input} w-24 font-medium`}
                      disabled={disabled}
                    />
                  </td>
                  <td className="px-2 py-2 text-center">
                    <button
                      type="button"
                      onClick={() => removeRow(index)}
                      disabled={disabled}
                      className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}