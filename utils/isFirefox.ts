export default function isFirefox() {
  try {
    if (typeof navigator !== "undefined" && /firefox/i.test(navigator.userAgent)) {
      return true
    }
  } catch { }

  return false
}