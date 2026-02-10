/**
 * Profile Page - Erweiterte Profilseite mit mehr Inhalten
 */
import { useState } from "react";
import { MainLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useRole } from "@/contexts/RoleContext";
import { useSubscriptions } from "@/contexts/SubscriptionContext";
import { toast } from "sonner";
import {
    User,
    Home,
    Crown,
    Save,
    Bell,
    Shield,
    CreditCard,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Wallet,
    TrendingUp,
    Settings,
    Download,
    Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Profile() {
    const { currentRole, householdSize, setHouseholdSize } = useRole();
    const { stats: subStats, subscriptions } = useSubscriptions();

    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        sms: false,
        reminders: true,
        newsletter: false,
    });

    const handleSave = () => {
        toast.success("Profil gespeichert", {
            description: "Deine Änderungen wurden erfolgreich gespeichert.",
        });
    };

    const handleExportData = () => {
        toast.success("Export gestartet", {
            description: "Du erhältst deine Daten per E-Mail.",
        });
    };

    // Berechne "Gespart" (Simuliert: Inaktive Abos * Monate seit Jahresbeginn)
    // Da wir keine Historie haben, ist das eine Schätzung
    const inactiveSubs = subscriptions.filter(s => !s.isActive);
    const savedThisYear = inactiveSubs.reduce((sum, sub) => sum + sub.price, 0) * (new Date().getMonth() + 1);

    const stats = {
        totalSubscriptions: subStats.activeSubscriptions,
        monthlySpending: subStats.totalMonthly,
        savedThisYear: savedThisYear,
        memberSince: "März 2024", // Statisch lassen oder vom User-Objekt holen wenn verfügbar
    };

    return (
        <MainLayout>
            <div className="container py-8 max-w-4xl">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Mein Profil</h1>
                        <p className="text-muted-foreground">Verwalte deine persönlichen Daten und Einstellungen</p>
                    </div>
                    <Button onClick={handleSave}>
                        <Save className="mr-2 h-4 w-4" />
                        Speichern
                    </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {/* Left Column - Main Content */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Personal Data */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Persönliche Daten
                                </CardTitle>
                                <CardDescription>
                                    Deine grundlegenden Kontoinformationen
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">Vorname</Label>
                                        <Input id="firstName" defaultValue="Max" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Nachname</Label>
                                        <Input id="lastName" defaultValue="Mustermann" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        E-Mail
                                    </Label>
                                    <Input id="email" type="email" defaultValue="max@example.com" />
                                </div>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="phone" className="flex items-center gap-2">
                                            <Phone className="h-4 w-4 text-muted-foreground" />
                                            Telefon
                                        </Label>
                                        <Input id="phone" type="tel" defaultValue="+49 123 456789" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="location" className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-muted-foreground" />
                                            Standort
                                        </Label>
                                        <Input id="location" defaultValue="Berlin, Deutschland" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Household Settings */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Home className="h-5 w-5" />
                                    Haushalt
                                </CardTitle>
                                <CardDescription>
                                    Für die Pro-Kopf-Berechnung deiner Abo-Kosten
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="household">Haushaltsgröße</Label>
                                        <Input
                                            id="household"
                                            type="number"
                                            min="1"
                                            max="20"
                                            value={householdSize}
                                            onChange={(e) => setHouseholdSize(parseInt(e.target.value) || 1)}
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Anzahl der Personen, die deine Abos mitnutzen
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Kosten pro Person</Label>
                                        <div className="text-2xl font-bold text-primary">
                                            {(stats.monthlySpending / householdSize).toFixed(2)}€
                                            <span className="text-sm text-muted-foreground font-normal ml-1">/Monat</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Notification Settings */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Bell className="h-5 w-5" />
                                    Benachrichtigungen
                                </CardTitle>
                                <CardDescription>
                                    Wähle, wie du informiert werden möchtest
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>E-Mail Benachrichtigungen</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Erhalte wichtige Updates per E-Mail
                                        </p>
                                    </div>
                                    <Switch
                                        checked={notifications.email}
                                        onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                                    />
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Push-Benachrichtigungen</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Browser-Benachrichtigungen für Erinnerungen
                                        </p>
                                    </div>
                                    <Switch
                                        checked={notifications.push}
                                        onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
                                    />
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>SMS-Benachrichtigungen</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Dringende Erinnerungen per SMS
                                        </p>
                                    </div>
                                    <Switch
                                        checked={notifications.sms}
                                        onCheckedChange={(checked) => setNotifications({ ...notifications, sms: checked })}
                                    />
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Erinnerungen vor Zahlungen</Label>
                                        <p className="text-sm text-muted-foreground">
                                            3 Tage vor jeder Abo-Zahlung benachrichtigen
                                        </p>
                                    </div>
                                    <Switch
                                        checked={notifications.reminders}
                                        onCheckedChange={(checked) => setNotifications({ ...notifications, reminders: checked })}
                                    />
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Newsletter</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Tipps zum Geld sparen und neue Features
                                        </p>
                                    </div>
                                    <Switch
                                        checked={notifications.newsletter}
                                        onCheckedChange={(checked) => setNotifications({ ...notifications, newsletter: checked })}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Security & Data */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Shield className="h-5 w-5" />
                                    Sicherheit & Daten
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-lg border">
                                    <div className="flex items-center gap-3">
                                        <Settings className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="font-medium">Passwort ändern</p>
                                            <p className="text-sm text-muted-foreground">Zuletzt geändert vor 3 Monaten</p>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm">Ändern</Button>
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-lg border">
                                    <div className="flex items-center gap-3">
                                        <Download className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="font-medium">Daten exportieren</p>
                                            <p className="text-sm text-muted-foreground">Lade alle deine Daten herunter</p>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm" onClick={handleExportData}>
                                        Export
                                    </Button>
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-lg border border-red-200 bg-red-50/50 dark:border-red-900 dark:bg-red-900/10">
                                    <div className="flex items-center gap-3">
                                        <Trash2 className="h-5 w-5 text-red-500" />
                                        <div>
                                            <p className="font-medium text-red-700 dark:text-red-400">Konto löschen</p>
                                            <p className="text-sm text-red-600/80 dark:text-red-400/80">Alle Daten werden unwiderruflich gelöscht</p>
                                        </div>
                                    </div>
                                    <Button variant="destructive" size="sm">Löschen</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="space-y-6">
                        {/* Membership Card */}
                        <Card className={currentRole === "premium" ? "border-primary/50 bg-primary/5" : ""}>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Crown className={currentRole === "premium" ? "h-5 w-5 text-yellow-500" : "h-5 w-5 text-muted-foreground"} />
                                    Mitgliedschaft
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="text-center py-4">
                                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${currentRole === "premium"
                                        ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white"
                                        : currentRole === "admin"
                                            ? "bg-red-500 text-white"
                                            : "bg-muted"
                                        }`}>
                                        {currentRole === "premium" && <Crown className="h-4 w-4" />}
                                        {currentRole === "admin" && <Shield className="h-4 w-4" />}
                                        <span className="capitalize">{currentRole}</span>
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground text-center">
                                    {currentRole === "premium"
                                        ? "Alle Features freigeschaltet"
                                        : currentRole === "admin"
                                            ? "Vollständiger Admin-Zugriff"
                                            : "Upgrade für mehr Features"}
                                </p>
                                {currentRole !== "premium" && currentRole !== "admin" && (
                                    <Button className="w-full" asChild>
                                        <Link to="/pricing">
                                            <Crown className="mr-2 h-4 w-4" />
                                            Upgrade auf Premium
                                        </Link>
                                    </Button>
                                )}
                            </CardContent>
                        </Card>

                        {/* Quick Stats */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <TrendingUp className="h-5 w-5" />
                                    Deine Statistiken
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-blue-500/10">
                                        <Wallet className="h-4 w-4 text-blue-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Aktive Abos</p>
                                        <p className="font-semibold">{stats.totalSubscriptions}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-green-500/10">
                                        <CreditCard className="h-4 w-4 text-green-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Monatliche Kosten</p>
                                        <p className="font-semibold">{stats.monthlySpending.toFixed(2)}€</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-purple-500/10">
                                        <TrendingUp className="h-4 w-4 text-purple-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Gespart dieses Jahr</p>
                                        <p className="font-semibold text-green-600">{stats.savedThisYear.toFixed(2)}€</p>
                                    </div>
                                </div>
                                <Separator />
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-muted">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Mitglied seit</p>
                                        <p className="font-semibold">{stats.memberSince}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Links */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Schnellzugriff</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button variant="outline" className="w-full justify-start" asChild>
                                    <Link to="/subscriptions">
                                        <Wallet className="mr-2 h-4 w-4" />
                                        Meine Abos
                                    </Link>
                                </Button>
                                <Button variant="outline" className="w-full justify-start" asChild>
                                    <Link to="/reminders">
                                        <Bell className="mr-2 h-4 w-4" />
                                        Erinnerungen
                                    </Link>
                                </Button>
                                <Button variant="outline" className="w-full justify-start" asChild>
                                    <Link to="/analysis">
                                        <TrendingUp className="mr-2 h-4 w-4" />
                                        Analyse
                                    </Link>
                                </Button>
                                <Button variant="outline" className="w-full justify-start" asChild>
                                    <Link to="/settings">
                                        <Settings className="mr-2 h-4 w-4" />
                                        Einstellungen
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
