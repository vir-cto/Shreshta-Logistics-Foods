// import "server-only";

// import { readFileSync, existsSync } from "fs";
// import { join } from "path";
// import {
//   PDFDocument,
//   StandardFonts,
//   rgb,
//   type PDFImage,
// } from "pdf-lib";

// export type FoodBillItem = {
//   productName: string;
//   variantName?: string;
//   quantity: number;
//   price: number;
//   amount: number;
// };

// export type FoodBillData = {
//   orderId: string;
//   billNumber?: string;
//   orderDate?: string;
//   paidAt?: string;
//   storeName?: string;
//   supportEmail?: string;
//   supportPhone?: string;
//   customerName: string;
//   customerPhone?: string;
//   customerEmail?: string;
//   shippingAddress?: string;
//   items: FoodBillItem[];
//   subtotal: number;
//   deliveryFee: number;
//   discount: number;
//   tax?: number;
//   total: number;
//   currency?: string;
//   paymentStatus?: string;
//   paymentProvider?: string;
//   paymentReferenceId?: string;
//   cashfreeOrderId?: string;
//   couponId?: string;
// };

// function formatINR(amount: number): string {
//   const n = Number.isFinite(amount) ? amount : 0;
//   // Do NOT use "₹" — WinAnsi / Helvetica cannot encode it
//   return (
//     "Rs. " +
//     new Intl.NumberFormat("en-IN", {
//       maximumFractionDigits: 2,
//       minimumFractionDigits: 0,
//     }).format(n)
//   );
// }
// function formatDateTime(value?: string): string {
//   if (!value) {
//     const d = new Date();
//     return d.toLocaleString("en-IN", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   }
//   const d = new Date(value);
//   if (Number.isNaN(d.getTime())) return value;
//   return d.toLocaleString("en-IN", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//   });
// }

// function wrapText(text: string, maxChars: number): string[] {
//   if (!text) return [];
//   const words = String(text).split(/\s+/).filter(Boolean);
//   const lines: string[] = [];
//   let current = "";
//   for (const word of words) {
//     const next = current ? `${current} ${word}` : word;
//     if (next.length <= maxChars) {
//       current = next;
//     } else {
//       if (current) lines.push(current);
//       current = word.length > maxChars ? word.slice(0, maxChars) : word;
//     }
//   }
//   if (current) lines.push(current);
//   return lines;
// }

// function loadLogoBytes(): Uint8Array | null {
//   const candidates = [
//     join(process.cwd(), "public", "images", "sreshta-food-logo.png"),
//     join(process.cwd(), "public", "images", "sreshta-logistics-logo.png"),
//     join(process.cwd(), "public", "sreshta-food-logo.png"),
//   ];
//   for (const p of candidates) {
//     if (existsSync(p)) return readFileSync(p);
//   }
//   return null;
// }

// export async function generateFoodOrderBillPdf(
//   data: FoodBillData,
// ): Promise<Uint8Array> {
//   const pdf = await PDFDocument.create();
//   const page = pdf.addPage([595.28, 841.89]);
//   const { width, height } = page.getSize();

//   const font = await pdf.embedFont(StandardFonts.Helvetica);
//   const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

//   let logoImage: PDFImage | null = null;
//   try {
//     const bytes = loadLogoBytes();
//     if (bytes) logoImage = await pdf.embedPng(bytes);
//   } catch {
//     // ignore
//   }

//   const margin = 40;
//   const contentW = width - margin * 2;
//   const black = rgb(0.08, 0.08, 0.1);
//   const muted = rgb(0.4, 0.4, 0.45);
//   const orange = rgb(0.92, 0.4, 0.08);
//   const lightOrange = rgb(1, 0.96, 0.92);
//   const line = rgb(0.88, 0.88, 0.9);
//   const green = rgb(0.09, 0.55, 0.3);

//   const storeName = (data.storeName || "Sreshta Foods").trim();
//   const billNo =
//     data.billNumber ||
//     `BILL-${String(data.orderId || "").replace(/\D/g, "").slice(-10) || "000000"}`;
//   const currency = (data.currency || "INR").toUpperCase();

//   const drawText = (
//     text: string,
//     x: number,
//     y: number,
//     size = 10,
//     isBold = false,
//     color = black,
//   ) => {
//     const t = String(text ?? "");
//     if (!t) return;
//     page.drawText(t, {
//       x,
//       y,
//       size,
//       font: isBold ? bold : font,
//       color,
//     });
//   };

