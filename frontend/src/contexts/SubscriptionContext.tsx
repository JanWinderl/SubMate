/**
 * Subscription Context - Globaler State für Abonnements
 * 
 * Ermöglicht automatische Aktualisierung der Zahlen in Dashboard und anderen Seiten.
 */
import { createContext, useContext, useState, ReactNode, useMemo, useEffect } from "react";
import { BillingCycle } from "@/types";
import { api } from "@/lib/api";

export interface Subscription {
    id: string;
    name: string;
    price: number;
    billingCycle: BillingCycle;
    category: string;
    nextBillingDate: string;
    isActive: boolean;
    color: string;
}

interface SubscriptionStats {
    totalMonthly: number;
    totalYearly: number;
    activeSubscriptions: number;
    upcomingPayments: number;
}

interface SubscriptionContextType {
    subscriptions: Subscription[];
    stats: SubscriptionStats;
    addSubscription: (subscription: Omit<Subscription, "id">) => Promise<void>;
    updateSubscription: (id: string, subscription: Partial<Subscription>) => Promise<void>;
    deleteSubscription: (id: string) => Promise<void>;
    getSubscriptionById: (id: string) => Subscription | undefined;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

// Feste Demo-ID für Entwicklung, damit Daten sichtbar bleiben
// Muss eine valide UUID sein
const DEMO_USER_ID = "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d";

// Initiale Daten - leer, wird vom Backend geladen
const initialSubscriptions: Subscription[] = [];

// Hilfsfunktion: Monatlichen Preis berechnen
function getMonthlyPrice(price: number, cycle: BillingCycle): number {
    switch (cycle) {
        case "weekly": return price * 4.33;
        case "monthly": return price;
        case "quarterly": return price / 3;
        case "yearly": return price / 12;
        default: return price;
    }
}

// Hilfsfunktion: Tage bis Datum
function getDaysUntil(dateStr: string): number {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function SubscriptionProvider({ children }: { children: ReactNode }) {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>(initialSubscriptions);
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

    // Lade Abonnements & Kategorien vom Backend beim ersten Mount
    useEffect(() => {
        const loadData = async () => {
            try {
                // 1. Kategorien laden (für Mapping)
                const cats = await api.categories.getAll();
                // @ts-ignore
                setCategories(cats);

                // 2. Abos laden
                // Nutze Demo-User-ID, damit persistente Daten geladen werden
                const data = await api.subscriptions.getAll("user", DEMO_USER_ID);

                // Backend gibt Relationen zurück (category ist Objekt), Frontend erwartet String
                const mappedData = (data as any[]).map(sub => ({
                    ...sub,
                    category: typeof sub.category === 'object' ? sub.category?.name || "Sonstiges" : sub.category,
                }));

                setSubscriptions(mappedData as Subscription[]);
            } catch (error) {
                console.error("Failed to load data:", error);
            }
        };
        loadData();
    }, []);

    // Berechnete Statistiken
    const stats = useMemo<SubscriptionStats>(() => {
        const activeSubscriptions = subscriptions.filter(s => s.isActive);

        const totalMonthly = activeSubscriptions.reduce((sum, sub) => {
            return sum + getMonthlyPrice(sub.price, sub.billingCycle);
        }, 0);

        const upcomingPayments = activeSubscriptions.filter(s => {
            const days = getDaysUntil(s.nextBillingDate);
            return days >= 0 && days <= 7;
        }).length;

        return {
            totalMonthly,
            totalYearly: totalMonthly * 12,
            activeSubscriptions: activeSubscriptions.length,
            upcomingPayments,
        };
    }, [subscriptions]);

    const getCategoryIdByName = (name?: string): string => {
        if (!name) return categories[0]?.id || ""; // Fallback
        const cat = categories.find(c => c.name === name);
        // Fallback auf erste Kategorie oder leeren String (sollte im Idealfall nicht passieren)
        return cat ? cat.id : categories[0]?.id || "";
    };

    const addSubscription = async (subscription: Omit<Subscription, "id">) => {
        try {
            const categoryId = getCategoryIdByName(subscription.category);

            const payload = {
                ...subscription,
                userId: DEMO_USER_ID,
                categoryId // Backend erwartet categoryId
            };

            // 'category' Property entfernen, da Backend DTO es nicht erwartet
            // @ts-ignore
            delete payload.category;

            const created = await api.subscriptions.create(payload) as any;

            // Backend validiert und speichert. Wir fügen es lokal hinzu.
            // Wir müssen 'created' (aus Backend) wieder für Frontend mappen
            const newSub: Subscription = {
                ...created,
                category: subscription.category // Wir wissen den Namen ja
            };

            setSubscriptions(prev => [...prev, newSub]);
        } catch (error) {
            console.error("Failed to add subscription:", error);
            throw error;
        }
    };

    const updateSubscription = async (id: string, updates: Partial<Subscription>) => {
        try {
            // Nur erlaubte Felder ins Payload packen (keine readonly Felder wie id, createdAt, etc.)
            const payload: any = {};

            // Erlaubte Felder kopieren
            const allowedFields = ['name', 'price', 'billingCycle', 'nextBillingDate', 'isActive', 'notes', 'color'];
            allowedFields.forEach(field => {
                if (updates[field as keyof Subscription] !== undefined) {
                    payload[field] = updates[field as keyof Subscription];
                }
            });

            // Wenn Kategorie geändert wurde, ID mappen
            if (updates.category) {
                payload.categoryId = getCategoryIdByName(updates.category);
            }

            // Backend-API aufrufen (UserId übergeben für Berechtigungsprüfung im Service)
            await api.subscriptions.update(id, payload, "user", DEMO_USER_ID);

            setSubscriptions(prev =>
                prev.map(sub => (sub.id === id ? { ...sub, ...updates } : sub))
            );
        } catch (error) {
            console.error("Failed to update subscription:", error);
            throw error;
        }
    };

    const deleteSubscription = async (id: string) => {
        try {
            // Backend-API aufrufen
            await api.subscriptions.delete(id, "user", DEMO_USER_ID);
            setSubscriptions(prev => prev.filter(sub => sub.id !== id));
        } catch (error) {
            console.error("Failed to delete subscription:", error);
            throw error;
        }
    };

    const getSubscriptionById = (id: string) => {
        return subscriptions.find(sub => sub.id === id);
    };

    return (
        <SubscriptionContext.Provider
            value={{
                subscriptions,
                stats,
                addSubscription,
                updateSubscription,
                deleteSubscription,
                getSubscriptionById,
            }}
        >
            {children}
        </SubscriptionContext.Provider>
    );
}

export function useSubscriptions() {
    const context = useContext(SubscriptionContext);
    if (!context) {
        throw new Error("useSubscriptions must be used within a SubscriptionProvider");
    }
    return context;
}
