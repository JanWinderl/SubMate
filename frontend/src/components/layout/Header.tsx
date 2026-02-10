/**
 * Header Component - Einheitlicher Header für alle Seiten (A1: Layout)
 * 
 * Features:
 * - Cooles Logo links
 * - Navigation mittig
 * - Mobile hamburger menu mit slide-out navigation
 * - Rollen-Switcher als Dropdown (A3: Rollensystem Frontend)
 * - Theme Toggle (Dark/Light)
 * - User Menu
 */
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "next-themes";
import { useRole } from "@/contexts/RoleContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    Sun,
    Moon,
    LayoutDashboard,
    Bell,
    PieChart,
    Shield,
    User,
    Crown,
    Wallet,
    ChevronDown,
    Menu,
    Banknote,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UserRole } from "@/types";

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Abos", href: "/subscriptions", icon: Wallet },
    { name: "Analyse", href: "/analysis", icon: PieChart, premium: true },
    { name: "Erinnerungen", href: "/reminders", icon: Bell },
    { name: "Tarife", href: "/pricing", icon: Banknote },
];

const roleLabels: Record<UserRole, { label: string; icon: React.ElementType; color: string }> = {
    user: { label: "Basis", icon: User, color: "text-muted-foreground" },
    premium: { label: "Premium", icon: Crown, color: "text-yellow-500" },
    admin: { label: "Admin", icon: Shield, color: "text-red-500" },
};