//   const drawHLine = (y: number, x1 = margin, x2 = margin + contentW) => {
//     page.drawLine({
//       start: { x: x1, y },
//       end: { x: x2, y },
//       thickness: 0.6,
//       color: line,
//     });
//   };

//   let y = height - margin;

//   page.drawRectangle({
//     x: 0,
//     y: height - 88,
//     width,
//     height: 88,
//     color: lightOrange,
//   });

//   if (logoImage) {
//     const maxH = 48;
//     const scale = Math.min(120 / logoImage.width, maxH / logoImage.height);
//     const drawW = logoImage.width * scale;
//     const drawH = logoImage.height * scale;
//     page.drawImage(logoImage, {
//       x: margin,
//       y: height - 28 - drawH,
//       width: drawW,
//       height: drawH,
//     });
//   } else {
//     drawText(storeName.toUpperCase(), margin, height - 48, 18, true, orange);
//   }

//   drawText("TAX INVOICE / BILL", width - margin - 130, height - 40, 11, true, orange);
//   drawText(`Bill No.  ${billNo}`, width - margin - 130, height - 56, 9, false, muted);
//   drawText(
//     `Date  ${formatDateTime(data.paidAt || data.orderDate)}`,
//     width - margin - 130,
//     height - 70,
//     9,
//     false,
//     muted,
//   );

//   y = height - 110;

//   drawText(storeName, margin, y, 12, true);
//   y -= 14;
//   if (data.supportPhone) {
//     drawText(`Phone: ${data.supportPhone}`, margin, y, 9, false, muted);
//     y -= 12;
//   }
//   if (data.supportEmail) {
//     drawText(`Email: ${data.supportEmail}`, margin, y, 9, false, muted);
//     y -= 12;
//   }

//   const metaX = margin + contentW / 2 + 20;
//   let my = height - 110;
//   drawText("Order details", metaX, my, 10, true);
//   my -= 14;
//   drawText(`Order ID:  ${data.orderId}`, metaX, my, 9, false, muted);
//   my -= 12;
//   drawText(
//     `Payment:  ${(data.paymentStatus || "PAID").toUpperCase()}`,
//     metaX,
//     my,
//     9,
//     false,
//     green,
//   );
//   my -= 12;
//   if (data.paymentProvider) {
//     drawText(`Provider:  ${data.paymentProvider}`, metaX, my, 9, false, muted);
//     my -= 12;
//   }
//   if (data.paymentReferenceId) {
//     drawText(`Ref:  ${data.paymentReferenceId}`, metaX, my, 8, false, muted);
//     my -= 12;
//   }
//   if (data.cashfreeOrderId) {
//     drawText(`CF Order:  ${data.cashfreeOrderId}`, metaX, my, 8, false, muted);
//   }

//   y = Math.min(y, my) - 18;
//   drawHLine(y);
//   y -= 22;

//   drawText("BILL TO", margin, y, 9, true, muted);
//   y -= 14;
//   drawText(data.customerName || "Customer", margin, y, 11, true);
//   y -= 13;
//   if (data.customerPhone) {
//     drawText(data.customerPhone, margin, y, 9, false, muted);
//     y -= 12;
//   }
//   if (data.customerEmail) {
//     drawText(data.customerEmail, margin, y, 9, false, muted);
//     y -= 12;
//   }
//   if (data.shippingAddress) {
//     for (const line of wrapText(data.shippingAddress, 70).slice(0, 3)) {
//       drawText(line, margin, y, 9, false, muted);
//       y -= 12;
//     }
//   }

//   y -= 10;
//   drawHLine(y);
//   y -= 8;

//   const colItem = margin;
//   const colVariant = margin + 200;
//   const colQty = margin + 340;
//   const colRate = margin + 390;
//   const colAmt = margin + contentW - 10;

//   page.drawRectangle({
//     x: margin,
//     y: y - 22,
//     width: contentW,
//     height: 24,
//     color: rgb(0.97, 0.97, 0.98),
//   });

//   drawText("ITEM", colItem + 6, y - 15, 8, true, muted);
//   drawText("VARIANT", colVariant, y - 15, 8, true, muted);
//   drawText("QTY", colQty, y - 15, 8, true, muted);
//   drawText("RATE", colRate, y - 15, 8, true, muted);
//   const amtHeader = "AMOUNT";
//   drawText(
//     amtHeader,
//     colAmt - bold.widthOfTextAtSize(amtHeader, 8),
//     y - 15,
//     8,
//     true,
//     muted,
//   );
//   y -= 28;

