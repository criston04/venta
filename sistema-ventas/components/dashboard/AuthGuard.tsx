// AuthGuard component
import React from 'react';

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    return <div>{children}</div>;
};

export default AuthGuard;
