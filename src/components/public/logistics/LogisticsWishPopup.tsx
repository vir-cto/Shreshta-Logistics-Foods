// "use client";

// import { useEffect, useState } from "react";

// type Props = {
//   enabled: boolean;
//   imageUrl: string;
//   title?: string;
// };

// /**
//  * Full-screen announcement image.
//  * Does NOT persist "dismissed" in localStorage — refresh shows it again
//  * while still enabled in admin settings.
//  */
// export default function LogisticsWishPopup({
//   enabled,
//   imageUrl,
//   title,
// }: Props) {
//   const [open, setOpen] = useState(false);

//   useEffect(() => {
//     const url = (imageUrl || "").trim();
//     setOpen(Boolean(enabled && url));
//   }, [enabled, imageUrl]);

//   function close() {
//     setOpen(false);
//   }

//   if (!open || !(imageUrl || "").trim()) return null;

//   return (
//     <div
//       className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4"
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
//           <div className="border-b border-cyan-100 bg-cyan-50 px-4 py-3 pr-12 text-center text-sm font-bold text-[#06284c]">
//             {title}
//           </div>
//         ) : null}

//         {/* eslint-disable-next-line @next/next/no-img-element */}
//         <img
//           src={imageUrl}
//           alt={title || "Announcement"}
//           className="max-h-[80vh] w-full object-contain"
//         />
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useMemo, useState } from "react";
import { toDriveDirectUrl } from "@/utils/drive-url";

type Props = {
  enabled: boolean;
  imageUrl: string;
  title?: string;
};

export default function LogisticsWishPopup({
  enabled,
  imageUrl,
  title,
}: Props) {
  const [open, setOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  const src = useMemo(() => toDriveDirectUrl(imageUrl), [imageUrl]);

  useEffect(() => {
    setImgError(false);
    setOpen(Boolean(enabled && src));
  }, [enabled, src]);

  function close() {
    setOpen(false);
  }

  if (!open || !src) return null;

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
          <div className="border-b border-cyan-100 bg-cyan-50 px-4 py-3 pr-12 text-center text-sm font-bold text-[#06284c]">
            {title}
          </div>
        ) : null}

        {imgError ? (
          <div className="px-6 py-12 text-center text-sm text-slate-600">
            Image could not be loaded. Share the Drive file as
            &quot;Anyone with the link → Viewer&quot;.
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={src}
            src={src}
            alt={title || "Announcement"}
            className="max-h-[80vh] w-full object-contain"
            onError={() => setImgError(true)}
          />
        )}
      </div>
    </div>
  );
}