export default {
  manifest: ({ manifest, browser }: any) => {
    // Remove unsupported permissions for Firefox build
    if ((browser || "").startsWith("firefox")) {
      manifest.permissions = (manifest.permissions || []).filter(
        (p: string) => p !== "tabGroups" && p !== "favicon"
      )
      manifest.optional_permissions = (manifest.optional_permissions || []).filter(
        (p: string) => p !== "system.display"
      )
    }
    return manifest
  }
}
