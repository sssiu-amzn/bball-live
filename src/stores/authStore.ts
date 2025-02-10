import {create} from 'zustand'

interface AuthStore {
  isAuthenticated: boolean
  login: (username: string, password: string) => boolean
  logout: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  login: (username, password) => {
    // Simple authentication - replace with real auth logic
    if (username === 'admin' && password === 'password') {
      set({ isAuthenticated: true })
      return true
    }
    return false
  },
  logout: () => set({ isAuthenticated: false })
}))