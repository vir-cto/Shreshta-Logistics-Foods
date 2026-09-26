/** Convert Google Drive share/view links to a browser-loadable image URL. */
export function toDriveDirectUrl(url: string): string {
  const s = String(url || "").trim();
  if (!s) return s;

  if (s.includes("drive.google.com/uc?")) return s;

  const fileMatch = s.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (fileMatch?.[1]) {
    return `https://drive.google.com/uc?export=view&id=${fileMatch[1]}`;
  }

  const openMatch = s.match(/drive\.google\.com\/open\?[^#]*id=([^&]+)/);
  if (openMatch?.[1]) {
    return `https://drive.google.com/uc?export=view&id=${openMatch[1]}`;
  }

  const idMatch = s.match(/[?&]id=([^&]+)/);
  if (idMatch?.[1] && s.includes("drive.google.com")) {
    return `https://drive.google.com/uc?export=view&id=${idMatch[1]}`;
  }

  return s;
}