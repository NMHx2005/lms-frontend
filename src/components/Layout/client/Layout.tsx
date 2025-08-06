import React from 'react';
import "./style.css";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
            <>
            <main>
                {children}
            </main>
        </>

    );
};

export default Layout;