// Auth context provider
import React, { createContext, useContext } from 'react';

const AuthContext = createContext<{ user?: any } | null>(null);


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
