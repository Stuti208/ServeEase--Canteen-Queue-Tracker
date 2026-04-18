export const getUser = () => {
  const token = localStorage.getItem('token')
  if (!token) return null
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    if (payload.exp * 1000 < Date.now()) {
      localStorage.removeItem('token')
      return null
    }
    return payload   // { id, name, role }
  } catch {
    return null
  }
}

export const getToken = () => localStorage.getItem('token')

export const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('customerName')
  localStorage.removeItem('orderIds')
}