export function Header() {
    const { theme, setTheme } = useTheme();
    const { currentRole, setRole, isPremium, isAdmin } = useRole();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const CurrentRoleIcon = roleLabels[currentRole].icon;

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center">
                {/* Mobile Menu Button */}
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="md:hidden mr-2">
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Menü öffnen</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[280px] sm:w-[320px]">
                        <SheetHeader className="mb-6">
                            <SheetTitle>
                                <Link
                                    to="/"
                                    className="flex items-center gap-3"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600">
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            className="h-6 w-6 text-white"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="currentColor" opacity="0.2" />
                                            <path d="M12 6v6l4 2" />
                                            <circle cx="12" cy="12" r="3" fill="currentColor" />
                                        </svg>
                                    </div>
                                    <span className="text-xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                                        SubMate
                                    </span>
                                </Link>
                            </SheetTitle>
                        </SheetHeader>

                        {/* Mobile Navigation */}
                        <nav className="flex flex-col gap-2">
                            {navigation.map((item) => {
                                const isActive = location.pathname === item.href;
                                const isDisabled = item.premium && !isPremium;

                                return (
                                    <Link
                                        key={item.name}
                                        to={isDisabled ? "#" : item.href}
                                        onClick={(e) => {
                                            if (isDisabled) {
                                                e.preventDefault();
                                            } else {
                                                setMobileMenuOpen(false);
                                            }
                                        }}
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200",
                                            isActive
                                                ? "bg-primary/10 text-primary"
                                                : "text-muted-foreground hover:text-foreground hover:bg-muted",
                                            isDisabled && "opacity-50 cursor-not-allowed"
                                        )}
                                    >
                                        <item.icon className="h-5 w-5" />
                                        {item.name}
                                        {item.premium && !isPremium && (
                                            <Crown className="h-4 w-4 text-yellow-500 ml-auto" />
                                        )}
                                    </Link>
                                );
                            })}
                            {isAdmin && (
                                <Link
                                    to="/admin"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200",
                                        location.pathname === "/admin"
                                            ? "bg-destructive/10 text-destructive"
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                    )}
                                >
                                    <Shield className="h-5 w-5" />
                                    Admin
                                </Link>
                            )}
                        </nav>

                        {/* Mobile Role Switcher */}
                        <div className="mt-6 pt-6 border-t">
                            <p className="text-sm text-muted-foreground mb-3 px-4">Rolle wechseln</p>
                            <div className="flex flex-col gap-1">
                                {(Object.keys(roleLabels) as UserRole[]).map((role) => {
                                    const { label, icon: Icon, color } = roleLabels[role];
                                    const isActive = currentRole === role;

                                    return (
                                        <button
                                            key={role}
                                            onClick={() => {
                                                setRole(role);
                                                setMobileMenuOpen(false);
                                            }}
                                            className={cn(
                                                "flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 w-full text-left",
                                                isActive ? "bg-muted" : "hover:bg-muted"
                                            )}
                                        >
                                            <Icon className={cn("h-5 w-5", color)} />
                                            <span className={color}>{label}</span>
                                            {isActive && (
                                                <span className="ml-auto text-sm text-muted-foreground">✓</span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>

                {/* Logo - Links */}
                <div className="flex items-center mr-4 md:mr-8">
                    <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
                        {/* Cooles Gradient Logo */}
                        <div className="relative flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 shadow-lg shadow-purple-500/25 group-hover:shadow-purple-500/40 transition-all duration-300 group-hover:scale-105">
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                className="h-5 w-5 sm:h-6 sm:w-6 text-white"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="currentColor" opacity="0.2" />
                                <path d="M12 6v6l4 2" />
                                <circle cx="12" cy="12" r="3" fill="currentColor" />
                                <path d="M2 12h2M20 12h2M12 2v2M12 20v2" strokeWidth="1.5" opacity="0.5" />
                            </svg>
                            {/* Glow Effect */}
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-400 to-indigo-500 opacity-0 group-hover:opacity-20 blur transition-opacity duration-300" />
                        </div>
                        <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                            SubMate
                        </span>
                    </Link>
                </div>

                {/* Navigation - Mittig (Desktop only) */}
                <nav className="hidden md:flex items-center justify-center flex-1">
                    <div className="flex items-center gap-2">
                        {navigation.map((item) => {
                            const isActive = location.pathname === item.href;
                            const isDisabled = item.premium && !isPremium;

                            return (
                                <Link
                                    key={item.name}
                                    to={isDisabled ? "#" : item.href}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                                        isActive
                                            ? "bg-primary/10 text-primary shadow-sm"
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted",
                                        isDisabled && "opacity-50 cursor-not-allowed"
                                    )}
                                    onClick={(e: React.MouseEvent) => isDisabled && e.preventDefault()}
                                >
                                    <item.icon className="h-4 w-4" />
                                    {item.name}
                                    {item.premium && !isPremium && (
                                        <Crown className="h-3 w-3 text-yellow-500" />
                                    )}
                                </Link>
                            );
                        })}
                        {isAdmin && (
                            <Link
                                to="/admin"
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                                    location.pathname === "/admin"
                                        ? "bg-destructive/10 text-destructive shadow-sm"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                )}
                            >
                                <Shield className="h-4 w-4" />
                                Admin
                            </Link>
                        )}
                    </div>
                </nav>

                {/* Right side */}
                <div className="flex items-center gap-2 sm:gap-3 ml-auto">

                    {/* Role Switcher Dropdown (Desktop only) */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="hidden md:flex items-center gap-2">
                                <CurrentRoleIcon className={cn("h-4 w-4", roleLabels[currentRole].color)} />
                                <span className={cn("hidden lg:inline", roleLabels[currentRole].color)}>
                                    {roleLabels[currentRole].label}
                                </span>
                                <ChevronDown className="h-3 w-3 opacity-50" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>Rolle wechseln</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {(Object.keys(roleLabels) as UserRole[]).map((role) => {
                                const { label, icon: Icon, color } = roleLabels[role];
                                const isActive = currentRole === role;

                                return (
                                    <DropdownMenuItem
                                        key={role}
                                        onClick={() => setRole(role)}
                                        className={cn(
                                            "flex items-center gap-2 cursor-pointer",
                                            isActive && "bg-muted"
                                        )}
                                    >
                                        <Icon className={cn("h-4 w-4", color)} />
                                        <span className={color}>{label}</span>
                                        {isActive && (
                                            <span className="ml-auto text-xs text-muted-foreground">✓</span>
                                        )}
                                    </DropdownMenuItem>
                                );
                            })}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Theme Toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="hover:bg-muted"
                    >
                        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Theme wechseln</span>
                    </Button>

                    {/* User Avatar */}
                    <Link to="/profile">
                        <Avatar className="h-8 w-8 sm:h-9 sm:w-9 cursor-pointer hover:ring-2 hover:ring-primary transition-all">
                            <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-600 text-white">
                                <CurrentRoleIcon className="h-4 w-4" />
                            </AvatarFallback>
                        </Avatar>
                    </Link>
                </div>
            </div>
        </header>
    );
}
