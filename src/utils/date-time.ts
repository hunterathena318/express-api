/* eslint-disable @typescript-eslint/strict-boolean-expressions */
export function isTokenExpired (expiresAt: Date | undefined): boolean {
  if (!expiresAt) {
    return true
  }
  return new Date(expiresAt) < new Date()
}
