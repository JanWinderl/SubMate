/**
 * Admin Page - Admin-Bereich (A3: Nur für Admin-Rolle sichtbar)
 */
import { MainLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRole } from "@/contexts/RoleContext";
import { Link } from "react-router-dom";
import {
    Shield,
    Users,
    CreditCard,
    Database,
    Play,
    Download,
    RefreshCw,
    Lock,
} from "lucide-react";

export default function Admin() {
    const { isAdmin, currentRole } = useRole();

    if (!isAdmin) {
        return (
            <MainLayout>
                <div className="container py-8">
                    <div className="max-w-2xl mx-auto text-center py-20">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 mx-auto mb-6">
                            <Lock className="h-10 w-10 text-destructive" />
                        </div>
                        <h1 className="text-3xl font-bold mb-4">Zugriff verweigert</h1>
                        <p className="text-muted-foreground mb-8">
                            Der Admin-Bereich ist nur für Administratoren zugänglich.
                            Deine aktuelle Rolle ist: <strong>{currentRole}</strong>
                        </p>
                        <Button asChild>
                            <Link to="/dashboard">Zurück zum Dashboard</Link>
                        </Button>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="container py-8">
                <div className="flex items-center gap-3 mb-8">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
                        <Shield className="h-6 w-6 text-destructive" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Admin-Bereich</h1>
                        <p className="text-muted-foreground">
                            Systemverwaltung und Hintergrund-Jobs
                        </p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid gap-4 md:grid-cols-4 mb-8">
                    <Card>
                        <CardContent className="pt-4">
                            <div className="flex items-center gap-3">
                                <Users className="h-8 w-8 text-muted-foreground" />
                                <div>
                                    <p className="text-2xl font-bold">156</p>
                                    <p className="text-sm text-muted-foreground">Benutzer</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-4">
                            <div className="flex items-center gap-3">
                                <CreditCard className="h-8 w-8 text-muted-foreground" />
                                <div>
                                    <p className="text-2xl font-bold">1.247</p>
                                    <p className="text-sm text-muted-foreground">Abos</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-4">
                            <div className="flex items-center gap-3">
                                <Database className="h-8 w-8 text-muted-foreground" />
                                <div>
                                    <p className="text-2xl font-bold">12.5 MB</p>
                                    <p className="text-sm text-muted-foreground">Datenbank</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-4">
                            <div className="flex items-center gap-3">
                                <RefreshCw className="h-8 w-8 text-muted-foreground" />
                                <div>
                                    <p className="text-2xl font-bold">3</p>
                                    <p className="text-sm text-muted-foreground">Laufende Jobs</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Job Operations (A4) */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Hintergrund-Jobs (A4)</CardTitle>
                            <CardDescription>
                                Asynchrone Operationen starten und überwachen
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center justify-between p-3 rounded-lg border">
                                <div>
                                    <p className="font-medium">Erinnerungs-Check</p>
                                    <p className="text-sm text-muted-foreground">
                                        Prüft alle fälligen Erinnerungen
                                    </p>
                                </div>
                                <Button size="sm">
                                    <Play className="mr-2 h-4 w-4" />
                                    Starten
                                </Button>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg border">
                                <div>
                                    <p className="font-medium">Daten-Export</p>
                                    <p className="text-sm text-muted-foreground">
                                        Exportiert alle Abos als CSV
                                    </p>
                                </div>
                                <Button size="sm">
                                    <Download className="mr-2 h-4 w-4" />
                                    Export
                                </Button>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg border">
                                <div>
                                    <p className="font-medium">Kategorien seeden</p>
                                    <p className="text-sm text-muted-foreground">
                                        Erstellt Standard-Kategorien
                                    </p>
                                </div>
                                <Button size="sm" variant="outline">
                                    <Database className="mr-2 h-4 w-4" />
                                    Seeden
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* User Management */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Benutzerverwaltung</CardTitle>
                            <CardDescription>
                                Benutzer und Rollen verwalten
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center justify-between p-3 rounded-lg border">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-medium">
                                        MM
                                    </div>
                                    <div>
                                        <p className="font-medium">Max Mustermann</p>
                                        <p className="text-sm text-muted-foreground">max@example.com</p>
                                    </div>
                                </div>
                                <span className="px-2 py-1 rounded-full text-xs bg-muted">user</span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg border">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-warning/10 flex items-center justify-center text-warning text-sm font-medium">
                                        LM
                                    </div>
                                    <div>
                                        <p className="font-medium">Lisa Musterfrau</p>
                                        <p className="text-sm text-muted-foreground">lisa@example.com</p>
                                    </div>
                                </div>
                                <span className="px-2 py-1 rounded-full text-xs bg-warning/10 text-warning">premium</span>
                            </div>
                            <Button variant="outline" className="w-full">
                                <Users className="mr-2 h-4 w-4" />
                                Alle Benutzer anzeigen
                            </Button>
                        </CardContent>
                    </Card>

                    {/* API Documentation */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>API-Dokumentation</CardTitle>
                            <CardDescription>
                                Swagger UI für alle API-Endpunkte
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="p-6 rounded-lg bg-muted text-center">
                                <p className="mb-4">Die vollständige API-Dokumentation ist unter folgender URL verfügbar:</p>
                                <a
                                    href="http://localhost:3000/api"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-primary hover:underline font-mono"
                                >
                                    http://localhost:3000/api
                                </a>
                                <p className="text-sm text-muted-foreground mt-4">
                                    Alle CRUD-Operationen, Aktionen und Jobs können direkt über Swagger getestet werden.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </MainLayout>
    );
}
