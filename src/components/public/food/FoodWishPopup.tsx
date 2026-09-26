// "use client";

// import { useEffect, useState } from "react";

// type Props = {
//   enabled: boolean;
//   imageUrl: string;
//   title?: string;
// };

// const STORAGE_PREFIX = "sreshta-food-popup-dismissed:";

// export default function FoodWishPopup({ enabled, imageUrl, title }: Props) {
//   const [open, setOpen] = useState(false);

//   useEffect(() => {
//     if (!enabled || !imageUrl?.trim()) {
//       setOpen(false);
//       return;
//     }
//     try {
//       const key = STORAGE_PREFIX + imageUrl.trim();
//       if (typeof window !== "undefined" && localStorage.getItem(key) === "1") {
//         setOpen(false);
//         return;
//       }
//     } catch {
//       // ignore
//     }
//     setOpen(true);
//   }, [enabled, imageUrl]);

//   function close() {
//     setOpen(false);
//     try {
//       if (imageUrl?.trim()) {
//         localStorage.setItem(STORAGE_PREFIX + imageUrl.trim(), "1");
//       }
//     } catch {
//       // ignore
//     }
//   }

//   if (!open || !imageUrl?.trim()) return null;

//   return (
//     <div
//       className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
//       role="dialog"
//       aria-modal="true"
//       aria-label={title || "Announcement"}
//       onClick={close}
//     >
//       <div
//         className="relative max-h-[90vh] w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <button
//           type="button"
//           onClick={close}
//           aria-label="Close"
//           className="absolute right-2 top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-xl font-bold text-slate-700 shadow hover:bg-white"
//         >
//           ×
//         </button>

//         {title ? (
//           <div className="border-b border-orange-100 bg-orange-50 px-4 py-3 pr-12 text-center text-sm font-bold text-[#3b2516]">
//             {title}
//           </div>
//         ) : null}

//         {/* eslint-disable-next-line @next/next/no-img-element */}
//         <img
//           src={imageUrl}
//           alt={title || "Wish"}
//           className="max-h-[80vh] w-full object-contain"
//         />
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";

type Props = {
  enabled: boolean;
  imageUrl: string;
  title?: string;
};

const STORAGE_PREFIX = "sreshta-food-popup-dismissed:";

export default function FoodWishPopup({ enabled, imageUrl, title }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const url = (imageUrl || "").trim();
    if (!enabled || !url) {
      setOpen(false);
      return;
    }

    try {
      const key = STORAGE_PREFIX + url;
      if (
        typeof window !== "undefined" &&
        sessionStorage.getItem(key) === "1"
      ) {
        setOpen(false);
        return;
      }
    } catch {
      // ignore
    }

    setOpen(true);
  }, [enabled, imageUrl]);

  function close() {
    setOpen(false);
    try {
      const url = (imageUrl || "").trim();
      if (url) {
        sessionStorage.setItem(STORAGE_PREFIX + url, "1");
      }
    } catch {
      // ignore
    }
  }

  if (!open || !(imageUrl || "").trim()) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title || "Announcement"}
      onClick={close}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute right-2 top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-xl font-bold text-slate-700 shadow hover:bg-white"
        >
          ×
        </button>

        {title ? (
          <div className="border-b border-orange-100 bg-orange-50 px-4 py-3 pr-12 text-center text-sm font-bold text-[#3b2516]">
            {title}
          </div>
        ) : null}

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={title || "Wish"}
          className="max-h-[80vh] w-full object-contain"
        />
      </div>
    </div>
  );
}