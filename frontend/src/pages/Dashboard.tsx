/**
 * Dashboard Page - Übersichtsseite (A2: Detail-Seite)
 * 
 * Zeigt:
 * - Wichtige Statistiken (automatisch aktualisiert)
 * - Aktuelle Erinnerungen
 * - Anstehende Zahlungen
 * - Sparpotenzial (Premium)
 */
import { useState } from "react";
import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useRole } from "@/contexts/RoleContext";
import { useSubscriptions } from "@/contexts/SubscriptionContext";
import {
    CreditCard,
    Bell,
    TrendingUp,
    TrendingDown,
    Calendar,
    PlusCircle,
    ArrowRight,
    Crown,
    AlertTriangle,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
} from "lucide-react";
import { formatCurrency, formatDate, getDaysUntil, getUrgencyClass } from "@/lib/utils";
import { cn } from "@/lib/utils";

import { api } from "@/lib/api";
import { useEffect } from "react";
import { ReminderData } from "@/components/dialogs/ReminderDialog";

export default function Dashboard() {
    const { isPremium, householdSize } = useRole();
    const { stats, subscriptions } = useSubscriptions();
    const [expandedReminderId, setExpandedReminderId] = useState<string | null>(null);
    const [reminders, setReminders] = useState<ReminderData[]>([]);

    const perPerson = stats.totalMonthly / (householdSize || 1);

    // Lade echte Erinnerungen
    useEffect(() => {
        const loadReminders = async () => {
            try {
                const data = await api.reminders.getAll();
                setReminders(data as ReminderData[]);
            } catch (error) {
                console.error("Failed to load reminders:", error);
            }
        };
        loadReminders();
    }, []);

    // Filtere wichtige Erinnerungen (nächste 7 Tage)
    const urgentReminders = reminders
        .filter(r => {
            const days = getDaysUntil(r.reminderDate);
            return days >= 0 && days <= 7;
        })
        .slice(0, 3); // Max 3 anzeigen

    // Berechne anstehende Zahlungen aus aktiven Abos (nächste 14 Tage)
    const upcomingPayments = subscriptions
        .filter(s => s.isActive)
        .map(s => ({
            ...s,
            daysUntil: getDaysUntil(s.nextBillingDate)
        }))
        .filter(s => s.daysUntil >= 0 && s.daysUntil <= 14)
        .sort((a, b) => a.daysUntil - b.daysUntil)
        .slice(0, 5); // Max 5 anzeigen

    // Kategorien zählen
    const categories = new Set(subscriptions.filter(s => s.isActive).map(s => s.category));

    const toggleReminder = (id: string) => {
        setExpandedReminderId(prev => prev === id ? null : id);
    };

    const getReminderTypeLabel = (type: string) => {
        switch (type) {
            case "billing": return "Zahlung";
            case "cancellation": return "Kündigung";
            case "renewal": return "Verlängerung";
            case "price_change": return "Preisänderung";
            case "custom": return "Sonstiges";
            default: return type;
        }
    };
    return (
        <MainLayout>
            <div className="container py-8">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Dashboard</h1>
                        <p className="text-muted-foreground">
                            Willkommen zurück! Hier ist deine Abo-Übersicht.
                        </p>
                    </div>
                    <Button asChild>
                        <Link to="/subscriptions">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Neues Abo hinzufügen
                        </Link>
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Monatliche Kosten</CardTitle>
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(stats.totalMonthly)}</div>
                            <p className="text-xs text-muted-foreground">
                                {formatCurrency(perPerson)}/Person ({householdSize} Personen)
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Jährliche Kosten</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(stats.totalYearly)}</div>
                            <p className="text-xs text-muted-foreground">
                                Basierend auf aktuellen Abos
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Aktive Abos</CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-success" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.activeSubscriptions}</div>
                            <p className="text-xs text-muted-foreground">
                                In {categories.size} Kategorien
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Anstehend</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{upcomingPayments.length}</div>
                            <p className="text-xs text-muted-foreground">
                                Zahlungen in 14 Tagen
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* Urgent Reminders */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bell className="h-5 w-5 text-warning" />
                                Wichtige Erinnerungen
                            </CardTitle>
                            <CardDescription>Aktionen, die deine Aufmerksamkeit erfordern</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {urgentReminders.length === 0 ? (
                                <div className="text-center py-6 text-muted-foreground">
                                    <p>Keine dringenden Erinnerungen</p>
                                    <Button variant="link" asChild className="mt-2">
                                        <Link to="/reminders">Alle anzeigen</Link>
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {urgentReminders.map((reminder) => {
                                        const days = getDaysUntil(reminder.reminderDate);
                                        const isExpanded = expandedReminderId === reminder.id;
                                        return (
                                            <div
                                                key={reminder.id}
                                                className="rounded-lg border overflow-hidden"
                                            >
                                                <div
                                                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                                                    onClick={() => toggleReminder(reminder.id!)}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <AlertTriangle className={`h-5 w-5 ${getUrgencyClass(days)}`} />
                                                        <div>
                                                            <p className="font-medium">{reminder.title}</p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {formatDate(reminder.reminderDate)} · {days > 0 ? `in ${days} Tagen` : "Heute"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Button variant="ghost" size="sm" className="gap-1">
                                                        Details
                                                        {isExpanded ? (
                                                            <ChevronUp className="h-4 w-4" />
                                                        ) : (
                                                            <ChevronDown className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                </div>
                                                {isExpanded && (
                                                    <div className="px-4 pb-4 border-t bg-muted/20">
                                                        <div className="pt-4 space-y-3">
                                                            <p className="text-sm text-muted-foreground">
                                                                {reminder.description}
                                                            </p>
                                                            <div className="flex items-center gap-4 text-sm">
                                                                <span className="text-muted-foreground">Typ:</span>
                                                                <span className={cn(
                                                                    "px-2 py-0.5 rounded-full text-xs font-medium",
                                                                    reminder.type === "cancellation" && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
                                                                    reminder.type === "billing" && "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
                                                                    reminder.type === "custom" && "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                                                                )}>
                                                                    {getReminderTypeLabel(reminder.type)}
                                                                </span>
                                                            </div>
                                                            <Button variant="outline" size="sm" asChild>
                                                                <Link to="/reminders">Zur Erinnerung</Link>
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                            <div className="mt-4">
                                <Button variant="outline" className="w-full" asChild>
                                    <Link to="/reminders">
                                        Alle Erinnerungen
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Premium CTA or Savings */}
                    {!isPremium ? (
                        <Card className="border-warning/50 bg-warning/5">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Crown className="h-5 w-5 text-warning" />
                                    Upgrade auf Premium
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-sm text-muted-foreground">
                                    Erhalte personalisierte Spartipps, detaillierte Analysen und
                                    Erinnerungen für all deine Abos.
                                </p>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-success" />
                                        Unbegrenzte Abos
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-success" />
                                        Detaillierte Kostenanalyse
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-success" />
                                        Export-Funktionen
                                    </li>
                                </ul>
                                <Button className="w-full">
                                    Jetzt upgraden
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="border-success/50 bg-success/5">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingDown className="h-5 w-5 text-success" />
                                    Einsparpotenzial
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="text-3xl font-bold text-success">
                                    {formatCurrency(stats.totalMonthly * 0.2)}
                                    <span className="text-sm font-normal text-muted-foreground">/Monat</span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Du könntest monatlich sparen, indem du ungenutzte Abos überprüfst.
                                </p>
                                <Progress value={32} className="h-2" />
                                <p className="text-xs text-muted-foreground">
                                    32% deiner Abos wurden diesen Monat nicht genutzt
                                </p>
                                <Button variant="outline" className="w-full" asChild>
                                    <Link to="/analysis">Analyse ansehen</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    {/* Upcoming Payments */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Anstehende Zahlungen
                            </CardTitle>
                            <CardDescription>Die nächsten Abbuchungen</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {upcomingPayments.length === 0 ? (
                                <div className="text-center py-6 text-muted-foreground">
                                    <p>Keine Zahlungen in den nächsten 14 Tagen</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {upcomingPayments.map((payment) => (
                                        <div
                                            key={payment.id}
                                            className="flex items-center justify-between py-2 border-b last:border-0"
                                        >
                                            <div>
                                                <p className="font-medium">{payment.name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {formatDate(payment.nextBillingDate)}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium">{formatCurrency(payment.price)}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    in {payment.daysUntil} Tagen
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Schnellaktionen</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button variant="outline" className="w-full justify-start" asChild>
                                <Link to="/subscriptions">
                                    <CreditCard className="mr-2 h-4 w-4" />
                                    Alle Abos verwalten
                                </Link>
                            </Button>
                            <Button variant="outline" className="w-full justify-start" asChild>
                                <Link to="/categories">
                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                    Kategorien bearbeiten
                                </Link>
                            </Button>
                            <Button variant="outline" className="w-full justify-start" asChild>
                                <Link to="/settings">
                                    <Bell className="mr-2 h-4 w-4" />
                                    Erinnerungen einrichten
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </MainLayout>
    );
}
