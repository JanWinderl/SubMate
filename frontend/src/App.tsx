import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { RoleProvider } from "@/contexts/RoleContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import { ScrollToTop } from "@/components/ScrollToTop";

// Pages
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import Subscriptions from "@/pages/Subscriptions";
import SubscriptionDetail from "@/pages/SubscriptionDetail";
import Analysis from "@/pages/Analysis";
import Reminders from "@/pages/Reminders";
import Categories from "@/pages/Categories";
import Admin from "@/pages/Admin";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import Help from "@/pages/Help";
import Login from "@/pages/Login";
import Pricing from "@/pages/Pricing";
import AGB from "@/pages/AGB";
import Datenschutz from "@/pages/Datenschutz";
import Impressum from "@/pages/Impressum";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            retry: 1,
        },
    },
});

const App = () => (
    <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <RoleProvider>
                <SubscriptionProvider>
                    <Toaster position="top-right" richColors />
                    <BrowserRouter>
                        <ScrollToTop />
                        <Routes>
                            <Route path="/" element={<Index />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/subscriptions" element={<Subscriptions />} />
                            <Route path="/subscriptions/:id" element={<SubscriptionDetail />} />
                            <Route path="/analysis" element={<Analysis />} />
                            <Route path="/reminders" element={<Reminders />} />
                            <Route path="/categories" element={<Categories />} />
                            <Route path="/admin" element={<Admin />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/settings" element={<Settings />} />
                            <Route path="/help" element={<Help />} />
                            <Route path="/pricing" element={<Pricing />} />
                            <Route path="/agb" element={<AGB />} />
                            <Route path="/datenschutz" element={<Datenschutz />} />
                            <Route path="/impressum" element={<Impressum />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </BrowserRouter>
                </SubscriptionProvider>
            </RoleProvider>
        </ThemeProvider>
    </QueryClientProvider>
);

export default App;
