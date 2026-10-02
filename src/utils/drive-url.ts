// /** Convert Google Drive share/view links to a browser-loadable image URL. */
// export function toDriveDirectUrl(url: string): string {
//   const s = String(url || "").trim();
//   if (!s) return s;

//   if (s.includes("drive.google.com/uc?")) return s;

//   const fileMatch = s.match(/drive\.google\.com\/file\/d\/([^/]+)/);
//   if (fileMatch?.[1]) {
//     return `https://drive.google.com/uc?export=view&id=${fileMatch[1]}`;
//   }

//   const openMatch = s.match(/drive\.google\.com\/open\?[^#]*id=([^&]+)/);
//   if (openMatch?.[1]) {
//     return `https://drive.google.com/uc?export=view&id=${openMatch[1]}`;
//   }

//   const idMatch = s.match(/[?&]id=([^&]+)/);
//   if (idMatch?.[1] && s.includes("drive.google.com")) {
//     return `https://drive.google.com/uc?export=view&id=${idMatch[1]}`;
//   }

//   return s;
// }

/**
 * Convert Google Drive share/view links to a URL that works in <img src>.
 * Prefer thumbnail CDN — uc?export=view often fails in browsers.
 */
export function extractDriveFileId(url: string): string | null {
  const s = String(url || "").trim();
  if (!s || !s.includes("drive.google.com")) return null;

  const fileMatch = s.match(/\/file\/d\/([^/]+)/);
  if (fileMatch?.[1]) return fileMatch[1];

  const openMatch = s.match(/[?&]id=([^&]+)/);
  if (openMatch?.[1]) return openMatch[1];

  return null;
}

/** Browser-loadable image URL for Drive (or original if not Drive). */
export function toDriveDirectUrl(url: string): string {
  const s = String(url || "").trim();
  if (!s) return s;

  // Already a thumbnail URL
  if (s.includes("drive.google.com/thumbnail?")) return s;

  const id = extractDriveFileId(s);
  if (id) {
    // sz=w2000 keeps good quality for popup
    return `https://drive.google.com/thumbnail?id=${id}&sz=w2000`;
  }

  // Non-Drive: return as-is
  return s;
}

/** Optional fallback if thumbnail fails */
export function toDriveUcViewUrl(url: string): string {
  const id = extractDriveFileId(url);
  if (id) return `https://drive.google.com/uc?export=view&id=${id}`;
  return String(url || "").trim();
}