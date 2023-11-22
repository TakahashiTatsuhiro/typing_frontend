// https://masa-engineer-blog.com/react-state-manage-with-context/
import { createContext, useState, useContext, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  userId:number;
  setUserId:React.Dispatch<React.SetStateAction<number>>;
  userName: string;
  setUserName: React.Dispatch<React.SetStateAction<string>>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<number>(-1);
  const [userName, setUserName] = useState('');

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUserName('');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, userId, setUserId, userName, setUserName }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext) as AuthContextType;
