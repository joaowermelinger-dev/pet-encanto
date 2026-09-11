// Estado global de autenticação.
//
// Ao montar, pergunta ao backend "quem sou eu?" (GET /api/auth/me). Se houver
// cookie de sessão válido, o usuário é carregado; senão, `user` fica null.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useQueryClient } from '@tanstack/react-query'
import * as authApi from '../api/auth'
import { ApiError, setUnauthorizedHandler } from '../api/client'
import type { User } from '../types'

interface AuthContextValue {
  user: User | null
  /** true enquanto a verificação inicial de sessão não terminou. */
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const queryClient = useQueryClient()

  useEffect(() => {
    setUnauthorizedHandler(() => {
      setUser(null)
      queryClient.clear()
    })
    return () => setUnauthorizedHandler(null)
  }, [queryClient])

  useEffect(() => {
    authApi
      .getCurrentUser()
      .then(setUser)
      .catch((error) => {
        if (!(error instanceof ApiError)) console.error(error)
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const loggedIn = await authApi.login(email, password)
    setUser(loggedIn)
  }, [])

  const logout = useCallback(async () => {
    await authApi.logout()
    setUser(null)
    queryClient.clear()
  }, [queryClient])

  const value = useMemo(() => ({ user, loading, login, logout }), [user, loading, login, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth precisa estar dentro de <AuthProvider>')
  }
  return context
}
