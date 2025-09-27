import { createContext, useContext, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
};

type Token = string | null;

type AuthContextType = {
  token: Token;
  addToken: (token: string) => void;
  removeToken: () => void;
};

const AuthContext = createContext<AuthContextType>({
  token: null,
  addToken: () => {},
  removeToken: () => {},
});

const AuthProvider = (props: Props) => {
  const [token, setToken] = useState<Token>(localStorage.getItem("token"));

  const addToken = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
  };

  const removeToken = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ token, addToken, removeToken }}>
      {props.children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
export { useAuth };
