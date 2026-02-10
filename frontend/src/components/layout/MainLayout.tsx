/**
 * MainLayout Component - Wrapper für alle authentifizierten Seiten
 * 
 * Features:
 * - Einheitlicher Header, Main Content und Footer
 * - Responsives Layout
 */
import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

interface MainLayoutProps {
    children: ReactNode;
    showFooter?: boolean;
}

export function MainLayout({ children, showFooter = true }: MainLayoutProps) {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            {showFooter && <Footer />}
        </div>
    );
}
