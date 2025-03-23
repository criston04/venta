// Firestore context provider
import React, { createContext, useContext } from 'react';

const FirestoreContext = createContext<{ data?: any } | null>(null);


export const FirestoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const value = {}; // Define the context value here

    return <FirestoreContext.Provider value={{}}>{children}</FirestoreContext.Provider>;
};

export const useFirestore = () => useContext(FirestoreContext);
