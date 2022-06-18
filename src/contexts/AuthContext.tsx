import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { destroyCookie, parseCookies, setCookie } from 'nookies'
import { Token, User } from '../types'
import { api } from "../services/api";
import { useToast } from "@chakra-ui/react";
import { generateJWT } from "../lib/generateJWT";
import decode from 'jwt-decode'

interface AuthContextData {
  user: User;
  isAuthenticated: boolean;
  logIn(user: string, email: string): Promise<void>;
  logOut(): void;
  refreshUser(): void;
}

interface AuthContextProps {
  children: ReactNode
}

const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthContextProps) {
  const [user, setUser] = useState<User>();
  const isAuthenticated = !!user;
  const toast = useToast()

  async function logIn(email: string, password: string) {
    try {
      const response = await api.post('/login', {email, password})

      const { user, token } = response.data  

      setCookie(undefined, '@worldtrip.token', token, {
        maxAge: 60 * 60 * 24 * 7, // 7 Dias
        path: '/'
      })

      setUser(user)

      api.defaults.headers['Authorization'] = `Bearer ${token}`
    } catch (err) {
      toast({
        title: 'Falha no login',
        description:
          'E-mail ou senha inválidos, por favor, revise suas credenciais.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
    }
  }

  function logOut() {
    setUser(null)
    destroyCookie(undefined, '@worldtrip.token')
  }

  async function refreshUser() {
    try {
      
    } catch(error) {
      toast({
        title: 'Ops! Algo não ocorreu como esperado!',
        description:
          'Não foi possível atualizar o usuário localmente.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      logOut()
    }
  }

  useEffect(() => {
    const { '@worldtrip.token': token } = parseCookies()

    if (token) {
      api.get('/users').then(response => {
        const { user, newToken } = response.data

        setUser(user)

        setCookie(undefined, '@worldtrip.token', newToken)
      }).catch(() => {
        logOut()
      })
    }
  },[])

  return (
    <AuthContext.Provider value={{user, isAuthenticated, logIn, logOut, refreshUser}}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)