//   const items = Array.isArray(data.items) ? data.items : [];
//   if (items.length === 0) {
//     drawText("No items on this order.", margin + 6, y - 4, 9, false, muted);
//     y -= 20;
//   } else {
//     for (const item of items) {
//       if (y < 160) break;
//       const name = String(item.productName || "Product").slice(0, 32);
//       const variant = String(item.variantName || "—").slice(0, 18);
//       const qty = Number(item.quantity) || 0;
//       const price = Number(item.price) || 0;
//       const amount =
//         Number.isFinite(item.amount) && item.amount != null
//           ? Number(item.amount)
//           : price * qty;

//       drawText(name, colItem + 6, y, 9, true);
//       drawText(variant, colVariant, y, 9, false, muted);
//       drawText(String(qty), colQty + 4, y, 9);
//       const rateStr = formatINR(price);
//       drawText(rateStr, colRate, y, 9);
//       const amtStr = formatINR(amount);
//       drawText(
//         amtStr,
//         colAmt - font.widthOfTextAtSize(amtStr, 9),
//         y,
//         9,
//         true,
//       );
//       y -= 16;
//       drawHLine(y + 4);
//       y -= 4;
//     }
//   }

//   y -= 12;

//   const totalsX = margin + contentW - 220;
//   const labelX = totalsX;
//   const valueX = margin + contentW - 8;

//   const row = (label: string, value: string, strong = false) => {
//     drawText(label, labelX, y, 9, strong, strong ? black : muted);
//     drawText(
//       value,
//       valueX - (strong ? bold : font).widthOfTextAtSize(value, strong ? 11 : 9),
//       y,
//       strong ? 11 : 9,
//       strong,
//     );
//     y -= strong ? 18 : 15;
//   };

//   row("Subtotal", formatINR(data.subtotal));
//   if (data.deliveryFee > 0) row("Delivery", formatINR(data.deliveryFee));
//   if (data.discount > 0) {
//     row("Discount", `- ${formatINR(data.discount)}`);
//   }
//   if (data.couponId) {
//     drawText(`Coupon: ${data.couponId}`, labelX, y, 8, false, muted);
//     y -= 12;
//   }
//   if (data.tax && data.tax > 0) row("Tax", formatINR(data.tax));

//   page.drawRectangle({
//     x: totalsX - 8,
//     y: y - 6,
//     width: contentW - (totalsX - margin) + 8,
//     height: 28,
//     color: lightOrange,
//   });
//   drawText("TOTAL PAID", labelX, y + 4, 10, true, orange);
//   const totalStr = formatINR(data.total);
//   drawText(
//     totalStr,
//     valueX - bold.widthOfTextAtSize(totalStr, 12),
//     y + 3,
//     12,
//     true,
//     orange,
//   );
//   y -= 36;

//   const paid = String(data.paymentStatus || "SUCCESS").toUpperCase();
//   if (paid === "SUCCESS" || paid === "PAID" || paid === "AUTHORIZED") {
//     page.drawRectangle({
//       x: margin,
//       y: y - 8,
//       width: 90,
//       height: 22,
//       color: rgb(0.9, 0.98, 0.93),
//       borderColor: green,
//       borderWidth: 1,
//     });
//     drawText("PAID", margin + 28, y - 2, 11, true, green);
//   }

//   y -= 40;

//   drawHLine(y);
//   y -= 16;
//   drawText(
//     "Thank you for ordering with Sreshta Foods.",
//     margin,
//     y,
//     9,
//     false,
//     muted,
//   );
//   y -= 12;
//   drawText(
//     "This is a computer-generated invoice. For support, contact the store details above.",
//     margin,
//     y,
//     8,
//     false,
//     muted,
//   );
//   y -= 12;
//   drawText(
//     `Currency: ${currency}  ·  Generated ${formatDateTime()}`,
//     margin,
//     y,
//     8,
//     false,
//     muted,
//   );

//   return pdf.save();
// }

// export function isFoodOrderBillEligible(input: {
//   paymentStatus?: string | null;
//   status?: string | null;
// }): boolean {
//   const ps = String(input.paymentStatus || "").toUpperCase();
//   const st = String(input.status || "").toUpperCase();

