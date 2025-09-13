export const getToken = (): string | null => {
  if (typeof window === "undefined") return null

  const token = localStorage.getItem("token")
  if (!token) return null

  // Clean any extra quotes that might be stored
  return token.replace(/^["']|["']$/g, "")
}

export const setToken = (token: string): void => {
  if (typeof window === "undefined") return
  localStorage.setItem("token", token)
}

export const removeToken = (): void => {
  if (typeof window === "undefined") return
  localStorage.removeItem("token")
}
