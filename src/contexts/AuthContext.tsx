import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface AuthContextProps {
  loggedIn: boolean;
  user: object | null;
  logIn(): Promise<void>;
  logOut(): void;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export function AuthProvider({ children }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<object | null>(null);

  useEffect(()=>{
    const cachedData = JSON.parse(localStorage.getItem("@worldtrip"))

    cachedData.useLoggedIn && setLoggedIn(true);
  },[])

  async function logIn() {
    setLoggedIn(true);
    localStorage.setItem("@worldtrip", JSON.stringify({ useLoggedIn: true }))
  }

  function logOut() {
    setLoggedIn(false);
    localStorage.setItem("@worldtrip", JSON.stringify({ useLoggedIn: false }))
  }

  return (
    <AuthContext.Provider value={{loggedIn, user, logIn, logOut}}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)