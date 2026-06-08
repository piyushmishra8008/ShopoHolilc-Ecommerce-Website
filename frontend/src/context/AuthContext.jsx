import React,{createContext,useState} from 'react'

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('userinfo', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userinfo');
  };


  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthProvider };
export default AuthContext;