//   if (["SUCCESS", "PAID", "AUTHORIZED"].includes(ps)) return true;
//   if (
//     [
//       "PAID",
//       "CONFIRMED",
//       "PROCESSING",
//       "PACKED",
//       "SHIPPED",
//       "OUT_FOR_DELIVERY",
//       "DELIVERED",
//     ].includes(st)
//   ) {
//     return true;
//   }
//   return false;
// }

import "server-only";

import { readFileSync, existsSync } from "fs";
import { join } from "path";
import {
  PDFDocument,
  StandardFonts,
  rgb,
  type PDFImage,
} from "pdf-lib";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type FoodBillItem = {
  productName: string;
  variantName?: string;
  quantity: number;
  price: number;
  amount: number;
};

export type FoodBillData = {
  orderId: string;
  billNumber?: string;
  orderDate?: string;
  paidAt?: string;

  storeName?: string;
  supportEmail?: string;
  supportPhone?: string;
  /** FSSAI license number printed on the bill */
  fssaiLicense?: string;

  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  shippingAddress?: string;

  items: FoodBillItem[];

  subtotal: number;
  deliveryFee: number;
  discount: number;
  tax?: number;
  total: number;
  currency?: string;

  paymentStatus?: string;
  paymentProvider?: string;
  paymentReferenceId?: string;
  cashfreeOrderId?: string;
  couponId?: string;
};

const DEFAULT_FSSAI = "20126141001875";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Use Rs. — standard Helvetica cannot encode ₹ (WinAnsi). */
function formatINR(amount: number): string {
  const n = Number.isFinite(amount) ? amount : 0;
  return (
    "Rs. " +
    new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 0,
    }).format(n)
  );
}

