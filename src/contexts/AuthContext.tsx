import { createContext, useContext, useEffect, useState } from "react";
import { destroyCookie, parseCookies, setCookie } from 'nookies'

import { User } from '../types'
import { api } from "../services/api";
import { Toast, useToast } from "@chakra-ui/react";

interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  logIn(user: string, email: string): Promise<boolean>;
  logOut(): void;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export function AuthProvider({ children }) {
  const [user, setUser] = useState<User | undefined>();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const toast = useToast()

  async function getUser() {
    return await api.get('/users').then((response) => response.data)
  }

  useEffect(() => {
    const { '@worldtrip.token': token } = parseCookies()

    if (token) {
      setIsAuthenticated(true)

      getUser().then(response => setUser(response))
    }
  },[])

  async function logIn(email: string, password: string) {
    try {
      const response = await api.post('/login', {email, password})

      if (response.status === 200) {
        const { user, token } = response.data

        setUser(user)
        setIsAuthenticated(true)

        setCookie(undefined, '@worldtrip.token', token)

        return true
      } else {
        throw new Error()
      }
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
    setIsAuthenticated(false)
    setUser(undefined)
    destroyCookie(undefined, '@worldtrip.token')
  }

  return (
    <AuthContext.Provider value={{user, isAuthenticated, logIn, logOut}}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)