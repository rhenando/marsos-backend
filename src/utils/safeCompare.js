// src/utils/safeCompare.js
export default function safeCompare(a = "", b = "") {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    // compare nonetheless to avoid leaking length via timing
    const tmp = Buffer.concat([
      bufA,
      Buffer.alloc(Math.abs(bufA.length - bufB.length)),
    ]);
    return crypto.timingSafeEqual(tmp, bufB);
  }
  return crypto.timingSafeEqual(bufA, bufB);
}
