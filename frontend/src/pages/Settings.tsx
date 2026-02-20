import { MainLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Moon, Globe, Shield } from "lucide-react";

export default function Settings() {
    return (
        <MainLayout>
            <div className="container py-8 max-w-2xl">
                <h1 className="text-3xl font-bold mb-8">Einstellungen</h1>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bell className="h-5 w-5" />
                                Benachrichtigungen
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">E-Mail Erinnerungen</p>
                                    <p className="text-sm text-muted-foreground">Bei fälligen Abos benachrichtigen</p>
                                </div>
                                <Button variant="outline" size="sm">Aktiv</Button>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Browser-Benachrichtigungen</p>
                                    <p className="text-sm text-muted-foreground">Push-Benachrichtigungen im Browser</p>
                                </div>
                                <Button variant="outline" size="sm">Aktivieren</Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Moon className="h-5 w-5" />
                                Erscheinungsbild
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Dark Mode</p>
                                    <p className="text-sm text-muted-foreground">Wechsle zwischen Hell und Dunkel</p>
                                </div>
                                <Button variant="outline" size="sm">System</Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Globe className="h-5 w-5" />
                                Sprache & Region
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Sprache</p>
                                    <p className="text-sm text-muted-foreground">Deutsch (Deutschland)</p>
                                </div>
                                <Button variant="outline" size="sm">Ändern</Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-destructive/50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-destructive">
                                <Shield className="h-5 w-5" />
                                Gefahrenzone
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Account löschen</p>
                                    <p className="text-sm text-muted-foreground">Alle Daten unwiderruflich entfernen</p>
                                </div>
                                <Button variant="destructive" size="sm">Löschen</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </MainLayout>
    );
}
