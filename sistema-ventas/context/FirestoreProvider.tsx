// Firestore provider component
import React from 'react';
import { FirestoreProvider } from './FirestoreContext';

const FirestoreProviderComponent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <FirestoreProvider>
            {children}
        </FirestoreProvider>
    );
};

export default FirestoreProviderComponent;
