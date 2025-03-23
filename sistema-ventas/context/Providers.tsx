// Combined context providers
import React from 'react';
import { AuthProvider } from './AuthContext';
import FirestoreProviderComponent from './FirestoreProvider';

const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <AuthProvider>
            <FirestoreProviderComponent>
                {children}
            </FirestoreProviderComponent>
        </AuthProvider>
    );
};

export default Providers;
