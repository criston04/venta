// Main application layout
import React from 'react';
import Providers from '../context/Providers.tsx';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <Providers>
            <div>{children}</div>
        </Providers>
    );
};

export default Layout;