function formatDateTime(value?: string): string {
  const d = value ? new Date(value) : new Date();
  if (Number.isNaN(d.getTime())) return value || "";
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function wrapText(text: string, maxChars: number): string[] {
  if (!text) return [];
  const words = String(text).split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length <= maxChars) {
      current = next;
    } else {
      if (current) lines.push(current);
      current = word.length > maxChars ? word.slice(0, maxChars) : word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function loadLogoBytes(): Uint8Array | null {
  const candidates = [
    join(process.cwd(), "public", "images", "sreshta-food-logo.png"),
    join(process.cwd(), "public", "images", "sreshta-logistics-logo.png"),
    join(process.cwd(), "public", "sreshta-food-logo.png"),
  ];
  for (const p of candidates) {
    if (existsSync(p)) return readFileSync(p);
  }
  return null;
}

/* ------------------------------------------------------------------ */
/*  Generator                                                          */
/* ------------------------------------------------------------------ */

export async function generateFoodOrderBillPdf(
  data: FoodBillData,
): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595.28, 841.89]); // A4
  const { width, height } = page.getSize();

  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  let logoImage: PDFImage | null = null;
  try {
    const bytes = loadLogoBytes();
    if (bytes) logoImage = await pdf.embedPng(bytes);
  } catch {
    // ignore missing logo
  }

  const margin = 40;
  const contentW = width - margin * 2;
  const black = rgb(0.08, 0.08, 0.1);
  const muted = rgb(0.4, 0.4, 0.45);
  const orange = rgb(0.92, 0.4, 0.08);
  const lightOrange = rgb(1, 0.96, 0.92);
  const line = rgb(0.88, 0.88, 0.9);
  const green = rgb(0.09, 0.55, 0.3);

  const storeName = (data.storeName || "Sreshta Foods").trim();
  const fssai = String(data.fssaiLicense || DEFAULT_FSSAI).trim();
  const billNo =
    data.billNumber ||
    `BILL-${String(data.orderId || "").replace(/\D/g, "").slice(-10) || "000000"}`;
  const currency = (data.currency || "INR").toUpperCase();

  // Reserve space so body never overlaps the fixed footer
  const FOOTER_ZONE = 72;

  const drawText = (
    text: string,
    x: number,
    y: number,
    size = 10,
    isBold = false,
    color = black,
  ) => {
    const t = String(text ?? "");
    if (!t) return;
    page.drawText(t, {
      x,
      y,
      size,
      font: isBold ? bold : font,
      color,
    });
  };

  const drawHLine = (y: number, x1 = margin, x2 = margin + contentW) => {
    page.drawLine({
      start: { x: x1, y },
      end: { x: x2, y },
      thickness: 0.6,
      color: line,
    });
  };

  let y = height - margin;

  /* ---------- Header band ---------- */
  page.drawRectangle({
    x: 0,
    y: height - 88,
    width,
    height: 88,
    color: lightOrange,
  });

  if (logoImage) {
    const maxH = 48;
    const scale = Math.min(120 / logoImage.width, maxH / logoImage.height);
    const drawW = logoImage.width * scale;
    const drawH = logoImage.height * scale;
    page.drawImage(logoImage, {
      x: margin,
      y: height - 28 - drawH,
      width: drawW,
      height: drawH,
    });
  } else {
    drawText(storeName.toUpperCase(), margin, height - 48, 18, true, orange);
  }

  drawText(
    "TAX INVOICE / BILL",
    width - margin - 130,
    height - 40,
    11,
    true,
    orange,
  );
  drawText(
    `Bill No.  ${billNo}`,
    width - margin - 130,
    height - 56,
    9,
    false,
    muted,
  );
  drawText(
    `Date  ${formatDateTime(data.paidAt || data.orderDate)}`,
    width - margin - 130,
    height - 70,
    9,
    false,
    muted,
  );

  y = height - 110;

  /* ---------- Store + Order meta ---------- */
  drawText(storeName, margin, y, 12, true);
  y -= 14;

  // FSSAI on store block
  drawText(`FSSAI License No. ${fssai}`, margin, y, 9, false, muted);
  y -= 12;

  if (data.supportPhone) {
    drawText(`Phone: ${data.supportPhone}`, margin, y, 9, false, muted);
    y -= 12;
  }
  if (data.supportEmail) {
    drawText(`Email: ${data.supportEmail}`, margin, y, 9, false, muted);
    y -= 12;
  }

  const metaX = margin + contentW / 2 + 20;
  let my = height - 110;
  drawText("Order details", metaX, my, 10, true);
  my -= 14;
  drawText(`Order ID:  ${data.orderId}`, metaX, my, 9, false, muted);
  my -= 12;
  drawText(
    `Payment:  ${(data.paymentStatus || "PAID").toUpperCase()}`,
    metaX,
    my,
    9,
    false,
    green,
  );
  my -= 12;
  if (data.paymentProvider) {
    drawText(`Provider:  ${data.paymentProvider}`, metaX, my, 9, false, muted);
    my -= 12;
  }
  if (data.paymentReferenceId) {
    drawText(`Ref:  ${data.paymentReferenceId}`, metaX, my, 8, false, muted);
    my -= 12;
  }
  if (data.cashfreeOrderId) {
    drawText(`CF Order:  ${data.cashfreeOrderId}`, metaX, my, 8, false, muted);
  }

  y = Math.min(y, my) - 18;
  drawHLine(y);
  y -= 22;

  /* ---------- Bill to ---------- */
  drawText("BILL TO", margin, y, 9, true, muted);
  y -= 14;
  drawText(data.customerName || "Customer", margin, y, 11, true);
  y -= 13;
  if (data.customerPhone) {
    drawText(data.customerPhone, margin, y, 9, false, muted);
    y -= 12;
  }
  if (data.customerEmail) {
    drawText(data.customerEmail, margin, y, 9, false, muted);
    y -= 12;
  }
  if (data.shippingAddress) {
    for (const addrLine of wrapText(data.shippingAddress, 70).slice(0, 3)) {
      drawText(addrLine, margin, y, 9, false, muted);
      y -= 12;
    }
  }

  y -= 10;
  drawHLine(y);
  y -= 8;

  /* ---------- Items table header ---------- */
  const colItem = margin;
  const colVariant = margin + 200;
  const colQty = margin + 340;
  const colRate = margin + 390;
  const colAmt = margin + contentW - 10;

  page.drawRectangle({
    x: margin,
    y: y - 22,
    width: contentW,
    height: 24,
    color: rgb(0.97, 0.97, 0.98),
  });

  drawText("ITEM", colItem + 6, y - 15, 8, true, muted);
  drawText("VARIANT", colVariant, y - 15, 8, true, muted);
  drawText("QTY", colQty, y - 15, 8, true, muted);
  drawText("RATE", colRate, y - 15, 8, true, muted);
  const amtHeader = "AMOUNT";
  drawText(
    amtHeader,
    colAmt - bold.widthOfTextAtSize(amtHeader, 8),
    y - 15,
    8,
    true,
    muted,
  );
  y -= 28;

  const items = Array.isArray(data.items) ? data.items : [];
  if (items.length === 0) {
    drawText("No items on this order.", margin + 6, y - 4, 9, false, muted);
    y -= 20;
  } else {
    for (const item of items) {
      if (y < FOOTER_ZONE + 80) break;
      const name = String(item.productName || "Product").slice(0, 32);
      const variant = String(item.variantName || "—").slice(0, 18);
      const qty = Number(item.quantity) || 0;
      const price = Number(item.price) || 0;
      const amount =
        Number.isFinite(item.amount) && item.amount != null
          ? Number(item.amount)
          : price * qty;

      drawText(name, colItem + 6, y, 9, true);
      drawText(variant, colVariant, y, 9, false, muted);
      drawText(String(qty), colQty + 4, y, 9);
      const rateStr = formatINR(price);
      drawText(rateStr, colRate, y, 9);
      const amtStr = formatINR(amount);
      drawText(
        amtStr,
        colAmt - font.widthOfTextAtSize(amtStr, 9),
        y,
        9,
        true,
      );
      y -= 16;
      drawHLine(y + 4);
      y -= 4;
    }
  }

  y -= 12;

  /* ---------- Totals ---------- */
  const totalsX = margin + contentW - 220;
  const labelX = totalsX;
  const valueX = margin + contentW - 8;

  const row = (label: string, value: string, strong = false) => {
    drawText(label, labelX, y, 9, strong, strong ? black : muted);
    drawText(
      value,
      valueX - (strong ? bold : font).widthOfTextAtSize(value, strong ? 11 : 9),
      y,
      strong ? 11 : 9,
      strong,
    );
    y -= strong ? 18 : 15;
  };

  row("Subtotal", formatINR(data.subtotal));
  if (data.deliveryFee > 0) row("Delivery", formatINR(data.deliveryFee));
  if (data.discount > 0) {
    row("Discount", `- ${formatINR(data.discount)}`);
  }
  if (data.couponId) {
    drawText(`Coupon: ${data.couponId}`, labelX, y, 8, false, muted);
    y -= 12;
  }
  if (data.tax && data.tax > 0) row("Tax", formatINR(data.tax));

  page.drawRectangle({
    x: totalsX - 8,
    y: y - 6,
    width: contentW - (totalsX - margin) + 8,
    height: 28,
    color: lightOrange,
  });
  drawText("TOTAL PAID", labelX, y + 4, 10, true, orange);
  const totalStr = formatINR(data.total);
  drawText(
    totalStr,
    valueX - bold.widthOfTextAtSize(totalStr, 12),
    y + 3,
    12,
    true,
    orange,
  );
  y -= 36;

  /* ---------- Paid stamp ---------- */
  const paid = String(data.paymentStatus || "SUCCESS").toUpperCase();
  if (paid === "SUCCESS" || paid === "PAID" || paid === "AUTHORIZED") {
    page.drawRectangle({
      x: margin,
      y: y - 8,
      width: 90,
      height: 22,
      color: rgb(0.9, 0.98, 0.93),
      borderColor: green,
      borderWidth: 1,
    });
    drawText("PAID", margin + 28, y - 2, 11, true, green);
  }

  /* ---------- Footer — always at bottom of last page ---------- */
  const footerTop = margin + 52;
  drawHLine(footerTop + 14);

  const footerLines = [
    "Thank you for ordering with Sreshta Foods. This is a computer-generated invoice. For support, contact the store details above.",
    `Currency: ${currency}  ·  Generated ${formatDateTime()}`,
    `FSSAI License No. ${fssai}`,
  ];

  let fy = footerTop;
  for (const fl of footerLines) {
    const wrapped = wrapText(fl, 95);
    for (const wl of wrapped) {
      drawText(wl, margin, fy, 8, false, muted);
      fy -= 11;
    }
  }

  return pdf.save();
}

/** Whether bill download is allowed for this order. */
export function isFoodOrderBillEligible(input: {
  paymentStatus?: string | null;
  status?: string | null;
}): boolean {
  const ps = String(input.paymentStatus || "").toUpperCase();
  const st = String(input.status || "").toUpperCase();

  if (["SUCCESS", "PAID", "AUTHORIZED"].includes(ps)) return true;
  if (
    [
      "PAID",
      "CONFIRMED",
      "PROCESSING",
      "PACKED",
      "SHIPPED",
      "OUT_FOR_DELIVERY",
      "DELIVERED",
    ].includes(st)
  ) {
    return true;
  }
  return false;
}