import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import SetCookie from 'nookies'

import { User } from '../types/User'
import { api } from "../services/api";

interface AuthContextProps {
  loggedIn: boolean;
  user: User | null;
  logIn(user: string, email: string): Promise<boolean>;
  logOut(): void;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export function AuthProvider({ children }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(()=>{
    const cachedData = JSON.parse(localStorage.getItem(`@worldtrip:${user?.email}`))

    if (cachedData) {
      cachedData.loggedIn ? setLoggedIn(true) : setLoggedIn(false);
    }

    // user ? setLoggedIn(true) : setLoggedIn(false)
  },[])

  async function logIn(email: string, password: string) {
    const response = await api.post('/login', {email, password})

    if (response.status === 200) {
      setLoggedIn(true)

      setUser(response.data)

      // SetCookie(undefined, '@worldtrip:token', token, {
      //   maxAge: 60 * 60 * 24 * 15 // 15 Dias
      // })

      const cachedData = JSON.parse(localStorage.getItem(`@worldtrip:${email}`))
 
      cachedData ? 
        localStorage.setItem(`@worldtrip:${email}`, JSON.stringify({...cachedData, loggedIn: true })) 
      :
        localStorage.setItem(`@worldtrip:${email}`, JSON.stringify({user: response.data, loggedIn: true }))       

      return true
    } else {
      return false
    }
  }

  function logOut() {
    setLoggedIn(false);

    const cachedData = JSON.parse(localStorage.getItem(`@worldtrip:${user.email}`))

    localStorage.setItem(`@worldtrip:${user.email}`, JSON.stringify({...cachedData, loggedIn: false }))
  }

  return (
    <AuthContext.Provider value={{loggedIn, user, logIn, logOut}}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)