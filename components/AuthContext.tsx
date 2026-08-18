import React, { createContext, useContext, useState } from 'react'; 

const AuthContext = createContext({
  user: null as any,
  isNewUser: true,
  login: async (email: string, password: string) => {},
  register: async (email: string, password: string, displayName: string) => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [isNewUser, setIsNewUser] = useState(true);

  const login = async (email: string, password: string) => {
    setUser({ email });
    setIsNewUser(false);
  };

  const register = async (email: string, password: string, displayName: string) => {
    setUser({ email, displayName });
    setIsNewUser(false);
  };

  const logout = async () => {
    setUser(null);
    setIsNewUser(true);
  };

  return (
    <AuthContext.Provider value={{ user, isNewUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);